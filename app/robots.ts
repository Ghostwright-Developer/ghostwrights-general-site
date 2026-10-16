import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/brand"
import { ALLOW_INDEXING } from "@/lib/indexing"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    ...(ALLOW_INDEXING ? { sitemap: `${BRAND.url}/sitemap.xml` } : {}),
  }
}
