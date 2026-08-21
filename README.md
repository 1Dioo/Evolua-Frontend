# Projeto Social — Plataforma Educacional

Frontend React + TypeScript da plataforma educacional do Projeto Social.

## Objetivo

A plataforma organiza cursos, aulas, atividades, progresso, certificados, eventos, notificações, perfil e ajuda para os alunos.

O frontend foi estruturado para funcionar de forma independente de ferramentas de geração de interface. A integração com API/MariaDB será conectada na segunda etapa do projeto.

---

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack React Query
- Tailwind CSS
- shadcn/ui
- Lucide React
- Zod
- React Hook Form
- Bun

---

## Backend + MariaDB

O projeto já possui uma API REST em `backend/` com Node.js, Express, JWT, bcrypt, Drizzle ORM e MariaDB.

### 1. Configurar o banco

Crie o banco `ProjetoSocial` no MariaDB e execute o arquivo:

`ProjetoSocial.sql`

Ele cria as tabelas utilizadas pela plataforma, incluindo `usuarios`.

### 2. Configurar as variáveis do backend

Dentro de `backend/`, copie:

```text
.env.example
```

para:

```text
.env
```

Ajuste principalmente:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_DO_MARIADB
DB_NAME=ProjetoSocial
JWT_SECRET=coloque-uma-chave-com-pelo-menos-32-caracteres
CORS_ORIGIN=http://localhost:5173
```

### 3. Instalar dependências

Na raiz do projeto:

```bash
bun install
```

### 4. Executar a API

Terminal 1:

```bash
bun run backend:dev
```

A API deverá ficar disponível em:

```text
http://localhost:3333
```

Teste:

```text
http://localhost:3333/health
```

O resultado esperado é uma resposta indicando que o serviço está `ok`.

### 5. Executar o frontend

Terminal 2:

```bash
bun run dev
```

Frontend:

```text
http://localhost:5173
```

O frontend usa por padrão:

```text
http://localhost:3333/api
```

Se precisar alterar, crie um `.env` na raiz baseado em `.env.example`:

```env
VITE_API_URL=http://localhost:3333/api
```

### Autenticação

O cadastro e login agora utilizam a API real:

```text
React
  ↓
POST /api/auth/register
  ↓
Express
  ↓
bcrypt
  ↓
MariaDB
  ↓
JWT + usuário
  ↓
React
```

As senhas não são armazenadas em texto puro. O backend gera um hash com bcrypt antes de inserir o usuário.

O token JWT e os dados básicos do usuário são mantidos no navegador para preservar a sessão durante a navegação e após recarregar a página.
