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
astro.config.mjs     Astro configuration (fonts, HTML whitespace handling)
tsconfig.json        TypeScript settings (Astro's "strict" preset)
public/              Copied to the site as-is (favicon, robots.txt, …)
src/
  consts.ts          Site title and description, used everywhere
  pages/             Each .astro file here becomes a page; index.astro is "/"
  layouts/           Page shells; BaseLayout.astro wraps every page
  components/        Reusable pieces (site header, footer)
  styles/global.css  Design tokens and base typography
```

`src/pages/styleguide.astro` (at `/styleguide`) shows every text element on one
page. Use it to check typography changes by eye. It will be hidden before launch.

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
| `@astrojs/check` (dev) | Type checker behind `npm run check` |
| `typescript` (dev) | Required by the checker. Pinned to 6.x because `@astrojs/check` does not support TypeScript 7 yet |

## Writing articles

_Added in Milestones 3–5 (content collections, maths, code, references, taxonomy)._

## Deployment

_Added in Milestone 9 (Cloudflare)._
