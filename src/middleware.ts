import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authed = request.cookies.get('authed')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup');

  if (request.nextUrl.pathname.startsWith('/profile') && !authed) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuthPage && authed) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/signin', '/signup'],
}
