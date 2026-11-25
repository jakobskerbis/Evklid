// Vodeni poskus (public/sim/lab-vodeno.js, lab-vodeno-koraki.js; načrt laboratorija, faza 1, j 25. 11. 2026).
// 1) brez brskalnika: vsak vodeni poskus obstaja, koraki so popolni, obkrožene kontrole obstajajo v motorju, pomožne
//    funkcije in štetje uporabe (server/laboratorij.js) delajo;
// 2) v pravem brskalniku (Playwright, če je nameščen): vsak vodeni poskus se odigra do konca z istimi kliki kot učenec
//    (če se motor spremeni tako, da korak ni več izvedljiv, test pade), »Prosto« skrije kartico, »↺ Ponastavi« začne
//    znova; na telefonu (360 × 740) kartica ne povzroči vodoravnega drsenja in risba ostane pripeta.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import { KORAKI, stevilo, celica, ujemanje } from "../public/sim/lab-vodeno-koraki.js";
import { ENGINES } from "../public/sim/index.js";
import { LAB_INFO } from "../public/sim/katalog.js";
import { migrateLab, labUporaba, mountLab, NACINI, DOGODKI } from "../server/laboratorij.js";

test("every guided experiment is a real lab experiment with complete steps", async () => {
  // Vsak vodeni poskus ima igro (spodaj IGRA ali test/vodeno/<ključ>.js), ki ga v brskalniku odigra do konca.
  assert.deepEqual(Object.keys(KORAKI).sort(), Object.keys(IGRA).sort());
  for (const [key, def] of Object.entries(KORAKI)) {
    assert.ok(LAB_INFO[key] && ENGINES[key], `${key}: ni v katalogu laboratorija`);
    for (const f of ["naslov", "cilj", "konec"]) assert.ok(def[f]?.length > 20, `${key}: manjka ${f}`);
    assert.ok(def.koraki.length >= 5 && def.koraki.length <= 12, `${key}: ${def.koraki.length} korakov`);
    // Kontrole poskusa so v motorju; napoved in račun (lab.js) le, če ju motor uporablja.
    const motor = fs.readFileSync(`public/sim/${ENGINES[key][0]}`, "utf8");
    const src = (motor + (/\b(napoved|racun)\(/.test(motor) ? fs.readFileSync("public/sim/lab.js", "utf8") : "")).toLocaleLowerCase("sl");
    for (const [i, k] of def.koraki.entries()) {
      for (const f of ["naslov", "kaj", "zakaj"]) assert.ok(k[f]?.length > 5, `${key} korak ${i + 1}: manjka ${f}`);
      assert.equal(typeof k.done, "function");
      assert.ok(k.naslov.length <= 60, `${key} korak ${i + 1}: naslov predolg za telefon`);
      // Obkrožena kontrola mora obstajati v motorju (gumb, stikalo ali oznaka), sicer korak nima kaj pokazati.
      for (const t of k.poudari || []) assert.ok(src.includes(t.toLocaleLowerCase("sl")), `${key} korak ${i + 1}: kontrole »${t}« ni v ${ENGINES[key][0]}`);
    }
  }
});

test("helpers: numbers with a decimal comma, table columns, concordant titrations", () => {
  assert.equal(stevilo("2,0 V"), 2);
  assert.equal(stevilo("−0,35"), -0.35);
  assert.ok(Number.isNaN(stevilo("–")));
  assert.equal(celica({ "h [m]": "0,50", "t [s]": "0,3194" }, /^t\b/), "0,3194");
  const r = (vz, V) => ({ vzorec: vz, "V [mL]": V });
  assert.equal(ujemanje([r("HCl", "20,00"), r("HCl", "20,15")]), false);
  assert.equal(ujemanje([r("HCl", "20,00"), r("HCl", "20,10")]), true);
  assert.equal(ujemanje([r("HCl", "20,00"), r("CH₃COOH", "20,05")]), false, "različna vzorca se ne ujemata");
});

test("step checks: a done() reads only what the student did", () => {
  // Dnevnik kot v lab-vodeno.js → kontekst (zadnji: kateri vzorec se ujema z najnovejšo vrstico).
  const zadnji = (log) => (...res) => {
    for (let k = log.length - 1; k >= 0; k--) {
      const i = res.findIndex((re) => re.test(log[k]));
      if (i >= 0) return i;
    }
    return -1;
  };
  const c = (o) => ({ par: () => "", num: () => NaN, bilo: () => false, zadnji: () => -1, dnevnik: [], vrstice: [], sklep: () => false, napoved: () => false, racun: () => true, ...o });
  const tit = KORAKI["lab-titracija"].koraki;
  assert.equal(tit[0].done(c({ par: (n) => (n === "zaščitna očala" ? "ne" : "") })), false);
  assert.equal(tit[0].done(c({ par: (n) => (n === "zaščitna očala" ? "da" : "") })), true);
  // Najprej napolnil, nato spral: spiranje bireto izprazni, zato korak »Napolni« ni opravljen (pregled 2).
  const SPRAL = "Bireto si trikrat spral z nekaj mL raztopine NaOH", POLN = "Bireto si z lijakom napolnil z NaOH nekoliko pod ničlo.", ZRAK = "Iz konice je izteklo malo raztopine v čašo za odpadke; zraka v konici ni bilo.";
  assert.equal(tit[2].done(c({ zadnji: zadnji([POLN, SPRAL]) })), false);
  assert.equal(tit[2].done(c({ zadnji: zadnji([POLN, SPRAL, POLN]) })), true);
  assert.equal(tit[3].done(c({ zadnji: zadnji([SPRAL, POLN, ZRAK]) })), true);
  assert.equal(tit[3].done(c({ zadnji: zadnji([SPRAL, ZRAK, POLN]) })), false, "zrak izpuščen pred polnjenjem");
  // AUDIT-075: pipetiranje in indikator štejeta le pravilno izbiro (mokra pipeta, erlenmajerica z vzorcem, metiloranž ne).
  const PIP = "S propipeto si v polnilno pipeto posrkal vzorec do oznake in ga izpustil v erlenmajerico: 25,00 mL. Vzorec: klorovodikova kislina HCl.";
  const MOKRA = "Pipeta je bila še mokra od pomivanja z vodo: voda v njej je vzorec malo razredčila.";
  const ERL = "Erlenmajerico si splaknil z vzorcem: kapljice vzorca, ki so ostale v njej, dodajo kislino.";
  assert.equal(tit[4].done(c({ dnevnik: [PIP] })), true);
  assert.equal(tit[4].done(c({ dnevnik: [MOKRA, PIP] })), false, "mokra pipeta");
  assert.equal(tit[4].done(c({ dnevnik: [ERL, PIP] })), false, "erlenmajerica, splaknjena z vzorcem");
  assert.equal(tit[4].done(c({ dnevnik: [MOKRA, PIP, "Nadel si …", PIP] })), true, "drugo pipetiranje pravilno");
  assert.equal(tit[4].done(c({ dnevnik: [PIP.replace("klorovodikova kislina HCl", "ocetna kislina CH₃COOH")] })), false, "napačen vzorec");
  const IND = (x) => `V erlenmajerico si dodal 2 kapljici indikatorja: ${x} (prehod …).`;
  assert.equal(tit[5].done(c({ zadnji: zadnji([PIP, IND("fenolftalein")]) })), true);
  assert.equal(tit[5].done(c({ zadnji: zadnji([PIP, IND("metiloranž")]) })), false, "metiloranž");
  assert.equal(tit[5].done(c({ zadnji: zadnji([IND("fenolftalein"), PIP]) })), false, "indikator pred novim vzorcem");
  const ohm = KORAKI["lab-ohm"].koraki;
  const vr = (U, I, p = "100 Ω") => ({ porabnik: p, "U [V]": U, "I [mA]": I, "U/I [Ω]": "100" });
  const pet = ["2,0", "4,0", "6,0", "8,0", "10,0"].map((U) => vr(U, String(stevilo(U) * 10)));
  // Napoved pred meritvijo (lab.js → napoved, profil A): korak čaka na zapisano ali zaprto napoved.
  assert.equal(ohm[1].done(c({ napoved: () => false })), false);
  assert.equal(ohm[1].done(c({ napoved: (id) => id === "tok-6V" })), true);
  assert.equal(ohm[3].done(c({ vrstice: pet.slice(0, 4) })), false, "4 napetosti niso dovolj");
  assert.equal(ohm[3].done(c({ vrstice: pet })), true);
  assert.equal(ohm[3].done(c({ vrstice: [...pet.slice(0, 4), vr("10,0", "–")] })), false, "meritev brez toka ne šteje");
  // Sklep šteje le pravo vprašanje: odgovor o žarnici ne opravi koraka o uporniku.
  assert.equal(ohm[4].done(c({ sklep: (re) => re.test("Kaj kažejo tvoje meritve za žarnico?") })), false);
  assert.equal(ohm[4].done(c({ sklep: (re) => re.test("Kaj kažejo tvoje meritve za upornik?") })), true);
  const pad = KORAKI["lab-prosti-pad"].koraki;
  const h = (x) => ({ predmet: "kroglica", "h [m]": x, "t [s]": "0,3", "t² [s²]": "0,09", "v [m/s]": "–" });
  assert.equal(pad[2].done(c({ vrstice: ["0,20", "0,50", "1,00", "1,50", "2,00"].map(h) })), true);
  assert.equal(pad[2].done(c({ vrstice: ["0,20", "0,20", "0,50", "1,00", "1,50"].map(h) })), false, "ista višina dvakrat");

  {
  // ---- lab-elektroliza (public/sim/vodeno/lab-elektroliza.js)
  const el = KORAKI["lab-elektroliza"].koraki;
  const NAL = (x = "razredčena žveplova(VI) kislina 0,5 mol/L") => `V aparat si natočil tekočino: ${x}. Ko je tekočina do pip, pipi zapri.`;
  const UJET = "Natočil si tekočino (razredčena žveplova(VI) kislina 0,5 mol/L), a obe pipi sta bili zaprti: zrak je ostal ujet v cevi. Odpri pipo, da zrak uide, in jo nato zapri.";
  const PRAZ = "Aparat je prazen in spran.", MEH = "Na elektrodah se pojavijo mehurčki (napetost na aparatu 2,10 V, tok 120,0 mA).";
  const zaprti = (n) => (/^pipa/.test(n) ? "ne" : "");
  assert.equal(el[0].done(c({ dnevnik: [NAL()], par: zaprti })), true);
  assert.equal(el[0].done(c({ dnevnik: [NAL()], par: (n) => (n === "pipa levo odprta" ? "da" : "ne") })), false, "pipa odprta");
  assert.equal(el[0].done(c({ dnevnik: [NAL("razredčena žveplova(VI) kislina 1,0 mol/L")], par: zaprti })), false, "napačna koncentracija");
  assert.equal(el[0].done(c({ dnevnik: [NAL(), PRAZ], par: zaprti })), false, "aparat izpraznjen");
  assert.equal(el[0].done(c({ dnevnik: [UJET], par: zaprti })), false, "zrak ujet");
  assert.equal(el[0].done(c({ dnevnik: [UJET, "Pipa levo je odprta: plin je ušel, tekočina se je dvignila do pipe."], par: zaprti })), false, "zrak ujet še v desni cevi");
  assert.equal(el[0].done(c({ dnevnik: [UJET, "Pipa levo je odprta: plin je ušel, …", "Pipa desno je odprta: plin je ušel, …"], par: zaprti })), true);
  // Mehurčki pred praznjenjem ne štejejo za novo polnjenje.
  assert.equal(el[1].done(c({ dnevnik: [NAL(), MEH], zadnji: zadnji([NAL(), MEH]) })), true);
  assert.equal(el[1].done(c({ dnevnik: [NAL(), MEH, PRAZ, NAL()], zadnji: zadnji([NAL(), MEH, PRAZ, NAL()]) })), false, "mehurčki prejšnjega polnjenja");
  const vk = (t, I, V) => ({ "t [s]": t, "I [mA]": I, "V katoda (−) [mL]": V, "V anoda (+) [mL]": "–" });
  assert.equal(el[2].done(c({ dnevnik: [NAL()], vrstice: [vk("60", "120,3", "1,0"), vk("300", "120,5", "4,6"), vk("660", "120,8", "10,1")] })), true);
  assert.equal(el[2].done(c({ dnevnik: [NAL()], vrstice: [vk("60", "120,3", "1,0"), vk("300", "0,0", "4,6"), vk("660", "120,8", "10,1")] })), false, "pregorela varovalka: tok 0");
  assert.equal(el[2].done(c({ dnevnik: [NAL()], vrstice: [vk("60", "120,3", "1,0"), vk("300", "120,5", "4,6"), vk("600", "120,8", "9,2")] })), false, "manj kot 10 mL");
  // Zamenjava polov šteje le z vklopljenim napajalnikom in polnim aparatom (praznjenje napajalnik izklopi).
  const POL = "Leva elektroda je zdaj na pozitivnem polu (anoda), desna na negativnem (katoda).", ON = "Napajalnik je vklopljen.";
  const pol = (log) => el[6].done(c({ dnevnik: log, zadnji: zadnji(log) }));
  assert.equal(pol([NAL(), ON, POL]), true);
  assert.equal(pol([NAL(), ON, POL, "Leva elektroda je na negativnem polu (katoda), desna na pozitivnem (anoda)."]), false, "pola vrnjena");
  assert.equal(pol([NAL(), ON, POL, "Napajalnik je izklopljen."]), false, "napajalnik izklopljen");
  assert.equal(pol([NAL(), ON, POL, PRAZ]), false, "aparat prazen");
  // Preskusa plina štejeta le izid v pravi cevi (goreča trska v kisiku ne dokaže vodika).
  assert.equal(el[4].done(c({ bilo: (re) => re.test("Trska zagori svetleje: plin podpira gorenje (kisik).") })), false);
  assert.equal(el[4].done(c({ bilo: (re) => re.test("Plin ob goreči trski poči (pisk): v cevi je vodik.") })), true);
  }
  {
  // lab-grelnik: nalivanje in tehtanje v pravem vrstnem redu, izklop po 4 min, premešana končna T, ponovitev z novo vodo.
  const gre = KORAKI["lab-grelnik"].koraki;
  const NAL = (g) => `V čaši je sveža voda iz pipe (približno ${g} g). Stehtaj jo.`, TEH = "Tehtnica: 201,3 g vode.", ON = "Grelec je vklopljen, štoparica teče.";
  const OFF = (s) => `Grelec je izklopljen (segreval je ${s} s). Premešaj vodo in odčitaj najvišjo temperaturo.`, NEPR = "Voda ni premešana: termometer ob strani kaže manj od povprečne temperature.";
  const gc = (dn, o = {}) => c({ dnevnik: dn, zadnji: zadnji(dn), ...o });
  assert.equal(gre[0].done(gc([NAL(200), TEH])), true);
  assert.equal(gre[0].done(gc([TEH, NAL(200)])), false, "stehtal pred nalivanjem");
  assert.equal(gre[0].done(gc([NAL(300), TEH])), false, "300 g namesto 200 g");
  assert.equal(gre[3].done(gc([NAL(200), TEH, ON, OFF("120,0")])), false, "izklopil po 2 min");
  assert.equal(gre[3].done(gc([NAL(200), TEH, ON, OFF("120,0"), ON, OFF("305,2")])), true, "znova vklopil in izklopil po 5 min");
  const gv = (t, U, I, T) => ({ "t [s]": t, "U [V]": U, "I [A]": I, "T [°C]": T });
  const tek = [gv("0", "0,01", "-0,01", "15,0"), gv("30", "11,90", "4,10", "16,3"), gv("300", "11,90", "4,10", "29,0")];
  const dn5 = [NAL(200), TEH, ON, OFF("300,0")];
  assert.equal(gre[4].done(gc(dn5, { vrstice: [...tek, gv("330", "0,00", "0,02", "29,1")] })), false, "le samodejni zapis po izklopu");
  assert.equal(gre[4].done(gc([...dn5, NEPR], { vrstice: [...tek, gv("312,4", "0,00", "0,00", "28,2")] })), false, "ročni zapis brez mešanja");
  assert.equal(gre[4].done(gc([...dn5, NEPR], { vrstice: [...tek, gv("312,4", "0,00", "0,00", "28,2"), gv("320,6", "0,00", "0,00", "29,4")] })), true, "nato zapisal premešano");
  // Izkoristek iz tabele in dnevnika: 0,2013 kg · 4182 · 14,4 K / (11,90 V · 4,10 A · 300,0 s) = 82,8 %.
  const rac = (v) => gre[5].done(gc(dn5, { vrstice: [...tek, gv("320,6", "0,00", "0,00", "29,4")], par: (n) => (n === "tvoj rezultat [%]" ? v : "") }));
  assert.equal(rac("82,8"), true);
  assert.equal(rac("0,829"), false, "delež namesto odstotkov");
  assert.equal(rac(""), false);
  // Ponovitev: nova voda po prvem poskusu, pokrov in mešanje; samo ponovni vklop brez nove vode ni ponovitev.
  const nast = { "grelec je potopljen v vodo": "da", "napetost napajalnika": "12 V", "omejitev toka": "5 A", "pokrov na čaši": "da", "mešaj z mešalno palčko": "da" };
  const p8 = (dn) => gre[7].done(gc(dn, { par: (n) => nast[n] ?? "", num: (n) => stevilo(nast[n]) }));
  assert.equal(p8([...dn5, NAL(200), TEH, ON]), true);
  assert.equal(p8([...dn5, ON]), false, "brez nove vode");
  assert.equal(p8([NAL(200), TEH, ON]), false, "prvi poskus ni ponovitev");

  }
  {
  // lab-lom: kot od ploskve ne šteje, mejni kot ujet na 1°, račun lomnega količnika iz meritev (ne iz učbenika).
  const lom = KORAKI["lab-lom"].koraki;
  const lv = (smer, a, b) => ({ "snov, smer": smer, α: `${a} °`, odbojni: `${a} °`, β: typeof b === "number" ? `${String(b).replace(".", ",")} °` : b, "sin α": "", "sin β": "" });
  const lc = (vrstice, o = {}) => c({ vrstice, par: (n) => (n === "kot merim od" ? "vpadne pravokotnice" : ""), ...o });
  assert.equal(lom[1].done(lc([lv("zrak → akril", 10, 6.5)])), true);
  assert.equal(lom[1].done(lc([lv("zrak → akril", 10, 83.5)])), false, "kot od ploskve: β > α");
  assert.equal(lom[1].done(lc([lv("zrak → akril", 10, 6.5)], { par: () => "ploskve" })), false, "meri od ploskve");
  assert.equal(lom[6].done(lc([lv("akril → zrak", 41, 78), lv("akril → zrak", 42, 85.5), lv("akril → zrak", 43, "popolni odboj")])), true);
  assert.equal(lom[6].done(lc([lv("akril → zrak", 41, 78), lv("akril → zrak", 43, "popolni odboj")])), false, "mejni kot ujet le na 2°");
  // Akril z n = 1,45 (izmerjeno): 1,45 šteje, 1,49 iz učbenika ne, prav tako ne izbrana druga serija.
  const n145 = [10, 20, 30, 40, 50, 60, 70, 80].map((a) => lv("zrak → akril", a, (Math.asin(Math.sin((a * Math.PI) / 180) / 1.45) * 180) / Math.PI));
  const lr = (v, izbira = "") => lom[4].done(lc(n145, { par: (n) => ({ "tvoj rezultat": v, "kaj računaš": izbira, "kot merim od": "vpadne pravokotnice" })[n] ?? "" }));
  assert.equal(lr("1,45"), true);
  assert.equal(lr("1,49"), false, "vrednost iz učbenika");
  assert.equal(lr("1,45", "akril → zrak"), false, "računa drugo serijo");
  }
});

test("usage counter: anonymous daily counts per experiment, mode and event; only known values", () => {
  const db = new DatabaseSync(":memory:");
  const routes = {};
  const app = { get: (p, f) => (routes[`GET ${p}`] = f), post: (p, f) => (routes[`POST ${p}`] = f) };
  mountLab(app, { loadStudent: (req) => ({ id: Number(req.params.id) }), accounts: null, db, isAdmin: (req) => !!req.admin });
  const call = (body, id = 1) => {
    let code = 200, out = null;
    const res = { status: (c) => ((code = c), res), json: (o) => ((out = o), res) };
    routes["POST /api/students/:id/lab/uporaba"]({ params: { id }, body }, res);
    return { code, out };
  };
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }).code, 200);
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }).code, 200); // isti v 10 s: enkrat
  call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }, 2);
  call({ key: "lab-ohm", nacin: "vodeno", dogodek: "koncano" }, 2);
  call({ key: "lab-co2", nacin: "brez", dogodek: "odprt" });
  assert.equal(call({ key: "lab-ne-obstaja", nacin: "vodeno", dogodek: "odprt" }).code, 400);
  assert.equal(call({ key: "lab-ohm", nacin: "x", dogodek: "odprt" }).code, 400);
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "x" }).code, 400);
  const r = labUporaba(db);
  assert.equal(r.skupaj, 3);
  assert.deepEqual(r.poskusi[0], { poskus: "lab-ohm", odprt: 2, vodeno: 2, prosto: 0, preklopi: 0, koncano: 1 });
  // Brez stolpca z učencem: tabela nima osebnih podatkov.
  const cols = db.prepare("PRAGMA table_info(lab_uporaba)").all().map((x) => x.name);
  assert.deepEqual(cols, ["dan", "poskus", "nacin", "dogodek", "n"]);
  let code = 0;
  routes["GET /api/admin/laboratorij"]({ query: {} }, { status: (c) => ((code = c), { json() {} }), json() {} });
  assert.equal(code, 403);
  migrateLab(db); // drugič brez napake
  assert.deepEqual(NACINI, ["vodeno", "prosto", "brez"]);
  assert.deepEqual(DOGODKI, ["odprt", "preklop", "koncano"]);
});

// ---------------------------------------------------------------- v brskalniku
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});
after(() => browser?.close());

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/lab.css"><link rel="stylesheet" href="/textbook.css">
<style>body{margin:0;display:flex;flex-direction:column;height:100dvh}header{height:56px;flex:none;background:#ddd}#v{flex:1;min-height:0;overflow-y:auto;padding:24px 16px 48px}</style>
<header></header><main id="v" class="lab-view"><h2>Poskus</h2><section class="card lab-bench"><div id="m"></div></section></main>
<script type="module">
import { mountSim } from "/sim/index.js";
import { vodi } from "/sim/lab-vodeno.js";
const m = document.getElementById("m");
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
window.wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Čaka, dokler pogoj ne velja (najdlje ms): počasen strežnik v CI ne sme podreti igre.
window.dokler = async (f, ms = 15000) => {
  const t0 = performance.now();
  while (!f()) {
    if (performance.now() - t0 > ms) throw new Error("ni dočakal: " + f.toString().slice(0, 80));
    await wait(50);
  }
};
window.vrstic = () => m.querySelectorAll("table.lab-table tbody tr").length;
window.zadnjiDnevnik = () => (m.querySelector(".lab-log li")?.textContent || "");
window.mount = async (id, nacin = "vodeno") => {
  await mountSim(id, m, {});
  window.konec = 0;
  window.vod = vodi(m, id, { nacin, onKonec: () => window.konec++ });
  await frame();
};
const txt = (e) => (e.textContent || "").replace(/\\s+/g, " ").trim();
const ctl = () => m.querySelector(".demo-controls");
window.klik = async (t) => {
  const b = [...m.querySelectorAll("button")].find((x) => !x.closest(".lab-vod-wrap") && txt(x).startsWith(t) && !x.disabled);
  if (!b) throw new Error("ni gumba " + t);
  b.click();
  await wait(120);
};
window.stikalo = async (t, on = true) => {
  const l = [...m.querySelectorAll(".demo-check")].find((x) => txt(x).startsWith(t));
  if (!l) throw new Error("ni stikala " + t);
  const c = l.querySelector("input");
  if (c.checked !== on) c.click();
  await wait(120);
};
window.drsnik = async (t, v) => {
  const lab = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith(t));
  const r = lab?.parentElement.querySelector('input[type="range"]');
  if (!r) throw new Error("ni drsnika " + t);
  r.value = String(v);
  r.dispatchEvent(new Event("input", { bubbles: true }));
  r.dispatchEvent(new Event("change", { bubbles: true }));
  await wait(120);
};
window.izbira = async (t, besedilo) => {
  const lab = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x) === t);
  const box = lab?.parentElement;
  const sel = box?.querySelector("select");
  if (sel) {
    const o = [...sel.options].find((x) => txt(x).startsWith(besedilo));
    sel.value = o.value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    const b = [...(box?.querySelectorAll(".seg-btn") || [])].find((x) => txt(x).startsWith(besedilo));
    if (!b) throw new Error("ni izbire " + t + " " + besedilo);
    b.click();
  }
  await wait(120);
};
window.vpisi = async (aria, v) => {
  const i = m.querySelector('input[aria-label="' + aria + '"]');
  i.value = v;
  i.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(60);
};
// Vprašanje »Sklep«: klikne možnosti po vrsti, dokler ena ni pravilna (kot učenec, ki poskuša).
window.sklep = async (n) => {
  const q = m.querySelectorAll(".lab-q")[n];
  if (!q) throw new Error("ni sklepa " + n);
  for (const b of q.querySelectorAll(".lab-opt")) {
    if (q.querySelector(".lab-opt.ok")) break;
    b.click();
    await wait(60);
  }
  await wait(120);
};
window.stanje = () => ({ korak: vod.korak, konec, oznaka: txt(m.querySelector(".lab-vod-oznaka") || {}), naslov: txt(m.querySelector(".lab-vod h3") || {}), skrita: !!m.querySelector(".lab-vod")?.hidden, cilji: m.querySelectorAll(".lab-vod-cilj").length, prvi: ctl()?.firstElementChild?.className });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-vod.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// Igra vsakega vodenega poskusa: zaporedje dejanj, po katerem morajo biti opravljeni vsi koraki.
const IGRA = {
  "lab-titracija": async () => {
    await stikalo("zaščitna očala");
    await klik("Speri bireto");
    await klik("Napolni bireto");
    await klik("Izpusti zrak");
    await stikalo("pipeto prej speri");
    for (const [r1, r2] of [["0,50", "20,50"], ["0,55", "20,60"]]) {
      await klik("Odpipetiraj");
      await dokler(() => /S propipeto si/.test(zadnjiDnevnik()));
      await klik("Dodaj 2 kapljici");
      await vpisi("odčitek birete v mililitrih", r1);
      await klik("Zapiši");
      await dokler(() => /Začetni odčitek/.test(zadnjiDnevnik()));
      const n = vrstic();
      for (let k = 0; k < 20 && vrstic() === n; k++) {
        // kapljica mora v erlenmajerico, preden je končni odčitek veljaven
        await klik("1 kapljica");
        await wait(400);
        await vpisi("odčitek birete v mililitrih", r2);
        await klik("Zapiši");
      }
    }
    await vpisi("izračunana koncentracija kisline v mol na liter", "0,0801"); // 0,1000 · 20,025 / 25,00
    await klik("Preveri koncentracijo");
  },
  "lab-ohm": async () => {
    // Merilnika odčitata vsakih 0,4 s simuliranega časa: počakaj, da voltmeter kaže novo napetost.
    const volt = () => stevilo([...document.querySelectorAll(".lab-lcd")].find((x) => /voltmeter/.test(x.textContent))?.querySelector(".lab-lcd-val")?.textContent);
    const stevilo = (t) => Number(String(t || "").replace(",", "."));
    const meri = async (U) => {
      await drsnik("napetost napajalnika", U);
      await dokler(() => Math.abs(volt() - U) < 0.3);
      await klik("Zapiši meritev");
    };
    await drsnik("napetost napajalnika", 2);
    // Napoved pred prvo meritvijo (lab.js → napoved): 6 V / 100 Ω = 60 mA. Brez nje vodenje ne gre naprej.
    await wait(300);
    if (vod.korak !== 1) throw new Error("pred napovedjo korak " + (vod.korak + 1));
    await vpisi("tvoja napoved v mA", "60");
    await klik("Zapiši napoved");
    await wait(300);
    if (vod.korak !== 2) throw new Error("po napovedi korak " + (vod.korak + 1));
    for (const U of [2, 4, 6, 8, 10]) await meri(U);
    await sklep(0);
    await drsnik("napetost napajalnika", 1);
    await izbira("ampermeter", "vzporedno");
    await wait(600);
    await izbira("ampermeter", "zaporedno");
    if ([...document.querySelectorAll(".lab-ev")].some((x) => /pregorela varovalka/.test(x.textContent))) await klik("Zamenjaj varovalko");
    await izbira("porabnik", "žarnica");
    for (const U of [1, 2, 4, 6]) await meri(U);
    await sklep(1);
  },
  "lab-prosti-pad": async () => {
    // Zapiše, ko je predmet padel (»Počakaj, da predmet pade« = še ne): ponavlja, dokler ni nove vrstice.
    const spusti = async (cm) => {
      await drsnik("vrata pod predmetom", cm);
      await klik("Spusti");
      const n = vrstic();
      for (let k = 0; k < 100 && vrstic() === n; k++) {
        await wait(200);
        await klik("Zapiši meritev");
      }
    };
    for (const cm of [20, 50, 100, 150, 200]) await spusti(cm);
    await sklep(0);
    await izbira("predmet", "filter");
    await izbira("spust", "klešče");
    for (const cm of [50, 100, 150]) await spusti(cm); // filter pade do tal s končno hitrostjo ~1 m/s
    await sklep(1);
  },
};
// Faza 2: igra vsakega poskusa v svoji datoteki (export default async () => { … }), da jih lahko piše več avtorjev hkrati.
const IGRE_DIR = new URL("./vodeno/", import.meta.url);
for (const f of fs.existsSync(IGRE_DIR) ? fs.readdirSync(IGRE_DIR).filter((x) => x.endsWith(".js")).sort() : [])
  IGRA[path.basename(f, ".js")] = (await import(new URL(f, IGRE_DIR))).default;
// VODENO_SAMO=lab-hooke,lab-lom: odigra le te (med pisanjem korakov).
const SAMO = (process.env.VODENO_SAMO || "").split(",").filter(Boolean);

test("guided experiments play through to the end in a real browser", { timeout: 900000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => server.close());
  // Zmanjšano gibanje: pipetiranje v titraciji je takojšnje (sicer 3 s, med katerimi pipa birete ne teče).
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", locale: "sl-SI" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/t-vod.html`);
  await page.waitForFunction(() => window.ready);
  for (const [key, play] of Object.entries(IGRA)) {
    if (SAMO.length && !SAMO.includes(key)) continue;
    await t.test(key, async () => {
      await page.evaluate((k) => mount(k), key);
      const s0 = await page.evaluate(() => stanje());
      const n = KORAKI[key].koraki.length;
      assert.equal(s0.korak, 0, `${key}: začne pri prvem koraku`);
      assert.equal(s0.oznaka.startsWith(`Korak 1 od ${n}`), true, `${key}: ${s0.oznaka}`);
      assert.equal(s0.prvi, "lab-vod-wrap", `${key}: kartica je na vrhu kontrol`);
      if (KORAKI[key].koraki[0].poudari) assert.ok(s0.cilji >= 1, `${key}: prvi korak obkroži kontrolo`);
      await page.evaluate(`(${play.toString()})()`);
      await page.waitForTimeout(900);
      const s = await page.evaluate(() => stanje());
      assert.equal(s.korak, n, `${key}: obstal pri koraku ${s.korak + 1} »${s.naslov}«`);
      assert.equal(s.konec, 1, `${key}: konec javljen enkrat`);
      assert.match(s.oznaka, /opravljeno/);
      assert.equal(s.cilji, 0);
    });
  }
  assert.deepEqual(errors, []);
});

test("Prosto hides the card; Ponastavi starts the guide again; phone: no sideways scroll", { timeout: 120000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => server.close());
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: "sl-SI" });
  const page = await ctx.newPage();
  await page.goto(`${base}/t-vod.html`);
  await page.waitForFunction(() => window.ready);
  await page.evaluate(() => mount("lab-titracija"));
  await page.evaluate(() => stikalo("zaščitna očala"));
  await page.waitForTimeout(300);
  assert.equal((await page.evaluate(() => stanje())).korak, 1);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(over <= 0, `vodoravno drsenje ${over} px`);
  // risba ostane pripeta (lab.js → pripni) tudi s kartico na vrhu kontrol
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".lab-tit-top > .demo-stage")).position), "sticky");
  // »Pokaži, kje«: obkrožena kontrola pride v pogled pod pripeto risbo, ne podnjo.
  await page.evaluate(() => document.querySelector(".lab-vod-kje").click());
  await page.waitForTimeout(900);
  const kje = await page.evaluate(() => {
    const el = document.querySelector(".lab-vod-cilj"), st = document.querySelector(".lab-tit-top > .demo-stage"), v = document.getElementById("v");
    const r = el.getBoundingClientRect(), s = st.getBoundingClientRect(), p = v.getBoundingClientRect();
    return { pod: r.top >= s.bottom - 2, vidno: r.bottom <= p.bottom + 1, txt: el.textContent.trim().slice(0, 30) };
  });
  assert.ok(kje.pod && kje.vidno, `»Pokaži, kje« (${kje.txt}): ${JSON.stringify(kje)}`);
  await page.click(".lab-vod-nacin .seg-btn[data-v=prosto]");
  await page.waitForTimeout(200);
  let s = await page.evaluate(() => stanje());
  assert.equal(s.skrita, true);
  assert.equal(s.cilji, 0);
  await page.click(".lab-vod-nacin .seg-btn[data-v=vodeno]");
  await page.click(".demo-reset");
  await page.waitForTimeout(1200);
  s = await page.evaluate(() => stanje());
  assert.equal(s.korak, 0, "po »Ponastavi« znova od začetka");
  assert.equal(s.prvi, "lab-vod-wrap", "kartica je spet na vrhu novih kontrol");
  assert.equal(s.skrita, false);
});
