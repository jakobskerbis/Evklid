// Ikone zgodovinskih slogov: za vsak slog (public/theme.js → ERAS) sestavi public/eras/<id>/ikone.json
// { map: { ime ikone v aplikaciji: ime ikone obdobja }, svg: { ime ikone obdobja: vsebina <svg> } }.
// Ista mreža in črta kot public/icons.js (viewBox 24 × 24, currentColor, stroke-width 2, zaobljeni konci).
// Del risb je iz paketa lucide-static (ISC, predmeti, ki sodijo v obdobje: amfora, šahovske figure, peščena ura …),
// ostale so lastne in sestavljene iz skupnih delov spodaj (pisalna podlaga sloga, lovor, zvezda, kolajna …).
// public/icons.js jih naloži šele, ko je slog izbran, in ob menjavi sloga zamenja že izrisane ikone.
// Navadni znaki vmesnika (puščice, ×, kljukica, plus, iskanje …) ostanejo enaki: seznam ZNAKI spodaj in docs/oblikovanje.md.
//   node scripts/ikone-obdobij.js            sestavi ikone vseh slogov
//   node scripts/ikone-obdobij.js --check    ali so datoteke enake sestavljenim (test/teme.test.js)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");

// Znaki vmesnika, ki jih slogi ne spreminjajo (gumb mora biti takoj jasen).
export const ZNAKI = [
  "check", "x", "plus", "arrow-left", "arrow-right", "arrow-left-right", "chevron-right", "chevron-down", "menu", "ellipsis-vertical",
  "search", "external-link", "play", "pause", "skip-forward", "eye", "trash-2", "delete", "undo-2", "redo-2", "rotate-ccw", "refresh-cw",
  "zoom-in", "zoom-out", "maximize", "maximize-2", "minimize-2", "copy", "corner-down-left", "circle", "square", "square-plus",
  "circle-check", "circle-x", "circle-arrow-up", "info", "circle-help", "lock", "unlock", "pin", "pin-off", "link", "log-out",
  "download", "cloud-upload", "save", "image-down", "folder-open", "share", "wifi-off", "volume-2", "volume-x", "sliders-horizontal",
  "camera", "keyboard", "mic", "eraser", "text", "image", "smartphone", "monitor-play", "sun", "moon", "sun-moon", "user-plus", "users",
  "badge-check", "zap", "heart", "bell", "wallet", "coins", "gem", "spade", "bomb", "venetian-mask", "ruler-dimension-line", "train-front",
  // grafični kalkulator (orodja in vrste funkcij)
  "house", "table", "wrench", "activity", "chart-area", "chart-spline", "flower", "infinity", "spline", "square-function",
  // logotip
  "elementi",
];

const n = (v) => +v.toFixed(2);
const p = (d, a = "") => `<path d="${d}"${a} />`;
const c = (x, y, r, a = "") => `<circle cx="${x}" cy="${y}" r="${r}"${a} />`;
const rect = (x, y, w, h, rx = 0, a = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ""}${a} />`;
const ell = (x, y, rx, ry, a = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${a} />`;
const thin = ' stroke-width="1.5"';
const dot = (x, y, r = 1) => c(x, y, r, ' fill="currentColor" stroke="none"');

function lucide(name) {
  const svg = fs.readFileSync(path.join(ROOT, "node_modules", "lucide-static", "icons", `${name}.svg`), "utf8");
  return svg.slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>")).replace(/\s*\n\s*/g, "").trim();
}

// Prestavi in poveča ali pomanjša risbo okoli sredine (12, 12): premakne koordinate, debelina črte ostane 2
// (nikoli transform="scale", ki bi stanjšal črto). Z njim imajo vse risbe enak vidni okvir in so na sredini.
export function fit(svg, k = 1, dx = 0, dy = 0) {
  const X = (v) => n(12 + (v - 12) * k + dx), Y = (v) => n(12 + (v - 12) * k + dy), L = (v) => n(v * k);
  const pathD = (d) => {
    const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
    let out = "", cmd = "", i = 0;
    const num = () => +tok[i++];
    const flag = () => { const t = tok[i]; if (t.length > 1 && /^[01]/.test(t)) { tok[i] = t.slice(1); return t[0]; } i++; return t; };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) { cmd = tok[i++]; out += cmd; if (/[zZ]/.test(cmd)) continue; }
      else out += " ";
      const rel = cmd === cmd.toLowerCase() && out.length > 1, c = cmd.toUpperCase(); // prvi par prvega »m« je absoluten
      const x = () => (rel ? L(num()) : X(num())), y = () => (rel ? L(num()) : Y(num()));
      const parts =
        c === "H" ? [x()] : c === "V" ? [y()] :
        c === "A" ? [L(num()), L(num()), num(), flag(), flag(), x(), y()] :
        c === "C" ? [x(), y(), x(), y(), x(), y()] : c === "S" || c === "Q" ? [x(), y(), x(), y()] : [x(), y()];
      out += parts.join(" ");
      if (c === "M") cmd = cmd === "m" ? "l" : "L";
    }
    return out.replace(/ -/g, "-");
  };
  const at = { cx: X, cy: Y, x: X, y: Y, r: L, rx: L, ry: L, width: L, height: L, "stroke-dasharray": (v) => v };
  return svg.replace(/<(\w+)([^>]*)\/>/g, (m, tag, attrs) => `<${tag}${attrs.replace(/([\w-]+)="([^"]*)"/g, (a, k2, v) =>
    k2 === "d" ? `d="${pathD(v)}"` :
    k2 === "transform" ? `transform="${v.replace(/rotate\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)/, (q, r, cx, cy) => `rotate(${r} ${X(+cx)} ${Y(+cy)})`)}"` :
    k2 === "stroke-dasharray" ? `${k2}="${v.split(/[ ,]+/).map((t) => L(+t)).join(" ")}"` :
    at[k2] ? `${k2}="${at[k2](+v)}"` : a)}/>`);
}

// Zvezda: polmeri si sledijo po vrsti (npr. [10, 4] = ostra zvezda, [10, 3, 6, 3] = vetrovnica z dolgimi in kratkimi kraki).
function star(cx, cy, k, radii, rot = -90) {
  const m = k * radii.length;
  const pts = Array.from({ length: m }, (_, i) => {
    const a = ((rot + (i * 360) / m) * Math.PI) / 180;
    const r = radii[i % radii.length];
    return `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  });
  return p(`M${pts.join("L")}Z`);
}
// Iskrica (kot v ikoni »sparkles«): štirje kraki z vbočenimi stranicami; k = kako blizu sredine gredo stranice.
const sparkle = (x, y, r, k = 0.2) => {
  const q = n(r * k), t = n(y - r), b = n(y + r), l = n(x - r), rr = n(x + r);
  return p(`M${x} ${t}Q${n(x + q)} ${n(y - q)} ${rr} ${y}Q${n(x + q)} ${n(y + q)} ${x} ${b}Q${n(x - q)} ${n(y + q)} ${l} ${y}Q${n(x - q)} ${n(y - q)} ${x} ${t}Z`);
};
// Osemkraka zvezda iz dveh kvadratov (islamska geometrija).
const khatim = (cx, cy, r) => {
  const a = n(r * Math.SQRT1_2);
  return p(`M${n(cx - a)} ${n(cy - a)}h${n(2 * a)}v${n(2 * a)}h${n(-2 * a)}z`) + p(`M${cx} ${n(cy - r)}L${n(cx + r)} ${cy}L${cx} ${n(cy + r)}L${n(cx - r)} ${cy}z`);
};
// List (lečasta oblika) od točke (x, y) v smeri a (stopinje), dolžina l, širina w.
function leafD(x, y, a, l, w) {
  const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r);
  const ex = x + ux * l, ey = y + uy * l, mx = x + (ux * l) / 2, my = y + (uy * l) / 2;
  return `M${n(x)} ${n(y)}Q${n(mx - uy * w)} ${n(my + ux * w)} ${n(ex)} ${n(ey)}Q${n(mx + uy * w)} ${n(my - ux * w)} ${n(x)} ${n(y)}Z`;
}
// Cvet iz k listov okrog središča.
const petals = (cx, cy, k, r0, r1, w, rot = -90) =>
  p(Array.from({ length: k }, (_, i) => { const a = rot + (i * 360) / k, t = (a * Math.PI) / 180; return leafD(cx + r0 * Math.cos(t), cy + r0 * Math.sin(t), a, r1 - r0, w); }).join(""));

// Zobnik: k ravnih zob (zunanji polmer ro, notranji ri), vrh zoba je za del f ožji od korena.
function gear(cx, cy, k, ro, ri, f = 0.32) {
  const pt = (a, r) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`, st = (2 * Math.PI) / k;
  let d = "";
  for (let i = 0; i < k; i++) {
    const a = -Math.PI / 2 + i * st - st / 4;
    d += `${i ? "L" : "M"}${pt(a, ri)}L${pt(a + st * f * 0.25, ro)}L${pt(a + st * (0.5 - f * 0.25), ro)}L${pt(a + st / 2, ri)}A${ri} ${ri} 0 0 1 ${pt(a + st, ri)}`;
  }
  return p(d + "Z");
}

// Lovorov venec: dve veji (kvadratni Bézier), na vsaki listi navzven.
function laurel(ribbon) {
  const P0 = [10.5, 20], C = [3.5, 16.5], P2 = [7, 4];
  const at = (t) => [0, 1].map((i) => (1 - t) ** 2 * P0[i] + 2 * (1 - t) * t * C[i] + t * t * P2[i]);
  const tan = (t) => [0, 1].map((i) => 2 * (1 - t) * (C[i] - P0[i]) + 2 * t * (P2[i] - C[i]));
  let d = `M${P0[0]} ${P0[1]}Q${C[0]} ${C[1]} ${P2[0]} ${P2[1]}`;
  for (const t of [0.2, 0.47, 0.74]) {
    const [x, y] = at(t), [tx, ty] = tan(t);
    const a = (Math.atan2(ty, tx) * 180) / Math.PI;
    d += leafD(x, y, a - 32, 4.2, 1.5);
  }
  const [tx, ty] = tan(1);
  d += leafD(P2[0], P2[1], (Math.atan2(ty, tx) * 180) / Math.PI, 3.5, 1.4);
  const mirror = d.replace(/([MQ ]|Z)?(-?[\d.]+) (-?[\d.]+)/g, (m, cmd = "", x, y) => `${cmd}${n(24 - x)} ${y}`);
  return p(d) + p(mirror) + (ribbon ? p("M10.5 20l-2 1.5M13.5 20l2 1.5M10.5 20h3") : "");
}
const ribbonMedal = (inner) => p("M8 2.5l2.6 6.4M16 2.5l-2.6 6.4") + c(12, 15, 6.5) + inner(12, 15);

// Drobni znaki znotraj okvirjev.
const mk = {
  check: (x, y) => p(`M${x - 3.5} ${y}l2.5 2.5 4.5-5`),
  heart: (x, y) => p(`M${x} ${y + 3}L${n(x - 3.3)} ${y - 0.3}A2 2 0 0 1 ${x} ${y - 2.6}A2 2 0 0 1 ${n(x + 3.3)} ${y - 0.3}Z`),
  lines: (x, y, h = 3) => p(`M${x - 4} ${y - h}h8M${x - 4} ${y}h8M${x - 4} ${y + h}h5`),
  cols: (x, y, h = 3) => p(`M${x - 4.5} ${y - h}h3.5M${x - 4.5} ${y}h3.5M${x - 4.5} ${y + h}h3.5M${x + 1} ${y - h}h3.5M${x + 1} ${y}h3.5M${x + 1} ${y + h}h3.5`),
  sigma: (x, y) => p(`M${x + 3} ${y - 3}V${y - 4}H${x - 3}l3 4-3 4h6v-1`),
  meander: (x, y) => p(`M${x - 3} ${y + 2.5}v-5h6v3.5h-3v-1.5`),
  star4: (x, y, r = 3.2) => star(x, y, 4, [r, r * 0.3]),
  star8: (x, y, r = 3.2) => star(x, y, 8, [r, r * 0.5]),
  lotus: (x, y) => p(`M${x} ${y + 2.5}c-1.5-1.3-1.6-3.6 0-5.5 1.6 1.9 1.5 4.2 0 5.5zM${x} ${y + 2.5}c-2.2.1-3.6-1-4-3 1.9-.1 3.3.9 4 3zM${x} ${y + 2.5}c2.2.1 3.6-1 4-3-1.9-.1-3.3.9-4 3z`),
  sun: (x, y) => c(x, y, 1.5) + p(`M${x} ${y - 4}v1M${x} ${y + 4}v-1M${x - 4} ${y}h1M${x + 4} ${y}h-1M${x - 2.8} ${y - 2.8}l.7.7M${x + 2.8} ${y + 2.8}l-.7-.7M${x - 2.8} ${y + 2.8}l.7-.7M${x + 2.8} ${y - 2.8}l-.7.7`, thin),
  moon: (x, y) => p(`M${x + 1} ${y - 3}a3 3 0 1 0 0 6 2.4 2.4 0 0 1 0-6z`),
  owlEyes: (x, y) => c(x - 1.6, y - 0.5, 1.3) + c(x + 1.6, y - 0.5, 1.3) + p(`M${x - 0.6} ${y + 1.5}l.6 .9.6-.9`),
};

// Pisalne podlage slogov in njihova sredina (naloge, mnenje, besedilo, Σ).
const SURF = {
  antik: [rect(4, 5.5, 16, 15, 2) + p("M9.5 5.5a2.5 2.5 0 0 1 5 0"), 12, 13], // voščena tablica z ročajem
  renesansa: [p("M19 17V5a2 2 0 0 0-2-2H4") + p("M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"), 12.5, 10], // pergament
  bagdad: [p("M5 21V10.5C5 7 8 4.5 12 3c4 1.5 7 4 7 7.5V21z"), 12, 14], // list s šilastim lokom
  indija: [rect(4, 7, 16, 14, 2) + p("M10 7V3h4v4") + c(12, 5, 0.4), 12, 14], // takhti (lesena šolska tablica z ročajem) // palmov list z luknjo za vrvico
  // list papirusa pod zvitkom: zvitek z okroglima, navitima koncema (da ni videti kot škatla za arhiv)
  egipt: [p("M5 2.75h14M5 7.25h14") + c(5, 5, 2.25) + c(19, 5, 2.25) + dot(5, 5, 0.55) + dot(19, 5, 0.55) + p("M5 7.25V19.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7.25"), 12, 14.25],
};
const onSurf = (s, mark) => SURF[s][0] + mark(SURF[s][1], SURF[s][2]);

// Skupne risbe.
const scrollMap = (marker) => p("M4.5 3.5v17M19.5 3.5v17M4.5 6h15M4.5 18h15") + p("M8 15c2.5 0 3-3.5 4.5-3.5", ' stroke-dasharray="0 3"') + marker(15, 10);
const scanFrame = p("M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16");
const eye = p("M7 12s1.8-3.5 5-3.5 5 3.5 5 3.5-1.8 3.5-5 3.5S7 12 7 12z") + dot(12, 12, 1.4);
const calFrame = (mark) => p("M8 3v3M16 3v3") + rect(3.5, 4.5, 17, 16, 2) + p("M3.5 9.5h17") + mark(12, 15);
const chest = rect(3, 10, 18, 10, 1) + p("M3 10V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2") + rect(10.5, 9, 3, 4, 0.5);
const globe = c(12, 9.5, 6) + ell(12, 9.5, 2.5, 6) + p("M6 9.5h12") + p("M18.4 4a8.5 8.5 0 0 1-12 12") + p("M12 18v3M8.5 21h7");
const armillary = c(12, 10.5, 7.5) + ell(12, 10.5, 7.5, 2.5) + ell(12, 10.5, 7.5, 2.5, ' transform="rotate(-50 12 10.5)"') + p("M12 18v3M9 21h6");
const atoms = c(12, 12, 2.5) + c(6.5, 8, 2) + c(17.5, 8, 2) + c(7.5, 17.5, 2) + c(16.5, 17.5, 2);
const torch = p("M10 22h4l1-9H9z") + p("M8 13h8") + p("M12 2c2 2.5 3.5 4.3 3.5 6.3a3.5 3.5 0 0 1-7 0C8.5 6.3 10 4.5 12 2z");
const arrow = p("M2 12h14") + p("M16 8.5l5 3.5-5 3.5z") + p("M2 9.5L4.5 12 2 14.5M5.5 9.5L8 12l-2.5 2.5", thin);
// pisalo: pisalna deska, odprta v kotu, in pisalo z lopatko (za glajenje voska)
const stylus = p("M12 4.5H5.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12") + p("M9 15L18.5 5.5M16.5 3.5l4 4");
const arrowTarget = c(10, 14, 7) + c(10, 14, 3) + p("M10 14l9.5-9.5") + p("M16.5 4.5V7.5h3");
const cards = rect(4, 6, 11, 15, 1.5, ' transform="rotate(-12 9.5 13.5)"') + rect(9, 4, 11, 15, 1.5) + mk.star4(14.5, 11.5, 3);
const setSquare = p("M4 20V4l16 16z") + p("M8 16v-5.5l5.5 5.5z");
const tablets = rect(7, 3, 13, 15, 1.5) + p("M4 7v12.5A1.5 1.5 0 0 0 5.5 21H16") + p("M10 7.5h7M10 10.5h7M10 13.5h4");
const wheel = (k, arrowhead) => (arrowhead ? p("M21 12a9 9 0 1 1-2.64-6.36L21 8.5") + p("M21 3.5v5h-5") : c(12, 12, 9)) + c(12, 12, 2) +
  p(Array.from({ length: k }, (_, i) => { const t = (i * 2 * Math.PI) / k + (arrowhead ? Math.PI / 4 : 0), r = arrowhead ? 6 : 9; return `M${n(12 + 2 * Math.cos(t))} ${n(12 + 2 * Math.sin(t))}L${n(12 + r * Math.cos(t))} ${n(12 + r * Math.sin(t))}`; }).join(""));
const clepsydra = p("M4.5 3h15l-2.5 6h-10z") + p("M12 11.5v.5M12 14.5v.5") + p("M5.5 17.5h13l-1.5 3.5h-10z") + p("M7 19.5h10", thin);
const alembic = c(7.5, 16, 5) + p("M6 11.2V8h3v3.2") + p("M5 8a2.5 2.5 0 0 1 5 0z") + p("M10 6.5l7 8") + c(18.5, 18, 3) + p("M17 14.5h3");
const stepsChart = p("M3 20h4v-5h5v-5h5V5h4") + p("M3 20h18");

// Risbe po slogih: ime ikone obdobja → [svg, imena ikon v aplikaciji]. Sestavijo se šele ob klicu (lucide-static je le za razvoj).
let S;
export function tabele() {
  if (S) return S;
  S = {
    antik: {
      // jonski kapitel z iskrico (j, 2026-10-31 izbral D namesto sove): voluti, ehin, trije žlebovi debla
      kapitel: [p("M12 2.76Q12.43 4.49 14.16 4.92Q12.43 5.35 12 7.08Q11.57 5.35 9.84 4.92Q11.57 4.49 12 2.76Z") +
        p("M12 9.43H6.17A3.01 3.01 0 0 0 6.17 15.45A1.97 1.97 0 0 0 8.15 13.47") +
        p("M12 9.43H17.83A3.01 3.01 0 0 1 17.83 15.45A1.97 1.97 0 0 1 15.85 13.47") +
        p("M9.74 12.44Q12 13.66 14.26 12.44") + p("M8.8 16.95V20.71M15.2 16.95V20.71M12 16.95V20.71"), ["sparkles", "message-circle", "bot"]],
      zemljevid: [scrollMap((x, y) => p(`M${x - 1.6} ${y - 1.6}l3.2 3.2M${x + 1.6} ${y - 1.6}l-3.2 3.2`)), ["map"]],
      zvitek: [lucide("scroll"), ["book-open"]],
      oko: [scanFrame + eye, ["scan-line", "scan-text"]],
      // računska plošča (kot salaminska): dve črti, trije kamenčki
      abak: [rect(3, 4.5, 18, 15, 2) + p("M3 9.5h18M3 14.5h18") + dot(7.5, 9.5, 1.9) + dot(12, 9.5, 1.9) + dot(16.5, 14.5, 1.9), ["calculator"]],
      lovor: [laurel(false), ["medal"]],
      kolajna: [ribbonMedal((x, y) => c(x, y, 2.5)), ["award"]],
      // pokal (Lige): kantharos, dvoročajna čaša na nogi (amfora pri 16 px ni pokal)
      pokal: [p("M6 5h12c0 4.5-2.5 7.5-6 7.5S6 9.5 6 5z") + p("M7 9.5C3.5 9.5 3 4 5.5 3.5M17 9.5c3.5 0 4-5.5 1.5-6") + p("M12 12.5V18") + p("M8 21.5h8l-1.5-3.5h-5z"), ["trophy"]],
      amfora: [lucide("amphora"), ["droplet"]],
      kocka: [rect(4, 4, 16, 16, 3) + dot(8.5, 8.5, 1.5) + dot(12, 12, 1.5) + dot(15.5, 15.5, 1.5), ["gamepad-2", "joystick", "dices"]],
      koledar: [calFrame((x, y) => dot(x, y, 1.8)), ["calendar", "calendar-days", "calendar-clock"]],
      stebri: [p("M6 20v-5.5M4.5 14.5h3M12 20v-10M10.5 10h3M18 20V5M16.5 5h3") + p("M3 20h18"), ["chart-column"]],
      poganjek: [lucide("sprout"), ["trending-up"]],
      zobnik: [gear(12, 12, 8, 9.5, 7) + c(12, 12, 3), ["settings"]],
      // doprsni kip na nizkem podstavku
      doprsje: [c(12, 7, 3.5) + p("M5.5 18c0-4 2.9-6.5 6.5-6.5s6.5 2.5 6.5 6.5z") + p("M8 20.5h8"), ["user"]],
      zvezda: [star(12, 12, 8, [10, 4]), ["star"]],
      bakla: [torch, ["flame"]],
      oljenka: [p("M3 15C3 12.5 6 11.5 11 11.5h7.5L21 10l-1 3.5c-1 3-5 4-9 4-5 0-8-.8-8-2.5z") + p("M20.5 7.5c-1.2-1.2-1-3 0-4.5 1.3 1.5 1.5 3.2 0 4.5z") + p("M3.5 14a2 2 0 0 1 0-3"), ["lightbulb"]],
      lok: [lucide("bow-arrow"), ["target"]],
      zastava: [lucide("flag-triangle-right"), ["flag"]],
      sigma: [p("M5 21V8l7-5 7 5v13z") + mk.sigma(12, 13.5), ["sigma"]],
      puscica: [arrow, ["send"]],
      vetrovnica: [c(12, 12, 9.5) + star(12, 12, 4, [7.5, 2]), ["compass"]],
      kolo: [wheel(4, true), ["repeat"]],
      naloge: [onSurf("antik", mk.check), ["clipboard-check", "list-checks"]],
      mnenje: [onSurf("antik", mk.heart), ["message-square-heart"]],
      besedilo: [onSurf("antik", mk.lines), ["file-text"]],
      stela: [p("M5 20V8l7-5 7 5v12z") + p("M3.5 20.5h17") + mk.lines(12, 13), ["newspaper"]],
      pisalo: [stylus, ["pencil", "notebook-pen", "feather"]],
      labirint: [p("M4 4h16v16H4V8h12v8H8v-4h4"), ["puzzle"]],
      akademija: [lucide("landmark"), ["graduation-cap", "castle"]],
      skrinja: [chest, ["gift"]],
      posoda: [lucide("flask-round"), ["flask-conical"]],
      atomi: [atoms, ["atom"]],
      globus: [globe, ["globe"]],
      klepsidra: [clepsydra, ["timer"]],
      mozaik: [rect(3, 3, 18, 18, 2) + p("M3 10h7v11M10 3v7h11M14 10v11M14 15h7") + dot(6.5, 6.5, 1.5), ["palette", "paintbrush", "grid-2x2"]],
      maske: [lucide("drama"), ["party-popper"]],
      // polica z zvitki (konci zvitkov), brez pregrad
      knjiznica: [rect(3, 3.5, 18, 17, 2) + p("M3 12h18") + dot(7.5, 8, 1.8) + dot(12, 8, 1.8) + dot(16.5, 8, 1.8) + dot(7.5, 16.5, 1.8) + dot(12, 16.5, 1.8), ["library"]],
      sestilo: [lucide("drafting-compass"), ["ruler"]],
      tablice: [tablets, ["layers"]],
      lonec: [lucide("cooking-pot"), ["chef-hat"]],
      ladjica: [lucide("sailboat"), ["car"]],
      zelva: [lucide("turtle"), ["paw-print"]],
      kovanci: [lucide("coins"), ["shopping-basket"]],
      grozdje: [lucide("grape"), ["cherry"]],
      zid: [lucide("brick-wall"), ["blocks"]],
    },
    renesansa: {
      pero: [p("M4 21l1.5-5h6l1.5 5z") + p("M6.5 16v-1.5h4V16") + p("M9 14.5C10 8 14 4 21 3c-1 7-5 10.5-12 11.5") + p("M9 14.5l7-7"), ["sparkles", "message-circle", "bot"]],
      portolan: [scrollMap((x, y) => mk.star4(x, y, 2.6)), ["map"]],
      kodeks: [rect(5, 3, 14, 18, 1.5) + p("M8 3v18") + p("M13.5 8l2.5 4-2.5 4-2.5-4z") + p("M19 10.5h1.5v3H19"), ["book-open"]],
      oko: [scanFrame + eye, ["scan-line", "scan-text"]],
      abak: [rect(3.5, 3.5, 17, 17, 2) + p("M3.5 9h17M9 3.5v17M15 3.5v17") + dot(9, 6.25, 1.6) + dot(15, 13, 1.9) + dot(9, 16, 1.9), ["calculator"]],
      lovor: [laurel(true), ["medal"]],
      kolajna: [ribbonMedal(mk.star4), ["award"]],
      krona: [lucide("crown"), ["trophy"]],
      skakac: [lucide("chess-knight"), ["gamepad-2", "joystick"]],
      kocke: [lucide("dice-3"), ["dices"]],
      koledar: [calFrame(mk.star4), ["calendar", "calendar-days", "calendar-clock"]],
      arkade: [p("M3.5 20v-4.5a1.5 1.5 0 0 1 3 0V20M10.5 20v-8.5a1.5 1.5 0 0 1 3 0V20M17.5 20V6.5a1.5 1.5 0 0 1 3 0V20") + p("M2 20h20"), ["chart-column"]],
      vzhod: [lucide("sunrise"), ["trending-up"]],
      // zobnik urnega mehanizma; ne krmilo (spominja na ☸)
      zobnik: [star(12, 12, 12, [9.5, 7.3]) + c(12, 12, 3), ["settings"]],
      kameja: [ell(12, 12, 8, 10) + c(12, 9.5, 3) + p("M7 18.5c.8-3 2.6-4.5 5-4.5s4.2 1.5 5 4.5"), ["user"]],
      zvezda: [star(12, 12, 4, [10, 2.6, 6, 2.6]), ["star"]],
      bakla: [torch, ["flame"]],
      sveca: [rect(9, 10, 6, 10, 1) + p("M12 2.5c1.5 2 2.5 3.2 2.5 4.5a2.5 2.5 0 0 1-5 0c0-1.3 1-2.5 2.5-4.5z") + p("M6 21h12"), ["lightbulb"]],
      tarca: [arrowTarget, ["target"]],
      // gonfalon: prapor na prečki s tremi repi
      prapor: [p("M12 2v1.5M4 3.5h16") + p("M6 3.5V19l3-2.5 3 2.5 3-2.5 3 2.5V3.5"), ["flag"]],
      sigma: [onSurf("renesansa", mk.sigma), ["sigma"]],
      pismo: [rect(2, 5, 20, 14, 2) + p("M2 7l10 6 10-6") + c(12, 14, 2.5), ["send"]],
      vetrovnica: [c(12, 12, 10) + star(12, 12, 4, [8, 2, 4.5, 2]), ["compass"]],
      orbita: [lucide("orbit"), ["repeat"]],
      naloge: [onSurf("renesansa", mk.check), ["clipboard-check", "list-checks"]],
      mnenje: [onSurf("renesansa", mk.heart), ["message-square-heart"]],
      besedilo: [lucide("scroll-text"), ["file-text"]],
      letak: [rect(4, 3, 16, 18, 1) + p("M7 7h10") + mk.cols(12, 14), ["newspaper"]],
      "gosje-pero": [p("M5 19C6 11 12 5 21 3c-2 9-8 15-16 16z") + p("M5 19L14 10") + p("M3 21l2-2"), ["pencil", "notebook-pen", "feather"]],
      "magicni-kvadrat": [lucide("grid-3x3"), ["puzzle", "grid-2x2"]],
      univerza: [lucide("school"), ["graduation-cap"]],
      skrinja: [chest, ["gift"]],
      bucka: [lucide("flask-round"), ["flask-conical"]],
      armila: [armillary, ["atom"]],
      globus: [globe, ["globe"]],
      "pescena-ura": [lucide("hourglass"), ["timer"]],
      paleta: [lucide("palette"), ["palette", "paintbrush"]],
      maske: [lucide("drama"), ["party-popper"]],
      knjiznica: [lucide("library-big"), ["library"]],
      kotnik: [setSquare, ["ruler"]],
      karte: [cards, ["layers"]],
      grad: [lucide("castle"), ["castle"]],
      lonec: [lucide("cooking-pot"), ["chef-hat"]],
      ladja: [lucide("ship"), ["car"]],
      pes: [lucide("dog"), ["paw-print"]],
      tehtnica: [lucide("scale"), ["shopping-basket"]],
      jabolko: [lucide("apple"), ["cherry"]],
      kaplje: [lucide("droplets"), ["droplet"]],
      zid: [lucide("brick-wall"), ["blocks"]],
    },
    bagdad: {
      astrolab: [c(12, 13.5, 6.75) + c(12, 13.5, 2.5) + p("M7.2 18.3L16.8 8.7") + p("M12 6.75V5.7") + c(12, 4.2, 1.3), ["sparkles", "message-circle", "bot"]],
      zemljevid: [scrollMap((x, y) => mk.star8(x, y, 2.6)), ["map"]],
      rokopis: [rect(4, 3, 16, 18, 2) + p("M8 3v18") + star(14, 12, 8, [3.8, 2]), ["book-open"]],
      oko: [scanFrame + eye, ["scan-line", "scan-text"]],
      plosca: [rect(3, 4, 18, 16, 2) + p("M7.5 9.5L9 8v8") + p("M12.5 10a2 2 0 1 1 3.3 1.5L12.5 16h4"), ["calculator"]],
      kolajna: [ribbonMedal(mk.star8), ["medal"]],
      // ne khatim s krogom v sredini (۞, znak v Koranu): medaljon z zvezdo
      rozeta: [c(12, 9.5, 6.5) + star(12, 9.5, 8, [4.2, 2.2]) + p("M9.5 15.5l-1.5 6 3-1.2M14.5 15.5l1.5 6-3-1.2"), ["award"]],
      krona: [lucide("crown"), ["trophy"]],
      trdnjava: [lucide("chess-rook"), ["gamepad-2", "joystick"]],
      kocke: [lucide("dice-6"), ["dices"]],
      koledar: [calFrame(mk.star8), ["calendar", "calendar-days", "calendar-clock"]],
      loki: [p("M3.5 20v-4.5q0-1.5 1.5-2.5 1.5 1 1.5 2.5V20M10.5 20v-8.5q0-1.5 1.5-2.5 1.5 1 1.5 2.5V20M17.5 20V7.5q0-1.5 1.5-2.5 1.5 1 1.5 2.5V20") + p("M2 20h20"), ["chart-column"]],
      vzhod: [lucide("sunrise"), ["trending-up"]],
      zobnik: [star(12, 12, 8, [10, 7.5], -67.5) + c(12, 12, 3), ["settings"]],
      portret: [p("M5 21V10.5C5 7 8 4.5 12 3c4 1.5 7 4 7 7.5V21z") + c(12, 10.5, 2.8) + p("M7.5 21c0-3 2-5 4.5-5s4.5 2 4.5 5"), ["user"]],
      zvezda: [khatim(12, 12, 9.5), ["star"]],
      ogenj: [lucide("flame-kindling"), ["flame"]],
      // svečnik (medeninast, zvonasto podnožje); ne svetilka s pokrovom in nogo (kliše »čarobne svetilke«)
      svecnik: [p("M12 2.5c1.3 1.7 2 2.8 2 3.9a2 2 0 0 1-4 0c0-1.1.7-2.2 2-3.9z") + p("M10.5 15V9.5h3V15") + p("M7.5 15h9") + p("M12 15v2.5") + p("M6.5 21.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4z"), ["lightbulb"]],
      tarca: [arrowTarget, ["target"]],
      zastava: [p("M5 22V3") + p("M5 4h14l-3.5 4.5L19 13H5"), ["flag"]],
      sigma: [onSurf("bagdad", mk.sigma), ["sigma"]],
      golob: [lucide("bird"), ["send"]],
      // vetrovnica: štirje dolgi in štirje kratki kraki (osem enakih krakov v krogu bi bralo kot ۞)
      vetrovnica: [c(12, 12, 9.5) + star(12, 12, 4, [6.75, 1.8, 3.75, 1.8]), ["compass"]],
      noria: [wheel(6, true), ["repeat"]],
      "pescena-ura": [lucide("hourglass"), ["timer"]],
      naloge: [onSurf("bagdad", mk.check), ["clipboard-check", "list-checks"]],
      mnenje: [onSurf("bagdad", mk.heart), ["message-square-heart"]],
      besedilo: [onSurf("bagdad", (x, y) => mk.lines(x, y + 0.5)), ["file-text"]],
      stran: [rect(4, 3, 16, 18, 1.5) + p("M7 8.5c2 0 3.5-1 5-2.8 1.5 1.8 3 2.8 5 2.8") + mk.lines(12, 14.5), ["newspaper"]],
      // kalam (trstno pero): votlo steblo s poševno prirezano konico
      trstika: [p("M3.5 20.5l1-4L16 5a2 2 0 0 1 3 3L7.5 19.5z") + p("M4.5 16.5l3 3M7 17l3.5-3.5"), ["pencil", "notebook-pen", "feather"]],
      girih: [star(12, 12, 8, [10, 5.5], -67.5) + star(12, 12, 8, [4, 4], -67.5), ["puzzle"]],
      vrata: [p("M4 21V7h3v2h3V7h4v2h3V7h3v14z") + p("M9.5 21v-4c0-1.5 1-2.5 2.5-3.5 1.5 1 2.5 2 2.5 3.5v4"), ["graduation-cap", "castle"]],
      skrinja: [chest, ["gift"]],
      alembik: [alembic, ["flask-conical"]],
      armila: [armillary, ["atom"]],
      globus: [globe, ["globe"]],
      ploscica: [rect(3, 3, 18, 18, 2) + mk.star8(12, 12, 6), ["palette", "paintbrush", "grid-2x2"]],
      utrinek: [star(12, 12, 8, [9, 3.5]) + dot(4, 4) + dot(20, 4) + dot(20, 20) + dot(4, 20), ["party-popper"]],
      knjiznica: [lucide("library-big"), ["library"]],
      kvadrant: [p("M4 20V4a16 16 0 0 1 16 16z") + p("M4 8.5a11.5 11.5 0 0 1 11.5 11.5", thin) + p("M4 20l9-9") + c(13.5, 10.5, 1), ["ruler"]],
      karte: [cards, ["layers"]],
      lonec: [lucide("cooking-pot"), ["chef-hat"]],
      ladjica: [lucide("sailboat"), ["car"]],
      macka: [lucide("cat"), ["paw-print"]],
      tehtnica: [lucide("scale"), ["shopping-basket"]],
      granatno: [c(12, 14, 7.5) + p("M9.5 7L9 3.5l3 2 3-2-.5 3.5"), ["cherry"]],
      vodnjak: [p("M3 15h18c-.5 3-4 5-9 5s-8.5-2-9-5z") + p("M12 15V7") + p("M12 7c-2-2-4.5-2-6 0M12 7c2-2 4.5-2 6 0") + p("M9 20l-.5 2h7l-.5-2"), ["droplet"]],
      zid: [lucide("brick-wall"), ["blocks"]],
    },
    indija: {
      // inštruktor: šunja (ničla iz indijske matematike, ovalna kot števka 0) z dvema iskricama kot ikona »sparkles«;
      // brez žarkov (krog z osmimi žarki bere kot kolo/dharmačakra) in brez iskrice na diagonali (♂); lotos ostane le v vzorcih
      sunja: [ell(9.5, 13, 4.75, 6.75) + sparkle(18, 7.5, 3.5) + sparkle(19, 14.75, 1.75, 0.3), ["sparkles", "message-circle", "bot"]],
      zemljevid: [scrollMap((x, y) => mk.lotus(x, y)), ["map"]],
      // svežnja palmovih listov, prevezana z vrvico
      "palmovi-listi": [rect(2.5, 5, 19, 5, 2.5) + rect(2.5, 14, 19, 5, 2.5) + p("M7.5 3.5v17"), ["book-open"]],
      knjiznica: [lucide("library-big"), ["library"]],
      karte: [cards, ["layers"]],
      oko: [scanFrame + eye, ["scan-line", "scan-text"]],
      nicla: [rect(3, 4, 18, 16, 2) + p("M7.5 9.5L9 8v8") + ell(15, 12, 2.5, 4), ["calculator"]],
      kolajna: [ribbonMedal(mk.lotus), ["medal"]],
      rozeta: [petals(12, 9.5, 6, 2.2, 7.5, 1.8) + c(12, 9.5, 2.2) + p("M9.5 16l-1.5 5 3-1.2M14.5 16l1.5 5-3-1.2"), ["award"]],
      krona: [lucide("crown"), ["trophy"]],
      kmet: [lucide("chess-pawn"), ["gamepad-2", "joystick"]],
      pasa: [rect(2, 8, 20, 8, 2) + dot(6.5, 12, 1.2) + dot(11, 10.5, 1.2) + dot(13, 13.5, 1.2) + dot(17.5, 10.5, 1.2) + dot(17.5, 13.5, 1.2), ["dices"]],
      koledar: [calFrame(mk.lotus), ["calendar", "calendar-days", "calendar-clock"]],
      stopnice: [stepsChart, ["chart-column"]],
      poganjek: [lucide("sprout"), ["trending-up"]],
      // zobnik; ne kolo z 8 naperami (dharmačakra)
      zobnik: [star(12, 12, 10, [10, 7.5]) + c(12, 12, 4.5), ["settings"]],
      portret: [p("M5 21v-9c0-2 1.5-3.5 3-3.5 0-2.5 2-4.5 4-4.5s4 2 4 4.5c1.5 0 3 1.5 3 3.5v9z") + c(12, 11.5, 2.6) + p("M7.5 21c0-3 2-5 4.5-5s4.5 2 4.5 5"), ["user"]],
      zvezda: [star(12, 12, 10, [10, 5.5]), ["star"]],
      ogenj: [lucide("flame-kindling"), ["flame"]],
      dija: [p("M3 13h18c-1 4.5-5 7-9 7s-8-2.5-9-7z") + p("M12 3c2 2.8 3 4.3 3 6a3 3 0 0 1-6 0c0-1.7 1-3.2 3-6z"), ["lightbulb"]],
      lok: [lucide("bow-arrow"), ["target"]],
      zastava: [lucide("flag-triangle-right"), ["flag"]],
      sigma: [onSurf("indija", mk.sigma), ["sigma"]],
      puscica: [arrow, ["send"]],
      // roža vetrov iz listov: štirje dolgi in štirje kratki (osem enakih v krogu bi bralo kot kolo/dharmačakra ali lotos)
      roza: [c(12, 12, 9.5) + petals(12, 12, 4, 1.5, 6.75, 1.5) + petals(12, 12, 4, 1.5, 4.25, 1.1, -45), ["compass"]],
      orbita: [lucide("orbit"), ["repeat"]],
      naloge: [onSurf("indija", mk.check), ["clipboard-check", "list-checks"]],
      mnenje: [onSurf("indija", mk.heart), ["message-square-heart"]],
      besedilo: [onSurf("indija", mk.lines), ["file-text"]],
      edikt: [onSurf("indija", (x, y) => p(`M${x - 4.5} ${y - 1.75}h3.5M${x + 1} ${y - 1.75}h3.5M${x - 4.5} ${y + 1.75}h3.5M${x + 1} ${y + 1.75}h3.5`)), ["newspaper"]],
      pisalo: [stylus, ["pencil", "notebook-pen", "feather"]],
      "magicni-kvadrat": [lucide("grid-3x3"), ["puzzle"]],
      paviljon: [p("M5 11a7 6 0 0 1 14 0z") + p("M12 5V3") + p("M4 11h16") + p("M6 11v9M18 11v9M12 14v6") + p("M3 20.5h18"), ["graduation-cap", "castle"]],
      skrinja: [chest, ["gift"]],
      alembik: [alembic, ["flask-conical"]],
      atomi: [atoms, ["atom"]],
      globus: [globe, ["globe"]],
      klepsidra: [clepsydra, ["timer"]],
      rangoli: [p("M12 2l10 10-10 10L2 12z") + p("M12 7l5 5-5 5-5-5z") + dot(12, 12, 1.2), ["palette", "paintbrush", "grid-2x2"]],
      utrinek: [petals(12, 12, 8, 3, 10, 1.6) + dot(4, 4) + dot(20, 4) + dot(20, 20) + dot(4, 20), ["party-popper"]],
      kotnik: [setSquare, ["ruler"]],
      lonec: [lucide("cooking-pot"), ["chef-hat"]],
      ladja: [lucide("ship"), ["car"]],
      ptica: [lucide("bird"), ["paw-print"]],
      kovanci: [lucide("coins"), ["shopping-basket"]],
      mango: [p("M7 20c-3-3-3.5-9 1-13 3.5-3 9-3 11 1 2 4-1 9-5 11-2.5 1.2-5 2.5-7 1z") + p("M15 5c0-1.5 1-2.5 2-3"), ["cherry"]],
      vrc: [c(12, 15, 6) + p("M9.5 9.5V6h5v3.5") + p("M8.5 4h7"), ["droplet"]],
      zid: [lucide("brick-wall"), ["blocks"]],
    },
    egipt: {
      // inštruktor: nizka piramida z robom (osnovnica širša od višine, da ni videti kot ⚠) na tleh in iskrica
      // (brez verskih simbolov: ne oko, ankh, skarabej, sončni disk)
      piramida: [p("M2 20h20") + p("M3.5 20L11 10.5 18.5 20") + p("M11 10.5l3 9.5") + sparkle(19, 5, 3), ["sparkles", "message-circle", "bot"]],
      zemljevid: [scrollMap((x, y) => p(`M${x - 2.6} ${y + 1.8}L${x} ${y - 2.4}L${x + 2.6} ${y + 1.8}z`)), ["map"]],
      // zvitek papirusa: dva zvitka in list med njima
      zvitek: [rect(3, 4, 4, 16, 2) + rect(17, 4, 4, 16, 2) + p("M7 5.5h10M7 18.5h10") + mk.lines(12, 12, 2.75), ["book-open"]],
      knjiznica: [lucide("library-big"), ["library"]],
      karte: [cards, ["layers"]],
      oko: [scanFrame + eye, ["scan-line", "scan-text"]],
      // množenje s podvajanjem (Rhindov papirus): vrstice z 1, 2 in 4 kamenčki, plus in črta vsote (brez okvirja, da ni kocka)
      podvajanje: [dot(5, 5, 1.6) + dot(5, 10, 1.6) + dot(9.5, 10, 1.6) + dot(5, 15, 1.6) + dot(9.5, 15, 1.6) + dot(14, 15, 1.6) + dot(18.5, 15, 1.6) + p("M3 19.5h18") + p("M16.5 4v6M13.5 7h6"), ["calculator"]],
      kolajna: [ribbonMedal((x, y) => p(`M${x - 2.6} ${y + 1.8}L${x} ${y - 2.4}L${x + 2.6} ${y + 1.8}z`)), ["medal"]],
      rozeta: [petals(12, 9.5, 6, 2.2, 7.5, 1.8) + c(12, 9.5, 2.2) + p("M9.5 16l-1.5 5 3-1.2M14.5 16l1.5 5-3-1.2"), ["award"]],
      // čaša v obliki lotosovega cveta na nogi
      kelih: [p("M5.5 3.5h13c0 5.5-2.9 9-6.5 9s-6.5-3.5-6.5-9z") + p("M9 4c.4 3.4 1.5 6.2 3 8.3M15 4c-.4 3.4-1.5 6.2-3 8.3", thin) + p("M12 12.5V18") + p("M8 21h8l-1.5-3h-5z"), ["trophy"]],
      // igralna deska s polji in dvema figurama
      deska: [rect(2.5, 7.5, 19, 9, 1.5) + p("M2.5 12h19M8.83 7.5v9M15.17 7.5v9") + dot(5.67, 9.75, 1.3) + dot(18.33, 14.25, 1.3), ["gamepad-2", "joystick"]],
      kocka: [lucide("dice-4"), ["dices"]],
      koledar: [calFrame((x, y) => p(`M${x - 2.6} ${y + 1.8}L${x} ${y - 2.4}L${x + 2.6} ${y + 1.8}z`)), ["calendar", "calendar-days", "calendar-clock"]],
      // tri piramide, vsaka višja (kot v Gizi, a naraščajoče)
      piramide: [p("M2.5 20l3-5.5 3 5.5M8.5 20L12 11l3.5 9M15.5 20l3-15 3 15") + p("M2 20h20"), ["chart-column"]],
      klas: [lucide("wheat"), ["trending-up"]],
      zobnik: [gear(12, 12, 9, 9.5, 7.2) + c(12, 12, 3), ["settings"]],
      // obraz z lasuljo do ramen
      portret: [p("M7 14V8.5a5 5 0 0 1 10 0V14z") + c(12, 9.4, 2.7) + p("M4.5 21c0-3.5 3-6 7.5-6s7.5 2.5 7.5 6"), ["user"]],
      zvezda: [star(12, 12, 5, [10, 4]), ["star"]],
      ogenj: [lucide("flame-kindling"), ["flame"]],
      // glinena oljenka (skodelica s plamenom)
      svetilka: [p("M3 13h18c-1 4.5-5 7-9 7s-8-2.5-9-7z") + p("M12 3c2 2.8 3 4.3 3 6a3 3 0 0 1-6 0c0-1.7 1-3.2 3-6z"), ["lightbulb"]],
      lok: [lucide("bow-arrow"), ["target"]],
      zastava: [lucide("flag-triangle-right"), ["flag"]],
      sigma: [onSurf("egipt", mk.sigma), ["sigma"]],
      puscica: [arrow, ["send"]],
      // stranice Keopsove piramide kažejo proti štirim smerem neba
      vetrovnica: [c(12, 12, 9.5) + star(12, 12, 4, [7.5, 2]), ["compass"]],
      kolo: [wheel(4, true), ["repeat"]],
      naloge: [onSurf("egipt", mk.check), ["clipboard-check", "list-checks"]],
      mnenje: [onSurf("egipt", mk.heart), ["message-square-heart"]],
      besedilo: [onSurf("egipt", mk.lines), ["file-text"]],
      edikt: [onSurf("egipt", (x, y) => p(`M${x - 4.5} ${y - 1.75}h3.5M${x + 1} ${y - 1.75}h3.5M${x - 4.5} ${y + 1.75}h3.5M${x + 1} ${y + 1.75}h3.5`)), ["newspaper"]],
      // trstno pero pisarja
      trst: [p("M3.5 20.5l1-4L16 5a2 2 0 0 1 3 3L7.5 19.5z") + p("M4.5 16.5l3 3M7 17l3.5-3.5"), ["pencil", "notebook-pen", "feather"]],
      labirint: [p("M4 4h16v16H4V8h12v8H8v-4h4"), ["puzzle"]],
      // dvorana s stebri (venec, trije stebri s kapiteli, podstavek)
      dvorana: [p("M3 3.5h18l-1.5 3h-15z") + p("M6.5 6.5v12.5M12 6.5v12.5M17.5 6.5v12.5") + p("M5 6.5l1.5 2 1.5-2M10.5 6.5l1.5 2 1.5-2M16 6.5l1.5 2 1.5-2", thin) + p("M3 20.5h18"), ["graduation-cap", "castle"]],
      skrinja: [chest, ["gift"]],
      bucka: [lucide("flask-round"), ["flask-conical"]],
      atomi: [atoms, ["atom"]],
      globus: [globe, ["globe"]],
      // vodna ura (klepsidra) je egipčanska
      klepsidra: [clepsydra, ["timer"]],
      // pisarjeva paleta: dve jamici za črnilo in reža za trstike
      paleta: [rect(2.5, 7.5, 19, 9, 2) + dot(6.5, 12, 1.6) + dot(10.5, 12, 1.6) + p("M14 12h4"), ["palette", "paintbrush", "grid-2x2"]],
      // sedemkraka (šestkraka bi pri 16 px lahko brala kot heksagram)
      utrinek: [star(12, 12, 7, [9.5, 4]) + dot(4, 4) + dot(20, 4) + dot(20, 20) + dot(4, 20), ["party-popper"]],
      // libela gradbenikov: A-okvir z grezilom
      libela: [p("M5 20.5L12 4l7 16.5") + p("M8.2 13h7.6") + p("M12 4v11", thin) + dot(12, 16.3, 1.5), ["ruler"]],
      lonec: [lucide("cooking-pot"), ["chef-hat"]],
      // ladja na Nilu s kvadratnim jadrom
      ladja: [p("M2 14h20c-1.5 3.5-5 5.5-10 5.5S3.5 17.5 2 14z") + p("M12 14V3") + p("M7 4h10l-1 7.5H8z"), ["car"]],
      riba: [lucide("fish"), ["paw-print"]],
      // hekat: košara za merjenje žita
      hekat: [p("M5 11h14l-1.5 9h-11z") + p("M6 11c1.2-3.5 3.5-5 6-5s4.8 1.5 6 5") + p("M5.8 15.5h12.4", thin), ["shopping-basket"]],
      grozdje: [lucide("grape"), ["cherry"]],
      vrc: [c(12, 15, 6) + p("M9.5 9.5V6h5v3.5") + p("M8.5 4h7"), ["droplet"]],
      zid: [lucide("brick-wall"), ["blocks"]],
    },
  };
  return S;
}

// Enoten vidni okvir: [povečava, premik x, premik y] za fit(); izmerjeno s črnilom (z debelino črte), cilj je
// največ 20 × 20 (črte znotraj 3–21) in optična sredina (pol okvir, pol težišče) na (12, 12).
// Ko se risba spremeni: node scripts/ikone-okvir.mjs (meri v brskalniku), nato node scripts/ikone-obdobij.js.
const OKVIR = {
  antik: { zemljevid: [1, -0.25], zvitek: [0.9, 0, -0.25], lovor: [0.95, 0, 1], kolajna: [0.95, 0, -0.5], amfora: [0.9], koledar: [1, 0, 0.25], stebri: [1, -0.5, -1.75], poganjek: [1, -0.25, -0.25], zobnik: [0.96], doprsje: [1, 0, -0.5], zvezda: [0.9], bakla: [0.9, 0, -0.25], oljenka: [0.96, -0.5, 0.75], zastava: [0.9, 0.5, 0.5], sigma: [1, 0, -0.5], puscica: [0.95, 0.5], vetrovnica: [0.95], kolo: [1, -0.25, 0.25], stela: [1, 0, -0.5], pisalo: [1, 0.25, -0.25], akademija: [0.9, 0, -0.25], posoda: [0.9, 0, -0.25], atomi: [1.1, 0, -0.75], globus: [1, -1.25], klepsidra: [1, 0, -0.25], maske: [0.9, -0.25, 0.25], sestilo: [1, 0.25], lonec: [0.9, 0, -0.25], ladjica: [0.9, 0.25, -0.5], zelva: [0.9, 0.25], kovanci: [0.9], grozdje: [0.9] },
  renesansa: { pero: [1, -0.5, -0.25], portolan: [1, -0.25], kodeks: [1, -0.5], lovor: [0.88, 0, 0.5], kolajna: [0.95, 0, -0.5], krona: [0.9, 0, -0.25], skakac: [0.9, 0.25, -0.5], arkade: [0.9, -0.5, -1.5], vzhod: [0.9, 0, -0.5], zobnik: [0.95], kameja: [0.9], zvezda: [0.9], bakla: [0.9, 0, -0.25], sveca: [0.97, 0, -0.25], tarca: [1, 0.75, -0.75], prapor: [1, 0, 1.5], sigma: [0.9], pismo: [0.9], vetrovnica: [0.9], orbita: [0.9], naloge: [0.9], mnenje: [0.9, 0, 0.25], besedilo: [0.9], univerza: [0.9, 0, -0.25], bucka: [0.9, 0, -0.25], armila: [1, 0, 0.25], globus: [1, -1.25], "pescena-ura": [0.9], paleta: [0.9, 0.25, 0.25], maske: [0.9, -0.25, 0.25], knjiznica: [1, 0.75], kotnik: [1, 1, -1], karte: [1, 0.25, -0.75], grad: [0.9, 0, -0.25], lonec: [0.9, 0, -0.25], ladja: [0.9], pes: [0.93, 0, 0.25], tehtnica: [0.9, 0, -0.25], jabolko: [0.9, 0, -0.25], kaplje: [0.95, 0, -0.75] },
  bagdad: { zemljevid: [1, -0.25, 0.25], kolajna: [0.95, 0, -0.5], rozeta: [0.97], krona: [0.9, 0, -0.25], trdnjava: [0.9, 0, -0.25], loki: [0.9, -0.5, -1.5], vzhod: [0.9, 0, -0.5], zobnik: [0.97], portret: [1, 0, -0.5], zvezda: [0.95], ogenj: [0.9, 0, -0.5], svecnik: [0.95, 0, -0.5], tarca: [1, 0.75, -0.75], zastava: [0.95, 0.5], sigma: [1, 0, -0.5], golob: [0.9, -0.25, -0.25], vetrovnica: [0.95], noria: [1, -0.25, 0.25], "pescena-ura": [0.9], naloge: [1, 0, -0.5], mnenje: [1, 0, -0.5], besedilo: [1, 0, -0.5], trstika: [1, 0.75, -0.75], girih: [0.97], vrata: [1, 0, -2], alembik: [0.95, 0.25, -1.5], armila: [1, 0, 0.25], globus: [1, -1.25], knjiznica: [1, 0.75], kvadrant: [1, 0.5, -0.5], karte: [1, 0.25, -0.75], lonec: [0.9, 0, -0.25], ladjica: [0.9, 0.25, -0.5], macka: [1, 0, 0.25], tehtnica: [0.9, 0, -0.25], granatno: [1, 0, -0.5], vodnjak: [1, 0, -2.25] },
  indija: { sunja: [1, -1.25, 0.25], zemljevid: [1, -0.25, 0.25], "palmovi-listi": [0.95, 0.25], knjiznica: [1, 0.75], karte: [1, 0.25, -0.75], kolajna: [0.95, 0, -0.5], rozeta: [0.95, 0, 0.5], krona: [0.9, 0, -0.25], kmet: [0.9, 0, -0.5], pasa: [0.9], stopnice: [1, -0.25, -1.5], poganjek: [1, -0.25, -0.25], zobnik: [0.9], portret: [1, 0, -1.25], zvezda: [0.9], ogenj: [0.9, 0, -0.5], dija: [1, 0, -0.25], zastava: [0.9, 0.5, 0.5], sigma: [1, 0, -0.25], puscica: [0.95, 0.5], roza: [0.95], orbita: [0.9], naloge: [1, 0, -0.25], mnenje: [1, 0, -0.25], besedilo: [1, 0, -0.25], edikt: [1, 0, -0.25], pisalo: [1, 0.25, -0.25], paviljon: [1, 0, -0.5], alembik: [0.95, 0.25, -1.5], atomi: [1.1, 0, -0.75], globus: [1, -1.25], klepsidra: [1, 0, -0.25], rangoli: [0.9], utrinek: [0.9], kotnik: [1, 1, -1], lonec: [0.9, 0, -0.25], ladja: [0.9], ptica: [0.9, -0.25, -0.25], kovanci: [0.9], mango: [0.96, -0.25, 0.5], vrc: [1, 0, -0.25] },
  egipt: { piramida: [0.9, -0.5, -0.5], zemljevid: [1, -0.25], knjiznica: [1, 0.75], karte: [1, 0.25, -0.75], podvajanje: [1, 0, -0.5], kolajna: [0.95, 0, -0.5], rozeta: [0.95, 0, 0.5], kelih: [1, 0, 0.25], deska: [0.95], piramide: [0.9, -0.5, -1.75], klas: [0.9], zobnik: [0.95], zvezda: [0.95, 0, 0.5], ogenj: [0.9, 0, -0.5], svetilka: [1, 0, -0.25], zastava: [0.9, 0.5, 0.5], sigma: [0.97, 0, 0.5], puscica: [0.95, 0.5], vetrovnica: [0.95], kolo: [1, -0.25, 0.25], naloge: [0.97, 0, 0.75], mnenje: [0.97, 0, 0.5], besedilo: [0.97, 0, 0.5], edikt: [0.97, 0, 0.5], trst: [1, 0.75, -0.75], dvorana: [1, 0, 0.25], bucka: [0.9, 0, -0.25], atomi: [1.1, 0, -0.75], globus: [1, -1.25], klepsidra: [1, 0, -0.25], paleta: [0.95], utrinek: [0.97, 0, 0.25], libela: [1, 0, -0.5], lonec: [0.9, 0, -0.25], ladja: [0.9, 0, 0.25], riba: [0.9, 0.25], hekat: [1.18, 0, -1.5], grozdje: [0.9], vrc: [1, 0, -0.25] },
};

export function sestavi(id) {
  const set = tabele()[id];
  if (!set) throw new Error(`ni ikon za slog ${id}`);
  const out = { map: {}, svg: {} };
  for (const [name, [svg, uses]] of Object.entries(set)) {
    const f = OKVIR[id]?.[name];
    out.svg[name] = f ? fit(svg, ...f) : svg;
    for (const u of uses) {
      if (out.map[u]) throw new Error(`${id}: ${u} dvakrat (${out.map[u]}, ${name})`);
      out.map[u] = name;
    }
  }
  out.map = Object.fromEntries(Object.entries(out.map).sort(([a], [b]) => a.localeCompare(b)));
  return JSON.stringify(out) + "\n";
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const check = process.argv.includes("--check");
  let bad = 0;
  for (const id of Object.keys(tabele())) {
    const file = path.join(PUB, "eras", id, "ikone.json");
    const json = sestavi(id);
    if (check) {
      const same = fs.existsSync(file) && fs.readFileSync(file, "utf8") === json;
      if (!same) bad++, console.log(`${id}: ikone.json ni enaka sestavljeni (node scripts/ikone-obdobij.js)`);
    } else {
      fs.writeFileSync(file, json);
      console.log(`${id}: ${Object.keys(JSON.parse(json).map).length} ikon, ${json.length} B`);
    }
  }
  process.exit(bad ? 1 : 0);
}
