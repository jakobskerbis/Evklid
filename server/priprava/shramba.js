// Izvirniki virov priprave na test (docs/priprava.md, odločitev j 24. 11. 2026): fotografija, PDF, Word, PowerPoint
// ali prilepljeno besedilo. Vrsta se prepozna po vsebini (magična števila, pri Wordu in PowerPointu imenik ZIP), nikoli
// po končnici ali glavi Content-Type. Izvirnik se shrani šifriran (crypto-polje.js sealBytes); brez ključa
// EVKLID_DATA_KEY ga ne sprejmemo. Brez razčlenjevanja in brez AI (to pride v PR 3, server/priprava/uvoz.js).
import { sealBytes, unsealBytes, encryptionOn } from "../crypto-polje.js";

const MB = 1024 * 1024;
// Meje (odloči j; docs/priprava.md). Fotografija iz telefona po izrezu je ~1–3 MB, PDF zapiskov redko nad 10 MB.
export const MEJE = {
  slika: 10 * MB,
  pdf: 15 * MB,
  word: 15 * MB,
  powerpoint: 15 * MB,
  besedilo: 50_000, // znakov prilepljenega besedila
};
export const NAJVEC_BAJTOV = 15 * MB; // telo zahteve z datoteko
export const NAJVEC_VIROV = 20; // na pripravo
export const NAJVEC_PRIPRAV = 20; // na profil
export const NAJVEC_SKUPAJ = 50 * MB; // vsi izvirniki enega profila
// Vsi izvirniki na strežniku (disk pri Renderju je majhen, dnevna kopija potrebuje še dvakratno velikost baze;
// server/kopije.js makeBackup). EVKLID_PRIPRAVA_PROSTOR_MB ga spremeni.
export const prostorVsi = () => {
  const n = Number(process.env.EVKLID_PRIPRAVA_PROSTOR_MB);
  return (Number.isFinite(n) && n > 0 ? n : 200) * MB;
};
// Bajti shranjenih izvirnikov (vsi ali enega profila). Vir brez izvirnika (po obnovi iz kopije) ne šteje.
export function zasedeno(db, studentId = null) {
  return db
    .prepare(`SELECT COALESCE(SUM(v.velikost), 0) AS b FROM priprava_viri v JOIN priprava_izvirniki i ON i.vir_id = v.id${studentId === null ? "" : " WHERE v.student_id = ?"}`)
    .get(...(studentId === null ? [] : [studentId])).b;
}

export const MIME = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
  word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  powerpoint: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  besedilo: "text/plain; charset=utf-8",
};

const zacne = (buf, bytes, off = 0) => buf.length >= off + bytes.length && bytes.every((b, i) => buf[off + i] === b);

// Imena datotek v imeniku ZIP (samo branje glav, nič razširjanja). null, če ZIP ni cel ali je nenavaden (ZIP64,
// več diskov, imenik zunaj datoteke).
export function zipImena(buf, najvec = 5000) {
  if (!zacne(buf, [0x50, 0x4b, 0x03, 0x04]) || buf.length < 22) return null;
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;
  const disk = buf.readUInt16LE(eocd + 4);
  const n = buf.readUInt16LE(eocd + 10);
  const size = buf.readUInt32LE(eocd + 12);
  const off = buf.readUInt32LE(eocd + 16);
  if (disk !== 0 || n === 0xffff || size === 0xffffffff || off === 0xffffffff || n > najvec || off + size > eocd) return null;
  const imena = [];
  let p = off;
  for (let k = 0; k < n; k++) {
    if (p + 46 > eocd || buf.readUInt32LE(p) !== 0x02014b50) return null;
    const dIme = buf.readUInt16LE(p + 28);
    const dDod = buf.readUInt16LE(p + 30);
    const dOp = buf.readUInt16LE(p + 32);
    if (p + 46 + dIme > eocd) return null;
    imena.push(buf.subarray(p + 46, p + 46 + dIme).toString("latin1"));
    p += 46 + dIme + dDod + dOp;
  }
  return imena;
}

/**
 * Vrsta datoteke po vsebini: { vrsta, mime } ali null (nepodprto). Podprto: JPEG, PNG, WebP, PDF, Word (.docx) in
 * PowerPoint (.pptx). Stari .doc/.ppt (OLE), HEIC, ZIP brez Wordovega ali PowerPointovega dela in ostalo: null.
 */
export function prepoznaj(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 8) return null;
  if (zacne(buf, [0xff, 0xd8, 0xff])) return { vrsta: "slika", mime: MIME.jpeg };
  if (zacne(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { vrsta: "slika", mime: MIME.png };
  if (buf.length >= 12 && buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") return { vrsta: "slika", mime: MIME.webp };
  if (buf.toString("latin1", 0, 5) === "%PDF-") return { vrsta: "pdf", mime: MIME.pdf };
  const imena = zipImena(buf);
  if (imena && imena.includes("[Content_Types].xml")) {
    if (imena.includes("word/document.xml")) return { vrsta: "word", mime: MIME.word };
    if (imena.includes("ppt/presentation.xml")) return { vrsta: "powerpoint", mime: MIME.powerpoint };
  }
  return null;
}

/**
 * Preveri datoteko: { ok: true, vrsta, mime } ali { ok: false, status, error, code }. Meja velikosti po vrsti.
 */
export function preveriDatoteko(buf) {
  if (!Buffer.isBuffer(buf) || !buf.length) return { ok: false, status: 400, error: "Datoteka manjka.", code: "priprava_prazno" };
  if (buf.length > NAJVEC_BAJTOV) return { ok: false, status: 413, error: "Datoteka je prevelika.", code: "priprava_velikost" };
  const t = prepoznaj(buf);
  if (!t) return { ok: false, status: 415, error: "Ta vrsta datoteke ni podprta. Naloži fotografijo (JPEG, PNG, WebP), PDF, Word (.docx) ali PowerPoint (.pptx).", code: "priprava_vrsta" };
  if (buf.length > MEJE[t.vrsta]) return { ok: false, status: 413, error: "Datoteka je prevelika.", code: "priprava_velikost" };
  return { ok: true, ...t };
}

export const lahkoShranim = () => encryptionOn();

// Shrani šifriran izvirnik vira. Klicatelj je v transakciji in je preveril lastništvo. Brez ključa vrže napako.
export function shraniIzvirnik(db, virId, buf) {
  const sealed = sealBytes(buf);
  if (!sealed) throw Object.assign(new Error("ni ključa za šifriranje"), { code: "BREZ_KLJUCA" });
  db.prepare("INSERT INTO priprava_izvirniki (vir_id, podatki) VALUES (?, ?)").run(virId, sealed);
}

// Odšifriran izvirnik (Buffer) ali null (ni ga več, npr. po obnovi iz kopije, ali manjka ključ).
export function preberiIzvirnik(db, virId) {
  const r = db.prepare("SELECT podatki FROM priprava_izvirniki WHERE vir_id = ?").get(virId);
  return r ? unsealBytes(r.podatki) : null;
}

/**
 * Izbris z PRAGMA secure_delete: izbrisani (šifrirani) bajti ne ostanejo v prostih straneh baze. fn teče sinhrono;
 * po njem nazaj na prejšnjo nastavitev.
 */
export function zVarnimBrisanjem(db, fn) {
  let prev = null;
  try {
    prev = db.prepare("PRAGMA secure_delete").get()?.secure_delete ?? null;
    db.exec("PRAGMA secure_delete = ON");
  } catch {}
  try {
    return fn();
  } finally {
    try {
      if (prev !== null) db.exec(`PRAGMA secure_delete = ${Number(prev) ? "ON" : "OFF"}`);
    } catch {}
  }
}

/**
 * Za varnostne kopije (server/kopije.js): pobriše vse izvirnike v kopiji baze. Vrne število pobrisanih. Metapodatki
 * virov ostanejo (po obnovi vir pokaže, da izvirnika ni več).
 */
export function brezIzvirnikov(db) {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'priprava_izvirniki'").get()) return 0;
  return Number(db.prepare("DELETE FROM priprava_izvirniki").run().changes);
}
