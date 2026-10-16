import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = {
  alternates: { canonical: "/contact/" },
  title: `Become a Partner | ${BRAND.short}`,
  description: "Tell us about your agency and how many small businesses you onboard.",
  openGraph: {
    url: "/contact/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ghostwright Web Development. Websites built under your name." }],
    title: `Become a Partner | ${BRAND.short}`,
    description: "Tell us about your agency and how many small businesses you onboard.",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
