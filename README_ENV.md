# Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurações sensíveis e específicas do ambiente.

## 📋 Arquivo de Exemplo

O arquivo `env.example` contém todas as variáveis de ambiente necessárias. Copie este arquivo para criar seu `.env.local`:

```bash
cp env.example .env.local
```

## 🔧 Variáveis Obrigatórias

### `NEXT_PUBLIC_API_BASE_URL`
**Obrigatório** - URL base da API

```env
NEXT_PUBLIC_API_BASE_URL=https://bi-velock-api.bos1wt.easypanel.host
```

**Importante:** Esta variável é obrigatória. O aplicativo não funcionará sem ela.

## 🔐 Variáveis Opcionais

### `NEXT_PUBLIC_AUTH_TOKEN_KEY`
Chave usada para armazenar o token de autenticação no `localStorage`.

**Padrão:** `auth_token`

```env
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
```

### `NEXT_PUBLIC_AUTH_COOKIE_KEY`
Chave usada para armazenar o token de autenticação em cookies.

**Padrão:** `token`

```env
NEXT_PUBLIC_AUTH_COOKIE_KEY=token
```

### `NODE_ENV`
Ambiente de execução.

**Valores possíveis:**
- `development` - Ambiente de desenvolvimento
- `production` - Ambiente de produção

**Padrão:** `development`

```env
NODE_ENV=development
```

## 📝 Exemplo Completo

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://bi-velock-api.bos1wt.easypanel.host

# Environment
NODE_ENV=development

# Storage Keys (opcional)
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_COOKIE_KEY=token
```

## ⚠️ Importante

1. **Nunca commite o arquivo `.env.local`** - Ele está no `.gitignore`
2. **Use `.env.local` para desenvolvimento local**
3. **Configure as variáveis no servidor de produção** (Vercel, Railway, etc.)
4. **A variável `NEXT_PUBLIC_API_BASE_URL` é obrigatória** - O app não funcionará sem ela

## 🚀 Configuração em Produção

### Vercel
1. Acesse as configurações do projeto
2. Vá em "Environment Variables"
3. Adicione todas as variáveis necessárias

### Railway / Outros
Configure as variáveis de ambiente através do painel de controle do serviço.

## 🔍 Verificação

Após configurar as variáveis, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se a variável `NEXT_PUBLIC_API_BASE_URL` não estiver configurada, você verá um erro ao iniciar o servidor.

## 📚 Estrutura de Constantes

As variáveis de ambiente são centralizadas em `src/lib/constants/env.ts`:

```typescript
import { API_BASE_URL, AUTH_TOKEN_KEY, AUTH_COOKIE_KEY } from '@/lib/constants/env';
```

Isso garante que todas as configurações estejam em um único lugar e sejam fáceis de gerenciar.
