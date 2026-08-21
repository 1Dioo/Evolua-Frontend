import { z } from "zod";
export const emailSchema = z.string().trim().email().max(255);
export const passwordSchema = z.string().min(6).max(100);
export const urlSchema = z.string().url().max(1000);
export const idSchema = z.coerce.number().int().positive();
export function body<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> { return schema.parse(value); }
