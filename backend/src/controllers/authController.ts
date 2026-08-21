import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { createUser, findUserByEmail, findUserById, updatePassword } from "../repositories/authRepository.js";
import { emailSchema, passwordSchema } from "../utils/validation.js";
import { fail, ok, sanitizeUser } from "../utils/api.js";

const registerSchema = z.object({ nome: z.string().trim().min(3).max(255), email: emailSchema, senha: passwordSchema });
const loginSchema = z.object({ email: emailSchema, senha: passwordSchema });
function token(id: number, role: "aluno"|"admin") { return jwt.sign({ sub: String(id), role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions); }

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  if (await findUserByEmail(input.email)) return fail(res, "E-mail já cadastrado.", 409);
  const id = await createUser(input.nome, input.email, await bcrypt.hash(input.senha, 12));
  const user = await findUserById(id);
  return ok(res, { token: token(id, "aluno"), user: sanitizeUser(user) }, 201);
}
export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const user = await findUserByEmail(input.email);
  if (!user || !user.ativo || !(await bcrypt.compare(input.senha, user.senha))) return fail(res, "E-mail ou senha inválidos.", 401);
  return ok(res, { token: token(Number(user.id), user.role), user: sanitizeUser(user) });
}
export async function me(req: Request, res: Response) {
  const user = await findUserById(Number(req.user!.sub));
  if (!user?.ativo) return fail(res, "Usuário não encontrado.", 404);
  return ok(res, sanitizeUser(user));
}
export async function logout(_req: Request, res: Response) { return ok(res, { ok: true }); }
export async function changePassword(req: Request, res: Response) {
  const schema = z.object({ senhaAtual: passwordSchema, novaSenha: passwordSchema });
  const input = schema.parse(req.body);
  const user = await findUserById(Number(req.user!.sub));
  if (!user || !(await bcrypt.compare(input.senhaAtual, user.senha))) return fail(res, "Senha atual inválida.", 401);
  await updatePassword(user.id, await bcrypt.hash(input.novaSenha, 12));
  return ok(res, { ok: true });
}
