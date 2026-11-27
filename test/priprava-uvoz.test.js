// Priprava na test, PR 3a (docs/priprava.md): uvoz brez AI (besedilo, Word, PowerPoint, PDF z besedilom) in izseki z
// izvorom. Binarne vire naredi test iz besedil v test/fixtures/priprava/, da v repozitoriju ni binarnih datotek.
// Preveri: vse iz »mora_najti« je v izsekih, negotovo branje je označeno z [?] in ni ugibano, navodila v dokumentu so
// samo podatek, vse formule se izrišejo s KaTeX, bomba ZIP in poškodovane datoteke ne podrejo strežnika, tuj profil 404.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import zlib from "node:zlib";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { preberiVir, beriWord, beriPowerpoint, uvoziVNiti, NapakaUvoza, MEJE_UVOZA } from "../server/priprava/uvoz.js";
import { razrezi, oznaciNegotovo, vrstaIzseka, izrise, NEGOTOVO } from "../server/priprava/izseki.js";
import { SEALED } from "../server/crypto-polje.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const DIR = new URL("./fixtures/priprava/", import.meta.url);
const PRIC = JSON.parse(fs.readFileSync(new URL("pricakovano.json", DIR), "utf8"));
const vir = (ime) => fs.readFileSync(new URL(ime, DIR), "utf8");

// ---------- izdelava binarnih virov iz besedila ----------

function zip(vnosi, { metoda = 8 } = {}) {
  const lok = [];
  const cen = [];
  let off = 0;
  for (const [ime, vsebina] of Object.entries(vnosi)) {
    const data = Buffer.isBuffer(vsebina) ? vsebina : Buffer.from(vsebina, "utf8");
    const comp = metoda === 8 ? zlib.deflateRawSync(data) : data;
    const n = Buffer.from(ime, "utf8");
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0);
    h.writeUInt16LE(20, 4);
    h.writeUInt16LE(0x0800, 6);
    h.writeUInt16LE(metoda, 8);
    h.writeUInt32LE(zlib.crc32(data), 14);
    h.writeUInt32LE(comp.length, 18);
    h.writeUInt32LE(data.length, 22);
    h.writeUInt16LE(n.length, 26);
    lok.push(h, n, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0);
    c.writeUInt16LE(20, 4);
    c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0x0800, 8);
    c.writeUInt16LE(metoda, 10);
    c.writeUInt32LE(zlib.crc32(data), 16);
    c.writeUInt32LE(comp.length, 20);
    c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(n.length, 28);
    c.writeUInt32LE(off, 42);
    cen.push(c, n);
    off += 30 + n.length + comp.length;
  }
  const cd = Buffer.concat(cen);
  const e = Buffer.alloc(22);
  e.writeUInt32LE(0x06054b50, 0);
  e.writeUInt16LE(cen.length / 2, 8);
  e.writeUInt16LE(cen.length / 2, 10);
  e.writeUInt32LE(cd.length, 12);
  e.writeUInt32LE(off, 16);
  return Buffer.concat([...lok, cd, e]);
}
const xml = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const CT = '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>';

// Markdown → .docx: # naslovi kot slogi Heading, alineje z numPr, vsaka vrstica svoj odstavek, prazne vrstice tudi.
function docx(md, { omml = "" } = {}) {
  const p = md.split("\n").map((l) => {
    const h = /^(#{1,3})\s+(.*)$/.exec(l);
    if (h) return `<w:p><w:pPr><w:pStyle w:val="Heading${h[1].length}"/></w:pPr><w:r><w:t>${xml(h[2])}</w:t></w:r></w:p>`;
    const a = /^\s*[-*]\s+(.*)$/.exec(l);
    if (a) return `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${xml(a[1])}</w:t></w:r></w:p>`;
    return l ? `<w:p><w:r><w:t xml:space="preserve">${xml(l)}</w:t></w:r></w:p>` : "<w:p/>";
  });
  const body = `<?xml version="1.0"?><w:document xmlns:w="w" xmlns:m="m"><w:body>${p.join("")}${omml}</w:body></w:document>`;
  return zip({ "[Content_Types].xml": CT, "_rels/.rels": "<Relationships/>", "word/document.xml": body });
}

// Markdown → .pptx: vsak »## « začne novo prosojnico (naslov), ostale vrstice so odstavki; prosojnice v obratnem
// vrstnem redu datotek, da test preveri vrstni red iz presentation.xml.
function pptx(md, { opombe = null } = {}) {
  const deli = md.split(/\n(?=## )/);
  const v = { "[Content_Types].xml": CT, "_rels/.rels": "<Relationships/>" };
  const ids = [];
  const rels = [];
  deli.forEach((d, i) => {
    const [prva, ...ostalo] = d.split("\n");
    const n = deli.length - i; // obratno ime datoteke
    const para = (t) => `<a:p><a:r><a:t>${xml(t)}</a:t></a:r></a:p>`;
    v[`ppt/slides/slide${n}.xml`] =
      `<p:sld xmlns:p="p" xmlns:a="a"><p:cSld><p:spTree><p:sp><p:nvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:txBody>${para(prva.replace(/^#+\s*/, ""))}</p:txBody></p:sp>` +
      `<p:sp><p:txBody>${ostalo.filter((x) => x.trim()).map(para).join("")}</p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
    if (opombe && i === 0) {
      v[`ppt/slides/_rels/slide${n}.xml.rels`] = `<Relationships><Relationship Id="rId9" Target="../notesSlides/notesSlide1.xml"/></Relationships>`;
      v["ppt/notesSlides/notesSlide1.xml"] = `<p:notes xmlns:p="p" xmlns:a="a"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>${xml(opombe)}</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:notes>`;
    }
    ids.push(`<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`);
    rels.push(`<Relationship Id="rId${i + 2}" Target="slides/slide${n}.xml"/>`);
  });
  v["ppt/presentation.xml"] = `<p:presentation xmlns:p="p" xmlns:r="r"><p:sldIdLst>${ids.join("")}</p:sldIdLst></p:presentation>`;
  v["ppt/_rels/presentation.xml.rels"] = `<Relationships>${rels.join("")}</Relationships>`;
  return zip(v);
}

// Besedilo → PDF s standardno pisavo (Helvetica, WinAnsi). Strani: seznam seznamov vrstic; prazna stran = skenirana.
function pdf(strani) {
  const esc = (t) => t.replace(/[\\()]/g, (c) => `\\${c}`);
  const obj = [];
  const add = (s) => obj.push(s) && obj.length;
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const pagesId = obj.length + 1 + strani.length * 2;
  const kids = [];
  for (const vrstice of strani) {
    // Vrstica je niz ali seznam kosov { t, dvig } (dvig v točkah: nadpisano > 0, podpisano < 0, manjša pisava).
    const kos = (k) => (typeof k === "string" ? `(${esc(k)}) Tj` : `/F1 ${k.dvig ? 7 : 11} Tf ${k.dvig || 0} Ts (${esc(k.t)}) Tj /F1 11 Tf 0 Ts`);
    const tok = `BT /F1 11 Tf 14 TL 50 780 Td ${vrstice.map((v) => `${(Array.isArray(v) ? v : [v]).map(kos).join(" ")} T*`).join(" ")} ET`;
    const c = add(`<< /Length ${Buffer.byteLength(tok, "latin1")} >>\nstream\n${tok}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${c} 0 R >>`));
  }
  add(`<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`);
  const cat = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  let out = "%PDF-1.4\n";
  const offs = [];
  obj.forEach((o, i) => {
    offs.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${obj.length + 1}\n0000000000 65535 f \n${offs.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  out += `trailer\n<< /Size ${obj.length + 1} /Root ${cat} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

const besedila = (izseki) => izseki.map((i) => i.besedilo).join("\n");

// ---------- izseki iz besedila ----------

test("besedilo: vse iz »mora_najti« je v izsekih, vsaka formula se izriše, izvor (stran, zaporedje, naslov) je zapisan", async () => {
  for (const [ime, p] of Object.entries(PRIC.viri)) {
    const r = await preberiVir("besedilo", Buffer.from(vir(ime)));
    const iz = razrezi(r.strani);
    assert.ok(iz.length > 0, ime);
    const vse = besedila(iz);
    for (const m of p.mora_najti) assert.ok(vse.includes(m), `${ime}: manjka ${m}`);
    iz.forEach((x, i) => {
      assert.equal(x.zaporedje, i + 1);
      assert.equal(x.stran, 1);
      assert.ok(x.besedilo.length <= 1200);
    });
    for (const m of vse.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) assert.ok(izrise(m[1] ?? m[2], !!m[1]), `${ime}: ${m[0]}`);
  }
  const mat = razrezi((await preberiVir("besedilo", Buffer.from(vir("mat-integrali.md")))).strani);
  assert.equal(mat.find((x) => x.besedilo.includes("Newton-Leibnizova")).naslov, "Določeni integral");
  assert.equal(mat.find((x) => x.besedilo.startsWith("Definicija")).vrsta, "definicija");
  assert.equal(mat.find((x) => x.besedilo.startsWith("Primer")).vrsta, "primer");
  // »Pravila:« in alineje pod njim so en izsek.
  assert.ok(mat.some((x) => x.besedilo.startsWith("Pravila:") && x.besedilo.includes("\\ln|x|")));
});

test("star test: vsaka oštevilčena naloga je svoj izsek vrste naloga, s točkami", async () => {
  const iz = razrezi((await preberiVir("besedilo", Buffer.from(vir("star-test.md")))).strani);
  const naloge = iz.filter((x) => x.vrsta === "naloga");
  assert.equal(naloge.length, PRIC.viri["star-test.md"].naloge);
  for (const t of PRIC.viri["star-test.md"].mora_najti) assert.ok(naloge.some((n) => n.besedilo.includes(t)), t);
});

test("negotovo branje: x2 ostane z [?] (brez ugibanja), kemijski indeksi dopolnjeni z [?], formula brez izrisa z [?]", async () => {
  const mat = razrezi((await preberiVir("besedilo", Buffer.from(vir("mat-integrali.md")))).strani);
  const odvod = mat.find((x) => x.besedilo.includes("Odvod od"));
  assert.ok(odvod.besedilo.includes(`x2 ${NEGOTOVO}`), "x2 ostane, kot je zapisan");
  assert.ok(!/x²|x\^2|x_2|x₂/.test(odvod.besedilo), "brez ugibanja");
  assert.ok(odvod.negotovo.every((n) => n.vrsta === "zapis" && n.izvirno === "x2" && !n.prepis));
  // Formule v $…$ niso negotove (x^2 je zapisan jasno).
  assert.ok(mat.filter((x) => x !== odvod).every((x) => !x.negotovo.length));

  const kem = razrezi((await preberiVir("besedilo", Buffer.from(vir("kem-reakcije.md")))).strani);
  const vrst = kem.find((x) => x.besedilo.includes("NaOH"));
  assert.ok(vrst.besedilo.includes(`H₂SO₄ ${NEGOTOVO}`));
  assert.ok(vrst.besedilo.includes(`Na₂SO₄ ${NEGOTOVO}`));
  assert.deepEqual(vrst.negotovo.find((n) => n.izvirno === "H2SO4"), { vrsta: "kemija", izvirno: "H2SO4", prepis: "H₂SO₄" });
  assert.ok(!vrst.besedilo.includes("NaOH [?]"), "NaOH nima indeksov");
  // Pravilno zapisane kemijske formule v $\mathrm{…}$ ostanejo nedotaknjene.
  assert.ok(kem.some((x) => x.besedilo.includes("$\\mathrm{SO_4^{2-}}$") && !x.negotovo.length));

  assert.deepEqual(oznaciNegotovo("Velja $\\frac{1}{$ in 2x + 3 = 7, leto 2024, 4. letnik, CO2.").negotovo.map((n) => n.vrsta), ["formula", "zapis"]);
  // En simbol z indeksom (sila F2, upor R1) ni negotov in se ne spremeni.
  assert.deepEqual(oznaciNegotovo("Sila F2 deluje na upor R1."), { besedilo: "Sila F2 deluje na upor R1.", negotovo: [] });
  // Koeficient pred zapisom ga ne skrije (3x2 je lahko 3x², 6x ali 3x₂); x2y je enako negotov.
  assert.equal(oznaciNegotovo("Reši 3x2 + 2x - 1 = 0 in x2y.").besedilo, `Reši 3x2 ${NEGOTOVO} + 2x - 1 = 0 in x2y ${NEGOTOVO}.`);
});

test("OMML → LaTeX: oklepaji, matrika, sistem, binomski koeficient, limita, naglasi, izotop, posebni znaki", () => {
  const r = (t) => `<m:r><m:t>${t}</m:t></m:r>`;
  const e = (...x) => x.map((t) => `<m:e>${t}</m:e>`).join("");
  const d = (beg, end, x) => `<m:d><m:dPr><m:begChr m:val="${beg}"/><m:endChr m:val="${end}"/></m:dPr>${x}</m:d>`;
  const f = (x) => {
    const t = beriWord(docx("", { omml: `<w:p><m:oMath>${x}</m:oMath></w:p>` }))[0].vrstice.find((v) => v.besedilo).besedilo;
    return t.replace(/^\$|\$$/g, "");
  };
  const primeri = [
    [d("|", "|", e(r("x"))), "\\left| x \\right|"],
    [d("[", "]", e(r("0,3"))), "\\left[ 0,3 \\right]"],
    [d("{", "}", e(r("1,2"))), "\\left\\{ 1,2 \\right\\}"],
    [`<m:d>${e(`<m:m><m:mr>${e(r("1"), r("2"))}</m:mr><m:mr>${e(r("3"), r("4"))}</m:mr></m:m>`)}</m:d>`, "\\left( \\begin{matrix} 1 & 2 \\\\ 3 & 4 \\end{matrix} \\right)"],
    [d("{", "", e(`<m:eqArr>${e(r("2x+y&amp;=5"), r("x-y&amp;=1"))}</m:eqArr>`)), "\\left\\{ \\begin{array}{l} 2x+y=5 \\\\ x-y=1 \\end{array} \\right."],
    [`<m:d>${e(`<m:f><m:fPr><m:type m:val="noBar"/></m:fPr><m:num>${r("n")}</m:num><m:den>${r("k")}</m:den></m:f>`)}</m:d>`, "\\left( \\genfrac{}{}{0pt}{}{n}{k} \\right)"],
    [`<m:func><m:fName><m:limLow>${e(r("lim"))}<m:lim>${r("x→0")}</m:lim></m:limLow></m:fName>${e(r("x"))}</m:func>`, "\\lim_{x\\rightarrow 0} x"],
    [`<m:func><m:fName><m:sSub>${e(r("log"))}<m:sub>${r("2")}</m:sub></m:sSub></m:fName>${e(r("x"))}</m:func>`, "\\operatorname{log}_{2} x"],
    [`<m:acc><m:accPr><m:chr m:val="⃗"/></m:accPr>${e(r("v"))}</m:acc>`, "\\vec{v}"],
    [`<m:bar><m:barPr><m:pos m:val="top"/></m:barPr>${e(r("x"))}</m:bar>`, "\\overline{x}"],
    [`<m:sPre><m:sub>${r("6")}</m:sub><m:sup>${r("14")}</m:sup>${e(r("C"))}</m:sPre>`, "{}_{6}^{14}{C}"],
    [`<m:nary><m:naryPr><m:chr m:val="∮"/></m:naryPr><m:sub/><m:sup/>${e(r("E"))}</m:nary>`, "\\oint E"],
    [r("F=q v×B, p=5%"), "F=q v\\times B, p=5\\%"],
  ];
  for (const [x, latex] of primeri) {
    assert.equal(f(x), latex);
    assert.ok(izrise(latex), latex);
  }
  // Neznan oklepaj ali operator: [?], ne napačna formula.
  assert.equal(f(`<m:nary><m:naryPr><m:chr m:val="⨁"/></m:naryPr>${e(r("A"))}</m:nary>`), "[formula] [?]");
});

test("navodila v dokumentu so samo podatek: izsek ostane besedilo, nič se ne izvede", async () => {
  const iz = razrezi((await preberiVir("besedilo", Buffer.from(vir("napad.md")))).strani);
  const napad = iz.find((x) => x.besedilo.includes(PRIC.viri["napad.md"].ne_izvedi));
  assert.equal(napad.vrsta, "teorija");
  assert.ok(iz.some((x) => x.besedilo.includes("c^2 = a^2 + b^2")));
});

test("vrsta izseka", () => {
  const v = (t) => vrstaIzseka(t);
  assert.equal(v("Definicija: odvod je limita …"), "definicija");
  assert.equal(v("Pitagorov izrek: v pravokotnem trikotniku …"), "izrek");
  assert.equal(v("Primer: kateti merita 3 cm"), "primer");
  assert.equal(v("Izračunaj ploščino trikotnika."), "naloga");
  assert.equal(v("$E = \\frac{F}{q}$"), "formula");
  assert.equal(v("Celica je osnovna enota živih bitij."), "teorija");
  assert.equal(vrstaIzseka("1. Nariši skico\n2. Zapiši podatke", { alineje: true }), "postopek");
});

// ---------- Word, PowerPoint, PDF ----------

test("Word: naslovi, alineje, tabela, formula OMML → LaTeX, prelom strani; isti izseki kot iz besedila", async () => {
  const md = vir("mat-integrali.md");
  const omml =
    '<w:p><w:r><w:t xml:space="preserve">Ulomek: </w:t></w:r><m:oMath><m:f><m:num><m:r><m:t>a</m:t></m:r></m:num><m:den><m:sSup><m:e><m:r><m:t>b</m:t></m:r></m:e><m:sup><m:r><m:t>2</m:t></m:r></m:sup></m:sSup></m:den></m:f></m:oMath></w:p>' +
    '<w:p><w:r><w:br w:type="page"/></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>Količina</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Enota</w:t></w:r></w:p></w:tc></w:tr><w:tr><w:tc><w:p><w:r><w:t>sila</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>N &amp; kN</w:t></w:r></w:p></w:tc></w:tr></w:tbl>';
  const r = await preberiVir("word", docx(md, { omml }));
  const iz = razrezi(r.strani);
  const vse = besedila(iz);
  for (const m of PRIC.viri["mat-integrali.md"].mora_najti) assert.ok(vse.includes(m), m);
  assert.ok(vse.includes("$\\frac{a}{{b}^{2}}$"), vse.slice(-300));
  assert.ok(izrise("\\frac{a}{{b}^{2}}"));
  assert.ok(vse.includes("Količina | Enota") && vse.includes("sila | N & kN"));
  assert.equal(r.strani.length, 2, "prelom strani");
  assert.equal(iz.find((x) => x.besedilo.includes("Količina")).stran, 2);
  assert.equal(iz.find((x) => x.besedilo.includes("Newton-Leibnizova")).naslov, "Določeni integral");
  // Isti izseki kot iz besedila (razen dodanega na koncu).
  const izBesedila = razrezi((await preberiVir("besedilo", Buffer.from(md))).strani);
  assert.deepEqual(iz.slice(0, izBesedila.length).map((x) => [x.vrsta, x.besedilo]), izBesedila.map((x) => [x.vrsta, x.besedilo.replace(/^- /gm, "")]));
});

test("PowerPoint: prosojnice v vrstnem redu predstavitve, naslov prosojnice, opombe govorca", async () => {
  const md = vir("fiz-elektricno-polje.md");
  const r = await preberiVir("powerpoint", pptx(md, { opombe: "Učitelj: to bo na testu." }));
  const iz = razrezi(r.strani);
  const vse = besedila(iz);
  for (const m of PRIC.viri["fiz-elektricno-polje.md"].mora_najti) assert.ok(vse.includes(m), m);
  assert.equal(r.strani[0].vrstice[0].besedilo, md.split("\n")[0].replace(/^#+\s*/, ""), "prva prosojnica je prva v predstavitvi, ne po imenu datoteke");
  assert.ok(vse.includes("Učitelj: to bo na testu."));
  assert.deepEqual(r.strani.map((s) => s.stran), r.strani.map((_, i) => i + 1));
});

test("PDF: besedilo po straneh, skenirana stran označena, poškodovan PDF da napako uvoza", async () => {
  const a = ["Elektricno polje", "Jakost polja: E = F/q, enota N/C.", "Naboj q = 2 * 10^-6 C."];
  const b = ["Coulombov zakon: F = k q1 q2 / r^2", "Primer: F = 0,01 N."];
  const r = await preberiVir("pdf", pdf([a, [], b]));
  assert.deepEqual(r.brezBesedila, [2]);
  assert.deepEqual(r.strani.map((s) => s.stran), [1, 3]);
  assert.deepEqual(r.strani[0].vrstice.map((v) => v.besedilo), a);
  const iz = razrezi(r.strani);
  assert.ok(iz.some((x) => x.stran === 3 && x.vrsta === "izrek" && x.besedilo.startsWith("Coulombov zakon")));
  // q1, q2 sta gotovo indeksa (potence 1 v zapiskih ni, q2 ob q1): brez [?] (K-10, lažna negotovost).
  assert.ok(iz.find((x) => x.stran === 3).besedilo.includes("k q1 q2 / r^2") && !iz.find((x) => x.stran === 3).negotovo.length);
  await assert.rejects(preberiVir("pdf", Buffer.from("%PDF-1.4\nsmeti brez strani\n%%EOF")), (e) => e instanceof NapakaUvoza && e.code === "uvoz_pdf");
});

test("ZIP: bomba (velika razširitev) in poškodovan imenik dasta napako uvoza, ne izjeme strežnika", () => {
  const bomba = zip({ "[Content_Types].xml": CT, "word/document.xml": Buffer.alloc(MEJE_UVOZA.zipVnos + 10, 0x20) });
  assert.throws(() => beriWord(bomba), (e) => e instanceof NapakaUvoza && e.code === "uvoz_zip_velik");
  const pokvarjen = Buffer.from(docx("# A\n\nB"));
  pokvarjen.writeUInt32LE(0, pokvarjen.length - 22 + 16 - 0); // odmik imenika → 0 (lokalna glava namesto imenika)
  assert.throws(() => beriWord(pokvarjen), (e) => e instanceof NapakaUvoza);
  assert.throws(() => beriPowerpoint(Buffer.from("PK\u0003\u0004 nič")), (e) => e instanceof NapakaUvoza);
  // Pregloboka formula OMML (ročno sestavljena): hitro, z oznako [formula] [?] namesto razčlenjevanja.
  const globoka = "<m:oMath>" + "<m:f><m:num><m:r><m:t>1</m:t></m:r></m:num><m:den>".repeat(400) + "<m:r><m:t>x</m:t></m:r>" + "</m:den></m:f>".repeat(400) + "</m:oMath>";
  const t0 = Date.now();
  const iz = razrezi(beriWord(docx("A", { omml: `<w:p>${globoka}</w:p>`.repeat(30) })));
  assert.ok(Date.now() - t0 < 3000, `${Date.now() - t0} ms`);
  assert.ok(iz.some((x) => x.besedilo.includes("[formula] [?]") && x.negotovo.some((n) => n.izvirno === "[formula]")));
});

// ---------- poti ----------

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }), log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (p, opts = {}) => {
      const headers = { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(opts.raw === undefined ? { "Content-Type": "application/json" } : { "Content-Type": "application/octet-stream" }) };
      const res = await fetch(base + p, { method: opts.method || "GET", headers, body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined) });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      return { status: res.status, body };
    };
  };
  const YEAR = new Date().getFullYear();
  const user = async (email) => {
    const call = client();
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${YEAR - 40}-01-15` } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
    const s = await call("/api/students", { method: "POST", body: { name: "Maja", birth_year: YEAR - 15, consent: true } });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    return { call, sid: s.body.id };
  };
  try {
    await fn({ user, db: store.db });
  } finally {
    server.close();
  }
}

test("API: nalaganje obdela vir (besedilo, Word, PDF), izseki šifrirani, filtri, ponovna obdelava, tuj profil 404", async () => {
  assert.ok(SEALED.some((x) => x.table === "priprava_izseki" && ["naslov", "besedilo", "negotovo"].every((c) => x.cols.includes(c))));
  await withServer(async ({ user, db }) => {
    const a = await user("a@primer.si");
    const p = (await a.call(`/api/students/${a.sid}/priprave`, { method: "POST", body: { naslov: "Integrali" } })).body.priprava;
    assert.ok(p?.id, "priprava");
    const t = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: vir("mat-integrali.md"), ime: "zvezek" } });
    assert.equal(t.status, 201, JSON.stringify(t.body));
    assert.equal(t.body.vir.stanje, "obdelan");
    assert.ok(t.body.vir.izsekov >= 10);
    const w = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", raw: docx(vir("kem-reakcije.md")) });
    assert.equal(w.status, 201, JSON.stringify(w.body));
    assert.equal(w.body.vir.vrsta, "word");
    assert.equal(w.body.vir.stanje, "obdelan");
    const d = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", raw: pdf([[], []]) });
    assert.equal(d.body.vir.stanje, "branje", "samo skenirane strani čakajo na branje fotografij");
    assert.deepEqual(d.body.vir.opozorila, [{ koda: "uvoz_brez_besedila", strani: [1, 2] }]);
    const bad = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", raw: Buffer.from("%PDF-1.4\nsmeti\n%%EOF") });
    assert.equal(bad.status, 201);
    assert.deepEqual([bad.body.vir.stanje, bad.body.vir.napaka], ["napaka", "uvoz_pdf"]);

    const vsi = (await a.call(`/api/students/${a.sid}/priprave/${p.id}/izseki`)).body.izseki;
    assert.ok(vsi.some((x) => x.besedilo.includes("Newton-Leibnizova") && x.naslov === "Določeni integral"));
    const kem = vsi.find((x) => x.besedilo.includes("NaOH"));
    assert.equal(kem.vir_id, w.body.vir.id);
    assert.ok(kem.negotovo.some((n) => n.izvirno === "H2SO4"));
    // V bazi šifrirano.
    const raw = db.prepare("SELECT naslov, besedilo, negotovo FROM priprava_izseki WHERE id = ?").get(kem.id);
    assert.ok(!raw.besedilo.includes("NaOH") && !String(raw.negotovo).includes("H2SO4") && !String(raw.naslov).includes("Kemijske"));
    const samoW = (await a.call(`/api/students/${a.sid}/priprave/${p.id}/izseki?vir=${w.body.vir.id}`)).body.izseki;
    assert.ok(samoW.length && samoW.every((x) => x.vir_id === w.body.vir.id));
    const defs = (await a.call(`/api/students/${a.sid}/priprave/${p.id}/izseki?vrsta=definicija`)).body.izseki;
    assert.ok(defs.length && defs.every((x) => x.vrsta === "definicija"));
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}/izseki?vrsta=x`)).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}/izseki?vir=abc`)).status, 400);

    // Ponovna obdelava: isto število izsekov, brez podvajanja.
    const n0 = db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki WHERE vir_id = ?").get(t.body.vir.id).n;
    const re = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${t.body.vir.id}/obdelaj`, { method: "POST" });
    assert.equal(re.status, 200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki WHERE vir_id = ?").get(t.body.vir.id).n, n0);

    // Tuj profil: 404 za izseke in obdelavo.
    const b = await user("b@primer.si");
    assert.equal((await b.call(`/api/students/${a.sid}/priprave/${p.id}/izseki`)).status, 404);
    assert.equal((await b.call(`/api/students/${b.sid}/priprave/${p.id}/izseki`)).status, 404);
    assert.equal((await b.call(`/api/students/${b.sid}/priprave/${p.id}/viri/${t.body.vir.id}/obdelaj`, { method: "POST" })).status, 404);

    // Izbris vira odnese njegove izseke; izbris priprave vse.
    await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${w.body.vir.id}`, { method: "DELETE" });
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki WHERE vir_id = ?").get(w.body.vir.id).n, 0);
    await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "DELETE" });
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki").get().n, 0);
  });
});

// ---------- popravki po pregledih ----------

test("negotovo: naboj iona in geometrija se ne prepišeta; dopolnitev indeksov samo v kemijski enačbi", () => {
  const ion = oznaciNegotovo("Sulfatni ion SO42- in fosfatni PO43−.");
  assert.ok(ion.besedilo.includes(`SO42 ${NEGOTOVO}-`) && ion.besedilo.includes(`PO43 ${NEGOTOVO}−`), ion.besedilo);
  assert.ok(ion.negotovo.every((n) => !n.prepis));
  const geo = oznaciNegotovo("Velja AB2 + BC2 = AC2.");
  assert.equal(geo.besedilo, `Velja AB2 ${NEGOTOVO} + BC2 ${NEGOTOVO} = AC2 ${NEGOTOVO}.`);
  assert.ok(geo.negotovo.every((n) => !n.prepis));
  const enacba = oznaciNegotovo("2H2 + O2 → 2H2O");
  // En sam element z indeksom (H2, O2) ostane brez oznake, spojina v enačbi se dopolni.
  assert.equal(enacba.besedilo, `2H2 + O2 → 2H₂O ${NEGOTOVO}`);
  assert.equal(oznaciNegotovo("$\\frac{x2}{2}$ in a_1, \\alpha2").negotovo.length, 0, "LaTeX in indeksi z _ ostanejo");
  assert.ok(oznaciNegotovo("3x2 + 2x - 1 = 0").besedilo.startsWith(`3x2 ${NEGOTOVO}`));
});

test("hitrost: dolgi nizi in dolgi bloki ostanejo linearni", () => {
  let t0 = Date.now();
  razrezi([{ stran: 1, vrstice: Array.from({ length: 37 }, () => ({ besedilo: `${"a1".repeat(599)}_ ` })) }]);
  assert.ok(Date.now() - t0 < 1500, `${Date.now() - t0} ms`);
  t0 = Date.now();
  vrstaIzseka(`x ${"zakon ".repeat(40000)}`);
  assert.ok(Date.now() - t0 < 200, `${Date.now() - t0} ms`);
});

test("ločena nit: zlonameren Word (kvadratni čas) se ustavi po meji časa, strežnik ne čaka", async () => {
  const zlo = zip({ "[Content_Types].xml": CT, "word/document.xml": `<w:document><w:body>${"<w:p ".repeat(60000)}</w:body></w:document>` });
  const t0 = Date.now();
  await assert.rejects(uvoziVNiti("word", zlo, { ms: 800 }), (e) => e instanceof NapakaUvoza && e.code === "uvoz_cas");
  assert.ok(Date.now() - t0 < 3000);
  // Navaden vir gre skozi nit enako kot neposredno.
  const r = await uvoziVNiti("besedilo", Buffer.from(vir("kem-reakcije.md")));
  assert.deepEqual(r.izseki, razrezi((await preberiVir("besedilo", Buffer.from(vir("kem-reakcije.md")))).strani));
});

test("Word: nadpisano in podpisano (10⁻⁶, H₂O), polje z besedilom, <w:cr/>", async () => {
  const sup = (t) => `<w:r><w:rPr><w:vertAlign w:val="superscript"/></w:rPr><w:t>${t}</w:t></w:r>`;
  const sub = (t) => `<w:r><w:rPr><w:vertAlign w:val="subscript"/></w:rPr><w:t>${t}</w:t></w:r>`;
  const r = (t) => `<w:r><w:t xml:space="preserve">${t}</w:t></w:r>`;
  const okvir = `<w:r><mc:AlternateContent><mc:Choice><w:drawing><w:txbxContent><w:p>${r("Okvir")}</w:p></w:txbxContent></w:drawing></mc:Choice><mc:Fallback><w:pict><w:txbxContent><w:p>${r("Okvir")}</w:p></w:txbxContent></w:pict></mc:Fallback></mc:AlternateContent></w:r>`;
  const extra = `<w:p>${r("q = 2·10")}${sup("-6")}${r(" C, voda H")}${sub("2")}${r("O, x")}${sup("n+1")}</w:p><w:p>${r("Pred ")}${okvir}${r("Po")}</w:p><w:p>${r("a")}<w:r><w:cr/></w:r>${r("b")}</w:p>`;
  const st = beriWord(docx("# A", { omml: extra }));
  const vse = st.flatMap((x) => x.vrstice.map((v) => v.besedilo));
  assert.ok(vse.includes("q = 2·10⁻⁶ C, voda H₂O, xⁿ⁺¹"), JSON.stringify(vse));
  assert.ok(vse.includes("Pred Po") && vse.filter((v) => v === "Okvir").length === 1, JSON.stringify(vse));
  assert.ok(vse.includes("a b"));
  // Pravilno podpisan H₂O ni negotov.
  assert.equal(oznaciNegotovo("voda H₂O").negotovo.length, 0);
});

test("PDF: nadpisano z dvigom ostane v vrstici (3x², H₂O)", async () => {
  const r = await preberiVir("pdf", pdf([[["f(x) = 3x", { t: "2", dvig: 5 }, " + 2x - 1"], ["Voda H", { t: "2", dvig: -3 }, "O in naslov"]]]));
  // pdfjs izpusti presledek na začetku kosa za nadpisanim delom; pomen (3x², ne 3x2) ostane.
  assert.deepEqual(r.strani[0].vrstice.map((v) => v.besedilo.replace("²+", "² +")), ["f(x) = 3x² + 2x - 1", "Voda H₂O in naslov"]);
});

test("PDF: stran z malo besedila (naslovna) obdrži besedilo in je označena", async () => {
  const r = await preberiVir("pdf", pdf([["Integrali"], ["Newton-Leibnizova formula: F(b) - F(a) je ploscina."]]));
  assert.deepEqual(r.brezBesedila, [1]);
  assert.equal(r.strani[0].vrstice[0].besedilo, "Integrali");
});

test("PowerPoint: <a:br/> je presledek, številka prosojnice in noga nista besedilo", () => {
  const sl = `<p:sld xmlns:p="p" xmlns:a="a"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Prva</a:t></a:r><a:br/><a:r><a:t>druga</a:t></a:r></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:nvPr><p:ph type="sldNum"/></p:nvPr></p:nvSpPr><p:txBody><a:p><a:r><a:t>7</a:t></a:r></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:nvPr><p:ph type="ftr"/></p:nvPr></p:nvSpPr><p:txBody><a:p><a:r><a:t>Gimnazija X</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
  const st = beriPowerpoint(zip({ "[Content_Types].xml": CT, "ppt/presentation.xml": "<p:presentation/>", "ppt/slides/slide1.xml": sl }));
  assert.deepEqual(st[0].vrstice.filter((v) => v.besedilo).map((v) => v.besedilo), ["Prva druga"]);
});

test("negotovo (K-10): gotovi indeksi brez [?], potence in oklepaji izraza z [?]", () => {
  const brez = (t) => assert.deepEqual(oznaciNegotovo(t), { besedilo: t, negotovo: [] }, t);
  // Indeks 0 ali 1 ni potenca; števka pred »^« je indeks; x2 ob x1 v istem izseku je indeks.
  brez("h = v0^2/(2g), naboj e0 = 1,6·10^-19 As, 1/(4πε0) = 9·10^9");
  brez("Coulomb: F = q1q2/(4πε0 r^2)");
  brez("Vietovi formuli: x1 + x2 = -b/a, x1·x2 = c/a, f(x) = a(x - x1)(x - x2)");
  brez("a = (a1, a2), b = (b1, b2), |a| = √(a1^2 + a2^2), a · b = a1b1 + a2b2, AB = (x2 - x1, y2 - y1)");
  // Negotovo ostane: potenca brez »^«, tudi v oklepaju izraza in tik pred zaklepajem.
  const o = oznaciNegotovo("∫ (6x2 - 4x + 1) dx = 2x3 - 2x2 + x + C");
  assert.equal(o.besedilo, `∫ (6x2 ${NEGOTOVO} - 4x + 1) dx = 2x3 ${NEGOTOVO} - 2x2 ${NEGOTOVO} + x + C`);
  const c = oznaciNegotovo("F = q1q2/(4πε0 r2)");
  assert.equal(c.besedilo, `F = q1q2/(4πε0 r2 ${NEGOTOVO})`);
  assert.deepEqual(c.negotovo, [{ vrsta: "zapis", izvirno: "r2" }]);
  // x2 brez x1 v izseku ostane negotov; absolutna vrednost s števko (|a|2) je negotova.
  assert.equal(oznaciNegotovo("y = x2 + 1").besedilo, `y = x2 ${NEGOTOVO} + 1`);
  const a = oznaciNegotovo("a · a = |a|2, ln|x| + C, |x| = 3");
  assert.equal(a.besedilo, `a · a = |a|2 ${NEGOTOVO}, ln|x| + C, |x| = 3`);
  assert.deepEqual(a.negotovo, [{ vrsta: "zapis", izvirno: "|a|2" }]);
  // Potence ostanejo negotove tudi ob indeksih iste črke drugje v izseku (pregled 2, K-10).
  const ozn = (t) => oznaciNegotovo(t).negotovo.map((n) => n.izvirno);
  assert.deepEqual(ozn("ax2 + bx + c = 0, x1,2 = (-b ± √D)/2a"), ["ax2"]);
  assert.deepEqual(ozn("f(x) = x2 - 5x + 6, ničli x1 = 2 in x2 = 3"), ["x2"]);
  assert.deepEqual(ozn("v = v0 + a(t - t0), s = v0t + at2/2"), ["at2"]);
  assert.deepEqual(ozn("s0 = 5 m, a = 2 m/s2"), ["s2"]);
  assert.deepEqual(ozn("m1 = 2 kg, S = 3 cm2"), ["cm2"]);
  assert.deepEqual(ozn("S = πr2, r1 = 2"), ["πr2"]);
  assert.deepEqual(ozn("S = πr22 - πr12, r1 = 2 cm"), ["πr22", "πr12"]);
  assert.deepEqual(ozn("x10 + x1"), ["x10"]);
  assert.deepEqual(ozn("x2y^2 + 1"), ["x2y"]);
  assert.deepEqual(ozn("x1/2 = √x, x0,5"), ["x1", "x0"]);
  // Oklepaj sredi niza (funkcija, gnezdenje) ne skrije potence; tabela s cevmi ni absolutna vrednost.
  assert.deepEqual(ozn("y = ln(x2 + 1), sin(x2), (a + (b2))"), ["x2", "x2", "b2"]);
  assert.deepEqual(ozn("x|1|2|3"), []);
  assert.deepEqual(ozn("(a + b)2 = a2 + 2ab + b2, (x + 1)2"), [")2", "a2", "b2", ")2"]);
  // Uravnoteženi oklepaji ostanejo del kemijske formule.
  assert.equal(oznaciNegotovo("Ca(OH)2 + 2HCl → CaCl2 + 2H2O").negotovo.map((n) => n.izvirno).join(" "), "Ca(OH)2 CaCl2 H2O");
  assert.deepEqual(oznaciNegotovo("((NH4)2SO4 → x"), { besedilo: `((NH₄)₂SO₄ ${NEGOTOVO} → x`, negotovo: [{ vrsta: "kemija", izvirno: "(NH4)2SO4", prepis: "(NH₄)₂SO₄" }] });
});
