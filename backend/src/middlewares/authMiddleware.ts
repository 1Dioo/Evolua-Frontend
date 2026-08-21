import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/auth.js";
import { fail } from "../utils/api.js";

declare global {
  namespace Express { interface Request { user?: JwtPayload } }
}
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return fail(res, "Token de autenticação ausente.", 401);
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch { return fail(res, "Token inválido ou expirado.", 401); }
}
export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return fail(res, "Você não possui permissão para esta operação.", 403);
    next();
  };
}
