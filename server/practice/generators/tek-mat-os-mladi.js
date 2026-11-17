// Tekmovalne naloge iz matematike za 1.–4. razred (Kenguru za mlajše; j, 15. 11. 2026).
// Teme, ki so na voljo že v 3. ali 4. razredu (competition.js MIN_YEAR), so imele samo naloge za starejše
// (stopinje med kazalcema, enačbe s starostmi, binomski simboli). Ti generatorji jih zamenjajo do 4. razreda
// (maxYear 4); starejši dobijo prejšnje (minYear 5 v tek-mat-os.js). Števila so majhna: do 20 za 1.,
// do 100 za 2. in 3. ter do 1000 za 4. razred. V 1. in 2. razredu brez množenja (seštevamo), brez
// »večkratnika« in »deljivosti«, ure samo cele in pol. Pravilen odgovor je izračunan s preštevanjem.
import { NAMES, g, nOf, verbOf } from "../rng.js";
import { num, DAYS, choiceWhy, withMistakes, sz, cap } from "./tek-util.js";

const T = (slug) => `MAT-TEK-OS/${slug}`;
const Y = (year) => (Number.isInteger(year) ? year : 3);
const names = (r, n) => r.shuffle(NAMES).slice(0, n);
const let_ = (n) => nOf(n, "leto", "leti", "leta", "let");
const letW = (n) => let_(n).replace(/^\d+ /, "");
const stevk = (n) => nOf(n, "števka", "števki", "števke", "števk");
const stevkW = (n) => stevk(n).replace(/^\d+ /, "");
// Ponavljajoče seštevanje namesto množenja (1. in 2. razred): rep(3, 2) → »2 + 2 + 2«.
const rep = (k, x) => Array(k).fill(x).join(" + ");
// Naštevanje: »Ana, Jan in Eva«.
const list = (xs) => xs.join(", ").replace(/, ([^,]*)$/, " in $1");
// »oba« za dva fanta ali par, »obe« za dve deklici.
const oba = (a, b) => (g(a, 0, 1) && g(b, 0, 1) ? "obe" : "oba");
// Kvadrati vseh velikosti v mreži w × h, preštevani po velikosti (zgornji levi kot × velikost).
const squaresBySize = (w, h) => {
  const out = [];
  for (let k = 1; k <= Math.min(w, h); k++) {
    let c = 0;
    for (let i = 0; i + k <= w; i++) for (let j = 0; j + k <= h; j++) c++;
    out.push(c);
  }
  return out;
};
// Napačni dnevi z razlago: za dan premalo (štel si danes kot prvi dan), preveč, v napačno smer, nato drugi dnevi.
const dayMistakes = (r, s, d, past) => {
  const at = (k) => DAYS[(((s + k) % 7) + 7) % 7];
  const dir = past ? -1 : 1;
  const out = new Map();
  const add = (day, why) => out.has(day) || out.set(day, why);
  add(at(dir * (d + 1)), "Za en dan preveč: preštej še enkrat, dan za dnem.");
  add(at(dir * (d - 1)), "Za en dan premalo: današnji dan ni prvi dan štetja.");
  add(at(-dir * d), past ? "Pred toliko dnevi gremo nazaj, ne naprej." : "Čez toliko dni gremo naprej, ne nazaj.");
  for (const x of r.shuffle(DAYS)) add(x, "Cele tedne preskoči, potem pojdi dan za dnem.");
  return [...out].filter(([x]) => x !== at(dir * d)).slice(0, 3);
};
// Predmeti za igro jemanja: oblike ob številu (1, 2, 3–4, 5+), tožilnik in orodnik množine, kraj.
const OBJ = [
  { f: ["bonbon", "bonbona", "bonboni", "bonbonov"], acc: "bonbone", ins: "bonboni", from: "s krožnika", at: "Na krožniku" },
  { f: ["kamenček", "kamenčka", "kamenčki", "kamenčkov"], acc: "kamenčke", ins: "kamenčki", from: "s kupa", at: "Na kupu" },
  { f: ["žeton", "žetona", "žetoni", "žetonov"], acc: "žetone", ins: "žetoni", from: "z mize", at: "Na mizi" },
  { f: ["lešnik", "lešnika", "lešniki", "lešnikov"], acc: "lešnike", ins: "lešniki", from: "iz sklede", at: "V skledi" },
];
// Vsi pari iz n stvari, označenih s črkami: »AB, AC, BC«.
const pairs = (n) => {
  const L = "ABCDEFGHIJ".slice(0, n);
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push(L[i] + L[j]);
  return out;
};

export const TEK_MAT_OS_MLADI = [
  {
    // Kdo je najvišji? Urejanje po velikosti iz primerjav (logično sklepanje).
    id: "tek-mladi-vrstni-red",
    maxYear: 4,
    topics: [T("logicne-naloge-in-sklepanje")],
    gen(level, r) {
      const n = level === 1 ? 3 : 4;
      const kids = names(r, n); // od najvišjega do najnižjega
      const vis = (a) => g(a, "višji", "višja");
      const niz = (a) => g(a, "nižji", "nižja");
      // Primerjave sosedov v vrsti; pri višjih ravneh premešane in z »nižji«.
      let facts = kids.slice(0, -1).map((a, i) => {
        const b = kids[i + 1];
        return level === 1 || r.int(0, 1) ? `${a} je ${vis(a)} od ${gen(b)}.` : `${b} je ${niz(b)} od ${gen(a)}.`;
      });
      if (level > 1) facts = r.shuffle(facts);
      const ask = level === 3 ? 1 : r.pick([0, n - 1]);
      const q = level === 3 ? "Kdo je drugi po višini (drugi najvišji)?" : ask === 0 ? "Kdo je najvišji?" : "Kdo je najnižji?";
      const right = kids[ask];
      return {
        text: `${list(kids.slice().sort())} se postavijo v vrsto po višini. Vemo:\n\n${facts.map((f) => `- ${f}`).join("\n")}\n\n${q}`,
        answer: choiceWhy(
          r,
          right,
          kids.filter((k) => k !== right).map((k) => {
            const i = kids.indexOf(k);
            if (level === 3) return [k, i === 0 ? `${k} je ${g(k, "najvišji", "najvišja")}, ne ${g(k, "drugi", "druga")}.` : `Pred ${g(k, "njim", "njo")} ${i === 2 ? "sta v vrsti dva višja" : "so v vrsti trije višji"}.`];
            return ask === 0 ? [k, `${kids[i - 1]} je ${vis(kids[i - 1])} od ${gen(k)}.`] : [k, `${kids[i + 1]} je ${niz(kids[i + 1])} od ${gen(k)}.`];
          }),
        ),
        hint: "Nariši črto in na vrh postavi tistega, ki je višji od nekoga, a od njega ni višji nihče.",
        data: false,
        formula: "\\text{če je A višji od B in B višji od C, je A višji od C}",
        solution: `Primerjave povežemo v eno vrsto od najvišjega do najnižjega: ${kids.join(" > ")}.\n${q.replace("?", "")}: ${right}.`,
      };
    },
  },
  {
    // Jemanje predmetov: kdor vzame zadnjega, zmaga.
    id: "tek-mladi-igra",
    maxYear: 4,
    topics: [T("igre-in-zmagovalne-strategije")],
    gen(level, r, _topic, _lang, year) {
      const y = Y(year);
      const small = y <= 2;
      const [a, b] = names(r, 2);
      const o = r.pick(OBJ);
      const cnt = (n) => nOf(n, ...o.f);
      const k = level === 2 ? 3 : 2; // vzame 1 do k
      const m = k + 1;
      const row = `${m}, ${2 * m}, ${3 * m} …`;
      const hi = y === 1 ? 12 : y === 2 ? 15 : level === 1 ? 15 : 20;
      const rule = `${a} in ${b} izmenično jemljeta ${o.acc} ${o.from}. ${oba(a, b) === "obe" ? "Vsaka" : "Vsak"} v svoji potezi vzame ${k === 2 ? `1 ali 2 ${o.f[1]}` : `1, 2 ali 3 ${o.acc}`}. Kdor vzame zadnji ${o.f[0]}, zmaga. Začne ${a}.`;
      const why = `Če ${verbOf(m, "ostane", "ostaneta", "ostanejo")} ${cnt(m)}, igralec na potezi izgubi: kar koli vzame (${k === 2 ? "1 ali 2" : "1, 2 ali 3"}), drugi vzame toliko, da skupaj vzameta ${m}, in na koncu vzame zadnjega. Zato so slabi vsi kupi ${sz(m)} ${row} ${o.ins}.`;
      if (level === 3) {
        const n = r.int(m + 1, hi);
        const v = n % m;
        const right = v ? a : b;
        const inRow = small ? `v vrsti ${row}` : `deljivo ${sz(m)} ${m}`;
        return {
          text: `${o.at} ${verbOf(n, "je", "sta", "so")} ${cnt(n)}. ${rule} Kdo zmaga, če ${oba(a, b)} igrata najbolje?`,
          answer: choiceWhy(r, right, [
            [right === a ? b : a, v ? `${a} lahko pusti slab kup, zato ${b} ne more zmagati.` : `${a} začne pri slabem kupu: kar koli vzame, ${b} dopolni do ${m}.`],
            ["Nihče ne more zagotovo zmagati.", `Igra se vedno konča in nekdo vzame zadnjega, zato ${oba(a, b) === "obe" ? "ena" : "eden"} od njiju lahko zagotovo zmaga.`],
          ]),
          hint: `Začni pri koncu. Kdo zmaga, če ${verbOf(m, "ostane", "ostaneta", "ostanejo")} ${cnt(m)} in je na potezi ${a}?`,
          data: false,
          formula: `\\text{slabi kupi: } ${m}, ${2 * m}, ${3 * m}, \\ldots`,
          solution: `${why}\n${v ? `Število ${n} ni ${inRow}, zato ${a} najprej vzame ${v}. ${verbOf(n - v, "Ostane", "Ostaneta", "Ostanejo")} ${cnt(n - v)} in ${b} je na potezi pri slabem kupu. Zmaga ${a}.` : `Število ${n} je ${inRow}, zato je ${a} že na začetku na potezi pri slabem kupu. Kar koli vzame, ${b} dopolni do ${m}. Zmaga ${b}.`}`,
        };
      }
      let n;
      do n = r.int(m + 1, hi);
      while (n % m === 0);
      const v = n % m;
      return {
        text: `${o.at} ${verbOf(n, "je", "sta", "so")} ${cnt(n)}. ${rule} Koliko ${o.f[3]} mora ${a} vzeti v prvi potezi, da bo zagotovo ${g(a, "zmagal", "zmagala")}?`,
        answer: withMistakes(num(v), [[k, small ? `Največ ni vedno najbolje: po tvoji potezi mora ostati število iz vrste ${row}` : `Največ ni vedno najbolje: po tvoji potezi mora ostati kup, deljiv ${sz(m)} ${m}.`]]),
        hint: `Po ${g(a, "njegovi", "njeni")} potezi naj ostane ${row} ${o.f[3]}.`,
        data: false,
        formula: small ? `\\text{po potezi naj ostane } ${m}, ${2 * m}, ${3 * m}, \\ldots` : `\\text{po potezi naj ostane večkratnik števila } ${m}`,
        solution: `${why}\n${a} mora nasprotniku pustiti slab kup. ${small ? `Od ${n} navzdol je najbližje število iz vrste ${row} število ${n - v}` : `Največji večkratnik števila ${m}, manjši od ${n}, je ${n - v}`}, zato vzame $${n} - ${n - v} = ${v}$.`,
      };
    },
  },
  {
    // Števke in številske uganke z majhnimi števili.
    id: "tek-mladi-stevke",
    maxYear: 4,
    topics: [T("stevilske-uganke-in-zapisi")],
    gen(level, r, _topic, _lang, year) {
      const y = Y(year);
      const small = y <= 2;
      const ime = r.pick(NAMES);
      if (level === 1) {
        // 1. razred: odgovor do 19, 2. razred do 23; seštevamo po 2 (poštevanke še ni).
        const a = r.int(1, 9);
        const n = y === 1 ? r.int(10, 14) : y === 2 ? r.int(10, 16) : r.int(12, y === 3 ? 40 : 120);
        let v = 0;
        for (let k = a; k <= n; k++) v += String(k).length;
        const one = 10 - a, two = Math.min(n, 99) - 9, three = Math.max(0, n - 99);
        const lines = [
          one === 1 ? "Enomestno je samo število 9: 1 števka." : `Od ${a} do 9 ${verbOf(one, "je", "sta", "so")} ${nOf(one, "enomestno število", "enomestni števili", "enomestna števila", "enomestnih števil")}, vsako ima 1 števko: to ${verbOf(one, "je", "sta", "so")} ${stevk(one)}.`,
          two === 1 ? "Dvomestno je samo število 10: 2 števki." : `Od 10 do ${Math.min(n, 99)} ${verbOf(two, "je", "sta", "so")} ${nOf(two, "dvomestno število", "dvomestni števili", "dvomestna števila", "dvomestnih števil")}, vsako ima 2 števki: $${small ? rep(two, 2) : `${two} \\cdot 2`} = ${2 * two}$ ${stevkW(2 * two)}.`,
        ];
        if (three) lines.push(three === 1 ? "Trimestno je samo število 100: 3 števke." : `Od 100 do ${n} ${verbOf(three, "je", "sta", "so")} ${nOf(three, "trimestno število", "trimestni števili", "trimestna števila", "trimestnih števil")}, vsako ima 3 števke: $${three} \\cdot 3 = ${3 * three}$ ${stevkW(3 * three)}.`);
        lines.push(`Skupaj $${[one, 2 * two, 3 * three].filter(Boolean).join(" + ")} = ${v}$ ${stevkW(v)}.`);
        return {
          text: r.pick([`${ime} zapiše vsa števila od ${a} do ${n}. Koliko števk zapiše?`, `${ime} na tablo napiše vsa števila od ${a} do ${n}, vsako enkrat. Koliko števk napiše?`]),
          answer: withMistakes(num(v), [[n - a + 1, "To je število števil, ne števk. Dvomestna števila imajo po 2 števki."]]),
          hint: three ? "Posebej preštej enomestna, dvomestna in trimestna števila." : "Posebej preštej enomestna in dvomestna števila.",
          data: false,
          formula: small
            ? "\\text{enomestno število: 1 števka, dvomestno: 2 števki}"
            : `\\text{števke} = \\text{enomestna} \\cdot 1 + \\text{dvomestna} \\cdot 2${three ? " + \\text{trimestna} \\cdot 3" : ""}`,
          solution: lines.join("\n"),
        };
      }
      // 1. razred: števila do 20 (vsota števk, katera števila imajo števko k, kolikokrat zapišemo števko).
      if (y === 1 && (level === 3 || r.int(0, 1))) {
        let k, a, b, list;
        do {
          // Raven 3 (kolikokrat): števka 1, ker je 11 (dve enici) vedno med a ≤ 9 in b ≥ 11.
          k = level === 3 || r.int(0, 1) ? 1 : r.int(2, 9);
          a = r.int(1, 9);
          b = r.int(11, 20);
          list = [];
          for (let x = a; x <= b; x++) if (String(x).includes(String(k))) list.push(x);
        } while (list.length < 2);
        if (level === 2) {
          return {
            text: `${ime} zapiše vsa števila od ${a} do ${b}. Koliko teh števil ima števko ${k}?`,
            answer: num(list.length),
            hint: `Pojdi po vrsti od ${a} do ${b} in pri vsakem številu poglej vse njegove števke.`,
            data: false,
            formula: `\\text{števila s števko } ${k}`,
            solution: `Števila od ${a} do ${b}, ki imajo števko ${k}: ${list.join(", ")}.\nTeh je ${list.length}.`,
          };
        }
        const times = list.reduce((s, x) => s + [...String(x)].filter((c) => c === String(k)).length, 0);
        return {
          text: `${ime} zapiše vsa števila od ${a} do ${b}. Kolikokrat zapiše števko ${k}?`,
          answer: withMistakes(num(times), [[list.length, "V številu 11 je števka 1 zapisana dvakrat: štej vsako posebej."]]),
          hint: `Pojdi po vrsti od ${a} do ${b}. Pazi na števila, v katerih je števka ${k} dvakrat.`,
          data: false,
          formula: `\\text{štej vsako števko } ${k}`,
          solution: `Števila s števko ${k}: ${list.map((x) => (x === 11 && k === 1 ? "11 (dvakrat)" : x)).join(", ")}.\nŠtevko ${k} zapiše ${times}-krat.`,
        };
      }
      if (level === 2) {
        const s = y === 1 ? r.int(1, 10) : r.int(3, 15);
        // Največje (od 2. razreda; v 1. bi bilo nad 20): desetice čim večje, največ 9.
        const big = y >= 2 && r.int(0, 1) === 1;
        const t = big ? Math.min(9, s) : Math.max(1, s - 9);
        const v = 10 * t + (s - t);
        const sol = big
          ? `Desetice naj bodo čim večje, a največ 9. ${s <= 9 ? `Desetica ${s}, enic 0` : `Desetica 9, enic $${s} - 9 = ${s - 9}$`}.`
          : `Desetice naj bodo čim manjše, enice pa največ 9. ${t === 1 ? `Desetica 1, enic $${s} - 1 = ${s - 1}$` : `Z desetico ${t - 1} bi potrebovali ${s - t + 1} enic, kar je več kot 9. Desetica ${t}, enic ${s - t}`}.`;
        return {
          text: `${ime} išče ${big ? "največje" : "najmanjše"} dvomestno število, ki ima vsoto števk ${s}. Katero število je to?`,
          answer: num(v),
          hint: `Prva števka (desetice) naj bo čim ${big ? "večja" : "manjša"}.`,
          data: false,
          formula: "\\text{dvomestno število} = \\text{desetice in enice}",
          solution: `${sol}\nŠtevilo je ${v}.`,
        };
      }
      // Raven 3 od 2. razreda: koliko dvomestnih števil ima vsoto števk s (po želji manjših od lim).
      let s, lim, list;
      do {
        s = r.int(3, 15);
        lim = r.pick([null, 50, 60, 70, 80]);
        list = [];
        for (let k = 10; k <= 99; k++) if (Math.floor(k / 10) + (k % 10) === s && (!lim || k < lim)) list.push(k);
      } while (list.length < 2);
      return {
        text: `${ime} išče dvomestna števila, ki imajo vsoto števk ${s}${lim ? ` in so manjša od ${lim}` : ""}. Koliko je takih števil?`,
        answer: num(list.length),
        hint: "Zapiši jih po vrsti: začni z deseticami 1, nato 2 …",
        data: false,
        formula: "\\text{desetice} + \\text{enice} = " + s,
        solution: `Vsa taka števila: ${list.join(", ")}.\nTeh je ${list.length}.`,
      };
    },
  },
  {
    // Štetje likov in rokovanj, opisano z besedami.
    id: "tek-mladi-liki",
    maxYear: 4,
    topics: [T("stetje-poti-in-likov")],
    gen(level, r, _topic, _lang, year) {
      const y = Y(year);
      if (level === 1) {
        const n = r.int(3, y === 1 ? 6 : y === 2 ? 8 : 10);
        const v = (n * (n - 1)) / 2;
        const sum = Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ");
        const ctx = r.int(0, 2);
        const ime = r.pick(NAMES);
        const kids = names(r, n);
        const ps = ctx === 1 ? kids.flatMap((p, i) => kids.slice(i + 1).map((q) => `${p}–${q}`)) : pairs(n);
        const C = [
          {
            text: `${ime} ima rojstni dan. Na zabavi ${verbOf(n, "je", "sta", "so")} ${nOf(n, "otrok", "otroka", "otroci", "otrok")} (${g(ime, "on", "ona")} je ${g(ime, "eden", "ena")} od njih). Vsak se z vsakim drugim rokuje natanko enkrat. Koliko je vseh rokovanj?`,
            twice: "Vsako rokovanje si štel dvakrat (A z B in B z A je isto rokovanje).",
            hint: "Prvi otrok se rokuje z vsemi drugimi. Drugi še z vsemi, s katerimi se še ni rokoval …",
            sol: `Otroke označimo s črkami. Vsa rokovanja: ${ps.join(", ")}.`,
          },
          {
            text: `${list(kids)} igrajo namizni tenis. Vsak z vsakim odigra natanko eno igro. Koliko iger odigrajo?`,
            twice: `Vsako igro si štel dvakrat (${kids[0]}–${kids[1]} in ${kids[1]}–${kids[0]} je ista igra).`,
            hint: `${kids[0]} igra z vsemi drugimi. ${kids[1]} še z vsemi, s katerimi še ni ${g(kids[1], "igral", "igrala")} …`,
            sol: `Vse igre: ${ps.join(", ")}.`,
          },
          {
            text: `${ime} je ${g(ime, "pripravil", "pripravila")} nogometni turnir. Na turnirju ${verbOf(n, "je", "sta", "so")} ${nOf(n, "ekipa", "ekipi", "ekipe", "ekip")}. Vsaka ekipa igra z vsako drugo natanko enkrat. Koliko tekem odigrajo?`,
            twice: "Vsako tekmo si štel dvakrat (A proti B in B proti A je ista tekma).",
            hint: "Prva ekipa igra z vsemi drugimi. Druga še z vsemi, s katerimi še ni igrala …",
            sol: `Ekipe označimo s črkami. Vse tekme: ${ps.join(", ")}.`,
          },
        ][ctx];
        return {
          text: C.text,
          answer: withMistakes(num(v), [[n * (n - 1), C.twice]]),
          hint: C.hint,
          data: false,
          formula: sum,
          solution: `${C.sol}\nTeh je ${v} ($${sum} = ${v}$).`,
        };
      }
      // Mreža w stolpcev × h vrst; kvadrate vseh velikosti preštejemo (preverjeno s preštevanjem v testu).
      const L2 = [[2, 2], [3, 2], [2, 3], [4, 2], [2, 4], [3, 3]];
      const L3 = y === 1 ? [[5, 2], [2, 5], [4, 3], [3, 4], [6, 2], [2, 6]] : [[5, 2], [2, 5], [4, 3], [3, 4], [6, 2], [2, 6], [4, 4], [5, 3], [3, 5]];
      const [w, h] = r.pick(level === 2 ? L2 : L3);
      const per = squaresBySize(w, h);
      const v = per.reduce((s, c) => s + c, 0);
      const ime = r.pick(NAMES);
      const M = r.pick([
        { f: ["kvadratek", "kvadratka", "kvadratki", "kvadratkov"], one: "enega kvadratka", gpl: "kvadratkov", intro: (d) => `${ime} iz karirastega papirja izreže lik, ki ima ${d}.` },
        { f: ["kvadratni košček", "kvadratna koščka", "kvadratni koščki", "kvadratnih koščkov"], one: "enega koščka", gpl: "koščkov", intro: (d) => `Tabla čokolade ima ${d}.` },
        { f: ["kvadratna gredica", "kvadratni gredici", "kvadratne gredice", "kvadratnih gredic"], one: "ene gredice", gpl: "gredic", intro: (d) => `Vrt ima ${d}.` },
        { f: ["kvadratna šipa", "kvadratni šipi", "kvadratne šipe", "kvadratnih šip"], one: "ene šipe", gpl: "šip", intro: (d) => `Veliko okno ima ${d}.` },
      ]);
      const desc = `${nOf(h, "vrsto", "vrsti", "vrste", "vrst")} in v vsaki vrsti ${verbOf(w, "je", "sta", "so")} ${nOf(w, ...M.f)}`;
      const rows = per.map((c, i) => (i === 0 ? `Kvadratov iz ${M.one}: ${c}.` : `Kvadratov iz ${(i + 1) ** 2} ${M.gpl} (${nOf(i + 1, "vrsta", "vrsti", "vrste", "vrst")} po ${i + 1}): ${c}.`));
      if (r.int(0, 1)) {
        // Samo kvadrati iz 4 delov: v vsakem paru sosednjih vrst jih je w − 1.
        const c = per[1];
        const small = y <= 2;
        return {
          text: `${M.intro(desc)} Koliko je kvadratov iz 4 ${M.gpl} (2 vrsti po 2)? Kvadrati se lahko delno prekrivajo.`,
          answer: withMistakes(num(c), [[Math.floor(w / 2) * Math.floor(h / 2), `Kvadrati se lahko prekrivajo: štej tudi tiste, ki si delijo nekaj ${M.gpl}.`], [w * h, `To so vsi deli. Iščeš kvadrate iz 4 ${M.gpl}.`]]),
          hint: "Tak kvadrat leži v dveh sosednjih vrstah. Najprej preštej, koliko jih je v prvih dveh vrstah.",
          data: false,
          formula: small ? "\\text{seštej kvadrate v vseh parih sosednjih vrst}" : "\\text{kvadrati v paru vrst} \\cdot \\text{parov vrst}",
          solution: `V dveh sosednjih vrstah ${verbOf(w - 1, "je", "sta", "so")} ${nOf(w - 1, "tak kvadrat", "taka kvadrata", "taki kvadrati", "takih kvadratov")}${w > 2 ? ": vsak naslednji je za en stolpec bolj desno" : ""}.\n${h === 2 ? `Vrsti sta samo dve, zato je kvadratov ${c}.` : `Parov sosednjih vrst je ${h - 1}: $${small ? rep(h - 1, w - 1) : `${h - 1} \\cdot ${w - 1}`} = ${c}$.`}`,
        };
      }
      const mistakes = [[w * h, `Prešteti moraš tudi večje kvadrate iz več ${M.gpl}.`]];
      if (per.length > 2) mistakes.push([v - per[per.length - 1], "Pozabil si na največje kvadrate."]);
      return {
        text: `${M.intro(desc)} Koliko je vseh kvadratov, majhnih in večjih? Štejejo tudi večji kvadrati, sestavljeni iz več ${M.gpl}.`,
        answer: withMistakes(num(v), mistakes),
        hint: `Najprej preštej kvadrate iz ${M.one}, nato kvadrate iz 4 ${M.gpl} (2 vrsti po 2) in tako naprej.`,
        data: false,
        formula: "\\text{vsi kvadrati} = \\text{majhni} + \\text{večji}",
        solution: `${rows.join("\n")}\nSkupaj $${per.join(" + ")} = ${v}$.`,
      };
    },
  },
  {
    // Dnevi v tednu, trajanje v minutah, starosti brez enačb.
    id: "tek-mladi-ure",
    maxYear: 4,
    topics: [T("starosti-ure-in-koledar")],
    gen(level, r, _topic, _lang, year) {
      const y = Y(year);
      const small = y <= 2;
      if (level === 1) {
        const s = r.int(0, 6);
        const d = r.int(8, y === 1 ? 20 : y === 2 ? 30 : y === 3 ? 40 : 60);
        const past = r.int(0, 2) === 0;
        const day = DAYS[(((s + (past ? -d : d)) % 7) + 7) % 7];
        const weeks = Math.floor(d / 7), rest = d % 7;
        const dec = weeks === 1 ? "7" : small ? rep(weeks, 7) : `${weeks} \\cdot 7`;
        const ime = r.pick(NAMES);
        const text = past
          ? `Danes je ${DAYS[s]}. Kateri dan v tednu je bil pred ${d} dnevi?`
          : r.pick([`Danes je ${DAYS[s]}. Kateri dan v tednu bo čez ${d} dni?`, `Danes je ${DAYS[s]}. ${ime} ima rojstni dan čez ${d} dni. Kateri dan v tednu bo takrat?`]);
        const bil = day.endsWith("a") ? "bila" : "bil";
        return {
          text,
          answer: choiceWhy(r, day, dayMistakes(r, s, d, past)),
          hint: past ? "Pred 7 dnevi je bil isti dan v tednu kot danes." : "Čez 7 dni je spet isti dan v tednu.",
          data: false,
          formula: "\\text{vsakih 7 dni isti dan}",
          solution: rest === 0
            ? `$${d} = ${dec}$: to so sami celi tedni.\nZato ${past ? `je ${bil} takrat prav tako` : "bo spet"} ${day}.`
            : `$${d} = ${dec} + ${rest}$. Cele tedne preskočimo.\nOd danes (${DAYS[s]}) gremo še ${nOf(rest, "dan", "dneva", "dni", "dni")} ${past ? "nazaj" : "naprej"}: ${day}.`,
        };
      }
      if (level === 2) {
        // 1. in 2. razred: samo cele in pol ure (začetek ob x.00 ali x.30, traja pol ure ali uro).
        const h = r.int(7, y === 1 ? 11 : 16);
        const m = small ? r.pick([0, 30]) : r.int(0, 11) * 5;
        const dur = small ? r.pick([30, 60]) : r.int(y === 3 ? 3 : 5, y === 3 ? 11 : 17) * 5;
        const start = h * 60 + m, end = start + dur;
        const fmt = (t) => `${Math.floor(t / 60)}.${String(t % 60).padStart(2, "0")}`;
        // Mejne točke: začetek, vsaka polna ura vmes, konec.
        const pts = [start];
        for (let t = Math.floor(start / 60) * 60 + 60; t < end; t += 60) pts.push(t);
        pts.push(end);
        const segs = pts.slice(1).map((t, i) => [pts[i], t, t - pts[i]]);
        const [what, zac, kon, traj] = r.pick([["Film", "se je začel", "se je končal", "trajal"], ["Trening", "se je začel", "se je končal", "trajal"], ["Predstava", "se je začela", "se je končala", "trajala"], ["Obisk pri babici", "se je začel", "se je končal", "trajal"]]);
        const text = `${what} ${zac} ob ${fmt(start)} in ${kon} ob ${fmt(end)}. ${y === 1 ? "Koliko časa" : "Koliko minut"} je ${traj} ${what.charAt(0).toLowerCase() + what.slice(1)}?`;
        const min = (x) => nOf(x, "minuta", "minuti", "minute", "minut");
        if (y === 1) {
          const ura = (x) => (x === 30 ? "pol ure" : "ena ura");
          const right = dur === 30 ? "pol ure" : "eno uro";
          return {
            text,
            answer: choiceWhy(r, right, ["pol ure", "eno uro", "uro in pol", "dve uri"].map((o) => [o, `Od ${fmt(start)} do ${fmt(end)} traja ${right}, ne ${o}.`])),
            hint: "Od polne ure do pol je pol ure. Od pol do naslednje polne ure je še pol ure.",
            data: false,
            formula: "\\text{ena ura} = \\text{pol ure} + \\text{pol ure}",
            solution: segs.length === 1
              ? `Od ${fmt(start)} do ${fmt(end)} je ${ura(dur)}.\nTrajal${traj.endsWith("a") ? "a" : ""} je ${right}.`
              : `Od ${fmt(start)} do ${fmt(pts[1])} je pol ure, od ${fmt(pts[1])} do ${fmt(end)} še pol ure.\nPol ure in še pol ure je skupaj ena ura.`,
          };
        }
        const naive = Math.floor(end / 60) * 100 + (end % 60) - (h * 100 + m);
        let hint, solution;
        if (segs.length > 1) {
          hint = `Koliko minut je od ${fmt(start)} do ${fmt(pts[1])}? In koliko še potem?`;
          solution = `${segs.map(([p, q, x], i) => `${i ? "od" : "Od"} ${fmt(p)} do ${fmt(q)} ${i ? "še" : "je"} ${min(x)}`).join(", ")}.\nSkupaj $${segs.map((x) => x[2]).join(" + ")} = ${dur}$ minut.`;
        } else if (end % 60 === 0 && m) {
          hint = `Koliko minut manjka od ${fmt(start)} do polne ure?`;
          solution = `Konec je ob polni uri ${fmt(end)}.\nDo nje od ${fmt(start)} manjka $60 - ${m} = ${dur}$ minut.`;
        } else if (!m && dur === 60) {
          hint = "Od polne ure do naslednje polne ure je ena ura.";
          solution = `Od ${fmt(start)} do ${fmt(end)} je ena ura.\nEna ura je 60 minut.`;
        } else {
          hint = "Ura se ni zamenjala: odštej samo minute.";
          solution = `Začetek in konec sta v isti uri (od ${fmt(start)} do ${fmt(end)}).\nOdštejemo minute: $${end % 60} - ${m} = ${dur}$ minut.`;
        }
        return {
          text,
          answer: withMistakes(num(dur, "min", 0, { unitAlternatives: ["minut"] }), segs.length > 1 && naive > 0 ? [[naive, "Ura ima 60 minut, ne 100: šteti moraš čez polno uro."]] : []),
          hint,
          data: false,
          formula: "1\\ \\mathrm{h} = 60\\ \\mathrm{min}",
          solution,
        };
      }
      const [a, b] = names(r, 2);
      // 1. razred: vsota največ 19.
      const [x, dx, c] = y === 1 ? [r.int(2, 5), r.int(1, 3), r.int(1, 3)] : y === 2 ? [r.int(4, 12), r.int(1, 6), r.int(1, 6)] : [r.int(5, 12), r.int(2, 6), r.int(2, 8)];
      const v = x + (x + dx) + 2 * c;
      const stara = g(a, 0, 1) && g(b, 0, 1) ? "stari" : "stara";
      return {
        text: `${a} je ${g(a, "star", "stara")} ${let_(x)}, ${b} pa je ${let_(dx)} ${g(b, "starejši", "starejša")}. Koliko let bosta ${a} in ${b} skupaj ${stara} čez ${let_(c)}?`,
        answer: withMistakes(num(v), [[x + (x + dx) + c, `Čez ${let_(c)} se postarata ${oba(a, b)}, zato vsoti prišteješ ${c} dvakrat.`]]),
        hint: `Najprej izračunaj, koliko je star${g(b, "", "a")} ${b} danes. Potem pomisli, da se postarata ${oba(a, b)}.`,
        data: false,
        formula: small ? "\\text{vsota čez nekaj let} = \\text{vsota danes} + \\text{leta prvega} + \\text{leta drugega}" : "\\text{vsota čez } c \\text{ let} = \\text{vsota danes} + c + c",
        solution: `${b} je danes ${g(b, "star", "stara")} $${x} + ${dx} = ${x + dx}$ ${letW(x + dx)}. Skupaj sta ${stara} $${x} + ${x + dx} = ${2 * x + dx}$ ${letW(2 * x + dx)}.\nČez ${let_(c)} se postarata ${oba(a, b)}: $${2 * x + dx} + ${c} + ${c} = ${v}$.`,
      };
    },
  },
  {
    // Preštevanje možnosti brez formul: preglednica, pari, kocke, sestavljanje števil.
    id: "tek-mladi-moznosti",
    maxYear: 4,
    topics: [T("prestevanje-moznosti")],
    gen(level, r, _topic, _lang, year) {
      const y = Y(year);
      const small = y <= 2;
      const ime = r.pick(NAMES);
      if (level === 1) {
        const a = r.int(2, small ? 4 : 5), b = r.int(2, small ? 3 : 4);
        const C = r.pick([
          {
            text: `${ime} ima ${nOf(a, "majico", "majici", "majice", "majic")} in ${nOf(b, "kapo", "kapi", "kape", "kap")}. Na koliko načinov lahko izbere eno majico in eno kapo?`,
            hint: "Za vsako majico preštej, katere kape lahko vzame zraven.",
            lead: `Za vsako od ${a} majic lahko izbere ${nOf(b, "kapo", "kapi", "kape", "kap")}.`,
          },
          {
            text: `${ime} ima za malico na izbiro ${nOf(a, "vrsto kruha", "vrsti kruha", "vrste kruha", "vrst kruha")} in ${nOf(b, "namaz", "namaza", "namaze", "namazov")}. Na koliko načinov lahko izbere en kruh in en namaz?`,
            hint: "Za vsako vrsto kruha preštej, katere namaze lahko vzame zraven.",
            lead: `Za vsako od ${a} vrst kruha lahko izbere ${nOf(b, "namaz", "namaza", "namaze", "namazov")}.`,
          },
          {
            text: `Od doma do šole ${verbOf(a, "vodi", "vodita", "vodijo")} ${nOf(a, "pot", "poti", "poti", "poti")}, od šole do knjižnice pa ${nOf(b, "pot", "poti", "poti", "poti")}. Na koliko načinov lahko ${ime} pride od doma do knjižnice mimo šole?`,
            hint: "Za vsako pot do šole preštej, po katerih poteh lahko gre naprej do knjižnice.",
            lead: `Za vsako od ${a} poti do šole lahko izbere ${nOf(b, "pot", "poti", "poti", "poti")} do knjižnice.`,
          },
        ]);
        return {
          text: C.text,
          answer: withMistakes(num(a * b), [[a + b, small ? "Za vsako prvo izbiro so na voljo vse druge: ne seštej samo obeh števil." : "Vsako prvo izbiro lahko združiš z vsako drugo: števili zmnoži, ne seštej."]]),
          hint: C.hint,
          data: false,
          formula: small ? "\\text{za vsako prvo izbiro prištej vse druge}" : "\\text{načini} = \\text{prve izbire} \\cdot \\text{druge izbire}",
          solution: `${C.lead}\nSkupaj $${small ? rep(a, b) : `${a} \\cdot ${b}`} = ${a * b}$ ${nOf(a * b, "način", "načina", "načini", "načinov").replace(/^\d+ /, "")}.`,
        };
      }
      if (level === 2) {
        const n = r.int(3, y === 1 ? 6 : y === 2 ? 7 : 8);
        const v = (n * (n - 1)) / 2;
        const sum = Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ");
        const C = r.int(0, 1)
          ? {
              text: `V slaščičarni imajo ${nOf(n, "okus", "okusa", "okuse", "okusov")} sladoleda. ${ime} si izbere dve kepici različnih okusov. Vrstni red kepic ni pomemben. Koliko različnih izbir ima?`,
              twice: "Jagoda in čokolada je ista izbira kot čokolada in jagoda; tako si vsako štel dvakrat.",
              hint: "Prvi okus združi z vsemi drugimi, drugi z vsemi naslednjimi …",
              what: "Okuse",
            }
          : {
              text: `Na polici ${verbOf(n, "je", "sta", "so")} ${nOf(n, "knjiga", "knjigi", "knjige", "knjig")}. ${ime} si izposodi dve različni knjigi. Koliko različnih izbir ima?`,
              twice: "Knjigi A in B sta ista izbira kot B in A; tako si vsako štel dvakrat.",
              hint: "Prvo knjigo združi z vsemi drugimi, drugo z vsemi naslednjimi …",
              what: "Knjige",
            };
        return {
          text: C.text,
          answer: withMistakes(num(v), [[n * (n - 1), C.twice]]),
          hint: C.hint,
          data: false,
          formula: sum,
          solution: `${C.what} označimo s črkami. Vse izbire: ${pairs(n).join(", ")}.\nTeh je ${v} ($${sum} = ${v}$).`,
        };
      }
      if (y === 1) {
        // Dve kocki različnih barv: vsota pik do 12.
        const s = r.int(3, 11);
        const [c1, c2, n1, n2] = r.pick([["rdečo", "modro", "rdeča", "modra"], ["zeleno", "rumeno", "zelena", "rumena"]]);
        const list = [];
        for (let p = 1; p <= 6; p++) if (s - p >= 1 && s - p <= 6) list.push([p, s - p]);
        const unordered = list.filter(([p, q]) => p <= q).length;
        return {
          text: `${ime} vrže ${c1} in ${c2} igralno kocko. Koliko je različnih metov, pri katerih je skupaj ${nOf(s, "pika", "piki", "pike", "pik")}? (${cap(n1)} 1 in ${n2} 2 je drug met kot ${n1} 2 in ${n2} 1.)`,
          answer: withMistakes(num(list.length), [[unordered, `${cap(n1)} 1 in ${n2} 2 ni isti met kot ${n1} 2 in ${n2} 1: štej oba.`]]),
          hint: `Pojdi po vrsti: ${n1} kocka kaže 1, 2, 3 … Koliko pik mora takrat kazati ${n2}?`,
          data: false,
          formula: `\\text{${n1}} + \\text{${n2}} = ${s}`,
          solution: `Vsi meti (${n1} in ${n2}): ${list.map(([p, q]) => `${p} in ${q}`).join(", ")}.\nTeh je ${list.length}.`,
        };
      }
      const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, r.int(3, 4)).sort((p, q) => p - q);
      const d = digits.length;
      const list = [];
      for (const p of digits) for (const q of digits) if (p !== q) list.push(10 * p + q);
      return {
        text: `${ime} ima kartice s števkami ${digits.join(", ").replace(/, (\d)$/, " in $1")}. Iz dveh kartic sestavi dvomestno število. Koliko različnih števil lahko sestavi?`,
        answer: withMistakes(num(list.length), [[d * d, "Iste kartice ne moreš uporabiti dvakrat (npr. 11 ne gre)."]]),
        hint: "Za vsako števko na mestu desetic preštej, katere kartice ti ostanejo za enice.",
        data: false,
        formula: small ? rep(d, d - 1) : `${d} \\cdot ${d - 1}`,
        solution: `Na mesto desetic gre katera koli od ${d} kartic, za vsako ${verbOf(d - 1, "ostane", "ostaneta", "ostanejo")} za enice ${nOf(d - 1, "kartica", "kartici", "kartice", "kartic")}: $${small ? rep(d, d - 1) : `${d} \\cdot ${d - 1}`} = ${list.length}$.\nVsa števila: ${list.join(", ")}.`,
      };
    },
  },
];

// Rodilnik imena (od Tima, od Lare, od Žana): imena v NAMES.
function gen(name) {
  const special = { Luka: "Luke", Ana: "Ane", Eva: "Eve", Nika: "Nike", Zala: "Zale", Lara: "Lare", Maja: "Maje" };
  return special[name] || `${name}a`;
}
