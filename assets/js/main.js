// Theo75 — vanilla JS content loader
// Inhoud staat in content/*.json en content/*.md.
// Geen build-step; gewoon openen in browser (of via een lokale static server
// als de browser file:// + fetch blokkeert).

(async function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (_) {
      return null;
    }
  }

  async function loadText(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.text();
    } catch (_) {
      return null;
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  // -- Tijdlijn ----------------------------------------------------------
  async function renderTimeline() {
    const list = $("#timeline-list");
    if (!list) return;
    const data = await loadJSON("content/tijdlijn.json");
    list.removeAttribute("aria-busy");
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      list.innerHTML = "";
      $("#timeline-empty").hidden = false;
      return;
    }
    const items = [...data.items].sort((a, b) => (a.year || 0) - (b.year || 0));
    list.innerHTML = items.map((it) => `
      <li>
        <span class="year">${esc(it.year ?? "")}</span>
        <span class="event">${esc(it.event ?? "")}</span>
        ${it.note ? `<span class="note">${esc(it.note)}</span>` : ""}
      </li>
    `).join("");
  }

  // -- Anekdotes (mini-Markdown: # / ## / paragrafen / **bold** / *italic*)
  function miniMarkdown(md) {
    const lines = md.split(/\r?\n/);
    const out = [];
    let para = [];

    const flushPara = () => {
      if (!para.length) return;
      const text = para.join(" ")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
      out.push(`<p>${text}</p>`);
      para = [];
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushPara(); continue; }
      if (line.startsWith("## ")) { flushPara(); out.push(`<h2>${esc(line.slice(3))}</h2>`); continue; }
      if (line.startsWith("# "))  { flushPara(); out.push(`<h1>${esc(line.slice(2))}</h1>`);  continue; }
      para.push(esc(line));
    }
    flushPara();
    return out.join("\n");
  }

  async function renderAnekdotes() {
    const body = $("#anekdotes-body");
    if (!body) return;
    const md = await loadText("content/anekdotes.md");
    body.removeAttribute("aria-busy");
    const trimmed = (md || "").trim();
    if (!trimmed || trimmed.startsWith("<!--")) {
      body.innerHTML = "";
      $("#anekdotes-empty").hidden = false;
      return;
    }
    body.innerHTML = miniMarkdown(trimmed);
  }

  // -- Foto's ------------------------------------------------------------
  async function renderGallery() {
    const gal = $("#gallery");
    if (!gal) return;
    const data = await loadJSON("content/fotos.json");
    gal.removeAttribute("aria-busy");
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      gal.innerHTML = "";
      $("#gallery-empty").hidden = false;
      return;
    }
    gal.innerHTML = data.items.map((it, i) => `
      <figure data-idx="${i}">
        <img src="${esc(it.src)}" alt="${esc(it.alt || it.caption || "")}" loading="lazy">
        ${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ""}
      </figure>
    `).join("");
    attachLightbox(gal, data.items);
  }

  function attachLightbox(gal, items) {
    let box = document.getElementById("lightbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "lightbox";
      box.setAttribute("hidden", "");
      box.innerHTML = `
        <button class="lb-close" aria-label="Sluit">×</button>
        <button class="lb-prev" aria-label="Vorige">‹</button>
        <img class="lb-img" alt="">
        <button class="lb-next" aria-label="Volgende">›</button>
        <p class="lb-caption"></p>
      `;
      document.body.appendChild(box);
    }
    const img  = box.querySelector(".lb-img");
    const cap  = box.querySelector(".lb-caption");
    let cur = 0;

    function show(i) {
      cur = (i + items.length) % items.length;
      const it = items[cur];
      img.src = it.src;
      img.alt = it.alt || it.caption || "";
      cap.textContent = it.caption || "";
      box.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function hide() {
      box.hidden = true;
      img.src = "";
      document.body.style.overflow = "";
    }

    gal.querySelectorAll("figure").forEach((fig) => {
      fig.style.cursor = "zoom-in";
      fig.addEventListener("click", () => show(Number(fig.dataset.idx)));
    });
    box.querySelector(".lb-close").onclick = hide;
    box.querySelector(".lb-prev").onclick  = () => show(cur - 1);
    box.querySelector(".lb-next").onclick  = () => show(cur + 1);
    box.addEventListener("click", (e) => { if (e.target === box) hide(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape")    hide();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight")show(cur + 1);
    });
  }

  // -- Quotes ------------------------------------------------------------
  async function renderQuotes() {
    const list = $("#quotes-list");
    if (!list) return;
    const data = await loadJSON("content/quotes.json");
    list.removeAttribute("aria-busy");
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      list.innerHTML = "";
      $("#quotes-empty").hidden = false;
      return;
    }
    list.innerHTML = data.items.map((q) => `
      <li>
        <blockquote>${esc(q.text || "")}</blockquote>
        ${q.author ? `<span class="attribution">${esc(q.author)}${q.year ? `, ${esc(q.year)}` : ""}</span>` : ""}
      </li>
    `).join("");
  }

  // -- Router-light ------------------------------------------------------
  await Promise.all([
    renderTimeline(),
    renderAnekdotes(),
    renderGallery(),
    renderQuotes(),
  ]);
})();
