// Preglednica (kot Casio fx-991CW »Preglednica«): 5 stolpcev A–E × 45 vrstic, števila, besedilo in formule z »=«.
// Formule: =A1+B2, =sum(A1:A5), =mean(B1:B10), min, max, median, stdev, count; $A$1 se pri polnjenju ne premakne.
// Računa scicore.evaluate (isti zapis kot znanstveni kalkulator). Brez DOM (testi v test/tools.test.js).
import { evaluate } from "./scicore.js";
import { readNumber } from "./toolscore.js";

export const COLS = ["A", "B", "C", "D", "E"];
export const ROWS = 45;

// sklic ali obseg: A1, $B$12, a3:C7 (ne sredi imena, npr. »mean« ali »log2«)
const REF = /(?<![A-Za-z0-9_.$])(\$?)([A-Ea-e])(\$?)([1-9]\d?)(?![\d(A-Za-z_])/g;
const RANGE = /(?<![A-Za-z0-9_.$])\$?([A-Ea-e])\$?([1-9]\d?)\s*:\s*\$?([A-Ea-e])\$?([1-9]\d?)(?![\d(A-Za-z_])/g;

export const cellName = (c, r) => `${COLS[c]}${r + 1}`;
export function parseCell(name) {
  const m = /^([A-Ea-e])([1-9]\d?)$/.exec(String(name || ""));
  if (!m) return null;
  const c = COLS.indexOf(m[1].toUpperCase());
  const r = Number(m[2]) - 1;
  return r < ROWS ? { c, r } : null;
}

/** Je vsebina formula (začne se z »=«)? */
export const isFormula = (s) => /^\s*=/.test(String(s ?? ""));

/**
 * Premakne relativne sklice formule za dr vrstic in dc stolpcev (polnjenje, kopiranje).
 * Sklic, ki pade iz preglednice, postane »#REF« (formula je potem napačna).
 */
export function shiftRefs(src, dr, dc = 0) {
  if (!isFormula(src)) return src;
  return String(src).replace(REF, (m, dcol, col, drow, row) => {
    const c = dcol ? COLS.indexOf(col.toUpperCase()) : COLS.indexOf(col.toUpperCase()) + dc;
    const r = drow ? Number(row) : Number(row) + dr;
    if (c < 0 || c >= COLS.length || r < 1 || r > ROWS) return "#REF";
    return `${dcol}${COLS[c]}${drow}${r}`;
  });
}

/**
 * Napolni celice pod (ali desno od) izvorne s premaknjeno vsebino. Vrne novo kopijo celic.
 * fill(cells, "A2", "A10") → A3 … A10 dobijo formulo iz A2 s sklici, premaknjenimi za 1, 2 … vrstic.
 */
export function fill(cells, from, to) {
  const a = parseCell(from);
  const b = parseCell(to);
  const out = { ...cells };
  if (!a || !b) return out;
  const src = cells[cellName(a.c, a.r)] ?? "";
  for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++) {
    for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) {
      if (r === a.r && c === a.c) continue;
      const v = shiftRefs(src, r - a.r, c - a.c);
      if (v === "") delete out[cellName(c, r)];
      else out[cellName(c, r)] = v;
    }
  }
  return out;
}

// imena kot na Casiu (Sum, Mean …) in Excelu (SUM, AVERAGE …) → imena math.js
const FN = { sum: "total", average: "mean", avg: "mean", mean: "mean", min: "min", max: "max", median: "median", stdev: "stdev", count: "count" };

/**
 * Izračuna vse celice.
 * cells: { A1: "3", B1: "=A1*2", C1: "višina" }
 * @returns {{ [name]: { v?: number, text?: string, err?: "syntax"|"cycle"|"ref"|"undef" } }}
 */
export function evalSheet(cells, { comma = true } = {}) {
  const res = {};
  const busy = new Set();
  const get = (name) => {
    if (res[name]) return res[name];
    const raw = String(cells[name] ?? "").trim();
    if (!raw) return (res[name] = {});
    if (!isFormula(raw)) {
      const v = readNumber(raw);
      return (res[name] = Number.isFinite(v) ? { v } : { text: raw });
    }
    if (busy.has(name)) return { err: "cycle" };
    busy.add(name);
    let r;
    try {
      r = formula(raw.replace(/^\s*=/, ""));
    } finally {
      busy.delete(name);
    }
    return (res[name] = r);
  };
  // vrednost sklica kot besedilo za račun; null = napaka (err)
  const lit = (v) => (v < 0 ? `(${v})` : String(v));
  function formula(src) {
    if (/#REF/i.test(src)) return { err: "ref" };
    let bad = null;
    const take = (name) => {
      const x = get(name);
      if (x.err) bad ||= x.err === "cycle" ? "cycle" : "ref";
      else if (x.text != null) bad ||= "ref";
      return x;
    };
    // obsegi: prazne celice se ne štejejo (kot v Excelu); vrednosti postanejo argumenti funkcije
    let s = src.replace(RANGE, (m, c1, r1, c2, r2) => {
      const ca = COLS.indexOf(c1.toUpperCase());
      const cb = COLS.indexOf(c2.toUpperCase());
      const ra = Number(r1) - 1;
      const rb = Number(r2) - 1;
      if (ra >= ROWS || rb >= ROWS) {
        bad ||= "ref";
        return "0";
      }
      const vals = [];
      for (let c = Math.min(ca, cb); c <= Math.max(ca, cb); c++)
        for (let r = Math.min(ra, rb); r <= Math.max(ra, rb); r++) {
          const x = get(cellName(c, r));
          if (x.err) bad ||= x.err === "cycle" ? "cycle" : "ref";
          else if (Number.isFinite(x.v)) vals.push(lit(x.v));
        }
      return vals.join(";");
    });
    s = s.replace(REF, (m, d1, col, d2, row) => {
      const p = parseCell(`${col}${row}`);
      if (!p) {
        bad ||= "ref";
        return "0";
      }
      const x = take(cellName(p.c, p.r));
      return Number.isFinite(x.v) ? `(${x.v})` : "0"; // prazna celica šteje 0
    });
    if (bad) return { err: bad };
    // sum(…; …) → total([…; …]): vsi argumenti (tudi obsegi) v en seznam
    let out = "";
    let i = 0;
    const re = /(?<![A-Za-z_])([A-Za-z]+)\s*\(/g;
    let m;
    while ((m = re.exec(s))) {
      const f = FN[m[1].toLowerCase()];
      if (!f || m.index < i) continue;
      let depth = 1;
      let j = re.lastIndex;
      for (; j < s.length && depth; j++) depth += s[j] === "(" ? 1 : s[j] === ")" ? -1 : 0;
      const inner = s.slice(re.lastIndex, depth ? s.length : j - 1);
      const args = inner.split(";").map((x) => x.trim()).filter(Boolean);
      let call;
      if (args.length) call = `${f}([${args.join(";")}])`;
      else if (f === "count" || f === "total") call = "0";
      else return { err: "undef" };
      out += s.slice(i, m.index) + call;
      i = depth ? s.length : j;
      re.lastIndex = i;
    }
    s = out + s.slice(i);
    // »=A1:A3« brez funkcije: več vrednosti, ki jih ni s čim združiti
    let depth = 0;
    for (const ch of s) {
      if ("([".includes(ch)) depth++;
      else if (")]".includes(ch)) depth--;
      else if (ch === ";" && depth <= 0) return { err: "syntax" };
    }
    const r = evaluate(s, { comma });
    if (!r || r.error) return { err: r?.error?.code === "missing" || r?.error?.code === "notCalc" || !r ? "syntax" : r.error.code === "undef" ? "undef" : "syntax" };
    return Number.isFinite(r.value) ? { v: r.value } : { err: "undef" };
  }
  for (const name of Object.keys(cells)) get(name);
  return res;
}

/** Vsota, povprečje, najmanjša in največja vrednost števil v vsakem stolpcu (null: stolpec brez števil). */
export function columnStats(res) {
  return COLS.map((col) => {
    const vals = [];
    for (let r = 0; r < ROWS; r++) {
      const x = res[`${col}${r + 1}`];
      if (x && Number.isFinite(x.v)) vals.push(x.v);
    }
    if (!vals.length) return null;
    const sum = vals.reduce((a, b) => a + b, 0);
    return { n: vals.length, sum, mean: sum / vals.length, min: Math.min(...vals), max: Math.max(...vals) };
  });
}
