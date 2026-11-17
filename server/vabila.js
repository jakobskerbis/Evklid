// Kode vabila v pilot (j 2026-11-15, 4. korak načrta pilota): stran /vabilo?koda=… (public/vabilo.html).
// Kode so samo v okolju EVKLID_VABILA (ločila vejica, podpičje ali presledek, brez ozira na velike črke), j jih izbere
// sam, ena koda za eno osebo. Koda velja, dokler je na seznamu: brez tabele, brez računa in brez naslova IP v bazi.
// Članstva v pilotu koda (še) ne da: to je e-naslov v EVKLID_PILOT_EMAILS, ki ga po registraciji vpiše j. Samodejno
// članstvo iz kode in »porabljeno« je prošnja drugemu profilu (server/accounts/), GitHub issue #751; tam naj se
// uporabi isInviteCode().
// Odgovor je samo { ok: true, do } ali { ok: false } (do = zadnji dan pilota za besedilo strani). Koda gre v telesu
// POST, ne v poti, da je ni v dnevnikih strežnika in gostovanja; seznama kod ne vrne nobena pot.
import crypto from "node:crypto";
import express from "express";
import { pilotLastDay } from "./accounts/pilot-meja.js";

export const MAX_CODE = 64;
// Krajše kode v EVKLID_VABILA ne veljajo (prelahko jih uganeš); ob zagonu strežnik enkrat opozori, koliko jih je.
export const MIN_CODE = 8;
// Omejitev ugibanja (v pomnilniku, po zagonu prazno): na IP največ PER_IP NAPAČNIH kod v WINDOW_MS (uspešna preverjanja
// se ne štejejo: stran kodo preveri ob vsakem odprtju, razred na istem šolskem omrežju bi sicer zaklenil druge), za vse
// skupaj največ GLOBAL_FAILS napačnih kod na uro (razpršeno ugibanje z več naslovov).
export const LIMITS = { perIp: 10, windowMs: 15 * 60 * 1000, globalFails: 200, globalMs: 60 * 60 * 1000 };

const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
const allCodes = (env) => String(env.EVKLID_VABILA || "").split(/[,;\s]+/).map(norm).filter(Boolean);
export const inviteCodes = (env = process.env) => allCodes(env).filter((c) => c.length >= MIN_CODE && c.length <= MAX_CODE);
// Koliko kod v okolju je prekratkih (opozorilo ob zagonu; kod samih ne izpišemo).
export const shortInviteCodes = (env = process.env) => allCodes(env).filter((c) => c.length < MIN_CODE).length;

const digest = (s) => crypto.createHash("sha256").update(s).digest();

// Ali je koda veljavna (na seznamu EVKLID_VABILA). Primerja z vsemi kodami v enakem času (brez zgodnjega izhoda).
export function isInviteCode(code, env = process.env) {
  const c = norm(code);
  if (c.length < MIN_CODE || c.length > MAX_CODE) return false;
  const want = digest(c);
  let hit = false;
  for (const k of inviteCodes(env)) hit = crypto.timingSafeEqual(digest(k), want) || hit;
  return hit;
}

// Omejevalnik poskusov (izvožen za teste). Šteje samo napačne kode: najprej blocked(ip), ob napačni kodi fail(ip).
export function createInviteLimiter(limits = LIMITS, now = () => Date.now(), log = console) {
  const hits = new Map(); // ip -> časi napačnih kod
  let fails = [];
  let full = false; // skupna meja dosežena (opozorilo v dnevnik enkrat na epizodo)
  const mineOf = (ip, t) => (hits.get(ip) || []).filter((x) => t - x < limits.windowMs);
  return {
    // false = sme poskusiti; "ip" = preveč napačnih kod s tega naslova; "global" = preveč napačnih kod skupaj.
    blocked(ip) {
      const t = now();
      fails = fails.filter((x) => t - x < limits.globalMs);
      if (fails.length < limits.globalFails) full = false;
      if (mineOf(ip, t).length >= limits.perIp) return "ip";
      if (fails.length >= limits.globalFails) return "global";
      return false;
    },
    fail(ip) {
      const t = now();
      const mine = mineOf(ip, t);
      mine.push(t);
      if (hits.size > 10000) hits.clear();
      hits.set(ip, mine);
      fails = fails.filter((x) => t - x < limits.globalMs);
      fails.push(t);
      if (fails.length >= limits.globalFails && !full) {
        full = true;
        log.warn?.(`[vabilo] skupna meja napačnih kod dosežena (${limits.globalFails} v ${Math.round(limits.globalMs / 60000)} min): preverjanje kod je začasno ustavljeno za vse`);
      }
    },
  };
}

// Pot API je javna (brez prijave), zato jo server/app.js namesti PRED preverjanjem prijave (server/accounts/index.js).
export function mountInviteApi(app, { env = process.env, log = console, limiter = createInviteLimiter(LIMITS, undefined, log) } = {}) {
  const short = shortInviteCodes(env);
  if (short) log.warn?.(`[vabilo] EVKLID_VABILA: ${short} kod krajših od ${MIN_CODE} znakov ne velja`);
  // Kot server/sole.js: z računi (Render) req.ip (trust proxy, ki ga nastavi server/accounts/index.js; namestitev
  // pred njimi ne spremeni ničesar, ker Express vrednost prebere ob zahtevi), brez računov glava Cloudflare.
  const ipOf = (req) => String((req.app.get("trust proxy") ? req.ip : req.headers["cf-connecting-ip"] || req.ip) || req.socket?.remoteAddress || "");
  const json = express.json({ limit: "1kb" });
  app.post("/api/vabilo", (req, res, next) => {
    if (req.nekanonicnaApi) return next(); // točka A1 (server/app.js): nekanonična pot dobi 404 spodaj
    json(req, res, (err) => {
      res.set("Cache-Control", "no-store");
      if (err) return res.status(400).json({ ok: false });
      // Neveljaven zahtevek (ni JSON objekt, koda ni besedilo ali je prazna/predolga): 400, ne šteje kot napačna koda.
      const b = req.body;
      const koda = b && typeof b === "object" && !Array.isArray(b) ? b.koda : undefined;
      if (typeof koda !== "string" || !koda.trim() || koda.trim().length > MAX_CODE) return res.status(400).json({ ok: false });
      const ip = ipOf(req);
      const stop = limiter.blocked(ip);
      if (stop === "ip") return res.status(429).json({ ok: false, tooMany: true });
      if (stop === "global") return res.status(429).json({ ok: false, busy: true });
      if (!isInviteCode(koda, env)) {
        limiter.fail(ip);
        return res.json({ ok: false });
      }
      res.json({ ok: true, do: pilotLastDay(env) });
    });
  });
}

// Stran /vabilo (statična public/vabilo.html, prevodi kot placaj.html): pot se prepiše na /vabilo.html, ki jo
// postreže običajni strežnik statičnih datotek (stiskanje, predpomnjenje, skupno geslo kot pri drugih straneh).
export function mountInvitePage(app) {
  app.get("/vabilo", (req, _res, next) => {
    const q = req.url.indexOf("?");
    req.url = "/vabilo.html" + (q >= 0 ? req.url.slice(q) : "");
    next();
  });
}
