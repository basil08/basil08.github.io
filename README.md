# basil08.github.io

Personal site built with [Hugo](https://gohugo.io). Deployed to GitHub Pages via Actions.

---

## Mood / Colour theming

The homepage palette changes based on a daily mood value. This is a real-time emotion monitor — the site's colour scheme reflects how I'm feeling that day.

### How it works

At page load, the client-side JS fetches `/mood.json`:

```json
{ "weather": "sunny" }
```

The `weather` value maps to a CSS theme class applied to `<body>`:

| Value | Theme | Palette |
|---|---|---|
| `sunny` | Default green | Warm off-white, forest green |
| `cloudy` | Muted blue-grey | Cool grey, slate |
| `thunderstorm` | Dark mode blue | Near-black, electric blue |
| `hot` | Warm amber | Cream, burnt orange |

Both `spring` and `sunny` resolve to the sunny theme. Both `lightning` and `thunderstorm` resolve to the thunderstorm theme.

### Updating the mood

**Manually (recommended):**

1. Edit `static/mood.json` with one of the valid values above
2. Commit and push to `main`
3. The CI build triggers automatically and redeploys within ~2 minutes

```bash
echo '{ "weather": "cloudy" }' > static/mood.json
git add static/mood.json
git commit -m "mood: cloudy"
git push
```

**Does it need to rebuild every day?**

Only if the mood changes. The file is static — once deployed, `/mood.json` is served as-is until the next build. The GitHub Actions workflow includes a daily scheduled rebuild (`0 0 * * *` UTC) so the deployed file always reflects the latest committed value even without a manual push.

If you want fully automated daily mood changes, update `static/mood.json` in a pre-build step inside the workflow (e.g. a script that writes the JSON based on the current date or an external source), then commit+push or let the scheduled run pick it up.

---

## Local development

```bash
hugo server -D
```

## Build & deploy

Handled automatically by `.github/workflows/gh-pages.yml` on every push to `main` and daily at midnight UTC.
