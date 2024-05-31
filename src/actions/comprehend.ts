'use server';

import {
  ComprehendClient,
  type LanguageCode,
  BatchDetectSentimentCommand,
  BatchDetectDominantLanguageCommand,
} from '@aws-sdk/client-comprehend';
import { auth } from '@/../auth';
import { db } from '@/lib/db';

const comprehendClient = new ComprehendClient({
  region: process.env.AWS_COMPREHEND_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY!,
  },
});

async function detectDominantLanguage(columnData: string[]) {
  const languageCommand = new BatchDetectDominantLanguageCommand({
    TextList: columnData,
  });

  const languageResponse = await comprehendClient.send(languageCommand);
  if (
    !languageResponse ||
    !languageResponse.ResultList ||
    (languageResponse.ErrorList?.length ?? 0 > 0)
  )
    return { error: { message: 'Error while detecting language' } };

  const languageCounts: { [key: string]: number } = {};

  languageResponse.ResultList.forEach((result) => {
    if (!result.Languages) return;
    const dominantLanguage = result.Languages![0].LanguageCode;
    if (!dominantLanguage) return;
    if (dominantLanguage in languageCounts) {
      languageCounts[dominantLanguage]++;
    } else {
      languageCounts[dominantLanguage] = 1;
    }
  });

  const dominantLanguage = Object.keys(languageCounts).reduce((a, b) =>
    languageCounts[a] > languageCounts[b] ? a : b
  ) as LanguageCode;

  if (!dominantLanguage)
    return { error: { message: 'Could not detect dominant language' } };

  return { success: { dominantLanguage: dominantLanguage } };
}

export async function analyzeColumnSentiment(
  columnData: string[],
  datasetId: string
) {
  const session = await auth();
  if (!session || !session.user) return { error: { message: 'Unauthorized' } };

  const language = await detectDominantLanguage(columnData);
  if (language.error !== undefined)
    return { error: { message: 'Error while detecting language' } };

  const dominantLanguage = language.success.dominantLanguage;

  const command = new BatchDetectSentimentCommand({
    LanguageCode: dominantLanguage,
    TextList: columnData,
  });

  const sentimentResponse = await comprehendClient.send(command);
  //console.log(sentimentResponse.ResultList)

  if (
    !sentimentResponse ||
    !sentimentResponse.ResultList ||
    (sentimentResponse.ErrorList?.length ?? 0 > 0)
  )
    return { error: { message: 'Error while detecting sentiment' } };

  const existingReport = await db.report.findUnique({
    where: {
      datasetId,
      userId: session.user.id!,
    },
  });

  if (existingReport) {
    return {
      error: { message: 'Report already exists', reportId: existingReport.id },
    };
  }

  const sentimentCounts: { [key: string]: number } = {
    Mixed: 0,
    Negative: 0,
    Neutral: 0,
    Positive: 0,
  };

  const sentimentScores = sentimentResponse.ResultList.map((result) => {
    const sentiment =
      result.Sentiment!.charAt(0).toUpperCase() +
      result.Sentiment!.slice(1).toLowerCase();
    sentimentCounts[sentiment]++;
    return result.SentimentScore;
  });

  const sumSentimentScores = sentimentScores.reduce(
    (sum, score) => {
      if (!sum || !score) return;
      return {
        Mixed: sum.Mixed! + score.Mixed!,
        Negative: sum.Negative! + score.Negative!,
        Neutral: sum.Neutral! + score.Neutral!,
        Positive: sum.Positive! + score.Positive!,
      };
    },
    { Mixed: 0, Negative: 0, Neutral: 0, Positive: 0 }
  );

  const averageSentimentScores: { [key: string]: number } = {
    Mixed: sumSentimentScores!.Mixed! / sentimentScores.length,
    Negative: sumSentimentScores!.Negative! / sentimentScores.length,
    Neutral: sumSentimentScores!.Neutral! / sentimentScores.length,
    Positive: sumSentimentScores!.Positive! / sentimentScores.length,
  };

  const sentimentResult = Object.keys(averageSentimentScores).reduce((a, b) =>
    averageSentimentScores[a] > averageSentimentScores[b] ? a : b
  );

  // console.log(`Total texts analyzed: ${sentimentScores.length}`);
  // console.log(`Number of texts per sentiment:`, sentimentCounts);
  // console.log(`Average sentiment scores:`, averageSentimentScores);
  // console.log(`Final sentiment: ${sentimentResult}`);

  const report = await db.report.create({
    data: {
      sentiment: sentimentResult,
      totalTexts: sentimentScores.length,
      mixedAvgScore: averageSentimentScores.Mixed,
      negativeAvgScore: averageSentimentScores.Negative,
      neutralAvgScore: averageSentimentScores.Neutral,
      positiveAvgScore: averageSentimentScores.Positive,
      mixedTexts: sentimentCounts.Mixed,
      negativeTexts: sentimentCounts.Negative,
      neutralTexts: sentimentCounts.Neutral,
      positiveTexts: sentimentCounts.Positive,
      datasetId,
      userId: session.user.id!,
    },
  });

  if (!report) return { error: { message: 'Could not create report' } };

  return {
    success: {
      reportId: report.id,
    },
  };
}
