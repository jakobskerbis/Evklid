// Stran /pogoji.html glede na EVKLID_POGOJI_OBJAVLJENI (server/accounts/potrdilo.js termsPublished).
// V datoteki je besedilo z oznakami osnutka (<!-- osnutek --> … <!-- /osnutek -->): pasica »pogoji so v pripravi«,
// noindex in opomba ob različici. Privzeto (pogoji niso objavljeni) gre stran ven taka, kot je; ko j in pravnik
// potrdita besedilo in je zastavica 1, strežnik oznake osnutka odstrani. Brez JavaScripta, zato velja tudi brez skript.
import fs from "node:fs";
import path from "node:path";
import { termsPublished } from "./accounts/potrdilo.js";

export const DRAFT_RE = /<!-- osnutek -->[\s\S]*?<!-- \/osnutek -->\s*/g;
export const publishedHtml = (html) => String(html).replace(DRAFT_RE, "");

// V produkciji stran preberemo enkrat (sprememba velja po ponovnem zagonu, kot server/mobile/trgovina.js), v razvoju ob vsaki zahtevi.
export function pogojiStran(publicDir, { cache = process.env.NODE_ENV === "production" } = {}) {
  const file = path.join(publicDir, "pogoji.html");
  let kept = null;
  const read = () => {
    if (cache && kept != null) return kept;
    const html = fs.readFileSync(file, "utf8");
    if (cache) kept = html;
    return html;
  };
  return (req, res, next) => {
    if (!termsPublished()) return next(); // osnutek: statična datoteka, kot je
    try {
      res.set("Cache-Control", "no-cache").type("html").send(publishedHtml(read()));
    } catch (err) {
      next(err);
    }
  };
}
