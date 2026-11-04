// Orodja: statistični testi (z grafom p-ploščine), ANOVA, intervali zaupanja, finance (TVM, amortizacija,
// denarni tokovi), tabela vrednosti.
// Računanje je v testcore.js (brez DOM). ctx: { t, icon, num(v), card(html), err(msg), insertBtn(v), comma() }
import { esc, texHtml, remember } from "./tools-kit.js";
import { readNumber, readList } from "./toolscore.js";
import * as TC from "./testcore.js";

const KINDS = ["z1", "t1", "z2", "t2", "p1", "p2", "f2", "gof", "indep", "reg", "anova"];
const NO_ALT = ["gof", "indep", "anova"]; // le desni rep
const CI_KINDS = ["z1", "t1", "z2", "t2", "p1", "p2"];
const ALTS = [["ne", "\\ne"], ["lt", "<"], ["gt", ">"]];
const pct = (s) => {
  const v = readNumber(s);
  return v >= 1 ? v / 100 : v;
};
const rows = (text) =>
  String(text ?? "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => readList(l));

const ANOVA_DEF = "3 4 5 4\n6 7 6 8\n5 5 6 4";

// Graf porazdelitve testne statistike z obarvano p-ploščino (rep ali repa, ki dajo p).
export function pChart(r, alt, { t, num }) {
  const d = TC.statDist(r);
  if (!d || !Number.isFinite(r.stat)) return "";
  const s = r.stat;
  const sym = r.kind === "z" || r.kind === "t";
  let x0;
  let x1;
  if (sym) {
    x1 = Math.max(4, Math.min(Math.abs(s) + 0.6, 10));
    x0 = -x1;
  } else {
    x0 = 0;
    let q = 0.5;
    for (let i = 0; i < 4000 && d.cdf(q) < 0.995; i++) q += 0.05;
    x1 = Math.min(Math.max(q, s * 1.15), q * 3);
  }
  // obarvano: levi rep, desni rep ali oba (dvostranski: pri z, t simetrično, pri F rep na strani statistike)
  let inP;
  let two = null;
  if (alt === "lt") inP = (x) => x <= s;
  else if (alt === "gt") inP = (x) => x >= s;
  else if (sym) inP = (x) => Math.abs(x) >= Math.abs(s);
  else {
    // dvostranski F: oba repa z enako verjetnostjo (skupaj p), eden se začne pri statistiki
    const q = (pr) => {
      let lo = 0;
      let hi = Math.max(1, x1);
      while (d.cdf(hi) < pr && hi < 1e6) hi *= 2;
      for (let i = 0; i < 80; i++) {
        const m = (lo + hi) / 2;
        if (d.cdf(m) < pr) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    };
    const tail = Math.min(d.cdf(s), 1 - d.cdf(s));
    const xl = d.cdf(s) < 0.5 ? s : q(tail);
    const xu = d.cdf(s) < 0.5 ? q(1 - tail) : s;
    inP = (x) => x <= xl || x >= xu;
    two = [xl, xu];
  }
  const W = 320;
  const H = 150;
  const pad = 22;
  const n = 240;
  const sx = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
  const pts = [];
  let ymax = 0;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = d.pdf(x);
    pts.push([x, Number.isFinite(y) ? y : 0]);
    if (Number.isFinite(y) && i > 0) ymax = Math.max(ymax, y);
  }
  ymax ||= 1;
  const sy = (y) => H - pad - (Math.min(y, ymax) / ymax) * (H - 2 * pad - 4);
  const P = (x, y) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${P(x, y)}`).join("");
  // obarvani deli: zaporedne točke v p-območju (dodamo točko točno pri statistiki)
  let area = "";
  let run = [];
  const flush = () => {
    if (run.length > 1) area += `M${sx(run[0][0]).toFixed(1)},${H - pad}` + run.map(([x, y]) => `L${P(x, y)}`).join("") + `L${sx(run[run.length - 1][0]).toFixed(1)},${H - pad}Z`;
    run = [];
  };
  const edges = two || (sym && alt !== "lt" && alt !== "gt" ? [-Math.abs(s), Math.abs(s)] : [s]);
  const all = [...pts, ...edges.filter((x) => x > x0 && x < x1).map((x) => [x, d.pdf(x)])].sort((a, b) => a[0] - b[0]);
  for (const p of all) {
    if (inP(p[0]) || edges.some((e) => Math.abs(e - p[0]) < 1e-12)) run.push(p);
    else flush();
  }
  flush();
  const marks = edges
    .filter((x) => x >= x0 && x <= x1)
    .map((x) => `<line x1="${sx(x).toFixed(1)}" x2="${sx(x).toFixed(1)}" y1="${pad - 6}" y2="${H - pad}" class="pr-mark"/>`)
    .join("");
  const tx = sx(Math.min(Math.max(s, x0), x1));
  const label = `<text x="${Math.min(Math.max(tx, pad + 14), W - pad - 14).toFixed(1)}" y="${pad - 9}" class="pr-t">${esc(num(s).text)}</text>`;
  const axis = `<line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" class="pr-ax"/>`;
  const ticks = (sym ? [x0, x0 / 2, 0, x1 / 2, x1] : [0, x1 / 2, x1]).map((x) => `<text x="${sx(x).toFixed(1)}" y="${H - 6}" class="pr-t">${esc(num(Math.round(x * 100) / 100).text)}</text>`).join("");
  const sup = { "-": "⁻", "−": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const pText = num(r.p).text.replace(/\^\(?([-−]?\d+)\)?/, (m, e) => [...e].map((c) => sup[c]).join("")); // 10^-14 → 10⁻¹⁴
  return `<figure class="tl-pchart"><svg class="pr-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("sc.tt.pArea", { p: pText }))}">${axis}${area ? `<path d="${area}" class="pr-area"/>` : ""}<path d="${line}" class="pr-line"/>${marks}${label}${ticks}</svg><figcaption class="muted tl-note">${esc(t("sc.tt.pArea", { p: pText }))}</figcaption></figure>`;
}

export function testsTool(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.tests", { mode: "test", kind: "t1", alt: "ne", alpha: "0,05", level: "95", pooled: false, v: {}, src: {} });
  st.v ||= {};
  st.src ||= {};
  const DEF = { mu0: "0", x: "58", n: "100", p0: "0,5", x1: "45", n1: "100", x2: "30", n2: "100", am: "5,1", asd: "0,8", an: "16", bm: "4,6", bsd: "1", bn: "20" };
  const val = (k, d = DEF[k] ?? "") => st.v[k] ?? d;
  el.innerHTML = `<div class="seg tl-seg"><button type="button" data-mode="test">${esc(t("sc.tt.test"))}</button><button type="button" data-mode="ci">${esc(t("sc.tt.ci"))}</button></div>
    <div class="chip-row tl-sub tl-tk" role="tablist"></div>
    <div class="card tl-card tl-tf"></div><div class="tl-out" aria-live="polite"></div>`;
  const kinds = el.querySelector(".tl-tk");
  const form = el.querySelector(".tl-tf");
  const out = el.querySelector(".tl-out");
  const save = () => remember.set("evklid.tool.tests", st);
  const fld = (k, tex, d, mode = "decimal") => `<label class="tl-field"><span>${texHtml(tex)}</span><input class="tl-tv" data-k="${k}" inputmode="${mode}" autocomplete="off" value="${esc(d === undefined ? val(k) : val(k, d))}"></label>`;
  const sampleBlock = (p, title, sdTex) => {
    const src = st.src[p] || "sum";
    const head = title ? `<div class="tl-h">${esc(title)}</div>` : "";
    const pick = `<label class="tl-field"><span>${esc(t("sc.tt.input"))}</span><select class="tl-ts" data-p="${p}"><option value="sum"${src === "sum" ? " selected" : ""}>${esc(t("sc.tt.summary"))}</option><option value="data"${src === "data" ? " selected" : ""}>${esc(t("sc.tt.list"))}</option></select></label>`;
    const sd = fld(`${p}sd`, sdTex);
    if (src === "data") {
      const need = sdTex === "\\sigma" ? sd : "";
      return `${head}${pick}<label class="tl-field"><span>${esc(t("sc.data"))}</span><textarea class="tl-tv" data-k="${p}data" rows="2" inputmode="decimal" spellcheck="false">${esc(val(`${p}data`, "5 7 6 9 8 7"))}</textarea></label>${need}`;
    }
    return `${head}${pick}<div class="tl-grid2">${fld(`${p}m`, "\\bar{x}")}${sd}${fld(`${p}n`, "n")}</div>`;
  };
  const getSample = (p, sdTex) => {
    if ((st.src[p] || "sum") === "data") {
      const s = TC.sample(readList(val(`${p}data`, "5 7 6 9 8 7")));
      if (!s) return null;
      return sdTex === "\\sigma" ? { mean: s.mean, sigma: readNumber(val(`${p}sd`)), n: s.n } : s;
    }
    const mean = readNumber(val(`${p}m`));
    const n = readNumber(val(`${p}n`));
    const sd = readNumber(val(`${p}sd`));
    return sdTex === "\\sigma" ? { mean, sigma: sd, n } : { mean, s: sd, n };
  };

  function drawForm() {
    el.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("active", b.dataset.mode === st.mode));
    const list = st.mode === "ci" ? CI_KINDS : KINDS;
    if (!list.includes(st.kind)) st.kind = list[0];
    kinds.innerHTML = list.map((k) => `<button type="button" role="tab" data-kind="${k}" class="${k === st.kind ? "active" : ""}" aria-selected="${k === st.kind}">${esc(t(`sc.tt.k.${k}`))}</button>`).join("");
    const k = st.kind;
    const test = st.mode === "test";
    let h = "";
    if (k === "z1" || k === "t1") h = sampleBlock("a", "", k === "z1" ? "\\sigma" : "s") + (test ? fld("mu0", "\\mu_0") : "");
    else if (k === "z2" || k === "t2") {
      const sd = k === "z2" ? "\\sigma" : "s";
      h = sampleBlock("a", `${t("sc.tt.sample")} 1`, sd) + sampleBlock("b", `${t("sc.tt.sample")} 2`, sd);
      if (k === "t2") h += `<label class="tl-field tl-inline"><input type="checkbox" class="tl-tp"${st.pooled ? " checked" : ""}> <span>${esc(t("sc.tt.pooled"))}</span></label>`;
    } else if (k === "f2") h = sampleBlock("a", `${t("sc.tt.sample")} 1`, "s") + sampleBlock("b", `${t("sc.tt.sample")} 2`, "s");
    else if (k === "anova") h = `<label class="tl-field"><span>${esc(t("sc.tt.groups"))}</span><textarea class="tl-tv" data-k="grp" rows="4" inputmode="decimal" spellcheck="false">${esc(val("grp", ANOVA_DEF))}</textarea></label><p class="muted tl-note">${esc(t("sc.tt.groupsHint"))}</p>`;
    else if (k === "p1") h = `<div class="tl-grid2">${fld("x", "x")}${fld("n", "n")}${test ? fld("p0", "p_0") : ""}</div>`;
    else if (k === "p2") h = `<div class="tl-grid2">${fld("x1", "x_1")}${fld("n1", "n_1")}${fld("x2", "x_2")}${fld("n2", "n_2")}</div>`;
    else if (k === "gof")
      h = `<label class="tl-field"><span>${esc(t("sc.tt.obs"))}</span><textarea class="tl-tv" data-k="obs" rows="2" inputmode="decimal" spellcheck="false">${esc(val("obs", "18 22 20 40"))}</textarea></label><label class="tl-field"><span>${esc(t("sc.tt.exp"))}</span><textarea class="tl-tv" data-k="exp" rows="2" inputmode="decimal" spellcheck="false">${esc(val("exp", ""))}</textarea></label><p class="muted tl-note">${esc(t("sc.tt.expHint"))}</p>`;
    else if (k === "indep") h = `<label class="tl-field"><span>${esc(t("sc.tt.table"))}</span><textarea class="tl-tv" data-k="tab" rows="3" inputmode="decimal" spellcheck="false">${esc(val("tab", "20 30\n30 20"))}</textarea></label><p class="muted tl-note">${esc(t("sc.tt.tableHint"))}</p>`;
    else if (k === "reg")
      h = `<label class="tl-field"><span>x</span><textarea class="tl-tv" data-k="rx" rows="2" inputmode="decimal" spellcheck="false">${esc(val("rx", "1 2 3 4 5"))}</textarea></label><label class="tl-field"><span>y</span><textarea class="tl-tv" data-k="ry" rows="2" inputmode="decimal" spellcheck="false">${esc(val("ry", "2 4 5 4 5"))}</textarea></label>`;
    if (test) {
      const altOk = !NO_ALT.includes(k);
      const altSel = altOk ? `<label class="tl-field"><span>H₁</span><select class="tl-ta">${ALTS.map(([a]) => `<option value="${a}"${a === st.alt ? " selected" : ""}>${esc(altLabel(k, a))}</option>`).join("")}</select></label>` : "";
      h += `<div class="tl-grid2">${altSel}${fld("alpha", "\\alpha", st.alpha)}</div>`;
    } else h += `<div class="tl-grid2">${fld("level", "\\%", st.level)}</div><p class="muted tl-note">${esc(t("sc.tt.levelHint"))}</p>`;
    form.innerHTML = h;
    // α in stopnja zaupanja sta v stanju, ne med poljami v.
    form.querySelector('[data-k="alpha"]')?.setAttribute("data-top", "alpha");
    form.querySelector('[data-k="level"]')?.setAttribute("data-top", "level");
    run();
  }
  const H0 = { z1: "\\mu", t1: "\\mu", z2: "\\mu_1-\\mu_2", t2: "\\mu_1-\\mu_2", p1: "p", p2: "p_1-p_2", reg: "\\beta", f2: "\\sigma_1^2" };
  const H0v = { z1: "\\mu_0", t1: "\\mu_0", z2: "0", t2: "0", p1: "p_0", p2: "0", reg: "0", f2: "\\sigma_2^2" };
  const altLabel = (k, a) => `H₁: ${{ ne: "≠", lt: "<", gt: ">" }[a]}`;
  const hyp = (k, alt) => {
    const sym = { ne: "\\ne", lt: "<", gt: ">" }[alt];
    return `H_0:\\ ${H0[k]} = ${H0v[k]},\\quad H_1:\\ ${H0[k]} ${sym} ${H0v[k]}`;
  };
  const row = (label, tex, v) => `<div class="tl-row"><span class="tl-k">${esc(label)}</span><span class="tl-v">${texHtml(tex)}</span>${v === undefined ? "" : insertBtn(v)}</div>`;

  function run() {
    save();
    const k = st.kind;
    const test = st.mode === "test";
    const alpha = pct(st.alpha);
    const level = pct(st.level);
    const alt = st.alt;
    let r = null;
    let ci = null;
    let extra = "";
    const A = k.endsWith("2") || k === "z1" || k === "t1" ? () => getSample("a", k[0] === "z" ? "\\sigma" : "s") : null;
    let anovaTab = "";
    const Bs = () => getSample("b", k[0] === "z" ? "\\sigma" : "s");
    const nv = (key) => readNumber(val(key));
    if (test && !(alpha > 0 && alpha < 1)) return (out.innerHTML = err(t("sc.tt.bad")));
    if (!test && !(level > 0 && level < 1)) return (out.innerHTML = err(t("sc.tt.bad")));
    if (k === "z1") {
      const a = A();
      if (a) r = test ? TC.zTest1({ ...a, mu0: nv("mu0") }, alt, alpha) : (ci = TC.zInt1(a, level));
    } else if (k === "t1") {
      const a = A();
      if (a) r = test ? TC.tTest1({ ...a, mu0: nv("mu0") }, alt, alpha) : (ci = TC.tInt1(a, level));
    } else if (k === "z2" || k === "t2") {
      const a = A();
      const b = Bs();
      if (a && b) {
        if (k === "z2") r = test ? TC.zTest2(a, b, alt, alpha) : (ci = TC.zInt2(a, b, level));
        else r = test ? TC.tTest2(a, b, alt, alpha, st.pooled) : (ci = TC.tInt2(a, b, level, st.pooled));
      }
    } else if (k === "f2") {
      const a = A();
      const b = Bs();
      if (a && b) r = TC.fTest2(a, b, alt, alpha);
    } else if (k === "anova") {
      r = TC.anova(rows(val("grp", ANOVA_DEF)), alpha);
      if (r) {
        const tr = (name, o) => `<tr><th scope="row">${esc(name)}</th><td>${esc(num(o.df).text)}</td><td>${esc(num(o.ss).text)}</td><td>${esc(num(o.ms).text)}</td></tr>`;
        anovaTab = card(
          `<div class="tl-vt-wrap"><table class="tl-vt tl-anova"><thead><tr><th>${esc(t("sc.tt.source"))}</th><th>${texHtml("\\mathrm{df}")}</th><th>${texHtml("\\mathrm{SS}")}</th><th>${texHtml("\\mathrm{MS}")}</th></tr></thead><tbody>${tr(t("sc.tt.between"), r.factor)}${tr(t("sc.tt.within"), r.error)}</tbody></table></div>` +
            row(t("sc.tt.sxp"), `S_{xp} = ${num(r.sxp).tex}`, r.sxp) +
            `<p class="muted tl-note">${esc(t("sc.tt.means"))}: ${esc(r.means.map((m, i) => `${i + 1}: ${num(m).text}`).join("; "))}</p>`,
        );
      }
    } else if (k === "p1") r = test ? TC.propTest1({ x: nv("x"), n: nv("n"), p0: nv("p0") }, alt, alpha) : (ci = TC.propInt1({ x: nv("x"), n: nv("n") }, level));
    else if (k === "p2") {
      const d = { x1: nv("x1"), n1: nv("n1"), x2: nv("x2"), n2: nv("n2") };
      r = test ? TC.propTest2(d, alt, alpha) : (ci = TC.propInt2(d, level));
    } else if (k === "gof") {
      const obs = readList(val("obs", "18 22 20 40"));
      const exp = val("exp", "").trim() ? readList(val("exp")) : null;
      r = TC.chiGof(obs, exp, alpha);
      if (r) extra = `<p class="muted tl-note">${esc(t("sc.tt.exp"))}: ${esc(r.expected.map((v) => num(v).text).join("; "))}</p>`;
    } else if (k === "indep") {
      r = TC.chiIndep(rows(val("tab", "20 30\n30 20")), alpha);
      if (r) extra = `<p class="muted tl-note">${esc(t("sc.tt.exp"))}: ${esc(r.expected.map((row_) => row_.map((v) => num(v).text).join(" ")).join(" | "))}</p>`;
    } else if (k === "reg") {
      r = TC.regTest(readList(val("rx", "1 2 3 4 5")), readList(val("ry", "2 4 5 4 5")), alt, alpha);
      if (r) extra = card(row("y = a + b·x", `a = ${num(r.a).tex},\\ b = ${num(r.b).tex}`) + row("r", `r = ${num(r.r).tex},\\ r^2 = ${num(r.r2).tex}`) + row("s", `s = ${num(r.s).tex},\\ SE_b = ${num(r.seb).tex}`));
    }
    if (!r) return (out.innerHTML = err(t("sc.tt.bad")));
    if (!test) {
      out.innerHTML = card(
        row(t("sc.tt.ci"), `[${num(ci.lo).tex};\\ ${num(ci.hi).tex}]`) +
          row(t("sc.tt.estimate"), `${num(ci.est).tex}`, ci.est) +
          row(t("sc.tt.margin"), `\\pm ${num(ci.margin).tex}`, ci.margin) +
          row("*", `${k.startsWith("t") ? "t" : "z"}^{*} = ${num(ci.crit).tex}${ci.df ? `,\\ \\mathrm{df} = ${num(ci.df).tex}` : ""}`),
      ) + `<p class="muted tl-note">${esc(t("sc.tt.ciSay", { l: num(level * 100).text }))}</p>`;
      return;
    }
    const sym = r.kind === "chi" ? "\\chi^2" : r.kind;
    const hasAlt = !NO_ALT.includes(k);
    const hyp0 = hasAlt
      ? `<div class="tl-formula">${texHtml(hyp(k, alt))}</div>`
      : k === "anova"
        ? `<div class="tl-formula">${texHtml(`H_0:\\ \\mu_1 = \\mu_2 = \\dots = \\mu_{${r.means.length}},\\quad H_1:\\ \\text{${t("sc.tt.anovaH1").replace(/[\\{}$&#^_%~]/g, "")}}`)}</div>`
        : "";
    const dfRow = r.df !== undefined ? row("df", `\\mathrm{df} = ${num(r.df).tex}`, r.df) : r.df1 !== undefined ? row("df", `\\mathrm{df}_1 = ${num(r.df1).tex},\\ \\mathrm{df}_2 = ${num(r.df2).tex}`) : "";
    out.innerHTML =
      card(
        hyp0 +
          row(sym.replace("\\chi^2", "χ²"), `${sym} = ${num(r.stat).tex}`, r.stat) +
          dfRow +
          row(t("sc.tt.p"), `p = ${num(r.p).tex}`, r.p) +
          (r.est !== undefined ? row(t("sc.tt.estimate"), num(r.est).tex, r.est) : "") +
          `<p class="tl-dec ${r.reject ? "tl-dec-no" : "tl-dec-ok"}"><strong>${esc(r.reject ? t("sc.tt.reject", { a: num(alpha).text }) : t("sc.tt.keep", { a: num(alpha).text }))}</strong></p>` +
          pChart(r, hasAlt ? alt : "gt", ctx),
      ) + anovaTab + extra;
  }

  el.addEventListener("input", (e) => {
    const x = e.target;
    if (x.classList.contains("tl-tv")) {
      if (x.dataset.top) st[x.dataset.top] = x.value;
      else st.v[x.dataset.k] = x.value;
      run();
    }
  });
  el.addEventListener("change", (e) => {
    const x = e.target;
    if (x.classList.contains("tl-ta")) {
      st.alt = x.value;
      run();
    } else if (x.classList.contains("tl-tp")) {
      st.pooled = x.checked;
      run();
    } else if (x.classList.contains("tl-ts")) {
      st.src[x.dataset.p] = x.value;
      drawForm();
    }
  });
  el.addEventListener("click", (e) => {
    const m = e.target.closest("[data-mode]");
    const kb = e.target.closest("[data-kind]");
    if (m) {
      st.mode = m.dataset.mode;
      drawForm();
    } else if (kb) {
      st.kind = kb.dataset.kind;
      drawForm();
    }
  });
  drawForm();
}

// ---------- finance: TVM, amortizacija, denarni tokovi ----------

const FIN_TABS = ["tvm", "amort", "cf"];

export function tvmTool(el, ctx) {
  const { t } = ctx;
  const st = remember.get("evklid.tool.fin", { tab: "tvm" });
  if (!FIN_TABS.includes(st.tab)) st.tab = "tvm";
  el.innerHTML = `<div class="seg tl-seg tl-fseg" role="tablist">${FIN_TABS.map((k) => `<button type="button" role="tab" data-ftab="${k}">${esc(t(`sc.fin.${k}`))}</button>`).join("")}</div><div class="tl-fbody"></div>`;
  const body = el.querySelector(".tl-fbody");
  const show = () => {
    remember.set("evklid.tool.fin", st);
    el.querySelectorAll("[data-ftab]").forEach((b) => {
      b.classList.toggle("active", b.dataset.ftab === st.tab);
      b.setAttribute("aria-selected", String(b.dataset.ftab === st.tab));
    });
    const box = document.createElement("div");
    box.className = "tl-fpanel";
    body.replaceChildren(box);
    ({ tvm: tvmPanel, amort: amortPanel, cf: cfPanel })[st.tab](box, ctx);
  };
  el.querySelector(".tl-fseg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ftab]");
    if (b && b.dataset.ftab !== st.tab) {
      st.tab = b.dataset.ftab;
      show();
    }
  });
  show();
}

const TVM_DEF = { solve: "PMT", v: { N: "360", I: "6", PV: "200000", PMT: "", FV: "0", PY: "12", CY: "12" }, begin: false };

/** Rešen TVM iz shranjenih vnosov zavihka TVM (za amortizacijo). */
function solvedTvm() {
  const st = remember.get("evklid.tool.tvm", TVM_DEF);
  const v = { begin: !!st.begin };
  for (const k of [...TC.TVM_FIELDS, "PY", "CY"]) v[k] = k === st.solve ? NaN : readNumber(st.v?.[k]);
  const r = TC.tvm(v, st.solve);
  return r ? { ...v, ...r } : null;
}

function amortPanel(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.amort", { p1: "1", p2: "12" });
  const fld = (k, label) => `<label class="tl-field"><span>${esc(label)}</span><input class="tl-av" data-k="${k}" inputmode="numeric" autocomplete="off" value="${esc(st[k])}"></label>`;
  el.innerHTML = `<div class="card tl-card"><div class="tl-formula tl-afrom" aria-live="polite"></div><div class="tl-grid2">${fld("p1", t("sc.am.p1"))}${fld("p2", t("sc.am.p2"))}</div><p class="muted tl-note">${esc(t("sc.am.hint"))}</p></div><div class="tl-out" aria-live="polite"></div>`;
  const out = el.querySelector(".tl-out");
  const from = el.querySelector(".tl-afrom");
  const row = (label, tex, v) => `<div class="tl-row"><span class="tl-k">${esc(label)}</span><span class="tl-v">${texHtml(tex)}</span>${v === undefined ? "" : insertBtn(v)}</div>`;
  function run() {
    remember.set("evklid.tool.amort", st);
    const v = solvedTvm();
    if (!v) {
      from.innerHTML = "";
      return (out.innerHTML = err(t("sc.tvm.bad")));
    }
    from.innerHTML = texHtml(`N = ${num(v.N).tex},\\ I\\% = ${num(v.I).tex},\\ PV = ${num(v.PV).tex},\\ PMT = ${num(v.PMT).tex}`);
    const rows = TC.amortize(v);
    const sum = rows && TC.amortSum(rows, readNumber(st.p1), readNumber(st.p2));
    if (!sum) return (out.innerHTML = err(t("sc.am.bad", { n: rows ? rows.length : 0 })));
    const cent = (x) => (Math.abs(x) < 0.005 ? 0 : Math.round(x * 100) / 100); // denar na cente
    const cell = (x) => {
      const v = cent(x).toFixed(2).replace("-", "−"); // kot v banki: vedno dve decimalki
      return ctx.comma?.() === false ? v : v.replace(".", ",");
    };
    const list = rows.slice(sum.p1 - 1, sum.p2);
    out.innerHTML =
      card(
        row(t("sc.am.int"), `\\Sigma\\mathrm{Int} = ${num(cent(sum.int)).tex}`, sum.int) +
          row(t("sc.am.prn"), `\\Sigma\\mathrm{Prn} = ${num(cent(sum.prn)).tex}`, sum.prn) +
          row(t("sc.am.bal", { p: sum.p2 }), `\\mathrm{bal} = ${num(cent(sum.bal)).tex}`, sum.bal),
      ) +
      card(
        `<div class="tl-vt-wrap tl-amort"><table class="tl-vt"><thead><tr><th>${esc(t("sc.am.k"))}</th><th>${esc(t("sc.am.colInt"))}</th><th>${esc(t("sc.am.colPrn"))}</th><th>${esc(t("sc.am.colBal"))}</th></tr></thead><tbody>${list
          .map((r) => `<tr><td>${r.k}</td><td>${cell(r.int)}</td><td>${cell(r.prn)}</td><td>${cell(r.bal)}</td></tr>`)
          .join("")}</tbody></table></div>`,
      );
  }
  el.addEventListener("input", (e) => {
    if (e.target.classList.contains("tl-av")) {
      st[e.target.dataset.k] = e.target.value;
      run();
    }
  });
  run();
}

function cfPanel(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.cf", { rate: "10", flows: "-1000\n300\n400\n500" });
  el.innerHTML = `<div class="card tl-card"><label class="tl-field"><span>${esc(t("sc.cf.rate"))}</span><input class="tl-cv" data-k="rate" inputmode="decimal" autocomplete="off" value="${esc(st.rate)}"></label>
    <label class="tl-field"><span>${esc(t("sc.cf.flows"))}</span><textarea class="tl-cv" data-k="flows" rows="5" inputmode="decimal" spellcheck="false">${esc(st.flows)}</textarea></label>
    <p class="muted tl-note">${esc(t("sc.cf.hint"))}</p></div><div class="tl-out" aria-live="polite"></div>`;
  const out = el.querySelector(".tl-out");
  const row = (label, tex, v) => `<div class="tl-row"><span class="tl-k">${esc(label)}</span><span class="tl-v">${tex}</span>${v === undefined ? "" : insertBtn(v)}</div>`;
  function run() {
    remember.set("evklid.tool.cf", st);
    const flows = TC.readFlows(rows(st.flows));
    const rate = readNumber(st.rate);
    const r = flows && flows.length >= 2 && Number.isFinite(rate) ? TC.cashFlow(rate, flows) : null;
    if (!r) return (out.innerHTML = err(t("sc.cf.bad")));
    const tx = (s) => texHtml(s);
    const opt = (v, tex, none) => (v === null ? esc(t(none)) : tx(tex));
    out.innerHTML = card(
      row(t("sc.cf.npv"), tx(`\\mathrm{NPV} = ${num(r.npv).tex}`), r.npv) +
        row(t("sc.cf.irr"), opt(r.irr, `\\mathrm{IRR} = ${r.irr === null ? "" : num(r.irr).tex}\\,\\%`, flows.some((c) => c > 0) && flows.some((c) => c < 0) ? "sc.cf.noRoot" : "sc.cf.noIrr"), r.irr ?? undefined) +
        row(t("sc.cf.nfv"), tx(`\\mathrm{NFV} = ${num(r.nfv).tex}`), r.nfv) +
        row(t("sc.cf.pbp"), opt(r.pbp, `\\mathrm{PBP} = ${r.pbp === null ? "" : num(r.pbp).tex}`, "sc.cf.never"), r.pbp ?? undefined) +
        row(t("sc.cf.dpbp"), opt(r.dpbp, `\\mathrm{DPBP} = ${r.dpbp === null ? "" : num(r.dpbp).tex}`, "sc.cf.never"), r.dpbp ?? undefined) +
        `<p class="muted tl-note">${esc(t("sc.cf.count", { n: flows.length - 1 }))}</p>`,
    );
  }
  el.addEventListener("input", (e) => {
    if (e.target.classList.contains("tl-cv")) {
      st[e.target.dataset.k] = e.target.value;
      run();
    }
  });
  run();
}

// TVM (kot TI-84 TVM Solver)

const TVM_TEX = { N: "N", I: "I\\%", PV: "PV", PMT: "PMT", FV: "FV" };

function tvmPanel(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.tvm", structuredClone(TVM_DEF));
  el.innerHTML = `<div class="card tl-card"><div class="chip-row tl-sub tl-vk" role="tablist" aria-label="${esc(t("sc.tvm.result"))}"></div>
    <div class="tl-grid2 tl-vf"></div>
    <label class="tl-field"><span>${esc(t("sc.tvm.pay"))}</span><select class="tl-vb"><option value="end">${esc(t("sc.tvm.end"))}</option><option value="begin">${esc(t("sc.tvm.begin"))}</option></select></label>
    <p class="muted tl-note">${esc(t("sc.tvm.hint"))}</p></div><div class="tl-out" aria-live="polite"></div>`;
  const chips = el.querySelector(".tl-vk");
  const grid = el.querySelector(".tl-vf");
  const out = el.querySelector(".tl-out");
  const sel = el.querySelector(".tl-vb");
  sel.value = st.begin ? "begin" : "end";
  function draw() {
    chips.innerHTML = TC.TVM_FIELDS.map((f) => `<button type="button" role="tab" data-s="${f}" class="${f === st.solve ? "active" : ""}" aria-selected="${f === st.solve}">${texHtml(TVM_TEX[f])}</button>`).join("");
    const f = (k, tex, dis) => `<label class="tl-field"><span>${texHtml(tex)}</span><input class="tl-vv" data-k="${k}" inputmode="decimal" autocomplete="off" value="${dis ? "" : esc(st.v[k] ?? "")}"${dis ? ` disabled placeholder="?"` : ""}></label>`;
    grid.innerHTML = TC.TVM_FIELDS.map((k) => f(k, TVM_TEX[k], k === st.solve)).join("") + f("PY", "P/Y") + f("CY", "C/Y");
    run();
  }
  function run() {
    remember.set("evklid.tool.tvm", st);
    const v = { begin: st.begin };
    for (const k of [...TC.TVM_FIELDS, "PY", "CY"]) v[k] = k === st.solve ? NaN : readNumber(st.v[k]);
    const r = TC.tvm(v, st.solve);
    if (!r) return (out.innerHTML = err(t("sc.tvm.bad")));
    const shown = r[st.solve];
    // izračunano polje pokažemo tudi v polju (disabled), rezultat pa v kartici
    out.innerHTML = card(
      `<div class="tl-row"><span class="tl-k">${esc(t("sc.tvm.result"))}</span><span class="tl-v">${texHtml(`${TVM_TEX[st.solve]} = ${num(shown, "auto").tex}`)}</span>${insertBtn(shown)}</div>` +
        (st.solve === "PMT" ? `<p class="muted tl-note">${esc(t("sc.tvm.total", { v: num(Math.abs(shown * v.N)).text }))}</p>` : ""),
    );
  }
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-s]");
    if (b) {
      st.solve = b.dataset.s;
      draw();
    }
  });
  grid.addEventListener("input", (e) => {
    if (e.target.classList.contains("tl-vv")) {
      st.v[e.target.dataset.k] = e.target.value;
      run();
    }
  });
  sel.addEventListener("change", () => {
    st.begin = sel.value === "begin";
    run();
  });
  draw();
}

// ---------- tabela vrednosti ----------

export function tableTool(el, ctx) {
  const { t, num, card, err } = ctx;
  const st = remember.get("evklid.tool.table", { f: "x^2 - 3x", g: "", start: "-3", step: "1", rows: "10" });
  const fld = (k, label, mode = "decimal") => `<label class="tl-field"><span>${label}</span><input class="tl-gv" data-k="${k}" inputmode="${mode}" autocomplete="off" spellcheck="false" value="${esc(st[k])}"></label>`;
  el.innerHTML = `<div class="card tl-card">${fld("f", texHtml("f(x)"), "text")}${fld("g", `${texHtml("g(x)")} <small>(${esc(t("sc.tab.optional"))})</small>`, "text")}
    <div class="tl-grid2">${fld("start", esc(t("sc.tab.start")))}${fld("step", esc(t("sc.tab.step")))}${fld("rows", esc(t("sc.tab.rows")))}</div></div><div class="tl-out" aria-live="polite"></div>`;
  const out = el.querySelector(".tl-out");
  const run = () => {
    remember.set("evklid.tool.table", st);
    if (!st.f.trim()) return (out.innerHTML = "");
    const r = TC.valueTable({ f: st.f, g: st.g, start: readNumber(st.start), step: readNumber(st.step), rows: readNumber(st.rows) });
    if (r.error === "range") return (out.innerHTML = err(t("sc.tab.range")));
    if (r.error === "syntax") return (out.innerHTML = err(t("gc.errSyntax")));
    if (r.error === "var") return (out.innerHTML = err(t("gc.errChar", { ch: r.name })));
    const cell = (v) => (Number.isFinite(v) ? esc(num(v).text) : "—");
    out.innerHTML = card(
      `<div class="tl-vt-wrap"><table class="tl-vt"><thead><tr><th>${texHtml("x")}</th><th>${texHtml("f(x)")}</th>${r.g ? `<th>${texHtml("g(x)")}</th>` : ""}</tr></thead><tbody>${r.xs
        .map((x, i) => `<tr><td>${cell(x)}</td><td>${cell(r.f[i])}</td>${r.g ? `<td>${cell(r.g[i])}</td>` : ""}</tr>`)
        .join("")}</tbody></table></div>`,
    );
  };
  el.addEventListener("input", (e) => {
    if (e.target.classList.contains("tl-gv")) {
      st[e.target.dataset.k] = e.target.value;
      run();
    }
  });
  run();
}
