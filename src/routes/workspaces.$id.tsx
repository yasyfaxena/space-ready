import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, KeyRound, MapPin, ShieldCheck, Users } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvailabilityBadge } from "@/components/site/availability-badge";
import { getLocation, getWorkspace, rupiah } from "@/data/workspace-data";

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
  const workspace = getWorkspace(id)!;
  const location = getLocation(workspace.locationSlug)!;

  const [date, setDate] = useState("2026-08-25");
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("16:00");
  const [people, setPeople] = useState(Math.min(4, workspace.capacity));

  const hours = useMemo(() => {
    const [sh = 0, sm = 0] = start.split(":").map(Number);
    const [eh = 0, em = 0] = end.split(":").map(Number);
    return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
  }, [start, end]);

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

            <h2 className="mt-9 text-h2">Available times</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {workspace.slots.length ? (
                workspace.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => slot.includes(":") && setStart(slot)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      start === slot
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  Fully booked on this date. The next free slot is 26 August, 09:00.
                </p>
              )}
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
              <span className="text-2xl font-semibold text-foreground">{rupiah(workspace.price)}</span> /{" "}
              {workspace.unit}
            </p>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="d-date" className="text-xs text-muted-foreground">
                  Date
                </Label>
                <Input id="d-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="d-start" className="text-xs text-muted-foreground">
                    Start time
                  </Label>
                  <Input id="d-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="d-end" className="text-xs text-muted-foreground">
                    End time
                  </Label>
                  <Input id="d-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-people" className="text-xs text-muted-foreground">
                  Number of people
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
                <dt className="text-muted-foreground">Duration</dt>
                <dd>{workspace.unit === "hour" ? `${hours} hours` : `1 ${workspace.unit}`}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Estimated total</dt>
                <dd>{rupiah(total)}</dd>
              </div>
            </dl>

            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={!bookable}
              onClick={() =>
                navigate({
                  to: "/booking/review",
                  search: { workspace: workspace.id, date, start, end, people },
                })
              }
            >
              {bookable ? "Book Now" : "Fully booked"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You will review the full price before paying.
            </p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
