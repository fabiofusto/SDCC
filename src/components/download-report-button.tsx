'use client';

import { File, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import { getReportFromS3, getReportSignedURL } from '@/actions/s3';
import { useToast } from './ui/use-toast';
import { computeSHA256, exportComponentAsPDF } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Progress } from './ui/progress';

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isReportUploaded, setIsReportUploaded] = useState<boolean>(false);
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
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total!));
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

    if (!reportUrl && !isReportUploaded) {
      try {
        const pdfFile = await exportComponentAsPDF();
        setIsUploading(true);
        await uploadReportToS3(pdfFile);

        setIsReportUploaded(true);

        const url = window.URL.createObjectURL(pdfFile);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);
      } catch (error) {
        toast({
          title: 'Error while generating report',
          description: 'Please try again',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
        setIsLoading(false);
        setIsDialogOpen(false);
        setUploadProgress(0);
      }
    } else {
      try {
        const signedURL = await getReportFromS3(reportId);
        if (signedURL.error !== undefined) throw new Error(signedURL.error);

        const response = await axios.get(signedURL.success.url, {
          responseType: 'blob',
          onDownloadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total!));
          },
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
        setIsDialogOpen(false);
        setUploadProgress(0);
      }
    }
  }

  return (
    <>
      {!iconSize ? (
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
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
                    <span className="mr-1.5">Generating</span>
                  ) : (
                    <span className="mr-1.5">Get report</span>
                  )
                ) : null}
                {isLoading || isUploading ? (
                  <Loader2 className="animate-spin size-5 text-muted-foreground" />
                ) : (
                  <File className="size-5" />
                )}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>We are generating your report</DialogTitle>
              <DialogDescription>
                Don&apos;t close this dialog until the operation is completed
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center space-x-2">
              <Progress
                value={uploadProgress}
                className="w-52 h-2 bg-gray-300"
              />
              <span className="text-xs">{uploadProgress}%</span>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
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
                <span className="mr-1.5">Generating</span>
              ) : (
                <span className="mr-1.5">Get report</span>
              )
            ) : null}
            {isLoading || isUploading ? (
              <Loader2 className="animate-spin size-5 text-muted-foreground" />
            ) : (
              <File className="size-5" />
            )}
          </div>
        </Button>
      )}
    </>
  );
};
