// Ločena nit za uvoz enega vira priprave (uvoz.js uvoziVNiti): prebere dokument in ga razreže na izseke. Glavna nit
// jo ustavi ob preseženem času ali pomnilniku, zato počasen ali zlonameren dokument ne ustavi strežnika.
import { parentPort, workerData } from "node:worker_threads";
import { preberiVir, NapakaUvoza } from "./uvoz.js";
import { razrezi } from "./izseki.js";

try {
  const r = await preberiVir(workerData.vrsta, Buffer.from(workerData.podatki.buffer, workerData.podatki.byteOffset, workerData.podatki.byteLength));
  parentPort.postMessage({ ok: true, rezultat: { izseki: razrezi(r.strani), strani: r.strani.length, opozorila: r.opozorila, brezBesedila: r.brezBesedila } });
} catch (e) {
  parentPort.postMessage(e instanceof NapakaUvoza ? { ok: false, code: e.code, message: e.message } : { ok: false, code: "uvoz_napaka" });
}
