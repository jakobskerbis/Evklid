// Kratke povezave na javne strani in prijazna stran 404 (pregled celotne aplikacije, 17. 11. 2026).
// - /pogoji, /zasebnost, /starsi, /garancija, /odstop: preusmeritev na .html (poizvedba, npr. ?vir=…, ostane), tako da
//   števec obiskov (pilot.js, rast.js) šteje isto stran kot prej. /sole ima svojo pot (server/sole.js).
// - Neznana pot: stran v slogu aplikacije namesto Expressovega »Cannot GET«; /api dobi JSON, drugo kratko besedilo.
import { BRAND } from "./brand.js";

// - /sole.html → /sole (pregled javnih strani 21. 11. 2026, P8): ista stran na dveh naslovih je razpolovila uvrstitev pri
//   iskalnikih. Preusmeritev je pred števcem obiskov, zato se obisk šteje enkrat (na /sole).
export const KRATKE_POTI = { "/pogoji": "/pogoji.html", "/zasebnost": "/zasebnost.html", "/starsi": "/starsi.html", "/garancija": "/garancija.html", "/odstop": "/odstop.html", "/sole.html": "/sole" };

// Naslovi, ki jih kdo nareka ali napiše v opis profila (»evklid.app/prijava«), vodijo na del strani (P8). 302, ne 301:
// cilj je sidro, ki se lahko spremeni, brskalnik pa 301 hrani brez roka. Samo GET: POST /prijava ostane vratom z geslom
// (server/gate.js), ki so pred temi potmi in GET /prijava tam preusmerijo na začetek.
export const KRATKA_SIDRA = { "/prijava": "/#prijava", "/registracija": "/#registracija", "/cenik": "/o-evklidu#cene", "/cene": "/o-evklidu#cene" };

export function mountShortLinks(app) {
  app.get([...Object.keys(KRATKE_POTI), ...Object.keys(KRATKA_SIDRA)], (req, res, next) => {
    // Usmerjevalnik ne loči velikih črk in sprejme poševnico na koncu: preusmerimo samo točno pot.
    const q = req.originalUrl.indexOf("?");
    const query = q >= 0 ? req.originalUrl.slice(q) : "";
    const cilj = KRATKE_POTI[req.path];
    if (cilj) return res.redirect(301, cilj + query);
    const sidro = KRATKA_SIDRA[req.path];
    if (!sidro) return next();
    // Poizvedba (npr. ?vir=…) gre pred sidro: /cene?vir=ig → /o-evklidu?vir=ig#cene.
    const [pot, del] = sidro.split("#");
    res.redirect(302, `${pot}${query}#${del}`);
  });
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function notFoundPage() {
  const name = esc(BRAND.name);
  return `<!doctype html>
<html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Strani ni · ${name}</title><link rel="icon" type="image/svg+xml" href="/icons/favicon.svg?v=kristal">
<style>
:root{--bg:#F6F7F9;--surface:#fff;--text:#0f172a;--muted:#5b6474;--accent:#2353D1;--accent-text:#fff;--border:#e3e7ee}
@media (prefers-color-scheme:dark){:root{--bg:#0D1117;--surface:#161b22;--text:#e6edf3;--muted:#9aa4b2;--accent:#6E9BFF;--accent-text:#0D1117;--border:#30363d}}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:520px;margin:0 auto;padding:48px 16px}
section{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;text-align:center}
img{width:56px;height:56px}h1{font-size:24px;margin:12px 0 8px}p{margin:0 0 8px}.muted{color:var(--muted);font-size:14px}
.btn{display:inline-block;background:var(--accent);color:var(--accent-text);font-weight:700;text-decoration:none;border-radius:10px;padding:12px 20px;margin-top:12px}
</style></head><body><main><section>
<img src="/icons/favicon.svg?v=kristal" alt="">
<h1>Te strani ni</h1>
<p>Povezava je morda zastarela ali napačno prepisana.</p>
<p class="muted" lang="en">This page does not exist.</p>
<a class="btn" href="/">Na začetek – ${name}</a>
</section></main></body></html>`;
}

// Zadnji vmesnik v createApp (za vsemi potmi).
export function notFound(req, res) {
  if (/^\/api(\/|$)/i.test(req.path)) return res.status(404).json({ error: "Pot ne obstaja." });
  if ((req.method === "GET" || req.method === "HEAD") && req.accepts(["html", "json", "text"]) === "html") {
    return res.status(404).set("Cache-Control", "no-cache").type("html").send(notFoundPage());
  }
  res.status(404).type("text").send("Ta stran ne obstaja.");
}
