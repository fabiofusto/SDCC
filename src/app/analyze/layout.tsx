import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Steps } from '@/components/steps';
import { ReactNode } from 'react';
import { auth } from '../../../auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;
