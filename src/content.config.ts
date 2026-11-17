// Content collections: Astro's typed way of loading Markdown and data files.
// https://docs.astro.build/en/guides/content-collections/
import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const topics = defineCollection({
  // Every top-level key in topics.yaml becomes one entry, with that key as
  // its id (e.g. "structures").
  loader: file("./src/content/topics.yaml"),
  schema: z.object({
    name: z.string(),
    /** One line shown on the topics page and the topic's own page. */
    description: z.string(),
  }),
});

const articles = defineCollection({
  // Load every Markdown file in src/content/articles/. Each file's name
  // (without .md) becomes its id, which we use as the URL slug.
  loader: glob({ pattern: "*.md", base: "./src/content/articles" }),

  // The frontmatter every article must have. If a file is missing a field or
  // has the wrong type (e.g. a misspelt date), the build stops with an error
  // naming the file, instead of publishing a broken page.
  //
  // The schema is a function here so Astro can hand us `image()`, which
  // checks that an image path exists and loads it for optimisation.
  schema: ({ image }) => z.object({
    title: z.string(),
    /** Standfirst shown under the title, in lists, and in search results. */
    description: z.string(),
    /** Written as 2026-11-17 in frontmatter; converted to a Date. */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** The id of one topic from topics.yaml, e.g. `topic: structures`. */
    topic: reference("topics"),
    /** Drafts are visible in `npm run dev` but never built. */
    draft: z.boolean().default(false),
    /**
     * Optional cover image, used only for link previews (Slack, Mastodon...).
     * Path relative to the article, e.g. ./images/my-article/cover.png.
     * Best at 1200 × 630. Link previews can't show SVG, so use JPG/PNG/WebP
     * (ArticleLayout.astro stops the build with a clear message for SVG).
     */
    image: image().optional(),
    /** Describes the cover image for people who can't see it. */
    imageAlt: z.string().optional(),
  })
    // If there's a cover image, its description is required too.
    .refine((data) => !data.image || data.imageAlt, {
      message: "Add `imageAlt` describing the cover image.",
      path: ["imageAlt"],
    }),
});

export const collections = { topics, articles };
