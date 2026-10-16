import { getPortfolioSite } from "@/lib/portfolio"
import { buildClientShim, rewriteText } from "@/lib/portfolio-proxy"

export const dynamic = "force-dynamic"

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "user-agent",
  "range",
  "rsc",
  "next-router-state-tree",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-url",
]

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-language",
  "content-range",
  "accept-ranges",
  "last-modified",
  "etag",
  "vary",
]

const MAX_INTERNAL_REDIRECTS = 5

type RouteContext = { params: Promise<{ id: string; path?: string[] }> }

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
}

function isTextual(contentType: string) {
  return /^text\/|javascript|json|x-component|xml|svg/i.test(contentType)
}

function cacheControlFor(contentType: string, isRsc: boolean) {
  if (isRsc || /text\/html|x-component/i.test(contentType)) return "no-store"
  if (/javascript|text\/css|json/i.test(contentType)) return "public, max-age=300"
  return "public, max-age=3600, s-maxage=86400"
}

function unavailable(status = 502) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Unavailable</title></head><body style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;color:#555"><p>This sample is unavailable right now.</p></body></html>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  )
}

async function handle(request: Request, { params }: RouteContext) {
  const { id } = await params
  const site = getPortfolioSite(id)
  if (!site) return unavailable(404)

  const origin = new URL(site.url)
  const prefix = `/s/${id}`
  const incoming = new URL(request.url)
  const upstreamPath = incoming.pathname.slice(prefix.length) || "/"

  let upstreamUrl = new URL(upstreamPath + incoming.search, origin)
  if (upstreamUrl.host !== origin.host) return unavailable(404)

  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (!value) continue
    if (name === "next-url" && value.startsWith(prefix)) {
      headers.set(name, value.slice(prefix.length) || "/")
    } else {
      headers.set(name, value)
    }
  }

  let upstream: Response
  try {
    for (let hop = 0; ; hop++) {
      upstream = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        redirect: "manual",
        cache: "no-store",
      })

      if (upstream.status < 300 || upstream.status >= 400 || upstream.status === 304) break

      const location = upstream.headers.get("location")
      if (!location) break

      const target = new URL(location, upstreamUrl)
      if (target.host !== origin.host) return unavailable(404)

      const sameResource =
        stripTrailingSlash(target.pathname) === stripTrailingSlash(upstreamUrl.pathname) &&
        target.search === upstreamUrl.search

      // Trailing-slash-only redirects are followed here; returning them would loop
      // against this app's own trailingSlash redirect.
      if (sameResource && hop < MAX_INTERNAL_REDIRECTS) {
        upstreamUrl = target
        continue
      }

      return new Response(null, {
        status: upstream.status,
        headers: {
          location: `${prefix}${target.pathname}${target.search}${target.hash}`,
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      })
    }
  } catch {
    return unavailable()
  }

  const contentType = upstream.headers.get("content-type") ?? ""
  const isRsc = request.headers.has("rsc") || /x-component/i.test(contentType)

  const responseHeaders = new Headers()
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) responseHeaders.set(name, value)
  }
  responseHeaders.set("cache-control", cacheControlFor(contentType, isRsc))
  responseHeaders.set("x-robots-tag", "noindex, nofollow")

  if (request.method === "HEAD" || upstream.status === 204 || upstream.status === 304) {
    return new Response(null, { status: upstream.status, headers: responseHeaders })
  }

  if (!isTextual(contentType)) {
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders })
  }

  const isHtml = /text\/html/i.test(contentType)
  let body = rewriteText(await upstream.text(), { origin, id, isHtml })

  if (isHtml) {
    const shim = `<script>${buildClientShim(prefix)}</script>`
    body = /<head[^>]*>/i.test(body) ? body.replace(/<head[^>]*>/i, (tag) => tag + shim) : shim + body
  }

  return new Response(body, { status: upstream.status, headers: responseHeaders })
}

export const GET = handle
export const HEAD = handle
