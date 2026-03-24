# Prompt De Continuidade

Use este prompt no outro PC para continuar exatamente deste ponto:

```text
Estou continuando um projeto chamado CRM ABP em:

c:\\Users\\davi.snaider\\Documents\\crm-abp

Quero que voce continue como um coding agent, mantendo o que ja foi feito e sem quebrar o design atual.

Contexto do projeto:
- Frontend em React + TypeScript + Vite
- Backend em NestJS + TypeScript
- Banco PostgreSQL com Prisma
- Docker Compose no projeto
- Login dark inspirado em um video de referencia
- Dashboard, Leads, Customers e Negotiations com visual inspirado em um Figma enviado antes

O que ja esta pronto:
- Estrutura base de frontend e backend
- Dockerfiles e docker-compose
- Prisma schema base
- Login visual animado
- Rotas no frontend para /login, /dashboard, /leads, /customers e /negotiations
- Token JWT salvo no localStorage
- Login real chamando POST /api/auth/login
- Rotas protegidas no frontend
- Backend com:
  - AuthModule
  - JwtStrategy
  - JwtAuthGuard
  - endpoint /api/auth/login
  - endpoint /api/auth/me
  - endpoints protegidos em /api/crm/dashboard, /api/crm/leads, /api/crm/customers e /api/crm/negotiations
  - CRUD inicial de customers, leads e negotiations com Prisma
  - regra de uma negociacao ativa por lead
  - historico de status e stage nas negociacoes
  - seed inicial com admin@crm.local / 123456

Arquivos principais para ler antes de editar:
- README.md
- frontend/src/App.tsx
- frontend/src/index.css
- backend/src/app.module.ts
- backend/src/auth/*
- backend/src/crm/*
- backend/src/customers/*
- backend/src/leads/*
- backend/src/negotiations/*
- backend/prisma/schema.prisma
- backend/prisma/seed.ts

Estado atual:
- frontend builda com sucesso
- backend builda com sucesso
- o projeto ainda precisa evoluir os formularios reais, a integracao dos CRUDs no frontend e o RBAC completo

Quero que voce continue priorizando:
1. manter o design e as animacoes atuais
2. transformar as telas em CRUD real
3. implementar RBAC por papel no backend
4. deixar o projeto cada vez mais aderente ao PDF do desafio

Antes de mexer, leia o README e me diga rapidamente o que voce entendeu e qual sera o proximo passo.
```
