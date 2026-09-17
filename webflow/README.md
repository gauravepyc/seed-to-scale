# Webflow scripts

You build the UI. Scripts only need these attributes.

## Load (Footer)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
<script src="GLOBAL_JS_URL"></script>
<script src="OFFSET_JS_URL"></script>
<script src="BUTTON_JS_URL"></script>
<script src="CUBE_JS_URL"></script>
<script src="STATS_JS_URL"></script>
```

Upload `global.js`, `offset.js`, `button.js`, `cube-image-reveal.js`, `stats.js` to Assets. Paste those URLs.

Lenis off: `ENABLE_LENIS = false` in `global.js`.

## Title outline — `offset.js`

| Element | Attribute | What it is |
|---|---|---|
| Hero section | `data-offset-scope` | Mouse is tracked here |
| Heading | `data-offset-title` | Center of this box = rest position |
| Outline copy of each word | `data-offset-stroke` | Same text as the live word, sits behind it |

## Button — `button.js`

| Element | Attribute | What it is |
|---|---|---|
| Link / button | `data-button` | The whole control |
| Empty circle | `data-button-fill` | Grows from the cursor (set fill color in Webflow) |
| Label | `data-button-label` | Text at rest |
| Label duplicate | `data-button-label-hover` | Text that slides in |
| Icon | `data-button-icon` | Icon at rest |
| Icon duplicate | `data-button-icon-hover` | Icon that slides in |
| Button (optional) | `data-button-arrow="down"` | Vertical icon slide |

## Cube mosaic — `cube-image-reveal.js`

| Element | Attribute | What it is |
|---|---|---|
| Section | `data-cube-scope` | Block that holds the mosaic. Set height in Webflow (e.g. 30vw). |
| Canvas | `data-cube-canvas` | Empty canvas. Script sizes it to the section. |

**In Webflow**

1. Section: relative, overflow hidden, height ~30vw.
2. Copy inside the section: centered, `pointer-events: none`, z-index under the canvas.
3. Add a Canvas (or Embed `<canvas>`) as the last child. Give it `data-cube-canvas`.
4. Put `data-cube-scope` on the section.

Hover erases cubes. Click sends a ring. Tune colors / lock edges in `CONFIG` at the top of `cube-image-reveal.js`.

Structure reminder: `snippets/cube-image-reveal.html`.

## Stats reels — `stats.js`

| Element | Attribute | What it is |
|---|---|---|
| Section | `data-stats-scope` | Triggers the spin when it enters the viewport |
| Number | `data-stat="20+"` | Digits become slot reels. `+` and other chars stay as text. |

**In Webflow**

1. Put `data-stats-scope` on the stats section.
2. Add an empty text/div per number. Attribute: `data-stat="3"`, `data-stat="20+"`, `data-stat="4"`.
3. Set font-size, font, and color on each `data-stat`. Leave the node empty — the script builds the 0–9 strips.
4. Labels and two-column layout are Designer-only.

Spins once (`top 78%`). Reuse the same attributes on any later stats block.

Structure reminder: `snippets/stats.html`.
