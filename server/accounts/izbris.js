// Izbris profilov in računa iz baze: ena pot za DELETE /api/account, prevzem nepotrjenega računa (#747, pregled 2)
// in samodejni izbris nepotrjenih računov (server/zasebnost.js deleteStaleUnverified). Podatki profilov gredo s
// profilom (ON DELETE CASCADE iz students), poraba na omrežju ostane zapisana (guest_spent, server/accounts/guest.js
// snapshotParent), dnevnik dostopov ostane brez povezave na račun. Kliče se znotraj transakcije klicatelja ali
// s transaction: true (BEGIN IMMEDIATE ... COMMIT).
// Vsak izbris se zapiše še v seznam izbrisov zunaj baze (server/kopije.js dodajIzbrise), da ga ponovitevIzbrisov()
// ob zagonu ponovi, če obnova iz kopije vrne izbrisane vrstice.
import { detachAudit, audit } from "../dnevnik-dostopov.js";
import { GuestQuota } from "./guest.js";
import { dodajIzbrise, beriIzbrise } from "../kopije.js";

const hasTable = (db, t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
// Datoteka baze (prazno za :memory:); seznam izbrisov leži ob njej.
const dbFileOf = (db) => db.prepare("PRAGMA database_list").all().find((d) => d.name === "main")?.file || "";

/** Posnetek za seznam izbrisov: id in created_at računa in njegovih profilov (brez osebnih podatkov). */
export function posnetekIzbrisa(db, { parentId = null, studentIds = null } = {}) {
  const r = parentId != null && hasTable(db, "parents") ? db.prepare("SELECT id, created_at FROM parents WHERE id = ?").get(parentId) : null;
  const s =
    parentId != null
      ? db.prepare("SELECT id, created_at FROM students WHERE parent_id = ?").all(parentId)
      : (studentIds || []).map((id) => db.prepare("SELECT id, created_at FROM students WHERE id = ?").get(id)).filter(Boolean);
  return { at: new Date().toISOString(), r: r ? [r.id, r.created_at] : null, s: s.map((x) => [x.id, x.created_at]) };
}

/** Zapiše posnetek v seznam izbrisov (po COMMIT). Napaka ne ustavi izbrisa, zapiše se v dnevnik strežnika. */
export function zapisiIzbris(db, z, log = console) {
  if (!z || (!z.r && !z.s?.length)) return;
  const file = dbFileOf(db);
  if (!file) return;
  try {
    dodajIzbrise(file, [z]);
  } catch (err) {
    log.error?.(`[evklid] NAPAKA: izbris ni zapisan v seznam izbrisov (obnova iz kopije bi ga vrnila): ${err.message}`);
  }
}

// Profili računa (vsi). Pred izbrisom zapiše današnja vprašanja in mesečno porabo za omrežje, da izbris profila
// nepotrjenega računa ne da nove brezplačne kvote. Vrne število izbrisanih profilov.
export function eraseProfiles(db, parentId, { guests = null } = {}) {
  (guests || new GuestQuota(db)).snapshotParent(parentId);
  return Number(db.prepare("DELETE FROM students WHERE parent_id = ?").run(parentId).changes);
}

// Ves račun: profili, račun, povezava dnevnika dostopov. before(): dodatni koraki v isti transakciji (pilot).
// tombstone: false samo za ponovitev izbrisa po obnovi (zapis že obstaja). Brez transaction: true se zapis v seznam
// izbrisov naredi le, ko klic ni v odprti transakciji (sicer ga mora po COMMIT narediti klicatelj z zapisiIzbris).
export function eraseAccount(db, parentId, { guests = null, transaction = false, before = null, tombstone = true, log = console } = {}) {
  let z = null;
  const run = () => {
    before?.();
    if (tombstone) z = posnetekIzbrisa(db, { parentId });
    eraseProfiles(db, parentId, { guests });
    db.prepare("DELETE FROM parents WHERE id = ?").run(parentId);
  };
  if (!transaction) run();
  else {
    db.exec("BEGIN IMMEDIATE");
    try {
      run();
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }
  detachAudit(db, parentId);
  if (transaction || !db.isTransaction) zapisiIzbris(db, z, log);
}

/**
 * Ob zagonu (server/app.js), preden strežnik sprejme zahteve: izbrisi iz seznama, katerih vrstice so spet v bazi
 * (obnova iz kopije, posnetek diska, --razveljavi), se ponovijo. Vrstica se ujema samo z istim id-jem IN istim
 * created_at, zato nov račun ali profil, ki je dobil ponovno uporabljen id, ostane (tudi z istim e-naslovom).
 * before(id): dodatni koraki izbrisa računa (zaklepi pilota). Vrne { racuni, profili }.
 */
export function ponovitevIzbrisov(db, dbFile, { guests = null, before = null, log = console } = {}) {
  const out = { racuni: 0, profili: 0 };
  let list;
  try {
    list = beriIzbrise(dbFile);
  } catch (err) {
    log.error?.(`[evklid] NAPAKA: seznama izbrisov ni mogoče prebrati (${err.message}); izbrisi po obnovi niso ponovljeni`);
    return out;
  }
  if (!list.length || !hasTable(db, "students")) return out;
  const racuni = hasTable(db, "parents");
  for (const z of list) {
    // Napaka pri enem zapisu ne ustavi zagona strežnika in ne preskoči ostalih; javi se v dnevnik.
    try {
      if (z.r && racuni && db.prepare("SELECT 1 FROM parents WHERE id = ? AND created_at = ?").get(z.r[0], z.r[1])) {
        eraseAccount(db, z.r[0], { guests, transaction: true, tombstone: false, before: before ? () => before(z.r[0]) : null });
        out.racuni++;
      }
      // Profili posebej: profil je lahko medtem prešel k drugemu računu (gost → račun) ali pa je bil izbrisan sam.
      for (const [id, c] of z.s || []) out.profili += Number(db.prepare("DELETE FROM students WHERE id = ? AND created_at = ?").run(id, c).changes);
    } catch (err) {
      log.error?.(`[evklid] NAPAKA: izbrisa iz seznama izbrisov ni bilo mogoče ponoviti: ${err.message}`);
    }
  }
  if (out.racuni || out.profili) {
    log.info?.(`[evklid] po obnovi znova izbrisano: ${out.racuni} računov, ${out.profili} profilov (seznam izbrisov)`);
    audit(db, { actor: "system", action: "erase_reapplied", target: `r:${out.racuni},s:${out.profili}` });
  }
  return out;
}
