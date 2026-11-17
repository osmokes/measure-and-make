// Content collections: Astro's typed way of loading Markdown.
// https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  // Load every Markdown file in src/content/articles/. Each file's name
  // (without .md) becomes its id, which we use as the URL slug.
  loader: glob({ pattern: "*.md", base: "./src/content/articles" }),

  // The frontmatter every article must have. If a file is missing a field or
  // has the wrong type (e.g. a misspelt date), the build stops with an error
  // naming the file, instead of publishing a broken page.
  schema: z.object({
    title: z.string(),
    /** Standfirst shown under the title, in lists, and in search results. */
    description: z.string(),
    /** Written as 2026-11-17 in frontmatter; converted to a Date. */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Drafts are visible in `npm run dev` but never built. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
