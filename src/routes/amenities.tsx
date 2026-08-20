import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Coffee,
  Car,
  Lock,
  Monitor,
  Printer,
  PresentationIcon,
  Tv,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { locations } from "@/data/workspace-data";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenities at every Sattabi coworking location" },
      {
        name: "description",
        content:
          "Gigabit Wi-Fi, meeting rooms, pantry, printing, lockers, parking, monitors, screens, whiteboards and video conferencing across all locations.",
      },
      { property: "og:title", content: "Sattabi amenities" },
      {
        property: "og:description",
        content: "What is included at each location, from Wi-Fi to video conferencing.",
      },
    ],
  }),
  component: AmenitiesPage,
});

const items = [
  { icon: Wifi, name: "Wi-Fi", detail: "Up to 1 Gbps fibre with dual redundancy and a members-only VLAN." },
  { icon: Users, name: "Meeting rooms", detail: "4 to 16 seats, bookable by the hour with instant confirmation." },
  { icon: Coffee, name: "Pantry", detail: "Coffee, tea, filtered water and a fridge, restocked twice a day." },
  { icon: Printer, name: "Printing", detail: "Print, scan and copy using pay-per-page credits from your account." },
  { icon: Lock, name: "Locker", detail: "Personal lockers for desk members, opened with the same credential." },
  { icon: Car, name: "Parking", detail: "On-site parking at BSD and Bandung, validated for day guests." },
  { icon: Monitor, name: "Monitor", detail: "27-inch monitors available on request at any desk." },
  { icon: Tv, name: "TV & screens", detail: "Wireless casting in every meeting room, no adapters needed." },
  { icon: PresentationIcon, name: "Whiteboard", detail: "Wall-mounted boards and mobile boards for workshops." },
  { icon: Video, name: "Video conferencing", detail: "4K cameras and ceiling mic arrays in selected rooms." },
];

function AmenitiesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Amenities"
        title="Everything included, nothing to arrange"
        description="Amenities are part of your booking. Anything metered — printing, parking, monitors — is charged transparently to your account."
      />

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className="rounded-xl border border-border bg-card p-6">
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-[15px] font-semibold">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="container-page">
          <h2 className="text-h2">What each location offers</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-medium text-muted-foreground">Location</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Amenities</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Hours</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((l) => (
                  <tr key={l.slug} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">
                      <Link to="/locations/$slug" params={{ slug: l.slug }} className="hover:underline">
                        {l.name}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground">{l.amenities.join(" · ")}</td>
                    <td className="p-4 text-muted-foreground">
                      {l.hours}
                      {l.access247 ? " · 24/7 for members" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button asChild size="lg" className="mt-8">
            <Link to="/workspaces">Find a workspace</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
