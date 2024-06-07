import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      return session;
    },
    async signIn({user, account, profile }) {
      if (account?.provider === 'cognito' && profile?.email_verified) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({url, baseUrl}) {
      return baseUrl;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
  ...authConfig,
});
