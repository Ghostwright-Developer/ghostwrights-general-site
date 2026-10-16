import { InlineContactForm } from "@/components/inline-contact-form"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { publicPortfolio } from "@/lib/portfolio"

export default function PortfolioPage() {
  const sites = publicPortfolio()

  return (
    <div className="w-full">
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-6 md:px-12">
        <section className="container py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Our <span className="text-primary">Work</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mt-8">
            Explore sites we&apos;ve built for small businesses. Click any project to preview the live site.
          </p>
        </section>

        <section className="container pb-20">
          <PortfolioGrid sites={sites} />
        </section>

        <InlineContactForm />
      </div>
    </div>
  )
}
