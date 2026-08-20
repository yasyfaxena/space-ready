import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  DoorOpen,
  KeyRound,
  Laptop,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import heroImage from "@/assets/hero-coworking.jpg";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/site-shell";
import { SearchModule } from "@/components/site/search-module";
import { LocationCard } from "@/components/site/cards";
import {
  amenities,
  locations,
  plans,
  rupiah,
  workspaceTypes,
} from "@/data/workspace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sattabi Workspaces — Find and book coworking space in minutes" },
      {
        name: "description",
        content:
          "Search hot desks, meeting rooms and private offices across Jakarta, Tangerang and Bandung. Book, pay and get your access ready before you arrive.",
      },
      { property: "og:title", content: "Sattabi Workspaces — Find your workspace" },
      {
        property: "og:description",
        content:
          "Real-time availability, transparent pricing and access that is ready the moment your booking is confirmed.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: Laptop, title: "Choose", copy: "Pick a location and workspace that fits your day." },
  { icon: CalendarCheck, title: "Book", copy: "Select date, time and duration with live availability." },
  { icon: CreditCard, title: "Pay", copy: "Pay by card, e-wallet, transfer or membership credits." },
  { icon: KeyRound, title: "Get access", copy: "Your credential is prepared as soon as payment clears." },
  { icon: DoorOpen, title: "Enter", copy: "Tap in at the entrance — no receptionist needed." },
  { icon: Sparkles, title: "Work", copy: "Wi-Fi, coffee and your room are ready when you sit down." },
];

const reasons = [
  { title: "Flexible booking", copy: "By the hour, the day or the month. Change or cancel within the policy on your booking." },
  { title: "Real-time availability", copy: "Every desk and room count on this site reflects live inventory, not an enquiry form." },
  { title: "24/7 access where offered", copy: "Resident members at Sudirman and BSD can enter outside opening hours." },
  { title: "Self check-in", copy: "No queue, no reception step. Your booking is your check-in." },
  { title: "Secure access", copy: "Access is granted only for the space and the time window you booked." },
  { title: "RFID card access", copy: "Supported at every Sattabi location, and it keeps working if the network drops." },
  { title: "QR access", copy: "Available at supported entrances for day guests and visitors." },
  { title: "Mobile access", copy: "Rolling out at selected entrances — your booking page always shows what applies." },
];

function Home() {
  return (
    <SiteShell>
      {/* Hero + booking search */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={heroImage}
          alt="Members working in a Sattabi coworking lounge"
          width={1920}
          height={1200}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[oklch(0.21_0.02_155/0.66)]" />

        <div className="container-page pb-10 pt-20 md:pb-14 md:pt-28">
          <div className="max-w-2xl text-[oklch(0.985_0.006_95)]">
            <p className="text-eyebrow text-[oklch(0.88_0.02_95)]">
              Jakarta · Tangerang · Bandung
            </p>
            <h1 className="text-display mt-3">Find your workspace</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[oklch(0.92_0.01_95)]">
              Search live availability across four locations, book a desk or a room, and walk in
              with your access already prepared.
            </p>
          </div>

          <SearchModule className="mt-8" />

          <p className="mt-4 text-sm text-[oklch(0.9_0.01_95)]">
            110 desks and 15 meeting rooms free right now · Booking takes about two minutes
          </p>
        </div>
      </section>

      {/* Workspace types */}
      <section className="section-y">
        <div className="container-page">
          <p className="text-eyebrow">Workspace types</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Pick the space that matches the work</h2>
            <Button asChild variant="ghost" className="gap-1.5">
              <Link to="/workspaces">
                Browse all workspaces <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workspaceTypes.map((t) => (
              <article
                key={t.type}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <h3 className="text-[15px] font-semibold">{t.type}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.what}</p>
                <p className="mt-3 text-xs text-muted-foreground">For: {t.who}</p>
                <p className="mt-1 text-xs text-muted-foreground">Capacity: {t.capacity}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-sm font-semibold">
                    {t.from ? `${rupiah(t.from)}/${t.unit}` : "On request"}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/workspaces" search={{ type: t.type }}>
                      View
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured locations */}
      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <p className="text-eyebrow">Featured locations</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Four locations, one membership</h2>
            <Button asChild variant="outline">
              <Link to="/locations">All locations</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.slice(0, 3).map((l) => (
              <LocationCard key={l.slug} location={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="section-y">
        <div className="container-page">
          <p className="text-eyebrow">Membership</p>
          <h2 className="text-h2 mt-2">Start with a day, stay for a year</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="text-[15px] font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-4 text-lg font-semibold">
                  {p.price} <span className="text-sm font-normal text-muted-foreground">{p.period}</span>
                </p>
              </article>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link to="/membership">Explore Membership</Link>
          </Button>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <p className="text-eyebrow">Why choose us</p>
          <h2 className="text-h2 mt-2">Booking and access, joined up</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Once your booking is paid, the system prepares an access credential for exactly the
            space and time window you reserved. Nobody has to let you in.
          </p>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">{r.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y">
        <div className="container-page">
          <p className="text-eyebrow">How it works</p>
          <h2 className="text-h2 mt-2">Six steps from search to seat</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-border bg-card p-5">
                <s.icon className="size-5 text-primary" />
                <p className="mt-4 text-xs text-muted-foreground">Step {i + 1}</p>
                <h3 className="text-[15px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Amenities */}
      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <p className="text-eyebrow">Amenities</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Included at every location</h2>
            <Button asChild variant="ghost" className="gap-1.5">
              <Link to="/amenities">
                See all amenities <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
            {amenities.map((a) => (
              <div key={a.name} className="flex gap-3">
                <Wifi className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">{a.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="section-y">
        <div className="container-page grid items-center gap-10 rounded-2xl border border-border bg-primary p-8 text-primary-foreground md:grid-cols-2 md:p-12">
          <div>
            <p className="text-eyebrow text-primary-foreground/70">Enterprise</p>
            <h2 className="text-h2 mt-2">Workspace for distributed teams</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-primary-foreground/85">
              Give your people space in every city you operate in, with one contract, one invoice
              and one place to manage who can go where.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link to="/enterprise">Talk to Sales</Link>
            </Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Multi-location workspace",
              "Team management",
              "Centralised billing",
              "Access management",
              "Usage analytics",
              "Dedicated account manager",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-primary-foreground/15 px-4 py-3 text-sm"
              >
                <ScanLine className="size-4 opacity-80" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
