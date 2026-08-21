import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { SettingsPage } from "@/pages/Settings/SettingsPage";

export const Route = createFileRoute("/configuracoes")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Configurações — Projeto Social" },
      {
        name: "description",
        content: "Preferências de conta, aparência, notificações, privacidade e sessão do aluno.",
      },
      { property: "og:title", content: "Configurações — Projeto Social" },
      { property: "og:description", content: "Ajuste tema, notificações e privacidade da sua conta." },
    ],
  }),
  component: SettingsPage,
});
