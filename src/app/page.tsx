/* eslint-disable @next/next/no-img-element */
import { Chart } from '@/components/chart';
import {MaxWidthWrapper} from '@/components/max-width-wrapper';
import { db } from '@/lib/db';
import { Check } from 'lucide-react';

export default async function Home() {

  try {
    const users = await db.user.findMany({})
  } catch (error) {
    if (error instanceof Error)
      return (
      <p>{error.message}</p>
    )
  }
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-30 lg:pb-30">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-28 left-0 -top-20 hidden lg:block">
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-full w-full" />
                <img
                  src="/snake-1.png"
                  className="w-full"
                  alt="hero image"
                />
              </div>
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-4xl md:text-5xl lg:text-6xl">
                Unlock the{' '}
                <span className="bg-green-600 px-2 text-white">Sentiment </span>
                in your data
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Easily analyze the sentiment of your tabular datasets
                with our powerful platform.{' '}
                <span className="font-semibold">
                  Cobra<span className="text-green-600">Insights</span>
                </span>{' '}
                let&apos;s you upload any CSV file and analyze the data that you
                choose.
              </p>

              <div className="mt-4 px-8">
                <div className="text-gray-900 text-semibold text-xl text-center py-2 flex items-center justify-center">
                  <span className="font-semibold">Powered by</span>
                  <span className="ml-2 inline-flex items-center">
                    <img
                      src="/Amazon_Web_Services-Logo.wine.svg"
                      alt="AWS Logo"
                      className="size-12"
                    />
                  </span>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Effortless sentiment analysis for tabular data
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Fast and accurate insights
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Seamless integration with AWS
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              <img
                src="/line.png"
                className="absolute w-20 -bottom-3 select-none"
                alt="line"
              />
              <div className="relative pointer-events-none z-50 overflow-hidden w-[375px] h-[250px] xl:h-[300px]">
                <Chart 
                score={{
                  "Positive": 0.5,
                  "Negative": 0.3,
                  "Mixed": 0.1,
                  "Neutral": 0.2
                }}/>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
