import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true,
  logger: {
    error: console.error,
    warn: console.warn,
    info: console.log,
    debug: console.log,
  },
  trustHost: true,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
