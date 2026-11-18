// Izbris profilov in računa iz baze: ena pot za DELETE /api/account, prevzem nepotrjenega računa (#747, pregled 2)
// in samodejni izbris nepotrjenih računov (server/zasebnost.js deleteStaleUnverified). Podatki profilov gredo s
// profilom (ON DELETE CASCADE iz students), poraba na omrežju ostane zapisana (guest_spent, server/accounts/guest.js
// snapshotParent), dnevnik dostopov ostane brez povezave na račun. Kliče se znotraj transakcije klicatelja ali
// s transaction: true (BEGIN IMMEDIATE ... COMMIT).
import { detachAudit } from "../dnevnik-dostopov.js";
import { GuestQuota } from "./guest.js";

// Profili računa (vsi). Pred izbrisom zapiše današnja vprašanja in mesečno porabo za omrežje, da izbris profila
// nepotrjenega računa ne da nove brezplačne kvote. Vrne število izbrisanih profilov.
export function eraseProfiles(db, parentId, { guests = null } = {}) {
  (guests || new GuestQuota(db)).snapshotParent(parentId);
  return Number(db.prepare("DELETE FROM students WHERE parent_id = ?").run(parentId).changes);
}

// Ves račun: profili, račun, povezava dnevnika dostopov. before(): dodatni koraki v isti transakciji (pilot).
export function eraseAccount(db, parentId, { guests = null, transaction = false, before = null } = {}) {
  const run = () => {
    before?.();
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
}
