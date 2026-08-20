import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { plans } from "@/data/workspace-data";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership plans — day pass to private office | Sattabi" },
      {
        name: "description",
        content:
          "Compare Sattabi memberships: day pass, coworking, dedicated desk, private office, meeting room credits and enterprise agreements.",
      },
      { property: "og:title", content: "Sattabi membership plans" },
      {
        property: "og:description",
        content: "Pick the plan that matches how often you work with us. Change or cancel monthly.",
      },
    ],
  }),
  component: MembershipPage,
});

const matrix: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Hot desk access", values: ["1 day", "Unlimited", "Unlimited", "Unlimited", false, "Unlimited"] },
  { feature: "Assigned desk", values: [false, false, true, true, false, "Optional"] },
  { feature: "Access to all locations", values: ["1 location", true, true, "Home + guest", true, true] },
  { feature: "Meeting room credits", values: [false, "2 / month", "5 / month", "10 / month", "10 credits", "Custom"] },
  { feature: "24/7 access", values: [false, false, true, true, false, true] },
  { feature: "Guest passes", values: [false, "1 / month", "2 / month", "5 / month", false, "Custom"] },
  { feature: "Business address", values: [false, false, "Add-on", true, false, true] },
  { feature: "Centralised billing", values: [false, false, false, true, true, true] },
];

function MembershipPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Membership"
        title="Choose how you want to work"
        description="Every plan includes Wi-Fi, pantry, community events and access that is prepared automatically with your booking."
      />

      <section className="container-page py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-xl border p-6 ${
                plan.highlight
                  ? "border-primary bg-card shadow-[var(--shadow-lift)]"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight ? (
                <span className="mb-3 w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Most popular
                </span>
              ) : null}
              <h2 className="text-base font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plan.summary}</p>
              <p className="mt-5 text-2xl font-semibold">
                {plan.price}{" "}
                <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
              </p>
              <ul className="mt-5 grid gap-2.5">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-auto w-full" variant={plan.highlight ? "default" : "outline"}>
                <Link to={plan.name === "Enterprise" ? "/enterprise" : "/signup"}>
                  {plan.name === "Enterprise" ? "Talk to Sales" : "Choose Plan"}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="container-page">
          <h2 className="text-h2">Compare plans</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-medium text-muted-foreground">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className="p-4 text-left font-semibold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="p-4 text-muted-foreground">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-4">
                        {v === true ? (
                          <Check className="size-4 text-primary" />
                        ) : v === false ? (
                          <Minus className="size-4 text-muted-foreground" />
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
