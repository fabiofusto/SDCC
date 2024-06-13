'use client';

import {
  analyseComprehendColumnSentiment,
} from '@/actions/comprehend';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  analyseAzureColumnSentiment,
} from '@/actions/azure';
import { createReport, updateReport } from '@/actions/db';

interface SelectDialogProps {
  columns: {
    value: string;
    label: string;
  }[];
  body: string[][];
  datasetId: string;
  userId: string;
}

export const SelectDialog = ({
  columns,
  body,
  datasetId,
  userId,
}: SelectDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const selectedColumnData = body.map((row: string[]) => row[selectedColumn]);

  async function analyzeData() {
    setIsLoading(true)
    setReportId(null)
    
    try {
     const reportId = await createReport(datasetId, userId)

      if (!reportId) throw new Error('Error while creating report');

      const azureResponse = await analyseAzureColumnSentiment(
        selectedColumnData,
        reportId
      );
      const awsResponse = await analyseComprehendColumnSentiment(
        selectedColumnData,
        reportId
      );

      if (azureResponse.error !== undefined)
        throw new Error('Error while analysing with Azure');
      if (awsResponse.error !== undefined)
        throw new Error('Error while analysing with AWS');

      const azureResult = azureResponse.success.analysisResult;
      const awsResult = awsResponse.success.analysisResult;

      const updatedReport = await updateReport(reportId, datasetId, [awsResult, azureResult])
      if (!updatedReport) throw new Error('Error while updating report');
  
      toast({
        title: 'Data successfully analysed!',
        description: 'You will be redirected to the report page',
        variant: 'default',
      });

      startTransition(() => {
        router.push(`/analyze/report?id=${updatedReport.id}`);
      });

    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Error while creating report')
          return toast({
            title: 'Error while creating the final report',
            description: 'Please try again',
            variant: 'destructive',
          });
        if (error.message === 'Error while analysing with Azure') {
          return toast({
            title: 'Azure failed to analyse your data',
            description: 'Please try again',
            variant: 'destructive',
          });
        }
        if (error.message === 'Error while analysing with AWS') {
          return toast({
            title: 'AWS failed to analyse your data',
            description: 'Please try again',
            variant: 'destructive',
          });
        }
        if (error.message === 'Error while updating report') {
          return toast({
            title: 'Error while updatind the final report',
            description: 'Please try again',
            variant: 'destructive',
          });
        }
        console.error(error.message)
        toast({
          title: 'Something went wrong',
          description: 'Please try again',
          variant: 'destructive',
        
        })
      } 

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogTrigger asChild>
        <div className="w-full flex justify-end items-center sm:mt-4">
          <div className="flex flex-col items-center justify-center mt-2 mb-4 w-full lg:w-fit">
            <Button
              disabled={isPending || columns.length === 0}
              variant="outline"
              className="w-full lg:w-fit"
            >
              {isPending || isLoading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <span>Pick a column</span>
              )}
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a column to analyse data</DialogTitle>
          <DialogDescription>
            You can only choose one column. The system will automatically
            analyse the sentiment in your data and show you a final report
          </DialogDescription>
          <div className="w-full">
            <Select
              onValueChange={(value: string) =>
                setSelectedColumn(parseInt(value))
              }
            >
              <SelectTrigger className="w-full ring-0 focus:ring-0">
                <SelectValue
                  placeholder={columns.length > 0 ? columns[0].label : ''}
                />
              </SelectTrigger>
              <SelectContent>
                {columns.map(
                  (column: { value: string; label: string }, index: number) => (
                    <SelectItem
                      key={index}
                      value={index.toString()}
                    >
                      {column.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={async () => await analyzeData()}
          >
            {isPending || isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <span>Analyse</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
