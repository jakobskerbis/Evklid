// Tabele priprave na test iz zapiskov (docs/priprava.md, PR 2a in 2b). Kliče jih server/db.js ob vsakem odprtju baze
// (CREATE ... IF NOT EXISTS, zato varno na obstoječi bazi). PR 2b: nekdanja tabela test_plans (en načrt testa na
// profil) je preseljena v priprave (stolpci pot, sklopi, dogodek_id, aktivna; server/priprava/aktivna.js) in
// izbrisana; /test-plan in /test-prep ostaneta kot ovoj.
// - Vse vrstice gredo s profilom (ON DELETE CASCADE iz students) in s pripravo (iz priprave).
// - naslov in ime datoteke sta šifrirana s seal() (crypto-polje.js SEALED); izvirnik je binarno šifriran
//   (sealBytes) v ločeni tabeli brez stolpca profila: zato ne gre v izvoz (server/zasebnost.js exportOtherTables
//   išče tabele po student_id) in se pobriše iz vsake varnostne kopije (server/kopije.js withoutPilotPhotos).
// - Samodejni izbris (server/priprava/ciscenje.js): 30 dni po datum_testa, brez datuma 30 dni po zadnja_uporaba.
import { seal } from "../crypto-polje.js";

export function migratePriprava(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS priprave (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      naslov TEXT NOT NULL,                      -- šifrirano
      predmet TEXT,                              -- koda predmeta (MAT, FIZ …), neobvezno
      datum_testa TEXT,                          -- YYYY-MM-DD; izbris 30 dni po njem
      zadnja_uporaba TEXT NOT NULL DEFAULT (datetime('now')), -- brez datuma testa: izbris 30 dni po njej
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_priprave_student ON priprave(student_id, id);
    CREATE TABLE IF NOT EXISTS priprava_viri (
      id INTEGER PRIMARY KEY,
      priprava_id INTEGER NOT NULL REFERENCES priprave(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      vrsta TEXT NOT NULL,                       -- slika | pdf | word | powerpoint | besedilo (po vsebini, ne po končnici)
      mime TEXT NOT NULL,
      velikost INTEGER NOT NULL,                 -- bajti izvirnika
      ime TEXT,                                  -- ime datoteke, šifrirano
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_priprava_viri ON priprava_viri(priprava_id, id);
    CREATE INDEX IF NOT EXISTS idx_priprava_viri_student ON priprava_viri(student_id);
    -- Izvirnik vira: šifriran (crypto-polje.js sealBytes). Ne gre v varnostne kopije in ne v izvoz podatkov.
    CREATE TABLE IF NOT EXISTS priprava_izvirniki (
      vir_id INTEGER PRIMARY KEY REFERENCES priprava_viri(id) ON DELETE CASCADE,
      podatki BLOB NOT NULL
    );
  `);
  // PR 2b: načrt testa (pot učne poti, izbrani sklopi, test iz urnika) in oznaka aktivne priprave (ena na profil).
  const cols = db.prepare("PRAGMA table_info(priprave)").all().map((c) => c.name);
  if (!cols.includes("pot")) db.exec("ALTER TABLE priprave ADD COLUMN pot TEXT"); // ključ učne poti (MAT-SS-4 …)
  if (!cols.includes("sklopi")) db.exec("ALTER TABLE priprave ADD COLUMN sklopi TEXT"); // JSON indeksov sklopov
  if (!cols.includes("dogodek_id")) db.exec("ALTER TABLE priprave ADD COLUMN dogodek_id TEXT"); // test iz urnika
  if (!cols.includes("aktivna")) db.exec("ALTER TABLE priprave ADD COLUMN aktivna INTEGER NOT NULL DEFAULT 0");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_priprave_aktivna ON priprave(student_id) WHERE aktivna = 1");
  // PR 3a: izseki virov (server/priprava/uvoz.js, izseki.js) in stanje obdelave vira.
  db.exec(`
    CREATE TABLE IF NOT EXISTS priprava_izseki (
      id INTEGER PRIMARY KEY,
      priprava_id INTEGER NOT NULL REFERENCES priprave(id) ON DELETE CASCADE,
      vir_id INTEGER NOT NULL REFERENCES priprava_viri(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      stran INTEGER,                             -- stran PDF/Word, prosojnica; besedilo: 1
      zaporedje INTEGER NOT NULL,                -- vrstni red v viru
      vrsta TEXT NOT NULL,                       -- definicija | izrek | postopek | formula | primer | naloga | teorija
      naslov TEXT,                               -- naslov razdelka, šifrirano
      besedilo TEXT NOT NULL,                    -- šifrirano; negotovo branje z oznako [?]
      negotovo TEXT,                             -- JSON [{ vrsta, izvirno, prepis? }], šifrirano
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_priprava_izseki ON priprava_izseki(priprava_id, vir_id, zaporedje);
    CREATE INDEX IF NOT EXISTS idx_priprava_izseki_vir ON priprava_izseki(vir_id);
    CREATE INDEX IF NOT EXISTS idx_priprava_izseki_student ON priprava_izseki(student_id);
  `);
  const virCols = db.prepare("PRAGMA table_info(priprava_viri)").all().map((c) => c.name);
  // caka | obdelan | branje (fotografija ali skeniran PDF čaka na branje, PR 3b) | napaka
  if (!virCols.includes("stanje")) db.exec("ALTER TABLE priprava_viri ADD COLUMN stanje TEXT");
  if (!virCols.includes("strani")) db.exec("ALTER TABLE priprava_viri ADD COLUMN strani INTEGER"); // prebrane strani
  if (!virCols.includes("napaka")) db.exec("ALTER TABLE priprava_viri ADD COLUMN napaka TEXT"); // koda uvoz_*
  if (!virCols.includes("opozorila")) db.exec("ALTER TABLE priprava_viri ADD COLUMN opozorila TEXT"); // JSON kod in številk, brez besedila
  // PR 3b: izsek iz prepisa modela (fotografija, skenirana stran) ima oznako AI; prepisi strani se hranijo, da ponovna
  // obdelava vira ne kliče modela znova.
  if (!db.prepare("PRAGMA table_info(priprava_izseki)").all().some((c) => c.name === "ai")) db.exec("ALTER TABLE priprava_izseki ADD COLUMN ai INTEGER NOT NULL DEFAULT 0");
  db.exec(`
    CREATE TABLE IF NOT EXISTS priprava_prepisi (
      vir_id INTEGER NOT NULL REFERENCES priprava_viri(id) ON DELETE CASCADE,
      priprava_id INTEGER NOT NULL REFERENCES priprave(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      stran INTEGER NOT NULL,                    -- fotografija: 1; PDF: številka skenirane strani
      stanje TEXT NOT NULL,                      -- ok | neucno | prazno | sken_ni_slike | sken_napaka
      besedilo TEXT,                             -- prepis modela, šifrirano (samo ok)
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (vir_id, stran)
    );
    CREATE INDEX IF NOT EXISTS idx_priprava_prepisi_student ON priprava_prepisi(student_id);
  `);
  // PR 5: zapiski teme brez nalog, ki jih je učenec označil kot prebrane (enota »zapiski« v načrtu je opravljena).
  db.exec(`
    CREATE TABLE IF NOT EXISTS priprava_prebrano (
      priprava_id INTEGER NOT NULL REFERENCES priprave(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      tema_id TEXT NOT NULL,                     -- id teme učnega načrta
      datum TEXT NOT NULL,                       -- YYYY-MM-DD po slovenskem času
      PRIMARY KEY (priprava_id, tema_id)
    );
    CREATE INDEX IF NOT EXISTS idx_priprava_prebrano_student ON priprava_prebrano(student_id);
  `);
  // PR 6: napredek priprave, en posnetek pripravljenosti na dan (izkazano znanje, brez napovedi ocene).
  db.exec(`
    CREATE TABLE IF NOT EXISTS priprava_napredek (
      priprava_id INTEGER NOT NULL REFERENCES priprave(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      datum TEXT NOT NULL,                       -- YYYY-MM-DD po slovenskem času
      odstotek INTEGER NOT NULL,                 -- povprečje ocen preverljivih tem (0–100)
      obvladanih INTEGER NOT NULL,
      preverljivih INTEGER NOT NULL,
      PRIMARY KEY (priprava_id, datum)
    );
    CREATE INDEX IF NOT EXISTS idx_priprava_napredek_student ON priprava_napredek(student_id);
  `);
  preseliTestPlans(db);
}

// Vsak načrt iz test_plans postane aktivna priprava (če profil še nima aktivne), nato se test_plans izbriše. Vse v eni
// transakciji: ob napaki ostane test_plans cel in selitev se ponovi ob naslednjem zagonu.
function preseliTestPlans(db) {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'test_plans'").get()) return;
  const imaAktivno = db.prepare("SELECT 1 FROM priprave WHERE student_id = ? AND aktivna = 1");
  const vpis = db.prepare(
    `INSERT INTO priprave (student_id, naslov, predmet, datum_testa, zadnja_uporaba, created_at, pot, sklopi, dogodek_id, aktivna)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  );
  db.exec("BEGIN IMMEDIATE");
  try {
    // Ponovno v transakciji: drug proces (skripta ob zagonu) je tabelo morda že preselil in izbrisal.
    if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'test_plans'").get()) return void db.exec("COMMIT");
    const imaDogodek = db.prepare("PRAGMA table_info(test_plans)").all().some((c) => c.name === "event_id");
    // Brez osirotelih vrstic (profil izbrisan ob izklopljenih tujih ključih): sicer INSERT pade in baza se ne odpre.
    const vrstice = db
      .prepare(
        `SELECT student_id, path_key, units, test_date, ${imaDogodek ? "event_id" : "NULL AS event_id"}, created_at FROM test_plans
         WHERE student_id IN (SELECT id FROM students)`,
      )
      .all();
    for (const r of vrstice) {
      if (imaAktivno.get(r.student_id)) continue;
      const predmet = /^([A-Z]{2,6})-/.exec(String(r.path_key))?.[1] || null;
      vpis.run(r.student_id, seal("Priprava na test"), predmet, r.test_date, r.created_at, r.created_at, r.path_key, r.units, r.event_id);
    }
    db.exec("DROP TABLE test_plans");
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
