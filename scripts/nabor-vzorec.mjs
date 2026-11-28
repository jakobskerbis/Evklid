// Preverjanje prepisa uradnih nalog nabora inštruktorja (docs/meritve/prepis-nabora-instruktorja-*.md).
// 1) Vzorec: 5 % uporabnih postavk vsake datoteke s prepisi, najmanj 2, vrstni red sha256("vz1" + id); izbran pred
//    preverjanjem. Ker je najmanj 2 na datoteko, so majhne datoteke nadpovprečno zastopane (vzorec je razslojen,
//    skupni delež je približek za cel nabor).
// 2) Štetje: izidi preverjanja (JSON seznami {id, besedilo_ok, odgovor_ok, resljivo, tema_ok}) po merilih, z Wilsonovim
//    95-% intervalom, za cel vzorec in za postavke vzorca, ki so v končnem naboru.
// Prepisi in izidi so v zasebni mapi projekta (k06-nabor/), ne v repozitoriju (© RIC).
//
//   node scripts/nabor-vzorec.mjs --vzorec <mapa s prepisi>
//   node scripts/nabor-vzorec.mjs --prestej <mapa s prepisi> <izid1.json> [<izid2.json> …]
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uradnePostavke } from "./nabor-instruktorja.mjs";

const h = (id) => crypto.createHash("sha256").update("vz1" + id).digest("hex");
const uporabna = (x) => x.odgovor && x.odgovor.vrednost != null && !x.odgovor_negotov && x.odgovor.tip !== "risba";

export function vzorec(mapa) {
  const datoteke = {};
  let vseh = 0;
  for (const f of fs.readdirSync(mapa).filter((f) => f.endsWith(".json")).sort()) {
    const a = JSON.parse(fs.readFileSync(path.join(mapa, f), "utf8")).filter(uporabna);
    vseh += a.length;
    const k = Math.max(2, Math.round(a.length * 0.05));
    datoteke[f] = [...a].sort((x, y) => (h(x.id) < h(y.id) ? -1 : 1)).slice(0, k).map((x) => x.id);
  }
  return { vseh, n: Object.values(datoteke).flat().length, datoteke };
}

// Wilson 95 % v odstotkih (docs/meritve/README.md §1).
export function wilson(k, n, z = 1.96) {
  const p = k / n, d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d, r = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - r), Math.min(1, c + r)].map((x) => +(100 * x).toFixed(1));
}

const MERILA = [
  ["besedilo ni zvesto", (x) => !x.besedilo_ok],
  ["odgovor se ne ujema z navodili", (x) => !x.odgovor_ok],
  ["ni rešljivo ali opis slike izda odgovor", (x) => !x.resljivo],
  ["napačna tema", (x) => !x.tema_ok],
  ["katerakoli napaka", (x) => !x.besedilo_ok || !x.odgovor_ok || !x.resljivo || !x.tema_ok],
];

export function prestej(izidi, vNaboru) {
  const enkratni = [...new Map(izidi.map((x) => [x.id, x])).values()];
  const del = (arr) => MERILA.map(([ime, f]) => {
    const k = arr.filter(f).length;
    return { merilo: ime, napak: k, n: arr.length, wilson: wilson(k, arr.length) };
  });
  return { vzorec: del(enkratni), v_naboru: del(enkratni.filter((x) => vNaboru.has(x.id))) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  if (a[0] === "--vzorec" && a[1]) console.log(JSON.stringify(vzorec(a[1]), null, 1));
  else if (a[0] === "--prestej" && a[1] && a.length > 2) {
    const izidi = a.slice(2).flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
    const vNaboru = new Set(uradnePostavke(a[1]).map((p) => p.id));
    console.log(JSON.stringify(prestej(izidi, vNaboru), null, 1));
  } else {
    console.error("Uporaba: node scripts/nabor-vzorec.mjs --vzorec <mapa> | --prestej <mapa> <izid.json>…");
    process.exit(1);
  }
}
