// Orodje Poskusi (Casio fx-991CW): met kocke in kovanca z relativnimi frekvencami, številska premica
// za neenačbe in preverjanje enakosti/neenakosti (Drži / Ne drži). Računanje: trialscore.js.
import { esc, texHtml, remember } from "./tools-kit.js";
import { configureKeyboard } from "../tipkovnica.js";
import { intervalsTex } from "./scisolve.js";
import { diceDist, coinDist, roll, verify, solutionSet, intersect } from "./trialscore.js";

const KEY = "evklid.tool.trials";
const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const MAX_N = 100000;

export function trialsTool(el, ctx) {
  const { t, icon, num, card, err, comma } = ctx;
  const obj = (x) => x && typeof x === "object" && !Array.isArray(x);
  const saved = remember.get(KEY, null);
  const st = obj(saved) ? saved : {};
  st.mode = ["dice", "coin", "line", "verify"].includes(st.mode) ? st.mode : "dice";
  // pokvarjen ali star zapis v localStorage: vsak del posebej nazaj na privzeto
  for (const [m, max] of [["dice", 3], ["coin", 5]]) {
    const s = obj(st[m]) ? st[m] : {};
    st[m] = {
      k: Number.isInteger(s.k) && s.k >= 1 && s.k <= max ? s.k : 1,
      n: typeof s.n === "string" || typeof s.n === "number" ? String(s.n) : "100",
      counts: obj(s.counts) ? s.counts : {},
      last: Array.isArray(s.last) ? s.last : [],
    };
  }
  st.line = Array.isArray(st.line) ? st.line.slice(0, 3).map((v) => (typeof v === "string" ? v : "")) : ["x > -2", "x ≤ 3", ""];
  while (st.line.length < 3) st.line.push("");
  st.check = typeof st.check === "string" ? st.check : "√8 = 2√2";
  const save = () => remember.set(KEY, st);
  const MODES = [
    ["dice", "sc.tr.dice"],
    ["coin", "sc.tr.coin"],
    ["line", "sc.tr.line"],
    ["verify", "sc.tr.verify"],
  ];
  el.innerHTML = `<div class="seg tl-seg tl-sseg" role="tablist">${MODES.map(([k, key]) => `<button type="button" role="tab" data-tm="${k}">${esc(t(key))}</button>`).join("")}</div><div class="tl-tbody"></div><div class="tl-out" aria-live="polite"></div>`;
  const body = el.querySelector(".tl-tbody");
  const out = el.querySelector(".tl-out");
  const kb = (inp) => configureKeyboard(inp, { math: true, parsed: true, layers: ["num", "fx", "sym", "abc"], start: "num", enter: "go", ctx: [["x", "x"], ["<", "<"], [">", ">"], ["≤", "≤"], ["≥", "≥"], ["=", "="], ["≠", "≠"]] });

  function draw() {
    el.querySelectorAll("[data-tm]").forEach((b) => {
      b.classList.toggle("active", b.dataset.tm === st.mode);
      b.setAttribute("aria-selected", String(b.dataset.tm === st.mode));
    });
    if (st.mode === "dice" || st.mode === "coin") {
      const s = st[st.mode];
      const max = st.mode === "dice" ? 3 : 5;
      body.innerHTML = card(`<div class="tl-grid2">
          <label class="tl-field"><span>${esc(t(st.mode === "dice" ? "sc.tr.nDice" : "sc.tr.nCoins"))}</span><select class="tl-tk">${Array.from({ length: max }, (_, i) => `<option${i + 1 === s.k ? " selected" : ""}>${i + 1}</option>`).join("")}</select></label>
          <label class="tl-field"><span>${esc(t("sc.tr.throws"))}</span><input class="tl-tn" inputmode="numeric" autocomplete="off" value="${esc(s.n)}"></label>
        </div>
        <div class="chip-row tl-tacts"><button type="button" class="primary" data-ta="roll">${esc(t("sc.tr.roll"))}</button><button type="button" data-ta="reset">${esc(t("sc.tr.reset"))}</button></div>`);
      body.querySelector(".tl-tn").setAttribute("enterkeyhint", "go");
      configureKeyboard(body.querySelector(".tl-tn"), { layers: ["num"], start: "num", enter: "go", enterText: t("sc.tr.roll") });
    } else if (st.mode === "line") {
      body.innerHTML = card(`${st.line.map((v, i) => `<label class="tl-field"><span>${esc(t("sc.tr.cond", { n: i + 1 }))}</span><input class="tl-tl" data-i="${i}" autocomplete="off" spellcheck="false" value="${esc(v)}"></label>`).join("")}<p class="muted tl-note">${esc(t("sc.tr.lineHint"))}</p>`);
      body.querySelectorAll(".tl-tl").forEach(kb);
    } else {
      body.innerHTML = card(`<label class="tl-field"><span>${esc(t("sc.tr.claim"))}</span><input class="tl-tv" autocomplete="off" spellcheck="false" value="${esc(st.check)}"></label><p class="muted tl-note">${esc(t("sc.tr.verifyHint"))}</p>`);
      kb(body.querySelector(".tl-tv"));
    }
    run();
  }

  function run() {
    if (st.mode === "dice" || st.mode === "coin") return showThrows();
    if (st.mode === "line") return showLine();
    const r = verify(st.check, { comma: comma() });
    if (!r) return (out.innerHTML = "");
    if (r.error) return (out.innerHTML = err(t(r.error === "unknowns" ? "sc.tr.verifyVars" : r.error === "notCmp" ? "sc.tr.verifyCmp" : "gc.errSyntax")));
    out.innerHTML = card(`<div class="tl-mx-line">${texHtml(r.tex)}</div><p class="tl-verdict ${r.value ? "ok" : "no"}">${icon(r.value ? "circle-check" : "circle-x")}<span>${esc(t(r.value ? "sc.tr.true" : "sc.tr.false"))}</span></p>`);
  }

  // risba čez vso širino kartice (brez praznega roba na računalniku), v enotah zaslona
  const svgWidth = () => Math.max(300, Math.min(1400, Math.round((out.clientWidth || el.clientWidth || 360) - 32)));

  // ---- kocka in kovanec ----
  function showThrows() {
    const s = st[st.mode];
    const dist = st.mode === "dice" ? diceDist(s.k) : coinDist(s.k);
    const total = Object.values(s.counts).reduce((a, b) => a + b, 0);
    const label = (x) => (st.mode === "coin" && s.k === 1 ? t(x ? "sc.tr.head" : "sc.tr.tail") : String(x));
    const lastTxt = s.last?.length
      ? st.mode === "dice"
        ? `<span class="tl-lastv"><span class="tl-faces" aria-hidden="true">${s.last.map((f) => FACES[f - 1]).join(" ")}</span><span>${esc(s.last.join(" + "))}${s.k > 1 ? ` = ${s.last.reduce((a, b) => a + b, 0)}` : ""}</span></span>`
        : `<span class="tl-lastv">${esc(s.last.map((x) => t(x ? "sc.tr.head" : "sc.tr.tail")).join(", "))}</span>`
      : "";
    const head = st.mode === "dice" ? (s.k > 1 ? t("sc.tr.sum") : t("sc.tr.dots")) : s.k > 1 ? t("sc.tr.heads") : t("sc.tr.outcome");
    const rows = dist
      .map(({ x, p }) => {
        const f = s.counts[x] || 0;
        return `<tr><th scope="row">${esc(label(x))}</th><td>${f}</td><td>${total ? esc(num(Math.round((f / total) * 1e4) / 1e4).text) : "—"}</td><td>${esc(num(Math.round(p * 1e4) / 1e4).text)}</td></tr>`;
      })
      .join("");
    out.innerHTML =
      (total
        ? card(`<div class="tl-row"><span class="tl-k">${esc(t("sc.tr.total", { n: total }))}</span></div>${lastTxt ? `<div class="tl-row tl-last"><span class="tl-k">${esc(t("sc.tr.last"))}</span>${lastTxt}</div>` : ""}`)
        : "") +
      card(`${chart(dist, s.counts, total, label)}<div class="tl-vt-wrap"><table class="tl-vt"><thead><tr><th>${esc(head)}</th><th>${esc(t("sc.tr.f"))}</th><th>${esc(t("sc.tr.rel"))}</th><th>${esc(t("sc.tr.p"))}</th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted tl-note">${esc(t("sc.tr.lawHint"))}</p>`);
  }

  // stolpci: relativne frekvence; črtice: verjetnosti
  function chart(dist, counts, total, label) {
    const W = svgWidth();
    const H = 170;
    const pad = 22;
    const n = dist.length;
    const bw = (W - 2 * pad) / n;
    const ymax = Math.max(...dist.map((d) => d.p), ...(total ? dist.map((d) => (counts[d.x] || 0) / total) : [0])) * 1.1 || 1;
    const sy = (y) => H - pad - (y / ymax) * (H - 2 * pad);
    const bars = dist
      .map((d, i) => {
        const x = pad + i * bw;
        const rf = total ? (counts[d.x] || 0) / total : 0;
        return `${total ? `<rect x="${(x + bw * 0.12).toFixed(1)}" y="${sy(rf).toFixed(1)}" width="${(bw * 0.76).toFixed(1)}" height="${(H - pad - sy(rf)).toFixed(1)}" class="pr-on"/>` : ""}<line x1="${(x + bw * 0.04).toFixed(1)}" x2="${(x + bw * 0.96).toFixed(1)}" y1="${sy(d.p).toFixed(1)}" y2="${sy(d.p).toFixed(1)}" class="tl-tp"/>${n <= 16 ? `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 6}" class="pr-t">${esc(label(d.x))}</text>` : ""}`;
      })
      .join("");
    return `<figure class="tl-pchart tl-tchart"><svg class="pr-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("sc.tr.chart"))}"><line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" class="pr-ax"/>${bars}</svg><figcaption class="muted tl-note tl-legend"><span><i class="tl-lg-bar"></i>${esc(t("sc.tr.rel"))}</span><span><i class="tl-lg-p"></i>${esc(t("sc.tr.p"))}</span></figcaption></figure>`;
  }

  // ---- številska premica ----
  function showLine() {
    const sets = st.line.map((v) => solutionSet(v, { comma: comma() }));
    const ok = sets.map((s, i) => ({ s, i })).filter(({ s }) => s && !s.error);
    const bad = sets.findIndex((s) => s?.error);
    if (!ok.length) return (out.innerHTML = bad >= 0 ? err(t("sc.tr.lineBad")) : "");
    const sameVar = ok.every(({ s }) => s.v === ok[0].s.v) && ok.every(({ s }) => !s.period);
    const both = ok.length > 1 && sameVar ? ok.slice(1).reduce((acc, { s }) => intersect(acc, s.intervals), ok[0].s.intervals) : null;
    const tracks = [...ok.map(({ s, i }) => ({ I: s.intervals, cls: `c${i}`, label: String(i + 1) })), ...(both ? [{ I: both, cls: "all", label: "∩" }] : [])];
    const lines = ok
      .map(({ s, i }) => `<div class="tl-row"><span class="tl-tn-dot c${i}" aria-hidden="true">${i + 1}</span><span class="tl-v">${texHtml(intervalsTex({ v: s.v, intervals: s.intervals }, comma()))}${s.period ? ` <span class="muted">${esc(t("sc.tr.onePeriod"))}</span>` : ""}</span></div>`)
      .join("");
    out.innerHTML =
      card(numberLine(tracks) + lines + (both ? `<div class="tl-h">${esc(t("sc.tr.both"))}</div><div class="tl-row"><span class="tl-tn-dot all" aria-hidden="true">∩</span><span class="tl-v">${texHtml(intervalsTex({ v: ok[0].s.v, intervals: both }, comma()))}</span></div>` : "")) +
      (bad >= 0 ? err(`${t("sc.tr.cond", { n: bad + 1 })}: ${t("sc.tr.lineBad")}`) : "");
  }

  function numberLine(tracks) {
    const ends = tracks.flatMap((tr) => tr.I.flatMap((i) => [i.lo, i.hi])).filter(Number.isFinite);
    let a = ends.length ? Math.min(...ends) : -5;
    let b = ends.length ? Math.max(...ends) : 5;
    if (b - a < 4) {
      const m = (a + b) / 2;
      a = m - 2;
      b = m + 2;
    }
    const span = b - a;
    a -= span * 0.2;
    b += span * 0.2;
    const W = svgWidth();
    const pad = 14;
    const padL = 30; // levo številka pogoja, da sled ni označena le z barvo
    const rowH = 22;
    const H = tracks.length * rowH + 34;
    const sx = (x) => padL + ((Math.max(a, Math.min(b, x)) - a) / (b - a)) * (W - padL - pad);
    const axisY = H - 22;
    // oznake: »lepi« koraki in vsa krajišča
    const raw = span / 5;
    const p = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((k) => k * p).find((s) => s >= raw) || p * 10;
    const ticks = [];
    for (let x = Math.ceil(a / step) * step; x <= b + 1e-9; x += step) ticks.push(Number(x.toPrecision(10)));
    const tickSvg = ticks.map((x) => `<line x1="${sx(x).toFixed(1)}" x2="${sx(x).toFixed(1)}" y1="${axisY - 4}" y2="${axisY + 4}" class="pr-ax"/><text x="${sx(x).toFixed(1)}" y="${axisY + 16}" class="pr-t">${esc(num(x).text)}</text>`).join("");
    const trackSvg = tracks
      .map((tr, k) => {
        const y = 12 + k * rowH;
        const lab = `<text x="10" y="${y + 4}" class="tl-nl-lab ${tr.cls}">${esc(tr.label)}</text>`;
        return lab + tr.I.map((i) => {
          const x1 = sx(i.lo);
          const x2 = sx(i.hi);
          const seg = i.lo === i.hi ? "" : `<line x1="${x1.toFixed(1)}" x2="${x2.toFixed(1)}" y1="${y}" y2="${y}" class="tl-nl-seg ${tr.cls}"/>`;
          const arrow = (x, dir) => `<path d="M${(x + dir * 2).toFixed(1)},${y} l${-dir * 8},-5 v10 z" class="tl-nl-arr ${tr.cls}"/>`;
          const dot = (x, filled) => `<circle cx="${x.toFixed(1)}" cy="${y}" r="5" class="tl-nl-dot ${tr.cls}${filled ? " in" : ""}"/>`;
          return seg + (Number.isFinite(i.lo) ? dot(x1, i.loIn) : arrow(x1, -1)) + (i.lo === i.hi ? "" : Number.isFinite(i.hi) ? dot(x2, i.hiIn) : arrow(x2, 1));
        }).join("");
      })
      .join("");
    return `<svg class="pr-svg tl-nl" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("sc.tr.line"))}"><line x1="${padL - 6}" x2="${W - pad + 6}" y1="${axisY}" y2="${axisY}" class="pr-ax"/>${tickSvg}${trackSvg}</svg>`;
  }

  // ---- dogodki ----
  el.querySelector(".tl-sseg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tm]");
    if (!b) return;
    st.mode = b.dataset.tm;
    save();
    draw();
  });
  const doRoll = () => {
    const s = st[st.mode];
    const n = Math.round(Number(String(s.n).replace(/\s/g, "")));
    if (!Number.isFinite(n) || n < 1 || n > MAX_N) return (out.innerHTML = err(t("sc.tr.nBad", { max: "100\u00a0000" })));
    const r = roll(st.mode, s.k, Math.min(n, MAX_N));
    for (const [x, f] of Object.entries(r.counts)) s.counts[x] = (s.counts[x] || 0) + f;
    s.last = r.last;
    save();
    run();
  };
  body.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ta]");
    if (!b) return;
    const s = st[st.mode];
    if (b.dataset.ta === "roll") return doRoll();
    s.counts = {};
    s.last = [];
    save();
    run();
  });
  body.addEventListener("change", (e) => {
    if (!e.target.matches(".tl-tk")) return;
    const s = st[st.mode];
    s.k = Number(e.target.value);
    s.counts = {}; // drugo število kock: drugačni izidi
    s.last = [];
    save();
    run();
  });
  body.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches(".tl-tn")) {
      e.preventDefault();
      doRoll();
    }
  });
  body.addEventListener("input", (e) => {
    const x = e.target;
    if (x.matches(".tl-tn")) st[st.mode].n = x.value;
    else if (x.matches(".tl-tl")) st.line[Number(x.dataset.i)] = x.value;
    else if (x.matches(".tl-tv")) st.check = x.value;
    else return;
    save();
    if (!x.matches(".tl-tn")) run();
  });
  draw();
  let w0 = 0;
  return {
    resize() {
      const w = svgWidth();
      if (w !== w0 && st.mode !== "verify") run();
      w0 = w;
    },
  };
}
