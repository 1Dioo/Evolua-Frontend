import type { Request, Response } from "express";
import { z } from "zod";
import { sql } from "drizzle-orm";

import { db } from "../config/database.js";
import { fail, ok } from "../utils/api.js";
import { slugify } from "../utils/slug.js";
import { urlSchema } from "../utils/validation.js";

const courseSchema = z.object({
    titulo: z.string().min(2),
    descricao: z.string().min(2),
    categoria: z.string().min(2),
    imagemUrl: urlSchema.nullish(),
    ativo: z.boolean().optional(),
});

const moduleSchema = z.object({
    titulo: z.string().min(2),
    descricao: z.string().nullish(),
    ordem: z.coerce.number().int().positive().optional(),
    ativo: z.boolean().optional(),
});

const lessonSchema = z.object({
    titulo: z.string().min(2),
    descricao: z.string(),
    conteudo: z.string(),
    videoUrl: urlSchema.nullish(),
    thumbnailUrl: urlSchema.nullish(),
    duracao: z.coerce.number().int().nonnegative().optional(),
    ordem: z.coerce.number().int().positive().optional(),
    ativo: z.boolean().optional(),
});

const getId = (value: string | undefined): number => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : 0;
};

export async function listCourses(
    _req: Request,
    res: Response,
) {
    const [rows] = await db.execute(
        sql`
            SELECT *
            FROM cursos
            WHERE ativo = TRUE
            ORDER BY id DESC
        `,
    );

    return ok(res, rows);
}

export async function getCourse(
    req: Request,
    res: Response,
) {
    const idOrSlug = req.params.id;

    if (!idOrSlug) {
        return fail(res, "Curso não informado.", 400);
    }

    const numericId = getId(idOrSlug);

    const [rows] = await db.execute(
        sql`
            SELECT *
            FROM cursos
            WHERE ativo = TRUE
              AND (
                    id = ${numericId}
                    OR slug = ${idOrSlug}
              )
            LIMIT 1
        `,
    );

    const course = (rows as any[])[0];

    if (!course) {
        return fail(res, "Curso não encontrado.", 404);
    }

    const [modules] = await db.execute(
        sql`
            SELECT *
            FROM modulos
            WHERE curso_id = ${course.id}
              AND ativo = TRUE
            ORDER BY ordem, id
        `,
    );

    const [lessons] = await db.execute(
        sql`
            SELECT a.*
            FROM aulas a
            JOIN modulos m ON m.id = a.modulo_id
            WHERE m.curso_id = ${course.id}
              AND a.ativo = TRUE
            ORDER BY m.ordem, a.ordem, a.id
        `,
    );

    const moduleRows = modules as any[];
    const lessonRows = lessons as any[];

    return ok(res, {
        ...course,
        modulos: moduleRows.map((module) => ({
            ...module,
            aulas: lessonRows.filter(
                (lesson) => lesson.modulo_id === module.id,
            ),
        })),
    });
}

export async function createCourse(
    req: Request,
    res: Response,
) {
    const data = courseSchema.parse(req.body);

    const slug = slugify(
        typeof req.body.slug === "string" && req.body.slug.trim()
            ? req.body.slug
            : data.titulo,
    );

    const [result] = await db.execute(
        sql`
            INSERT INTO cursos (
                titulo,
                slug,
                descricao,
                categoria,
                imagem_url,
                ativo
            )
            VALUES (
                ${data.titulo},
                ${slug},
                ${data.descricao},
                ${data.categoria},
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
            slug,
        },
        201,
    );
}

export async function updateCourse(
    req: Request,
    res: Response,
) {
    const data = courseSchema.partial().parse(req.body);
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID do curso inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE cursos
            SET
                titulo = COALESCE(${data.titulo ?? null}, titulo),
                descricao = COALESCE(${data.descricao ?? null}, descricao),
                categoria = COALESCE(${data.categoria ?? null}, categoria),
                imagem_url = COALESCE(${data.imagemUrl ?? null}, imagem_url),
                ativo = COALESCE(${data.ativo ?? null}, ativo),
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return getCourse(req, res);
}

export async function deleteCourse(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID do curso inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE cursos
            SET
                ativo = FALSE,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return ok(res, { id });
}

export async function listModules(
    req: Request,
    res: Response,
) {
    const cursoId = getId(req.params.cursoId);

    if (!cursoId) {
        return fail(res, "ID do curso inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT *
            FROM modulos
            WHERE curso_id = ${cursoId}
              AND ativo = TRUE
            ORDER BY ordem, id
        `,
    );

    return ok(res, rows);
}

export async function createModule(
    req: Request,
    res: Response,
) {
    const data = moduleSchema.parse(req.body);
    const cursoId = getId(req.params.cursoId);

    if (!cursoId) {
        return fail(res, "ID do curso inválido.", 400);
    }

    const [result] = await db.execute(
        sql`
            INSERT INTO modulos (
                curso_id,
                titulo,
                descricao,
                ordem,
                ativo
            )
            VALUES (
                ${cursoId},
                ${data.titulo},
                ${data.descricao ?? null},
                ${data.ordem ?? 1},
                ${data.ativo ?? true}
            )
        `,
    );

    return ok(
        res,
        {
            id: Number((result as any).insertId),
            cursoId,
            ...data,
        },
        201,
    );
}

export async function updateModule(
    req: Request,
    res: Response,
) {
    const data = moduleSchema.partial().parse(req.body);
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID do módulo inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE modulos
            SET
                titulo = COALESCE(${data.titulo ?? null}, titulo),
                descricao = COALESCE(${data.descricao ?? null}, descricao),
                ordem = COALESCE(${data.ordem ?? null}, ordem),
                ativo = COALESCE(${data.ativo ?? null}, ativo),
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return ok(res, {
        id,
        ...data,
    });
}

export async function deleteModule(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID do módulo inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE modulos
            SET
                ativo = FALSE,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return ok(res, { id });
}

export async function listLessons(
    req: Request,
    res: Response,
) {
    const moduloId = getId(req.params.moduloId);

    if (!moduloId) {
        return fail(res, "ID do módulo inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT a.*
            FROM aulas a
            WHERE a.modulo_id = ${moduloId}
              AND a.ativo = TRUE
            ORDER BY a.ordem, a.id
        `,
    );

    return ok(res, rows);
}

export async function getLesson(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID da aula inválido.", 400);
    }

    const [rows] = await db.execute(
        sql`
            SELECT
                a.*,
                m.curso_id
            FROM aulas a
            JOIN modulos m ON m.id = a.modulo_id
            WHERE a.id = ${id}
              AND a.ativo = TRUE
            LIMIT 1
        `,
    );

    const lesson = (rows as any[])[0];

    if (!lesson) {
        return fail(res, "Aula não encontrada.", 404);
    }

    return ok(res, lesson);
}

export async function createLesson(
    req: Request,
    res: Response,
) {
    const data = lessonSchema.parse(req.body);
    const moduloId = getId(req.params.moduloId);

    if (!moduloId) {
        return fail(res, "ID do módulo inválido.", 400);
    }

    const [result] = await db.execute(
        sql`
            INSERT INTO aulas (
                modulo_id,
                titulo,
                descricao,
                conteudo,
                video_url,
                thumbnail_url,
                duracao,
                ordem,
                ativo
            )
            VALUES (
                ${moduloId},
                ${data.titulo},
                ${data.descricao},
                ${data.conteudo},
                ${data.videoUrl ?? null},
                ${data.thumbnailUrl ?? null},
                ${data.duracao ?? 0},
                ${data.ordem ?? 1},
                ${data.ativo ?? true}
            )
        `,
    );

    return ok(
        res,
        {
            id: Number((result as any).insertId),
            moduloId,
            ...data,
        },
        201,
    );
}

export async function updateLesson(
    req: Request,
    res: Response,
) {
    const data = lessonSchema.partial().parse(req.body);
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID da aula inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE aulas
            SET
                titulo = COALESCE(${data.titulo ?? null}, titulo),
                descricao = COALESCE(${data.descricao ?? null}, descricao),
                conteudo = COALESCE(${data.conteudo ?? null}, conteudo),
                video_url = COALESCE(${data.videoUrl ?? null}, video_url),
                thumbnail_url = COALESCE(${data.thumbnailUrl ?? null}, thumbnail_url),
                duracao = COALESCE(${data.duracao ?? null}, duracao),
                ordem = COALESCE(${data.ordem ?? null}, ordem),
                ativo = COALESCE(${data.ativo ?? null}, ativo),
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return ok(res, {
        id,
        ...data,
    });
}

export async function deleteLesson(
    req: Request,
    res: Response,
) {
    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID da aula inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE aulas
            SET
                ativo = FALSE,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return ok(res, { id });
}

export async function setVideo(
    req: Request,
    res: Response,
) {
    const data = z.object({
        videoUrl: urlSchema,
        thumbnailUrl: urlSchema.nullish(),
        duracao: z.coerce.number().int().nonnegative().optional(),
    }).parse(req.body);

    const id = getId(req.params.id);

    if (!id) {
        return fail(res, "ID da aula inválido.", 400);
    }

    await db.execute(
        sql`
            UPDATE aulas
            SET
                video_url = ${data.videoUrl},
                thumbnail_url = ${data.thumbnailUrl ?? null},
                duracao = COALESCE(${data.duracao ?? null}, duracao),
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ${id}
        `,
    );

    return getLesson(req, res);
}