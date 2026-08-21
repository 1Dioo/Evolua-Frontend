import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type SidebarStateValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarStateContext = createContext<SidebarStateValue | null>(null);

export function SidebarStateProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((previous) => !previous), []);

  const value = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [collapsed, mobileOpen, toggleCollapsed],
  );

  return <SidebarStateContext.Provider value={value}>{children}</SidebarStateContext.Provider>;
}

export function useSidebarState() {
  const context = useContext(SidebarStateContext);
  if (!context) throw new Error("useSidebarState precisa estar dentro de SidebarStateProvider");
  return context;
}
