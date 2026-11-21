// Meja registracij na omrežje (5 na dan, EVKLID_SIGNUPS_PER_DAY) in koda vabila v pilot (21. 11. 2026): veljavna,
// še neporabljena koda obide mejo (šolski Wi-Fi, CGNAT), napačna ne; z eno kodo največ 3 mimo meje na dan, ugibanje
// kod z omrežja nad mejo je omejeno.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const CODE = "gim-ana-7q2k";
const OTHER = "gim-miha-x9p4";
const day = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

async function withServer(env, fn) {
  const prev = {};
  for (const [k, v] of Object.entries(env)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const fetchFn = async () => ({ ok: true, status: 200, json: async () => ({ id: "x" }) });
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  let n = 0;
  // Vse z istega omrežja za posrednikom (X-Forwarded-For), kot na Renderju; brez glave bi bila zahteva lokalna.
  const register = async (body = {}, ip = "203.0.113.7") => {
    const r = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
      body: JSON.stringify({ email: `ucenec${++n}@primer.si`, password: "geslo1234", accept_privacy: true, birth_date: "2008-03-04", ...body }),
    });
    return { status: r.status, body: await r.json() };
  };
  try {
    await fn({ register, store });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const ENV = { EVKLID_VABILA: `${CODE} ${OTHER}`, EVKLID_PILOT_DO: day(30), EVKLID_PILOT_EMAILS: "", EVKLID_SIGNUPS_PER_DAY: "" };

test("registracija: 5 na omrežje na dan; veljavna koda vabila obide mejo, napačna ne", async () => {
  await withServer(ENV, async ({ register }) => {
    for (let i = 0; i < 5; i++) assert.equal((await register()).status, 201);
    const brez = await register();
    assert.equal(brez.status, 429);
    assert.match(brez.body.error, /preveč računov/);
    assert.equal((await register({ invite: "ni-prava-koda-123" })).status, 429, "napačna koda ne obide meje");
    assert.equal((await register({ code: "ni-prava-koda-123" })).status, 429);
    const s = await register({ invite: CODE.toUpperCase() });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    assert.equal(s.body.invite, "pending");
    // Polje »Imam kodo« (code) enako.
    assert.equal((await register({ code: OTHER })).status, 201);
    // Druge meje ostanejo: brez kode še vedno 429, drugo omrežje ima svojo kvoto.
    assert.equal((await register()).status, 429);
    assert.equal((await register({}, "198.51.100.9")).status, 201);
  });
});

test("registracija mimo meje: z eno kodo največ 3 na dan, porabljena koda in konec pilota ne veljata", async () => {
  await withServer(ENV, async ({ register, store }) => {
    for (let i = 0; i < 5; i++) await register();
    for (let i = 0; i < 3; i++) assert.equal((await register({ invite: CODE })).status, 201);
    assert.equal((await register({ invite: CODE })).status, 429, "koda se porabi šele ob potrditvi: brez te meje neomejeno računov");
    // Porabljena koda (drug račun jo je že potrdil) ne obide meje.
    const { inviteHash } = await import("../server/vabila.js");
    store.db.prepare("INSERT INTO pilot_vabila (code_hash, parent_id) VALUES (?, NULL)").run(inviteHash(OTHER));
    assert.equal((await register({ invite: OTHER })).status, 429);
  });
  await withServer({ ...ENV, EVKLID_PILOT_DO: day(-2) }, async ({ register }) => {
    for (let i = 0; i < 5; i++) await register();
    assert.equal((await register({ invite: CODE })).status, 429, "po koncu pilota koda ne velja");
  });
});

test("registracija nad mejo: ugibanje kod je omejeno (10 napačnih na dan), nato tudi prava koda ne obide meje", async () => {
  await withServer(ENV, async ({ register }) => {
    for (let i = 0; i < 5; i++) await register();
    for (let i = 0; i < 10; i++) assert.equal((await register({ invite: `ugibam-kodo-${i}` })).status, 429);
    assert.equal((await register({ invite: CODE })).status, 429);
  });
});

test("registracija nad mejo: enak odgovor za veljavno in napačno kodo, ko obrazec ni veljaven; šteje samo napačna koda", async () => {
  await withServer(ENV, async ({ register }) => {
    for (let i = 0; i < 5; i++) await register();
    // Napačen e-naslov: obe kodi dobita isti 400 (iz koda ni mogoče sklepati, ali je veljavna).
    const prava = await register({ invite: CODE, email: "ni-naslov" });
    const napacna = await register({ invite: "ni-prava-koda-123", email: "ni-naslov" });
    assert.equal(prava.status, 400);
    assert.deepEqual(napacna, prava);
    // Neveljaven obrazec in veljavne kode ne štejejo: 3 uspešne + 10 napačnih, nato je omrežje zaprto tudi za veljavno.
    for (let i = 0; i < 3; i++) assert.equal((await register({ invite: CODE })).status, 201);
    for (let i = 0; i < 10; i++) assert.equal((await register({ invite: `ugibam-${i}-xyz` })).status, 429);
    assert.equal((await register({ invite: OTHER })).status, 429, "tudi veljavna koda po 10 napačnih");
  });
});

test("registracija nad mejo: razred 30 učencev z enega omrežja, vsak s svojo kodo, uspe; 11. napačna koda 429", async () => {
  const kode = Array.from({ length: 30 }, (_, i) => `razred-4a-ucenec-${String(i).padStart(2, "0")}`);
  await withServer({ ...ENV, EVKLID_VABILA: kode.join(" ") }, async ({ register }) => {
    for (let i = 0; i < 5; i++) assert.equal((await register()).status, 201);
    for (const k of kode) {
      const r = await register({ invite: k });
      assert.equal(r.status, 201, `${k}: ${JSON.stringify(r.body)}`);
    }
  });
  await withServer(ENV, async ({ register }) => {
    for (let i = 0; i < 5; i++) await register();
    for (let i = 0; i < 11; i++) assert.equal((await register({ invite: `ugibam-kodo-${i}` })).status, 429);
    assert.equal((await register({ invite: CODE })).status, 429, "po 10 napačnih tudi veljavna ne obide meje");
  });
});
