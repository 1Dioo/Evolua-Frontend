import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { ProfilePage } from "@/pages/Profile/ProfilePage";

export const Route = createFileRoute("/perfil")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Meu Perfil — Projeto Social" },
      {
        name: "description",
        content: "Visualize e edite seus dados pessoais, foto de perfil e segurança da conta.",
      },
      { property: "og:title", content: "Meu Perfil — Projeto Social" },
      { property: "og:description", content: "Dados do aluno, foto de perfil e alteração de senha." },
    ],
  }),
  component: ProfilePage,
});
