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
  // plamen: modro jedro ob dnu, svetlo rumena sredina, prosojen oranžen zunanji stožec
  rad("plamen", [stop(0, "#6fb7ff", 0.95), stop(0.2, "#bfe1ff", 0.75), stop(0.38, "#fff8cf", 0.95), stop(0.68, "#ffcf55", 0.8), stop(1, "#ff8a1f", 0.28)], 'cx="0.5" cy="0.92" r="0.95"'),
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
svg.demo-svg:not(.lab-circuit) .lab-meter-body{fill:url(#mat-merilnik) var(--surface)}
svg.demo-svg:not(.lab-circuit) .lab-wire{stroke-linecap:round;stroke-width:3}
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
svg.demo-svg .mat-pol{opacity:0.55}
svg.demo-svg .mat-valj-x{fill:url(#mat-valj-x) transparent}
svg.demo-svg .mat-valj-y{fill:url(#mat-valj-y) transparent}
svg.demo-svg :is(.lab-flame,.lab-ek-flame){fill:url(#mat-plamen) #ff9b2f;stroke:#ffb347;stroke-opacity:0.35;stroke-width:0.8}
svg.demo-svg .mat-plamen-sij{fill:url(#mat-sij) transparent;opacity:0.45;pointer-events:none}
svg.demo-svg :is(.lab-tit-rod,.lab-sil-rod,.lab-sil-stand){fill:#77818d}
svg.demo-svg .lab-tit-clamp{fill:#4c545e}
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
.demo.lab .lab-tit-top>.demo-stage.lab-povecano>.lab-slika{flex:none;width:min(100%,calc((100dvh - 150px) * var(--lab-ar,1.4)))!important;max-width:none!important;max-height:none!important;height:auto}
@media (orientation:portrait){.demo.lab .lab-tit-top>.demo-stage.lab-povecano.lab-lezi>.lab-slika text:not([transform]){transform-box:fill-box;transform-origin:center;transform:rotate(-90deg)}}
@media (orientation:portrait){.demo.lab .lab-tit-top>.demo-stage.lab-povecano.lab-lezi>.lab-slika{--zw:min(calc(100dvh - 170px),calc((100vw - 20px) * var(--lab-ar,1.4)));width:var(--zw)!important;transform:rotate(90deg);margin:calc((var(--zw) - var(--zw) / var(--lab-ar,1.4)) / 2) calc((var(--zw) / var(--lab-ar,1.4) - var(--zw)) / 2)}}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-ek-risba>svg.demo-svg{width:100%!important}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-pin{display:none!important}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-zoom{position:fixed;top:10px;inset-inline-end:10px;z-index:2}
.demo.lab .lab-tit-top>.demo-stage.lab-povecano .lab-meters{position:sticky;left:0;flex:none}
.dark .lab-lcd{box-shadow:0 1px 0 rgb(255 255 255 / 0.06) inset,0 1px 2px rgb(0 0 0 / 0.3)}
`;

// Razred → material. Vrstni red: prvi zadetek velja.
const VRSTE = [
  ["steklo", ["lab-glass"]],
  ["stekloP", ["lab-ek-glass"]],
  ["tek", ["lab-liq", "lab-ind-liq", "lab-tit-sol", "lab-top-water", "lab-top-tea", "lab-sil-tek", "lab-milk", "lab-ind-bath"]],
  ["gladina", ["lab-ek-liq"]],
  ["miza", ["lab-tit-bench"]],
  ["zica", ["lab-wire"]],
  ["kabel", ["lab-top-cable", "lab-gib-kabel", "lab-mag-kabel"]],
  ["les", ["lab-sil-les", "lab-sil-ruler", "lab-stopper", "lab-ind-rack", "lab-splint", "lab-ek-splint"]],
  ["zrna", ["lab-powder", "lab-ppt", "lab-top-salt", "lab-sil-kamen", "lab-rk-salt"]],
  ["oznaka", ["lab-mark"]],
  ["prozorno", ["lab-opt-block", "lab-opt-lens", "lab-top-ice"]],
  ["lom", ["lab-top-probe", "lab-top-rod", "lab-top-coil"]],
  ["plamen", ["lab-flame", "lab-ek-flame"]],
  ["sijaj", ["lab-mag-magnet", "lab-mag-npol", "lab-gib-telo", "lab-gib-kvader", "lab-mag-pcb", "lab-mag-klada"]],
  ["merilnik", ["lab-meter-body"]],
  ["naprava", ["lab-box", "lab-sil-balance", "lab-opt-laser", "lab-sil-meter", "lab-top-thermos", "lab-top-enamel", "lab-top-porc", "lab-batt", "lab-sil-foot", "lab-gib-ohisje", "lab-gib-voz", "lab-mag-kompas-ohisje"]],
  ["kovina", ["lab-tit-rod", "lab-tit-clamp", "lab-sil-rod", "lab-sil-stand", "lab-sil-mass", "lab-sil-aluminij", "lab-sil-jeklo", "lab-sil-medenina", "lab-sil-baker", "lab-top-plate", "lab-top-plate-top", "lab-opt-rail", "lab-opt-rider", "lab-plate", "lab-res", "lab-sil-plate", "lab-tit-electrode", "lab-top-handle", "lab-ek-sonda", "lab-mag-nosilec", "lab-mag-jedro", "lab-mag-lamela", "lab-gib-alu", "lab-gib-drog", "lab-gib-utez", "lab-gib-palica", "lab-gib-os"]],
];
const MAPA = new Map(VRSTE.flatMap(([m, list]) => list.map((c) => [c, m])));
const BREZ = /\blab-(puddle|tit-none)\b/; // luža in prazna cev ne dobita odseva
const LIKI = new Set(["rect", "path", "circle", "ellipse", "polygon"]);
// Električna shema (svg.lab-circuit) ostane čista shema: brez senc, leska in debelih vodnikov (j, 10. 11. 2026: ne mešanica).
const NE_V_SHEMI = new Set(["naprava", "zica", "kabel", "merilnik", "kovina"]);
// Lahki način (počasna naprava): odpadejo okrasi z največ vozlišči.
const NE_LAHKO = new Set(["oznaka", "zica", "kabel", "merilnik", "zrna", "gladina", "stekloP", "sijaj", "plamen"]);
// Novejši poskusi (gibanje, magnetizem, elektrokemija, reakcije) barvajo like s svojimi prelivi brez razreda:
// material se prepozna po imenu preliva v fill="url(#s12-jeklo)".
const PO_PRELIVU = [
  [/-(alu|jeklov?|zelezov?|nikelj|palica|sonda|med|bakerv?|lamelev?|m-[A-Za-z]+)\)$/, "lesk"],
  [/-les\)$/, "les"],
  [/-(ohisje|modro|rumena|plosca|crno|voz|tuljavnica|rdeca|zelena|tiskanina)\)$/, "ohisje"],
];

// Material elementa po razredih (niz razredov) ali null.
export function material(cls, fill) {
  if (cls && cls.indexOf("lab-") >= 0) {
    if (BREZ.test(cls)) return null;
    for (const c of cls.split(/\s+/)) {
      const m = MAPA.get(c);
      if (m) return m;
    }
  }
  if (typeof fill === "string" && fill.charCodeAt(0) === 117 && fill.startsWith("url(#")) for (const [re, m] of PO_PRELIVU) if (re.test(fill)) return m;
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
// Prave debeline stekla [mm]: cevi in epruvete (zunanji premer do 22 mm) ≈ 1,0–1,2; čaše in bučke ≈ 1,6–2; dno ≈ 2,5.
export const STEKLO_MM = { cev: 1.1, posoda: 1.8, dno: 2.5, mejaCevi: 22 };
const med = (v, a, b) => Math.max(a, Math.min(b, v));

// Debelina stene in dna v enotah risbe. enotNaMm = merilo risbe (0, če ni znano); w, h = zunanja širina in višina posode.
// Najmanjša vidna debelina je le vizualna rezerva in je omejena z deležem širine, da stena ne prekrije vsebine.
export function debelinaStekla(w, h, enotNaMm) {
  const cev = enotNaMm ? w / enotNaMm <= STEKLO_MM.mejaCevi : w < 16;
  const prava = enotNaMm ? (cev ? STEKLO_MM.cev : STEKLO_MM.posoda) * enotNaMm : w * 0.04;
  const stena = med(prava, 0.6, Math.max(0.6, w * 0.09));
  const dno = med(enotNaMm ? STEKLO_MM.dno * enotNaMm : stena * 1.4, stena, Math.max(stena, h * 0.06));
  return { stena, dno };
}

let stevec = 0, cakajo = [], naroceno = false, izris = 0, lahko = false, pocasni = 0;
// Na počasni napravi (okras traja predolgo) se preklopi v lahki način; test in razhroščevanje ga lahko bereta.
export const lahkiNacin = () => lahko;

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

const ZAOKROZI = new Set(["x", "y", "width", "height", "x1", "y1", "x2", "y2", "cx", "cy"]);
const PODPIS = ["class", "d", "points", "x", "y", "width", "height", "rx", "x1", "y1", "x2", "y2", "cx", "cy", "r", "ry", "transform"];

// kit.js → s(): element z razredom materiala gre v vrsto; okras nastane po koncu sinhronega risanja.
// Poskusi rišejo vse znova večkrat na sekundo, zato se okras hrani po obliki elementa (svg._mat): ob naslednjem
// risanju se ista vozlišča le znova vstavijo, nova nastanejo samo za spremenjene like.
export function okrasi(el, cls, fill) {
  const m = material(cls, fill);
  if (!m) return;
  cakajo.push([el, m]);
  if (naroceno) return;
  naroceno = true;
  queueMicrotask(() => {
    const vrsta = cakajo, t0 = performance.now();
    cakajo = [];
    naroceno = false;
    izris++;
    vstavi();
    const ok = new Map(); // svg → okolje tega risanja (merila, tekočine)
    let novih = 0;
    for (const [e, mat] of vrsta) {
      const svg = e.ownerSVGElement;
      if (!e.parentNode || !svg) continue;
      let o = ok.get(svg);
      if (!o) ok.set(svg, (o = { svg, shema: svg.classList.contains("lab-circuit"), mm: new Map(), tek: null, sirina: svg.viewBox?.baseVal?.width || 400 }));
      if ((o.shema && NE_V_SHEMI.has(mat)) || (lahko && NE_LAHKO.has(mat))) continue;
      const dod = PRED[mat] ? PRED[mat](e, o) : "";
      if (dod === null) continue; // ta lik okrasa ne potrebuje (npr. sonda, ki ni v tekočini)
      let k = `${mat}|${e.localName}|${lahko ? 1 : 0}|${dod}`;
      for (const a of PODPIS) {
        const v = e.getAttribute(a);
        // mere na desetinko enote: gladina, ki se premakne za tisočinko (izhlapevanje), ne zahteva novega okrasa
        if (v != null) k += `|${a}=${ZAOKROZI.has(a) && v.length > 5 ? (+v).toFixed(1) : v}`;
      }
      const shr = (svg._mat ||= new Map());
      let seznam = shr.get(k);
      if (!seznam) shr.set(k, (seznam = []));
      let kos = seznam.find((q) => q.izris !== izris && !q.prvi?.isConnected);
      if (!kos) {
        kos = { pred: [], po: [], konec: [], atr: null, ...(NAREDI[mat](e, o, dod) || {}) };
        kos.prvi = kos.pred[0] || kos.po[0] || kos.konec[0];
        seznam.push(kos);
        novih++;
      }
      kos.izris = izris;
      if (kos.pred.length) e.before(...kos.pred);
      if (kos.po.length) e.after(...kos.po);
      if (kos.konec.length) e.parentNode.append(...kos.konec);
      if (kos.atr) for (const a in kos.atr) e.setAttribute(a, kos.atr[a]);
    }
    // shramba ne raste brez meje (gladina, ki se premika, vsakič da nov podpis)
    for (const o of ok.values()) {
      const shr = o.svg._mat;
      if (shr && shr.size > 260) for (const [k, s] of shr) if (s.every((q) => q.izris < izris - 2)) shr.delete(k);
    }
    // varovalo: če okras večkrat zapored traja predolgo, velja lahki način do konca seje
    if (novih > 8 && performance.now() - t0 > 14) {
      if (++pocasni >= 4) lahko = true;
    } else if (pocasni > 0 && novih > 8) pocasni--;
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
  for (const a of ["id", "fill", "stroke", "opacity", "fill-opacity", "tabindex", "role", "aria-label", "clip-path"]) c.removeAttribute(a);
  if (c.style.length) for (const p of ["fill", "stroke", "opacity", "fill-opacity"]) c.style.removeProperty(p);
  c.setAttribute("class", cls);
  c.setAttribute("aria-hidden", "true");
  return c;
}
const st = (el, a) => +el.getAttribute(a) || 0;
const prelij = (cls) => (el) => (LIKI.has(el.localName) ? { po: [kopija(el, `mat-ov ${cls}`)] } : null);

// Okvir lika [x0, y0, x1, y1] iz atributov (brez razporeditve strani).
function okvir(el) {
  const n = el.localName;
  if (n === "rect") return [st(el, "x"), st(el, "y"), st(el, "x") + st(el, "width"), st(el, "y") + st(el, "height")];
  if (n === "line") return [Math.min(st(el, "x1"), st(el, "x2")), Math.min(st(el, "y1"), st(el, "y2")), Math.max(st(el, "x1"), st(el, "x2")), Math.max(st(el, "y1"), st(el, "y2"))];
  if (n === "circle" || n === "ellipse") {
    const rx = st(el, n === "circle" ? "r" : "rx"), ry = st(el, n === "circle" ? "r" : "ry");
    return [st(el, "cx") - rx, st(el, "cy") - ry, st(el, "cx") + rx, st(el, "cy") + ry];
  }
  const b = n === "path" ? okvirPoti(el.getAttribute("d") || "") : null;
  return b ? [b.x0, b.y0, b.x1, b.y1] : null;
}

// Merilo risbe [enot na mm] iz merilne črte (.lab-scale) in njenega napisa (»2 cm«) v isti skupini ali višje; 0, če ga ni.
function enotNaMm(el, o) {
  for (let p = el.parentNode; p && p.nodeType === 1; p = p.parentNode) {
    let v = o.mm.get(p);
    if (v === undefined) {
      v = 0;
      for (const c of p.children) {
        if (!c.classList.contains("lab-scale")) continue;
        const b = okvir(c), m = /(\d+(?:[.,]\d+)?)\s*(cm|mm)(?![a-z])/.exec(`${c.nextElementSibling?.textContent || ""} ${c.previousElementSibling?.textContent || ""}`);
        if (b && m && b[2] - b[0] > 2) v = (b[2] - b[0]) / (parseFloat(m[1].replace(",", ".")) * (m[2] === "cm" ? 10 : 1));
        if (v) break;
      }
      o.mm.set(p, v);
    }
    if (v || p === o.svg) return v;
  }
  return 0;
}

// Mehka senca pod predmetom (elipsa z radialnim prelivom).
const senca = (cx, y, rx, ry = med(rx * 0.13, 2, 4.5)) => nov("ellipse", { cx, cy: y, rx, ry, class: "mat-senca" });

// Odsevi okna na posodi. Vir svetlobe je zgoraj levo: odsev je na levi strani, pri posodah bolj desno na risbi malo
// bolj proti sredini in krajši; oblika sledi posodi (dolg ozek trak na cevi, okno s križem na široki čaši, poševen
// trak ob steni stožčaste bučke).
function odsevi(b, w, hh, d, lega) {
  const out = [], ox = b.x0 + d + 1 + w * (0.07 + 0.09 * lega), ow = Math.max(1.2, w * 0.065);
  const stozec = b.vrh && b.vrh[1] - b.vrh[0] < w * 0.62;
  if (stozec) {
    const xl = (t) => b.vrh[0] + (b.x0 - b.vrh[0]) * med((t - 0.3) / 0.65, 0, 1) + d + 1.6;
    const ya = b.y0 + hh * 0.44, yb = b.y0 + hh * (0.84 - 0.08 * lega);
    out.push(nov("polygon", { points: `${xl(0.44)},${ya} ${xl(0.44) + ow},${ya} ${xl(0.84) + ow * 1.9},${yb} ${xl(0.84)},${yb}`, class: "mat-okno" }));
    out.push(nov("rect", { x: (b.vrh[0] + b.vrh[1]) / 2 - (b.vrh[1] - b.vrh[0]) * 0.28, y: b.y0 + hh * 0.05, width: Math.max(1, (b.vrh[1] - b.vrh[0]) * 0.14), height: hh * 0.2, rx: 0.6, class: "mat-okno" }));
  } else if (hh > w * 3.2) {
    out.push(nov("rect", { x: ox, y: b.y0 + hh * (0.06 + 0.05 * lega), width: Math.max(1, ow * 0.8), height: hh * (0.62 - 0.14 * lega), rx: ow * 0.4, class: "mat-okno" }));
  } else {
    // okno s križem: dve polji, med njima letvica
    const oh = Math.min(hh * (0.42 - 0.1 * lega), w * 0.55), oy = b.y0 + hh * 0.14, sw = ow * 1.5;
    out.push(nov("rect", { x: ox, y: oy, width: sw, height: oh * 0.56, rx: 0.8, class: "mat-okno" }), nov("rect", { x: ox, y: oy + oh * 0.62, width: sw, height: oh * 0.38, rx: 0.8, class: "mat-okno" }));
    if (w >= 26) out.push(nov("rect", { x: b.x1 - d - 1.2 - w * 0.09, y: b.y0 + hh * (0.3 + 0.1 * lega), width: w * 0.055, height: hh * 0.42, rx: w * 0.03, class: "mat-okno2" }));
  }
  return out;
}

// Pred gradnjo: dodatek k podpisu (kar okras določa poleg oblike lika) ali null, če okrasa ni.
const PRED = {
  steklo: (el, o) => `${enotNaMm(el, o).toFixed(3)}|${el.closest("[clip-path]") ? 1 : 0}`,
  // Lom: tekočina, v katero sega lik (pravokotnik vode z gladino med vrhom in dnom lika).
  lom(el, o) {
    const b = okvir(el);
    if (!b) return null;
    o.tek ||= [...o.svg.querySelectorAll("rect.lab-top-water, rect.lab-liq, rect.lab-sil-tek")].filter((r) => !r.classList.contains("mat-ov")).map(okvir);
    const r = o.tek.find((r) => b[0] >= r[0] - 1 && b[2] <= r[2] + 1 && b[3] > r[1] + 1 && b[1] < r[3] - 1);
    return r ? r.map((v) => Math.round(v * 2) / 2).join(",") : null;
  },
};

const NAREDI = {
  // Steklo: obris in preliv da CSS. Tukaj: senca in svetla lisa (kavstika) na mizi, debelina stene po merilu risbe
  // (svetel pas z notranjim robom), debelejše dno, odsevi okna in elipsa ustja.
  steklo(el, o, dod) {
    if (el.localName !== "path") return null;
    const b = okvirPoti(el.getAttribute("d") || "");
    if (!b || b.x1 - b.x0 < 3) return null;
    const [mm, okno] = dod.split("|"), vOknu = okno === "1";
    const tr = el.getAttribute("transform"), w = b.x1 - b.x0, hh = b.y1 - b.y0, pred = [], po = [];
    if (b.ravnoDno && !tr) {
      pred.push(senca((b.x0 + b.x1) / 2, b.y1 + 0.8, w / 2 + 4));
      if (w >= 18) pred.push(nov("ellipse", { cx: b.x1 + w * 0.16, cy: b.y1 + 1.2, rx: w * 0.2, ry: 1.3, class: "mat-kavstika" }));
    }
    // cev iz dveh sten nima ploskve: telo dobi svoj lik
    let oblika = el;
    if (b.telo) {
      oblika = nov("polygon", { points: b.telo, class: "mat-ov mat-steklo-telo" });
      if (tr) oblika.setAttribute("transform", tr);
      pred.push(oblika);
    }
    // V povečavi (okno z izrezom) riše poskus sam notranji rob cevi in meniskus: stena ne sme prekriti vsebine.
    if (lahko || vOknu || w < 5) return { pred, po };
    const { stena: d, dno } = debelinaStekla(w, hh, +mm);
    const id = `mat-c${++stevec}`;
    const g = nov("g", { "clip-path": `url(#${id})`, class: "mat-st-g" });
    if (tr) g.setAttribute("transform", tr);
    const cp = nov("clipPath", { id });
    const obl = kopija(oblika, "");
    obl.removeAttribute("transform");
    cp.append(obl);
    const rob = kopija(el, "mat-st-notri"), stena = kopija(el, "mat-st-stena");
    rob.removeAttribute("transform");
    stena.removeAttribute("transform");
    rob.setAttribute("stroke-width", 2 * d + 0.9);
    stena.setAttribute("stroke-width", 2 * d);
    g.append(cp, rob, stena);
    if (b.ravnoDno && w >= 14) g.append(nov("rect", { x: b.x0, y: b.y1 - dno, width: w, height: dno, class: "mat-dno" }));
    if (w >= 8) g.append(...odsevi(b, w, hh, d, med((b.x0 + w / 2) / o.sirina, 0, 1)));
    po.push(g);
    if (b.vrh && !tr && b.vrh[1] - b.vrh[0] >= 6) po.push(nov("ellipse", { cx: (b.vrh[0] + b.vrh[1]) / 2, cy: b.vrh[2], rx: (b.vrh[1] - b.vrh[0]) / 2, ry: med((b.vrh[1] - b.vrh[0]) * 0.07, 0.8, 2.4), class: "mat-ustje" }));
    return { pred, po };
  },
  // Steklo, ki ga poskus riše kot pravokotnik s svojim prelivom (elektrokemija, reakcije): odsevi okna.
  stekloP(el, o) {
    if (el.localName !== "rect") return null;
    const x = st(el, "x"), y = st(el, "y"), w = st(el, "width"), hh = st(el, "height");
    if (w < 8 || hh < 12) return null;
    const g = nov("g", { class: "mat-st-g" });
    if (el.hasAttribute("transform")) g.setAttribute("transform", el.getAttribute("transform"));
    g.append(...odsevi({ x0: x, x1: x + w, y0: y, y1: y + hh, vrh: null }, w, hh, 0.8, med((x + w / 2) / o.sirina, 0, 1)));
    return { po: [g] };
  },
  tek(el) {
    if (!LIKI.has(el.localName)) return null;
    const po = [kopija(el, "mat-ov mat-tek"), kopija(el, "mat-ov mat-gladina")];
    // gladina v ravni posodi, videna rahlo od zgoraj: svetla elipsa (spredaj je rob meniskusa)
    const w = st(el, "width");
    if (el.localName === "rect" && w >= 10 && st(el, "height") >= 3 && !el.hasAttribute("transform")) po.push(nov("ellipse", { cx: st(el, "x") + w / 2, cy: st(el, "y") + 0.3, rx: w / 2 - 0.6, ry: med(w * 0.045, 0.9, 2.4), class: "mat-gladina-el" }));
    return { po };
  },
  gladina: prelij("mat-gladina"),
  // Kovina: valj z ostrimi odsevi (pokončen ali ležeč pravokotnik), sicer poševen lesk.
  kovina(el) {
    if (!LIKI.has(el.localName)) return null;
    const pok = el.localName === "rect" ? st(el, "height") >= st(el, "width") : null;
    return { po: [kopija(el, `mat-ov ${pok == null ? "mat-kovina" : pok ? "mat-valj-x" : "mat-valj-y"}`)] };
  },
  zrna: prelij("mat-zrna"),
  prozorno: prelij("mat-steklo-telo"), // akrilni blok, leča, led: odsev in temnejši rob kot pri steklu
  // Les (stojalo za epruvete, ravnilo, zamašek, trska): letnice; ležeča deska dobi še senco pod sabo.
  les(el) {
    if (!LIKI.has(el.localName)) return null;
    const po = [kopija(el, "mat-ov mat-les"), kopija(el, "mat-ov mat-naprava")];
    if (el.localName === "rect" && st(el, "width") > st(el, "height") * 3) return { po, pred: [nov("rect", { x: st(el, "x") + 1.5, y: st(el, "y") + st(el, "height"), width: st(el, "width") - 3, height: 3.2, class: "mat-miza-senca" })] };
    return { po };
  },
  // Oznaka na steklu (gradacija): temna črta in svetel rob pod njo, kot vtisnjena v steklo.
  oznaka(el) {
    if (el.localName !== "line") return null;
    const c = kopija(el, "mat-oznaka");
    c.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(0,0.75)`.trim());
    return { po: [c] };
  },
  // Lom svetlobe: del sonde, palčke ali grelca pod gladino je skozi valjasto čašo z vodo videti povečan v širino
  // (voda v čaši je valjasta leča, povečava ≈ lomni količnik 1,33) in zato zamaknjen od osi čaše. Lik ostane isti:
  // nad gladino je obrezan izvirnik, pod njo ista oblika, raztegnjena okoli osi čaše.
  lom(el, o, dod) {
    const [x0, y0, x1, y1] = dod.split(",").map(Number), xc = (x0 + x1) / 2;
    const idA = `mat-c${++stevec}`, idB = `mat-c${++stevec}`;
    const nad = nov("clipPath", { id: idA }), pod = nov("clipPath", { id: idB });
    nad.append(nov("rect", { x: -1e4, y: -1e4, width: 2e4, height: 1e4 + y0 }));
    pod.append(nov("rect", { x: x0 + 0.8, y: y0, width: x1 - x0 - 1.6, height: y1 - y0 }));
    const g = nov("g", { "clip-path": `url(#${idB})` }), c = el.cloneNode(false);
    c.removeAttribute("id");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("transform", `translate(${xc},0) scale(${LOM_VODA},1) translate(${-xc},0) ${el.getAttribute("transform") || ""}`.trim());
    g.append(c);
    return { pred: [nad, pod], po: [g], atr: { "clip-path": `url(#${idA})` } };
  },
  // Plamen: preliv (modro jedro, prosojen zunanji stožec) da CSS; tukaj še mehak sij okoli njega.
  plamen(el) {
    const b = okvir(el);
    if (!b) return null;
    const rx = (b[2] - b[0]) * 1.5, ry = (b[3] - b[1]) * 0.9;
    return { pred: [nov("ellipse", { cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, rx, ry, class: "mat-plamen-sij", ...(el.hasAttribute("transform") ? { transform: el.getAttribute("transform") } : {}) })] };
  },
  // Lik s svojim kovinskim prelivom (novejši poskusi): ostrejši odsev po legi valja čez obstoječi preliv.
  lesk(el) {
    if (el.localName !== "rect" && el.localName !== "circle" && el.localName !== "ellipse") return null;
    if (el.localName !== "rect") return { po: [kopija(el, "mat-ov mat-kovina mat-pol")] };
    const w = st(el, "width"), hh = st(el, "height");
    if (Math.min(w, hh) < 2.5) return null;
    return { po: [kopija(el, `mat-ov mat-pol ${hh >= w ? "mat-valj-x" : "mat-valj-y"}`)] };
  },
  // Plastika, lak, magnet: svetloba od zgoraj in ozek sijaj; večji kos dobi še senco na podlagi.
  sijaj(el) {
    if (!LIKI.has(el.localName)) return null;
    return { po: [kopija(el, "mat-ov mat-naprava")] };
  },
  ohisje(el) {
    if (el.localName !== "rect") return LIKI.has(el.localName) ? { po: [kopija(el, "mat-ov mat-naprava mat-pol")] } : null;
    const x = st(el, "x"), y = st(el, "y"), w = st(el, "width"), hh = st(el, "height"), pred = [];
    if (w >= 26 && hh >= 14 && !el.hasAttribute("transform")) pred.push(nov("rect", { x: x - 1, y: y + 2.2, width: w + 2, height: hh, rx: st(el, "rx") + 1.5, class: "mat-senca-p" }));
    return { pred, po: [kopija(el, "mat-ov mat-naprava")] };
  },
  merilnik(el) {
    if (el.localName !== "circle") return null;
    return { pred: [nov("circle", { cx: st(el, "cx") + 0.8, cy: st(el, "cy") + 2.2, r: st(el, "r") + 1.2, class: "mat-mer-senca" })] };
  },
  // Naprava: mehka senca pod ohišjem (dva zamaknjena lika) in svetloba od zgoraj.
  naprava(el) {
    if (!LIKI.has(el.localName)) return null;
    const pred = [];
    if (el.localName === "rect") {
      const x = st(el, "x"), y = st(el, "y"), w = st(el, "width"), hh = st(el, "height"), rx = st(el, "rx") + 1;
      pred.push(nov("rect", { x: x - 1.2, y: y + 2.6, width: w + 2.4, height: hh, rx: rx + 1, class: "mat-senca-p" }), nov("rect", { x: x + 0.3, y: y + 1.3, width: w - 0.6, height: hh, rx, class: "mat-senca-p" }));
      for (const s of pred) if (el.hasAttribute("transform")) s.setAttribute("transform", el.getAttribute("transform"));
    }
    return { pred, po: [kopija(el, "mat-ov mat-naprava")] };
  },
  // Rob mize: črta postane delovna plošča (svetel zgornji rob, čelo plošče, senca pod njo).
  miza(el) {
    if (el.localName !== "line") return null;
    const x1 = Math.min(st(el, "x1"), st(el, "x2")), x2 = Math.max(st(el, "x1"), st(el, "x2")), y = st(el, "y1");
    if (Math.abs(st(el, "y2") - y) > 0.01 || x2 - x1 < 20) return null;
    return { pred: [nov("rect", { x: x1, y, width: x2 - x1, height: 4.6, rx: 1.2, class: "mat-miza" }), nov("rect", { x: x1 + 2, y: y + 4.6, width: x2 - x1 - 4, height: 7, class: "mat-miza-senca" })] };
  },
  // Vodnik na mizi: senca pod njim in svetel rob (okrogel presek).
  zica(el) {
    if (el.localName !== "path" && el.localName !== "line" && el.localName !== "polyline") return null;
    const s = kopija(el, "mat-zica-senca"), c = kopija(el, "mat-zica");
    s.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(0.8,1.7)`.trim());
    c.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(-0.6,-0.6)`.trim());
    return { pred: [s], po: [c] };
  },
  kabel(el) {
    if (el.localName !== "path" && el.localName !== "line") return null;
    const s = kopija(el, "mat-zica-senca");
    s.setAttribute("transform", `${el.getAttribute("transform") || ""} translate(0.8,1.7)`.trim());
    return { pred: [s] };
  },
};
