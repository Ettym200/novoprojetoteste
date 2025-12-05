// Tipos relacionados a Usuários

export type UserRole = 'SUPER' | 'GESTOR' | 'AFILIADO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'authorized' | 'pending' | 'blocked';
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

