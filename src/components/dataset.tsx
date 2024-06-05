'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {MaxWidthWrapper} from './max-width-wrapper';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {SelectDialog} from './select-dialog';

interface DatasetProps {
  headers: {
    value: string;
    label: string;
  }[];
  body: string[][];
  datasetId: string
  userId: string
}

export const Dataset = ({ headers, body, datasetId, userId }: DatasetProps) => {
  //TODO: Add loading state with skeleton

  return (
    <MaxWidthWrapper className="flex flex-col items-center">
        <ScrollArea className="h-[400px] w-full mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(
                  (column: { value: string; label: string }, index: number) => (
                    <TableHead key={index}>{column.label}</TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {body.map((row: string[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
    
      <Separator />

      <SelectDialog
        columns={headers}
        body={body}
        datasetId={datasetId}
        userId={userId}
      />
    </MaxWidthWrapper>
  );
};
