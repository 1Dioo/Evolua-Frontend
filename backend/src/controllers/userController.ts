import type { Request, Response } from "express";
import { z } from "zod";
import { sql } from "drizzle-orm";

import { db } from "../config/database.js";
import {
    fail,
    ok,
    sanitizeUser,
} from "../utils/api.js";
import {
    emailSchema,
    urlSchema,
} from "../utils/validation.js";

export async function me(
    req: Request,
    res: Response,
) {
    const id = Number(req.user!.sub);

    const [rows] = await db.execute(
        sql`
            SELECT
                id,
                nome,
                email,
                role,
                avatar_url,
                ativo,
                data_cadastro
            FROM usuarios
            WHERE id = ${id}
            LIMIT 1
        `,
    );

    const user = (rows as any[])[0];

    if (!user) {
        return fail(
            res,
            "Usuário não encontrado.",
            404,
        );
    }

    return ok(res, sanitizeUser(user));
}

export async function updateMe(
    req: Request,
    res: Response,
) {
    const data = z.object({
        nome: z.string().min(3).optional(),
        email: emailSchema.optional(),
        avatarUrl: urlSchema.nullish(),
    }).parse(req.body);

    const id = Number(req.user!.sub);

    if (data.email) {
        const [duplicate] = await db.execute(
            sql`
                SELECT id
                FROM usuarios
                WHERE email = ${data.email}
                  AND id <> ${id}
                LIMIT 1
            `,
        );

        if ((duplicate as any[]).length > 0) {
            return fail(
                res,
                "E-mail já está em uso.",
                409,
            );
        }
    }

    await db.execute(
        sql`
            UPDATE usuarios
            SET
                nome = COALESCE(${data.nome ?? null}, nome),
                email = COALESCE(${data.email ?? null}, email),
                avatar_url = COALESCE(
                    ${data.avatarUrl ?? null},
                    avatar_url
                ),
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return me(req, res);
}