'use server';

import {
  ComprehendClient,
  DetectSentimentCommand,
  DetectDominantLanguageCommand,
  type LanguageCode,
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

export async function analyzeColumnSentiment(
  columnData: string[],
  datasetId: string
) {
  const session = await auth();
  if (!session || !session.user) return { error: { message: 'Unauthorized' } };

  const languageCommand = new DetectDominantLanguageCommand({
    Text: columnData.join(' '),
  });

  const languageResponse = await comprehendClient.send(languageCommand);
  if (!languageResponse || !languageResponse.Languages)
    return { error: { message: 'Error while detecting language' } };

  const language = languageResponse.Languages[0].LanguageCode as LanguageCode;
  console.log(language)

  const command = new DetectSentimentCommand({
    LanguageCode: language,
    Text: columnData.join(' '),
  });

  const response = await comprehendClient.send(command);

  if (!response.Sentiment || !response.SentimentScore)
    return { error: { message: 'Error while detecting sentiment' } };

  // console.log({
  //   sentiment: response.Sentiment,
  //   score: response.SentimentScore,
  // });

  const existingReport = await db.report.findUnique({
    where: {
      datasetId,
      userId: session.user.id!,
    }
  })

  if (existingReport) {
    return { error: { message: 'Report already exists', reportId: existingReport.id } };
  }
  
  const sentimentResult =
  response.Sentiment.toLowerCase().charAt(0).toUpperCase() +
  response.Sentiment.toLowerCase().slice(1);

  const report = await db.report.create({
    data: {
      sentiment: sentimentResult,
      mixedScore: response.SentimentScore.Mixed!,
      negativeScore: response.SentimentScore.Negative!,
      neutralScore: response.SentimentScore.Neutral!,
      positiveScore: response.SentimentScore.Positive!,
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
