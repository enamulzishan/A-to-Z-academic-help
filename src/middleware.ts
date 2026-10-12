import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(token);

  // If user is accessing /admin/login
  if (pathname === '/admin/login') {
    // If already logged in, redirect to admin dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // All other /admin routes require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
