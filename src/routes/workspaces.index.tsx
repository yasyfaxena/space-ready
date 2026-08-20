import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { List, Map as MapIcon, SearchX, SlidersHorizontal } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { WorkspaceCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations, rupiah, workspaces, workspaceTypes } from "@/data/workspace-data";

type WorkspaceSearch = {
  location?: string;
  date?: string;
  time?: string;
  type?: string;
};

export const Route = createFileRoute("/workspaces/")({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => ({
    location: typeof search["location"] === "string" ? search["location"] : "all",
    date: typeof search["date"] === "string" ? search["date"] : "2026-08-25",
    time: typeof search["time"] === "string" ? search["time"] : "09:00",
    type: typeof search["type"] === "string" ? search["type"] : "all",
  }),
  head: () => ({
    meta: [
      { title: "Search available workspaces — Sattabi Workspaces" },
      {
        name: "description",
        content:
          "Search hot desks, meeting rooms, private offices and event space by date, time, capacity and amenities. Book instantly with live availability.",
      },
      { property: "og:title", content: "Search available workspaces" },
      {
        property: "og:description",
        content: "Filter by type, capacity, price and amenities, then book in two minutes.",
      },
    ],
  }),
  component: WorkspaceSearchPage,
});

const amenityFilters = ["Whiteboard", "Video conferencing", "Monitor", "Locker", "Parking", "Printing"];

function WorkspaceSearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const location = search.location ?? "all";
  const type = search.type ?? "all";
  const date = search.date ?? "2026-08-25";
  const [start, setStart] = useState(search.time ?? "09:00");
  const [end, setEnd] = useState("12:00");
  const [people, setPeople] = useState(2);
  const [capacity, setCapacity] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [floor, setFloor] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [sort, setSort] = useState("recommended");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [location, type, date, start, end, people, capacity, maxPrice, floor, onlyAvailable, picked]);

  const results = useMemo(() => {
    const list = workspaces.filter((w) => {
      if (location !== "all" && w.locationSlug !== location) return false;
      if (type !== "all" && w.type !== type) return false;
      if (capacity !== "all" && w.capacity < Number(capacity)) return false;
      if (w.price > maxPrice && w.unit !== "month") return false;
      if (floor !== "all" && !w.floor.toLowerCase().includes(floor.toLowerCase())) return false;
      if (onlyAvailable && (w.availability === "full" || w.availability === "unavailable")) return false;
      if (picked.length && !picked.every((a) => w.amenities.some((x) => x.includes(a)))) return false;
      return true;
    });

    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "capacity") return [...list].sort((a, b) => b.capacity - a.capacity);
    return list;
  }, [location, type, capacity, maxPrice, floor, onlyAvailable, picked, sort]);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Workspace search"
        title="Available workspaces"
        description="Set your date, time and group size. Prices and availability update as you change the search."
      >
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-6 md:items-end">
          <div className="grid gap-1.5 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Select
              value={location}
              onValueChange={(v) => navigate({ to: "/workspaces", search: { ...search, location: v } })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l.slug} value={l.slug}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="ws-date">
              Date
            </Label>
            <Input
              id="ws-date"
              type="date"
              value={date}
              onChange={(e) => navigate({ to: "/workspaces", search: { ...search, date: e.target.value } })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="ws-start">
              Start
            </Label>
            <Input id="ws-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="ws-end">
              End
            </Label>
            <Input id="ws-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="ws-people">
              People
            </Label>
            <Input
              id="ws-people"
              type="number"
              min={1}
              max={60}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
            />
          </div>
        </div>
      </PageHeader>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" /> Filters
          </h2>

          <div className="mt-5 grid gap-2">
            <Label className="text-xs text-muted-foreground">Workspace type</Label>
            <Select
              value={type}
              onValueChange={(v) => navigate({ to: "/workspaces", search: { ...search, type: v } })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {workspaceTypes.map((t) => (
                  <SelectItem key={t.type} value={t.type}>
                    {t.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 grid gap-2">
            <Label className="text-xs text-muted-foreground">Capacity</Label>
            <Select value={capacity} onValueChange={setCapacity}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any capacity</SelectItem>
                <SelectItem value="2">2+ people</SelectItem>
                <SelectItem value="6">6+ people</SelectItem>
                <SelectItem value="12">12+ people</SelectItem>
                <SelectItem value="30">30+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <Label className="text-xs text-muted-foreground">Price up to {rupiah(maxPrice)}</Label>
            <Slider
              className="mt-3"
              min={50000}
              max={1500000}
              step={10000}
              value={[maxPrice]}
              onValueChange={(v) => setMaxPrice(v[0] ?? maxPrice)}
            />
          </div>

          <div className="mt-5 grid gap-2">
            <Label className="text-xs text-muted-foreground">Floor</Label>
            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any floor</SelectItem>
                <SelectItem value="Ground">Ground floor</SelectItem>
                <SelectItem value="Level 2">Level 2</SelectItem>
                <SelectItem value="Level 7">Level 7</SelectItem>
                <SelectItem value="Level 17">Level 17</SelectItem>
                <SelectItem value="Level 18">Level 18</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <Label className="text-xs text-muted-foreground">Amenities</Label>
            <div className="mt-3 grid gap-2.5">
              {amenityFilters.map((a) => (
                <label key={a} className="flex items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={picked.includes(a)}
                    onCheckedChange={() =>
                      setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]))
                    }
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <label className="mt-6 flex items-center gap-2.5 border-t border-border pt-5 text-sm">
            <Checkbox
              checked={onlyAvailable}
              onCheckedChange={(v) => setOnlyAvailable(Boolean(v))}
            />
            Only show available
          </label>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching…" : `${results.length} workspaces for ${people} on ${date}, ${start}–${end}`}
            </p>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="capacity">Largest capacity</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border border-border p-0.5">
                <Button
                  size="sm"
                  variant={view === "list" ? "secondary" : "ghost"}
                  onClick={() => setView("list")}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant={view === "map" ? "secondary" : "ghost"}
                  onClick={() => setView("map")}
                >
                  <MapIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-36 w-56 rounded-lg" />
                  <div className="flex-1 space-y-3 py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <SearchX className="mx-auto size-6 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">No workspaces match this search</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try another time slot, a nearby location, or remove a filter. Most rooms free up
                after 16:00.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setCapacity("all");
                  setMaxPrice(1500000);
                  setFloor("all");
                  setPicked([]);
                  navigate({ to: "/workspaces", search: { ...search, location: "all", type: "all" } });
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : view === "list" ? (
            <div className="mt-6 grid gap-4">
              {results.map((w) => (
                <WorkspaceCard key={w.id} workspace={w} />
              ))}
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <div className="relative h-[460px] bg-surface">
                <div className="absolute inset-0 bg-[linear-gradient(oklch(0.895_0.01_95)_1px,transparent_1px),linear-gradient(90deg,oklch(0.895_0.01_95)_1px,transparent_1px)] bg-[size:44px_44px]" />
                {results.map((w, i) => (
                  <div
                    key={w.id}
                    className="absolute rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-soft)]"
                    style={{ left: `${10 + (i % 4) * 21}%`, top: `${18 + (i % 3) * 24}%` }}
                  >
                    {w.type} · {rupiah(w.price)}
                  </div>
                ))}
              </div>
              <p className="border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                Map view — pins show workspace type and rate.
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
