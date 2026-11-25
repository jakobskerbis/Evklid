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

// Zasloni z malo besedila (skupaj ~7 KB stisnjeno): njihova besedila so v jedru, zato ti moduli uvozijo i18n-osnova.js in
// prvi klik nanje takoj po izrisu Učne poti čaka le na svoj (majhen) modul, ne na /i18n/zasloni-sl.js. Šteje ves statični
// podgraf vsakega (brez modulov prvega odprtja). Račun s plačili (~9 KB besedil) ostane v delu za zaslone (i18n-zasloni.js).
export const ZASLONI_V_JEDRU = ["vadnica.js", "flashcards.js", "corner.js", "schedule.js", "kalkulator-zaslon.js", "chat-settings.js", "odpri.js", "laboratorij.js", "prijave.js"];

export function kljuciJedra(publicDir, SL) {
  const vsi = Object.keys(SL);
  const imena = new Set(vsi);
  const zacetne = startupFiles(publicDir, "index.html");
  const datoteke = zacetne.filter((u) => u.endsWith(".js") && !u.startsWith("/vendor/") && u !== "/i18n/sl.js" && u !== "/i18n.js");
  const zasloni = [...podgraf(publicDir, ZASLONI_V_JEDRU.map((f) => path.join(publicDir, f)), new Set(zacetne.map((u) => path.join(publicDir, u))))];
  const jedro = new Set();
  const predpone = new Set(VEDNO);
  for (const u of [...datoteke, "/index.html", ...zasloni.map((f) => "/" + path.relative(publicDir, f).split(path.sep).join("/"))]) {
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

// Del slovarja za zaslone po prvem izrisu (vadnica, Račun, Kartice, Kotiček, kalkulator …): moduli, ki uvozijo
// public/i18n-zasloni.js namesto i18n.js, ob prvem kliku ne čakajo celega slovarja (~75 KB stisnjeno), ampak samo
// besedila, ki jih omenjajo oni in moduli, ki jih uvozijo statično (brez modulov prvega odprtja, ti so v jedru).
// Brez ključev jedra. Strežnik ga pošlje kot modul /i18n/zasloni-sl.js (server/app.js); sestavi se iz kode, enkrat ob
// zagonu (kot jedro). Ključ, sestavljen med izvajanjem, šteje s predpono (PREDPONA), kot pri jedru.
const UVOZ = /(?:^|[;\n}])\s*(?:import\s+(?:[\w*{}\s,$]+?\s+from\s+)?|export\s+(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s+from\s+)["'](\.{1,2}\/[^"'?#]+)["']/g;
export const ZASLONI_UVOZ = /(?:from|import)\s+["'](?:\.{1,2}\/)+i18n-zasloni\.js["']/;
function jsDatoteke(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "vendor" || e.name === "node_modules") continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) jsDatoteke(f, out);
    else if (e.name.endsWith(".js")) out.push(f);
  }
  return out;
}
// Datoteke statičnih podgrafov modulov vhodi (absolutne poti), brez modulov iz zagon in brez slovarjev (i18n*.js).
function podgraf(publicDir, vhodi, zagon) {
  const videno = new Set();
  const obisci = (f) => {
    if (videno.has(f) || zagon.has(f) || /[\\/]i18n[^\\/]*\.js$/.test(f) || !f.startsWith(publicDir + path.sep) || !fs.existsSync(f)) return;
    videno.add(f);
    for (const m of fs.readFileSync(f, "utf8").matchAll(UVOZ)) obisci(path.resolve(path.dirname(f), m[1]));
  };
  for (const f of vhodi) obisci(f);
  return videno;
}
export function kljuciZaslonov(publicDir, SL) {
  const imena = new Set(Object.keys(SL));
  const zagon = new Set(startupFiles(publicDir, "index.html").map((u) => path.join(publicDir, u)));
  const videno = podgraf(publicDir, jsDatoteke(publicDir).filter((f) => ZASLONI_UVOZ.test(fs.readFileSync(f, "utf8"))), zagon);
  const kljuci = new Set();
  const predpone = new Set();
  for (const f of videno) {
    const src = fs.readFileSync(f, "utf8");
    for (const m of src.matchAll(KLJUC)) if (imena.has(m[1])) kljuci.add(m[1]);
    for (const m of src.matchAll(PREDPONA)) predpone.add(m[1]);
  }
  for (const k of imena) for (const p of predpone) if (k.startsWith(p)) kljuci.add(k);
  const jedro = new Set(kljuciJedra(publicDir, SL));
  return [...kljuci].filter((k) => !jedro.has(k));
}

// Besedilo modula /i18n/zasloni-sl.js: export default { ključ: besedilo, … }.
export async function slZasloni(publicDir) {
  const SL = (await import(pathToFileURL(path.join(publicDir, "i18n", "sl.js")).href)).default;
  return `export default ${JSON.stringify(Object.fromEntries(kljuciZaslonov(publicDir, SL).map((k) => [k, SL[k]])))};\n`;
}
