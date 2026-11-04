// Dnevna uganka v razdelku Igre: kartica na vrhu portala in pogled uganke (začetek, reševanje, rezultat
// z rešitvijo korak za korakom in današnjo lestvico). Uganka in preverjanje: daily.js, strežnik:
// server/daily-puzzle.js. Odgovor učenec vtipka s številčnico iger (keyBtn iz produce.js) ali s tipkovnico.
import { icon } from "../icons.js";
import { avatarSvg, DEFAULT_AVATAR } from "../avatar.js";
import { keyBtn, esc } from "./produce.js";
import { LEVELS, MAX_HINTS, HINT_MS, WRONG_MS, puzzleFor, checkAnswer, timeText, suggestedLevel } from "./daily.js";

const LEVEL_KEY = "evklid.dailyLevel";
const MINUS = "−";
const sec = (ms) => Math.round(ms / 1000);
// Račun ali seznam v stavku ostane LTR tudi v arabščini (LRI … PDI), sicer se »12 + 7 = 19« ali »−12« obrne.
const iso = (v) => (typeof v === "string" && /\D/.test(v) ? `\u2066${v}\u2069` : v);
const isoVars = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, iso(v)]));

export function savedLevel() {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    return LEVELS.includes(v) ? v : null;
  } catch {
    return null;
  }
}
export function saveLevel(lv) {
  try {
    localStorage.setItem(LEVEL_KEY, lv);
  } catch {}
}
export const pickLevel = (stage, year) => savedLevel() || suggestedLevel(stage, year);

// Datum uganke (UTC) v jeziku vmesnika.
function dayText(day, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
  } catch {
    return day;
  }
}

// Kratko stanje stopnje za kartico in vrstico na učni poti.
export function statusText(st, t) {
  if (!st?.started) return t("dz.statusNew");
  if (!st.done) return t("dz.statusOn");
  return st.solved ? t("dz.statusSolved", { time: timeText(st.total) }) : t("dz.statusGaveUp");
}

const levelSeg = (cur, status, t, suggested) =>
  `<div class="seg gm-dz-levels" role="group" aria-label="${esc(t("dz.levels"))}">${LEVELS.map((l) => {
    const st = status?.[l];
    const mark = st?.done ? (st.solved ? icon("check") : icon("x")) : "";
    return `<button type="button" class="${l === cur ? "active" : ""}" data-lv="${l}" aria-pressed="${l === cur}"${l === suggested ? ` title="${esc(t("dz.suggested"))}"` : ""}>${mark}${esc(t(`dz.level.${l}`))}</button>`;
  }).join("")}</div>`;

// Kartica na vrhu portala iger.
export function dailyCard(info, { t, lang, level, suggested }) {
  const day = info?.day;
  const st = info?.status?.[level];
  const streak = info?.streak?.days || 0;
  const btn = st?.done ? t("dz.see") : st?.started ? t("dz.continue") : t("dz.start");
  return `<section class="gm-daily" aria-labelledby="gm-dz-h">
    <div class="gm-dz-head">
      <span class="gm-dz-ic" aria-hidden="true">${icon("puzzle")}</span>
      <div class="gm-dz-ht"><h2 id="gm-dz-h">${esc(t("dz.title"))}</h2><p>${day ? `<b>${esc(dayText(day, lang))}</b> · ` : ""}${esc(t("dz.sub"))}</p></div>
      ${streak ? `<span class="gm-dz-streak">${icon("flame")}${esc(t("dz.streak", { n: streak }))}</span>` : ""}
    </div>
    <div class="gm-dz-row">
      ${levelSeg(level, info?.status, t, suggested)}
      <span class="gm-dz-st">${esc(statusText(st, t))}</span>
      <button type="button" class="primary gm-dz-go" data-act="daily">${esc(btn)}${icon("chevron-right")}</button>
    </div>
  </section>`;
}

// Pogled uganke. ctx: { api, student, t, lang, level, toast, onClose, onChange }
export function openDaily(root, ctx) {
  const { api, t } = ctx;
  const sid = ctx.student.id;
  let level = ctx.level;
  let info = null; // odgovor GET /daily (stanje vseh stopenj, niz, lestvica izbrane)
  let st = null; // stanje izbrane stopnje
  let p = null; // uganka
  let buf = "";
  let msg = "";
  let sure = false;
  let busy = false;
  let base = 0, t0 = 0, timer = null;
  let result = null; // { solved, time, total, hints, wrong, board, answer }
  let alive = true;

  const elapsed = () => base + (performance.now() - t0);
  const stopClock = () => (clearInterval(timer), (timer = null));
  const err = (e) => ctx.toast?.(e?.status === 409 ? t("dz.used") : e?.message || String(e), "x");

  async function load() {
    stopClock();
    buf = msg = "";
    sure = false;
    result = null;
    root.innerHTML = `<div class="gm-dz"><p class="muted">${esc(t("common.loading"))}</p></div>`;
    try {
      info = await api(`/api/students/${sid}/daily?level=${level}`);
    } catch (e) {
      if (!alive) return;
      root.innerHTML = `<div class="gm-dz">${bar()}<p class="muted">${esc(e?.message || t("off.noConnection"))}</p></div>`;
      return;
    }
    if (!alive) return;
    st = info.status[level];
    p = puzzleFor(info.day, level);
    if (st.done) result = { solved: st.solved, time: st.time, total: st.total, hints: st.hints, wrong: st.wrong, board: info.board };
    else if (st.started) begin(st.elapsed);
    ctx.onChange?.(info);
    render();
  }

  function begin(ms) {
    base = ms;
    t0 = performance.now();
    stopClock();
    timer = setInterval(tick, 200);
  }
  function tick() {
    const el = root.querySelector(".gm-dz-clock b");
    if (el) el.textContent = timeText(elapsed());
  }

  const bar = () => `<div class="gm-dz-bar">
      <button type="button" class="ghost back gm-dz-back" data-act="close">${icon("arrow-left")}<span>${esc(t("nav.games"))}</span></button>
      <h1>${icon("puzzle")}<span>${esc(t("dz.title"))}${info ? `<small class="gm-dz-date">${esc(dayText(info.day, ctx.lang))}</small>` : ""}</span></h1>
    </div>`;
  // Na telefonu ima pogled iger svoj »← Jaz«; med uganko je dovolj »← Igre«.
  const view = root.closest("#view-games");
  view?.classList.add("gm-dz-open");

  // Prikaz uganke: zaporedje, enačba z okvirčkom ali piramida opek. Števila ostanejo LTR.
  function showHtml() {
    const s = p.show;
    if (!s) return "";
    if (s.type === "seq") return `<div class="gm-dz-seq" dir="ltr">${s.items.map((x) => `<span>${esc(x)}</span>`).join("")}<span class="gm-dz-ask">?</span></div>`;
    if (s.type === "eq") return `<div class="gm-dz-eq" dir="ltr">${esc(s.text).replace(/□/g, `<span class="gm-dz-box" aria-label="?">${esc(buf) || "&nbsp;"}</span>`)}</div>`;
    return `<div class="gm-dz-pyr" dir="ltr">${s.rows
      .map((r, i) => `<div>${r.map((v, j) => (i === s.ask[0] && j === s.ask[1] ? `<span class="gm-dz-ask">${esc(buf) || "?"}</span>` : `<span class="${v == null ? "gm-dz-empty" : ""}">${v == null ? "" : esc(v)}</span>`)).join("")}</div>`)
      .join("")}</div>`;
  }

  const tx = (h) => esc(t(h.key, isoVars(h.vars)));
  // Številka koraka ostane na strani jezika (v arabščini desno), račun sam je LTR.
  const stepHtml = (s) => (typeof s === "string" ? `<li class="gm-dz-math"><span dir="ltr">${esc(s)}</span></li>` : `<li>${tx(s)}</li>`);
  const ans = () => String(p.answer).replace("-", MINUS);

  function boardHtml(b) {
    if (!b?.top?.length) return `<p class="muted">${esc(t("dz.boardEmpty"))}</p>`;
    const me = b.top.some((r) => r.me);
    return `<ol class="gm-dz-board">${b.top
      .map((r) => `<li class="${r.me ? "me" : ""}"><span class="gm-dz-rank">${r.rank}</span>${avatarSvg(r.avatar || DEFAULT_AVATAR, { size: 32 })}<span class="gm-dz-nick">${esc(r.nickname)}${r.me ? ` <em>${esc(t("dz.you"))}</em>` : ""}</span><b dir="ltr">${esc(timeText(r.total))}</b></li>`)
      .join("")}${!me && b.rank ? `<li class="me gm-dz-mine"><span class="gm-dz-rank">${b.rank}</span><span class="gm-dz-nick"><em>${esc(t("dz.you"))}</em></span><b dir="ltr">${esc(timeText(b.total))}</b></li>` : ""}</ol>`;
  }

  function render() {
    if (!alive) return;
    const head = `${bar()}${levelSeg(level, info.status, t, ctx.suggested)}`;
    const rules = `<p class="muted gm-dz-rules">${esc(t("dz.rules", { h: sec(HINT_MS), w: sec(WRONG_MS) }))}</p>`;
    let body;
    if (result) {
      const r = result;
      buf = ans(); // rešitev v okvirčku ali na mestu »?« v razlagi
      const pen = (r.hints || 0) * HINT_MS + (r.wrong || 0) * WRONG_MS;
      const streak = info.streak?.days || 0;
      body = `<div class="card gm-dz-res ${r.solved ? "ok" : "no"}">
          <div class="gm-dz-big">${r.solved ? icon("trophy") : icon("flag")}<span>${esc(r.solved ? t("dz.solved") : t("dz.gaveUp", { a: iso(ans()) }))}</span></div>
          ${r.solved ? `<p class="gm-dz-time"><span>${esc(t("dz.time"))}</span> <b dir="ltr">${esc(timeText(r.total))}</b>${pen ? ` <small dir="ltr">(${esc(timeText(r.time))}, ${esc(t("dz.penalty", { s: sec(pen) }))})</small>` : ""}</p>` : ""}
          ${r.solved && r.board?.rank ? `<p class="gm-dz-place">${esc(t("dz.place", { rank: r.board.rank, n: r.board.solvers }))}</p>` : ""}
          ${streak ? `<p class="gm-dz-streak">${icon("flame")}${esc(t("dz.streak", { n: streak }))}</p>` : ""}
          <p class="muted">${esc(t("dz.used"))}</p>
        </div>
        <div class="card gm-dz-how"><h2>${icon("lightbulb")} ${esc(t("dz.how"))}</h2>
          <p class="gm-dz-q">${tx(p.q)}</p>${showHtml()}
          <p>${esc(t(`dz.x.${p.x}`))}</p>
          <ol class="gm-dz-steps">${p.steps.map(stepHtml).join("")}</ol>
          <p class="gm-dz-ans"><b>${esc(t("dz.gaveUp", { a: iso(ans()) }))}</b></p>
        </div>
        <div class="card gm-dz-lb"><h2>${icon("trophy")} ${esc(t("dz.board"))}</h2>${boardHtml(r.board)}</div>`;
    } else if (!st?.started) {
      body = `<div class="card gm-dz-intro">
          <span class="gm-dz-ic big" aria-hidden="true">${icon("puzzle")}</span>
          <p>${esc(t("dz.sub"))}</p>${rules}
          <button type="button" class="primary big" data-act="start">${icon("play")}${esc(t("dz.start"))}</button>
        </div>`;
    } else {
      const used = st.hints;
      const pen = used * HINT_MS + st.wrong * WRONG_MS;
      const box = p.show && p.show.type !== "seq";
      body = `<div class="card gm-dz-play">
          <div class="gm-dz-meta"><span class="gm-dz-clock">${icon("timer")}<b dir="ltr">${esc(timeText(elapsed()))}</b></span>${pen ? `<span class="gm-dz-pen" dir="ltr">+${sec(pen)} s</span>` : ""}</div>
          <p class="gm-dz-q">${tx(p.q)}</p>
          ${showHtml()}
          ${box ? `<span class="sr-only" aria-live="polite">${esc(t("games.yourAnswer"))}: ${esc(buf)}</span>` : `<div class="gm-dz-input" dir="ltr" aria-live="polite"><span class="sr-only">${esc(t("games.yourAnswer"))}: </span>${esc(buf) || "&nbsp;"}</div>`}
          <p class="gm-dz-msg" role="status">${esc(msg)}</p>
          ${used ? `<ul class="gm-dz-hints">${p.hints.slice(0, used).map((h, i) => `<li><b>${esc(t("dz.hintN", { n: i + 1 }))}:</b> ${tx(h)}</li>`).join("")}</ul>` : ""}
          <div class="gm-dz-acts">
            <button type="button" class="secondary" data-act="hint" ${used >= MAX_HINTS ? "disabled" : ""}>${icon("lightbulb")}${esc(t("dz.hintBtn", { s: sec(HINT_MS) }))}</button>
            <button type="button" class="ghost" data-act="giveup">${icon("flag")}${esc(sure ? t("dz.giveUpSure") : t("dz.giveUp"))}</button>
          </div>
          <div class="gm-ui gm-dz-pad"><div class="gm-pad" dir="ltr">${pad()}</div></div>
        </div>`;
    }
    // Kdor uporablja tipkovnico (Tab), po izrisu ostane na istem gumbu (tipka, Namig, stopnja), ne skoči na vrh.
    // Po kliku z miško ali dotiku ne: takrat mora Enter s tipkovnice potrditi odgovor.
    const f = document.activeElement;
    const keep = f && root.contains(f) && f.matches(":focus-visible") ? ["k", "act", "lv"].map((a) => (f.dataset?.[a] ? `[data-${a}="${CSS.escape(f.dataset[a])}"]` : "")).find(Boolean) : "";
    root.innerHTML = `<div class="gm-dz">${head}${body}</div>`;
    if (keep) {
      const el = root.querySelector(keep);
      (el && !el.disabled ? el : root.querySelector(".gm-dz-pad .gm-key"))?.focus({ preventScroll: true }); // zadnji namig: gumb je onemogočen
    }
  }

  // Številčnica kot v igri »Računanje na pamet« (produce.js): števke, minus, brisanje, potrditev.
  function pad() {
    let h = "";
    const extra = [["Backspace", icon("delete"), t("games.e.typed.erase"), "gm-key-del gm-span2"], ["-", MINUS, t("games.e.typed.neg"), "gm-key-op"]];
    [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"]].forEach((ds, r) => {
      h += ds.map((d) => keyBtn(d, d, "")).join("");
      if (r === 0) h += keyBtn(...extra[0]);
      if (r === 2) h += keyBtn(...extra[1]);
    });
    h += keyBtn("0", "0", "", "gm-wide") + keyBtn("Enter", esc(t("dz.check")), t("dz.check"), "gm-key-ok gm-wide");
    return h;
  }

  function type(k) {
    if (!st?.started || st.done || result || busy) return;
    if (k === "Enter") return submit();
    if (k === "Backspace") buf = buf.slice(0, -1);
    else if (k === "-" || k === MINUS) buf = buf.startsWith(MINUS) ? buf.slice(1) : MINUS + buf;
    else if (/^\d$/.test(k) && buf.replace(MINUS, "").length < 9) buf += k;
    else return;
    msg = "";
    render();
  }

  async function act(fn) {
    if (busy) return;
    busy = true;
    try {
      await fn();
    } catch (e) {
      err(e);
      if (e?.status === 409) return load();
    } finally {
      busy = false;
    }
  }

  const post = (path, body) => api(`/api/students/${sid}/daily/${path}`, { method: "POST", body: JSON.stringify({ level, ...body }) });

  async function submit() {
    if (!buf || buf === MINUS) return;
    const local = checkAnswer(p, buf);
    if (local === null) return;
    const shown = buf;
    await act(async () => {
      const r = await post("answer", { day: info.day, answer: buf.replace(MINUS, "-"), ms: Math.round(elapsed()) });
      if (!r.correct) {
        st.wrong = r.wrong;
        buf = "";
        msg = t("dz.wrong", { a: iso(shown), s: sec(WRONG_MS) });
        return render();
      }
      stopClock();
      result = { solved: true, time: r.time, total: r.total, hints: r.hints, wrong: r.wrong, board: r.board };
      st = { ...st, done: true, solved: true, total: r.total };
      info.status[level] = st;
      info.streak = r.streak;
      ctx.onChange?.(info);
      render();
    });
  }

  function onClick(ev) {
    const b = ev.target.closest("button");
    if (!b || !root.contains(b)) return;
    if (b.dataset.k) return type(b.dataset.k);
    if (b.dataset.lv && b.dataset.lv !== level) {
      level = b.dataset.lv;
      saveLevel(level);
      ctx.onLevel?.(level);
      return load();
    }
    const a = b.dataset.act;
    if (a === "close") return ctx.onClose();
    if (a === "start")
      return act(async () => {
        const r = await post("start", {});
        st = r;
        info.status[level] = r;
        if (r.done) return load();
        begin(r.elapsed || 0);
        ctx.onChange?.(info);
        render();
        root.querySelector(".gm-dz-pad .gm-key")?.focus({ preventScroll: true });
      });
    if (a === "hint")
      return act(async () => {
        const r = await post("hint", { day: info.day }); // po polnoči (UTC) velja še včerajšnja uganka
        st.hints = r.hints;
        render();
      });
    if (a === "giveup") {
      if (!sure) {
        sure = true;
        return render();
      }
      return act(async () => {
        const r = await post("giveup", { day: info.day });
        stopClock();
        st = { ...st, done: true, solved: false };
        info.status[level] = st;
        info.streak = r.streak;
        result = { solved: false, board: r.board };
        ctx.onChange?.(info);
        render();
      });
    }
  }
  // Tipkovnica: števke, minus, Backspace, Enter (ne med pisanjem v drugo polje).
  function onKey(e) {
    if (!root.isConnected || e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.("input, textarea, [contenteditable]")) return;
    if (/^\d$/.test(e.key) || ["-", "Backspace"].includes(e.key) || (e.key === "Enter" && !e.target.closest?.("button"))) {
      if (!st?.started || st.done || result) return;
      e.preventDefault();
      // Kdor tipka števke, ne ostane na gumbu (tipka, Namig): sicer bi Enter pritisnil gumb namesto potrditve.
      if (e.key !== "Enter" && e.target.closest?.("button") && root.contains(e.target)) e.target.blur();
      type(e.key);
    }
  }
  root.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  load();
  return {
    destroy() {
      alive = false;
      view?.classList.remove("gm-dz-open");
      stopClock();
      root.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    },
  };
}
