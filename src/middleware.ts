import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se é uma rota protegida (dashboard)
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/affiliates') ||
                          request.nextUrl.pathname.startsWith('/players') ||
                          request.nextUrl.pathname.startsWith('/campaigns') ||
                          request.nextUrl.pathname.startsWith('/analytics') ||
                          request.nextUrl.pathname.startsWith('/settings');

  // Se não for rota protegida, permitir acesso
  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  // Verificar token no cookie ou header
  // Nota: localStorage não está disponível no middleware, então verificamos apenas cookies
  // A verificação completa será feita no cliente via componente de proteção
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Se não houver token, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
