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
// ali vrstico »pomozno« (pomožna trditev, ni trditev lekcije). Izrek s predpostavkami (binderji, npr. (hk : k ≤ n))
// ima ob sebi `example`, katerega docstring omenja »izpoln…« in `<izrek>`, ali izrek `<izrek>_izpolnljivo`; kjer
// primer ni preprost, docstring izreka pove »izpolnljivo: ročno – <razlog>«.
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
  if (RELACIJA.test(b.tip) || PREDIKAT.test(b.tip)) return true;
  return b.imena.every((n) => /^h/.test(n)) && !/→/.test(b.tip) && !/^(Fin|Finset|Set|List|Polynomial|Matrix|EuclideanSpace)\b/.test(b.tip);
}

/** Imenski prostor na mestu `pos` (namespace … end; section ostane brez imena). */
function imenskiProstor(mask, pos) {
  const sklad = [];
  const re = /^(namespace|section|end)\b[ \t]*([^\s]*)/gm;
  let r;
  while ((r = re.exec(mask)) && r.index < pos) {
    if (r[1] === "namespace") sklad.push(r[2]);
    else if (r[1] === "section") sklad.push(null);
    else sklad.pop();
  }
  return sklad.filter(Boolean).join(".");
}

/** Izreki in primeri v datoteki Lean: [{ vrsta, ime, polnoIme, vrstica, start, doc, izjava, binderji }]. */
export function deklaracije(txt) {
  const { mask, doci } = maskiraj(txt);
  const re = /^((?:@\[[^\]\n]*\]\s*)*(?:(?:private|protected|noncomputable|public|nonrec)\s+)*)(theorem|lemma|example)\b/gm;
  const out = [];
  let r;
  while ((r = re.exec(mask))) {
    const start = r.index;
    const vrsta = r[2] === "lemma" ? "theorem" : r[2];
    let p = start + r[0].length;
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
      doc,
      izjava,
      binderji: binderji(glava),
    });
  }
  // koda deklaracije (brez komentarjev) do naslednje deklaracije: primer izpolnljivosti mora izrek uporabiti
  out.forEach((d, i) => {
    const n = out[i + 1];
    d.koda = mask.slice(d.start, n ? (n.doc ? n.doc.start : n.start) : mask.length);
  });
  return out;
}

/** Ali ima sklep izreka predpostavko: v enem od veznikov »∧« na vrhu je za začetnimi »∀ …,« še »→« na ničti globini
 * (npr. »… ∧ ∀ x, 0 < x → …«; veznik v oklepaju se ne šteje). Zanikanje (»¬ …«), »∃ …« in »let …« niso predpostavke. */
export function implikacija(izjava) {
  const globina0 = (s, f) => {
    let d = 0;
    for (let i = 0; i < s.length; i++) {
      if (ODPRI.includes(s[i])) d++;
      else if (ZAPRI.includes(s[i])) d--;
      else if (d === 0 && f(s, i)) return i;
    }
    return -1;
  };
  const vezniki = [];
  let rest = String(izjava).trim();
  while (rest) {
    if (/^(¬\s*)?(∀|∃|let\b|fun\b)/.test(rest)) { vezniki.push(rest); break; }
    const k = globina0(rest, (t, i) => t[i] === "∧");
    if (k < 0) { vezniki.push(rest); break; }
    vezniki.push(rest.slice(0, k).trim());
    rest = rest.slice(k + 1).trim();
  }
  for (let v of vezniki) {
    for (;;) {
      if (!/^∀\s/.test(v)) break;
      const k = globina0(v.slice(1), (t, i) => t[i] === ",");
      if (k < 0) break;
      v = v.slice(k + 2).trim();
    }
    if (/^(¬|∃|let\b)/.test(v)) continue;
    if (globina0(v, (t, i) => t[i] === "→") >= 0) return true;
  }
  return false;
}

const uporabi = (koda, ime) =>
  new RegExp(`(?<![\\p{L}\\p{N}_.'])${ime.replace(/[.*+?^${}()|[\]\\]/g, (c) => `\\${c}`)}(?![\\p{L}\\p{N}_'])`, "u").test(koda);

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
 * vir: content/lessons/<pot>.md, sha: sha256 iz glave. Vrne { napake, trditve }.
 */
export function preveriDatoteko(rel, txt, md, vir, sha) {
  const napake = [];
  const opozorila = [];
  const trditve = [];
  const lekcija = vir.replace(/^content\/lessons\//, "").replace(/\.md$/, "");
  const vidno = md == null ? null : normaliziraj(vidnoBesedilo(md));
  const glave = md == null ? new Set() : glaveTabel(md);
  const decl = deklaracije(txt);
  const izreki = decl.filter((d) => d.vrsta === "theorem");
  // Primer izpolnljivosti izreka T: `example` (ali izrek T_izpolnljivo) brez lastnih predpostavk, katerega koda T uporabi,
  // npr. »example := koren_pot (n := 2) (a := 4) (by norm_num) (by norm_num)«. Lean tako preveri, da konkretne
  // vrednosti izpolnijo vse predpostavke hkrati.
  const izpolnjeni = new Set();
  for (const d of decl) {
    const prica = d.vrsta === "example" || d.ime.endsWith("_izpolnljivo");
    if (!prica || d.binderji.some(jePredpostavka)) continue;
    for (const t of izreki) if (t !== d && uporabi(d.koda, t.ime)) izpolnjeni.add(t.ime);
  }
  const ids = new Map();
  const citati = new Map();
  for (const d of izreki) {
    if (d.ime.endsWith("_izpolnljivo")) continue;
    const kje = `${rel}:${d.vrstica} ${d.ime}`;
    const o = oznake(d.doc?.text);
    if (o.pomozno) {
      if (o.trditev || o.besedilo) napake.push(`${kje}: »pomozno« in »trditev:« hkrati`);
      const prvi = (d.doc?.text || "").split("\n").filter((v) => !/^\s*pomozno\b/.test(v)).join(" ");
      if (/\b(primer|primeru|primera|naloga|nalogi|naloge)\b/i.test(prvi)) opozorila.push(`${kje}: »pomozno«, docstring pa omenja primer ali nalogo (je to trditev lekcije?)`);
      continue;
    }
    if (!o.trditev || o.besedilo == null) {
      napake.push(`${kje}: docstring nima »trditev: <id>« in »besedilo: »…«« (ali »pomozno«)`);
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
    } else {
      if (b.length < 15 && !o.kratko) napake.push(`${kje}: besedilo »${b}« je krajše od 15 znakov (daljši citat ali »besedilo-kratko: <razlog>«)`);
      if (glave.has(b) || glave.has(normaliziraj(b.replace(/^\|\s*|\s*\|$/g, "")))) napake.push(`${kje}: besedilo »${b.slice(0, 60)}« je glava tabele, ne trditev (citiraj vrstico izreka)`);
      citati.set(b, [...(citati.get(b) || []), d.ime]);
    }
    const predpostavke = d.binderji.filter(jePredpostavka);
    const sklep = implikacija(d.izjava);
    if ((predpostavke.length || sklep) && !izpolnjeni.has(d.ime) && !o.izpolnljivoRocno) {
      const kaj = [...predpostavke.map((b) => b.imena.join(" ") || b.tip), ...(sklep ? ["»→« v sklepu"] : [])].join(", ");
      napake.push(`${kje}: predpostavke ${kaj} brez primera izpolnljivosti, ki izrek uporabi (docs/lean.md, »Lekcije (L2)«)`);
    }
    trditve.push({
      id: o.trditev,
      izrek: d.polnoIme,
      sha256: sha,
      vir,
      besedilo: b,
      ...(predpostavke.length || sklep ? { izpolnljivo: o.izpolnljivoRocno ? "ročno" : "primer" } : {}),
    });
  }
  for (const [b, imena] of citati) if (imena.length > 2) opozorila.push(`${rel}: isti citat »${b.slice(0, 50)}…« ima ${imena.length} izrekov (${imena.join(", ")})`);
  return { napake, opozorila, trditve };
}

export function preveri({ dir = DIR, root = ROOT } = {}) {
  const napake = [];
  const opozorila = [];
  const pokrite = new Set();
  const trditve = [];
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
    const r = preveriDatoteko(rel, celo, md && md.toString("utf8"), vir, sha);
    napake.push(...r.napake);
    opozorila.push(...r.opozorila);
    trditve.push(...r.trditve);
  }
  const lessons = path.join(root, "content", "lessons");
  const vseMat = (fs.existsSync(lessons) ? fs.readdirSync(lessons) : [])
    .filter((d) => /^MAT-(OS|SS)-/.test(d))
    .flatMap((d) => fs.readdirSync(path.join(lessons, d)).filter((f) => f.endsWith(".md")).map((f) => `content/lessons/${d}/${f}`));
  const pokriteMat = vseMat.filter((v) => pokrite.has(v)).length;
  trditve.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { napake, opozorila, pokrite: [...pokrite].sort(), pokriteMat, vseMat: vseMat.length, trditve };
}

/** Vsebina lean/trditve.json: kazalo { id, izrek, sha256, vir, besedilo } za zapis trditve (dokaz: { izrek, sha256 }). */
export const kazaloJson = (trditve) => `[\n${trditve.map((t) => JSON.stringify(t)).join(",\n")}\n]\n`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = preveri();
  const nov = kazaloJson(r.trditve);
  if (process.argv.includes("--zapisi")) fs.writeFileSync(KAZALO, nov);
  else if (!fs.existsSync(KAZALO) || fs.readFileSync(KAZALO, "utf8") !== nov) {
    r.napake.push("lean/trditve.json ni posodobljen: node scripts/lean-lekcije.mjs --zapisi");
  }
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    const rocno = r.trditve.filter((t) => t.izpolnljivo === "ročno").length;
    console.log(`Lean dokazi lekcij matematike OŠ/SŠ: ${r.pokriteMat} od ${r.vseMat}; trditev z id: ${r.trditve.length} (izpolnljivo ročno: ${rocno}).`);
    for (const n of r.napake) console.log(`✗ ${n}`);
    for (const n of r.opozorila) console.log(`⚠ ${n}`);
  }
  process.exitCode = r.napake.length ? 1 : 0;
}
