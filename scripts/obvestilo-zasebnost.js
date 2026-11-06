// Enkratna e-pošta o spremembi politike zasebnosti (PRIVACY_VERSION) potrjenim naslovom obstoječih računov.
//   node scripts/obvestilo-zasebnost.js               → samo pokaže besedilo in število prejemnikov (nič ne pošlje)
//   node scripts/obvestilo-zasebnost.js --poslji 2026-11-06
//                                                      → pošlje; različica mora biti zapisana izrecno (PRIVACY_VERSION)
// Pošlje se samo računom, ki so politiko sprejeli pred to različico, imajo potrjen e-naslov in niso gostje.
// Vsak račun dobi sporočilo največ enkrat na različico (email_log: kind = 'privacy', period = različica).
// Besedilo potrdi j, preden kdo zažene --poslji (server/accounts/email.js privacyChangeEmail).
import fs from "node:fs";
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { Mailer, privacyChangeEmail } from "../server/accounts/email.js";
import { PRIVACY_VERSION } from "../server/accounts/plans.js";

export function recipients(db, version = PRIVACY_VERSION) {
  return db
    .prepare(
      `SELECT p.id, p.email FROM parents p
       WHERE p.is_guest = 0 AND p.email_verified_at IS NOT NULL AND p.email NOT LIKE '%.invalid'
         AND COALESCE(p.privacy_seen, p.privacy_version, '') < ?
         AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.parent_id = p.id AND l.kind = 'privacy' AND l.period = ? AND l.ok = 1)
       ORDER BY p.id`,
    )
    .all(version, version);
}

export async function sendAll(db, mailer, { version = PRIVACY_VERSION, baseUrl = process.env.EVKLID_BASE_URL || "", pause = 600 } = {}) {
  const msg = privacyChangeEmail(`${baseUrl.replace(/\/$/, "")}/zasebnost.html`);
  let sent = 0;
  let failed = 0;
  for (const r of recipients(db, version)) {
    // Najprej zapis (INSERT OR IGNORE), nato pošiljanje: dva hkratna zagona ne pošljeta dvakrat.
    const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'privacy', ?)").run(r.id, version);
    if (!claim.changes) continue;
    try {
      await mailer.send({ to: r.email, ...msg });
      sent++;
      if (pause) await new Promise((ok) => setTimeout(ok, pause)); // Resend: približno 2 sporočili na sekundo
    } catch {
      db.prepare("DELETE FROM email_log WHERE parent_id = ? AND kind = 'privacy' AND period = ?").run(r.id, version);
      failed++;
    }
  }
  return { sent, failed };
}

const main = async () => {
  const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
  if (!fs.existsSync(file)) return console.log(`Ni baze ${file}.`);
  const db = new DatabaseSync(file);
  const i = process.argv.indexOf("--poslji");
  const n = recipients(db).length;
  const msg = privacyChangeEmail(`${(process.env.EVKLID_BASE_URL || "").replace(/\/$/, "")}/zasebnost.html`);
  if (i < 0) {
    console.log(`Zadeva: ${msg.subject}\n\n${msg.text}\n\nPrejemnikov: ${n}. Nič ni poslano (za pošiljanje: --poslji ${PRIVACY_VERSION}).`);
    return;
  }
  if (process.argv[i + 1] !== PRIVACY_VERSION) {
    console.log(`Za pošiljanje napiši različico izrecno: --poslji ${PRIVACY_VERSION}`);
    process.exitCode = 1;
    return;
  }
  const mailer = new Mailer();
  if (!mailer.enabled) {
    console.log("E-pošta (RESEND_API_KEY) ni nastavljena; nič ni poslano.");
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify(await sendAll(db, mailer)));
};
if (import.meta.url === `file://${process.argv[1]}`) await main();
