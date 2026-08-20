import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Building2, CheckCircle2, CreditCard, ShieldCheck, Users } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "Enterprise workspace for distributed teams — Sattabi" },
      {
        name: "description",
        content:
          "Multi-location workspace with team management, centralised billing, access management and usage analytics. Talk to our sales team.",
      },
      { property: "og:title", content: "Sattabi for enterprise teams" },
      {
        property: "og:description",
        content: "One agreement, one invoice, and control over who can access which location.",
      },
    ],
  }),
  component: EnterprisePage,
});

const features = [
  { icon: Building2, title: "Multi-location workspace", copy: "Allocate desks and rooms across all four locations under one agreement." },
  { icon: Users, title: "Team management", copy: "Add and remove people, set allowances and assign home locations." },
  { icon: CreditCard, title: "Centralised billing", copy: "One monthly invoice with cost centres, PO references and VAT breakdown." },
  { icon: ShieldCheck, title: "Access management", copy: "Decide which zones each team can enter and when access should end." },
  { icon: BarChart3, title: "Usage analytics", copy: "See how much space your teams actually use before you commit to more." },
  { icon: CheckCircle2, title: "Dedicated support", copy: "A named account manager and onboarding for every new joiner." },
];

function EnterprisePage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Enterprise"
        title="Workspace for teams in more than one city"
        description="For companies of 20 to 500 people who want flexible space without signing four separate leases."
      />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <article key={f.title} className="rounded-xl border border-border bg-card p-6">
              <f.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-[15px] font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
            </article>
          ))}
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-24">
          <h2 className="text-base font-semibold">Talk to Sales</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us roughly what you need and we will come back within one business day.
          </p>

          {sent ? (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-success/25 bg-success/8 p-4">
              <CheckCircle2 className="mt-0.5 size-4 text-success" />
              <div>
                <p className="text-sm font-medium">Request received</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our enterprise team will contact you at the address you provided.
                </p>
              </div>
            </div>
          ) : (
            <form
              className="mt-5 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-1.5">
                <Label htmlFor="e-company">Company</Label>
                <Input id="e-company" placeholder="Nusantara Digital" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e-name">Contact name</Label>
                <Input id="e-name" placeholder="Rifqi Pratama" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e-email">Work email</Label>
                <Input id="e-email" type="email" placeholder="rifqi@company.co.id" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e-size">Team size</Label>
                <Input id="e-size" type="number" min={5} defaultValue={40} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e-note">What do you need?</Label>
                <Textarea
                  id="e-note"
                  rows={4}
                  placeholder="20 desks in Jakarta, 10 in Bandung, plus meeting room credits."
                />
              </div>
              <Button type="submit" size="lg">
                Talk to Sales
              </Button>
            </form>
          )}
        </aside>
      </section>
    </SiteShell>
  );
}
