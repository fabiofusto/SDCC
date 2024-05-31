'use client';

import { Report as ReportType } from '@prisma/client';
import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { MaxWidthWrapper } from './max-width-wrapper';
import { File, Loader2 } from 'lucide-react';
import { Chart } from './chart';

import { Button } from './ui/button';
import { computeSHA256, exportComponentAsPDF } from '@/lib/utils';
import { getReportSignedURL } from '@/actions/s3';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { DownloadReportButton } from './download-report-button';
import { PercentageCards } from './percentage-cards';
import { sentimentDisplay } from '@/constants';

interface ReportProps {
  report: ReportType;
  confetti?: boolean;
  actions?: boolean;
  urlPresent?:boolean
}

export const Report = ({
  report,
  confetti = false,
  actions = true,
  urlPresent
}: ReportProps) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [canDownload, setCanDownload] = useState<boolean>(
    urlPresent ? true : false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const uploadReportToS3 = async () => {
    setIsLoading(true);
    const file = await exportComponentAsPDF();
    if (!file) {
      return toast({
        title: 'Error while creating report',
        description: 'Please try again',
        variant: 'destructive',
      });
    }

    const checksum = await computeSHA256(file);
    const signedURL = await getReportSignedURL(
      report.id,
      file.type,
      file.size,
      checksum
    );
    if (signedURL.error !== undefined) {
      if (signedURL.error === 'Report already exists') {
        setCanDownload(true);
        return toast({
          title: 'Report already exists',
          description: 'You can download it now',
          variant: 'default',
        });
      }

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
        return toast({
          title: 'Error while creating report',
          description: 'Please reload your page',
          variant: 'destructive',
        });
      })
      .then(() => {
        setIsLoading(false);
        setCanDownload(true);
        return toast({
          title: 'Report created successfully',
          description: 'You can download it now',
          variant: 'default',
        });
      });
  };

  useEffect(() => {
    setShowConfetti(true);
  }, [report.id, toast]);

  const sentimentScore: { [key: string]: number } = {
    Positive: report.positiveAvgScore,
    Negative: report.negativeAvgScore,
    Mixed: report.mixedAvgScore,
    Neutral: report.neutralAvgScore,
  };

  return (
    <>
      {confetti && (
        <div className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
          <Confetti
            active={showConfetti}
            config={{ elementCount: 250, spread: 100 }}
          />
        </div>
      )}
      <MaxWidthWrapper className="my-4">
        <div
          id="report"
          className="px-8"
        >
          <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className="font-bold text-2xl lg:text-3xl">
              Cobra<span className="text-green-600">Insights</span>
            </h1>
            <p className="text-muted-foreground text-md lg:text-lg">
              Check out your sentiment analysis results!
            </p>
          </div>

          <div className="flex flex-col xl:flex-row justify-between items-center mt-8 xl:space-x-8">
            <div className="flex flex-col justify-between items-center">
              <div className="flex flex-col items-center justify-center">
                <h2 className="font-bold text-xl lg:text-2xl">
                  Result of sentiment analysis
                </h2>
                <p className="text-muted-foreground mt-2 text-sm lg:text-lg text-center">
                  We analyzed the sentiment of <span className='font-bold'>{report.totalTexts}</span>{' '} texts and the average result is
                </p>
                <div className="flex items-center gap-x-1.5 mt-2">
                  <span
                    className={`text-lg xl:text-2xl ${sentimentDisplay[report.sentiment].color}`}
                  >
                    {sentimentDisplay[report.sentiment].icon}
                  </span>
                  <span
                    className={`text-2xl lg:text-3xl font-bold ${sentimentDisplay[report.sentiment].color}`}
                  >
                    {report.sentiment}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-8">
               <PercentageCards sentimentDisplay={sentimentDisplay} sentimentScore={sentimentScore}/>
              </div>
            </div>
            <div className="w-[375px] h-[250px] xl:w-[450px] lg:h-[400px] mt-8 xl:mt-0">
              <Chart
                score={sentimentScore}
              />
            </div>
          </div>
        </div>
        {actions && (
          <div className="py-4 flex items-center justify-center gap-2 w-full">
            {!urlPresent && !canDownload && (<Button
              disabled={isLoading || canDownload}
              onClick={async () => await uploadReportToS3()}
              variant="outline"
            >
              {canDownload ? (
                <span className="flex items-center gap-1.5">
                  Generate PDF <File className="size-5" />
                </span>
              ) : isLoading ? (
                <Loader2 className="animate-spin text-muted-foreground size-5" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Generate PDF <File className="size-4" />
                </span>
              )}
            </Button>)}
            <DownloadReportButton
              reportId={report.id}
              canDownload={canDownload}
              iconSize={false}
            />
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
};
