import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Ürün fotoğrafları ileride jsDelivr/CDN üzerinden sunulacak (umba ile aynı yaklaşım)
    remotePatterns: [{ protocol: "https", hostname: "cdn.jsdelivr.net" }, { protocol: "https", hostname: "wsrv.nl" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
