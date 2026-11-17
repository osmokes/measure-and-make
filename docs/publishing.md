# Publishing an article

The whole process, from an empty file to a live article on
<https://measuremake.uk>. Every command runs in the **VS Code terminal**
(<kbd>Ctrl</kbd>+<kbd>`</kbd>), from the project folder `C:\dev\measure-and-make`.

## The short version

1. Get up to date and make a branch for the article.
2. Create `src/content/articles/<name>.md` with `draft: true`.
3. Write it while watching the preview in `npm run dev`.
4. Remove `draft: true` and run `npm run build` to check it.
5. Commit, merge into `main` and push. Cloudflare publishes it in about a minute.

---

## Step 1: Start from the latest version

```sh
git switch main
git pull
git switch -c article/how-bridges-carry-load
```

- `git pull` fetches anything changed on GitHub, so you don't start from an
  old copy.
- The branch (`article/...`) keeps the unfinished article off the live site
  until you merge it. This is optional: you can write directly on `main`, but
  then every push publishes immediately.

## Step 2: Choose the article's name (its URL)

The **file name becomes the web address**:

| File | Address |
|---|---|
| `how-bridges-carry-load.md` | `https://measuremake.uk/articles/how-bridges-carry-load/` |

Rules:

- **Characters:** use lowercase words with hyphens, no spaces, accents or
  capitals.
- **Length:** keep it short and descriptive.
- **Permanence:** **don't rename it after publishing**, because renaming
  changes the address and breaks links people have shared.

## Step 3: Create the file and its frontmatter

Create `src/content/articles/how-bridges-carry-load.md`. It must start with
this block, called the *frontmatter*:

```markdown
---
title: How bridges carry load
description: Arches push, cables pull and beams bend. A tour of the three ways a bridge gets weight to the ground.
pubDate: 2026-11-20
topic: structures
draft: true
---

The article starts here.
```

| Field | Required? | What it does |
|---|---|---|
| `title` | yes | The headline, also used in lists, search results and link previews |
| `description` | yes | One or two sentences under the title. It's also the text in Google results and link previews, so make it a real summary |
| `pubDate` | yes | `YYYY-MM-DD`. Sets the order (newest first) |
| `topic` | yes | One id from `src/content/topics.yaml`, spelt exactly as listed there (ids are case-sensitive) |
| `draft` | no | `true` shows the article on your dev server only, and it's never published. Keep it while writing |
| `updatedDate` | no | Add it when you revise a published article, and it shows "Updated …" |
| `image` and `imageAlt` | no | Cover image for link previews only. See step 5 |

**To add a new topic**, add it to `src/content/topics.yaml`:

```yaml
electronics:
  name: Electronics
  description: Circuits, sensors and the instruments that measure them.
```

Then restart the dev server (<kbd>Ctrl</kbd>+<kbd>C</kbd>, then `npm run dev`).
The id (`electronics`) becomes the topic's address, `/topics/electronics/`.

## Step 4: Write the article

Plain Markdown, plus a few extras this site supports:

````markdown
## A section heading

Normal paragraphs. **Bold**, *italic*, [a link](https://example.org).

- a list
- of points

> A quotation.

Inline maths like $F = ma$, or a displayed equation:

$$
\sigma = \frac{M y}{I}
$$

```python
print("code blocks get colours automatically")
```

A claim that needs a source.[^gordon]

[^gordon]: J. E. Gordon, *Structures, or Why Things Don't Fall Down*, 1978.
````

Tips:

- **Headings:** use `##` for sections and `###` for subsections. Never use
  `#`, because the title is already the page's main heading. With 3 or more
  `##` sections, a "Contents" box appears automatically.
- **Footnotes:** name them (`[^gordon]`) rather than numbering them. The site
  numbers them for you.
- **Dollar signs:** to write a literal one, type `\$`. Otherwise it starts
  maths.
- **Reading time:** worked out automatically.

## Step 5: Add images and diagrams (optional)

1. Make a folder named after the article:
   `src/content/articles/images/how-bridges-carry-load/`.
2. Put the files in it.
3. Reference them from the article:

```markdown
![An arch bridge with arrows showing the load pushing outwards into the abutments](./images/how-bridges-carry-load/arch.svg "Figure 1. An arch turns weight into sideways thrust.")
```

- **The text in `[ ]` is required alt text.** It's read aloud to people who
  can't see the image. Describe what the image *shows*. Without it, the build
  stops.
- **The quoted text** after the path becomes the caption under the image.
- **Diagrams:** draw them in Excalidraw, draw.io or Inkscape in **black on a
  transparent background**, and export as **SVG**. In dark mode the site
  inverts them automatically.
- **Photos:** use JPG or PNG at any size. Astro shrinks and converts them for
  you.
- **Cover image (optional):** a 1200 × 630 PNG or JPG, never SVG. Add it to the
  frontmatter:

  ```yaml
  image: ./images/how-bridges-carry-load/cover.png
  imageAlt: A stone arch bridge over a river
  ```

## Step 6: Preview as you write

```sh
npm run dev
```

Open <http://localhost:4321/articles/how-bridges-carry-load/>. Every time you
save, the page updates. While `draft: true` is set, the article shows a red
"Draft" label, and it appears in lists on your machine only.

If `npm run dev` says *"Another astro dev server is already running"*, run
`npx astro dev stop` first.

## Step 7: Check it the way Cloudflare will

When the article is finished:

1. **Delete the `draft: true` line.**
2. Stop the dev server (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and run:

   ```sh
   npm run build
   ```

   This is **exactly what Cloudflare runs**. If it passes here, it will pass
   there.
3. Optional: try search and the finished site with:

   ```sh
   npm run preview
   ```

If the build stops, the message tells you which file and what to fix:

| Message | Fix |
|---|---|
| `description: Required` (or another field) | A frontmatter field is missing or misspelt |
| `has topic "structurs", which is not defined…` | Use a topic id from `topics.yaml`, spelt exactly as listed |
| `Image "…" has no alt text` | Add a description inside the `[ ]` |
| `KaTeX parse error` | A mistake in the maths between `$…$`, often a missing `}` |
| `Add imageAlt describing the cover image` | You set `image` without `imageAlt` |
| `the cover image can't be an SVG` | Export the cover as PNG or JPG |

**One thing the build won't catch:** an impossible date like `2026-02-30`
silently becomes 2 March. Glance at the date shown in the preview.

## Step 8: Publish

Save your work to Git, then merge it into `main`:

```sh
git add src/content/articles
git commit -m "Article: How bridges carry load"
git switch main
git merge article/how-bridges-carry-load
git push
git branch -d article/how-bridges-carry-load
```

- `git add src/content/articles` includes the article **and** its images
  folder. If you added a topic, also run `git add src/content/topics.yaml`.
- `git push` is the moment of publishing. Cloudflare sees the new commit on
  `main` and builds and deploys automatically.

**Watch it go live.** In the Cloudflare dashboard, open **Workers & Pages →
measure-and-make → Deployments**. The new deployment appears within seconds
and finishes in a minute or two. Then open
<https://measuremake.uk/articles/how-bridges-carry-load/>.

**To preview on Cloudflare before going live**, push the branch on its own
first with `git push -u origin article/how-bridges-carry-load`. Cloudflare
builds non-`main` branches as previews; check **Deployments** for the preview
link. Then merge as above.

If a deploy fails on Cloudflare, the live site keeps the previous version.
Open the failed deployment, read its log (it shows the same errors as the
table above), fix, commit and push again.

---

## After publishing

| You want to… | Do this |
|---|---|
| **Fix a typo** | Edit the file, then `git add`, `git commit` and `git push`. No date change needed |
| **Revise the content** | Edit it, add `updatedDate: YYYY-MM-DD`, then commit and push. Readers see "Updated …" |
| **Unpublish** | Put `draft: true` back and push. The address then shows the 404 page |
| **Undo a bad deploy fast** | Dashboard → Deployments → pick the previous one → **Rollback**. Then fix the problem in Git |

## Checklist before pushing

- [ ] File name is lowercase-with-hyphens and final
- [ ] `title`, `description`, `pubDate` and `topic` are filled in
- [ ] `draft: true` removed
- [ ] Every image has alt text; diagrams are SVG, black on transparent
- [ ] Date looks right in the preview
- [ ] `npm run build` passes
