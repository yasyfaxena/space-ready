import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, KeyRound, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { QrPass } from "@/components/site/qr-pass";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getLocation } from "@/data/workspace-data";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My account — Sattabi Workspaces" },
      {
        name: "description",
        content: "Manage your Sattabi bookings, access passes and member details.",
      },
      { property: "og:title", content: "My account — Sattabi Workspaces" },
      { property: "og:description", content: "Your bookings and QR access passes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

type BookingRow = {
  id: string;
  workspace_id: string;
  workspace_name: string;
  location_slug: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  people: number;
  total_idr: number;
  status: string;
  reference: string;
  access_code: string;
};

function DashboardPage() {
  const { session, profile, loading } = useAuth();
  const { t, money } = useI18n();
  const navigate = useNavigate();
  const [rows, setRows] = useState<BookingRow[] | null>(null);
  const [openPass, setOpenPass] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    let active = true;
    void supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .then(({ data }) => {
        if (active) setRows((data as BookingRow[]) ?? []);
      });
    return () => {
      active = false;
    };
  }, [session]);

  const today = new Date().toISOString().slice(0, 10);
  const { upcoming, past } = useMemo(() => {
    const list = rows ?? [];
    return {
      upcoming: list.filter((b) => b.booking_date >= today && b.status === "confirmed"),
      past: list.filter((b) => b.booking_date < today || b.status !== "confirmed"),
    };
  }, [rows, today]);

  const cancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((prev) => prev?.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)) ?? null);
    toast.success(t("dash.cancelled"));
  };

  if (!session) {
    return (
      <SiteShell>
        <div className="container-page py-24 text-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      </SiteShell>
    );
  }

  const renderBooking = (b: BookingRow) => {
    const location = getLocation(b.location_slug);
    return (
      <article key={b.id} className="hover-glow rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{b.workspace_name}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {location?.name ?? b.location_slug}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> {b.booking_date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {b.start_time} – {b.end_time}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {b.people} {t("common.people")}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{money(Number(b.total_idr))}</p>
            <p className="font-mono text-xs text-muted-foreground">{b.reference}</p>
          </div>
        </div>

        {b.status === "cancelled" ? (
          <p className="mt-4 inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {t("dash.cancelled")}
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setOpenPass(openPass === b.id ? null : b.id)}>
              <KeyRound className="size-4" /> {t("dash.viewPass")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void cancel(b.id)}>
              {t("dash.cancel")}
            </Button>
          </div>
        )}

        {openPass === b.id ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 p-5">
            <QrPass value={b.access_code} size={200} />
            <p className="font-mono text-xs text-muted-foreground">{b.access_code}</p>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <SiteShell>
      <PageHeader
        eyebrow={profile?.company ?? session.user.email ?? ""}
        title={`${t("dash.title")}${profile?.full_name ? ` — ${profile.full_name}` : ""}`}
        description={t("dash.bookings")}
      />

      <section className="container-page grid gap-10 py-10">
        <div>
          <h2 className="text-h2">{t("dash.upcoming")}</h2>
          <div className="mt-4 grid gap-4">
            {rows === null ? (
              <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            ) : upcoming.length ? (
              upcoming.map(renderBooking)
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">{t("dash.empty")}</p>
                <Button asChild className="mt-4 bg-galaxy-accent">
                  <Link to="/workspaces">{t("cta.book")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {past.length ? (
          <div>
            <h2 className="text-h2">{t("dash.past")}</h2>
            <div className="mt-4 grid gap-4 opacity-80">{past.map(renderBooking)}</div>
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
