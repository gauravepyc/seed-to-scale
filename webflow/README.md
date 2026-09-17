# Webflow scripts

You build the UI. Scripts only need these attributes.

New to this? Start with [SETUP.md](SETUP.md) — step by step, with the structure for each section.

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
<script src="FEATURED_STRIPS_JS_URL"></script>
<script src="LIBRARY_JS_URL"></script>
```

Upload to **Assets will fail** — Webflow does not accept `.js` files there.

Host the scripts and paste the URLs in Footer custom code. Easiest: GitHub + jsDelivr (repo must be **public**).

```
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/global.js
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/book.js
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/featured.js
https://cdn.jsdelivr.net/gh/gauravepyc/seed-to-scale@main/webflow/featured-strips.js
```

Same pattern for `offset.js`, `button.js`, `cube-image-reveal.js`, `stats.js`.

Three.js must load **before** `book.js`.

`book.js` is a bundle of `book-entry.js` + `book-content.js` + `src/components/Book3D/*`. After editing either, rebuild it:

```
npx esbuild webflow/book-entry.js --bundle --format=iife --alias:three=./webflow/three-shim.js --outfile=webflow/book.js
cp webflow/book.js public/webflow/book.js
```

Lenis off: `ENABLE_LENIS = false` in `global.js`.

## Title outline — `offset.js`

| Element | Attribute | What it is |
|---|---|---|
| Hero section | `data-offset-scope` | Mouse is tracked here |
| Heading | `data-offset-title` | Center of this box = rest position |
| Outline copy of each word | `data-offset-stroke` | Same text as the live word, sits behind it |
| Hero section (optional) | `data-offset-rest="-0.04"` | Rest lift in em. `0` sits dead behind the fill. |
| Hero section (optional) | `data-offset-move="0.035"` | How far the cursor drags it, in em |
| Hero section (optional) | `data-offset-color="#FF3621"` | Outline color |
| Hero section (optional) | `data-offset-width="0.005em"` | Outline thickness |

Defaults match the hero. For a title sitting over the cube mosaic, use `data-offset-rest="0"` and `data-offset-width="0.012em"`.

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

## Library row — `library.js`

Three (or any number of) covers in a row. Outer cards slide in from the sides on scroll, the middle one drops in. Everything else — grid, borders, type, meta pills, the overlay's look — is Designer / CMS.

| Element | Attribute | What it is |
|---|---|---|
| Row | `data-library-row` | Holds the cards. Scroll trigger. |
| Card | `data-library-card` | One card. Link it if the book is ready. |
| Book wrap | `data-library-book` | Wraps the canvas. This is what flies in. Give it a fixed height. |
| Canvas | `data-book` | The cover. Add `data-book-interactive="false"` so it does not open. |
| Overlay (optional) | `data-library-overlay` | Fades in while the card is hovered. Holds the button or "Coming soon". |

**In Webflow**

1. Section: kicker + heading on top, then a Div with `data-library-row`, display flex.
2. Inside the row, one Link block (or Div) per card: `data-library-card`, flex 1, right border.
3. Inside each card, a Div with `data-library-book` — relative, fixed height (~30vw), overflow hidden.
4. Embed a canvas in it: `data-book`, `data-book-variant="harness"`, `data-book-interactive="false"`, `data-book-distance="3.28"`, `data-book-rest="0.04,-0.22,-0.08"`.
5. Optional overlay div inside the card: absolute, covering the book, with the button or a "Coming soon" label. `data-library-overlay`. The script starts it hidden and fades it on hover — no Webflow interaction needed.
6. Title, body, and meta pills below: plain Webflow text or CMS fields.

Use a different `data-book-variant` per card (`harness`, `frontier`, `teams`) so the three covers differ. Cover copy per card follows the same rules as everywhere else: drop a `[data-book-content]` block inside the card and it feeds that card's book only.

`data-book-rest` is the rest tilt in radians, `x,y,z`. The three in the snippet match the live site.

Structure reminder: `snippets/library.html`.

## Featured book — `book.js` + `featured.js`

Copy, images, button, and the right-column background are Designer / CMS. The 3D book is the canvas.

| Element | Attribute | What it is |
|---|---|---|
| Section | `data-featured-scope` | Scroll trigger for the fly-in |
| Section (optional) | `data-book-scroll="1"` | **Don't add this** if you want the book closed until click. Only add it if the book should open on scroll. |
| Stage | `data-featured-stage` | Right column. Relative, overflow hidden, min-height ~42vw, `perspective: 1400px` |
| Strips canvas | `data-featured-strips` | Background bars. Put this canvas in the stage, behind the book. Uses `featured-strips.js`. |
| Overlay (optional) | `data-featured-overlay` | Empty div. Orange wash over the strips |
| Book wrap | `data-featured-book` | GSAP flies this in. Position absolute, fill the stage |
| Canvas | `data-book` | The 3D book |
| Canvas (optional) | `data-book-variant="harness"` | `harness`, `frontier`, or `teams` |
| Canvas (optional) | `data-book-distance="4.2"` | Camera distance |
| Canvas (optional) | `data-book-rest="0,-0.42,0"` | Rest rotation |
| Hint (optional) | `data-book-hint` | “Click to open” label inside the wrap |

**In Webflow**

1. Two-column section. Left: kicker, title, body, author, button — all Webflow text / CMS.
2. Right (`data-featured-stage`): relative, overflow hidden, min-height ~42vw.
3. First child of the stage: Embed `<canvas data-featured-strips></canvas>`. Optional empty div with `data-featured-overlay` on top of it.
4. Then a full-size wrap (`data-featured-book`) with `position: absolute; inset: 0; z-index: 2`.
5. Embed a canvas inside that wrap. Attributes: `data-book`, `data-book-variant="harness"`.
6. Canvas CSS: `width: 100%; height: 100%; display: block`.
7. Put `data-featured-scope` on the section. Leave the book closed until click — do **not** add `data-book-scroll` unless you want auto-open.

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

## Book copy — `data-book-content`

The book used to be sealed: cover title, author, and every page lived in the script. It now reads its copy off the page, so **anything in this table is editable in Webflow or bound to a CMS field**. Leave a field out and the book falls back to the copy in the script — nothing goes blank.

Add the block once per book, anywhere inside the same section as the canvas (or inside `[data-featured-book]`). The script reads it, then sets `display: none` on it, so it never shows.

Set the block to **Display: none** in Designer too — the script still reads it, and that stops the copy flashing before the script runs.

| Element | Attribute | What it is |
|---|---|---|
| Block | `data-book-content` | Wraps all the copy. Hidden automatically. |
| Block (optional) | `data-book-for="frontier"` | Which book it feeds, when a page has more than one |
| Text | `data-book-series` | `THE WORKING KNOWLEDGE` — top line on the cover |
| Text | `data-book-cover-number` | `01` — sits after the series line |
| Text | `data-book-cover-badge` | `V1.0` — the box top-right |
| Text | `data-book-cover-stamp` | Angled stamp, e.g. `IN PROGRESS`. Leave out for none. |
| Text | `data-book-author` | Author / credit line under the title |
| Text | `data-book-cover-title` | Title. One child element per line, or one block with `Harness \| Engineering` |
| Text | `data-book-back-title` | Back cover title |
| Text | `data-book-back-credit` | Back cover credit |
| Block | `data-book-page="intro"` | One page. Repeat the block per page, in reading order. |

### Pages

`data-book-page` takes the layout. Inside the page block:

| Layout | Use | Children |
|---|---|---|
| `intro` | One big centered line | `data-book-kicker`, `data-book-body` |
| `index` | Numbered contents | `data-book-kicker`, one `data-book-item` per line |
| `sections` | Two write-ups per page | `data-book-kicker`, then `data-book-section` blocks holding `data-book-section-number`, `data-book-section-heading`, `data-book-section-body` |
| `article` | Heading + paragraph | `data-book-kicker`, `data-book-heading`, `data-book-body` |

Leave the value off (`data-book-page`) and the layout is picked from what's inside: sections → `sections`, items → `index`, otherwise `article`. Add `data-book-black` to a page for white-on-black.

Paper, not a web page: **two sections or four index items per page**, headings short. Type auto-shrinks to fit, so overlong copy just gets small. The first page sits behind the cover; after that they pair up left / right.

Structure reminder: `snippets/book-content.html`.

### Quick fields on the canvas

For a one-off change, skip the block and put it on `[data-book]`: `data-book-series`, `data-book-author`, `data-book-number`, `data-book-badge`, `data-book-stamp`, `data-book-title="Harness|Engineering"`, `data-book-back-title`, `data-book-back-credit`. These win over the block.

### JSON, if you prefer

```html
<script type="application/json" data-book-json>
  { "author": "TARUN RAHEJA · ACCEL · 21 SEPT 2026",
    "cover": { "number": "01", "badge": "V1.0", "title": ["Harness", "Engineering"] },
    "pages": [{ "layout": "intro", "kicker": "THE FILE", "body": "…" }] }
</script>
```

Same shape as `src/components/Book3D/config.js`. Bad JSON is ignored with a console warning; the book still draws.

Order, lowest wins to highest: script default → `window.site.bookContent` → `[data-book-content]` block → `[data-book-json]` → attributes on the canvas.

### Change it after load

```js
const canvas = document.querySelector("[data-book]");
window.site.books.get(canvas).setContent({
  cover: { title: ["Coming", "Next"], badge: "V2.0" },
  pages: [{ layout: "intro", kicker: "THE FILE", body: "New copy." }],
});
```

The book re-renders in place, keeping the spread it was on. `.content` reads back what it is drawing.

`data-book-variant` still picks the cover art (`harness`, `frontier`, `teams`); cover fields you set apply to whichever variant is on the canvas.

