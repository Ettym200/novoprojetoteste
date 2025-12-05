# Utilitários de Segurança

## Sanitização HTML

O arquivo `sanitize.ts` fornece utilitários para prevenir ataques XSS:

- `sanitizeHTML()`: Remove scripts e event handlers perigosos
- `escapeHTML()`: Escapa caracteres HTML especiais
- `isSafeHTML()`: Valida se HTML é seguro para uso

## Uso Recomendado

Para conteúdo dinâmico que precisa ser renderizado como HTML:

```typescript
import { sanitizeHTML, isSafeHTML } from '@/lib/utils/sanitize';

// Verificar antes de usar dangerouslySetInnerHTML
const userContent = getUserContent();
if (isSafeHTML(userContent)) {
  // Renderizar apenas se seguro
} else {
  // Usar conteúdo sanitizado
  const safeContent = sanitizeHTML(userContent);
}
```

**Nota**: Para produção, considere usar uma biblioteca especializada como `DOMPurify` para sanitização mais robusta.

