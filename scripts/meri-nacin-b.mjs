// Meritev krajšega načina B (j 2026-11-17, »krajši prvi odgovor«): iste naloge pošlje inštruktorju v načinu B
// s starim in z novim razdelkom »Način B – celotna rešitev« v sistemskem promptu (vse drugo enako) in primerja:
// pravilnost (pričakovani rezultat v odgovoru), rezultat v prvem stavku, besede pred rezultatom, izhodne žetone,
// znake, Preverbo, »Zapomni si«, »kaj je naloga preverjala«, stavke v Vaji, čas do prvega besedila in do konca.
// Isti klic kot v aplikaciji (server/prompt.js, streamReply, SETTINGS_TOOLS, filter izpisa): SŠ z naročnino =
// način »think«, OŠ = »chat« (server/usage.js chooseMode). Brez skrite opombe lekcije in preverjanja s kodo.
// Ne piše v bazo in ne šteje v porabo aplikacije; ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-nacin-b.mjs [--max-usd 3] [--ponovi 1] [--out data/meri-nacin-b.json]
// Zagon v lupini Renderja (tam je ključ API). Brez ključa konča brez klica.
import fs from "node:fs";
import { buildSystemPrompt, loadTemplate } from "../server/prompt.js";
import { streamReply, isMockMode, modeParams, costUsd, apiErrorCode } from "../server/claude.js";
import { callMaxUsd } from "../server/meje-ai.js";
import { normalizeSettings } from "../server/settings.js";
import { SETTINGS_TOOLS } from "../server/chat-settings.js";
import { createStreamFilter, stripMeta, stripChoices } from "../server/meta.js";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const MAX_USD = Number(arg("max-usd", 3));
const PONOVI = Math.min(Math.max(Number(arg("ponovi", 1)) || 1, 1), 5);
const OUT = arg("out", "data/meri-nacin-b.json");

if (isMockMode()) {
  console.error("Ni ključa API (preizkusni način): zaženi v lupini Renderja.");
  process.exit(1);
}

// Razdelek načina B pred spremembo (main do 17. 11.), da stari prompt nastane iz trenutnega brez git-a.
const STARI_B =
  "## Način B – celotna rešitev\nPodatki → Iščemo → načrt (katera zveza in zakaj) → oštevilčeni koraki, vsak z »zakaj« → rezultat z enoto → preverba smiselnosti → en stavek, katero znanje je naloga preverjala → ponudba podobne naloge za samostojno vajo. Tudi v načinu B je vsak korak razložen.\n\n";
const nov = loadTemplate();
const a = nov.indexOf("## Način B – celotna rešitev");
const b = nov.indexOf("## Vzorec za računske naloge");
if (a < 0 || b < a) throw new Error("razdelka načina B ni v promptu");
const PROMPTI = { stari: nov.slice(0, a) + STARI_B + nov.slice(b), novi: nov };

// SŠ 4. letnik VR (MAT, FIZ, KEM) in dve nalogi OŠ; ok = vzorci pravilnega končnega rezultata.
const SS = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" };
const NALOGE = [
  { id: "mat-kot", s: { ...SS, subject: "MAT" }, q: "Stranice trikotnika merijo 9 cm, 12,5 cm in 16 cm. Izračunaj največji kot trikotnika.", ok: [/94\s*°\s*4[67]/, /94[,.]7[89]/, /94[,.]8(?!\d)/] },
  { id: "mat-vrsta", s: { ...SS, subject: "MAT" }, q: "Geometrijsko zaporedje ima prvi člen 3 in količnik 2. Koliko je vsota prvih 10 členov?", ok: [/3\s?069(?![\d,])/] },
  { id: "mat-ekstrem", s: { ...SS, subject: "MAT" }, q: "Določi največjo vrednost funkcije f(x) = -x^3 + 3x^2 + 9x - 2 na intervalu [0, 4].", ok: [/(?<![\d,])25(?![\d,])/] },
  { id: "fiz-met", s: { ...SS, subject: "FIZ" }, q: "Kamen vržemo vodoravno s hitrostjo 12 m/s z višine 20 m. Kako daleč od vznožja pade na tla? (g = 9,81 m/s²)", ok: [/24[,.]2\d*\s*m/, /(?<![\d,])24\s*m/] },
  { id: "fiz-foton", s: { ...SS, subject: "FIZ" }, q: "Kolikšna je energija fotona svetlobe z valovno dolžino 500 nm? (h = 6,63 · 10⁻³⁴ Js, c = 3,00 · 10⁸ m/s)", ok: [/3[,.]9[78]\d*\s*·\s*10\^?(?:⁻¹⁹|-19)/, /2[,.]4[89]\s*eV/] },
  { id: "fiz-kondenzator", s: { ...SS, subject: "FIZ" }, q: "Kondenzator s kapaciteto 47 µF priključimo na napetost 12 V. Koliko energije je shranjene v njem?", ok: [/3[,.]38?\d*\s*mJ/, /3[,.]38?\d*\s*·\s*10\^?(?:⁻³|-3)\s*J/, /0[,.]0033[78]?\s*J/] },
  { id: "kem-masa", s: { ...SS, subject: "KEM" }, q: "Koliko gramov NaOH potrebujemo za 250 mL raztopine s koncentracijo 0,200 mol/L? (M(NaOH) = 40,0 g/mol)", ok: [/(?<![\d,])2(?:[,.]00?)?\s*g(?![a-z])/] },
  { id: "kem-ph", s: { ...SS, subject: "KEM" }, q: "Izračunaj pH raztopine HCl s koncentracijo 0,0025 mol/L.", ok: [/2[,.]60?(?!\d)/] },
  { id: "os-hitrost", s: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "FIZ" }, q: "Avto vozi s stalno hitrostjo 72 km/h. Koliko poti prevozi v 15 minutah?", ok: [/(?<![\d,])18\s*km/, /18\s?000\s*m/] },
  { id: "os-pitagora", s: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" }, q: "Pravokotni trikotnik ima kateti 6 cm in 8 cm. Kolikšna je hipotenuza?", ok: [/(?<![\d,])10\s*cm/] },
];

// Besedilo, ki ga vidi učenec: brez META, gumbov in strojnih blokov (RACUN, KARTICA, ODPRI …).
const vidno = (t) => stripChoices(stripMeta(String(t))).replace(/<<[A-ZČŠŽ_]+[\s\S]*?>>/g, "").trim();
// Za iskanje rezultata: LaTeX v navaden zapis (24{,}2\,\mathrm{m} → 24,2 m, 3{,}98 \cdot 10^{-19} → 3,98 · 10^-19).
const navadno = (t) =>
  t
    .replace(/\$/g, "")
    .replace(/\\(?:mathrm|text|mathit|operatorname)\{([^}]*)\}/g, "$1")
    .replace(/\\[,;:!]|\\quad|~/g, " ")
    .replace(/\\cdot|\\times|×/g, "·")
    .replace(/\^\{?\\circ\}?/g, "°")
    .replace(/\\approx/g, "≈")
    .replace(/−/g, "-")
    .replace(/[{}]/g, "");
const prviStavek = (t) => {
  const x = t.replace(/^\s*#+.*\n/, "").trim();
  const m = x.match(/^[\s\S]*?(?:[.!?](?=\s|$)|\n)/);
  return (m ? m[0] : x).trim();
};
const besede = (t) => (t.replace(/\$[^$]*\$/g, " x ").match(/[\p{L}\p{N}]+/gu) || []).length;
function oceni(text, ok) {
  const v = navadno(vidno(text));
  const najdi = (t) => ok.map((re) => t.search(re)).filter((i) => i >= 0).sort((x, y) => x - y)[0] ?? -1;
  const at = najdi(v);
  const prvi = prviStavek(v);
  const vaja = v.match(/\*\*Vaja:?\*\*:?\s*([\s\S]*?)(?:\n\s*\n|$)/i);
  return {
    pravilno: at >= 0,
    vPrvemStavku: najdi(prvi) >= 0,
    krepkoVPrvem: /\*\*[^*]+\*\*/.test(prvi),
    besedPred: at >= 0 ? besede(v.slice(0, at)) : null,
    znakov: v.length,
    besed: besede(v),
    preverba: /preverba/i.test(v),
    zapomni: /zapomni si/i.test(v),
    preverjala: /naloga (?:je )?preverja/i.test(v),
    vajaStavkov: vaja ? (vaja[1].match(/[.?!](?=\s|$)/g) || [1]).length : 0,
    vidno: vidno(text),
  };
}

const s = (ms) => (ms / 1000).toFixed(1).replace(".", ",");
let porabljeno = 0;
const izid = [];
let ustavljeno = false;
outer: for (let k = 0; k < PONOVI; k++) {
  for (const n of NALOGE) {
    const settings = normalizeSettings({ ...n.s, solving_mode: "B" });
    const mode = settings.educational_track === "SREDNJA_SOLA" ? "think" : "chat";
    const { model, max_tokens } = modeParams(mode);
    for (const ime of ["stari", "novi"]) {
      const system = buildSystemPrompt({ settings, studentName: "Ana" }, PROMPTI[ime]);
      const najvec = callMaxUsd(model, Math.ceil(system.length / 3) + 6000, max_tokens);
      if (porabljeno + najvec > MAX_USD) {
        ustavljeno = true;
        break outer;
      }
      const filter = createStreamFilter();
      const t0 = performance.now();
      let prvo = null;
      try {
        const r = await streamReply({
          system,
          mode,
          tools: SETTINGS_TOOLS,
          messages: [{ role: "user", content: n.q }],
          onText: (t) => {
            if (prvo === null && filter.push(t)) prvo = performance.now() - t0;
          },
        });
        const konec = performance.now() - t0;
        const cena = costUsd(r.model || model, r.usage || {});
        porabljeno += cena;
        izid.push({ naloga: n.id, prompt: ime, mode, model: r.model || model, prvo, konec, izhod: r.usage?.output_tokens || 0, cena, ...oceni(r.text || "", n.ok) });
        const z = izid.at(-1);
        console.log(`${n.id} ${ime}: ${z.pravilno ? "pravilno" : "NI REZULTATA"}, 1. stavek ${z.vPrvemStavku ? "da" : "ne"}, ${z.izhod} žet., ${z.znakov} zn., ${s(prvo ?? 0)}/${s(konec)} s, ${cena.toFixed(4)} $`);
      } catch (e) {
        if (e?.usage) porabljeno += costUsd(e.model || model, e.usage);
        console.log(`${n.id} ${ime}: napaka ${apiErrorCode(e) || e.message}`);
      }
    }
  }
}

const povp = (xs) => (xs.length ? xs.reduce((x, y) => x + y, 0) / xs.length : 0);
const vrstica = (ime) => {
  const r = izid.filter((x) => x.prompt === ime);
  const d = (f) => `${r.filter(f).length}/${r.length}`;
  return { ime, n: r.length, pravilno: d((x) => x.pravilno), prvi: d((x) => x.vPrvemStavku), krepko: d((x) => x.krepkoVPrvem), besedPred: povp(r.filter((x) => x.besedPred !== null).map((x) => x.besedPred)), izhod: povp(r.map((x) => x.izhod)), znakov: povp(r.map((x) => x.znakov)), besed: povp(r.map((x) => x.besed)), preverba: d((x) => x.preverba), zapomni: d((x) => x.zapomni), preverjala: d((x) => x.preverjala), vaja: povp(r.map((x) => x.vajaStavkov)), prvo: povp(r.map((x) => x.prvo || 0)), konec: povp(r.map((x) => x.konec)) };
};
const t = ["stari", "novi"].map(vrstica);
const f = (x) => Math.round(x).toLocaleString("sl-SI");
console.log("\n| | pravilno | rezultat v 1. stavku | krepko v 1. stavku | besed pred rezultatom | izhodni žetoni | znaki | besede | Preverba | Zapomni si | »kaj je preverjala« | stavkov v Vaji | prvo besedilo (s) | konec (s) |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const r of t) console.log(`| ${r.ime} | ${r.pravilno} | ${r.prvi} | ${r.krepko} | ${f(r.besedPred)} | ${f(r.izhod)} | ${f(r.znakov)} | ${f(r.besed)} | ${r.preverba} | ${r.zapomni} | ${r.preverjala} | ${r.vaja.toFixed(1).replace(".", ",")} | ${s(r.prvo)} | ${s(r.konec)} |`);
console.log(`\nStrošek ${porabljeno.toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}.`);
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), porabljeno, ustavljeno, povzetek: t, izid }, null, 1));
console.log(`Odgovori: ${OUT}`);
