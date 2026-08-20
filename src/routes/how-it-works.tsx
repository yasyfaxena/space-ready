import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CreditCard, DoorOpen, KeyRound, Laptop, Sparkles } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How booking and access work — Sattabi Workspaces" },
      {
        name: "description",
        content:
          "Choose, book, pay, get access, enter and work. See how a confirmed booking prepares your access credential and how the access window behaves.",
      },
      { property: "og:title", content: "How Sattabi booking and access work" },
      {
        property: "og:description",
        content: "From search to seat in six steps, with access prepared automatically.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    icon: Laptop,
    title: "Choose",
    copy: "Search by location, date, time and workspace type. Availability counts are live, so what you see is bookable.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    copy: "Set duration, group size and guests. The price updates as you change the details.",
  },
  {
    icon: CreditCard,
    title: "Pay",
    copy: "Use membership credits, card, e-wallet or bank transfer. Credits are always applied first.",
  },
  {
    icon: KeyRound,
    title: "Get access",
    copy: "Once payment clears, your credential is prepared for that space and time window.",
  },
  {
    icon: DoorOpen,
    title: "Enter",
    copy: "Tap your RFID card or scan your QR at the entrance. No reception step, no waiting.",
  },
  {
    icon: Sparkles,
    title: "Work",
    copy: "Your room is set up, the Wi-Fi is on your account, and the coffee is already brewed.",
  },
];

const accessStates = [
  { state: "Not ready", copy: "The booking exists but payment has not completed yet." },
  { state: "Ready", copy: "Payment confirmed. Your credential is prepared and waiting." },
  { state: "Active", copy: "You are inside the access window and can enter." },
  { state: "Expiring", copy: "Your window ends soon. You can still move around freely." },
  { state: "Expired", copy: "The credential no longer grants new entry. Doors inside never lock you in." },
];

function HowItWorksPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="How it works"
        title="From search to seat, without asking anyone"
        description="Booking and access are one flow. You never need to email a manager or wait at a reception desk."
      />

      <section className="container-page py-12">
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-border bg-card p-6">
              <s.icon className="size-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Step {i + 1}</p>
              <h2 className="text-[15px] font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h2">Your access window</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Every booking comes with an access window that usually starts 30 minutes before your
              booking and ends 30 minutes after, depending on the location policy. When the window
              closes, your credential simply stops granting new entry — you are never locked in, and
              exits always work.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-card p-5 font-mono text-sm">
              <p className="font-semibold">BOOKING CONFIRMED</p>
              <p className="mt-2 text-muted-foreground">Workspace: Meeting Room 301</p>
              <p className="text-muted-foreground">Date: 25 August 2026</p>
              <p className="text-muted-foreground">Time: 14:00–16:00</p>
              <p className="text-muted-foreground">Access: Ready</p>
              <p className="text-muted-foreground">Credential: RFID / QR</p>
              <p className="text-muted-foreground">Valid: 13:30–16:30</p>
            </div>
          </div>

          <div>
            <h2 className="text-h2">Access states you may see</h2>
            <div className="mt-5 grid gap-3">
              {accessStates.map((s) => (
                <div key={s.state} className="rounded-lg border border-border bg-card px-5 py-4">
                  <p className="text-sm font-semibold">{s.state}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-8">
          <div>
            <h2 className="text-h2">Ready to try it?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Book a day pass and see the whole flow in about two minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link to="/workspaces">Find a workspace</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Create an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
