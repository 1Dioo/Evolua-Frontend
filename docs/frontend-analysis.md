# Análise técnica — Etapa 1: Frontend

## Diagnóstico inicial

A base enviada continha:

- React + TypeScript com TanStack Start/Router.
- Layout responsivo já estruturado.
- Páginas de dashboard, cursos, aula, atividades, certificados, eventos, notificações, perfil, ajuda e configurações.
- Serviços preparados para futura API.
- Dados temporários em `src/data`.
- Estado de perfil e notificações persistido em `localStorage`.
- Token de autenticação persistido em `localStorage`.
- Rotas API internas baseadas em dados temporários.
- Um segundo conjunto de arquivos de backend dentro de `src/backend`.
- Configuração e dependência específicas da Lovable.
- Referências à Lovable em `AGENTS.md`, `README.md`, `vite.config.ts`, tratamento de erros e `package.json`.

## Limpeza realizada

- Removidas todas as referências textuais à Lovable.
- Removida a dependência `@lovable.dev/vite-tanstack-config`.
- Substituída a configuração Vite por configuração padrão do ecossistema TanStack/Vite.
- Removidos os endpoints API internos que dependiam de dados temporários.
- Removida a camada de backend duplicada dentro de `src/backend`.
- Removido o armazenamento local de token, perfil e notificações.
- Removido o armazenamento local de tema e sidebar.
- Removidos os dados de identidade fixa do usuário da interface.
- Criadas rotas de Login e Cadastro.
- Criada sessão de frontend em memória para validação da navegação antes da API.
- Adicionada proteção das rotas internas.
- Logout passou a realmente encerrar a sessão de frontend.
- Perfil passou a usar o usuário autenticado da sessão.
- Notificações deixaram de possuir seeds fixos e foram preparadas como estado substituível pela API.
- Dados temporários restantes foram isolados em `src/demo/`.

## Estado temporário

`src/demo/` existe exclusivamente para validar a interface antes da integração com a API.

Ele não deve ser tratado como banco de dados nem como persistência do usuário.

Na Etapa 2, os serviços serão conectados ao backend e os imports de `src/demo/` serão substituídos por chamadas reais.

## Rotas frontend

### Públicas

- `/login`
- `/cadastro`

### Protegidas

- `/`
- `/cursos`
- `/cursos/:courseSlug`
- `/cursos/:courseSlug/aula/:lessonId`
- `/atividades`
- `/certificados`
- `/eventos`
- `/notificacoes`
- `/perfil`
- `/configuracoes`
- `/ajuda`

## Próxima etapa

Depois da validação visual e funcional desta etapa:

1. Conectar autenticação real.
2. Conectar perfil à API.
3. Substituir cursos/aulas por consultas MariaDB.
4. Persistir progresso.
5. Persistir atividades e entregas.
6. Persistir certificados.
7. Persistir eventos e inscrições.
8. Persistir notificações e gerar notificações por eventos reais.
9. Implementar contatos e FAQ via API.
10. Integrar dashboard com dados agregados reais.
11. Configurar MariaDB e `database.sql`.
12. Testar frontend + backend de ponta a ponta.
