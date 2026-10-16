import type { Metadata } from "next"
import Link from "next/link"

import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InlineContactForm } from "@/components/inline-contact-form"
import { Reveal } from "@/components/reveal"
import { BRAND } from "@/lib/brand"
import { OFFER } from "@/lib/offer"

const title = `Who It's For: Agencies and Firms | ${BRAND.short}`
const description =
  "Marketing agencies, web and IT firms, formation services, accountants, insurance agencies, and consultants: add websites to your offer without a web team."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/who-its-for/" },
  openGraph: {
    url: "/who-its-for/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ghostwright Web Development. Websites built under your name." }],
    title,
    description,
  },
}

const partnerTypes = [
  { title: "Marketing and advertising agencies", description: "Offer websites without hiring developers." },
  { title: "Web and IT firms", description: "Add overflow capacity under your own brand." },
  { title: "Business formation services", description: "A website is the next thing every new business needs." },
  { title: "Accounting and bookkeeping firms", description: "Give new clients a professional online presence." },
  { title: "Insurance agencies", description: "Offer a website when a new business is covered." },
  { title: "Consultants and coaches", description: "Add a done-for-you website to your program." },
  { title: "Payroll, HR, and staffing firms", description: "Round out your small-business services." },
  { title: "Answering and call-handling services", description: "Pair your service with a site that rings your phone." },
]

const sameForEveryPartner = [
  "You set the price and bill your client.",
  "White-label by default, or we work with your clients as your web team.",
  `$${OFFER.setupFee} setup per site, then $${OFFER.monthlyFee}/month per active site.`,
  "One Partner Service Agreement, signed once.",
]

export default function WhoItsForPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-6 md:px-12">
        <section className="container py-20 md:py-28">
          <Reveal as="div" className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-balance">
              Built for agencies that serve small businesses
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If your clients keep asking for a website, and you don&apos;t want to hire developers, this is for you.
              You sell it, bill it, and keep the relationship. We build it quietly behind your brand.
            </p>
          </Reveal>
        </section>

        <section className="container pb-16">
          <Reveal as="div">
            <h2 className="text-2xl font-bold mb-6 text-center">Who partners with us</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partnerTypes.map((partner, index) => (
              <Reveal as="div" key={partner.title} index={index}>
                <Card className="h-full bg-card/50">
                  <CardContent className="p-6">
                    <p className="text-sm font-semibold leading-6">{partner.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{partner.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container pb-16">
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            <Reveal as="div">
              <h2 className="text-2xl font-bold mb-4">Who your clients are</h2>
              <p className="text-muted-foreground leading-relaxed">
                Small service businesses, such as contractors, home services, and local trades. We have a specialized
                intake form for eight trades (roofing, remodeling, plumbing, HVAC, electrical, landscaping, septic, and
                more) and a general one for any other service business.
              </p>
            </Reveal>

            <Reveal as="div">
              <h2 className="text-2xl font-bold mb-4">What stays the same for every partner</h2>
              <ul className="grid gap-3">
                {sameForEveryPartner.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="div">
              <h2 className="text-2xl font-bold mb-4">A good fit looks like</h2>
              <p className="text-muted-foreground leading-relaxed">
                You add new small-business clients regularly, you&apos;d rather not run a web team, and you&apos;re
                comfortable invoicing for a service.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="container pb-20">
          <Reveal as="div" className="rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 text-center border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">See how it fits your agency</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              First version in {OFFER.firstVersion} from your greenlight.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </Reveal>
        </section>

        <InlineContactForm />
      </div>
    </div>
  )
}
