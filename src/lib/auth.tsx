import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { authService } from "@/services/authService";
import { authToken } from "@/services/api";

export type AuthUser = User;

const USER_STORAGE_KEY = "projeto-social.auth.user";

let currentUser: AuthUser | null = authToken.get() ? readStoredUser() : null;
const listeners = new Set<() => void>();

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;

  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

function setCurrentUser(user: AuthUser | null) {
  currentUser = user;
  storeUser(user);
  listeners.forEach((listener) => listener());
}

export const authSession = {
  getUser: () => currentUser,

  isAuthenticated: () => currentUser !== null && authToken.get() !== null,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  register: async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    setCurrentUser(result.user);
    return result.user;
  },

  login: async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setCurrentUser(result.user);
    return result.user;
  },

  restore: async () => {
    if (!authToken.get()) return null;

    try {
      const user = await authService.me();
      setCurrentUser(user);
      return user;
    } catch {
      authToken.clear();
      setCurrentUser(null);
      return null;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
    }
  },

  updateUser: async (patch: Partial<AuthUser>) => {
    if (!currentUser) return;

    const update: { name?: string; email?: string; avatarUrl?: string | null } = {};
    if (patch.name !== undefined) update.name = patch.name;
    if (patch.email !== undefined) update.email = patch.email;
    if (patch.avatarUrl !== undefined) update.avatarUrl = patch.avatarUrl;

    const updated = await authService.updateUser(update);

    setCurrentUser({
      ...updated,
      ...("turma" in patch ? { turma: patch.turma } : {}),
      ...("joinedAt" in patch ? { joinedAt: patch.joinedAt } : {}),
    });
  },
};

type AuthContextValue = {
  user: AuthUser | null;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authSession.getUser());

  useEffect(() => {
    const unsubscribe = authSession.subscribe(() => {
      setUser(authSession.getUser());
    });

    if (authToken.get()) {
      void authSession.restore();
    }

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authSession.login(email, password);
    setUser(authSession.getUser());
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authSession.register(name, email, password);
    setUser(authSession.getUser());
  }, []);

  const logout = useCallback(async () => {
    await authSession.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (patch: Partial<AuthUser>) => {
    await authSession.updateUser(patch);
    setUser(authSession.getUser());
  }, []);

  const value = useMemo(
    () => ({
      user,
      authenticated: Boolean(user && authToken.get()),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return value;
}
