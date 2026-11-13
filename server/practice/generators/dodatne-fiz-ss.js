// Generatorji za teme, ki prej niso imele nalog (fiz-ss). Merila: docs/kakovost.md §2.
// Gimnazija, 1.–4. letnik. Vsaka naloga: besedilo, odgovor (s tipičnimi napakami), namig, podatki, formula, rešitev po korakih.
import { NAMES, g } from "../rng.js";
import { roundHalfUp, fmt } from "../check.js";
import { tx } from "./mat.js";

const GZ = 9.81; // težni pospešek
const G_TEX = "9{,}81";
const E0 = 1.6e-19; // osnovni naboj
const EPS0 = 8.85e-12;
const MU0 = 4 * Math.PI * 1e-7;
const H = 6.63e-34;
const C = 3.0e8;
const ME = 9.11e-31;
const MP = 1.67e-27;
const R_GAS = 8.31;
const GRAV = 6.67e-11;
const MZ = 5.97e24;
const RZ = 6370; // km
const C_ZVOK = 340;

// TeX zapisi konstant (brez $)
const K = {
  g: `g = ${G_TEX}\\ \\mathrm{m/s^2}`,
  e0: "e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}",
  eps0: "\\varepsilon_0 = 8{,}85 \\cdot 10^{-12}\\ \\mathrm{As/Vm}",
  mu0: "\\mu_0 = 4\\pi \\cdot 10^{-7}\\ \\mathrm{Vs/Am}",
  h: "h = 6{,}63 \\cdot 10^{-34}\\ \\mathrm{Js}",
  c: "c = 3{,}00 \\cdot 10^{8}\\ \\mathrm{m/s}",
  me: "m_e = 9{,}11 \\cdot 10^{-31}\\ \\mathrm{kg}",
  mp: "m_p = 1{,}67 \\cdot 10^{-27}\\ \\mathrm{kg}",
  R: "R = 8{,}31\\ \\mathrm{J/(mol\\,K)}",
  G: "G = 6{,}67 \\cdot 10^{-11}\\ \\mathrm{N\\,m^2/kg^2}",
  MZ: "M_Z = 5{,}97 \\cdot 10^{24}\\ \\mathrm{kg}",
  RZ: "R_Z = 6370\\ \\mathrm{km}",
  cz: "c = 340\\ \\mathrm{m/s}",
};

// Količina z enoto (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}"; enota z \ ostane, prazna enota odpade.
const qty = (val, unit) => (!unit ? `${val}` : `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`);
const dat = (sym, val, unit) => `${sym} = ${qty(val, unit)}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const res = (x, d, unit) => `${needsRounding(x, d) ? "\\approx" : "="} ${qty(tx(x, d), unit)}`;
const eq = (x, d) => (needsRounding(x, d) ? "\\approx" : "=");
const deg = (x, d = null) => `${tx(x, d)}^\\circ`;
const resd = (x, d) => `${eq(x, d)} ${deg(x, d)}`;
const rad = (a) => (a * Math.PI) / 180;
const todeg = (x) => (x * 180) / Math.PI;
const decOf = (v) => (String(v).split(".")[1] || "").length;
const plain = (x, d) => fmt(x, d); // za izbirne odgovore (navadno besedilo)
// Število v znanstvenem zapisu za TeX: sci(6.67e-11) → "6{,}67 \cdot 10^{-11}"
function sci(x, dm = 2) {
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = roundHalfUp(x / 10 ** e, dm);
  if (Math.abs(m) >= 10) {
    m /= 10;
    e++;
  }
  return `${tx(m, dm)} \\cdot 10^{${e}}`;
}

const M = (value, why) => ({ value, why });
// Številski odgovor; tipične napake, ki bi se zaokrožile v pravilni rezultat ali se ponovijo, izpustimo.
function num(value, unit, decimals, mistakes = [], extra = {}) {
  const same = (a, b) => (decimals == null ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) : roundHalfUp(a, decimals) === roundHalfUp(b, decimals));
  const kept = [];
  for (const m of mistakes) {
    if (!m || !Number.isFinite(m.value) || same(m.value, value) || kept.some((k) => same(k.value, m.value))) continue;
    kept.push(m);
  }
  const alts = [...(extra.unitAlternatives || [])];
  if (unit.includes("µ")) alts.push(unit.replace("µ", "u"), unit.replace("µ", "μ"));
  if (unit.includes("Ω")) alts.push(unit.replace("Ω", "ohm"));
  const a = { type: "number", value, unit, decimals, ...extra };
  if (alts.length) a.unitAlternatives = alts;
  else delete a.unitAlternatives;
  if (kept.length) a.mistakes = kept.slice(0, 3);
  return a;
}
// Izbirni odgovor: correct je besedilo pravilne možnosti, wrong = [[besedilo, zakaj narobe], …] (vzamemo največ 3).
function choice(r, correct, wrong) {
  const opts = r.shuffle([[correct, null], ...r.shuffle(wrong).slice(0, 3)]);
  return { type: "choice", options: opts.map((o) => o[0]), index: opts.findIndex((o) => o[1] === null), why: opts.map((o) => o[1]) };
}
// Sestavi nalogo; steps so vrstice rešitve.
// Podatek, katerega števila niso v besedilu (npr. g, e0, gostota vode), besedilo navede z »Uporabi …«.
const normT = (x) => String(x).replace(/\{,\}/g, ",").replace(/\\[,;: ]|~/g, " ");
const numsT = (x) => normT(x).match(/-?\d+(?:,\d+)?/g) || [];
const withConsts = (text, given) => {
  const miss = given.filter((g) => g.includes("=") && numsT(g.split("=").slice(1).join("=")).some((x) => !normT(text).includes(x)));
  if (!miss.length) return text;
  const l = miss.map((g) => `$${g}$`);
  const list = l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} in ${l.at(-1)}`;
  if (text.includes(" Zaokroži ")) return text.replace(" Zaokroži ", ` Uporabi ${list}${l.length === 1 ? " in" : " ter"} zaokroži `);
  if (text.includes(" Rezultat ")) return text.replace(" Rezultat ", ` Uporabi ${list}. Rezultat `);
  return `${text} Uporabi ${list}.`;
};
const T = (text, answer, hint, given, find, formula, steps) => ({ text: withConsts(text, given), answer, hint, data: { given, find }, formula, solution: steps.join("\n") });
const ime = (r) => r.pick(NAMES);
const dw = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : `na ${d} decimalke`);

export const DODATNE_FIZ_SS = [
  // ---------------- 1. letnik ----------------
  {
    id: "dod-fiz-ss-merske-napake",
    topics: ["FIZ-SS-1/merske-napake"],
    gen(level, r) {
      const n = ime(r);
      const MER = [
        { what: "dolžino mize", s: "l", u: "cm", lo: 60, hi: 180, dxs: [0.1, 0.2, 0.5], tool: "z merilnim trakom" },
        { what: "maso jabolka", s: "m", u: "g", lo: 90, hi: 250, dxs: [0.1, 0.5, 1], tool: "s kuhinjsko tehtnico" },
        { what: "čas teka na 60 m", s: "t", u: "s", lo: 7.5, hi: 11, dxs: [0.1, 0.2, 0.05], tool: "z ročno štoparico" },
        { what: "napetost baterije", s: "U", u: "V", lo: 1.2, hi: 9.5, dxs: [0.01, 0.02, 0.05], tool: "z voltmetrom" },
        { what: "premer žice", s: "d", u: "mm", lo: 0.5, hi: 2.5, dxs: [0.01, 0.02], tool: "z mikrometrskim vijakom" },
        { what: "prostornino vode", s: "V", u: "mL", lo: 20, hi: 95, dxs: [0.5, 1], tool: "z merilnim valjem" },
      ];
      if (level === 1) {
        const c = r.pick(MER);
        const dx = r.pick(c.dxs);
        const dd = decOf(dx);
        const x = r.dec(c.lo, c.hi, dd);
        const xs = tx(x, dd);
        if (r.next() < 0.6) {
          const rel = (dx / x) * 100;
          const d = rel < 0.1 ? 3 : rel < 1 ? 2 : 1;
          return T(
            `${n} je ${c.tool} ${g(n, "izmeril", "izmerila")} ${c.what}: $${c.s} = (${xs} \\pm ${tx(dx)})\\ \\mathrm{${c.u}}$. Kolikšna je relativna napaka meritve v odstotkih? Zaokroži ${dw(d)}.`,
            num(rel, "%", d, [M(dx / x, "Si pozabil količnik pomnožiti s 100 %?"), M(x / dx, "Si delil v obratnem vrstnem redu? Absolutno napako deliš z izmerjeno vrednostjo.")]),
            `Absolutno napako $\\Delta ${c.s}$ deli z izmerjeno vrednostjo $${c.s}$, nato količnik izrazi v odstotkih.`,
            [dat(c.s, xs, c.u), dat(`\\Delta ${c.s}`, tx(dx), c.u)],
            [`\\delta_{${c.s}}`],
            [`\\delta_{${c.s}} = \\dfrac{\\Delta ${c.s}}{${c.s}} \\cdot 100\\ \\%`],
            [`$\\dfrac{\\Delta ${c.s}}{${c.s}} = \\dfrac{${qty(tx(dx), c.u)}}{${qty(xs, c.u)}} \\approx ${tx(dx / x, 5)}$`, `$\\delta_{${c.s}} = ${tx(dx / x, 5)} \\cdot 100\\ \\% ${res(rel, d, "\\%")}$`],
          );
        }
        const pct = r.pick([0.5, 1, 1.5, 2, 2.5, 4, 5]);
        const dxr = (x * pct) / 100;
        const d = dd + 1;
        return T(
          `Proizvajalec navaja, da ima merilnik relativno napako $${tx(pct)}\\ \\%$. ${n} z njim ${g(n, "izmeri", "izmeri")} ${c.what} in dobi $${c.s} = ${qty(xs, c.u)}$. Kolikšna je absolutna napaka meritve? Zaokroži ${dw(d)}.`,
          num(dxr, c.u, d, [M(x * pct, "Si odstotke pretvoril v decimalno število ($\\delta / 100$)?"), M(x / pct, "Absolutna napaka je zmnožek relativne napake in izmerjene vrednosti, ne količnik.")]),
          `Iz $\\delta = \\dfrac{\\Delta ${c.s}}{${c.s}}$ izrazi $\\Delta ${c.s}$; odstotke najprej pretvori v decimalno število.`,
          [dat(c.s, xs, c.u), dat(`\\delta_{${c.s}}`, tx(pct), "\\%")],
          [`\\Delta ${c.s}`],
          [`\\Delta ${c.s} = \\delta_{${c.s}} \\cdot ${c.s}`],
          [`$\\delta_{${c.s}} = ${tx(pct)}\\ \\% = ${tx(pct / 100)}$`, `$\\Delta ${c.s} = ${tx(pct / 100)} \\cdot ${qty(xs, c.u)} ${res(dxr, d, c.u)}$`],
        );
      }
      if (level === 2) {
        const SER = [
          { what: "čas desetih nihajev nihala", s: "t", u: "s", lo: 8, hi: 16, step: 0.1 },
          { what: "dolžino zvezka", s: "l", u: "cm", lo: 24, hi: 30, step: 0.1 },
          { what: "čas padanja kroglice z mize", s: "t", u: "s", lo: 0.38, hi: 0.46, step: 0.01 },
          { what: "višino skoka", s: "h", u: "cm", lo: 35, hi: 60, step: 1 },
          { what: "maso kovanca", s: "m", u: "g", lo: 3, hi: 8, step: 0.01 },
        ];
        const c = r.pick(SER);
        const kind = r.pick(["serija", "serija", "zapis", "pretvorba"]);
        if (kind === "serija") {
          const sd = decOf(c.step);
          const base = r.dec(c.lo, c.hi, sd);
          let o;
          do o = [0, 1, 2, 3, 4].map(() => r.int(-3, 3));
          while (Math.max(...o) - Math.min(...o) < 2);
          const xs = o.map((k) => base + k * c.step);
          const sum = o.reduce((a, b) => a + b, 0);
          const mean = base + (sum / 5) * c.step;
          const dev = (Math.max(...o.map((k) => Math.abs(5 * k - sum))) / 5) * c.step;
          const range = (Math.max(...o) - Math.min(...o)) * c.step;
          const d = sd + 1;
          const list = xs.map((v) => `$${tx(v, sd)}\\ \\mathrm{${c.u}}$`).join(", ");
          return T(
            `${n} je petkrat ${g(n, "izmeril", "izmerila")} ${c.what}: ${list}. Kolikšna je absolutna napaka, če jo oceniš kot največji odmik meritve od povprečja? Zaokroži ${dw(d)}.`,
            num(dev, c.u, d, [M(range, "To je razpon meritev (največja − najmanjša), ne odmik od povprečja."), M(range / 2, "To je polovica razpona; tu napako oceni kot največji odmik od povprečja."), M(mean, "To je povprečna vrednost; vprašanje sprašuje po absolutni napaki.")]),
            "Najprej izračunaj povprečje vseh petih meritev, nato poišči meritev, ki je od povprečja najbolj oddaljena.",
            [`${c.s}_1, \\dots, ${c.s}_5 = ${xs.map((v) => tx(v, sd)).join(";\\ ")}\\ \\mathrm{${c.u}}`],
            [`\\Delta ${c.s}`],
            [`\\bar{${c.s}} = \\dfrac{${c.s}_1 + \\dots + ${c.s}_5}{5}`, `\\Delta ${c.s} = \\max |${c.s}_i - \\bar{${c.s}}|`],
            [
              `$\\bar{${c.s}} = \\dfrac{${xs.map((v) => tx(v, sd)).join(" + ")}}{5}\\ \\mathrm{${c.u}} = ${qty(tx(mean, sd + 1), c.u)}$`,
              `Odmiki od povprečja: ${xs.map((v) => `$${tx(Math.abs(v - mean), sd + 1)}$`).join(", ")} ${c.u}`,
              `$\\Delta ${c.s} = ${qty(tx(dev, d), c.u)}$ (največji odmik)`,
            ],
          );
        }
        if (kind === "zapis") {
          const sd = 2;
          let mean, err;
          do {
            mean = r.dec(c.lo, c.hi, 2);
            err = r.dec(0.11, 0.84, 2);
          } while (Math.round(mean * 100) % 10 === 0 || Math.round(err * 100) % 10 === 0 || roundHalfUp(mean, 1) === roundHalfUp(mean, 0));
          const m1 = roundHalfUp(mean, 1);
          const e1 = roundHalfUp(err, 1);
          const f = (a, da, b, db) => `(${plain(a, da)} ± ${plain(b, db)}) ${c.u}`;
          return {
            ...T(
              `${n} je večkrat ${g(n, "izmeril", "izmerila")} ${c.what}. Povprečje meritev je $\\bar{${c.s}} = ${qty(tx(mean, sd), c.u)}$, ocenjena absolutna napaka pa $\\Delta ${c.s} = ${qty(tx(err, 2), c.u)}$. Kateri zapis rezultata je pravilen?`,
              choice(r, f(m1, 1, e1, 1), [
                [f(mean, 2, e1, 1), "Vrednost ima več decimalk kot napaka; zadnja zapisana števka vrednosti mora biti na istem mestu kot napaka."],
                [f(m1, 1, err, 2), "Absolutno napako zaokrožimo na eno veljavno mesto."],
                [f(roundHalfUp(mean, 0), 0, e1, 1), "Vrednost je zaokrožena preveč grobo; zaokroži jo na isto decimalno mesto kot napako."],
              ]),
              "Najprej zaokroži napako na eno veljavno mesto, nato vrednost na isto decimalno mesto.",
              [dat(`\\bar{${c.s}}`, tx(mean, sd), c.u), dat(`\\Delta ${c.s}`, tx(err, 2), c.u)],
              ["\\text{zapis } (\\bar{x} \\pm \\Delta x)"],
              ["x = (\\bar{x} \\pm \\Delta x)\\ \\text{enota}"],
              [`Napako zaokrožimo na eno veljavno mesto: $\\Delta ${c.s} \\approx ${qty(tx(e1, 1), c.u)}$.`, `Vrednost zaokrožimo na desetinke: $\\bar{${c.s}} \\approx ${qty(tx(m1, 1), c.u)}$.`, `Zapis: $${c.s} = (${tx(m1, 1)} \\pm ${tx(e1, 1)})\\ \\mathrm{${c.u}}$`],
            ),
          };
        }
        // pretvorba enot
        const P = r.pick([
          { what: "dolžino hodnika", s: "l", u: "m", x: r.dec(8, 40, 2), du: "mm", dx: r.pick([2, 5, 10]), f: 1e-3 },
          { what: "pot kolesarske ture", s: "s", u: "km", x: r.dec(8, 60, 1), du: "m", dx: r.pick([10, 20, 50]), f: 1e-3 },
          { what: "maso vreče cementa", s: "m", u: "kg", x: r.dec(20, 50, 1), du: "g", dx: r.pick([50, 100, 200]), f: 1e-3 },
          { what: "čas vožnje", s: "t", u: "min", x: r.int(12, 90), du: "s", dx: r.pick([1, 2, 5]), f: 1 / 60 },
        ]);
        const dxc = P.dx * P.f;
        const rel = (dxc / P.x) * 100;
        const d = rel < 0.1 ? 3 : rel < 1 ? 2 : 1;
        return T(
          `${n} ${g(n, "izmeri", "izmeri")} ${P.what} $${P.s} = ${qty(tx(P.x), P.u)}$ z absolutno napako $${qty(P.dx, P.du)}$. Kolikšna je relativna napaka v odstotkih? Zaokroži ${dw(d)}.`,
          num(rel, "%", d, [M((P.dx / P.x) * 100, `Si napako pretvoril v ${P.u}? Obe količini morata biti v isti enoti.`), M(dxc / P.x, "Si pozabil količnik pomnožiti s 100 %?")]),
          `Absolutno napako najprej pretvori v $\\mathrm{${P.u}}$, potem jo deli z izmerjeno vrednostjo.`,
          [dat(P.s, tx(P.x), P.u), dat(`\\Delta ${P.s}`, P.dx, P.du)],
          [`\\delta_{${P.s}}`],
          [`\\delta_{${P.s}} = \\dfrac{\\Delta ${P.s}}{${P.s}} \\cdot 100\\ \\%`],
          [`$\\Delta ${P.s} = ${qty(P.dx, P.du)} ${eq(dxc, 5)} ${qty(tx(dxc, 5), P.u)}$`, `$\\delta_{${P.s}} = \\dfrac{${qty(tx(dxc, 5), P.u)}}{${qty(tx(P.x), P.u)}} \\cdot 100\\ \\% ${res(rel, d, "\\%")}$`],
        );
      }
      // level 3: napaka izračunane količine (produkt, količnik)
      const kind = r.pick(["ploscina", "gostota", "hitrost"]);
      if (kind === "ploscina") {
        const a = r.dec(12, 40, 1);
        const b = r.dec(8, 30, 1);
        const da = r.pick([0.1, 0.2]);
        const db = r.pick([0.1, 0.2]);
        const S = a * b;
        const dS = S * (da / a + db / b);
        const obj = r.pick(["pravokotne mize", "lista papirja", "okenskega stekla", "pravokotne plošče"]);
        return T(
          `Stranici ${obj} sta $a = (${tx(a, 1)} \\pm ${tx(da)})\\ \\mathrm{cm}$ in $b = (${tx(b, 1)} \\pm ${tx(db)})\\ \\mathrm{cm}$. Kolikšna je absolutna napaka ploščine? Zaokroži na eno decimalko.`,
          num(dS, "cm²", 1, [M(da + db, "Absolutnih napak stranic ne smeš kar sešteti – pri množenju se seštejejo relativne napake."), M(da * db, "Napaki stranic ne zmnožiš; seštej relativni napaki in ju pomnoži s ploščino."), M(S * Math.abs(da / a - db / b), "Pri množenju se relativni napaki seštejeta, ne odštejeta.")]),
          "Izračunaj relativni napaki obeh stranic; pri zmnožku se relativni napaki seštejeta.",
          [`a = ${tx(a, 1)}\\ \\mathrm{cm},\\ \\Delta a = ${qty(tx(da), "cm")}`, `b = ${tx(b, 1)}\\ \\mathrm{cm},\\ \\Delta b = ${qty(tx(db), "cm")}`],
          ["\\Delta S"],
          ["S = a \\cdot b", "\\delta_S = \\delta_a + \\delta_b", "\\Delta S = \\delta_S \\cdot S"],
          [
            `$S = ${tx(a, 1)} \\cdot ${qty(tx(b, 1), "cm")} = ${qty(tx(S, 2), "cm^2")}$`,
            `$\\delta_a = \\dfrac{${tx(da)}}{${tx(a, 1)}} \\approx ${tx(da / a, 4)},\\quad \\delta_b = \\dfrac{${tx(db)}}{${tx(b, 1)}} \\approx ${tx(db / b, 4)}$`,
            `$\\delta_S = \\delta_a + \\delta_b \\approx ${tx(da / a + db / b, 4)}$`,
            `$\\Delta S = \\delta_S \\cdot S ${res(dS, 1, "cm^2")}$`,
          ],
        );
      }
      if (kind === "gostota") {
        const m = r.dec(40, 300, 1);
        const dm = r.pick([0.1, 0.2, 0.5]);
        const V = r.int(15, 110);
        const dV = r.pick([0.5, 1, 2]);
        const rel = (dm / m + dV / V) * 100;
        const what = r.pick(["kamna", "kovinskega valja", "kosa plastelina", "steklene frnikole"]);
        return T(
          `Za določitev gostote ${what} ${n} ${g(n, "izmeri", "izmeri")} maso $m = (${tx(m, 1)} \\pm ${tx(dm)})\\ \\mathrm{g}$ in prostornino $V = (${V} \\pm ${tx(dV)})\\ \\mathrm{cm^3}$. Kolikšna je relativna napaka izračunane gostote v odstotkih? Zaokroži na eno decimalko.`,
          num(rel, "%", 1, [M(Math.abs(dm / m - dV / V) * 100, "Tudi pri deljenju se relativni napaki seštejeta, ne odštejeta."), M((dm / m) * 100, "Upoštevati moraš tudi napako prostornine."), M((dV / V) * 100, "Upoštevati moraš tudi napako mase.")]),
          "Gostota je količnik mase in prostornine; pri količniku se relativni napaki seštejeta.",
          [`m = ${tx(m, 1)}\\ \\mathrm{g},\\ \\Delta m = ${qty(tx(dm), "g")}`, `V = ${V}\\ \\mathrm{cm^3},\\ \\Delta V = ${qty(tx(dV), "cm^3")}`],
          ["\\delta_\\rho"],
          ["\\rho = \\dfrac{m}{V}", "\\delta_\\rho = \\delta_m + \\delta_V"],
          [
            `$\\delta_m = \\dfrac{${tx(dm)}}{${tx(m, 1)}} \\cdot 100\\ \\% \\approx ${tx((dm / m) * 100, 3)}\\ \\%$`,
            `$\\delta_V = \\dfrac{${tx(dV)}}{${V}} \\cdot 100\\ \\% \\approx ${tx((dV / V) * 100, 3)}\\ \\%$`,
            `$\\delta_\\rho = \\delta_m + \\delta_V ${res(rel, 1, "\\%")}$`,
          ],
        );
      }
      const s = r.pick([50, 60, 100, 200, 400]);
      const ds = r.pick([0.1, 0.2, 0.5]);
      const t = r.dec(s / 9, s / 4, 1);
      const dt = r.pick([0.1, 0.2, 0.3]);
      const v = s / t;
      const dv = v * (ds / s + dt / t);
      return T(
        `${n} ${g(n, "preteče", "preteče")} progo dolžine $s = (${s} \\pm ${tx(ds)})\\ \\mathrm{m}$ v času $t = (${tx(t, 1)} \\pm ${tx(dt)})\\ \\mathrm{s}$. Kolikšna je absolutna napaka povprečne hitrosti? Zaokroži na dve decimalki.`,
        num(dv, "m/s", 2, [M(ds / dt, "Napak ne deliš med sabo; seštej relativni napaki poti in časa."), M(v * Math.abs(ds / s - dt / t), "Pri količniku se relativni napaki seštejeta, ne odštejeta."), M(v * (dt / t), "Upoštevati moraš tudi napako poti.")]),
        "Najprej izračunaj hitrost, nato relativni napaki poti in časa ter ju seštej.",
        [`s = ${s}\\ \\mathrm{m},\\ \\Delta s = ${qty(tx(ds), "m")}`, `t = ${tx(t, 1)}\\ \\mathrm{s},\\ \\Delta t = ${qty(tx(dt), "s")}`],
        ["\\Delta v"],
        ["v = \\dfrac{s}{t}", "\\delta_v = \\delta_s + \\delta_t", "\\Delta v = \\delta_v \\cdot v"],
        [
          `$v = \\dfrac{${qty(s, "m")}}{${qty(tx(t, 1), "s")}} \\approx ${qty(tx(v, 3), "m/s")}$`,
          `$\\delta_v = \\dfrac{${tx(ds)}}{${s}} + \\dfrac{${tx(dt)}}{${tx(t, 1)}} \\approx ${tx(ds / s + dt / t, 4)}$`,
          `$\\Delta v = \\delta_v \\cdot v ${res(dv, 2, "m/s")}$`,
        ],
      );
    },
  },
  {
    id: "dod-fiz-ss-sestavljanje-hitrosti",
    topics: ["FIZ-SS-1/vektorji-v-kinematiki"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        if (r.next() < 0.5) {
          const C1 = r.pick([
            { txt: (u, v, z) => `Vlak vozi s hitrostjo $${v}\\ \\mathrm{km/h}$. ${n} hodi po vagonu s hitrostjo $${u}\\ \\mathrm{km/h}$ ${z ? "v smeri vožnje" : "proti smeri vožnje"}. Kolikšna je ${g(n, "njegova", "njena")} hitrost glede na tla?`, v: [60, 160], u: [3, 6], unit: "km/h" },
            { txt: (u, v, z) => `Letalo leti s hitrostjo $${v}\\ \\mathrm{km/h}$ glede na zrak. Veter piha s hitrostjo $${u}\\ \\mathrm{km/h}$ ${z ? "v smeri leta" : "naravnost proti letalu"}. Kolikšna je hitrost letala glede na tla?`, v: [600, 900], u: [40, 150], unit: "km/h" },
            { txt: (u, v, z) => `Tekoče stopnice se gibljejo s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$. ${n} po njih hodi s hitrostjo $${tx(u)}\\ \\mathrm{m/s}$ glede na stopnice, ${z ? "v smeri gibanja stopnic" : "v nasprotni smeri"}. Kolikšna je ${g(n, "njegova", "njena")} hitrost glede na tla?`, v: [0.5, 0.8], u: [1.0, 1.6], unit: "m/s", dec: 1 },
            { txt: (u, v, z) => `Čoln pluje s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$ glede na vodo, reka teče s hitrostjo $${tx(u)}\\ \\mathrm{m/s}$. Čoln pluje ${z ? "s tokom" : "proti toku"}. Kolikšna je njegova hitrost glede na breg?`, v: [3, 6], u: [0.5, 2.5], unit: "m/s", dec: 1 },
          ]);
          const dd = C1.dec || 0;
          const v = dd ? r.dec(C1.v[0], C1.v[1], dd) : r.int(C1.v[0], C1.v[1]);
          let u = dd ? r.dec(C1.u[0], C1.u[1], dd) : r.int(C1.u[0], C1.u[1]);
          const z = r.next() < 0.5;
          const ans = z ? v + u : Math.abs(v - u);
          const un = C1.unit === "km/h" ? "km/h" : "m/s";
          return T(
            C1.txt(dd ? u : u, v, z),
            num(ans, un, null, [M(z ? v - u : v + u, z ? "Hitrosti imata isto smer, zato se seštejeta." : "Hitrosti imata nasprotni smeri, zato ju odštej.")], { tolerance: 1e-9 }),
            "Hitrosti v isti smeri seštejemo, v nasprotnih smereh odštejemo.",
            [dat("v_1", tx(v), un), dat("v_2", tx(u), un)],
            ["v"],
            [z ? "v = v_1 + v_2" : "v = |v_1 - v_2|"],
            [`Hitrosti ${z ? "kažeta v isto smer" : "kažeta v nasprotni smeri"}, zato ${z ? "ju seštejemo" : "ju odštejemo"}.`, `$v = ${qty(tx(z ? v : Math.max(v, u)), un)} ${z ? "+" : "-"} ${qty(tx(z ? u : Math.min(v, u)), un)} = ${qty(tx(ans), un)}$`],
          );
        }
        const vc = r.dec(2, 6, 1);
        const vr = r.dec(0.8, 3, 1);
        const vv = Math.hypot(vc, vr);
        const ctx = r.pick([
          `${n} vesla s čolnom pravokotno na tok reke s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$ glede na vodo. Reka teče s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$.`,
          `Plavalec plava čez reko pravokotno na breg s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$ glede na vodo, voda teče s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$.`,
          `Dron leti proti severu s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$ glede na zrak, veter piha proti vzhodu s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$.`,
        ]);
        return T(
          `${ctx} Kolikšna je velikost hitrosti glede na tla? Zaokroži na dve decimalki.`,
          num(vv, "m/s", 2, [M(vc + vr, "Hitrosti sta pravokotni, zato ju ne smeš kar sešteti; seštej ju kot vektorja."), M(Math.abs(vc - vr), "Hitrosti sta pravokotni – uporabi Pitagorov izrek.")]),
          "Pravokotni hitrosti seštej kot vektorja: rezultanta je hipotenuza pravokotnega trikotnika.",
          [dat("v_1", tx(vc), "m/s"), dat("v_2", tx(vr), "m/s")],
          ["v"],
          ["v = \\sqrt{v_1^2 + v_2^2}"],
          [`$v^2 = (${tx(vc)})^2 + (${tx(vr)})^2\\ \\mathrm{m^2/s^2} = ${tx(vc * vc + vr * vr, 2)}\\ \\mathrm{m^2/s^2}$`, `$v = \\sqrt{${tx(vc * vc + vr * vr, 2)}}\\ \\mathrm{m/s} ${res(vv, 2, "m/s")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const d = r.int(30, 200);
          const vc = r.dec(1.5, 5, 1);
          const vr = r.dec(0.5, 2.5, 1);
          const x = (vr * d) / vc;
          const who = r.pick([`${n} s čolnom`, "Trajekt", `${n} s kajakom`, "Plavalec"]);
          return T(
            `${who} prečka ${d} m široko reko. Glede na vodo se giblje s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$ pravokotno na breg, reka teče s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$. Koliko metrov dolvodno od izhodišča pristane na drugem bregu? Zaokroži na eno decimalko.`,
            num(x, "m", 1, [M((vc * d) / vr, "Si zamenjal hitrosti? Čas prečkanja določa hitrost pravokotno na breg."), M(Math.hypot(d, x), "To je celotna prepotovana pot, ne odmik vzdolž brega.")]),
            "Najprej izračunaj čas prečkanja iz širine reke in hitrosti pravokotno na breg; v tem času tok čoln odnaša.",
            [dat("d", d, "m"), dat("v_c", tx(vc), "m/s"), dat("v_r", tx(vr), "m/s")],
            ["x"],
            ["t = \\dfrac{d}{v_c}", "x = v_r \\cdot t"],
            [`$t = \\dfrac{d}{v_c} = \\dfrac{${qty(d, "m")}}{${qty(tx(vc), "m/s")}} ${res(d / vc, 2, "s")}$`, `$x = v_r \\cdot t = ${qty(tx(vr), "m/s")} \\cdot ${qty(tx(d / vc, 2), "s")} ${res(x, 1, "m")}$`],
          );
        }
        const v = r.int(150, 300);
        const u = r.int(30, 90);
        const tmin = r.pick([20, 30, 40, 45, 50, 90]);
        const t = tmin / 60;
        const s = Math.hypot(v * t, u * t);
        return T(
          `Malo letalo leti proti severu s hitrostjo $${v}\\ \\mathrm{km/h}$ glede na zrak. Veter piha proti vzhodu s hitrostjo $${u}\\ \\mathrm{km/h}$. Kako daleč od vzletišča je letalo po $${tmin}\\ \\mathrm{min}$? Zaokroži na eno decimalko.`,
          num(s, "km", 1, [M((v + u) * t, "Hitrosti sta pravokotni; ne seštej ju kot števili."), M(Math.hypot(v, u) * tmin, "Si čas pretvoril v ure?"), M(v * t, "Upoštevati moraš tudi zanašanje zaradi vetra.")]),
          "Določi hitrost letala glede na tla (pravokotni hitrosti), nato pot v danem času; čas pretvori v ure.",
          [dat("v_1", v, "km/h"), dat("v_2", u, "km/h"), dat("t", tmin, "min")],
          ["s"],
          ["v = \\sqrt{v_1^2 + v_2^2}", "s = v \\cdot t"],
          [`$t = ${tmin}\\ \\mathrm{min} ${eq(t, 4)} ${qty(tx(t, 4), "h")}$`, `$v = \\sqrt{${v}^2 + ${u}^2}\\ \\mathrm{km/h} ${res(Math.hypot(v, u), 2, "km/h")}$`, `$s = v \\cdot t ${res(s, 1, "km")}$`],
        );
      }
      const kind = r.pick(["cas", "kot", "dez"]);
      if (kind === "dez") {
        const vd = r.dec(4, 9, 1);
        const vk = r.int(30, 90);
        const vms = vk / 3.6;
        const phi = todeg(Math.atan(vms / vd));
        return T(
          `Dežne kaplje padajo navpično s hitrostjo $${tx(vd)}\\ \\mathrm{m/s}$. ${n} se vozi v avtu s hitrostjo $${vk}\\ \\mathrm{km/h}$. Pod kolikšnim kotom glede na navpičnico vidi sledi kapelj na stranskem steklu? Zaokroži na eno decimalko.`,
          num(phi, "°", 1, [M(90 - phi, "To je kot glede na vodoravnico, sprašujemo po kotu glede na navpičnico."), M(todeg(Math.atan(vk / vd)), "Si hitrost avta pretvoril v m/s?")]),
          "Glede na avto ima kaplja dve pravokotni komponenti hitrosti: navpično hitrost padanja in vodoravno hitrost, ki je enaka hitrosti avta (v nasprotni smeri).",
          [dat("v_k", tx(vd), "m/s"), dat("v_a", vk, "km/h")],
          ["\\varphi"],
          ["\\tan\\varphi = \\dfrac{v_a}{v_k}"],
          [`$v_a = ${vk}\\ \\mathrm{km/h} ${eq(vms, 2)} ${qty(tx(vms, 2), "m/s")}$`, `$\\tan\\varphi = \\dfrac{${tx(vms, 2)}}{${tx(vd)}} \\approx ${tx(vms / vd, 3)}$`, `$\\varphi ${resd(phi, 1)}$`],
        );
      }
      const d = r.int(40, 150);
      const vc = r.dec(2.5, 5, 1);
      const vr = r.dec(0.6, Math.min(2.2, vc - 0.6), 1);
      const vp = Math.sqrt(vc * vc - vr * vr);
      if (kind === "cas") {
        const t = d / vp;
        return T(
          `${n} želi s čolnom prečkati ${d} m široko reko tako, da pristane natančno nasproti izhodišča. Glede na vodo vesla s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$, reka teče s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$. Koliko časa traja prečkanje? Zaokroži na eno decimalko.`,
          num(t, "s", 1, [M(d / vc, "Čoln mora biti obrnjen delno proti toku, zato je njegova hitrost pravokotno na breg manjša od hitrosti glede na vodo."), M(d / Math.hypot(vc, vr), "Hitrost glede na breg je tu krajša kateta, ne hipotenuza."), M(d / (vc - vr), "Hitrosti nista vzporedni; uporabi Pitagorov izrek.")]),
          "Hitrost glede na vodo je hipotenuza: ena kateta izniči tok, druga kaže pravokotno čez reko.",
          [dat("d", d, "m"), dat("v_c", tx(vc), "m/s"), dat("v_r", tx(vr), "m/s")],
          ["t"],
          ["v_\\perp = \\sqrt{v_c^2 - v_r^2}", "t = \\dfrac{d}{v_\\perp}"],
          [`$v_\\perp = \\sqrt{(${tx(vc)})^2 - (${tx(vr)})^2}\\ \\mathrm{m/s} ${res(vp, 3, "m/s")}$`, `$t = \\dfrac{${qty(d, "m")}}{${qty(tx(vp, 3), "m/s")}} ${res(t, 1, "s")}$`],
        );
      }
      const a = todeg(Math.asin(vr / vc));
      return T(
        `Čoln pluje s hitrostjo $${tx(vc)}\\ \\mathrm{m/s}$ glede na vodo, reka teče s hitrostjo $${tx(vr)}\\ \\mathrm{m/s}$. Za kolikšen kot glede na smer, pravokotno na breg, mora krmar obrniti čoln proti toku, da bo plul naravnost čez reko? Zaokroži na eno decimalko.`,
        num(a, "°", 1, [M(todeg(Math.atan(vr / vc)), "Hitrost glede na vodo je hipotenuza, zato uporabi sinus, ne tangensa."), M(90 - a, "To je kot glede na breg; sprašujemo po kotu glede na pravokotnico na breg.")]),
        "Nariši trikotnik hitrosti: hitrost čolna glede na vodo je hipotenuza, hitrost toka je kateta nasproti iskanemu kotu.",
        [dat("v_c", tx(vc), "m/s"), dat("v_r", tx(vr), "m/s")],
        ["\\alpha"],
        ["\\sin\\alpha = \\dfrac{v_r}{v_c}"],
        [`$\\sin\\alpha = \\dfrac{${tx(vr)}}{${tx(vc)}} \\approx ${tx(vr / vc, 4)}$`, `$\\alpha ${resd(a, 1)}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-vodoravni-met",
    topics: ["FIZ-SS-1/vektorji-v-kinematiki"],
    gen(level, r) {
      const n = ime(r);
      const W = r.pick([
        { h: [0.7, 1.2], to: "na tla", t: (h, v) => `Kroglica se s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$ odkotali z roba $${tx(h)}\\ \\mathrm{m}$ visoke mize.` },
        { h: [5, 25], to: "v vodo", t: (h, v) => `${n} z mostu, ki je $${tx(h)}\\ \\mathrm{m}$ nad vodo, vrže kamen vodoravno s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$.` },
        { h: [3, 12], to: "na tla", t: (h, v) => `Z balkona v višini $${tx(h)}\\ \\mathrm{m}$ ${n} vrže žogo vodoravno s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$.` },
        { h: [20, 60], to: "v vodo", t: (h, v) => `Iz $${tx(h)}\\ \\mathrm{m}$ visoke pečine skakalec v vodo odskoči vodoravno s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$.` },
        { h: [0.8, 1.6], to: "na tla", t: (h, v) => `Curek vode brizga vodoravno iz cevi v višini $${tx(h)}\\ \\mathrm{m}$ s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$.` },
      ]);
      const h = r.dec(W.h[0], W.h[1], 1);
      const v0 = r.dec(1.5, 12, 1);
      const t = Math.sqrt((2 * h) / GZ);
      const gi = [dat("h", tx(h), "m"), dat("v_0", tx(v0), "m/s"), K.g];
      if (level === 1) {
        if (r.next() < 0.6) {
          return T(
            `${W.t(h, v0)} Koliko časa je v zraku? Zračni upor zanemari. Zaokroži na dve decimalki.`,
            num(t, "s", 2, [M(Math.sqrt(h / GZ), "Si pozabil faktor 2 v enačbi $h = \\frac{g t^2}{2}$?"), M((2 * h) / GZ, "Pozabil si koreniti."), M(h / v0, "Vodoravna hitrost ne vpliva na čas padanja; določa ga le višina.")]),
            "V navpični smeri telo prosto pada (začetna navpična hitrost je 0), vodoravna hitrost na čas padanja ne vpliva.",
            gi,
            ["t"],
            ["h = \\dfrac{g t^2}{2}", "t = \\sqrt{\\dfrac{2h}{g}}"],
            [`$t^2 = \\dfrac{2h}{g} = \\dfrac{2 \\cdot ${qty(tx(h), "m")}}{${qty(G_TEX, "m/s^2")}} \\approx ${tx(t * t, 4)}\\ \\mathrm{s^2}$`, `$t = \\sqrt{${tx(t * t, 4)}\\ \\mathrm{s^2}} ${res(t, 2, "s")}$`],
          );
        }
        const tt = r.dec(0.4, 3, 1);
        const hh = (GZ * tt * tt) / 2;
        return T(
          `${n} vrže kamen vodoravno z vrha stolpa. Kamen pade na tla po $${tx(tt)}\\ \\mathrm{s}$. Kako visok je stolp? Zračni upor zanemari. Zaokroži na eno decimalko.`,
          num(hh, "m", 1, [M(GZ * tt * tt, "Si pozabil deliti z 2?"), M(GZ * tt, "To je navpična hitrost ob padcu, ne višina.")]),
          "Navpično gibanje je prosti pad: $h = \\dfrac{g t^2}{2}$.",
          [dat("t", tx(tt), "s"), K.g],
          ["h"],
          ["h = \\dfrac{g t^2}{2}"],
          [`$t^2 = (${qty(tx(tt), "s")})^2 = ${qty(tx(tt * tt, 2), "s^2")}$`, `$h = \\dfrac{${G_TEX} \\cdot ${tx(tt * tt, 2)}}{2}\\ \\mathrm{m} ${res(hh, 1, "m")}$`],
        );
      }
      const D = v0 * t;
      if (level === 2) {
        return T(
          `${W.t(h, v0)} Kako daleč (vodoravno) od mesta meta pade? Zračni upor zanemari. Zaokroži na dve decimalki.`,
          num(D, "m", 2, [M(v0 * Math.sqrt(h / GZ), "Si pozabil faktor 2 pri računanju časa padanja?"), M(v0 * ((2 * h) / GZ), "Čas padanja dobiš s korenjenjem."), M(h, "Domet ni enak višini; izračunaj čas padanja in ga pomnoži z vodoravno hitrostjo.")]),
          "Najprej iz višine izračunaj čas padanja; v tem času se telo vodoravno giblje enakomerno.",
          gi,
          ["D"],
          ["t = \\sqrt{\\dfrac{2h}{g}}", "D = v_0 \\cdot t"],
          [`$t = \\sqrt{\\dfrac{2 \\cdot ${qty(tx(h), "m")}}{${qty(G_TEX, "m/s^2")}}} ${res(t, 3, "s")}$`, `$D = v_0 \\cdot t = ${qty(tx(v0), "m/s")} \\cdot ${qty(tx(t, 3), "s")} ${res(D, 2, "m")}$`],
        );
      }
      const kind = r.pick(["hitrost", "kot", "obratno"]);
      if (kind === "hitrost") {
        const vy = GZ * t;
        const v = Math.hypot(v0, vy);
        return T(
          `${W.t(h, v0)} S kolikšno hitrostjo prileti ${W.to}? Zračni upor zanemari. Zaokroži na eno decimalko.`,
          num(v, "m/s", 1, [M(v0 + vy, "Komponenti hitrosti sta pravokotni – ne seštej ju kot števili."), M(vy, "Upoštevati moraš tudi vodoravno komponento hitrosti."), M(Math.sqrt(GZ * h + v0 * v0), "Navpična komponenta je $v_y = \\sqrt{2gh}$; si pozabil faktor 2?")]),
          "Vodoravna komponenta hitrosti se ne spreminja, navpično pa telo prosto pada. Komponenti nato sestavi.",
          gi,
          ["v"],
          ["v_y = \\sqrt{2 g h}", "v = \\sqrt{v_0^2 + v_y^2}"],
          [`$v_y = \\sqrt{2 \\cdot ${G_TEX} \\cdot ${tx(h)}}\\ \\mathrm{m/s} ${res(vy, 2, "m/s")}$`, `$v = \\sqrt{(${tx(v0)})^2 + (${tx(vy, 2)})^2}\\ \\mathrm{m/s} ${res(v, 1, "m/s")}$`],
        );
      }
      if (kind === "kot") {
        const vy = GZ * t;
        const phi = todeg(Math.atan(vy / v0));
        return T(
          `${W.t(h, v0)} Pod kolikšnim kotom glede na vodoravnico prileti ${W.to}? Zračni upor zanemari. Zaokroži na eno decimalko.`,
          num(phi, "°", 1, [M(90 - phi, "To je kot glede na navpičnico."), M(todeg(Math.atan(h / D)), "Kot hitrosti ni enak kotu zveznice med točko meta in točko pristanka.")]),
          "Izračunaj navpično komponento hitrosti ob pristanku; kot določa razmerje med navpično in vodoravno komponento.",
          gi,
          ["\\varphi"],
          ["v_y = \\sqrt{2 g h}", "\\tan\\varphi = \\dfrac{v_y}{v_0}"],
          [`$v_y = \\sqrt{2 \\cdot ${G_TEX} \\cdot ${tx(h)}}\\ \\mathrm{m/s} ${res(vy, 2, "m/s")}$`, `$\\tan\\varphi = \\dfrac{${tx(vy, 2)}}{${tx(v0)}} \\approx ${tx(vy / v0, 3)}$`, `$\\varphi ${resd(phi, 1)}$`],
        );
      }
      const hh = r.dec(1.5, 6, 1);
      const DD = r.dec(2, 10, 1);
      const th = Math.sqrt((2 * hh) / GZ);
      const vv = DD / th;
      const ctx = r.pick([
        `${n} želi s kamnom, vrženim vodoravno z višine $${tx(hh)}\\ \\mathrm{m}$, zadeti pločevinko, ki je vodoravno oddaljena $${tx(DD)}\\ \\mathrm{m}$.`,
        `Žoga se odbije z vodoravne strehe garaže, ki je visoka $${tx(hh)}\\ \\mathrm{m}$, in pade na tla $${tx(DD)}\\ \\mathrm{m}$ od roba.`,
        `Teniška žogica zapusti lopar vodoravno na višini $${tx(hh)}\\ \\mathrm{m}$ in pade na tla $${tx(DD)}\\ \\mathrm{m}$ daleč.`,
      ]);
      return T(
        `${ctx} Kolikšna je bila vodoravna začetna hitrost? Zračni upor zanemari. Zaokroži na dve decimalki.`,
        num(vv, "m/s", 2, [M(DD / Math.sqrt(hh / GZ), "Si pozabil faktor 2 pri času padanja?"), M(Math.sqrt(2 * GZ * hh), "To je navpična hitrost ob pristanku, ne vodoravna začetna hitrost.")]),
        "Čas leta določa le višina. Ko ga poznaš, iz dometa izračunaš vodoravno hitrost.",
        [dat("h", tx(hh), "m"), dat("D", tx(DD), "m"), K.g],
        ["v_0"],
        ["t = \\sqrt{\\dfrac{2h}{g}}", "v_0 = \\dfrac{D}{t}"],
        [`$t = \\sqrt{\\dfrac{2 \\cdot ${tx(hh)}}{${G_TEX}}}\\ \\mathrm{s} ${res(th, 3, "s")}$`, `$v_0 = \\dfrac{D}{t} = \\dfrac{${qty(tx(DD), "m")}}{${qty(tx(th, 3), "s")}} ${res(vv, 2, "m/s")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-sile",
    topics: ["FIZ-SS-1/sile"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.pick(["pravokotni", "komponenta", "komponenta", "vrste"]);
        if (kind === "vrste") {
          const S = r.pick([
            { body: "Knjiga miruje na mizi.", ok: "sila mize na knjigo (sila podlage)", pair: "sila knjige na mizo", earth: "sila, s katero knjiga privlači Zemljo" },
            { body: "Svetilka visi na vrvici in miruje.", ok: "sila vrvice na svetilko", pair: "sila svetilke na vrvico", earth: "sila, s katero svetilka privlači Zemljo" },
            { body: "Lesena kocka plava na vodi in miruje.", ok: "vzgon (sila vode na kocko)", pair: "sila kocke na vodo", earth: "sila, s katero kocka privlači Zemljo" },
            { body: "Jabolko visi na veji in miruje.", ok: "sila peclja na jabolko", pair: "sila jabolka na pecelj", earth: "sila, s katero jabolko privlači Zemljo" },
          ]);
          return {
            ...T(
              `${S.body} Katera sila uravnovesi težo tega telesa?`,
              choice(r, S.ok, [
                [S.pair, "Ta sila deluje na drugo telo; je par sile podlage po 3. Newtonovem zakonu, zato ne more uravnovesiti teže."],
                [S.earth, "To je par teže po 3. Newtonovem zakonu in deluje na Zemljo, ne na telo."],
                ["nobena, telo miruje, ker nanj ne deluje nobena sila", "Telo miruje, ker je vsota sil nanj enaka nič – teža deluje vedno."],
              ]),
              "Uravnovesita se lahko le sili, ki delujeta na isto telo. Poišči, katero drugo telo se tega telesa dotika.",
              ["\\text{stanje telesa} = \\text{miruje}"],
              ["\\text{sila, ki uravnovesi težo}"],
              ["\\sum \\vec F = 0 \\ \\text{(telo miruje)}"],
              ["Telo miruje, zato je vsota vseh sil nanj nič.", "Na telo delujeta teža (navzdol) in sila telesa, ki se ga dotika (navzgor).", `Težo uravnovesi: ${S.ok}.`],
            ),
          };
        }
        if (kind === "pravokotni") {
          const F1 = r.int(3, 40) * 10;
          const F2 = r.int(3, 40) * 10;
          const R = Math.hypot(F1, F2);
          const ctx = r.pick([`Dva vlačilca vlečeta ladjo s silama $${F1}\\ \\mathrm{N}$ in $${F2}\\ \\mathrm{N}$, ki sta pravokotni.`, `${n} in prijatelj vlečeta sani z vrvema; sili $${F1}\\ \\mathrm{N}$ in $${F2}\\ \\mathrm{N}$ oklepata pravi kot.`, `Na zaboj delujeta vodoravni sili $${F1}\\ \\mathrm{N}$ proti vzhodu in $${F2}\\ \\mathrm{N}$ proti severu.`]);
          return T(
            `${ctx} Kolikšna je velikost rezultante? Zaokroži na celo število.`,
            num(R, "N", 0, [M(F1 + F2, "Sili nista vzporedni – ne seštej ju kot števili."), M(Math.abs(F1 - F2), "Sili sta pravokotni, ne nasprotni; uporabi Pitagorov izrek.")]),
            "Pravokotni sili sta kateti, rezultanta je hipotenuza.",
            [dat("F_1", F1, "N"), dat("F_2", F2, "N")],
            ["F_r"],
            ["F_r = \\sqrt{F_1^2 + F_2^2}"],
            [`$F_r^2 = ${F1}^2 + ${F2}^2\\ \\mathrm{N^2} = ${F1 * F1 + F2 * F2}\\ \\mathrm{N^2}$`, `$F_r = \\sqrt{${F1 * F1 + F2 * F2}}\\ \\mathrm{N} ${res(R, 0, "N")}$`],
          );
        }
        const F = r.int(20, 300);
        const a = r.pick([15, 20, 25, 30, 35, 40, 45, 50, 60]);
        const hor = r.next() < 0.6;
        const val = hor ? F * Math.cos(rad(a)) : F * Math.sin(rad(a));
        const ctx = r.pick([`${n} vleče kovček za ročaj s silo $${F}\\ \\mathrm{N}$, ki z vodoravnico oklepa kot $${a}^\\circ$.`, `${n} vleče sani z vrvjo, ki je nagnjena za $${a}^\\circ$ glede na tla; sila vrvi je $${F}\\ \\mathrm{N}$.`, `Na zaboj deluje poševna sila $${F}\\ \\mathrm{N}$ pod kotom $${a}^\\circ$ nad vodoravnico.`]);
        return T(
          `${ctx} Kolikšna je ${hor ? "vodoravna" : "navpična"} komponenta te sile? Zaokroži na eno decimalko.`,
          num(val, "N", 1, [M(hor ? F * Math.sin(rad(a)) : F * Math.cos(rad(a)), hor ? "Vodoravna komponenta leži ob kotu z vodoravnico, zato uporabi kosinus." : "Navpična komponenta leži nasproti kota z vodoravnico, zato uporabi sinus."), M(F, "Sila je poševna, zato je komponenta manjša od sile.")]),
          "Silo razstavi na komponenti: komponenta ob kotu je $F\\cos\\alpha$, nasproti kota pa $F\\sin\\alpha$.",
          [dat("F", F, "N"), `\\alpha = ${a}^\\circ`],
          [hor ? "F_x" : "F_y"],
          [hor ? "F_x = F \\cos\\alpha" : "F_y = F \\sin\\alpha"],
          [`$${hor ? "F_x = F \\cos\\alpha" : "F_y = F \\sin\\alpha"} = ${qty(F, "N")} \\cdot ${hor ? "\\cos" : "\\sin"} ${a}^\\circ$`, `$${hor ? "F_x" : "F_y"} = ${F} \\cdot ${tx(hor ? Math.cos(rad(a)) : Math.sin(rad(a)), 4)}\\ \\mathrm{N} ${res(val, 1, "N")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const F1 = r.int(2, 30) * 5;
          const F2 = r.int(2, 30) * 5;
          const phi = r.pick([30, 45, 60, 120, 135, 150]);
          const R = Math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * Math.cos(rad(phi)));
          return T(
            `Na kavelj delujeta sili $F_1 = ${F1}\\ \\mathrm{N}$ in $F_2 = ${F2}\\ \\mathrm{N}$, ki oklepata kot $${phi}^\\circ$. Kolikšna je velikost rezultante? Zaokroži na eno decimalko.`,
            num(R, "N", 1, [M(F1 + F2, "Rezultanta je enaka vsoti velikosti le, če sili kažeta v isto smer."), M(Math.hypot(F1, F2), "Sili nista pravokotni, zato Pitagorov izrek ne zadošča."), M(Math.sqrt(F1 * F1 + F2 * F2 - 2 * F1 * F2 * Math.cos(rad(phi))), "Kot med silama ni kot v trikotniku sil; v kosinusnem izreku je tu predznak +.")]),
            "Sili sestavi s paralelogramom; velikost diagonale dobiš s kosinusnim izrekom.",
            [dat("F_1", F1, "N"), dat("F_2", F2, "N"), `\\varphi = ${phi}^\\circ`],
            ["F_r"],
            ["F_r = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\varphi}"],
            [`$\\cos ${phi}^\\circ ${eq(Math.cos(rad(phi)), 4)} ${tx(Math.cos(rad(phi)), 4)}$`, `$F_r^2 = ${F1}^2 + ${F2}^2 + 2 \\cdot ${F1} \\cdot ${F2} \\cdot ${tx(Math.cos(rad(phi)), 4)}\\ \\mathrm{N^2} \\approx ${tx(R * R, 1)}\\ \\mathrm{N^2}$`, `$F_r ${res(R, 1, "N")}$`],
          );
        }
        const m = r.dec(5, 40, 1);
        const F = r.int(20, 120);
        const a = r.pick([20, 25, 30, 35, 40, 45]);
        const acc = (F * Math.cos(rad(a))) / m;
        return T(
          `${n} na ledu vleče sani z maso $${tx(m)}\\ \\mathrm{kg}$ z vrvjo, ki z vodoravnico oklepa kot $${a}^\\circ$. Sila vrvi je $${F}\\ \\mathrm{N}$. Kolikšen je pospešek sani? Trenje zanemari. Zaokroži na dve decimalki.`,
          num(acc, "m/s²", 2, [M(F / m, "Sani pospešuje le vodoravna komponenta sile vrvi."), M((F * Math.sin(rad(a))) / m, "Vodoravna komponenta je ob kotu z vodoravnico – uporabi kosinus.")]),
          "Silo vrvi razstavi; sani pospešuje le njena vodoravna komponenta.",
          [dat("m", tx(m), "kg"), dat("F", F, "N"), `\\alpha = ${a}^\\circ`],
          ["a"],
          ["F_x = F\\cos\\alpha", "a = \\dfrac{F_x}{m}"],
          [`$F_x = ${F} \\cdot \\cos ${a}^\\circ\\ \\mathrm{N} ${res(F * Math.cos(rad(a)), 2, "N")}$`, `$a = \\dfrac{${qty(tx(F * Math.cos(rad(a)), 2), "N")}}{${qty(tx(m), "kg")}} ${res(acc, 2, "m/s^2")}$`],
        );
      }
      if (r.next() < 0.5) {
        const m = r.dec(1, 12, 1);
        const a = r.pick([5, 8, 10, 12, 15, 20, 25, 30]);
        const Tn = (m * GZ) / (2 * Math.sin(rad(a)));
        const ctx = r.pick([`Svetilka z maso $${tx(m)}\\ \\mathrm{kg}$ visi na sredi žice, napete med dvema drogovoma.`, `Na sredi vrvi za perilo visi moker plašč z maso $${tx(m)}\\ \\mathrm{kg}$.`, `Prometni znak z maso $${tx(m)}\\ \\mathrm{kg}$ visi na sredi jeklenice med dvema stavbama.`]);
        return T(
          `${ctx} Vsaka polovica je nagnjena za $${a}^\\circ$ glede na vodoravnico. Kolikšna je sila v vsaki polovici? Zaokroži na celo število.`,
          num(Tn, "N", 0, [M((m * GZ) / 2, "Vsaka polovica je poševna; navpično težo nosita le navpični komponenti."), M((m * GZ) / (2 * Math.cos(rad(a))), "Kot je merjen od vodoravnice, zato je navpična komponenta $F\\sin\\alpha$."), M(m * GZ, "Težo si delita dve polovici.")]),
          "Telo miruje: navpični komponenti obeh sil skupaj uravnovesita težo. Nariši trikotnik sil.",
          [dat("m", tx(m), "kg"), `\\alpha = ${a}^\\circ`, K.g],
          ["F"],
          ["F_g = m g", "2F\\sin\\alpha = F_g"],
          [`$F_g = ${tx(m)} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(m * GZ, 2, "N")}$`, `$F = \\dfrac{F_g}{2\\sin\\alpha} = \\dfrac{${qty(tx(m * GZ, 2), "N")}}{2 \\cdot ${tx(Math.sin(rad(a)), 4)}} ${res(Tn, 0, "N")}$`],
        );
      }
      const m = r.dec(20, 120, 0);
      const Fmax = r.int(Math.ceil(m * GZ * 0.2), Math.floor(m * GZ * 0.8));
      const alpha = todeg(Math.asin(Fmax / (m * GZ)));
      const ctx = r.pick([`Voziček z maso $${m}\\ \\mathrm{kg}$ stoji na gladkem klancu, privezan z vrvjo, vzporedno s klancem.`, `Zaboj z maso $${m}\\ \\mathrm{kg}$ na gladki rampi drži vrv, napeta vzporedno z rampo.`]);
      return T(
        `${ctx} Vrv zdrži največ $${Fmax}\\ \\mathrm{N}$. Kolikšen je največji naklon klanca, pri katerem vrv še ne poči? Trenje zanemari. Zaokroži na eno decimalko.`,
        num(alpha, "°", 1, [M(todeg(Math.acos(Fmax / (m * GZ))), "Komponenta teže vzdolž klanca je $mg\\sin\\alpha$, ne $mg\\cos\\alpha$."), M(todeg(Math.atan(Fmax / (m * GZ))), "Uporabi sinus, ker je sila vrvi enaka komponenti teže vzdolž klanca $mg\\sin\\alpha$.")]),
        "Teža se na klancu razstavi na komponento vzdolž klanca in pravokotno nanj. Vrv drži komponento vzdolž klanca.",
        [dat("m", m, "kg"), dat("F_{max}", Fmax, "N"), K.g],
        ["\\alpha"],
        ["F_\\parallel = m g \\sin\\alpha", "\\sin\\alpha = \\dfrac{F_{max}}{m g}"],
        [`$m g = ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(m * GZ, 1, "N")}$`, `$\\sin\\alpha = \\dfrac{${Fmax}}{${tx(m * GZ, 1)}} \\approx ${tx(Fmax / (m * GZ), 4)}$`, `$\\alpha ${resd(alpha, 1)}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-trenje",
    topics: ["FIZ-SS-1/trenje"],
    gen(level, r) {
      const n = ime(r);
      const PAR = [
        { what: "lesen zaboj", acc: "lesen zaboj", on: "lesenih tleh", kl: 0.5, kt: 0.3 },
        { what: "kovinska omara", acc: "kovinsko omaro", on: "betonskih tleh", kl: 0.6, kt: 0.45 },
        { what: "kartonska škatla", acc: "kartonsko škatlo", on: "linoleju", kl: 0.4, kt: 0.3 },
        { what: "zaboj s knjigami", acc: "zaboj s knjigami", on: "parketu", kl: 0.45, kt: 0.35 },
        { what: "pralni stroj", acc: "pralni stroj", on: "keramičnih ploščicah", kl: 0.55, kt: 0.4 },
      ];
      const P = r.pick(PAR);
      const m = r.int(10, 80);
      const Fg = m * GZ;
      if (level === 1) {
        if (r.next() < 0.5) {
          const F = P.kt * Fg;
          return T(
            `${P.acc[0].toUpperCase() + P.acc.slice(1)} z maso $${m}\\ \\mathrm{kg}$ potiskamo po ${P.on} s stalno hitrostjo. Koeficient trenja je $${tx(P.kt)}$. S kolikšno vodoravno silo ga potiskamo? Zaokroži na celo število.`,
            num(F, "N", 0, [M(P.kt * m, "Sila trenja je sorazmerna sili podlage (teži), ne masi; pomnoži še z $g$."), M(Fg, "Pri stalni hitrosti je potisna sila enaka sili trenja, ne teži.")]),
            "Pri stalni hitrosti je vsota sil nič, zato je potisna sila enaka sili trenja.",
            [dat("m", m, "kg"), `k_{tr} = ${tx(P.kt)}`, K.g],
            ["F"],
            ["F = F_{tr} = k_{tr} \\cdot F_N = k_{tr}\\, m g"],
            [`$F_N = m g = ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(Fg, 1, "N")}$`, `$F = k_{tr} F_N = ${tx(P.kt)} \\cdot ${qty(tx(Fg, 1), "N")} ${res(F, 0, "N")}$`],
          );
        }
        const k = r.dec(0.15, 0.7, 2);
        const F = roundHalfUp(k * Fg, 0);
        const kk = F / Fg;
        return T(
          `${n} z vzmetno tehtnico enakomerno vleče ${P.acc} z maso $${m}\\ \\mathrm{kg}$ po vodoravnih tleh. Tehtnica kaže $${F}\\ \\mathrm{N}$. Kolikšen je koeficient trenja? Zaokroži na dve decimalki.`,
          num(kk, "", 2, [M(F / m, "Silo trenja deli s silo podlage (težo), ne z maso."), M(Fg / F, "Si delil v obratnem vrstnem redu?")]),
          "Pri enakomernem gibanju je sila tehtnice enaka sili trenja. Koeficient je razmerje med silo trenja in silo podlage.",
          [dat("m", m, "kg"), dat("F_{tr}", F, "N"), K.g],
          ["k_{tr}"],
          ["k_{tr} = \\dfrac{F_{tr}}{F_N},\\ F_N = m g"],
          [`$F_N = ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(Fg, 1, "N")}$`, `$k_{tr} = \\dfrac{${F}}{${tx(Fg, 1)}} ${eq(kk, 2)} ${tx(kk, 2)}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["lepenje", "pospesek", "zavora"]);
        if (kind === "lepenje") {
          const Fmax = P.kl * Fg;
          const F = r.int(Math.ceil(0.25 * Fmax), Math.floor(0.9 * Fmax));
          return T(
            `${n} z vodoravno silo $${F}\\ \\mathrm{N}$ potiska ${P.acc} z maso $${m}\\ \\mathrm{kg}$ po ${P.on}, a se ta ne premakne. Koeficient lepenja je $${tx(P.kl)}$. Kolikšna je sila lepenja na zaboj?`,
            num(F, "N", null, [M(Fmax, "To je največja možna sila lepenja; dejanska je le tolikšna, da uravnovesi potisno silo."), M(P.kt * Fg, "Telo miruje, zato ne gre za trenje pri drsenju.")], { tolerance: 1e-9 }),
            "Najprej izračunaj največjo možno silo lepenja in jo primerjaj s potisno silo. Ker zaboj miruje, je vsota sil nič.",
            [dat("F", F, "N"), dat("m", m, "kg"), `k_l = ${tx(P.kl)}`, K.g],
            ["F_l"],
            ["F_{l,max} = k_l\\, m g", "F_l = F \\ \\text{(če } F < F_{l,max})"],
            [`$F_{l,max} = ${tx(P.kl)} \\cdot ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(Fmax, 1, "N")}$`, `$F = ${qty(F, "N")} < F_{l,max}$, zato zaboj miruje.`, `Vsota sil je nič: $F_l = F = ${qty(F, "N")}$`],
          );
        }
        if (kind === "pospesek") {
          const Ft = P.kt * Fg;
          const F = r.int(Math.ceil(Ft * 1.15), Math.floor(Ft * 2));
          const a = (F - Ft) / m;
          return T(
            `${n} vleče ${P.acc} z maso $${m}\\ \\mathrm{kg}$ po ${P.on} z vodoravno silo $${F}\\ \\mathrm{N}$. Koeficient trenja je $${tx(P.kt)}$. Kolikšen je pospešek? Zaokroži na dve decimalki.`,
            num(a, "m/s²", 2, [M(F / m, "Pozabil si odšteti silo trenja."), M((F + Ft) / m, "Sila trenja nasprotuje gibanju, zato jo odštej.")]),
            "Izračunaj silo trenja, nato rezultanto sil in iz nje pospešek.",
            [dat("m", m, "kg"), dat("F", F, "N"), `k_{tr} = ${tx(P.kt)}`, K.g],
            ["a"],
            ["F_{tr} = k_{tr}\\, m g", "a = \\dfrac{F - F_{tr}}{m}"],
            [`$F_{tr} = ${tx(P.kt)} \\cdot ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(Ft, 1, "N")}$`, `$F_r = ${F} - ${tx(Ft, 1)}\\ \\mathrm{N} ${res(F - Ft, 1, "N")}$`, `$a = \\dfrac{F_r}{m} ${res(a, 2, "m/s^2")}$`],
          );
        }
        const k = r.pick([0.7, 0.5, 0.3, 0.1]);
        const podl = { 0.7: "suhem asfaltu", 0.5: "mokrem asfaltu", 0.3: "snegu", 0.1: "poledeneli cesti" }[k];
        const vk = r.int(30, 110);
        const v = vk / 3.6;
        const s = (v * v) / (2 * k * GZ);
        return T(
          `Avto vozi po ${podl} s hitrostjo $${vk}\\ \\mathrm{km/h}$ in zavira z blokiranimi kolesi. Koeficient trenja med gumami in podlago je $${tx(k)}$. Kolikšna je zavorna pot? Zaokroži na eno decimalko.`,
          num(s, "m", 1, [M((vk * vk) / (2 * k * GZ), "Si hitrost pretvoril v m/s?"), M((v * v) / (k * GZ), "Si pozabil deliti z 2?")]),
          "Pojemek pri zaviranju povzroča sila trenja: $a = k g$. Nato uporabi zvezo med hitrostjo in potjo.",
          [dat("v", vk, "km/h"), `k_{tr} = ${tx(k)}`, K.g],
          ["s"],
          ["a = k_{tr}\\, g", "s = \\dfrac{v^2}{2a}"],
          [`$v = ${vk}\\ \\mathrm{km/h} ${eq(v, 2)} ${qty(tx(v, 2), "m/s")}$`, `$a = ${tx(k)} \\cdot ${G_TEX}\\ \\mathrm{m/s^2} ${res(k * GZ, 3, "m/s^2")}$`, `$s = \\dfrac{v^2}{2a} ${res(s, 1, "m")}$`],
        );
      }
      const kind = r.pick(["dol", "gor", "kot"]);
      const k = r.dec(0.1, 0.4, 2);
      if (kind === "kot") {
        const a = r.int(12, 38);
        const kl = Math.tan(rad(a));
        const what = r.pick(["Kovanec na knjigi", "Radirka na ravnilu", "Lesena kocka na deski", "Telefon na nagnjeni mizi"]);
        return T(
          `${what}: ${n} počasi povečuje naklon podlage. Pri naklonu $${a}^\\circ$ predmet ravno začne drseti. Kolikšen je koeficient lepenja? Zaokroži na dve decimalki.`,
          num(kl, "", 2, [M(Math.sin(rad(a)), "Koeficient je razmerje dinamične in statične komponente teže: $\\tan\\alpha$, ne $\\sin\\alpha$."), M(Math.cos(rad(a)), "Koeficient je $\\tan\\alpha$, ne $\\cos\\alpha$."), M(1 / Math.tan(rad(a)), "Si obrnil razmerje komponent?")]),
          "Tik preden zdrsne, je komponenta teže vzdolž podlage enaka največji sili lepenja.",
          [`\\alpha = ${a}^\\circ`],
          ["k_l"],
          ["mg\\sin\\alpha = k_l\\, mg\\cos\\alpha", "k_l = \\tan\\alpha"],
          [`$mg\\sin\\alpha = k_l\\, mg\\cos\\alpha \\Rightarrow k_l = \\tan\\alpha$`, `$k_l = \\tan ${a}^\\circ ${eq(kl, 2)} ${tx(kl, 2)}$`],
        );
      }
      const a = r.int(Math.ceil(todeg(Math.atan(k)) + 5), 40);
      const s = Math.sin(rad(a));
      const c = Math.cos(rad(a));
      if (kind === "dol") {
        const acc = GZ * (s - k * c);
        const ctx = r.pick([`Sani drsijo po bregu z naklonom $${a}^\\circ$`, `Paket drsi po nagnjeni rampi (naklon $${a}^\\circ$)`, `Smučar se brez odrivanja spušča po strmini z naklonom $${a}^\\circ$`]);
        return T(
          `${ctx}; koeficient trenja je $${tx(k)}$. Kolikšen je pospešek? Zaokroži na dve decimalki.`,
          num(acc, "m/s²", 2, [M(GZ * s, "Pozabil si na trenje."), M(GZ * (s - k), "Sila podlage na klancu je $mg\\cos\\alpha$, ne $mg$."), M(GZ * (s + k * c), "Trenje deluje proti gibanju, torej navzgor po klancu.")]),
          "Teža se razstavi na komponento vzdolž klanca ($mg\\sin\\alpha$) in pravokotno nanj ($mg\\cos\\alpha$). Trenje je sorazmerno pravokotni komponenti.",
          [`\\alpha = ${a}^\\circ`, `k_{tr} = ${tx(k)}`, K.g],
          ["a"],
          ["F_\\parallel = mg\\sin\\alpha,\\ F_N = mg\\cos\\alpha", "a = g(\\sin\\alpha - k_{tr}\\cos\\alpha)"],
          [`$\\sin ${a}^\\circ \\approx ${tx(s, 4)},\\ \\cos ${a}^\\circ \\approx ${tx(c, 4)}$`, `$m a = mg\\sin\\alpha - k_{tr}\\, mg\\cos\\alpha$`, `$a = ${G_TEX} \\cdot (${tx(s, 4)} - ${tx(k)} \\cdot ${tx(c, 4)})\\ \\mathrm{m/s^2} ${res(acc, 2, "m/s^2")}$`],
        );
      }
      const mm = r.int(15, 90);
      const F = mm * GZ * (s + k * c);
      return T(
        `Delavec potiska zaboj z maso $${mm}\\ \\mathrm{kg}$ s stalno hitrostjo navzgor po klancu z naklonom $${a}^\\circ$. Sila je vzporedna s klancem, koeficient trenja je $${tx(k)}$. S kolikšno silo potiska? Zaokroži na celo število.`,
        num(F, "N", 0, [M(mm * GZ * (s - k * c), "Pri gibanju navzgor trenje deluje navzdol po klancu – prišteje se."), M(mm * GZ * s, "Pozabil si na trenje."), M(mm * GZ * (s + k), "Sila podlage na klancu je $mg\\cos\\alpha$.")]),
        "Pri stalni hitrosti je vsota sil nič. Potisna sila mora premagati komponento teže vzdolž klanca in trenje.",
        [dat("m", mm, "kg"), `\\alpha = ${a}^\\circ`, `k_{tr} = ${tx(k)}`, K.g],
        ["F"],
        ["F = mg\\sin\\alpha + k_{tr}\\, mg\\cos\\alpha"],
        [`$mg\\sin\\alpha = ${mm} \\cdot ${G_TEX} \\cdot ${tx(s, 4)}\\ \\mathrm{N} ${res(mm * GZ * s, 1, "N")}$`, `$F_{tr} = ${tx(k)} \\cdot ${mm} \\cdot ${G_TEX} \\cdot ${tx(c, 4)}\\ \\mathrm{N} ${res(mm * GZ * k * c, 1, "N")}$`, `$F = ${tx(mm * GZ * s, 1)} + ${tx(mm * GZ * k * c, 1)}\\ \\mathrm{N} ${res(F, 0, "N")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-gibalna-kolicina",
    topics: ["FIZ-SS-1/gibalna-kolicina"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        if (r.next() < 0.55) {
          const B = r.pick([
            { what: "teniška žogica", m: [0.056, 0.059], v: [20, 50], md: 3 },
            { what: "nogometna žoga", m: [0.41, 0.45], v: [8, 30], md: 2 },
            { what: "kegljaška krogla", m: [5, 7.5], v: [3, 8], md: 1 },
            { what: "tekač", m: [55, 85], v: [4, 9], md: 0 },
            { what: "kolesar s kolesom", m: [70, 100], v: [5, 12], md: 0 },
          ]);
          const m = r.dec(B.m[0], B.m[1], B.md);
          const v = r.dec(B.v[0], B.v[1], 1);
          const G = m * v;
          const d = G < 10 ? 2 : 1;
          return T(
            `${B.what[0].toUpperCase() + B.what.slice(1)} z maso $${qty(tx(m), "kg")}$ se giblje s hitrostjo $${qty(tx(v), "m/s")}$. Kolikšna je gibalna količina? Zaokroži ${dw(d)}.`,
            num(G, "kg m/s", d, [M((m * v * v) / 2, "To je kinetična energija; gibalna količina je $G = m v$."), M(m / v, "Maso in hitrost zmnoži, ne deli.")], { unitAlternatives: ["Ns", "N s"] }),
            "Gibalna količina je zmnožek mase in hitrosti.",
            [dat("m", tx(m), "kg"), dat("v", tx(v), "m/s")],
            ["G"],
            ["G = m v"],
            [`$G = m v = ${qty(tx(m), "kg")} \\cdot ${qty(tx(v), "m/s")}$`, `$G ${res(G, d, "kg\\,m/s")}$`],
          );
        }
        const F = r.int(5, 60) * 10;
        const t = r.dec(0.1, 2, 1);
        return T(
          `${n} je s stalno silo $${F}\\ \\mathrm{N}$ ${g(n, "potiskal", "potiskala")} avto z ugasnjenim motorjem $${tx(t)}\\ \\mathrm{s}$. Kolikšen sunek sile je prejel avto?`,
          num(F * t, "N s", null, [M(F / t, "Sunek sile je zmnožek sile in časa, ne količnik.")], { tolerance: 1e-9, unitAlternatives: ["Ns", "kg m/s", "kgm/s"] }),
          "Sunek sile je zmnožek sile in časa njenega delovanja.",
          [dat("F", F, "N"), dat("\\Delta t", tx(t), "s")],
          ["F \\Delta t"],
          ["\\text{sunek} = F \\Delta t = \\Delta G"],
          [`$F \\Delta t = ${qty(F, "N")} \\cdot ${qty(tx(t), "s")}$`, `$F \\Delta t = ${qty(tx(F * t), "N\\,s")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["odboj", "zaviranje", "brca"]);
        if (kind === "odboj") {
          const [what, m] = r.pick([
            ["Košarkarska žoga", r.dec(0.58, 0.62, 2)],
            ["Teniška žogica", r.dec(0.056, 0.059, 3)],
            ["Gumijasta žoga", r.dec(0.1, 0.3, 2)],
            ["Hokejski plošček", r.dec(0.16, 0.17, 3)],
            ["Odbojkarska žoga", r.dec(0.26, 0.28, 2)],
          ]);
          const v = r.int(5, 25);
          const tms = r.int(5, 40);
          const F = (2 * m * v) / (tms / 1000);
          return T(
            `${what} z maso $${qty(tx(m), "kg")}$ prileti pravokotno na steno s hitrostjo $${v}\\ \\mathrm{m/s}$ in se odbije z enako veliko hitrostjo. Stik traja $${tms}\\ \\mathrm{ms}$. Kolikšna je povprečna sila stene na žogo? Zaokroži na celo število.`,
            num(F, "N", 0, [M((m * v) / (tms / 1000), "Hitrost se obrne, zato je sprememba gibalne količine $2mv$, ne $mv$."), M(0, "Velikost hitrosti je enaka, a smer se obrne – sprememba gibalne količine ni nič.")]),
            "Izrek o gibalni količini: $F \\Delta t = \\Delta G$. Pazi: hitrost spremeni smer.",
            [dat("m", tx(m), "kg"), dat("v", v, "m/s"), dat("\\Delta t", tms, "ms")],
            ["F"],
            ["F \\Delta t = \\Delta G", "\\Delta G = m v - (-m v) = 2 m v"],
            [`$\\Delta G = 2 m v = 2 \\cdot ${tx(m)} \\cdot ${v}\\ \\mathrm{kg\\,m/s} = ${qty(tx(2 * m * v), "kg\\,m/s")}$`, `$\\Delta t = ${tms}\\ \\mathrm{ms} = ${qty(tx(tms / 1000), "s")}$`, `$F = \\dfrac{\\Delta G}{\\Delta t} ${res(F, 0, "N")}$`],
          );
        }
        if (kind === "zaviranje") {
          const m = r.int(8, 20) * 100;
          const vk = r.int(30, 120);
          const t = r.dec(2, 12, 1);
          const F = (m * (vk / 3.6)) / t;
          return T(
            `Avto z maso $${m}\\ \\mathrm{kg}$ vozi s hitrostjo $${vk}\\ \\mathrm{km/h}$ in se v $${tx(t)}\\ \\mathrm{s}$ enakomerno ustavi. Kolikšna je povprečna zavorna sila? Zaokroži na celo število.`,
            num(F, "N", 0, [M((m * vk) / t, "Si hitrost pretvoril v m/s?"), M(m * (vk / 3.6) * t, "Spremembo gibalne količine deli s časom, ne množi.")]),
            "Sprememba gibalne količine je enaka sunku zavorne sile.",
            [dat("m", m, "kg"), dat("v", vk, "km/h"), dat("\\Delta t", tx(t), "s")],
            ["F"],
            ["F \\Delta t = \\Delta G = m v"],
            [`$v = ${vk}\\ \\mathrm{km/h} ${eq(vk / 3.6, 2)} ${qty(tx(vk / 3.6, 2), "m/s")}$`, `$\\Delta G = m v ${res(m * (vk / 3.6), 0, "kg\\,m/s")}$`, `$F = \\dfrac{\\Delta G}{\\Delta t} ${res(F, 0, "N")}$`],
          );
        }
        const m = r.dec(0.41, 0.45, 2);
        const F = r.int(2, 12) * 100;
        const tms = r.int(5, 15);
        const v = (F * tms) / 1000 / m;
        return T(
          `${n} brcne mirujočo nogometno žogo z maso $${qty(tx(m), "kg")}$. Povprečna sila noge je $${F}\\ \\mathrm{N}$, stik traja $${tms}\\ \\mathrm{ms}$. S kolikšno hitrostjo odleti žoga? Zaokroži na eno decimalko.`,
          num(v, "m/s", 1, [M((F * tms) / m, "Si čas pretvoril v sekunde?"), M(F / m, "To je pospešek, ne hitrost; upoštevaj še čas.")]),
          "Sunek sile je enak spremembi gibalne količine žoge, ki je na začetku mirovala.",
          [dat("m", tx(m), "kg"), dat("F", F, "N"), dat("\\Delta t", tms, "ms")],
          ["v"],
          ["F \\Delta t = m v"],
          [`$F \\Delta t = ${F} \\cdot ${tx(tms / 1000)}\\ \\mathrm{N\\,s} = ${qty(tx((F * tms) / 1000), "N\\,s")}$`, `$v = \\dfrac{F \\Delta t}{m} = \\dfrac{${tx((F * tms) / 1000)}}{${tx(m)}}\\ \\mathrm{m/s} ${res(v, 1, "m/s")}$`],
        );
      }
      const kind = r.pick(["neprozni", "energija", "odriv"]);
      if (kind === "odriv") {
        const n2 = r.pick(NAMES.filter((x) => x !== n));
        const m1 = r.int(40, 80);
        const m2 = r.int(40, 80);
        const v1 = r.dec(0.5, 3, 1);
        const v2 = (m1 * v1) / m2;
        const t = r.int(2, 6);
        const d = (v1 + v2) * t;
        return T(
          `${n} ($${m1}\\ \\mathrm{kg}$) in ${n2} ($${m2}\\ \\mathrm{kg}$) mirujeta na drsališču in se odrineta ${g(n, "", "f") && g(n2, "", "f") ? "druga od druge" : "drug od drugega"}. ${n} odpelje s hitrostjo $${tx(v1)}\\ \\mathrm{m/s}$. Kako daleč narazen sta po $${t}\\ \\mathrm{s}$? Trenje zanemari. Zaokroži na eno decimalko.`,
          num(d, "m", 1, [M(v1 * t, "Upoštevati moraš, da se odpelje tudi drugi drsalec."), M(Math.abs(v1 - v2) * t, "Drsalca se gibljeta v nasprotnih smereh, zato se razdalji seštejeta."), M((v1 + (m2 * v1) / m1) * t, "Si zamenjal masi? Težji drsalec ima manjšo hitrost.")]),
          "Skupna gibalna količina je pred odrivom nič, zato imata drsalca po odrivu nasprotno enaki gibalni količini.",
          [dat("m_1", m1, "kg"), dat("m_2", m2, "kg"), dat("v_1", tx(v1), "m/s"), dat("t", t, "s")],
          ["d"],
          ["m_1 v_1 = m_2 v_2", "d = (v_1 + v_2)\\, t"],
          [`$v_2 = \\dfrac{m_1 v_1}{m_2} = \\dfrac{${m1} \\cdot ${tx(v1)}}{${m2}}\\ \\mathrm{m/s} ${res(v2, 3, "m/s")}$`, `$d = (v_1 + v_2)\\, t = (${tx(v1)} + ${tx(v2, 3)}) \\cdot ${t}\\ \\mathrm{m} ${res(d, 1, "m")}$`],
        );
      }
      const V = r.pick([
        { a: "Vagon", b: "mirujoči vagon", m: [10, 30], u: "t", f: 1000 },
        { a: "Avto", b: "mirujoči avto", m: [8, 20], u: "", f: 100 },
        { a: "Krogla", b: "mirujoči lesen klado na ledu", m: [1, 9], u: "g", f: 0.001 },
      ]);
      let m1, m2, mt1, mt2;
      if (V.a === "Krogla") {
        mt1 = r.int(5, 20);
        mt2 = r.dec(0.5, 3, 1);
        m1 = mt1 / 1000;
        m2 = mt2;
      } else {
        mt1 = r.int(V.m[0], V.m[1]);
        mt2 = r.int(V.m[0], V.m[1]);
        m1 = mt1 * V.f;
        m2 = mt2 * V.f;
      }
      const v1 = V.a === "Krogla" ? r.int(200, 500) : r.dec(1, 8, 1);
      const v = (m1 * v1) / (m1 + m2);
      const u1 = V.a === "Krogla" ? "g" : V.a === "Vagon" ? "t" : "kg";
      const s1 = V.a === "Krogla" ? `$${mt1}\\ \\mathrm{g}$` : V.a === "Vagon" ? `$${mt1}\\ \\mathrm{t}$` : `$${m1}\\ \\mathrm{kg}$`;
      const s2 = V.a === "Krogla" ? `$${qty(tx(mt2), "kg")}$` : V.a === "Vagon" ? `$${mt2}\\ \\mathrm{t}$` : `$${m2}\\ \\mathrm{kg}$`;
      const intro = V.a === "Krogla" ? `Krogla z maso ${s1} prileti s hitrostjo $${v1}\\ \\mathrm{m/s}$ v mirujočo leseno klado z maso ${s2} na ledu in v njej obtiči.` : V.a === "Vagon" ? `Vagon z maso ${s1} s hitrostjo $${tx(v1)}\\ \\mathrm{m/s}$ trči v mirujoči vagon z maso ${s2}; vagona se speta.` : `Avto z maso ${s1} s hitrostjo $${tx(v1)}\\ \\mathrm{m/s}$ trči v mirujoči avto z maso ${s2}; avtomobila se zagozdita.`;
      const gi = [dat("m_1", V.a === "Krogla" ? mt1 : V.a === "Vagon" ? mt1 : m1, u1), dat("m_2", V.a === "Krogla" ? tx(mt2) : V.a === "Vagon" ? mt2 : m2, V.a === "Krogla" ? "kg" : u1), dat("v_1", tx(v1), "m/s")];
      const conv = V.a === "Krogla" ? `$m_1 = ${mt1}\\ \\mathrm{g} = ${qty(tx(m1), "kg")}$` : V.a === "Vagon" ? `$m_1 = ${qty(m1, "kg")},\\ m_2 = ${qty(m2, "kg")}$` : "Masi sta že v kilogramih.";
      if (kind === "neprozni") {
        const d = v < 1 ? 3 : 2;
        return T(
          `${intro} S kolikšno hitrostjo se gibljeta skupaj takoj po trku? Zaokroži ${dw(d)}.`,
          num(v, "m/s", d, [M(v1 / 2, "Hitrost se ne razpolovi; upoštevati moraš masi obeh teles."), M((m2 * v1) / (m1 + m2), "Pred trkom ima gibalno količino le prvo telo."), M(Math.sqrt((m1 * v1 * v1) / (m1 + m2)), "Pri neprožnem trku se kinetična energija ne ohrani – uporabi ohranitev gibalne količine.")]),
          "Pri trku se ohrani skupna gibalna količina; po neprožnem trku se telesi gibljeta skupaj.",
          gi,
          ["v"],
          ["m_1 v_1 = (m_1 + m_2)\\, v"],
          [conv, `$G = m_1 v_1 ${res(m1 * v1, 2, "kg\\,m/s")}$`, `$v = \\dfrac{m_1 v_1}{m_1 + m_2} ${res(v, d, "m/s")}$`],
        );
      }
      const W1 = (m1 * v1 * v1) / 2;
      const W2 = ((m1 + m2) * v * v) / 2;
      const dW = W1 - W2;
      return T(
        `${intro} Koliko kinetične energije se pri trku pretvori v druge oblike (notranjo energijo, deformacijo)? Zaokroži na celo število.`,
        num(dW, "J", 0, [M(W2, "To je kinetična energija po trku; vprašanje sprašuje po razliki."), M(W1, "To je začetna kinetična energija; od nje odštej energijo po trku."), M(0, "Pri neprožnem trku se kinetična energija ne ohrani.")]),
        "Najprej z ohranitvijo gibalne količine izračunaj skupno hitrost po trku, nato primerjaj kinetični energiji.",
        gi,
        ["\\Delta W_k"],
        ["m_1 v_1 = (m_1 + m_2)\\, v", "W_k = \\dfrac{m v^2}{2}", "\\Delta W_k = W_{k1} - W_{k2}"],
        [conv, `$v = \\dfrac{m_1 v_1}{m_1 + m_2} ${res(v, 4, "m/s")}$`, `$W_{k1} = \\dfrac{m_1 v_1^2}{2} ${res(W1, 1, "J")},\\quad W_{k2} = \\dfrac{(m_1 + m_2) v^2}{2} ${res(W2, 1, "J")}$`, `$\\Delta W_k = W_{k1} - W_{k2} ${res(dW, 0, "J")}$`],
      );
    },
  },
  // ---------------- 2. letnik ----------------
  {
    id: "dod-fiz-ss-krozenje",
    topics: ["FIZ-SS-2/enakomerno-krozenje"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        if (r.next() < 0.5) {
          const O = r.pick([
            { what: "Sedež na vrtiljaku", r: [3, 8], t: [6, 15], rd: 1 },
            { what: "Kabina panoramskega kolesa", r: [15, 60], t: [300, 900], rd: 0 },
            { what: "Konica minutnega kazalca na stenski uri", r: [0.1, 0.3], t: [3600, 3600], rd: 2 },
            { what: "Ventil na kolesu vrtljive mize", r: [0.2, 0.5], t: [0.4, 2], rd: 2, td: 1 },
          ]);
          const rr = r.dec(O.r[0], O.r[1], O.rd);
          const t0 = O.td ? r.dec(O.t[0], O.t[1], O.td) : r.int(O.t[0], O.t[1]);
          const mm = (2 * Math.PI * rr) / t0 < 0.01; // počasno kroženje: rezultat v mm/s
          const f = mm ? 1000 : 1;
          const un = mm ? "mm/s" : "m/s";
          const v = ((2 * Math.PI * rr) / t0) * f;
          const d = mm ? 2 : v < 1 ? 3 : 2;
          return T(
            `${O.what} kroži po krožnici s polmerom $${qty(tx(rr), "m")}$ in naredi en obhod v $${qty(t0, "s")}$. Kolikšna je obodna hitrost${mm ? " v mm/s" : ""}? Zaokroži ${dw(d)}.`,
            num(v, un, d, [M(v / 2, "Obseg krožnice je $2\\pi r$, ne $\\pi r$."), M((rr / t0) * f, "V enem obhodu telo prepotuje obseg krožnice, ne polmera."), M(((2 * Math.PI * t0) / rr) * f, "Si delil v obratnem vrstnem redu?")]),
            "V enem obhodnem času telo prepotuje obseg krožnice.",
            [dat("r", tx(rr), "m"), dat("t_0", t0, "s")],
            ["v"],
            ["v = \\dfrac{2\\pi r}{t_0}"],
            [`$o = 2\\pi r = 2\\pi \\cdot ${qty(tx(rr), "m")} ${res(2 * Math.PI * rr, 3, "m")}$`, `$v = \\dfrac{o}{t_0}${mm ? ` \\approx ${qty(sci(v / 1000, 3), "m/s")}` : ""} ${res(v, d, un)}$`],
          );
        }
        const v = r.dec(5, 25, 1);
        const rr = r.int(20, 200);
        const a = (v * v) / rr;
        return T(
          `Avto pelje skozi ovinek s polmerom $${rr}\\ \\mathrm{m}$ s stalno hitrostjo $${qty(tx(v), "m/s")}$. Kolikšen je njegov radialni (centripetalni) pospešek? Zaokroži na dve decimalki.`,
          num(a, "m/s²", 2, [M(v / rr, "Hitrost je treba kvadrirati."), M((v * v) / (2 * rr), "Formula nima faktorja ½; to ni kinetična energija.")]),
          "Pri enakomernem kroženju je pospešek usmerjen proti središču in je odvisen od kvadrata hitrosti.",
          [dat("v", tx(v), "m/s"), dat("r", rr, "m")],
          ["a_r"],
          ["a_r = \\dfrac{v^2}{r}"],
          [`$v^2 = (${tx(v)})^2\\ \\mathrm{m^2/s^2} = ${qty(tx(v * v, 2), "m^2/s^2")}$`, `$a_r = \\dfrac{${tx(v * v, 2)}}{${rr}}\\ \\mathrm{m/s^2} ${res(a, 2, "m/s^2")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["obrati", "ovinek", "obhodni"]);
        if (kind === "obrati") {
          const O = r.pick([
            { what: "Boben pralnega stroja", r: [0.22, 0.28], n: [800, 1400] },
            { what: "Kolo avtomobila", r: [0.28, 0.34], n: [300, 900] },
            { what: "Rezilo kotnega brusilnika", r: [0.05, 0.12], n: [6000, 11000] },
            { what: "Krilo ventilatorja", r: [0.15, 0.3], n: [600, 1500] },
          ]);
          const rr = r.dec(O.r[0], O.r[1], 2);
          const nn = r.int(O.n[0] / 50, O.n[1] / 50) * 50;
          const v = (2 * Math.PI * rr * nn) / 60;
          return T(
            `${O.what} ima polmer $${qty(tx(rr), "m")}$ in se zavrti $${nn}$-krat na minuto. Kolikšna je obodna hitrost točke na obodu? Zaokroži na eno decimalko.`,
            num(v, "m/s", 1, [M(2 * Math.PI * rr * nn, "Si frekvenco pretvoril iz obratov na minuto v obrate na sekundo?"), M(Math.PI * rr * (nn / 60), "Obseg je $2\\pi r$."), M(rr * (nn / 60), "Pozabil si na $2\\pi$: v enem obratu točka prepotuje obseg $2\\pi r$.")]),
            "Frekvenco pretvori v $\\mathrm{s^{-1}}$ (deli s 60), nato uporabi $v = 2\\pi r \\nu$.",
            [dat("r", tx(rr), "m"), dat("\\nu", nn, "obr/min")],
            ["v"],
            ["v = 2\\pi r \\nu"],
            [`$\\nu = \\dfrac{${nn}}{60\\ \\mathrm{s}} ${res(nn / 60, 3, "s^{-1}")}$`, `$v = 2\\pi \\cdot ${tx(rr)}\\ \\mathrm{m} \\cdot ${tx(nn / 60, 3)}\\ \\mathrm{s^{-1}} ${res(v, 1, "m/s")}$`],
          );
        }
        if (kind === "ovinek") {
          const vk = r.int(30, 130);
          const rr = r.int(4, 40) * 10;
          const v = vk / 3.6;
          const a = (v * v) / rr;
          const who = r.pick(["Avtobus", "Motorist", "Vlak", "Avto"]);
          return T(
            `${who} pelje skozi ovinek s polmerom $${rr}\\ \\mathrm{m}$ s hitrostjo $${vk}\\ \\mathrm{km/h}$. Kolikšen je radialni pospešek? Zaokroži na dve decimalki.`,
            num(a, "m/s²", 2, [M((vk * vk) / rr, "Si hitrost pretvoril v m/s?"), M(v / rr, "Hitrost je treba kvadrirati.")]),
            "Hitrost najprej pretvori v m/s (deli s 3,6).",
            [dat("v", vk, "km/h"), dat("r", rr, "m")],
            ["a_r"],
            ["a_r = \\dfrac{v^2}{r}"],
            [`$v = ${vk}\\ \\mathrm{km/h} ${eq(v, 3)} ${qty(tx(v, 3), "m/s")}$`, `$a_r = \\dfrac{v^2}{r} = \\dfrac{(${tx(v, 3)})^2}{${rr}}\\ \\mathrm{m/s^2} ${res(a, 2, "m/s^2")}$`],
          );
        }
        const rr = r.dec(0.3, 2, 1);
        const t0 = r.dec(0.4, 3, 1);
        const a = (4 * Math.PI * Math.PI * rr) / (t0 * t0);
        return T(
          `${n} vrti kamen, privezan na vrvico dolžine $${qty(tx(rr), "m")}$, po vodoravni krožnici. En obhod traja $${qty(tx(t0), "s")}$. Kolikšen je radialni pospešek kamna? Zaokroži na eno decimalko.`,
          num(a, "m/s²", 1, [M((2 * Math.PI * rr) / t0, "To je obodna hitrost; pospešek je $v^2/r$."), M((2 * Math.PI * rr) / (t0 * t0), "Najprej izračunaj obodno hitrost, nato jo kvadriraj in deli s polmerom.")]),
          "Najprej izračunaj obodno hitrost iz obhodnega časa, nato radialni pospešek.",
          [dat("r", tx(rr), "m"), dat("t_0", tx(t0), "s")],
          ["a_r"],
          ["v = \\dfrac{2\\pi r}{t_0}", "a_r = \\dfrac{v^2}{r}"],
          [`$v = \\dfrac{2\\pi \\cdot ${tx(rr)}}{${tx(t0)}}\\ \\mathrm{m/s} ${res((2 * Math.PI * rr) / t0, 3, "m/s")}$`, `$a_r = \\dfrac{v^2}{r} ${res(a, 1, "m/s^2")}$`],
        );
      }
      const kind = r.pick(["trenje", "centrifuga", "vrvica"]);
      if (kind === "trenje") {
        const k = r.pick([0.8, 0.7, 0.5, 0.3, 0.15]);
        const rr = r.int(3, 30) * 10;
        const v = Math.sqrt(k * GZ * rr);
        return T(
          `S kolikšno največjo hitrostjo lahko avto pelje skozi vodoraven ovinek s polmerom $${rr}\\ \\mathrm{m}$, da ga ne zanese? Koeficient lepenja med gumami in cesto je $${tx(k)}$. Rezultat zapiši v km/h in zaokroži na celo število.`,
          num(v * 3.6, "km/h", 0, [M(v, "Rezultat moraš pretvoriti v km/h."), M(k * GZ * rr * 3.6, "Pozabil si koreniti."), M(Math.sqrt(GZ * rr) * 3.6, "Upoštevaj koeficient lepenja.")]),
          "Centripetalno silo zagotavlja sila lepenja; največja je $k\\, m g$.",
          [dat("r", rr, "m"), `k_l = ${tx(k)}`, K.g],
          ["v_{max}"],
          ["\\dfrac{m v^2}{r} = k_l\\, m g", "v = \\sqrt{k_l\\, g\\, r}"],
          [`$\\dfrac{m v^2}{r} = k_l m g \\Rightarrow v = \\sqrt{k_l g r}$`, `$v = \\sqrt{${tx(k)} \\cdot ${G_TEX} \\cdot ${rr}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`, `$v = ${tx(v, 2)} \\cdot 3{,}6\\ \\mathrm{km/h} ${res(v * 3.6, 0, "km/h")}$`],
        );
      }
      if (kind === "centrifuga") {
        const rr = r.dec(0.05, 0.25, 2);
        const N = r.pick([100, 200, 500, 1000, 2000, 3000]);
        const a = N * GZ;
        const nu = Math.sqrt(a / rr) / (2 * Math.PI);
        const what = r.pick(["Laboratorijska centrifuga", "Centrifuga za ločevanje krvi", "Centrifuga za sok"]);
        return T(
          `${what} ima epruvete na razdalji $${qty(tx(rr), "m")}$ od osi. Koliko obratov na minuto mora narediti, da je radialni pospešek ${N}-krat večji od $g$? Zaokroži na celo število.`,
          num(nu * 60, "min⁻¹", 0, [M(nu, "To je frekvenca v obratih na sekundo; pretvori v obrate na minuto."), M(Math.sqrt(a / rr) * 60, "Kotna hitrost $\\omega$ ni frekvenca – deli še z $2\\pi$.")], { unitAlternatives: ["/min", "obr/min", "obratov na minuto", "1/min", "min-1", "min^-1"] }),
          "Iz pospeška izrazi kotno hitrost ($a_r = \\omega^2 r$), nato frekvenco $\\nu = \\omega / 2\\pi$ in jo pretvori v obrate na minuto.",
          [dat("r", tx(rr), "m"), `a_r = ${N}\\, g`, K.g],
          ["\\nu"],
          ["a_r = \\omega^2 r", "\\omega = 2\\pi\\nu"],
          [`$a_r = ${N} \\cdot ${G_TEX}\\ \\mathrm{m/s^2} ${res(a, 0, "m/s^2")}$`, `$\\omega = \\sqrt{\\dfrac{a_r}{r}} ${res(Math.sqrt(a / rr), 1, "s^{-1}")}$`, `$\\nu = \\dfrac{\\omega}{2\\pi} ${res(nu, 2, "s^{-1}")}$`, `$\\nu = ${tx(nu, 2)} \\cdot 60\\ \\mathrm{min^{-1}} ${res(nu * 60, 0, "min^{-1}")}$`],
        );
      }
      const m = r.dec(0.1, 1.5, 1);
      const rr = r.dec(0.4, 1.5, 1);
      const nn = r.int(40, 180);
      const F = m * 4 * Math.PI * Math.PI * rr * (nn / 60) ** 2;
      return T(
        `Kroglo z maso $${qty(tx(m), "kg")}$ vrtimo na vrvici dolžine $${qty(tx(rr), "m")}$ po vodoravni krožnici na gladki mizi; naredi $${nn}$ obratov na minuto. S kolikšno silo je napeta vrvica? Zaokroži na eno decimalko.`,
        num(F, "N", 1, [M(m * 4 * Math.PI * Math.PI * rr * nn * nn, "Si frekvenco pretvoril v obrate na sekundo?"), M(m * 2 * Math.PI * rr * (nn / 60), "To je gibalna količina, ne sila; uporabi $F = m v^2 / r$.")]),
        "Sila vrvice je centripetalna sila. Najprej izračunaj obodno hitrost.",
        [dat("m", tx(m), "kg"), dat("r", tx(rr), "m"), dat("\\nu", nn, "obr/min")],
        ["F"],
        ["v = 2\\pi r \\nu", "F = \\dfrac{m v^2}{r}"],
        [`$\\nu = \\dfrac{${nn}}{60\\ \\mathrm{s}} ${res(nn / 60, 3, "s^{-1}")}$`, `$v = 2\\pi r\\nu ${res(2 * Math.PI * rr * (nn / 60), 3, "m/s")}$`, `$F = \\dfrac{m v^2}{r} ${res(F, 1, "N")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-gravitacija",
    topics: ["FIZ-SS-2/gravitacijski-zakon", "FIZ-SS-4/mesane-maturitetne-naloge"],
    gen(level, r) {
      const n = ime(r);
      const BOD = [
        { name: "Luna", gen: "Lune", M: 7.35e22, R: 1740 },
        { name: "Mars", gen: "Marsa", M: 6.42e23, R: 3390 },
        { name: "Merkur", gen: "Merkurja", M: 3.3e23, R: 2440 },
        { name: "Venera", gen: "Venere", M: 4.87e24, R: 6050 },
        { name: "Titan", gen: "Titana (Saturnove lune)", M: 1.35e23, R: 2575 },
      ];
      if (level === 1) {
        const B = r.pick(BOD);
        const gg = (GRAV * B.M) / (B.R * 1e3) ** 2;
        const Mt = sci(B.M);
        if (r.next() < 0.55) {
          return T(
            `Kolikšen je težni pospešek na površju ${B.gen}? Masa je $${Mt}\\ \\mathrm{kg}$, polmer $${B.R}\\ \\mathrm{km}$, $G = 6{,}67 \\cdot 10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$. Zaokroži na dve decimalki.`,
            num(gg, "m/s²", 2, [M((GRAV * B.M) / (B.R * 1e3) / 1e6, "Polmer je treba kvadrirati."), M((GRAV * B.M) / (B.R * 1e3), "Polmer je treba kvadrirati.")]),
            "Teža telesa je gravitacijska sila planeta: $mg = G\\dfrac{mM}{R^2}$. Polmer pretvori v metre.",
            [dat("M", Mt, "kg"), dat("R", B.R, "km"), K.G],
            ["g"],
            ["g = \\dfrac{G M}{R^2}"],
            [`$R = ${B.R}\\ \\mathrm{km} = ${qty(sci(B.R * 1e3), "m")}$`, `$g = \\dfrac{6{,}67 \\cdot 10^{-11} \\cdot ${Mt}}{(${sci(B.R * 1e3)})^2}\\ \\mathrm{m/s^2} ${res(gg, 2, "m/s^2")}$`],
          );
        }
        const m = r.int(55, 140);
        const F = m * gg;
        return T(
          `Astronavt z opremo ima maso $${m}\\ \\mathrm{kg}$. S kolikšno silo ga privlači ${B.name} (masa $${Mt}\\ \\mathrm{kg}$, polmer $${B.R}\\ \\mathrm{km}$), ko stoji na površju? $G = 6{,}67 \\cdot 10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$. Zaokroži na celo število.`,
          num(F, "N", 0, [M(m * GZ, "To je teža na Zemlji; uporabi maso in polmer drugega nebesnega telesa."), M((GRAV * B.M * m) / (B.R * 1e3), "Razdaljo je treba kvadrirati.")]),
          "Uporabi gravitacijski zakon; razdalja med središčema je polmer telesa (v metrih).",
          [dat("m", m, "kg"), dat("M", Mt, "kg"), dat("R", B.R, "km"), K.G],
          ["F_g"],
          ["F_g = G\\dfrac{m M}{R^2}"],
          [`$R = ${qty(sci(B.R * 1e3), "m")}$`, `$F_g = 6{,}67 \\cdot 10^{-11} \\cdot \\dfrac{${m} \\cdot ${Mt}}{(${sci(B.R * 1e3)})^2}\\ \\mathrm{N} ${res(F, 0, "N")}$`],
        );
      }
      const consts = `($G = 6{,}67 \\cdot 10^{-11}\\ \\mathrm{N\\,m^2/kg^2}$, $M_Z = 5{,}97 \\cdot 10^{24}\\ \\mathrm{kg}$, $R_Z = 6370\\ \\mathrm{km}$)`;
      const gi = (h) => [dat("h", h, "km"), K.G, K.MZ, K.RZ];
      if (level === 2) {
        const h = r.int(2, 40) * 50;
        const rr = (RZ + h) * 1e3;
        if (r.next() < 0.5) {
          const gh = (GRAV * MZ) / (rr * rr);
          const sat = r.pick(["Vesoljska postaja kroži", "Vremenski satelit kroži", "Teleskop kroži", "Satelit za opazovanje Zemlje kroži"]);
          return T(
            `${sat} na višini $${h}\\ \\mathrm{km}$ nad površjem Zemlje. Kolikšen je težni pospešek na tej višini? ${consts} Zaokroži na dve decimalki.`,
            num(gh, "m/s²", 2, [M((GRAV * MZ) / (h * 1e3) ** 2, "Razdalja se meri od središča Zemlje: $r = R_Z + h$."), M((GRAV * MZ) / (RZ * 1e3) ** 2, "To je pospešek na površju; upoštevaj še višino.")]),
            "Razdalja do središča Zemlje je vsota polmera Zemlje in višine.",
            gi(h),
            ["g(h)"],
            ["g(h) = \\dfrac{G M_Z}{(R_Z + h)^2}"],
            [`$r = R_Z + h = ${RZ + h}\\ \\mathrm{km} = ${qty(sci(rr, 3), "m")}$`, `$g = \\dfrac{G M_Z}{r^2} ${res(gh, 2, "m/s^2")}$`],
          );
        }
        const v = Math.sqrt((GRAV * MZ) / rr) / 1000;
        return T(
          `S kolikšno hitrostjo kroži satelit po krožnici na višini $${h}\\ \\mathrm{km}$ nad površjem Zemlje? ${consts} Rezultat zapiši v km/s in zaokroži na dve decimalki.`,
          num(v, "km/s", 2, [M(Math.sqrt((GRAV * MZ) / (h * 1e3)) / 1000, "Polmer tira je $R_Z + h$, ne le $h$."), M(Math.sqrt((GRAV * MZ) / (RZ * 1e3)) / 1000, "Upoštevaj višino satelita nad površjem."), M((GRAV * MZ) / rr / 1e6, "Pozabil si koreniti.")]),
          "Gravitacijska sila je centripetalna sila: $G\\dfrac{mM}{r^2} = \\dfrac{m v^2}{r}$.",
          gi(h),
          ["v"],
          ["v = \\sqrt{\\dfrac{G M_Z}{R_Z + h}}"],
          [`$r = R_Z + h = ${RZ + h}\\ \\mathrm{km} = ${qty(sci(rr, 3), "m")}$`, `$v = \\sqrt{\\dfrac{G M_Z}{r}} ${res(v * 1000, 0, "m/s")}$`, `$v ${res(v, 2, "km/s")}$`],
        );
      }
      const kind = r.pick(["visina", "perioda", "kepler"]);
      if (kind === "visina") {
        const Th = r.pick([24, 12, 8, 6, 4, 3]);
        const Ts = Th * 3600;
        const rr = Math.cbrt((GRAV * MZ * Ts * Ts) / (4 * Math.PI * Math.PI));
        const h = rr / 1000 - RZ;
        return T(
          `Na kolikšni višini nad površjem Zemlje mora krožiti satelit, da je njegov obhodni čas $${Th}\\ \\mathrm{h}$? ${consts} Rezultat zapiši v km in zaokroži na celo število.`,
          num(h, "km", 0, [M(rr / 1000, "To je polmer tira (razdalja od središča Zemlje); odštej še polmer Zemlje."), M(Math.cbrt((GRAV * MZ * Th * Th) / (4 * Math.PI * Math.PI)) / 1000 - RZ, "Si čas pretvoril v sekunde?")]),
          "Gravitacijska sila je centripetalna sila; zapiši $v = 2\\pi r / t_0$ in izrazi $r$. Na koncu odštej polmer Zemlje.",
          [dat("t_0", Th, "h"), K.G, K.MZ, K.RZ],
          ["h"],
          ["G\\dfrac{M_Z}{r^2} = \\dfrac{4\\pi^2 r}{t_0^2}", "r = \\sqrt[3]{\\dfrac{G M_Z t_0^2}{4\\pi^2}}", "h = r - R_Z"],
          [`$t_0 = ${Th}\\ \\mathrm{h} = ${Ts}\\ \\mathrm{s}$`, `$r = \\sqrt[3]{\\dfrac{G M_Z t_0^2}{4\\pi^2}} \\approx ${qty(tx(rr / 1000, 0), "km")}$`, `$h = r - R_Z ${res(h, 0, "km")}$`],
        );
      }
      if (kind === "perioda") {
        const h = r.int(3, 40) * 50;
        const rr = (RZ + h) * 1e3;
        const v = Math.sqrt((GRAV * MZ) / rr);
        const t0 = (2 * Math.PI * rr) / v / 60;
        return T(
          `Koliko minut traja en obhod satelita, ki kroži na višini $${h}\\ \\mathrm{km}$ nad površjem Zemlje? ${consts} Zaokroži na eno decimalko.`,
          num(t0, "min", 1, [M(t0 * 60, "Rezultat pretvori iz sekund v minute."), M((2 * Math.PI * h * 1e3) / Math.sqrt((GRAV * MZ) / (h * 1e3)) / 60, "Polmer tira je $R_Z + h$.")]),
          "Najprej izračunaj hitrost kroženja (gravitacijska sila je centripetalna), nato čas za en obseg tira.",
          [dat("h", h, "km"), K.G, K.MZ, K.RZ],
          ["t_0"],
          ["v = \\sqrt{\\dfrac{G M_Z}{r}}", "t_0 = \\dfrac{2\\pi r}{v}"],
          [`$r = ${RZ + h}\\ \\mathrm{km}$`, `$v = \\sqrt{\\dfrac{G M_Z}{r}} ${res(v, 0, "m/s")}$`, `$t_0 = \\dfrac{2\\pi r}{v} ${res(t0 * 60, 0, "s")} ${res(t0, 1, "min")}$`],
        );
      }
      const P = r.pick([
        { name: "Mars", a: 1.52 },
        { name: "Jupiter", a: 5.2 },
        { name: "Saturn", a: 9.58 },
        { name: "Venera", a: 0.723 },
        { name: "asteroid Ceres", a: 2.77 },
        { name: "Merkur", a: 0.387 },
      ]);
      if (r.next() < 0.5) {
        const T2 = P.a ** 1.5;
        return T(
          `${P.name[0].toUpperCase() + P.name.slice(1)} kroži okoli Sonca na povprečni razdalji $${tx(P.a)}$ astronomske enote (Zemlja: $1\\ \\mathrm{a.\\,e.}$, $1\\ \\text{leto}$). Kolikšen je njegov obhodni čas v letih? Zaokroži na dve decimalki.`,
          num(T2, "let", 2, [M(P.a, "Obhodni čas ni sorazmeren z razdaljo; velja $t_0^2 \\propto r^3$."), M(P.a ** 2, "Velja $t_0^2 \\propto r^3$, zato $t_0 \\propto r^{3/2}$."), M(P.a ** (2 / 3), "Si obrnil eksponent? $t_0 \\propto r^{3/2}$.")], { unitAlternatives: ["leta", "leti", "leto", "l"] }),
          "Uporabi 3. Keplerjev zakon in primerjaj z Zemljo: $\\dfrac{t_1^2}{r_1^3} = \\dfrac{t_2^2}{r_2^3}$.",
          [`r = ${tx(P.a)}\\ \\mathrm{a.\\,e.}`, "r_Z = 1\\ \\mathrm{a.\\,e.},\\ t_Z = 1\\ \\text{leto}"],
          ["t_0"],
          ["\\dfrac{t_0^2}{r^3} = \\dfrac{t_Z^2}{r_Z^3}", "t_0 = t_Z \\left(\\dfrac{r}{r_Z}\\right)^{3/2}"],
          [`$t_0^2 = ${tx(P.a)}^3\\ \\text{let}^2 \\approx ${tx(P.a ** 3, 3)}\\ \\text{let}^2$`, `$t_0 = \\sqrt{${tx(P.a ** 3, 3)}}\\ \\text{let} ${eq(T2, 2)} ${tx(T2, 2)}\\ \\text{let}$`],
        );
      }
      const Tl = r.dec(1.5, 30, 1);
      const a = Tl ** (2 / 3);
      return T(
        `Komet kroži okoli Sonca z obhodnim časom $${tx(Tl)}$ let (Zemlja: $1\\ \\mathrm{a.\\,e.}$, $1$ leto). Kolikšna je velika polos njegovega tira v astronomskih enotah? Zaokroži na dve decimalki.`,
        num(a, "a. e.", 2, [M(Tl ** 1.5, "Si obrnil eksponent? Iz $t_0^2 \\propto r^3$ sledi $r \\propto t_0^{2/3}$."), M(Math.sqrt(Tl), "Velja $r^3 \\propto t_0^2$, zato koreniš s tretjim korenom.")], { unitAlternatives: ["ae", "a.e.", "AU", "au"] }),
        "Uporabi 3. Keplerjev zakon: razmerje $r^3/t_0^2$ je za vse planete in komete enako kot za Zemljo.",
        [`t_0 = ${tx(Tl)}\\ \\text{let}`, "r_Z = 1\\ \\mathrm{a.\\,e.},\\ t_Z = 1\\ \\text{leto}"],
        ["r"],
        ["\\dfrac{r^3}{t_0^2} = \\dfrac{r_Z^3}{t_Z^2}"],
        [`$r^3 = ${tx(Tl)}^2\\ \\mathrm{(a.\\,e.)^3} ${eq(Tl * Tl, 2)} ${tx(Tl * Tl, 2)}\\ \\mathrm{(a.\\,e.)^3}$`, `$r = \\sqrt[3]{${tx(Tl * Tl, 2)}}\\ \\mathrm{a.\\,e.} ${eq(a, 2)} ${tx(a, 2)}\\ \\mathrm{a.\\,e.}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-raztezanje",
    topics: ["FIZ-SS-2/temperatura-in-raztezanje"],
    gen(level, r) {
      const n = ime(r);
      const SOL = [
        { what: "jeklena tirnica", gen: "jekla", a: 1.2e-5, at: "1{,}2", l: [15, 30] },
        { what: "aluminijasta palica", gen: "aluminija", a: 2.4e-5, at: "2{,}4", l: [1, 5] },
        { what: "bakrena cev", gen: "bakra", a: 1.7e-5, at: "1{,}7", l: [2, 12] },
        { what: "jeklen most", gen: "jekla", a: 1.2e-5, at: "1{,}2", l: [80, 400] },
        { what: "betonska plošča", gen: "betona", a: 1.2e-5, at: "1{,}2", l: [5, 20] },
        { what: "steklena palica", gen: "stekla", a: 0.9e-5, at: "0{,}9", l: [0.5, 2] },
      ];
      const S = r.pick(SOL);
      const at = `\\alpha = ${S.at} \\cdot 10^{-5}\\ \\mathrm{K^{-1}}`;
      if (level === 1) {
        const l = S.l[1] > 50 ? r.int(S.l[0], S.l[1]) : r.dec(S.l[0], S.l[1], 1);
        const dT = r.int(10, 60);
        const dl = S.a * l * dT * 1000;
        const d = dl < 1 ? 3 : dl < 10 ? 2 : 1;
        return T(
          `${S.what[0].toUpperCase() + S.what.slice(1)} je dolga $${qty(tx(l), "m")}$. Za koliko milimetrov se podaljša, če se segreje za $${dT}\\ \\mathrm{K}$? ($${at}$) Zaokroži ${dw(d)}.`,
          num(dl, "mm", d, [M(S.a * l * 1000, "Pomnoži še s spremembo temperature."), M(S.a * dT * 1000, "Raztezek je sorazmeren tudi z dolžino.")]),
          "Raztezek je sorazmeren z začetno dolžino in s spremembo temperature. Rezultat pretvori v milimetre.",
          [dat("l", tx(l), "m"), dat("\\Delta T", dT, "K"), at],
          ["\\Delta l"],
          ["\\Delta l = \\alpha\\, l\\, \\Delta T"],
          [`$\\Delta l = ${S.at} \\cdot 10^{-5}\\ \\mathrm{K^{-1}} \\cdot ${qty(tx(l), "m")} \\cdot ${qty(dT, "K")} ${res(dl / 1000, 6, "m")}$`, `$\\Delta l ${res(dl, d, "mm")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["zima", "tekocina", "prostornina"]);
        if (kind === "zima") {
          const l = S.l[1] > 50 ? r.int(S.l[0], S.l[1]) : r.dec(S.l[0], S.l[1], 1);
          const t1 = -r.int(5, 25);
          const t2 = r.int(20, 45);
          const dT = t2 - t1;
          const dl = S.a * l * dT * 1000;
          const d = dl < 10 ? 2 : 1;
          return T(
            `${S.what[0].toUpperCase() + S.what.slice(1)} ima pri $${t1}\\ ^\\circ\\mathrm{C}$ dolžino $${qty(tx(l), "m")}$. Za koliko milimetrov je daljša poleti pri $${t2}\\ ^\\circ\\mathrm{C}$? ($${at}$) Zaokroži ${dw(d)}.`,
            num(dl, "mm", d, [M(S.a * l * (t2 + t1) * 1000, "Začetna temperatura je negativna: $\\Delta T = t_2 - t_1$."), M(S.a * l * t2 * 1000, "Sprememba temperature je razlika med končno in začetno temperaturo.")]),
            "Najprej določi spremembo temperature (pazi na negativno začetno temperaturo), nato raztezek.",
            [dat("l", tx(l), "m"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`, at],
            ["\\Delta l"],
            ["\\Delta T = t_2 - t_1", "\\Delta l = \\alpha\\, l\\, \\Delta T"],
            [`$\\Delta T = ${t2} - (${t1}) = ${dT}\\ \\mathrm{K}$`, `$\\Delta l = ${S.at} \\cdot 10^{-5} \\cdot ${tx(l)} \\cdot ${dT}\\ \\mathrm{m} ${res(dl / 1000, 6, "m")}$`, `$\\Delta l ${res(dl, d, "mm")}$`],
          );
        }
        if (kind === "tekocina") {
          const L = r.pick([
            { what: "bencina", b: 9.5e-4, bt: "9{,}5 \\cdot 10^{-4}", where: "rezervoar avtomobila" },
            { what: "etanola", b: 1.1e-3, bt: "1{,}1 \\cdot 10^{-3}", where: "sod" },
            { what: "kurilnega olja", b: 9.0e-4, bt: "9{,}0 \\cdot 10^{-4}", where: "cisterno" },
            { what: "vode", b: 2.1e-4, bt: "2{,}1 \\cdot 10^{-4}", where: "bojler" },
          ]);
          const V = r.int(4, 16) * 5;
          const t1 = r.int(5, 15);
          const t2 = r.int(25, 40);
          const dV = L.b * V * (t2 - t1);
          return T(
            `V ${L.where} natočimo $${V}\\ \\mathrm{L}$ ${L.what} s temperaturo $${t1}\\ ^\\circ\\mathrm{C}$. Za koliko litrov se poveča prostornina, ko se segreje na $${t2}\\ ^\\circ\\mathrm{C}$? ($\\beta = ${L.bt}\\ \\mathrm{K^{-1}}$) Zaokroži na dve decimalki.`,
            num(dV, "L", 2, [M(L.b * V * t2, "Sprememba temperature je $t_2 - t_1$."), M(3 * L.b * V * (t2 - t1), "Za tekočino je podan že prostorninski koeficient $\\beta$ – ne množi ga s 3.")]),
            "Prostorninski raztezek je sorazmeren z začetno prostornino in spremembo temperature.",
            [dat("V", V, "L"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`, `\\beta = ${L.bt}\\ \\mathrm{K^{-1}}`],
            ["\\Delta V"],
            ["\\Delta V = \\beta\\, V\\, \\Delta T"],
            [`$\\Delta T = ${t2} - ${t1} = ${t2 - t1}\\ \\mathrm{K}$`, `$\\Delta V = ${L.bt} \\cdot ${V} \\cdot ${t2 - t1}\\ \\mathrm{L} ${res(dV, 2, "L")}$`],
          );
        }
        const a = r.int(5, 20);
        const V = a ** 3;
        const dT = r.int(50, 300);
        const dV = 3 * S.a * V * dT;
        const what = r.pick([`kocka iz ${S.gen} z robom $${a}\\ \\mathrm{cm}$`, `kovinska kocka iz ${S.gen} z robom $${a}\\ \\mathrm{cm}$`]);
        return T(
          `Za koliko kubičnih centimetrov se poveča prostornina, ko se ${what} segreje za $${dT}\\ \\mathrm{K}$? ($${at}$) Zaokroži na dve decimalki.`,
          num(dV, "cm³", 2, [M(S.a * V * dT, "Za prostornino trdnine uporabi $\\beta = 3\\alpha$."), M(3 * S.a * a * dT, "Uporabi prostornino kocke, ne dolžine roba.")]),
          "Prostorninski razteznostni koeficient trdnine je trikrat večji od linearnega.",
          [dat("a", a, "cm"), dat("\\Delta T", dT, "K"), at],
          ["\\Delta V"],
          ["\\beta = 3\\alpha", "\\Delta V = \\beta\\, V\\, \\Delta T"],
          [`$V = a^3 = ${V}\\ \\mathrm{cm^3}$`, `$\\beta = 3\\alpha = ${tx(3 * S.a * 1e5, 1)} \\cdot 10^{-5}\\ \\mathrm{K^{-1}}$`, `$\\Delta V = \\beta V \\Delta T ${res(dV, 2, "cm^3")}$`],
        );
      }
      if (r.next() < 0.5) {
        const L = r.pick([
          { what: "etanolom", b: 1.1e-3, bt: "1{,}1 \\cdot 10^{-3}" },
          { what: "glicerinom", b: 5.0e-4, bt: "5{,}0 \\cdot 10^{-4}" },
          { what: "živim srebrom", b: 1.8e-4, bt: "1{,}8 \\cdot 10^{-4}" },
          { what: "oljčnim oljem", b: 7.0e-4, bt: "7{,}0 \\cdot 10^{-4}" },
        ]);
        const V = r.int(2, 20) * 50;
        const dT = r.int(20, 70);
        const as = 0.9e-5;
        const over = (L.b - 3 * as) * V * dT;
        return T(
          `Steklena posoda je pri sobni temperaturi do roba napolnjena z ${L.what} ($${V}\\ \\mathrm{mL}$). Posodo s tekočino segrejemo za $${dT}\\ \\mathrm{K}$. Koliko mililitrov tekočine izteče? ($\\beta = ${L.bt}\\ \\mathrm{K^{-1}}$, za steklo $\\alpha = 0{,}9 \\cdot 10^{-5}\\ \\mathrm{K^{-1}}$) Zaokroži na dve decimalki.`,
          num(over, "mL", 2, [M(L.b * V * dT, "Razteza se tudi posoda – njena prostornina se poveča za $3\\alpha V \\Delta T$."), M((L.b - as) * V * dT, "Za prostornino posode uporabi $3\\alpha$, ne $\\alpha$.")]),
          "Izteče razlika med povečanjem prostornine tekočine in povečanjem prostornine posode.",
          [dat("V", V, "mL"), dat("\\Delta T", dT, "K"), `\\beta_{tek} = ${L.bt}\\ \\mathrm{K^{-1}}`, "\\alpha_{st} = 0{,}9 \\cdot 10^{-5}\\ \\mathrm{K^{-1}}"],
          ["\\Delta V_{izt}"],
          ["\\Delta V = \\beta\\, V\\, \\Delta T", "\\beta_{st} = 3\\alpha_{st}", "\\Delta V_{izt} = (\\beta_{tek} - 3\\alpha_{st})\\, V\\, \\Delta T"],
          [`$\\Delta V_{tek} = ${L.bt} \\cdot ${V} \\cdot ${dT}\\ \\mathrm{mL} ${res(L.b * V * dT, 3, "mL")}$`, `$\\Delta V_{pos} = 3 \\cdot 0{,}9 \\cdot 10^{-5} \\cdot ${V} \\cdot ${dT}\\ \\mathrm{mL} ${res(3 * as * V * dT, 3, "mL")}$`, `$\\Delta V_{izt} = \\Delta V_{tek} - \\Delta V_{pos} ${res(over, 2, "mL")}$`],
        );
      }
      const M2 = r.pick([
        { gen: "jekla", a: 1.2e-5, at: "1{,}2" },
        { gen: "medenine", a: 1.9e-5, at: "1{,}9" },
        { gen: "aluminija", a: 2.4e-5, at: "2{,}4" },
      ]);
      const d0 = r.int(30, 120);
      const dd = r.int(4, 12) * 0.01;
      const t0 = 20;
      const dT = dd / (M2.a * d0);
      const t = t0 + dT;
      return T(
        `Obroč iz ${M2.gen} ima pri $${t0}\\ ^\\circ\\mathrm{C}$ notranji premer $${d0}\\ \\mathrm{mm}$. Natakniti ga želimo na os s premerom $${qty(tx(d0 + dd, 2), "mm")}$. Na kolikšno temperaturo moramo obroč najmanj segreti? ($\\alpha = ${M2.at} \\cdot 10^{-5}\\ \\mathrm{K^{-1}}$) Zaokroži na celo število.`,
        num(t, "°C", 0, [M(dT, "To je potrebna sprememba temperature; prištej še začetno temperaturo."), M(t0 + (2 * dd) / (M2.a * d0), "Razlika premerov je že celotno povečanje premera – ne uporabljaj polmera.")], { unitAlternatives: ["C", "stopinj"] }),
        "Premer obroča se mora povečati za razliko premerov. Iz $\\Delta d = \\alpha\\, d\\, \\Delta T$ izrazi $\\Delta T$.",
        [dat("d_0", d0, "mm"), dat("d_{os}", tx(d0 + dd, 2), "mm"), `t_0 = ${t0}\\ ^\\circ\\mathrm{C}`, `\\alpha = ${M2.at} \\cdot 10^{-5}\\ \\mathrm{K^{-1}}`],
        ["t"],
        ["\\Delta d = \\alpha\\, d_0\\, \\Delta T", "t = t_0 + \\Delta T"],
        [`$\\Delta d = ${tx(d0 + dd, 2)} - ${d0}\\ \\mathrm{mm} = ${qty(tx(dd, 2), "mm")}$`, `$\\Delta T = \\dfrac{\\Delta d}{\\alpha d_0} = \\dfrac{${tx(dd, 2)}}{${M2.at} \\cdot 10^{-5} \\cdot ${d0}}\\ \\mathrm{K} ${res(dT, 1, "K")}$`, `$t = ${t0}\\ ^\\circ\\mathrm{C} + ${tx(dT, 1)}\\ \\mathrm{K} ${eq(t, 0)} ${tx(t, 0)}\\ ^\\circ\\mathrm{C}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-plinska-enacba",
    topics: ["FIZ-SS-2/plinska-enacba"],
    gen(level, r) {
      const n = ime(r);
      const KT = (t) => t + 273;
      if (level === 1) {
        if (r.next() < 0.55) {
          const p1 = r.int(10, 30) * 10;
          const V1 = r.int(4, 30) * 10;
          const V2 = r.int(2, V1 / 10 - 1) * 10;
          const p2 = (p1 * V1) / V2;
          const ctx = r.pick([`${n} zapre izhod brizgalke, v kateri je $${V1}\\ \\mathrm{cm^3}$ zraka pri tlaku $${p1}\\ \\mathrm{kPa}$, in bat počasi potisne, da se prostornina zmanjša na $${V2}\\ \\mathrm{cm^3}$.`, `V valju tlačilke za kolo je $${V1}\\ \\mathrm{cm^3}$ zraka s tlakom $${p1}\\ \\mathrm{kPa}$. Bat počasi stisne zrak na $${V2}\\ \\mathrm{cm^3}$.`]);
          return T(
            `${ctx} Kolikšen je nov tlak, če se temperatura ne spremeni? Zaokroži na celo število.`,
            num(p2, "kPa", 0, [M((p1 * V2) / V1, "Pri stiskanju se tlak poveča – tlak je obratno sorazmeren s prostornino."), M(p1 + (V1 - V2), "Tlak in prostornina nista povezana z razliko, temveč z zmnožkom $pV = \\text{konst.}$")]),
            "Pri stalni temperaturi je zmnožek tlaka in prostornine stalen (Boylov zakon).",
            [dat("p_1", p1, "kPa"), dat("V_1", V1, "cm^3"), dat("V_2", V2, "cm^3")],
            ["p_2"],
            ["p_1 V_1 = p_2 V_2"],
            [`$p_2 = \\dfrac{p_1 V_1}{V_2} = \\dfrac{${p1} \\cdot ${V1}}{${V2}}\\ \\mathrm{kPa}$`, `$p_2 ${res(p2, 0, "kPa")}$`],
          );
        }
        const T1 = r.int(27, 33) * 10;
        const T2 = r.int(32, 40) * 10;
        const V1 = r.dec(1, 5, 1);
        const V2 = (V1 * T2) / T1;
        return T(
          `Plin v valju s prostim batom (stalen tlak) ima pri temperaturi $${T1}\\ \\mathrm{K}$ prostornino $${qty(tx(V1), "L")}$. Kolikšna je njegova prostornina pri $${T2}\\ \\mathrm{K}$? Zaokroži na dve decimalki.`,
          num(V2, "L", 2, [M((V1 * T1) / T2, "Pri segrevanju se prostornina pri stalnem tlaku poveča: $V \\propto T$."), M(V1 + (T2 - T1) / 100, "Prostornina je sorazmerna s temperaturo, ne raste za razliko.")]),
          "Pri stalnem tlaku je prostornina sorazmerna z absolutno temperaturo.",
          [dat("V_1", tx(V1), "L"), dat("T_1", T1, "K"), dat("T_2", T2, "K")],
          ["V_2"],
          ["\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}"],
          [`$V_2 = V_1 \\cdot \\dfrac{T_2}{T_1} = ${tx(V1)} \\cdot \\dfrac{${T2}}{${T1}}\\ \\mathrm{L}$`, `$V_2 ${res(V2, 2, "L")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const t1 = r.int(-5, 15);
          const t2 = r.int(30, 60);
          const p1 = r.dec(1.8, 3.2, 1);
          const p2 = (p1 * KT(t2)) / KT(t1);
          const ctx = r.pick([`Tlak v pnevmatiki je pri $${t1}\\ ^\\circ\\mathrm{C}$ enak $${qty(tx(p1), "bar")}$. Po vožnji se zrak v njej segreje na $${t2}\\ ^\\circ\\mathrm{C}$.`, `Jeklenka z dušikom ima pri $${t1}\\ ^\\circ\\mathrm{C}$ tlak $${qty(tx(p1), "bar")}$. Na soncu se segreje na $${t2}\\ ^\\circ\\mathrm{C}$.`, `Zaprt kozarec za vlaganje ima pri $${t1}\\ ^\\circ\\mathrm{C}$ v sebi zrak s tlakom $${qty(tx(p1), "bar")}$; segrejemo ga na $${t2}\\ ^\\circ\\mathrm{C}$.`]);
          return T(
            `${ctx} Kolikšen je nov tlak, če se prostornina ne spremeni? Zaokroži na dve decimalki.`,
            num(p2, "bar", 2, [M(t1 !== 0 ? (p1 * t2) / t1 : NaN, "Temperaturo moraš pretvoriti v kelvine."), M((p1 * KT(t1)) / KT(t2), "Pri segrevanju se tlak poveča: $p \\propto T$.")]),
            "Pri stalni prostornini je tlak sorazmeren z absolutno temperaturo. Temperaturi najprej pretvori v kelvine.",
            [dat("p_1", tx(p1), "bar"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`],
            ["p_2"],
            ["\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}", "T = t + 273\\ \\mathrm{K}"],
            [`$T_1 = ${KT(t1)}\\ \\mathrm{K},\\ T_2 = ${KT(t2)}\\ \\mathrm{K}$`, `$p_2 = p_1 \\cdot \\dfrac{T_2}{T_1} = ${tx(p1)} \\cdot \\dfrac{${KT(t2)}}{${KT(t1)}}\\ \\mathrm{bar} ${res(p2, 2, "bar")}$`],
          );
        }
        const p = r.int(10, 200);
        const V = r.int(2, 50);
        const t = r.int(-10, 40);
        const nn = (p * 1e5 * V * 1e-3) / (R_GAS * KT(t));
        const what = r.pick(["jeklenki", "posodi", "balonu za potapljanje", "rezervoarju"]);
        return T(
          `V ${what} s prostornino $${V}\\ \\mathrm{L}$ je plin pri tlaku $${p}\\ \\mathrm{bar}$ in temperaturi $${t}\\ ^\\circ\\mathrm{C}$. Koliko molov plina je v njej? ($R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$, $1\\ \\mathrm{bar} = 10^5\\ \\mathrm{Pa}$) Zaokroži na eno decimalko.`,
          num(nn, "mol", 1, [M(t !== 0 ? (p * 1e5 * V * 1e-3) / (R_GAS * t) : NaN, "Temperaturo pretvori v kelvine."), M((p * V) / (R_GAS * KT(t)), "Tlak pretvori v pascale in prostornino v kubične metre.")]),
          "Uporabi plinsko enačbo; vse količine pretvori v osnovne enote (Pa, m³, K).",
          [dat("V", V, "L"), dat("p", p, "bar"), `t = ${t}\\ ^\\circ\\mathrm{C}`, K.R],
          ["n"],
          ["p V = n R T"],
          [`$p = ${qty(sci(p * 1e5, 1), "Pa")},\\ V = ${qty(sci(V * 1e-3, 1), "m^3")},\\ T = ${KT(t)}\\ \\mathrm{K}$`, `$n = \\dfrac{pV}{RT} = \\dfrac{${sci(p * 1e5, 1)} \\cdot ${sci(V * 1e-3, 1)}}{8{,}31 \\cdot ${KT(t)}}\\ \\mathrm{mol} ${res(nn, 1, "mol")}$`],
        );
      }
      const kind = r.pick(["masa", "mehurcek", "gostota"]);
      if (kind === "masa") {
        const G = r.pick([
          { name: "kisika", f: "O_2", M: 32 },
          { name: "dušika", f: "N_2", M: 28 },
          { name: "helija", f: "He", M: 4 },
          { name: "ogljikovega dioksida", f: "CO_2", M: 44 },
          { name: "argona", f: "Ar", M: 40 },
        ]);
        const p = r.int(20, 200);
        const V = r.int(2, 50);
        const t = r.int(5, 35);
        const m = (p * 1e5 * V * 1e-3 * G.M * 1e-3) / (R_GAS * KT(t));
        return T(
          `Jeklenka s prostornino $${V}\\ \\mathrm{L}$ vsebuje ${G.name} ($\\mathrm{${G.f}}$, $M = ${G.M}\\ \\mathrm{g/mol}$) pri tlaku $${p}\\ \\mathrm{bar}$ in temperaturi $${t}\\ ^\\circ\\mathrm{C}$. Kolikšna je masa plina? ($R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$) Zaokroži na dve decimalki.`,
          num(m, "kg", 2, [M((p * 1e5 * V * 1e-3 * G.M * 1e-3) / (R_GAS * t), "Temperaturo pretvori v kelvine."), M((p * 1e5 * V * 1e-3) / (R_GAS * KT(t)), "To je množina snovi v molih; pomnoži jo še z molsko maso.")]),
          "Iz plinske enačbe izračunaj množino snovi, nato maso. Pazi na enote: Pa, m³, K, kg/mol.",
          [dat("V", V, "L"), dat("p", p, "bar"), `t = ${t}\\ ^\\circ\\mathrm{C}`, dat("M", G.M, "g/mol"), K.R],
          ["m"],
          ["p V = \\dfrac{m}{M} R T", "m = \\dfrac{p V M}{R T}"],
          [`$p = ${qty(sci(p * 1e5, 1), "Pa")},\\ V = ${qty(sci(V * 1e-3, 1), "m^3")},\\ T = ${KT(t)}\\ \\mathrm{K},\\ M = ${qty(tx(G.M / 1000), "kg/mol")}$`, `$n = \\dfrac{pV}{RT} ${res((p * 1e5 * V * 1e-3) / (R_GAS * KT(t)), 1, "mol")}$`, `$m = n M ${res(m, 2, "kg")}$`],
        );
      }
      if (kind === "mehurcek") {
        const h = r.int(5, 40);
        const t1 = r.int(4, 10);
        const t2 = r.int(15, 28);
        const V1 = r.dec(0.5, 4, 1);
        const p0 = 1.0e5;
        const p1 = p0 + 1000 * GZ * h;
        const V2 = (V1 * p1 * KT(t2)) / (p0 * KT(t1));
        return T(
          `Potapljač v jezeru na globini $${h}\\ \\mathrm{m}$ (voda $${t1}\\ ^\\circ\\mathrm{C}$) izpusti mehurček s prostornino $${qty(tx(V1), "cm^3")}$. Kolikšna je prostornina mehurčka tik pod gladino, kjer je voda $${t2}\\ ^\\circ\\mathrm{C}$? Zračni tlak je $${qty("1{,}0 \\cdot 10^5", "Pa")}$. Zaokroži na dve decimalki.`,
          num(V2, "cm³", 2, [M((V1 * p1) / p0, "Upoštevaj tudi spremembo temperature."), M((V1 * (1000 * GZ * h)) / p0 * (KT(t2) / KT(t1)), "Tlak v globini je vsota zračnega in hidrostatičnega tlaka."), M((V1 * KT(t2)) / KT(t1), "Upoštevaj, da je tlak v globini večji od tlaka pri gladini.")]),
          "Tlak na globini je zračni tlak plus hidrostatični tlak. Nato uporabi splošno plinsko enačbo za stalno množino plina.",
          [dat("h", h, "m"), dat("V_1", tx(V1), "cm^3"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`, dat("p_0", "1{,}0 \\cdot 10^5", "Pa"), "\\rho_v = 1000\\ \\mathrm{kg/m^3}", K.g],
          ["V_2"],
          ["p_1 = p_0 + \\rho g h", "\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}"],
          [`$p_1 = 1{,}0 \\cdot 10^5\\ \\mathrm{Pa} + 1000 \\cdot ${G_TEX} \\cdot ${h}\\ \\mathrm{Pa} ${res(p1, 0, "Pa")}$`, `$T_1 = ${KT(t1)}\\ \\mathrm{K},\\ T_2 = ${KT(t2)}\\ \\mathrm{K}$`, `$V_2 = V_1 \\cdot \\dfrac{p_1}{p_0} \\cdot \\dfrac{T_2}{T_1} ${res(V2, 2, "cm^3")}$`],
        );
      }
      const p = r.int(85, 105);
      const t = r.int(-15, 35);
      const rho = (p * 1e3 * 0.029) / (R_GAS * KT(t));
      const where = r.pick(["na vrhu hriba", "ob morju", "v planinski koči", "v mestu"]);
      return T(
        `${where[0].toUpperCase() + where.slice(1)} je zračni tlak $${p}\\ \\mathrm{kPa}$, temperatura pa $${t}\\ ^\\circ\\mathrm{C}$. Kolikšna je gostota zraka ($M = 29\\ \\mathrm{g/mol}$)? ($R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$) Zaokroži na tri decimalke.`,
        num(rho, "kg/m³", 3, [M(t !== 0 ? (p * 1e3 * 0.029) / (R_GAS * t) : NaN, "Temperaturo pretvori v kelvine."), M((p * 1e3 * 29) / (R_GAS * KT(t)), "Molsko maso pretvori v kg/mol.")]),
        "V plinski enačbi zapiši množino kot $m/M$ in deli s prostornino: $\\rho = m/V$.",
        [dat("p", p, "kPa"), `t = ${t}\\ ^\\circ\\mathrm{C}`, dat("M", 29, "g/mol"), K.R],
        ["\\rho"],
        ["pV = \\dfrac{m}{M} RT", "\\rho = \\dfrac{p M}{R T}"],
        [`$p = ${p * 1000}\\ \\mathrm{Pa},\\ T = ${KT(t)}\\ \\mathrm{K},\\ M = 0{,}029\\ \\mathrm{kg/mol}$`, `$\\rho = \\dfrac{p M}{R T} = \\dfrac{${p * 1000} \\cdot 0{,}029}{8{,}31 \\cdot ${KT(t)}}\\ \\mathrm{kg/m^3} ${res(rho, 3, "kg/m^3")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-prvi-zakon",
    topics: ["FIZ-SS-2/termodinamika"],
    gen(level, r) {
      const n = ime(r);
      const law = "\\Delta W_n = Q + A";
      if (level === 1) {
        if (r.next() < 0.5) {
          const Q = r.int(5, 60) * 10;
          const Ap = r.int(1, Q / 10 - 1) * 10;
          const dW = Q - Ap;
          return T(
            `Plin v valju prejme $${Q}\\ \\mathrm{J}$ toplote in pri tem z razpenjanjem opravi $${Ap}\\ \\mathrm{J}$ dela. Za koliko se spremeni njegova notranja energija?`,
            num(dW, "J", null, [M(Q + Ap, "Delo, ki ga plin opravi, mu energijo odvzame: $A = -A'$."), M(-dW, "Plin prejme več toplote, kot odda z delom, zato se notranja energija poveča.")], { tolerance: 1e-9 }),
            "Prvi zakon termodinamike: notranja energija se spremeni za prejeto toploto in delo, ki ga na plin opravi okolica. Ko plin opravi delo, je $A$ negativen.",
            [dat("Q", Q, "J"), dat("A'", Ap, "J")],
            ["\\Delta W_n"],
            [law, "A = -A'"],
            [`Plin opravi delo, zato je delo okolice na plinu $A = -${Ap}\\ \\mathrm{J}$.`, `$\\Delta W_n = Q + A = ${Q}\\ \\mathrm{J} - ${Ap}\\ \\mathrm{J} = ${qty(dW, "J")}$`],
          );
        }
        const A = r.int(5, 50) * 10;
        const Qo = r.int(1, 60) * 10;
        const dW = A - Qo;
        const ctx = r.pick(["Ko stisnemo plin v tlačilki", "Ko bat stisne zrak v valju motorja", "Ko kompresor stisne plin"]);
        return T(
          `${ctx}, opravimo na plinu $${A}\\ \\mathrm{J}$ dela, plin pa odda okolici $${Qo}\\ \\mathrm{J}$ toplote. Za koliko se spremeni notranja energija plina? (Zmanjšanje zapiši z negativnim predznakom.)`,
          num(dW, "J", null, [M(A + Qo, "Oddana toplota zmanjša notranjo energijo: $Q$ je negativen."), M(Qo - A, "Delo, ki ga opravimo na plinu, notranjo energijo poveča.")], { tolerance: 1e-9 }),
          "Delo okolice na plinu je pozitivno, oddana toplota je negativna.",
          [dat("A", A, "J"), dat("Q_{odd}", Qo, "J")],
          ["\\Delta W_n"],
          [law],
          [`$Q = -${Qo}\\ \\mathrm{J}$ (plin toploto odda), $A = +${A}\\ \\mathrm{J}$`, `$\\Delta W_n = Q + A = -${Qo}\\ \\mathrm{J} + ${A}\\ \\mathrm{J} = ${qty(dW, "J")}$`],
        );
      }
      if (level === 2) {
        const p = r.int(10, 40) * 10;
        const V1 = r.dec(1, 5, 1);
        const dV = r.dec(0.5, 4, 1);
        const Ap = p * dV;
        const Q = roundHalfUp(Ap * r.dec(1.6, 3.5, 2), -1);
        const dW = Q - Ap;
        return T(
          `Plin v valju z bremenjenim batom se pri stalnem tlaku $${p}\\ \\mathrm{kPa}$ razširi s $${qty(tx(V1), "L")}$ na $${qty(tx(V1 + dV), "L")}$. Pri tem prejme $${Q}\\ \\mathrm{J}$ toplote. Za koliko se poveča njegova notranja energija?`,
          num(dW, "J", 0, [M(Q + Ap, "Plin pri razpenjanju opravi delo in s tem izgubi energijo – delo odštej."), M(Q - p * (V1 + dV), "Delo pri stalnem tlaku je $p \\Delta V$, kjer je $\\Delta V$ sprememba prostornine.")]),
          "Najprej izračunaj delo plina pri stalnem tlaku: $A' = p\\,\\Delta V$ (tlak v Pa, prostornina v m³).",
          [dat("p", p, "kPa"), dat("V_1", tx(V1), "L"), dat("V_2", tx(V1 + dV), "L"), dat("Q", Q, "J")],
          ["\\Delta W_n"],
          ["A' = p\\,\\Delta V", "\\Delta W_n = Q - A'"],
          [`$\\Delta V = ${qty(tx(dV), "L")} = ${qty(sci(dV * 1e-3, 1), "m^3")}$`, `$A' = p \\Delta V = ${p * 1000}\\ \\mathrm{Pa} \\cdot ${sci(dV * 1e-3, 1)}\\ \\mathrm{m^3} = ${qty(tx(Ap), "J")}$`, `$\\Delta W_n = Q - A' = ${Q} - ${tx(Ap)}\\ \\mathrm{J} ${res(dW, 0, "J")}$`],
        );
      }
      const nn = r.dec(0.2, 3, 1);
      const dT = r.int(10, 80);
      const gas = r.pick(["helij", "argon", "neon"]);
      if (r.next() < 0.6) {
        const Q = 2.5 * nn * R_GAS * dT;
        return T(
          `Koliko toplote moramo dovesti $${tx(nn)}\\ \\mathrm{mol}$ enoatomnega plina (${gas}), da se pri stalnem tlaku segreje za $${dT}\\ \\mathrm{K}$? Notranja energija enoatomnega plina je $W_n = \\tfrac{3}{2} n R T$. ($R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$) Zaokroži na celo število.`,
          num(Q, "J", 0, [M(1.5 * nn * R_GAS * dT, "To je le sprememba notranje energije; plin pri stalnem tlaku opravi še delo $p\\Delta V = nR\\Delta T$."), M(nn * R_GAS * dT, "To je le delo plina; dodaj še spremembo notranje energije.")]),
          "Toplota gre v povečanje notranje energije in v delo, ki ga plin opravi pri razpenjanju ($p\\Delta V = nR\\Delta T$).",
          [dat("n", tx(nn), "mol"), dat("\\Delta T", dT, "K"), K.R],
          ["Q"],
          ["\\Delta W_n = \\tfrac{3}{2} n R \\Delta T", "A' = p\\Delta V = n R \\Delta T", "Q = \\Delta W_n + A'"],
          [`$\\Delta W_n = \\tfrac{3}{2} \\cdot ${tx(nn)} \\cdot 8{,}31 \\cdot ${dT}\\ \\mathrm{J} ${res(1.5 * nn * R_GAS * dT, 1, "J")}$`, `$A' = ${tx(nn)} \\cdot 8{,}31 \\cdot ${dT}\\ \\mathrm{J} ${res(nn * R_GAS * dT, 1, "J")}$`, `$Q = \\Delta W_n + A' ${res(Q, 0, "J")}$`],
        );
      }
      const Q = r.int(20, 200) * 10;
      const dWn = 1.5 * nn * R_GAS * dT;
      if (dWn >= Q) return null;
      const Ap = Q - dWn;
      const pct = (Ap / Q) * 100;
      return T(
        `Vzorec ${gas === "helij" ? "helija" : gas === "argon" ? "argona" : "neona"} z množino $${tx(nn)}\\ \\mathrm{mol}$ prejme $${Q}\\ \\mathrm{J}$ toplote in se pri tem segreje za $${dT}\\ \\mathrm{K}$. Koliko dela opravi plin? Notranja energija enoatomnega plina je $W_n = \\tfrac{3}{2} n R T$, $R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$. Zaokroži na celo število.`,
        num(Ap, "J", 0, [M(dWn, "To je sprememba notranje energije; delo je razlika med toploto in to spremembo."), M(Q + dWn, "Prejeta toplota se razdeli na notranjo energijo in delo – odštej."), M(nn * R_GAS * dT, "Delo $nR\\Delta T$ velja le pri stalnem tlaku; tu uporabi prvi zakon.")]),
        "Izračunaj spremembo notranje energije, nato iz prvega zakona še delo, ki ga opravi plin.",
        [dat("n", tx(nn), "mol"), dat("Q", Q, "J"), dat("\\Delta T", dT, "K"), K.R],
        ["A'"],
        ["\\Delta W_n = \\tfrac{3}{2} n R \\Delta T", "Q = \\Delta W_n + A'"],
        [`$\\Delta W_n = \\tfrac{3}{2} \\cdot ${tx(nn)} \\cdot 8{,}31 \\cdot ${dT}\\ \\mathrm{J} ${res(dWn, 1, "J")}$`, `$A' = Q - \\Delta W_n = ${Q} - ${tx(dWn, 1)}\\ \\mathrm{J} ${res(Ap, 0, "J")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-toplotni-stroji",
    topics: ["FIZ-SS-2/termodinamika"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const S = r.pick(["Bencinski motor", "Parni stroj", "Dizelski motor", "Stirlingov motor", "Turbina v termoelektrarni"]);
        if (r.next() < 0.6) {
          const Q1 = r.int(10, 90) * 100;
          const A = r.int(Math.ceil(Q1 * 0.12 / 10), Math.floor(Q1 * 0.45 / 10)) * 10;
          const eta = (A / Q1) * 100;
          return T(
            `${S} v enem ciklu prejme $${Q1}\\ \\mathrm{J}$ toplote in opravi $${A}\\ \\mathrm{J}$ dela. Kolikšen je izkoristek v odstotkih? Zaokroži na eno decimalko.`,
            num(eta, "%", 1, [M((Q1 / A) * 100, "Izkoristek je delo, deljeno s prejeto toploto – ne obratno."), M(((Q1 - A) / Q1) * 100, "To je delež oddane toplote; izkoristek je delež toplote, ki se pretvori v delo.")]),
            "Izkoristek pove, kolikšen del prejete toplote stroj pretvori v delo.",
            [dat("Q_1", Q1, "J"), dat("A", A, "J")],
            ["\\eta"],
            ["\\eta = \\dfrac{A}{Q_1}"],
            [`$\\eta = \\dfrac{${A}}{${Q1}} ${eq(A / Q1, 4)} ${tx(A / Q1, 4)}$`, `$\\eta ${res(eta, 1, "\\%")}$`],
          );
        }
        const Q1 = r.int(5, 60) * 100;
        const eta = r.int(15, 45);
        const A = (Q1 * eta) / 100;
        return T(
          `${S} ima izkoristek $${eta}\\ \\%$. Koliko dela opravi, ko prejme $${Q1}\\ \\mathrm{kJ}$ toplote?`,
          num(A, "kJ", null, [M(Q1 * eta, "Odstotke pretvori v decimalno število."), M(Q1 - A, "To je toplota, ki jo stroj odda; delo je $\\eta Q_1$.")], { tolerance: 1e-9 }),
          "Delo je izkoristek, pomnožen s prejeto toploto.",
          [dat("\\eta", eta, "\\%"), dat("Q_1", Q1, "kJ")],
          ["A"],
          ["A = \\eta\\, Q_1"],
          [`$\\eta = ${eta}\\ \\% = ${tx(eta / 100)}$`, `$A = ${tx(eta / 100)} \\cdot ${qty(Q1, "kJ")} = ${qty(tx(A), "kJ")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const Q1 = r.int(20, 90) * 100;
          const Q2 = r.int(Math.ceil(Q1 * 0.55 / 100), Math.floor(Q1 * 0.85 / 100)) * 100;
          const eta = ((Q1 - Q2) / Q1) * 100;
          return T(
            `Toplotni stroj v vsakem ciklu prejme $${Q1}\\ \\mathrm{J}$ toplote iz toplega rezervoarja in odda $${Q2}\\ \\mathrm{J}$ toplote hladnemu rezervoarju. Kolikšen je izkoristek v odstotkih? Zaokroži na eno decimalko.`,
            num(eta, "%", 1, [M((Q2 / Q1) * 100, "To je delež oddane toplote; delo je razlika $Q_1 - Q_2$."), M(((Q1 - Q2) / Q2) * 100, "Delo deli s prejeto toploto $Q_1$, ne z oddano.")]),
            "Delo stroja je razlika med prejeto in oddano toploto.",
            [dat("Q_1", Q1, "J"), dat("Q_2", Q2, "J")],
            ["\\eta"],
            ["A = Q_1 - Q_2", "\\eta = \\dfrac{A}{Q_1}"],
            [`$A = ${Q1} - ${Q2}\\ \\mathrm{J} = ${Q1 - Q2}\\ \\mathrm{J}$`, `$\\eta = \\dfrac{${Q1 - Q2}}{${Q1}} \\cdot 100\\ \\% ${res(eta, 1, "\\%")}$`],
          );
        }
        const t1 = r.int(15, 60) * 10;
        const t2 = r.int(1, 8) * 5;
        const eta = (1 - (t2 + 273) / (t1 + 273)) * 100;
        const S = r.pick(["Parna turbina", "Plinska turbina", "Toplotni stroj", "Motor"]);
        return T(
          `${S} deluje med toplim rezervoarjem s temperaturo $${t1}\\ ^\\circ\\mathrm{C}$ in hladnim s temperaturo $${t2}\\ ^\\circ\\mathrm{C}$. Kolikšen je največji mogoči (Carnotov) izkoristek? Zaokroži na eno decimalko.`,
          num(eta, "%", 1, [M((1 - t2 / t1) * 100, "Temperaturi pretvori v kelvine."), M(((t2 + 273) / (t1 + 273)) * 100, "Izkoristek je $1 - T_2/T_1$.")]),
          "Največji izkoristek je odvisen le od absolutnih temperatur obeh rezervoarjev.",
          [`t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`],
          ["\\eta_C"],
          ["\\eta_C = 1 - \\dfrac{T_2}{T_1}"],
          [`$T_1 = ${t1 + 273}\\ \\mathrm{K},\\ T_2 = ${t2 + 273}\\ \\mathrm{K}$`, `$\\eta_C = 1 - \\dfrac{${t2 + 273}}{${t1 + 273}} \\approx ${tx(eta / 100, 4)}$`, `$\\eta_C ${res(eta, 1, "\\%")}$`],
        );
      }
      if (r.next() < 0.5) {
        const P = r.int(2, 12) * 50;
        const eta = r.int(30, 42);
        const F = r.pick([
          { name: "premoga", q: 29 },
          { name: "lignita", q: 11 },
          { name: "zemeljskega plina", q: 50 },
          { name: "kurilnega olja", q: 42 },
        ]);
        const Q1 = (P * 1e6 * 3600) / (eta / 100);
        const m = Q1 / (F.q * 1e6) / 1000;
        return T(
          `Termoelektrarna z električno močjo $${P}\\ \\mathrm{MW}$ ima izkoristek $${eta}\\ \\%$. Koliko ton ${F.name} (kurilna vrednost $${F.q}\\ \\mathrm{MJ/kg}$) porabi v $1\\ \\mathrm{h}$? Zaokroži na eno decimalko.`,
          num(m, "t", 1, [M((P * 1e6 * 3600) / (F.q * 1e6) / 1000, "Upoštevaj izkoristek: elektrarna mora prejeti več toplote, kot odda električne energije."), M((P * 1e6 * 3600 * (eta / 100)) / (F.q * 1e6) / 1000, "Električno energijo deli z izkoristkom, ne množi.")]),
          "Najprej izračunaj električno energijo v eni uri, nato potrebno toploto ($Q_1 = A/\\eta$) in maso goriva.",
          [dat("P", P, "MW"), dat("\\eta", eta, "\\%"), dat("t", 1, "h"), dat("q", F.q, "MJ/kg")],
          ["m"],
          ["A = P t", "Q_1 = \\dfrac{A}{\\eta}", "m = \\dfrac{Q_1}{q}"],
          [`$A = P t = ${P} \\cdot 10^6\\ \\mathrm{W} \\cdot 3600\\ \\mathrm{s} = ${qty(sci(P * 1e6 * 3600, 2), "J")}$`, `$Q_1 = \\dfrac{A}{\\eta} \\approx ${qty(sci(Q1, 3), "J")}$`, `$m = \\dfrac{Q_1}{q} ${res(m * 1000, 0, "kg")} ${res(m, 1, "t")}$`],
        );
      }
      const t2 = r.int(1, 6) * 5;
      const eta = r.int(30, 65);
      const T1 = (t2 + 273) / (1 - eta / 100);
      return T(
        `Hladni rezervoar toplotnega stroja ima temperaturo $${t2}\\ ^\\circ\\mathrm{C}$. Najmanj kolikšna mora biti temperatura toplega rezervoarja, da bi bil Carnotov izkoristek $${eta}\\ \\%$? Rezultat zapiši v $^\\circ\\mathrm{C}$ in zaokroži na celo število.`,
        num(T1 - 273, "°C", 0, [M(T1, "To je temperatura v kelvinih; pretvori jo v stopinje Celzija."), M(t2 / (1 - eta / 100), "Računaj z absolutnimi temperaturami (v kelvinih)."), M((t2 + 273) * (1 + eta / 100) - 273, "Iz $\\eta = 1 - T_2/T_1$ izrazi $T_1 = T_2/(1-\\eta)$.")], { unitAlternatives: ["C", "stopinj"] }),
        "Iz $\\eta = 1 - \\dfrac{T_2}{T_1}$ izrazi $T_1$. Ne pozabi pretvoriti v kelvine in nazaj.",
        [`t_2 = ${t2}\\ ^\\circ\\mathrm{C}`, dat("\\eta_C", eta, "\\%")],
        ["t_1"],
        ["\\eta_C = 1 - \\dfrac{T_2}{T_1}", "T_1 = \\dfrac{T_2}{1 - \\eta_C}"],
        [`$T_2 = ${t2 + 273}\\ \\mathrm{K}$`, `$T_1 = \\dfrac{${t2 + 273}}{1 - ${tx(eta / 100)}}\\ \\mathrm{K} ${res(T1, 1, "K")}$`, `$t_1 = T_1 - 273 ${eq(T1 - 273, 0)} ${tx(T1 - 273, 0)}\\ ^\\circ\\mathrm{C}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-coulomb",
    topics: ["FIZ-SS-2/elektricni-naboj-in-coulombov-zakon"],
    gen(level, r) {
      const n = ime(r);
      const k = 1 / (4 * Math.PI * EPS0);
      const cst = "($\\varepsilon_0 = 8{,}85 \\cdot 10^{-12}\\ \\mathrm{As/Vm}$)";
      const coul = "F = \\dfrac{e_1 e_2}{4\\pi\\varepsilon_0 r^2}";
      if (level === 1) {
        if (r.next() < 0.45) {
          const mant = r.dec(1.1, 9.9, 1);
          const ex = r.int(12, 14);
          const N = mant * 10 ** ex;
          const q = N * E0 * 1e6;
          const what = r.pick(["Glavnik se pri česanju naelektri", "Balon se z drgnjenjem ob pulover naelektri", "Plastična palica se z drgnjenjem naelektri"]);
          return T(
            `${what} tako, da ima $${tx(mant)} \\cdot 10^{${ex}}$ odvečnih elektronov. Kolikšna je velikost naboja v mikrocoulombih? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$) Zaokroži na dve decimalki.`,
            num(q, "µC", 2, [M(N / E0 / 1e30, "Število elektronov pomnoži z osnovnim nabojem, ne deli."), M(q * 1e6, "Naboj pretvori v mikrocoulombe: $1\\ \\mathrm{\\mu C} = 10^{-6}\\ \\mathrm{C}$.")], { unitAlternatives: ["µAs", "uAs"] }),
            "Naboj je število elektronov, pomnoženo z osnovnim nabojem.",
            [`N = ${tx(mant)} \\cdot 10^{${ex}}`, K.e0],
            ["e"],
            ["e = N e_0"],
            [`$e = ${tx(mant)} \\cdot 10^{${ex}} \\cdot 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As} \\approx ${qty(sci(q * 1e-6, 3), "C")}$`, `$e ${res(q, 2, "\\mathrm{\\mu C}")}$`],
          );
        }
        const q1 = r.int(1, 9);
        const q2 = r.int(1, 9);
        const rr = r.dec(0.1, 1.5, 1);
        const F = (k * q1 * 1e-6 * q2 * 1e-6) / (rr * rr);
        return T(
          `Točkasta naboja $${q1}\\ \\mathrm{\\mu C}$ in $${q2}\\ \\mathrm{\\mu C}$ sta $${qty(tx(rr), "m")}$ narazen. S kolikšno silo se odbijata? ${cst} Zaokroži na dve decimalki.`,
          num(F, "N", 2, [M((k * q1 * q2 * 1e-12) / rr, "Razdaljo je treba kvadrirati."), M((q1 * q2 * 1e-12) / (EPS0 * rr * rr), "V imenovalcu je $4\\pi\\varepsilon_0$, ne le $\\varepsilon_0$.")]),
          "Uporabi Coulombov zakon; naboja pretvori v coulombe ($1\\ \\mathrm{\\mu C} = 10^{-6}\\ \\mathrm{C}$).",
          [dat("e_1", q1, "\\mathrm{\\mu C}"), dat("e_2", q2, "\\mathrm{\\mu C}"), dat("r", tx(rr), "m"), K.eps0],
          ["F"],
          [coul],
          [`$e_1 e_2 = ${q1} \\cdot 10^{-6} \\cdot ${q2} \\cdot 10^{-6}\\ \\mathrm{A^2s^2} = ${q1 * q2} \\cdot 10^{-12}\\ \\mathrm{A^2s^2}$`, `$F = \\dfrac{${q1 * q2} \\cdot 10^{-12}}{4\\pi \\cdot 8{,}85 \\cdot 10^{-12} \\cdot (${tx(rr)})^2}\\ \\mathrm{N} ${res(F, 2, "N")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const q1 = r.int(5, 90);
          const q2 = r.int(5, 90);
          const rcm = r.int(2, 30);
          const F = (k * q1 * 1e-9 * q2 * 1e-9) / (rcm / 100) ** 2;
          const ctx = r.pick([`Kroglici z nabojema $${q1}\\ \\mathrm{nC}$ in $-${q2}\\ \\mathrm{nC}$ sta $${rcm}\\ \\mathrm{cm}$ narazen.`, `Dva lahka balončka z nabojema $${q1}\\ \\mathrm{nC}$ in $${q2}\\ \\mathrm{nC}$ visita $${rcm}\\ \\mathrm{cm}$ narazen.`]);
          return T(
            `${ctx} Kolikšna je velikost sile med njima v milinewtonih? ${cst} Zaokroži na tri decimalke.`,
            num(F * 1000, "mN", 3, [M((k * q1 * q2 * 1e-18) / (rcm / 100) * 1000, "Razdaljo je treba kvadrirati."), M(((k * q1 * q2 * 1e-18) / (rcm * rcm)) * 1000, "Razdaljo pretvori v metre.")]),
            "Naboja pretvori v coulombe ($1\\ \\mathrm{nC} = 10^{-9}\\ \\mathrm{C}$), razdaljo v metre, nato uporabi Coulombov zakon.",
            [dat("e_1", q1, "nC"), dat("e_2", q2, "nC"), dat("r", rcm, "cm"), K.eps0],
            ["F"],
            [coul],
            [`$e_1 e_2 = ${q1 * q2} \\cdot 10^{-18}\\ \\mathrm{A^2s^2},\\ r = ${qty(tx(rcm / 100), "m")}$`, `$F = \\dfrac{e_1 e_2}{4\\pi\\varepsilon_0 r^2} \\approx ${qty(sci(F, 3), "N")}$`, `$F ${res(F * 1000, 3, "mN")}$`],
          );
        }
        const F1 = r.dec(0.5, 20, 1);
        const kr = r.pick([2, 3, 0.5]);
        const kq = r.pick([2, 3, 1]);
        const F2 = (F1 * kq) / (kr * kr);
        const rtxt = kr === 0.5 ? "razdaljo med njima zmanjšamo na polovico" : `razdaljo med njima povečamo na ${kr === 2 ? "dvakratno" : "trikratno"} vrednost`;
        const qtxt = kq === 1 ? "" : ` in hkrati en naboj povečamo na ${kq === 2 ? "dvakratno" : "trikratno"} vrednost`;
        return T(
          `Točkasta naboja se privlačita s silo $${qty(tx(F1), "N")}$. Kolikšna je sila, če ${rtxt}${qtxt}? Zaokroži na dve decimalki.`,
          num(F2, "N", 2, [M((F1 * kq) / kr, "Sila je obratno sorazmerna s kvadratom razdalje, ne z razdaljo."), M(F1 * kq * kr * kr, "Ko se razdalja poveča, se sila zmanjša."), M(F1 / (kr * kr), "Upoštevaj tudi spremembo naboja.")]),
          "Sila je sorazmerna z zmnožkom nabojev in obratno sorazmerna s kvadratom razdalje.",
          [dat("F_1", tx(F1), "N")],
          ["F_2"],
          ["F \\propto \\dfrac{e_1 e_2}{r^2}", "F_2 = F_1 \\cdot \\dfrac{e_2'}{e_2} \\cdot \\left(\\dfrac{r_1}{r_2}\\right)^2"],
          [`$\\dfrac{F_2}{F_1} = ${kq} \\cdot \\left(\\dfrac{1}{${tx(kr)}}\\right)^2 = ${tx(kq / (kr * kr), 4)}$`, `$F_2 = ${tx(F1)}\\ \\mathrm{N} \\cdot ${tx(kq / (kr * kr), 4)} ${res(F2, 2, "N")}$`],
        );
      }
      const kind = r.pick(["dotik", "tri", "razdalja"]);
      if (kind === "dotik") {
        const q1 = r.int(1, 12);
        const q2 = -r.int(1, 12);
        if (q1 + q2 === 0) return null;
        const qq = (q1 + q2) / 2;
        const rcm = r.int(5, 40);
        const F = (k * (qq * 1e-6) ** 2) / (rcm / 100) ** 2;
        return T(
          `Enaki kovinski kroglici imata naboja $${q1}\\ \\mathrm{\\mu C}$ in $${q2}\\ \\mathrm{\\mu C}$. ${n} ju za hip stakne, nato ju razmakne na razdaljo $${rcm}\\ \\mathrm{cm}$. Kolikšna je sila med njima? ${cst} Zaokroži na dve decimalki.`,
          num(F, "N", 2, [M((k * Math.abs(q1 * q2) * 1e-12) / (rcm / 100) ** 2, "Ob stiku se naboj prerazporedi: vsaka kroglica dobi polovico skupnega naboja."), M((k * ((q1 - q2) / 2) ** 2 * 1e-12) / (rcm / 100) ** 2, "Naboja imata nasprotna predznaka – skupni naboj je njuna vsota s predznakoma.")]),
          "Ob stiku enakih kroglic se skupni naboj razdeli na pol. Šele potem uporabi Coulombov zakon.",
          [dat("e_1", q1, "\\mathrm{\\mu C}"), dat("e_2", q2, "\\mathrm{\\mu C}"), dat("r", rcm, "cm"), K.eps0],
          ["F"],
          ["e' = \\dfrac{e_1 + e_2}{2}", "F = \\dfrac{e'^2}{4\\pi\\varepsilon_0 r^2}"],
          [`$e' = \\dfrac{${q1} + (${q2})}{2}\\ \\mathrm{\\mu C} = ${qty(tx(qq), "\\mathrm{\\mu C}")}$`, `$r = ${qty(tx(rcm / 100), "m")}$`, `$F = \\dfrac{(${tx(qq)} \\cdot 10^{-6})^2}{4\\pi\\varepsilon_0 \\cdot (${tx(rcm / 100)})^2}\\ \\mathrm{N} ${res(F, 2, "N")}$`],
        );
      }
      if (kind === "tri") {
        const q1 = r.int(1, 9);
        const q2 = r.int(1, 9);
        const q3 = r.int(1, 5);
        const d = r.int(10, 40);
        const x = r.int(2, d - 2);
        const F13 = (k * q1 * q3 * 1e-12) / (x / 100) ** 2;
        const F23 = (k * q2 * q3 * 1e-12) / ((d - x) / 100) ** 2;
        const F = Math.abs(F13 - F23);
        if (F < 0.01) return null;
        return T(
          `Pozitivna točkasta naboja $${q1}\\ \\mathrm{\\mu C}$ in $${q2}\\ \\mathrm{\\mu C}$ sta $${d}\\ \\mathrm{cm}$ narazen. Na zveznico, $${x}\\ \\mathrm{cm}$ od prvega naboja, postavimo naboj $${q3}\\ \\mathrm{\\mu C}$. Kolikšna je velikost rezultante sil nanj? ${cst} Zaokroži na dve decimalki.`,
          num(F, "N", 2, [M(F13 + F23, "Sili kažeta v nasprotni smeri (oba naboja ga odbijata), zato ju odštej."), M(F13, "Upoštevaj obe sili.")]),
          "Izračunaj obe sili posebej. Ker oba naboja tretjega odbijata, kažeta sili v nasprotni smeri.",
          [dat("e_1", q1, "\\mathrm{\\mu C}"), dat("e_2", q2, "\\mathrm{\\mu C}"), dat("e_3", q3, "\\mathrm{\\mu C}"), dat("d", d, "cm"), dat("x", x, "cm"), K.eps0],
          ["F"],
          [coul, "F = |F_{13} - F_{23}|"],
          [`$F_{13} = \\dfrac{${q1} \\cdot ${q3} \\cdot 10^{-12}}{4\\pi\\varepsilon_0 \\cdot (${tx(x / 100)})^2}\\ \\mathrm{N} ${res(F13, 3, "N")}$`, `$F_{23} = \\dfrac{${q2} \\cdot ${q3} \\cdot 10^{-12}}{4\\pi\\varepsilon_0 \\cdot (${tx((d - x) / 100)})^2}\\ \\mathrm{N} ${res(F23, 3, "N")}$`, `$F = |F_{13} - F_{23}| ${res(F, 2, "N")}$`],
        );
      }
      const q1 = r.int(1, 9);
      const q2 = r.int(1, 9);
      const F = r.dec(0.5, 30, 1);
      const rr = Math.sqrt((k * q1 * q2 * 1e-12) / F) * 100;
      return T(
        `Na kolikšni razdalji se naboja $${q1}\\ \\mathrm{\\mu C}$ in $${q2}\\ \\mathrm{\\mu C}$ odbijata s silo $${qty(tx(F), "N")}$? ${cst} Rezultat zapiši v cm in zaokroži na eno decimalko.`,
        num(rr, "cm", 1, [M(((k * q1 * q2 * 1e-12) / F) * 100, "Na koncu moraš koreniti."), M(rr / 100, "Rezultat pretvori v centimetre.")]),
        "Iz Coulombovega zakona izrazi $r^2$, nato koreni.",
        [dat("e_1", q1, "\\mathrm{\\mu C}"), dat("e_2", q2, "\\mathrm{\\mu C}"), dat("F", tx(F), "N"), K.eps0],
        ["r"],
        ["r = \\sqrt{\\dfrac{e_1 e_2}{4\\pi\\varepsilon_0 F}}"],
        [`$r^2 = \\dfrac{${q1 * q2} \\cdot 10^{-12}}{4\\pi \\cdot 8{,}85 \\cdot 10^{-12} \\cdot ${tx(F)}}\\ \\mathrm{m^2} \\approx ${qty(sci(rr * rr / 1e4, 3), "m^2")}$`, `$r ${res(rr / 100, 4, "m")} ${res(rr, 1, "cm")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-elektricno-polje",
    topics: ["FIZ-SS-2/elektricno-polje"],
    gen(level, r) {
      const n = ime(r);
      const k = 1 / (4 * Math.PI * EPS0);
      if (level === 1) {
        const kind = r.pick(["plosci", "sila", "tocka"]);
        if (kind === "plosci") {
          const U = r.int(2, 60) * 10;
          const dcm = r.dec(0.5, 8, 1);
          const E = U / (dcm / 100);
          return T(
            `Med vzporednima ploščama, ki sta $${qty(tx(dcm), "cm")}$ narazen, je napetost $${U}\\ \\mathrm{V}$. Kolikšna je jakost homogenega električnega polja med njima? Rezultat zapiši v V/m in zaokroži na celo število.`,
            num(E, "V/m", 0, [M(U / dcm, "Razdaljo pretvori v metre."), M(U * (dcm / 100), "Napetost deli z razdaljo, ne množi.")], { unitAlternatives: ["N/C", "N/As"] }),
            "V homogenem polju je jakost enaka napetosti, deljeni z razdaljo med ploščama.",
            [dat("U", U, "V"), dat("d", tx(dcm), "cm")],
            ["E"],
            ["E = \\dfrac{U}{d}"],
            [`$d = ${qty(tx(dcm), "cm")} = ${qty(tx(dcm / 100), "m")}$`, `$E = \\dfrac{${U}}{${tx(dcm / 100)}}\\ \\mathrm{V/m} ${res(E, 0, "V/m")}$`],
          );
        }
        if (kind === "sila") {
          const q = r.int(2, 20);
          const E = r.int(2, 50);
          const F = q * E;
          return T(
            `Na majhno kroglico z nabojem $${q}\\ \\mathrm{\\mu C}$ deluje v električnem polju z jakostjo $${E}\\ \\mathrm{kN/C}$ električna sila. Kolikšna je ta sila v milinewtonih?`,
            num(F, "mN", null, [M(E / q, "Sila je zmnožek naboja in jakosti polja."), M(F * 1000, "Pazi na predpone: $\\mathrm{\\mu C \\cdot kN/C} = \\mathrm{mN}$.")], { tolerance: 1e-9 }),
            "Jakost polja je sila na enoto naboja: $E = F/e$.",
            [dat("e", q, "\\mathrm{\\mu C}"), dat("E", E, "kN/C")],
            ["F"],
            ["F = e E"],
            [`$F = e E = ${q} \\cdot 10^{-6}\\ \\mathrm{C} \\cdot ${E} \\cdot 10^{3}\\ \\mathrm{N/C} = ${qty(sci(F * 1e-3, 1), "N")}$`, `$F = ${qty(F, "mN")}$`],
          );
        }
        const q = r.int(1, 9);
        const rr = r.dec(0.2, 2, 1);
        const E = (k * q * 1e-6) / (rr * rr) / 1000;
        return T(
          `Kolikšna je jakost električnega polja na razdalji $${qty(tx(rr), "m")}$ od točkastega naboja $${q}\\ \\mathrm{\\mu C}$? ($\\varepsilon_0 = 8{,}85 \\cdot 10^{-12}\\ \\mathrm{As/Vm}$) Rezultat zapiši v kN/C in zaokroži na eno decimalko.`,
          num(E, "kN/C", 1, [M((k * q * 1e-6) / rr / 1000, "Razdaljo je treba kvadrirati."), M((q * 1e-6) / (EPS0 * rr * rr) / 1000, "V imenovalcu je $4\\pi\\varepsilon_0$.")], { unitAlternatives: ["kV/m"] }),
          "Polje točkastega naboja pada s kvadratom razdalje.",
          [dat("e", q, "\\mathrm{\\mu C}"), dat("r", tx(rr), "m"), K.eps0],
          ["E"],
          ["E = \\dfrac{e}{4\\pi\\varepsilon_0 r^2}"],
          [`$E = \\dfrac{${q} \\cdot 10^{-6}}{4\\pi \\cdot 8{,}85 \\cdot 10^{-12} \\cdot (${tx(rr)})^2}\\ \\mathrm{N/C} ${res(E * 1000, 0, "N/C")}$`, `$E ${res(E, 1, "kN/C")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["elektron", "tocka", "plosci"]);
        if (kind === "elektron") {
          const U = r.pick([20, 50, 100, 150, 200, 500, 1000, 2000]);
          const v = Math.sqrt((2 * E0 * U) / ME) / 1000;
          const ctx = r.pick(["v elektronski cevi", "v katodni cevi", "med elektrodama v vakuumu"]);
          return T(
            `Elektron, ki sprva miruje, ${ctx} pospešimo z napetostjo $${U}\\ \\mathrm{V}$. Kolikšno hitrost doseže? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$, $m_e = 9{,}11 \\cdot 10^{-31}\\ \\mathrm{kg}$) Rezultat zapiši v km/s in zaokroži na celo število.`,
            num(v, "km/s", 0, [M(Math.sqrt((E0 * U) / ME) / 1000, "Kinetična energija je $\\frac{m v^2}{2}$ – si pozabil faktor 2?"), M(v * 1000, "Rezultat pretvori v km/s.")]),
            "Delo električnega polja $e_0 U$ se pretvori v kinetično energijo elektrona.",
            [dat("U", U, "V"), K.e0, K.me],
            ["v"],
            ["e_0 U = \\dfrac{m_e v^2}{2}", "v = \\sqrt{\\dfrac{2 e_0 U}{m_e}}"],
            [`$W_k = e_0 U = 1{,}60 \\cdot 10^{-19} \\cdot ${U}\\ \\mathrm{J} = ${qty(sci(E0 * U, 2), "J")}$`, `$v = \\sqrt{\\dfrac{2 W_k}{m_e}} \\approx ${qty(sci(v * 1000, 3), "m/s")}$`, `$v ${res(v, 0, "km/s")}$`],
          );
        }
        if (kind === "tocka") {
          const q = r.int(2, 90);
          const rcm = r.int(2, 30);
          const E = (k * q * 1e-9) / (rcm / 100) ** 2;
          return T(
            `Majhna kovinska krogla ima naboj $${q}\\ \\mathrm{nC}$. Kolikšna je jakost električnega polja $${rcm}\\ \\mathrm{cm}$ od njenega središča? ($\\varepsilon_0 = 8{,}85 \\cdot 10^{-12}\\ \\mathrm{As/Vm}$) Rezultat zapiši v kN/C in zaokroži na dve decimalki.`,
            num(E / 1000, "kN/C", 2, [M((k * q * 1e-9) / (rcm / 100) / 1000, "Razdaljo je treba kvadrirati."), M((k * q * 1e-9) / (rcm * rcm) / 1000, "Razdaljo pretvori v metre.")], { unitAlternatives: ["kV/m"] }),
            "Naboj pretvori v coulombe, razdaljo v metre; zunaj krogle je polje enako kot polje točkastega naboja.",
            [dat("e", q, "nC"), dat("r", rcm, "cm"), K.eps0],
            ["E"],
            ["E = \\dfrac{e}{4\\pi\\varepsilon_0 r^2}"],
            [`$e = ${qty(sci(q * 1e-9, 1), "C")},\\ r = ${qty(tx(rcm / 100), "m")}$`, `$E = \\dfrac{e}{4\\pi\\varepsilon_0 r^2} ${res(E, 0, "N/C")}$`, `$E ${res(E / 1000, 2, "kN/C")}$`],
          );
        }
        const U = r.int(5, 50) * 100;
        const dmm = r.int(2, 20);
        const q = r.dec(0.5, 5, 1);
        const E = U / (dmm / 1000);
        const F = q * 1e-9 * E * 1000;
        return T(
          `Med ploščama kondenzatorja, ki sta $${dmm}\\ \\mathrm{mm}$ narazen, je napetost $${U}\\ \\mathrm{V}$. S kolikšno silo polje deluje na prašni delec z nabojem $${qty(tx(q), "nC")}$? Rezultat zapiši v mN in zaokroži na tri decimalke.`,
          num(F, "mN", 3, [M(q * 1e-9 * (U / dmm) * 1000, "Razdaljo pretvori v metre."), M(q * 1e-9 * U * 1000, "Najprej izračunaj jakost polja $E = U/d$.")]),
          "Najprej izračunaj jakost homogenega polja med ploščama, nato silo na naboj.",
          [dat("U", U, "V"), dat("d", dmm, "mm"), dat("e", tx(q), "nC")],
          ["F"],
          ["E = \\dfrac{U}{d}", "F = e E"],
          [`$E = \\dfrac{${U}\\ \\mathrm{V}}{${tx(dmm / 1000)}\\ \\mathrm{m}} ${res(E, 0, "V/m")}$`, `$F = e E = ${sci(q * 1e-9, 1)}\\ \\mathrm{C} \\cdot ${tx(E, 0)}\\ \\mathrm{V/m} \\approx ${qty(sci(F / 1000, 3), "N")}$`, `$F ${res(F, 3, "mN")}$`],
        );
      }
      if (r.next() < 0.5) {
        const N = r.int(2, 12);
        const dmm = r.int(4, 15);
        const U = r.int(10, 60) * 10;
        const mExact = (N * E0 * U) / (dmm / 1000) / GZ;
        const mm = roundHalfUp(mExact * 1e15, 2);
        const Nc = (mm * 1e-15 * GZ * (dmm / 1000)) / (U * E0);
        return T(
          `Pri Millikanovem poskusu kapljica olja z maso $${tx(mm, 2)} \\cdot 10^{-15}\\ \\mathrm{kg}$ lebdi med vodoravnima ploščama, ki sta $${dmm}\\ \\mathrm{mm}$ narazen in med katerima je napetost $${U}\\ \\mathrm{V}$. Koliko odvečnih elektronov ima kapljica? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$) Zaokroži na celo število.`,
          num(Nc, "", 0, [M((mm * 1e-15 * GZ) / ((U / (dmm / 1000)) * E0) / 1000, "Razdaljo med ploščama pretvori v metre."), M((mm * 1e-15 * (dmm / 1000)) / (U * E0), "Električna sila uravnovesi težo $mg$, ne mase.")]),
          "Kapljica lebdi, zato je električna sila enaka teži. Iz tega izračunaj naboj, nato število elektronov.",
          [`m = ${tx(mm, 2)} \\cdot 10^{-15}\\ \\mathrm{kg}`, dat("d", dmm, "mm"), dat("U", U, "V"), K.e0, K.g],
          ["N"],
          ["e\\dfrac{U}{d} = m g", "N = \\dfrac{e}{e_0}"],
          [`$E = \\dfrac{U}{d} = \\dfrac{${U}}{${tx(dmm / 1000)}}\\ \\mathrm{V/m} ${res(U / (dmm / 1000), 0, "V/m")}$`, `$e = \\dfrac{m g}{E} \\approx ${qty(sci(Nc * E0, 3), "C")}$`, `$N = \\dfrac{e}{e_0} \\approx ${tx(Nc, 2)} \\approx ${tx(Nc, 0)}$`],
        );
      }
      const q1 = r.int(1, 9);
      let q2 = r.int(1, 9);
      if (q2 === q1) q2 = q1 === 9 ? 4 : q1 + 1;
      const d = r.int(10, 60);
      const x = d / (1 + Math.sqrt(q2 / q1));
      return T(
        `Pozitivna točkasta naboja $${q1}\\ \\mathrm{nC}$ in $${q2}\\ \\mathrm{nC}$ sta $${d}\\ \\mathrm{cm}$ narazen. Kako daleč od prvega naboja je na zveznici točka, v kateri je jakost električnega polja enaka nič? Zaokroži na eno decimalko.`,
        num(x, "cm", 1, [M((d * q1) / (q1 + q2), "Polje pada s kvadratom razdalje, zato razdalje niso v razmerju nabojev."), M(d / 2, "Naboja nista enaka, zato točka ni na sredini."), M(d - x, "Točka je bliže manjšemu naboju.")]),
        "V iskani točki sta polji obeh nabojev enako veliki in nasprotno usmerjeni. Zapiši enakost in koreni.",
        [dat("e_1", q1, "nC"), dat("e_2", q2, "nC"), dat("d", d, "cm")],
        ["x"],
        ["\\dfrac{e_1}{4\\pi\\varepsilon_0 x^2} = \\dfrac{e_2}{4\\pi\\varepsilon_0 (d-x)^2}", "\\dfrac{d - x}{x} = \\sqrt{\\dfrac{e_2}{e_1}}"],
        [`$\\dfrac{e_1}{x^2} = \\dfrac{e_2}{(d-x)^2} \\Rightarrow \\dfrac{d-x}{x} = \\sqrt{\\dfrac{${q2}}{${q1}}} \\approx ${tx(Math.sqrt(q2 / q1), 4)}$`, `$x = \\dfrac{d}{1 + \\sqrt{e_2/e_1}} = \\dfrac{${d}}{1 + ${tx(Math.sqrt(q2 / q1), 4)}}\\ \\mathrm{cm} ${res(x, 1, "cm")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-kondenzator",
    topics: ["FIZ-SS-2/elektricno-polje", "FIZ-SS-4/mesane-maturitetne-naloge"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.pick(["naboj", "kapaciteta", "energija"]);
        const C1 = r.pick([1, 2, 4.7, 10, 22, 47, 100, 220, 470]);
        const U = r.pick([1.5, 3, 4.5, 6, 9, 12, 24, 50]);
        if (kind === "naboj") {
          return T(
            `Kondenzator s kapaciteto $${qty(tx(C1), "\\mathrm{\\mu F}")}$ priključimo na napetost $${qty(tx(U), "V")}$. Koliko naboja se nabere na njem? Rezultat zapiši v µC.`,
            num(C1 * U, "µC", null, [M(C1 / U, "Naboj je zmnožek kapacitete in napetosti."), M(U / C1, "Naboj je zmnožek kapacitete in napetosti.")], { tolerance: 1e-9, unitAlternatives: ["µAs", "uAs"] }),
            "Kapaciteta pove, koliko naboja se nabere na enoto napetosti.",
            [dat("C", tx(C1), "\\mathrm{\\mu F}"), dat("U", tx(U), "V")],
            ["e"],
            ["e = C U"],
            [`$e = C U = ${tx(C1)}\\ \\mathrm{\\mu F} \\cdot ${qty(tx(U), "V")}$`, `$e = ${qty(tx(C1 * U), "\\mathrm{\\mu C}")}$`],
          );
        }
        if (kind === "kapaciteta") {
          const q = roundHalfUp(C1 * U, 1);
          const Cc = q / U;
          return T(
            `Ko kondenzator priključimo na napetost $${qty(tx(U), "V")}$, se na njem nabere naboj $${qty(tx(q), "\\mathrm{\\mu C}")}$. Kolikšna je njegova kapaciteta? Rezultat zapiši v µF in zaokroži na dve decimalki.`,
            num(Cc, "µF", 2, [M(q * U, "Kapaciteta je količnik naboja in napetosti."), M(U / q, "Si delil v obratnem vrstnem redu?")]),
            "Iz $e = C U$ izrazi kapaciteto.",
            [dat("U", tx(U), "V"), dat("e", tx(q), "\\mathrm{\\mu C}")],
            ["C"],
            ["C = \\dfrac{e}{U}"],
            [`$C = \\dfrac{e}{U} = \\dfrac{${qty(tx(q), "\\mathrm{\\mu C}")}}{${qty(tx(U), "V")}}$`, `$C ${res(Cc, 2, "\\mathrm{\\mu F}")}$`],
          );
        }
        const W = (C1 * U * U) / 2 / 1000;
        return T(
          `Koliko energije je shranjene v kondenzatorju s kapaciteto $${qty(tx(C1), "\\mathrm{\\mu F}")}$, nabitem na napetost $${qty(tx(U), "V")}$? Rezultat zapiši v mJ in zaokroži na tri decimalke.`,
          num(W, "mJ", 3, [M(C1 * U * U / 1000, "Energija kondenzatorja je $\\frac{C U^2}{2}$ – si pozabil deliti z 2?"), M((C1 * U) / 2 / 1000, "Napetost je treba kvadrirati.")]),
          "Energija nabitega kondenzatorja je sorazmerna s kvadratom napetosti.",
          [dat("C", tx(C1), "\\mathrm{\\mu F}"), dat("U", tx(U), "V")],
          ["W_e"],
          ["W_e = \\dfrac{C U^2}{2}"],
          [`$W_e = \\dfrac{${tx(C1)} \\cdot 10^{-6}\\ \\mathrm{F} \\cdot (${qty(tx(U), "V")})^2}{2} \\approx ${qty(sci(W / 1000, 3), "J")}$`, `$W_e ${res(W, 3, "mJ")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["ploscati", "blisk", "vezava"]);
        if (kind === "ploscati") {
          const S = r.int(4, 40) * 10;
          const dmm = r.dec(0.2, 3, 1);
          const C = (EPS0 * S * 1e-4) / (dmm / 1000) * 1e12;
          return T(
            `Ploščati kondenzator ima plošči s ploščino $${S}\\ \\mathrm{cm^2}$, ki sta $${qty(tx(dmm), "mm")}$ narazen; vmes je zrak. Kolikšna je njegova kapaciteta? ($\\varepsilon_0 = 8{,}85 \\cdot 10^{-12}\\ \\mathrm{As/Vm}$) Rezultat zapiši v pF in zaokroži na eno decimalko.`,
            num(C, "pF", 1, [M(((EPS0 * S) / dmm) * 1e12, "Ploščino pretvori v m², razdaljo v m."), M(((EPS0 * (dmm / 1000)) / (S * 1e-4)) * 1e12, "Kapaciteta je sorazmerna s ploščino in obratno sorazmerna z razdaljo.")]),
            "Ploščino pretvori v m² ($1\\ \\mathrm{cm^2} = 10^{-4}\\ \\mathrm{m^2}$), razdaljo v m.",
            [dat("S", S, "cm^2"), dat("d", tx(dmm), "mm"), K.eps0],
            ["C"],
            ["C = \\dfrac{\\varepsilon_0 S}{d}"],
            [`$S = ${qty(sci(S * 1e-4, 1), "m^2")},\\ d = ${qty(sci(dmm / 1000, 1), "m")}$`, `$C = \\dfrac{8{,}85 \\cdot 10^{-12} \\cdot ${sci(S * 1e-4, 1)}}{${sci(dmm / 1000, 1)}}\\ \\mathrm{F} \\approx ${qty(sci(C * 1e-12, 3), "F")}$`, `$C ${res(C, 1, "pF")}$`],
          );
        }
        if (kind === "blisk") {
          const C = r.int(10, 50) * 10;
          const U = r.int(15, 35) * 10;
          const W = (C * 1e-6 * U * U) / 2;
          return T(
            `Kondenzator v bliskavici fotoaparata ima kapaciteto $${C}\\ \\mathrm{\\mu F}$ in je nabit na $${U}\\ \\mathrm{V}$. Koliko energije se sprosti v enem blisku, če se kondenzator popolnoma izprazni? Zaokroži na dve decimalki.`,
            num(W, "J", 2, [M(W * 2, "Energija kondenzatorja je $\\frac{C U^2}{2}$."), M((C * 1e-6 * U) / 2, "Napetost je treba kvadrirati."), M(W * 1e6, "Kapaciteto pretvori v farade.")]),
            "Kapaciteto pretvori v farade, nato izračunaj energijo nabitega kondenzatorja.",
            [dat("C", C, "\\mathrm{\\mu F}"), dat("U", U, "V")],
            ["W_e"],
            ["W_e = \\dfrac{C U^2}{2}"],
            [`$C = ${C}\\ \\mathrm{\\mu F} = ${qty(sci(C * 1e-6, 1), "F")}$`, `$W_e = \\dfrac{${sci(C * 1e-6, 1)} \\cdot ${U}^2}{2}\\ \\mathrm{J} ${res(W, 2, "J")}$`],
          );
        }
        const a = r.pick([2, 3, 4, 5, 6, 10, 12, 15, 22]);
        const b = r.pick([1, 2, 3, 4, 6, 8, 10, 33]);
        const ser = r.next() < 0.5;
        const Ce = ser ? (a * b) / (a + b) : a + b;
        return T(
          `Kondenzatorja s kapacitetama $${a}\\ \\mathrm{\\mu F}$ in $${b}\\ \\mathrm{\\mu F}$ vežemo ${ser ? "zaporedno" : "vzporedno"}. Kolikšna je nadomestna kapaciteta? Zaokroži na dve decimalki.`,
          num(Ce, "µF", 2, [M(ser ? a + b : (a * b) / (a + b), ser ? "Pri zaporedni vezavi seštevamo obratne vrednosti kapacitet." : "Pri vzporedni vezavi se kapacitete seštejejo."), M(ser ? 1 / a + 1 / b : (a + b) / 2, ser ? "Na koncu vzemi še obratno vrednost." : "Kapacitet ne povprečiš – seštej jih.")]),
          ser ? "Pri zaporedni vezavi je naboj na obeh enak, napetosti se seštejeta: $\\frac{1}{C} = \\frac{1}{C_1} + \\frac{1}{C_2}$." : "Pri vzporedni vezavi je napetost enaka, naboja se seštejeta.",
          [dat("C_1", a, "\\mathrm{\\mu F}"), dat("C_2", b, "\\mathrm{\\mu F}")],
          ["C"],
          [ser ? "\\dfrac{1}{C} = \\dfrac{1}{C_1} + \\dfrac{1}{C_2}" : "C = C_1 + C_2"],
          ser ? [`$\\dfrac{1}{C} = \\dfrac{1}{${a}} + \\dfrac{1}{${b}} = \\dfrac{${a + b}}{${a * b}}\\ \\mathrm{\\mu F^{-1}}$`, `$C = \\dfrac{${a * b}}{${a + b}}\\ \\mathrm{\\mu F} ${res(Ce, 2, "\\mathrm{\\mu F}")}$`] : [`Vzporedno: kapaciteti se seštejeta.`, `$C = ${a} + ${b}\\ \\mathrm{\\mu F} = ${qty(Ce, "\\mathrm{\\mu F}")}$`],
        );
      }
      if (r.next() < 0.5) {
        const U0 = r.int(2, 30) * 10;
        const d1 = r.dec(0.5, 3, 1);
        const kf = r.pick([1.5, 2, 2.5, 3, 4]);
        const d2 = roundHalfUp(d1 * kf, 2);
        const U2 = (U0 * d2) / d1;
        return T(
          `Ploščati kondenzator nabijemo na napetost $${U0}\\ \\mathrm{V}$ in ga odklopimo od vira. Nato razdaljo med ploščama povečamo s $${qty(tx(d1), "mm")}$ na $${qty(tx(d2), "mm")}$. Kolikšna je nova napetost? Zaokroži na celo število.`,
          num(U2, "V", 0, [M((U0 * d1) / d2, "Kondenzator je odklopljen, zato se ohrani naboj; kapaciteta se zmanjša, napetost pa poveča."), M(U0, "Ker je kondenzator odklopljen, se ne ohrani napetost, temveč naboj.")]),
          "Odklopljen kondenzator ohrani naboj. Ugotovi, kako se spremeni kapaciteta, nato napetost $U = e/C$.",
          [dat("U_0", U0, "V"), dat("d_1", tx(d1), "mm"), dat("d_2", tx(d2), "mm")],
          ["U_2"],
          ["C = \\dfrac{\\varepsilon_0 S}{d}", "e = C U = \\text{konst.}"],
          [`$\\dfrac{C_2}{C_1} = \\dfrac{d_1}{d_2} = \\dfrac{${tx(d1)}}{${tx(d2)}}$`, `$e = C_1 U_0 = C_2 U_2 \\Rightarrow U_2 = U_0 \\dfrac{d_2}{d_1}$`, `$U_2 = ${U0} \\cdot \\dfrac{${tx(d2)}}{${tx(d1)}}\\ \\mathrm{V} ${res(U2, 0, "V")}$`],
        );
      }
      const C1 = r.int(1, 20) * 5;
      const C2 = r.int(1, 20) * 5;
      const U0 = r.int(3, 30) * 10;
      const U = (C1 * U0) / (C1 + C2);
      return T(
        `Kondenzator s kapaciteto $${C1}\\ \\mathrm{\\mu F}$ nabijemo na $${U0}\\ \\mathrm{V}$ in odklopimo. Nato ${n} vzporedno nanj priključi prazen kondenzator s kapaciteto $${C2}\\ \\mathrm{\\mu F}$. Kolikšna napetost se ustali na obeh? Zaokroži na eno decimalko.`,
        num(U, "V", 1, [M(U0 / 2, "Naboj se ne razdeli na pol, temveč tako, da je napetost na obeh enaka."), M((C2 * U0) / (C1 + C2), "Si zamenjal kapaciteti? Naboj je bil prvotno na prvem kondenzatorju."), M(U0, "Naboj se prerazporedi tudi na drugi kondenzator, zato napetost pade.")]),
        "Skupni naboj se ohrani in se razporedi tako, da je napetost na obeh kondenzatorjih enaka.",
        [dat("C_1", C1, "\\mathrm{\\mu F}"), dat("C_2", C2, "\\mathrm{\\mu F}"), dat("U_0", U0, "V")],
        ["U"],
        ["e = C_1 U_0", "U = \\dfrac{e}{C_1 + C_2}"],
        [`$e = C_1 U_0 = ${C1} \\cdot ${U0}\\ \\mathrm{\\mu C} = ${qty(C1 * U0, "\\mathrm{\\mu C}")}$`, `$U = \\dfrac{e}{C_1 + C_2} = \\dfrac{${C1 * U0}}{${C1 + C2}}\\ \\mathrm{V} ${res(U, 1, "V")}$`],
      );
    },
  },
  // ---------------- 3. letnik ----------------
  {
    id: "dod-fiz-ss-magnetno-polje",
    topics: ["FIZ-SS-3/magnetno-polje"],
    gen(level, r) {
      const n = ime(r);
      const mu = "($\\mu_0 = 4\\pi \\cdot 10^{-7}\\ \\mathrm{Vs/Am}$)";
      if (level === 1) {
        if (r.next() < 0.5) {
          const I = r.int(2, 40);
          const rr = r.dec(0.05, 0.5, 2);
          const B = (MU0 * I) / (2 * Math.PI * rr) * 1e6;
          return T(
            `Po dolgem ravnem vodniku teče tok $${I}\\ \\mathrm{A}$. Kolikšna je gostota magnetnega polja $${qty(tx(rr), "m")}$ od vodnika? ${mu} Rezultat zapiši v µT in zaokroži na eno decimalko.`,
            num(B, "µT", 1, [M((MU0 * I) / rr * 1e6, "V imenovalcu je obseg krožnice $2\\pi r$."), M(B / 1e6, "Rezultat pretvori v mikrotesle: $1\\ \\mathrm{T} = 10^6\\ \\mathrm{\\mu T}$.")]),
            "Silnice okoli ravnega vodnika so krožnice; gostota polja pada obratno sorazmerno z razdaljo.",
            [dat("I", I, "A"), dat("r", tx(rr), "m"), K.mu0],
            ["B"],
            ["B = \\dfrac{\\mu_0 I}{2\\pi r}"],
            [`$B = \\dfrac{4\\pi \\cdot 10^{-7} \\cdot ${I}}{2\\pi \\cdot ${tx(rr)}}\\ \\mathrm{T} ${eq(B / 1e6, 9)} ${qty(sci(B / 1e6, 3), "T")}$`, `$B ${res(B, 1, "\\mathrm{\\mu T}")}$`],
          );
        }
        const N = r.int(2, 20) * 50;
        const l = r.dec(0.1, 0.5, 2);
        const I = r.dec(0.2, 5, 1);
        const B = (MU0 * N * I) / l * 1000;
        return T(
          `Dolga tuljava z $${N}$ ovoji ima dolžino $${qty(tx(l), "m")}$; po njej teče tok $${qty(tx(I), "A")}$. Kolikšna je gostota magnetnega polja v njeni notranjosti? ${mu} Rezultat zapiši v mT in zaokroži na dve decimalki.`,
          num(B, "mT", 2, [M((MU0 * I) / l * 1000, "Upoštevaj število ovojev."), M((MU0 * N * I) / (2 * Math.PI * l) * 1000, "To je formula za ravni vodnik; v tuljavi je $B = \\mu_0 N I / l$.")]),
          "V dolgi tuljavi je polje homogeno; odvisno je od števila ovojev na enoto dolžine in od toka.",
          [`N = ${N}`, dat("l", tx(l), "m"), dat("I", tx(I), "A"), K.mu0],
          ["B"],
          ["B = \\dfrac{\\mu_0 N I}{l}"],
          [`$B = \\dfrac{4\\pi \\cdot 10^{-7} \\cdot ${N} \\cdot ${tx(I)}}{${tx(l)}}\\ \\mathrm{T} ${eq(B / 1000, 6)} ${qty(tx(B / 1000, 6), "T")}$`, `$B ${res(B, 2, "mT")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["vodnik", "tok", "ovoji"]);
        if (kind === "vodnik") {
          const I = r.int(5, 200);
          const rcm = r.int(2, 50);
          const B = ((MU0 * I) / (2 * Math.PI * (rcm / 100))) * 1e6;
          const ctx = r.pick([`Po kablu za varjenje teče tok $${I}\\ \\mathrm{A}$.`, `Po ravnem vodniku v laboratoriju teče tok $${I}\\ \\mathrm{A}$.`, `Po dovodnem kablu električne peči teče tok $${I}\\ \\mathrm{A}$.`]);
          return T(
            `${ctx} Kolikšna je gostota magnetnega polja $${rcm}\\ \\mathrm{cm}$ od kabla? ${mu} Rezultat zapiši v µT in zaokroži na eno decimalko.`,
            num(B, "µT", 1, [M(((MU0 * I) / (2 * Math.PI * rcm)) * 1e6, "Razdaljo pretvori v metre."), M(((MU0 * I) / (rcm / 100)) * 1e6, "V imenovalcu je $2\\pi r$.")]),
            "Razdaljo pretvori v metre in uporabi formulo za polje ravnega vodnika.",
            [dat("I", I, "A"), dat("r", rcm, "cm"), K.mu0],
            ["B"],
            ["B = \\dfrac{\\mu_0 I}{2\\pi r}"],
            [`$r = ${qty(tx(rcm / 100), "m")}$`, `$B = \\dfrac{2 \\cdot 10^{-7} \\cdot ${I}}{${tx(rcm / 100)}}\\ \\mathrm{T} ${res(B, 1, "\\mathrm{\\mu T}")}$`],
          );
        }
        const N = r.int(2, 20) * 100;
        const lcm = r.int(10, 60);
        const BmT = r.dec(1, 20, 1);
        if (kind === "tok") {
          const I = (BmT / 1000) * (lcm / 100) / (MU0 * N);
          return T(
            `Tuljava ima $${N}$ ovojev in dolžino $${lcm}\\ \\mathrm{cm}$. Kolikšen tok mora teči po njej, da bo v njej magnetno polje z gostoto $${qty(tx(BmT), "mT")}$? ${mu} Zaokroži na dve decimalki.`,
            num(I, "A", 2, [M((BmT * lcm) / (MU0 * N), "Gostoto pretvori v tesle in dolžino v metre."), M(((BmT / 1000) * (lcm / 100)) / MU0, "Upoštevaj število ovojev.")]),
            "Iz $B = \\mu_0 N I / l$ izrazi tok. Enote pretvori v T in m.",
            [`N = ${N}`, dat("l", lcm, "cm"), dat("B", tx(BmT), "mT"), K.mu0],
            ["I"],
            ["I = \\dfrac{B l}{\\mu_0 N}"],
            [`$B = ${qty(sci(BmT / 1000, 2), "T")},\\ l = ${qty(tx(lcm / 100), "m")}$`, `$I = \\dfrac{B l}{\\mu_0 N} = \\dfrac{${sci(BmT / 1000, 2)} \\cdot ${tx(lcm / 100)}}{4\\pi \\cdot 10^{-7} \\cdot ${N}}\\ \\mathrm{A} ${res(I, 2, "A")}$`],
          );
        }
        const I = r.dec(0.5, 4, 1);
        const Nn = ((BmT / 1000) * (lcm / 100)) / (MU0 * I);
        return T(
          `${n} navija tuljavo dolžine $${lcm}\\ \\mathrm{cm}$, po kateri bo tekel tok $${qty(tx(I), "A")}$. Koliko ovojev potrebuje, da bo gostota polja v tuljavi $${qty(tx(BmT), "mT")}$? ${mu} Zaokroži na celo število.`,
          num(Nn, "", 0, [M((BmT * lcm) / (MU0 * I), "Gostoto pretvori v tesle in dolžino v metre."), M((MU0 * I) / ((BmT / 1000) * (lcm / 100)), "Si obrnil ulomek? Izrazi $N = Bl/(\\mu_0 I)$.")]),
          "Iz $B = \\mu_0 N I / l$ izrazi število ovojev.",
          [dat("l", lcm, "cm"), dat("I", tx(I), "A"), dat("B", tx(BmT), "mT"), K.mu0],
          ["N"],
          ["N = \\dfrac{B l}{\\mu_0 I}"],
          [`$B = ${qty(sci(BmT / 1000, 2), "T")},\\ l = ${qty(tx(lcm / 100), "m")}$`, `$N = \\dfrac{${sci(BmT / 1000, 2)} \\cdot ${tx(lcm / 100)}}{4\\pi \\cdot 10^{-7} \\cdot ${tx(I)}} \\approx ${tx(Nn, 1)} \\approx ${tx(Nn, 0)}$`],
        );
      }
      const kind = r.pick(["dva", "kompas", "razdalja"]);
      if (kind === "dva") {
        const I1 = r.int(2, 30);
        let I2 = r.int(2, 30);
        if (I2 === I1) I2 += 3;
        const dcm = r.int(4, 40);
        const same = r.next() < 0.5;
        const B1 = ((MU0 * I1) / (2 * Math.PI * (dcm / 200))) * 1e6;
        const B2 = ((MU0 * I2) / (2 * Math.PI * (dcm / 200))) * 1e6;
        const B = same ? Math.abs(B1 - B2) : B1 + B2;
        return T(
          `Vzporedna dolga vodnika sta $${dcm}\\ \\mathrm{cm}$ narazen. Po prvem teče tok $${I1}\\ \\mathrm{A}$, po drugem $${I2}\\ \\mathrm{A}$, in sicer ${same ? "v isti smeri" : "v nasprotni smeri"}. Kolikšna je gostota magnetnega polja na sredini med njima? ${mu} Rezultat zapiši v µT in zaokroži na eno decimalko.`,
          num(B, "µT", 1, [M(same ? B1 + B2 : Math.abs(B1 - B2), same ? "Pri toku v isti smeri sta polji na sredini nasprotno usmerjeni – odštej." : "Pri nasprotnih tokovih kažeta polji na sredini v isto smer – seštej."), M(((MU0 * Math.abs(same ? I1 - I2 : I1 + I2)) / (2 * Math.PI * (dcm / 100))) * 1e6, "Razdalja od vsakega vodnika do sredine je polovica razmika.")]),
          "Izračunaj polje vsakega vodnika posebej (razdalja je polovica razmika) in s pravilom desne roke določi smeri.",
          [dat("I_1", I1, "A"), dat("I_2", I2, "A"), dat("d", dcm, "cm"), K.mu0],
          ["B"],
          ["B = \\dfrac{\\mu_0 I}{2\\pi r},\\ r = \\dfrac{d}{2}", same ? "B = |B_1 - B_2|" : "B = B_1 + B_2"],
          [`$r = ${qty(tx(dcm / 200), "m")}$`, `$B_1 ${res(B1, 2, "\\mathrm{\\mu T}")},\\quad B_2 ${res(B2, 2, "\\mathrm{\\mu T}")}$`, same ? `Tokova v isti smeri: polji na sredini sta nasprotni, $B = |B_1 - B_2| ${res(B, 1, "\\mathrm{\\mu T}")}$` : `Nasprotna tokova: polji na sredini kažeta v isto smer, $B = B_1 + B_2 ${res(B, 1, "\\mathrm{\\mu T}")}$`],
        );
      }
      const BZ = r.pick([18, 20, 22]);
      if (kind === "kompas") {
        const I = r.dec(0.5, 10, 1);
        const rcm = r.int(2, 15);
        const Bw = ((MU0 * I) / (2 * Math.PI * (rcm / 100))) * 1e6;
        const phi = todeg(Math.atan(Bw / BZ));
        return T(
          `Nad kompasom, $${rcm}\\ \\mathrm{cm}$ nad igličko, je vodoravno v smeri sever–jug napeljan dolg vodnik. Vodoravna komponenta zemeljskega polja je $${BZ}\\ \\mathrm{\\mu T}$. Za kolikšen kot se iglica odkloni, ko po vodniku steče tok $${qty(tx(I), "A")}$? ${mu} Zaokroži na eno decimalko.`,
          num(phi, "°", 1, [M(90 - phi, "Kot merimo od prvotne smeri iglice (sever), ne od smeri vodnikovega polja."), M(todeg(Math.atan(BZ / Bw)), "Si obrnil razmerje? $\\tan\\varphi = B_v / B_Z$.")]),
          "Polje vodnika pod njim kaže vodoravno, pravokotno na zemeljsko polje. Iglica se postavi v smer vsote obeh polj.",
          [dat("r", rcm, "cm"), dat("B_Z", BZ, "\\mathrm{\\mu T}"), dat("I", tx(I), "A"), K.mu0],
          ["\\varphi"],
          ["B_v = \\dfrac{\\mu_0 I}{2\\pi r}", "\\tan\\varphi = \\dfrac{B_v}{B_Z}"],
          [`$B_v = \\dfrac{2 \\cdot 10^{-7} \\cdot ${tx(I)}}{${tx(rcm / 100)}}\\ \\mathrm{T} ${res(Bw, 2, "\\mathrm{\\mu T}")}$`, `$\\tan\\varphi = \\dfrac{${tx(Bw, 2)}}{${BZ}} \\approx ${tx(Bw / BZ, 4)}$`, `$\\varphi ${resd(phi, 1)}$`],
        );
      }
      const I = r.int(2, 60);
      const B0 = r.pick([20, 30, 40, 50]);
      const rr = ((MU0 * I) / (2 * Math.PI * B0 * 1e-6)) * 100;
      return T(
        `Na kolikšni razdalji od ravnega vodnika, po katerem teče tok $${I}\\ \\mathrm{A}$, je gostota njegovega magnetnega polja enaka $${B0}\\ \\mathrm{\\mu T}$ (približno toliko kot zemeljsko polje)? ${mu} Rezultat zapiši v cm in zaokroži na eno decimalko.`,
        num(rr, "cm", 1, [M(rr / 100, "Rezultat pretvori v centimetre."), M(((MU0 * I) / (B0 * 1e-6)) * 100, "V imenovalcu je $2\\pi r$.")]),
        "Iz formule za polje ravnega vodnika izrazi razdaljo $r$.",
        [dat("I", I, "A"), dat("B", B0, "\\mathrm{\\mu T}"), K.mu0],
        ["r"],
        ["B = \\dfrac{\\mu_0 I}{2\\pi r}", "r = \\dfrac{\\mu_0 I}{2\\pi B}"],
        [`$r = \\dfrac{4\\pi \\cdot 10^{-7} \\cdot ${I}}{2\\pi \\cdot ${B0} \\cdot 10^{-6}}\\ \\mathrm{m} ${res(rr / 100, 4, "m")}$`, `$r ${res(rr, 1, "cm")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-magnetna-sila",
    topics: ["FIZ-SS-3/magnetna-sila"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const I = r.dec(0.5, 10, 1);
        const l = r.dec(0.1, 1, 2);
        const B = r.dec(0.05, 0.8, 2);
        const F = I * l * B;
        return T(
          `Raven vodnik dolžine $${qty(tx(l), "m")}$ leži pravokotno na silnice homogenega magnetnega polja z gostoto $${qty(tx(B), "T")}$. Po njem teče tok $${qty(tx(I), "A")}$. Kolikšna magnetna sila deluje nanj? Zaokroži na tri decimalke.`,
          num(F, "N", 3, [M((I * B) / l, "Sila je zmnožek toka, dolžine in gostote polja."), M((I * l) / B, "Sila je zmnožek toka, dolžine in gostote polja.")]),
          "Ko je vodnik pravokoten na silnice, je sila največja: $F = I l B$.",
          [dat("I", tx(I), "A"), dat("l", tx(l), "m"), dat("B", tx(B), "T")],
          ["F"],
          ["F = I l B"],
          [`$F = I l B = ${tx(I)}\\ \\mathrm{A} \\cdot ${tx(l)}\\ \\mathrm{m} \\cdot ${tx(B)}\\ \\mathrm{T}$`, `$F ${res(F, 3, "N")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const I = r.dec(1, 15, 1);
          const lcm = r.int(5, 60);
          const BmT = r.int(20, 500);
          const a = r.pick([20, 30, 40, 45, 50, 60, 70]);
          const F = I * (lcm / 100) * (BmT / 1000) * Math.sin(rad(a)) * 1000;
          return T(
            `Vodnik dolžine $${lcm}\\ \\mathrm{cm}$, po katerem teče tok $${qty(tx(I), "A")}$, oklepa s silnicami magnetnega polja ($${BmT}\\ \\mathrm{mT}$) kot $${a}^\\circ$. Kolikšna magnetna sila deluje nanj? Rezultat zapiši v mN in zaokroži na eno decimalko.`,
            num(F, "mN", 1, [M(F / Math.sin(rad(a)), "Vodnik ni pravokoten na silnice – pomnoži s $\\sin\\alpha$."), M((F / Math.sin(rad(a))) * Math.cos(rad(a)), "Pri sili na vodnik nastopa $\\sin\\alpha$ kota med vodnikom in silnicami.")]),
            "K sili prispeva le komponenta polja, pravokotna na vodnik. Dolžino pretvori v m in gostoto v T.",
            [dat("I", tx(I), "A"), dat("l", lcm, "cm"), dat("B", BmT, "mT"), `\\alpha = ${a}^\\circ`],
            ["F"],
            ["F = I l B \\sin\\alpha"],
            [`$l = ${qty(tx(lcm / 100), "m")},\\ B = ${qty(tx(BmT / 1000), "T")}$`, `$F = ${tx(I)} \\cdot ${tx(lcm / 100)} \\cdot ${tx(BmT / 1000)} \\cdot \\sin ${a}^\\circ\\ \\mathrm{N} ${res(F / 1000, 5, "N")}$`, `$F ${res(F, 1, "mN")}$`],
          );
        }
        const P = r.pick([
          { name: "Proton", m: MP, mt: K.mp, unit: "cm", f: 100, v: [100, 2000] },
          { name: "Elektron", m: ME, mt: K.me, unit: "mm", f: 1000, v: [1000, 20000] },
        ]);
        const vk = r.int(P.v[0] / 10, P.v[1] / 10) * 10;
        const BmT = r.int(5, 200);
        const rr = ((P.m * vk * 1000) / (E0 * BmT * 1e-3)) * P.f;
        return T(
          `${P.name} prileti s hitrostjo $${vk}\\ \\mathrm{km/s}$ pravokotno na silnice homogenega magnetnega polja z gostoto $${BmT}\\ \\mathrm{mT}$. Kolikšen je polmer krožnice, po kateri se giblje? Rezultat zapiši v ${P.unit} in zaokroži na dve decimalki.`,
          num(rr, P.unit, 2, [M(((P.m * vk) / (E0 * BmT * 1e-3)) * P.f, "Hitrost pretvori v m/s."), M(((P.m * vk * 1000) / (E0 * BmT)) * P.f, "Gostoto polja pretvori v tesle.")]),
          "Magnetna sila je centripetalna sila: $e_0 v B = \\dfrac{m v^2}{r}$.",
          [dat("v", vk, "km/s"), dat("B", BmT, "mT"), K.e0, P.mt],
          ["r"],
          ["e_0 v B = \\dfrac{m v^2}{r}", "r = \\dfrac{m v}{e_0 B}"],
          [`$v = ${qty(sci(vk * 1000, 2), "m/s")},\\ B = ${qty(tx(BmT / 1000), "T")}$`, `$r = \\dfrac{m v}{e_0 B} \\approx ${qty(sci(rr / P.f, 3), "m")}$`, `$r ${res(rr, 2, P.unit)}$`],
        );
      }
      const kind = r.pick(["spektrometer", "lebdenje", "frekvenca"]);
      if (kind === "spektrometer") {
        const U = r.int(1, 30) * 100;
        const BmT = r.int(20, 300);
        const v = Math.sqrt((2 * E0 * U) / MP);
        const rr = ((MP * v) / (E0 * BmT * 1e-3)) * 100;
        return T(
          `Proton, ki sprva miruje, pospešimo z napetostjo $${U}\\ \\mathrm{V}$, nato prileti pravokotno v magnetno polje z gostoto $${BmT}\\ \\mathrm{mT}$. Kolikšen je polmer njegove krožnice? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$, $m_p = 1{,}67 \\cdot 10^{-27}\\ \\mathrm{kg}$) Rezultat zapiši v cm in zaokroži na eno decimalko.`,
          num(rr, "cm", 1, [M(((MP * Math.sqrt((E0 * U) / MP)) / (E0 * BmT * 1e-3)) * 100, "Pri hitrosti iz $e_0 U = \\frac{m v^2}{2}$ si pozabil faktor 2."), M(rr / 100, "Rezultat pretvori v centimetre.")]),
          "Najprej z energijskim zakonom določi hitrost protona, nato iz ravnovesja magnetne in centripetalne sile polmer.",
          [dat("U", U, "V"), dat("B", BmT, "mT"), K.e0, K.mp],
          ["r"],
          ["e_0 U = \\dfrac{m v^2}{2}", "r = \\dfrac{m v}{e_0 B}"],
          [`$v = \\sqrt{\\dfrac{2 e_0 U}{m_p}} \\approx ${qty(sci(v, 3), "m/s")}$`, `$r = \\dfrac{m_p v}{e_0 B} ${res(rr / 100, 4, "m")}$`, `$r ${res(rr, 1, "cm")}$`],
        );
      }
      if (kind === "lebdenje") {
        const m = r.int(2, 30);
        const lcm = r.int(10, 50);
        const BmT = r.int(50, 500);
        const I = (m / 1000 * GZ) / ((lcm / 100) * (BmT / 1000));
        return T(
          `Vodoravna bakrena palica z maso $${m}\\ \\mathrm{g}$ in dolžino $${lcm}\\ \\mathrm{cm}$ visi na dveh lahkih prožnih vodnikih v vodoravnem magnetnem polju z gostoto $${BmT}\\ \\mathrm{mT}$, pravokotnem na palico. Kolikšen tok mora teči po palici, da vodnika nista napeta? Zaokroži na dve decimalki.`,
          num(I, "A", 2, [M((m / 1000) / ((lcm / 100) * (BmT / 1000)), "Magnetna sila mora uravnovesiti težo $mg$, ne mase."), M((m * GZ) / (lcm * BmT), "Pretvori maso v kg, dolžino v m in gostoto v T.")]),
          "Vodnika nista napeta, ko magnetna sila na palico uravnovesi njeno težo.",
          [dat("m", m, "g"), dat("l", lcm, "cm"), dat("B", BmT, "mT"), K.g],
          ["I"],
          ["I l B = m g", "I = \\dfrac{m g}{l B}"],
          [`$F_g = m g = ${tx(m / 1000)} \\cdot ${G_TEX}\\ \\mathrm{N} ${res((m / 1000) * GZ, 4, "N")}$`, `$I = \\dfrac{m g}{l B} = \\dfrac{${tx((m / 1000) * GZ, 4)}}{${tx(lcm / 100)} \\cdot ${tx(BmT / 1000)}}\\ \\mathrm{A} ${res(I, 2, "A")}$`],
        );
      }
      const B = r.dec(0.1, 2, 2);
      const f = (E0 * B) / (2 * Math.PI * ME) / 1e9;
      return T(
        `Elektron kroži v homogenem magnetnem polju z gostoto $${qty(tx(B), "T")}$ (pravokotno na silnice). Kolikokrat na sekundo obkroži krožnico? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$, $m_e = 9{,}11 \\cdot 10^{-31}\\ \\mathrm{kg}$) Rezultat zapiši v GHz in zaokroži na dve decimalki.`,
        num(f, "GHz", 2, [M((E0 * B) / ME / 1e9, "To je kotna hitrost $\\omega$; frekvenca je $\\omega / 2\\pi$."), M(((2 * Math.PI * ME) / (E0 * B)) * 1e9, "To je obhodni čas, ne frekvenca.")]),
        "Iz $r = \\dfrac{m v}{e_0 B}$ in $t_0 = \\dfrac{2\\pi r}{v}$ dobiš obhodni čas, ki ni odvisen od hitrosti.",
        [dat("B", tx(B), "T"), K.e0, K.me],
        ["\\nu"],
        ["t_0 = \\dfrac{2\\pi m}{e_0 B}", "\\nu = \\dfrac{1}{t_0} = \\dfrac{e_0 B}{2\\pi m}"],
        [`$t_0 = \\dfrac{2\\pi m_e}{e_0 B} \\approx ${qty(sci(1 / (f * 1e9), 3), "s")}$`, `$\\nu = \\dfrac{1}{t_0} \\approx ${qty(sci(f * 1e9, 3), "Hz")}$`, `$\\nu ${res(f, 2, "GHz")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-indukcija",
    topics: ["FIZ-SS-3/indukcija"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const B = r.dec(0.05, 1, 2);
        const l = r.dec(0.1, 1, 2);
        const v = r.dec(0.5, 10, 1);
        const U = B * l * v;
        const ctx = r.pick([`Kovinska palica dolžine $${qty(tx(l), "m")}$ drsi po vodoravnih tirnicah s hitrostjo $${qty(tx(v), "m/s")}$`, `${n} premika raven vodnik dolžine $${qty(tx(l), "m")}$ s hitrostjo $${qty(tx(v), "m/s")}$`]);
        return T(
          `${ctx} pravokotno na silnice magnetnega polja z gostoto $${qty(tx(B), "T")}$. Kolikšna napetost se inducira med njegovima koncema? Zaokroži na tri decimalke.`,
          num(U, "V", 3, [M((B * v) / l, "Inducirana napetost je zmnožek $B$, $l$ in $v$."), M((B * l) / v, "Inducirana napetost je zmnožek $B$, $l$ in $v$.")]),
          "Pri gibanju vodnika skozi magnetno polje se inducira napetost, sorazmerna z gostoto polja, dolžino in hitrostjo.",
          [dat("l", tx(l), "m"), dat("v", tx(v), "m/s"), dat("B", tx(B), "T")],
          ["U_i"],
          ["U_i = B l v"],
          [`$U_i = B l v = ${tx(B)}\\ \\mathrm{T} \\cdot ${tx(l)}\\ \\mathrm{m} \\cdot ${tx(v)}\\ \\mathrm{m/s}$`, `$U_i ${res(U, 3, "V")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["tuljava", "tuljava", "letalo", "lenz"]);
        if (kind === "lenz") {
          const S = r.pick([
            { mv: "se približuje", act: "S severnim polom magneta se približujemo aluminijastemu obroču, ki visi na nitki.", ok: "Obroč se odmakne od magneta (odbija ga).", opp: "Obroč se približa magnetu (privlači ga)." },
            { mv: "se oddaljuje", act: "Magnet, ki je bil s severnim polom tik ob aluminijastem obroču na nitki, hitro odmaknemo.", ok: "Obroč se premakne za magnetom (privlači ga).", opp: "Obroč se odmakne od magneta (odbija ga)." },
            { mv: "se približuje", act: "Z južnim polom magneta se hitro približujemo bakrenemu obroču, ki visi na nitki.", ok: "Obroč se odmakne od magneta (odbija ga).", opp: "Obroč se približa magnetu (privlači ga)." },
          ]);
          return {
            ...T(
              `${S.act} Kaj se zgodi z obročem?`,
              choice(r, S.ok, [
                [S.opp, "Inducirani tok po Lenzovem pravilu nasprotuje spremembi magnetnega pretoka, ki ga je povzročila – zato nasprotuje gibanju magneta."],
                ["Nič, ker aluminij oz. baker ni feromagneten.", "Obroč ni magnet, a je prevodnik: sprememba pretoka v njem inducira tok, ta pa ustvari magnetno polje."],
                ["Nič, dokler se magnet ne ustavi ob obroču.", "Tok se inducira med spreminjanjem pretoka, torej prav med gibanjem magneta."],
              ]),
              "Lenzovo pravilo: inducirani tok teče tako, da njegovo magnetno polje nasprotuje spremembi pretoka (in s tem gibanju, ki jo povzroča).",
              [`\\text{magnet} = \\text{${S.mv}}`],
              ["\\text{gibanje obroča}"],
              ["\\text{Lenzovo pravilo: inducirani tok nasprotuje spremembi } \\Phi_m"],
              ["Pretok skozi obroč se spreminja, zato se v obroču inducira tok.", "Po Lenzovem pravilu inducirani tok nasprotuje spremembi pretoka – obroč se »upira« gibanju magneta.", S.ok],
            ),
          };
        }
        if (kind === "letalo") {
          const l = r.int(20, 65);
          const vk = r.int(30, 95) * 10;
          const Bz = r.int(30, 50);
          const U = Bz * 1e-6 * l * (vk / 3.6) * 1000;
          return T(
            `Letalo z razponom kril $${l}\\ \\mathrm{m}$ leti vodoravno s hitrostjo $${vk}\\ \\mathrm{km/h}$. Navpična komponenta zemeljskega magnetnega polja je $${Bz}\\ \\mathrm{\\mu T}$. Kolikšna napetost se inducira med koncema kril? Rezultat zapiši v mV in zaokroži na celo število.`,
            num(U, "mV", 0, [M(Bz * 1e-6 * l * vk * 1000, "Hitrost pretvori v m/s."), M(U / 1000, "Rezultat pretvori v milivolte.")]),
            "Krila so vodnik, ki se giblje pravokotno na navpično komponento polja. Hitrost pretvori v m/s, gostoto v T.",
            [dat("l", l, "m"), dat("v", vk, "km/h"), dat("B_z", Bz, "\\mathrm{\\mu T}")],
            ["U_i"],
            ["U_i = B_z l v"],
            [`$v = ${vk}\\ \\mathrm{km/h} ${eq(vk / 3.6, 2)} ${qty(tx(vk / 3.6, 2), "m/s")}$`, `$U_i = ${Bz} \\cdot 10^{-6} \\cdot ${l} \\cdot ${tx(vk / 3.6, 2)}\\ \\mathrm{V} ${res(U / 1000, 4, "V")}$`, `$U_i ${res(U, 0, "mV")}$`],
          );
        }
        const N = r.int(1, 20) * 50;
        const S = r.int(5, 60);
        const B1 = r.int(0, 10) * 10;
        const B2 = B1 + r.int(5, 40) * 10;
        const tms = r.int(2, 50) * 10;
        const U = (N * S * 1e-4 * (B2 - B1) * 1e-3) / (tms / 1000);
        return T(
          `Tuljava z $${N}$ ovoji in presekom $${S}\\ \\mathrm{cm^2}$ je v magnetnem polju, vzporednem z njeno osjo. Gostota polja enakomerno naraste z $${B1}\\ \\mathrm{mT}$ na $${B2}\\ \\mathrm{mT}$ v $${tms}\\ \\mathrm{ms}$. Kolikšna napetost se inducira v tuljavi? Zaokroži na dve decimalki.`,
          num(U, "V", 2, [M(U / N, "Upoštevaj število ovojev."), M((N * S * 1e-4 * B2 * 1e-3) / (tms / 1000), "Inducirana napetost je odvisna od spremembe gostote polja, ne od končne vrednosti.")]),
          "Inducirana napetost je sorazmerna s hitrostjo spreminjanja magnetnega pretoka in s številom ovojev.",
          [`N = ${N}`, dat("S", S, "cm^2"), dat("B_1", B1, "mT"), dat("B_2", B2, "mT"), dat("\\Delta t", tms, "ms")],
          ["U_i"],
          ["\\Phi_m = B S", "U_i = N \\dfrac{\\Delta \\Phi_m}{\\Delta t}"],
          [`$\\Delta \\Phi_m = S \\Delta B = ${sci(S * 1e-4, 1)}\\ \\mathrm{m^2} \\cdot ${tx((B2 - B1) / 1000)}\\ \\mathrm{T} ${res(S * 1e-4 * (B2 - B1) * 1e-3, 7, "Vs")}$`, `$U_i = N \\dfrac{\\Delta \\Phi_m}{\\Delta t} = ${N} \\cdot \\dfrac{${tx(S * 1e-4 * (B2 - B1) * 1e-3, 7)}}{${tx(tms / 1000)}}\\ \\mathrm{V} ${res(U, 2, "V")}$`],
        );
      }
      if (r.next() < 0.5) {
        const B = r.dec(0.1, 1, 2);
        const lcm = r.int(10, 60);
        const v = r.dec(1, 8, 1);
        const R = r.dec(0.5, 10, 1);
        const U = B * (lcm / 100) * v;
        const I = U / R;
        const F = I * (lcm / 100) * B * 1000;
        return T(
          `Palica dolžine $${lcm}\\ \\mathrm{cm}$ drsi s stalno hitrostjo $${qty(tx(v), "m/s")}$ po tirnicah, ki sta na koncu povezani z uporom $${qty(tx(R), "\\Omega")}$. Polje z gostoto $${qty(tx(B), "T")}$ je pravokotno na ravnino tirnic. S kolikšno silo moramo vleči palico? Upor palice in tirnic ter trenje zanemari. Rezultat zapiši v mN in zaokroži na dve decimalki.`,
          num(F, "mN", 2, [M(I * 1000, "To je tok v amperih ×1000; sila je $F = I l B$."), M(U * 1000, "Inducirana napetost ni sila – izračunaj še tok in magnetno silo nanj.")]),
          "Inducirana napetost požene tok; na palico s tokom deluje magnetna sila, ki zavira gibanje. Pri stalni hitrosti jo mora uravnovesiti vlečna sila.",
          [dat("l", lcm, "cm"), dat("v", tx(v), "m/s"), dat("R", tx(R), "\\Omega"), dat("B", tx(B), "T")],
          ["F"],
          ["U_i = B l v", "I = \\dfrac{U_i}{R}", "F = I l B"],
          [`$U_i = ${tx(B)} \\cdot ${tx(lcm / 100)} \\cdot ${tx(v)}\\ \\mathrm{V} ${res(U, 4, "V")}$`, `$I = \\dfrac{U_i}{R} ${res(I, 4, "A")}$`, `$F = I l B ${res(F / 1000, 5, "N")} ${res(F, 2, "mN")}$`],
        );
      }
      const N = r.int(1, 20) * 10;
      const S = r.int(20, 400);
      const B = r.dec(0.05, 0.5, 2);
      const nn = r.int(5, 60) * 50;
      const w = (2 * Math.PI * nn) / 60;
      const U0 = N * B * S * 1e-4 * w;
      return T(
        `Generator ima tuljavo z $${N}$ ovoji in ploščino ovoja $${S}\\ \\mathrm{cm^2}$, ki se vrti v homogenem magnetnem polju $${qty(tx(B), "T")}$ s $${nn}$ obrati na minuto. Kolikšna je amplituda inducirane napetosti? Zaokroži na dve decimalki.`,
        num(U0, "V", 2, [M(N * B * S * 1e-4 * nn, "Kotno hitrost izračunaj iz frekvence: $\\omega = 2\\pi\\nu$, obrate pa pretvori na sekundo."), M(N * B * S * 1e-4 * (nn / 60), "Kotna hitrost je $2\\pi\\nu$, ne $\\nu$."), M(B * S * 1e-4 * w, "Upoštevaj število ovojev.")]),
        "Pri vrtenju se pretok spreminja sinusno; amplituda napetosti je $U_0 = N B S \\omega$. Obrate na minuto pretvori v kotno hitrost.",
        [`N = ${N}`, dat("S", S, "cm^2"), dat("B", tx(B), "T"), dat("\\nu", nn, "obr/min")],
        ["U_0"],
        ["\\omega = 2\\pi\\nu", "U_0 = N B S \\omega"],
        [`$\\nu = \\dfrac{${nn}}{60}\\ \\mathrm{s^{-1}} ${res(nn / 60, 3, "s^{-1}")},\\ \\omega = 2\\pi\\nu ${res(w, 2, "s^{-1}")}$`, `$S = ${qty(sci(S * 1e-4, 1), "m^2")}$`, `$U_0 = ${N} \\cdot ${tx(B)} \\cdot ${sci(S * 1e-4, 1)} \\cdot ${tx(w, 2)}\\ \\mathrm{V} ${res(U0, 2, "V")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-transformator",
    topics: ["FIZ-SS-3/indukcija"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const D = r.pick([
          { what: "polnilnik za telefon", N1: [1500, 3000], U2r: [5, 12] },
          { what: "transformator za zvonec", N1: [800, 2000], U2r: [6, 12] },
          { what: "transformator za halogensko svetilko", N1: [600, 1200], U2r: [12, 24] },
          { what: "varilni transformator", N1: [200, 500], U2r: [30, 60] },
        ]);
        const N1 = r.int(D.N1[0] / 10, D.N1[1] / 10) * 10;
        const N2 = Math.max(5, Math.round((N1 * r.int(D.U2r[0], D.U2r[1])) / 230));
        const U2 = (230 * N2) / N1;
        return T(
          `Idealni ${D.what} ima na primarni strani $${N1}$ ovojev, na sekundarni pa $${N2}$ ovojev. Priključen je na omrežno napetost $230\\ \\mathrm{V}$. Kolikšna je napetost na sekundarni strani? Zaokroži na eno decimalko.`,
          num(U2, "V", 1, [M((230 * N1) / N2, "Razmerje si obrnil: napetost na sekundarni strani je sorazmerna s številom njenih ovojev."), M((230 * N2) / N1 / 2, "Napetost na sekundarni strani je $U_1 N_2 / N_1$ – preveri račun.")]),
          "Pri idealnem transformatorju sta napetosti v enakem razmerju kot števili ovojev.",
          [dat("U_1", 230, "V"), `N_1 = ${N1}`, `N_2 = ${N2}`],
          ["U_2"],
          ["\\dfrac{U_2}{U_1} = \\dfrac{N_2}{N_1}"],
          [`$U_2 = U_1 \\cdot \\dfrac{N_2}{N_1} = 230\\ \\mathrm{V} \\cdot \\dfrac{${N2}}{${N1}}$`, `$U_2 ${res(U2, 1, "V")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const U2 = r.pick([6, 9, 12, 24, 48]);
          const P = r.int(2, 30) * 5;
          const I1 = P / 230;
          const I2 = P / U2;
          return T(
            `Idealni transformator zniža omrežno napetost $230\\ \\mathrm{V}$ na $${U2}\\ \\mathrm{V}$. Na sekundarno stran je priključen porabnik z močjo $${P}\\ \\mathrm{W}$. Kolikšen tok teče na primarni strani? Zaokroži na tri decimalke.`,
            num(I1, "A", 3, [M(I2, "To je tok na sekundarni strani; na primarni strani je tok manjši."), M((I2 * 230) / U2, "Toka sta v obratnem razmerju napetosti: $I_1 = I_2 U_2 / U_1$.")]),
            "Pri idealnem transformatorju je moč na primarni strani enaka moči na sekundarni strani.",
            [dat("U_1", 230, "V"), dat("U_2", U2, "V"), dat("P", P, "W")],
            ["I_1"],
            ["P_1 = P_2", "I_1 = \\dfrac{P}{U_1}"],
            [`$P_1 = P_2 = ${qty(P, "W")}$`, `$I_1 = \\dfrac{P}{U_1} = \\dfrac{${P}}{230}\\ \\mathrm{A} ${res(I1, 3, "A")}$`],
          );
        }
        const U1 = r.pick([230, 400, 110]);
        const U2 = r.pick([3, 5, 6, 9, 12, 18, 24, 36]);
        const k = r.int(2, 8);
        const N1 = U1 * k;
        const N2 = U2 * k;
        return T(
          `${n} navija transformator, ki naj napetost $${U1}\\ \\mathrm{V}$ zniža na $${U2}\\ \\mathrm{V}$. Primarna tuljava ima $${N1}$ ovojev. Koliko ovojev mora imeti sekundarna tuljava?`,
          num(N2, "", 0, [M((N1 * U1) / U2, "Za nižjo napetost potrebuješ manj ovojev – razmerje si obrnil.")]),
          "Napetosti sta v razmerju števil ovojev.",
          [dat("U_1", U1, "V"), dat("U_2", U2, "V"), `N_1 = ${N1}`],
          ["N_2"],
          ["\\dfrac{N_2}{N_1} = \\dfrac{U_2}{U_1}"],
          [`$N_2 = N_1 \\cdot \\dfrac{U_2}{U_1} = ${N1} \\cdot \\dfrac{${U2}}{${U1}}$`, `$N_2 = ${N2}$`],
        );
      }
      if (r.next() < 0.55) {
        const P = r.int(1, 20) * 100; // kW
        const R = r.dec(0.5, 8, 1);
        const U = r.pick([10, 20, 35, 110]); // kV
        const I = (P * 1e3) / (U * 1e3);
        const Pl = (I * I * R) / 1000;
        return T(
          `Elektrarna po daljnovodu z uporom $${qty(tx(R), "\\Omega")}$ prenaša moč $${P}\\ \\mathrm{kW}$ pri napetosti $${U}\\ \\mathrm{kV}$. Kolikšna moč se izgubi kot toplota v vodnikih? Rezultat zapiši v kW in zaokroži na dve decimalki.`,
          num(Pl, "kW", 2, [M((U * 1e3) ** 2 / R / 1000, "Napetost daljnovoda ni napetost na vodnikih – izračunaj tok $I = P/U$ in izgube $I^2 R$."), M((I * R) / 1000, "Izgubna moč je $I^2 R$, ne $I R$.")]),
          "Najprej izračunaj tok po daljnovodu, nato toplotne izgube v njegovem uporu.",
          [dat("P", P, "kW"), dat("U", U, "kV"), dat("R", tx(R), "\\Omega")],
          ["P_{izg}"],
          ["I = \\dfrac{P}{U}", "P_{izg} = I^2 R"],
          [`$I = \\dfrac{P}{U} = \\dfrac{${P * 1000}\\ \\mathrm{W}}{${U * 1000}\\ \\mathrm{V}} ${res(I, 2, "A")}$`, `$P_{izg} = I^2 R = (${tx(I, 2)})^2 \\cdot ${tx(R)}\\ \\mathrm{W} ${res(Pl * 1000, 1, "W")}$`, `$P_{izg} ${res(Pl, 2, "kW")}$`],
        );
      }
      const U2 = r.pick([12, 24, 48]);
      const I2 = r.dec(0.5, 8, 1);
      const eta = r.int(85, 97);
      const P2 = U2 * I2;
      const I1 = P2 / (eta / 100) / 230;
      return T(
        `Transformator z izkoristkom $${eta}\\ \\%$ je priključen na $230\\ \\mathrm{V}$. Na sekundarni strani daje napetost $${U2}\\ \\mathrm{V}$ in tok $${qty(tx(I2), "A")}$. Kolikšen tok teče na primarni strani? Zaokroži na tri decimalke.`,
        num(I1, "A", 3, [M(P2 / 230, "Upoštevaj izkoristek: na primarni strani transformator prejme več moči, kot je odda."), M((P2 * (eta / 100)) / 230, "Moč na sekundarni strani deli z izkoristkom, ne množi.")]),
        "Izračunaj moč na sekundarni strani, nato z izkoristkom moč na primarni strani in iz nje tok.",
        [dat("\\eta", eta, "\\%"), dat("U_1", 230, "V"), dat("U_2", U2, "V"), dat("I_2", tx(I2), "A")],
        ["I_1"],
        ["P_2 = U_2 I_2", "P_1 = \\dfrac{P_2}{\\eta}", "I_1 = \\dfrac{P_1}{U_1}"],
        [`$P_2 = ${U2} \\cdot ${tx(I2)}\\ \\mathrm{W} = ${qty(tx(P2), "W")}$`, `$P_1 = \\dfrac{${tx(P2)}}{${tx(eta / 100)}}\\ \\mathrm{W} ${res(P2 / (eta / 100), 2, "W")}$`, `$I_1 = \\dfrac{P_1}{U_1} ${res(I1, 3, "A")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-nihanje",
    topics: ["FIZ-SS-3/nihanje"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        if (r.next() < 0.5) {
          const l = r.dec(0.2, 3, 2);
          const T0 = 2 * Math.PI * Math.sqrt(l / GZ);
          const ctx = r.pick([`Utež na vrvici dolžine $${qty(tx(l), "m")}$`, `Gugalnica z vrvmi dolžine $${qty(tx(l), "m")}$`, `Nihalo stenske ure z dolžino $${qty(tx(l), "m")}$`]);
          return T(
            `${ctx} niha z majhnim odmikom. Kolikšen je nihajni čas? Zaokroži na dve decimalki.`,
            num(T0, "s", 2, [M(2 * Math.PI * Math.sqrt(GZ / l), "Pod korenom je $l/g$, ne $g/l$."), M(Math.sqrt(l / GZ), "Pozabil si na faktor $2\\pi$."), M(2 * Math.PI * (l / GZ), "Pozabil si koreniti.")]),
            "Nihajni čas matematičnega nihala je odvisen le od dolžine in težnega pospeška.",
            [dat("l", tx(l), "m"), K.g],
            ["t_0"],
            ["t_0 = 2\\pi\\sqrt{\\dfrac{l}{g}}"],
            [`$\\dfrac{l}{g} = \\dfrac{${tx(l)}}{${G_TEX}}\\ \\mathrm{s^2} \\approx ${tx(l / GZ, 4)}\\ \\mathrm{s^2}$`, `$t_0 = 2\\pi\\sqrt{${tx(l / GZ, 4)}}\\ \\mathrm{s} ${res(T0, 2, "s")}$`],
          );
        }
        const m = r.dec(0.1, 3, 1);
        const k = r.int(5, 200);
        const T0 = 2 * Math.PI * Math.sqrt(m / k);
        return T(
          `Utež z maso $${qty(tx(m), "kg")}$ niha na vzmeti s koeficientom $${k}\\ \\mathrm{N/m}$. Kolikšen je nihajni čas? Zaokroži na dve decimalki.`,
          num(T0, "s", 2, [M(2 * Math.PI * Math.sqrt(k / m), "Pod korenom je $m/k$, ne $k/m$."), M(Math.sqrt(m / k), "Pozabil si na faktor $2\\pi$.")]),
          "Nihajni čas nihala na vzmeti je odvisen od mase in koeficienta vzmeti.",
          [dat("m", tx(m), "kg"), dat("k", k, "N/m")],
          ["t_0"],
          ["t_0 = 2\\pi\\sqrt{\\dfrac{m}{k}}"],
          [`$\\dfrac{m}{k} = \\dfrac{${tx(m)}}{${k}}\\ \\mathrm{s^2} \\approx ${tx(m / k, 5)}\\ \\mathrm{s^2}$`, `$t_0 = 2\\pi\\sqrt{${tx(m / k, 5)}}\\ \\mathrm{s} ${res(T0, 2, "s")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["dolzina", "raztezek", "luna"]);
        if (kind === "dolzina") {
          const T0 = r.dec(0.8, 4, 1);
          const l = (GZ * T0 * T0) / (4 * Math.PI * Math.PI) * 100;
          return T(
            `Kako dolgo mora biti matematično nihalo, da je njegov nihajni čas $${qty(tx(T0), "s")}$? Rezultat zapiši v cm in zaokroži na eno decimalko.`,
            num(l, "cm", 1, [M((GZ * T0) / (4 * Math.PI * Math.PI) * 100, "Nihajni čas je treba kvadrirati."), M((GZ * T0 * T0) / (2 * Math.PI) * 100, "Ko kvadriraš $2\\pi$, dobiš $4\\pi^2$."), M(l / 100, "Rezultat pretvori v centimetre.")]),
            "Enačbo za nihajni čas kvadriraj in izrazi dolžino.",
            [dat("t_0", tx(T0), "s"), K.g],
            ["l"],
            ["t_0 = 2\\pi\\sqrt{\\dfrac{l}{g}}", "l = \\dfrac{g\\, t_0^2}{4\\pi^2}"],
            [`$l = \\dfrac{${G_TEX} \\cdot (${tx(T0)})^2}{4\\pi^2}\\ \\mathrm{m} ${res(l / 100, 4, "m")}$`, `$l ${res(l, 1, "cm")}$`],
          );
        }
        if (kind === "raztezek") {
          const m = r.int(50, 800);
          const x = r.dec(1, 15, 1);
          const k = (m / 1000) * GZ / (x / 100);
          const T0 = 2 * Math.PI * Math.sqrt(m / 1000 / k);
          return T(
            `Ko na vzmet obesimo utež z maso $${m}\\ \\mathrm{g}$, se vzmet raztegne za $${qty(tx(x), "cm")}$. Utež nato malo povlečemo navzdol in spustimo. Kolikšen je nihajni čas? Zaokroži na tri decimalke.`,
            num(T0, "s", 3, [M(2 * Math.PI * Math.sqrt(x / GZ), "Raztezek pretvori v metre."), M(2 * Math.PI * Math.sqrt(m / k), "Maso pretvori v kilograme.")]),
            "Iz ravnovesja teže in sile vzmeti najprej izračunaj koeficient vzmeti.",
            [dat("m", m, "g"), dat("x", tx(x), "cm"), K.g],
            ["t_0"],
            ["k x = m g", "t_0 = 2\\pi\\sqrt{\\dfrac{m}{k}}"],
            [`$k = \\dfrac{m g}{x} = \\dfrac{${tx(m / 1000)} \\cdot ${G_TEX}}{${tx(x / 100)}}\\ \\mathrm{N/m} ${res(k, 2, "N/m")}$`, `$t_0 = 2\\pi\\sqrt{\\dfrac{${tx(m / 1000)}}{${tx(k, 2)}}}\\ \\mathrm{s} ${res(T0, 3, "s")}$`],
          );
        }
        const lcm = r.int(20, 200);
        const P = r.pick([
          { name: "na Luni", g: 1.62, gt: "1{,}62" },
          { name: "na Marsu", g: 3.71, gt: "3{,}71" },
          { name: "na Jupitru", g: 24.8, gt: "24{,}8" },
        ]);
        const T0 = 2 * Math.PI * Math.sqrt(lcm / 100 / P.g);
        return T(
          `Kolikšen bi bil nihajni čas nihala z dolžino $${lcm}\\ \\mathrm{cm}$ ${P.name}, kjer je težni pospešek $${P.gt}\\ \\mathrm{m/s^2}$? Zaokroži na dve decimalki.`,
          num(T0, "s", 2, [M(2 * Math.PI * Math.sqrt(lcm / 100 / GZ), "Uporabi težni pospešek na drugem nebesnem telesu, ne na Zemlji."), M(2 * Math.PI * Math.sqrt(lcm / P.g), "Dolžino pretvori v metre.")]),
          "Dolžino pretvori v metre in uporabi formulo za matematično nihalo s pravim težnim pospeškom.",
          [dat("l", lcm, "cm"), dat("g", P.gt, "m/s^2")],
          ["t_0"],
          ["t_0 = 2\\pi\\sqrt{\\dfrac{l}{g}}"],
          [`$l = ${qty(tx(lcm / 100), "m")}$`, `$t_0 = 2\\pi\\sqrt{\\dfrac{${tx(lcm / 100)}}{${P.gt}}}\\ \\mathrm{s} ${res(T0, 2, "s")}$`],
        );
      }
      const kind = r.pick(["vzmet", "nihalo", "k"]);
      if (kind === "vzmet") {
        const k = r.int(10, 400);
        const m = r.dec(0.1, 2, 1);
        const x0 = r.int(2, 15);
        const v0 = (x0 / 100) * Math.sqrt(k / m);
        return T(
          `Utež z maso $${qty(tx(m), "kg")}$ niha na vzmeti s koeficientom $${k}\\ \\mathrm{N/m}$ z amplitudo $${x0}\\ \\mathrm{cm}$. Kolikšna je njena največja hitrost? Zaokroži na dve decimalki.`,
          num(v0, "m/s", 2, [M(x0 * Math.sqrt(k / m), "Amplitudo pretvori v metre."), M((x0 / 100) * Math.sqrt(m / k), "Pod korenom je $k/m$."), M((x0 / 100) * (k / m), "Pozabil si koreniti.")]),
          "V ravnovesni legi je vsa prožnostna energija pretvorjena v kinetično: $\\frac{k x_0^2}{2} = \\frac{m v_0^2}{2}$.",
          [dat("m", tx(m), "kg"), dat("k", k, "N/m"), dat("x_0", x0, "cm")],
          ["v_0"],
          ["\\dfrac{k x_0^2}{2} = \\dfrac{m v_0^2}{2}", "v_0 = x_0\\sqrt{\\dfrac{k}{m}}"],
          [`$W_{pr} = \\dfrac{k x_0^2}{2} = \\dfrac{${k} \\cdot (${tx(x0 / 100)})^2}{2}\\ \\mathrm{J} ${res((k * (x0 / 100) ** 2) / 2, 4, "J")}$`, `$v_0 = \\sqrt{\\dfrac{2 W_{pr}}{m}} ${res(v0, 2, "m/s")}$`],
        );
      }
      if (kind === "nihalo") {
        const l = r.dec(0.5, 3, 1);
        const a = r.pick([10, 15, 20, 25, 30, 40]);
        const h = l * (1 - Math.cos(rad(a)));
        const v = Math.sqrt(2 * GZ * h);
        const ctx = r.pick([`${n} odmakne nihalo z dolžino $${qty(tx(l), "m")}$`, `Otrok na gugalnici z vrvmi dolžine $${qty(tx(l), "m")}$ se odmakne`, `Utež na vrvici dolžine $${qty(tx(l), "m")}$ odmaknemo`]);
        return T(
          `${ctx} za kot $${a}^\\circ$ od navpičnice in spusti. Kolikšna je hitrost v najnižji točki? Zračni upor zanemari. Zaokroži na dve decimalki.`,
          num(v, "m/s", 2, [M(Math.sqrt(2 * GZ * l), "Telo se ne spusti za celo dolžino vrvice, ampak le za $h = l(1 - \\cos\\alpha)$."), M(Math.sqrt(2 * GZ * l * Math.cos(rad(a))), "Višinska razlika je $l(1 - \\cos\\alpha)$, ne $l\\cos\\alpha$."), M(Math.sqrt(GZ * h), "Iz $mgh = \\frac{mv^2}{2}$ sledi $v = \\sqrt{2gh}$.")]),
          "Najprej določi, za koliko se telo spusti (geometrija vrvice), nato uporabi ohranitev energije.",
          [dat("l", tx(l), "m"), `\\alpha = ${a}^\\circ`, K.g],
          ["v"],
          ["h = l(1 - \\cos\\alpha)", "m g h = \\dfrac{m v^2}{2}"],
          [`$h = ${tx(l)} \\cdot (1 - \\cos ${a}^\\circ)\\ \\mathrm{m} ${res(h, 4, "m")}$`, `$v = \\sqrt{2 g h} = \\sqrt{2 \\cdot ${G_TEX} \\cdot ${tx(h, 4)}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`],
        );
      }
      const m = r.int(100, 1500);
      const N = r.pick([10, 20, 25, 30, 50]);
      const tt = r.dec(N * 0.3, N * 1.5, 1);
      const T0 = tt / N;
      const k = (4 * Math.PI * Math.PI * (m / 1000)) / (T0 * T0);
      return T(
        `${n} na vzmet obesi utež z maso $${m}\\ \\mathrm{g}$ in s štoparico izmeri, da utež naredi $${N}$ nihajev v $${qty(tx(tt), "s")}$. Kolikšen je koeficient vzmeti? Zaokroži na eno decimalko.`,
        num(k, "N/m", 1, [M((4 * Math.PI * Math.PI * (m / 1000)) / (tt * tt), "Izmerjeni čas deli s številom nihajev, da dobiš nihajni čas."), M((4 * Math.PI * Math.PI * m) / (T0 * T0), "Maso pretvori v kilograme."), M((2 * Math.PI * (m / 1000)) / (T0 * T0), "Ko kvadriraš $2\\pi$, dobiš $4\\pi^2$.")]),
        "Najprej izračunaj nihajni čas enega nihaja, nato iz $t_0 = 2\\pi\\sqrt{m/k}$ izrazi $k$.",
        [dat("m", m, "g"), `N = ${N}`, dat("t", tx(tt), "s")],
        ["k"],
        ["t_0 = \\dfrac{t}{N}", "k = \\dfrac{4\\pi^2 m}{t_0^2}"],
        [`$t_0 = \\dfrac{${tx(tt)}\\ \\mathrm{s}}{${N}} ${res(T0, 4, "s")}$`, `$k = \\dfrac{4\\pi^2 \\cdot ${tx(m / 1000)}}{(${tx(T0, 4)})^2}\\ \\mathrm{N/m} ${res(k, 1, "N/m")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-valovanje",
    topics: ["FIZ-SS-3/valovanje"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        if (r.next() < 0.5) {
          const W = r.pick([
            { what: "Valovi na jezeru imajo", l: [0.5, 4], nu: [0.3, 2] },
            { what: "Valovanje na napeti vrvi ima", l: [0.2, 2], nu: [2, 20] },
            { what: "Valovi v valovni kadi imajo", l: [0.01, 0.05], nu: [5, 30], ld: 3 },
          ]);
          const l = r.dec(W.l[0], W.l[1], W.ld || 2);
          const nu = r.dec(W.nu[0], W.nu[1], 1);
          const c = l * nu;
          return T(
            `${W.what} valovno dolžino $${qty(tx(l), "m")}$ in frekvenco $${qty(tx(nu), "Hz")}$. Kolikšna je hitrost valovanja? Zaokroži na tri decimalke.`,
            num(c, "m/s", 3, [M(l / nu, "Hitrost je zmnožek valovne dolžine in frekvence."), M(nu / l, "Hitrost je zmnožek valovne dolžine in frekvence.")]),
            "V enem nihajnem času se valovanje premakne za eno valovno dolžino.",
            [dat("\\lambda", tx(l), "m"), dat("\\nu", tx(nu), "Hz")],
            ["c"],
            ["c = \\lambda \\nu"],
            [`$c = \\lambda\\nu = ${qty(tx(l), "m")} \\cdot ${qty(tx(nu), "Hz")}$`, `$c ${res(c, 3, "m/s")}$`],
          );
        }
        const f = r.dec(87.5, 108, 1);
        const l = C / (f * 1e6);
        const st = r.pick(["Radijska postaja oddaja", "Lokalni radio oddaja", "Radio Študent oddaja", "Vala 202 oddaja"]);
        return T(
          `${st} na frekvenci $${qty(tx(f), "MHz")}$. Kolikšna je valovna dolžina radijskih valov? ($c = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s}$) Zaokroži na tri decimalke.`,
          num(l, "m", 3, [M(C / f, "Frekvenco pretvori v hertze ($1\\ \\mathrm{MHz} = 10^6\\ \\mathrm{Hz}$)."), M((f * 1e6) / C, "Valovna dolžina je $c/\\nu$, ne $\\nu/c$.")]),
          "Iz $c = \\lambda\\nu$ izrazi valovno dolžino; frekvenco pretvori v Hz.",
          [dat("\\nu", tx(f), "MHz"), K.c],
          ["\\lambda"],
          ["\\lambda = \\dfrac{c}{\\nu}"],
          [`$\\nu = ${qty(tx(f), "MHz")} = ${qty(sci(f * 1e6, 3), "Hz")}$`, `$\\lambda = \\dfrac{3{,}00 \\cdot 10^8}{${sci(f * 1e6, 3)}}\\ \\mathrm{m} ${res(l, 3, "m")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const d = r.dec(0.3, 3, 1);
          const N = r.int(4, 15);
          const t = r.int(10, 60);
          const crest = r.next() < 0.5;
          const l = crest ? d : 2 * d;
          const c = (l * N) / t;
          return T(
            `${n} na pomolu opazuje valove: razdalja med ${crest ? "sosednjima grebenoma" : "grebenom in sosednjo dolino"} je $${qty(tx(d), "m")}$, mimo stebra pa v $${t}\\ \\mathrm{s}$ pride $${N}$ grebenov. Kolikšna je hitrost valov? Zaokroži na dve decimalki.`,
            num(c, "m/s", 2, crest ? [M((d * t) / N, "Frekvenca je število valov na časovno enoto: $\\nu = N/t$."), M((d / 2) * (N / t), "Razdalja med sosednjima grebenoma je cela valovna dolžina.")] : [M((d * N) / t, "Razdalja med grebenom in dolino je polovica valovne dolžine."), M((2 * d * t) / N, "Frekvenca je $\\nu = N/t$.")]),
            "Iz opisa najprej določi valovno dolžino in frekvenco, nato hitrost.",
            [dat(crest ? "d_{greben-greben}" : "d_{greben-dolina}", tx(d), "m"), `N = ${N}`, dat("t", t, "s")],
            ["c"],
            [crest ? "\\lambda = d" : "\\lambda = 2d", "\\nu = \\dfrac{N}{t}", "c = \\lambda\\nu"],
            [`$\\lambda = ${crest ? "" : "2 \\cdot "}${qty(tx(d), "m")}${crest ? "" : ` = ${qty(tx(l), "m")}`}$`, `$\\nu = \\dfrac{${N}}{${t}\\ \\mathrm{s}} ${res(N / t, 3, "Hz")}$`, `$c = \\lambda\\nu ${res(c, 2, "m/s")}$`],
          );
        }
        const L = r.dec(0.3, 1.5, 2);
        const k = r.int(1, 5);
        const c = r.int(50, 400);
        const l = (2 * L) / k;
        const nu = c / l;
        return T(
          `Struna dolžine $${qty(tx(L), "m")}$ je vpeta na obeh koncih. Na njej nastane stoječe valovanje s $${k}$ ${k === 1 ? "hrbtom" : "hrbti"}. Hitrost valovanja na struni je $${c}\\ \\mathrm{m/s}$. Kolikšna je frekvenca nihanja? Zaokroži na eno decimalko.`,
          num(nu, "Hz", 1, [M((c * k) / L, "Med sosednjima vozloma je polovica valovne dolžine, zato je $\\lambda = 2L/k$."), M((c * k) / (4 * L), "Na struni, vpeti na obeh koncih, je $L = k\\lambda/2$.")]),
          "Med sosednjima vozloma je pol valovne dolžine. Najprej izrazi $\\lambda$ z dolžino strune.",
          [dat("L", tx(L), "m"), `k = ${k}`, dat("c", c, "m/s")],
          ["\\nu"],
          ["L = k\\dfrac{\\lambda}{2}", "\\nu = \\dfrac{c}{\\lambda}"],
          [`$\\lambda = \\dfrac{2L}{k} = \\dfrac{2 \\cdot ${tx(L)}}{${k}}\\ \\mathrm{m} ${res(l, 4, "m")}$`, `$\\nu = \\dfrac{c}{\\lambda} ${res(nu, 1, "Hz")}$`],
        );
      }
      const kind = r.pick(["interferenca", "harmoniki", "minimum"]);
      if (kind === "interferenca") {
        const nu = r.pick([170, 340, 425, 680, 850]);
        const l = C_ZVOK / nu;
        const k = r.int(1, 6);
        const ds = (k * l) / 2;
        const s1 = r.dec(2, 6, 1);
        const s2 = s1 + ds;
        const max = k % 2 === 0;
        return {
          ...T(
            `Zvočnika, ki nihata v fazi s frekvenco $${nu}\\ \\mathrm{Hz}$, sta od poslušalca oddaljena $${qty(tx(s1), "m")}$ in $${qty(tx(s2), "m")}$. Hitrost zvoka je $340\\ \\mathrm{m/s}$. Kaj sliši poslušalec na tem mestu?`,
            choice(r, max ? "Glasen zvok – valovanji se ojačita." : "Tih zvok – valovanji se oslabita (izničita).", [
              [max ? "Tih zvok – valovanji se oslabita (izničita)." : "Glasen zvok – valovanji se ojačita.", max ? "Razlika poti je celo število valovnih dolžin, zato valovanji prideta v fazi." : "Razlika poti je liho število polovic valovne dolžine, zato valovanji prideta v protifazi."],
              ["Vedno glasen zvok, ker zvočnika nihata v fazi.", "Fazna razlika na mestu poslušalca je odvisna tudi od razlike poti."],
              ["Ni mogoče določiti brez razdalje med zvočnikoma.", "Za ojačitev ali oslabitev zadošča razlika poti v primerjavi z valovno dolžino."],
            ]),
            "Izračunaj valovno dolžino in jo primerjaj z razliko poti.",
            [dat("\\nu", nu, "Hz"), dat("s_1", tx(s1), "m"), dat("s_2", tx(s2), "m"), dat("c", 340, "m/s")],
            ["\\Delta s / \\lambda"],
            ["\\lambda = \\dfrac{c}{\\nu}", "\\Delta s = N\\lambda \\Rightarrow \\text{ojačitev},\\ \\Delta s = (N + \\tfrac12)\\lambda \\Rightarrow \\text{oslabitev}"],
            [`$\\lambda = \\dfrac{340}{${nu}}\\ \\mathrm{m} = ${qty(tx(l), "m")}$`, `$\\Delta s = ${tx(s2)} - ${tx(s1)}\\ \\mathrm{m} = ${qty(tx(ds), "m")} = ${tx(k / 2)}\\,\\lambda$`, max ? "Razlika poti je celo število valovnih dolžin: ojačitev." : "Razlika poti je liho število polovic valovne dolžine: oslabitev."],
          ),
        };
      }
      if (kind === "harmoniki") {
        const L = r.dec(0.4, 1.2, 2);
        const f1 = r.int(60, 400);
        const k = r.int(2, 6);
        const fa = k * f1;
        const fb = (k + 1) * f1;
        const c = 2 * L * f1;
        return T(
          `Na struni dolžine $${qty(tx(L), "m")}$, vpeti na obeh koncih, ${n} ${g(n, "opazi", "opazi")} stoječe valovanje pri frekvencah $${fa}\\ \\mathrm{Hz}$ in $${fb}\\ \\mathrm{Hz}$, vmes pa nobenega. Kolikšna je hitrost valovanja na struni? Zaokroži na eno decimalko.`,
          num(c, "m/s", 1, [M(2 * L * fa, "Frekvenca $" + fa + "\\ \\mathrm{Hz}$ ni osnovna; osnovna frekvenca je razlika sosednjih lastnih frekvenc."), M(L * f1, "Pri osnovni frekvenci je dolžina strune pol valovne dolžine: $\\lambda_1 = 2L$.")]),
          "Lastne frekvence strune so večkratniki osnovne frekvence. Razlika sosednjih je enaka osnovni frekvenci.",
          [dat("L", tx(L), "m"), dat("\\nu_k", fa, "Hz"), dat("\\nu_{k+1}", fb, "Hz")],
          ["c"],
          ["\\nu_k = k\\nu_1", "\\lambda_1 = 2L", "c = \\lambda_1 \\nu_1"],
          [`$\\nu_1 = \\nu_{k+1} - \\nu_k = ${fb} - ${fa}\\ \\mathrm{Hz} = ${qty(f1, "Hz")}$`, `$\\lambda_1 = 2L = ${qty(tx(2 * L), "m")}$`, `$c = \\lambda_1 \\nu_1 ${res(c, 1, "m/s")}$`],
        );
      }
      const ds = r.dec(0.2, 2, 2);
      const nu = C_ZVOK / (2 * ds);
      return T(
        `Zvočnika nihata v fazi z enako frekvenco. Mikrofon je od enega oddaljen $${qty(tx(ds), "m")}$ več kot od drugega. Pri kateri najnižji frekvenci mikrofon zazna oslabitev (minimum)? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Zaokroži na celo število.`,
        num(nu, "Hz", 0, [M(C_ZVOK / ds, "Pri tej frekvenci je razlika poti cela valovna dolžina – to je ojačitev."), M(C_ZVOK / (4 * ds), "Za prvi minimum mora biti razlika poti pol valovne dolžine: $\\lambda = 2\\Delta s$.")]),
        "Prvi minimum nastane, ko je razlika poti enaka polovici valovne dolžine.",
        [dat("\\Delta s", tx(ds), "m"), dat("c", 340, "m/s")],
        ["\\nu_{min}"],
        ["\\Delta s = \\dfrac{\\lambda}{2}", "\\nu = \\dfrac{c}{\\lambda}"],
        [`$\\lambda = 2\\Delta s = ${qty(tx(2 * ds), "m")}$`, `$\\nu = \\dfrac{c}{\\lambda} = \\dfrac{340}{${tx(2 * ds)}}\\ \\mathrm{Hz} ${res(nu, 0, "Hz")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-zvok-jakost",
    topics: ["FIZ-SS-3/zvok"],
    gen(level, r) {
      const n = ime(r);
      const j0 = "j_0 = 10^{-12}\\ \\mathrm{W/m^2}";
      if (level === 1) {
        if (r.next() < 0.5) {
          const P = r.pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2]);
          const rr = r.dec(1, 10, 1);
          const j = (P / (4 * Math.PI * rr * rr)) * 1000;
          const src = r.pick(["Zvočnik", "Sirena", "Glasbena skrinjica", "Budilka"]);
          return T(
            `${src} enakomerno v vse smeri oddaja zvočno moč $${qty(tx(P), "W")}$. Kolikšna je jakost zvoka na razdalji $${qty(tx(rr), "m")}$? Rezultat zapiši v mW/m² in zaokroži na tri decimalke.`,
            num(j, "mW/m²", 3, [M((P / (4 * Math.PI * rr)) * 1000, "Ploščina krogle je $4\\pi r^2$ – razdaljo kvadriraj."), M((P / (Math.PI * rr * rr)) * 1000, "Zvok se razširja po površini krogle $4\\pi r^2$, ne kroga.")]),
            "Moč se enakomerno porazdeli po površini krogle s polmerom $r$.",
            [dat("P", tx(P), "W"), dat("r", tx(rr), "m")],
            ["j"],
            ["j = \\dfrac{P}{4\\pi r^2}"],
            [`$S = 4\\pi r^2 = 4\\pi \\cdot (${tx(rr)})^2\\ \\mathrm{m^2} ${res(4 * Math.PI * rr * rr, 2, "m^2")}$`, `$j = \\dfrac{P}{S} ${res(j / 1000, 6, "W/m^2")} ${res(j, 3, "mW/m^2")}$`],
          );
        }
        const mant = r.dec(1.1, 9.9, 1);
        const e = r.int(-10, -3);
        const j = mant * 10 ** e;
        const L = 10 * Math.log10(j / 1e-12);
        const what = r.pick(["Šepet", "Pogovor", "Promet na cesti", "Sesalnik", "Šolski zvonec", "Koncert"]);
        return T(
          `${what}: jakost zvoka je $${tx(mant)} \\cdot 10^{${e}}\\ \\mathrm{W/m^2}$. Kolikšna je raven jakosti zvoka v decibelih? ($${j0}$) Zaokroži na eno decimalko.`,
          num(L, "dB", 1, [M(Math.log10(j / 1e-12), "Raven v decibelih je desetkratnik logaritma: $L = 10 \\log(j/j_0)$."), M(10 * Math.log10(j), "Jakost deli s pragom slišnosti $j_0$.")]),
          "Raven jakosti je desetkratnik desetiškega logaritma razmerja $j/j_0$.",
          [`j = ${tx(mant)} \\cdot 10^{${e}}\\ \\mathrm{W/m^2}`, j0],
          ["L"],
          ["L = 10 \\log\\dfrac{j}{j_0}\\ \\mathrm{dB}"],
          [`$\\dfrac{j}{j_0} = ${tx(mant)} \\cdot 10^{${e + 12}}$`, `$L = 10 \\log(${tx(mant)} \\cdot 10^{${e + 12}})\\ \\mathrm{dB} ${res(L, 1, "dB")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["moc", "vec", "razdalja"]);
        if (kind === "moc") {
          const P = r.pick([0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]);
          const rr = r.int(2, 50);
          const j = P / (4 * Math.PI * rr * rr);
          const L = 10 * Math.log10(j / 1e-12);
          return T(
            `Zvočnik oddaja enakomerno v vse smeri zvočno moč $${qty(tx(P), "W")}$. Kolikšna je raven jakosti zvoka $${rr}\\ \\mathrm{m}$ od njega? ($${j0}$) Zaokroži na eno decimalko.`,
            num(L, "dB", 1, [M(10 * Math.log10(P / (4 * Math.PI * rr) / 1e-12), "Razdaljo je treba kvadrirati."), M(10 * Math.log10(P / 1e-12), "Najprej izračunaj jakost na dani razdalji.")]),
            "Najprej izračunaj jakost zvoka na tej razdalji, nato raven v decibelih.",
            [dat("P", tx(P), "W"), dat("r", rr, "m"), j0],
            ["L"],
            ["j = \\dfrac{P}{4\\pi r^2}", "L = 10 \\log\\dfrac{j}{j_0}\\ \\mathrm{dB}"],
            [`$j = \\dfrac{${tx(P)}}{4\\pi \\cdot ${rr}^2}\\ \\mathrm{W/m^2} \\approx ${qty(sci(j, 3), "W/m^2")}$`, `$L = 10 \\log\\dfrac{${sci(j, 3)}}{10^{-12}}\\ \\mathrm{dB} ${res(L, 1, "dB")}$`],
          );
        }
        if (kind === "vec") {
          const L1 = r.int(40, 80);
          const N = r.pick([2, 3, 4, 5, 8, 10, 20]);
          const what = r.pick(["sesalnik", "kosilnica", "ventilator", "fen", "mešalnik"]);
          const L = L1 + 10 * Math.log10(N);
          return T(
            `En ${what} povzroči na nekem mestu raven jakosti zvoka $${L1}\\ \\mathrm{dB}$. Kolikšna je raven, ko hkrati deluje $${N}$ enakih naprav (vse na enaki razdalji)? Zaokroži na eno decimalko.`,
            num(L, "dB", 1, [M(N * L1, "Ravni v decibelih se ne seštevajo; seštevajo se jakosti."), M(L1 + 20 * Math.log10(N), "Jakosti se seštejejo, zato se raven poveča za $10 \\log N$, ne $20 \\log N$.")]),
            "Seštejejo se jakosti (v W/m²), ne ravni v dB. Pri $N$-kratni jakosti se raven poveča za $10\\log N$.",
            [dat("L_1", L1, "dB"), `N = ${N}`],
            ["L"],
            ["j = N j_1", "L = L_1 + 10\\log N\\ \\mathrm{dB}"],
            [`$j = ${N}\\, j_1$`, `$L = L_1 + 10 \\log ${N}\\ \\mathrm{dB} = ${L1} + ${tx(10 * Math.log10(N), 2)}\\ \\mathrm{dB} ${res(L, 1, "dB")}$`],
          );
        }
        const L1 = r.int(60, 110);
        const r1 = r.int(1, 10);
        const r2 = r1 * r.pick([2, 3, 4, 5, 10]) + r.int(0, 3);
        const L2 = L1 - 20 * Math.log10(r2 / r1);
        return T(
          `Na razdalji $${r1}\\ \\mathrm{m}$ od točkastega izvora ${n} izmeri raven jakosti zvoka $${L1}\\ \\mathrm{dB}$. Kolikšna je raven na razdalji $${r2}\\ \\mathrm{m}$? Zaokroži na eno decimalko.`,
          num(L2, "dB", 1, [M(L1 - 10 * Math.log10(r2 / r1), "Jakost pada s kvadratom razdalje, zato je sprememba $20\\log(r_2/r_1)$."), M((L1 * r1) / r2, "Raven v dB ni obratno sorazmerna z razdaljo.")]),
          "Jakost je obratno sorazmerna s kvadratom razdalje. Zapiši razmerje jakosti in ga pretvori v razliko ravni.",
          [dat("r_1", r1, "m"), dat("L_1", L1, "dB"), dat("r_2", r2, "m")],
          ["L_2"],
          ["\\dfrac{j_2}{j_1} = \\left(\\dfrac{r_1}{r_2}\\right)^2", "L_2 = L_1 - 20 \\log\\dfrac{r_2}{r_1}\\ \\mathrm{dB}"],
          [`$\\dfrac{j_2}{j_1} = \\left(\\dfrac{${r1}}{${r2}}\\right)^2 \\approx ${tx((r1 / r2) ** 2, 4)}$`, `$L_2 = ${L1} - 20 \\log\\dfrac{${r2}}{${r1}}\\ \\mathrm{dB} ${res(L2, 1, "dB")}$`],
        );
      }
      if (r.next() < 0.5) {
        const P = r.pick([0.01, 0.05, 0.1, 0.5, 1, 2, 5]);
        const L = r.int(50, 90);
        const j = 1e-12 * 10 ** (L / 10);
        const rr = Math.sqrt(P / (4 * Math.PI * j));
        return T(
          `Sirena oddaja enakomerno v vse smeri zvočno moč $${qty(tx(P), "W")}$. Najmanj kako daleč od nje mora stati ${n}, da raven jakosti zvoka ne preseže $${L}\\ \\mathrm{dB}$? ($${j0}$) Zaokroži na eno decimalko.`,
          num(rr, "m", 1, [M(P / (4 * Math.PI * j), "Iz $j = P/(4\\pi r^2)$ moraš na koncu koreniti.")]),
          "Iz ravni v dB najprej izračunaj jakost, nato iz $j = P/(4\\pi r^2)$ razdaljo.",
          [dat("P", tx(P), "W"), dat("L", L, "dB"), j0],
          ["r"],
          ["j = j_0 \\cdot 10^{L/10}", "r = \\sqrt{\\dfrac{P}{4\\pi j}}"],
          [`$j = 10^{-12} \\cdot 10^{${tx(L / 10)}}\\ \\mathrm{W/m^2} \\approx ${qty(sci(j, 3), "W/m^2")}$`, `$r = \\sqrt{\\dfrac{${tx(P)}}{4\\pi \\cdot ${sci(j, 3)}}}\\ \\mathrm{m} ${res(rr, 1, "m")}$`],
        );
      }
      const L1 = r.int(50, 90);
      let L2 = r.int(50, 90);
      if (L2 === L1) L2 += 3;
      const L = 10 * Math.log10(10 ** (L1 / 10) + 10 ** (L2 / 10));
      const a = r.pick(["kosilnica", "motorno kolo", "radio"]);
      const b = r.pick(["pes, ki laja", "sosedov kompresor", "glasba iz avta"]);
      return T(
        `Ko deluje le ${a}, je raven jakosti zvoka $${L1}\\ \\mathrm{dB}$, ko je slišen le ${b}, pa $${L2}\\ \\mathrm{dB}$. Kolikšna je raven, ko sta slišna oba hkrati? Zaokroži na eno decimalko.`,
        num(L, "dB", 1, [M(L1 + L2, "Ravni v decibelih se ne seštevajo; seštej jakosti."), M((L1 + L2) / 2, "Ravni se ne povprečijo – seštej jakosti."), M(Math.max(L1, L2) + 3, "Pribitek 3 dB velja le za enako glasna izvora.")]),
        "Pretvori obe ravni v jakosti, ju seštej in vsoto pretvori nazaj v decibele.",
        [dat("L_1", L1, "dB"), dat("L_2", L2, "dB")],
        ["L"],
        ["\\dfrac{j}{j_0} = 10^{L/10}", "L = 10\\log\\dfrac{j_1 + j_2}{j_0}\\ \\mathrm{dB}"],
        [`$\\dfrac{j_1}{j_0} = 10^{${tx(L1 / 10)}},\\quad \\dfrac{j_2}{j_0} = 10^{${tx(L2 / 10)}}$`, `$\\dfrac{j_1 + j_2}{j_0} \\approx ${sci(10 ** (L1 / 10) + 10 ** (L2 / 10), 3)}$`, `$L = 10 \\log(${sci(10 ** (L1 / 10) + 10 ** (L2 / 10), 3)})\\ \\mathrm{dB} ${res(L, 1, "dB")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-doppler",
    topics: ["FIZ-SS-3/zvok"],
    gen(level, r) {
      const n = ime(r);
      const S = r.pick([
        { what: "Reševalno vozilo", sound: "sirena" },
        { what: "Policijski avto", sound: "sirena" },
        { what: "Vlak", sound: "piščal" },
        { what: "Gasilsko vozilo", sound: "sirena" },
        { what: "Motorist", sound: "hupa" },
      ]);
      const nu = r.int(30, 120) * 10;
      const cz = K.cz;
      if (level === 1) {
        const v = r.int(10, 40);
        const toward = r.next() < 0.5;
        const nup = toward ? nu / (1 - v / C_ZVOK) : nu / (1 + v / C_ZVOK);
        return T(
          `${S.what} se s hitrostjo $${v}\\ \\mathrm{m/s}$ ${toward ? "približuje" : "oddaljuje od"} opazovalcu, ki stoji ob cesti. Njegova ${S.sound} oddaja zvok s frekvenco $${nu}\\ \\mathrm{Hz}$. Kolikšno frekvenco sliši opazovalec? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Zaokroži na celo število.`,
          num(nup, "Hz", 0, [M(toward ? nu / (1 + v / C_ZVOK) : nu / (1 - v / C_ZVOK), toward ? "Ko se izvor približuje, sliši opazovalec višjo frekvenco." : "Ko se izvor oddaljuje, sliši opazovalec nižjo frekvenco."), M(toward ? nu * (1 + v / C_ZVOK) : nu * (1 - v / C_ZVOK), "To je formula za gibajočega se opazovalca; tu se giblje izvor.")]),
          "Giblje se izvor, opazovalec miruje. Pri približevanju se valovne dolžine skrajšajo, frekvenca naraste.",
          [dat("\\nu", nu, "Hz"), dat("v", v, "m/s"), cz],
          ["\\nu'"],
          [toward ? "\\nu' = \\dfrac{\\nu}{1 - v/c}" : "\\nu' = \\dfrac{\\nu}{1 + v/c}"],
          [`$\\dfrac{v}{c} = \\dfrac{${v}}{340} \\approx ${tx(v / C_ZVOK, 4)}$`, `$\\nu' = \\dfrac{${nu}}{1 ${toward ? "-" : "+"} ${tx(v / C_ZVOK, 4)}}\\ \\mathrm{Hz} ${res(nup, 0, "Hz")}$`],
        );
      }
      if (level === 2) {
        const vk = r.int(36, 150);
        const v = vk / 3.6;
        if (r.next() < 0.5) {
          const toward = r.next() < 0.5;
          const nup = toward ? nu / (1 - v / C_ZVOK) : nu / (1 + v / C_ZVOK);
          return T(
            `${S.what} vozi s hitrostjo $${vk}\\ \\mathrm{km/h}$ in ${toward ? "se približuje" : "se že oddaljuje od"} križišča, kjer stoji ${n}. ${S.sound[0].toUpperCase() + S.sound.slice(1)} oddaja $${nu}\\ \\mathrm{Hz}$. Kolikšno frekvenco sliši ${n}? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Zaokroži na celo število.`,
            num(nup, "Hz", 0, [M(toward ? nu / (1 - vk / C_ZVOK) : nu / (1 + vk / C_ZVOK), "Hitrost pretvori v m/s."), M(toward ? nu / (1 + v / C_ZVOK) : nu / (1 - v / C_ZVOK), "Preveri predznak: pri približevanju je frekvenca višja, pri oddaljevanju nižja.")]),
            "Hitrost izvora pretvori v m/s, nato uporabi Dopplerjevo formulo za gibajoči se izvor.",
            [dat("v", vk, "km/h"), dat("\\nu", nu, "Hz"), cz],
            ["\\nu'"],
            [toward ? "\\nu' = \\dfrac{\\nu}{1 - v/c}" : "\\nu' = \\dfrac{\\nu}{1 + v/c}"],
            [`$v = ${vk}\\ \\mathrm{km/h} ${eq(v, 2)} ${qty(tx(v, 2), "m/s")}$`, `$\\nu' = \\dfrac{${nu}}{1 ${toward ? "-" : "+"} ${tx(v, 2)}/340}\\ \\mathrm{Hz} ${res(nup, 0, "Hz")}$`],
          );
        }
        const toward = r.next() < 0.5;
        const nup = nu * (1 + ((toward ? 1 : -1) * v) / C_ZVOK);
        return T(
          `${n} se pelje z avtom s hitrostjo $${vk}\\ \\mathrm{km/h}$ ${toward ? "proti mirujočemu" : "stran od mirujočega"} zvonika, katerega zvon zveni s frekvenco $${nu}\\ \\mathrm{Hz}$. Kolikšno frekvenco sliši ${n}? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Zaokroži na celo število.`,
          num(nup, "Hz", 0, [M(toward ? nu / (1 - v / C_ZVOK) : nu / (1 + v / C_ZVOK), "To je formula za gibajoči se izvor; tu se giblje opazovalec."), M(nu * (1 + ((toward ? 1 : -1) * vk) / C_ZVOK), "Hitrost pretvori v m/s.")]),
          "Giblje se opazovalec, izvor miruje. Opazovalec v sekundi sreča več (ali manj) valov.",
          [dat("v", vk, "km/h"), dat("\\nu", nu, "Hz"), cz],
          ["\\nu'"],
          [toward ? "\\nu' = \\nu\\left(1 + \\dfrac{v}{c}\\right)" : "\\nu' = \\nu\\left(1 - \\dfrac{v}{c}\\right)"],
          [`$v = ${vk}\\ \\mathrm{km/h} ${eq(v, 2)} ${qty(tx(v, 2), "m/s")}$`, `$\\nu' = ${nu} \\cdot \\left(1 ${toward ? "+" : "-"} \\dfrac{${tx(v, 2)}}{340}\\right)\\ \\mathrm{Hz} ${res(nup, 0, "Hz")}$`],
        );
      }
      const kind = r.pick(["hitrost", "razlika", "odboj"]);
      if (kind === "hitrost") {
        const v = r.int(8, 40);
        const n1 = Math.round(nu / (1 - v / C_ZVOK));
        const n2 = Math.round(nu / (1 + v / C_ZVOK));
        const vv = (C_ZVOK * (n1 - n2)) / (n1 + n2);
        return T(
          `Ko se ${S.what.toLowerCase()} približuje, ${n} sliši frekvenco $${n1}\\ \\mathrm{Hz}$, ko se oddaljuje, pa $${n2}\\ \\mathrm{Hz}$. S kolikšno hitrostjo vozi? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Rezultat zapiši v km/h in zaokroži na celo število.`,
          num(vv * 3.6, "km/h", 0, [M(vv, "Rezultat pretvori v km/h."), M(((C_ZVOK * (n1 - n2)) / n1) * 3.6, "Zapiši obe Dopplerjevi enačbi in ju deli – oddane frekvence ne poznaš.")]),
          "Zapiši Dopplerjevo enačbo za približevanje in za oddaljevanje ter ju deli; oddana frekvenca se pokrajša.",
          [dat("\\nu_1", n1, "Hz"), dat("\\nu_2", n2, "Hz"), cz],
          ["v"],
          ["\\nu_1 = \\dfrac{\\nu}{1 - v/c},\\ \\nu_2 = \\dfrac{\\nu}{1 + v/c}", "v = c\\,\\dfrac{\\nu_1 - \\nu_2}{\\nu_1 + \\nu_2}"],
          [`$\\dfrac{\\nu_1}{\\nu_2} = \\dfrac{c + v}{c - v} \\Rightarrow v = c\\,\\dfrac{\\nu_1 - \\nu_2}{\\nu_1 + \\nu_2}$`, `$v = 340 \\cdot \\dfrac{${n1 - n2}}{${n1 + n2}}\\ \\mathrm{m/s} ${res(vv, 2, "m/s")}$`, `$v ${res(vv * 3.6, 0, "km/h")}$`],
        );
      }
      if (kind === "razlika") {
        const vk = r.int(50, 150);
        const v = vk / 3.6;
        const dn = nu / (1 - v / C_ZVOK) - nu / (1 + v / C_ZVOK);
        return T(
          `${S.what} pelje s hitrostjo $${vk}\\ \\mathrm{km/h}$ mimo mirujočega opazovalca; ${S.sound} oddaja $${nu}\\ \\mathrm{Hz}$. Za koliko hertzov se zniža slišana frekvenca, ko vozilo pripelje mimo (iz približevanja v oddaljevanje)? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Zaokroži na celo število.`,
          num(dn, "Hz", 0, [M(nu / (1 - v / C_ZVOK) - nu, "Primerjaj frekvenco pri približevanju s frekvenco pri oddaljevanju, ne z oddano."), M(nu / (1 - vk / C_ZVOK) - nu / (1 + vk / C_ZVOK), "Hitrost pretvori v m/s.")]),
          "Izračunaj slišano frekvenco pri približevanju in pri oddaljevanju ter ju odštej.",
          [dat("v", vk, "km/h"), dat("\\nu", nu, "Hz"), cz],
          ["\\Delta\\nu"],
          ["\\nu_1 = \\dfrac{\\nu}{1 - v/c}", "\\nu_2 = \\dfrac{\\nu}{1 + v/c}"],
          [`$v ${res(v, 2, "m/s")}$`, `$\\nu_1 ${res(nu / (1 - v / C_ZVOK), 1, "Hz")},\\quad \\nu_2 ${res(nu / (1 + v / C_ZVOK), 1, "Hz")}$`, `$\\Delta\\nu = \\nu_1 - \\nu_2 ${res(dn, 0, "Hz")}$`],
        );
      }
      const v = r.dec(2, 15, 1);
      const nb = r.int(20, 80) * 1000;
      const nr = (nb * (C_ZVOK + v)) / (C_ZVOK - v);
      const who = r.pick(["Netopir leti", "Dron z ultrazvočnim senzorjem leti", "Avto s parkirnim senzorjem pelje"]);
      return T(
        `${who} s hitrostjo $${qty(tx(v), "m/s")}$ proti steni in oddaja ultrazvok s frekvenco $${nb / 1000}\\ \\mathrm{kHz}$. Kolikšno frekvenco ima odbiti zvok, ki ga zazna sam? Hitrost zvoka je $340\\ \\mathrm{m/s}$. Rezultat zapiši v Hz in zaokroži na celo število.`,
        num(nr, "Hz", 0, [M(nb / (1 - v / C_ZVOK), "Upoštevaj dva Dopplerjeva pojava: stena »sliši« premaknjeno frekvenco, netopir pa se ji kot opazovalec še približuje."), M(nb * (1 + v / C_ZVOK), "Upoštevaj oba pojava – najprej se giblje izvor, nato opazovalec.")]),
        "Stena kot mirujoči opazovalec prejme frekvenco gibajočega izvora; odbiti zvok nato prestreže gibajoči se opazovalec.",
        [dat("v", tx(v), "m/s"), dat("\\nu", nb / 1000, "kHz"), cz],
        ["\\nu''"],
        ["\\nu' = \\dfrac{\\nu}{1 - v/c}", "\\nu'' = \\nu'\\left(1 + \\dfrac{v}{c}\\right) = \\nu\\,\\dfrac{c + v}{c - v}"],
        [`$\\nu' = \\dfrac{${nb}}{1 - ${tx(v)}/340}\\ \\mathrm{Hz} ${res(nb / (1 - v / C_ZVOK), 0, "Hz")}$`, `$\\nu'' = \\nu' \\left(1 + \\dfrac{${tx(v)}}{340}\\right) ${res(nr, 0, "Hz")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-lom-svetlobe",
    topics: ["FIZ-SS-3/geometrijska-optika"],
    gen(level, r) {
      const n = ime(r);
      const MED = [
        { name: "voda", gen: "vode", loc: "vodi", acc: "vodo", n: 1.33 },
        { name: "steklo", gen: "stekla", loc: "steklu", acc: "steklo", n: 1.5 },
        { name: "diamant", gen: "diamanta", loc: "diamantu", acc: "diamant", n: 2.42 },
        { name: "led", gen: "ledu", loc: "ledu", acc: "led", n: 1.31 },
        { name: "etanol", gen: "etanola", loc: "etanolu", acc: "etanol", n: 1.36 },
        { name: "akrilno steklo", gen: "akrilnega stekla", loc: "akrilnem steklu", acc: "akrilno steklo", n: 1.49 },
      ];
      const Md = r.pick(MED);
      const nt = tx(Md.n);
      if (level === 1) {
        const kind = r.pick(["hitrost", "lom", "odboj"]);
        if (kind === "hitrost") {
          const v = C / Md.n / 1000;
          return T(
            `Kolikšna je hitrost svetlobe v ${Md.loc}, ki ima lomni količnik $${nt}$? ($c = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s}$) Rezultat zapiši v km/s in zaokroži na celo število.`,
            num(v, "km/s", 0, [M((C * Md.n) / 1000, "Lomni količnik je $n = c/v$, zato je $v = c/n$ – deli, ne množi."), M(v * 1000, "Rezultat pretvori v km/s.")]),
            "Lomni količnik pove, kolikokrat je hitrost svetlobe v snovi manjša kot v vakuumu.",
            [`n = ${nt}`, K.c],
            ["v"],
            ["n = \\dfrac{c}{v}", "v = \\dfrac{c}{n}"],
            [`$v = \\dfrac{3{,}00 \\cdot 10^8}{${nt}}\\ \\mathrm{m/s} \\approx ${qty(sci(v * 1000, 4), "m/s")}$`, `$v ${res(v, 0, "km/s")}$`],
          );
        }
        if (kind === "odboj") {
          const th = r.int(10, 80);
          const ang = 180 - 2 * th;
          return T(
            `Svetlobni žarek pada na ravno zrcalo tako, da s ploskvijo zrcala oklepa kot $${th}^\\circ$. Kolikšen kot oklepata vpadni in odbiti žarek?`,
            num(ang, "°", null, [M(2 * th, "Vpadni kot se meri od vpadne pravokotnice, ne od ploskve zrcala."), M(90 - th, "To je vpadni kot; kot med žarkoma je dvakratni vpadni kot.")], { tolerance: 1e-9 }),
            "Najprej izračunaj vpadni kot (merjen od vpadne pravokotnice). Odbojni kot je enak vpadnemu.",
            [`\\theta = ${th}^\\circ\\ \\text{(od ploskve)}`],
            ["\\varphi"],
            ["\\alpha = 90^\\circ - \\theta", "\\alpha' = \\alpha", "\\varphi = 2\\alpha"],
            [`$\\alpha = 90^\\circ - ${th}^\\circ = ${90 - th}^\\circ$`, `$\\varphi = \\alpha + \\alpha' = 2 \\cdot ${90 - th}^\\circ = ${ang}^\\circ$`],
          );
        }
        const a = r.int(15, 75);
        const b = todeg(Math.asin(Math.sin(rad(a)) / Md.n));
        return T(
          `Žarek svetlobe prehaja iz zraka v ${Md.acc} ($n = ${nt}$) pod vpadnim kotom $${a}^\\circ$. Kolikšen je lomni kot? Zaokroži na eno decimalko.`,
          num(b, "°", 1, [M(a / Md.n, "Lomni zakon velja za sinuse kotov, ne za kote same."), M(a, "Ob prehodu v optično gostejšo snov se žarek lomi proti vpadni pravokotnici.")]),
          "Uporabi lomni zakon; za zrak vzemi $n = 1$.",
          [`n_1 = 1`, `n_2 = ${nt}`, `\\alpha = ${a}^\\circ`],
          ["\\beta"],
          ["n_1 \\sin\\alpha = n_2 \\sin\\beta"],
          [`$\\sin\\beta = \\dfrac{\\sin ${a}^\\circ}{${nt}} \\approx ${tx(Math.sin(rad(a)) / Md.n, 4)}$`, `$\\beta ${resd(b, 1)}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const pairs = [
            [MED[0], MED[1]],
            [MED[0], MED[2]],
            [MED[4], MED[1]],
            [MED[3], MED[5]],
          ];
          const [A, B] = r.pick(pairs);
          const a = r.int(15, 70);
          const b = todeg(Math.asin((A.n * Math.sin(rad(a))) / B.n));
          return T(
            `Žarek prehaja iz ${A.gen} ($n_1 = ${tx(A.n)}$) v ${B.acc} ($n_2 = ${tx(B.n)}$). Vpadni kot je $${a}^\\circ$. Kolikšen je lomni kot? Zaokroži na eno decimalko.`,
            num(b, "°", 1, [M(todeg(Math.asin(Math.sin(rad(a)) / B.n)), "Prva snov ni zrak – upoštevaj njen lomni količnik."), M((a * A.n) / B.n, "Lomni zakon velja za sinuse kotov.")]),
            "Uporabi lomni zakon z lomnima količnikoma obeh snovi.",
            [`n_1 = ${tx(A.n)}`, `n_2 = ${tx(B.n)}`, `\\alpha = ${a}^\\circ`],
            ["\\beta"],
            ["n_1 \\sin\\alpha = n_2 \\sin\\beta"],
            [`$\\sin\\beta = \\dfrac{n_1 \\sin\\alpha}{n_2} = \\dfrac{${tx(A.n)} \\cdot \\sin ${a}^\\circ}{${tx(B.n)}} \\approx ${tx((A.n * Math.sin(rad(a))) / B.n, 4)}$`, `$\\beta ${resd(b, 1)}$`],
          );
        }
        const toWater = r.next() < 0.3 && Md.n > 1.4;
        const n2 = toWater ? 1.33 : 1;
        const am = todeg(Math.asin(n2 / Md.n));
        const ctx = r.pick([`Svetloba v ${Md.loc} ($n = ${nt}$) pada na mejo`, `Svetlobni žarek v ${Md.loc} ($n = ${nt}$) pada na mejo`]);
        return T(
          `${ctx} ${toWater ? "z vodo ($n = 1{,}33$)" : "z zrakom"}. Pri kolikšnem najmanjšem vpadnem kotu pride do popolnega odboja? Zaokroži na eno decimalko.`,
          num(am, "°", 1, [M(todeg(Math.acos(n2 / Md.n)), "Pri mejnem kotu je lomni kot $90^\\circ$: $n_1 \\sin\\alpha_m = n_2$ – uporabi sinus."), M(90 - am, "Kot se meri od vpadne pravokotnice.")]),
          "Pri mejnem kotu je lomni kot $90^\\circ$. Popolni odboj je mogoč le pri prehodu v optično redkejšo snov.",
          [`n_1 = ${nt}`, `n_2 = ${toWater ? "1{,}33" : "1"}`],
          ["\\alpha_m"],
          ["n_1 \\sin\\alpha_m = n_2 \\sin 90^\\circ", "\\sin\\alpha_m = \\dfrac{n_2}{n_1}"],
          [`$\\sin\\alpha_m = \\dfrac{${toWater ? "1{,}33" : "1"}}{${nt}} \\approx ${tx(n2 / Md.n, 4)}$`, `$\\alpha_m ${resd(am, 1)}$`],
        );
      }
      if (r.next() < 0.5) {
        const a = r.int(30, 70);
        const nn = r.dec(1.3, 1.9, 2);
        const b = roundHalfUp(todeg(Math.asin(Math.sin(rad(a)) / nn)), 1);
        const nx = Math.sin(rad(a)) / Math.sin(rad(b));
        const am = todeg(Math.asin(1 / nx));
        return T(
          `${n} pri vaji posveti z laserjem iz zraka na ploščico neznane prozorne snovi. Pri vpadnem kotu $${a}^\\circ$ izmeri lomni kot $${deg(b, 1)}$. Kolikšen je mejni kot za popolni odboj na meji te snovi z zrakom? Zaokroži na eno decimalko.`,
          num(am, "°", 1, [M(b, "Mejni kot ni enak izmerjenemu lomnemu kotu; najprej izračunaj lomni količnik."), M(todeg(Math.acos(1 / nx)), "Pri mejnem kotu velja $\\sin\\alpha_m = 1/n$ – uporabi sinus, ne kosinusa.")]),
          "Iz izmerjenih kotov izračunaj lomni količnik snovi, nato mejni kot.",
          [`\\alpha = ${a}^\\circ`, `\\beta = ${deg(b, 1)}`],
          ["\\alpha_m"],
          ["n = \\dfrac{\\sin\\alpha}{\\sin\\beta}", "\\sin\\alpha_m = \\dfrac{1}{n}"],
          [`$n = \\dfrac{\\sin ${a}^\\circ}{\\sin ${deg(b, 1)}} \\approx ${tx(nx, 4)}$`, `$\\sin\\alpha_m = \\dfrac{1}{${tx(nx, 4)}} \\approx ${tx(1 / nx, 4)}$`, `$\\alpha_m ${resd(am, 1)}$`],
        );
      }
      const h = r.dec(0.5, 4, 1);
      const am = Math.asin(1 / 1.33);
      const R = h * Math.tan(am);
      const what = r.pick(["Na dnu bazena", "Na dnu ribnika", "Na dnu akvarija"]);
      return T(
        `${what}, $${qty(tx(h), "m")}$ pod gladino, je majhna svetilka. Kolikšen je polmer svetlega kroga na gladini, skozi katerega svetloba izstopa v zrak? Lomni količnik vode je $1{,}33$. Zaokroži na dve decimalki.`,
        num(R, "m", 2, [M(h * Math.sin(am), "Polmer kroga je $h \\tan\\alpha_m$, ne $h \\sin\\alpha_m$."), M(h / Math.tan(am), "Polmer kroga je nasprotna kateta mejnemu kotu: $r = h\\tan\\alpha_m$."), M(h, "Žarki izstopajo le do mejnega kota; izračunaj ga.")]),
        "Na robu svetlega kroga žarki padajo na gladino pod mejnim kotom. Nariši trikotnik z globino in polmerom kroga.",
        [dat("h", tx(h), "m"), "n = 1{,}33"],
        ["r"],
        ["\\sin\\alpha_m = \\dfrac{1}{n}", "r = h \\tan\\alpha_m"],
        [`$\\sin\\alpha_m = \\dfrac{1}{1{,}33} \\Rightarrow \\alpha_m ${resd(todeg(am), 2)}$`, `$r = h\\tan\\alpha_m = ${tx(h)} \\cdot \\tan ${deg(todeg(am), 2)}\\ \\mathrm{m} ${res(R, 2, "m")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-lece",
    topics: ["FIZ-SS-3/geometrijska-optika"],
    gen(level, r) {
      const n = ime(r);
      const lens = "\\dfrac{1}{f} = \\dfrac{1}{a} + \\dfrac{1}{b}";
      if (level === 1) {
        if (r.next() < 0.65) {
          const f = r.int(5, 30);
          const a = r.int(f + 2, 4 * f);
          const b = (a * f) / (a - f);
          return T(
            `Predmet stoji $${a}\\ \\mathrm{cm}$ pred zbiralno lečo z goriščno razdaljo $${f}\\ \\mathrm{cm}$. Kako daleč za lečo nastane slika? Zaokroži na eno decimalko.`,
            num(b, "cm", 1, [M((a * f) / (a + f), "Iz enačbe leče: $\\frac{1}{b} = \\frac{1}{f} - \\frac{1}{a}$ – odštej, ne seštej."), M(a - f, "Razdalje se ne odštevajo; odštevajo se njihove obratne vrednosti.")]),
            "Uporabi enačbo leče in izrazi $\\dfrac{1}{b}$.",
            [dat("a", a, "cm"), dat("f", f, "cm")],
            ["b"],
            [lens],
            [`$\\dfrac{1}{b} = \\dfrac{1}{${f}} - \\dfrac{1}{${a}} = \\dfrac{${a - f}}{${a * f}}\\ \\mathrm{cm^{-1}}$`, `$b = \\dfrac{${a * f}}{${a - f}}\\ \\mathrm{cm} ${res(b, 1, "cm")}$`],
          );
        }
        const fcm = r.pick([10, 12.5, 20, 25, 40, 50, 80, 100, 200]);
        const conv = r.next() < 0.6;
        const D = (conv ? 1 : -1) * (100 / fcm);
        return T(
          `Leča očal je ${conv ? "zbiralna" : "razpršilna"} z goriščno razdaljo $${tx(fcm)}\\ \\mathrm{cm}$. Kolikšna je njena lomnost v dioptrijah? (Razpršilna leča ima negativno lomnost.)`,
          num(D, "dpt", null, [M((conv ? 1 : -1) / fcm, "Goriščno razdaljo pretvori v metre."), M(-D, "Zbiralna leča ima pozitivno, razpršilna negativno lomnost.")], { tolerance: 1e-9, unitAlternatives: ["D", "1/m", "m-1", "dioptrij"] }),
          "Lomnost je obratna vrednost goriščne razdalje v metrih.",
          [`|f| = ${qty(tx(fcm), "cm")}`, `\\text{leča} = \\text{${conv ? "zbiralna" : "razpršilna"}}`],
          ["\\omega"],
          ["\\omega = \\dfrac{1}{f}\\ (f\\ \\text{v m})"],
          [`$f = ${conv ? "" : "-"}${qty(tx(fcm / 100), "m")}$`, `$\\omega = \\dfrac{1}{f} = ${qty(tx(D), "dpt")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const f = r.int(5, 25);
          const a = r.int(f + 2, 3 * f);
          const y = r.dec(1, 10, 1);
          const b = (a * f) / (a - f);
          const Y = (y * b) / a;
          const obj = r.pick(["Sveča", "Puščica", "Figurica", "Napis na škatli"]);
          return T(
            `${obj} z višino $${qty(tx(y), "cm")}$ je $${a}\\ \\mathrm{cm}$ pred zbiralno lečo z goriščno razdaljo $${f}\\ \\mathrm{cm}$. Kako velika je slika na zaslonu? Zaokroži na eno decimalko.`,
            num(Y, "cm", 1, [M((y * a) / b, "Povečava je $b/a$, ne $a/b$."), M(y, "Povečava ni 1 – najprej izračunaj, kje nastane slika.")]),
            "Najprej z enačbo leče izračunaj oddaljenost slike, nato povečavo.",
            [dat("y", tx(y), "cm"), dat("a", a, "cm"), dat("f", f, "cm")],
            ["y'"],
            [lens, "\\dfrac{y'}{y} = \\dfrac{b}{a}"],
            [`$b = \\dfrac{a f}{a - f} = \\dfrac{${a} \\cdot ${f}}{${a - f}}\\ \\mathrm{cm} ${res(b, 2, "cm")}$`, `$y' = y \\cdot \\dfrac{b}{a} = ${tx(y)} \\cdot \\dfrac{${tx(b, 2)}}{${a}}\\ \\mathrm{cm} ${res(Y, 1, "cm")}$`],
          );
        }
        const f = r.int(5, 40);
        const a = r.int(3, 80);
        const b = (a * f) / (a + f);
        return T(
          `Predmet je $${a}\\ \\mathrm{cm}$ pred razpršilno lečo z goriščno razdaljo $${f}\\ \\mathrm{cm}$ (v enačbi leče $f = -${f}\\ \\mathrm{cm}$). Kako daleč od leče nastane navidezna slika? Zapiši razdaljo (pozitivno število) in zaokroži na eno decimalko.`,
          num(b, "cm", 1, [M(a > f ? (a * f) / (a - f) : NaN, "Razpršilna leča ima negativno goriščno razdaljo."), M(Math.abs(a - f), "Odštevajo se obratne vrednosti razdalj, ne razdalje.")]),
          "Vstavi $f$ z negativnim predznakom; dobljeni $b$ je negativen, kar pomeni navidezno sliko na strani predmeta.",
          [dat("a", a, "cm"), dat("f", `-${f}`, "cm")],
          ["|b|"],
          [lens],
          [`$\\dfrac{1}{b} = \\dfrac{1}{f} - \\dfrac{1}{a} = -\\dfrac{1}{${f}} - \\dfrac{1}{${a}} = -\\dfrac{${a + f}}{${a * f}}\\ \\mathrm{cm^{-1}}$`, `$b = -\\dfrac{${a * f}}{${a + f}}\\ \\mathrm{cm} ${eq(-b, 1)} ${qty(tx(-b, 1), "cm")}$`, `Slika je navidezna, $${tx(b, 1)}\\ \\mathrm{cm}$ pred lečo.`],
        );
      }
      if (r.next() < 0.5) {
        const bm = r.dec(2, 8, 1);
        const y = r.int(2, 4) * 12;
        const Y = r.int(8, 30) * 10;
        const m = (Y * 10) / y;
        const a = (bm * 100) / m;
        const f = (a * bm * 100) / (a + bm * 100);
        const dev = r.pick(["Diaprojektor", "Projektor za prosojnice", "Šolski projektor"]);
        return T(
          `${dev} naj sliko diapozitiva z višino $${y}\\ \\mathrm{mm}$ preslika na platno $${qty(tx(bm), "m")}$ od objektiva, tako da je slika visoka $${Y}\\ \\mathrm{cm}$. Kolikšna mora biti goriščna razdalja objektiva? Zaokroži na dve decimalki.`,
          num(f, "cm", 2, [M(a, "To je oddaljenost diapozitiva od leče; goriščno razdaljo izračunaj z enačbo leče."), M((Y * 10 * bm * 100) / (Y * 10 + y), "Povečava je razmerje velikosti slike in predmeta: $b/a = y'/y$.")]),
          "Iz povečave izračunaj oddaljenost diapozitiva od leče, nato z enačbo leče goriščno razdaljo. Vse dolžine zapiši v cm.",
          [dat("y", y, "mm"), dat("y'", Y, "cm"), dat("b", tx(bm), "m")],
          ["f"],
          ["\\dfrac{y'}{y} = \\dfrac{b}{a}", lens],
          [`$\\dfrac{y'}{y} = \\dfrac{${Y * 10}\\ \\mathrm{mm}}{${y}\\ \\mathrm{mm}} ${eq(m, 3)} ${tx(m, 3)}$`, `$a = \\dfrac{b}{${tx(m, 3)}} = \\dfrac{${tx(bm * 100)}\\ \\mathrm{cm}}{${tx(m, 3)}} ${res(a, 3, "cm")}$`, `$f = \\dfrac{a b}{a + b} ${res(f, 2, "cm")}$`],
        );
      }
      const f = r.int(5, 30);
      const Mg = r.int(2, 6);
      const a = (f * (Mg + 1)) / Mg;
      return T(
        `Kam pred zbiralno lečo z goriščno razdaljo $${f}\\ \\mathrm{cm}$ moramo postaviti predmet, da na zaslonu dobimo ${Mg}-krat povečano realno sliko? Zaokroži na dve decimalki.`,
        num(a, "cm", 2, [M(f * (Mg + 1), "To je oddaljenost slike $b$; vprašanje sprašuje po oddaljenosti predmeta."), M(f * Mg, "Iz $b = M a$ in enačbe leče dobiš $a = f(M + 1)/M$.")]),
        `Zapiši $b = ${Mg}a$ in to vstavi v enačbo leče.`,
        [dat("f", f, "cm"), `M = \\dfrac{b}{a} = ${Mg}`],
        ["a"],
        [lens, "b = M a"],
        [`$\\dfrac{1}{f} = \\dfrac{1}{a} + \\dfrac{1}{${Mg}a} = \\dfrac{${Mg + 1}}{${Mg}a}$`, `$a = \\dfrac{${Mg + 1}}{${Mg}} f = \\dfrac{${Mg + 1}}{${Mg}} \\cdot ${qty(f, "cm")} ${res(a, 2, "cm")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-valovna-optika",
    topics: ["FIZ-SS-3/valovna-optika"],
    gen(level, r) {
      const n = ime(r);
      const LAS = [
        { name: "rdeči laser", l: 650 },
        { name: "rdeči He-Ne laser", l: 633 },
        { name: "zeleni laser", l: 532 },
        { name: "modri laser", l: 450 },
        { name: "vijolični laser", l: 405 },
      ];
      const L = r.pick(LAS);
      const grat = "d \\sin\\alpha_N = N\\lambda";
      if (level === 1) {
        if (r.next() < 0.6) {
          const d = r.dec(1, 5, 1);
          const a = todeg(Math.asin((L.l * 1e-3) / d));
          return T(
            `Svetloba, ki jo oddaja ${L.name} ($\\lambda = ${L.l}\\ \\mathrm{nm}$), pada pravokotno na uklonsko mrežico z mrežično konstanto $${qty(tx(d), "\\mathrm{\\mu m}")}$. Pod kolikšnim kotom opazimo ojačitev prvega reda ($N = 1$)? Zaokroži na eno decimalko.`,
            num(a, "°", 1, [M(todeg((L.l * 1e-3) / d), "Kot ni enak razmerju $\\lambda/d$; to je njegov sinus."), M(todeg(Math.atan((L.l * 1e-3) / d)), "Pri uklonski mrežici velja $\\sin\\alpha = \\lambda/d$, ne $\\tan\\alpha$.")]),
            "Za ojačitev prvega reda velja $d\\sin\\alpha = \\lambda$. Obe dolžini zapiši v isti enoti.",
            [dat("\\lambda", L.l, "nm"), dat("d", tx(d), "\\mathrm{\\mu m}"), "N = 1"],
            ["\\alpha_1"],
            [grat],
            [`$\\sin\\alpha_1 = \\dfrac{\\lambda}{d} = \\dfrac{${tx(L.l / 1000, 3)}\\ \\mathrm{\\mu m}}{${tx(d)}\\ \\mathrm{\\mu m}} \\approx ${tx((L.l * 1e-3) / d, 4)}$`, `$\\alpha_1 ${resd(a, 1)}$`],
          );
        }
        const j0 = r.int(10, 200);
        const phi = r.pick([20, 30, 40, 45, 50, 60, 70]);
        const j = j0 * Math.cos(rad(phi)) ** 2;
        return T(
          `Linearno polarizirana svetloba z gostoto svetlobnega toka $${j0}\\ \\mathrm{W/m^2}$ pade na polarizator, katerega prepustna smer oklepa s smerjo polarizacije kot $${phi}^\\circ$. Kolikšna je gostota toka prepuščene svetlobe? Zaokroži na eno decimalko.`,
          num(j, "W/m²", 1, [M(j0 * Math.cos(rad(phi)), "Skozi polarizator gre komponenta amplitude $E\\cos\\varphi$; gostota toka je sorazmerna s kvadratom: $\\cos^2\\varphi$."), M(j0 * Math.sin(rad(phi)) ** 2, "Kot se meri od prepustne smeri, zato uporabi $\\cos^2\\varphi$.")]),
          "Polarizator prepusti komponento električnega polja v prepustni smeri; gostota toka je sorazmerna s kvadratom amplitude (Malusov zakon).",
          [dat("j_0", j0, "W/m^2"), `\\varphi = ${phi}^\\circ`],
          ["j"],
          ["j = j_0 \\cos^2\\varphi"],
          [`$\\cos^2 ${phi}^\\circ \\approx ${tx(Math.cos(rad(phi)) ** 2, 4)}$`, `$j = ${j0} \\cdot ${tx(Math.cos(rad(phi)) ** 2, 4)}\\ \\mathrm{W/m^2} ${res(j, 1, "W/m^2")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["crte", "reze", "dva"]);
        if (kind === "crte") {
          const lines = r.pick([100, 200, 300, 500, 600, 800]);
          const d = 1e6 / lines; // nm
          const Nmax = Math.floor(d / L.l);
          const N = r.int(1, Math.min(3, Nmax));
          const a = todeg(Math.asin((N * L.l) / d));
          return T(
            `Uklonska mrežica ima $${lines}$ rež na milimeter. Nanjo pravokotno posvetimo z laserjem z valovno dolžino $${L.l}\\ \\mathrm{nm}$. Pod kolikšnim kotom opazimo ojačitev ${N}. reda? Zaokroži na eno decimalko.`,
            num(a, "°", 1, [M(N > 1 ? todeg(Math.asin(L.l / d)) : NaN, `To je kot prvega reda; za ${N}. red pomnoži valovno dolžino z ${N}.`), M(todeg(Math.atan((N * L.l) / d)), "Pri mrežici velja $\\sin\\alpha_N = N\\lambda/d$.")]),
            "Mrežična konstanta je razdalja med sosednjima režama: $d = 1\\ \\mathrm{mm}/\\text{število rež}$.",
            [`\\text{gostota rež} = ${lines}\\ \\text{rež/mm}`, dat("\\lambda", L.l, "nm"), `N = ${N}`],
            ["\\alpha_N"],
            ["d = \\dfrac{1\\ \\mathrm{mm}}{" + lines + "}", grat],
            [`$d = \\dfrac{1\\ \\mathrm{mm}}{${lines}} ${res(d / 1000, 3, "\\mathrm{\\mu m}")} = ${qty(tx(d, 0), "nm")}$`, `$\\sin\\alpha_${N} = \\dfrac{${N} \\cdot ${L.l}}{${tx(d, 0)}} \\approx ${tx((N * L.l) / d, 4)}$`, `$\\alpha_${N} ${resd(a, 1)}$`],
          );
        }
        if (kind === "reze") {
          const dmm = r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.5]);
          const Lz = r.dec(1, 5, 1);
          const dx = ((L.l * 1e-9 * Lz) / (dmm * 1e-3)) * 1000;
          return T(
            `Pri Youngovem poskusu je razdalja med režama $${qty(tx(dmm), "mm")}$, zaslon je $${qty(tx(Lz), "m")}$ daleč. Uporabimo ${L.name} z valovno dolžino $${L.l}\\ \\mathrm{nm}$. Kolikšna je razdalja med sosednjima svetlima progama na zaslonu? Zaokroži na dve decimalki.`,
            num(dx, "mm", 2, [M((L.l * 1e-9 * dmm * 1e-3) / Lz * 1000, "Razdalja med progama je $\\lambda L / d$."), M(dx / 1000, "Rezultat zapiši v milimetrih.")]),
            "Pri majhnih kotih je razdalja med sosednjima progama $\\Delta x = \\lambda L / d$. Vse dolžine pretvori v metre.",
            [dat("d", tx(dmm), "mm"), dat("L", tx(Lz), "m"), dat("\\lambda", L.l, "nm")],
            ["\\Delta x"],
            ["\\Delta x = \\dfrac{\\lambda L}{d}"],
            [`$\\Delta x = \\dfrac{${L.l} \\cdot 10^{-9} \\cdot ${tx(Lz)}}{${tx(dmm)} \\cdot 10^{-3}}\\ \\mathrm{m} ${res(dx / 1000, 6, "m")}$`, `$\\Delta x ${res(dx, 2, "mm")}$`],
          );
        }
        const j0 = r.int(20, 400);
        const phi = r.pick([20, 30, 40, 45, 50, 60, 70]);
        const j = (j0 / 2) * Math.cos(rad(phi)) ** 2;
        return T(
          `Nepolarizirana svetloba z gostoto svetlobnega toka $${j0}\\ \\mathrm{W/m^2}$ gre skozi dva polarizatorja, katerih prepustni smeri oklepata kot $${phi}^\\circ$. Kolikšna je gostota toka za drugim polarizatorjem? Zaokroži na eno decimalko.`,
          num(j, "W/m²", 1, [M(j0 * Math.cos(rad(phi)) ** 2, "Prvi polarizator prepusti le polovico nepolarizirane svetlobe."), M((j0 / 2) * Math.cos(rad(phi)), "Za drugi polarizator velja $j = j_1\\cos^2\\varphi$ – kosinus kvadriraj.")]),
          "Prvi polarizator nepolarizirano svetlobo polarizira in prepusti polovico. Za drugi uporabi Malusov zakon.",
          [dat("j_0", j0, "W/m^2"), `\\varphi = ${phi}^\\circ`],
          ["j_2"],
          ["j_1 = \\dfrac{j_0}{2}", "j_2 = j_1 \\cos^2\\varphi"],
          [`$j_1 = \\dfrac{${j0}}{2}\\ \\mathrm{W/m^2} = ${qty(tx(j0 / 2), "W/m^2")}$`, `$j_2 = ${tx(j0 / 2)} \\cdot \\cos^2 ${phi}^\\circ\\ \\mathrm{W/m^2} ${res(j, 1, "W/m^2")}$`],
        );
      }
      const kind = r.pick(["nmax", "lambda", "proge"]);
      if (kind === "nmax") {
        const lines = r.pick([100, 150, 200, 250, 300, 400, 500, 600]);
        const d = 1e6 / lines;
        const Nm = Math.floor(d / L.l);
        return T(
          `Uklonska mrežica ima $${lines}$ rež na milimeter, nanjo pravokotno pada svetloba z valovno dolžino $${L.l}\\ \\mathrm{nm}$. Koliko je največji red ojačitve, ki ga še lahko opazimo na eni strani?`,
          num(Nm, "", null, [M(Math.round(d / L.l) !== Nm ? Math.round(d / L.l) : NaN, "Red mora biti celo število, za katerega je $\\sin\\alpha \\le 1$ – zaokroži navzdol."), M(2 * Nm + 1, "To je skupno število vseh vidnih ojačitev na obeh straneh (z ničtim redom); sprašujemo po največjem redu.")], { tolerance: 1e-9 }),
          "Kot ojačitve ne more preseči $90^\\circ$, torej $\\sin\\alpha_N \\le 1$.",
          [`\\text{gostota rež} = ${lines}\\ \\text{rež/mm}`, dat("\\lambda", L.l, "nm")],
          ["N_{max}"],
          [grat, "\\sin\\alpha_N \\le 1 \\Rightarrow N \\le \\dfrac{d}{\\lambda}"],
          [`$d = \\dfrac{1\\ \\mathrm{mm}}{${lines}} ${res(d, 0, "nm")}$`, `$\\dfrac{d}{\\lambda} = \\dfrac{${tx(d, 0)}}{${L.l}} \\approx ${tx(d / L.l, 2)}$`, `Največji celoštevilski red: $N_{max} = ${Nm}$`],
        );
      }
      if (kind === "lambda") {
        const lines = r.pick([300, 400, 500, 600]);
        const d = 1e6 / lines;
        const lam = r.int(420, 680);
        const Lz = r.dec(0.5, 2, 2);
        const a = Math.asin(lam / d);
        const x = roundHalfUp(Lz * Math.tan(a) * 100, 1);
        const lr = d * Math.sin(Math.atan(x / 100 / Lz));
        return T(
          `${n} posveti z laserjem na mrežico s $${lines}$ režami na milimeter. Na zaslonu $${qty(tx(Lz), "m")}$ za mrežico je svetla pega prvega reda $${qty(tx(x, 1), "cm")}$ od osrednje pege. Kolikšna je valovna dolžina svetlobe? Zaokroži na celo število.`,
          num(lr, "nm", 0, [M((d * (x / 100)) / Lz, "Kot je velik, zato $\\sin\\alpha \\ne \\tan\\alpha$: kot najprej izračunaj iz $\\tan\\alpha = x/L$."), M(d * Math.sin(Math.atan(x / Lz)), "Odmik in razdaljo do zaslona zapiši v isti enoti.")]),
          "Iz odmika pege in razdalje do zaslona izračunaj kot, nato iz enačbe mrežice valovno dolžino.",
          [`\\text{gostota rež} = ${lines}\\ \\text{rež/mm}`, dat("L", tx(Lz), "m"), dat("x", tx(x, 1), "cm")],
          ["\\lambda"],
          ["\\tan\\alpha = \\dfrac{x}{L}", "\\lambda = d \\sin\\alpha"],
          [`$d = \\dfrac{1\\ \\mathrm{mm}}{${lines}} ${res(d, 0, "nm")}$`, `$\\tan\\alpha = \\dfrac{${tx(x / 100, 3)}}{${tx(Lz)}} \\Rightarrow \\alpha ${resd(todeg(Math.atan(x / 100 / Lz)), 2)}$`, `$\\lambda = d\\sin\\alpha ${res(lr, 0, "nm")}$`],
        );
      }
      const dmm = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]);
      const Lz = r.dec(1, 4, 1);
      const k = r.int(3, 8);
      const lam = r.int(420, 680);
      const X = roundHalfUp(((k - 1) * lam * 1e-9 * Lz) / (dmm * 1e-3) * 1000, 1);
      const lr = ((X / 1000) * (dmm * 1e-3)) / ((k - 1) * Lz) * 1e9;
      return T(
        `Pri Youngovem poskusu (razdalja med režama $${qty(tx(dmm), "mm")}$, zaslon $${qty(tx(Lz), "m")}$ daleč) ${n} izmeri, da je razdalja med 1. in ${k}. svetlo progo $${qty(tx(X, 1), "mm")}$. Kolikšna je valovna dolžina svetlobe? Zaokroži na celo število.`,
        num(lr, "nm", 0, [M(((X / 1000) * (dmm * 1e-3)) / (k * Lz) * 1e9, `Med 1. in ${k}. progo je ${k - 1} razmikov, ne ${k}.`), M(((X / 1000) * (dmm * 1e-3)) / Lz * 1e9, "Izmerjeno razdaljo najprej deli s številom razmikov med progami.")]),
        `Med 1. in ${k}. progo je ${k - 1} enakih razmikov. Najprej izračunaj en razmik.`,
        [dat("d", tx(dmm), "mm"), dat("L", tx(Lz), "m"), dat("x", tx(X, 1), "mm"), `k = ${k}`],
        ["\\lambda"],
        ["\\Delta x = \\dfrac{x}{k - 1}", "\\lambda = \\dfrac{d\\,\\Delta x}{L}"],
        [`$\\Delta x = \\dfrac{${tx(X, 1)}}{${k - 1}}\\ \\mathrm{mm} ${res(X / (k - 1), 3, "mm")}$`, `$\\lambda = \\dfrac{d\\,\\Delta x}{L} = \\dfrac{${tx(dmm)} \\cdot 10^{-3} \\cdot ${tx(X / (k - 1), 3)} \\cdot 10^{-3}}{${tx(Lz)}}\\ \\mathrm{m} ${res(lr, 0, "nm")}$`],
      );
    },
  },
  // ---------------- 4. letnik ----------------
  {
    id: "dod-fiz-ss-fotoefekt",
    topics: ["FIZ-SS-4/fotoefekt-in-foton", "FIZ-SS-4/mesane-maturitetne-naloge"],
    gen(level, r) {
      const n = ime(r);
      const cs = "($h = 6{,}63 \\cdot 10^{-34}\\ \\mathrm{Js}$, $c = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s}$, $e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$)";
      const gi = [K.h, K.c, K.e0];
      const Ef = (lnm) => (H * C) / (lnm * 1e-9) / E0; // eV
      const MET = [
        { name: "cezija", A: 2.14 },
        { name: "kalija", A: 2.3 },
        { name: "natrija", A: 2.28 },
        { name: "litija", A: 2.9 },
        { name: "kalcija", A: 2.87 },
        { name: "cinka", A: 4.33 },
        { name: "barija", A: 2.52 },
      ];
      if (level === 1) {
        if (r.next() < 0.6) {
          const l = r.int(200, 750);
          const E = Ef(l);
          const what = l < 400 ? "ultravijolične svetlobe" : l < 450 ? "vijolične svetlobe" : l < 500 ? "modre svetlobe" : l < 570 ? "zelene svetlobe" : l < 600 ? "rumene svetlobe" : l < 700 ? "rdeče svetlobe" : "temno rdeče svetlobe";
          return T(
            `Kolikšna je energija fotona ${what} z valovno dolžino $${l}\\ \\mathrm{nm}$? ${cs} Rezultat zapiši v eV in zaokroži na dve decimalki.`,
            num(E, "eV", 2, [M((H * C) / (l * 1e-9) * 1e19, "Energijo v joulih pretvori v eV tako, da deliš z $e_0$."), M((H * l * 1e-9) / C / E0, "Energija fotona je $hc/\\lambda$.")]),
            "Energija fotona je $W_f = h\\nu = \\dfrac{hc}{\\lambda}$; $1\\ \\mathrm{eV} = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{J}$.",
            [dat("\\lambda", l, "nm"), ...gi],
            ["W_f"],
            ["W_f = \\dfrac{h c}{\\lambda}"],
            [`$W_f = \\dfrac{6{,}63 \\cdot 10^{-34} \\cdot 3{,}00 \\cdot 10^8}{${l} \\cdot 10^{-9}}\\ \\mathrm{J} \\approx ${qty(sci(E * E0, 3), "J")}$`, `$W_f = \\dfrac{${sci(E * E0, 3)}}{1{,}60 \\cdot 10^{-19}}\\ \\mathrm{eV} ${res(E, 2, "eV")}$`],
          );
        }
        const nu = r.dec(4, 15, 1);
        const E = (H * nu * 1e14) / E0;
        return T(
          `Kolikšna je energija fotona s frekvenco $${tx(nu)} \\cdot 10^{14}\\ \\mathrm{Hz}$? ($h = 6{,}63 \\cdot 10^{-34}\\ \\mathrm{Js}$, $e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$) Rezultat zapiši v eV in zaokroži na dve decimalki.`,
          num(E, "eV", 2, [M((H * nu * 1e14) * 1e19, "Joule pretvori v eV z deljenjem z $e_0$.")]),
          "Energija fotona je zmnožek Planckove konstante in frekvence.",
          [`\\nu = ${tx(nu)} \\cdot 10^{14}\\ \\mathrm{Hz}`, K.h, K.e0],
          ["W_f"],
          ["W_f = h\\nu"],
          [`$W_f = 6{,}63 \\cdot 10^{-34} \\cdot ${tx(nu)} \\cdot 10^{14}\\ \\mathrm{J} \\approx ${qty(sci(E * E0, 3), "J")}$`, `$W_f ${res(E, 2, "eV")}$`],
        );
      }
      const Mt = r.pick(MET);
      if (level === 2) {
        const kind = r.pick(["wk", "meja", "zaporna"]);
        if (kind === "meja") {
          const l0 = (H * C) / (Mt.A * E0) * 1e9;
          return T(
            `Izstopno delo ${Mt.name} je $${tx(Mt.A)}\\ \\mathrm{eV}$. Kolikšna je največja valovna dolžina svetlobe, ki še izbija elektrone iz njegove površine? ${cs} Zaokroži na celo število.`,
            num(l0, "nm", 0, [M((H * C) / Mt.A * 1e9, "Izstopno delo pretvori v joule ($1\\ \\mathrm{eV} = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{J}$)."), M(((Mt.A * E0) / (H * C)) * 1e-9, "Iz $A_i = hc/\\lambda_0$ izrazi $\\lambda_0 = hc/A_i$.")]),
            "Na meji ima foton ravno toliko energije, kot je izstopno delo.",
            [dat("A_i", tx(Mt.A), "eV"), ...gi],
            ["\\lambda_0"],
            ["\\dfrac{hc}{\\lambda_0} = A_i"],
            [`$A_i = ${tx(Mt.A)} \\cdot 1{,}60 \\cdot 10^{-19}\\ \\mathrm{J} ${res(Mt.A * E0 * 1e19, 3, "")} \\cdot 10^{-19}\\ \\mathrm{J}$`, `$\\lambda_0 = \\dfrac{hc}{A_i} \\approx ${qty(sci(l0 * 1e-9, 3), "m")} ${res(l0, 0, "nm")}$`],
          );
        }
        const lmax = (H * C) / (Mt.A * E0) * 1e9;
        const l = r.int(150, Math.floor(lmax) - 20);
        const Wk = Ef(l) - Mt.A;
        if (kind === "zaporna") {
          return T(
            `Fotocelico s katodo iz ${Mt.name} (izstopno delo $${tx(Mt.A)}\\ \\mathrm{eV}$) osvetlimo s svetlobo z valovno dolžino $${l}\\ \\mathrm{nm}$. Kolikšna je zaporna napetost, pri kateri fototok preneha? ${cs} Zaokroži na dve decimalki.`,
            num(Wk, "V", 2, [M(Ef(l), "Od energije fotona odštej izstopno delo."), M(Ef(l) + Mt.A, "Izstopno delo odštej, ne prištej.")]),
            "Zaporna napetost ustavi najhitrejše elektrone: $e_0 U_z = W_{k,max}$.",
            [dat("\\lambda", l, "nm"), dat("A_i", tx(Mt.A), "eV"), ...gi],
            ["U_z"],
            ["W_{k,max} = \\dfrac{hc}{\\lambda} - A_i", "e_0 U_z = W_{k,max}"],
            [`$W_f = \\dfrac{hc}{\\lambda} ${res(Ef(l), 3, "eV")}$`, `$W_{k,max} = ${tx(Ef(l), 3)} - ${tx(Mt.A)}\\ \\mathrm{eV} ${res(Wk, 3, "eV")}$`, `$U_z = \\dfrac{W_{k,max}}{e_0} ${res(Wk, 2, "V")}$`],
          );
        }
        return T(
          `Na površino ${Mt.name} (izstopno delo $${tx(Mt.A)}\\ \\mathrm{eV}$) pada svetloba z valovno dolžino $${l}\\ \\mathrm{nm}$. Kolikšna je največja kinetična energija izbitih elektronov? ${cs} Rezultat zapiši v eV in zaokroži na dve decimalki.`,
          num(Wk, "eV", 2, [M(Ef(l), "To je energija fotona; odštej še izstopno delo."), M(Ef(l) + Mt.A, "Izstopno delo odštej, ne prištej.")]),
          "Energija fotona se porabi za izstopno delo, preostanek je kinetična energija elektrona.",
          [dat("\\lambda", l, "nm"), dat("A_i", tx(Mt.A), "eV"), ...gi],
          ["W_{k,max}"],
          ["W_{k,max} = \\dfrac{hc}{\\lambda} - A_i"],
          [`$W_f = \\dfrac{hc}{\\lambda} ${res(Ef(l), 3, "eV")}$`, `$W_{k,max} = ${tx(Ef(l), 3)} - ${tx(Mt.A)}\\ \\mathrm{eV} ${res(Wk, 2, "eV")}$`],
        );
      }
      const kind = r.pick(["hitrost", "fotoni", "izstopno"]);
      if (kind === "hitrost") {
        const lmax = (H * C) / (Mt.A * E0) * 1e9;
        const l = r.int(150, Math.floor(lmax) - 20);
        const Wk = Ef(l) - Mt.A;
        const v = Math.sqrt((2 * Wk * E0) / ME) / 1000;
        return T(
          `Iz ${Mt.name} (izstopno delo $${tx(Mt.A)}\\ \\mathrm{eV}$) svetloba z valovno dolžino $${l}\\ \\mathrm{nm}$ izbija elektrone. Kolikšna je največja hitrost izbitih elektronov? ${cs.slice(0, -1)}, $m_e = 9{,}11 \\cdot 10^{-31}\\ \\mathrm{kg}$) Rezultat zapiši v km/s in zaokroži na celo število.`,
          num(v, "km/s", 0, [M(Math.sqrt((2 * Ef(l) * E0) / ME) / 1000, "Najprej od energije fotona odštej izstopno delo."), M(Math.sqrt((Wk * E0) / ME) / 1000, "Iz $W_k = \\frac{m v^2}{2}$ sledi $v = \\sqrt{2W_k/m}$."), M(v * 1000, "Rezultat pretvori v km/s.")]),
          "Izračunaj največjo kinetično energijo elektronov (v J), nato hitrost.",
          [dat("\\lambda", l, "nm"), dat("A_i", tx(Mt.A), "eV"), ...gi, K.me],
          ["v_{max}"],
          ["W_{k,max} = \\dfrac{hc}{\\lambda} - A_i", "v = \\sqrt{\\dfrac{2W_{k,max}}{m_e}}"],
          [`$W_{k,max} = ${tx(Ef(l), 3)} - ${tx(Mt.A)}\\ \\mathrm{eV} ${res(Wk, 3, "eV")} \\approx ${qty(sci(Wk * E0, 3), "J")}$`, `$v = \\sqrt{\\dfrac{2 \\cdot ${sci(Wk * E0, 3)}}{9{,}11 \\cdot 10^{-31}}}\\ \\mathrm{m/s} \\approx ${qty(sci(v * 1000, 3), "m/s")}$`, `$v ${res(v, 0, "km/s")}$`],
        );
      }
      if (kind === "fotoni") {
        const P = r.pick([0.5, 1, 1.5, 2, 3, 5]);
        const L = r.pick([405, 450, 532, 633, 650]);
        const N = (P * 1e-3 * L * 1e-9) / (H * C);
        const ex = Math.floor(Math.log10(N));
        const x = N / 10 ** ex;
        return T(
          `Laserski kazalnik z močjo $${qty(tx(P), "mW")}$ oddaja svetlobo z valovno dolžino $${L}\\ \\mathrm{nm}$. Koliko fotonov odda v eni sekundi? Rezultat zapiši kot $x \\cdot 10^{${ex}}$ in vpiši $x$, zaokrožen na dve decimalki. ($h = 6{,}63 \\cdot 10^{-34}\\ \\mathrm{Js}$, $c = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s}$)`,
          num(x, "", 2, [M(((P * L * 1e-9) / (H * C)) / 10 ** ex, "Moč pretvori v vate ($1\\ \\mathrm{mW} = 10^{-3}\\ \\mathrm{W}$)."), M((P * 1e-3 * L) / (H * C) / 10 ** ex, "Valovno dolžino pretvori v metre ($1\\ \\mathrm{nm} = 10^{-9}\\ \\mathrm{m}$).")]),
          "Izračunaj energijo enega fotona; število fotonov na sekundo je moč, deljena s to energijo.",
          [dat("P", tx(P), "mW"), dat("\\lambda", L, "nm"), K.h, K.c],
          ["N"],
          ["W_f = \\dfrac{hc}{\\lambda}", "N = \\dfrac{P t}{W_f}"],
          [`$W_f = \\dfrac{hc}{\\lambda} \\approx ${qty(sci((H * C) / (L * 1e-9), 3), "J")}$`, `$N = \\dfrac{${tx(P)} \\cdot 10^{-3}\\ \\mathrm{J}}{${sci((H * C) / (L * 1e-9), 3)}\\ \\mathrm{J}} \\approx ${sci(N, 3)}$`, `$x ${eq(x, 2)} ${tx(x, 2)}$`],
        );
      }
      const A = r.dec(1.9, 4.5, 2);
      const l = r.int(180, Math.floor((H * C) / (A * E0) * 1e9) - 30);
      const U = roundHalfUp(Ef(l) - A, 2);
      const Ax = Ef(l) - U;
      return T(
        `${n} osvetli fotocelico s svetlobo z valovno dolžino $${l}\\ \\mathrm{nm}$ in izmeri zaporno napetost $${qty(tx(U, 2), "V")}$. Kolikšno je izstopno delo kovine na katodi? ${cs} Rezultat zapiši v eV in zaokroži na dve decimalki.`,
        num(Ax, "eV", 2, [M(Ef(l) + U, "Kinetično energijo elektronov od energije fotona odštej, ne prištej."), M(U, "Zaporna napetost določa kinetično energijo elektronov, ne izstopnega dela.")]),
        "Iz zaporne napetosti dobiš največjo kinetično energijo elektronov ($e_0 U_z$), iz valovne dolžine energijo fotona.",
        [dat("\\lambda", l, "nm"), dat("U_z", tx(U, 2), "V"), ...gi],
        ["A_i"],
        ["\\dfrac{hc}{\\lambda} = A_i + e_0 U_z"],
        [`$W_f = \\dfrac{hc}{\\lambda} ${res(Ef(l), 3, "eV")}$`, `$W_{k,max} = e_0 U_z = ${qty(tx(U, 2), "eV")}$`, `$A_i = W_f - W_{k,max} ${res(Ax, 2, "eV")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-atom",
    topics: ["FIZ-SS-4/atom"],
    gen(level, r) {
      const n = ime(r);
      const En = (k) => -13.6 / (k * k);
      const hc = (H * C) / E0 * 1e9; // eV·nm
      const cs = "($h = 6{,}63 \\cdot 10^{-34}\\ \\mathrm{Js}$, $c = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s}$, $e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$)";
      const gi = [K.h, K.c, K.e0];
      if (level === 1) {
        if (r.next() < 0.5) {
          const k = r.int(2, 7);
          return T(
            `Energija elektrona v vodikovem atomu je $E_n = E_1/n^2$, kjer je $E_1 = -13{,}6\\ \\mathrm{eV}$. Kolikšna je energija v stanju z $n = ${k}$? Zaokroži na dve decimalki.`,
            num(En(k), "eV", 2, [M(-13.6 / k, "Kvantno število je v imenovalcu kvadrirano."), M(-En(k), "Energija vezanega elektrona je negativna.")]),
            "Vstavi kvantno število v formulo; pazi na kvadrat in predznak.",
            [`n = ${k}`, "E_1 = -13{,}6\\ \\mathrm{eV}"],
            ["E_n"],
            ["E_n = -\\dfrac{13{,}6\\ \\mathrm{eV}}{n^2}"],
            [`$n^2 = ${k * k}$`, `$E_${k} = -\\dfrac{13{,}6}{${k * k}}\\ \\mathrm{eV} ${res(En(k), 2, "eV")}$`],
          );
        }
        const A = r.pick([
          { name: "natrijevem", lv: [-5.14, -3.03, -1.95, -1.52] },
          { name: "živosrebrovem", lv: [-10.44, -5.54, -3.74, -2.72] },
          { name: "neonovem", lv: [-21.56, -4.94, -3.0, -1.84] },
          { name: "helijevem", lv: [-24.59, -4.77, -3.62, -1.6] },
        ]);
        const i = r.int(1, 3);
        const j = r.int(0, i - 1);
        const E = A.lv[i] - A.lv[j];
        return T(
          `V ${A.name} atomu preide elektron iz nivoja z energijo $${qty(tx(A.lv[i]), "eV")}$ na nivo z energijo $${qty(tx(A.lv[j]), "eV")}$. Kolikšno energijo ima izsevani foton? Zaokroži na dve decimalki.`,
          num(E, "eV", 2, [M(A.lv[i] + A.lv[j], "Energija fotona je razlika energij nivojev, ne vsota."), M(-E, "Energija fotona je pozitivna – odštej nižjo energijo od višje.")]),
          "Foton odnese razliko energij med začetnim in končnim nivojem.",
          [dat("E_z", tx(A.lv[i]), "eV"), dat("E_k", tx(A.lv[j]), "eV")],
          ["W_f"],
          ["W_f = E_z - E_k"],
          [`$W_f = E_z - E_k = ${tx(A.lv[i])} - (${tx(A.lv[j])})\\ \\mathrm{eV}$`, `$W_f ${res(E, 2, "eV")}$`],
        );
      }
      if (level === 2) {
        const nf = r.pick([1, 2, 2, 3]);
        const ni = r.int(nf + 1, nf + 4);
        const E = En(ni) - En(nf);
        const l = hc / E;
        const ser = { 1: "Lymanova", 2: "Balmerjeva", 3: "Paschenova" }[nf];
        return T(
          `Elektron v vodikovem atomu preide iz stanja $n = ${ni}$ v stanje $n = ${nf}$ (${ser} serija). Kolikšna je valovna dolžina izsevane svetlobe? $E_n = -13{,}6\\ \\mathrm{eV}/n^2$, ${cs}. Zaokroži na celo število.`,
          num(l, "nm", 0, [M(hc / (13.6 * (1 / nf - 1 / ni)), "V formuli za energijo nastopa $n^2$."), M(hc / Math.abs(En(ni)), "Energija fotona je razlika energij obeh stanj.")]),
          "Izračunaj energiji obeh stanj, nato energijo fotona in iz nje valovno dolžino.",
          [`n_z = ${ni}`, `n_k = ${nf}`, ...gi],
          ["\\lambda"],
          ["E_n = -\\dfrac{13{,}6\\ \\mathrm{eV}}{n^2}", "W_f = E_z - E_k = \\dfrac{hc}{\\lambda}"],
          [`$E_${ni} ${res(En(ni), 3, "eV")},\\quad E_${nf} ${res(En(nf), 3, "eV")}$`, `$W_f = E_${ni} - E_${nf} ${res(E, 3, "eV")} \\approx ${qty(sci(E * E0, 3), "J")}$`, `$\\lambda = \\dfrac{hc}{W_f} ${res(l, 0, "nm")}$`],
        );
      }
      const kind = r.pick(["absorpcija", "ionizacija", "crte"]);
      if (kind === "absorpcija") {
        const n0 = r.pick([1, 2]);
        const nk = r.int(n0 + 1, n0 + 4);
        const l = roundHalfUp(hc / (En(nk) - En(n0)), 1);
        const Ex = hc / l;
        const nr = Math.sqrt(-13.6 / (En(n0) + Ex));
        return T(
          `Vodikov atom v stanju $n = ${n0}$ absorbira foton z valovno dolžino $${qty(tx(l, 1), "nm")}$. V katero stanje (kvantno število $n$) preide elektron? $E_n = -13{,}6\\ \\mathrm{eV}/n^2$, ${cs}.`,
          num(Math.round(nr), "", null, [M(n0 > 1 && Math.abs(Math.sqrt(-13.6 / (-13.6 + Ex)) - Math.round(Math.sqrt(-13.6 / (-13.6 + Ex)))) < 0.1 ? Math.round(Math.sqrt(-13.6 / (-13.6 + Ex))) : NaN, `Elektron je na začetku v stanju $n = ${n0}$, ne v osnovnem.`), M(Math.round(nr) - n0, "Iščemo kvantno število končnega stanja, ne števila preskočenih nivojev.")], { tolerance: 1e-9 }),
          "Energijo fotona prištej energiji začetnega stanja in poišči, kateremu $n$ ustreza vsota.",
          [`n_z = ${n0}`, dat("\\lambda", tx(l, 1), "nm"), ...gi],
          ["n_k"],
          ["W_f = \\dfrac{hc}{\\lambda}", "E_{n_k} = E_{n_z} + W_f", "n_k = \\sqrt{\\dfrac{-13{,}6\\ \\mathrm{eV}}{E_{n_k}}}"],
          [`$W_f = \\dfrac{hc}{\\lambda} ${res(Ex, 3, "eV")}$`, `$E_{n_k} = ${tx(En(n0), 2)} + ${tx(Ex, 3)}\\ \\mathrm{eV} ${res(En(n0) + Ex, 3, "eV")}$`, `$n_k = \\sqrt{\\dfrac{13{,}6}{${tx(-(En(n0) + Ex), 3)}}} \\approx ${tx(nr, 2)} \\Rightarrow n_k = ${Math.round(nr)}$`],
        );
      }
      if (kind === "ionizacija") {
        const k = r.int(1, 4);
        const l = hc / (13.6 / (k * k));
        return T(
          `Kolikšna je največja valovna dolžina svetlobe, ki še lahko ionizira vodikov atom v stanju $n = ${k}$? $E_n = -13{,}6\\ \\mathrm{eV}/n^2$, ${cs}. Zaokroži na celo število.`,
          num(l, "nm", 0, [M(k > 1 ? hc / 13.6 : NaN, "Atom ni v osnovnem stanju – ionizacijska energija je $|E_n|$ za dano stanje."), M(hc / (13.6 / k), "Pri energiji stanja je $n$ kvadriran.")]),
          "Za ionizacijo mora foton elektronu dati vsaj toliko energije, da doseže $E = 0$.",
          [`n = ${k}`, ...gi],
          ["\\lambda_{max}"],
          ["W_{ion} = |E_n| = \\dfrac{13{,}6\\ \\mathrm{eV}}{n^2}", "\\lambda_{max} = \\dfrac{hc}{W_{ion}}"],
          [`$W_{ion} = \\dfrac{13{,}6}{${k * k}}\\ \\mathrm{eV} ${res(13.6 / (k * k), 3, "eV")}$`, `$\\lambda_{max} = \\dfrac{hc}{W_{ion}} ${res(l, 0, "nm")}$`],
        );
      }
      const k = r.int(3, 7);
      const lines = (k * (k - 1)) / 2;
      return T(
        `Plin vodikovih atomov vzbudimo tako, da so elektroni v stanju $n = ${k}$. Koliko različnih spektralnih črt lahko opazimo, ko se atomi (lahko tudi v več korakih) vračajo v osnovno stanje?`,
        num(lines, "", null, [M(k - 1, "Elektron lahko preskoči tudi več nivojev hkrati ali se vrača po korakih – štej vse pare nivojev."), M(k * (k - 1), "Vsak par nivojev da eno črto; vsakega para ne štej dvakrat.")], { tolerance: 1e-9 }),
        "Vsak prehod med dvema različnima nivojema (od 1 do $n$) da svojo črto. Preštej vse pare.",
        [`n = ${k}`],
        ["N"],
        ["N = \\dfrac{n(n-1)}{2}"],
        [`Prehodi so možni med vsemi pari nivojev $1, 2, \\dots, ${k}$.`, `$N = \\dfrac{${k} \\cdot ${k - 1}}{2} = ${lines}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-razpolovni-cas",
    topics: ["FIZ-SS-4/jedro-in-radioaktivnost"],
    gen(level, r) {
      const n = ime(r);
      const ISO = [
        { name: "jod-131", gen: "joda-131", t: 8.0, u: "dni", tu: "dan" },
        { name: "radon-222", gen: "radona-222", t: 3.8, u: "dni", tu: "dan" },
        { name: "fosfor-32", gen: "fosforja-32", t: 14.3, u: "dni", tu: "dan" },
        { name: "cezij-137", gen: "cezija-137", t: 30, u: "let", tu: "leto" },
        { name: "kobalt-60", gen: "kobalta-60", t: 5.3, u: "let", tu: "leto" },
        { name: "stroncij-90", gen: "stroncija-90", t: 28.8, u: "let", tu: "leto" },
        { name: "tehnecij-99m", gen: "tehnecija-99m", t: 6.0, u: "h", tu: "h" },
      ];
      const I = r.pick(ISO);
      const ut = I.u === "h" ? "\\mathrm{h}" : `\\text{${I.u}}`;
      const unit = I.u === "h" ? "h" : I.u;
      const ualt = I.u === "dni" ? ["dan", "dneva", "d"] : I.u === "let" ? ["leta", "leto", "l"] : ["ur", "ure"];
      if (level === 1) {
        const k = r.int(1, 5);
        const m0 = r.int(2, 40) * 10;
        const tt = k * I.t;
        const m = m0 / 2 ** k;
        return T(
          `Vzorec vsebuje $${m0}\\ \\mathrm{mg}$ radioaktivnega izotopa ${I.gen} z razpolovnim časom $${tx(I.t)}\\ ${ut}$. Koliko tega izotopa ostane po $${tx(tt)}\\ ${ut}$? Zaokroži na dve decimalki.`,
          num(m, "mg", 2, [M(m0 / (2 * k), "V vsakem razpolovnem času se količina razpolovi – to ni deljenje z $2k$, ampak z $2^k$."), M(m0 - m, "To je razpadla količina; vprašanje sprašuje, koliko ostane."), M(m0 * (1 - k / (k + 1)), "Razpad ni linearen – po vsakem razpolovnem času ostane polovica prejšnje količine.")]),
          "Najprej izračunaj, koliko razpolovnih časov je minilo.",
          [dat("m_0", m0, "mg"), `t_{1/2} = ${tx(I.t)}\\ ${ut}`, `t = ${tx(tt)}\\ ${ut}`],
          ["m"],
          ["m = m_0 \\cdot 2^{-t/t_{1/2}}"],
          [`$\\dfrac{t}{t_{1/2}} = \\dfrac{${tx(tt)}}{${tx(I.t)}} = ${k}$`, `$m = ${m0}\\ \\mathrm{mg} \\cdot 2^{-${k}} = \\dfrac{${m0}}{${2 ** k}}\\ \\mathrm{mg} ${res(m, 2, "mg")}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const m0 = r.int(2, 50) * 10;
          const tt = r.dec(I.t * 0.3, I.t * 4, 1);
          const m = m0 * 2 ** (-tt / I.t);
          return T(
            `${n} ima vzorec z $${m0}\\ \\mathrm{mg}$ izotopa ${I.gen} ($t_{1/2} = ${tx(I.t)}\\ ${ut}$). Koliko ga ostane po $${tx(tt)}\\ ${ut}$? Zaokroži na eno decimalko.`,
            num(m, "mg", 1, [M(m0 * (1 - tt / (2 * I.t)), "Razpad ni linearen; uporabi eksponentni zakon."), M(m0 * 2 ** (-I.t / tt), "V eksponentu je $t/t_{1/2}$, ne obratno.")]),
            "Uporabi zakon razpada; eksponent $t/t_{1/2}$ ni nujno celo število.",
            [dat("m_0", m0, "mg"), `t_{1/2} = ${tx(I.t)}\\ ${ut}`, `t = ${tx(tt)}\\ ${ut}`],
            ["m"],
            ["m = m_0 \\cdot 2^{-t/t_{1/2}}"],
            [`$\\dfrac{t}{t_{1/2}} = \\dfrac{${tx(tt)}}{${tx(I.t)}} \\approx ${tx(tt / I.t, 4)}$`, `$m = ${m0} \\cdot 2^{-${tx(tt / I.t, 4)}}\\ \\mathrm{mg} ${res(m, 1, "mg")}$`],
          );
        }
        const A0 = r.int(2, 80) * 10;
        const tday = r.dec(0.5, 2, 1);
        const th = 6.0;
        const A = A0 * 2 ** (-(tday * 24) / th);
        return T(
          `Bolnik prejme zdravilo s tehnecijem-99m ($t_{1/2} = 6{,}0\\ \\mathrm{h}$) z aktivnostjo $${A0}\\ \\mathrm{MBq}$. Kolikšna je aktivnost po $${tx(tday)}$ dneva? Zaokroži na dve decimalki.`,
          num(A, "MBq", 2, [M(A0 * 2 ** (-tday / th), "Čas in razpolovni čas morata biti v isti enoti – dneve pretvori v ure."), M(A0 * (1 - (tday * 24) / (2 * th)), "Aktivnost pada eksponentno, ne linearno.")]),
          "Čas pretvori v ure, nato uporabi zakon razpada za aktivnost.",
          [dat("A_0", A0, "MBq"), dat("t_{1/2}", "6{,}0", "h"), `t = ${tx(tday)}\\ \\text{dneva}`],
          ["A"],
          ["A = A_0 \\cdot 2^{-t/t_{1/2}}"],
          [`$t = ${tx(tday)} \\cdot 24\\ \\mathrm{h} = ${qty(tx(tday * 24), "h")}$`, `$\\dfrac{t}{t_{1/2}} = \\dfrac{${tx(tday * 24)}}{6} = ${tx((tday * 24) / 6, 2)}$`, `$A = ${A0} \\cdot 2^{-${tx((tday * 24) / 6, 2)}}\\ \\mathrm{MBq} ${res(A, 2, "MBq")}$`],
        );
      }
      if (r.next() < 0.5) {
        const p = r.int(5, 90);
        const tt = 5730 * Math.log2(100 / p);
        const what = r.pick(["kos lesa iz kolišča", "kost iz jame", "oglje iz ognjišča", "platno iz grobnice"]);
        return T(
          `${what[0].toUpperCase() + what.slice(1)} vsebuje še $${p}\\ \\%$ prvotne količine ogljika-14 ($t_{1/2} = 5730$ let). Koliko je star? Zaokroži na celo število let.`,
          num(tt, "let", 0, [M(5730 * ((100 - p) / 50), "Razpad ni linearen – uporabi logaritem."), M(5730 * Math.log2(p / 100) * -1 * (p / 100), "Iz $\\frac{N}{N_0} = 2^{-t/t_{1/2}}$ izrazi $t = t_{1/2}\\log_2\\frac{N_0}{N}$."), M(5730 * Math.log10(100 / p), "Uporabi dvojiški logaritem ($\\log_2$) ali $\\ln$ v razmerju z $\\ln 2$.")], { unitAlternatives: ["leta", "leto", "l"] }),
          "Zapiši zakon razpada za delež preostalih jeder in ga logaritmiraj.",
          [`\\dfrac{N}{N_0} = ${p}\\ \\%`, "t_{1/2} = 5730\\ \\text{let}"],
          ["t"],
          ["\\dfrac{N}{N_0} = 2^{-t/t_{1/2}}", "t = t_{1/2} \\cdot \\dfrac{\\ln(N_0/N)}{\\ln 2}"],
          [`$\\dfrac{N_0}{N} = \\dfrac{1}{${tx(p / 100)}} \\approx ${tx(100 / p, 4)}$`, `$t = 5730 \\cdot \\dfrac{\\ln ${tx(100 / p, 4)}}{\\ln 2}\\ \\text{let} ${eq(tt, 0)} ${tx(tt, 0)}\\ \\text{let}$`],
        );
      }
      const A0 = r.int(20, 900);
      const th = r.dec(1, 20, 1);
      const tt = r.dec(th * 0.5, th * 3, 1);
      const A = roundHalfUp(A0 * 2 ** (-tt / th), 0);
      if (A < 2 || A >= A0) return null;
      const thx = (tt * Math.LN2) / Math.log(A0 / A);
      return T(
        `${n} z Geiger-Müllerjevim števcem izmeri aktivnost vzorca $${A0}\\ \\mathrm{Bq}$, po $${tx(tt)}\\ \\mathrm{h}$ pa le še $${A}\\ \\mathrm{Bq}$. Kolikšen je razpolovni čas izotopa? Zaokroži na eno decimalko.`,
        num(thx, "h", 1, [M((tt * A) / A0, "Razpad ni linearen – uporabi logaritem."), M((tt * Math.log(A0 / A)) / Math.LN2, "Si obrnil ulomek? $t_{1/2} = t \\ln 2 / \\ln(A_0/A)$.")], { unitAlternatives: ["ur", "ure"] }),
        "Zapiši $\\dfrac{A}{A_0} = 2^{-t/t_{1/2}}$, logaritmiraj in izrazi $t_{1/2}$.",
        [dat("A_0", A0, "Bq"), dat("A", A, "Bq"), dat("t", tx(tt), "h")],
        ["t_{1/2}"],
        ["\\dfrac{A}{A_0} = 2^{-t/t_{1/2}}", "t_{1/2} = \\dfrac{t \\ln 2}{\\ln(A_0/A)}"],
        [`$\\dfrac{A_0}{A} = \\dfrac{${A0}}{${A}} \\approx ${tx(A0 / A, 4)}$`, `$t_{1/2} = \\dfrac{${tx(tt)} \\cdot \\ln 2}{\\ln ${tx(A0 / A, 4)}}\\ \\mathrm{h} ${res(thx, 1, "h")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-jedrske-reakcije",
    topics: ["FIZ-SS-4/jedro-in-radioaktivnost"],
    gen(level, r) {
      const n = ime(r);
      const U_MEV = 931.5;
      if (level === 1) {
        const P = r.pick([
          { s: "U", A: 238, Z: 92 },
          { s: "Ra", A: 226, Z: 88 },
          { s: "Po", A: 210, Z: 84 },
          { s: "Th", A: 232, Z: 90 },
          { s: "Rn", A: 222, Z: 86 },
          { s: "Am", A: 241, Z: 95 },
          { s: "C", A: 14, Z: 6, b: true },
          { s: "Co", A: 60, Z: 27, b: true },
          { s: "Sr", A: 90, Z: 38, b: true },
          { s: "I", A: 131, Z: 53, b: true },
          { s: "Cs", A: 137, Z: 55, b: true },
        ]);
        const alpha = !P.b;
        const askA = r.next() < 0.5;
        const ans = alpha ? (askA ? P.A - 4 : P.Z - 2) : askA ? P.A : P.Z + 1;
        const mist = alpha ? (askA ? [M(P.A - 2, "Delec alfa je helijevo jedro z masnim številom 4."), M(P.A, "Pri razpadu alfa jedro izgubi 4 nukleone.")] : [M(P.Z - 4, "Delec alfa ima vrstno število 2 (dva protona)."), M(P.Z, "Pri razpadu alfa jedro izgubi dva protona.")]) : askA ? [M(P.A - 1, "Pri razpadu beta minus se nevtron spremeni v proton – število nukleonov ostane enako."), M(P.A + 1, "Število nukleonov se pri razpadu beta ne spremeni.")] : [M(P.Z - 1, "Pri razpadu beta minus nastane elektron in jedro dobi proton – vrstno število se poveča."), M(P.Z, "Nevtron se spremeni v proton, zato se vrstno število spremeni.")];
        return T(
          `Jedro $^{${P.A}}_{${P.Z}}\\mathrm{${P.s}}$ razpade z razpadom ${alpha ? "alfa" : "beta minus"}. Kolikšno je ${askA ? "masno število" : "vrstno (protonsko) število"} nastalega jedra?`,
          num(ans, "", null, mist, { tolerance: 1e-9 }),
          alpha ? "Delec alfa je jedro $^4_2\\mathrm{He}$. Masno in vrstno število se pri jedrskih reakcijah ohranjata." : "Pri razpadu beta minus se v jedru nevtron spremeni v proton in elektron ($^{\\ 0}_{-1}\\mathrm{e}$).",
          [`\\text{jedro} = {}^{${P.A}}_{${P.Z}}\\mathrm{${P.s}}`],
          [askA ? "A'" : "Z'"],
          [alpha ? "^{A}_{Z}\\mathrm{X} \\to {}^{A-4}_{Z-2}\\mathrm{Y} + {}^4_2\\mathrm{He}" : "^{A}_{Z}\\mathrm{X} \\to {}^{A}_{Z+1}\\mathrm{Y} + {}^{\\ 0}_{-1}\\mathrm{e} + \\bar\\nu"],
          [alpha ? `$^{${P.A}}_{${P.Z}}\\mathrm{${P.s}} \\to {}^{${P.A - 4}}_{${P.Z - 2}}\\mathrm{Y} + {}^4_2\\mathrm{He}$` : `$^{${P.A}}_{${P.Z}}\\mathrm{${P.s}} \\to {}^{${P.A}}_{${P.Z + 1}}\\mathrm{Y} + {}^{\\ 0}_{-1}\\mathrm{e} + \\bar\\nu$`, `${askA ? "Masno" : "Vrstno"} število nastalega jedra: $${ans}$`],
        );
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const R = r.pick([
            { eq: "^2_1\\mathrm{H} + {}^3_1\\mathrm{H} \\to {}^4_2\\mathrm{He} + {}^1_0\\mathrm{n}", L: [2.014102, 3.016049], Rr: [4.002603, 1.008665], name: "zlitju devterija in tritija" },
            { eq: "^{226}_{88}\\mathrm{Ra} \\to {}^{222}_{86}\\mathrm{Rn} + {}^4_2\\mathrm{He}", L: [226.02541], Rr: [222.017578, 4.002603], name: "razpadu radija-226" },
            { eq: "^{210}_{84}\\mathrm{Po} \\to {}^{206}_{82}\\mathrm{Pb} + {}^4_2\\mathrm{He}", L: [209.982874], Rr: [205.974465, 4.002603], name: "razpadu polonija-210" },
            { eq: "^{238}_{92}\\mathrm{U} \\to {}^{234}_{90}\\mathrm{Th} + {}^4_2\\mathrm{He}", L: [238.050788], Rr: [234.043601, 4.002603], name: "razpadu urana-238" },
            { eq: "^2_1\\mathrm{H} + {}^2_1\\mathrm{H} \\to {}^3_2\\mathrm{He} + {}^1_0\\mathrm{n}", L: [2.014102, 2.014102], Rr: [3.016029, 1.008665], name: "zlitju dveh devteronov" },
            { eq: "^{6}_{3}\\mathrm{Li} + {}^1_0\\mathrm{n} \\to {}^{4}_{2}\\mathrm{He} + {}^3_1\\mathrm{H}", L: [6.015123, 1.008665], Rr: [4.002603, 3.016049], name: "reakciji litija-6 z nevtronom" },
          ]);
          const dm = R.L.reduce((a, b) => a + b, 0) - R.Rr.reduce((a, b) => a + b, 0);
          const E = dm * U_MEV;
          const fm = (x) => tx(x, 6);
          return T(
            `Koliko energije se sprosti pri ${R.name}: $${R.eq}$? Mase: ${R.L.map(fm).concat(R.Rr.map(fm)).map((x) => `$${x}\\ \\mathrm{u}$`).join(", ")} (v vrstnem redu v enačbi). $1\\ \\mathrm{u}$ ustreza $931{,}5\\ \\mathrm{MeV}$. Zaokroži na dve decimalki.`,
            num(E, "MeV", 2, [M(-E, "Masa produktov je manjša od mase reaktantov – sproščena energija je pozitivna."), M(dm, "Masni primanjkljaj pretvori v energijo ($1\\ \\mathrm{u} \\to 931{,}5\\ \\mathrm{MeV}$).")]),
            "Izračunaj, za koliko je masa produktov manjša od mase reaktantov (masni primanjkljaj), in ga pretvori v energijo.",
            [`m_{pred} = ${R.L.map(fm).join(" + ")}\\ \\mathrm{u}`, `m_{po} = ${R.Rr.map(fm).join(" + ")}\\ \\mathrm{u}`, "1\\ \\mathrm{u} \\cdot c^2 = 931{,}5\\ \\mathrm{MeV}"],
            ["W"],
            ["\\Delta m = m_{pred} - m_{po}", "W = \\Delta m\\, c^2"],
            [`$m_{pred} = ${fm(R.L.reduce((a, b) => a + b, 0))}\\ \\mathrm{u},\\ m_{po} = ${fm(R.Rr.reduce((a, b) => a + b, 0))}\\ \\mathrm{u}$`, `$\\Delta m = ${fm(dm)}\\ \\mathrm{u}$`, `$W = ${fm(dm)} \\cdot 931{,}5\\ \\mathrm{MeV} ${res(E, 2, "MeV")}$`],
          );
        }
        const N = r.pick([
          { s: "He", A: 4, Z: 2, m: 4.002603, name: "helija-4" },
          { s: "Li", A: 7, Z: 3, m: 7.016003, name: "litija-7" },
          { s: "C", A: 12, Z: 6, m: 12.0, name: "ogljika-12" },
          { s: "O", A: 16, Z: 8, m: 15.994915, name: "kisika-16" },
          { s: "Fe", A: 56, Z: 26, m: 55.934937, name: "železa-56" },
          { s: "N", A: 14, Z: 7, m: 14.003074, name: "dušika-14" },
        ]);
        const perN = r.next() < 0.5;
        const dm = N.Z * 1.007825 + (N.A - N.Z) * 1.008665 - N.m;
        const E = dm * U_MEV;
        const ans = perN ? E / N.A : E;
        return T(
          `Kolikšna je vezavna energija ${perN ? "na nukleon " : ""}jedra ${N.name} ($^{${N.A}}_{${N.Z}}\\mathrm{${N.s}}$)? Masa atoma je $${tx(N.m, 6)}\\ \\mathrm{u}$, masa vodikovega atoma $1{,}007825\\ \\mathrm{u}$, nevtrona $1{,}008665\\ \\mathrm{u}$; $1\\ \\mathrm{u}$ ustreza $931{,}5\\ \\mathrm{MeV}$. Zaokroži na dve decimalki.`,
          num(ans, "MeV", 2, perN ? [M(E, "To je celotna vezavna energija; deli jo še s številom nukleonov."), M(E / N.Z, "Deli s številom vseh nukleonov $A$, ne le protonov.")] : [M(E / N.A, "To je vezavna energija na nukleon; vprašanje sprašuje po celotni."), M((N.A * 1.008665 - N.m) * U_MEV, "Jedro ima $Z$ protonov in $A - Z$ nevtronov – ne štej vseh nukleonov kot nevtrone.")]),
          "Seštej mase prostih protonov (vodikovih atomov) in nevtronov ter odštej maso atoma; razlika je masni primanjkljaj.",
          [`A = ${N.A},\\ Z = ${N.Z}`, `m_{at} = ${tx(N.m, 6)}\\ \\mathrm{u}`, "m_H = 1{,}007825\\ \\mathrm{u}", "m_n = 1{,}008665\\ \\mathrm{u}"],
          [perN ? "W_v / A" : "W_v"],
          ["\\Delta m = Z m_H + (A - Z) m_n - m_{at}", "W_v = \\Delta m\\, c^2"],
          [`$\\Delta m = ${N.Z} \\cdot 1{,}007825 + ${N.A - N.Z} \\cdot 1{,}008665 - ${tx(N.m, 6)}\\ \\mathrm{u} = ${qty(tx(dm, 6), "u")}$`, `$W_v = ${tx(dm, 6)} \\cdot 931{,}5\\ \\mathrm{MeV} ${res(E, 2, "MeV")}$`, ...(perN ? [`$\\dfrac{W_v}{A} = \\dfrac{${tx(E, 2)}}{${N.A}}\\ \\mathrm{MeV} ${res(ans, 2, "MeV")}$`] : [])],
        );
      }
      if (r.next() < 0.5) {
        const Ch = r.pick([
          { a: "^{238}_{92}\\mathrm{U}", b: "^{206}_{82}\\mathrm{Pb}", A1: 238, Z1: 92, A2: 206, Z2: 82 },
          { a: "^{232}_{90}\\mathrm{Th}", b: "^{208}_{82}\\mathrm{Pb}", A1: 232, Z1: 90, A2: 208, Z2: 82 },
          { a: "^{235}_{92}\\mathrm{U}", b: "^{207}_{82}\\mathrm{Pb}", A1: 235, Z1: 92, A2: 207, Z2: 82 },
          { a: "^{226}_{88}\\mathrm{Ra}", b: "^{206}_{82}\\mathrm{Pb}", A1: 226, Z1: 88, A2: 206, Z2: 82 },
          { a: "^{237}_{93}\\mathrm{Np}", b: "^{209}_{83}\\mathrm{Bi}", A1: 237, Z1: 93, A2: 209, Z2: 83 },
          { a: "^{222}_{86}\\mathrm{Rn}", b: "^{210}_{82}\\mathrm{Pb}", A1: 222, Z1: 86, A2: 210, Z2: 82 },
        ]);
        const na = (Ch.A1 - Ch.A2) / 4;
        const nb = Ch.Z2 - (Ch.Z1 - 2 * na);
        const askB = r.next() < 0.6;
        return T(
          `Razpadna vrsta se začne z jedrom $${Ch.a}$ in konča s stabilnim $${Ch.b}$; vmes so le razpadi alfa in beta minus. Koliko razpadov ${askB ? "beta minus" : "alfa"} je v tej vrsti?`,
          num(askB ? nb : na, "", null, askB ? [M(Ch.Z1 - Ch.Z2, "Upoštevaj, da vsak razpad alfa zmanjša vrstno število za 2 – najprej preštej razpade alfa."), M(na, "To je število razpadov alfa.")] : [M(Ch.A1 - Ch.A2, "Vsak razpad alfa zmanjša masno število za 4, ne za 1."), M((Ch.A1 - Ch.A2) / 2, "Masno število se pri razpadu alfa zmanjša za 4.")], { tolerance: 1e-9 }),
          "Masno število spreminjajo le razpadi alfa (za 4). Ko poznaš število razpadov alfa, iz vrstnega števila izračunaj število razpadov beta.",
          [`\\text{začetno jedro} = {}${Ch.a}`, `\\text{končno jedro} = {}${Ch.b}`],
          [askB ? "N_\\beta" : "N_\\alpha"],
          ["A_1 - 4N_\\alpha = A_2", "Z_1 - 2N_\\alpha + N_\\beta = Z_2"],
          [`$N_\\alpha = \\dfrac{${Ch.A1} - ${Ch.A2}}{4} = ${na}$`, `$Z = ${Ch.Z1} - 2 \\cdot ${na} = ${Ch.Z1 - 2 * na}$`, `$N_\\beta = ${Ch.Z2} - ${Ch.Z1 - 2 * na} = ${nb}$`],
        );
      }
      const P = r.int(5, 40) * 100;
      const Ef = 200;
      const E = P * 1e6 * 86400;
      const Nn = E / (Ef * 1e6 * E0);
      const m = (Nn / 6.02e23) * 235;
      return T(
        `Jedrski reaktor ima toplotno moč $${P}\\ \\mathrm{MW}$. Pri vsaki cepitvi jedra urana-235 se sprosti približno $200\\ \\mathrm{MeV}$. Koliko gramov urana-235 se razcepi v enem dnevu? ($e_0 = 1{,}60 \\cdot 10^{-19}\\ \\mathrm{As}$, $N_A = 6{,}02 \\cdot 10^{23}\\ \\mathrm{mol^{-1}}$, $M = 235\\ \\mathrm{g/mol}$) Zaokroži na celo število.`,
        num(m, "g", 0, [M((P * 1e6 * 3600) / (Ef * 1e6 * E0) / 6.02e23 * 235, "En dan ima $86\\,400\\ \\mathrm{s}$, ne $3600\\ \\mathrm{s}$."), M(m * 1e6, "Energijo cepitve pretvori iz MeV v J.")]),
        "Izračunaj energijo, ki jo reaktor odda v enem dnevu, nato število cepitev in iz njega maso urana.",
        [dat("P", P, "MW"), dat("W_1", 200, "MeV"), dat("t", 1, "dan"), K.e0, "N_A = 6{,}02 \\cdot 10^{23}\\ \\mathrm{mol^{-1}}", dat("M", 235, "g/mol")],
        ["m"],
        ["W = P t", "N = \\dfrac{W}{W_1}", "m = \\dfrac{N}{N_A} M"],
        [`$W = P t = ${P} \\cdot 10^6\\ \\mathrm{W} \\cdot 86\\,400\\ \\mathrm{s} \\approx ${qty(sci(E, 3), "J")}$`, `$W_1 = 200 \\cdot 10^6 \\cdot 1{,}60 \\cdot 10^{-19}\\ \\mathrm{J} = 3{,}20 \\cdot 10^{-11}\\ \\mathrm{J}$`, `$N = \\dfrac{W}{W_1} \\approx ${sci(Nn, 3)}$`, `$m = \\dfrac{N}{N_A} M ${res(m, 0, "g")}$`],
      );
    },
  },
  {
    id: "dod-fiz-ss-matura-mesane",
    topics: ["FIZ-SS-4/mesane-maturitetne-naloge"],
    gen(level, r) {
      const n = ime(r);
      const cw = 4200;
      if (level === 1) {
        const kind = r.pick(["wp", "ohm", "kwh", "valovna"]);
        if (kind === "wp") {
          const m = r.int(2, 20);
          const h = r.dec(1, 30, 1);
          const W = m * GZ * h;
          return T(
            `${n} dvigne nahrbtnik z maso $${m}\\ \\mathrm{kg}$ za $${qty(tx(h), "m")}$ višje. Za koliko se poveča potencialna energija nahrbtnika? Zaokroži na celo število.`,
            num(W, "J", 0, [M(m * h, "Pomnoži še s težnim pospeškom $g$."), M((m * GZ * h) / 2, "Potencialna energija nima faktorja ½.")]),
            "Sprememba potencialne energije je zmnožek teže in višinske razlike.",
            [dat("m", m, "kg"), dat("h", tx(h), "m"), K.g],
            ["\\Delta W_p"],
            ["\\Delta W_p = m g h"],
            [`$\\Delta W_p = ${m} \\cdot ${G_TEX} \\cdot ${tx(h)}\\ \\mathrm{J}$`, `$\\Delta W_p ${res(W, 0, "J")}$`],
          );
        }
        if (kind === "ohm") {
          const U = r.pick([1.5, 4.5, 9, 12, 24, 230]);
          const R = r.int(2, 200) * (U > 100 ? 10 : 1);
          const I = U / R;
          return T(
            `Upornik z uporom $${qty(R, "\\Omega")}$ priključimo na napetost $${qty(tx(U), "V")}$. Kolikšen tok teče skozenj? Zaokroži na tri decimalke.`,
            num(I, "A", 3, [M(U * R, "Tok je napetost, deljena z uporom."), M(R / U, "Tok je napetost, deljena z uporom.")]),
            "Uporabi Ohmov zakon.",
            [dat("R", R, "\\Omega"), dat("U", tx(U), "V")],
            ["I"],
            ["I = \\dfrac{U}{R}"],
            [`$I = \\dfrac{U}{R} = \\dfrac{${tx(U)}\\ \\mathrm{V}}{${qty(R, "\\Omega")}}$`, `$I ${res(I, 3, "A")}$`],
          );
        }
        if (kind === "kwh") {
          const P = r.pick([60, 100, 800, 1200, 2000, 2200]);
          const t = r.dec(0.5, 6, 1);
          const W = (P * t) / 1000;
          const dev = { 60: "žarnica", 100: "prenosnik", 800: "mikrovalovna pečica", 1200: "sesalnik", 2000: "grelnik vode", 2200: "likalnik" }[P];
          return T(
            `${dev[0].toUpperCase() + dev.slice(1)} z močjo $${P}\\ \\mathrm{W}$ deluje $${qty(tx(t), "h")}$. Koliko električne energije porabi? Rezultat zapiši v kWh in zaokroži na dve decimalki.`,
            num(W, "kWh", 2, [M(P * t, "Moč pretvori v kilovate."), M((P * t * 3600) / 1000, "Ure ni treba pretvarjati v sekunde, ko računaš v kWh.")]),
            "Energija je moč krat čas; moč zapiši v kW, čas v urah.",
            [dat("P", P, "W"), dat("t", tx(t), "h")],
            ["W"],
            ["W = P t"],
            [`$P = ${qty(tx(P / 1000), "kW")}$`, `$W = ${tx(P / 1000)}\\ \\mathrm{kW} \\cdot ${qty(tx(t), "h")} ${res(W, 2, "kWh")}$`],
          );
        }
        const nu = r.int(20, 200) * 10;
        const l = C_ZVOK / nu;
        return T(
          `Glasbene vilice nihajo s frekvenco $${nu}\\ \\mathrm{Hz}$. Kolikšna je valovna dolžina zvoka v zraku, kjer je hitrost zvoka $340\\ \\mathrm{m/s}$? Rezultat zapiši v cm in zaokroži na eno decimalko.`,
          num(l * 100, "cm", 1, [M(l, "Rezultat pretvori v centimetre."), M((nu / C_ZVOK) * 100, "Valovna dolžina je $c/\\nu$, ne $\\nu/c$.")]),
          "Iz $c = \\lambda\\nu$ izrazi valovno dolžino.",
          [dat("\\nu", nu, "Hz"), dat("c", 340, "m/s")],
          ["\\lambda"],
          ["\\lambda = \\dfrac{c}{\\nu}"],
          [`$\\lambda = \\dfrac{340}{${nu}}\\ \\mathrm{m} ${res(l, 4, "m")}$`, `$\\lambda ${res(l * 100, 1, "cm")}$`],
        );
      }
      if (level === 2) {
        const kind = r.pick(["grelnik", "tobogan", "zaporedno", "kondenzator"]);
        if (kind === "grelnik") {
          const V = r.dec(0.5, 2, 1);
          const t1 = r.int(10, 25);
          const t2 = 100;
          const P = r.pick([1500, 1800, 2000, 2200, 2400]);
          const tt = (V * cw * (t2 - t1)) / P;
          return T(
            `Električni grelnik vode z močjo $${P}\\ \\mathrm{W}$ segreje $${qty(tx(V), "L")}$ vode z $${t1}\\ ^\\circ\\mathrm{C}$ do vrelišča. Koliko časa potrebuje, če gre vsa energija v vodo? ($c_v = 4200\\ \\mathrm{J/(kg\\,K)}$) Zaokroži na celo število sekund.`,
            num(tt, "s", 0, [M((V * cw * t2) / P, "Sprememba temperature je $100\\ ^\\circ\\mathrm{C} - t_1$."), M((V * cw * (t2 - t1)) / P / 60, "Rezultat zapiši v sekundah.")]),
            "Potrebna toplota je $Q = m c \\Delta T$; grelnik jo dovaja z močjo $P$.",
            [dat("P", P, "W"), dat("V", tx(V), "L"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, "c_v = 4200\\ \\mathrm{J/(kg\\,K)}"],
            ["t"],
            ["Q = m c \\Delta T", "t = \\dfrac{Q}{P}"],
            [`$m = ${qty(tx(V), "kg")},\\ \\Delta T = ${t2 - t1}\\ \\mathrm{K}$`, `$Q = ${tx(V)} \\cdot 4200 \\cdot ${t2 - t1}\\ \\mathrm{J} = ${qty(tx(V * cw * (t2 - t1), 0), "J")}$`, `$t = \\dfrac{Q}{P} ${res(tt, 0, "s")}$`],
          );
        }
        if (kind === "tobogan") {
          const h = r.dec(1.5, 12, 1);
          const v = Math.sqrt(2 * GZ * h);
          const what = r.pick(["Otrok se spusti po toboganu", "Smučar se brez odrivanja spusti po strmini", "Voziček na progi vlakca smrti se spusti"]);
          return T(
            `${what} z višinsko razliko $${qty(tx(h), "m")}$; na vrhu miruje. S kolikšno hitrostjo pride na dno, če trenje in zračni upor zanemarimo? Zaokroži na dve decimalki.`,
            num(v, "m/s", 2, [M(Math.sqrt(GZ * h), "Iz $mgh = \\frac{mv^2}{2}$ sledi $v = \\sqrt{2gh}$."), M(2 * GZ * h, "Pozabil si koreniti.")]),
            "Potencialna energija se pretvori v kinetično; masa se pokrajša.",
            [dat("h", tx(h), "m"), K.g],
            ["v"],
            ["m g h = \\dfrac{m v^2}{2}", "v = \\sqrt{2 g h}"],
            [`$v^2 = 2 g h = 2 \\cdot ${G_TEX} \\cdot ${tx(h)}\\ \\mathrm{m^2/s^2} ${res(2 * GZ * h, 2, "m^2/s^2")}$`, `$v ${res(v, 2, "m/s")}$`],
          );
        }
        if (kind === "zaporedno") {
          const U = r.pick([4.5, 6, 9, 12, 24]);
          const R1 = r.int(2, 100);
          const R2 = r.int(2, 100);
          const I = U / (R1 + R2);
          const U2 = I * R2;
          return T(
            `Upornika $${qty(R1, "\\Omega")}$ in $${qty(R2, "\\Omega")}$ sta vezana zaporedno na baterijo z napetostjo $${qty(tx(U), "V")}$. Kolikšna je napetost na drugem uporniku? Zaokroži na dve decimalki.`,
            num(U2, "V", 2, [M(U, "Napetost baterije se razdeli med oba upornika."), M(U / 2, "Napetost se ne razdeli na pol, temveč v razmerju uporov."), M((U * R1) / (R1 + R2), "To je napetost na prvem uporniku.")]),
            "Pri zaporedni vezavi se upora seštejeta; tok je skozi oba enak.",
            [dat("R_1", R1, "\\Omega"), dat("R_2", R2, "\\Omega"), dat("U", tx(U), "V")],
            ["U_2"],
            ["R = R_1 + R_2", "I = \\dfrac{U}{R}", "U_2 = I R_2"],
            [`$R = ${R1} + ${R2}\\ \\Omega = ${qty(R1 + R2, "\\Omega")}$`, `$I = \\dfrac{${tx(U)}}{${R1 + R2}}\\ \\mathrm{A} ${res(I, 4, "A")}$`, `$U_2 = I R_2 ${res(U2, 2, "V")}$`],
          );
        }
        const C1 = r.int(1, 50) * 10;
        const U = r.int(5, 40) * 10;
        const m = r.int(1, 20) * 10;
        const W = (C1 * 1e-6 * U * U) / 2;
        const v = Math.sqrt((2 * W) / (m / 1000));
        return T(
          `Kondenzator s kapaciteto $${C1}\\ \\mathrm{\\mu F}$, nabit na $${U}\\ \\mathrm{V}$, se izprazni skozi elektromagnetni izstreljevalnik. Kolikšno hitrost bi dobil izstrelek z maso $${m}\\ \\mathrm{g}$, če bi se vsa energija kondenzatorja pretvorila v njegovo kinetično energijo? Zaokroži na eno decimalko.`,
          num(v, "m/s", 1, [M(Math.sqrt(W / (m / 1000)), "Iz $W_k = \\frac{m v^2}{2}$ sledi $v = \\sqrt{2W/m}$."), M(Math.sqrt((2 * W) / m), "Maso pretvori v kilograme.")]),
          "Izračunaj energijo nabitega kondenzatorja in jo izenači s kinetično energijo izstrelka.",
          [dat("C", C1, "\\mathrm{\\mu F}"), dat("U", U, "V"), dat("m", m, "g")],
          ["v"],
          ["W_e = \\dfrac{C U^2}{2}", "W_e = \\dfrac{m v^2}{2}"],
          [`$W_e = \\dfrac{${C1} \\cdot 10^{-6} \\cdot ${U}^2}{2}\\ \\mathrm{J} ${res(W, 2, "J")}$`, `$v = \\sqrt{\\dfrac{2 W_e}{m}} = \\sqrt{\\dfrac{2 \\cdot ${tx(W, 2)}}{${tx(m / 1000)}}}\\ \\mathrm{m/s} ${res(v, 1, "m/s")}$`],
        );
      }
      const kind = r.pick(["balisticno", "grelnik", "klanec", "zavore"]);
      if (kind === "balisticno") {
        const m = r.int(5, 30);
        const Mb = r.dec(1, 5, 1);
        const hcm = r.dec(3, 30, 1);
        const V = Math.sqrt(2 * GZ * (hcm / 100));
        const v = ((m / 1000 + Mb) / (m / 1000)) * V;
        return T(
          `Krogla z maso $${m}\\ \\mathrm{g}$ prileti vodoravno v leseno klado z maso $${qty(tx(Mb), "kg")}$, ki visi na vrvicah, in v njej obtiči. Klada s kroglo se zaniha in dvigne za $${qty(tx(hcm), "cm")}$. Kolikšna je bila hitrost krogle? Zaokroži na celo število.`,
          num(v, "m/s", 0, [M(Math.sqrt(2 * GZ * (hcm / 100) * ((m / 1000 + Mb) / (m / 1000))), "Kinetična energija se pri trku ne ohrani – za trk uporabi ohranitev gibalne količine."), M(V, "To je hitrost klade s kroglo po trku; iz nje izračunaj še hitrost krogle."), M((Mb / (m / 1000)) * V, "Po trku se giblje skupna masa $m + M$.")]),
          "Razdeli na dva dela: neprožni trk (ohrani se gibalna količina), nato nihanje (ohrani se energija).",
          [dat("m", m, "g"), dat("M", tx(Mb), "kg"), dat("h", tx(hcm), "cm"), K.g],
          ["v"],
          ["\\dfrac{(m + M) V^2}{2} = (m + M) g h", "m v = (m + M) V"],
          [`$V = \\sqrt{2 g h} = \\sqrt{2 \\cdot ${G_TEX} \\cdot ${tx(hcm / 100)}}\\ \\mathrm{m/s} ${res(V, 3, "m/s")}$`, `$v = \\dfrac{m + M}{m} V = \\dfrac{${tx(m / 1000 + Mb)}}{${tx(m / 1000)}} \\cdot ${tx(V, 3)}\\ \\mathrm{m/s} ${res(v, 0, "m/s")}$`],
        );
      }
      if (kind === "grelnik") {
        const U = 230;
        const R = r.int(20, 60);
        const eta = r.int(75, 95);
        const V = r.dec(0.5, 2, 1);
        const t1 = r.int(8, 25);
        const P = (U * U) / R;
        const tt = (V * cw * (100 - t1)) / ((eta / 100) * P) / 60;
        return T(
          `Grelna žica v kuhalniku vode ima upor $${qty(R, "\\Omega")}$ in je priključena na $230\\ \\mathrm{V}$. Izkoristek kuhalnika je $${eta}\\ \\%$. Koliko minut traja, da $${qty(tx(V), "L")}$ vode z $${t1}\\ ^\\circ\\mathrm{C}$ zavre? ($c_v = 4200\\ \\mathrm{J/(kg\\,K)}$) Zaokroži na eno decimalko.`,
          num(tt, "min", 1, [M((V * cw * (100 - t1)) / P / 60, "Upoštevaj izkoristek: v vodo gre le del električne moči."), M((V * cw * (100 - t1) * (eta / 100)) / P / 60, "Toploto deli z $\\eta P$ – ne množi z izkoristkom."), M(tt * 60, "Rezultat pretvori v minute.")]),
          "Izračunaj električno moč grelca, nato koristno moč ($\\eta P$) in čas za potrebno toploto.",
          [dat("R", R, "\\Omega"), dat("U", 230, "V"), dat("\\eta", eta, "\\%"), dat("V", tx(V), "L"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, "c_v = 4200\\ \\mathrm{J/(kg\\,K)}"],
          ["t"],
          ["P = \\dfrac{U^2}{R}", "Q = m c \\Delta T", "t = \\dfrac{Q}{\\eta P}"],
          [`$P = \\dfrac{230^2}{${R}}\\ \\mathrm{W} ${res(P, 1, "W")}$`, `$Q = ${tx(V)} \\cdot 4200 \\cdot ${100 - t1}\\ \\mathrm{J} = ${qty(tx(V * cw * (100 - t1), 0), "J")}$`, `$t = \\dfrac{Q}{\\eta P} ${res(tt * 60, 0, "s")} ${res(tt, 1, "min")}$`],
        );
      }
      if (kind === "klanec") {
        const a = r.int(15, 40);
        const k = r.dec(0.05, Math.min(0.4, Math.tan(rad(a)) - 0.08), 2);
        const L = r.dec(2, 20, 1);
        const v = Math.sqrt(2 * GZ * L * (Math.sin(rad(a)) - k * Math.cos(rad(a))));
        return T(
          `Zaboj zdrsne iz mirovanja po $${qty(tx(L), "m")}$ dolgem klancu z naklonom $${a}^\\circ$. Koeficient trenja je $${tx(k)}$. S kolikšno hitrostjo pride na dno? Zaokroži na dve decimalki.`,
          num(v, "m/s", 2, [M(Math.sqrt(2 * GZ * L * Math.sin(rad(a))), "Upoštevaj delo sile trenja."), M(Math.sqrt(2 * GZ * L * (Math.sin(rad(a)) - k)), "Sila podlage na klancu je $mg\\cos\\alpha$."), M(Math.sqrt(2 * GZ * L), "Višinska razlika je $L\\sin\\alpha$, ne $L$.")]),
          "Uporabi energijski zakon: sprememba kinetične energije je enaka delu teže minus delu trenja (ali izračunaj pospešek).",
          [dat("L", tx(L), "m"), `\\alpha = ${a}^\\circ`, `k_{tr} = ${tx(k)}`, K.g],
          ["v"],
          ["h = L\\sin\\alpha", "A_{tr} = k_{tr}\\, m g \\cos\\alpha \\cdot L", "\\dfrac{m v^2}{2} = m g h - A_{tr}"],
          [`$h = L\\sin\\alpha ${res(L * Math.sin(rad(a)), 3, "m")}$`, `$\\dfrac{v^2}{2} = g L(\\sin\\alpha - k_{tr}\\cos\\alpha) ${res(GZ * L * (Math.sin(rad(a)) - k * Math.cos(rad(a))), 2, "m^2/s^2")}$`, `$v ${res(v, 2, "m/s")}$`],
        );
      }
      const m = r.int(9, 20) * 100;
      const vk = r.int(50, 130);
      const md = r.int(5, 12);
      const c = 460;
      const W = (m * (vk / 3.6) ** 2) / 2;
      const dT = W / (4 * md * c);
      return T(
        `Avto z maso $${m}\\ \\mathrm{kg}$ zavira s $${vk}\\ \\mathrm{km/h}$ do ustavitve. Vsa kinetična energija se pretvori v notranjo energijo štirih jeklenih zavornih diskov z maso po $${md}\\ \\mathrm{kg}$ ($c = 460\\ \\mathrm{J/(kg\\,K)}$). Za koliko se segrejejo diski? Zaokroži na eno decimalko.`,
        num(dT, "K", 1, [M(W / (md * c), "Energija se porazdeli na štiri diske."), M((m * vk * vk) / 2 / (4 * md * c), "Hitrost pretvori v m/s."), M((m * (vk / 3.6)) / (4 * md * c), "Kinetična energija je $\\frac{m v^2}{2}$.")], { unitAlternatives: ["°C"] }),
        "Izračunaj kinetično energijo avta in jo izenači s toploto, ki jo prejmejo vsi štirje diski.",
        [dat("m", m, "kg"), dat("v", vk, "km/h"), `m_d = 4 \\cdot ${md}\\ \\mathrm{kg}`, "c = 460\\ \\mathrm{J/(kg\\,K)}"],
        ["\\Delta T"],
        ["W_k = \\dfrac{m v^2}{2}", "W_k = m_d c \\Delta T"],
        [`$v = ${vk}\\ \\mathrm{km/h} ${eq(vk / 3.6, 2)} ${qty(tx(vk / 3.6, 2), "m/s")}$`, `$W_k = \\dfrac{${m} \\cdot (${tx(vk / 3.6, 2)})^2}{2}\\ \\mathrm{J} ${res(W, 0, "J")}$`, `$\\Delta T = \\dfrac{W_k}{4 m_d c} ${res(dT, 1, "K")}$`],
      );
    },
  },
];
