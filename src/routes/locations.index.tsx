import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Map as MapIcon, List, SearchX, Search } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { LocationCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations, rupiah, workspaceTypes } from "@/data/workspace-data";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Coworking locations in Jakarta, Tangerang and Bandung — Sattabi" },
      {
        name: "description",
        content:
          "Compare Sattabi coworking locations: live desk and meeting room availability, amenities, opening hours, 24/7 access and day rates.",
      },
      { property: "og:title", content: "Sattabi coworking locations" },
      {
        property: "og:description",
        content: "Four locations with live availability, amenities and transparent day rates.",
      },
    ],
  }),
  component: LocationsPage,
});

const allAmenities = ["Parking", "Locker", "Printing", "Pantry", "Meeting rooms", "Video conferencing"];

function LocationsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [only247, setOnly247] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "map">("list");

  const results = useMemo(
    () =>
      locations.filter((l) => {
        if (query && !`${l.name} ${l.address} ${l.city}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        if (city !== "all" && l.city !== city) return false;
        if (type !== "all" && !l.types.includes(type as never)) return false;
        if (l.priceFrom > maxPrice) return false;
        if (only247 && !l.access247) return false;
        if (picked.length && !picked.every((a) => l.amenities.some((x) => x.includes(a)))) return false;
        return true;
      }),
    [query, city, type, maxPrice, only247, picked],
  );

  const toggle = (a: string) =>
    setPicked((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Locations"
        title="Locations"
        description="Compare availability, amenities and rates across every Sattabi location, then book straight from the location page."
      >
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-end">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="loc-q">
              Search location
            </Label>
            <Input
              id="loc-q"
              placeholder="Sudirman, BSD, Bandung…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                <SelectItem value="Jakarta">Jakarta</SelectItem>
                <SelectItem value="Tangerang">Tangerang</SelectItem>
                <SelectItem value="Bandung">Bandung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground" htmlFor="loc-date">
              Date
            </Label>
            <Input id="loc-date" type="date" defaultValue="2026-08-25" />
          </div>
          <Button className="h-10 gap-2">
            <Search className="size-4" /> Search
          </Button>
        </div>
      </PageHeader>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Filters</h2>

          <div className="mt-5 grid gap-2">
            <Label className="text-xs text-muted-foreground">Workspace type</Label>
            <Select value={type} onValueChange={setType}>
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

          <div className="mt-6">
            <Label className="text-xs text-muted-foreground">
              Day rate up to {rupiah(maxPrice)}
            </Label>
            <Slider
              className="mt-3"
              min={40000}
              max={100000}
              step={5000}
              value={[maxPrice]}
              onValueChange={(v) => setMaxPrice(v[0] ?? maxPrice)}
            />
          </div>

          <div className="mt-6">
            <Label className="text-xs text-muted-foreground">Amenities</Label>
            <div className="mt-3 grid gap-2.5">
              {allAmenities.map((a) => (
                <label key={a} className="flex items-center gap-2.5 text-sm">
                  <Checkbox checked={picked.includes(a)} onCheckedChange={() => toggle(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <Label className="text-sm">24/7 access</Label>
            <Switch checked={only247} onCheckedChange={setOnly247} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => {
              setQuery("");
              setCity("all");
              setType("all");
              setMaxPrice(100000);
              setOnly247(false);
              setPicked([]);
            }}
          >
            Reset filters
          </Button>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "location" : "locations"} available on 25 August 2026
            </p>
            <div className="flex rounded-md border border-border p-0.5">
              <Button
                size="sm"
                variant={view === "list" ? "secondary" : "ghost"}
                className="gap-1.5"
                onClick={() => setView("list")}
              >
                <List className="size-4" /> List
              </Button>
              <Button
                size="sm"
                variant={view === "map" ? "secondary" : "ghost"}
                className="gap-1.5"
                onClick={() => setView("map")}
              >
                <MapIcon className="size-4" /> Map
              </Button>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <SearchX className="mx-auto size-6 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">No locations match these filters</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try widening the price range or removing an amenity filter. All four locations have
                availability this week.
              </p>
            </div>
          ) : view === "list" ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {results.map((l) => (
                <LocationCard key={l.slug} location={l} />
              ))}
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <div className="relative h-[420px] bg-surface">
                <div className="absolute inset-0 bg-[linear-gradient(oklch(0.895_0.01_95)_1px,transparent_1px),linear-gradient(90deg,oklch(0.895_0.01_95)_1px,transparent_1px)] bg-[size:44px_44px]" />
                {results.map((l, i) => (
                  <div
                    key={l.slug}
                    className="absolute rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-soft)]"
                    style={{ left: `${16 + i * 21}%`, top: `${24 + (i % 3) * 22}%` }}
                  >
                    {l.name.replace("Sattabi ", "")} · {rupiah(l.priceFrom)}
                  </div>
                ))}
              </div>
              <p className="border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                Map view — pins show the day rate at each location.
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
