---
title: How far does a beam bend?
description: The classic formula for a loaded beam, checked with a few lines of code.
pubDate: 2026-11-16
topic: structures
---

Put a weight in the middle of a plank resting on two bricks and it sags. How much it sags depends on four things: the load $F$, the span $L$, the stiffness of the material $E$, and the shape of the cross-section $I$.

## The formula

For a simply supported beam with a point load at mid-span, the deflection at the centre is[^beam]

$$
\delta = \frac{F L^3}{48 E I}
$$

The cube on $L$ is the surprise: double the span and the beam sags **eight times** as much. For a rectangular section of width $b$ and depth $h$, the second moment of area is $I = \tfrac{b h^3}{12}$, so depth matters far more than width.[^plank]

## Checking it in code

```ts
// Deflection (m) of a simply supported beam with a central point load.
function deflection(F: number, L: number, E: number, I: number): number {
  return (F * L ** 3) / (48 * E * I);
}

const I = (0.1 * 0.02 ** 3) / 12; // 100 mm × 20 mm pine plank, laid flat
console.log(deflection(500, 1.0, 10e9, I)); // ≈ 0.0156 m: about 16 mm
```

Stand the same plank on its edge and $h$ becomes 100 mm. The deflection drops by a factor of 25.

[^beam]: See any mechanics of materials textbook, for example J. M. Gere and B. J. Goodno, *Mechanics of Materials*, 9th ed., Cengage, 2018, Appendix H.
[^plank]: This is why floor joists are installed on edge, never flat.
