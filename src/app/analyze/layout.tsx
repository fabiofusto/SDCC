import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Steps } from '@/components/steps';
import { ReactNode } from 'react';
import { auth, signIn } from '../../../auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user) {
    try {
      return await signIn('cognito', { callbackUrl: '/analyze', redirect: true});
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;
