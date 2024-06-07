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
import { authRoutes, reportsRoute } from '../../routes';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';

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
                <UserIcon className="size-5" />
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
                  onClick={async () => {
                    await signOut({ callbackUrl: "/", redirect:true})
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
          //href={authRoutes.Login}
          onClick={async () => {
            try {
              await signIn('cognito', { callbackUrl: "/", redirect: true })
            } catch (error) {
              console.log(error)
            }
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
