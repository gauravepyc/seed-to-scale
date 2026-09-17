# Webflow setup — start here

You build the design in Webflow. The scripts find your elements by **custom attributes** and add the motion and the 3D.

Nothing here needs a developer. If you can add a custom attribute and paste an Embed, you can do all of it.

---

## Step 1 — paste the site-wide code

**Site settings → Custom code → Head code:**

```html
<link rel="stylesheet" href="https://seed-to-scale.vercel.app/webflow/global.css">
```

**Site settings → Custom code → Footer code:**

```html
<!-- libraries -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>

<!-- always -->
<script src="https://seed-to-scale.vercel.app/webflow/global.js"></script>

<!-- per effect: keep the ones you use -->
<script src="https://seed-to-scale.vercel.app/webflow/button.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/offset.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/book.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/featured.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/featured-strips.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/library.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/cube-image-reveal.js"></script>
<script src="https://seed-to-scale.vercel.app/webflow/stats.js"></script>
```

**Order matters.** GSAP before everything. Three.js before `book.js`. `global.js` before the rest.

### Every file


| File                   | What it does                                                         | Needs         |
| ---------------------- | -------------------------------------------------------------------- | ------------- |
| `global.css`           | Brand colors, hidden scrollbars, the positioning the scripts rely on | —             |
| `global.js`            | Starts GSAP + Lenis smooth scroll                                    | GSAP, Lenis   |
| `book.js`              | Draws the 3D book on any `[data-book]` canvas                        | Three.js      |
| `featured.js`          | Featured section: the book flies in on scroll                        | GSAP, book.js |
| `featured-strips.js`   | Moving background bars behind the featured book                      | —             |
| `library.js`           | Library row: covers fly in, hover overlay                            | GSAP, book.js |
| `offset.js`            | Orange outline behind a heading that drifts with the cursor          | GSAP          |
| `cube-image-reveal.js` | Pixel mosaic you erase by hovering                                   | —             |
| `button.js`            | Hover fill + label/icon swap on buttons                              | GSAP          |
| `stats.js`             | Numbers that spin up like slot reels                                 | GSAP          |


All files live at `https://seed-to-scale.vercel.app/webflow/<name>`.

> **Cache:** after any script update, add `?v=2` (then `?v=3`…) to that URL so browsers fetch the new one.



### Fonts (optional)

The 3D book pages draw their own type. To use your fonts, add to Head code:

```html
<style>
  :root {
    --font-fragment-glare: "PP Fragment Glare";
    --font-fragment-sans: "PP Fragment Sans";
    --font-avenir: "Avenir";
  }
</style>
```

Use the exact names from your Webflow font uploads. Without this it falls back to Georgia / Arial.

---



## Step 2 — the two things you'll do constantly

**Add a custom attribute:** select the element → **Settings panel (gear icon)** → *Custom attributes* → **+** → type the name → leave the value blank unless the table says otherwise.

**Add an Embed:** press **A** → Components → **Embed** → drag it in → paste → *Save & Close*. Embeds show their raw content on the Designer canvas but scripts don't run there — **always check on the published site**.

---



## Section 1 — Featured book

A two-column section: copy on the left, a 3D book on the right that flies in as you scroll and opens when clicked.

### Structure

```
Section                  ← data-featured-scope
├ Div                    ← left column: kicker, heading, body, author, button
└ Div                    ← data-featured-stage   | min-height 42vw
  ├ Embed                ← <canvas data-featured-strips></canvas>
  ├ Div                  ← data-featured-overlay  (optional orange wash)
  └ Div                  ← data-featured-book
    ├ Embed              ← the book canvas
    └ Text               ← data-book-hint  "Click to open"  (optional)
```



### Attributes


| Element            | Attribute               | Value                                                           |
| ------------------ | ----------------------- | --------------------------------------------------------------- |
| Section            | `data-featured-scope`   | —                                                               |
| Right column       | `data-featured-stage`   | —                                                               |
| Strips canvas      | `data-featured-strips`  | —                                                               |
| Overlay div        | `data-featured-overlay` | —                                                               |
| Book wrapper       | `data-featured-book`    | —                                                               |
| Hint text          | `data-book-hint`        | —                                                               |
| Section (optional) | `data-book-scroll`      | `1` to auto-open on scroll. Leave it off to open on click only. |




### The canvas Embeds

Strips (first child of the stage):

```html
<canvas data-featured-strips></canvas>
```

The book (inside `data-featured-book`):

```html
<canvas data-book data-book-variant="harness"
        data-book-distance="4.2" data-book-rest="0,-0.42,0"></canvas>
```

`data-book-variant` picks the cover art: `harness`, `frontier`, or `teams`.

### Styles


| Element               | Setting                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| `data-featured-stage` | Min height `42vw` — the stylesheet handles position / overflow / perspective |
| Left column           | Your own layout                                                              |


Everything else is positioned by `global.css`.

### Editing the book's copy

Add an Embed **inside the Section** with this. Edit the words; delete any line you don't want to control:

```html
<div data-book-content style="display:none">
  <div data-book-series>THE WORKING KNOWLEDGE</div>
  <div data-book-cover-number>01</div>
  <div data-book-cover-badge>V1.0</div>
  <div data-book-author>TARUN RAHEJA · ACCEL · 21 SEPT 2026</div>
  <div data-book-cover-title>Harness | Engineering</div>
  <div data-book-back-title>The Working Knowledge</div>
  <div data-book-back-credit>TARUN RAHEJA · ACCEL · 21 SEPT 2026</div>

  <div data-book-page="intro">
    <div data-book-kicker>THE FILE</div>
    <div data-book-body>This playbook discusses how to extend frontier model capabilities via Harness Engineering, and how to durably retain your moat.</div>
  </div>

  <div data-book-page="index">
    <div data-book-kicker>INDEX</div>
    <div data-book-item>Benchmarking model capabilities in your domain</div>
    <div data-book-item>Harness engineering to improve frontier performance</div>
    <div data-book-item>Productionizing and scaling up</div>
    <div data-book-item>Retaining moats and staying ahead</div>
  </div>

  <div data-book-page="sections">
    <div data-book-kicker>THE FILE</div>
    <div data-book-section>
      <div data-book-section-number>01</div>
      <div data-book-section-heading>BENCHMARKING MODEL CAPABILITIES IN YOUR DOMAIN</div>
      <div data-book-section-body>Frontier models are superhuman at some tasks, and useless at others - unpredictably.</div>
    </div>
    <div data-book-section>
      <div data-book-section-number>02</div>
      <div data-book-section-heading>HARNESS ENGINEERING TO IMPROVE FRONTIER PERFORMANCE</div>
      <div data-book-section-body>Simple prompts cannot elicit peak capabilities from frontier models.</div>
    </div>
  </div>
</div>
```

**Rules**

- Leave a field out → the book keeps its built-in copy. An empty field never blanks the page.
- `|` in the title splits it into two lines.
- Four page layouts: `intro` (one big centered line), `index` (numbered list), `sections` (two write-ups), `article` (heading + paragraph).
- Page 1 sits behind the cover; the rest pair up as spreads, so keep them in **even numbers after the first**.
- Two `data-book-section` blocks or four `data-book-item` lines per page. More fits, but the type shrinks to make room.
- Keep this Embed **inside the featured Section**.



### Checklist

- [ ] `data-featured-scope` on the Section
- [ ] `data-featured-stage` with a min-height
- [ ] Both canvases pasted as Embeds
- [ ] `data-featured-book` wrapper around the book canvas
- [ ] Published and checked — Designer won't run it

---



## Section 2 — Library row

Three book covers side by side. The outer two slide in from the sides, the middle one drops in. Hovering a card fades in an overlay.

### Structure

```
Section
├ Div                  ← heading block
└ Div                  ← data-library-row     | Display: Flex, horizontal
  ├ Link Block         ← data-library-card    | Flex child: 1, right border
  │ ├ Div              ← data-library-book    | Height 30vw
  │ │ └ Embed          ← the cover canvas
  │ ├ Div              ← data-library-overlay | your button or "COMING SOON!"
  │ └ Div              ← title, body, meta pills
  ├ Link Block         ← card 2 (copy of card 1)
  └ Link Block         ← card 3
```

Build card 1, then copy-paste it twice.

### Attributes


| Element      | Attribute              |
| ------------ | ---------------------- |
| Row          | `data-library-row`     |
| Each card    | `data-library-card`    |
| Book wrapper | `data-library-book`    |
| Overlay      | `data-library-overlay` |




### The three canvas Embeds

```html
<!-- card 1 -->
<canvas data-book data-book-variant="harness" data-book-interactive="false"
        data-book-distance="3.28" data-book-rest="0.04,-0.22,-0.08"></canvas>

<!-- card 2 -->
<canvas data-book data-book-variant="frontier" data-book-interactive="false"
        data-book-distance="3.28" data-book-rest="0.05,0.05,0.02"></canvas>

<!-- card 3 -->
<canvas data-book data-book-variant="teams" data-book-interactive="false"
        data-book-distance="3.28" data-book-rest="0.03,0.2,0.07"></canvas>
```

`data-book-interactive="false"` keeps them as covers — they tilt toward the cursor but never open.

### Styles


| Element             | Setting                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| Row                 | Display flex, horizontal — column on mobile                                   |
| Card                | Flex child `1`, right border on the first two                                 |
| `data-library-book` | **Height 30vw** (70vw on mobile). Without a height nothing renders.           |
| Overlay             | Flex, centered — the stylesheet handles position, the script handles the fade |


Don't build a Webflow hover interaction for the overlay; `library.js` does it.

### Per-card copy

Each card can have its own `[data-book-content]` Embed **inside that card** — same format as the featured section. A card without one uses the built-in copy for its variant.

### Checklist

- [ ] `data-library-row` on the row
- [ ] 3 × `data-library-card`
- [ ] 3 × `data-library-book` **with a height**
- [ ] 3 canvas Embeds with **different** variants
- [ ] Card 1 linked to the book page; cards 2 and 3 can be plain Divs

---



## Section 3 — Hero title outline (`offset.js`)

An orange outline copy of the heading floats just above the text and drifts toward the cursor.

### How it works

Every line needs **two copies** of its text: the visible one, and a twin the script turns into an outline and moves. You supply the twin; the script styles it.

### Structure (no code)

```
Section              ← data-offset-scope
└ Div                ← data-offset-title  | set font, size, line-height, color HERE
  ├ Div              ← line 1   | Width: fit-content, Margin: 0 auto
  │ ├ Text Block     ← data-offset-stroke   "The"
  │ └ Text Block     ← "The"
  ├ Div              ← line 2  ("Working")
  └ Div              ← line 3  ("Knowledge")
```



### Structure (Embed — better for SEO)

```html
<h1 data-offset-title style="font:inherit;color:inherit;margin:0;text-align:center">
  <span style="display:block;width:fit-content;margin:0 auto">
    <span data-offset-stroke>The</span>
    The
  </span>
  <span style="display:block;width:fit-content;margin:0 auto">
    <span data-offset-stroke>Working</span>
    Working
  </span>
  <span style="display:block;width:fit-content;margin:0 auto">
    <span data-offset-stroke>Knowledge</span>
    Knowledge
  </span>
</h1>
```

Put it inside a Div and set the typography on that Div — `font:inherit` makes the heading follow it.

### Attributes


| Element            | Attribute            | Value                                                           |
| ------------------ | -------------------- | --------------------------------------------------------------- |
| Section            | `data-offset-scope`  | —                                                               |
| Heading            | `data-offset-title`  | —                                                               |
| Each duplicate     | `data-offset-stroke` | —                                                               |
| Section (optional) | `data-offset-rest`   | Rest lift in em. Default `-0.04`. `0` hides it behind the text. |
| Section (optional) | `data-offset-move`   | Drift distance in em. Default `0.035`                           |
| Section (optional) | `data-offset-color`  | Default `#FF3621`                                               |
| Section (optional) | `data-offset-width`  | Outline thickness. Default `0.005em`                            |




### Hero styling


| Setting        | Value                   |
| -------------- | ----------------------- |
| Font size      | `7.5vw` (mobile `18vw`) |
| Line height    | `0.82`                  |
| Letter spacing | `-0.03em`               |
| Color          | `#FF3621`               |
| Align          | Center                  |




### Two things that go wrong

1. **Outline sits off to one side** → a line wrapper isn't `width: fit-content`.
2. **Text appears twice in Designer** → normal. Scripts don't run on the canvas; publish and look.

Also: one title per scope. Two animated headings need two `data-offset-scope` elements — a Div works, it doesn't have to be a Section.

---



## Section 4 — Image reveal + outline title

A block of colored pixels you erase by moving the cursor. Click sends an expanding ring. The title sits underneath with the outline effect.

### Structure

```
Section            ← data-cube-scope + data-offset-scope   | Height 30vw
├ Div              ← the copy | Position absolute, inset 0, z-index 0, POINTER EVENTS: NONE
│ ├ Div            ← wraps the title Embed | typography set here
│ │ └ Embed        ← the outline title
│ └ Text           ← body line
└ Embed            ← <canvas data-cube-canvas></canvas>   (last child)
```



### Attributes — all on the Section


| Attribute           | Value     |
| ------------------- | --------- |
| `data-cube-scope`   | —         |
| `data-offset-scope` | —         |
| `data-offset-rest`  | `0`       |
| `data-offset-width` | `0.012em` |


`rest="0"` and the thicker stroke are what make this the cube variant instead of the hero one: the outline hides behind the text until you move.

### The two Embeds

Canvas — last child of the Section:

```html
<canvas data-cube-canvas></canvas>
```

Title:

```html
<p data-offset-title style="font:inherit;color:inherit;margin:0">
  <span style="position:relative;display:inline-block">
    <span data-offset-stroke>The Working Knowledge</span>
    The Working Knowledge
  </span>
</p>
```



### Styles


| Element  | Setting                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Section  | Height `30vw`, margin `5vw` top/bottom, borders all sides, background `#FBF8F3`                          |
| Copy Div | Position absolute, inset 0, z-index 0, flex column centered, text-align center, **Pointer events: none** |
| Title    | 6vw, weight 500, line-height 1, color `#FF3621`                                                          |
| Body     | Margin-top 1.2vw, size 1.5vw, color `#CA5F2B`                                                            |


**Pointer events: none on the copy Div is not optional.** The canvas sits on top and needs every mouse event; if the text can catch the pointer, the reveal stops working wherever the words are.

Don't style the canvas — the script positions and sizes it.

### Behaviour

- Hover erases cubes along the trail. They don't come back; reload resets.
- Click sends a ring that erases outward.
- Edge cubes are randomly locked, which keeps the border ragged.
- Resizing rebuilds the grid and resets it. It pauses when scrolled out of view.
- Touch: drag to reveal, tap for a ring.

---



## Troubleshooting


| What you see                                   | Cause                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Nothing happens at all                         | Scripts are in **Footer** code, not Head. Check for a 404 in the Network tab.                               |
| `[book] Three.js is not loaded`                | Three.js must be **above** `book.js`                                                                        |
| `[…] GSAP is not loaded`                       | GSAP must be above everything                                                                               |
| Book area is blank                             | The wrapper has no height. `data-featured-stage` needs a min-height, `data-library-book` needs a height.    |
| Copy edits don't show                          | The `[data-book-content]` Embed isn't inside the same Section as the canvas — or an attribute is misspelled |
| Outline sits off to one side                   | A line wrapper isn't `width: fit-content`                                                                   |
| Cube doesn't erase under the text              | The copy Div needs **Pointer events: none**                                                                 |
| Old behaviour after an update                  | Bump the `?v=` number on that script URL                                                                    |
| Everything looks doubled or static in Designer | Normal — publish and check the live site                                                                    |


**Rule of thumb:** a misspelled attribute is never an error, it's just ignored. That looks exactly like "the script is broken". Check spelling first.

---



## All attributes at a glance

**Featured** — `data-featured-scope`, `data-featured-stage`, `data-featured-strips`, `data-featured-overlay`, `data-featured-book`, `data-book-hint`, `data-book-scroll`

**Book canvas** — `data-book`, `data-book-variant`, `data-book-interactive`, `data-book-distance`, `data-book-rest`

**Book copy** — `data-book-content`, `data-book-series`, `data-book-cover-number`, `data-book-cover-badge`, `data-book-cover-stamp`, `data-book-cover-title`, `data-book-author`, `data-book-back-title`, `data-book-back-credit`, `data-book-page`, `data-book-kicker`, `data-book-heading`, `data-book-body`, `data-book-item`, `data-book-section`, `data-book-section-number`, `data-book-section-heading`, `data-book-section-body`

**Library** — `data-library-row`, `data-library-card`, `data-library-book`, `data-library-overlay`

**Outline title** — `data-offset-scope`, `data-offset-title`, `data-offset-stroke`, `data-offset-rest`, `data-offset-move`, `data-offset-color`, `data-offset-width`

**Cube** — `data-cube-scope`, `data-cube-canvas`

**Button** — `data-button`, `data-button-fill`, `data-button-label`, `data-button-label-hover`, `data-button-icon`, `data-button-icon-hover`, `data-button-arrow`

**Stats** — `data-stats-scope`, `data-stat`

---

Deeper reference — tuning values, the JSON alternative for book copy, the runtime API: [README.md](README.md).