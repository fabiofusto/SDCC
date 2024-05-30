import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { auth } from '../../../auth';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

import { ReportCard } from '@/components/report-card';
import { revalidatePath } from 'next/cache';
import { reportsRoute } from '@/../routes';
import { ErrorBanner } from '@/components/error-not-found';

const ReportsPage = async () => {
  const session = await auth();
  if (!session || !session.user) return notFound();

  const reports = await db.report.findMany({
    where: {
      userId: session.user.id,
      url: {
        not: null
      }
    },
  });

  if (reports.length < 1) return <ErrorBanner title='reports'/>;

  revalidatePath(reportsRoute)

  return (
    <MaxWidthWrapper className="my-4 grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <ReportCard reports={reports} />
    </MaxWidthWrapper>
  );
};

export default ReportsPage;
