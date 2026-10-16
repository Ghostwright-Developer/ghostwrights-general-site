import type { MetadataRoute } from "next"
import { getSeoPosts } from "notfair-nextjs-blog"
import { BRAND } from "@/lib/brand"
import { ALLOW_INDEXING } from "@/lib/indexing"

const baseUrl = BRAND.url
const staticRoutes = [
  "/",
  "/how-it-works",
  "/intake",
  "/ways-to-work",
  "/pricing",
  "/who-its-for",
  "/portfolio",
  "/services",
  "/about",
  "/faq",
  "/contact",
  "/blog",
  "/billing",
  "/support",
  "/cancellation",
  "/partner-service-agreement",
  "/terms",
  "/privacy",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!ALLOW_INDEXING) return []

  let posts: Array<{ slug: string; updated_at?: string }> = []
  try {
    posts = await getSeoPosts({ revalidate: 3600 })
  } catch {
    posts = []
  }

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route === "/" ? "" : route}/`, changeFrequency: "monthly" as const, priority: route === "/" ? 1 : 0.7 })),
    ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}/`, changeFrequency: "weekly" as const, priority: 0.8, ...(post.updated_at ? { lastModified: post.updated_at } : {}) })),
  ]
}
