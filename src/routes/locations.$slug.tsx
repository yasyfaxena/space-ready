import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MapPin, ShieldCheck, Wifi } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "@/components/site/availability-badge";
import { WorkspaceCard } from "@/components/site/cards";
import { getLocation, rupiah, workspaces } from "@/data/workspace-data";

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }) => {
    const location = getLocation(params.slug);
    if (!location) throw notFound();
    return { name: location.name, city: location.city, description: location.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Location unavailable — Sattabi" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name}, ${loaderData.city} — Sattabi Workspaces`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  component: LocationDetail,
});

function LocationDetail() {
  const { slug } = Route.useParams();
  const location = getLocation(slug)!;
  const spaces = workspaces.filter((w) => w.locationSlug === slug);

  const typeAvailability = location.types.map((type) => {
    const count =
      type === "Meeting Room"
        ? location.roomsAvailable
        : type === "Private Office"
          ? 2
          : type === "Hot Desk"
            ? location.desksAvailable
            : type === "Dedicated Desk"
              ? Math.max(0, Math.round(location.desksAvailable / 4))
              : type === "Day Pass"
                ? location.desksAvailable
                : 1;
    return { type, count };
  });

  return (
    <SiteShell>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <nav className="text-sm text-muted-foreground">
            <Link to="/locations" className="hover:text-foreground">
              Locations
            </Link>
            <span className="px-2">/</span>
            <span className="text-foreground">{location.name}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-h1">{location.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {location.address}, {location.city}
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" /> {location.hours}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <AvailabilityBadge status={location.availability} />
                {location.access247 ? (
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium">
                    24/7 access for resident members
                  </span>
                ) : null}
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium">
                  {location.floors} floors
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Day pass from</p>
              <p className="text-2xl font-semibold">{rupiah(location.priceFrom)}</p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link to="/workspaces" search={{ location: location.slug }}>
                  Book Now
                </Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Access is included with every booking.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-[2fr_1fr]">
            <img
              src={location.image}
              alt={`Workspace at ${location.name}`}
              loading="lazy"
              width={1200}
              height={800}
              className="h-[320px] w-full rounded-xl object-cover md:h-[420px]"
            />
            <div className="grid gap-3">
              <img
                src={location.image}
                alt={`Shared area at ${location.name}`}
                loading="lazy"
                width={1200}
                height={800}
                className="hidden h-[204px] w-full rounded-xl object-cover object-right lg:block"
              />
              <div className="relative h-[204px] overflow-hidden rounded-xl border border-border bg-surface">
                <div className="absolute inset-0 bg-[linear-gradient(oklch(0.895_0.01_95)_1px,transparent_1px),linear-gradient(90deg,oklch(0.895_0.01_95)_1px,transparent_1px)] bg-[size:36px_36px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-soft)]">
                  <MapPin className="mr-1 inline size-3.5" />
                  {location.city}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {location.description}
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-h2">Workspace availability today</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {typeAvailability.map(({ type, count }) => (
            <div
              key={type}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
            >
              <span className="text-sm font-medium">{type}</span>
              <AvailabilityBadge
                status={count === 0 ? "full" : count <= 3 ? "limited" : "available"}
                label={count === 0 ? "Fully booked" : `${count} available`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="container-page">
          <h2 className="text-h2">Facilities</h2>
          <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {location.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2.5 border-t border-border pt-4 text-sm">
                <Wifi className="size-4 text-primary" />
                {a}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold">Access included with your booking</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                RFID card access is supported at this location, and QR access is available at the
                main entrance. Your credential is prepared once payment is confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-h2">Spaces at this location</h2>
        <div className="mt-6 grid gap-4">
          {spaces.map((w) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
