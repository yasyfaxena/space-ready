import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Globe, Hexagon, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/", key: "nav.home" },
  { to: "/locations", key: "nav.locations" },
  { to: "/workspaces", key: "nav.workspaces" },
  { to: "/membership", key: "nav.membership" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/amenities", key: "nav.amenities" },
  { to: "/how-it-works", key: "nav.how" },
  { to: "/enterprise", key: "nav.enterprise" },
  { to: "/help", key: "nav.help" },
] as const satisfies readonly { to: string; key: TranslationKey }[];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Hexagon className="size-7 text-primary" strokeWidth={1.6} />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">Sattabi</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Workspaces
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 xl:flex">
          {nav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-2.5 py-2 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "id" : "en")}
            aria-label="Switch language and currency"
            className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <Globe className="size-4" /> {locale === "en" ? "EN · $" : "ID · Rp"}
          </button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <User className="size-4" /> {profile?.full_name?.split(" ")[0] ?? t("cta.dashboard")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{t("cta.dashboard")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" /> {t("cta.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/signup">{t("cta.signup")}</Link>
            </Button>
          )}

          <Button asChild size="sm" className="hidden bg-galaxy-accent hover:opacity-90 sm:inline-flex">
            <Link to="/workspaces">{t("cta.book")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm">
              <SheetTitle className="px-4 pt-4 text-base">{t("nav.menu")}</SheetTitle>
              <nav className="mt-2 flex flex-col px-2 pb-4">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-[15px] text-foreground/90 transition-colors hover:bg-muted"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setLocale(locale === "en" ? "id" : "en")}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-[15px] text-foreground/90 transition-colors hover:bg-muted"
                >
                  <Globe className="size-4" /> {locale === "en" ? "English · USD" : "Indonesia · Rupiah"}
                </button>
                <div className="mt-4 grid gap-2 px-1">
                  {session ? (
                    <>
                      <Button asChild variant="outline" onClick={() => setOpen(false)}>
                        <Link to="/dashboard">{t("cta.dashboard")}</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpen(false);
                          void handleSignOut();
                        }}
                      >
                        {t("cta.logout")}
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/signup">{t("cta.signup")}</Link>
                    </Button>
                  )}
                  <Button asChild className="bg-galaxy-accent" onClick={() => setOpen(false)}>
                    <Link to="/workspaces">{t("cta.book")}</Link>
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
