# basil08.github.io

Personal site built with [Hugo](https://gohugo.io). Deployed to GitHub Pages via Actions.

---

## Mood / Colour theming

The homepage palette changes daily based on a real-time emotion monitor — the site's colour scheme reflects how I'm feeling that day.

### How it works

Every day at midnight UTC, GitHub Actions:
1. Queries the mood API: `GET http://43.205.80.119:4235/api/mood`
2. API returns `{ "mood": "sunny" | "cloudy" | "thunderstorm" | "hot" }`
3. Writes `static/mood.json` as `{ "weather": "<value>" }` before the Hugo build
4. Builds and deploys the site — the updated mood is baked into the static output

At page load, the client-side JS fetches `/mood.json` and applies a CSS theme class to `<body>`.

### Theme reference

| Mood value | Theme | Palette | Effects |
|---|---|---|---|
| `sunny` | Warm green | Off-white, forest green | Lazy grass, flowers, butterflies |
| `cloudy` | Blue-grey | Cool grey, slate | — |
| `thunderstorm` | Dark blue | Near-black, electric blue | Violent grass, rain, lightning |
| `hot` | Amber | Cream, burnt orange | Grass, flies, card glisten |

### Manual override

To change the mood immediately without waiting for the nightly cron:

```bash
echo '{ "weather": "cloudy" }' > static/mood.json
git add static/mood.json
git commit -m "mood: cloudy"
git push
```

The push triggers an immediate CI build that fetches the latest mood from the API, so the manual value in `static/mood.json` is overwritten by whatever the API returns. To force a specific mood regardless of the API, temporarily edit the Fetch mood step in the workflow.

### Fallback

If the mood API is unreachable (timeout > 10s or HTTP error), the build falls back to `"sunny"`.

---

## Local development

```bash
hugo server -D
```

`static/mood.json` is committed with a default value of `"sunny"` and is only overwritten during CI builds.

## Build & deploy

Handled by `.github/workflows/gh-pages.yml`:
- On every push to `main`
- Daily at midnight UTC (fetches mood → builds → deploys)
