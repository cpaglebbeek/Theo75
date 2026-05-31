---
date: 2026-05-31
repo: Theo75
status: done
resume: ""
---

# Sessie — newp Theo75 v0.0.1-Diamant (skeleton-aanmaak)

## Prompt
> newp "theo 75". website met bijzonderheden. Theo 75.

Gevolgd door verduidelijking van gebruiker:
> aparte repo, publiek, statisch, ik vul inhoud later

## Begrip (functioneel + technisch)
- **Doel:** statische verjaardags-website ter ere van Theo's 75e verjaardag, met "bijzonderheden" (tijdlijn, anekdotes, foto's, quotes).
- **Scope:** skeleton + invul-templates; eigenaar (Christian) vult de feitelijke inhoud later.
- **Niet de scope:** geen back-end, geen formulieren, geen tracking, geen i18n, geen build-step.
- **Relatie tot bestaand dossier `VriendschapTheo`:** bewust losgekoppeld — `VriendschapTheo` is privé/git-crypt, `Theo75` is publiek.

## Beslissingen (WhatIf)

| # | Punt | Keuze |
|---|------|-------|
| 1 | Repo-scope | Aparte repo `Theo75` |
| 2 | Zichtbaarheid | PUBLIC |
| 3 | Stack | Vanilla HTML/CSS/JS, geen build-step |
| 4 | Inhoud | Skeleton + content-templates (`content/*.json`, `content/anekdotes.md`) |
| 5 | Codenaam-thema | Edelstenen (Diamant, Robijn, Smaragd, …) |
| 6 | Versie | v0.0.1-Diamant |
| 7 | Licentie | MIT (code), All Rights Reserved (persoonlijke inhoud) |
| 8 | Hosting | TBD (icthorse.nl/theo75/, HorseCloud55, of GitHub Pages) |

## Acties
1. Repo-skeleton aangemaakt onder `/Users/christian/Theo75`:
   - 5 HTML-pagina's: `index.html`, `tijdlijn.html`, `anekdotes.html`, `fotos.html`, `quotes.html`
   - `assets/css/style.css` (incl. `@media print`)
   - `assets/js/main.js` (vanilla loader voor JSON + mini-Markdown)
   - `content/tijdlijn.json`, `content/anekdotes.md`, `content/quotes.json`, `content/fotos.json` (placeholders)
   - `docs/ARCHITECTURE.md` (conceptueel/logisch/fysiek/functioneel/technisch)
   - `CLAUDE.md`, `VERSION.md`, `README.md`, `LICENSE`, `.gitignore`
2. `git init`, eerste commit `chore: initial skeleton v0.0.1-Diamant`.
3. GitHub PUBLIC repo `cpaglebbeek/Theo75` aangemaakt + `git push origin main`.
4. Meta_Master sync:
   - `PROJECTS.json` — nieuw ecosystem `Theo75`
   - `ECOSYSTEMS.md` — sectie Theo75 + cross-ref vanaf VriendschapTheo
   - `STATUS.md` — sessie-blok bovenaan
5. Claude memory: `project_theo75.md` + `MEMORY.md` index-entry.

## Openstaand
- **Inhoud vullen:** door eigenaar (Christian) op eigen tempo.
- **Hosting-keuze:** beslissen wanneer inhoud begint te vorderen.
- **Codenaam-cyclus:** volgende bump v0.0.2-Robijn, etc.

## Lessen / patronen
- Voor "verjaardags-cadeau-site"-archetype is vanilla HTML/JS met JSON-content-laag genoeg — geen framework nodig.
- Mini-Markdown in 30 regels JS dekt 95% van wat een persoonlijke site nodig heeft (paragrafen, koppen, vet, cursief).
- Bewuste loskoppeling van privé-dossier (`VriendschapTheo`) en publieke site voorkomt onbedoelde lekken van encrypted content.
