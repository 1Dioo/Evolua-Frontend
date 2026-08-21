import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export type Profile = {
  name: string;
  email: string;
  avatar: string | null;
  turma?: string;
  joinedAt?: string;
};

type ProfileContextValue = {
  profile: Profile;
  initials: string;
  firstName: string;
  updateProfile: (next: Partial<Profile>) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const profile = useMemo<Profile>(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatarUrl ?? null,
      ...(user?.turma !== undefined ? { turma: user.turma } : {}),
      ...(user?.joinedAt !== undefined ? { joinedAt: user.joinedAt } : {}),
    }),
    [user],
  );

  const updateProfile = useCallback(
    (next: Partial<Profile>) => {
      updateUser({
        ...(next.name !== undefined ? { name: next.name } : {}),
        ...(next.email !== undefined ? { email: next.email } : {}),
        ...(next.avatar !== undefined ? { avatarUrl: next.avatar } : {}),
        ...(next.turma !== undefined ? { turma: next.turma } : {}),
      });
    },
    [updateUser],
  );

  const value = useMemo(
    () => ({
      profile,
      initials: getInitials(profile.name),
      firstName: profile.name.trim().split(/\s+/)[0] || profile.name,
      updateProfile,
    }),
    [profile, updateProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile deve ser usado dentro de ProfileProvider.");
  return value;
}
