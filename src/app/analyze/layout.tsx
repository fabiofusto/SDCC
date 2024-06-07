import {MaxWidthWrapper} from '@/components/max-width-wrapper'
import {Steps} from '@/components/steps'
import { ReactNode } from 'react'
import { auth, signIn } from '../../../auth'
import { redirect } from 'next/navigation'
import { authRoutes, uploadRoute } from '../../../routes'

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  if(!session || !session.user) await signIn('cognito', { callbackUrl: uploadRoute })

  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps />
      {children}
    </MaxWidthWrapper>
  )
}

export default Layout