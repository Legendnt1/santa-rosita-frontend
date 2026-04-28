import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Wraps every <Link> click in document.startViewTransition so React's
    // <ViewTransition> component fires enter/exit/share on App Router
    // navigations. Required for the directional + shared-element animations
    // wired up in src/shared/ui/components/DirectionalTransition.tsx.
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    // 30-day Cache-Control max-age applied to /_next/image responses.
    // When the API ships, remote product images served through next/image
    // inherit this TTL — no extra config needed beyond `remotePatterns`.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  /**
   * Long-term caching for static assets in /public/assets.
   *
   * - Applies in `next start` (production). The dev server intentionally
   *   serves `no-store` so HMR works; this header is only emitted in prod.
   * - `must-revalidate` (instead of `immutable`) is deliberate: filenames
   *   are not fingerprinted, so on redeploy the browser must check ETag.
   *   Network round-trip stays minimal (304) but stale assets cannot leak.
   * - The icon sprite is *inlined* in the body via <SpriteSheet/>, so it
   *   never hits this rule — these headers exist for the logo and any
   *   future static images shipped with the build.
   */
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
