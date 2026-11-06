// HTTP strežnik Evklid: API + statični vmesnik.
import "./env.js";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { buildSystemPrompt } from "./prompt.js";
import { createStreamFilter, parseMeta, parseCards, parseChoices, stripChoices, stripMeta, stripLeadPhrase } from "./meta.js";
import { summarizedHistory } from "./povzetek.js";
import { studentResults } from "./results.js";
import { streamReply, readHandwriting, isMockMode, MODEL, MODEL_DEEP, MODEL_MID, REFUSAL_TEXT, errorText, apiErrorCode, modeParams } from "./claude.js";
import { Usage, LIMITS, NOTES, windowHistory, recentHistory } from "./usage.js";
import { pricingAdvice } from "./advice.js";
import { codeHint } from "./hints.js";
import { Progress } from "./progress.js";
import { mountLeagues } from "./leagues.js";
import { mountClassShowcase } from "./vitrina.js";
import { mountGradiva } from "./gradiva.js";
import { mountKviz } from "./kviz.js";
import { mountSchools } from "./schools.js";
import { visitCounter, mountPilot } from "./pilot.js";
import { sourceVisitCounter, mountRast, setSource } from "./rast.js";
import { mountSolePage, mountSchoolOrders } from "./sole.js";
import { getTopic, getPath, listPaths, pathKeyFor, pathLabelFor, learningPathPrompt, listPrograms, listProgramPaths, localTopic } from "./curriculum.js";
import { uiLanguage } from "../public/i18n/languages.js";
import { lessonView, tocView, bookView, listBooks, searchTextbook, lessonSummaryForPrompt, lessonExplanation, explanationFor, formulaSheetSections, lessonSymbols } from "./textbook.js";
import { printPage } from "./textbook-print.js";
import { programReferences, referencesFor, themesFor } from "./references.js";
import { SETTINGS_TOOLS, createSettingsTools, cleanDevice, looksLikeSettings, openWindowIntent } from "./chat-settings.js";
import { skillStats, detectWeakTopics, weaknessesForPrompt, topicIdFor, recordSkill, firstTime, mountSkillChecks } from "./weaknesses.js";
import { cleanText, ENUMS, DEFAULT_SETTINGS } from "./settings.js";
import { paperContext } from "./paper-context.js";
import { isHiddenNote } from "./skrite-opombe.js";
import { lessonForQuestion, lessonNote } from "./lekcija-za-vprasanje.js";
import { resolveOpen } from "./odpri.js";
import { ourPaperIds, loadOurPaper } from "./our-papers.js";
import { mountAccounts } from "./accounts/index.js";
import { passwordGate, gateNeeded } from "./gate.js";
import { levelUpSuggestion, nextLevel } from "./level-up.js";
import { competitionInfo, competitionKeyFor, isCompetitionPath } from "./competition.js";
import { PAPERS_SI, PAPERS_SOURCE } from "./exam-papers-si.js";
import { examInfo, examKeyFor, isExamPath, examOf, examPrompt, taskLanguage, localizeExamView, localizeExamTopic } from "./exams.js";
import { compressedStatic, compressedJson } from "./compress.js";
import { startupFiles } from "./startup-files.js";
import { mountFeedback, feedbackAiOn, feedbackPromptOn, isLocalRequest } from "./feedback.js";
import { mountReports, chatOff, messageCode, genericAnswer } from "./reports.js";
import { verifyAnswer, codeCheck } from "./verify.js";
import { liveCheckOn, presolve, withNote, codeFindings, needsReview, reviewAnswer, correction, insertFix, isClaim, claimNote, needsVerdictReview, reviewVerdict, verdictNote, looksLikeTask } from "./live-check.js";
import { mountGraphs } from "./graphs.js";
import { mountGames, notePathActivity } from "./games.js";
import { mountDailyPuzzle } from "./daily-puzzle.js";
import { mountLab } from "./laboratorij.js";
import { Avatars, mountAvatar } from "./avatar.js";
import { Knowledge, mountKnowledge } from "./zbirke.js";
import { mountCorner } from "./corner.js";
import { mountWebApp } from "./webapp.js";
import { Schedules, scheduleView, schedulePrompt, syncTestPlan } from "./schedule.js";
import { mountSchedule } from "./schedule-api.js";
import { mountScan } from "./scan.js";
import { appVersion, vendorVersion } from "./razlicica.js";
import { BRAND } from "./brand.js";
import { mobileClient, mountMobile } from "./mobile/index.js";
import { mount3d } from "./tri-d.js";
import { startPrivacyJobs, withoutImages, PHOTO_REJECTED_TEXT } from "./zasebnost.js";
import { jeFaks, jeSs } from "../public/stopnja.js";
import { startBackups } from "./kopije.js";
import { startCloudBackups } from "./kopije-oblak.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_B64 = 7 * 1024 * 1024; // ~5 MB slike
const MAX_TEXT = 6000;
const ANSWER_CACHE = process.env.EVKLID_ANSWER_CACHE !== "0";

// Ključ za ponovno uporabo odgovora: isto prvo vprašanje pri istih nastavitvah.
// mode: način klica (chat/lite/think/deep); pathTopic: tema učne poti (npr. »Začniva s temo …«).
function cacheKey(text, settings, mode, lite = false, pathTopic = null, weak = [], tier = "osnovna") {
  const norm = text.toLowerCase().replace(/\s+/g, " ").replace(/[\s.!?]+$/, "").trim();
  if (norm.length < 8) return null;
  const parts = [norm, settings.subject, settings.track, settings.educational_track, settings.study_program, settings.study_course, settings.curriculum_level, settings.solving_mode, settings.personality_setting, mode === "deep" ? 1 : 0];
  if (mode === "think") parts.push("think");
  if (mode === "mid") parts.push("mid");
  // Pri temi učne poti tudi šibke točke, da se osebni odgovor ne prenese k drugemu učencu.
  if (pathTopic) parts.push(`tema:${pathTopic}`, weak.join(","));
  // Jezik dodamo samo, kadar ni slovenščina, da obstoječi shranjeni odgovori ostanejo veljavni.
  if (settings.language && settings.language !== "sl") parts.push(settings.language);
  if (settings.region && settings.region !== "SI") parts.push(settings.region);
  if (settings.school_system && settings.school_system !== "SI") parts.push(settings.school_system);
  if (settings.dialect) parts.push(`d:${settings.dialect}`);
  if (lite) parts.push("lite");
  // Zahtevnost po rezultatih učenca (osnovna je privzeta, da shranjeni odgovori ostanejo veljavni).
  if (tier && tier !== "osnovna") parts.push(`zahtevnost:${tier}`);
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex");
}

// Pisave slogov (docs/oblikovanje.md): vsak paket @fontsource-variable/* iz package.json se streže pod /vendor/<ime>/
// (Čist = Instrument Sans, Igriv = Nunito, Temen = IBM Plex Sans, zgodovinski slogi po public/theme.js → ERAS).
const FONTS = Object.keys(JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")).dependencies || {})
  .filter((m) => m.startsWith("@fontsource-variable/"))
  .map((m) => [m.split("/")[1], m.split("/")[1]]);

// Stara povezava (ngrok ali začasni tunel Cloudflare) vodi na lastno domeno (brand.json), ko ta
// kaže na ta isti strežnik: nameščena aplikacija in shranjene povezave tako ne ostanejo prazne.
const INSTANCE = crypto.randomUUID();
const TUNNEL_HOST = /\.(ngrok(-free)?\.(app|dev|io|pizza)|trycloudflare\.com)$/i;
function mountOldLinkRedirect(app, homeCheck) {
  const domain = BRAND.domain;
  if (!domain || process.env[`${BRAND.env}_PREUSMERI`] === "0") return;
  const check = homeCheck || (async () => {
    const r = await fetch(`https://${domain}/healthz/stanje`, { signal: AbortSignal.timeout(4000) });
    return (await r.json()).id === INSTANCE;
  });
  // Odgovor velja 5 minut; potem ga osvežimo v ozadju (zahteva ne čaka do 4 s, sicer bi service
  // worker po svojem roku 4 s ponudil shranjeno stran namesto preusmeritve). Čaka le prva zahteva.
  let known = { at: 0, ok: false };
  let pending = null;
  const refresh = () => (pending ||= check().catch(() => false).then((ok) => {
    known = { at: Date.now(), ok };
    pending = null;
    return ok;
  }));
  const homeIsUs = () => {
    if (Date.now() - known.at < 5 * 60 * 1000) return known.ok;
    const p = refresh();
    return known.at ? known.ok : p;
  };
  app.use(async (req, res, next) => {
    if (!TUNNEL_HOST.test(req.hostname || "") || !req.originalUrl.startsWith("/") || !(await homeIsUs())) return next();
    res.set("Cache-Control", "no-store");
    res.redirect(302, `https://${domain}${req.originalUrl}`);
  });
}

// Varnostne glave (helmet). CSP: samo lastne skripte (brez vrinjenih), slogi tudi vrinjeni (KaTeX, style=),
// slike tudi z drugih strani https (kotiček z novicami), blob: za fotografije s kamere in posnetke.
// Plačilo (Stripe) in portal sta navadni preusmeritvi (location.href), zato ju CSP ne omejuje.
// Mobilna aplikacija (Expo) uporablja API in svoj WebView z lokalnim HTML, zato je CSP ne zadeva.
export const CSP = {
  "default-src": ["'self'"],
  "script-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "media-src": ["'self'", "blob:"],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};
// Kamera (skeniranje, fotografija naloge) in mikrofon (govor) samo za to stran; senzorji gibanja za igre.
export const PERMISSIONS_POLICY = [
  "camera=(self)",
  "microphone=(self)",
  "fullscreen=(self)",
  "accelerometer=(self)",
  "gyroscope=(self)",
  "magnetometer=(self)",
  "clipboard-write=(self)",
  "web-share=(self)",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "serial=()",
  "hid=()",
  "midi=()",
  "display-capture=()",
  "browsing-topics=()",
  "xr-spatial-tracking=()",
].join(", ");
// Javni podatki brez osebnih (učne poti, učbenik, formule): brskalnik jih sme hraniti in preveriti (ETag).
const PUBLIC_API = /^\/api\/(paths|programs|formulas|references|textbook\/|topic|lesson|teacher\/topics|account\/prices)(\/|\?|$)/;

function securityHeaders(app) {
  app.use(
    helmet({
      contentSecurityPolicy: { useDefaults: false, directives: CSP },
      strictTransportSecurity: false, // spodaj, samo prek https
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginEmbedderPolicy: false,
      xFrameOptions: { action: "deny" },
    }),
  );
  app.use((req, res, next) => {
    res.set("Permissions-Policy", PERMISSIONS_POLICY);
    if (req.secure) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    // Odgovori API so osebni: ne v predpomnilnik (poti, ki nastavijo svoje predpomnjenje, to prepišejo).
    if (req.path.startsWith("/api/")) res.set("Cache-Control", PUBLIC_API.test(req.originalUrl) ? "no-cache" : "no-store");
    next();
  });
}

export function createApp(store, opts = {}) {
  const { streamFn = streamReply, readFn = readHandwriting } = opts;
  const app = express();
  app.disable("x-powered-by");
  securityHeaders(app);
  mountOldLinkRedirect(app, opts.homeCheck);
  app.get("/healthz", (_req, res) => res.send("ok")); // za gostovanje, brez gesla
  // Brskalniki, Google in zaznamki iščejo /favicon.ico tudi brez <link rel="icon">: pošljemo logotip (scripts/logotip.cjs).
  app.get("/favicon.ico", (_req, res) => {
    res.set("Cache-Control", "public, max-age=86400");
    res.type("image/x-icon").sendFile(path.join(here, "..", "assets", "evklid.ico"));
  });
  // Različica in zasedenost: odprte strani se po posodobitvi osvežijo, samodejna posodobitev
  // (scripts/nadzor.js) pa strežnik znova zažene, ko nihče ne čaka na odgovor.
  const version = appVersion();
  const activity = { active: 0, lastSend: 0 };
  let backups = null; // dnevne varnostne kopije baze (server/kopije.js), nastavljene spodaj
  let cloudBackups = null; // ista kopija še zunaj strežnika (server/kopije-oblak.js)
  app.get("/healthz/stanje", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ id: INSTANCE, razlicica: version, aktivni: activity.active, mirujeMs: activity.lastSend ? Date.now() - activity.lastSend : null, gorMs: Math.round(process.uptime() * 1000), posta: accounts?.mailer?.status?.() ?? null, kopije: backups?.status() ?? null, kopijeZunaj: cloudBackups?.status() ?? null });
  });
  // Po izbrisu profila ali računa (GDPR čl. 17): kopije zunaj baze (npr. mnenja v JSON) se prepišejo brez njih.
  const afterDelete = [];
  app.use((req, res, next) => {
    if (req.method === "DELETE" && /^\/api\/(students\/\d+|account)$/.test(req.path)) {
      res.on("finish", () => {
        if (res.statusCode < 300) for (const fn of afterDelete) fn();
      });
    }
    next();
  });
  app.use(mobileClient); // mobilna aplikacija: seja v glavi namesto piškotka (server/mobile)
  const accounts = mountAccounts(app, store, opts); // starševski računi in plačila (EVKLID_ACCOUNTS=1)
  mountMobile(app, accounts, { scheduler: opts.scheduler, fetchFn: opts.fetchFn, ...opts.mobile }); // prijava z Apple, nakupi v trgovinah, obvestila, /prenesi
  if (gateNeeded()) app.use(passwordGate(process.env.EVKLID_PASSWORD)); // skupno geslo (samo brez računov, glej gate.js)
  mountWebApp(app); // manifest v jeziku vmesnika, povezava za Google Play
  app.use("/api", (req, res, next) => {
    activity.active++;
    if (req.method !== "GET") activity.lastSend = Date.now();
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      activity.active--;
    };
    res.on("finish", end);
    res.on("close", end);
    next();
  });
  app.use(express.json({ limit: "10mb" }));
  // Neuspele klice API zapišemo v dnevnik, da je napako na telefonu mogoče poiskati.
  app.use("/api", (req, res, next) => {
    res.on("finish", () => {
      // Brez poizvedbe (?token=… ipd.) in brez telesa zahteve.
      if (res.statusCode >= 400) console.warn(`[evklid] ${res.statusCode} ${req.method} ${req.originalUrl.split("?")[0]}`);
    });
    next();
  });
  // Knjižnice za izris strežemo lokalno (brez odvisnosti od CDN).
  const modules = path.join(here, "..", "node_modules");
  const publicDir = path.join(here, "..", "public");
  // Service worker z različico knjižnic v imenu predpomnilnika (glej server/razlicica.js).
  const swSource = fs.readFileSync(path.join(publicDir, "sw.js"), "utf8").replace('"evklid-v1"', `"evklid-v1-${vendorVersion()}"`);
  app.get("/sw.js", (_req, res) => {
    res.set("Cache-Control", "no-cache");
    res.type("text/javascript").send(swSource);
  });
  // Merjenje v pilotu: števec ogledov strani za starše (pred statičnimi datotekami, glej pilot.js).
  app.use(visitCounter(store.db));
  app.use(sourceVisitCounter(store.db)); // obiski s povezav z oznako vira (server/rast.js)
  mountSolePage(app, store); // stran za šole /sole (cene iz server/schools.js, glej sole.js)
  mount3d(app, { csp: CSP, modules }); // 3D atlas /3d, three pod /vendor/three (pred stisnjenimi datotekami: svoja CSP)
  // Lahki način: stisnjene datoteke in JSON (brotli/gzip) za počasne in drage mobilne povezave.
  if (process.env.EVKLID_COMPRESS !== "0") {
    const statics = compressedStatic([
      ["/vendor/katex/", path.join(modules, "katex", "dist")],
      ["/vendor/pdfjs/", path.join(modules, "pdfjs-dist")],
      ["/vendor/marked/", path.join(modules, "marked")],
      ["/vendor/dompurify/", path.join(modules, "dompurify", "dist")],
      ["/vendor/three/build/", path.join(modules, "three", "build")],
      ...FONTS.map(([dir, pkg]) => [`/vendor/${dir}/`, path.join(modules, "@fontsource-variable", pkg)]),
      ["/practice/", path.join(here, "practice")],
      ["/", publicDir],
    ]);
    app.use(statics);
    // server/index.js po zagonu vnaprej stisne datoteke prvega odprtja strani (prvi obiski po posodobitvi hitri).
    app.locals.warmStatic = () => statics.warm(startupFiles(publicDir, "index.html", ["games/index.js"]));
    app.use("/api", compressedJson());
  }
  app.use(express.static(publicDir));
  // Preverjanje odgovorov tudi v brskalniku (vaje brez povezave); datoteka nima odvisnosti.
  app.get("/practice/check.js", (_req, res) => res.type("text/javascript").sendFile(path.join(here, "practice", "check.js")));
  app.use("/vendor/katex", express.static(path.join(modules, "katex", "dist")));
  // pdf.js za prenešeno polo (public/paper-viewer.js): izris v brskalniku, pole ne gredo na strežnik.
  app.use("/vendor/pdfjs", express.static(path.join(modules, "pdfjs-dist")));
  app.use("/vendor/marked", express.static(path.join(modules, "marked")));
  app.use("/vendor/dompurify", express.static(path.join(modules, "dompurify", "dist")));
  for (const [dir, pkg] of FONTS) app.use(`/vendor/${dir}`, express.static(path.join(modules, "@fontsource-variable", pkg)));
  app.use("/vendor/three/build", express.static(path.join(modules, "three", "build"))); // 3D (server/tri-d.js)

  // Učbenik za tiskanje / PDF: brezplačno in brez prijave.
  app.get("/ucbenik/:path{/:topic}", (req, res) => {
    const html = printPage(req.params.path, req.params.topic || null);
    if (!html) return res.status(404).send("Ta del učbenika ne obstaja.");
    res.type("html").send(html);
  });

  const busy = new Set(); // pogovori, ki trenutno čakajo na odgovor
  const pendingSettings = new Map(); // pogovor → predlog spremembe šole/letnika, ki čaka na potrditev
  // »Vprašaj Evklida« iz Vadnice: pogovor -> naloga, da prvi odgovor sestavi koda.
  const helpTasks = new Map();
  const usage = new Usage(store.db);
  // Delitev mesečnega proračuna po profilih in dokupljeni kredit (z računi; server/proracun.js).
  // Zajamčeni delež naročnikov in poziv k dokupu (j 2026-11-01) morata veljati tudi tu, ne samo v Računu.
  if (accounts?.credits) usage.configure({ weightOf: accounts.shareWeightFor, ownerOf: accounts.ownerOf, credits: accounts.credits, freeOver: accounts.freeOver, guaranteeOf: accounts.guaranteeFor, topupPrompt: accounts.topupPrompt });
  // Kartice, ki so čakale na preverjanje ob ponovnem zagonu, ne bodo nikoli preverjene: proč z njimi
  // (sicer bi skrite blokirale isto vprašanje, UNIQUE student_id + norm).
  store.db.prepare("DELETE FROM flashcards WHERE verified = 0").run();
  // Trojno preverjanje pred shranjevanjem za ponovno uporabo (server/verify.js). Brez API ključa
  // (preizkusni način) so odgovori vnaprej pripravljeni: preveri jih samo koda.
  const verifyLive = () => !!opts.verifyFn || !isMockMode();
  const runVerify = opts.verifyFn || ((a) => verifyAnswer({ ...a, usage }));
  // Sprotno preverjanje odgovorov (server/live-check.js). Brez API ključa kliče model samo vstavljena
  // funkcija (preizkusi): popravek gre prek streamFn, pregled prek opts.reviewCreateFn.
  const liveFixOn = () => !!opts.streamFn || !isMockMode();
  const liveReviewOn = () => !!opts.reviewCreateFn || !isMockMode();
  const answerModelOf = (mode, deep) => (mode === "mid" ? MODEL_MID : deep ? MODEL_DEEP : MODEL);
  const settleLater = (promise, done) =>
    Promise.resolve(promise)
      .then((v) => done(!!v?.ok, v?.reason || ""), (e) => done(false, e?.message || "napaka"))
      .catch((e) => console.warn(`[evklid] preverjanje: ${e?.message || e}`));
  const progress = new Progress(store);
  const knowledge = new Knowledge(store.db); // zbirke znanja in učni pass (server/zbirke.js)
  // Urnik učenca (server/schedule.js): ure, testi; gre v prompt in v Pripravo na test.
  const schedules = new Schedules(store.db);
  const scheduleText = (s) => schedulePrompt(scheduleView(schedules.get(s.id), s.settings));

  const intParam = (v) => (/^\d+$/.test(v) ? Number(v) : NaN);
  const loadStudent = (req, res) => {
    const s = store.getStudent(intParam(req.params.id));
    if (!s) res.status(404).json({ error: "Učenec ne obstaja." });
    return s;
  };
  const loadConversation = (req, res) => {
    const c = store.getConversation(intParam(req.params.id));
    if (!c) res.status(404).json({ error: "Pogovor ne obstaja." });
    return c;
  };

  const feedbackStore = mountFeedback(app, store, { usage, file: opts.feedbackFile ?? null, createFn: opts.feedbackCreateFn });
  afterDelete.push(() => feedbackStore.writeFile());
  mountReports(app, store, {
    loadConversation,
    loadStudent,
    // Skrbnik: račun skrbnika (z računi) ali računalnik, kjer teče strežnik.
    isAdmin: (req) => !!req.parent?.is_admin || isLocalRequest(req),
    topicName: (id) => lessonView(id)?.name || null,
    localOnly: (req, res, next) => (isLocalRequest(req) ? next() : res.status(403).json({ error: "Samo na računalniku, kjer teče Evklid." })),
  });

  // Obvestilo »Testna verzija«: kaj še ne dela. EVKLID_TESTNA_VERZIJA=off ga skrije (ob javni objavi).
  const testNotice = () => {
    if (/^(off|0|false|ne)$/i.test(process.env.EVKLID_TESTNA_VERZIJA || "")) return [];
    const items = [usage.creditOutRecently() ? "tutorOff" : "tutor"];
    if (!/_live_/.test(process.env.STRIPE_SECRET_KEY || "")) items.push("pay");
    if (!process.env.RESEND_API_KEY) items.push("email");
    items.push("apps");
    return items;
  };
  app.get("/api/config", (req, res) => {
    res.json({
      mock: isMockMode(),
      model: MODEL,
      model_deep: MODEL_DEEP,
      enums: ENUMS,
      defaults: DEFAULT_SETTINGS,
      daily_questions: LIMITS.dailyQuestions() || null,
      feedback: { prompt: feedbackPromptOn(), ai: feedbackAiOn(), admin: isLocalRequest(req) },
      // Skrbnik vidi »Prijavi napako« v klepetu in seznam prijav (server/reports.js).
      admin: !!req.parent?.is_admin || isLocalRequest(req),
      chat_off: chatOff(),
      test_notice: testNotice(),
    });
  });

  // --- učenci in nastavitve ---
  app.get("/api/students", (_req, res) => res.json(store.listStudents()));
  app.post("/api/students", (req, res) => {
    const name = cleanText(req.body?.name, 40);
    if (!name) return res.status(400).json({ error: "Vpiši ime." });
    const dup = store.recentDuplicate(name, req.body?.settings);
    if (dup) return res.status(200).json(dup);
    const s = store.createStudent(name, req.body?.settings);
    setSource(store.db, s.id, req.body?.vir);
    res.status(201).json(store.getStudent(s.id));
  });
  app.get("/api/students/:id", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(s);
  });
  app.put("/api/students/:id", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const name = req.body?.name !== undefined ? cleanText(req.body.name, 40) || s.name : undefined;
    res.json(
      store.updateStudent(s.id, {
        name,
        settings: req.body?.settings,
        manual_weaknesses: req.body?.manual_weaknesses,
      }),
    );
  });
  // Prehod v višji razred/letnik: predlog na začetku šolskega leta in ali ima učenec poln paket.
  app.get("/api/students/:id/level-up", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json({ suggestion: levelUpSuggestion(s), next: nextLevel(s.settings), premium: !accounts || accounts.premiumFor(s.id), offers: accounts ? accounts.offersFor(s.id) : null });
  });
  app.delete("/api/students/:id", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ ok: store.deleteStudent(s.id) });
  });

  // --- napredek (analitika iz META) ---
  app.get("/api/students/:id/progress", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    // Vsi viri (klepet, Vadnica, igre, učbenik, pole, kartice, kviz) skupaj, po temi učne poti.
    const stats = skillStats(store, s);
    const topics = stats.map(({ subject, topic, topic_id, turns, errors, last_seen, sources, weak }) => ({ subject, topic, topic_id, turns, errors, last_seen, sources, weak, rate: turns ? errors / turns : 0 }));
    res.json({
      topics,
      weak: detectWeakTopics(stats),
      manual_weaknesses: s.manual_weaknesses,
      flags: store.flagEvents(s.id),
      activity: store.activityByDay(s.id),
      xpDays: store.xpByDay(s.id),
    });
  });

  // Ogled sestavljenega prompta, samo za razvoj.
  app.get("/api/students/:id/prompt", (req, res) => {
    if (process.env.EVKLID_DEBUG !== "1") return res.status(404).end();
    const s = loadStudent(req, res);
    if (!s) return;
    res.type("text/plain").send(
      buildSystemPrompt({ settings: s.settings, weaknesses: weaknessesForPrompt(store, s), studentName: s.name, results: studentResults(store, s.id).text, schedule: scheduleText(s) }),
    );
  });

  // --- pogovori ---
  app.get("/api/students/:id/conversations", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(store.listConversations(s.id));
  });
  app.post("/api/students/:id/conversations", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topic = req.body?.topic_id ? getTopic(req.body.topic_id) : null;
    if (req.body?.topic_id && !topic) return res.status(400).json({ error: "Tema ne obstaja." });
    res.status(201).json(store.createConversation(s.id, topic ? { pathTopic: topic.id, title: `Tema: ${topic.name}` } : {}));
  });
  // »Pokaži celoten postopek«: po treh zaporednih odgovorih v načinu A (vodenje) učenec dobi gumb za celotno
  // rešitev te naloge (enkratna prošnja, prompt: »Spremembe iz pogovora«). Odgovor v načinu B števec ponastavi.
  const FULL_AFTER = 3;
  const fullOffer = (convId) => {
    const modes = store.db
      .prepare("SELECT mode FROM events WHERE conversation_id = ? AND message_id IS NOT NULL ORDER BY id DESC LIMIT ?")
      .all(convId, FULL_AFTER)
      .map((r) => r.mode);
    return modes.length === FULL_AFTER && modes.every((m) => m === "A");
  };

  // Gumbi za orodja aplikacije pod odgovorom; zaklep interaktivnih delov kot v učbeniku.
  const openOf = async (raw, student) => {
    if (!/<<\s*(?:ODPRI|GRAF|SKICA)\b/.test(raw || "")) return undefined;
    const canOpen = accounts ? (topicId) => accounts.lessonInteractive(student.id, topicId) : null;
    const list = await resolveOpen(raw, student.settings, { canOpen });
    return list.length ? list : undefined;
  };
  const choicesOf = (raw) => {
    const c = parseChoices(raw);
    return c.length ? c : undefined;
  };
  // Surovo besedilo shranjenega odgovora (z bloki), za gumbe z izbirami ob ponovnem odprtju pogovora.
  const rawOf = (m) => (Array.isArray(m.api_content) ? m.api_content.filter((b) => b.type === "text").map((b) => b.text).join("\n") : "");

  app.get("/api/conversations/:id", async (req, res) => {
    const c = loadConversation(req, res);
    if (!c) return;
    const last = store.lastEvent(c.id);
    const reported = new Set(store.db.prepare("SELECT message_id FROM message_reports WHERE conversation_id = ?").all(c.id).map((r) => r.message_id));
    const msgs = store.listMessages(c.id);
    const lastMsg = msgs.at(-1);
    // done ni v tabeli events: prebere se iz META zadnjega odgovora (kot v done ob pošiljanju).
    const lastText = (m) => (Array.isArray(m.api_content) ? m.api_content.filter((b) => b.type === "text").map((b) => b.text).join("\n") : "");
    const offerOn = lastMsg?.role === "assistant" && last?.message_id === lastMsg.id && last.flag === "none" && !parseMeta(lastText(lastMsg))?.done && fullOffer(c.id);
    const owner = store.getStudent(c.student_id);
    const opens = new Map();
    // Kot ob pošiljanju: brez orodij pri opozorilih (flag ni none).
    const flagOk = (raw) => (parseMeta(raw)?.flag || "none") === "none";
    if (owner) for (const m of msgs) if (m.role === "assistant" && flagOk(rawOf(m))) opens.set(m.id, await openOf(rawOf(m), owner).catch(() => undefined));
    res.json({
      ...c,
      state: last ? { subject: last.subject, mode: last.mode } : null,
      topic: c.path_topic ? { id: c.path_topic, name: getTopic(c.path_topic)?.name } : null,
      messages: msgs.map((m) => ({
        full_offer: (offerOn && m === lastMsg) || undefined,
        choices: m === lastMsg && m.role === "assistant" && (!last || last.message_id !== m.id || last.flag === "none") ? choicesOf(rawOf(m)) : undefined,
        open: opens.get(m.id),
        id: m.id,
        code: m.role === "assistant" ? messageCode(m.id) : undefined,
        reported: reported.has(m.id) || undefined,
        role: m.role,
        text: m.display_text,
        has_image: !!m.has_image,
        created_at: m.created_at,
      })),
    });
  });
  app.delete("/api/conversations/:id", (req, res) => {
    const c = loadConversation(req, res);
    if (!c) return;
    // Prijava napake ostane kot zapis dogodka (odgovor inštruktorja), učenčevo vprašanje in opomba pa se izbrišeta.
    store.db.prepare("UPDATE message_reports SET question = NULL, note = NULL WHERE conversation_id = ?").run(c.id);
    store.db.prepare("UPDATE bug_reports SET context = NULL WHERE conversation_id = ?").run(c.id);
    res.json({ ok: store.deleteConversation(c.id) });
  });

  // --- klepet (Server-Sent Events) ---
  app.post("/api/conversations/:id/messages", async (req, res) => {
    const conv = loadConversation(req, res);
    if (!conv) return;
    const student = store.getStudent(conv.student_id);

    const text = typeof req.body?.text === "string" ? req.body.text.trim().slice(0, MAX_TEXT) : "";
    const image = req.body?.image;
    if (image && (!IMAGE_TYPES.includes(image.media_type) || typeof image.data !== "string" || image.data.length > MAX_IMAGE_B64)) {
      return res.status(400).json({ error: "Slika mora biti JPG, PNG, WEBP ali GIF in manjša od 5 MB." });
    }
    if (!text && !image) return res.status(400).json({ error: "Sporočilo je prazno." });
    // Stikalo za nujne primere (docs/krizni-nacrt.md): klepet izklopljen, Vadnica in lekcije delujejo.
    if (chatOff()) return res.status(503).json({ error: "Klepet z inštruktorjem je začasno izklopljen. Vaje, lekcije in igre delujejo.", chat_off: true });
    if (busy.has(conv.id)) return res.status(409).json({ error: "Počakaj, da Evklid odgovori." });
    const blocked = usage.blockInfo(student.id);
    if (blocked) return res.status(429).json({ ...blocked, limit: true });
    busy.add(conv.id);
    // Zajamčena poraba naročnika (j 2026-11-01): stanje pred odgovorom, da ob prehodu 80 % ali 100 % pošljemo obvestilo.
    const allowBefore = accounts ? usage.allowance(student.id) : null;
    // Lahki način: vedno (lite), nikoli (normal) ali po povezavi naprave, ki jo sporoči odjemalec (auto).
    const lite = student.settings.data_mode === "lite" || (student.settings.data_mode !== "normal" && req.body?.lite === true);
    // »Razloži podrobneje« je vedno na voljo, čim ceneje: prva ponovna razlaga je Haiku z več
    // razmisleka (z novim pristopom), močnejši model šele, ko učenec zaporedoma prosi še enkrat (z dnevno in
    // mesečno omejitvijo). Števec zaporednih prošenj je conversations.deep; običajno sporočilo ga ponastavi.
    // Tekmovanja: privzeto Haiku z več razmisleka.
    const again = req.body?.deep === true;
    const againStreak = again ? (conv.deep || 0) + 1 : 0;
    if (againStreak !== (conv.deep || 0)) store.db.prepare("UPDATE conversations SET deep = ? WHERE id = ?").run(againStreak, conv.id);
    // Aktivacijska koda: druga zaporedna prošnja gre k Sonnetu, šele tretja (in vsaka naslednja) k Opusu
    // (j 2026-10-30). Tekmovanja in fotografija urnika pri kodi ostanejo pri Sonnetu.
    // Nad skrito omejitvijo Opusa (usage.promoOpusSpent) tudi tretja prošnja tiho dobi Sonnet, brez opombe.
    // Pravice (server/placila/pravice.js): Osebno do Opusa šele ob 3. prošnji, šolska licenca največ Sonnet,
    // aktivacijska koda še s skrito mejo Opusa. Brez računov (lokalno) ostane Opus ob 2. prošnji.
    const ladder = accounts?.ladderFor?.(student.id) || null;
    // Tekmovanja (againStreak 0) pri Osebno ostanejo kot doslej; pri kodi in šoli največ Sonnet.
    const capped =
      !!ladder &&
      (!ladder.opus || (ladder.promo ? againStreak < 3 || usage.promoOpusSpent(student.id, MODEL_DEEP) : againStreak > 0 && againStreak < 3));
    const chosen = usage.chooseMode(student.id, {
      wantDeep: againStreak >= 2,
      wantThink: againStreak === 1,
      competition: student.settings.track === "COMPETITION",
      secondary: jeSs(student.settings),
      university: jeFaks(student.settings),
      lite,
      free: !!accounts && !accounts.aiPremiumFor(student.id),
      deepModel: capped ? MODEL_MID : MODEL_DEEP,
      capped,
    });
    // Mesečni proračun API (server/proracun.js): pod načrtom porabe močnejši model, nad njim hitri.
    // Brezplačni paket brez nadgradnje (nikoli Opus, ima svoje meje); koda in šolska licenca največ Sonnet.
    // Šola s porabljeno mesečno mejo AI (schoolAiOut) tu šteje kot brezplačni paket (aiPremiumFor).
    const premium = !accounts || accounts.aiPremiumFor(student.id);
    const maxTier = !premium ? null : ladder && (!ladder.opus || ladder.promo) ? "mid" : "deep";
    // Z opombo (dnevna meja Opusa, mehka meja, brezplačni paket) ostane izbrani hitri model: opomba mora držati.
    const routed = chosen.note ? { mode: chosen.mode, boosted: false, saved: false } : usage.route(student.id, chosen.mode, { lite, maxTier });
    const mode = routed.mode;
    const note = chosen.note || (routed.saved ? NOTES.appBudget : null);
    // »mid« (Sonnet: šolska licenca, Osebno pred 3. prošnjo, aktivacijska koda) se obnaša kot podrobna razlaga, le z drugim modelom.
    const deep = mode === "deep" || mode === "mid";

    const userContent = [];
    if (image) userContent.push({ type: "image", source: { type: "base64", media_type: image.media_type, data: image.data } });
    // Naloga iz pretekle pole: navodilo za inštruktorja kot skrit blok (server/paper-context.js), učenec vidi le text.
    const paperNote = paperContext(req.body?.paper, { loadOurs: loadOurPaper });
    if (paperNote) userContent.push({ type: "text", text: paperNote });
    const isFirst = store.listMessages(conv.id).length === 0;
    // Prvo vprašanje prostega pogovora: povzetek ujemajoče se lekcije iz učbenika kot skrita opomba
    // (server/lekcija-za-vprasanje.js). Shranjen s sporočilom, zato se začetek zgodovine ne spreminja.
    let lesson = null;
    try {
      if (isFirst && !conv.path_topic && !paperNote && text) lesson = lessonForQuestion(text, student.settings);
    } catch (err) {
      console.warn(`[evklid] iskanje lekcije ni uspelo: ${err?.message || err}`);
    }
    if (lesson) userContent.push({ type: "text", text: lessonNote(lesson) });
    userContent.push({ type: "text", text: text || "(Pošiljam fotografijo naloge.)" });
    const userMsgId = store.addMessage(conv.id, "user", userContent, text, !!image);
    const help = isFirst && !image ? helpTasks.get(conv.id) : null;
    if (help) helpTasks.delete(conv.id);
    const weak = weaknessesForPrompt(store, student);
    const results = studentResults(store, student.id, conv.path_topic);
    // Prošnja za spremembo nastavitev mora poklicati orodje, zato ne iz predpomnilnika odgovorov.
    const key = ANSWER_CACHE && isFirst && !image && !help && !paperNote && !looksLikeSettings(text) ? cacheKey(text, student.settings, mode, lite, conv.path_topic, weak, results.tier) : null;
    if (conv.title === "Nov pogovor") {
      store.renameConversation(conv.id, cleanText(text, 50) || "Naloga s fotografije");
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

    const controller = new AbortController();
    let finished = false;
    res.on("close", () => {
      if (!finished) controller.abort();
    });

    const filter = createStreamFilter();
    // Nastavitve iz klepeta (server/chat-settings.js): orodji za model, dogodki za odjemalca.
    const settingsTools = createSettingsTools({
      store,
      studentId: student.id,
      conversationId: conv.id,
      device: cleanDevice(req.body?.device),
      pending: pendingSettings,
      send,
      schedules,
      onSchedule: () => {
        const st = store.getStudent(student.id);
        syncTestPlan(progress, st.id, scheduleView(schedules.get(st.id), st.settings));
      },
    });
    const onToolUse = settingsTools.onToolUse;
    onToolUse.hasPending = () => pendingSettings.has(conv.id);
    try {
      // Pogovor o tekmovalni temi: inštruktor namiguje v slogu tekmovanj (model ostane isti).
      const tekTopic = conv.path_topic && isCompetitionPath(getTopic(conv.path_topic)?.path);
      const system = buildSystemPrompt({
        settings: tekTopic ? { ...student.settings, track: "COMPETITION" } : student.settings,
        weaknesses: weak,
        results: results.text,
        schedule: scheduleText(student),
        studentName: student.name,
        learningPath: conv.path_topic
          ? [learningPathPrompt(conv.path_topic), examPrompt(getTopic(conv.path_topic)?.path), lessonSummaryForPrompt(conv.path_topic)].filter(Boolean).join("\n")
          : "",
        lite,
      });
      // Prvi korak pri nalogi iz Vadnice sestavi koda (podatki, iskano, namig), brez klica modela.
      const hinted =
        help && !help.kind && help.text === text && student.settings.solving_mode !== "B" && (student.settings.language || "sl") === "sl"
          ? codeHint(help.task.payload, {
              subject: getTopic(help.task.topic_id)?.subject || student.settings.subject,
              topicName: getTopic(help.task.topic_id)?.name,
              lastAnswer: help.task.last_answer,
            })
          : null;
      // »Odpri kalkulator« in podobni kratki ukazi: okno odpre odjemalec, odgovor je en stavek brez modela.
      const win = !image && !help ? openWindowIntent(text) : null;
      if (win) {
        send("open_window", { view: win.view, ...(win.mode ? { mode: win.mode } : {}) });
        settingsTools.state.used = true; // brez »Razloži podrobneje«
      }
      const cached = win ? { text: win.text, hint: true } : hinted ? { text: hinted, hint: true } : key && store.db.prepare("SELECT text FROM answer_cache WHERE key = ? AND verified = 1 AND created_at >= datetime('now','-30 days')").get(key);
      if (note) send("delta", { text: note });
      // Naloga, ki jo reši naš preverjeni reševalnik: model dobi pravilen rezultat v skriti opombi.
      const pre = liveCheckOn() && !cached && !image && !win && !hinted ? presolve(text, { first: isFirst }) : null;
      const fullHistory = store.apiHistory(conv.id);
      const shortDeep = deep && !routed.boosted;
      let history = shortDeep ? recentHistory(fullHistory) : windowHistory(fullHistory);
      // Odrezani starejši del dolgega pogovora: kratek povzetek pred oknom (server/povzetek.js).
      // V načinu brez API-ja (mock) ne, razen v testih z lastnim streamFn.
      if (!shortDeep && !cached && !win && !hinted && (!isMockMode() || opts.streamFn)) {
        history = await summarizedHistory({
          store,
          conversationId: conv.id,
          fullHistory,
          history,
          streamFn,
          signal: controller.signal,
          log: (r) => r?.usage && usage.log(student.id, r.model || modeParams("lite").model, r.usage, "povzetek"),
        });
      }
      // Učenčev rezultat ali trditev: sodbo inštruktorja preveri koda (naloga iz prvega sporočila) ali model,
      // preden učenec odgovor vidi (server/live-check.js, 4). Zato se tak odgovor ne pretaka sproti.
      const textOf = (m) => (Array.isArray(m.content) ? m.content : [{ text: m.content }]).map((b) => b.text || "").join("\n");
      const prevTutor = fullHistory.filter((m) => m.role === "assistant").at(-1);
      const prevTutorText = prevTutor ? stripMeta(textOf(prevTutor)) : "";
      const claim = !pre && liveCheckOn() && !cached && !image && !win && !hinted && !isFirst && isClaim(text, prevTutorText);
      // Naloga je zadnja, ki jo je reševalnik rešil (prvo sporočilo ali poznejša »Reši …«): učenčev rezultat
      // sodi koda le proti nalogi, o kateri pogovor zdaj teče.
      // Če je učenec po tej nalogi poslal še eno, ki je reševalnik ne zna (»Kaj pa 3x = 15?«), koda ne sodi.
      let firstPre = null;
      if (claim) {
        // Brez skrite opombe pole (server/paper-context.js), sicer reševalnik prve naloge ne prepozna.
        const ownText = (m) => textOf(Array.isArray(m.content) ? { content: m.content.filter((x) => !isHiddenNote(x.text)) } : m);
        const earlier = fullHistory.filter((m) => m.role === "user").slice(0, -1).map(ownText);
        let at = -1;
        for (let i = earlier.length - 1; i >= 0 && !firstPre; i--) {
          firstPre = presolve(earlier[i], { first: i === 0 });
          at = i;
        }
        if (firstPre && earlier.slice(at + 1).some(looksLikeTask)) firstPre = null;
      }
      const codeVerdict = claim ? claimNote(text, firstPre) : null;
      const notes = [pre?.note, codeVerdict].filter(Boolean).join("\n");
      const held = []; // zadržani deli odgovora, dokler sodba ni preverjena
      const run = cached
        ? async ({ onText }) => {
            // Ime učenca je v predpomnilniku shranjeno kot {{IME}}.
            const t = cached.text.replaceAll("{{IME}}", student.name);
            for (let i = 0; i < t.length; i += 40) onText(t.slice(i, i + 40));
            if (!cached.hint) store.db.prepare("UPDATE answer_cache SET hits = hits + 1 WHERE key = ?").run(key);
            usage.logSaved(student.id, cached.hint ? "hint" : "reuse");
            return { content: [{ type: "text", text: t }], text: t, stopReason: "end_turn", usage: null, model: "cache" };
          }
        : streamFn;
      const first = await run({
        system,
        // Opus dobi samo zadnje izmenjave; Haiku daljše okno (predpomnjeno). Nadgrajen običajen
        // odgovor (proračun) ohrani celo okno, saj nadaljuje pogovor.
        // Opomba gre samo v ta klic (zadnja poteza), ne v shranjeno zgodovino.
        messages: notes ? withNote(history, notes) : history,
        deep,
        mode,
        tools: SETTINGS_TOOLS,
        onToolUse,
        signal: controller.signal,
        onText: (chunk) => {
          const out = filter.push(chunk);
          if (out) claim ? held.push(out) : send("delta", { text: out });
        },
      });
      if (controller.signal.aborted) throw new Error("aborted");

      let result = first;
      let { rest } = filter.end();
      let verdictChecked = false;
      let extraCost = 0;
      if (claim && !codeVerdict && result.text && result.stopReason !== "refusal" && !result.toolCalls && !settingsTools.state.used && liveReviewOn() && needsVerdictReview({ answer: stripMeta(result.text), lite, spentToday: () => usage.kindToday("sodba") })) {
        verdictChecked = true;
        try {
          const rv = await reviewVerdict({ context: prevTutorText, student: text, answer: stripMeta(result.text), createFn: opts.reviewCreateFn, usage, studentId: student.id });
          extraCost += rv.cost;
          if (rv.reason) {
            // Napačna sodba: isti model odgovori še enkrat z ugotovitvijo preverjevalca v skriti opombi.
            const again2 = createStreamFilter();
            held.length = 0;
            const r2 = await streamFn({
              system,
              messages: withNote(history, [notes, verdictNote(rv.reason)].filter(Boolean).join("\n")),
              deep,
              mode,
              tools: SETTINGS_TOOLS,
              onToolUse,
              signal: controller.signal,
              onText: (chunk) => {
                const out = again2.push(chunk);
                if (out) held.push(out);
              },
            });
            if (controller.signal.aborted) throw new Error("aborted");
            extraCost += usage.log(student.id, r2.model || answerModelOf(mode, deep), r2.usage, "popravek");
            result = r2;
            rest = again2.end().rest;
          }
        } catch (e) {
          if (controller.signal.aborted) throw e;
          console.warn(`[evklid] pregled sodbe ni uspel: ${e?.message || e}`);
        }
      }
      for (const t of held) send("delta", { text: t });
      if (rest) send("delta", { text: rest });

      // Preverjanje odgovora (server/live-check.js): koda vedno, model samo, kjer je potrebno.
      // Ob napaki en kratek »Popravek:«, ki se pripne odgovoru (prikaz in zgodovina).
      const answerModel = result.model || answerModelOf(mode, deep);
      let fix = "";
      if (liveCheckOn() && !cached && result.text && result.stopReason !== "refusal" && !result.toolCalls && !settingsTools.state.used) {
        const plain = stripMeta(result.text);
        const found = codeFindings(plain, pre);
        let issue = found.issue;
        const risky = !!tekTopic || student.settings.track === "COMPETITION" || jeFaks(student.settings) || again;
        if (
          !issue &&
          !image && // pregledovalec slike naloge ne vidi
          !verdictChecked && // sodbo je model že pregledal
          liveReviewOn() &&
          needsReview({ checked: found.checked, model: answerModel, lite, premium, risky, answerLength: plain.length, level: () => usage.budgetState().level, spentToday: () => usage.kindToday("preverjanje") })
        ) {
          try {
            const rv = await reviewAnswer({ question: text, answer: plain, createFn: opts.reviewCreateFn, usage, studentId: student.id });
            extraCost += rv.cost;
            if (rv.reason) issue = `a reviewer reported: ${rv.reason}`;
          } catch (e) {
            if (!controller.signal.aborted) console.warn(`[evklid] sprotni pregled ni uspel: ${e?.message || e}`);
          }
        }
        if (issue && liveFixOn()) {
          try {
            const c = await correction({ streamFn, mode, answer: plain, issue, language: student.settings.language || "sl", signal: controller.signal });
            extraCost += usage.log(student.id, c.model || modeParams(c.mode).model, c.usage || {}, "popravek");
            if (c.block) {
              fix = c.block;
              send("delta", { text: fix });
            }
          } catch (e) {
            if (!controller.signal.aborted) console.warn(`[evklid] popravek ni uspel: ${e?.message || e}`);
          }
        }
      }

      let meta = parseMeta(result.text);
      // Fotografija, ki ni učno gradivo (obraz, oseba, osebni dokument …): inštruktor jo zavrne z flag=photo,
      // slika pa se takoj odstrani iz shranjenega sporočila (j, 2026-10-30).
      if (image && meta?.flag === "photo") store.setMessageContent(userMsgId, withoutImages(userContent, PHOTO_REJECTED_TEXT), 2);
      let display = (note || "") + stripLeadPhrase(stripMeta(result.text)) + fix;
      // V zgodovino shranimo samo besedilo (brez blokov razmišljanja): manj žetonov
      // pri naslednjih klicih in nobenih težav ob krajšanju zgodovine.
      // Popravek preverjanja zamenja konec odgovora: gumbi z izbirami ne veljajo več (ne ob ponovnem odprtju).
      let content = [{ type: "text", text: (fix ? insertFix(stripChoices(result.text), fix) : result.text) || "…" }];
      // Prvi odgovor gre v porabo kot »chat«; ponovni odgovor po napačni sodbi je že zabeležen kot »popravek« (extraCost).
      const cost = (cached ? 0 : usage.log(student.id, first.model || answerModelOf(mode, deep), first.usage, routed.boosted ? "boost" : "chat")) + extraCost;
      // Obvestilo pri 80 % in opomba pri 100 % (inštruktor nadaljuje v hitrem načinu): kot preostale podrobne razlage,
      // nikoli € ali $. Gumb za dokup samo, če ga sme videti (polnoleten imetnik, profil 15+, ena ponudba naenkrat);
      // pri profilu pod 15 let dobi starš e-pošto (billing.allowanceMail).
      let aiOut = false; // ves zajamčeni delež porabljen: brez gumba »Razloži podrobneje« (hitri način)
      if (allowBefore?.guaranteed) {
        const after = usage.allowance(student.id);
        // Z dokupljenim kreditom so podrobne razlage še na voljo (usage.fastOnly), gumb ostane.
        aiOut = usage.fastOnly(student.id);
        if (after.stage !== allowBefore.stage && (after.stage === "low" || after.stage === "out")) {
          send("allowance", { stage: after.stage, percent: after.percent, left: after.explanations_left, pool: after.pool || undefined, buy: !!accounts.topupButton?.(student.id) });
        }
        // E-pošta staršu ob vsakem odgovoru nad mejo (enkrat na mesec za mejo, email_log): mejo lahko prestopi tudi
        // strošek zunaj tega odgovora (preverjanje, skeniranje), zato ne samo ob prehodu v tem odgovoru.
        if (after.stage === "low" || after.stage === "out") {
          accounts.billing?.allowanceMail(student.id, after.stage).catch?.((e) => console.error("[evklid] e-pošta o porabi:", e?.message));
        }
      }
      if (settingsTools.state.proposal) send("proposal", settingsTools.state.proposal);
      if (key && !cached && !fix && !result.toolCalls && !settingsTools.state.used && result.stopReason === "end_turn" && result.text) {
        // Drugim učencem gre odgovor šele po trojnem preverjanju (koda + dva AI pregleda, server/verify.js).
        // null: ime učenca je ostalo v sklonjeni obliki (»Jakobu«), zato se odgovor ne shrani za druge (P3).
        const generic = genericAnswer(result.text, student.name);
        const plain = stripMeta(result.text);
        if (generic !== null && !codeCheck(plain)) {
          const live = verifyLive();
          store.db.prepare("INSERT OR REPLACE INTO answer_cache (key, text, verified) VALUES (?, ?, ?)").run(key, generic, live ? 0 : 1);
          if (live) {
            settleLater(runVerify({ question: text, answer: plain }), (ok, reason) => {
              if (ok) store.db.prepare("UPDATE answer_cache SET verified = 1 WHERE key = ? AND text = ?").run(key, generic);
              else {
                store.db.prepare("DELETE FROM answer_cache WHERE key = ? AND text = ? AND verified = 0").run(key, generic);
                console.warn(`[evklid] odgovor ni shranjen za ponovno uporabo (${String(reason).slice(0, 120)})`);
              }
            });
          }
        }
      }
      if (result.stopReason === "refusal") {
        display = REFUSAL_TEXT;
        content = [{ type: "text", text: REFUSAL_TEXT }];
        meta = { subject: meta?.subject ?? student.settings.subject, topic: null, error: 0, mode: meta?.mode ?? null, flag: "unsafe" };
      }
      if (!display) display = "…";

      const assistantId = store.addMessage(conv.id, "assistant", content, display);
      // Kartice za ponavljanje iz odgovora (ne pri zavrnitvi in ne pri opozorilih).
      // Kartice so vidne šele po trojnem preverjanju; z napačnim računom se sploh ne shranijo.
      const parsedCards = result.stopReason !== "refusal" && !fix && (!meta || meta.flag === "none") ? parseCards(result.text) : [];
      const cardsText = parsedCards.map((c) => `${c.front} → ${c.back}`).join("\n");
      const liveCards = verifyLive();
      const cards =
        parsedCards.length && !codeCheck(cardsText)
          ? store.cards.add(student.id, parsedCards, {
              conversationId: conv.id,
              topicId: conv.path_topic,
              subject: meta?.subject ?? student.settings.subject,
              topic: meta?.topic ?? (conv.path_topic ? getTopic(conv.path_topic)?.name : null),
              verified: !liveCards,
            })
          : [];
      if (cards.length && liveCards) {
        const ids = cards.map((c) => c.id);
        settleLater(runVerify({ question: text, answer: cardsText, kind: "cards" }), (ok, reason) => {
          store.cards.settle(ids, ok);
          if (!ok) console.warn(`[evklid] kartice niso shranjene (${String(reason).slice(0, 120)})`);
        });
      }
      // Nepreverjenih kartic učenec še ne vidi (tudi ne v obvestilu »dodane kartice«).
      if (cards.length && !liveCards) send("cards", { cards: cards.map((c) => ({ id: c.id, front: c.front })), due: store.cards.dueCount(student.id, student.settings.subject || null) });
      if (meta) {
        // Tema učne poti: tema pogovora, sicer ime iz META, preslikano lokalno (šibke točke iz vseh virov).
        const topicId = meta.topic ? (conv.path_topic && getTopic(conv.path_topic) ? conv.path_topic : topicIdFor(student.settings, meta.subject, meta.topic)) : null;
        store.addEvent({ student_id: student.id, conversation_id: conv.id, message_id: assistantId, ...meta, topic_id: topicId });
        if (meta.done && conv.path_topic && progress.markMastered(student.id, conv.path_topic, "chat")) {
          send("mastered", { topic: getTopic(conv.path_topic)?.name, unlocked: knowledge.sync(student.id) });
        }
      } else if (!win) {
        console.warn(`[evklid] odgovor brez META (pogovor ${conv.id})`);
      }
      finished = true;
      send("done", {
        id: assistantId,
        code: messageCode(assistantId),
        text: display,
        state: meta ? { subject: meta.subject, mode: meta.mode } : null,
        title: store.getConversation(conv.id).title,
        // Brez ponovnega gumba »Razloži podrobneje«, tudi če je odgovor pripravil hitri model.
        deep: deep || req.body?.deep === true,
        ai_out: aiOut || undefined,
        settings: settingsTools.state.used || undefined,
        full_offer: (meta?.mode === "A" && meta.flag === "none" && !meta.done && !settingsTools.state.used && fullOffer(conv.id)) || undefined,
        // Gumbi z izbirami (<<IZBIRE [...]>>): učenec tapne, odgovor se pošlje. Ne pri opozorilih in zavrnitvi.
        // Brez gumbov ob predlogu nastavitev: aplikacija pokaže svoj gumb za potrditev.
        choices: choicesOf(result.stopReason !== "refusal" && !fix && !settingsTools.state.proposal && (!meta || meta.flag === "none") ? result.text : ""),
        // Gumbi za orodja aplikacije (<<ODPRI …>>, <<GRAF …>>, <<SKICA …>>; server/odpri.js).
        open: result.stopReason !== "refusal" && !fix && (!meta || meta.flag === "none") ? await openOf(result.text, student) : undefined,
        cost_usd: Math.round(cost * 10000) / 10000,
      });
      res.end();
    } catch (err) {
      finished = true;
      // Neuspelo potezo odstranimo, da zgodovina ostane čista za ponovni poskus.
      store.db.prepare("DELETE FROM messages WHERE id = ?").run(userMsgId);
      if (again) store.db.prepare("UPDATE conversations SET deep = ? WHERE id = ?").run(conv.deep || 0, conv.id);
      if (!controller.signal.aborted) {
        console.error("[evklid] napaka pri klicu modela:", err?.status ?? "", err?.message ?? err);
        if (/dobroimetja/.test(apiErrorCode(err) || "")) usage.markCreditOut();
        send("error", { error: errorText(err) });
      }
      res.end();
    } finally {
      busy.delete(conv.id);
    }
  });

  // --- učne poti ---
  app.get("/api/paths", (req, res) =>
    // Tekmovalne poti so v svojem razdelku (zavihek Tekmovanja), ne na učni poti.
    res.json(
      req.query.program
        ? listProgramPaths(String(req.query.program))
        : listPaths(req.query.subject, String(req.query.system || "SI")).filter((p) => p.school !== "TEK"),
    ),
  );
  app.get("/api/programs", (req, res) => res.json(listPrograms()));
  app.get("/api/students/:id/path", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const key = req.query.key || pathKeyFor(s.settings);
    const view = key && progress.pathView(s.id, key);
    if (!view) return res.json({ key: null, message: "Za to raven še ni učne poti." });
    res.json({ ...view, label: pathLabelFor(key, s.settings.school_system), defaultKey: pathKeyFor(s.settings), xp: progress.xpSummary(s.id) });
  });
  app.get("/api/topic", (req, res) => {
    const t = getTopic(req.query.id);
    if (!t) return res.status(404).json({ error: "Tema ne obstaja." });
    // lang: jezik vmesnika (indijski izpiti imajo imena tem tudi v hindijščini).
    const lang = String(req.query.lang || "");
    const topic = localizeExamTopic({ ...localTopic(t, uiLanguage(lang)), pathLabel: getPath(t.path).label }, taskLanguage(lang));
    // symbols: oznake lekcije, da so črke v razlagi in »Bistvu« klikljive s pomenom iz lekcije.
    res.json({ ...topic, subject: t.subject, explanation: explanationFor(t.id) || lessonExplanation(t.id), symbols: lessonSymbols(t.id) });
  });
  // --- učbenik ---
  const systemOf = (req) => String(req.query.system || "SI");
  app.get("/api/textbook/books", (req, res) => res.json(listBooks({ program: req.query.program ? String(req.query.program) : null, system: systemOf(req) })));
  app.get("/api/textbook/toc", (req, res) => {
    if (req.query.book) {
      const book = bookView(String(req.query.book), systemOf(req));
      return book ? res.json(book) : res.status(404).json({ error: "Učbenik ne obstaja." });
    }
    const toc = tocView(String(req.query.path || ""));
    if (!toc) return res.status(404).json({ error: "Učna pot ne obstaja." });
    res.json(toc);
  });
  // Lekcija brez učenčevih polj (besedilo je za vse): kopija za branje brez povezave (public/sw.js shrani to pot,
  // osebne /api/students/:id/lesson pa ne, P7). Brez interaktivnega dela, ponudb in testa predznanja.
  app.get("/api/lesson", (req, res) => {
    const view = lessonView(String(req.query.id || ""));
    if (!view) return res.status(404).json({ error: "Tema ne obstaja." });
    res.json({ ...view, interactive: false, pretest_due: false, locked: { demo: view.demo?.title || null }, demos: [], demo: null, offline_copy: true });
  });
  // Lekcija za učenca. Interaktivni del (poskusi, simulacije, sprotno preverjanje)
  // je v plačljivem paketu in preizkusu; besedilo je za vse (tudi kot PDF).
  app.get("/api/students/:id/lesson", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const view = lessonView(String(req.query.id || ""));
    if (!view) return res.status(404).json({ error: "Tema ne obstaja." });
    const interactive = !accounts || accounts.lessonInteractive(s.id, view.id);
    // Nova tema z nalogami: na začetku lekcije povabilo na test predznanja.
    const st = progress.state(s.id, view.id);
    const pretest_due = !!view.practice && st.status === "new" && st.pretest == null;
    if (interactive) return res.json({ ...view, interactive: true, pretest_due });
    res.json({
      ...view,
      pretest_due,
      interactive: false,
      // Pravila ponudb (server/placila/ponudbe.js): gumb »Poglej pakete« le, ko ponudba s ceno sme biti prikazana.
      offers: accounts.offersFor(s.id),
      locked: { demo: view.demo?.title || null },
      demos: [],
      demo: null,
    });
  });
  // Referenčni material fakultetnih predmetov (prosto dostopni zunanji viri; za vse, brez stroškov).
  app.get("/api/references", (req, res) => {
    if (req.query.program) {
      const r = programReferences(String(req.query.program));
      return r ? res.json(r) : res.status(404).json({ error: "Študijski program ne obstaja." });
    }
    const key = String(req.query.course || "");
    const p = key.startsWith("UNI-") ? getPath(key) : null;
    if (!p) return res.status(404).json({ error: "Predmet ne obstaja." });
    res.json({ key, label: p.label, themes: themesFor(key), items: referencesFor(key) });
  });
  // Formule in konstante predmeta (za orodja ob kalkulatorju), npr. ?book=KEM-OS
  app.get("/api/formulas", (req, res) => {
    const key = String(req.query.book || "");
    const sheet = /^[A-Z]{3}-(OS|SS|UNI)$/.test(key) ? formulaSheetSections(key) : null;
    if (!sheet) return res.status(404).json({ error: "Zbirke formul ni." });
    res.set("Cache-Control", "public, max-age=3600").json({ key, md: sheet.md, sections: sheet.sections });
  });
  app.get("/api/textbook/search", (req, res) => {
    const subject = /^[A-Z]{2,6}$/.test(req.query.subject || "") ? req.query.subject : undefined;
    res.json(searchTextbook(String(req.query.q || "").slice(0, 100), { subject, system: systemOf(req) }));
  });
  app.post("/api/students/:id/topic-status", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const { topic_id, status } = req.body || {};
    if (!getTopic(topic_id) || !["new", "learning", "mastered"].includes(status)) return res.status(400).json({ error: "Napačni podatki." });
    progress.setStatus(s.id, topic_id, status);
    res.json({ ok: true });
  });

  // --- vadnica ---
  app.post("/api/students/:id/practice/next", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.nextPractice(s.id, req.body?.topic_id);
    if (!out) return res.status(400).json({ error: "Za to temo še ni vaj." });
    res.json(out);
  });
  // Lahki način: paket nalog za vaje brez povezave in kasnejša sinhronizacija odgovorov.
  app.get("/api/students/:id/offline-pack", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const key = getPath(String(req.query.path || "")) ? String(req.query.path) : pathKeyFor(s.settings);
    const pack = key && progress.offlinePack(s.id, key);
    if (!pack) return res.status(404).json({ error: "Za to raven še ni učne poti." });
    res.json({ ...pack, view: { ...pack.view, label: pathLabelFor(key, s.settings.school_system) } });
  });
  app.post("/api/students/:id/offline-sync", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const results = Array.isArray(req.body?.results) ? req.body.results : [];
    res.json({ ...progress.offlineSync(s.id, results), xp: progress.xpSummary(s.id) });
  });
  // Predmet snovi pod gumbi učne poti: predmet izbrane poti (fakulteta: predmet), sicer predmet iz profila.
  const subjectFor = (s, key) => getPath(String(key || ""))?.subject || s.settings.subject || null;
  app.post("/api/students/:id/review", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startReview(s.id, { quick: !!req.body?.quick, subject: subjectFor(s, req.body?.path) });
    if (!out) return res.json({ finished: true, empty: true });
    res.json(out);
  });
  // Načini učenja: nova snov, ponavljanje, priprava na test, dnevni trening.
  app.get("/api/students/:id/modes", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    // Priprava na test sledi najbližjemu testu iz urnika (če je učenec ni nastavil sam).
    syncTestPlan(progress, s.id, scheduleView(schedules.get(s.id), s.settings));
    const key = getPath(String(req.query.path || "")) ? String(req.query.path) : pathKeyFor(s.settings);
    res.json({ ...progress.modes(s.id, key), cardsDue: store.cards.dueCount(s.id, subjectFor(s, key)) });
  });

  // --- kartice za ponavljanje ---
  const cardId = (req) => intParam(req.params.cardId);
  app.get("/api/students/:id/flashcards", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(store.cards.list(s.id, subjectFor(s, req.query.path)));
  });
  app.post("/api/students/:id/flashcards", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const front = typeof req.body?.front === "string" ? req.body.front : "";
    const back = typeof req.body?.back === "string" ? req.body.back : "";
    if (!front.trim() || !back.trim()) return res.status(400).json({ error: "Kartica potrebuje vprašanje in odgovor." });
    const [card] = store.cards.add(s.id, [{ front, back }], { source: "own", subject: subjectFor(s, req.body?.path) });
    if (!card) return res.status(409).json({ error: "Kartico s tem vprašanjem že imaš." });
    res.status(201).json(card);
  });
  app.put("/api/students/:id/flashcards/:cardId", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const r = store.cards.update(s.id, cardId(req), { front: req.body?.front, back: req.body?.back });
    if (!r) return res.status(404).json({ error: "Kartica ne obstaja." });
    if (r.error === "empty") return res.status(400).json({ error: "Kartica potrebuje vprašanje in odgovor." });
    if (r.error === "duplicate") return res.status(409).json({ error: "Kartico s tem vprašanjem že imaš." });
    res.json(r);
  });
  app.delete("/api/students/:id/flashcards/:cardId", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (!store.cards.remove(s.id, cardId(req))) return res.status(404).json({ error: "Kartica ne obstaja." });
    res.json({ ok: true });
  });
  app.post("/api/students/:id/flashcards/:cardId/review", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const before = store.cards.get(s.id, cardId(req));
    const c = store.cards.review(s.id, cardId(req), req.body?.ok === true);
    if (!c) return res.status(404).json({ error: "Kartica ne obstaja." });
    // Šibke točke: »še ne znam« je napaka pri temi kartice (tema poti ali ime iz klepeta, preslikano lokalno).
    // Šteje le prva ocena kartice na dan, napaka pa le pri kartici, ki jo je učenec že znal (nova kartica,
    // ki se je šele uči in se mu v isti seji ponovi, ni šibka točka).
    const ok = req.body?.ok === true;
    if ((ok || before?.box >= 1) && firstTime(store.db, s.id, `C|${c.id}|${new Date().toISOString().slice(0, 10)}`)) {
      const topicId = c.topic_id && getTopic(c.topic_id) ? c.topic_id : topicIdFor(s.settings, c.subject, c.topic);
      recordSkill(store.db, s.id, { source: "cards", topicId, subject: c.subject, topic: c.topic, n: 1, wrong: ok ? 0 : 1 });
    }
    res.json({ card: c, due: store.cards.dueCount(s.id, subjectFor(s, req.body?.path)) });
  });
  app.post("/api/students/:id/daily", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const key = getPath(String(req.body?.path || "")) ? String(req.body.path) : pathKeyFor(s.settings);
    const out = progress.startDaily(s.id, key);
    if (!out) return res.json({ finished: true, empty: true });
    res.json(out);
  });
  app.post("/api/students/:id/unit-practice", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startUnit(s.id, String(req.body?.path || ""), Number(req.body?.unit));
    if (!out) return res.status(400).json({ error: "Ta sklop nima vaj." });
    res.json(out);
  });
  // --- tekmovanja: samo težje naloge v slogu tekmovanj ---
  app.get("/api/students/:id/competition", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const defaultKey = competitionKeyFor(s.settings);
    const key = isCompetitionPath(req.query.key) ? String(req.query.key) : defaultKey;
    if (!key) return res.json({ key: null, message: "Tekmovanja so na voljo za osnovno in srednjo šolo." });
    res.json({
      ...competitionInfo(key),
      ...progress.pathView(s.id, key),
      defaultKey,
      history: progress.contestHistory(s.id, key),
      openContest: progress.openContest(s.id, key),
    });
  });
  // --- priprave na izpite (SAT, gaokao, JEE, NEET, CBSE): trening in poskusni izpit gresta
  // prek /competition-training in /contest (isti mehanizem kot pri tekmovanjih) ---
  app.get("/api/students/:id/exams", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const defaultKey = examKeyFor(s.settings);
    const key = isExamPath(req.query.key) ? String(req.query.key) : examKeyFor(s.settings, String(req.query.exam || "")) || defaultKey;
    if (!key) return res.json({ key: null });
    const lang = taskLanguage(s.settings.language);
    res.json({
      ...examInfo(key, s.settings.school_system, lang),
      ...localizeExamView(progress.pathView(s.id, key), lang),
      defaultKey,
      defaultExam: examOf(defaultKey),
      history: progress.contestHistory(s.id, key),
      openContest: progress.openContest(s.id, key),
      readiness: progress.examReadiness(s.id, key),
    });
  });
  // Pretekle pole NPZ in mature: samo povezave na ric.si (server/exam-papers-si.js), brez besedila pol.
  app.get("/api/exam-papers", (_req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    // ours: naša pola v istem slogu (content/exam-papers, server/our-papers.js) obstaja.
    const ours = ourPaperIds();
    res.json({ source: PAPERS_SOURCE, papers: ours.size ? PAPERS_SI.map((e) => (ours.has(e.id) ? { ...e, ours: true } : e)) : PAPERS_SI });
  });
  // Naša pola (naloge Evklida z zgradbo izvirne pole, z rešitvami in razlagami).
  app.get("/api/exam-papers/ours/:id", (req, res) => {
    const paper = loadOurPaper(req.params.id);
    if (!paper) return res.status(404).json({ error: "Te pole še ni." });
    res.set("Cache-Control", "public, max-age=3600");
    res.json(paper);
  });
  app.post("/api/students/:id/competition-training", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startCompetition(s.id, String(req.body?.path || ""));
    if (!out) return res.status(400).json({ error: "Za to tekmovanje še ni nalog." });
    res.json(out);
  });
  app.post("/api/students/:id/contest", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startContest(s.id, String(req.body?.path || ""));
    if (!out) return res.status(400).json({ error: "Za to tekmovanje še ni nalog." });
    res.json(out);
  });
  app.post("/api/students/:id/contest/finish", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const sess = progress.getSession(String(req.body?.sessionId || ""));
    if (!sess || sess.student_id !== s.id || sess.kind !== "contest") return res.status(404).json({ error: "Tekmovanje ne obstaja." });
    res.json({ contest: progress.finishContest(sess) });
  });

  app.get("/api/students/:id/test-plan", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ plan: progress.testPlan(s.id) });
  });
  app.post("/api/students/:id/test-plan", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const plan = progress.setTestPlan(s.id, String(req.body?.path || ""), req.body?.units, req.body?.date);
    if (!plan) return res.status(400).json({ error: "Izberi vsaj en sklop in datum testa." });
    res.json({ plan });
  });
  app.delete("/api/students/:id/test-plan", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    progress.clearTestPlan(s.id);
    res.json({ ok: true });
  });
  app.post("/api/students/:id/test-prep", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startTest(s.id);
    if (!out) return res.status(400).json({ error: "Najprej nastavi pripravo na test (sklopi z vajami in datum)." });
    res.json(out);
  });
  // Začetni test predznanja teme (ob odprtju nove teme).
  app.post("/api/students/:id/pretest", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json(progress.startPretest(s.id, String(req.body?.topic_id || "")));
  });
  app.post("/api/students/:id/placement", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.startPlacement(s.id, req.body?.path, Number(req.body?.unit));
    if (!out) return res.status(400).json({ error: "Za ta sklop ni preizkusa znanja." });
    res.json(out);
  });
  app.post("/api/students/:id/tasks/:taskId/answer", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.answer(s.id, intParam(req.params.taskId), req.body?.answer);
    if (out.error) return res.status(400).json(out);
    try {
      notePathActivity(store.db, s.id); // merjenje v pilotu: vrnitev na pot po igri (server/games.js)
    } catch {}
    // Nova obvladana tema ali stopnja učnega passa odklene predmete v zbirkah.
    if (out.xp?.gained > 0 || out.placement?.passed || out.mastered) {
      const unlocked = knowledge.sync(s.id);
      if (unlocked.length) out.unlocked = unlocked;
    }
    res.json(out);
  });
  // Postopni namigi pred odgovorom (podatki → formula → prvi korak).
  app.post("/api/students/:id/tasks/:taskId/hint", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.hint(s.id, intParam(req.params.taskId), req.body?.step);
    if (out.error) return res.status(400).json(out);
    res.json(out);
  });
  // Poskusno tekmovanje: preskoči nalogo (0 točk).
  app.post("/api/students/:id/tasks/:taskId/skip", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = progress.skipContestTask(s.id, intParam(req.params.taskId));
    if (out.error) return res.status(400).json(out);
    res.json(out);
  });
  // Branje odgovora, napisanega s prstom/miško. Vrne prepis, ki ga učenec potrdi.
  app.post("/api/students/:id/tasks/:taskId/read", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const t = progress.getTask(intParam(req.params.taskId));
    if (!t || t.student_id !== s.id) return res.status(404).json({ error: "Naloga ne obstaja." });
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(String(req.body?.image || ""));
    if (!m || m[2].length > 2 * 1024 * 1024) return res.status(400).json({ error: "Slika zapisa manjka ali je prevelika." });
    const blocked = usage.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    try {
      const a = t.payload.answer || {};
      const out = await readFn({ imageBase64: m[2], mediaType: m[1], answerType: a.type, unit: a.unit || null });
      if (out.mock) return res.json({ text: null, message: "Branje rokopisa trenutno ne deluje. Odgovor vpiši s tipkami." });
      if (out.usage) usage.log(s.id, out.model, out.usage, "ocr");
      res.json({ text: out.text, message: out.text ? null : "Zapisa nisem uspel prebrati. Poskusi pisati večje ali uporabi tipke." });
    } catch (err) {
      console.error("[evklid] branje rokopisa:", err?.message || err);
      res.status(502).json({ error: errorText(err, "Branje zapisa trenutno ne deluje. Odgovor vpiši s tipkami.") });
    }
  });
  // »Vprašaj Evklida«: odpre pogovor z nalogo in učenčevim odgovorom.
  app.post("/api/students/:id/tasks/:taskId/help", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const t = progress.getTask(intParam(req.params.taskId));
    if (!t || t.student_id !== s.id) return res.status(404).json({ error: "Naloga ne obstaja." });
    const conv = store.createConversation(s.id, { pathTopic: t.topic_id, title: `Naloga: ${getTopic(t.topic_id)?.name ?? "vadnica"}` });
    // kind: brez = pomoč ob napačnem odgovoru; »explain« = razlaga naloge; »review« = pregled rezultata in postopka.
    const kind = ["explain", "review"].includes(req.body?.kind) ? req.body.kind : null;
    const work = typeof req.body?.work === "string" ? req.body.work.trim().slice(0, 2000) : "";
    const workPart = work ? `Moji vmesni koraki:\n${work}\n\n` : "";
    const answerPart = t.last_answer != null ? `Moj odgovor: ${t.last_answer}${t.solved ? " (aplikacija ga je označila kot pravilnega)" : ""}.\n\n` : "Odgovora še nisem oddal.\n\n";
    const text =
      kind === "explain"
        ? `Rešujem nalogo:\n\n${t.payload.text}\n\n${answerPart}${workPart}Razloži mi, kako se reši ta naloga in zakaj, po korakih.`
        : kind === "review"
          ? `Preglej moj rezultat${work ? " in postopek" : ""} pri tej nalogi:\n\n${t.payload.text}\n\n${answerPart}${workPart}Je prav? Če ni, mi pokaži, kje sem se zmotil.`
          : `Rešujem nalogo iz Vadnice:\n\n${t.payload.text}\n\n${workPart}${t.last_answer ? `Moj odgovor je bil: ${t.last_answer}. Ni pravilen.` : "Ne vem, kako začeti."} Mi pomagaš najti, kje se zatakne? Rešitve mi ne povej.`;
    helpTasks.set(conv.id, { text: text.trim().slice(0, MAX_TEXT), task: t, kind });
    if (helpTasks.size > 500) helpTasks.delete(helpTasks.keys().next().value);
    res.json({ conversation: conv, text });
  });

  // --- XP in lestvica ---
  app.get("/api/students/:id/xp", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ ...progress.xpSummary(s.id), leaderboard: progress.leaderboard() });
  });

  // --- tedenske lige, razredi in skupine prijateljev ---
  const avatars = new Avatars(store.db);
  const leagues = mountLeagues(app, store, { loadStudent });
  mountSchools(app, store, { loadStudent, leagues, accounts: !!accounts }); // šole, učitelji, licence, razredne naloge
  mountPilot(app, store, { accounts: !!accounts, isLocalRequest }); // merjenje v pilotu (skrbnik)
  // Rast in vračanje (skrbnik): viri, prva naloga, vrnitev po 1 in 7 dneh; profili skrbnika se ne štejejo.
  const adminEmails = (process.env.EVKLID_ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  mountRast(app, store, { accounts: !!accounts, isLocalRequest, adminEmails });
  mountSchoolOrders(app, store, { accounts: !!accounts, isLocalRequest }); // naročila šol in predračun (skrbnik)
  mountGradiva(app, store, { loadStudent, accounts, leagues }); // povzetek na eni strani, zvočni povzetek, delovni listi
  mountKviz(app, store, { loadStudent, leagues }); // kviz v živo za razred
  mountSkillChecks(app, store, { loadStudent }); // šibke točke: »Preveri se« v učbeniku in naše pole
  mountGraphs(app, store, { loadStudent });
  mountGames(app, store, { loadStudent, progress, avatars, knowledge });
  mountDailyPuzzle(app, store, { loadStudent, leagues, ...(opts.dailyNow ? { now: opts.dailyNow } : {}) }); // dnevna uganka in lestvica po času
  mountLab(app, { loadStudent, accounts }); // virtualni laboratorij: vsi poskusi, zaklep kot v učbeniku
  mountAvatar(app, avatars, { loadStudent, trendsFile: opts.trendsFile ?? null });
  mountKnowledge(app, knowledge, { loadStudent, avatars });
  mountClassShowcase(app, store.db, { loadStudent, leagues, knowledge }); // vitrina v razredu (opt-in, server/vitrina.js)
  mountCorner(app, store, { loadStudent, fetchFn: opts.newsFetch, offline: opts.newsOffline });
  mountSchedule(app, store, { loadStudent, progress, usage, schedules, photoFn: opts.schedulePhotoFn, fetchFn: opts.fetchFn, lookup: opts.lookup, modelCapFor: (id) => accounts?.modelCapFor?.(id) ?? null });
  mountScan(app, { loadStudent, usage, readFn: opts.scanReadFn, solveFn: opts.scanSolveFn });

  // --- poraba AI ---
  // Poraba AI za vse profile: brez računov samo na računalniku, kjer teče strežnik
  // (ne prek povezave za telefon); z računi tudi skrbnik (preveri accounts/index.js).
  app.get("/api/usage", (req, res) => {
    if (!accounts && !isLocalRequest(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const claim = !!accounts && isLocalRequest(req) && !req.parent?.is_admin;
    const sum = usage.summary();
    res.json({ ...sum, can_claim: claim, advice: pricingAdvice(store.db, sum) });
  });
  // Mesečni proračun API: skrbnik nastavi znesek ali doda kupljeni kredit za ta mesec (server/proracun.js).
  // Ni v nastavitvah iz klepeta (finančni podatek, public/settings-registry.js).
  app.post("/api/usage/budget", (req, res) => {
    if (!accounts && !isLocalRequest(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const { base_usd: base, add_usd: add } = req.body || {};
    if (base === undefined && add === undefined) return res.status(400).json({ error: "Manjka znesek." });
    if (base !== undefined && !usage.setBudgetBase(base)) return res.status(400).json({ error: "Napačen znesek." });
    if (add !== undefined && !usage.addBudget(add)) return res.status(400).json({ error: "Napačen znesek." });
    res.json({ ok: true, budget: usage.budgetState() });
  });
  app.get("/api/students/:id/usage", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(usage.studentMonth(s.id));
  });

  // Napačno ali preveliko telo zahteve: kratek odgovor v JSON (odjemalec pokaže sporočilo)
  // namesto strani z napako in celotnega sklada v dnevniku.
  app.use((err, _req, res, next) => {
    // Polna vrsta za preverjanje gesel (server/accounts/auth.js): 503 z besedilom, ne stran z napako.
    if (!res.headersSent && err?.code === "SCRYPT_BUSY") return res.status(503).set("Retry-After", "5").json({ error: err.message });
    if (res.headersSent || !["entity.parse.failed", "entity.too.large"].includes(err?.type)) return next(err);
    res.status(err.status || 400).json({ error: err.type === "entity.too.large" ? "Zahteva je prevelika." : "Zahteva ni v pravilni obliki." });
  });

  // Šifriranje obstoječih vrstic in dnevno čiščenje po rokih hrambe (server/zasebnost.js).
  startPrivacyJobs(store.db, { scheduler: opts.scheduler !== false && opts.privacyJobs !== false });
  backups = startBackups(store.db, store.file, { scheduler: opts.scheduler !== false && opts.backups !== false });
  cloudBackups = startCloudBackups(store.file, { scheduler: opts.scheduler !== false && opts.backups !== false });
  return app;
}
