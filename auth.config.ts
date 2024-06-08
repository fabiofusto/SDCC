import type { NextAuthConfig } from 'next-auth';
import Cognito from '@auth/core/providers/cognito';
import Google from 'next-auth/providers/google';

export default {
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      allowDangerousEmailAccountLinking: true
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true
} satisfies NextAuthConfig;
