import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Report } from '@/components/report';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  reportId: string;
}

const ReportPage = async ({ reportId }: ReportPageProps) => {
    if(!reportId) return notFound()
  
    const report = await db.report.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!report) return notFound();

  return (
    <MaxWidthWrapper>
      <Report
        report={report}
        actions={false}
      />
    </MaxWidthWrapper>
  );
};

export default ReportPage;
