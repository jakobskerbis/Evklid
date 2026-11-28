// Ločena nit za uvoz enega vira priprave (uvoz.js uvoziVNiti): prebere dokument in ga razreže na izseke, ali (sken)
// vrne slike skeniranih strani PDF za branje (PR 3b-2). Glavna nit jo ustavi ob preseženem času ali pomnilniku, zato
// počasen ali zlonameren dokument ne ustavi strežnika.
import { parentPort, workerData } from "node:worker_threads";
import { preberiVir, vstaviPrepise, NapakaUvoza } from "./uvoz.js";
import { razrezi } from "./izseki.js";
import { slikeStrani, jpegVPdf, exifZasuk } from "./sken.js";

try {
  const buf = Buffer.from(workerData.podatki.buffer, workerData.podatki.byteOffset, workerData.podatki.byteLength);
  if (workerData.sken) {
    // Prevelika fotografija JPEG: zavita v PDF z eno stranjo in zmanjšana kot skenirana stran.
    const pdf = workerData.sken.jpeg ? jpegVPdf(buf) : buf;
    if (!pdf) throw new NapakaUvoza("uvoz_slika", "Fotografije ni mogoče zmanjšati.");
    const slike = await slikeStrani(pdf, workerData.sken.strani, { najvec: workerData.sken.najvec, zasuk: workerData.sken.jpeg ? exifZasuk(buf) : 0 });
    parentPort.postMessage({ ok: true, rezultat: { slike: slike.map((s) => (s.png ? { stran: s.stran, png: s.png.toString("base64") } : s)) } });
  } else {
    const r = await preberiVir(workerData.vrsta, buf);
    const strani = workerData.prepisi ? vstaviPrepise(r.strani, workerData.prepisi) : r.strani;
    parentPort.postMessage({ ok: true, rezultat: { izseki: razrezi(strani), strani: strani.length, opozorila: r.opozorila, brezBesedila: r.brezBesedila } });
  }
} catch (e) {
  parentPort.postMessage(e instanceof NapakaUvoza ? { ok: false, code: e.code, message: e.message } : { ok: false, code: "uvoz_napaka" });
}
