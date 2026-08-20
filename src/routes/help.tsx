import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/site-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — bookings, payments and access | Sattabi" },
      {
        name: "description",
        content:
          "Answers about booking changes, cancellations, payments, membership credits, guest passes and how workspace access works.",
      },
      { property: "og:title", content: "Sattabi Help Center" },
      {
        property: "og:description",
        content: "Common questions about bookings, payments and access, plus how to reach us.",
      },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I change or cancel a booking?",
    a: "Open the booking from your account and choose Change or Cancel. Meeting rooms can be changed free of charge up to 4 hours before the start time; day passes up to 1 hour before. Monthly plans need 30 days notice before the end of the billing cycle.",
  },
  {
    q: "When does my access start and stop working?",
    a: "Access usually begins 30 minutes before your booking and ends 30 minutes after, depending on the location policy. After that the credential no longer grants new entry. You are never locked inside — exits always work.",
  },
  {
    q: "Which access methods are supported?",
    a: "RFID member cards work at every Sattabi location and keep working even if the network is down. QR access is available at supported entrances, including for guests. Mobile access is being rolled out at selected entrances, so your booking page always shows which methods apply to your space.",
  },
  {
    q: "How do membership credits work?",
    a: "One credit is one hour in a small meeting room. Medium and large rooms use two or three credits per hour. Credits are applied automatically at checkout and only the remainder is charged to your payment method.",
  },
  {
    q: "Can I bring a guest?",
    a: "Yes. Add a guest email during booking and they receive a temporary QR credential valid only for your booking window. Guest day passes for the coworking floor are Rp 75,000.",
  },
  {
    q: "What payment methods can I use?",
    a: "Membership credits, credit and debit cards (Visa, Mastercard, JCB), e-wallets (GoPay, OVO, DANA, ShopeePay) and bank transfer via virtual account. Prices are shown excluding VAT and the 11% is added in the summary.",
  },
  {
    q: "Do I need to check in at reception?",
    a: "No. Your booking is your check-in. Sign up, verify your identity once, and from then on you can book and enter without speaking to anyone.",
  },
  {
    q: "What happens if a space becomes unavailable?",
    a: "If a room becomes unusable we move you to an equivalent space at the same location and refund any difference. You are notified by email and in your account before your booking starts.",
  },
];

function HelpPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Help Center"
        title="How can we help?"
        description="Most answers are here. If something is urgent, our team replies to chat within a few minutes during opening hours."
      />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <h2 className="text-h2">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-5">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-[15px]">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Contact us</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              <li className="flex items-center gap-2.5">
                <MessageSquare className="size-4 text-primary" /> Live chat, 08:00–20:00 WIB
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary" /> help@sattabiworkspaces.id
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary" /> +62 21 5000 8800
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Quick links</h2>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/workspaces">Book a workspace</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/pricing">See pricing</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/how-it-works">How access works</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/login">Sign in to your account</Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
