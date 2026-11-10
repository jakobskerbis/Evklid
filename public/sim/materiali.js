// Materiali laboratorija: steklo, tekočine, kovina, les, delovna plošča in mehke sence za vse poskuse.
// En skrit <svg id="mat-defs"> z <defs> na stran (prelivi in vzorec, brez rastrskih slik in brez filtrov), ki ga
// risbe uporabijo prek razredov. kit.js → s() pokliče okrasi(el) za vsak element z razredom materiala; okras
// (odsev, senca, debelina stene) se doda po koncu risanja (mikroopravilo), ko so atributi elementa dokončni.
// Poskusi rišejo kot prej (`class: "lab-glass"`, `lab-liq`, `lab-tit-bench` …); ročno se doda le, česar razred ne pove.
// Barve robov in plošče so spremenljivke (--mat-*), zato veljajo v svetlem, temnem in zgodovinskih slogih.

const stop = (o, c, a = 1) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`;
const vstop = (o, v, a = 1) => `<stop offset="${o}" style="stop-color:var(${v})" stop-opacity="${a}"/>`;
const lin = (id, stops, x2 = 1, y2 = 0) => `<linearGradient id="mat-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.join("")}</linearGradient>`;
const rad = (id, stops, extra = "") => `<radialGradient id="mat-${id}" ${extra}>${stops.join("")}</radialGradient>`;

// <defs> kot besedilo (test preveri, da ima vsak url(#mat-…) iz CSS tukaj svoj id).
export const DEFS = [
  // steklo: temnejša robova (lom svetlobe v debelini stene), oster odsev levo, skoraj prozorna sredina, šibek odsev desno
  lin("steklo", [vstop(0, "--mat-st-rob", 0.34), stop(0.07, "#fff", 0.78), stop(0.17, "#fff", 0.2), stop(0.3, "#cfe3f2", 0.1), stop(0.7, "#cfe3f2", 0.12), stop(0.86, "#a9c3d6", 0.2), stop(0.93, "#fff", 0.42), vstop(1, "--mat-st-rob", 0.42)]),
  // tekočina: temnejša ob steni (daljša pot svetlobe), svetel pas ob levem robu
  lin("tek", [stop(0, "#06243f", 0.3), stop(0.1, "#fff", 0.24), stop(0.26, "#fff", 0), stop(0.74, "#06243f", 0), stop(1, "#06243f", 0.32)]),
  // gladina: sij na vrhu, proti dnu temneje (globina)
  lin("gladina", [stop(0, "#fff", 0.55), stop(0.05, "#fff", 0.16), stop(0.3, "#fff", 0), stop(0.6, "#06243f", 0), stop(1, "#06243f", 0.24)], 0, 1),
  // brušena kovina: poševen lesk, ki deluje na ležečih in pokončnih delih
  lin("kovina", [stop(0, "#000", 0.26), stop(0.28, "#fff", 0.6), stop(0.46, "#fff", 0.1), stop(0.72, "#000", 0.08), stop(1, "#000", 0.3)], 1, 1),
  // ohišje naprave: svetloba od zgoraj
  lin("naprava", [stop(0, "#fff", 0.42), stop(0.14, "#fff", 0.1), stop(0.55, "#000", 0), stop(1, "#000", 0.18)], 0, 1),
  lin("miza", [vstop(0, "--mat-miza-0"), vstop(0.22, "--mat-miza-1"), vstop(1, "--mat-miza-2")], 0, 1),
  lin("miza-senca", [stop(0, "#000", 0.16), stop(1, "#000", 0)], 0, 1),
  rad("senca", [stop(0, "#000", 0.3), stop(0.55, "#000", 0.13), stop(1, "#000", 0)]),
  rad("merilnik", [vstop(0, "--mat-mer-0"), vstop(0.72, "--mat-mer-1"), vstop(1, "--mat-mer-2")], 'cx="0.4" cy="0.34" r="0.75"'),
  rad("sij", [stop(0, "#fff", 0.85), stop(0.4, "#fff", 0.25), stop(1, "#fff", 0)]),
  // odsev okna na steklu: svetel pokončen pas, ki proti dnu ugaša
  lin("okno", [stop(0, "#fff", 0.95), stop(0.55, "#fff", 0.6), stop(1, "#fff", 0.12)], 0, 1),
  // valj iz kroma ali jekla (palica stojala, utež, upornik): ostri pasovi svetlobe in odseva okolice; -x pokončen, -y ležeč
  ...["x", "y"].map((os) => lin(`valj-${os}`, [stop(0, "#000", 0.36), stop(0.1, "#000", 0.06), stop(0.24, "#fff", 0.78), stop(0.36, "#fff", 0.16), stop(0.58, "#000", 0.1), stop(0.8, "#000", 0.32), stop(0.91, "#fff", 0.24), stop(1, "#000", 0.4)], os === "x" ? 1 : 0, os === "x" ? 0 : 1)),
  // debelo dno steklene posode: zelenkast rob borosilikatnega stekla
  lin("dno", [stop(0, "#bfe3dc", 0), stop(0.45, "#bfe3dc", 0.5), stop(1, "#7fb3b0", 0.72)], 0, 1),
  // mehurček ali kapljica: prozorna sredina, temnejši rob (lom na meji), bel odsev zgoraj levo
  rad("kaplja", [stop(0, "#fff", 0.95), stop(0.28, "#fff", 0.3), stop(0.72, "#e6eef4", 0.14), stop(0.9, "#6d8aa3", 0.55), stop(1, "#4a6780", 0.85)], 'cx="0.5" cy="0.5" r="0.5" fx="0.36" fy="0.32"'),
  // zrnata trdna snov (prašek, oborina, sol, kamen)
  `<pattern id="mat-zrna" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.5" r="0.55" fill="#000" fill-opacity="0.2"/><circle cx="4.6" cy="0.9" r="0.4" fill="#fff" fill-opacity="0.6"/><circle cx="3.1" cy="3.9" r="0.6" fill="#000" fill-opacity="0.16"/><circle cx="6" cy="5.2" r="0.45" fill="#000" fill-opacity="0.22"/><circle cx="1.4" cy="5.6" r="0.4" fill="#fff" fill-opacity="0.55"/></pattern>`,
  // les: letnice kot vzorec čez osnovno barvo
  `<pattern id="mat-les" width="26" height="7" patternUnits="userSpaceOnUse"><path d="M0,1.6 Q7,0.4 13,1.7 T26,1.6 M0,4.4 Q6,5.6 13,4.3 T26,4.4 M4,6.4 h9" fill="none" stroke="#5a3714" stroke-opacity="0.26" stroke-width="0.6"/><path d="M0,3 h26" stroke="#fff" stroke-opacity="0.16" stroke-width="0.7"/></pattern>`,
].join("");

export const CSS = `
:root{--mat-st-rob:#4f6577;--mat-st-crta:#5b7184;--mat-miza-0:#f4f6f8;--mat-miza-1:#d9dee3;--mat-miza-2:#b3bbc3;--mat-mer-0:#ffffff;--mat-mer-1:#f1f4f8;--mat-mer-2:#d5dce6;--mat-hl:0.85;--mat-st-stena:rgb(238 246 251 / 0.84)}
.dark{--mat-st-rob:#a9bfd0;--mat-st-crta:#a7bccc;--mat-miza-0:#77818c;--mat-miza-1:#555e68;--mat-miza-2:#353c44;--mat-mer-0:#3b4350;--mat-mer-1:#2a313c;--mat-mer-2:#1b2029;--mat-hl:0.5;--mat-st-stena:rgb(150 180 205 / 0.3)}
#mat-defs{position:absolute;width:0;height:0;overflow:hidden}
svg.demo-svg .lab-glass{fill:url(#mat-steklo) rgb(207 227 242 / 0.12);stroke:var(--mat-st-crta);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}
svg.demo-svg .lab-meter-body{fill:url(#mat-merilnik) var(--surface)}
svg.demo-svg .lab-wire{stroke-linecap:round;stroke-width:3}
svg.demo-svg .mat-zica-senca{fill:none;stroke:#000;stroke-opacity:0.16;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
svg.demo-svg .lab-tit-bench{stroke:var(--mat-st-crta);stroke-width:1}
svg.demo-svg .mat-ov{pointer-events:none;stroke:none;opacity:1;fill-opacity:1;animation:none}
svg.demo-svg .mat-tek{fill:url(#mat-tek) transparent}
svg.demo-svg .mat-gladina{fill:url(#mat-gladina) transparent}
svg.demo-svg .mat-kovina{fill:url(#mat-kovina) transparent}
svg.demo-svg .mat-naprava{fill:url(#mat-naprava) transparent}
svg.demo-svg .mat-les{fill:url(#mat-les) transparent}
svg.demo-svg .mat-senca{fill:url(#mat-senca) transparent;pointer-events:none}
svg.demo-svg .mat-senca-p{fill:#000;fill-opacity:0.09;stroke:none;pointer-events:none}
svg.demo-svg .mat-miza{fill:url(#mat-miza) var(--mat-miza-1);pointer-events:none}
svg.demo-svg .mat-miza-senca{fill:url(#mat-miza-senca) transparent;pointer-events:none}
svg.demo-svg .mat-steklo-telo{fill:url(#mat-steklo) rgb(207 227 242 / 0.12)}
svg.demo-svg .mat-st-g>*{pointer-events:none}
svg.demo-svg .mat-st-notri{fill:none;stroke:var(--mat-st-rob);stroke-opacity:0.6;stroke-linejoin:round}
svg.demo-svg .mat-st-stena{fill:none;stroke:var(--mat-st-stena);stroke-linejoin:round}
svg.demo-svg .mat-okno{fill:url(#mat-okno) #fff;opacity:var(--mat-hl)}
svg.demo-svg .mat-okno2{fill:#fff;opacity:0.13}
svg.demo-svg .mat-dno{fill:url(#mat-dno) transparent}
svg.demo-svg .mat-ustje{fill:rgb(255 255 255 / 0.2);stroke:var(--mat-st-crta);stroke-width:0.9;pointer-events:none}
svg.demo-svg .mat-kavstika{fill:url(#mat-sij) transparent;opacity:0.8;pointer-events:none}
svg.demo-svg .mat-gladina-el{fill:rgb(255 255 255 / 0.3);stroke:rgb(255 255 255 / 0.75);stroke-width:0.7;pointer-events:none}
svg.demo-svg .mat-valj-x{fill:url(#mat-valj-x) transparent}
svg.demo-svg .mat-valj-y{fill:url(#mat-valj-y) transparent}
svg.demo-svg .mat-zrna{fill:url(#mat-zrna) transparent}
svg.demo-svg :is(.lab-bubble,.lab-top-bubble,.lab-tit-air){fill:url(#mat-kaplja) rgb(255 255 255 / 0.6);stroke:none}
svg.demo-svg .lab-mark{stroke:var(--mat-st-rob);stroke-opacity:0.9}
svg.demo-svg .mat-oznaka{stroke:#fff;stroke-opacity:0.7;stroke-width:0.7;pointer-events:none}
svg.demo-svg .mat-mer-senca{fill:#000;fill-opacity:0.14;pointer-events:none}
.demo.lab{--mat-ozadje:color-mix(in srgb,var(--accent) 8%,var(--surface-2));--mat-stena:radial-gradient(110% 80% at 30% 0%,color-mix(in srgb,var(--accent) 4%,var(--surface-2)),var(--mat-ozadje) 75%,color-mix(in srgb,var(--text) 3%,var(--mat-ozadje)))}
.demo.lab .lab-tit-top>.demo-stage:has(svg.lab-bench,svg.lab-circuit){background:var(--mat-stena)!important;border-radius:12px;padding:8px!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--text) 7%,transparent)}
.demo.lab .lab-tit-top>.demo-stage:has(svg.lab-bench,svg.lab-circuit) .lab-lcd{background:color-mix(in srgb,var(--surface) 72%,transparent)}
.demo.lab .lab-tit-top>.demo-stage svg.demo-svg:is(.lab-bench,.lab-circuit) .lbl{stroke:var(--mat-ozadje)}
.demo.lab .lab-tit-top>.demo-stage svg :is(.lab-warn,.lab-ek-poptxt,.lab-gib-slow,.lab-mag-warn,.lab-mag-slow){fill:color-mix(in srgb,var(--danger) 78%,var(--text))}
svg.demo-svg .mat-zica{fill:none;stroke:#fff;stroke-opacity:0.32;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
.lab-lcd-screen{background-image:linear-gradient(112deg,transparent 52%,rgb(255 255 255 / 0.2) 53%,rgb(255 255 255 / 0.05) 68%,transparent 69%),linear-gradient(180deg,rgb(255 255 255 / 0.34),rgb(255 255 255 / 0) 42%,rgb(0 0 0 / 0.07));box-shadow:inset 0 1px 2px rgb(0 0 0 / 0.28),inset 0 0 0 1px rgb(0 0 0 / 0.08)}
.lab-lcd{box-shadow:0 1px 0 rgb(255 255 255 / 0.5) inset,0 1px 2px rgb(15 23 42 / 0.08)}
.lab-zoom{position:absolute;top:0;inset-inline-end:50px;z-index:1;display:none;place-items:center;width:44px;height:44px;min-height:44px;padding:0;border-radius:50%;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 90%,transparent);color:var(--muted);cursor:pointer}
.lab-zoom svg.i{width:20px;height:20px}
.lab-zoom:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.lab-zoom[aria-pressed="true"]{color:var(--accent);background:var(--accent-soft)}
@container labtit (max-width:799.98px){.lab-zoom{display:grid}}
.lab-povecano .lab-zoom{display:grid}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano{position:fixed!important;inset:0!important;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;border:0;border-radius:0;z-index:50;display:flex;flex-direction:column;align-items:center;gap:10px;overflow:auto;padding:10px 10px 16px!important;box-sizing:border-box;color:var(--text)}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano :is(svg.demo-svg,.lab-ek-risba){flex:none;width:max(100%,min(calc((100dvh - 150px) * var(--lab-ar,1.4)),300%))!important;max-width:none!important;max-height:none!important;height:auto}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-ek-risba>svg.demo-svg{width:100%!important}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-pin{display:none!important}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-zoom{position:fixed;top:10px;inset-inline-end:10px;z-index:2}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-meters{position:sticky;left:0;flex:none}
.dark .lab-lcd{box-shadow:0 1px 0 rgb(255 255 255 / 0.06) inset,0 1px 2px rgb(0 0 0 / 0.3)}
`;

// Razred → material. Vrstni red: prvi zadetek velja.
const VRSTE = [
  ["steklo", ["lab-glass"]],
  ["tek", ["lab-liq", "lab-ind-liq", "lab-tit-sol", "lab-top-water", "lab-top-tea", "lab-sil-tek", "lab-milk"]],
  ["miza", ["lab-tit-bench"]],
  ["zica", ["lab-wire"]],
  ["les", ["lab-sil-les", "lab-sil-ruler", "lab-stopper"]],
  ["zrna", ["lab-powder", "lab-ppt", "lab-top-salt", "lab-sil-kamen"]],
  ["oznaka", ["lab-mark"]],
  ["prozorno", ["lab-opt-block", "lab-opt-lens", "lab-top-ice"]],
  ["lom", ["lab-top-probe", "lab-top-rod"]],
  ["merilnik", ["lab-meter-body"]],
  ["naprava", ["lab-box", "lab-sil-balance", "lab-opt-laser", "lab-sil-meter", "lab-top-thermos", "lab-top-enamel", "lab-top-porc", "lab-batt", "lab-sil-foot"]],
  ["kovina", ["lab-tit-rod", "lab-tit-clamp", "lab-sil-rod", "lab-sil-stand", "lab-sil-mass", "lab-sil-aluminij", "lab-sil-jeklo", "lab-sil-medenina", "lab-sil-baker", "lab-top-plate", "lab-top-plate-top", "lab-opt-rail", "lab-opt-rider", "lab-plate", "lab-res", "lab-sil-plate", "lab-tit-electrode", "lab-top-handle"]],
];
const MAPA = new Map(VRSTE.flatMap(([m, list]) => list.map((c) => [c, m])));
const BREZ = /\blab-(puddle|tit-none)\b/; // luža in prazna cev ne dobita odseva
const LIKI = new Set(["rect", "path", "circle", "ellipse", "polygon"]);

// Material elementa po razredih (niz razredov) ali null.
export function material(cls) {
  if (!cls || cls.indexOf("lab-") < 0 || BREZ.test(cls)) return null;
  for (const c of cls.split(/\s+/)) {
    const m = MAPA.get(c);
    if (m) return m;
  }
  return null;
}

// Okvir poti iz atributa d (samo končne točke ukazov) in ali ima pot ravno dno (posoda stoji na podlagi).
export function okvirPoti(d) {
  const re = /([MLHVQACSTZmlhvqacstz])([^MLHVQACSTZmlhvqacstz]*)/g;
  const n = { M: 2, L: 2, H: 1, V: 1, Q: 4, A: 7, C: 6, S: 4, T: 2 };
  let x = 0, y = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, m;
  const vodoravne = [], poti = [];
  const tocka = () => ((x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y)));
  while ((m = re.exec(d))) {
    const C = m[1].toUpperCase(), rel = m[1] !== C, k = n[C];
    if (!k) {
      if (poti.length) poti[poti.length - 1].zaprta = true;
      continue;
    }
    const a = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    for (let i = 0; i + k <= a.length; i += k) {
      const px = x, py = y;
      if (C === "H") x = rel ? x + a[i] : a[i];
      else if (C === "V") y = rel ? y + a[i] : a[i];
      else (x = (rel ? x : 0) + a[i + k - 2]), (y = (rel ? y : 0) + a[i + k - 1]);
      tocka();
      if (C === "M" && i === 0) poti.push([]);
      poti[poti.length - 1]?.push(x, y);
      if ((C === "H" || C === "L") && Math.abs(y - py) < 0.01 && Math.abs(x - px) >= 8) vodoravne.push(y);
    }
  }
  if (x0 === Infinity) return null;
  // dve odprti podpoti (leva in desna stena cevi): telo cevi je mnogokotnik med njima
  const telo = poti.length === 2 && !poti[0].zaprta && !poti[1].zaprta ? [...poti[0], ...pari(poti[1]).reverse().flat()].join(" ") : null;
  // ustje: posoda je zgoraj odprta, če se obris začne in konča na isti višini pri vrhu (ali sta to vrhova obeh sten)
  let vrh = null;
  if (poti.length && !poti[0].zaprta) {
    const a = poti[0], b = poti.length === 2 ? poti[1] : a.slice(-2), xa = a[0], ya = a[1], xb = b[0], yb = b[1];
    if (Math.abs(ya - yb) < 1.5 && Math.abs(ya - y0) < 3 && Math.abs(xb - xa) >= 3) vrh = [Math.min(xa, xb), Math.max(xa, xb), (ya + yb) / 2];
  }
  return { x0, x1, y0, y1, telo, vrh, ravnoDno: vodoravne.some((v) => v >= y1 - 7) };
}

const pari = (a) => a.reduce((r, v, i) => (i % 2 ? r[r.length - 1].push(v) : r.push([v]), r), []);

export const LOM_VODA = 1.33; // lomni količnik vode

let stevec = 0, cakajo = [], naroceno = false;

// Skriti <svg> z <defs> in slog: enkrat na stran (ponovno, če je stran medtem zamenjala <body>).
export function vstavi(doc = document) {
  if (!doc.getElementById("mat-slog")) {
    const st = doc.createElement("style");
    st.id = "mat-slog";
    st.textContent = CSS;
    doc.head.append(st);
  }
  if (!doc.getElementById("mat-defs") && doc.body) doc.body.insertAdjacentHTML("beforeend", `<svg id="mat-defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>${DEFS}</defs></svg>`);
}

// kit.js → s(): element z razredom materiala gre v vrsto; okras nastane po koncu sinhronega risanja.
export function okrasi(el, cls) {
  const m = material(cls);
  if (!m) return;
  cakajo.push([el, m]);
  if (naroceno) return;
  naroceno = true;
  queueMicrotask(() => {
    const vrsta = cakajo;
    cakajo = [];
    naroceno = false;
    vstavi();
    for (const [e, mat] of vrsta) if (e.parentNode) NAREDI[mat](e);
  });
}

const NS = "http://www.w3.org/2000/svg";
const nov = (tag, attrs) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  e.setAttribute("aria-hidden", "true");
  return e;
};
// Kopija lika brez barve in razredov: ista oblika, drug preliv.
function kopija(el, cls) {
  const c = el.cloneNode(false);
  for (const a of ["id", "fill", "stroke", "opacity", "fill-opacity", "tabindex", "role", "aria-label"]) c.removeAttribute(a);
  if (c.style.length) for (const p of ["fill", "stroke", "opacity", "fill-opacity"]) c.style.removeProperty(p);
  c.setAttribute("class", cls);
  c.setAttribute("aria-hidden", "true");
  return c;
}
const st = (el, a) => +el.getAttribute(a) || 0;
const prelij = (cls) => (el) => LIKI.has(el.localName) && el.after(kopija(el, `mat-ov ${cls}`));

// Mehka senca pod predmetom (elipsa z radialnim prelivom). Tudi za ročno rabo v poskusih.
export function senca(pred, cx, y, rx, ry = Math.max(2, Math.min(4.5, rx * 0.13))) {
  const e = nov("ellipse", { cx, cy: y, rx, ry, class: "mat-senca" });
  pred.before(e);
  return e;
}

const NAREDI = {
  // Steklo: preliv in obris da CSS; tukaj senca pod posodo z ravnim dnom in notranji rob stene (debelina stekla).
  // Steklo: obris in preliv da CSS. Tukaj: senca in svetla lisa (kavstika) na mizi, debelina stene (svetel pas z
  // notranjim robom), debelo dno, odsev okna in elipsa ustja.
  steklo(el) {
    if (el.localName !== "path") return;
    const b = okvirPoti(el.getAttribute("d") || "");
    if (!b || b.x1 - b.x0 < 3) return;
    const tr = el.getAttribute("transform"), w = b.x1 - b.x0, hh = b.y1 - b.y0, vOknu = !!el.closest("[clip-path]");
    if (b.ravnoDno && !tr) {
      senca(el, (b.x0 + b.x1) / 2, b.y1 + 0.8, w / 2 + 4);
      if (w >= 18) el.before(nov("ellipse", { cx: b.x1 + w * 0.16, cy: b.y1 + 1.2, rx: w * 0.2, ry: 1.3, class: "mat-kavstika" }));
    }
    // cev iz dveh sten nima ploskve: telo dobi svoj lik
    let oblika = el;
    if (b.telo) {
      oblika = nov("polygon", { points: b.telo, class: "mat-ov mat-steklo-telo" });
      if (tr) oblika.setAttribute("transform", tr);
      el.before(oblika);
    }
    if (b.vrh && !vOknu && !tr && b.vrh[1] - b.vrh[0] >= 6) el.after(nov("ellipse", { cx: (b.vrh[0] + b.vrh[1]) / 2, cy: b.vrh[2], rx: (b.vrh[1] - b.vrh[0]) / 2, ry: Math.max(0.8, Math.min(2.4, (b.vrh[1] - b.vrh[0]) * 0.07)), class: "mat-ustje" }));
    if (w < 7) return; // tanka cev (kapilara, konica): samo obris in preliv
    const d = w >= 26 ? 2.6 : w >= 14 ? 1.8 : 1.1; // debelina stene v enotah risbe
    const id = `mat-c${++stevec}`;
    const g = nov("g", { "clip-path": `url(#${id})`, class: "mat-st-g" });
    if (tr) g.setAttribute("transform", tr);
    const cp = nov("clipPath", { id });
    const o = kopija(oblika, "");
    o.removeAttribute("transform");
    cp.append(o);
    const rob = kopija(el, "mat-st-notri"), stena = kopija(el, "mat-st-stena");
    rob.removeAttribute("transform");
    stena.removeAttribute("transform");
    rob.setAttribute("stroke-width", 2 * d + 1.3);
    stena.setAttribute("stroke-width", 2 * d);
    g.append(cp, rob, stena);
    if (b.ravnoDno && w >= 14) g.append(nov("rect", { x: b.x0, y: b.y1 - d * 1.9, width: w, height: d * 1.9, class: "mat-dno" }));
    if (w >= 9 && !vOknu) {
      const ow = Math.max(1.5, w * 0.07), ox = b.x0 + Math.max(d + 1.4, w * 0.15), oy = b.y0 + hh * 0.12;
      g.append(nov("rect", { x: ox, y: oy, width: ow, height: hh * 0.55, rx: ow / 2, class: "mat-okno" }));
      if (w >= 18) g.append(nov("rect", { x: ox + ow * 1.6, y: oy + hh * 0.03, width: ow * 0.4, height: hh * 0.42, rx: ow * 0.2, class: "mat-okno" }), nov("rect", { x: b.x1 - d - 1.4 - w * 0.12, y: b.y0 + hh * 0.2, width: w * 0.1, height: hh * 0.6, rx: w * 0.05, class: "mat-okno2" }));
    }
    el.after(g);
  },
  tek(el) {
    if (!LIKI.has(el.localName)) return;
    const a = kopija(el, "mat-ov mat-tek"), b = kopija(el, "mat-ov mat-gladina");
    el.after(a, b);
    // gladina v ravni posodi, videna rahlo od zgoraj: svetla elipsa (spredaj je rob meniskusa)
    const w = st(el, "width");
    if (el.localName !== "rect" || w < 10 || st(el, "height") < 3 || el.hasAttribute("transform")) return;
    b.after(nov("ellipse", { cx: st(el, "x") + w / 2, cy: st(el, "y") + 0.3, rx: w / 2 - 0.6, ry: Math.max(0.9, Math.min(2.4, w * 0.045)), class: "mat-gladina-el" }));
  },
  // Kovina: valj z ostrimi odsevi (pokončen ali ležeč pravokotnik), sicer poševen lesk. Lesk upornika gre čez barvne obroče.
  kovina(el) {
    if (!LIKI.has(el.localName)) return;
    const pok = el.localName === "rect" ? st(el, "height") >= st(el, "width") : null;
    const c = kopija(el, `mat-ov ${pok == null ? "mat-kovina" : pok ? "mat-valj-x" : "mat-valj-y"}`);
    if (el.classList.contains("lab-res")) el.parentNode.append(c);
    else el.after(c);
  },
  zrna: prelij("mat-zrna"),
  prozorno: prelij("mat-steklo-telo"), // akrilni blok, leča, led: odsev in temnejši rob kot pri steklu
  // Oznaka na steklu (gradacija): temna črta in svetel rob pod njo, kot vtisnjena v steklo.
  oznaka(el) {
    if (el.localName !== "line") return;
    const c = kopija(el, "mat-oznaka");
    c.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(0,0.75)`.trim());
    el.after(c);
  },
  // Lom svetlobe: palica ali sonda v vodi je skozi valjasto čašo videti odmaknjena od osi čaše in debelejša
  // (voda v čaši deluje kot valjasta leča, povečava ≈ lomni količnik vode 1,33). Del pod gladino se nariše posebej.
  lom(el) {
    if (el.localName !== "line") return;
    let xa = st(el, "x1"), ya = st(el, "y1"), xb = st(el, "x2"), yb = st(el, "y2");
    if (ya > yb) [xa, ya, xb, yb] = [xb, yb, xa, ya];
    for (const r of el.ownerSVGElement?.querySelectorAll("rect.lab-top-water, rect.lab-liq, rect.lab-sil-tek") || []) {
      const rx = st(r, "x"), ry = st(r, "y"), rw = st(r, "width");
      if (xb < rx || xb > rx + rw || ry <= ya + 1 || ry >= yb - 1 || yb > ry + st(r, "height") + 1) continue;
      const xs = xa + ((xb - xa) * (ry - ya)) / (yb - ya), xc = rx + rw / 2;
      const lomX = (x) => Math.max(rx + 1.5, Math.min(rx + rw - 1.5, xc + (x - xc) * LOM_VODA));
      el.setAttribute("x1", xa), el.setAttribute("y1", ya), el.setAttribute("x2", xs), el.setAttribute("y2", ry);
      const pod = nov("line", { x1: lomX(xs), y1: ry, x2: lomX(xb), y2: yb, class: `${el.getAttribute("class")} mat-lom` });
      pod.style.strokeWidth = `${(parseFloat(getComputedStyle(el).strokeWidth) || 3) * LOM_VODA}px`;
      el.after(pod);
      return;
    }
  },
  merilnik(el) {
    if (el.localName !== "circle") return;
    el.before(nov("circle", { cx: st(el, "cx") + 0.8, cy: st(el, "cy") + 2.2, r: st(el, "r") + 1.2, class: "mat-mer-senca" }));
  },
  les: prelij("mat-les"),
  // Naprava: mehka senca pod ohišjem (dva zamaknjena lika) in svetloba od zgoraj.
  naprava(el) {
    if (!LIKI.has(el.localName)) return;
    if (el.localName === "rect") {
      const x = st(el, "x"), y = st(el, "y"), w = st(el, "width"), hh = st(el, "height"), rx = st(el, "rx") + 1;
      const s1 = nov("rect", { x: x - 1.2, y: y + 2.6, width: w + 2.4, height: hh, rx: rx + 1, class: "mat-senca-p" });
      const s2 = nov("rect", { x: x + 0.3, y: y + 1.3, width: w - 0.6, height: hh, rx, class: "mat-senca-p" });
      for (const s of [s1, s2]) if (el.hasAttribute("transform")) s.setAttribute("transform", el.getAttribute("transform"));
      el.before(s1, s2);
    }
    el.after(kopija(el, "mat-ov mat-naprava"));
  },
  // Rob mize: črta postane delovna plošča (svetel zgornji rob, čelo plošče, senca pod njo).
  miza(el) {
    if (el.localName !== "line") return;
    const x1 = Math.min(st(el, "x1"), st(el, "x2")), x2 = Math.max(st(el, "x1"), st(el, "x2")), y = st(el, "y1");
    if (Math.abs(st(el, "y2") - y) > 0.01 || x2 - x1 < 20) return;
    el.before(nov("rect", { x: x1, y, width: x2 - x1, height: 4.6, rx: 1.2, class: "mat-miza" }), nov("rect", { x: x1 + 2, y: y + 4.6, width: x2 - x1 - 4, height: 7, class: "mat-miza-senca" }));
  },
  zica(el) {
    if (el.localName !== "path" && el.localName !== "line" && el.localName !== "polyline") return;
    const s = kopija(el, "mat-zica-senca");
    s.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(0.8,1.7)`.trim());
    el.before(s);
    const c = kopija(el, "mat-zica");
    c.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(-0.6,-0.6)`.trim());
    el.after(c);
  },
};
