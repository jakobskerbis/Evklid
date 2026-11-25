// Načrt testa v pripravi (docs/priprava.md, PR 2b): nekdanja tabela test_plans je zdaj priprava z oznako aktivna.
// Nadomesti SQL za test_plans v server/progress.js (testPlan, setTestPlan, clearTestPlan); vmesnik ostaja isti, zato
// /test-plan, /test-prep, Urnik (server/schedule.js syncTestPlan) in ustno spraševanje delajo kot prej.
// - Na profil je največ ena aktivna priprava (delni enolični indeks v shema.js); to je »Priprava na test« v Vadnici.
// - Isti test (isti dogodek iz urnika, ista pot z istim datumom ali premaknjen datum še prihajajočega testa) posodobi
//   isto pripravo, da viri ostanejo pri njem.
// - Drug test: nova priprava postane aktivna. Prejšnja brez virov se izbriše (kot prej prepis vrstice v test_plans),
//   prejšnja z viri ostane (neaktivna) do samodejnega izbrisa 30 dni po testu (ciscenje.js).
// - Odstranitev načrta: priprava brez virov se izbriše, z viri samo ni več aktivna (učenčevo gradivo ostane).
import { seal } from "../crypto-polje.js";
import { NAJVEC_PRIPRAV, zVarnimBrisanjem } from "./shramba.js";

const NASLOV_MAX = 120;
const sqlCas = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);

export const aktivnaPriprava = (db, studentId) => db.prepare("SELECT * FROM priprave WHERE student_id = ? AND aktivna = 1").get(studentId) || null;

const steviloVirov = (db, id) => db.prepare("SELECT COUNT(*) AS n FROM priprava_viri WHERE priprava_id = ?").get(id).n;

function odstrani(db, p) {
  if (steviloVirov(db, p.id)) db.prepare("UPDATE priprave SET aktivna = 0 WHERE id = ?").run(p.id);
  else zVarnimBrisanjem(db, () => db.prepare("DELETE FROM priprave WHERE id = ?").run(p.id));
}

/**
 * Nastavi načrt testa (že preverjene vrednosti iz progress.setTestPlan). Vrne id aktivne priprave.
 * { pot, sklopi: [indeksi], datum: YYYY-MM-DD, dogodek: id dogodka iz urnika ali null, naslov, predmet, now }
 */
export function nastaviTest(db, studentId, { pot, sklopi, datum, dogodek = null, naslov, predmet = null, now = Date.now() }) {
  const t = sqlCas(now);
  if (predmet !== null && !/^[A-Z]{2,6}$/.test(String(predmet))) predmet = null; // kot pri POST /priprave
  const json = JSON.stringify(sklopi);
  const cur = aktivnaPriprava(db, studentId);
  // Isti test: isti dogodek iz urnika; ali ista pot in isti datum; ali ista pot, ko stari test še ni mimo (premaknjen
  // datum), razen če gre za dva različna dogodka iz urnika.
  const drugDogodek = !!(dogodek && cur?.dogodek_id && cur.dogodek_id !== dogodek);
  const istiTest =
    !!cur && ((!!dogodek && cur.dogodek_id === dogodek) || (cur.pot === pot && (cur.datum_testa === datum || (!drugDogodek && cur.datum_testa >= sqlCas(now).slice(0, 10)))));
  // Pri 20 pripravah (meja na profil) se novega testa ne doda: aktivna priprava se posodobi na mestu.
  const polno = cur && !istiTest && db.prepare("SELECT COUNT(*) AS n FROM priprave WHERE student_id = ?").get(studentId).n >= NAJVEC_PRIPRAV && steviloVirov(db, cur.id) > 0;
  if (cur && (istiTest || polno)) {
    db.prepare("UPDATE priprave SET pot = ?, sklopi = ?, datum_testa = ?, dogodek_id = ?, predmet = COALESCE(?, predmet), zadnja_uporaba = ? WHERE id = ?").run(
      pot, json, datum, dogodek, predmet, t, cur.id,
    );
    return cur.id;
  }
  if (cur) odstrani(db, cur);
  const ime = String(naslov || "").trim().slice(0, NASLOV_MAX) || "Priprava na test";
  return Number(
    db
      .prepare(
        `INSERT INTO priprave (student_id, naslov, predmet, datum_testa, zadnja_uporaba, created_at, pot, sklopi, dogodek_id, aktivna)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      )
      .run(studentId, seal(ime), predmet, datum, t, t, pot, json, dogodek).lastInsertRowid,
  );
}

// Odstrani načrt testa (DELETE /test-plan, izbrisan test v urniku).
export function odstraniTest(db, studentId) {
  const cur = aktivnaPriprava(db, studentId);
  if (cur) odstrani(db, cur);
}
