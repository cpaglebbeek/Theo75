# CLAUDE.md — Theo75

## Project
Statische verjaardagswebsite voor Theo's 75e verjaardag.

## Stack
- Plain HTML5 + CSS3 + vanilla JS (geen build-step, geen framework)
- Inhoud in `content/` als Markdown/JSON → ingelezen door `main.js`
- `@media print` voor A4-print

## Werkwijze
- **Versie-bumps:** elke wijziging minimaal +0.0.1 met codenaam-thema (diamanten/edelstenen)
- **Codenaam-thema:** edelstenen & jubileum-thema's (Diamant, Robijn, Smaragd, Saffier, Topaas, Onyx, Opaal, Amber, Granaat, Citrien, Aquamarijn, ...)
- Gebruiker (Christian) vult inhoud; Claude beheert structuur + styling + JS

## Inhoud-bron (single source of truth)
- `content/tijdlijn.json` — jaar + gebeurtenis
- `content/anekdotes.md` — vrije verhalen (one section per ##)
- `content/quotes.json` — quote + bron + datum
- `assets/photos/` — bestandsnaam-conventie `theo_<jaar>_<slug>.jpg`

## Niet doen
- Geen build-tooling toevoegen (Vite/Webpack/etc) — moet open-en-klaar zijn
- Geen externe CDN-afhankelijkheden zonder reden (privacy + offline-vriendelijk)
- Geen tracking / analytics
