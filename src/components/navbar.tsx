import {MaxWidthWrapper} from '@/components/max-width-wrapper';
import { buttonVariants } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '../../auth';
import {UserProfile} from './user-menu';

export const Navbar = async () => {
  const user = await auth();

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 text-md md:text-lg lg:text-xl">
          <Link
            href="/"
            className="flex z-40 font-semibold"
          >
            Cobra<span className="text-green-600">Insights</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            <Link
              href="/analyze/upload"
              className={buttonVariants({
                size: 'sm',
                className: 'text-sm sm:text-md flex items-center gap-1',
              })}
            >
              Get started
              <BarChart2 className="ml-1.5 size-5" />
            </Link>
            <UserProfile user={user?.user} />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
