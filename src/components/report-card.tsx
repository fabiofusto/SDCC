'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AnalysisResult, Report } from '@prisma/client';
import { DownloadReportButton } from './download-report-button';
import { sentimentDisplay } from '@/constants';
import { DownloadDatasetButton } from './download-dataset-button';

type CustomAnalysisResult = {
  sentiment: string;
}

type CustomReport = {
  id: string;
  url: string | null;
  datasetId: string;
  userId: string;
  createdAt: Date;
  analysisResults: CustomAnalysisResult[];
}

interface ReportCardProps {
  report: CustomReport;
}

export const ReportCard = ({ report }: ReportCardProps) => {

  const date =
    new Date(report.createdAt).toLocaleDateString('en-GB') +
    ' ' +
    new Date(report.createdAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const sentimentCounts = report.analysisResults.reduce((acc, result) => {
    acc[result.sentiment] = acc[result.sentiment] ? acc[result.sentiment] + 1 : 1;
    return acc;
  }, {} as Record<string, number>); 

  const mostOccurringSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
    sentimentCounts[a] > sentimentCounts[b] ? a : b
  );

    return (
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
        <span className="text-lg lg:text-xl">{mostOccurringSentiment}</span>
        {sentimentDisplay[mostOccurringSentiment].icon}
        </CardTitle>
        <CardDescription className="font-medium text-xs">
        {date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-2">
        {report.url && (
        <DownloadReportButton
          reportId={report.id}
          reportUrl={report.url}
        />
        )}
        <DownloadDatasetButton
        datasetId={report.datasetId}
        canDownload
        />{' '}
        <Link
        href={`/reports/${report.id}`}
        className={buttonVariants({
          variant: 'outline',
          size: 'icon',
        })}
        >
        <ExternalLink className="size-5" />
        </Link>
      </CardContent>
      </Card>
    );
};
