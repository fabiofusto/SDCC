'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Annoyed, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Report } from '@prisma/client';
import { DownloadReportButton } from './download-report-button';
import { sentimentDisplay } from '@/constants';
import { DownloadDatasetButton } from './download-dataset-button';

interface ReportCardProps {
  reports: Report[];
}

export const ReportCard = ({ reports }: ReportCardProps) => {
  return (
    <>
      {reports.map((report, i) => {
        const date = new Date(report.createdAt).toLocaleDateString('en-GB')+ ' ' + new Date(report.createdAt).toLocaleTimeString('en-GB');
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{report.sentiment}</span>
                {sentimentDisplay[report.sentiment].icon}
              </CardTitle>
              <CardDescription className="font-medium text-xs">
                {date}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-end gap-2">
              <DownloadReportButton reportId={report.id} canDownload/>
              <Link
                href={`/reports/${report.id}`}
                className={buttonVariants({
                  variant: 'outline',
                  size: 'icon',
                })}
              >
                <ExternalLink className="size-5" />
              </Link>
              <DownloadDatasetButton datasetId={report.datasetId} canDownload/>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
