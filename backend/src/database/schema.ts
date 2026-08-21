import { mysqlTable, int, varchar, text, boolean, datetime, decimal, uniqueIndex, index } from "drizzle-orm/mysql-core";

export const usuarios = mysqlTable("usuarios", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  senha: varchar("senha", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("aluno"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  dataCadastro: datetime("data_cadastro").defaultNow().notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [uniqueIndex("uq_usuarios_email").on(t.email), index("idx_usuarios_email").on(t.email)]);

export const cursos = mysqlTable("cursos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  descricao: text("descricao").notNull(),
  categoria: varchar("categoria", { length: 150 }).notNull(),
  imagemUrl: varchar("imagem_url", { length: 500 }),
  ativo: boolean("ativo").default(true).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull(),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [uniqueIndex("uq_cursos_slug").on(t.slug), index("idx_cursos_categoria").on(t.categoria)]);

export const modulos = mysqlTable("modulos", {
  id: int("id").autoincrement().primaryKey(),
  cursoId: int("curso_id").notNull(),
  titulo: varchar("titulo", { length: 150 }).notNull(),
  descricao: text("descricao"),
  ordem: int("ordem").default(1).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull(),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [index("idx_modulos_curso").on(t.cursoId)]);

export const aulas = mysqlTable("aulas", {
  id: int("id").autoincrement().primaryKey(),
  moduloId: int("modulo_id").notNull(),
  titulo: varchar("titulo", { length: 150 }).notNull(),
  descricao: text("descricao").notNull(),
  conteudo: text("conteudo").notNull(),
  videoUrl: varchar("video_url", { length: 1000 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  duracao: int("duracao").default(0).notNull(),
  ordem: int("ordem").default(1).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull(),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [index("idx_aulas_modulo").on(t.moduloId)]);

export const progressoAulas = mysqlTable("progresso_aulas", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuario_id").notNull(),
  aulaId: int("aula_id").notNull(),
  concluida: boolean("concluida").default(false).notNull(),
  percentual: decimal("percentual", { precision: 5, scale: 2 }).default("0").notNull(),
  dataInicio: datetime("data_inicio"),
  dataConclusao: datetime("data_conclusao"),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [uniqueIndex("uq_progresso_usuario_aula").on(t.usuarioId, t.aulaId)]);

export const certificados = mysqlTable("certificados", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuario_id").notNull(),
  cursoId: int("curso_id").notNull(),
  codigo: varchar("codigo", { length: 100 }).notNull(),
  dataEmissao: datetime("data_emissao").defaultNow().notNull(),
  arquivoUrl: varchar("arquivo_url", { length: 1000 }),
  ativo: boolean("ativo").default(true).notNull()
}, (t) => [uniqueIndex("uq_certificado_codigo").on(t.codigo), uniqueIndex("uq_certificado_usuario_curso").on(t.usuarioId, t.cursoId)]);

export const atividades = mysqlTable("atividades", {
  id: int("id").autoincrement().primaryKey(),
  cursoId: int("curso_id").notNull(),
  aulaId: int("aula_id"),
  titulo: varchar("titulo", { length: 180 }).notNull(),
  descricao: text("descricao").notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull(),
  prazo: datetime("prazo"),
  ativo: boolean("ativo").default(true).notNull()
});

export const entregasAtividades = mysqlTable("entregas_atividades", {
  id: int("id").autoincrement().primaryKey(),
  atividadeId: int("atividade_id").notNull(),
  usuarioId: int("usuario_id").notNull(),
  resposta: text("resposta"),
  status: varchar("status", { length: 30 }).default("pendente").notNull(),
  nota: decimal("nota", { precision: 5, scale: 2 }),
  dataEnvio: datetime("data_envio"),
  dataAtualizacao: datetime("data_atualizacao").defaultNow().notNull()
}, (t) => [uniqueIndex("uq_entrega_atividade_usuario").on(t.atividadeId, t.usuarioId)]);

export const eventos = mysqlTable("eventos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 180 }).notNull(),
  descricao: text("descricao").notNull(),
  dataEvento: datetime("data_evento").notNull(),
  horario: varchar("horario", { length: 20 }),
  local: varchar("local", { length: 255 }),
  imagemUrl: varchar("imagem_url", { length: 500 }),
  ativo: boolean("ativo").default(true).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull()
});

export const notificacoes = mysqlTable("notificacoes", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuario_id").notNull(),
  titulo: varchar("titulo", { length: 180 }).notNull(),
  mensagem: text("mensagem").notNull(),
  tipo: varchar("tipo", { length: 50 }).default("info").notNull(),
  lida: boolean("lida").default(false).notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull()
}, (t) => [index("idx_notificacoes_usuario").on(t.usuarioId)]);

export const faq = mysqlTable("faq", {
  id: int("id").autoincrement().primaryKey(),
  pergunta: varchar("pergunta", { length: 500 }).notNull(),
  resposta: text("resposta").notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  ordem: int("ordem").default(1).notNull(),
  ativo: boolean("ativo").default(true).notNull()
});

export const contatos = mysqlTable("contatos", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuario_id"),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  assunto: varchar("assunto", { length: 255 }).notNull(),
  mensagem: text("mensagem").notNull(),
  status: varchar("status", { length: 30 }).default("novo").notNull(),
  dataCriacao: datetime("data_criacao").defaultNow().notNull()
});
