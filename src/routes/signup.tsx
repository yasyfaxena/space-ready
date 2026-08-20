import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Loader2, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Sattabi Workspaces account" },
      {
        name: "description",
        content:
          "Sign up in minutes, verify your email, phone and ID online, then book workspace and get access without visiting a reception desk.",
      },
      { property: "og:title", content: "Sign up — Sattabi Workspaces" },
      {
        property: "og:description",
        content: "Fully digital onboarding: register, verify, book, enter.",
      },
    ],
  }),
  component: SignupPage,
});

const stages = ["Account", "Email", "Phone", "Identity", "Ready"];

function SignupPage() {
  const [stage, setStage] = useState(0);
  const [busy, setBusy] = useState(false);

  const advance = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStage((s) => Math.min(s + 1, 4));
    }, 900);
  };

  return (
    <SiteShell>
      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="max-w-md">
          <p className="text-eyebrow">Sign up</p>
          <h1 className="text-h1 mt-2">Set up your account online</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Everything happens here — no visit to a reception desk, no paperwork on your first day.
            Verification usually takes under five minutes.
          </p>

          <ol className="mt-8 grid gap-3">
            {stages.map((s, i) => (
              <li
                key={s}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                  i === stage ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                {i < stage ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <Circle className={i === stage ? "size-4 text-primary" : "size-4 text-muted-foreground"} />
                )}
                <span className={i <= stage ? "font-medium" : "text-muted-foreground"}>{s}</span>
                {i < stage ? <span className="ml-auto text-xs text-success">Verified</span> : null}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Identity verification lets us issue your access credential straight away, so your first
              booking works the moment you arrive.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]">
          {stage === 0 ? (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                advance();
              }}
            >
              <h2 className="text-base font-semibold">Create your account</h2>
              <div className="grid gap-1.5">
                <Label htmlFor="s-name">Full name</Label>
                <Input id="s-name" placeholder="Anisa Rahmawati" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" placeholder="anisa@company.co.id" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-phone">Phone</Label>
                <Input id="s-phone" type="tel" placeholder="+62 812 3456 7890" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-company">Company (optional)</Label>
                <Input id="s-company" placeholder="Nusantara Digital" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-password">Password</Label>
                <Input id="s-password" type="password" placeholder="At least 8 characters" required />
              </div>
              <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Checkbox required className="mt-0.5" />
                I agree to the Terms of Service and Privacy Policy.
              </label>
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
              </Button>
            </form>
          ) : stage === 1 || stage === 2 ? (
            <div className="grid gap-4">
              <h2 className="text-base font-semibold">
                {stage === 1 ? "Verify your email" : "Verify your phone"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {stage === 1
                  ? "We sent a 6-digit code to anisa@company.co.id."
                  : "We sent a 6-digit code by SMS to +62 812 3456 7890."}
              </p>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button size="lg" onClick={advance} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Verify and continue"}
              </Button>
              <button type="button" className="text-sm text-primary hover:underline">
                Resend code
              </button>
            </div>
          ) : stage === 3 ? (
            <div className="grid gap-4">
              <h2 className="text-base font-semibold">Identity verification</h2>
              <p className="text-sm text-muted-foreground">
                Upload a photo of your KTP or passport and take a selfie. This is checked
                automatically, usually within two minutes.
              </p>
              <div className="grid gap-3">
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Drop your ID photo here, or browse
                </div>
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Take a selfie to match your ID
                </div>
              </div>
              <p className="rounded-lg bg-surface px-4 py-3 text-xs text-muted-foreground">
                Status: verification pending — you can already browse and hold a booking while this
                completes.
              </p>
              <Button size="lg" onClick={advance} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Submit for verification"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <h2 className="text-base font-semibold">Account activated</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                You are verified. Choose a day pass or membership, or book a workspace straight away
                — your credential will be issued with your first confirmed booking.
              </p>
              <div className="grid gap-2">
                <Button asChild size="lg">
                  <Link to="/workspaces">Book a workspace</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/membership">Choose a membership</Link>
                </Button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
