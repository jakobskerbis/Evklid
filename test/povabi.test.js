// Povabilo po uspehu (public/povabi.js): kdaj se kartica pokaže in kdaj ne.
import { test } from "node:test";
import assert from "node:assert/strict";

// i18n.js ob nalaganju prevede statične napise v strani: v Node je stran prazna (kot test/glava-izbire.test.js).
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { povabiSme, povabiHtml, POVABI_KLJUC } = await import("../public/povabi.js");

const NOW = new Date("2026-11-16T12:00:00Z");
const DAN = 86400000;
const shramba = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};
const racun = (o = {}) => ({
  parent: { guest: false, minor: false, birth_year: 1985, birth_missing: false, ...(o.parent || {}) },
  billing: o.billing ?? false,
  pilot: o.pilot ?? null,
  referral: { url: "https://evklid.app/?ref=ABC123", code: "ABC123", rewards: 0 },
  children: o.children || [{ id: 7, birth_year: 2009 }],
});
const sme = (o = {}) => povabiSme({ acc: racun(o), profileId: 7, now: NOW, storage: o.storage || shramba(), ua: o.ua || "Mozilla/5.0" });

test("pokaže se polnoletnemu imetniku in profilu s 15+ leti", () => {
  assert.deepEqual(sme(), { reward: false, zame: false });
});

test("starost: profil mlajši od 15 ali brez letnice ne", () => {
  assert.equal(sme({ children: [{ id: 7, birth_year: 2012 }] }), null);
  // v letu 15. rojstnega dne še ne (poznamo samo letnico)
  assert.equal(sme({ children: [{ id: 7, birth_year: 2011 }] }), null);
  assert.ok(sme({ children: [{ id: 7, birth_year: 2010 }] }));
  assert.equal(sme({ children: [{ id: 7, birth_year: null }] }), null);
  assert.equal(sme({ children: [{ id: 8, birth_year: 2000 }] }), null, "drug profil");
});

test("starost imetnika: neznana ali pod 15 ne", () => {
  assert.equal(sme({ parent: { birth_missing: true, birth_year: null } }), null);
  assert.equal(sme({ parent: { birth_year: 2012, minor: true } }), null);
  assert.ok(sme({ parent: { birth_year: 2009, minor: true } }), "mladoleten 16-letni imetnik: povabilo da");
});

test("gost, brez računa ali brez povezave ne", () => {
  assert.equal(sme({ parent: { guest: true } }), null);
  assert.equal(povabiSme({ acc: null, profileId: 7, now: NOW }), null);
  const a = racun();
  delete a.referral;
  assert.equal(povabiSme({ acc: a, profileId: 7, now: NOW }), null);
});

test("aplikacija iz trgovine (EvklidApp/) ne", () => {
  assert.equal(sme({ ua: "Mozilla/5.0 (iPhone) EvklidApp/1.4.0" }), null);
});

test("največ enkrat na 7 dni in ne 7 dni po »Ne zdaj«", () => {
  const k = POVABI_KLJUC + "7";
  assert.equal(sme({ storage: shramba({ [k]: JSON.stringify({ shown: NOW - 3 * DAN }) }) }), null);
  assert.ok(sme({ storage: shramba({ [k]: JSON.stringify({ shown: NOW - 8 * DAN }) }) }));
  assert.equal(sme({ storage: shramba({ [k]: JSON.stringify({ shown: NOW - 20 * DAN, dismissed: NOW - 6 * DAN }) }) }), null);
  assert.ok(sme({ storage: shramba({ [k]: JSON.stringify({ dismissed: NOW - 7 * DAN - 1000 }) }) }));
  assert.ok(sme({ storage: shramba({ [k]: "pokvarjeno{" }) }), "pokvarjen zapis = kot da ga ni");
  // drug profil ima svoj zapis
  assert.ok(povabiSme({ acc: racun({ children: [{ id: 9, birth_year: 2000 }] }), profileId: 9, now: NOW, storage: shramba({ [k]: JSON.stringify({ shown: +NOW }) }) }));
});

test("nagrada samo, ko plačila delujejo, ne v pilotu in ne mladoletnemu imetniku", () => {
  assert.deepEqual(sme({ billing: true }), { reward: true, zame: false });
  assert.deepEqual(sme({ billing: false }), { reward: false, zame: false });
  assert.deepEqual(sme({ billing: true, pilot: { kind: "pilot" } }), { reward: false, zame: false });
  assert.deepEqual(sme({ billing: true, parent: { birth_year: 2009, minor: true } }), { reward: false, zame: false });
});

// Račun »Zame« (maturant sam, acc.self_only): ista nagrada, besedilo za prijatelja, ne za družino (UX maturanta 10).
test("račun Zame: nagrada z besedami za prijatelja, ponudba ista", () => {
  const acc = { ...racun({ billing: true }), self_only: true };
  const ok = povabiSme({ acc, profileId: 7, now: NOW, storage: shramba(), ua: "Mozilla/5.0" });
  assert.deepEqual(ok, { reward: true, zame: true });
  const h = povabiHtml("https://evklid.app/?ref=ABC123", ok);
  assert.match(h, /Ko se prijatelj, ki ga povabiš, naroči in prvič plača, oba dobita en mesec brezplačno\./);
  assert.doesNotMatch(h, /družin/);
  assert.match(povabiHtml("https://evklid.app/?ref=ABC123", { reward: true }), /obe družini/);
});

test("kartica: obljuba nagrade samo z reward, povezava in »Ne zdaj«", () => {
  const brez = povabiHtml("https://evklid.app/?ref=ABC123", { reward: false });
  const z = povabiHtml("https://evklid.app/?ref=ABC123", { reward: true });
  assert.ok(!brez.includes("povabi-nagrada") && !/mesec brezplačno/.test(brez));
  assert.ok(z.includes("povabi-nagrada"));
  for (const h of [brez, z]) {
    assert.ok(h.includes('value="https://evklid.app/?ref=ABC123"'));
    assert.ok(h.includes("data-povabi-copy") && h.includes("data-povabi-later"));
  }
});

test("povabiNaNapravi: pravila brez računa (trgovina, 7 dni) za izognitev klicu /api/account", async () => {
  const { povabiNaNapravi } = await import("../public/povabi.js");
  const k = POVABI_KLJUC + "7";
  assert.equal(povabiNaNapravi({ profileId: 7, now: NOW, storage: shramba(), ua: "x EvklidApp/1.0" }), false);
  assert.equal(povabiNaNapravi({ profileId: 7, now: NOW, storage: shramba({ [k]: JSON.stringify({ shown: NOW - DAN }) }) }), false);
  assert.equal(povabiNaNapravi({ profileId: 7, now: NOW, storage: shramba() }), true);
});
