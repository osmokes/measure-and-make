// Helpers for building the RSS feed (src/pages/rss.xml.ts).

/**
 * Escape text for XML. Any `&`, `<`, `>` or quote in a title or article would
 * otherwise break the feed, because XML gives those characters meaning.
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;") // first, so we don't re-escape the others
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Turn site-relative links (`href="/articles/x/"`) into full addresses.
 * A feed reader shows the article outside our site, where "/articles/x/"
 * would point to the reader app's own domain.
 */
export function absolutiseUrls(html: string, site: URL): string {
  return html.replace(
    /\b(href|src)="\/(?!\/)/g, // "/..." but not protocol-relative "//..."
    (_match, attribute) => `${attribute}="${new URL("/", site)}`,
  );
}

/**
 * KaTeX writes each equation twice: as MathML (<math>, drawn natively by
 * browsers and many feed readers) and as styled <span>s that only look right
 * with KaTeX's CSS. Feed readers don't load our CSS, so remove the styled copy
 * (<span class="katex-html">) and keep the MathML.
 *
 * The span contains nested spans, so we can't just search for "</span>":
 * we count opening and closing tags until we're back at depth zero.
 */
export function stripKatexHtml(html: string): string {
  const startTag = '<span class="katex-html"';
  let result = "";
  let position = 0;

  while (true) {
    const start = html.indexOf(startTag, position);
    if (start === -1) break;
    result += html.slice(position, start);

    // Walk forward through <span ...> and </span> tags, tracking depth.
    const tag = /<span\b|<\/span>/g;
    tag.lastIndex = start;
    let depth = 0;
    let match: RegExpExecArray | null;
    while ((match = tag.exec(html))) {
      depth += match[0] === "</span>" ? -1 : 1;
      if (depth === 0) break;
    }
    if (!match) throw new Error("stripKatexHtml: unbalanced <span> tags");
    position = tag.lastIndex; // just after the matching </span>
  }

  return result + html.slice(position);
}
