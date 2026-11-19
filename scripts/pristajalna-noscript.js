// Pristajalna stran brez JavaScripta (pregled »kupca« 16. 11. 2026): kdor prebere surovi HTML strani https://evklid.app/
// (iskalniki, predogledi povezav, orodja AI, brskalnik brez JavaScripta), je prej videl lupino aplikacije (15 zavihkov,
// »0 €«, »Nalagam …«, skrita obvestila) namesto predstavitve. Zdaj je na začetku <body> v <noscript> ista pristajalna stran
// kot v aplikaciji (public/pristajalna.js, slovensko), lupina pa je brez JavaScripta skrita (slog v <head>).
// Brskalnik z JavaScriptom vsebine <noscript> ne izriše, zato uporabniki aplikacije ne vidijo ničesar novega.
//
// node scripts/pristajalna-noscript.js          zapiše blok med oznakama v public/index.html
// node scripts/pristajalna-noscript.js --preveri  samo preveri (izhod 1, če je blok zastarel)
// test/pristajalna.test.js pade, ko se besedila land.* ali cenik spremenijo, blok pa ne: takrat zaženi skript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const INDEX = path.join(root, "public", "index.html");
export const START = "<!-- pristajalna-noscript: začetek (scripts/pristajalna-noscript.js) -->";
export const END = "<!-- pristajalna-noscript: konec -->";

// i18n.js ob nalaganju prevede statične napise v strani: v Node strani ni.
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { landingHtml } = await import("../public/pristajalna.js");
const { t } = await import("../public/i18n.js");
const { plansFor, TRIAL_DAYS } = await import("../server/accounts/plans.js");
const { minAgeOf } = await import("../server/accounts/age.js");
const { BRAND } = await import("../server/brand.js");

// Brez ikon (SVG): blok gre z vsako stranjo tudi uporabnikom z JavaScriptom, zato naj bo majhen.
const noIcons = (html) =>
  html
    .replace(/ ?<svg[\s\S]*?<\/svg>/g, "")
    .replace(/<span class="(?:land-ic|logo|land-gar-ic)" aria-hidden="true"><\/span>/g, "")
    .replace(/\n\s*\n/g, "\n");

export function noscriptBlock() {
  // Kot /api/account/prices za Slovenijo; garancije tu ni, ker jo strežnik oglašuje samo, ko je vklopljena (prices.guarantee).
  const prices = { currency: "EUR", plans: plansFor("EUR"), trial_days: TRIAL_DAYS, min_age: minAgeOf("SI") };
  const land = noIcons(landingHtml(t, { name: BRAND.name, prices, noscript: true }));
  return `${START}
  <noscript>
    <main class="view narrow land-static">
    ${land}
    </main>
  </noscript>
  ${END}`;
}

export function withBlock(html) {
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error(`public/index.html: ni oznak ${START} … ${END}`);
  return html.slice(0, a) + noscriptBlock() + html.slice(b + END.length);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const html = fs.readFileSync(INDEX, "utf8");
  const next = withBlock(html);
  if (process.argv.includes("--preveri")) {
    console.log(next === html ? "OK: blok je posodobljen." : "Blok je zastarel: zaženi node scripts/pristajalna-noscript.js");
    process.exit(next === html ? 0 : 1);
  }
  fs.writeFileSync(INDEX, next);
  console.log(next === html ? "Brez sprememb." : "Zapisano v public/index.html.");
}
