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

  const report = await db.report.findUnique({
    where: {
      id,
    },
  });

  if (!report) return notFound();
  const urlPresent = report.url !== null;

  return <Report report={report} confetti urlPresent={urlPresent} />;
};

export default ReportPage;
