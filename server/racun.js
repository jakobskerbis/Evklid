// »Račun za kodo« (j, 2026-11-11: »da lahko odgovore inštruktorja vedno potrdimo s kodo«).
// Inštruktor na konec odgovora doda skrit blok z vsemi računskimi trditvami v strojni obliki, ena na vrstico:
//
//   <<RACUN
//   resi: x^2-5*x+6=0 | x | 2, 3
//   odvod: sin(x)^2 | x | 2*sin(x)*cos(x)
//   enote: 3.2*kg * 9.81*m/s^2 | 31.4*N
//   kemija: 2 H2 + O2 -> 2 H2O
//   >>
//
// Učenec bloka ne vidi (server/meta.js). Koda preveri vsako trditev: matematiko in enote SymPy (server/cas.js),
// kemijo naš urejevalnik enačb (public/graph/chemcore.js). Napačna trditev → isti »Popravek:« kot pri drugih
// najdbah (server/live-check.js). Trditev, ki je koda ne zna preveriti, ni napaka (šteje se kot nepreverjena).
import { casCheck } from "./cas.js";
import { parseSpecies } from "../public/graph/chemcore.js";
import { MASSES } from "../public/graph/pse-data.js";

// Tudi »RAČUN« (model piše slovensko); bloka učenec v nobeni obliki ne vidi (server/meta.js).
const BLOCK_RE = /<<\s*RA[CČ]UN\b([\s\S]*?)>>/g;
export const MAX_CLAIMS = 16;

// Ključne besede (slovensko ali angleško) → ukaz preverjevalnika.
const OPS = {
  resi: "solve", reši: "solve", solve: "solve", sistem: "solve",
  enako: "equal", equal: "equal", poenostavi: "equal", razstavi: "equal", identiteta: "equal",
  odvod: "diff", diff: "diff", derivative: "diff",
  integral: "int", int: "int",
  limita: "limit", limit: "limit",
  vrednost: "value", value: "value", racun: "value", račun: "value", matrika: "value",
  neenacba: "ineq", neenačba: "ineq", ineq: "ineq",
  enote: "units", units: "units", fizika: "units",
  kemija: "chem", chem: "chem", reakcija: "chem",
  molska: "molar", molar: "molar", "molska masa": "molar",
};

/** Vse trditve iz blokov RACUN v besedilu: [{ line, op, args }]. */
export function parseClaims(text) {
  const out = [];
  for (const m of String(text || "").matchAll(BLOCK_RE)) {
    for (const raw of m[1].split("\n")) {
      const line = raw.replace(/^[\s\-*•]+/, "").trim();
      const k = /^([\p{L} ]{2,14}?)\s*:\s*(.+)$/u.exec(line);
      if (!k) continue;
      const op = OPS[k[1].trim().toLowerCase()];
      if (!op) continue;
      out.push({ line, op, args: k[2].split("|").map((s) => s.trim()) });
      if (out.length >= MAX_CLAIMS) return out;
    }
  }
  return out;
}

export const hasClaimBlock = (text) => /<<\s*RA[CČ]UN\b/.test(String(text || ""));

// ---------------------------------------------------------------------------
// Kemija (brez Pythona)

const ARROW = /⇌|<=>|<->|⟶|→|->|=>|=/;
function sideOf(side) {
  return side
    .split(/\+(?=\s*(?:\d+(?:\/\d+)?\s*)?[A-Z([e])/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const m = /^(\d+(?:\/\d+)?)\s*(?=[A-Z([e])(.*)$/.exec(x);
      const coef = m ? (m[1].includes("/") ? Number(m[1].split("/")[0]) / Number(m[1].split("/")[1]) : Number(m[1])) : 1;
      return { coef, sp: parseSpecies(m ? m[2] : x, MASSES) };
    });
}

/** Ali je zapisana enačba reakcije urejena (atomi in naboj na obeh straneh)? */
export function chemBalanced(eq) {
  const s = String(eq || "").replace(/[−–]/g, "-");
  const parts = s.split(ARROW);
  if (parts.length !== 2) return { ok: null, why: "ni puščice" };
  const L = sideOf(parts[0]);
  const R = sideOf(parts[1]);
  if (!L.length || !R.length) return { ok: null, why: "prazna stran" };
  const bad = [...L, ...R].find((x) => x.sp.error);
  if (bad) return { ok: null, why: "zapisa zvrsti ne razumem" };
  const tally = (side) => {
    const t = new Map();
    let q = 0;
    for (const { coef, sp } of side) {
      for (const [el, n] of sp.counts) t.set(el, (t.get(el) || 0) + coef * n);
      q += coef * sp.charge;
    }
    return { t, q };
  };
  const a = tally(L);
  const b = tally(R);
  for (const el of new Set([...a.t.keys(), ...b.t.keys()])) {
    const x = a.t.get(el) || 0;
    const y = b.t.get(el) || 0;
    if (Math.abs(x - y) > 1e-9) return { ok: false, why: `${el}: levo ${x}, desno ${y}` };
  }
  if (Math.abs(a.q - b.q) > 1e-9) return { ok: false, why: `naboj: levo ${a.q}, desno ${b.q}` };
  return { ok: true, why: "" };
}

/** Molska masa: »H2SO4 | 98.08« (g/mol). Šolske tabele zaokrožajo Ar, zato je dovoljeno 0,6 % ali pol zadnjega mesta. */
export function molarOk(formula, claimed) {
  const sp = parseSpecies(String(formula || ""), MASSES);
  const c = Number(String(claimed || "").replace(",", ".").replace(/\s*g\/mol\s*$/i, "").trim());
  if (sp.error || !Number.isFinite(c) || !(sp.M > 0)) return { ok: null, why: "zapisa ne razumem" };
  const dec = (String(claimed).replace(",", ".").split(".")[1] || "").replace(/\D.*$/, "").length;
  const tol = Math.max(0.5 * 10 ** -dec, 0.006 * sp.M);
  const ok = Math.abs(sp.M - c) <= tol;
  return { ok, why: ok ? "" : `M = ${sp.M.toFixed(2)} g/mol` };
}

// ---------------------------------------------------------------------------

async function checkOne(c) {
  if (c.op === "chem") return chemBalanced(c.args[0]);
  if (c.op === "molar") return molarOk(c.args[0], c.args[1]);
  return casCheck(c.op, c.args);
}

/**
 * Preveri vse trditve. Vrne { checked, failed: [{ line, why }], unsure: [{ line, why }] }.
 * checked = koliko trditev je koda potrdila ali ovrgla.
 */
// Skupni rok za en odgovor: 16 počasnih trditev po 9 s bi učenca pustilo čakati minute.
const BUDGET_MS = () => Number(process.env.EVKLID_RACUN_BUDGET_MS) || 20_000;

export async function checkClaims(claims) {
  const out = { checked: 0, failed: [], unsure: [] };
  const t0 = Date.now();
  for (const c of claims.slice(0, MAX_CLAIMS)) {
    let r;
    try {
      r = Date.now() - t0 > BUDGET_MS() ? { ok: null, why: "ni časa" } : await checkOne(c);
    } catch (e) {
      r = { ok: null, why: String(e?.message || e) };
    }
    if (r.ok === true) out.checked++;
    else if (r.ok === false) {
      out.checked++;
      out.failed.push({ line: c.line, why: r.why });
    } else out.unsure.push({ line: c.line, why: r.why });
  }
  return out;
}

/** Besedilo za popravek (FIX_SYSTEM v server/live-check.js) ali null. */
export function claimIssue(res) {
  const f = res?.failed?.[0];
  if (!f) return null;
  return `an exact computer-algebra check of the claim »${f.line}« found it wrong (${f.why})`;
}

/** Celoten krog za besedilo: trditve iz bloka → { checked, issue, failed, unsure, claims }. */
export async function checkAnswerClaims(text) {
  const claims = parseClaims(text);
  if (!claims.length) return { checked: 0, issue: null, failed: [], unsure: [], claims: 0 };
  const r = await checkClaims(claims);
  return { ...r, issue: claimIssue(r), claims: claims.length };
}

// Števec (kv »racun_statistika«): { "2026-11-11": { odgovori, z_blokom, potrjene, napake, nepreverjene } },
// zadnjih 60 dni; pove, kolikšen del odgovorov je koda res preverila. Napaka pri zapisu ne ustavi odgovora.
export const STATS_KV = "racun_statistika";
export function noteClaimStats(db, { hadBlock, res }) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const cur = JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(STATS_KV)?.value || "{}");
    const d = (cur[day] ||= { odgovori: 0, z_blokom: 0, potrjene: 0, napake: 0, nepreverjene: 0 });
    d.odgovori++;
    if (hadBlock) d.z_blokom++;
    d.potrjene += (res?.checked || 0) - (res?.failed?.length || 0);
    d.napake += res?.failed?.length || 0;
    d.nepreverjene += res?.unsure?.length || 0;
    for (const k of Object.keys(cur).sort().slice(0, -60)) delete cur[k];
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(STATS_KV, JSON.stringify(cur));
  } catch {
    // brez tabele kv (stara baza v testu)
  }
}
