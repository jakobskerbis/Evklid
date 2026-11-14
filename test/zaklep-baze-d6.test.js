// D6 (obremenitveni preizkus 14. 11.): drug proces, ki za trenutek zaklene bazo za pisanje (skripta v lupini Render),
// strežniku ne povzroči napake »database is locked«: zapis počaka (busy_timeout). Na stari kodi pade.
// Zagon: node --test test/zaklep-baze-d6.test.js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { openDb } from "../server/db.js";

test("D6 zaklep baze: zapis počaka, da drug proces konča pisanje", async () => {
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zaklep-"));
  const datoteka = path.join(mapa, "t.db");
  const store = openDb(datoteka);
  const s = store.createStudent("Ana");
  // Drug proces: zaklene bazo za pisanje za 400 ms.
  const drugi = spawn(process.execPath, [
    "-e",
    `const { DatabaseSync } = require("node:sqlite"); const db = new DatabaseSync(${JSON.stringify(datoteka)});
     db.exec("BEGIN IMMEDIATE"); db.exec("UPDATE students SET name = name"); console.log("zaklenjeno");
     setTimeout(() => { db.exec("COMMIT"); db.close(); }, 400);`,
  ]);
  await new Promise((ok, napaka) => {
    drugi.stdout.on("data", (d) => String(d).includes("zaklenjeno") && ok());
    drugi.on("exit", (k) => napaka(new Error(`drugi proces je končal (${k}) pred zaklepom`)));
  });
  const t0 = Date.now();
  assert.doesNotThrow(() => store.logQuestion(s.id), "zapis med tujim zaklepom");
  assert.ok(Date.now() - t0 >= 100, "zapis je počakal na sprostitev zaklepa");
  assert.equal(store.db.prepare("SELECT n FROM question_log WHERE student_id = ?").get(s.id).n, 1);
  await new Promise((ok) => (drugi.exitCode !== null ? ok() : drugi.on("exit", ok)));
  store.db.close();
  fs.rmSync(mapa, { recursive: true, force: true });
});
