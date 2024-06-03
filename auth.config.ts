import Cognito from '@auth/core/providers/cognito';
import cognito from 'next-auth/providers/cognito';

import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      authorization: { params: { scope: 'email openid profile' } },
      //checks: ['pkce', 'nonce'],
    }),
  ],
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
