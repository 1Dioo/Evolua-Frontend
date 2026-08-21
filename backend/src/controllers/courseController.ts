import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../config/database.js";
import { sql } from "drizzle-orm";
import { fail, ok } from "../utils/api.js";
import { slugify } from "../utils/slug.js";
import { urlSchema } from "../utils/validation.js";

const courseSchema = z.object({ titulo:z.string().min(2), descricao:z.string().min(2), categoria:z.string().min(2), imagemUrl:urlSchema.nullish(), ativo:z.boolean().optional() });
const moduleSchema = z.object({ titulo:z.string().min(2), descricao:z.string().nullish(), ordem:z.coerce.number().int().positive().optional(), ativo:z.boolean().optional() });
const lessonSchema = z.object({ titulo:z.string().min(2), descricao:z.string(), conteudo:z.string(), videoUrl:urlSchema.nullish(), thumbnailUrl:urlSchema.nullish(), duracao:z.coerce.number().int().nonnegative().optional(), ordem:z.coerce.number().int().positive().optional(), ativo:z.boolean().optional() });

export async function listCourses(_req:Request,res:Response) {
  const [rows]=await db.execute(sql`SELECT * FROM cursos WHERE ativo=TRUE ORDER BY id DESC`);
  return ok(res, rows);
}
export async function getCourse(req:Request,res:Response) {
  const idOrSlug=req.params.id;
  const [rows]=await db.execute(sql`SELECT * FROM cursos WHERE ativo=TRUE AND (id=${Number(idOrSlug)} OR slug=${idOrSlug}) LIMIT 1`);
  const course=(rows as any[])[0]; if(!course) return fail(res,"Curso não encontrado.",404);
  const [modules]=await db.execute(sql`SELECT * FROM modulos WHERE curso_id=${course.id} AND ativo=TRUE ORDER BY ordem,id`);
  const [lessons]=await db.execute(sql`SELECT a.* FROM aulas a JOIN modulos m ON m.id=a.modulo_id WHERE m.curso_id=${course.id} AND a.ativo=TRUE ORDER BY m.ordem,a.ordem,a.id`);
  return ok(res,{...course, modulos:(modules as any[]).map(m=>({...m,aulas:(lessons as any[]).filter(l=>l.modulo_id===m.id)}))});
}
export async function createCourse(req:Request,res:Response) {
  const x=courseSchema.parse(req.body); const slug=slugify(req.body.slug||x.titulo);
  const [r]=await db.execute(sql`INSERT INTO cursos(titulo,slug,descricao,categoria,imagem_url,ativo) VALUES(${x.titulo},${slug},${x.descricao},${x.categoria},${x.imagemUrl??null},${x.ativo??true})`);
  return ok(res,{id:Number((r as any).insertId),...x,slug},201);
}
export async function updateCourse(req:Request,res:Response) {
  const x=courseSchema.partial().parse(req.body); const id=Number(req.params.id);
  await db.execute(sql`UPDATE cursos SET titulo=COALESCE(${x.titulo??null},titulo), descricao=COALESCE(${x.descricao??null},descricao), categoria=COALESCE(${x.categoria??null},categoria), imagem_url=${x.imagemUrl??null}, ativo=COALESCE(${x.ativo??null},ativo), data_atualizacao=CURRENT_TIMESTAMP WHERE id=${id}`);
  return getCourse(req,res);
}
export async function deleteCourse(req:Request,res:Response) { await db.execute(sql`UPDATE cursos SET ativo=FALSE WHERE id=${Number(req.params.id)}`); return ok(res,{id:Number(req.params.id)}); }

export async function listModules(req:Request,res:Response) {
  const [rows]=await db.execute(sql`SELECT * FROM modulos WHERE curso_id=${Number(req.params.cursoId)} AND ativo=TRUE ORDER BY ordem,id`); return ok(res,rows);
}
export async function createModule(req:Request,res:Response) {
  const x=moduleSchema.parse(req.body); const [r]=await db.execute(sql`INSERT INTO modulos(curso_id,titulo,descricao,ordem,ativo) VALUES(${Number(req.params.cursoId)},${x.titulo},${x.descricao??null},${x.ordem??1},${x.ativo??true})`); return ok(res,{id:Number((r as any).insertId),cursoId:Number(req.params.cursoId),...x},201);
}
export async function updateModule(req:Request,res:Response) { const x=moduleSchema.partial().parse(req.body); await db.execute(sql`UPDATE modulos SET titulo=COALESCE(${x.titulo??null},titulo),descricao=${x.descricao??null},ordem=COALESCE(${x.ordem??null},ordem),ativo=COALESCE(${x.ativo??null},ativo),data_atualizacao=CURRENT_TIMESTAMP WHERE id=${Number(req.params.id)}`); return ok(res,{id:Number(req.params.id),...x}); }
export async function deleteModule(req:Request,res:Response) { await db.execute(sql`UPDATE modulos SET ativo=FALSE WHERE id=${Number(req.params.id)}`); return ok(res,{id:Number(req.params.id)}); }

export async function listLessons(req:Request,res:Response) { const [rows]=await db.execute(sql`SELECT a.* FROM aulas a WHERE a.modulo_id=${Number(req.params.moduloId)} AND a.ativo=TRUE ORDER BY a.ordem,a.id`); return ok(res,rows); }
export async function getLesson(req:Request,res:Response) { const [rows]=await db.execute(sql`SELECT a.*,m.curso_id FROM aulas a JOIN modulos m ON m.id=a.modulo_id WHERE a.id=${Number(req.params.id)} AND a.ativo=TRUE LIMIT 1`); const r=(rows as any[])[0]; if(!r)return fail(res,"Aula não encontrada.",404); return ok(res,r); }
export async function createLesson(req:Request,res:Response) { const x=lessonSchema.parse(req.body); const [r]=await db.execute(sql`INSERT INTO aulas(modulo_id,titulo,descricao,conteudo,video_url,thumbnail_url,duracao,ordem,ativo) VALUES(${Number(req.params.moduloId)},${x.titulo},${x.descricao},${x.conteudo},${x.videoUrl??null},${x.thumbnailUrl??null},${x.duracao??0},${x.ordem??1},${x.ativo??true})`); return ok(res,{id:Number((r as any).insertId),moduloId:Number(req.params.moduloId),...x},201); }
export async function updateLesson(req:Request,res:Response) { const x=lessonSchema.partial().parse(req.body); const id=Number(req.params.id); await db.execute(sql`UPDATE aulas SET titulo=COALESCE(${x.titulo??null},titulo),descricao=COALESCE(${x.descricao??null},descricao),conteudo=COALESCE(${x.conteudo??null},conteudo),video_url=${x.videoUrl??null},thumbnail_url=${x.thumbnailUrl??null},duracao=COALESCE(${x.duracao??null},duracao),ordem=COALESCE(${x.ordem??null},ordem),ativo=COALESCE(${x.ativo??null},ativo),data_atualizacao=CURRENT_TIMESTAMP WHERE id=${id}`); return ok(res,{id,...x}); }
export async function deleteLesson(req:Request,res:Response) { await db.execute(sql`UPDATE aulas SET ativo=FALSE WHERE id=${Number(req.params.id)}`); return ok(res,{id:Number(req.params.id)}); }
export async function setVideo(req:Request,res:Response) { const x=z.object({videoUrl:urlSchema,thumbnailUrl:urlSchema.nullish(),duracao:z.coerce.number().int().nonnegative().optional()}).parse(req.body); await db.execute(sql`UPDATE aulas SET video_url=${x.videoUrl},thumbnail_url=${x.thumbnailUrl??null},duracao=COALESCE(${x.duracao??null},duracao),data_atualizacao=CURRENT_TIMESTAMP WHERE id=${Number(req.params.id)}`); return getLesson(req,res); }
