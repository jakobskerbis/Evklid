// Gladka uporaba na telefonu (j, 10. 11. 2026):
// A) odprtje na zadnjem zaslonu brez utripa Učne poti; na Učno pot samo po več kot 12 urah (public/zacetek.js),
// B) tipka Nazaj po plasteh, dva pritiska za izhod na Učni poti, zgodovina se ne nabira (public/app.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import SL from "../public/i18n/sl.js";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const H = 60 * 60 * 1000;

// public/zacetek.js je navaden skript v <head>: zaženemo ga z lažnim oknom in majhno lažno stranjo (spodnja
// vrstica, prvi pogled, pasici), da vidimo, kaj vstavi in katere klice začne.
function zacetek({ zapis, posnetek, studentId = "7", search = "", raw, odgovori = {}, brezVrstice = false, lastnik, profili, jezik, app } = {}) {
  const store = new Map();
  if (jezik) store.set("evklid.lang", jezik);
  if (lastnik != null) store.set("evklid.offline.owner", JSON.stringify(lastnik));
  if (profili) store.set("evklid.offline.students", JSON.stringify(profili));
  if (zapis) store.set("evklid.zadnji-zaslon", JSON.stringify(zapis));
  if (raw != null) store.set("evklid.zadnji-zaslon", raw);
  if (posnetek) store.set("evklid.zadnji-posnetek", typeof posnetek === "string" ? posnetek : JSON.stringify(posnetek));
  if (studentId != null) store.set("studentId", studentId);
  const attrs = {};
  const timers = [];
  const window = {};
  const vstavljeno = []; // { el, pred }
  const klici = [];
  const sporocila = [];
  const el = (tag) => {
    const e = { tag, attrs: {}, className: "", innerHTML: "", hidden: true, removed: false };
    e.setAttribute = (k, v) => (e.attrs[k] = v);
    e.removeAttribute = (k) => delete e.attrs[k];
    e.querySelectorAll = () => [];
    e.remove = () => ((e.removed = true), (e.parentNode = null));
    // Posnetek se vstavi kot razčlenjen <template> (zacetek.js ociscen); čiščenje samo preizkusi
    // test/zacetek-posnetek.test.js v pravem brskalniku, tukaj HTML le prenesemo.
    Object.defineProperty(e, "textContent", { set: () => (e.innerHTML = ""), get: () => e.innerHTML });
    e.appendChild = (x) => (e.innerHTML += x.__h);
    if (tag === "template") {
      e.content = { __h: "", querySelectorAll: () => [] };
      Object.defineProperty(e, "innerHTML", { set: (h) => (e.content.__h = h), get: () => e.content.__h });
    }
    return e;
  };
  const tabs = ["path", "uci", "chat", "me"].map((v) => {
    const t = el("button");
    t.attrs["data-view"] = v;
    t.active = v === "path";
    t.getAttribute = (k) => t.attrs[k];
    t.classList = { toggle: (_c, on) => (t.active = on) };
    return t;
  });
  const parent = { insertBefore: (e, pred) => ((e.parentNode = parent), vstavljeno.push({ el: e, pred: pred.id || pred.tag })) };
  const bar = Object.assign(el("nav"), { id: "tabbar", parentNode: parent, querySelectorAll: () => tabs });
  const prvi = Object.assign(el("main"), { id: "view-auth", parentNode: parent });
  const pasici = { "mock-banner": el("div"), "test-notice": el("div") };
  const zadnji = () => vstavljeno.at(-1)?.el;
  const document = {
    documentElement: { setAttribute: (k, v) => (attrs[k] = v), removeAttribute: (k) => delete attrs[k], hasAttribute: (k) => k in attrs },
    getElementById: (id) => (id === "tabbar" ? (brezVrstice ? null : bar) : pasici[id] || null),
    createElement: el,
    importNode: (c) => ({ __h: c.__h }),
    querySelector: (q) => (q === 'meta[name="evklid-app"]' ? (app ? { getAttribute: () => app } : null) : q === "body > main" ? prvi : /data-posnetek/.test(q) ? (zadnji() && !zadnji().removed && !(q.includes(":not(.zagon-okostje)") && /zagon-okostje/.test(zadnji().className)) ? zadnji() : null) : null),
    querySelectorAll: (q) => (/data-posnetek/.test(q) && zadnji() ? [zadnji()] : []),
    addEventListener: () => {},
    readyState: "loading",
  };
  const fetch = (url) => {
    klici.push(url);
    const o = odgovori[url];
    if (o === "visi") return new Promise(() => {});
    return Promise.resolve(o === undefined ? { ok: false } : { ok: true, json: () => Promise.resolve(o) });
  };
  window.ReactNativeWebView = { postMessage: (m) => sporocila.push(JSON.parse(m)) };
  const ctx = {
    window,
    localStorage: { getItem: (k) => store.get(k) ?? null, removeItem: (k) => store.delete(k) },
    location: { search },
    URLSearchParams,
    document,
    fetch,
    Date,
    requestAnimationFrame: (fn) => fn(),
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    clearTimeout: (id) => id && (timers[id - 1].cleared = true),
  };
  vm.runInNewContext(read("public/zacetek.js"), ctx);
  return { api: window.evklidZacetek, attr: attrs["data-zacetek"], attrs, timers, vstavljeno, zadnji, klici, sporocila, store, tabs, pasici };
}

test("zadnji zaslon velja do 12 ur; pozneje, ob pokvarjenem zapisu ali uri iz prihodnosti se odpre Učna pot", () => {
  const { api } = zacetek();
  const zdaj = Date.UTC(2026, 10, 10, 8);
  assert.equal(api.MAX, 12 * H);
  assert.equal(api.izberi({ v: "chat", t: zdaj - 5 * 60 * 1000 }, zdaj), "chat");
  assert.equal(api.izberi({ v: "settings", t: zdaj - 12 * H }, zdaj), "settings", "natanko 12 ur še velja (šele VEČ kot 12 ur ne)");
  assert.equal(api.izberi({ v: "settings", t: zdaj - 12 * H - 1 }, zdaj), "path");
  assert.equal(api.izberi({ v: "chat", t: zdaj + H }, zdaj), "path", "ura telefona prestavljena nazaj");
  for (const slab of [null, undefined, "chat", 5, {}, { v: "chat" }, { v: 3, t: zdaj }, { v: "chat", t: "včeraj" }, { v: '"><img>', t: zdaj }, { v: "Chat", t: zdaj }])
    assert.equal(api.izberi(slab, zdaj), "path", JSON.stringify(slab));
});

test("odločitev pade pred prvim izrisom: html[data-zacetek] skrije Učno pot, dokler app.js ne pokaže pogleda", () => {
  const t = Date.now() - H;
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 7 } }).attr, "chat");
  assert.equal(zacetek({ zapis: { v: "path", t, s: 7 } }).attr, undefined);
  assert.equal(zacetek({ zapis: { v: "chat", t: Date.now() - 13 * H, s: 7 } }).attr, undefined, "po več kot 12 urah Učna pot");
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 8 } }).attr, undefined, "zapis drugega profila");
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 7 }, studentId: null }).attr, undefined);
  assert.equal(zacetek({ raw: "{pokvarjeno" }).attr, undefined);
  assert.equal(zacetek().attr, undefined, "prvi obisk");
  assert.equal(zacetek({ search: "?pogled=chat" }).attr, "chat", "bližnjica z ikone");
  assert.equal(zacetek({ search: "?pogled=%22%3E" }).attr, undefined);
  // Skript je v <head> pred slogi in moduli, slog skrije Učno pot in njen označeni zavihek.
  const html = read("public/index.html");
  const head = html.slice(0, html.indexOf("</head>"));
  assert.ok(head.indexOf('<script src="zacetek.js"></script>') > 0 && head.indexOf('<script src="zacetek.js"></script>') < head.indexOf('rel="stylesheet"'));
  assert.match(read("public/style.css"), /html\[data-zacetek\]:not\(\[data-zacetek-pod\]\) #view-path:not\(\[data-posnetek\]\) \{ display: none; \}/);
  const app = read("public/app.js");
  assert.match(app, /const startDone = \(\) => \{\n\s*if \(ZACETEK\?\.konec\) return ZACETEK\.konec\(\);/);
  assert.match(app, /let startRec = ZACETEK\?\.beri\(\) \?\? null;/, "zapis se prebere pred prvim showView");
  assert.match(app, /let startHold = true;/, "vmesni showView med zagonom Učne poti ne pokaže");
  assert.match(app, /startRec = null;\n\s*startHold = false;\n\s*startDone\(\);/, "po prijavi Učna pot, ne zaslon pred odjavo");
  // Zapis nosi profil; tema in lekcija se odpreta znova; ob skritju strani se čas zadnjega obiska osveži.
  assert.match(app, /Number\(rec\.s\) !== state\.student\.id\) return null;/);
  assert.match(app, /if \(document\.visibilityState === "hidden"\) return saveSnapshot\(\);/);
  assert.match(app, /window\.addEventListener\("pagehide", saveSnapshot\);/);
  assert.match(app, /function saveSnapshot\(\) \{\n\s*if \(shotClosed\(\)\) return;\n\s*const rec = rememberScreen\(\);/, "zapis zadnjega zaslona se osveži tudi, ko posnetka ni");
});

test("varovalo in zasebnost: oznaka izgine po 8 s tudi brez app.js; zapis se ob odjavi ali izbrisu profila pobriše", () => {
  const z = zacetek({ zapis: { v: "chat", t: Date.now() - H, s: 7 } });
  const varovalo = () => z.timers.filter((x) => x.ms === 8000);
  assert.equal(varovalo().length, 1);
  varovalo()[0].fn();
  assert.equal(z.attrs["data-zacetek"], undefined, "stran ne ostane prazna");
  assert.equal(zacetek().timers.filter((x) => x.ms === 8000).length, 0, "brez oznake ni varovala");
  // public/offline.js (uvaža modul strežnika, zato v Node ni uvozljiv): izraz PRIVATE_KEYS iz izvorne kode.
  const m = read("public/offline.js").match(/const PRIVATE_KEYS = \/(.+)\/;/);
  const PRIVATE_KEYS = new RegExp(m[1]);
  assert.equal(PRIVATE_KEYS.test(z.api.KEY), true, "zadnji zaslon (tema, lekcija, profil) je oseben podatek naprave");
  assert.equal(PRIVATE_KEYS.test("evklid.zadnji-zaslon-x"), false);
  assert.equal(PRIVATE_KEYS.test("evklid.offline.students"), true);
  // Po več kot 12 urah v ozadju: tekmovanje z uro ali neposlano besedilo ostaneta na zaslonu.
  assert.match(read("public/app.js"), /const busy = state\.contestTimer \|\| unsentText\(\);\n\s*if \(installed && !busy && /);
});

// ---------- hiter zagon: posnetek zadnjega zaslona, okostje, klici vnaprej (j 2026-11-10) ----------

const POS = (o = {}) => ({ v: "settings", s: 7, t: Date.now() - H, c: "view narrow", tb: "me", b: ["mock-banner", "tabbar"], h: "<p>zdravo</p>", ...o });
const ZAS = { v: "settings", t: Date.now() - H, s: 7 };

test("hiter zagon: posnetek zadnjega zaslona se pokaže takoj, za pravimi pogledi, kot slika (inert)", () => {
  const z = zacetek({ zapis: ZAS, posnetek: POS() });
  assert.equal(z.attr, "settings");
  const { el, pred } = z.vstavljeno.at(-1);
  assert.equal(pred, "tabbar", "za pravimi pogledi: $('#…') v app.js najde prave elemente");
  assert.equal(el.id, "view-settings");
  assert.equal(el.className, "view narrow");
  assert.equal(el.innerHTML, "<p>zdravo</p>");
  assert.equal(el.inert, true);
  assert.equal(el.attrs["aria-hidden"], "true");
  assert.ok("data-posnetek" in el.attrs);
  assert.deepEqual(z.tabs.filter((t) => t.active).map((t) => t.attrs["data-view"]), ["me"], "označen zavihek spodnje vrstice kot ob odhodu");
  assert.equal(z.pasici["mock-banner"].hidden, false, "pasica, ki je bila vidna, je vidna takoj (vsebina se ne premakne)");
  assert.equal(z.pasici["test-notice"].hidden, true);
  // Brskalnik lahko izriše napol razčlenjeno stran: posnetek je takrat že pred prvim pogledom.
  assert.equal(zacetek({ zapis: ZAS, posnetek: POS(), brezVrstice: true }).vstavljeno.at(-1).pred, "view-auth");
  // Konec zagona (app.js startDone) in varovalo po 8 s: oznaki in posnetek izginejo skupaj.
  z.attrs["data-zacetek-pod"] = "";
  z.timers.find((x) => x.ms === 8000).fn();
  assert.deepEqual(Object.keys(z.attrs), []);
  assert.equal(el.removed, true);
  // Učna pot: s posnetkom se pokaže zadnja vsebina poti, brez njega kot prej statična stran.
  const pot = zacetek({ zapis: { v: "path", t: Date.now() - H, s: 7 }, posnetek: POS({ v: "path", c: "view narrow", tb: "path" }) });
  assert.equal(pot.attr, "path");
  assert.equal(pot.zadnji().id, "view-path");
});

test("hiter zagon: brez veljavnega posnetka okostje (ne prazen zaslon); posnetek drugega profila, zaslona ali starejši od 12 ur ne velja", () => {
  const okostje = (z, kaj) => {
    assert.equal(z.attr, "settings", kaj);
    assert.match(z.zadnji().className, /zagon-okostje/, kaj);
    assert.equal(z.zadnji().id, undefined, kaj);
    assert.doesNotMatch(z.zadnji().innerHTML, /zdravo/, kaj);
  };
  okostje(zacetek({ zapis: ZAS }), "brez posnetka");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ s: 8 }) }), "drug profil");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ v: "progress" }) }), "drug zaslon");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ t: Date.now() - 13 * H }) }), "starejši od 12 ur");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ t: Date.now() + H }) }), "ura iz prihodnosti");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ c: 'view" onload="x' }) }), "razredi niso ime razreda");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ h: "" }) }), "prazen");
  okostje(zacetek({ zapis: ZAS, posnetek: "{pokvarjeno" }), "pokvarjen zapis");
  okostje(zacetek({ zapis: ZAS, posnetek: POS(), search: "?pogled=settings" }), "bližnjica z ikone odpre svež zaslon");
  // Lekcija ali tema: posnetek druge lekcije ne velja.
  const uci = { v: "uci", t: Date.now() - H, s: 7, l: "lekcija-a" };
  assert.match(zacetek({ zapis: uci, posnetek: POS({ v: "uci", l: "lekcija-b" }) }).zadnji().className, /zagon-okostje/);
  assert.equal(zacetek({ zapis: uci, posnetek: POS({ v: "uci", l: "lekcija-a" }) }).zadnji().id, "view-uci");
  // Po več kot 12 urah Učna pot kot prej: brez oznake, nič vstavljenega (posnetek nastavitev ne velja za pot).
  const star = zacetek({ zapis: { ...ZAS, t: Date.now() - 13 * H }, posnetek: POS() });
  assert.equal(star.attr, undefined);
  assert.equal(star.vstavljeno.length, 0);
  // Brez izbranega profila (po odjavi je »studentId« pobrisan) posnetka ni.
  assert.equal(zacetek({ zapis: ZAS, posnetek: POS(), studentId: null }).vstavljeno.length, 0);
});

test("hiter zagon, zasebnost: seja ne velja več ali profil je zaklenjen → posnetek izgine, še preden se app.js zažene", async () => {
  const tick = () => new Promise((r) => setImmediate(r));
  const odjavljen = zacetek({ zapis: ZAS, posnetek: POS(), odgovori: { "/api/account/status": { enabled: true, logged_in: false } } });
  assert.equal(odjavljen.zadnji().innerHTML, "<p>zdravo</p>");
  await tick();
  assert.match(odjavljen.zadnji().className, /zagon-okostje/);
  assert.doesNotMatch(odjavljen.zadnji().innerHTML, /zdravo/);
  assert.equal(odjavljen.zadnji().attrs.id, undefined);
  assert.equal(odjavljen.store.has("evklid.zadnji-posnetek"), false, "pobrisan tudi z naprave");
  for (const list of [[{ id: 7, name: "A", locked: true }], [{ id: 8, name: "B" }], []]) {
    const z = zacetek({ zapis: ZAS, posnetek: POS(), odgovori: { "/api/account/status": { enabled: true, logged_in: true }, "/api/students": list } });
    await tick();
    assert.match(z.zadnji().className, /zagon-okostje/, JSON.stringify(list));
    assert.equal(z.store.has("evklid.zadnji-posnetek"), false);
  }
  const odprt = zacetek({ zapis: ZAS, posnetek: POS(), odgovori: { "/api/account/status": { enabled: true, logged_in: true }, "/api/students": [{ id: 7, name: "A", settings: {} }] } });
  await tick();
  assert.equal(odprt.zadnji().innerHTML, "<p>zdravo</p>");
  // Brez povezave (klic ne uspe) posnetek ostane: aplikacija se odpre iz shranjenih podatkov.
  const brez = zacetek({ zapis: ZAS, posnetek: POS() });
  await tick();
  assert.equal(brez.zadnji().innerHTML, "<p>zdravo</p>");
  // Ključ je med osebnimi (odjava, konec seje, menjava računa ga pobrišejo); izbris profila in zaklep tudi.
  const off = read("public/offline.js");
  const PRIVATE_KEYS = new RegExp(off.match(/const PRIVATE_KEYS = \/(.+)\/;/)[1]);
  assert.equal(PRIVATE_KEYS.test(odprt.api.POSNETEK), true);
  assert.equal(PRIVATE_KEYS.test("evklid.zadnji-posnetek-x"), false);
  assert.match(off, /for \(const k of \["evklid\.zadnji-zaslon", "evklid\.zadnji-posnetek"\]\) if \(String\(read\(k, null\)\?\.s\) === id\) localStorage\.removeItem\(k\);/);
  const app = read("public/app.js");
  assert.match(app, /if \(target\?\.locked \|\| \(target && accountsOn\(\) && target\.needs_password\)\) ZACETEK\?\.pozabi\?\.\(\);/);
  // Pravi pogled se pripravi neviden pod posnetkom in ga zamenja v istem izrisu; najpozneje po 2,5 s.
  assert.match(app, /if \(!v\.classList\.contains\("in-okno"\) && !v\.hasAttribute\("data-posnetek"\)\) v\.hidden = /, "posnetek ni pogled aplikacije");
  assert.match(app, /if \(now - t0 <= 2500 && \(\[\.\.\.apiOpen\]\.some\(mine\) \|\| now - changed < 120\)\) return setTimeout\(check, 40\);/);
  assert.match(read("public/style.css"), /html\[data-zacetek-pod\] body > main\.view:not\(\[data-posnetek\]\) \{ visibility: hidden; \}/);
  // V posnetek ne gredo skriti deli, skripti, slike iz pomnilnika, napisano besedilo in gesla; ne med prijavo ali uvodom.
  const shot = read("public/posnetek.js");
  assert.match(shot, /copy\.querySelectorAll\('script, iframe, video, audio, object, embed, \[hidden\], img\[src\^="blob:"\], dialog:not\(\[open\]\)'\)/);
  assert.match(shot, /rec\.v === "settings" && !\["password", "file", "hidden"\]\.includes\(a\.type\)/);
  assert.match(shot, /if \(!h\.trim\(\) \|\| h\.length > SHOT_MAX\) return drop\(\);/);
  assert.match(shot, /el\.parentElement !== document\.body \|\| el\.classList\.contains\("in-okno"\) \|\| document\.body\.classList\.contains\("onboarding"\)\) return drop\(\);/);
  assert.match(app, /import\("\.\/posnetek\.js"\)/, "shranjevanje posnetka ni del prvega odprtja");
});

test("hiter zagon, zasebnost (pregled #560): posnetek takoj le za isti račun in isti odklenjen profil po stanju naprave", async () => {
  const tick = () => new Promise((r) => setImmediate(r));
  const okostje = (z, kaj) => {
    assert.match(z.zadnji().className, /zagon-okostje/, kaj);
    assert.doesNotMatch(z.zadnji().innerHTML, /zdravo/, kaj);
  };
  const A = [{ id: 7, name: "A", settings: {} }];
  // Isti lastnik (račun) kot ob shranjevanju, profil na napravi odklenjen: takoj, tudi brez omrežja.
  const isti = zacetek({ zapis: ZAS, posnetek: POS({ a: "12" }), lastnik: 12, profili: A });
  assert.equal(isti.zadnji().innerHTML, "<p>zdravo</p>");
  await tick();
  assert.equal(isti.zadnji().innerHTML, "<p>zdravo</p>", "brez povezave ostane (seznam na napravi potrjuje profil)");
  // Drug račun, posnetek brez lastnika na napravi z računom, profil na napravi zaklenjen ali ga ni, ni seznama: okostje in izbris.
  for (const [o, kaj] of [
    [{ posnetek: POS({ a: "13" }), lastnik: 12, profili: A }, "drug račun"],
    [{ posnetek: POS(), lastnik: 12, profili: A }, "posnetek iz časa brez računa"],
    [{ posnetek: POS({ a: "12" }), profili: A }, "na napravi ni več lastnika (odjava)"],
    [{ posnetek: POS({ a: "12" }), lastnik: 12, profili: [{ id: 7, name: "A", locked: true }] }, "zaklenjen na napravi"],
    [{ posnetek: POS({ a: "12" }), lastnik: 12, profili: [{ id: 8, name: "B" }] }, "profila ni"],
    [{ posnetek: POS({ a: "12" }), lastnik: 12 }, "ni seznama profilov"],
  ]) {
    const z = zacetek({ zapis: ZAS, ...o });
    okostje(z, kaj);
    assert.equal(z.store.has("evklid.zadnji-posnetek"), false, kaj);
  }
  // Profil z geslom (z: 1): zaklep se lahko spremeni na drugi napravi → najprej okostje, posnetek po potrditvi strežnika.
  const ok = { "/api/account/status": { enabled: true, logged_in: true }, "/api/students": [{ id: 7, name: "A", settings: {}, needs_password: false }] };
  const geslo = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1 }), lastnik: 12, profili: A, odgovori: ok });
  okostje(geslo, "pred odgovorom strežnika");
  await tick();
  assert.equal(geslo.zadnji().innerHTML, "<p>zdravo</p>", "po potrditvi");
  assert.equal(geslo.zadnji().id, "view-settings");
  const zaklenjen = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1 }), lastnik: 12, profili: A, odgovori: { ...ok, "/api/students": [{ id: 7, name: "A", locked: true }] } });
  await tick();
  okostje(zaklenjen, "strežnik: zaklenjen na drugi napravi");
  assert.equal(zaklenjen.store.has("evklid.zadnji-posnetek"), false);
  // Brez povezave (oba klica neuspešna): velja seznam na napravi; ob napaki samo enega (seja?) okostje ostane.
  const brez = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1 }), lastnik: 12, profili: A });
  await tick();
  assert.equal(brez.zadnji().innerHTML, "<p>zdravo</p>");
  const napol = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1 }), lastnik: 12, profili: A, odgovori: { "/api/account/status": { enabled: true, logged_in: true } } });
  await tick();
  okostje(napol, "seja velja, seznama profilov ni");
  // Po koncu zagona (app.js je že zamenjal pogled) potrditev posnetka ne vstavi več.
  const pozno = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1 }), lastnik: 12, profili: A, odgovori: ok });
  pozno.timers.find((x) => x.ms === 8000).fn();
  await tick();
  okostje(pozno, "po koncu zagona");
  // Shranjevanje: zaklenjen profil ali profil, ki mora nastaviti geslo, posnetka nima; lastnik in z gresta v zapis.
  const app = read("public/app.js");
  assert.match(app, /if \(!s \|\| s\.locked \|\| \(accountsOn\(\) && s\.needs_password\)\) return null;/);
  assert.match(app, /z: s\.needs_password === false \? 1 : 0/);
  assert.match(read("public/posnetek.js"), /if \(!meta \|\| !purify\?\.sanitize \|\| !rec \|\| rec\.v === "chat"\) return drop\(\);/);
  // Menjava profila: posnetek prejšnjega izgine takoj; zaklep (tudi 423 med uporabo) ga pobriše.
  assert.match(app, /dropOtherShot\(target\?\.id\); \/\/ menjava profila/);
  assert.match(read("public/account.js"), /\$\("#lock-overlay"\)\?\.remove\(\);\n\s*window\.evklidZacetek\?\.pozabi\?\.\(\);/);
});

test("hiter zagon (pregled #560 B2): vnaprejšnji klic brez lastnega roka – klic, ki še teče, prevzame app.js", async () => {
  const z = zacetek({ zapis: ZAS, odgovori: { "/api/config": "visi", "/api/account/status": { enabled: false } } });
  assert.equal(z.api.ROK, undefined);
  assert.deepEqual(z.timers.map((x) => x.ms), [8000], "samo varovalo zagona, nobenega roka za klice");
  const cfg = z.api.vnaprej("/api/config");
  assert.ok(cfg && typeof cfg.then === "function", "klic, ki še teče, gre app.js (ni prekinjen)");
  let konec = false;
  cfg.then(() => (konec = true));
  await new Promise((r) => setImmediate(r));
  assert.equal(konec, false, "app.js počaka na isti klic");
  assert.equal(z.klici.filter((u) => u === "/api/config").length, 1, "brez ponovnega klica");
  assert.deepEqual(await z.api.vnaprej("/api/account/status"), { enabled: false });
  assert.doesNotMatch(read("public/zacetek.js"), /abort\(|AbortController/);
});

test("hiter zagon (j 10. 11. 2026): klepet posnetka nima – ob odprtju okostje, star posnetek klepeta izgine", () => {
  const CHAT = { v: "chat", t: Date.now() - H, s: 7 };
  const z = zacetek({ zapis: CHAT, posnetek: POS({ v: "chat", c: "view chat-view", tb: "chat" }) });
  assert.equal(z.attr, "chat");
  assert.match(z.zadnji().className, /zagon-okostje/);
  assert.doesNotMatch(z.zadnji().innerHTML, /zdravo/);
  assert.equal(z.store.has("evklid.zadnji-posnetek"), false);
  const shot = read("public/posnetek.js");
  assert.match(shot, /if \(!meta \|\| !purify\?\.sanitize \|\| !rec \|\| rec\.v === "chat"\) return drop\(\);/);
  assert.match(shot, /el\.querySelector\("\.nujno-card, #messages"\)/, "okno nujne pomoči in sporočila tudi ne");
  assert.match(read("public/zasebnost.html"), /sliko zadnjega zaslona \(brez pogovorov z inštruktorjem\), največ 12 ur; ob odjavi se izbriše\./);
});

test("hiter zagon (pregled #560 B3): posnetek drugega jezika ali druge različice aplikacije ne velja", async () => {
  const okostje = (z, kaj) => assert.match(z.zadnji().className, /zagon-okostje/, kaj);
  const slika = (z, kaj) => assert.equal(z.zadnji().innerHTML, "<p>zdravo</p>", kaj);
  slika(zacetek({ zapis: ZAS, posnetek: POS({ g: "en" }), jezik: "en" }), "isti jezik");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ g: "sl" }), jezik: "ar" }), "jezik zamenjan");
  okostje(zacetek({ zapis: ZAS, posnetek: POS(), jezik: "ar" }), "prej privzeti jezik");
  slika(zacetek({ zapis: ZAS, posnetek: POS({ r: "a1" }), app: "a1" }), "ista različica");
  okostje(zacetek({ zapis: ZAS, posnetek: POS({ r: "a1" }), app: "a2" }), "nova objava");
  okostje(zacetek({ zapis: ZAS, posnetek: POS(), app: "a2" }), "posnetek brez različice");
  // Profil z geslom: tudi po potrditvi strežnika ne.
  const ok = { "/api/account/status": { enabled: true, logged_in: true }, "/api/students": [{ id: 7, name: "A", settings: {}, needs_password: false }] };
  const z = zacetek({ zapis: ZAS, posnetek: POS({ a: "12", z: 1, r: "a1" }), lastnik: 12, profili: [{ id: 7, name: "A", settings: {} }], odgovori: ok, app: "a2" });
  await new Promise((r) => setImmediate(r));
  okostje(z, "z geslom, nova objava");
  assert.match(read("public/posnetek.js"), /const r = document\.querySelector\('meta\[name="evklid-app"\]'\)\?\.content \|\| "";/);
});

test("hiter zagon (pregled #560 A2, A3, B1, B4): po odjavi in med zaklepom app.js posnetka ne zapiše znova", () => {
  const z = zacetek({ zapis: ZAS });
  assert.equal(z.api.lahkoShrani(), true);
  z.api.pozabi(); // clearPrivate (odjava, 401, menjava računa) ali zaklep profila
  assert.equal(z.api.lahkoShrani(), false);
  z.api.znova(); // izbran odklenjen profil
  assert.equal(z.api.lahkoShrani(), true);
  const app = read("public/app.js");
  assert.match(app, /const shotClosed = \(\) => ZACETEK\?\.lahkoShrani\?\.\(\) === false;/);
  assert.match(app, /function rememberScreen\(\) \{\n\s*if \(!ZACETEK \|\| shotClosed\(\) \|\|/);
  assert.match(app, /!shotClosed\(\) && !document\.getElementById\("lock-overlay"\) && !!state\.student && localStorageGet\("studentId"\) === String\(state\.student\.id\)/);
  assert.match(app, /function saveSnapshot\(\) \{\n\s*if \(shotClosed\(\)\) return;/);
  assert.match(app, /else loadShot\(\)\.then\(\(m\) => m && shotAllowed\(\) && /);
  assert.match(app, /if \(target\) ZACETEK\?\.znova\?\.\(\);/);
  assert.match(read("public/offline.js"), /export async function clearPrivate\(\) \{[\s\S]{0,200}globalThis\.evklidZacetek\?\.pozabi\?\.\(\);/);
  // B1: pravi pogled je viden, preden gre fokus v polje klepeta.
  assert.match(app, /autoGrow\(\);\n\s*startDone\(\);[^\n]*\n\s*box\.focus\(\);/);
  // B4: neposlano besedilo ali tekmovanje se preveri tudi po klicu različice in tik pred osvežitvijo.
  assert.match(app, /const v = await serverVersion\(\);\n[^\n]*\n\s*if \(!v \|\| v === appVersion \|\| busy\(\)\) return;/);
  assert.match(app, /if \(pageApp\) await dropStaleCopies\(v\);\n\s*if \(busy\(\)\) return;/);
});

test("hiter zagon: klici zagona stečejo že v <head>, app.js jih prevzame enkrat; aplikacija izve za prvi izris", async () => {
  const z = zacetek({ zapis: ZAS, odgovori: { "/api/config": { mock: true } } });
  assert.deepEqual(z.klici, ["/api/account/status", "/api/config", "/api/students", "/api/students/7/conversations"]);
  assert.deepEqual(await z.api.vnaprej("/api/config"), { mock: true });
  assert.equal(z.api.vnaprej("/api/config"), null, "samo enkrat (naslednji klic gre na strežnik)");
  assert.equal(await z.api.vnaprej("/api/students"), null, "neuspel odgovor ne velja: app.js pokliče sam");
  assert.equal(z.api.vnaprej("/api/students/7/path"), null);
  // Brez izbranega profila (prvi obisk, po odjavi) samo javna klica: brez 401 na pristajalni strani.
  assert.deepEqual(zacetek({ studentId: null }).klici, ["/api/account/status", "/api/config"]);
  assert.deepEqual(zacetek({ studentId: "7;x" }).klici, ["/api/account/status", "/api/config"]);
  assert.deepEqual(z.sporocila, [{ t: "izris" }], "APK drži zagonski zaslon do tega sporočila");
  assert.match(read("public/app.js"), /const early = await window\.evklidZacetek\?\.vnaprej\?\.\(url\);\n\s*if \(early != null\) return early;/);
  assert.match(read("public/account.js"), /window\.evklidZacetek\?\.vnaprej\?\.\("\/api\/account\/status"\)/);
  const web = read("mobile/src/app/web.tsx");
  assert.match(web, /m\?\.t === "izris" && !waitTimer\.current && \(e\.nativeEvent\.url === ORIGIN \|\| e\.nativeEvent\.url\?\.startsWith\(ORIGIN \+ "\/"\)\)\) setLoading\(false\);/);
  assert.match(web, /onLoadEnd=\{\(\) => !waitTimer\.current && setLoading\(false\)\}/, "rezerva brez sporočila");
  // Vstopna stran čaka omrežje največ 1 s (j 10. 11. 2026); knjižnice ne ustavijo razčlenjevanja strani.
  assert.match(read("public/sw.js"), /const TIMEOUT = \{ entry: 1000, /);
  assert.equal((read("public/index.html").match(/<script defer src="vendor\//g) || []).length, 3);
});

// ---------- tipka Nazaj: del app.js z lažno zgodovino ----------

function nazaj({ entries = [null], view = "path" } = {}) {
  const app = read("public/app.js");
  const src = app.slice(app.indexOf('let currentView = "path";'), app.indexOf("const ME_VIEWS = ["));
  assert.ok(src.includes('window.addEventListener("popstate"'), "del app.js s tipko Nazaj");
  const h = { list: entries.map((s) => s), i: entries.length - 1, left: false, queue: [] };
  const pops = [];
  const history = {
    get state() {
      return h.list[h.i];
    },
    get length() {
      return h.list.length;
    },
    pushState(s) {
      h.list.splice(h.i + 1, Infinity, s);
      h.i++;
    },
    replaceState(s) {
      h.list[h.i] = s;
    },
    back() {
      h.queue.push(-1);
    },
  };
  const open = new Set(); // odprte plasti: "dialog", "keyboard", "pad", "menu", "lesson", "3d", "esc"
  const toasts = [];
  const timers = [];
  const closeIf = (k) => () => open.delete(k);
  const ctx = {
    history,
    window: { addEventListener: (ev, fn) => ev === "popstate" && pops.push(fn) },
    document: {
      body: { classList: { contains: () => false }, dispatchEvent: () => open.delete("esc") },
      querySelectorAll: (sel) => (sel === "dialog[open]" ? (open.has("dialog") ? [{ dispatchEvent: () => true, close: () => open.delete("dialog") }] : []) : { length: open.size }),
      querySelector: () => null,
    },
    Event: class {},
    KeyboardEvent: class {},
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    clearTimeout: (id) => id && (timers[id - 1].off = true),
    $: (s) => (s === "#tabbar" ? { offsetParent: {} } : s === "#tour" ? null : { classList: { contains: () => false }, offsetParent: null }),
    t: (k) => SL[k],
    toast: (m) => toasts.push(m),
    state: { backTo: "path" },
    startTour: {},
    closeFormulaPop: () => false,
    closePaperViewer: () => false,
    closeOurPaper: () => false,
    closeQuickStart: () => false,
    closeProfileMenu: closeIf("menu"),
    installSheetOpen: () => false,
    closeInstallSheet() {},
    closeFull() {},
    keyboardOpenFor: () => open.has("keyboard"),
    hideKeyboard: closeIf("keyboard"),
    padIsSheet: () => open.has("pad"),
    closePad: closeIf("pad"),
    calcOverlayOpen: () => false,
    closeCalcOverlay() {},
    cornerBack: () => false,
    simOverlayOpen: () => false,
    closeSimOverlay() {},
    isOpen3d: () => open.has("3d"),
    leaveUci: closeIf("3d"),
    setSidebar() {},
    uciBack: closeIf("lesson"),
    textbookBack() {},
    labBack() {},
    gamesBack: () => false,
    scanBack: () => false,
    meView: (v) => ["me", "settings", "progress"].includes(v),
  };
  vm.runInNewContext(
    `${src}
    function showView(name) { syncHistory(name); currentView = name; }
    currentView = ${JSON.stringify(view)};
    globalThis.api = { showView, overlayOpened, overlayClosed, view: () => currentView, EXIT_MS };`,
    ctx,
  );
  // Zgodovina je asinhrona: korak nazaj se zgodi šele tu, popstate pride za njim.
  const flush = () => {
    while (h.queue.length) {
      h.queue.shift();
      if (h.i === 0) {
        h.left = true;
        continue;
      }
      h.i--;
      pops.forEach((fn) => fn());
    }
  };
  return {
    h,
    state: ctx.state,
    open,
    toasts,
    view: ctx.api.view,
    EXIT_MS: ctx.api.EXIT_MS,
    show: (v) => (ctx.api.showView(v), flush()),
    overlay: (on) => ((on ? ctx.api.overlayOpened : ctx.api.overlayClosed)(), flush()),
    back: () => (history.back(), flush()),
    // Časovnik za vrnitev varovala (prvi pritisk Nazaj na Učni poti brez drugega).
    timeout() {
      const live = timers.filter((x) => !x.off);
      live.forEach((x) => ((x.off = true), x.fn()));
      return live.map((x) => x.ms);
    },
    levels: () => h.list.map((s) => s?.stm ?? 0).join(""),
  };
}

test("Nazaj na Učni poti: prvi pritisk pokaže obvestilo, šele drugi zapusti aplikacijo", () => {
  const a = nazaj();
  a.show("path"); // zagon
  assert.equal(a.levels(), "02", "pod Učno potjo je zapis vstopa, da prvi Nazaj ne zapre aplikacije");
  a.back();
  assert.equal(a.h.left, false);
  assert.deepEqual(a.toasts, ["Še enkrat pritisni Nazaj za izhod."]);
  assert.equal(SL["nav.exitAgain"], "Še enkrat pritisni Nazaj za izhod.");
  a.back();
  assert.equal(a.h.left, true, "drugi pritisk zapusti aplikacijo");
  // Brez drugega pritiska se varovalo vrne (po času obvestila) in izhod spet zahteva dva pritiska.
  const b = nazaj();
  b.show("path");
  b.back();
  assert.deepEqual(b.timeout(), [b.EXIT_MS]);
  assert.equal(b.levels(), "02");
  b.back();
  assert.equal(b.h.left, false);
  assert.equal(b.toasts.length, 2);
  // Po obvestilu odprt pogled: Nazaj z njega vodi na Učno pot, ne iz aplikacije.
  b.show("chat");
  assert.equal(b.levels(), "021");
  assert.deepEqual(b.timeout(), [], "časovnik za izhod je preklican");
  b.back();
  assert.equal(b.view(), "path");
  assert.equal(b.h.left, false);
  assert.equal(b.levels(), "021", "zapis pogleda ostane kot zapis naprej, novi se ne dodajajo");
});

test("Nazaj po plasteh: okno → tipkovnica → podstran → seznam → Učna pot; zgodovina se ne nabira", () => {
  const a = nazaj();
  a.show("path");
  a.show("uci");
  for (const k of ["lesson", "3d", "pad", "keyboard", "dialog"]) a.open.add(k);
  const order = [];
  for (let i = 0; i < 5; i++) {
    const before = new Set(a.open);
    a.back();
    order.push([...before].find((k) => !a.open.has(k)));
    assert.equal(a.view(), "uci", "pogled ostane, dokler je kaj odprto");
    assert.equal(a.h.list.length, 3);
  }
  assert.deepEqual(order, ["dialog", "keyboard", "pad", "3d", "lesson"]);
  a.back();
  assert.equal(a.view(), "path");
  // Telefon: s podstrani »Jaz« na »Jaz«, nato na Učno pot. Veliko menjav pogledov ne doda zapisov.
  for (let i = 0; i < 20; i++) {
    a.show("settings");
    a.back();
    assert.equal(a.view(), "me");
    a.show("chat");
    a.back();
    assert.equal(a.view(), "path");
    a.show("me");
    a.show("path");
  }
  assert.ok(a.h.list.length <= 3, `zgodovina se nabira: ${a.levels()}`);
  assert.equal(a.h.left, false);
  // Majhno okno, ki ga zapre Esc (meni porabe, spustni seznam), in meni profila na Učni poti: Nazaj ju zapre brez obvestila.
  for (const k of ["esc", "menu"]) {
    a.open.add(k);
    a.back();
    assert.equal(a.open.has(k), false, k);
  }
  assert.equal(a.toasts.length, 0);
  assert.equal(a.h.left, false);
  // Tema, odprta s Tekmovanj: Nazaj vodi na Tekmovanja, nato na Učno pot.
  const c = nazaj();
  c.show("path");
  c.state.backTo = "competition";
  c.show("topic");
  c.back();
  assert.equal(c.view(), "competition");
  c.back();
  assert.equal(c.view(), "path");
  assert.equal(c.levels(), "021");
});

test("Nazaj po osvežitvi na podstrani, v starem zavihku brez varovala in ob oknu na Učni poti", () => {
  // Osvežitev na podstrani: zgodovina brskalnika ostane (vstop, Učna pot, pogled), aplikacija odpre zadnji zaslon.
  const a = nazaj({ entries: [null, { stm: 2 }, { stm: 1, v: "settings" }] });
  a.show("path");
  a.show("settings");
  assert.equal(a.levels(), "021");
  a.back();
  assert.equal(a.view(), "me");
  a.back();
  assert.equal(a.view(), "path");
  a.back();
  assert.equal(a.toasts.length, 1);
  assert.equal(a.h.left, false);
  // Zavihek, odprt pred to različico (brez varovala): po osvežitvi na Učno pot varovalo nastane.
  const b = nazaj({ entries: [null, { stm: 1, v: "chat" }] });
  b.show("path");
  assert.equal(b.levels(), "02");
  b.back();
  assert.equal(b.h.left, false);
  assert.equal(b.toasts.length, 1);
  // Okno na Učni poti (namestitev, pomen črke): Nazaj ga zapre; zaprtje z gumbom odstrani njegov zapis.
  const c = nazaj();
  c.show("path");
  c.overlay(true);
  assert.equal(c.levels(), "021");
  c.back();
  assert.equal(c.toasts.length, 0, "Nazaj je zaprl okno, ne aplikacije");
  c.overlay(true);
  c.overlay(false);
  c.back();
  assert.equal(c.toasts.length, 1);
  assert.equal(c.h.left, false);
});

test("plasti v app.js: okno <dialog>, Evklidova tipkovnica (samo prek API) in plošča so pred pogledi", () => {
  const app = read("public/app.js");
  const step = app.slice(app.indexOf("function backStep("), app.indexOf('window.addEventListener("popstate"'));
  const at = (s) => {
    assert.ok(step.includes(s), s);
    return step.indexOf(s);
  };
  const views = at('if (currentView === "uci" && uciBack(');
  for (const s of ["closeTopDialog()", "hideKeyboard({ blur: true })", "padIsSheet()", "isOpen3d()", "setSidebar(false)"]) assert.ok(at(s) < views, s);
  assert.ok(views < at("closeByEsc()") && at("closeByEsc()") < at('if (currentView === "path") return false;'));
  assert.match(step, /currentView === "topic" && \["competition", "exams"\]\.includes\(state\.backTo\) \? state\.backTo : "path"/);
  // Tipkovnice se dotaknemo samo prek izvoženih funkcij (PR #543 spreminja public/tipkovnica.js).
  assert.match(app, /import \{[^}]*\bhideKeyboard\b[^}]*\bkeyboardOpenFor\b[^}]*\} from "\.\/tipkovnica\.js";/);
});
