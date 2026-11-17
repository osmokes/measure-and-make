---
title: Measure twice, cut once
description: Why the oldest rule in the workshop is really a rule about where errors are cheap to fix.
pubDate: 2026-11-10
---

Every carpenter learns the rule before they learn to sharpen a chisel: **measure twice, cut once**. It sounds like advice about care. It is really advice about cost.

## Errors have a price that rises over time

A wrong measurement costs nothing while it is still a number on a pencil line. Once the saw has gone through the board, the same mistake costs a board. Built into a cabinet, it costs a cabinet.

Software works the same way:

1. A wrong assumption caught while reading the requirements costs a conversation.
2. Caught in review, it costs an afternoon.
3. Caught in production, it costs a weekend and an apology.

## Checking where checking is cheap

The second measurement is not paranoia. It moves the check to the point where fixing the error is still cheap. Type checkers, schemas and tests are second measurements: they catch the mistake while it is still a pencil line.

> The best time to find a mistake is before anything depends on it.

This site follows the rule too. Every article's frontmatter is checked against a schema at build time, so a missing date stops the build instead of publishing a broken page.
