// Izseki iz prebranih strani (docs/priprava.md, PR 3a): vsak vir se razreže na izseke z izvorom (vir, stran,
// zaporedje, vrsta). Vse, kar bo sistem pozneje ustvaril (razlaga, kartica, vprašanje, naloga), se sklicuje na id-je
// izsekov. Brez AI: vrsto določi koda po znakih v besedilu (definicija, izrek, postopek, formula, primer, naloga,
// teorija), naslov razdelka gre s vsakim izsekom.
// Negotovo branje se nikoli ne popravi z ugibanjem (docs/priprava.md »Načela«):
// - »x2«, »a2« zunaj formule je lahko x², 2x ali x₂: ostane, kot je, z oznako [?];
// - nedvoumne kemijske formule brez indeksov (H2SO4) se dopolnijo (H₂SO₄), a z oznako [?], da učenec vidi popravek;
// - formula ($…$), ki je KaTeX ne izriše, ostane z oznako [?].
import katex from "katex";
import { napakaIzraza } from "../../public/mat/izris.js";
import { zVarnimBrisanjem } from "./shramba.js";

export const VRSTE = ["definicija", "izrek", "postopek", "formula", "primer", "naloga", "teorija"];
export const IZSEK_MAX = 1200; // znakov na izsek; daljši odstavek se razdeli po povedih
export const NEGOTOVO = "[?]";

// Kemijski elementi (za ločevanje H2O od x2).
const ELEMENTI = new Set(
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr".split(" "),
);
const PODPISANO = "₀₁₂₃₄₅₆₇₈₉";

// Ali je beseda (npr. H2SO4, Na2SO4, CO2, Fe2O3) kemijska formula s številkami, ki bi morale biti indeksi.
function kemijska(w) {
  if (!/\d/.test(w) || !/^[A-Z(]/.test(w)) return false;
  const deli = w.match(/[A-Z][a-z]?\d*|\(|\)\d*/g);
  // En sam simbol s številko (F2, R1, H2) je navadno oznaka z indeksom (sila F₂, upor R₁): ni negotov, ne popravljamo.
  if (!deli || deli.join("") !== w || deli.filter((d) => /^[A-Z]/.test(d)).length < 2) return false;
  return deli.every((d) => d === "(" || /^\)\d*$/.test(d) || ELEMENTI.has(d.replace(/\d+$/, "")));
}
const vPodpis = (w) => w.replace(/(?<=[A-Za-z)])\d+/g, (d) => [...d].map((c) => PODPISANO[Number(c)]).join(""));

// Deli besedila zunaj in znotraj formul ($…$ in $$…$$).
function deli(t) {
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let i = 0;
  let m;
  while ((m = re.exec(t))) {
    if (m.index > i) out.push({ tekst: t.slice(i, m.index) });
    out.push({ formula: m[1] ?? m[2], blok: m[1] !== undefined, surovo: m[0] });
    i = re.lastIndex;
  }
  if (i < t.length) out.push({ tekst: t.slice(i) });
  return out;
}

// Izriše isto kot aplikacija (skupni izris public/mat/izris.js); false = formula se ne izriše.
export const izrise = (latex, blok = false) => napakaIzraza(latex, { blok, katex }) === null;

/**
 * Ali so vse števke v zapisu gotovo indeksi, ne potence (K-10). To ni ugibanje, ker:
 * - potenca 0 ali 1 v zapiskih ne nastopa (v0, e0, ε0, q1, a1b1), razen kot ulomek ali decimalka (x1/2, x0,5);
 * - »^« tik za zadnjo števko (a1^2, v0^2) pomeni, da je ta števka indeks;
 * - par ena črka + ena števka brez koeficienta (x2, q2) je indeks samo v ustaljenem zapisu z isto črko z indeksom 0
 *   ali 1 (sosedom): q1q2, x1 + x2, x1·x2, x1, x2, a1b1 + a2b2, x1 = 3, x2 = …, (x - x1)(x - x2), x2 - x1, y2 - y1.
 *   Sama bližina ne zadošča (Evklidov izrek a2 = c · a1: a2 je kvadrat, a1 projekcija).
 * Vse drugo (x2, 6x2, ab2, at2, πr2, x2y, x10, r22) ostane negotovo. kje = odmik zapisa w v besedilu cel.
 */
const SOSED = (c, d) => `(?<!\\p{L})(?:\\p{L}[01])*${c}${d}(?:\\p{L}[01])*`;
function indeksZapis(koef, w, za, cel, kje) {
  const skupine = [...w.matchAll(/(\p{L}{1,3})(\d{1,2})/gu)];
  const cisto = !koef && /^(?:\p{L}\d)+$/u.test(w);
  const zadnja = skupine.length - 1;
  const poZapisu = cel.slice(kje + w.length, kje + w.length + 3);
  return skupine.every((m, i) => {
    const [, crke, st] = m;
    const konec = m.index + m[0].length === w.length;
    if (konec && i === zadnja && za === "^") return true;
    if (st === "0" || st === "1") {
      // Ulomek ali decimalka za števko (x1/2, x0,5) je lahko potenca; x1,2 (obe rešitvi) je indeks.
      if (konec && /^[/,.]\d/.test(poZapisu) && !(st === "1" && /^,2(?!\d)/.test(poZapisu))) return false;
      return true;
    }
    if (!cisto || st.length > 1) return false;
    const kjeS = kje + m.index;
    const pred = cel.slice(Math.max(0, kjeS - 40), kjeS);
    const po = cel.slice(kjeS + 2, kjeS + 30);
    // Sosed je neposredno prejšnji indeks iste črke (x1 pred x2, nikoli v0 pred v2: v0, v2 = v02 + 2as je v²).
    const prejsnji = Number(st) - 1;
    const s = SOSED(crke, prejsnji);
    // Za vrednostjo (x1 = 3, x2 = -3): samo neposredno prejšnji indeks (x1 pred x2, a2 pred a3, nikoli v0 pred v2), za
    // žetonom »=« in kratka vrednost brez iste črke z indeksom (a2 = c · a1 je Evklidov a², v0 = 0, v2 = 2gh je v²).
    const zaVrednostjo = () => {
      if (!new RegExp(`(?<!\\p{L})${crke}${prejsnji}\\s*=\\s*[^,;=()]{1,10}(?:[,.]|\\s(?:in|ter))\\s*$`, "u").test(pred)) return false;
      const v = /^\s*=\s*([^,;=]{1,12}?)\s*(?:[,;\n]|\.(?:\s|$)|\s(?:in|ter)\s|$)/u.exec(po);
      return !!v && !/\p{L}\d/u.test(v[1]); // a2 = c · a1, a2 = 36 cm2
    };
    // Veriga indeksov (x1 + x2, (a1 + b1, a2 + b2), A(x1, y1), B(x2, y2), a1 + a2 + … + a5).
    const vez = `(?:[+\\-−±·*,]|in|ter|\\)\\s*(?:,|in|ter)\\s*\\p{L}{0,2}\\d?\\()`;
    return [
      new RegExp(`${s}\\s*$`, "u"), // q1q2, q1 q2, x1x2
      new RegExp(`${s}(?:\\s*${vez}\\s*(?:\\p{L}\\d)*){1,6}$`, "u"),
      new RegExp(`${s}\\)\\s*\\(\\s*\\p{L}?\\s*[-+−]\\s*$`, "u"), // (x - x1)(x - x2)
    ].some((re) => re.test(pred)) || zaVrednostjo() || new RegExp(`^\\s*[-−·*]\\s*${crke}${prejsnji}(?![\\d^]|[,.]\\d)`, "u").test(po); // x2 - x1
  });
}

// Ali je števka za zaklepajem na mestu z lahko potenca ((a + b)2, (-3)2, (2x)2, (sin x)2), ne oznaka a), 1), (1), (a) ali (str. 5).
function izrazVOklepaju(cel, z) {
  const o = cel.lastIndexOf("(", z);
  if (o < 0 || cel.lastIndexOf(")", z - 1) > o) return false;
  const v = cel.slice(o + 1, z).trim();
  return !!v && !/^(?:\d+|\p{L})$/u.test(v) && !/^(?!(?:sin|cos|tg|tan|ctg|cot|ln|log|lg|exp|arc\p{L}+|sh|ch|th)(?!\p{L}))\p{L}{2,}\.?\s/iu.test(v);
}

// Pregled enega dela niza (brez oklepajev izraza): koeficient, kemijska formula, zapis črka + števka.
function preglejKos(run, off, cel, negotovo) {
  const koef = /^\d*/.exec(run)[0];
  const w = run.slice(koef.length);
  if (!w || !/\d/.test(w) || !/^[\p{L}(]/u.test(w)) return run;
  const za = cel[off + run.length] || "";
  // Naboj iona (SO42-, PO43−) ali potenca, ki sledi: števk ne spreminjamo, samo oznaka.
  const naboj = /^[+\-−⁺⁻^]/.test(za);
  if (kemijska(w)) {
    // Dopolnimo samo v kemijski enačbi (puščica) in brez naboja; sicer (BC2 v geometriji) samo oznaka.
    if (!naboj && /→|->|⟶|⇌|⇄/.test(cel)) {
      const p = vPodpis(w);
      negotovo.push({ vrsta: "kemija", izvirno: w, prepis: p });
      return `${koef}${p} ${NEGOTOVO}`;
    }
    negotovo.push({ vrsta: "zapis", izvirno: w });
    return `${run} ${NEGOTOVO}`;
  }
  // Ena do tri črke + številka brez presledka (x2, ab2, x12, x2y, AB2): lahko potenca, produkt ali indeks.
  // En sam velik simbol z indeksom (F2, R1) ostane brez oznake, prav tako zapis, ki je gotovo indeks (indeksZapis).
  if (/^(?:\p{L}{1,3}\d{1,2})+\p{L}{0,2}$/u.test(w) && !/^\p{Lu}\d+$/u.test(w) && !indeksZapis(koef, w, za, cel, off + koef.length)) {
    negotovo.push({ vrsta: "zapis", izvirno: w });
    return `${run} ${NEGOTOVO}`;
  }
  return run;
}

/**
 * Označi negotovo branje v enem izseku. Vrne { besedilo, negotovo: [{ vrsta, izvirno, prepis? }] }.
 * Besedilo ohrani vse, kar je bilo prebrano; popravek je samo pri kemijskih indeksih in vedno z [?].
 */
export function oznaciNegotovo(t) {
  const negotovo = [];
  const out = deli(t).map((d) => {
    if (d.formula !== undefined) {
      if (izrise(d.formula, d.blok)) return d.surovo;
      negotovo.push({ vrsta: "formula", izvirno: d.surovo });
      return `${d.surovo} ${NEGOTOVO}`;
    }
    // Absolutna vrednost s črko in števko tik za njo (|a|2): lahko |a|² ali |a|·2.
    const tekst = d.tekst.replace(/(\|[^|\s]{0,5}\p{L}[^|\s]{0,5}\|)(\d{1,2})(?!\d|[,.]\d)/gu, (m, abs, st) => {
      negotovo.push({ vrsta: "zapis", izvirno: m });
      return `${abs}${st} ${NEGOTOVO}`;
    });
    // Celi nizi črk, števk in oklepajev (linearno); števke na začetku so koeficient (3x2, 2H2O) in ostanejo.
    // Kemijska formula z oklepaji (Ca(OH)2, (NH4)2SO4) se pregleda cela; sicer so oklepaji oklepaji izraza
    // (»(6x2«, »ln(x2«, »r2)«) in se vsak del med njimi pregleda posebej.
    return tekst.replace(/[\p{L}\p{N}_()\\]+/gu, (celNiz, off0, cel) => {
      if (celNiz.includes("\\") || celNiz.includes("_")) return celNiz;
      const odpri = (celNiz.match(/\(/g) || []).length;
      const zapri = (celNiz.match(/\)/g) || []).length;
      const pred = "(".repeat(Math.min(Math.max(0, odpri - zapri), /^\(*/.exec(celNiz)[0].length));
      const po = ")".repeat(Math.min(Math.max(0, zapri - odpri), /\)*$/.exec(celNiz)[0].length));
      const jedro = celNiz.slice(pred.length, celNiz.length - po.length);
      // Ves niz v enem paru oklepajev (»(CH3COOH)«, »(x2)«) je oklepaj besedila ali izraza, ne del formule.
      if (/^\([^()]*\)$/.test(jedro)) return `${pred}(${preglejKos(jedro.slice(1, -1), off0 + pred.length + 1, cel, negotovo)})${po}`;
      const brezKoef = jedro.replace(/^\d+/, "");
      if (/[()]/.test(jedro) && kemijska(brezKoef)) return `${pred}${preglejKos(jedro, off0 + pred.length, cel, negotovo)}${po}`;
      let off = off0;
      return celNiz
        .split(/([()])/)
        .map((kos, i, vsi) => {
          // Števka tik za zaklepajem izraza ((a + b)2, (x + 1)2): lahko kvadrat ali množenje.
          if (/^\d{1,2}$/.test(kos) && vsi[i - 1] === ")" && !/^[,.]\d/.test(cel.slice(off + kos.length)) && izrazVOklepaju(cel, off - 1)) {
            negotovo.push({ vrsta: "zapis", izvirno: `)${kos}` });
            off += kos.length;
            return `${kos} ${NEGOTOVO}`;
          }
          const r = kos === "(" || kos === ")" || !kos ? kos : preglejKos(kos, off, cel, negotovo);
          off += kos.length;
          return r;
        })
        .join("");
    });
  });
  // Formula iz Worda, ki je uvoz ni mogel prebrati (uvoz.js omml): ostane oznaka.
  for (const _ of t.matchAll(/\[formula\] \[\?\]/g)) negotovo.push({ vrsta: "formula", izvirno: "[formula]" });
  return { besedilo: out.join(""), negotovo };
}

// Vrsta izseka po besedilu (brez AI). Vrstni red pravil je pomemben: najprej izrecne oznake.
export function vrstaIzseka(t, { alineje = false } = {}) {
  // Vrsta se bere iz začetka bloka (oznake so na začetku); tudi omeji čas regularnih izrazov.
  const s = t.trim().slice(0, 300);
  const z = s.toLowerCase();
  if (/^(definicija|def\.)\b|^definition\b/.test(z) || /\b(imenujemo|pravimo|definiramo)\b/.test(z) || /\bje (tisti|tista|tisto)\b/.test(z)) return "definicija";
  if (/^(izrek|zakon|pravilo|lastnost|trditev|lema|posledica)\b/.test(z) || /\b(izrek|zakon)\b.*:/.test(z) || /^[\p{L} -]{3,40}(formula|zakon|izrek)\s*:/u.test(z)) return "izrek";
  if (/^(primer|zgled|example)\b/.test(z)) return "primer";
  if (/^(\d+\.\s*)?(naloga|vaja)\b/.test(z) || /^\d+[.)]\s*\(\s*\d+\s*točk/.test(z) || /^(izračunaj|reši|določi|poišči|nariši|dokaži|pojasni|razloži|opiši|naštej|primerjaj|koliko|kolikšn)/.test(z) || /\(\s*\d+\s*(točk[ae]?|točki|t\.?)\s*\)/.test(z)) return "naloga";
  if (/^(postopek|koraki|navodilo)\b/.test(z) || (alineje && /^\s*1[.)]/.test(s))) return "postopek";
  // Pretežno formula: več kot 60 % znakov v $…$.
  const f = deli(s).filter((d) => d.formula !== undefined).reduce((a, d) => a + d.surovo.length, 0);
  if (f && f / s.length > 0.6) return "formula";
  return "teorija";
}

// Razdeli predolg odstavek po povedih (ne znotraj formul).
function razdeliDolgo(t) {
  if (t.length <= IZSEK_MAX) return [t];
  const povedi = [];
  let cur = "";
  for (const d of deli(t)) {
    const kos = d.formula !== undefined ? [d.surovo] : d.tekst.split(/(?<=[.!?])\s+/);
    kos.forEach((k, i) => {
      const sep = d.formula === undefined && i > 0 ? " " : "";
      if ((cur + sep + k).length > IZSEK_MAX && cur) {
        povedi.push(cur.trim());
        cur = k;
      } else cur += sep + k;
    });
  }
  if (cur.trim()) povedi.push(cur.trim());
  // Ena sama predolga poved: trdo po IZSEK_MAX.
  return povedi.flatMap((p) => (p.length <= IZSEK_MAX ? [p] : p.match(new RegExp(`[\\s\\S]{1,${IZSEK_MAX}}`, "g"))));
}

/**
 * Strani (uvoz.js) → izseki [{ stran, zaporedje, vrsta, naslov, besedilo, negotovo }]. zaporedje teče čez cel vir.
 * Bloki: prazna vrstica ali naslov zaključi blok; alineje se zberejo z vrstico pred njimi (»Pravila:« + alineje).
 */
export function razrezi(strani) {
  const izseki = [];
  let naslov = null;
  for (const s of strani) {
    let blok = [];
    let alineje = false;
    const zakljuci = () => {
      const t = blok.join("\n").trim();
      blok = [];
      const a = alineje;
      alineje = false;
      if (!t) return;
      const vrsta = vrstaIzseka(t, { alineje: a });
      for (const kos of razdeliDolgo(t)) {
        const o = oznaciNegotovo(kos);
        izseki.push({ stran: s.stran, zaporedje: izseki.length + 1, vrsta, naslov, besedilo: o.besedilo, negotovo: o.negotovo });
      }
    };
    for (const v of s.vrstice) {
      if (v.naslov) {
        zakljuci();
        naslov = v.besedilo.slice(0, 200);
        continue;
      }
      if (!v.besedilo) {
        // Uvod z dvopičjem (»Pravila:«) počaka na alineje pod njim.
        if (!(blok.length && !alineje && /:\s*$/.test(blok[blok.length - 1]))) zakljuci();
        continue;
      }
      // Oštevilčena naloga (»1. (2 točki) Izračunaj …«) je svoj izsek.
      if (v.alineja && vrstaIzseka(v.besedilo.replace(/^\s*\d+[.)]\s*/, "")) === "naloga") {
        zakljuci();
        blok.push(v.besedilo);
        zakljuci();
        continue;
      }
      // Alineja po besedilu, ki ni uvod (ne konča z dvopičjem), začne nov blok.
      if (v.alineja && blok.length && !alineje && !/:\s*$/.test(blok[blok.length - 1])) zakljuci();
      if (!v.alineja && alineje) zakljuci();
      if (v.alineja) alineje = true;
      blok.push(v.besedilo);
    }
    zakljuci();
  }
  return izseki;
}

// ---------- shranjevanje ----------

/**
 * Zamenja izseke vira (ob ponovni obdelavi se stari izbrišejo) in zapiše stanje vira, v eni transakciji.
 * Vir je lahko med branjem PDF izginil (izbris, čiščenje): takrat ne zapiše ničesar in vrne false.
 * seal: crypto-polje.js seal (podan, da modul ostane brez stanja).
 */
// Postavke (razlage), nastale iz izsekov vira, gredo z njimi: ob ponovni obdelavi in izbrisu vira (navedki iz zapiskov).
export function izbrisiPostavkeVira(db, vir) {
  db.prepare(
    `DELETE FROM priprava_postavke WHERE priprava_id = ? AND EXISTS (
       SELECT 1 FROM json_each(priprava_postavke.izseki) j WHERE j.value IN (SELECT id FROM priprava_izseki WHERE vir_id = ?))`,
  ).run(vir.priprava_id, vir.id);
}
export function shraniIzseke(db, args) {
  // Stari izseki (ponovna obdelava) se izbrišejo s secure_delete, kot vsi podatki priprave.
  return zVarnimBrisanjem(db, () => shrani(db, args));
}
function shrani(db, { vir, izseki, strani, opozorila = [], stanje = "obdelan", seal }) {
  db.exec("BEGIN IMMEDIATE");
  try {
    if (!db.prepare("SELECT 1 FROM priprava_viri WHERE id = ? AND student_id = ?").get(vir.id, vir.student_id)) {
      db.exec("ROLLBACK");
      return false;
    }
    izbrisiPostavkeVira(db, vir);
    db.prepare("DELETE FROM priprava_izseki WHERE vir_id = ?").run(vir.id);
    const vpis = db.prepare(
      "INSERT INTO priprava_izseki (priprava_id, vir_id, student_id, stran, zaporedje, vrsta, naslov, besedilo, negotovo, ai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    for (const i of izseki)
      vpis.run(vir.priprava_id, vir.id, vir.student_id, i.stran ?? null, i.zaporedje, i.vrsta, i.naslov == null ? null : seal(i.naslov), seal(i.besedilo), i.negotovo?.length ? seal(JSON.stringify(i.negotovo)) : null, i.ai ? 1 : 0);
    db.prepare("UPDATE priprava_viri SET stanje = ?, strani = ?, napaka = NULL, opozorila = ? WHERE id = ?").run(stanje, strani, opozorila.length ? JSON.stringify(opozorila) : null, vir.id);
    db.exec("COMMIT");
    return true;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
