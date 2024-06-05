import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

import { ReportCard } from '@/components/report-card';
import { ErrorBanner } from '@/components/error-not-found';
import { authRoutes } from '../../../routes';
import { getUserReportsAndSentiment } from '@/actions/db';

export const dynamic = 'force-dynamic'

const ReportsPage = async () => {
  const session = await auth();
  if (!session || !session.user) redirect(authRoutes.Login);

  const reports = await getUserReportsAndSentiment(session.user.id!);

  if (reports.length < 1) return <ErrorBanner title='reports'/>;

  return (
    <MaxWidthWrapper className="my-4 grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {reports.map((report, i)=> (
        <ReportCard key={i} report={report} />
      ))}
    </MaxWidthWrapper>
  );
};

export default ReportsPage;
