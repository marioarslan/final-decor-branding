# Final Decor — Brand & Website

A static, bilingual (EN / AR) website and brand identity system for **Final Decor**,
a residential interior design studio in Aleppo, Syria.

The design copies the "Resident" editorial identity (black ink on paper white,
hairline rules, 0px radius, photography-led) with two changes: a single warm
accent — **Terracotta `#B1542E`** (`--accent` in `style.css`), used at ~10% on
eyebrows, section numbers, arrows, link hovers, active filters and text selection
(never as a fill); and the type —
**Europa Grotesk SH** is the display typeface, **Inter** carries Latin body text
(a substitute for MessinaSans), and **IBM Plex Sans Arabic** carries the Arabic layer.

## Pages
| File | Purpose |
|------|---------|
| `brand.html` | Brand identity presentation / guidelines (deliverable 1) |
| `index.html` | Home |
| `projects.html` | Portfolio grid — filterable, click-to-lightbox |
| `services.html` | Services + process |
| `about.html` | Studio story + values |
| `contact.html` | Contact form (→ WhatsApp or email) + details |

## Run locally
```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000/brand.html  and  /index.html
```
No build step — plain HTML/CSS/JS.

## Language
Every translatable node carries `data-en` / `data-ar` (and `data-*-ph` for
placeholders). `assets/js/main.js` swaps text, sets `dir="rtl"` for Arabic, and
remembers the choice in `localStorage`. Toggle with the `EN / ع` control in the nav.

## ⚠️ Placeholders to confirm/replace
- **Instagram:** `@final_decor_` (`instagram.com/final_decor_`) — confirmed.
- **Phone / WhatsApp:** `+963 940 443 044` — confirmed. Lives in `contact.html`
  as `data-whatsapp="963940443044"` and in every footer.
- **Email:** intentionally omitted for now — the contact form sends via WhatsApp
  only. When you have an address, tell me and I'll add it back (footer + a form
  send-via toggle).
- **Metrics** (`10+ years`, `120+ homes`) and **project names** (Aleppo
  neighbourhoods) are still illustrative — adjust to real figures/names.

## Assets
- `assets/logo/` — official SVG lockup + extracted icon mark & wordmark, in ink and white.
- `assets/img/` — 27 curated project photos, each as a full web image + `-t.jpg` grid thumb.
- `assets/fonts/` — Europa Grotesk SH (Medium/Bold), OTF + WOFF2.
