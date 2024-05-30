import authConfig from '../auth.config';
import NextAuth from 'next-auth';
import {
  defaultLoginRedirect,
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
} from '../routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(authRoutes).includes(nextUrl.pathname);

  const isLoginRoute = nextUrl.pathname === authRoutes.Login;
  const isLogoutRoute = nextUrl.pathname === authRoutes.Logout

  //console.log({isLoggedIn, isAuthRoute, isApiAuthRoute})
  
  if(isApiAuthRoute && !isLoginRoute && !isLogoutRoute) {
    return undefined
  }
  
  if(isAuthRoute) {
    if(isLoggedIn && isLoginRoute) {
        return Response.redirect(new URL(defaultLoginRedirect, nextUrl))
    }

    return undefined
  }

  if(!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(authRoutes.Login, nextUrl))
  }

  return undefined
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
