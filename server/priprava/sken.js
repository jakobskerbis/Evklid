// Skenirane strani PDF (docs/priprava.md, PR 3b-2): iz strani brez plasti z besedilom vzame največjo sliko (skener in
// aplikacije za skeniranje shranijo eno sliko na stran), jo pretvori v sivine, zmanjša na največ 1568 točk po daljši
// stranici (meja, ki jo model še bere v polni ločljivosti) in zapiše kot PNG. Teče v ločeni niti (nit-uvoza.js) z mejo
// časa in pomnilnika, kot uvoz. Strani brez slike (na primer vektorska risba) ostanejo neprebrane (napaka »sken_ni_slike«).
import zlib from "node:zlib";
import { NapakaUvoza } from "./uvoz.js";

export const SKEN_DOLZINA = 1568;
const MAX_TOCK = 40_000_000; // večja slika (40 milijonov točk) se ne dekodira

// PNG v sivinah (8 bitov), filter »Up« za vsako vrstico (dobro stisne skenirano stran).
export function pngSivine(sivo, w, h) {
  const vrstice = Buffer.alloc((w + 1) * h);
  for (let y = 0; y < h; y++) {
    const o = y * (w + 1);
    vrstice[o] = 2;
    for (let x = 0; x < w; x++) vrstice[o + 1 + x] = (sivo[y * w + x] - (y ? sivo[(y - 1) * w + x] : 0)) & 255;
  }
  const kos = (tip, podatki) => {
    const dol = Buffer.alloc(4);
    dol.writeUInt32BE(podatki.length);
    const tp = Buffer.concat([Buffer.from(tip, "latin1"), podatki]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(tp) >>> 0);
    return Buffer.concat([dol, tp, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bitov na točko
  ihdr[9] = 0; // sivine
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), kos("IHDR", ihdr), kos("IDAT", zlib.deflateSync(vrstice, { level: 6 })), kos("IEND", Buffer.alloc(0))]);
}

// Slika iz pdfjs ({ width, height, kind, data }) → sivine, zmanjšane s povprečjem po blokih (linearno v številu točk).
// kind: 1 = 1 bit sivine (vrstice poravnane na bajt), 2 = RGB, 3 = RGBA.
export function zmanjsajSivo(img, dolzina = SKEN_DOLZINA) {
  const { width: w, height: h, kind, data } = img;
  const k = Math.min(1, dolzina / Math.max(w, h));
  const ow = Math.max(1, Math.round(w * k));
  const oh = Math.max(1, Math.round(h * k));
  const vsota = new Float64Array(ow * oh);
  const stevec = new Uint32Array(ow * oh);
  const ox = new Uint32Array(w);
  for (let x = 0; x < w; x++) ox[x] = Math.min(ow - 1, Math.floor(x * k));
  const vrsticaBitov = Math.ceil(w / 8);
  for (let y = 0; y < h; y++) {
    const oy = Math.min(oh - 1, Math.floor(y * k)) * ow;
    for (let x = 0; x < w; x++) {
      let g;
      if (kind === 1) g = (data[y * vrsticaBitov + (x >> 3)] >> (7 - (x & 7))) & 1 ? 255 : 0;
      else if (kind === 2) {
        const i = (y * w + x) * 3;
        g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      } else {
        const i = (y * w + x) * 4;
        // Prosojna točka je bela (papir).
        const a = data[i + 3] / 255;
        g = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) * a + 255 * (1 - a);
      }
      vsota[oy + ox[x]] += g;
      stevec[oy + ox[x]]++;
    }
  }
  const sivo = new Uint8Array(ow * oh);
  for (let i = 0; i < sivo.length; i++) sivo[i] = stevec[i] ? Math.round(vsota[i] / stevec[i]) : 255;
  return { sivo, w: ow, h: oh };
}

// Zasuk strani (/Rotate 90, 180, 270) v smeri urinega kazalca.
export function zasukaj({ sivo, w, h }, stopinj) {
  const r = ((stopinj % 360) + 360) % 360;
  if (!r) return { sivo, w, h };
  const nw = r === 180 ? w : h;
  const nh = r === 180 ? h : w;
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [nx, ny] = r === 90 ? [h - 1 - y, x] : r === 180 ? [w - 1 - x, h - 1 - y] : [y, w - 1 - x];
      out[ny * nw + nx] = sivo[y * w + x];
    }
  return { sivo: out, w: nw, h: nh };
}

// Delež temnih točk (sivina pod 160); pod PRAG_CRNILA je stran prazna (ena kratka vrstica je ~0,3 %).
const PRAG_CRNILA = 0.0002;
export function crnila(sivo) {
  let n = 0;
  for (let i = 0; i < sivo.length; i++) if (sivo[i] < 160) n++;
  return sivo.length ? n / sivo.length : 0;
}

// Usmerjenost fotografije iz EXIF (APP1): 3 → 180°, 6 → 90°, 8 → 270° v smeri urinega kazalca; sicer 0.
export function exifZasuk(jpg) {
  for (let i = 2; i + 4 < jpg.length; ) {
    if (jpg[i] !== 0xff) return 0;
    const m = jpg[i + 1];
    if (m === 0xda || m === 0xd9) return 0;
    const dol = jpg.readUInt16BE(i + 2);
    if (m === 0xe1 && jpg.toString("latin1", i + 4, i + 10) === "Exif\0\0") {
      const t = i + 10;
      const le = jpg.toString("latin1", t, t + 2) === "II";
      const u16 = (o) => (le ? jpg.readUInt16LE(o) : jpg.readUInt16BE(o));
      const u32 = (o) => (le ? jpg.readUInt32LE(o) : jpg.readUInt32BE(o));
      const ifd = t + u32(t + 4);
      if (ifd + 2 > i + 2 + dol) return 0;
      const n = u16(ifd);
      for (let k = 0; k < n && ifd + 2 + 12 * (k + 1) <= i + 2 + dol; k++) {
        const e = ifd + 2 + 12 * k;
        if (u16(e) === 0x0112) return { 3: 180, 6: 90, 8: 270 }[u16(e + 8)] || 0;
      }
      return 0;
    }
    i += 2 + dol;
  }
  return 0;
}

// Fotografija JPEG, prevelika za model (PR 3b), se zmanjša po isti poti: zavije se v PDF z eno stranjo (pdfjs sam
// dekodira JPEG) in prebere kot skenirana stran. Vrne null, če velikosti ali barvnega prostora ni mogoče prebrati.
export function jpegVPdf(jpg) {
  let w = 0;
  let h = 0;
  let komponent = 0;
  for (let i = 2; i + 9 < jpg.length; ) {
    if (jpg[i] !== 0xff) return null;
    const m = jpg[i + 1];
    if (m === 0xff) {
      i++;
      continue;
    }
    const dol = jpg.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      h = jpg.readUInt16BE(i + 5);
      w = jpg.readUInt16BE(i + 7);
      komponent = jpg[i + 9];
      break;
    }
    i += 2 + dol;
  }
  const prostor = { 1: "/DeviceGray", 3: "/DeviceRGB" }[komponent];
  if (!w || !h || !prostor) return null;
  const deli = [];
  const odmiki = [];
  let dolzina = 0;
  const dodaj = (b) => {
    const x = Buffer.isBuffer(b) ? b : Buffer.from(b, "latin1");
    deli.push(x);
    dolzina += x.length;
  };
  const vsebina = `q ${w} 0 0 ${h} 0 0 cm /Im1 Do Q`;
  dodaj("%PDF-1.4\n");
  const objekti = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`,
  ];
  objekti.forEach((o, i) => {
    odmiki.push(dolzina);
    dodaj(`${i + 1} 0 obj\n${o}\nendobj\n`);
  });
  odmiki.push(dolzina);
  dodaj(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace ${prostor} /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
  dodaj(jpg);
  dodaj("\nendstream\nendobj\n");
  odmiki.push(dolzina);
  dodaj(`5 0 obj\n<< /Length ${vsebina.length} >>\nstream\n${vsebina}\nendstream\nendobj\n`);
  const xref = dolzina;
  dodaj(`xref\n0 6\n0000000000 65535 f \n${odmiki.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return Buffer.concat(deli);
}

/**
 * Slike skeniranih strani PDF: [{ stran, png }] (png je Buffer) ali [{ stran, napaka: "sken_ni_slike" }]. Strani so
 * številke od 1; prebere jih največ `najvec`.
 */
export async function slikeStrani(buf, strani, { najvec = 5, zasuk = 0 } = {}) {
  const pdfjs = await import(import.meta.resolve("pdfjs-dist/legacy/build/pdf.mjs"));
  const naloga = pdfjs.getDocument({
    data: new Uint8Array(buf),
    isEvalSupported: false,
    disableFontFace: true,
    useSystemFonts: false,
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
    stopAtErrors: false,
    maxImageSize: MAX_TOCK, // večje slike pdfjs sploh ne dekodira (pomnilnik)
    verbosity: 0,
  });
  let doc;
  try {
    doc = await naloga.promise;
  } catch {
    await naloga.destroy();
    throw new NapakaUvoza("uvoz_pdf", "PDF je poškodovan ali ga ni mogoče prebrati.");
  }
  const SLIKE = new Set([pdfjs.OPS.paintImageXObject, pdfjs.OPS.paintInlineImageXObject].filter((x) => x !== undefined));
  const out = [];
  try {
    for (const n of strani.slice(0, najvec)) {
      if (!Number.isInteger(n) || n < 1 || n > doc.numPages) continue;
      const page = await doc.getPage(n);
      const ops = await page.getOperatorList();
      let naj = null;
      for (let i = 0; i < ops.fnArray.length; i++) {
        if (!SLIKE.has(ops.fnArray[i])) continue;
        const a = ops.argsArray[i][0];
        // Ime slike: g_… je skupna (več strani), sicer slika strani; pdfjs jo razreši, ko je dekodirana.
        const img = typeof a === "string" ? await new Promise((r) => (a.startsWith("g_") ? page.commonObjs : page.objs).get(a, r)) : a;
        if (!img?.data || ![1, 2, 3].includes(img.kind) || img.width * img.height > MAX_TOCK) continue;
        if (!naj || img.width * img.height > naj.width * naj.height) naj = img;
      }
      // Majhna slika (logotip, ikona) ni skenirana stran.
      if (!naj || Math.max(naj.width, naj.height) < 300) out.push({ stran: n, napaka: "sken_ni_slike" });
      else {
        const s = zasukaj(zmanjsajSivo(naj), (page.rotate || 0) + zasuk);
        // Prazna stran (hrbtna stran pri obojestranskem skeniranju) se ne pošlje modelu.
        if (crnila(s.sivo) < PRAG_CRNILA) out.push({ stran: n, prazna: true });
        else out.push({ stran: n, png: pngSivine(s.sivo, s.w, s.h) });
      }
      page.cleanup();
    }
    return out;
  } catch (e) {
    if (e instanceof NapakaUvoza) throw e;
    throw new NapakaUvoza("uvoz_pdf", "PDF je poškodovan ali ga ni mogoče prebrati.");
  } finally {
    await naloga.destroy();
  }
}
