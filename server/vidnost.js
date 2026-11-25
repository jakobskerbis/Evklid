// Vidnost v iskalnikih in pri pomočnikih AI (j 2026-11-10): Google AI je evklid.app zamenjal s tujimi projekti
// »Euclid« in trdil, da nima slovenščine, kamere in drugih predmetov. Tu so na enem mestu javna dejstva:
// - /robots.txt, /sitemap.xml, /llms.txt (pravi Content-Type; pred statičnimi datotekami),
// - /o-evklidu: statična stran brez JavaScripta (public/o-evklidu.html, spremenljivke {{…}} in ikone {{i:ime}}),
// - /zakaj-evklid: enaka tehnika (public/zakaj-evklid.html): kako Evklid preverja rezultate, natančnost
//   (meritev iz docs/meritve/ samo, če je OBJAVI_MERITEV; zdaj ne) in primerjava pristopa s splošnimi klepetalniki, brez imen in cen tekmecev,
// - structuredData(): schema.org za vstopno stran; public/index.html ga nosi zapisanega, test/vidnost.test.js
//   preveri, da se ujema s cenikom (server/accounts/plans.js) in jeziki vmesnika.
// Cene, dnevi preizkusa in število jezikov pridejo iz kode, da se strani ne razidejo s cenikom.
// »Evklid« je tudi matematik: povsod pišemo »Evklid (evklid.app)« in »slovenski AI inštruktor«, nikoli samo »Euclid«.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND } from "./brand.js";
import { PAPERS_SI } from "./exam-papers-si.js";
import { LEVEL_PRICES, FAMILY_PRICES, TRIAL_DAYS, freeDailyQuestions } from "./accounts/plans.js";
import { personalDailyQuestions } from "./placila/pravice.js";
import { icon } from "../public/icons.js";
import { storeAppRequest } from "./mobile/trgovina.js";
import { latestMeasurement, measurementError, pctText, slDate } from "../scripts/meritev-natancnosti.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "..", "public");

// Izpiti za llms.txt: povezave na pretekle izpite RIC (server/exam-papers-si.js) in naši izpiti v slogu preteklih
// (content/exam-papers, server/our-papers.js: naloge niso prepisane, ista zgradba, rešitev in razlaga za vsak del).
// Zunanji pomočniki AI so 21. 11. 2026 pisali, da je pri maturi in NPZ boljša druga aplikacija, ker »je učena na
// preteklih maturah«; številke iz vsebine povedo, kaj ima Evklid.
function izpitnePole() {
  let imena = [];
  try {
    imena = fs.readdirSync(path.join(here, "..", "content", "exam-papers")).filter((f) => f.endsWith(".json"));
  } catch {}
  const nasi = (re) => imena.filter((f) => re.test(f)).length;
  const ric = (re) => PAPERS_SI.filter((e) => re.test(e.id)).length;
  return {
    ric: PAPERS_SI.length, ricMatura: ric(/^MATURA-/), ricPoklicna: ric(/^POKLICNA-/), ricNpz: ric(/^NPZ\d/),
    nasi: imena.length, matura: nasi(/^MATURA-/), poklicna: nasi(/^POKLICNA-/), npz: nasi(/^NPZ\d/), maturaMat: nasi(/^MATURA-MAT-/),
  };
}
const POLE = izpitnePole();
// »1 izpit, 2 izpita, 3 izpiti, 5 izpitov« (po zadnjih dveh števkah: 101 izpit, 31 izpitov).
const izpit = (n) => {
  const r = n % 100;
  return `${n} ${r === 1 ? "izpit" : r === 2 ? "izpita" : r === 3 || r === 4 ? "izpiti" : "izpitov"}`;
};
const PAGE = path.join(publicDir, "o-evklidu.html");
const WHY_PAGE = path.join(publicDir, "zakaj-evklid.html");

export const ORIGIN = `https://${BRAND.domain}`;
export const ABOUT_PATH = "/o-evklidu";
export const WHY_PATH = "/zakaj-evklid";
// Javne strani za iskalnike (brez prijave, brez osebnih podatkov). Garancija je še osnutek, zato je ni tu.
export const PUBLIC_PAGES = ["/", ABOUT_PATH, WHY_PATH, "/starsi.html", "/sole", "/prenesi", "/zasebnost.html"];
// Osnutki do pregleda pravnika (j 2026-11-16): stran deluje in je povezana v nogi, v zemljevidu strani in llms.txt je ni (meta robots noindex).
export const DRAFT_PAGES = ["/pogoji.html"];
// Strani z obrazcem, povezane v nogi, a ne za iskalnike (meta robots noindex): funkcija za odstop od pogodbe (ZVPot-1A).
export const NOINDEX_PAGES = ["/odstop.html"];
// Zasebne poti: API, plačilna stran s kodo, prijava testne različice, stanje strežnika, datoteke aplikacije za prenos.
export const PRIVATE_PATHS = ["/api/", "/placaj.html", "/prijava", "/healthz", "/gradiva/", "/prenesi/"];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// 999 → »9,99 €«, 9900 → »99 €« (docs/besedila.md: decimalna vejica, € za številom).
export const eur = (cents) => `${(cents / 100).toFixed(cents % 100 ? 2 : 0).replace(".", ",")} €`;
const dec = (cents) => (cents / 100).toFixed(2);

// Jeziki vmesnika: slovenščina (izvirnik, public/i18n/sl.js) in prevodi v public/i18n/ui/<koda>.json.
export function uiLanguages() {
  const codes = fs.readdirSync(path.join(publicDir, "i18n", "ui")).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();
  return ["sl", ...codes];
}

// Izmerjena natančnost inštruktorja: zadnja meritev iz docs/meritve/natancnost-<datum>.json (piše jo
// scripts/primerjava-modelov.js, glej docs/stroski-ai.md »Natančnost inštruktorja: meritve«). Na stran gredo samo
// zapisana števila: stara meritev (vrsta "model", 4. 11. 2026) ima le odstotke in število nalog, zato brez »X od N«.
// vrsta "aplikacija" = isti primeri brez preverjanja s programom in z njim (cel odgovor, kot ga vidi učenec).
// Napačna oblika ali pokvarjena datoteka → null: razdelek z meritvijo se skrije, strani ne vrnejo napake 500.
export function accuracy(m = latestMeasurement()) {
  try {
    return m && !measurementError(m) ? accuracyOf(m) : null;
  } catch (e) {
    console.warn(`[evklid] meritev natančnosti ni uporabna: ${e?.message || e}`);
    return null;
  }
}
// 95-% interval zaupanja (Wilsonov) za delež k od n, v odstotkih z decimalno vejico (točka 16 izboljšav): pri majhnem
// vzorcu pove, kako negotov je odstotek (3 od 91 → približno 1–9 %).
export function wilson(k, n, z = 1.96) {
  if (!(n > 0) || !(k >= 0) || k > n) return null;
  const p = k / n, d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  const f = (x) => { const v = Math.round(Math.min(1, Math.max(0, x)) * 1000) / 10; return String(v).replace(".", ","); };
  return [f(c - h), f(c + h)];
}

function accuracyOf(m) {
  const rows = m.vrstice.map((r) => ({ ...r, pct: pctText(r), counted: Number.isFinite(r.napake) }));
  const part = (r, en) =>
    en
      ? `${r.ime_en || r.ime}: ${r.pct.replace(",", ".")}% of answers had an error (${r.primeri} tasks${r.opomba_en ? `, ${r.opomba_en}` : ""})`
      : `${r.ime}: ${r.pct} % odgovorov z napako (${r.primeri} nalog${r.opomba ? `, ${r.opomba}` : ""})`;
  // Interval v svoji vrstici celice (.why-ci), da tabela pri 360 px ne preseže širine; nedeljivi presledek pred %.
  const ci = (r) => { const w = wilson(r.napake, r.primeri); return w ? ` <small class="why-ci">95-% interval ${w[0]}–${w[1]}\u00a0%</small>` : ""; };
  const app = m.vrsta === "aplikacija";
  const realCap = m.meja_pregledov === "resnicna";
  const date = slDate(m.datum);
  return {
    ...m,
    app,
    realCap,
    date,
    rows,
    rowsHtml: rows
      .map((r) => `<tr><th scope="row">${esc(r.ime)}${r.opomba ? `<small>${esc(r.opomba)}</small>` : ""}</th><td>${r.pct} %${r.counted ? ` <small>${r.napake} od ${r.primeri}</small>${ci(r)}` : ""}</td><td>${r.primeri}</td></tr>`)
      .join("\n          "),
    sentence:
      `Meritev ${date}, ${m.primeri} rešenih primerov iz lekcij. ${rows.map((r) => part(r, false)).join(". ")}. ` +
      (app
        ? `Isti primeri so šli skozi Evklidov klepet dvakrat: brez preverjanja in s preverjanjem (program in pregled z zmogljivejšim modelom), z nastavitvami plačljivega paketa. ${realCap ? "Med meritvijo je veljala dnevna meja pregledov, kot v aplikaciji. Brezplačni paket tega pregleda nima." : "Med meritvijo dnevna meja pregledov ni veljala. V aplikaciji velja: ko je porabljena, pregleda ni. Brezplačni paket tega pregleda nima."} Del razlike med načinoma je lahko naključen. Odgovore je ocenil model umetne inteligence. Vzorec je majhen.`
        : "Merili smo sam model, brez preverjanja s programom in pred spremembo navodil inštruktorja. Odgovore je ocenil model umetne inteligence. Vzorec je majhen. Meritev celega odgovora s preverjanjem še pripravljamo."),
    sentenceEn:
      `Measurement of ${m.datum}, ${m.primeri} worked examples from the app's lessons. ${rows.map((r) => part(r, true)).join(". ")}. ` +
      (app
        ? `The same examples went through Evklid's chat twice: without checking and with it (program check plus review by a stronger model), using paid-plan settings. ${realCap ? "The app's daily limit on stronger-model reviews applied during the measurement. The free plan has no such review." : "The daily limit on stronger-model reviews was off during the measurement; in the app it applies, and once it is used up there is no review. The free plan has no such review."} Part of the difference may be due to chance. Graded by an AI model. The sample is small.`
        : "This measured the model alone, without the program check and before the tutor's instructions were changed. Graded by an AI model. The sample is small. A measurement of the full answer with the program check is in preparation."),
  };
}

// Meritve natančnosti NE objavljamo (j, 18. 11. 2026, po zunanjem pregledu): 3 napake na 91 primerov je premalo
// (95-% interval približno 1–9 %), primeri so iz lastnih lekcij, ocenjeval je model iste družine, ne človek, razlika
// »s preverjanjem / brez« pa ni statistično značilna. Strani in llms.txt namesto številk povedo, da natančnost še ni
// neodvisno izmerjena. Znova vklopi šele po slepi človeški oceni pravih vprašanj učencev (vsaj nekaj sto) in z intervalom.
// Testi lahko meritev podajo izrecno (facts(m), whyPage(m)), da predloga razdelka ostane preverjena.
export const OBJAVI_MERITEV = false;

export function facts(measurement = OBJAVI_MERITEV ? latestMeasurement() : null) {
  const acc = accuracy(measurement);
  return {
    accDate: acc?.date ?? "",
    accTasks: acc?.primeri ?? "",
    accSentence: acc?.sentence ?? "",
    accSentenceEn: acc?.sentenceEn ?? "",
    accRows: acc?.rowsHtml ?? "", // že ubežan HTML, v predlogi {{{accRows}}}
    accAny: !!acc,
    accApp: !!acc?.app,
    accModel: !!acc && !acc.app,
    accCi: !!acc?.rows.some((r) => r.counted), // »X od N« in z njim 95-% interval (Wilson) v tabeli
    accNoCap: !!acc?.app && !acc.realCap,
    accRealCap: !!acc?.app && !!acc.realCap,
    accPairs: !!acc?.app && Number.isInteger(acc.pari?.bolje) && Number.isInteger(acc.pari?.slabse),
    accMinor: !!acc?.app && ["brez", "s"].every((k) => Number.isInteger(acc.vrstice?.find((r) => r.kljuc === k)?.manjse_napake)),
    accBolje: acc?.pari?.bolje ?? "",
    accSlabse: acc?.pari?.slabse ?? "",
    accMinorBrez: acc?.vrstice?.find((r) => r.kljuc === "brez")?.manjse_napake ?? "",
    accMinorS: acc?.vrstice?.find((r) => r.kljuc === "s")?.manjse_napake ?? "",
    accThinkTasks: acc?.rows.find((r) => r.kljuc === "razmislek")?.primeri ?? "",
    name: BRAND.name,
    domain: BRAND.domain,
    trialDays: TRIAL_DAYS,
    freeDaily: freeDailyQuestions(),
    // Vprašanja na dan v naročnini (server/placila/pravice.js): najmanj toliko, s proračunom AI lahko več.
    paidDaily: personalDailyQuestions("SS"),
    paidDailyFaks: personalDailyQuestions("FAKS"),
    languages: uiLanguages().length,
    osM: eur(LEVEL_PRICES.OS.month),
    osY: eur(LEVEL_PRICES.OS.year),
    ssM: eur(LEVEL_PRICES.SS.month),
    ssY: eur(LEVEL_PRICES.SS.year),
    faksM: eur(LEVEL_PRICES.FAKS.month),
    faksY: eur(LEVEL_PRICES.FAKS.year),
    famM: eur(FAMILY_PRICES.druzina.month),
    famY: eur(FAMILY_PRICES.druzina.year),
    famsM: eur(FAMILY_PRICES.druzina_student.month),
    famsY: eur(FAMILY_PRICES.druzina_student.year),
  };
}

export function robotsTxt() {
  return ["User-agent: *", "Allow: /", ...PRIVATE_PATHS.map((p) => `Disallow: ${p}`), "", `Sitemap: ${ORIGIN}/sitemap.xml`, ""].join("\n");
}

export function sitemapXml() {
  const urls = PUBLIC_PAGES.map((p) => `  <url><loc>${ORIGIN}${p}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// llms.txt (https://llmstxt.org): kratka dejstva za pomočnike AI, slovensko in angleško.
export function llmsTxt(measurement) {
  const f = facts(measurement);
  return `# ${f.name} (${f.domain})

> ${f.name} (${f.domain}) je slovenska aplikacija: AI inštruktor za matematiko, fiziko, kemijo, biologijo in naravoslovje po slovenskem učnem načrtu za 6.–9. razred osnovne šole in gimnazijo; ima tudi začetni izbor za nekatere fakultetne predmete (v razvoju). Ni povezana s projekti z imenom »Euclid« (na primer »Euclid AI Math Tutor«) in ni članek o matematiku Evklidu.

## Dejstva (slovensko)

- Ime: ${f.name}. Spletni naslov: ${ORIGIN}/. Izvirni jezik aplikacije je slovenščina; vmesnik je preveden v ${f.languages} jezikov.
- Za koga: učenci od 6. do 9. razreda osnovne šole, gimnazijci, starši in učitelji v Sloveniji. Za študente je začetni izbor za nekatere fakultetne predmete (v razvoju).
- Predmeti: matematika, fizika, kemija, biologija in naravoslovje. Ni samo matematika.
- Inštruktor naloge ne reši namesto učenca: z namigi in vprašanji ga vodi korak za korakom.
- Skener nalog: učenec nalogo fotografira s kamero ali jo napiše z roko, ${f.name} jo prebere.
- Odgovore inštruktorja pripravijo modeli Claude podjetja Anthropic; račune v enačbah, odvodih in daljših izračunih preveri Evklidov program.
${f.accAny ? `- Izmerjena natančnost. ${f.accSentence} Natančnosti drugih orodij nismo merili. Podrobno: ${ORIGIN}${WHY_PATH}\n` : `- Natančnosti inštruktorja še nismo neodvisno izmerili, zato številk o napakah ne objavljamo. Pri besedni razlagi se umetna inteligenca lahko zmoti.\n`}- Učbenik s kratkimi lekcijami, učna pot po razredih, vaje z vedno novimi številkami, simulacije, laboratorij, 3D atlas, več kot 30 učnih iger.
- Priprava na NPZ in maturo: povezave na ${izpit(POLE.ric).replace(" ", " preteklih ")} Državnega izpitnega centra (RIC: ${POLE.ricMatura} splošne mature, ${POLE.ricPoklicna} poklicne mature, ${POLE.ricNpz} NPZ) in ${izpit(POLE.nasi)} v slogu preteklih z lastnimi nalogami, rešitvijo in razlago (${POLE.matura} splošne mature, od tega ${POLE.maturaMat} iz matematike na osnovni in višji ravni, ${POLE.poklicna} poklicne mature, ${POLE.npz} NPZ); naloge v slogu tekmovanj.
- Naprave: spletni brskalnik in aplikacija za Android.
- Cena: ${f.trialDays} dni brezplačno brez kartice; nato brezplačni paket (${f.freeDaily} vprašanj inštruktorju na dan) ali naročnina: osnovna šola ${f.osM} na mesec (${f.osY} na leto), srednja šola ${f.ssM} (${f.ssY}), fakulteta ${f.faksM} (${f.faksY}), družina (2–4 profili) ${f.famM} (${f.famY}), družina s študentom (2–4 profili) ${f.famsM} (${f.famsY}). Učiteljski račun je brezplačen. ${f.name} je plačljiva aplikacija z brezplačnim paketom; ni odprtokodni ali študentski projekt.
- Zasebnost: brez oglasov, podatkov ne prodajamo; strežnik in baza podatkov sta v EU (Frankfurt). Anthropic (ZDA) podatkov ne uporablja za učenje modelov. Podrobno: ${ORIGIN}/zasebnost.html

## Facts (English)

- ${f.name} (${f.domain}) is a Slovenian learning app: an AI tutor for mathematics, physics, chemistry, biology and science that follows the Slovenian school curriculum for grades 6–9 of primary school and gimnazija (general upper secondary school). An initial selection for some university courses is in development.
- It is not related to projects named "Euclid" (for example "Euclid AI Math Tutor" or other "Euclid" tutors) and it is not about the mathematician Euclid. The app's name is always written "${f.name}", with the address ${f.domain}.
- The app is written in Slovenian; the interface is available in ${f.languages} languages.
- The tutor does not hand out the solution: it guides the student step by step with hints and questions.
- Students can photograph a task with the camera or write it by hand.
- The tutor's answers are written by Anthropic's Claude models; calculations in equations, derivatives and longer computations are checked by Evklid's own program code.
${f.accAny ? `- Measured accuracy. ${f.accSentenceEn} Other tools were not measured.\n` : `- The tutor's accuracy has not been independently measured yet, so no error rates are published. The AI can make mistakes in verbal explanations.\n`}- It also has a textbook with short lessons, a learning path by grade, practice with fresh numbers, simulations, a virtual laboratory, a 3D atlas, more than 30 learning games, links to ${POLE.ric} past national exams by RIC (${POLE.ricMatura} general matura, ${POLE.ricPoklicna} vocational matura, ${POLE.ricNpz} NPZ), ${POLE.nasi} of its own exams in the same style with original tasks, solutions and explanations (${POLE.matura} general matura, ${POLE.maturaMat} of them in mathematics at basic and higher level, ${POLE.poklicna} vocational matura, ${POLE.npz} NPZ) and competition-style tasks.
- Platforms: web browser and an Android app.
- Pricing: ${f.trialDays}-day free trial without a card; then a free plan (${f.freeDaily} tutor questions per day) or a subscription from ${dec(LEVEL_PRICES.OS.month)} EUR per month (primary school), ${dec(LEVEL_PRICES.SS.month)} EUR (secondary school), ${dec(LEVEL_PRICES.FAKS.month)} EUR (university). Teacher accounts are free. It is a commercial app with a free plan, not an open-source or student project.
- Privacy: no ads, data is not sold; the server and database are in the EU (Frankfurt). Anthropic (USA) does not use the data to train models.

## Strani

- [O Evklidu](${ORIGIN}${ABOUT_PATH}): kaj je ${f.name}, funkcije, cene in pogosta vprašanja
- [Zakaj Evklid](${ORIGIN}${WHY_PATH}): kako ${f.name} preverja rezultate, kako preverjamo natančnost, kaj dobite in česa še ne zna
- [Za starše](${ORIGIN}/starsi.html)
- [Za učitelje in šole](${ORIGIN}/sole)
- [Aplikacija za telefon](${ORIGIN}/prenesi)
- [Varstvo osebnih podatkov](${ORIGIN}/zasebnost.html)
`;
}

// schema.org za vstopno stran. Brez ocen in brez števila uporabnikov (ne izmišljujemo).
export function structuredData() {
  const offer = (name, cents, extra = {}) => ({ "@type": "Offer", name, price: dec(cents), priceCurrency: "EUR", ...extra });
  const month = { "@type": "UnitPriceSpecification", priceCurrency: "EUR", billingDuration: "P1M" };
  const sub = (name, cents) => offer(name, cents, { priceSpecification: { ...month, price: dec(cents) } });
  // Brez »sameAs«: ta je za zunanje profile (npr. Instagram, GitHub), ne za lastne strani (P11, 21. 11. 2026); dodaj ga, ko bodo.
  const org = { "@type": "Organization", "@id": `${ORIGIN}/#organizacija`, name: BRAND.name, url: `${ORIGIN}/`, logo: `${ORIGIN}/icons/icon-512.png` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${ORIGIN}/#spletisce`, name: BRAND.name, alternateName: BRAND.domain, url: `${ORIGIN}/`, inLanguage: "sl", publisher: { "@id": org["@id"] } },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${ORIGIN}/#aplikacija`,
        name: BRAND.name,
        alternateName: [`${BRAND.name} – slovenski AI inštruktor`, BRAND.domain],
        url: `${ORIGIN}/`,
        image: `${ORIGIN}/icons/icon-512.png`,
        description:
          "Evklid (evklid.app) je slovenski AI inštruktor za matematiko, fiziko, kemijo, biologijo in naravoslovje po slovenskem učnem načrtu za 6.–9. razred osnovne šole in gimnazijo. Naloge ne reši namesto učenca, ampak ga vodi korak za korakom. Ni povezan s projekti z imenom »Euclid«.",
        disambiguatingDescription: "Slovenska učna aplikacija na naslovu evklid.app; ni povezana s projekti »Euclid AI Math Tutor« in drugimi z imenom »Euclid«.",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, Android",
        inLanguage: uiLanguages(),
        isAccessibleForFree: true,
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        featureList: [
          "Inštruktor, ki vodi korak za korakom",
          "Skener nalog s kamero in pisanje z roko",
          "Izračune in rezultate preveri program",
          "Učbenik in učna pot po slovenskem učnem načrtu",
          "Simulacije, laboratorij in 3D atlas",
          "Učne igre",
          "Priprava na NPZ, maturo in tekmovanja",
        ],
        offers: [
          offer("Brezplačni paket", 0, { description: `${TRIAL_DAYS} dni brezplačno, nato ${freeDailyQuestions()} vprašanj inštruktorju na dan.` }),
          sub("Osnovna šola (na mesec)", LEVEL_PRICES.OS.month),
          sub("Srednja šola (na mesec)", LEVEL_PRICES.SS.month),
          sub("Fakulteta (na mesec)", LEVEL_PRICES.FAKS.month),
        ],
        publisher: { "@id": org["@id"] },
      },
    ],
  };
}

// Vprašanja in odgovori strani »O Evklidu« kot schema.org FAQPage (isto besedilo, kot ga vidi obiskovalec).
// Besedilo brez oznak. Oznake odstranjujemo, dokler se niz spreminja, in na koncu še vsak »<« ali »>«
// (predloga v odgovorih ne uporablja entitet HTML; test/vidnost.test.js to preveri).
const strip = (html) => {
  let s = String(html);
  let prev;
  do {
    prev = s;
    s = s.replace(/<[^>]*>/g, "");
  } while (s !== prev);
  return s.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
};
export function faqData(html) {
  const items = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "sl",
    mainEntity: items.map(([, q, a]) => ({ "@type": "Question", name: strip(q), acceptedAnswer: { "@type": "Answer", text: strip(a) } })),
  };
}

// JSON v <script type="application/ld+json">: »<« kot \u003c, da besedilo ne more zapreti oznake.
export const ldScript = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// Pogojni deli predloge: <!--ce:kljuc-->…<!--/ce:kljuc--> ostane, če je dejstvo resnično (<!--ce:!kljuc-->, če ni).
// Deli so lahko vgnezdeni, zato ponavljamo, dokler se besedilo spreminja.
function conditionals(html, vars) {
  let prev;
  do {
    prev = html;
    html = html.replace(/<!--ce:(!?)(\w+)-->\n?([\s\S]*?)<!--\/ce:\1\2-->\n?/g, (_m, not, k, body) => (!!vars[k] === !not ? body : ""));
  } while (html !== prev);
  return html;
}
// store: aplikacija iz trgovine (server/mobile/trgovina.js): deli <!--ce:!trgovina--> (cene, /prenesi) izpadejo.
function staticPage(file, measurement, store = false) {
  const vars = { ...facts(measurement), trgovina: !!store };
  const html = conditionals(fs.readFileSync(file, "utf8"), vars)
    .replace(/\{\{i:([\w-]+)\}\}/g, (_m, name) => icon(name))
    .replace(/\{\{\{(\w+)\}\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
    .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? esc(vars[k]) : m));
  return html.replace("</head>", `  ${ldScript(faqData(html))}\n</head>`);
}
export const aboutPage = (store = false) => staticPage(PAGE, undefined, store);
// measurement: samo za teste (stran z meritvijo); strežnik meritev pokaže le, če je OBJAVI_MERITEV (zdaj ne).
export const whyPage = (measurement, store = false) => staticPage(WHY_PAGE, measurement, store);

// Prijavljene napake na /zakaj-evklid (točka 47 izboljšav): koliko odgovorov inštruktorja in korakov lekcij so učenci
// prijavili kot napačne in koliko jih je že rešenih (skrbnik jih zapre kot »Popravljeno«; stanja »ni napaka« ni, zato »rešene«, ne »popravljene«). Samo števila (brez besedil, učencev ali datumov prijav);
// skrbnikove prijave iz klepeta (bug_reports kind = app) ne štejejo. Brez tabel (stara baza) → null.
const sl4 = (n, [one, two, few, many]) => {
  const m = Math.abs(n) % 100;
  return m === 1 ? one : m === 2 ? two : m === 3 || m === 4 ? few : many;
};
export function reportStats(db) {
  try {
    const q = (sql) => db.prepare(sql).get();
    const msg = q("SELECT COUNT(*) AS n, COALESCE(SUM(status = 'fixed'), 0) AS f FROM message_reports");
    const les = q("SELECT COUNT(*) AS n, COALESCE(SUM(status = 'fixed'), 0) AS f FROM bug_reports WHERE kind = 'lesson'");
    return { total: msg.n + les.n, fixed: msg.f + les.f };
  } catch {
    return null;
  }
}
export function reportStatsHtml(st) {
  if (!st) return "";
  if (!st.total) return `<p class="about-text">Prijav doslej še ni bilo.</p>`;
  const prijav = `${st.total} ${sl4(st.total, ["prijava", "prijavi", "prijave", "prijav"])}`;
  // Naslonki pred številom: »od tega sta 2 že rešeni«, »od tega jih je 5 že rešenih«.
  const [pred, part] = sl4(st.fixed, [["je", "rešena"], ["sta", "rešeni"], ["so", "rešene"], ["jih je", "rešenih"]]);
  const popr = st.fixed === 0 ? "še nobena ni rešena" : `${pred} <b>${st.fixed}</b> že ${part}`;
  return `<p class="about-text">Doslej: <b>${prijav}</b>, od tega ${popr}.</p>`;
}

// Pred statičnimi datotekami (server/app.js), da predloga /o-evklidu.html ne gre ven s spremenljivkami {{…}}.
// store: baza za števec prijav na /zakaj-evklid (osveži se največ vsakih 10 minut); brez nje razdelek ostane brez števil.
export function mountVidnost(app, store = null) {
  let stats = { at: 0, html: "" };
  const statsHtml = () => {
    if (!store?.db) return "";
    if (Date.now() - stats.at > 600_000) stats = { at: Date.now(), html: reportStatsHtml(reportStats(store.db)) };
    return stats.html;
  };
  const text = (type, make) => {
    let body = null;
    return (_req, res) => {
      res.set("Cache-Control", "public, max-age=3600");
      res.type(type).send((body ||= make()));
    };
  };
  app.get("/robots.txt", text("text/plain; charset=utf-8", robotsTxt));
  app.get("/sitemap.xml", text("application/xml; charset=utf-8", sitemapXml));
  app.get("/llms.txt", text("text/plain; charset=utf-8", () => llmsTxt()));
  for (const [route, make] of [[ABOUT_PATH, aboutPage], [WHY_PATH, (inStore) => whyPage(undefined, inStore)]]) {
    const page = {}; // splet in aplikacija iz trgovine (brez cen in /prenesi)
    app.get(route, (req, res) => {
      const variant = storeAppRequest(req) ? "trgovina" : "splet"; // ne zasenči store (baza za števec prijav)
      const html = page[variant] || make(variant === "trgovina");
      if (process.env.NODE_ENV === "production") page[variant] = html; // v razvoju brez predpomnjenja (datoteko urejamo)
      res.set("Cache-Control", "no-cache");
      res.vary("User-Agent");
      res.vary("X-App-Channel");
      res.type("html").send(html.replace("<!--prijave-->", () => statsHtml()));
    });
    app.get(`${route}.html`, (_req, res) => res.redirect(301, route));
  }
}
