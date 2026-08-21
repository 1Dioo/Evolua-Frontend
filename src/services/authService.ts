import { api, authToken } from "./api";
import type { User } from "@/types";

type AuthResponse = {
  token: string;
  user: User;
};

export const authService = {
  register: async (nome: string, email: string, senha: string) => {
    const result = await api.post<AuthResponse>("/auth/register", {
      nome,
      email,
      senha,
    });

    authToken.set(result.token);
    return result;
  },

  login: async (email: string, senha: string) => {
    const result = await api.post<AuthResponse>("/auth/login", {
      email,
      senha,
    });

    authToken.set(result.token);
    return result;
  },

  me: () => api.get<User>("/auth/me"),

  logout: async () => {
    try {
      if (authToken.get()) {
        await api.post("/auth/logout", {});
      }
    } finally {
      authToken.clear();
    }
  },

  changePassword: (senhaAtual: string, novaSenha: string) =>
    api.put("/auth/password", { senhaAtual, novaSenha }),

  updateUser: (input: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  }) =>
    api.put<User>("/users/me", {
      ...(input.name !== undefined ? { nome: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
    }),
};
