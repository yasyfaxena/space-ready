import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Hexagon, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { clearPendingBooking, loadPendingBooking } from "@/lib/pending-booking";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Log in to your Sattabi Workspaces account" },
      {
        name: "description",
        content: "Sign in to manage bookings, membership and workspace access.",
      },
      { property: "og:title", content: "Log in — Sattabi Workspaces" },
      { property: "og:description", content: "Access your bookings and membership." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    const pending = loadPendingBooking();
    if (pending) {
      clearPendingBooking();
      navigate({ to: "/booking/review", search: pending });
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const pending = typeof window !== "undefined" ? loadPendingBooking() : null;

  return (
    <SiteShell>
      <section className="container-page flex justify-center py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Hexagon className="size-5 text-primary" strokeWidth={1.6} />
            <span className="text-sm font-semibold">Sattabi Workspaces</span>
          </div>

          <h1 className="text-h1 mt-6">{t("auth.loginTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>

          {pending ? (
            <p className="mt-4 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
              {t("auth.loginRequired")}
            </p>
          ) : null}

          <form className="mt-8 grid gap-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="grid gap-1.5">
              <Label htmlFor="l-email">{t("auth.email")}</Label>
              <Input
                id="l-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.co.id"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="l-password">{t("auth.password")}</Label>
              <Input
                id="l-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? (
              <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" /> {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="bg-galaxy-accent" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {t("auth.signingIn")}
                </>
              ) : (
                t("cta.login")
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="text-primary hover:underline">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
