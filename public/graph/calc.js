// Grafični kalkulator – vmesnik: seznam izrazov, drsniki z animacijo, tabele z regresijo,
// tipkovnica za dotik, primeri, shranjeni grafi, izvoz slike in povezava z inštruktorjem.
import { buildModel, emptyState, newId, derivativeOf, sliderRange, MODELS, DEFAULT_DOMAIN, toNum } from "./model.js";
import { niceNumber, parse, compile } from "./math.js";
import { GraphView, PALETTE } from "./plot.js";
import { EXAMPLES } from "./examples.js";
import { configureKeyboard, initKeyboard, toggleKeyboard, keyboardOpenFor } from "../tipkovnica.js";

const MAX_HISTORY = 80;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clone = (o) => JSON.parse(JSON.stringify(o));
const isTouch = () => typeof matchMedia !== "undefined" && matchMedia("(hover: none) and (pointer: coarse)").matches;

/**
 * Ustvari kalkulator v elementu root.
 * opts: { t(key, vars), icon(name), locale(), storageKey(), api?, studentId(), toast(msg), askTutor?(text), canExport?, symbols?(panel, field) }
 * Brez api ni »Moji grafi« (stran /kalkulator brez prijave), brez askTutor ni »Vprašaj inštruktorja«.
 */
export function createCalculator(root, opts) {
  const { t, icon } = opts;
  const comma = () => {
    try {
      return (1.5).toLocaleString(opts.locale?.() || "sl").includes(",");
    } catch {
      return true;
    }
  };
  const fmt = (v, digits = 6) => niceNumber(toNum(v), { digits, comma: comma() }).replace("nedefinirano", t("gc.undefined"));
  const fmtFixed = (v, d) => {
    let s = Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-4 && v !== 0) ? niceNumber(v, { digits: 3, comma: comma() }) : v.toFixed(d);
    if (comma()) s = s.replace(".", ",");
    return s.replace(/^-/, "−");
  };
  const tex = (s, display = false) => {
    try {
      return window.katex.renderToString(s, { throwOnError: false, displayMode: display, strict: "ignore" });
    } catch {
      return esc(s);
    }
  };

  let state = load() || emptyState();
  let model = null;
  let focusId = null;
  const undo = [];
  const redo = [];
  let lastSnap = JSON.stringify(state);
  let snapTimer = null;
  let saveTimer = null;

  root.classList.add("gc");
  root.innerHTML = `
    <section class="gc-panel">
      <div class="gc-bar">
        <button type="button" class="gc-btn" data-act="add" title="${esc(t("common.add"))}" aria-label="${esc(t("common.add"))}">${icon("plus")}</button>
        <button type="button" class="gc-btn" data-act="undo" title="${esc(t("gc.undo"))}" aria-label="${esc(t("gc.undo"))}">${icon("undo-2")}</button>
        <button type="button" class="gc-btn" data-act="redo" title="${esc(t("gc.redo"))}" aria-label="${esc(t("gc.redo"))}">${icon("redo-2")}</button>
        <button type="button" class="gc-btn gc-playall" data-act="playall" data-on="false" hidden></button>
        <span class="gc-bar-sp"></span>
        <button type="button" class="gc-btn gc-text-btn" data-act="examples" title="${esc(t("gc.examples"))}">${icon("sparkles")}<span>${esc(t("gc.examples"))}</span></button>
        ${opts.api ? `<button type="button" class="gc-btn gc-text-btn" data-act="graphs" title="${esc(t("gc.myGraphs"))}">${icon("folder-open")}<span>${esc(t("gc.myGraphs"))}</span></button>` : ""}
        <button type="button" class="gc-btn" data-act="more" title="${esc(t("gc.more"))}" aria-label="${esc(t("gc.more"))}">${icon("ellipsis-vertical")}</button>
      </div>
      <div class="gc-list" role="list"></div>
      <p class="gc-help muted">${esc(t("gc.help"))}</p>
    </section>
    <section class="gc-stage">
      <div class="gc-graph"></div>
      <div class="gc-zoom">
        <button type="button" class="gc-fab" data-act="settings" title="${esc(t("gc.settings"))}" aria-label="${esc(t("gc.settings"))}">${icon("wrench")}</button>
        <button type="button" class="gc-fab" data-act="zoomin" title="${esc(t("gc.zoomIn"))}" aria-label="${esc(t("gc.zoomIn"))}">${icon("zoom-in")}</button>
        <button type="button" class="gc-fab" data-act="zoomout" title="${esc(t("gc.zoomOut"))}" aria-label="${esc(t("gc.zoomOut"))}">${icon("zoom-out")}</button>
        <button type="button" class="gc-fab" data-act="home" title="${esc(t("gc.home"))}" aria-label="${esc(t("gc.home"))}">${icon("house")}</button>
        <button type="button" class="gc-fab" data-act="fit" title="${esc(t("gc.fit"))}" aria-label="${esc(t("gc.fit"))}">${icon("maximize")}</button>
      </div>
      <button type="button" class="gc-fab gc-expand" data-act="expand" title="${esc(t("gc.fullGraph"))}" aria-label="${esc(t("gc.fullGraph"))}" aria-pressed="false">${icon("maximize-2")}</button>
    </section>
    <div class="gc-pop" hidden role="dialog"></div>`;
  const $ = (sel) => root.querySelector(sel);
  const list = $(".gc-list");
  const pop = $(".gc-pop");

  const view = new GraphView($(".gc-graph"), {
    getState: () => state,
    getModel: () => model,
    onView: () => scheduleSave(),
    onSelect: (id) => {
      list.querySelectorAll(".gc-row").forEach((r) => r.classList.toggle("selected", r.dataset.id === id));
      if (id) list.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: "nearest" });
    },
    onDrag: drag,
    onDragEnd: () => commit(),
    label: (k) => t(`gc.poi.${k}`),
    fmt: (v, digits) => fmt(v, digits), // oznake točk: značilna mesta
    axisFmt: (v, decimals) => fmtFixed(v, decimals), // števila na oseh
  });
  view.canvas.setAttribute("aria-label", t("gc.title"));

  // ---------- shranjevanje na napravi ----------

  function load() {
    try {
      const raw = localStorage.getItem(opts.storageKey());
      const s = raw && JSON.parse(raw);
      if (s?.items) return upgrade(s);
    } catch {
      /* ni shranjeno */
    }
    return null;
  }
  function upgrade(s) {
    const base = emptyState();
    // prazen graf vedno začne v običajnem oknu (prej se je lahko shranilo oddaljeno −150 … 150)
    const blank = !s.items.some((it) => it.type !== "expr" || String(it.text || "").trim());
    return { ...base, ...s, settings: { ...base.settings, ...(s.settings || {}) }, view: (!blank && s.view) || base.view, items: s.items.map((it) => ({ id: it.id || newId(), ...it })) };
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(opts.storageKey(), JSON.stringify(state));
      } catch {
        /* poln ali zasebni način */
      }
    }, 400);
  }

  // ---------- zgodovina (razveljavi) ----------

  function commit(immediate = true) {
    clearTimeout(snapTimer);
    const go = () => {
      const now = JSON.stringify({ ...state, view: undefined });
      const prev = JSON.stringify({ ...JSON.parse(lastSnap), view: undefined });
      if (now === prev) return;
      undo.push(lastSnap);
      if (undo.length > MAX_HISTORY) undo.shift();
      redo.length = 0;
      lastSnap = JSON.stringify(state);
      updateBar();
    };
    if (immediate) go();
    else snapTimer = setTimeout(go, 600);
    scheduleSave();
  }
  function restore(json) {
    const s = JSON.parse(json);
    state.items = s.items;
    state.settings = s.settings;
    lastSnap = json;
    renderList();
    refresh();
    updateBar();
    scheduleSave();
  }
  function updateBar() {
    $('[data-act="undo"]').disabled = !undo.length;
    $('[data-act="redo"]').disabled = !redo.length;
  }

  // ---------- model in osveževanje ----------

  function rebuild() {
    model = buildModel(state, { comma: comma() });
    for (const o of model.items) {
      const tools = o.src?.tools;
      if (tools && (tools.deriv || tools.tangent != null) && (o.kind === "y" || o.plot === "y")) o.deriv = derivativeOf(o, model, { comma: comma() });
    }
  }

  function refresh() {
    rebuild();
    for (const o of model.items) updateRow(o);
    updatePlayAll();
    view.draw();
  }

  // »Predvajaj vse«: vidno, ko sta vsaj dva drsnika; med predvajanjem ustavi vse
  const sliderItems = () => model.items.filter((o) => o.kind === "slider").map((o) => o.src);
  function updatePlayAll() {
    const btn = $(".gc-playall");
    const sliders = sliderItems();
    btn.hidden = sliders.length < 2;
    const on = sliders.some((it) => it.slider?.play);
    if (btn.dataset.on === String(on) && btn.innerHTML) return;
    btn.dataset.on = String(on);
    const label = t(on ? "gc.pauseAll" : "gc.playAll");
    btn.innerHTML = icon(on ? "pause" : "play");
    btn.title = label;
    btn.setAttribute("aria-label", label);
  }
  function togglePlayAll() {
    const sliders = sliderItems();
    const on = sliders.some((it) => it.slider?.play);
    for (const it of sliders) {
      const o = modelItem(it.id);
      it.slider = { ...sliderRange(o.value), ...(it.slider || {}), play: !on };
    }
    commit();
    refresh();
    animate();
  }

  const item = (id) => state.items.find((x) => x.id === id);
  const modelItem = (id) => model?.items.find((x) => x.id === id);

  // ---------- vrstice ----------

  function rowHtml(it, i) {
    if (it.type === "note") {
      return `<div class="gc-row gc-note" data-id="${it.id}" role="listitem">
        <div class="gc-side"><span class="gc-num">${i + 1}</span></div>
        <div class="gc-main"><textarea class="gc-input gc-note-in" rows="1" placeholder="${esc(t("gc.notePh"))}">${esc(it.text)}</textarea></div>
        <button type="button" class="gc-x" data-act="del" aria-label="${esc(t("gc.delete"))}">${icon("x")}</button></div>`;
    }
    if (it.type === "table") {
      return `<div class="gc-row gc-table-row" data-id="${it.id}" role="listitem">
        <div class="gc-side"><button type="button" class="gc-dot" data-act="vis" aria-label="${esc(t("gc.toggle"))}" style="--c: var(${PALETTE[(it.color ?? 0) % PALETTE.length]})">${icon("table")}</button><span class="gc-num">${i + 1}</span></div>
        <div class="gc-main"><div class="gc-tbl"></div><div class="gc-extra"></div></div>
        <div class="gc-acts"><button type="button" class="gc-x" data-act="menu" aria-label="${esc(t("gc.options"))}">${icon("ellipsis-vertical")}</button><button type="button" class="gc-x" data-act="del" aria-label="${esc(t("gc.delete"))}">${icon("x")}</button></div></div>`;
    }
    return `<div class="gc-row" data-id="${it.id}" role="listitem">
      <div class="gc-side"><button type="button" class="gc-dot" data-act="vis" aria-label="${esc(t("gc.toggle"))}" style="--c: var(${PALETTE[(it.color ?? 0) % PALETTE.length]})"></button><span class="gc-num">${i + 1}</span></div>
      <div class="gc-main">
        <div class="gc-math" tabindex="-1"></div>
        <input class="gc-input" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" placeholder="${esc(i === 0 ? t("gc.placeholder") : "")}" value="${esc(it.text)}">
        <div class="gc-preview" aria-hidden="true"></div>
        <div class="gc-extra"></div>
      </div>
      <div class="gc-acts"><button type="button" class="gc-x" data-act="menu" aria-label="${esc(t("gc.options"))}">${icon("ellipsis-vertical")}</button><button type="button" class="gc-x" data-act="del" aria-label="${esc(t("gc.delete"))}">${icon("x")}</button></div>
    </div>`;
  }

  function renderList() {
    if (!state.items.length) state.items.push({ id: newId(), type: "expr", text: "", color: nextColor() });
    list.innerHTML = state.items.map(rowHtml).join("");
    for (const it of state.items) if (it.type === "table") renderTable(it);
  }


  function nextColor() {
    const used = state.items.map((x) => x.color);
    for (let c = 0; c < PALETTE.length; c++) if (!used.includes(c)) return c;
    return state.items.length % PALETTE.length;
  }

  function errorText(e) {
    const names = (e.info?.names || []).join(", ");
    switch (e.code) {
      case "missing":
        return t("gc.errMissing", { names });
      case "twice":
        return t("gc.errTwice", { name: e.info.name });
      case "cycle":
        return t("gc.errCycle", { name: e.info.name });
      case "needEq":
        return t("gc.errNeedEq");
      case "onlyY":
        return t("gc.errOnlyY");
      case "char":
        return t("gc.errChar", { ch: e.info.ch });
      case "unknownFn":
        return t("gc.errChar", { ch: e.info.f });
      case "polInside":
        return t("sc.errPolInside");
      case "vecMix":
      case "vecOp":
        return t("sc.errVec");
      case "end":
      case "unexpected":
      case "needArg":
      case "emptyArgs":
      case "intD":
      case "sum":
        return t("gc.errSyntax");
      default:
        return t("gc.errOther");
    }
  }

  function updateRow(o) {
    const row = list.querySelector(`.gc-row[data-id="${o.id}"]`);
    if (!row) return;
    const it = o.src;
    const plotted = ["y", "x", "polar", "param", "implicit", "ineq-y", "ineq-x", "region", "points", "table"].includes(o.kind) || (o.kind === "func" && o.plot);
    row.classList.toggle("error", o.kind === "error");
    row.classList.toggle("empty", it.type === "expr" && !String(it.text || "").trim());
    row.classList.toggle("plotted", !!plotted);
    row.classList.toggle("hidden-item", !!it.hidden);
    row.classList.toggle("selected", view.selected === o.id);
    row.dataset.kind = o.kind;
    const dot = row.querySelector(".gc-dot");
    if (dot) {
      dot.style.setProperty("--c", `var(${PALETTE[(it.color ?? 0) % PALETTE.length]})`);
      dot.setAttribute("aria-pressed", String(!it.hidden));
    }
    if (it.type === "table") return updateTableExtra(o, row);
    if (it.type === "note") return;
    const input = row.querySelector(".gc-input");
    if (document.activeElement !== input && input.value !== it.text) input.value = it.text;
    const math = row.querySelector(".gc-math");
    const preview = row.querySelector(".gc-preview");
    const t1 = o.tex ? tex(o.tex) : "";
    math.innerHTML = t1 || `<span class="muted">${esc(it.text)}</span>`;
    preview.innerHTML = o.tex && o.kind !== "error" ? t1 : "";
    const extra = row.querySelector(".gc-extra");
    // drsnik med animacijo posodobimo na mestu: če bi ga vsako sličico zgradili znova,
    // gumb za ustavitev in drsnik ne bi nikoli dobila klika
    if (o.kind === "slider" && updateSliderInPlace(o, extra)) return;
    extra.innerHTML = extraHtml(o);
    if (o.kind === "slider") bindSlider(o, extra);
    if (o.kind === "param" || o.kind === "polar") bindDomain(o, extra);
  }

  function extraHtml(o) {
    const it = o.src;
    if (o.kind === "error") {
      const add = o.missing?.length ? `<button type="button" class="gc-chip" data-act="sliders">${icon("sliders-horizontal")}${esc(t("gc.addSliders", { names: o.missing.join(", ") }))}</button>` : "";
      return `<div class="gc-err">${icon("info")}<span>${esc(errorText(o.error))}</span></div>${add}`;
    }
    if (o.kind === "value" || o.kind === "define" || o.kind === "list") {
      if (o.kind === "list" && Array.isArray(o.value) && o.value.length > 30) return `<div class="gc-val">= ${esc(fmt(o.value))}</div>`;
      return `<div class="gc-val">= ${esc(fmt(o.value, 10))}</div>`;
    }
    if (o.kind === "slider") {
      const sl = { ...sliderRange(o.value), ...(it.slider || {}) };
      const val = Math.min(sl.max, Math.max(sl.min, o.value));
      return `<div class="gc-slider">
        <button type="button" class="gc-play" data-act="play" data-on="${!!it.slider?.play}" aria-label="${esc(it.slider?.play ? t("gc.pause") : t("gc.play"))}">${icon(it.slider?.play ? "pause" : "play")}</button>
        <input class="gc-lim" data-lim="min" value="${esc(fmt(sl.min))}" inputmode="decimal" aria-label="${esc(t("gc.min"))}">
        <input type="range" class="gc-range" min="${sl.min}" max="${sl.max}" step="${sl.step || "any"}" value="${val}" aria-label="${esc(o.name)}">
        <input class="gc-lim" data-lim="max" value="${esc(fmt(sl.max))}" inputmode="decimal" aria-label="${esc(t("gc.max"))}">
      </div>`;
    }
    if (o.kind === "param" || o.kind === "polar") {
      const v = o.kind === "param" ? "t" : "θ";
      const [a, b] = it.domain || DEFAULT_DOMAIN[o.kind];
      return `<div class="gc-domain"><input class="gc-lim" data-dom="0" value="${esc(piFmt(a))}" aria-label="${esc(t("gc.min"))}"><span>${tex(`\\le ${v === "θ" ? "\\theta" : v} \\le`)}</span><input class="gc-lim" data-dom="1" value="${esc(piFmt(b))}" aria-label="${esc(t("gc.max"))}"></div>`;
    }
    const parts = [];
    if ((o.kind === "y" || o.plot === "y") && o.deriv && it.tools?.deriv && o.deriv.tex) {
      const name = o.kind === "func" ? `${o.fname}'\\left(${o.varName}\\right)` : "y'";
      parts.push(`<div class="gc-val gc-deriv">${tex(`${name} = ${o.deriv.tex}`)}</div>`);
    }
    if ((o.kind === "y" || o.plot === "y") && it.tools?.tangent != null && o.deriv) {
      const x0 = it.tools.tangent;
      const y0 = toNum(o.fn(x0));
      const k = toNum(o.deriv.fn(x0));
      const n = y0 - k * x0;
      if (Number.isFinite(k) && Number.isFinite(y0)) {
        const num = (v) => fmt(Number(v.toPrecision(4))).replace("−", "-").replace(",", "{,}");
        const nTxt = Math.abs(n) < 1e-12 ? "" : n < 0 ? ` - ${num(-n)}` : ` + ${num(n)}`;
        parts.push(`<div class="gc-val">${icon("trending-up")}<span>${t("gc.tangent")}: ${tex(`y = ${num(k)}x${nTxt}`)}</span></div>`);
      }
    }
    return parts.join("");
  }

  // 6,283 → 2π (meje parametrov so pogosto večkratniki π)
  function piFmt(v) {
    if (v === 0) return "0";
    for (const d of [1, 2, 3, 4, 6]) {
      const k = (v / Math.PI) * d;
      if (Math.abs(k - Math.round(k)) < 1e-9 && Math.abs(k) < 1000) {
        const n = Math.round(k);
        const num = n === 1 ? "π" : n === -1 ? "−π" : `${String(n).replace("-", "−")}π`;
        return d === 1 ? num : `${num}/${d}`;
      }
    }
    return fmt(v, 4);
  }

  function updateSliderInPlace(o, extra) {
    const box = extra.querySelector(".gc-slider");
    if (!box) return false;
    const it = o.src;
    const sl = { ...sliderRange(o.value), ...(it.slider || {}) };
    const play = !!it.slider?.play;
    const btn = box.querySelector(".gc-play");
    if (btn.dataset.on !== String(play)) {
      btn.dataset.on = String(play);
      btn.setAttribute("aria-label", t(play ? "gc.pause" : "gc.play"));
      btn.innerHTML = icon(play ? "pause" : "play");
    }
    const range = box.querySelector(".gc-range");
    range.min = sl.min;
    range.max = sl.max;
    range.step = sl.step || "any";
    if (document.activeElement !== range || play) range.value = Math.min(sl.max, Math.max(sl.min, o.value));
    box.querySelectorAll("[data-lim]").forEach((inp) => {
      if (document.activeElement !== inp) inp.value = fmt(sl[inp.dataset.lim]);
    });
    return true;
  }

  function bindSlider(o, extra) {
    const range = extra.querySelector(".gc-range");
    range.addEventListener("input", () => {
      // premik z roko ustavi samodejno predvajanje (nazaj na ročno)
      const it = item(o.id);
      if (it?.slider?.play) it.slider.play = false;
      setSlider(o.id, Number(range.value), false);
    });
    range.addEventListener("change", () => commit());
    extra.querySelectorAll("[data-lim]").forEach((inp) =>
      inp.addEventListener("change", () => {
        const it = item(o.id);
        const v = Number(inp.value.replace(",", ".").replace("−", "-"));
        if (!Number.isFinite(v)) return refresh();
        it.slider = { ...sliderRange(modelItem(o.id)?.value ?? o.value), ...(it.slider || {}), [inp.dataset.lim]: v };
        if (it.slider.min >= it.slider.max) it.slider[inp.dataset.lim === "min" ? "max" : "min"] = v + (inp.dataset.lim === "min" ? 1 : -1);
        it.slider.step = niceStepFor(it.slider.max - it.slider.min);
        commit();
        refresh();
      }),
    );
  }
  const niceStepFor = (span) => {
    const raw = span / 200;
    const p = 10 ** Math.floor(Math.log10(raw));
    return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw);
  };

  function bindDomain(o, extra) {
    extra.querySelectorAll("[data-dom]").forEach((inp) =>
      inp.addEventListener("change", () => {
        const it = item(o.id);
        let v;
        try {
          const ast = parse(inp.value);
          v = toNum(compileConst(ast));
        } catch {
          v = NaN;
        }
        if (!Number.isFinite(v)) return refresh();
        const d = [...(it.domain || DEFAULT_DOMAIN[o.kind])];
        d[Number(inp.dataset.dom)] = v;
        it.domain = d;
        commit();
        refresh();
      }),
    );
  }
  // meja parametra: število ali izraz brez spremenljivk (2π, pi/2 …)
  function compileConst(ast) {
    return compile(ast, { deg: state.settings.deg })({});
  }

  function setSlider(id, value, record = true) {
    const it = item(id);
    if (!it) return;
    const name = /^\s*([^=]+?)\s*=/.exec(it.text)?.[1] || "a";
    const step = it.slider?.step || sliderRange(value).step;
    const digits = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
    const v = Number(value.toFixed(digits));
    it.text = `${name} = ${v}`;
    if (record) commit(false);
    refresh();
  }

  // ---------- tabele ----------

  function renderTable(it) {
    const row = list.querySelector(`.gc-row[data-id="${it.id}"]`);
    const box = row?.querySelector(".gc-tbl");
    if (!box) return;
    const cols = it.cols;
    const n = Math.max(...cols.map((c) => c.values.length), 0) + 1; // prazna vrstica za nov vnos
    const ref = !!it.ref;
    const o = modelItem(it.id);
    const yVals = ref && o?.cols?.[1]?.values;
    let html = `<table class="gc-table"><thead><tr>${cols
      .map((c, j) => `<th><input class="gc-cell gc-head" data-col="${j}" value="${esc(c.name)}" aria-label="${esc(t("gc.colName"))}" ${ref && j ? "readonly" : ""}></th>`)
      .join("")}</tr></thead><tbody>`;
    for (let i = 0; i < n; i++) {
      html += "<tr>";
      cols.forEach((c, j) => {
        const v = ref && j ? (yVals && Number.isFinite(yVals[i]) ? fmt(yVals[i], 6) : "") : c.values[i] ?? "";
        html += `<td><input class="gc-cell" data-col="${j}" data-row="${i}" value="${esc(String(v).replace(".", comma() ? "," : "."))}" inputmode="decimal" ${ref && j ? "readonly tabindex='-1'" : ""}></td>`;
      });
      html += "</tr>";
    }
    html += "</tbody></table>";
    box.innerHTML = html;
  }

  function updateTableExtra(o, row) {
    const it = o.src;
    const extra = row.querySelector(".gc-extra");
    if (it.ref) {
      // vrednosti funkcije se spremenijo z drsniki
      row.querySelectorAll("td input[readonly]").forEach((inp) => {
        const v = o.cols?.[1]?.values[Number(inp.dataset.row)];
        inp.value = Number.isFinite(v) ? fmt(v, 6) : "";
      });
      extra.innerHTML = "";
      return;
    }
    const opts2 = [["", t("gc.regNone")], ...MODELS.map((m) => [m, t(`gc.reg.${m}`)])];
    extra.innerHTML = `<div class="gc-reg">
      <label class="gc-reg-pick"><span>${esc(t("gc.reg"))}</span><select data-act="reg">${opts2.map(([v, l]) => `<option value="${v}" ${(it.reg || "") === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
      <label class="gc-check"><input type="checkbox" data-act="lines" ${it.lines ? "checked" : ""}> ${esc(t("gc.lines"))}</label>
    </div>${o.fit ? `<div class="gc-val gc-fit">${tex(o.fit.tex)}<span class="gc-r2">${tex(`R^2 = ${fmt(o.fit.r2, 4).replace(",", "{,}")}`)}</span></div>` : ""}`;
  }

  // ---------- dogodki seznama ----------

  list.addEventListener("input", (e) => {
    const row = e.target.closest(".gc-row");
    if (!row) return;
    const it = item(row.dataset.id);
    if (e.target.classList.contains("gc-cell")) {
      const j = Number(e.target.dataset.col);
      if (e.target.classList.contains("gc-head")) it.cols[j].name = e.target.value.trim();
      else {
        const i = Number(e.target.dataset.row);
        const raw = e.target.value.trim().replace(",", ".").replace("−", "-");
        while (it.cols[j].values.length <= i) it.cols[j].values.push("");
        it.cols[j].values[i] = raw === "" ? "" : Number(raw);
        // počistimo prazne vrstice na koncu
        for (const c of it.cols) while (c.values.length && (c.values.at(-1) === "" || c.values.at(-1) == null) && it.cols.every((cc) => cc.values.length < c.values.length || cc.values.at(-1) === "" || cc.values.at(-1) == null)) c.values.pop();
        const rows = list.querySelectorAll(`.gc-row[data-id="${it.id}"] tbody tr`).length;
        if (i === rows - 1 && raw !== "") {
          // dodamo novo prazno vrstico
          const tb = list.querySelector(`.gc-row[data-id="${it.id}"] tbody`);
          const tr = document.createElement("tr");
          tr.innerHTML = it.cols.map((c, jj) => `<td><input class="gc-cell" data-col="${jj}" data-row="${rows}" value="" inputmode="decimal" ${it.ref && jj ? "readonly tabindex='-1'" : ""}></td>`).join("");
          tb.append(tr);
        }
      }
      commit(false);
      refresh();
      return;
    }
    if (e.target.classList.contains("gc-input")) {
      it.text = e.target.value;
      if (it.type === "note") autoGrow(e.target);
      commit(false);
      refresh();
    }
  });
  list.addEventListener("change", (e) => {
    const row = e.target.closest(".gc-row");
    if (!row) return;
    const it = item(row.dataset.id);
    if (e.target.dataset.act === "reg") {
      it.reg = e.target.value;
      commit();
      refresh();
    }
    if (e.target.dataset.act === "lines") {
      it.lines = e.target.checked;
      commit();
      refresh();
    }
  });
  const autoGrow = (ta) => {
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  list.addEventListener("focusin", (e) => {
    const row = e.target.closest(".gc-row");
    if (!row) return;
    list.querySelectorAll(".gc-row.editing").forEach((r) => r !== row && r.classList.remove("editing"));
    if (e.target.classList.contains("gc-input") || e.target.classList.contains("gc-cell")) {
      row.classList.add("editing");
      focusId = row.dataset.id;
      lastField = e.target;
      const o = modelItem(row.dataset.id);
      if (o && view.selected !== o.id && row.classList.contains("plotted")) {
        view.select(o.id);
        list.querySelectorAll(".gc-row").forEach((r) => r.classList.toggle("selected", r === row));
      }
    }
  });
  list.addEventListener("focusout", (e) => {
    const row = e.target.closest(".gc-row");
    setTimeout(() => {
      if (row && !row.contains(document.activeElement)) row.classList.remove("editing");
    }, 0);
  });
  list.addEventListener("click", (e) => {
    const row = e.target.closest(".gc-row");
    if (!row) return;
    const id = row.dataset.id;
    const it = item(id);
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "vis") {
      it.hidden = !it.hidden;
      commit();
      refresh();
      return;
    }
    if (act === "del") return removeItem(id);
    if (act === "menu") return openRowMenu(id, e.target.closest("[data-act]"));
    if (act === "sliders") {
      const o = modelItem(id);
      const at = state.items.indexOf(it);
      const add = (o.missing || []).map((n) => ({ id: newId(), type: "expr", text: `${n} = 1`, color: 0 }));
      state.items.splice(at, 0, ...add);
      commit();
      renderList();
      refresh();
      return;
    }
    if (act === "play") {
      it.slider = { ...sliderRange(modelItem(id).value), ...(it.slider || {}), play: !it.slider?.play };
      commit();
      refresh();
      animate();
      return;
    }
    if (e.target.closest(".gc-math")) {
      const input = row.querySelector(".gc-input");
      row.classList.add("editing"); // polje je skrito, dokler vrstica ni v urejanju
      input.focus();
      const n = input.value.length;
      input.setSelectionRange(n, n);
    }
  });
  list.addEventListener("keydown", (e) => {
    const input = e.target;
    if (!input.classList?.contains("gc-input") || input.classList.contains("gc-note-in")) return;
    const row = input.closest(".gc-row");
    const idx = state.items.findIndex((x) => x.id === row.dataset.id);
    if (e.key === "Enter") {
      e.preventDefault();
      insertAfter(idx);
    } else if (e.key === "Backspace" && !input.value && state.items.length > 1) {
      e.preventDefault();
      removeItem(row.dataset.id, true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const rows = [...list.querySelectorAll(".gc-input")];
      const k = rows.indexOf(input) + (e.key === "ArrowDown" ? 1 : -1);
      if (rows[k]) {
        e.preventDefault();
        rows[k].focus();
      }
    }
  });

  function insertAfter(idx, fields = {}) {
    const it = { id: newId(), type: "expr", text: "", color: nextColor(), ...fields };
    state.items.splice(idx + 1, 0, it);
    commit();
    renderList();
    refresh();
    const input = list.querySelector(`.gc-row[data-id="${it.id}"] .gc-input`);
    input?.focus();
    return it;
  }

  function removeItem(id, focusPrev = false) {
    const idx = state.items.findIndex((x) => x.id === id);
    if (idx < 0) return;
    state.items.splice(idx, 1);
    if (view.selected === id) view.select(null);
    commit();
    renderList();
    refresh();
    if (focusPrev) {
      const inputs = list.querySelectorAll(".gc-input");
      const target = inputs[Math.max(0, idx - 1)];
      if (target) {
        target.focus();
        const n = target.value.length;
        target.setSelectionRange?.(n, n);
      }
    }
  }

  // ---------- vlečenje točk na grafu ----------

  function roundTo(v, unit) {
    const p = 10 ** Math.floor(Math.log10(unit));
    const step = [1, 2, 5, 10].map((m) => m * p).find((s) => s >= unit);
    return Number((Math.round(v / step) * step).toPrecision(12));
  }
  function drag(h, gx, gy) {
    const it = item(h.id);
    const o = modelItem(h.id);
    if (!it || !o) return;
    const unit = (state.view.xmax - state.view.xmin) / view.W; // enot na piksel
    const r = (v) => roundTo(v, unit * 4);
    if (h.kind === "tangent") {
      it.tools.tangent = r(gx);
    } else if (h.kind === "area") {
      it.tools.area[h.which] = r(gx);
    } else if (h.kind === "cell") {
      const xs = it.cols[0].values;
      const ys = it.cols[h.col].values;
      xs[h.row] = r(gx);
      ys[h.row] = r(gy);
      renderTable(it);
    } else if (h.kind === "point" && o.drag) {
      const { x, y } = o.drag;
      const setS = (name, v) => {
        const s = state.items.find((q) => q.type === "expr" && new RegExp(`^\\s*${name.replace(/[_]/g, "_")}\\s*=`).test(q.text));
        if (!s) return;
        const sl = { ...sliderRange(v), ...(s.slider || {}) };
        const step = sl.step || 0.1;
        const val = Math.min(sl.max, Math.max(sl.min, Math.round(v / step) * step));
        s.text = `${name} = ${Number(val.toFixed(6))}`;
      };
      if (x?.slider) setS(x.slider, gx);
      if (y?.slider) setS(y.slider, gy);
      if (x?.lit || y?.lit) {
        const m = /^\s*\((.*),(.*)\)\s*$/.exec(it.text);
        if (m) {
          const xs = x?.lit ? String(r(gx)) : m[1].trim();
          const ys = y?.lit ? String(r(gy)) : m[2].trim();
          it.text = `(${xs}, ${ys})`;
        }
      }
    }
    refresh();
  }

  // ---------- animacija drsnikov ----------

  let animating = false;
  function animate() {
    if (animating) return;
    animating = true;
    let last = performance.now();
    const step = (now) => {
      const playing = state.items.filter((x) => x.slider?.play);
      if (!playing.length || !root.isConnected) {
        animating = false;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const it of playing) {
        const o = modelItem(it.id);
        if (!o || o.kind !== "slider") {
          it.slider.play = false;
          continue;
        }
        const sl = { ...sliderRange(o.value), ...it.slider };
        const span = sl.max - sl.min;
        const dir = it.slider.dir || 1;
        let v = o.value + dir * (span / 8) * (sl.speed || 1) * dt; // celoten razpon v 8 s
        if (v > sl.max) {
          v = sl.max;
          it.slider.dir = -1;
        } else if (v < sl.min) {
          v = sl.min;
          it.slider.dir = 1;
        }
        const name = /^\s*([^=]+?)\s*=/.exec(it.text)?.[1] || "a";
        it.text = `${name} = ${Number(v.toFixed(4))}`;
      }
      refresh();
      scheduleSave();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- pojavna okna (meniji) ----------

  let popAnchor = null;
  function openPop(html, anchor, onClick, cls = "") {
    pop.className = `gc-pop ${cls}`;
    pop.innerHTML = html;
    pop.hidden = false;
    popAnchor = anchor;
    const r = anchor.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    const pw = Math.min(330, rr.width - 16);
    pop.style.width = `${pw}px`;
    let left = r.left - rr.left;
    if (left + pw > rr.width - 8) left = rr.width - 8 - pw;
    pop.style.left = `${Math.max(8, left)}px`;
    const below = r.bottom - rr.top + 6;
    pop.style.top = `${below}px`;
    pop.style.bottom = "";
    // če ne gre pod, odpremo nad gumbom
    requestAnimationFrame(() => {
      const ph = pop.offsetHeight;
      if (below + ph > rr.height - 8 && r.top - rr.top - 6 - ph > 8) pop.style.top = `${r.top - rr.top - 6 - ph}px`;
      else if (below + ph > rr.height - 8) pop.style.top = `${Math.max(8, rr.height - 8 - ph)}px`;
    });
    pop.onclick = onClick;
    pop.onchange = null;
    pop.oninput = null;
  }
  function closePop() {
    pop.hidden = true;
    pop.innerHTML = "";
    popAnchor = null;
  }
  document.addEventListener("pointerdown", (e) => {
    if (pop.hidden) return;
    if (pop.contains(e.target) || popAnchor?.contains(e.target)) return;
    closePop();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pop.hidden) closePop();
  });

  function openRowMenu(id, anchor) {
    const it = item(id);
    const o = modelItem(id);
    const fnLike = o && (o.kind === "y" || o.plot === "y");
    const tools = it.tools || {};
    const sw = PALETTE.map((p, i) => `<button type="button" class="gc-swatch ${it.color === i ? "on" : ""}" data-color="${i}" style="--c: var(${p})" aria-label="${esc(t("gc.color"))} ${i + 1}"></button>`).join("");
    const styles = ["solid", "dash", "dot"].map((s) => `<button type="button" class="gc-ls ${(it.style || "solid") === s ? "on" : ""}" data-style="${s}" aria-label="${s}"><span class="ls-${s}"></span></button>`).join("");
    const tog = (key, label, on) => `<button type="button" class="gc-menu-row" data-tool="${key}" aria-pressed="${!!on}">${icon(on ? "circle-check" : "circle")}<span>${esc(label)}</span></button>`;
    let html = `<div class="gc-pop-h">${esc(t("gc.color"))}</div><div class="gc-swatches">${sw}</div>`;
    if (it.type !== "table") html += `<div class="gc-pop-h">${esc(t("gc.lineStyle"))}</div><div class="gc-styles">${styles}</div>`;
    if (fnLike) {
      html += `<div class="gc-pop-h">${esc(t("gc.tools"))}</div>`;
      html += tog("deriv", t("gc.deriv"), tools.deriv);
      html += tog("tangent", t("gc.tangent"), tools.tangent != null);
      html += tog("area", t("gc.area"), !!tools.area);
      html += `<button type="button" class="gc-menu-row" data-tool="table">${icon("table")}<span>${esc(t("gc.valueTable"))}</span></button>`;
    }
    if (o?.kind === "points") html += tog("label", t("gc.label"), it.label !== false);
    html += `<div class="gc-pop-sep"></div><button type="button" class="gc-menu-row" data-tool="dup">${icon("copy")}<span>${esc(t("gc.duplicate"))}</span></button>`;
    html += `<button type="button" class="gc-menu-row danger" data-tool="del">${icon("trash-2")}<span>${esc(t("gc.delete"))}</span></button>`;
    openPop(html, anchor, (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.color) it.color = Number(b.dataset.color);
      if (b.dataset.style) it.style = b.dataset.style;
      const tool = b.dataset.tool;
      const v = state.view;
      if (tool === "deriv") it.tools = { ...tools, deriv: !tools.deriv };
      if (tool === "tangent") it.tools = { ...tools, tangent: tools.tangent != null ? null : roundTo((v.xmin + v.xmax) / 2 + (v.xmax - v.xmin) / 8, (v.xmax - v.xmin) / 100) };
      if (tool === "area") {
        const a = roundTo(v.xmin + (v.xmax - v.xmin) * 0.35, (v.xmax - v.xmin) / 100);
        const bb = roundTo(v.xmin + (v.xmax - v.xmin) * 0.65, (v.xmax - v.xmin) / 100);
        it.tools = { ...tools, area: tools.area ? null : [a, bb] };
      }
      if (tool === "label") it.label = it.label === false;
      if (tool === "table") {
        const idx = state.items.indexOf(it);
        closePop();
        state.items.splice(idx + 1, 0, { id: newId(), type: "table", ref: it.id, color: it.color, cols: [{ name: "x", values: [-2, -1, 0, 1, 2] }, { name: "y", values: [] }] });
        commit();
        renderList();
        refresh();
        return;
      }
      if (tool === "dup") {
        const idx = state.items.indexOf(it);
        state.items.splice(idx + 1, 0, { ...clone(it), id: newId(), color: nextColor() });
        closePop();
        commit();
        renderList();
        refresh();
        return;
      }
      if (tool === "del") {
        closePop();
        return removeItem(id);
      }
      commit();
      refresh();
      openRowMenu(id, anchor); // osvežimo meni
    });
  }

  function openAddMenu(anchor) {
    const html = `
      <button type="button" class="gc-menu-row" data-add="expr">${icon("square-function")}<span>${esc(t("gc.addExpr"))}</span></button>
      <button type="button" class="gc-menu-row" data-add="slider">${icon("sliders-horizontal")}<span>${esc(t("gc.addSlider"))}</span></button>
      <button type="button" class="gc-menu-row" data-add="table">${icon("table")}<span>${esc(t("gc.addTable"))}</span></button>
      <button type="button" class="gc-menu-row" data-add="note">${icon("text")}<span>${esc(t("gc.addNote"))}</span></button>`;
    openPop(html, anchor, (e) => {
      const b = e.target.closest("[data-add]");
      if (!b) return;
      closePop();
      const idx = state.items.length - 1;
      const kind = b.dataset.add;
      if (kind === "expr") insertAfter(idx);
      if (kind === "slider") {
        const used = new Set(state.items.map((x) => /^\s*([a-wz])\s*=/.exec(x.text || "")?.[1]));
        const name = "abcdkmnpqsuvw".split("").find((c) => !used.has(c)) || "a";
        insertAfter(idx, { text: `${name} = 1` });
      }
      if (kind === "table") {
        const n = state.items.filter((x) => x.type === "table").length + 1;
        state.items.push({ id: newId(), type: "table", color: nextColor(), cols: [{ name: `x_${n}`, values: [] }, { name: `y_${n}`, values: [] }] });
        commit();
        renderList();
        refresh();
        list.querySelector(`.gc-row:last-child .gc-cell[data-row="0"]`)?.focus();
      }
      if (kind === "note") {
        state.items.push({ id: newId(), type: "note", text: "" });
        commit();
        renderList();
        refresh();
        list.querySelector(".gc-row:last-child textarea")?.focus();
      }
    });
  }

  function openExamples(anchor) {
    const html = `<div class="gc-pop-h">${esc(t("gc.examples"))}</div><div class="gc-ex-list">${EXAMPLES.map(
      (ex, i) => `<button type="button" class="gc-ex" data-ex="${i}"><span class="gc-ex-ic">${icon(ex.icon || "chart-spline")}</span><span class="gc-ex-tex">${tex(ex.label)}</span></button>`,
    ).join("")}</div>`;
    openPop(
      html,
      anchor,
      (e) => {
        const b = e.target.closest("[data-ex]");
        if (!b) return;
        closePop();
        loadState(EXAMPLES[Number(b.dataset.ex)].state());
      },
      "gc-pop-wide",
    );
  }

  function loadState(s, { record = true } = {}) {
    const next = upgrade(clone(s));
    if (record) {
      undo.push(JSON.stringify(state));
      redo.length = 0;
    }
    state = next;
    lastSnap = JSON.stringify(state);
    view.selected = null;
    view.shown = [];
    view.trace = null;
    renderList();
    refresh();
    view.view = view.squared(state.view);
    view.draw();
    updateBar();
    scheduleSave();
    if (state.items.some((x) => x.slider?.play)) animate();
  }

  // shranjeni grafi na strežniku (po učencu)
  async function openGraphs(anchor) {
    const sid = opts.studentId?.();
    const head = `<div class="gc-pop-h">${esc(t("gc.myGraphs"))}</div>
      <form class="gc-save-row"><input name="title" maxlength="80" placeholder="${esc(t("gc.saveAs"))}" value="${esc(state.title || "")}"><button class="primary small" type="submit">${icon("save")}<span>${esc(t("common.save"))}</span></button></form>
      <button type="button" class="gc-menu-row" data-new>${icon("plus")}<span>${esc(t("gc.new"))}</span></button>
      <div class="gc-pop-sep"></div>`;
    openPop(`${head}<div class="gc-saved"><p class="muted">${esc(t("common.loading"))}</p></div>`, anchor, onClick, "gc-pop-wide");
    pop.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = e.target.title.value.trim() || defaultTitle();
      state.title = title;
      try {
        const body = { title, data: { ...state }, thumb: await thumb() };
        // že shranjen graf posodobimo; če ga medtem ni več, ga shranimo znova
        const put = state.savedId ? await opts.api(`/api/students/${sid}/graphs/${state.savedId}`, { method: "PUT", body }).catch(() => null) : null;
        if (!put) {
          const r = await opts.api(`/api/students/${sid}/graphs`, { method: "POST", body });
          state.savedId = r.id;
        }
        scheduleSave();
        opts.toast?.(t("gc.saved"));
        closePop();
      } catch (err) {
        opts.toast?.(err.message);
      }
    });
    let graphs = [];
    try {
      graphs = await opts.api(`/api/students/${sid}/graphs`);
    } catch {
      graphs = null;
    }
    const box = pop.querySelector(".gc-saved");
    if (!box) return;
    if (!graphs) box.innerHTML = `<p class="muted">${esc(t("gc.offline"))}</p>`;
    else if (!graphs.length) box.innerHTML = `<p class="muted">${esc(t("gc.noGraphs"))}</p>`;
    else
      box.innerHTML = graphs
        .map(
          (g) => `<div class="gc-saved-row" data-gid="${g.id}">
          <button type="button" class="gc-saved-open" data-open="${g.id}">${g.thumb ? `<img src="${esc(g.thumb)}" alt="">` : `<span class="gc-thumb-empty">${icon("chart-spline")}</span>`}<span><b>${esc(g.title)}</b><small class="muted">${esc(new Date(`${g.updated_at.replace(" ", "T")}Z`).toLocaleDateString(opts.locale?.()))}</small></span></button>
          <button type="button" class="gc-x" data-del="${g.id}" aria-label="${esc(t("gc.delete"))}">${icon("trash-2")}</button></div>`,
        )
        .join("");
    async function onClick(e) {
      if (e.target.closest("[data-new]")) {
        closePop();
        loadState(emptyState());
        return;
      }
      const open = e.target.closest("[data-open]");
      if (open) {
        const g = await opts.api(`/api/students/${sid}/graphs/${open.dataset.open}`).catch((err) => (opts.toast?.(err.message), null));
        if (!g) return;
        closePop();
        loadState({ ...g.data, title: g.title, savedId: g.id });
        return;
      }
      const del = e.target.closest("[data-del]");
      if (del) {
        const g = graphs.find((x) => String(x.id) === del.dataset.del);
        if (!confirm(t("gc.confirmDelete", { name: g?.title || "" }))) return;
        await opts.api(`/api/students/${sid}/graphs/${del.dataset.del}`, { method: "DELETE" }).catch((err) => opts.toast?.(err.message));
        if (String(state.savedId) === del.dataset.del) delete state.savedId;
        del.closest(".gc-saved-row").remove();
      }
    }
  }

  function defaultTitle() {
    const first = state.items.find((x) => x.type === "expr" && x.text.trim());
    return first ? first.text.trim().slice(0, 60) : t("gc.untitled");
  }

  async function thumb() {
    const blob = await view.toBlob([], 0.5).catch(() => null);
    if (!blob || blob.size > 60000) return null;
    return new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => res(null);
      fr.readAsDataURL(blob);
    });
  }

  function legend() {
    return state.items
      .filter((x) => x.type === "expr" && x.text.trim() && !x.hidden)
      .map((x) => ({ text: x.text.trim(), color: x.color ?? 0 }))
      .concat(
        (model?.items || [])
          .filter((o) => o.kind === "table" && o.fit && !o.src.hidden)
          .map((o) => ({ text: o.fit.tex.replace(/\\cdot/g, "·").replace(/[{}\\]/g, "").replace(/\^/g, "^"), color: o.src.color ?? 0 })),
      );
  }

  async function exportImage() {
    const blob = await view.toBlob(legend());
    if (!blob) return;
    const file = typeof File !== "undefined" ? new File([blob], "evklid-graf.png", { type: "image/png" }) : null;
    if (isTouch() && file && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: t("gc.title") });
        return;
      } catch {
        /* preklicano – prenesemo */
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "evklid-graf.png";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  function openMore(anchor) {
    const html = `
      ${opts.canExport === false ? "" : `<button type="button" class="gc-menu-row" data-m="export">${icon("image-down")}<span>${esc(t("gc.export"))}</span></button>`}
      ${opts.askTutor ? `<button type="button" class="gc-menu-row" data-m="ask">${icon("message-circle")}<span>${esc(t("gc.ask"))}</span></button>` : ""}
      <button type="button" class="gc-menu-row" data-m="keypad" aria-pressed="${keyboardOpenFor(root)}">${icon("keyboard")}<span>${esc(t("gc.keypad"))}</span></button>
      <button type="button" class="gc-menu-row" data-m="settings">${icon("wrench")}<span>${esc(t("gc.settings"))}</span></button>
      <div class="gc-pop-sep"></div>
      <button type="button" class="gc-menu-row danger" data-m="clear">${icon("trash-2")}<span>${esc(t("gc.clear"))}</span></button>`;
    openPop(html, anchor, (e) => {
      const m = e.target.closest("[data-m]")?.dataset.m;
      if (!m) return;
      closePop();
      if (m === "export") exportImage();
      if (m === "ask") askTutor();
      if (m === "keypad") {
        const f = lastField?.isConnected ? lastField : list.querySelector(".gc-input");
        f?.closest(".gc-row")?.classList.add("editing"); // polje vrstice je skrito, dokler vrstica ni v urejanju
        if (f) toggleKeyboard(f);
      }
      if (m === "settings") openSettings($('[data-act="settings"]'));
      if (m === "clear") loadState(emptyState());
    });
  }

  function askTutor() {
    const lines = state.items
      .filter((x) => (x.type === "expr" || x.type === "note") && x.text.trim())
      .map((x) => `- ${x.text.trim()}`);
    for (const o of model.items) if (o.kind === "table" && o.fit) lines.push(`- ${t("gc.reg")}: $${o.fit.tex}$ (R² = ${fmt(o.fit.r2, 4)})`);
    opts.askTutor?.(`${t("gc.askText")}\n${lines.join("\n")}\n`);
  }

  function openSettings(anchor) {
    const st = state.settings;
    const chk = (k, label) => `<label class="gc-check"><input type="checkbox" data-set="${k}" ${st[k] !== false ? "checked" : ""}> ${esc(label)}</label>`;
    const v = state.view;
    const num = (x) => fmt(Number(x.toPrecision(4)));
    const html = `<div class="gc-pop-h">${esc(t("gc.settings"))}</div>
      ${chk("grid", t("gc.grid"))}${chk("minor", t("gc.minor"))}${chk("numbers", t("gc.numbers"))}${chk("arrows", t("gc.arrows"))}${chk("square", t("gc.square"))}
      <label class="gc-check"><input type="checkbox" data-set="piX" ${st.piX ? "checked" : ""}> ${esc(t("gc.piX"))}</label>
      <div class="gc-pop-h">${esc(t("gc.angles"))}</div>
      <div class="seg gc-seg"><button type="button" data-deg="0" class="${st.deg ? "" : "active"}">${esc(t("gc.rad"))}</button><button type="button" data-deg="1" class="${st.deg ? "active" : ""}">${esc(t("gc.deg"))}</button></div>
      <div class="gc-pop-h">${esc(t("gc.axisLabels"))}</div>
      <div class="gc-win"><input data-lab="xLabel" value="${esc(st.xLabel ?? "x")}" maxlength="12" aria-label="x"><input data-lab="yLabel" value="${esc(st.yLabel ?? "y")}" maxlength="12" aria-label="y"></div>
      <div class="gc-pop-h">${esc(t("gc.window"))}</div>
      <div class="gc-win gc-win4">
        <label>${tex("x_{\\min}")}<input data-win="xmin" value="${esc(num(v.xmin))}" inputmode="decimal"></label>
        <label>${tex("x_{\\max}")}<input data-win="xmax" value="${esc(num(v.xmax))}" inputmode="decimal"></label>
        <label>${tex("y_{\\min}")}<input data-win="ymin" value="${esc(num(v.ymin))}" inputmode="decimal"></label>
        <label>${tex("y_{\\max}")}<input data-win="ymax" value="${esc(num(v.ymax))}" inputmode="decimal"></label>
      </div>`;
    openPop(html, anchor, (e) => {
      const d = e.target.closest("[data-deg]");
      if (d) {
        st.deg = d.dataset.deg === "1";
        pop.querySelectorAll("[data-deg]").forEach((b) => b.classList.toggle("active", b === d));
        commit();
        refresh();
      }
    });
    pop.onchange = (e) => {
      const el = e.target;
      if (el.dataset.set) {
        st[el.dataset.set] = el.checked;
        if (el.dataset.set === "square" && el.checked) state.view = view.squared(state.view);
      }
      if (el.dataset.lab) st[el.dataset.lab] = el.value.trim();
      if (el.dataset.win) {
        const val = Number(el.value.replace(",", ".").replace("−", "-"));
        const nv = { ...state.view, [el.dataset.win]: val };
        if (Number.isFinite(val) && nv.xmax > nv.xmin && nv.ymax > nv.ymin) {
          st.square = false;
          pop.querySelector('[data-set="square"]').checked = false;
          state.view = nv;
        }
      }
      commit();
      refresh();
    };
  }

  // ---------- orodna vrstica ----------

  root.addEventListener("click", (e) => {
    const b = e.target.closest(".gc-bar [data-act], .gc-stage [data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "add") openAddMenu(b);
    if (act === "undo" && undo.length) {
      redo.push(JSON.stringify(state));
      restore(undo.pop());
    }
    if (act === "redo" && redo.length) {
      undo.push(JSON.stringify(state));
      restore(redo.pop());
    }
    if (act === "playall") togglePlayAll();
    if (act === "examples") openExamples(b);
    if (act === "graphs") openGraphs(b);
    if (act === "more") openMore(b);
    if (act === "settings") openSettings(b);
    if (act === "zoomin") view.zoomAt(0.6, undefined, undefined, true);
    if (act === "zoomout") view.zoomAt(1 / 0.6, undefined, undefined, true);
    if (act === "home") view.animateTo(view.squared(emptyState().view));
    if (act === "fit") {
      const v = view.fitBounds();
      if (v) view.animateTo(view.squared(v, "y"));
    }
    if (act === "expand") {
      const on = !root.classList.contains("gc-full");
      root.classList.toggle("gc-full", on);
      b.setAttribute("aria-pressed", String(on));
      b.innerHTML = icon(on ? "minimize-2" : "maximize-2");
    }
  });

  // ---------- tipkovnica (Evklidova tipkovnica, public/tipkovnica.js) ----------
  // Plasti 123 in f(x) sta mreži kalkulatorja; Σ in ABC sta skupni. Enter v vrstici doda novo vrstico.

  let lastField = null;
  const KEYS = {
    "123": [
      ["x", "x"], ["y", "y"], ["a²", "^2", "x²"], ["aᵇ", "^"], ["7"], ["8"], ["9"], ["÷", "/"],
      ["(", "("], [")", ")"], ["<", "<"], [">", ">"], ["4"], ["5"], ["6"], ["×", "*"],
      ["|a|", "|@|"], [",", ","], ["≤", "<="], ["≥", ">="], ["1"], ["2"], ["3"], ["−", "-"],
      ["√", "√(@)"], ["π", "π"], ["θ", "θ"], ["t", "t"], ["0"], [".", "."], ["=", "="], ["+", "+"],
    ],
    fx: [
      ["sin", "sin(@)"], ["cos", "cos(@)"], ["tan", "tan(@)"], ["ln", "ln(@)"], ["log", "log(@)"], ["logₐ", "log_(@)()"], ["eˣ", "e^(@)"], ["ⁿ√", "root(@, )"],
      ["sin⁻¹", "arcsin(@)"], ["cos⁻¹", "arccos(@)"], ["tan⁻¹", "arctan(@)"], ["∛", "∛(@)"], ["n!", "!"], ["°", "°"], ["{ : }", "{@ : }"], ["[ ]", "[@]"],
      ["f(x)", "f(x) = @"], ["f′(x)", "f'(x)"], ["d/dx", "d/dx(@)"], ["∫", "∫_(@)^() () dx"], ["Σ", "∑_(n=1)^(@) "], ["mod", "mod(@, )"], ["min", "min(@)"], ["max", "max(@)"],
      ["r", "r"], ["a", "a"], ["b", "b"], ["k", "k"], ["n", "n"], ["mean", "mean(@)"], ["nCr", "nCr(@, )"], ["%", "%"],
    ],
  };
  root.dataset.kbScope = "";
  initKeyboard();
  configureKeyboard(list, {
    math: true,
    layers: [{ id: "num", label: "123", cols: 8, keys: KEYS["123"] }, { id: "fx", label: "f(x)", cols: 8, keys: KEYS.fx }, "sym", "abc"],
    start: "num",
    enter: "go",
    parsed: true, // math.js: abs, floor … ostanejo imena funkcij
  });
  // Odprta tipkovnica: graf in seznam se stisneta, pomoč pod seznamom se skrije.
  const onKeyboard = (e) => {
    const on = !!e.detail?.open && root.contains(e.detail.field);
    root.classList.toggle("kp-open", on);
    if (on) e.detail.field.scrollIntoView?.({ block: "nearest" });
  };
  window.addEventListener("evklid:tipkovnica", onKeyboard);

  // ---------- teme in velikost ----------

  const mo = new MutationObserver(() => view.draw());
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

  renderList();
  refresh();
  updateBar();
  if (state.items.some((x) => x.slider?.play)) animate();

  return {
    root,
    view,
    get state() {
      return state;
    },
    /** Odpre graf z danimi izrazi (iz naloge ali inštruktorja); trenutni graf ostane v razveljavi. */
    show(exprs = [], { title } = {}) {
      if (!exprs.length) return;
      const s = emptyState();
      s.title = title;
      s.items = exprs.map((text, i) => ({ id: newId(), type: "expr", text, color: i % PALETTE.length }));
      view.resize();
      loadState(s);
      const v = view.fitBounds();
      if (v) {
        state.view = view.squared(v, "y");
        view.draw();
      }
    },
    resize() {
      view.resize();
      view.draw();
    },
    /** Ob menjavi učenca: njegov zadnji graf (shranjen na napravi). */
    reload() {
      undo.length = 0;
      redo.length = 0;
      loadState(load() || emptyState(), { record: false });
      updateBar();
    },
    refresh,
    loadState,
    exportImage,
  };
}
