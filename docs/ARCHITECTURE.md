# ARCHITECTURE — Theo75

## Conceptueel
- **Doel:** verjaardagscadeau-website voor Theo's 75e — verzameling bijzonderheden (tijdlijn, anekdotes, foto's, quotes).
- **Publiek:** publiek leesbaar (geen auth). Inhoud is persoonlijk maar niet gevoelig.
- **Stijl:** seriferig, rustig, papierachtig — geen banners, geen tracking.

## Logisch
- **Pagina's:** cover, tijdlijn, anekdotes, foto's, quotes.
- **Data-laag:** statische bestanden in `content/`:
  - `tijdlijn.json` → tijdlijn.html
  - `anekdotes.md`  → anekdotes.html (via mini-Markdown in JS)
  - `quotes.json`   → quotes.html
  - `fotos.json`    → fotos.html
- **Asset-laag:** `assets/css/style.css`, `assets/js/main.js`, `assets/photos/`, `assets/img/`.

## Fysiek
- **Geen build-step:** open `index.html` direct, of serveer met een statische server.
- **Hosting (TBD):** kandidaten — `icthorse.nl/theo75/`, HorseCloud55 vhost, GitHub Pages.
- **Lokaal testen (i.v.m. fetch + file://):**
  ```
  cd /Users/christian/Theo75 && python3 -m http.server 8765
  open http://localhost:8765/
  ```

## Functioneel
- Loader (`main.js`) detecteert welke pagina actief is via de aanwezigheid van DOM-anchors (`#timeline-list`, `#anekdotes-body`, `#gallery`, `#quotes-list`).
- Lege content-bestanden → "empty state" placeholder zichtbaar, geen errors.

## Technisch
- Vanilla JS, ES2017+ syntaxis (async/await).
- Geen externe dependencies, geen CDN.
- Print-stylesheet ingebouwd via `@media print`.

## Inhoud-conventies
- **Foto-bestandsnamen:** `theo_<jaar>_<slug>.jpg`, lowercase, geen spaties.
- **Tijdlijn-jaartal:** getal indien exact, string ("ca. 1968") indien onzeker.
- **Anekdotes:** per anekdote één `##`-kop; mini-Markdown ondersteunt `#`, `##`, paragrafen, `**vet**`, `*cursief*`.

## Niet-doelen
- Geen comment-systeem, geen formulieren, geen server-side.
- Geen i18n (Nederlandstalig).
- Geen analytics.

## Versie-protocol
- Elke wijziging: minimaal +0.0.1 in `VERSION.md` + footer-versie in HTML-pagina's.
- Codenaam uit edelstenen-thema (Diamant, Robijn, Smaragd, …).
