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
astro.config.mjs     Astro configuration
tsconfig.json        TypeScript settings (Astro's "strict" preset)
public/              Copied to the site as-is (favicon, robots.txt, …)
src/pages/           Each .astro file here becomes a page; index.astro is "/"
```

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
