import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider, themeInitScript } from "../lib/theme";
import { AuthProvider, useAuth } from "../lib/auth";
import { AppLayout } from "../components/layout/AppLayout";
import { ProfileProvider } from "../lib/profile";
import { NotificationsProvider } from "../lib/notifications";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    console.error("ERRO REAL DO TANSTACK ROUTER:", error);

    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-2xl">
                <div className="rounded-2xl border border-destructive/30 bg-background p-6 shadow-xl">
                    <h1 className="text-xl font-bold text-destructive">
                        Erro no carregamento da página
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        O TanStack Router capturou o seguinte erro:
                    </p>

                    <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-black p-4 text-left text-sm text-red-400">
                        {error instanceof Error
                            ? `${error.name}: ${error.message}\n\n${error.stack ?? ""}`
                            : String(error)}
                    </pre>

                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={() => {
                                router.invalidate();
                                reset();
                            }}
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            Tentar novamente
                        </button>

                        <a
                            href="/"
                            className="rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground"
                        >
                            Ir para o início
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Projeto Social — Área do Aluno" },
      {
        name: "description",
        content:
          "Área interna do aluno do Projeto Social: cursos de informática básica, atividades, eventos e certificados.",
      },
      { name: "author", content: "EEEP Desenvolvimento de Sistemas" },
      { property: "og:title", content: "Projeto Social — Área do Aluno" },
      {
        property: "og:description",
        content: "Plataforma educacional de informática básica para a comunidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ProfileProvider>
            <NotificationsProvider>
              <RootContent />
              <Toaster position="top-right" />
            </NotificationsProvider>
          </ProfileProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootContent() {
  const location = useLocation();
  const { authenticated } = useAuth();
  const publicRoute = location.pathname === "/login" || location.pathname === "/cadastro";

  if (publicRoute || !authenticated) {
    return <Outlet />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

