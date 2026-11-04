// Aplikacija pokaže pravo spletno stran (j, 2026-11-04: »Splet znotraj aplikacije«, da sta splet in aplikacija
// vedno enaka). WebView v aplikaciji (mobile/src/app/web.tsx) najprej odpre GET /api/mobile/web z glavami
// aplikacije (X-App-Client, Authorization: Bearer <seja>, X-App-Device). Strežnik isto sejo zapiše v piškotek
// WebView-a in preusmeri na spletno stran, ki je nato prijavljena kot v brskalniku. Seja ostane ena: odjava na
// spletu odjavi tudi aplikacijo.
// Varnost: deluje samo z glavo X-App-Client (brskalnik z druge strani je brez CORS ne more poslati) in samo z
// veljavno sejo računa; cilj je vedno pot na tem strežniku.
import { readCookie, COOKIE } from "../accounts/auth.js";
import { DEVICE_COOKIE } from "../accounts/devices.js";

const SESSION_MAX_AGE = 365 * 86400; // kot SESSION_DAYS v server/accounts/auth.js
const DEVICE_MAX_AGE = 2 * 365 * 86400; // kot v server/accounts/devices.js
const TOKEN = /^[A-Za-z0-9_-]{20,200}$/;

// Samo pot na tem strežniku (ne »//drug.si« in ne »/\drug.si«).
export function safeTarget(to) {
  const s = typeof to === "string" ? to : "";
  return /^\/(?![/\\])[^\s]*$/.test(s) && s.length <= 500 ? s : "/";
}

export function mountWebSession(app, ctx) {
  const { sessions } = ctx;
  app.get("/api/mobile/web", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!req.get("x-app-client")) return res.status(400).json({ error: "Samo za aplikacijo." });
    const token = readCookie(req, COOKIE);
    if (!token || !sessions.parentId(token)) return res.status(401).json({ error: "Potrebna je prijava." });
    const secure = req.secure ? "; Secure" : "";
    const cookies = [`${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure}`];
    const device = readCookie(req, DEVICE_COOKIE);
    if (device && TOKEN.test(device)) cookies.push(`${DEVICE_COOKIE}=${device}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DEVICE_MAX_AGE}${secure}`);
    // setHeader, ne append: mobileClient (server/mobile/index.js) piškotek seje pri append prestavi v glavo.
    res.setHeader("Set-Cookie", cookies);
    res.redirect(302, safeTarget(req.query.to));
  });
}
