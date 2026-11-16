// Generatorji za teme, ki prej niso imele nalog (mat-os). Merila: docs/kakovost.md §2.
// Vsak generator izračuna števila in pravilen odgovor v kodi iz istih (zaokroženih) števil, kot so v besedilu.
import { NAMES, g, nOf } from "../rng.js";
import { roundHalfUp, gcd } from "../check.js";
import { tx } from "./mat.js";

// ---------- pomožne funkcije ----------
const lcm = (a, b) => (a / gcd(a, b)) * b;
const unitTex = (u) => (u.startsWith("\\") ? u : `\\mathrm{${u.replace("²", "^2").replace("³", "^3")}}`);
const qty = (val, unit) => `${val}\\ ${unitTex(unit)}`;
const dat = (sym, val, unit) => `${sym} = ${unit ? qty(val, unit) : val}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const eq = (x, d) => (needsRounding(x, d) ? "\\approx" : "=");
const EUR = "\\text{€}";
const EUR_ALT = ["eur", "evrov", "evra", "evre", "evro", "euro", "eurov"];
const deg = (x) => `${tx(x)}^\\circ`;
const fr = (n, d) => `\\frac{${n}}{${d}}`;
const dfr = (n, d) => `\\dfrac{${n}}{${d}}`;
// Veliko število s presledki med skupinami po tri števke: big(1234567) → "1\,234\,567" (TeX), bigT → "1 234 567".
const big = (n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : String(n));
const sum = (a) => a.reduce((s, x) => s + x, 0);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const coprimes = (d, lo, hi) => range(lo, hi).filter((k) => gcd(k, d) === 1);
const divisors = (n) => range(1, n).filter((k) => n % k === 0);
const name2 = (r) => {
  const a = r.pick(NAMES);
  let b = r.pick(NAMES);
  while (b === a) b = r.pick(NAMES);
  return [a, b];
};

// Številski odgovor s tipičnimi napakami [[vrednost, zakaj], …]; napaka, ki je enaka pravilnemu rezultatu, odpade.
function num(value, unit, decimals = null, mistakes = [], extra = {}) {
  const show = (v) => (decimals == null ? Number(v.toFixed(9)) : roundHalfUp(v, decimals));
  const seen = new Set([show(value)]);
  const ms = [];
  for (const [v, why] of mistakes) {
    if (!Number.isFinite(v) || ms.length >= 3) continue;
    const vv = show(v);
    if (seen.has(vv)) continue;
    seen.add(vv);
    ms.push({ value: vv, why });
  }
  const a = { type: "number", value, decimals };
  if (unit) a.unit = unit;
  if (unit === "€") a.unitAlternatives = EUR_ALT;
  if (unit === "°") a.unitAlternatives = ["stopinj", "stopinje", "stopinja"];
  if (unit === "°C") a.unitAlternatives = ["stopinj", "stopinje", "°", "c"];
  if (unit === "L") a.unitAlternatives = ["l", "litrov", "litra", "litre"];
  if (ms.length) a.mistakes = ms;
  return { ...a, ...extra };
}

// Izbirni odgovor: pravilni + napačni [[možnost, zakaj], …]; why je urejen po premešanem vrstnem redu.
function choice(r, correct, wrong) {
  const opts = r.shuffle([correct, ...wrong.map((w) => w[0])]);
  const m = new Map(wrong);
  return { type: "choice", options: opts, index: opts.indexOf(correct), why: opts.map((o) => (o === correct ? null : m.get(o))) };
}
const frac = (n, d) => {
  const k = gcd(n, d);
  return { type: "fraction", num: n / k, den: d / k };
};

// Sestavi nalogo; steps so vrstice rešitve.
// Podatek vedno v obliki »oznaka = vrednost« (tako ga prikaže okvir Podatki).
const LBL = "[A-Za-zčšžČŠŽ][A-Za-zčšžČŠŽ0-9 .,()–-]*";
function labelEq(s) {
  if (s.includes("=")) return s;
  let m;
  if ((m = s.match(new RegExp(`^\\\\text\\{(${LBL}):\\s*\\}\\s*(.+)$`)))) return `\\text{${m[1]}} = ${m[2]}`;
  if ((m = s.match(new RegExp(`^\\\\text\\{(${LBL})\\}:\\s*(.+)$`)))) return `\\text{${m[1]}} = ${m[2]}`;
  if ((m = s.match(new RegExp(`^\\\\text\\{(${LBL}):\\s*(${LBL})\\}$`)))) return `\\text{${m[1]}} = \\text{${m[2]}}`;
  if ((m = s.match(new RegExp(`^(${LBL}):\\s*(.+)$`)))) return `\\text{${m[1]}} = ${m[2]}`;
  return s;
}
const T = ({ text, answer, hint, given = [], find = [], formula, steps, tex }) => {
  const consts = given.filter((x) => x.includes("\\approx"));
  const fl = formula ? [].concat(formula, consts) : consts.length ? consts : null;
  return {
  text,
  answer,
  hint,
  data: { given: given.filter((x) => !x.includes("\\approx")).map(labelEq), find },
  ...(fl ? { formula: fl.length === 1 ? fl[0] : fl } : {}),
  solution: steps.join("\n"),
  ...(tex ? { options_tex: true } : {}),
  };
};

// ---------- števila z besedami (do 9 999 999) ----------
const H100 = ["", "sto", "dvesto", "tristo", "štiristo", "petsto", "šeststo", "sedemsto", "osemsto", "devetsto"];
const E1 = ["", "ena", "dva", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"];
const N10 = ["deset", "enajst", "dvanajst", "trinajst", "štirinajst", "petnajst", "šestnajst", "sedemnajst", "osemnajst", "devetnajst"];
const D10 = ["", "", "dvajset", "trideset", "štirideset", "petdeset", "šestdeset", "sedemdeset", "osemdeset", "devetdeset"];
const MIL = ["", "", "dva milijona", "trije milijoni", "štirje milijoni", "pet milijonov", "šest milijonov", "sedem milijonov", "osem milijonov", "devet milijonov"];
function words999(n) {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  const p = [];
  if (h) p.push(H100[h]);
  if (t === 1) p.push(N10[u]);
  else if (t === 0) {
    if (u) p.push(E1[u]);
  } else p.push(u ? `${E1[u]}in${D10[t]}` : D10[t]);
  return p.join(" ");
}
function words(n) {
  const m = Math.floor(n / 1e6);
  const k = Math.floor((n % 1e6) / 1000);
  const u = n % 1000;
  const p = [];
  if (m) p.push(MIL[m]);
  if (k) p.push(k === 1 ? "tisoč" : `${words999(k)} tisoč`);
  if (u) p.push(words999(u));
  return p.join(" ");
}
const PLACE = ["enic", "desetic", "stotic", "tisočic", "desettisočic", "stotisočic", "milijonov"];
const ROUND_TO = { 10: ["desetice", "desetic"], 100: ["stotice", "stotic"], 1000: ["tisočice", "tisočic"], 10000: ["desettisočice", "desettisočic"] };
const roundTo = (n, p) => Math.floor((n + p / 2) / p) * p;
const digitAt = (n, p) => Math.floor(n / p) % 10;
const ROUND_RULE = "\\text{števka desno od mesta zaokroževanja: } 0\\text{–}4 \\Rightarrow \\text{navzdol},\\ 5\\text{–}9 \\Rightarrow \\text{navzgor}";

// Vrsta kota glede na velikost.
const KOTI = ["ostri kot", "pravi kot", "topi kot", "iztegnjeni kot", "izbočeni kot", "polni kot"];
const KOT_WHY = {
  "ostri kot": "Ostri kot meri več kot 0° in manj kot 90°.",
  "pravi kot": "Pravi kot meri natanko 90°.",
  "topi kot": "Topi kot meri več kot 90° in manj kot 180°.",
  "iztegnjeni kot": "Iztegnjeni kot meri natanko 180°.",
  "izbočeni kot": "Izbočeni kot meri več kot 180° in manj kot 360°.",
  "polni kot": "Polni kot meri natanko 360°.",
};
const kotVrsta = (a) => (a < 90 ? KOTI[0] : a === 90 ? KOTI[1] : a < 180 ? KOTI[2] : a === 180 ? KOTI[3] : a < 360 ? KOTI[4] : KOTI[5]);

export const DODATNE_MAT_OS = [
  // ===================== 6. razred =====================
  {
    id: "dod-mat-os-velika-stevila",
    topics: ["MAT-OS-6/zapis-in-urejanje-velikih-stevil"],
    gen(level, r) {
      const CTX = [
        (s) => `Mesto ima $${s}$ prebivalcev.`,
        (s) => `Spletni posnetek si je ogledalo $${s}$ ljudi.`,
        (s) => `Na tekmah lige je bilo v sezoni skupaj $${s}$ gledalcev.`,
        (s) => `Hiša stane $${s}$ €.`,
        (s) => `Tovornjak je v svoji življenjski dobi prevozil $${s}$ km.`,
        (s) => `V knjižnici hranijo $${s}$ knjig.`,
      ];
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.6) {
          const p = r.pick([10, 100, 1000]);
          const [pn, pg] = ROUND_TO[p];
          let n = r.int(10000, 999999);
          if (n % p === 0) n += r.int(1, 9) * (p / 10);
          const ans = roundTo(n, p);
          const down = Math.floor(n / p) * p;
          const dr = digitAt(n, p / 10);
          return T({
            text: `${r.pick(CTX)(big(n))} Zaokroži to število na ${pn}.`,
            answer: num(ans, null, null, [
              [ans === down ? down + p : down, "Poglej števko desno od mesta zaokroževanja: 0–4 pomeni navzdol, 5–9 navzgor."],
              [roundTo(n, p * 10), `Zaokrožil si na napačno mesto – zaokrožiti moraš na ${pn}.`],
            ]),
            hint: `Poišči števko na mestu ${pg} in poglej števko desno od nje.`,
            given: [`n = ${big(n)}`],
            find: [`\\text{zaokroženo na ${pn}}`],
            formula: ROUND_RULE,
            steps: [
              `Na mestu ${pg} je števka ${digitAt(n, p)}, desno od nje je števka ${dr}.`,
              `Ker je $${dr} ${dr >= 5 ? "\\ge" : "<"} 5$, zaokrožimo ${dr >= 5 ? "navzgor" : "navzdol"}.`,
              `$${big(n)} \\approx ${big(ans)}$`,
            ],
          });
        }
        const digs = r.shuffle(range(1, 9)).slice(0, 7);
        const n = Number(digs.join(""));
        const i = r.int(2, 6);
        const d = digitAt(n, 10 ** i);
        const ans = d * 10 ** i;
        const lead = r.pick([
          `Kolikšno vrednost ima števka $${d}$ v številu $${big(n)}$?`,
          `${name} je na tablo ${g(name, "napisal", "napisala")} število $${big(n)}$. Koliko je vredna števka $${d}$ v tem številu?`,
          `Avto stane $${big(n)}$ €. Koliko evrov predstavlja števka $${d}$ v tej ceni?`,
        ]);
        return T({
          text: lead,
          answer: num(ans, lead.includes("€") ? "€" : null, null, [
            [d, "Vprašanje je vrednost števke, ne števka sama – upoštevaj njeno mesto."],
            [d * 10 ** (i - 1), "Mesta štej od desne: enice, desetice, stotice, tisočice …"],
            [d * 10 ** (i + 1), "Mesta štej od desne: enice, desetice, stotice, tisočice …"],
          ]),
          hint: "Mesta štej od desne proti levi: enice, desetice, stotice, tisočice, desettisočice …",
          given: [`n = ${big(n)}`],
          find: [`\\text{vrednost števke } ${d}`],
          formula: "\\text{vrednost} = \\text{števka} \\cdot \\text{mestna vrednost}",
          steps: [`Števka ${d} stoji na mestu ${PLACE[i]} (mestna vrednost $${big(10 ** i)}$).`, `Vrednost: $${d} \\cdot ${big(10 ** i)} = ${big(ans)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const m = r.next() < 0.75 ? r.int(2, 9) : 0;
          let k = r.next() < 0.5 ? r.int(2, 99) : r.int(100, 999);
          if (k % 100 === 1) k += 1;
          const u = r.next() < 0.5 ? r.int(1, 99) : r.int(100, 999);
          const n = m * 1e6 + k * 1000 + u;
          const w = words(n);
          const wrong = Number(`${m || ""}${k}${u}`);
          const pad = (x) => String(x).padStart(3, "0");
          return T({
            text: r.pick([
              `Zapiši s števkami število: ${w}.`,
              `${name} je po radiu ${g(name, "slišal", "slišala")} število »${w}«. Zapiši ga s števkami.`,
              `V poročilu je z besedami zapisano število obiskovalcev: ${w}. Zapiši ga s števkami.`,
            ]),
            answer: num(n, null, null, [[wrong, "Vsaka skupina (milijoni, tisoči, enice) ima tri mesta – manjkajoča mesta zapolni z ničlami."]]),
            hint: "Število razdeli na skupine: milijoni, tisoči in enice. Vsaka skupina razen prve ima natanko tri števke.",
            given: [`\\text{z besedami} = \\text{${w}}`],
            find: ["\\text{število s števkami}"],
            formula: "1\\ \\text{milijon} = 1\\,000\\,000,\\quad 1\\ \\text{tisoč} = 1\\,000",
            steps: [
              `Skupine: ${m ? `milijoni ${m}, ` : ""}tisoči ${k}, enice ${u}.`,
              `Skupine tisočev in enic zapišemo s tremi števkami: ${m ? `${m} | ` : ""}${m ? pad(k) : k} | ${pad(u)}`,
              `Število: $${big(n)}$`,
            ],
          });
        }
        if (t === 1) {
          const p = r.pick([100, 1000, 10000]);
          const [pn, pg] = ROUND_TO[p];
          const q = r.int(Math.ceil(100000 / (10 * p)), Math.floor(9000000 / (10 * p)));
          const n = q * 10 * p + 9 * p + r.int(p / 2, p - 1);
          const ans = roundTo(n, p);
          return T({
            text: `${r.pick(CTX)(big(n))} Zaokroži to število na ${pn}.`,
            answer: num(ans, null, null, [
              [Math.floor(n / p) * p, "Števka desno od mesta zaokroževanja je 5 ali več – zaokrožiti moraš navzgor."],
              [roundTo(n, p / 10), `Zaokrožil si na napačno mesto – zaokrožiti moraš na ${pn}.`],
            ]),
            hint: `Na mestu ${pg} je števka 9. Če jo povečaš za 1, dobiš 10 – prenos gre na mesto levo.`,
            given: [`n = ${big(n)}`],
            find: [`\\text{zaokroženo na ${pn}}`],
            formula: ROUND_RULE,
            steps: [
              `Na mestu ${pg} je števka 9, desno od nje števka ${digitAt(n, p / 10)} (5 ali več), zato zaokrožimo navzgor.`,
              `Števka 9 se poveča na 10: na tem mestu zapišemo 0, 1 pa prenesemo na mesto levo.`,
              `$${big(n)} \\approx ${big(ans)}$`,
            ],
          });
        }
        // urejanje
        const digs = r.shuffle(range(1, 8)).slice(0, 7);
        const a = Number(digs.join(""));
        const sw = [...digs];
        [sw[2], sw[3]] = [sw[3], sw[2]];
        const b = Number(sw.join(""));
        const c = Number(`9${r.shuffle(range(1, 8)).slice(0, 5).join("")}`);
        const d = a + (r.next() < 0.5 ? 1 : -1) * r.int(1, 9) * 1000;
        const nums = r.shuffle([a, b, c, d]);
        const down = r.next() < 0.5;
        const sorted = [...nums].sort((x, y) => (down ? y - x : x - y));
        const lex = [...nums].sort((x, y) => (down ? String(y).localeCompare(String(x)) : String(x).localeCompare(String(y))));
        const k = r.int(1, 3);
        const ans = sorted[k - 1];
        return T({
          text: `Uredi števila $${nums.map(big).join("$, $")}$ od ${down ? "največjega do najmanjšega" : "najmanjšega do največjega"}. Katero število je na ${k}. mestu?`,
          answer: num(ans, null, null, [
            [lex[k - 1], "Najprej primerjaj število števk: število z več števkami je večje, ne glede na prvo števko."],
            [sorted[4 - k], `Preveri smer urejanja: od ${down ? "največjega" : "najmanjšega"} naprej.`],
          ]),
          hint: "Najprej primerjaj, koliko števk ima vsako število. Pri enako dolgih števil primerjaj števke od leve proti desni.",
          given: nums.map((x, i) => `a_{${i + 1}} = ${big(x)}`),
          find: [`\\text{${k}. število po vrsti}`],
          formula: "\\text{več števk} \\Rightarrow \\text{večje število}",
          steps: [
            `Število $${big(c)}$ ima le šest števk, zato je najmanjše.`,
            `Sedemmestna števila primerjamo po števkah od leve proti desni.`,
            `$${sorted.map(big).join(down ? " > " : " < ")}$`,
            `Na ${k}. mestu je $${big(ans)}$.`,
          ],
        });
      }
      // raven 3
      if (r.next() < 0.5) {
        const p = r.pick([100, 1000, 10000]);
        const [pn] = ROUND_TO[p];
        const X = r.int(Math.ceil(200000 / p), Math.floor(5000000 / p)) * p;
        const low = r.next() < 0.5;
        const ans = low ? X - p / 2 : X + p / 2 - 1;
        const ctx = r.pick([
          `Časopis poroča, da je festival obiskalo $${big(X)}$ ljudi (število je zaokroženo na ${pn}).`,
          `Na tabli piše, da ima občina $${big(X)}$ prebivalcev, zaokroženo na ${pn}.`,
          `Po zaokrožitvi na ${pn} je ${name} ${g(name, "dobil", "dobila")} število $${big(X)}$.`,
        ]);
        return T({
          text: `${ctx} Katero je ${low ? "najmanjše" : "največje"} naravno število, ki se na ${pn} zaokroži na $${big(X)}$?`,
          answer: num(
            ans,
            null,
            null,
            low
              ? [
                  [X - p / 2 + 1, "Število, ki ima desno od mesta zaokroževanja števko 5, se zaokroži navzgor – tudi to šteje."],
                  [X - p, "Na to število se zaokrožijo števila od polovice mesta nižje do polovice mesta višje."],
                ]
              : [
                  [X + p / 2, "To število se zaokroži že navzgor, na naslednjo vrednost."],
                  [X + p - 1, "Na to število se zaokrožijo števila od polovice mesta nižje do polovice mesta višje."],
                ],
          ),
          hint: `Na $${big(X)}$ se zaokrožijo števila, ki so od njega oddaljena manj kot polovico enote (pol od $${big(p)}$ je $${p / 2}$).`,
          given: [`\\text{zaokroženo: } ${big(X)}`, `\\text{mesto: ${pn}}`],
          find: [`\\text{${low ? "najmanjše" : "največje"} število}`],
          formula: ROUND_RULE,
          steps: [
            `Polovica enote mesta je $${big(p)} : 2 = ${p / 2}$.`,
            `Na $${big(X)}$ se zaokrožijo števila od $${big(X - p / 2)}$ do $${big(X + p / 2 - 1)}$.`,
            `${low ? "Najmanjše" : "Največje"} tako število je $${big(ans)}$.`,
          ],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const digs = r.shuffle([0, ...r.shuffle(range(1, 9)).slice(0, 5)]);
        const asc = [...digs].sort((x, y) => x - y);
        const nz = asc.findIndex((x) => x > 0);
        const sm = [asc[nz], ...asc.filter((_, i) => i !== nz)];
        const ans = Number(sm.join(""));
        return T({
          text: `Iz števk $${digs.join(", ")}$ sestavi najmanjše šestmestno število. Vsako števko uporabi natanko enkrat.`,
          answer: num(ans, null, null, [[Number(asc.join("")), "Šestmestno število se ne sme začeti z 0 – tako bi dobil petmestno število."]]),
          hint: "Na prvo mesto postavi najmanjšo števko, ki ni 0, nato ostale od najmanjše do največje.",
          given: [`\\text{števke: } ${digs.join(", ")}`],
          find: ["\\text{najmanjše šestmestno število}"],
          formula: "\\text{prva števka} \\ne 0",
          steps: [`Najmanjša števka, ki ni 0, je ${asc[nz]} – ta gre na prvo mesto.`, `Ostale števke uredimo naraščajoče: ${sm.slice(1).join(", ")}.`, `Število: $${big(ans)}$`],
        });
      }
      if (t === 1) {
        let digs;
        do digs = r.shuffle(range(1, 9)).slice(0, 6);
        while (!digs.some((x) => x % 2 === 0) || Math.min(...digs) % 2 === 0);
        const desc = [...digs].sort((x, y) => y - x);
        const e = Math.min(...digs.filter((x) => x % 2 === 0));
        const rest = desc.filter((x) => x !== e);
        const ans = Number([...rest, e].join(""));
        return T({
          text: `Iz števk $${digs.join(", ")}$ sestavi največje šestmestno sodo število. Vsako števko uporabi natanko enkrat.`,
          answer: num(ans, null, null, [[Number(desc.join("")), "Število mora biti sodo – na zadnjem mestu mora biti soda števka."]]),
          hint: "Sodo število se konča s sodo števko. Na konec postavi najmanjšo sodo števko, ostale uredi od največje do najmanjše.",
          given: [`\\text{števke: } ${digs.join(", ")}`],
          find: ["\\text{največje sodo število}"],
          formula: "\\text{sodo število se konča z } 0, 2, 4, 6 \\text{ ali } 8",
          steps: [`Na zadnje mesto postavimo najmanjšo sodo števko: ${e}.`, `Ostale števke uredimo padajoče: ${rest.join(", ")}.`, `Število: $${big(ans)}$`],
        });
      }
      const digs = r.shuffle(range(1, 9)).slice(0, 6);
      const desc = [...digs].sort((x, y) => y - x);
      const N = Number(desc.join(""));
      const ans = roundTo(N, 1000);
      return T({
        text: `${name} iz števk $${digs.join(", ")}$ sestavi največje šestmestno število (vsako števko uporabi enkrat) in ga zaokroži na tisočice. Katero število dobi?`,
        answer: num(ans, null, null, [
          [N, "Število moraš še zaokrožiti na tisočice."],
          [Math.floor(N / 1000) * 1000, "Poglej stotice: 5 ali več pomeni zaokroževanje navzgor."],
        ]),
        hint: "Najprej uredi števke od največje do najmanjše, nato poglej števko na mestu stotic.",
        given: [`\\text{števke: } ${digs.join(", ")}`],
        find: ["\\text{zaokroženo število}"],
        formula: ROUND_RULE,
        steps: [`Največje število: $${big(N)}$`, `Na mestu stotic je ${digitAt(N, 100)}, zato zaokrožimo ${digitAt(N, 100) >= 5 ? "navzgor" : "navzdol"}.`, `$${big(N)} \\approx ${big(ans)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-racunske-operacije",
    topics: ["MAT-OS-6/racunske-operacije-in-lastnosti"],
    gen(level, r) {
      const ORDER = "\\text{oklepaji} \\;\\rightarrow\\; \\cdot\\ \\text{in}\\ : \\;\\rightarrow\\; +\\ \\text{in}\\ -";
      const lead = r.pick(["Izračunaj vrednost izraza", "Izračunaj", "Koliko je"]);
      if (level === 1) {
        const t = r.int(0, 3);
        let ex, val, wrong, why, steps;
        if (t === 0) {
          const [a, b, c] = [r.int(5, 60), r.int(2, 12), r.int(2, 12)];
          ex = `${a} + ${b} \\cdot ${c}`;
          val = a + b * c;
          wrong = (a + b) * c;
          why = "Množenje ima prednost pred seštevanjem.";
          steps = [`Najprej množimo: $${b} \\cdot ${c} = ${b * c}$`, `Nato seštejemo: $${a} + ${b * c} = ${val}$`];
        } else if (t === 1) {
          const [a, b, c] = [r.int(3, 30), r.int(2, 30), r.int(2, 9)];
          ex = `(${a} + ${b}) \\cdot ${c}`;
          val = (a + b) * c;
          wrong = a + b * c;
          why = "Najprej izračunaj, kar je v oklepaju.";
          steps = [`Najprej oklepaj: $${a} + ${b} = ${a + b}$`, `Nato množimo: $${a + b} \\cdot ${c} = ${val}$`];
        } else if (t === 2) {
          const c = r.int(2, 9);
          const k = r.int(3, 15);
          const b = c * k;
          const a = b + r.int(5, 60);
          ex = `${a} - ${b} : ${c}`;
          val = a - k;
          wrong = Number.isInteger((a - b) / c) ? (a - b) / c : NaN;
          why = "Deljenje ima prednost pred odštevanjem.";
          steps = [`Najprej delimo: $${b} : ${c} = ${k}$`, `Nato odštejemo: $${a} - ${k} = ${val}$`];
        } else {
          const [a, c] = [r.int(2, 9), r.int(2, 20)];
          const b = c + r.int(2, 30);
          ex = `${a} \\cdot (${b} - ${c})`;
          val = a * (b - c);
          wrong = a * b - c;
          why = `S številom ${a} moraš pomnožiti celoten oklepaj.`;
          steps = [`Najprej oklepaj: $${b} - ${c} = ${b - c}$`, `Nato množimo: $${a} \\cdot ${b - c} = ${val}$`];
        }
        return T({
          text: `${lead}: $${ex}$`,
          answer: num(val, null, null, [[wrong, why]]),
          hint: "Najprej oklepaji, nato množenje in deljenje, šele na koncu seštevanje in odštevanje.",
          given: [`\\text{izraz} = ${ex}`],
          find: ["\\text{vrednost izraza}"],
          formula: ORDER,
          steps: [...steps, `$${ex} = ${val}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0 || t === 3) {
          const plus = t === 0;
          const a = r.int(3, 49);
          const S = r.pick([10, 100, 100]);
          const b = plus ? r.int(2, S - 2) : S + r.int(2, 60);
          const c = plus ? S - b : b - S;
          const ex = `${a} \\cdot ${b} ${plus ? "+" : "-"} ${a} \\cdot ${c}`;
          const val = a * S;
          return T({
            text: `Izračunaj na spreten način (uporabi zakon o razčlenjevanju): $${ex}$`,
            answer: num(val, null, null, [[plus ? a * b + c : a * b - c, `Tudi drugi člen je produkt s številom ${a}.`]]),
            hint: `Oba člena imata skupni faktor ${a}. Izpostavi ga pred oklepaj.`,
            given: [`\\text{izraz} = ${ex}`],
            find: ["\\text{vrednost izraza}"],
            formula: plus ? "a \\cdot b + a \\cdot c = a \\cdot (b + c)" : "a \\cdot b - a \\cdot c = a \\cdot (b - c)",
            steps: [`Izpostavimo ${a}: $${ex} = ${a} \\cdot (${b} ${plus ? "+" : "-"} ${c})$`, `$= ${a} \\cdot ${S} = ${val}$`],
          });
        }
        if (t === 1) {
          const a = r.int(3, 19);
          const nine = r.next() < 0.4;
          const b = nine ? r.pick([9, 99]) : r.pick([100, 10]) + r.int(1, 9);
          const base = nine ? b + 1 : b - (b % 10 === 0 ? 0 : b % 10);
          const rest = nine ? 1 : b - base;
          const val = a * b;
          return T({
            text: `Izračunaj na pamet z razčlenjevanjem: $${a} \\cdot ${b}$`,
            answer: num(val, null, null, [[nine ? a * base - 1 : a * base + rest, `S številom ${a} pomnoži oba dela, ${base} in ${rest}.`]]),
            hint: `Zapiši $${b} = ${base} ${nine ? "-" : "+"} ${rest}$ in uporabi zakon o razčlenjevanju.`,
            given: [`\\text{produkt} = ${a} \\cdot ${b}`],
            find: ["\\text{produkt}"],
            formula: nine ? "a \\cdot (b - c) = a \\cdot b - a \\cdot c" : "a \\cdot (b + c) = a \\cdot b + a \\cdot c",
            steps: [
              `$${a} \\cdot ${b} = ${a} \\cdot (${base} ${nine ? "-" : "+"} ${rest})$`,
              `$= ${a} \\cdot ${base} ${nine ? "-" : "+"} ${a} \\cdot ${rest} = ${a * base} ${nine ? "-" : "+"} ${a * rest}$`,
              `$= ${val}$`,
            ],
          });
        }
        const c = r.int(3, 30);
        const b = c + r.int(5, 40);
        const a = b + r.int(10, 80);
        const ex = `${a} - (${b} - ${c})`;
        const val = a - b + c;
        return T({
          text: `${lead}: $${ex}$`,
          answer: num(val, null, null, [[a - b - c, "Od števila odštevaš razliko – odšteješ manj, zato je rezultat večji. Najprej izračunaj oklepaj."]]),
          hint: "Najprej izračunaj razliko v oklepaju, nato jo odštej.",
          given: [`\\text{izraz} = ${ex}`],
          find: ["\\text{vrednost izraza}"],
          formula: "a - (b - c) = a - b + c",
          steps: [`Oklepaj: $${b} - ${c} = ${b - c}$`, `$${a} - ${b - c} = ${val}$`],
        });
      }
      // raven 3: besedilne naloge
      const name = r.pick(NAMES);
      const t = r.int(0, 3);
      if (t === 0) {
        const n1 = r.int(2, 6);
        const p1 = r.pick([1.5, 2, 2.5, 3, 3.5]);
        const n2 = r.int(2, 8);
        const p2 = r.pick([0.5, 0.8, 1.2, 0.9]);
        const cost = n1 * p1 + n2 * p2;
        const B = cost < 18 ? 20 : 50;
        const val = B - cost;
        return T({
          text: `${name} kupi ${nOf(n1, "zvezek", "zvezka", "zvezke", "zvezkov")} po $${tx(p1)}$ € in ${nOf(n2, "svinčnik", "svinčnika", "svinčnike", "svinčnikov")} po $${tx(p2)}$ €. Plača z bankovcem za $${B}$ €. Koliko evrov dobi vrnjenih?`,
          answer: num(val, "€", 2, [
            [B - n1 * p1 + n2 * p2, "Postavi oklepaj: od bankovca odštej celoten znesek nakupa."],
            [B - (p1 + n2 * p2), `Zvezkov je ${n1} – ceno pomnoži s številom kosov.`],
          ]),
          hint: "Najprej zapiši izraz za ceno vsega nakupa, nato ga odštej od bankovca.",
          given: [`n_1 = ${n1}`, `c_1 = ${qty(tx(p1), EUR)}`, `n_2 = ${n2}`, `c_2 = ${qty(tx(p2), EUR)}`, `B = ${qty(B, EUR)}`],
          find: ["\\text{vračilo}"],
          formula: "\\text{vračilo} = B - (n_1 \\cdot c_1 + n_2 \\cdot c_2)",
          steps: [
            `Nakup: $${n1} \\cdot ${tx(p1)} + ${n2} \\cdot ${tx(p2)} = ${tx(n1 * p1)} + ${tx(n2 * p2)} = ${qty(tx(cost), EUR)}$`,
            `Vračilo: $${B} - ${tx(cost)} = ${qty(tx(val, 2), EUR)}$`,
          ],
        });
      }
      if (t === 1) {
        const n = r.int(18, 28);
        const k = r.int(8, 15);
        const B = n * k;
        const v = r.int(4, 12);
        const val = k + v;
        return T({
          text: `Razred s ${n} učenci gre na izlet. Avtobus stane skupaj $${B}$ €, vstopnina v muzej pa $${v}$ € na učenca. Koliko evrov plača vsak učenec?`,
          answer: num(val, "€", null, [
            [(B + v) / n, "Vstopnino plača vsak učenec posebej – ne deli je s številom učencev."],
            [k, "Prištej še vstopnino."],
          ]),
          hint: "Ceno avtobusa razdeli med vse učence, nato prištej vstopnino enega učenca.",
          given: [`n = ${n}`, `\\text{avtobus} = ${qty(B, EUR)}`, `\\text{vstopnina} = ${qty(v, EUR)}`],
          find: ["\\text{znesek na učenca}"],
          formula: "\\text{na učenca} = \\text{avtobus} : n + \\text{vstopnina}",
          steps: [`Avtobus na učenca: $${B} : ${n} = ${k}$`, `Skupaj: $${B} : ${n} + ${v} = ${k} + ${v} = ${qty(val, EUR)}$`],
        });
      }
      if (t === 2) {
        const a = r.int(12, 48);
        const S = r.pick([100, 100, 1000]);
        const b = r.int(11, S === 100 ? 89 : 899);
        const c = S - b;
        const R = a * S;
        return T({
          text: `Katero število manjka, da bo enakost pravilna? $${a} \\cdot ${b} + ${a} \\cdot \\square = ${big(R)}$`,
          answer: num(c, null, null, [
            [R - a * b, `To je vrednost drugega produkta – deli jo še s ${a}.`],
            [S, "Vsota obeh drugih faktorjev mora dati to število, ne en sam faktor."],
          ]),
          hint: `Izpostavi skupni faktor ${a}: $${a} \\cdot (${b} + \\square) = ${big(R)}$.`,
          given: [`${a} \\cdot ${b} + ${a} \\cdot \\square = ${big(R)}`],
          find: ["\\square"],
          formula: "a \\cdot b + a \\cdot c = a \\cdot (b + c)",
          steps: [`$${a} \\cdot (${b} + \\square) = ${big(R)}$`, `$${b} + \\square = ${big(R)} : ${a} = ${S}$`, `$\\square = ${S} - ${b} = ${c}$`],
        });
      }
      const rows = r.int(12, 25);
      const seats = r.int(14, 24);
      const k = r.int(6, 12);
      const q = r.int(15, 25);
      const val = rows * seats - k * q;
      if (val <= 0) return this.gen(3, r);
      return T({
        text: `V dvorani je ${rows} vrst po ${seats} sedežev. Na predstavo pride ${k} šolskih skupin po ${q} učencev. Koliko sedežev ostane praznih?`,
        answer: num(val, null, null, [
          [rows * seats - q, `Skupin je ${k} – število učencev v skupini pomnoži s številom skupin.`],
          [rows * seats, "Od vseh sedežev odštej še zasedene."],
        ]),
        hint: "Zapiši izraz: vsi sedeži minus vsi učenci. Oboje je produkt.",
        given: [`\\text{vrste} = ${rows}`, `\\text{sedeži v vrsti} = ${seats}`, `\\text{skupine} = ${k}`, `\\text{učenci v skupini} = ${q}`],
        find: ["\\text{prazni sedeži}"],
        formula: "\\text{prazni} = \\text{vrste} \\cdot \\text{sedeži} - \\text{skupine} \\cdot \\text{učenci}",
        steps: [`Vsi sedeži: $${rows} \\cdot ${seats} = ${rows * seats}$`, `Vsi učenci: $${k} \\cdot ${q} = ${k * q}$`, `Prazni: $${rows * seats} - ${k * q} = ${val}$`],
      });
    },
  },
  {
    id: "dod-mat-os-veckratniki-delitelji",
    topics: ["MAT-OS-6/veckratniki-in-delitelji"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 72, 80, 84, 90, 96, 100]);
          const D = divisors(n);
          const pairs = D.filter((d) => d * d <= n).map((d) => `${d} \\cdot ${n / d}`);
          return T({
            text: r.pick([`Koliko deliteljev ima število $${n}$?`, `${name} išče vse delitelje števila $${n}$. Koliko jih najde?`, `Na koliko načinov lahko $${n}$ enakih kock razporedimo v enako velike skupine brez ostanka? (Štejemo tudi eno skupino in skupine po eno kocko.)`]),
            answer: num(D.length, null, null, [
              [D.length - 2, "Tudi 1 in število samo sta delitelja."],
              [Math.ceil(D.length / 2), "Vsak par zmnožka da dva delitelja."],
            ]),
            hint: "Delitelje išči v parih: 1 in število samo, nato 2 in …, 3 in … ",
            given: [`n = ${n}`],
            find: ["\\text{število deliteljev}"],
            formula: "d \\mid n \\iff n : d \\text{ nima ostanka}",
            steps: [`Pari: $${pairs.join(",\\ ")}$`, `$D(${n}) = \\{${D.join(", ")}\\}$`, `Deliteljev je ${D.length}.`],
          });
        }
        if (t === 1) {
          const a = r.int(3, 15);
          const k = r.int(4, 12);
          return T({
            text: r.pick([`Kateri je ${k}. večkratnik števila $${a}$?`, `${name} šteje po ${a}: ${a}, ${2 * a}, ${3 * a}, … Katero število pove kot ${k}.?`]),
            answer: num(k * a, null, null, [
              [(k - 1) * a, `Prvi večkratnik je $${a} \\cdot 1 = ${a}$, zato je ${k}. večkratnik $${a} \\cdot ${k}$.`],
              [a + k, "Večkratnik dobiš z množenjem, ne s seštevanjem."],
            ]),
            hint: `Večkratnike števila ${a} dobiš, če ga množiš z 1, 2, 3, …`,
            given: [`a = ${a}`, `k = ${k}`],
            find: [`\\text{${k}. večkratnik}`],
            formula: "\\text{k-ti večkratnik} = k \\cdot a",
            steps: [`Večkratniki: $${range(1, 3).map((i) => i * a).join(", ")}, \\ldots$`, `${k}. večkratnik: $${k} \\cdot ${a} = ${k * a}$`],
          });
        }
        const b = r.pick([2, 3, 4, 5, 10]);
        const e = b === 10 ? r.int(3, 6) : b === 2 ? r.int(4, 8) : r.int(2, 4);
        const val = b ** e;
        const prod = Array(e).fill(b).join(" \\cdot ");
        return T({
          text: `Zapiši produkt $${prod}$ kot potenco in izračunaj njegovo vrednost.`,
          answer: num(val, null, null, [
            [b * e, "Potenca ni produkt osnove in eksponenta – osnovo množiš samo s sabo."],
            [b ** (e - 1), "Preštej, kolikokrat nastopa faktor."],
          ]),
          hint: "Preštej enake faktorje: to je eksponent. Osnova je faktor, ki se ponavlja.",
          given: [`\\text{produkt} = ${prod}`],
          find: ["\\text{vrednost potence}"],
          formula: "a^n = \\underbrace{a \\cdot a \\cdot \\ldots \\cdot a}_{n}",
          steps: [`Faktor ${b} nastopa ${e}-krat: $${prod} = ${b}^{${e}}$`, `$${b}^{${e}} = ${big(val)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t < 2) {
          let gg, m, n;
          do {
            gg = r.int(2, t === 0 ? 12 : 6);
            m = r.int(2, 9);
            n = r.int(2, 9);
          } while (m === n || gcd(m, n) !== 1);
          const a = gg * m;
          const b = gg * n;
          if (t === 0) {
            const Da = divisors(a);
            const common = Da.filter((d) => b % d === 0);
            const smaller = common.length > 2 ? common[common.length - 2] : 1;
            return T({
              text: `Poišči največji skupni delitelj števil $${a}$ in $${b}$.`,
              answer: num(gg, null, null, [
                [smaller, "To je skupni delitelj, ni pa največji."],
                [Math.min(a, b), "Manjše število ne deli večjega."],
              ]),
              hint: "Zapiši delitelje obeh števil in poišči največjega, ki je v obeh seznamih.",
              given: [`a = ${a}`, `b = ${b}`],
              find: [`D(${a}, ${b})`],
              formula: "D(a, b) = \\text{največje število, ki deli } a \\text{ in } b",
              steps: [`$D(${a}) = \\{${Da.join(", ")}\\}$`, `$D(${b}) = \\{${divisors(b).join(", ")}\\}$`, `Skupni: $\\{${common.join(", ")}\\}$, največji je $${gg}$.`],
            });
          }
          const v = gg * m * n;
          const big2 = Math.max(a, b);
          const mults = range(1, v / big2).map((i) => i * big2);
          return T({
            text: `Poišči najmanjši skupni večkratnik števil $${a}$ in $${b}$.`,
            answer: num(v, null, null, [[a * b, "Produkt je skupni večkratnik, ni pa nujno najmanjši."]]),
            hint: `Naštevaj večkratnike večjega števila (${big2}) in preveri, ali so deljivi z manjšim.`,
            given: [`a = ${a}`, `b = ${b}`],
            find: [`v(${a}, ${b})`],
            formula: "v(a, b) = \\text{najmanjše število, deljivo z } a \\text{ in } b",
            steps: [`Večkratniki ${big2}: $${mults.join(", ")}$`, `Prvi, ki je deljiv z ${Math.min(a, b)}, je $${v}$.`, `$v(${a}, ${b}) = ${v}$`],
          });
        }
        const [b1, b2] = r.pick([
          [2, 5],
          [2, 3],
          [3, 5],
          [2, 7],
        ]);
        const e1 = r.int(2, 4);
        const e2 = r.int(1, 3);
        const val = b1 ** e1 * b2 ** e2;
        return T({
          text: `Izračunaj: $${b1}^{${e1}} \\cdot ${b2}^{${e2}}$`,
          answer: num(val, null, null, [
            [b1 * e1 * b2 * e2, "Potenca ni produkt osnove in eksponenta."],
            [(b1 * b2) ** (e1 + e2), "Potenci imata različni osnovi, zato eksponentov ne smeš sešteti."],
          ]),
          hint: "Vsako potenco izračunaj posebej, nato ju zmnoži.",
          given: [`\\text{izraz} = ${b1}^{${e1}} \\cdot ${b2}^{${e2}}`],
          find: ["\\text{vrednost}"],
          formula: "a^n = \\underbrace{a \\cdot a \\cdot \\ldots \\cdot a}_{n}",
          steps: [`$${b1}^{${e1}} = ${b1 ** e1}$, $${b2}^{${e2}} = ${b2 ** e2}$`, `$${b1 ** e1} \\cdot ${b2 ** e2} = ${val}$`],
        });
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        let a, b;
        do {
          a = r.int(4, 20);
          b = r.int(4, 20);
        } while (a === b || gcd(a, b) === 1 || a % b === 0 || b % a === 0);
        const v = lcm(a, b);
        const [ctx, unit, what] = r.pick([
          [`Z avtobusne postaje odpelje avtobus št. 1 vsakih ${a} minut, avtobus št. 2 pa vsakih ${b} minut. Ob 7.00 odpeljeta hkrati. Čez koliko minut bosta spet odpeljala hkrati?`, "min", "minut"],
          [`Dve lučki na novoletni jelki utripata: prva vsakih ${a} sekund, druga vsakih ${b} sekund. Pravkar sta utripnili skupaj. Čez koliko sekund bosta spet utripnili hkrati?`, "s", "sekund"],
          [`${name} prevozi krog na kolesarski stezi v ${a} minutah, prijatelj pa v ${b} minutah. Hkrati začneta na startu. Čez koliko minut bosta spet hkrati na startu?`, "min", "minut"],
        ]);
        return T({
          text: ctx,
          answer: num(v, unit, null, [
            [a * b, "Produkt je skupni večkratnik, iščemo pa najmanjšega."],
            [gcd(a, b), "Iščemo skupni večkratnik, ne delitelj."],
          ]),
          hint: `Dogodka se ponovita hkrati ob skupnih večkratnikih števil ${a} in ${b}. Kateri je najmanjši?`,
          given: [dat("t_1", a, unit), dat("t_2", b, unit)],
          find: [`v(${a}, ${b})`],
          formula: "v(a, b) = \\text{najmanjši skupni večkratnik}",
          steps: [
            `Večkratniki ${Math.max(a, b)}: $${range(1, v / Math.max(a, b)).map((i) => i * Math.max(a, b)).join(", ")}$`,
            `Prvi, ki je deljiv tudi z ${Math.min(a, b)}: $v(${a}, ${b}) = ${v}$`,
            `Spet hkrati čez ${v} ${what}.`,
          ],
        });
      }
      let gg, m, n;
      do {
        gg = r.int(3, 15);
        m = r.int(2, 8);
        n = r.int(2, 8);
      } while (m === n || gcd(m, n) !== 1);
      const a = gg * m;
      const b = gg * n;
      if (t === 1) {
        const askCount = r.next() < 0.5;
        return T({
          text: `${name} ima dva traka, dolga $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Razreže ju na enako dolge, čim daljše kose brez ostanka. ${askCount ? "Koliko kosov dobi skupaj?" : "Kako dolg je en kos v cm?"}`,
          answer: askCount
            ? num(m + n, null, null, [
                [gg, "To je dolžina enega kosa – vprašanje je število kosov."],
                [(a + b) / 2, "Dolžina kosa je največji skupni delitelj obeh dolžin."],
              ])
            : num(gg, "cm", null, [[v1(a, b), "Kos mora biti čim daljši – iščemo največji skupni delitelj."], [Math.min(a, b), "Kos mora meriti enako na obeh trakovih brez ostanka."]]),
          hint: "Dolžina kosa mora deliti obe dolžini in biti čim večja: to je največji skupni delitelj.",
          given: [dat("a", a, "cm"), dat("b", b, "cm")],
          find: [askCount ? "\\text{število kosov}" : "\\text{dolžina kosa}"],
          formula: "D(a, b) = \\text{največji skupni delitelj}",
          steps: [`$D(${a}, ${b}) = ${gg}$, en kos meri $${gg}\\ \\mathrm{cm}$.`, ...(askCount ? [`Kosov: $${a} : ${gg} + ${b} : ${gg} = ${m} + ${n} = ${m + n}$`] : [`Kos meri $${gg}\\ \\mathrm{cm}$.`])],
        });
      }
      if (t === 2) {
        return T({
          text: `Učiteljica ima ${a} bombonov in ${b} lizik. Razdeliti jih želi v čim več enakih paketov, tako da porabi vse. Koliko lizik bo v enem paketu?`,
          answer: num(n, null, null, [
            [gg, "To je število paketov – vprašanje je, koliko lizik je v enem paketu."],
            [m, "To je število bombonov v paketu."],
          ]),
          hint: "Število paketov mora deliti obe števili in biti čim večje.",
          given: [`\\text{bomboni} = ${a}`, `\\text{lizike} = ${b}`],
          find: ["\\text{lizike v paketu}"],
          formula: "\\text{število paketov} = D(a, b)",
          steps: [`Paketov je $D(${a}, ${b}) = ${gg}$.`, `Lizik v paketu: $${b} : ${gg} = ${n}$`],
        });
      }
      let x, y;
      do {
        x = r.int(3, 15);
        y = r.int(3, 15);
      } while (x === y || gcd(x, y) === 1 || x % y === 0 || y % x === 0 || lcm(x, y) > 99);
      const v = lcm(x, y);
      const ans = Math.ceil(100 / v) * v;
      return T({
        text: `Katero je najmanjše trimestno število, ki je deljivo z $${x}$ in z $${y}$?`,
        answer: num(ans, null, null, [
          [Math.ceil(100 / (x * y)) * x * y, `Število, deljivo z ${x} in ${y}, je večkratnik njunega najmanjšega skupnega večkratnika, ne nujno produkta.`],
          [v, "Rezultat mora biti trimesten."],
        ]),
        hint: `Najprej poišči $v(${x}, ${y})$, nato njegov prvi trimestni večkratnik.`,
        given: [`a = ${x}`, `b = ${y}`],
        find: ["\\text{najmanjše trimestno število}"],
        formula: "\\text{deljivo z } a \\text{ in } b \\iff \\text{deljivo z } v(a, b)",
        steps: [`$v(${x}, ${y}) = ${v}$`, `Večkratniki ${v}: $\\ldots, ${ans - v}, ${ans}, \\ldots$`, `Najmanjše trimestno je $${ans}$.`],
      });
    },
  },
  {
    id: "dod-mat-os-ulomek-del-celote",
    topics: ["MAT-OS-6/ulomek-kot-del-celote"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const FORM = "\\text{del} = \\dfrac{\\text{število izbranih delov}}{\\text{število vseh enakih delov}}";
      if (level === 1) {
        const d = r.int(3, 12);
        const n = r.pick(coprimes(d, 1, d - 1));
        const rest = r.next() < 0.4;
        const k = rest ? d - n : n;
        const text = r.pick([
          `${name} razreže pico na ${d} enakih kosov in poje ${nOf(n, "kos", "kosa", "kose", "kosov")}. Kolikšen del pice ${rest ? "ostane" : g(name, "je pojedel", "je pojedla")}?`,
          `Vrt je razdeljen na ${d} enakih gredic. Solata raste na ${n} od ${d} gredic. Kolikšen del vrta ${rest ? "je brez solate" : "je posajen s solato"}?`,
          `Krog je razdeljen na ${d} enakih izsekov, ${nOf(n, "izsek je pobarvan", "izseka sta pobarvana", "izseki so pobarvani", "izsekov je pobarvanih")}. Kolikšen del kroga ${rest ? "ni pobarvan" : "je pobarvan"}?`,
          `Čokolada ima ${d} enakih koščkov. ${name} ${g(name, "je pojedel", "je pojedla")} ${nOf(n, "košček", "koščka", "koščke", "koščkov")}. Kolikšen del čokolade ${rest ? "je ostal" : g(name, "je pojedel", "je pojedla")}?`,
        ]);
        return T({
          text: `${text} Zapiši z ulomkom.`,
          answer: frac(k, d),
          hint: "Imenovalec pove, na koliko enakih delov je razdeljena celota, števec pa, koliko teh delov štejemo.",
          given: [`\\text{vseh enakih delov} = ${d}`, `\\text{${rest ? "porabljenih" : "izbranih"} delov} = ${n}`],
          find: ["\\text{del celote}"],
          formula: FORM,
          steps: [
            `Celota je razdeljena na ${d} enakih delov, en del je $${fr(1, d)}$ celote.`,
            rest ? `Ostane $${d} - ${n} = ${k}$ delov.` : `Štejemo ${n} od ${d} delov.`,
            `Del celote: $${fr(k, d)}$`,
          ],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const d = r.int(2, 10);
          const k = r.pick(coprimes(d, 1, 2 * d - 1).filter((x) => x !== 1 || d > 2));
          const P = r.pick(["A", "B", "T", "M"]);
          const over = k > d;
          return T({
            text: `Na številski premici je daljica od 0 do 1 razdeljena na ${d} enakih delov${over ? ", enako razdeljena je tudi daljica od 1 do 2" : ""}. Točka ${P} leži na ${k}. delilni črtici desno od 0. Kateri ulomek ji pripada?`,
            answer: frac(k, d),
            hint: `Enota (od 0 do 1) je razdeljena na ${d} enakih delov, zato en razmik meri $${fr(1, d)}$.`,
            given: [`\\text{število delov} = ${d}`, `\\text{zaporedna črtica} = ${k}`],
            find: [`${P}`],
            formula: "\\text{en razmik} = \\dfrac{1}{\\text{število delov enote}}",
            steps: [
              `En razmik meri $${fr(1, d)}$.`,
              `${P} je ${k} razmikov od 0: $${k} \\cdot ${fr(1, d)} = ${fr(k, d)}$`,
              ...(over ? [`To je več kot 1: $${fr(k, d)} = ${Math.floor(k / d)}\\,${fr(k % d, d)}$`] : []),
            ],
          });
        }
        const d = r.int(3, 10);
        const n = r.pick(coprimes(d, 2, d - 1));
        const [text, unit, q] = (() => {
          const t = r.int(0, 3);
          if (t === 0) {
            const q2 = r.int(3, 14);
            return [`Na šolskem tekmovanju je ${d * q2} učencev. $${fr(n, d)}$ jih je iz šestega razreda. Koliko učencev je iz šestega razreda?`, null, q2];
          }
          if (t === 1) {
            const q2 = r.int(2, 12);
            return [`Pot do babice je dolga $${d * q2}\\ \\mathrm{km}$. ${name} je ${g(name, "prevozil", "prevozila")} $${fr(n, d)}$ poti. Koliko kilometrov je ${g(name, "prevozil", "prevozila")}?`, "km", q2];
          }
          if (t === 2) {
            const q2 = r.int(2, 9);
            return [`${name} ima $${d * q2}$ € prihrankov. Za knjigo porabi $${fr(n, d)}$ denarja. Koliko evrov stane knjiga?`, "€", q2];
          }
          const q2 = r.int(5, 30);
          return [`Knjiga ima ${d * q2} strani. ${name} je ${g(name, "prebral", "prebrala")} $${fr(n, d)}$ knjige. Koliko strani je ${g(name, "prebral", "prebrala")}?`, null, q2];
        })();
        const X = d * q;
        return T({
          text,
          answer: num(n * q, unit, null, [
            [q, "To je šele en del – pomnoži ga še s števcem."],
            [X - n * q, "To je preostanek, ne iskani del."],
          ]),
          hint: "Celoto razdeli na toliko enakih delov, kot pove imenovalec, nato vzemi toliko delov, kot pove števec.",
          given: [`\\text{celota} = ${unit ? qty(X, unit === "€" ? EUR : unit) : X}`, `\\text{del} = ${fr(n, d)}`],
          find: [`${fr(n, d)} \\text{ celote}`],
          formula: "\\dfrac{n}{d} \\text{ od } X = X : d \\cdot n",
          steps: [`En del: $${X} : ${d} = ${q}$`, `${n} delov: $${q} \\cdot ${n} = ${n * q}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        let d, a, b;
        do {
          d = r.int(5, 12);
          a = r.int(1, d - 2);
          b = r.int(1, d - 1 - a);
        } while (gcd(a, d) !== 1 || gcd(b, d) !== 1 || gcd(d - a - b, d) !== 1 || a === b);
        const [A, B] = name2(r);
        return T({
          text: `${A} in ${B} si delita torto, razrezano na ${d} enakih kosov. ${A} poje $${fr(a, d)}$ torte, ${B} pa $${fr(b, d)}$ torte. Kolikšen del torte ostane? Zapiši z ulomkom.`,
          answer: frac(d - a - b, d),
          hint: `Cela torta je $${fr(d, d)}$. Najprej seštej, koliko sta pojedla skupaj.`,
          given: [`\\text{${A}: } ${fr(a, d)}`, `\\text{${B}: } ${fr(b, d)}`],
          find: ["\\text{ostanek torte}"],
          formula: `1 = ${fr(d, d)}`,
          steps: [`Skupaj pojesta $${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}$.`, `Ostane $${fr(d, d)} - ${fr(a + b, d)} = ${fr(d - a - b, d)}$.`],
        });
      }
      if (t === 1) {
        const d = r.int(3, 8);
        const k = r.int(5, 12);
        const went = r.next() < 0.5;
        const ans = went ? d * k - k : d * k;
        return T({
          text: `Na šolski izlet ni šlo ${k} učencev, kar je $${fr(1, d)}$ vseh šestošolcev. ${went ? "Koliko šestošolcev je šlo na izlet?" : "Koliko je vseh šestošolcev?"}`,
          answer: num(ans, null, null, [
            went ? [d * k, "To so vsi šestošolci – odštej še tiste, ki niso šli."] : [d * k - k, "To so tisti, ki so šli – iščemo vse."],
            [d + k, `Če je $${fr(1, d)}$ celote ${k} učencev, je cela ${d}-krat večja.`],
          ]),
          hint: `$${fr(1, d)}$ pomeni en del od ${d} enakih delov. Če en del šteje ${k} učencev, koliko jih štejejo vsi deli?`,
          given: [`${fr(1, d)} \\text{ vseh} = ${k}`],
          find: [went ? "\\text{učenci na izletu}" : "\\text{vsi učenci}"],
          formula: "\\text{celota} = \\text{en del} \\cdot \\text{število delov}",
          steps: [`Vseh šestošolcev: $${k} \\cdot ${d} = ${d * k}$`, ...(went ? [`Na izlet jih je šlo: $${d * k} - ${k} = ${ans}$`] : [])],
        });
      }
      const d = r.int(2, 9);
      const k = r.pick(coprimes(d, 1, d - 1));
      const w = r.int(1, 4);
      return T({
        text: `Na številski premici je daljica med ${w} in ${w + 1} razdeljena na ${d} enakih delov. Točka B leži na ${k}. delilni črtici desno od ${w}. Kateri ulomek ji pripada? Zapiši ga kot nepravi ulomek ali mešano število.`,
        answer: frac(w * d + k, d),
        hint: `Do točke ${w} je ${w} celih, nato še ${k} razmikov po $${fr(1, d)}$.`,
        given: [`\\text{začetek} = ${w}`, `\\text{število delov} = ${d}`, `\\text{zaporedna črtica} = ${k}`],
        find: ["B"],
        formula: "\\text{mešano število} = \\text{cela} + \\text{ulomek}",
        steps: [`$B = ${w} + ${k} \\cdot ${fr(1, d)} = ${w} + ${fr(k, d)}$`, `$B = ${w}\\,${fr(k, d)} = ${fr(w * d + k, d)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-geometrijski-pojmi",
    topics: ["MAT-OS-6/osnovni-geometrijski-pojmi"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.4) {
          const LINES = [
            ["premica", "je ravna in nima ne začetka ne konca", "Premica nima nobenega krajišča."],
            ["poltrak", "je ravna, ima začetno točko, na drugi strani pa se neomejeno nadaljuje", "Poltrak ima natanko eno krajišče – začetno točko."],
            ["daljica", "je ravna in ima dve krajišči", "Daljica ima dve krajišči."],
            ["lomljenka", "je sestavljena iz več daljic, ki se stikajo v krajiščih", "Lomljenka ni ravna – sestavljena je iz več daljic."],
          ];
          const [ans, desc] = r.pick(LINES);
          return T({
            text: `Kako imenujemo črto, ki ${desc}?`,
            given: [`\\text{lastnost} = \\text{${desc}}`],
            answer: choice(
              r,
              ans,
              LINES.filter((l) => l[0] !== ans).map((l) => [l[0], l[2]]),
            ),
            hint: "Preštej krajišča: premica nima nobenega, poltrak ima eno, daljica dve.",
            find: ["\\text{ime črte}"],
            formula: "\\text{premica: 0 krajišč},\\ \\text{poltrak: 1},\\ \\text{daljica: 2}",
            steps: [`Opis: črta ${desc}.`, `To je ${ans}.`],
          });
        }
        const road = r.next() < 0.4;
        const x = road ? r.int(12, 90) * 10 : r.dec(1.5, 8, 1);
        const y = road ? r.int(12, 90) * 10 : r.dec(1.5, 8, 1);
        const u = road ? "m" : "cm";
        return T({
          text: road
            ? `Ob ravni cesti stojijo zaporedoma šola, trgovina in pošta. Od šole do trgovine je $${x}\\ \\mathrm{m}$, od trgovine do pošte pa $${y}\\ \\mathrm{m}$. Koliko metrov je od šole do pošte?`
            : `Točke A, B in C ležijo na premici v tem vrstnem redu. Velja $|AB| = ${tx(x)}\\ \\mathrm{cm}$ in $|BC| = ${tx(y)}\\ \\mathrm{cm}$. Koliko cm meri daljica AC?`,
          answer: num(x + y, u, null, [[Math.abs(x - y), "Srednja točka leži med drugima dvema, zato dolžini seštejemo."]]),
          hint: "Nariši skico: srednja točka razdeli dolgo daljico na dva dela.",
          given: road ? [dat("\\text{šola–trgovina}", x, u), dat("\\text{trgovina–pošta}", y, u)] : [dat("|AB|", tx(x), u), dat("|BC|", tx(y), u)],
          find: [road ? "\\text{šola–pošta}" : "|AC|"],
          formula: road ? "\\text{šola–pošta} = \\text{šola–trgovina} + \\text{trgovina–pošta}" : "|AC| = |AB| + |BC|",
          steps: road
            ? ["Trgovina leži med šolo in pošto, zato razdalji seštejemo.", `$${x} + ${y} = ${qty(x + y, u)}$`]
            : [`B leži med A in C, zato $|AC| = |AB| + |BC|$.`, `$|AC| = ${tx(x)} + ${tx(y)} = ${qty(tx(x + y), u)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const x = r.dec(1.2, 7.5, 1);
          const ans = Math.round(20 * x);
          return T({
            text: r.pick([
              `Točka S je razpolovišče daljice AB. Daljica AS meri $${tx(x)}\\ \\mathrm{cm}$. Koliko milimetrov meri daljica AB?`,
              `${name} je ${g(name, "označil", "označila")} razpolovišče S daljice AB. Izmeri, da je $|SB| = ${tx(x)}\\ \\mathrm{cm}$. Koliko milimetrov meri daljica AB?`,
            ]),
            answer: num(ans, "mm", null, [
              [Math.round(10 * x), "S je razpolovišče – daljica AB je dvakrat daljša od polovice."],
              [2 * x, "Rezultat zapiši v milimetrih."],
            ]),
            hint: "Razpolovišče razdeli daljico na dva enaka dela. Nato pretvori: 1 cm = 10 mm.",
            given: [dat("|AS|", tx(x), "cm")],
            find: ["|AB| \\text{ v mm}"],
            formula: ["|AB| = 2 \\cdot |AS|", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
            steps: [`$|AB| = 2 \\cdot ${tx(x)}\\ \\mathrm{cm} = ${qty(tx(2 * x), "cm")}$`, `$${tx(2 * x)}\\ \\mathrm{cm} = ${qty(ans, "mm")}$`],
          });
        }
        if (t === 1) {
          const x = r.int(6, 15);
          const y = r.int(15, 10 * x - 10);
          const ans = 10 * x - y;
          return T({
            text: `Točke A, B in C ležijo na premici v tem vrstnem redu. Velja $|AC| = ${x}\\ \\mathrm{cm}$ in $|AB| = ${y}\\ \\mathrm{mm}$. Koliko milimetrov meri daljica BC?`,
            answer: num(ans, "mm", null, [
              [10 * x + y, "B leži med A in C – od celotne dolžine odštej del AB."],
              [x - y > 0 ? x - y : NaN, "Najprej pretvori obe dolžini v iste enote."],
            ]),
            hint: "Najprej pretvori |AC| v milimetre, nato odštej |AB|.",
            given: [dat("|AC|", x, "cm"), dat("|AB|", y, "mm")],
            find: ["|BC| \\text{ v mm}"],
            formula: ["|BC| = |AC| - |AB|", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
            steps: [`$|AC| = ${x}\\ \\mathrm{cm} = ${qty(10 * x, "mm")}$`, `$|BC| = ${10 * x} - ${y} = ${qty(ans, "mm")}$`],
          });
        }
        const [a, b, c] = r.pick([
          ["a", "b", "c"],
          ["p", "q", "s"],
          ["k", "l", "m"],
        ]);
        const kase = r.int(0, 2);
        const rel1 = kase === 2 ? "\\parallel" : kase === 1 ? "\\parallel" : "\\perp";
        const rel2 = kase === 2 ? "\\parallel" : "\\perp";
        const VZ = `${a} in ${c} sta vzporedni`;
        const PR = `${a} in ${c} sta pravokotni`;
        const SE = `${a} in ${c} se sekata, a ne pod pravim kotom`;
        const correct = kase === 1 ? PR : VZ;
        const WHY = [
          { [PR]: `Dve premici, ki sta pravokotni na isto premico, sta med seboj vzporedni – nariši skico.`, [SE]: `Če bi se ${a} in ${c} sekali, ne bi mogli biti obe pravokotni na ${b}.` },
          { [VZ]: `${c} je pravokotna na ${b}, ${a} pa ima isto smer kot ${b}.`, [SE]: `${a} ima isto smer kot ${b}, zato je kot med ${a} in ${c} enak kotu med ${b} in ${c}.` },
          { [PR]: `Vzporednost se prenaša: če je ${a} vzporedna z ${b} in ${b} z ${c}, sta vzporedni tudi ${a} in ${c}.`, [SE]: `Vse tri premice imajo isto smer, zato se ne sekajo.` },
        ][kase];
        return T({
          text: `Premice ${a}, ${b} in ${c} ležijo v isti ravnini in so različne. Velja $${a} ${rel1} ${b}$ in $${b} ${rel2} ${c}$. Kakšni sta premici ${a} in ${c}?`,
          answer: choice(
            r,
            correct,
            [VZ, PR, SE].filter((o) => o !== correct).map((o) => [o, WHY[o]]),
          ),
          hint: "Nariši premico b in nato ostali dve premici po navodilu.",
          given: [`\\text{1. zveza} = ${a} ${rel1} ${b}`, `\\text{2. zveza} = ${b} ${rel2} ${c}`],
          find: [`\\text{lega premic } ${a} \\text{ in } ${c}`],
          formula: "\\parallel\\ \\text{vzporedni},\\quad \\perp\\ \\text{pravokotni}",
          steps: [
            kase === 0 ? `${a} in ${c} sta obe pravokotni na ${b}, zato imata isto smer.` : kase === 1 ? `${a} ima isto smer kot ${b}, ${c} pa je pravokotna na ${b}.` : `Vse tri premice imajo isto smer.`,
            `Torej: ${correct}.`,
          ],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t < 2) {
        const n = r.int(4, 9);
        const ans = (n * (n - 1)) / 2;
        const text =
          t === 0
            ? r.pick([
                `Na premici je ${n} različnih točk. Koliko daljic s krajišči v teh točkah je narisanih na premici?`,
                `Ob ravni progi je ${n} postaj. Za vsak par postaj natisnejo eno vrsto vozovnice, ki velja v obe smeri. Koliko vrst vozovnic natisnejo?`,
              ])
            : r.pick([
                `Na listu je ${n} točk, od katerih nobene tri ne ležijo na isti premici. Koliko različnih premic lahko narišemo skozi po dve od teh točk?`,
                `${name} na tablo nariše ${n} točk, nobene tri niso na isti premici. Vsak par točk poveže s premico. Koliko premic nariše?`,
              ]);
        return T({
          text,
          answer: num(ans, null, null, [
            [n * (n - 1), "Vsak par si štel dvakrat (AB in BA je isto)."],
            [n - 1, "Šteti moraš vse pare točk, ne le sosednjih."],
          ]),
          hint: "Iz vsake točke gre povezava do vsake druge točke. Pazi, da nobene povezave ne šteješ dvakrat.",
          given: [`n = ${n} \\text{ točk}`],
          find: [t === 0 ? "\\text{število daljic}" : "\\text{število premic}"],
          formula: "\\text{število parov} = \\dfrac{n \\cdot (n - 1)}{2}",
          steps: [`Iz vsake točke gre ${n - 1} povezav: $${n} \\cdot ${n - 1} = ${n * (n - 1)}$`, `Vsako povezavo smo šteli dvakrat: $${n * (n - 1)} : 2 = ${ans}$`],
        });
      }
      const y = r.dec(1.5, 4.5, 1);
      const x = roundHalfUp(2 * y + r.dec(1, 6, 1), 1);
      const ans = roundHalfUp(x - 2 * y, 1);
      return T({
        text: `Točke A, B, C in D ležijo na premici v tem vrstnem redu. Daljica AD meri $${tx(x)}\\ \\mathrm{cm}$, daljici AB in CD pa merita vsaka $${tx(y)}\\ \\mathrm{cm}$. Koliko cm meri daljica BC?`,
        answer: num(ans, "cm", 1, [
          [x - y, "Odšteti moraš obe daljici, AB in CD."],
          [x + 2 * y, "BC je del daljice AD – odštevaj."],
        ]),
        hint: "Nariši skico: AD je sestavljena iz AB, BC in CD.",
        given: [dat("|AD|", tx(x), "cm"), dat("|AB| = |CD|", tx(y), "cm")],
        find: ["|BC|"],
        formula: "|AD| = |AB| + |BC| + |CD|",
        steps: [`$|BC| = |AD| - |AB| - |CD|$`, `$|BC| = ${tx(x)} - ${tx(y)} - ${tx(y)} = ${qty(tx(ans, 1), "cm")}$`],
      });
    },
  },
  {
    id: "dod-mat-os-kot",
    topics: ["MAT-OS-6/kot"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.55) {
          const ci = r.pick([0, 0, 1, 2, 2, 3, 4, 4]);
          const a = [r.int(5, 89), 90, r.int(91, 179), 180, r.int(181, 359)][ci];
          const correct = KOTI[ci];
          const others = r.shuffle(KOTI.filter((k) => k !== correct)).slice(0, 3);
          return T({
            text: r.pick([
              `Kot meri $${deg(a)}$. Kakšne vrste je ta kot?`,
              `${name} je s kotomerom ${g(name, "izmeril", "izmerila")} kot $${deg(a)}$. Kako se imenuje tak kot?`,
              `Kot $\\alpha = ${deg(a)}$. Katera vrsta kota je to?`,
            ]),
            answer: choice(
              r,
              correct,
              others.map((o) => [o, KOT_WHY[o]]),
            ),
            hint: "Primerjaj kot s pravim (90°), iztegnjenim (180°) in polnim kotom (360°).",
            given: [`\\alpha = ${deg(a)}`],
            find: ["\\text{vrsta kota}"],
            formula: "\\text{ostri} < 90^\\circ < \\text{topi} < 180^\\circ < \\text{izbočeni} < 360^\\circ",
            steps: [`Primerjamo: ${KOT_WHY[correct]}`, `$${deg(a)}$ je ${correct}.`],
          });
        }
        const BASE = [
          [90, "pravega"],
          [180, "iztegnjenega"],
          [360, "polnega"],
        ];
        const PART = [
          [2, "polovica"],
          [3, "tretjina"],
          [4, "četrtina"],
          [5, "petina"],
          [6, "šestina"],
        ];
        let bb, pp;
        do {
          bb = r.pick(BASE);
          pp = r.pick(PART);
        } while (bb[0] % pp[0] !== 0);
        const ans = bb[0] / pp[0];
        return T({
          text: `Koliko stopinj meri ${pp[1]} ${bb[1]} kota?`,
          answer: num(
            ans,
            "°",
            null,
            BASE.filter((x) => x !== bb).map((x) => [x[0] / pp[0], "Pravi kot meri 90°, iztegnjeni 180°, polni 360°."]),
          ),
          hint: `Najprej zapiši, koliko stopinj meri ${bb[1].replace(/ega$/, "i")} kot.`,
          given: [`\\text{osnova} = \\text{${bb[1].replace(/ega$/, "i")} kot}`],
          find: [`\\text{${pp[1]}}`],
          formula: "\\text{pravi} = 90^\\circ,\\ \\text{iztegnjeni} = 180^\\circ,\\ \\text{polni} = 360^\\circ",
          steps: [`${bb[1].replace(/ega$/, "i")[0].toUpperCase()}${bb[1].replace(/ega$/, "i").slice(1)} kot meri $${bb[0]}^\\circ$.`, `$${bb[0]}^\\circ : ${pp[0]} = ${deg(ans)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const h = r.int(1, 11);
          const ans = Math.min(30 * h, 360 - 30 * h);
          return T({
            text: `Koliko stopinj meri manjši kot med urnim in minutnim kazalcem ob ${h}.00?`,
            answer: num(ans, "°", null, [
              [6 * h, "Med sosednjima številkama na številčnici je 30°, ne 6°."],
              [Math.max(30 * h, 360 - 30 * h), "Iščemo manjši od obeh kotov med kazalcema."],
            ]),
            hint: "Številčnica je razdeljena na 12 enakih delov. Koliko stopinj meri en del?",
            given: [`\\text{ura} = ${h}.00`],
            find: ["\\text{manjši kot med kazalcema}"],
            formula: "360^\\circ : 12 = 30^\\circ",
            steps: [`Med sosednjima številkama je $360^\\circ : 12 = 30^\\circ$.`, `Minutni kazalec kaže 12, urni ${h}: $${h} \\cdot 30^\\circ = ${deg(30 * h)}$`, ...(30 * h > 180 ? [`Manjši kot: $360^\\circ - ${deg(30 * h)} = ${deg(ans)}$`] : [])],
          });
        }
        if (t === 1) {
          const minute = r.next() < 0.6;
          const m = minute ? r.int(1, 11) * 5 : r.int(2, 11);
          const ans = minute ? 6 * m : 30 * m;
          return T({
            text: minute ? `Za koliko stopinj se zavrti minutni kazalec v ${m} minutah?` : `Za koliko stopinj se zavrti urni kazalec v ${m} urah?`,
            answer: num(ans, "°", null, minute ? [[m, "V eni minuti se minutni kazalec zavrti za 6°."], [30 * m, "Minutni kazalec v 60 minutah opiše polni kot."]] : [[6 * m, "Urni kazalec v 12 urah opiše polni kot – v eni uri 30°."], [15 * m, "Urni kazalec v 12 urah (ne 24) opiše polni kot."]]),
            hint: minute ? "V 60 minutah minutni kazalec opiše polni kot (360°)." : "V 12 urah urni kazalec opiše polni kot (360°).",
            given: [minute ? `t = ${m}\\ \\mathrm{min}` : `t = ${m}\\ \\mathrm{h}`],
            find: ["\\text{kot zasuka}"],
            formula: minute ? "360^\\circ : 60 = 6^\\circ \\text{ na minuto}" : "360^\\circ : 12 = 30^\\circ \\text{ na uro}",
            steps: [minute ? "V eni minuti: $360^\\circ : 60 = 6^\\circ$" : "V eni uri: $360^\\circ : 12 = 30^\\circ$", `$${m} \\cdot ${minute ? 6 : 30}^\\circ = ${deg(ans)}$`],
          });
        }
        const kind = r.int(0, 2);
        const d = r.int(5, 85);
        const [base, bname, sign] = [
          [90, "pravega kota", 1],
          [180, "iztegnjenega kota", -1],
          [180, "iztegnjenega kota", 1],
        ][kind];
        const ans = base + sign * d;
        return T({
          text: `Kot $\\alpha$ je za $${deg(d)}$ ${sign > 0 ? "večji" : "manjši"} od ${bname}. Koliko meri kot $\\alpha$?`,
          answer: num(ans, "°", null, [
            [base - sign * d, sign > 0 ? "Kot je večji – prištej." : "Kot je manjši – odštej."],
            [d, `Izhajaj iz ${bname} (${base}°).`],
          ]),
          hint: `Zapiši, koliko meri ${bname.replace("ega kota", "i kot")}, nato ${sign > 0 ? "prištej" : "odštej"} razliko.`,
          given: [`\\text{osnova} = \\text{${bname.replace("ega kota", "i kot")}}`, `\\text{razlika} = ${deg(d)}`],
          find: ["\\alpha"],
          formula: `\\alpha = ${base}^\\circ ${sign > 0 ? "+" : "-"} d`,
          steps: [`$\\alpha = ${base}^\\circ ${sign > 0 ? "+" : "-"} ${deg(d)} = ${deg(ans)}$`, `To je ${kotVrsta(ans)}.`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const h = r.int(1, 11);
        const m = r.pick([10, 20, 30, 40, 50]);
        const H = 30 * h + m / 2;
        const M = 6 * m;
        const diff = Math.abs(H - M);
        const ans = Math.min(diff, 360 - diff);
        const nd = Math.abs(30 * h - M);
        return T({
          text: `Ura kaže ${h}.${m}. Koliko stopinj meri manjši kot med urnim in minutnim kazalcem?`,
          answer: num(ans, "°", null, [
            [Math.min(nd, 360 - nd), "Urni kazalec se med uro premika – v eni minuti za 0,5°."],
            [Math.max(diff, 360 - diff), "Iščemo manjši kot med kazalcema."],
          ]),
          hint: "Lego obeh kazalcev izrazi s kotom od številke 12. Urni kazalec se v eni minuti premakne za 0,5°.",
          given: [`\\text{ura} = ${h}.${m}`],
          find: ["\\text{manjši kot med kazalcema}"],
          formula: ["\\text{minutni: } 6^\\circ \\text{ na minuto}", "\\text{urni: } 30^\\circ \\text{ na uro},\\ 0{,}5^\\circ \\text{ na minuto}"],
          steps: [
            `Minutni kazalec: $${m} \\cdot 6^\\circ = ${deg(M)}$ od številke 12.`,
            `Urni kazalec: $${h} \\cdot 30^\\circ + ${m} \\cdot 0{,}5^\\circ = ${deg(H)}$ od številke 12.`,
            `Razlika: $|${tx(H)}^\\circ - ${tx(M)}^\\circ| = ${deg(diff)}$`,
            ...(diff > 180 ? [`Manjši kot: $360^\\circ - ${deg(diff)} = ${deg(ans)}$`] : []),
          ],
        });
      }
      if (t === 1) {
        const n = r.pick([5, 6, 8, 9, 10, 12]);
        const k = r.int(2, n - 1);
        const ans = (360 * k) / n;
        return T({
          text: `${name} razreže okroglo pico na ${n} enakih kosov in poje ${nOf(k, "kos", "kosa", "kose", "kosov")}. Kolikšen kot pri središču pice pripada delu, ki ga je ${g(name, "pojedel", "pojedla")}?`,
          answer: num(ans, "°", null, [
            [360 / n, "To je kot enega kosa – pomnoži ga s številom kosov."],
            [(180 * k) / n, "Cela pica pri središču tvori polni kot (360°)."],
          ]),
          hint: "Cela pica okoli središča tvori polni kot. Razdeli ga na enake dele.",
          given: [`n = ${n} \\text{ kosov}`, `k = ${k}`],
          find: ["\\text{kot}"],
          formula: "\\text{kot enega kosa} = 360^\\circ : n",
          steps: [`En kos: $360^\\circ : ${n} = ${deg(360 / n)}$`, `${k} kosov: $${k} \\cdot ${deg(360 / n)} = ${deg(ans)}$`],
        });
      }
      let S, k;
      do {
        S = r.pick([90, 180, 360]);
        k = r.int(2, 5);
      } while (S % (k + 1) !== 0);
      const b = S / (k + 1);
      const ans = k * b;
      const Sname = { 90: "pravi", 180: "iztegnjeni", 360: "polni" }[S];
      return T({
        text: `Kota $\\alpha$ in $\\beta$ skupaj tvorita ${Sname} kot. Kot $\\alpha$ je ${k}-krat večji od kota $\\beta$. Koliko meri kot $\\alpha$?`,
        answer: num(ans, "°", null, [
          [b, "To je kot β – iščemo α."],
          [S / k, `Skupaj je ${k + 1} enakih delov (${k} za α in 1 za β).`],
        ]),
        hint: `Kot β je en del, kot α je ${k} takih delov. Koliko je vseh delov?`,
        given: [`\\alpha + \\beta = \\text{${Sname} kot}`, `\\alpha = ${k} \\cdot \\beta`],
        find: ["\\alpha"],
        formula: [`\\text{${Sname} kot} = ${S}^\\circ`, "\\beta = \\dfrac{\\alpha + \\beta}{k + 1}"],
        steps: [`Vseh delov je $${k} + 1 = ${k + 1}$.`, `$\\beta = ${S}^\\circ : ${k + 1} = ${deg(b)}$`, `$\\alpha = ${k} \\cdot ${deg(b)} = ${deg(ans)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-krog-kroznica",
    topics: ["MAT-OS-6/krog-in-kroznica"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const toD = r.next() < 0.5;
        const x = r.next() < 0.5 ? r.int(2, 15) : r.dec(1.5, 9.5, 1);
        const ans = toD ? 2 * x : x / 2;
        return T({
          text: toD
            ? r.pick([
                `Krožnica ima polmer $r = ${tx(x)}\\ \\mathrm{cm}$. Koliko cm meri njen premer?`,
                `${name} razpre šestilo za $${tx(x)}\\ \\mathrm{cm}$ in nariše krožnico. Koliko cm meri premer te krožnice?`,
                `Kolo otroškega kolesa ima polmer $${tx(x)}\\ \\mathrm{cm}$. Koliko cm meri premer kolesa?`,
              ])
            : r.pick([
                `Krožnik ima premer $${tx(x)}\\ \\mathrm{cm}$. Koliko cm meri njegov polmer?`,
                `Premer krožnice je $d = ${tx(x)}\\ \\mathrm{cm}$. Koliko cm meri njen polmer?`,
                `Za koliko cm mora ${name} razpreti šestilo, da bo ${g(name, "narisal", "narisala")} krožnico s premerom $${tx(x)}\\ \\mathrm{cm}$?`,
              ]),
          answer: num(ans, "cm", null, [toD ? [x / 2, "Premer je dvakrat daljši od polmera."] : [2 * x, "Polmer je polovica premera."]]),
          hint: "Premer gre skozi središče in je sestavljen iz dveh polmerov.",
          given: [toD ? dat("r", tx(x), "cm") : dat("d", tx(x), "cm")],
          find: [toD ? "d" : "r"],
          formula: "d = 2 \\cdot r",
          steps: toD ? [`$d = 2 \\cdot r$`, `$d = 2 \\cdot ${tx(x)} = ${qty(tx(ans), "cm")}$`] : [`$r = d : 2$`, `$r = ${tx(x)} : 2 = ${qty(tx(ans), "cm")}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const d = r.int(3, 18);
          const ans = d * 5;
          return T({
            text: `Najdaljša tetiva krožnice meri $${d}\\ \\mathrm{cm}$. Koliko milimetrov meri polmer krožnice?`,
            answer: num(ans, "mm", null, [
              [d * 10, "Najdaljša tetiva je premer, ne polmer."],
              [d / 2, "Rezultat zapiši v milimetrih."],
            ]),
            hint: "Katera tetiva je najdaljša? Tista, ki gre skozi središče.",
            given: [dat("\\text{najdaljša tetiva}", d, "cm")],
            find: ["r \\text{ v mm}"],
            formula: ["\\text{najdaljša tetiva} = d = 2r", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
            steps: [`Najdaljša tetiva je premer: $d = ${qty(d, "cm")} = ${qty(10 * d, "mm")}$`, `$r = ${10 * d} : 2 = ${qty(ans, "mm")}$`],
          });
        }
        if (t === 1) {
          const rr = r.int(3, 9);
          const rel = r.int(0, 2);
          const OT = rel === 0 ? 10 * rr - r.int(3, 25) : rel === 1 ? 10 * rr : 10 * rr + r.int(3, 25);
          const IN = "znotraj kroga (ne na krožnici)";
          const ON = "na krožnici";
          const OUT = "zunaj kroga";
          const correct = [IN, ON, OUT][rel];
          const WHY = {
            [IN]: "Znotraj kroga so točke, ki so središču bližje, kot meri polmer.",
            [ON]: "Na krožnici ležijo le točke, ki so od središča oddaljene natanko za polmer.",
            [OUT]: "Razdaljo in polmer primerjaj v istih enotah (1 cm = 10 mm).",
          };
          return T({
            text: `Krožnica k ima središče O in polmer $${rr}\\ \\mathrm{cm}$. Točka T je od središča oddaljena $${OT}\\ \\mathrm{mm}$. Kje leži točka T?`,
            answer: choice(
              r,
              correct,
              [IN, ON, OUT].filter((o) => o !== correct).map((o) => [o, WHY[o]]),
            ),
            hint: "Polmer pretvori v milimetre in ga primerjaj z razdaljo $|OT|$.",
            given: [dat("r", rr, "cm"), dat("|OT|", OT, "mm")],
            find: ["\\text{lega točke } T"],
            formula: "|OT| < r:\\ \\text{znotraj},\\quad |OT| = r:\\ \\text{na krožnici},\\quad |OT| > r:\\ \\text{zunaj}",
            steps: [`$r = ${rr}\\ \\mathrm{cm} = ${qty(10 * rr, "mm")}$`, `$|OT| = ${OT}\\ \\mathrm{mm} ${rel === 0 ? "<" : rel === 1 ? "=" : ">"} ${10 * rr}\\ \\mathrm{mm}$`, `Točka T leži ${correct}.`],
          });
        }
        const d1 = 2 * r.int(2, 30);
        const d2 = d1 + 2 * r.int(2, 15);
        const ans = (d2 - d1) / 2;
        const table = r.next() < 0.5;
        return T({
          text: table
            ? `Okrogla miza ima premer $${d2}\\ \\mathrm{cm}$. Na sredino mize položimo okrogel prt s premerom $${d1}\\ \\mathrm{cm}$ (prt in miza imata skupno središče). Kako širok rob mize ostane nepokrit?`
            : `Krožnici imata skupno središče. Premer manjše meri $${d1}\\ \\mathrm{cm}$, premer večje pa $${d2}\\ \\mathrm{cm}$. Kako širok je kolobar med njima?`,
          answer: num(ans, "cm", null, [[d2 - d1, "Širina je razlika polmerov, ne premerov."]]),
          hint: "Najprej izračunaj oba polmera.",
          given: [dat("d_1", d1, "cm"), dat("d_2", d2, "cm")],
          find: ["\\text{širina}"],
          formula: "\\text{širina} = r_2 - r_1",
          steps: [`$r_1 = ${d1} : 2 = ${qty(d1 / 2, "cm")}$, $r_2 = ${d2} : 2 = ${qty(d2 / 2, "cm")}$`, `Širina: $${d2 / 2} - ${d1 / 2} = ${qty(ans, "cm")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const ext = r.next() < 0.5;
        const d1 = 2 * r.int(2, 12);
        const d2 = ext ? 2 * r.int(2, 12) : d1 + 2 * r.int(2, 10);
        const ans = ext ? (d1 + d2) / 2 : (d2 - d1) / 2;
        return T({
          text: `Krožnici s premeroma $${d1}\\ \\mathrm{cm}$ in $${d2}\\ \\mathrm{cm}$ se dotikata od ${ext ? "zunaj" : "znotraj"}. Koliko cm sta oddaljeni njuni središči?`,
          answer: num(ans, "cm", null, [
            [ext ? d1 + d2 : d2 - d1, "Razdaljo med središčema računaš s polmeroma, ne s premeroma."],
            [ext ? Math.abs(d2 - d1) / 2 : (d1 + d2) / 2, ext ? "Pri dotiku od zunaj se polmera seštejeta." : "Pri dotiku od znotraj polmera odštejemo."],
          ]),
          hint: "Nariši skico. Dotikališče leži na zveznici središč.",
          given: [dat("d_1", d1, "cm"), dat("d_2", d2, "cm")],
          find: ["|O_1O_2|"],
          formula: ext ? "|O_1O_2| = r_1 + r_2" : "|O_1O_2| = r_2 - r_1",
          steps: [`$r_1 = ${qty(d1 / 2, "cm")}$, $r_2 = ${qty(d2 / 2, "cm")}$`, `$|O_1O_2| = ${d2 / 2} ${ext ? "+" : "-"} ${d1 / 2} = ${qty(ans, "cm")}$`],
        });
      }
      if (t === 1) {
        const k = r.int(4, 10);
        const rr = r.dec(8.5, 13.5, 1);
        const ans = roundHalfUp((k * 2 * rr) / 10, 2);
        return T({
          text: `${name} položi ${k} enakih kovancev s polmerom $${tx(rr)}\\ \\mathrm{mm}$ v vrsto, tako da se sosednja dotikata. Koliko centimetrov je dolga vrsta?`,
          answer: num(ans, "cm", null, [
            [(k * rr) / 10, "Vsak kovanec zavzame dolžino premera, ne polmera."],
            [k * 2 * rr, "Rezultat pretvori v centimetre."],
          ]),
          hint: "Dolžina vrste je vsota premerov vseh kovancev.",
          given: [`k = ${k}`, dat("r", tx(rr), "mm")],
          find: ["\\text{dolžina vrste v cm}"],
          formula: ["\\text{dolžina} = k \\cdot 2r", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
          steps: [`Premer: $d = 2 \\cdot ${tx(rr)} = ${qty(tx(2 * rr), "mm")}$`, `Vrsta: $${k} \\cdot ${tx(2 * rr)} = ${qty(tx(k * 2 * rr), "mm")}$`, `$= ${qty(tx(ans), "cm")}$`],
        });
      }
      const rr = r.next() < 0.5 ? r.int(2, 12) : r.dec(1.5, 6.5, 1);
      const ans = 8 * rr;
      return T({
        text: `Krog s polmerom $${tx(rr)}\\ \\mathrm{cm}$ je včrtan v kvadrat, tako da se dotika vseh štirih stranic. Koliko cm meri obseg kvadrata?`,
        answer: num(ans, "cm", null, [
          [4 * rr, "Stranica kvadrata je enaka premeru kroga, ne polmeru."],
          [2 * rr, "To je stranica kvadrata – izračunaj še obseg."],
        ]),
        hint: "Nariši skico: kolikšna je stranica kvadrata v primerjavi s premerom kroga?",
        given: [dat("r", tx(rr), "cm")],
        find: ["o \\text{ kvadrata}"],
        formula: ["a = d = 2r", "o = 4a"],
        steps: [`Stranica kvadrata je premer: $a = 2 \\cdot ${tx(rr)} = ${qty(tx(2 * rr), "cm")}$`, `$o = 4 \\cdot ${tx(2 * rr)} = ${qty(tx(ans), "cm")}$`],
      });
    },
  },
  {
    id: "dod-mat-os-osnovne-konstrukcije",
    topics: ["MAT-OS-6/osnovne-konstrukcije"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = 2 * r.int(10, 85);
          return T({
            text: r.pick([
              `Kot $\\alpha$ meri $${deg(a)}$. Nariši njegovo simetralo. Koliko stopinj meri vsak od kotov, ki ju simetrala oklepa s krakoma?`,
              `${name} nariše kot $\\alpha = ${deg(a)}$ in njegovo simetralo. Kolikšen kot oklepa simetrala s krakom kota?`,
            ]),
            answer: num(a / 2, "°", null, [[2 * a, "Simetrala kot razpolovi, ne podvoji."]]),
            hint: "Simetrala kota razdeli kot na dva enaka dela.",
            given: [`\\alpha = ${deg(a)}`],
            find: ["\\alpha / 2"],
            formula: "\\text{simetrala kota: } \\alpha \\to \\dfrac{\\alpha}{2} + \\dfrac{\\alpha}{2}",
            steps: ["Simetrala kota ga razpolovi.", `$${deg(a)} : 2 = ${deg(a / 2)}$`],
          });
        }
        if (t === 1) {
          const x = r.dec(3, 12, 1);
          const ans = x / 2;
          return T({
            text: `Simetrala daljice AB seka daljico v točki S. Daljica AB meri $${tx(x)}\\ \\mathrm{cm}$. Koliko cm meri daljica AS?`,
            answer: num(ans, "cm", null, [[2 * x, "Simetrala daljice gre skozi razpolovišče – AS je polovica AB."]]),
            hint: "Simetrala daljice je pravokotna na daljico in gre skozi njeno razpolovišče.",
            given: [dat("|AB|", tx(x), "cm")],
            find: ["|AS|"],
            formula: "|AS| = |SB| = \\dfrac{|AB|}{2}",
            steps: ["S je razpolovišče daljice AB.", `$|AS| = ${tx(x)} : 2 = ${qty(tx(ans), "cm")}$`],
          });
        }
        const Q = r.int(0, 1);
        const qq = [
          {
            text: "Točka T leži na simetrali daljice AB. Kaj zagotovo velja?",
            ok: "T je enako oddaljena od točk A in B.",
            wrong: [
              ["T je razpolovišče daljice AB.", "Na simetrali je veliko točk, razpolovišče je le ena od njih."],
              ["T leži na daljici AB.", "Simetrala daljico seka le v eni točki."],
              ["T je enako oddaljena od krakov kota.", "To velja za točke na simetrali kota."],
            ],
          },
          {
            text: "Točka T leži na simetrali kota z vrhom V. Kaj zagotovo velja?",
            ok: "T je enako oddaljena od obeh krakov kota.",
            wrong: [
              ["T je enako oddaljena od dveh točk na krakih.", "To velja za simetralo daljice, ne kota."],
              ["T leži na enem od krakov.", "Simetrala leži med krakoma (razen vrha)."],
              ["T je od vrha V oddaljena toliko kot od kraka.", "Simetrala kota zagotavlja le enako oddaljenost od obeh krakov."],
            ],
          },
        ][Q];
        return T({
          text: qq.text,
          answer: choice(r, qq.ok, qq.wrong),
          hint: Q === 0 ? "Simetralo daljice načrtaš z enakima lokoma iz A in iz B. Kaj to pove o točkah na njej?" : "Iz točke na simetrali kota spusti pravokotnici na oba kraka in ju primerjaj.",
          given: [Q === 0 ? "\\text{lega} = T \\in s_{AB}" : "\\text{lega} = T \\in s_{\\alpha}"],
          find: ["\\text{lastnost točke } T"],
          formula: Q === 0 ? "T \\in s_{AB} \\iff |TA| = |TB|" : "T \\in s_{\\alpha} \\iff \\text{razdalji do krakov sta enaki}",
          steps: [Q === 0 ? "Vsaka točka simetrale daljice je enako oddaljena od krajišč." : "Vsaka točka simetrale kota je enako oddaljena od krakov.", `Pravilno: ${qq.ok}`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const b = r.int(12, 89);
          return T({
            text: `Simetrala kota $\\alpha$ oklepa s krakom kota kot $${deg(b)}$. Koliko meri kot $\\alpha$?`,
            answer: num(2 * b, "°", null, [[b / 2, "Simetrala kot razpolovi – ves kot je dvakrat večji od polovice."]]),
            hint: "Simetrala razdeli kot na dva enaka dela. Kolikšen je ves kot?",
            given: [`\\dfrac{\\alpha}{2} = ${deg(b)}`],
            find: ["\\alpha"],
            formula: "\\alpha = 2 \\cdot \\dfrac{\\alpha}{2}",
            steps: [`$\\alpha = 2 \\cdot ${deg(b)} = ${deg(2 * b)}$`, `Kot $\\alpha$ meri $${deg(2 * b)}$.`],
          });
        }
        if (t === 1) {
          const x = r.dec(3, 9, 1);
          const y = r.dec(2, Math.min(2 * x - 0.5, 12), 1);
          const ans = roundHalfUp(2 * x + y, 1);
          return T({
            text: `Točka T leži na simetrali daljice AB. Velja $|TA| = ${tx(x)}\\ \\mathrm{cm}$ in $|AB| = ${tx(y)}\\ \\mathrm{cm}$. Koliko cm meri obseg trikotnika ABT?`,
            answer: num(ans, "cm", 1, [
              [x + y, "Ker T leži na simetrali daljice AB, je tudi $|TB| = |TA|$."],
              [3 * x, "Stranica AB ni enaka TA."],
            ]),
            hint: "Kaj velja za razdalji točke na simetrali daljice do krajišč A in B?",
            given: [dat("|TA|", tx(x), "cm"), dat("|AB|", tx(y), "cm")],
            find: ["o"],
            formula: ["|TB| = |TA|", "o = |AB| + |TA| + |TB|"],
            steps: [`T leži na simetrali, zato $|TB| = |TA| = ${qty(tx(x), "cm")}$.`, `$o = ${tx(y)} + ${tx(x)} + ${tx(x)} = ${qty(tx(ans), "cm")}$`],
          });
        }
        const CON = ["simetrala daljice", "simetrala kota", "pravokotnica", "vzporednica"];
        const WHAT = {
          "simetrala daljice": "Simetrala daljice da točke, enako oddaljene od krajišč daljice, in njeno razpolovišče.",
          "simetrala kota": "Simetrala kota razpolovi kot.",
          pravokotnica: "Pravokotnica skozi točko na premico da najkrajšo pot (razdaljo) do premice.",
          vzporednica: "Vzporednica premice je ne seka – z njo ne dobimo ne razpolovišča ne razdalje.",
        };
        const [q, ok] = r.pick([
          ["S katero konstrukcijo najdemo razpolovišče daljice?", "simetrala daljice"],
          ["S katero konstrukcijo razdelimo kot na dva enaka kota?", "simetrala kota"],
          ["S katero konstrukcijo najdemo najkrajšo pot od točke do premice?", "pravokotnica"],
          ["S katero konstrukcijo najdemo vse točke, ki so enako oddaljene od točk A in B?", "simetrala daljice"],
          [`${name} želi postaviti klop na enaki razdalji od dveh dreves. Kje lahko stoji klop?`, "simetrala daljice"],
        ]);
        const opts = ok === "simetrala daljice" && q.includes("klop") ? CON.map((c) => (c === "simetrala daljice" ? "na simetrali daljice med drevesoma" : `na ${c === "simetrala kota" ? "simetrali kota" : c === "pravokotnica" ? "pravokotnici" : "vzporednici"}`)) : null;
        if (opts) {
          const correct = opts[0];
          return T({
            text: q,
            answer: choice(r, correct, [
              [opts[1], "Simetrala kota je povezana s krakoma kota, ne z dvema točkama."],
              [opts[2], "Pravokotnica sama po sebi ne zagotavlja enake razdalje do obeh dreves."],
              [opts[3], "Vzporednica ne zagotavlja enake razdalje do obeh dreves."],
            ]),
            hint: "Kateri množici točk pravimo »vse točke, enako oddaljene od dveh točk«?",
            given: ["\\text{drevesi} = A,\\ B"],
            find: ["\\text{lega klopi}"],
            formula: "T \\in s_{AB} \\iff |TA| = |TB|",
            steps: ["Klop mora biti enako oddaljena od obeh dreves.", "Take točke ležijo na simetrali daljice med drevesoma."],
          });
        }
        return T({
          text: q,
          answer: choice(
            r,
            ok,
            CON.filter((c) => c !== ok).map((c) => [c, WHAT[c]]),
          ),
          hint: "Spomni se, kaj nam da posamezna konstrukcija.",
          given: [`\\text{cilj} = \\text{${q.replace(/^S katero konstrukcijo /, "").replace(/\?$/, "")}}`],
          find: ["\\text{konstrukcija}"],
          formula: "s_{AB}:\\ |TA| = |TB|,\\quad s_{\\alpha}:\\ \\alpha \\to 2 \\cdot \\dfrac{\\alpha}{2}",
          steps: [WHAT[ok], `Odgovor: ${ok}.`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const a = 2 * r.int(15, 75);
        const ans = 180 - a / 2;
        return T({
          text: `Poltrak OC razdeli iztegnjeni kot AOB tako, da kot AOC meri $${deg(a)}$. Koliko meri kot med simetralo kota AOC in krakom OB?`,
          answer: num(ans, "°", null, [
            [a / 2, "To je kot med simetralo in krakom OA."],
            [180 - a, "To je kot BOC – dodaj še polovico kota AOC."],
          ]),
          hint: "Nariši skico. Iztegnjeni kot meri 180°; simetrala razpolovi kot AOC.",
          given: [`\\angle AOB = \\text{iztegnjeni kot}`, `\\angle AOC = ${deg(a)}`],
          find: ["\\angle(s, OB)"],
          formula: "\\angle(s, OB) = 180^\\circ - \\dfrac{\\angle AOC}{2}",
          steps: [`Simetrala oklepa z OA kot $${deg(a)} : 2 = ${deg(a / 2)}$.`, `Do kraka OB: $180^\\circ - ${deg(a / 2)} = ${deg(ans)}$`],
        });
      }
      if (t === 1) {
        const a = 2 * r.int(10, 85);
        const ans = 90 - a / 2;
        return T({
          text: `Kot AOB meri $${deg(a)}$. Poltrak OD je pravokoten na krak OA in leži na isti strani kraka OA kot krak OB. Koliko meri kot med simetralo kota AOB in poltrakom OD?`,
          answer: num(ans, "°", null, [
            [Math.abs(90 - a), "Simetrala oklepa s krakom OA polovico kota AOB, ne celega."],
            [a / 2, "To je kot med simetralo in OA – izračunaj, koliko manjka do pravega kota."],
          ]),
          hint: "Poltrak OD oklepa z OA pravi kot. Koliko od tega pravega kota »porabi« simetrala?",
          given: [`\\angle AOB = ${deg(a)}`, `\\angle AOD = \\text{pravi kot}`],
          find: ["\\angle(s, OD)"],
          formula: "\\angle(s, OD) = 90^\\circ - \\dfrac{\\angle AOB}{2}",
          steps: [`Simetrala oklepa z OA kot $${deg(a / 2)}$.`, `OD oklepa z OA kot $90^\\circ$.`, `Kot med simetralo in OD: $90^\\circ - ${deg(a / 2)} = ${deg(ans)}$`],
        });
      }
      const x = r.int(4, 12);
      const c = r.int(2, 2 * x - 1);
      const o = 2 * x + c;
      return T({
        text: `Točka T leži na simetrali daljice AB. Obseg trikotnika ABT meri $${o}\\ \\mathrm{cm}$, daljica AB pa $${c}\\ \\mathrm{cm}$. Koliko cm meri daljica TA?`,
        answer: num(x, "cm", null, [
          [o - c, "Daljici TA in TB sta enako dolgi – razliko razdeli na dva dela."],
          [o / 3, "Trikotnik ni enakostraničen – AB je drugačna."],
        ]),
        hint: "Kaj velja za |TA| in |TB|? Od obsega najprej odštej |AB|.",
        given: [dat("o", o, "cm"), dat("|AB|", c, "cm")],
        find: ["|TA|"],
        formula: ["|TA| = |TB|", "o = |AB| + 2 \\cdot |TA|"],
        steps: [`$|TA| + |TB| = ${o} - ${c} = ${qty(o - c, "cm")}$`, `$|TA| = ${o - c} : 2 = ${qty(x, "cm")}$`],
      });
    },
  },
  {
    id: "dod-mat-os-simetrija",
    topics: ["MAT-OS-6/simetrija"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.55) {
          const SH = [
            ["kvadrat", 4, "Tudi diagonali kvadrata sta simetrali."],
            ["pravokotnik, ki ni kvadrat", 2, "Diagonali pravokotnika nista simetrali – preizkusi s prepogibanjem."],
            ["enakostranični trikotnik", 3, "Simetrala gre skozi vsako oglišče, ne le skozi eno."],
            ["enakokraki trikotnik, ki ni enakostraničen", 1, "Simetralo ima le osnovnica – gre skozi vrh trikotnika."],
            ["raznostranični trikotnik", 0, "Prepogni ga čez katerokoli premico – polovici se ne pokrijeta."],
            ["romb, ki ni kvadrat", 2, "Simetrali romba sta le njegovi diagonali."],
            ["pravilni šestkotnik", 6, "Štej simetrale skozi nasprotni oglišči in tudi skozi razpolovišči nasprotnih stranic."],
            ["pravilni osemkotnik", 8, "Štej simetrale skozi oglišča in tudi skozi razpolovišča stranic."],
          ];
          const [s, n, why] = r.pick(SH);
          const wrongMap = { 4: 2, 2: 4, 3: 1, 1: 3, 0: 1, 6: 3, 8: 4 };
          return T({
            text: r.pick([`Koliko simetral ima ${s}?`, `${name} iz papirja izreže ${s}. Na koliko različnih načinov ga lahko prepogne, da se polovici natanko pokrijeta?`]),
            answer: num(n, null, null, [[wrongMap[n], why]]),
            hint: "Simetrala je premica, čez katero lik prepognemo, da se polovici natanko pokrijeta.",
            given: [`\\text{lik: ${s}}`],
            find: ["\\text{število simetral}"],
            formula: "\\text{simetrala: premica, čez katero se lik prezrcali sam vase}",
            steps: [`Preizkusimo prepogibanje lika ${s}.`, n ? `Polovici se pokrijeta pri ${n} različnih premicah.` : "Nobena premica ga ne razdeli na dve zrcalni polovici.", `Simetral je ${n}.`],
          });
        }
        const d = r.dec(1.2, 6.5, 1);
        return T({
          text: `Točko T prezrcalimo čez premico s v točko T'. Točka T je od premice s oddaljena $${tx(d)}\\ \\mathrm{cm}$. Koliko cm je razdalja med T in T'?`,
          answer: num(2 * d, "cm", null, [
            [d, "T' je na drugi strani premice, enako daleč – razdalja med njima je dvakratna."],
            [d / 2, "T' je od premice oddaljena enako kot T."],
          ]),
          hint: "Zrcalna slika leži na pravokotnici skozi T, na drugi strani premice in enako daleč od nje.",
          given: [dat("\\text{razdalja } T \\text{ do } s", tx(d), "cm")],
          find: ["|TT'|"],
          formula: "|TT'| = 2 \\cdot \\text{razdalja do } s",
          steps: [`T' je od s oddaljena prav tako $${tx(d)}\\ \\mathrm{cm}$, a na drugi strani.`, `$|TT'| = 2 \\cdot ${tx(d)} = ${qty(tx(2 * d), "cm")}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const d = r.int(8, 45);
          const ans = (2 * d) / 10;
          return T({
            text: `${name} prezrcali točko A čez premico p. Točka A je od premice p oddaljena $${d}\\ \\mathrm{mm}$. Koliko centimetrov je točka A oddaljena od svoje slike A'?`,
            answer: num(ans, "cm", null, [
              [d / 10, "A' je na drugi strani premice – razdalja med A in A' je dvakratna."],
              [2 * d, "Rezultat zapiši v centimetrih."],
            ]),
            hint: "Najprej ugotovi razdaljo med A in A' v mm, nato pretvori v cm.",
            given: [dat("\\text{razdalja } A \\text{ do } p", d, "mm")],
            find: ["|AA'| \\text{ v cm}"],
            formula: ["|AA'| = 2 \\cdot \\text{razdalja do } p", "10\\ \\mathrm{mm} = 1\\ \\mathrm{cm}"],
            steps: [`$|AA'| = 2 \\cdot ${d} = ${qty(2 * d, "mm")}$`, `$${2 * d}\\ \\mathrm{mm} = ${qty(tx(ans), "cm")}$`],
          });
        }
        if (t === 1) {
          const a = r.dec(2, 9, 1);
          const b = r.dec(2, 9, 1);
          const c = roundHalfUp(Math.max(Math.abs(a - b) + 0.5, r.dec(1.5, a + b - 0.5, 1)), 1);
          const o = roundHalfUp(a + b + c, 1);
          return T({
            text: `Trikotnik ABC ima stranice $a = ${tx(a)}\\ \\mathrm{cm}$, $b = ${tx(b)}\\ \\mathrm{cm}$ in $c = ${tx(c)}\\ \\mathrm{cm}$. Prezrcalimo ga čez premico s v trikotnik A'B'C'. Koliko cm meri obseg trikotnika A'B'C'?`,
            answer: num(o, "cm", 1, [[2 * o, "Zrcaljenje ne spremeni velikosti lika – slika ni večja."]]),
            hint: "Ali zrcaljenje spremeni dolžine stranic?",
            given: [dat("a", tx(a), "cm"), dat("b", tx(b), "cm"), dat("c", tx(c), "cm")],
            find: ["o'"],
            formula: ["\\text{zrcaljenje ohranja dolžine}", "o = a + b + c"],
            steps: ["Zrcaljenje ohranja dolžine: $a' = a$, $b' = b$, $c' = c$.", `$o' = ${tx(a)} + ${tx(b)} + ${tx(c)} = ${qty(tx(o), "cm")}$`],
          });
        }
        const a = r.int(15, 165);
        return T({
          text: `Kot $\\alpha$ meri $${deg(a)}$. Prezrcalimo ga čez premico, ki ne gre skozi njegov vrh. Koliko stopinj meri zrcalna slika $\\alpha'$?`,
          answer: num(a, "°", null, [[180 - a, "Zrcaljenje ohranja velikost kotov."], [360 - a, "Zrcaljenje ohranja velikost kotov."]]),
          hint: "Ali se lik pri zrcaljenju poveča, zmanjša ali ostane enako velik?",
          given: [`\\alpha = ${deg(a)}`],
          find: ["\\alpha'"],
          formula: "\\text{zrcaljenje ohranja dolžine in kote}",
          steps: ["Zrcaljenje ohranja velikost kotov.", `$\\alpha' = \\alpha = ${deg(a)}$`],
        });
      }
      // raven 3
      if (r.next() < 0.55) {
        const a = r.int(3, 12);
        const b = r.int(2, 9);
        const area = r.next() < 0.4;
        const ans = area ? 2 * a * b : 2 * a + 4 * b;
        return T({
          text: `Pravokotnik ABCD ima stranici $|AB| = ${a}\\ \\mathrm{cm}$ in $|BC| = ${b}\\ \\mathrm{cm}$. Prezrcalimo ga čez premico AB. Pravokotnik in njegova slika skupaj tvorita nov lik. Koliko ${area ? "$\\mathrm{cm^2}$ meri ploščina" : "cm meri obseg"} novega lika?`,
          answer: area
            ? num(ans, "cm²", null, [[a * b, "Nov lik sestavljata pravokotnik in njegova slika – ploščina se podvoji."]])
            : num(ans, "cm", null, [
                [2 * (2 * a + 2 * b), "Skupna stranica AB je zdaj v notranjosti lika – ne šteje v obseg."],
                [2 * a + 2 * b, "Nov lik je pravokotnik s stranicama a in 2b."],
              ]),
          hint: "Nariši skico. Kakšen lik dobiš in kolikšni sta njegovi stranici?",
          given: [dat("|AB|", a, "cm"), dat("|BC|", b, "cm")],
          find: [area ? "p" : "o"],
          formula: area ? "p = a \\cdot b" : "o = 2a + 2b",
          steps: [
            `Nov lik je pravokotnik s stranicama $${a}\\ \\mathrm{cm}$ in $2 \\cdot ${b} = ${qty(2 * b, "cm")}$.`,
            area ? `$p = ${a} \\cdot ${2 * b} = ${qty(ans, "cm²")}$` : `$o = 2 \\cdot ${a} + 2 \\cdot ${2 * b} = ${qty(ans, "cm")}$`,
          ],
        });
      }
      const k = r.int(5, 20);
      const a = k + (r.next() < 0.5 ? -1 : 1) * r.int(1, Math.min(k, 9));
      const ans = 2 * k - a;
      return T({
        text: `Na številski premici leži točka A pri številu ${a}. Skozi točko pri številu ${k} narišemo pravokotnico p na številsko premico. Točko A prezrcalimo čez p. Pri katerem številu leži slika A'?`,
        answer: num(ans, null, null, [
          [a + k, "Slika je od premice p oddaljena toliko kot A, a na drugi strani."],
          [Math.abs(k - a), "To je le razdalja točke A do premice p."],
        ]),
        hint: `Koliko je A oddaljena od ${k}? Enako daleč, a na drugi strani, je slika.`,
        given: [`A = ${a}`, `p \\text{ seka premico pri} = ${k}`],
        find: ["A'"],
        formula: "\\text{razdalja } A \\text{ do } p = \\text{razdalja } A' \\text{ do } p",
        steps: [`Razdalja A do p: $|${k} - ${a}| = ${Math.abs(k - a)}$`, `A' leži na drugi strani: $${k} ${a < k ? "+" : "-"} ${Math.abs(k - a)} = ${ans}$`],
      });
    },
  },
  {
    id: "dod-mat-os-kocka-kvader",
    topics: ["MAT-OS-6/kocka-in-kvader"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const PK = "P = 2 \\cdot (a \\cdot b + a \\cdot c + b \\cdot c)";
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [a, b, c] = [r.int(2, 12), r.int(2, 12), r.int(2, 12)];
          const V = a * b * c;
          return T({
            text: r.pick([
              `Kvader ima robove $a = ${a}\\ \\mathrm{cm}$, $b = ${b}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^3}$ meri njegova prostornina?`,
              `Škatla v obliki kvadra je dolga $${a}\\ \\mathrm{cm}$, široka $${b}\\ \\mathrm{cm}$ in visoka $${c}\\ \\mathrm{cm}$. Kolikšna je njena prostornina v $\\mathrm{cm^3}$?`,
            ]),
            answer: num(V, "cm³", null, [
              [2 * (a * b + a * c + b * c), "To je površina, ne prostornina."],
              [a + b + c, "Robove zmnoži, ne seštej."],
            ]),
            hint: "Prostornina kvadra je produkt njegovih treh robov.",
            given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
            find: ["V"],
            formula: "V = a \\cdot b \\cdot c",
            steps: [`$V = a \\cdot b \\cdot c$`, `$V = ${a} \\cdot ${b} \\cdot ${c} = ${qty(V, "cm³")}$`],
          });
        }
        const a = r.pick([2, 3, 4, 5, 7, 8, 9, 10, 11, 12]);
        if (t === 1) {
          return T({
            text: r.pick([`Kocka ima rob $a = ${a}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ meri njena površina?`, `${name} oblepi vse ploskve igralne kocke z robom $${a}\\ \\mathrm{cm}$ s papirjem. Koliko $\\mathrm{cm^2}$ papirja porabi (brez prekrivanja)?`]),
            answer: num(6 * a * a, "cm²", null, [
              [4 * a * a, "Kocka ima 6 ploskev, ne 4."],
              [a * a, "To je ploščina ene ploskve – kocka jih ima 6."],
              [a ** 3, "To je prostornina, ne površina."],
            ]),
            hint: "Površina kocke je vsota ploščin vseh njenih ploskev. Koliko ploskev ima kocka?",
            given: [dat("a", a, "cm")],
            find: ["P"],
            formula: "P = 6 \\cdot a^2",
            steps: [`Ena ploskev: $a^2 = ${a}^2 = ${qty(a * a, "cm²")}$`, `$P = 6 \\cdot ${a * a} = ${qty(6 * a * a, "cm²")}$`],
          });
        }
        return T({
          text: r.pick([`Kocka ima rob $a = ${a}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^3}$ meri njena prostornina?`, `Lesena kocka ima rob $${a}\\ \\mathrm{cm}$. Kolikšna je njena prostornina v $\\mathrm{cm^3}$?`]),
          answer: num(a ** 3, "cm³", null, [
            [3 * a, "Prostornina ni 3 · a – rob pomnoži trikrat samega s sabo."],
            [6 * a * a, "To je površina, ne prostornina."],
            [a * a, "To je ploščina ene ploskve."],
          ]),
          hint: "Prostornina kocke je produkt treh enakih robov.",
          given: [dat("a", a, "cm")],
          find: ["V"],
          formula: "V = a^3 = a \\cdot a \\cdot a",
          steps: [`$V = a^3$`, `$V = ${a} \\cdot ${a} \\cdot ${a} = ${qty(a ** 3, "cm³")}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const [a, b, c] = [r.int(2, 12), r.int(2, 10), r.int(2, 9)];
          const P = 2 * (a * b + a * c + b * c);
          return T({
            text: r.pick([
              `Kvader ima robove $a = ${a}\\ \\mathrm{cm}$, $b = ${b}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ meri njegova površina?`,
              `${name} želi zaviti darilo v obliki kvadra z robovi $${a}\\ \\mathrm{cm}$, $${b}\\ \\mathrm{cm}$ in $${c}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ papirja potrebuje najmanj (brez prekrivanja)?`,
            ]),
            answer: num(P, "cm²", null, [
              [P / 2, "Vsaka ploskev ima nasproti še eno enako – pomnoži z 2."],
              [a * b * c, "To je prostornina, ne površina."],
            ]),
            hint: "Mreža kvadra ima tri pare enakih pravokotnikov.",
            given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
            find: ["P"],
            formula: PK,
            steps: [`$a \\cdot b = ${a * b}$, $a \\cdot c = ${a * c}$, $b \\cdot c = ${b * c}$`, `$P = 2 \\cdot (${a * b} + ${a * c} + ${b * c}) = 2 \\cdot ${P / 2} = ${qty(P, "cm²")}$`],
          });
        }
        if (t === 1) {
          const [a, b, c] = [r.int(4, 16) * 5, r.int(3, 10) * 5, r.int(4, 10) * 5];
          const V = a * b * c;
          const L = V / 1000;
          return T({
            text: `Akvarij v obliki kvadra je dolg $${a}\\ \\mathrm{cm}$, širok $${b}\\ \\mathrm{cm}$ in visok $${c}\\ \\mathrm{cm}$. Koliko litrov vode drži, če ga napolnimo do vrha?`,
            answer: num(L, "L", null, [
              [V, "Prostornino v cm³ pretvori v litre: 1 L = 1000 cm³."],
              [V / 100, "1 L = 1 dm³ = 1000 cm³ (ne 100 cm³)."],
            ]),
            hint: "Izračunaj prostornino v cm³ in jo pretvori: 1 L = 1 dm³ = 1000 cm³.",
            given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
            find: ["V \\text{ v litrih}"],
            formula: ["V = a \\cdot b \\cdot c", "1\\ \\mathrm{L} = 1\\ \\mathrm{dm^3} = 1000\\ \\mathrm{cm^3}"],
            steps: [`$V = ${a} \\cdot ${b} \\cdot ${c} = ${qty(big(V), "cm³")}$`, `$V = ${big(V)} : 1000 = ${qty(tx(L), "L")}$`],
          });
        }
        if (t === 2) {
          const a = r.int(2, 12);
          const P = 6 * a * a;
          return T({
            text: `Mreža kocke je sestavljena iz šestih enakih kvadratov in ima ploščino $${P}\\ \\mathrm{cm^2}$. Koliko cm meri rob kocke?`,
            answer: num(a, "cm", null, [
              [a * a, "To je ploščina enega kvadrata – rob je njegova stranica."],
              [P / 4, "Mreža kocke ima 6 kvadratov."],
            ]),
            hint: "Najprej izračunaj ploščino enega kvadrata, nato poišči njegovo stranico.",
            given: [dat("P", P, "cm²")],
            find: ["a"],
            formula: ["P = 6 \\cdot a^2"],
            steps: [`En kvadrat: $${P} : 6 = ${qty(a * a, "cm²")}$`, `$a \\cdot a = ${a * a}$, zato $a = ${qty(a, "cm")}$`],
          });
        }
        const [a, b, c] = [r.int(3, 15), r.int(2, 10), r.int(2, 12)];
        const V = a * b * c;
        return T({
          text: `Kvader s prostornino $${V}\\ \\mathrm{cm^3}$ ima dolžino $${a}\\ \\mathrm{cm}$ in širino $${b}\\ \\mathrm{cm}$. Koliko cm meri njegova višina?`,
          answer: num(c, "cm", null, [
            [V / a, "Deliti moraš s ploščino osnovne ploskve a · b."],
            [V - a * b, "Prostornina je produkt – višino dobiš z deljenjem."],
          ]),
          hint: "Prostornina je ploščina osnovne ploskve, pomnožena z višino.",
          given: [dat("V", V, "cm³"), dat("a", a, "cm"), dat("b", b, "cm")],
          find: ["c"],
          formula: ["V = a \\cdot b \\cdot c", "c = \\dfrac{V}{a \\cdot b}"],
          steps: [`Osnovna ploskev: $${a} \\cdot ${b} = ${qty(a * b, "cm²")}$`, `$c = ${V} : ${a * b} = ${qty(c, "cm")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        const a = r.int(2, 10);
        const V = a ** 3;
        return T({
          text: `Kocka ima prostornino $${V}\\ \\mathrm{cm^3}$. Koliko $\\mathrm{cm^2}$ meri njena površina?`,
          answer: num(6 * a * a, "cm²", null, [
            [a * a, "To je ploščina ene ploskve – kocka jih ima 6."],
            [4 * a * a, "Kocka ima 6 ploskev."],
            [V / 6, "Najprej poišči rob kocke."],
          ]),
          hint: "Najprej poišči rob: katero število, pomnoženo trikrat samo s sabo, da prostornino?",
          given: [dat("V", V, "cm³")],
          find: ["P"],
          formula: ["V = a^3", "P = 6 \\cdot a^2"],
          steps: [`$a^3 = ${V}$, ker je $${a} \\cdot ${a} \\cdot ${a} = ${V}$, je $a = ${qty(a, "cm")}$.`, `$P = 6 \\cdot ${a}^2 = 6 \\cdot ${a * a} = ${qty(6 * a * a, "cm²")}$`],
        });
      }
      if (t === 1) {
        const [a, b, c] = [r.int(4, 10) * 10, r.int(3, 6) * 10, r.int(3, 6) * 10];
        const P = a * b + 2 * a * c + 2 * b * c;
        return T({
          text: `Akvarij brez pokrova je dolg $${a}\\ \\mathrm{cm}$, širok $${b}\\ \\mathrm{cm}$ in visok $${c}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ stekla potrebujemo zanj?`,
          answer: num(P, "cm²", null, [
            [2 * (a * b + a * c + b * c), "Akvarij nima pokrova – zgornje ploskve ne štej."],
            [2 * a * c + 2 * b * c, "Tudi dno je iz stekla."],
          ]),
          hint: "Naštej ploskve, ki so iz stekla: dno in štiri stranske ploskve.",
          given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
          find: ["P \\text{ stekla}"],
          formula: "P = a \\cdot b + 2 \\cdot a \\cdot c + 2 \\cdot b \\cdot c",
          steps: [`Dno: $${a} \\cdot ${b} = ${a * b}$`, `Stranske: $2 \\cdot ${a} \\cdot ${c} + 2 \\cdot ${b} \\cdot ${c} = ${2 * a * c + 2 * b * c}$`, `Skupaj: $${qty(big(P), "cm²")}$`],
        });
      }
      if (t === 2) {
        const [a, b] = [r.int(3, 6) * 10, r.int(2, 5) * 10];
        const h = r.int(5, 25);
        const X = (a * b * h) / 1000;
        return T({
          text: `V prazen akvarij z dnom $${a}\\ \\mathrm{cm} \\times ${b}\\ \\mathrm{cm}$ ${name} nalije $${tx(X)}$ litrov vode. Do katere višine (v cm) seže voda?`,
          answer: num(h, "cm", null, [
            [(X * 100) / (a * b), "1 L = 1000 cm³ (ne 100 cm³)."],
            [X / (a * b), "Litre najprej pretvori v cm³."],
          ]),
          hint: "Litre pretvori v cm³. Voda ima obliko kvadra z znanim dnom – poišči njegovo višino.",
          given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("V", tx(X), "L")],
          find: ["h"],
          formula: ["h = \\dfrac{V}{a \\cdot b}", "1\\ \\mathrm{L} = 1000\\ \\mathrm{cm^3}"],
          steps: [`$V = ${tx(X)}\\ \\mathrm{L} = ${qty(big(X * 1000), "cm³")}$`, `Dno: $${a} \\cdot ${b} = ${qty(a * b, "cm²")}$`, `$h = ${big(X * 1000)} : ${a * b} = ${qty(h, "cm")}$`],
        });
      }
      const k = r.int(2, 5);
      const [p, q, s] = [r.int(2, 6), r.int(2, 5), r.int(2, 5)];
      const [a, b, c] = [p * k, q * k, s * k];
      return T({
        text: `Koliko kock z robom $${k}\\ \\mathrm{cm}$ lahko zložimo v škatlo v obliki kvadra z notranjimi merami $${a}\\ \\mathrm{cm}$, $${b}\\ \\mathrm{cm}$ in $${c}\\ \\mathrm{cm}$, da jo natanko napolnimo?`,
        answer: num(p * q * s, null, null, [
          [(a * b * c) / k, "Prostornino škatle deli s prostornino kocke, ne z robom."],
          [p + q + s, "Število kock po vsakem robu zmnoži, ne seštej."],
        ]),
        hint: "Koliko kock gre vzdolž vsakega roba škatle?",
        given: [dat("k", k, "cm"), dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
        find: ["\\text{število kock}"],
        formula: "N = \\dfrac{a}{k} \\cdot \\dfrac{b}{k} \\cdot \\dfrac{c}{k}",
        steps: [`Vzdolž robov: $${a} : ${k} = ${p}$, $${b} : ${k} = ${q}$, $${c} : ${k} = ${s}$`, `$N = ${p} \\cdot ${q} \\cdot ${s} = ${p * q * s}$`],
      });
    },
  },
  {
    id: "dod-mat-os-prikazi-podatkov",
    topics: ["MAT-OS-6/prikazi-podatkov"],
    gen(level, r) {
      const SETS = [
        { title: "Število izposojenih knjig v šolski knjižnici", cats: ["ponedeljek", "torek", "sreda", "četrtek", "petek"], what: "knjig" },
        { title: "Najljubši šport učencev 6. razredov", cats: ["nogomet", "košarka", "odbojka", "rokomet", "plavanje"], what: "učencev" },
        { title: "Število prodanih sladoledov", cats: ["vanilija", "čokolada", "jagoda", "limona"], what: "sladoledov" },
        { title: "Število obiskovalcev kopališča (v stotinah)", cats: ["maj", "junij", "julij", "avgust"], what: "stotin obiskovalcev" },
      ];
      const S = r.pick(SETS);
      const n = S.cats.length;
      const list = (vals) => S.cats.map((c, i) => `${c} – ${vals[i]}`).join(", ");
      if (level === 1) {
        const vals = S.cats.map(() => r.int(6, 45));
        if (r.next() < 0.5) {
          let i = r.int(0, n - 1);
          let j = r.int(0, n - 1);
          while (j === i || vals[j] === vals[i]) {
            j = r.int(0, n - 1);
            if (j === i) continue;
            if (vals[j] === vals[i]) vals[j] += 1;
          }
          if (vals[i] < vals[j]) [i, j] = [j, i];
          const ans = vals[i] - vals[j];
          return T({
            text: `Preglednica kaže: ${S.title.toLowerCase()}: ${list(vals)}. Za koliko je bila vrednost pri »${S.cats[i]}« večja kot pri »${S.cats[j]}«?`,
            answer: num(ans, null, null, [[vals[i] + vals[j], "Iščemo razliko, ne vsote."]]),
            hint: "Poišči obe vrednosti v preglednici in odštej manjšo od večje.",
            given: [`${S.cats[i]}: ${vals[i]}`, `${S.cats[j]}: ${vals[j]}`],
            find: ["\\text{razlika}"],
            formula: "\\text{razlika} = \\text{večja} - \\text{manjša}",
            steps: [`Odčitamo: ${S.cats[i]} ${vals[i]}, ${S.cats[j]} ${vals[j]}.`, `$${vals[i]} - ${vals[j]} = ${ans}$`],
          });
        }
        const tot = sum(vals);
        return T({
          text: `Preglednica kaže: ${S.title.toLowerCase()}: ${list(vals)}. Koliko je vseh skupaj?`,
          answer: num(tot, null, null, [[tot - vals[n - 1], "Seštej vse podatke iz preglednice, tudi zadnjega."]]),
          hint: "Seštej vse vrednosti iz preglednice.",
          given: vals.map((v, i) => `\\text{${S.cats[i]}}: ${v}`),
          find: ["\\text{skupaj}"],
          formula: "\\text{skupaj} = \\text{vsota vseh vrednosti}",
          steps: [`$${vals.join(" + ")} = ${tot}$`, `Skupaj: ${tot}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const s = r.pick([2, 4, 5, 10]);
          const hs = S.cats.map(() => r.int(2, 12));
          const tot = r.next() < 0.4;
          let i = r.int(0, n - 1);
          let j = (i + r.int(1, n - 1)) % n;
          if (hs[i] === hs[j]) hs[i] += 1;
          if (hs[i] < hs[j]) [i, j] = [j, i];
          const ans = tot ? s * sum(hs) : s * (hs[i] - hs[j]);
          const hl = S.cats.map((c, k) => `${c} ${hs[k]}`).join(", ");
          return T({
            text: `V stolpčnem prikazu »${S.title}« en kvadratek pomeni ${nOf(s, "enoto", "enoti", "enote", "enot")}. Stolpci so visoki (v kvadratkih): ${hl}. ${tot ? "Koliko enot je skupaj?" : `Za koliko enot je vrednost pri »${S.cats[i]}« večja kot pri »${S.cats[j]}«?`}`,
            answer: num(ans, null, null, tot ? [[sum(hs), `Upoštevaj merilo: en kvadratek pomeni ${s} enot.`]] : [[hs[i] - hs[j], `Upoštevaj merilo: en kvadratek pomeni ${s} enot.`], [s * hs[i], "Iščemo razliko med stolpcema."]]),
            hint: "Najprej odčitaj število kvadratkov, nato ga pomnoži z merilom.",
            given: [`1\\ \\text{kvadratek} = ${s}`, ...S.cats.map((c, k) => `\\text{${c}}: ${hs[k]}`)],
            find: [tot ? "\\text{skupaj}" : "\\text{razlika}"],
            formula: "\\text{vrednost} = \\text{kvadratki} \\cdot \\text{merilo}",
            steps: tot ? [`Kvadratkov: $${hs.join(" + ")} = ${sum(hs)}$`, `$${sum(hs)} \\cdot ${s} = ${ans}$`] : [`Razlika v kvadratkih: $${hs[i]} - ${hs[j]} = ${hs[i] - hs[j]}$`, `$${hs[i] - hs[j]} \\cdot ${s} = ${ans}$`],
          });
        }
        const s = r.pick([10, 20, 50]);
        const k1 = r.int(3, 9);
        const k2 = r.int(1, k1 - 1);
        const A = k1 * s;
        const B = k2 * s + s / 2;
        const ans = A - B;
        const [c1, c2] = r.shuffle(S.cats).slice(0, 2);
        return T({
          text: `Na navpični osi stolpčnega prikaza so oznake $0, ${s}, ${2 * s}, ${3 * s}, \\ldots$ Stolpec »${c1}« sega natanko do oznake $${A}$, stolpec »${c2}« pa do sredine med oznakama $${k2 * s}$ in $${(k2 + 1) * s}$. Za koliko je prvi stolpec višji?`,
          answer: num(ans, null, null, [
            [A - k2 * s, "Drugi stolpec sega do sredine med oznakama – dodaj polovico razmika."],
            [A - (k2 + 1) * s, "Drugi stolpec ne sega do višje oznake, ampak do sredine."],
          ]),
          hint: `Razmik med oznakama je ${s}. Sredina med dvema oznakama je za polovico razmika nad nižjo.`,
          given: [`\\text{razmik} = ${s}`, `\\text{${c1}} = ${A}`, `\\text{${c2}} = \\text{sredina med } ${k2 * s} \\text{ in } ${(k2 + 1) * s}`],
          find: ["\\text{razlika}"],
          formula: "\\text{sredina} = \\text{nižja oznaka} + \\dfrac{\\text{razmik}}{2}",
          steps: [`Stolpec »${c2}«: $${k2 * s} + ${s / 2} = ${B}$`, `Razlika: $${A} - ${B} = ${ans}$`],
        });
      }
      // raven 3
      if (r.next() < 0.5) {
        const s = r.pick([2, 3, 4, 5]);
        const hs = S.cats.map(() => r.int(2, 10));
        const miss = r.int(0, n - 1);
        const vals = hs.map((h) => h * s);
        const N = sum(vals);
        const known = S.cats.map((c, k) => (k === miss ? null : `${c} ${vals[k]}`)).filter(Boolean).join(", ");
        return T({
          text: `${S.title}: skupaj ${N}. Znani podatki: ${known}. Podatek za »${S.cats[miss]}« manjka. Koliko kvadratkov visok mora biti njegov stolpec v stolpčnem prikazu, če en kvadratek pomeni ${nOf(s, "enoto", "enoti", "enote", "enot")}?`,
          answer: num(hs[miss], null, null, [
            [vals[miss], `To je vrednost – deli jo še z merilom ${s}.`],
            [N / s, "Najprej izračunaj manjkajočo vrednost: od skupnega števila odštej znane."],
          ]),
          hint: "Najprej od skupnega števila odštej vse znane vrednosti, nato rezultat deli z merilom.",
          given: [`\\text{skupaj} = ${N}`, ...S.cats.map((c, k) => (k === miss ? null : `\\text{${c}}: ${vals[k]}`)).filter(Boolean), `1\\ \\text{kvadratek} = ${s}`],
          find: ["\\text{višina stolpca}"],
          formula: "\\text{kvadratki} = \\dfrac{\\text{vrednost}}{\\text{merilo}}",
          steps: [`Manjkajoča vrednost: $${N} - ${vals.filter((_, k) => k !== miss).join(" - ")} = ${vals[miss]}$`, `Kvadratkov: $${vals[miss]} : ${s} = ${hs[miss]}$`],
        });
      }
      const DAYS = ["pon", "tor", "sre", "čet", "pet", "sob"];
      let temps;
      do temps = DAYS.map(() => r.int(4, 24));
      while (!temps.some((x, i) => i > 0 && x > temps[i - 1]));
      const rises = temps.map((x, i) => (i ? x - temps[i - 1] : -99));
      const best = Math.max(...rises);
      const bi = rises.indexOf(best);
      return T({
        text: `Prikaz kaže jutranjo temperaturo v šestih dneh: ${DAYS.map((d, i) => `${d} ${temps[i]} °C`).join(", ")}. Za koliko stopinj se je temperatura najbolj dvignila iz enega dneva v naslednjega?`,
        answer: num(best, "°C", null, [
          [Math.max(...temps) - Math.min(...temps), "Primerjaj le dva zaporedna dneva, ne najvišje in najnižje temperature."],
          [Math.max(...rises.slice(1).map(Math.abs)), "Iščemo dvig, ne padca temperature."],
        ]),
        hint: "Za vsak par zaporednih dni izračunaj spremembo. Kje je dvig največji?",
        given: DAYS.map((d, i) => `\\text{${d}}: ${temps[i]}\\ \\mathrm{^\\circ C}`),
        find: ["\\text{največji dvig}"],
        formula: "\\text{sprememba} = T_{\\text{naslednji dan}} - T_{\\text{prejšnji dan}}",
        steps: [`Spremembe: ${rises.slice(1).map((x) => (x > 0 ? `+${x}` : `${x}`)).join(", ")}`, `Največji dvig je med dnevoma ${DAYS[bi - 1]} in ${DAYS[bi]}: $${temps[bi]} - ${temps[bi - 1]} = ${best}\\ \\mathrm{^\\circ C}$`],
      });
    },
  },
  {
    id: "dod-mat-os-kombinatorika",
    topics: ["MAT-OS-6/kombinatoricne-situacije"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const m = r.int(2, 6);
        const n = r.int(2, 5);
        const [text, A, B] = r.pick([
          [`${name} ima ${nOf(m, "majico", "majici", "majice", "majic")} in ${nOf(n, "hlače", "hlače", "hlače", "hlač")}. Na koliko načinov se lahko obleče, če izbere eno majico in ene hlače?`, "majice", "hlače"],
          [`Kuhar ponuja ${nOf(m, "predjed", "predjedi", "predjedi", "predjedi")} in ${nOf(n, "glavno jed", "glavni jedi", "glavne jedi", "glavnih jedi")}. Koliko različnih kosil (predjed in glavna jed) lahko sestavimo?`, "predjedi", "glavne jedi"],
          [`Za sendvič lahko izbereš ${nOf(m, "vrsto", "vrsti", "vrste", "vrst")} kruha in ${nOf(n, "namaz", "namaza", "namaze", "namazov")}. Koliko različnih sendvičev (en kruh, en namaz) lahko narediš?`, "kruh", "namaz"],
        ]);
        return T({
          text,
          answer: num(m * n, null, null, [[m + n, "Vsako možnost prve izbire združi z vsako možnostjo druge – možnosti zmnoži."]]),
          hint: "Nariši drevesni prikaz: iz vsake veje prve izbire izhaja toliko vej, kolikor je možnosti druge izbire.",
          given: [`\\text{${A}}: ${m}`, `\\text{${B}}: ${n}`],
          find: ["\\text{število možnosti}"],
          formula: "\\text{možnosti} = m \\cdot n",
          steps: [`Prva stopnja drevesa: ${m} možnosti; iz vsake izhaja ${n} možnosti druge stopnje.`, `$${m} \\cdot ${n} = ${m * n}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [a, b, c] = [r.int(2, 3), r.int(3, 6), r.int(2, 4)];
          return T({
            text: `V slaščičarni lahko sladoled dobiš v ${a === 2 ? "kornetu ali lončku" : "kornetu, lončku ali skodelici"}, v ${b} okusih in z enim od ${c} prelivov. Koliko različnih sladoledov (ena posoda, en okus, en preliv) lahko naročiš?`,
            answer: num(a * b * c, null, null, [
              [a + b + c, "Možnosti zmnoži, ne seštej."],
              [a * b, "Upoštevaj tudi izbiro preliva."],
            ]),
            hint: "Nariši drevo s tremi stopnjami: posoda, okus, preliv.",
            given: [`\\text{posode} = \\text{${a === 2 ? "kornet, lonček" : "kornet, lonček, skodelica"}}`, `\\text{okusi}: ${b}`, `\\text{prelivi}: ${c}`],
            find: ["\\text{število sladoledov}"],
            formula: "\\text{možnosti} = a \\cdot b \\cdot c",
            steps: [`Posoda in okus: $${a} \\cdot ${b} = ${a * b}$`, `Z prelivom: $${a * b} \\cdot ${c} = ${a * b * c}$`],
          });
        }
        const k = r.int(3, 6);
        const digs = r.shuffle(range(1, 9)).slice(0, k).sort((x, y) => x - y);
        const rep = t === 2;
        const ans = rep ? k * k : k * (k - 1);
        return T({
          text: `Koliko različnih dvomestnih števil lahko zapišemo s števkami $${digs.join(", ")}$, če se števke ${rep ? "lahko ponavljajo" : "ne smejo ponavljati"}?`,
          answer: num(ans, null, null, rep ? [[k * (k - 1), "Števke se lahko ponavljajo – tudi števila, kot je 33, štejejo."], [2 * k, "Možnosti za desetice in enice zmnoži."]] : [[k * k, "Števke se ne smejo ponavljati."], [(k * (k - 1)) / 2, "Števili, kot sta 12 in 21, sta različni."]]),
          hint: "Koliko možnosti je za mesto desetic? Koliko jih nato ostane za mesto enic?",
          given: [`\\text{števke: } ${digs.join(", ")}`, rep ? "\\text{ponavljanje} = \\text{dovoljeno}" : "\\text{ponavljanje} = \\text{ni dovoljeno}"],
          find: ["\\text{število števil}"],
          formula: rep ? "k \\cdot k" : "k \\cdot (k - 1)",
          steps: [`Desetice: ${k} možnosti.`, `Enice: ${rep ? k : k - 1} možnosti${rep ? "" : " (ena števka je že porabljena)"}.`, `$${k} \\cdot ${rep ? k : k - 1} = ${ans}$`],
        });
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        const n = r.int(4, 12);
        const ans = (n * (n - 1)) / 2;
        return T({
          text: r.pick([`Na srečanju se ${n} prijateljev rokuje vsak z vsakim natanko enkrat. Koliko rokovanj je bilo?`, `V skupini je ${n} igralcev namiznega tenisa. Vsak igra z vsakim natanko eno tekmo. Koliko tekem odigrajo?`]),
          answer: num(ans, null, null, [
            [n * (n - 1), "Vsak par si štel dvakrat (A z B je isto kot B z A)."],
            [n * n, "Nihče se ne rokuje (ne igra) sam s sabo."],
          ]),
          hint: "Vsak od n ljudi ima n − 1 partnerjev. Pazi, da vsakega para ne šteješ dvakrat.",
          given: [`n = ${n}`],
          find: ["\\text{število parov}"],
          formula: "\\dfrac{n \\cdot (n - 1)}{2}",
          steps: [`Vsak ima ${n - 1} partnerjev: $${n} \\cdot ${n - 1} = ${n * (n - 1)}$`, `Vsak par smo šteli dvakrat: $${n * (n - 1)} : 2 = ${ans}$`],
        });
      }
      if (t === 1) {
        const n = r.int(3, 5);
        const fact = [1, 1, 2, 6, 24, 120][n];
        const ppl = r.shuffle(NAMES).slice(0, n);
        return T({
          text: `${ppl.slice(0, -1).join(", ")} in ${ppl[n - 1]} se postavijo v vrsto pred blagajno. Na koliko različnih načinov se lahko razvrstijo?`,
          answer: num(fact, null, null, [
            [n * n, "Za vsako naslednje mesto ostane ena oseba manj."],
            [n, "Šteti moraš vse razporede, ne le, kdo je prvi."],
          ]),
          hint: "Za prvo mesto je toliko možnosti, kolikor je ljudi. Koliko jih ostane za drugo mesto?",
          given: [`\\text{osebe} = \\text{${ppl.join(", ")}}`],
          find: ["\\text{število razporedov}"],
          formula: "n \\cdot (n - 1) \\cdot \\ldots \\cdot 1",
          steps: [`Prvo mesto: ${n} možnosti, drugo: ${n - 1}, …, zadnje: 1.`, `$${range(1, n).reverse().join(" \\cdot ")} = ${fact}$`],
        });
      }
      if (t === 2) {
        const k = r.int(4, 5);
        const digs = [0, ...r.shuffle(range(1, 9)).slice(0, k - 1)].sort((x, y) => x - y);
        const ans = (k - 1) * (k - 1) * (k - 2);
        return T({
          text: `Koliko različnih trimestnih števil lahko sestavimo iz števk $${digs.join(", ")}$, če se števke ne smejo ponavljati?`,
          answer: num(ans, null, null, [
            [k * (k - 1) * (k - 2), "Trimestno število se ne sme začeti z 0."],
            [(k - 1) * (k - 2) * (k - 3), "Ničla se lahko pojavi na mestu desetic ali enic."],
          ]),
          hint: "Začni z mestom stotic: katere števke tam ne smeš uporabiti?",
          given: [`\\text{števke: } ${digs.join(", ")}`, "\\text{ponavljanje} = \\text{ni dovoljeno}"],
          find: ["\\text{število trimestnih števil}"],
          formula: "\\text{stotice} \\cdot \\text{desetice} \\cdot \\text{enice}",
          steps: [`Stotice: ${k - 1} možnosti (vse razen 0).`, `Desetice: ${k - 1} možnosti (ostane tudi 0), enice: ${k - 2} možnosti.`, `$${k - 1} \\cdot ${k - 1} \\cdot ${k - 2} = ${ans}$`],
        });
      }
      const n = r.int(4, 10);
      return T({
        text: `V ligi igra ${n} ekip. Vsaka ekipa igra z vsako drugo dvakrat (enkrat doma, enkrat v gosteh). Koliko tekem odigrajo v ligi?`,
        answer: num(n * (n - 1), null, null, [
          [(n * (n - 1)) / 2, "Vsak par ekip igra dvakrat."],
          [2 * n, "Vsaka ekipa ima več nasprotnikov – preštej vse pare."],
        ]),
        hint: "Vsaka ekipa gosti vsako od ostalih ekip enkrat. Koliko domačih tekem ima vsaka ekipa?",
        given: [`n = ${n} \\text{ ekip}`, "\\text{vsak par} = \\text{dve tekmi}"],
        find: ["\\text{število tekem}"],
        formula: "n \\cdot (n - 1)",
        steps: [`Vsaka ekipa ima ${n - 1} domačih tekem.`, `$${n} \\cdot ${n - 1} = ${n * (n - 1)}$`],
      });
    },
  },
  // ===================== 7. razred =====================
  {
    id: "dod-mat-os-primerjanje-ulomkov",
    topics: ["MAT-OS-7/primerjanje-in-urejanje-ulomkov"],
    gen(level, r) {
      const rel = (x, y) => (x < y ? "<" : x > y ? ">" : "=");
      if (level === 1) {
        const bigger = r.next() < 0.5;
        if (r.next() < 0.6) {
          const d = r.int(5, 15);
          const cs = r.shuffle(coprimes(d, 1, d - 1)).slice(0, 2);
          const [a, b] = cs;
          const ans = bigger ? Math.max(a, b) : Math.min(a, b);
          return T({
            text: `Kateri od ulomkov $${fr(a, d)}$ in $${fr(b, d)}$ je ${bigger ? "večji" : "manjši"}? Vpiši ga.`,
            answer: frac(ans, d),
            hint: "Ulomka imata enak imenovalec – primerjaj števca.",
            given: [`u_1 = ${fr(a, d)}`, `u_2 = ${fr(b, d)}`],
            find: [`\\text{${bigger ? "večji" : "manjši"} ulomek}`],
            formula: "\\dfrac{a}{d} < \\dfrac{b}{d} \\iff a < b",
            steps: [`Imenovalca sta enaka (${d}), zato primerjamo števca: $${a} ${rel(a, b)} ${b}$.`, `$${fr(a, d)} ${rel(a, b)} ${fr(b, d)}$, ${bigger ? "večji" : "manjši"} je $${fr(ans, d)}$.`],
          });
        }
        let n, d1, d2;
        do {
          n = r.int(1, 7);
          d1 = r.int(n + 1, 15);
          d2 = r.int(n + 1, 15);
        } while (d1 === d2 || gcd(n, d1) !== 1 || gcd(n, d2) !== 1);
        const dd = bigger ? Math.min(d1, d2) : Math.max(d1, d2);
        return T({
          text: `Kateri od ulomkov $${fr(n, d1)}$ in $${fr(n, d2)}$ je ${bigger ? "večji" : "manjši"}? Vpiši ga.`,
          answer: frac(n, dd),
          hint: "Ulomka imata enak števec. Pri katerem imenovalcu je en del celote večji?",
          given: [`u_1 = ${fr(n, d1)}`, `u_2 = ${fr(n, d2)}`],
          find: [`\\text{${bigger ? "večji" : "manjši"} ulomek}`],
          formula: "\\dfrac{a}{b} > \\dfrac{a}{c} \\iff b < c",
          steps: [`Števca sta enaka. Čim večji je imenovalec, tem manjši so deli.`, `$${fr(n, d1)} ${rel(d2, d1)} ${fr(n, d2)}$, ${bigger ? "večji" : "manjši"} je $${fr(n, dd)}$.`],
        });
      }
      const pickFr = (lo, hi) => {
        const d = r.int(lo, hi);
        return [r.pick(coprimes(d, 1, d - 1)), d];
      };
      if (level === 2) {
        let a, b, c, d;
        do {
          [a, b] = pickFr(3, 12);
          [c, d] = pickFr(3, 12);
        } while (b === d || a * d === b * c);
        const L = lcm(b, d);
        const A = (a * L) / b;
        const C = (c * L) / d;
        const bigger = r.next() < 0.6;
        const ansF = (A > C) === bigger ? [a, b] : [c, d];
        const [P, Q] = name2(r);
        const ctx = r.int(0, 2);
        const text = [
          `Kateri od ulomkov $${fr(a, b)}$ in $${fr(c, d)}$ je ${bigger ? "večji" : "manjši"}? Vpiši ga.`,
          `${P} je ${g(P, "prehodil", "prehodila")} $${fr(a, b)}$ poti, ${Q} pa $${fr(c, d)}$ iste poti. Kolikšen del poti je ${bigger ? "prehodil tisti, ki je prehodil več" : "prehodil tisti, ki je prehodil manj"}?`,
          `V prvem kozarcu je $${fr(a, b)}$ litra soka, v drugem $${fr(c, d)}$ litra. Koliko litrov soka je v kozarcu, v katerem ga je ${bigger ? "več" : "manj"}? Odgovor zapiši z ulomkom.`,
        ][ctx];
        return T({
          text,
          answer: frac(...ansF),
          hint: `Razširi oba ulomka na skupni imenovalec ${L} in primerjaj števca.`,
          given: [`u_1 = ${fr(a, b)}`, `u_2 = ${fr(c, d)}`],
          find: [`\\text{${bigger ? "večji" : "manjši"} ulomek}`],
          formula: "\\dfrac{a}{b} = \\dfrac{a \\cdot k}{b \\cdot k}",
          steps: [`Skupni imenovalec: $v(${b}, ${d}) = ${L}$`, `$${fr(a, b)} = ${fr(A, L)}$, $${fr(c, d)} = ${fr(C, L)}$`, `$${fr(A, L)} ${rel(A, C)} ${fr(C, L)}$, ${bigger ? "večji" : "manjši"} je $${fr(...ansF)}$.`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        let fs;
        do fs = [pickFr(2, 10), pickFr(2, 10), pickFr(2, 10)];
        while (new Set(fs.map(([x, y]) => x / y)).size < 3 || new Set(fs.map((f) => f[1])).size < 3);
        const L = fs.reduce((acc, f) => lcm(acc, f[1]), 1);
        const sorted = [...fs].sort((x, y) => x[0] / x[1] - y[0] / y[1]);
        const [m0, m1] = sorted[1];
        return T({
          text: `Uredi ulomke $${fs.map(([x, y]) => fr(x, y)).join("$, $")}$ po velikosti. Kateri ulomek je na sredini?`,
          answer: frac(m0, m1),
          hint: `Vse tri ulomke razširi na skupni imenovalec ${L}.`,
          given: fs.map(([x, y], i) => `u_{${i + 1}} = ${fr(x, y)}`),
          find: ["\\text{srednji ulomek}"],
          formula: "\\dfrac{a}{b} = \\dfrac{a \\cdot k}{b \\cdot k}",
          steps: [`Skupni imenovalec: ${L}`, `$${fs.map(([x, y]) => `${fr(x, y)} = ${fr((x * L) / y, L)}`).join(",\\ ")}$`, `$${sorted.map(([x, y]) => fr(x, y)).join(" < ")}$, na sredini je $${fr(m0, m1)}$.`],
        });
      }
      if (t === 1) {
        const [P, Q] = name2(r);
        const equal = r.next() < 0.3;
        let a, b, c, d;
        do {
          [a, b] = pickFr(3, 9);
          if (equal) {
            const k = r.int(2, 4);
            [c, d] = [a * k, b * k];
          } else [c, d] = pickFr(3, 12);
        } while (b === d || (!equal && a * d === b * c));
        const cmp = a * d - b * c;
        const SAME = "oba enako";
        const correct = cmp > 0 ? P : cmp < 0 ? Q : SAME;
        const bigNum = c > a ? Q : P;
        const WHY = {
          [P]: cmp === 0 ? "Ulomka sta enaka – razširi ali okrajšaj enega od njiju." : "Primerjaj ulomka na skupnem imenovalcu, ne le števcev ali imenovalcev.",
          [Q]: cmp === 0 ? "Ulomka sta enaka – razširi ali okrajšaj enega od njiju." : "Primerjaj ulomka na skupnem imenovalcu, ne le števcev ali imenovalcev.",
          [SAME]: "Ulomka nista enaka – razširi ju na skupni imenovalec.",
        };
        if (correct !== bigNum && cmp !== 0) WHY[bigNum] = "Večji števec še ne pomeni večjega ulomka – pomemben je tudi imenovalec.";
        return T({
          text: `${P} je ${g(P, "prebral", "prebrala")} $${fr(a, b)}$ knjige, ${Q} pa $${fr(c, d)}$ enako debele knjige. Kdo je prebral več?`,
          answer: choice(
            r,
            correct,
            [P, Q, SAME].filter((o) => o !== correct).map((o) => [o, WHY[o]]),
          ),
          hint: "Razširi oba ulomka na skupni imenovalec.",
          given: [`\\text{${P}}: ${fr(a, b)}`, `\\text{${Q}}: ${fr(c, d)}`],
          find: ["\\text{kdo je prebral več}"],
          formula: "\\dfrac{a}{b} = \\dfrac{a \\cdot k}{b \\cdot k}",
          steps: [`$${fr(a, b)} = ${fr((a * lcm(b, d)) / b, lcm(b, d))}$, $${fr(c, d)} = ${fr((c * lcm(b, d)) / d, lcm(b, d))}$`, cmp === 0 ? "Ulomka sta enaka – oba sta prebrala enako." : `Več je ${g(correct, "prebral", "prebrala")} ${correct}.`],
        });
      }
      let N, x;
      do {
        N = r.pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 24]);
        x = r.int(2, N - 2);
      } while (gcd(x, N) !== 1 || (gcd(x - 1, N) === 1 && gcd(x + 1, N) === 1));
      const lo = frac(x - 1, N);
      const hi = frac(x + 1, N);
      return T({
        text: `Kateri ulomek z imenovalcem ${N} leži med $${fr(lo.num, lo.den)}$ in $${fr(hi.num, hi.den)}$?`,
        answer: frac(x, N),
        hint: `Oba dana ulomka razširi na imenovalec ${N}.`,
        given: [`\\text{spodnja meja} = ${fr(lo.num, lo.den)}`, `\\text{zgornja meja} = ${fr(hi.num, hi.den)}`, `\\text{imenovalec} = ${N}`],
        find: [`\\dfrac{?}{${N}}`],
        formula: "\\dfrac{a}{b} = \\dfrac{a \\cdot k}{b \\cdot k}",
        steps: [`$${fr(lo.num, lo.den)} = ${fr(x - 1, N)}$, $${fr(hi.num, hi.den)} = ${fr(x + 1, N)}$`, `Med njima je $${fr(x, N)}$.`],
      });
    },
  },
  {
    id: "dod-mat-os-ulomki-besedilne",
    topics: ["MAT-OS-7/ulomki-v-besedilnih-nalogah"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const d = r.int(2, 8);
        const n = r.pick(coprimes(d, 1, d - 1));
        const q = r.int(3, 15);
        const X = d * q;
        const rest = r.next() < 0.35;
        const ans = rest ? (d - n) * q : n * q;
        const [text, unit] = r.pick([
          [`Razred ima ${X} učencev. $${fr(n, d)}$ jih hodi v šolo peš. Koliko učencev ${rest ? "ne hodi v šolo peš" : "hodi v šolo peš"}?`, null],
          [`${name} ima $${X}$ € žepnine. $${fr(n, d)}$ denarja porabi za kino. Koliko evrov ${rest ? "mu ostane" : "porabi za kino"}?`, "€"],
          [`Kolesarska pot je dolga $${X}\\ \\mathrm{km}$. Prvi dan prevozimo $${fr(n, d)}$ poti. Koliko kilometrov ${rest ? "ostane za drugi dan" : "prevozimo prvi dan"}?`, "km"],
          [`V vreči je $${X}\\ \\mathrm{kg}$ krompirja. $${fr(n, d)}$ ga porabimo za kosilo. Koliko kilogramov ${rest ? "ostane" : "porabimo"}?`, "kg"],
        ]);
        return T({
          text,
          answer: num(ans, unit, null, [
            [q, "To je šele en del – pomnoži ga s številom delov."],
            [rest ? n * q : (d - n) * q, rest ? "To je porabljeni del, ne ostanek." : "To je preostanek, ne iskani del."],
          ]),
          hint: rest ? `Ostane $${fr(d - n, d)}$ celote.` : `Celoto razdeli na ${d} enakih delov in vzemi ${n} od njih.`,
          given: [`\\text{celota} = ${unit ? qty(X, unit === "€" ? EUR : unit) : X}`, `\\text{del} = ${fr(n, d)}`],
          find: [rest ? "\\text{preostanek}" : `${fr(n, d)} \\text{ celote}`],
          formula: "\\dfrac{n}{d} \\text{ od } X = \\dfrac{X}{d} \\cdot n",
          steps: [`En del: $${X} : ${d} = ${q}$`, rest ? `Ostane $${fr(d - n, d)}$ celote: $${q} \\cdot ${d - n} = ${ans}$` : `$${q} \\cdot ${n} = ${ans}$`],
        });
      }
      if (level === 2) {
        const d = r.int(3, 9);
        const n = r.pick(coprimes(d, 2, d - 1).length ? coprimes(d, 2, d - 1) : [1]);
        const q = r.int(3, 20);
        const Y = n * q;
        const ans = d * q;
        const [text, unit] = r.pick([
          [`${name} je ${g(name, "prebral", "prebrala")} $${fr(n, d)}$ knjige, to je ${Y} strani. Koliko strani ima knjiga?`, null],
          [`V rezervoarju je $${Y}\\ \\mathrm{L}$ goriva, kar je $${fr(n, d)}$ njegove prostornine. Koliko litrov drži poln rezervoar?`, "L"],
          [`Do zdaj smo prehodili $${Y}\\ \\mathrm{km}$, kar je $${fr(n, d)}$ celotne poti. Koliko kilometrov je dolga vsa pot?`, "km"],
          [`$${fr(n, d)}$ učencev šole trenira kak šport, to je ${Y} učencev. Koliko učencev ima šola?`, null],
        ]);
        return T({
          text,
          answer: num(ans, unit, null, [
            [q, `To je en del ($${fr(1, d)}$) – celota je ${d}-krat večja.`],
            [(Y * n) / d, "Iščemo celoto, ne dela števila iz besedila."],
            [Y * d, `Najprej izračunaj en del: deli s števcem ${n}.`],
          ]),
          hint: `$${fr(n, d)}$ celote je ${Y}. Koliko je $${fr(1, d)}$? Celota je $${fr(d, d)}$.`,
          given: [`${fr(n, d)} \\text{ celote} = ${unit ? qty(Y, unit) : Y}`],
          find: ["\\text{celota}"],
          formula: "\\text{celota} = \\dfrac{\\text{del}}{n} \\cdot d",
          steps: [`En del ($${fr(1, d)}$): $${Y} : ${n} = ${q}$`, `Celota: $${q} \\cdot ${d} = ${ans}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t < 2) {
        let a, b, c, d;
        do {
          b = r.int(2, 5);
          a = r.int(1, b - 1);
          d = r.int(2, 5);
          c = r.int(1, d - 1);
        } while (gcd(a, b) !== 1 || gcd(c, d) !== 1);
        const k = r.int(1, 4);
        const X = b * d * k * r.pick([1, 2]);
        const rem1 = (X * (b - a)) / b;
        const sp2 = (rem1 * c) / d;
        const fin = rem1 - sp2;
        if (t === 0) {
          return T({
            text: `${name} ima $${X}$ €. Za knjigo porabi $${fr(a, b)}$ denarja, nato za kino $${fr(c, d)}$ preostanka. Koliko evrov ${g(name, "mu", "ji")} ostane?`,
            answer: num(fin, "€", null, [
              [X - (X * a) / b - (X * c) / d > 0 ? X - (X * a) / b - (X * c) / d : NaN, "Drugi znesek se računa od preostanka, ne od celote."],
              [rem1, "Odštej še denar za kino."],
            ]),
            hint: "Najprej izračunaj, koliko ostane po nakupu knjige. Drugi ulomek se nanaša na ta preostanek.",
            given: [dat("X", X, EUR), `\\text{knjiga} = ${fr(a, b)} \\text{ denarja}`, `\\text{kino} = ${fr(c, d)} \\text{ preostanka}`],
            find: ["\\text{ostanek}"],
            formula: "\\dfrac{n}{d} \\text{ od } X = \\dfrac{X}{d} \\cdot n",
            steps: [`Knjiga: $${X} : ${b} \\cdot ${a} = ${(X * a) / b}$ €, ostane $${X} - ${(X * a) / b} = ${rem1}$ €`, `Kino: $${rem1} : ${d} \\cdot ${c} = ${sp2}$ €`, `Ostane: $${rem1} - ${sp2} = ${qty(fin, EUR)}$`],
          });
        }
        return T({
          text: `${name} je najprej ${g(name, "porabil", "porabila")} $${fr(a, b)}$ prihrankov, nato še $${fr(c, d)}$ preostanka. Ostalo ${g(name, "mu", "ji")} je $${fin}$ €. Koliko evrov je ${g(name, "imel", "imela")} na začetku?`,
          answer: num(X, "€", null, [
            [(fin * b) / (b - a), "Upoštevaj obe porabi – najprej poišči preostanek po prvi porabi."],
            [(fin * d) / (d - c), "To je preostanek po prvi porabi – nadaljuj do začetnega zneska."],
          ]),
          hint: `Na koncu ostane $${fr(d - c, d)}$ preostanka. Najprej izračunaj preostanek po prvi porabi.`,
          given: [`\\text{ostanek} = ${qty(fin, EUR)}`, `\\text{1. poraba} = ${fr(a, b)}`, `\\text{2. poraba} = ${fr(c, d)} \\text{ preostanka}`],
          find: ["X"],
          formula: "\\text{celota} = \\dfrac{\\text{del}}{n} \\cdot d",
          steps: [`$${fr(d - c, d)}$ preostanka je $${fin}$ €, zato je preostanek $${fin} : ${d - c} \\cdot ${d} = ${rem1}$ €.`, `$${fr(b - a, b)}$ začetnega zneska je $${rem1}$ €, zato je začetni znesek $${rem1} : ${b - a} \\cdot ${b} = ${qty(X, EUR)}$.`],
        });
      }
      const [n, d] = r.pick([
        [3, 4],
        [2, 3],
        [1, 2],
        [3, 5],
        [2, 5],
        [1, 4],
        [3, 10],
      ]);
      const k = r.int(4, 20);
      const V = (k * n) / d;
      if (!Number.isInteger(V * 10)) return this.gen(3, r);
      return T({
        text: `Steklenica drži $${fr(n, d)}$ litra soka. Koliko steklenic napolnimo s $${tx(V)}$ litra soka?`,
        answer: num(k, null, null, [
          [(V * n) / d, "Ne množi z ulomkom – ugotavljaš, kolikokrat gre ena steklenica v vso količino."],
          [V * n, `Z ulomkom delimo tako, da množimo z obratno vrednostjo $${fr(d, n)}$.`],
        ]),
        hint: `Vso količino deli z vsebino ene steklenice: $${tx(V)} : ${fr(n, d)}$.`,
        given: [`\\text{steklenica} = ${fr(n, d)}\\ \\mathrm{L}`, dat("V", tx(V), "L")],
        find: ["\\text{število steklenic}"],
        formula: "a : \\dfrac{n}{d} = a \\cdot \\dfrac{d}{n}",
        steps: [`$${tx(V)} : ${fr(n, d)} = ${tx(V)} \\cdot ${fr(d, n)}$`, `$= ${k}$`],
      });
    },
  },
  {
    id: "dod-mat-os-razmerje",
    topics: ["MAT-OS-7/razmerje"],
    gen(level, r) {
      const [A, B] = name2(r);
      if (level === 1) {
        let p, q;
        do {
          p = r.int(1, 9);
          q = r.int(2, 9);
        } while (p === q || gcd(p, q) !== 1);
        const k = r.int(2, 9);
        const [a, b] = [p * k, q * k];
        const text = r.pick([
          `Okrajšaj razmerje $${a} : ${b}$ do konca.`,
          `Na tekmovanju je ${a} deklet in ${b} fantov. Zapiši okrajšano razmerje dekleta : fantje.`,
          `Za testo potrebujemo $${a}0\\ \\mathrm{g}$ sladkorja in $${b}0\\ \\mathrm{g}$ moke. Zapiši okrajšano razmerje sladkor : moka.`,
        ]);
        return T({
          text: `${text} Odgovor zapiši kot razmerje $a : b$ (npr. $2 : 3$) ali kot ulomek (npr. 2/3).`,
          answer: frac(p, q),
          hint: "Oba člena razmerja deli z njunim največjim skupnim deliteljem.",
          given: [text.includes("mathrm{g}") ? `\\text{razmerje} = ${a}0 : ${b}0` : `\\text{razmerje} = ${a} : ${b}`],
          find: ["\\text{okrajšano razmerje}"],
          formula: "a : b = (a : k) : (b : k)",
          steps: [text.includes("mathrm{g}") ? `$${a}0 : ${b}0 = ${a} : ${b}$ (deljeno z 10)` : `$D(${a}, ${b}) = ${gcd(a, b)}$`, `$${a} : ${b} = ${p} : ${q}$`, `Kot ulomek: $${fr(p, q)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          let p, q;
          do {
            p = r.int(1, 7);
            q = r.int(1, 7);
          } while (p === q || gcd(p, q) !== 1);
          const k = r.int(2, 12);
          const T0 = k * (p + q);
          const second = r.next() < 0.5;
          const ans = second ? k * q : k * p;
          const money = r.next() < 0.6;
          return T({
            text: money
              ? `${A} in ${B} si razdelita $${T0}$ € v razmerju $${p} : ${q}$. Koliko evrov dobi ${second ? B : A}?`
              : `Sok in vodo zmešamo v razmerju $${p} : ${q}$. Pripravimo $${T0}\\ \\mathrm{dl}$ napitka. Koliko decilitrov ${second ? "vode" : "soka"} porabimo?`,
            answer: num(ans, money ? "€" : "dl", null, [
              [second ? k * p : k * q, "To je delež drugega člena razmerja."],
              [T0 / 2, "Razmerje ni 1 : 1 – vsota ni razdeljena na pol."],
              [second ? T0 / q : T0 / p, `Celoto razdeli na $${p} + ${q} = ${p + q}$ enakih delov.`],
            ]),
            hint: `Celota ima $${p} + ${q} = ${p + q}$ enakih delov. Koliko je en del?`,
            given: [`\\text{celota} = ${qty(T0, money ? EUR : "dl")}`, `\\text{razmerje} = ${p} : ${q}`],
            find: ["\\text{delež}"],
            formula: "\\text{en del} = \\dfrac{\\text{celota}}{p + q}",
            steps: [`Delov: $${p} + ${q} = ${p + q}$`, `En del: $${T0} : ${p + q} = ${k}$`, `Delež: $${k} \\cdot ${second ? q : p} = ${ans}$`],
          });
        }
        if (t === 1) {
          const [su, bu, f] = r.pick([
            ["cm", "m", 100],
            ["min", "h", 60],
            ["g", "kg", 1000],
            ["mm", "cm", 10],
          ]);
          let a, b, p, q;
          do {
            b = r.int(1, 4);
            a = r.int(1, f === 10 ? 39 : 19) * (f === 60 ? 5 : f === 10 ? 1 : f / 20);
            const gg = gcd(a, b * f);
            p = a / gg;
            q = (b * f) / gg;
          } while (a >= b * f || q === 1 || p === q || q > 60);
          return T({
            text: `Okrajšaj razmerje $${a}\\ \\mathrm{${su}} : ${b}\\ \\mathrm{${bu}}$ do konca. Odgovor zapiši kot razmerje $a : b$ (npr. $2 : 3$) ali kot ulomek (npr. 2/3).`,
            answer: frac(p, q),
            hint: `Najprej oba člena zapiši v isti enoti: $1\\ \\mathrm{${bu}} = ${f}\\ \\mathrm{${su}}$.`,
            given: [`\\text{razmerje} = ${a}\\ \\mathrm{${su}} : ${b}\\ \\mathrm{${bu}}`],
            find: ["\\text{okrajšano razmerje}"],
            formula: [`1\\ \\mathrm{${bu}} = ${f}\\ \\mathrm{${su}}`, "a : b = (a : k) : (b : k)"],
            steps: [`$${b}\\ \\mathrm{${bu}} = ${b * f}\\ \\mathrm{${su}}$`, `$${a} : ${b * f} = ${p} : ${q}$ (deljeno z ${gcd(a, b * f)})`, `Kot ulomek: $${fr(p, q)}$`],
          });
        }
        let p, q;
        do {
          p = r.int(2, 7);
          q = r.int(2, 9);
        } while (p === q || gcd(p, q) !== 1);
        const k = r.int(2, 6);
        return T({
          text: `Razmerje med številom fantov in deklet v pevskem zboru je $${p} : ${q}$. Fantov je ${k * p}. Koliko je deklet?`,
          answer: num(k * q, null, null, [
            [k * p + (q - p), "Razmerje ne pove razlike, ampak kolikokrat je en del vsebovan – oba člena pomnoži z istim številom."],
            [k * p * q, `Najprej ugotovi, kolikokrat je ${p} vsebovano v ${k * p}.`],
          ]),
          hint: `Število fantov (${k * p}) je ${p}-delov. Koliko je en del?`,
          given: [`\\text{fantje} : \\text{dekleta} = ${p} : ${q}`, `\\text{fantje} = ${k * p}`],
          find: ["\\text{dekleta}"],
          formula: "\\dfrac{\\text{fantje}}{\\text{dekleta}} = \\dfrac{p}{q}",
          steps: [`En del: $${k * p} : ${p} = ${k}$`, `Dekleta: $${k} \\cdot ${q} = ${k * q}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [p, q, s] = r.shuffle([r.int(1, 3), r.int(4, 6), r.int(7, 9)]);
        const k = r.int(2, 15);
        const T0 = k * (p + q + s);
        const C = r.pick(NAMES.filter((x) => x !== A && x !== B));
        const who = r.int(0, 2);
        const share = [p, q, s][who] * k;
        return T({
          text: `${A}, ${B} in ${C} si nagrado $${T0}$ € razdelijo v razmerju $${p} : ${q} : ${s}$. Koliko evrov dobi ${[A, B, C][who]}?`,
          answer: num(share, "€", null, [
            [T0 / 3, "Razmerje ni 1 : 1 : 1."],
            [T0 / [p, q, s][who], `Celota ima $${p} + ${q} + ${s}$ enakih delov.`],
            [[q, s, p][who] * k, "Preveri, kateri člen razmerja pripada iskani osebi."],
          ]),
          hint: `Seštej člene razmerja: koliko enakih delov ima nagrada?`,
          given: [`\\text{nagrada} = ${qty(T0, EUR)}`, `\\text{razmerje} = ${p} : ${q} : ${s}`],
          find: [`\\text{delež: ${[A, B, C][who]}}`],
          formula: "\\text{en del} = \\dfrac{\\text{celota}}{p + q + s}",
          steps: [`Delov: $${p} + ${q} + ${s} = ${p + q + s}$`, `En del: $${T0} : ${p + q + s} = ${k}$ €`, `${[A, B, C][who]}: $${[p, q, s][who]} \\cdot ${k} = ${qty(share, EUR)}$`],
        });
      }
      if (t === 1) {
        let p, q;
        do {
          p = r.int(1, 6);
          q = r.int(p + 1, 9);
        } while (gcd(p, q) !== 1);
        const k = r.int(2, 9);
        const d = (q - p) * k;
        const tot = (p + q) * k;
        return T({
          text: `${A} in ${B} imata denar v razmerju $${p} : ${q}$. ${B} ima $${d}$ € več kot ${A}. Koliko evrov imata skupaj?`,
          answer: num(tot, "€", null, [
            [d * (p + q), `Razlika ${d} € ni en del – razlika predstavlja $${q} - ${p} = ${q - p}$ delov.`],
            [q * k, `To ima samo ${B}.`],
          ]),
          hint: `Razlika med členoma je $${q} - ${p} = ${q - p}$ delov. Koliko je en del?`,
          given: [`${A} : ${B} = ${p} : ${q}`, `\\text{razlika} = ${qty(d, EUR)}`],
          find: ["\\text{skupaj}"],
          formula: "\\text{en del} = \\dfrac{\\text{razlika}}{q - p}",
          steps: [`$${q - p}$ delov $= ${d}$ €, en del: $${d} : ${q - p} = ${k}$ €`, `Skupaj: $(${p} + ${q}) \\cdot ${k} = ${qty(tot, EUR)}$`],
        });
      }
      const k = r.int(3, 9);
      const m = r.int(1, 5);
      const V = (1 + k) * m;
      return T({
        text: `Sirup in vodo zmešamo v razmerju $1 : ${k}$. Koliko decilitrov sirupa potrebujemo za $${tx(V / 10)}\\ \\mathrm{L}$ soka?`,
        answer: num(m, "dl", null, [
          [V / k, `Napitek ima $1 + ${k}$ delov, ne ${k}.`],
          [m / 10, "Rezultat zapiši v decilitrih: 1 L = 10 dl."],
          [V - m, "To je količina vode."],
        ]),
        hint: `Litre pretvori v decilitre. Napitek ima $1 + ${k}$ enakih delov.`,
        given: [`\\text{sirup} : \\text{voda} = 1 : ${k}`, dat("V", tx(V / 10), "L")],
        find: ["\\text{sirup v dl}"],
        formula: ["1\\ \\mathrm{L} = 10\\ \\mathrm{dl}", "\\text{en del} = \\dfrac{V}{1 + k}"],
        steps: [`$${tx(V / 10)}\\ \\mathrm{L} = ${V}\\ \\mathrm{dl}$`, `Delov: $1 + ${k} = ${k + 1}$`, `Sirup: $${V} : ${k + 1} = ${qty(m, "dl")}$`],
      });
    },
  },
  {
    id: "dod-mat-os-racunanje-s-koti",
    topics: ["MAT-OS-7/racunanje-s-koti"],
    gen(level, r) {
      const dmR = (D, M) => `${D}^\\circ ${M}'`;
      const dm = (tot) => (tot % 60 ? dmR(Math.floor(tot / 60), tot % 60) : `${tot / 60}^\\circ`);
      const MIN = "1^\\circ = 60'";
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const D = r.int(1, 5);
          const M = r.int(1, 59);
          return T({
            text: `Koliko kotnih minut meri kot $\\alpha = ${dmR(D, M)}$? Vpiši samo število minut.`,
            answer: num(60 * D + M, null, null, [
              [100 * D + M, "Ena stopinja ima 60 kotnih minut, ne 100."],
              [60 * D, "Prištej še minute."],
            ]),
            hint: "Stopinje pretvori v minute in prištej minute.",
            given: [`\\alpha = ${dmR(D, M)}`],
            find: ["\\alpha \\text{ v kotnih minutah}"],
            formula: MIN,
            steps: [`$${D}^\\circ = ${D} \\cdot 60' = ${60 * D}'$`, `$${60 * D}' + ${M}' = ${60 * D + M}'$`],
          });
        }
        if (t === 1) {
          const M = 3 * r.int(1, 39);
          const x = M / 60;
          return T({
            text: `Pretvori $${tx(x)}^\\circ$ v kotne minute. Vpiši samo število minut.`,
            answer: num(M, null, null, [[x * 100, "1° = 60', ne 100'."]]),
            hint: "Ena stopinja ima 60 kotnih minut.",
            given: [`\\alpha = ${tx(x)}^\\circ`],
            find: ["\\alpha \\text{ v kotnih minutah}"],
            formula: MIN,
            steps: [`$1^\\circ = 60'$`, `$${tx(x)} \\cdot 60' = ${M}'$`],
          });
        }
        const D = r.int(2, 80);
        const M = r.pick([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
        const ans = D + M / 60;
        return T({
          text: `Kot meri $${dmR(D, M)}$. Zapiši ga z decimalnim številom stopinj.`,
          answer: num(ans, "°", null, [[D + M / 100, `Minute deli s 60, ne s 100: ${M}' ni 0,${M}°.`]]),
          hint: "Minute pretvori v stopinje tako, da jih deliš s 60.",
          given: [`\\alpha = ${dmR(D, M)}`],
          find: ["\\alpha \\text{ v stopinjah}"],
          formula: "1' = \\dfrac{1}{60}^\\circ",
          steps: [`$${M}' = ${M} : 60 = ${tx(M / 60)}^\\circ$`, `$${D}^\\circ + ${tx(M / 60)}^\\circ = ${tx(ans)}^\\circ$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a1 = r.int(12, 75);
          const a2 = r.int(12, 75);
          const m1 = r.int(20, 59);
          let m2 = r.int(61 - m1, 59);
          const s = m1 + m2;
          const correct = dmR(a1 + a2 + 1, s - 60);
          const tri = r.next() < 0.4;
          return T({
            text: tri ? `V trikotniku merita kota $\\alpha = ${dmR(a1, m1)}$ in $\\beta = ${dmR(a2, m2)}$. Koliko meri vsota $\\alpha + \\beta$?` : `Izračunaj: $${dmR(a1, m1)} + ${dmR(a2, m2)}$`,
            answer: choice(r, correct, [
              [dmR(a1 + a2, s), "Minut ne sme biti 60 ali več – 60' pretvori v 1°."],
              [dmR(a1 + a2, s - 60), "Ko 60' pretvoriš v 1°, ga prištej k stopinjam."],
              s >= 100 ? [dmR(a1 + a2 + 1, s - 100), "1° = 60', ne 100'."] : [dmR(a1 + a2 + 1, s), "Ko prenašaš 1°, od minut odštej 60'."],
            ]),
            tex: true,
            hint: "Posebej seštej stopinje in posebej minute. Če je minut 60 ali več, jih pretvori.",
            given: [`\\alpha = ${dmR(a1, m1)}`, `\\beta = ${dmR(a2, m2)}`],
            find: ["\\alpha + \\beta"],
            formula: MIN,
            steps: [`Stopinje: $${a1}^\\circ + ${a2}^\\circ = ${a1 + a2}^\\circ$, minute: $${m1}' + ${m2}' = ${s}'$`, `$${s}' = 1^\\circ ${s - 60}'$`, `Vsota: $${correct}$`],
          });
        }
        if (t === 1) {
          const a1 = r.int(40, 170);
          const a2 = r.int(10, a1 - 2);
          const m1 = r.int(1, 40);
          let m2 = r.int(m1 + 1, 59);
          if (m2 - m1 === m1 + 60 - m2) m2 += m2 < 59 ? 1 : -1;
          const correct = dmR(a1 - a2 - 1, m1 + 60 - m2);
          return T({
            text: `Izračunaj: $${dmR(a1, m1)} - ${dmR(a2, m2)}$`,
            answer: choice(r, correct, [
              [dmR(a1 - a2, m2 - m1), "Minut ne smeš odšteti v obratnem vrstnem redu – sposodi si 1° = 60'."],
              [dmR(a1 - a2, m1 + 60 - m2), "Ko si sposodiš 1°, zmanjšaj stopinje za 1."],
              [dmR(a1 - a2 - 1, m1 + 100 - m2), "1° = 60', ne 100'."],
            ]),
            tex: true,
            hint: `Minut je premalo ($${m1}' < ${m2}'$). Sposodi si 1° in ga pretvori v 60'.`,
            given: [`\\alpha = ${dmR(a1, m1)}`, `\\beta = ${dmR(a2, m2)}`],
            find: ["\\alpha - \\beta"],
            formula: MIN,
            steps: [`$${dmR(a1, m1)} = ${dmR(a1 - 1, m1 + 60)}$`, `$${dmR(a1 - 1, m1 + 60)} - ${dmR(a2, m2)} = ${correct}$`],
          });
        }
        const b = r.int(10, 80);
        const a = b + r.int(1, 3);
        const m = r.int(0, 59);
        const n = r.int(0, 59);
        const ans = 60 * (a - b) + m - n;
        return T({
          text: `Kot $\\alpha$ meri $${dmR(a, m)}$, kot $\\beta$ pa $${dmR(b, n)}$. Za koliko kotnih minut je kot $\\alpha$ večji od kota $\\beta$? Vpiši samo število minut.`,
          answer: num(ans, null, null, [
            [100 * (a - b) + m - n, "1° = 60', ne 100'."],
            [Math.abs(m - n), "Upoštevaj tudi razliko stopinj."],
          ]),
          hint: "Oba kota pretvori v kotne minute in ju odštej.",
          given: [`\\alpha = ${dmR(a, m)}`, `\\beta = ${dmR(b, n)}`],
          find: ["\\alpha - \\beta \\text{ v minutah}"],
          formula: MIN,
          steps: [`$\\alpha = ${a} \\cdot 60' + ${m}' = ${60 * a + m}'$, $\\beta = ${b} \\cdot 60' + ${n}' = ${60 * b + n}'$`, `$${60 * a + m}' - ${60 * b + n}' = ${ans}'$`],
        });
      }
      // raven 3
      if (r.next() < 0.7) {
        const kind = r.int(0, 2);
        let a1, m1, a2 = 0, m2 = 0, S;
        do {
          a1 = kind === 0 ? r.int(10, 85) : kind === 1 ? r.int(10, 170) : r.int(20, 100);
          m1 = r.int(1, 59);
          if (kind === 2) {
            a2 = r.int(15, 160 - a1);
            m2 = r.int(1, 59);
          }
          S = 60 * (a1 + a2) + m1 + m2;
        } while (S % 60 === 0 || S % 60 === 30);
        const B = kind === 0 ? 90 : 180;
        const D = Math.floor(S / 60);
        const M = S % 60;
        const correct = dmR(B - D - 1, 60 - M);
        const text = [
          `Koliko meri komplementarni kot kota $\\alpha = ${dmR(a1, m1)}$?`,
          `Koliko meri suplementarni kot kota $\\alpha = ${dmR(a1, m1)}$?`,
          `V trikotniku merita kota $\\alpha = ${dmR(a1, m1)}$ in $\\beta = ${dmR(a2, m2)}$. Koliko meri kot $\\gamma$?`,
        ][kind];
        return T({
          text,
          answer: choice(r, correct, [
            [dmR(B - D, M), `Minut ne smeš prepisati: $${B}^\\circ = ${B - 1}^\\circ 60'$.`],
            [dmR(B - D - 1, 100 - M), "1° = 60', ne 100'."],
            [dmR(B - D, 60 - M), "Ko si sposodiš 1°, zmanjšaj stopinje za 1."],
          ]),
          tex: true,
          hint: kind === 2 ? `Najprej seštej $\\alpha + \\beta$, nato rezultat odštej od $180^\\circ = 179^\\circ 60'$.` : `Zapiši $${B}^\\circ = ${B - 1}^\\circ 60'$ in odštej.`,
          given: kind === 2 ? [`\\alpha = ${dmR(a1, m1)}`, `\\beta = ${dmR(a2, m2)}`] : [`\\alpha = ${dmR(a1, m1)}`],
          find: [kind === 2 ? "\\gamma" : "\\alpha'"],
          formula: [kind === 0 ? "\\alpha + \\alpha' = 90^\\circ" : kind === 1 ? "\\alpha + \\alpha' = 180^\\circ" : "\\alpha + \\beta + \\gamma = 180^\\circ", MIN],
          steps: [
            ...(kind === 2 ? [`$\\alpha + \\beta = ${dmR(a1 + a2, m1 + m2)}${m1 + m2 >= 60 ? ` = ${dm(S)}` : ""}$`] : []),
            `$${B}^\\circ = ${B - 1}^\\circ 60'$`,
            `$${B - 1}^\\circ 60' - ${dm(S)} = ${correct}$`,
          ],
        });
      }
      const k = r.int(2, 5);
      let D, M;
      do {
        D = r.int(1, 15);
        M = r.int(1, 59);
      } while ((60 * D + M) % k !== 0);
      const part = (60 * D + M) / k;
      return T({
        text: `Kot $${dmR(D, M)}$ razdelimo na ${k} enake dele. Koliko kotnih minut meri en del? Vpiši samo število minut.`,
        answer: num(part, null, null, [
          [(100 * D + M) / k, "1° = 60', ne 100'."],
          [(60 * D) / k + M, "Deliti moraš ves kot, tudi minute."],
        ]),
        hint: "Ves kot najprej pretvori v kotne minute, nato deli.",
        given: [`\\alpha = ${dmR(D, M)}`, `k = ${k}`],
        find: ["\\text{en del v minutah}"],
        formula: MIN,
        steps: [`$${dmR(D, M)} = ${D} \\cdot 60' + ${M}' = ${60 * D + M}'$`, `$${60 * D + M}' : ${k} = ${part}'$`, `To je $${dm(part)}$.`],
      });
    },
  },
  {
    id: "dod-mat-os-konstrukcije-trikotnikov",
    topics: ["MAT-OS-7/konstrukcije-trikotnikov"],
    gen(level, r) {
      const cm = (s, v) => `${s} = ${tx(v)}\\ \\mathrm{cm}`;
      const an = (s, v) => `${s} = ${v}^\\circ`;
      if (level === 1) {
        if (r.next() < 0.6) {
          const kind = r.int(0, 3);
          let data, desc;
          if (kind === 0) {
            const a = r.dec(3, 9, 1);
            const b = r.dec(3, 9, 1);
            const c = roundHalfUp(Math.abs(a - b) + 0.5 + r.next() * (a + b - Math.abs(a - b) - 1), 1);
            data = [cm("a", a), cm("b", b), cm("c", c)];
            desc = "vse tri stranice";
          } else if (kind === 1) {
            const [s1, s2, k] = r.pick([
              ["a", "b", "\\gamma"],
              ["b", "c", "\\alpha"],
              ["a", "c", "\\beta"],
            ]);
            data = [cm(s1, r.dec(3, 9, 1)), cm(s2, r.dec(3, 9, 1)), an(k, r.int(30, 120))];
            desc = "dve stranici in kot, ki ga oklepata";
          } else if (kind === 2) {
            const [s, k1, k2] = r.pick([
              ["c", "\\alpha", "\\beta"],
              ["a", "\\beta", "\\gamma"],
              ["b", "\\alpha", "\\gamma"],
            ]);
            data = [cm(s, r.dec(3, 9, 1)), an(k1, r.int(30, 80)), an(k2, r.int(30, 80))];
            desc = "stranica in oba kota ob njej";
          } else {
            const [s1, s2, k] = r.pick([
              ["a", "b", "\\alpha"],
              ["b", "c", "\\beta"],
              ["a", "c", "\\alpha"],
            ]);
            const x = r.dec(5, 9, 1);
            data = [cm(s1, x), cm(s2, r.dec(2.5, x - 0.5, 1)), an(k, r.int(30, 120))];
            desc = "dve stranici in kot nasproti daljši od njiju";
          }
          const IZ = ["SSS", "SKS", "KSK", "SsK"];
          const WHY = {
            SSS: "SSS: poznati moramo vse tri stranice.",
            SKS: "SKS: dve stranici in kot, ki ga oklepata.",
            KSK: "KSK: eno stranico in oba kota ob njej.",
            SsK: "SsK: dve stranici in kot nasproti daljši od njiju.",
          };
          return T({
            text: `Za trikotnik ABC poznamo: $${data.join(",\\ ")}$. Po katerem izreku o skladnosti je trikotnik s temi podatki enolično določen?`,
            answer: choice(
              r,
              IZ[kind],
              IZ.filter((x) => x !== IZ[kind]).map((x) => [x, WHY[x]]),
            ),
            hint: "Ugotovi, kje leži dani kot glede na dani stranici: med njima, ob stranici ali nasproti stranice?",
            given: data,
            find: ["\\text{izrek o skladnosti}"],
            formula: "\\text{SSS},\\ \\text{SKS},\\ \\text{KSK},\\ \\text{SsK}",
            steps: [`Dani so: ${desc}.`, `To je izrek ${IZ[kind]}.`],
          });
        }
        const a = r.int(25, 100);
        const b = r.int(20, 160 - a);
        return T({
          text: `Trikotnik načrtamo iz stranice in dveh kotov: $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Koliko meri tretji kot $\\gamma$?`,
          answer: num(180 - a - b, "°", null, [
            [180 - a, "Odšteti moraš oba dana kota."],
            [a + b, "To je vsota danih kotov – γ je preostanek do 180°."],
          ]),
          hint: "Vsota notranjih kotov trikotnika je 180°.",
          given: [an("\\alpha", a), an("\\beta", b)],
          find: ["\\gamma"],
          formula: "\\alpha + \\beta + \\gamma = 180^\\circ",
          steps: [`$\\gamma = 180^\\circ - \\alpha - \\beta$`, `$\\gamma = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${180 - a - b}^\\circ$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(3, 15);
          const b = r.int(3, 15);
          const max = r.next() < 0.5;
          const ans = max ? a + b - 1 : Math.abs(a - b) + 1;
          return T({
            text: `Stranici trikotnika merita $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Dolžina tretje stranice je celo število centimetrov. Koliko cm meri ${max ? "najdaljša" : "najkrajša"} možna tretja stranica?`,
            answer: num(ans, "cm", null, max ? [[a + b, "Tretja stranica mora biti krajša od vsote drugih dveh, ne enaka."]] : [[Math.abs(a - b), "Tretja stranica mora biti daljša od razlike drugih dveh, ne enaka."], [1, "Upoštevaj trikotniško neenakost."]]),
            hint: "Trikotniška neenakost: vsaka stranica je krajša od vsote in daljša od razlike drugih dveh.",
            given: [dat("a", a, "cm"), dat("b", b, "cm")],
            find: [max ? "c_{\\max}" : "c_{\\min}"],
            formula: "|a - b| < c < a + b",
            steps: [`$|${a} - ${b}| < c < ${a} + ${b}$, torej $${Math.abs(a - b)} < c < ${a + b}$`, `${max ? "Največje" : "Najmanjše"} celo število: $c = ${qty(ans, "cm")}$`],
          });
        }
        if (t === 1) {
          const b = r.int(4, 15);
          const c = r.int(2, 2 * b - 1);
          const o = 2 * b + c;
          const askKrak = r.next() < 0.5;
          return T({
            text: askKrak
              ? `Načrtati želimo enakokraki trikotnik z obsegom $${o}\\ \\mathrm{cm}$ in osnovnico $${c}\\ \\mathrm{cm}$. Koliko cm meri krak?`
              : `Načrtati želimo enakokraki trikotnik z obsegom $${o}\\ \\mathrm{cm}$ in krakom $${b}\\ \\mathrm{cm}$. Koliko cm meri osnovnica?`,
            answer: askKrak
              ? num(b, "cm", null, [[o - c, "Kraka sta dva in enako dolga – razliko razdeli na pol."], [o / 3, "Trikotnik ni enakostraničen."]])
              : num(c, "cm", null, [[o - b, "Kraka sta dva – odšteti moraš oba."], [o / 3, "Trikotnik ni enakostraničen."]]),
            hint: "Enakokraki trikotnik ima dva enaka kraka: $o = c + 2b$.",
            given: askKrak ? [dat("o", o, "cm"), dat("c", c, "cm")] : [dat("o", o, "cm"), dat("b", b, "cm")],
            find: [askKrak ? "b" : "c"],
            formula: "o = c + 2b",
            steps: askKrak ? [`$2b = ${o} - ${c} = ${o - c}$`, `$b = ${o - c} : 2 = ${qty(b, "cm")}$`] : [`$c = o - 2b$`, `$c = ${o} - 2 \\cdot ${b} = ${qty(c, "cm")}$`],
          });
        }
        const ok = r.next() < 0.5;
        const a = r.int(2, 9);
        const b = r.int(2, 9);
        const c = ok ? r.int(Math.abs(a - b) + 1, a + b - 1) : a + b + r.int(0, 3);
        const sides = r.shuffle([a, b, c]);
        const srt = [...sides].sort((x, y) => x - y);
        const YES = "Da, trikotnik lahko načrtamo.";
        const NO = "Ne, ker vsota krajših dveh stranic ni večja od najdaljše.";
        const EQ = "Ne, ker stranice niso enako dolge.";
        const correct = ok ? YES : NO;
        return T({
          text: `Ali lahko načrtamo trikotnik s stranicami $${sides.map((x) => `${x}\\ \\mathrm{cm}`).join(",\\ ")}$?`,
          answer: choice(
            r,
            correct,
            [
              [ok ? NO : YES, ok ? "Vsota krajših dveh stranic je večja od najdaljše – pogoj je izpolnjen." : "Preveri trikotniško neenakost: vsota krajših dveh mora biti večja od najdaljše."],
              [EQ, "Stranice trikotnika so lahko različno dolge."],
            ],
          ),
          hint: "Seštej krajši dve stranici in vsoto primerjaj z najdaljšo.",
          given: sides.map((x, i) => dat("abc"[i], x, "cm")),
          find: ["\\text{ali trikotnik obstaja}"],
          formula: "a + b > c \\text{ (za najdaljšo stranico } c)",
          steps: [`$${srt[0]} + ${srt[1]} = ${srt[0] + srt[1]}$ in najdaljša stranica je $${srt[2]}$.`, `$${srt[0] + srt[1]} ${srt[0] + srt[1] > srt[2] ? ">" : srt[0] + srt[1] === srt[2] ? "=" : "<"} ${srt[2]}$ – ${ok ? "trikotnik obstaja" : "trikotnik ne obstaja"}.`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.int(3, 12);
        const b = r.int(3, 12);
        const n = 2 * Math.min(a, b) - 1;
        return T({
          text: `Dve stranici trikotnika merita $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Koliko različnih trikotnikov lahko načrtamo, če mora biti tretja stranica dolga celo število centimetrov?`,
          answer: num(n, null, null, [
            [n + 2, "Tretja stranica ne sme biti enaka vsoti ali razliki drugih dveh."],
            [a + b - 1, "Tretja stranica mora biti tudi daljša od razlike drugih dveh."],
          ]),
          hint: "Poišči najkrajšo in najdaljšo možno celoštevilsko tretjo stranico in preštej vse vmes.",
          given: [dat("a", a, "cm"), dat("b", b, "cm")],
          find: ["\\text{število možnih } c"],
          formula: "|a - b| < c < a + b",
          steps: [`$${Math.abs(a - b)} < c < ${a + b}$`, `Možne vrednosti: od $${Math.abs(a - b) + 1}$ do $${a + b - 1}$.`, `Število: $${a + b - 1} - ${Math.abs(a - b) + 1} + 1 = ${n}$`],
        });
      }
      if (t === 1) {
        const vrh = r.next() < 0.5;
        const g0 = vrh ? 2 * r.int(10, 80) : 0;
        const al = vrh ? (180 - g0) / 2 : r.int(20, 85);
        const ans = vrh ? al : 180 - 2 * al;
        return T({
          text: vrh
            ? `Enakokraki trikotnik načrtamo iz osnovnice in kota ob vrhu $\\gamma = ${g0}^\\circ$. Koliko meri vsak od kotov ob osnovnici?`
            : `Enakokraki trikotnik načrtamo iz osnovnice in kota ob osnovnici $\\alpha = ${al}^\\circ$. Koliko meri kot ob vrhu $\\gamma$?`,
          answer: vrh ? num(ans, "°", null, [[180 - g0, "Kota ob osnovnici sta dva in enaka – preostanek razdeli na pol."]]) : num(ans, "°", null, [[180 - al, "Kota ob osnovnici sta dva: oba odštej."], [90 - al, "Vsota kotov je 180°, ne 90°."]]),
          hint: "V enakokrakem trikotniku sta kota ob osnovnici enaka; vsota vseh kotov je 180°.",
          given: [vrh ? an("\\gamma", g0) : an("\\alpha = \\beta", al)],
          find: [vrh ? "\\alpha,\\ \\beta" : "\\gamma"],
          formula: "2\\alpha + \\gamma = 180^\\circ",
          steps: vrh ? [`$2\\alpha = 180^\\circ - ${g0}^\\circ = ${180 - g0}^\\circ$`, `$\\alpha = ${180 - g0}^\\circ : 2 = ${al}^\\circ$`] : [`$\\gamma = 180^\\circ - 2 \\cdot ${al}^\\circ$`, `$\\gamma = ${ans}^\\circ$`],
        });
      }
      let g0, d;
      do {
        g0 = r.int(30, 110);
        d = r.int(5, 40);
      } while ((180 - g0 - d) % 2 !== 0 || 180 - g0 - d < 20);
      const al = (180 - g0 - d) / 2;
      return T({
        text: `Za načrtovanje trikotnika po izreku KSK potrebujemo kota ob stranici c. Znano je: $\\gamma = ${g0}^\\circ$, kot $\\beta$ pa je za $${d}^\\circ$ večji od kota $\\alpha$. Koliko meri kot $\\alpha$?`,
        answer: num(al, "°", null, [
          [(180 - g0) / 2, `Kota α in β nista enaka – β je za ${d}° večji.`],
          [al + d, "To je kot β."],
          [180 - g0 - d, "Ostanek je α + α – razdeli ga na pol."],
        ]),
        hint: "Zapiši enačbo: $\\alpha + (\\alpha + d) + \\gamma = 180^\\circ$.",
        given: [an("\\gamma", g0), `\\beta = \\alpha + ${d}^\\circ`],
        find: ["\\alpha"],
        formula: "\\alpha + \\beta + \\gamma = 180^\\circ",
        steps: [`$\\alpha + \\alpha + ${d}^\\circ + ${g0}^\\circ = 180^\\circ$`, `$2\\alpha = ${180 - g0 - d}^\\circ$`, `$\\alpha = ${al}^\\circ$ (in $\\beta = ${al + d}^\\circ$)`],
      });
    },
  },
  {
    id: "dod-mat-os-znacilne-tocke",
    topics: ["MAT-OS-7/znacilne-tocke-trikotnika"],
    gen(level, r) {
      const u = r.pick(["cm", "mm"]);
      const an = (sym, v) => `${sym} = ${v}^\\circ`;
      if (level === 1) {
        if (r.next() < 0.5) {
          const LINES = ["simetrale stranic", "simetrale kotov", "težiščnice", "višine (njihove nosilke)"];
          const WHAT = {
            "simetrale stranic": "Simetrale stranic se sekajo v središču očrtane krožnice.",
            "simetrale kotov": "Simetrale kotov se sekajo v središču včrtane krožnice.",
            težiščnice: "Težiščnice se sekajo v težišču.",
            "višine (njihove nosilke)": "Nosilke višin se sekajo v višinski točki.",
          };
          const i = r.int(0, 3);
          const P = ["Središče trikotniku očrtane krožnice", "Središče trikotniku včrtane krožnice", "Težišče trikotnika", "Višinska točka trikotnika"][i];
          return T({
            text: `${P} je presečišče katerih premic?`,
            given: [`\\text{točka} = \\text{${P.toLowerCase()}}`],
            answer: choice(
              r,
              LINES[i],
              LINES.filter((_, k) => k !== i).map((l) => [l, WHAT[l]]),
            ),
            hint: i === 0 ? "Očrtana krožnica gre skozi vsa oglišča: središče je enako oddaljeno od vseh treh oglišč." : i === 1 ? "Včrtana krožnica se dotika vseh stranic: središče je enako oddaljeno od vseh treh stranic." : i === 2 ? "Težišče je povezano z razpolovišči stranic." : "Višina je pravokotna na stranico in gre skozi nasprotno oglišče.",
            find: ["\\text{premice}"],
            formula: "s_a, s_b, s_c \\to O;\\quad s_\\alpha, s_\\beta, s_\\gamma \\to S;\\quad t_a, t_b, t_c \\to T;\\quad v_a, v_b, v_c \\to V",
            steps: [WHAT[LINES[i]], `Odgovor: ${LINES[i]}.`],
          });
        }
        const k = r.int(2, 12);
        const t = 3 * k;
        return T({
          text: `Težiščnica $t_a$ trikotnika ABC meri $${t}\\ \\mathrm{${u}}$. Kolikšna je razdalja od oglišča A do težišča T?`,
          answer: num(2 * k, u, null, [
            [t / 2, "Težišče ni razpolovišče težiščnice."],
            [k, "To je razdalja od težišča do razpolovišča stranice."],
          ]),
          hint: "Težišče deli vsako težiščnico v razmerju 2 : 1, merjeno od oglišča.",
          given: [dat("t_a", t, u)],
          find: ["|AT|"],
          formula: "|AT| = \\dfrac{2}{3}\\, t_a",
          steps: [`Težiščnico razdelimo na 3 enake dele: $${t} : 3 = ${k}$`, `$|AT| = 2 \\cdot ${k} = ${qty(2 * k, u)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const k = r.int(2, 12);
          return T({
            text: `Težišče T trikotnika ABC je od oglišča B oddaljeno $${2 * k}\\ \\mathrm{${u}}$. Koliko meri težiščnica $t_b$?`,
            answer: num(3 * k, u, null, [
              [4 * k, "Težišče ni razpolovišče težiščnice – deli jo v razmerju 2 : 1."],
              [6 * k, "Večji del težiščnice (2 dela od 3) je ob oglišču."],
            ]),
            hint: "Razdalja od oglišča do težišča sta 2 dela od 3. Koliko je en del?",
            given: [dat("|BT|", 2 * k, u)],
            find: ["t_b"],
            formula: "|BT| : |TB_1| = 2 : 1",
            steps: [`En del: $${2 * k} : 2 = ${k}$`, `$t_b = 3 \\cdot ${k} = ${qty(3 * k, u)}$`],
          });
        }
        if (t === 1) {
          const x = r.dec(2, 9, 1);
          return T({
            text: `V trikotniku ABC je težišče T od oglišča C oddaljeno $${tx(x)}\\ \\mathrm{cm}$. Koliko cm je težišče oddaljeno od razpolovišča stranice c?`,
            answer: num(x / 2, "cm", null, [
              [x, "Težišče ni razpolovišče težiščnice."],
              [2 * x, "Del od težišča do stranice je krajši – je polovica dela od oglišča."],
            ]),
            hint: "Težišče deli težiščnico v razmerju 2 : 1 (večji del je ob oglišču).",
            given: [dat("|CT|", tx(x), "cm")],
            find: ["|TC_1|"],
            formula: "|CT| : |TC_1| = 2 : 1",
            steps: [`$|TC_1| = |CT| : 2$`, `$|TC_1| = ${tx(x)} : 2 = ${qty(tx(x / 2), "cm")}$`],
          });
        }
        const type = r.int(0, 2);
        let ang;
        if (type === 0) {
          do ang = [r.int(45, 85), r.int(45, 85)];
          while (180 - ang[0] - ang[1] >= 90 || 180 - ang[0] - ang[1] < 10);
        } else if (type === 1) ang = [90, r.int(20, 70)];
        else ang = [r.int(95, 140), r.int(10, 35)];
        ang.push(180 - ang[0] - ang[1]);
        ang = r.shuffle(ang);
        const which = r.int(0, 2);
        const PT = ["središče očrtane krožnice", "višinska točka", "središče včrtane krožnice"][which];
        const IN = "znotraj trikotnika";
        const OUT = "zunaj trikotnika";
        const ON = which === 0 ? "v razpolovišču najdaljše stranice" : which === 1 ? "v oglišču pravega kota" : "na eni od stranic";
        const correct = which === 2 ? IN : [IN, ON, OUT][type];
        const vrsta = ["ostrokotni", "pravokotni", "topokotni"][type];
        const WHY = {
          [IN]: which === 2 ? "" : `Znotraj leži le pri ostrokotnem trikotniku.`,
          [OUT]: which === 2 ? "Včrtana krožnica leži vedno v trikotniku, zato tudi njeno središče." : "Zunaj leži le pri topokotnem trikotniku.",
          [ON]: which === 2 ? "Središče včrtane krožnice je enako oddaljeno od vseh stranic, zato ne more ležati na stranici." : "To velja le za pravokotni trikotnik.",
        };
        return T({
          text: `Notranji koti trikotnika merijo $${ang.map((x) => `${x}^\\circ`).join(",\\ ")}$. Kje leži ${PT}?`,
          answer: choice(
            r,
            correct,
            [IN, OUT, ON].filter((o) => o !== correct).map((o) => [o, WHY[o]]),
          ),
          hint: "Najprej ugotovi, ali je trikotnik ostrokoten, pravokoten ali topokoten.",
          given: ang.map((x, i) => an(["\\alpha", "\\beta", "\\gamma"][i], x)),
          find: [`\\text{lega: ${PT}}`],
          formula: "\\text{ostrokotni: vsi koti} < 90^\\circ;\\ \\text{topokotni: en kot} > 90^\\circ",
          steps: [`Trikotnik je ${vrsta}.`, which === 2 ? "Središče včrtane krožnice je vedno znotraj trikotnika." : `Pri ${vrsta.replace(/i$/, "em")} trikotniku leži ${PT} ${correct}.`],
        });
      }
      // raven 3: enakostranični trikotnik
      const kind = r.int(0, 2);
      const k = r.int(2, 10);
      if (kind === 0) {
        const v = 3 * k;
        const askR = r.next() < 0.5;
        return T({
          text: `Višina enakostraničnega trikotnika meri $${v}\\ \\mathrm{${u}}$. Koliko meri polmer ${askR ? "očrtane" : "včrtane"} krožnice?`,
          answer: num(askR ? 2 * k : k, u, null, askR ? [[k, "To je polmer včrtane krožnice."], [v / 2, "Središče ne razpolavlja višine – deli jo v razmerju 2 : 1."]] : [[2 * k, "To je polmer očrtane krožnice."], [v / 2, "Središče ne razpolavlja višine – deli jo v razmerju 2 : 1."]]),
          hint: "V enakostraničnem trikotniku sovpadajo višine, težiščnice in simetrale. Središče obeh krožnic je težišče.",
          given: [dat("v", v, u)],
          find: [askR ? "R" : "r"],
          formula: ["R = \\dfrac{2}{3}\\, v", "r = \\dfrac{1}{3}\\, v"],
          steps: ["Višina je hkrati težiščnica; težišče jo deli v razmerju 2 : 1.", askR ? `$R = \\dfrac{2}{3} \\cdot ${v} = ${qty(2 * k, u)}$` : `$r = \\dfrac{1}{3} \\cdot ${v} = ${qty(k, u)}$`],
        });
      }
      if (kind === 1) {
        const R = 2 * k;
        return T({
          text: `Polmer krožnice, očrtane enakostraničnemu trikotniku, meri $${R}\\ \\mathrm{${u}}$. Koliko meri polmer včrtane krožnice?`,
          answer: num(k, u, null, [
            [R, "Krožnici imata skupno središče, a različna polmera."],
            [R / 3, "Polmer včrtane krožnice je polovica polmera očrtane."],
          ]),
          hint: "Težišče deli višino v razmerju 2 : 1: R je večji del, r manjši.",
          given: [dat("R", R, u)],
          find: ["r"],
          formula: "R : r = 2 : 1",
          steps: [`$R = \\dfrac{2}{3}v$ in $r = \\dfrac{1}{3}v$, zato $r = \\dfrac{R}{2}$.`, `$r = ${R} : 2 = ${qty(k, u)}$`],
        });
      }
      const rr = k;
      return T({
        text: `Polmer krožnice, včrtane enakostraničnemu trikotniku, meri $${rr}\\ \\mathrm{${u}}$. Koliko meri višina trikotnika?`,
        answer: num(3 * rr, u, null, [
          [2 * rr, "To je polmer očrtane krožnice."],
          [rr * 2 + rr * 2, "Višina je sestavljena iz R in r, ne iz dveh R."],
        ]),
        hint: "Višina = R + r, pri čemer je R dvakrat večji od r.",
        given: [dat("r", rr, u)],
        find: ["v"],
        formula: ["v = R + r", "R = 2r"],
        steps: [`$R = 2 \\cdot ${rr} = ${qty(2 * rr, u)}$`, `$v = R + r = ${2 * rr} + ${rr} = ${qty(3 * rr, u)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-vrste-stirikotnikov",
    topics: ["MAT-OS-7/vrste-stirikotnikov"],
    gen(level, r) {
      const an = (s, v) => `${s} = ${v}^\\circ`;
      if (level === 1) {
        if (r.next() < 0.5) {
          const D = [
            ["romb", "ima vse štiri stranice enako dolge, njegovi koti pa niso pravi"],
            ["trapez", "ima natanko en par vzporednih stranic"],
            ["deltoid", "ima dva para enako dolgih sosednjih stranic, vse štiri stranice pa niso enake"],
            ["paralelogram", "ima dva para vzporednih stranic, sosednji stranici nista enako dolgi in koti niso pravi"],
            ["pravokotnik", "ima štiri prave kote, sosednji stranici pa nista enako dolgi"],
          ];
          const WHY = {
            romb: "Romb ima vse štiri stranice enako dolge.",
            trapez: "Trapez ima natanko en par vzporednih stranic.",
            deltoid: "Deltoid ima dva para enako dolgih sosednjih stranic.",
            paralelogram: "Paralelogram ima dva para vzporednih stranic, sosednji pa nista nujno enaki.",
            pravokotnik: "Pravokotnik ima štiri prave kote.",
          };
          const [ok, desc] = r.pick(D);
          const others = r.shuffle(D.map((d) => d[0]).filter((x) => x !== ok)).slice(0, 3);
          return T({
            text: `Kateri štirikotnik ${desc}?`,
            given: [`\\text{lastnosti} = \\text{${desc}}`],
            answer: choice(
              r,
              ok,
              others.map((o) => [o, WHY[o]]),
            ),
            hint: "Preveri vzporednost stranic, dolžine stranic in velikost kotov.",
            find: ["\\text{vrsta štirikotnika}"],
            formula: "\\text{paralelogram: } a \\parallel c,\\ b \\parallel d;\\quad \\text{trapez: } a \\parallel c",
            steps: [`Lastnost: ${desc}.`, `To je ${ok}.`],
          });
        }
        const a = r.int(35, 145);
        const askB = r.next() < 0.6;
        return T({
          text: `V paralelogramu ABCD meri kot $\\alpha = ${a}^\\circ$. Koliko meri kot ${askB ? "$\\beta$" : "$\\gamma$"}?`,
          answer: askB ? num(180 - a, "°", null, [[a, "Sosednja kota paralelograma skupaj merita 180°; enaka sta nasprotna kota."], [360 - a, "Sosednja kota skupaj merita 180°, ne 360°."]]) : num(a, "°", null, [[180 - a, "Nasprotna kota paralelograma sta enaka; 180° merita skupaj sosednja kota."]]),
          hint: "Nasprotna kota paralelograma sta enaka, sosednja kota skupaj merita 180°.",
          given: [an("\\alpha", a)],
          find: [askB ? "\\beta" : "\\gamma"],
          formula: ["\\alpha + \\beta = 180^\\circ", "\\gamma = \\alpha"],
          steps: askB ? [`$\\alpha$ in $\\beta$ sta sosednja kota: $\\alpha + \\beta = 180^\\circ$.`, `$\\beta = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ$`] : [`$\\alpha$ in $\\gamma$ sta nasprotna kota.`, `$\\gamma = \\alpha = ${a}^\\circ$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const kind = r.int(0, 3);
          const a = r.dec(2, 9, 1);
          const b = r.dec(2, 9, 1);
          const c = r.dec(1.5, Math.max(1.6, a - 0.5), 1);
          const [text, ans, mis, form, given] = [
            [`Romb ima stranico $a = ${tx(a)}\\ \\mathrm{cm}$. Koliko cm meri njegov obseg?`, 4 * a, [[2 * a, "Romb ima štiri enako dolge stranice."]], "o = 4a", [dat("a", tx(a), "cm")]],
            [`Deltoid ima stranici $a = ${tx(a)}\\ \\mathrm{cm}$ in $b = ${tx(b)}\\ \\mathrm{cm}$. Koliko cm meri njegov obseg?`, 2 * (a + b), [[a + b, "Deltoid ima po dve stranici dolžine a in b."]], "o = 2a + 2b", [dat("a", tx(a), "cm"), dat("b", tx(b), "cm")]],
            [`Enakokraki trapez ima osnovnici $a = ${tx(a)}\\ \\mathrm{cm}$ in $c = ${tx(c)}\\ \\mathrm{cm}$ ter krak $b = ${tx(b)}\\ \\mathrm{cm}$. Koliko cm meri obseg?`, a + c + 2 * b, [[a + c + b, "Enakokraki trapez ima dva enako dolga kraka."]], "o = a + c + 2b", [dat("a", tx(a), "cm"), dat("c", tx(c), "cm"), dat("b", tx(b), "cm")]],
            [`Paralelogram ima stranici $a = ${tx(a)}\\ \\mathrm{cm}$ in $b = ${tx(b)}\\ \\mathrm{cm}$. Koliko cm meri njegov obseg?`, 2 * (a + b), [[a + b, "Paralelogram ima po dve enaki nasprotni stranici."]], "o = 2a + 2b", [dat("a", tx(a), "cm"), dat("b", tx(b), "cm")]],
          ][kind];
          const v = roundHalfUp(ans, 1);
          return T({
            text,
            answer: num(v, "cm", 1, mis),
            hint: "Obseg je vsota dolžin vseh štirih stranic. Katere stranice so enake?",
            given,
            find: ["o"],
            formula: form,
            steps: [`$${form}$`, `$o = ${qty(tx(v), "cm")}$`],
          });
        }
        if (t === 1) {
          const a = r.int(40, 85);
          const askG = r.next() < 0.5;
          return T({
            text: `V enakokrakem trapezu ABCD ($AB \\parallel CD$) meri kot $\\alpha = ${a}^\\circ$. Koliko meri kot ${askG ? "$\\gamma$" : "$\\beta$"}?`,
            answer: askG ? num(180 - a, "°", null, [[a, "Kota ob istem kraku skupaj merita 180°."]]) : num(a, "°", null, [[180 - a, "Pri enakokrakem trapezu sta kota ob isti osnovnici enaka."]]),
            hint: "Pri enakokrakem trapezu sta kota ob isti osnovnici enaka, kota ob istem kraku pa skupaj merita 180°.",
            given: [an("\\alpha", a)],
            find: [askG ? "\\gamma" : "\\beta"],
            formula: ["\\alpha = \\beta,\\quad \\gamma = \\delta", "\\alpha + \\delta = 180^\\circ"],
            steps: askG ? [`$\\beta = \\alpha = ${a}^\\circ$ (ob osnovnici AB).`, `$\\gamma = 180^\\circ - \\beta = ${180 - a}^\\circ$`] : [`$\\alpha$ in $\\beta$ ležita ob isti osnovnici.`, `$\\beta = \\alpha = ${a}^\\circ$`],
          });
        }
        let a, c;
        do {
          a = r.int(40, 140);
          c = r.int(40, 140);
        } while ((360 - a - c) % 2 !== 0 || 360 - a - c < 60 || 360 - a - c > 300);
        const b = (360 - a - c) / 2;
        return T({
          text: `V deltoidu ABCD je diagonala AC simetrala. Kot $\\alpha = ${a}^\\circ$ in kot $\\gamma = ${c}^\\circ$. Koliko meri kot $\\beta$?`,
          answer: num(b, "°", null, [
            [360 - a - c, "Kota β in δ sta enaka – preostanek razdeli na pol."],
            [180 - a, "V deltoidu sosednja kota nista nujno suplementarna."],
          ]),
          hint: "Vsota kotov štirikotnika je 360°. Kota β in δ sta v deltoidu enaka.",
          given: [an("\\alpha", a), an("\\gamma", c)],
          find: ["\\beta"],
          formula: ["\\alpha + \\beta + \\gamma + \\delta = 360^\\circ", "\\beta = \\delta"],
          steps: [`$\\beta + \\delta = 360^\\circ - ${a}^\\circ - ${c}^\\circ = ${360 - a - c}^\\circ$`, `$\\beta = ${360 - a - c}^\\circ : 2 = ${b}^\\circ$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const kind = r.int(0, 2);
        const a = r.int(3, 15);
        const b = r.int(2, 12);
        const o = kind === 0 ? 4 * a : 2 * (a + b);
        const [text, ans, mis] = [
          [`Obseg romba meri $${o}\\ \\mathrm{cm}$. Koliko cm meri njegova stranica?`, a, [[o / 2, "Romb ima štiri enake stranice."]]],
          [`Paralelogram ima obseg $${o}\\ \\mathrm{cm}$ in stranico $a = ${a}\\ \\mathrm{cm}$. Koliko cm meri stranica b?`, b, [[o - a, "Stranica a nastopa v obsegu dvakrat."], [o - 2 * a, "Ostanek obsega sta dve stranici b – razdeli ga na pol."]]],
          [`Deltoid ima obseg $${o}\\ \\mathrm{cm}$ in stranico $a = ${a}\\ \\mathrm{cm}$. Koliko cm meri druga stranica b?`, b, [[o - a, "Stranica a nastopa v obsegu dvakrat."], [o - 2 * a, "Ostanek obsega sta dve stranici b – razdeli ga na pol."]]],
        ][kind];
        return T({
          text,
          answer: num(ans, "cm", null, mis),
          hint: kind === 0 ? "Romb ima štiri enako dolge stranice." : "V obsegu nastopa vsaka od stranic a in b dvakrat.",
          given: kind === 0 ? [dat("o", o, "cm")] : [dat("o", o, "cm"), dat("a", a, "cm")],
          find: [kind === 0 ? "a" : "b"],
          formula: kind === 0 ? "o = 4a" : "o = 2a + 2b",
          steps: kind === 0 ? [`$a = o : 4$`, `$a = ${o} : 4 = ${qty(a, "cm")}$`] : [`$2b = ${o} - 2 \\cdot ${a} = ${o - 2 * a}$`, `$b = ${o - 2 * a} : 2 = ${qty(b, "cm")}$`],
        });
      }
      if (t === 1) {
        let k;
        do k = r.int(2, 8);
        while (180 % (k + 1) !== 0);
        const be = 180 / (k + 1);
        return T({
          text: `V paralelogramu je kot $\\alpha$ ${k}-krat večji od kota $\\beta$. Koliko meri kot $\\alpha$?`,
          answer: num(k * be, "°", null, [
            [be, "To je kot β."],
            [180 / k, `Sosednja kota skupaj tvorita ${k + 1} enakih delov.`],
            [(360 / (k + 1)) * k, "Sosednja kota paralelograma skupaj merita 180°, ne 360°."],
          ]),
          hint: "Sosednja kota paralelograma skupaj merita 180°.",
          given: ["\\text{lik} = \\text{paralelogram}", `\\alpha = ${k} \\cdot \\beta`],
          find: ["\\alpha"],
          formula: "\\alpha + \\beta = 180^\\circ",
          steps: [`$${k}\\beta + \\beta = 180^\\circ$, torej $${k + 1}\\beta = 180^\\circ$`, `$\\beta = ${be}^\\circ$`, `$\\alpha = ${k} \\cdot ${be}^\\circ = ${k * be}^\\circ$`],
        });
      }
      const a = r.int(45, 85);
      let c;
      do c = r.int(95, 140);
      while (c === 180 - a);
      return T({
        text: `V trapezu ABCD ($AB \\parallel CD$) merita kota $\\alpha = ${a}^\\circ$ in $\\gamma = ${c}^\\circ$. Koliko meri kot $\\delta$?`,
        answer: num(180 - a, "°", null, [
          [180 - c, "Kot δ leži ob istem kraku (AD) kot α, ne kot γ."],
          [a, "Trapez ni enakokrak – kota nista nujno enaka."],
        ]),
        hint: "Kota ob istem kraku trapeza skupaj merita 180°. Ob katerem kraku ležita α in δ?",
        given: [an("\\alpha", a), an("\\gamma", c)],
        find: ["\\delta"],
        formula: ["\\alpha + \\delta = 180^\\circ", "\\beta + \\gamma = 180^\\circ"],
        steps: [`Kota α in δ ležita ob kraku AD.`, `$\\delta = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ$`],
      });
    },
  },
  {
    id: "dod-mat-os-konstrukcije-stirikotnikov",
    topics: ["MAT-OS-7/konstrukcije-stirikotnikov"],
    gen(level, r) {
      if (level === 1) {
        const t1 = r.int(0, 2);
        if (t1 === 2) {
          const sq = r.next() < 0.5;
          const a = r.next() < 0.5 ? r.int(2, 15) : r.dec(1.5, 9.5, 1);
          const o = roundHalfUp(4 * a, 1);
          return T({
            text: `Za načrtovanje ${sq ? "kvadrata" : "romba"} potrebujemo dolžino stranice. Znan je obseg $o = ${tx(o)}\\ \\mathrm{cm}$. Koliko cm meri stranica?`,
            answer: num(a, "cm", null, [
              [o / 2, `${sq ? "Kvadrat" : "Romb"} ima štiri enako dolge stranice.`],
              [o - 4, "Obseg deli s 4, ne odštevaj."],
            ]),
            hint: `${sq ? "Kvadrat" : "Romb"} ima štiri enako dolge stranice.`,
            given: [dat("o", tx(o), "cm")],
            find: ["a"],
            formula: "o = 4a",
            steps: ["$a = o : 4$", `$a = ${tx(o)} : 4 = ${qty(tx(a), "cm")}$`],
          });
        }
        if (t1 === 0) {
          const C = [
            ["kvadrat", 1, [[2, "Kvadrat je določen že z dolžino stranice (ali diagonale)."]]],
            ["pravokotnik", 2, [[3, "Pri pravokotniku so vsi koti pravi – zadoščata dve dolžini."], [1, "Ena dolžina ne določi oblike pravokotnika."]]],
            ["romb", 2, [[1, "Sama stranica ne določi oblike romba – potreben je še kot ali diagonala."], [3, "Romb ima vse stranice enake – zadoščata stranica in kot."]]],
            ["paralelogram", 3, [[2, "Potrebujemo dve stranici in kot (ali diagonalo)."], [4, "Nasprotni stranici sta enaki – zadoščajo trije podatki."]]],
            ["deltoid", 3, [[2, "Potrebujemo dve stranici in še kot ali diagonalo."], [4, "Zaradi simetrije zadoščajo trije podatki."]]],
            ["trapez", 4, [[3, "Trije podatki ne zadoščajo – potrebni so štirje (npr. a, c, b in α)."], [5, "Vzporednost osnovnic nadomesti en podatek – zadoščajo štirje."]]],
            ["splošni štirikotnik", 5, [[4, "Splošni štirikotnik potrebuje pet podatkov (npr. štiri stranice in kot)."], [3, "Trije podatki določijo le trikotnik."]]],
          ];
          const [s, n, mis] = r.pick(C);
          return T({
            text: `Najmanj koliko podatkov (dolžin in kotov) potrebujemo, da enolično načrtamo ${s}?`,
            answer: num(n, null, null, mis),
            hint: "Upoštevaj, katere lastnosti lik že ima (enake stranice, vzporednice, pravi koti) – te podatke dobiš zastonj.",
            given: [`\\text{lik: ${s}}`],
            find: ["\\text{število podatkov}"],
            formula: "\\text{splošni štirikotnik: 5 podatkov; vsaka lastnost lika jih nadomesti nekaj}",
            steps: [`Lastnosti lika ${s} nadomestijo del podatkov.`, `Potrebujemo ${n} ${n === 1 ? "podatek" : n === 2 ? "podatka" : n < 5 ? "podatke" : "podatkov"}.`],
          });
        }
        const SETS = [
          { s: "romb", ok: "a in α", wrong: [["samo a", "Sama stranica ne določi oblike romba."], ["α in β", "Iz kotov ne dobimo dolžine stranice."], ["a in b", "Pri rombu je b = a – to je en sam podatek."]] },
          { s: "pravokotnik", ok: "a in diagonala e", wrong: [["samo e", "Ena dolžina ne določi oblike pravokotnika."], ["a in α", "Pri pravokotniku je α = 90° – to ni nov podatek."], ["e in f", "Diagonali pravokotnika sta enaki – to je en sam podatek."]] },
          { s: "kvadrat", ok: "diagonala e", wrong: [["kot α", "Vsi koti kvadrata so pravi – manjka dolžina."], ["kot med diagonalama", "Ta kot je pri kvadratu vedno 90° – manjka dolžina."], ["α in β", "Iz kotov ne dobimo dolžine."]] },
          { s: "paralelogram", ok: "a, b in α", wrong: [["a in b", "Manjka kot – paralelogram se lahko »nagne«."], ["a, c in α", "Pri paralelogramu je c = a – to ni nov podatek."], ["α in β", "Iz kotov ne dobimo dolžin."]] },
        ];
        const S = r.pick(SETS);
        return T({
          text: `Iz katerih podatkov lahko enolično načrtamo ${S.s}?`,
          answer: choice(r, S.ok, S.wrong),
          hint: "Pomisli, kateri podatki so pri tem liku že določeni z njegovimi lastnostmi.",
          given: [`\\text{lik: ${S.s}}`],
          find: ["\\text{zadostni podatki}"],
          formula: "\\text{podatki ne smejo biti odvisni drug od drugega}",
          steps: [`${S.s[0].toUpperCase()}${S.s.slice(1)} je določen s podatki: ${S.ok}.`, "Ostale možnosti vsebujejo premalo podatkov ali podatke, ki jih lik že ima."],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const b = r.int(35, 145);
          return T({
            text: `Paralelogram ABCD načrtamo iz stranic a, b in kota $\\beta = ${b}^\\circ$. Za risanje ob oglišču A potrebujemo kot $\\alpha$. Koliko meri?`,
            answer: num(180 - b, "°", null, [[b, "α in β sta sosednja kota – nista enaka, ampak skupaj merita 180°."], [360 - b, "Sosednja kota skupaj merita 180°."]]),
            hint: "Kakšna je zveza med sosednjima kotoma paralelograma?",
            given: [`\\beta = ${b}^\\circ`],
            find: ["\\alpha"],
            formula: "\\alpha + \\beta = 180^\\circ",
            steps: [`$\\alpha + \\beta = 180^\\circ$`, `$\\alpha = 180^\\circ - ${b}^\\circ = ${180 - b}^\\circ$`],
          });
        }
        if (t === 1) {
          const a = r.int(3, 15);
          const b = r.int(2, 12);
          const o = 2 * (a + b);
          return T({
            text: `Načrtati želimo pravokotnik z obsegom $${o}\\ \\mathrm{cm}$ in stranico $a = ${a}\\ \\mathrm{cm}$. Koliko cm meri stranica b?`,
            answer: num(b, "cm", null, [
              [o - a, "Stranica a nastopa v obsegu dvakrat."],
              [o - 2 * a, "Ostanek obsega sta dve stranici b – razdeli ga na pol."],
            ]),
            hint: "Obseg pravokotnika: $o = 2a + 2b$.",
            given: [dat("o", o, "cm"), dat("a", a, "cm")],
            find: ["b"],
            formula: "o = 2a + 2b",
            steps: [`$2b = ${o} - 2 \\cdot ${a} = ${o - 2 * a}$`, `$b = ${o - 2 * a} : 2 = ${qty(b, "cm")}$`],
          });
        }
        const e = r.dec(4, 14, 1);
        const f = r.dec(3, 10, 1);
        const askE = r.next() < 0.5;
        const x = askE ? e : f;
        return T({
          text: `Romb ABCD načrtamo iz diagonal $e = ${tx(e)}\\ \\mathrm{cm}$ in $f = ${tx(f)}\\ \\mathrm{cm}$. Diagonali se sekata v točki S. Koliko cm je točka S oddaljena od oglišča ${askE ? "A" : "B"}?`,
          answer: num(x / 2, "cm", null, [
            [x, "Diagonali romba se razpolavljata – S je razpolovišče."],
            [(askE ? f : e) / 2, `Oglišče ${askE ? "A leži na diagonali e = AC" : "B leži na diagonali f = BD"}.`],
          ]),
          hint: "Diagonali romba sta pravokotni in se razpolavljata.",
          given: [dat("e", tx(e), "cm"), dat("f", tx(f), "cm")],
          find: [askE ? "|AS|" : "|BS|"],
          formula: "|AS| = \\dfrac{e}{2},\\quad |BS| = \\dfrac{f}{2}",
          steps: [`Oglišče ${askE ? "A leži na diagonali e" : "B leži na diagonali f"}, S je njeno razpolovišče.`, `$${askE ? "|AS|" : "|BS|"} = ${tx(x)} : 2 = ${qty(tx(x / 2), "cm")}$`],
        });
      }
      // raven 3
      if (r.next() < 0.5) {
        const c = r.int(3, 10);
        const a = c + 2 * r.int(1, 5);
        return T({
          text: `Enakokraki trapez ABCD ima osnovnici $a = ${a}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$. Pri načrtovanju iz višine narišemo nožišče višine iz oglišča D na osnovnico AB. Koliko cm je to nožišče oddaljeno od oglišča A?`,
          answer: num((a - c) / 2, "cm", null, [
            [a - c, "Razlika osnovnic se razdeli na dva enaka dela – na vsaki strani enega."],
            [(a + c) / 2, "To je srednjica trapeza."],
          ]),
          hint: "Nariši skico. Krajša osnovnica »sedi« na sredini daljše – koliko ostane na vsaki strani?",
          given: [dat("a", a, "cm"), dat("c", c, "cm")],
          find: ["|AD'|"],
          formula: "|AD'| = \\dfrac{a - c}{2}",
          steps: [`Razlika osnovnic: $${a} - ${c} = ${a - c}$`, `Na vsaki strani: $${a - c} : 2 = ${qty((a - c) / 2, "cm")}$`],
        });
      }
      let p, q;
      do {
        p = r.int(1, 5);
        q = r.int(2, 7);
      } while (p >= q || gcd(p, q) !== 1);
      const k = r.int(1, 4);
      const o = 2 * k * (p + q);
      const askLong = r.next() < 0.5;
      return T({
        text: `Načrtati želimo pravokotnik z obsegom $${o}\\ \\mathrm{cm}$, pri katerem sta stranici v razmerju $${p} : ${q}$. Koliko cm meri ${askLong ? "daljša" : "krajša"} stranica?`,
        answer: num(askLong ? q * k : p * k, "cm", null, [
          [askLong ? (o * q) / (p + q) : (o * p) / (p + q), "Obseg vsebuje vsako stranico dvakrat – razdeli najprej polovico obsega."],
          [askLong ? p * k : q * k, `To je ${askLong ? "krajša" : "daljša"} stranica.`],
        ]),
        hint: `Polovica obsega je $a + b$. To vsoto razdeli v razmerju $${p} : ${q}$.`,
        given: [dat("o", o, "cm"), `a : b = ${p} : ${q}`],
        find: [askLong ? "b" : "a"],
        formula: ["a + b = \\dfrac{o}{2}", "\\text{en del} = \\dfrac{a + b}{p + q}"],
        steps: [`$a + b = ${o} : 2 = ${o / 2}$`, `En del: $${o / 2} : ${p + q} = ${k}$`, `${askLong ? "Daljša" : "Krajša"} stranica: $${askLong ? q : p} \\cdot ${k} = ${qty(askLong ? q * k : p * k, "cm")}$`],
      });
    },
  },
  {
    id: "dod-mat-os-aritmeticna-sredina",
    topics: ["MAT-OS-7/aritmeticna-sredina"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const CTX = [
        { lo: 2, hi: 12, unit: "km", txt: (v) => `${name} je v ${v.length} dneh ${g(name, "pretekel", "pretekla")} ${v.map((x) => `${x} km`).join(", ")}.`, q: `Koliko kilometrov je v povprečju ${g(name, "pretekel", "pretekla")} na dan?` },
        { lo: 8, hi: 24, unit: "°C", txt: (v) => `Temperature ob 7. uri so bile v ${v.length} zaporednih dneh: ${v.map((x) => `${x} °C`).join(", ")}.`, q: "Kolikšna je bila povprečna temperatura?" },
        { lo: 5, hi: 30, unit: null, txt: (v) => `Košarkarica je na ${v.length} tekmah dosegla ${v.join(", ")} točk.`, q: "Koliko točk je v povprečju dosegla na tekmo?" },
        { lo: 120, hi: 220, unit: "g", txt: (v) => `${name} je stehtal${g(name, "", "a")} ${v.length} jabolk: ${v.map((x) => `${x} g`).join(", ")}.`, q: "Kolikšna je povprečna masa jabolka?" },
      ];
      const C = r.pick(CTX);
      if (level === 1) {
        const n = r.int(3, 6);
        let v;
        do {
          const m = r.int(C.lo + 2, C.hi - 2);
          v = Array.from({ length: n - 1 }, () => r.int(C.lo, C.hi));
          v.push(n * m - sum(v));
        } while (v[n - 1] < C.lo || v[n - 1] > C.hi);
        const s = sum(v);
        return T({
          text: `${C.txt(v)} ${C.q}`,
          answer: num(s / n, C.unit, null, [
            [s, "Vsoto moraš še deliti s številom podatkov."],
            [s / (n - 1), `Podatkov je ${n} – deli z ${n}.`],
          ]),
          hint: "Seštej vse podatke in vsoto deli s številom podatkov.",
          given: v.map((x, i) => `x_{${i + 1}} = ${x}`),
          find: ["\\bar{x}"],
          formula: "\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}",
          steps: [`Vsota: $${v.join(" + ")} = ${s}$`, `$\\bar{x} = ${s} : ${n} = ${s / n}${C.unit === "°C" ? "\\ ^\\circ\\mathrm{C}" : C.unit ? `\\ \\mathrm{${C.unit}}` : ""}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const n = r.int(4, 7);
          const v = Array.from({ length: n }, () => r.int(1, 5));
          if (sum(v) % n === 0) v[0] = v[0] === 5 ? 4 : v[0] + 1;
          const s = sum(v);
          return T({
            text: `${name} ima pri matematiki ocene ${v.join(", ")}. Kolikšna je povprečna ocena? Zaokroži na dve decimalki.`,
            answer: num(s / n, null, 2, [
              [s / (n - 1), `Ocen je ${n} – deli z ${n}.`],
              [s / (n + 1), `Ocen je ${n}.`],
            ]),
            hint: "Seštej vse ocene in vsoto deli s številom ocen.",
            given: v.map((x, i) => `x_{${i + 1}} = ${x}`),
            find: ["\\bar{x}"],
            formula: "\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}",
            steps: [`Vsota: $${v.join(" + ")} = ${s}$`, `$\\bar{x} = ${s} : ${n} ${eq(s / n, 2)} ${tx(s / n, 2)}$`],
          });
        }
        const n = r.int(5, 7);
        const v = Array.from({ length: n }, () => r.int(8, 40));
        v[r.int(0, n - 1)] = 0;
        const s = sum(v);
        return T({
          text: `${name} je ${n} dni zapored bral${g(name, "", "a")} knjigo. Po dnevih je prebral${g(name, "", "a")} ${v.join(", ")} strani. Koliko strani je v povprečju prebral${g(name, "", "a")} na dan? Zaokroži na eno decimalko.`,
          answer: num(s / n, null, 1, [
            [s / (n - 1), "Tudi dan z 0 stranmi je podatek – deli z vsemi dnevi."],
            [s, "Vsoto deli s številom dni."],
          ]),
          hint: "Seštej strani vseh dni in deli s številom vseh dni – tudi tistega z 0.",
          given: v.map((x, i) => `x_{${i + 1}} = ${x}`),
          find: ["\\bar{x}"],
          formula: "\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}",
          steps: [`Vsota: $${v.join(" + ")} = ${s}$`, `$\\bar{x} = ${s} : ${n} ${eq(s / n, 1)} ${tx(s / n, 1)}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const n = r.int(4, 6);
        let v, m;
        do {
          m = r.int(14, 22);
          v = Array.from({ length: n - 1 }, () => r.int(10, 25));
        } while (n * m - sum(v) < 5 || n * m - sum(v) > 25);
        const x = n * m - sum(v);
        return T({
          text: `${name} je pisal${g(name, "", "a")} ${n} testov. Povprečno število točk je ${m}. Na prvih ${n - 1} testih je dosegel${g(name, "", "a")} ${v.join(", ")} točk. Koliko točk je dosegel${g(name, "", "a")} na zadnjem testu?`,
          answer: num(x, null, null, [
            [m, "Manjkajoči podatek ni enak povprečju."],
            [(n - 1) * m - sum(v), `Vsota vseh ${n} testov je ${n} · povprečje.`],
          ]),
          hint: "Iz povprečja izračunaj vsoto vseh točk, nato odštej znane.",
          given: [`\\bar{x} = ${m}`, `n = ${n}`, ...v.map((y, i) => `x_{${i + 1}} = ${y}`)],
          find: [`x_{${n}}`],
          formula: "x_1 + \\ldots + x_n = n \\cdot \\bar{x}",
          steps: [`Vsota vseh: $${n} \\cdot ${m} = ${n * m}$`, `Znani: $${v.join(" + ")} = ${sum(v)}$`, `Zadnji test: $${n * m} - ${sum(v)} = ${x}$`],
        });
      }
      if (t === 1) {
        const n1 = r.int(8, 16);
        const n2 = r.int(8, 16);
        const m1 = r.int(145, 160);
        // fantje so v povprečju višji: tehtano povprečje se tako razlikuje od navadnega povprečja obeh sredin
        const m2 = m1 + r.int(3, 10);
        const avg = (n1 * m1 + n2 * m2) / (n1 + n2);
        return T({
          text: `V razredu je ${n1} deklet s povprečno višino ${m1} cm in ${n2} fantov s povprečno višino ${m2} cm. Kolikšna je povprečna višina vseh učencev? Zaokroži na eno decimalko.`,
          answer: num(avg, "cm", 1, [[(m1 + m2) / 2, "Skupini nista enako veliki – upoštevaj število učencev."]]),
          hint: "Najprej izračunaj skupno višino vseh deklet in vseh fantov.",
          given: [`n_1 = ${n1}`, `\\bar{x}_1 = ${qty(m1, "cm")}`, `n_2 = ${n2}`, `\\bar{x}_2 = ${qty(m2, "cm")}`],
          find: ["\\bar{x}"],
          formula: "\\bar{x} = \\dfrac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2}",
          steps: [`Vsota: $${n1} \\cdot ${m1} + ${n2} \\cdot ${m2} = ${n1 * m1} + ${n2 * m2} = ${n1 * m1 + n2 * m2}$`, `$\\bar{x} = ${n1 * m1 + n2 * m2} : ${n1 + n2} ${eq(avg, 1)} ${qty(tx(avg, 1), "cm")}$`],
        });
      }
      const n = r.int(3, 6);
      const m = r.int(10, 30);
      const x = r.int(m + 3, m + 30);
      const nm = (n * m + x) / (n + 1);
      return T({
        text: `Povprečje ${n} števil je ${m}. Dodamo še število ${x}. Koliko je novo povprečje? Zaokroži na eno decimalko.`,
        answer: num(nm, null, 1, [
          [(m + x) / 2, "Novo povprečje ni povprečje stare sredine in novega števila."],
          [(n * m + x) / n, `Zdaj je števil ${n + 1}.`],
        ]),
        hint: "Iz starega povprečja izračunaj vsoto, prištej novo število in deli z novim številom podatkov.",
        given: [`\\bar{x} = ${m}`, `n = ${n}`, `x_{\\text{novi}} = ${x}`],
        find: ["\\bar{x}_{\\text{novo}}"],
        formula: "\\bar{x}_{\\text{novo}} = \\dfrac{n \\cdot \\bar{x} + x}{n + 1}",
        steps: [`Stara vsota: $${n} \\cdot ${m} = ${n * m}$`, `Nova vsota: $${n * m} + ${x} = ${n * m + x}$`, `$\\bar{x}_{\\text{novo}} = ${n * m + x} : ${n + 1} ${eq(nm, 1)} ${tx(nm, 1)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-tortni-prikaz",
    topics: ["MAT-OS-7/tortni-prikaz"],
    gen(level, r) {
      const TOP = r.pick([
        ["najljubše sadje", ["jabolka", "banane", "jagode", "grozdje"]],
        ["najljubši šport", ["nogomet", "košarka", "odbojka", "ples"]],
        ["način prihoda v šolo", ["peš", "s kolesom", "z avtobusom", "z avtom"]],
        ["najljubši letni čas", ["pomlad", "poletje", "jesen", "zima"]],
      ]);
      const [topic, cats] = TOP;
      const FORM = "\\alpha = \\dfrac{k}{N} \\cdot 360^\\circ";
      if (level === 1) {
        if (r.next() < 0.6) {
          const N = r.pick([12, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120]);
          const k = r.int(1, Math.floor(N / 2));
          const c = r.pick(cats);
          const ans = (360 * k) / N;
          return T({
            text: `V anketi o temi »${topic}« je sodelovalo ${N} učencev. Število učencev, ki so izbrali odgovor »${c}«, je ${k}. Kolikšen središčni kot pripada temu odgovoru v tortnem prikazu?`,
            answer: num(ans, "°", null, [
              [k, "Število učencev ni kot – izračunaj, kolikšen del kroga (360°) jim pripada."],
              [(100 * k) / N, "To je odstotek – kot dobiš kot delež od 360°."],
              [(180 * k) / N, "Cel krog meri 360°."],
            ]),
            hint: "Izračunaj, kolikšen del vseh učencev je izbral ta odgovor. Tolikšen del polnega kota pripada izseku.",
            given: [`N = ${N}`, `k = ${k}`],
            find: ["\\alpha"],
            formula: FORM,
            steps: [`Delež: $${fr(k, N)}$`, `$\\alpha = ${fr(k, N)} \\cdot 360^\\circ = ${tx(ans)}^\\circ$`],
          });
        }
        const p = 5 * r.int(1, 14);
        const ans = 3.6 * p;
        return T({
          text: `V tortnem prikazu (${topic}) pripada odgovoru »${r.pick(cats)}« $${p}\\ \\%$ vseh odgovorov. Kolikšen je središčni kot tega izseka?`,
          answer: num(roundHalfUp(ans, 1), "°", null, [
            [p, "Odstotek ni kot – 100 % ustreza 360°."],
            [roundHalfUp(1.8 * p, 1), "Cel krog meri 360°, ne 180°."],
          ]),
          hint: "100 % ustreza polnemu kotu 360°. Koliko stopinj ustreza 1 %?",
          given: [`p = ${p}\\ \\%`],
          find: ["\\alpha"],
          formula: "\\alpha = p \\cdot 3{,}6^\\circ",
          steps: [`$1\\ \\% \\to 360^\\circ : 100 = 3{,}6^\\circ$`, `$\\alpha = ${p} \\cdot 3{,}6^\\circ = ${tx(ans)}^\\circ$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const N = r.pick([24, 30, 36, 40, 60, 72, 90, 120, 180]);
          const k = r.int(2, Math.floor(N / 2));
          const a = (360 * k) / N;
          if (!Number.isInteger(a)) return this.gen(2, r);
          const c = r.pick(cats);
          return T({
            text: `Anketo (${topic}) je izpolnilo ${N} ljudi. V tortnem prikazu ima izsek »${c}« središčni kot $${a}^\\circ$. Koliko ljudi je izbralo ta odgovor?`,
            answer: num(k, null, null, [
              [a, "Kot ni število ljudi – izračunaj, kolikšen del kroga je izsek."],
              [(a * N) / 180, "Cel krog meri 360°."],
            ]),
            hint: "Kolikšen del polnega kota (360°) je izsek? Tolikšen del vseh ljudi je izbralo ta odgovor.",
            given: [`N = ${N}`, `\\alpha = ${a}^\\circ`],
            find: ["k"],
            formula: "k = \\dfrac{\\alpha}{360^\\circ} \\cdot N",
            steps: [`Delež: $${dfr(`${a}^\\circ`, "360^\\circ")} = ${fr(frac(a, 360).num, frac(a, 360).den)}$`, `$k = ${fr(frac(a, 360).num, frac(a, 360).den)} \\cdot ${N} = ${k}$`],
          });
        }
        const a = 18 * r.int(1, 15);
        const p = a / 3.6;
        return T({
          text: `V tortnem prikazu (${topic}) meri središčni kot izseka »${r.pick(cats)}« $${a}^\\circ$. Koliko odstotkov vseh odgovorov predstavlja?`,
          answer: num(p, "%", null, [
            [a, "Kot ni odstotek – 360° ustreza 100 %."],
            [a / 1.8, "Cel krog meri 360°, ne 180°."],
          ], { unitAlternatives: ["odstotkov", "odstotka", "odstotke"] }),
          hint: "Izračunaj, kolikšen del polnega kota je izsek, in ga zapiši v odstotkih.",
          given: [`\\alpha = ${a}^\\circ`],
          find: ["p"],
          formula: "p = \\dfrac{\\alpha}{360^\\circ} \\cdot 100\\ \\%",
          steps: [`$${dfr(`${a}^\\circ`, "360^\\circ")} = ${tx(a / 360)}$`, `$p = ${tx(a / 360)} \\cdot 100\\ \\% = ${tx(p)}\\ \\%$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const N = r.pick([36, 40, 60, 72, 90, 120]);
        let ks;
        do ks = [r.int(2, N / 3), r.int(2, N / 3), r.int(2, N / 4)];
        while (sum(ks) >= N - 1 || ks.some((k) => !Number.isInteger((360 * k) / N)));
        const angs = ks.map((k) => (360 * k) / N);
        const rest = N - sum(ks);
        return T({
          text: `Anketo (${topic}) je izpolnilo ${N} učencev. V tortnem prikazu merijo izseki »${cats[0]}«, »${cats[1]}« in »${cats[2]}« zaporedoma $${angs.map((x) => `${x}^\\circ`).join(",\\ ")}$. Koliko učencev je izbralo odgovor »${cats[3]}«?`,
          answer: num(rest, null, null, [
            [360 - sum(angs), "To je kot zadnjega izseka – pretvori ga v število učencev."],
            [N - sum(angs) > 0 ? N - sum(angs) : NaN, "Kotov ne smeš odšteti od števila učencev – najprej izračunaj kot zadnjega izseka."],
          ]),
          hint: "Najprej izračunaj kot zadnjega izseka (do 360°), nato ga pretvori v število učencev.",
          given: [`N = ${N}`, ...angs.map((x, i) => `\\alpha_${i + 1} = ${x}^\\circ`)],
          find: ["k_4"],
          formula: ["\\alpha_4 = 360^\\circ - \\alpha_1 - \\alpha_2 - \\alpha_3", "k = \\dfrac{\\alpha}{360^\\circ} \\cdot N"],
          steps: [`$\\alpha_4 = 360^\\circ - ${angs.join("^\\circ - ")}^\\circ = ${360 - sum(angs)}^\\circ$`, `$k_4 = \\dfrac{${360 - sum(angs)}}{360} \\cdot ${N} = ${rest}$`],
        });
      }
      if (t === 1) {
        const N = r.pick([40, 60, 72, 90, 120, 180, 360]);
        const k = r.int(2, N / 4);
        const a = (360 * k) / N;
        if (!Number.isInteger(a)) return this.gen(3, r);
        return T({
          text: `V tortnem prikazu (${topic}) ima izsek »${r.pick(cats)}« središčni kot $${a}^\\circ$. Število ljudi s tem odgovorom je ${k}. Koliko ljudi je skupaj sodelovalo v anketi?`,
          answer: num(N, null, null, [
            [N / 2, "Cel krog meri 360°, ne 180°."],
            [k * a, "Iščemo, kolikokrat gre izsek v cel krog."],
          ]),
          hint: `Kolikokrat gre kot $${a}^\\circ$ v polni kot?`,
          given: [`\\alpha = ${a}^\\circ`, `k = ${k}`],
          find: ["N"],
          formula: "N = \\dfrac{360^\\circ}{\\alpha} \\cdot k",
          steps: [`$360^\\circ : ${a}^\\circ = ${tx(360 / a)}$`, `$N = ${tx(360 / a)} \\cdot ${k} = ${N}$`],
        });
      }
      let N, m, S;
      do {
        N = r.pick([30, 36, 40, 45, 60, 72, 90, 120]);
        m = r.int(2, 4);
        S = 36 * r.int(2, 8);
      } while (S % (m + 1) !== 0 || !Number.isInteger(((S / (m + 1)) * m * N) / 360) || !Number.isInteger(((S / (m + 1)) * N) / 360));
      const big1 = (S / (m + 1)) * m;
      const ans = (big1 * N) / 360;
      return T({
        text: `V tortnem prikazu (${topic}, ${N} učencev) je izsek »${cats[0]}« ${m}-krat večji od izseka »${cats[1]}«. Skupaj merita $${S}^\\circ$. Koliko učencev je izbralo »${cats[0]}«?`,
        answer: num(ans, null, null, [
          [big1, "To je kot izseka – pretvori ga v število učencev."],
          [(S * N) / 360 / m, `Oba izseka skupaj tvorita ${m + 1} enakih delov.`],
        ]),
        hint: `Kota razdeli: manjši izsek je en del, večji ${m} delov. Nato kot pretvori v število učencev.`,
        given: [`N = ${N}`, `\\alpha_1 + \\alpha_2 = ${S}^\\circ`, `\\dfrac{\\alpha_1}{\\alpha_2} = ${m}`],
        find: ["k_1"],
        formula: ["\\alpha_2 = \\dfrac{\\alpha_1 + \\alpha_2}{m + 1}", "k = \\dfrac{\\alpha}{360^\\circ} \\cdot N"],
        steps: [`$\\alpha_2 = ${S}^\\circ : ${m + 1} = ${S / (m + 1)}^\\circ$, $\\alpha_1 = ${m} \\cdot ${S / (m + 1)}^\\circ = ${big1}^\\circ$`, `$k_1 = \\dfrac{${big1}}{360} \\cdot ${N} = ${ans}$`],
      });
    },
  },
  // ===================== 8. razred =====================
  {
    id: "dod-mat-os-enacbe-besedilne",
    topics: ["MAT-OS-8/besedilne-naloge-z-enacbami"],
    gen(level, r) {
      const [A, B] = name2(r);
      if (level === 1) {
        const a = r.int(2, 9);
        const x = r.int(2, 20);
        const plus = r.next() < 0.6;
        const b = r.int(2, 30);
        const c = plus ? a * x + b : a * x - b;
        if (c <= 0) return this.gen(1, r);
        const mult = { 2: "dvakratnik", 3: "trikratnik", 4: "štirikratnik", 5: "petkratnik", 6: "šestkratnik", 7: "sedemkratnik", 8: "osemkratnik", 9: "devetkratnik" }[a];
        const text = r.pick([
          `Mislim si število. Če ga pomnožim ${[2, 8, 9].includes(a) ? "z" : "s"} ${a} in ${plus ? `prištejem ${b}` : `odštejem ${b}`}, dobim ${c}. Katero število si mislim?`,
          `Če ${mult} neznanega števila ${plus ? `povečamo za ${b}` : `zmanjšamo za ${b}`}, dobimo ${c}. Katero je neznano število?`,
        ]);
        const eqTex = `${a}x ${plus ? "+" : "-"} ${b} = ${c}`;
        return T({
          text,
          answer: num(x, null, null, [
            [plus ? (c + b) / a : (c - b) / a, plus ? "Število b prenesi na drugo stran z nasprotnim predznakom (odštej ga)." : "Število b prenesi na drugo stran z nasprotnim predznakom (prištej ga)."],
            [c / a + (plus ? -b : b) > 0 ? c / a + (plus ? -b : b) : NaN, "Najprej odpravi seštevanec, šele nato deli."],
          ]),
          hint: "Neznano število označi z x in zapiši enačbo po besedilu.",
          given: [eqTex],
          find: ["x"],
          formula: eqTex,
          steps: [`Enačba: $${eqTex}$`, `$${a}x = ${c} ${plus ? "-" : "+"} ${b} = ${a * x}$`, `$x = ${a * x} : ${a} = ${x}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const k = r.int(3, 6);
          const x = r.int(5, 40);
          const S = k * x + (k * (k - 1)) / 2;
          const big1 = r.next() < 0.5;
          const ans = big1 ? x + k - 1 : x;
          const terms = range(0, k - 1).map((i) => (i ? `(x + ${i})` : "x")).join(" + ");
          return T({
            text: `Vsota ${k} zaporednih naravnih števil je ${S}. Katero je ${big1 ? "največje" : "najmanjše"} od teh števil?`,
            answer: num(ans, null, null, [
              [S / k, "To je povprečje (srednje število), ne " + (big1 ? "največje" : "najmanjše") + "."],
              [big1 ? x : x + k - 1, `Iščemo ${big1 ? "največje" : "najmanjše"} število.`],
            ]),
            hint: "Najmanjše število označi z x; naslednja so x + 1, x + 2, …",
            given: [`\\text{vsota} = ${S}`, `\\text{števil} = ${k}`],
            find: [big1 ? "x + " + (k - 1) : "x"],
            formula: `${terms} = ${S}`,
            steps: [`$${terms} = ${S}$`, `$${k}x + ${(k * (k - 1)) / 2} = ${S}$`, `$${k}x = ${k * x}$, $x = ${x}$`, big1 ? `Največje: $${x} + ${k - 1} = ${ans}$` : `Najmanjše: $${x}$`],
          });
        }
        if (t === 1) {
          const k = r.int(3, 6);
          const x = r.int(5, 14);
          const S = (k + 1) * x;
          return T({
            text: `Oče je ${k}-krat starejši od sina. Skupaj sta stara ${S} let. Koliko let je star sin?`,
            answer: num(x, null, null, [
              [S / k, `Skupaj sta oče in sin – to je ${k + 1} enakih delov.`],
              [k * x, "To je očetova starost."],
            ]),
            hint: `Sinovo starost označi z x; oče je star ${k}x.`,
            given: [`\\text{oče} = ${k} \\cdot \\text{sin}`, `\\text{skupaj} = ${S}`],
            find: ["x \\text{ (sin)}"],
            formula: `x + ${k}x = ${S}`,
            steps: [`$x + ${k}x = ${S}$`, `$${k + 1}x = ${S}$`, `$x = ${x}$ let`],
          });
        }
        if (t === 2) {
          const x = r.int(8, 60);
          const d = r.int(3, 25);
          const S = 2 * x + d;
          return T({
            text: `${A} ima $${d}$ € več kot ${B}. Skupaj imata $${S}$ €. Koliko evrov ima ${B}?`,
            answer: num(x, "€", null, [
              [S - d, `To je dvakratnik zneska, ki ga ima ${B}.`],
              [S / 2, "Zneska nista enaka – upoštevaj razliko."],
              [x + d, `To ima ${A}.`],
            ]),
            hint: `Znesek, ki ga ima ${B}, označi z x. Koliko ima ${A}?`,
            given: [`${A} = ${B} + ${qty(d, EUR)}`, `\\text{skupaj} = ${qty(S, EUR)}`],
            find: [`x \\text{ (${B})}`],
            formula: `x + (x + ${d}) = ${S}`,
            steps: [`$x + x + ${d} = ${S}$`, `$2x = ${S - d}$`, `$x = ${qty(x, EUR)}$`],
          });
        }
        const w = r.int(3, 20);
        const d = r.int(2, 15);
        const o = 2 * (w + w + d);
        return T({
          text: `Dolžina pravokotnika je za $${d}\\ \\mathrm{cm}$ večja od širine. Obseg pravokotnika meri $${o}\\ \\mathrm{cm}$. Koliko cm meri širina?`,
          answer: num(w, "cm", null, [
            [(o - d) / 2, "Obseg vsebuje vsako stranico dvakrat."],
            [w + d, "To je dolžina."],
            [o / 4, "Pravokotnik ni kvadrat – upoštevaj razliko stranic."],
          ]),
          hint: "Širino označi z x, dolžina je x + d. Zapiši obseg.",
          given: [`a = b + ${qty(d, "cm")}`, dat("o", o, "cm")],
          find: ["b"],
          formula: `2(x + ${d}) + 2x = ${o}`,
          steps: [`$2(x + ${d}) + 2x = ${o}$`, `$4x + ${2 * d} = ${o}$`, `$4x = ${o - 2 * d}$, $x = ${qty(w, "cm")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        let k, C, x, M;
        do {
          k = r.int(2, 4);
          C = r.int(4, 14);
          x = r.int(2, 12);
          M = k * (C + x) - x;
        } while (M - C < 20 || M > 60);
        const mom = r.pick([["Mama", "hči"], ["Oče", "sin"]]);
        return T({
          text: `${mom[0]} je stara ${M} let, ${mom[1]} pa ${C}. Čez koliko let bo ${mom[0].toLowerCase()} ${k}-krat starejš${mom[0] === "Mama" ? "a" : "i"} od ${mom[1] === "hči" ? "hčere" : "sina"}?`.replace("Oče je stara", "Oče je star"),
          answer: num(x, null, null, [
            [(M - k * C) / k, "Čez x let bosta starejša oba – prištej x obema starostma."],
            [M / k - C, "Zapiši enačbo za starosti čez x let: (M + x) = k(C + x)."],
          ]),
          hint: "Čez x let bosta stara M + x in C + x. Zapiši enačbo.",
          given: [`\\text{${mom[0].toLowerCase()}} = ${M}`, `\\text{${mom[1]}} = ${C}`, `\\text{čez } x \\text{ let} = ${k}\\text{-krat}`],
          find: ["x"],
          formula: `${M} + x = ${k}(${C} + x)`,
          steps: [`$${M} + x = ${k}(${C} + x)$`, `$${M} + x = ${k * C} + ${k}x$`, `$${M - k * C} = ${k - 1}x$`, `$x = ${x}$ let`],
        });
      }
      if (t === 1) {
        const p1 = r.int(8, 15);
        const p2 = r.int(3, p1 - 2);
        const N = r.int(40, 150);
        const x = r.int(10, N - 10);
        const S = p1 * (N - x) + p2 * x;
        return T({
          text: `Za predstavo so prodali ${N} vstopnic. Vstopnica za odraslega stane $${p1}$ €, za otroka pa $${p2}$ €. Iztržili so $${S}$ €. Koliko otroških vstopnic so prodali?`,
          answer: num(x, null, null, [
            [N - x, "To je število vstopnic za odrasle."],
            [S / (p1 + p2), "Število otroških in odraslih vstopnic ni enako."],
          ]),
          hint: "Število otroških vstopnic označi z x. Odraslih je potem N − x.",
          given: [`N = ${N}`, `c_1 = ${qty(p1, EUR)}`, `c_2 = ${qty(p2, EUR)}`, `\\text{iztržek} = ${qty(S, EUR)}`],
          find: ["x"],
          formula: `${p1}(${N} - x) + ${p2}x = ${S}`,
          steps: [`$${p1}(${N} - x) + ${p2}x = ${S}$`, `$${p1 * N} - ${p1}x + ${p2}x = ${S}$`, `$${p1 - p2}x = ${p1 * N - S}$`, `$x = ${x}$`],
        });
      }
      const x = 2 * r.int(5, 40);
      const k = r.int(3, 4);
      const S = k * x + k * (k - 1);
      return T({
        text: `Vsota ${k} zaporednih sodih števil je ${S}. Katero je najmanjše od njih?`,
        answer: num(x, null, null, [
          [S / k, "To je srednje število (povprečje), ne najmanjše."],
          [(S - (k * (k - 1)) / 2) / k, "Zaporedna soda števila se razlikujejo za 2, ne za 1."],
        ]),
        hint: "Najmanjše sodo število označi z x; naslednji sta x + 2, x + 4, …",
        given: [`\\text{vsota} = ${S}`, `\\text{števil} = ${k}`],
        find: ["x"],
        formula: `${range(0, k - 1).map((i) => (i ? `(x + ${2 * i})` : "x")).join(" + ")} = ${S}`,
        steps: [`$${range(0, k - 1).map((i) => (i ? `(x + ${2 * i})` : "x")).join(" + ")} = ${S}$`, `$${k}x + ${k * (k - 1)} = ${S}$`, `$${k}x = ${k * x}$, $x = ${x}$`],
      });
    },
  },
  {
    id: "dod-mat-os-veckotniki",
    topics: ["MAT-OS-8/veckotniki"],
    gen(level, r) {
      const NAME = { 5: "petkotnik", 6: "šestkotnik", 7: "sedemkotnik", 8: "osemkotnik", 9: "devetkotnik", 10: "desetkotnik", 12: "dvanajstkotnik", 15: "petnajstkotnik", 18: "osemnajstkotnik", 20: "dvajsetkotnik" };
      const nm = (n) => NAME[n] || `${n}-kotnik`;
      if (level === 1) {
        const n = r.int(5, 12);
        if (r.next() < 0.6) {
          return T({
            text: `Kolikšna je vsota notranjih kotov ${nm(n).replace(/k$/, "ka")}?`,
            answer: num((n - 2) * 180, "°", null, [
              [n * 180, "Iz enega oglišča večkotnik razdelimo na n − 2 trikotnikov, ne na n."],
              [(n - 2) * 360, "Vsota kotov trikotnika je 180°."],
            ]),
            hint: "Z diagonalami iz enega oglišča razdeli večkotnik na trikotnike. Koliko jih je?",
            given: [`\\text{lik} = \\text{${nm(n)}}`],
            find: ["\\text{vsota notranjih kotov}"],
            formula: "S = (n - 2) \\cdot 180^\\circ",
            steps: [`$n - 2 = ${n - 2}$ trikotnikov`, `$S = ${n - 2} \\cdot 180^\\circ = ${(n - 2) * 180}^\\circ$`],
          });
        }
        return T({
          text: `Koliko diagonal lahko narišemo iz enega oglišča ${nm(n).replace(/k$/, "ka")}?`,
          answer: num(n - 3, null, null, [
            [n - 1, "Diagonala ne gre do samega oglišča in ne do obeh sosednjih oglišč."],
            [n - 2, "Tudi do obeh sosednjih oglišč ne narišemo diagonale – tam sta stranici."],
          ]),
          hint: "Diagonala povezuje oglišče z ogliščem, ki ni sosednje.",
          given: [`\\text{lik} = \\text{${nm(n)}}`],
          find: ["d_1"],
          formula: "d_1 = n - 3",
          steps: [`Izključimo oglišče samo in obe sosednji oglišči: $${n} - 3$.`, `$d_1 = ${n - 3}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]);
          const ans = ((n - 2) * 180) / n;
          return T({
            text: `Koliko meri notranji kot pravilnega ${nm(n).replace(/k$/, "ka")}?`,
            answer: num(ans, "°", null, [
              [360 / n, "To je zunanji kot – notranji kot je 180° minus zunanji."],
              [(n - 2) * 180, "To je vsota vseh notranjih kotov – deli jo s številom kotov."],
            ]),
            hint: "Pravilni večkotnik ima vse kote enake. Izračunaj vsoto kotov in jo razdeli.",
            given: [`\\text{lik} = \\text{${nm(n)}}`],
            find: ["\\alpha"],
            formula: "\\alpha = \\dfrac{(n - 2) \\cdot 180^\\circ}{n}",
            steps: [`Vsota: $(${n} - 2) \\cdot 180^\\circ = ${(n - 2) * 180}^\\circ$`, `$\\alpha = ${(n - 2) * 180}^\\circ : ${n} = ${ans}^\\circ$`],
          });
        }
        if (t === 1) {
          const n = r.int(5, 14);
          const D = (n * (n - 3)) / 2;
          return T({
            text: `Koliko diagonal ima ${nm(n)}?`,
            answer: num(D, null, null, [
              [n * (n - 3), "Vsako diagonalo si štel dvakrat (iz obeh krajišč)."],
              [n - 3, "To so diagonale iz enega oglišča."],
              [(n * (n - 1)) / 2, "Med pari oglišč so tudi stranice – te niso diagonale."],
            ]),
            hint: "Iz vsakega oglišča gre n − 3 diagonal. Pazi: vsaka diagonala ima dve krajišči.",
            given: [`\\text{lik} = \\text{${nm(n)}}`],
            find: ["d"],
            formula: "d = \\dfrac{n(n - 3)}{2}",
            steps: [`Iz vsakega oglišča: $${n} - 3 = ${n - 3}$ diagonal`, `$d = \\dfrac{${n} \\cdot ${n - 3}}{2} = ${D}$`],
          });
        }
        const n = r.int(5, 6);
        const S = (n - 2) * 180;
        let ks;
        do ks = Array.from({ length: n - 1 }, () => r.int(70, 170));
        while (S - sum(ks) < 40 || S - sum(ks) > 175);
        const x = S - sum(ks);
        return T({
          text: `${n === 5 ? "Petkotnik" : "Šestkotnik"} ima notranje kote $${ks.map((k) => `${k}^\\circ`).join(",\\ ")}$ in še en neznani kot. Koliko meri neznani kot?`,
          answer: num(x, "°", null, [
            [360 - sum(ks) > 0 ? 360 - sum(ks) : NaN, "Vsota kotov večkotnika ni 360°."],
            [n * 180 - sum(ks), "Vsota notranjih kotov je (n − 2) · 180°."],
          ]),
          hint: "Najprej izračunaj vsoto vseh notranjih kotov, nato odštej znane.",
          given: ks.map((k, i) => `\\alpha_${i + 1} = ${k}^\\circ`),
          find: [`\\alpha_${n}`],
          formula: "S = (n - 2) \\cdot 180^\\circ",
          steps: [`$S = (${n} - 2) \\cdot 180^\\circ = ${S}^\\circ$`, `Znani koti: $${ks.join(" + ")} = ${sum(ks)}^\\circ$`, `$\\alpha_${n} = ${S}^\\circ - ${sum(ks)}^\\circ = ${x}^\\circ$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const n = r.int(5, 20);
        const S = (n - 2) * 180;
        return T({
          text: `Vsota notranjih kotov večkotnika meri $${big(S)}^\\circ$. Koliko oglišč ima večkotnik?`,
          answer: num(n, null, null, [
            [S / 180, "To je število trikotnikov – oglišč je za 2 več."],
            [S / 180 - 2, "Trikotnikov je n − 2, zato je n za 2 večje."],
          ]),
          hint: "Iz enačbe $(n - 2) \\cdot 180^\\circ = S$ izrazi n.",
          given: [`S = ${big(S)}^\\circ`],
          find: ["n"],
          formula: "S = (n - 2) \\cdot 180^\\circ",
          steps: [`$n - 2 = ${big(S)} : 180 = ${n - 2}$`, `$n = ${n}$`],
        });
      }
      if (t === 1) {
        const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const inner = ((n - 2) * 180) / n;
        const giveInner = r.next() < 0.6;
        return T({
          text: giveInner ? `Notranji kot pravilnega večkotnika meri $${inner}^\\circ$. Koliko oglišč ima večkotnik?` : `Zunanji kot pravilnega večkotnika meri $${360 / n}^\\circ$. Koliko oglišč ima večkotnik?`,
          answer: num(n, null, null, giveInner ? [[360 / inner, "Polni kot deli z zunanjim kotom, ne z notranjim."], [180 / (180 - inner), "Vsota zunanjih kotov je 360°."]] : [[180 / (360 / n), "Vsota zunanjih kotov je 360°, ne 180°."]]),
          hint: giveInner ? "Izračunaj zunanji kot ($180^\\circ$ minus notranji). Vsota vseh zunanjih kotov je $360^\\circ$." : "Vsota vseh zunanjih kotov je $360^\\circ$.",
          given: [giveInner ? `\\alpha = ${inner}^\\circ` : `\\alpha' = ${360 / n}^\\circ`],
          find: ["n"],
          formula: ["\\alpha' = 180^\\circ - \\alpha", "n = \\dfrac{360^\\circ}{\\alpha'}"],
          steps: giveInner ? [`$\\alpha' = 180^\\circ - ${inner}^\\circ = ${360 / n}^\\circ$`, `$n = 360^\\circ : ${360 / n}^\\circ = ${n}$`] : [`$n = 360^\\circ : ${360 / n}^\\circ$`, `$n = ${n}$`],
        });
      }
      const n = r.int(5, 15);
      const D = (n * (n - 3)) / 2;
      return T({
        text: `Večkotnik ima ${D} diagonal. Koliko oglišč ima?`,
        answer: num(n, null, null, [
          [D + 3, "Iz enega oglišča gre n − 3 diagonal, vseh pa je n(n − 3)/2."],
          [Math.round(Math.sqrt(2 * D)), "Preveri: n(n − 3)/2 mora biti natanko število diagonal."],
        ]),
        hint: "Uporabi $d = \\dfrac{n(n - 3)}{2}$ in poišči n s poskušanjem (začni pri 5).",
        given: [`d = ${D}`],
        find: ["n"],
        formula: "d = \\dfrac{n(n - 3)}{2}",
        steps: [`$n(n - 3) = 2 \\cdot ${D} = ${2 * D}$`, `Poskusimo: $${n} \\cdot ${n - 3} = ${2 * D}$`, `$n = ${n}$`],
      });
    },
  },
  // ===================== 9. razred =====================
  {
    id: "dod-mat-os-koordinatni-grafi",
    topics: ["MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin"],
    gen(level, r) {
      const p = (x) => (x < 0 ? `(${x})` : `${x}`);
      const pt = (N, x, y) => `${N}(${tx(x)}, ${tx(y)})`;
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const k = r.pick([0.5, 1.5, 2, 2.5, 3, 4]);
          const x1 = r.int(2, 6);
          let x2 = r.int(3, 10);
          if (x2 === x1) x2 += 1;
          const y1 = k * x1;
          const [what, ux, uy] = r.pick([
            ["ceno jabolk v odvisnosti od mase", "kg", "€"],
            ["pot pešca v odvisnosti od časa", "h", "km"],
            ["porabo vode v odvisnosti od časa", "min", "L"],
          ]);
          return T({
            text: `Graf premega sorazmerja kaže ${what}. Graf gre skozi točko $(${x1}, ${tx(y1)})$ (${ux} na osi x, ${uy} na osi y). Kolikšna je vrednost y pri $x = ${x2}$?`,
            answer: num(k * x2, null, null, [
              [y1 + (x2 - x1), "Pri premem sorazmerju se y poveča enakokrat kot x, ne za enako vrednost."],
              [y1 * x2, `Najprej izračunaj y pri x = 1: $${tx(y1)} : ${x1}$.`],
            ]),
            hint: "Graf premega sorazmerja je premica skozi izhodišče: $y = kx$. Najprej izračunaj k.",
            given: [`T = (${x1}, ${tx(y1)})`, `x = ${x2}`],
            find: ["y"],
            formula: "y = k \\cdot x,\\quad k = \\dfrac{y}{x}",
            steps: [`$k = ${tx(y1)} : ${x1} = ${tx(k)}$`, `$y = ${tx(k)} \\cdot ${x2} = ${tx(k * x2)}$`],
          });
        }
        if (t === 1) {
          const a = r.nonZero(-9, 9);
          const b = r.nonZero(-9, 9);
          const overX = r.next() < 0.5;
          const ans = overX ? -b : -a;
          return T({
            text: `Točko $${pt("A", a, b)}$ prezrcalimo čez ${overX ? "abscisno os (os x)" : "ordinatno os (os y)"}. Kolikšna je ${overX ? "ordinata (y-koordinata)" : "abscisa (x-koordinata)"} slike A'?`,
            answer: num(ans, null, null, [
              [overX ? b : a, "Pri zrcaljenju se ta koordinata spremeni v nasprotno vrednost."],
              [overX ? -a : -b, "Preveri, katera koordinata se spremeni."],
            ]),
            hint: overX ? "Pri zrcaljenju čez os x ostane x enak, y pa spremeni predznak." : "Pri zrcaljenju čez os y ostane y enak, x pa spremeni predznak.",
            given: [`A = (${a}, ${b})`],
            find: [overX ? "y_{A'}" : "x_{A'}"],
            formula: overX ? "(x, y) \\to (x, -y)" : "(x, y) \\to (-x, y)",
            steps: [overX ? `$A(${a}, ${b}) \\to A'(${a}, ${-b})$` : `$A(${a}, ${b}) \\to A'(${-a}, ${b})$`, `Iskana koordinata je $${ans}$.`],
          });
        }
        const k = r.nonZero(-4, 4);
        const n = r.int(-10, 10);
        const x = r.nonZero(-5, 5);
        const ans = k * x + n;
        return T({
          text: `Graf linearne funkcije $f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}$ gre skozi točko $T(${x}, y)$. Koliko je y?`,
          answer: num(ans, null, null, [
            [k * x - n, "Pazi na predznak začetne vrednosti n."],
            [-k * x + n, "Pazi na predznak pri množenju negativnih števil."],
          ]),
          hint: `Vstavi $x = ${x}$ v predpis funkcije.`,
          given: [`f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}`, `x = ${x}`],
          find: ["y"],
          formula: "y = f(x) = kx + n",
          steps: [`$y = ${k} \\cdot ${p(x)} ${n < 0 ? "-" : "+"} ${Math.abs(n)}$`, `$y = ${k * x} ${n < 0 ? "-" : "+"} ${Math.abs(n)} = ${ans}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const n = r.pick([2, 2.5, 3, 3.5, 4]);
          const k = r.pick([0.8, 0.9, 1.1, 1.2, 1.5]);
          const x = r.int(3, 25);
          const ans = n + k * x;
          return T({
            text: `Vožnja s taksijem stane $${tx(n)}$ € ob vstopu in $${tx(k)}$ € za vsak prevožen kilometer. Graf odvisnosti cene od poti je premica. Koliko stane vožnja, dolga $${x}\\ \\mathrm{km}$?`,
            answer: num(ans, "€", 2, [
              [k * x, "Prištej še začetno ceno ob vstopu."],
              [(n + k) * x, "Začetno ceno plačaš le enkrat."],
            ]),
            hint: "Zapiši predpis $y = kx + n$: n je začetna cena, k cena za kilometer.",
            given: [`n = ${qty(tx(n), EUR)}`, `k = ${tx(k)}\\ \\text{€/km}`, dat("x", x, "km")],
            find: ["y"],
            formula: "y = kx + n",
            steps: [`$y = ${tx(k)} \\cdot ${x} + ${tx(n)}$`, `$y = ${tx(k * x)} + ${tx(n)} = ${qty(tx(ans, 2), EUR)}$`],
          });
        }
        if (t === 1) {
          const vert = r.next() < 0.5;
          const c = r.int(-6, 6);
          const u1 = r.int(-9, -1);
          const u2 = r.int(1, 9);
          const [a1, a2] = r.shuffle([u1, u2]);
          const A = vert ? [c, a1] : [a1, c];
          const B = vert ? [c, a2] : [a2, c];
          const ans = Math.abs(a1 - a2);
          return T({
            text: `V koordinatnem sistemu (enota 1 cm) sta točki $A(${A[0]}, ${A[1]})$ in $B(${B[0]}, ${B[1]})$. Koliko cm meri daljica AB?`,
            answer: num(ans, "cm", null, [[Math.abs(a1 + a2), "Točki ležita na različnih straneh osi – razdaljo dobiš kot razliko koordinat."]]),
            hint: `Točki imata enako ${vert ? "absciso" : "ordinato"}. Dolžina je razlika ${vert ? "ordinat" : "abscis"}.`,
            given: [`A = (${A[0]}, ${A[1]})`, `B = (${B[0]}, ${B[1]})`],
            find: ["|AB|"],
            formula: vert ? "|AB| = |y_B - y_A|" : "|AB| = |x_B - x_A|",
            steps: [`$|AB| = |${a2} - ${p(a1)}|$`, `$|AB| = ${qty(ans, "cm")}$`],
          });
        }
        if (t === 2) {
          const k = r.nonZero(-5, 5);
          const x0 = r.nonZero(-6, 6);
          const n = -k * x0;
          if (n === 0) return this.gen(2, r);
          return T({
            text: `V kateri točki seka graf funkcije $f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}$ abscisno os? Vpiši abscisno koordinato presečišča.`,
            answer: num(x0, null, null, [
              [-x0, "Pazi na predznak: rešuješ enačbo kx + n = 0."],
              [n, "To je presečišče z ordinatno osjo (začetna vrednost)."],
            ]),
            hint: "Na abscisni osi je y = 0. Reši enačbo $kx + n = 0$.",
            given: [`f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}`],
            find: ["x_0"],
            formula: "kx_0 + n = 0 \\Rightarrow x_0 = -\\dfrac{n}{k}",
            steps: [`$${k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)} = 0$`, `$${k}x = ${-n}$`, `$x_0 = ${x0}$`],
          });
        }
        const x1 = r.int(-6, 0);
        const y1 = r.int(-6, 0);
        const x2 = x1 + r.int(2, 8);
        const y2 = y1 + r.int(2, 7);
        const dx = x2 - x1;
        const dy = y2 - y1;
        return T({
          text: `Pravokotnik ABCD ima stranice vzporedne z osema. Oglišči $A(${x1}, ${y1})$ in $C(${x2}, ${y2})$ sta nasprotni. Koliko kvadratnih enot meri ploščina pravokotnika?`,
          answer: num(dx * dy, null, null, [
            [2 * (dx + dy), "To je obseg, ne ploščina."],
            [Math.abs(x2 + x1) * Math.abs(y2 + y1), "Dolžini stranic sta razliki koordinat."],
          ]),
          hint: "Dolžina ene stranice je razlika abscis, druge pa razlika ordinat.",
          given: [`A = (${x1}, ${y1})`, `C = (${x2}, ${y2})`],
          find: ["p"],
          formula: ["a = |x_C - x_A|,\\ b = |y_C - y_A|", "p = a \\cdot b"],
          steps: [`$a = ${x2} - ${p(x1)} = ${dx}$, $b = ${y2} - ${p(y1)} = ${dy}$`, `$p = ${dx} \\cdot ${dy} = ${dx * dy}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const k = r.pick([-3, -2, -1, 1, 2, 3, 0.5, 1.5]);
        const x1 = r.int(-4, 2);
        const x2 = x1 + 2 * r.int(1, 3);
        const n = r.int(-5, 5);
        const y1 = k * x1 + n;
        const y2 = k * x2 + n;
        const x3 = x2 + r.int(1, 4);
        const bike = r.next() < 0.4;
        if (bike) {
          const v = r.int(12, 25);
          const t1 = r.int(1, 2);
          const t2 = t1 + r.int(1, 3);
          const s0 = r.int(0, 10);
          const s1 = s0 + v * t1;
          const s2 = s0 + v * t2;
          const t3 = t2 + r.pick([0.5, 1, 1.5, 2]);
          return T({
            text: `Graf kaže oddaljenost kolesarja od doma v odvisnosti od časa; kolesar vozi enakomerno. Ob $${t1}\\ \\mathrm{h}$ je oddaljen $${s1}\\ \\mathrm{km}$, ob $${t2}\\ \\mathrm{h}$ pa $${s2}\\ \\mathrm{km}$. Koliko km bo oddaljen ob $${tx(t3)}\\ \\mathrm{h}$?`,
            answer: num(s0 + v * t3, "km", null, [
              [(s2 / t2) * t3, "Graf ne gre skozi izhodišče – ob času 0 kolesar ni bil doma."],
              [s2 + (t3 - t2), "Upoštevaj hitrost: koliko km prevozi v eni uri?"],
            ]),
            hint: "Iz obeh točk izračunaj hitrost (naklon premice), nato nadaljuj od druge točke.",
            given: [`T_1 = (${t1}\\ \\mathrm{h}, ${s1}\\ \\mathrm{km})`, `T_2 = (${t2}\\ \\mathrm{h}, ${s2}\\ \\mathrm{km})`, dat("t", tx(t3), "h")],
            find: ["s"],
            formula: "k = \\dfrac{s_2 - s_1}{t_2 - t_1}",
            steps: [`$k = \\dfrac{${s2} - ${s1}}{${t2} - ${t1}} = ${v}\\ \\mathrm{km/h}$`, `$s = ${s2} + ${v} \\cdot (${tx(t3)} - ${t2}) = ${qty(tx(s0 + v * t3), "km")}$`],
          });
        }
        return T({
          text: `Premica gre skozi točki $A(${x1}, ${tx(y1)})$ in $B(${x2}, ${tx(y2)})$. Kolikšna je ordinata točke na tej premici z absciso $${x3}$?`,
          answer: num(k * x3 + n, null, null, [
            [y2 + (x3 - x2), "Upoštevaj naklon – za koliko se y spremeni, ko se x poveča za 1?"],
            [(y2 / x2) * x3, "Premica ne gre nujno skozi izhodišče."],
          ]),
          hint: "Najprej izračunaj naklon $k = \\dfrac{y_B - y_A}{x_B - x_A}$.",
          given: [`A = (${x1}, ${tx(y1)})`, `B = (${x2}, ${tx(y2)})`, `x = ${x3}`],
          find: ["y"],
          formula: ["k = \\dfrac{y_B - y_A}{x_B - x_A}", "y = y_B + k(x - x_B)"],
          steps: [`$k = \\dfrac{${tx(y2)} - ${p(y1)}}{${x2} - ${p(x1)}} = ${tx(k)}$`, `$y = ${tx(y2)} + ${tx(k)} \\cdot (${x3} - ${p(x2)}) = ${tx(k * x3 + n)}$`],
        });
      }
      if (t === 1) {
        let n1, k1, n2, k2, x;
        do {
          k1 = r.pick([1, 1.5, 2, 2.5, 3]);
          k2 = r.pick([0.5, 1]);
          x = r.int(2, 8);
          n1 = r.int(1, 6);
          n2 = n1 + (k1 - k2) * x;
        } while (k1 <= k2 || !Number.isInteger(n2 * 2));
        return T({
          text: `Izposoja kolesa: ponudnik A zaračuna $${tx(n1)}$ € in $${tx(k1)}$ € na uro, ponudnik B pa $${tx(n2)}$ € in $${tx(k2)}$ € na uro. Po koliko urah izposoje sta ceni enaki? (Grafa se sekata.)`,
          answer: num(x, "h", null, [
            [(n2 + n1) / (k1 + k2), "Izenači obe ceni in reši enačbo – pazi na predznake."],
            [(n2 - n1) / k1, "Upoštevaj, da tudi pri B cena narašča z urami."],
          ], { unitAlternatives: ["ur", "ure", "uri", "ura"] }),
          hint: "Zapiši ceni kot funkciji časa in ju izenači.",
          given: [`y_A = ${tx(k1)}x + ${tx(n1)}`, `y_B = ${tx(k2)}x + ${tx(n2)}`],
          find: ["x"],
          formula: "k_1 x + n_1 = k_2 x + n_2",
          steps: [`$${tx(k1)}x + ${tx(n1)} = ${tx(k2)}x + ${tx(n2)}$`, `$${tx(k1 - k2)}x = ${tx(n2 - n1)}$`, `$x = ${x}\\ \\mathrm{h}$`],
        });
      }
      const k = r.pick([-3, -2, -1, 1, 2, 3]);
      const x0 = r.nonZero(-6, 6);
      const n = -k * x0;
      const area = (Math.abs(n) * Math.abs(x0)) / 2;
      return T({
        text: `Graf funkcije $f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}$ in obe koordinatni osi omejujejo trikotnik. Koliko kvadratnih enot meri njegova ploščina?`,
        answer: num(area, null, null, [
          [2 * area, "Ploščina pravokotnega trikotnika je polovica produkta katet."],
          [(Math.abs(n) * Math.abs(n)) / 2, "Druga kateta je presečišče z osjo x, ne n."],
        ]),
        hint: "Poišči presečišči grafa z osema. Trikotnik je pravokoten, kateti ležita na oseh.",
        given: [`f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}`],
        find: ["p"],
        formula: ["N(0, n),\\ x_0 = -\\dfrac{n}{k}", "p = \\dfrac{|n| \\cdot |x_0|}{2}"],
        steps: [`Presečišče z osjo y: $(0, ${n})$; z osjo x: $x_0 = ${x0}$`, `$p = \\dfrac{${Math.abs(n)} \\cdot ${Math.abs(x0)}}{2} = ${tx(area)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-besedilne-9",
    topics: ["MAT-OS-9/besedilne-naloge"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.pick([10, 20, 25, 30, 40, 50]);
          const O = r.int(4, 30) * 10;
          const P = (O * (100 - p)) / 100;
          return T({
            text: `Po $${p}\\ \\%$ popustu stane jakna $${tx(P)}$ €. Koliko je stala pred popustom?`,
            answer: num(O, "€", 2, [
              [P * (1 + p / 100), "Popust je izračunan od prvotne cene, ne od znižane."],
              [P + p, "Odstotek ni znesek v evrih."],
            ]),
            hint: `Znižana cena je $${100 - p}\\ \\%$ prvotne cene. Prvotno ceno označi z x.`,
            given: [`p = ${p}\\ \\%`, `\\text{nova cena} = ${qty(tx(P), EUR)}`],
            find: ["x"],
            formula: `${tx((100 - p) / 100)} \\cdot x = ${tx(P)}`,
            steps: [`$${tx((100 - p) / 100)} \\cdot x = ${tx(P)}$`, `$x = ${tx(P)} : ${tx((100 - p) / 100)} = ${qty(O, EUR)}$`],
          });
        }
        if (t === 1) {
          const [k, kn] = r.pick([[2, "Polovica"], [3, "Tretjina"], [4, "Četrtina"], [5, "Petina"]]);
          const a = r.int(2, 15);
          const b = r.int(2, 20);
          const x = k * (a + b);
          return T({
            text: `${kn} neznanega števila, zmanjšana za ${a}, je ${b}. Katero je neznano število?`,
            answer: num(x, null, null, [
              [k * b + a, "Najprej prištej, šele nato pomnoži."],
              [k * (b - a), "Število, ki ga odštevamo, prenesi na drugo stran s spremenjenim predznakom."],
            ]),
            hint: "Neznano število označi z x in zapiši enačbo.",
            given: [`\\dfrac{x}{${k}} - ${a} = ${b}`],
            find: ["x"],
            formula: `\\dfrac{x}{${k}} - ${a} = ${b}`,
            steps: [`$\\dfrac{x}{${k}} = ${b} + ${a} = ${a + b}$`, `$x = ${k} \\cdot ${a + b} = ${x}$`],
          });
        }
        const p = r.pick([5, 10, 15, 20, 25, 30, 40, 60, 75]);
        const W = r.int(2, 40) * 20;
        const Y = (W * p) / 100;
        const money = r.next() < 0.5;
        return T({
          text: money ? `${name} je ${g(name, "privarčeval", "privarčevala")} $${Y}$ €, kar je $${p}\\ \\%$ cene kolesa. Koliko stane kolo?` : `$${p}\\ \\%$ učencev šole, to je ${nOf(Y, "učenec", "učenca", "učenci", "učencev")}, obiskuje pevski zbor. Koliko učencev ima šola?`,
          answer: num(W, money ? "€" : null, null, [
            [(Y * p) / 100, "Iščemo celoto, ne odstotka od danega števila."],
            [Y * p, "Del deli z odstotkom (kot decimalnim številom)."],
          ]),
          hint: "Celoto označi z x: $p\\ \\%$ od x je dani del.",
          given: [`p = ${p}\\ \\%`, `\\text{del} = ${Y}`],
          find: ["x"],
          formula: `${tx(p / 100)} \\cdot x = ${Y}`,
          steps: [`$${tx(p / 100)} \\cdot x = ${Y}$`, `$x = ${Y} : ${tx(p / 100)} = ${W}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          let v1, v2, m;
          do {
            v1 = r.int(4, 18) * 5;
            v2 = r.int(4, 18) * 5;
            m = r.pick([12, 15, 20, 24, 30, 36, 40, 45, 48]);
          } while (((v1 + v2) * m) % 60 !== 0 || v1 === v2);
          const d = ((v1 + v2) * m) / 60;
          return T({
            text: `Iz krajev, oddaljenih $${d}\\ \\mathrm{km}$, hkrati odpeljeta avtomobila drug proti drugemu. Prvi vozi s hitrostjo $${v1}\\ \\mathrm{km/h}$, drugi s $${v2}\\ \\mathrm{km/h}$. Čez koliko minut se srečata?`,
            answer: num(m, "min", null, [
              [(d / Math.abs(v1 - v2)) * 60, "Vozita drug proti drugemu – hitrosti seštej."],
              [d / (v1 + v2), "Rezultat zapiši v minutah."],
            ]),
            hint: "Čas srečanja označi s t. Skupaj prevozita vso razdaljo: $v_1 t + v_2 t = d$.",
            given: [dat("d", d, "km"), dat("v_1", v1, "km/h"), dat("v_2", v2, "km/h")],
            find: ["t"],
            formula: "v_1 t + v_2 t = d",
            steps: [`$(${v1} + ${v2})\\,t = ${d}$`, `$t = ${d} : ${v1 + v2} = ${tx(m / 60)}\\ \\mathrm{h}$`, `$t = ${tx(m / 60)} \\cdot 60\\ \\mathrm{min} = ${m}\\ \\mathrm{min}$`],
          });
        }
        if (t === 1) {
          const N = r.int(15, 50);
          const x = r.int(3, N - 3);
          const S = 2 * x + 0.5 * (N - x);
          return T({
            text: `V hranilniku je ${N} kovancev: nekaj po 2 € in ostali po 50 centov. Skupaj je v hranilniku $${tx(S)}$ €. Koliko je kovancev po 2 €?`,
            answer: num(x, null, null, [
              [N - x, "To je število kovancev po 50 centov."],
              [S / 2.5, "Kovancev obeh vrst ni enako veliko."],
            ]),
            hint: "Število kovancev po 2 € označi z x; kovancev po 50 centov je potem N − x.",
            given: [`N = ${N}`, `\\text{vrednost} = ${qty(tx(S), EUR)}`],
            find: ["x"],
            formula: `2x + 0{,}5(${N} - x) = ${tx(S)}`,
            steps: [`$2x + 0{,}5(${N} - x) = ${tx(S)}$`, `$1{,}5x + ${tx(0.5 * N)} = ${tx(S)}$`, `$1{,}5x = ${tx(S - 0.5 * N)}$, $x = ${x}$`],
          });
        }
        const k = r.int(2, 4);
        const b = r.int(2, 12);
        const o = 2 * (k * b + b);
        return T({
          text: `Dolžina pravokotne gredice je ${k}-krat večja od širine. Obseg gredice meri $${o}\\ \\mathrm{m}$. Koliko $\\mathrm{m^2}$ meri ploščina gredice?`,
          answer: num(k * b * b, "m²", null, [
            [b, "To je širina – izračunaj še ploščino."],
            [((o / 2) * (o / 2)) / 4, "Gredica ni kvadrat."],
          ]),
          hint: "Širino označi z x, dolžina je kx. Iz obsega izračunaj x.",
          given: [`a = ${k}b`, dat("o", o, "m")],
          find: ["p"],
          formula: ["2 \\cdot " + k + "x + 2x = " + o, "p = a \\cdot b"],
          steps: [`$2 \\cdot ${k}x + 2x = ${o}$, torej $${2 * k + 2}x = ${o}$`, `$x = ${b}\\ \\mathrm{m}$, dolžina $${k * b}\\ \\mathrm{m}$`, `$p = ${k * b} \\cdot ${b} = ${qty(k * b * b, "m²")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        let m, p, q;
        do {
          m = r.int(2, 10) * 100;
          p = r.pick([10, 12, 15, 20, 24, 30]);
          q = r.pick([5, 6, 8, 10, 12, 15]);
        } while (q >= p || (m * p) % q !== 0);
        const w = (m * p) / q - m;
        return T({
          text: `V $${m}\\ \\mathrm{g}$ raztopine je $${p}\\ \\%$ soli. Koliko gramov vode moramo doliti, da bo raztopina ${q}-odstotna?`,
          answer: num(w, "g", null, [
            [(m * p) / q, "To je masa nove raztopine – odštej še prvotno maso."],
            [(m * (p - q)) / 100, "Masa soli ostane enaka – zapiši enačbo za novo raztopino."],
          ]),
          hint: "Masa soli se ne spremeni. Maso dolite vode označi z x.",
          given: [dat("m", m, "g"), `p_1 = ${p}\\ \\%`, `p_2 = ${q}\\ \\%`],
          find: ["x"],
          formula: `${tx(p / 100)} \\cdot ${m} = ${tx(q / 100)} \\cdot (${m} + x)`,
          steps: [`Sol: $${tx(p / 100)} \\cdot ${m} = ${(m * p) / 100}\\ \\mathrm{g}$`, `$${tx(q / 100)} \\cdot (${m} + x) = ${(m * p) / 100}$, torej $${m} + x = ${(m * p) / q}$`, `$x = ${qty(w, "g")}$`],
        });
      }
      if (t === 1) {
        let v1, v2, t0, tm;
        do {
          v1 = r.int(3, 6) * 5;
          v2 = v1 + r.int(1, 6) * 5;
          t0 = r.pick([0.5, 1, 1.5, 2]);
          tm = (v1 * t0 * 60) / (v2 - v1);
        } while (!Number.isInteger(tm) || tm > 300);
        return T({
          text: `${name} odpelje s kolesom s hitrostjo $${v1}\\ \\mathrm{km/h}$. Čez $${tx(t0)}\\ \\mathrm{h}$ za ${g(name, "njim", "njo")} po isti poti odpelje brat z mopedom s hitrostjo $${v2}\\ \\mathrm{km/h}$. Čez koliko minut po svojem odhodu ga dohiti brat?`.replace("ga dohiti", g(name, "ga dohiti", "jo dohiti")),
          answer: num(tm, "min", null, [
            [(v1 * t0 * 60) / (v1 + v2), "Brat lovi kolesarja – hitrosti odštej, ne seštej."],
            [tm / 60, "Rezultat zapiši v minutah."],
            [tm + t0 * 60, "Iščemo čas od bratovega odhoda."],
          ]),
          hint: "Ko ga brat dohiti, sta prevozila enako pot. Bratov čas označi s t; kolesar je vozil t + t₀.",
          given: [dat("v_1", v1, "km/h"), dat("v_2", v2, "km/h"), dat("t_0", tx(t0), "h")],
          find: ["t"],
          formula: `${v1}(t + ${tx(t0)}) = ${v2}t`,
          steps: [`$${v1}(t + ${tx(t0)}) = ${v2}t$`, `$${tx(v1 * t0)} = ${v2 - v1}t$`, `$t = ${tx(tm / 60)}\\ \\mathrm{h} = ${tm}\\ \\mathrm{min}$`],
        });
      }
      let s, n, k;
      do {
        k = r.int(2, 4);
        n = r.int(3, 8);
        s = r.int(n + 2, 30);
      } while (k * (s - n) + n > 60 || (k - 1) * (s - n) < 20);
      const f = k * (s - n) + n;
      const S = f + s;
      return T({
        text: `Pred ${n} leti je bil oče ${k}-krat starejši od sina. Danes sta skupaj stara ${S} let. Koliko let je danes star sin?`,
        answer: num(s, null, null, [
          [S / (k + 1), `${k}-krat starejši je bil oče pred ${n} leti, ne danes.`],
          [s - n, "To je sinova starost pred leti."],
          [f, "To je očetova starost."],
        ]),
        hint: `Sinovo današnjo starost označi z x; oče je danes star ${S} − x. Pred ${n} leti sta bila stara x − ${n} in ${S} − x − ${n}.`,
        given: [`\\text{skupaj danes} = ${S}`, `\\text{pred } ${n} \\text{ leti: oče} = ${k} \\cdot \\text{sin}`],
        find: ["x"],
        formula: `${S} - x - ${n} = ${k}(x - ${n})`,
        steps: [`$${S} - x - ${n} = ${k}(x - ${n})$`, `$${S - n} - x = ${k}x - ${k * n}$`, `$${S - n + k * n} = ${k + 1}x$`, `$x = ${s}$ let`],
      });
    },
  },
  {
    id: "dod-mat-os-statisticna-raziskava",
    topics: ["MAT-OS-9/statisticna-raziskava"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const med = (a) => {
        const s = [...a].sort((x, y) => x - y);
        const n = s.length;
        return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
      };
      const CTX = r.pick([
        ["številke čevljev učencev", 34, 44],
        ["število ur spanja", 5, 11],
        ["število točk na testu", 8, 30],
        ["število prebranih knjig v letu", 0, 15],
      ]);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          let v, mode, cnt;
          do {
            v = Array.from({ length: r.int(7, 9) }, () => r.int(CTX[1], CTX[1] + 6));
            const c = {};
            v.forEach((x) => (c[x] = (c[x] || 0) + 1));
            const mx = Math.max(...Object.values(c));
            const tops = Object.keys(c).filter((k) => c[k] === mx);
            mode = Number(tops[0]);
            cnt = mx;
            if (tops.length !== 1 || mx < 2) mode = null;
          } while (mode === null || cnt === mode);
          return T({
            text: `Zbrani podatki (${CTX[0]}): ${v.join(", ")}. Kolikšen je modus?`,
            answer: num(mode, null, null, [
              [cnt, "Modus je vrednost, ki se največkrat ponovi – ne število ponovitev."],
              [med(v), "To je mediana, ne modus."],
            ]),
            hint: "Preštej, kolikokrat se pojavi vsaka vrednost.",
            given: [`\\text{podatki: } ${v.join(", ")}`],
            find: ["M_o"],
            formula: "M_o = \\text{najpogostejša vrednost}",
            steps: [`Vrednost ${mode} se pojavi ${cnt}-krat, druge redkeje.`, `$M_o = ${mode}$`],
          });
        }
        if (t === 1) {
          const n = r.pick([5, 7, 9]);
          let v;
          do v = Array.from({ length: n }, () => r.int(CTX[1], CTX[2]));
          while (v[(n - 1) / 2] === med(v));
          const s = [...v].sort((x, y) => x - y);
          return T({
            text: `Zbrani podatki (${CTX[0]}): ${v.join(", ")}. Kolikšna je mediana?`,
            answer: num(med(v), null, null, [
              [v[(n - 1) / 2], "Podatke najprej uredi po velikosti."],
              [roundHalfUp(sum(v) / n, 1), "To je povprečje, ne mediana."],
            ]),
            hint: "Podatke uredi po velikosti in poišči srednjega.",
            given: [`\\text{podatki: } ${v.join(", ")}`],
            find: ["M_e"],
            formula: "M_e = \\text{srednji podatek urejenega niza}",
            steps: [`Urejeno: ${s.join(", ")}`, `Srednji (${(n + 1) / 2}.) podatek: $M_e = ${med(v)}$`],
          });
        }
        const v = Array.from({ length: r.int(6, 9) }, () => r.int(CTX[1], CTX[2]));
        const R = Math.max(...v) - Math.min(...v);
        if (R === 0) return this.gen(1, r);
        return T({
          text: `Zbrani podatki (${CTX[0]}): ${v.join(", ")}. Kolikšen je variacijski razmik?`,
          answer: num(R, null, null, [
            [Math.max(...v), "Od največje vrednosti odštej še najmanjšo."],
            [v[v.length - 1] - v[0], "Uporabi največjo in najmanjšo vrednost, ne prve in zadnje v seznamu."],
          ]),
          hint: "Poišči največjo in najmanjšo vrednost.",
          given: [`\\text{podatki: } ${v.join(", ")}`],
          find: ["R"],
          formula: "R = x_{\\max} - x_{\\min}",
          steps: [`$x_{\\max} = ${Math.max(...v)}$, $x_{\\min} = ${Math.min(...v)}$`, `$R = ${Math.max(...v)} - ${Math.min(...v)} = ${R}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.pick([6, 8]);
          let v, s;
          do {
            v = Array.from({ length: n }, () => r.int(CTX[1], CTX[2]));
            s = [...v].sort((x, y) => x - y);
          } while (s[n / 2 - 1] === s[n / 2]);
          return T({
            text: `Zbrani podatki (${CTX[0]}): ${v.join(", ")}. Kolikšna je mediana?`,
            answer: num(med(v), null, null, [
              [s[n / 2 - 1], "Pri sodem številu podatkov je mediana povprečje srednjih dveh."],
              [s[n / 2], "Pri sodem številu podatkov je mediana povprečje srednjih dveh."],
              [(v[n / 2 - 1] + v[n / 2]) / 2, "Podatke najprej uredi po velikosti."],
            ]),
            hint: "Podatke uredi. Ker jih je sodo mnogo, sta na sredini dva.",
            given: [`\\text{podatki: } ${v.join(", ")}`],
            find: ["M_e"],
            formula: "M_e = \\dfrac{x_{n/2} + x_{n/2 + 1}}{2}",
            steps: [`Urejeno: ${s.join(", ")}`, `Srednja: ${s[n / 2 - 1]} in ${s[n / 2]}`, `$M_e = \\dfrac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${tx(med(v))}$`],
          });
        }
        if (t === 1) {
          const f = [1, 2, 3, 4, 5].map(() => r.int(0, 8));
          f[r.int(1, 3)] += 2;
          const N = sum(f);
          const S = f.reduce((acc, x, i) => acc + x * (i + 1), 0);
          if (S % N === 0) f[4] += 1;
          const N2 = sum(f);
          const S2 = f.reduce((acc, x, i) => acc + x * (i + 1), 0);
          return T({
            text: `Preglednica kaže ocene testa: ocena 1 – ${f[0]}-krat, 2 – ${f[1]}-krat, 3 – ${f[2]}-krat, 4 – ${f[3]}-krat, 5 – ${f[4]}-krat. Kolikšna je povprečna ocena? Zaokroži na dve decimalki.`,
            answer: num(S2 / N2, null, 2, [
              [S2 / 5, "Deli s številom vseh učencev, ne s številom različnih ocen."],
              [3, "Upoštevaj frekvence – vsako oceno pomnoži s številom učencev."],
            ]),
            hint: "Vsako oceno pomnoži z njeno frekvenco, produkte seštej in deli s številom vseh učencev.",
            given: f.map((x, i) => `f_${i + 1} = ${x}`),
            find: ["\\bar{x}"],
            formula: "\\bar{x} = \\dfrac{x_1 f_1 + x_2 f_2 + \\ldots}{f_1 + f_2 + \\ldots}",
            steps: [`Vsota: $${f.map((x, i) => `${i + 1} \\cdot ${x}`).join(" + ")} = ${S2}$`, `Učencev: $${f.join(" + ")} = ${N2}$`, `$\\bar{x} = ${S2} : ${N2} ${eq(S2 / N2, 2)} ${tx(S2 / N2, 2)}$`],
          });
        }
        const kind = r.int(0, 1);
        const AM = "aritmetična sredina";
        const ME = "mediana";
        const MO = "modus";
        if (kind === 0) {
          const pay = Array.from({ length: 5 }, () => r.int(12, 18) * 100);
          pay.push(r.int(8, 15) * 1000);
          return T({
            text: `V majhnem podjetju imajo mesečne plače (v €): ${r.shuffle(pay).join(", ")}. Katera srednja vrednost najbolje opiše tipično plačo?`,
            answer: choice(r, ME, [
              [AM, "Ena zelo visoka plača močno dvigne povprečje, zato ne opiše tipične plače."],
              [MO, "Pri raznolikih zneskih se vrednosti skoraj ne ponavljajo – modus ni uporaben."],
            ]),
            hint: "Ali je med podatki kakšna izstopajoča vrednost? Katera srednja vrednost je nanjo občutljiva?",
            given: ["\\text{posebnost} = \\text{ena plača močno izstopa}"],
            find: ["\\text{najprimernejša srednja vrednost}"],
            formula: "\\text{izstopajoče vrednosti vplivajo na } \\bar{x}, \\text{ ne pa na } M_e",
            steps: ["Ena plača močno izstopa in dvigne povprečje.", "Mediana nanjo ni občutljiva, zato najbolje opiše tipično plačo."],
          });
        }
        return T({
          text: `${name} je ${g(name, "anketiral", "anketirala")} sošolce o najljubši barvi (rdeča, modra, zelena …). Katero srednjo vrednost lahko uporabi za te podatke?`,
          answer: choice(r, MO, [
            [AM, "Barv ne moremo seštevati – povprečja ni mogoče izračunati."],
            [ME, "Barv ne moremo urediti po velikosti – mediane ni."],
          ]),
          hint: "Ali so podatki števila? Ali jih lahko uredimo po velikosti?",
          given: ["\\text{podatki} = \\text{barve (opisni podatki)}"],
          find: ["\\text{uporabna srednja vrednost}"],
          formula: "M_o \\text{ – edina srednja vrednost za opisne podatke}",
          steps: ["Barve niso števila: ne moremo jih seštevati ne urejati.", "Uporabimo modus – najpogostejšo barvo."],
        });
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        let f, N;
        do {
          f = [1, 2, 3, 4, 5].map(() => r.int(1, 7));
          N = sum(f);
        } while (N % 2 === 0);
        const list = f.flatMap((x, i) => Array(x).fill(i + 1));
        const M = list[(N - 1) / 2];
        const modeV = f.indexOf(Math.max(...f)) + 1;
        return T({
          text: `Preglednica kaže ocene ${N} učencev: ocena 1 – ${f[0]}, 2 – ${f[1]}, 3 – ${f[2]}, 4 – ${f[3]}, 5 – ${f[4]}. Kolikšna je mediana ocen?`,
          answer: num(M, null, null, [
            [3, "Mediana ni srednja od različnih ocen – upoštevaj frekvence."],
            [modeV, "To je najpogostejša ocena (modus)."],
            [roundHalfUp(list.reduce((a, b) => a + b, 0) / N, 0), "To je zaokroženo povprečje."],
          ]),
          hint: `Podatki so že urejeni po ocenah. Kateri po vrsti je srednji od ${N} podatkov?`,
          given: f.map((x, i) => `f_${i + 1} = ${x}`),
          find: ["M_e"],
          formula: "M_e = x_{(n+1)/2}",
          steps: [`Srednji podatek je $${(N + 1) / 2}$. po vrsti.`, `Kumulativno: ${f.map((_, i) => sum(f.slice(0, i + 1))).join(", ")}`, `${(N + 1) / 2}. podatek je ocena ${M}: $M_e = ${M}$`],
        });
      }
      if (t === 1) {
        const n = r.int(5, 10);
        const m = r.int(10, 40);
        const x = r.int(5, 60);
        let y = r.int(5, 60);
        if (y === x) y += 3;
        const nm = m + (y - x) / n;
        return T({
          text: `Povprečje ${n} podatkov je ${m}. Pozneje ugotovimo, da smo en podatek zapisali narobe: namesto ${y} smo zapisali ${x}. Kolikšno je pravilno povprečje? Zaokroži na eno decimalko.`,
          answer: num(nm, null, 1, [
            [m + (y - x), "Razliko moraš porazdeliti na vse podatke."],
            [m - (y - x) / n, "Pazi na smer popravka: pravilni podatek je " + (y > x ? "večji" : "manjši") + "."],
          ]),
          hint: "Iz povprečja izračunaj vsoto, jo popravi in znova deli.",
          given: [`\\bar{x} = ${m}`, `n = ${n}`, `\\text{napačno: } ${x}`, `\\text{pravilno: } ${y}`],
          find: ["\\bar{x}_{\\text{novo}}"],
          formula: "\\bar{x} = \\dfrac{\\text{vsota}}{n}",
          steps: [`Napačna vsota: $${n} \\cdot ${m} = ${n * m}$`, `Pravilna vsota: $${n * m} - ${x} + ${y} = ${n * m - x + y}$`, `$\\bar{x} = ${n * m - x + y} : ${n} ${eq(nm, 1)} ${tx(nm, 1)}$`],
        });
      }
      const n = r.pick([5, 7]);
      let v;
      do v = Array.from({ length: n }, () => r.int(CTX[1], CTX[2]));
      while (sum(v) / n === med(v));
      const d = sum(v) / n - med(v);
      return T({
        text: `Zbrani podatki (${CTX[0]}): ${v.join(", ")}. Za koliko se povprečje razlikuje od mediane? (Vpiši razliko povprečje − mediana, zaokroženo na eno decimalko.)`,
        answer: num(d, null, 1, [
          [-d, "Vrstni red odštevanja: povprečje − mediana."],
          [sum(v) / n - v[(n - 1) / 2], "Za mediano podatke najprej uredi."],
        ]),
        hint: "Izračunaj povprečje in mediano (po urejanju), nato ju odštej.",
        given: [`\\text{podatki: } ${v.join(", ")}`],
        find: ["\\bar{x} - M_e"],
        formula: ["\\bar{x} = \\dfrac{\\text{vsota}}{n}", "M_e = \\text{srednji podatek}"],
        steps: [`$\\bar{x} = ${sum(v)} : ${n} ${eq(sum(v) / n, 2)} ${tx(sum(v) / n, 2)}$`, `Urejeno: ${[...v].sort((a, b) => a - b).join(", ")}, $M_e = ${med(v)}$`, `$\\bar{x} - M_e ${eq(d, 1)} ${tx(d, 1)}$`],
      });
    },
  },
  {
    id: "dod-mat-os-npz-stevila",
    topics: ["MAT-OS-9/mesane-naloge-npz"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const p_ = (x) => (x < 0 ? `(${x})` : `${x}`);
      const co = (k) => (k === 1 ? "x" : k === -1 ? "-x" : `${k}x`);
      const delavci = (n) => (n === 2 ? ["2 delavca", "opravila"] : n <= 4 ? [`${n} delavci`, "opravili"] : [`${n} delavcev`, "opravilo"]);
      if (level === 1) {
        const t = r.int(0, 3);
        if (t === 0) {
          const p = r.pick([5, 10, 15, 20, 25, 30, 40, 60, 75]);
          const X = r.int(2, 30) * 20;
          const ans = (p * X) / 100;
          return T({
            text: r.pick([`Koliko je $${p}\\ \\%$ od ${X}?`, `Na šoli je ${X} učencev. $${p}\\ \\%$ jih hodi v šolo s kolesom. Koliko učencev hodi v šolo s kolesom?`]),
            answer: num(ans, null, null, [
              [X / p, "Odstotek pomeni stotino: p % od X je X · p : 100."],
              [(X * p) / 10, "1 % je stotina, ne desetina."],
            ]),
            hint: `$${p}\\ \\% = ${tx(p / 100)}$. Pomnoži s celoto.`,
            given: [`p = ${p}\\ \\%`, `X = ${X}`],
            find: ["\\text{delež}"],
            formula: "\\text{delež} = \\dfrac{p}{100} \\cdot X",
            steps: [`$${p}\\ \\% = ${tx(p / 100)}$`, `$${tx(p / 100)} \\cdot ${X} = ${tx(ans)}$`],
          });
        }
        if (t === 1) {
          const n = r.int(4, 25);
          return T({
            text: `Izračunaj: $\\sqrt{${n * n}}$`,
            answer: num(n, null, null, [
              [(n * n) / 2, "Kvadratni koren ni polovica števila."],
              [-n, "Kvadratni koren pozitivnega števila je pozitiven."],
            ]),
            hint: "Katero nenegativno število, pomnoženo samo s seboj, da to število?",
            given: [`\\text{izraz} = \\sqrt{${n * n}}`],
            find: ["\\text{vrednost}"],
            formula: "\\sqrt{a} = b \\iff b^2 = a,\\ b \\ge 0",
            steps: [`$${n} \\cdot ${n} = ${n * n}$`, `$\\sqrt{${n * n}} = ${n}$`],
          });
        }
        if (t === 2) {
          const a = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
          const b = r.int(1, 9);
          const c = r.int(1, 9);
          const d = r.int(-9, 9);
          const val = a * (b - c) + d;
          const ex = `${p_(a)} \\cdot (${b} - ${c}) ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
          return T({
            text: `Izračunaj: $${ex}$`,
            answer: num(val, null, null, [
              [a * (c - b) + d, "Pazi na vrstni red odštevanja v oklepaju."],
              [a * b - c + d, `S številom ${a} pomnoži celoten oklepaj.`],
              [-a * (b - c) + d, "Pazi na predznak pri množenju."],
            ]),
            hint: "Najprej oklepaj, nato množenje, na koncu seštevanje. Pazi na predznake.",
            given: [`\\text{izraz} = ${ex}`],
            find: ["\\text{vrednost}"],
            formula: "(-) \\cdot (-) = (+),\\quad (-) \\cdot (+) = (-)",
            steps: [`Oklepaj: $${b} - ${c} = ${b - c}$`, `$${p_(a)} \\cdot ${p_(b - c)} = ${a * (b - c)}$`, `$${a * (b - c)} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${val}$`],
          });
        }
        let a, c, x, b, d;
        do {
          a = r.int(2, 9);
          c = r.int(1, 8);
          x = r.nonZero(-8, 8);
          b = r.int(-12, 12);
        } while (a === c);
        d = (a - c) * x + b;
        const eqT = `${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c === 1 ? "" : c}x ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
        return T({
          text: `Reši enačbo: $${eqT}$`,
          answer: num(x, null, null, [
            [(d + b) / (a - c), "Pri prenosu na drugo stran člen spremeni predznak."],
            [(d - b) / (a + c), "Tudi člen z x pri prenosu spremeni predznak."],
          ]),
          hint: "Člene z x zberi na levi, števila na desni strani.",
          given: [eqT],
          find: ["x"],
          formula: "ax + b = cx + d \\Rightarrow (a - c)x = d - b",
          steps: [`$${a}x - ${c}x = ${d} - ${p_(b)}$`, `$${a - c}x = ${d - b}$`, `$x = ${x}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const X = r.int(15, 200);
          const p = r.pick([10, 15, 20, 25, 30, 35, 40]);
          const ans = X * (1 - p / 100);
          return T({
            text: `${name} kupi ${r.pick(["čevlje", "nahrbtnik", "slušalke", "kolo"])} s prvotno ceno $${X}$ €. Trgovina da $${p}\\ \\%$ popusta. Koliko ${g(name, "plača", "plača")}? Rezultat zaokroži na cente.`,
            answer: num(ans, "€", 2, [
              [(X * p) / 100, "To je popust – odštej ga od prvotne cene."],
              [X - p, "Odstotek ni znesek v evrih."],
            ]),
            hint: `Plača $${100 - p}\\ \\%$ prvotne cene.`,
            given: [`X = ${qty(X, EUR)}`, `p = ${p}\\ \\%`],
            find: ["\\text{nova cena}"],
            formula: "\\text{nova cena} = X \\cdot \\left(1 - \\dfrac{p}{100}\\right)",
            steps: [`Popust: $${tx(p / 100)} \\cdot ${X} = ${tx((X * p) / 100)}$ €`, `Nova cena: $${X} - ${tx((X * p) / 100)} = ${qty(tx(ans, 2), EUR)}$`],
          });
        }
        if (t === 1) {
          const a = r.int(2, 6);
          const unit = r.pick([0.9, 1.2, 1.5, 2.4, 3.5]);
          let b = r.int(2, 9);
          if (b === a) b += 1;
          const pa = unit * a;
          const ans = unit * b;
          return T({
            text: `${a} kg jabolk stane $${tx(pa)}$ €. Koliko stane ${b} kg enakih jabolk?`,
            answer: num(ans, "€", 2, [
              [pa + (b - a), "Pri premem sorazmerju se cena poveča enakokrat kot masa, ne za enako število."],
              [(pa * a) / b, "Več kilogramov – višja cena: to je premo sorazmerje."],
            ]),
            hint: "Najprej izračunaj ceno 1 kg.",
            given: [dat("m_1", a, "kg"), `c_1 = ${qty(tx(pa), EUR)}`, dat("m_2", b, "kg")],
            find: ["c_2"],
            formula: "\\dfrac{c_1}{m_1} = \\dfrac{c_2}{m_2}",
            steps: [`1 kg: $${tx(pa)} : ${a} = ${tx(unit)}$ €`, `${b} kg: $${tx(unit)} \\cdot ${b} = ${qty(tx(ans, 2), EUR)}$`],
          });
        }
        if (t === 2) {
          let w1, d1, w2;
          do {
            w1 = r.int(2, 8);
            d1 = r.int(3, 15);
            w2 = r.int(2, 10);
          } while (w1 === w2 || (w1 * d1) % w2 !== 0);
          const ans = (w1 * d1) / w2;
          return T({
            text: `${delavci(w1)[0]} bi pleskanje šole ${delavci(w1)[1]} v ${d1} dneh. V koliko dneh bi enako delo ${delavci(w2)[1]} ${delavci(w2)[0]} (vsi delajo enako hitro)?`,
            answer: num(ans, null, null, [
              [(d1 * w2) / w1, "Več delavcev opravi delo hitreje – to je obratno sorazmerje."],
              [d1 + w1 - w2, "Obratno sorazmerje: produkt delavcev in dni ostane enak."],
            ]),
            hint: "Izračunaj, koliko »delavec-dni« zahteva delo. Ta produkt ostane enak.",
            given: [`n_1 = ${w1}`, `t_1 = ${d1}\\ \\text{dni}`, `n_2 = ${w2}`],
            find: ["t_2"],
            formula: "n_1 \\cdot t_1 = n_2 \\cdot t_2",
            steps: [`$${w1} \\cdot ${d1} = ${w1 * d1}$ delavec-dni`, `$t_2 = ${w1 * d1} : ${w2} = ${ans}$ dni`],
          });
        }
        let s, m;
        do {
          m = r.pick([12, 15, 20, 24, 30, 36, 40, 45]);
          s = r.int(2, 40);
        } while ((s * 60) % m !== 0);
        const v = (s * 60) / m;
        return T({
          text: `Avtobus prevozi $${s}\\ \\mathrm{km}$ v ${m} minutah. Kolikšna je njegova povprečna hitrost v $\\mathrm{km/h}$?`,
          answer: num(v, "km/h", null, [
            [s / m, "Čas pretvori v ure."],
            [(s * m) / 60, "Hitrost je pot, deljena s časom."],
          ]),
          hint: "Minute pretvori v ure ($60\\ \\mathrm{min} = 1\\ \\mathrm{h}$), nato deli pot s časom.",
          given: [dat("s", s, "km"), dat("t", m, "min")],
          find: ["v"],
          formula: "v = \\dfrac{s}{t}",
          steps: [`$t = ${m}\\ \\mathrm{min} = ${fr(frac(m, 60).num, frac(m, 60).den)}\\ \\mathrm{h}$`, `$v = ${s} : ${fr(frac(m, 60).num, frac(m, 60).den)} = ${s} \\cdot ${fr(frac(m, 60).den, frac(m, 60).num)} = ${qty(v, "km/h")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        const X = r.int(20, 300);
        const p = r.pick([10, 20, 25, 30, 40]);
        let q = r.pick([10, 20, 25, 30]);
        const ans = X * (1 + p / 100) * (1 - q / 100);
        return T({
          text: `Cena izdelka je bila $${X}$ €. Najprej so jo povišali za $${p}\\ \\%$, nato novo ceno znižali za $${q}\\ \\%$. Kolikšna je končna cena? Zaokroži na cente.`,
          answer: num(ans, "€", 2, [
            [X * (1 + (p - q) / 100), "Drugi odstotek se računa od nove (povišane) cene, ne od prvotne."],
            [X * (1 + p / 100), "Upoštevaj še znižanje."],
          ]),
          hint: "Najprej izračunaj povišano ceno, nato od nje znižanje.",
          given: [`X = ${qty(X, EUR)}`, `\\text{povišanje} = ${p}\\ \\%`, `\\text{znižanje} = ${q}\\ \\%`],
          find: ["\\text{končna cena}"],
          formula: "X \\cdot \\left(1 + \\dfrac{p}{100}\\right) \\cdot \\left(1 - \\dfrac{q}{100}\\right)",
          steps: [`Po povišanju: $${X} \\cdot ${tx(1 + p / 100)} = ${tx(X * (1 + p / 100))}$ €`, `Po znižanju: $${tx(X * (1 + p / 100))} \\cdot ${tx(1 - q / 100)} ${eq(ans, 2)} ${qty(tx(ans, 2), EUR)}$`],
        });
      }
      if (t === 1) {
        const old = r.int(20, 200);
        let nw = r.int(20, 250);
        if (nw === old) nw += 7;
        const pc = ((nw - old) / old) * 100;
        return T({
          text: `Število obiskovalcev muzeja se je od lani spremenilo s ${old} na ${nw} na dan. Za koliko odstotkov se je spremenilo? (Pri zmanjšanju vpiši negativno število.) Zaokroži na eno decimalko.`,
          answer: num(pc, "%", 1, [
            [((nw - old) / nw) * 100, "Spremembo deli s prvotno (lansko) vrednostjo."],
            [nw - old, "To je sprememba v številu obiskovalcev, ne v odstotkih."],
            [-pc, "Pazi na predznak: povečanje je pozitivno, zmanjšanje negativno."],
          ], { unitAlternatives: ["odstotkov", "odstotka", "odstotke"] }),
          hint: "Spremembo (novo − staro) deli s staro vrednostjo in pomnoži s 100 %.",
          given: [`\\text{staro} = ${old}`, `\\text{novo} = ${nw}`],
          find: ["p"],
          formula: "p = \\dfrac{\\text{novo} - \\text{staro}}{\\text{staro}} \\cdot 100\\ \\%",
          steps: [`Sprememba: $${nw} - ${old} = ${nw - old}$`, `$p = \\dfrac{${nw - old}}{${old}} \\cdot 100\\ \\% ${eq(pc, 1)} ${tx(pc, 1)}\\ \\%$`],
        });
      }
      if (t === 2) {
        let w, D, d, e, rest;
        do {
          w = r.int(3, 8);
          D = r.int(6, 15);
          d = r.int(1, D - 2);
          e = r.int(1, 4);
          rest = ((D - d) * w) / (w + e);
        } while (!Number.isInteger(rest * 2));
        const tot = d + rest;
        return T({
          text: `${delavci(w)[0]} bi delo ${delavci(w)[1]} v ${D} dneh. Po ${d} ${d === 1 ? "dnevu" : "dneh"} se ${e === 1 ? "jim pridruži še 1 enako hiter delavec" : e === 2 ? "jim pridružita še 2 enako hitra delavca" : `jim pridružijo še ${e} enako hitri delavci`}. Koliko dni skupaj traja delo?`,
          answer: num(tot, null, null, [
            [rest, "To je le čas po pridružitvi – prištej še prve dni."],
            [(D * w) / (w + e), "Pred pridružitvijo je bil del dela že opravljen."],
          ]),
          hint: "Izračunaj, koliko delavec-dni dela ostane po prvih dneh, in ga razdeli med vse delavce.",
          given: [`n = ${w}`, `t = ${D}\\ \\text{dni}`, `\\text{čas do pridružitve} = ${d}\\ \\text{${d === 1 ? "dan" : "dni"}}`, `\\text{novi delavci} = ${e}`],
          find: ["t_{\\text{skupaj}}"],
          formula: "n_1 \\cdot t_1 = n_2 \\cdot t_2",
          steps: [`Celo delo: $${w} \\cdot ${D} = ${w * D}$ delavec-dni`, `Ostane: $${w} \\cdot ${D - d} = ${w * (D - d)}$ delavec-dni`, `$${w * (D - d)} : ${w + e} = ${tx(rest)}$ dni`, `Skupaj: $${d} + ${tx(rest)} = ${tx(tot)}$ dni`],
        });
      }
      let x, b, dd;
      do {
        x = r.int(-6, 20);
        b = r.int(2, 5);
        dd = r.int(2, 5);
      } while (b === dd);
      const a = b - (((x % b) + b) % b) + b * r.int(0, 1);
      const c = (((x % dd) + dd) % dd) || dd;
      const e = (x + a) / b - (x - c) / dd;
      const L = lcm(b, dd);
      const cx = L / b - L / dd;
      const wrong = (e * L - (a * L) / b + (c * L) / dd) / cx;
      return T({
        text: `Reši enačbo: $\\dfrac{x + ${a}}{${b}} - \\dfrac{x - ${c}}{${dd}} = ${e}$`,
        answer: num(x, null, null, [
          [wrong, "Minus pred ulomkom spremeni predznak vsem členom števca."],
          [(e - (a * L) / b - (c * L) / dd) / cx, "Z najmanjšim skupnim imenovalcem pomnoži tudi desno stran."],
        ]),
        hint: `Enačbo pomnoži z najmanjšim skupnim imenovalcem ${L}.`,
        given: [`\\dfrac{x + ${a}}{${b}} - \\dfrac{x - ${c}}{${dd}} = ${e}`],
        find: ["x"],
        formula: `\\cdot ${L}`,
        steps: [
          `$${L / b === 1 ? "" : L / b}(x + ${a}) - ${L / dd === 1 ? "" : L / dd}(x - ${c}) = ${e * L}$`,
          `$${co(L / b)} + ${(L / b) * a} - ${co(L / dd)} + ${(L / dd) * c} = ${e * L}$`,
          `$${co(cx)} = ${e * L - (L / b) * a - (L / dd) * c}$`,
          `$x = ${x}$`,
        ],
      });
    },
  },
  {
    id: "dod-mat-os-npz-geometrija",
    topics: ["MAT-OS-9/mesane-naloge-npz"],
    gen(level, r) {
      const PI = 3.14;
      const PIT = "\\pi \\approx 3{,}14";
      if (level === 1) {
        const t = r.int(0, 3);
        if (t === 0) {
          const rr = r.int(2, 15);
          const A = PI * rr * rr;
          return T({
            text: `Krog ima polmer $${rr}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ meri njegova ploščina? Uporabi $${PIT}$ in zaokroži na dve decimalki.`,
            answer: num(A, "cm²", 2, [
              [2 * PI * rr, "To je obseg kroga, ne ploščina."],
              [PI * 4 * rr * rr, "V formuli je polmer, ne premer."],
            ]),
            hint: "Ploščina kroga: $p = \\pi r^2$.",
            given: [dat("r", rr, "cm"), PIT],
            find: ["p"],
            formula: "p = \\pi r^2",
            steps: [`$p = 3{,}14 \\cdot ${rr}^2 = 3{,}14 \\cdot ${rr * rr}$`, `$p ${eq(A, 2)} ${qty(tx(A, 2), "cm²")}$`],
          });
        }
        if (t === 1) {
          const d = r.int(4, 40);
          const o = PI * d;
          return T({
            text: `Okrogla miza ima premer $${d}\\ \\mathrm{dm}$. Koliko dm meri njen obseg? Uporabi $${PIT}$ in zaokroži na dve decimalki.`,
            answer: num(o, "dm", 2, [
              [(PI * d) / 2, "Obseg je π · d (ali 2πr), ne π · r."],
              [(PI * d * d) / 4, "To je ploščina, ne obseg."],
            ]),
            hint: "Obseg kroga: $o = \\pi d$.",
            given: [dat("d", d, "dm"), PIT],
            find: ["o"],
            formula: "o = \\pi d = 2\\pi r",
            steps: [`$o = 3{,}14 \\cdot ${d}$`, `$o ${eq(o, 2)} ${qty(tx(o, 2), "dm")}$`],
          });
        }
        if (t === 2) {
          const [a0, b0, c0] = r.pick([
            [3, 4, 5],
            [5, 12, 13],
            [6, 8, 10],
            [8, 15, 17],
            [9, 12, 15],
          ]);
          const k = r.pick([1, 1, 2, 3]);
          const [a, b, c] = [a0 * k, b0 * k, c0 * k];
          return T({
            text: `Kateti pravokotnega trikotnika merita $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Koliko cm meri hipotenuza?`,
            answer: num(c, "cm", null, [
              [a + b, "Pitagorov izrek velja za kvadrate stranic."],
              [a * a + b * b, "To je kvadrat hipotenuze – izračunaj še koren."],
            ]),
            hint: "Uporabi Pitagorov izrek: $c^2 = a^2 + b^2$.",
            given: [dat("a", a, "cm"), dat("b", b, "cm")],
            find: ["c"],
            formula: "c^2 = a^2 + b^2",
            steps: [`$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$`, `$c = \\sqrt{${c * c}} = ${qty(c, "cm")}$`],
          });
        }
        const a = r.int(3, 20);
        const v = r.int(2, 15);
        return T({
          text: `Trikotnik ima stranico $a = ${a}\\ \\mathrm{cm}$ in pripadajočo višino $v_a = ${v}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ meri njegova ploščina?`,
          answer: num((a * v) / 2, "cm²", null, [[a * v, "Ploščina trikotnika je polovica produkta stranice in višine."]]),
          hint: "Trikotnik je polovica paralelograma z isto osnovnico in višino.",
          given: [dat("a", a, "cm"), dat("v_a", v, "cm")],
          find: ["p"],
          formula: "p = \\dfrac{a \\cdot v_a}{2}",
          steps: [`$p = \\dfrac{${a} \\cdot ${v}}{2}$`, `$p = ${qty(tx((a * v) / 2), "cm²")}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const findLeg = r.next() < 0.5;
          const a = r.int(3, 15);
          const b = r.int(3, 15);
          const c = findLeg ? r.int(Math.max(a, b) + 1, 20) : 0;
          const ans = findLeg ? Math.sqrt(c * c - a * a) : Math.sqrt(a * a + b * b);
          return T({
            text: findLeg
              ? `Hipotenuza pravokotnega trikotnika meri $${c}\\ \\mathrm{cm}$, ena kateta pa $${a}\\ \\mathrm{cm}$. Koliko cm meri druga kateta? Zaokroži na eno decimalko.`
              : `Kateti pravokotnega trikotnika merita $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Koliko cm meri hipotenuza? Zaokroži na eno decimalko.`,
            answer: num(ans, "cm", 1, findLeg ? [[Math.sqrt(c * c + a * a), "Kateta je krajša od hipotenuze – kvadrata odštej."], [c - a, "Pitagorov izrek velja za kvadrate stranic."]] : [[a + b, "Pitagorov izrek velja za kvadrate stranic."], [Math.sqrt(Math.abs(a * a - b * b)), "Hipotenuza je najdaljša stranica – kvadrata seštej."]]),
            hint: findLeg ? "Iz Pitagorovega izreka: $b^2 = c^2 - a^2$." : "Pitagorov izrek: $c^2 = a^2 + b^2$.",
            given: findLeg ? [dat("c", c, "cm"), dat("a", a, "cm")] : [dat("a", a, "cm"), dat("b", b, "cm")],
            find: [findLeg ? "b" : "c"],
            formula: "c^2 = a^2 + b^2",
            steps: findLeg ? [`$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${c * c - a * a}$`, `$b = \\sqrt{${c * c - a * a}} ${eq(ans, 1)} ${qty(tx(ans, 1), "cm")}$`] : [`$c^2 = ${a}^2 + ${b}^2 = ${a * a + b * b}$`, `$c = \\sqrt{${a * a + b * b}} ${eq(ans, 1)} ${qty(tx(ans, 1), "cm")}$`],
          });
        }
        if (t === 1) {
          const d = 2 * r.int(2, 10);
          const v = r.int(5, 30);
          const V = PI * (d / 2) ** 2 * v;
          return T({
            text: `Valjast lonec ima premer dna $${d}\\ \\mathrm{cm}$ in višino $${v}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^3}$ meri njegova prostornina? Uporabi $${PIT}$ in zaokroži na eno decimalko.`,
            answer: num(V, "cm³", 1, [
              [PI * d * d * v, "V formuli je polmer, ne premer."],
              [2 * PI * (d / 2) * v, "To je plašč, ne prostornina."],
            ]),
            hint: "Prostornina valja: ploščina osnovne ploskve (kroga) krat višina. Najprej izračunaj polmer.",
            given: [dat("d", d, "cm"), dat("v", v, "cm"), PIT],
            find: ["V"],
            formula: "V = \\pi r^2 v",
            steps: [`$r = ${d} : 2 = ${d / 2}\\ \\mathrm{cm}$`, `$V = 3{,}14 \\cdot ${d / 2}^2 \\cdot ${v} = 3{,}14 \\cdot ${(d / 2) ** 2} \\cdot ${v}$`, `$V ${eq(V, 1)} ${qty(tx(V, 1), "cm³")}$`],
          });
        }
        if (t === 2) {
          const a = r.int(6, 20);
          const c = r.int(2, a - 2);
          const v = r.int(2, 12);
          const P = ((a + c) * v) / 2;
          return T({
            text: `Trapez ima osnovnici $a = ${a}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$ ter višino $v = ${v}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ meri njegova ploščina?`,
            answer: num(P, "cm²", null, [
              [(a + c) * v, "Vsoto osnovnic je treba razpoloviti."],
              [a * v, "Upoštevaj obe osnovnici."],
            ]),
            hint: "Ploščina trapeza: srednjica krat višina.",
            given: [dat("a", a, "cm"), dat("c", c, "cm"), dat("v", v, "cm")],
            find: ["p"],
            formula: "p = \\dfrac{a + c}{2} \\cdot v",
            steps: [`Srednjica: $\\dfrac{${a} + ${c}}{2} = ${tx((a + c) / 2)}$`, `$p = ${tx((a + c) / 2)} \\cdot ${v} = ${qty(tx(P), "cm²")}$`],
          });
        }
        const a = r.int(30, 150);
        const b = r.int(20, 90);
        const dg = Math.sqrt(a * a + b * b);
        return T({
          text: `Zaslon televizorja je pravokotnik s stranicama $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. Koliko cm meri njegova diagonala? Zaokroži na eno decimalko.`,
          answer: num(dg, "cm", 1, [
            [a + b, "Diagonala ni vsota stranic – uporabi Pitagorov izrek."],
            [a * a + b * b, "To je kvadrat diagonale – izračunaj še koren."],
          ]),
          hint: "Diagonala razdeli pravokotnik na dva pravokotna trikotnika.",
          given: [dat("a", a, "cm"), dat("b", b, "cm")],
          find: ["d"],
          formula: "d^2 = a^2 + b^2",
          steps: [`$d^2 = ${a}^2 + ${b}^2 = ${a * a + b * b}$`, `$d = \\sqrt{${a * a + b * b}} ${eq(dg, 1)} ${qty(tx(dg, 1), "cm")}$`],
        });
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        const [a, b, c] = [r.int(3, 15), r.int(2, 12), r.int(2, 12)];
        const D = Math.sqrt(a * a + b * b + c * c);
        return T({
          text: `Škatla v obliki kvadra meri $${a}\\ \\mathrm{cm} \\times ${b}\\ \\mathrm{cm} \\times ${c}\\ \\mathrm{cm}$. Ali gre vanjo palica? Izračunaj dolžino telesne diagonale v cm in zaokroži na eno decimalko.`,
          answer: num(D, "cm", 1, [
            [Math.sqrt(a * a + b * b), "To je diagonala osnovne ploskve – dodaj še višino."],
            [a + b + c, "Diagonala ni vsota robov."],
          ]),
          hint: "Najprej izračunaj diagonalo osnovne ploskve, nato s Pitagorovim izrekom še telesno diagonalo.",
          given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")],
          find: ["D"],
          formula: "D^2 = a^2 + b^2 + c^2",
          steps: [`$d^2 = ${a}^2 + ${b}^2 = ${a * a + b * b}$`, `$D^2 = d^2 + c^2 = ${a * a + b * b} + ${c * c} = ${a * a + b * b + c * c}$`, `$D = \\sqrt{${a * a + b * b + c * c}} ${eq(D, 1)} ${qty(tx(D, 1), "cm")}$`],
        });
      }
      if (t === 1) {
        const [r0, v0, s0] = r.pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [9, 12, 15],
          [8, 15, 17],
        ]);
        const V = (PI * r0 * r0 * v0) / 3;
        return T({
          text: `Stožec ima polmer osnovne ploskve $${r0}\\ \\mathrm{cm}$ in stranico $s = ${s0}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^3}$ meri njegova prostornina? Uporabi $${PIT}$ in zaokroži na eno decimalko.`,
          answer: num(V, "cm³", 1, [
            [(PI * r0 * r0 * s0) / 3, "Za prostornino potrebuješ višino, ne stranice."],
            [PI * r0 * r0 * v0, "Prostornina stožca je tretjina prostornine valja."],
          ]),
          hint: "Višino izračunaj s Pitagorovim izrekom iz r in s.",
          given: [dat("r", r0, "cm"), dat("s", s0, "cm"), PIT],
          find: ["V"],
          formula: ["v^2 = s^2 - r^2", "V = \\dfrac{\\pi r^2 v}{3}"],
          steps: [`$v = \\sqrt{${s0}^2 - ${r0}^2} = \\sqrt{${s0 * s0 - r0 * r0}} = ${v0}\\ \\mathrm{cm}$`, `$V = \\dfrac{3{,}14 \\cdot ${r0}^2 \\cdot ${v0}}{3}$`, `$V ${eq(V, 1)} ${qty(tx(V, 1), "cm³")}$`],
        });
      }
      if (t === 2) {
        const a = r.int(4, 20);
        const P = a * a - (PI * a * a) / 4;
        return T({
          text: `Iz kvadrata s stranico $${a}\\ \\mathrm{cm}$ izrežemo četrtino kroga s središčem v enem oglišču in polmerom, enakim stranici. Koliko $\\mathrm{cm^2}$ meri ostanek? Uporabi $${PIT}$ in zaokroži na dve decimalki.`,
          answer: num(P, "cm²", 2, [
            [(PI * a * a) / 2 < a * a ? a * a - (PI * a * a) / 2 : NaN, "Izrežemo le četrtino kroga, ne polovice."],
            [(PI * a * a) / 4, "To je izrezani del – iščemo ostanek."],
          ]),
          hint: "Od ploščine kvadrata odštej ploščino četrtine kroga.",
          given: [dat("a", a, "cm"), PIT],
          find: ["p"],
          formula: "p = a^2 - \\dfrac{\\pi a^2}{4}",
          steps: [`Kvadrat: $${a}^2 = ${a * a}\\ \\mathrm{cm^2}$`, `Četrtina kroga: $\\dfrac{3{,}14 \\cdot ${a * a}}{4} = ${tx((PI * a * a) / 4)}\\ \\mathrm{cm^2}$`, `$p = ${a * a} - ${tx((PI * a * a) / 4)} ${eq(P, 2)} ${qty(tx(P, 2), "cm²")}$`],
        });
      }
      const rr = r.int(2, 10);
      const v = r.int(3, 20);
      const P = 2 * PI * rr * rr + 2 * PI * rr * v;
      return T({
        text: `Pločevinka v obliki valja ima polmer $${rr}\\ \\mathrm{cm}$ in višino $${v}\\ \\mathrm{cm}$. Koliko $\\mathrm{cm^2}$ pločevine potrebujemo zanjo (dno, pokrov in plašč)? Uporabi $${PIT}$ in zaokroži na eno decimalko.`,
        answer: num(P, "cm²", 1, [
          [2 * PI * rr * v, "To je le plašč – dodaj še dno in pokrov."],
          [PI * rr * rr + 2 * PI * rr * v, "Valj ima dve osnovni ploskvi."],
        ]),
        hint: "Površina valja = 2 · osnovna ploskev + plašč.",
        given: [dat("r", rr, "cm"), dat("v", v, "cm"), PIT],
        find: ["P"],
        formula: "P = 2\\pi r^2 + 2\\pi r v",
        steps: [`$2 \\cdot 3{,}14 \\cdot ${rr}^2 = ${tx(2 * PI * rr * rr)}$`, `$2 \\cdot 3{,}14 \\cdot ${rr} \\cdot ${v} = ${tx(2 * PI * rr * v)}$`, `$P ${eq(P, 1)} ${qty(tx(P, 1), "cm²")}$`],
      });
    },
  },
];

// Pomožna: skupni delitelj, manjši od največjega (za tipično napako); če ga ni, 1.
function v1(a, b) {
  const c = divisors(a).filter((d) => b % d === 0);
  return c.length > 1 ? c[c.length - 2] : 1;
}
