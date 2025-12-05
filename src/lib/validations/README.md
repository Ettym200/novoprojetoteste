# Validação com Zod

Este diretório contém schemas de validação Zod para formulários do projeto.

## Uso com react-hook-form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignFormSchema, type CampaignFormInput } from '@/lib/validations';

const form = useForm<CampaignFormInput>({
  resolver: zodResolver(campaignFormSchema),
  defaultValues: {
    name: '',
    platform: '',
    status: 'active',
  },
});
```

## Schemas Disponíveis

- `affiliateFiltersSchema` - Filtros de afiliados
- `campaignFiltersSchema` - Filtros de campanhas
- `campaignFormSchema` - Formulário de criação/edição de campanha
- `userFormSchema` - Formulário de criação/edição de usuário
- `playerFiltersSchema` - Filtros de jogadores
- `settingsFormSchema` - Formulário de configurações

## Benefícios

- ✅ Validação type-safe
- ✅ Mensagens de erro consistentes
- ✅ Fonte única da verdade (pode ser compartilhada com backend)
- ✅ Validação em tempo real
- ✅ Prevenção de dados inválidos

