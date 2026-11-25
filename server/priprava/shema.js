// Tabele priprave na test iz zapiskov (docs/priprava.md, PR 2a). Kliče jih server/db.js ob vsakem odprtju baze
// (CREATE ... IF NOT EXISTS, zato varno na obstoječi bazi). test_plans, /test-plan in /test-prep ostanejo, kot so;
// selitev pride pozneje.
// - Vse vrstice gredo s profilom (ON DELETE CASCADE iz students) in s pripravo (iz priprave).
// - naslov in ime datoteke sta šifrirana s seal() (crypto-polje.js SEALED); izvirnik je binarno šifriran
//   (sealBytes) v ločeni tabeli brez stolpca profila: zato ne gre v izvoz (server/zasebnost.js exportOtherTables
//   išče tabele po student_id) in se pobriše iz vsake varnostne kopije (server/kopije.js withoutPilotPhotos).
// - Samodejni izbris (server/priprava/ciscenje.js): 30 dni po datum_testa, brez datuma 30 dni po zadnja_uporaba.
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
}
