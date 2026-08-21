-- ============================================================
-- Projeto Social — Banco de Dados MariaDB
-- Compatível com o backend Node.js + TypeScript + Express
-- e com o frontend React + TypeScript deste projeto.
--
-- Banco: MariaDB / MySQL
-- Charset: utf8mb4
-- Engine: InnoDB
--
-- Este arquivo foi estruturado a partir da análise das entidades,
-- controllers, repositories, services, rotas e schema do projeto.
--
-- Tabelas:
--   usuarios
--   cursos
--   modulos
--   aulas
--   progresso_aulas
--   certificados
--   atividades
--   entregas_atividades
--   eventos
--   notificacoes
--   faq
--   contatos
--
-- Observação:
-- Senhas NÃO devem ser armazenadas em texto puro. O backend usa
-- bcrypt e grava somente o hash na coluna usuarios.senha.
-- ============================================================

CREATE DATABASE IF NOT EXISTS ProjetoSocial
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ProjetoSocial;

SET NAMES utf8mb4;

-- ============================================================
-- 1. USUÁRIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'aluno',
    avatar_url VARCHAR(500) NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email),
    KEY idx_usuarios_email (email),
    KEY idx_usuarios_role (role),

    CONSTRAINT chk_usuarios_role
        CHECK (role IN ('aluno', 'admin'))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. CURSOS
-- ============================================================

CREATE TABLE IF NOT EXISTS cursos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    imagem_url VARCHAR(500) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cursos_slug (slug),
    KEY idx_cursos_categoria (categoria),
    KEY idx_cursos_ativo (ativo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. MÓDULOS
-- Um curso possui vários módulos.
-- ============================================================

CREATE TABLE IF NOT EXISTS modulos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    curso_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    ordem INT NOT NULL DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_modulos_curso (curso_id),
    KEY idx_modulos_ordem (curso_id, ordem),

    CONSTRAINT fk_modulos_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. AULAS
-- Uma aula pertence a um módulo.
-- Vídeos, thumbnails e outros arquivos são armazenados como URL.
-- ============================================================

CREATE TABLE IF NOT EXISTS aulas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    modulo_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    conteudo LONGTEXT NOT NULL,
    video_url VARCHAR(1000) NULL,
    thumbnail_url VARCHAR(1000) NULL,
    duracao INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Duração em minutos',
    ordem INT NOT NULL DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_aulas_modulo (modulo_id),
    KEY idx_aulas_ordem (modulo_id, ordem),
    KEY idx_aulas_ativo (ativo),

    CONSTRAINT fk_aulas_modulo
        FOREIGN KEY (modulo_id)
        REFERENCES modulos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. PROGRESSO DAS AULAS
-- Relaciona usuários às aulas e registra o progresso individual.
-- ============================================================

CREATE TABLE IF NOT EXISTS progresso_aulas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id INT UNSIGNED NOT NULL,
    aula_id INT UNSIGNED NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    percentual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    data_inicio DATETIME NULL,
    data_conclusao DATETIME NULL,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_progresso_usuario_aula (usuario_id, aula_id),
    KEY idx_progresso_usuario (usuario_id),
    KEY idx_progresso_aula (aula_id),

    CONSTRAINT chk_progresso_percentual
        CHECK (percentual >= 0 AND percentual <= 100),

    CONSTRAINT fk_progresso_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_progresso_aula
        FOREIGN KEY (aula_id)
        REFERENCES aulas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. CERTIFICADOS
-- Um usuário pode possuir um certificado por curso.
-- ============================================================

CREATE TABLE IF NOT EXISTS certificados (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id INT UNSIGNED NOT NULL,
    curso_id INT UNSIGNED NOT NULL,
    codigo VARCHAR(100) NOT NULL,
    data_emissao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    arquivo_url VARCHAR(1000) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id),
    UNIQUE KEY uq_certificado_codigo (codigo),
    UNIQUE KEY uq_certificado_usuario_curso (usuario_id, curso_id),
    KEY idx_certificados_usuario (usuario_id),
    KEY idx_certificados_curso (curso_id),

    CONSTRAINT fk_certificado_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_certificado_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. ATIVIDADES
-- Pode estar vinculada a um curso e opcionalmente a uma aula.
-- ============================================================

CREATE TABLE IF NOT EXISTS atividades (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    curso_id INT UNSIGNED NOT NULL,
    aula_id INT UNSIGNED NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    prazo DATETIME NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id),
    KEY idx_atividades_curso (curso_id),
    KEY idx_atividades_aula (aula_id),
    KEY idx_atividades_prazo (prazo),
    KEY idx_atividades_ativo (ativo),

    CONSTRAINT fk_atividades_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_atividades_aula
        FOREIGN KEY (aula_id)
        REFERENCES aulas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. ENTREGAS DE ATIVIDADES
-- Guarda a resposta/status/nota de cada aluno em uma atividade.
-- ============================================================

CREATE TABLE IF NOT EXISTS entregas_atividades (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    atividade_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    resposta TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pendente',
    nota DECIMAL(5,2) NULL,
    data_envio DATETIME NULL,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_entrega_atividade_usuario (atividade_id, usuario_id),
    KEY idx_entregas_usuario (usuario_id),
    KEY idx_entregas_atividade (atividade_id),
    KEY idx_entregas_status (status),

    CONSTRAINT chk_entrega_nota
        CHECK (nota IS NULL OR (nota >= 0 AND nota <= 100)),

    CONSTRAINT fk_entrega_atividade
        FOREIGN KEY (atividade_id)
        REFERENCES atividades(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_entrega_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. EVENTOS
-- Eventos exibidos na área de eventos e no dashboard.
-- ============================================================

CREATE TABLE IF NOT EXISTS eventos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,
    data_evento DATETIME NOT NULL,
    horario VARCHAR(20) NULL,
    local VARCHAR(255) NULL,
    imagem_url VARCHAR(500) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_eventos_data (data_evento),
    KEY idx_eventos_ativo (ativo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 10. NOTIFICAÇÕES
-- Notificações pertencentes a cada usuário.
-- ============================================================

CREATE TABLE IF NOT EXISTS notificacoes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'info',
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_notificacoes_usuario (usuario_id),
    KEY idx_notificacoes_usuario_lida (usuario_id, lida),
    KEY idx_notificacoes_data (data_criacao),

    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. FAQ
-- Perguntas frequentes da página de ajuda.
-- ============================================================

CREATE TABLE IF NOT EXISTS faq (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    ordem INT NOT NULL DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id),
    KEY idx_faq_categoria (categoria),
    KEY idx_faq_ordem (categoria, ordem),
    KEY idx_faq_ativo (ativo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. CONTATOS
-- Mensagens enviadas pelo formulário de contato.
-- usuario_id é opcional porque o endpoint permite envio sem login.
-- ============================================================

CREATE TABLE IF NOT EXISTS contatos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id INT UNSIGNED NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'novo',
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_contatos_usuario (usuario_id),
    KEY idx_contatos_status (status),
    KEY idx_contatos_data (data_criacao),

    CONSTRAINT fk_contatos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- DADOS INICIAIS OPCIONAIS
--
-- Não é criado um usuário administrador aqui porque o backend
-- utiliza bcrypt para as senhas. É mais seguro cadastrar o
-- primeiro usuário pela API e depois promover o usuário:
--
-- UPDATE usuarios
-- SET role = 'admin'
-- WHERE email = 'seu-email@exemplo.com';
--
-- FAQ e cursos também não recebem dados fictícios automaticamente.
-- O conteúdo pode ser cadastrado pelo painel/API.
-- ============================================================


-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================

SELECT
    TABLE_NAME AS tabela
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
