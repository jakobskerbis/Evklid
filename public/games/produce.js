// Igre, v katerih učenec odgovor naredi sam, namesto da bi ga izbral (j 2026-11-01: »naj bodo igre bolj
// raznovrstne kot samo izbiranje pravilnih možnosti«; docs/igre-smernice.md §2.1 »Produce, don't pick«):
// - Številska premica (numline): kengurujka Pina skoči na mesto odgovora na številski premici.
// - Računanje na pamet (typed): odgovor vtipkaš s številčnico; pravilni odgovori zapored pospešijo vlak.
// Obe igri sta le za pojme, katerih odgovor je eno število (engine.fits, engine.accept). Pomožne funkcije
// zgoraj so čiste (brez DOM), da jih preverijo testi; DOM uporabljata samo motorja v create().
import { fmt, fr, statement, withNumberStyle } from "./topics.js";
import { clamp, INK, chap, circle, pill, face, sky } from "./fun.js";
import { icon } from "../icons.js";
import { FITS } from "./produce-fits.js";

const MINUS = "−";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// odgovor sredi prevedenega besedila osamljen (FSI … PDI), da »−3/4« v arabščini ne postane »3/4−«
const iso = (s) => `\u2068${s}\u2069`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// decimalni ločilnik trenutnega jezika (setNumberStyle v topics.js)
export const decSep = () => (fmt(1.5).includes(",") ? "," : ".");

// ---------- branje odgovora ----------
// Enota je ena beseda za presledkom (12 m/s, 4,5 kJ, 27 €) ali ° in % (tudi brez presledka); nikoli s števko
// (»7 ost. 1«, »3 · 10⁴«, »5 N v desno« niso eno število).
const UNIT = String.raw`(?:\s?%|\s?°[CF]?|\s[A-Za-zµμΩ€$£][^\s\d=]*)`;
let reDec = null, re = null;
function numRe() {
  const d = decSep();
  if (d !== reDec) {
    reDec = d;
    re = new RegExp(String.raw`^(?:([A-Za-zα-ωΑ-Ω][A-Za-z₀-₉′']*)\s?=\s?)?([−-])?([€$£])?(\d+)(?:${d === "," ? "," : "\\."}(\d+))?(?:\/(\d+))?(${UNIT})?$`, "u");
  }
  return re;
}
// Odgovor kot eno realno število: »−3/4«, »0,75«, »x = 4«, »12 m/s«, »45 %«, »30°«, »€20«. Vrne
// { v, n, d, kind: "int" | "dec" | "frac", places, pre: "x = ", unit: " m/s" } ali null.
// n/d je točna vrednost (ulomek), da primerjava ne trpi zaradi plavajoče vejice.
export function readNumber(a) {
  const m = numRe().exec(String(a ?? "").trim());
  if (!m) return null;
  const [, name, neg, cur, int, frac, den, unit] = m;
  // ulomek z decimalko in »−€60« (predznak pred valuto bi se izpisal kot »€−60«) nista za ti igri
  if ((frac != null && den != null) || (neg && cur)) return null;
  const s = neg ? -1 : 1;
  let n, d, kind, places = 0;
  if (den != null) {
    if (+den === 0 || int.length > 9 || den.length > 6) return null;
    [n, d, kind] = [s * +int, +den, "frac"];
  } else if (frac != null) {
    places = frac.length;
    if (places > 6 || int.length > 9) return null;
    [n, d, kind] = [s * +(int + frac), 10 ** places, "dec"];
  } else {
    if (int.length > 12) return null;
    [n, d, kind] = [s * +int, 1, "int"];
  }
  return { v: n / d, n, d, kind, places, pre: `${name ? `${name} = ` : ""}${cur || ""}`, unit: unit || "" };
}
const same = (a, b) => a.n * b.d === b.n * a.d;

// Naloga z izbiro (»Največje?«, »Kateri je delitelj …?«, »Višina vrat je približno?«): odgovor je ena od
// ponujenih možnosti, ki jih ti igri ne pokažeta, zato je tu ni.
const PICK_W = /\b(kater|which|približn|about|roughly|approx|najbolj|največj|kaj je največ|najmanj|najdalj|najkrajš|najtež|najlaž|najviš|najniž|most|least|largest|smallest|greatest|highest|lowest|praštevil|prime|sestavljen|composite|deljiv|divisible)/i;
export function isPick(q) {
  if (statement(q.q, q.a)[1] !== q.a) return false;
  return PICK_W.test(q.q) || q.q.trim().split(/\s+/).length <= 2;
}
// Odgovor v drugem številskem sestavu (»9₁₀ = ?₂« → 1001): koda iz števk, ne količina.
const codeBase = (q) => /\?\s*([₀-₉]+)/.exec(q.q)?.[1];
export const isCode = (q) => {
  const b = codeBase(q);
  return !!b && b !== "₁₀";
};
// napačni odgovori kot števila (z isto enoto); za strpnost premice in za »oblika šteje«
const wrongNums = (q, p) => (q.w || []).map(readNumber).filter((w) => w && w.unit.trim() === p.unit.trim() && w.pre === p.pre);

// ---------- ali pojem ustreza igri ----------
// Ponovljiv vzorec nalog: generatorji uporabljajo Math.random, ki ga za ta čas zamenja semenski generator
// (mulberry32), da je odločitev za vsak pojem vedno enaka (v testu, na portalu, v aplikaciji).
function seeded(seed, fn) {
  const r = Math.random;
  let s = seed >>> 0;
  Math.random = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    return fn();
  } finally {
    Math.random = r;
  }
}
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
export const FIT_SAMPLES = 8; // vzorčnih nalog na stopnjo
export const FIT_NEED = 6; // od teh mora ustrezati vsaj toliko (ostale igra med igro preskoči, engine.accept)
// Pojem ustreza, če na vsaki od treh stopenj ustreza vsaj FIT_NEED od FIT_SAMPLES vzorčnih nalog. Vzorec je
// vedno v slovenščini, da je izbira pojmov v vseh jezikih enaka; rezultat se zapomni. Portal bere vnaprej
// izračunan seznam (produce-fits.js, scripts/igre-pojmi.js); test preveri, da se ujema s tem izračunom.
function fitter(accept, salt) {
  const memo = new Map();
  const test = (c) => {
    for (let tier = 1; tier <= 3; tier++) {
      let bad = 0;
      for (let i = 0; i < FIT_SAMPLES; i++) {
        let ok = false;
        try {
          ok = accept(c.gen(tier));
        } catch {}
        if (!ok && ++bad > FIT_SAMPLES - FIT_NEED) return false;
      }
    }
    return true;
  };
  return (c) => {
    if (!memo.has(c.id)) memo.set(c.id, withNumberStyle("sl", () => seeded(hash(c.id + salt), () => test(c))));
    return memo.get(c.id);
  };
}

// ---------- številska premica ----------
export const LINE_MAX_DEN = 36; // gostejši ulomki (1/64) niso za premico na telefonu
// Naloga za premico: odgovor je eno število v mreži (ulomek do 36-in, decimalno do 6 mest), napačni
// odgovori se od njega razlikujejo po vrednosti (sicer naloga preverja zapis, ne mesta na premici).
export function lineTask(q) {
  if (!q || isPick(q) || isCode(q)) return null;
  const p = readNumber(q.a);
  if (!p || Math.abs(p.v) >= 1e7) return null;
  if (p.kind === "frac" && (p.d > LINE_MAX_DEN || gcd(p.n, p.d) !== 1)) return null;
  if (p.kind === "dec" && p.places > 6) return null;
  // napačni odgovor z isto vrednostjo (6/8 ob 3/4, 29 km/h ob 29 m/s): na premici bi bila na istem mestu
  for (const w of (q.w || []).map(readNumber)) if (w && Math.abs(w.v - p.v) < 1e-9) return null;
  return p;
}
// Dovoljen odmik v razdelkih po stopnjah (docs/igre-smernice.md §2.7). Razdelek premice je natanko natančnost
// odgovora in Pina med merjenjem kaže vrednost, zato bi odmik ±1 sprejel drugo število (3² = 8): vedno natanko.
const TOL = [0, 0, 0];
// Premica za nalogo: { lo, u (korak), cells, major (razdelkov med oznakami), at (razdelek odgovora), tol,
// labels: [[razdelek, besedilo]], frac (imenovalec ali 0), task }. Brez Math.random, če je podan rnd.
export function lineFor(q, tier = 1, rnd = Math.random) {
  const p = lineTask(q);
  if (!p) return null;
  const pickIn = (a) => a[Math.floor(rnd() * a.length)];
  let u, cells, major, lo, at;
  // naloga samo z ulomki (2/3 + 1/3): premica v delih iz naloge, tudi ko je odgovor celo število (1)
  let den = p.kind === "frac" ? p.d : 0;
  if (/\d\/\d/.test(q.q) && !/\d/.test(q.q.replace(/\d+\/\d+/g, "")) && (den || Math.abs(p.v) <= 3)) {
    const l = [...q.q.matchAll(/\d+\/(\d+)/g)].reduce((a, m) => (a * +m[1]) / gcd(a, +m[1]), den || 1);
    if (l > 1 && l <= LINE_MAX_DEN) den = l;
  }
  if (den) {
    // ulomki: celote z oznakami, vmes razdelki po 1/d (polovice in tretjine na daljši premici)
    const d = den, n = (p.n * d) / p.d, units = d <= 3 ? 2 + (tier > 1 ? 1 : 0) : d <= 6 ? 2 : 1;
    u = 1 / d;
    cells = units * d;
    major = d;
    const fl = Math.floor(n / d);
    const los = [];
    for (let k = 0; k < units; k++) if (p.v < 0 || fl - k >= 0) los.push(fl - k);
    // celo število (1) ne na robu premice, če gre
    const inner = los.filter((L) => n - L * d > 0 && n - L * d < units * d);
    const L = pickIn(inner.length ? inner : los);
    lo = L;
    at = n - L * d;
  } else {
    // cela in decimalna števila: korak 10^−mesta; celo število z ničlami na koncu (9600) ima večji korak, a vsaj
    // dve mesti (20 na premici po 1, ne po 10: tudi 19 in 21 imata svoj razdelek)
    let e = -p.places;
    if (p.kind === "int" && p.n !== 0) {
      const s = String(Math.abs(p.n)), tz = s.length - s.replace(/0+$/, "").length;
      e = Math.min(tz, Math.max(0, s.length - 2));
    }
    // tipična napaka, ki bi se ujela na razdelek odgovora (8,01 ≈ ? (0,1) → 8 ob 8,1; 1,2 km → 1200 ob 1201), dobi
    // svoj razdelek: korak se zmanjša, sicer bi skok na najbližji razdelek štel kot zadetek
    const near = wrongNums(q, p).filter((w) => w.kind !== "frac" && w.v !== p.v);
    while (e > -6 && near.some((w) => Math.abs(w.v - p.v) <= 10 ** e / 2 + 1e-12)) e--;
    const scale = 10 ** Math.max(0, -e); // v celih enotah koraka, brez napak plavajoče vejice
    const V = e < 0 ? p.n * (scale / p.d) : p.n / 10 ** e; // vrednost v korakih (celo število)
    cells = tier === 1 ? 10 : 20;
    major = 5;
    // začetek na večkratniku 5 korakov, odgovor vsaj en razdelek od roba; pri pozitivnem odgovoru brez negativnih
    const opts = [];
    for (let L = Math.floor((V - cells + 1) / major) * major; L <= V - 1; L += major) if (L + cells >= V + 1 && (V < 0 || L >= 0)) opts.push(L);
    if (!opts.length) opts.push(V < 0 ? Math.floor((V - 1) / major) * major : 0);
    const L = pickIn(opts);
    at = V - L;
    u = e < 0 ? 1 / scale : 10 ** e;
    lo = e < 0 ? L / scale : L * 10 ** e;
  }
  // strpnost (zdaj vedno 0, glej TOL); nikoli toliko, da bi sprejela tipično napako
  let tol = TOL[tier - 1] ?? 0;
  for (const w of wrongNums(q, p)) {
    const k = Math.abs(w.v - p.v) / u;
    if (k > 1e-9) tol = Math.min(tol, Math.max(0, Math.ceil(k - 1e-9) - 1));
  }
  const L = { lo, u, cells, major, at, tol, frac: den, task: p, labels: [] };
  for (let k = 0; k <= cells; k += major) L.labels.push([k, lineValueText(L, k, false)]);
  return L;
}
// Vrednost na razdelku k kot besedilo (ulomek na ulomkovi premici); full: s predpono in enoto (»x = 4«, »12 m/s«).
export function lineValueText(L, k, full = true) {
  let s;
  if (L.frac) s = fr(Math.round(L.lo * L.frac) + k, L.frac);
  else s = fmt(L.lo + k * L.u);
  return full ? `${L.task.pre}${s}${L.task.unit}` : s;
}
// Razlika med razdelkoma kot besedilo (»1/4«, »0,05«, »20 m/s«).
export function lineDiffText(L, k) {
  const s = L.frac ? fr(Math.abs(k), L.frac) : fmt(Math.abs(k) * L.u);
  return `${s}${L.task.unit}`;
}
export const lineHit = (L, k) => Math.abs(k - L.at) <= L.tol;

// ---------- računanje na pamet ----------
// Naloga za tipkanje: odgovor je eno število (ali koda iz števk, npr. dvojiško), ne naloga z izbiro.
export function typedTask(q) {
  if (!q || isPick(q)) return null;
  if (isCode(q)) return /^[0-9A-F]{1,16}$/.test(q.a) ? { code: q.a, pre: "", unit: "", kind: "code" } : null;
  return readNumber(q.a);
}
// Kar je učenec vtipkal: »−3/4«, »0,5«, »,5«, »2.« → { n, d, kind, frac } ali null.
export function readTyped(s) {
  const m = /^([−-])?(\d*)(?:[,.](\d*))?(?:\/(\d+))?$/.exec(String(s).trim());
  if (!m) return null;
  const [, neg, int = "", dec, den] = m;
  if (!int && !dec) return null;
  if (den != null && (dec != null || !int || +den === 0)) return null;
  const sg = neg ? -1 : 1;
  if (den != null) return { n: sg * +int, d: +den, kind: "frac" };
  const places = (dec || "").length;
  return { n: sg * +((int || "0") + (dec || "")), d: 10 ** places, kind: places ? "dec" : "int" };
}
const hasDecimal = (s) => /\d[,.]\d/.test(s);
const fracsIn = (s) => [...s.replace(/−/g, "-").matchAll(/(-?\d+)\/(\d+)/g)].map((m) => ({ n: +m[1], d: +m[2] }));
const decsIn = (s) => [...s.replace(/−/g, "-").matchAll(/(-?\d+)[,.](\d+)/g)].map((m) => ({ n: +(m[1] + m[2]), d: 10 ** m[2].length }));
// Preveri vtipkani odgovor. Enakovredni zapisi štejejo (0,5 = 1/2 = ,5; 4 = 4,0), razen kadar naloga
// preverja prav zapis: ulomek mora biti okrajšan (»reduce«), pretvorba med ulomkom in decimalnim številom
// zahteva drugo obliko (»asFrac«, »asDec«). Vrne "ok" | "no" | "reduce" | "asFrac" | "asDec".
export function checkTyped(input, q) {
  const task = typedTask(q);
  const s = String(input).trim();
  if (!task || !s) return "no";
  if (task.kind === "code") return s.replace(/^0+(?=.)/, "") === task.code.replace(/^0+(?=.)/, "") ? "ok" : "no";
  const x = readTyped(s);
  if (!x) return "no";
  if (!same(x, task)) return "no";
  // isti zapis kot rešitev (tudi neokrajšan, če ga ima rešitev sama)
  const canon = q.a.replace(task.unit, "").replace(task.pre, "").trim().replace(/-/g, MINUS);
  const plain = s.replace(/-/g, MINUS).replace(/[,.]/, decSep()).replace(/^(−?)[,.]/, (_, m) => `${m}0${decSep()}`);
  if (plain === canon) return "ok";
  // zapis, ki ga naloga preverja: v nalogi je isto število v drugi obliki ali napačni odgovor z isto vrednostjo
  const twin = [...fracsIn(q.q), ...decsIn(q.q)].some((y) => same(y, task)) || wrongNums(q, task).some((w) => same(w, task));
  if (x.kind === "frac") {
    if (x.d === 1 || gcd(x.n, x.d) !== 1) return "reduce";
    if (task.kind === "frac") return "ok";
    return twin || fracsIn(q.q).length ? "asDec" : "ok";
  }
  if (task.kind === "frac") return twin || hasDecimal(q.q) ? "asFrac" : "ok";
  return "ok";
}
// Tipke številčnice za pojem: minus, vejica in ulomkova črta le, če jih kakšna naloga pojma potrebuje
// (ne po posamezni nalogi, da tipkovnica ne izda oblike odgovora).
export function padKeys(tasks) {
  const k = { neg: false, dec: false, frac: false };
  for (const t of tasks) {
    if (!t || t.kind === "code") continue;
    if (t.n < 0) k.neg = true;
    if (t.kind === "dec") k.dec = true;
    if (t.kind === "frac") k.frac = k.dec = true; // ulomek lahko zapiše tudi kot decimalno število
  }
  return k;
}

export const fitNow = {
  numline: fitter((q) => !!lineTask(q), ":line"),
  typed: fitter((q) => !!typedTask(q), ":typed"),
};
const fitList = (id) => {
  const set = new Set(FITS[id] || []);
  return (c) => set.has(c.id);
};

// ---------- risbe ----------
// Kengurujka Pina s torbico (paket) – izvirni lik; x, y = noge na premici.
function pina(g, x, y, r, mood, squash = 0, parcel = true) {
  g.save();
  g.translate(x, y);
  g.scale(1 + squash * 0.18, 1 - squash * 0.22);
  const body = "#f59e0b", belly = "#fde68a";
  // rep
  g.beginPath();
  g.moveTo(-r * 0.4, -r * 0.35);
  g.quadraticCurveTo(-r * 1.5, -r * 0.1, -r * 1.35, r * 0.02);
  g.lineWidth = r * 0.28;
  g.strokeStyle = INK;
  g.lineCap = "round";
  g.stroke();
  g.lineWidth = r * 0.16;
  g.strokeStyle = body;
  g.stroke();
  // noge
  for (const s of [-1, 1]) {
    g.beginPath();
    g.ellipse(s * r * 0.32, -r * 0.08, r * 0.38, r * 0.14, 0, 0, Math.PI * 2);
    g.fillStyle = body;
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = INK;
    g.stroke();
  }
  // telo in trebuh s torbico
  g.beginPath();
  g.ellipse(0, -r * 0.9, r * 0.62, r * 0.82, 0, 0, Math.PI * 2);
  g.fillStyle = body;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  g.beginPath();
  g.ellipse(r * 0.05, -r * 0.72, r * 0.38, r * 0.5, 0, 0, Math.PI * 2);
  g.fillStyle = belly;
  g.fill();
  if (parcel) {
    g.fillStyle = "#b45309";
    g.fillRect(-r * 0.2, -r * 0.92, r * 0.44, r * 0.32);
    g.strokeStyle = INK;
    g.lineWidth = 2;
    g.strokeRect(-r * 0.2, -r * 0.92, r * 0.44, r * 0.32);
    g.beginPath();
    g.moveTo(r * 0.02, -r * 0.92);
    g.lineTo(r * 0.02, -r * 0.6);
    g.strokeStyle = "#fde68a";
    g.stroke();
  }
  g.beginPath();
  g.moveTo(-r * 0.34, -r * 0.55);
  g.quadraticCurveTo(r * 0.05, -r * 0.38, r * 0.42, -r * 0.55);
  g.lineWidth = 2.5;
  g.strokeStyle = INK;
  g.stroke();
  // glava z ušesi
  for (const s of [-1, 1]) {
    g.beginPath();
    g.ellipse(s * r * 0.26, -r * 2.25, r * 0.15, r * 0.36, s * 0.25, 0, Math.PI * 2);
    g.fillStyle = body;
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = INK;
    g.stroke();
  }
  circle(g, 0, -r * 1.78, r * 0.5, body, 3);
  circle(g, 0, -r * 1.58, r * 0.2, belly, 0);
  face(g, 0, -r * 1.78, r * 0.5, mood);
  g.restore();
}
// Nabiralnik na pravem mestu (po odgovoru): pokaže, kam spada odgovor.
function mailbox(g, x, y, r, open) {
  g.fillStyle = "#475569";
  g.fillRect(x - 3, y - r * 1.5, 6, r * 1.5);
  g.lineWidth = 2;
  g.strokeStyle = INK;
  g.strokeRect(x - 3, y - r * 1.5, 6, r * 1.5);
  const w = r * 1.2, h = r * 0.8, top = y - r * 1.5 - h;
  g.beginPath();
  g.moveTo(x - w / 2, top + h);
  g.lineTo(x - w / 2, top + h * 0.4);
  g.arc(x, top + h * 0.4, w / 2, Math.PI, 0);
  g.lineTo(x + w / 2, top + h);
  g.closePath();
  g.fillStyle = "#22c55e";
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  // zastavica
  g.fillStyle = open ? "#ef4444" : "#94a3b8";
  g.fillRect(x + w / 2 - 2, top - (open ? r * 0.5 : 0), 5, r * 0.5);
  g.strokeRect(x + w / 2 - 2, top - (open ? r * 0.5 : 0), 5, r * 0.5);
}

// Naloga na tabli: račun v eni vrstici (pomanjša se), besedilna naloga v več vrsticah, da ostane berljiva.
function boardText(G, text, cx, cy, maxW, maxH, size, opts) {
  if (!/\p{L}{3}/u.test(text)) return G.fit(text, cx, cy, maxW, size, { ...opts, min: 12 });
  // znak ali enota brez črk in številk (€, %, »,«) ostane ob prejšnji besedi
  const words = text.split(/\s+/).reduce((a, w) => (a.length && !/[\p{L}\p{N}]/u.test(w) ? (a[a.length - 1] += ` ${w}`) : a.push(w), a), []);
  for (let s = Math.round(size); ; s--) {
    const lines = [];
    for (const w of words) {
      const last = lines[lines.length - 1];
      if (last && G.tw(`${last} ${w}`, s, opts.weight) <= maxW) lines[lines.length - 1] = `${last} ${w}`;
      else lines.push(w);
    }
    if (lines.length * s * 1.18 <= maxH || s <= 12) {
      lines.forEach((ln, i) => G.fit(ln, cx, cy + (i - (lines.length - 1) / 2) * s * 1.18, maxW, s, { ...opts, min: 10 }));
      return s;
    }
  }
}

// Gumb s tipko za G.ui (core.js): velik cilj za prst, aria-label, brez kraje fokusa platnu ob tapu.
function keyBtn(k, html, label, cls = "") {
  return `<button type="button" class="gm-key ${cls}" data-k="${esc(k)}"${label ? ` aria-label="${esc(label)}"` : ""}>${html}</button>`;
}
// Tipke v G.ui: tap sproži eng.key, držanje ponavlja (premikanje po premici).
function wireKeys(G, eng, repeat = []) {
  let hold = null;
  const live = () => G.running && !G.paused && !G.over;
  G.ui.addEventListener("mousedown", (e) => e.target.closest(".gm-key") && e.preventDefault());
  G.ui.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".gm-key");
    if (!b || !live()) return;
    if (repeat.includes(b.dataset.k)) {
      e.preventDefault();
      hold = { k: b.dataset.k, t: 0.38 };
      eng.key(b.dataset.k, true);
    }
  });
  const stop = () => (hold = null);
  for (const ev of ["pointerup", "pointercancel", "pointerleave"]) G.ui.addEventListener(ev, stop);
  G.ui.addEventListener("click", (e) => {
    const b = e.target.closest(".gm-key");
    if (!b || !live()) return;
    // tap z miško ali prstom je že obdelan ob pointerdown (ponavljajoče tipke); tipkovnica (Enter na gumbu) tu
    if (repeat.includes(b.dataset.k) && e.detail > 0) return;
    eng.key(b.dataset.k, true);
  });
  return (dt) => {
    if (!hold || !live()) return;
    hold.t -= dt;
    if (hold.t <= 0) {
      hold.t = 0.07;
      eng.key(hold.k, true);
    }
  };
}

// ============ ŠTEVILSKA PREMICA: Pina skoči na mesto odgovora ============
export const numline = {
  id: "numline",
  added: "2026-11-04", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Številska ulica", "Kengurujka Pina raznaša pakete. Na Številski ulici ima vsaka hiša točno svoje mesto."], ["Gneča na ulici", "Paketov je vedno več. Pina skoči naravnost tja, kamor spada odgovor."], ["Večerna dostava", "Sonce zahaja. Pina mora skočiti še natančneje."], ["Zadnji paket", "Še nekaj skokov in vsi na ulici dobijo svoje pakete!"]],
    en: [["Number Street", "Pina the kangaroo delivers parcels. On Number Street every house has its exact place."], ["Busy street", "There are more and more parcels. Pina jumps straight to where the answer belongs."], ["Evening round", "The sun is setting. Pina has to jump even more precisely."], ["The last parcel", "A few more jumps and everyone on the street gets their parcel!"]],
  },
  icon: "ruler-dimension-line",
  colors: ["#9a3412", "#f59e0b"],
  options: 4,
  ui: true,
  // čas za razmislek, ne za refleks (mirna igra); brez časa se igra brez odgovorov ne bi končala
  timer: (G) => [40, 45, 50][G.tier - 1] || 45,
  fits: fitList("numline"),
  accept: (q) => !!lineTask(q),
  create(G) {
    let L = null, cur = 0, phase = "aim", jump = 0, landed = false, hit = false, answered = false, shownAt = -1, mood = 0, x0 = 30, x1 = 270, lineY = 200, r = 22, sparks = [];
    let tick = () => {};
    const t = G.t;
    G.ui.innerHTML = `<div class="gm-nl">${keyBtn("ArrowLeft", icon("arrow-left"), t("games.e.numline.less"))}${keyBtn("Enter", `${icon("check")}<span>${esc(t("games.confirm"))}</span>`, "", "gm-key-ok")}${keyBtn("ArrowRight", icon("arrow-right"), t("games.e.numline.more"))}</div><span class="sr-only" aria-live="polite"></span>`;
    const said = G.ui.querySelector("[aria-live]");
    const cellX = (k) => x0 + (k / L.cells) * (x1 - x0);
    const say = () => L && (said.textContent = `${t("games.yourAnswer")}: ${lineValueText(L, cur)}`);
    const move = (k) => {
      if (!L || phase !== "aim" || G.waiting) return;
      const n = clamp(Math.round(k), 0, L.cells);
      if (n !== cur) {
        cur = n;
        say();
      }
    };
    const confirm = () => {
      if (!L || phase !== "aim" || G.waiting) return;
      G.stopTimer();
      phase = "jump";
      jump = 0;
      G.sound("pop");
    };
    // odgovor po skoku: mesto, kamor spada odgovor, ostane vidno; ob napaki še oklepaj z razliko
    const land = () => {
      phase = "done";
      answered = true;
      hit = lineHit(L, cur);
      shownAt = L.at;
      mood = hit ? 1 : -1;
      const v = L.task, ans = G.q.a;
      const dx = cur - L.at;
      // ulomek s kratkim decimalnim zapisom: povezava predstavitev (3/4 = 0,75)
      const fracDec = v.kind === "frac" && 10000 % v.d === 0 ? ` = ${fmt(v.v)}` : "";
      if (hit) {
        G.answer(true, cellX(cur), lineY - r * 2.4, { note: `${ans}${fracDec}`, delay: 1.1 });
        if (!G.reduced) for (let i = 0; i < 10; i++) sparks.push({ x: cellX(L.at), y: lineY - r * 3.2, vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 160, life: 0.8 });
      } else {
        const off = t(dx < 0 ? "games.e.numline.low" : "games.e.numline.high", { d: iso(lineDiffText(L, dx)) });
        G.answer(false, cellX(cur), lineY - r * 2.4, { note: `${t("games.correctWas", { a: iso(`${ans}${fracDec}`) })} · ${off}`, delay: 2.8 });
      }
    };
    const eng = {
      peek: () => ({ L, cur }), // za teste
      resize() {
        x0 = clamp(G.W * 0.08, 24, 64);
        x1 = G.W - x0 - 10;
        // visok telefon: premica niže (pod njo ostane prostor za oznake in oklepaj razlike), da ni praznega travnika
        lineY = Math.round(G.H > G.W * 1.25 ? G.H - clamp(G.H * 0.2, 110, 170) : clamp(G.H * 0.62, 200, G.H - 90));
        r = clamp(G.H > G.W * 1.25 ? G.W * 0.085 : Math.min(G.W * 0.075, G.H * 0.06), 16, 36);
      },
      reset() {
        L = null;
        phase = "aim";
        sparks = [];
        said.textContent = "";
      },
      question(q) {
        L = lineFor(q, G.tier);
        phase = "aim";
        shownAt = -1;
        mood = 0;
        landed = false;
        answered = false;
        hit = false;
        if (!L) return "";
        // začetek naključno, a ne v strpnosti odgovora (ne da bi Pina že stala na pravem mestu)
        const far = [];
        for (let k = 0; k <= L.cells; k++) if (Math.abs(k - L.at) > L.tol + 1) far.push(k);
        cur = far.length ? far[Math.floor(Math.random() * far.length)] : 0;
        say();
        return `${lineValueText(L, 0)} … ${lineValueText(L, L.cells)}.`;
      },
      timeout() {
        if (!L) return {};
        phase = "done";
        shownAt = L.at;
        mood = -1;
        return { note: t("games.correctWas", { a: iso(G.q.a) }), delay: 2.4 };
      },
      update(dt) {
        tick(dt);
        if (phase === "jump") {
          jump += dt / (G.reduced ? 0.05 : 0.5);
          if (jump >= 1 && !landed) {
            landed = true;
            land();
          }
        }
        for (const s of sparks) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vy += 300 * dt;
          s.life -= dt;
        }
        sparks = sparks.filter((s) => s.life > 0);
      },
      pointer(type, p, pressed) {
        if (!L || type === "up" || (type === "move" && !pressed)) return;
        move(((p.x - x0) / (x1 - x0)) * L.cells);
      },
      key(k, down) {
        if (!down) return ["ArrowLeft", "ArrowRight", "Enter", " "].includes(k);
        if (!L) return false;
        const big = Math.max(1, L.major);
        if (k === "ArrowLeft" || k === "ArrowDown") move(cur - 1);
        else if (k === "ArrowRight" || k === "ArrowUp") move(cur + 1);
        else if (k === "PageDown") move(cur - big);
        else if (k === "PageUp") move(cur + big);
        else if (k === "Home") move(0);
        else if (k === "End") move(L.cells);
        else if (k === "Enter" || k === " ") confirm();
        else return false;
        return true;
      },
      draw(g) {
        const [top, bot, hill, ground] = chap(G, [["#7dd3fc", "#e0f2fe", "#86efac", "#4ade80"], ["#fda4af", "#fef3c7", "#a3e635", "#65a30d"], ["#c084fc", "#fed7aa", "#fb923c", "#c2410c"], ["#1e3a8a", "#6366f1", "#334155", "#1e293b"]]);
        sky(G, g, top, bot);
        // sonce in oblaki (mirno ozadje, ne tekmuje s premico)
        circle(g, G.W * 0.85, G.H * 0.36, Math.min(G.W, G.H) * 0.07, G.chapter >= 4 ? "#f8fafc" : "#fde68a", 0);
        g.fillStyle = "rgba(255,255,255,0.75)";
        for (const [cx, cy, s] of [[0.18, 0.4, 1], [0.6, 0.3, 0.8]]) {
          const X = G.W * cx, Y = G.H * cy, R = Math.min(G.W, G.H) * 0.05 * s;
          g.beginPath();
          g.arc(X, Y, R, 0, Math.PI * 2);
          g.arc(X + R * 1.1, Y + R * 0.2, R * 0.8, 0, Math.PI * 2);
          g.arc(X - R * 1.1, Y + R * 0.25, R * 0.7, 0, Math.PI * 2);
          g.fill();
        }
        // daljni hribi
        g.fillStyle = hill;
        g.beginPath();
        g.moveTo(-20, lineY);
        for (let x = -20; x <= G.W + 20; x += 20) g.lineTo(x, lineY - 26 - Math.sin(x / 70) * 16 - Math.sin(x / 31) * 6);
        g.lineTo(G.W + 20, lineY);
        g.fill();
        g.fillStyle = ground;
        g.fillRect(-20, lineY, G.W + 40, G.H - lineY + 20);
        if (!L) return;
        // naslov paketa: naloga (kam spada odgovor), velika, da je pogled na prizoru
        // tabla z nalogo: na visokem telefonu višja, a vedno nad Pinino oznako
        const bw = Math.min(G.W - 24, 520), by = clamp(G.H * 0.04, 8, 24), bh = clamp(Math.min(G.H * (G.H > G.W * 1.25 ? 0.24 : 0.17), lineY - r * 2.6 - 80 - by), 56, 160);
        G.rr((G.W - bw) / 2, by, bw, bh, 14);
        g.fillStyle = "#fef3c7";
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.fillStyle = "#b45309";
        g.fillRect((G.W - bw) / 2 + 3, by + bh * 0.42, 14, bh * 0.16);
        g.fillRect((G.W + bw) / 2 - 17, by + bh * 0.42, 14, bh * 0.16);
        boardText(G, G.q?.q || "", G.W / 2, by + bh / 2 + 1, bw - 44, bh - 14, clamp(bh * 0.42, 18, 40), { color: INK, weight: 900 });
        const ink = G.chapter >= 4 ? "#f8fafc" : INK;
        // premica s puščico na pozitivni strani
        g.lineCap = "round";
        g.strokeStyle = INK;
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(x0 - 14, lineY);
        g.lineTo(x1 + 12, lineY);
        g.stroke();
        g.fillStyle = INK;
        g.beginPath();
        g.moveTo(x1 + 22, lineY);
        g.lineTo(x1 + 8, lineY - 8);
        g.lineTo(x1 + 8, lineY + 8);
        g.closePath();
        g.fill();
        // razdelki: oznake večje, ničla največja
        const zeroK = L.frac ? -Math.round(L.lo * L.frac) : Math.round(-L.lo / L.u);
        for (let k = 0; k <= L.cells; k++) {
          const x = cellX(k), lab = k % L.major === 0, zero = k === zeroK;
          const h = zero ? 15 : lab ? 11 : L.frac && L.frac % 2 === 0 && k % (L.frac / 2) === 0 ? 8 : 6;
          g.lineWidth = zero ? 4 : lab ? 3 : 2;
          g.beginPath();
          g.moveTo(x, lineY - h);
          g.lineTo(x, lineY + h);
          g.stroke();
        }
        const ls = clamp(Math.min(G.W / (L.labels.length * 3.2), 22), 13, 22);
        const gap = (x1 - x0) / Math.max(1, L.labels.length - 1);
        // enota (€, cm) ob zadnji oznaki; oznaka se umakne od roba, da je ne odreže (prej je enota prekrila številko)
        const unit = L.task.unit.trim(), kEnd = Math.max(...L.labels.map(([k]) => k));
        for (const [k, txt] of L.labels) {
          const s = k === kEnd && unit && unit !== "%" && unit !== "°" ? `${txt} ${unit}` : txt;
          // zadnja sme seči levo do polovice razmika in desno do roba
          const room = (gap - 4) / 2 + G.W - 6 - cellX(k), w = k === kEnd ? Math.min(G.tw(s, ls, 900), room) : gap - 4;
          const x = k === kEnd ? Math.min(cellX(k), G.W - 6 - w / 2) : cellX(k);
          G.fit(s, x, lineY + 18 + ls * 0.6, w, ls, { color: ink === INK ? INK : "#f8fafc", weight: 900, stroke: ink === INK ? "rgba(255,255,255,0.85)" : INK, sw: 4 });
        }
        // pravo mesto po odgovoru: nabiralnik z odgovorom
        if (shownAt >= 0) {
          const vx = cellX(shownAt);
          mailbox(g, vx, lineY - 4, r, hit);
            pill(G, g, G.q.a, vx, lineY - 22 - r * 2.9, G.W * 0.46, 30, "#bbf7d0", 18);
          // napaka ima velikost in smer: črtkan oklepaj med skokom in pravim mestom
          if (answered && !hit && cur !== shownAt) {
            const ax = cellX(cur), y = lineY + 18 + ls * 1.5;
            g.setLineDash([6, 5]);
            g.lineWidth = 3;
            g.strokeStyle = "#dc2626";
            g.beginPath();
            g.moveTo(ax, y - 8);
            g.lineTo(ax, y);
            g.lineTo(vx, y);
            g.lineTo(vx, y - 8);
            g.stroke();
            g.setLineDash([]);
            const d = cur - shownAt;
            G.fit(`${d > 0 ? "+" : MINUS}${lineDiffText(L, d)}`, (ax + vx) / 2, y + 16, Math.max(70, Math.abs(ax - vx)), 18, { color: "#dc2626", weight: 900, stroke: "#fff", sw: 4 });
          }
        }
        // Pina z vrednostjo nad glavo (pri skoku poskoči; ob prihodu paket ostane v nabiralniku)
        const px = cellX(cur);
        const up = phase === "jump" ? Math.sin(Math.PI * Math.min(1, jump)) * r * 2.2 : 0;
        const sq = phase === "jump" && jump < 0.15 ? 1 - jump / 0.15 : 0;
        if (phase === "aim") {
          // vodilo: navpična črtkana črta od Pine do premice
          g.setLineDash([4, 4]);
          g.lineWidth = 2;
          g.strokeStyle = "rgba(27,27,47,0.5)";
          g.beginPath();
          g.moveTo(px, lineY - 16);
          g.lineTo(px, lineY + 16);
          g.stroke();
          g.setLineDash([]);
        }
        pina(g, px, lineY - 6 - up, r, mood, sq, !(phase === "done" && hit));
        // Vrednost pod Pino med premikanjem le na 1. ravni; višje mora učenec mesto oceniti sam (vidi jo po odgovoru).
        if (!hit && (answered || G.tier < 2)) pill(G, g, lineValueText(L, cur), px, lineY - 28 - r * 2.6 - up - (shownAt >= 0 && Math.abs(px - cellX(shownAt)) < 90 ? 36 : 0), G.W * 0.5, 30, answered ? "#fecaca" : "#fff", 18);
        for (const s of sparks) {
          g.globalAlpha = Math.max(0, s.life);
          g.fillStyle = "#facc15";
          g.fillRect(s.x - 3, s.y - 3, 6, 6);
        }
        g.globalAlpha = 1;
      },
    };
    tick = wireKeys(G, eng, ["ArrowLeft", "ArrowRight"]);
    return eng;
  },
};

// ============ RAČUNANJE NA PAMET: vtipkaj odgovor, vlak pospešuje ============
export const typed = {
  id: "typed",
  added: "2026-11-04", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Jutranji vlak", "Strojevodkinja Mila vozi vlak Hop. Signal se odpre samo za pravilen račun."], ["Skozi predor", "V temnem predoru Mila računa na pamet, brez svinčnika."], ["Čez viadukt", "Pravilni odgovori zapored vlak pospešijo. Hop drvi čez dolino."], ["Do morja", "Še nekaj postaj in vlak Hop pripelje do morja!"]],
    en: [["Morning train", "Mila drives the train Hop. The signal only opens for a correct answer."], ["Through the tunnel", "In the dark tunnel Mila works it out in her head, no pencil."], ["Over the viaduct", "Correct answers in a row speed the train up. Hop races across the valley."], ["To the sea", "A few more stations and the train Hop reaches the sea!"]],
  },
  icon: "train-front",
  colors: ["#134e4a", "#14b8a6"],
  options: 4,
  ui: true,
  // blag časovni pritisk: več časa za težje naloge, niz pravilnih ga počasi skrajša
  timer: (G) => Math.max(12, ([26, 32, 40][G.tier - 1] || 30) - G.streak * 1.2),
  fits: fitList("typed"),
  accept: (q) => !!typedTask(q),
  create(G) {
    let task = null, buf = "", keys = null, flash = 0, flashOk = false, nudge = "", nudgeT = 0, caret = 0, reveal = "";
    let speed = 30, dist = 0, wagons = 0, puffs = [], signal = 0;
    const t = G.t;
    const dec = () => decSep();
    const said = () => G.ui.querySelector("[aria-live]");
    const render = () => {
      const k = keys || { neg: true, dec: true, frac: true };
      const extra = [["Backspace", icon("delete"), t("games.e.typed.erase"), "gm-key-del"], k.neg && ["-", MINUS, t("games.e.typed.neg"), "gm-key-op"], k.frac && ["/", "/", t("games.e.typed.slash"), "gm-key-op"]].filter(Boolean);
      const digit = (d) => keyBtn(d, d, "");
      // četrti stolpec: brisanje, minus, ulomkova črta; brisanje se raztegne čez vrstice, če kakšne tipke ni
      let h = "", row = 0;
      const at = extra.map((x, i) => {
        const span = i === 0 ? 4 - extra.length : 1, r0 = row;
        row += span;
        return [r0, keyBtn(x[0], x[1], x[2], `${x[3]}${span > 1 ? ` gm-span${span}` : ""}`)];
      });
      [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"]].forEach((ds, r) => (h += ds.map(digit).join("") + at.filter(([r0]) => r0 === r).map(([, b]) => b).join("")));
      h += k.dec ? keyBtn(dec(), dec(), t("games.e.typed.comma"), "gm-key-op") + digit("0") : keyBtn("0", "0", "", "gm-wide");
      h += keyBtn("Enter", "OK", t("games.confirm"), "gm-key-ok gm-wide");
      G.ui.innerHTML = `<div class="gm-pad">${h}</div><span class="sr-only" aria-live="polite"></span>`;
    };
    const show = () => {
      const el = said();
      if (el) el.textContent = `${t("games.yourAnswer")}: ${buf || "…"}`;
    };
    const type = (k) => {
      if (!task || G.waiting) return false;
      const parts = buf.split("/");
      const last = parts[parts.length - 1];
      if (/^[0-9]$/.test(k)) {
        if (buf.replace(/\D/g, "").length < 12) buf += k;
      } else if (k === "-" || k === MINUS) buf = buf.startsWith(MINUS) ? buf.slice(1) : MINUS + buf;
      else if (k === "," || k === "." || k === "Decimal") {
        if (parts.length === 1 && !/[,.]/.test(last)) buf += dec();
      } else if (k === "/") {
        if (parts.length === 1 && /\d$/.test(buf) && !/[,.]/.test(buf)) buf += "/";
      } else if (k === "Backspace" || k === "Delete") buf = buf.slice(0, -1);
      else if (k === "Enter" || k === "=") submit();
      else return false;
      nudge = "";
      caret = 0;
      show();
      return true;
    };
    const submit = () => {
      if (!/\d/.test(buf) || G.waiting) return;
      const res = checkTyped(buf, G.q);
      if (res === "reduce" || res === "asFrac" || res === "asDec") {
        // skoraj: vrednost je prava, zapis ne; brez kazni, le namig
        nudge = t(`games.e.typed.${res}`);
        nudgeT = 2.5;
        G.hint?.(nudge);
        G.sound("pop");
        return;
      }
      const ok = res === "ok";
      flash = 1;
      flashOk = ok;
      const shown = `${task.pre}${buf}${task.unit}`;
      if (ok) {
        signal = 1;
        wagons = Math.min(5, wagons + 1);
        // drugačen, a enakovreden zapis: pokaži oba (0,5 = 1/2)
        const note = shown.replace(/-/g, MINUS) === G.q.a ? G.q.a : `${shown} = ${G.q.a}`;
        G.answer(true, G.W / 2, G.H * 0.3, { note, delay: 0.7 });
      } else {
        wagons = 0;
        speed = 30;
        reveal = G.q.a;
        G.answer(false, G.W / 2, G.H * 0.3, { delay: 2.4 });
      }
    };
    const eng = {
      reset() {
        task = null;
        buf = "";
        wagons = 0;
        speed = 30;
        puffs = [];
        show();
      },
      question(q) {
        task = typedTask(q);
        // redka naloga, ki potrebuje tipko, ki je vzorec ni pokazal (decimalna vejica, minus): tipka se doda,
        // sicer naloge na telefonu ne bi mogel rešiti
        const need = padKeys([task]);
        if (keys && Object.keys(need).some((k) => need[k] && !keys[k])) {
          for (const k in need) keys[k] = keys[k] || need[k];
          render();
        }
        buf = "";
        reveal = "";
        nudge = "";
        flash = 0;
        signal = 0;
        show();
        return "";
      },
      timeout() {
        wagons = 0;
        speed = 30;
        reveal = G.q?.a || "";
        return { delay: 2.4 };
      },
      update(dt) {
        caret += dt;
        flash = Math.max(0, flash - dt * 1.5);
        nudgeT = Math.max(0, nudgeT - dt);
        signal = Math.max(0, signal - dt * 0.8);
        // niz pravilnih = hitrost vlaka (vidna tekočnost)
        const want = 30 + Math.min(G.streak, 10) * 26;
        speed += (want - speed) * Math.min(1, dt * 2);
        dist += speed * dt;
        if (!G.reduced && Math.random() < dt * (2 + speed / 60)) puffs.push({ x: 0, y: 0, r: 6, life: 1.2 });
        for (const p of puffs) {
          p.x -= (speed * 0.6 + 20) * dt;
          p.y -= 26 * dt;
          p.r += 14 * dt;
          p.life -= dt;
        }
        puffs = puffs.filter((p) => p.life > 0);
      },
      key(k, down) {
        if (!down) return /^[0-9]$/.test(k) || ["Enter", "Backspace", "-", ",", ".", "/"].includes(k);
        return type(k);
      },
      draw(g) {
        const [top, bot, hill, ground] = chap(G, [["#bae6fd", "#f0f9ff", "#86efac", "#65a30d"], ["#475569", "#94a3b8", "#334155", "#1f2937"], ["#fdba74", "#fef3c7", "#a8a29e", "#57534e"], ["#38bdf8", "#e0f2fe", "#fde68a", "#0ea5e9"]]);
        sky(G, g, top, bot);
        const railY = G.H - clamp(G.H * 0.12, 30, 60);
        // hribi in drogovi se premikajo s hitrostjo vlaka (paralaksa)
        g.fillStyle = hill;
        g.beginPath();
        g.moveTo(-20, railY);
        for (let x = -20; x <= G.W + 20; x += 16) {
          const X = x + dist * 0.25;
          g.lineTo(x, railY - 40 - Math.sin(X / 90) * 22 - Math.sin(X / 37) * 8);
        }
        g.lineTo(G.W + 20, railY);
        g.fill();
        g.fillStyle = ground;
        g.fillRect(-20, railY, G.W + 40, G.H);
        g.fillStyle = "#78350f";
        for (let x = -((dist * 1) % 26); x < G.W; x += 26) g.fillRect(x, railY + 3, 14, 6);
        g.fillStyle = "#64748b";
        g.fillRect(-20, railY, G.W + 40, 4);
        g.fillStyle = INK;
        for (let x = -((dist * 0.8) % 140); x < G.W + 20; x += 140) g.fillRect(x, railY - 64, 4, 64);
        // vlak: lokomotiva in vagoni (vsak pravilen zapored doda vagon)
        const s = clamp(G.H * 0.06, 18, 34), lx = G.W * 0.62, ly = railY - 4;
        const bob = G.reduced ? 0 : Math.sin(dist / 9) * 1.2;
        for (let i = 0; i < wagons; i++) {
          const wx = lx - s * 2.6 - i * s * 2.3;
          G.rr(wx - s, ly - s * 1.4 + bob, s * 2, s * 1.1, 5);
          g.fillStyle = ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"][i];
          g.fill();
          g.lineWidth = 2.5;
          g.strokeStyle = INK;
          g.stroke();
          for (const o of [-0.55, 0.55]) circle(g, wx + o * s, ly - s * 0.22, s * 0.28, "#334155", 2);
        }
        G.rr(lx - s * 1.3, ly - s * 1.8 + bob, s * 2.2, s * 1.5, 6);
        g.fillStyle = "#0f766e";
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        G.rr(lx - s * 1.1, ly - s * 2.6 + bob, s * 1.0, s * 0.9, 4);
        g.fillStyle = "#14b8a6";
        g.fill();
        g.stroke();
        // strojevodkinja Mila v oknu
        circle(g, lx - s * 0.6, ly - s * 2.12 + bob, s * 0.3, "#fcd34d", 2);
        g.fillStyle = "#1d4ed8";
        g.fillRect(lx - s * 0.92, ly - s * 2.5 + bob, s * 0.64, s * 0.14);
        g.fillStyle = "#fbbf24";
        g.fillRect(lx + s * 0.35, ly - s * 2.4 + bob, s * 0.3, s * 0.65);
        g.strokeRect(lx + s * 0.35, ly - s * 2.4 + bob, s * 0.3, s * 0.65);
        for (const o of [-0.8, 0.1, 0.75]) circle(g, lx + o * s, ly - s * 0.25, s * 0.34, "#334155", 2.5);
        for (const p of puffs) {
          g.globalAlpha = Math.max(0, p.life / 1.2) * 0.8;
          circle(g, lx + s * 0.5 + p.x, ly - s * 2.6 + p.y, p.r, "#f8fafc", 0);
        }
        g.globalAlpha = 1;
        // signal: zelen ob pravilnem odgovoru
        const sx = G.W - clamp(G.W * 0.08, 20, 50);
        g.fillStyle = INK;
        g.fillRect(sx - 2, railY - s * 3.4, 4, s * 3.4);
        G.rr(sx - s * 0.4, railY - s * 4.4, s * 0.8, s * 1.3, 6);
        g.fill();
        circle(g, sx, railY - s * 4.05, s * 0.22, signal > 0 || (flash > 0 && flashOk) ? "#22c55e" : "#334155", 0);
        circle(g, sx, railY - s * 3.5, s * 0.22, reveal || (flash > 0 && !flashOk) ? "#ef4444" : "#334155", 0);
        // tabla z nalogo in odgovorom
        if (!G.q || !task) return;
        const bw = Math.min(G.W - 24, 560), bx = (G.W - bw) / 2, by = clamp(G.H * 0.05, 8, 30);
        const bh = clamp(railY - s * 5 - by, 96, 220);
        G.rr(bx, by, bw, bh, 16);
        g.fillStyle = "#fffbeb";
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        const qs = clamp(bh * 0.24, 18, 40);
        boardText(G, G.q.q, G.W / 2, by + bh * 0.3, bw - 24, bh * 0.46, qs, { color: INK, weight: 900 });
        // polje za odgovor: predpona (x =), vtipkano, enota; utripajoča črta
        const shown = buf || "";
        const as = clamp(bh * 0.26, 20, 44);
        const pre = task.pre, unit = task.unit;
        const fw = G.tw(shown || "0", as, 900) + 30;
        const pw = pre ? G.tw(pre, as * 0.8, 800) + 8 : 0, uw = unit ? G.tw(unit, as * 0.8, 800) + 8 : 0;
        const total = Math.min(bw - 24, pw + Math.max(fw, as * 2.4) + uw);
        const fx = G.W / 2 - total / 2 + pw, fbw = total - pw - uw, fy = by + bh * 0.68;
        if (pre) G.fit(pre.trim(), fx - 6, fy, pw, as * 0.8, { color: INK, weight: 800, align: "right" });
        if (unit) G.fit(unit.trim(), fx + fbw + 6, fy, uw, as * 0.8, { color: INK, weight: 800, align: "left" });
        G.rr(fx, fy - as * 0.75, fbw, as * 1.5, 10);
        g.fillStyle = reveal ? "#fecaca" : flash > 0 ? (flashOk ? "#bbf7d0" : "#fecaca") : "#fff";
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = nudgeT > 0 ? "#f59e0b" : INK;
        g.stroke();
        const tw = G.fit(shown || "", fx + fbw / 2, fy + 1, fbw - 16, as, { color: INK, weight: 900, min: 12 });
        if (!G.waiting && Math.floor(caret * 2) % 2 === 0) {
          const cx = fx + fbw / 2 + (shown ? Math.min(fbw / 2 - 8, G.tw(shown, tw, 900) / 2 + 3) : 0);
          g.fillStyle = INK;
          g.fillRect(cx, fy - as * 0.45, 3, as * 0.9);
        }
        if (nudgeT > 0 && nudge) pill(G, g, nudge, G.W / 2, by + bh + 22, G.W - 30, 32, "#fef3c7", 16);
        // po napaki pravilni odgovor pod tablo (učenje: pravilno pride šele po ~2 s)
        if (reveal) pill(G, g, `✓ ${reveal}`, G.W / 2, by + bh + 24, G.W - 30, 38, "#bbf7d0", 22);
      },
    };
    // tipke za ta pojem iz vzorca nalog (minus, vejica, ulomek), enake za vse naloge igre
    const sample = [];
    for (let tier = 1; tier <= 3; tier++) for (let i = 0; i < 40; i++) sample.push(typedTask(G.ask(tier)));
    keys = padKeys(sample);
    render();
    wireKeys(G, eng);
    return eng;
  },
};

export const PRODUCE_GAMES = [numline, typed];
