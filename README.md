# basil08.github.io

Personal site built with [Hugo](https://gohugo.io) and the
[Bear Neo](https://github.com/rokcso/hugo-bearneo) theme (a Hugo port of
[Bear Blog](https://bearblog.dev), by way of
[hugo-bearblog](https://github.com/janraasch/hugo-bearblog)).
Deployed to GitHub Pages via Actions.

## Layout

Everything under `layouts/` overrides or extends the theme; the theme itself is a
submodule at `themes/hugo-bearneo` and is never edited in place.

| Path | Purpose |
|---|---|
| `layouts/index.html` | Homepage. Plain text, one section after another. Prose is edited here; the *Writing* and *Travel* lists are generated. |
| `layouts/_default/single.html` | Posts and pages: title, date, tags, series links, author card, comments. |
| `layouts/_default/list.html` | Section, tag and series listings (grouped by year, with client-side search). |
| `layouts/partials/custom_head.html` | Theme extension point: analytics, `assets/css/custom.css`, MathJax. |
| `layouts/partials/header.html` | Theme header plus the light/dark switch. |
| `layouts/partials/comments.html` | Dispatches to the configured comment backend (`comments/cusdis.html`, `comments/gitalk.html`). |
| `layouts/partials/upvote.html` | Bear Blog-style page upvote, backed by Kudos. |
| `layouts/shortcodes/` | `dropcap`, `bq`, `blockquote`, `ds`, `toc`, `gist`, `spotify`, `droplets`, `mj/b`, `mj/i`. |
| `assets/css/custom.css` | Shortcode and furniture styling. Uses the theme's own CSS custom properties, so it follows light/dark mode for free. |

If `content/_index.md` exists, its rendered content is placed at the top of the
homepage, above the generated sections.

## Light / dark

Bear Neo follows `prefers-color-scheme` only. A `light | dark` switch in the
header adds an explicit override, stored in `localStorage` and applied to
`<html data-theme="…">` by a tiny inline script that runs before first paint.

Which side reads as active is decided in CSS, not JavaScript, so it is correct
on the first frame. Every palette rule is written three ways in
`assets/css/custom.css`: `:root` for light, `:root[data-theme="dark"]` for an
explicit dark choice, and `@media (prefers-color-scheme: dark)
:root:not([data-theme="light"])` for "follow the OS". Syntax-highlighting rules
follow the same pattern.

## Upvotes

Bear Neo's Bear Blog-style upvote button needs a backend:
[Kudos](https://github.com/puinoib/kudos), a small Cloudflare Workers + D1
service. Deploy it, then set:

```toml
[params]
  upvote = true
  upvoteURL = "https://kudos.your-domain.workers.dev"
```

Until `upvoteURL` is set the button is not rendered at all. If it is set but the
endpoint does not answer, the widget hides itself rather than showing a dead
counter. Individual posts can opt out with `upvote: false` in front matter.

## Table of contents

`toc = true` in `[params]` puts the contents list in the right-hand gutter —
collapsed to a row of dashes, with labels revealed on hover and the current
section highlighted while you scroll. It is hidden below 800px. Front matter
`toc: false` turns it off for one post.

`[markup.tableOfContents]` runs `startLevel = 1` because a number of older posts
use `#` rather than `##` for their section headings; the page title lives in the
template, not the content, so nothing is duplicated.

## Comments

`params.comments.provider` selects the backend:

- **`cusdis`** (default) — a ~5KB embed. Visitors need no account; a nickname is
  enough. Sign up at [cusdis.com](https://cusdis.com) (free tier) or self-host,
  then paste the app id into `params.comments.cusdis.appId`. The widget's theme
  follows the site's light/dark switch.
- **`gitalk`** — comments stored as GitHub issues. Commenters must sign in to
  GitHub.
- **`none`** — no comments.

While `provider = "cusdis"` but `appId` is still empty, the build logs a warning
and falls back to gitalk, so comments never silently vanish from the site.
Individual posts can opt out with `comments: false` in front matter.

### Iframe height

Cusdis builds its iframe with `style="width:100%;border:0"` and **no height**, so
it lands on the HTML default of 150px and scrolls its own content; it also never
posts a resize message, so nothing corrects it. Because the iframe uses `srcdoc`
it is same-origin, so `comments/cusdis.html` measures it directly and syncs the
outer height to the inner body, re-measuring on any DOM change (comments
arriving, a reply form opening, the textarea being dragged, a theme switch
rebuilding the frame). If a future Cusdis moves to a cross-origin `src`, the
measurement bails out and the `min-height` in `assets/css/custom.css` takes over.

## Math

MathJax loads only on pages that use the `mj/b` (display) or `mj/i` (inline)
shortcodes, or that set `math: true` in front matter. `$…$` and `$$…$$` are both
configured as delimiters.

## Mood / colour theming

Not currently wired into the theme. The nightly workflow still refreshes
`static/mood.json` from the mood API so the data keeps flowing; the front end
ignores it for now.

<details>
<summary>How the pipeline works</summary>

Every day at midnight UTC, GitHub Actions:

1. Queries the mood API: `GET http://43.205.80.119:4235/api/mood`
2. The API returns `{ "mood": "sunny" | "cloudy" | "thunderstorm" | "hot" }`
3. Writes `static/mood.json` as `{ "weather": "<value>" }` before the Hugo build
4. Builds and deploys

If the API is unreachable (timeout > 10s or HTTP error), the build falls back to
`"sunny"`.
</details>

## Local development

```bash
git submodule update --init --recursive
hugo server -D
```

## Build & deploy

Handled by `.github/workflows/gh-pages.yml`:

- On every push to `main`
- Daily at midnight UTC
