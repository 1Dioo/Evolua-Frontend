import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err instanceof ZodError) return res.status(400).json({ success: false, message: "Dados inválidos.", errors: err.flatten() });
  if (err?.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "Registro duplicado." });
  return res.status(500).json({ success: false, message: "Erro interno do servidor." });
};
