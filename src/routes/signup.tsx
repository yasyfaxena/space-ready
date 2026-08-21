import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { clearPendingBooking, loadPendingBooking } from "@/lib/pending-booking";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your Sattabi Workspaces account" },
      {
        name: "description",
        content:
          "Sign up in minutes, then book workspace and get your QR access pass without visiting a reception desk.",
      },
      { property: "og:title", content: "Sign up — Sattabi Workspaces" },
      {
        property: "og:description",
        content: "Fully digital onboarding: register, book, enter.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err, needsConfirmation } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone,
      company: form.company,
    });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    if (needsConfirmation) {
      setConfirmSent(true);
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

  return (
    <SiteShell>
      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="max-w-md">
          <p className="text-eyebrow">{t("cta.signup")}</p>
          <h1 className="text-h1 mt-2">Set up your account online</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Everything happens here — no visit to a reception desk. Once your account is active you
            can book a room by the hour and get a QR access pass instantly.
          </p>

          <ul className="mt-8 grid gap-3">
            {[
              "Create your account",
              "Pick a room and the hours you need",
              "Pay securely online",
              "Get your QR access pass on screen",
            ].map((s) => (
              <li
                key={s}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <CheckCircle2 className="size-4 text-primary" />
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Your access credential is issued with your first confirmed booking, so entry works the
              moment you arrive.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]">
          {confirmSent ? (
            <div className="grid gap-4 text-center">
              <MailCheck className="mx-auto size-8 text-primary" />
              <h2 className="text-base font-semibold">Confirm your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to {form.email}. Click it, then log in to continue.
              </p>
              <Button asChild size="lg" className="bg-galaxy-accent">
                <Link to="/login">{t("cta.login")}</Link>
              </Button>
            </div>
          ) : (
            <form className="grid gap-4" onSubmit={(e) => void onSubmit(e)}>
              <h2 className="text-base font-semibold">Create your account</h2>
              <div className="grid gap-1.5">
                <Label htmlFor="s-name">{t("auth.fullName")}</Label>
                <Input id="s-name" value={form.fullName} onChange={set("fullName")} placeholder="Anisa Rahmawati" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-email">{t("auth.email")}</Label>
                <Input id="s-email" type="email" value={form.email} onChange={set("email")} placeholder="anisa@company.co.id" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-phone">{t("auth.phone")}</Label>
                <Input id="s-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+62 812 3456 7890" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-company">{t("auth.company")}</Label>
                <Input id="s-company" value={form.company} onChange={set("company")} placeholder="Nusantara Digital" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-password">{t("auth.password")}</Label>
                <Input
                  id="s-password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>
              <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Checkbox required className="mt-0.5" />
                I agree to the Terms of Service and Privacy Policy.
              </label>

              {error ? (
                <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" /> {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="bg-galaxy-accent" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> {t("auth.creating")}
                  </>
                ) : (
                  t("auth.createAccount")
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t("cta.login")}
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
