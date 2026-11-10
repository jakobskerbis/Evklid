// Ustno spraševanje: pravila 1–9 iz vsebinskega pregleda vzorca (PR #564, 10. 11. 2026). Vsak primer (#) iz
// poročila ima tu svoj test; besedila so prepisana iz vzorca, zato testi ne zavisijo od poznejših popravkov lekcij.
import test from "node:test";
import assert from "node:assert/strict";
import {
  lessonQuestions, questionProblem, keyPoints, finalResult, practiceQuestion, publicQuestion, pruneNumbers, undefinedSymbol, missingData, foreignNumbers, forSpeech, resultStatus, GRADE_SYSTEM,
} from "../server/ustno.js";
import { generateTask } from "../server/practice/index.js";

// Lekcija z enim :::premisli (vprašanje --- vzorčni odgovor) ali enim razdelkom »Pogoste napake«.
const premisli = (q, a) => ({ sections: [{ title: "Razlaga", md: `:::premisli\n${q}\n---\n${a}\n:::` }] });
const napaka = (naslov, text) => ({ sections: [{ title: "Pogoste napake", md: `- **${naslov}.** ${text}` }] });
const one = (lesson) => lessonQuestions("T/x", lesson, "x", { raw: true })[0];
const kept = (lesson) => lessonQuestions("T/x", lesson, "x");
const why = (lesson) => questionProblem(pruneNumbers(one(lesson)));

test("pravilo 1: vsa števila iz računa v vzorcu morajo biti v vprašanju (#1, #30, #35, #42, #47, #58)", () => {
  const cases = [
    ["Koliko vode izgubi v $50$ minutah?", "$15\\,\\text{g/min} \\cdot 50\\,\\text{min} = 750\\,\\text{g}$, kar je približno tri četrt litra. Toliko naj bi med treningom tudi popil."], // #1
    ["Koliko gramov natrija potrebujemo?", "$m = 0{,}154\\,\\text{mol} \\cdot 22{,}99\\,\\text{g/mol} \\approx 3{,}54\\,\\text{g}$."], // #30
    ["Koliko litrov avto porabi na $350\\,\\text{km}$?", "$0{,}06 \\cdot 350 = 21$, torej $21$ litrov. Preizkus: $21 : 350 = 0{,}06$, količnik je enak kot pri točki $(150, 9)$."], // #35
    ["Koliko dijakov uporablja natanko eno vrsto aplikacij?", "$9 + 6 + 5 = 20$. Sodelovalo je $36$ dijakov, natanko eno vrsto aplikacij jih uporablja $20$."], // #42
    ["Kolikšna je ploščina obliža?", "$16 - 4 \\cdot 1{,}5 = 16 - 6 = 10$, torej $10\\,\\text{cm}^2$. Ploščina ni kvadrat celega števila, zato stranica obliža ni celo število centimetrov."], // #47
    ["Koliko je ritmov?", "$\\binom{7}{2} = \\frac{7 \\cdot 6}{2} = 21$. Brez pogoja bi jih bilo $\\binom{8}{3} = 56$."], // #58
  ];
  for (const [q, a] of cases) {
    assert.equal(kept(premisli(q, a)).length, 0, q);
    assert.ok(missingData(q, a).length > 0, q);
  }
  // vsi podatki v vprašanju, vmesni rezultat (6) je izračunan: ostane
  const ok = "Obliž je kvadrat s ploščino $16\\,\\text{cm}^2$, na vsakem od $4$ vogalov odrežemo $1{,}5\\,\\text{cm}^2$. Kolikšna je ploščina obliža?";
  const q = kept(premisli(ok, cases[4][1]))[0];
  assert.equal(q?.vrsta, "izracunaj");
  assert.deepEqual(missingData(ok, cases[4][1], 10), []);
});

test("pravilo 2: gol izraz »Koliko je …?« se izloči (#11, #18, #23, #24, #29)", () => {
  const cases = [
    ["Koliko je $s = \\dfrac{4 \\cdot 10^2}{2}$?", "$s = \\dfrac{4 \\cdot 100}{2} = 200\\,\\text{m}$."], // #11
    ["Koliko je $r = \\dfrac{2\\cdot10^{-7} \\cdot 10}{5\\cdot10^{-5}}\\,\\mathrm{m}$?", "$r = 0{,}04\\,\\mathrm{m} = 4\\,\\mathrm{cm}$. Bližje od $4\\,\\mathrm{cm}$ polje žice preglasi Zemljino."], // #18
    ["Koliko je $m = 49{,}1\\,\\text{mol} \\cdot 44\\,\\text{g/mol}$?", "$m \\approx 2160\\,\\text{g} \\approx 2{,}2\\,\\text{kg}$."], // #23
    ["Koliko je $m = 27\\,\\text{g} \\cdot \\dfrac{180}{162}$?", "$m = 30\\,\\text{g}$ glukoze, saj je $\\dfrac{27}{162} = 0{,}1667\\,\\text{mol}$ in $0{,}1667 \\cdot 180 \\approx 30$."], // #24
    ["Koliko je $m(\\text{sečnina}) = \\dfrac{23\\,\\mathrm{kg}}{0{,}4665}$?", "$m(\\text{sečnina}) = 49{,}3\\,\\mathrm{kg}$. Potrebuje približno $49\\,\\mathrm{kg}$ sečnine na hektar."], // #29
  ];
  for (const [q, a] of cases) {
    const x = one(premisli(q, a));
    if (x) assert.equal(questionProblem(x), "izraz", q);
    assert.equal(kept(premisli(q, a)).length, 0, q);
  }
});

test("pravilo 3: vprašanje o nedefiniranem simbolu se izloči (#41, #57, #59), opisan ali uporabljen simbol ostane", () => {
  assert.equal(undefinedSymbol("Koliko je $V$?"), "V"); // #41
  assert.equal(undefinedSymbol("Koliko je $f^{(5)}(0)$?"), "f"); // #57
  assert.ok(undefinedSymbol("Kaj je $m_D$ in ali je $D$ diagonalizabilna?")); // #59
  assert.equal(why(premisli("Kaj je $m_D$ in ali je $D$ diagonalizabilna?", "$D - 2I \\ne 0$, zato $m_D = (\\lambda - 2)^2$. Ničla je dvojna, $D$ ni diagonalizabilna. (Edina diagonalizabilna matrika z edino lastno vrednostjo $2$ je $2I$.)")), "simbol");
  assert.equal(kept(premisli("Koliko je $V$?", "$\\int_0^{30} \\frac{x^2}{9}\\,dx = 1000$, torej $V = 1000\\pi \\approx 3142\\,\\mathrm{cm^3} \\approx 3{,}1\\,\\mathrm{L}$.")).length, 0);
  for (const t of [
    "Bor ima za $5$ evrov manj kot Ana, ki ima $x$ evrov. Sošolec zapiše $5 - x$. Zakaj to ni prav?",
    "Funkcija $f$ je dana z $f(x) = x^2$. Koliko je $f(3)$?",
    "Na nosilcu iščeš reakciji v podporah $A$ in $B$. Okoli katere točke zapišeš prvo momentno enačbo?",
    "Ali bi delne vsote prav tako prišle do $e^{10}$?",
  ])
    assert.equal(undefinedSymbol(t), null, t);
});

test("pravilo 4: sklici na zgodbo, uvod, tabelo in poskus iz lekcije, tudi v pojmih (#2, #9, #12, #16, #28, #46)", () => {
  // #2
  assert.equal(why(premisli("Je bilo to temeljno ali uporabno raziskovanje? In kaj napoveš: zakaj bi bila bakterija, ki ji vroča voda ne škodi, nekoč lahko komu koristna?", "Temeljno: hoteli so razumeti, kako bakterija preživi. Koristilo je skoraj dvajset let pozneje. Ena od snovi te bakterije prenese visoko temperaturo, zato jo uporabljajo pri preiskavah DNK.")), "sklic");
  // #9
  assert.equal(why(premisli("Kristal galuna v nasičeni raztopini v enem tednu zraste za nekaj centimetrov in ima pravilno obliko. Izpolni zanj vrstico tabele: ga uvrstiš med živo? Zakaj ne odloči rast?", "Ne. Vrstica je »da, ne, ne«: raste, a nima celic, nima presnove in nima dedne snovi. Rast se pojavi tudi pri neživih stvareh, zato odločata zadnja dva stolpca.")), "sklic");
  // #12
  assert.equal(kept(premisli("Koliko sponk bi približno dvignila tuljava z $200$ ovoji pri toku $0{,}5\\,\\mathrm{A}$ z istim žebljem? Najprej izračunaj $N \\cdot I$.", "Približno $16$ sponk. Velja $200 \\cdot 0{,}5 = 100$, kar je enako kot v četrti vrstici ($100 \\cdot 1{,}0 = 100$).")).length, 0);
  // #16: sklic na tabelo je le v pojmu
  assert.equal(why(premisli("Žarek gre iz vode v zrak. V vodi oklepa z vpadno pravokotnico $22^\\circ$. Napovej kot v zraku, ne da bi računal.", "Približno $30^\\circ$. Pot svetlobe je obrnljiva: v tabeli gre žarek iz zraka pod $30^\\circ$ v vodo pod $22^\\circ$, torej gre iz vode pod $22^\\circ$ v zrak pod $30^\\circ$. Lomi se stran od pravokotnice, ker gre v optično redkejšo snov.")), "sklic");
  // #28
  assert.equal(why(premisli("Kaj se zgodi z zlato ploščico in katera snov je primerna za sondo?", "Pri zlatu ni mehurčkov in ploščica ostane enaka, ker zlato s kislino ne reagira. Od treh preizkušenih snovi je za ohišje primerno samo zlato. Magnezij in marmor bi kisle kapljice počasi razjedle.")), "sklic");
  // #46
  assert.equal(why(premisli("Pri kateri temperaturi kažeta obe lestvici iz uvoda isto število? Napovej, ali je to nad ali pod lediščem, nato reši sistem $y = 1{,}8x + 32$, $y = x$ z zamenjavo.", "Pod lediščem. Vstavimo $y = x$ v prvo enačbo: $x = 1{,}8x + 32$, torej $-0{,}8x = 32$ in $x = -40$. Pri $-40\\,°\\text{C}$ termometer kaže tudi $-40\\,°\\text{F}$. Tako mrzlo je npr. pozimi v Sibiriji.")), "sklic");
  // snov ni sklic: vrstice matrike, periodni sistem, »z istim številom« v pojmu
  assert.equal(questionProblem({ vrsta: "razlozi", besedilo: "Kaj naredi zamenjava dveh vrstic matrike z determinanto?", vzorec: "a", pojmi: ["Determinanta spremeni predznak", "Zamenjamo prvo in drugo vrstico"] }), null);
  assert.equal(questionProblem({ vrsta: "napaka", besedilo: "Pogosta napaka pri tej snovi: »Razširjanje le števca« Pojasni, kaj je tu narobe in kako je prav.", vzorec: "a", pojmi: ["Števec in imenovalec pomnožimo z istim številom", "Vrednost ulomka ostane enaka"] }), null);
});

test("pravilo 5: ne reže za okrajšavami, kratek del za »;« z malo začetnico zlepi (#46, #62, #65)", () => {
  // #46
  const k46 = keyPoints("Pod lediščem. Vstavimo $y = x$ v prvo enačbo: $x = 1{,}8x + 32$, torej $-0{,}8x = 32$ in $x = -40$. Pri $-40\\,°\\text{C}$ termometer kaže tudi $-40\\,°\\text{F}$. Tako mrzlo je npr. pozimi v Sibiriji.");
  assert.ok(k46.includes("Tako mrzlo je npr. pozimi v Sibiriji"), k46.join(" | "));
  assert.ok(!k46.some((p) => /npr$/.test(p)));
  for (const t of ["To je dvojna vez, tj. dve skupni elektronski paru, in jo zapišemo z dvema črtama.", "Gostota se zmanjša za pribl. pol, ker se prostornina podvoji."]) assert.ok(keyPoints(`${t} Druga trditev je tu.`).every((p) => !/(?:tj|pribl)$/.test(p)), t);
  // #62
  const k62 = keyPoints("Večja od $N$ ne more biti nikoli, enaka $N$ pa le, če slučajno izvlečemo prav zadnji listek. Največja številka je torej vedno $\\le N$ in pogosto manjša. Ocena zato v povprečju **podceni** $N$; greši sistematično v eno smer.");
  assert.equal(k62.length, 3);
  assert.equal(k62[2], "Ocena zato v povprečju podceni $N$; greši sistematično v eno smer");
  // #65: en sam pojem → vprašanje se izloči
  const l65 = napaka("Gladka mišičnina nima aktina in miozina", "Ima ju, le da nista urejena v sarkomere; zato ni prog.");
  assert.equal(one(l65).pojmi.length, 1);
  assert.equal(kept(l65).length, 0);
});

test("pravilo 6: enota s ² in ³ ostane (#47), Vadnica brez enote »Pravilen rezultat« (#70, #73)", () => {
  const r = finalResult("$16 - 4 \\cdot 1{,}5 = 16 - 6 = 10$, torej $10\\,\\text{cm}^2$. Ploščina ni kvadrat celega števila.", "Kolikšna je ploščina obliža?");
  assert.equal(r.value, 10);
  assert.equal(r.unit, "cm²");
  assert.equal(finalResult("$V = 1000\\pi \\approx 268{,}08\\,\\mathrm{cm}^3$.", "Kolikšna je prostornina $V$?").unit, "cm³");
  assert.equal(resultStatus(r, "10 cm²", "").status, "povedal");
  assert.notEqual(resultStatus(r, "10 cm", "").status, "povedal");
  // #70 (Newtonova metoda), #73 (binomska porazdelitev): rezultat brez enote
  let seen = 0;
  for (const id of ["UNI-UMFKKT-NRACKEM/resevanje-nelinearnih-enacb", "UNI-ULFKKT-STATVAR/slucajne-spremenljivke-in-porazdelitve"]) {
    for (let seed = 770; seed < 790; seed++) {
      const q = practiceQuestion(id, seed);
      if (!q) continue;
      seen++;
      assert.equal(q.pojmi[1], q.odgovor.unit ? "Pravilen rezultat z enoto" : "Pravilen rezultat", q.id);
    }
  }
  assert.ok(seen > 0);
  // #73: »natanko 1 pokvarjen«, ne »1 pokvarjenih«
  let bin = 0;
  for (let seed = 1; seed < 400 && bin < 30; seed++) {
    const t = generateTask("UNI-ULFKKT-STATVAR/slucajne-spremenljivke-in-porazdelitve", 1, seed, "sl");
    const m = /natanko \$(\d+)\$ (pokvarjen\p{L}*)/u.exec(t?.text || "");
    if (!m) continue;
    bin++;
    const k = Number(m[1]);
    assert.equal(m[2], k === 1 ? "pokvarjen" : k === 2 ? "pokvarjena" : k <= 4 ? "pokvarjeni" : "pokvarjenih", t.text);
  }
  assert.ok(bin > 0, "binomska naloga");
});

test("pravilo 7: pojem s količino, ki je vprašanje ne pove, odstranimo ali vprašanje izločimo (#13, #38, #40, #48)", () => {
  // #13: ostane en pojem → izločeno
  assert.equal(why(premisli("Maja pusti halogenko prižgano $6\\,\\mathrm{h}$ namesto $3\\,\\mathrm{h}$. Napovej: kaj se zgodi z močjo žarnice in kaj z delom?", "Moč ostane $42\\,\\mathrm{W}$, saj žarnica vsako sekundo pretvori enako energije. Delo se podvoji na $0{,}252\\,\\mathrm{kWh}$, ker sveti dvakrat dlje. Podvoji se tudi strošek.")), "stevilo");
  // #38: pojma s kotoma, ki ju naslov ne pove, odpadeta → ostane en pojem → izločeno
  const l38 = napaka("Pri izposojanju dodaš 100 namesto 60", "Pri $50^\\circ 10' - 20^\\circ 40'$ učenec piše $49^\\circ 110'$. Razlog: postopek pisnega odštevanja z desetiškimi enotami. Pravilno: $1^\\circ = 60'$, zato $50^\\circ 10' = 49^\\circ 70'$ in rezultat je $29^\\circ 30'$.");
  assert.ok(foreignNumbers(one(l38).pojmi[0], one(l38).besedilo).length);
  assert.ok(!kept(l38).some((q) => q.pojmi.some((p) => p.includes("110'"))));
  // #40: primer z Ano (20 evrov) odpade, ostaneta dva pojma
  const q40 = kept(premisli("Bor ima za $5$ evrov manj kot Ana, ki ima $x$ evrov. Sošolec zapiše $5 - x$. Zakaj to ni prav?", "Od Aninega denarja moraš odvzeti $5$, torej $x - 5$. Izraz $5 - x$ pomeni, da od $5$ odvzameš Anin denar. Če ima Ana $20$ evrov, ima Bor $15$ evrov, izraz $5 - 20$ pa da $-15$."))[0];
  assert.equal(q40.pojmi.length, 2);
  assert.ok(!q40.pojmi.some((p) => p.includes("20")));
  // #48: 3 ure in 2 uri nista v vprašanju
  assert.equal(why(premisli("Zakaj je povprečna hitrost $48\\,\\mathrm{km/h}$ bližje $40$ kot $60$?", "Ker kombi s $40\\,\\mathrm{km/h}$ vozi dlje časa: $3$ ure, s $60\\,\\mathrm{km/h}$ pa le $2$ uri. Povprečna hitrost upošteva, koliko časa vozi s posamezno hitrostjo.")), "stevilo");
  // števila brez enote (zgled, »deli s $\sqrt{3}$«) ostanejo
  assert.deepEqual(foreignNumbers("Pri enakomerni porazdelitvi jo delimo s $\\sqrt{3}$", "Pogosta napaka: »Toleranca kot standardna negotovost«"), []);
});

test("#51: pojmi brez količin ostanejo (faktor 10 ni količina z enoto)", () => {
  const q = kept(premisli("V Fermijevi verigi je ena ocena dvakrat prevelika, druga dvakrat premajhna. Kaj se zgodi z rezultatom? Kaj pa, če sta obe dvakrat preveliki?", "V prvem primeru se napaki izničita, ker je $2 \\cdot \\dfrac{1}{2} = 1$. V drugem je rezultat $4$-krat prevelik, kar je še vedno blizu pravega reda velikosti. Ena sama ocena, zgrešena za faktor $10$, pa rezultat premakne za cel red velikosti. Zato pazi predvsem na velike zgrešitve."))[0];
  assert.equal(q?.pojmi.length, 4);
});

test("pravilo 8: besedilo za glas brez markdowna (#62)", () => {
  const q = { vrsta: "razlozi", topicId: "T/x", besedilo: "Žrebanje si zamisli ponovljeno velikokrat. Ali ocena »$N \\approx$ največja številka« kdaj **preceni** $N$?", vzorec: "a", pojmi: ["a b c d", "e f g h"] };
  const g = publicQuestion(q, 0).govor;
  assert.ok(!/[*_$`]/.test(g), g);
  assert.ok(g.includes("preceni"));
  assert.equal(forSpeech("**krepko** _ležeče_ $x$ `koda`"), "krepko ležeče x koda");
});

test("pravilo 9: pojem, ki je le primer, šteje, če učenec da drug pravilen primer (#26, #32, #40)", () => {
  assert.match(GRADE_SYSTEM, /only an example/);
  assert.match(GRADE_SYSTEM, /different correct example/);
  // #32: oba pojma imata molske mase, ki jih naslov ne pove → izločeno (#26 ostane, ocena po pravilu 9)
  assert.equal(kept(napaka("Napačna molska masa", "Pri $\\mathrm{O_2}$ je $32\\,\\text{g/mol}$, ne $16\\,\\text{g/mol}$, ker ima molekula dva atoma. Pri $\\mathrm{H_2}$ je $2\\,\\text{g/mol}$.")).length, 0);
  const q26 = kept(napaka("Zamešane predpone", "»Kalcijev diklorid« za $\\mathrm{CaCl_2}$ ali »ogljikov oksid« za $\\mathrm{CO_2}$. Pri ionskih spojinah razmerje določajo naboji, pri molekulskih ne. Pravilno: predpone samo pri spojinah dveh nekovin."))[0];
  assert.equal(q26?.pojmi.length, 3);
});
