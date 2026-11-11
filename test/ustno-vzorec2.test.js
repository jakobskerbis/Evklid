// Ustno spraševanje: pravila iz drugega vsebinskega pregleda vzorca (PR #564, 10. 11. 2026). Vsak primer (#) iz poročila
// ima tu svoj test. Besedila primerov so prepisana iz vzorca; primeri, ki jih reši ročni pregled (server/ustno-pregled.json),
// se preverijo na pravih lekcijah.
import test from "node:test";
import assert from "node:assert/strict";
import {
  lessonQuestions, questionProblem, keyPoints, finalResult, practiceQuestion, pruneNumbers, pruneNames, resultStatus, reviewed, reviewFile, textHash, REF_RE, ORIGIN_RE, foreignName,
} from "../server/ustno.js";
import { loadLesson } from "../server/textbook.js";

const premisli = (q, a) => ({ sections: [{ title: "Razlaga", md: `:::premisli\n${q}\n---\n${a}\n:::` }] });
const napaka = (naslov, text) => ({ sections: [{ title: "Pogoste napake", md: `- **${naslov}.** ${text}` }] });
const raw = (lesson) => lessonQuestions("T/x", lesson, "x", { raw: true })[0];
const auto = (lesson) => lessonQuestions("T/x", lesson, "x", { pregled: false });
const real = (id) => {
  const t = id.split("#")[0];
  return lessonQuestions(t, loadLesson(t), "x").find((q) => q.id === id);
};
const realRaw = (id) => {
  const t = id.split("#")[0];
  return lessonQuestions(t, loadLesson(t), "x", { pregled: false }).find((q) => q.id === id);
};

test("pravilo 1: pogosta napaka z izvorom napake vpraša tudi po vzroku (#8, #11, #21, #24, #26)", () => {
  const cases = [
    ["Inzulin zviša krvni sladkor", "Ker se o inzulinu govori ob sladkorju, ga učenci zamenjajo z glukagonom. Inzulin glukozo **zniža**, glukagon jo **zviša**. Pomagaj si: inzulin celicam »odpre vrata« za glukozo, zato je v krvi ostane manj."], // #8
    ["Prvi organizmi so dihali kisik", "Ker danes skoraj vse okrog nas diha kisik, se zdi, da je bilo vedno tako. Prvotna atmosfera pa kisika ni imela. Prvi organizmi so bili anaerobni, kisik so šele kasneje sprostile cianobakterije."], // #11
    ["Višja frekvenca, večja hitrost", "Učenec misli, da hitreje nihajoče valovanje tudi hitreje potuje. V vakuumu imajo vsa elektromagnetna valovanja hitrost $c$. Višja frekvenca pomeni le krajšo valovno dolžino."], // #21
    ["Rdeča je vroča, modra hladna", "Tako je označeno na pipi. Pri zvezdah je obratno: po Wienovem zakonu toplejše telo seva pri krajši valovni dolžini, zato so modre zvezde najtoplejše."], // #24
    ["Napačen naboj iona", "Kdo napiše $\\mathrm{Mg^+}$, ker »kovine dajo $1+$«, ali $\\mathrm{Mg^{2-}}$, ker »sprejme dva elektrona«. Kovina elektrone odda, zato je ion pozitiven, naboj pa je enak številu zunanjih elektronov: 1. skupina $1+$, 2. skupina $2+$."], // #26
  ];
  for (const [naslov, text] of cases) {
    const q = auto(napaka(naslov, text))[0];
    assert.ok(q, naslov);
    assert.match(q.besedilo, /«\. Zakaj se ljudje tako zmotijo, kaj je narobe in kako je prav\?$/, naslov);
    assert.ok(q.pojmi.some((p) => ORIGIN_RE.test(p)), naslov);
  }
  // #26: »Kdo napiše« → »Kdor napiše«
  assert.match(auto(napaka(...cases[4]))[0].pojmi[0], /^Kdor napiše/);
  // brez pojma o izvoru ostane »Pojasni …«, z ločilom za naslovom (premor pri branju na glas)
  const q = auto(napaka("Vsaka odvisnost je linearna", "Če prva dva koraka prineseta enako spremembo, to še ne pomeni, da se bo tako nadaljevalo. Izračunaj spremembe na vseh korakih in preveri, ali so enake."))[0];
  assert.match(q.besedilo, /«\. Pojasni, kaj je tu narobe in kako je prav\.$/);
});

test("pravilo 1/5: pojem, ki ne odgovarja na vprašanje, odstrani ročni pregled (#32, #49)", () => {
  const file = reviewFile();
  // #32: fosfor ob vprašanju o železu in kalciju
  const id32 = "KEM-SS-2/elementi-v-bioloskih-sistemih#n2";
  const q32 = real(id32);
  if (q32 && file[id32]?.h === q32.hn) {
    assert.equal(q32.pojmi.length, 2);
    assert.ok(!q32.pojmi.some((p) => /fosfor/i.test(p)));
  }
  // #49 (= #51 vzorca 1): Fermi, pojma o faktorju 10 in »pazi na velike zgrešitve« sta nevprašana
  const q49 = real("MAT-TEK-OS/ocenjevanje-in-fermijeve-naloge#p1");
  assert.ok(!q49 || (q49.pojmi.length === 2 && !q49.pojmi.some((p) => /faktor|zgrešitve/.test(p))));
});

test("pravilo 2: REF_RE »preden bereš«, »bereš naprej«, »Napovej, preden« (#23, #41, #48)", () => {
  for (const t of ["Napovej, preden bereš naprej.", "Kaj misliš, preden bereš?", "Ugani, nato bereš naprej.", "Napovej, preden računaš."]) assert.ok(REF_RE.test(t), t);
  // #23, #41: stavek »Napovej, preden bereš naprej.« na koncu odpade, vprašanje ostane
  const q23 = raw(premisli("Satelit kroži $6370\\,\\mathrm{km}$ nad površjem Zemlje. Kolikšen del svoje teže na tleh ima tam? Napovej, preden bereš naprej.", "Četrtino. Višina nad površjem je en Zemljin polmer, zato je satelit od središča oddaljen $2 R_Z$. Razdalja od središča se je podvojila, sila pa je zato štirikrat manjša."));
  assert.equal(q23.besedilo, "Satelit kroži $6370\\,\\mathrm{km}$ nad površjem Zemlje. Kolikšen del svoje teže na tleh ima tam?");
  const q41 = auto(premisli("Na premici označiš $\\dfrac{3}{4}$. Ali bo $\\dfrac{6}{8}$ levo od te točke, desno od nje ali na isti točki? Napovej, preden bereš naprej.", "Na isti točki. Če vsako četrtino prerežeš na pol, dobiš osmine. Tri četrtine so tako šest osmin, dolžina se ne spremeni."))[0];
  assert.ok(q41 && !/preden/.test(q41.besedilo));
  // sredi besedila ostane sklic: vprašanje se izloči
  assert.equal(questionProblem(raw(premisli("Preden bereš naprej, povej, ali bo $\\dfrac{6}{8}$ na isti točki kot $\\dfrac{3}{4}$.", "Na isti točki. Če vsako četrtino prerežeš na pol, dobiš osmine."))), "sklic");
  // #48 (»v razlikah«, »napovej …, preden računaš«) izloči ročni pregled (test spodaj)
});

test("pravilo 4: pruneNumbers ne zavrže pojma z razlogom, le števila v oklepaju (#71)", () => {
  const lesson = premisli(
    "Zakaj parna elektrarna stiska vodo kot kapljevino in ne kot paro? Kaj bi se zgodilo z izkoristkom, če bi paro stiskali s kompresorjem kot plinska turbina?",
    "Delo stiskanja je $\\int v\\,dp$; kapljevina ima sto- do več tisočkrat manjšo specifično prostornino kot para (pri $0{,}1\\,\\mathrm{bar}$ okoli $14\\,000$-krat), zato črpalka porabi le nekaj kJ/kg. Pri stiskanju pare bi kompresor požrl velik del dela turbine, kot pri Jouleovem procesu, in izkoristek bi močno padel.",
  );
  const q = pruneNumbers(raw(lesson));
  assert.equal(q.pojmi.length, 3);
  const key = q.pojmi.find((p) => /kapljevina/.test(p));
  assert.ok(key && /zato črpalka porabi/.test(key) && !/14|0\{,\}1/.test(key), key);
  assert.equal(questionProblem(q), null);
  // pojem brez razloga s tujo količino še vedno odpade (#48 vzorca 1)
  assert.equal(auto(premisli("Zakaj je povprečna hitrost $48\\,\\mathrm{km/h}$ bližje $40$ kot $60$?", "Ker kombi s $40\\,\\mathrm{km/h}$ vozi dlje časa: $3$ ure, s $60\\,\\mathrm{km/h}$ pa le $2$ uri. Povprečna hitrost upošteva, koliko časa vozi s posamezno hitrostjo.")).length, 0);
});

test("pravilo 8: celoštevilski rezultat mora biti točen, decimalni na podana mesta (#61)", () => {
  const q61 = "Celica ima 100 molekul alanina in 100 molekul α-ketoglutarata. Koliko amino skupin je v celici po popolni transaminaciji?";
  const r = finalResult("Še vedno 100. Transaminacija amino skupine samo premesti z alanina na glutamat. Za odstranitev dušika je potreben drug korak.", q61);
  assert.equal(r.value, 100);
  assert.equal(resultStatus(r, "100", "").status, "povedal");
  for (const x of ["99", "101"]) assert.notEqual(resultStatus(r, x, "").status, "povedal", x);
  // decimalke: zaokroževanje na mesta vzorca (42,29 ± 0,005)
  const d = finalResult("$x = 42{,}29$.", "Koliko je x?");
  assert.equal(resultStatus(d, "42,29", "").status, "povedal");
  assert.notEqual(resultStatus(d, "42,3", "").status, "povedal");
  assert.notEqual(resultStatus(d, "42,2", "").status, "povedal");
  // »približno« pri celem številu: zaokrožen rezultat (pol enote) sprejmemo, sosednjega celega ne
  const a = finalResult("Približno $16$ sponk.", "Koliko sponk?");
  assert.equal(resultStatus(a, "16,3", "").status, "povedal");
  assert.notEqual(resultStatus(a, "17", "").status, "povedal");
});

test("pravilo 7: ime iz zgodbe v vzorcu ali pojmu, ki ga vprašanje ne omeni, odpade (#37)", () => {
  const q37 = auto(premisli("Kolikšna je vrednost izraza $8x + y$ za $x = 3$ in $y = -2$?", "$8 \\cdot 3 + (-2) = 24 - 2 = 22$. Lara ima $22$ točk."))[0];
  assert.equal(q37?.vrsta, "izracunaj");
  assert.equal(q37.odgovor.value, 22);
  assert.ok(!/Lara/.test(q37.vzorec), q37.vzorec);
  assert.equal(foreignName("Lara ima 22 točk", "Kolikšna je vrednost izraza?"), "Lar");
  // isto ime v drugem sklonu ni tuje (»Ana« / »Aninega«); beseda »Domena« ni ime
  assert.equal(foreignName("Od Aninega denarja odvzemi 5", "Bor ima manj kot Ana"), null);
  assert.equal(foreignName("Domena pove, o čem govorimo", "Kaj je domena?"), null);
  // pojem z imenom iz zgodbe odpade, če ostaneta vsaj dva
  const q = pruneNames({ vrsta: "napaka", besedilo: "Pogosta napaka: »Vsota časov«", vzorec: "x", pojmi: ["Časi skupnega dela se ne seštevajo", "To je Žanova napaka: pozabi na obratno vrednost", "Sešteješ deleže dela na uro"] });
  assert.equal(q.pojmi.length, 2);
});

test("pravilo 6: formula generatorja ni pojem poti pri Vadnici (#77, #79)", () => {
  for (const id of ["MAT-SS-2/eksponentna-funkcija", "MAT-SS-4/limita-in-zveznost-funkcije"]) {
    const q = practiceQuestion(id, 4242);
    assert.ok(q, id);
    assert.equal(q.pojmi[0], "Pravilna pot do rezultata", id);
  }
});

test("ročni pregled :::premisli: izločena vprašanja niso ponujena (#7, #16, #34, #48, #54, #66)", () => {
  const file = reviewFile();
  for (const id of [
    "BIO-SS-2/mehanizmi-evolucije#p0", // #7 »razlaga z navajanjem«
    "FIZ-OS-8/merske-napake#p0", // #16 pet meritev
    "KEM-SS-1/urejanje-enacb#p0", // #34 »ta popravek«, blisk
    "MAT-SS-1/algebrski-izrazi#p0", // #48 »v razlikah«
    "MAT-TEK-OS/stetje-poti-in-likov#p1", // #54 robot
    "UNI-ULFS-PDEKOMPL/linearno-programiranje#p1", // #66 pice, pite
  ]) {
    assert.equal(real(id), undefined, id);
    const q = realRaw(id);
    // dokler je besedilo v lekciji enako, je v pregledu izločeno z razlogom
    if (q?.h && file[id]?.h === q.h) assert.ok(file[id].o === "I" && file[id].r, id);
  }
  // vsa vprašanja iz :::premisli imajo veljaven vnos (sicer jih je treba pregledati: node scripts/ustno-pregled.js)
  assert.equal(real("FIZ-SS-2/gravitacijski-zakon#p0")?.vrsta, "razlozi");
});

test("ročni pregled: novo ali spremenjeno :::premisli brez pregleda ni ponujeno, napaka in povzetek pa sta", () => {
  const lesson = {
    sections: [
      { title: "Razlaga", md: ":::premisli\nZakaj teniška žogica plava, čeprav je težja od golfske, ki potone?\n---\nKer je njena povprečna gostota manjša od gostote vode. Golfska žogica je polna in ima majhno prostornino, zato je njena gostota večja.\n:::" },
      { title: "Pogoste napake", md: "- **Težje telo vedno potone.** Ne odloča teža, ampak povprečna gostota. Ladja iz jekla plava, ker je votla." },
      { title: "Povzetek", md: "- Vzgon je teža izpodrinjene tekočine.\n- Telo plava, če je njegova povprečna gostota manjša od gostote tekočine." },
    ],
  };
  const all = lessonQuestions("T/x", lesson, "x", { pregled: false });
  const p = all.find((q) => q.vrsta === "razlozi");
  assert.ok(p?.h);
  const offered = lessonQuestions("T/x", lesson, "x");
  assert.ok(!offered.some((q) => q.vrsta === "razlozi"), "nepregledano :::premisli ni ponujeno");
  assert.ok(offered.some((q) => q.vrsta === "napaka") && offered.some((q) => q.vrsta === "povzetek"));
  // pregledano in obdržano: ponujeno; izločeno: ne; stara zgoščena vrednost (spremenjena lekcija): ne
  assert.ok(reviewed(p, { [p.id]: { h: p.h, o: "D" } }));
  assert.equal(reviewed(p, { [p.id]: { h: p.h, o: "I", r: "x" } }), null);
  assert.equal(reviewed(p, { [p.id]: { h: textHash("staro besedilo", "star vzorec"), o: "D" } }), null);
  const changed = lessonQuestions("T/x", { sections: [{ title: "Razlaga", md: lesson.sections[0].md.replace("potone", "hitro potone") }] }, "x", { pregled: false })[0];
  assert.notEqual(changed.h, p.h);
  assert.equal(reviewed(changed, { [p.id]: { h: p.h, o: "D" } }), null);
  // »k«: ostanejo le navedeni pojmi; če pojma ni več (nova pravila), na varno stran: ni ponujeno
  const k = reviewed(p, { [p.id]: { h: p.h, o: "D", k: p.pojmi.slice(0, 2) } });
  assert.deepEqual(k?.pojmi, p.pojmi.slice(0, 2));
  assert.equal(reviewed(p, { [p.id]: { h: p.h, o: "D", k: [p.pojmi[0], "pojem, ki ga ni"] } }), null);
  // pogosta napaka: vnos ni obvezen, velja le ob enaki zgoščeni vrednosti
  const n = all.find((q) => q.vrsta === "napaka");
  assert.equal(reviewed(n, {}), n);
  assert.equal(reviewed(n, { [n.id]: { h: n.hn, o: "I", r: "x" } }), null);
  assert.equal(reviewed(n, { [n.id]: { h: "000000000000", o: "I", r: "x" } }), n);
});

test("ključni pojmi: »E. coli«, »2. Newtonov zakon«, koda z »**« in »(Primer 3)« (vzorec 2)", () => {
  assert.deepEqual(keyPoints("Kisik ima višji potencial, zato sprosti več energije za ATP. *E. coli* zato gene za nitrat vklopi šele, ko kisika zmanjka."), ["Kisik ima višji potencial, zato sprosti več energije za ATP", "*E. coli* zato gene za nitrat vklopi šele, ko kisika zmanjka"]);
  assert.deepEqual(keyPoints("Enaka sila ne pomeni enakega pospeška. Po 2. Newtonovem zakonu je $a = \\dfrac{F}{m}$."), ["Enaka sila ne pomeni enakega pospeška", "Po 2. Newtonovem zakonu je $a = \\dfrac{F}{m}$"]);
  assert.match(keyPoints("Najprej `3 ** 2 = 9`, nato predznak da `-9`. Kdor računa drugače, dobi napačnih $18$.")[0], /`3 \*\* 2 = 9`/);
  assert.ok(!keyPoints("Bakterija se ustavi praktično takoj (Primer 3). Poganjati se mora neprestano z vrtenjem.").some((p) => /Primer/.test(p)));
});
