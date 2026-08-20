import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Users,
  Wallet,
} from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getLocation, getWorkspace, rupiah, workspaces } from "@/data/workspace-data";

type ReviewSearch = {
  workspace?: string;
  date?: string;
  start?: string;
  end?: string;
  people?: number;
};

export const Route = createFileRoute("/booking/review")({
  validateSearch: (search: Record<string, unknown>): ReviewSearch => ({
    workspace: typeof search["workspace"] === "string" ? search["workspace"] : "mr-301",
    date: typeof search["date"] === "string" ? search["date"] : "2026-08-25",
    start: typeof search["start"] === "string" ? search["start"] : "14:00",
    end: typeof search["end"] === "string" ? search["end"] : "16:00",
    people: Number(search["people"]) > 0 ? Number(search["people"]) : 6,
  }),
  head: () => ({
    meta: [
      { title: "Review your booking — Sattabi Workspaces" },
      {
        name: "description",
        content:
          "Check your workspace, date, time, guests and price breakdown, then pay by card, e-wallet, transfer or membership credits.",
      },
      { property: "og:title", content: "Review your booking" },
      { property: "og:description", content: "Confirm the details and pay securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingReview,
});

const steps = ["Workspace", "Date & time", "Guests", "Review", "Payment", "Confirmed"];

function BookingReview() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const workspace = getWorkspace(search.workspace ?? "") ?? workspaces[0]!;
  const location = getLocation(workspace.locationSlug)!;

  const date = search.date ?? "2026-08-25";
  const start = search.start ?? "14:00";
  const end = search.end ?? "16:00";
  const people = search.people ?? 2;

  const [guest, setGuest] = useState("");
  const [promo, setPromo] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "applied" | "invalid">("idle");
  const [method, setMethod] = useState("card");
  const [status, setStatus] = useState<"draft" | "processing" | "failed">("draft");

  const hours = useMemo(() => {
    const [sh = 0, sm = 0] = start.split(":").map(Number);
    const [eh = 0, em = 0] = end.split(":").map(Number);
    return Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 60);
  }, [start, end]);

  const subtotal = workspace.unit === "hour" ? workspace.price * hours : workspace.price;
  const discount = promoState === "applied" ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * 0.11);
  const total = subtotal - discount + tax;

  const submit = () => {
    setStatus("processing");
    setTimeout(() => {
      if (method === "bank") {
        setStatus("failed");
        return;
      }
      navigate({
        to: "/booking/confirmation",
        search: { workspace: workspace.id, date, start, end, people, method, total },
      });
    }, 1200);
  };

  return (
    <SiteShell>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-8">
          <ol className="flex flex-wrap gap-x-2 gap-y-2 text-xs">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 font-medium ${
                    i <= 3 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  {i + 1}. {s}
                </span>
                {i < steps.length - 1 ? <span className="text-muted-foreground">→</span> : null}
              </li>
            ))}
          </ol>
          <h1 className="text-h1 mt-6">Review your booking</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Check the details below. Your access is prepared as soon as payment is confirmed.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="grid gap-6">
          <article className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Booking details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail icon={Building2} label="Location" value={`${location.name}, ${location.city}`} />
              <Detail icon={Building2} label="Workspace" value={`${workspace.name} · ${workspace.floor}`} />
              <Detail icon={CalendarDays} label="Date" value={formatDate(date)} />
              <Detail icon={Clock} label="Time" value={`${start} – ${end} (${hours} hours)`} />
              <Detail icon={Users} label="People" value={`${people} people`} />
              <Detail icon={Clock} label="Cancellation" value={workspace.cancellation} />
            </div>
          </article>

          <article className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Add a guest</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Guests receive a temporary QR credential valid only for your booking window.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Guest email address"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
              <Button variant="outline" type="button">
                Add guest
              </Button>
            </div>
          </article>

          <article className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Payment method</h2>
            <RadioGroup value={method} onValueChange={setMethod} className="mt-4 grid gap-3">
              {[
                { id: "credits", label: "Membership credits", hint: "You have 6 meeting room credits" },
                { id: "card", label: "Credit / debit card", hint: "Visa, Mastercard, JCB" },
                { id: "ewallet", label: "E-wallet", hint: "GoPay, OVO, DANA, ShopeePay" },
                { id: "bank", label: "Bank transfer / virtual account", hint: "BCA, Mandiri, BNI" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <RadioGroupItem value={m.id} id={m.id} />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.hint}</span>
                  </span>
                  {m.id === "credits" ? (
                    <Wallet className="size-4 text-muted-foreground" />
                  ) : (
                    <CreditCard className="size-4 text-muted-foreground" />
                  )}
                </label>
              ))}
            </RadioGroup>

            {status === "failed" ? (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 p-4">
                <AlertCircle className="mt-0.5 size-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Payment failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The virtual account could not be created. Your booking is held as pending payment
                    for 30 minutes — try another method.
                  </p>
                </div>
              </div>
            ) : null}
          </article>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-24">
          <h2 className="text-base font-semibold">Price summary</h2>

          <dl className="mt-5 space-y-2.5 text-sm">
            <Row label={`${workspace.type} × ${workspace.unit === "hour" ? `${hours} hours` : `1 ${workspace.unit}`}`} value={rupiah(subtotal)} />
            <Row label="Discount" value={discount ? `− ${rupiah(discount)}` : "—"} />
            <Row label="Tax (VAT 11%)" value={rupiah(tax)} />
          </dl>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => setPromoState(promo.trim().toUpperCase() === "WORK10" ? "applied" : "invalid")}
            >
              Apply
            </Button>
          </div>
          {promoState === "applied" ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="size-3.5" /> WORK10 applied — 10% off
            </p>
          ) : promoState === "invalid" ? (
            <p className="mt-2 text-xs text-destructive">That code is not valid. Try WORK10.</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Try WORK10 for 10% off your first booking.</p>
          )}

          <Separator className="my-5" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-2xl font-semibold">{rupiah(total)}</span>
          </div>

          <Button size="lg" className="mt-5 w-full" onClick={submit} disabled={status === "processing"}>
            {status === "processing" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Processing payment…
              </>
            ) : (
              "Confirm & Pay"
            )}
          </Button>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {workspace.cancellation} By confirming you accept the booking terms.
          </p>

          <div className="mt-5 rounded-lg bg-surface p-4">
            <p className="text-xs font-medium">Access included</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              After payment, your credential is prepared for {location.name} and valid from 30
              minutes before your start time.
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
            <Link to="/workspaces/$id" params={{ id: workspace.id }}>
              Change workspace
            </Link>
          </Button>
        </aside>
      </section>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-t border-border pt-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </div>
  );
}

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
