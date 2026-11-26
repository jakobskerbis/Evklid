#!/usr/bin/env node
// Lean dokazi lekcij (docs/lean.md, L2): vsaka datoteka lean/Evklid/Lekcije/**.lean ima v glavi
//   vir: content/lessons/<pot>.md
//   sha256: <zgoščena vrednost lekcije, ko je bil dokaz napisan in pregledan>
// Skripta javi, če lekcija ne obstaja več ali je bila spremenjena po dokazu (dokaz morda ni več za isto
// besedilo), in izpiše pokritost lekcij matematike.
//
// PV-09 (docs/preverjanje.md, docs/lean.md »Lekcije (L2)«): docstring vsakega izreka poveže izrek z vidno trditvijo
// lekcije, v skladu z zapisom trditve (public/preverjanje/trditev.js, polje dokaz: { izrek, sha256 }):
//   trditev: <MAT-SS-4/binomski-izrek>#<kratko-ime>      enoličen id trditve
//   besedilo: »<dobesedni izsek vidnega besedila lekcije>«
// ali vrstico »pomozno« (pomožna trditev, ni trditev lekcije). Citat iz »Preveri se« je le iz razlage (»>«, »~«).
// Izrek s predpostavkami (binderji, npr. (hk : k ≤ n), ali »→« v sklepu) ima ob sebi `example` brez lastnih
// predpostavk, ki izrek uporabi na argumentih, ali izrek `<izrek>_izpolnljivo`, ki uporabi `<izrek>`; kjer primer ni
// preprost, docstring izreka pove »izpolnljivo: ročno – <razlog>«. Starejši izreki brez primera so v
// lean/izpolnljivo-dolg.json (seznam se le krči).
// Kazalo trditev je lean/trditve.json (`--zapisi` ga napiše, privzeti zagon preveri, da je posodobljeno).
// Izhod 1 ob neujemanju (.github/workflows/lean-lekcije.yml; ni med testi za objavo, zato sprememba lekcije ne zadrži
// objave, le opozori).
// Uporaba: node scripts/lean-lekcije.mjs [--json] [--zapisi]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "lean", "Evklid", "Lekcije");
export const KAZALO = path.join(ROOT, "lean", "trditve.json");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (d.name.endsWith(".lean")) out.push(p);
  }
  return out;
}

// --- Branje Leana -------------------------------------------------------------------------------------------------

const IME_ZNAK = /[\p{L}\p{N}_'!?.₀-₉ᵢ-ᵪ]/u;

/** Besedilo, v katerem so komentarji in nizi zamenjani s presledki (vrstice ostanejo), in seznam docstringov. */
export function maskiraj(txt) {
  const m = txt.split("");
  const doci = [];
  const prazno = (a, b) => {
    for (let k = a; k < b; k++) if (m[k] !== "\n") m[k] = " ";
  };
  let i = 0;
  while (i < txt.length) {
    const c = txt[i];
    const n = txt[i + 1];
    if (c === "/" && n === "-") {
      const start = i;
      const doc = txt[i + 2] === "-" && txt[i + 3] !== "/";
      let globina = 1;
      i += 2;
      while (i < txt.length && globina) {
        if (txt[i] === "/" && txt[i + 1] === "-") (globina++, (i += 2));
        else if (txt[i] === "-" && txt[i + 1] === "/") (globina--, (i += 2));
        else i++;
      }
      prazno(start, i);
      if (doc) doci.push({ start, end: i, text: txt.slice(start + 3, i - 2) });
    } else if (c === "-" && n === "-") {
      const s = i;
      while (i < txt.length && txt[i] !== "\n") i++;
      prazno(s, i);
    } else if (c === '"') {
      const s = i++;
      while (i < txt.length && txt[i] !== '"') i += txt[i] === "\\" ? 2 : 1;
      i++;
      prazno(s + 1, i - 1);
    } else if (c === "r" && !IME_ZNAK.test(txt[i - 1] || "") && /^r#*"/.test(txt.slice(i, i + 40))) {
      // surovi niz r"…" ali r#"…"# (znotraj ni ubežnih znakov, konča ga " z enakim številom #)
      const hash = /^r(#*)"/.exec(txt.slice(i, i + 40))[1];
      const s = i;
      const konec = txt.indexOf(`"${hash}`, i + 2 + hash.length);
      i = konec < 0 ? txt.length : konec + 1 + hash.length;
      prazno(s + 1, i);
    } else if (c === "'" && !IME_ZNAK.test(txt[i - 1] || "")) {
      // znakovni literal 'a', '"', '\n', '\x41', '\u{…}' (»'« za imenom, npr. f', je del imena)
      const m = /^'(\\(?:u\{[0-9a-fA-F]+\}|x[0-9a-fA-F]{2}|.)|[^\\'\n])'/u.exec(txt.slice(i, i + 16));
      if (m) {
        prazno(i + 1, i + m[0].length - 1);
        i += m[0].length;
      } else i++;
    } else i++;
  }
  return { mask: m.join(""), doci };
}

const ODPRI = "([{⟨⦃";
const ZAPRI = ")]}⟩⦄";

/** Skupine binderjev pred dvopičjem izjave: [{ oklep, imena, tip }]. */
export function binderji(glava) {
  const out = [];
  let d = 0;
  let s = -1;
  for (let k = 0; k < glava.length; k++) {
    const ch = glava[k];
    if (ODPRI.includes(ch)) {
      if (d === 0) s = k;
      d++;
    } else if (ZAPRI.includes(ch)) {
      d--;
      if (d === 0) {
        const notri = glava.slice(s + 1, k);
        const j = notri.indexOf(":");
        out.push(j > 0
          ? { oklep: glava[s], imena: notri.slice(0, j).trim().split(/\s+/), tip: notri.slice(j + 1).replace(/\s+/g, " ").trim() }
          : { oklep: glava[s], imena: [], tip: notri.replace(/\s+/g, " ").trim() });
      }
    }
  }
  return out;
}

const RELACIJA = /[=≠<>≤≥∈∉⊆⊂∣↔∧∨¬≡]/;
const PREDIKAT = /\b(Continuous\w*|Differentiable\w*|HasDerivAt|HasDerivWithinAt|StrictMono\w*|StrictAnti\w*|Monotone\w*|Antitone\w*|Odd|Even|Prime|IsLeast|IsGreatest|Tendsto|IntervalIntegrable|Integrable\w*|Measurable\w*|Injective|Surjective|Bijective|Irreducible|Squarefree|Fact|IndepFun|Collinear|Coplanar|Function\.\w+)\b/;
const TIP = /^(ℝ|ℕ|ℤ|ℚ|ℂ|Prop|Type\*?|Sort\*?)$/;

/** Ali je binder predpostavka (dokaz trditve), ne spremenljivka ali razred (npr. [CommRing R]). */
export function jePredpostavka(b) {
  if (!b.imena.length && b.oklep === "[") return RELACIJA.test(b.tip) || /^Fact\b/.test(b.tip);
  if (!b.imena.length) return false;
  if (TIP.test(b.tip)) return false;
  if (RELACIJA.test(b.tip) || PREDIKAT.test(b.tip) || STRUKTURA_Z_DOKAZOM.test(b.tip)) return true;
  return b.imena.every((n) => /^h/.test(n)) && !/→/.test(b.tip) && !/^(Fin|Finset|Set|List|Polynomial|Matrix|EuclideanSpace)\b/.test(b.tip);
}

/** Imenski prostor na mestu `pos` (namespace … end; section ostane brez imena). Ukaz sme biti zamaknjen in imeti
 * predpone (»noncomputable section«, »public section«); »end X« zapre najbližji odprt blok. */
function imenskiProstor(mask, pos) {
  const sklad = [];
  const re = /^[ \t]*(?:(?:noncomputable|public|private|protected)[ \t]+)*(namespace|section|end)\b[ \t]*([^\s]*)/gm;
  let r;
  while ((r = re.exec(mask)) && r.index < pos) {
    if (r[1] === "namespace") sklad.push(r[2]);
    else if (r[1] === "section") sklad.push(null);
    else sklad.pop();
  }
  return sklad.filter(Boolean).join(".");
}

// Ključna beseda deklaracije kjerkoli v kodi (tudi zamaknjena ali za drugim ukazom v isti vrstici) in predpone pred njo.
const KLJUC = /(?<![\p{L}\p{N}_.'!?«])(theorem|lemma|example)(?![\p{L}\p{N}_'!?»])/gu;
const PREDPONA = /(@\[[^\]]*\]|(?<![\p{L}\p{N}_.'])(?:private|protected|noncomputable|public|nonrec|unsafe|partial))\s*$/u;
// Konec ukaza: naslednji ukaz na začetku vrstice ali »#check«, »#eval«, »#print« … kjerkoli (primer izpolnljivosti
// mora izrek uporabiti v sami deklaraciji, ne v ukazu za njo).
const UKAZ = /(?:^|\n)(?=(?:theorem|lemma|example|def|abbrev|instance|structure|inductive|class|namespace|section|end|open|variable|universe|set_option|attribute|noncomputable|private|protected|public|axiom|opaque|macro|syntax|elab|notation|infix[lr]?|prefix|postfix|local|scoped|alias|irreducible_def|@\[)(?![\p{L}\p{N}_'!?]))|(?<![\p{L}\p{N}_'!?])#[a-zA-Z_]/gu;

/** Izreki in primeri v datoteki Lean: [{ vrsta, ime, polnoIme, vrstica, start, doc, izjava, binderji, privatno, koda }]. */
export function deklaracije(txt) {
  const { mask, doci } = maskiraj(txt);
  const out = [];
  let r;
  KLJUC.lastIndex = 0;
  while ((r = KLJUC.exec(mask))) {
    let start = r.index;
    let predpone = "";
    for (let m; (m = PREDPONA.exec(mask.slice(Math.max(0, start - 400), start))); ) {
      const z = start - (Math.min(400, start) - m.index);
      predpone = mask.slice(z, start) + predpone;
      start = z;
    }
    const vrsta = r[1] === "lemma" ? "theorem" : r[1];
    let p = r.index + r[0].length;
    let ime = null;
    if (vrsta === "theorem") {
      const mm = /^\s+([^\s([{:⦃]+)/.exec(mask.slice(p));
      if (!mm) continue;
      ime = mm[1];
      p += mm[0].length;
    }
    // izjava do prvega »:=« na ničti globini (ali do vzorcev »| …« v naslednji vrstici)
    let d = 0;
    let k = p;
    let kolon = -1;
    for (; k < mask.length; k++) {
      const ch = mask[k];
      if (ODPRI.includes(ch)) d++;
      else if (ZAPRI.includes(ch)) d--;
      else if (d === 0 && ch === ":" && mask[k + 1] === "=") break;
      else if (d === 0 && ch === ":" && kolon < 0) kolon = k;
      else if (d === 0 && ch === "\n" && /^\n[ \t]*\|/.test(mask.slice(k, k + 80))) break;
    }
    const glava = mask.slice(p, kolon < 0 ? k : kolon);
    const izjava = mask.slice(kolon < 0 ? p : kolon + 1, k).replace(/\s+/g, " ").trim();
    let doc = null;
    for (let j = doci.length - 1; j >= 0; j--) {
      if (doci[j].end <= start) {
        if (/^\s*$/.test(mask.slice(doci[j].end, start))) doc = doci[j];
        break;
      }
    }
    const ns = imenskiProstor(mask, start);
    out.push({
      vrsta,
      ime,
      polnoIme: ime ? (ime.startsWith("_root_.") ? ime.slice(7) : ns ? `${ns}.${ime}` : ime) : null,
      vrstica: txt.slice(0, start).split("\n").length,
      start,
      telo: k,
      podpis: mask.slice(start, k).replace(/\s+/g, " ").trim(),
      doc,
      izjava,
      binderji: binderji(glava),
      privatno: /(?<![\p{L}\p{N}_.'])private(?![\p{L}\p{N}_'])/u.test(predpone),
    });
  }
  // koda deklaracije (brez komentarjev) do konca ukaza: primer izpolnljivosti mora izrek uporabiti
  out.forEach((d, i) => {
    const n = out[i + 1];
    let konec = n ? (n.doc && n.doc.start > d.start ? n.doc.start : n.start) : mask.length;
    UKAZ.lastIndex = d.telo;
    const u = UKAZ.exec(mask);
    if (u && u.index < konec) konec = u.index;
    d.koda = mask.slice(d.start, konec);
  });
  return out;
}

const globina0 = (s, f) => {
  let d = 0;
  for (let i = 0; i < s.length; i++) {
    if (ODPRI.includes(s[i])) d++;
    else if (ZAPRI.includes(s[i])) d--;
    else if (d === 0 && f(s, i)) return i;
  }
  return -1;
};

/** Izraz brez oklepajev, ki ga v celoti objemajo (»(A → B)« → »A → B«). */
function odvij(s) {
  s = s.trim();
  while (s[0] === "(" && s.endsWith(")")) {
    let d = 0;
    let cel = true;
    for (let i = 0; i < s.length; i++) {
      if (ODPRI.includes(s[i])) d++;
      else if (ZAPRI.includes(s[i])) d--;
      if (d === 0 && i < s.length - 1) { cel = false; break; }
    }
    if (!cel) break;
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** Ali ima sklep izreka predpostavko: »→« (ali »->«) na ničti globini v enem od veznikov »∧« (tudi v oklepaju, npr.
 * »(∀ x, 0 < x → …) ∧ …«), za začetnimi »∀ …,«, ali omejen »∀« (»∀ x > 0,«, »∀ x ∈ S,«, »∀ (hx : 0 < x),«).
 * Zanikanje (»¬ …«), »∃ …«, »let …« in »fun …« niso predpostavke izreka. */
export function implikacija(izjava) {
  const preveri = (v) => {
    v = odvij(v);
    // »¬ ∀ …«, »∃ …«, »let …« in »fun …« segajo do konca; sam »¬ a« veže močneje kot »∧« (»¬ a ∧ b« = »(¬ a) ∧ b«)
    if (!v || /^(¬\s*[∀∃]|∃|let\b|fun\b|λ)/.test(v)) return false;
    if (/^∀/.test(v)) {
      const k = globina0(v.slice(1), (t, i) => t[i] === ",");
      if (k < 0) return false;
      const vez = v.slice(1, k + 1);
      // omejen kvantifikator ali binder s predpostavko
      if (globina0(vez, (t, i) => /[<>≤≥≠∈∉⊆⊂⊇⊃]/.test(t[i])) >= 0) return true;
      if (binderji(vez).some(jePredpostavka)) return true;
      return preveri(v.slice(k + 2));
    }
    const deli = [];
    let rest = v;
    for (let k; (k = globina0(rest, (t, i) => t[i] === "∧")) >= 0; rest = rest.slice(k + 1)) deli.push(rest.slice(0, k));
    deli.push(rest);
    if (deli.length > 1) return deli.some(preveri);
    return globina0(v, (t, i) => t[i] === "→") >= 0;
  };
  return preveri(String(izjava).replace(/->/g, "→"));
}

const ubezi = (ime) => ime.replace(/[.*+?^${}()|[\]\\]/g, (c) => `\\${c}`);

/** Ali koda izrek `ime` uporabi na argumentih (npr. »koren_pot (n := 2) (by norm_num)«, »@t 2 h«, »t.2 0 h«). Golo ime
 * (»example := t«, »have := @t«, »(t)«) ne šteje: tip je tedaj še vedno »predpostavke → sklep«. */
export function uporabi(koda, ime) {
  const re = new RegExp(`(?<![\\p{L}\\p{N}_.'!?])@?${ubezi(ime)}(?![\\p{L}\\p{N}_'!?])`, "gu");
  for (let m; (m = re.exec(koda)); ) {
    let rep = koda.slice(m.index + m[0].length);
    rep = rep.replace(/^(?:\.(?:\d+|[\p{L}_][\p{L}\p{N}_']*))*/u, "");
    const ista = /^[ \t]*(\S)/.exec(rep);
    if (ista && /[(⟨‹_@\p{L}\p{N}]/u.test(ista[1]) && !/^[ \t]*(?:with|then|else|at|using|from|in|do)\b/.test(rep)) return true;
    if (ista && /^[ \t]*(?:<\||\$)/.test(rep)) return true;
    if (!ista && /^[ \t]*\n\s*[(⟨‹@]/.test(rep)) return true;
  }
  return false;
}

/** Binder, ki skriva predpostavko v strukturi z dokazom (»(t : Affine.Triangle ℝ P)« vsebuje nekolinearnost, »{x // p x}«). */
const STRUKTURA_Z_DOKAZOM = /\b(?:Affine\.)?(?:Triangle|Simplex)\b|\/\//;

/** Oznake PV-09 v docstringu izreka. */
export function oznake(docText = "") {
  const vrstice = docText.split("\n").map((v) => v.trim().replace(/\s*$/, ""));
  const o = { trditev: null, besedilo: null, pomozno: false, izpolnljivoRocno: null, kratko: null };
  for (const v of vrstice) {
    let m;
    if ((m = /^trditev: (\S+)$/.exec(v))) o.trditev = m[1];
    else if ((m = /^besedilo: »(.*)«$/.exec(v))) o.besedilo = m[1];
    else if (/^pomozno(\b.*)?$/.test(v)) o.pomozno = true;
    else if ((m = /^izpolnljivo: ročno\s*[–-]\s*(\S.*)$/.exec(v))) o.izpolnljivoRocno = m[1];
    else if ((m = /^besedilo-kratko: (\S.*)$/.exec(v))) o.kratko = m[1];
  }
  return o;
}

// --- Besedilo lekcije ---------------------------------------------------------------------------------------------

/** Primerjava izseka z lekcijo: presledki (tudi LaTeX \, \; \! \: in »\ «) so en sam presledek. */
export function normaliziraj(s) {
  return String(s).replace(/\\[,;:! ]/g, " ").replace(/[\s  ]+/g, " ").trim();
}

/** Besedilo lekcije, ki ga učenec vidi: brez glave, risb, bloka RACUN in :::simboli (content/lessons/README.md). */
export function vidnoBesedilo(md) {
  const vrstice = String(md).replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  if (vrstice[0] === "---") {
    i = 1;
    while (i < vrstice.length && vrstice[i] !== "---") i++;
    i++;
  }
  let skrito = null;
  for (; i < vrstice.length; i++) {
    const v = vrstice[i];
    if (skrito) {
      if ((skrito === "racun" && /^>>\s*$/.test(v)) || (skrito === "blok" && /^:::\s*$/.test(v))) skrito = null;
      continue;
    }
    if (/^<<RACUN\b/.test(v)) skrito = "racun";
    else if (/^:::(risba|simboli)\b/.test(v)) skrito = "blok";
    else out.push(v);
  }
  return out.join("\n");
}

/** Vidno besedilo, iz katerega se sme citirati (odločitev j, PV-09): v razdelku »## Preveri se« samo razlaga po
 * pravilnem odgovoru (»>«) in povratna informacija (»~«, pri vpiši število brez napačne vrednosti pred »|«), nikoli
 * vprašanje, besedilo pod njim ali ponujeni odgovori (»+«, »-«, »=«, »1.«). Te vrstice so zamenjane z »\u0000«, da
 * citat ne more segati čeznje. */
export function citljivoBesedilo(md) {
  let kviz = false;
  let stevilo = false;
  return vidnoBesedilo(md).split("\n").map((v) => {
    const t = v.trim();
    if (/^##\s/.test(t)) {
      kviz = /^##\s+preveri se/i.test(t);
      return v;
    }
    if (!kviz || !t) return v;
    if (t[0] === "?") stevilo = false;
    else if (t[0] === "=") stevilo = true;
    if (t[0] === ">") return v;
    if (t[0] === "~") return stevilo && t.includes("|") ? `~ ${t.slice(t.indexOf("|") + 1).trim()}` : v;
    return "\u0000";
  }).join("\n");
}

/** Glave tabel v lekciji (prva vrstica tabele in njene celice), normalizirane: niso trditev. */
export function glaveTabel(md) {
  const out = new Set();
  const v = vidnoBesedilo(md).split("\n");
  for (let i = 0; i + 1 < v.length; i++) {
    if (/^\s*\|/.test(v[i]) && /^\s*\|[\s|:-]+\|?\s*$/.test(v[i + 1]) && !/^\s*\|/.test(v[i - 1] || "")) {
      out.add(normaliziraj(v[i]));
      for (const c of v[i].split("|").map((x) => normaliziraj(x)).filter(Boolean)) out.add(c);
      out.add(normaliziraj(v[i].replace(/^\s*\|\s*|\s*\|\s*$/g, "")));
    }
  }
  return out;
}

/** Ali je izsek dobesedno v vidnem besedilu lekcije (po normalizaciji presledkov). */
export function izsekVLekciji(izsek, md) {
  const n = normaliziraj(izsek);
  return n.length > 0 && normaliziraj(vidnoBesedilo(md)).includes(n);
}

// --- Preverjanje ---------------------------------------------------------------------------------------------------

/**
 * Preveri eno datoteko Lean z dokazi lekcije. rel: pot za sporočila, txt: besedilo .lean, md: lekcija (ali null),
 * vir: content/lessons/<pot>.md, sha: sha256 iz glave, dolg: Map polno ime → zgoščena izjava izrekov, ki so bili brez
 * primera izpolnljivosti že pred strožjim pravilom (lean/izpolnljivo-dolg.json); brezOznak: datoteka je na
 * lean/oznake-dolg.json (oznake trditev/besedilo/pomozno se ne preverjajo, izreki ne gredo v kazalo). Vrne { napake, opozorila, trditve, dolg }.
 */
export function preveriDatoteko(rel, txt, md, vir, sha, dolg = new Map(), { brezOznak = false } = {}) {
  const vDolgu = [];
  const napake = [];
  const opozorila = [];
  const trditve = [];
  const lekcija = vir.replace(/^content\/lessons\//, "").replace(/\.md$/, "");
  const vidno = md == null ? null : normaliziraj(vidnoBesedilo(md));
  const citljivo = md == null ? null : normaliziraj(citljivoBesedilo(md));
  const glave = md == null ? new Set() : glaveTabel(md);
  const decl = deklaracije(txt);
  const izreki = decl.filter((d) => d.vrsta === "theorem");
  // Primer izpolnljivosti izreka T: `example` (ali izrek T_izpolnljivo) brez lastnih predpostavk, katerega koda T uporabi
  // na argumentih, npr. »example := koren_pot (n := 2) (a := 4) (by norm_num) (by norm_num)«. Lean tako preveri, da
  // konkretne vrednosti izpolnijo vse predpostavke hkrati. Izrek T_izpolnljivo je priča samo za T in ga mora uporabiti.
  const izpolnjeni = new Set();
  const imena = new Set(izreki.map((t) => t.ime));
  const pricaZa = new Map(); // izrek T_izpolnljivo → ali je veljavna priča za T
  for (const d of decl) {
    const osnova = d.vrsta === "theorem" && d.ime.endsWith("_izpolnljivo") ? d.ime.slice(0, -"_izpolnljivo".length) : null;
    if (d.vrsta !== "example" && !osnova) continue;
    const brez = !d.binderji.some(jePredpostavka) && !implikacija(d.izjava);
    if (osnova) {
      const ok = brez && imena.has(osnova) && uporabi(d.koda, osnova);
      pricaZa.set(d.ime, ok);
      if (ok) izpolnjeni.add(osnova);
      continue;
    }
    if (!brez) continue;
    for (const t of izreki) if (t !== d && uporabi(d.koda, t.ime)) izpolnjeni.add(t.ime);
  }
  const ids = new Map();
  const citati = new Map();
  // Primer izpolnljivosti izreka d (velja tudi za datoteke brez oznak na lean/oznake-dolg.json).
  const prica = (d, kje, o) => {
    const predpostavke = d.binderji.filter(jePredpostavka);
    const sklep = implikacija(d.izjava);
    let izp = o.izpolnljivoRocno ? "ročno" : "primer";
    if ((predpostavke.length || sklep) && !izpolnjeni.has(d.ime) && !o.izpolnljivoRocno) {
      const kaj = [...predpostavke.map((b) => b.imena.join(" ") || b.tip), ...(sklep ? ["»→« v sklepu"] : [])].join(", ");
      if (dolg.get(d.polnoIme) === zgostiPodpis(d.podpis)) (vDolgu.push(d.polnoIme), (izp = "dolg"));
      else napake.push(`${kje}: predpostavke ${kaj} brez primera izpolnljivosti, ki izrek uporabi (docs/lean.md, »Lekcije (L2)«)`);
    } else if (dolg.has(d.polnoIme)) napake.push(`${kje}: izrek ima primer izpolnljivosti (ali ga ne potrebuje); odstrani ga iz lean/izpolnljivo-dolg.json`);
    return { predpostavke, sklep, izp };
  };
  for (const d of izreki) {
    // Izrek T_izpolnljivo, ki je prava priča za T, ni trditev lekcije; drugače je navaden izrek (oznake so obvezne).
    if (pricaZa.get(d.ime)) continue;
    const kje = `${rel}:${d.vrstica} ${d.ime}`;
    const o = oznake(d.doc?.text);
    if (d.privatno && !o.pomozno) {
      napake.push(`${kje}: »private« izrek (ni v kazalu pod svojim imenom in ga scripts/lean-aksiomi.mjs ne preveri); odstrani »private« (dovoljen le pri »pomozno«)`);
      continue;
    }
    if (o.pomozno) {
      if (o.trditev || o.besedilo) napake.push(`${kje}: »pomozno« in »trditev:« hkrati`);
      const prvi = (d.doc?.text || "").split("\n").filter((v) => !/^\s*pomozno\b/.test(v)).join(" ");
      if (/\b(primer|primeru|primera|naloga|nalogi|naloge)\b/i.test(prvi)) opozorila.push(`${kje}: »pomozno«, docstring pa omenja primer ali nalogo (je to trditev lekcije?)`);
      continue;
    }
    if (brezOznak) {
      // datoteka čaka ročne navedke (lean/oznake-dolg.json): brez oznak in brez kazala, priče pa veljajo
      prica(d, kje, o);
      continue;
    }
    if (!o.trditev || o.besedilo == null) {
      const ni = pricaZa.has(d.ime) ? `; ni primer izpolnljivosti za ${d.ime.slice(0, -12)} (ta ne obstaja, ima lastne predpostavke ali ga ne uporabi na argumentih)` : "";
      napake.push(`${kje}: docstring nima »trditev: <id>« in »besedilo: »…«« (ali »pomozno«)${ni}`);
      continue;
    }
    if (!o.trditev.startsWith(`${lekcija}#`) || !/^[a-z0-9-]+$/.test(o.trditev.slice(lekcija.length + 1))) {
      napake.push(`${kje}: id ${o.trditev} ni oblike ${lekcija}#<kratko-ime> (male črke, številke, -)`);
    }
    if (ids.has(o.trditev)) napake.push(`${kje}: id ${o.trditev} je že pri ${ids.get(o.trditev)}`);
    ids.set(o.trditev, d.ime);
    const b = normaliziraj(o.besedilo);
    if (!b) napake.push(`${kje}: prazno »besedilo«`);
    else if (vidno != null && !vidno.includes(b)) {
      napake.push(`${kje}: besedilo »${o.besedilo.slice(0, 60)}…« ni v vidnem besedilu ${vir}`);
    } else if (citljivo != null && !citljivo.includes(b)) {
      napake.push(`${kje}: besedilo »${o.besedilo.slice(0, 60)}…« je iz vprašanja ali ponujenih odgovorov »Preveri se«; citiraj razlago (»>«) ali povratno informacijo (»~«)`);
    } else {
      if (b.length < 15 && !o.kratko) napake.push(`${kje}: besedilo »${b}« je krajše od 15 znakov (daljši citat ali »besedilo-kratko: <razlog>«)`);
      if (glave.has(b) || glave.has(normaliziraj(b.replace(/^\|\s*|\s*\|$/g, "")))) napake.push(`${kje}: besedilo »${b.slice(0, 60)}« je glava tabele, ne trditev (citiraj vrstico izreka)`);
      citati.set(b, [...(citati.get(b) || []), d.ime]);
    }
    const { predpostavke, sklep, izp } = prica(d, kje, o);
    trditve.push({
      id: o.trditev,
      izrek: d.polnoIme,
      sha256: sha,
      vir,
      besedilo: b,
      ...(predpostavke.length || sklep ? { izpolnljivo: izp } : {}),
    });
  }
  for (const [b, imena] of citati) if (imena.length > 2) opozorila.push(`${rel}: isti citat »${b.slice(0, 50)}…« ima ${imena.length} izrekov (${imena.join(", ")})`);
  return { napake, opozorila, trditve, dolg: vDolgu };
}

/** Kratka zgoščena vrednost podpisa izreka (binderji in izjava): sprememba izreka ga vzame iz dolga. */
export const zgostiPodpis = (podpis) => crypto.createHash("sha256").update(podpis).digest("hex").slice(0, 16);

/** Izreki s predpostavkami brez primera izpolnljivosti, ki so obstajali, preden je PV-09 začel šteti »→« v oklepaju,
 * »->« in omejeni »∀« (lean/izpolnljivo-dolg.json, [{ izrek, podpis }]). Seznam se sme le krčiti (lean-lekcije.yml ga
 * primerja z osnovno vejo); vsak nov ali spremenjen izrek potrebuje primer. Dokončno: PV-13 (Lean preveri tip primera). */
export const DOLG = path.join(ROOT, "lean", "izpolnljivo-dolg.json");

/** Datoteke z dokazi, ki še čakajo ročne navedke PV-09 (lean/oznake-dolg.json, seznam poti; j 26. 11. 2026: lekcije
 * iz #1145 in kasnejše z main). Seznam se sme le krčiti; nova datoteka mora biti označena. */
export const OZNAKE_DOLG = path.join(ROOT, "lean", "oznake-dolg.json");

export function preveri({ dir = DIR, root = ROOT, dolgPot = path.join(root, "lean", "izpolnljivo-dolg.json"), osnovaDolga = null, oznakeDolgPot = path.join(root, "lean", "oznake-dolg.json"), osnovaOznak = null } = {}) {
  const napake = [];
  const opozorila = [];
  const pokrite = new Set();
  const trditve = [];
  const dolgSeznam = fs.existsSync(dolgPot) ? JSON.parse(fs.readFileSync(dolgPot, "utf8")) : [];
  const dolg = new Map(dolgSeznam.map((x) => [x.izrek, x.podpis]));
  if (dolg.size !== dolgSeznam.length) napake.push("lean/izpolnljivo-dolg.json: podvojen izrek");
  if (osnovaDolga) {
    const prej = new Set(osnovaDolga.map((x) => `${x.izrek} ${x.podpis}`));
    for (const x of dolgSeznam) if (!prej.has(`${x.izrek} ${x.podpis}`)) napake.push(`lean/izpolnljivo-dolg.json: nov vnos ${x.izrek} (seznam se sme le krčiti; dodaj primer izpolnljivosti)`);
  }
  const vDolgu = new Set();
  const brezOznak = fs.existsSync(oznakeDolgPot) ? JSON.parse(fs.readFileSync(oznakeDolgPot, "utf8")) : [];
  const brezOznakSet = new Set(brezOznak);
  if (brezOznakSet.size !== brezOznak.length) napake.push("lean/oznake-dolg.json: podvojena pot");
  if (osnovaOznak) {
    const prej = new Set(osnovaOznak);
    for (const x of brezOznak) if (!prej.has(x)) napake.push(`lean/oznake-dolg.json: nov vnos ${x} (seznam se sme le krčiti; označi izreke)`);
  }
  for (const x of brezOznak) if (!fs.existsSync(path.join(root, x))) napake.push(`lean/oznake-dolg.json: ${x} ne obstaja; odstrani vnos`);
  for (const f of walk(dir)) {
    const rel = path.relative(root, f);
    const celo = fs.readFileSync(f, "utf8");
    const txt = celo.slice(0, 4000);
    const vir = txt.match(/^vir: (content\/lessons\/\S+\.md)$/m)?.[1];
    const sha = txt.match(/^sha256: ([0-9a-f]{64})$/m)?.[1];
    if (!vir || !sha) { napake.push(`${rel}: v glavi manjka »vir:« ali »sha256:«`); continue; }
    const pot = path.join(root, vir);
    const md = fs.existsSync(pot) ? fs.readFileSync(pot) : null;
    if (!md) napake.push(`${rel}: lekcija ${vir} ne obstaja več`);
    else {
      const zdaj = crypto.createHash("sha256").update(md).digest("hex");
      if (zdaj !== sha) napake.push(`${rel}: lekcija ${vir} je bila spremenjena po dokazu; preveri dokaz in posodobi sha256`);
    }
    if (pokrite.has(vir)) napake.push(`${rel}: lekcija ${vir} ima že drugo datoteko z dokazi`);
    pokrite.add(vir);
    const r = preveriDatoteko(rel, celo, md && md.toString("utf8"), vir, sha, dolg, { brezOznak: brezOznakSet.has(rel) });
    for (const x of r.dolg) vDolgu.add(x);
    napake.push(...r.napake);
    opozorila.push(...r.opozorila);
    trditve.push(...r.trditve);
  }
  const lessons = path.join(root, "content", "lessons");
  const vseMat = (fs.existsSync(lessons) ? fs.readdirSync(lessons) : [])
    .filter((d) => /^MAT-(OS|SS)-/.test(d))
    .flatMap((d) => fs.readdirSync(path.join(lessons, d)).filter((f) => f.endsWith(".md")).map((f) => `content/lessons/${d}/${f}`));
  const pokriteMat = vseMat.filter((v) => pokrite.has(v)).length;
  for (const x of dolgSeznam) {
    if (!vDolgu.has(x.izrek)) {
      napake.push(`lean/izpolnljivo-dolg.json: ${x.izrek} ni (več) izrek brez primera z istim podpisom; odstrani vnos ali dodaj primer`);
    }
  }
  trditve.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { napake, opozorila, pokrite: [...pokrite].sort(), pokriteMat, vseMat: vseMat.length, trditve, dolg: vDolgu.size, brezOznak: brezOznak.length };
}

/** Vsebina lean/trditve.json: kazalo { id, izrek, sha256, vir, besedilo } za zapis trditve (dokaz: { izrek, sha256 }). */
export const kazaloJson = (trditve) => `[\n${trditve.map((t) => JSON.stringify(t)).join(",\n")}\n]\n`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const io = process.argv.indexOf("--osnova-dolga");
  const osnovaDolga = io > 0 ? JSON.parse(fs.readFileSync(process.argv[io + 1], "utf8") || "[]") : null;
  const ioz = process.argv.indexOf("--osnova-oznak");
  const osnovaOznak = ioz > 0 ? JSON.parse(fs.readFileSync(process.argv[ioz + 1], "utf8") || "[]") : null;
  const r = preveri({ osnovaDolga, osnovaOznak });
  const nov = kazaloJson(r.trditve);
  if (process.argv.includes("--zapisi")) fs.writeFileSync(KAZALO, nov);
  else if (!fs.existsSync(KAZALO) || fs.readFileSync(KAZALO, "utf8") !== nov) {
    r.napake.push("lean/trditve.json ni posodobljen: node scripts/lean-lekcije.mjs --zapisi");
  }
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    const rocno = r.trditve.filter((t) => t.izpolnljivo === "ročno").length;
    console.log(`Lean dokazi lekcij matematike OŠ/SŠ: ${r.pokriteMat} od ${r.vseMat}; trditev z id: ${r.trditve.length} (izpolnljivo ročno: ${rocno}; brez primera iz dolga, PV-13: ${r.dolg}; datotek brez oznak: ${r.brezOznak}).`);
    for (const n of r.napake) console.log(`✗ ${n}`);
    for (const n of r.opozorila) console.log(`⚠ ${n}`);
  }
  process.exitCode = r.napake.length ? 1 : 0;
}
