import type { NextAuthConfig } from 'next-auth';
import Cognito from '@auth/core/providers/cognito';

export default {
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true
} satisfies NextAuthConfig;
