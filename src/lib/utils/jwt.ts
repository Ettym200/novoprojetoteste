// Utilitários para trabalhar com JWT

/**
 * Decodifica um token JWT (sem verificar assinatura)
 * Retorna o payload do token
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch (error) {
    console.warn('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Obtém o ID do usuário do token JWT
 */
export function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token') || 
               document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Tentar diferentes campos comuns para ID do usuário
  if (decoded.sub && typeof decoded.sub === 'string') {
    return decoded.sub;
  }
  if (decoded.userId && typeof decoded.userId === 'string') {
    return decoded.userId;
  }
  if (decoded.id && typeof decoded.id === 'string') {
    return decoded.id;
  }
  if (decoded.user && typeof decoded.user === 'object' && decoded.user !== null) {
    const user = decoded.user as Record<string, unknown>;
    if (user.id && typeof user.id === 'string') {
      return user.id;
    }
  }
  return null;
}

/**
 * Obtém o email do usuário do token JWT
 */
export function getUserEmailFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token') || 
               document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return (decoded.email as string) || null;
}

/**
 * Obtém o role do usuário do token JWT
 */
export function getUserRoleFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token') || 
               document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return (decoded.role as string) || null;
}

