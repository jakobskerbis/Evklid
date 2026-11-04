// Verjetnost: normalna, binomska, Poissonova, Studentova t in hi-kvadrat porazdelitev
// z grafom in osenčeno verjetnostjo. Računanje je v probcore.js.
import { esc, texHtml, remember } from "./tools-kit.js";
import { readNumber } from "./toolscore.js";
import { normal, binomial, poisson, geometric, hypergeometric, studentT, chi2, probability } from "./probcore.js";

const DISTS = {
  normal: { params: [["mu", "\\mu", "0"], ["sigma", "\\sigma", "1"]], make: (p) => (p.sigma > 0 ? normal(p.mu, p.sigma) : null), tex: (p) => `N(${p.mu}, ${p.sigma}^2)` },
  binom: { params: [["n", "n", "10"], ["p", "p", "0,5"]], make: (p) => (Number.isInteger(p.n) && p.n >= 0 && p.n <= 100000 && p.p >= 0 && p.p <= 1 ? binomial(p.n, p.p) : null), tex: (p) => `B(${p.n}, ${p.p})` },
  poisson: { params: [["lambda", "\\lambda", "3"]], make: (p) => (p.lambda > 0 ? poisson(p.lambda) : null), tex: (p) => `\\mathrm{Po}(${p.lambda})` },
  geom: { params: [["p", "p", "0,2"]], make: (p) => (p.p > 0 && p.p <= 1 ? geometric(p.p) : null), tex: (p) => `\\mathrm{Geo}(${p.p})` },
  hyper: {
    params: [["N", "N", "20"], ["K", "K", "7"], ["n", "n", "5"]],
    make: (p) => (Number.isInteger(p.N) && Number.isInteger(p.K) && Number.isInteger(p.n) && p.N >= 1 && p.N <= 100000 && p.K >= 0 && p.K <= p.N && p.n >= 0 && p.n <= p.N ? hypergeometric(p.N, p.K, p.n) : null),
    tex: (p) => `H(${p.N}, ${p.K}, ${p.n})`,
  },
  t: { params: [["nu", "\\nu", "10"]], make: (p) => (p.nu > 0 ? studentT(p.nu) : null), tex: (p) => `t_{${p.nu}}` },
  chi2: { params: [["k", "k", "5"]], make: (p) => (p.k > 0 ? chi2(p.k) : null), tex: (p) => `\\chi^2_{${p.k}}` },
};
const KINDS = ["le", "ge", "between", "eq", "inv"];

/** ctx: { t, icon, num(v), card(html), err(msg), insertBtn(v) } */
export function probTool(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.prob", { d: "normal", p: {}, kind: "between", a: "-1", b: "1", q: "0,95" });
  el.innerHTML = `<div class="chip-row tl-sub" role="tablist">${Object.keys(DISTS).map((k) => `<button type="button" role="tab" data-d="${k}">${esc(t(`sc.prob.${k}`))}</button>`).join("")}</div>
    <div class="card tl-card"><div class="tl-grid2 tl-pp"></div>
      <label class="tl-field"><span>${esc(t("sc.prob.ask"))}</span><select class="tl-pk"></select></label>
      <div class="tl-grid2 tl-pab"></div></div>
    <div class="tl-out" aria-live="polite"></div>`;
  const pp = el.querySelector(".tl-pp");
  const pab = el.querySelector(".tl-pab");
  const sel = el.querySelector(".tl-pk");
  const fld = (cls, tex, v) => `<label class="tl-field"><span>${texHtml(tex)}</span><input class="${cls}" inputmode="decimal" autocomplete="off" value="${esc(v)}"></label>`;

  function draw() {
    const D = DISTS[st.d];
    el.querySelectorAll(".tl-sub [data-d]").forEach((b) => {
      b.classList.toggle("active", b.dataset.d === st.d);
      b.setAttribute("aria-selected", String(b.dataset.d === st.d));
    });
    st.p[st.d] ||= {};
    pp.innerHTML = D.params.map(([k, tex, def]) => fld(`tl-pv" data-k="${k}`, tex, st.p[st.d][k] ?? def)).join("");
    const disc = ["binom", "poisson", "geom", "hyper"].includes(st.d);
    const kinds = KINDS.filter((k) => (disc ? k !== "inv" : k !== "eq"));
    if (!kinds.includes(st.kind)) st.kind = "between";
    sel.innerHTML = kinds.map((k) => `<option value="${k}"${k === st.kind ? " selected" : ""}>${esc(t(`sc.prob.k.${k}`))}</option>`).join("");
    fields();
  }
  function fields() {
    pab.innerHTML = st.kind === "inv" ? fld("tl-pq", "p", st.q) : fld("tl-pa", st.kind === "eq" ? "k" : "a", st.a) + (st.kind === "between" ? fld("tl-pb", "b", st.b) : "");
    run();
  }
  function run() {
    const D = DISTS[st.d];
    const par = {};
    el.querySelectorAll(".tl-pv").forEach((x) => {
      st.p[st.d][x.dataset.k] = x.value;
      par[x.dataset.k] = readNumber(x.value);
    });
    st.kind = sel.value;
    const a = el.querySelector(".tl-pa");
    const b = el.querySelector(".tl-pb");
    const q = el.querySelector(".tl-pq");
    if (a) st.a = a.value;
    if (b) st.b = b.value;
    if (q) st.q = q.value;
    remember.set("evklid.tool.prob", st);
    const out = el.querySelector(".tl-out");
    const d = Object.values(par).every(Number.isFinite) ? D.make(par) : null;
    if (!d) return (out.innerHTML = err(t("sc.prob.badParams")));
    const X = `X \\sim ${D.tex(Object.fromEntries(Object.entries(par).map(([k, v]) => [k, num(v).tex])))}`;
    const meanRow = `<p class="muted tl-note">${texHtml(`${X},\\quad E(X) = ${num(d.mean).tex},\\quad \\sigma = ${num(d.sd).tex}`)}</p>`;
    let res;
    let shade;
    if (st.kind === "inv") {
      const p = readNumber(st.q);
      if (!(p > 0 && p < 1)) return (out.innerHTML = err(t("sc.prob.badP")));
      const x = d.inv(p);
      res = `<div class="tl-row"><span class="tl-v">${texHtml(`P(X \\le x) = ${num(p).tex} \\Rightarrow x = ${num(x).tex}`)}</span>${insertBtn(x)}</div>`;
      shade = [-Infinity, x];
    } else {
      const av = readNumber(st.a);
      const bv = readNumber(st.b);
      if (!Number.isFinite(av) || (st.kind === "between" && !Number.isFinite(bv))) return (out.innerHTML = err(t("sc.prob.badBounds")));
      const lo = Math.min(av, bv);
      const hi = Math.max(av, bv);
      const P = probability(d, st.kind, st.kind === "between" ? lo : av, hi);
      const ev = { le: `X \\le ${num(av).tex}`, ge: `X \\ge ${num(av).tex}`, eq: `X = ${num(av).tex}`, between: `${num(lo).tex} \\le X \\le ${num(hi).tex}` }[st.kind];
      res = `<div class="tl-row"><span class="tl-v">${texHtml(`P(${ev}) = ${num(P).tex}`)}</span>${insertBtn(P)}</div><p class="muted tl-note">${texHtml(`= ${num(P * 100).tex}\\ \\%`)}</p>`;
      shade = st.kind === "le" ? [-Infinity, av] : st.kind === "ge" ? [av, Infinity] : st.kind === "eq" ? [av, av] : [lo, hi];
    }
    out.innerHTML = card(res + meanRow + chart(d, shade));
  }
  function chart(d, [s0, s1]) {
    const W = 320;
    const H = 150;
    const pad = 22;
    let [x0, x1] = d.range;
    if (Number.isFinite(s0)) x0 = Math.min(x0, s0);
    if (Number.isFinite(s1)) x1 = Math.max(x1, s1);
    if (d.discrete) {
      x0 = Math.max(0, Math.floor(x0));
      // pri velikem n pokažemo le smiselni del
      x0 = Math.max(x0, Math.floor(d.mean - 5 * d.sd - 1));
      x1 = Math.min(Math.ceil(x1), Math.ceil(d.mean + 5 * d.sd + 1));
    }
    const sx = (x) => pad + ((x - x0) / (x1 - x0 || 1)) * (W - 2 * pad);
    let ymax = 0;
    const pts = [];
    if (d.discrete) {
      for (let k = x0; k <= x1; k++) {
        const y = d.pdf(k);
        ymax = Math.max(ymax, y);
        pts.push([k, y]);
      }
    } else {
      for (let i = 0; i <= 200; i++) {
        const x = x0 + ((x1 - x0) * i) / 200;
        const y = d.pdf(x);
        if (Number.isFinite(y)) ymax = Math.max(ymax, y);
        pts.push([x, y]);
      }
    }
    ymax = Math.min(ymax || 1, d.discrete ? 1 : 3 * (d.pdf(d.mean) || ymax));
    const sy = (y) => H - pad - (Math.min(y, ymax) / ymax) * (H - 2 * pad);
    const inS = (x) => x >= s0 - 1e-9 && x <= s1 + 1e-9;
    let body = "";
    if (d.discrete) {
      const bw = Math.max(1, ((W - 2 * pad) / (x1 - x0 + 1)) * 0.8);
      body = pts.map(([k, y]) => `<rect x="${(sx(k) - bw / 2).toFixed(1)}" y="${sy(y).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - pad - sy(y)).toFixed(1)}" class="${inS(k) ? "pr-on" : "pr-off"}"/>`).join("");
    } else {
      const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("");
      const sh = pts.filter(([x]) => inS(x));
      const area = sh.length ? `M${sx(sh[0][0]).toFixed(1)},${H - pad}` + sh.map(([x, y]) => `L${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("") + `L${sx(sh[sh.length - 1][0]).toFixed(1)},${H - pad}Z` : "";
      body = `${area ? `<path d="${area}" class="pr-area"/>` : ""}<path d="${line}" class="pr-line"/>`;
    }
    const ticks = niceTicks(x0, x1, 6).map((x) => `<text x="${sx(x).toFixed(1)}" y="${H - 6}" class="pr-t">${esc(num(x).text)}</text>`).join("");
    return `<svg class="pr-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("sc.prob.chart"))}"><line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" class="pr-ax"/>${body}${ticks}</svg>`;
  }
  el.querySelector(".tl-sub").addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    st.d = b.dataset.d;
    draw();
  });
  sel.addEventListener("change", () => {
    st.kind = sel.value;
    fields();
  });
  el.querySelector(".tl-card").addEventListener("input", run);
  draw();
}

function niceTicks(a, b, n) {
  const span = b - a || 1;
  const raw = span / n;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((k) => k * p).find((s) => s >= raw) || p * 10;
  const out = [];
  for (let x = Math.ceil(a / step) * step; x <= b + 1e-9; x += step) out.push(Math.abs(x) < 1e-12 ? 0 : Number(x.toPrecision(10)));
  return out;
}
