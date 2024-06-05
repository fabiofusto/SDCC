'use server'

import { db } from "@/lib/db";
import { AnalysisResult, Report } from "@prisma/client";

export const createReport = async (datasetId:string, userId: string) => {
    const report = await db.report.create({
        data: {
          datasetId: datasetId,
          userId: userId,
        },
      });

    return report.id
} 

export const updateReport = async (reportId: string, datasetId: string, results: AnalysisResult[]) => {
  
  const report = await db.report.findUnique({
    where: {
      id: reportId
    }
  })

  if(!report) return null
  
  const updatedReport = await db.report.update({
    where: {
      id: report.id,
      datasetId: datasetId,
    },
    data: {
      analysisResults: {
        set: results
      },
    },
  });

  return updatedReport
}

export const getUserReportsAndSentiment = async (userId: string) => {
  const reports = await db.report.findMany({
    where: {
      userId,
    },
    include: {
      analysisResults: {
        select: {
          sentiment: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return reports;
};

export const getReportWithResults = async (reportId: string) => {
  const report = await db.report.findUnique({
    where: {
      id: reportId,
    },
    include: {
      analysisResults: true
    }
  });

  return report
}