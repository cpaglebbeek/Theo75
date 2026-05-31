# Theo 75

Statische website rond Theo's 75e verjaardag — een verzameling **bijzonderheden**: tijdlijn, anekdotes, foto's, quotes.

## Status
- **Versie:** v0.0.1-Diamant
- **Type:** Statische site (HTML + CSS + JS, geen build-step)
- **Zichtbaarheid:** Publiek
- **Hosting:** TBD (kandidaten: icthorse.nl/theo75/, HorseCloud55, GitHub Pages)

## Structuur

```
Theo75/
├── index.html              ← cover / landing
├── tijdlijn.html           ← chronologische bijzonderheden
├── anekdotes.html          ← verhalen
├── fotos.html              ← foto-galerij
├── quotes.html             ← citaten / gastenboek (statisch)
├── content/                ← invul-templates (Markdown/JSON), bron-van-waarheid
│   ├── tijdlijn.json
│   ├── anekdotes.md
│   └── quotes.json
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── img/                ← UI-iconen, decoratie
│   └── photos/             ← persoonsfoto's (vul later)
└── docs/
    └── ARCHITECTURE.md
```

## Workflow voor inhoud invullen

1. Bewerk de bron-bestanden in `content/` (Markdown of JSON).
2. Eventuele foto's: drop in `assets/photos/`, hernoem `theo_<jaar>_<kort>.jpg`.
3. Open `index.html` lokaal in browser → controleer.
4. Commit + push.

## Print-versie

`@media print` in `style.css` levert een schone A4-versie via browser → Print.

## Licentie

Code: MIT (zie `LICENSE`).
Inhoud (teksten, foto's): **All rights reserved** — persoonlijk materiaal, niet voor hergebruik.
