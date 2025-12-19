"use client"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/services/authService';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar autenticação no cliente (localStorage)
    if (!isAuthenticated()) {
      const loginUrl = `/?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [router, pathname]);

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
