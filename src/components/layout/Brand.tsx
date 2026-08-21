import { Link } from "@tanstack/react-router";
import evoLogo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

/**
 * Marca do projeto. O símbolo é uma imagem PNG real em src/assets/logo.png
 * (também disponível em /assets/logo.png para substituição futura).
 */
export function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      to="/"
      className={cn(
        "grid items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/60",
        collapsed ? "grid-cols-1 justify-items-center px-0" : "grid-cols-[auto_minmax(0,1fr)]",
      )}
    >
      <img
        src={evoLogo}
        alt="Projeto Social"
        className="size-9 shrink-0 rounded-xl object-contain"
        width={36}
        height={36}
      />
      {collapsed ? null : (
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-bold leading-tight">
            Projeto Social
          </span>
          <span className="block truncate text-[11px] leading-tight text-muted-foreground">
            Evolua Digital
          </span>
        </span>
      )}
    </Link>
  );
}
