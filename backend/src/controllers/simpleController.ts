import type { Request, Response } from "express";
import { z } from "zod";
import { sql } from "drizzle-orm";

import { db, pool } from "../config/database.js";
import { fail, ok } from "../utils/api.js";

const schemas = {
    evento: z.object({
        titulo: z.string().min(2),
        descricao: z.string().min(2),
        dataEvento: z.string(),
        horario: z.string().optional(),
        local: z.string().optional(),
        imagemUrl: z.string().url().optional(),
        ativo: z.boolean().optional(),
    }),

    faq: z.object({
        pergunta: z.string().min(3),
        resposta: z.string().min(3),
        categoria: z.string().min(2),
        ordem: z.number().int().optional(),
        ativo: z.boolean().optional(),
    }),

    atividade: z.object({
        cursoId: z.number().int().positive(),
        aulaId: z.number().int().positive().nullish(),
        titulo: z.string().min(2),
        descricao: z.string().min(2),
        tipo: z.string().min(2),
        prazo: z.string().nullish(),
        ativo: z.boolean().optional(),
    }),

    contato: z.object({
        nome: z.string().min(3),
        email: z.string().email(),
        assunto: z.string().min(3),
        mensagem: z.string().min(10),
    }),
};

const tableMap = {
    evento: "eventos",
    faq: "faq",
    atividade: "atividades",
} as const;

type SimpleTable = keyof typeof tableMap;

function isSimpleTable(
    table: string,
): table is SimpleTable {
    return table in tableMap;
}

function getId(value: string | undefined): number {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : 0;
}

export async function list(
    table: string,
    _req: Request,
    res: Response,
) {
    if (!isSimpleTable(table)) {
        return fail(res, "Tabela inválida.", 400);
    }

    const tableName = tableMap[table];

    const [rows] = await db.execute(
        sql.raw(
            `SELECT * FROM ${tableName} WHERE ativo = TRUE ORDER BY id DESC`,
        ),
    );

    return ok(res, rows);
}

export async function get(
    table: string,
    req: Request,
    res: Response,
) {
    if (!isSimpleTable(table)) {
        return fail(res, "Tabela inválida.", 400);
    }

    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    const tableName = tableMap[table];

    const [rows] = await db.execute(
        sql.raw(
            `SELECT * FROM ${tableName} WHERE id = ${id} LIMIT 1`,
        ),
    );

    const item = (rows as any[])[0];

    if (!item) {
        return fail(
            res,
            "Registro não encontrado.",
            404,
        );
    }

    return ok(res, item);
}

export async function create(
    table: string,
    req: Request,
    res: Response,
) {
    if (!isSimpleTable(table)) {
        return fail(res, "Tabela inválida.", 400);
    }

    if (table === "evento") {
        const data = schemas.evento.parse(req.body);

        const [result] = await db.execute(
            sql`
                INSERT INTO eventos (
                    titulo,
                    descricao,
                    data_evento,
                    horario,
                    local,
                    imagem_url,
                    ativo
                )
                VALUES (
                    ${data.titulo},
                    ${data.descricao},
                    ${new Date(data.dataEvento)},
                    ${data.horario ?? null},
                    ${data.local ?? null},
                    ${data.imagemUrl ?? null},
                    ${data.ativo ?? true}
                )
            `,
        );

        return ok(
            res,
            {
                id: Number((result as any).insertId),
                ...data,
            },
            201,
        );
    }

    if (table === "faq") {
        const data = schemas.faq.parse(req.body);

        const [result] = await db.execute(
            sql`
                INSERT INTO faq (
                    pergunta,
                    resposta,
                    categoria,
                    ordem,
                    ativo
                )
                VALUES (
                    ${data.pergunta},
                    ${data.resposta},
                    ${data.categoria},
                    ${data.ordem ?? 1},
                    ${data.ativo ?? true}
                )
            `,
        );

        return ok(
            res,
            {
                id: Number((result as any).insertId),
                ...data,
            },
            201,
        );
    }

    const data = schemas.atividade.parse(req.body);

    const [result] = await db.execute(
        sql`
            INSERT INTO atividades (
                curso_id,
                aula_id,
                titulo,
                descricao,
                tipo,
                prazo,
                ativo
            )
            VALUES (
                ${data.cursoId},
                ${data.aulaId ?? null},
                ${data.titulo},
                ${data.descricao},
                ${data.tipo},
                ${data.prazo ? new Date(data.prazo) : null},
                ${data.ativo ?? true}
            )
        `,
    );

    return ok(
        res,
        {
            id: Number((result as any).insertId),
            ...data,
        },
        201,
    );
}

export async function update(
    table: string,
    req: Request,
    res: Response,
) {
    if (!isSimpleTable(table)) {
        return fail(res, "Tabela inválida.", 400);
    }

    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    const schemasByTable = {
        evento: schemas.evento,
        faq: schemas.faq,
        atividade: schemas.atividade,
    };

    const data = schemasByTable[table]
        .partial()
        .parse(req.body);

    const columns = {
        evento: {
            titulo: "titulo",
            descricao: "descricao",
            dataEvento: "data_evento",
            horario: "horario",
            local: "local",
            imagemUrl: "imagem_url",
            ativo: "ativo",
        },

        faq: {
            pergunta: "pergunta",
            resposta: "resposta",
            categoria: "categoria",
            ordem: "ordem",
            ativo: "ativo",
        },

        atividade: {
            cursoId: "curso_id",
            aulaId: "aula_id",
            titulo: "titulo",
            descricao: "descricao",
            tipo: "tipo",
            prazo: "prazo",
            ativo: "ativo",
        },
    } as const;

    const allowed = Object.keys(
        columns[table],
    ) as Array<keyof typeof columns[typeof table]>;

    const fields = allowed.filter(
        (key) =>
            data[key as keyof typeof data] !== undefined,
    );

    if (!fields.length) {
        return get(table, req, res);
    }

    const values = fields.map((key) => {
        const value =
            data[key as keyof typeof data];

        if (
            key === "dataEvento" ||
            key === "prazo"
        ) {
            return value
                ? new Date(value as string)
                : null;
        }

        return value;
    });

    const assignments = fields
        .map(
            (key) =>
                `${columns[table][key]} = ?`,
        )
        .join(", ");

    await pool.execute(
        `UPDATE ${tableMap[table]} SET ${assignments} WHERE id = ?`,
        [...values, id],
    );

    return get(table, req, res);
}

export async function remove(
    table: string,
    req: Request,
    res: Response,
) {
    if (!isSimpleTable(table)) {
        return fail(res, "Tabela inválida.", 400);
    }

    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    await db.execute(
        sql.raw(
            `UPDATE ${tableMap[table]} SET ativo = FALSE WHERE id = ${id}`,
        ),
    );

    return ok(res, { id });
}

export async function createContact(
    req: Request,
    res: Response,
) {
    const data = schemas.contato.parse(req.body);

    const usuarioId = req.user
        ? Number(req.user.sub)
        : null;

    await db.execute(
        sql`
            INSERT INTO contatos (
                usuario_id,
                nome,
                email,
                assunto,
                mensagem
            )
            VALUES (
                ${usuarioId},
                ${data.nome},
                ${data.email},
                ${data.assunto},
                ${data.mensagem}
            )
        `,
    );

    return ok(
        res,
        {
            message: "Mensagem enviada.",
        },
        201,
    );
}

export async function notifications(
    req: Request,
    res: Response,
) {
    const uid = Number(req.user!.sub);

    const [rows] = await db.execute(
        sql`
            SELECT *
            FROM notificacoes
            WHERE usuario_id = ${uid}
            ORDER BY data_criacao DESC
        `,
    );

    return ok(res, rows);
}

export async function markRead(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);
    const uid = Number(req.user!.sub);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE notificacoes
            SET lida = TRUE
            WHERE id = ${id}
              AND usuario_id = ${uid}
        `,
    );

    return ok(res, {
        id,
        lida: true,
    });
}

export async function markAllRead(
    req: Request,
    res: Response,
) {
    const uid = Number(req.user!.sub);

    await db.execute(
        sql`
            UPDATE notificacoes
            SET lida = TRUE
            WHERE usuario_id = ${uid}
        `,
    );

    return ok(res, {
        ok: true,
    });
}

export async function deleteNotification(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);
    const uid = Number(req.user!.sub);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    await db.execute(
        sql`
            DELETE FROM notificacoes
            WHERE id = ${id}
              AND usuario_id = ${uid}
        `,
    );

    return ok(res, { id });
}

export async function certificates(
    req: Request,
    res: Response,
) {
    const uid = Number(req.user!.sub);

    const [rows] = await db.execute(
        sql`
            SELECT
                c.*,
                cu.titulo AS curso
            FROM certificados c
            JOIN cursos cu
                ON cu.id = c.curso_id
            WHERE c.usuario_id = ${uid}
              AND c.ativo = TRUE
            ORDER BY c.data_emissao DESC
        `,
    );

    return ok(res, rows);
}

export async function certificate(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT
                c.*,
                cu.titulo AS curso,
                u.nome AS usuario
            FROM certificados c
            JOIN cursos cu
                ON cu.id = c.curso_id
            JOIN usuarios u
                ON u.id = c.usuario_id
            WHERE c.id = ${id}
              AND c.ativo = TRUE
            LIMIT 1
        `,
    );

    const item = (rows as any[])[0];

    if (!item) {
        return fail(
            res,
            "Certificado não encontrado.",
            404,
        );
    }

    return ok(res, item);
}

export async function validateCertificate(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT
                c.codigo,
                c.data_emissao,
                cu.titulo AS curso,
                u.nome AS usuario
            FROM certificados c
            JOIN cursos cu
                ON cu.id = c.curso_id
            JOIN usuarios u
                ON u.id = c.usuario_id
            WHERE c.id = ${id}
              AND c.ativo = TRUE
            LIMIT 1
        `,
    );

    const item = (rows as any[])[0];

    if (!item) {
        return fail(
            res,
            "Certificado inválido.",
            404,
        );
    }

    return ok(res, {
        valido: true,
        ...item,
    });
}