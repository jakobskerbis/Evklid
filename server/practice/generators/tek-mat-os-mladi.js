// Tekmovalne naloge iz matematike za 1.–4. razred (Kenguru za mlajše; j, 15. 11. 2026).
// Teme, ki so na voljo že v 3. ali 4. razredu (competition.js MIN_YEAR), so imele samo naloge za starejše
// (stopinje med kazalcema, enačbe s starostmi, binomski simboli). Ti generatorji jih zamenjajo do 4. razreda
// (maxYear 4); starejši dobijo prejšnje (minYear 5 v tek-mat-os.js). Števila so majhna: do 20 za 1. in 2.
// razred, do 100 za 3. in do 1000 za 4. razred. Pravilen odgovor je izračunan s preštevanjem.
import { NAMES, g, nOf, verbOf } from "../rng.js";
import { num, DAYS, choiceAns, withMistakes } from "./tek-util.js";

const T = (slug) => `MAT-TEK-OS/${slug}`;
const Y = (year) => (Number.isInteger(year) ? year : 3);
const names = (r, n) => r.shuffle(NAMES).slice(0, n);
const bonbonov = (n) => nOf(n, "bonbon", "bonbona", "bonboni", "bonbonov");
const let_ = (n) => nOf(n, "leto", "leti", "leta", "let");
// Vsi pari iz n stvari, označenih s črkami: »AB, AC, BC«.
const pairs = (n) => {
  const L = "ABCDEFGH".slice(0, n);
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
        text: `${kids.slice().sort().join(", ").replace(/, ([^,]*)$/, " in $1")} se postavijo v vrsto po višini. Vemo:\n\n${facts.map((f) => `- ${f}`).join("\n")}\n\n${q}`,
        answer: choiceAns(r, right, kids.filter((k) => k !== right)),
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
      const [a, b] = names(r, 2);
      const k = level === 2 ? 3 : 2; // vzame 1 do k
      const m = k + 1;
      const hi = Y(year) <= 2 ? 10 : level === 1 ? 10 : 20;
      const rule = `${a} in ${b} izmenično jemljeta bonbone s krožnika. Vsak v svoji potezi vzame ${k === 2 ? "1 ali 2 bonbona" : "1, 2 ali 3 bonbone"}. Kdor vzame zadnji bonbon, zmaga. Začne ${a}.`;
      const why = `Če ${verbOf(m, "ostane", "ostaneta", "ostanejo")} ${bonbonov(m)}, igralec na potezi izgubi: karkoli vzame (1 do ${k}), drugi vzame toliko, da skupaj vzameta ${m}, in na koncu vzame zadnjega. Zato so slabi vsi kupi z ${m}, ${2 * m}, ${3 * m} … bonboni.`;
      if (level === 3) {
        const n = r.int(m + 1, hi);
        const first = n % m !== 0;
        const right = first ? a : b;
        return {
          text: `Na krožniku ${verbOf(n, "je", "sta", "so")} ${bonbonov(n)}. ${rule} Kdo zmaga, če oba igrata najbolje?`,
          answer: choiceAns(r, right, [right === a ? b : a]),
          hint: `Začni pri koncu: kdo zmaga, če ostanejo 1, 2 ali ${m} bonboni?`,
          data: false,
          formula: `\\text{slabi kupi: } ${m}, ${2 * m}, ${3 * m}, \\ldots`,
          solution: `${why}\n${n} ${first ? `ni deljivo s ${m}, zato ${a} najprej vzame ${n % m} in ${b} ostane slab kup ${n - (n % m)}. Zmaga ${a}.` : `je deljivo s ${m}, zato ${a} začne pri slabem kupu. Karkoli vzame, ${b} dopolni do ${m}. Zmaga ${b}.`}`,
        };
      }
      let n;
      do n = r.int(m + 1, hi);
      while (n % m === 0);
      const v = n % m;
      return {
        text: `Na krožniku ${verbOf(n, "je", "sta", "so")} ${bonbonov(n)}. ${rule} Koliko bonbonov mora ${a} vzeti v prvi potezi, da bo zagotovo ${g(a, "zmagal", "zmagala")}?`,
        answer: withMistakes(num(v), [[k, "Največ ni vedno najbolje: po tvoji potezi mora ostati kup, deljiv s " + m + "."]]),
        hint: `Po ${g(a, "njegovi", "njeni")} potezi naj ostane ${m}, ${2 * m}, ${3 * m} … bonbonov.`,
        data: false,
        formula: `\\text{po potezi naj ostane večkratnik števila } ${m}`,
        solution: `${why}\n${a} mora nasprotniku pustiti slab kup. Največji večkratnik števila ${m}, manjši od ${n}, je ${n - v}, zato vzame $${n} - ${n - v} = ${v}$.`,
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
      if (level === 1) {
        const n = r.int(12, y <= 2 ? 20 : y === 3 ? 40 : 120);
        const cnt = (k) => String(k).length;
        let v = 0;
        for (let k = 1; k <= n; k++) v += cnt(k);
        const parts = n < 100 ? `Enomestnih števil je 9 (9 števk), dvomestnih od 10 do ${n} je ${n - 9} (po 2 števki)` : `Enomestnih je 9, dvomestnih 90 (180 števk), trimestnih od 100 do ${n} je ${n - 99} (po 3 števke)`;
        return {
          text: `${r.pick(NAMES)} zapiše vsa števila od 1 do ${n}. Koliko števk zapiše?`,
          answer: withMistakes(num(v), [[n, "To je število števil, ne števk. Dvomestna števila imajo po 2 števki."]]),
          hint: "Posebej preštej enomestna in dvomestna števila.",
          data: false,
          formula: "\\text{števke} = \\text{enomestna} \\cdot 1 + \\text{dvomestna} \\cdot 2",
          solution: n < 100 ? `${parts}: $9 + ${n - 9} \\cdot 2 = ${v}$.` : `${parts}: $9 + 180 + ${n - 99} \\cdot 3 = ${v}$.`,
        };
      }
      const s = r.int(3, y <= 2 ? 9 : 15);
      if (level === 2) {
        const t = Math.max(1, s - 9);
        const v = 10 * t + (s - t);
        return {
          text: `Katero je najmanjše dvomestno število, ki ima vsoto števk ${s}?`,
          answer: num(v),
          hint: "Prva števka (desetice) naj bo čim manjša.",
          data: false,
          formula: "\\text{dvomestno število} = 10 \\cdot \\text{desetice} + \\text{enice}",
          solution: `Desetice naj bodo čim manjše, enice pa največ 9. ${t === 1 ? `Desetica 1, enic $${s} - 1 = ${s - 1}$` : `Z desetico ${t - 1} bi rabili ${s - t + 1} enic, kar je več kot 9. Desetica ${t}, enic ${s - t}`}. Število je ${v}.`,
        };
      }
      const list = [];
      for (let k = 10; k <= 99; k++) if (Math.floor(k / 10) + (k % 10) === s) list.push(k);
      return {
        text: `Koliko dvomestnih števil ima vsoto števk ${s}?`,
        answer: num(list.length),
        hint: "Zapiši jih po vrsti: začni z deseticami 1, nato 2 …",
        data: false,
        formula: "\\text{desetice} + \\text{enice} = " + s,
        solution: `Vsa taka števila: ${list.join(", ")}. Teh je ${list.length}.`,
      };
    },
  },
  {
    // Štetje likov in rokovanj, opisano z besedami.
    id: "tek-mladi-liki",
    maxYear: 4,
    topics: [T("stetje-poti-in-likov")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(3, 6);
        const v = (n * (n - 1)) / 2;
        return {
          text: `Na rojstnem dnevu je ${nOf(n, "otrok", "otroka", "otroci", "otrok")}. Vsak se z vsakim drugim rokuje natanko enkrat. Koliko rokovanj je bilo?`,
          answer: withMistakes(num(v), [[n * (n - 1), "Vsako rokovanje si štel dvakrat (Ana z Janom in Jan z Ano je isto rokovanje)."]]),
          hint: "Prvi otrok se rokuje z vsemi drugimi. Drugi še z vsemi, s katerimi se še ni …",
          data: false,
          formula: `${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")}`,
          solution: `Otroke označimo s črkami. Vsa rokovanja: ${pairs(n).join(", ")}. Teh je ${v} ($${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${v}$).`,
        };
      }
      const [w, h] = level === 2 ? (r.int(0, 1) ? [2, 2] : [3, 3]) : [r.int(3, 4), 2];
      let v = 0;
      const rows = [];
      for (let k = 1; k <= Math.min(w, h); k++) {
        const c = (w - k + 1) * (h - k + 1);
        v += c;
        rows.push(`velikosti ${k} × ${k}: ${c}`);
      }
      const shape = w === h ? `Velik kvadrat je razdeljen na ${w * h} enakih kvadratkov (${w} ${w === 2 ? "vrsti" : "vrste"} po ${w}).` : `Pravokotnik je razdeljen na ${w * h} enakih kvadratkov (2 vrsti po ${w}).`;
      return {
        text: `${shape} Koliko kvadratov vseh velikosti lahko najdeš na sliki? (Štejejo tudi večji kvadrati, sestavljeni iz več kvadratkov.)`,
        answer: withMistakes(num(v), [[w * h, "Prešteti moraš tudi večje kvadrate iz več kvadratkov."]]),
        hint: "Posebej preštej majhne kvadratke, nato kvadrate iz 2 × 2 kvadratkov in tako naprej.",
        data: false,
        formula: "\\text{vsi kvadrati} = \\text{majhni} + \\text{večji}",
        solution: `Kvadrati ${rows.join(", ")}. Skupaj $${rows.map((x) => x.split(": ")[1]).join(" + ")} = ${v}$.`,
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
      if (level === 1) {
        const s = r.int(0, 6);
        const d = r.int(8, y <= 2 ? 14 : 30);
        const day = DAYS[(s + d) % 7];
        return {
          text: `Danes je ${DAYS[s]}. Kateri dan v tednu bo čez ${d} dni?`,
          answer: choiceAns(r, day, r.shuffle(DAYS.filter((x) => x !== day))),
          hint: "Čez 7 dni je spet isti dan v tednu.",
          data: false,
          formula: "\\text{vsakih 7 dni isti dan}",
          solution: d % 7 === 0
            ? `$${d} = ${d / 7} \\cdot 7$: to so sami celi tedni, zato je spet ${day}.`
            : `$${d} = ${Math.floor(d / 7) === 1 ? "7" : `${Math.floor(d / 7)} \\cdot 7`} + ${d % 7}$. Cele tedne preskočimo, od danes (${DAYS[s]}) gremo še ${nOf(d % 7, "dan", "dneva", "dni", "dni")} naprej: ${day}.`,
        };
      }
      if (level === 2) {
        const h = r.int(7, 16);
        const m = r.pick([15, 20, 30, 35, 40, 45, 50]);
        const dur = r.pick(y <= 2 ? [20, 30, 40] : [25, 35, 40, 45, 50, 55]);
        const end = h * 60 + m + dur;
        const fmt = (t) => `${Math.floor(t / 60)}.${String(t % 60).padStart(2, "0")}`;
        return {
          text: `Film se je začel ob ${fmt(h * 60 + m)} in končal ob ${fmt(end)}. Koliko minut je trajal?`,
          answer: withMistakes(num(dur, "min", 0, { unitAlternatives: ["minut"] }), [[Math.abs((end % 60) - m), "Ura ima 60 minut, ne 100: šteti moraš čez polno uro."]]),
          hint: `Koliko minut je od ${fmt(h * 60 + m)} do ${h + 1}.00? In koliko še potem?`,
          data: false,
          formula: "1\\ \\mathrm{h} = 60\\ \\mathrm{min}",
          solution: `Od ${fmt(h * 60 + m)} do ${h + 1}.00 je ${60 - m} minut, od ${h + 1}.00 do ${fmt(end)} še ${end - (h + 1) * 60}. Skupaj $${60 - m} + ${end - (h + 1) * 60} = ${dur}$ minut.`,
        };
      }
      const [a, b] = names(r, 2);
      const x = r.int(5, 9), dx = r.int(2, 5), c = r.int(2, 6);
      const v = x + (x + dx) + 2 * c;
      return {
        text: `${a} je ${g(a, "star", "stara")} ${x} let, ${b} pa je ${dx === 2 ? "2 leti" : `${dx} ${dx < 5 ? "leta" : "let"}`} ${g(b, "starejši", "starejša")}. Koliko let bosta ${a} in ${b} skupaj ${g(a, 0, 1) && g(b, 0, 1) ? "stari" : "stara"} čez ${let_(c)}?`,
        answer: withMistakes(num(v), [[x + (x + dx) + c, `Čez ${let_(c)} se postarata oba, zato vsoti prišteješ ${c} dvakrat.`]]),
        hint: `Najprej izračunaj, koliko je star${g(b, "", "a")} ${b} danes. Potem pomisli, da se postarata oba.`,
        data: false,
        formula: "\\text{vsota čez } c \\text{ let} = \\text{vsota danes} + 2c",
        solution: `${b} je danes ${g(b, "star", "stara")} $${x} + ${dx} = ${x + dx}$ let. Skupaj sta ${g(a, 0, 1) && g(b, 0, 1) ? "stari" : "stara"} $${x} + ${x + dx} = ${2 * x + dx}$ let. Čez ${let_(c)} se postarata oba: $${2 * x + dx} + ${c} + ${c} = ${v}$.`,
      };
    },
  },
  {
    // Preštevanje možnosti brez formul: preglednica, pari, sestavljanje števil.
    id: "tek-mladi-moznosti",
    maxYear: 4,
    topics: [T("prestevanje-moznosti")],
    gen(level, r) {
      const ime = r.pick(NAMES);
      if (level === 1) {
        const a = r.int(2, 4), b = r.int(2, 3);
        return {
          text: `${ime} ima ${nOf(a, "majico", "majici", "majice", "majic")} in ${b === 2 ? "2 hlače" : `${b} hlače`}. Na koliko načinov se lahko obleče, če vzame eno majico in ene hlače?`,
          answer: withMistakes(num(a * b), [[a + b, "Vsako majico lahko obleče z vsakimi hlačami: števili zmnoži, ne seštej."]]),
          hint: "Za vsako majico preštej, s katerimi hlačami jo lahko obleče.",
          data: false,
          formula: "\\text{načini} = \\text{majice} \\cdot \\text{hlače}",
          solution: `Vsaka od ${a} majic gre z vsakimi od ${b} hlač: $${a} \\cdot ${b} = ${a * b}$.`,
        };
      }
      if (level === 2) {
        const n = r.int(3, 6);
        const v = (n * (n - 1)) / 2;
        return {
          text: `V slaščičarni imajo ${nOf(n, "okus", "okusa", "okuse", "okusov")} sladoleda. ${ime} si izbere dve kepici različnih okusov. Vrstni red kepic ni pomemben. Koliko različnih izbir ima?`,
          answer: withMistakes(num(v), [[n * (n - 1), "Jagoda in čokolada je ista izbira kot čokolada in jagoda; tako si vsako štel dvakrat."]]),
          hint: "Prvi okus združi z vsemi drugimi, drugi z vsemi naslednjimi …",
          data: false,
          formula: `${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")}`,
          solution: `Okuse označimo s črkami. Vse izbire: ${pairs(n).join(", ")}. Teh je ${v} ($${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${v}$).`,
        };
      }
      const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, r.int(3, 4)).sort((p, q) => p - q);
      const list = [];
      for (const p of digits) for (const q of digits) if (p !== q) list.push(10 * p + q);
      return {
        text: `${ime} ima kartice s števkami ${digits.join(", ").replace(/, (\d)$/, " in $1")}. Iz dveh kartic sestavi dvomestno število. Koliko različnih števil lahko sestavi?`,
        answer: withMistakes(num(list.length), [[digits.length * digits.length, "Iste kartice ne moreš uporabiti dvakrat (npr. 11 ne gre)."]]),
        hint: "Za vsako števko na mestu desetic preštej, katere kartice ti ostanejo za enice.",
        data: false,
        formula: `${digits.length} \\cdot ${digits.length - 1}`,
        solution: `Na mesto desetic gre katerakoli od ${digits.length} kartic, na mesto enic ena od ${digits.length - 1} preostalih: $${digits.length} \\cdot ${digits.length - 1} = ${list.length}$ (${list.join(", ")}).`,
      };
    },
  },
];

// Rodilnik imena (od Tima, od Lare, od Žana): imena v NAMES.
function gen(name) {
  const special = { Luka: "Luke", Ana: "Ane", Eva: "Eve", Nika: "Nike", Zala: "Zale", Lara: "Lare", Maja: "Maje" };
  return special[name] || `${name}a`;
}
