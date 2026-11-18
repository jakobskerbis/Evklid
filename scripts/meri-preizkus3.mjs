// Meritev popravkov po Preizkusu 3 (j 2026-11-17, gumb): (1) vsi deli naloge a), b), c) v enem odgovoru v načinu B in pri
// »samo rezultat«, (2) krajši odgovori za OŠ 1.–4. razred, (3) graf, škatla z brki ali diagram, ki ga naloga zahteva,
// je narisan z blokom GRAF/SKICA. Iste naloge iz Preizkusa 3 pošlje inštruktorju s starim (main pred popravkom) in z
// novim sistemskim promptom (vse drugo enako) in s kodo preveri: vsi rezultati, nič prepuščeno učencu, dolžina in
// ogrodje pri najmlajših, blok z risbo, »samo rezultat« v nekaj vrsticah, Vodenje (način A, trije koraki z napačnim
// korakom in »Ne vem.«) brez izdane rešitve.
// Isti klic kot v aplikaciji (server/prompt.js, streamReply, SETTINGS_TOOLS): SŠ in fakulteta = »think«, OŠ = »chat«
// (server/usage.js chooseMode). Brez skrite opombe in preverjanja s kodo (live-check). Ne piše v bazo in ne šteje v
// porabo aplikacije; ustavi se, preden bi strošek presegel --max-usd (privzeto 2 $).
//   node scripts/meri-preizkus3.mjs [--max-usd 2] [--ponovi 1] [--samo-novi] [--naloge 19,45] [--out data/meri-preizkus3.json]
//   --suho: brez ključa (preizkusni odgovori), samo preveri, da skripta in stari prompt delujeta.
// Zagon v lupini Renderja (tam je ključ API). Brez ključa konča brez klica.
import fs from "node:fs";
import { buildSystemPrompt, loadTemplate } from "../server/prompt.js";
import { streamReply, isMockMode, modeParams, costUsd, apiErrorCode } from "../server/claude.js";
import { replyReserveUsd } from "../server/meje-ai.js";
import { normalizeSettings } from "../server/settings.js";
import { SETTINGS_TOOLS } from "../server/chat-settings.js";
import { stripMeta, stripChoices } from "../server/meta.js";
import { parseOpenBlocks } from "../server/odpri.js";
import { prepusceno, OGRODJE, seznamOk, rezultati, POTRDIL, vodenjeBrezVprasanja } from "./meri-preizkus3-ocena.mjs";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const MAX_USD = Number(arg("max-usd", 2));
const PONOVI = Math.min(Math.max(Number(arg("ponovi", 1)) || 1, 1), 5);
const OUT = arg("out", "data/meri-preizkus3.json");
const SAMO_NOVI = process.argv.includes("--samo-novi");
const SUHO = process.argv.includes("--suho"); // preizkusni način brez ključa: samo preveri, da skripta teče
// --suho nikoli ne kliče API, tudi kadar je ključ nastavljen (GitHub Actions): 0 $.
if (SUHO) process.env.EVKLID_MOCK = "1";
const IZBRANE = arg("naloge", "") ? new Set(arg("naloge", "").split(",").map((x) => x.trim())) : null;

// Stari prompt nastane iz trenutnega (brez git-a): vsaka sprememba popravka nazaj. Vsak kos mora biti v promptu natanko enkrat.
// Od meritve po #836 (18. 11., Actions 44313564198) je »stari« main po #836; primerjave s starejšimi prompti so v
// docs/spremembe-prompta.md (#811 17. 11., #836 18. 11.).
function stariPrompt(nov) {
  let s = nov;
  const zamenjaj = (od, v) => {
    if (s.split(od).length !== 2) throw new Error(`kos ni v promptu natanko enkrat: ${od.slice(0, 60)}`);
    s = s.replace(od, () => v);
  };
  zamenjaj(" Ko je v koraku napaka, ne začni s pohvalo ali potrditvijo (»Prav«, »Pravilno«, »Dobro«, »Odlično«, »Res je«); najprej pokaži napako, nato povej, kaj je prav.\n", "\n");
  zamenjaj("preprosto in s primerom (pri OŠ 1.–4. dva do trije kratki stavki),", "preprosto in s primerom,");
  zamenjaj("Za vsak del (tudi pri »zakaj«; vprašanje »zakaj« ni prošnja za več) en do dva kratka stavka", "Za vsak del en do dva kratka stavka");
  zamenjaj("Brez Podatkov, Iščemo, Preverbe, »Zapomni si« in razlage", "Brez Podatkov, Iščemo, Preverbe in razlage");
  return s;
}

// Naloge iz Preizkusa 3 (besedilo kot v preizkusu; ok = vzorci pravilnih rezultatov, po en seznam za vsak del).
const OS = (r, subject) => ({ educational_track: "OSNOVNA_SOLA", curriculum_level: `${r}. razred`, subject });
const SS = (l, subject) => ({ educational_track: "SREDNJA_SOLA", curriculum_level: `${l}. letnik`, subject });
const n = (re) => [re];
const NALOGE = [
  // 1. vsi deli (način B)
  { id: "19", vrsta: "deli", s: { educational_track: "UNIVERZA", curriculum_level: "1. letnik", subject: "MAT" }, q: "Sem študent 1. letnika, predmet Matematika.\na) Izračunaj limito lim_{x→0} (e^(2x) − 1)/x.\nb) Izračunaj določeni integral ∫₀¹ x · eˣ dx.\nc) Izračunaj determinanto in inverz matrike A = [[2, 1, 0], [1, 3, 1], [0, 1, 2]].", deli: [n(/=\s*2(?![\d,])/), n(/=\s*1(?![\d,])/), [/(?:det|\|A\|)[^\n]*=\s*8(?![\d,])/], [/frac\s*\{?1\}?\s*\{?8\}?|1\s*\/\s*8|frac\{5\}\{8\}|5\/8|0[,.]625/]] },
  { id: "83", vrsta: "deli", s: OS(8, "MAT"), q: "Sem v 8. razredu osnovne šole.\nRazstavi izraze:\na) 4x² − 25\nb) x² − 7x + 12\nc) 3a²b − 12ab²", deli: [n(/\(2x\s*[-−]\s*5\)\s*(?:\\cdot\s*)?\(2x\s*\+\s*5\)|\(2x\s*\+\s*5\)\s*(?:\\cdot\s*)?\(2x\s*[-−]\s*5\)/), n(/\(x\s*[-−]\s*3\)\s*(?:\\cdot\s*)?\(x\s*[-−]\s*4\)|\(x\s*[-−]\s*4\)\s*(?:\\cdot\s*)?\(x\s*[-−]\s*3\)/), n(/3ab\s*(?:\\cdot\s*)?\(a\s*[-−]\s*4b\)/)] },
  { id: "4", vrsta: "deli", s: OS(7, "MAT"), q: "Sem v 7. razredu osnovne šole.\nJakna stane 48 €. Najprej jo pocenijo za 15 %, čez en mesec pa novo ceno podražijo za 15 %.\na) Koliko stane jakna po pocenitvi?\nb) Koliko stane po podražitvi?\nc) Za koliko odstotkov je končna cena nižja od prvotne?", deli: [n(/40[,.]80?\s*€/), n(/46[,.]92\s*€/), n(/2[,.]25\s*%/)] },
  { id: "100", vrsta: "deli", s: { educational_track: "UNIVERZA", curriculum_level: "1. letnik", subject: "MAT" }, q: "Sem študent 1. letnika matematike, predmet Algebra 1.\nDana je matrika A = [[4, 1], [2, 3]].\na) Izračunaj lastne vrednosti matrike A.\nb) Za vsako lastno vrednost določi lasten vektor.\nc) Zapiši A = P D P⁻¹ z diagonalno matriko D in s tem izračunaj A⁵.", deli: [n(/(?<![\d,])5(?![\d,])/), n(/\(1\s*,\s*-?\s*[-−]?2\)|\(1;\s*[-−]2\)|-2|−2/), n(/2\s?094/)] },
  { id: "121", vrsta: "deli", s: OS(9, "KEM"), q: "Sem v 9. razredu osnovne šole.\na) Zapiši racionalni formuli propana in propena. Kateri je nasičen in kateri nenasičen ogljikovodik?\nb) Kateri od njiju razbarva bromovico? Zapiši enačbo te reakcije in povej, kako se imenuje ta vrsta reakcije.\nc) Zapiši in uredi enačbo popolnega gorenja propana.", deli: [n(/C_?\{?3\}?H_?\{?8\}?/), n(/adicij/i), n(/3\s*CO_?\{?2/)] },
  // 1b. seznam vaj (odločitev j 18. 11.): vsi deli z istim postopkom, le druga števila; v načinu B reši prvega (ali prve) in
  // ponudi, da naslednje poskusi sam, ne da vseh rezultatov.
  { id: "s1", vrsta: "seznam", s: OS(6, "MAT"), q: "Sem v 6. razredu osnovne šole.\nIzračunaj:\na) 3/4 + 1/8\nb) 2/3 + 1/6\nc) 5/6 + 1/4\nd) 1/2 + 3/10\ne) 2/5 + 3/10", deli: [n(/frac\{7\}\{8\}|(?<![\d,])7\s*\/\s*8/), n(/frac\{5\}\{6\}|(?<![\d,])5\s*\/\s*6/), n(/frac\{13\}\{12\}|13\s*\/\s*12|1\s*\\?frac\{1\}\{12\}/), n(/frac\{4\}\{5\}|(?<![\d,])4\s*\/\s*5|frac\{8\}\{10\}/), n(/frac\{7\}\{10\}|(?<![\d,])7\s*\/\s*10/)] },
  // 1. vsi deli pri »samo rezultat« in enodelni »samo rezultat« (regresija #799)
  { id: "45", vrsta: "rezultat", s: SS(4, "KEM"), q: "Sem v 4. letniku gimnazije.\nSamo končna rezultata, brez postopka:\na) Kolikšen je pH raztopine HCl s koncentracijo 0,0010 mol/L?\nb) Kolikšna je množinska koncentracija raztopine, ki v 250 mL vsebuje 4,0 g NaOH?", deli: [n(/(?<![\d,])3(?:[,.]0+)?(?![\d,])/), n(/0[,.]40?\s*(?:\\?\s*)?(?:\\mathrm\{)?mol/)] },
  { id: "17", vrsta: "rezultat", s: { ...SS(3, "MAT"), curriculum_level: "3. letnik OR" }, q: "Sem v 3. letniku gimnazije, maturo bom pisal na osnovni ravni.\nSamo končni rezultat, brez postopka: v aritmetičnem zaporedju je a₃ = 15 in a₇ = 31. Kolikšna je vsota prvih 20 členov?", deli: [n(/(?<![\d,])900(?![\d,])/)] },
  { id: "21", vrsta: "rezultat", s: OS(8, "FIZ"), q: "Sem v 8. razredu osnovne šole.\nSamo končni rezultat, brez postopka: kovinska kocka z robom 2,0 cm ima maso 21,6 g. Kolikšna je njena gostota?", deli: [n(/2[,.]7\d*\s*(?:\\?\s*)?(?:\\mathrm\{)?(?:g|kg)/)] },
  // 2. OŠ 1.–4. razred
  { id: "1", vrsta: "mladi", s: OS(3, "MAT"), q: "Sem v 3. razredu osnovne šole.\nMaja ima 3 vrečke frnikol. V vsaki vrečki je 8 frnikol. Prijateljici podari 7 frnikol.\na) Koliko frnikol ima Maja zdaj?\nb) Njena sestra ima dvakrat toliko frnikol, kot jih ima Maja zdaj. Koliko frnikol ima sestra?", deli: [n(/(?<![\d,])17(?![\d,])/), n(/(?<![\d,])34(?![\d,])/)] },
  { id: "55", vrsta: "mladi", s: OS(4, "NAR"), q: "Sem v 4. razredu osnovne šole.\na) Kaj se zgodi z vodo, ko jo damo v zamrzovalnik, in kaj, ko jo v loncu dolgo segrevamo? Kako se imenujeta ti spremembi?\nb) Pri kateri temperaturi se to zgodi?", deli: [[/zmrz|led/i], [/(?<![\d,])0\s*°/], [/100\s*°/]] },
  { id: "61", vrsta: "mladi", s: OS(1, "MAT"), q: "Sem v 1. razredu osnovne šole.\nNa veji sedi 6 ptičkov. 2 ptička odletita, nato priletijo še 4 ptički.\na) Koliko ptičkov je zdaj na veji?\nb) Ali je zdaj na veji več ali manj ptičkov kot na začetku? Za koliko?", deli: [n(/(?<![\d,])8(?![\d,])/), n(/več/i)] },
  { id: "62", vrsta: "mladi", s: OS(2, "MAT"), q: "Sem v 2. razredu osnovne šole.\nTine ima 45 centov. Kupi liziko, ki stane 28 centov.\na) Koliko centov mu ostane?\nb) Babica mu nato da še 3 kovance po 10 centov. Koliko centov ima zdaj?", deli: [n(/(?<![\d,])17(?![\d,])/), n(/(?<![\d,])47(?![\d,])/)] },
  { id: "63", vrsta: "mladi", s: OS(2, "NAR"), q: "Sem v 2. razredu osnovne šole.\na) Po dežju je na igrišču luža. Ko posije sonce, luža izgine. Kam je šla voda? Zakaj se luža na soncu posuši prej kot v senci?\nb) Naštej tri stvari, ki jih rastlina potrebuje, da raste.", deli: [n(/izhlap|v zrak/i), n(/svetlob|sonc/i)] },
  { id: "145", vrsta: "mladi", s: OS(3, "NAR"), q: "Sem v 3. razredu osnovne šole.\nV dva enaka lončka z zemljo posadimo fižol in ga enako zalivamo. En lonček postavimo na okensko polico, drugega v temno omaro.\na) Kaj opazimo čez dva tedna pri obeh rastlinah?\nb) Zakaj je tako?", deli: [n(/blede|rumen|bel/i), n(/svetlob/i)] },
  // 3. graf
  { id: "29", vrsta: "graf", s: SS(1, "FIZ"), q: "Sem v 1. letniku gimnazije.\nAvto 4,0 s enakomerno pospešuje iz mirovanja do hitrosti 12 m/s, nato 6,0 s vozi s stalno hitrostjo, nato pa v 3,0 s enakomerno zavre do ustavitve.\nNariši graf hitrosti v odvisnosti od časa v(t) in graf pospeška a(t). Iz grafa v(t) izračunaj celotno prevoženo pot.", deli: [n(/114\s*(?:\\?\s*)?(?:\\mathrm\{)?m(?![a-z/])/)] },
  { id: "89", vrsta: "graf", s: { ...SS(1, "MAT"), curriculum_level: "1. letnik OR" }, q: "Sem v 1. letniku gimnazije, maturo bom pisal na osnovni ravni.\nDvanajst dijakov je zapisalo, koliko ur na teden berejo knjige: 7, 12, 5, 10, 2, 8, 15, 5, 9, 4, 10, 6.\nDoloči najmanjšo vrednost, prvi kvartil, mediano, tretji kvartil in največjo vrednost ter nariši škatlo z brki (okvir z ročaji). Izračunaj še aritmetično sredino in povej, ali je večja ali manjša od mediane.", deli: [n(/7[,.]5(?!\d)/), n(/7[,.]75/)] },
  { id: "109", vrsta: "graf", s: SS(2, "FIZ"), q: "Sem v 2. letniku gimnazije.\nIdealni plin opravi krožno spremembo: iz stanja A (100 kPa; 1,0 L) ga pri stalni prostornini segrejemo do stanja B (300 kPa; 1,0 L), nato se pri stalnem tlaku razpne do stanja C (300 kPa; 3,0 L), nato ga pri stalni prostornini ohladimo do stanja D (100 kPa; 3,0 L) in ga pri stalnem tlaku stisnemo nazaj v stanje A.\nNariši diagram p(V) te krožne spremembe in iz njega izračunaj delo, ki ga plin opravi v enem obhodu. Kolikokrat je temperatura v stanju C večja od temperature v stanju A?", deli: [n(/400\s*(?:\\?\s*)?(?:\\mathrm\{)?J/), n(/(?<![\d,])9(?![\d,])\s*-?krat|=\s*9(?![\d,])/)] },
  // regresija: enodelne naloge v načinu B
  { id: "10", vrsta: "drugo", s: { ...SS(3, "MAT"), curriculum_level: "3. letnik VR" }, q: "Sem v 3. letniku gimnazije, maturo bom pisal na višji ravni.\nReši enačbo 4^x − 3 · 2^(x + 1) + 8 = 0.", deli: [n(/x_?\{?1\}?\s*=\s*1(?![\d,])|x\s*=\s*1(?![\d,])/), n(/x_?\{?2\}?\s*=\s*2(?![\d,])|x\s*=\s*2(?![\d,])/)] },
  { id: "13", vrsta: "drugo", s: { ...SS(2, "MAT"), curriculum_level: "2. letnik OR" }, q: "Sem v 2. letniku gimnazije, maturo bom pisal na osnovni ravni.\nTrikotnik ima stranice a = 3 cm, b = 4 cm in c = 8 cm. Izračunaj njegovo ploščino s Heronovo formulo.", deli: [n(/ne obstaja|ni mogoč|ne more|trikotnišk\w* neenakost/i)] },
  { id: "18", vrsta: "drugo", s: { ...SS(4, "MAT"), curriculum_level: "4. letnik OR" }, q: "Sem v 4. letniku gimnazije, maturo bom pisal na osnovni ravni.\nVržemo dve pošteni igralni kocki. Kolikšna je verjetnost, da je vsota pik 7?\nJaz sem rešil tako: možne vsote so 2, 3, 4, …, 12, to je 11 možnosti, ena od njih je 7, zato je verjetnost 1/11. Ali je prav?", deli: [n(/frac\{1\}\{6\}|1\s*\/\s*6|6\s*\/\s*36|frac\{6\}\{36\}/)] },
  { id: "23", vrsta: "drugo", s: SS(1, "FIZ"), q: "Sem v 1. letniku gimnazije.\nZ višine 20 m hkrati spustimo kroglo z maso 2 kg in kroglo z maso 4 kg. Zračni upor zanemarimo. Kateri krogli prej padeta na tla in koliko časa padata?\nMoja rešitev: krogla s 4 kg je dvakrat težja, zato pade dvakrat hitreje, in čas padanja je pri njej pol krajši kot pri krogli z 2 kg. Ali je prav?", deli: [n(/hkrati|istočasno|enako/i), n(/2[,.]0\d?\s*(?:\\?\s*)?(?:\\mathrm\{)?s(?![a-z])/)] },
  { id: "27", vrsta: "drugo", s: SS(1, "FIZ"), q: "Sem v 1. letniku gimnazije.\nAvto z maso 1200 kg v 5,0 s enakomerno pospeši iz mirovanja do hitrosti 20 m/s. Njegov pospešek je 3,0 m/s². S kolikšno rezultanto sil pospešuje avto?", deli: [n(/4[,.]0\s*(?:\\?\s*)?(?:\\mathrm\{)?m\/s|protislov|ne ujema|se ne skladа|neskladn/i)] },
  { id: "33", vrsta: "drugo", s: SS(2, "FIZ"), q: "Sem v 2. letniku gimnazije.\nV kozarcu, ki je do roba napolnjen z vodo, plava kocka ledu. Ali se voda prelije čez rob, ko se led stali? Razloži, zakaj.", deli: [n(/ne prelije|ne bo prelil|ostane enak|ne spremeni/i)] },
  { id: "47", vrsta: "drugo", s: OS(8, "BIO"), q: "Sem v 8. razredu osnovne šole.\na) Naštej tri zgradbe, ki jih ima rastlinska celica, živalska pa ne.\nb) V katerih celičnih organelih poteka fotosinteza in kaj pri njej nastane?", deli: [n(/celičn\w* sten/i), n(/kloroplast/i), n(/glukoz|sladkor/i)] },
];
// Vodenje (način A): prvi odgovor, nato namerno napačen korak, nato »Ne vem.«; rešitev ne sme biti izdana.
const VODENJE = [
  { id: "6", s: OS(9, "MAT"), q: "Sem v 9. razredu osnovne šole.\nNe povej mi rešitve, samo vodi me korak za korakom. Reši enačbo (x + 1)/2 − (x − 3)/3 = 2.", odg: "Pomnožim s 6 in dobim 3x + 3 − 2x − 6 = 12.", resitev: /x\s*=\s*3(?![\d,])/ },
  { id: "25", s: SS(1, "FIZ"), q: "Sem v 1. letniku gimnazije.\nNe povej mi rešitve, samo vodi me korak za korakom. Klada z maso 5,0 kg drsi po klancu z naklonom 30°. Koeficient trenja med klado in klancem je 0,20. S kolikšnim pospeškom drsi klada navzdol?", odg: "Sila trenja je 0,20 · 5,0 kg · 9,81 m/s² = 9,81 N.", resitev: /a\s*=\s*3[,.][12]\d*|3[,.]2\d?\s*(?:\\?\s*)?(?:\\mathrm\{)?m\/s/ },
  { id: "40", s: SS(2, "KEM"), q: "Sem v 2. letniku gimnazije.\nNe povej mi rešitve, samo vodi me korak za korakom. Izračunaj pH raztopine barijevega hidroksida Ba(OH)₂ s koncentracijo 0,0050 mol/L. Barijev hidroksid je močna baza.", odg: "Koncentracija OH⁻ je 0,0050 mol/L.", resitev: /pH\s*=\s*12(?:[,.]0+)?(?![\d,])/ },
  { id: "50", s: SS(3, "BIO"), q: "Sem v 3. letniku gimnazije.\nNe povej mi rešitve, samo vodi me korak za korakom. Pri grahu je rumena barva semen (A) dominantna nad zeleno (a), okrogla oblika (B) pa nad nagubano (b). Križamo dve rastlini z genotipom AaBb. Kolikšen delež potomcev ima rumena in nagubana semena?", odg: "Gameti staršev sta Aa in Bb.", resitev: /frac\{3\}\{16\}|3\s*\/\s*16|18[,.]75\s*%/ },
  { id: "93", s: { ...SS(3, "MAT"), curriculum_level: "3. letnik OR" }, q: "Sem v 3. letniku gimnazije, maturo bom pisal na osnovni ravni.\nNe povej mi rešitve, samo vodi me korak za korakom. Reši enačbo 2 sin²x − sin x − 1 = 0 na intervalu [0, 2π).", odg: "Uvedem t = sin x in dobim 2t² − t − 1 = 0. Rešitvi sta t = −1 in t = 1/2.", resitev: /frac\{5\\pi\}\{6\}|5\\?π\s*\/\s*6|frac\{3\\pi\}\{2\}/ },
  { id: "112", s: SS(3, "FIZ"), q: "Sem v 3. letniku gimnazije.\nNe povej mi rešitve, samo vodi me korak za korakom. Tuljava ima 200 ovojev s ploščino preseka 25 cm². Je v homogenem magnetnem polju, ki ima smer osi tuljave. Gostota polja se v 0,050 s enakomerno zmanjša od 0,40 T na nič. Kolikšna napetost se inducira v tuljavi?", odg: "Ploščina je 25 cm² = 0,25 m².", resitev: /U_?\{?i?\}?\s*=\s*4[,.]0|4[,.]0\s*(?:\\?\s*)?(?:\\mathrm\{)?V(?![a-z])/ },
];

if (!(MAX_USD > 0)) {
  console.error("--max-usd mora biti pozitivno število.");
  process.exit(1);
}
if (isMockMode() && !SUHO) {
  console.error("Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY; Render: zaženi v lupini Renderja). Brezplačen preizkus: --suho.");
  process.exit(1);
}

const nov = loadTemplate();
const PROMPTI = SAMO_NOVI ? { novi: nov } : { stari: stariPrompt(nov), novi: nov };

// Besedilo, ki ga vidi učenec: brez META, gumbov in strojnih blokov (RACUN, KARTICA, ODPRI, GRAF …).
const vidno = (t) => stripChoices(stripMeta(String(t))).replace(/<<[A-ZČŠŽ_]+[\s\S]*?>>/g, "").trim();
// Za iskanje rezultatov: LaTeX v navaden zapis (2{,}7\ \mathrm{g/cm^3} → 2,7 g/cm^3, 3\,CO_2 → 3 CO_2).
const navadno = (t) =>
  t
    .replace(/\{,\}/g, ",")
    .replace(/\\(?:mathrm|text|mathit|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\[,;:! ]|\\quad|~/g, " ")
    .replace(/−/g, "-");
const besede = (t) => (t.replace(/\$[^$]*\$/g, " x ").match(/[\p{L}\p{N}]+/gu) || []).length;

function oceni(n, raw) {
  const v = vidno(raw);
  const nv = navadno(v);
  // Seznam vaj: rezultat le za »=« ali krepko, da ponovljeno besedilo naloge ne šteje kot rešen del.
  const iskano = n.vrsta === "seznam" ? rezultati(nv) : nv;
  const deli = n.deli.map((alts) => alts.some((re) => re.test(iskano)));
  const bloki = parseOpenBlocks(raw).filter((b) => b.kind === "graph" || b.kind === "sketch");
  const vrstic = v.split("\n").filter((l) => l.trim()).length;
  const o = { vsiRezultati: deli.every(Boolean), deli, prepusceno: prepusceno(v), znakov: v.length, besed: besede(v), vrstic, ogrodje: OGRODJE.test(v), risba: bloki.length > 0, bloki: bloki.map((b) => b.kind) };
  // Uspeh po vrsti naloge.
  if (n.vrsta === "deli" || n.vrsta === "drugo") o.ok = o.vsiRezultati && !o.prepusceno;
  if (n.vrsta === "rezultat") o.ok = o.vsiRezultati && !o.prepusceno && !o.ogrodje && vrstic <= n.deli.length * 2 + 1;
  if (n.vrsta === "mladi") o.ok = o.vsiRezultati && !o.prepusceno && !o.ogrodje && o.znakov <= 550;
  if (n.vrsta === "graf") o.ok = o.vsiRezultati && o.risba;
  // Seznam vaj: prvi del pravilen, ponudba naslednjih, ne vsi rezultati (Domača naloga za oddajo, j 17. in 18. 11.).
  if (n.vrsta === "seznam") o.ok = seznamOk(o.deli, o.znakov);
  return o;
}

const s1 = (ms) => (ms / 1000).toFixed(1).replace(".", ",");
let porabljeno = 0;
let ustavljeno = false;
const izid = [];
// Vmesni zapis po vsakem izidu: ob prekinitvi (npr. časovna meja v Actions) ostanejo plačani odgovori.
const zapisiVmesno = () => {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), porabljeno, ustavljeno, koncano: false, izid }, null, 1));
};

async function klic(ime, settings, messages) {
  const mode = settings.educational_track === "OSNOVNA_SOLA" ? "chat" : "think";
  const { model } = modeParams(mode);
  const system = buildSystemPrompt({ settings, studentName: "Ana" }, PROMPTI[ime]);
  // Ista rezerva kot v aplikaciji (najslabši primer klica, server/meje-ai.js).
  const najvec = replyReserveUsd({ mode, system, messages, tools: SETTINGS_TOOLS });
  if (porabljeno + najvec > MAX_USD) {
    ustavljeno = true;
    return null;
  }
  const t0 = performance.now();
  try {
    const r = await streamReply({ system, mode, tools: SETTINGS_TOOLS, messages, onText: () => {} });
    const cena = costUsd(r.model || model, r.usage || {});
    porabljeno += cena;
    return { text: r.text || "", stopReason: r.stopReason || null, model: r.model || model, mode, cena, izhod: r.usage?.output_tokens || 0, konec: performance.now() - t0 };
  } catch (e) {
    // Brez podatka o porabi previdno šteje najslabši primer (klic je morda že plačan).
    porabljeno += e?.usage ? costUsd(e.model || model, e.usage) : najvec;
    console.log(`  napaka ${apiErrorCode(e) || e.message}`);
    return { napaka: true };
  }
}

outer: for (let k = 0; k < PONOVI; k++) {
  for (const n of NALOGE) {
    if (IZBRANE && !IZBRANE.has(n.id)) continue;
    const settings = normalizeSettings({ ...n.s, solving_mode: "B" });
    for (const ime of Object.keys(PROMPTI)) {
      const r = await klic(ime, settings, [{ role: "user", content: n.q }]);
      if (!r) break outer;
      if (r.napaka) continue;
      const o = oceni(n, r.text);
      izid.push({ naloga: n.id, vrsta: n.vrsta, prompt: ime, stopReason: r.stopReason, odrezano: r.stopReason === "max_tokens", model: r.model, cena: r.cena, izhod: r.izhod, konec: r.konec, ...o, vidno: vidno(r.text), surovo: r.text });
      zapisiVmesno();
      console.log(`${n.id} (${n.vrsta}) ${ime}: ${o.ok ? "OK" : "NE"} · deli ${o.deli.map((x) => (x ? "✓" : "✗")).join("")}${o.prepusceno ? " · PREPUŠČENO" : ""}${n.vrsta === "seznam" && !o.prepusceno ? " · brez ponudbe" : ""}${o.ogrodje ? " · ogrodje" : ""}${o.risba ? ` · risba ${o.bloki.join("+")}` : ""}${r.stopReason === "max_tokens" ? " · ODREZANO" : ""} · ${o.znakov} zn. · ${s1(r.konec)} s · ${r.cena.toFixed(4)} $`);
    }
  }
  for (const v of VODENJE) {
    if (IZBRANE && !IZBRANE.has(v.id)) continue;
    const settings = normalizeSettings({ ...v.s, solving_mode: "A" });
    for (const ime of Object.keys(PROMPTI)) {
      const msgs = [{ role: "user", content: v.q }];
      const odgovori = [];
      for (const nasl of [v.odg, "Ne vem.", null]) {
        const r = await klic(ime, settings, msgs);
        if (!r) break outer;
        if (r.napaka) break;
        odgovori.push(r);
        msgs.push({ role: "assistant", content: r.text }, ...(nasl ? [{ role: "user", content: nasl }] : []));
        if (!nasl) break;
      }
      if (odgovori.length < 3) continue;
      const vid = odgovori.map((r) => vidno(r.text));
      const izdal = vid.some((t) => v.resitev.test(navadno(t)));
      const potrdil = POTRDIL.test(vid[1]);
      const najvecBesed = Math.max(...vid.map(besede));
      // Razlog za NE se izpiše (meritev 44313564198: 40, 25, 112 brez razloga = prvi odgovor konča z »Zapiši …«, ne z »?«).
      const brez = vid.map(vodenjeBrezVprasanja).find(Boolean) || "";
      const ok = !izdal && !potrdil && !brez;
      const odrezano = odgovori.some((r) => r.stopReason === "max_tokens");
      izid.push({ naloga: v.id, vrsta: "vodenje", prompt: ime, ok, izdal, potrdil, brez, najvecBesed, odrezano, stopReasons: odgovori.map((r) => r.stopReason), cena: odgovori.reduce((a, r) => a + r.cena, 0), vidno: vid });
      zapisiVmesno();
      console.log(`${v.id} (vodenje) ${ime}: ${ok ? "OK" : "NE"}${izdal ? " · IZDAL REŠITEV" : ""}${potrdil ? " · POTRDIL NAPAČEN KORAK" : ""}${brez ? ` · ${brez}` : ""}${odrezano ? " · ODREZANO" : ""} · največ ${najvecBesed} besed`);
    }
  }
}

const vrste = ["deli", "seznam", "rezultat", "mladi", "graf", "drugo", "vodenje"];
console.log("\n| vrsta | prompt | uspešno | povp. znakov |");
console.log("|---|---|---|---|");
const povzetek = [];
for (const vr of vrste) {
  for (const ime of Object.keys(PROMPTI)) {
    const r = izid.filter((x) => x.vrsta === vr && x.prompt === ime);
    if (!r.length) continue;
    const zn = r.filter((x) => x.znakov).map((x) => x.znakov);
    const p = { vrsta: vr, prompt: ime, ok: r.filter((x) => x.ok).length, n: r.length, znakov: zn.length ? Math.round(zn.reduce((a, b) => a + b, 0) / zn.length) : null };
    povzetek.push(p);
    console.log(`| ${vr} | ${ime} | ${p.ok}/${p.n} | ${p.znakov ?? "–"} |`);
  }
}
console.log(`\nStrošek ${porabljeno.toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}.`);
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), porabljeno, ustavljeno, koncano: true, povzetek, izid }, null, 1));
console.log(`Odgovori: ${OUT}`);
