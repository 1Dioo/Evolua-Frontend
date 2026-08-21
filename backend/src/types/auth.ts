export type Role = "aluno" | "admin";
export type AuthUser = { id: number; name: string; email: string; role: Role; avatarUrl: string | null };
export type JwtPayload = { sub: string; role: Role };
