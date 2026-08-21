import { Link } from "@tanstack/react-router";
import { MapPin, Users, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "./availability-badge";
import { type Location, type Workspace, getLocation } from "@/data/workspace-data";
import { useI18n } from "@/lib/i18n";

export function LocationCard({ location }: { location: Location }) {
  const { money } = useI18n();
  return (
    <article className="hover-glow group overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={location.image}
          alt={`Interior of ${location.name}`}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <AvailabilityBadge status={location.availability} className="bg-card/95 backdrop-blur" />
          {location.access247 ? (
            <span className="rounded-full border border-border bg-card/95 px-2.5 py-1 text-xs font-medium backdrop-blur">
              24/7 access
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold">{location.name}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          {location.address}, {location.city}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-surface p-3 text-center">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Desks</dt>
            <dd className="text-sm font-semibold">{location.desksAvailable} free</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Rooms</dt>
            <dd className="text-sm font-semibold">{location.roomsAvailable} free</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Occupancy</dt>
            <dd className="text-sm font-semibold">{location.occupancy}%</dd>
          </div>
        </dl>

        <p className="mt-4 flex flex-wrap gap-1.5">
          {location.amenities.slice(0, 4).map((a) => (
            <span key={a} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {a}
            </span>
          ))}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            From <span className="text-base font-semibold text-foreground">{money(location.priceFrom)}</span> / day
          </p>
          <Button asChild size="sm">
            <Link to="/locations/$slug" params={{ slug: location.slug }}>
              View Location
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const { money } = useI18n();
  const location = getLocation(workspace.locationSlug);
  const bookable = workspace.availability !== "full" && workspace.availability !== "unavailable";

  return (
    <article className="hover-glow flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:flex-row">
      <img
        src={workspace.image}
        alt={workspace.name}
        loading="lazy"
        width={1200}
        height={800}
        className="h-40 w-full rounded-lg object-cover sm:h-auto sm:w-56"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {workspace.type}
          </span>
          <AvailabilityBadge status={workspace.availability} />
        </div>

        <h3 className="mt-2 text-base font-semibold">{workspace.name}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="size-3.5" /> {location?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {workspace.floor}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" /> {workspace.capacity} {workspace.capacity > 1 ? "people" : "person"}
          </span>
        </p>

        <p className="mt-3 flex flex-wrap gap-1.5">
          {workspace.amenities.slice(0, 4).map((a) => (
            <span key={a} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {a}
            </span>
          ))}
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {workspace.slots.length ? `Available: ${workspace.slots.slice(0, 5).join(" · ")}` : "No slots left today"}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="text-lg font-semibold text-foreground">{money(workspace.price)}</span> / {workspace.unit}
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/workspaces/$id" params={{ id: workspace.id }}>
                Details
              </Link>
            </Button>
            <Button asChild size="sm" disabled={!bookable}>
              <Link to="/workspaces/$id" params={{ id: workspace.id }}>
                {bookable ? "Book" : "Unavailable"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
