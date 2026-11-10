import type { NextConfig } from "next";

const daily = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Cap generated widths: shop photos are stored at <=1600px, so 2048/3840px variants only
    // waste optimizer time and make the fallback <img src> request a huge file.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [64, 96, 128, 256, 384],
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
