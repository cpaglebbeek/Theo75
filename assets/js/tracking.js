// tracking.js — Theo75 bezoek-rapportage (eenmalige uitzondering op no-tracking regel)
// Verzamelt: page views, clicks, scroll-diepte, lightbox-acties, gastenboek-submits, session-tijd.
// Stuurt batched events naar /api/track. Banner onderaan informeert bezoekers.

(function () {
  "use strict";

  const ENDPOINT = "api/track";  // relatief — onder /ouwelul/
  const COOKIE   = "t75_sid";
  const FLUSH_INTERVAL = 8000;   // ms
  const COOKIE_DAYS = 365;

  // -- cookie helpers ----------------------------------------------------
  function uuidish() {
    return (Date.now().toString(36) + Math.random().toString(36).slice(2,10) +
            Math.random().toString(36).slice(2,10));
  }
  function getCookie(name) {
    return document.cookie.split("; ").reduce((r,c) => {
      const [k,v] = c.split("="); return k === name ? decodeURIComponent(v) : r;
    }, "");
  }
  function setCookie(name, val, days) {
    const d = new Date(); d.setTime(d.getTime() + days*24*3600*1000);
    document.cookie = `${name}=${encodeURIComponent(val)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }

  let sid = getCookie(COOKIE);
  if (!sid) { sid = uuidish(); setCookie(COOKIE, sid, COOKIE_DAYS); }

  // -- session info ------------------------------------------------------
  const sessionStart = Date.now();
  const pageStart    = Date.now();
  const pageId       = uuidish();
  const info = {
    page: location.pathname,
    title: document.title,
    referrer: document.referrer || "",
    lang: navigator.language || "",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    tzOffset: new Date().getTimezoneOffset(),
    screen: `${screen.width}x${screen.height}`,
    viewport: `${innerWidth}x${innerHeight}`,
    dpr: devicePixelRatio || 1,
    platform: navigator.platform || "",
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    doNotTrack: navigator.doNotTrack || "",
    touch: ("ontouchstart" in window),
  };

  // -- event queue + flush ----------------------------------------------
  const queue = [];
  function push(type, payload) {
    queue.push({ t: Date.now(), type, ...payload });
  }

  function flush(useBeacon) {
    if (queue.length === 0) return;
    const batch = queue.splice(0, queue.length);
    const body = JSON.stringify({ sid, pageId, info, events: batch });
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, { method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body, keepalive: true }).catch(() => {});
      }
    } catch (_) { /* swallow */ }
  }

  // -- collect events ----------------------------------------------------
  push("pageview", {});

  // clicks (capture phase = catches everything)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("a, button, figure, [data-track]");
    if (!t) return;
    push("click", {
      tag: t.tagName.toLowerCase(),
      href: t.href || null,
      text: (t.textContent || "").slice(0, 80).trim(),
      cls: (t.className || "").slice(0, 80),
      id:  t.id || null,
    });
  }, true);

  // scroll depth milestones
  const scrollSeen = new Set();
  window.addEventListener("scroll", () => {
    const pct = Math.round(((scrollY + innerHeight) / document.documentElement.scrollHeight) * 100);
    for (const m of [25, 50, 75, 100]) {
      if (pct >= m && !scrollSeen.has(m)) {
        scrollSeen.add(m);
        push("scroll", { pct: m });
      }
    }
  }, { passive: true });

  // form submits (gastenboek)
  document.addEventListener("submit", (e) => {
    const f = e.target;
    const data = {};
    if (f.elements) {
      for (const el of f.elements) {
        if (!el.name) continue;
        // exclude obvious password-like fields
        if (/pass|pwd/i.test(el.name)) continue;
        data[el.name] = String(el.value || "").slice(0, 200);
      }
    }
    push("submit", { form: f.id || f.name || "anon", data });
  }, true);

  // lightbox-specific (luisteren op keydown + custom events)
  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lightbox");
    if (lb && !lb.hidden && (e.key === "Escape" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      push("lightbox-key", { key: e.key });
    }
  });

  // visibility -> session pause/resume
  document.addEventListener("visibilitychange", () => {
    push("visibility", { state: document.visibilityState });
    if (document.visibilityState === "hidden") flush(true);
  });

  // periodic flush
  setInterval(() => flush(false), FLUSH_INTERVAL);

  // unload — final beacon
  window.addEventListener("pagehide", () => {
    push("pageleave", { ms_on_page: Date.now() - pageStart });
    flush(true);
  });
  window.addEventListener("beforeunload", () => {
    push("pageleave", { ms_on_page: Date.now() - pageStart });
    flush(true);
  });

  // -- visible banner onderaan (transparantie-verzachting) --------------
  function showBanner() {
    if (document.getElementById("t75-banner")) return;
    const b = document.createElement("div");
    b.id = "t75-banner";
    b.innerHTML = `
      <span>Deze site verzamelt bezoekgegevens t.b.v. het verjaardagskaart-rapport van Theo.</span>
      <button type="button" id="t75-banner-close" aria-label="Sluit melding">×</button>
    `;
    document.body.appendChild(b);
    document.getElementById("t75-banner-close").addEventListener("click", () => b.remove());
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
