// Astro configuration. See https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { katexPlugin } from "./plugins/katex.mjs";
import { figuresPlugin } from "./plugins/figures.mjs";

export default defineConfig({
  // The public URL of the site. Feeds, the sitemap, canonical links and link
  // previews need full addresses, and Astro builds them from this.
  // TODO (M9): replace the placeholder with the real domain when deploying.
  site: "https://example.com",
  // Static HTML output is Astro's default, so nothing else is needed for that.

  integrations: [
    // Generates sitemap-index.xml listing every page, so search engines find
    // them all. The style guide is a test page, so it's left out.
    sitemap({
      filter: (page) => !page.includes("/styleguide/"),
    }),
  ],

  // Whitespace handling. Astro 7's default ("jsx") follows React's rules and
  // deletes line breaks next to tags, so prose wrapped across lines loses
  // spaces ("Here is<a>link</a>"). `true` still minifies the HTML but keeps
  // whitespace that affects rendering, the way normal HTML behaves.
  compressHTML: true,

  // Fonts: Astro downloads these at build time and serves them from our own
  // site, so readers' browsers never contact a third-party font host.
  // https://docs.astro.build/en/guides/fonts/
  fonts: [
    {
      name: "Source Serif 4",
      cssVariable: "--font-serif", // used in src/styles/global.css
      provider: fontProviders.fontsource(),
      weights: ["200 900"], // a variable font: one file covers every weight
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
  ],

  markdown: {
    // Sätteri is Astro 7's built-in Markdown engine; calling satteri() lets
    // us switch on extra syntax and add plugins.
    processor: satteri({
      features: {
        math: true, // parse $inline$ and $$display$$ maths
        gfm: { footnotes: { label: "Notes" } }, // [^1] footnotes
      },
      mdastPlugins: [katexPlugin], // plugins/katex.mjs renders the maths
      hastPlugins: [figuresPlugin], // plugins/figures.mjs: captions, alt text
    }),

    // Code blocks: Shiki colours them at build time (no JavaScript sent to
    // readers). Two themes; global.css switches to the dark one in dark mode.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
