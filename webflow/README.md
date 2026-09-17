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
<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
<script src="BOOK_JS_URL"></script>
<script src="FEATURED_JS_URL"></script>
```

Upload to **Assets will fail** — Webflow does not accept `.js` files there.

Host the scripts and paste the URLs in Footer custom code. Easiest: GitHub + jsDelivr (repo must be **public**).

```
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/global.js
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/book.js
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/featured.js
```

Same pattern for `offset.js`, `button.js`, `cube-image-reveal.js`, `stats.js`.

Three.js must load **before** `book.js`.

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

## Featured book — `book.js` + `featured.js`

Copy, images, button, and the right-column background are Designer / CMS. The 3D book is the canvas.

| Element | Attribute | What it is |
|---|---|---|
| Section | `data-featured-scope` | Scroll trigger for the fly-in |
| Section (optional) | `data-book-scroll="1"` | Opens the book to page `1` while in view, closes when you leave. Use `"open"` for the first spread. |
| Stage | `data-featured-stage` | Right column. Set height, overflow hidden, background image/color, `perspective: 1400px` |
| Book wrap | `data-featured-book` | GSAP flies this in. Position absolute, fill the stage |
| Canvas | `data-book` | The 3D book |
| Canvas (optional) | `data-book-variant="harness"` | `harness`, `frontier`, or `teams` |
| Canvas (optional) | `data-book-distance="4.2"` | Camera distance |
| Canvas (optional) | `data-book-rest="0,-0.42,0"` | Rest rotation |
| Hint (optional) | `data-book-hint` | “Click to open” label inside the wrap |

**In Webflow**

1. Two-column section. Left: kicker, title, body, author, button — all Webflow text / CMS.
2. Right (`data-featured-stage`): relative, overflow hidden, min-height ~42vw, background image if you want strips.
3. Inside the stage, a full-size wrap (`data-featured-book`) with `position: absolute; inset: 0`.
4. Embed a canvas inside that wrap. Attributes: `data-book`, `data-book-variant="harness"`.
5. Canvas CSS: `width: 100%; height: 100%; display: block`.
6. Put `data-featured-scope` on the section. Add `data-book-scroll="1"` if the book should open on scroll.

Click still turns pages. Scroll uses the same open / close as click.

**Target the book yourself**

```js
const canvas = document.querySelector("[data-book]");
const book = window.site.books.get(canvas);
book.open();     // first spread
book.open(2);    // a later page
book.close();    // cover
book.setPage(n);
```

Or tween `[data-featured-book]` with GSAP — that wrapper is what the fly-in already animates.

Fonts: set `--font-fragment-glare`, `--font-fragment-sans`, `--font-avenir` on `:root` if those faces are loaded. Otherwise it falls back to Georgia / Arial.

Structure reminder: `snippets/featured.html`.
