// Risbe v lekcijah (j, 10. 11. 2026): blok »:::risba <vrsta> … :::« se na strežniku izriše v vrstični SVG.
// Lekcija hrani samo podatke (števila, napise), zato je risba matematično točna, napisi so besedilo
// (prevajanje), v datoteki ni HTML-ja in ni skript. Barve pridejo iz CSS (public/risbe.css: spremenljivke
// teme, v tisku nadomestne vrednosti), »opis« je besedilo za bralnik zaslona, inštruktorja in branje na glas.
// Oblika in vrste: content/lessons/README.md, razdelek »Risbe«.
// Datoteka je v public/, ker isto kodo (brez DOM in brez knjižnic) uporabljata strežnik (server/risbe.js) in
// brskalnik: graf z drsniki (»drsnik:«, j, 11. 11. 2026) public/risbe-zive.js ob premiku drsnika izriše znova.
import { parse, compile, freeVars } from "./graph/math.js";

export const DRAW_RE = /^[ \t]*:::[ \t]*risba(?:[ \t]+([^\n]*?))?[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;

const W = 320; // širina risbe v enotah viewBox; na telefonu (360 px) je ena enota približno 1 px
const FS = 14; // velikost napisov; pri širini 320 enot ostane na telefonu vsaj 12 px
const ZOOM = 1.25; // na širokem zaslonu se risba poveča največ toliko

// | in $ bi v Markdownu pomenila tabelo oziroma formulo, zato ju zapišemo s kodo.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"'|$]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "|": "&#124;", $: "&#36;" })[c]);
const r2 = (v) => +(+v).toFixed(2);
const fail = (msg) => {
  throw new Error(msg);
};

function num(s, what = "število") {
  const v = Number(String(s ?? "").trim().replace(/[−–]/g, "-").replace(",", "."));
  if (!Number.isFinite(v) || String(s ?? "").trim() === "") fail(`${what}: »${s}« ni število`);
  return v;
}
const ptRaw = (s) => {
  const p = String(s).split(";");
  if (p.length !== 2) fail(`točka »${String(s).trim()}« mora biti zapisana kot »x; y«`);
  return [num(p[0], "koordinata"), num(p[1], "koordinata")];
};
const fields = (s) => String(s).split("|").map((x) => x.trim());
function span(s, what) {
  const p = String(s).split("..");
  if (p.length !== 2) fail(`${what}: pričakujem »od .. do«`);
  return p;
}
// Število za napis: decimalna vejica, pravi minus.
export const fmt = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");

// Slog: barva pove vlogo (ne odtenka), zato deluje v svetli in temni temi ter v tisku.
const COLORS = { modra: "a", oranžna: "b", zelena: "c", rdeča: "d", siva: "m" };
function style(s = "") {
  const o = { c: "", dash: false, bold: false, arrow: false, fill: false, bg: false, closed: false };
  for (const w of String(s).split(/[\s,]+/).filter(Boolean)) {
    if (COLORS[w]) o.c = ` ${COLORS[w]}`;
    else if (w === "črtkano") o.dash = true;
    else if (w === "debelo") o.bold = true;
    else if (w === "puščica") o.arrow = true;
    else if (w === "polno") o.fill = true;
    else if (w === "ozadje") o.bg = true;
    else if (w === "zaprto") o.closed = true;
    else fail(`neznan slog »${w}« (barve: ${Object.keys(COLORS).join(", ")}; črtkano, debelo, puščica, polno, ozadje, zaprto)`);
  }
  return o;
}
const lineCls = (st) => `rs-l${st.c}${st.dash ? " rs-d" : ""}${st.bold ? " rs-b" : ""}`;

// Napis: F_1, x^2, U_{Th}, 10^-3, a_12 postanejo indeksi in eksponenti (tspan), ostalo je navadno besedilo.
// Za _ ali ^ gre celo število s predznakom (10^-3, x^10) ali en znak; več črk brez zavitih oklepajev
// (»U_Th«) je napaka, ker bi se tiho izrisalo kot U s T in navadnim h.
function rich(str) {
  const bad = /[_^]([A-Za-zčšžČŠŽ]{2,})/.exec(String(str));
  if (bad) fail(`napis »${str}«: indeks ali eksponent iz več znakov zapiši v zavitih oklepajih, npr. »${bad[0][0]}{${bad[1]}}«`);
  const parts = String(str).split(/([_^](?:\{[^}]*\}|[−-]?\d+(?:,\d+)?|[^\s{}_^]))/);
  let shift = 0;
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    const m = /^([_^])\{?([^}]*)\}?$/.exec(p.replace(/^([_^])-/, "$1−"));
    if (m && /^[_^]/.test(p)) {
      const dy = (m[1] === "_" ? 4 : -6) - shift;
      shift += dy;
      out += `<tspan class="rs-i" dy="${dy}">${esc(m[2])}</tspan>`;
    } else if (shift) {
      out += `<tspan dy="${-shift}">${esc(p)}</tspan>`;
      shift = 0;
    } else out += esc(p);
  }
  return out;
}
const ANCHOR = { start: "", middle: ' text-anchor="middle"', end: ' text-anchor="end"' };
const text = (x, y, s, { a = "middle", cls = "" } = {}) => `<text x="${r2(x)}" y="${r2(y)}"${ANCHOR[a]}${cls ? ` class="${cls.trim()}"` : ""}>${rich(s)}</text>`;
// Napis ob točki: lega pove, na kateri strani točke stoji.
function label(x, y, s, lega = "", cls = "", gap = 8) {
  const w = new Set(String(lega || "").split(/\s+/).filter(Boolean));
  for (const k of w) if (!["nad", "pod", "levo", "desno", "sredina"].includes(k)) fail(`neznana lega »${k}« (nad, pod, levo, desno, sredina)`);
  const dx = w.has("levo") ? -gap : w.has("desno") ? gap : 0;
  const dy = w.has("nad") ? -gap : w.has("pod") ? gap + FS * 0.72 : FS * 0.36;
  return text(x + dx, y + dy, s, { a: w.has("levo") ? "end" : w.has("desno") ? "start" : "middle", cls: `rs-h ${cls}` });
}
function arrowHead(x1, y1, x2, y2, c = "", size = 9) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (da) => `${r2(x2 - size * Math.cos(a + da))},${r2(y2 - size * Math.sin(a + da))}`;
  return `<polygon class="rs-f${c}" points="${r2(x2)},${r2(y2)} ${p(0.36)} ${p(-0.36)}"/>`;
}
// Črta s puščico: črta se konča malo pred konico, da je konica ostra.
function arrow(x1, y1, x2, y2, st) {
  const d = Math.hypot(x2 - x1, y2 - y1) || 1;
  const k = Math.max(0, d - 6) / d;
  return `<line class="${lineCls(st)}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x1 + (x2 - x1) * k)}" y2="${r2(y1 + (y2 - y1) * k)}"/>${arrowHead(x1, y1, x2, y2, st.c)}`;
}

// Glava bloka: »ključ: vrednost« v vsaki vrstici; pod vrstico »---« je surova mreža znakov (molekula).
function parseBody(body) {
  const [head, ...rest] = String(body).split(/^[ \t]*---[ \t]*$/m);
  const items = [];
  for (const line of head.split("\n")) {
    if (!line.trim()) continue;
    const m = /^\s*([a-zčšž]+)\s*:\s*(.*)$/i.exec(line);
    if (!m) fail(`vrstica »${line.trim()}« ni oblike »ključ: vrednost«`);
    items.push([m[1].toLowerCase(), m[2].trim()]);
  }
  const one = (k, d = "") => {
    const hit = items.filter((i) => i[0] === k);
    if (hit.length > 1) fail(`ključ »${k}« je zapisan večkrat`);
    return hit.length ? hit[0][1] : d;
  };
  const all = (k) => items.filter((i) => i[0] === k).map((i) => i[1]);
  return { items, one, all, grid: rest.join("\n---\n").split("\n").filter((l) => l.trim()) };
}
function known(b, keys) {
  const ok = new Set(["opis", "podnapis", ...keys]);
  for (const [k] of b.items) if (!ok.has(k)) fail(`neznan ključ »${k}« (dovoljeni: ${[...ok].join(", ")})`);
}

// ---------- drsniki (graf): parametri v izrazih, koordinatah in napisih ----------
// drsnik: ime | od .. do | korak | začetna | napis. Ime (ena črka) sme nastopati v »f:«, v koordinatah likov
// (»točka: 0; n«, »črta: 0; n -> 1; k + n«) in v napisih, opisu in podnapisu kot »{izraz}« (»k = {k}«,
// »{+n}«: s plusom spredaj se izpiše predznak). Brez drsnikov velja BREZ: vse ostane dobesedno.
const BREZ = { vals: null, lenient: false, num, text: (s) => s, used: null };
const decimalk = (v) => (String(+(+v).toFixed(6)).split(".")[1] || "").length;
const MAX_KORAKOV = 200;
function drsniki(b) {
  const list = b.all("drsnik").map((t) => {
    const f = fields(t);
    if (f.length < 4) fail("drsnik: pričakujem »ime | od .. do | korak | začetna | napis«");
    const name = f[0];
    let ast = null;
    try {
      ast = parse(name);
    } catch {}
    if (!/^\p{L}$/u.test(name) || name === "x" || name === "y" || ast?.k !== "var" || ast.name !== name) fail(`drsnik: ime »${name}« ni dovoljeno (ena črka, ne x, y, e ali π)`);
    const [lo, hi] = span(f[1], `drsnik ${name}`).map((q) => num(q, `drsnik ${name}`));
    if (!(hi > lo)) fail(`drsnik ${name}: »do« mora biti večji od »od«`);
    const step = num(f[2], `korak drsnika ${name}`);
    const n = (hi - lo) / step;
    if (!(step > 0) || Math.abs(n - Math.round(n)) > 1e-9 || n > MAX_KORAKOV) fail(`drsnik ${name}: korak mora razdeliti območje od–do na največ ${MAX_KORAKOV} enakih delov`);
    const start = num(f[3], `začetna vrednost drsnika ${name}`);
    const k = (start - lo) / step;
    if (start < lo - 1e-9 || start > hi + 1e-9 || Math.abs(k - Math.round(k)) > 1e-9) fail(`drsnik ${name}: začetna vrednost ${fmt(start)} mora biti med ${fmt(lo)} in ${fmt(hi)} in na koraku ${fmt(step)}`);
    const label = f[4] || name;
    if (/[_^{}]/.test(label)) fail(`drsnik ${name}: napis bere bralnik zaslona, zato brez _, ^ in zavitih oklepajev`);
    return { name, lo, hi, step, start, label };
  });
  if (list.length > 3) fail("graf ima lahko največ 3 drsnike");
  if (new Set(list.map((d) => d.name)).size !== list.length) fail("drsnik: vsako ime sme nastopati samo enkrat");
  return list;
}
// given: vrednosti iz brskalnika ({ k: 1.5 }); lenient: lik ali krivulja, ki pri teh vrednostih ni določena
// ali pade iz območja risbe, se izpusti (strogo, pri začetnih vrednostih, je to napaka v zapisu).
function okolje(list, given, lenient) {
  const vals = {};
  for (const d of list) {
    const g = given?.[d.name];
    const v = g !== undefined && g !== null && g !== "" && Number.isFinite(+g) ? Math.min(d.hi, Math.max(d.lo, +g)) : d.start;
    vals[d.name] = +(d.lo + Math.round((v - d.lo) / d.step) * d.step).toFixed(9);
  }
  const used = new Set();
  const dec = Math.min(4, Math.max(2, ...list.flatMap((d) => [d.lo, d.step, d.start].map(decimalk))));
  const expr = (src, free = []) => {
    let ast;
    let fn;
    try {
      ast = parse(src);
      fn = compile(ast);
    } catch (e) {
      fail(`izraza »${src}« ne znam izračunati (${e.message})`);
    }
    for (const v of freeVars(ast)) {
      if (v in vals) used.add(v);
      else if (!free.includes(v)) fail(`izraz »${src}«: neznana spremenljivka »${v}« (drsniki: ${list.map((d) => d.name).join(", ")})`);
    }
    return fn;
  };
  const value = (src) => {
    let v;
    try {
      v = expr(src)(vals);
    } catch (e) {
      if (/^izraz/.test(e.message)) throw e;
      v = NaN;
    }
    return typeof v === "number" ? v : NaN;
  };
  return {
    vals,
    lenient,
    used,
    expr,
    num(s, what = "število") {
      const t = String(s ?? "").trim().replace(/[−–]/g, "-");
      if (t === "" || Number.isFinite(Number(t.replace(",", ".")))) return num(s, what);
      const v = value(t);
      if (!Number.isFinite(v)) fail(`${what}: izraz »${t}« pri teh vrednostih drsnikov ni število`);
      return v;
    },
    text: (s) =>
      String(s ?? "").replace(/(?<![_^])\{([^{}]+)\}/g, (_, e) => {
        // {izraz:.2} izpiše natanko 2 decimalki (2,30 namesto 2,3).
        const fix = e.match(/:\.(\d)\s*$/);
        if (fix) e = e.slice(0, fix.index);
        const d = fix ? +fix[1] : dec;
        const signed = /^\s*\+/.test(e);
        const v = value(e.replace(/^\s*\+/, "").replace(/[−–]/g, "-"));
        if (!Number.isFinite(v)) return "/";
        // 44,145 → 44,15: zaokrožimo na 12 mest, preden odrežemo (sicer dvojiški zapis da 44,14).
        const r = Math.sign(v) * (Math.round(+(Math.abs(v) * 10 ** d).toPrecision(12)) / 10 ** d);
        const a = (fix ? Math.abs(r).toFixed(d) : String(Math.abs(r))).replace(".", ",");
        return signed ? `${r < 0 ? "−" : "+"} ${a}` : `${r < 0 ? "−" : ""}${a}`;
      }),
  };
}

// ---------- skupni liki (skica in graf): koordinate lekcije → risba ----------
const SHAPES = ["črta", "lik", "pravokotnik", "krog", "točka", "napis", "puščica", "pravikot"];
// box = [x0, y0, x1, y1] v koordinatah lekcije: lik zunaj območja bi se zaradi overflow: visible narisal čez besedilo.
function shapes(items, m, unit, box, P = BREZ) {
  let out = "";
  let top = "";
  const ptRaw = (s) => {
    const p = String(s).split(";");
    if (p.length !== 2) fail(`točka »${String(s).trim()}« mora biti zapisana kot »x; y«`);
    return [P.num(p[0], "koordinata"), P.num(p[1], "koordinata")];
  };
  const tol = 1e-9 * Math.max(box[2] - box[0], box[3] - box[1]);
  const inBox = (q, r = 0) => {
    if (q[0] - r < box[0] - tol || q[0] + r > box[2] + tol || q[1] - r < box[1] - tol || q[1] + r > box[3] + tol)
      fail(`točka ${fmt(q[0])}; ${fmt(q[1])}${r ? ` s polmerom ${fmt(r)}` : ""} je zunaj območja risbe (${fmt(box[0])}; ${fmt(box[1])} .. ${fmt(box[2])}; ${fmt(box[3])})`);
    return q;
  };
  const pt = (s) => inBox(ptRaw(s));
  const path = (s) => String(s).split("->").map(pt);
  const shape = ([k, v]) => {
    const f = fields(v);
    if (k === "črta") {
      const st = style(f[1]);
      const p = path(f[0]).map((q) => m(...q));
      if (p.length < 2) fail("črta potrebuje vsaj dve točki");
      if (st.arrow) {
        const [a, b] = p.slice(-2);
        if (p.length > 2) out += `<polyline class="${lineCls(st)}" points="${p.slice(0, -1).map((q) => q.map(r2).join(",")).join(" ")}"/>`;
        out += arrow(...a, ...b, st);
      } else out += `<${st.closed ? "polygon" : "polyline"} class="${lineCls(st)}" points="${p.map((q) => q.map(r2).join(",")).join(" ")}"/>`;
    } else if (k === "lik" || k === "pravokotnik") {
      const st = style(f[1]);
      let p;
      if (k === "lik") p = path(f[0]);
      else {
        const [a, b] = span(f[0], "pravokotnik").map(pt);
        p = [a, [b[0], a[1]], b, [a[0], b[1]]];
      }
      if (p.length < 3) fail("lik potrebuje vsaj tri točke");
      out += `<polygon class="${st.bg ? "rs-bg" : st.fill ? `rs-f${st.c}` : `rs-p${st.c}`}${st.dash ? " rs-d" : ""}" points="${p.map((q) => m(...q).map(r2).join(",")).join(" ")}"/>`;
    } else if (k === "krog") {
      const st = style(f[2]);
      const c = ptRaw(f[0]);
      const r = P.num(f[1], "polmer");
      if (!(r > 0)) fail("krog: polmer mora biti pozitiven");
      const [x, y] = m(...inBox(c, r));
      out += `<circle class="${st.fill ? `rs-f${st.c}` : st.bg ? "rs-bg" : `rs-p${st.c}`}" cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * unit)}"/>`;
    } else if (k === "točka") {
      const st = style(f[3]);
      const [x, y] = m(...pt(f[0]));
      top += `<circle class="rs-f${st.c}" cx="${r2(x)}" cy="${r2(y)}" r="3.5"/>`;
      if (f[1]) top += label(x, y, P.text(f[1]), f[2] || "nad desno", st.c, 6);
    } else if (k === "napis") {
      const st = style(f[3]);
      const [x, y] = m(...pt(f[0]));
      if (!f[1]) fail("napis nima besedila");
      top += label(x, y, P.text(f[1]), f[2] || "sredina", `${st.c}${st.bold ? " rs-tb" : ""}`);
    } else if (k === "puščica") {
      const st = style(f[3]);
      const [a, b] = path(f[0]).map((q) => m(...q));
      if (!b) fail("puščica potrebuje začetek in konec: »x; y -> x; y«");
      out += arrow(...a, ...b, { ...st, bold: true });
      if (f[1]) top += label((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, P.text(f[1]), f[2] || "nad", st.c);
    } else if (k === "pravikot") {
      // Oznaka pravega kota v oglišču V med smerema proti A in B.
      const [v, a, b] = f.slice(0, 3).map((q) => m(...pt(q)));
      const u = (q) => {
        const d = Math.hypot(q[0] - v[0], q[1] - v[1]) || 1;
        return [((q[0] - v[0]) / d) * 9, ((q[1] - v[1]) / d) * 9];
      };
      const [ua, ub] = [u(a), u(b)];
      out += `<polyline class="rs-l rs-t" points="${r2(v[0] + ua[0])},${r2(v[1] + ua[1])} ${r2(v[0] + ua[0] + ub[0])},${r2(v[1] + ua[1] + ub[1])} ${r2(v[0] + ub[0])},${r2(v[1] + ub[1])}"/>`;
    }
  };
  for (const item of items) {
    const before = [out, top];
    try {
      shape(item);
    } catch (e) {
      // Drsnik je lik premaknil iz območja risbe (ali izraz ni določen): pri teh vrednostih ga ni na sliki.
      if (!P.lenient) throw e;
      [out, top] = before;
    }
  }
  return out + top;
}

// ---------- številska premica ----------
// od, do, korak (razdalja med črticami), oznake (vsaka koliko enot je število; »ne« = brez),
// oznaka: x | besedilo, točka: x | napis | slog (»prazna«), skok: a -> b | napis | slog, interval: a .. b | napis | slog
function premica(b) {
  known(b, ["od", "do", "korak", "oznake", "oznaka", "točka", "skok", "interval"]);
  const [lo, hi] = [num(b.one("od"), "od"), num(b.one("do"), "do")];
  if (!(hi > lo)) fail("premica: »do« mora biti večji od »od«");
  const step = num(b.one("korak", "1"), "korak");
  const ticks = Math.round((hi - lo) / step);
  if (!(step > 0) || ticks > 60 || Math.abs(lo + ticks * step - hi) > 1e-9) fail("premica: korak mora razdeliti razdaljo od–do na največ 60 enakih delov");
  const [L, R] = [22, 30];
  const X = (v) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const inside = (v, what) => (v < lo - 1e-9 || v > hi + 1e-9 ? fail(`premica: ${what} ${fmt(v)} je zunaj območja`) : v);
  const skoki = b.all("skok");
  const above = b.all("točka").some((t) => fields(t)[1]) || b.all("interval").some((t) => fields(t)[1]);
  const y = 10 + (skoki.length ? 46 : 0) + (above ? 20 : 0);
  let s = arrow(L - 12, y, W - 6, y, style());
  const custom = b.all("oznaka").map((t) => fields(t)).map((f) => [inside(num(f[0], "oznaka"), "oznaka"), f[1] ?? ""]);
  let every = b.one("oznake");
  if (every !== "ne") {
    every = every ? num(every, "oznake") : step;
    if (!(every > 0)) fail("premica: »oznake« mora biti pozitivno število ali »ne«");
    while ((hi - lo) / every > 14) every *= 2;
  }
  for (let i = 0; i <= ticks; i++) {
    const v = lo + i * step;
    s += `<line class="rs-l" x1="${r2(X(v))}" y1="${y - 5}" x2="${r2(X(v))}" y2="${y + 5}"/>`;
    const k = (v - lo) / (every === "ne" ? 1 : every);
    if (every !== "ne" && Math.abs(k - Math.round(k)) < 1e-9 && !custom.some((c) => Math.abs(c[0] - v) < 1e-9)) s += text(X(v), y + 22, fmt(v));
  }
  for (const [v, t] of custom) s += `<line class="rs-l" x1="${r2(X(v))}" y1="${y - 5}" x2="${r2(X(v))}" y2="${y + 5}"/>${text(X(v), y + 22, t)}`;
  for (const t of b.all("interval")) {
    const f = fields(t);
    const [a, c] = span(f[0], "interval").map((q) => inside(num(q, "interval"), "interval"));
    const st = style(f[2] || "modra");
    s += `<line class="rs-l rs-w${st.c}" x1="${r2(X(a))}" y1="${y}" x2="${r2(X(c))}" y2="${y}"/>`;
    if (f[1]) s += text((X(a) + X(c)) / 2, y - 12, f[1], { cls: st.c });
  }
  for (const t of skoki) {
    const f = fields(t);
    const [a, c] = String(f[0]).split("->").map((q) => inside(num(q, "skok"), "skok"));
    const st = style(f[2] || "oranžna");
    const [xa, xc] = [X(a), X(c)];
    const h = Math.min(30, Math.abs(xc - xa) * 0.4 + 8);
    s += `<path class="${lineCls(st)}" d="M${r2(xa)},${y - 8} Q${r2((xa + xc) / 2)},${r2(y - 8 - 2 * h)} ${r2(xc)},${y - 8}"/>${arrowHead((xa + xc) / 2, y - 8 - 2 * h, xc, y - 7, st.c, 8)}`;
    if (f[1]) s += text((xa + xc) / 2, y - 14 - h, f[1], { cls: st.c });
  }
  for (const t of b.all("točka")) {
    const f = fields(t);
    const v = inside(num(f[0], "točka"), "točka");
    const hollow = /\bprazna\b/.test(f[2] || "");
    const st = style((f[2] || "modra").replace(/\bprazna\b/, "") || "modra");
    s += `<circle class="${hollow ? `rs-o${st.c}` : `rs-f${st.c}`}" cx="${r2(X(v))}" cy="${y}" r="4.5"/>`;
    if (f[1]) s += text(X(v), y - 12, f[1], { cls: st.c });
  }
  return { w: W, h: y + 32, svg: s };
}

// ---------- mreža enakih kvadratkov ----------
// vrstic, stolpcev, spodaj (napis pod mrežo), desno (napis ob mreži), številke: da (kvadratki so oštevilčeni)
function mreza(b) {
  known(b, ["vrstic", "stolpcev", "spodaj", "desno", "številke", "barva"]);
  const [rows, cols] = [num(b.one("vrstic"), "vrstic"), num(b.one("stolpcev"), "stolpcev")];
  if (![rows, cols].every((v) => Number.isInteger(v) && v >= 1 && v <= 20)) fail("mreža: vrstic in stolpcev je od 1 do 20");
  const right = b.one("desno");
  const below = b.one("spodaj");
  const rightW = right ? 12 + right.length * FS * 0.56 : 0;
  const c = Math.min(36, Math.floor((W - 12 - rightW) / cols));
  const [gw, gh] = [cols * c, rows * c];
  const x0 = Math.max(6, (W - gw - rightW) / 2);
  const st = style(b.one("barva", "modra"));
  const numbered = b.one("številke") === "da";
  let s = "";
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      s += `<rect class="rs-p${st.c}" x="${r2(x0 + j * c)}" y="${6 + i * c}" width="${c}" height="${c}"/>`;
      if (numbered && c >= 22) s += text(x0 + (j + 0.5) * c, 6 + (i + 0.5) * c + FS * 0.36, String(i * cols + j + 1));
    }
  if (below) s += `${dim(x0, 6 + gh + 10, x0 + gw, 6 + gh + 10)}${text(x0 + gw / 2, 6 + gh + 30, below)}`;
  if (right) s += `${dim(x0 + gw + 10, 6, x0 + gw + 10, 6 + gh)}${text(x0 + gw + 18, 6 + gh / 2 + FS * 0.36, right, { a: "start" })}`;
  return { w: W, h: 6 + gh + (below ? 38 : 8), svg: s };
}
// Kotirna črta s kratkima zaključkoma (dolžina stranice).
function dim(x1, y1, x2, y2) {
  const v = x1 === x2;
  const end = (x, y) => (v ? `<line class="rs-l rs-t" x1="${r2(x - 4)}" y1="${r2(y)}" x2="${r2(x + 4)}" y2="${r2(y)}"/>` : `<line class="rs-l rs-t" x1="${r2(x)}" y1="${r2(y - 4)}" x2="${r2(x)}" y2="${r2(y + 4)}"/>`);
  return `<line class="rs-l rs-t" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"/>${end(x1, y1)}${end(x2, y2)}`;
}

// ---------- stolpčni prikaz ----------
// stolpec: ime | vrednost (večkrat), os: ime navpične osi, korak: razdalja med črtami na osi
function stolpci(b) {
  known(b, ["stolpec", "os", "korak", "barva"]);
  const bars = b.all("stolpec").map((t) => fields(t)).map((f) => [f[0], num(f[1], "vrednost stolpca")]);
  if (bars.length < 2 || bars.length > 8) fail("stolpci: potrebujem od 2 do 8 stolpcev");
  if (bars.some((x) => x[1] < 0)) fail("stolpci: vrednosti ne smejo biti negativne");
  const max = Math.max(...bars.map((x) => x[1]));
  let step = b.one("korak") ? num(b.one("korak"), "korak") : [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((k) => max / k <= 6) || Math.ceil(max / 5);
  if (!(step > 0) || max / step > 20) fail("stolpci: korak mora biti pozitiven in dati največ 20 črt na osi");
  const top = Math.ceil(max / step - 1e-9) * step || step;
  const axis = b.one("os");
  const H = 150;
  // Napis vrednosti nad stolpcem, ki seže (skoraj) do vrha osi, ne sme prekriti imena osi: tedaj dodatna vrstica prostora.
  const [L, T] = [34, axis ? ((1 - max / top) * H < FS ? 30 + FS : 30) : 14];
  const Y = (v) => T + H - (v / top) * H;
  const slot = (W - L - 6) / bars.length;
  const st = style(b.one("barva", "modra"));
  const small = bars.some((x) => x[0].length * FS * 0.56 > slot - 2);
  let s = axis ? text(4, 14, axis, { a: "start" }) : "";
  for (let v = 0; v <= top + 1e-9; v += step) s += `<line class="rs-g" x1="${L}" y1="${r2(Y(v))}" x2="${W - 6}" y2="${r2(Y(v))}"/>${text(L - 6, Y(v) + FS * 0.36, fmt(v), { a: "end" })}`;
  bars.forEach(([name, v], i) => {
    const x = L + i * slot + slot * 0.18;
    s += `<rect class="rs-p${st.c}" x="${r2(x)}" y="${r2(Y(v))}" width="${r2(slot * 0.64)}" height="${r2(Y(0) - Y(v))}"/>`;
    s += text(L + (i + 0.5) * slot, Y(v) - 5, fmt(v), { cls: "rs-tb" }) + text(L + (i + 0.5) * slot, T + H + 18, name, { cls: small ? "rs-s" : "" });
  });
  s += `<line class="rs-l" x1="${L}" y1="${T - 6}" x2="${L}" y2="${T + H}"/><line class="rs-l" x1="${L}" y1="${T + H}" x2="${W - 6}" y2="${T + H}"/>`;
  return { w: W, h: T + H + 28, svg: s };
}

// ---------- graf v koordinatnem sistemu ----------
// x: od .. do | korak | ime, y: enako, enako: da (ista enota na obeh oseh), višina, oznake: ne,
// oznakax / oznakay: vrednost | besedilo, f: izraz | slog | od .. do, in skupni liki.
function graf(b, P = BREZ) {
  known(b, ["x", "y", "enako", "višina", "oznake", "oznakax", "oznakay", "mreža", "f", "drsnik", ...SHAPES]);
  const ax = (k) => {
    const f = fields(b.one(k) || fail(`graf: manjka os »${k}: od .. do«`));
    const [lo, hi] = span(f[0], `os ${k}`).map((q) => num(q, `os ${k}`));
    if (!(hi > lo)) fail(`graf: os ${k} ima napačno območje`);
    const step = f[1] ? num(f[1], "korak osi") : 1;
    if (!(step > 0) || (hi - lo) / step > 40) fail(`graf: korak osi ${k} da preveč črtic`);
    return { lo, hi, step, name: f[2] ?? k };
  };
  const [x, y] = [ax("x"), ax("y")];
  const [L, R, T, B] = [40, 22, 20, 26];
  const pw = W - L - R;
  const ph = b.one("enako") === "da" ? (pw * (y.hi - y.lo)) / (x.hi - x.lo) : num(b.one("višina", "190"), "višina");
  if (ph > 420) fail("graf: risba je previsoka (zmanjšaj območje osi y)");
  const X = (v) => L + ((v - x.lo) / (x.hi - x.lo)) * pw;
  const Y = (v) => T + ph - ((v - y.lo) / (y.hi - y.lo)) * ph;
  const [x0, y0] = [X(Math.min(Math.max(0, x.lo), x.hi)), Y(Math.min(Math.max(0, y.lo), y.hi))];
  const labels = b.one("oznake") !== "ne";
  const steps = (a) => Array.from({ length: Math.floor((a.hi - a.lo) / a.step + 1e-9) + 1 }, (_, i) => +(Math.ceil(a.lo / a.step - 1e-9) * a.step + i * a.step).toFixed(9)).filter((v) => v <= a.hi + 1e-9);
  let grid = "";
  let marks = "";
  if (b.one("mreža") !== "ne") {
    for (const v of steps(x)) grid += `<line class="rs-g" x1="${r2(X(v))}" y1="${T}" x2="${r2(X(v))}" y2="${r2(T + ph)}"/>`;
    for (const v of steps(y)) grid += `<line class="rs-g" x1="${L}" y1="${r2(Y(v))}" x2="${L + pw}" y2="${r2(Y(v))}"/>`;
  }
  // Števila stojijo ob robu risbe (pod njo in levo od nje), da jih krivulja in osi ne prekrijejo; črtice so na oseh.
  const tx = (v, t) => `<line class="rs-l" x1="${r2(X(v))}" y1="${r2(y0 - 3)}" x2="${r2(X(v))}" y2="${r2(y0 + 3)}"/>${text(X(v), T + ph + 17, t)}`;
  const ty = (v, t) => `<line class="rs-l" x1="${r2(x0 - 3)}" y1="${r2(Y(v))}" x2="${r2(x0 + 3)}" y2="${r2(Y(v))}"/>${text(L - 7, Y(v) + FS * 0.36, t, { a: "end" })}`;
  if (labels) {
    for (const v of steps(x)) marks += tx(v, fmt(v));
    for (const v of steps(y)) marks += ty(v, fmt(v));
  }
  for (const t of b.all("oznakax")) marks += tx(num(fields(t)[0], "oznakax"), fields(t)[1] ?? "");
  for (const t of b.all("oznakay")) marks += ty(num(fields(t)[0], "oznakay"), fields(t)[1] ?? "");
  const axes = `${arrow(L, y0, L + pw + 14, y0, style())}${arrow(x0, T + ph, x0, T - 14, style())}${text(W - 2, y0 - 8, x.name, { a: "end", cls: "rs-it" })}${text(x0 + 8, T - 8, y.name, { a: "start", cls: "rs-it" })}`;
  let curves = "";
  for (const t of b.all("f")) {
    const f = fields(t);
    let fn;
    if (P.vals) fn = P.expr(f[0], ["x"]);
    else
      try {
        fn = compile(parse(f[0]));
      } catch (e) {
        fail(`graf: izraza »${f[0]}« ne znam izračunati (${e.message})`);
      }
    const scope = { ...P.vals, x: 0 };
    const st = style(f[1] || "modra");
    const [a, c] = f[2] ? span(f[2], "območje funkcije").map((q) => num(q, "območje funkcije")) : [x.lo, x.hi];
    const N = 240;
    let d = "";
    let prev = null;
    // Krivuljo odrežemo na robu risbe: kjer preseže območje osi y, izračunamo presečišče z robom.
    const clip = (p, q) => {
      const edge = q[1] > y.hi ? y.hi : y.lo;
      return [p[0] + ((edge - p[1]) / (q[1] - p[1])) * (q[0] - p[0]), edge];
    };
    const ok = (p) => p && Number.isFinite(p[1]);
    const inY = (p) => p[1] >= y.lo && p[1] <= y.hi;
    for (let i = 0; i <= N; i++) {
      const xv = a + ((c - a) * i) / N;
      let yv;
      try {
        scope.x = xv;
        yv = fn(scope);
      } catch {
        yv = NaN;
      }
      const cur = [xv, typeof yv === "number" ? yv : NaN];
      if (ok(cur) && ok(prev) && Math.abs(cur[1] - prev[1]) < (y.hi - y.lo) * 4) {
        if (inY(prev) && inY(cur)) d += `${d && !d.endsWith("Z") ? "L" : "M"}${r2(X(cur[0]))},${r2(Y(cur[1]))}`;
        else if (inY(prev)) {
          const e = clip(prev, cur);
          d += `L${r2(X(e[0]))},${r2(Y(e[1]))}Z`;
        } else if (inY(cur)) {
          const e = clip(cur, prev);
          d += `M${r2(X(e[0]))},${r2(Y(e[1]))}L${r2(X(cur[0]))},${r2(Y(cur[1]))}`;
        }
      } else if (ok(cur) && inY(cur)) d += `M${r2(X(cur[0]))},${r2(Y(cur[1]))}`;
      else if (d && !d.endsWith("Z")) d += "Z";
      prev = cur;
    }
    d = d.replace(/Z/g, " ").trim(); // »Z« je bil samo znak za prekinitev, poti ne zapiramo
    if (!d && P.lenient) continue; // pri teh vrednostih drsnikov je krivulja zunaj risbe
    if (!d) fail(`graf: funkcija »${f[0]}« v izbranem območju nima nobene točke`);
    curves += `<path class="${lineCls({ ...st, bold: true })}" d="${d}"/>`;
  }
  const own = b.items.filter(([k]) => SHAPES.includes(k));
  return { w: W, h: T + ph + B, svg: grid + axes + marks + curves + shapes(own, (px, py) => [X(px), Y(py)], pw / (x.hi - x.lo), [x.lo, y.lo, x.hi, y.hi], P) };
}

// ---------- prosta skica v koordinatah lekcije ----------
// območje: x0; y0 .. x1; y1 (levo spodaj .. desno zgoraj), enota: px na enoto (sicer čez vso širino),
// mreža: da (črte na vsako enoto), nato skupni liki v vrstnem redu risanja.
function skica(b) {
  known(b, ["območje", "enota", "mreža", ...SHAPES]);
  const [a, c] = span(b.one("območje") || fail("skica: manjka »območje: x0; y0 .. x1; y1«"), "območje").map(ptRaw);
  const [dx, dy] = [c[0] - a[0], c[1] - a[1]];
  if (!(dx > 0 && dy > 0)) fail("skica: območje gre od leve spodaj do desne zgoraj");
  const P = 6;
  const u = b.one("enota") ? num(b.one("enota"), "enota") : (W - 2 * P) / dx;
  if (!(u > 0) || u * dx > W - 2 * P + 1e-6) fail("skica: pri tej enoti je risba širša od 320");
  if (u * dy > 460) fail("skica: risba je previsoka");
  const w = u * dx + 2 * P;
  const m = (x, y) => [P + (x - a[0]) * u, P + (c[1] - y) * u];
  let s = "";
  if (b.one("mreža") === "da") {
    if (dx > 60 || dy > 60) fail("skica: mreža na vsako enoto bi imela več kot 60 črt (povečaj enoto ali izpusti »mreža: da«)");
    for (let v = Math.ceil(a[0]); v <= c[0]; v++) s += `<line class="rs-g" x1="${r2(m(v, 0)[0])}" y1="${P}" x2="${r2(m(v, 0)[0])}" y2="${r2(P + u * dy)}"/>`;
    for (let v = Math.ceil(a[1]); v <= c[1]; v++) s += `<line class="rs-g" x1="${P}" y1="${r2(m(0, v)[1])}" x2="${r2(P + u * dx)}" y2="${r2(m(0, v)[1])}"/>`;
  }
  return { w, h: u * dy + 2 * P, svg: s + shapes(b.items.filter(([k]) => SHAPES.includes(k)), m, u, [a[0], a[1], c[0], c[1]]) };
}

// ---------- atom z lupinami (Bohrov model) ----------
// jedro: napis v jedru, lupine: 2, 8, 1 (število elektronov od znotraj navzven), imena: K, L, M
function atom(b) {
  known(b, ["jedro", "lupine", "imena"]);
  const shells = b.one("lupine").split(/[,;]/).map((q) => num(q, "lupine"));
  if (!shells.length || shells.length > 5 || shells.some((e) => !Number.isInteger(e) || e < 0 || e > 32)) fail("atom: lupine so 1 do 5 celih števil, npr. »2, 8, 1«");
  const names = b.one("imena", "K, L, M, N, O").split(",").map((q) => q.trim());
  const [r0, gap] = [26, shells.length > 3 ? 22 : 28];
  const R = r0 + gap * shells.length;
  const [cx, cy] = [R + 34, R + 12];
  let s = "";
  shells.forEach((e, i) => {
    const r = r0 + gap * (i + 1) - 6;
    s += `<circle class="rs-l rs-t" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let k = 0; k < e; k++) {
      const t = -Math.PI / 2 + (2 * Math.PI * k) / e;
      s += `<circle class="rs-f a" cx="${r2(cx + r * Math.cos(t))}" cy="${r2(cy + r * Math.sin(t))}" r="4.5"/>`;
    }
  });
  s += `<circle class="rs-p b" cx="${cx}" cy="${cy}" r="${r0 - 4}"/>${text(cx, cy + FS * 0.36, b.one("jedro") || fail("atom: manjka »jedro«"), { cls: "rs-s" })}`;
  // Imena lupin in število elektronov ob desnem robu, s črtico do lupine (ne samo z barvo).
  shells.forEach((e, i) => {
    const r = r0 + gap * (i + 1) - 6;
    const t = (-58 + i * (116 / Math.max(1, shells.length - 1) || 0)) * (Math.PI / 180) * (shells.length > 1 ? 1 : 0);
    const [px, py] = [cx + r * Math.cos(t), cy + r * Math.sin(t)];
    const lx = cx + R + 10;
    s += `<line class="rs-l rs-t rs-d" x1="${r2(px)}" y1="${r2(py)}" x2="${lx}" y2="${r2(py)}"/>${text(lx + 4, py + FS * 0.36, `${names[i] ?? i + 1}: ${e}`, { a: "start" })}`;
  });
  return { w: cx + R + 62, h: 2 * R + 24, svg: s };
}

// ---------- strukturna formula iz mreže znakov ----------
// Pod vrstico »---« je formula, kot jo napišemo z znaki: atomi (H, C, CH3), vezi (– | = ≡ / \) in
// nevezni pari (·· ali :). Vsak znak je eno polje mreže; vezi postanejo črte, številke za črko indeksi.
const SUB = "₀₁₂₃₄₅₆₇₈₉";
function molekula(b) {
  known(b, []);
  const rows = b.grid.map((l) => l.replace(/\t/g, "  "));
  if (!rows.length) fail("molekula: pod vrstico »---« manjka formula");
  const indent = Math.min(...rows.map((l) => l.search(/\S/)));
  const lines = rows.map((l) => [...l.slice(indent).trimEnd()]);
  const cols = Math.max(...lines.map((l) => l.length));
  const [cw, rh, P] = [11, 22, 8];
  if (cols * cw + 2 * P > W) fail("molekula: formula je preširoka (največ 27 znakov v vrstici)");
  const cx = (j) => P + (j + 0.5) * cw;
  const cy = (i) => P + (i + 0.5) * rh;
  const H = "–—-─";
  let s = "";
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; ) {
      const ch = line[j];
      let k = j + 1;
      if (ch === " ") {
        j = k;
        continue;
      }
      if (H.includes(ch) || ch === "=" || ch === "═" || ch === "≡") {
        while (k < line.length && line[k] === ch) k++;
        const n = H.includes(ch) ? 1 : ch === "≡" ? 3 : 2;
        const [x1, x2] = [cx(j) - cw * 0.9, cx(k - 1) + cw * 0.9];
        for (let q = 0; q < n; q++) {
          const y = cy(i) + (q - (n - 1) / 2) * 4.5;
          s += `<line class="rs-l" x1="${r2(x1)}" y1="${r2(y)}" x2="${r2(x2)}" y2="${r2(y)}"/>`;
        }
      } else if (ch === "|" || ch === "│" || ch === "‖") {
        const n = ch === "‖" ? 2 : 1;
        for (let q = 0; q < n; q++) {
          const x = cx(j) + (q - (n - 1) / 2) * 4.5;
          s += `<line class="rs-l" x1="${r2(x)}" y1="${r2(cy(i) - rh / 2 + 3)}" x2="${r2(x)}" y2="${r2(cy(i) + rh / 2 - 3)}"/>`;
        }
      } else if (ch === "/" || ch === "\\") {
        const d = ch === "/" ? 1 : -1;
        s += `<line class="rs-l" x1="${r2(cx(j) - (cw / 2) * d)}" y1="${r2(cy(i) + rh / 2 - 3)}" x2="${r2(cx(j) + (cw / 2) * d)}" y2="${r2(cy(i) - rh / 2 + 3)}"/>`;
      } else if (ch === "·" || ch === ":") {
        if (ch === ":") s += `<circle class="rs-f" cx="${r2(cx(j))}" cy="${r2(cy(i) - 3.5)}" r="1.7"/><circle class="rs-f" cx="${r2(cx(j))}" cy="${r2(cy(i) + 3.5)}" r="1.7"/>`;
        else s += `<circle class="rs-f" cx="${r2(cx(j))}" cy="${r2(cy(i) + (lines[i + 1] ? 5 : -5))}" r="1.7"/>`;
      } else {
        while (k < line.length && !` ${H}=═≡|│‖/\\·:`.includes(line[k])) k++;
        const atomText = line.slice(j, k).join("").replace(/(?<=[A-Za-z)])\d+/g, (dgt) => [...dgt].map((q) => SUB[q]).join(""));
        s += text((cx(j) + cx(k - 1)) / 2, cy(i) + 5.5, atomText, { cls: "rs-at" });
      }
      j = k;
    }
  });
  return { w: cols * cw + 2 * P, h: lines.length * rh + 2 * P, svg: s };
}

const KINDS = { premica, mreža: mreza, stolpci, graf, skica, atom, molekula };
export const DRAW_KINDS = Object.keys(KINDS);

// Telo bloka v atributu data-risba (brskalnik iz njega izriše graf znova): brez znakov, ki bi jih Markdown ali
// HTML razumela po svoje (_ * ~ ' ( ) ! poleg tistih, ki jih zakodira že encodeURIComponent).
const kodiraj = (body) => encodeURIComponent(String(body)).replace(/[_*~'()!]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * Izriše en blok. Vrne { html, opis }; ob napaki v zapisu vrže Error s slovenskim opisom.
 * Graf z drsniki vrne še { svg (vsebina oznake <svg>), podnapis, drsniki: [{ name, lo, hi, step, start, label, value }] }.
 * opts.vrednosti: vrednosti drsnikov ({ k: 1.5 }; sicer začetne), opts.popustljivo: liki zunaj območja se izpustijo
 * (izris v brskalniku), opts.podatki: figura dobi data-risba (v tisku in PDF ne).
 */
export function renderDrawing(kind, body, { vrednosti = null, popustljivo = false, podatki = true } = {}) {
  const vrsta = String(kind || "").trim().toLowerCase();
  const fn = KINDS[vrsta] || fail(`neznana vrsta risbe »${kind || ""}« (vrste: ${DRAW_KINDS.join(", ")})`);
  const b = parseBody(body);
  const list = vrsta === "graf" ? drsniki(b) : [];
  const P = list.length ? okolje(list, vrednosti, popustljivo) : BREZ;
  const opis0 = b.one("opis");
  if (/[_^]/.test(opis0)) fail("opis bere bralnik zaslona: indekse in eksponente zapiši z besedami ali znaki Unicode (F₁, x², U Th), ne z _ ali ^");
  if (opis0.length < 20) fail("risba potrebuje »opis:« (vsaj 20 znakov): besedilo, ki sliko nadomesti slepemu učencu in inštruktorju");
  const opis = P.text(opis0);
  const { w, h, svg } = fn(b, P);
  const cap0 = b.one("podnapis");
  if (/[_^]/.test(cap0)) fail("podnapis: indekse in eksponente zapiši z besedami ali znaki Unicode (F₁, x², U Th), ne z _ ali ^");
  const cap = P.text(cap0);
  if (!popustljivo) for (const d of list) if (!P.used.has(d.name)) fail(`drsnik »${d.name}« se v risbi ne uporablja (v »f:«, koordinati ali napisu »{${d.name}}«)`);
  // Barve brez risbe.css (zavihek, odprt med objavo): liki prazni, črte in napisi v barvi besedila. CSS to povozi.
  const bare = svg
    .replace(/<text\b/g, '<text fill="currentColor" stroke="none"')
    .replace(/ class="(rs-f\b[^"]*)"/g, ' class="$1" fill="currentColor" stroke="none"')
    .replace(/ class="rs-g"/g, ' class="rs-g" stroke-opacity="0.14"');
  const inner = `<title>${esc(opis)}</title>${bare}`;
  const ziva = list.length && podatki ? ` risba-ziva" data-risba="${kodiraj(body)}` : "";
  const html = `<figure class="risba${ziva}"><svg class="rs" fill="none" stroke="currentColor" viewBox="0 0 ${r2(w)} ${r2(h)}" width="${r2(w)}" height="${r2(h)}" style="max-width:${Math.round(w * ZOOM)}px" role="img" aria-label="${esc(opis)}">${inner}</svg>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>`;
  if (!list.length) return { html, opis };
  return { html, opis, svg: inner, podnapis: cap, drsniki: list.map((d) => ({ ...d, value: P.vals[d.name] })) };
}

/** Opis risbe iz telesa bloka (za branje na glas in nadomestni prikaz); »{k}« dobi začetno vrednost drsnika. */
export function drawingText(body) {
  const opis = (/^\s*opis\s*:\s*(.+)$/im.exec(String(body ?? ""))?.[1] || "").trim();
  if (!opis.includes("{") || !/^\s*drsnik\s*:/im.test(String(body))) return opis;
  try {
    return okolje(drsniki(parseBody(body)), null, true).text(opis);
  } catch {
    return opis;
  }
}

/** Bloke »:::risba« v besedilu zamenja z risbo (html, print) ali z opisom (plain: inštruktor, branje, iskanje). */
export function expandDrawings(md, mode = "html") {
  return String(md ?? "").replace(DRAW_RE, (_, kind, body) => {
    try {
      const { html, opis } = renderDrawing(kind, body, { podatki: mode === "html" });
      // Prazni vrstici: HTML je samostojen blok, besedilo tik pod »:::« ostane odstavek Markdowna.
      return mode === "plain" ? `[Slika: ${opis}]` : `\n\n${html}\n\n`;
    } catch {
      // Napako v zapisu javi check-lesson.js; učenec vidi vsaj opis (brez opisa nič, ne prazen odstavek).
      const opis = drawingText(body);
      if (!opis) return "";
      return mode === "plain" ? `[Slika: ${opis}]` : `\n\n<p class="risba-opis">${esc(opis)}</p>\n\n`;
    }
  });
}

/** Napake v zapisu risb ene lekcije (za check-lesson.js). */
export function drawingErrors(md) {
  const out = [];
  for (const m of String(md ?? "").matchAll(DRAW_RE)) {
    try {
      const r = renderDrawing(m[1], m[2]);
      // Graf z drsniki se mora izrisati tudi na robovih območij (vse kombinacije najmanjše in največje vrednosti).
      const ds = r.drsniki || [];
      for (let i = 0; i < (ds.length ? 1 << ds.length : 0); i++) {
        const vrednosti = Object.fromEntries(ds.map((d, j) => [d.name, (i >> j) & 1 ? d.hi : d.lo]));
        try {
          renderDrawing(m[1], m[2], { vrednosti, popustljivo: true });
        } catch (e) {
          fail(`pri ${ds.map((d) => `${d.name} = ${fmt(vrednosti[d.name])}`).join(", ")}: ${e.message}`);
        }
      }
    } catch (e) {
      out.push(`risba »${m[1] || "?"}«: ${e.message}`);
    }
  }
  return out;
}
