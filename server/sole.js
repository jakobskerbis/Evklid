// Stran za šole (/sole) in naročila šolske licence (j, 2026-10-30).
// Šole plačujejo z e-računom prek UJP (javne šole morajo prejeti e-SLOG prek Uprave za javna plačila) na TRR.
// e-SLOG tu NE sestavljamo: e-račun izstavi računovodski program ali ponudnik e-računov, ki ga pošlje v UJP.
// Obrazec zbere natanko podatke, ki jih ta račun potrebuje; skrbnik iz naročila natisne predračun.
// Nikomur ničesar ne pošiljamo po e-pošti (j odloči, kdaj in kako odgovori šoli).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND } from "./brand.js";
import { PLANS, SCHOOL_LICENCE_PRICES, PILOT_SCHOOLS_MAX, PILOT_HOLD_STATUSES, pilotSchoolIds, pilotLicencedTaxIds } from "./schools.js";
import { schoolDailyQuestions } from "./placila/pravice.js";
import { PODARI_MONTHS } from "./placila/podari.js";

export const ORDER_STATUSES = ["new", "contacted", "offer_sent", "won", "lost"];
export const PLAN_LABELS = { class: "Licenca za razrede", school: "Cela šola", pilot: "Pilotna šola" };
export const CONSENT_TEXT = "Strinjam se, da me glede tega naročila ali povpraševanja kontaktirate po e-pošti ali telefonu.";
export const ORDER_LIMITS = { perIpHour: 5, perDay: 100, maxStudents: 5000, maxNote: 1000 };
const PAYMENT_DAYS = 30;

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.join(here, "..", "public", "sole.html");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clean = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max + 1) : "");
const isoDay = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
const eur = (x) => new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(x);
const eurShort = (x) => new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(x);

export function migrateSchoolOrders(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS school_orders (
    id INTEGER PRIMARY KEY,
    school_name TEXT NOT NULL,
    address TEXT NOT NULL,
    registration_no TEXT NOT NULL,          -- matična številka (7 ali 10 števk)
    tax_id TEXT NOT NULL,                   -- davčna številka (8 števk, brez SI)
    budget_user INTEGER NOT NULL DEFAULT 0, -- proračunski uporabnik (javna šola)
    budget_code TEXT,                       -- šifra proračunskega uporabnika (5 števk)
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    plan TEXT NOT NULL,                     -- class | school | pilot
    students INTEGER NOT NULL,
    price_eur REAL NOT NULL,                -- cena na učenca na leto ob naročilu
    start_date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    consent_text TEXT NOT NULL,
    consent_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',     -- new | contacted | offer_sent | won | lost
    admin_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
}

// Pilotna mesta (prvih 10 šol): zasedejo jih šole s pilotno licenco in odprta pilotna naročila (ena šola = ena
// davčna številka). Mesto naročila se sprosti, ko ga skrbnik označi kot »won« ali »lost«, ali ko iz njega nastane
// pilotna licenca (school_licences.order_id): takrat šteje samo licenca, ne še naročilo.
export { PILOT_HOLD_STATUSES };
export function pilotPlaces(db) {
  const licences = pilotSchoolIds(db).length;
  const hasOrders = !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'school_orders'").get();
  const licenced = new Set(pilotLicencedTaxIds(db));
  const orders = hasOrders
    ? db
        .prepare(`SELECT DISTINCT tax_id FROM school_orders WHERE plan = 'pilot' AND status IN (${PILOT_HOLD_STATUSES.map(() => "?").join(", ")})`)
        .all(...PILOT_HOLD_STATUSES)
        .map((r) => r.tax_id)
        .filter((tax) => !licenced.has(tax))
    : [];
  return { max: PILOT_SCHOOLS_MAX, licences, orders, free: Math.max(0, PILOT_SCHOOLS_MAX - licences - orders.length) };
}
// Ali je pilotna cena na voljo za novo naročilo; šola z že odprtim pilotnim naročilom ali s pilotno licenco iz
// naročila (ista davčna) lahko naroči znova, ker ne zasede novega mesta.
export function pilotOpenForOrder(db, taxId = null) {
  const p = pilotPlaces(db);
  return p.free > 0 || (taxId != null && (p.orders.includes(taxId) || pilotLicencedTaxIds(db).includes(taxId)));
}

export const orderNumber = (o) => `${String(o.created_at || "").slice(0, 4) || new Date().getUTCFullYear()}-${String(o.id).padStart(4, "0")}`;

// Preveri obrazec; vrne { error } ali { order } (polja za tabelo).
export function validateOrder(b, now = new Date()) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { error: "Manjkajo podatki obrazca." };
  const text = (k, min, max, label) => {
    const v = clean(b[k], max);
    if (v.length < min) return { error: `Vpišite ${label}.` };
    if (v.length > max) return { error: `${label[0].toUpperCase()}${label.slice(1)}: največ ${max} znakov.` };
    return { v };
  };
  const out = {};
  for (const [k, col, min, max, label] of [
    ["school", "school_name", 2, 150, "ime šole"],
    ["address", "address", 5, 200, "naslov šole"],
    ["contact", "contact_name", 2, 100, "ime kontaktne osebe"],
  ]) {
    const r = text(k, min, max, label);
    if (r.error) return r;
    out[col] = r.v;
  }
  const digits = (v) => (typeof v === "string" || typeof v === "number" ? String(v).replace(/[\s.-]/g, "") : "");
  const reg = digits(b.registrationNo);
  if (!/^(\d{7}|\d{10})$/.test(reg)) return { error: "Matična številka ima 7 ali 10 števk." };
  out.registration_no = reg;
  const tax = digits(b.taxId).replace(/^SI/i, "");
  if (!/^\d{8}$/.test(tax)) return { error: "Davčna številka ima 8 števk (z ali brez SI)." };
  out.tax_id = tax;
  out.budget_user = b.budgetUser === true ? 1 : 0;
  if (b.budgetUser !== true && b.budgetUser !== false && b.budgetUser != null) return { error: "Proračunski uporabnik: da ali ne." };
  if (out.budget_user) {
    const code = digits(b.budgetCode);
    if (!/^\d{5}$/.test(code)) return { error: "Šifra proračunskega uporabnika ima 5 števk." };
    out.budget_code = code;
  } else out.budget_code = null;
  const email = clean(b.email, 200);
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Vpišite veljaven e-naslov." };
  out.email = email;
  const phone = clean(b.phone, 30);
  if (phone && !/^\+?[\d ()/-]{6,30}$/.test(phone)) return { error: "Telefon: samo števke, presledki in + ( ) / -." };
  out.phone = phone;
  if (!PLANS.includes(b.plan)) return { error: "Izberite paket." };
  out.plan = b.plan;
  out.price_eur = SCHOOL_LICENCE_PRICES[b.plan].eur;
  const n = typeof b.students === "number" ? b.students : typeof b.students === "string" && /^\s*\d+\s*$/.test(b.students) ? Number(b.students) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > ORDER_LIMITS.maxStudents) return { error: `Število učencev: 1–${ORDER_LIMITS.maxStudents}.` };
  out.students = n;
  const start = typeof b.startDate === "string" ? b.startDate : "";
  const today = isoDay(now);
  const latest = isoDay(new Date(now).setUTCFullYear(new Date(now).getUTCFullYear() + 2));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || Number.isNaN(Date.parse(`${start}T00:00:00Z`)) || isoDay(`${start}T00:00:00Z`) !== start) return { error: "Vpišite datum začetka." };
  if (start < isoDay(new Date(now).getTime() - 86400000) || start > latest) return { error: "Začetek: od danes do največ dveh let naprej." };
  out.start_date = start;
  if (b.note != null && typeof b.note !== "string") return { error: "Opomba mora biti besedilo." };
  const note = String(b.note || "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim();
  if (note.length > ORDER_LIMITS.maxNote) return { error: `Opomba: največ ${ORDER_LIMITS.maxNote} znakov.` };
  out.note = note;
  if (b.consent !== true) return { error: "Za odgovor potrebujemo vaše soglasje, da vas kontaktiramo." };
  out.consent_text = CONSENT_TEXT;
  out.consent_at = new Date(now).toISOString();
  return { order: out };
}

// Stran /sole: statična datoteka, v katero strežnik vstavi cene in ime aplikacije (eno mesto za cene).
// pilot: ali je pilotna cena še na voljo (prvih 10 šol); ko ni, stran pilotnega paketa ne pokaže.
export function solePage({ pilot = true } = {}) {
  const P = SCHOOL_LICENCE_PRICES;
  const vars = {
    name: BRAND.name,
    "price.class": eurShort(P.class.eur),
    "price.school": eurShort(P.school.eur),
    "price.pilot": eurShort(P.pilot.eur),
    "pilot.years": String(P.pilot.years),
    "pilot.max": String(PILOT_SCHOOLS_MAX),
    "pilot.full": pilot ? "0" : "1",
    "podari.months": String(PODARI_MONTHS),
    dailyQuestions: schoolDailyQuestions() > 0 ? `do ${schoolDailyQuestions()} vprašanj inštruktorju na dan` : "neomejeno število vprašanj inštruktorju",
    consent: CONSENT_TEXT,
    maxStudents: String(ORDER_LIMITS.maxStudents),
    maxNote: String(ORDER_LIMITS.maxNote),
    prices: JSON.stringify(Object.fromEntries(Object.entries(P).map(([k, v]) => [k, v.eur]))),
  };
  return fs.readFileSync(PAGE, "utf8").replace(/\{\{([\w.]+)\}\}/g, (m, k) => (k in vars ? esc(vars[k]) : m));
}

// Stran /sole in /sole.html (pred statičnimi datotekami in za števcem obiskov v pilot.js).
export function mountSolePage(app, store = null) {
  const cached = {};
  app.get(["/sole", "/sole.html"], (_req, res) => {
    // Brez predpomnjenja v razvoju (datoteko lahko urejamo), sicer enkrat na zagon za vsako stanje pilota.
    const pilot = store?.db ? pilotOpenForOrder(store.db) : true;
    const html = cached[pilot] || solePage({ pilot });
    if (process.env.NODE_ENV === "production") cached[pilot] = html;
    res.set("Cache-Control", "no-cache");
    res.type("html").send(html);
  });
}

// Predračun (natisni ali shrani kot PDF). Podatke prodajalca nastavi j v .env; manjkajoči so »[izpolni]«.
// TODO(j): status DDV. Predlog besedila: »cene brez DDV, DDV po veljavni zakonodaji« – potrdi, preden
// predračun pošlješ šoli, in vrstico »DDV« izpolni (ali odstrani, če nisi zavezanec za DDV).
export function predracunHtml(o, now = new Date()) {
  const env = (k) => (process.env[`${BRAND.env}_SELLER_${k}`] || "").trim() || "[izpolni]";
  const number = orderNumber(o);
  const total = Math.round(o.students * o.price_eur * 100) / 100;
  const years = SCHOOL_LICENCE_PRICES[o.plan]?.years || 1;
  const issued = new Date(now).toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" });
  const due = new Date(new Date(now).getTime() + PAYMENT_DAYS * 86400000).toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" });
  const startSl = new Date(`${o.start_date}T12:00:00Z`).toLocaleDateString("sl-SI", { timeZone: "UTC" });
  const row = (k, v) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`;
  const item = `Licenca ${BRAND.name} – ${PLAN_LABELS[o.plan] || o.plan}, 12 mesecev od ${startSl}${years > 1 ? ` (cena velja ${years} leti)` : ""}`;
  return `<!doctype html>
<html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Predračun ${esc(number)}</title>
<style>
  body { font-family: system-ui, sans-serif; color: #111; background: #fff; max-width: 800px; margin: 0 auto; padding: 24px 16px; line-height: 1.45; }
  h1 { font-size: 1.5rem; margin: 0 0 4px; }
  .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 20px 0; }
  .box { border: 1px solid #bbb; border-radius: 8px; padding: 10px 14px; }
  .box h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 6px; color: #444; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; padding: 4px 6px; vertical-align: top; }
  .items th, .items td { border-bottom: 1px solid #ccc; }
  .items td.num, .items th.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .total td { font-weight: 700; border-top: 2px solid #111; }
  .note { font-size: 0.9rem; color: #333; }
  button { padding: 8px 16px; font: inherit; cursor: pointer; }
  @media print { button { display: none; } body { padding: 0; } }
</style></head>
<body>
<button type="button" onclick="window.print()">Natisni ali shrani kot PDF</button>
<h1>Predračun št. ${esc(number)}</h1>
<p>Datum izdaje: ${esc(issued)} · Rok plačila: ${PAYMENT_DAYS} dni (do ${esc(due)})</p>
<div class="cols">
  <div class="box"><h2>Prodajalec</h2><table>
    ${row("Naziv", env("NAME"))}${row("Naslov", env("ADDRESS"))}${row("ID za DDV / davčna št.", env("TAX_ID"))}${row("TRR (IBAN)", env("IBAN"))}
  </table></div>
  <div class="box"><h2>Kupec</h2><table>
    ${row("Šola", o.school_name)}${row("Naslov", o.address)}${row("Matična številka", o.registration_no)}${row("Davčna številka", o.tax_id)}${o.budget_user ? row("Šifra PU", o.budget_code) : ""}${row("Kontakt", `${o.contact_name}, ${o.email}${o.phone ? `, ${o.phone}` : ""}`)}
  </table></div>
</div>
<table class="items">
  <thead><tr><th scope="col">Postavka</th><th scope="col" class="num">Količina</th><th scope="col" class="num">Cena na učenca na leto</th><th scope="col" class="num">Znesek</th></tr></thead>
  <tbody><tr><td>${esc(item)}</td><td class="num">${esc(o.students)} učencev</td><td class="num">${esc(eur(o.price_eur))}</td><td class="num">${esc(eur(total))}</td></tr></tbody>
  <tfoot>
    <tr><td colspan="3">DDV</td><td class="num">[izpolni]</td></tr>
    <tr class="total"><td colspan="3">Skupaj za plačilo</td><td class="num" data-total="${esc(total)}">${esc(eur(total))}</td></tr>
  </tfoot>
</table>
<p>Sklic: <b>SI00 ${esc(number)}</b> · Namen: Licenca ${esc(BRAND.name)}, ${esc(o.school_name)}</p>
<p class="note">To je predračun, ne račun. Končni e-račun (e-SLOG) bo izstavljen iz računovodskega programa oziroma prek ponudnika e-računov in poslan prek UJP (Uprava RS za javna plačila); plačilo na zgornji TRR v ${PAYMENT_DAYS} dneh.</p>
${o.note ? `<p class="note">Opomba šole: ${esc(o.note)}</p>` : ""}
</body></html>`;
}

// Obrazec (javno) in pregled za skrbnika. Dostop do skrbniških poti kot /api/admin/pilot (server/pilot.js).
export function mountSchoolOrders(app, store, { accounts, isLocalRequest }) {
  const db = store.db;
  migrateSchoolOrders(db);
  const hits = new Map(); // ip -> časi sprejetih naročil v zadnji uri (v pomnilniku)
  // Z računi (Render) kot drugod v aplikaciji req.ip (trust proxy 1 v accounts/index.js): glave Cf-Connecting-Ip lahko
  // pošlje vsak in bi z njo obšel omejitev. Brez računov (tunel Cloudflare do tega računalnika) jo nastavi Cloudflare.
  const ipOf = (req) => String((accounts ? req.ip : req.headers["cf-connecting-ip"] || req.ip) || req.socket?.remoteAddress || "");
  const recent = (ip, now) => (hits.get(ip) || []).filter((t) => now - t < 3600000);

  app.post("/api/school-orders", (req, res) => {
    const b = req.body || {};
    const now = Date.now();
    const ip = ipOf(req);
    const mine = recent(ip, now);
    if (mine.length >= ORDER_LIMITS.perIpHour) return res.status(429).json({ error: "Preveč naročil v kratkem času. Poskusite znova čez eno uro." });
    // Past za robote: skrito polje, ki ga človek ne izpolni. Odgovor je enak uspehu, a nič se ne shrani.
    if (typeof b.website === "string" && b.website.trim()) {
      hits.set(ip, [...mine, now]);
      return res.status(201).json({ ok: true });
    }
    const v = validateOrder(b, new Date(now));
    if (v.error) return res.status(400).json({ error: v.error });
    if (db.prepare("SELECT COUNT(*) AS n FROM school_orders WHERE created_at >= datetime('now', '-1 day')").get().n >= ORDER_LIMITS.perDay)
      return res.status(429).json({ error: "Danes je prišlo veliko naročil. Poskusite znova jutri." });
    const o = v.order;
    const cols = Object.keys(o);
    // Pilotno naročilo zasede mesto (pilotPlaces). Preverjanje in vpis sta sinhrona (brez await), zato dve hkratni
    // naročili ne dobita zadnjega mesta obe.
    if (o.plan === "pilot" && !pilotOpenForOrder(db, o.tax_id)) return res.status(409).json({ error: `Pilotna mesta za prvih ${PILOT_SCHOOLS_MAX} šol so zasedena. Izberite drug paket.` });
    const id = Number(db.prepare(`INSERT INTO school_orders (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`).run(...cols.map((k) => o[k])).lastInsertRowid);
    hits.set(ip, [...mine, now]);
    if (hits.size > 10000) hits.clear();
    const row = db.prepare("SELECT id, created_at FROM school_orders WHERE id = ?").get(id);
    res.status(201).json({ ok: true, number: orderNumber(row), total: Math.round(o.students * o.price_eur * 100) / 100 });
  });

  const isAdmin = (req, res) => {
    const ok = accounts ? !!req.parent?.is_admin : isLocalRequest(req);
    if (!ok) res.status(403).json({ error: "Samo za skrbnika." });
    return ok;
  };
  const byId = (req, res) => {
    const id = /^\d{1,9}$/.test(req.params.id) ? Number(req.params.id) : NaN;
    const o = Number.isInteger(id) ? db.prepare("SELECT * FROM school_orders WHERE id = ?").get(id) : null;
    if (!o) res.status(404).json({ error: "Naročilo ne obstaja." });
    return o;
  };
  const view = (o) => ({ ...o, budget_user: !!o.budget_user, number: orderNumber(o), total: Math.round(o.students * o.price_eur * 100) / 100 });

  app.get("/api/admin/school-orders", (req, res) => {
    if (!isAdmin(req, res)) return;
    res.json({ statuses: ORDER_STATUSES, pilot: pilotPlaces(db), orders: db.prepare("SELECT * FROM school_orders ORDER BY id DESC LIMIT 500").all().map(view) });
  });
  app.put("/api/admin/school-orders/:id", (req, res) => {
    if (!isAdmin(req, res)) return;
    const o = byId(req, res);
    if (!o) return;
    const b = req.body || {};
    if (b.status !== undefined && !ORDER_STATUSES.includes(b.status)) return res.status(400).json({ error: `Stanje: ${ORDER_STATUSES.join(", ")}.` });
    if (b.note !== undefined && (typeof b.note !== "string" || b.note.length > ORDER_LIMITS.maxNote)) return res.status(400).json({ error: `Opomba: besedilo do ${ORDER_LIMITS.maxNote} znakov.` });
    // Pilotno naročilo, ki znova postane odprto (npr. iz »lost« nazaj v »contacted«), spet zasede mesto: samo, če je
    // še prosto (prvih 10 šol). Preverjanje in zapis sta sinhrona, kot pri novem naročilu.
    const reopens = o.plan === "pilot" && b.status !== undefined && PILOT_HOLD_STATUSES.includes(b.status) && !PILOT_HOLD_STATUSES.includes(o.status);
    if (reopens && !pilotOpenForOrder(db, o.tax_id)) return res.status(409).json({ error: `Pilotna mesta za prvih ${PILOT_SCHOOLS_MAX} šol so zasedena. Naročila ni mogoče znova odpreti.`, pilot_full: true });
    db.prepare("UPDATE school_orders SET status = ?, admin_note = ?, updated_at = datetime('now') WHERE id = ?").run(
      b.status ?? o.status,
      b.note !== undefined ? b.note.replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim() : o.admin_note,
      o.id,
    );
    res.json(view(db.prepare("SELECT * FROM school_orders WHERE id = ?").get(o.id)));
  });
  app.get("/api/admin/school-orders/:id/predracun", (req, res) => {
    if (!isAdmin(req, res)) return;
    const o = byId(req, res);
    if (!o) return;
    res.set("Cache-Control", "no-store");
    res.type("html").send(predracunHtml(o));
  });
}
