import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { CertificatesPage } from "@/pages/Certificates/CertificatesPage";

export const Route = createFileRoute("/certificados")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Certificados — Projeto Social" },
      {
        name: "description",
        content: "Certificados conquistados pelo aluno, com carga horária, código de validação e download.",
      },
      { property: "og:title", content: "Certificados — Projeto Social" },
      {
        property: "og:description",
        content: "Veja e baixe os certificados dos cursos de informática concluídos.",
      },
    ],
  }),
  component: CertificatesPage,
});
