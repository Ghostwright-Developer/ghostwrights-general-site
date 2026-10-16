import "server-only"

export interface PortfolioSite {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  url: string
  color: string
  label: "Live client site" | "Sample build"
}

export type PublicPortfolioSite = Omit<PortfolioSite, "url"> & { previewPath: string }

// Real URLs never leave the server. Visitors only ever see /s/{id}/.
// To add a site: add one entry here and drop a 1280x800 screenshot in public/images/portfolio/.
const PORTFOLIO_SITES: PortfolioSite[] = [
  {
    id: "lone-star-septic",
    name: "Lone Star Septic",
    category: "Septic Services",
    description:
      "Expert septic tank pumping, maintenance, and repair services for residential and commercial properties.",
    thumbnail: "/images/portfolio/lone-star-septic.png",
    url: "https://lone-star.ghostwrightweb.com",
    color: "#2c5f2d",
    label: "Sample build",
  },
  {
    id: "ramas-roofing",
    name: "Roofing Contractor (Sample)",
    category: "Roofing Contractor",
    description: "Premium residential and commercial roofing solutions with expert craftsmanship and reliable service.",
    thumbnail: "/images/portfolio/ramas-roofing.png",
    url: "https://phoenix-roofer.ghostwrightweb.com",
    color: "#c41e3a",
    label: "Sample build",
  },
  {
    id: "elite-roofing",
    name: "Elite Roofing",
    category: "Roofing Contractor",
    description: "Professional roofing services specializing in residential and commercial projects.",
    thumbnail: "/images/portfolio/elite-roofing.png",
    url: "https://eliteroofing.ghostwrightweb.com",
    color: "#8B4513",
    label: "Sample build",
  },
  {
    id: "custom-remodeling-atl",
    name: "Custom Remodeling ATL",
    category: "Remodeling Contractor",
    description:
      "Expert home remodeling and renovation services in Atlanta, specializing in kitchens, bathrooms, and whole-home transformations.",
    thumbnail: "/images/portfolio/custom-remodeling-atl.png",
    url: "https://customremodelingatl.com",
    color: "#D4A574",
    label: "Live client site",
  },
  {
    id: "cindermesa-hardscapes",
    name: "Cindermesa Hardscapes",
    category: "Hardscaping Contractor",
    description:
      "Paver patios, retaining walls, driveways, flagstone walkways and fire pits across the Tucson area.",
    thumbnail: "/images/portfolio/cindermesa-hardscapes.png",
    url: "https://cindermesa-hardscapes.vercel.app",
    color: "#4d7c0f",
    label: "Sample build",
  },
]

export function getPortfolioSite(id: string): PortfolioSite | undefined {
  return PORTFOLIO_SITES.find((site) => site.id === id)
}

export function publicPortfolio(): PublicPortfolioSite[] {
  return PORTFOLIO_SITES.map(({ url: _url, ...site }) => ({
    ...site,
    previewPath: `/s/${site.id}/`,
  }))
}
