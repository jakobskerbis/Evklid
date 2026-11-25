import "./env.js";
import path from "node:path";
import { openDb } from "./db.js";
import { BRAND } from "./brand.js";
import { applyPendingRestore } from "./kopije.js";
import { cloudConfig, uskladiIzbrise } from "./kopije-oblak.js";
import { zagonBrezKljuca } from "./crypto-polje.js";
import { createApp } from "./app.js";
import { isMockMode, MODEL, zagonBrezAiKljuca } from "./claude.js";
import { casCheck, casOn } from "./cas.js";
import { ogrej as ogrejNujno } from "../public/nujno.js";
import { rokZaustavitveMs } from "./zdravje.js";

// Produkcija brez EVKLID_DATA_KEY: osebni podatki bi šli v bazo nešifrirani, zato se strežnik ne zažene.
const brezKljuca = zagonBrezKljuca();
if (brezKljuca) {
  console.error(brezKljuca);
  process.exit(1);
}
// Produkcija brez ANTHROPIC_API_KEY: inštruktor bi tiho tekel v preizkusnem načinu, zato se strežnik ne zažene
// (izjema samo izrecno z EVKLID_MOCK=1; server/claude.js zagonBrezAiKljuca).
const brezAi = zagonBrezAiKljuca();
if (brezAi) {
  console.error(brezAi);
  process.exit(1);
}

// Obnova iz varnostne kopije (scripts/obnovi-kopijo.js) samo ob zagonu strežnika, preden se baza odpre.
const dbFile = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
applyPendingRestore(dbFile);
// Seznam izbrisov iz R2 (po izgubi diska ali obnovi posnetka diska je lokalni lahko starejši), preden se baza odpre;
// izbrise nato ponovi createApp (server/accounts/izbris.js). Največ 10 s: nedosegljiva shramba zagona ne ustavi.
const oblak = cloudConfig();
if (oblak) {
  const rok = new Promise((resolve) => setTimeout(() => resolve("rok"), 10_000).unref());
  const r = await Promise.race([uskladiIzbrise(oblak, dbFile, { upload: false }), rok]).catch((e) => ({ napaka: e.message }));
  if (r === "rok" || r?.napaka) console.error(`[evklid] seznama izbrisov iz shrambe zunaj strežnika ni bilo mogoče prebrati (${r?.napaka || "ni odgovora v 10 s"}); znova poskusi vsako uro`);
  else if (r?.dodanih) console.log(`[evklid] seznam izbrisov iz shrambe zunaj strežnika: ${r.dodanih} novih`);
}
const store = openDb();
// Povratne informacije testerjev se zapišejo tudi v datoteko ob bazi (data/povratne-informacije.json).
const feedbackFile = path.resolve(path.dirname(process.env.EVKLID_DB || "data/evklid.db"), "povratne-informacije.json");
// Anonimni seštevki avatarjev za tedensko posodobitev kozmetike (data/kozmetika-trendi.json).
const trendsFile = path.resolve(path.dirname(feedbackFile), "kozmetika-trendi.json");
const app = createApp(store, { feedbackFile, trendsFile });
const port = Number(process.env.PORT || 3000);
// Nepričakovan ponovni zagon (sesutje, premalo pomnilnika, SIGKILL): oznaka teka ob bazi je ostala od prejšnjega
// procesa → števec v /healthz/stanje (zagoni) in e-pošta skrbniku (server/zdravje.js).
const zdravje = app.locals.zdravje;
zdravje?.zagon();
// Nepričakovana napaka (tudi neobravnavana zavrnjena obljuba, ki jo Node privzeto preda sem kot origin
// »unhandledRejection«): zapišemo vrsto za naslednji zagon in izstopimo s kodo 1 kot doslej (Render proces znova zažene).
process.on("uncaughtException", (err, origin) => {
  console.error(`[evklid] nepričakovana napaka (${origin}), strežnik se ustavi:`, err);
  zdravje?.sesutje(err, origin);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Evklid teče na http://localhost:${port}`);
  console.log(isMockMode() ? "Preizkusni način (brez API ključa)." : `Model: ${MODEL}`);
  // Preverjanje s SymPy (server/cas.js): proces se zažene takoj, da prvi odgovor ne čaka; v dnevniku je vidno, ali dela.
  if (casOn())
    casCheck("value", ["1+1", "2"]).then((r) => console.log(r.ok === true ? "[evklid] preverjanje s SymPy: deluje" : `[evklid] preverjanje s SymPy ni na voljo (${r.why})`));
  // Datoteke prvega odprtja strani stisnemo v ozadju takoj po zagonu (server/compress.js).
  const t0 = Date.now();
  app.locals.warmStatic?.()
    .then((n) => console.log(`[evklid] pripravljenih ${n} stisnjenih datotek v ${Date.now() - t0} ms`))
    .catch(() => {});
  // 3D modeli stisnjeni z brotli (server/tri-d.js brModeli): enkrat, na disk ob bazi, minuto po zagonu (prednost imajo
  // prvi obiski strani), ena datoteka naenkrat.
  setTimeout(() => {
    const t1 = Date.now();
    app.locals.warmModeli?.()
      .then((n) => console.log(`[evklid] 3D modeli stisnjeni (${n}) v ${Date.now() - t1} ms`))
      .catch((e) => console.warn(`[evklid] brotli 3D: ${e?.message || e}`));
  }, 60_000).unref();
  // Besedila zaslonov (/i18n/zasloni-sl.js): sestavljena takoj po zagonu, ne ob prvi zahtevi (prebere vse datoteke JS,
  // ~75 ms zasedene niti, ki bi sicer zadržala prvi klik po vsakem ponovnem zagonu).
  setImmediate(() => app.locals.pripraviZasloniSl?.().catch((e) => console.warn(`[evklid] besedila zaslonov: ${e?.message || e}`)));
  // Seznam odvisnosti lenih modulov (/lene-odvisnosti.js) prav tako takoj po zagonu, ne ob prvi zahtevi.
  setImmediate(() => app.locals.pripraviOdvisnosti?.().catch((e) => console.warn(`[evklid] odvisnosti modulov: ${e?.message || e}`)));
  // Varnostni zaznavalnik (public/nujno.js) sestavi vzorce šele ob prvi uporabi: tu jih v ozadju pripravi po kosih
  // (do 15 ms, vmes druge zahteve), da prvo sporočilo po zagonu ne čaka na sestavljanje in prevajanje.
  const ogrejZaznavalnik = () => ogrejNujno(15) || setTimeout(ogrejZaznavalnik, 5).unref();
  setTimeout(ogrejZaznavalnik, 1000).unref();
  // Učbenik za tisk: strani razredov v predpomnilnik v ozadju, 15 s po zagonu (ne upočasni zagona).
  setTimeout(() => {
    const t1 = Date.now();
    app.locals.tiskPredgrej?.()
      .then((n) => n && console.log(`[evklid] učbenik za tisk: ${n} strani v predpomnilniku v ${Date.now() - t1} ms`))
      .catch((e) => console.warn(`[evklid] predgrevanje učbenika: ${e?.message || e}`));
  }, 15_000).unref();
  // Vnaprej izdelani PDF-ji učbenika (server/ucbenik-pdf.js): 20 s po zagonu in nato vsake pol ure (dokler niso vsi, vsakih 5 min) prenese nove
  // z GitHuba na disk ob bazi. EVKLID_PDF=0 izklopi; v preizkusnem načinu samo z izrecnim EVKLID_PDF_URL.
  if (process.env.EVKLID_PDF !== "0" && (!isMockMode() || process.env.EVKLID_PDF_URL)) {
    const pdfSync = async () => {
      await app.locals.pdfStore?.sync().catch(() => {});
      setTimeout(pdfSync, app.locals.pdfStore?.nextDelayMs(process.uptime() * 1000) ?? 30 * 60_000).unref();
    };
    setTimeout(pdfSync, 20_000).unref();
  }
  // Ciljna meritev natančnosti po objavi ne teče več na strežniku (512 MB meja na Renderju, 16. 11. 2026), ampak v
  // GitHubu: .github/workflows/meritev-po-objavi.yml.
});

// Zaustavitev (objava na Render pošlje SIGTERM): novih zahtev ne sprejmemo, klici AI v teku se lahko končajo
// (največ 20 s, EVKLID_ZAUSTAVITEV_MS), da se zapiše njihov pravi strošek, ne cela rezerva ob naslednjem zagonu
// (pregled #462 K3-5). Vprašanja, ki še čakajo v vrsti za AI, in nova vprašanja med zaustavljanjem takoj dobijo
// obvestilo o posodobitvi; odgovore, ki po roku še tečejo, prekinemo z istim obvestilom (vprašanje ne šteje v dnevno
// mejo, server/app.js zaustaviOdgovore) in počakamo največ 2 s, da se zapišejo in pošljejo.
const ROK_ZAUSTAVITVE_MS = rokZaustavitveMs(); // največ 25 s (Render pošlje SIGKILL po 30 s; server/zdravje.js)
let stopping = false;
function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`[evklid] ${signal}: zaustavljam, čakam na klice AI v teku …`);
  server.close();
  // Če se zanka dogodkov izprazni pred naslednjim tikom, Node izstopi sam: oznaka teka se pobriše tudi takrat.
  process.once("beforeExit", () => zdravje?.cistaZaustavitev());
  app.locals.zaustaviOdgovore?.({ samoVrsta: true });
  const t0 = Date.now();
  let prekinjeno = 0; // čas, ko so bili odgovori po roku prekinjeni
  const tick = () => {
    const busy = (app.locals.usage?.inflight?.size || 0) + (app.locals.odgovoriVTeku?.() || 0);
    if (busy && !prekinjeno && Date.now() - t0 > ROK_ZAUSTAVITVE_MS) {
      prekinjeno = Date.now();
      const n = app.locals.zaustaviOdgovore?.() || 0;
      if (n) console.log(`[evklid] ${n} odgovorov v teku prekinjenih z obvestilom o posodobitvi`);
    }
    if (!busy || (prekinjeno && Date.now() - prekinjeno > 2000)) {
      zdravje?.cistaZaustavitev();
      process.exit(0);
    } else setTimeout(tick, 250); // brez unref: zaustavitev se vedno konča tu, s pobrisano oznako teka
  };
  tick();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
