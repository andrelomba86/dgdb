Você é um engenheiro de software sênior especialista em arquitetura fullstack, segurança e aplicações empresariais. Pense como um tech lead que vai revisar esse código antes de ir para produção. Qualidade e consistência importam mais do que velocidade

Sua tarefa é gerar um **webapp completo profissional** com base nos requisitos abaixo.

---

## 📌 CONTEXTO GERAL

- Aplicação web interna (não exposta à internet)
- Sistema de cadastro de docentes
- Banco de dados MySQL já existente (fornecido via arquivo `docentes.sql`)
- Backend e frontend no mesmo projeto usando Next.js

---

## 🧱 STACK OBRIGATÓRIA

- Next.js (App Router)
- TypeScript
- Server Actions (NÃO usar API Routes)
- Chakra UI (interface)
- MySQL (driver: prisma)
- Autenticação baseada em sessão com cookies HTTP-only

---

## 🗄️ BANCO DE DADOS

- Use o arquivo `docentes.sql` como fonte da estrutura
- Gere:
  - Models tipados em TypeScript
  - Camada de acesso ao banco (repository ou service layer)

- Implemente validações baseadas nas constraints do banco

---

## 👤 AUTENTICAÇÃO

Requisitos:

- Login com usuário e senha
- Sem JWT
- Sem OAuth
- Sessão com cookies HTTP-only
- Senhas devem ser armazenadas com hash seguro (bcrypt)

Funcionalidades:

- Login
- Logout
- Proteção de rotas (middleware ou server-side)
- Usuário autenticado pode:
  - Criar
  - Editar
  - Deletar
  - Visualizar docentes

---

## 🔐 SEGURANÇA (OBRIGATÓRIO)

Mesmo sendo sistema interno, implemente:

### Backend

- Proteção contra SQL Injection (queries parametrizadas ou ORM)
- Validação de input (Zod ou similar)
- Sanitização de dados
- Controle de sessão seguro
- Proteção contra CSRF
- Headers de segurança (quando aplicável)

### Frontend

- Proteção básica contra XSS
- Não expor dados sensíveis no client

---

## ⚙️ ARQUITETURA

Use uma estrutura profissional, como:

- /app (App Router)
- /components
- /lib
- /services
- /repositories
- /types
- /validators

Separação clara de responsabilidades:

- UI (Chakra)
- Lógica (services)
- Acesso a dados (repository)

---

## 📋 FUNCIONALIDADES

### CRUD de docentes

- Criar docente
- Listar docentes
- Editar docente
- Deletar docente

### Tabela avançada

- Paginação
- Ordenação
- Filtro/busca
- UI moderna com Chakra UI

### Formulários

- Validação com feedback visual
- Campos baseados no schema do banco

---

## 📊 RELATÓRIOS

Implementar exportação de dados:

- CSV
- PDF

Requisitos:

- Exportar todos os docentes
- Botão na interface
- Geração no backend (server action)

---

## 🎨 INTERFACE

- Layout moderno estilo dashboard
- Responsivo
- Uso adequado de Chakra UI:
  - Table
  - FormControl
  - Modal
  - Toast feedback

- UX fluida (loading states, feedback de ações)

---

## ⚡ SERVER ACTIONS

- Usar Server Actions para:
  - CRUD
  - Login
  - Exportação

- Garantir tipagem forte

---

## 🧪 QUALIDADE DE CÓDIGO

- Código 100% em TypeScript
- Tipagem forte (sem any)
- Separação limpa de responsabilidades
- Comentários explicando decisões importantes
- Estrutura pronta para escalar

---

## 🚀 EXECUÇÃO LOCAL

- Banco MySQL local
- Variáveis de ambiente (.env)
- Script de setup:
  - Instalação
  - Execução

- Instruções claras no README

---

## 📦 ENTREGA

Você deve gerar:

1. Estrutura completa do projeto
2. Código de todos os arquivos principais
3. Configuração do banco
4. Sistema de autenticação funcional
5. CRUD completo
6. Exportação CSV funcional
7. README com instruções

---

## ⚠️ IMPORTANTE

- NÃO gerar código simplificado ou exemplo
- Gerar código REAL pronto para produção interna (Inclua tratamento de erros com mensagens amigáveis ao usuário e logs estruturados no servidor)
- Seguir boas práticas modernas de engenharia de software
- Gere em etapas. Comece pela camada de dados (schema, repository, types). Aguarde confirmação antes de continuar para a camada de autenticação
