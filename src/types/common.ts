// Tipos comuns compartilhados

export type DateRange = {
  from: Date;
  to: Date;
};

export type SortDirection = 'asc' | 'desc';

export type Status = 'active' | 'paused' | 'ended';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface FilterParams {
  search?: string;
  [key: string]: unknown;
}

