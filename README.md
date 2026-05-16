# The Daily Cheer 🌞

**Good news. Funny news. Stories that actually make you smile.**

Live at: [thedailycheer.com](https://www.thedailycheer.com)

---

## What This Is

A static website / daily good-news digest. No framework, no build step, no dependencies. 
Pure HTML + CSS + vanilla JS — loads fast, works everywhere.

## File Structure

```
thedailycheer.com/
├── index.html          # Homepage — hero, story grid, newsletter, quote
├── style.css           # All styles (CSS custom properties, responsive)
├── app.js              # Vanilla JS (counters, filters, mood lifter, etc.)
├── about.html          # About page
├── privacy.html        # Privacy policy
├── favicon.svg         # SVG favicon
├── CNAME               # Custom domain for GitHub Pages
├── .nojekyll           # Tells GitHub Pages to skip Jekyll processing
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploy to GitHub Pages on push to main
```

## Deploy to GitHub Pages

1. Create a new GitHub repo named `thedailycheer.com`
2. Push this folder's contents as the `main` branch
3. In repo Settings → Pages → Source: select **GitHub Actions**
4. Add `CNAME` record in your DNS: `thedailycheer.com → <username>.github.io`
5. Push → GitHub Actions auto-deploys

## Features

- ☀️ Animated hero with live stats counter
- 📰 Story grid with featured + category cards
- 😊 Smile buttons (persisted in localStorage)
- 🎰 "Cheer Me Up" mood lifter modal with fun animal facts
- 💬 Rotating quote of the day
- 🎉 Category filter pills
- 📬 Newsletter signup form (wire up to Mailchimp/ConvertKit/etc.)
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (ARIA labels, keyboard nav, semantic HTML)
- 🚀 No framework, no build step — pure static

## Customization

- **Add stories:** Edit the `.story-card` blocks in `index.html`
- **Newsletter:** Replace the form submission handler in `app.js` with your ESP API call
- **Stats:** Update the target numbers in `initStats()` in `app.js`
- **Ticker:** Edit the `<span>` items inside `#tickerTrack`
- **Mood facts:** Edit the `cheerFacts` array in `app.js`

## License

MIT — do whatever you want with it.
