'use client';

import { Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import { getReportFromS3 } from '@/actions/s3';
import { useToast } from './ui/use-toast';

interface Props {
  reportId: string;
  canDownload?: boolean;
  iconSize?: boolean
}

export const DownloadReportButton = ({ reportId, canDownload, iconSize = true}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function downloadReport(reportId: string) {
    setIsLoading(true);
    try {
      const signedURL = await getReportFromS3(reportId);
      if (signedURL.error !== undefined) throw new Error(signedURL.error);

      const response = await axios.get(signedURL.success.url, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    } catch (error) {
      return toast({
        title: 'Failed to download report',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size={iconSize ? 'icon' : 'default'}
      disabled={isLoading || !canDownload}
      onClick={async () => downloadReport(reportId)}
    >
      <div className='flex items-center'>
      {!iconSize ? (<span className='mr-1.5'>Download</span>) : null}
      {!canDownload ? (
        <Download className="size-4" />
      ) : isLoading ? (
        <Loader2 className="animate-spin size-5 text-muted-foreground" />
      ) : (
        <Download className="size-5" />
      )}</div>
    </Button>
  );
};
