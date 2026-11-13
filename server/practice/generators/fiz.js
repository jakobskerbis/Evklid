// Generatorji nalog za fiziko (OŠ in gimnazija).
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx, withMistakes, eqs } from "./mat.js";

const G = 9.81;
const G_TEX = "9{,}81";
const num = (value, unit, decimals = 2, extra = {}, mistakes = []) => withMistakes({ type: "number", value, unit, decimals, ...extra }, mistakes);

// Pomožne funkcije za rubriko »Podatki« in za račun v rešitvi (vse brez $).
// Količina z enoto: qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}"; enota, ki se začne z \, ostane (npr. \Omega).
const qty = (val, unit) => `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`;
// Vrstica podatka: dat("m", tx(m), "kg") → "m = 2{,}5\ \mathrm{kg}". Vrednost mora biti zapisana enako kot v besedilu.
const dat = (sym, val, unit) => `${sym} = ${qty(val, unit)}`;
// Rezultat: "= 4{,}5\ \mathrm{N}" oz. "\approx 4{,}51\ \mathrm{N}", kadar ga je bilo treba zaokrožiti na d decimalk.
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const res = (x, d, unit) => `${needsRounding(x, d) ? "\\approx" : "="} ${qty(tx(x, d), unit)}`;
// Zaokrožena vrednost za natančnim rezultatom: " \approx 12{,}3\ \mathrm{kJ}" ali prazen niz, če zaokroževanje ni potrebno.
const rnd = (x, d, unit) => (needsRounding(x, d) ? ` \\approx ${qty(tx(x, d), unit)}` : "");

export const FIZ_GENERATORS = [
  {
    id: "gostota",
    topics: ["FIZ-OS-8/gostota"],
    gen(level, r) {
      const mats = [["aluminija", 2700], ["železa", 7870], ["smrekovega lesa", 450], ["ledu", 920], ["bakra", 8960], ["stekla", 2500]];
      const [name, rho] = r.pick(mats);
      if (level === 1) {
        const m = r.dec(0.2, 5, 1);
        const V = m / rho;
        const Vcm = roundHalfUp(V * 1e6, 0); // prostornina v cm³, kot je zapisana v besedilu
        const rhoOut = m / (Vcm / 1e6);
        return {
          text: `Kos snovi ima maso $${tx(m)}\\ \\mathrm{kg}$ in prostornino $${tx(Vcm, 0)}\\ \\mathrm{cm^3}$. Kolikšna je njegova gostota v $\\mathrm{kg/m^3}$? Zaokroži na celo število.`,
          answer: num(rhoOut, "kg/m³", 0, { unitAlternatives: ["kg/m3"] }, [
            [m / Vcm, "Prostornino moraš najprej pretvoriti iz cm³ v m³."],
            [m / (Vcm / 1e3), "1 cm³ = 0,000001 m³ (10⁻⁶), ne 10⁻³ m³."],
            [Vcm / 1e6 / m, "Gostota je masa deljeno s prostornino, ne obratno."],
          ]),
          hint: "$\\rho = \\dfrac{m}{V}$. Prostornino najprej pretvori v $\\mathrm{m^3}$ ($1\\ \\mathrm{cm^3} = 10^{-6}\\ \\mathrm{m^3}$).",
          data: { given: [dat("m", tx(m), "kg"), dat("V", tx(Vcm, 0), "cm^3")], find: ["\\rho"] },
          formula: ["\\rho = \\dfrac{m}{V}", "1\\ \\mathrm{cm^3} = 10^{-6}\\ \\mathrm{m^3}"],
          solution: `$V = ${qty(tx(Vcm, 0), "cm^3")} = ${qty(tx(Vcm / 1e6), "m^3")}$\n${eqs("\\rho", "\\dfrac{m}{V}", `\\dfrac{${qty(tx(m), "kg")}}{${qty(tx(Vcm / 1e6), "m^3")}}`, res(rhoOut, 0, "kg/m^3"))}`,
        };
      }
      if (level === 3) {
        // Kocka z danim robom: prostornina iz roba, pretvorba cm³ → m³, nato masa.
        const a = r.dec(2, 20, 1); // cm
        const Vcm = a ** 3;
        const m = (rho * Vcm) / 1e6;
        return {
          text: `Kocka iz ${name} ima rob $${tx(a)}\\ \\mathrm{cm}$. Gostota ${name} je $${rho}\\ \\mathrm{kg/m^3}$. Kolikšna je masa kocke v gramih? Zaokroži na eno decimalko.`,
          answer: num(m * 1000, "g", 1, {}, [
            [(rho * a) / 1e3, "Prostornina kocke je a³: rob moraš kubirati."],
            [m, "To je masa v kilogramih; pretvori jo v grame (1 kg = 1000 g)."],
            [(rho * a * a) / 1e3, "Prostornina kocke je a³, ne a²."],
          ]),
          hint: "Najprej izračunaj prostornino kocke $V = a^3$ v $\\mathrm{cm^3}$, jo pretvori v $\\mathrm{m^3}$, nato $m = \\rho \\cdot V$ in maso pretvori v grame.",
          data: { given: [dat("a", tx(a), "cm"), dat("\\rho", rho, "kg/m^3")], find: ["m"] },
          formula: ["V = a^3", "m = \\rho \\cdot V", "1\\ \\mathrm{cm^3} = 10^{-6}\\ \\mathrm{m^3}"],
          solution: `${eqs("V", "a^3", `(${qty(tx(a), "cm")})^3`, qty(tx(Vcm), "cm^3"))}\n$V = ${qty(tx(Vcm / 1e6), "m^3")}$\n${eqs("m", "\\rho \\cdot V", `${qty(rho, "kg/m^3")} \\cdot ${qty(tx(Vcm / 1e6), "m^3")}`, qty(tx(m), "kg"))}\n$m = ${qty(tx(m), "kg")} = ${qty(tx(m * 1000), "g")}${rnd(m * 1000, 1, "g")}$`,
        };
      }
      const V = r.dec(0.5, 20, 1); // dm³
      const m = (rho * V) / 1000;
      return {
        text: `Kolikšna je masa telesa iz ${name} ($\\rho = ${rho}\\ \\mathrm{kg/m^3}$) s prostornino $${tx(V)}\\ \\mathrm{dm^3}$? Rezultat v kg zaokroži na dve decimalki.`,
        answer: num(m, "kg", 2, {}, [
          [rho * V, "Prostornino moraš pretvoriti iz dm³ v m³ (1 dm³ = 0,001 m³)."],
          [rho / (V / 1000), "Masa je gostota krat prostornina, ne gostota deljeno s prostornino."],
        ]),
        hint: "$m = \\rho \\cdot V$. Prostornino pretvori v $\\mathrm{m^3}$: $1\\ \\mathrm{dm^3} = 0{,}001\\ \\mathrm{m^3}$.",
        data: { given: [dat("\\rho", rho, "kg/m^3"), dat("V", tx(V), "dm^3")], find: ["m"] },
        formula: ["\\rho = \\dfrac{m}{V}", "m = \\rho \\cdot V", "1\\ \\mathrm{dm^3} = 0{,}001\\ \\mathrm{m^3}"],
        solution: `$V = ${qty(tx(V), "dm^3")} = ${qty(tx(V / 1000), "m^3")}$\n${eqs("m", "\\rho \\cdot V", `${qty(rho, "kg/m^3")} \\cdot ${qty(tx(V / 1000), "m^3")}`, res(m, 2, "kg"))}`,
      };
    },
  },
  {
    id: "teza",
    topics: ["FIZ-OS-8/teza-in-masa", "FIZ-OS-8/sila-in-merjenje-sile"],
    gen(level, r) {
      const m = level === 1 ? r.int(1, 80) : r.dec(0.1, 80, 1);
      if (level === 3) {
        const F = r.dec(10, 800, 0);
        return {
          text: `Na telo deluje teža $${tx(F)}\\ \\mathrm{N}$. Kolikšna je njegova masa? Uporabi $g = 9{,}81\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
          answer: num(F / G, "kg", 2, { alsoAccept: [F / 10] }, [
            [F * G, "Maso dobiš tako, da težo deliš z g, ne množiš."],
            [F, "Teža v N in masa v kg nista isto število: deli z g."],
          ]),
          hint: "$F_g = m \\cdot g$, zato $m = \\dfrac{F_g}{g}$.",
          data: { given: [dat("F_g", tx(F), "N"), dat("g", G_TEX, "N/kg")], find: ["m"] },
          formula: ["F_g = m \\cdot g", "m = \\dfrac{F_g}{g}"],
          solution: `$F_g = m \\cdot g \\;\\Rightarrow\\; m = \\dfrac{F_g}{g}$\n${eqs("m", `\\dfrac{${qty(tx(F), "N")}}{${qty(G_TEX, "N/kg")}}`, res(F / G, 2, "kg"))}`,
        };
      }
      if (level === 2) {
        // Masa v gramih: najprej pretvorba v kg.
        const mg = r.int(50, 2500);
        const mk = mg / 1000;
        const [what, pron] = r.pick([["Jabolko", "njegova"], ["Zvezek", "njegova"], ["Steklenica vode", "njena"], ["Nahrbtnik", "njegova"], ["Mobilni telefon", "njegova"], ["Lonček jogurta", "njegova"], ["Torba", "njena"]]);
        return {
          text: `${what} ima maso $${mg}\\ \\mathrm{g}$. Kolikšna je ${pron} teža? Uporabi $g = 9{,}81\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
          answer: num(mk * G, "N", 2, {}, [
            [mg * G, "Maso moraš najprej pretvoriti iz gramov v kilograme."],
            [mk / G, "Težo dobiš z množenjem mase z g, ne z deljenjem."],
            [mk, "Masa ni teža: pomnoži jo še z g."],
          ]),
          hint: "Maso pretvori v kilograme ($1\\ \\mathrm{kg} = 1000\\ \\mathrm{g}$), nato $F_g = m \\cdot g$.",
          data: { given: [dat("m", mg, "g"), dat("g", G_TEX, "N/kg")], find: ["F_g"] },
          formula: ["F_g = m \\cdot g", "1\\ \\mathrm{kg} = 1000\\ \\mathrm{g}"],
          solution: `$m = ${qty(mg, "g")} = ${qty(tx(mk), "kg")}$\n${eqs("F_g", "m \\cdot g", `${qty(tx(mk), "kg")} \\cdot ${qty(G_TEX, "N/kg")}`, res(mk * G, 2, "N"))}`,
        };
      }
      return {
        text: `Kolikšna je teža telesa z maso $${tx(m)}\\ \\mathrm{kg}$? Uporabi $g = 9{,}81\\ \\mathrm{N/kg}$ in zaokroži na eno decimalko.`,
        answer: num(m * G, "N", 1, {}, [
          [m / G, "Težo dobiš z množenjem mase z g, ne z deljenjem."],
          [m, "Masa ni teža: pomnoži jo še z g."],
        ]),
        hint: "Teža je $F_g = m \\cdot g$.",
        data: { given: [dat("m", tx(m), "kg"), dat("g", G_TEX, "N/kg")], find: ["F_g"] },
        formula: "F_g = m \\cdot g",
        solution: eqs("F_g", "m \\cdot g", `${qty(tx(m), "kg")} \\cdot ${qty(G_TEX, "N/kg")}`, res(m * G, 1, "N")),
      };
    },
  },
  {
    id: "tlak",
    topics: ["FIZ-OS-8/tlak", "FIZ-SS-1/tlak-in-vzgon"],
    gen(level, r) {
      if (level === 2) {
        // Ploščina v cm²: najprej pretvorba v m².
        const F = r.int(50, 900);
        const Scm = r.int(20, 2000);
        const S = Scm / 1e4;
        const ctx = r.pick([
          `Zaboj s težo $${F}\\ \\mathrm{N}$ stoji na tleh s ploskvijo $${Scm}\\ \\mathrm{cm^2}$.`,
          `Sila $${F}\\ \\mathrm{N}$ pritiska na ploskev s ploščino $${Scm}\\ \\mathrm{cm^2}$.`,
          `Učenec s težo $${F}\\ \\mathrm{N}$ stoji na ploskvi s ploščino $${Scm}\\ \\mathrm{cm^2}$.`,
        ]);
        return {
          text: `${ctx} Kolikšen je tlak v Pa? Zaokroži na celo število.`,
          answer: num(F / S, "Pa", 0, {}, [
            [F / Scm, "Ploščino moraš pretvoriti iz cm² v m² (1 cm² = 0,0001 m²)."],
            [F / (Scm / 100), "1 m² = 10 000 cm², ne 100 cm²."],
            [F * S, "Tlak je sila deljeno s ploščino, ne zmnožek."],
          ]),
          hint: "Ploščino pretvori v $\\mathrm{m^2}$ ($1\\ \\mathrm{m^2} = 10\\,000\\ \\mathrm{cm^2}$), nato $p = \\dfrac{F}{S}$.",
          data: { given: [dat("F", F, "N"), dat("S", Scm, "cm^2")], find: ["p"] },
          formula: ["p = \\dfrac{F}{S}", "1\\ \\mathrm{cm^2} = 0{,}0001\\ \\mathrm{m^2}"],
          solution: `$S = ${qty(Scm, "cm^2")} = ${qty(tx(S), "m^2")}$\n${eqs("p", "\\dfrac{F}{S}", `\\dfrac{${qty(F, "N")}}{${qty(tx(S), "m^2")}}`, res(F / S, 0, "Pa"))}`,
        };
      }
      if (level === 1) {
        const F = r.int(50, 900);
        const S = r.pick([0.5, 1, 2, 4]);
        return {
          text: `Sila $${F}\\ \\mathrm{N}$ pritiska na ploskev s ploščino $${tx(S)}\\ \\mathrm{m^2}$. Kolikšen je tlak? Zaokroži na celo število.`,
          answer: num(F / S, "Pa", 0, {}, [
            [F * S, "Tlak je sila deljeno s ploščino, ne zmnožek."],
            [S / F, "Silo deliš s ploščino, ne obratno."],
          ]),
          hint: "$p = \\dfrac{F}{S}$, enota je pascal: $1\\ \\mathrm{Pa} = 1\\ \\mathrm{N/m^2}$.",
          data: { given: [dat("F", F, "N"), dat("S", tx(S), "m^2")], find: ["p"] },
          formula: "p = \\dfrac{F}{S}",
          solution: eqs("p", "\\dfrac{F}{S}", `\\dfrac{${qty(F, "N")}}{${qty(tx(S), "m^2")}}`, res(F / S, 0, "Pa")),
        };
      }
      const h = r.dec(0.5, 30, 1);
      const p = 1000 * G * h;
      return {
        text: `Kolikšen je hidrostatični tlak v vodi na globini $${tx(h)}\\ \\mathrm{m}$? Uporabi $\\rho = 1000\\ \\mathrm{kg/m^3}$, $g = 9{,}81\\ \\mathrm{m/s^2}$. Rezultat v kPa zaokroži na eno decimalko.`,
        answer: num(p / 1000, "kPa", 1, {}, [
          [p, "Rezultat je v Pa; pretvori ga v kPa (1 kPa = 1000 Pa)."],
          [(1000 * h) / 1000, "V formuli p = ρ g h manjka g."],
          [(p + 101300) / 1000, "Vprašani smo le po hidrostatičnem tlaku vode, brez zračnega tlaka."],
        ]),
        hint: "$p = \\rho g h$. Rezultat pretvori v kPa.",
        data: { given: [dat("h", tx(h), "m"), dat("\\rho", 1000, "kg/m^3"), dat("g", G_TEX, "m/s^2")], find: ["p"] },
        formula: ["p = \\rho \\cdot g \\cdot h", "1\\ \\mathrm{kPa} = 1000\\ \\mathrm{Pa}"],
        solution: `${eqs("p", "\\rho \\cdot g \\cdot h", `${qty(1000, "kg/m^3")} \\cdot ${qty(G_TEX, "m/s^2")} \\cdot ${qty(tx(h), "m")}`, qty(tx(p), "Pa"))}\n$p = ${qty(tx(p), "Pa")} = ${qty(tx(p / 1000), "kPa")}${rnd(p / 1000, 1, "kPa")}$`,
      };
    },
  },
  {
    id: "hitrost",
    topics: ["FIZ-OS-8/enakomerno-gibanje", "FIZ-SS-1/premo-enakomerno-gibanje"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        const v = r.int(2, 12);
        const t = r.int(2, 60);
        return {
          text: `Kolesar vozi enakomerno s hitrostjo $${v}\\ \\mathrm{m/s}$. Koliko poti prevozi v $${t}\\ \\mathrm{s}$?`,
          answer: num(v * t, "m", null, {}, [
            [v / t, "Pot dobiš z množenjem hitrosti in časa, ne z deljenjem."],
            [t / v, "Pot je hitrost krat čas."],
            [v + t, "Hitrost in čas zmnoži, ne seštej."],
          ]),
          hint: "$s = v \\cdot t$",
          data: { given: [dat("v", v, "m/s"), dat("t", t, "s")], find: ["s"] },
          formula: "s = v \\cdot t",
          solution: eqs("s", "v \\cdot t", `${qty(v, "m/s")} \\cdot ${qty(t, "s")}`, qty(v * t, "m")),
        };
      }
      if (level === 2) {
        const s = r.dec(1, 40, 1);
        const tmin = r.int(5, 90);
        const v = s / (tmin / 60);
        return {
          text: `${name} prevozi $${tx(s)}\\ \\mathrm{km}$ v $${tmin}$ minutah. Kolikšna je ${g(name, "njegova", "njena")} povprečna hitrost v km/h? Zaokroži na eno decimalko.`,
          answer: num(v, "km/h", 1, {}, [
            [s / tmin, "Čas moraš pretvoriti iz minut v ure."],
            [s / (tmin / 100), "Ura ima 60 minut, ne 100."],
            [(s * tmin) / 60, "Hitrost je pot deljeno s časom, ne zmnožek."],
          ]),
          hint: "Čas pretvori v ure (minute deli s 60), nato $v = \\dfrac{s}{t}$.",
          data: { given: [dat("s", tx(s), "km"), dat("t", tmin, "min")], find: ["v"] },
          formula: ["v = \\dfrac{s}{t}", "1\\ \\mathrm{h} = 60\\ \\mathrm{min}"],
          solution: `$t = ${qty(tmin, "min")} = \\dfrac{${tmin}}{60}\\ \\mathrm{h}$\n$v = \\dfrac{s}{t} = \\dfrac{${qty(tx(s), "km")}}{\\frac{${tmin}}{60}\\ \\mathrm{h}} = \\dfrac{${tx(s)} \\cdot 60}{${tmin}}\\ \\mathrm{km/h} ${res(v, 1, "km/h")}$`,
        };
      }
      const vkmh = r.int(30, 130);
      return {
        text: `Avto vozi s hitrostjo $${vkmh}\\ \\mathrm{km/h}$. Koliko je to v $\\mathrm{m/s}$? Zaokroži na dve decimalki.`,
        answer: num(vkmh / 3.6, "m/s", 2, {}, [
          [vkmh * 3.6, "Iz km/h v m/s deliš s 3,6, ne množiš."],
          [vkmh / 60, "Ura ima 3600 sekund, kilometer 1000 metrov: deli s 3,6, ne s 60."],
        ]),
        hint: "$1\\ \\mathrm{m/s} = 3{,}6\\ \\mathrm{km/h}$, zato km/h deliš s 3,6.",
        data: { given: [dat("v", vkmh, "km/h")], find: ["v\\ [\\mathrm{m/s}]"] },
        formula: ["1\\ \\mathrm{km/h} = \\dfrac{1000\\ \\mathrm{m}}{3600\\ \\mathrm{s}} = \\dfrac{1}{3{,}6}\\ \\mathrm{m/s}", "v\\,[\\mathrm{m/s}] = \\dfrac{v\\,[\\mathrm{km/h}]}{3{,}6}"],
        solution: `$1\\ \\mathrm{km/h} = \\dfrac{1000\\ \\mathrm{m}}{3600\\ \\mathrm{s}} = \\dfrac{1}{3{,}6}\\ \\mathrm{m/s}$\n${eqs("v", `\\dfrac{${vkmh} \\cdot 1000\\ \\mathrm{m}}{3600\\ \\mathrm{s}}`, `\\dfrac{${vkmh}}{3{,}6}\\ \\mathrm{m/s}`, res(vkmh / 3.6, 2, "m/s"))}`,
      };
    },
  },
  {
    id: "pospesek",
    topics: ["FIZ-OS-8/pospeseno-gibanje", "FIZ-SS-1/enakomerno-pospeseno-gibanje", "FIZ-OS-9/prosti-pad", "FIZ-SS-1/prosti-pad-in-navpicni-met"],
    gen(level, r) {
      const a = level === 1 ? r.int(1, 5) : r.dec(0.5, 6, 1);
      const t = r.int(2, 12);
      if (level === 3) {
        const s = (a * t * t) / 2;
        return {
          text: `Avto spelje iz mirovanja s stalnim pospeškom $${tx(a)}\\ \\mathrm{m/s^2}$. Koliko poti prevozi v $${t}\\ \\mathrm{s}$? Zaokroži na eno decimalko.`,
          answer: num(s, "m", 1, {}, [
            [a * t * t, "Pozabil si faktor ½ v formuli s = a t² / 2."],
            [(a * t) / 2, "Čas moraš kvadrirati."],
            [a * t, "To je končna hitrost, ne prevožena pot."],
          ]),
          hint: "Pri enakomerno pospešenem gibanju iz mirovanja velja $s = \\dfrac{a t^2}{2}$.",
          data: { given: [dat("a", tx(a), "m/s^2"), dat("t", t, "s")], find: ["s"] },
          formula: "s = \\dfrac{a \\cdot t^2}{2} \\quad (v_0 = 0)",
          solution: `$t^2 = (${qty(t, "s")})^2 = ${qty(t * t, "s^2")}$\n${eqs("s", "\\dfrac{a \\cdot t^2}{2}", `\\dfrac{${qty(tx(a), "m/s^2")} \\cdot ${qty(t * t, "s^2")}}{2}`, `${qty(tx(s), "m")}${rnd(s, 1, "m")}`)}`,
        };
      }
      if (level === 2) {
        // Začetna hitrost ni 0: v = v0 + a t (dva koraka).
        const v0 = r.int(2, 15);
        const what = r.pick(["Avto", "Kolesar", "Vlak", "Motorist"]);
        return {
          text: `${what} vozi s hitrostjo $${v0}\\ \\mathrm{m/s}$ in začne enakomerno pospeševati s pospeškom $${tx(a)}\\ \\mathrm{m/s^2}$. Kolikšna je hitrost po $${t}\\ \\mathrm{s}$? Zaokroži na eno decimalko.`,
          answer: num(v0 + a * t, "m/s", 1, {}, [
            [a * t, "Prišteti moraš še začetno hitrost."],
            [v0 + a, "Pospešek pomnoži s časom: v vsaki sekundi se hitrost poveča za a."],
            [v0 * a * t, "Začetno hitrost prišteješ, ne zmnožiš."],
          ]),
          hint: "Hitrost se vsako sekundo poveča za $a$: $v = v_0 + a \\cdot t$.",
          data: { given: [dat("v_0", v0, "m/s"), dat("a", tx(a), "m/s^2"), dat("t", t, "s")], find: ["v"] },
          formula: "v = v_0 + a \\cdot t",
          solution: `$\\Delta v = a \\cdot t = ${qty(tx(a), "m/s^2")} \\cdot ${qty(t, "s")} = ${qty(tx(a * t), "m/s")}$\n${eqs("v", "v_0 + \\Delta v", `${qty(v0, "m/s")} + ${qty(tx(a * t), "m/s")}`, res(v0 + a * t, 1, "m/s"))}`,
        };
      }
      return {
        text: `Telo začne iz mirovanja pospeševati s pospeškom $${tx(a)}\\ \\mathrm{m/s^2}$. Kolikšna je njegova hitrost po $${t}\\ \\mathrm{s}$?`,
        answer: num(a * t, "m/s", null, { tolerance: 1e-9 }, [
          [a / t, "Hitrost je pospešek krat čas, ne deljeno s časom."],
          [(a * t) / 2, "Pri hitrosti ni faktorja ½; ta je v formuli za pot."],
          [a + t, "Pospešek in čas zmnoži, ne seštej."],
        ]),
        hint: "$v = a \\cdot t$ (ker začne iz mirovanja).",
        data: { given: [dat("a", tx(a), "m/s^2"), dat("t", t, "s")], find: ["v"] },
        formula: "v = a \\cdot t \\quad (v_0 = 0)",
        solution: eqs("v", "a \\cdot t", `${qty(tx(a), "m/s^2")} \\cdot ${qty(t, "s")}`, qty(tx(a * t), "m/s")),
      };
    },
  },
  {
    id: "newton2",
    topics: ["FIZ-OS-9/newtonovi-zakoni", "FIZ-SS-1/newtonovi-zakoni"],
    gen(level, r) {
      const m = level === 1 ? r.int(1, 50) : r.dec(0.5, 50, 1);
      const a = level === 1 ? r.int(1, 6) : r.dec(0.2, 5, 1);
      if (level === 2) {
        // Dva koraka: pospešek iz spremembe hitrosti, nato sila.
        const M = r.int(60, 1800);
        const v = r.int(5, 30);
        const t = r.int(3, 20);
        const acc = v / t;
        const what = M > 400 ? r.pick(["Avto", "Kombi"]) : r.pick(["Motorist z motorjem", "Kolesar s kolesom"]);
        return {
          text: `${what} (skupna masa $${M}\\ \\mathrm{kg}$) v $${t}\\ \\mathrm{s}$ enakomerno pospeši iz mirovanja do hitrosti $${v}\\ \\mathrm{m/s}$. Kolikšna je rezultanta sil? Zaokroži na celo število.`,
          answer: num(M * acc, "N", 0, {}, [
            [M * v, "Najprej izračunaj pospešek a = v / t, nato F = m · a."],
            [M * v * t, "Pospešek je hitrost deljeno s časom, ne zmnožek."],
            [(M * t) / v, "Pospešek je v / t, ne t / v."],
          ]),
          hint: "Najprej izračunaj pospešek $a = \\dfrac{v}{t}$, nato uporabi $F = m \\cdot a$.",
          data: { given: [dat("m", M, "kg"), dat("t", t, "s"), dat("v", v, "m/s")], find: ["F"] },
          formula: ["a = \\dfrac{v}{t}", "F = m \\cdot a"],
          solution: `${eqs("a", "\\dfrac{v}{t}", `\\dfrac{${qty(v, "m/s")}}{${qty(t, "s")}}`, res(acc, 2, "m/s^2"))}\n${eqs("F", "m \\cdot a", `${qty(M, "kg")} \\cdot \\dfrac{${v}}{${t}}\\ \\mathrm{m/s^2}`, res(M * acc, 0, "N"))}`,
        };
      }
      if (level === 3) {
        const F = r.int(20, 200);
        const Ft = r.int(5, F - 5);
        return {
          text: `Na zaboj z maso $${tx(m)}\\ \\mathrm{kg}$ delujemo z vodoravno silo $${F}\\ \\mathrm{N}$, sila trenja je $${Ft}\\ \\mathrm{N}$. Kolikšen je pospešek zaboja? Zaokroži na dve decimalki.`,
          answer: num((F - Ft) / m, "m/s²", 2, { unitAlternatives: ["m/s2", "m/s^2"] }, [
            [F / m, "Upoštevati moraš tudi trenje: rezultanta je F − F_tr."],
            [(F + Ft) / m, "Trenje deluje nasprotno vlečni sili, zato ga odšteješ."],
            [(F - Ft) * m, "Pospešek je rezultanta deljeno z maso, ne zmnožek."],
          ]),
          hint: "Najprej izračunaj rezultanto sil, nato $a = \\dfrac{F_r}{m}$.",
          data: { given: [dat("m", tx(m), "kg"), dat("F", F, "N"), dat("F_{tr}", Ft, "N")], find: ["a"] },
          formula: ["F_r = F - F_{tr}", "a = \\dfrac{F_r}{m}"],
          solution: `$F_r = F - F_{tr} = ${qty(F, "N")} - ${qty(Ft, "N")} = ${qty(F - Ft, "N")}$\n${eqs("a", "\\dfrac{F_r}{m}", `\\dfrac{${qty(F - Ft, "N")}}{${qty(tx(m), "kg")}}`, res((F - Ft) / m, 2, "m/s^2"))}`,
        };
      }
      return {
        text: `Kolikšna rezultanta sil je potrebna, da telo z maso $${tx(m)}\\ \\mathrm{kg}$ pospešuje s $${tx(a)}\\ \\mathrm{m/s^2}$? Zaokroži na dve decimalki.`,
        answer: num(m * a, "N", 2, {}, [
          [m / a, "Sila je masa krat pospešek, ne deljeno."],
          [m + a, "Maso in pospešek zmnoži, ne seštej."],
        ]),
        hint: "Drugi Newtonov zakon: $F = m \\cdot a$.",
        data: { given: [dat("m", tx(m), "kg"), dat("a", tx(a), "m/s^2")], find: ["F"] },
        formula: "F = m \\cdot a",
        solution: eqs("F", "m \\cdot a", `${qty(tx(m), "kg")} \\cdot ${qty(tx(a), "m/s^2")}`, res(m * a, 2, "N")),
      };
    },
  },
  {
    id: "energija",
    topics: ["FIZ-OS-9/kineticna-in-potencialna-energija", "FIZ-OS-9/delo", "FIZ-OS-9/moc-in-izkoristek", "FIZ-SS-1/energija", "FIZ-SS-1/delo-in-moc"],
    gen(level, r) {
      const m = r.dec(0.5, 80, 1);
      const kind = level === 1 ? "delo" : level === 2 ? r.pick(["wk", "wp"]) : r.pick(["moc", "pad"]);
      if (kind === "delo") {
        const F = r.int(5, 300);
        const s = r.int(1, 50);
        return {
          text: `S silo $${F}\\ \\mathrm{N}$ potiskamo zaboj $${s}\\ \\mathrm{m}$ daleč v smeri sile. Koliko dela opravimo?`,
          answer: num(F * s, "J", null, {}, [
            [F / s, "Delo je sila krat pot, ne deljeno s potjo."],
            [F + s, "Silo in pot zmnoži, ne seštej."],
          ]),
          hint: "$A = F \\cdot s$",
          data: { given: [dat("F", F, "N"), dat("s", s, "m")], find: ["A"] },
          formula: "A = F \\cdot s",
          solution: eqs("A", "F \\cdot s", `${qty(F, "N")} \\cdot ${qty(s, "m")}`, qty(F * s, "J")),
        };
      }
      if (kind === "wk") {
        const v = r.dec(1, 30, 1);
        return {
          text: `Kolikšna je kinetična energija telesa z maso $${tx(m)}\\ \\mathrm{kg}$, ki se giblje s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$? Zaokroži na celo število.`,
          answer: num((m * v * v) / 2, "J", 0, {}, [
            [m * v * v, "Pozabil si faktor ½ v formuli W_k = m v² / 2."],
            [(m * v) / 2, "Hitrost moraš kvadrirati."],
            [(m * 2 * v) / 2, "Kvadrirati pomeni v · v, ne 2 · v."],
          ]),
          hint: "$W_k = \\dfrac{m v^2}{2}$. Hitrost najprej kvadriraj.",
          data: { given: [dat("m", tx(m), "kg"), dat("v", tx(v), "m/s")], find: ["W_k"] },
          formula: "W_k = \\dfrac{m \\cdot v^2}{2}",
          solution: `$v^2 = (${qty(tx(v), "m/s")})^2 = ${qty(tx(v * v), "m^2/s^2")}$\n${eqs("W_k", "\\dfrac{m \\cdot v^2}{2}", `\\dfrac{${qty(tx(m), "kg")} \\cdot ${qty(tx(v * v), "m^2/s^2")}}{2}`, res((m * v * v) / 2, 0, "J"))}`,
        };
      }
      if (kind === "wp") {
        const h = r.dec(0.5, 40, 1);
        return {
          text: `Telo z maso $${tx(m)}\\ \\mathrm{kg}$ dvignemo za $${tx(h)}\\ \\mathrm{m}$. Za koliko se mu poveča potencialna energija? Uporabi $g = 9{,}81\\ \\mathrm{m/s^2}$ in zaokroži na celo število.`,
          answer: num(m * G * h, "J", 0, { alsoAccept: [m * 10 * h] }, [
            [m * h, "V formuli manjka g: ΔW_p = m · g · Δh."],
            [(m * G * h) / 2, "Pri potencialni energiji ni faktorja ½; ta je pri kinetični."],
          ]),
          hint: "$\\Delta W_p = m g \\Delta h$",
          data: { given: [dat("m", tx(m), "kg"), dat("\\Delta h", tx(h), "m"), dat("g", G_TEX, "m/s^2")], find: ["\\Delta W_p"] },
          formula: "\\Delta W_p = m \\cdot g \\cdot \\Delta h",
          solution: eqs("\\Delta W_p", "m \\cdot g \\cdot \\Delta h", `${qty(tx(m), "kg")} \\cdot ${qty(G_TEX, "m/s^2")} \\cdot ${qty(tx(h), "m")}`, res(m * G * h, 0, "J")),
        };
      }
      if (kind === "moc") {
        const A = r.int(100, 9000);
        const t = r.int(5, 120);
        return {
          text: `Motor opravi $${A}\\ \\mathrm{J}$ dela v $${t}\\ \\mathrm{s}$. Kolikšna je njegova moč? Zaokroži na eno decimalko.`,
          answer: num(A / t, "W", 1, {}, [
            [A * t, "Moč je delo deljeno s časom, ne zmnožek."],
            [A, "To je delo; moč dobiš, ko delo deliš s časom."],
          ]),
          hint: "$P = \\dfrac{A}{t}$",
          data: { given: [dat("A", A, "J"), dat("t", t, "s")], find: ["P"] },
          formula: "P = \\dfrac{A}{t}",
          solution: eqs("P", "\\dfrac{A}{t}", `\\dfrac{${qty(A, "J")}}{${qty(t, "s")}}`, res(A / t, 1, "W")),
        };
      }
      const h = r.dec(1, 45, 1);
      const v = Math.sqrt(2 * G * h);
      return {
        text: `Kamen spustimo z višine $${tx(h)}\\ \\mathrm{m}$. S kolikšno hitrostjo prileti na tla, če zanemarimo zračni upor? Uporabi $g = 9{,}81\\ \\mathrm{m/s^2}$ in zaokroži na dve decimalki.`,
        answer: num(v, "m/s", 2, {}, [
          [Math.sqrt(G * h), "Iz m g h = m v²/2 sledi v² = 2 g h: ne pozabi faktorja 2."],
          [2 * G * h, "To je v²; izračunati moraš še koren."],
          [G * h, "Hitrost je koren iz 2 g h."],
        ]),
        hint: "Potencialna energija se pretvori v kinetično: $m g h = \\dfrac{m v^2}{2}$.",
        data: { given: [dat("h", tx(h), "m"), dat("g", G_TEX, "m/s^2")], find: ["v"] },
        formula: ["W_p = W_k \\;\\Rightarrow\\; m \\cdot g \\cdot h = \\dfrac{m \\cdot v^2}{2}", "v = \\sqrt{2 \\cdot g \\cdot h}"],
        solution: `$m \\cdot g \\cdot h = \\dfrac{m \\cdot v^2}{2} \\;\\Rightarrow\\; v = \\sqrt{2 \\cdot g \\cdot h}$\n$v = \\sqrt{2 \\cdot ${qty(G_TEX, "m/s^2")} \\cdot ${qty(tx(h), "m")}} = \\sqrt{${qty(tx(2 * G * h), "m^2/s^2")}} ${res(v, 2, "m/s")}$`,
      };
    },
  },
  {
    id: "toplota",
    topics: ["FIZ-OS-9/toplota", "FIZ-SS-2/notranja-energija-in-toplota"],
    gen(level, r) {
      const subs = [["vode", 4200, "ji"], ["aluminija", 900, "mu"], ["železa", 450, "mu"], ["olja", 2000, "mu"]];
      const [name, c, pron] = level === 1 ? subs[0] : r.pick(subs);
      const m = r.dec(0.2, 5, 1);
      const dT = r.int(5, 80);
      const Q = m * c * dT;
      const cUnit = "J/(kg\\,K)";
      if (level === 3) {
        const QJ = roundHalfUp(Q / 1000, 1) * 1000; // toplota iz besedila (kJ) v J
        const dTOut = QJ / (m * c);
        return {
          text: `Koliko se segreje $${tx(m)}\\ \\mathrm{kg}$ ${name} ($c = ${c}\\ \\mathrm{J/(kg\\,K)}$), če ${pron} dovedemo $${tx(Q / 1000, 1)}\\ \\mathrm{kJ}$ toplote? Zaokroži na eno decimalko.`,
          answer: num(dTOut, "K", 1, { unitAlternatives: ["°c", "stopinj"] }, [
            [QJ / 1000 / (m * c), "Toploto moraš pretvoriti iz kJ v J."],
            [QJ / c, "Deliti moraš z zmnožkom m · c, ne le s c."],
            [(QJ * m) / c, "Iz Q = m c ΔT dobiš ΔT = Q / (m c): z maso deliš."],
          ]),
          hint: "Iz $Q = m c \\Delta T$ izrazi $\\Delta T$. Pazi: kJ pretvori v J.",
          data: { given: [dat("m", tx(m), "kg"), dat("c", c, cUnit), dat("Q", tx(Q / 1000, 1), "kJ")], find: ["\\Delta T"] },
          formula: ["Q = m \\cdot c \\cdot \\Delta T", "\\Delta T = \\dfrac{Q}{m \\cdot c}"],
          solution: `$Q = ${qty(tx(Q / 1000, 1), "kJ")} = ${qty(tx(QJ), "J")}$\n$\\Delta T = \\dfrac{Q}{m \\cdot c} = \\dfrac{${qty(tx(QJ), "J")}}{${qty(tx(m), "kg")} \\cdot ${qty(c, cUnit)}} ${res(dTOut, 1, "K")}$`,
        };
      }
      return {
        text: `Koliko toplote potrebujemo, da $${tx(m)}\\ \\mathrm{kg}$ ${name} ($c = ${c}\\ \\mathrm{J/(kg\\,K)}$) segrejemo za $${dT}\\ \\mathrm{K}$? Rezultat zapiši v kJ in zaokroži na eno decimalko.`,
        answer: num(Q / 1000, "kJ", 1, {}, [
          [Q, "Rezultat je v J; pretvori ga v kJ."],
          [(m * c * (dT + 273)) / 1000, "Sprememba temperature je v K in °C enaka: 273 ne prišteješ."],
          [(c * dT) / 1000, "Upoštevati moraš tudi maso."],
        ]),
        hint: "$Q = m c \\Delta T$. Rezultat deli s 1000, da dobiš kJ.",
        data: { given: [dat("m", tx(m), "kg"), dat("c", c, cUnit), dat("\\Delta T", dT, "K")], find: ["Q"] },
        formula: ["Q = m \\cdot c \\cdot \\Delta T", "1\\ \\mathrm{kJ} = 1000\\ \\mathrm{J}"],
        solution: `${eqs("Q", "m \\cdot c \\cdot \\Delta T", `${qty(tx(m), "kg")} \\cdot ${qty(c, cUnit)} \\cdot ${qty(dT, "K")}`, qty(tx(Q), "J"))}\n$Q = ${qty(tx(Q), "J")} = ${qty(tx(Q / 1000), "kJ")}${rnd(Q / 1000, 1, "kJ")}$`,
      };
    },
  },
  {
    id: "ohm",
    topics: ["FIZ-OS-9/upor-in-ohmov-zakon", "FIZ-SS-2/elektricni-tok", "FIZ-OS-9/elektricno-delo-in-moc", "FIZ-OS-9/elektricni-krog", "FIZ-SS-2/elektricna-vezja"],
    gen(level, r) {
      if (level === 1) {
        const R = r.int(2, 100);
        const I = r.dec(0.1, 3, 1);
        return {
          text: `Skozi upornik z uporom $${R}\\ \\Omega$ teče tok $${tx(I)}\\ \\mathrm{A}$. Kolikšna je napetost na uporniku?`,
          answer: num(R * I, "V", null, { tolerance: 1e-9 }, [
            [R / I, "Napetost je upor krat tok, ne deljeno."],
            [I / R, "Napetost je upor krat tok: U = R · I."],
            [R + I, "Upor in tok zmnoži, ne seštej."],
          ]),
          hint: "Ohmov zakon: $U = R \\cdot I$.",
          data: { given: [dat("R", R, "\\Omega"), dat("I", tx(I), "A")], find: ["U"] },
          formula: "U = R \\cdot I",
          solution: eqs("U", "R \\cdot I", `${qty(R, "\\Omega")} \\cdot ${qty(tx(I), "A")}`, qty(tx(R * I), "V")),
        };
      }
      if (level === 2) {
        const U = r.pick([4.5, 9, 12, 24, 230]);
        const R = r.int(5, 500);
        return {
          text: `Na upornik z uporom $${R}\\ \\Omega$ priključimo napetost $${tx(U)}\\ \\mathrm{V}$. Kolikšen tok teče? Rezultat v A zaokroži na tri decimalke.`,
          answer: num(U / R, "A", 3, {}, [
            [U * R, "Tok je napetost deljeno z uporom, ne zmnožek."],
            [R / U, "Napetost deliš z uporom, ne obratno."],
          ]),
          hint: "Iz $U = R I$ izrazi $I = \\dfrac{U}{R}$.",
          data: { given: [dat("R", R, "\\Omega"), dat("U", tx(U), "V")], find: ["I"] },
          formula: ["U = R \\cdot I", "I = \\dfrac{U}{R}"],
          solution: `$U = R \\cdot I \\;\\Rightarrow\\; I = \\dfrac{U}{R}$\n${eqs("I", `\\dfrac{${qty(tx(U), "V")}}{${qty(R, "\\Omega")}}`, res(U / R, 3, "A"))}`,
        };
      }
      const R1 = r.int(2, 60);
      const R2 = r.int(2, 60);
      const series = r.next() < 0.5;
      const R = series ? R1 + R2 : (R1 * R2) / (R1 + R2);
      return {
        text: `Upornika $R_1 = ${R1}\\ \\Omega$ in $R_2 = ${R2}\\ \\Omega$ sta vezana ${series ? "zaporedno" : "vzporedno"}. Kolikšen je nadomestni upor? Zaokroži na dve decimalki.`,
        answer: num(
          R,
          "Ω",
          2,
          { unitAlternatives: ["ohm", "ohmov", "om"] },
          series
            ? [
                [(R1 * R2) / (R1 + R2), "To bi veljalo za vzporedno vezavo; pri zaporedni se upora seštejeta."],
                [R1 * R2, "Pri zaporedni vezavi upora seštejemo, ne zmnožimo."],
              ]
            : [
                [R1 + R2, "To velja za zaporedno vezavo; pri vzporedni je nadomestni upor manjši od vsakega."],
                [1 / R1 + 1 / R2, "To je 1/R; vrednost moraš še obrniti."],
                [(R1 + R2) / 2, "Nadomestni upor ni povprečje uporov."],
              ],
        ),
        hint: series ? "Pri zaporedni vezavi se upora seštejeta." : "Pri vzporedni vezavi: $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$.",
        data: { given: [dat("R_1", R1, "\\Omega"), dat("R_2", R2, "\\Omega")], find: ["R"] },
        formula: series ? "R = R_1 + R_2" : ["\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}", "R = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}"],
        solution: series
          ? `Pri zaporedni vezavi se upora seštejeta.\n${eqs("R", "R_1 + R_2", `${qty(R1, "\\Omega")} + ${qty(R2, "\\Omega")}`, qty(R1 + R2, "\\Omega"))}`
          : eqs("R", "\\dfrac{R_1 \\cdot R_2}{R_1 + R_2}", `\\dfrac{${qty(R1, "\\Omega")} \\cdot ${qty(R2, "\\Omega")}}{${qty(R1, "\\Omega")} + ${qty(R2, "\\Omega")}}`, `\\dfrac{${R1 * R2}}{${R1 + R2}}\\ \\Omega`, res(R, 2, "\\Omega")),
      };
    },
  },
];
