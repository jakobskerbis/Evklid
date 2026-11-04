// Orodja: statistični testi in intervali zaupanja, finance (TVM), tabela vrednosti.
// Računanje je v testcore.js (brez DOM). ctx: { t, icon, num(v), card(html), err(msg), insertBtn(v), comma() }
import { esc, texHtml, remember } from "./tools-kit.js";
import { readNumber, readList } from "./toolscore.js";
import * as TC from "./testcore.js";

const KINDS = ["z1", "t1", "z2", "t2", "p1", "p2", "gof", "indep", "reg"];
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
    } else if (k === "p1") h = `<div class="tl-grid2">${fld("x", "x")}${fld("n", "n")}${test ? fld("p0", "p_0") : ""}</div>`;
    else if (k === "p2") h = `<div class="tl-grid2">${fld("x1", "x_1")}${fld("n1", "n_1")}${fld("x2", "x_2")}${fld("n2", "n_2")}</div>`;
    else if (k === "gof")
      h = `<label class="tl-field"><span>${esc(t("sc.tt.obs"))}</span><textarea class="tl-tv" data-k="obs" rows="2" inputmode="decimal" spellcheck="false">${esc(val("obs", "18 22 20 40"))}</textarea></label><label class="tl-field"><span>${esc(t("sc.tt.exp"))}</span><textarea class="tl-tv" data-k="exp" rows="2" inputmode="decimal" spellcheck="false">${esc(val("exp", ""))}</textarea></label><p class="muted tl-note">${esc(t("sc.tt.expHint"))}</p>`;
    else if (k === "indep") h = `<label class="tl-field"><span>${esc(t("sc.tt.table"))}</span><textarea class="tl-tv" data-k="tab" rows="3" inputmode="decimal" spellcheck="false">${esc(val("tab", "20 30\n30 20"))}</textarea></label><p class="muted tl-note">${esc(t("sc.tt.tableHint"))}</p>`;
    else if (k === "reg")
      h = `<label class="tl-field"><span>x</span><textarea class="tl-tv" data-k="rx" rows="2" inputmode="decimal" spellcheck="false">${esc(val("rx", "1 2 3 4 5"))}</textarea></label><label class="tl-field"><span>y</span><textarea class="tl-tv" data-k="ry" rows="2" inputmode="decimal" spellcheck="false">${esc(val("ry", "2 4 5 4 5"))}</textarea></label>`;
    if (test) {
      const altOk = !["gof", "indep"].includes(k);
      const altSel = altOk ? `<label class="tl-field"><span>H₁</span><select class="tl-ta">${ALTS.map(([a]) => `<option value="${a}"${a === st.alt ? " selected" : ""}>${esc(altLabel(k, a))}</option>`).join("")}</select></label>` : "";
      h += `<div class="tl-grid2">${altSel}${fld("alpha", "\\alpha", st.alpha)}</div>`;
    } else h += `<div class="tl-grid2">${fld("level", "\\%", st.level)}</div><p class="muted tl-note">${esc(t("sc.tt.levelHint"))}</p>`;
    form.innerHTML = h;
    // α in stopnja zaupanja sta v stanju, ne med poljami v.
    form.querySelector('[data-k="alpha"]')?.setAttribute("data-top", "alpha");
    form.querySelector('[data-k="level"]')?.setAttribute("data-top", "level");
    run();
  }
  const H0 = { z1: "\\mu", t1: "\\mu", z2: "\\mu_1-\\mu_2", t2: "\\mu_1-\\mu_2", p1: "p", p2: "p_1-p_2", reg: "\\beta" };
  const H0v = { z1: "\\mu_0", t1: "\\mu_0", z2: "0", t2: "0", p1: "p_0", p2: "0", reg: "0" };
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
    const hasAlt = !["gof", "indep"].includes(k);
    const hyp0 = hasAlt ? `<div class="tl-formula">${texHtml(hyp(k, alt))}</div>` : "";
    out.innerHTML =
      card(
        hyp0 +
          row(sym.replace("\\chi^2", "χ²"), `${sym} = ${num(r.stat).tex}`, r.stat) +
          (r.df !== undefined ? row("df", `\\mathrm{df} = ${num(r.df).tex}`, r.df) : "") +
          row(t("sc.tt.p"), `p = ${num(r.p).tex}`, r.p) +
          (r.est !== undefined ? row(t("sc.tt.estimate"), num(r.est).tex, r.est) : "") +
          `<p class="tl-dec ${r.reject ? "tl-dec-no" : "tl-dec-ok"}"><strong>${esc(r.reject ? t("sc.tt.reject", { a: num(alpha).text }) : t("sc.tt.keep", { a: num(alpha).text }))}</strong></p>`,
      ) + extra;
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

// ---------- finance (TVM) ----------

const TVM_TEX = { N: "N", I: "I\\%", PV: "PV", PMT: "PMT", FV: "FV" };

export function tvmTool(el, ctx) {
  const { t, num, card, err, insertBtn } = ctx;
  const st = remember.get("evklid.tool.tvm", { solve: "PMT", v: { N: "360", I: "6", PV: "200000", PMT: "", FV: "0", PY: "12", CY: "12" }, begin: false });
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
