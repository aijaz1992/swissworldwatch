import type { NextConfig } from "next";

const daily = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/schema.prisma"],
  },
  async headers() {
    return [
      { source: "/hero/:path*", headers: daily },
      { source: "/brand/:path*", headers: daily },
      { source: "/payments/:path*", headers: daily },
      { source: "/catalog/:path*", headers: daily },
    ];
  },
};

export default nextConfig;
