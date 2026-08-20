import { Link } from "@tanstack/react-router";
import { Menu, Globe, Hexagon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/locations", label: "Locations" },
  { to: "/workspaces", label: "Workspaces" },
  { to: "/membership", label: "Membership" },
  { to: "/pricing", label: "Pricing" },
  { to: "/amenities", label: "Amenities" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/enterprise", label: "Enterprise" },
  { to: "/help", label: "Help Center" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Hexagon className="size-6 text-primary" strokeWidth={1.6} />
          <span className="text-[15px] font-semibold tracking-tight">Sattabi Workspaces</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 xl:flex">
          {nav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-2.5 py-2 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground lg:flex">
            <Globe className="size-4" /> EN
          </button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/workspaces">Book a Space</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm">
              <SheetTitle className="px-4 pt-4 text-base">Menu</SheetTitle>
              <nav className="mt-2 flex flex-col px-2 pb-4">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-[15px] text-foreground/90 transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 grid gap-2 px-1">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/workspaces">Book a Space</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
