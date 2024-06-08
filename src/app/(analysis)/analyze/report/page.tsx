import {Report} from '@/components/report';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ReportPage = async ({ searchParams }: ReportPageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== 'string') {
    return notFound();
  }

  const analysisResults = await db.analysisResult.findMany({
    where: {
      reportId: id,
    },
  });
  if (analysisResults.length < 1) return notFound();

  const report = await db.report.findUnique({
    where: {
      id,
    },
  });
  if(!report) return notFound()

  return <Report report={report} results={analysisResults} confetti />;
};

export default ReportPage;
