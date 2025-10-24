import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/me', '/test.html', '/favicon.ico'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Allow public paths and assets
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Redirect root to buildings
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/buildings', req.url));
  }

  const cookie = req.cookies.get('mu_session') || req.cookies.get(process.env.SESSION_COOKIE_NAME || 'mu_session');
  if (!cookie) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  // We do not deeply verify session here to avoid Edge runtime crypto differences.
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
