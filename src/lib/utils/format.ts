// Funções utilitárias de formatação

/**
 * Formata valor monetário em BRL
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
}

/**
 * Formata número com separadores
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata data
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formata data para formato YYYY-MM-DD usado pela API
 * Garante que a data seja formatada corretamente sem problemas de timezone
 */
export function formatDateForAPI(date: Date): string {
  // Criar nova data com apenas ano, mês e dia (sem hora)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Divide dois números de forma segura, evitando divisão por zero
 * @param a - Numerador
 * @param b - Denominador
 * @param defaultValue - Valor padrão quando b é zero (padrão: 0)
 * @returns Resultado da divisão ou valor padrão
 */
export function safeDivide(a: number, b: number, defaultValue: number = 0): number {
  if (b === 0 || !Number.isFinite(b)) {
    return defaultValue;
  }
  const result = a / b;
  return Number.isFinite(result) ? result : defaultValue;
}

