// robots.txt tells search engine crawlers what they may visit and where the
// sitemap is. It's generated (rather than a file in public/) because the
// sitemap line needs the full site address from astro.config.mjs.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("/sitemap-index.xml", site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
