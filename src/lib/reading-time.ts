// Estimated reading time for an article, from its Markdown source.

/** Typical adult reading speed for non-fiction prose, in words per minute. */
const WORDS_PER_MINUTE = 230;

/**
 * Minutes needed to read some Markdown, rounded up, at least 1.
 *
 * Code blocks and display maths are left out of the count: readers scan them
 * rather than reading word by word, and their "words" (symbols, operators)
 * would inflate the estimate.
 */
export function readingMinutes(markdown: string): number {
  const prose = markdown
    .replace(/^```[\s\S]*?^```/gm, " ") // fenced code blocks
    .replace(/\$\$[\s\S]*?\$\$/g, " ") // display maths
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " "); // images (alt text isn't read inline)

  const words = prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

/** "6 min read" */
export function readingTimeLabel(markdown: string): string {
  return `${readingMinutes(markdown)} min read`;
}
