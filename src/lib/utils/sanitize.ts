// Utilitários para sanitização de HTML e prevenção de XSS

/**
 * Sanitiza uma string HTML removendo scripts e elementos perigosos
 * Nota: Para produção, considere usar uma biblioteca como DOMPurify
 * @param html - String HTML a ser sanitizada
 * @returns String HTML sanitizada
 */
export function sanitizeHTML(html: string): string {
  // Remove scripts e event handlers básicos
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Escapa caracteres HTML especiais para prevenir XSS
 * @param text - Texto a ser escapado
 * @returns Texto escapado
 */
export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Valida se uma string é HTML seguro para uso em dangerouslySetInnerHTML
 * Use apenas com conteúdo confiável e estático
 * @param html - HTML a ser validado
 * @returns true se parece seguro (apenas CSS/estrutura), false caso contrário
 */
export function isSafeHTML(html: string): boolean {
  // Verifica se contém scripts ou event handlers perigosos
  const dangerousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(html));
}

