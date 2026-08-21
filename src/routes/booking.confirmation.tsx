import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  KeyRound,
  MapPin,
  QrCode,
  Smartphone,
  Users,
} from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { getLocation, getWorkspace, workspaces } from "@/data/workspace-data";
import { QrPass } from "@/components/site/qr-pass";
import { useI18n } from "@/lib/i18n";

type ConfirmSearch = {
  workspace?: string;
  date?: string;
  start?: string;
  end?: string;
  people?: number;
  method?: string;
  total?: number;
  ref?: string;
};

export const Route = createFileRoute("/booking/confirmation")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): ConfirmSearch => ({
    workspace: typeof search["workspace"] === "string" ? search["workspace"] : "mr-301",
    date: typeof search["date"] === "string" ? search["date"] : "2026-08-25",
    start: typeof search["start"] === "string" ? search["start"] : "14:00",
    end: typeof search["end"] === "string" ? search["end"] : "16:00",
    people: Number(search["people"]) > 0 ? Number(search["people"]) : 6,
    method: typeof search["method"] === "string" ? search["method"] : "card",
    total: Number(search["total"]) > 0 ? Number(search["total"]) : 399600,
    ref: typeof search["ref"] === "string" ? search["ref"] : "SB-DEMO01",
  }),
  head: () => ({
    meta: [
      { title: "Booking confirmed — Sattabi Workspaces" },
      {
        name: "description",
        content: "Your workspace booking is confirmed and your access credential is ready.",
      },
      { property: "og:title", content: "Booking confirmed" },
      { property: "og:description", content: "Your access is ready for your booking window." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingConfirmation,
});

const methodLabel: Record<string, string> = {
  card: "Credit / debit card",
  ewallet: "E-wallet",
  credits: "Membership credits",
  bank: "Bank transfer",
};

function BookingConfirmation() {
  const search = Route.useSearch();
  const { t, money } = useI18n();
  const workspace = getWorkspace(search.workspace ?? "") ?? workspaces[0]!;
  const location = getLocation(workspace.locationSlug)!;

  const start = search.start ?? "14:00";
  const end = search.end ?? "16:00";
  const accessFrom = shift(start, -30);
  const accessTo = shift(end, 30);
  const date = search.date ?? "2026-08-25";
  const reference = search.ref ?? "SB-DEMO01";
  const accessCode = `SATTABI|${reference}|${workspace.id}|${date}|${start}-${end}`;

  return (
    <SiteShell>
      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/8 p-5">
            <CheckCircle2 className="size-6 text-success" />
            <div>
              <h1 className="text-lg font-semibold">{t("book.confirmed")}</h1>
              <p className="text-sm text-muted-foreground">
                Payment successful. A receipt has been sent to your email.
              </p>
            </div>
          </div>

          <article className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-primary/25 bg-primary/5 p-6 text-center">
            <div className="flex items-center gap-2">
              <QrCode className="size-5 text-primary" />
              <h2 className="text-base font-semibold">{t("book.qrTitle")}</h2>
            </div>
            <QrPass value={accessCode} size={224} />
            <p className="font-mono text-xs text-muted-foreground">{reference}</p>
            <p className="max-w-md text-sm text-muted-foreground">{t("book.qrHint")}</p>
          </article>

          <article className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Booking details</h2>
              <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs">
                {reference}
              </span>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail icon={MapPin} label="Location" value={`${location.name}, ${location.city}`} />
              <Detail icon={BadgeCheck} label="Workspace" value={`${workspace.name} · ${workspace.floor}`} />
              <Detail icon={CalendarDays} label="Date" value={formatLong(date)} />
              <Detail icon={Clock} label="Time" value={`${start} – ${end}`} />
              <Detail icon={Users} label="People" value={`${search.people ?? 2} people · 1 guest invited`} />
              <Detail
                icon={CreditCard}
                label="Payment"
                value={`${money(search.total ?? 0)} · ${methodLabel[search.method ?? "card"] ?? "Card"}`}
              />
            </dl>

            <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
              {workspace.cancellation}
            </p>
          </article>

          <article className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              <h2 className="text-base font-semibold">Your access is ready</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Access is linked to this booking. It starts at {accessFrom} and no longer grants new
              entry after {accessTo}.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Credential
                icon={CreditCard}
                title="RFID card"
                status="Ready"
                note="Tap your member card at the entrance and at Level 18."
                tone="ready"
              />
              <Credential
                icon={QrCode}
                title="QR code"
                status="Ready"
                note="Shown in your booking email and account, for you and your guest."
                tone="ready"
              />
              <Credential
                icon={Smartphone}
                title="Mobile access"
                status="Not available here"
                note="Supported at selected entrances only. Use RFID or QR at this location."
                tone="muted"
              />
            </div>

            <dl className="mt-5 grid gap-3 rounded-lg border border-border bg-card p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Access validity</dt>
                <dd className="mt-1">
                  {formatLong(date)} · {accessFrom} – {accessTo}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Access status</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
                    <span className="size-1.5 rounded-full bg-current" /> Ready
                  </span>
                  <span className="text-xs text-muted-foreground">Becomes active at {accessFrom}</span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Where it works</dt>
                <dd className="mt-1">
                  Main entrance at {location.address} and the door to {workspace.name}.
                </dd>
              </div>
            </dl>
          </article>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-galaxy-accent">
              <Link to="/dashboard">{t("cta.dashboard")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/workspaces" search={{ location: location.slug }}>
                Book another workspace
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/locations/$slug" params={{ slug: location.slug }}>
                View location details
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/help">Need to change this booking?</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Credential({
  icon: Icon,
  title,
  status,
  note,
  tone,
}: {
  icon: typeof KeyRound;
  title: string;
  status: string;
  note: string;
  tone: "ready" | "muted";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Icon className={tone === "ready" ? "size-4 text-primary" : "size-4 text-muted-foreground"} />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p
        className={`mt-1 text-xs font-medium ${tone === "ready" ? "text-success" : "text-muted-foreground"}`}
      >
        {status}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
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
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-sm">{value}</dd>
      </div>
    </div>
  );
}

function shift(time: string, minutes: number) {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatLong(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
