// Funções utilitárias para cálculos de métricas

/**
 * Calcula ROI (Return on Investment)
 * @param netProfit - Lucro líquido
 * @param investment - Investimento total
 * @returns ROI em porcentagem
 */
export function calculateROI(netProfit: number, investment: number): number {
  if (investment === 0) return 0;
  return (netProfit / investment) * 100;
}

/**
 * Calcula Margem
 * @param netProfit - Lucro líquido
 * @param ggr - Gross Gaming Revenue
 * @returns Margem em porcentagem
 */
export function calculateMargin(netProfit: number, ggr: number): number {
  if (ggr === 0) return 0;
  return (netProfit / ggr) * 100;
}

/**
 * Calcula Taxa de Conversão
 * @param converted - Quantidade convertida
 * @param total - Total de itens
 * @returns Taxa de conversão em porcentagem
 */
export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

