// Vidnost v iskalnikih in pri pomočnikih AI (server/vidnost.js, j 2026-11-10): glava vstopne strani, schema.org,
// robots.txt, sitemap.xml, llms.txt in statična stran /o-evklidu brez JavaScripta.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BRAND } from "../server/brand.js";
import { LEVEL_PRICES, FAMILY_PRICES, TRIAL_DAYS } from "../server/accounts/plans.js";
import { structuredData, uiLanguages, robotsTxt, sitemapXml, llmsTxt, aboutPage, whyPage, accuracy, eur, PUBLIC_PAGES, PRIVATE_PATHS, ORIGIN } from "../server/vidnost.js";
import { presolve, claimNote } from "../server/live-check.js";
import { latestMeasurement, measurementError, pctText, slDate, summarize, tableMd, updateDoc, finalNumbers, codeResult, DOC_START, DOC_END } from "../scripts/meritev-natancnosti.js";

const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const textOf = (html) => html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g, " ").replace(/\s+/g, " ");
const ldBlocks = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

async function withApp(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
    store.db.close();
  }
}

test("vstopna stran: naslov, opis, canonical, Open Graph in Twitter", () => {
  const title = index.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.startsWith(`${BRAND.name} – slovenski AI inštruktor`) && title.endsWith(`| ${BRAND.domain}`), title);
  assert.ok(title.length <= 65, `naslov ima ${title.length} znakov`);
  const desc = meta(index, "name", "description");
  assert.ok(desc.includes(BRAND.domain) && /slovenski AI inštruktor/.test(desc) && /matematiko, fiziko, kemijo in biologijo/.test(desc));
  assert.ok(desc.length <= 220, `opis ima ${desc.length} znakov`);
  assert.ok(index.includes(`<link rel="canonical" href="${ORIGIN}/">`));
  assert.equal(meta(index, "property", "og:url"), `${ORIGIN}/`);
  assert.equal(meta(index, "property", "og:site_name"), BRAND.name);
  assert.equal(meta(index, "property", "og:locale"), "sl_SI");
  assert.ok(meta(index, "property", "og:title") && meta(index, "property", "og:description") && meta(index, "property", "og:image"));
  assert.equal(meta(index, "name", "twitter:card"), "summary");
  assert.ok(!/hreflang/.test(index), "aplikacija nima jezikovnih naslovov URL, zato brez hreflang");
  // Brez JavaScripta (pomočniki AI strani ne izrišejo) ostane kratek opis in povezava na /o-evklidu.
  const noscript = index.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
  assert.ok(noscript.includes('href="/o-evklidu"') && noscript.includes(BRAND.domain));
  // Povezave v <noscript> ne smejo kazati na datoteke v public/: server/startup-files.js bi jih štel k prvemu odprtju.
  for (const [, href] of noscript.matchAll(/href="([^"]+)"/g)) assert.ok(!existsSync(new URL(`../public${href}`, import.meta.url)), href);
});

test("schema.org v vstopni strani se ujema s cenikom in jeziki vmesnika", () => {
  const blocks = ldBlocks(index);
  assert.equal(blocks.length, 1);
  assert.deepEqual(blocks[0], JSON.parse(JSON.stringify(structuredData())), "public/index.html: posodobi zapis iz structuredData()");
  const graph = blocks[0]["@graph"];
  const org = graph.find((n) => n["@type"] === "Organization");
  assert.equal(org.name, BRAND.name);
  assert.equal(org.url, `${ORIGIN}/`);
  assert.ok(existsSync(new URL(`../public${new URL(org.logo).pathname}`, import.meta.url)), "logotip obstaja");
  const app = graph.find((n) => [].concat(n["@type"]).includes("SoftwareApplication"));
  assert.equal(app.applicationCategory, "EducationalApplication");
  assert.equal(app.operatingSystem, "Web, Android");
  assert.equal(app.inLanguage[0], "sl");
  assert.equal(app.inLanguage.length, 33);
  assert.deepEqual(app.inLanguage, uiLanguages());
  const prices = app.offers.map((o) => o.price);
  assert.deepEqual(prices, ["0.00", "9.99", "13.99", "19.99"]);
  assert.equal(prices[1], (LEVEL_PRICES.OS.month / 100).toFixed(2));
  assert.ok(app.offers.every((o) => o.priceCurrency === "EUR"));
  const all = JSON.stringify(blocks[0]);
  assert.ok(!/aggregateRating|ratingValue|reviewCount|userInteractionCount/.test(all), "brez ocen in števila uporabnikov");
});

test("robots.txt, sitemap.xml in llms.txt: vsebina", () => {
  const robots = robotsTxt();
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/);
  for (const p of PRIVATE_PATHS) assert.ok(robots.includes(`Disallow: ${p}\n`), p);
  assert.ok(robots.includes("Disallow: /api/\n"));
  assert.ok(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`));
  for (const p of PUBLIC_PAGES) assert.ok(!PRIVATE_PATHS.some((d) => p.startsWith(d)), `${p} ni prepovedana`);

  const xml = sitemapXml();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(xml.trimEnd().endsWith("</urlset>"));
  const locs = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><\/url>/g)].map((m) => m[1]);
  assert.deepEqual(locs, PUBLIC_PAGES.map((p) => ORIGIN + p));
  assert.equal(xml.match(/<url>/g).length, xml.match(/<\/url>/g).length);
  assert.ok(!/[&<>]/.test(locs.join("")), "naslovi brez znakov, ki bi pokvarili XML");
  assert.ok(locs.includes(`${ORIGIN}/o-evklidu`) && !locs.some((l) => /\/api\/|placaj/.test(l)));

  const llms = llmsTxt();
  assert.ok(llms.startsWith(`# ${BRAND.name} (${BRAND.domain})\n`));
  assert.match(llms, /je slovenska aplikacija/);
  assert.match(llms, /Ni povezana s projekti z imenom »Euclid«/);
  assert.match(llms, /is not related to projects named "Euclid"/);
  assert.ok(llms.includes(eur(LEVEL_PRICES.OS.month)) && llms.includes("9.99 EUR") && llms.includes(`${TRIAL_DAYS} dni brezplačno`));
  // Ime ponudnika modela (j, 10. 11. 2026): slovensko in angleško.
  assert.ok(llms.includes("pripravijo modeli Claude podjetja Anthropic") && llms.includes("Anthropic's Claude models"));
});

test("stran /o-evklidu: brez JavaScripta, cene iz cenika, pogosta vprašanja", () => {
  const html = aboutPage();
  assert.ok(!/\{\{[\w:-]+\}\}/.test(html), "vse spremenljivke so zamenjane");
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  assert.ok(scripts.length === 1 && /application\/ld\+json/.test(scripts[0]), "edini <script> je podatkovni (schema.org)");
  assert.ok(!/\son\w+="/.test(html), "brez vrinjenih dogodkov");
  assert.ok(html.includes('<html lang="sl">') && html.includes(`<link rel="canonical" href="${ORIGIN}/o-evklidu">`));
  for (const c of [LEVEL_PRICES.OS, LEVEL_PRICES.SS, LEVEL_PRICES.FAKS, FAMILY_PRICES.druzina, FAMILY_PRICES.druzina_student]) {
    assert.ok(html.includes(`<td>${eur(c.month)}</td><td>${eur(c.year)}</td>`), `cena ${c.month}`);
  }
  assert.ok(html.includes("9,99 €") && html.includes("99 €"));
  assert.ok(html.includes("33 jezikov") && html.includes(`${TRIAL_DAYS} dni brezplačno`));
  assert.match(html, /Ni povezan s projekti z imenom »Euclid«/);
  assert.ok(html.includes("Odgovore inštruktorja pripravijo modeli Claude podjetja Anthropic; izračune in rezultate preveri Evklidov program."));
  assert.ok(html.includes("vidijo samo njegov starš in, če je otrok v razredu, učitelj razreda") && !html.includes("Ime je dobil"));
  const faq = ldBlocks(html)[0];
  assert.equal(faq["@type"], "FAQPage");
  const n = (html.match(/<details/g) || []).length;
  assert.ok(n >= 6 && n <= 10, `${n} vprašanj`);
  assert.equal(faq.mainEntity.length, n);
  for (const q of faq.mainEntity) assert.ok(q.name.endsWith("?") && q.acceptedAnswer.text.length > 20 && !/[<>{&]/.test(q.name + q.acceptedAnswer.text));
  // Videz samodejno po napravi, brez JavaScripta in brez razreda na <html>: temne barve so prepis :root.dark iz style.css.
  assert.ok(html.includes('<meta name="color-scheme" content="light dark">'));
  const decls = (block) => block.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("/*"));
  const appDark = readFileSync(new URL("../public/style.css", import.meta.url), "utf8").match(/:root\.dark \{\n([\s\S]*?)\n\}/)[1];
  const pageDark = html.match(/@media \(prefers-color-scheme: dark\) \{\s*:root \{\n([\s\S]*?)\n\s*\}/)[1];
  assert.deepEqual(decls(pageDark), decls(appDark), "temne barve strani = :root.dark v public/style.css");
  // Vikanje (docs/besedila.md): na strani za obiskovalce ni tikanja.
  const text = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g, " ");
  assert.ok(!/\b(tvoj\w*|tebe|moraš|lahko\s+(fotografiraš|izbereš)|vprašaš)\b/i.test(text), "brez tikanja");
  // Notranje povezave kažejo na javne strani.
  for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)) assert.ok(PUBLIC_PAGES.includes(href), href);
});

test("stran /zakaj-evklid: številke natančnosti iz docs/meritve, cene iz cenika, brez imen in cen tekmecev", () => {
  const html = whyPage();
  assert.ok(!/\{\{[\w:-]+\}\}|<!--\/?ce:/.test(html), "vse spremenljivke in pogojni deli so obdelani");
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  assert.ok(scripts.length === 1 && /application\/ld\+json/.test(scripts[0]), "edini <script> je podatkovni (schema.org)");
  assert.ok(!/\son\w+="/.test(html), "brez vrinjenih dogodkov");
  assert.ok(html.includes('<html lang="sl">') && html.includes(`<link rel="canonical" href="${ORIGIN}/zakaj-evklid">`) && html.includes("<h1>Zakaj Evklid</h1>"));
  const text = textOf(html);

  // Izmerjena natančnost: stran pokaže zadnjo meritev iz docs/meritve/ in nobenega drugega odstotka.
  const m = latestMeasurement();
  assert.ok(m && m.datoteka.startsWith("docs/meritve/natancnost-"), "meritev obstaja");
  for (const r of m.vrstice) {
    assert.ok(Number.isFinite(r.napake) ? r.napake <= r.primeri : Number.isFinite(r.napake_pct), r.kljuc);
    const cell = Number.isFinite(r.napake) ? `<td>${pctText(r)} % <small>${r.napake} od ${r.primeri}</small></td>` : `<td>${pctText(r)} %</td>`;
    // Celica je vezana na ime svoje vrstice (ne samo »nekje na strani«).
    const head = `<tr><th scope="row">${r.ime}${r.opomba ? `<small>${r.opomba}</small>` : ""}</th>`;
    assert.ok(html.includes(`${head}${cell}<td>${r.primeri}</td></tr>`), `vrstica ${r.kljuc}`);
  }
  const allowed = m.vrstice.map(pctText);
  const pcts = [...text.matchAll(/(\d+(?:,\d+)?) %/g)].map((x) => x[1]);
  assert.ok(pcts.length >= 2 * m.vrstice.length && pcts.every((p) => allowed.includes(p)), pcts.join(" "));
  // Števila »X od N« samo, če so res zapisana v meritvi (pregled #555).
  const counts = [...text.matchAll(/(\d+) od (\d+)/g)].map((x) => `${x[1]}/${x[2]}`);
  assert.deepEqual(counts.sort(), m.vrstice.filter((r) => Number.isFinite(r.napake)).map((r) => `${r.napake}/${r.primeri}`).sort());
  assert.ok(text.includes(`${slDate(m.datum)} smo`) && text.includes(`${m.primeri} rešenih primerov`));
  for (const s of ["Vzorec je majhen", "Ocenjeval jih ni človek", "Natančnosti drugih orodij nismo merili", "Manjših nenatančnosti, na primer pri zaokroževanju, nismo šteli kot napako", "samo vodi z vprašanji in rezultata ne pove, šteje kot odgovor brez napake"]) assert.ok(text.includes(s), s);
  // Tabela v docs/stroski-ai.md je zapis iste meritve.
  const doc = readFileSync(new URL("../docs/stroski-ai.md", import.meta.url), "utf8");
  assert.equal(updateDoc(doc, m), doc, "docs/stroski-ai.md: node scripts/primerjava-modelov.js --iz-json <zadnja meritev>");

  // Primer na strani je resničen: reševalnik reši enačbo in učenčev napačni rezultat označi kot napačen.
  assert.ok(text.includes("»Reši enačbo 3x + 5 = 20.«") && text.includes("Program enačbo reši sam: x = 5."));
  const pre = presolve("Reši enačbo 3x + 5 = 20.", { first: true });
  assert.equal(pre.problems[0].answer, "x = 5");
  assert.match(claimNote("x = 6", pre), /WRONG/);
  assert.match(claimNote("x = 5", pre), /CORRECT/);
  // Trditev o preverjanju je omejena na to, kar program res preveri (pregled #555).
  assert.ok(text.includes("Račune v enačbah, odvodih in daljših izračunih preveri program") && !/Račune preveri program|račune in rezultate/i.test(text));
  assert.ok(text.includes("Pri nekaterih nalogah (na primer tekmovanja, fakulteta) odgovor v plačljivih paketih, do dnevne meje, pregleda še zmogljivejši model."));

  // Kaj dobite: cene, preizkus, brezplačni paket in jeziki iz kode.
  for (const c of [LEVEL_PRICES.OS, LEVEL_PRICES.SS, LEVEL_PRICES.FAKS, FAMILY_PRICES.druzina]) {
    assert.ok(html.includes(`<td>${eur(c.month)} na mesec ali ${eur(c.year)} na leto</td>`), `cena ${c.month}`);
  }
  assert.ok(html.includes(`<td>${TRIAL_DAYS} dni, brez kartice</td>`) && html.includes("<td>10 vprašanj inštruktorju na dan</td>") && html.includes("vmesnik v 33 jezikih"));
  const known = [LEVEL_PRICES.OS, LEVEL_PRICES.SS, LEVEL_PRICES.FAKS, FAMILY_PRICES.druzina].flatMap((c) => [eur(c.month), eur(c.year)]);
  for (const [x] of text.matchAll(/\d+(?:,\d+)? €/g)) assert.ok(known.includes(x), x);

  // Pošteno: česa Evklid še ne zna.
  for (const s of ["Česa Evklid (še) ne zna", "Aplikacije še ni v trgovinah Google Play in App Store", "Umetna inteligenca se lahko zmoti pri razlagi", "drugih predmetov ne pokriva"]) assert.ok(text.includes(s), s);
  // Primerjalno oglaševanje (j 10. 11.: brez imen tekmecev): brez imen, cen in slabosti tekmecev. Edino tuje ime je
  // Tudi splošni klepetalniki niso imenovani; imen modelov na strani ni.
  assert.ok(!/Photomath|Khan|Gemini|Copilot|Astra|Duolingo|Brainly|Mathway|Wolfram|Socratic|Claude|Haiku|Sonnet|Opus|ChatGPT|OpenAI|GPT|Grok|Perplexity|DeepSeek|Mistral/i.test(text + html.split("<body>")[0]), "brez imen tekmecev in modelov");
  assert.ok(!/\b(boljši|boljša|boljše|najboljš\w*|natančnejš\w*|cenejš\w*|slabš\w*)\b/i.test(text), "brez primerjalnih trditev");

  const faq = ldBlocks(html)[0];
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity.length, (html.match(/<details/g) || []).length);
  for (const q of faq.mainEntity) assert.ok(q.name.endsWith("?") && q.acceptedAnswer.text.length > 20 && !/[<>{&]/.test(q.name + q.acceptedAnswer.text));
  // Enak videz kot /o-evklidu: glava z istim slogom (temne barve preveri test strani /o-evklidu).
  const css = (h) => h.match(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?<\/style>/)[0];
  assert.equal(css(html), css(aboutPage()), "temni način = /o-evklidu");
  assert.ok(html.includes('<meta name="color-scheme" content="light dark">'));
  assert.ok(!/\b(tvoj\w*|tebe|moraš|vprašaš)\b/i.test(text), "brez tikanja");
  for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)) assert.ok(PUBLIC_PAGES.includes(href), href);
  for (const [, id] of html.matchAll(/href="#([\w-]+)"/g)) assert.ok(html.includes(`id="${id}"`), `sidro ${id}`);
  // Povezave na stran: /o-evklidu, vstopna stran brez JavaScripta, llms.txt (z isto meritvijo).
  assert.ok(aboutPage().includes('<a href="/zakaj-evklid">Zakaj Evklid</a>'));
  assert.ok(index.match(/<noscript>([\s\S]*?)<\/noscript>/)[1].includes('href="/zakaj-evklid"'));
  const llms = llmsTxt();
  assert.ok(llms.includes(`[Zakaj Evklid](${ORIGIN}/zakaj-evklid)`) && llms.includes(accuracy().sentence) && llms.includes(accuracy().sentenceEn));
  assert.ok(llms.includes("Natančnosti drugih orodij nismo merili.") && llms.includes("Other tools were not measured.") && !/\d+ od \d+ rešenih/.test(llms));
  assert.ok(llms.includes("račune v enačbah, odvodih in daljših izračunih preveri Evklidov program") && !llms.includes("številke izračuna program"));
});

test("meritev 4. 11. 2026 (sam model): samo zapisani odstotki, z opozorili; meritve s preverjanjem stran ne izmišlja", () => {
  const m = JSON.parse(readFileSync(new URL("../docs/meritve/natancnost-2026-11-04.json", import.meta.url), "utf8"));
  // Datoteka je prepis docs/stroski-ai.md (odstotki in število nalog; števila napak niso bila shranjena).
  const doc = readFileSync(new URL("../docs/stroski-ai.md", import.meta.url), "utf8");
  const row = (k) => m.vrstice.find((r) => r.kljuc === k);
  assert.ok(doc.includes(`na ${row("hitri").primeri} rešenih primerih iz lekcij je imel navadni Haiku ${row("hitri").napake_pct} % napak`));
  assert.ok(doc.includes(`Sonnet ${row("zmogljivejsi").napake_pct} % (SŠ 0 %)`));
  assert.ok(doc.includes(`na istih ${row("razmislek").primeri} nalogah SŠ in tekmovanj imel ${row("razmislek").napake_pct} % napak`));
  assert.ok(readFileSync(new URL("../docs/spremembe-prompta.md", import.meta.url), "utf8").includes("v primerjavi modelov (4. 11., ocenjevalec Opus)"));
  assert.ok(m.vrsta === "model" && m.vrstice.every((r) => r.napake === undefined), "brez rekonstruiranih števil napak");
  const text = textOf(whyPage(m));
  for (const s of ["4. 11. 2026 smo modelu naročili, naj reši 50 rešenih primerov", "Merili smo sam model, brez sprotnega preverjanja s programom", "Meritev celega odgovora s preverjanjem še pripravljamo", "Meritev je bila pred spremembo navodil inštruktorja", "ne na vseh 50"]) assert.ok(text.includes(s), s);
  assert.ok(!/pred izboljšavo|stranskih trditvah|plačljivi paket (brez|z) dnevn/.test(text));
  assert.ok(!/\d+ od \d+/.test(text) && !text.includes("skozi Evklidov klepet") && !text.includes("s preverjanjem ,"), "brez številk meritve, ki je še ni");
  assert.deepEqual([...text.matchAll(/(\d+) %/g)].map((x) => x[1]).filter((p, i, a) => a.indexOf(p) === i).sort(), ["12", "2", "4"]);
});

test("meritev s preverjanjem: povzetek, tabela in stran iz istih številk; skripta brez ključa ne kliče API", () => {
  // Povzetek iz vrstic zagona: štejejo samo primeri, ocenjeni v obeh pogojih.
  const rows = [];
  for (let i = 0; i < 40; i++) {
    for (const pogoj of ["brez", "s"]) {
      const napaka = pogoj === "brez" ? i < 5 : i < 1;
      rows.push({ id: `L/${i}`, grade_usd: 0.02, stopnja: i % 2 ? "srednja šola" : "osnovna šola", pogoj, ocena: napaka ? "napaka" : "pravilno", vrsta: napaka ? "trditev" : "ni", rezultat_podan: true, koda: i === 7 ? false : true, usd: 0.01, model: "m", popravek: pogoj === "s" && i === 3, pregled: false, razlog: "r" });
    }
  }
  rows.push({ id: "L/x", stopnja: "osnovna šola", pogoj: "brez", ocena: "napaka" }, { id: "L/x", stopnja: "osnovna šola", pogoj: "s", ocena: "neocenjeno" });
  const sum = summarize(rows, { datum: "2026-12-01", ocenjevalec: "Opus (model AI)", vprasanje: "q", meja_pregledov: "brez", strosek_usd: { aplikacija: 1, ocenjevalec: 3, skupaj: 4 }, trajanje_min: 50 });
  assert.equal(sum.primeri, 40);
  assert.equal(sum.izpusceni, 1);
  assert.deepEqual(sum.vrstice.map((r) => [r.kljuc, r.napake, r.primeri, r.popravki]), [["brez", 5, 40, 0], ["s", 1, 40, 1]]);
  assert.deepEqual(sum.vrstice[0].po_stopnjah["osnovna šola"], { primeri: 20, napake: 3 });
  assert.equal(sum.vrstice[1].koda_neujemanje, 1);
  assert.deepEqual(sum.pari, { bolje: 4, slabse: 0, napaka_v_obeh: 1, brez_napake_v_obeh: 35 });
  assert.equal(measurementError(sum), null);
  assert.ok(sum.napake.length === 8 && sum.napake.every((n) => !("answer" in n)));
  // Tabela za dokument in stran pokažeta ista števila; 1 od 40 je 2,5 %.
  const md = tableMd(sum);
  assert.ok(md.includes("Pari (isti primer v obeh pogojih): bolje 4, slabše 0, napaka v obeh 1, brez napake v obeh 35.") && md.includes("Rezultat podan: Sam model, brez preverjanja 100 %"));
  assert.ok(md.includes("| Sam model, brez preverjanja | 12,5 % (5 od 40) | 40 |") && md.includes("| Cel Evklidov odgovor, s preverjanjem | 2,5 % (1 od 40) | 40 |") && md.includes("| osnovna šola | 3 od 20 | 1 od 20 |"));
  const doc = `a\n${DOC_START}\nstaro\n${DOC_END}\nb`;
  assert.equal(updateDoc(doc, sum), `a\n${DOC_START}\n${md}\n${DOC_END}\nb`);
  assert.equal(updateDoc(updateDoc(doc, sum), sum), updateDoc(doc, sum));
  const html = whyPage(sum);
  const text = textOf(html);
  assert.ok(html.includes('<tr><th scope="row">Sam model, brez preverjanja</th><td>12,5 % <small>5 od 40</small></td><td>40</td></tr>'));
  assert.ok(html.includes('<tr><th scope="row">Cel Evklidov odgovor, s preverjanjem</th><td>2,5 % <small>1 od 40</small></td><td>40</td></tr>'));
  // Viden pripis, kaj je bilo merjeno: plačljivi paket brez dnevne meje pregledov; z --resnicna-meja drugo besedilo.
  assert.ok(text.includes("enkrat z vklopljenim, z nastavitvami plačljivega paketa") && !text.includes("kot odgovor vidi učenec"));
  assert.ok(text.includes("Merili smo plačljivi paket brez dnevne meje pregledov z zmogljivejšim modelom.") && !text.includes("z dnevno mejo pregledov z zmogljivejšim modelom, kot velja"));
  const real = textOf(whyPage({ ...sum, meja_pregledov: "resnicna" }));
  assert.ok(real.includes("Merili smo plačljivi paket z dnevno mejo pregledov z zmogljivejšim modelom, kot velja v aplikaciji.") && !real.includes("brez dnevne meje pregledov"));
  assert.ok(llmsTxt(sum).includes("brez dnevne meje pregledov z zmogljivejšim modelom") && llmsTxt({ ...sum, meja_pregledov: "resnicna" }).includes("in z dnevno mejo pregledov"));
  assert.ok(text.includes("1. 12. 2026 smo skozi Evklidov klepet poslali 40 rešenih primerov") && text.includes("Vsak odgovor je nastal posebej"));
  assert.ok(!text.includes("še pripravljamo") && !text.includes("pred spremembo navodil") && !/12 %|4 %/.test(text), "stara meritev ni več na strani");
  assert.ok(!/\{\{|<!--\/?ce:/.test(html));
  // Koda kot drugi ocenjevalec: končna števila iz vrstice »Odgovor« lekcije.
  assert.deepEqual(finalNumbers("1. $I = 0{,}15$\n2. Odgovor: teče tok $0{,}150\\,\\text{A}$ na $2\\,\\text{m}^2$."), ["0,15", "2"]);
  assert.equal(codeResult("Odgovor: $0{,}15\\,\\text{A}$", "Tok je $I = 0{,}15\\,\\mathrm{A}$."), true);
  assert.equal(codeResult("Odgovor: $x = 5$", "Torej je $x = 6$."), false);
  assert.equal(codeResult("Odgovor: trikotnika sta skladna.", "Sta skladna."), null);

  // Brez ključa in z EVKLID_MOCK=1: izhod 0, brez klica (aplikacija se sploh ne zažene) in brez zapisa v docs/meritve.
  const before = readdirSync(new URL("../docs/meritve/", import.meta.url)).join();
  for (const env of [{ ANTHROPIC_API_KEY: "" }, { ANTHROPIC_API_KEY: "sk-ant-test", EVKLID_MOCK: "1" }]) {
    const r = spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/primerjava-modelov.js", "--s-preverjanjem", "--n", "4"], {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      env: { PATH: process.env.PATH, HOME: process.env.HOME, EVKLID_DB: ":memory:", ANTHROPIC_BASE_URL: "http://127.0.0.1:9", ...env },
      encoding: "utf8",
      timeout: 60000,
    });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /Brez ključa ni klica in ni zapisa/);
    assert.ok(!/\[\d+\/\d+\]|POVZETEK ZA REPOZITORIJ/.test(r.stdout), "noben primer ni bil poslan");
  }
  assert.equal(readdirSync(new URL("../docs/meritve/", import.meta.url)).join(), before);
});

test("brez uporabne meritve strani delujejo: razdelek z meritvijo se skrije, nič ne vrne napake", () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    for (const bad of [null, {}, { vrsta: "model", datum: "2026-11-04", primeri: 50, vrstice: [{ ime: "A", primeri: 0 }] }, { vrsta: "aplikacija", datum: "x" }, "niz", [1, 2]]) {
      assert.equal(accuracy(bad), null);
      const html = whyPage(bad);
      const text = textOf(html);
      assert.ok(html.includes("<h1>Zakaj Evklid</h1>") && !/\{\{|<!--\/?ce:/.test(html), "stran se sestavi");
      assert.ok(!text.includes("Kaj smo izmerili") && !/\d %/.test(text) && !text.includes("Kako natančen je Evklid?") && !text.includes("Meritev natančnosti je majhna"), "brez razdelka in brez številk");
      for (const [, id] of html.matchAll(/href="#([\w-]+)"/g)) assert.ok(html.includes(`id="${id}"`), id);
      const faq = ldBlocks(html)[0];
      assert.equal(faq.mainEntity.length, (html.match(/<details/g) || []).length);
      const llms = llmsTxt(bad);
      assert.ok(llms.includes("[Zakaj Evklid]") && !/Izmerjena natančnost|Measured accuracy|undefined|null/.test(llms));
    }
    assert.ok(aboutPage().includes("<h1>Evklid je slovenski AI inštruktor za šolo</h1>"));
  } finally {
    console.warn = warn;
  }
  // /o-evklidu in pristajalna stran: ista zožena trditev o preverjanju kot na /zakaj-evklid (pregled #555).
  const about = textOf(aboutPage());
  assert.ok(about.includes("Številske račune v enačbah, odvodih in daljših izračunih preračuna program. Pri nekaterih nalogah odgovor pregleda še zmogljivejši model."));
  assert.ok(!/Številke (torej )?(in rezultate )?izračuna program|ne umetna inteligenca/.test(about));
  assert.ok(readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8").includes('"land.f2.d": "Številske račune v enačbah, odvodih in daljših izračunih preračuna program. Pri nekaterih nalogah gre odgovor še skozi dodaten pregled."'));
});

test("strežnik: prave vrste vsebine, stran /o-evklidu in povezava s pristajalne strani", async () => {
  await withApp(async (base) => {
    const get = (p) => fetch(base + p, { redirect: "manual" });
    const robots = await get("/robots.txt");
    assert.equal(robots.status, 200);
    assert.match(robots.headers.get("content-type"), /^text\/plain; charset=utf-8$/i);
    assert.equal(await robots.text(), robotsTxt());
    const map = await get("/sitemap.xml");
    assert.equal(map.status, 200);
    assert.match(map.headers.get("content-type"), /^application\/xml; charset=utf-8$/i);
    assert.equal(await map.text(), sitemapXml());
    const llms = await get("/llms.txt");
    assert.equal(llms.status, 200);
    assert.match(llms.headers.get("content-type"), /^text\/plain; charset=utf-8$/i);
    assert.ok((await llms.text()).includes("»Euclid«"));
    const about = await get("/o-evklidu");
    assert.equal(about.status, 200);
    assert.match(about.headers.get("content-type"), /^text\/html; charset=utf-8$/i);
    assert.ok((await about.text()).includes("<h1>Evklid je slovenski AI inštruktor za šolo</h1>"));
    const old = await get("/o-evklidu.html");
    assert.equal(old.status, 301);
    assert.equal(old.headers.get("location"), "/o-evklidu");
    const why = await get("/zakaj-evklid");
    assert.equal(why.status, 200);
    assert.match(why.headers.get("content-type"), /^text\/html; charset=utf-8$/i);
    assert.ok((await why.text()).includes("<h1>Zakaj Evklid</h1>"));
    const oldWhy = await get("/zakaj-evklid.html");
    assert.equal(oldWhy.status, 301);
    assert.equal(oldWhy.headers.get("location"), "/zakaj-evklid");
    // Vsaka stran iz sitemap.xml se res odpre (brez prijave).
    for (const p of PUBLIC_PAGES) assert.equal((await get(p)).status, 200, p);
    const home = await (await get("/")).text();
    assert.ok(home.includes('<link rel="canonical" href="https://evklid.app/">') && home.includes("application/ld+json"));
  });
  const land = readFileSync(new URL("../public/pristajalna.js", import.meta.url), "utf8");
  assert.ok(land.includes('<a href="/o-evklidu">${esc(t("land.what"))}</a>'), "povezava v nogi pristajalne strani");
  assert.ok(land.includes('<a href="/zakaj-evklid">${esc(t("land.why"))}</a>'), "povezava na Zakaj Evklid v nogi pristajalne strani");
});
