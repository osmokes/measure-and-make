// Astro configuration. See https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // `site` (the public URL) will be set once the domain is decided.
  // Static HTML output is Astro's default, so nothing else is needed for that.

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
});
