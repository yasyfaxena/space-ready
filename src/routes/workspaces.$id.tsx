import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, KeyRound, MapPin, ShieldCheck, Users } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvailabilityBadge } from "@/components/site/availability-badge";
import { getLocation, getWorkspace } from "@/data/workspace-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { savePendingBooking } from "@/lib/pending-booking";

const HOURS = Array.from({ length: 9 }, (_, i) => 8 + i); // 08:00 → 17:00
const hhmm = (h: number) => `${String(h).padStart(2, "0")}:00`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export const Route = createFileRoute("/workspaces/$id")({
  loader: ({ params }) => {
    const workspace = getWorkspace(params.id);
    if (!workspace) throw notFound();
    return { name: workspace.name, description: workspace.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Workspace unavailable — Sattabi" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Sattabi Workspaces`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  component: WorkspaceDetail,
});

function WorkspaceDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t, money } = useI18n();
  const workspace = getWorkspace(id)!;
  const location = getLocation(workspace.locationSlug)!;

  const [date, setDate] = useState(todayISO());
  const [selected, setSelected] = useState<number[]>([]);
  const [booked, setBooked] = useState<number[]>([]);

  useEffect(() => {
    let active = true;
    setSelected([]);
    void supabase
      .rpc("booked_slots", { _workspace_id: workspace.id, _date: date })
      .then(({ data }) => {
        if (!active) return;
        const rows = (data as { start_time: string; end_time: string }[] | null) ?? [];
        const taken = new Set<number>();
        for (const r of rows) {
          const from = Number(r.start_time.slice(0, 2));
          const to = Number(r.end_time.slice(0, 2));
          for (let h = from; h < to; h += 1) taken.add(h);
        }
        setBooked([...taken]);
      });
    return () => {
      active = false;
    };
  }, [workspace.id, date]);

  const toggleHour = (h: number) => {
    setSelected((prev) => {
      if (prev.includes(h)) return prev.filter((x) => x !== h);
      return [...prev, h].sort((a, b) => a - b);
    });
  };

  const start = selected.length ? hhmm(selected[0]!) : "";
  const end = selected.length ? hhmm(selected[selected.length - 1]! + 1) : "";
  const [people, setPeople] = useState(Math.min(4, workspace.capacity));

  const hours = useMemo(() => selected.length, [selected]);

  const total = workspace.unit === "hour" ? workspace.price * hours : workspace.price;
  const bookable = workspace.availability !== "full" && workspace.availability !== "unavailable";

  return (
    <SiteShell>
      <section className="container-page py-8">
        <nav className="text-sm text-muted-foreground">
          <Link to="/workspaces" className="hover:text-foreground">
            Workspaces
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{workspace.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <img
              src={workspace.image}
              alt={workspace.name}
              width={1200}
              height={800}
              className="h-[300px] w-full rounded-xl object-cover md:h-[420px]"
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {workspace.type}
              </span>
              <AvailabilityBadge status={workspace.availability} />
            </div>

            <h1 className="text-h1 mt-3">{workspace.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {location.name} · {workspace.floor}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" /> Up to {workspace.capacity}{" "}
                {workspace.capacity > 1 ? "people" : "person"}
              </span>
            </p>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {workspace.description}
            </p>

            <h2 className="mt-9 text-h2">Amenities</h2>
            <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {workspace.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2.5 border-t border-border pt-3 text-sm">
                  <ShieldCheck className="size-4 text-primary" /> {a}
                </div>
              ))}
            </div>

            <h2 className="mt-9 text-h2">{t("detail.availability")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("detail.availabilityHint")}</p>

            <div className="mt-4 max-w-xs">
              <Label htmlFor="cal-date" className="text-xs text-muted-foreground">
                {t("detail.date")}
              </Label>
              <Input
                id="cal-date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-3">
              {HOURS.map((h) => {
                const isBooked = booked.includes(h);
                const isSelected = selected.includes(h);
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={isBooked}
                    onClick={() => toggleHour(h)}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                      isBooked
                        ? "cursor-not-allowed border-destructive/25 bg-destructive/10 text-destructive/70 line-through"
                        : isSelected
                          ? "border-transparent bg-galaxy-accent text-primary-foreground shadow-[var(--shadow-lift)]"
                          : "hover-glow border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="block">
                      {hhmm(h)} – {hhmm(h + 1)}
                    </span>
                    <span className="mt-1 block text-[11px] font-normal opacity-80">
                      {isBooked ? t("detail.booked") : isSelected ? t("detail.selected") : t("detail.free")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm border border-border bg-card" /> {t("detail.free")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-galaxy-accent" /> {t("detail.selected")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-destructive/40" /> {t("detail.booked")}
              </span>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="size-4 text-primary" /> Cancellation policy
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{workspace.cancellation}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <KeyRound className="size-4 text-primary" /> Access information
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Access is included with this booking. Your credential opens the entrance and this
                  space from 30 minutes before your start time until 30 minutes after it ends.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">
              <span className="text-2xl font-semibold text-foreground">{money(workspace.price)}</span> /{" "}
              {workspace.unit}
            </p>

            <div className="mt-5 grid gap-4">
              <div className="rounded-lg bg-surface p-3 text-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("detail.date")}
                </p>
                <p className="mt-1 font-medium">{date}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {t("detail.availability")}
                </p>
                <p className="mt-1 font-medium">
                  {selected.length ? `${start} – ${end}` : t("detail.selectSlot")}
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-people" className="text-xs text-muted-foreground">
                  {t("detail.people")}
                </Label>
                <Input
                  id="d-people"
                  type="number"
                  min={1}
                  max={workspace.capacity}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                />
              </div>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("detail.duration")}</dt>
                <dd>{`${hours} ${t("common.hours")}`}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>{t("detail.estTotal")}</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>

            <Button
              size="lg"
              className="mt-5 w-full bg-galaxy-accent"
              disabled={!bookable || selected.length === 0}
              onClick={() => {
                const booking = { workspace: workspace.id, date, start, end, people };
                if (!session) {
                  savePendingBooking(booking);
                  navigate({ to: "/login" });
                  return;
                }
                navigate({ to: "/booking/review", search: booking });
              }}
            >
              {!bookable
                ? "Fully booked"
                : selected.length === 0
                  ? t("detail.selectSlot")
                  : t("cta.bookNow")}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {session ? "You will review the full price before paying." : t("auth.loginRequired")}
            </p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
