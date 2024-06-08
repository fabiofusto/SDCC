'use client';

import {
  BarChart2,
  LogIn,
  LogOut, User as UserIcon
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { type User } from 'next-auth';
import { authPage, defaultLoginRedirect, reportsRoute } from '../../routes';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export const UserProfile = ({ user }: { user: User | undefined }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      {user ? (
        <DropdownMenu
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DropdownMenuTrigger
            asChild
            onClick={() => setIsOpen(!isOpen)}
          >
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                {user.image ? <Image src={user.image} fill alt='user image' /> : (<UserIcon className="size-5" />)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <Button
                  className="p-0"
                  variant={null}
                  size="sm"
                  onClick={() => {
                    router.push(reportsRoute);
                    setIsOpen(!isOpen);
                  }}
                >
                  My reports
                </Button>
                <BarChart2 className="size-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-center justify-between cursor-pointer text-red-500 focus:text-red-700">
                <Button
                  className="p-0"
                  variant={null}
                  size="sm"
                  onClick={() => {
                    signOut({ callbackUrl: defaultLoginRedirect})
                    setIsOpen(!isOpen);
                  }}
                >
                  Sign out
                </Button>
                <LogOut className="size-4" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant='outline'
          onClick={() => {
            router.push(authPage)
            setIsOpen(!isOpen)
          }}
        >
          <div className="flex items-center">
            <span>Sign in</span> <LogIn className="ml-1.5 size-4" />
          </div>
        </Button>
      )}
    </>
  );
};
