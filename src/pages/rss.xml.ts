// The RSS feed, at /rss.xml.
//
// A .ts file in pages/ is an "endpoint": instead of HTML from a template, its
// GET function returns any kind of response. At build time Astro calls it
// once and saves the result as dist/rss.xml.
//
// The feed carries the full text of each article, so readers can read in
// their feed app. Format: RSS 2.0 (https://www.rssboard.org/rss-specification)
// with the "content" extension for the full HTML.
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import { getArticles } from "../lib/articles";
import { absolutiseUrls, escapeXml, stripKatexHtml } from "../lib/feed";
import { SITE_TITLE, SITE_DESCRIPTION, LICENCE } from "../consts";

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("Set `site` in astro.config.mjs to build the feed.");

  // getArticles() leaves drafts out of production builds.
  const articles = await getArticles();

  // The Container API renders a component to an HTML string, the same way a
  // page does. We use it rather than `article.rendered.html` because that
  // raw HTML still has placeholders where Astro inserts optimised images.
  const container = await AstroContainer.create();

  const items = await Promise.all(articles.map(async (article) => {
    const url = new URL(`/articles/${article.id}/`, site).href;
    const { Content } = await render(article);
    const html = await container.renderToString(Content);
    const feedHtml = absolutiseUrls(stripKatexHtml(html), site);

    return `
    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${article.data.pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(article.data.description)}</description>
      <content:encoded>${escapeXml(feedHtml)}</content:encoded>
    </item>`;
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${new URL("/", site).href}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-gb</language>
    <copyright>${escapeXml(`${LICENCE.name}: ${LICENCE.url}`)}</copyright>
    <atom:link href="${new URL("/rss.xml", site).href}" rel="self" type="application/rss+xml" />${items.join("")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
