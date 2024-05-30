'use client';

import { Loader2, Table } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import { getDatasetFromS3, getReportFromS3 } from '@/actions/s3';
import { useToast } from './ui/use-toast';

interface Props {
  datasetId: string;
  canDownload?: boolean;
  iconSize?: boolean;
}

export const DownloadDatasetButton = ({
  datasetId,
  canDownload,
  iconSize = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function downloadDataset(datasetId: string) {
    setIsLoading(true);
    try {
      const signedURL = await getDatasetFromS3(datasetId);
      if (signedURL.error !== undefined) throw new Error(signedURL.error);

      const response = await axios.get(signedURL.success.url);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dataset.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    } catch (error) {
      return toast({
        title: 'Failed to download dataset',
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
      onClick={async () => downloadDataset(datasetId)}
    >
      <div className="flex items-center">
        {!iconSize ? <span className="mr-1.5">Download</span> : null}
        {!canDownload ? (
          <Table className="size-4" />
        ) : isLoading ? (
          <Loader2 className="animate-spin size-5 text-muted-foreground" />
        ) : (
          <Table className="size-5" />
        )}
      </div>
    </Button>
  );
};
