// Jedro slovenskih besedil za prvi izris aplikacije (public/i18n-osnova.js): ključi iz public/i18n/sl.js, ki jih omenjajo
// moduli prvega odprtja (server/startup-files.js, isti seznam kot <link rel="modulepreload">) in index.html (data-i18n).
// Strežnik ga vstavi v stran prijavljenega učenca (server/vstopna-stran.js withSlJedro), da prvi izris Učne poti ne čaka
// na cel slovar (~75 KB stisnjeno); app.js cel slovar naloži takoj po prvem izrisu. Moduli zunaj prvega odprtja uvozijo
// public/i18n.js (cel slovar), zato zanje jedro ni potrebno. Seznam se sestavi iz kode, ne na roke.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { startupFiles } from "./startup-files.js";
import { varenJson } from "./zacetni-podatki.js";

// Ključ v narekovajih (»"nav.path"«, data-i18n="…") ali predpona ključa, sestavljenega med izvajanjem
// (t(`xp.r.${vrsta}`), t(`ap.style${Slog}`), t("chk." + koda)): vsi ključi s to predpono.
const KLJUC = /["'`]([A-Za-z][\w-]*(?:\.[\w-]+)+)["'`]/g;
const PREDPONA = /[`"'}]([A-Za-z][\w-]*\.[\w.-]*)(?:\$\{|["'`]\s*\+)/g;
// Kode napak s strežnika (app.js serverError: block.*, gr.*, kv.*, comp.*, chk.*) in sporočila brez povezave: lahko
// pridejo že takoj po prvem izrisu, besedila pa ni v kodi kot niza. Dejstva na dnu Učne poti (greek.js: greek.f1 …,
// v zgodovinskem slogu era.<slog>.f1 … iz theme.js) imajo ključ iz podatkov.
// Varnostni odgovor (nujno.*, public/nujno.js vrstice/opomba): vedno v jedru, da kartica nikoli ne pokaže ključa (pregled #888).
const VEDNO = ["block.", "gr.", "kv.", "comp.", "chk.", "off.", "common.", "greek.", "era.", "nujno."];

export function kljuciJedra(publicDir, SL) {
  const vsi = Object.keys(SL);
  const imena = new Set(vsi);
  const datoteke = startupFiles(publicDir, "index.html").filter((u) => u.endsWith(".js") && !u.startsWith("/vendor/") && u !== "/i18n/sl.js" && u !== "/i18n.js");
  const jedro = new Set();
  const predpone = new Set(VEDNO);
  for (const u of [...datoteke, "/index.html"]) {
    let src = "";
    try {
      src = fs.readFileSync(path.join(publicDir, u), "utf8");
    } catch {
      continue;
    }
    for (const m of src.matchAll(KLJUC)) if (imena.has(m[1])) jedro.add(m[1]);
    for (const m of src.matchAll(PREDPONA)) predpone.add(m[1]);
  }
  for (const k of vsi) for (const p of predpone) if (k.startsWith(p)) jedro.add(k);
  return [...jedro];
}

// JSON jedra, varen za <script type="application/json"> (server/zacetni-podatki.js varenJson).
export async function slJedro(publicDir) {
  const SL = (await import(pathToFileURL(path.join(publicDir, "i18n", "sl.js")).href)).default;
  return varenJson(JSON.stringify(Object.fromEntries(kljuciJedra(publicDir, SL).map((k) => [k, SL[k]]))));
}
