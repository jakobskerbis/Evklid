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
// Omejitev ugibanja (v pomnilniku, po zagonu prazno): na IP največ PER_IP poskusov v WINDOW_MS, za vse skupaj največ
// GLOBAL_FAILS napačnih kod na uro (razpršeno ugibanje z več naslovov).
export const LIMITS = { perIp: 10, windowMs: 15 * 60 * 1000, globalFails: 200, globalMs: 60 * 60 * 1000 };

const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
export const inviteCodes = (env = process.env) =>
  String(env.EVKLID_VABILA || "")
    .split(/[,;\s]+/)
    .map(norm)
    .filter((c) => c && c.length <= MAX_CODE);

const digest = (s) => crypto.createHash("sha256").update(s).digest();

// Ali je koda veljavna (na seznamu EVKLID_VABILA). Primerja z vsemi kodami v enakem času (brez zgodnjega izhoda).
export function isInviteCode(code, env = process.env) {
  const c = norm(code);
  if (!c || c.length > MAX_CODE) return false;
  const want = digest(c);
  let hit = false;
  for (const k of inviteCodes(env)) hit = crypto.timingSafeEqual(digest(k), want) || hit;
  return hit;
}

// Omejevalnik poskusov (izvožen za teste).
export function createInviteLimiter(limits = LIMITS, now = () => Date.now()) {
  const hits = new Map(); // ip -> časi poskusov
  let fails = [];
  return {
    // false = preveč poskusov (odgovor 429), sicer se poskus zapiše.
    take(ip) {
      const t = now();
      const mine = (hits.get(ip) || []).filter((x) => t - x < limits.windowMs);
      fails = fails.filter((x) => t - x < limits.globalMs);
      if (mine.length >= limits.perIp || fails.length >= limits.globalFails) return false;
      mine.push(t);
      if (hits.size > 10000) hits.clear();
      hits.set(ip, mine);
      return true;
    },
    fail() {
      fails.push(now());
    },
  };
}

// Pot API je javna (brez prijave), zato jo server/app.js namesti PRED preverjanjem prijave (server/accounts/index.js).
export function mountInviteApi(app, { env = process.env, limiter = createInviteLimiter() } = {}) {
  // Kot server/sole.js: z računi (Render) req.ip (trust proxy, ki ga nastavi server/accounts/index.js; namestitev
  // pred njimi ne spremeni ničesar, ker Express vrednost prebere ob zahtevi), brez računov glava Cloudflare.
  const ipOf = (req) => String((req.app.get("trust proxy") ? req.ip : req.headers["cf-connecting-ip"] || req.ip) || req.socket?.remoteAddress || "");
  const json = express.json({ limit: "1kb" });
  app.post("/api/vabilo", (req, res, next) => {
    if (req.nekanonicnaApi) return next(); // točka A1 (server/app.js): nekanonična pot dobi 404 spodaj
    json(req, res, (err) => {
      res.set("Cache-Control", "no-store");
      if (err) return res.status(400).json({ ok: false });
      if (!limiter.take(ipOf(req))) return res.status(429).json({ ok: false, tooMany: true });
      if (!isInviteCode(req.body?.koda, env)) {
        limiter.fail();
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
