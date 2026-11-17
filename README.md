# Measure and Make

An independent engineering publication. A static website built with
[Astro](https://astro.build) and TypeScript, with articles written in Markdown
and hosted on Cloudflare.

## Prerequisites

| Tool | Version | Install (Windows) |
|---|---|---|
| Node.js (includes npm) | Current LTS (26.x) | `winget install OpenJS.NodeJS.LTS` |
| Git | 2.x | `winget install Git.Git` |
| GitHub CLI (optional) | 2.x | `winget install GitHub.cli` |
| VS Code + Astro extension | — | `code --install-extension astro-build.astro-vscode` |

The package manager is **npm**. Use npm for all commands; don't mix it with pnpm or yarn.

> Keep the project outside OneDrive or Dropbox folders. Sync clients struggle
> with the many small files in `node_modules`.

## Installation

```sh
git clone https://github.com/<your-username>/measure-and-make.git
cd measure-and-make
npm install
```

## Development

| Command | What it does |
|---|---|
| `npm run dev` | Start a local server at <http://localhost:4321> that reloads on save |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run build` | Type-check, then build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally, as visitors would see it |

Stop the dev server with <kbd>Ctrl</kbd>+<kbd>C</kbd>.

### Project structure

```text
astro.config.mjs     Astro configuration (fonts, whitespace, Markdown features)
tsconfig.json        TypeScript settings (Astro's "strict" preset)
plugins/katex.mjs    Markdown plugin that renders maths with KaTeX
public/              Copied to the site as-is (favicon, robots.txt, …)
src/
  consts.ts          Site title and description, used everywhere
  content.config.ts  Content collections and their frontmatter schemas
  content/articles/  Articles, one Markdown file each
  content/topics.yaml  The list of topics
  lib/               Shared TypeScript helpers (articles, topics, feed)
  pages/             Each .astro file here becomes a page; index.astro is "/"
  layouts/           Page shells; BaseLayout.astro wraps every page
  components/        Reusable pieces (site header, footer)
  styles/global.css  Design tokens and base typography
```

`src/pages/styleguide.astro` (at `/styleguide`) shows every text element on one
page. Use it to check typography changes by eye. It is marked `noindex` and left
out of the sitemap, so search engines ignore it.

### Design system

All styling is plain CSS. The values live as custom properties ("design tokens")
at the top of `src/styles/global.css`:

- **Colours:** paper-white background, near-black text and an oxblood accent
  (`--color-accent`). Dark mode redefines the same tokens inside
  `@media (prefers-color-scheme: dark)`, so it follows the reader's OS setting
  with no JavaScript. Every text/background pair passes WCAG AA contrast.
- **Fonts:** article text uses **Source Serif 4**, set up in `astro.config.mjs`
  through Astro's built-in Fonts API. Astro downloads it at build time and
  serves it from this site. UI text uses the system sans-serif and code uses
  the system monospace (`--font-ui`, `--font-mono`).
- **Sizes:** body text scales fluidly from 18px to 20px, and the reading width
  is capped at about 68 characters (`--measure`).

Component-specific styles go in a `<style>` block inside the `.astro` file.
Astro scopes these so they only affect that component.

> **Whitespace:** `compressHTML: true` is set in `astro.config.mjs`. Astro 7's
> default follows React's whitespace rules and would delete the space at a line
> break next to a tag, so `Here is⏎<a>a link</a>` would render as "Here isa link".

### Dependencies

| Package | Why |
|---|---|
| `astro` | The site framework and build tool |
| `@astrojs/markdown-satteri` | Astro 7's Markdown engine (Sätteri). Already part of Astro; listed because `astro.config.mjs` imports it to turn on maths and add plugins |
| `katex` | Renders LaTeX maths to HTML at build time (see `plugins/katex.mjs`) |
| `@astrojs/sitemap` | Generates the sitemap from every built page |
| `@astrojs/check` (dev) | Type checker behind `npm run check` |
| `typescript` (dev) | Required by the checker. Pinned to 6.x because `@astrojs/check` does not support TypeScript 7 yet |

## Writing articles

Articles are Markdown files in `src/content/articles/`. The file name becomes
the URL, so `how-bridges-carry-load.md` is published at
`/articles/how-bridges-carry-load/`. Use lowercase words separated by hyphens,
and keep all articles directly in that folder (no subfolders).

Each file starts with frontmatter:

```markdown
---
title: How bridges carry load
description: One or two sentences shown under the title, in lists and in search results.
pubDate: 2026-11-17
topic: structures         # one id from src/content/topics.yaml
updatedDate: 2026-12-01   # optional
draft: true               # optional; remove it to publish
---

The article text starts here, in ordinary Markdown.
```

- **Schema:** the fields are defined in `src/content.config.ts`. A missing or
  wrongly typed field stops `npm run build` with an error naming the file.
- **Drafts:** `draft: true` articles appear in `npm run dev` with a "Draft"
  label and are left out of `npm run build`, so they are never published.
- **Dates:** write them as `YYYY-MM-DD`. They are shown as "17 November 2026".
  An impossible date such as `2026-02-30` is **not** rejected: the YAML parser
  rolls it over to 2 March. Check the date shown in the dev server.
- **New collections:** after creating `src/content.config.ts` or adding a
  collection, restart `npm run dev`.

### Maths

Write LaTeX between dollar signs. `$E = mc^2$` is inline, and a block on its
own lines is displayed centred:

```markdown
$$
\delta = \frac{F L^3}{48 E I}
$$
```

- **Rendering:** equations are rendered by KaTeX at build time
  (`plugins/katex.mjs`), so readers get HTML, not JavaScript.
- **Stylesheet:** KaTeX's stylesheet and fonts load only on articles that
  contain maths.
- **Mistakes:** a LaTeX mistake stops the build with a "KaTeX parse error"
  naming the file.
- **Dollar signs:** to write a literal dollar sign, escape it as `\$`.

### Code

Use fenced code blocks with a language name:

````markdown
```ts
const answer = 42;
```
````

Shiki colours them at build time with the `github-light` and `github-dark`
themes (set in `astro.config.mjs`), following the reader's dark mode. Long
lines scroll sideways inside the block.

### Footnotes and references

Use Markdown footnotes. The marker goes in the text, and the note can go
anywhere in the file (conventionally at the end):

```markdown
The deflection follows the standard formula.[^gere]

[^gere]: J. M. Gere and B. J. Goodno, *Mechanics of Materials*, 9th ed., 2018.
```

- **Numbering:** notes are numbered in order of first use and collected under
  "Notes" at the end of the article, with ↩ links back to the text.
- **Names:** use names like `[^gere]` rather than numbers, so notes can be
  reordered freely.

### Topics

Every article belongs to exactly one topic, named by its id in the
frontmatter (`topic: structures`). The topics are defined in
`src/content/topics.yaml`:

```yaml
structures:
  name: Structures
  description: Beams, bridges and buildings, and the loads they carry.
```

- **Adding a topic:** add an entry to `topics.yaml`, then restart
  `npm run dev`.
- **Renaming:** `name` and `description` can change at any time. The id
  (`structures`) is the URL (`/topics/structures/`), so avoid changing it once
  articles are published.
- **Typos:** an article naming a topic that isn't in `topics.yaml` stops the
  build with an error listing the valid ids.
- **Empty topics:** a topic gets a page and appears on `/topics/` only once it
  has a published article.

### How pages are generated

- `src/lib/articles.ts` has `getArticles()`, the one place that hides drafts
  and sorts newest first.
- `src/pages/articles/[slug].astro` makes one page per article. `[slug]` is
  filled in from each file name by `getStaticPaths()`.
- `src/pages/articles/index.astro` is the full archive. The home page shows the
  latest five.
- `src/lib/topics.ts` groups articles by topic. `topicOf()` looks up an
  article's topic and throws on an unknown id, because Astro itself only logs
  a broken reference and carries on building.
- `src/pages/topics/index.astro` lists topics. `src/pages/topics/[topic].astro`
  makes one page per topic.

## Site pages, feeds and search engines

| Address | Source | What it is |
|---|---|---|
| `/about/` | `src/pages/about.astro` | About the publication and the licence |
| `/404.html` | `src/pages/404.astro` | Shown for any unknown address (Cloudflare serves it automatically) |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS feed with the full text of every published article |
| `/sitemap-index.xml` | `@astrojs/sitemap` | Every page, for search engines |
| `/robots.txt` | `src/pages/robots.txt.ts` | Points crawlers at the sitemap |

- **Endpoints:** `.ts` files in `src/pages/` are *endpoints*. They return any
  kind of file (here XML or text) instead of an HTML page.
- **The feed:** `src/lib/feed.ts` holds the feed's helpers. They escape text
  for XML, make site-relative links absolute, and drop KaTeX's styled copy of
  each equation, which needs our CSS. That leaves the MathML copy, which feed
  readers can draw themselves.
- **Link previews:** `BaseLayout.astro` adds a canonical URL and Open Graph
  tags (title, description, type, URL). That's what Slack, Mastodon and
  similar apps show when someone shares a link. Articles also carry their
  publication date and topic.
- **Hiding a page:** pass `noindex` to `BaseLayout` to ask search engines not
  to list a page (used by `/404` and `/styleguide`).

> **Placeholder domain:** `site` in `astro.config.mjs` is `https://example.com`
> until deployment (Milestone 9). Every full URL in the feed, sitemap,
> robots.txt and link previews comes from it, so changing that one line updates
> them all.

### Licence

Articles are published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
The licence name and link live in `src/consts.ts` (`LICENCE`) and appear in
the footer, the About page and the RSS feed.

## Deployment

_Added in Milestone 9 (Cloudflare)._
