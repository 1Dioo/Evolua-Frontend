import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import { authSession } from "@/lib/auth";

export const Route = createFileRoute("/cadastro")({
  beforeLoad: () => {
    if (authSession.isAuthenticated()) throw redirect({ to: "/" });
  },
  component: RegisterPage,
});
