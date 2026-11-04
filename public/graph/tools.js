// Orodja za računanje ob kalkulatorju: pretvornik enot, statistika, enačbe, kompleksna števila,
// matrike, številski sistemi; periodni sistem z molsko maso; zbirka formul predmeta.
// Vse računa brskalnik (toolscore.js, pse-data.js), brez API.
import { skicaZa } from "../skice/index.js";
import { createUnits } from "./sci.js";
import { formatNumber } from "./scicore.js";
import { readList, evalComplex, polyRoots, readMatrix, M, convertBase, logic32, LOGIC_OPS, molarMass, readNumber, solveRatio } from "./toolscore.js";
import { ELEMENTS, CATEGORIES, MASSES, shells, EXTRA } from "./pse-data.js";

import { esc, texHtml, usesComma, remember } from "./tools-kit.js";
import { chemTools } from "./tools-chem.js";
import { formulaToCalc } from "./formula-calc.js";
import { chemText } from "./molska.js";
import { probTool } from "./tools-prob.js";
import { anaTools } from "./tools-ana.js";
import { testsTool, tvmTool, tableTool } from "./tools-test.js";
import { statsTool } from "./tools-stats.js";
import { sheetTool } from "./tools-sheet.js";
import { trialsTool } from "./tools-trials.js";

const TOOLS = ["units", "eq", "calc", "stats", "sheet", "tests", "prob", "trials", "vec", "matrix", "plot3", "ode", "err", "complex", "base", "tvm", "table", "rxn", "conc", "solub"];
// vrstni red čipov po predmetu: najprej orodja, ki jih predmet največ rabi
const ORDER = {
  KEM: ["rxn", "conc", "solub", "units", "err", "stats", "eq"],
  FIZ: ["units", "err", "eq", "vec", "calc", "ode", "stats"],
  MAT: ["eq", "calc", "table", "stats", "sheet", "tests", "prob", "trials", "vec", "matrix", "plot3", "ode", "complex", "base", "tvm"],
};
const toolOrder = (subj) => {
  const first = ORDER[subj] || ORDER.MAT;
  return [...first, ...TOOLS.filter((k) => !first.includes(k))];
};

/**
 * Zbirka orodij z izbiro zgoraj.
 * opts: { t, icon, locale(), onInsert(text) }
 */
export function createTools(root, opts) {
  const { t, icon } = opts;
  const comma = () => usesComma(opts.locale?.());
  // v orodjih dovolj 8 veljavnih mest (5,0990195 namesto 5,09901951359)
  const num = (v, mode = "auto") => formatNumber(Number.isFinite(v) ? Number(v.toPrecision(8)) : v, { mode, comma: comma() });
  const insText = (v) => formatNumber(v, { comma: comma() }).text.replace(" · 10^", "E").replace("−", "-");
  const subj = () => opts.subject?.() || "MAT";
  let tool = TOOLS.includes(remember.get("evklid.tool")) ? remember.get("evklid.tool") : toolOrder(subj())[0];
  const views = {};

  root.classList.add("tl");
  root.innerHTML = `<div class="tl-top"><div class="chip-row tl-pick" role="tablist" aria-label="${esc(t("sc.toolsMode"))}">${toolOrder(subj()).map(
    (k) => `<button type="button" role="tab" data-tool="${k}">${esc(t(`sc.tool.${k}`))}</button>`,
  ).join("")}</div></div><div class="tl-body"></div>`;
  const body = root.querySelector(".tl-body");

  // ---- skupni gradniki ----
  const insertBtn = (v) => (Number.isFinite(v) ? `<button type="button" class="ghost icon-only tl-ins" data-v="${esc(insText(v))}" title="${esc(t("sc.toCalc"))}" aria-label="${esc(t("sc.toCalc"))}">${icon("calculator")}</button>` : "");
  const card = (html) => `<div class="card tl-card">${html}</div>`;
  const err = (msg) => `<p class="tl-err">${icon("info")}<span>${esc(msg)}</span></p>`;
  const cTex = ([re, im], mode = "auto") => {
    if (!Number.isFinite(re) || !Number.isFinite(im)) return "\\text{—}";
    const a = num(re, mode).tex;
    const b = num(Math.abs(im), mode).tex;
    if (im === 0) return a;
    const ib = b === "1" ? "i" : `${b}\\,i`;
    if (re === 0) return `${im < 0 ? "-" : ""}${ib}`;
    return `${a} ${im < 0 ? "-" : "+"} ${ib}`;
  };
  const mTex = (A) => `\\begin{pmatrix}${A.map((r) => r.map((v) => num(v).tex).join(" & ")).join(" \\\\ ")}\\end{pmatrix}`;

  // ---- enačbe ----
  function eq_(el) {
    const st = remember.get("evklid.tool.eq", { kind: "poly", deg: 2, poly: ["1", "-5", "6", "0", "0"], n: 2, sys: [] });
    if (!Array.isArray(st.ratio) || st.ratio.length !== 4) st.ratio = ["2", "3", "4", ""];
    el.innerHTML = `<div class="seg tl-seg"><button type="button" data-kind="poly">${esc(t("sc.eq.poly"))}</button><button type="button" data-kind="sys">${esc(t("sc.eq.sys"))}</button><button type="button" data-kind="ratio">${esc(t("sc.eq.ratio"))}</button></div><div class="tl-eq"></div><div class="tl-out" aria-live="polite"></div>`;
    const box = el.querySelector(".tl-eq");
    const out = el.querySelector(".tl-out");
    const save = () => remember.set("evklid.tool.eq", st);
    const LET = ["a", "b", "c", "d", "e"];
    function draw() {
      el.querySelectorAll(".tl-seg button").forEach((b) => b.classList.toggle("active", b.dataset.kind === st.kind));
      if (st.kind === "ratio") {
        // a : b = c : d (Casio »Razmerje«): neznanka je lahko na katerem koli mestu
        const L = ["a", "b", "c", "d"];
        const sep = (x) => `<span class="tl-ratio-sep" aria-hidden="true">${x}</span>`;
        box.innerHTML = card(`<div class="tl-formula">${texHtml("a : b = c : d")}</div>
          <div class="tl-ratio">${L.map((l, i) => `<label class="tl-field"><span>${texHtml(l)}</span><input class="tl-ra" data-i="${i}" inputmode="decimal" autocomplete="off" placeholder="x" value="${esc(st.ratio[i])}"></label>${i === 1 ? sep("=") : i < 3 ? sep(":") : ""}`).join("")}</div>
          <p class="muted tl-note">${esc(t("sc.eq.ratioHint"))}</p>`);
      } else if (st.kind === "poly") {
        const d = st.deg;
        const terms = LET.slice(0, d + 1).map((l, i) => (d - i > 1 ? `${l}x^{${d - i}}` : d - i === 1 ? `${l}x` : l));
        box.innerHTML = card(`<label class="tl-field tl-inline"><span>${esc(t("sc.eq.degree"))}</span><select class="tl-deg">${[1, 2, 3, 4].map((k) => `<option${k === d ? " selected" : ""}>${k}</option>`).join("")}</select></label>
          <div class="tl-formula">${texHtml(`${terms.join(" + ")} = 0`)}</div>
          <div class="tl-coefs">${LET.slice(0, d + 1).map((l, i) => `<label class="tl-field"><span>${texHtml(l)}</span><input class="tl-co" data-i="${i}" inputmode="decimal" value="${esc(st.poly[i] ?? "0")}"></label>`).join("")}</div>`);
      } else {
        const n = st.n;
        const vars = ["x", "y", "z", "w"].slice(0, n);
        const g = (i, j) => esc(st.sys?.[i]?.[j] ?? (i === j ? "1" : "0"));
        box.innerHTML = card(`<label class="tl-field tl-inline"><span>${esc(t("sc.eq.unknowns"))}</span><select class="tl-n">${[2, 3, 4].map((k) => `<option${k === n ? " selected" : ""}>${k}</option>`).join("")}</select></label>
          <div class="tl-sys" style="--cols:${n + 1}">${Array.from({ length: n }, (_, i) =>
            Array.from({ length: n + 1 }, (_, j) => `<label class="tl-cell"><input class="tl-sc" data-i="${i}" data-j="${j}" inputmode="decimal" value="${g(i, j)}" aria-label="${esc(j < n ? `${i + 1}. ${vars[j]}` : `${i + 1}. =`)}"><span>${j < n ? texHtml(vars[j]) : ""}</span></label>`).join(""),
          ).join("")}</div><p class="muted tl-note">${esc(t("sc.eq.sysHint"))}</p>`);
      }
      solve();
    }
    function solve() {
      if (st.kind === "ratio") {
        const L = ["a", "b", "c", "d"];
        // prazno polje ali »x« je neznanka
        const vals = st.ratio.map((x) => (/^\s*x?\s*$/i.test(x) ? NaN : readNumber(x)));
        if (st.ratio.some((x, i) => !/^\s*x?\s*$/i.test(x) && !Number.isFinite(vals[i]))) return (out.innerHTML = err(t("gc.errSyntax")));
        const r = solveRatio(vals);
        if (r.error) return (out.innerHTML = err(t(r.error === "zero" ? "sc.eq.ratioZero" : "sc.eq.ratioHint")));
        const v = (j) => (vals[j] < 0 && j !== den ? `(${num(vals[j]).tex})` : num(vals[j]).tex); // 3 · (−2), ne 3 · −2
        // za neznanko: produkt zunanjih (a·d) = produkt notranjih (b·c)
        const [p, q, den] = [
          [1, 2, 3],
          [0, 3, 2],
          [0, 3, 1],
          [1, 2, 0],
        ][r.i];
        const x = L[r.i];
        // neskončna decimalka (2,333…) dobi ≈, ne =
        const eq = Number(r.value.toPrecision(8)) === r.value ? "=" : "\\approx";
        const steps = [`a \\cdot d = b \\cdot c`, `${x} = \\dfrac{${L[p]} \\cdot ${L[q]}}{${L[den]}} = \\dfrac{${v(p)} \\cdot ${v(q)}}{${v(den)}} ${eq} ${num(r.value).tex}`];
        const full = vals.map((w, j) => (j === r.i ? `\\mathbf{${num(r.value).tex}}` : num(w).tex));
        out.innerHTML = card(`<div class="tl-row"><span class="tl-v">${texHtml(`${x} ${eq} ${num(r.value).tex}`)}</span>${insertBtn(r.value)}</div>
          ${steps.map((sx) => `<div class="tl-mx-line">${texHtml(sx)}</div>`).join("")}
          <div class="tl-mx-line">${texHtml(`${full[0]} : ${full[1]} = ${full[2]} : ${full[3]}`)}</div>`);
        return;
      }
      if (st.kind === "poly") {
        const co = st.poly.slice(0, st.deg + 1).map(readNumber);
        if (co.some((v) => !Number.isFinite(v)) || co[0] === 0) return (out.innerHTML = co[0] === 0 ? err(t("sc.eq.leadZero")) : "");
        const roots = polyRoots(co);
        out.innerHTML = card(`<div class="tl-h">${esc(t("sc.eq.roots"))}</div>${roots
          .map((r, i) => `<div class="tl-row"><span class="tl-v">${texHtml(`x_{${i + 1}} = ${cTex(r)}`)}</span>${r[1] === 0 ? insertBtn(r[0]) : ""}</div>`)
          .join("")}${st.deg === 2 ? `<p class="muted tl-note">${texHtml(`D = b^2 - 4ac = ${num(co[1] ** 2 - 4 * co[0] * co[2]).tex}`)}</p>` : ""}`);
      } else {
        const n = st.n;
        const A = [];
        const b = [];
        for (let i = 0; i < n; i++) {
          A.push(Array.from({ length: n }, (_, j) => readNumber(st.sys?.[i]?.[j] ?? (i === j ? "1" : "0"))));
          b.push(readNumber(st.sys?.[i]?.[n] ?? "0"));
        }
        if (A.flat().concat(b).some((v) => !Number.isFinite(v))) return (out.innerHTML = "");
        const r = M.solve(A, b);
        const vars = ["x", "y", "z", "w"];
        out.innerHTML = r.none ? err(t("sc.eq.noSol")) : r.many ? err(t("sc.eq.many")) : card(r.x.map((v, i) => `<div class="tl-row"><span class="tl-v">${texHtml(`${vars[i]} = ${num(v).tex}`)}</span>${insertBtn(v)}</div>`).join(""));
      }
    }
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-kind]");
      if (!b) return;
      st.kind = b.dataset.kind;
      save();
      draw();
    });
    el.addEventListener("change", (e) => {
      if (e.target.matches(".tl-deg")) st.deg = Number(e.target.value);
      else if (e.target.matches(".tl-n")) st.n = Number(e.target.value);
      else return;
      save();
      draw();
    });
    el.addEventListener("input", (e) => {
      const x = e.target;
      if (x.matches(".tl-co")) st.poly[Number(x.dataset.i)] = x.value;
      else if (x.matches(".tl-ra")) st.ratio[Number(x.dataset.i)] = x.value;
      else if (x.matches(".tl-sc")) {
        st.sys ||= [];
        st.sys[x.dataset.i] ||= [];
        st.sys[x.dataset.i][x.dataset.j] = x.value;
      } else return;
      save();
      solve();
    });
    draw();
  }

  // ---- kompleksna števila ----
  function complex_(el) {
    el.innerHTML = card(`<label class="tl-field"><span>${esc(t("sc.input"))}</span><input class="tl-cx" autocomplete="off" spellcheck="false" value="${esc(remember.get("evklid.tool.cx", "(2 + 3i)(1 − i)"))}"></label><p class="muted tl-note">${esc(t("sc.cx.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const inp = el.querySelector(".tl-cx");
    const run = () => {
      remember.set("evklid.tool.cx", inp.value);
      const out = el.querySelector(".tl-out");
      if (!inp.value.trim()) return (out.innerHTML = "");
      let z;
      try {
        z = evalComplex(inp.value);
      } catch {
        return (out.innerHTML = err(t("gc.errSyntax")));
      }
      const r = Math.hypot(z[0], z[1]);
      const phi = Math.atan2(z[1], z[0]);
      out.innerHTML = card(
        [
          `z = ${cTex(z)}`,
          `\\operatorname{Re} z = ${num(z[0]).tex},\\quad \\operatorname{Im} z = ${num(z[1]).tex}`,
          `|z| = ${num(r).tex}`,
          `\\arg z = ${num(phi).tex} = ${num((phi * 180) / Math.PI).tex}^\\circ`,
          `z = ${num(r).tex}\\,(\\cos ${num((phi * 180) / Math.PI).tex}^\\circ + i \\sin ${num((phi * 180) / Math.PI).tex}^\\circ)`,
          `\\bar z = ${cTex([z[0], -z[1]])}`,
        ]
          .map((x) => `<div class="tl-row"><span class="tl-v">${texHtml(x)}</span></div>`)
          .join(""),
      );
    };
    inp.addEventListener("input", run);
    run();
  }

  // ---- matrike ----
  function matrix_(el) {
    const st = remember.get("evklid.tool.mx", { A: "2 1\n1 3", B: "3\n5" });
    st.n ??= "3";
    el.innerHTML =
      card(`<div class="tl-mx"><label class="tl-field"><span>${texHtml("A")}</span><textarea class="tl-A" rows="3" spellcheck="false">${esc(st.A)}</textarea></label><label class="tl-field"><span>${texHtml("B")}</span><textarea class="tl-B" rows="3" spellcheck="false">${esc(st.B)}</textarea></label></div>
      <p class="muted tl-note">${esc(t("sc.mx.hint"))}</p>
      <div class="chip-row tl-ops">${["\\det A", "A^{-1}", "A^T", "\\operatorname{rref} A", "A + B", "A - B", "A \\cdot B", "A x = B", "\\operatorname{sl} A", "A^2", "\\lambda", "I_n", "A^n"].map((o, i) => `<button type="button" data-op="${i}">${texHtml(o)}</button>`).join("")}</div>
      <label class="tl-field tl-inline tl-mx-n" hidden><span>${texHtml("n")}</span><input class="tl-n-in" inputmode="numeric" autocomplete="off" value="${esc(st.n)}"></label>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const out = el.querySelector(".tl-out");
    let op = 0;
    const run = () => {
      st.A = el.querySelector(".tl-A").value;
      st.B = el.querySelector(".tl-B").value;
      st.n = el.querySelector(".tl-n-in").value;
      remember.set("evklid.tool.mx", st);
      el.querySelectorAll(".tl-ops button").forEach((b) => b.classList.toggle("active", Number(b.dataset.op) === op));
      el.querySelector(".tl-mx-n").hidden = op < 11;
      const A = readMatrix(st.A);
      const B = readMatrix(st.B);
      const n = readNumber(st.n);
      if (op === 11) {
        // enotska matrika I_n (ne rabi A)
        if (!Number.isInteger(n) || n < 1 || n > 10) return (out.innerHTML = err(t("sc.mx.nHint")));
        return (out.innerHTML = card(`<div class="tl-mx-res">${texHtml(`I_{${n}} = ${mTex(M.identity(n))}`, true)}</div>`));
      }
      if (!A) return (out.innerHTML = err(t("sc.mx.hint")));
      const needB = op >= 4 && op <= 7;
      if (needB && !B) return (out.innerHTML = err(t("sc.mx.hint")));
      const sq = A.length === A[0].length;
      let res;
      switch (op) {
        case 0:
          res = sq ? `\\det A = ${num(M.det(A)).tex}` : null;
          break;
        case 1: {
          if (!sq) break;
          const inv = M.inverse(A);
          res = inv ? `A^{-1} = ${mTex(inv)}` : "!" + t("sc.mx.singular");
          break;
        }
        case 2:
          res = `A^T = ${mTex(M.transpose(A))}`;
          break;
        case 3: {
          const r = M.rref(A);
          res = `${mTex(r.R)},\\quad \\operatorname{rang} A = ${r.rank}`;
          break;
        }
        case 4:
        case 5: {
          const r = op === 4 ? M.add(A, B) : M.sub(A, B);
          res = r ? `${op === 4 ? "A + B" : "A - B"} = ${mTex(r)}` : null;
          break;
        }
        case 6: {
          const r = M.mul(A, B);
          res = r ? `A \\cdot B = ${mTex(r)}` : null;
          break;
        }
        case 8:
          res = sq ? `\\operatorname{sl} A = ${num(M.trace(A)).tex}` : null;
          break;
        case 9:
          res = sq ? `A^2 = ${mTex(M.mul(A, A))}` : null;
          break;
        case 10: {
          // lastne vrednosti: ničle det(λI − A); kompleksne v obliki a ± bi
          const ev = sq ? M.eigen(A) : null;
          if (!ev) break;
          const z = ([re, im]) => (im === 0 ? num(re).tex : `${re === 0 ? "" : num(re).tex}${im < 0 ? "-" : re === 0 ? "" : "+"}${Math.abs(im) === 1 ? "" : num(Math.abs(im)).tex}i`);
          const cp = M.charPoly(A);
          const n = cp.length - 1;
          const term = (c, k) => (c === 0 ? "" : `${c < 0 ? "-" : "+"}${Math.abs(c) === 1 && k ? "" : num(Math.abs(c)).tex}${k ? (k === 1 ? "\\lambda" : `\\lambda^{${k}}`) : ""}`);
          const poly = cp.map((c, i) => term(c, n - i)).join("").replace(/^\+/, "");
          // vsaka vrstica posebej, da se na telefonu nič ne pomika vstran
          res = [`\\det(\\lambda I - A) = ${poly}`, ...ev.map((e, i) => `\\lambda_{${i + 1}} = ${z(e)}`)];
          break;
        }
        case 12: {
          if (!Number.isInteger(n) || Math.abs(n) > 99) return (out.innerHTML = err(t("sc.mx.nHint")));
          if (!sq) break;
          const r = M.pow(A, n);
          res = r ? `A^{${n}} = ${mTex(r)}` : "!" + t("sc.mx.singular");
          break;
        }
        case 7: {
          if (!sq || B.length !== A.length) break;
          const r = M.solve(A, B.map((x) => x[0]));
          res = r.none ? "!" + t("sc.eq.noSol") : r.many ? "!" + t("sc.eq.many") : `x = ${mTex(r.x.map((v) => [v]))}`;
          break;
        }
      }
      if (res == null) out.innerHTML = err(t("sc.mx.size"));
      else if (Array.isArray(res)) out.innerHTML = card(res.map((r) => `<div class="tl-mx-line">${texHtml(r)}</div>`).join("")); // vrstični KaTeX: dolg polinom se prelomi pri + in −
      else if (res.startsWith("!")) out.innerHTML = err(res.slice(1));
      else out.innerHTML = card(`<div class="tl-mx-res">${texHtml(res, true)}</div>`);
    };
    el.querySelector(".tl-ops").addEventListener("click", (e) => {
      const b = e.target.closest("[data-op]");
      if (!b) return;
      op = Number(b.dataset.op);
      run();
    });
    el.addEventListener("input", run);
    run();
  }

  // ---- številski sistemi (in logične operacije kot Casio: AND, OR, XOR, XNOR, Not, Neg) ----
  function base_(el) {
    const st = remember.get("evklid.tool.base", { v: "2024", b: 10 });
    st.op ||= "";
    st.w ??= "";
    const ops = ["", ...LOGIC_OPS];
    const opName = (o) => (o ? (o === "not" ? "Not" : o === "neg" ? "Neg" : o.toUpperCase()) : t("sc.base.none"));
    el.innerHTML = card(`<div class="tl-pair"><label class="tl-field"><span>${esc(t("sc.input"))}</span><input class="tl-bv" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(st.v)}"></label>
      <label class="tl-field tl-narrow"><span>${esc(t("sc.base.from"))}</span><select class="tl-bb">${[2, 8, 10, 16].map((b) => `<option value="${b}"${b === st.b ? " selected" : ""}>${b}</option>`).join("")}</select></label></div>
      <div class="tl-pair"><label class="tl-field tl-narrow"><span>${esc(t("sc.base.op"))}</span><select class="tl-bo">${ops.map((o) => `<option value="${o}"${o === st.op ? " selected" : ""}>${esc(opName(o))}</option>`).join("")}</select></label>
      <label class="tl-field tl-bw-f"><span>${esc(t("sc.base.second"))}</span><input class="tl-bw" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(st.w)}"></label></div>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      st.v = el.querySelector(".tl-bv").value;
      st.b = Number(el.querySelector(".tl-bb").value);
      st.op = el.querySelector(".tl-bo").value;
      st.w = el.querySelector(".tl-bw").value;
      remember.set("evklid.tool.base", st);
      const binary = st.op && st.op !== "not" && st.op !== "neg";
      el.querySelector(".tl-bw-f").hidden = !binary;
      const out = el.querySelector(".tl-out");
      if (!st.v.trim()) return (out.innerHTML = "");
      const r = convertBase(st.v, st.b);
      if (!r) return (out.innerHTML = err(t("sc.base.invalid")));
      const names = { 2: "BIN", 8: "OCT", 10: "DEC", 16: "HEX" };
      const rows = (x) => [2, 8, 10, 16].map((b) => `<div class="tl-row"><span class="tl-k">${names[b]}</span><span class="tl-v tl-mono">${esc(x[b])}<sub>${b}</sub></span></div>`).join("");
      let logic = "";
      if (st.op) {
        const w = binary ? convertBase(st.w, st.b) : null;
        if (binary && !st.w.trim()) logic = "";
        else if (binary && !w) logic = err(t("sc.base.invalid"));
        else {
          // BIN/OCT/HEX od 2³¹ do 2³² − 1 je 32-bitni vzorec (kot Casio: FFFFFFFF = −1), DEC ostane s predznakom
          const bits = (v) => (st.b !== 10 && typeof v === "bigint" && v >= 2n ** 31n && v < 2n ** 32n ? BigInt.asIntN(32, v) : v);
          const lr = logic32(bits(r.value), bits(w?.value ?? null), st.op);
          logic = lr ? card(`<div class="tl-h">${esc(t("sc.base.result"))}: ${esc(opName(st.op))}</div>${rows(lr)}`) + `<p class="muted tl-note">${esc(t("sc.base.bits"))}</p>` : err(t("sc.base.range"));
        }
      }
      out.innerHTML = card(rows(r)) + logic;
    };
    el.addEventListener("input", run);
    el.addEventListener("change", run);
    run();
  }

  const ctx = { t, icon, num, card, err, insertBtn, comma };
  const chem = chemTools(ctx);
  const ana = anaTools(ctx);
  const BUILD = {
    rxn: chem.rxn,
    conc: chem.conc,
    solub: chem.solub,
    prob: (el) => probTool(el, ctx),
    tests: (el) => testsTool(el, ctx),
    tvm: (el) => tvmTool(el, ctx),
    table: (el) => tableTool(el, ctx),
    calc: ana.calc,
    vec: ana.vec,
    ode: ana.ode,
    err: ana.err,
    plot3: ana.plot3,
    units: (el) => createUnits(el, { t, icon, locale: opts.locale, onInsert: opts.onInsert }),
    stats: (el) => statsTool(el, ctx),
    sheet: (el) => sheetTool(el, ctx),
    trials: (el) => trialsTool(el, ctx),
    eq: eq_,
    complex: complex_,
    matrix: matrix_,
    base: base_,
  };
  function show(k) {
    tool = k;
    remember.set("evklid.tool", k);
    root.querySelectorAll(".tl-pick [data-tool]").forEach((b) => {
      b.classList.toggle("active", b.dataset.tool === k);
      b.setAttribute("aria-selected", String(b.dataset.tool === k));
    });
    if (!views[k]) {
      views[k] = document.createElement("div");
      views[k].className = `tl-view tl-${k}`;
      views[k]._api = BUILD[k](views[k]);
    }
    body.replaceChildren(views[k]);
    views[k]._api?.resize?.();
  }
  root.querySelector(".tl-pick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tool]");
    if (b) show(b.dataset.tool);
  });
  body.addEventListener("click", (e) => {
    const b = e.target.closest(".tl-ins");
    if (b) opts.onInsert?.(b.dataset.v);
  });
  let lastSubj = subj();
  show(tool);
  return {
    root,
    resize() {
      views[tool]?._api?.resize?.();
    },
    reload() {
      // ob drugem predmetu preuredimo čipe (kemija: najprej enačbe reakcij)
      if (subj() === lastSubj) return;
      lastSubj = subj();
      const pick = root.querySelector(".tl-pick");
      for (const k of toolOrder(lastSubj)) pick.append(pick.querySelector(`[data-tool="${k}"]`));
    },
    show,
  };
}

/**
 * Periodni sistem z molsko maso. opts: { t, icon, locale(), lang(), onInsert(text) }
 */
export function createPse(root, opts) {
  const { t, icon } = opts;
  const comma = () => usesComma(opts.locale?.());
  const dec = (v, d) => (comma() ? v.toFixed(d).replace(".", ",") : v.toFixed(d));
  const nm = (e) => (opts.lang?.() === "sl" ? e.sl : e.en);
  const arText = (e) => (e.ar == null ? `[${e.a}]` : dec(e.ar, e.ar < 10 ? 3 : 2));
  let sel = ELEMENTS[remember.get("evklid.pse.sel", 6) - 1] || ELEMENTS[5];

  root.classList.add("pse");
  let show = ["ar", "en", "ox"].includes(remember.get("evklid.pse.show")) ? remember.get("evklid.pse.show") : "ar";
  root.innerHTML = `<div class="pse-wrap">
      <div class="pse-bar"><span class="muted">${esc(t("sc.pse.show"))}</span><div class="seg pse-show" role="group" aria-label="${esc(t("sc.pse.show"))}">${["ar", "en", "ox"].map((k) => `<button type="button" data-show="${k}" aria-pressed="false">${esc(t(`sc.pse.show.${k}`))}</button>`).join("")}</div></div>
      <div class="pse-scroll"><div class="pse-grid" role="group" aria-label="${esc(t("sc.pseTitle"))}"></div></div>
      <div class="pse-legend">${CATEGORIES.map((c) => `<span class="pse-lg cat-${c}"><i></i>${esc(t(`sc.cat.${c}`))}</span>`).join("")}</div>
      <div class="pse-cards">
        <div class="card pse-detail" aria-live="polite"></div>
        <div class="card pse-mm">
          <label class="tl-field"><span>${esc(t("sc.molar"))}</span><input class="pse-f" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t("sc.formulaPh"))}" value="${esc(remember.get("evklid.pse.f", "H2SO4"))}"></label>
          <div class="pse-mm-out" aria-live="polite"></div>
        </div>
        <div class="card pse-bond">
          <div class="tl-h">${esc(t("sc.bond.title"))}</div>
          <div class="tl-pair"><label class="tl-field"><span>${esc(t("sc.bond.a"))}</span><input class="pse-b1" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(remember.get("evklid.pse.bond", ["Na", "Cl"])[0])}"></label><label class="tl-field"><span>${esc(t("sc.bond.b"))}</span><input class="pse-b2" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(remember.get("evklid.pse.bond", ["Na", "Cl"])[1])}"></label></div>
          <div class="pse-bond-out" aria-live="polite"></div>
        </div>
      </div>
    </div>`;
  const $ = (s) => root.querySelector(s);

  // mreža: 18 stolpcev, 7 period + 2 vrstici f
  const cells = [];
  for (const e of ELEMENTS) {
    let row = e.period;
    let col = e.group;
    if (e.f) {
      row = e.z < 89 ? 9 : 10;
      col = 3 + (e.z - (e.z < 89 ? 57 : 89));
    }
    cells.push(`<button type="button" class="pse-el cat-${e.cat}" style="grid-row:${row};grid-column:${col}" data-z="${e.z}" aria-label="${e.z} ${esc(nm(e))}"><small>${e.z}</small><b>${e.sym}</b><span class="pse-v"></span></button>`);
  }
  cells.push(`<div class="pse-ph cat-lanthanide" style="grid-row:6;grid-column:3" aria-hidden="true">57–71</div><div class="pse-ph cat-actinide" style="grid-row:7;grid-column:3" aria-hidden="true">89–103</div>`);
  $(".pse-grid").innerHTML = cells.join("");
  // številke skupin nad mrežo
  $(".pse-scroll").insertAdjacentHTML("afterbegin", `<div class="pse-groups" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<span>${i + 1}</span>`).join("")}</div>`);

  const enText = (x) => (x.en == null ? "—" : dec(x.en, 2));
  const oxText = (x) => (x.ox.length ? x.ox.map((o) => o.replace("-", "−")).join(", ") : "—");
  function cellValues() {
    root.querySelectorAll(".pse-show [data-show]").forEach((b) => {
      b.classList.toggle("active", b.dataset.show === show);
      b.setAttribute("aria-pressed", String(b.dataset.show === show));
    });
    root.querySelectorAll(".pse-el").forEach((b) => {
      const e = ELEMENTS[Number(b.dataset.z) - 1];
      const x = EXTRA[e.z - 1];
      b.querySelector(".pse-v").textContent = show === "en" ? enText(x) : show === "ox" ? (x.ox.length ? x.ox.slice(0, 2).map((o) => o.replace("-", "−")).join(" ") : "—") : arText(e);
    });
  }
  const confTex = (c) => c.replace(/^\[(\w+)\]\s*/, "[\\mathrm{$1}]\\,").replace(/(\d)([spdf])(\d+)/g, "$1\\mathrm{$2}^{$3}\\,");
  const tempText = (v) => (v == null ? "—" : `${dec(v, Math.abs(v) >= 100 ? 0 : 1)} °C`);
  function detail() {
    const e = sel;
    const x = EXTRA[e.z - 1];
    root.querySelectorAll(".pse-el").forEach((b) => b.classList.toggle("sel", Number(b.dataset.z) === e.z));
    const sh = shells(e.z);
    const M = e.ar ?? e.a;
    const row = (k, v) => `<div><dt>${esc(t(k))}</dt><dd>${v}</dd></div>`;
    $(".pse-detail").innerHTML = `<div class="pse-d-top">
        <div class="pse-big cat-${e.cat}">${texHtml(`{}^{${e.a}}_{${e.z}}\\mathrm{${e.sym}}`)}</div>
        <div class="pse-d-name"><b>${esc(nm(e))}</b><span class="muted">${esc(t(`sc.cat.${e.cat}`))}${e.ar == null ? ` · ${esc(t("sc.pse.radio"))}` : ""}</span></div>
      </div>
      <dl class="pse-dl">
        ${row("sc.pse.z", texHtml(`Z = ${e.z}`))}
        ${row("sc.pse.ar", texHtml(`A_r = ${e.ar == null ? `[${e.a}]` : arText(e).replace(",", "{,}")}`))}
        ${row("sc.pse.a", `${texHtml(`A = ${e.a}`)} <small class="muted">${esc(t(e.ar == null ? "sc.pse.aStable" : "sc.pse.aCommon"))}</small>`)}
        ${row("sc.pse.particles", texHtml(`p^+ = ${e.z},\\ n^0 = ${e.a - e.z},\\ e^- = ${e.z}`))}
        ${row("sc.pse.place", `${esc(t("sc.pse.group"))} ${e.f ? "3 (f)" : e.group} · ${esc(t("sc.pse.period"))} ${e.period}`)}
        ${row("sc.pse.conf", `${texHtml(confTex(x.conf))}${x.predicted ? ` <small class="muted">${esc(t("sc.pse.predicted"))}</small>` : ""}`)}
        ${sh ? row("sc.pse.shells", sh.join(", ")) : ""}
        ${row("sc.pse.en", x.en == null ? "—" : texHtml(`\\chi = ${enText(x).replace(",", "{,}")}`))}
        ${row("sc.pse.ox", esc(oxText(x)))}
        ${x.state ? row("sc.pse.state", esc(t(`sc.pse.state.${x.state}`))) : ""}
        ${x.mp != null || x.bp != null ? row("sc.pse.mpbp", `${esc(tempText(x.mp))} · ${esc(tempText(x.bp))}`) : ""}
        ${x.rho != null ? row("sc.pse.rho", x.state === "g" ? texHtml(`\\rho = ${dec(x.rho * 1000, 3).replace(",", "{,}")}\\ \\mathrm{g/L}`) : texHtml(`\\rho = ${dec(x.rho, 2).replace(",", "{,}")}\\ \\mathrm{g/cm^3}`)) : ""}
        ${row("sc.molar", texHtml(`M = ${(e.ar == null ? String(e.a) : arText(e)).replace(",", "{,}")}\\ \\mathrm{g/mol}`))}
      </dl>
      <div class="actions pse-act">
        <button type="button" class="secondary small pse-ins">${icon("calculator")}<span>${esc(t("sc.toCalc"))}</span></button>
        <button type="button" class="ghost small pse-add">${icon("plus")}<span>${esc(t("sc.pse.addFormula"))}</span></button>
      </div>`;
    $(".pse-ins").addEventListener("click", () => opts.onInsert?.(chemText(e.sym) || String(M).replace(".", comma() ? "," : ".")));
    $(".pse-add").addEventListener("click", () => {
      const f = $(".pse-f");
      f.value += e.sym;
      molar();
    });
  }

  function molar() {
    const f = $(".pse-f").value;
    remember.set("evklid.pse.f", f);
    const out = $(".pse-mm-out");
    if (!f.trim()) return (out.innerHTML = "");
    const r = molarMass(f, MASSES);
    if (!r) return (out.innerHTML = "");
    if (r.error) return (out.innerHTML = `<p class="tl-err">${icon("info")}<span>${esc(r.error === "element" ? t("sc.badElement", { sym: r.sym }) : t("sc.badFormula"))}</span></p>`);
    const texF = f.replace(/\s+/g, "").replace(/(\d+)/g, (m, d, i, s) => (i === 0 || /[·*•.]/.test(s[i - 1]) ? m : `_{${m}}`)).replace(/[·*•]/g, "\\cdot ").replace(/\^/g, "^");
    const rows = [...r.counts].map(([sym, n]) => {
      const ar = MASSES[sym];
      return `<tr><td>${esc(sym)}</td><td>${n}</td><td>${dec(ar, 3)}</td><td>${dec(n * ar, 3)}</td><td>${dec((100 * n * ar) / r.M, 2)} %</td></tr>`;
    });
    out.innerHTML = `<div class="pse-mm-res">${texHtml(`M(\\mathrm{${texF}}) = ${dec(r.M, 2).replace(",", "{,}")}\\ \\mathrm{g/mol}`)}</div>
      <table class="pse-tab"><thead><tr><th></th><th>N</th><th>${texHtml("A_r")}</th><th>${texHtml("N \\cdot A_r")}</th><th>${texHtml("w")}</th></tr></thead><tbody>${rows.join("")}</tbody></table>
      ${opts.onInsert ? `<div class="actions pse-act"><button type="button" class="secondary small pse-mm-ins">${icon("calculator")}<span>${esc(t("sc.toCalc"))}</span></button></div>` : ""}`;
    // cela formula v kalkulator: M(H₂SO₄) se tam izračuna kot molska masa in jo lahko uporabiš v računu
    out.querySelector(".pse-mm-ins")?.addEventListener("click", () => opts.onInsert(chemText(f) || dec(r.M, 3).replace(/0+$/, "").replace(/[.,]$/, "")));
  }

  $(".pse-grid").addEventListener("click", (e) => {
    const b = e.target.closest(".pse-el");
    if (!b) return;
    sel = ELEMENTS[Number(b.dataset.z) - 1];
    remember.set("evklid.pse.sel", sel.z);
    detail();
    // na telefonu so podrobnosti pod mrežo
    if (matchMedia("(max-width: 860px)").matches) $(".pse-detail").scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  function bond() {
    const a = $(".pse-b1").value.trim();
    const b = $(".pse-b2").value.trim();
    remember.set("evklid.pse.bond", [a, b]);
    const out = $(".pse-bond-out");
    if (!a || !b) return (out.innerHTML = "");
    const ea = ELEMENTS.find((e) => e.sym === a);
    const eb = ELEMENTS.find((e) => e.sym === b);
    const bad = !ea ? a : !eb ? b : null;
    if (bad) return (out.innerHTML = `<p class="tl-err">${icon("info")}<span>${esc(t("sc.badElement", { sym: bad }))}</span></p>`);
    const xa = EXTRA[ea.z - 1].en;
    const xb = EXTRA[eb.z - 1].en;
    if (xa == null || xb == null) return (out.innerHTML = `<p class="tl-err">${icon("info")}<span>${esc(t("sc.bond.noEn", { sym: xa == null ? a : b }))}</span></p>`);
    const d = Math.abs(xa - xb);
    const metal = (e) => !["nonmetal", "halogen", "noble", "metalloid"].includes(e.cat);
    const kind = metal(ea) && metal(eb) ? "metal" : d < 0.4 ? "nonpolar" : d <= 1.7 ? "polar" : "ionic";
    out.innerHTML = `<div class="tl-row"><span class="tl-v">${texHtml(`\\Delta\\chi = |${dec(xa, 2).replace(",", "{,}")} - ${dec(xb, 2).replace(",", "{,}")}| = ${dec(d, 2).replace(",", "{,}")}`)}</span></div>
      <p class="pse-bond-kind"><b>${esc(t(`sc.bond.${kind}`))}</b></p><p class="muted tl-note">${esc(t(kind === "metal" ? "sc.bond.metalNote" : "sc.bond.note"))}</p>`;
  }
  root.querySelector(".pse-show").addEventListener("click", (e) => {
    const b = e.target.closest("[data-show]");
    if (!b) return;
    show = b.dataset.show;
    remember.set("evklid.pse.show", show);
    cellValues();
  });
  $(".pse-f").addEventListener("input", molar);
  $(".pse-b1").addEventListener("input", bond);
  $(".pse-b2").addEventListener("input", bond);
  cellValues();
  detail();
  molar();
  bond();
  return { root, resize() {}, reload() {} };
}

/**
 * Formule in konstante predmeta (content/formulas/*.md prek /api/formulas).
 * opts: { t, icon, api, renderRich, withSymbols(subject, fn, glossary), bookKey() }
 * Vsak razdelek se izriše s predmetom lista in svojimi oznakami (:::simboli v .md), da ima črka
 * pomen iz tega razdelka (a pri »Številih« poljubno število, ne pospešek iz fizike).
 */
let skIo = null;
const skiceIo = () =>
  (skIo ||= new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting || !e.target._load) continue;
      const host = e.target;
      const load = host._load;
      host._load = null;
      skIo.unobserve(host);
      load()
        .then((m) => m.default(host))
        .catch((err) => {
          // Skica se ni naložila: kartica ostane taka kot brez skice.
          console.warn("skica", err);
          host.closest(".fm-item")?.classList.remove("has-skica");
          (host.closest(".fm-skica-row") || host).remove();
        });
    }
  }, { rootMargin: "200px" }));

export function createFormulas(root, opts) {
  const { t } = opts;
  const SUBJ = ["MAT", "FIZ", "KEM"];
  const LVL = { OS: "lp.os", SS: "lp.ss", UNI: "lp.uni" };
  const BOOKS = SUBJ.flatMap((s) => Object.keys(LVL).map((l) => `${s}-${l}`));
  let book = null;
  const cache = {};
  root.classList.add("fm");
  const seg = (cls, label, items) =>
    `<div class="seg ${cls}" role="tablist" aria-label="${esc(label)}">${items.map(([k, txt]) => `<button type="button" role="tab" data-k="${k}">${esc(txt)}</button>`).join("")}</div>`;
  root.innerHTML = `<div class="fm-wrap"><div class="fm-bar"><div class="fm-sel">${seg("fm-subj", t("set.subject"), SUBJ.map((s) => [s, t(`subj.${s}`)]))}${seg("fm-lvl", t("set.school"), Object.entries(LVL).map(([l, key]) => [l, t(key)]))}</div></div><div class="chip-row fm-toc" hidden></div><div class="fm-body textbook-md"></div></div>`;
  const body = root.querySelector(".fm-body");
  const toc = root.querySelector(".fm-toc");

  // Markdown zbirke razdelimo na kartice po naslovih; dvostolpčne tabele postanejo vrstice »ime + formula«,
  // da se na telefonu ime postavi nad formulo in se formula ne lomi sredi izraza.
  function layout(html) {
    const src = document.createElement("div");
    src.innerHTML = html;
    const out = document.createElement("div");
    let sec = null;
    const newSec = (h) => {
      sec = document.createElement("section");
      sec.className = "card fm-sec";
      if (h) {
        sec.id = `fm-${book}-${out.children.length}`;
        sec.append(h);
      }
      out.append(sec);
    };
    for (const el of [...src.children]) {
      if (el.tagName === "H2") {
        newSec(el);
        continue;
      }
      if (!sec) newSec(null);
      // renderRich ovije tabelo v .md-table-wrap (pomik vstran); široke tabele ostanejo v njem.
      const tbl = el.classList.contains("md-table-wrap") ? el.querySelector("table") : el;
      const rows = tbl?.tagName === "TABLE" ? [...tbl.querySelectorAll("tr")] : [];
      if (rows.length && rows.every((r) => r.children.length === 2)) {
        const list = document.createElement("div");
        list.className = "fm-list";
        for (const r of rows) {
          const [a, b] = r.children;
          if (!a.textContent.trim() && !b.textContent.trim()) continue;
          const item = document.createElement("div");
          // Prazno ime: še ena formula pod istim imenom (rich.js da vsaki formuli svojo vrstico).
          item.className = r.parentElement.tagName === "THEAD" ? "fm-item fm-head" : a.textContent.trim() ? "fm-item" : "fm-item fm-cont";
          item.innerHTML = `<div class="fm-name">${a.innerHTML}</div><div class="fm-f">${b.innerHTML}</div>`;
          calcButton(item);
          // Interaktivna skica nad formulami kartice (public/skice/), naloži se, ko je kartica vidna.
          const host = skicaHost(imeKartice(a));
          if (host) {
            item.classList.add("has-skica");
            item.insertBefore(host, item.querySelector(":scope > .fm-fx, :scope > .fm-f"));
          }
          list.append(item);
        }
        sec.append(list);
      } else {
        // Tabela z več stolpci (npr. Lik | Obseg | Ploščina): skica v svoji vrstici pod vrstico lika.
        for (const r of rows) {
          if (r.parentElement.tagName === "THEAD" || !r.children.length) continue;
          const host = skicaHost(imeKartice(r.children[0]));
          if (!host) continue;
          const tr = document.createElement("tr");
          tr.className = "fm-skica-row";
          const td = document.createElement("td");
          td.colSpan = r.children.length;
          td.append(host);
          tr.append(td);
          r.after(tr);
        }
        sec.append(el);
      }
    }
    return out;
  }

  // Gumb »V kalkulator« ob formuli, ki jo kalkulator zna (public/graph/formula-calc.js): formula se vpiše
  // v znanstveni kalkulator, učenec zamenja znane črke s števili in kalkulator izračuna neznanko.
  function calcButton(item) {
    if (!opts.onInsert || item.classList.contains("fm-head")) return;
    const f = item.querySelector(".fm-f");
    const subject = book.split("-")[0];
    let text = null;
    for (const a of f.querySelectorAll('.katex-mathml annotation[encoding="application/x-tex"]')) if ((text = formulaToCalc(a.textContent, subject))) break;
    if (!text) return;
    const box = document.createElement("div");
    box.className = "fm-fx";
    f.replaceWith(box);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ghost icon-only fm-calc";
    btn.dataset.calc = text;
    btn.title = t("sc.toCalc");
    btn.setAttribute("aria-label", `${t("sc.toCalc")}: ${text}`);
    btn.innerHTML = opts.icon("calculator");
    box.append(f, btn);
  }

  // Vidno ime kartice brez skritega MathML (»Diagonale n-kotnika«); skicaZa ga primerja z imenom brez $.
  function imeKartice(cell) {
    const c = cell.cloneNode(true);
    c.querySelectorAll(".katex-mathml").forEach((x) => x.remove());
    return c.textContent;
  }

  // Interaktivna skica nad formulami kartice (public/skice/), naloži se, ko je kartica vidna.
  function skicaHost(ime) {
    const sk = skicaZa(book, ime);
    if (!sk) return null;
    const host = document.createElement("div");
    host.className = "fm-skica";
    skiceIo().observe(host);
    host._load = sk;
    return host;
  }

  function markActive() {
    const [s, l] = book.split("-");
    for (const [sel, key] of [[".fm-subj", s], [".fm-lvl", l]]) {
      root.querySelectorAll(`${sel} [data-k]`).forEach((x) => {
        x.classList.toggle("active", x.dataset.k === key);
        x.setAttribute("aria-selected", String(x.dataset.k === key));
      });
    }
  }

  async function show(b) {
    book = BOOKS.includes(b) ? b : "MAT-OS";
    markActive();
    // Vsaka pot spodaj zamenja vsebino lista: skic, ki se še niso naložile, ne opazujemo več.
    if (skIo) for (const x of body.querySelectorAll(".fm-skica")) skIo.unobserve(x);
    const key = book;
    if (!(key in cache)) {
      body.innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;
      toc.hidden = true;
      try {
        const r = await opts.api(`/api/formulas?book=${key}`);
        cache[key] = r?.md ? r : null;
      } catch {
        cache[key] = null;
      }
      if (book !== key) return; // med nalaganjem je učenec izbral drug list
    }
    if (!cache[book]) {
      body.innerHTML = `<div class="card"><p class="muted">${esc(t("sc.formNone"))}</p></div>`;
      toc.hidden = true;
      return;
    }
    const subject = book.split("-")[0];
    const parts = cache[book].sections || [{ md: cache[book].md, symbols: null }];
    const html = parts.map((x) => (opts.withSymbols ? opts.withSymbols(subject, () => opts.renderRich(x.md), x.symbols) : opts.renderRich(x.md))).join("");
    body.replaceChildren(...layout(html).children);
    const secs = [...body.querySelectorAll(".fm-sec[id]")];
    toc.innerHTML = secs.map((x) => `<button type="button" data-sec="${x.id}">${esc(x.querySelector("h2").textContent)}</button>`).join("");
    toc.hidden = secs.length < 2;
    root.scrollTop = 0;
    spy();
  }

  // Formulo, širšo od zaslona, sirina.js (initSirina) zloži pri enačajih in malo pomanjša; šele potem se pomika.

  // čip poglavja, ki je trenutno na vrhu, je označen
  function spy() {
    if (toc.hidden) return;
    const top = toc.getBoundingClientRect().bottom + 8;
    let cur = null;
    for (const x of body.querySelectorAll(".fm-sec[id]")) if (x.getBoundingClientRect().top <= top + 1) cur = x.id;
    cur ??= body.querySelector(".fm-sec[id]")?.id;
    toc.querySelectorAll("[data-sec]").forEach((c) => {
      const on = c.dataset.sec === cur;
      // samo vodoravno pomikanje kazala (scrollIntoView bi prekinil gladko pomikanje strani)
      if (on && !c.classList.contains("active")) {
        const l = c.offsetLeft - toc.offsetLeft;
        if (l < toc.scrollLeft || l + c.offsetWidth > toc.scrollLeft + toc.clientWidth) toc.scrollLeft = l - 16;
      }
      c.classList.toggle("active", on);
    });
  }
  root.addEventListener("scroll", spy, { passive: true });

  root.querySelector(".fm-sel").addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (!b) return;
    const [s, l] = book.split("-");
    show(b.closest(".fm-subj") ? `${b.dataset.k}-${l}` : `${s}-${b.dataset.k}`);
  });
  body.addEventListener("click", (e) => {
    const b = e.target.closest(".fm-calc");
    if (b) opts.onInsert(b.dataset.calc, { replace: true, hint: t("sc.fmHint") });
  });
  toc.addEventListener("click", (e) => {
    const c = e.target.closest("[data-sec]");
    const sec = c && body.querySelector(`#${c.dataset.sec}`);
    if (!sec) return;
    // kazalo je prilepljeno na vrh pomičnega okna, zato ciljamo tik podenj
    root.scrollTo({ top: root.scrollTop + sec.getBoundingClientRect().top - root.getBoundingClientRect().top - toc.offsetHeight - 8, behavior: "smooth" });
  });
  return {
    root,
    resize() {}, // širino formul ob spremembi okna ureja sirina.js
    reload() {
      show(opts.bookKey?.() || book);
    },
    show,
  };
}
