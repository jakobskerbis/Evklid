// PV-06 (docs/preverjanje.md, »Preverjevalnik korakov«): ukaz SymPy »korak« presodi en prehod reševanja.
// Merilo načrta: 50 znanih napačnih prehodov ujetih, 0 lažnih alarmov na 200 pravilnih (koraki-v1.json).
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { casCheck, casAvailable, casStop } from "../server/cas.js";
import { izmeriKorake, povzemiKorake, neuspehiKorakov, NABOR_KORAKI } from "../scripts/meri-korake.mjs";

const HAVE = await casAvailable();
after(() => casStop());
const skip = !HAVE && "SymPy ni na voljo";
const korak = (...a) => casCheck("korak", a);

test("korak: enakovreden, posledica, izguba in napaka", { skip }, async () => {
  let r = await korak("2x+3=7", "2x=4");
  assert.deepEqual([r.ok, r.vrsta, r.how], [true, "ekvivalenca", "symbolic"]);
  // deljenje z x: izgubljena rešitev in namig, s čim je bilo deljeno
  r = await korak("x^2=x", "x=1");
  assert.deepEqual([r.ok, r.vrsta], [false, "izguba"]);
  assert.match(r.why, /x = 0/);
  assert.match(r.why, /deljenje z x/);
  // kvadriranje: tuja rešitev je dovoljena kot vmesni korak (posledica), why jo našteje
  r = await korak("sqrt(x+2)=x", "x+2=x^2");
  assert.deepEqual([r.ok, r.vrsta], [true, "posledica"]);
  assert.match(r.why, /x = -1/);
  // v končnem odgovoru pa je tuja rešitev napaka (manjka preizkus)
  r = await korak("x^2-6x+9=0", "x=3 ali x=-3");
  assert.deepEqual([r.ok, r.vrsta], [false, "napaka"]);
  r = await korak("x/(x-1)=1/(x-1)", "x=1");
  assert.equal(r.ok, false);
  // neenačba: pozabljen obrat znaka
  r = await korak("-2x<4", "x<-2");
  assert.deepEqual([r.ok, r.vrsta], [false, "napaka"]);
  assert.equal((await korak("-2x<4", "x>-2")).ok, true);
  // dvojna neenačba in »ali«
  assert.equal((await korak("x^2<4", "-2<x<2")).ok, true);
  assert.equal((await korak("(x-1)(x+2)=0", "x-1=0 ali x+2=0")).ok, true);
});

test("korak: definicijsko območje", { skip }, async () => {
  // ln(x²) = 2 ln x velja le za x > 0: izguba rešitve -e
  let r = await korak("ln(x^2)=2", "2 ln(x)=2");
  assert.deepEqual([r.ok, r.vrsta], [false, "izguba"]);
  assert.equal((await korak("ln(x^2)=2", "2 ln(abs(x))=2")).ok, true);
  // združevanje logaritmov razširi območje: posledica s tujo rešitvijo -1
  r = await korak("log(x)+log(x-1)=log(2)", "log(x(x-1))=log(2)");
  assert.deepEqual([r.ok, r.vrsta], [true, "posledica"]);
  // x²/x: pogoj x ≠ 0 se prebere pred okrajšanjem
  r = await korak("x^2/x=0", "x=0");
  assert.equal(r.ok, false);
  r = await korak("x^2/x", "x");
  assert.deepEqual([r.ok, r.vrsta], [true, "ekvivalenca"]);
  assert.match(r.why, /x ≠ 0/);
  // izraz: novi ni definiran, kjer prvotni je
  r = await korak("ln(x^2)", "2ln(x)");
  assert.deepEqual([r.ok, r.vrsta], [false, "izguba"]);
  // z območjem x > 0 pa je isti korak pravilen
  assert.equal((await korak("ln(x^2)", "2ln(x)", "x", "x>0")).ok, true);
  // kotna enačba na [0, 2π)
  assert.equal((await korak("sin(x)=1/2", "x=pi/6 ali x=5pi/6", "x", "[0, 2*pi)")).ok, true);
  assert.equal((await korak("sin(x)=1/2", "x=pi/6", "x", "[0, 2*pi)")).ok, false);
});

test("korak: izrazi in parametri", { skip }, async () => {
  assert.equal((await korak("(a+b)^2", "a^2+2ab+b^2")).ok, true);
  assert.equal((await korak("(a+b)^2", "a^2+b^2")).ok, false);
  assert.equal((await korak("sqrt(x^2)", "x")).ok, false);
  assert.equal((await korak("sqrt(a*b)", "sqrt(a)*sqrt(b)")).ok, false);
  // enačba s parametrom: korak pomnoži obe strani s številom
  assert.equal((await korak("a*x+b=0", "a*x=-b", "x")).ok, true);
  // česar ne zna, ne sodi
  assert.equal((await korak("x=1", "x+1")).ok, null);
});

// Ugotovitve pregleda PV-06 (dva ločena agenta AI): nobena ne sme več dati ok true na napačnem koraku.
test("korak: parametri, log z osnovo, dolga perioda, lihi koren, zoženo območje", { skip }, async () => {
  const ok = async (...a) => (await korak(...a)).ok;
  // parameter v imenovalcu ali kot delitelj: solveset predpostavi splošen primer, zato brez sodbe
  assert.equal(await ok("x/(a+1)=2", "x-5=0", "x"), null);
  assert.equal(await ok("a*x=a", "x=1", "x"), null);
  assert.equal(await ok("v=s/t", "s=v*t", "s"), null);
  // vejica med argumenti log(·, ·) ni decimalna; tudi v drugih ukazih
  assert.equal(await ok("log(x-2,2)=3", "x-2=8"), true);
  assert.equal(await ok("log(x+1,2)<3", "-1<x<7"), true);
  assert.equal((await casCheck("value", ["log(8,2)", "3"])).ok, true);
  // log v zapisu ne izbriše pogojev območja
  assert.equal(await ok("log(2)*x^2/x=0", "x=0"), false);
  // logaritem z osnovo: Complement(ConditionSet) gre še skozi logcombine
  assert.equal(await ok("log(x+1,10)-log(x,10)=1", "x+1=10x"), true);
  // dolga perioda: okno [−20, 20] ne zadošča
  assert.equal(await ok("sin(pi*x/30)=0", "x=0"), null);
  assert.equal(await ok("cos(x/10)=0", "x=5pi ali x=-5pi"), null);
  // x^(1/3) negativnega števila: SymPy vzame glavni koren, šola realnega
  assert.equal(await ok("x^(1/3)=-2", "x=-8"), null);
  // izraz z ožjim območjem je izguba
  const r = await korak("x+1", "(x^2-1)/(x-1)");
  assert.deepEqual([r.ok, r.vrsta], [false, "izguba"]);
  // »or« in »x = 2, -2«
  assert.equal(await ok("x=1 or x=2", "x=2 ali x=1"), true);
  assert.equal(await ok("x^2=4", "x=2,-2"), true);
});

test("korak: slepi nabor (0 potrjenih napačnih, 0 lažnih alarmov)", { skip, timeout: 300_000 }, async () => {
  const nabor = JSON.parse(readFileSync(new URL("./fixtures/preverjanje/koraki-slepi-v1.json", import.meta.url), "utf8"));
  const izid = await izmeriKorake(nabor);
  assert.deepEqual(
    neuspehiKorakov(izid).map((r) => `${r.id} ${r.prej} → ${r.potem}: ${r.ok}/${r.vrsta}`),
    [],
  );
});

test("korak: nabor koraki-v1 (50 napačnih ujetih, 0 lažnih alarmov na 200 pravilnih)", { skip, timeout: 300_000 }, async () => {
  const nabor = JSON.parse(readFileSync(NABOR_KORAKI, "utf8"));
  assert.equal(nabor.napacni.length, 50);
  assert.equal(nabor.pravilni.length, 200);
  const izid = await izmeriKorake(nabor);
  const m = povzemiKorake(izid);
  assert.deepEqual(
    neuspehiKorakov(izid).map((r) => `${r.id} ${r.prej} → ${r.potem}: ${r.ok}/${r.vrsta}`),
    [],
  );
  assert.equal(m.ujeti.k, 50);
  assert.equal(m.lazniAlarmi.k, 0);
});
