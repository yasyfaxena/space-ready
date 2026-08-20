import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Hexagon, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
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
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  return (
    <SiteShell>
      <section className="container-page flex justify-center py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Hexagon className="size-5 text-primary" strokeWidth={1.6} />
            <span className="text-sm font-semibold">Sattabi Workspaces</span>
          </div>

          <h1 className="text-h1 mt-6">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to book a space and manage your access.
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("loading");
              setTimeout(() => setStatus("error"), 1000);
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="l-email">Email</Label>
              <Input id="l-email" type="email" placeholder="you@company.co.id" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="l-password">Password</Label>
              <Input id="l-password" type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked /> Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            {status === "error" ? (
              <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="size-4" /> That email and password combination did not match.
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Sattabi?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
