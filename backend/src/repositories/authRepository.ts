import { db } from "../config/database.js";
import { sql } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  const [rows] = await db.execute(sql`SELECT id,nome,email,senha,role,avatar_url,ativo FROM usuarios WHERE email=${email} LIMIT 1`);
  return (rows as any[])[0] ?? null;
}
export async function findUserById(id: number) {
  const [rows] = await db.execute(sql`SELECT id,nome,email,senha,role,avatar_url,ativo FROM usuarios WHERE id=${id} LIMIT 1`);
  return (rows as any[])[0] ?? null;
}
export async function createUser(name: string, email: string, passwordHash: string) {
  const [result] = await db.execute(sql`INSERT INTO usuarios (nome,email,senha,role,ativo) VALUES (${name},${email},${passwordHash},'aluno',TRUE)`);
  return Number((result as any).insertId);
}
export async function updateUser(id: number, name: string, email: string, avatarUrl?: string | null) {
  await db.execute(sql`UPDATE usuarios SET nome=${name}, email=${email}, avatar_url=${avatarUrl ?? null}, data_atualizacao=CURRENT_TIMESTAMP WHERE id=${id}`);
  return findUserById(id);
}
export async function updatePassword(id: number, hash: string) {
  await db.execute(sql`UPDATE usuarios SET senha=${hash}, data_atualizacao=CURRENT_TIMESTAMP WHERE id=${id}`);
}
