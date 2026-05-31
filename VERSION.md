# Versies — Theo75

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
