'use client';

import { File, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import { getReportFromS3, getReportSignedURL } from '@/actions/s3';
import { useToast } from './ui/use-toast';
import { computeSHA256, exportComponentAsPDF } from '@/lib/utils';

interface Props {
  reportId: string;
  reportUrl: string | null;
  iconSize?: boolean;
}

export const DownloadReportButton = ({
  reportId,
  reportUrl,
  iconSize = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const uploadReportToS3 = async (file: File) => {
    const checksum = await computeSHA256(file);
    const signedURL = await getReportSignedURL(
      reportId,
      file.type,
      file.size,
      checksum
    );
    if (signedURL.error !== undefined) {
      return toast({
        title: 'Error while creating report',
        description: 'Please try again',
        variant: 'destructive',
      });
    }

    const { url } = signedURL.success;

    await axios
      .put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      .catch((error) => {
        toast({
          title: 'Error while uploading report',
          description: 'Please try again',
          variant: 'destructive',
        });
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  async function downloadReport(reportId: string) {
    setIsLoading(true);

    if (!reportUrl) {
      try {
        const pdfFile = await exportComponentAsPDF();

        const url = window.URL.createObjectURL(pdfFile);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);

        setIsUploading(true);
        await uploadReportToS3(pdfFile);
      } catch (error) {
        toast({
          title: 'Error while generating report',
          description: 'Please try again',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
        setIsLoading(false);
      }
    } else {
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
  }

  return (
    <Button
      variant="outline"
      size={iconSize ? 'icon' : 'default'}
      disabled={isLoading}
      onClick={async () => downloadReport(reportId)}
    >
      <div className="flex items-center">
        {!iconSize ? (
          isUploading ? (
            <span className="mr-1.5">Uploading</span>
          ) : isLoading ? (
            <span className="mr-1.5">Downloading</span>
          ) : (
            <span className="mr-1.5">Download</span>
          )
        ) : null}
        {isLoading || isUploading ? (
          <Loader2 className="animate-spin size-5 text-muted-foreground" />
        ) : (
          <File className="size-5" />
        )}
      </div>
    </Button>
  );
};
