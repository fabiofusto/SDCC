'use client';

import { Report as ReportType } from '@prisma/client';
import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { MaxWidthWrapper } from './max-width-wrapper';
import { Chart } from './chart';

import { DownloadReportButton } from './download-report-button';
import { PercentageCards } from './percentage-cards';
import { sentimentDisplay } from '@/constants';

interface ReportProps {
  report: ReportType;
  confetti?: boolean;
}

export const Report = ({ report, confetti = false }: ReportProps) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

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
        >
          <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className="font-bold text-2xl lg:text-3xl">
              Cobra<span className="text-green-600">Insights</span>
            </h1>
          </div>

          <div className="flex flex-col justify-between items-center xl:space-x-8">
            <div className="flex flex-col justify-between items-center">
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground mt-2 text-md lg:text-lg text-center">
                  We analyzed the sentiment of{' '}
                  <span className="font-bold">{report.totalTexts}</span> texts
                  and the average result is
                </p>
                <div className="flex items-center gap-x-1.5 mt-2">
                  <span
                    className={`text-lg xl:text-2xl my-4 ${
                      sentimentDisplay[report.sentiment].color
                    }`}
                  >
                    {sentimentDisplay[report.sentiment].icon}
                  </span>
                  <span
                    className={`text-2xl lg:text-3xl font-bold ${
                      sentimentDisplay[report.sentiment].color
                    }`}
                  >
                    {report.sentiment}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                <PercentageCards sentimentScore={sentimentScore} />
              </div>
              <div className="mt-4 w-full h-[350px]">
                <Chart score={sentimentScore} />
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 flex items-center justify-center gap-2 w-full">
          <DownloadReportButton
            reportId={report.id}
            reportUrl={report.url}
            iconSize={false}
          />
        </div>
      </MaxWidthWrapper>
    </>
  );
};
