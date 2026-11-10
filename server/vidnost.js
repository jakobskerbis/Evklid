// Vidnost v iskalnikih in pri pomočnikih AI (j 2026-11-10): Google AI je evklid.app zamenjal s tujimi projekti
// »Euclid« in trdil, da nima slovenščine, kamere in drugih predmetov. Tu so na enem mestu javna dejstva:
// - /robots.txt, /sitemap.xml, /llms.txt (pravi Content-Type; pred statičnimi datotekami),
// - /o-evklidu: statična stran brez JavaScripta (public/o-evklidu.html, spremenljivke {{…}} in ikone {{i:ime}}),
// - /zakaj-evklid: enaka tehnika (public/zakaj-evklid.html): kako Evklid preverja rezultate, izmerjena natančnost
//   (zadnja meritev iz docs/meritve/, accuracy()) in primerjava pristopa s splošnimi klepetalniki, brez imen in cen tekmecev,
// - structuredData(): schema.org za vstopno stran; public/index.html ga nosi zapisanega, test/vidnost.test.js
//   preveri, da se ujema s cenikom (server/accounts/plans.js) in jeziki vmesnika.
// Cene, dnevi preizkusa in število jezikov pridejo iz kode, da se strani ne razidejo s cenikom.
// »Evklid« je tudi matematik: povsod pišemo »Evklid (evklid.app)« in »slovenski AI inštruktor«, nikoli samo »Euclid«.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND } from "./brand.js";
import { LEVEL_PRICES, FAMILY_PRICES, TRIAL_DAYS, freeDailyQuestions } from "./accounts/plans.js";
import { icon } from "../public/icons.js";
import { latestMeasurement, pctText, slDate } from "../scripts/meritev-natancnosti.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "..", "public");
const PAGE = path.join(publicDir, "o-evklidu.html");
const WHY_PAGE = path.join(publicDir, "zakaj-evklid.html");

export const ORIGIN = `https://${BRAND.domain}`;
export const ABOUT_PATH = "/o-evklidu";
export const WHY_PATH = "/zakaj-evklid";
// Javne strani za iskalnike (brez prijave, brez osebnih podatkov). Garancija je še osnutek, zato je ni tu.
export const PUBLIC_PAGES = ["/", ABOUT_PATH, WHY_PATH, "/starsi.html", "/sole", "/prenesi", "/zasebnost.html"];
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
export function accuracy(m = latestMeasurement()) {
  if (!m) return null;
  const rows = m.vrstice.map((r) => ({ ...r, pct: pctText(r), counted: Number.isFinite(r.napake) }));
  const part = (r, en) =>
    en
      ? `${r.ime_en || r.ime}: ${r.pct.replace(",", ".")}% of answers had an error (${r.primeri} tasks${r.opomba_en ? `, ${r.opomba_en}` : ""})`
      : `${r.ime}: ${r.pct} % odgovorov z napako (${r.primeri} nalog${r.opomba ? `, ${r.opomba}` : ""})`;
  const app = m.vrsta === "aplikacija";
  const date = slDate(m.datum);
  return {
    ...m,
    app,
    date,
    rows,
    rowsHtml: rows
      .map((r) => `<tr><th scope="row">${esc(r.ime)}${r.opomba ? `<small>${esc(r.opomba)}</small>` : ""}</th><td>${r.pct} %${r.counted ? ` <small>${r.napake} od ${r.primeri}</small>` : ""}</td><td>${r.primeri}</td></tr>`)
      .join("\n          "),
    sentence:
      `Meritev ${date}, ${m.primeri} rešenih primerov iz lekcij. ${rows.map((r) => part(r, false)).join(". ")}. ` +
      (app
        ? "Isti primeri so šli skozi Evklidov klepet dvakrat: brez preverjanja s programom in z njim. Odgovore je ocenil model umetne inteligence. Vzorec je majhen."
        : "Merili smo sam model, brez preverjanja s programom in pred izboljšavo navodil inštruktorja. Odgovore je ocenil model umetne inteligence. Vzorec je majhen. Meritev celega odgovora s preverjanjem še pripravljamo."),
    sentenceEn:
      `Measurement of ${m.datum}, ${m.primeri} worked examples from the app's lessons. ${rows.map((r) => part(r, true)).join(". ")}. ` +
      (app
        ? "The same examples went through Evklid's chat twice: without the program check and with it. Graded by an AI model. The sample is small."
        : "This measured the model alone, without the program check and before the tutor's instructions were improved. Graded by an AI model. The sample is small. A measurement of the full answer with the program check is in preparation."),
  };
}

export function facts(measurement) {
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
    accThinkTasks: acc?.rows.find((r) => r.kljuc === "razmislek")?.primeri ?? "",
    name: BRAND.name,
    domain: BRAND.domain,
    trialDays: TRIAL_DAYS,
    freeDaily: freeDailyQuestions(),
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
export function llmsTxt() {
  const f = facts();
  return `# ${f.name} (${f.domain})

> ${f.name} (${f.domain}) je slovenska aplikacija: AI inštruktor za matematiko, fiziko, kemijo, biologijo in naravoslovje po slovenskem učnem načrtu, od 1. razreda osnovne šole do fakultete. Ni povezana s projekti z imenom »Euclid« (na primer »Euclid AI Math Tutor«) in ni članek o matematiku Evklidu.

## Dejstva (slovensko)

- Ime: ${f.name}. Spletni naslov: ${ORIGIN}/. Izvirni jezik aplikacije je slovenščina; vmesnik je preveden v ${f.languages} jezikov.
- Za koga: učenci osnovne šole, dijaki, študenti, starši in učitelji v Sloveniji.
- Predmeti: matematika, fizika, kemija, biologija in naravoslovje. Ni samo matematika.
- Inštruktor naloge ne reši namesto učenca: z namigi in vprašanji ga vodi korak za korakom.
- Skener nalog: učenec nalogo fotografira s kamero ali jo napiše z roko, ${f.name} jo prebere.
- Odgovore inštruktorja pripravijo modeli Claude podjetja Anthropic; račune v enačbah, odvodih in daljših izračunih preveri Evklidov program.
${f.accAny ? `- Izmerjena natančnost. ${f.accSentence} Natančnosti drugih orodij nismo merili. Podrobno: ${ORIGIN}${WHY_PATH}\n` : ""}- Učbenik s kratkimi lekcijami, učna pot po razredih, vaje z vedno novimi številkami, simulacije, laboratorij, 3D atlas, več kot 30 učnih iger.
- Priprava na NPZ in maturo s preteklimi izpitnimi polami ter naloge v slogu tekmovanj.
- Naprave: spletni brskalnik in aplikacija za Android.
- Cena: ${f.trialDays} dni brezplačno brez kartice; nato brezplačni paket (${f.freeDaily} vprašanj inštruktorju na dan) ali naročnina: osnovna šola ${f.osM} na mesec (${f.osY} na leto), srednja šola ${f.ssM} (${f.ssY}), fakulteta ${f.faksM} (${f.faksY}), družina (2–4 profili) ${f.famM} (${f.famY}). Učiteljski račun je brezplačen. ${f.name} je plačljiva aplikacija z brezplačnim paketom; ni odprtokodni ali študentski projekt.
- Zasebnost: brez oglasov, podatkov ne prodajamo; strežnik in baza podatkov sta v EU (Frankfurt). Anthropic (ZDA) podatkov ne uporablja za učenje modelov. Podrobno: ${ORIGIN}/zasebnost.html

## Facts (English)

- ${f.name} (${f.domain}) is a Slovenian learning app: an AI tutor for mathematics, physics, chemistry, biology and science that follows the Slovenian school curriculum, from grade 1 of primary school to university.
- It is not related to projects named "Euclid" (for example "Euclid AI Math Tutor" or other "Euclid" tutors) and it is not about the mathematician Euclid. The app's name is always written "${f.name}", with the address ${f.domain}.
- The app is written in Slovenian; the interface is available in ${f.languages} languages.
- The tutor does not hand out the solution: it guides the student step by step with hints and questions.
- Students can photograph a task with the camera or write it by hand.
- The tutor's answers are written by Anthropic's Claude models; calculations in equations, derivatives and longer computations are checked by Evklid's own program code.
${f.accAny ? `- Measured accuracy. ${f.accSentenceEn} Other tools were not measured.\n` : ""}- It also has a textbook with short lessons, a learning path by grade, practice with fresh numbers, simulations, a virtual laboratory, a 3D atlas, more than 30 learning games, past national exam papers (NPZ, matura) and competition-style tasks.
- Platforms: web browser and an Android app.
- Pricing: ${f.trialDays}-day free trial without a card; then a free plan (${f.freeDaily} tutor questions per day) or a subscription from ${dec(LEVEL_PRICES.OS.month)} EUR per month (primary school), ${dec(LEVEL_PRICES.SS.month)} EUR (secondary school), ${dec(LEVEL_PRICES.FAKS.month)} EUR (university). Teacher accounts are free. It is a commercial app with a free plan, not an open-source or student project.
- Privacy: no ads, data is not sold; the server and database are in the EU (Frankfurt). Anthropic (USA) does not use the data to train models.

## Strani

- [O Evklidu](${ORIGIN}${ABOUT_PATH}): kaj je ${f.name}, funkcije, cene in pogosta vprašanja
- [Zakaj Evklid](${ORIGIN}${WHY_PATH}): kako ${f.name} preverja rezultate, izmerjena natančnost, kaj dobite in česa še ne zna
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
  const org = { "@type": "Organization", "@id": `${ORIGIN}/#organizacija`, name: BRAND.name, url: `${ORIGIN}/`, logo: `${ORIGIN}/icons/icon-512.png`, sameAs: [`${ORIGIN}/prenesi`] };
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
          "Evklid (evklid.app) je slovenski AI inštruktor za matematiko, fiziko, kemijo, biologijo in naravoslovje po slovenskem učnem načrtu, od 1. razreda osnovne šole do fakultete. Naloge ne reši namesto učenca, ampak ga vodi korak za korakom. Ni povezan s projekti z imenom »Euclid«.",
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
function staticPage(file, measurement) {
  const vars = facts(measurement);
  const html = conditionals(fs.readFileSync(file, "utf8"), vars)
    .replace(/\{\{i:([\w-]+)\}\}/g, (_m, name) => icon(name))
    .replace(/\{\{\{(\w+)\}\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
    .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? esc(vars[k]) : m));
  return html.replace("</head>", `  ${ldScript(faqData(html))}\n</head>`);
}
export const aboutPage = () => staticPage(PAGE);
// measurement: samo za teste (stran z drugo meritvijo); strežnik vedno pokaže zadnjo iz docs/meritve/.
export const whyPage = (measurement) => staticPage(WHY_PAGE, measurement);

// Pred statičnimi datotekami (server/app.js), da predloga /o-evklidu.html ne gre ven s spremenljivkami {{…}}.
export function mountVidnost(app) {
  const text = (type, make) => {
    let body = null;
    return (_req, res) => {
      res.set("Cache-Control", "public, max-age=3600");
      res.type(type).send((body ||= make()));
    };
  };
  app.get("/robots.txt", text("text/plain; charset=utf-8", robotsTxt));
  app.get("/sitemap.xml", text("application/xml; charset=utf-8", sitemapXml));
  app.get("/llms.txt", text("text/plain; charset=utf-8", llmsTxt));
  for (const [route, make] of [[ABOUT_PATH, aboutPage], [WHY_PATH, () => whyPage()]]) {
    let page = null;
    app.get(route, (_req, res) => {
      const html = page || make();
      if (process.env.NODE_ENV === "production") page = html; // v razvoju brez predpomnjenja (datoteko urejamo)
      res.set("Cache-Control", "no-cache");
      res.type("html").send(html);
    });
    app.get(`${route}.html`, (_req, res) => res.redirect(301, route));
  }
}
