# Backend — Projeto Social

API REST em Node.js + TypeScript + Express, com MariaDB e Drizzle ORM.

## Desenvolvimento

1. Copie `.env.example` para `.env` dentro de `backend/`.
2. Crie o banco MariaDB indicado em `DB_NAME` (ex.: `ProjetoSocial`).
3. Instale as dependências na raiz com `bun install`.
4. Execute `bun run db:migrate`.
5. Inicie a API com `bun run backend:dev`.

A API ficará em `http://localhost:3333` por padrão.

## Autenticação

`POST /api/auth/register` e `POST /api/auth/login` retornam JWT. O frontend deve enviar:

`Authorization: Bearer <token>`

Senhas são armazenadas somente como hash bcrypt.

## Banco

`backend/src/database/schema.ts` documenta as entidades. `backend/src/database/migrate.ts` cria as tabelas sem apagar a primeira versão existente do banco.

## Regras

- aluno: leitura de cursos/aulas, progresso, certificados, eventos, notificações e edição do próprio perfil.
- admin: operações de gerenciamento de cursos, módulos, aulas, vídeos, atividades, eventos e FAQ.
- vídeos, imagens e PDFs são referenciados por URL/caminho, nunca como BLOB por padrão.
