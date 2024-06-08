'use client';

import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { defaultLoginRedirect } from '../../routes';
import { Icons } from './icons';
import { Mail } from 'lucide-react';

export const AuthCard = () => {
  return (
    <Card className='drop-shadow-md'>
      <CardHeader className="text-center">
        <CardTitle>
          <span className="font-semibold">
            Cobra<span className="text-green-600">Insights</span>
          </span>
        </CardTitle>
        <CardDescription>Choose your authentication method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => {
              signIn('cognito', { callbackUrl: defaultLoginRedirect });
            }}
            variant="outline"
            className='flex items-center gap-2'
          >
            <Mail className='size-4' />
            <span>Email and password</span>
          </Button>
          <Button
            onClick={() => {
              signIn('google', { callbackUrl: defaultLoginRedirect });
            }}
            variant="outline"
            className='flex items-center gap-2'
          >
            <Icons.google className='size-4'/><span>Google</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
