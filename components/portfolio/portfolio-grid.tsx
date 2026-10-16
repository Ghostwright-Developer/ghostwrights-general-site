"use client"

import * as React from "react"
import Image from "next/image"
import { X, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PublicPortfolioSite } from "@/lib/portfolio"

export function PortfolioGrid({ sites }: { sites: PublicPortfolioSite[] }) {
  const [selectedSite, setSelectedSite] = React.useState<PublicPortfolioSite | null>(null)

  React.useEffect(() => {
    if (!selectedSite) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSite(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [selectedSite])

  if (sites.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Portfolio sites coming soon...</p>
      </div>
    )
  }

  return (
    <>
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {sites.map((site) => (
          <li key={site.id} className="group">
            <button
              type="button"
              onClick={() => setSelectedSite(site)}
              className="relative block w-full aspect-[8/5] overflow-hidden rounded-xl mb-4 border-2 border-border hover:border-primary focus-visible:border-primary focus-visible:outline-none transition-colors duration-300 bg-muted shadow-lg"
              aria-label={`Preview ${site.name}`}
            >
              <Image
                src={site.thumbnail || "/placeholder.svg"}
                alt={`${site.name} homepage`}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                <span className="text-white font-semibold text-lg">Click to View Full Site</span>
              </span>
            </button>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-lg">{site.name}</h2>
                <Badge variant={site.label === "Live client site" ? "default" : "secondary"}>{site.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{site.category}</p>
              <p className="text-sm text-muted-foreground">{site.description}</p>
              <div className="flex gap-2">
                <Button className="flex-1 text-white" style={{ backgroundColor: site.color }} onClick={() => setSelectedSite(site)}>
                  View Live Site
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={site.previewPath} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open {site.name} in a new tab</span>
                  </a>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedSite && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSite(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            className="bg-background rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 p-4 md:p-6 border-b bg-muted/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-4 h-4 shrink-0 rounded-full" style={{ backgroundColor: selectedSite.color }} />
                <div className="min-w-0">
                  <h2 id="portfolio-modal-title" className="font-semibold text-lg truncate">
                    {selectedSite.name}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">{selectedSite.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="gap-2">
                  <a href={selectedSite.previewPath} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSite(null)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close preview</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                key={selectedSite.id}
                src={selectedSite.previewPath}
                className="w-full h-full border-0"
                title={`${selectedSite.name} live preview`}
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
