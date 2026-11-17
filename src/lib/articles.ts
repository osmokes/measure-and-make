import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles">;

/**
 * All articles that should appear on the site, newest first.
 *
 * Drafts are included in development (`npm run dev`) so you can preview them,
 * and excluded from production builds (`npm run build`). Every page that lists
 * or generates articles should use this, so the rule lives in one place.
 */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection(
    "articles",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return articles.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}
