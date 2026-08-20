import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Workspace",
    links: [
      { label: "Locations", to: "/locations" },
      { label: "Workspaces", to: "/workspaces" },
      { label: "Amenities", to: "/amenities" },
      { label: "How It Works", to: "/how-it-works" },
    ],
  },
  {
    title: "Plans",
    links: [
      { label: "Membership", to: "/membership" },
      { label: "Pricing", to: "/pricing" },
      { label: "Enterprise", to: "/enterprise" },
      { label: "Sign Up", to: "/signup" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "FAQ", to: "/help" },
      { label: "Contact", to: "/help" },
      { label: "Login", to: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <Hexagon className="size-5 text-primary" strokeWidth={1.6} />
            <span className="font-semibold tracking-tight">Sattabi Workspaces</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Book a desk, a room or an office in minutes. Your access is prepared with the booking,
            so you can walk straight in.
          </p>
          <div className="mt-5 flex gap-2">
            <span className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              Download App — iOS
            </span>
            <span className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              Android
            </span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sattabi Workspaces. Jakarta · Tangerang · Bandung.</p>
          <div className="flex gap-5">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
