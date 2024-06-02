import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

import { ReportCard } from '@/components/report-card';
import { ErrorBanner } from '@/components/error-not-found';
import { authRoutes } from '../../../routes';

export const dynamic = 'force-dynamic'

const fetchReports = async (userId: string) => {
  const reports = await db.report.findMany({
    where: {
      userId,
      url: {
        not: null,
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return reports;
};


const ReportsPage = async () => {
  const session = await auth();
  if (!session || !session.user) redirect(authRoutes.Login);

  const reports = await fetchReports(session.user.id!);

  if (reports.length < 1) return <ErrorBanner title='reports'/>;

  return (
    <MaxWidthWrapper className="my-4 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {reports.map((report, i)=> (
        <ReportCard key={i} report={report} />
      ))}
    </MaxWidthWrapper>
  );
};

export default ReportsPage;
