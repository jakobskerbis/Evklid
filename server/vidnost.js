// Vidnost v iskalnikih in pri pomočnikih AI (j 2026-11-10): Google AI je evklid.app zamenjal s tujimi projekti
// »Euclid« in trdil, da nima slovenščine, kamere in drugih predmetov. Tu so na enem mestu javna dejstva:
// - /robots.txt, /sitemap.xml, /llms.txt (pravi Content-Type; pred statičnimi datotekami),
// - /o-evklidu: statična stran brez JavaScripta (public/o-evklidu.html, spremenljivke {{…}} in ikone {{i:ime}}),
// - /zakaj-evklid: enaka tehnika (public/zakaj-evklid.html): kako Evklid preverja rezultate, izmerjena natančnost
//   (ACCURACY, iz docs/stroski-ai.md) in primerjava pristopa s splošnimi klepetalniki, brez imen in cen tekmecev,
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

// Izmerjena natančnost inštruktorja (docs/stroski-ai.md »Srednja šola: Haiku z več razmisleka«, meritev 4. 11. 2026,
// scripts/primerjava-modelov.js): rešeni primeri iz lekcij, odgovori modela BREZ sprotnega preverjanja s programom,
// ocenil jih je model Opus proti rešitvi iz lekcije. Delež odgovorov z napako. Način z več razmisleka je bil izmerjen
// samo na nalogah srednje šole in tekmovanj (thinkTasks), ne na vseh. Ob novi meritvi popravi tu in v dokumentu;
// test/vidnost.test.js preveri, da se številke ujemajo z dokumentom.
export const ACCURACY = { date: "4. 11. 2026", tasks: 50, plainPct: 12, strongPct: 2, thinkTasks: 23, thinkPct: 4 };
const count = (pct, n) => Math.round((pct * n) / 100);

export function facts() {
  return {
    accDate: ACCURACY.date,
    accTasks: ACCURACY.tasks,
    accPlain: ACCURACY.plainPct,
    accPlainN: count(ACCURACY.plainPct, ACCURACY.tasks),
    accStrong: ACCURACY.strongPct,
    accStrongN: count(ACCURACY.strongPct, ACCURACY.tasks),
    accThinkTasks: ACCURACY.thinkTasks,
    accThink: ACCURACY.thinkPct,
    accThinkN: count(ACCURACY.thinkPct, ACCURACY.thinkTasks),
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
- Odgovore inštruktorja pripravijo modeli Claude podjetja Anthropic; izračune in rezultate preveri Evklidov program (številke izračuna program, ne umetna inteligenca).
- Izmerjena natančnost (${f.accDate}, ${f.accTasks} rešenih primerov iz lekcij, odgovori modela brez preverjanja s programom, ocenjevalec je bil model AI): hitri model ${f.accPlain} % odgovorov z napako, zmogljivejši model ${f.accStrong} %; hitri model z več razmisleka ${f.accThink} % na ${f.accThinkTasks} nalogah srednje šole in tekmovanj. Vzorec je majhen. Natančnosti drugih orodij nismo merili. Podrobno: ${ORIGIN}${WHY_PATH}
- Učbenik s kratkimi lekcijami, učna pot po razredih, vaje z vedno novimi številkami, simulacije, laboratorij, 3D atlas, več kot 30 učnih iger.
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
- The tutor's answers are written by Anthropic's Claude models; calculations and results are checked by Evklid's own program code (numbers are computed by code, not by the AI model).
- Measured accuracy (${f.accDate}, ${f.accTasks} worked examples from the app's lessons, model answers without the program check, graded by an AI model): the fast model had an error in ${f.accPlain}% of answers, the stronger model in ${f.accStrong}%; the fast model with extended thinking in ${f.accThink}% on ${f.accThinkTasks} secondary-school and competition tasks. The sample is small. Other tools were not measured.
- It also has a textbook with short lessons, a learning path by grade, practice with fresh numbers, simulations, a virtual laboratory, a 3D atlas, more than 30 learning games, past national exam papers (NPZ, matura) and competition-style tasks.
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

function staticPage(file) {
  const vars = facts();
  const html = fs
    .readFileSync(file, "utf8")
    .replace(/\{\{i:([\w-]+)\}\}/g, (_m, name) => icon(name))
    .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? esc(vars[k]) : m));
  return html.replace("</head>", `  ${ldScript(faqData(html))}\n</head>`);
}
export const aboutPage = () => staticPage(PAGE);
export const whyPage = () => staticPage(WHY_PAGE);

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
  for (const [route, make] of [[ABOUT_PATH, aboutPage], [WHY_PATH, whyPage]]) {
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
