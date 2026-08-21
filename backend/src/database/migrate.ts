import { pool } from "../config/database.js";

const statements = [
`CREATE TABLE IF NOT EXISTS usuarios (
 id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
 senha VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'aluno', avatar_url VARCHAR(500) NULL,
 data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP, ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS cursos (
 id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(150) NOT NULL, slug VARCHAR(180) NOT NULL UNIQUE,
 descricao TEXT NOT NULL, categoria VARCHAR(150) NOT NULL, imagem_url VARCHAR(500) NULL,
 ativo BOOLEAN NOT NULL DEFAULT TRUE, data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS modulos (
 id INT AUTO_INCREMENT PRIMARY KEY, curso_id INT NOT NULL, titulo VARCHAR(150) NOT NULL, descricao TEXT NULL,
 ordem INT NOT NULL DEFAULT 1, ativo BOOLEAN NOT NULL DEFAULT TRUE, data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_modulos_curso(curso_id), CONSTRAINT fk_modulos_curso FOREIGN KEY(curso_id) REFERENCES cursos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS aulas (
 id INT AUTO_INCREMENT PRIMARY KEY, modulo_id INT NOT NULL, titulo VARCHAR(150) NOT NULL, descricao TEXT NOT NULL,
 conteudo LONGTEXT NOT NULL, video_url VARCHAR(1000) NULL, thumbnail_url VARCHAR(1000) NULL,
 duracao INT NOT NULL DEFAULT 0, ordem INT NOT NULL DEFAULT 1, ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP, data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_aulas_modulo(modulo_id), CONSTRAINT fk_aulas_modulo FOREIGN KEY(modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS progresso_aulas (
 id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, aula_id INT NOT NULL, concluida BOOLEAN NOT NULL DEFAULT FALSE,
 percentual DECIMAL(5,2) NOT NULL DEFAULT 0, data_inicio DATETIME NULL, data_conclusao DATETIME NULL,
 data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_progresso_usuario_aula(usuario_id,aula_id),
 CONSTRAINT fk_progresso_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
 CONSTRAINT fk_progresso_aula FOREIGN KEY(aula_id) REFERENCES aulas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS certificados (
 id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, curso_id INT NOT NULL, codigo VARCHAR(100) NOT NULL UNIQUE,
 data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP, arquivo_url VARCHAR(1000) NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE,
 UNIQUE KEY uq_certificado_usuario_curso(usuario_id,curso_id),
 CONSTRAINT fk_certificado_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
 CONSTRAINT fk_certificado_curso FOREIGN KEY(curso_id) REFERENCES cursos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS atividades (
 id INT AUTO_INCREMENT PRIMARY KEY, curso_id INT NOT NULL, aula_id INT NULL, titulo VARCHAR(180) NOT NULL,
 descricao TEXT NOT NULL, tipo VARCHAR(50) NOT NULL, data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
 prazo DATETIME NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE,
 CONSTRAINT fk_atividades_curso FOREIGN KEY(curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
 CONSTRAINT fk_atividades_aula FOREIGN KEY(aula_id) REFERENCES aulas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS entregas_atividades (
 id INT AUTO_INCREMENT PRIMARY KEY, atividade_id INT NOT NULL, usuario_id INT NOT NULL, resposta TEXT NULL,
 status VARCHAR(30) NOT NULL DEFAULT 'pendente', nota DECIMAL(5,2) NULL, data_envio DATETIME NULL,
 data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_entrega_atividade_usuario(atividade_id,usuario_id),
 CONSTRAINT fk_entrega_atividade FOREIGN KEY(atividade_id) REFERENCES atividades(id) ON DELETE CASCADE,
 CONSTRAINT fk_entrega_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS eventos (
 id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(180) NOT NULL, descricao TEXT NOT NULL, data_evento DATETIME NOT NULL,
 horario VARCHAR(20) NULL, local VARCHAR(255) NULL, imagem_url VARCHAR(500) NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS notificacoes (
 id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, titulo VARCHAR(180) NOT NULL, mensagem TEXT NOT NULL,
 tipo VARCHAR(50) NOT NULL DEFAULT 'info', lida BOOLEAN NOT NULL DEFAULT FALSE, data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_notificacoes_usuario(usuario_id),
 CONSTRAINT fk_notificacoes_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS faq (
 id INT AUTO_INCREMENT PRIMARY KEY, pergunta VARCHAR(500) NOT NULL, resposta TEXT NOT NULL, categoria VARCHAR(100) NOT NULL,
 ordem INT NOT NULL DEFAULT 1, ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
`CREATE TABLE IF NOT EXISTS contatos (
 id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NULL, nome VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL,
 assunto VARCHAR(255) NOT NULL, mensagem TEXT NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'novo',
 data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_contatos_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
];

async function main() {
  const conn = await pool.getConnection();
  try {
    for (const sql of statements) await conn.query(sql);

    // Evolução não destrutiva da primeira versão criada pela equipe.
    const [userCols] = await conn.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='usuarios'`);
    const userNames = new Set((userCols as any[]).map((r) => r.COLUMN_NAME));
    if (!userNames.has("role")) await conn.query(`ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'aluno' AFTER senha`);
    if (!userNames.has("avatar_url")) await conn.query(`ALTER TABLE usuarios ADD COLUMN avatar_url VARCHAR(500) NULL AFTER role`);
    if (!userNames.has("data_atualizacao")) await conn.query(`ALTER TABLE usuarios ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);

    // A primeira versão possuía aulas sem módulo. Preservamos os registros e
    // colocamos essas aulas em um curso/módulo de migração.
    const [lessonCols] = await conn.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='aulas'`);
    const lessonNames = new Set((lessonCols as any[]).map((r) => r.COLUMN_NAME));
    if (!lessonNames.has("modulo_id")) await conn.query(`ALTER TABLE aulas ADD COLUMN modulo_id INT NULL AFTER id`);
    if (!lessonNames.has("video_url")) await conn.query(`ALTER TABLE aulas ADD COLUMN video_url VARCHAR(1000) NULL`);
    if (!lessonNames.has("thumbnail_url")) await conn.query(`ALTER TABLE aulas ADD COLUMN thumbnail_url VARCHAR(1000) NULL`);
    if (!lessonNames.has("duracao")) await conn.query(`ALTER TABLE aulas ADD COLUMN duracao INT NOT NULL DEFAULT 0`);
    if (!lessonNames.has("ordem")) await conn.query(`ALTER TABLE aulas ADD COLUMN ordem INT NOT NULL DEFAULT 1`);
    if (!lessonNames.has("ativo")) await conn.query(`ALTER TABLE aulas ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE`);
    if (!lessonNames.has("data_criacao")) await conn.query(`ALTER TABLE aulas ADD COLUMN data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP`);
    if (!lessonNames.has("data_atualizacao")) await conn.query(`ALTER TABLE aulas ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);

    const [legacyCourses] = await conn.query(`SELECT id FROM cursos WHERE slug='conteudos-migrados' LIMIT 1`);
    let courseId = (legacyCourses as any[])[0]?.id;
    if (!courseId) {
      const [r] = await conn.query(`INSERT INTO cursos(titulo,slug,descricao,categoria) VALUES('Conteúdos migrados','conteudos-migrados','Conteúdos preservados da primeira versão do banco.','Informática Básica')`);
      courseId = (r as any).insertId;
    }
    const [legacyModules] = await conn.query(`SELECT id FROM modulos WHERE curso_id=? ORDER BY id LIMIT 1`, [courseId]);
    let moduleId = (legacyModules as any[])[0]?.id;
    if (!moduleId) {
      const [r] = await conn.query(`INSERT INTO modulos(curso_id,titulo,descricao,ordem) VALUES(?,?,?,1)`, [courseId,"Conteúdos existentes","Módulo criado durante a migração da primeira versão."]);
      moduleId = (r as any).insertId;
    }
    await conn.query(`UPDATE aulas SET modulo_id=? WHERE modulo_id IS NULL`, [moduleId]);

    console.log("Banco ProjetoSocial estruturado e compatível com a versão inicial.");
  } finally { conn.release(); await pool.end(); }
}
main().catch((err) => { console.error(err); process.exit(1); });
