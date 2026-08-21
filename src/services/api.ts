export const API_URL =
  import.meta.env["VITE_API_URL"] ?? "http://localhost:3333/api";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

const TOKEN_STORAGE_KEY = "projeto-social.auth.token";

let token: string | null = readStoredToken();

function readStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export const authToken = {
  get: () => token,

  set: (value: string) => {
    token = value;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, value);
    }
  },

  clear: () => {
    token = null;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const currentToken = authToken.get();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {}),
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Falha na requisição ${path}`,
      response.status,
    );
  }

  return (payload?.data ?? payload) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};
