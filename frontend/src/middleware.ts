import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener token de localStorage (lo simulamos verificando si hay un header)
  const token = request.cookies.get('auth-token')?.value;
  
  // Rutas públicas que NO requieren autenticación
  const publicRoutes = ['/', '/login', '/register', '/services', '/barbers'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/_next'));
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/appointments', '/admin', '/barber'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si ya está autenticado y trata de acceder a login/register, redirigir a dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};