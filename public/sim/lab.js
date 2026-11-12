// Gradniki virtualnega laboratorija: zaslon merilnika, tabela meritev, graf, vprašanje o sklepu, dnevnik dogodkov.
// Modeli so v lab-model.js; tu je samo prikaz. Besedila so slovenska kot v ostalih simulacijah učbenika.
import { h, s, fmt, svgBox, axes, tex } from "./kit.js";
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
  // Besedilo prazne tabele po korakih poskusa: »Še ni meritev. Natoči …« ne sme ostati, ko je voda že v posodi.
  el.setEmpty = (text) => { if (none.textContent !== text) none.textContent = text; };
  el.rows = rows;
  draw();
  return el;
}

// Graf meritev s stalnimi osmi. draw(series): [{ pts: [[x, y]], shape: "o" | "^", cls: "a", label, line?: f(x) }]
// origin: false postavi časovno os na spodnji rob (pri negativnih vrednostih, npr. Δm), da se oznake ne prekrivajo.
export function dataGraph({ W = 340, H = 220, x, y, xLabel, yLabel, xStep, yStep, title, origin = true }) {
  const svg = svgBox(W, H, "lab-graph");
  svg.setAttribute("aria-label", title || "Graf meritev");
  const wrap = h("figure", { class: "lab-graph-wrap" }, svg);
  // Legenda je hkrati vklop in izklop: vsaka vrsta meritev, njena premica in mreža (public/sim/prikaz.js za ostale grafe).
  const legend = h("figcaption", { class: "lab-legend", role: "group" });
  wrap.append(legend);
  let A = null, last = [];
  const off = new Set();
  wrap.setAxes = (ax) => Object.assign(opts, ax);
  const opts = { x, y };
  const chip = (key, sym, text) =>
    h("button", { type: "button", class: "lab-leg layer-chip", "data-layer": key, "aria-pressed": String(!off.has(key)), onclick: () => {
      off.has(key) ? off.delete(key) : off.add(key);
      wrap.draw(last);
      // draw legendo nariše znova: fokus ostane na istem gumbu (tipkovnica)
      [...legend.children].find((c) => c.dataset.layer === key)?.focus();
    } }, sym, text);
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
    legend.replaceChildren();
    legend.setAttribute("aria-label", t("sim.layers"));
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
      if (S.line && !S.pts.length) return legend.append(chip(`fit:${id}`, h("i", { class: `lab-sym line bg-${S.cls}`, "aria-hidden": "true" }), S.label));
      legend.append(chip(`pt:${id}`, h("i", { class: `lab-sym ${S.shape === "^" ? "tri" : "dot"} bg-${S.cls}`, "aria-hidden": "true" }), S.label + (clipped ? ` (${clipped} izven grafa)` : "")));
      if (S.line) legend.append(chip(`fit:${id}`, h("i", { class: `lab-sym line bg-${S.cls}`, "aria-hidden": "true" }), t("sim.layer.fit", { name: S.label })));
    });
    if (legend.children.length) legend.append(chip("grid", h("i", { class: "layer-sw sw-grid", "aria-hidden": "true" }), t("sim.layer.grid")));
  };
  wrap.draw();
  return wrap;
}

// Vprašanje o sklepu: ena pravilna možnost, pri vsaki razlaga.
// q = { text, options: [{ t, ok, why }] }
export function conclusion(q) {
  const why = h("p", { class: "lab-why", "aria-live": "polite", hidden: true });
  const opts = q.options.map((o, i) =>
    h("button", { type: "button", class: "lab-opt", "data-i": i, onclick: (ev) => pick(ev.currentTarget, o) }, h("span", { html: o.t })),
  );
  const pick = (b, o) => {
    b.classList.add(o.ok ? "ok" : "bad");
    b.setAttribute("aria-pressed", "true");
    why.hidden = false;
    why.className = `lab-why ${o.ok ? "ok" : "bad"}`;
    why.innerHTML = `<b>${o.ok ? "Pravilno." : "Ne čisto."}</b> ${o.why}`;
  };
  return h("section", { class: "lab-q" }, h("h4", {}, "Sklep"), h("p", { class: "lab-q-text", html: q.text }), h("div", { class: "lab-opts" }, ...opts), why);
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
      stage.classList.toggle("lab-lezi", on && !!stage.querySelector("svg.lab-circuit") && (parseFloat(stage.style.getPropertyValue("--lab-ar")) || 1) >= 1.25);
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
