// Pomen črke iz konteksta (j, 6. 11. 2026): kartica »nedoločeni integral« z Lagrangevim izrekom je x₁
// pokazala kot »prvo rešitev (ničlo)« kvadratne enačbe. Vrstni red: definicija v istem besedilu → tema in
// besedilo → slovar le, če se tema ujema; sicer črka ni klikljiva (docs/pomen-crk.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { Marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { annotateTex, withFormulaSubject, definitionsIn } from "../public/formula-data.js";
import { cardFor, configureCard } from "../public/formula-card.js";
import SL from "../public/i18n/sl.js";

configureCard({ katex, t: (k, v = {}) => String(SL[k] || k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "") });
const fx = createRenderer({ marked: new Marked(), katex, sanitize: (h) => h, annotate: (tex, o) => annotateTex(tex, undefined, o) });
const codes = (html) => [...html.matchAll(/data-fx="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));
const card = (html, key) => {
  const c = codes(html).find((x) => x.split(":")[2] === key);
  return c ? cardFor(c) : null;
};
const render = (subject, topic, text) => withFormulaSubject(subject, () => fx.renderRich(text), null, topic);

const LAGRANGE = "Za $H = G - F$ je $H' = 0$. Po Lagrangevem izreku je $H(x_2) - H(x_1) = H'(\\xi)(x_2 - x_1) = 0$, zato je $H$ konstantna.";

test("kartica z Lagrangevim izrekom (nedoločeni integral): x₁ in x₂ nista ničli, H je iz besedila", () => {
  const html = render("MAT", "nedoločeni integral\nZakaj se dve primitivni funkciji iste funkcije na intervalu razlikujeta le za konstanto?", LAGRANGE);
  assert.equal(card(html, "x_1"), null, "x₁ ni klikljiv");
  assert.equal(card(html, "x_2"), null, "x₂ ni klikljiv");
  assert.ok(!codes(html).some((c) => /ničla|x_1/.test(c)));
  const h = card(html, "H");
  assert.ok(h, "H ima pomen iz besedila");
  assert.match(h.html, /Oznaka iz besedila/);
  assert.match(h.html, /fx-line/); // zveza H = G − F
  assert.doesNotMatch(h.html, /Nima enote/);
});

test("ista formula brez teme in besedila: x₁ ni »ničla« (raje nič kot napačno)", () => {
  const html = render("MAT", "", "$H(x_2) - H(x_1) = H'(\\xi)(x_2 - x_1)$");
  assert.equal(card(html, "x_1"), null);
});

test("kvadratna enačba: x₁ je prva rešitev (ničla) – iz formule ali iz teme", () => {
  const byFormula = render("MAT", "", "Rešitvi sta $x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$, torej $x_1$ in $x_2$.");
  assert.match(card(byFormula, "x_1,2").label, /rešitvi kvadratne enačbe/);
  const byTopic = render("MAT", "Kvadratna enačba", "Reši $x^2 - 5x + 6 = 0$. Rešitvi: $x_1 = 2$, $x_2 = 3$.");
  assert.match(card(byTopic, "x_1").label, /ničla/);
  assert.match(card(byTopic, "x_2").label, /ničla/);
});

test("kvadratna tema, a besedilo je o Lagrangevem izreku: x₁ ni ničla", () => {
  const html = render("MAT", "Kvadratna funkcija", "Po Lagrangevem izreku na intervalu $[x_1, x_2]$ velja …");
  assert.equal(card(html, "x_1"), null);
});

test("D, a, b, c: koeficienti in diskriminanta le pri kvadratni enačbi", () => {
  const quad = render("MAT", "Kvadratna enačba", "Diskriminanta je $D = b^2 - 4ac$.");
  assert.match(card(quad, "D").label, /diskriminanta/);
  const geo = render("MAT", "Štirikotniki", "Oglišča so $A$, $B$, $C$ in $D$; stranice $a$, $b$, $c$.");
  for (const k of ["D", "a", "b", "c"]) assert.equal(card(geo, k), null, k);
});

test("k, n: premica le v temi o premici, ne v zaporedjih ali kombinatoriki", () => {
  assert.match(card(render("MAT", "Linearna funkcija", "Graf je $y = k x + n$."), "k").label, /smerni/);
  assert.equal(card(render("MAT", "Zaporedja", "Za vsak $k$ velja $a_k < a_{k+1}$."), "k"), null);
  assert.equal(card(render("MAT", "Linearna funkcija", "Za vsak $k$ velja $k^2 \\ge 0$."), "k").label.includes("smerni"), true);
  assert.equal(card(render("MAT", "Kombinatorika", "Število je $\\binom{n}{k}$."), "n"), null);
});

test("r, d: polmer in premer le pri krogu; dx v integralu ni premer", () => {
  assert.match(card(render("MAT", "Krog", "Obseg je $o = 2\\pi r$."), "r").label, /polmer/);
  assert.equal(card(render("MAT", "Določeni integral", "$\\int_0^{\\pi} \\sin x \\, dx = 2$"), "d"), null);
});

test("fizika: M je navor le pri navoru, x raztezek le pri vzmeti, n lomni količnik le pri lomu", () => {
  assert.match(card(render("FIZ", "Navor", "$M = r F$"), "M").label, /navor/);
  assert.equal(card(render("FIZ", "Gravitacija", "$F = G \\frac{m M}{r^2}$"), "M"), null);
  assert.match(card(render("FIZ", "Prožnost", "$F = k x$"), "x").label, /raztezek/);
  assert.equal(card(render("FIZ", "Enakomerno gibanje", "$x = x_0 + v t$"), "x"), null);
  assert.match(card(render("FIZ", "Lom svetlobe", "$n = \\frac{c_0}{c}$"), "n").label, /lomni/);
  assert.equal(card(render("FIZ", "Plinska enačba", "$p V = n R T$"), "n"), null);
  // e^{-t/τ}: Eulerjevo število, ne naboj; A pri nihanju je amplituda, ne delo.
  assert.equal(card(render("FIZ", "Kondenzator", "$U = U_0 e^{-t/\\tau}$"), "e"), null);
  assert.equal(card(render("FIZ", "Nihanje", "$x = A \\sin(\\omega t)$"), "A"), null);
  assert.match(card(render("FIZ", "Delo", "$A = F s$"), "A").label, /delo/);
});

test("definicije v besedilu: »kjer je« da ime, številska vrednost ni definicija", () => {
  const d = definitionsIn("Velja $s = v t$, kjer je $v$ hitrost, $t$ čas in $s$ pot. Za $x = 2$ je $y = 4$. Naj bo $\\varphi = \\alpha + \\beta$.");
  const by = Object.fromEntries(d.map((e) => [e.keys[0], e]));
  assert.equal(by.v.n, "hitrost");
  assert.equal(by.t.n, "čas");
  assert.equal(by.s.n, "pot");
  assert.equal(by.x, undefined);
  assert.equal(by["φ"].r, "\\varphi = \\alpha + \\beta");
  // Ime iz besedila je enako slovarju: ostane kartica iz slovarja (z enoto).
  const html = render("FIZ", "Gibanje", "Velja $s = v t$, kjer je $v$ hitrost.");
  assert.match(card(html, "v").html, /m\/s|Enota/);
});

test("Za $x_1 = …$: definicija v besedilu ima prednost pred slovarjem", () => {
  const html = render("MAT", "Kvadratna enačba", "Naj bo $x_1 = \\frac{a + b}{2}$ sredina intervala.");
  const c = card(html, "x_1");
  assert.ok(c);
  assert.doesNotMatch(c.label, /ničla/);
  assert.match(c.html, /Oznaka iz besedila/);
});

// ---------- popravki po pregledu PR 463 ----------
const label = (html, key) => card(html, key)?.label || null;

test("pregled 463/1: samo številska vrednost ni definicija (°, \\dfrac, gnezdena enota)", () => {
  const d = definitionsIn("Za $\\alpha = 60^\\circ$ je … Za $x = \\dfrac{1}{3}$ je … za $g = 10\\,\\mathrm{\\frac{m}{s^2}}$ dobimo … Za $y = 2x$ …");
  assert.deepEqual(d.map((e) => e.keys[0]), ["y"]);
  assert.match(label(render("MAT", "Adicijski izreki", "Za $\\alpha = 60^\\circ$ je $\\sin \\alpha = \\frac{\\sqrt 3}{2}$."), "α"), /kot/);
  assert.match(label(render("FIZ", "Prosti pad", "Računamo za $g = 10\\,\\mathrm{\\frac{m}{s^2}}$: $v = g t$."), "g"), /težni pospešek/);
});

test("pregled 463/2: »Za $X = …$« velja le v povedi; zanesljiv pomen slovarja ostane", () => {
  const sys = render("MAT", "Sistemi linearnih enačb", "Za $y = 2x$ je $x + y = 3x$. Druga enačba je $y = 5 - x$.");
  const ys = codes(sys).filter((c) => c.split(":")[2] === "y").map((c) => cardFor(c).html);
  assert.equal(ys.length, 2, "y je določen le v prvi povedi");
  assert.ok(ys.every((h) => /Oznaka iz besedila/.test(h)));
  assert.equal(definitionsIn("Za $A = \\{2, 4\\}$ velja …").length, 0, "množica števil ni zveza");
  assert.match(label(render("MAT", "Krožni lok", "Lok je del obsega $2\\pi r$, kjer je $r$ en sam faktor."), "r"), /polmer/);
  const disk = render("MAT", "Kvadratna enačba", "Rešitvi sta $x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$, kjer je $D = b^2 - 4ac$. Če je $D > 0$, sta dve.");
  assert.ok(codes(disk).filter((c) => c.split(":")[2] === "D").every((c) => /diskriminanta/.test(cardFor(c).label)));
  assert.match(card(render("FIZ", "Enakomerno gibanje", "Naj bo $v = \\frac{s}{t}$ hitrost. Potem $s = v t$."), "v").html, /m\/s/);
  const k = card(render("FIZ", "Prožnost", "Velja $F = k x$, kjer je $k$ konstanta vzmeti."), "k");
  assert.match(k.label, /prožnostni koeficient/);
  assert.match(k.html, /N\/m/);
  // »kjer je $C$ … se izniči«, »$y_p$ ena«: ni ime (samostalnik).
  assert.deepEqual(definitionsIn("kjer je $F$ primitivna funkcija; $C$ se izniči. Pri čemer je $f$ zvezna, kjer je $y_p$ ena rešitev.").map((e) => [e.keys[0], e.n]), [["F", "primitivna funkcija"]]);
});

test("pregled 463/2: oznake lekcije imajo prednost pred oznako iz besedila", () => {
  const gl = [{ keys: ["x"], tex: ["x"], n: "neodvisna spremenljivka", r: "", u: "", note: "" }];
  const html = withFormulaSubject("MAT", () => fx.renderRich("Naj bo $x = t^2$. Potem $f(x) = t^4$."), gl, "Funkcije");
  assert.match(card(html, "x").label, /neodvisna spremenljivka/);
});

test("pregled 463/3: »vleče«, »daleč«, »okrog«, »atmosfera« in met kocke niso tema", () => {
  assert.equal(card(render("FIZ", "Merske napake", "Vrv vleče voziček daleč. Naredimo $n = 5$ meritev."), "n"), null);
  assert.equal(card(render("MAT", "Statistika", "Koeficient korelacije $r = 0{,}8$. Točke so razporejene okrog premice."), "r"), null);
  assert.equal(card(render("MAT", "Zemlja", "V atmosferi je tlak $p$ na razdalji $r$ od središča."), "r"), null);
  assert.equal(card(render("MAT", "Verjetnost", "Mečemo kocko. $P = \\frac{1}{6}$."), "P"), null);
  assert.match(label(render("MAT", "Kocka", "Površina kocke je $P = 6a^2$."), "P"), /površina/);
  assert.match(label(render("FIZ", "Leče", "Za lečo velja $n = \\frac{c_0}{c}$."), "n"), /lomni/);
});

test("pregled 463/4: beseda drugje v razdelku ne da pomena (le tema in poved, besedilo bloka le izključi)", () => {
  assert.equal(card(render("MAT", "Talesov izrek", "Nariši vzporedni premici.\n\nDaljico razdeli v razmerju $m : n$."), "n"), null);
  assert.equal(card(render("MAT", "Aritmetično in geometrijsko zaporedje", "Diskriminanta je pozitivna.\n\nTorej $a_{20} = 62$."), "a"), null);
  assert.equal(card(render("MAT", "Moč množic", "Premica ima neskončno točk.\n\nŠtevila $3k$, $k \\in \\mathbb{N}$."), "k"), null);
  assert.equal(card(render("MAT", "Sistemi linearnih enačb · Linearna funkcija, enačbe in neenačbe", "Pomnoži z $+k$ in $-k$."), "k"), null);
  // Ista beseda v isti povedi pa velja.
  assert.match(label(render("MAT", "Funkcije", "Kvadratna funkcija ima diskriminanto $D = b^2 - 4ac$."), "D"), /diskriminanta/);
});

test("pregled 463/5: črka z indeksom ne podeduje pomena le po temi", () => {
  assert.equal(card(render("MAT", "Kvadratna funkcija", "Definicijsko območje $D_f = \\mathbb{R}$."), "D"), null);
  assert.equal(card(render("MAT", "Kvadratna enačba", "$a_{20} = 62$"), "a"), null);
  // a_n v polinomu ne podeduje oznake lekcije za a (osnova logaritma).
  const gl = [{ keys: ["a"], tex: ["a"], n: "osnova logaritma", r: "", u: "", note: "" }];
  const html = withFormulaSubject("MAT", () => fx.renderRich("Polinom stopnje $n$ ima $a_n \\neq 0$."), gl, "Elementarne funkcije");
  assert.ok(!codes(html).some((c) => c.split(":")[2] === "a"));
  // Formula pa potrdi: v_1 je hitrost (edini pomen v fiziki).
  assert.match(label(render("FIZ", "Trki", "$v_1 = 3\\,\\mathrm{m/s}$"), "v"), /hitrost/);
});

test("pregled 463/6: F = k · x, M = r · F (\\cdot, \\times)", () => {
  assert.match(label(render("FIZ", "Sila in merjenje sile", "Hookov zakon: $F = k \\cdot x$."), "k"), /prožnostni/);
  assert.match(label(render("FIZ", "Sila", "$F = k \\times x$"), "x"), /raztezek/);
  assert.match(label(render("FIZ", "Ravnovesje", "$M = r \\cdot F$"), "M"), /navor/);
  assert.match(label(render("FIZ", "Gibalna količina", "$p = m \\cdot v$"), "p"), /gibalna/);
});

test("pregled 463/7: n le ob y = kx + n v isti povedi; b v a x² + b je prosti člen", () => {
  assert.equal(card(render("MAT", "Linearna funkcija", "Za vsak naravni $n$ velja $n^2 \\ge 0$."), "n"), null);
  assert.match(label(render("MAT", "Premica", "Premica $y = kx + n$ ima začetno vrednost $n$."), "n"), /začetna vrednost/);
  assert.equal(card(render("MAT", "Linearna funkcija", "Graf seka os $y$ pri $n = 3$."), "n"), null);
  assert.equal(card(render("MAT", "Kvadratna funkcija", "$f(x) = ax^2 + b$"), "b"), null);
  assert.match(label(render("MAT", "Kvadratna funkcija", "$f(x) = ax^2 + bx + c$"), "b"), /linearni/);
  // Eulerjeva oblika: i je imaginarna enota tudi brez teme.
  assert.match(label(render("MAT", "Potenčne vrste", "$e^{iz} = \\cos z + i\\sin z$"), "i"), /imaginarna/);
  assert.equal(card(render("MAT", "Vektorji", "$\\vec a = a_x \\vec i + a_y \\vec j$"), "i"), null);
});

test("pregled 463/7: fakultetna lekcija iz fizike in kemije ima svoj predmet (ne tabelo MAT)", async () => {
  const { lessonView } = await import("../server/textbook.js");
  assert.equal(lessonView("UNI-ULFKKT-FIZ/delo-energija-in-gibalna-kolicina")?.subject, "FIZ");
  assert.equal(lessonView("UNI-ULFKKT-KEMIJA/kisline-in-baze")?.subject, "KEM");
  assert.match(label(render("FIZ", "Trenje", "$F_{tr} = k_{tr} F_n$"), "k_tr"), /koeficient trenja/);
  assert.equal(card(render("MAT", "Trenje", "$F_{tr} = k_{tr} F_n$"), "k"), null, "v tabeli MAT k_tr ni smerni koeficient");
});

test("pregled 463 (primerjava po popravkih): a ni koeficient v x = 2a; enota pove S in V; d in k v integralu/eksponentu", () => {
  // Po temi sami so a, b, c koeficienti le v formuli brez drugih črk.
  const kf = render("MAT", "Kvadratna funkcija", "Za $x = 2a$ je $f(x) = 4a^2$. Graf $f(x) = x^2$.");
  assert.equal(card(kf, "a"), null, "a v x = 2a ni vodilni koeficient");
  assert.match(label(render("MAT", "Kvadratna enačba", "Koeficienti so $a = 1$, $b = -5$ in $c = 6$."), "b"), /linearni/);
  assert.match(label(render("MAT", "Kvadratna enačba", "Velja $a \\neq 0$."), "a"), /vodilni/);
  // Kvadratna forma: b pri xy ni linearni koeficient.
  assert.equal(card(render("MAT", "Kvadratne forme", "$ax^2+bxy+cy^2=d$"), "b"), null);
  // Številka z enoto ploščine ali prostornine pove pomen tudi zunaj geometrije.
  assert.match(label(render("MAT", "Potence z racionalnimi eksponenti", "Za $S = 1{,}5\\,\\mathrm{m^2}$ izračunaj maso."), "S"), /ploščina/);
  assert.match(label(render("MAT", "Kemijsko ravnotežje", "Podatki: $V = 2{,}00\\,\\mathrm{L}$."), "V"), /prostornina/);
  assert.equal(card(render("MAT", "Vrste kotov", "$S = 130^\\circ$"), "S"), null);
  // d v \oint ... \mathrm d\vec l ni premer; k v eksponentu ni smerni koeficient (tudi ob besedi »premica«).
  assert.equal(card(render("MAT", "Krožni tok", "Po krogu velja $\\oint \\vec H \\cdot \\mathrm d\\vec l = I$."), "d"), null);
  assert.equal(card(render("MAT", "Taylorjeve vrste", "Premica pade pod nič, krivulja $c_0 e^{-kt}$ pa ne."), "k"), null);
});

// Kontrolni pregled PR 463 (§3, N1–N10): brez oznak lekcije (kartice, naloge, klepet) ni novih napačnih pomenov.
test("kontrolni pregled 463: diferencial, štirikotnik, Evklid, koreni, Vieta, stožnice, D(X), k, a, b in »za«", () => {
  const lab = (s, t, x, k) => card(render(s, t, x), k)?.label?.replace(/<[^>]+>/g, "") || null;
  // N1: d v diferencialu ni premer (dA, dV, dr, dφ, dϑ, dv, \iint, \iiint); d = 2r, πd in d : 2 ostanejo.
  for (const f of ["$\\iint_D f\\,dA$", "$\\iiint_V \\rho\\,dV$", "$dA = r\\,dr\\,d\\varphi$", "$dV = r^2 \\sin\\vartheta\\,dr\\,d\\vartheta\\,d\\varphi$", "$\\int v\\,dv$"])
    assert.equal(lab("MAT", "Večkratni integrali", `Ploščina kroga: ${f}.`, "d"), null, f);
  assert.match(lab("MAT", "Krog", "Polmer je $r = d : 2$.", "d"), /premer/);
  assert.match(lab("MAT", "Krog", "Obseg je $o = \\pi d$.", "d"), /premer/);
  assert.match(lab("MAT", "Krog", "Velja $d = 2r$.", "d"), /premer/);
  // N2: v lekciji o štirikotnikih je d diagonala ali stranica (raje nič); s π ostane premer.
  for (const f of ["$o = a + b + c + d$", "$b = d = 5\\,\\mathrm{cm}$", "$d^2 = a^2 + b^2$"])
    assert.equal(lab("MAT", "Štirikotniki in krog", `Diagonala pravokotnika: ${f}.`, "d"), null, f);
  assert.match(lab("MAT", "Štirikotniki in krog", "Obseg kroga je $o = \\pi d$.", "d"), /premer/);
  // N3: Evklidov izrek c/a = a/c_a ni Vieta; N4: (√a ± √b)² ni formula rešitev.
  const ev = "V pravokotnem trikotniku velja $\\frac{c}{a} = \\frac{a}{c_a}$.";
  assert.equal(lab("MAT", "Podobnost", ev, "a"), null);
  assert.equal(lab("MAT", "Podobnost", ev, "c"), null);
  const kor = "Velja $(\\sqrt a \\pm \\sqrt b)^2 = a + b \\pm 2\\sqrt{ab}$.";
  assert.equal(lab("MAT", "Koreni", kor, "a"), null);
  assert.equal(lab("MAT", "Koreni", kor, "b"), null);
  // Vieta ob x₁, x₂ in formula rešitev ostaneta.
  assert.match(lab("MAT", "Ponavljanje", "$x_1 + x_2 = -\\frac{b}{a}$", "b"), /linearni/);
  assert.match(lab("MAT", "Ponavljanje", "$x_1 x_2 = \\frac{c}{a}$", "c"), /prosti/);
  assert.match(lab("MAT", "Ponavljanje", "$x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$", "a"), /vodilni/);
  // N5: »Vietovo pravilo« pri razstavljanju: a, b sta števili, ki ju iščemo.
  const vi = "Po Vietovem pravilu je $x^2 + (a+b)x + ab = (x+a)(x+b)$, kjer iščemo $a$ in $b$.";
  assert.equal(lab("MAT", "Razstavljanje izrazov", vi, "a"), null);
  assert.equal(lab("MAT", "Razstavljanje izrazov", vi, "b"), null);
  // N6: p pri paraboli y² = 2px ni abscisa temena; temenska oblika ostane.
  assert.equal(lab("MAT", "Elipsa, hiperbola in parabola", "Parabola $y^2 = 2px$ ima gorišče v $(p/2, 0)$; tu je $2p = 6$.", "p"), null);
  assert.match(lab("MAT", "Kvadratna funkcija", "Temenska oblika $y = a(x - p)^2 + q$.", "p"), /abscisa temena/);
  // N7: D(X) je varianca.
  assert.equal(lab("MAT", "Verjetnost in statistika", "Varianca je $D(X) = \\sigma^2$.", "D"), null);
  // N8, N9: k kot hitrostna konstanta in razlika stopenj ni smerni koeficient; premica ostane.
  assert.equal(lab("MAT", "Diferencialne enačbe prvega reda", "Premica: $\\ln c = \\ln c_0 - kt$.", "k"), null);
  assert.equal(lab("MAT", "Elementarne funkcije", "Iz naklona premice dobimo $\\ln k$.", "k"), null);
  assert.equal(lab("MAT", "Racionalne funkcije", "Če je števec višji za $k$, ima graf poševno asimptoto (premica).", "k"), null);
  assert.match(lab("MAT", "Premica", "Premica $y = kx + n$.", "k"), /smerni/);
  // N9b: D = a² − 4b (λ² + aλ + b): a in b nista vodilni/linearni koeficient; D ostane diskriminanta.
  const lde = "Glede na diskriminanto $D = a^2 - 4b$ ločimo tri primere.";
  assert.equal(lab("MAT", "Linearne diferencialne enačbe drugega reda", lde, "a"), null);
  assert.equal(lab("MAT", "Linearne diferencialne enačbe drugega reda", lde, "b"), null);
  assert.match(lab("MAT", "Linearne diferencialne enačbe drugega reda", lde, "D"), /diskriminanta/);
  // N10: »za« sredi stavka ne uvaja definicije; na začetku povedi ali stavka jo.
  const sis = "V stolpcu za $x + y = 6$ vrednost $y$ pada, v stolpcu za $y = 2x$ raste.";
  assert.equal(lab("MAT", "Sistemi linearnih enačb", sis, "y"), null);
  assert.equal(definitionsIn(sis).length, 0);
  assert.equal(definitionsIn("Telo dvignemo za $h = s - s_0$.").length, 0);
  assert.equal(definitionsIn("Za $H = G - F$ je $H' = 0$.")[0]?.keys[0], "H");
  assert.equal(definitionsIn("Odvod je 0, za $H = G - F$ pa velja $H' = 0$.")[0]?.keys[0], "H");
  assert.equal(definitionsIn("- Za $u = x^2$ dobimo …")[0]?.keys[0], "u");
});
