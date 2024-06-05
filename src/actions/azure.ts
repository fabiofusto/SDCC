'use server';

import {
    AzureKeyCredential, SentimentAnalysisSuccessResult,
    TextAnalysisClient
} from '@azure/ai-language-text';
import { auth } from '../../auth';
import { db } from '@/lib/db';

const azureClient = new TextAnalysisClient(
  process.env.AZURE_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_KEY!)
);

const detectAzureDominantLanguage = async (columnData: string[]) => {
  const response = await azureClient.analyze('LanguageDetection', columnData);

  const languageCount: { [key: string]: number } = {};

  for (const item of response) {
    if (!item.error) {
      const language = item.primaryLanguage.iso6391Name;
      languageCount[language]
        ? languageCount[language]++
        : languageCount[language] = 1;
    }
  }

  const isThereACount = Object.values(languageCount).some((count) => count > 1);
  if (!isThereACount)
    return { error: { message: 'Could not detect Azure dominant language' } };

  let mostFrequentLanguage = '';
  let maxCount = 0;

  for (const [language, count] of Object.entries(languageCount)) {
    if (count > maxCount) {
      mostFrequentLanguage = language;
      maxCount = count;
    }
  }

  return { success: { dominantLanguage: mostFrequentLanguage } };
};

export const analyseAzureColumnSentiment = async (
  columnData: string[],
  reportId: string
) => {
  const session = await auth();
  if (!session || !session.user) return { error: { message: 'Unauthorized' } };

  const language = await detectAzureDominantLanguage(columnData);
  if (language.error !== undefined)
    return { error: { message: 'Error while detecting language' } };

  const dominantLanguage = language.success.dominantLanguage;

  const documents = columnData.map((text, index) => ({
    text: text,
    id: index.toString(),
    language: dominantLanguage,
  }));

  const batchSize = 10;
  const documentGroups = [];

  for (let i = 0; i < documents.length; i += batchSize) {
    const group = documents.slice(i, i + batchSize);
    documentGroups.push(group);
  }

  const sentimentSumCounts: { [key: string]: {count: number, sum: number} } = {
    positive: {
        count: 0,
        sum: 0
    },
    negative: {
        count: 0,
        sum: 0
    },
    neutral: {
        count: 0,
        sum: 0
    },
  }

  for (const group of documentGroups) {
    const response = await azureClient.analyze('SentimentAnalysis', group);

    for (const item of response) {
      if (!item.error) {
        sentimentSumCounts[item.sentiment].count++;
        
        sentimentSumCounts.positive.sum += item.confidenceScores.positive;
        sentimentSumCounts.negative.sum += item.confidenceScores.negative;
        sentimentSumCounts.neutral.sum += item.confidenceScores.neutral;
      }
    }
  }

  const averageSentimentScores: { [key: string]: number } = {
    positive: sentimentSumCounts.positive.sum / columnData.length,
    negative: sentimentSumCounts.negative.sum / columnData.length,
    neutral: sentimentSumCounts.neutral.sum / columnData.length
  }

  const sentimentResult = Object.keys(averageSentimentScores).reduce((a, b) =>
    averageSentimentScores[a] > averageSentimentScores[b] ? a : b
  );

  const analysisResult = await db.analysisResult.create({
    data: {
        service: 'AZURE',
        sentiment: sentimentResult.charAt(0).toUpperCase() + sentimentResult.slice(1).toLowerCase(),
        PositiveAvgScore: averageSentimentScores.positive,
        NegativeAvgScore: averageSentimentScores.negative,
        NeutralAvgScore: averageSentimentScores.neutral,
        MixedAvgScore: 0,
        totalTexts: sentimentSumCounts.positive.count + sentimentSumCounts.negative.count + sentimentSumCounts.neutral.count,
        reportId: reportId
    }
  })

  if(!analysisResult) return {error: {message: 'Azure: Error while analysing data'}}

  return { success: { analysisResult: analysisResult } };

};