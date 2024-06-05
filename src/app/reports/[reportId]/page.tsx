import { getReportWithResults } from '@/actions/db';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Report } from '@/components/report';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  reportId: string;
}

const ReportPage = async ({ params }: {params: ReportPageProps}) => {
  const {reportId} = params;
  if (!reportId) return notFound();

  const report = await getReportWithResults(reportId)

  if (!report) return notFound();

  return (
    <MaxWidthWrapper>
      <Report
        report={report}
        results={report.analysisResults}
        confetti={true}
      />
    </MaxWidthWrapper>
  );
};

export default ReportPage;
