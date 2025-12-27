import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('dashboard-auth');
    // Check if cookie exists and has valid format (64 char hex string from randomBytes)
    const isAuthenticated = authCookie?.value && /^[a-f0-9]{64}$/.test(authCookie.value);
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

    // If trying to access dashboard without auth, redirect to signin
    if (isDashboardRoute && !isAuthenticated) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    // If already authenticated and trying to access signin, redirect to dashboard
    if (isAuthRoute && isAuthenticated && request.nextUrl.pathname === '/auth/signin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*',
    ],
};

