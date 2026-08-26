import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProfile } from "@/lib/profile";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

/** Dropdown do avatar/nome no header: Meu perfil, Configurações, Sair. */
export function UserMenu() {
  const { profile, initials } = useProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const avatar = profile.avatar ? (
    <img
      src={profile.avatar}
      alt={`Foto de ${profile.name}`}
      className="size-9 shrink-0 rounded-lg object-cover"
    />
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-purple text-sm font-semibold text-primary-foreground">
      {initials}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Menu do usuário"
          className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-2 transition-colors hover:border-primary/40 sm:gap-3 sm:pr-3"
        >
          <span className="relative">
            {avatar}
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-surface" />
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[150px] truncate text-sm font-semibold">{profile.name}</span>
            <span className="block text-[11px] text-muted-foreground">Aluno • Online</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-0">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border px-4 py-3">
          {avatar}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{profile.name}</p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </div>
        <div className="p-2">
          <Link
            to="/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="size-[18px]" strokeWidth={1.75} /> Meu perfil
          </Link>
          <Link
            to="/configuracoes"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-[18px]" strokeWidth={1.75} /> Configurações
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);

              try {
                await logout();

                toast.success("Sessão encerrada.");

                await navigate({
                  to: "/login",
                  replace: true,
                });
              } catch {
                toast.error("Não foi possível encerrar a sessão.");
              }
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-[18px]" strokeWidth={1.75} /> Sair
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
