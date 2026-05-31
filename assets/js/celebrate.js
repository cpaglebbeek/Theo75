// celebrate.js — countdown naar 31-05-2026 23:00 CEST + ballonnen-explosie
(function () {
  "use strict";

  // 23:00 CEST op 31 mei 2026 = 21:00 UTC
  // Overschrijfbaar via window.THEO75_TARGET (gebruikt door /ouwelul/test.html).
  const TARGET = (typeof window.THEO75_TARGET === "number")
    ? window.THEO75_TARGET
    : new Date("2026-05-31T23:00:00+02:00").getTime();

  const $ = (s) => document.querySelector(s);
  const elDays = $("#cd-days"), elHrs = $("#cd-hours"),
        elMins = $("#cd-mins"), elSecs = $("#cd-secs"),
        msg = $("#countdown-msg"),
        countdown = $("#countdown");

  let fired = false;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      if (elDays) elDays.textContent = "00";
      if (elHrs)  elHrs.textContent  = "00";
      if (elMins) elMins.textContent = "00";
      if (elSecs) elSecs.textContent = "00";
      if (!fired) {
        fired = true;
        if (countdown) countdown.classList.add("done");
        if (msg) msg.hidden = false;
        explode();
      }
      return;
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (elDays) elDays.textContent = pad(d);
    if (elHrs)  elHrs.textContent  = pad(h);
    if (elMins) elMins.textContent = pad(m);
    if (elSecs) elSecs.textContent = pad(r);
  }

  // -- ballonnen --------------------------------------------------------
  const BALLOON_COLORS = ["#e63946", "#f4a261", "#2a9d8f", "#264653", "#e9c46a", "#a663cc", "#ff70a6", "#06d6a0"];
  function makeBalloon(host, x) {
    const b = document.createElement("div");
    b.className = "balloon";
    const c = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    b.style.setProperty("--color", c);
    b.style.left = x + "vw";
    b.style.animationDuration = (4 + Math.random() * 3.5) + "s";
    b.style.animationDelay = (Math.random() * 0.6) + "s";
    b.style.setProperty("--sway", (Math.random() * 30 - 15) + "px");
    host.appendChild(b);
    setTimeout(() => b.remove(), 9000);
  }

  // -- confetti via canvas ---------------------------------------------
  function confetti(canvas, durationMs) {
    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const N = 180;
    const pieces = [];
    for (let i = 0; i < N; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        g:  0.32 + Math.random() * 0.15,
        size: 6 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        shape: Math.random() < 0.5 ? "rect" : "circle",
      });
    }

    const start = performance.now();
    function frame(t) {
      const dt = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.vy += p.g * dt;
        p.x  += p.vx * dt;
        p.y  += p.vy * dt;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (performance.now() - start < durationMs) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  function playAnthem() {
    if (document.getElementById("anthem")) return; // idempotent
    const wrap = document.createElement("div");
    wrap.id = "anthem";
    wrap.innerHTML = `
      <iframe id="anthem-frame"
        title="In-A-Gadda-Da-Vida — Iron Butterfly"
        src="https://www.youtube.com/embed/UIVe-rZBcm4?autoplay=1&playsinline=1&rel=0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen></iframe>
      <button type="button" id="anthem-replay" title="Opnieuw afspelen">♫ Klik om af te spelen</button>
      <button type="button" id="anthem-close" title="Sluit speler" aria-label="Sluit">×</button>
    `;
    document.body.appendChild(wrap);

    document.getElementById("anthem-close").addEventListener("click", () => {
      wrap.remove();
    });
    document.getElementById("anthem-replay").addEventListener("click", () => {
      const f = document.getElementById("anthem-frame");
      f.src = f.src; // re-trigger autoplay after user gesture
      document.getElementById("anthem-replay").hidden = true;
    });

    // Toon de fallback-knop pas na ~3s, als autoplay door browser is geblokkeerd
    // is dit het pad-zonder-frustratie voor de gebruiker.
    setTimeout(() => {
      const btn = document.getElementById("anthem-replay");
      if (btn) btn.hidden = false;
    }, 3000);
  }

  function explode() {
    const host = $("#balloons");
    const canvas = $("#confetti");
    if (host) {
      const N = 40;
      for (let i = 0; i < N; i++) {
        makeBalloon(host, Math.random() * 100);
      }
      // tweede golf
      setTimeout(() => {
        for (let i = 0; i < 30; i++) makeBalloon(host, Math.random() * 100);
      }, 1800);
    }
    if (canvas) confetti(canvas, 7000);
    playAnthem();
  }

  // preview-mode via ?fire=1
  if (new URLSearchParams(location.search).get("fire") === "1") {
    setTimeout(() => { fired = true; if (msg) msg.hidden = false; explode(); }, 300);
  }

  tick();
  setInterval(tick, 1000);
})();
