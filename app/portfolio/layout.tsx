import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio/" },
  title: `Small Business Website Portfolio | ${BRAND.short}`,
  description: "Sites built for small businesses, such as roofing, remodeling, and septic companies, delivered under partner brands.",
  openGraph: {
    url: "/portfolio/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ghostwright Web Development. Websites built under your name." }],
    title: `Small Business Website Portfolio | ${BRAND.short}`,
    description: "Sites built for small businesses, such as roofing, remodeling, and septic companies, delivered under partner brands.",
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}
