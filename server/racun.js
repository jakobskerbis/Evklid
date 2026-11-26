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
import { texToText } from "../public/scan/solvecore.js";
import { parse, compile, calcText } from "../public/graph/math.js";
import { notClaimAt, hasExercise } from "./live-check.js";

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

/** Vse trditve iz blokov RACUN v besedilu: [{ line, op, args }]. Odgovor inštruktorja: največ MAX_CLAIMS
 *  (čas za učenca); preverjanje lekcij (scripts/check-lesson.js) poda max = Infinity, da ne izpusti nobene. */
export function parseClaims(text, max = MAX_CLAIMS) {
  const out = [];
  for (const m of String(text || "").matchAll(BLOCK_RE)) {
    for (const raw of m[1].split("\n")) {
      const line = raw.replace(/^[\s\-*•]+/, "").trim();
      const k = /^([\p{L} ]{2,14}?)\s*:\s*(.+)$/u.exec(line);
      if (!k) continue;
      const op = OPS[k[1].trim().toLowerCase()];
      if (!op) continue;
      out.push({ line, op, args: k[2].split("|").map((s) => s.trim()) });
      if (out.length >= max) return out;
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

export async function checkClaims(claims, { max = MAX_CLAIMS, budgetMs = BUDGET_MS() } = {}) {
  const out = { checked: 0, failed: [], unsure: [], confirmed: [] };
  const t0 = Date.now();
  for (const c of claims.slice(0, max)) {
    let r;
    try {
      r = Date.now() - t0 > budgetMs ? { ok: null, why: "ni časa" } : await checkOne(c);
    } catch (e) {
      r = { ok: null, why: String(e?.message || e) };
    }
    if (r.ok === true) {
      out.checked++;
      out.confirmed.push(c);
    }
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

// Blok RACUN preveri le sebe (AUDIT-064): model zapiše trditve dvakrat, vidno in v bloku. Če vidno besedilo navede
// drugo vrednost neznanke kot blok (»$x = 5$«, v bloku »resi: 2*x+3=11 | x | 4«), je »potrjen« le blok, učenec pa vidi
// napačno vrednost. Zato se rešitve (»resi«) primerjajo z vrednostmi iste neznanke v vidnem besedilu.
// Število po istem pravilu kot kalkulatorja (calcText: decimalna vejica, »1 000«); »1.000« (tisočice ali decimalke?)
// ni jasno in se ne bere (pregled #1016).
const numOf = (t) => {
  const raw = String(t).trim();
  if (/(?<![\d.,])[1-9]\d{0,2}(?:\.\d{3})+(?![\d,.])/.test(raw)) return null;
  try {
    const v = compile(parse(calcText(raw, { comma: true })))({});
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};
const close = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
// Vrednost, ki jo besedilo navede kot rešitev (pregled prevzema 3): pred njo je v istem stavku »rešitev«, »ničla«,
// »torej« … ali pa vrstica nima drugega besedila kot zapise (»$x_1 = 2$, $x_2 = 3$«). »Teme je v $x = 2{,}5$«, »Izločimo
// $x = 1$«, »Na intervalu od $x = 0$ …« zato niso rešitve.
const SOLUTION_WORD = /(?<!\p{L})(?:rešit\p{L}*|ničl\p{L}*|torej|zato|sledi|dobimo|solution\p{L}*|therefore|hence|zero\p{L}*)(?!\p{L})/iu;
const MATH_SEG = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
/**
 * Vrednosti neznanke, ki jih vidno besedilo (brez blokov) navede kot rešitev. Vrstica se preskoči kot pri končnih
 * vrednostih na main (SKIP_LINE: vprašanje, »če«, »ali«, učenčev zapis, »poskus« …), tudi vrstica z drugo enačbo v tej
 * neznanki (»Za vajo: reši $3x = 15$. Rešitev: $x = 5$.«, »$2x = 8$, torej …«); od vrstice z vajo naprej se ne bere.
 * Približek (≈, ≐) in neenakost se ne bereta.
 */
const OTHER_TASK = /naloga|podobn|zdaj ti|še ena|(?<!\p{L})(?:your turn|try this|another)(?!\p{L})/iu;
// Vse vrednosti »$v = …$« v besedilu, tudi v preskočenih vrsticah (pregled prevzema 4).
function anyValues(plain, v) {
  const lhsRe = new RegExp(`^${v}(?:_?\\(?(\\d)\\)?)?$`);
  const out = [];
  for (const m of plain.matchAll(MATH_SEG)) {
    for (const piece of texToText(m[1] ?? m[2]).split(/,\s+|;|\bin\b/)) {
      const parts = piece.split("=").map((x) => x.trim());
      if (parts.length < 2 || !lhsRe.test(parts[0])) continue;
      const n = numOf(parts.at(-1).replace(/[.]$/, ""));
      if (n !== null) out.push(n);
    }
  }
  return out;
}
function visibleValues(text, v) {
  const plain = String(text || "").replace(BLOCK_RE, "").replace(/<<META[^<>]*>>/g, "");
  const lhsRe = new RegExp(`^${v}(?:_?\\(?(\\d)\\)?)?$`);
  const varRe = new RegExp(`(?<![a-zA-Z])${v}(?![a-zA-Z])`);
  const out = [];
  for (const line of plain.split("\n")) {
    // Od vaje ali druge naloge naprej se ne bere (pregled prevzema 4: »**Zdaj ti:** $3x + 1 = 16$«, »Podobna naloga: …«).
    if (hasExercise(line) || OTHER_TASK.test(line)) break;
    if (notClaimAt(line)) continue;
    const segs = [...line.matchAll(MATH_SEG)];
    if (!segs.length) continue;
    const texts = segs.map((m) => texToText(m[1] ?? m[2]));
    // druga enačba v tej neznanki (leva stran ni sama neznanka): od tod naprej postopek ali druga naloga
    if (texts.some((t) => t.includes("=") && varRe.test(t) && !lhsRe.test(t.split("=")[0].trim()))) break;
    const onlyMath = !/[\p{L}\d]/u.test(line.replace(MATH_SEG, " ").replace(/(?<!\p{L})(?:in|and|ter)(?!\p{L})/giu, " "));
    segs.forEach((m, k) => {
      const tex = m[1] ?? m[2];
      if (/\\pm|\\mp|[±∓]|\\approx|\\doteq|≈|≐|\\neq|≠|<|>|\\le|\\ge/.test(tex)) return;
      if (!onlyMath) {
        const before = line.slice(Math.max(0, m.index - 200), m.index);
        const cut = Math.max(before.lastIndexOf(". "), before.lastIndexOf("! "), before.lastIndexOf("? "));
        if (!SOLUTION_WORD.test(cut >= 0 ? before.slice(cut + 2) : before)) return;
      }
      // ločila med vrednostmi: », « (z presledkom), »;«, »in«, \quad; »2,5« je eno število
      for (const piece of texts[k].split(/,\s+|;|\bin\b/)) {
        const parts = piece.split("=").map((x) => x.trim());
        if (parts.length < 2 || !lhsRe.test(parts[0])) continue;
        const last = parts.at(-1).replace(/[.]$/, "");
        const n = numOf(last);
        // zaokrožena vrednost (»x = 1,41« za √2, »0,33« za 1/3): pol zadnjega zapisanega mesta
        const dec = /^[-−+]?\d+[.,](\d+)$/.exec(last.replace(/\s/g, ""))?.[1].length ?? null;
        if (n !== null) out.push({ n, tol: dec === null ? 0 : 0.5 * 10 ** -dec });
      }
    });
  }
  return out;
}
/**
 * Navedena rešitev, ki ni enaka nobeni rešitvi iz potrjenih blokov »resi« za to neznanko, je napaka. Ob dvomu nič:
 * rešitve iz bloka ni mogoče prebrati, ali besedilo navede več različnih vrednosti, kot ima naloga rešitev (»$x = 3$ …
 * ničli pa sta $x = 0$ in $x = 6$«: druge vrednosti so del razlage).
 */
export function visibleIssue(text, claims) {
  const sols = new Map();
  for (const c of claims) {
    if (c.op !== "solve" || c.args.length < 3 || !/^[a-zA-Z]$/.test(c.args[1])) continue;
    const raw = c.args[2].split(/[,;]/).map((x) => x.trim()).filter(Boolean);
    const vals = raw.map(numOf);
    const prev = sols.get(c.args[1]) || { vals: [], text: [], unsure: false };
    sols.set(c.args[1], { vals: [...prev.vals, ...vals.filter((x) => x !== null)], text: [...prev.text, c.args[2]], unsure: prev.unsure || !raw.length || vals.includes(null) });
  }
  for (const [v, s] of sols) {
    if (s.unsure) continue;
    const near = (x, y) => close(x.n, y) || Math.abs(x.n - y) <= x.tol * (1 + 1e-9);
    const seen = visibleValues(text, v);
    const keys = new Set();
    const distinct = seen.filter((x) => !keys.has(+x.n.toPrecision(9)) && keys.add(+x.n.toPrecision(9)));
    if (!distinct.length || distinct.length > new Set(s.vals).size) continue;
    // Pravilna vrednost kjerkoli v besedilu (tudi v preskočeni vrstici): brez sodbe (pregled prevzema 4).
    const plain = String(text || "").replace(BLOCK_RE, "").replace(/<<META[^<>]*>>/g, "");
    if (anyValues(plain, v).some((n) => s.vals.some((y) => close(n, y)))) continue;
    const bad = distinct.filter((x) => !s.vals.some((y) => near(x, y)));
    if (bad.length) {
      return `the answer text states ${v} = ${bad.map((x) => String(+x.n.toPrecision(10)).replace(".", ",")).join(", ")}, but the exactly checked solution is ${v} = ${s.text.join("; ")}`;
    }
  }
  return null;
}

/** Celoten krog za besedilo: trditve iz bloka → { checked, issue, failed, unsure, claims }. */
export async function checkAnswerClaims(text) {
  const claims = parseClaims(text);
  if (!claims.length) return { checked: 0, issue: null, failed: [], unsure: [], claims: 0 };
  const r = await checkClaims(claims);
  // Vidno besedilo le proti blokom, ki jih je SymPy res potrdil (pregled prevzema 2): nepreverjen blok ali blok z le
  // enim od dveh korenov ni »točno preverjena rešitev«; brez SymPy ni primerjave.
  const own = claimIssue(r);
  const seen = own || r.failed.length ? null : visibleIssue(text, r.confirmed || []);
  // sure: neskladje z rešitvijo, ki jo je SymPy potrdil (AUDIT-060: opomba brez modela, ko popravek ni mogoč).
  return { ...r, issue: own || seen, sure: !!seen, claims: claims.length };
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
