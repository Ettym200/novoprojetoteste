// Configuração ESLint com suporte a variáveis de ambiente
module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' 
      ? ['error', { allow: ['warn', 'error'] }]
      : ['warn', { allow: ['warn', 'error'] }],
  },
};

