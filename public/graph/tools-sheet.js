// Orodje Preglednica (Casio fx-991CW »Preglednica«): 5 × 45 celic, formule =A1+B2, polnjenje navzdol,
// vsota, povprečje, najmanjša in največja vrednost po stolpcih. Računanje: sheetcore.js.
// Vnos z Evklidovo tipkovnico (vrstica nad tipkami: =, A–E, :, $, sum, mean).
import { esc, texHtml, remember } from "./tools-kit.js";
import { configureKeyboard } from "../tipkovnica.js";
import { formatNumber } from "./scicore.js";
import { COLS, ROWS, cellName, parseCell, isFormula, evalSheet, columnStats, fill } from "./sheetcore.js";

const KEY = "evklid.tool.sheet";

export function sheetTool(el, ctx) {
  const { t, icon, insertBtn, comma } = ctx;
  const st = remember.get(KEY, null) || { cells: { A1: "2", A2: "=A1+3", B1: "=A1^2" }, sel: "A1" };
  if (!st.cells || typeof st.cells !== "object") st.cells = {};
  if (!parseCell(st.sel)) st.sel = "A1";
  const save = () => remember.set(KEY, st);
  let res = {};
  let sureAt = 0;

  const STATS = [
    ["sum", "Σ", "sc.sh.sum"],
    ["mean", "\\bar{x}", "sc.sh.mean"],
    ["min", "min", "sc.sh.min"],
    ["max", "max", "sc.sh.max"],
  ];
  const head = `<tr><th scope="col" class="tl-sh-corner"></th>${COLS.map((c) => `<th scope="col">${c}</th>`).join("")}</tr>`;
  const body = Array.from({ length: ROWS }, (_, r) => `<tr><th scope="row">${r + 1}</th>${COLS.map((c, ci) => `<td role="gridcell" tabindex="-1" data-c="${ci}" data-r="${r}" aria-label="${c}${r + 1}"></td>`).join("")}</tr>`).join("");
  const foot = STATS.map(([k, sym, key]) => `<tr data-st="${k}"><th scope="row" title="${esc(t(key))}" aria-label="${esc(t(key))}">${sym.startsWith("\\") ? texHtml(sym) : sym}</th>${COLS.map(() => "<td></td>").join("")}</tr>`).join("");
  el.innerHTML = `<div class="card tl-card tl-sh-bar">
      <div class="tl-sh-edit"><span class="tl-sh-name" aria-hidden="true"></span><input class="tl-sh-in" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" aria-label=""><button type="button" class="primary icon-only tl-sh-ok" aria-label="${esc(t("sc.sh.ok"))}" title="${esc(t("sc.sh.ok"))}">${icon("check")}</button></div>
      <div class="tl-sh-val" aria-live="polite"></div>
      <div class="chip-row tl-sh-acts"><button type="button" data-act="fill">${esc(t("sc.sh.fill"))}</button><button type="button" data-act="clear">${esc(t("sc.sh.clear"))}</button><button type="button" data-act="all">${esc(t("sc.sh.clearAll"))}</button></div>
      <div class="tl-sh-fill" hidden><label class="tl-field tl-inline"><span class="tl-sh-fl"></span><input class="tl-sh-to" inputmode="numeric" autocomplete="off"></label><button type="button" class="primary" data-act="fillGo">${esc(t("sc.sh.fillGo"))}</button></div>
    </div>
    <div class="tl-sh-wrap"><table class="tl-sh" role="grid" aria-label="${esc(t("sc.tool.sheet"))}"><thead>${head}</thead><tbody>${body}</tbody><tfoot>${foot}</tfoot></table></div>
    <p class="muted tl-note">${esc(t("sc.sh.hint"))}</p>`;
  const input = el.querySelector(".tl-sh-in");
  const grid = el.querySelector(".tl-sh");
  const valBox = el.querySelector(".tl-sh-val");
  const fillBox = el.querySelector(".tl-sh-fill");
  const td = (name) => {
    const p = parseCell(name);
    return p && grid.querySelector(`td[data-c="${p.c}"][data-r="${p.r}"]`);
  };
  configureKeyboard(input, {
    math: true,
    parsed: true,
    layers: ["num", "fx", "sym", "abc"],
    start: "num",
    enter: "next",
    ctx: [["=", "="], ...COLS.map((c) => [c, c]), [":", ":"], ["$", "$"], ["sum", "sum(@)"], ["mean", "mean(@)"], ["min", "min(@)"], ["max", "max(@)"]],
  });

  // vrednost celice za prikaz v mreži (kratko) in v vrstici nad njo (8 mest)
  const short = (v) => formatNumber(Number(v.toPrecision(6)), { comma: comma() }).text.replace(" · 10^", "E");
  const errText = (code) => t(code === "cycle" ? "sc.sh.errCycle" : code === "ref" ? "sc.sh.errRef" : code === "undef" ? "sc.sh.errUndef" : "gc.errSyntax");

  function recalc() {
    res = evalSheet(st.cells, { comma: comma() });
    for (const cell of grid.querySelectorAll("tbody td")) {
      const name = cellName(Number(cell.dataset.c), Number(cell.dataset.r));
      const x = res[name] || {};
      cell.className = x.err ? "tl-sh-err" : x.text != null ? "tl-sh-txt" : "";
      cell.textContent = x.err ? t("sc.sh.errShort") : x.text != null ? x.text : Number.isFinite(x.v) ? short(x.v) : "";
      cell.title = st.cells[name] || "";
    }
    const cs = columnStats(res);
    for (const tr of grid.querySelectorAll("tfoot tr")) {
      const k = tr.dataset.st;
      tr.querySelectorAll("td").forEach((c, i) => (c.textContent = cs[i] ? short(cs[i][k]) : ""));
    }
    showSel();
  }

  function showSel() {
    const name = st.sel;
    el.querySelector(".tl-sh-name").textContent = name;
    input.setAttribute("aria-label", `${t("sc.sh.cell")} ${name}`);
    if (document.activeElement !== input) input.value = st.cells[name] ?? "";
    grid.querySelectorAll("td[aria-selected]").forEach((c) => {
      c.removeAttribute("aria-selected");
      c.tabIndex = -1;
    });
    const cell = td(name);
    if (cell) {
      cell.setAttribute("aria-selected", "true");
      cell.tabIndex = 0;
    }
    const x = res[name] || {};
    valBox.innerHTML = x.err
      ? `<span class="tl-err">${icon("info")}<span>${esc(errText(x.err))}</span></span>`
      : Number.isFinite(x.v)
        ? `<span class="tl-v">${esc(name)} = ${esc(formatNumber(Number(x.v.toPrecision(10)), { comma: comma() }).text)}</span>${insertBtn(x.v)}`
        : "";
    fillBox.hidden = true;
  }

  // vpis iz vrstice v izbrano celico
  function commit() {
    const v = input.value.trim();
    if ((st.cells[st.sel] ?? "") === v) return false;
    if (v) st.cells[st.sel] = v;
    else delete st.cells[st.sel];
    save();
    recalc();
    return true;
  }
  function select(name, { focusCell = false } = {}) {
    if (!parseCell(name)) return;
    if (document.activeElement === input) commit();
    st.sel = name;
    save();
    input.value = st.cells[name] ?? "";
    showSel();
    const cell = td(name);
    cell?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    if (focusCell) cell?.focus();
  }
  const move = (dr, dc) => {
    const p = parseCell(st.sel);
    select(cellName(Math.min(COLS.length - 1, Math.max(0, p.c + dc)), Math.min(ROWS - 1, Math.max(0, p.r + dr))), { focusCell: document.activeElement !== input });
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
      const p = parseCell(st.sel);
      // naprej v naslednjo vrstico; vrstica za pisanje ostane odprta (hiter vnos stolpca)
      st.sel = cellName(p.c, Math.min(ROWS - 1, p.r + 1));
      save();
      input.value = st.cells[st.sel] ?? "";
      showSel();
      td(st.sel)?.scrollIntoView?.({ block: "nearest" });
    } else if (e.key === "Escape") {
      input.value = st.cells[st.sel] ?? "";
      e.stopPropagation();
    }
  });
  el.querySelector(".tl-sh-ok").addEventListener("click", () => {
    commit();
    showSel();
  });
  input.addEventListener("blur", () => {
    // zapusti vrstico (ne med izbiro sklica v formuli): vpis velja
    setTimeout(() => {
      if (document.activeElement !== input && commit()) showSel();
    }, 0);
  });

  // dotik celice med pisanjem formule vstavi njen sklic (kot v Excelu); sicer jo izbere
  grid.addEventListener("pointerdown", (e) => {
    const cell = e.target.closest("tbody td");
    if (!cell || document.activeElement !== input || !isFormula(input.value)) return;
    const name = cellName(Number(cell.dataset.c), Number(cell.dataset.r));
    if (name === st.sel) return;
    e.preventDefault();
    const s = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? s;
    input.setRangeText(name, s, end, "end");
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: name }));
    grid.dataset.pointed = "1";
  });
  grid.addEventListener("click", (e) => {
    const cell = e.target.closest("tbody td");
    if (!cell) return;
    if (grid.dataset.pointed) {
      delete grid.dataset.pointed;
      return;
    }
    const name = cellName(Number(cell.dataset.c), Number(cell.dataset.r));
    if (name === st.sel) input.focus();
    else select(name, { focusCell: true });
  });
  grid.addEventListener("keydown", (e) => {
    if (!e.target.closest("tbody td")) return;
    const k = e.key;
    const arrows = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (arrows[k]) {
      e.preventDefault();
      const [dr, dc] = arrows[k];
      const rtl = getComputedStyle(grid).direction === "rtl";
      move(dr, rtl ? -dc : dc);
    } else if (k === "Enter" || k === "F2") {
      e.preventDefault();
      input.focus();
    } else if (k === "Delete" || k === "Backspace") {
      e.preventDefault();
      delete st.cells[st.sel];
      save();
      recalc();
    } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // tipkanje na izbrani celici začne nov vpis
      e.preventDefault();
      input.value = k;
      input.focus();
      input.setSelectionRange(1, 1);
    }
  });

  el.querySelector(".tl-sh-acts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "clear") {
      delete st.cells[st.sel];
      input.value = "";
      save();
      recalc();
    } else if (act === "all") {
      // drugi dotik v 4 s res počisti (brez okna za potrditev)
      if (Date.now() - sureAt > 4000) {
        sureAt = Date.now();
        b.textContent = t("sc.sh.clearSure");
        b.classList.add("danger");
        setTimeout(() => {
          b.textContent = t("sc.sh.clearAll");
          b.classList.remove("danger");
        }, 4000);
        return;
      }
      sureAt = 0;
      st.cells = {};
      st.sel = "A1";
      input.value = "";
      save();
      recalc();
      b.textContent = t("sc.sh.clearAll");
      b.classList.remove("danger");
    } else if (act === "fill") {
      if (document.activeElement === input) commit();
      const p = parseCell(st.sel);
      el.querySelector(".tl-sh-fl").textContent = t("sc.sh.fillTo", { cell: st.sel });
      const to = el.querySelector(".tl-sh-to");
      to.value = String(Math.min(ROWS, p.r + 10));
      fillBox.hidden = !fillBox.hidden;
      if (!fillBox.hidden) to.focus();
    }
  });
  const doFill = () => {
    const p = parseCell(st.sel);
    const to = Math.round(Number(el.querySelector(".tl-sh-to").value));
    if (!Number.isFinite(to) || to < 1 || to > ROWS || to - 1 === p.r) return;
    st.cells = fill(st.cells, st.sel, cellName(p.c, to - 1));
    save();
    recalc();
  };
  el.querySelector('[data-act="fillGo"]').addEventListener("click", doFill);
  el.querySelector(".tl-sh-to").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doFill();
    }
  });

  input.value = st.cells[st.sel] ?? "";
  recalc();
  return {};
}
