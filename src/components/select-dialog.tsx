'use client';

import { analyzeColumnSentiment } from '@/actions/comprehend';
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

interface SelectDialogProps {
  columns: {
    value: string;
    label: string;
  }[];
  body: string[][];
  datasetId: string;
}

export const SelectDialog = ({
  columns,
  body,
  datasetId,
}: SelectDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const selectedColumnData = body.map((row: string[]) => row[selectedColumn]);

  async function analyzeData() {
    const response = await analyzeColumnSentiment(
      selectedColumnData,
      datasetId
    );
    if (response.error !== undefined) {
      toast({
        title: 'Could not analyze data',
        description: 'Please try again',
        variant: 'destructive',
      });
      return;
    }
    const reportId = response.success.reportId;

    toast({
      title: 'Data successfully analyzed!',
      description: 'You will be redirected to the report page',
      variant: 'default',
    });

    startTransition(() => {
      router.push(`/analyze/report?id=${reportId}`);
    });
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
              className='w-full lg:w-fit'
            >
              {isPending ? (
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
          <DialogTitle>Pick a column to analyze data</DialogTitle>
          <DialogDescription>
            You can only choose one column. The system will automatically
            analyze the sentiment in your data and show you a final report
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
          <Button disabled={isPending} onClick={async () => await analyzeData()}>
            {isPending ? (<Loader2 className='animate-spin size-4'/>) : <span>Analyze</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
