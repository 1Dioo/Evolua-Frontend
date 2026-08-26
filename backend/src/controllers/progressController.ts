import type { Request, Response } from "express";
import { z } from "zod";
import { sql } from "drizzle-orm";

import { db } from "../config/database.js";
import { fail, ok } from "../utils/api.js";

const progressSchema = z.object({
    percentual: z.coerce.number().min(0).max(100),
    concluida: z.boolean().optional(),
});

const getId = (value: string | undefined): number => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : 0;
};

export async function upsertProgress(
    req: Request,
    res: Response,
) {
    const data = progressSchema.parse(req.body);

    const uid = Number(req.user!.sub);
    const aulaId = getId(req.params.aulaId);

    if (!aulaId) {
        return fail(res, "ID da aula inválido.", 400);
    }

    const concluida =
        data.concluida ?? data.percentual >= 100;

    const completionDate = concluida
        ? new Date()
        : null;

    await db.execute(
        sql`
            INSERT INTO progresso_aulas (
                usuario_id,
                aula_id,
                concluida,
                percentual,
                data_inicio,
                data_conclusao
            )
            VALUES (
                ${uid},
                ${aulaId},
                ${concluida},
                ${data.percentual},
                CURRENT_TIMESTAMP,
                ${completionDate}
            )
            ON DUPLICATE KEY UPDATE
                concluida = ${concluida},
                percentual = ${data.percentual},
                data_conclusao = ${completionDate},
                data_atualizacao = CURRENT_TIMESTAMP
        `,
    );

    return ok(res, {
        aulaId,
        percentual: data.percentual,
        concluida,
    });
}

export async function complete(
    req: Request,
    res: Response,
) {
    req.body = {
        percentual: 100,
        concluida: true,
    };

    return upsertProgress(req, res);
}

export async function listProgress(
    req: Request,
    res: Response,
) {
    const uid = Number(req.user!.sub);

    const [rows] = await db.execute(
        sql`
            SELECT p.*
            FROM progresso_aulas p
            WHERE p.usuario_id = ${uid}
            ORDER BY p.aula_id
        `,
    );

    return ok(res, rows);
}

export async function courseProgress(
    req: Request,
    res: Response,
) {
    const uid = Number(req.user!.sub);
    const cursoId = getId(req.params.cursoId);

    if (!cursoId) {
        return fail(res, "ID do curso inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT
                COUNT(a.id) AS total_aulas,
                SUM(
                    CASE
                        WHEN COALESCE(
                            p.concluida,
                            FALSE
                        ) = TRUE
                        THEN 1
                        ELSE 0
                    END
                ) AS aulas_concluidas,
                ROUND(
                    COALESCE(
                        AVG(
                            COALESCE(
                                p.percentual,
                                0
                            )
                        ),
                        0
                    ),
                    2
                ) AS percentual
            FROM aulas a
            JOIN modulos m
                ON m.id = a.modulo_id
            LEFT JOIN progresso_aulas p
                ON p.aula_id = a.id
                AND p.usuario_id = ${uid}
            WHERE m.curso_id = ${cursoId}
              AND a.ativo = TRUE
        `,
    );

    return ok(res, (rows as any[])[0]);
}