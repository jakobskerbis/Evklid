// Generatorji nalog za matematiko v OŠ (6.–9. razred).
// Vsak generator izračuna števila in pravilen odgovor v kodi.
import { NAMES, choices, g, nOf, verbOf } from "../rng.js";
import { fmt, gcd, roundHalfUp } from "../check.js";

// Število za LaTeX z decimalno vejico.
export const tx = (x, d = null) => fmt(x, d).replace(",", "{,}").replace("−", "-");
const frac = (n, d) => `\\frac{${n}}{${d}}`;

function reduce(n, d) {
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, (s * d) / g];
}
const fracTex = (n, d) => (d === 1 ? `${n}` : n < 0 ? `-${frac(-n, d)}` : frac(n, d));

// Pomožne funkcije za rubriko »Podatki« (Podatki / Iščemo), formulo in račun v rešitvi (vse brez $).
// Enota za LaTeX: unitTex("cm²") → "\mathrm{cm^2}"; enota, ki se začne z \, ostane (npr. \text{€}).
const unitTex = (u) => (u.startsWith("\\") ? u : `\\mathrm{${u.replace("²", "^2").replace("³", "^3")}}`);
// Količina z enoto: qty("2{,}5", "cm") → "2{,}5\ \mathrm{cm}".
const qty = (val, unit) => `${val}\\ ${unitTex(unit)}`;
// Vrstica podatka: dat("a", tx(a), "cm") → "a = 5\ \mathrm{cm}". Vrednost mora biti zapisana enako kot v besedilu.
const dat = (sym, val, unit) => `${sym} = ${unit ? qty(val, unit) : val}`;
// Rezultat: "= 4{,}5\ \mathrm{cm}" oz. "\approx 4{,}51\ \mathrm{cm}", kadar ga je bilo treba zaokrožiti na d decimalk.
const needsRounding = (x, d) => Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const res = (x, d, unit) => `${needsRounding(x, d) ? "\\approx" : "="} ${qty(tx(x, d), unit)}`;
// Zaokrožena vrednost za natančnim rezultatom: " \approx 10{,}81\ \mathrm{cm^2}" ali prazen niz, če zaokroževanje ni potrebno.
const rnd = (x, d, unit) => (needsRounding(x, d) ? ` \\approx ${qty(tx(x, d), unit)}` : "");
// Negativno število v oklepaju: par(-3) → "(-3)".
const par = (x) => (x < 0 ? `(${x})` : `${x}`);
const EUR = "\\text{€}";
const PCT = "\\%";
const P_FORMULA = "P = \\dfrac{\\text{ugodni izidi}}{\\text{vsi izidi}}";

// Tipične napake: withMistakes(answer, [[vrednost, "zakaj"], ...]) doda answer.mistakes.
// Obdrži le končne vrednosti, ki se jasno ločijo od pravilne (in sprejetih) ter med sabo; največ 3.
export function withMistakes(answer, list) {
  const step = answer.decimals != null ? 10 ** -answer.decimals : 0;
  const far = (x, y) => Math.abs(x - y) > Math.max(1.02 * step, 0.006 * Math.abs(y), 1e-9);
  const ok = [answer.value, ...(answer.alsoAccept || [])];
  const out = [];
  for (const [value, why] of list) {
    if (!Number.isFinite(value) || !why || !ok.every((e) => far(value, e)) || !out.every((m) => far(value, m.value))) continue;
    out.push({ value: Math.round(value * 1e9) / 1e9, why });
  }
  return out.length ? { ...answer, mistakes: out.slice(0, 3) } : answer;
}
// Izbira z razlago napačnih možnosti: choicesWhy(r, pravilna, [[motilec, "zakaj"], ...])
// → { options, index, why } (why[i] = null pri pravilni možnosti).
export function choicesWhy(r, correct, pairs) {
  const seen = new Set([correct]);
  const ds = [];
  for (const [opt, why] of pairs) {
    if (seen.has(opt) || ds.length >= 3) continue;
    seen.add(opt);
    ds.push([opt, why]);
  }
  const opts = r.shuffle([[correct, null], ...ds]);
  return { options: opts.map((o) => o[0]), index: opts.findIndex((o) => o[0] === correct), why: opts.map((o) => o[1]) };
}
// Račun po korakih, vsak korak v svoji vrstici: eqs("p", "a \\cdot b", "3 \\cdot 4", "12")
// → "$p = a \cdot b$\n$p = 3 \cdot 4$\n$p = 12$". Korak, ki se začne z "=" ali "\approx", ostane tak.
export const eqs = (lhs, ...steps) =>
  steps
    .filter(Boolean)
    .map((s) => `$${lhs} ${/^(=|\\approx)/.test(s) ? s : `= ${s}`}$`)
    .join("\n");

// Razcep na prafaktorje: primeFactors(12) → [2, 2, 3].
function primeFactors(n) {
  const out = [];
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      out.push(p);
      n /= p;
    }
  }
  if (n > 1) out.push(n);
  return out;
}

export const MAT_GENERATORS = [
  // ---------------------------------------------------------------- 6. razred
  {
    id: "deljivost",
    topics: ["MAT-OS-6/deljivost"],
    gen(level, r) {
      // Predlog pred številom: »s 3«, »z 9«.
      const prep = (x) => ([3, 4, 5, 6, 7, 15, 24].includes(x) ? "s" : "z");
      const name = r.pick(NAMES);
      const mode = level === 1 ? "dane" : level === 2 ? r.pick(["dane", "stevka"]) : r.pick(["dopolni", "do-n", "skupni"]);
      if (mode === "stevka") {
        // Manjkajoča števka: vsota števk mora biti deljiva s 3 oz. z 9.
        const k = r.pick([3, 9]);
        const ds = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
        const pos = r.int(1, 3);
        const known = ds.filter((_, i) => i !== pos);
        const S = known.reduce((s, x) => s + x, 0);
        const d = (k - (S % k)) % k;
        const shown = ds.map((x, i) => (i === pos ? "\\square" : x)).join("");
        const full = ds.map((x, i) => (i === pos ? d : x)).join("");
        return {
          text: `V število $${shown}$ vpiši namesto $\\square$ najmanjšo števko, da bo število deljivo ${prep(k)} $${k}$. Katero števko vpišeš?`,
          answer: withMistakes({ type: "number", value: d }, [
            [S % k, "Si vzel ostanek vsote? Iščeš, koliko manjka vsoti do večkratnika."],
            [k === 3 ? (9 - (S % 9)) % 9 : NaN, "S to števko je vsota deljiva z 9; za deljivost s 3 zadošča tudi manjša."],
            [d === 0 ? k : NaN, "Tudi 0 je števka. Je vsota znanih števk morda že deljiva?"],
          ]),
          hint: `Seštej znane števke. Koliko manjka do najbližjega večkratnika števila ${k}?`,
          data: false,
          formula: false,
          solution: `Vsota znanih števk: $${known.join(" + ")} = ${S}$\nNajbližji večkratnik števila $${k}$, ki ni manjši od $${S}$: $${S + d}$\nŠtevka: $${S + d} - ${S} = ${d}$, število je $${full}$.`,
        };
      }
      if (mode === "dopolni") {
        const ctx = r.pick([
          ["jajc", "škatel", [6, 10, 12], (n, k) => `${name} ima ${n} jajc in jih pakira v škatle po ${k}. Najmanj koliko jajc mora še dodati, da bodo vse škatle polne?`],
          ["učencev", "skupin", [4, 5, 6, 8], (n, k) => `Na športni dan pride ${n} učencev. Razporedijo jih v skupine po ${k}. Najmanj koliko učencev bi moralo še priti, da bi bile vse skupine polne?`],
          ["steklenic", "zabojev", [6, 12, 20, 24], (n, k) => `V skladišču je ${n} steklenic. Zlagajo jih v zaboje po ${k}. Najmanj koliko steklenic manjka, da bodo vsi zaboji polni?`],
          ["sličic", "strani", [8, 9, 12], (n, k) => `${name} ima ${n} sličic. Na stran albuma jih gre ${k}. Najmanj koliko sličic mora še dobiti, da bodo vse začete strani polne?`],
        ]);
        const k = r.pick(ctx[2]);
        let n = r.int(40, 400);
        if (n % k === 0) n += r.int(1, k - 1);
        const q = Math.floor(n / k);
        const o = n % k;
        const x = k - o;
        return {
          text: ctx[3](n, k),
          answer: withMistakes({ type: "number", value: x }, [
            [o, "To je ostanek, ki ostane. Koliko jih manjka do naslednjega polnega večkratnika?"],
            [q, `To je število polnih ${ctx[1]}, ne število, ki manjka.`],
            [q + 1, `To je število vseh potrebnih ${ctx[1]}, ne število, ki manjka.`],
          ]),
          hint: `Deli ${n} ${prep(k)} ${k} in poglej ostanek. Koliko manjka ostanku do ${k}?`,
          data: { given: [`n = ${n}`, `k = ${k}`], find: ["x"] },
          formula: ["n = k \\cdot q + o", "x = k - o"],
          solution: `$${n} : ${k} = ${q}$, ostanek $o = ${o}$\nDo polne skupine manjka: $x = k - o = ${k} - ${o} = ${x}$\nPreizkus: $${n} + ${x} = ${n + x} = ${k} \\cdot ${q + 1}$`,
        };
      }
      if (mode === "do-n") {
        const k = r.pick([3, 4, 6, 7, 8, 9, 11, 12]);
        let N = r.int(50, 500);
        if (N % k === 0) N += r.int(1, k - 1);
        const q = Math.floor(N / k);
        return {
          text: `Koliko naravnih števil od $1$ do $${N}$ je deljivih ${prep(k)} $${k}$?`,
          answer: withMistakes({ type: "number", value: q }, [
            [q + 1, `Največji večkratnik ne sme biti večji od ${N}: količnik zaokroži navzdol.`],
            [N - q, `To so števila, ki niso deljiva ${prep(k)} ${k}.`],
            [q * k, "To je največji tak večkratnik, iščeš pa, koliko jih je."],
          ]),
          hint: `Večkratniki števila ${k} so ${k}, ${2 * k}, ${3 * k}, … Kolikokrat gre ${k} v ${N}?`,
          data: false,
          formula: false,
          solution: `Deljiva so števila $${k} \\cdot 1, ${k} \\cdot 2, ${k} \\cdot 3, \\ldots$\n$${N} : ${k} = ${q}$, ostanek $${N % k}$\nNajvečji tak večkratnik: $${k} \\cdot ${q} = ${q * k} \\le ${N}$, zato je takih števil $${q}$.`,
        };
      }
      if (mode === "skupni") {
        const [k1, k2] = r.pick([[4, 6], [6, 8], [6, 9], [10, 15], [12, 18], [8, 12], [6, 10], [9, 12], [12, 15], [4, 14]]);
        const L = (k1 * k2) / gcd(k1, k2);
        const first = Math.ceil(1000 / L) * L;
        const P = k1 * k2;
        return {
          text: `Katero je najmanjše štirimestno število, ki je deljivo ${prep(k1)} $${k1}$ in ${prep(k2)} $${k2}$?`,
          answer: withMistakes({ type: "number", value: first }, [
            [Math.ceil(1000 / P) * P, "Si vzel produkt števil namesto najmanjšega skupnega večkratnika?"],
            [Math.floor(999 / L) * L, "To je največje trimestno tako število, ne najmanjše štirimestno."],
            [1000, `Število 1000 ni deljivo z obema številoma.`],
          ]),
          hint: `Število, deljivo z obema, je večkratnik najmanjšega skupnega večkratnika $v(${k1}, ${k2})$.`,
          data: false,
          formula: "v(a, b) = \\dfrac{a \\cdot b}{D(a, b)}",
          solution: `$v(${k1}, ${k2}) = \\dfrac{${k1} \\cdot ${k2}}{${gcd(k1, k2)}} = ${L}$\n$1000 : ${L} = ${Math.floor(1000 / L)}$, ostanek $${1000 % L}$\nNajmanjši štirimestni večkratnik: $${L} \\cdot ${first / L} = ${first}$`,
        };
      }
      const k = r.pick(level === 1 ? [2, 5, 10] : [3, 9, 4, 6]);
      const digits = level === 1 ? 3 : 4;
      let n = r.int(10 ** (digits - 1), 10 ** digits - 1);
      if (r.next() < 0.5) n -= n % k; // pol nalog je deljivih
      if (n < 10 ** (digits - 1)) n += k;
      const yes = n % k === 0;
      // Razlaga napačne izbire: katero pravilo je učenec spregledal (brez odgovora).
      const whyWrong = {
        2: "Pri deljivosti z 2 odloča samo zadnja števka: je soda?",
        5: "Pri deljivosti s 5 odloča zadnja števka: biti mora 0 ali 5.",
        10: "Pri deljivosti z 10 mora biti zadnja števka 0.",
        3: "Pri deljivosti s 3 ne odloča zadnja števka, ampak vsota vseh števk.",
        9: "Pri deljivosti z 9 seštej vse števke; deljivost vsote s 3 še ni dovolj.",
        4: "Pri deljivosti s 4 poglej število iz zadnjih dveh števk, ne le zadnje števke.",
        6: "Število je deljivo s 6 le, če je deljivo z 2 in s 3 hkrati.",
      }[k];
      const c = { options: ["Da", "Ne"], index: yes ? 0 : 1, why: yes ? [null, whyWrong] : [whyWrong, null] };
      // Preverjanje pravila deljivosti, kot ga zapiše učenec.
      const stevke = String(n).split("").map(Number);
      const last = n % 10;
      const sum = stevke.reduce((s, x) => s + x, 0);
      const sumTex = `$${stevke.join(" + ")} = ${sum}$`;
      const parity = last % 2 === 0 ? "soda" : "liha";
      const je = (ok) => (ok ? "je" : "ni");
      const rule = {
        2: `Zadnja števka je $${last}$, ki je ${parity}.`,
        5: `Zadnja števka je $${last}$${last === 0 || last === 5 ? ", torej 0 ali 5" : ", ne 0 in ne 5"}.`,
        10: `Zadnja števka je $${last}$${last === 0 ? "" : ", ne 0"}.`,
        3: `Vsota števk: ${sumTex}; $${sum}$ ${je(sum % 3 === 0)} deljivo s 3.`,
        9: `Vsota števk: ${sumTex}; $${sum}$ ${je(sum % 9 === 0)} deljivo z 9.`,
        4: `Zadnji dve števki: $${n % 100}$; $${n % 100}$ ${je(n % 4 === 0)} deljivo s 4.`,
        6: `Zadnja števka $${last}$ je ${parity}; vsota števk ${sumTex} ${je(sum % 3 === 0)} deljiva s 3.`,
      }[k];
      const q = Math.floor(n / k);
      const rem = n % k;
      return {
        text: r.pick([
          `Ali je število $${n}$ deljivo ${prep(k)} $${k}$?`,
          `Ali je število $${n}$ večkratnik števila $${k}$?`,
          `${name} ima ${n} frnikol. Ali jih lahko razdeli v vrečke po ${k}, da ne ostane nobena?`,
        ]),
        answer: { type: "choice", ...c },
        hint: {
          2: "Poglej zadnjo števko: biti mora soda.",
          5: "Poglej zadnjo števko: biti mora 0 ali 5.",
          10: "Poglej zadnjo števko: biti mora 0.",
          3: "Seštej vse števke. Je vsota deljiva s 3?",
          9: "Seštej vse števke. Je vsota deljiva z 9?",
          4: "Poglej zadnji dve števki. Je dvomestno število, ki ga tvorita, deljivo s 4?",
          6: "Število je deljivo s 6, če je deljivo z 2 in s 3 hkrati.",
        }[k],
        data: false,
        formula: false,
        solution: `${rule}\n${yes ? "Da" : "Ne"}: $${n} : ${k} = ${q}$${rem ? `, ostanek $${rem}$` : ""}.`,
      };
    },
  },
  {
    id: "decimalna-racunanje",
    topics: ["MAT-OS-6/racunanje-z-decimalnimi-stevili", "MAT-OS-6/desetiski-ulomki-in-decimalna-stevila"],
    gen(level, r) {
      const op = level === 1 ? r.pick(["+", "-"]) : level === 2 ? r.pick(["+", "-", "·"]) : r.pick(["·", ":"]);
      let a = r.dec(1, level === 3 ? 50 : 100, r.int(1, 2));
      let b = r.dec(0.1, level === 1 ? 50 : 10, level === 3 ? 1 : r.int(1, 2));
      let result;
      if (op === "+") result = a + b;
      if (op === "-") {
        if (b > a) [a, b] = [b, a];
        result = a - b;
      }
      if (op === "·") result = a * b;
      if (op === ":") {
        // deljenje z rezultatom na največ 2 decimalki
        result = r.dec(1, 30, r.int(0, 2));
        b = r.dec(0.2, 9, 1);
        a = Math.round(result * b * 1000) / 1000;
      }
      result = Math.round(result * 1e6) / 1e6;
      const opTex = op === ":" ? ":" : op === "·" ? "\\cdot" : op;
      const calc = `$${tx(a)} ${opTex} ${tx(b)} = ${tx(result)}$`;
      // Število decimalk v zapisu.
      const decs = (x) => (fmt(x).split(",")[1] || "").length;
      const da0 = decs(a);
      const db0 = decs(b);
      const D = Math.max(da0, db0);
      let solution = `Izračunamo:\n${calc}`;
      // Tipične napake: števili podpisani desno poravnano (ne vejica pod vejico), napačno število decimalk.
      const mistakes = [];
      if (op === "+" || op === "-") {
        if (da0 !== db0) {
          solution = `Vejica pod vejico; manjkajoča mesta dopolnimo z ničlami:\n$${tx(a, D)} ${opTex} ${tx(b, D)}$\n${calc}`;
          const mis = (Math.round(a * 10 ** da0) + (op === "+" ? 1 : -1) * Math.round(b * 10 ** db0)) / 10 ** D;
          if (mis > 0) mistakes.push([mis, "Si števili podpisal desno poravnano? Vejica mora biti pod vejico."]);
        } else solution = `Vejica je pod vejico, računamo kot s celimi števili:\n${calc}`;
        // Cela in decimalni del ločeno: brez prenosa čez vejico oz. »manjše od večjega« pri izposoji.
        const f = 10 ** D;
        const [A, B] = [Math.round(a * f), Math.round(b * f)];
        const [ia, fa, ib, fb] = [Math.floor(A / f), A % f, Math.floor(B / f), B % f];
        if (D > 0 && op === "+" && fa + fb >= f) mistakes.push([ia + ib + (fa + fb) / 10 ** String(fa + fb).length, "Decimalke, ki skupaj dajo več kot celo, prenesi k celim."]);
        if (D > 0 && op === "-" && fa < fb) mistakes.push([ia - ib + (fb - fa) / f, "Če je zgornja števka manjša, si izposodiš od celih; ne odštevaj manjše od večje."]);
      }
      if (op === "·") {
        mistakes.push([(Math.round(a * 10 ** da0) * Math.round(b * 10 ** db0)) / 10 ** D, "Rezultat ima toliko decimalk, kolikor jih imata oba faktorja skupaj."]);
        mistakes.push([a + b, "Si števili seštel namesto zmnožil?"]);
      }
      if (op === ":") {
        mistakes.push([(a / b) / 10 ** db0, "Vejico premakneš v obeh številih za enako mest."]);
        mistakes.push([a * b, "Si števili zmnožil namesto delil?"]);
      }
      if (op === "·" && decs(a) + decs(b) > 0) {
        const da = decs(a);
        const db = decs(b);
        const ai = Math.round(a * 10 ** da);
        const bi = Math.round(b * 10 ** db);
        solution = `Zmnožimo brez vejic: $${ai} \\cdot ${bi} = ${ai * bi}$. Faktorja imata skupaj ${nOf(da + db, "decimalko", "decimalki", "decimalke", "decimalk")}, zato jih ima toliko tudi rezultat:\n${calc}`;
      }
      if (op === ":" && decs(b) > 0) {
        const f = 10 ** decs(b);
        solution = `Vejico v obeh številih premaknemo za ${nOf(decs(b), "mesto", "mesti", "mesta", "mest")} v desno, da je delitelj celo število:\n$${tx(a)} : ${tx(b)} = ${tx(a * f)} : ${tx(b * f)} = ${tx(result)}$`;
      }
      return {
        text: `Izračunaj: $${tx(a)} ${opTex} ${tx(b)}$`,
        answer: withMistakes({ type: "number", value: result }, mistakes),
        hint:
          op === "+" || op === "-"
            ? "Podpiši števili tako, da je decimalna vejica pod decimalno vejico."
            : op === "·"
              ? "Zmnoži, kot da vejic ni, nato v rezultatu odšteješ toliko decimalk, kolikor jih imata faktorja skupaj."
              : "Delitelj naredi celo število: vejico v obeh številih premakni za enako mest v desno.",
        data: false,
        formula: false,
        solution,
      };
    },
  },
  {
    id: "merske-enote",
    topics: ["MAT-OS-6/merske-enote", "FIZ-OS-8/fizikalne-kolicine-in-enote", "FIZ-SS-1/fizikalne-kolicine-in-enote"],
    gen(level, r) {
      // sym: oznaka količine v rubriki Podatki (d dolžina, m masa, p ploščina, V prostornina, t čas).
      const sets = [
        { units: ["mm", "cm", "dm", "m"], f: 10, sym: "d" },
        { units: ["g", "dag", "kg"], f: 0, custom: { g: 1, dag: 10, kg: 1000 }, sym: "m" },
        { units: ["m", "km"], f: 0, custom: { m: 1, km: 1000 }, sym: "d" },
        { units: ["mm²", "cm²", "dm²", "m²"], f: 100, sym: "p" },
        { units: ["cm³", "dm³", "m³"], f: 1000, sym: "V" },
        { units: ["ml", "dl", "l"], f: 0, custom: { ml: 1, dl: 100, l: 1000 }, sym: "V" },
        { units: ["s", "min", "h"], f: 0, custom: { s: 1, min: 60, h: 3600 }, sym: "t" },
      ];
      const pool = level === 1 ? sets.slice(0, 3) : level === 2 ? sets.slice(0, 6) : sets.slice(3);
      const s = r.pick(pool);
      const factor = (u) => (s.custom ? s.custom[u] : s.f ** s.units.indexOf(u));
      let [from, to] = r.shuffle(s.units).slice(0, 2);
      let value = level === 1 ? r.int(1, 90) : r.dec(0.5, 90, r.int(0, 2));
      if (s.units[0] === "s") {
        // Čas: pretvorbe s faktorjem 60 naj dajo lep rezultat.
        const ratio = factor(from) / factor(to);
        value = ratio >= 1 ? r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10, 12]) : r.pick([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 6, 8]) / ratio;
      }
      const result = Math.round(((value * factor(from)) / factor(to)) * 1e9) / 1e9;
      // Zveza med enotama: 1 večja enota = k manjših; v manjšo enoto množimo, v večjo delimo.
      const ratio = factor(from) / factor(to);
      const toSmaller = ratio >= 1;
      const k = Math.round(toSmaller ? ratio : 1 / ratio);
      const relation = `1\\ ${unitTex(toSmaller ? from : to)} = ${k}\\ ${unitTex(toSmaller ? to : from)}`;
      return {
        text: `Pretvori: $${tx(value)}\\ ${unitTex(from)} = \\ ?\\ ${unitTex(to)}$`,
        answer: withMistakes({ type: "number", value: result, unit: to }, [
          // Ploščina/prostornina z dolžinskim faktorjem 10, čas in dl z desetiškim faktorjem.
          s.f > 10 && [value * 10 ** (Math.log(ratio) / Math.log(s.f)), `Pri ${s.f === 100 ? "ploščini je med sosednjima enotama faktor 100" : "prostornini je med sosednjima enotama faktor 1000"}, ne 10.`],
          s.units[0] === "s" && [value * 100 ** (Math.log(ratio) / Math.log(60)), "Ura ima 60 minut in minuta 60 sekund, ne 100."],
          s.units[0] === "ml" && from !== "l" && to !== "l" && [value * 10 ** (Math.log10(ratio) / 2), "1 dl je 100 ml, ne 10 ml."],
          [value / ratio, toSmaller ? "V manjšo enoto pretvarjaš, zato število množiš, ne deliš." : "V večjo enoto pretvarjaš, zato število deliš, ne množiš."],
        ].filter(Boolean)),
        hint: s.f
          ? `Med sosednjima enotama je faktor ${s.f}. Koliko korakov je od ${from} do ${to}?`
          : `Pomisli, koliko ${toSmaller ? to : from} je v 1 ${toSmaller ? from : to}.`,
        data: { given: [dat(s.sym, tx(value), from)], find: [`${s.sym}\\ (\\text{v}\\ ${unitTex(to)})`] },
        formula: relation,
        solution: `$${relation}$\n$${qty(tx(value), from)} = ${tx(value)} ${toSmaller ? "\\cdot" : ":"} ${k}\\ ${unitTex(to)} = ${qty(tx(result), to)}$`,
      };
    },
  },
  {
    id: "pravokotnik",
    topics: ["MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata"],
    gen(level, r) {
      const u = r.pick(["cm", "dm", "m"]);
      const u2 = `${u}²`;
      const a = level === 1 ? r.int(2, 20) : r.dec(1.5, 30, 1);
      const b = level === 1 ? r.int(2, 20) : r.dec(1.5, 30, 1);
      const kind = level === 3 ? "inverse" : r.pick(["o", "p"]);
      const name = r.pick(NAMES);
      if (kind === "inverse") {
        const p = Math.round(a * b * 100) / 100;
        return {
          text: `${name} ima vrt v obliki pravokotnika s ploščino $${tx(p)}\\ \\mathrm{${u}^2}$. Ena stranica meri $${tx(a)}\\ \\mathrm{${u}}$. Koliko meri druga stranica?`,
          answer: withMistakes({ type: "number", value: b, unit: u, tolerance: 1e-6 }, [
            [p - a, "Ploščina je produkt stranic: deli, ne odštevaj."],
            [p / 2 - a, "To bi veljalo za obseg; ploščina je produkt stranic a · b."],
            [p * a, "Iz p = a · b dobiš b z deljenjem, ne z množenjem."],
          ]),
          hint: "Ploščina je produkt stranic: $p = a \\cdot b$. Kako iz tega izraziš $b$?",
          data: { given: [dat("p", tx(p), u2), dat("a", tx(a), u)], find: ["b"] },
          formula: ["p = a \\cdot b", "b = \\dfrac{p}{a}"],
          solution: `$p = a \\cdot b \\;\\Rightarrow\\; b = \\dfrac{p}{a}$\n${eqs("b", `\\dfrac{${qty(tx(p), u2)}}{${qty(tx(a), u)}}`, qty(tx(b), u))}`,
        };
      }
      const o = Math.round(2 * (a + b) * 100) / 100;
      const p = Math.round(a * b * 100) / 100;
      const given = [dat("a", tx(a), u), dat("b", tx(b), u)];
      return kind === "o"
        ? {
            text: `Pravokotnik ima stranici $a = ${tx(a)}\\ \\mathrm{${u}}$ in $b = ${tx(b)}\\ \\mathrm{${u}}$. Izračunaj njegov obseg.`,
            answer: withMistakes({ type: "number", value: o, unit: u }, [
              [a + b, "Sešteti moraš vse štiri stranice, ne le dveh."],
              [a * b, "To je ploščina; obseg je vsota dolžin stranic."],
            ]),
            hint: "Obseg je vsota dolžin vseh štirih stranic.",
            data: { given, find: ["o"] },
            formula: "o = 2a + 2b",
            solution: eqs("o", "2a + 2b", `2 \\cdot ${qty(tx(a), u)} + 2 \\cdot ${qty(tx(b), u)}`, `${qty(tx(2 * a), u)} + ${qty(tx(2 * b), u)}`, qty(tx(o), u)),
          }
        : {
            text: `Pravokotnik ima stranici $a = ${tx(a)}\\ \\mathrm{${u}}$ in $b = ${tx(b)}\\ \\mathrm{${u}}$. Izračunaj njegovo ploščino.`,
            answer: withMistakes({ type: "number", value: p, unit: u2 }, [
              [o, "To je obseg; ploščina je produkt stranic."],
              [a + b, "Stranici zmnoži, ne seštej."],
            ]),
            hint: "Ploščina pravokotnika je $p = a \\cdot b$. Pazi na enoto.",
            data: { given, find: ["p"] },
            formula: "p = a \\cdot b",
            solution: eqs("p", "a \\cdot b", `${qty(tx(a), u)} \\cdot ${qty(tx(b), u)}`, qty(tx(p), u2)),
          };
    },
  },

  // ---------------------------------------------------------------- 7. razred
  {
    id: "nsd-nsv",
    topics: ["MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik", "MAT-OS-7/prastevila-in-razcep"],
    gen(level, r) {
      const lcm2 = (x, y) => (x * y) / gcd(x, y);
      const name = r.pick(NAMES);
      if (level === 2) {
        // Besedilne naloge: D (razdelitev brez ostanka) ali v (ponovno srečanje).
        const askD = r.next() < 0.5;
        const base = r.pick(askD ? [3, 4, 6, 8, 12] : [2, 3, 4, 5, 6]);
        const m1 = r.int(2, askD ? 9 : 6);
        let m2 = r.int(2, askD ? 9 : 6);
        if (m2 === m1) m2 = m1 + 1;
        const [a, b] = [base * m1, base * m2].sort((x, y) => x - y);
        const D = gcd(a, b);
        const v = lcm2(a, b);
        const ctxD = [
          [`${name} ima ${a} rdečih in ${b} modrih kroglic. Iz njih želi narediti čim več enakih zapestnic in porabiti vse kroglice. Največ koliko zapestnic naredi?`, "n_{\\text{rdeče}}", "n_{\\text{modre}}", "", "zapestnic"],
          [`Trak dolžine ${a} cm in trak dolžine ${b} cm razrežemo na enako dolge kose brez ostanka. Kolikšna je največja možna dolžina kosa v cm?`, "d_1", "d_2", "cm", "kosov"],
          [`V razredih je ${a} deklic in ${b} dečkov. Razdeliti jih želimo v čim več enakih skupin, da je v vsaki enako deklic in enako dečkov. Največ koliko skupin lahko naredimo?`, "n_{\\text{deklice}}", "n_{\\text{dečki}}", "", "skupin"],
        ];
        const ctxV = [
          [`Avtobus številka 1 odpelje s postaje vsakih ${a} minut, avtobus številka 6 pa vsakih ${b} minut. Ob 7.00 odpeljeta hkrati. Čez koliko minut spet odpeljeta hkrati?`, "t_1", "t_2", "min"],
          [`${name} hodi na trening vsakih ${a} dni, ${g(name, "njegov", "njena")} prijatelj${g(name, "", "ica")} pa vsakih ${b} dni. Danes sta trenirala skupaj. Čez koliko dni bosta spet trenirala na isti dan?`, "t_1", "t_2", "\\text{dni}"],
          [`Dva tekača tečeta po krožni progi. Prvi preteče krog v ${a} s, drugi v ${b} s. Startata hkrati. Čez koliko sekund sta prvič spet skupaj na startu?`, "t_1", "t_2", "s"],
        ];
        const [text, s1, s2, unit] = r.pick(askD ? ctxD : ctxV);
        const fa = primeFactors(a);
        const fb = primeFactors(b);
        const razcep = `$${a} = ${fa.join(" \\cdot ")}$\n$${b} = ${fb.join(" \\cdot ")}$`;
        return {
          text,
          answer: withMistakes(
            { type: "number", value: askD ? D : v },
            askD
              ? [
                  [v, "Iščeš največji skupni delitelj (delimo brez ostanka), ne večkratnika."],
                  [a / D, "To je, koliko enot prvega števila pride v eno skupino, ne število skupin."],
                  [(a + b) / D, "To je velikost ene skupine, ne število skupin ali dolžina kosa."],
                ]
              : [
                  [a * b, "Produkt je skupni večkratnik, ni pa nujno najmanjši."],
                  [D, "Iščeš najmanjši skupni večkratnik (čas, ko se spet ujameta), ne delitelja."],
                  [a + b, "Časov ne seštevaš: iščeš prvo število, ki je večkratnik obeh."],
                ],
          ),
          hint: askD
            ? "Delimo brez ostanka in iščemo največje tako število: to je največji skupni delitelj."
            : "Iščemo prvi čas, ki je večkratnik obeh časov: to je najmanjši skupni večkratnik.",
          data: { given: [dat(s1, `${a}`, unit), dat(s2, `${b}`, unit)], find: [askD ? `D(${a}, ${b})` : `v(${a}, ${b})`] },
          formula: askD ? "D(a, b) = \\text{produkt skupnih prafaktorjev}" : "v(a, b) = \\dfrac{a \\cdot b}{D(a, b)}",
          solution: askD
            ? `${razcep}\nSkupni prafaktorji: $D(${a}, ${b}) = ${D}$\n${text.includes("cm") ? `Najdaljši kos meri $${qty(D, "cm")}$.` : `Največ je $${D}$ skupin oz. zapestnic.`}`
            : `${razcep}\n$D(${a}, ${b}) = ${D}$\n$v(${a}, ${b}) = \\dfrac{${a} \\cdot ${b}}{${D}} = \\dfrac{${a * b}}{${D}} = ${v}$\nSpet hkrati sta čez $${v}$ ${unit === "min" ? "minut" : unit === "s" ? "sekund" : "dni"}.`,
        };
      }
      if (level === 3) {
        const kind = r.pick(["tri", "obratno", "svetilniki"]);
        if (kind === "obratno") {
          const base = r.pick([2, 3, 4, 5, 6]);
          let [p, q] = r.shuffle([2, 3, 5, 7]).slice(0, 2); // tuji faktorji
          const A = base * p * r.pick([1, 1, 2]);
          const B = base * q;
          const D = gcd(A, B);
          const v = lcm2(A, B);
          return {
            text: `Za naravni števili $a$ in $b$ velja $D(a, b) = ${D}$ in $v(a, b) = ${v}$. Število $a = ${A}$. Koliko je $b$?`,
            answer: withMistakes({ type: "number", value: B }, [
              [v / A, "Uporabi zvezo a · b = D(a, b) · v(a, b): pomnožiti moraš še z D."],
              [D * v, "Produkt D · v je enak a · b; deliti ga moraš še z a."],
              [v, "Najmanjši skupni večkratnik je večkratnik obeh števil, ne število b."],
            ]),
            hint: "Za vsaki naravni števili velja $a \\cdot b = D(a, b) \\cdot v(a, b)$.",
            data: { given: [`D(a, b) = ${D}`, `v(a, b) = ${v}`, `a = ${A}`], find: ["b"] },
            formula: ["a \\cdot b = D(a, b) \\cdot v(a, b)", "b = \\dfrac{D(a, b) \\cdot v(a, b)}{a}"],
            solution: `$a \\cdot b = D(a, b) \\cdot v(a, b)$\n$${A} \\cdot b = ${D} \\cdot ${v} = ${D * v}$\n$b = ${D * v} : ${A} = ${B}$`,
          };
        }
        const pool = kind === "svetilniki" ? [4, 6, 8, 9, 10, 12, 15] : [6, 8, 12, 15, 18, 20, 24, 30, 36];
        const [a, b, c] = r.shuffle(pool).slice(0, 3).sort((x, y) => x - y);
        const D2 = gcd(a, b);
        const D3 = gcd(D2, c);
        const v2 = lcm2(a, b);
        const v3 = lcm2(v2, c);
        const askD = kind === "tri" && r.next() < 0.5;
        const fac = (x) => `$${x} = ${primeFactors(x).join(" \\cdot ")}$`;
        if (askD) {
          return {
            text: `Poišči največji skupni delitelj treh števil: $D(${a}, ${b}, ${c})$`,
            answer: withMistakes({ type: "number", value: D3 }, [
              [D2, "Delitelj mora deliti vsa tri števila, ne le prvih dveh."],
              [v3, "To je najmanjši skupni večkratnik, ne delitelj."],
              [a, "Najmanjše število ne deli nujno ostalih dveh."],
            ]),
            hint: "Razcepi vsa tri števila na prafaktorje in vzemi le prafaktorje, ki so v vseh treh.",
            data: false,
            formula: "D(a, b, c) = D(D(a, b), c)",
            solution: `${fac(a)}\n${fac(b)}\n${fac(c)}\n$D(${a}, ${b}) = ${D2}$\n$D(${a}, ${b}, ${c}) = D(${D2}, ${c}) = ${D3}$`,
          };
        }
        const text =
          kind === "svetilniki"
            ? `Trije svetilniki zasvetijo vsak ob svojem času: prvi vsakih ${a} s, drugi vsakih ${b} s, tretji vsakih ${c} s. Pravkar so zasvetili hkrati. Čez koliko sekund bodo spet zasvetili hkrati?`
            : `Poišči najmanjši skupni večkratnik treh števil: $v(${a}, ${b}, ${c})$`;
        return {
          text,
          answer: withMistakes({ type: "number", value: v3 }, [
            [a * b * c, "Produkt je skupni večkratnik, ni pa nujno najmanjši."],
            [v2, "Upoštevati moraš vsa tri števila, ne le prvih dveh."],
            [D3, "To je največji skupni delitelj, iščeš pa večkratnik."],
          ]),
          hint: "Najprej poišči $v$ prvih dveh števil, nato $v$ tega rezultata in tretjega števila.",
          data: kind === "svetilniki" ? { given: [dat("t_1", `${a}`, "s"), dat("t_2", `${b}`, "s"), dat("t_3", `${c}`, "s")], find: [`v(${a}, ${b}, ${c})`] } : false,
          formula: ["v(a, b, c) = v(v(a, b), c)", "v(a, b) = \\dfrac{a \\cdot b}{D(a, b)}"],
          solution: `$v(${a}, ${b}) = \\dfrac{${a} \\cdot ${b}}{${D2}} = ${v2}$\n$v(${v2}, ${c}) = \\dfrac{${v2} \\cdot ${c}}{${gcd(v2, c)}} = ${v3}$\n${kind === "svetilniki" ? `Hkrati zasvetijo čez $${qty(v3, "s")}$.` : `$v(${a}, ${b}, ${c}) = ${v3}$`}`,
        };
      }
      const base = r.pick([2, 3, 4, 5]);
      const a = base * r.int(2, 7);
      let b = base * r.int(2, 7);
      if (b === a) b += base;
      const gab = gcd(a, b);
      const lcm = (a * b) / gab;
      const askGcd = r.next() < 0.5;
      // Razcep na prafaktorje: skupni prafaktorji dajo D, vsi (z največjimi potencami) pa v.
      const fa = primeFactors(a);
      const fb = primeFactors(b);
      const common = [];
      const rest = [...fb];
      for (const p of fa) {
        const i = rest.indexOf(p);
        if (i >= 0) {
          common.push(p);
          rest.splice(i, 1);
        }
      }
      const all = [...fa, ...rest].sort((x, y) => x - y);
      const prod = (xs) => (xs.length > 1 ? `${xs.join(" \\cdot ")} = ` : "");
      const razcep = `$${a} = ${fa.join(" \\cdot ")}$\n$${b} = ${fb.join(" \\cdot ")}$`;
      return {
        text: askGcd ? `Poišči največji skupni delitelj: $D(${a}, ${b})$` : `Poišči najmanjši skupni večkratnik: $v(${a}, ${b})$`,
        answer: withMistakes(
          { type: "number", value: askGcd ? gab : lcm },
          askGcd
            ? [[lcm, "To je najmanjši skupni večkratnik, iščeš pa delitelj."], [Math.min(a, b), "Manjše število ne deli nujno večjega."]]
            : [[a * b, "Produkt je skupni večkratnik, ni pa nujno najmanjši."], [gab, "To je največji skupni delitelj, iščeš pa večkratnik."]],
        ),
        hint: "Obe števili razcepi na prafaktorje. Za D vzameš skupne prafaktorje, za v pa vse prafaktorje z največjimi potencami.",
        data: false,
        formula: askGcd ? false : "v(a, b) = \\dfrac{a \\cdot b}{D(a, b)}",
        solution: askGcd
          ? `${razcep}\nSkupni prafaktorji: $D(${a}, ${b}) = ${prod(common)}${gab}$`
          : `${razcep}\nVsi prafaktorji z največjimi potencami: $v(${a}, ${b}) = ${prod(all)}${lcm}$\nPreizkus: $v(${a}, ${b}) = \\dfrac{${a} \\cdot ${b}}{D(${a}, ${b})} = \\dfrac{${a * b}}{${gab}} = ${lcm}$`,
      };
    },
  },
  {
    id: "ulomki-racunanje",
    topics: [
      "MAT-OS-7/sestevanje-in-odstevanje-ulomkov",
      "MAT-OS-7/mnozenje-in-deljenje-ulomkov",
      "MAT-OS-7/razsirjanje-in-krajsanje-ulomkov",
    ],
    gen(level, r) {
      if (level === 3) {
        // Večkoračne in besedilne naloge z ulomki.
        const name = r.pick(NAMES);
        const pickFrac = (maxD) => {
          const d = r.int(2, maxD);
          return [r.int(1, d - 1), d];
        };
        const kind = r.pick(["ostanek", "del-od", "vrstni-red"]);
        if (kind === "ostanek") {
          let f1, f2;
          do {
            f1 = reduce(...pickFrac(8));
            f2 = reduce(...pickFrac(8));
          } while (f1[0] * f2[1] + f2[0] * f1[1] >= f1[1] * f2[1] || f1[1] === f2[1]);
          const [n1, d1] = f1;
          const [n2, d2] = f2;
          const L = (d1 * d2) / gcd(d1, d2);
          const e1 = n1 * (L / d1);
          const e2 = n2 * (L / d2);
          const [n, d] = reduce(L - e1 - e2, L);
          const F1 = frac(n1, d1);
          const F2 = frac(n2, d2);
          const text = r.pick([
            `${name} je v ponedeljek ${g(name, "prebral", "prebrala")} $${F1}$ knjige, v torek pa $${F2}$ knjige. Kolikšen del knjige mora še prebrati? Zapiši kot okrajšan ulomek.`,
            `Na zabavi so do 20. ure pojedli $${F1}$ torte, do 21. ure pa še $${F2}$ torte. Kolikšen del torte je ostal? Zapiši kot okrajšan ulomek.`,
            `Kmet je posejal $${F1}$ njive s pšenico in $${F2}$ njive s koruzo. Kolikšen del njive je ostal neposejan? Zapiši kot okrajšan ulomek.`,
          ]);
          return {
            text,
            answer: { type: "fraction", num: n, den: d },
            hint: "Celota je $1$. Najprej seštej oba dela (skupni imenovalec), nato vsoto odštej od $1$.",
            data: { given: [`d_1 = ${F1}`, `d_2 = ${F2}`], find: ["d_{\\text{ostane}}"] },
            formula: "d_{\\text{ostane}} = 1 - d_1 - d_2",
            solution: `$d_1 + d_2 = ${F1} + ${F2} = ${frac(e1, L)} + ${frac(e2, L)} = ${frac(e1 + e2, L)}$\n$d_{\\text{ostane}} = 1 - ${frac(e1 + e2, L)} = ${frac(L, L)} - ${frac(e1 + e2, L)} = ${frac(L - e1 - e2, L)}$${L - e1 - e2 === n && L === d ? "" : `\n$d_{\\text{ostane}} = ${fracTex(n, d)}$`}`,
            inputHint: "npr. 3/4",
          };
        }
        if (kind === "del-od") {
          const [n2, d2] = reduce(...pickFrac(5));
          const [n1, d1] = reduce(...pickFrac(6));
          const [n, d] = reduce(n1 * n2, d1 * d2);
          const F1 = frac(n1, d1);
          const F2 = frac(n2, d2);
          const [what, unit, verb] = r.pick([
            ["soka", "l", `${g(name, "popil", "popila")}`],
            ["moke", "kg", "porabi"],
            ["barve", "l", "porabi"],
          ]);
          const text =
            what === "soka"
              ? `V steklenici je $${F2}\\ \\mathrm{l}$ soka. ${name} je ${verb} $${F1}$ tega soka. Koliko litrov soka je ${verb}? Zapiši kot okrajšan ulomek.`
              : what === "moke"
                ? `V vrečki je $${F2}\\ \\mathrm{kg}$ moke. Za pecivo ${name} ${verb} $${F1}$ te moke. Koliko kilogramov moke ${verb}? Zapiši kot okrajšan ulomek.`
                : `V kanti je $${F2}\\ \\mathrm{l}$ barve. Za ograjo ${name} ${verb} $${F1}$ te barve. Koliko litrov barve ${verb}? Zapiši kot okrajšan ulomek.`;
          return {
            text,
            answer: { type: "fraction", num: n, den: d },
            hint: "»Del od« pomeni množenje: ulomek pomnoži s količino.",
            data: { given: [dat("V", F2, unit), `d = ${F1}`], find: ["x"] },
            formula: ["x = d \\cdot V", "\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}"],
            solution: `$x = d \\cdot V = ${F1} \\cdot ${F2}$\n$x = \\frac{${n1} \\cdot ${n2}}{${d1} \\cdot ${d2}} = ${frac(n1 * n2, d1 * d2)}$${n1 * n2 === n && d1 * d2 === d ? "" : `\n$x = ${fracTex(n, d)}$`}\n$x = ${fracTex(n, d)}\\ \\mathrm{${unit}}$`,
            inputHint: "npr. 3/4",
          };
        }
        const [a1, b1] = reduce(...pickFrac(6));
        const [a2, b2] = reduce(...pickFrac(6));
        const [a3, b3] = reduce(...pickFrac(6));
        const op = r.pick(["+", "-"]);
        const [pn, pd] = reduce(a2 * a3, b2 * b3);
        const [n, d] = reduce(a1 * pd + (op === "+" ? 1 : -1) * pn * b1, b1 * pd);
        const L = (b1 * pd) / gcd(b1, pd);
        return {
          text: `Izračunaj in rezultat okrajšaj: $${frac(a1, b1)} ${op} ${frac(a2, b2)} \\cdot ${frac(a3, b3)}$`,
          answer: { type: "fraction", num: n, den: d },
          hint: "Pazi na vrstni red: najprej množi, nato seštevaj oz. odštevaj.",
          data: false,
          formula: ["\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}", `\\frac{a}{n} ${op} \\frac{b}{n} = \\frac{a ${op} b}{n}`],
          solution: `Najprej množimo: $${frac(a2, b2)} \\cdot ${frac(a3, b3)} = ${frac(a2 * a3, b2 * b3)}${a2 * a3 === pn && b2 * b3 === pd ? "" : ` = ${fracTex(pn, pd)}`}$\nNato ${op === "+" ? "seštejemo" : "odštejemo"}: $${frac(a1, b1)} ${op} ${fracTex(pn, pd)} = ${frac(a1 * (L / b1), L)} ${op} ${frac(pn * (L / pd), L)} = ${frac(a1 * (L / b1) + (op === "+" ? 1 : -1) * pn * (L / pd), L)}$\nRezultat: $${fracTex(n, d)}$`,
          inputHint: "npr. 3/4, -1/2 ali 1 1/3",
        };
      }
      const d1 = r.int(2, level === 1 ? 6 : 10);
      const d2 = level === 1 ? d1 : r.int(2, 10);
      let n1 = r.int(1, d1 * (level === 3 ? 2 : 1));
      let n2 = r.int(1, d2);
      if (n1 === d1) n1 = n1 > 1 ? n1 - 1 : n1 + 1;
      if (n2 === d2) n2 = n2 > 1 ? n2 - 1 : n2 + 1;
      const op = level === 1 ? r.pick(["+", "-"]) : r.pick(["+", "-", "·", ":"]);
      let n, d;
      if (op === "+") [n, d] = [n1 * d2 + n2 * d1, d1 * d2];
      if (op === "-") [n, d] = [n1 * d2 - n2 * d1, d1 * d2];
      if (op === "·") [n, d] = [n1 * n2, d1 * d2];
      if (op === ":") [n, d] = [n1 * d2, d1 * n2];
      [n, d] = reduce(n, d);
      const opTex = { "+": "+", "-": "-", "·": "\\cdot", ":": ":" }[op];
      // Koraki: ulomek pred krajšanjem izpustimo, če je že okrajšan.
      const raw = (rn, rd) => (rn === n && rd === d ? null : frac(rn, rd));
      let steps, formula;
      if (op === "+" || op === "-") {
        const L = (d1 * d2) / gcd(d1, d2); // skupni imenovalec
        const e1 = n1 * (L / d1);
        const e2 = n2 * (L / d2);
        const sum = op === "+" ? e1 + e2 : e1 - e2;
        steps = [d1 === d2 ? null : `${frac(e1, L)} ${opTex} ${frac(e2, L)}`, `\\frac{${e1} ${opTex} ${e2}}{${L}}`, raw(sum, L)];
        formula = `\\frac{a}{n} ${opTex} \\frac{b}{n} = \\frac{a ${opTex} b}{n}`;
      } else if (op === "·") {
        steps = [`\\frac{${n1} \\cdot ${n2}}{${d1} \\cdot ${d2}}`, raw(n1 * n2, d1 * d2)];
        formula = "\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}";
      } else {
        steps = [`${frac(n1, d1)} \\cdot ${frac(d2, n2)}`, `\\frac{${n1} \\cdot ${d2}}{${d1} \\cdot ${n2}}`, raw(n1 * d2, d1 * n2)];
        formula = "\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}";
      }
      return {
        text: `Izračunaj in rezultat okrajšaj: $${frac(n1, d1)} ${opTex} ${frac(n2, d2)}$`,
        answer: { type: "fraction", num: n, den: d },
        hint:
          op === "+" || op === "-"
            ? "Ulomka najprej razširi na skupni imenovalec, nato seštej oz. odštej števca."
            : op === "·"
              ? "Števec pomnožiš s števcem, imenovalec z imenovalcem. Lahko prej krajšaš navzkriž."
              : "Deliš tako, da pomnožiš z obratno vrednostjo drugega ulomka.",
        data: false,
        formula,
        // Vsak korak v svoji vrstici.
        solution: [`${frac(n1, d1)} ${opTex} ${frac(n2, d2)}`, ...steps.filter(Boolean), fracTex(n, d)].map((x, i) => (i ? `$= ${x}$` : `$${x}$`)).join("\n"),
        inputHint: "npr. 3/4, -1/2 ali 1 1/3",
      };
    },
  },
  {
    id: "odstotki",
    topics: ["MAT-OS-7/odstotni-racun"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const kind = level === 1 ? "del" : level === 2 ? r.pick(["del", "popust"]) : r.pick(["popust", "osnova", "odstotek"]);
      const p = r.pick(level === 1 ? [10, 20, 25, 50] : [5, 12, 15, 20, 25, 30, 35, 40]);
      const base = level === 1 ? r.int(2, 20) * 10 : r.dec(8, 250, r.int(0, 2));
      const part = Math.round(base * p) / 100;
      const pDat = dat("p", `${p}`, PCT);
      const cDat = dat("c", tx(base), EUR);
      const partFormula = "d = \\dfrac{p}{100} \\cdot c";
      if (kind === "del")
        return {
          text: `Koliko je $${p}\\ \\%$ od $${tx(base)}$ €?`,
          answer: withMistakes({ type: "number", value: part, unit: "€", decimals: 2, unitAlternatives: ["eur", "evrov"] }, [
            [base / p, "Z odstotkom ne deliš: odstotek pretvori v delež in ga pomnoži z osnovo."],
            [base - part, "To je, koliko ostane po odštetju; vprašali smo po delu."],
            [base * p, "Odstotek je stotinka: deliti moraš še s 100."],
          ]),
          hint: "Odstotek pretvori v decimalno število (npr. 20 % = 0,20) in ga pomnoži z osnovo.",
          data: { given: [pDat, cDat], find: ["d"] },
          formula: partFormula,
          solution: eqs("d", "\\dfrac{p}{100} \\cdot c", `\\dfrac{${p}}{100} \\cdot ${qty(tx(base), EUR)}`, `${tx(p / 100)} \\cdot ${qty(tx(base), EUR)}`, qty(tx(part), EUR)),
        };
      if (kind === "popust") {
        const price = Math.round((base - part) * 100) / 100;
        const rounded = needsRounding((base * p) / 100, 2); // popust je zaokrožen na cente
        return {
          text: `${name} kupi jakno, ki stane $${tx(base)}$ €. V trgovini imajo $${p}\\ \\%$ popusta. Koliko plača? Rezultat zaokroži na cente.`,
          answer: withMistakes({ type: "number", value: base * (1 - p / 100), unit: "€", decimals: 2, unitAlternatives: ["eur", "evrov"] }, [
            [part, "To je popust; od prvotne cene ga moraš še odšteti."],
            [base + part, "Popust ceno zmanjša, zato ga odštej, ne prištej."],
            [base - p, "Odstotkov ne odštevaš kot evre: najprej izračunaj, koliko evrov je popust."],
          ]),
          hint: "Po popustu plača $(100 - p)\\ \\%$ prvotne cene.",
          data: { given: [cDat, pDat], find: ["c_{\\text{nova}}"] },
          formula: [partFormula, "c_{\\text{nova}} = c - d"],
          solution: `$d = \\dfrac{${p}}{100} \\cdot ${qty(tx(base), EUR)} = ${tx(p / 100)} \\cdot ${qty(tx(base), EUR)} ${rounded ? "\\approx" : "="} ${qty(tx(part, 2), EUR)}$\n$c_{\\text{nova}} = c - d = ${qty(tx(base), EUR)} - ${qty(tx(part, 2), EUR)} ${rounded ? "\\approx" : "="} ${qty(tx(price, 2), EUR)}$`,
        };
      }
      if (kind === "osnova") {
        // Celota je izbrana tako, da je del celo število.
        const c = r.pick([200, 240, 300, 360, 400, 480, 500, 600, 800].filter((x) => (x * p) % 100 === 0));
        const d = (c * p) / 100;
        const one = c / 100;
        return {
          text: `$${p}\\ \\%$ učencev šole je šlo na izlet, to je $${d}$ učencev. Koliko učencev ima šola?`,
          answer: withMistakes({ type: "number", value: c }, [
            [(d * p) / 100, "Iščeš celoto, ne dela: z odstotkom deliš, ne množiš."],
            [d / p, "To je 1 % učencev; pomnoži še s 100."],
            [d + p, "Odstotka ne prišteješ številu učencev."],
          ]),
          hint: "Najprej izračunaj, koliko učencev je 1 %.",
          data: { given: [pDat, `d = ${d}`], find: ["c"] },
          formula: "c = \\dfrac{d}{p} \\cdot 100",
          solution: `$1\\ \\%$ učencev: $${d} : ${p} = ${tx(one)}$\n$c = \\dfrac{d}{p} \\cdot 100 = \\dfrac{${d}}{${p}} \\cdot 100$\n$c = ${tx(one)} \\cdot 100 = ${c}$ učencev`,
        };
      }
      const total = r.pick([20, 25, 40, 50, 80]);
      const got = r.int(1, total - 1);
      const pct = (got / total) * 100;
      return {
        text: `Na testu je bilo $${total}$ točk. ${name} je ${g(name, "dosegel", "dosegla")} $${got}$ točk. Koliko odstotkov je to? Zaokroži na eno decimalko.`,
        answer: withMistakes({ type: "number", value: pct, decimals: 1, unit: "%", unitAlternatives: ["odstotkov"] }, [
          [(total / got) * 100, "Deliti moraš dosežene točke z vsemi točkami, ne obratno."],
          [((total - got) / total) * 100, "To je odstotek izgubljenih točk, ne doseženih."],
          [got, "Točke še pretvori v delež vseh točk in pomnoži s 100 %."],
        ]),
        hint: "Delež = del : celota. Delež pomnoži s 100 %.",
        data: { given: [dat("c", `${total}`, "\\text{točk}"), dat("d", `${got}`, "\\text{točk}")], find: ["p"] },
        formula: "p = \\dfrac{d}{c} \\cdot 100\\ \\%",
        solution: eqs("p", "\\dfrac{d}{c} \\cdot 100\\ \\%", `\\dfrac{${got}}{${total}} \\cdot 100\\ \\%`, `${tx(got / total)} \\cdot 100\\ \\%`, res(pct, 1, PCT)),
      };
    },
  },
  {
    id: "premo-sorazmerje",
    topics: ["MAT-OS-7/premo-sorazmerje", "MAT-OS-7/obratno-sorazmerje", "MAT-OS-6/sklepni-racun"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 3 || (level === 2 && r.next() < 0.4)) {
        const workers = r.int(2, 6);
        const days = r.int(3, 12) * (r.next() < 0.5 ? 2 : 1);
        const workers2 = r.pick([2, 3, 4, 5, 6, 8].filter((w) => w !== workers));
        const v = (workers * days) / workers2;
        const DNI = "\\text{dni}";
        return {
          text: `${nOf(workers, "delavec", "delavca", "delavci", "delavcev")} šolo ${verbOf(workers, "prepleska", "prepleskata", "prepleskajo")} v ${days} dneh. V koliko dneh bi jo ${verbOf(workers2, "prepleskal", "prepleskala", "prepleskali", "prepleskalo")} ${nOf(workers2, "delavec", "delavca", "delavci", "delavcev")}, če delajo enako hitro? Zaokroži na eno decimalko.`,
          answer: withMistakes({ type: "number", value: v, decimals: 1, unit: "dni", unitAlternatives: ["dan", "dneh", "dnevi", "d"] }, [
            [(workers2 * days) / workers, "Si računal kot premo sorazmerje? Več delavcev pomeni manj dni."],
            [workers * days, "To je delo v »delavec-dnevih«; deli ga še s številom delavcev."],
            [days - (workers2 - workers), "Dni se ne spremenijo za razliko delavcev; produkt delavci · dnevi ostane enak."],
          ]),
          hint: "Več delavcev, manj dni: to je obratno sorazmerje. Produkt delavci · dnevi ostane enak.",
          data: { given: [`n_1 = ${workers}`, dat("t_1", `${days}`, DNI), `n_2 = ${workers2}`], find: ["t_2"] },
          formula: ["n_1 \\cdot t_1 = n_2 \\cdot t_2", "t_2 = \\dfrac{n_1 \\cdot t_1}{n_2}"],
          solution: `$n_1 \\cdot t_1 = n_2 \\cdot t_2$\n$${workers} \\cdot ${qty(days, DNI)} = ${workers2} \\cdot t_2$\n$t_2 = \\dfrac{${workers} \\cdot ${qty(days, DNI)}}{${workers2}} = \\dfrac{${qty(workers * days, DNI)}}{${workers2}} ${res(v, 1, DNI)}$`,
        };
      }
      const kg = r.int(2, 6);
      const price = r.dec(0.4, 4, 2);
      const kg2 = r.int(7, 15);
      const total = Math.round(kg * price * 100) / 100;
      const total2 = (total / kg) * kg2;
      return {
        text: `${name} je za ${kg} kg jabolk ${g(name, "plačal", "plačala")} $${tx(total, 2)}$ €. Koliko bi ${g(name, "plačal", "plačala")} za ${kg2} kg?`,
        answer: withMistakes({ type: "number", value: total2, decimals: 2, unit: "€", unitAlternatives: ["eur", "evrov"] }, [
          [total * kg2, "Najprej izračunaj ceno za 1 kg; plačilo za vse ne množiš s kilogrami."],
          [(total * kg) / kg2, "To bi bilo obratno sorazmerje; več kilogramov stane več."],
          [total / kg, "To je cena za 1 kg; pomnoži jo še z novo maso."],
        ]),
        hint: "Najprej izračunaj ceno za 1 kg.",
        data: { given: [dat("m_1", `${kg}`, "kg"), dat("c_1", tx(total, 2), EUR), dat("m_2", `${kg2}`, "kg")], find: ["c_2"] },
        formula: ["\\dfrac{c_1}{m_1} = \\dfrac{c_2}{m_2}", "c_2 = \\dfrac{c_1}{m_1} \\cdot m_2"],
        solution: `Cena za $1\\ \\mathrm{kg}$: $${qty(tx(total, 2), EUR)} : ${kg} = ${qty(tx(total / kg, 2), EUR)}$\n$c_2 = \\dfrac{c_1}{m_1} \\cdot m_2 = ${qty(tx(total / kg, 2), EUR)} \\cdot ${kg2} = ${qty(tx(total2, 2), EUR)}$`,
      };
    },
  },
  {
    id: "koti-trikotnika",
    topics: ["MAT-OS-7/vrste-trikotnikov-in-notranji-koti", "MAT-OS-7/vrste-kotov-in-pari-kotov"],
    gen(level, r) {
      const deg = (x) => `${x}^\\circ`;
      const SUM = "\\alpha + \\beta + \\gamma = 180^\\circ";
      if (level === 1) {
        const a = r.int(20, 100);
        const b = r.int(20, 160 - a);
        return {
          text: `V trikotniku merita kota $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Koliko meri kot $\\gamma$?`,
          answer: withMistakes({ type: "number", value: 180 - a - b, unit: "°", unitAlternatives: ["stopinj", "stopinje"] }, [
            [360 - a - b, "Vsota notranjih kotov trikotnika je 180°, ne 360°."],
            [a + b, "To je vsota danih kotov; odšteti jo moraš od 180°."],
            [180 - a, "Od 180° moraš odšteti oba dana kota."],
          ]),
          hint: "Vsota notranjih kotov trikotnika je $180^\\circ$.",
          data: { given: [`\\alpha = ${deg(a)}`, `\\beta = ${deg(b)}`], find: ["\\gamma"] },
          formula: [SUM, "\\gamma = 180^\\circ - \\alpha - \\beta"],
          solution: eqs("\\gamma", "180^\\circ - \\alpha - \\beta", `180^\\circ - ${deg(a)} - ${deg(b)}`, `${deg(180 - a)} - ${deg(b)}`, deg(180 - a - b)),
        };
      }
      if (level === 2) {
        const top = r.int(20, 140);
        const base = (180 - top) / 2;
        return {
          text: `Enakokraki trikotnik ima kot ob vrhu $\\gamma = ${top}^\\circ$. Koliko meri kot ob osnovnici? Zaokroži na eno decimalko.`,
          answer: withMistakes({ type: "number", value: base, decimals: 1, unit: "°", unitAlternatives: ["stopinj", "stopinje"] }, [
            [180 - top, "Ostanek do 180° si moraš razdeliti na dva enaka kota ob osnovnici."],
            [top, "Enaka sta kota ob osnovnici, ne kot ob vrhu in kot ob osnovnici."],
            [(360 - top) / 2, "Vsota notranjih kotov trikotnika je 180°, ne 360°."],
          ]),
          hint: "Kota ob osnovnici enakokrakega trikotnika sta enaka.",
          data: { given: [`\\gamma = ${deg(top)}`], find: ["\\alpha"] },
          formula: [SUM, "\\alpha = \\beta = \\dfrac{180^\\circ - \\gamma}{2}"],
          solution: `Kota ob osnovnici sta enaka: $\\alpha = \\beta$.\n${eqs("\\alpha", "\\dfrac{180^\\circ - \\gamma}{2}", `\\dfrac{180^\\circ - ${deg(top)}}{2}`, `\\dfrac{${deg(180 - top)}}{2}`, deg(tx(base)))}`,
        };
      }
      const a = r.int(30, 80);
      const b = r.int(30, 80);
      return {
        text: `V trikotniku merita notranja kota $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Koliko meri zunanji kot $\\gamma'$ ob oglišču $C$?`,
        answer: withMistakes({ type: "number", value: a + b, unit: "°", unitAlternatives: ["stopinj", "stopinje"] }, [
          [180 - a - b, "To je notranji kot γ; zunanji kot je njegov sokot."],
          [360 - a - b, "Zunanji kot dopolni notranji kot do 180°, ne do 360°."],
          [180 - a, "Zunanji kot ob C je vsota obeh nepriležnih notranjih kotov."],
        ]),
        hint: "Zunanji kot je sokot notranjega kota. Lahko pa uporabiš, da je enak vsoti nepriležnih notranjih kotov.",
        data: { given: [`\\alpha = ${deg(a)}`, `\\beta = ${deg(b)}`], find: ["\\gamma'"] },
        formula: ["\\gamma' = \\alpha + \\beta", "\\gamma' = 180^\\circ - \\gamma"],
        solution: `$\\gamma = 180^\\circ - ${deg(a)} - ${deg(b)} = ${deg(180 - a - b)}$\n${eqs("\\gamma'", "180^\\circ - \\gamma", `180^\\circ - ${deg(180 - a - b)}`, deg(a + b))}\nPreizkus: $\\gamma' = \\alpha + \\beta = ${deg(a)} + ${deg(b)} = ${deg(a + b)}$`,
      };
    },
  },
  {
    id: "ploscina-trikotnika",
    topics: ["MAT-OS-7/obseg-in-ploscina-trikotnika", "MAT-OS-7/obseg-in-ploscina-stirikotnikov"],
    gen(level, r) {
      const u = r.pick(["cm", "m"]);
      const u2 = `${u}²`;
      if (level <= 2) {
        const a = level === 1 ? r.int(2, 20) : r.dec(2, 20, 1);
        const v = level === 1 ? r.int(2, 20) : r.dec(2, 20, 1);
        const p = (a * v) / 2;
        return {
          text: `Trikotnik ima stranico $a = ${tx(a)}\\ \\mathrm{${u}}$ in pripadajočo višino $v_a = ${tx(v)}\\ \\mathrm{${u}}$. Izračunaj ploščino.`,
          answer: withMistakes({ type: "number", value: p, decimals: level === 1 ? null : 2, unit: u2 }, [
            [a * v, "Si pozabil deliti z 2? Trikotnik je polovica pravokotnika."],
            [(a + v) / 2, "Stranico in višino zmnoži, ne seštej."],
          ]),
          hint: "Ploščina trikotnika je $p = \\dfrac{a \\cdot v_a}{2}$.",
          data: { given: [dat("a", tx(a), u), dat("v_a", tx(v), u)], find: ["p"] },
          formula: "p = \\dfrac{a \\cdot v_a}{2}",
          solution: eqs("p", "\\dfrac{a \\cdot v_a}{2}", `\\dfrac{${qty(tx(a), u)} \\cdot ${qty(tx(v), u)}}{2}`, `\\dfrac{${qty(tx(a * v), u2)}}{2}`, `${qty(tx(p), u2)}${level === 1 ? "" : rnd(p, 2, u2)}`),
        };
      }
      const a = r.int(6, 20);
      const c = r.int(2, a - 2);
      const v = r.int(3, 12);
      const p = ((a + c) * v) / 2;
      return {
        text: `Trapez ima osnovnici $a = ${a}\\ \\mathrm{${u}}$ in $c = ${c}\\ \\mathrm{${u}}$ ter višino $v = ${v}\\ \\mathrm{${u}}$. Izračunaj ploščino.`,
        answer: withMistakes({ type: "number", value: p, unit: u2 }, [
          [(a + c) * v, "Si pozabil deliti z 2? Vzameš povprečje osnovnic."],
          [(a * v) / 2, "Upoštevati moraš obe osnovnici, a in c."],
          [a * c * v / 2, "Osnovnici seštej, ne zmnoži."],
        ]),
        hint: "Ploščina trapeza je $p = \\dfrac{(a + c) \\cdot v}{2}$.",
        data: { given: [dat("a", `${a}`, u), dat("c", `${c}`, u), dat("v", `${v}`, u)], find: ["p"] },
        formula: "p = \\dfrac{(a + c) \\cdot v}{2}",
        solution: eqs("p", "\\dfrac{(a + c) \\cdot v}{2}", `\\dfrac{(${qty(a, u)} + ${qty(c, u)}) \\cdot ${qty(v, u)}}{2}`, `\\dfrac{${qty(a + c, u)} \\cdot ${qty(v, u)}}{2}`, `\\dfrac{${qty((a + c) * v, u2)}}{2}`, qty(tx(p), u2)),
      };
    },
  },

  // ---------------------------------------------------------------- 8. razred
  {
    id: "cela-stevila",
    topics: ["MAT-OS-8/racunanje-s-celimi-stevili", "MAT-OS-8/cela-stevila", "MAT-OS-8/racionalna-stevila"],
    gen(level, r) {
      const a = r.nonZero(-20, 20);
      const b = r.nonZero(-20, 20);
      const c = r.nonZero(-10, 10);
      const p = (x) => (x < 0 ? `(${x})` : `${x}`);
      let text, value, step;
      let pre = ""; // razlaga pred računom (predznak, vrstni red)
      const mistakes = [];
      if (level === 1) {
        const op = r.pick(["+", "-"]);
        value = op === "+" ? a + b : a - b;
        text = `${a} ${op} ${p(b)}`;
        // Prištevanje/odštevanje negativnega števila zapišemo z nasprotnim številom.
        if (b < 0) {
          step = `${a} ${op === "+" ? "-" : "+"} ${-b}`;
          pre = op === "+" ? "Prištevanje negativnega števila je odštevanje nasprotnega števila." : "Odštevanje negativnega števila je prištevanje nasprotnega števila.";
          mistakes.push([op === "+" ? a - b : a + b, op === "+" ? "Prištevaš negativno število, zato vrednost pade." : "Minus in minus: odštevanje negativnega števila je prištevanje."]);
        } else pre = op === "+" ? `Številu $${a}$ prištejemo $${b}$.` : `Od števila $${a}$ odštejemo $${b}$.`;
        mistakes.push([op === "+" ? Math.abs(a) + Math.abs(b) : Math.abs(a) - Math.abs(b), "Pazi na predznake: računaš s celimi števili, ne le z absolutnimi vrednostmi."]);
        mistakes.push([-value, "Preveri predznak rezultata: katero število ima večjo absolutno vrednost?"]);
      } else if (level === 2) {
        const op = r.pick(["\\cdot", ":"]);
        if (op === ":") {
          value = a;
          text = `${p(a * b)} : ${p(b)}`;
        } else {
          value = a * b;
          text = `${p(a)} \\cdot ${p(b)}`;
        }
        pre = `Predznaka sta ${(op === ":" ? a * b : a) * b > 0 ? "enaka, zato je rezultat pozitiven" : "različna, zato je rezultat negativen"}.`;
        mistakes.push([-value, "Preveri predznak: enaka predznaka dasta plus, različna minus."]);
        if (op === "\\cdot") mistakes.push([a + b, "Števili zmnoži, ne seštej."]);
      } else {
        value = a - b * c;
        text = `${a} - ${p(b)} \\cdot ${p(c)}`;
        step = `${a} - ${p(b * c)}`;
        if (b * c < 0) step += ` = ${a} + ${-b * c}`;
        pre = `Najprej množimo: $${p(b)} \\cdot ${p(c)} = ${b * c}$.`;
        mistakes.push([(a - b) * c, "Najprej množi, šele nato odštevaj."]);
        mistakes.push([a + b * c, "Pazi na predznak: odštevaš produkt, minus pred negativnim produktom da plus."]);
      }
      return {
        text: `Izračunaj: $${text}$`,
        answer: withMistakes({ type: "number", value }, mistakes),
        hint:
          level === 3
            ? "Najprej množi, nato odštevaj. Pazi na predznake: minus krat minus je plus."
            : "Pri odštevanju negativnega števila prišteješ nasprotno število. Pri množenju: enaka predznaka dasta plus, različna minus.",
        data: false,
        formula: false,
        solution: `${pre}\n$${text} = ${step ? `${step} = ` : ""}${value}$`,
      };
    },
  },
  {
    id: "potence",
    topics: ["MAT-OS-8/potence-z-naravnimi-eksponenti", "MAT-OS-8/zapis-z-desetiskimi-potencami"],
    gen(level, r) {
      if (level === 1) {
        const b = r.int(2, 6);
        const e = r.int(2, 4);
        return {
          text: `Izračunaj: $${b}^${e}$`,
          answer: withMistakes({ type: "number", value: b ** e }, [
            [b * e, "Potenca ni produkt osnove in eksponenta: osnovo množiš samo s sabo."],
            [e ** b, "Zamenjal si osnovo in eksponent."],
            [b ** (e - 1), "Osnova mora biti v produktu tolikokrat, kolikor kaže eksponent."],
          ]),
          hint: `$${b}^${e}$ pomeni, da ${b} pomnožiš samo s sabo ${e}-krat.`,
          data: false,
          formula: "a^n = \\underbrace{a \\cdot a \\cdot \\ldots \\cdot a}_{n\\text{-krat}}",
          solution: `$${b}^${e} = ${Array(e).fill(b).join(" \\cdot ")}$\n$${b}^${e} = ${b ** e}$`,
        };
      }
      if (level === 2) {
        const b = r.pick(["a", "x", "2"]);
        const m = r.int(2, 7);
        const n = r.int(2, 7);
        const op = r.pick(["\\cdot", ":"]);
        const res = op === ":" ? m - n : m + n;
        if (op === ":" && m <= n) return this.gen(2, r);
        const c = choicesWhy(r, `${b}^{${res}}`, [
          [`${b}^{${m * n}}`, op === ":" ? "Pri deljenju potenc z enako osnovo eksponente odštejemo, ne zmnožimo." : "Pri množenju potenc z enako osnovo eksponente seštejemo, ne zmnožimo."],
          [`${b}^{${op === ":" ? m + n : Math.abs(m - n) || 1}}`, op === ":" ? "Pri deljenju eksponente odštejemo, ne seštejemo." : "Pri množenju eksponente seštejemo, ne odštejemo."],
          [`${b}^{${res + 1}}`, "Preveri seštevanje oz. odštevanje eksponentov."],
        ]);
        return {
          text: `Poenostavi: $${b}^{${m}} ${op} ${b}^{${n}}$`,
          answer: { type: "choice", ...c },
          options_tex: true,
          hint: op === ":" ? "Pri deljenju potenc z enako osnovo eksponente odštejemo." : "Pri množenju potenc z enako osnovo eksponente seštejemo.",
          data: false,
          formula: op === ":" ? "a^m : a^n = a^{m - n}" : "a^m \\cdot a^n = a^{m + n}",
          solution: `$${b}^{${m}} ${op} ${b}^{${n}} = ${b}^{${m} ${op === ":" ? "-" : "+"} ${n}} = ${b}^{${res}}$`,
        };
      }
      const mant = r.dec(1.1, 9.9, 1);
      const e = r.int(3, 7);
      const neg = r.next() < 0.5;
      const val = mant * 10 ** (neg ? -e : e);
      const shown = neg ? val.toFixed(e + 1).replace(".", ",") : String(Math.round(val));
      return {
        text: `Število $${shown.replace(",", "{,}")}$ zapiši v obliki $a \\cdot 10^n$, kjer je $1 \\le a < 10$. Koliko je $n$?`,
        answer: withMistakes({ type: "number", value: neg ? -e : e }, [
          [neg ? e : -e, neg ? "Število je manjše od 1, zato je eksponent negativen." : "Število je večje od 10, zato je eksponent pozitiven."],
          [neg ? -(e - 1) : e + 1, neg ? "Ne štej le ničel za vejico: štej, za koliko mest premakneš vejico do prve neničelne števke." : "Ne štej vseh števk: štej, za koliko mest premakneš vejico, da ostane ena števka pred njo."],
        ]),
        hint: "Za koliko mest moraš premakniti decimalno vejico, da dobiš število med 1 in 10? V katero smer?",
        data: false,
        formula: false,
        solution: `Vejico premaknemo za ${nOf(e, "mesto", "mesti", "mesta", "mest")} v ${neg ? "desno" : "levo"}, da dobimo $${tx(mant)}$:\n$${shown.replace(",", "{,}")} = ${tx(mant)} \\cdot 10^{${neg ? -e : e}}$, torej $n = ${neg ? -e : e}$.`,
      };
    },
  },
  {
    id: "kvadratni-koren",
    topics: ["MAT-OS-8/kvadratni-koren", "MAT-OS-8/kvadrat-stevila", "MAT-OS-8/realna-stevila"],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(2, 20);
        const sq = r.next() < 0.5;
        return {
          text: sq ? `Izračunaj: $${n}^2$` : `Izračunaj: $\\sqrt{${n * n}}$`,
          answer: withMistakes({ type: "number", value: sq ? n * n : n }, sq ? [[2 * n, "Kvadrat ni podvojitev: število pomnoži samo s sabo."]] : [[(n * n) / 2, "Koren ni polovica števila: iščeš število, ki pomnoženo samo s sabo da to število."]]),
          hint: sq ? "Število pomnoži samo s sabo." : "Katero število, pomnoženo samo s sabo, da to število?",
          data: false,
          formula: sq ? "a^2 = a \\cdot a" : "\\sqrt{a^2} = a",
          solution: sq ? `$${n}^2 = ${n} \\cdot ${n}$\n$${n}^2 = ${n * n}$` : `$${n} \\cdot ${n} = ${n * n}$, torej je $${n * n} = ${n}^2$.\n$\\sqrt{${n * n}} = \\sqrt{${n}^2} = ${n}$`,
        };
      }
      if (level === 2) {
        const n = r.int(2, 99);
        const val = Math.sqrt(n);
        if (Number.isInteger(val)) return this.gen(2, r);
        const lo = Math.floor(val);
        return {
          text: `Med katerima zaporednima naravnima številoma leži $\\sqrt{${n}}$? Vpiši manjše.`,
          answer: withMistakes({ type: "number", value: lo }, [
            [lo + 1, "Koren leži med dvema številoma; vpiši manjše od njiju."],
            [Math.floor(n / 2), "Koren ni polovica števila. Poišči popolna kvadrata okoli števila."],
          ]),
          hint: "Poišči najbližja popolna kvadrata pod in nad tem številom.",
          data: false,
          formula: "a^2 < n < (a + 1)^2 \\;\\Rightarrow\\; a < \\sqrt{n} < a + 1",
          solution: `$${lo}^2 = ${lo ** 2}$ in $${lo + 1}^2 = ${(lo + 1) ** 2}$\n$${lo ** 2} < ${n} < ${(lo + 1) ** 2}$, zato $${lo} < \\sqrt{${n}} < ${lo + 1}$.`,
        };
      }
      const k = r.pick([2, 3, 5, 6, 7]);
      const s = r.int(2, 6);
      return {
        text: `Delno koreni: $\\sqrt{${s * s * k}} = a\\sqrt{${k}}$. Koliko je $a$?`,
        answer: withMistakes({ type: "number", value: s }, [
          [s * s, "To je popolni kvadrat pod korenom; pred koren pride njegov koren."],
          [(s * s * k) / k / 2, "Koren ni polovica: iz popolnega kvadrata izračunaj koren."],
        ]),
        hint: `Število pod korenom zapiši kot produkt popolnega kvadrata in ${k}.`,
        data: false,
        formula: "\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}",
        solution: `$${s * s * k} = ${s * s} \\cdot ${k}$, kjer je $${s * s} = ${s}^2$ popolni kvadrat.\n$\\sqrt{${s * s * k}} = \\sqrt{${s * s}} \\cdot \\sqrt{${k}} = ${s}\\sqrt{${k}}$\n$a = ${s}$`,
      };
    },
  },
  {
    id: "pitagora",
    topics: ["MAT-OS-8/pitagorov-izrek", "MAT-OS-8/uporaba-pitagorovega-izreka"],
    gen(level, r) {
      const u = r.pick(["cm", "dm", "m"]);
      const u2 = `${u}²`;
      const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
      // Račun hipotenuze (ali diagonale) z enotami: sqrt((a u)^2 + (b u)^2) = sqrt(a² u² + b² u²) = sqrt(s u²).
      const sumSq = (a, b) => [`\\sqrt{(${qty(a, u)})^2 + (${qty(b, u)})^2}`, `\\sqrt{${qty(a * a, u2)} + ${qty(b * b, u2)}}`, `\\sqrt{${qty(a * a + b * b, u2)}}`];
      // Tipične napake pri hipotenuzi (c) iz katet a in b.
      const hypMistakes = (a, b) => [
        [a + b, "Katet ne seštevaš: seštej njuna kvadrata in koreni."],
        [a * a + b * b, "Pozabil si koreniti vsoto kvadratov."],
        [a === b ? NaN : Math.sqrt(Math.abs(b * b - a * a)), "Hipotenuza je najdaljša stranica: kvadrata katet seštej, ne odštej."],
      ];
      if (level === 1) {
        const [a, b, c] = r.pick(triples);
        return {
          text: `Pravokotni trikotnik ima kateti $a = ${a}\\ \\mathrm{${u}}$ in $b = ${b}\\ \\mathrm{${u}}$. Izračunaj hipotenuzo $c$.`,
          answer: withMistakes({ type: "number", value: c, unit: u }, hypMistakes(a, b)),
          hint: "Pitagorov izrek: $c^2 = a^2 + b^2$.",
          data: { given: [dat("a", `${a}`, u), dat("b", `${b}`, u)], find: ["c"] },
          formula: ["c^2 = a^2 + b^2", "c = \\sqrt{a^2 + b^2}"],
          solution: eqs("c", "\\sqrt{a^2 + b^2}", ...sumSq(a, b), qty(c, u)),
        };
      }
      if (level === 2) {
        const a = r.int(2, 15);
        const b = r.int(2, 15);
        const c = Math.sqrt(a * a + b * b);
        if (Number.isInteger(c)) return this.gen(2, r);
        return {
          text: `Pravokotni trikotnik ima kateti $a = ${a}\\ \\mathrm{${u}}$ in $b = ${b}\\ \\mathrm{${u}}$. Izračunaj hipotenuzo in jo zaokroži na dve decimalki.`,
          answer: withMistakes({ type: "number", value: c, unit: u, decimals: 2 }, hypMistakes(a, b)),
          hint: "Pitagorov izrek: $c^2 = a^2 + b^2$. Zaokroži šele na koncu.",
          data: { given: [dat("a", `${a}`, u), dat("b", `${b}`, u)], find: ["c"] },
          formula: ["c^2 = a^2 + b^2", "c = \\sqrt{a^2 + b^2}"],
          solution: eqs("c", "\\sqrt{a^2 + b^2}", ...sumSq(a, b), res(c, 2, u)),
        };
      }
      const kind = r.pick(["kateta", "diagonala"]);
      if (kind === "kateta") {
        const c = r.int(8, 25);
        const a = r.int(3, c - 2);
        const b = Math.sqrt(c * c - a * a);
        return {
          text: `Lestev dolžine $${c}\\ \\mathrm{dm}$ je naslonjena na steno. Spodnji konec je $${a}\\ \\mathrm{dm}$ od stene. Kako visoko na steni sega lestev? Zaokroži na dve decimalki.`,
          answer: withMistakes({ type: "number", value: b, unit: "dm", decimals: 2 }, [
            [Math.sqrt(c * c + a * a), "Lestev je hipotenuza: od njenega kvadrata kvadrat katete odštej, ne prištej."],
            [c - a, "Dolžin ne odštevaš neposredno: odštej kvadrata in koreni."],
            [c * c - a * a, "Pozabil si koreniti razliko kvadratov."],
          ]),
          hint: "Lestev je hipotenuza. Kateto izračunaš s $b^2 = c^2 - a^2$.",
          data: { given: [dat("c", `${c}`, "dm"), dat("a", `${a}`, "dm")], find: ["b"] },
          formula: ["c^2 = a^2 + b^2", "b = \\sqrt{c^2 - a^2}"],
          solution: `Lestev je hipotenuza $c$, razdalja od stene in višina sta kateti.\n${eqs("b", "\\sqrt{c^2 - a^2}", `\\sqrt{(${qty(c, "dm")})^2 - (${qty(a, "dm")})^2}`, `\\sqrt{${qty(c * c, "dm²")} - ${qty(a * a, "dm²")}}`, `\\sqrt{${qty(c * c - a * a, "dm²")}}`, res(b, 2, "dm"))}`,
        };
      }
      const a = r.int(3, 20);
      const b = r.int(3, 20);
      const d = Math.sqrt(a * a + b * b);
      return {
        text: `Pravokotnik ima stranici $${a}\\ \\mathrm{${u}}$ in $${b}\\ \\mathrm{${u}}$. Izračunaj dolžino diagonale in jo zaokroži na dve decimalki.`,
        answer: withMistakes({ type: "number", value: d, unit: u, decimals: 2 }, hypMistakes(a, b)),
        hint: "Diagonala razdeli pravokotnik na dva pravokotna trikotnika.",
        data: { given: [dat("a", `${a}`, u), dat("b", `${b}`, u)], find: ["d"] },
        formula: ["d^2 = a^2 + b^2", "d = \\sqrt{a^2 + b^2}"],
        solution: `Diagonala je hipotenuza pravokotnega trikotnika s katetama $a$ in $b$.\n${eqs("d", "\\sqrt{a^2 + b^2}", ...sumSq(a, b), res(d, 2, u))}`,
      };
    },
  },
  {
    id: "linearne-enacbe",
    topics: [
      "MAT-OS-8/linearne-enacbe",
      "MAT-OS-9/linearne-enacbe-z-ulomki",
      "MAT-OS-6/preproste-enacbe",
      "MAT-SS-1/linearne-enacbe",
    ],
    gen(level, r) {
      const x = r.int(-9, 12);
      const a = r.nonZero(level === 1 ? 2 : -9, 9);
      const b = r.int(-20, 20);
      const sign = (v) => (v < 0 ? `- ${-v}` : v === 0 ? "" : `+ ${v}`);
      const cx = (v) => (v === 1 ? "x" : v === -1 ? "-x" : `${v}x`);
      // Člen z x s predznakom: sgx(-3) → "- 3x", sgx(1) → "+ x".
      const sgx = (v) => (v < 0 ? `- ${cx(-v)}` : `+ ${cx(v)}`);
      // Podatek je enačba sama; rešitev so vrstice postopka. Pri b = 0 ostanejo odvečni presledki
      // in enaki zaporedni koraki, zato jih počistimo.
      const tidy = (s) => s.replace(/\s+/g, " ").replace(/ \$/g, "$");
      const steps = (eq, lines) => ({
        data: { given: [tidy(eq)], find: ["x"] },
        solution: [`$${eq}$`, ...lines.filter(Boolean)]
          .map(tidy)
          .filter((l, i, arr) => l !== arr[i - 1])
          .join("\n"),
      });
      if (level === 1) {
        const ax = Math.abs(a);
        const c = ax * x + b;
        const eq = `${ax}x ${sign(b)} = ${c}`;
        return {
          text: `Reši enačbo: $${eq}$`,
          answer: withMistakes({ type: "number", value: x }, [
            [(c + b) / ax, "Ko člen preneseš na drugo stran, mu spremeniš predznak."],
            [c - b - ax, "S koeficientom pred x deliš, ne odštevaš ga."],
            [(c - b) * ax, "S koeficientom pred x deliš, ne množiš."],
          ]),
          hint: "Najprej osami člen z $x$ (prenesi število na drugo stran), nato deli s koeficientom.",
          formula: false,
          ...steps(eq, [b !== 0 && `$${ax}x = ${c} ${sign(-b)}$`, `$${ax}x = ${c - b}$`, `$x = ${c - b} : ${ax} = ${x}$`]),
        };
      }
      if (level === 2) {
        const c = r.nonZero(-9, 9);
        const d = a * x + b - c * x;
        if (a === c) return this.gen(2, r);
        const eq = `${cx(a)} ${sign(b)} = ${cx(c)} ${sign(d)}`;
        return {
          text: `Reši enačbo: $${eq}$`,
          answer: withMistakes({ type: "number", value: x }, [
            [(d - b) / (a + c), "Ko člen z x preneseš na levo, mu spremeniš predznak."],
            [(d + b) / (a - c), "Ko število preneseš na desno, mu spremeniš predznak."],
          ]),
          hint: "Člene z $x$ zberi na levi, števila na desni strani enačbe.",
          formula: false,
          ...steps(eq, [`$${cx(a)} ${sgx(-c)} = ${d} ${sign(-b)}$`, `$${cx(a - c)} = ${d - b}$`, a - c !== 1 && `$x = \\dfrac{${d - b}}{${a - c}} = ${x}$`]),
        };
      }
      // z oklepaji ali ulomkom
      const k = r.int(2, 5);
      const m = r.int(2, 6);
      const rhs = (x + m) / k;
      if (Number.isInteger(rhs)) {
        const eq = `\\dfrac{x ${sign(m)}}{${k}} = ${rhs}`;
        return {
          text: `Reši enačbo: $${eq}$`,
          answer: withMistakes({ type: "number", value: x }, [
            [rhs / k - m, "Z imenovalcem enačbo pomnožiš, ne deliš."],
            [rhs - m, "Najprej odpravi ulomek: obe strani pomnoži z imenovalcem."],
            [rhs * k + m, "Ko število preneseš na drugo stran, mu spremeniš predznak."],
          ]),
          hint: "Enačbo pomnoži z imenovalcem, da se znebiš ulomka.",
          formula: "\\dfrac{a}{b} = c \\;\\Rightarrow\\; a = c \\cdot b",
          ...steps(eq, [`$x ${sign(m)} = ${par(rhs)} \\cdot ${k}$`, `$x ${sign(m)} = ${rhs * k}$`, `$x = ${rhs * k} - ${m} = ${x}$`]),
        };
      }
      const c = k * (x - m) + b;
      const eq = `${k}(x - ${m}) ${sign(b)} = ${c}`;
      return {
        text: `Reši enačbo: $${eq}$`,
        answer: withMistakes({ type: "number", value: x }, [
          [(c - b + m) / k, "Pri odpravi oklepaja z številom pomnoži vsak člen v oklepaju."],
          [(c - b) / k - m, "Ko število preneseš na drugo stran, mu spremeniš predznak."],
        ]),
        hint: "Najprej odpravi oklepaj (vsak člen v oklepaju pomnoži s številom pred njim).",
        formula: "a(b - c) = ab - ac",
        ...steps(eq, [
          `$${k}x - ${k * m} ${sign(b)} = ${c}$`,
          `$${k}x = ${c} + ${k * m} ${sign(-b)}$`,
          `$${k}x = ${c + k * m - b}$`,
          `$x = ${c + k * m - b} : ${k} = ${x}$`,
        ]),
      };
    },
  },
  {
    id: "izrazi",
    topics: ["MAT-OS-8/algebrski-izrazi", "MAT-OS-8/mnozenje-izrazov", "MAT-OS-8/razstavljanje"],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(2, 9);
        const b = r.int(-9, 9);
        const x = r.int(-5, 6);
        const expr = `${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        return {
          text: `Izračunaj vrednost izraza $${expr}$ za $x = ${x}$.`,
          answer: withMistakes({ type: "number", value: a * x + b }, [
            [a + x + b, `Zapis ${a}x pomeni ${a} · x, ne ${a} + x.`],
            [x < 0 ? a * -x + b : NaN, "Pazi na predznak: vstavi negativno število v oklepaju."],
            [x > 0 ? Number(`${a}${x}`) + b : NaN, `Zapis ${a}x pomeni množenje, števk ne pišeš skupaj.`],
          ]),
          hint: "Namesto $x$ vstavi število (v oklepaju, če je negativno).",
          data: { given: [`x = ${x}`], find: [expr] },
          formula: false,
          solution: `Vstavimo $x = ${x}$:\n$${expr} = ${a} \\cdot ${par(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}$\n$= ${a * x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a * x + b}$`,
        };
      }
      const p = r.int(1, 7);
      let q = r.nonZero(-7, 7);
      if (q === -p) q = -q; // da člen z x ne izgine
      const qs = q < 0 ? `- ${-q}` : `+ ${q}`;
      // Zapis polinoma a x^2 + b x + c brez "1x", "+ -3" in ničelnih členov.
      const poly = (a2, b, c) => {
        const parts = [];
        if (a2) parts.push(a2 === 1 ? "x^2" : `${a2}x^2`);
        if (b) parts.push(`${b < 0 ? "- " : parts.length ? "+ " : ""}${Math.abs(b) === 1 ? "" : Math.abs(b)}x`);
        if (c) parts.push(`${c < 0 ? "- " : parts.length ? "+ " : ""}${Math.abs(c)}`);
        return parts.join(" ") || "0";
      };
      if (level === 2) {
        const right = poly(1, p + q, p * q);
        const c = choicesWhy(r, right, [
          [poly(1, 0, p * q), "Manjka srednji člen: zmnožiti moraš vsak člen z vsakim, tudi x s števili."],
          [poly(1, p - q, p * q), "Preveri predznak srednjega člena: seštej oba člena z x."],
          [poly(0, 2, p + q), "Člene si seštel namesto zmnožil."],
        ]);
        // Vsak člen z vsakim: x·x + x·q + p·x + p·q.
        const xq = `${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}x`;
        const px = `+ ${p === 1 ? "" : p}x`;
        const pq = `${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)}`;
        return {
          text: `Zmnoži: $(x + ${p})(x ${qs})$`,
          answer: { type: "choice", ...c },
          options_tex: true,
          hint: "Vsak člen prvega oklepaja pomnoži z vsakim členom drugega, nato seštej podobne člene.",
          data: false,
          formula: "(a + b)(c + d) = ac + ad + bc + bd",
          solution: `$(x + ${p})(x ${qs}) = x^2 ${xq} ${px} ${pq} = ${right}$`,
        };
      }
      const k = r.int(2, 9);
      const m = r.int(2, 9);
      const n = r.nonZero(-9, 9);
      const sg = k * n < 0 ? "-" : "+";
      return {
        text: `Izpostavi skupni faktor: $${k * m}x ${sg} ${Math.abs(k * n)} = ${k}(\\,${m}x + \\square\\,)$. Katero število je v kvadratku?`,
        answer: withMistakes({ type: "number", value: n }, [
          [k * n, `Člen ${Math.abs(k * n)} moraš deliti s skupnim faktorjem ${k}.`],
          [-n, "Predznak člena ostane v oklepaju enak."],
        ]),
        hint: `Vsak člen deli s ${k}.`,
        data: false,
        formula: "ab + ac = a(b + c)",
        solution: `Oba člena delimo s skupnim faktorjem $${k}$: $${k * m}x : ${k} = ${m}x$, $${k * n} : ${k} = ${n}$\n$${k * m}x ${sg} ${Math.abs(k * n)} = ${k} \\cdot ${m}x ${sg} ${k} \\cdot ${Math.abs(n)} = ${k}(${m}x ${sg} ${Math.abs(n)})$\nV kvadratku je $${n}$.`,
      };
    },
  },
  {
    id: "krog",
    topics: ["MAT-OS-8/obseg-in-ploscina-kroga", "MAT-OS-8/krozni-lok-in-krozni-izsek"],
    gen(level, r) {
      const u = r.pick(["cm", "m"]);
      const u2 = `${u}²`;
      const rad = level === 1 ? r.int(2, 15) : r.dec(1.5, 20, 1);
      const piNote = "Uporabi $\\pi \\approx 3{,}14$ ali tipko $\\pi$ na računalu.";
      const rDat = dat("r", tx(rad), u);
      if (level === 3) {
        const alpha = r.pick([30, 45, 60, 72, 90, 120, 135, 150]);
        const l = (Math.PI * rad * alpha) / 180;
        return {
          text: `Krožni lok s središčnim kotom $${alpha}^\\circ$ leži na krožnici s polmerom $${tx(rad)}\\ \\mathrm{${u}}$. Izračunaj dolžino loka. Zaokroži na dve decimalki. ${piNote}`,
          answer: withMistakes({ type: "number", value: l, alsoAccept: [(3.14 * rad * alpha) / 180], unit: u, decimals: 2 }, [
            [(Math.PI * rad * rad * alpha) / 360, "To je ploščina krožnega izseka, ne dolžina loka."],
            [(Math.PI * rad * alpha) / 360, "Obseg kroga je 2πr: pri deljenju s 360° ne pozabi faktorja 2."],
            [2 * Math.PI * rad, "To je obseg cele krožnice; lok je le del, ki pripada kotu α."],
          ]),
          hint: "Lok je tak del obsega, kot je kot $\\alpha$ del $360^\\circ$: $l = \\dfrac{\\pi r \\alpha}{180^\\circ}$.",
          data: { given: [`\\alpha = ${alpha}^\\circ`, rDat], find: ["l"] },
          formula: "l = \\dfrac{\\pi r \\alpha}{180^\\circ}",
          solution: `Lok je $\\dfrac{${alpha}^\\circ}{360^\\circ}$ obsega $2\\pi r$, zato $l = \\dfrac{\\pi r \\alpha}{180^\\circ}$.\n${eqs("l", `\\dfrac{\\pi \\cdot ${qty(tx(rad), u)} \\cdot ${alpha}^\\circ}{180^\\circ}`, `\\approx ${qty(tx(l, 2), u)}`)}`,
        };
      }
      const area = r.next() < 0.5;
      const v = area ? Math.PI * rad * rad : 2 * Math.PI * rad;
      const v314 = area ? 3.14 * rad * rad : 2 * 3.14 * rad;
      return {
        text: `Krog ima polmer $r = ${tx(rad)}\\ \\mathrm{${u}}$. Izračunaj ${area ? "njegovo ploščino" : "njegov obseg"}. Zaokroži na dve decimalki. ${piNote}`,
        answer: withMistakes(
          { type: "number", value: v, alsoAccept: [v314], unit: area ? u2 : u, decimals: 2 },
          area
            ? [
                [2 * Math.PI * rad, "To je obseg kroga; ploščina je π r²."],
                [Math.PI * rad, "Polmer moraš kvadrirati."],
              ]
            : [
                [Math.PI * rad * rad, "To je ploščina kroga; obseg je 2πr."],
                [Math.PI * rad, "Obseg je 2πr: manjka faktor 2 (ali pa si premer zamenjal s polmerom)."],
              ],
        ),
        hint: area ? "Ploščina kroga: $p = \\pi r^2$." : "Obseg kroga: $o = 2\\pi r$.",
        data: { given: [rDat], find: [area ? "p" : "o"] },
        formula: area ? "p = \\pi r^2" : "o = 2 \\pi r",
        solution: area
          ? eqs("p", "\\pi r^2", `\\pi \\cdot (${qty(tx(rad), u)})^2`, `\\pi \\cdot ${qty(tx(rad * rad), u2)}`, `\\approx ${qty(tx(v, 2), u2)}`)
          : eqs("o", "2 \\pi r", `2 \\cdot \\pi \\cdot ${qty(tx(rad), u)}`, `${tx(2 * rad)} \\cdot \\pi\\ \\mathrm{${u}}`, `\\approx ${qty(tx(v, 2), u)}`),
      };
    },
  },

  // ---------------------------------------------------------------- 9. razred
  {
    id: "linearna-funkcija",
    topics: [
      "MAT-OS-9/linearna-funkcija",
      "MAT-OS-9/graf-linearne-funkcije",
      "MAT-OS-9/premica-v-ravnini",
      "MAT-SS-1/linearna-funkcija",
    ],
    gen(level, r) {
      const k = r.nonZero(-4, 4);
      const n = r.int(-5, 5);
      const f = (x) => k * x + n;
      // Zapis kx + n brez "1x" in "+ 0".
      const lin = (kk, nn) => `${kk === 1 ? "" : kk === -1 ? "-" : kk}x${nn ? ` ${nn < 0 ? "-" : "+"} ${Math.abs(nn)}` : ""}`;
      const fx = lin(k, n);
      const name = r.pick(NAMES);
      const kind = level === 1 ? "vrednost" : level === 2 ? r.pick(["graf", "nicla", "taksi"]) : r.pick(["tocki", "vzporedna", "taksi-obratno"]);
      if (kind === "taksi" || kind === "taksi-obratno") {
        const start = r.pick([1.5, 2, 2.5, 3, 3.5, 4]);
        const perKm = r.pick([0.8, 0.9, 1.1, 1.2, 1.4, 1.5]);
        const km = r.int(3, 25);
        const cost = Math.round((start + perKm * km) * 100) / 100;
        const S = tx(start, 2);
        const K = tx(perKm, 2);
        const C = tx(cost, 2);
        const given = [dat("n", S, EUR), dat("k", K, "\\text{€/km}")];
        if (kind === "taksi")
          return {
            text: `Taksi zaračuna startnino $${S}$ € in $${K}$ € za vsak prevožen kilometer. Koliko plača ${name} za vožnjo, dolgo $${km}\\ \\mathrm{km}$?`,
            answer: withMistakes({ type: "number", value: cost, unit: "€", decimals: 2, unitAlternatives: ["eur", "evrov"] }, [
              [perKm * km, "Prišteti moraš še startnino."],
              [(start + perKm) * km, "Startnino plačaš enkrat, ne za vsak kilometer."],
              [start * km + perKm, "Zamenjal si startnino in ceno za kilometer."],
            ]),
            hint: "Cena je linearna funkcija prevoženih kilometrov: $y = k \\cdot x + n$.",
            data: { given: [...given, dat("x", `${km}`, "km")], find: ["y"] },
            formula: "y = k \\cdot x + n",
            solution: eqs("y", "k \\cdot x + n", `${K} \\cdot ${km} + ${S}`, `${tx(perKm * km, 2)} + ${S}`, qty(C, EUR)),
          };
        return {
          text: `Taksi zaračuna startnino $${S}$ € in $${K}$ € za vsak prevožen kilometer. ${name} je za vožnjo ${g(name, "plačal", "plačala")} $${C}$ €. Koliko kilometrov je ${g(name, "prevozil", "prevozila")}?`,
          answer: withMistakes({ type: "number", value: km, unit: "km", tolerance: 1e-6, unitAlternatives: ["kilometrov"] }, [
            [cost / perKm, "Najprej od plačila odštej startnino, šele nato deli s ceno za kilometer."],
            [(cost + start) / perKm, "Startnino od plačila odšteješ, ne prišteješ."],
            [(cost - start) * perKm, "Število kilometrov dobiš z deljenjem s ceno za kilometer."],
          ]),
          hint: "V $y = k \\cdot x + n$ poznaš $y$, $k$ in $n$. Izrazi $x$.",
          data: { given: [...given, dat("y", C, EUR)], find: ["x"] },
          formula: ["y = k \\cdot x + n", "x = \\dfrac{y - n}{k}"],
          solution: `$${C} = ${K} \\cdot x + ${S}$\n$${K} \\cdot x = ${C} - ${S} = ${tx(cost - start, 2)}$\n$x = ${tx(cost - start, 2)} : ${K} = ${qty(km, "km")}$`,
        };
      }
      if (kind === "nicla") {
        const x0 = r.nonZero(-5, 5);
        const n0 = -k * x0;
        const f0 = lin(k, n0);
        return {
          text: `Izračunaj ničlo linearne funkcije $f(x) = ${f0}$.`,
          answer: withMistakes({ type: "number", value: x0 }, [
            [-x0, "Iz kx + n = 0 sledi kx = −n: pazi na predznak."],
            [n0, "To je začetna vrednost (presečišče z osjo y), ne ničla."],
            [-n0 * k, "Iz kx = −n dobiš x z deljenjem s k, ne z množenjem."],
          ]),
          hint: "Ničla je tisti $x$, pri katerem je $f(x) = 0$. Reši enačbo $kx + n = 0$.",
          data: { given: [`f(x) = ${f0}`], find: ["x_0"] },
          formula: ["f(x_0) = 0", "x_0 = -\\dfrac{n}{k}"],
          solution: `$${f0} = 0$\n$${k === 1 ? "" : k === -1 ? "-" : k}x = ${-n0}$\n$x_0 = ${-n0} : ${par(k)} = ${x0}$`,
        };
      }
      if (kind === "vzporedna") {
        const c0 = r.int(-5, 5);
        const x1 = r.nonZero(-4, 4);
        let y1 = r.int(-6, 8);
        if (y1 - k * x1 === c0) y1 += 1;
        const nn = y1 - k * x1;
        return {
          text: `Premica $p$ je vzporedna premici $y = ${lin(k, c0)}$ in gre skozi točko $T(${x1}, ${y1})$. Koliko je začetna vrednost $n$ premice $p$?`,
          answer: withMistakes({ type: "number", value: nn }, [
            [c0, "Vzporedni premici imata enak smerni koeficient, začetna vrednost pa je drugačna."],
            [y1 + k * x1, "Iz y = kx + n sledi n = y − kx: pazi na predznak."],
            [y1, "Začetna vrednost je vrednost pri x = 0, ne pri x točke T."],
          ]),
          hint: "Vzporedni premici imata enak smerni koeficient $k$. V $y = kx + n$ vstavi koordinati točke $T$.",
          data: { given: [`y = ${lin(k, c0)}`, `x_1 = ${x1}`, `y_1 = ${y1}`], find: ["n"] },
          formula: ["k_p = k", "n = y_1 - k \\cdot x_1"],
          solution: `Vzporedni premici: $k = ${k}$\n$${y1} = ${k} \\cdot ${par(x1)} + n$\n$n = ${y1} - ${par(k * x1)} = ${nn}$`,
        };
      }
      if (kind === "vrednost") {
        const x = r.int(-4, 5);
        const kx = k === 1 ? par(x) : k === -1 ? `-${par(x)}` : `${k} \\cdot ${par(x)}`;
        const pn = `${n < 0 ? "-" : "+"} ${Math.abs(n)}`;
        // Vstavljeno število → zmnožek → vrednost; enake zaporedne korake (npr. pri k = 1) izpustimo.
        const chain = [`f(${x})`, `${kx} ${pn}`, `${k * x} ${pn}`, `${f(x)}`].filter((s, i, arr) => s !== arr[i - 1]);
        return {
          text: `Dana je funkcija $f(x) = ${fx}$. Izračunaj $f(${x})$.`,
          answer: withMistakes({ type: "number", value: f(x) }, [
            [k + x + n, "Zapis kx pomeni k · x, ne k + x."],
            [k * (x + n), "Najprej pomnoži k z x, nato prištej n."],
            [k * x - n, "Pazi na predznak začetne vrednosti n."],
          ]),
          hint: "Namesto $x$ vstavi dano število.",
          data: { given: [`f(x) = ${fx}`, `x = ${x}`], find: [`f(${x})`] },
          formula: "f(x) = kx + n",
          solution: chain.map((c, i) => (i ? `$= ${c}$` : `$${c}$`)).join("\n"),
        };
      }
      if (kind === "graf") {
        // branje grafa
        const x0 = r.int(-3, 3);
        if (r.next() < 0.4)
          return {
            text: `Na sliki je graf linearne funkcije $f(x) = kx + n$. Koliko je začetna vrednost $n$?`,
            figure: { type: "line", k, n },
            answer: withMistakes({ type: "number", value: n }, [
              [k, "To je smerni koeficient (naklon), ne začetna vrednost."],
              [n ? -n / k : NaN, "Začetna vrednost je presečišče z osjo y, ne z osjo x."],
            ]),
            hint: "Začetna vrednost je $y$-koordinata presečišča grafa z osjo $y$ (pri $x = 0$).",
            data: { given: ["f(x) = kx + n\\ (\\text{graf na sliki})"], find: ["n"] },
            formula: "n = f(0)",
            solution: `Graf seka os $y$ v točki $(0, ${n})$.\n$n = f(0) = ${n}$`,
          };
        return {
          text: `Na sliki je graf linearne funkcije. Koliko je smerni koeficient $k$?`,
          figure: { type: "line", k, n },
          answer: withMistakes({ type: "number", value: k }, [
            [-k, "Preveri predznak: ali premica narašča ali pada?"],
            [n, "To je začetna vrednost (presečišče z osjo y), ne naklon."],
          ]),
          hint: "Poišči dve točki na premici z celimi koordinatami. Za koliko se spremeni $y$, ko se $x$ poveča za 1?",
          data: { given: ["f(x) = kx + n\\ (\\text{graf na sliki})"], find: ["k"] },
          formula: "k = \\dfrac{\\Delta y}{\\Delta x}",
          solution: `Premica gre skozi $(${x0}, ${f(x0)})$ in $(${x0 + 1}, ${f(x0 + 1)})$: ko se $x$ poveča za $1$, se $y$ spremeni za $${k}$.\n$k = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{${f(x0 + 1)} - ${par(f(x0))}}{${x0 + 1} - ${par(x0)}} = \\dfrac{${k}}{1} = ${k}$`,
        };
      }
      const x1 = r.int(-4, 2);
      const x2 = x1 + r.int(1, 4);
      const kk = r.nonZero(-3, 3);
      const nn = r.int(-5, 5);
      const y1 = kk * x1 + nn;
      const y2 = kk * x2 + nn;
      return {
        text: `Premica gre skozi točki $A(${x1}, ${y1})$ in $B(${x2}, ${y2})$. Izračunaj začetno vrednost $n$.`,
        answer: withMistakes({ type: "number", value: nn }, [
          [y1 + kk * x1, "Iz y = kx + n sledi n = y − kx: pazi na predznak."],
          [kk, "To je smerni koeficient; iskali smo začetno vrednost n."],
          [y1, "Začetna vrednost je vrednost pri x = 0, ne pri x₁."],
        ]),
        hint: "Najprej izračunaj $k = \\dfrac{y_2 - y_1}{x_2 - x_1}$, nato v $y = kx + n$ vstavi eno točko.",
        data: { given: [`x_1 = ${x1}`, `y_1 = ${y1}`, `x_2 = ${x2}`, `y_2 = ${y2}`], find: ["n"] },
        formula: ["k = \\dfrac{y_2 - y_1}{x_2 - x_1}", "y = kx + n \\;\\Rightarrow\\; n = y_1 - k \\cdot x_1"],
        solution: `$k = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${kk}$\n$n = y_1 - k \\cdot x_1 = ${y1} - ${par(kk)} \\cdot ${par(x1)} = ${y1} ${kk * x1 < 0 ? `+ ${-kk * x1}` : `- ${kk * x1}`} = ${nn}$`,
      };
    },
  },
  {
    id: "neenacbe",
    topics: ["MAT-OS-9/linearne-neenacbe", "MAT-SS-1/linearne-neenacbe", "MAT-OS-6/preproste-neenacbe"],
    gen(level, r) {
      if (level === 2 && r.int(0, 1) === 1) {
        // Branje rešitve s številske premice
        const x0 = r.int(-4, 6);
        const op = r.pick(["<", ">", "\\le", "\\ge"]);
        const strict = { "<": "\\le", ">": "\\ge", "\\le": "<", "\\ge": ">" }[op];
        const flip = { "<": ">", ">": "<", "\\le": "\\ge", "\\ge": "\\le" }[op];
        const right = `x ${op} ${x0}`;
        const c = choicesWhy(r, right, [
          [`x ${strict} ${x0}`, "Poln krožec pomeni, da število spada zraven (≤, ≥), prazen pa, da ne (<, >)."],
          [`x ${flip} ${x0}`, "Pobarvani del kaže smer: levo so manjša števila, desno večja."],
          [`x ${op} ${x0 + 1}`, "Preberi, pri katerem številu je krožec."],
        ]);
        const closed = op.includes("le") || op.includes("ge");
        return {
          text: "Na številski premici je prikazana rešitev neenačbe. Katera je?",
          figure: { type: "numberline", x0, dir: op === "<" || op === "\\le" ? -1 : 1, closed },
          answer: { type: "choice", ...c },
          options_tex: true,
          hint: "Poln krožec pomeni, da število spada zraven ($\\le$ ali $\\ge$), prazen pa, da ne ($<$ ali $>$). Pobarvani del kaže, katera števila so rešitev.",
          data: false,
          formula: false,
          solution: `Krožec pri $${x0}$ je ${closed ? "poln" : "prazen"}, pobarvano je ${op === "<" || op === "\\le" ? "levo" : "desno"}: $${right}$.`,
        };
      }
      const a = level === 3 ? r.nonZero(-6, -2) : r.int(2, 6);
      const x0 = r.int(-6, 8);
      const b = r.int(-10, 10);
      const c = a * x0 + b;
      const ineq = r.pick(["<", ">", "\\le", "\\ge"]);
      const flip = a < 0;
      const resultOp = flip ? { "<": ">", ">": "<", "\\le": "\\ge", "\\ge": "\\le" }[ineq] : ineq;
      const right = `x ${resultOp} ${x0}`;
      const wrong = `x ${{ "<": ">", ">": "<", "\\le": "\\ge", "\\ge": "\\le" }[resultOp]} ${x0}`;
      const c2 = choicesWhy(r, right, [
        [wrong, flip ? "Ko deliš z negativnim številom, se znak neenakosti obrne." : "Znak neenakosti se obrne le pri množenju ali deljenju z negativnim številom."],
        [`x ${resultOp} ${-x0 || 1}`, "Pazi na predznake pri prenašanju člena in pri deljenju."],
        [`x ${resultOp} ${c}`, "Prenesti moraš še prosti člen in deliti s koeficientom pred x."],
      ]);
      const bs = `${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
      const strictOp = resultOp === "<" || resultOp === ">";
      // Številska različica: najmanjše oz. največje celo število, ki reši neenačbo.
      if ((level === 2 && r.next() < 0.35) || (level === 3 && r.next() < 0.5)) {
        const below = resultOp === "<" || resultOp === "\\le";
        const best = below ? (strictOp ? x0 - 1 : x0) : strictOp ? x0 + 1 : x0;
        const word = below ? "največje" : "najmanjše";
        return {
          text: `Katero je ${word} celo število, ki reši neenačbo $${a}x ${bs} ${ineq} ${c}$?`,
          answer: withMistakes({ type: "number", value: best }, [
            [strictOp ? x0 : below ? x0 - 1 : x0 + 1, strictOp ? "Pri strogi neenakosti (<, >) mejno število ni rešitev." : "Pri ≤ in ≥ je mejno število tudi rešitev."],
            [-best, "Pazi na predznake pri prenašanju člena in pri deljenju."],
          ]),
          hint: `Najprej reši neenačbo kot enačbo${flip ? " (pazi: deliš z negativnim številom)" : ""}, nato poišči ${word} celo število v rešitvi.`,
          data: false,
          formula: flip ? "a \\cdot x < b \\;\\Rightarrow\\; x > \\dfrac{b}{a} \\quad (a < 0)" : "a \\cdot x < b \\;\\Rightarrow\\; x < \\dfrac{b}{a} \\quad (a > 0)",
          solution: [
            `$${a}x ${bs} ${ineq} ${c}$`,
            b !== 0 && `$${a}x ${ineq} ${c - b}$`,
            `$${right}$${flip ? " (delili smo z negativnim številom, zato se znak obrne)" : ""}`,
            `${word === "največje" ? "Največje" : "Najmanjše"} celo število v rešitvi: $${best}$`,
          ]
            .filter(Boolean)
            .join("\n"),
        };
      }
      return {
        text: `Reši neenačbo: $${a}x ${bs} ${ineq} ${c}$`,
        answer: { type: "choice", ...c2 },
        options_tex: true,
        hint: flip
          ? "Rešuješ kot enačbo. Ko deliš z negativnim številom, se znak neenakosti obrne!"
          : "Rešuješ kot enačbo: osami člen z $x$ in deli s koeficientom.",
        data: false,
        formula: flip ? "a \\cdot x < b \\;\\Rightarrow\\; x > \\dfrac{b}{a} \\quad (a < 0)" : "a \\cdot x < b \\;\\Rightarrow\\; x < \\dfrac{b}{a} \\quad (a > 0)",
        solution: [
          `$${a}x ${bs} ${ineq} ${c}$`,
          b !== 0 && `$${a}x ${ineq} ${c} ${b < 0 ? "+" : "-"} ${Math.abs(b)}$`,
          `$${a}x ${ineq} ${c - b}$`,
          `$x ${resultOp} \\dfrac{${c - b}}{${a}}$${flip ? " (delimo z negativnim številom, zato se znak obrne)" : ""}`,
          `$${right}$`,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    },
  },
  {
    id: "telesa",
    topics: ["MAT-OS-9/prizma", "MAT-OS-9/valj", "MAT-OS-9/piramida", "MAT-OS-9/stozec", "MAT-OS-9/krogla", "MAT-SS-3/povrsina-in-prostornina-teles"],
    gen(level, r, topicId = "") {
      const u = r.pick(["cm", "dm", "m"]);
      const u3 = `${u}³`;
      const which = topicId.includes("valj")
        ? "valj"
        : topicId.includes("piramida")
          ? "piramida"
          : topicId.includes("stozec")
            ? "stozec"
            : topicId.includes("krogla")
              ? "krogla"
              : topicId.includes("prizma")
                ? "kvader"
                : r.pick(["kvader", "valj", "piramida", "stozec", "krogla"]);
      const a = level === 1 ? r.int(2, 12) : r.dec(1.5, 12, 1);
      const b = level === 1 ? r.int(2, 12) : r.dec(1.5, 12, 1);
      const h = level === 1 ? r.int(2, 15) : r.dec(2, 15, 1);
      const piNote = "Zaokroži na dve decimalki. Uporabi tipko $\\pi$ ali $\\pi \\approx 3{,}14$.";
      const A = qty(tx(a), u);
      const H = qty(tx(h), u);
      const PI = Math.PI;
      const V = ({ text, value, v314 = null, hint, given, formula, solution, mistakes = [], unit = u3, find = "V" }) => ({
        text,
        answer: withMistakes({ type: "number", value, alsoAccept: v314 ? [v314] : [], unit, decimals: 2 }, mistakes),
        hint,
        data: { given, find: [find] },
        formula,
        solution,
      });
      // Raven 2: ista formula v vsakdanjem okviru (kratka besedilna naloga); raven 1: golo telo.
      const ctx = (plain, story) => (level === 2 ? story : plain);
      if (level === 3) {
        // Obratna naloga, premer namesto polmera ali pretvorba v litre.
        if (which === "kvader") {
          if (r.next() < 0.5) {
            const [x, y, z] = [r.int(20, 80), r.int(15, 50), r.int(15, 50)]; // cm
            const Vcm = x * y * z;
            return V({
              text: `Akvarij v obliki kvadra ima notranje mere $${x}\\ \\mathrm{cm}$, $${y}\\ \\mathrm{cm}$ in $${z}\\ \\mathrm{cm}$. Koliko litrov vode drži, ko je poln? Zaokroži na dve decimalki.`,
              value: Vcm / 1000,
              unit: "l",
              find: "V\\ [\\mathrm{l}]",
              hint: "Izračunaj prostornino v $\\mathrm{cm^3}$ in jo pretvori v litre: $1\\ \\mathrm{l} = 1\\ \\mathrm{dm^3} = 1000\\ \\mathrm{cm^3}$.",
              given: [dat("a", `${x}`, "cm"), dat("b", `${y}`, "cm"), dat("c", `${z}`, "cm")],
              formula: ["V = a \\cdot b \\cdot c", "1\\ \\mathrm{l} = 1000\\ \\mathrm{cm^3}"],
              mistakes: [
                [Vcm, "Prostornino moraš pretvoriti iz cm³ v litre (1 l = 1000 cm³)."],
                [Vcm / 100, "1 l = 1 dm³ = 1000 cm³, ne 100 cm³."],
                [x + y + z, "Mere zmnoži, ne seštej."],
              ],
              solution: `${eqs("V", "a \\cdot b \\cdot c", `${qty(x, "cm")} \\cdot ${qty(y, "cm")} \\cdot ${qty(z, "cm")}`, qty(Vcm, "cm³"))}\n$V = ${Vcm} : 1000\\ \\mathrm{l} = ${qty(tx(Vcm / 1000), "l")}$`,
            });
          }
          const [x, y, z] = [r.int(2, 12), r.int(2, 12), r.int(2, 15)];
          const Vk = x * y * z;
          return V({
            text: `Kvader ima prostornino $${Vk}\\ \\mathrm{${u}^3}$. Robova osnovne ploskve merita $${x}\\ \\mathrm{${u}}$ in $${y}\\ \\mathrm{${u}}$. Koliko meri višina kvadra? Zaokroži na dve decimalki.`,
            value: z,
            unit: u,
            find: "c",
            hint: "Iz $V = a \\cdot b \\cdot c$ izrazi $c$: prostornino deli s ploščino osnovne ploskve.",
            given: [dat("V", `${Vk}`, u3), dat("a", `${x}`, u), dat("b", `${y}`, u)],
            formula: ["V = a \\cdot b \\cdot c", "c = \\dfrac{V}{a \\cdot b}"],
            mistakes: [
              [Vk - x - y, "Prostornino deliš s ploščino osnovne ploskve, ne odštevaš."],
              [Vk / (x + y), "Robova osnovne ploskve zmnoži, preden deliš."],
              [Vk / x, "Deliti moraš z obema robovoma osnovne ploskve."],
            ],
            solution: `$O = a \\cdot b = ${qty(x, u)} \\cdot ${qty(y, u)} = ${qty(x * y, `${u}²`)}$\n${eqs("c", "\\dfrac{V}{a \\cdot b}", `\\dfrac{${qty(Vk, u3)}}{${qty(x * y, `${u}²`)}}`, qty(z, u))}`,
          });
        }
        if (which === "piramida") {
          const ai = r.int(2, 12);
          const vi = r.int(3, 18);
          const Vp = (ai * ai * vi) / 3;
          const Vt = tx(Vp, 2);
          const Vr = roundHalfUp(Vp, 2);
          return V({
            text: `Pravilna štiristrana piramida ima prostornino $${Vt}\\ \\mathrm{${u}^3}$ in osnovni rob $a = ${ai}\\ \\mathrm{${u}}$. Kolikšna je njena višina? Zaokroži na dve decimalki.`,
            value: (3 * Vr) / (ai * ai),
            unit: u,
            find: "v",
            hint: "Iz $V = \\dfrac{a^2 v}{3}$ izrazi $v$: pomnoži s 3 in deli z $a^2$.",
            given: [dat("V", Vt, u3), dat("a", `${ai}`, u)],
            formula: ["V = \\dfrac{a^2 \\cdot v}{3}", "v = \\dfrac{3V}{a^2}"],
            mistakes: [
              [Vr / (ai * ai), "Pozabil si pomnožiti s 3 (piramida ima tretjino prizme)."],
              [(3 * Vr) / ai, "Osnovni rob kvadriraj: osnovna ploskev je kvadrat."],
              [Vr / (3 * ai * ai), "S 3 množiš, ne deliš."],
            ],
            solution: `$a^2 = (${qty(ai, u)})^2 = ${qty(ai * ai, `${u}²`)}$\n${eqs("v", "\\dfrac{3V}{a^2}", `\\dfrac{3 \\cdot ${qty(Vt, u3)}}{${qty(ai * ai, `${u}²`)}}`, res((3 * Vr) / (ai * ai), 2, u))}`,
          });
        }
        // Valj, stožec, krogla: dan je premer.
        const d = r.int(4, 30);
        const rr = d / 2;
        const vv = r.int(3, 25);
        const D = qty(d, "cm");
        if (which === "valj") {
          const Vcm = PI * rr * rr * vv;
          return V({
            text: `Lonec ima obliko valja z notranjim premerom $${d}\\ \\mathrm{cm}$ in višino $${vv}\\ \\mathrm{cm}$. Koliko litrov vode drži? ${piNote}`,
            value: Vcm / 1000,
            v314: (3.14 * rr * rr * vv) / 1000,
            unit: "l",
            find: "V\\ [\\mathrm{l}]",
            hint: "Polmer je polovica premera. Prostornino v $\\mathrm{cm^3}$ pretvori v litre ($1\\ \\mathrm{l} = 1000\\ \\mathrm{cm^3}$).",
            given: [dat("d", `${d}`, "cm"), dat("v", `${vv}`, "cm")],
            formula: ["r = \\dfrac{d}{2}", "V = \\pi r^2 v", "1\\ \\mathrm{l} = 1000\\ \\mathrm{cm^3}"],
            mistakes: [
              [(PI * d * d * vv) / 1000, "V formulo vstavi polmer, ne premera: r = d/2."],
              [Vcm, "Prostornino moraš pretvoriti iz cm³ v litre."],
              [(2 * PI * rr * vv) / 1000, "Osnovna ploskev je krog s ploščino πr², ne obseg 2πr."],
            ],
            solution: `$r = \\dfrac{d}{2} = \\dfrac{${D}}{2} = ${qty(tx(rr), "cm")}$\n${eqs("V", "\\pi r^2 v", `\\pi \\cdot (${qty(tx(rr), "cm")})^2 \\cdot ${qty(vv, "cm")}`, `\\approx ${qty(tx(Vcm, 2), "cm³")}`)}\n$V \\approx ${qty(tx(Vcm / 1000, 2), "l")}$`,
          });
        }
        if (which === "stozec") {
          const Vs = (PI * rr * rr * vv) / 3;
          return V({
            text: `Stožec ima premer osnovne ploskve $${d}\\ \\mathrm{cm}$ in višino $${vv}\\ \\mathrm{cm}$. Izračunaj prostornino v $\\mathrm{cm^3}$. ${piNote}`,
            value: Vs,
            v314: (3.14 * rr * rr * vv) / 3,
            unit: "cm³",
            hint: "Polmer je polovica premera. Nato $V = \\dfrac{\\pi r^2 v}{3}$.",
            given: [dat("d", `${d}`, "cm"), dat("v", `${vv}`, "cm")],
            formula: ["r = \\dfrac{d}{2}", "V = \\dfrac{\\pi r^2 v}{3}"],
            mistakes: [
              [(PI * d * d * vv) / 3, "V formulo vstavi polmer, ne premera: r = d/2."],
              [PI * rr * rr * vv, "Pozabil si deliti s 3: stožec ima tretjino prostornine valja."],
              [(PI * rr * vv) / 3, "Polmer moraš kvadrirati."],
            ],
            solution: `$r = \\dfrac{d}{2} = \\dfrac{${D}}{2} = ${qty(tx(rr), "cm")}$\n${eqs("V", "\\dfrac{\\pi r^2 v}{3}", `\\dfrac{\\pi \\cdot (${qty(tx(rr), "cm")})^2 \\cdot ${qty(vv, "cm")}}{3}`, `\\approx ${qty(tx(Vs, 2), "cm³")}`)}`,
          });
        }
        const Vk = (4 * PI * rr ** 3) / 3;
        return V({
          text: `Žoga ima premer $${d}\\ \\mathrm{cm}$. Izračunaj njeno prostornino v $\\mathrm{cm^3}$. ${piNote}`,
          value: Vk,
          v314: (4 * 3.14 * rr ** 3) / 3,
          unit: "cm³",
          hint: "Polmer je polovica premera. Nato $V = \\dfrac{4\\pi r^3}{3}$.",
          given: [dat("d", `${d}`, "cm")],
          formula: ["r = \\dfrac{d}{2}", "V = \\dfrac{4 \\pi r^3}{3}"],
          mistakes: [
            [(4 * PI * d ** 3) / 3, "V formulo vstavi polmer, ne premera: r = d/2."],
            [4 * PI * rr * rr, "To je površina krogle, ne prostornina."],
            [4 * PI * rr ** 3, "Pozabil si deliti s 3."],
          ],
          solution: `$r = \\dfrac{d}{2} = \\dfrac{${D}}{2} = ${qty(tx(rr), "cm")}$\n$r^3 = (${qty(tx(rr), "cm")})^3 = ${qty(tx(rr ** 3), "cm³")}$\n${eqs("V", "\\dfrac{4 \\pi r^3}{3}", `\\dfrac{4 \\cdot \\pi \\cdot ${qty(tx(rr ** 3), "cm³")}}{3}`, `\\approx ${qty(tx(Vk, 2), "cm³")}`)}`,
        });
      }
      if (which === "kvader")
        return V({
          text: ctx(
            `Kvader ima robove $a = ${tx(a)}\\ \\mathrm{${u}}$, $b = ${tx(b)}\\ \\mathrm{${u}}$ in $c = ${tx(h)}\\ \\mathrm{${u}}$. Izračunaj prostornino. Zaokroži na dve decimalki.`,
            `Škatla za čevlje ima obliko kvadra z dolžino $${tx(a)}\\ \\mathrm{${u}}$, širino $${tx(b)}\\ \\mathrm{${u}}$ in višino $${tx(h)}\\ \\mathrm{${u}}$. Kolikšna je njena prostornina? Zaokroži na dve decimalki.`,
          ),
          value: a * b * h,
          hint: "Prostornina prizme je ploščina osnovne ploskve krat višina: $V = a \\cdot b \\cdot c$.",
          given: [dat("a", tx(a), u), dat("b", tx(b), u), dat("c", tx(h), u)],
          formula: "V = a \\cdot b \\cdot c",
          mistakes: [
            [a + b + h, "Robove zmnoži, ne seštej."],
            [2 * (a * b + b * h + a * h), "To je površina kvadra, ne prostornina."],
            [a * b, "To je le ploščina osnovne ploskve; pomnoži še z višino."],
          ],
          solution: `$O = a \\cdot b = ${A} \\cdot ${qty(tx(b), u)} = ${qty(tx(a * b), `${u}²`)}$\n${eqs("V", "O \\cdot c", `${qty(tx(a * b), `${u}²`)} \\cdot ${H}`, res(a * b * h, 2, u3))}`,
        });
      if (which === "valj")
        return V({
          text: ctx(
            `Valj ima polmer osnovne ploskve $r = ${tx(a)}\\ \\mathrm{${u}}$ in višino $v = ${tx(h)}\\ \\mathrm{${u}}$. Izračunaj prostornino. ${piNote}`,
            `Konzerva ima obliko valja s polmerom dna $${tx(a)}\\ \\mathrm{${u}}$ in višino $${tx(h)}\\ \\mathrm{${u}}$. Kolikšna je njena prostornina? ${piNote}`,
          ),
          value: PI * a * a * h,
          v314: 3.14 * a * a * h,
          hint: "$V = \\pi r^2 v$",
          given: [dat("r", tx(a), u), dat("v", tx(h), u)],
          formula: "V = \\pi r^2 v",
          mistakes: [
            [2 * PI * a * h, "Osnovna ploskev je krog s ploščino πr², ne obseg 2πr."],
            [PI * a * h, "Polmer moraš kvadrirati."],
            [(PI * a * a * h) / 3, "S 3 deliš le pri stožcu in piramidi, ne pri valju."],
          ],
          solution: `$O = \\pi r^2 = \\pi \\cdot (${A})^2 \\approx ${qty(tx(PI * a * a, 2), `${u}²`)}$\n${eqs("V", "\\pi r^2 v", `\\pi \\cdot (${A})^2 \\cdot ${H}`, `\\approx ${qty(tx(PI * a * a * h, 2), u3)}`)}`,
        });
      if (which === "piramida")
        return V({
          text: ctx(
            `Pravilna štiristrana piramida ima osnovni rob $a = ${tx(a)}\\ \\mathrm{${u}}$ in višino $v = ${tx(h)}\\ \\mathrm{${u}}$. Izračunaj prostornino. Zaokroži na dve decimalki.`,
            `Šotor ima obliko pravilne štiristrane piramide z osnovnim robom $${tx(a)}\\ \\mathrm{${u}}$ in višino $${tx(h)}\\ \\mathrm{${u}}$. Koliko prostora (prostornine) je v šotoru? Zaokroži na dve decimalki.`,
          ),
          value: (a * a * h) / 3,
          hint: "Prostornina piramide je tretjina produkta ploščine osnovne ploskve in višine: $V = \\dfrac{a^2 v}{3}$.",
          given: [dat("a", tx(a), u), dat("v", tx(h), u)],
          formula: "V = \\dfrac{a^2 \\cdot v}{3}",
          mistakes: [
            [a * a * h, "Pozabil si deliti s 3: piramida ima tretjino prostornine prizme."],
            [(a * a * h) / 2, "Pri piramidi deliš s 3, ne z 2."],
            [(a * h) / 3, "Osnovni rob kvadriraj: osnovna ploskev je kvadrat."],
          ],
          solution: `$O = a^2 = (${A})^2 = ${qty(tx(a * a), `${u}²`)}$\n${eqs("V", "\\dfrac{O \\cdot v}{3}", `\\dfrac{${qty(tx(a * a), `${u}²`)} \\cdot ${H}}{3}`, res((a * a * h) / 3, 2, u3))}`,
        });
      if (which === "stozec")
        return V({
          text: ctx(
            `Stožec ima polmer osnovne ploskve $r = ${tx(a)}\\ \\mathrm{${u}}$ in višino $v = ${tx(h)}\\ \\mathrm{${u}}$. Izračunaj prostornino. ${piNote}`,
            `Kornet za sladoled ima obliko stožca s polmerom odprtine $${tx(a)}\\ \\mathrm{${u}}$ in višino $${tx(h)}\\ \\mathrm{${u}}$. Kolikšna je njegova prostornina? ${piNote}`,
          ),
          value: (PI * a * a * h) / 3,
          v314: (3.14 * a * a * h) / 3,
          hint: "$V = \\dfrac{\\pi r^2 v}{3}$",
          given: [dat("r", tx(a), u), dat("v", tx(h), u)],
          formula: "V = \\dfrac{\\pi r^2 v}{3}",
          mistakes: [
            [PI * a * a * h, "Pozabil si deliti s 3: stožec ima tretjino prostornine valja."],
            [(PI * a * h) / 3, "Polmer moraš kvadrirati."],
          ],
          solution: `$O = \\pi r^2 = \\pi \\cdot (${A})^2 \\approx ${qty(tx(PI * a * a, 2), `${u}²`)}$\n${eqs("V", "\\dfrac{\\pi r^2 v}{3}", `\\dfrac{\\pi \\cdot (${A})^2 \\cdot ${H}}{3}`, `\\approx ${qty(tx((PI * a * a * h) / 3, 2), u3)}`)}`,
        });
      return V({
        text: ctx(
          `Krogla ima polmer $r = ${tx(a)}\\ \\mathrm{${u}}$. Izračunaj prostornino. ${piNote}`,
          `Steklena kroglica ima polmer $${tx(a)}\\ \\mathrm{${u}}$. Kolikšna je njena prostornina? ${piNote}`,
        ),
        value: (4 * PI * a ** 3) / 3,
        v314: (4 * 3.14 * a ** 3) / 3,
        hint: "$V = \\dfrac{4\\pi r^3}{3}$",
        given: [dat("r", tx(a), u)],
        formula: "V = \\dfrac{4 \\pi r^3}{3}",
        mistakes: [
          [4 * PI * a * a, "To je površina krogle, ne prostornina."],
          [4 * PI * a ** 3, "Pozabil si deliti s 3."],
          [(4 * PI * a * a) / 3, "Polmer moraš kubirati (na tretjo potenco), ne kvadrirati."],
        ],
        solution: `$r^3 = (${A})^3 = ${qty(tx(a ** 3), u3)}$\n${eqs("V", "\\dfrac{4 \\pi r^3}{3}", `\\dfrac{4 \\cdot \\pi \\cdot ${qty(tx(a ** 3), u3)}}{3}`, `\\approx ${qty(tx((4 * PI * a ** 3) / 3, 2), u3)}`)}`,
      });
    },
  },
  {
    id: "podobnost",
    topics: ["MAT-OS-9/podobni-trikotniki", "MAT-OS-9/talesov-izrek", "MAT-SS-2/podobnost"],
    gen(level, r) {
      const k = level === 1 ? r.int(2, 4) : r.pick([1.5, 2.5, 3, 1.2]);
      const a = r.int(2, 12);
      const b = r.int(2, 12);
      if (level === 3) {
        const name = r.pick(NAMES);
        const h = r.dec(1.2, 2, 2);
        const s = r.dec(1, 4, 1);
        const S = r.dec(5, 30, 1);
        const H = (h * S) / s;
        return {
          text: `${name} je ${g(name, "visok", "visoka")} $${tx(h)}\\ \\mathrm{m}$ in meče senco dolžine $${tx(s)}\\ \\mathrm{m}$. Drevo hkrati meče senco dolžine $${tx(S)}\\ \\mathrm{m}$. Kako visoko je drevo? Zaokroži na dve decimalki.`,
          answer: withMistakes({ type: "number", value: H, unit: "m", decimals: 2 }, [
            [(h * s) / S, "Si zamenjal senci? Daljša senca pripada višjemu predmetu."],
            [h + (S - s), "Podobni trikotniki imajo enaka razmerja, ne enakih razlik."],
            [(s * S) / h, "Višina drevesa je v razmerju z njegovo senco: h₂ = h₁ · s₂ / s₁."],
          ]),
          hint: "Sončni žarki so vzporedni, zato sta trikotnika (oseba–senca in drevo–senca) podobna.",
          data: { given: [dat("h_1", tx(h), "m"), dat("s_1", tx(s), "m"), dat("s_2", tx(S), "m")], find: ["h_2"] },
          formula: ["\\dfrac{h_2}{s_2} = \\dfrac{h_1}{s_1}", "h_2 = \\dfrac{h_1 \\cdot s_2}{s_1}"],
          solution: `$\\dfrac{h_2}{s_2} = \\dfrac{h_1}{s_1}$\n${eqs("h_2", "\\dfrac{h_1 \\cdot s_2}{s_1}", `\\dfrac{${qty(tx(h), "m")} \\cdot ${qty(tx(S), "m")}}{${qty(tx(s), "m")}}`, res(H, 2, "m"))}`,
        };
      }
      return {
        text: `Trikotnika sta podobna z razmerjem podobnosti $k = ${tx(k)}$. Stranica manjšega trikotnika meri $${a}\\ \\mathrm{cm}$. Koliko meri istoležna stranica večjega trikotnika?`,
        answer: withMistakes({ type: "number", value: a * k, unit: "cm" }, [
          [a / k, "Večji trikotnik ima daljše stranice: stranico množi s k, ne deli."],
          [a + k, "Stranice se povečajo k-krat, ne za k."],
        ]),
        hint: "Istoležne stranice podobnih trikotnikov so v razmerju $k$: stranico pomnoži s $k$.",
        data: { given: [`k = ${tx(k)}`, dat("a", `${a}`, "cm")], find: ["a'"] },
        formula: "a' = k \\cdot a",
        solution: `Večji trikotnik je ${tx(k)}-krat večji, zato stranico pomnožimo s $k$.\n${eqs("a'", "k \\cdot a", `${tx(k)} \\cdot ${qty(a, "cm")}`, qty(tx(a * k), "cm"))}`,
        _b: b,
      };
    },
  },
  {
    id: "verjetnost",
    topics: ["MAT-OS-9/verjetnost", "MAT-SS-4/verjetnost"],
    gen(level, r) {
      // Okrajšan ulomek za neokrajšanim, če se razlikujeta.
      const reduced = (rn, rd, n, d) => (rn === n && rd === d ? "" : ` = ${fracTex(n, d)}`);
      if (level === 1) {
        // En korak: preštejemo ugodne izide na kocki ali na kolesu sreče z N enakimi polji.
        const N = r.pick([6, 6, 8, 10, 12]);
        const conds = [
          ["sodo število", (x) => x % 2 === 0],
          ["liho število", (x) => x % 2 === 1],
          [`število, večje od ${N === 6 ? 4 : N - 3}`, (x) => x > (N === 6 ? 4 : N - 3)],
          ["število, manjše od 3", (x) => x < 3],
          ["praštevilo", (x) => [2, 3, 5, 7, 11].includes(x)],
          ["število, deljivo s 3", (x) => x % 3 === 0],
          [N === 6 ? "šestico" : `število ${N}`, (x) => x === N],
        ];
        const [what, ok] = r.pick(conds);
        const all = Array.from({ length: N }, (_, i) => i + 1);
        const good = all.filter(ok);
        const [n, d] = reduce(good.length, N);
        const text =
          N === 6
            ? `Mečemo pošteno igralno kocko s 6 ploskvami (pike od 1 do 6). Kolikšna je verjetnost, da pade ${what}? Zapiši kot okrajšan ulomek.`
            : `Kolo sreče ima ${N} enakih polj, oštevilčenih od 1 do ${N}. Kolikšna je verjetnost, da se ustavi na polju, kjer je ${what}? Zapiši kot okrajšan ulomek.`;
        return {
          text,
          answer: { type: "fraction", num: n, den: d },
          hint: "Verjetnost = število ugodnih izidov : število vseh izidov.",
          data: { given: [`n_{\\text{vsi}} = ${N}`], find: ["P"] },
          formula: P_FORMULA,
          solution: `Vsi izidi: $${all.join(", ")}$ (${nOf(N, "izid", "izida", "izidi", "izidov")}).\nUgodni izidi: $${good.join(", ")}$ (${nOf(good.length, "izid", "izida", "izidi", "izidov")}).\n$P = \\dfrac{\\text{ugodni izidi}}{\\text{vsi izidi}} = ${frac(good.length, N)}${reduced(good.length, N, n, d)}$`,
          inputHint: "npr. 1/2",
        };
      }
      const red = r.int(1, 8);
      const blue = r.int(1, 8);
      const green = r.int(1, 6);
      const total = red + blue + green;
      const kroglice = (n) => `${verbOf(n, "je", "sta", "so")} ${nOf(n, "kroglica", "kroglici", "kroglice", "kroglic")}`;
      const nDat = (label, n) => `n_{\\text{${label}}} = ${n}`;
      if (level === 2) {
        // Dva koraka: sešteti vse (in morda ugodne), nato deliti. Vprašamo po eni barvi ali po »ni …«.
        const ask = r.pick(["rdeča", "modra", "ni zelena"]);
        const fav = ask === "rdeča" ? red : ask === "modra" ? blue : red + blue;
        const [n, d] = reduce(fav, total);
        const favLabel = ask === "rdeča" ? "rdeče" : ask === "modra" ? "modre" : "ne zelene";
        return {
          text: `V vrečki ${kroglice(total)}: ${nOf(red, "rdeča", "rdeči", "rdeče", "rdečih")}, ${nOf(blue, "modra", "modri", "modre", "modrih")} in ${nOf(green, "zelena", "zeleni", "zelene", "zelenih")}. Na slepo izvlečemo eno. Kolikšna je verjetnost, da ${ask === "ni zelena" ? "ni zelena" : `je ${ask}`}? Zapiši kot okrajšan ulomek.`,
          answer: { type: "fraction", num: n, den: d },
          hint: ask === "ni zelena" ? "Ugodne so vse kroglice, ki niso zelene. Koliko jih je?" : "Koliko je vseh kroglic? Koliko je ugodnih?",
          data: { given: [nDat("rdeče", red), nDat("modre", blue), nDat("zelene", green)], find: ["P"] },
          formula: P_FORMULA,
          solution: `Vse kroglice: $n_{\\text{vse}} = ${red} + ${blue} + ${green} = ${total}$\nUgodne (${favLabel}): $${ask === "ni zelena" ? `${red} + ${blue} = ` : ""}${fav}$\n$P = \\dfrac{${fav}}{${total}}${reduced(fav, total, n, d)}$`,
          inputHint: "npr. 3/8",
        };
      }
      const R = red + 1;
      const T = R + blue + green;
      const [n, d] = reduce(R * (R - 1), T * (T - 1));
      return {
        text: `V vrečki ${kroglice(T)}: ${nOf(R, "rdeča", "rdeči", "rdeče", "rdečih")} in ${nOf(blue + green, "druge barve", "drugih barv", "drugih barv", "drugih barv")}. Zaporedoma izvlečemo dve kroglici, prve ne vrnemo. Kolikšna je verjetnost, da sta obe rdeči? Zapiši kot okrajšan ulomek.`,
        answer: { type: "fraction", num: n, den: d },
        hint: "Verjetnost za prvo rdečo pomnoži z verjetnostjo za drugo rdečo, ko je ena že izvlečena.",
        data: { given: [nDat("vse", T), nDat("rdeče", R), nDat("druge", blue + green)], find: ["P"] },
        formula: ["P = P_1 \\cdot P_2", "P = \\dfrac{n_{\\text{rdeče}}}{n_{\\text{vse}}} \\cdot \\dfrac{n_{\\text{rdeče}} - 1}{n_{\\text{vse}} - 1}"],
        solution: `Prva kroglica: $P_1 = ${frac(R, T)}$; druga (ena rdeča in ena kroglica manj): $P_2 = ${frac(R - 1, T - 1)}$\n$P = P_1 \\cdot P_2 = ${frac(R, T)} \\cdot ${frac(R - 1, T - 1)} = ${frac(R * (R - 1), T * (T - 1))}${reduced(R * (R - 1), T * (T - 1), n, d)}$`,
        inputHint: "npr. 1/6",
      };
    },
  },
];
