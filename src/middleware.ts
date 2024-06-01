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

 // CORS headers
 const corsHeaders: {[key: string]: string} = {
  'Access-Control-Allow-Origin': '*', // Permetti tutte le origini, modificalo secondo le tue necessità
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default auth((req) => {
  // Gestione delle richieste OPTIONS (preflight request)
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    Object.keys(corsHeaders).forEach((key) => {
      response.headers.set(key, corsHeaders[key]);
    });
    return response;
  }

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(authRoutes).includes(nextUrl.pathname);

  const isLoginRoute = nextUrl.pathname === authRoutes.Login;
  const isLogoutRoute = nextUrl.pathname === authRoutes.Logout;

 
  // Se è una rotta API di autenticazione, aggiungi gli header CORS e lascia passare
  if (isApiAuthRoute && !isLoginRoute && !isLogoutRoute) {
    const response = NextResponse.next();
    Object.keys(corsHeaders).forEach((key) => {
      response.headers.set(key, corsHeaders[key]);
    });
    return response;
  }

  // Se è una rotta di autenticazione
  if (isAuthRoute) {
    // Se l'utente è loggato e sta cercando di accedere alla pagina di login, reindirizza
    if (isLoggedIn && isLoginRoute) {
      const response = NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
      Object.keys(corsHeaders).forEach((key) => {
        response.headers.set(key, corsHeaders[key]);
      });
      return response;
    }
    const response = NextResponse.next();
    Object.keys(corsHeaders).forEach((key) => {
      response.headers.set(key, corsHeaders[key]);
    });
    return response;
  }

  // Se l'utente non è loggato e la rotta non è pubblica, reindirizza alla pagina di login
  if (!isLoggedIn && !isPublicRoute) {
    const response = NextResponse.redirect(new URL(authRoutes.Login, nextUrl));
    Object.keys(corsHeaders).forEach((key) => {
      response.headers.set(key, corsHeaders[key]);
    });
    return response;
  }

  const response = NextResponse.next();
  Object.keys(corsHeaders).forEach((key) => {
    response.headers.set(key, corsHeaders[key]);
  });
  return response;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
