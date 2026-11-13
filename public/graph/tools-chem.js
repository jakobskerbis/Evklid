// Kemijska orodja: enačbe reakcij s stehiometrijo, raztopine (pH, koncentracije, redčenje,
// masni delež) in tabela topnosti. Računanje je v chemcore.js.
import { esc, texHtml, remember } from "./tools-kit.js";
import { readNumber } from "./toolscore.js";
import { MASSES } from "./pse-data.js";
import { balance, speciesTex, stoich, phAll, phOf, solveConc, dilution, massFraction, parseSpecies, SOL_CATIONS, SOL_ANIONS, solubility, saltFormula } from "./chemcore.js";

/** ctx: { t, icon, num(v), card(html), err(msg), insertBtn(v), comma() } */
export function chemTools(ctx) {
  const { t, icon, num, card, err, insertBtn } = ctx;
  const field = (cls, label, value = "", extra = "") =>
    `<label class="tl-field"><span>${label}</span><input class="${cls}" inputmode="decimal" autocomplete="off" spellcheck="false" value="${esc(value)}"${extra}></label>`;
  const row = (tex, v, label = "") => `<div class="tl-row">${label ? `<span class="tl-k">${esc(label)}</span>` : ""}<span class="tl-v">${texHtml(tex)}</span>${v === undefined ? "" : insertBtn(v)}</div>`;
  const tnum = (v) => num(v).tex;
  // stehiometrija: 4 veljavna mesta, kot pri tehtanju v laboratoriju
  const t4 = (v) => num(Number.isFinite(v) && v !== 0 ? Number(v.toPrecision(4)) : v).tex;

  // ---- enačbe reakcij ----
  function rxn(el) {
    const saved = remember.get("evklid.tool.rxn", "Fe + O2 -> Fe2O3");
    el.innerHTML =
      card(`<label class="tl-field"><span>${esc(t("sc.rxn.input"))}</span><input class="tl-rxn" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(saved)}"></label>
        <p class="muted tl-note">${esc(t("sc.rxn.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div><div class="tl-st"></div>`;
    const inp = el.querySelector(".tl-rxn");
    const out = el.querySelector(".tl-out");
    const st = el.querySelector(".tl-st");
    let res = null;
    const known = {};
    function run() {
      remember.set("evklid.tool.rxn", inp.value);
      for (const k of Object.keys(known)) delete known[k];
      st.innerHTML = "";
      res = null;
      if (!inp.value.trim()) return (out.innerHTML = "");
      const r = balance(inp.value, MASSES);
      if (r.error) {
        const msg = { arrow: "sc.rxn.arrow", element: "sc.badElement", none: "sc.rxn.none", many: "sc.rxn.many" }[r.error] || "sc.badFormula";
        return (out.innerHTML = err(t(msg, { sym: r.sym || "" })));
      }
      res = r;
      const side = (list, off) => list.map((sp, i) => `${r.coef[off + i] > 1 ? r.coef[off + i] + "\\," : ""}${speciesTex(sp)}`).join(" + ");
      out.innerHTML = card(`<div class="tl-h">${esc(t("sc.rxn.balanced"))}</div><div class="tl-rx-eq">${texHtml(`${side(r.left, 0)} \\longrightarrow ${side(r.right, r.left.length)}`)}</div>`);
      table();
    }
    function table() {
      const all = [...res.left, ...res.right];
      const nL = res.left.length;
      st.innerHTML = card(`<div class="tl-h">${esc(t("sc.rxn.stoich"))}</div><p class="muted tl-note">${esc(t("sc.rxn.stoichHint"))}</p>
        <div class="tl-rx">${all
          .map((sp, i) =>
            sp.electron
              ? ""
              : `<div class="tl-rx-row"><span class="tl-rx-sp">${texHtml(`${res.coef[i] > 1 ? res.coef[i] + "\\," : ""}${speciesTex(sp)}`)}<small class="muted">${esc(i < nL ? t("sc.rxn.reactant") : t("sc.rxn.product"))} · ${texHtml(`M = ${tnum(sp.M)}`)}</small></span>
                <label class="tl-cell"><input class="tl-rm" data-i="${i}" inputmode="decimal" aria-label="${esc(t("sc.rxn.mass"))}"><span>g</span></label>
                <label class="tl-cell"><input class="tl-rn" data-i="${i}" inputmode="decimal" aria-label="${esc(t("sc.rxn.amount"))}"><span>mol</span></label></div>`,
          )
          .join("")}</div><div class="tl-rx-out" aria-live="polite"></div>`);
      st.querySelector(".tl-rx").addEventListener("input", (e) => {
        const x = e.target;
        const i = Number(x.dataset.i);
        const v = readNumber(x.value);
        // v vrstici je lahko vpisana le masa ali le množina
        const other = st.querySelector(`${x.matches(".tl-rm") ? ".tl-rn" : ".tl-rm"}[data-i="${i}"]`);
        if (x.value.trim()) other.value = "";
        if (!x.value.trim() || !Number.isFinite(v)) delete known[i];
        else known[i] = x.matches(".tl-rm") ? v / all[i].M : v;
        calc();
      });
    }
    function calc() {
      const box = st.querySelector(".tl-rx-out");
      const all = [...res.left, ...res.right];
      const r = stoich(res.coef, res.left.length, known);
      if (!r) return (box.innerHTML = "");
      const rows = all
        .map((sp, i) => {
          if (sp.electron) return "";
          const tag = r.limiting === i ? ` <span class="tl-tag">${esc(t("sc.rxn.limiting"))}</span>` : i < res.left.length && known[i] && r.limiting != null && known[i] > r.n[i] * (1 + 1e-9) ? ` <span class="tl-tag muted">${esc(t("sc.rxn.excess", { n: num(known[i] - r.n[i]).text }))}</span>` : "";
          return `<tr><td>${texHtml(speciesTex(sp))}${tag}</td><td>${texHtml(t4(r.n[i]))}</td><td>${texHtml(t4(r.n[i] * sp.M))}</td></tr>`;
        })
        .join("");
      box.innerHTML = `<table class="pse-tab tl-rx-tab"><thead><tr><th></th><th>${texHtml("n\\ /\\ \\mathrm{mol}")}</th><th>${texHtml("m\\ /\\ \\mathrm{g}")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    inp.addEventListener("input", run);
    run();
  }

  // ---- raztopine ----
  const CONC = ["ph", "acid", "conc", "dil", "w"];
  function conc(el) {
    let part = CONC.includes(remember.get("evklid.tool.concPart")) ? remember.get("evklid.tool.concPart") : "ph";
    el.innerHTML = `<div class="chip-row tl-sub" role="tablist">${CONC.map((k) => `<button type="button" role="tab" data-part="${k}">${esc(t(`sc.conc.${k}`))}</button>`).join("")}</div><div class="tl-part"></div>`;
    const box = el.querySelector(".tl-part");
    const views = {};
    const BUILD = { ph: ph_, acid: acid_, conc: conc_, dil: dil_, w: w_ };
    function show(k) {
      part = k;
      remember.set("evklid.tool.concPart", k);
      el.querySelectorAll(".tl-sub [data-part]").forEach((b) => {
        b.classList.toggle("active", b.dataset.part === k);
        b.setAttribute("aria-selected", String(b.dataset.part === k));
      });
      if (!views[k]) {
        views[k] = document.createElement("div");
        BUILD[k](views[k]);
      }
      box.replaceChildren(views[k]);
    }
    el.querySelector(".tl-sub").addEventListener("click", (e) => {
      const b = e.target.closest("[data-part]");
      if (b) show(b.dataset.part);
    });
    show(part);
  }

  const phRows = (r) =>
    row(`\\mathrm{pH} = ${tnum(r.ph)}`, r.ph) +
    row(`\\mathrm{pOH} = ${tnum(r.poh)}`, r.poh) +
    row(`[\\mathrm{H_3O^+}] = ${tnum(r.h)}\\ \\mathrm{mol/L}`, r.h) +
    row(`[\\mathrm{OH^-}] = ${tnum(r.oh)}\\ \\mathrm{mol/L}`, r.oh) +
    `<p class="tl-ph-kind"><b>${esc(t(Math.abs(r.ph - 7) < 0.005 ? "sc.ph.neutral" : r.ph < 7 ? "sc.ph.acidic" : "sc.ph.basic"))}</b> <span class="muted">${esc(t("sc.ph.at25"))}</span></p>`;

  function ph_(el) {
    const st = remember.get("evklid.tool.ph", { kind: "ph", v: "3" });
    const KINDS = [["ph", "pH"], ["poh", "pOH"], ["h", "[H₃O⁺]"], ["oh", "[OH⁻]"]];
    el.innerHTML = card(`<div class="tl-pair"><label class="tl-field tl-narrow"><span>${esc(t("sc.ph.known"))}</span><select class="tl-phk">${KINDS.map(([k, l]) => `<option value="${k}"${k === st.kind ? " selected" : ""}>${l}</option>`).join("")}</select></label>${field("tl-phv", esc(t("sc.ph.value")), st.v)}</div><p class="muted tl-note">${esc(t("sc.ph.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      st.kind = el.querySelector(".tl-phk").value;
      st.v = el.querySelector(".tl-phv").value;
      remember.set("evklid.tool.ph", st);
      const r = phAll(st.kind, readNumber(st.v));
      el.querySelector(".tl-out").innerHTML = r ? card(phRows(r)) : st.v.trim() ? err(t("sc.ph.bad")) : "";
    };
    el.addEventListener("input", run);
    el.addEventListener("change", run);
    run();
  }

  function acid_(el) {
    const st = remember.get("evklid.tool.acid", { type: "wa", c: "0,1", z: 1, K: "1,8E-5", kk: "K" });
    const TYPES = ["sa", "sb", "wa", "wb"];
    el.innerHTML = card(`<label class="tl-field"><span>${esc(t("sc.acid.type"))}</span><select class="tl-at">${TYPES.map((k) => `<option value="${k}"${k === st.type ? " selected" : ""}>${esc(t(`sc.acid.${k}`))}</option>`).join("")}</select></label>
      <div class="tl-pair">${field("tl-ac", texHtml("c\\ /\\ \\mathrm{(mol/L)}"), st.c)}
      <label class="tl-field tl-narrow tl-az"><span>${esc(t("sc.acid.z"))}</span><select class="tl-azs">${[1, 2, 3].map((k) => `<option${k === st.z ? " selected" : ""}>${k}</option>`).join("")}</select></label>
      <label class="tl-field tl-narrow tl-ak"><span><select class="tl-akk" aria-label="${esc(t("sc.acid.kind"))}"><option value="K"${st.kk === "K" ? " selected" : ""}></option><option value="pK"${st.kk === "pK" ? " selected" : ""}></option></select></span><input class="tl-akv" inputmode="decimal" autocomplete="off" value="${esc(st.K)}"></label></div>
      <p class="muted tl-note tl-acid-note"></p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      st.type = el.querySelector(".tl-at").value;
      st.c = el.querySelector(".tl-ac").value;
      st.z = Number(el.querySelector(".tl-azs").value);
      st.kk = el.querySelector(".tl-akk").value;
      st.K = el.querySelector(".tl-akv").value;
      remember.set("evklid.tool.acid", st);
      const strong = st.type[0] === "s";
      const base = st.type[1] === "b";
      el.querySelector(".tl-az").hidden = !strong;
      el.querySelector(".tl-ak").hidden = strong;
      const [o1, o2] = el.querySelectorAll(".tl-akk option");
      o1.textContent = base ? "Kb" : "Ka";
      o2.textContent = base ? "pKb" : "pKa";
      el.querySelector(".tl-acid-note").textContent = t(strong ? (base ? "sc.acid.noteSb" : "sc.acid.noteSa") : "sc.acid.noteW");
      const c = readNumber(st.c);
      const kv = readNumber(st.K);
      const K = st.kk === "pK" ? 10 ** -kv : kv;
      const r = phOf(st.type, c, { z: st.z, K });
      el.querySelector(".tl-out").innerHTML = r ? card(phRows(r) + (r.alpha !== undefined ? row(`\\alpha = ${tnum(r.alpha * 100)}\\ \\%`, undefined, t("sc.acid.alpha")) : "")) : "";
    };
    el.addEventListener("input", run);
    el.addEventListener("change", run);
    run();
  }

  function conc_(el) {
    const st = remember.get("evklid.tool.cn", { f: "NaCl", m: "5,85", n: "", V: "500", Vu: "mL", c: "", g: "", M: "" });
    const fld = (k, tex) => field(`tl-cn tl-cn-${k}`, texHtml(tex), st[k], ` data-k="${k}"`);
    el.innerHTML =
      card(`<label class="tl-field"><span>${esc(t("sc.cn.formula"))}</span><input class="tl-cnf" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t("sc.formulaPh"))}" value="${esc(st.f)}"></label>
      <div class="tl-grid2">${fld("m", "m\\ /\\ \\mathrm{g}")}${fld("n", "n\\ /\\ \\mathrm{mol}")}
      <label class="tl-field"><span>${texHtml("V")}</span><span class="tl-inline2"><input class="tl-cn tl-cn-V" data-k="V" inputmode="decimal" autocomplete="off" value="${esc(st.V)}"><select class="tl-cnvu" aria-label="${esc(t("sc.cn.unit"))}">${["L", "mL"].map((u) => `<option${u === st.Vu ? " selected" : ""}>${u}</option>`).join("")}</select></span></label>
      ${fld("c", "c\\ /\\ \\mathrm{(mol/L)}")}${fld("g", "\\gamma\\ /\\ \\mathrm{(g/L)}")}${fld("M", "M\\ /\\ \\mathrm{(g/mol)}")}</div>
      <p class="muted tl-note">${esc(t("sc.cn.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      st.f = el.querySelector(".tl-cnf").value;
      st.Vu = el.querySelector(".tl-cnvu").value;
      el.querySelectorAll(".tl-cn").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.cn", st);
      const k = {};
      for (const key of ["m", "n", "c", "g", "M"]) if (st[key].trim()) k[key] = readNumber(st[key]);
      if (st.V.trim()) k.V = readNumber(st.V) / (st.Vu === "mL" ? 1000 : 1);
      const sp = st.f.trim() ? parseSpecies(st.f, MASSES) : null;
      const out = el.querySelector(".tl-out");
      if (sp?.error) return (out.innerHTML = err(sp.error === "element" ? t("sc.badElement", { sym: sp.sym }) : t("sc.badFormula")));
      if (sp && !Number.isFinite(k.M)) k.M = sp.M;
      if (Object.values(k).some((v) => !Number.isFinite(v))) return (out.innerHTML = err(t("sc.cn.bad")));
      const v = solveConc(k);
      const given = new Set(Object.keys(k));
      if (sp && !st.M.trim()) given.delete("M");
      const lines = [
        ["M", `M = ${tnum(v.M)}\\ \\mathrm{g/mol}`],
        ["m", `m = ${tnum(v.m)}\\ \\mathrm{g}`],
        ["n", `n = ${tnum(v.n)}\\ \\mathrm{mol}`],
        ["V", `V = ${tnum(v.V)}\\ \\mathrm{L} = ${tnum(v.V * 1000)}\\ \\mathrm{mL}`],
        ["c", `c = ${tnum(v.c)}\\ \\mathrm{mol/L}`],
        ["g", `\\gamma = ${tnum(v.g)}\\ \\mathrm{g/L}`],
      ].filter(([key]) => Number.isFinite(v[key]) && !given.has(key));
      out.innerHTML = lines.length ? card(`<div class="tl-h">${esc(t("sc.cn.result"))}</div>${lines.map(([key, tex]) => row(tex, v[key])).join("")}<p class="muted tl-note">${texHtml("n = \\frac{m}{M},\\quad c = \\frac{n}{V},\\quad \\gamma = \\frac{m}{V}")}</p>`) : err(t("sc.cn.more"));
    };
    el.addEventListener("input", run);
    el.addEventListener("change", run);
    run();
  }

  function dil_(el) {
    const st = remember.get("evklid.tool.dil", { c1: "2", V1: "50", c2: "0,5", V2: "" });
    el.innerHTML = card(`<div class="tl-formula">${texHtml("c_1 V_1 = c_2 V_2")}</div><div class="tl-grid2">${["c1", "V1", "c2", "V2"].map((k) => field(`tl-dl`, texHtml(`${k[0]}_${k[1]}`), st[k], ` data-k="${k}"`)).join("")}</div><p class="muted tl-note">${esc(t("sc.dil.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      el.querySelectorAll(".tl-dl").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.dil", st);
      const v = {};
      for (const k of ["c1", "V1", "c2", "V2"]) v[k] = st[k].trim() ? readNumber(st[k]) : undefined;
      const r = dilution(v);
      const miss = ["c1", "V1", "c2", "V2"].find((k) => v[k] === undefined);
      el.querySelector(".tl-out").innerHTML = r && miss && Number.isFinite(r[miss]) ? card(row(`${miss[0]}_${miss[1]} = ${tnum(r[miss])}`, r[miss]) + (r.V2 > r.V1 ? `<p class="muted tl-note">${esc(t("sc.dil.water"))}: ${texHtml(`V_2 - V_1 = ${tnum(r.V2 - r.V1)}`)}</p>` : "")) : err(t("sc.dil.three"));
    };
    el.addEventListener("input", run);
    run();
  }

  function w_(el) {
    const st = remember.get("evklid.tool.w", { mt: "20", mv: "80", mr: "", w: "" });
    const labels = { mt: `m_{\\text{${t("sc.w.solute")}}}\\ /\\ \\mathrm{g}`, mv: `m_{\\text{${t("sc.w.solvent")}}}\\ /\\ \\mathrm{g}`, mr: `m_{\\text{${t("sc.w.solution")}}}\\ /\\ \\mathrm{g}`, w: "w\\ /\\ \\%" };
    el.innerHTML = card(`<div class="tl-formula">${texHtml(`w = \\frac{m_{\\text{${t("sc.w.solute")}}}}{m_{\\text{${t("sc.w.solution")}}}}`)}</div><div class="tl-grid2">${["mt", "mv", "mr", "w"].map((k) => field("tl-wf", texHtml(labels[k]), st[k], ` data-k="${k}"`)).join("")}</div><p class="muted tl-note">${esc(t("sc.w.hint"))}</p>`) + `<div class="tl-out" aria-live="polite"></div>`;
    const run = () => {
      el.querySelectorAll(".tl-wf").forEach((x) => (st[x.dataset.k] = x.value));
      remember.set("evklid.tool.w", st);
      const v = {};
      for (const k of ["mt", "mv", "mr", "w"]) if (st[k].trim()) v[k] = readNumber(st[k]) / (k === "w" ? 100 : 1);
      const out = el.querySelector(".tl-out");
      if (Object.values(v).some((x) => !Number.isFinite(x))) return (out.innerHTML = err(t("sc.cn.bad")));
      const r = massFraction(v);
      const lines = ["mt", "mv", "mr", "w"].filter((k) => v[k] === undefined && Number.isFinite(r[k]));
      out.innerHTML = lines.length ? card(lines.map((k) => row(`${labels[k].split("\\ /")[0]} = ${k === "w" ? `${tnum(r.w * 100)}\\ \\%` : `${tnum(r[k])}\\ \\mathrm{g}`}`, k === "w" ? r.w * 100 : r[k])).join("")) : err(t("sc.cn.more"));
    };
    el.addEventListener("input", run);
    run();
  }

  // ---- tabela topnosti ----
  function solub(el) {
    const ionTex = ([s, z], sign) => `\\mathrm{${s.replace(/(\d+)/g, "_{$1}")}}^{${z > 1 ? z : ""}${sign}}`;
    const head = SOL_ANIONS.map((a, j) => `<th scope="col">${texHtml(ionTex(a, "-"))}</th>`).join("");
    const body = SOL_CATIONS.map((c, i) => `<tr><th scope="row">${texHtml(ionTex(c, "+"))}</th>${SOL_ANIONS.map((a, j) => {
      const k = solubility(i, j);
      const cls = { T: "t", M: "m", N: "n", "-": "x" }[k];
      return `<td><button type="button" class="sol-c sol-${cls}" data-i="${i}" data-j="${j}" aria-label="${esc(`${saltFormula(c, a)}: ${t(`sc.sol.${cls}`)}`)}">${k === "-" ? "–" : esc(t(`sc.sol.${cls}Short`))}</button></td>`;
    }).join("")}</tr>`).join("");
    el.innerHTML = `<div class="card tl-card"><div class="tl-h">${esc(t("sc.sol.title"))}</div><div class="sol-scroll"><table class="sol-tab"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table></div>
      <div class="sol-legend">${["t", "m", "n", "x"].map((k) => `<span><i class="sol-c sol-${k}">${k === "x" ? "–" : esc(t(`sc.sol.${k}Short`))}</i>${esc(t(`sc.sol.${k}`))}</span>`).join("")}</div>
      <p class="muted tl-note">${esc(t("sc.sol.note"))}</p></div><div class="tl-out sol-out" aria-live="polite"></div>`;
    const out = el.querySelector(".sol-out");
    el.querySelector(".sol-tab").addEventListener("click", (e) => {
      const b = e.target.closest(".sol-c");
      if (!b) return;
      el.querySelectorAll(".sol-c.sel").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      const c = SOL_CATIONS[b.dataset.i];
      const a = SOL_ANIONS[b.dataset.j];
      const k = { T: "t", M: "m", N: "n", "-": "x" }[solubility(b.dataset.i, b.dataset.j)];
      const f = saltFormula(c, a);
      const sp = parseSpecies(f, MASSES);
      out.innerHTML = card(`<div class="tl-mx-res">${texHtml(speciesTex(sp), true)}</div><p><b>${esc(t(`sc.sol.${k}`))}</b></p>${k === "x" ? "" : row(`M = ${tnum(sp.M)}\\ \\mathrm{g/mol}`, sp.M)}`);
    });
  }

  return { rxn, conc, solub };
}
