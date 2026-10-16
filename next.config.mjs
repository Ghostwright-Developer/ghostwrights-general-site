/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "notfair.co",
        pathname: "/api/seo/**",
      },
    ],
  },
  trailingSlash: true,
  async headers() {
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") return []
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/for-insurance-agencies",
        destination: "/who-its-for",
        permanent: true,
      },
      {
        source: "/for-insurance-agencies/",
        destination: "/who-its-for",
        permanent: true,
      },
      {
        source: "/partner-agreement",
        destination: "/partner-service-agreement",
        permanent: true,
      },
      {
        source: "/partner-agreement/",
        destination: "/partner-service-agreement",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
