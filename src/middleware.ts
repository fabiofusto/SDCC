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

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(authRoutes).includes(nextUrl.pathname);

  const isLoginRoute = nextUrl.pathname === authRoutes.Login;
  const isLogoutRoute = nextUrl.pathname === authRoutes.Logout;

  const corsHeaders : {[key: string]: string} = {
    'Access-Control-Allow-Origin': 'https://cobrainsights.xyz',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  //console.log({isLoggedIn, isAuthRoute, isApiAuthRoute})

  if (isApiAuthRoute && !isLoginRoute && !isLogoutRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn && isLoginRoute) {
      const response = NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
      Object.keys(corsHeaders).forEach((key) => {
        response.headers.set(key, corsHeaders[key]);
      });
      return response;
    }

    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const response = NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
      Object.keys(corsHeaders).forEach((key) => {
        response.headers.set(key, corsHeaders[key]);
      });
      return response;
  }

  return undefined;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
