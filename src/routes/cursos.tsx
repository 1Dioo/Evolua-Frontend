import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";

export const Route = createFileRoute("/cursos")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  component: () => <Outlet />,
});
