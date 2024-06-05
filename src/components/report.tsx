'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { MaxWidthWrapper } from './max-width-wrapper';
import { Chart } from './chart';

import { DownloadReportButton } from './download-report-button';
import { PercentageCards } from './percentage-cards';
import { sentimentDisplay, sentimentServices } from '@/constants';
import { AnalysisResult, Report as ReportType } from '@prisma/client';

interface ReportProps {
  report: ReportType;
  results: AnalysisResult[];
  confetti?: boolean;
}

export const Report = ({ report, results, confetti = false }: ReportProps) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

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
      <MaxWidthWrapper className="my-4 md:!px-10">
        <div id="report" className='px-4'>
          <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className="font-bold text-2xl lg:text-3xl">
              Cobra<span className="text-green-600">Insights</span>
            </h1>
          </div>

          <div className="flex flex-col justify-between items-center xl:space-x-8">
            <div className="flex flex-col justify-between items-center">
              {results.map((result, i) => {
                const service = sentimentServices[result.service];
                const sentimentScore = {
                  Positive: result.PositiveAvgScore,
                  Negative: result.NegativeAvgScore,
                  Mixed: result.MixedAvgScore,
                  Neutral: result.NeutralAvgScore,
                };

                return (
                  <div
                    key={i}
                    className="flex flex-col lg:flex-row items-center justify-between mt-8"
                  >
                    <div>
                      <div className="flex flex-col items-center justify-center">
                        <h2 className="font-bold text-xl">{service}</h2>
                        <p className="text-muted-foreground mt-2 text-md text-center">
                          {service} analysed the sentiment of{' '}
                          <span className="font-bold">{result.totalTexts}</span>{' '}
                          texts and the average result is
                        </p>
                        <div className="flex items-center gap-x-1.5">
                          <span
                            className={`text-lg xl:text-2xl my-4 ${
                              sentimentDisplay[result.sentiment].color
                            }`}
                          >
                            {sentimentDisplay[result.sentiment].icon}
                          </span>
                          <span
                            className={`text-2xl lg:text-3xl font-bold ${
                              sentimentDisplay[result.sentiment].color
                            }`}
                          >
                            {result.sentiment}
                          </span>
                        </div>
                      </div>
                      <PercentageCards sentimentScore={sentimentScore} />
                    </div>

                    <div className="mt-4 w-[450px] h-[300px]">
                      <Chart score={sentimentScore} />
                    </div>
                  </div>
                );
              })}
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
