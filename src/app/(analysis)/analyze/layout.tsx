import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Steps } from '@/components/steps';
import { ReactNode } from 'react';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import { authPage } from '../../../../routes';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user) redirect(authPage)
  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;
