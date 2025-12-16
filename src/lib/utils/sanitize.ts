// Utilitários para sanitização de HTML e prevenção de XSS

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Inicializar DOMPurify para ambiente Node.js (SSR)
let createDOMPurify: typeof DOMPurify;
if (typeof window === 'undefined') {
  // Ambiente Node.js (SSR)
  const dom = new JSDOM('');
  createDOMPurify = DOMPurify(dom.window as unknown as Window & typeof globalThis);
} else {
  // Ambiente Browser
  createDOMPurify = DOMPurify;
}

/**
 * Sanitiza uma string HTML removendo scripts e elementos perigosos usando DOMPurify
 * @param html - String HTML a ser sanitizada
 * @returns String HTML sanitizada
 */
export function sanitizeHTML(html: string): string {
  return createDOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
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

