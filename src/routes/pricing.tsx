import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Tag } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Transparent coworking pricing — desks, rooms and offices | Sattabi" },
      {
        name: "description",
        content:
          "See day pass, membership, meeting room, private office and event rates, plus add-ons, credits and promo codes. No hidden fees.",
      },
      { property: "og:title", content: "Sattabi pricing" },
      {
        property: "og:description",
        content: "Every rate published, including tax, add-ons and how membership credits work.",
      },
    ],
  }),
  component: PricingPage,
});

type Row = { item: string; detail: string; price: string };

const tables: Record<string, Row[]> = {
  membership: [
    { item: "Coworking", detail: "Unlimited hot desk, all locations, 2 room credits", price: "Rp 950,000 / month" },
    { item: "Dedicated Desk", detail: "Assigned desk, locker, 24/7 access, 5 room credits", price: "Rp 1,850,000 / month" },
    { item: "Virtual Office", detail: "Business address, mail handling, 2 room credits", price: "Rp 350,000 / month" },
  ],
  workspace: [
    { item: "Hot desk — Bandung", detail: "Full day, lounge or open floor", price: "Rp 55,000 / day" },
    { item: "Hot desk — BSD", detail: "Full day, open floor, parking included", price: "Rp 65,000 / day" },
    { item: "Hot desk — Jakarta", detail: "Full day, open floor and phone booths", price: "Rp 89,000 / day" },
  ],
  meeting: [
    { item: "Small room (4–6)", detail: "TV, whiteboard, Wi-Fi", price: "Rp 120,000 / hour" },
    { item: "Medium room (8)", detail: "65\" screen, video conferencing", price: "Rp 180,000 / hour" },
    { item: "Boardroom (12–16)", detail: "Dual screens, mic array, catering option", price: "Rp 260,000 / hour" },
  ],
  office: [
    { item: "2–4 desks", detail: "Lockable suite, 24/7 access", price: "from Rp 4,800,000 / month" },
    { item: "5–8 desks", detail: "Lockable suite, storage, 10 room credits", price: "from Rp 6,900,000 / month" },
    { item: "9–20 desks", detail: "Private floor section, team credentials", price: "from Rp 14,500,000 / month" },
  ],
  event: [
    { item: "Event loft (60 pax)", detail: "PA, projector, registration desk", price: "Rp 1,250,000 / hour" },
    { item: "Half-day package", detail: "4 hours, coffee break for 40", price: "Rp 4,200,000" },
    { item: "Full-day package", detail: "8 hours, lunch and 2 coffee breaks for 60", price: "Rp 9,800,000" },
  ],
  addons: [
    { item: "27\" monitor", detail: "Per desk, per day", price: "Rp 25,000" },
    { item: "Locker", detail: "Monthly, desk members", price: "Rp 100,000" },
    { item: "Printing credits", detail: "100 pages, black and white", price: "Rp 50,000" },
    { item: "Guest day pass", detail: "Includes temporary QR access", price: "Rp 75,000" },
    { item: "Parking", detail: "Per day, BSD and Bandung", price: "Rp 20,000" },
  ],
};

const labels: [string, string][] = [
  ["membership", "Membership"],
  ["workspace", "Day pass & desks"],
  ["meeting", "Meeting rooms"],
  ["office", "Private office"],
  ["event", "Events"],
  ["addons", "Add-ons"],
];

function PricingPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Pricing"
        title="Every rate, published"
        description="All prices exclude 11% VAT, which is shown before you pay. Membership credits can be spent on meeting rooms at any location."
      />

      <section className="container-page py-12">
        <Tabs defaultValue="membership">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {labels.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {labels.map(([value]) => (
            <TabsContent key={value} value={value} className="mt-6">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {tables[value]!.map((row) => (
                  <div
                    key={row.item}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.item}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{row.detail}</p>
                    </div>
                    <p className="text-sm font-semibold">{row.price}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h2 className="text-base font-semibold">How membership, credits and bookings fit together</h2>
            <ol className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">1.</span> Your membership sets what
                you can access every day — hot desk, assigned desk or a private suite.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">2.</span> Each plan includes monthly
                meeting room credits. One credit is one hour in a small room; larger rooms cost two
                or three credits per hour.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">3.</span> When you book, credits are
                used first and only the remainder is charged to your payment method.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">4.</span> Confirmed bookings prepare
                the access credential for that space and time window.
              </li>
            </ol>
          </article>

          <article className="rounded-xl border border-border bg-card p-6">
            <Tag className="size-5 text-primary" />
            <h2 className="mt-3 text-base font-semibold">Discounts & promo codes</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>WORK10 — 10% off your first booking</li>
              <li>Annual membership — 2 months free</li>
              <li>Teams of 5+ — 15% off private offices</li>
              <li>Students — 20% off day passes with ID</li>
            </ul>
            <Button asChild className="mt-5 w-full gap-1.5">
              <Link to="/workspaces">
                Check availability <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
