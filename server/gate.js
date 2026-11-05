// Zaščita testne različice z enim skupnim geslom (EVKLID_PASSWORD).
// Namesto okna brskalnika (HTTP Basic) pokažemo stran za prijavo in si geslo
// zapomnimo v piškotku, ki deluje tudi v aplikaciji na začetnem zaslonu telefona.
// Povezava ".../?geslo=..." prijavi takoj (za prijatelje, ki preizkušajo).
import "./env.js";
import { BRAND, LEGACY } from "./brand.js";
import crypto from "node:crypto";
import express from "express";

const COOKIE = `${BRAND.slug}_geslo`;
// Piškotki iz časa prejšnjih imen (brand.json → legacy) še veljajo; ob naslednjem obisku jih zamenja nov.
const LEGACY_COOKIES = LEGACY.map((l) => ({ name: `${l.slug}_geslo`, salt: `${l.slug}-gate-v1` }));
const YEAR = 365 * 24 * 3600;
// Brez gesla: zdravje strežnika, ikone in opis spletne aplikacije (telefon jih
// prebere za bližnjico na začetnem zaslonu, preden je uporabnik prijavljen).
// /api/kozmetika/export in /api/prijave/izvoz, /api/prijave/:vrsta/:id/stanje imajo svoj ključ (server/izvozni-kljuc.js).
const PUBLIC = [/^\/healthz$/, /^\/api\/kozmetika\/export$/, /^\/api\/prijave\/(izvoz|[a-z]+\/\d+\/stanje)$/, /^\/manifest\.webmanifest$/, /^\/icons\/[\w.-]+\.png$/, /^\/favicon\.ico$/, /^\/\.well-known\/assetlinks\.json$/];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function safeNext(v) {
  const s = typeof v === "string" ? v : "/";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/";
}

function loginPage({ next = "/", error = "" } = {}) {
  return `<!doctype html>
<html lang="sl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Evklid – prijava</title>
<meta name="theme-color" content="#2563eb">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" href="/icons/icon-192.png?v=kristal">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=kristal">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Evklid">
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    background: linear-gradient(180deg, #22b8f0, #2563eb); color: #0f172a; padding: 16px; box-sizing: border-box; }
  .card { box-sizing: border-box; background: #fff; border-radius: 20px; padding: 28px 24px; width: 100%; max-width: 360px; box-shadow: 0 20px 50px rgba(15,23,42,.25); text-align: center; }
  img { width: 72px; height: 72px; border-radius: 18px; }
  h1 { font-size: 1.5rem; margin: 12px 0 4px; }
  p { color: #475569; margin: 0 0 18px; line-height: 1.4; }
  input { width: 100%; box-sizing: border-box; font-size: 1.1rem; padding: 12px 14px; border: 2px solid #cbd5e1; border-radius: 12px; }
  input:focus { outline: none; border-color: #2563eb; }
  button { width: 100%; margin-top: 12px; font-size: 1.1rem; font-weight: 700; padding: 12px; border: 0; border-radius: 12px; background: #2563eb; color: #fff; }
  .err { color: #b91c1c; font-weight: 600; margin: 0 0 12px; }
  .tip { font-size: .9rem; margin: 18px 0 0; }
</style>
</head><body>
<form class="card" method="post" action="/prijava">
  <img src="/icons/icon-192.png" alt="">
  <h1>Evklid</h1>
  <p>Testna različica. Vpiši geslo za preizkus.</p>
  ${error ? `<p class="err" role="alert">${esc(error)}</p>` : ""}
  <input type="password" name="geslo" placeholder="Geslo" autocomplete="current-password" autofocus required>
  <input type="hidden" name="naprej" value="${esc(next)}">
  <button type="submit">Vstopi</button>
  <p class="tip">Namig: po prijavi v meniju brskalnika izberi »Dodaj na začetni zaslon«, da bo Evklid na telefonu kot aplikacija.</p>
</form>
</body></html>`;
}

// Skupno geslo velja samo brez računov. Z računi (EVKLID_ACCOUNTS=1) je vstop prijava v račun:
// kdor ni prijavljen, vidi stran za prijavo (j, 2026-10-30: »Brez skupnega gesla«).
// EVKLID_GATE=1 skupno geslo obdrži tudi z računi.
export function gateNeeded(env = process.env) {
  if (!env.EVKLID_PASSWORD) return false;
  return env.EVKLID_ACCOUNTS !== "1" || env.EVKLID_GATE === "1";
}

export function passwordGate(password) {
  const expected = Buffer.from(password);
  const token = crypto.createHmac("sha256", password).update(`${BRAND.slug}-gate-v1`).digest("hex");
  const legacyTokens = LEGACY_COOKIES.map((c) => ({ ...c, token: crypto.createHmac("sha256", password).update(c.salt).digest("hex") }));
  const fails = new Map(); // ip -> { n, until }
  const matches = (value) => {
    const b = Buffer.from(String(value ?? ""));
    return b.length === expected.length && crypto.timingSafeEqual(b, expected);
  };
  const clientIp = (req) => String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "";
  const blocked = (req) => {
    const f = fails.get(clientIp(req));
    return f && f.n >= 20 && f.until > Date.now();
  };
  const fail = (req) => {
    const ip = clientIp(req);
    const f = fails.get(ip);
    const now = Date.now();
    if (!f || f.until < now) fails.set(ip, { n: 1, until: now + 15 * 60 * 1000 });
    else f.n++;
  };
  const cookieMatches = (req, name, want) => {
    const m = String(req.headers.cookie || "").match(new RegExp(`(?:^|;\\s*)${name}=([a-f0-9]{64})`));
    return !!m && crypto.timingSafeEqual(Buffer.from(m[1]), Buffer.from(want));
  };
  const hasCookie = (req) => cookieMatches(req, COOKIE, token);
  const hasLegacyCookie = (req) => legacyTokens.some((c) => cookieMatches(req, c.name, c.token));
  const hasBasic = (req) => {
    const [scheme, b64] = String(req.headers.authorization || "").split(" ");
    if (!/^basic$/i.test(scheme || "")) return false;
    return matches(Buffer.from(b64 || "", "base64").toString().split(":").slice(1).join(":"));
  };
  const setCookie = (req, res) => {
    const secure = req.secure || req.headers["x-forwarded-proto"] === "https";
    res.append("Set-Cookie", `${COOKIE}=${token}; Path=/; Max-Age=${YEAR}; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`);
  };
  const wantsPage = (req) => req.method === "GET" && !req.path.startsWith("/api/") && /text\/html/.test(req.headers.accept || "");
  const showLogin = (req, res, status, error) =>
    res.status(status).type("html").set("Cache-Control", "no-store").send(loginPage({ next: safeNext(req.originalUrl), error }));

  const form = express.urlencoded({ extended: false, limit: "4kb" });
  return (req, res, next) => {
    if (req.path === "/prijava") {
      if (req.method !== "POST") return res.redirect(303, "/");
      return form(req, res, () => {
        const nextUrl = safeNext(req.body?.naprej);
        if (blocked(req)) return res.status(429).type("html").send(loginPage({ next: nextUrl, error: "Preveč napačnih poskusov. Poskusi čez 15 minut." }));
        if (!matches(req.body?.geslo)) {
          fail(req);
          return res.status(401).type("html").send(loginPage({ next: nextUrl, error: "Napačno geslo. Poskusi znova." }));
        }
        setCookie(req, res);
        res.redirect(303, nextUrl);
      });
    }
    // Povezava za prijatelje: /?geslo=... prijavi in odstrani geslo iz naslova.
    if (typeof req.query?.geslo === "string") {
      const url = new URL(req.originalUrl, "http://x");
      url.searchParams.delete("geslo");
      const clean = url.pathname + url.search;
      if (!blocked(req) && matches(req.query.geslo)) {
        setCookie(req, res);
        return res.redirect(303, clean);
      }
      fail(req);
      req.originalUrl = clean;
      return showLogin(req, res, 401, "Geslo v povezavi ne velja. Vpiši ga.");
    }
    if (PUBLIC.some((re) => re.test(req.path))) return next();
    if (hasCookie(req)) return next();
    if (hasLegacyCookie(req)) { setCookie(req, res); return next(); }
    if (hasBasic(req)) { setCookie(req, res); return next(); }
    if (wantsPage(req)) return showLogin(req, res, 401);
    res.status(401).json({ error: "Potrebna je prijava. Osveži stran in vpiši geslo." });
  };
}
