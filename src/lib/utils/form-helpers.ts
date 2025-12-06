// Helpers para uso de Zod com react-hook-form

import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

/**
 * Cria um resolver Zod para react-hook-form
 * Tipagem melhorada - evita uso direto de `as any`
 * @param schema - Schema Zod para validação
 * @returns Resolver configurado para react-hook-form
 */
export function createZodResolver<T extends z.ZodTypeAny>(schema: T) {
  // O zodResolver do @hookform/resolvers tem tipagem complexa
  // Usamos uma asserção de tipo mais específica que `as any`
  // para manter compatibilidade com diferentes versões do Zod
  return zodResolver(schema as Parameters<typeof zodResolver>[0]);
}

/**
 * Exemplo de uso:
 * 
 * import { useForm } from 'react-hook-form';
 * import { createZodResolver } from '@/lib/utils/form-helpers';
 * import { campaignFormSchema } from '@/lib/validations';
 * 
 * const form = useForm({
 *   resolver: createZodResolver(campaignFormSchema),
 *   defaultValues: {
 *     name: '',
 *     platform: '',
 *     status: 'active',
 *   },
 * });
 */

