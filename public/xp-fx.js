// Občutek dosežka ob XP: števec v zgornji vrstici steče do novega zneska, zvezdice odletijo k njemu,
// vrstica ravni se napolni, ob novi ravni pa se pokaže čestitka (dnevni cilj in mejniki: pasica na vrhu).
// Vse velja za vse vire XP (naloge, igre, tekmovanja, sinhronizacija brez povezave), ker se sproži
// iz primerjave prejšnjega in novega povzetka XP (app.js refreshXp).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { levelProgress, crossedMilestone, reasonKey } from "./xp-levels.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("lite");

// ---------- prikaz ----------

// Raven z vrstico napredka (kartica na Učni poti, stran Jaz).
// prev: prejšnji povzetek, da se vrstica napolni od prejšnjega stanja (ob novi ravni od začetka).
export function levelRowHtml(x, prev = null) {
  const lp = levelProgress(x.total);
  const before = prev && levelProgress(prev.total).level === lp.level ? levelProgress(prev.total).pct : 0;
  return `<div class="lvl-row">
    <span class="lvl-badge" aria-hidden="true">${icon("star")}<b>${lp.level}</b></span>
    <div class="lvl-main">
      <div class="lvl-top"><b>${esc(t("xp.level", { n: lp.level }))}</b><span>${esc(t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 }))}</span></div>
      <div class="lvl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${lp.pct}" aria-label="${esc(t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 }))}"><i style="--p:${lp.pct / 100};--from:${before / 100}"></i></div>
    </div>
  </div>`;
}

// Dnevni cilj: krog, ki se polni z današnjim XP (ob doseženem cilju zlat s kljukico).
export function goalRingHtml(x) {
  const goal = x.goal || 50;
  const today = x.today || 0;
  const pct = Math.min(100, Math.round((today / goal) * 100));
  const done = today >= goal;
  return `<div class="goal-cell${done ? " done" : ""}">
    <span class="goal-ring" style="--p:${pct}" role="img" aria-label="${esc(t("xp.goalShort", { today, goal }))}">${done ? icon("check") : `<b>${today}</b>`}</span>
    <span>${esc(t("xp.goalShort", { today, goal }))}</span>
  </div>`;
}

// Kartica pod Današnjim treningom: raven + dnevni cilj, XP v tednu in niz dni.
export function xpStatsHtml(x, prev = null) {
  return `${levelRowHtml(x, prev)}
    <div class="stats-row">
      ${goalRingHtml(x)}
      <div><b>${x.week}</b><span>${esc(t("stats.week"))}</span></div>
      <div><b>${x.streak}</b><span>${esc(t("stats.streak", { n: x.streak }))}</span></div>
    </div>`;
}

// Za kaj je bil XP (pravilno, popravljena napaka, niz dni …) in koliko še do dnevnega cilja.
export function xpItemsHtml(xp) {
  if (!xp?.items?.length) return "";
  const chips = xp.items.length > 1
    ? xp.items
        .map((it) => {
          const k = reasonKey(it.reason);
          return k ? `<span class="xp-chip"><bdi dir="ltr">+${it.amount}</bdi> · ${esc(t(k[0], k[1]))}</span>` : "";
        })
        .join("")
    : "";
  const goal = xp.goal && xp.today < xp.goal ? `<span class="xp-chip goal">${icon("target")}${esc(t("xp.goalShort", { today: xp.today, goal: xp.goal }))}</span>` : "";
  return chips || goal ? `<div class="xp-items">${chips}${goal}</div>` : "";
}

// Zgornja vrstica: vrstica ravni pod zneskom XP in opis (raven, koliko do naslednje).
export function paintBadge(chip, x) {
  if (!chip || !x) return;
  const lp = levelProgress(x.total);
  chip.style.setProperty("--lvl", lp.pct / 100);
  chip.title = `${t("xp.title")} · ${t("xp.level", { n: lp.level })} · ${t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 })}`;
}

// ---------- animacije ----------

// Števec od prej do zdaj (ob »manj gibanja« takoj).
// alive(): ob menjavi profila se štetje ustavi (znesek je takrat že nastavil novi profil).
export function runCount(el, from, to, ms = 800, alive = () => true) {
  if (!el) return;
  if (calm() || from === to) {
    el.textContent = String(to);
    return;
  }
  const t0 = performance.now();
  const step = (now) => {
    if (!alive()) return;
    const k = Math.min(1, (now - t0) / ms);
    el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const visible = (el) => {
  if (!el || !el.isConnected) return null;
  const r = el.getBoundingClientRect();
  return r.width && r.height && r.bottom > 0 && r.top < innerHeight ? r : null;
};

// Zvezdice od »+15 XP« do zneska v zgornji vrstici.
function flyStars(fromEl, toEl, n = 6) {
  const a = visible(fromEl);
  const b = visible(toEl);
  if (!a || !b || calm() || !document.body.animate) return 0;
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const x1 = b.left + 18, y1 = b.top + b.height / 2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "xp-fly";
    s.innerHTML = icon("star");
    s.style.left = `${x0}px`;
    s.style.top = `${y0}px`;
    document.body.append(s);
    const spread = (i - (n - 1) / 2) * 14;
    const mx = (x1 - x0) * 0.35 + spread, my = Math.min(y0, y1) - 60 - Math.abs(spread);
    s.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.4)", opacity: 0 },
        { transform: `translate(calc(-50% + ${mx}px), calc(-50% + ${my - y0}px)) scale(1.1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) scale(0.5)`, opacity: 0.2 },
      ],
      { duration: 650 + i * 40, delay: i * 45, easing: "cubic-bezier(.3,.7,.4,1)", fill: "forwards" },
    ).onfinish = () => s.remove();
  }
  return 650 + n * 85;
}

// Mali »+15« ob zgornjem znesku.
function plusAt(toEl, gained) {
  const b = visible(toEl);
  if (!b) return;
  const s = document.createElement("span");
  s.className = "xp-plus";
  s.textContent = `+${gained}`;
  s.style.left = `${b.left + b.width / 2}px`;
  s.style.top = `${b.bottom + 4}px`;
  document.body.append(s);
  setTimeout(() => s.remove(), 1400);
}

// ---------- čestitke ----------

const queue = [];
let showing = false;

function next() {
  const job = queue.shift();
  if (!job) {
    showing = false;
    return;
  }
  showing = true;
  job(next);
}
const enqueue = (job) => {
  queue.push(job);
  if (!showing) next();
};

// Pasica na vrhu (dnevni cilj, mejnik); izgine sama, dotik jo zapre prej.
function banner(ic, title, sub, done) {
  const el = document.createElement("div");
  el.className = "xp-banner";
  el.setAttribute("role", "status");
  el.innerHTML = `<span class="xp-banner-ic">${icon(ic)}</span><span><b>${esc(title)}</b><small>${esc(sub)}</small></span>`;
  document.body.append(el);
  let gone = false;
  const close = () => {
    if (gone) return;
    gone = true;
    el.classList.add("out");
    setTimeout(() => {
      el.remove();
      done();
    }, calm() ? 0 : 250);
  };
  el.addEventListener("click", close);
  setTimeout(close, 3200);
}

function confetti(box) {
  if (calm()) return;
  const colors = ["var(--gold)", "var(--accent)", "var(--ok)", "var(--warm)", "var(--hero-b)"];
  box.innerHTML = Array.from({ length: 28 }, (_, i) => {
    const x = Math.round(Math.random() * 100);
    const d = (Math.random() * 0.5).toFixed(2);
    const r = Math.round(Math.random() * 360);
    const drift = Math.round((Math.random() - 0.5) * 120);
    return `<i style="--x:${x}%;--d:${d}s;--r:${r}deg;--drift:${drift}px;background:${colors[i % colors.length]}"></i>`;
  }).join("");
}

// Nova raven: okno s konfeti, zapre se z gumbom, Esc ali dotikom ozadja.
function levelUp(x, extra, done) {
  const lp = levelProgress(x.total);
  const back = document.activeElement;
  const el = document.createElement("div");
  el.className = "xp-cele";
  el.innerHTML = `<div class="xp-cele-card" role="dialog" aria-modal="true" aria-labelledby="xp-cele-title">
      <div class="xp-confetti" aria-hidden="true"></div>
      <div class="xp-cele-badge" aria-hidden="true">${icon("star")}<b>${lp.level}</b></div>
      <h2 id="xp-cele-title">${esc(t("xp.levelUp"))}</h2>
      <p>${esc(t("xp.levelUpText", { n: lp.level }))}</p>
      <div class="lvl-bar"><i style="--p:${lp.pct / 100};--from:0"></i></div>
      <p class="muted">${esc(t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 }))}</p>
      ${extra.map((e) => `<p class="xp-cele-extra">${icon(e.ic)}${esc(e.text)}</p>`).join("")}
      <button type="button" class="primary big">${esc(t("xp.continue"))}</button>
    </div>`;
  document.body.append(el);
  confetti(el.querySelector(".xp-confetti"));
  const btn = el.querySelector("button");
  const close = () => {
    document.removeEventListener("keydown", onKey, true);
    el.remove();
    // Prejšnji element je lahko medtem izrisan znova: potem gumb »Naprej« / »Naslednja naloga«.
    const target = back?.isConnected && back !== document.body ? back : document.querySelector("#fb-next, #fb-back");
    target?.focus?.({ preventScroll: true });
    done();
  };
  const onKey = (e) => {
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
      btn.focus();
    }
  };
  document.addEventListener("keydown", onKey, true);
  btn.addEventListener("click", close);
  el.addEventListener("click", (e) => e.target === el && close());
  btn.focus({ preventScroll: true });
}

// Primerjava prejšnjega in novega povzetka: animacija zneska in čestitke. from = element, od koder letijo zvezdice.
// alive(): ali je še isti profil (ob menjavi profila med animacijo se znesek in čestitka ne pokažeta).
export function celebrateXp(prev, x, { badge, total, from, alive = () => true } = {}) {
  const gained = x.total - prev.total;
  if (gained <= 0) return;
  const source = from || [...document.querySelectorAll(".xp-gain, .gm-xp")].filter((e) => visible(e)).pop();
  const delay = flyStars(source, badge);
  setTimeout(() => {
    if (!alive()) return;
    runCount(total, prev.total, x.total, 800, alive);
    badge?.classList.remove("bump");
    void badge?.offsetWidth;
    badge?.classList.add("bump");
    if (!source) plusAt(badge, gained);
  }, Math.max(0, delay - 250));

  const goalNow = prev.today < x.goal && x.today >= x.goal && prev.goal === x.goal;
  const milestone = crossedMilestone(prev.total, x.total);
  const goalText = { ic: "target", text: t("xp.goalDone") };
  const mileText = milestone ? { ic: "trophy", text: t("xp.milestone", { xp: milestone }) } : null;
  setTimeout(() => {
    if (!alive()) return;
    if (x.level > prev.level) {
      enqueue((done) => levelUp(x, [goalNow && goalText, mileText].filter(Boolean), done));
      return;
    }
    if (goalNow) enqueue((done) => banner("target", t("xp.goalDone"), t("xp.goalDoneSub", { today: x.today }), done));
    if (milestone) enqueue((done) => banner("trophy", t("xp.milestone", { xp: milestone }), t("xp.milestoneSub"), done));
  }, delay + 200);
}
