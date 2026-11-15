// Kartica ob porabljenih brezplačnih vprašanjih (public/meja-placilo.js, j 2026-11-15): katera različica se pokaže
// (mladoletni → povezava staršu, polnoleten → zavihek Račun, gost, brez ponudbe, plačila izklopljena) in da so vsi
// novi napisi prevedeni. Pravila ponudb uveljavi strežnik z namigom (server/accounts/index.js moreHintCode).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { plansFor } from "../server/accounts/plans.js";

// i18n.js ob nalaganju prevede statične napise v strani: v Node je stran prazna.
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { limitVariant, limitCardHtml, FREE_LIMIT_CODES } = await import("../public/meja-placilo.js");
const { default: SL } = await import("../public/i18n/sl.js");

const prices = { currency: "EUR", plans: plansFor("EUR") };
const status = (parent = {}, extra = {}) => ({ enabled: true, logged_in: true, billing: true, children: 1, parent: { minor: false, guest: false, birth_missing: false, ...parent }, ...extra });
const daily = (hint) => ({ code: "block.freeDaily", params: { n: 10 }, ...(hint ? { hint } : {}), error: "x" });

test("samo kode porabljenega brezplačnega dela dobijo kartico", () => {
  assert.deepEqual([...FREE_LIMIT_CODES].sort(), ["block.freeDaily", "block.freeMonth", "block.freePool", "block.trialOut"]);
  for (const code of ["block.daily", "block.freeTail", "block.capOut", "block.shareOut", undefined]) assert.equal(limitVariant({ body: { code } }), null, code);
});

test("mladoletni imetnik računa: povezava staršu, cena stopnje na mesec", () => {
  const v = limitVariant({ body: daily("block.hintParent"), status: status({ minor: true }), prices, level: "SS" });
  assert.equal(v.kind, "offer");
  assert.equal(v.action, "link");
  assert.match(v.price, /13[,.]99/);
  const html = limitCardHtml(v, daily("block.hintParent"));
  assert.match(html, /data-meja-link/);
  assert.doesNotMatch(html, /data-meja-account/);
  assert.match(html, /Jutri jih spet dobiš/);
  assert.match(html, /Z naročnino dobiš/);
  assert.match(html, /Vadi naprej v Vadnici/);
  // Namig »naj starš izbere naročnino« nadomesti gumb.
  assert.doesNotMatch(html, /naj starš izbere/);
});

test("profil pod 18 na računu polnoletnega starša: povezava staršu", () => {
  const v = limitVariant({ body: daily("block.hintParent"), status: status(), prices, level: "OS" });
  assert.equal(v.action, "link");
  assert.match(v.price, /9[,.]99/);
});

test("polnoleten imetnik: »Izberi naročnino« odpre zavihek Račun", () => {
  const v = limitVariant({ body: daily("block.hintAdult"), status: status(), prices, level: "FAKS" });
  assert.equal(v.action, "account");
  assert.match(v.price, /19[,.]99/);
  const html = limitCardHtml(v, daily("block.hintAdult"));
  assert.match(html, /data-meja-account/);
  assert.match(html, /Izberi naročnino/);
  assert.doesNotMatch(html, /data-meja-link/);
});

test("gost: namig »ustvari račun«, brez ponudbe in brez klica cenika", () => {
  const body = daily("block.hintGuest");
  const v = limitVariant({ body, status: status(), prices });
  assert.equal(v.kind, "guest");
  const html = limitCardHtml(v, body);
  assert.match(html, /ustvari račun/);
  assert.doesNotMatch(html, /Z naročnino dobiš|data-meja-link|data-meja-account/);
});

test("brez namiga s ceno (pod 15, šola, med poukom, učitelj izklopil, preizkus): brez ponudbe", () => {
  for (const body of [daily(), { code: "block.trialOut", error: "x" }, { code: "block.freePool", error: "x" }]) {
    const v = limitVariant({ body, status: status({ minor: true }), prices });
    assert.equal(v.kind, "plain", body.code);
    const html = limitCardHtml(v, body);
    assert.doesNotMatch(html, /Z naročnino dobiš|data-meja-link|data-meja-account|€/, body.code);
    assert.match(html, /data-meja-practice/);
  }
});

test("plačila izklopljena (Stripe, računi, cenik): samo primerjava, brez gumba in cene", () => {
  const cases = [
    status({}, { billing: false }),
    { enabled: false },
    null,
  ];
  for (const s of cases) {
    const v = limitVariant({ body: daily("block.hintAdult"), status: s, prices });
    assert.equal(v.kind, "offer");
    assert.equal(v.action, null);
    assert.equal(v.price, "");
    const html = limitCardHtml(v, daily("block.hintAdult"));
    assert.match(html, /Z naročnino dobiš/);
    assert.doesNotMatch(html, /data-meja-link|data-meja-account|zavihku Račun/);
  }
  const empty = limitVariant({ body: daily("block.hintParent"), status: status({ minor: true }), prices: { currency: "EUR", plans: [] } });
  assert.equal(empty.action, null);
});

test("aplikacija iz trgovine: brez ponudbe (nakup mimo trgovine ni dovoljen)", () => {
  const v = limitVariant({ body: daily("block.hintAdult"), status: status(), prices, inApp: true });
  assert.equal(v.kind, "plain");
});

test("več profilov ali brez datuma rojstva: brez cene enega profila in brez povezave, namig ostane", () => {
  const many = limitVariant({ body: daily("block.hintParent"), status: status({}, { children: 2 }), prices });
  assert.equal(many.action, null);
  assert.equal(many.price, "");
  assert.match(limitCardHtml(many, daily("block.hintParent")), /naj starš izbere naročnino/);
  // Polnoleten pri več profilih izbere paket (tudi Družino) v zavihku Račun.
  assert.equal(limitVariant({ body: daily("block.hintAdult"), status: status({}, { children: 2 }), prices }).action, "account");
  assert.equal(limitVariant({ body: daily("block.hintAdult"), status: status({ birth_missing: true }), prices }).action, null);
});

test("brez temnih vzorcev: brez odštevanja, popustov in značk", () => {
  const html = limitCardHtml(limitVariant({ body: daily("block.hintAdult"), status: status(), prices }), daily("block.hintAdult"));
  assert.doesNotMatch(html, /pill|popust|priljublj|samo še|zadnja|%/i);
});

test("vsi novi napisi so v sl.js in prevedeni v vseh 32 jezikih", () => {
  const keys = Object.keys(SL).filter((k) => k.startsWith("meja."));
  assert.equal(keys.length, 9);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    for (const k of keys) {
      assert.ok(j[k], `${f} ${k}`);
      assert.notEqual(j[k], SL[k], `${f} ${k} ostal v slovenščini`);
      if (k === "meja.price") assert.match(j[k], /\{price\}/, `${f} ${k}`);
    }
  }
});

test("cena v valuti brez decimalk (XOF) ni 100-krat prenizka", () => {
  const p = { currency: "XOF", plans: plansFor("XOF") };
  const v = limitVariant({ body: daily("block.hintAdult"), status: status(), prices: p, level: "OS" });
  const n = Number(v.price.replace(/[^\d]/g, ""));
  const plan = p.plans.find((x) => x.seats === 1 && x.interval === "month");
  assert.equal(n, plan.amount);
});
