import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { IconBadge, Panel, SectionTitle } from "@/components/ui-kit";
import { events, type Event } from "@/demo/compatibility";


const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

function MiniCalendar({ marked }: { marked: number[] }) {
  // Agosto de 2026 começa em sábado (offset 6)
  const offset = 6;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Panel className="space-y-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <IconBadge icon={CalendarDays} tone="primary" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Agosto de 2026</p>
          <p className="text-xs text-muted-foreground">Dias com eventos destacados</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
        {weekDays.map((day, index) => (
          <span key={`${day}-${index}`} className="py-1 font-semibold">
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const active = marked.includes(day);
          return (
            <span
              key={day}
              className={`grid aspect-square place-items-center rounded-lg text-xs ${
                active
                  ? "bg-primary/15 font-semibold text-primary-light ring-1 ring-primary/30"
                  : "text-muted-foreground"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </Panel>
  );
}

function EventCard({ event, onOpen }: { event: Event; onOpen: (event: Event) => void }) {
  const tone =
    event.status === "Realizado"
      ? "bg-muted text-muted-foreground"
      : event.status === "Confirmado"
        ? "bg-success/12 text-success"
        : "bg-primary/12 text-primary-light";

  return (
    <Panel hover className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
      <IconBadge icon={event.icon} tone={event.when === "past" ? "muted" : "primary"} />
      <div className="min-w-0 space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{event.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{event.status}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {event.date} • {event.hour}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {event.place}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(event)}
          className="rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light"
        >
          Ver detalhes
        </button>
      </div>
    </Panel>
  );
}

export function EventsPage() {
  const [selected, setSelected] = useState<Event | null>(null);
  const upcoming = events.filter((event) => event.when === "upcoming");
  const past = events.filter((event) => event.when === "past");
  const marked = upcoming.filter((event) => event.month === "Ago").map((event) => event.day);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Eventos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oficinas e encontros abertos à comunidade, na escola e online.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <MiniCalendar marked={marked} />
        <div>
          <SectionTitle title="Próximos eventos" subtitle="Agosto e setembro de 2026" />
          <div className="grid gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.title} event={event} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Eventos anteriores" subtitle="Histórico de encontros já realizados" />
        <div className="grid gap-4 lg:grid-cols-2">
          {past.map((event) => (
            <EventCard key={event.title} event={event} onOpen={setSelected} />
          ))}
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" /> {selected?.date} • {selected?.hour}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" /> {selected?.place}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" /> {selected?.status}
            </p>
          </div>
          {selected?.when === "upcoming" ? (
            <button
              type="button"
              onClick={() => {
                toast.success("Presença confirmada. Até lá!");
                setSelected(null);
              }}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
            >
              Confirmar presença
            </button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
