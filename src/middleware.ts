import authConfig from '../auth.config';
import NextAuth from 'next-auth';
import {
  defaultLoginRedirect,
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
} from '../routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'.split(','),
  allowedOrigins: 'https://cobrainsights.xyz'.split(','),
  allowedHeaders:
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization, Date, X-Api-Version'.split(
      ','
    ),
  exposedHeaders: ''.split(','),
  maxAge: 86400,
  credentials: true,
};

export default auth((req) => {
  const response = NextResponse.next();

  const origin = req.headers.get('origin') ?? '';
  if (
    corsOptions.allowedOrigins.includes('*') ||
    corsOptions.allowedOrigins.includes(origin)
  ) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set(
    'Access-Control-Allow-Credentials',
    corsOptions.credentials.toString()
  );
  response.headers.set(
    'Access-Control-Allow-Methods',
    corsOptions.allowedMethods.join(',')
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    corsOptions.allowedHeaders.join(',')
  );
  response.headers.set(
    'Access-Control-Expose-Headers',
    corsOptions.exposedHeaders.join(',')
  );
  response.headers.set(
    'Access-Control-Max-Age',
    corsOptions.maxAge?.toString() ?? ''
  );

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(authRoutes).includes(nextUrl.pathname);

  const isLoginRoute = nextUrl.pathname === authRoutes.Login;
  const isLogoutRoute = nextUrl.pathname === authRoutes.Logout;

  //console.log({isLoggedIn, isAuthRoute, isApiAuthRoute})

  if (isApiAuthRoute && !isLoginRoute && !isLogoutRoute) {
    return response;
  }

  if (isAuthRoute) {
    if (isLoggedIn && isLoginRoute) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: new URL(defaultLoginRedirect, nextUrl).toString(),
        },
      });
    }

    return response;
  }

  return response;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
