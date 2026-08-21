import { PlayCircle, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = {
  /** URL do vídeo real (mp4/webm) ou de um embed (YouTube/Vimeo). Vem do backend. */
  videoUrl?: string | null;
  /** Imagem de capa exibida antes do play. */
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
};

const isEmbed = (url: string) => /youtube\.com|youtu\.be|vimeo\.com|player\./i.test(url);

/**
 * Player reutilizável. Aceita arquivo de vídeo ou embed; quando ainda não existe
 * vídeo cadastrado (videoUrl nulo), mostra um estado vazio claro.
 */
export function VideoPlayer({ videoUrl, thumbnailUrl, title, className }: VideoPlayerProps) {
  const frame = cn(
    "relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface-2",
    className,
  );

  if (!videoUrl) {
    return (
      <div className={frame}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Capa da aula ${title}`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-primary/12 text-primary-light">
            <VideoOff className="size-6" strokeWidth={1.75} />
          </span>
          <p className="text-sm font-semibold">Vídeo em breve</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            O vídeo desta aula será exibido aqui assim que for cadastrado pelo professor.
          </p>
        </div>
      </div>
    );
  }

  if (isEmbed(videoUrl)) {
    return (
      <div className={frame}>
        <iframe
          src={videoUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <video
        src={videoUrl}
        poster={thumbnailUrl ?? undefined}
        controls
        preload="metadata"
        className="absolute inset-0 size-full bg-black object-contain"
      >
        <track kind="captions" />
      </video>
      <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur sm:flex">
        <PlayCircle className="size-3.5" /> {title}
      </span>
    </div>
  );
}
