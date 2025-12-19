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

  // Nota: Como o token está no localStorage (não acessível no middleware),
  // não podemos fazer verificação completa aqui. A verificação real será feita
  // no cliente via componente ProtectedRoute. Por enquanto, permitimos o acesso
  // e deixamos o ProtectedRoute fazer a verificação e redirecionamento se necessário.
  
  // Verificar token no cookie ou header (opcional - para casos onde o token está em cookie)
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Se houver token em cookie/header, permitir acesso
  // Se não houver, ainda permitir acesso - o ProtectedRoute no cliente fará a verificação
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
