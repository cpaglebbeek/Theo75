# Versies — Theo75

## v0.2.0-Smaragd (2026-06-01, **LIVE** — verjaardag)
- **12 echte foto's van Theo** in galerij (`content/fotos.json` ingevuld vanuit bugcheck-upload)
- **Lightbox** op `fotos.html` — klik thumbnail → full-screen overlay; ESC + pijltjes + prev/next knoppen
- **Autonome felicitatie-relay** op HC55 (eindigt afhankelijkheid van Mac):
  - WhatsApp Bridge (Go) gecompileerd + gepaird met +31634199292 — service `whatsapp-bridge.service`
  - `theo-poller.service` — polt elke 30s `/var/lib/ouwelul/guestbook.jsonl`, stuurt nieuwe entries via WhatsApp (`/api/send` :8080) + Gmail SMTP (joycekaag → Theo via 587/STARTTLS)
- **Bezoek-tracker** (eenmalige uitzondering op no-tracking regel):
  - `assets/js/tracking.js` — cookie `t75_sid` (1j), events: pageview, click, scroll-25/50/75/100, lightbox-keys, form-submit, visibility, pageleave
  - `theo-tracker.service` (Node :3886) → `/var/lib/ouwelul/tracker.jsonl`
  - `theo-reporter.timer` (per uur) → HTML-rapport naar cglebbeek + tvanscheppingen (sessies + geolocatie + UA + per-pagina events)
  - Transparantie-banner onderaan elke pagina
- Eerste echte felicitatie van **Melek** (buurman) om 23:02 op 31-5

## v0.1.0-Robijn (2026-05-31, **LIVE**)
- **LIVE** op https://horsecloud55.ddns.net/ouwelul/ (en via DNS-forward ouwelul.to)
- Nieuwe **cover-landing**: vol-bleed zwart/wit cover-foto + groot "Theo 75" titel
- **Aftelcounter** naar 2026-05-31T23:00:00+02:00 (dagen/uren/min/sec, tabular nums)
- **Ballonnen-explosie animatie** bij 00:00 — 70 ballonnen in 2 golven + canvas-confetti (180 stuks)
  - preview-modus via `?fire=1` query
- **Gastenboek** ("Feliciteer Theo") — Node-backend op poort 3989 (zero-deps), JSONL storage in `/var/lib/ouwelul/`, rate-limit 1/30s/IP, 500 char max
- **Cadeau-pagina** "alleen voor Theo" — passcode-gated (clientside `ouwelul75`), `localStorage` remembering, gift-cards uit `content/cadeautjes-theo.json`
- nginx: `/ouwelul/` (alias `/opt/ouwelul/`) + `/ouwelul/api/` (proxy → :3989) — beide `auth_basic off`
- systemd: `ouwelul-guestbook.service` op HC55

## v0.0.1-Diamant (2026-05-31)
- Initial skeleton: index/tijdlijn/anekdotes/foto's/quotes pagina's
- `content/` invul-templates (JSON + Markdown)
- Vanilla JS loader voor tijdlijn + quotes
- Basis CSS met print-stylesheet

## Codenaam-thema
Edelstenen & jubileum-thema's: **Diamant**, **Robijn**, Smaragd, Saffier, Topaas, Onyx, Opaal, Amber, Granaat, Citrien, Aquamarijn, Toermalijn, Lapis, Jade, ...
