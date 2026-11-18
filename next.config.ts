import type { NextConfig } from "next";

/**
 * İki yayın hedefi:
 * - Vercel (varsayılan): sunucu özellikleriyle tam Next.js.
 * - GitHub Pages (GITHUB_PAGES=1): statik dışa aktarım, /yavuzgida alt yolu altında.
 */
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/yavuzgida" : "";

const nextConfig: NextConfig = {
  // Statik dışa aktarımda Cache Components kapalı (yalnızca sunucu hedefinde gerekli)
  cacheComponents: !pages,
  partialPrefetching: !pages,
  ...(pages ? { output: "export", basePath, trailingSlash: true } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: pages,
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
