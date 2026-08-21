import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { authSession } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (authSession.isAuthenticated()) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
