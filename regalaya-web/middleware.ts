import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-account'];
const ADMIN_AUTH_ROUTES = ['/admin/login', '/admin/register', '/admin/forgot-password', '/admin/reset-password', '/admin/verify-account'];

const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/categories',
  '/search',
  '/cart',
  '/checkout',
  '/wishlist',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/blog',
  '/track',
  '/recommendations',
  '/chat',
  '/api/auth',
];

const ADMIN_PROTECTED_ROUTES = ['/admin/dashboard', '/admin/users', '/admin/settings', '/admin/products', '/admin/orders'];

function decodeJwtRoles(accessToken: string): string[] {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const roles = payload.roles || [];
    const role = payload.role;
    if (role) roles.push(role);
    return roles;
  } catch {
    return [];
  }
}

function hasAdminRole(roles: string[]): boolean {
  return roles.includes('ADMIN') ||
         roles.includes('ROLE_ADMIN') ||
         roles.includes('MANAGER') ||
         roles.includes('ROLE_MANAGER') ||
         roles.includes('ROLE_CREATE_USER') ||
         roles.includes('ROLE_MANAGE_SYSTEM');
}

function isUserAuthRoute(pathname: string): boolean {
  return USER_AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function isAdminAuthRoute(pathname: string): boolean {
  return ADMIN_AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isUserAuth = isUserAuthRoute(pathname);
  const isAdminAuth = isAdminAuthRoute(pathname);
  const isPublic = isPublicRoute(pathname);
  const isAdmin = isAdminRoute(pathname);

  // === ADMIN ROUTES ===
  if (isAdmin) {
    // Admin auth routes - accessible without token
    if (isAdminAuth) {
      // If admin is already logged in, redirect to dashboard
      if (accessToken && hasAdminRole(decodeJwtRoles(accessToken))) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      // If user (non-admin) tries to access admin auth, redirect to user account
      if (accessToken && !hasAdminRole(decodeJwtRoles(accessToken))) {
        return NextResponse.redirect(new URL('/account', request.url));
      }
      return NextResponse.next();
    }

    // Protected admin routes - require admin token
    if (!accessToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const roles = decodeJwtRoles(accessToken);
    if (!hasAdminRole(roles)) {
      return NextResponse.redirect(new URL('/account', request.url));
    }

    return NextResponse.next();
  }

  // === USER PROTECTED ROUTES ===
  if (!isPublic && !isUserAuth && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // === USER AUTH ROUTES ===
  if (isUserAuth && accessToken) {
    const roles = decodeJwtRoles(accessToken);
    const destination = hasAdminRole(roles) ? '/admin/dashboard' : '/account';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
