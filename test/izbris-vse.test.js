// Pilot korak 5 (j 2026-11-15): izbris računa in profila res odstrani vse podatke, izvoz pa vsebuje vse podatke.
// Test ne zaupa seznamu tabel: vsako tabelo v bazi (sqlite_master) napolni z vrstico tega računa (prek API, kjer gre,
// sicer neposredno), izbriše račun prek API in nato pregleda VSE tabele in ključe kv: ostati ne sme nobena vrstica,
// ki kaže na račun ali njegove profile ali vsebuje njihov e-naslov, ime ali besedilo. Kar mora ostati (npr. zapis o
// plačilu za računovodstvo), je v DOVOLJENO z razlogom; nova tabela brez izbrisa ta test podre.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const YEAR = new Date().getFullYear();
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
// Id-ji, ki se ne pojavijo slučajno (številke v ključih kv in JSON): drugi račun 4999/7999, ta račun 5000/8000+.
const DRUGI = { parent: 4999, student: 7999, oznaka: "DRUGI-B7", email: "drugi.racun@primer.si" };
const OZNAKA = "ZASEBNO-A9";
const EMAIL = "izbris.vse@primer.si";
const IMENI = ["Zarjaizbris", "Tinetestnik"];
// S ključem za šifriranje bi bila besedila v bazi šifrirana in pregled oznak slep: test teče brez njega.
delete process.env.EVKLID_DATA_KEY;

// Stolpci, ki pripadajo računu ali profilu (kot server/zasebnost.js OWNER_COLS), in tuji ključi na parents/students.
const STUDENT_COLS = new Set(["student_id", "owner_student_id"]);
const PARENT_COLS = new Set(["parent_id", "owner_parent_id", "buyer_id", "redeemed_by", "referrer_id", "referred_id", "created_by"]);

const PO_IMENU = { conversation_id: "conversations", message_id: "messages", class_id: "classes", school_id: "schools" };

function tabele(db) {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all()
    .map(({ name }) => {
      const cols = db.prepare(`PRAGMA table_info("${name}")`).all();
      const fks = db.prepare(`PRAGMA foreign_key_list("${name}")`).all();
      // Stolpec po imenu, tudi brez tujega ključa (če bi ga kdo odstranil, vrstica ne sme ostati nevidna).
      const fk = { ...Object.fromEntries(cols.filter((c) => c.name in PO_IMENU && name !== PO_IMENU[c.name]).map((c) => [c.name, PO_IMENU[c.name]])), ...Object.fromEntries(fks.map((f) => [f.from, f.table])) };
      const vloga = (c) => (fk[c] === "students" || STUDENT_COLS.has(c) ? "student" : fk[c] === "parents" || PARENT_COLS.has(c) ? "parent" : fk[c] || null);
      return { name, cols, fk, vloga };
    });
}
// Tabela pripada računu: ima stolpec računa ali profila ali tuji ključ na tabelo, ki ga ima (povzetek pogovora,
// sporočilo, licenca šole).
function racunske(vse) {
  const lastnik = (t) => t.cols.some((c) => ["student", "parent"].includes(t.vloga(c.name)));
  const imena = new Set(vse.filter(lastnik).map((t) => t.name));
  return vse.filter((t) => !["parents", "students"].includes(t.name) && (lastnik(t) || t.cols.some((c) => imena.has(t.vloga(c.name)))));
}
// Vrstica v tabeli »v« (ki ima stolpec računa), ki pripada računu: SQL za seznam njenih id.
function vrsticeRacuna(vse, v, { parent, students }) {
  const ref = vse.find((x) => x.name === v);
  const own = ref?.cols.filter((x) => ["student", "parent"].includes(ref.vloga(x.name))) || [];
  if (!own.length) return null;
  return `SELECT rowid FROM "${v}" WHERE ${own.map((o) => `"${o.name}" IN (${ref.vloga(o.name) === "student" ? students.join(",") : parent})`).join(" OR ")}`;
}

// Ključi kv z id računa ali profila (meja AI, plačila, pilot, števec varnostnih pregledov): vrednost nosi oznako.
function napolniKv(db, { parent, students, oznaka }) {
  const mesec = new Date().toISOString().slice(0, 7);
  const dan = new Date().toISOString().slice(0, 10);
  // Brez računa (parent = null): samo ključi profila.
  const kljuci = [
    ...(parent == null ? [] : ["ai_paid_", "ai_paid_bal_", "ai_paid_refunds_", "ai_window_", "ai_upgrade_", "school_sub_end:"].map((p) => p + parent)),
    ...(parent == null ? [] : [`pilot_stopnja_p${parent}_${mesec}`]),
    ...students.map((s) => `varnost_${dan}_${s}`),
  ];
  for (const k of kljuci) db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(k, JSON.stringify(`${oznaka} ${k}`));
  return kljuci;
}

// Vrstica računa v vsaki tabeli, ki ima stolpec računa ali profila (če je še ni). Tuji ključi na druge tabele dobijo
// vrstico istega računa iz te tabele (pogovor, sporočilo, razred …), besedila oznako. Vrne tabele, ki jih ni bilo
// mogoče napolniti (z razlogom).
// profil: tabele s stolpcem profila dobijo vrstico tega profila, tudi če račun v njih že ima vrstico.
function napolni(db, { parent, students, oznaka, vedno = false, profil = false }) {
  const vse = tabele(db);
  let caka = racunske(vse);
  const ni = {};
  let zap = 0;
  for (let krog = 0; krog < 4 && caka.length; krog++) {
    const naslednji = [];
    for (const t of caka) {
      const brezLastnika = !t.cols.some((c) => ["student", "parent"].includes(t.vloga(c.name)));
      const zaProfil = profil && t.cols.some((c) => t.vloga(c.name) === "student");
      const imaVrstico = t.cols.some((c) => {
        const v = t.vloga(c.name);
        if (zaProfil && v !== "student") return false;
        if (v === "student") return db.prepare(`SELECT 1 FROM "${t.name}" WHERE "${c.name}" IN (${students.join(",")}) LIMIT 1`).get();
        if (v === "parent") return db.prepare(`SELECT 1 FROM "${t.name}" WHERE "${c.name}" = ? LIMIT 1`).get(parent);
        const sql = brezLastnika && v && vrsticeRacuna(vse, v, { parent, students });
        return sql ? db.prepare(`SELECT 1 FROM "${t.name}" WHERE "${c.name}" IN (${sql}) LIMIT 1`).get() : false;
      });
      if (imaVrstico && (!vedno || t.vedno)) continue;
      if (vedno) t.vedno = true; // ena dodatna vrstica na tabelo
      const row = {};
      const pk = t.cols.filter((c) => c.pk);
      for (const c of t.cols) {
        const v = t.vloga(c.name);
        const type = String(c.type).toUpperCase();
        if (pk.length === 1 && c.pk && type === "INTEGER" && !v) continue; // samodejni id
        if (t.name === "classes" && c.name === "kind") {
          row[c.name] = "class";
          continue;
        }
        if (v === "student") row[c.name] = students[0];
        else if (v === "parent") row[c.name] = parent;
        else if (v) {
          // Tuji ključ na drugo tabelo: vrstica tega računa v njej (najprej poskusi po stolpcih računa).
          const ref = tabele(db).find((x) => x.name === v);
          const own = ref?.cols.find((x) => ["student", "parent"].includes(ref.vloga(x.name)));
          const id = own
            ? db.prepare(`SELECT rowid AS id FROM "${v}" WHERE "${own.name}" IN (${ref.vloga(own.name) === "student" ? students.join(",") : parent}) LIMIT 1`).get()?.id
            : v === "conversations" || v === "messages"
              ? null
              : db.prepare(`SELECT rowid AS id FROM "${v}" ORDER BY rowid DESC LIMIT 1`).get()?.id;
          const viaConv =
            v === "messages"
              ? db.prepare(`SELECT m.id FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE c.student_id IN (${students.join(",")}) LIMIT 1`).get()?.id
              : null;
          // Tabela brez stolpca računa (skupina lige, šola) brez vrstic: ena splošna vrstica.
          // Tabela brez stolpca računa (povzetek, licenca) se naveže samo na vrstico tega računa: počaka nanjo.
          if (brezLastnika && own && id == null) row.__caka = v;
          else if (id == null && viaConv == null && !own && !["conversations", "messages"].includes(v)) {
            const cols = db.prepare(`PRAGMA table_info("${v}")`).all().filter((x) => x.notnull && x.dflt_value == null && !(x.pk && /INT/i.test(x.type)));
            const r = db.prepare(`INSERT INTO "${v}" (${cols.map((x) => `"${x.name}"`).join(",") || "rowid"}) VALUES (${cols.map((x) => (/INT|REAL/i.test(x.type) ? 1 : "'x'")).join(",") || "NULL"})`).run();
            row[c.name] = Number(r.lastInsertRowid);
          } else row[c.name] = id ?? viaConv ?? (own ? db.prepare(`SELECT rowid AS id FROM "${v}" ORDER BY rowid DESC LIMIT 1`).get()?.id : null) ?? null;
        } else if (/INT|REAL|NUM/.test(type)) row[c.name] = c.dflt_value != null && !c.pk ? undefined : parent * 1000 + ++zap; // enolično (UNIQUE)
        // Besedilo kot niz JSON: stolpci z JSON (seznam težav, odgovori ankete, urnik) ga preberejo brez napake.
        else row[c.name] = JSON.stringify(`${oznaka} ${t.name}.${c.name}`);
      }
      const keys = Object.keys(row).filter((k) => row[k] !== undefined);
      if (row.__caka) {
        naslednji.push(t);
        ni[t.name] = `ni vrstice računa v ${row.__caka}`;
        continue;
      }
      try {
        db.prepare(`INSERT INTO "${t.name}" (${keys.map((k) => `"${k}"`).join(",")}) VALUES (${keys.map(() => "?").join(",")})`).run(...keys.map((k) => row[k]));
      } catch (e) {
        // Ena vrstica na račun (garancija): profil se vpiše v obstoječo vrstico računa.
        const sc = t.cols.filter((c) => t.vloga(c.name) === "student").map((c) => `"${c.name}" = ${students[0]}`);
        const pc = t.cols.filter((c) => t.vloga(c.name) === "parent").map((c) => `"${c.name}" = ${parent}`);
        if (profil && /UNIQUE/.test(e.message) && sc.length && pc.length && db.prepare(`UPDATE "${t.name}" SET ${sc.join(",")} WHERE ${pc.join(" OR ")}`).run().changes) continue;
        naslednji.push(t);
        ni[t.name] = e.message;
      }
    }
    for (const t of caka) if (!naslednji.includes(t)) delete ni[t.name];
    caka = naslednji;
  }
  return ni;
}

// Vse, kar v bazi še kaže na račun: { tabela: število vrstic } z vrsticami, ki imajo id računa ali profila v stolpcu
// računa ali vsebujejo e-naslov, ime ali besedilo računa; za kv { "kv:ključ": 1 } (številke v ključu kot #).
function ostanki(db, { parent, students, oznake, samoProfil = false }) {
  const out = {};
  const idRe = new RegExp(`(^|[^0-9])(${[parent, ...students].join("|")})([^0-9]|$)`);
  for (const t of tabele(db)) {
    if (samoProfil && t.name !== "kv" && !t.cols.some((c) => t.vloga(c.name) === "student")) continue;
    if (t.name === "kv") {
      for (const r of db.prepare("SELECT key, value FROM kv").all()) {
        if (idRe.test(r.key) || oznake.some((o) => String(r.value).toLowerCase().includes(o.toLowerCase()))) out[`kv:${r.key.replace(/\d+/g, "#")}`] = 1;
      }
      continue;
    }
    const where = [];
    const args = [];
    for (const c of t.cols) {
      const v = t.vloga(c.name);
      if (v === "student") where.push(`"${c.name}" IN (${students.join(",")})`);
      if (v === "parent") where.push(`"${c.name}" = ${parent}`);
      if (c.name === "student_ids") for (const s of students) where.push(`',' || student_ids || ',' LIKE '%,${s},%'`);
      for (const o of oznake) {
        where.push(`instr(lower(CAST("${c.name}" AS TEXT)), lower(?)) > 0`);
        args.push(o);
      }
    }
    if (!where.length) continue;
    const n = db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}" WHERE ${where.join(" OR ")}`).get(...args).n;
    if (n) out[t.name] = n;
  }
  return out;
}

async function withServer(fn) {
  const store = openDb(":memory:");
  // Kopija mnenj v JSON na disku (server/feedback.js): po izbrisu se prepiše.
  const feedbackFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "izbris-")), "feedback.json");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    if (new URL(url).host === "api.resend.com") mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    feedbackFile,
    log: { error() {}, info() {} },
    streamFn: async ({ onText }) => {
      onText("Rešimo.");
      return { text: `Rešimo. ${OZNAKA} odgovor${META}`, stopReason: "end_turn", usage: { input_tokens: 100, output_tokens: 20 }, model: "claude-haiku-4-5" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  try {
    await fn({ store, client, mails, app, feedbackFile });
  } finally {
    server.close();
  }
}

// Drugi račun (ne sme se dotakniti) in ta račun prek API: dva profila, pogovor s sporočili, urnik.
async function pripravi({ store, client, mails }) {
  const db = store.db;
  // Drugi račun prek API, nato njegova kopija z id 4999 / 7999 (naslednji račun dobi id 5000).
  const b = client();
  assert.equal((await b("/api/auth/register", { method: "POST", body: { email: "prvi@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } })).status, 201);
  await b(/\/api\/auth\/verify\?token=[\w-]+/.exec(mails.at(-1).text)[0]);
  assert.equal((await b("/api/students", { method: "POST", body: { name: "Prvi", birth_year: YEAR - 17, consent: true } })).status, 201);
  const kopija = (t, id, set) => {
    const cols = db.prepare(`PRAGMA table_info("${t}")`).all().map((c) => c.name);
    const vals = cols.map((c) => (c in set ? "?" : `"${c}"`));
    db.prepare(`INSERT INTO "${t}" (${cols.map((c) => `"${c}"`).join(",")}) SELECT ${vals.join(",")} FROM "${t}" WHERE id = ?`).run(...cols.filter((c) => c in set).map((c) => set[c]), id);
  };
  kopija("parents", 1, { id: DRUGI.parent, email: DRUGI.email, name: DRUGI.oznaka, referral_code: "DRUGIREF", unsubscribe_token: "drugi-odjava", uid: "drugi-uid" });
  kopija("students", 1, { id: DRUGI.student, name: DRUGI.oznaka, parent_id: DRUGI.parent });
  const a = client();
  const r = await a("/api/auth/register", { method: "POST", body: { email: EMAIL, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(mails.at(-1).text)[0]);
  const parent = r.body.parent.id;
  const kids = [];
  for (const name of IMENI) {
    const k = await a("/api/students", { method: "POST", body: { name, birth_year: YEAR - 17, consent: true } });
    assert.ok(k.status < 300, JSON.stringify(k.body));
    kids.push(k.body.id);
  }
  for (const id of kids) {
    const conv = (await a(`/api/students/${id}/conversations`, { method: "POST" })).body;
    const m = await a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `${OZNAKA} vprašanje: koliko je 2 + 2?` } });
    assert.equal(m.status, 200, JSON.stringify(m.body));
    await a(`/api/students/${id}/schedule`, { method: "PUT", body: { events: [{ date: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10), kind: "test", name: `${OZNAKA} test` }] } });
  }
  return { a, parent, kids };
}

const steviloDrugega = (db) =>
  Object.fromEntries(
    tabele(db).map((t) => {
      const w = t.cols.filter((c) => ["student", "parent"].includes(t.vloga(c.name))).map((c) => `"${c.name}" = ${t.vloga(c.name) === "student" ? DRUGI.student : DRUGI.parent}`);
      return [t.name, w.length ? db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}" WHERE ${w.join(" OR ")}`).get().n : 0];
    }),
  );

// Število vrstic računa in danih profilov v vsaki tabeli (za preverjanje, da se jih izbris drugega ne dotakne).
// Vrstice, ki vsebujejo profil »razen«, se ne štejejo (pripadajo profilu, ki se briše).
const steviloRacuna = (db, parent, students, razen = -1) =>
  Object.fromEntries(
    tabele(db).map((t) => {
      const cs = t.cols.filter((c) => ["student", "parent"].includes(t.vloga(c.name)));
      const w = cs.map((c) => `"${c.name}" ${t.vloga(c.name) === "student" ? `IN (${students.join(",")})` : `= ${parent}`}`);
      const ne = cs.filter((c) => t.vloga(c.name) === "student").map((c) => `COALESCE("${c.name}", 0) <> ${razen}`);
      return [t.name, w.length ? db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}" WHERE (${w.join(" OR ")})${ne.length ? ` AND ${ne.join(" AND ")}` : ""}`).get().n : 0];
    }),
  );

// Kar sme ostati po izbrisu računa, z razlogom (docs/izbris-izvoz.md, docs/varnost-podatkov.md »Izbris profila ali
// računa«). Te vrstice ne smejo več kazati na račun ali profil (stolpci računa so NULL), razen kjer piše drugače.
const DOVOLJENO = {
  audit_log: "dnevnik dostopov (1 leto, varnostna sled) brez povezave na račun (detachAudit)",
  billing_consents: "soglasje plačnika (e-naslov, potrjeno besedilo): dokaz o soglasju pri plačilu (odstop od pogodbe)",
  withdrawals: "obvestilo o odstopu od pogodbe (ime, e-naslov, pogodba): dokaz o pravočasnem odstopu in potrdilu o prejemu (ZVPot-1A), parent_id → NULL",
  gifts: "plačana darilna koda: zapis plačila za vračilo in računovodstvo",
  guarantees: "garancija: zapis plačila in vračila (e-naslov samo kot zgoščena vrednost)",
  podari_fund: "nakup »Podari«: zapis plačila",
  referral_rewards: "nagrada za priporočilo: zapis obračuna",
  store_subscriptions: "naročnina iz trgovine (Apple/Google): zapis plačila",
  answer_cache: "splošen odgovor inštruktorja brez imena učenca, deljen med učenci (uporabi se 30 dni)",
  pilot_mnenja_prenehalo: "naključna oznaka mnenja brez osebnih podatkov, da skrbnik umakne objavljeno mnenje",
  schools: "šola ostane; created_by postane NULL",
  school_licences: "licenca šole (sedeži, predmeti, veljavnost) ostane s šolo; ni podatkov računa",
  ai_school_use: "poraba AI, ki je šla pod mejo šole, ostane šoli (student_id → NULL)",
  school_orders: "naročilo šole iz obrazca za šole (kontakt šole, ne računa) ostane s šolo",
  class_assignments: "naloga, ki jo je učitelj dal v razredu drugega učitelja, ostane razredu (created_by → NULL)",
  pilot_vabila: "porabljena koda vabila (samo zgoščena koda in čas, parent_id → NULL): izbris in nova registracija ne dasta novega članstva v pilotu (#751)",
};
// Ostane in še kaže na račun ali profil: z razlogom, zakaj to ni uhajanje.
const POVEZANO = {
  ai_holds: "rezervacija klica AI v teku; izbriše jo konec klica ali ponovni zagon (server/usage.js recoverHolds)",
  guest_invites: "povabilo gostov ustvari skrbnik aplikacije (created_by = id skrbnika)",
};
// Najdbe koraka 5 (15. 11. 2026), zapisane za j in ne popravljene: po popravku jih odstrani od tu.
const ZNANO = {};

test("izbris računa: v nobeni tabeli ne ostane nič, kar kaže na račun, njegove profile ali njihova besedila", { timeout: 60_000 }, async () => {
  await withServer(async (ctx) => {
    const db = ctx.store.db;
    const { a, parent, kids } = await pripravi(ctx);
    assert.equal(parent, DRUGI.parent + 1);
    assert.equal(kids[0], DRUGI.student + 1);
    napolni(db, { parent: DRUGI.parent, students: [DRUGI.student], oznaka: DRUGI.oznaka });
    const kvDrugi = napolniKv(db, { parent: DRUGI.parent, students: [DRUGI.student], oznaka: DRUGI.oznaka });
    const ni = napolni(db, { parent, students: kids, oznaka: OZNAKA });
    assert.deepEqual(ni, {}, "vsaka tabela z računom ali profilom ima pred izbrisom vrstico tega računa");
    const kvRacun = napolniKv(db, { parent, students: kids, oznaka: OZNAKA });
    const drugi = steviloDrugega(db);
    const oznake = [EMAIL, OZNAKA, ...IMENI];
    const pred = ostanki(db, { parent, students: kids, oznake });
    // Pregled vidi vrstico tega računa v vsaki tabeli računa in vsak ključ kv (sicer bi bil po izbrisu slep).
    const vidi = [...racunske(tabele(db)).map((t) => t.name), ...kvRacun.map((k) => `kv:${k.replace(/\d+/g, "#")}`)];
    assert.deepEqual(vidi.filter((k) => !(k in pred)), [], "pregled pred izbrisom ne najde vrstice računa");

    // Stara kopija mnenj na disku (brez ključa za šifriranje jo strežnik piše ob mnenju) z mnenjem tega računa.
    fs.writeFileSync(ctx.feedbackFile, JSON.stringify(db.prepare("SELECT * FROM feedback").all()));
    assert.ok(fs.readFileSync(ctx.feedbackFile, "utf8").includes(OZNAKA));

    const d = await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } });
    assert.equal(d.status, 200, JSON.stringify(d.body));
    const kopija = fs.readFileSync(ctx.feedbackFile, "utf8");
    for (const o of [OZNAKA, EMAIL, ...IMENI]) assert.ok(!kopija.includes(o), `kopija mnenj na disku po izbrisu še vsebuje »${o}«`);

    const po = ostanki(db, { parent, students: kids, oznake });
    const nedovoljeno = Object.keys(po).filter((k) => !(k in DOVOLJENO) && !(k in POVEZANO) && !(k in ZNANO));
    assert.deepEqual(nedovoljeno, [], `po izbrisu ostane: ${JSON.stringify(Object.fromEntries(nedovoljeno.map((k) => [k, po[k]])))}`);
    // Dovoljeni zapisi ne kažejo več na račun (samo id-ji, brez besedil).
    const povezani = Object.keys(ostanki(db, { parent, students: kids, oznake: [] }));
    assert.deepEqual(povezani.filter((k) => !(k in POVEZANO) && !(k in ZNANO)), [], "zapis, ki ostane, še kaže na račun");
    // Znane najdbe še veljajo (ko so popravljene, jih odstrani iz ZNANO).
    for (const k of Object.keys(ZNANO)) assert.ok(k in po, `${k} ne ostane več: odstrani ga iz ZNANO`);
    assert.deepEqual(steviloDrugega(db), drugi, "izbris se ne sme dotakniti drugega računa");
    for (const k of kvDrugi) assert.ok(db.prepare("SELECT 1 FROM kv WHERE key = ?").get(k), `izbris je pobrisal ključ drugega računa ${k}`);
  });
});

// Po izbrisu enega profila ostane pri računu (profil ni več povezan ali zapis poteče), z razlogom.
const PROFIL_OSTANE = {
  ai_credit_use: "poraba kredita računa ostane računu (student_id → NULL)",
  guarantees: "garancija je zapis plačila računa (student_id → NULL)",
  zapiski_strani: "mesečno število prebranih strani računa (student_id → NULL)",
  profile_changes: "dnevnik dodajanja in brisanja profilov za omejitev zlorab (id profila brez podatkov)",
  app_links: "povezava za odpiranje aplikacije (poteče, izbriše se po 1 dnevu)",
  ai_holds: POVEZANO.ai_holds,
  ai_school_use: DOVOLJENO.ai_school_use,
  ...ZNANO,
};
// Od teh ostane id profila (brez drugih podatkov profila).
const PROFIL_ID = { profile_changes: 1, app_links: 1, ai_holds: 1, ...ZNANO };

test("izbris profila: ne ostane nič od profila, račun in drugi profil ostaneta", { timeout: 60_000 }, async () => {
  await withServer(async (ctx) => {
    const db = ctx.store.db;
    const { a, parent, kids } = await pripravi(ctx);
    const [ostane, gre] = kids;
    const PROFIL = "PROFIL-C3";
    napolni(db, { parent, students: [ostane], oznaka: OZNAKA });
    assert.deepEqual(napolni(db, { parent, students: [gre], oznaka: PROFIL, profil: true }), {});
    napolniKv(db, { parent, students: [ostane], oznaka: OZNAKA });
    napolniKv(db, { parent: null, students: [gre], oznaka: PROFIL });
    const vrsticGre = ostanki(db, { parent: -1, students: [gre], oznake: [PROFIL], samoProfil: true });
    for (const t of racunske(tabele(db)).filter((t) => t.cols.some((c) => t.vloga(c.name) === "student"))) assert.ok(t.name in vrsticGre, `profil nima vrstice v ${t.name}`);
    // Napolnjeno geslo profila ga zaklene (brisanje zahteva odklep z geslom): vrstico gesla izbriše tuji ključ
    // (CASCADE), preveri jo test izbrisa računa.
    db.prepare("DELETE FROM profile_passwords WHERE student_id = ?").run(gre);
    // Tabele, kjer vrstice profila ostanejo računu (student_id → NULL): po izbrisu jih račun obdrži vse.
    const ostanejo = Object.keys(PROFIL_OSTANE).filter((t) => !(t in PROFIL_ID) && t !== "ai_school_use"); // ta ostane šoli, ne računu
    const brez = (m) => Object.fromEntries(Object.entries(m).filter(([t]) => !["profile_changes", "students", ...ostanejo].includes(t)));
    const racun = brez(steviloRacuna(db, parent, [ostane], gre));
    const vse = steviloRacuna(db, parent, [ostane, gre]);
    for (const t of ostanejo) assert.ok(db.prepare(`SELECT 1 FROM "${t}" WHERE student_id = ?`).get(gre), `profil nima vrstice v ${t}`);
    const d = await a(`/api/students/${gre}`, { method: "DELETE" });
    assert.equal(d.status, 200, JSON.stringify(d.body));
    // Kopija mnenj na disku se prepiše: brez mnenja izbrisanega profila, mnenje drugega profila ostane.
    const kopija = fs.readFileSync(ctx.feedbackFile, "utf8");
    assert.ok(!kopija.includes(PROFIL), "kopija mnenj po izbrisu profila še vsebuje njegovo mnenje");
    assert.ok(kopija.includes(OZNAKA), "kopija mnenj ne vsebuje mnenja drugega profila");
    const po = ostanki(db, { parent: -1, students: [gre], oznake: [PROFIL, IMENI[1]], samoProfil: true });
    const nedovoljeno = Object.keys(po).filter((k) => !(k in PROFIL_OSTANE));
    assert.deepEqual(nedovoljeno, [], `po izbrisu profila ostane: ${JSON.stringify(Object.fromEntries(nedovoljeno.map((k) => [k, po[k]])))}`);
    // Zapisi, ki ostanejo računu, ne kažejo več na profil (student_id → NULL), razen kjer je id namenoma.
    const povezani = Object.keys(ostanki(db, { parent: -1, students: [gre], oznake: [], samoProfil: true }));
    assert.deepEqual(povezani.filter((k) => !(k in PROFIL_ID)), [], "zapis, ki ostane računu, še kaže na izbrisan profil");
    assert.deepEqual(brez(steviloRacuna(db, parent, [ostane], gre)), racun, "izbris profila se ne sme dotakniti računa in drugega profila");
    const po2 = steviloRacuna(db, parent, [ostane]);
    for (const t of ostanejo) assert.equal(po2[t], vse[t], `${t}: vrstice profila bi morale ostati računu`);
    assert.deepEqual(db.prepare("SELECT id FROM students WHERE parent_id = ?").all(parent).map((r) => r.id), [ostane]);
  });
});

// Tabele, ki jih izvoz namenoma ne vsebuje (server/zasebnost.js SECRET_TABLE in SECRET_COL): gesla, žetoni sej in
// povezav, kode za potrditev. Vse druge tabele z vrsticami računa morajo biti v izvozu.
const NI_V_IZVOZU = {
  parent_sessions: "žeton seje (zgoščen)",
  profile_passwords: "geslo profila (zgoščeno)",
  profile_unlocks: "odklep profila na napravi (varnost)",
  account_unlocks: "odklep računa na napravi (varnost)",
  pay_links: "povezava za plačilo (žeton)",
  owner_codes: "koda za prevzem (zgoščena)",
  skrbnik_potrditve: "potrditev skrbnika (zgoščeni žeton in koda)",
};
const SKRIVNO = /hash|token|secret|password|salt|cipher/i;
// Besedila v vrednosti JSON (urnik, nastavitve): izvoz jih vsebuje razčlenjene, ne kot niz.
function listi(v) {
  let o;
  try {
    o = JSON.parse(v);
  } catch {
    return [];
  }
  const out = [];
  const pojdi = (x) => (typeof x === "string" ? x.length >= 4 && out.push(JSON.stringify(x).slice(1, -1)) : x && typeof x === "object" && Object.values(x).forEach(pojdi));
  if (o && typeof o === "object") pojdi(o);
  return out;
}

test("izvoz podatkov: vsebuje podatke iz vsake tabele z vrsticami računa ali profila", { timeout: 60_000 }, async () => {
  await withServer(async (ctx) => {
    const db = ctx.store.db;
    const { a, parent, kids } = await pripravi(ctx);
    const ni = napolni(db, { parent, students: kids, oznaka: OZNAKA, vedno: true });
    assert.deepEqual(ni, {});
    const r = await a("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(r.status, 200, JSON.stringify(r.body).slice(0, 300));
    const izvoz = JSON.stringify(r.body);
    // Vsaka tabela z vrsticami računa: vsaj ena vrednost besedila iz teh vrstic (ne čas, ne skrivnost) je v izvozu.
    const manjka = [];
    for (const t of tabele(db)) {
      const w = t.cols.filter((c) => ["student", "parent"].includes(t.vloga(c.name))).map((c) => `"${c.name}" ${t.vloga(c.name) === "student" ? `IN (${kids.join(",")})` : `= ${parent}`}`);
      if (!w.length || t.name === "kv") continue;
      const rows = db.prepare(`SELECT * FROM "${t.name}" WHERE ${w.join(" OR ")}`).all();
      const vrednosti = rows.flatMap((row) =>
        Object.entries(row)
          .filter(([k, v]) => typeof v === "string" && v.length >= 4 && !SKRIVNO.test(k) && !/^\d{4}-\d\d-\d\d/.test(v) && !t.vloga(k))
          .flatMap(([, v]) => [JSON.stringify(v).slice(1, -1), ...listi(v)]),
      );
      if (!vrednosti.length) continue;
      if (!vrednosti.some((v) => izvoz.includes(v))) manjka.push(t.name);
    }
    assert.deepEqual(manjka.filter((t) => !(t in NI_V_IZVOZU)), [], "tabele z vrsticami računa, ki jih ni v izvozu");
    for (const s of [EMAIL, ...IMENI, `${OZNAKA} vprašanje`, `${OZNAKA} test`]) assert.ok(izvoz.includes(s), `v izvozu ni »${s}«`);
    // Skrivnosti ne gredo v izvoz.
    assert.doesNotMatch(izvoz, /"(password_hash|token_hash|verify_token_hash|reset_token_hash|unsubscribe_token|store_account_token)"/);
  });
});
