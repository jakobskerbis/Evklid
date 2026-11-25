// Gradniki virtualnega laboratorija: zaslon merilnika, tabela meritev, graf, vprašanje o sklepu, dnevnik dogodkov.
// Modeli so v lab-model.js; tu je samo prikaz. Besedila so slovenska kot v ostalih simulacijah učbenika.
import { h, s, fmt, svgBox, axes, tex, button } from "./kit.js";
import SL from "../i18n/sl.js";
import { icon } from "../icons.js";

// Prevodi: public/i18n.js naložimo šele v brskalniku (preizkusi v Node uvozijo ta modul brez njega); do tedaj slovensko.
let t = (k, v = {}) => String(SL[k] ?? k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "");
if (typeof document !== "undefined") import("../i18n.js").then((m) => (t = m.t)).catch(() => {});

// Ura, ki teče v realnem času in se ustavi, ko simulacije ni več na strani.
// Ne uporablja requestAnimationFrame, ker meritve tečejo tudi pri »manj gibanja« (ni animacije, le odčitki).
// »Ponastavi« (sim/index.js) zgradi simulacijo znova v istem elementu, zato se stara ura ustavi, ko se začne nova.
export function ticker(el, fn, ms = 100) {
  let last = performance.now();
  const gen = (el._labTick = (el._labTick || 0) + 1);
  const id = setInterval(() => {
    if (el._labTick !== gen || (el.dataset.mounted && !el.isConnected)) return clearInterval(id);
    if (el.isConnected) el.dataset.mounted = "1";
    const now = performance.now();
    fn(Math.min(0.25, (now - last) / 1000));
    last = now;
  }, ms);
  return () => clearInterval(id);
}

// Zaslon digitalnega merilnika (LCD). set(text, unit, note).
// Ni aria-live: zadnja števka niha večkrat na sekundo, bralnik zaslona bi jo bral brez konca.
// Zapisana meritev (tabela) in dogodki (dnevnik) so napovedani.
export function lcd(name, { cls = "" } = {}) {
  const val = h("span", { class: "lab-lcd-val" }, "–");
  const unit = h("span", { class: "lab-lcd-unit" });
  const note = h("span", { class: "lab-lcd-note" });
  const el = h("div", { class: `lab-lcd ${cls}`, role: "group", "aria-label": name }, h("span", { class: "lab-lcd-name" }, name), h("span", { class: "lab-lcd-screen" }, val, unit), note);
  el.set = (text, u = "", n = "") => {
    const t = String(text).replace(".", ",").replace("-", "−");
    if (val.textContent !== t) val.textContent = t;
    if (unit.textContent !== u) unit.textContent = u;
    if (note.textContent !== n) note.textContent = n;
    el.classList.toggle("off", text === "" || text == null);
  };
  return el;
}

// Tabela meritev. cols: [{ key, label }]. add(row) doda vrstico (vrednosti so že nizi za prikaz).
export function dataTable(cols, { empty = "Še ni meritev. Odčitaj merilnik in pritisni »Zapiši meritev«." } = {}) {
  const tbody = h("tbody");
  const table = h("table", { class: "demo-table lab-table" }, h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "#"), ...cols.map((c) => h("th", { scope: "col", html: c.label })))), tbody);
  const none = h("p", { class: "muted lab-empty" }, empty);
  const el = h("div", { class: "lab-table-wrap" }, table, none);
  const rows = [];
  const draw = () => {
    tbody.replaceChildren(...rows.map((r, i) => h("tr", {}, h("td", {}, String(i + 1)), ...cols.map((c) => h("td", {}, r[c.key] ?? "")))));
    none.hidden = rows.length > 0;
    table.hidden = rows.length === 0;
  };
  // quiet: samodejni zapis (vsakih 30 s) premakne le okvir tabele, ne cele strani, da stran ne skače med delom.
  el.add = (r, { quiet = false } = {}) => (rows.push(r), draw(), quiet ? (el.scrollTop = el.scrollHeight) : el.querySelector("tbody tr:last-child")?.scrollIntoView?.({ block: "nearest" }));
  el.clear = () => ((rows.length = 0), draw());
  // Shranjene vrstice ob ponovnem odprtju (shramba): brez pomikanja strani.
  el.obnovi = (list) => ((rows.length = 0), rows.push(...list), draw());
  // Besedilo prazne tabele po korakih poskusa: »Še ni meritev. Natoči …« ne sme ostati, ko je voda že v posodi.
  el.setEmpty = (text) => { if (none.textContent !== text) none.textContent = text; };
  el.rows = rows;
  draw();
  return el;
}

// Graf meritev s stalnimi osmi. draw(series): [{ pts: [[x, y]], shape: "o" | "^", cls: "a", label, line?: f(x) }]
// origin: false postavi časovno os na spodnji rob (pri negativnih vrednostih, npr. Δm), da se oznake ne prekrivajo.
// formula (povezave C3, j 25. 11. 2026): zakon iz lekcij te teme, ki ga kaže graf (HTML, kot oznake osi), pod legendo.
// Napis »Formula:«, ne »iz lekcije«: vse OŠ lekcije z istim poskusom je nimajo (pregled #1047).
export function dataGraph({ W = 340, H = 220, x, y, xLabel, yLabel, xStep, yStep, title, origin = true, formula = "" }) {
  const svg = svgBox(W, H, "lab-graph");
  svg.setAttribute("aria-label", title || "Graf meritev");
  const wrap = h("figure", { class: "lab-graph-wrap" }, svg);
  // Legenda je hkrati vklop in izklop: vsaka vrsta meritev, njena premica in mreža (public/sim/prikaz.js za ostale grafe).
  const legend = h("figcaption", { class: "lab-legend", role: "group" });
  wrap.append(legend);
  if (formula) wrap.append(h("p", { class: "lab-graph-formula", html: `Formula: ${formula}` }));
  let A = null, last = [], legSig = "";
  const off = new Set();
  wrap.setAxes = (ax) => Object.assign(opts, ax);
  const opts = { x, y };
  // Gumbi legende nimajo svojih poslušalcev (klik posluša stalna legenda) in se narišejo znova le, ko se spremenijo:
  // graf se med poskusom riše vsako sličico, nov gumb na zaslonu ob dotiku pa Safari na iPadu in iPhonu vzame kot
  // meni ob lebdenju in klika ne pošlje, tudi ne drugim gumbom na strani (scripts/gumbi-na-dotik.cjs).
  legend.addEventListener("click", (ev) => {
    const key = ev.target.closest?.("button[data-layer]")?.dataset.layer;
    if (key == null) return;
    off.has(key) ? off.delete(key) : off.add(key);
    wrap.draw(last);
    // draw legendo nariše znova: fokus ostane na istem gumbu (tipkovnica)
    [...legend.children].find((c) => c.dataset.layer === key)?.focus();
  });
  const chip = (key, sym, text) => ({ key, sym, text });
  const chipEl = ({ key, sym, text }) =>
    h("button", { type: "button", class: "lab-leg layer-chip", "data-layer": key, "aria-pressed": String(!off.has(key)) }, h("i", { class: sym, "aria-hidden": "true" }), text);
  wrap.draw = (series = []) => {
    last = series;
    svg.replaceChildren();
    A = axes(svg, { W, H, x: opts.x, y: opts.y, pad: 38, padT: 26, padR: 26, origin, xLabel, yLabel: opts.yLabel ?? yLabel, xStep: opts.xStep ?? xStep, yStep: opts.yStep ?? yStep, grid: !off.has("grid") });
    // Puščici osi segata čez zadnjo oznako (sicer se »60« dotika puščice in napisa T [°C]); napisa osi sta ob konici.
    const [axX, axY] = A.g.querySelectorAll(".axis"), [lbX, lbY] = A.g.querySelectorAll(".axis-label");
    axX?.setAttribute("x2", A.R + 18);
    axY?.setAttribute("y2", A.T - 18);
    lbX?.setAttribute("x", A.R + 18);
    lbY?.setAttribute("y", A.T - 6);
    const inside = ([px, py]) => px >= A.x0 && px <= A.x1 && py >= A.y0 && py <= A.y1;
    legend.setAttribute("aria-label", t("sim.layers"));
    const chips = [];
    series.forEach((S, i) => {
      const id = S.id ?? S.label ?? i;
      if (S.line && !off.has(`fit:${id}`)) {
        const n = 40, pts = [];
        for (let i = 0; i <= n; i++) {
          const xx = A.x0 + ((A.x1 - A.x0) * i) / n, yy = S.line(xx);
          if (yy >= A.y0 && yy <= A.y1) pts.push(`${A.X(xx).toFixed(1)},${A.Y(yy).toFixed(1)}`);
        }
        if (pts.length > 1) s("polyline", { points: pts.join(" "), class: `lab-fit stroke-${S.cls}` }, svg);
      }
      if (!off.has(`pt:${id}`)) {
        // Gosto zapisane meritve (samodejni zapis vsaki 2 s): vsaka točka ima obrobo v barvi podlage, zato bi se
        // prekrivajoče točke zlile v temno packo. Tedaj nariše črto skozi vse meritve in točko le na ~14 px.
        // Le časovni niz (x ne pada, brez lastne premice): ročne meritve v poljubnem vrstnem redu (I(U), Hooke) ostanejo vse
        // vidne, brez cikcak črte po vrstnem redu zapisa in brez črte čez črtkano premico.
        const vis = S.pts.filter(inside), drawn = [];
        const niz = !S.line && vis.every((p, i) => !i || p[0] >= vis[i - 1][0]);
        for (const p of vis) {
          const cx = A.X(p[0]), cy = A.Y(p[1]), q = drawn[drawn.length - 1];
          if (!niz || !q || Math.hypot(cx - q[0], cy - q[1]) >= 14) drawn.push([cx, cy]);
        }
        if (vis.length) {
          const z = [A.X(vis[vis.length - 1][0]), A.Y(vis[vis.length - 1][1])], q = drawn[drawn.length - 1];
          if (q[0] !== z[0] || q[1] !== z[1]) Math.hypot(z[0] - q[0], z[1] - q[1]) < 9 ? (drawn[drawn.length - 1] = z) : drawn.push(z); // zadnja meritev je vedno vidna
        }
        if (drawn.length < vis.length && vis.length > 1) s("polyline", { points: vis.map((p) => `${A.X(p[0]).toFixed(1)},${A.Y(p[1]).toFixed(1)}`).join(" "), class: `lab-trace stroke-${S.cls}` }, svg);
        for (const [cx, cy] of drawn) {
          if (S.shape === "^") s("path", { d: `M${cx},${cy - 6} L${cx + 5.5},${cy + 4} L${cx - 5.5},${cy + 4} Z`, class: `lab-pt fill-${S.cls}` }, svg);
          else s("circle", { cx, cy, r: 4.5, class: `lab-pt fill-${S.cls}` }, svg);
        }
      }
      const clipped = S.pts.filter((p) => !inside(p)).length;
      if (!S.label) return;
      // Samo premica brez točk (npr. izračunana vrednost): en gumb z imenom, brez praznega gumba za točke.
      if (S.line && !S.pts.length) return chips.push(chip(`fit:${id}`, `lab-sym line bg-${S.cls}`, S.label));
      chips.push(chip(`pt:${id}`, `lab-sym ${S.shape === "^" ? "tri" : "dot"} bg-${S.cls}`, S.label + (clipped ? ` (${clipped} izven grafa)` : "")));
      if (S.line) chips.push(chip(`fit:${id}`, `lab-sym line bg-${S.cls}`, t("sim.layer.fit", { name: S.label })));
    });
    if (chips.length) chips.push(chip("grid", "layer-sw sw-grid", t("sim.layer.grid")));
    const sig = JSON.stringify([chips, [...off]]);
    if (sig !== legSig) {
      legSig = sig;
      legend.replaceChildren(...chips.map(chipEl));
    }
  };
  wrap.draw();
  return wrap;
}

// Vprašanje o sklepu: ena pravilna možnost, pri vsaki razlaga.
// Po prvi izbiri so možnosti zaklenjene (učenec ne more klikati vseh po vrsti in brati vseh razlag); »Poskusi znova«
// pod razlago jih spet odklene. Zaklenjene ostanejo dosegljive s tipko Tab (aria-disabled, ne disabled), da bralnik prebere izbiro.
// q = { text, options: [{ t, ok, why }] }
export function conclusion(q) {
  const why = h("p", { class: "lab-why", "aria-live": "polite", hidden: true });
  const opts = q.options.map((o, i) =>
    h("button", { type: "button", class: "lab-opt", "data-i": i, onclick: (ev) => pick(ev.currentTarget, o) }, h("span", { html: o.t })),
  );
  const list = h("div", { class: "lab-opts" }, ...opts);
  const again = button("Poskusi znova", () => reset());
  again.classList.add("lab-again");
  again.hidden = true;
  const pick = (b, o) => {
    if (list.classList.contains("lab-zaklenjeno")) return;
    list.classList.add("lab-zaklenjeno");
    for (const x of opts) x.setAttribute("aria-disabled", "true");
    b.classList.add(o.ok ? "ok" : "bad");
    b.setAttribute("aria-pressed", "true");
    why.hidden = false;
    why.className = `lab-why ${o.ok ? "ok" : "bad"}`;
    why.innerHTML = `<b>${o.ok ? "Pravilno." : "Ne čisto."}</b> ${o.why}`;
    again.hidden = false;
  };
  const reset = () => {
    list.classList.remove("lab-zaklenjeno");
    for (const x of opts) x.classList.remove("ok", "bad"), x.removeAttribute("aria-pressed"), x.removeAttribute("aria-disabled");
    why.hidden = true;
    why.textContent = "";
    again.hidden = true;
    opts[0]?.focus();
  };
  return h("section", { class: "lab-q" }, h("h4", {}, "Sklep"), h("p", { class: "lab-q-text", html: q.text }), list, why, again);
}

// Shranjene meritve (profil A, 2026-11-25: tabela in graf sta se ob odhodu ali osvežitvi izgubila). Vsak poskus ima svoj ključ
// evklid.lab.meritve.<učenec>.<poskus> (poskus: el.dataset.labId, ki ga nastavi sim/index.js mountSim; brez njega se nič ne shrani).
// Shrani se seme naključnih odstopanj (isti upornik, ista vzmet), vrstice tabele in stanje, ki ga poda poskus (točke grafa …).
// Uporaba: const zap = shramba(el); new Bench({ seed: zap.seed }); … na koncu zap.vezi(table, { get, set }); po spremembi zap.shrani().
// »Začni znova« (pri obnovljenih meritvah) in »Ponastavi« meritve pozabita. Shramba brskalnika je lahko zaprta (zasebno okno): try/catch.
// Meritve so osebni podatki profila (public/offline.js PRIVATE_KEYS, clearProfile, deviceData). Ključ velja za profil, ki je bil
// izbran ob postavitvi poskusa: ob menjavi profila se Laboratorij nariše znova (app.js selectStudent → showLab: seznam), tema
// pa se zapre (Učna pot). Če bi poskus vseeno ostal na zaslonu, po menjavi ne shrani nič več (meritve ne gredo drugemu profilu).
const MER = "evklid.lab.meritve.";
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch {} };
export const kljucMeritev = (labId) => (labId ? `${MER}${lsGet("studentId") || "0"}.${labId}` : null);
// kljuc: ključ, ki ga je shramba določila ob postavitvi (el._labKljuc); po menjavi profila ne pobriše meritev drugega profila.
export const pozabiMeritve = (labId, kljuc) => { const k = kljuc || kljucMeritev(labId); if (k) lsDel(k); };
// JSON bi NaN (npr. »OL« na merilniku) zapisal kot null, ta pa bi bil na grafu točka pri 0: zapišemo ga kot "#NaN".
const NEKONCNO = { "#NaN": NaN, "#Infinity": Infinity, "#-Infinity": -Infinity };
export const vJson = (x) => JSON.stringify(x, (k, v) => (typeof v === "number" && !Number.isFinite(v) ? `#${v}` : v));
export const izJsona = (t) => JSON.parse(t, (k, v) => (typeof v === "string" && v in NEKONCNO ? NEKONCNO[v] : v));

export function shramba(el) {
  const key = kljucMeritev(el?.dataset?.labId), profil = lsGet("studentId") || "0";
  if (el) el._labKljuc = key; // »Ponastavi« (sim/index.js) pozabi ta ključ, ne ključa profila, ki je izbran zdaj
  let data = null;
  try { data = key ? izJsona(lsGet(key) || "null") : null; } catch {}
  if (!data || data.v !== 1 || !Array.isArray(data.rows)) data = null;
  else data.rows = data.rows.filter((r) => r && typeof r === "object" && !Array.isArray(r));
  let table = null, get = () => ({}), vezano = false, cakam = false, bar = null;
  const zap = {
    data,
    seed: Number.isInteger(data?.seed) ? data.seed : (Math.random() * 2 ** 31) | 0,
    obnovljeno: false, // vrstice s prejšnjega obiska so v tabeli (poskus jih ob novem nizu meritev pobriše)
    shrani() {
      if (!key || !vezano || cakam || (lsGet("studentId") || "0") !== profil) return;
      cakam = true; // več sprememb v istem kliku (vrstica, nato točke grafa) zapiše enkrat, ko je stanje celo
      queueMicrotask(() => {
        cakam = false;
        let extra = {};
        try { extra = get() || {}; } catch {}
        lsSet(key, vJson({ ...extra, v: 1, seed: zap.seed, rows: table?.rows ?? [] }));
      });
    },
    pozabi: () => key && lsDel(key),
    vezi(t, { get: g, set } = {}) {
      table = t;
      if (g) get = g;
      try {
        if (data && data.rows.length) {
          t.obnovi?.(data.rows);
          zap.obnovljeno = true;
          // mountSim (sim/index.js) vedno poda el._labZnova: poskus se postavi znova brez meritev. Brez njega (poskus zunaj
          // mountSim) pozabimo shranjeno in tabelo pobrišemo, a stanja poskusa (točke grafa) ne moremo vrniti: ne shranjujemo več.
          const znova = button("Začni znova", () => {
            zap.pozabi();
            if (typeof el._labZnova === "function") return el._labZnova();
            vezano = false;
            t.clear();
            bar?.remove();
          });
          bar = h("p", { class: "lab-obnova", role: "status" }, h("span", {}, "Meritve s prejšnjega obiska so obnovljene."), znova);
          t.before?.(bar);
        }
        if (data) set?.(data);
      } catch (err) {
        // Pokvarjen ali star zapis (druga oblika podatkov) ne sme ustaviti poskusa: pozabimo ga in poskus postavimo znova.
        console.error("Laboratorij: shranjenih meritev ni bilo mogoče obnoviti", err);
        zap.pozabi();
        bar?.remove();
        setTimeout(() => (typeof el._labZnova === "function" ? el._labZnova() : t.clear?.()));
        return zap;
      }
      const add = t.add, clear = t.clear;
      t.add = (...a) => { const r = add(...a); zap.shrani(); return r; };
      t.clear = (...a) => { const r = clear(...a); zap.obnovljeno = false; bar?.remove(); zap.shrani(); return r; };
      vezano = true;
      return zap;
    },
  };
  return zap;
}

// Napoved pred meritvijo (profil A, 2026-11-25): učenec napove, preden meri, na koncu vidi »Tvoja napoved · Izmerjeno«.
// Skupni gradnik vseh poskusov (tudi vodenega načina). napoved(o) vrne { el, primerjava, osvezi, stanje, obnovi, vrednost }:
//   o.id          ime napovedi v poskusu (ključ v shranjenem stanju), npr. "tok-6V"
//   o.vprasanje   besedilo vprašanja (HTML) ali funkcija, ki ga vrne (npr. z imenom izbrane posode)
//   o.enota       število: enota za vnos (npr. "mA"; "-krat" se izpiše brez presledka); o.dec decimalke pri izpisu (privzeto 1);
//                 o.primer besedilo v praznem polju (npr. "npr. 37"; ne pravi odgovor); o.abs: dovoljeno odstopanje v enoti
//                 (npr. 2 za ±2 °C) namesto ±10 %
//   o.moznosti    izbira namesto števila: [[vrednost, besedilo]] ali funkcija, ki jih vrne
//   o.kljuc()     postavitev, za katero velja napoved (npr. vrsta prve posode); ko se spremeni, se napoved pobriše
//   o.odprto()    ali učenec še lahko napove (privzeto vedno); ko vrne false, se okvir zapre: napoved ostane, vnos izgine
//   o.izmerjeno() null ali { vrednost, besedilo (HTML), ujema? }; ujema privzeto: število ±10 % (ali ±o.abs), izbira enaka vrednost
// N.caka: učenec še ni napovedal, a še lahko (poskus do napovedi skrije odčitek, ki bi napoved izdal).
// el gre na vrh kontrol (pred prvo meritvijo), primerjava k rezultatom. Poskus po vsaki spremembi pokliče osvezi().
// Stanje za shrambo: stanje() → { v, t, zaprto }, obnovi(s). Ni odvisen od nobenega poskusa.
// Število iz vnosa: decimalna vejica, presledki, minus (−). Za številom je lahko enota, a samo enota poskusa (»97 Ω«, »9,6 m/s²«,
// »37 °C«, »2-krat«); druga enota ali odstotek (»50 %«) ni število v tej enoti, zato null.
const normEnota = (u) => String(u ?? "").replace(/\s| /g, "").replace(/^-/, "").replace(/\^?2(?!\d)/g, "²").replace(/\^?3(?!\d)/g, "³").replace(/[·*]/g, "").replace(/^ohm(ov|a)?$/i, "Ω").toLowerCase();
export const parseStevilo = (x, enota = "") => {
  let t = String(x ?? "").trim().replace(/\s| /g, "").replace("−", "-").replace(",", ".");
  const e = normEnota(enota), m = /^([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(\D.*)$/i.exec(t);
  if (m && e && normEnota(m[2]) === e) t = m[1];
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
};
// Ali je razlika približno faktor 10ⁿ (n ≥ 1): napaka pri pretvorbi enot (mA ↔ A, mm ↔ m, kPa ↔ Pa).
export const faktorDeset = (x, prava) => {
  const r = Math.abs(Math.log10(Math.abs(x / prava)));
  const n = Math.round(r);
  return x && prava && n >= 1 && Math.abs(r - n) < 0.15 ? n : 0;
};
export function napoved(o) {
  const stevilo = !o.moznosti;
  const moznosti = () => (typeof o.moznosti === "function" ? o.moznosti() : o.moznosti) || [];
  const enota = (o.enota || "").replace(/^-/, ""); // »-krat«: brez presledka za številom (2-krat), v oznaki polja »krat«
  const vprasanje = () => (typeof o.vprasanje === "function" ? o.vprasanje() : o.vprasanje);
  let v = null, txt = "", zaprto = false, kljuc = null;
  const tekst = h("p", { class: "lab-q-text", html: vprasanje() });
  const moja = h("p", { class: "lab-napoved-moja", "aria-live": "polite" });
  const vnos = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", "aria-label": `tvoja napoved${enota ? ` v ${enota}` : ""}`, placeholder: o.primer || "" });
  const zapisi = button("Zapiši napoved", () => zapisiStevilo(), "primary small");
  vnos.addEventListener("keydown", (e) => e.key === "Enter" && zapisiStevilo());
  const polje = stevilo
    ? h("div", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, `tvoja napoved${enota ? ` [${enota}]` : ""}`), vnos, zapisi)
    : h("div", { class: "lab-opts", role: "group", "aria-label": "tvoja napoved" });
  const el = h("section", { class: "lab-q lab-napoved", "data-napoved": o.id || "" }, h("h4", {}, "Napoved"), tekst, polje, moja);
  const prim = h("dl", { class: "lab-primerjava-vrednosti" });
  const sodba = h("p", { class: "lab-why" });
  const primerjava = h("section", { class: "lab-q lab-primerjava", hidden: true }, h("h4", {}, "Tvoja napoved · Izmerjeno"), prim, sodba);
  const zEnoto = (x) => `${fmt(x, o.dec ?? 1)}${!o.enota ? "" : o.enota.startsWith("-") ? o.enota : ` ${o.enota}`}`;
  const izpis = (x) => (stevilo ? zEnoto(x) : txt);
  const zdaj = () => (o.kljuc ? String(o.kljuc()) : null);
  function zapisiStevilo() {
    const x = parseStevilo(vnos.value, o.enota);
    if (x == null) return (zadnje.moja = null), (moja.textContent = `Vpiši število${enota ? ` v ${enota}` : ""} (npr. 4,5).`);
    v = x;
    txt = izpis(x);
    kljuc = zdaj();
    osvezi();
  }
  function izberi(val, label) {
    v = val;
    txt = label;
    kljuc = zdaj();
    osvezi();
  }
  let sigMoz = "";
  const zadnje = {};
  function osvezi() {
    if (!zaprto && (o.odprto ? !o.odprto() : false)) zaprto = true;
    const m = zaprto ? null : o.izmerjeno?.();
    if (m) zaprto = true; // meritev je že tu: napovedovati ni več smiselno
    // Napoved velja za postavitev, pri kateri je bila dana (o.kljuc, npr. katera posoda je prva): ko se ta spremeni, je ni več.
    if (!zaprto && v != null && o.kljuc && zdaj() !== kljuc) (v = null), (txt = ""), (vnos.value = "");
    const vp = vprasanje();
    if (zadnje.vp !== vp) (zadnje.vp = vp), (tekst.innerHTML = vp);
    polje.hidden = zaprto;
    if (!stevilo && !zaprto) {
      const list = moznosti(), cur = v == null ? null : list.find(([val]) => val === v);
      if (v != null) cur ? (txt = cur[1]) : (v = null); // izbrane možnosti ni več
      // gumbe zgradimo znova le, ko se spremenijo možnosti; izbira spremeni samo aria-pressed (fokus ostane na gumbu)
      const sig = JSON.stringify(list);
      if (sig !== sigMoz) {
        sigMoz = sig;
        polje.replaceChildren(...list.map(([val, label]) => {
          const b = h("button", { type: "button", class: "lab-opt", onclick: () => izberi(val, label) }, label);
          b._v = val;
          return b;
        }));
      }
      for (const b of polje.children) if (b.getAttribute("aria-pressed") !== String(b._v === v)) b.setAttribute("aria-pressed", String(b._v === v));
    }
    const html = v != null ? `Tvoja napoved: <b>${txt}</b>${zaprto ? "" : ". Lahko jo še spremeniš, dokler ne začneš meriti."}` : zaprto ? "Napovedi nisi zapisal, preden si meril." : "";
    // aria-live: pišemo le spremembe (poskus lahko kliče osvezi vsakih 100 ms); primerjamo z zadnjim zapisom, ne z innerHTML (&nbsp;)
    const pisi = (x, k, val) => zadnje[k] !== val && ((zadnje[k] = val), (x.innerHTML = val));
    pisi(moja, "moja", html);
    const iz = o.izmerjeno?.();
    primerjava.hidden = !iz || v == null;
    if (primerjava.hidden) return;
    const vr = `<div><dt>Tvoja napoved</dt><dd>${txt}</dd></div><div><dt>Izmerjeno</dt><dd>${iz.besedilo}</dd></div>`;
    pisi(prim, "prim", vr);
    const d = stevilo ? Math.abs(v - iz.vrednost) : 0;
    const ok = iz.ujema ?? (!stevilo ? v === iz.vrednost : o.abs != null ? d <= o.abs + 1e-9 : d <= 0.1 * Math.abs(iz.vrednost) + 1e-9);
    // Razlika: pri temperaturi v kelvinih (»Razlika je 15,7 °C«), sicer v odstotkih; pri faktorju ~10ⁿ namig na enote.
    const n = stevilo && Number.isFinite(iz.vrednost) ? faktorDeset(v, iz.vrednost) : 0;
    const razlika = !stevilo || !Number.isFinite(iz.vrednost) ? "" : n ? `Napoved se razlikuje za faktor ~${10 ** n}: preveri enote. ` : o.abs != null ? `Razlika je ${zEnoto(d)}. ` : iz.vrednost ? `Razlika je ${fmt((100 * d) / Math.abs(iz.vrednost), 0)} %. ` : "";
    const cls = `lab-why ${ok ? "ok" : "bad"}`, sod = ok ? "<b>Napoved se ujema z meritvijo.</b>" : `<b>Napoved se ne ujema z meritvijo.</b> ${razlika}Razmisli, kaj si pri napovedi spregledal.`;
    if (sodba.className !== cls) sodba.className = cls;
    pisi(sodba, "sod", sod);
  }
  osvezi();
  return {
    el, primerjava, osvezi,
    get vrednost() { return v; },
    // učenec še ni napovedal, a lahko (poskus lahko do napovedi skrije odčitek, ki bi napoved izdal)
    get caka() { return !zaprto && v == null; },
    stanje: () => ({ v, t: txt, zaprto, k: kljuc }),
    obnovi(s) {
      if (!s || typeof s !== "object") return;
      if ((stevilo && Number.isFinite(s.v)) || (!stevilo && typeof s.v === "string")) (v = s.v), (txt = typeof s.t === "string" ? s.t : izpis(s.v)), (kljuc = typeof s.k === "string" ? s.k : zdaj());
      zaprto = !!s.zaprto;
      osvezi();
    },
  };
}

// Račun iz meritev (profil A, 2026-11-25): končni rezultat (upor iz naklona, izkoristek, g …) izračuna učenec sam.
// Aplikacija ga preveri z vrednostjo iz učenčevih meritev (ne s podatkom iz učbenika) in pokaže svoj izračun šele
// po pravilnem računu ali po »Pokaži rešitev«. Primerjava je lokalna (ne server/practice/check.js).
// preveriRacun(vnos, pricakovano, { tol, abs, enota, nazivno }) → null (ni število) ali { ok, x, p, odmik, nazivno? };
// tol relativno (0,05 = 5 %), abs absolutno; za številom je lahko enota poskusa (»97 Ω«).
// nazivno: [{ v, kaj }] napis na sestavnem delu ali vrednost iz učbenika (upornik 100 Ω, leča 100 mm, g = 9,81 m/s²).
// Če je vnos v 0,5 % od take vrednosti, meritve pa se od nje razlikujejo za več kot 1 %, to ni rezultat meritev: ok = false.
export function preveriRacun(vnos, pricakovano, { tol = 0.05, abs = 0, enota = "", nazivno = [] } = {}) {
  const x = parseStevilo(vnos, enota);
  if (x == null || !Number.isFinite(pricakovano)) return null;
  const d = Math.abs(x - pricakovano), odmik = pricakovano ? d / Math.abs(pricakovano) : d;
  const n = nazivno.find((q) => Number.isFinite(q?.v) && q.v && Math.abs(x / q.v - 1) <= 0.005 && Math.abs(pricakovano / q.v - 1) > 0.01);
  if (n) return { ok: false, x, p: pricakovano, odmik, nazivno: n };
  return { ok: d <= Math.max(abs, tol * Math.abs(pricakovano)) + 1e-12, x, p: pricakovano, odmik };
}
// Odziv brez številke (sicer učenec iz »razlikuje se za 15 %« v dveh poskusih izračuna rešitev): le približno, koliko je daleč.
export function odzivRacuna(r, tol = 0.05) {
  if (r.nazivno) return `To je ${r.nazivno.kaj}, ne rezultat tvojih meritev. Izračunaj ga iz svojih meritev.`;
  const n = faktorDeset(r.x, r.p);
  if (n) return `Tvoj rezultat se razlikuje za faktor ~${10 ** n}: preveri pretvorbo enot.`;
  if (r.odmik <= Math.max(2 * tol, 0.06)) return "Tvoj rezultat je blizu, a še ne dovolj natančen. Preveri zaokroževanje in račun.";
  if (r.odmik <= 0.3) return "Tvoj rezultat se precej razlikuje od vrednosti iz tvojih meritev. Preveri račun in enote.";
  return "Tvoj rezultat je daleč od vrednosti iz tvojih meritev. Preveri, katere količine si vzel, in enote.";
}
// racun({ enota, tol, abs, dec, onOdkrij }) → { el, nastavi(cilji), odkrito(key), stanje(), obnovi(s) }
//   cilji: [{ key, kaj (HTML: kaj izračunaš), vrednost (iz meritev), nazivno? }] (prazno: okvir je skrit); privzeto zadnji cilj.
//   Cilj, ki ga ni več med cilji (meritve izbrisane), ni več odkrit.
//   onOdkrij(key): poskus ponovno nariše izračun (zdaj s številko)
export function racun({ enota = "", tol = 0.05, abs = 0, dec = 2, onOdkrij } = {}) {
  let cilji = [], izbran = null;
  const odkrito = new Set();
  const izbira = h("select", { class: "lab-racun-sel", "aria-label": "kaj računaš" });
  izbira.addEventListener("change", () => ((izbran = izbira.value), pokazi()));
  const izbiraVrsta = h("label", { class: "demo-slider", hidden: true }, h("span", { class: "demo-slider-label" }, "kaj računaš"), izbira);
  const kaj = h("p", { class: "lab-q-text" });
  const vnos = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", "aria-label": `tvoj rezultat${enota ? ` v ${enota}` : ""}` });
  vnos.addEventListener("keydown", (e) => e.key === "Enter" && preveri());
  const odziv = h("p", { class: "lab-why", "aria-live": "polite", hidden: true });
  vnos.addEventListener("input", () => odziv.className.includes("bad") && (odziv.hidden = true)); // star odziv ne velja za nov vnos
  const el = h("section", { class: "lab-q lab-racun", hidden: true },
    h("h4", {}, "Tvoj račun"),
    izbiraVrsta, kaj,
    h("div", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, `tvoj rezultat${enota ? ` [${enota}]` : ""}`), vnos),
    h("div", { class: "demo-buttons" }, button("Preveri moj račun", () => preveri(), "primary small"), button("Pokaži rešitev", () => odkrij(false))),
    odziv);
  const cilj = () => cilji.find((c) => c.key === izbran);
  const izpis = (x) => `${fixed(x, dec)}${enota ? `\u00a0${enota}` : ""}`; // fixed: 15,0 N/m, 9,80 m/s² (ne 15 in 9,8)
  function pokazi() {
    const c = cilj();
    if (!c) return;
    kaj.innerHTML = c.kaj;
    odziv.hidden = true;
  }
  function odkrij(pravilno) {
    const c = cilj();
    if (!c) return;
    odkrito.add(c.key);
    odziv.hidden = false;
    odziv.className = `lab-why ${pravilno ? "ok" : ""}`;
    odziv.innerHTML = pravilno
      ? `<b>Pravilno.</b> Iz tvojih meritev dobiš ${izpis(c.vrednost)}. Izračun je zdaj tudi zgoraj.`
      : `Rešitev iz tvojih meritev: <b>${izpis(c.vrednost)}</b>. Postopek je v izračunu zgoraj.`;
    onOdkrij?.(c.key);
  }
  function preveri() {
    const c = cilj();
    if (!c) return;
    const r = preveriRacun(vnos.value, c.vrednost, { tol, abs, enota, nazivno: c.nazivno || [] });
    odziv.hidden = false;
    if (!r) return (odziv.className = "lab-why"), (odziv.textContent = `Vpiši število${enota ? ` v ${enota}` : ""} (npr. 98,5).`);
    if (r.ok) return odkrij(true);
    odziv.className = "lab-why bad";
    odziv.innerHTML = `<b>Ne čisto.</b> ${odzivRacuna(r, tol)}`;
  }
  return {
    el,
    odkrito: (key) => odkrito.has(key),
    // cilji iz meritev; okvir je viden, ko je kaj računati. Izbira ostane, dokler je med cilji, sicer zadnji cilj.
    nastavi(list) {
      const prej = JSON.stringify(cilji.map((c) => [c.key, c.kaj])), prejV = cilj()?.vrednost;
      // izbrisane meritve: rešitev ni več odkrita (nove meritve istega poskusa spet računaš sam)
      for (const k of [...odkrito]) if (!list.some((c) => c.key === k)) odkrito.delete(k);
      cilji = list.filter((c) => Number.isFinite(c.vrednost));
      if (cilj() && cilj().vrednost !== prejV && !odkrito.has(izbran)) odziv.hidden = true; // nova meritev: star odziv ne velja
      el.hidden = !cilji.length;
      if (!cilji.length) return (vnos.value = ""), (odziv.hidden = true);
      if (!cilji.some((c) => c.key === izbran)) (izbran = cilji.at(-1).key), (vnos.value = "");
      if (prej !== JSON.stringify(cilji.map((c) => [c.key, c.kaj]))) {
        izbira.replaceChildren(...cilji.map((c) => h("option", { value: c.key }, c.ime || c.key)));
        izbira.value = izbran;
        izbiraVrsta.hidden = cilji.length < 2;
        pokazi();
      }
    },
    get pricakovano() { return cilj()?.vrednost ?? null; },
    stanje: () => [...odkrito],
    obnovi: (s) => Array.isArray(s) && s.forEach((k) => typeof k === "string" && odkrito.add(k)),
  };
}

// Dnevnik dogodkov (kaj se je zgodilo v laboratoriju), najnovejši zgoraj.
export function eventLog() {
  const ul = h("ul", { class: "lab-log", "aria-live": "polite" });
  ul.push = (text, kind = "info") => {
    ul.prepend(h("li", { class: `lab-ev ${kind}`, html: text }));
    while (ul.children.length > 5) ul.lastChild.remove();
  };
  return ul;
}

// Zložljiv seznam poenostavitev in virov.
export function notes(items, sources) {
  return h(
    "details",
    { class: "lab-notes" },
    h("summary", {}, "Kaj je poenostavljeno in od kod so podatki?"),
    h("ul", {}, ...items.map((t) => h("li", {}, t))),
    sources ? h("p", { class: "muted", html: sources }) : null,
  );
}

// Na telefonu ostane risba vidna (j, 2026-11-04: »s scrollanjem do gumbov skriješ animacijo«; docs/laboratorij.md).
// sim/index.js (mountSim) to pokliče za vsak poskus z razredom .lab, zato ga dobi tudi vsak nov poskus.
// Risba (.demo-stage) in kontrole (.demo-controls) gredo v skupni .lab-tit-top; CSS (textbook.css) risbo z merilniki
// pripne na vrh drsnega dela, na širokem in ležečem zaslonu pa levo ob kontrole; široko risbo (vodoravna proga, vezje:
// razmerje stranic ≥ SIROKA) na širokem zaslonu pa čez vso širino na vrh, kontrole pod njo v dveh stolpcih. Tu le: gumb »Pripni sliko«
// (zapomnjen na napravi), višina vidnega dela (--lab-okno), senca, ko je risba pripeta, in fokus, ki ne gre pod risbo.
const PIN_KEY = "evklid.lab.pripni";
const pinRead = () => { try { return localStorage.getItem(PIN_KEY) !== "0"; } catch { return true; } };
const pinWrite = (on) => { try { localStorage.setItem(PIN_KEY, on ? "1" : "0"); } catch {} };
const SIROKA = 1.55; // od tega razmerja širina : višina je risba na računalniku zgoraj čez vso širino (lab-klanec 2,33, lab-ohm 1,6)
const vvH = () => (typeof visualViewport !== "undefined" && visualViewport ? visualViewport.height : innerHeight);

export function pripni(el) {
  el._labOff?.(); // »Ponastavi« (mountSim znova): poslušalci prejšnje risbe gredo takoj, ne šele ob naslednjem drsenju
  let top = el.querySelector(":scope > .lab-tit-top");
  // Poskus z layout({ stage, controls }) (lab-ohm, lab-co2): risbo in kontrole zavijemo v .lab-tit-top.
  if (!top) {
    const st = el.querySelector(":scope > .demo-stage"), ctl = st?.nextElementSibling;
    if (!st || !ctl?.classList.contains("demo-controls")) return null;
    top = h("div", { class: "lab-tit-top" });
    st.before(top);
    top.append(st, ctl);
  }
  const stage = top.querySelector(":scope > .demo-stage");
  if (!stage) return null;
  const svg0 = stage.querySelector(".demo-svg"), vb = svg0?.viewBox?.baseVal;
  if (vb?.width && vb.height) stage.style.setProperty("--lab-ar", (vb.width / vb.height).toFixed(3));
  el.classList.toggle("lab-siroka", vb?.height > 0 && vb.width / vb.height >= SIROKA);
  // risba (ali njen ovoj, npr. .lab-ek-risba) v .demo-stage: CSS jo pri široki risbi postavi levo od merilnikov
  [...stage.children].find((c) => c.contains(svg0))?.classList.add("lab-slika");
  const btn = h("button", { type: "button", class: "lab-pin", "aria-label": t("sim.lab.pin"), title: t("sim.lab.pin"), html: icon("pin") });
  const set = (on) => {
    el.classList.toggle("lab-odpeto", !on);
    btn.setAttribute("aria-pressed", String(on));
  };
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    pinWrite(on);
    set(on);
    upd();
  });
  stage.prepend(btn);
  set(pinRead());
  // »Povečaj risbo«: risba z merilniki čez ves zaslon (vrhnja plast brskalnika), cela vidna; ležeča električna shema se na pokončnem
  // telefonu obrne za 90°, njeni napisi ostanejo pokonci. Zapre jo isti gumb, Esc ali tipka Nazaj
  // (app.js → backStep klikne gumb). Odprta je pogovorno okno (role=dialog), ostala stran je medtem neodzivna (inert).
  let zapriPovecavo = () => {};
  if (typeof stage.showPopover === "function") {
    const zoom = h("button", { type: "button", class: "lab-zoom", "aria-label": t("sim.lab.zoom"), title: t("sim.lab.zoom"), "aria-pressed": "false", html: icon("maximize-2") });
    let mirni = [], prejFokus = null, straza = 0;
    const ozadje = (on) => {
      for (const x of mirni) x.inert = false;
      mirni = [];
      if (!on) return;
      for (let a = stage; a.parentElement; a = a.parentElement) for (const b of a.parentElement.children) if (b !== a && !b.inert && b.localName !== "script" && b.localName !== "style") (b.inert = true), mirni.push(b);
    };
    const povecaj = (on) => {
      if (on === stage.classList.contains("lab-povecano")) return;
      try {
        if (on) (stage.setAttribute("popover", "manual"), stage.showPopover());
        else (stage.hidePopover(), stage.removeAttribute("popover"));
      } catch {
        stage.removeAttribute("popover");
        on = false;
      }
      stage.classList.toggle("lab-povecano", on);
      // Obrne se le električna shema (napisi se zavrtijo nazaj pokonci); prizor na mizi (steklovina, tekočine) ostane
      // pokonci in cel na zaslonu, ker bi bil na boku fizikalno napačen. Večji je, ko učenec telefon obrne ležeče.
      stage.classList.toggle("lab-lezi", on && !!stage.querySelector("svg.lab-circuit:not(.lab-foto-on)") && (parseFloat(stage.style.getPropertyValue("--lab-ar")) || 1) >= 1.25);
      for (const [k, v] of [["role", "dialog"], ["aria-modal", "true"], ["aria-label", t("sim.lab.zoom")]]) on ? stage.setAttribute(k, v) : stage.removeAttribute(k);
      ozadje(on);
      // Poskus lahko izgine med odprto povečavo (drug pogled, »Ponastavi«, ukaz inštruktorja): ozadje ne sme ostati neodzivno.
      clearInterval(straza);
      if (on) straza = setInterval(() => (el.isConnected && stage.isConnected && el._labPin === gen) || zapriPovecavo(), 300);
      zoom.setAttribute("aria-pressed", String(on));
      zoom.innerHTML = icon(on ? "minimize-2" : "maximize-2");
      if (on) (prejFokus = document.activeElement), zoom.focus({ preventScroll: true });
      else if (prejFokus?.isConnected && prejFokus !== document.body) prejFokus.focus({ preventScroll: true });
      else zoom.focus({ preventScroll: true });
      upd();
    };
    zapriPovecavo = () => {
      clearInterval(straza);
      ozadje(false);
      if (stage.isConnected) povecaj(false);
    };
    zoom.addEventListener("click", () => povecaj(!stage.classList.contains("lab-povecano")));
    stage.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !stage.classList.contains("lab-povecano")) return;
      e.stopPropagation();
      e.preventDefault();
      povecaj(false);
    });
    btn.after(zoom);
  }

  // Drsni del, v katerem je poskus (pogled aplikacije, stranski stolpec lekcije ali stran sama).
  const scroller = () => {
    for (let a = el.parentElement; a; a = a.parentElement) {
      const o = getComputedStyle(a).overflowY;
      if (o === "auto" || o === "scroll") return a;
    }
    return null;
  };
  const gen = (el._labPin = (el._labPin || 0) + 1);
  let sc = null, raf = 0;
  const port = () => (sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight });
  const sticky = () => getComputedStyle(stage).position === "sticky";
  // Pišemo le spremembe: upd teče ob vsakem drsenju in ob vsaki spremembi merilnika, enak zapis bi znova sprožil slog.
  const put = (x, k, v) => (v == null ? x.style.getPropertyValue(k) && x.style.removeProperty(k) : x.style.getPropertyValue(k) !== v && x.style.setProperty(k, v));
  function upd() {
    raf = 0;
    if (el._labPin !== gen || !el.isConnected) return off();
    const p = port();
    const okno = Math.round(Math.max(0, Math.min(p.bottom, vvH()) - Math.max(p.top, 0)));
    if (okno) put(el, "--lab-okno", `${okno}px`);
    // Zelo nizek vidni del (odprta tipkovnica na majhnem telefonu, deljen zaslon): risba ne gre nad kontrole.
    el.classList.toggle("lab-nizko", okno > 0 && okno < 330);
    const pin = sticky(), sr = stage.getBoundingClientRect();
    stage.classList.toggle("lab-prilepljeno", pin && sr.top - top.getBoundingClientRect().top > 1);
    // Višina risbe: pripeti del (risba + merilniki + stanje) skupaj ~45 % vidne višine nad kontrolami,
    // ob kontrolah (široko, ležeče) pa cel na zaslonu. Merilniki in stanje so neodvisni od risbe, zato se ne ziblje.
    const svg = stage.querySelector(".demo-svg"), ctl = top.querySelector(":scope > .demo-controls");
    const cr = ctl?.getBoundingClientRect(), beside = cr && (cr.left >= sr.right - 1 || cr.right <= sr.left + 1);
    // scroll-margin-top kontrol (textbook.css): scrollIntoView in fokus jih ne postavita pod pripeto risbo
    put(el, "--lab-pin-h", pin && !beside ? `${Math.round(sr.height + 8)}px` : null);
    if (!pin || !svg || !okno) return put(stage, "--lab-risba-h", null);
    const gap = parseFloat(getComputedStyle(stage).top) + (sc ? parseFloat(getComputedStyle(sc).paddingTop) || 0 : 0);
    // telefon in tablica ~50 % (j, 10. 11. 2026: risba naj bo večja; prej 45 %), z miško (npr. stranski stolpec lekcije na računalniku) ~60 %: tam se drsi s kolescem
    // pokončna risba (titracija: bireta in povečan menisk) je pri isti višini ozka, zato dobi malo več višine (~58 %)
    const tall = (parseFloat(stage.style.getPropertyValue("--lab-ar")) || 1.4) < 0.95;
    // široka risba na širokem zaslonu (zgoraj, merilniki desno od nje): ~45 % vidne višine, ne glede na miško
    const vrh = !beside && el.classList.contains("lab-siroka") && top.clientWidth >= 800;
    const total = beside ? okno - Math.max(0, gap) - 6 : okno * (vrh || matchMedia("(pointer: coarse)").matches ? (tall ? 0.58 : 0.5) : 0.6);
    // ob merilnikih je višina pripetega dela višina risbe in odmikov (merilniki ne štejejo, sicer bi se risba zibala)
    const rest = vrh ? 18 : sr.height - svg.getBoundingClientRect().height;
    put(stage, "--lab-risba-h", `${Math.round(Math.max(beside ? 100 : 110, total - rest))}px`);
  }
  const later = () => raf || (raf = requestAnimationFrame(upd));
  // Fokus (Tab, tipkovnica telefona) na kontroli pod pripeto risbo ali pod spodnjim robom: pomakni jo na vidno mesto.
  const reveal = (x) => {
    if (!x || !top.contains(x) || stage.contains(x) || !sticky()) return;
    const r = x.getBoundingClientRect(), s = stage.getBoundingClientRect(), bottom = Math.min(port().bottom, vvH());
    if (s.right <= r.left || s.left >= r.right) return; // risba je ob kontrolah (široko), ne nad njimi
    const dy = r.top < s.bottom + 4 ? r.top - s.bottom - 8 : r.bottom > bottom - 4 ? Math.min(r.bottom - bottom + 8, r.top - s.bottom - 8) : 0;
    if (dy) (sc || document.scrollingElement).scrollBy({ top: dy });
  };
  const focused = () => (top.contains(document.activeElement) ? document.activeElement : null);
  const onFocus = (e) => {
    if (el._labPin !== gen) return el.removeEventListener("focusin", onFocus); // »Ponastavi« je poskus zgradil znova
    reveal(e.target);
    setTimeout(() => reveal(focused() === e.target ? e.target : null), 350);
  };
  const onResize = () => (later(), setTimeout(() => reveal(focused()), 60));
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(later) : null;
  function off() {
    zapriPovecavo();
    if (el._labOff === off) el._labOff = null;
    cancelAnimationFrame(raf);
    raf = 0;
    el.removeEventListener("focusin", onFocus);
    (sc || window).removeEventListener("scroll", later);
    removeEventListener("resize", onResize);
    ro?.disconnect();
  }
  el.addEventListener("focusin", onFocus);
  el._labOff = off;
  // Drsni del poiščemo ob prvem izrisu, ko je poskus že na strani.
  requestAnimationFrame(() => {
    if (el._labPin !== gen) return;
    sc = scroller();
    // Pripeta risba se drži vrha drsnega dela, ne njegovega notranjega odmika (sicer bi nad njo kukale kontrole).
    if (sc) el.style.setProperty("--lab-vrh", `${-parseFloat(getComputedStyle(sc).paddingTop) || 0}px`);
    (sc || window).addEventListener("scroll", later, { passive: true });
    addEventListener("resize", onResize);
    ro?.observe(sc || document.documentElement);
    ro?.observe(stage); // novo stanje ali opomba merilnika spremeni višino pripetega dela
    upd();
  });
  return btn;
}

export const num = (x, d) => fmt(x, d);
// Število z vedno enakim številom decimalk (kot ga pokaže merilnik): 6,00 in ne 6.
export const fixed = (x, d) => {
  const t = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  return t.replace(".", ",").replace("-", "−");
};
export { tex };
// Formule v besedilu poskusov so KaTeX s pravimi ulomki (j, 12. 11. 2026: »Popravi take formule povsod«), ne
// <i>T</i> = (…)/(…) v besedilu, ki se lomi sredi izraza. Formula ostane v eni vrstici, ko gre; sicer jo sirina.js
// prelomi pri =; nikoli ne drsi. Enota za številom: en("°C"), en("J/(kg·K)"); krepki rezultat: rez(fixed(x, 1), "°C").
// Enote so stalni zapisi iz kode (ne vnos): vsak znak, ki v LaTeX ni sam zase (tudi \ { } $ _ ^ ~ # &), dobi svoj zapis.
const ENOTA = { " ": "\\,", "%": "\\%", "°": "{}^\\circ ", "·": "\\cdot ", "²": "^2", "³": "^3", "⁻¹": "^{-1}", "Ω": "\\Omega ", "\\": "\\backslash ", "{": "\\{", "}": "\\}", "$": "\\$", _: "\\_", "^": "\\hat{}", "~": "\\sim ", "#": "\\#", "&": "\\&" };
const enTex = (u) => String(u).replace(/⁻¹|[ %°·²³Ω\\{}$_^~#&]/g, (c) => ENOTA[c]);
export const en = (u) => `\\,\\mathrm{${enTex(u)}}`;
// Število, ki ga ni (fmt da »–«), je v formuli \text{–}; µ v enoti ne gre (KaTeX ga piše ležeče): enoto z µ napiši za formulo.
export const rez = (x, u) => `\\mathbf{${String(x).replace("–", "\\text{–}")}${u ? `\\,${enTex(u)}` : ""}}`;

// Posnetek stanja odprtega poskusa za »Vprašaj inštruktorja« (server/ucni-kontekst.js, j 24. 11. 2026): iz DOM, zato
// velja za vse poskuse brez kode v vsakem posebej. Kontrole: oznaka `.demo-slider-label` (kit.js slider, select, vrstice
// `row` v lab-*.js) in vrednost v drsniku (izpis), izbranem gumbu, seznamu ali polju; skupine gumbov in polja z lastnim
// `aria-label`; stikala `.demo-check`. Seznam, ki še kaže »izberi …«, ni nastavitev. Isto ime dvakrat (levi in desni
// polčlen) dobi naslov svojega okvirja (`legend`). Odčitki: zasloni merilnikov (lcd). Meritve: samo vidna tabela meritev,
// zadnjih 20 vrstic, celica »·« je prazna. Nič ne izračuna in nič ne ugiba: česar ni na zaslonu, v posnetku ni.
const besedilo = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
const PRAZNO = /^(|·|–|-|—|izberi\b.*|– ?izberi.*|\.\.\.|…)$/i;
const izbrano = (sel) => {
  const o = sel.selectedOptions?.[0];
  const v = besedilo(o) || sel.value;
  return !sel.value || PRAZNO.test(v) ? "" : v;
};
export function stanjePoskusa(root, { parametri = 16, odcitki = 8, vrstice = 20 } = {}) {
  const vidno = (el) => !el.closest("[hidden]");
  const okvir = (el) => besedilo(el.closest("fieldset")?.querySelector("legend"));
  const nabor = []; // { ime, vrednost, okvir }
  const prebrano = new Set();
  for (const lab of root?.querySelectorAll?.(".demo-slider-label") || []) {
    const box = lab.parentElement;
    // Vrstica (`row`) okoli drsnika ali seznama z lastno oznako: vrednost prebere notranja oznaka, ne obe.
    if (!box || !vidno(box) || box.querySelectorAll(".demo-slider-label").length > 1) continue;
    const ime = besedilo(lab);
    const range = box.querySelector('input[type="range"]');
    const on = box.querySelector('.seg-btn.on, .seg-btn[aria-checked="true"]');
    const sel = box.querySelector("select");
    const vnos = box.querySelector('input[type="text"], input[type="number"]');
    let vrednost = "";
    if (range && !range.hidden) vrednost = besedilo(box.querySelector("output")) || String(range.value);
    else if (on) vrednost = besedilo(on);
    else if (sel) vrednost = izbrano(sel);
    else if (vnos) vrednost = vnos.value.trim();
    box.querySelectorAll('[role="radiogroup"], select, input').forEach((x) => prebrano.add(x));
    if (ime && vrednost) nabor.push({ ime, vrednost, okvir: okvir(box) });
  }
  // Skupine gumbov in polja brez vrstice z oznako (npr. pipa birete, odčitek birete, vrsta škroba).
  for (const g of root?.querySelectorAll?.('[role="radiogroup"][aria-label], input[type="text"][aria-label], input[type="number"][aria-label]') || []) {
    if (prebrano.has(g) || !vidno(g) || g.closest(".demo-slider, .lab-row")) continue;
    const vrednost = g.matches("input") ? g.value.trim() : besedilo(g.querySelector('.seg-btn.on, [aria-checked="true"]'));
    if (vrednost) nabor.push({ ime: g.getAttribute("aria-label").trim(), vrednost, okvir: okvir(g) });
  }
  for (const chk of root?.querySelectorAll?.(".demo-check") || []) {
    const input = chk.querySelector('input[type="checkbox"]');
    const ime = besedilo(chk);
    if (input && ime && vidno(chk)) nabor.push({ ime, vrednost: input.checked ? "da" : "ne", okvir: okvir(chk) });
  }
  const stej = new Map();
  for (const x of nabor) stej.set(x.ime, (stej.get(x.ime) || 0) + 1);
  const parameters = nabor
    .map((x) => ({ ime: stej.get(x.ime) > 1 && x.okvir ? `${x.okvir}: ${x.ime}` : x.ime, vrednost: x.vrednost }))
    .slice(0, parametri);
  const readings = [];
  for (const el of root?.querySelectorAll?.(".lab-lcd") || []) {
    if (readings.length >= odcitki) break;
    if (!vidno(el) || el.classList.contains("off")) continue;
    const v = besedilo(el.querySelector(".lab-lcd-val"));
    if (!v || v === "–") continue;
    readings.push({ ime: besedilo(el.querySelector(".lab-lcd-name")), vrednost: `${v} ${besedilo(el.querySelector(".lab-lcd-unit"))}`.trim() });
  }
  // Celica: izbira v celici (npr. skupina snovi) je izbrana možnost, sicer besedilo; »·« in »izberi …« sta prazna.
  const celica = (td) => {
    const sel = td.querySelector("select");
    // Barvni vzorec brez besedila (npr. jodovica pri amilazi) ima ime v aria-label.
    const v = sel ? izbrano(sel) : besedilo(td) || [...td.querySelectorAll("[aria-label]")].map((x) => x.getAttribute("aria-label").trim()).join(", ");
    return PRAZNO.test(v) ? "" : v;
  };
  let measurements = null;
  for (const table of root?.querySelectorAll?.("table.lab-table") || []) {
    if (!vidno(table) || !table.getClientRects?.().length) continue; // skrita tabela drugega dela poskusa
    const glava = [...table.querySelectorAll("thead th")].map(besedilo);
    const od = glava[0] === "#" ? 1 : 0; // zaporedna številka, ki jo doda dataTable
    const rows = [...table.querySelectorAll("tbody tr")]
      .map((tr) => [...tr.children].slice(od).map(celica))
      .filter((r) => r.slice(od ? 0 : 1).some(Boolean)); // vrstica s samo imenom (npr. »kovina« brez meritve) ni meritev
    if (!rows.length) continue;
    measurements = { stolpci: glava.slice(od), vrstice: rows.slice(-vrstice) };
    break;
  }
  return { parameters, readings, ...(measurements ? { measurements } : {}) };
}
