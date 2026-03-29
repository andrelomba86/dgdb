Você é um engenheiro de software sênior especialista em arquitetura fullstack, segurança e aplicações empresariais. Atue como um tech lead revisando uma solução que será colocada em produção interna. Qualidade, consistência, clareza arquitetural e segurança importam mais do que velocidade.

Sua tarefa é gerar um webapp completo e profissional com base nos requisitos abaixo.

CONTEXTO GERAL
Aplicação web interna, não exposta diretamente à internet
Sistema de cadastro e gestão de docentes
Banco de dados MySQL já existente, fornecido via docentes.sql
Backend e frontend no mesmo projeto usando Next.js
A solução deve respeitar o schema existente e pode criar schema complementar apenas para autenticação e suporte operacional do sistema
STACK OBRIGATÓRIA
Next.js com App Router
TypeScript
Server Actions, sem usar API Routes
Chakra UI
Prisma ORM com provider MySQL
Autenticação baseada em sessão com cookies HTTP-only
Zod para validação de entrada
bcrypt para hash de senha
BANCO DE DADOS
Use docentes.sql como fonte principal da estrutura do domínio.

O schema existente inclui:

docente
cargo
telefone
documentos
conta_bancaria
A solução deve:

Gerar schema Prisma compatível com o banco existente
Criar models tipados em TypeScript
Criar camada de acesso a dados com separação clara entre repository e service layer
Refletir constraints reais do banco nas validações da aplicação
Respeitar unicidade, nulabilidade, relacionamentos e comportamento de cascade do schema
Também é permitido criar tabelas complementares para autenticação do sistema, por exemplo:

usuario
sessao
opcionalmente tabela de apoio para controle de sessão
Essas tabelas complementares não substituem o schema existente de docentes; apenas suportam autenticação e operação da aplicação.

AUTENTICAÇÃO
Requisitos obrigatórios:

Login com usuário e senha
Sem JWT
Sem OAuth
Sessão baseada em cookies HTTP-only
Senhas armazenadas com hash seguro usando bcrypt
Usuário inicial admin provisionado por seed
Logout funcional
Proteção de rotas no server side
Apenas usuário autenticado pode acessar o sistema
A solução deve incluir:

Modelagem da tabela de usuários do sistema
Seed de um usuário administrador inicial
Gestão segura de sessão
Expiração e invalidação de sessão
Cookies configurados com HttpOnly, SameSite e Secure quando aplicável
SEGURANÇA
Mesmo sendo sistema interno, implemente segurança real.

Backend
Proteção contra SQL Injection usando Prisma e queries seguras
Validação de input com Zod
Sanitização e normalização de dados antes de persistir
Controle seguro de sessão
Proteção contra CSRF compatível com Server Actions
Verificação de origem quando aplicável
Tratamento de erros sem vazar detalhes sensíveis
Logs estruturados no servidor
Cabeçalhos de segurança adequados para aplicação interna
Frontend
Proteção básica contra XSS
Não expor hashes, tokens, sessões ou dados sensíveis no client
Feedback amigável sem revelar detalhes internos do backend
ARQUITETURA
Use uma estrutura profissional, organizada e escalável, por exemplo:

app
components
lib
services
repositories
types
validators
Mantenha separação clara de responsabilidades:

UI com Chakra UI
Regras de negócio em services
Acesso a dados em repositories
Validação em validators
Tipos compartilhados em types
Evite acoplamento indevido entre UI, persistência e lógica de domínio.

ESCOPO FUNCIONAL
CRUD completo de docentes
O CRUD deve incluir não apenas a entidade docente, mas também o gerenciamento das entidades relacionadas no mesmo fluxo funcional.

Inclui:

Criar docente
Visualizar docente
Editar docente
Deletar docente
Inclui também gerenciamento aninhado ou integrado de:

cargo
telefone
documentos
conta_bancaria
A solução deve permitir criar e editar os dados relacionados de forma consistente com as relações do banco.

Política de exclusão
A exclusão é hard delete
O comportamento esperado deve respeitar o cascade já definido no banco
Não implementar soft delete
Não implementar auditoria, salvo se for estritamente necessária para a solução técnica
LISTAGEM E TABELA PRINCIPAL
A listagem principal deve ser uma visão consolidada de docentes, com resumo dos dados relacionados quando fizer sentido para UX.

Requisitos obrigatórios:

Paginação
Ordenação
Busca e filtros
Interface moderna com Chakra UI
Filtros mínimos obrigatórios:

nome
matrícula
email
data de admissão
A tabela pode exibir:

dados principais do docente
indicadores ou resumos de cargos, telefones, documentos e conta bancária
ações de visualizar, editar e excluir
FORMULÁRIOS
Os formulários devem:

Refletir o schema real do banco
Aplicar validação server side e client side quando apropriado
Exibir feedback visual claro
Tratar erros de unicidade, formato e campos obrigatórios
Suportar edição das entidades relacionadas sem solução improvisada
RELATÓRIOS E EXPORTAÇÃO
Implementar exportação no backend usando Server Actions para:

CSV
PDF
Requisitos:

Exportar todos os docentes
Incluir dados relacionados em formato resumido
Disponibilizar botão na interface
Gerar o arquivo no backend
Definição do escopo da exportação:

CSV deve incluir os dados principais do docente e resumos úteis dos relacionamentos
PDF deve ser um relatório consolidado legível para uso interno
Não é necessário criar relatório analítico complexo, financeiro ou com layout avançado de BI
INTERFACE
A interface deve ter:

Layout moderno em estilo dashboard
Responsividade real
Loading states
Feedback visual para ações
Toasts e mensagens de erro amigáveis
Uso adequado dos componentes do Chakra UI, incluindo tabela, formulários, modal e feedbacks
SERVER ACTIONS
Usar Server Actions para:

login
logout
criação
edição
exclusão
exportação
Garantir:

tipagem forte
validação
tratamento de erros
proteção de acesso
separação entre action, service e repository
QUALIDADE DE CÓDIGO
Requisitos:

Código 100% em TypeScript
Tipagem forte, sem any
Separação limpa de responsabilidades
Comentários apenas para decisões importantes
Estrutura pronta para escalar
Mensagens de erro amigáveis ao usuário
Logs estruturados no servidor
Sem código de exemplo simplificado
Código real, consistente e utilizável em ambiente interno
EXECUÇÃO LOCAL
A entrega deve considerar execução local com:

MySQL local
arquivo .env.example
configuração do Prisma
seed inicial do admin
scripts de instalação, geração do client, seed e execução
README claro com instruções de setup e uso
ENTREGA
Você deve gerar:

Estrutura completa do projeto
Configuração do Prisma e conexão com MySQL
Models e tipos principais
Repositories e services
Sistema de autenticação funcional com sessão
Seed de admin inicial
CRUD completo de docente com entidades relacionadas
Listagem consolidada com filtros, ordenação e paginação
Exportação CSV funcional
Exportação PDF funcional
README completo com instruções
RESTRIÇÕES E FORA DE ESCOPO
Não usar:

API Routes
JWT
OAuth
soft delete
permissões por perfil
solução simplificada ou apenas demonstrativa
FORMA DE EXECUÇÃO
Gere em etapas e aguarde confirmação entre elas.

Ordem obrigatória:

Camada de dados
schema Prisma
tipos
validators
repositories
services base
Autenticação
tabelas complementares
seed admin
sessão e proteção de rotas
CRUD completo de docentes e entidades relacionadas
Listagem consolidada
Exportações
README e scripts finais
Comece pela camada de dados. Ao concluir essa primeira etapa, aguarde confirmação antes de continuar para autenticação.
