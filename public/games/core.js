// Skupno ogrodje iger: platno, zanka, vnos (dotik, miška, tipke), naloge, točke, življenja,
// prilagajanje težavnosti, učinki in zvok. Vsaka igra (engine) samo riše in odloča, kaj je zadetek.
import { makeQuestion, shuffle, gameLang } from "./topics.js";
import { icon } from "../icons.js";

const SOUND_KEY = "evklid.gameSound";
const PACE_KEY = "evklid.gamePace";
export const PACES = { slow: 0.7, mid: 1, fast: 1.3 };
export const INK = "#1b1b2f"; // obroba v slogu starih Flash iger
function getPace() {
  try {
    const p = localStorage.getItem(PACE_KEY);
    return PACES[p] ? p : "slow";
  } catch {
    return "slow";
  }
}
const CHAPTER_EVERY = 8;
const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let audio = null;
function soundOn() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}
function beep(kind) {
  if (!soundOn()) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [[523, 0], [784, 0.07]], bad: [[196, 0], [147, 0.09]], pop: [[880, 0]], up: [[523, 0], [659, 0.07], [784, 0.14], [1047, 0.21]], over: [[392, 0], [330, 0.14], [262, 0.28], [196, 0.42]], story: [[392, 0], [523, 0.1], [659, 0.2], [784, 0.3]] }[kind] || [[440, 0]];
    for (const [f, at] of notes) {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "square"; // 8-bitni zvok
      o.frequency.value = f;
      const t0 = audio.currentTime + at;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(g).connect(audio.destination);
      o.start(t0);
      o.stop(t0 + 0.18);
    }
  } catch {}
}

// Besedilo, ki se prilagodi širini (pomanjša pisavo do min).
export function fitText(g, text, x, y, maxW, size = 20, { color = "#14213d", weight = 800, min = 10, align = "center", stroke = null, sw = 4 } = {}) {
  let s = size;
  g.font = `${weight} ${s}px Nunito, system-ui, sans-serif`;
  while (s > min && g.measureText(text).width > maxW) {
    s -= 1;
    g.font = `${weight} ${s}px Nunito, system-ui, sans-serif`;
  }
  g.textAlign = align;
  g.textBaseline = "middle";
  if (stroke) {
    g.lineJoin = "round";
    g.lineWidth = sw;
    g.strokeStyle = stroke;
    g.strokeText(text, x, y);
  }
  g.fillStyle = color;
  g.fillText(text, x, y);
  return s;
}
export function textWidth(g, text, size, weight = 800) {
  g.font = `${weight} ${size}px Nunito, system-ui, sans-serif`;
  return g.measureText(text).width;
}
// Račun ali odgovor sredi prevedenega besedila: smer po vsebini (»−11« ostane »−11« tudi v RTL).
export const iso = (s) => `\u2068${s}\u2069`;
export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// Zažene igro v elementu host. opts: { engine, concept, tier, tierUp, best, t, title, onEnd(result) → Promise<info>, onExit() }
// tierUp: po koliko pravilnih zaporedoma igra preide na težje naloge (stage.js, privzeto 5).
export function runGame(host, opts) {
  const { engine, concept, t } = opts;
  host.innerHTML = `
    <div class="gm-play${engine.ui ? " gm-has-ui" : ""}" style="--gm-a:${engine.colors[0]};--gm-b:${engine.colors[1]}">
      <div class="gm-hud">
        <button type="button" class="gm-btn gm-exit" aria-label="${esc(t("games.back"))}">${icon("arrow-left")}</button>
        <div class="gm-qbox"><div class="gm-q" aria-live="polite"></div><div class="gm-fb" aria-live="assertive"></div></div>
        <div class="gm-stats">
          <span class="gm-score" title="${esc(t("games.score"))}">${icon("star")}<b>0</b></span>
          <span class="gm-lives" aria-label="${esc(t("games.lives"))}"></span>
        </div>
        <button type="button" class="gm-btn gm-sound" aria-label="${esc(t("games.sound"))}"></button>
        <button type="button" class="gm-btn gm-pause" aria-label="${esc(t("games.pause"))}">${icon("pause")}</button>
      </div>
      <div class="gm-timer" hidden><i></i></div>
      <div class="gm-stage"><canvas dir="ltr" tabindex="0" aria-label="${esc(opts.title)}"></canvas><div class="gm-overlay"></div></div>
      ${engine.ui ? `<div class="gm-ui" dir="ltr"></div>` : ""}
    </div>`;
  const $ = (s) => host.querySelector(s);
  const canvas = $("canvas"), g = canvas.getContext("2d");
  const overlay = $(".gm-overlay");
  const stage = $(".gm-stage");

  const G = {
    W: 300, H: 300, time: 0, speed: 1, chapter: 1, tier: opts.tier || 1, score: 0, lives: 3, correct: 0, wrong: 0, streak: 0, badStreak: 0,
    q: null, opts: [], running: false, paused: false, over: false, reduced: reduced(), t,
    mistakes: [],
    fx: [], shakeT: 0,
  };
  // Igra z lastnimi gumbi (engine.ui, npr. številčnica) jih postavi v G.ui pod prizorom; gumbi so
  // neaktivni, dokler igra ne teče (začetna kartica, premor, konec).
  G.ui = $(".gm-ui");
  const uiLive = () => G.ui && (G.ui.inert = !(G.running && !G.paused && !G.over));
  // Igra lahko sprejme le nekatere naloge pojma (engine.accept, npr. samo odgovor z enim številom).
  const okQ = (q) => !engine.accept || engine.accept(q);
  function drawQuestion(tier, avoid) {
    for (let i = 0; i < 60; i++) {
      const q = makeQuestion(concept.id, tier);
      if (!okQ(q)) continue;
      if (!avoid || q.q !== avoid || i >= 8) return q;
    }
    return makeQuestion("add", tier); // varna rezervna naloga (eno število), če pojem nič ne ustreza
  }
  // dodatna naloga iste snovi (za igre, ki pokažejo več nalog hkrati, ali vzorec za tipke igre)
  G.ask = (tier = G.tier) => drawQuestion(tier);
  const eng = engine.create(G);
  // Zgodba: poglavje se odklene na vsakih CHAPTER_EVERY pravilnih odgovorov.
  const story = () => engine.story?.[gameLang()] || engine.story?.en || [];
  const storyLen = () => story().length;
  // Novo poglavje igre ne ustavi: samo kratek napis in nove barve prizora.
  function nextChapter() {
    G.chapter++;
    beep("story");
    const ch = story()[G.chapter - 1];
    G.float(G.W / 2, G.H * 0.42, `${t("games.chapter", { n: G.chapter })}: ${ch[0]}`, "#fde047", Math.min(30, G.W / 16), 2.4);
  }
  let timer = null; // { left, total }
  let nextAt = 0; // čas naslednje naloge (po kratkem premoru)

  // ---------- naloge ----------
  function newQuestion() {
    const q = drawQuestion(G.tier, G.q?.q);
    G.q = q;
    showFb("", "");
    const n = engine.options || 4;
    G.opts = shuffle([q.a, ...q.w.slice(0, n - 1)]);
    // igra z več nalogami hkrati (npr. »Kdo je slepar?«) ima v glavi svoje navodilo namesto ene naloge
    $(".gm-q").textContent = engine.prompt ? t(engine.prompt) : q.q;
    // timer je število sekund ali funkcija (npr. več časa za več nalog hkrati)
    const sec = typeof engine.timer === "function" ? engine.timer(G) : engine.timer;
    if (sec) startTimer(sec / Math.max(0.8, Math.min(1.4, G.speed)));
    // igra lahko vrne opis prizora za bralnik zaslona (npr. vse naloge robotkov, ki so samo na platnu)
    const said = eng.question?.(q);
    if (typeof said === "string") {
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = ` ${said}`;
      $(".gm-q").append(sr);
    }
  }
  G.isRight = (s) => s === G.q?.a;
  function startTimer(sec) {
    timer = { left: sec, total: sec };
    $(".gm-timer").hidden = false;
  }
  G.stopTimer = () => {
    timer = null;
    $(".gm-timer").hidden = true;
  };

  function showFb(html, cls) {
    const el = $(".gm-fb");
    el.className = `gm-fb ${cls}`;
    el.innerHTML = html;
  }
  // namig brez kazni (npr. »Ulomek še okrajšaj.«): naloga ostane, življenje tudi
  G.hint = (text) => showFb(`${icon("lightbulb")} ${esc(text)}`, "hint");

  // Odgovor igralca. keep: naloga ostane (npr. baloni), sicer nova po kratkem premoru.
  G.answer = (ok, x = G.W / 2, y = G.H / 2, { keep = false, delay = 0.45, silent = false, note = "" } = {}) => {
    if (G.over) return;
    if (ok) {
      G.correct++;
      G.streak++;
      G.badStreak = 0;
      const pts = 10 * G.tier + Math.min(10, (G.streak - 1) * 2);
      G.score += pts;
      G.burst(x, y, "#22c55e", 18);
      G.float(x, y - 10, `+${pts}`, "#16a34a");
      beep("ok");
      showFb(`${icon("check")} ${esc(note || G.q.a)}`, "ok");
      if (G.streak % 15 === 0 && G.lives < 5) {
        G.lives++;
        G.float(G.W / 2, G.H / 3, "+❤", "#ef4444");
      }
      if (G.streak % (opts.tierUp || 5) === 0 && G.tier < 3) {
        G.tier++;
        beep("up");
        G.float(G.W / 2, G.H / 2, t("games.harder"), "#f59e0b", 28);
      }
      G.speed = PACES[getPace()] * (1 + Math.min(0.5, G.correct * 0.015));
      if (G.correct % CHAPTER_EVERY === 0 && G.chapter < storyLen()) nextChapter();
    } else {
      G.wrong++;
      G.streak = 0;
      G.badStreak++;
      G.lives--;
      G.mistakes.push([G.q.q, G.q.a]);
      if (G.mistakes.length > 6) G.mistakes.shift();
      if (!silent) {
        G.burst(x, y, "#ef4444", 12);
        G.shake(8);
      }
      beep("bad");
      // Če naloga ostane (izbira med več predmeti), pravilnega odgovora še ne izdamo.
      // note: igra lahko pove svojo razlago (npr. kateri robotek je bil slepar)
      // odgovor osamljen (FSI … PDI), da »−11« v arabščini ne postane »11−«
      showFb(`${icon("x")} ${esc(note || (keep ? t("games.tryAgain") : t("games.correctWas", { a: iso(G.q.a) })))}`, "bad");
      if (G.badStreak >= 2 && G.tier > 1) {
        G.tier--;
        G.badStreak = 0;
      }
    }
    hud();
    if (G.lives <= 0) return end();
    if (!keep || ok) {
      G.stopTimer();
      // po napaki je več časa, da se prebere pravilni odgovor, preden pride nova naloga
      nextAt = G.time + (ok ? delay : Math.max(delay, 1.8));
      G.waiting = true;
    }
  };
  // Pravilni odgovor je ušel (padel mimo, odletel …).
  G.miss = (x, y) => G.answer(false, x, y);

  // ---------- učinki ----------
  G.burst = (x, y, color, n = 14) => {
    if (G.reduced) n = Math.min(n, 5);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 180;
      G.fx.push({ k: "p", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6 + Math.random() * 0.3, max: 0.9, color, r: 2 + Math.random() * 3 });
    }
  };
  G.float = (x, y, text, color, size = 22, life = 1) => G.fx.push({ k: "t", x, y, text, color, size, life, max: life });
  G.shake = (a) => {
    if (!G.reduced) G.shakeT = Math.max(G.shakeT, a);
  };
  G.sound = beep;
  G.fit = (...a) => fitText(g, ...a);
  G.tw = (text, size, weight) => textWidth(g, text, size, weight);
  G.rr = (...a) => roundRect(g, ...a);
  G.g = g;

  function drawFx(dt) {
    for (const p of G.fx) {
      p.life -= dt;
      if (p.k === "p") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 300 * dt;
        g.globalAlpha = Math.max(0, p.life / p.max);
        g.fillStyle = p.color;
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fill();
      } else {
        p.y -= 40 * dt;
        g.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
        g.lineWidth = 4;
        g.strokeStyle = "rgba(255,255,255,0.9)";
        g.font = `900 ${p.size}px Nunito, system-ui, sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.strokeText(p.text, p.x, p.y);
        g.fillStyle = p.color;
        g.fillText(p.text, p.x, p.y);
      }
    }
    g.globalAlpha = 1;
    G.fx = G.fx.filter((p) => p.life > 0);
  }

  // ---------- HUD ----------
  function hud() {
    $(".gm-score b").textContent = G.score;
    $(".gm-lives").innerHTML = Array.from({ length: Math.max(G.lives, 0) }, () => icon("heart")).join("");
    $(".gm-lives").setAttribute("aria-label", `${t("games.lives")}: ${G.lives}`);
    $(".gm-sound").innerHTML = icon(soundOn() ? "volume-2" : "volume-x");
  }

  // ---------- velikost ----------
  function resize() {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    G.W = Math.max(200, r.width);
    G.H = Math.max(200, r.height);
    canvas.width = Math.round(G.W * dpr);
    canvas.height = Math.round(G.H * dpr);
    canvas.style.width = `${G.W}px`;
    canvas.style.height = `${G.H}px`;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    eng.resize?.();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stage);

  // ---------- zanka ----------
  let last = 0, raf = 0;
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000);
    last = ts;
    if (G.running && !G.paused) {
      G.time += dt;
      if (G.waiting && G.time >= nextAt) {
        G.waiting = false;
        newQuestion();
      }
      if (timer && !G.waiting) {
        timer.left -= dt;
        $(".gm-timer i").style.transform = `scaleX(${Math.max(0, timer.left / timer.total)})`;
        if (timer.left <= 0) {
          G.stopTimer();
          // igra lahko vrne dodatne možnosti odgovora (note, delay)
          const more = eng.timeout?.();
          G.answer(false, G.W / 2, G.H / 2, { ...more, silent: true });
        }
      }
      eng.update(dt);
    }
    g.save();
    if (G.shakeT > 0) {
      G.shakeT = Math.max(0, G.shakeT - dt * 30);
      g.translate((Math.random() - 0.5) * G.shakeT, (Math.random() - 0.5) * G.shakeT);
    }
    eng.draw(g);
    drawFx(G.running && !G.paused ? dt : 0);
    g.restore();
  }

  // ---------- vnos ----------
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const live = () => G.running && !G.paused && !G.over;
  canvas.addEventListener("pointerdown", (e) => {
    if (!live()) return;
    canvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    eng.pointer?.("down", pos(e));
  });
  canvas.addEventListener("pointermove", (e) => live() && eng.pointer?.("move", pos(e), e.buttons > 0 || e.pointerType === "touch"));
  canvas.addEventListener("pointerup", (e) => live() && eng.pointer?.("up", pos(e)));
  canvas.addEventListener("pointercancel", (e) => live() && eng.pointer?.("up", pos(e)));
  const onKey = (e) => {
    if (!host.isConnected) return;
    if (e.target.closest?.("input, textarea, select")) return;
    if (e.key === "Escape" || e.key === "p" || e.key === "P") {
      // samo ob pritisku: onKey posluša tudi spust tipke, ki bi premor takoj spet končal
      if (e.type === "keydown" && G.running && !G.over) {
        togglePause();
        e.preventDefault();
      }
      return;
    }
    // Enter/presledek na gumbu (👍/👎, »Druge igre«) sproži ta gumb, ne »Znova«
    if ((e.key === "Enter" || e.key === " ") && !G.running && !e.target.closest?.("button") && overlay.querySelector("[data-act=play], [data-act=again]")) {
      overlay.querySelector("[data-act=play], [data-act=again]").click();
      e.preventDefault();
      return;
    }
    // Enter/presledek na gumbu igre (G.ui) sproži ta gumb, ne še enkrat tipke igre
    if ((e.key === "Enter" || e.key === " ") && e.target.closest?.(".gm-ui")) return;
    if (!live()) return;
    if (eng.key?.(e.key, e.type === "keydown")) e.preventDefault();
  };
  document.addEventListener("keydown", onKey);
  document.addEventListener("keyup", onKey);
  const onVis = () => document.hidden && G.running && !G.paused && !G.over && togglePause();
  document.addEventListener("visibilitychange", onVis);

  function togglePause() {
    G.paused = !G.paused;
    $(".gm-pause").innerHTML = icon(G.paused ? "play" : "pause");
    if (G.paused) {
      overlay.innerHTML = `<div class="gm-card"><h2>${esc(t("games.paused"))}</h2><button type="button" class="primary big" data-act="resume">${icon("play")}${esc(t("games.resume"))}</button></div>`;
      overlay.hidden = false;
    } else {
      overlay.hidden = true;
      beta0 = null; // po premoru znova umeri nagib
      canvas.focus({ preventScroll: true });
    }
    uiLive();
  }
  $(".gm-pause").addEventListener("click", () => G.running && !G.over && togglePause());
  $(".gm-sound").addEventListener("click", () => {
    try {
      localStorage.setItem(SOUND_KEY, soundOn() ? "off" : "on");
    } catch {}
    hud();
  });
  $(".gm-exit").addEventListener("click", () => opts.onExit?.());
  overlay.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "play" || act === "again") start();
    if (act === "resume") togglePause();
    const pace = e.target.closest("[data-pace]")?.dataset.pace;
    if (pace) {
      try {
        localStorage.setItem(PACE_KEY, pace);
      } catch {}
      overlay.querySelectorAll("[data-pace]").forEach((b) => b.classList.toggle("active", b.dataset.pace === pace));
    }
    if (act === "exit") opts.onExit?.();
    // 👍/👎 za vrsto igre (tedenske nove igre sledijo ocenam); ponoven tap oceno odstrani
    if (act === "rate-up" || act === "rate-down") {
      const up = act === "rate-up";
      rating = rating === up ? null : up;
      opts.onRate?.(rating);
      overlay.querySelectorAll("[data-act^=rate-]").forEach((b) => b.setAttribute("aria-pressed", String(rating === (b.dataset.act === "rate-up"))));
      const thanks = overlay.querySelector(".gm-rate small");
      if (thanks) thanks.textContent = rating === null ? "" : t("games.rateThanks");
    }
  });
  let rating = opts.rating ?? null;

  // ---------- začetek in konec ----------
  function intro() {
    overlay.hidden = false;
    const p = getPace();
    const seg = ["slow", "mid", "fast"].map((k) => `<button type="button" data-pace="${k}" class="${k === p ? "active" : ""}">${esc(t(`games.speed${k[0].toUpperCase()}${k.slice(1)}`))}</button>`).join("");
    overlay.innerHTML = `<div class="gm-card gm-title">
      <div class="gm-card-ic">${icon(engine.icon)}</div>
      <h2>${esc(opts.title)}</h2>
      ${story()[0] ? `<p class="gm-story"><b>${esc(story()[0][0])}.</b> ${esc(story()[0][1])}</p>` : ""}
      <p class="gm-how">${esc(t(`games.e.${engine.id}.how`))}</p>
      <div class="gm-pace"><span>${esc(t("games.speed"))}</span><div class="seg" role="group" aria-label="${esc(t("games.speed"))}">${seg}</div></div>
      ${opts.best ? `<p class="muted">${esc(t("games.best"))}: <b>${opts.best}</b></p>` : ""}
      <button type="button" class="primary big" data-act="play">${icon("play")}${esc(t("games.play"))}</button>
    </div>`;
    overlay.querySelector("[data-act=play]").focus({ preventScroll: true });
  }
  // ---------- senzorji telefona (nagib in tresenje) ----------
  // Igre z engine.sensors berejo G.tilt (x, y od −1 do 1) in dobijo eng.shake() ob stresanju.
  // Brez senzorjev (računalnik) ostane G.tilt.on = false in igra uporablja dotik ali tipke.
  G.tilt = { x: 0, y: 0, on: false };
  let beta0 = null, lastShake = -9, sensorsLive = false;
  const cl1 = (v) => Math.max(-1, Math.min(1, v));
  function onOrient(e) {
    if (e.gamma == null || e.beta == null) return;
    const ang = screen.orientation?.angle ?? window.orientation ?? 0;
    let gx = e.gamma, gy = e.beta;
    if (ang === 90) [gx, gy] = [e.beta, -e.gamma];
    else if (ang === -90 || ang === 270) [gx, gy] = [-e.beta, e.gamma];
    if (beta0 == null) beta0 = gy; // drža ob začetku = ničla
    G.tilt.x = cl1(gx / 22);
    G.tilt.y = cl1((gy - beta0) / 22);
    G.tilt.on = true;
  }
  function onMotion(e) {
    const a = e.acceleration?.x != null ? e.acceleration : e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    const m = Math.abs(Math.hypot(a.x, a.y || 0, a.z || 0) - (a === e.acceleration ? 0 : 9.81));
    if (m > 13 && G.time - lastShake > 0.6 && G.running && !G.paused) {
      lastShake = G.time;
      eng.shake?.();
    }
  }
  function sensorsOn() {
    beta0 = null;
    if (!engine.sensors || sensorsLive) return;
    sensorsLive = true;
    // iPhone zahteva dovoljenje ob dotiku (gumb Igraj je dotik).
    try {
      DeviceOrientationEvent?.requestPermission?.().catch(() => {});
      DeviceMotionEvent?.requestPermission?.().catch(() => {});
    } catch {}
    window.addEventListener("deviceorientation", onOrient);
    window.addEventListener("devicemotion", onMotion);
  }
  G.recenter = () => (beta0 = null);

  function start() {
    sensorsOn();
    // opts: []: napisi pred prvo nalogo ne kažejo odgovorov prejšnje igre
    Object.assign(G, { chapter: 1, speed: PACES[getPace()], time: 0, tier: opts.tier || 1, score: 0, lives: 3, correct: 0, wrong: 0, streak: 0, badStreak: 0, mistakes: [], fx: [], over: false, paused: false, waiting: false, q: null, opts: [] });
    showFb("", "");
    overlay.hidden = true;
    eng.reset?.();
    G.running = true;
    uiLive();
    hud();
    G.waiting = true; // kratek premor pred prvo nalogo
    nextAt = 0.8;
    canvas.focus({ preventScroll: true });
    beep("pop");
  }
  async function end() {
    G.over = true;
    G.running = false;
    uiLive();
    G.stopTimer();
    beep("over");
    const res = { score: G.score, correct: G.correct, wrong: G.wrong, tier: G.tier };
    const mist = G.mistakes.length
      ? `<div class="gm-mist"><b>${esc(t("games.review"))}</b><ul>${G.mistakes.map(([q, a]) => `<li><span>${esc(q)}</span><b>${esc(a)}</b></li>`).join("")}</ul></div>`
      : "";
    const render = (info = {}) => {
      overlay.innerHTML = `<div class="gm-card gm-end">
        <h2>${esc(t("games.over"))}</h2>
        <div class="gm-big">${icon("star")}<b>${G.score}</b></div>
        ${info.newBest ? `<p class="gm-record">${icon("trophy")} ${esc(t("games.record"))}</p>` : info.best ? `<p class="muted">${esc(t("games.best"))}: <b>${info.best}</b></p>` : ""}
        <p>${esc(t("games.summary", { ok: G.correct, all: G.correct + G.wrong }))}${info.xp ? ` · <b class="gm-xp">+${info.xp} XP</b>` : ""}${info.coins ? ` · <b class="gm-coins">+${info.coins} ${icon("coins")}</b>` : ""}</p>
        ${info.unlocked ? `<p class="gm-record gm-unlocked">${icon("unlock")} ${esc(info.unlocked)}</p>` : ""}
        ${mist}
        ${opts.onRate ? `<div class="gm-rate" role="group" aria-label="${esc(t("games.rateQ"))}"><span>${esc(t("games.rateQ"))}</span><button type="button" class="ghost" data-act="rate-up" aria-pressed="${rating === true}" aria-label="${esc(t("games.rateUp"))}">👍</button><button type="button" class="ghost" data-act="rate-down" aria-pressed="${rating === false}" aria-label="${esc(t("games.rateDown"))}">👎</button><small aria-live="polite"></small></div>` : ""}
        <div class="actions"><button type="button" class="secondary" data-act="exit">${icon("arrow-left")}${esc(t("games.other"))}</button><button type="button" class="primary" data-act="again">${icon("rotate-ccw")}${esc(t("games.again"))}</button></div>
      </div>`;
    };
    overlay.hidden = false;
    render();
    try {
      const info = await opts.onEnd?.(res);
      if (info && G.over) render(info);
    } catch {}
  }

  hud();
  uiLive();
  resize();
  intro();
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("devicemotion", onMotion);
      host.innerHTML = "";
    },
    get running() {
      return G.running && !G.over;
    },
  };
}
