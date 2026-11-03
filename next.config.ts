import type { NextConfig } from 'next';

// Static export for GitHub Pages (set by the deploy workflow). The default
// build keeps targeting Cloudflare Workers. The sub-path (NEXT_PUBLIC_SITE_BASE)
// is applied via Vite's `base` and in components/course-app.tsx, not Next's
// `basePath`: vinext's prerender 404s on every dynamic route when basePath is set.
const nextConfig: NextConfig =
  process.env.GITHUB_PAGES === 'true'
    ? { output: 'export', images: { unoptimized: true } }
    : {};

export default nextConfig;
