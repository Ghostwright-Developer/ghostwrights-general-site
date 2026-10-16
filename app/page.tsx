import type { Metadata } from "next"
import { PartnerHome } from "@/components/partner-home"
import { BRAND } from "@/lib/brand"

const title = `White-Label Websites for Agencies | ${BRAND.short}`
const description =
  "Add custom-coded websites to your client offering. Ghostwright builds, hosts, and maintains them under your brand: $149 setup per site, then $25/month."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ghostwright Web Development. Websites built under your name." }],
    title,
    description,
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: `${BRAND.url}/`,
  description: "White-label website fulfillment for agencies that serve small businesses.",
}

export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><PartnerHome /></>
}
