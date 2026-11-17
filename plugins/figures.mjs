// A Sätteri Markdown plugin that turns captioned images into figures.
//
// In Markdown, an image on its own line with a title (the quoted text):
//
//   ![A beam on two supports](./images/beam.svg "Figure 1. A simply supported beam.")
//
// becomes:
//
//   <figure>
//     <img src="..." alt="A beam on two supports">
//     <figcaption>Figure 1. A simply supported beam.</figcaption>
//   </figure>
//
// It also stops the build if any image has no alt text, the description a
// screen reader reads aloud in place of the image.
//
// This runs on the HTML tree ("hast"), before Astro's own image step, so
// Astro still finds and optimises the <img> inside the <figure>.

/** @type {import("satteri").HastPluginDefinition} */
export const figuresPlugin = {
  name: "figures",
  element: [
    {
      // Every image: require alt text.
      filter: ["img"],
      visit(node, ctx) {
        const alt = node.properties?.alt;
        if (typeof alt !== "string" || alt.trim() === "") {
          const file = ctx.fileURL ? ctx.fileURL.pathname.split("/").pop() : "an article";
          throw new Error(
            `Image "${node.properties?.src}" in ${file} has no alt text. ` +
              `Write a short description inside the brackets: ![description](path)`,
          );
        }
      },
    },
    {
      // A paragraph holding just one image with a title: make it a figure.
      filter: ["p"],
      visit(node, ctx) {
        // Ignore whitespace-only text around the image.
        const children = (node.children ?? []).filter(
          (child) => !(child.type === "text" && child.value.trim() === ""),
        );
        if (children.length !== 1) return;
        const [img] = children;
        if (img.type !== "element" || img.tagName !== "img") return;

        const caption = img.properties?.title;
        if (typeof caption !== "string" || caption.trim() === "") return;

        // The caption moves to <figcaption>, so drop the tooltip title.
        const { title: _title, ...properties } = img.properties;
        ctx.replaceNode(node, {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [
            { ...img, properties },
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: caption }],
            },
          ],
        });
      },
    },
  ],
};
