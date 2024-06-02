import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Steps } from '@/components/steps'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  // const session = await auth()
  // if(!session) redirect(authRoutes.Login)

  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps />
      {children}
    </MaxWidthWrapper>
  )
}

export default Layout