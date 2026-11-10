import "./env.js";
import path from "node:path";
import { openDb } from "./db.js";
import { BRAND } from "./brand.js";
import { applyPendingRestore } from "./kopije.js";
import { createApp } from "./app.js";
import { isMockMode, MODEL } from "./claude.js";

// Obnova iz varnostne kopije (scripts/obnovi-kopijo.js) samo ob zagonu strežnika, preden se baza odpre.
applyPendingRestore(process.env.EVKLID_DB || `data/${BRAND.slug}.db`);
const store = openDb();
// Povratne informacije testerjev se zapišejo tudi v datoteko ob bazi (data/povratne-informacije.json).
const feedbackFile = path.resolve(path.dirname(process.env.EVKLID_DB || "data/evklid.db"), "povratne-informacije.json");
// Anonimni seštevki avatarjev za tedensko posodobitev kozmetike (data/kozmetika-trendi.json).
const trendsFile = path.resolve(path.dirname(feedbackFile), "kozmetika-trendi.json");
const app = createApp(store, { feedbackFile, trendsFile });
const port = Number(process.env.PORT || 3000);

const server = app.listen(port, () => {
  console.log(`Evklid teče na http://localhost:${port}`);
  console.log(isMockMode() ? "Preizkusni način (brez API ključa)." : `Model: ${MODEL}`);
  // Datoteke prvega odprtja strani stisnemo v ozadju takoj po zagonu (server/compress.js).
  const t0 = Date.now();
  app.locals.warmStatic?.()
    .then((n) => console.log(`[evklid] pripravljenih ${n} stisnjenih datotek v ${Date.now() - t0} ms`))
    .catch(() => {});
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
});

// Zaustavitev (objava na Render pošlje SIGTERM): novih zahtev ne sprejmemo, klici AI v teku se lahko končajo
// (največ 20 s), da se zapiše njihov pravi strošek, ne cela rezerva ob naslednjem zagonu (pregled #462 K3-5).
let stopping = false;
function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`[evklid] ${signal}: zaustavljam, čakam na klice AI v teku …`);
  server.close();
  const t0 = Date.now();
  const tick = () => {
    const busy = app.locals.usage?.inflight?.size || 0;
    if (!busy || Date.now() - t0 > 20000) process.exit(0);
    else setTimeout(tick, 250).unref?.();
  };
  tick();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
