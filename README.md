# DGDB

Sistema interno para cadastro de docentes, construído com Next.js App Router, TypeScript, Prisma, MySQL e autenticação por sessão com cookies HTTP-only.

## Stack

- Next.js 15
- TypeScript
- Prisma + MySQL
- Server Actions
- Chakra UI provider configurado no layout
- bcrypt para hash de senha
- pdf-lib para exportação PDF
- Zod para validação de entrada

## Funcionalidades atuais

- Login e logout por sessão
- Proteção server-side de rotas privadas
- CRUD de docentes
- CRUD relacional no mesmo formulário para:
  - cargos
  - telefones
  - documentos
  - contas bancárias
- Filtros, ordenação e paginação na listagem
- Exportação de docentes em CSV e PDF

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- MySQL local disponível

## Configuração

Crie ou ajuste o arquivo `.env` com valores equivalentes a estes:

```env
DATABASE_URL="mysql://root:senha@localhost:3306/dg"
ADMIN_LOGIN="admin"
ADMIN_PASSWORD="admin123456"
```

## Instalação

```bash
npm install
npx prisma generate
```

## Banco de dados

O projeto já contém o script consolidado [init-db.sql](init-db.sql).

Para inicializar o banco:

```bash
mysql -u root -p < init-db.sql
```

Depois execute o seed do usuário administrador:

```bash
npm run prisma:seed
```

## Execução local

Modo desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run typecheck
npm run build
npm start
```

## Credenciais iniciais

O seed cria o usuário administrador com base em `ADMIN_LOGIN` e `ADMIN_PASSWORD` definidos no `.env`.

## Estrutura principal

- [app](app) — rotas App Router
- [src/actions](src/actions) — server actions
- [src/components](src/components) — componentes reutilizáveis
- [src/lib](src/lib) — utilitários, autenticação e exportação
- [src/repositories](src/repositories) — acesso a dados
- [src/services](src/services) — regras de negócio
- [src/types](src/types) — tipos do domínio
- [src/validators](src/validators) — schemas Zod
- [prisma](prisma) — schema e seed

## Rotas principais

- `/login` — autenticação
- `/` — página inicial autenticada
- `/docentes` — listagem, filtros, exportação
- `/docentes/novo` — cadastro
- `/docentes/[id]` — edição e exclusão

## Segurança aplicada

- Sessão em cookie HTTP-only
- Hash seguro de senha com bcrypt
- Validação de input com Zod
- Persistência via Prisma, evitando SQL manual
- Headers de segurança configurados no Next.js

## Verificação rápida

1. Inicialize o banco com [init-db.sql](init-db.sql).
2. Rode `npm run prisma:seed`.
3. Rode `npm run dev`.
4. Acesse `/login`.
5. Faça login com as credenciais do `.env`.
6. Teste cadastro, edição, exclusão e exportações em `/docentes`.
