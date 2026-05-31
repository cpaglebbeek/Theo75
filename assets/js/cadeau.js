// cadeau.js — passcode-gated cadeau-pagina voor Theo
(function () {
  "use strict";

  const PASSCODE = "ouwelul75";
  const STORAGE_KEY = "theo75_unlocked";

  const gate    = document.getElementById("gate");
  const form    = document.getElementById("gateform");
  const input   = document.getElementById("gatecode");
  const errMsg  = document.getElementById("gate-msg");
  const present = document.getElementById("presents");
  const grid    = document.getElementById("presents-grid");
  const empty   = document.getElementById("presents-empty");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  // mini-Markdown: behoudt <br>, **bold**, *italic*, paragraaf-breaks
  function format(body) {
    const safe = esc(body || "")
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    return safe.split(/\n{2,}/).map((p) => `<p>${p}</p>`).join("");
  }

  async function loadGifts() {
    try {
      const res = await fetch("content/cadeautjes-theo.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      grid.removeAttribute("aria-busy");
      const items = Array.isArray(data.items) ? data.items : [];
      if (items.length === 0) {
        grid.innerHTML = "";
        if (empty) empty.hidden = false;
        return;
      }
      grid.innerHTML = items.map((g, i) => `
        <details class="present color-${esc(g.color || "rood")}">
          <summary>
            <span class="present-bow">🎁</span>
            <span class="present-title">${esc(g.title || ("Cadeau " + (i + 1)))}</span>
            ${g.from ? `<span class="present-from">van ${esc(g.from)}</span>` : ""}
          </summary>
          <div class="present-body">${format(g.body || "")}</div>
        </details>
      `).join("");
    } catch (err) {
      grid.removeAttribute("aria-busy");
      grid.innerHTML = `<p class="loading">Kon cadeautjes niet laden (${esc(err.message)}).</p>`;
    }
  }

  function unlock() {
    if (gate) gate.hidden = true;
    if (present) present.hidden = false;
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch (_) {}
    loadGifts();
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (input.value || "").trim().toLowerCase();
      if (v === PASSCODE) {
        unlock();
      } else {
        if (errMsg) errMsg.hidden = false;
        input.value = "";
        input.focus();
      }
    });
  }

  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") unlock();
  } catch (_) {}
})();
