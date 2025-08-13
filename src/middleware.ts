import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authed = request.cookies.get('authed')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/get-started');

  if ((request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/test')) && !authed) {
    return NextResponse.redirect(new URL('/get-started', request.url));
  }

  if (isAuthPage && authed) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/get-started', '/test'],
}
