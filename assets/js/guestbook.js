// guestbook.js — gastenboek front-end
(function () {
  "use strict";

  const API_BASE = "api"; // relatief; werkt onder /ouwelul/ én lokaal indien proxy
  const form   = document.getElementById("signform");
  const btn    = document.getElementById("signbtn");
  const msg    = document.getElementById("signform-msg");
  const list   = document.getElementById("signs-list");
  const empty  = document.getElementById("signs-empty");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" });
    } catch (_) { return iso; }
  }

  async function load() {
    if (!list) return;
    try {
      const res = await fetch(`${API_BASE}/signs`, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      list.removeAttribute("aria-busy");
      const items = Array.isArray(data.items) ? data.items : [];
      if (items.length === 0) {
        list.innerHTML = "";
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      list.innerHTML = items.map((it) => `
        <li class="sign">
          <p class="sign-body">${esc(it.message || "")}</p>
          <p class="sign-meta">&mdash; ${esc(it.name || "anoniem")}, <time>${esc(fmtDate(it.ts))}</time></p>
        </li>
      `).join("");
    } catch (err) {
      list.removeAttribute("aria-busy");
      list.innerHTML = `<li class="loading">Kon felicitaties niet laden (${esc(err.message)}).</li>`;
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form) return;
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    if (!name || !message) return;
    btn.disabled = true;
    msg.hidden = true;
    try {
      const res = await fetch(`${API_BASE}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (res.status === 429) throw new Error("Even rustig — wacht 30 seconden.");
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      msg.hidden = false;
      msg.textContent = "Bedankt! Je felicitatie staat erbij.";
      msg.className = "signform-msg ok";
      load();
    } catch (err) {
      msg.hidden = false;
      msg.textContent = "Mislukt: " + err.message;
      msg.className = "signform-msg err";
    } finally {
      btn.disabled = false;
      setTimeout(() => { if (msg) msg.hidden = true; }, 5000);
    }
  }

  if (form) form.addEventListener("submit", submit);
  load();
})();
