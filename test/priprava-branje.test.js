// Priprava na test PR 3b: branje fotografij vira z modelom (server/priprava/poti.js …/preberi), ista meja strani in
// trda meja AI kot »Moji zapiski« (server/zapiski.js). Model je tu nadomeščen (readFn); pravi klic ni v testih.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import fs from "node:fs";
import { cleanRead } from "../server/zapiski.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const JPEG = (n = 40) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), crypto.randomBytes(n), Buffer.from([0xff, 0xd9])]);
const usageOf = () => ({ input_tokens: 1500, output_tokens: 400 });
const PREPIS = "Integrali\nDoločeni integral: $\\int_a^b f(x)\\,dx = F(b) - F(a)$.\n- Newton-Leibnizova formula\n- ploščina pod krivuljo";

async function withApp(readFn, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet, pripravaReadFn: readFn, zapiskiRights: () => ({ personal: false, school: false }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body, headers = { "Content-Type": "application/json" }) => {
    const r = await fetch(base + p, { method, headers, body: Buffer.isBuffer(body) ? body : body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : await r.text() };
  };
  const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", subject: "MAT" } })).body;
  const p = (await req("POST", `/api/students/${s.id}/priprave`, { naslov: "Integrali", predmet: "MAT" })).body.priprava;
  const nalozi = async (buf) => {
    const r = await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, buf, { "Content-Type": "application/octet-stream" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return r.body.vir;
  };
  const beri = (vid, q = "") => req("POST", `/api/students/${s.id}/priprave/${p.id}/viri/${vid}/preberi${q}`);
  try {
    await fn({ store, db: store.db, req, s, p, nalozi, beri });
  } finally {
    await new Promise((r) => server.close(r));
    store.db.close();
  }
}

test("branje fotografije: prepis → izseki, porabi stran, strošek v usage »priprava«, oznaka AI; brez ponovnega klica", async () => {
  const klici = [];
  const readFn = async (a) => {
    klici.push(a);
    return { ...cleanRead({ text: PREPIS, kind: "rokopis" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const slika = JPEG();
    const vir = await nalozi(slika);
    assert.equal(vir.stanje, "branje");
    const r = await beri(vir.id);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.ai_generated, true);
    assert.equal(r.body.vir.stanje, "obdelan");
    assert.ok(r.body.vir.izsekov >= 1);
    assert.deepEqual({ used: r.body.pages.used, limit: r.body.pages.limit }, { used: 1, limit: 2 });
    assert.equal(klici.length, 1);
    assert.equal(klici[0].mediaType, "image/jpeg");
    assert.ok(Buffer.from(klici[0].imageBase64, "base64").equals(slika));
    const iz = (await req("GET", `/api/students/${s.id}/priprave/${p.id}/izseki?vir=${vir.id}`)).body.izseki;
    const vse = iz.map((x) => x.besedilo).join("\n");
    assert.ok(vse.includes("Newton-Leibnizova formula") && vse.includes("\\int_a^b"), vse);
    assert.equal(iz[0].naslov ?? "Integrali", "Integrali");
    assert.ok(iz.every((x) => x.ai_generated === true), "izseki iz prepisa imajo oznako AI");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind = 'priprava'").get(s.id).n, 1);
    // Prepis je v bazi šifriran.
    assert.ok(!JSON.stringify(db.prepare("SELECT * FROM priprava_izseki").all()).includes("Newton"));
    // Že prebrano: brez klica in brez strani; ?znova=1 prebere znova (stara izseka zamenja).
    const r2 = await beri(vir.id);
    assert.equal(r2.status, 200);
    assert.equal(klici.length, 1);
    assert.equal(r2.body.pages.used, 1);
    const r3 = await beri(vir.id, "?znova=1");
    assert.equal(r3.status, 200);
    assert.equal(klici.length, 2);
    assert.equal(r3.body.pages.used, 2);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki WHERE vir_id = ?").get(vir.id).n, r.body.vir.izsekov);
    // Prepis je shranjen šifrirano (ponovna obdelava ne kliče modela).
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_prepisi WHERE vir_id = ? AND stanje = 'ok'").get(vir.id).n, 1);
    assert.ok(!JSON.stringify(db.prepare("SELECT * FROM priprava_prepisi").all()).includes("Newton"));
  });
});

test("branje: slabše ponovno branje (neučno) ne zamenja dobrega prepisa; stiska pride tudi ob izbrisu med branjem", async () => {
  let odgovor = { text: PREPIS };
  const readFn = async () => ({ ...cleanRead(odgovor), usage: usageOf(), model: "claude-sonnet-5-5" });
  await withApp(readFn, async ({ req, s, p, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    const r = await beri(a.id);
    assert.equal(r.status, 200);
    odgovor = { unrelated: true, distress: "violence" };
    const z = await beri(a.id, "?znova=1");
    assert.equal(z.status, 422);
    assert.equal(z.body.nujno?.vrsta, "nasilje");
    assert.equal(z.body.vir.stanje, "obdelan");
    assert.equal(z.body.vir.izsekov, r.body.vir.izsekov);
    const iz = (await req("GET", `/api/students/${s.id}/priprave/${p.id}/izseki?vir=${a.id}`)).body.izseki;
    assert.ok(iz.map((x) => x.besedilo).join(" ").includes("Newton"));
  });
});

test("branje: meja strani, neuspelo branje in brez ključa strani ne porabi; samo fotografije; tuj profil 404", async () => {
  let nacin = "ok";
  const readFn = async () => {
    if (nacin === "napaka") throw new Error("overloaded");
    if (nacin === "mock") return { mock: true, text: "", kind: "rokopis", usage: null };
    return { ...cleanRead({ text: "Odvod\nf'(x) = 2x", kind: "rokopis" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    nacin = "napaka";
    const e = await beri(a.id);
    assert.equal(e.status, 502);
    assert.equal(e.body.code, "priprava_branje_napaka");
    nacin = "mock";
    const m = await beri(a.id);
    assert.equal(m.body.mock, true);
    assert.equal(m.body.pages.used, 0);
    nacin = "ok";
    assert.equal((await beri(a.id)).status, 200);
    const b = await nalozi(JPEG(41));
    assert.equal((await beri(b.id)).status, 200);
    const c = await nalozi(JPEG(42));
    const over = await beri(c.id);
    assert.equal(over.status, 429);
    assert.equal(over.body.code, "zapiski_strani");
    assert.equal(over.body.pages.used, 2);
    // Besedilni vir se ne bere z modelom.
    const t = await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, { besedilo: "# Naslov\nbesedilo" });
    assert.equal(t.status, 201, JSON.stringify(t.body));
    assert.equal((await beri(t.body.vir.id)).body.code, "priprava_ni_slika");
    // Tuj profil in neobstoječ vir: 404.
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("POST", `/api/students/${tuj.id}/priprave/${p.id}/viri/${a.id}/preberi`)).status, 404);
    assert.equal((await beri(999999)).status, 404);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM usage WHERE kind = 'priprava'").get().n, 2);
  });
});

test("branje: neučna fotografija 422 (vir napaka), stiska odpre okno nujne pomoči, prazna stran, prevelika slika", async () => {
  let odgovor = { unrelated: true, text: "selfie", distress: "self_harm" };
  const readFn = async () => ({ ...cleanRead(odgovor), usage: usageOf(), model: "claude-sonnet-5-5" });
  await withApp(readFn, async ({ db, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    const r = await beri(a.id);
    assert.equal(r.status, 422);
    assert.equal(r.body.code, "zapiski_neucno");
    assert.equal(r.body.vir.stanje, "napaka");
    assert.equal(r.body.vir.napaka, "branje_neucno");
    assert.equal(r.body.nujno?.vrsta, "stiska");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki").get().n, 0);
    odgovor = { text: "" };
    const b = await nalozi(JPEG(41));
    const prazna = await beri(b.id);
    assert.equal(prazna.status, 200);
    assert.equal(prazna.body.vir.napaka, "branje_prazno");
    // Fotografija nad mejo slike modela (base64 > 5 MB), ki je ni mogoče zmanjšati, se ne pošlje.
    db.prepare("DELETE FROM zapiski_strani").run();
    const velika = await nalozi(JPEG(4.6 * 1024 * 1024));
    const v = await beri(velika.id);
    assert.equal(v.status, 413);
    assert.equal(v.body.code, "priprava_slika_velika");
    assert.equal(v.body.vir.napaka, "branje_velika");
  });
});

test("branje: vir, izbrisan med branjem, se ne shrani; hkratno branje istega vira je zavrnjeno", async () => {
  let spusti;
  const zapora = new Promise((r) => (spusti = r));
  const readFn = async () => {
    await zapora;
    return { ...cleanRead({ text: PREPIS, distress: "self_harm" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    const prvo = beri(a.id);
    await new Promise((r) => setTimeout(r, 50));
    const drugo = await beri(a.id);
    assert.equal(drugo.status, 409);
    assert.equal(drugo.body.code, "priprava_zasedeno");
    assert.equal((await req("DELETE", `/api/students/${s.id}/priprave/${p.id}/viri/${a.id}`)).status, 200);
    spusti();
    const izid = await prvo;
    assert.equal(izid.status, 404);
    assert.equal(izid.body.nujno?.vrsta, "stiska", "zastavica stiske ne sme izginiti");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki").get().n, 0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_prepisi").get().n, 0);
  });
});

// ---------- skenirane strani PDF (PR 3b-2) ----------

const IKONA = fs.readFileSync(new URL("../public/icons/deljenje.jpg", import.meta.url));
// JPEG z velikostjo iz glave SOF.
function jpegVelikost(jpg) {
  for (let i = 2; i < jpg.length; ) {
    const m = jpg[i + 1];
    if (m >= 0xc0 && m <= 0xc2) return { h: jpg.readUInt16BE(i + 5), w: jpg.readUInt16BE(i + 7) };
    i += 2 + jpg.readUInt16BE(i + 2);
  }
  return null;
}
// PDF s stranmi: niz = stran z besedilom, Buffer = skenirana stran (ena slika JPEG čez celo stran).
function pdfSken(strani) {
  const obj = [];
  const kids = [];
  const dodaj = (o) => obj.push(o) && obj.length;
  dodaj("<< /Type /Catalog /Pages 2 0 R >>");
  dodaj(null);
  dodaj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  for (const st of strani) {
    let vsebina;
    let vir = "";
    if (typeof st === "string") vsebina = `BT /F1 12 Tf 50 780 Td (${st}) Tj ET`;
    else {
      const { w, h } = jpegVelikost(st);
      const im = dodaj({ slika: st, w, h });
      vir = ` /XObject << /Im1 ${im} 0 R >>`;
      vsebina = "q 595 0 0 842 0 0 cm /Im1 Do Q";
    }
    const c = dodaj(`<< /Length ${vsebina.length} >>\nstream\n${vsebina}\nendstream`);
    kids.push(dodaj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >>${vir} >> /Contents ${c} 0 R >>`));
  }
  obj[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;
  const deli = [Buffer.from("%PDF-1.4\n")];
  let dol = deli[0].length;
  const odm = [];
  obj.forEach((o, i) => {
    odm.push(dol);
    const b =
      typeof o === "string"
        ? Buffer.from(`${i + 1} 0 obj\n${o}\nendobj\n`, "latin1")
        : Buffer.concat([Buffer.from(`${i + 1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${o.w} /Height ${o.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${o.slika.length} >>\nstream\n`), o.slika, Buffer.from("\nendstream\nendobj\n")]);
    deli.push(b);
    dol += b.length;
  });
  deli.push(Buffer.from(`xref\n0 ${obj.length + 1}\n0000000000 65535 f \n${odm.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${obj.length + 1} /Root 1 0 R >>\nstartxref\n${dol}\n%%EOF\n`));
  return Buffer.concat(deli);
}

test("skenirane strani PDF: stran z besedilom brez AI, skenirane prebere model (PNG), izseki po vrsti z oznako AI", async () => {
  const klici = [];
  const readFn = async (a) => {
    klici.push(a);
    return { ...cleanRead({ text: `Skenirana stran ${klici.length}\nPitagorov izrek: $a^2 + b^2 = c^2$.` }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const vir = await nalozi(pdfSken(["Uvod v geometrijo trikotnika in pravokotni trikotniki.", IKONA, IKONA]));
    assert.equal(vir.stanje, "branje");
    assert.ok(vir.izsekov >= 1);
    const r = await beri(vir.id);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    // Brezplačni paket: 2 strani na mesec, obe skenirani strani prebrani.
    assert.deepEqual(r.body.prebrano, [{ stran: 2, stanje: "ok" }, { stran: 3, stanje: "ok" }]);
    assert.equal(r.body.vir.stanje, "obdelan");
    assert.equal(r.body.ai_generated, true);
    assert.equal(klici.length, 2);
    assert.ok(klici.every((k) => k.mediaType === "image/png" && Buffer.from(k.imageBase64, "base64").subarray(1, 4).toString() === "PNG"));
    const iz = (await req("GET", `/api/students/${s.id}/priprave/${p.id}/izseki?vir=${vir.id}`)).body.izseki;
    assert.deepEqual(iz.map((x) => x.stran), [...iz.map((x) => x.stran)].sort((a, b) => a - b));
    assert.ok(iz.some((x) => x.stran === 1 && !x.ai_generated && x.besedilo.includes("Uvod v geometrijo")));
    assert.ok(iz.some((x) => x.stran === 2 && x.ai_generated && x.besedilo.includes("Skenirana stran 1")));
    assert.ok(iz.some((x) => x.stran === 3 && x.ai_generated && x.besedilo.includes("Skenirana stran 2")));
    // Ponovno branje in ponovna obdelava: brez klica modela, prepisi ostanejo.
    assert.equal((await beri(vir.id)).status, 200);
    const o = await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri/${vir.id}/obdelaj`);
    assert.equal(o.status, 200);
    assert.equal(o.body.vir.stanje, "obdelan");
    assert.equal(o.body.vir.izsekov, r.body.vir.izsekov);
    assert.equal(klici.length, 2);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM usage WHERE kind = 'priprava'").get().n, 2);
  });
});

test("skenirane strani PDF: meja strani prebere, kolikor gre; ostale počakajo; stran brez slike ni plačana", async () => {
  let n = 0;
  const readFn = async () => ({ ...cleanRead({ text: `Stran ${++n}` }), usage: usageOf(), model: "claude-sonnet-5-5" });
  await withApp(readFn, async ({ db, nalozi, beri }) => {
    // Stran 2 je prazna (brez slike), 3–5 skenirane.
    const vir = await nalozi(pdfSken(["Naslovna stran zapiskov iz fizike za drugi letnik.", "", IKONA, IKONA, IKONA]));
    const r = await beri(vir.id);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.deepEqual(r.body.prebrano.map((x) => x.stran), [2, 3]);
    assert.equal(r.body.prebrano[0].stanje, "sken_ni_slike");
    assert.equal(r.body.vir.stanje, "branje");
    assert.equal(n, 1);
    const r2 = await beri(vir.id);
    assert.equal(r2.status, 200);
    assert.deepEqual(r2.body.prebrano, [{ stran: 4, stanje: "ok" }]);
    assert.equal(n, 2);
    const r3 = await beri(vir.id);
    assert.equal(r3.status, 429);
    assert.equal(r3.body.code, "zapiski_strani");
    assert.equal(r3.body.pages.used, 2);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_prepisi WHERE vir_id = ?").get(vir.id).n, 3);
  });
});

test("prevelika fotografija JPEG se pred branjem zmanjša (PNG v sivinah)", async () => {
  const klici = [];
  const readFn = async (a) => {
    klici.push(a);
    return { ...cleanRead({ text: "Zmanjšana fotografija" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ nalozi, beri }) => {
    // Veljaven JPEG, napihnjen s komentarji (0xFFFE) nad 4 MB.
    const kom = Buffer.concat([Buffer.from([0xff, 0xfe, 0xff, 0xff]), Buffer.alloc(65533, 0x20)]);
    const velik = Buffer.concat([IKONA.subarray(0, 2), ...Array(64).fill(kom), IKONA.subarray(2)]);
    assert.ok(velik.toString("base64").length > 5 * 1024 * 1024);
    const vir = await nalozi(velik);
    const r = await beri(vir.id);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(klici[0].mediaType, "image/png");
    assert.ok(klici[0].imageBase64.length < 2 * 1024 * 1024);
    assert.equal(r.body.vir.stanje, "obdelan");
  });
});
