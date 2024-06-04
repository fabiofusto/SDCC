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
import { Report } from '@prisma/client';
import { DownloadReportButton } from './download-report-button';
import { sentimentDisplay } from '@/constants';
import { DownloadDatasetButton } from './download-dataset-button';

interface ReportCardProps {
  report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
  const date =
    new Date(report.createdAt).toLocaleDateString('en-GB') +
    ' ' +
    new Date(report.createdAt).toLocaleTimeString('en-GB');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg lg:text-xl">{report.sentiment}</span>
          {sentimentDisplay[report.sentiment].icon}
        </CardTitle>
        <CardDescription className="font-medium text-xs">
          {date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-2">
        {report.url && <DownloadReportButton
          reportId={report.id}
          canDownload
        />}
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
