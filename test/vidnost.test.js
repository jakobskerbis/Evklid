// Vidnost v iskalnikih in pri pomočnikih AI (server/vidnost.js, j 2026-11-10): glava vstopne strani, schema.org,
// robots.txt, sitemap.xml, llms.txt in statična stran /o-evklidu brez JavaScripta.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BRAND } from "../server/brand.js";
import { LEVEL_PRICES, FAMILY_PRICES, TRIAL_DAYS } from "../server/accounts/plans.js";
import { structuredData, uiLanguages, robotsTxt, sitemapXml, llmsTxt, aboutPage, eur, PUBLIC_PAGES, PRIVATE_PATHS, ORIGIN } from "../server/vidnost.js";

const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
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
    // Vsaka stran iz sitemap.xml se res odpre (brez prijave).
    for (const p of PUBLIC_PAGES) assert.equal((await get(p)).status, 200, p);
    const home = await (await get("/")).text();
    assert.ok(home.includes('<link rel="canonical" href="https://evklid.app/">') && home.includes("application/ld+json"));
  });
  const land = readFileSync(new URL("../public/pristajalna.js", import.meta.url), "utf8");
  assert.ok(land.includes('<a href="/o-evklidu">${esc(t("land.what"))}</a>'), "povezava v nogi pristajalne strani");
});
