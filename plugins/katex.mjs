// A Sätteri Markdown plugin that renders maths with KaTeX at build time.
//
// Sätteri (Astro 7's Markdown engine) parses `$...$` (inline) and `$$...$$`
// (display) into `inlineMath` and `math` nodes when `features.math` is on.
// This plugin swaps each node for KaTeX's HTML, so readers' browsers only
// need the KaTeX stylesheet, never any JavaScript.
//
// It also sets `hasMath` on the article's frontmatter data, which the article
// page reads (as `remarkPluginFrontmatter`) to load that stylesheet only on
// articles that actually contain maths.
import katex from "katex";

/**
 * @param {string} tex  The LaTeX source between the dollar signs.
 * @param {boolean} displayMode  true for $$...$$ (own line, centred).
 */
function render(tex, displayMode) {
  return katex.renderToString(tex, {
    displayMode,
    // A LaTeX mistake stops the build with a clear message, instead of
    // publishing red error text in the middle of an article.
    throwOnError: true,
    output: "htmlAndMathml", // MathML copy is read by screen readers
  });
}

/** @param {import("satteri").MdastVisitorContext} ctx */
function markHasMath(ctx) {
  const frontmatter = ctx.data.astro?.frontmatter;
  if (frontmatter) frontmatter.hasMath = true;
}

/** @type {import("satteri").MdastPluginDefinition} */
export const katexPlugin = {
  name: "katex",
  math(node, ctx) {
    markHasMath(ctx);
    // mdxExpressions: false keeps KaTeX's { } from being read as code.
    return { raw: render(node.value, true), mdxExpressions: false };
  },
  inlineMath(node, ctx) {
    markHasMath(ctx);
    return { raw: render(node.value, false), mdxExpressions: false };
  },
};
