// Helpers para uso de Zod com react-hook-form

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

/**
 * Cria um resolver Zod para react-hook-form
 * @param schema - Schema Zod para validação
 * @returns Resolver configurado para react-hook-form
 */
export function createZodResolver<T extends ZodSchema>(schema: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return zodResolver(schema as any);
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

