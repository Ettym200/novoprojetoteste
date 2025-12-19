"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/services/authService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Verificar autenticação no cliente (localStorage)
    // Usar setTimeout para garantir que o localStorage está disponível
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);
      
      if (!authenticated) {
        const loginUrl = `/?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      }
    };

    // Pequeno delay para garantir que o componente está montado e localStorage está disponível
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [router, pathname]);

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
