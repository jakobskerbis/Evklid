// Gimnazija: drugi tip naloge za teme fiz-ss23, ki so imele en sam generator (j, 2026-11-25).
// Merila: docs/kakovost.md §2. Vsak rezultat je izračunan v kodi iz istih (zaokroženih) števil,
// ki jih dijak vidi v besedilu. Slog sledi dodatne-fiz-ss.js.
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { wrapGens } from "./matura-util.js";

const GZ = 9.81;
const G_TEX = "9{,}81";
const R_GAS = 8.31;
const K = {
  g: `g = ${G_TEX}\\ \\mathrm{m/s^2}`,
  R: "R = 8{,}31\\ \\mathrm{J/(mol\\,K)}",
};

// Količina z enoto (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}"; enota z \ ostane.
const qty = (val, unit) => (!unit ? `${val}` : `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`);
const dat = (sym, val, unit) => `${sym} = ${qty(val, unit)}`;
const cel = (sym, t) => `${sym} = ${t}\\ ^\\circ\\mathrm{C}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const eq = (x, d) => (needsRounding(x, d) ? "\\approx" : "=");
const res = (x, d, unit) => `${eq(x, d)} ${qty(tx(x, d), unit)}`;
const rad = (a) => (a * Math.PI) / 180;
const M = (value, why) => ({ value, why });

// Številski odgovor (enota je lahko null); napake, ki bi se zaokrožile v pravilni rezultat, izpustimo.
function num(value, unit, decimals, mistakes = [], extra = {}) {
  const same = (a, b) => (decimals == null ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) : roundHalfUp(a, decimals) === roundHalfUp(b, decimals));
  const kept = [];
  for (const m of mistakes) {
    if (!m || !Number.isFinite(m.value) || same(m.value, value) || kept.some((k) => same(k.value, m.value))) continue;
    kept.push(m);
  }
  const a = { type: "number", value, decimals, ...extra };
  if (unit) a.unit = unit;
  if (unit === "Ω") a.unitAlternatives = ["ohm", "ohmov", "om"];
  if (kept.length) a.mistakes = kept.slice(0, 3);
  return a;
}
// Izbirni odgovor: correct = besedilo pravilne možnosti, wrong = [[besedilo, zakaj narobe], …] (največ 3).
function choice(r, correct, wrong) {
  const opts = r.shuffle([[correct, null], ...r.shuffle(wrong).slice(0, 3)]);
  return { type: "choice", options: opts.map((o) => o[0]), index: opts.findIndex((o) => o[1] === null), why: opts.map((o) => o[1]) };
}
// Podatek, katerega števila niso v besedilu (g, R), besedilo navede z »Uporabi …«.
const normT = (x) => String(x).replace(/\{,\}/g, ",").replace(/\\[,;: ]|~/g, " ");
const numsT = (x) => normT(x.replace(/\\mathrm\{(?:[^{}]|\{[^{}]*\})*\}/g, "")).match(/-?\d+(?:,\d+)?/g) || [];
const withConsts = (text, given) => {
  const miss = given.filter((d) => d.includes("=") && numsT(d.split("=").slice(1).join("=")).some((x) => !normT(text).includes(x)));
  if (!miss.length) return text;
  const l = miss.map((d) => `$${d}$`);
  const list = l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} in ${l.at(-1)}`;
  if (text.includes(" Zaokroži ")) return text.replace(" Zaokroži ", ` Uporabi ${list}${l.length === 1 ? " in" : " ter"} zaokroži `);
  return `${text} Uporabi ${list}.`;
};
const T = (text, answer, hint, given, find, formula, steps) => ({ text: withConsts(text, given), answer, hint, data: { given, find }, formula, solution: steps.join("\n") });
const ime = (r) => r.pick(NAMES);
const dw = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : d === 3 ? "na tri decimalke" : `na ${d} decimalke`);
const KT = (t) => t + 273;

export const GIMNAZIJA_FIZ_SS23 = wrapGens([
  // ---------------- Enakomerno kroženje: razmerja, obratna vprašanja, kroženje v navpični ravnini ----------------
  {
    id: "gim-krozenje-dop",
    topics: ["FIZ-SS-2/enakomerno-krozenje"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const k = r.pick([1.5, 2, 2.5, 3]);
          const v1 = r.int(2, Math.floor(12 / k)) * 10;
          const v2 = v1 * k;
          const f = (v2 / v1) ** 2;
          const who = r.pick(["Avto", "Motorist", "Avtobus", "Kolesar"]);
          const v1s = who === "Kolesar" ? v1 / 5 : v1;
          const v2s = who === "Kolesar" ? v2 / 5 : v2;
          return T(
            `${who} pelje skozi isti ovinek najprej s hitrostjo $${qty(tx(v1s), "km/h")}$, nato s hitrostjo $${qty(tx(v2s), "km/h")}$. Kolikokrat večji je radialni pospešek pri večji hitrosti? Zaokroži na dve decimalki.`,
            num(f, null, 2, [M(k, "Radialni pospešek ni sorazmeren s hitrostjo, ampak s kvadratom hitrosti."), M(2 * k, "Hitrost v formuli kvadriramo, ne podvojimo.")]),
            "Polmer ovinka je obakrat enak. Zapiši razmerje $a_2 / a_1$ s formulo za radialni pospešek.",
            [dat("v_1", tx(v1s), "km/h"), dat("v_2", tx(v2s), "km/h")],
            ["\\dfrac{a_2}{a_1}"],
            ["a_r = \\dfrac{v^2}{r}", "\\dfrac{a_2}{a_1} = \\left(\\dfrac{v_2}{v_1}\\right)^2"],
            [`$\\dfrac{a_2}{a_1} = \\dfrac{v_2^2 / r}{v_1^2 / r} = \\left(\\dfrac{v_2}{v_1}\\right)^2$`, `$\\dfrac{v_2}{v_1} = \\dfrac{${tx(v2s)}}{${tx(v1s)}} = ${tx(k)}$`, `$\\dfrac{a_2}{a_1} = ${tx(k)}^2 ${res(f, 2, null)}$`],
          );
        }
        if (kind === 1) {
          const O = r.pick([
            { what: "Sedež na vrtiljaku", r: [3, 8], v: [2, 6] },
            { what: "Otrok na vrtljivi plošči na igrišču", r: [0.8, 1.6], v: [1, 3] },
            { what: "Vagonček na krožni progi", r: [10, 25], v: [4, 12] },
            { what: "Model letala na žici", r: [8, 15], v: [10, 25] },
          ]);
          const rr = r.dec(O.r[0], O.r[1], 1);
          const v = r.dec(O.v[0], O.v[1], 1);
          const t0 = (2 * Math.PI * rr) / v;
          const askNu = r.next() < 0.4;
          if (askNu) {
            const nu = 1 / t0;
            return T(
              `${O.what} kroži po krožnici s polmerom $${qty(tx(rr), "m")}$ z obodno hitrostjo $${qty(tx(v), "m/s")}$. Kolikšna je frekvenca kroženja? Zaokroži na tri decimalke.`,
              num(nu, "Hz", 3, [M(t0, "To je obhodni čas; frekvenca je njegova obratna vrednost."), M(v / rr, "Hitrost deli z obsegom krožnice $2\\pi r$, ne s polmerom.")], { unitAlternatives: ["s^-1", "1/s", "/s"] }),
              "V enem obhodu telo prepotuje obseg krožnice; frekvenca pove, koliko obhodov naredi v sekundi.",
              [dat("r", tx(rr), "m"), dat("v", tx(v), "m/s")],
              ["\\nu"],
              ["v = 2\\pi r \\nu", "\\nu = \\dfrac{v}{2\\pi r}"],
              [`$2\\pi r = 2\\pi \\cdot ${qty(tx(rr), "m")} ${res(2 * Math.PI * rr, 3, "m")}$`, `$\\nu = \\dfrac{v}{2\\pi r} = \\dfrac{${tx(v)}}{${tx(2 * Math.PI * rr, 3)}}\\ \\mathrm{s^{-1}} ${res(nu, 3, "Hz")}$`],
            );
          }
          return T(
            `${O.what} kroži po krožnici s polmerom $${qty(tx(rr), "m")}$ z obodno hitrostjo $${qty(tx(v), "m/s")}$. Koliko časa traja en obhod? Zaokroži na dve decimalki.`,
            num(t0, "s", 2, [M(rr / v, "V enem obhodu telo prepotuje obseg $2\\pi r$, ne polmera."), M((Math.PI * rr) / v, "Obseg krožnice je $2\\pi r$."), M(v / (2 * Math.PI * rr), "To je frekvenca; obhodni čas je njena obratna vrednost.")]),
            "Obhodni čas je čas, v katerem telo prepotuje obseg krožnice.",
            [dat("r", tx(rr), "m"), dat("v", tx(v), "m/s")],
            ["t_0"],
            ["v = \\dfrac{2\\pi r}{t_0}", "t_0 = \\dfrac{2\\pi r}{v}"],
            [`$2\\pi r = 2\\pi \\cdot ${qty(tx(rr), "m")} ${res(2 * Math.PI * rr, 3, "m")}$`, `$t_0 = \\dfrac{2\\pi r}{v} = \\dfrac{${tx(2 * Math.PI * rr, 3)}}{${tx(v)}}\\ \\mathrm{s} ${res(t0, 2, "s")}$`],
          );
        }
        const q = r.int(0, 2);
        if (q === 0) {
          const k = r.pick([2, 3, 4]);
          const rr = r.int(3, 12) * 10;
          return T(
            `Avto pelje s stalno hitrostjo skozi ovinek s polmerom $${rr}\\ \\mathrm{m}$. Kaj se zgodi z radialnim pospeškom, če z enako hitrostjo pelje skozi ovinek s ${k}-krat večjim polmerom?`,
            choice(r, `zmanjša se ${k}-krat`, [
              [`poveča se ${k}-krat`, "Polmer je v imenovalcu: bolj položen ovinek pomeni manjši pospešek."],
              [`zmanjša se ${k * k}-krat`, "Na kvadrat je hitrost, ne polmer."],
              ["ostane enak, ker je hitrost enaka", "Pospešek je odvisen tudi od polmera: pri večjem polmeru se smer hitrosti obrača počasneje."],
            ]),
            "Poglej, kje v formuli za radialni pospešek stoji polmer.",
            [dat("r", rr, "m"), `r' = ${k} \\cdot r`],
            ["\\dfrac{a'}{a}"],
            ["a_r = \\dfrac{v^2}{r}"],
            [`$a_r = \\dfrac{v^2}{r}$: pri enaki hitrosti je $a_r$ obratno sorazmeren s polmerom.`, `$\\dfrac{a'}{a} = \\dfrac{r}{r'} = \\dfrac{1}{${k}}$, pospešek se zmanjša ${k}-krat.`],
          );
        }
        if (q === 1) {
          const rr = r.dec(0.5, 1.5, 1);
          const v = r.dec(2, 6, 1);
          return T(
            `${n} vrti kamen na vrvici dolžine $${qty(tx(rr), "m")}$ po vodoravni krožnici s hitrostjo $${qty(tx(v), "m/s")}$. V nekem trenutku se vrvica pretrga. Kako se kamen giblje tik po tem (gledano od zgoraj)?`,
            choice(r, "premo, v smeri hitrosti v tistem trenutku (po tangenti)", [
              ["radialno navzven, stran od središča", "Navzven na kamen ne deluje nobena sila; »centrifugalna sila« je le občutek v vrtečem se sistemu."],
              ["naprej po isti krožnici, dokler se ne ustavi", "Za ukrivljeno pot je potrebna sila proti središču; brez vrvice je ni več."],
              ["proti središču krožnice", "Vrvica kamna ne vleče več, zato ga nič ne usmerja proti središču."],
            ]),
            "Pomisli, katere vodoravne sile delujejo na kamen, ko vrvica ne vleče več, in kaj pravi 1. Newtonov zakon.",
            [dat("r", tx(rr), "m"), dat("v", tx(v), "m/s")],
            ["\\text{smer gibanja}"],
            ["F_r = \\dfrac{m v^2}{r}"],
            ["Med kroženjem je vrvica dajala centripetalno silo $F_r = \\dfrac{m v^2}{r}$.", "Ko se pretrga, v vodoravni smeri ne deluje nobena sila.", "Po 1. Newtonovem zakonu kamen nadaljuje premo s hitrostjo, ki jo je imel: po tangenti."],
          );
        }
        const vk = r.int(4, 9) * 10;
        const rr = r.int(5, 20) * 10;
        return T(
          `Avto pelje s hitrostjo $${vk}\\ \\mathrm{km/h}$ skozi vodoraven ovinek s polmerom $${rr}\\ \\mathrm{m}$. Katera sila mu daje centripetalno silo?`,
          choice(r, "sila lepenja med pnevmatikami in cesto", [
            ["teža avtomobila", "Teža kaže navpično navzdol, centripetalna sila pa vodoravno proti središču ovinka."],
            ["centrifugalna sila", "Centrifugalna sila ni sila, ki bi jo na avto izvajalo kakšno telo; kaže tudi navzven, ne proti središču."],
            ["sila motorja, ki poganja avto naprej", "Ta sila kaže v smeri gibanja (po tangenti), ne proti središču ovinka."],
          ]),
          "Centripetalna sila ni nova vrsta sile: poišči telo, ki se avtomobila dotika in ga lahko potiska vodoravno proti središču ovinka.",
          [dat("v", vk, "km/h"), dat("r", rr, "m")],
          ["\\text{sila proti središču}"],
          ["F_r = \\dfrac{m v^2}{r}"],
          ["Za kroženje je potrebna vodoravna sila proti središču, $F_r = \\dfrac{m v^2}{r}$.", "Teža in sila podlage sta navpični in se uravnovesita.", "Vodoravno na avto deluje le cesta prek pnevmatik: to je sila lepenja."],
        );
      }
      if (level === 2) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          // Satelit: obhodni čas iz Keplerjevega zakona (GM Zemlje), da so podatki realni.
          const moon = r.next() < 0.2;
          if (moon) {
            const rk = 384000;
            const days = 27.3;
            const v = (2 * Math.PI * rk) / (days * 86400);
            return T(
              `Luna kroži okoli Zemlje po približno krožnem tiru s polmerom $${rk}\\ \\mathrm{km}$; en obhod naredi v $${qty(tx(days), "dneh")}$. Kolikšna je njena obodna hitrost v km/s? Zaokroži na dve decimalki.`,
              num(v, "km/s", 2, [M((2 * Math.PI * rk) / days, "Obhodni čas pretvori v sekunde (1 dan = 86 400 s)."), M(rk / (days * 86400), "V enem obhodu Luna prepotuje obseg $2\\pi r$, ne polmera."), M(v * 1000, "Rezultat zapiši v km/s, ne v m/s.")]),
              "Obhodni čas najprej pretvori v sekunde, nato deli obseg tira s časom.",
              [dat("r", rk, "km"), dat("t_0", tx(days), "dni")],
              ["v"],
              ["v = \\dfrac{2\\pi r}{t_0}"],
              [`$t_0 = ${tx(days)} \\cdot 86\\,400\\ \\mathrm{s} = ${qty(tx(days * 86400), "s")}$`, `$2\\pi r = 2\\pi \\cdot ${rk}\\ \\mathrm{km} ${res(2 * Math.PI * rk, 0, "km")}$`, `$v = \\dfrac{2\\pi r}{t_0} ${res(v, 2, "km/s")}$`],
            );
          }
          const rk = r.int(68, 420) * 100;
          const tsec = 2 * Math.PI * Math.sqrt((rk * 1000) ** 3 / 3.986e14);
          const inMin = tsec < 300 * 60;
          const tShow = inMin ? Math.round(tsec / 60) : roundHalfUp(tsec / 3600, 1);
          const tS = inMin ? tShow * 60 : tShow * 3600;
          const un = inMin ? "min" : "h";
          const conv = inMin ? 60 : 3600;
          const v = (2 * Math.PI * rk) / tS;
          const what = r.pick(["Satelit", "Vremenski satelit", "Komunikacijski satelit", "Navigacijski satelit"]);
          return T(
            `${what} kroži okoli Zemlje po krožnici s polmerom $${rk}\\ \\mathrm{km}$ (merjeno od središča Zemlje). En obhod naredi v $${qty(tx(tShow), un)}$. Kolikšna je njegova obodna hitrost v km/s? Zaokroži na dve decimalki.`,
            num(v, "km/s", 2, [M((2 * Math.PI * rk) / tShow, `Obhodni čas pretvori v sekunde (1 ${un} = ${conv} s).`), M(rk / tS, "V enem obhodu satelit prepotuje obseg $2\\pi r$, ne polmera."), M(v * 1000, "Rezultat zapiši v km/s, ne v m/s.")]),
            "Obhodni čas najprej pretvori v sekunde, nato deli obseg tira s časom.",
            [dat("r", rk, "km"), dat("t_0", tx(tShow), un)],
            ["v"],
            ["v = \\dfrac{2\\pi r}{t_0}"],
            [`$t_0 = ${tx(tShow)} \\cdot ${conv}\\ \\mathrm{s} = ${qty(tx(tS), "s")}$`, `$2\\pi r = 2\\pi \\cdot ${rk}\\ \\mathrm{km} ${res(2 * Math.PI * rk, 0, "km")}$`, `$v = \\dfrac{2\\pi r}{t_0} ${res(v, 2, "km/s")}$`],
          );
        }
        if (kind === 1) {
          const rr = r.dec(2, 4, 1);
          const t0 = r.dec(2, 3, 1);
          const a = (4 * Math.PI * Math.PI * rr) / (t0 * t0);
          const v = (2 * Math.PI * rr) / t0;
          const intro = `V zabaviščnem parku se valj (rotor) s polmerom $${qty(tx(rr), "m")}$ vrti tako, da naredi en obrat v $${qty(tx(t0), "s")}$. Obiskovalci stojijo ob steni.`;
          if (r.next() < 0.5) {
            const f = a / GZ;
            return T(
              `${intro} Kolikokrat je njihov radialni pospešek večji od težnega pospeška? Zaokroži na eno decimalko.`,
              num(f, null, 1, [M(a, "To je radialni pospešek v $\\mathrm{m/s^2}$; deli ga še z $g$."), M(v / GZ, "Najprej iz obodne hitrosti izračunaj radialni pospešek $v^2/r$."), M((2 * Math.PI * rr) / (t0 * t0) / GZ, "Obodno hitrost moraš kvadrirati.")]),
              "Iz obhodnega časa izračunaj obodno hitrost, nato radialni pospešek, in ga primerjaj z $g$.",
              [dat("r", tx(rr), "m"), dat("t_0", tx(t0), "s"), K.g],
              ["\\dfrac{a_r}{g}"],
              ["v = \\dfrac{2\\pi r}{t_0}", "a_r = \\dfrac{v^2}{r}"],
              [`$v = \\dfrac{2\\pi \\cdot ${tx(rr)}}{${tx(t0)}}\\ \\mathrm{m/s} ${res(v, 3, "m/s")}$`, `$a_r = \\dfrac{v^2}{r} ${res(a, 2, "m/s^2")}$`, `$\\dfrac{a_r}{g} = \\dfrac{${tx(a, 2)}}{${G_TEX}} ${res(f, 1, null)}$`],
            );
          }
          const m = r.int(40, 80);
          const F = m * a;
          return T(
            `${intro} S kolikšno silo stena pritiska na ${n === "Žan" ? "Žana" : n.endsWith("a") ? n.slice(0, -1) + "o" : n + "a"}, ki ima maso $${m}\\ \\mathrm{kg}$? Zaokroži na celo število.`,
            num(F, "N", 0, [M(m * GZ, "To je teža; stena daje centripetalno silo $m v^2/r$."), M(m * v, "To je gibalna količina; sila je $m v^2 / r$."), M((m * v * v) / (2 * rr), "Formula za centripetalno silo nima faktorja ½.")]),
            "Sila stene je centripetalna sila. Najprej izračunaj obodno hitrost iz obhodnega časa.",
            [dat("r", tx(rr), "m"), dat("t_0", tx(t0), "s"), dat("m", m, "kg")],
            ["F"],
            ["v = \\dfrac{2\\pi r}{t_0}", "F_r = \\dfrac{m v^2}{r}"],
            [`$v = \\dfrac{2\\pi \\cdot ${tx(rr)}}{${tx(t0)}}\\ \\mathrm{m/s} ${res(v, 3, "m/s")}$`, `$F_r = \\dfrac{m v^2}{r} = \\dfrac{${m} \\cdot (${tx(v, 3)})^2}{${tx(rr)}}\\ \\mathrm{N} ${res(F, 0, "N")}$`],
          );
        }
        // Najmanjša hitrost na vrhu navpične krožnice: teža sama da centripetalno silo.
        if (r.next() < 0.5) {
          const rr = r.dec(0.6, 1.2, 2);
          const v = Math.sqrt(GZ * rr);
          return T(
            `${n} vrti vedro z vodo po navpični krožnici s polmerom $${qty(tx(rr), "m")}$. Kolikšna mora biti najmanjša hitrost vedra na vrhu krožnice, da voda ne izteče? Zaokroži na dve decimalki.`,
            num(v, "m/s", 2, [M(Math.sqrt(2 * GZ * rr), "To ni prosti pad z višine $r$; na vrhu je teža ravno enaka potrebni centripetalni sili."), M(GZ * rr, "Pozabil si koreniti."), M(Math.sqrt(GZ / rr), "Iz $g = v^2/r$ sledi $v^2 = g r$.")]),
            "Na vrhu pri najmanjši hitrosti vedro na vodo ne pritiska; centripetalno silo daje samo teža.",
            [dat("r", tx(rr), "m"), K.g],
            ["v_{min}"],
            ["m g = \\dfrac{m v^2}{r}", "v_{min} = \\sqrt{g r}"],
            [`$m g = \\dfrac{m v^2}{r} \\Rightarrow v^2 = g r$`, `$v = \\sqrt{${G_TEX} \\cdot ${tx(rr)}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`],
          );
        }
        const rr = r.int(5, 15);
        const v = Math.sqrt(GZ * rr);
        return T(
          `Vagonček na vlakcu smrti zapelje skozi navpično zanko s polmerom $${rr}\\ \\mathrm{m}$. Kolikšna mora biti najmanj njegova hitrost na vrhu zanke, da ne izgubi stika s tirom? Rezultat zapiši v km/h in zaokroži na celo število.`,
          num(v * 3.6, "km/h", 0, [M(v, "Rezultat pretvori v km/h (pomnoži s 3,6)."), M(Math.sqrt(2 * GZ * rr) * 3.6, "Na vrhu velja $mg = m v^2/r$, ne $mgr = m v^2/2$."), M(v / 3.6, "Iz m/s v km/h pomnožiš s 3,6, ne deliš.")]),
          "Na vrhu pri najmanjši hitrosti tir ne pritiska na vagonček; centripetalno silo daje samo teža.",
          [dat("r", rr, "m"), K.g],
          ["v_{min}"],
          ["m g = \\dfrac{m v^2}{r}", "v_{min} = \\sqrt{g r}"],
          [`$m g = \\dfrac{m v^2}{r} \\Rightarrow v = \\sqrt{g r}$`, `$v = \\sqrt{${G_TEX} \\cdot ${rr}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`, `$v = ${tx(v, 2)} \\cdot 3{,}6\\ \\mathrm{km/h} ${res(v * 3.6, 0, "km/h")}$`],
        );
      }
      const kind = r.int(0, 2);
      if (kind === 0) {
        // Verižni vrtiljak (stožčasto nihalo): tan α = a_r / g.
        const a = r.pick([20, 25, 30, 35, 40, 45]);
        const rr = r.dec(4, 9, 1);
        const t0 = 2 * Math.PI * Math.sqrt(rr / (GZ * Math.tan(rad(a))));
        const ar = GZ * Math.tan(rad(a));
        return T(
          `Na verižnem vrtiljaku sedeži krožijo po vodoravni krožnici s polmerom $${qty(tx(rr), "m")}$, verige pa so odklonjene za $${a}^\\circ$ od navpičnice. Kolikšen je obhodni čas vrtiljaka? Zaokroži na dve decimalki.`,
          num(t0, "s", 2, [M(2 * Math.PI * Math.sqrt(rr / (GZ * Math.sin(rad(a)))), "Razmerje vodoravne in navpične komponente sile verige je $\\tan\\alpha$, ne $\\sin\\alpha$."), M(2 * Math.PI * Math.sqrt((rr * Math.tan(rad(a))) / GZ), "Iz $\\tan\\alpha = a_r / g$ sledi $a_r = g \\tan\\alpha$, ne $g / \\tan\\alpha$."), M(Math.sqrt(rr / ar), "Iz $a_r = 4\\pi^2 r / t_0^2$ ne pozabi faktorja $2\\pi$.")]),
          "Na sedež delujeta teža in sila verige. Navpična komponenta sile verige uravnovesi težo, vodoravna je centripetalna sila. Iz razmerja dobiš $a_r$.",
          [dat("r", tx(rr), "m"), `\\alpha = ${a}^\\circ`, K.g],
          ["t_0"],
          ["\\tan\\alpha = \\dfrac{a_r}{g}", "a_r = \\dfrac{4\\pi^2 r}{t_0^2}"],
          [`$F\\cos\\alpha = m g,\\ F\\sin\\alpha = m a_r \\Rightarrow a_r = g\\tan\\alpha$`, `$a_r = ${G_TEX} \\cdot \\tan ${a}^\\circ\\ \\mathrm{m/s^2} ${res(ar, 3, "m/s^2")}$`, `$t_0 = 2\\pi\\sqrt{\\dfrac{r}{a_r}} = 2\\pi\\sqrt{\\dfrac{${tx(rr)}}{${tx(ar, 3)}}}\\ \\mathrm{s} ${res(t0, 2, "s")}$`],
        );
      }
      if (kind === 1) {
        // Najkrajši obhodni čas, da vrvica zdrži (kroženje na gladki vodoravni mizi).
        const m = r.dec(0.2, 1.5, 1);
        const rr = r.dec(0.4, 1.2, 1);
        const F = r.int(5, 40) * 5;
        const v = Math.sqrt((F * rr) / m);
        const t0 = (2 * Math.PI * rr) / v;
        return T(
          `${n} vrti utež z maso $${qty(tx(m), "kg")}$ na vrvici dolžine $${qty(tx(rr), "m")}$ po vodoravni krožnici na gladki mizi. Vrvica zdrži silo največ $${F}\\ \\mathrm{N}$. Kolikšen je najkrajši obhodni čas, pri katerem se vrvica še ne pretrga? Zaokroži na dve decimalki.`,
          num(t0, "s", 2, [M(v, "To je največja obodna hitrost; iz nje izračunaj še obhodni čas."), M(2 * Math.PI * Math.sqrt(m / (F * rr)), "Iz $F = 4\\pi^2 m r / t_0^2$ izrazi $t_0^2 = 4\\pi^2 m r / F$: polmer je v števcu."), M((2 * Math.PI * rr) / ((F * rr) / m), "Iz $v^2 = F r / m$ moraš še koreniti.")]),
          "Največja sila vrvice je ravno potrebna centripetalna sila. Izrazi največjo obodno hitrost, nato obhodni čas.",
          [dat("m", tx(m), "kg"), dat("r", tx(rr), "m"), dat("F_{max}", F, "N")],
          ["t_0"],
          ["F = \\dfrac{m v^2}{r}", "t_0 = \\dfrac{2\\pi r}{v}"],
          [`$v_{max} = \\sqrt{\\dfrac{F r}{m}} = \\sqrt{\\dfrac{${F} \\cdot ${tx(rr)}}{${tx(m)}}}\\ \\mathrm{m/s} ${res(v, 3, "m/s")}$`, `$t_0 = \\dfrac{2\\pi r}{v_{max}} = \\dfrac{2\\pi \\cdot ${tx(rr)}}{${tx(v, 3)}}\\ \\mathrm{s} ${res(t0, 2, "s")}$`, "Pri krajšem obhodnem času bi bila potrebna sila večja od $F_{max}$."],
        );
      }
      // Gugalnica v najnižji točki: sila verig = teža + centripetalna sila.
      const m = r.int(25, 70);
      const l = r.dec(1.8, 3.5, 1);
      const v = r.dec(2, 5, 1);
      const F = m * (GZ + (v * v) / l);
      return T(
        `${n} z maso $${m}\\ \\mathrm{kg}$ se guga na gugalnici z verigama dolžine $${qty(tx(l), "m")}$. V najnižji točki ima hitrost $${qty(tx(v), "m/s")}$. S kolikšno skupno silo vlečeta verigi? Maso sedeža zanemari. Zaokroži na celo število.`,
        num(F, "N", 0, [M((m * v * v) / l, "Verigi morata poleg centripetalne sile uravnovesiti še težo."), M(m * GZ, "To je le teža; v najnižji točki je potrebna še centripetalna sila."), M(m * GZ - (m * v * v) / l, "Rezultanta sil kaže proti središču, torej navzgor: sila verig je večja od teže.")]),
        "V najnižji točki kaže rezultanta sile verig in teže navzgor, proti središču krožnice. Zapiši 2. Newtonov zakon v tej smeri.",
        [dat("m", m, "kg"), dat("l", tx(l), "m"), dat("v", tx(v), "m/s"), K.g],
        ["F"],
        ["F - m g = \\dfrac{m v^2}{l}", "F = m\\left(g + \\dfrac{v^2}{l}\\right)"],
        [`$F - m g = \\dfrac{m v^2}{l}$`, `$\\dfrac{v^2}{l} = \\dfrac{(${tx(v)})^2}{${tx(l)}}\\ \\mathrm{m/s^2} ${res((v * v) / l, 3, "m/s^2")}$`, `$F = ${m} \\cdot (${G_TEX} + ${tx((v * v) / l, 3)})\\ \\mathrm{N} ${res(F, 0, "N")}$`],
      );
    },
  },
  // ---------------- Plinska enačba: obratna vprašanja, molska masa, mešanje in črpanje ----------------
  {
    id: "gim-plinska-dop",
    topics: ["FIZ-SS-2/plinska-enacba"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const s = r.int(0, 2);
          if (s === 0) {
            const t1 = r.pick([10, 15, 20, 25, 30, 40, 50]);
            const t2 = 2 * t1;
            return T(
              `Zaprto jeklenko z zrakom (stalna prostornina) segrejemo s $${t1}\\ ^\\circ\\mathrm{C}$ na $${t2}\\ ^\\circ\\mathrm{C}$. Kaj se zgodi s tlakom?`,
              choice(r, "poveča se, a precej manj kot 2-krat", [
                ["poveča se 2-krat", "Tlak je sorazmeren z absolutno temperaturo v kelvinih, ne s temperaturo v °C."],
                ["ostane enak, ker se prostornina ne spremeni", "Pri stalni prostornini tlak raste s temperaturo: hitrejše molekule močneje in pogosteje trkajo ob steno."],
                ["zmanjša se", "Pri segrevanju se molekule gibljejo hitreje, zato tlak naraste."],
              ]),
              "Temperaturi pretvori v kelvine in primerjaj njuno razmerje.",
              [cel("t_1", t1), cel("t_2", t2)],
              ["\\dfrac{p_2}{p_1}"],
              ["\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}"],
              [`$T_1 = ${KT(t1)}\\ \\mathrm{K},\\ T_2 = ${KT(t2)}\\ \\mathrm{K}$`, `$\\dfrac{p_2}{p_1} = \\dfrac{T_2}{T_1} = \\dfrac{${KT(t2)}}{${KT(t1)}} \\approx ${tx(KT(t2) / KT(t1), 3)}$`, "Tlak se poveča le za nekaj odstotkov, ne 2-krat."],
            );
          }
          const k = r.pick([2, 3, 4]);
          if (s === 1) {
            const T1 = r.int(25, 35) * 10;
            return T(
              `Plin v zaprti posodi s stalno prostornino ima temperaturo $${T1}\\ \\mathrm{K}$. Segrejemo ga na $${k * T1}\\ \\mathrm{K}$. Kaj se zgodi s tlakom?`,
              choice(r, `poveča se ${k}-krat`, [
                ["ostane enak, ker se prostornina ne spremeni", "Pri stalni prostornini je tlak sorazmeren z absolutno temperaturo."],
                [`zmanjša se ${k}-krat`, "Pri segrevanju tlak naraste, ne pade."],
                [`poveča se ${k * k}-krat`, "Tlak je sorazmeren s temperaturo, ne s kvadratom temperature."],
              ]),
              "Pri stalni prostornini je razmerje $p/T$ stalno.",
              [dat("T_1", T1, "K"), dat("T_2", k * T1, "K")],
              ["\\dfrac{p_2}{p_1}"],
              ["\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}"],
              ["Pri stalni prostornini je tlak sorazmeren z absolutno temperaturo.", `$\\dfrac{p_2}{p_1} = \\dfrac{T_2}{T_1} = \\dfrac{${k * T1}}{${T1}} = ${k}$`],
            );
          }
          const V1 = r.int(2, 6) * k * 10;
          return T(
            `${n} v brizgalki z zaprtim izhodom počasi stisne $${V1}\\ \\mathrm{cm^3}$ zraka na $${V1 / k}\\ \\mathrm{cm^3}$; temperatura se ne spremeni. Kaj se zgodi s tlakom zraka?`,
            choice(r, `poveča se ${k}-krat`, [
              [`zmanjša se ${k}-krat`, "Pri stiskanju je v vsakem kubičnem centimetru več molekul, zato pogosteje trkajo ob steno: tlak naraste."],
              ["ostane enak, ker je temperatura stalna", "Stalna temperatura pomeni stalen zmnožek $pV$, ne stalen tlak."],
              [`poveča se ${k * k}-krat`, "Tlak je obratno sorazmeren s prostornino, ne s kvadratom prostornine."],
            ]),
            "Pri stalni temperaturi je zmnožek $pV$ stalen.",
            [dat("V_1", V1, "cm^3"), dat("V_2", V1 / k, "cm^3")],
            ["\\dfrac{p_2}{p_1}"],
            ["p_1 V_1 = p_2 V_2"],
            ["Pri stalni temperaturi velja $p_1 V_1 = p_2 V_2$.", `$\\dfrac{p_2}{p_1} = \\dfrac{V_1}{V_2} = \\dfrac{${V1}}{${V1 / k}} = ${k}$`],
          );
        }
        if (kind === 1) {
          const nn = r.pick([0.2, 0.5, 1, 1.5, 2]);
          const V = r.int(5, 50);
          const Tt = r.int(260, 380);
          const p = Math.round((nn * R_GAS * Tt) / V);
          const Tc = (p * V) / (nn * R_GAS);
          const what = r.pick(["posodi", "jeklenki", "steklenici", "valju z batom"]);
          return T(
            `V ${what} s prostornino $${V}\\ \\mathrm{L}$ je $${qty(tx(nn), "mol")}$ plina pri tlaku $${p}\\ \\mathrm{kPa}$. Kolikšna je temperatura plina v kelvinih? Uporabi $R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$. Zaokroži na celo število.`,
            num(Tc, "K", 0, [M(Tc / 1000, "Tlak pretvori v Pa in prostornino v m³ (ali pretvori obe količini, ne le ene)."), M((p * V) / R_GAS, "Deliti moraš tudi z množino snovi $n$."), M(Tc - 273, "Rezultat je že v kelvinih; 273 ne odštevaj.")]),
            "Iz plinske enačbe izrazi temperaturo. Tlak zapiši v Pa, prostornino v m³.",
            [dat("V", V, "L"), dat("n", tx(nn), "mol"), dat("p", p, "kPa"), K.R],
            ["T"],
            ["p V = n R T", "T = \\dfrac{p V}{n R}"],
            [`$p = ${qty(tx(p * 1000), "Pa")},\\ V = ${qty(tx(V / 1000), "m^3")}$`, `$T = \\dfrac{p V}{n R} = \\dfrac{${tx(p * 1000)} \\cdot ${tx(V / 1000)}}{${tx(nn)} \\cdot 8{,}31}\\ \\mathrm{K} ${res(Tc, 0, "K")}$`],
          );
        }
        const p1 = r.int(8, 20) * 10;
        const V1 = r.int(2, 9);
        const V2 = r.pick([1, 2, 3, 4, 5, 6, 8, 10, 12].filter((x) => x !== V1));
        const T1 = r.int(27, 32) * 10;
        const T2 = T1 + r.pick([-40, -30, -20, -10, 10, 20, 30, 40, 50, 60]);
        const p2 = (p1 * V1 * T2) / (V2 * T1);
        return T(
          `Plin ima tlak $${p1}\\ \\mathrm{kPa}$, prostornino $${V1}\\ \\mathrm{L}$ in temperaturo $${T1}\\ \\mathrm{K}$. Ko mu spremenimo prostornino na $${V2}\\ \\mathrm{L}$ in temperaturo na $${T2}\\ \\mathrm{K}$, kolikšen je njegov tlak? Zaokroži na eno decimalko.`,
          num(p2, "kPa", 1, [M((p1 * V2 * T2) / (V1 * T1), "Tlak je obratno sorazmeren s prostornino: $V_1$ je v števcu."), M((p1 * V1) / V2, "Upoštevaj tudi spremembo temperature."), M((p1 * V1 * T1) / (V2 * T2), "Tlak je premo sorazmeren s temperaturo: $T_2$ je v števcu.")]),
          "Za dano količino plina je $pV/T$ stalen. Izrazi $p_2$.",
          [dat("p_1", p1, "kPa"), dat("V_1", V1, "L"), dat("T_1", T1, "K"), dat("V_2", V2, "L"), dat("T_2", T2, "K")],
          ["p_2"],
          ["\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}", "p_2 = p_1 \\cdot \\dfrac{V_1}{V_2} \\cdot \\dfrac{T_2}{T_1}"],
          [`$p_2 = p_1 \\cdot \\dfrac{V_1}{V_2} \\cdot \\dfrac{T_2}{T_1}$`, `$p_2 = ${p1} \\cdot \\dfrac{${V1}}{${V2}} \\cdot \\dfrac{${T2}}{${T1}}\\ \\mathrm{kPa} ${res(p2, 1, "kPa")}$`],
        );
      }
      if (level === 2) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          // Obratno vprašanje: pri kateri temperaturi tlak doseže mejo.
          const C = r.pick([
            { p: [1.8, 2.6], d: [0.2, 0.6], f: (t, x, y) => `Tlak v pnevmatiki je pri $${t}\\ ^\\circ\\mathrm{C}$ enak $${x}$. Proizvajalec dovoli največ $${y}$.` },
            { p: [1.0, 1.2], d: [0.2, 0.5], f: (t, x, y) => `Zaprta steklenica ima pri $${t}\\ ^\\circ\\mathrm{C}$ v sebi zrak s tlakom $${x}$. Zamašek izskoči, ko tlak doseže $${y}$.` },
            { p: [1.0, 1.3], d: [0.3, 0.8], f: (t, x, y) => `Zaprta pločevinka ima pri $${t}\\ ^\\circ\\mathrm{C}$ v sebi zrak s tlakom $${x}$; zdrži največ $${y}$.` },
          ]);
          const t1 = r.int(5, 25);
          const p1 = r.dec(C.p[0], C.p[1], 1);
          const pm = roundHalfUp(p1 + r.dec(C.d[0], C.d[1], 1), 1);
          const T2 = (KT(t1) * pm) / p1;
          const t2 = T2 - 273;
          const ctx = C.f(t1, qty(tx(p1), "bar"), qty(tx(pm), "bar"));
          return T(
            `${ctx} Pri kateri temperaturi tlak doseže to mejo, če se prostornina ne spremeni? Rezultat zapiši v °C in zaokroži na celo število.`,
            num(t2, "°C", 0, [M((t1 * pm) / p1, "Temperaturo moraš najprej pretvoriti v kelvine."), M(T2, "To je temperatura v kelvinih; pretvori jo v °C."), M((KT(t1) * p1) / pm - 273, "Pri višjem tlaku je temperatura višja: $T_2 = T_1 \\cdot p_2 / p_1$.")]),
            "Pri stalni prostornini je tlak sorazmeren z absolutno temperaturo. Računaj v kelvinih, na koncu pretvori v °C.",
            [cel("t_1", t1), dat("p_1", tx(p1), "bar"), dat("p_2", tx(pm), "bar")],
            ["t_2"],
            ["\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}", "T = t + 273\\ \\mathrm{K}"],
            [`$T_1 = ${KT(t1)}\\ \\mathrm{K}$`, `$T_2 = T_1 \\cdot \\dfrac{p_2}{p_1} = ${KT(t1)} \\cdot \\dfrac{${tx(pm)}}{${tx(p1)}}\\ \\mathrm{K} ${res(T2, 1, "K")}$`, `$t_2 = T_2 - 273 ${eq(t2, 0)} ${tx(t2, 0)}\\ ^\\circ\\mathrm{C}$`],
          );
        }
        if (kind === 1) {
          // Molska masa iz meritve; podatki so izračunani za pravi plin in zaokroženi.
          const G = r.pick([
            { name: "kisik", M: 32 },
            { name: "dušik", M: 28 },
            { name: "ogljikov dioksid", M: 44 },
            { name: "argon", M: 40 },
            { name: "metan", M: 16 },
            { name: "propan", M: 44 },
          ]);
          const V = r.pick([0.5, 1, 1.5, 2, 2.5]);
          const p = r.int(90, 110);
          const t = r.int(15, 30);
          const m = roundHalfUp((p * 1000 * (V / 1000) * G.M) / (R_GAS * KT(t)), 2);
          const Mc = (m * R_GAS * KT(t)) / (p * 1000 * (V / 1000));
          return T(
            `V bučki s prostornino $${qty(tx(V), "L")}$ je $${qty(tx(m), "g")}$ neznanega plina pri tlaku $${p}\\ \\mathrm{kPa}$ in temperaturi $${t}\\ ^\\circ\\mathrm{C}$. Kolikšna je molska masa plina v g/mol? Uporabi $R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$. Zaokroži na celo število.`,
            num(Mc, "g/mol", 0, [M((m * R_GAS * t) / (p * 1000 * (V / 1000)), "Temperaturo pretvori v kelvine."), M((m * R_GAS * KT(t)) / (p * V), "Tlak pretvori v Pa in prostornino v m³."), M((p * 1000 * (V / 1000)) / (R_GAS * KT(t)), "To je množina snovi; molska masa je $M = m / n$.")]),
            "Iz plinske enačbe najprej izračunaj množino snovi, nato $M = m/n$. Enote: Pa, m³, K.",
            [dat("V", tx(V), "L"), dat("m", tx(m), "g"), dat("p", p, "kPa"), cel("t", t), K.R],
            ["M"],
            ["p V = n R T", "M = \\dfrac{m}{n}"],
            [`$p = ${qty(tx(p * 1000), "Pa")},\\ V = ${qty(tx(V / 1000), "m^3")},\\ T = ${KT(t)}\\ \\mathrm{K}$`, `$n = \\dfrac{p V}{R T} = \\dfrac{${tx(p * 1000)} \\cdot ${tx(V / 1000)}}{8{,}31 \\cdot ${KT(t)}}\\ \\mathrm{mol} ${res((p * V) / (R_GAS * KT(t)), 5, "mol")}$`, `$M = \\dfrac{m}{n} ${res(Mc, 0, "g/mol")}$`, roundHalfUp(Mc, 0) === G.M ? `Tako molsko maso ima na primer ${G.name}.` : "Molsko maso primerjamo s tabelo plinov."],
          );
        }
        const V = r.int(5, 50);
        const t = r.int(5, 30);
        const p1 = r.int(100, 200);
        const p2 = p1 - r.int(10, 80);
        const dn = ((p1 - p2) * 1e5 * (V / 1000)) / (R_GAS * KT(t));
        const what = r.pick(["kisikovi jeklenki", "jeklenki za varjenje", "potapljaški jeklenki", "jeklenki z dušikom"]);
        return T(
          `Tlak v ${what} s prostornino $${V}\\ \\mathrm{L}$ je pri stalni temperaturi $${t}\\ ^\\circ\\mathrm{C}$ v enem tednu zaradi puščanja ventila padel s $${p1}\\ \\mathrm{bar}$ na $${p2}\\ \\mathrm{bar}$. Koliko molov plina je ušlo? Uporabi $R = 8{,}31\\ \\mathrm{J/(mol\\,K)}$ in $1\\ \\mathrm{bar} = 10^5\\ \\mathrm{Pa}$. Zaokroži na eno decimalko.`,
          num(dn, "mol", 1, [M(((p1 - p2) * 1e5 * (V / 1000)) / (R_GAS * t), "Temperaturo pretvori v kelvine."), M((p1 * 1e5 * (V / 1000)) / (R_GAS * KT(t)), "To je vsa množina na začetku; ušla je le razlika."), M(((p1 - p2) * (V / 1000)) / (R_GAS * KT(t)), "Tlak pretvori iz barov v pascale.")]),
          "Pri stalni prostornini in temperaturi je množina plina sorazmerna s tlakom. Uporabi razliko tlakov.",
          [dat("V", V, "L"), cel("t", t), dat("p_1", p1, "bar"), dat("p_2", p2, "bar"), K.R],
          ["\\Delta n"],
          ["p V = n R T", "\\Delta n = \\dfrac{(p_1 - p_2) V}{R T}"],
          [`$\\Delta p = ${p1 - p2}\\ \\mathrm{bar} = ${tx((p1 - p2) * 1e5)}\\ \\mathrm{Pa},\\ V = ${qty(tx(V / 1000), "m^3")},\\ T = ${KT(t)}\\ \\mathrm{K}$`, `$\\Delta n = \\dfrac{\\Delta p\\, V}{R T} = \\dfrac{${tx((p1 - p2) * 1e5)} \\cdot ${tx(V / 1000)}}{8{,}31 \\cdot ${KT(t)}}\\ \\mathrm{mol} ${res(dn, 1, "mol")}$`],
        );
      }
      const kind = r.int(0, 2);
      if (kind === 0) {
        // Dve posodi povežemo (stalna temperatura).
        const V1 = r.int(2, 12);
        const V2 = r.int(2, 12);
        const p1 = r.int(15, 40) * 10;
        const p2 = r.int(5, 30) * 10;
        const p = (p1 * V1 + p2 * V2) / (V1 + V2);
        return T(
          `Posoda s prostornino $${V1}\\ \\mathrm{L}$ vsebuje zrak s tlakom $${p1}\\ \\mathrm{kPa}$, druga s prostornino $${V2}\\ \\mathrm{L}$ pa zrak s tlakom $${p2}\\ \\mathrm{kPa}$. Posodi povežemo s tanko cevjo in odpremo ventil. Kolikšen je končni tlak, če se temperatura ne spremeni? Zaokroži na eno decimalko.`,
          num(p, "kPa", 1, [M((p1 + p2) / 2, "Tlaka ne smeš povprečiti; več plina je tam, kjer je večji zmnožek $pV$."), M(p1 + p2, "Tlaka se ne seštejeta, ker se plin razporedi po večji prostornini."), M((p1 * V1 + p2 * V2) / Math.max(V1, V2), "Na koncu plin zapolni obe posodi: deli z vsoto prostornin.")]),
          "Množina plina se ohrani. Pri stalni temperaturi je množina sorazmerna z zmnožkom $pV$.",
          [dat("V_1", V1, "L"), dat("p_1", p1, "kPa"), dat("V_2", V2, "L"), dat("p_2", p2, "kPa")],
          ["p"],
          ["n_1 + n_2 = n", "p_1 V_1 + p_2 V_2 = p\\,(V_1 + V_2)"],
          [`$n = \\dfrac{pV}{RT}$, $RT$ je za vse enak, zato se ohrani vsota $pV$.`, `$p_1 V_1 + p_2 V_2 = ${p1} \\cdot ${V1} + ${p2} \\cdot ${V2} = ${p1 * V1 + p2 * V2}\\ \\mathrm{kPa\\,L}$`, `$p = \\dfrac{${p1 * V1 + p2 * V2}}{${V1} + ${V2}}\\ \\mathrm{kPa} ${res(p, 1, "kPa")}$`],
        );
      }
      if (kind === 1) {
        // Tlačilka: koliko potegov (stalna temperatura, stalna prostornina gume).
        const Vg = r.dec(1.5, 4, 1);
        const p1 = r.dec(1.2, 2, 1);
        const p2 = roundHalfUp(p1 + r.dec(1, 3, 1), 1);
        const Vc = r.int(10, 30) * 10;
        const N = ((p2 - p1) * Vg * 1000) / (1.0 * Vc);
        const Nup = Math.ceil(N - 1e-9);
        return T(
          `${n} napihuje kolo. V notranji gumi s prostornino $${qty(tx(Vg), "L")}$ je zrak s tlakom $${qty(tx(p1), "bar")}$ (absolutni tlak), želi pa $${qty(tx(p2), "bar")}$. Tlačilka ob vsakem potegu potisne v gumo $${Vc}\\ \\mathrm{cm^3}$ zunanjega zraka s tlakom $${qty("1{,}0", "bar")}$. Najmanj koliko potegov potrebuje? Temperatura in prostornina gume sta stalni.`,
          num(Nup, null, 0, [M((p2 * Vg * 1000) / Vc, "V gumi je že zrak s tlakom $p_1$; dodati moraš le razliko."), M(((p2 - p1) * Vg) / Vc, "Prostornino gume pretvori v cm³ (1 L = 1000 cm³)."), M(Math.floor(N), "Z manj potegi tlak ne doseže želenega; zaokroži navzgor.")]),
          "Pri stalni temperaturi je množina zraka sorazmerna z $pV$. Izračunaj, koliko zraka (pri $1{,}0\\ \\mathrm{bar}$) mora priti v gumo, in ga deli s prostornino enega potega.",
          [dat("V_g", tx(Vg), "L"), dat("p_1", tx(p1), "bar"), dat("p_2", tx(p2), "bar"), dat("V_t", Vc, "cm^3"), dat("p_0", "1{,}0", "bar")],
          ["N"],
          ["p_1 V_g + N p_0 V_t = p_2 V_g", "N = \\dfrac{(p_2 - p_1) V_g}{p_0 V_t}"],
          [`$V_g = ${tx(Vg * 1000)}\\ \\mathrm{cm^3}$`, `$N = \\dfrac{(${tx(p2)} - ${tx(p1)}) \\cdot ${tx(Vg * 1000)}}{1{,}0 \\cdot ${Vc}} ${eq(N, 6)} ${tx(N, 2)}$`, `Potegov je celo število, zato zaokrožimo navzgor: $N = ${Nup}$.`],
        );
      }
      // Kolikšen delež plina so porabili (spremenita se tlak in temperatura).
      const t1 = r.int(15, 30);
      const t2 = r.int(-10, 10);
      const p1 = r.int(120, 200);
      const p2 = r.int(20, 90);
      const frac = 1 - (p2 * KT(t1)) / (p1 * KT(t2));
      const pct = frac * 100;
      return T(
        `${r.pick(["Kisikova jeklenka za varjenje", "Jeklenka z dušikom", "Jeklenka s stisnjenim zrakom"])} ima v toploti delavnice ($${t1}\\ ^\\circ\\mathrm{C}$) tlak $${p1}\\ \\mathrm{bar}$. Po nekaj dneh dela na mrzlem gradbišču ($${t2}\\ ^\\circ\\mathrm{C}$) kaže manometer $${p2}\\ \\mathrm{bar}$. Koliko odstotkov plina so porabili? Plin obravnavaj kot idealni plin. Zaokroži na eno decimalko.`,
        num(pct, "%", 1, [M((1 - p2 / p1) * 100, "Upoštevaj tudi, da se je jeklenka ohladila."), M((1 - (p2 * KT(t2)) / (p1 * KT(t1))) * 100, "Množina je sorazmerna s $p/T$: temperatura je v imenovalcu."), M(((p2 * KT(t1)) / (p1 * KT(t2))) * 100, "To je delež plina, ki je ostal; porabljen je preostanek do 100 %.")], { unitAlternatives: ["odstotkov", "procentov"] }),
        "Prostornina jeklenke je stalna, zato je množina plina sorazmerna s $p/T$. Izračunaj razmerje $n_2/n_1$.",
        [cel("t_1", t1), dat("p_1", p1, "bar"), cel("t_2", t2), dat("p_2", p2, "bar")],
        ["\\text{delež porabljenega plina}"],
        ["n = \\dfrac{p V}{R T}", "\\dfrac{n_2}{n_1} = \\dfrac{p_2 T_1}{p_1 T_2}"],
        [`$T_1 = ${KT(t1)}\\ \\mathrm{K},\\ T_2 = ${KT(t2)}\\ \\mathrm{K}$`, `$\\dfrac{n_2}{n_1} = \\dfrac{${p2} \\cdot ${KT(t1)}}{${p1} \\cdot ${KT(t2)}} ${eq(1 - frac, 4)} ${tx(1 - frac, 4)}$`, `Porabili so $1 - ${tx(1 - frac, 4)}$ plina, to je $${tx(pct, 1)}\\ \\%$.`],
      );
    },
  },
  // ---------------- Električna vezja: Kirchhoffova zakona, mešana vezava, moč ----------------
  {
    id: "gim-vezja-dop",
    topics: ["FIZ-SS-2/elektricna-vezja"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.int(0, 3);
        if (kind === 0) {
          const I1 = r.dec(0.5, 3, 1);
          const I2 = r.dec(0.5, 3, 1);
          const I3 = r.dec(0.2, Math.max(0.3, I1 + I2 - 0.3), 1);
          const I4 = roundHalfUp(I1 + I2 - I3, 1);
          return T(
            `V vozlišče vezja pritečeta tokova $${qty(tx(I1), "A")}$ in $${qty(tx(I2), "A")}$. Iz vozlišča odtekata dva tokova; eden je $${qty(tx(I3), "A")}$. Kolikšen je drugi? Zaokroži na eno decimalko.`,
            num(I4, "A", 1, [M(I1 + I2 + I3, "Tok, ki odteka, ne prišteješ k pritekajočim; vsota pritekajočih je enaka vsoti odtekajočih."), M(I1 + I2, "Del toka že odteče po prvi veji."), M(Math.abs(I1 - I2) + I3, "Vsota tokov, ki pritečejo, je enaka vsoti tokov, ki odtečejo.")]),
            "Naboj se v vozlišču ne nabira (1. Kirchhoffov zakon).",
            [dat("I_1", tx(I1), "A"), dat("I_2", tx(I2), "A"), dat("I_3", tx(I3), "A")],
            ["I_4"],
            ["I_1 + I_2 = I_3 + I_4"],
            [`$I_1 + I_2 = I_3 + I_4$`, `$I_4 = I_1 + I_2 - I_3 = ${tx(I1)} + ${tx(I2)} - ${tx(I3)}\\ \\mathrm{A} = ${qty(tx(I4, 1), "A")}$`],
          );
        }
        if (kind === 1) {
          const U = r.pick([9, 12, 24, 36]);
          const U1 = r.dec(1, U / 3, 1);
          const U2 = r.dec(1, U / 3, 1);
          const U3 = roundHalfUp(U - U1 - U2, 1);
          return T(
            `Trije uporniki so zaporedno vezani na vir z napetostjo $${U}\\ \\mathrm{V}$. Na prvem je napetost $${qty(tx(U1), "V")}$, na drugem $${qty(tx(U2), "V")}$. Kolikšna je napetost na tretjem? Zaokroži na eno decimalko.`,
            num(U3, "V", 1, [M(U1 + U2, "To je napetost na prvih dveh; na tretjem je preostanek do napetosti vira."), M(U, "Pri zaporedni vezavi si porabniki napetost vira razdelijo."), M(U + U1 + U2, "Napetosti porabnikov se seštejejo v napetost vira, ne prištejejo k njej.")]),
            "Pri zaporedni vezavi je vsota napetosti na porabnikih enaka napetosti vira (2. Kirchhoffov zakon).",
            [dat("U", U, "V"), dat("U_1", tx(U1), "V"), dat("U_2", tx(U2), "V")],
            ["U_3"],
            ["U = U_1 + U_2 + U_3"],
            [`$U = U_1 + U_2 + U_3$`, `$U_3 = U - U_1 - U_2 = ${U} - ${tx(U1)} - ${tx(U2)}\\ \\mathrm{V} = ${qty(tx(U3, 1), "V")}$`],
          );
        }
        if (kind === 2) {
          const D = r.pick([
            { what: "Grelnik vode", P: [1500, 3000] },
            { what: "Sušilnik za lase", P: [1200, 2200] },
            { what: "Mikrovalovna pečica", P: [700, 1200] },
            { what: "Sesalnik", P: [600, 1600] },
            { what: "Likalnik", P: [1800, 2600] },
          ]);
          const P = r.int(D.P[0] / 50, D.P[1] / 50) * 50;
          const I = P / 230;
          return T(
            `${D.what} ima pri omrežni napetosti $230\\ \\mathrm{V}$ moč $${P}\\ \\mathrm{W}$. Kolikšen tok teče skozi napravo? Zaokroži na dve decimalki.`,
            num(I, "A", 2, [M(P * 230, "Moč je zmnožek napetosti in toka; tok dobiš z deljenjem."), M(230 / P, "Moč deli z napetostjo, ne obratno.")]),
            "Moč je zmnožek napetosti in toka.",
            [dat("U", 230, "V"), dat("P", P, "W")],
            ["I"],
            ["P = U I", "I = \\dfrac{P}{U}"],
            [`$I = \\dfrac{P}{U} = \\dfrac{${P}}{230}\\ \\mathrm{A} ${res(I, 2, "A")}$`, "Preverimo: $U I$ je spet enako moči naprave."],
          );
        }
        const ps = r.shuffle([25, 40, 60, 75, 100]).slice(0, 2).sort((a, b) => a - b);
        const series = r.next() < 0.5;
        const lo = `žarnica z oznako ${ps[0]} W`;
        const hi = `žarnica z oznako ${ps[1]} W`;
        return T(
          `Žarnici z oznakama $${ps[0]}\\ \\mathrm{W}$ in $${ps[1]}\\ \\mathrm{W}$ (obe za $230\\ \\mathrm{V}$) vežemo ${series ? "zaporedno" : "vzporedno"} na napetost $230\\ \\mathrm{V}$. Katera sveti močneje? Upor žarnic naj bo stalen.`,
          choice(r, series ? lo : hi, series
            ? [
                [hi, "Pri zaporedni vezavi teče skozi obe enak tok; večjo moč $P = I^2 R$ ima tista z večjim uporom, to je šibkejša žarnica."],
                ["obe enako, ker teče skozi obe enak tok", "Enak tok, a različna upora: moč $I^2 R$ je večja pri večjem uporu."],
                ["nobena ne sveti, ker sta vezani zaporedno", "Pri zaporedni vezavi tok teče skozi obe žarnici, le manjši je."],
              ]
            : [
                [lo, "Pri vzporedni vezavi ima vsaka polno napetost $230\\ \\mathrm{V}$, zato dela z nazivno močjo."],
                ["obe enako, ker imata enako napetost", "Napetost je enaka, a upora sta različna: moč $U^2/R$ je večja pri manjšem uporu."],
                ["nobena, ker se tok razdeli na pol", "Tok se razdeli glede na upora, a vsaka žarnica ima polno napetost in sveti normalno."],
              ]),
          series ? "Izračunaj upor vsake žarnice iz nazivnih podatkov; pri zaporedni vezavi je tok skozi obe enak." : "Pri vzporedni vezavi ima vsaka žarnica napetost vira.",
          [dat("P_1", ps[0], "W"), dat("P_2", ps[1], "W"), dat("U", 230, "V")],
          ["\\text{svetlejša žarnica}"],
          series ? ["R = \\dfrac{U^2}{P}", "P = I^2 R"] : ["P = \\dfrac{U^2}{R}"],
          series
            ? [`$R_1 = \\dfrac{230^2}{${ps[0]}}\\ \\Omega ${res(52900 / ps[0], 0, "\\Omega")},\\ R_2 = \\dfrac{230^2}{${ps[1]}}\\ \\Omega ${res(52900 / ps[1], 0, "\\Omega")}$`, "Pri zaporedni vezavi je tok skozi obe enak, zato je večja moč $P = I^2 R$ pri večjem uporu.", `Močneje sveti žarnica z oznako $${ps[0]}\\ \\mathrm{W}$.`]
            : ["Pri vzporedni vezavi ima vsaka žarnica napetost $230\\ \\mathrm{V}$, za katero je narejena.", "Vsaka zato dela s svojo nazivno močjo.", `Močneje sveti žarnica z oznako $${ps[1]}\\ \\mathrm{W}$.`],
        );
      }
      if (level === 2) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const R1 = r.int(2, 20) * 5;
          const R2 = r.int(2, 12) * 10;
          const R3 = r.int(2, 12) * 10;
          const U = r.pick([6, 9, 12, 24]);
          const R23 = (R2 * R3) / (R2 + R3);
          const Rn = R1 + R23;
          const I = U / Rn;
          return T(
            `Upornik $R_1 = ${R1}\\ \\Omega$ je zaporedno vezan z vzporedno vezanima upornikoma $R_2 = ${R2}\\ \\Omega$ in $R_3 = ${R3}\\ \\Omega$. Vezje priključimo na napetost $${U}\\ \\mathrm{V}$. Kolikšen tok teče iz vira? Rezultat v A zaokroži na tri decimalke.`,
            num(I, "A", 3, [M(U / (R1 + R2 + R3), "R₂ in R₃ sta vezana vzporedno; njun nadomestni upor je manjši od vsakega."), M(U / R23, "Upoštevaj tudi zaporedno vezani R₁."), M(U / (R1 + (R2 + R3) / 2), "Nadomestni upor vzporedne vezave ni povprečje uporov.")]),
            "Najprej nadomesti vzporedni del z enim upornikom, nato prištej zaporedni upor.",
            [dat("R_1", R1, "\\Omega"), dat("R_2", R2, "\\Omega"), dat("R_3", R3, "\\Omega"), dat("U", U, "V")],
            ["I"],
            ["R_{23} = \\dfrac{R_2 R_3}{R_2 + R_3}", "R = R_1 + R_{23}", "I = \\dfrac{U}{R}"],
            [`$R_{23} = \\dfrac{${R2} \\cdot ${R3}}{${R2} + ${R3}}\\ \\Omega ${res(R23, 2, "\\Omega")}$`, `$R = R_1 + R_{23} ${res(Rn, 2, "\\Omega")}$`, `$I = \\dfrac{U}{R} = \\dfrac{${U}}{${tx(Rn, 2)}}\\ \\mathrm{A} ${res(I, 3, "A")}$`],
          );
        }
        if (kind === 1) {
          const imax = r.pick([10, 16]);
          const Pmax = 230 * imax;
          const D = [["pralni stroj", 1800, 2200], ["hladilnik", 100, 200], ["televizor", 80, 150], ["grelnik vode", 1500, 2000], ["mikrovalovna pečica", 700, 1000], ["računalnik", 200, 400], ["likalnik", 1600, 2200]];
          let Pk;
          do {
            Pk = r.shuffle(D).slice(0, 2).map(([w, lo, hi]) => [w, r.int(lo / 10, hi / 10) * 10]);
          } while (Pk[0][1] + Pk[1][1] > Pmax - 200);
          const S = Pk[0][1] + Pk[1][1];
          const Pextra = Pmax - S;
          return T(
            `${n} ima v stanovanju tokokrog z varovalko za $${imax}\\ \\mathrm{A}$ pri napetosti $230\\ \\mathrm{V}$. Vzporedno sta priključena ${Pk[0][0]} ($${Pk[0][1]}\\ \\mathrm{W}$) in ${Pk[1][0]} ($${Pk[1][1]}\\ \\mathrm{W}$). Koliko moči v W lahko še priključimo, da varovalka ne izklopi?`,
            num(Pextra, "W", 0, [M(Pmax, "To je največja skupna moč; odštej že priključene naprave."), M(imax - S / 230, "To je še razpoložljivi tok v A; pomnoži ga z napetostjo.")]),
            "Vsi porabniki so vzporedno, zato se njihovi tokovi (in moči) seštejejo. Izračunaj največjo moč, ki jo varovalka dopušča.",
            [dat("I_{max}", imax, "A"), dat("U", 230, "V"), dat("P_1", Pk[0][1], "W"), dat("P_2", Pk[1][1], "W")],
            ["P_3"],
            ["P = U I", "P_{max} = P_1 + P_2 + P_3"],
            [`$P_{max} = U I_{max} = 230 \\cdot ${imax}\\ \\mathrm{W} = ${Pmax}\\ \\mathrm{W}$`, `$P_1 + P_2 = ${Pk[0][1]} + ${Pk[1][1]}\\ \\mathrm{W} = ${S}\\ \\mathrm{W}$`, `$P_3 = ${Pmax} - ${S}\\ \\mathrm{W} = ${Pextra}\\ \\mathrm{W}$`],
          );
        }
        const R1 = r.int(1, 30) * 10;
        const R2 = r.int(1, 30) * 10;
        const U = r.pick([4.5, 9, 12, 24]);
        const U2 = (U * R2) / (R1 + R2);
        return T(
          `Upornika $R_1 = ${R1}\\ \\Omega$ in $R_2 = ${R2}\\ \\Omega$ sta zaporedno vezana na baterijo z napetostjo $${qty(tx(U), "V")}$ (delilnik napetosti). Kolikšna je napetost na uporniku $R_2$? Zaokroži na dve decimalki.`,
          num(U2, "V", 2, [M((U * R1) / (R1 + R2), "To je napetost na R₁; na R₂ je napetost sorazmerna z R₂."), M(U / 2, "Napetost se razdeli v razmerju uporov, ne na pol."), M((U * R2) / R1, "Tok je določen s skupnim uporom $R_1 + R_2$.")]),
          "Najprej izračunaj tok skozi oba upornika, nato napetost na $R_2$.",
          [dat("R_1", R1, "\\Omega"), dat("R_2", R2, "\\Omega"), dat("U", tx(U), "V")],
          ["U_2"],
          ["I = \\dfrac{U}{R_1 + R_2}", "U_2 = I R_2"],
          [`$I = \\dfrac{${tx(U)}}{${R1} + ${R2}}\\ \\mathrm{A} ${res(U / (R1 + R2), 4, "A")}$`, `$U_2 = I R_2 = \\dfrac{${tx(U)} \\cdot ${R2}}{${R1 + R2}}\\ \\mathrm{V} ${res(U2, 2, "V")}$`],
        );
      }
      const kind = r.int(0, 2);
      if (kind === 0) {
        const R1 = r.int(2, 10) * 5;
        const R2 = r.int(2, 12) * 10;
        const R3 = r.int(2, 12) * 10;
        const U = r.pick([12, 24, 36, 48]);
        const R23 = (R2 * R3) / (R2 + R3);
        const I = U / (R1 + R23);
        const U23 = I * R23;
        const askP = r.next() < 0.5;
        const I3 = U23 / R3;
        const P2 = (U23 * U23) / R2;
        return T(
          `Upornik $R_1 = ${R1}\\ \\Omega$ je zaporedno vezan z vzporedno vezanima upornikoma $R_2 = ${R2}\\ \\Omega$ in $R_3 = ${R3}\\ \\Omega$; vezje je priključeno na $${U}\\ \\mathrm{V}$. ${askP ? "Kolikšna moč se troši na uporniku $R_2$? Rezultat v W" : "Kolikšen tok teče skozi upornik $R_3$? Rezultat v A"} zaokroži na tri decimalke.`,
          askP
            ? num(P2, "W", 3, [M((U * U) / R2, "Na R₂ ni vsa napetost vira; del je pade na R₁."), M(I * I * R2, "Skozi R₂ teče le del celotnega toka."), M(U23 * I, "To je moč na celotnem vzporednem delu, ne le na R₂.")])
            : num(I3, "A", 3, [M(U / R3, "Na R₃ ni vsa napetost vira; del je pade na R₁."), M(I, "To je celoten tok; v vozlišču se razdeli na R₂ in R₃."), M(I / 2, "Tok se ne razdeli na pol, temveč obratno sorazmerno z uporoma.")]),
          "Izračunaj nadomestni upor in skupni tok, nato napetost na vzporednem delu (2. Kirchhoffov zakon).",
          [dat("R_1", R1, "\\Omega"), dat("R_2", R2, "\\Omega"), dat("R_3", R3, "\\Omega"), dat("U", U, "V")],
          [askP ? "P_2" : "I_3"],
          ["R = R_1 + \\dfrac{R_2 R_3}{R_2 + R_3}", "U_{23} = U - I R_1", askP ? "P_2 = \\dfrac{U_{23}^2}{R_2}" : "I_3 = \\dfrac{U_{23}}{R_3}"],
          [
            `$R_{23} = \\dfrac{${R2} \\cdot ${R3}}{${R2} + ${R3}}\\ \\Omega ${res(R23, 3, "\\Omega")}$, $R = ${R1} + ${tx(R23, 3)}\\ \\Omega ${res(R1 + R23, 3, "\\Omega")}$`,
            `$I = \\dfrac{U}{R} = \\dfrac{${U}}{${tx(R1 + R23, 3)}}\\ \\mathrm{A} ${res(I, 4, "A")}$`,
            `$U_{23} = U - I R_1 = ${U} - ${tx(I, 4)} \\cdot ${R1}\\ \\mathrm{V} ${res(U23, 3, "V")}$`,
            askP ? `$P_2 = \\dfrac{U_{23}^2}{R_2} = \\dfrac{(${tx(U23, 3)})^2}{${R2}}\\ \\mathrm{W} ${res(P2, 3, "W")}$` : `$I_3 = \\dfrac{U_{23}}{R_3} = \\dfrac{${tx(U23, 3)}}{${R3}}\\ \\mathrm{A} ${res(I3, 3, "A")}$`,
          ],
        );
      }
      if (kind === 1) {
        // Obratno vprašanje: kateri upor vežemo vzporedno, da iz vira teče želeni tok.
        const [R, Rx] = r.pick([[12, 6], [20, 30], [30, 60], [60, 40], [24, 12], [10, 40], [18, 9], [15, 10], [36, 12], [100, 150], [45, 90], [40, 60], [12, 24], [30, 20]]);
        const Rn = (R * Rx) / (R + Rx);
        const I = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
        const U = Rn * I;
        const what = r.pick(["Grelna žica", "Upornik", "Grelna plošča"]);
        return T(
          `${what} z uporom $${R}\\ \\Omega$ je priključen${what === "Grelna žica" || what === "Grelna plošča" ? "a" : ""} na napetost $${tx(U)}\\ \\mathrm{V}$. Kolikšen upor moramo vezati vzporedno, da bo iz vira tekel tok $${qty(tx(I), "A")}$? Rezultat v Ω zaokroži na celo število.`,
          num(Rx, "Ω", 0, [M(Rn, "To je nadomestni upor vezja; iskani upornik je drugi del vzporedne vezave."), M(R - Rn, "Pri vzporedni vezavi se ne seštevajo upori, ampak njihove obratne vrednosti."), M((R * Rn) / (R + Rn), "Iz $\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_x}$ sledi $\\frac{1}{R_x} = \\frac{1}{R} - \\frac{1}{R_1}$: odštej, ne seštej.")]),
          "Iz napetosti in želenega toka izračunaj nadomestni upor, nato iz zveze za vzporedno vezavo izrazi neznani upor. Lahko pa računaš s tokovi po vejah.",
          [dat("R_1", R, "\\Omega"), dat("U", tx(U), "V"), dat("I", tx(I), "A")],
          ["R_x"],
          ["R = \\dfrac{U}{I}", "\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_x}"],
          [`$R = \\dfrac{U}{I} = \\dfrac{${tx(U)}}{${tx(I)}}\\ \\Omega = ${qty(tx(Rn), "\\Omega")}$`, `$I_1 = \\dfrac{U}{R_1} = \\dfrac{${tx(U)}}{${R}}\\ \\mathrm{A} ${res(U / R, 3, "A")}$, zato skozi $R_x$ teče $I_x = I - I_1 ${res(I - U / R, 3, "A")}$`, `$R_x = \\dfrac{R_1 R}{R_1 - R} = \\dfrac{${R} \\cdot ${tx(Rn)}}{${R} - ${tx(Rn)}}\\ \\Omega = ${qty(tx(Rx), "\\Omega")}$`],
        );
      }
      // Dve žarnici zaporedno: dejanska moč ene.
      const ps = r.shuffle([25, 40, 60, 75, 100]).slice(0, 2);
      const [Pa, Pb] = ps;
      const Ra = 52900 / Pa;
      const Rb = 52900 / Pb;
      const I = 230 / (Ra + Rb);
      const P = I * I * Ra;
      return T(
        `Žarnici z oznakama $${Pa}\\ \\mathrm{W}$ in $${Pb}\\ \\mathrm{W}$ (obe za $230\\ \\mathrm{V}$) vežemo zaporedno na napetost $230\\ \\mathrm{V}$. Kolikšna je moč žarnice z oznako $${Pa}\\ \\mathrm{W}$? Upor žarnic naj bo stalen. Zaokroži na eno decimalko.`,
        num(P, "W", 1, [M(Pa, "Nazivno moč ima žarnica le pri polni napetosti 230 V; tu si napetost deli z drugo."), M((Pa * Pb) / (Pa + Pb), "To je skupna moč obeh žarnic, ne moč ene."), M(I * I * Rb, "To je moč druge žarnice.")]),
        "Iz nazivnih podatkov izračunaj upor vsake žarnice, nato tok pri zaporedni vezavi in moč $I^2 R$.",
        [dat("P_1", Pa, "W"), dat("P_2", Pb, "W"), dat("U", 230, "V")],
        ["P_1'"],
        ["R = \\dfrac{U^2}{P}", "I = \\dfrac{U}{R_1 + R_2}", "P = I^2 R"],
        [`$R_1 = \\dfrac{230^2}{${Pa}}\\ \\Omega ${res(Ra, 1, "\\Omega")},\\ R_2 = \\dfrac{230^2}{${Pb}}\\ \\Omega ${res(Rb, 1, "\\Omega")}$`, `$I = \\dfrac{230}{${tx(Ra, 1)} + ${tx(Rb, 1)}}\\ \\mathrm{A} ${res(I, 4, "A")}$`, `$P_1' = I^2 R_1 = (${tx(I, 4)})^2 \\cdot ${tx(Ra, 1)}\\ \\mathrm{W} ${res(P, 1, "W")}$`],
      );
    },
  },
  // ---------------- Nihanje: frekvenca, energija, merjenje g, ura z nihalom ----------------
  {
    id: "gim-nihanje-dop",
    topics: ["FIZ-SS-3/nihanje"],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const N = r.pick([10, 15, 20, 25, 30, 40, 50]);
          const t = r.dec(N * 0.4, N * 2, 1);
          const askNu = r.next() < 0.5;
          const what = r.pick(["Utež na vzmeti", "Nihalo", "Gugalnica", "Metronom"]);
          if (askNu) {
            const nu = N / t;
            return T(
              `${what} naredi $${N}$ nihajev v $${qty(tx(t), "s")}$. Kolikšna je frekvenca nihanja? Zaokroži na dve decimalki.`,
              num(nu, "Hz", 2, [M(t / N, "To je nihajni čas; frekvenca je njegova obratna vrednost."), M(N * t, "Frekvenca je število nihajev na sekundo: deli, ne množi.")], { unitAlternatives: ["s^-1", "1/s", "/s"] }),
              "Frekvenca pove, koliko nihajev se zgodi v eni sekundi.",
              [`N = ${N}`, dat("t", tx(t), "s")],
              ["\\nu"],
              ["\\nu = \\dfrac{N}{t}"],
              [`$\\nu = \\dfrac{N}{t} = \\dfrac{${N}}{${tx(t)}\\ \\mathrm{s}} ${res(nu, 2, "Hz")}$`, `Preverimo: $t_0 = \\dfrac{1}{\\nu} ${res(t / N, 3, "s")}$ na nihaj.`],
            );
          }
          const t0 = t / N;
          return T(
            `${what} naredi $${N}$ nihajev v $${qty(tx(t), "s")}$. Kolikšen je nihajni čas? Zaokroži na tri decimalke.`,
            num(t0, "s", 3, [M(N / t, "To je frekvenca; nihajni čas je čas enega nihaja."), M(t / (2 * N), "Nihaj je celo gibanje tja in nazaj; ne deli še z 2.")]),
            "Nihajni čas je čas enega celega nihaja.",
            [`N = ${N}`, dat("t", tx(t), "s")],
            ["t_0"],
            ["t_0 = \\dfrac{t}{N}"],
            [`$t_0 = \\dfrac{t}{N} = \\dfrac{${tx(t)}\\ \\mathrm{s}}{${N}} ${res(t0, 3, "s")}$`, `Frekvenca je $\\nu = \\dfrac{1}{t_0} ${res(N / t, 2, "Hz")}$.`],
          );
        }
        if (kind === 1) {
          const k = r.int(4, 40) * 10;
          const x0 = r.int(2, 12) / 100;
          const W = 0.5 * k * x0 * x0;
          return T(
            `Utež na vzmeti s koeficientom $${k}\\ \\mathrm{N/m}$ niha z amplitudo $${qty(tx(x0), "m")}$. Kolikšna je energija nihanja? Zaokroži na tri decimalke.`,
            num(W, "J", 3, [M(k * x0 * x0, "Prožnostna energija ima faktor ½."), M(0.5 * k * x0, "Amplitudo je treba kvadrirati.")]),
            "V skrajni legi utež miruje, vsa energija nihanja je prožnostna.",
            [dat("k", k, "N/m"), dat("x_0", tx(x0), "m")],
            ["W"],
            ["W = \\dfrac{1}{2} k x_0^2"],
            [`$x_0^2 = (${tx(x0)})^2\\ \\mathrm{m^2} = ${qty(tx(x0 * x0, 4), "m^2")}$`, `$W = \\dfrac{1}{2} \\cdot ${k} \\cdot ${tx(x0 * x0, 4)}\\ \\mathrm{J} ${res(W, 3, "J")}$`],
          );
        }
        const S = r.pick([
          { what: "dolžino matematičnega nihala", sym: "l", f: 4, ans: "poveča se 2-krat", wrong: [["poveča se 4-krat", "Dolžina je pod korenom: 4-krat daljša vrvica da 2-krat daljši nihajni čas."], ["se ne spremeni", "Nihajni čas matematičnega nihala je odvisen od dolžine."], ["zmanjša se 2-krat", "Daljše nihalo niha počasneje, ne hitreje."]] },
          { what: "dolžino matematičnega nihala", sym: "l", f: 9, ans: "poveča se 3-krat", wrong: [["poveča se 9-krat", "Dolžina je pod korenom: 9-krat daljša vrvica da 3-krat daljši nihajni čas."], ["se ne spremeni", "Nihajni čas matematičnega nihala je odvisen od dolžine."], ["zmanjša se 3-krat", "Daljše nihalo niha počasneje, ne hitreje."]] },
          { what: "maso uteži na matematičnem nihalu", sym: "m", f: 4, ans: "se ne spremeni", wrong: [["poveča se 2-krat", "Pri matematičnem nihalu se masa pokrajša: nihajni čas je odvisen le od $l$ in $g$."], ["poveča se 4-krat", "Masa v formuli za matematično nihalo ne nastopa."], ["zmanjša se 2-krat", "Težja utež ne niha hitreje; masa v formuli ne nastopa."]] },
          { what: "maso uteži na vzmeti", sym: "m", f: 4, ans: "poveča se 2-krat", wrong: [["se ne spremeni", "Pri nihalu na vzmeti je masa v formuli: $t_0 = 2\\pi\\sqrt{m/k}$."], ["poveča se 4-krat", "Masa je pod korenom: 4-krat večja masa da 2-krat daljši nihajni čas."], ["zmanjša se 2-krat", "Težja utež niha počasneje, ne hitreje."]] },
          { what: "koeficient vzmeti (trša vzmet, ista utež)", sym: "k", f: 4, ans: "zmanjša se 2-krat", wrong: [["poveča se 2-krat", "Koeficient vzmeti je v imenovalcu: trša vzmet niha hitreje."], ["zmanjša se 4-krat", "Koeficient je pod korenom: učinek je 2-kraten, ne 4-kraten."], ["se ne spremeni", "Nihajni čas nihala na vzmeti je odvisen od koeficienta vzmeti."]] },
          { what: "amplitudo nihala na vzmeti", sym: "x_0", f: 2, ans: "se ne spremeni", wrong: [["poveča se 2-krat", "Pri večjem odmiku je večja tudi sila, zato utež daljšo pot prepotuje hitreje: nihajni čas je enak."], ["poveča se za faktor 1,41", "Amplitude v formuli za nihajni čas ni."], ["zmanjša se 2-krat", "Amplituda ne vpliva na nihajni čas harmoničnega nihanja."]] },
          { what: "amplitudo matematičnega nihala (še vedno majhen odmik)", sym: "x_0", f: 3, ans: "se ne spremeni", wrong: [["poveča se 3-krat", "Pri majhnih odmikih je nihajni čas od amplitude neodvisen."], ["poveča se za faktor 1,73", "Amplitude v formuli $t_0 = 2\\pi\\sqrt{l/g}$ ni."], ["zmanjša se 3-krat", "Amplituda ne vpliva na nihajni čas pri majhnih odmikih."]] },
        ]);
        const t1 = r.dec(0.5, 2.5, 2);
        return T(
          `Nihalo ima nihajni čas $${qty(tx(t1), "s")}$. Kaj se zgodi z nihajnim časom, če ${S.what} ($${S.sym}$) povečamo ${S.f}-krat, vse drugo pa ostane enako?`,
          choice(r, S.ans, S.wrong),
          "Zapiši formulo za nihajni čas tega nihala in poglej, ali in kako (pod korenom?) v njej nastopa spremenjena količina.",
          [dat("t_0", tx(t1), "s"), `${S.sym}' = ${S.f} \\cdot ${S.sym}`],
          ["t_0'"],
          ["t_0 = 2\\pi\\sqrt{\\dfrac{l}{g}}", "t_0 = 2\\pi\\sqrt{\\dfrac{m}{k}}"],
          ["Matematično nihalo: $t_0 = 2\\pi\\sqrt{l/g}$ (brez mase in amplitude).", "Nihalo na vzmeti: $t_0 = 2\\pi\\sqrt{m/k}$ (brez amplitude).", `Torej: ${S.ans}.`],
        );
      }
      if (level === 2) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const t0 = r.dec(0.4, 2.5, 2);
          const x0 = r.int(2, 15);
          const om = (2 * Math.PI) / t0;
          const askA = r.next() < 0.5;
          const v0 = om * (x0 / 100);
          const a0 = om * om * (x0 / 100);
          const what = r.pick(["Utež na vzmeti", "Karoserija avtomobila na vzmeteh", "Plovec na vodi"]);
          return T(
            `${what} harmonično niha z nihajnim časom $${qty(tx(t0), "s")}$ in amplitudo $${x0}\\ \\mathrm{cm}$. Kolikšna je ${askA ? "največja velikost pospeška" : "največja hitrost"}? Zaokroži na dve decimalki.`,
            askA
              ? num(a0, "m/s²", 2, [M(om * om * x0, "Amplitudo pretvori v metre."), M(om * (x0 / 100), "To je največja hitrost; pospešek je $\\omega^2 x_0$."), M(((2 * Math.PI) / (t0 * t0)) * (x0 / 100), "Kvadrirati moraš ves $\\omega = 2\\pi / t_0$, tudi $2\\pi$.")])
              : num(v0, "m/s", 2, [M(om * x0, "Amplitudo pretvori v metre."), M((x0 / 100) / t0, "Pozabil si na $2\\pi$: $\\omega = 2\\pi / t_0$."), M(om * om * (x0 / 100), "To je največji pospešek; hitrost je $\\omega x_0$.")]),
            "Iz nihajnega časa izračunaj krožno frekvenco $\\omega$, amplitudo zapiši v metrih.",
            [dat("t_0", tx(t0), "s"), dat("x_0", x0, "cm")],
            [askA ? "a_0" : "v_0"],
            ["\\omega = \\dfrac{2\\pi}{t_0}", askA ? "a_0 = \\omega^2 x_0" : "v_0 = \\omega x_0"],
            [`$\\omega = \\dfrac{2\\pi}{${tx(t0)}\\ \\mathrm{s}} ${res(om, 3, "s^{-1}")}$, $x_0 = ${qty(tx(x0 / 100), "m")}$`, askA ? `$a_0 = \\omega^2 x_0 = (${tx(om, 3)})^2 \\cdot ${tx(x0 / 100)}\\ \\mathrm{m/s^2} ${res(a0, 2, "m/s^2")}$` : `$v_0 = \\omega x_0 = ${tx(om, 3)} \\cdot ${tx(x0 / 100)}\\ \\mathrm{m/s} ${res(v0, 2, "m/s")}$`],
          );
        }
        if (kind === 1) {
          const k = r.int(5, 60) * 5;
          const nu = r.dec(1, 4, 1);
          const m = (k / (4 * Math.PI * Math.PI * nu * nu)) * 1000;
          return T(
            `${n} ima vzmet s koeficientom $${k}\\ \\mathrm{N/m}$. Kolikšno maso mora obesiti nanjo, da bo utež nihala s frekvenco $${qty(tx(nu), "Hz")}$? Rezultat zapiši v gramih in zaokroži na celo število.`,
            num(m, "g", 0, [M(m / 1000, "Rezultat pretvori v grame."), M((k / (4 * Math.PI * Math.PI * nu)) * 1000, "Frekvenco moraš kvadrirati."), M((k / (2 * Math.PI * nu * nu)) * 1000, "Ko kvadriraš $2\\pi$, dobiš $4\\pi^2$.")]),
            "Iz frekvence dobiš nihajni čas $t_0 = 1/\\nu$. Formulo za nihajni čas kvadriraj in izrazi maso.",
            [dat("k", k, "N/m"), dat("\\nu", tx(nu), "Hz")],
            ["m"],
            ["t_0 = 2\\pi\\sqrt{\\dfrac{m}{k}} = \\dfrac{1}{\\nu}", "m = \\dfrac{k}{4\\pi^2 \\nu^2}"],
            [`$\\dfrac{1}{\\nu^2} = 4\\pi^2 \\dfrac{m}{k} \\Rightarrow m = \\dfrac{k}{4\\pi^2 \\nu^2}$`, `$m = \\dfrac{${k}}{4\\pi^2 \\cdot (${tx(nu)})^2}\\ \\mathrm{kg} ${res(m / 1000, 4, "kg")}$`, `$m ${res(m, 0, "g")}$`],
          );
        }
        // Merjenje g z nihalom (laboratorijska vaja).
        const lcm = r.int(40, 150);
        const N = r.pick([10, 20, 25]);
        const gTrue = r.pick([9.78, 9.8, 9.81, 9.82, 9.83]);
        const t = roundHalfUp(N * 2 * Math.PI * Math.sqrt(lcm / 100 / gTrue) + r.dec(-0.2, 0.2, 1), 1);
        const t0 = t / N;
        const gm = (4 * Math.PI * Math.PI * (lcm / 100)) / (t0 * t0);
        return T(
          `${n} pri laboratorijski vaji izmeri, da nihalo z dolžino $${lcm}\\ \\mathrm{cm}$ naredi $${N}$ nihajev v $${qty(tx(t), "s")}$. Kolikšen težni pospešek dobi iz teh meritev? Zaokroži na dve decimalki.`,
          num(gm, "m/s²", 2, [M((4 * Math.PI * Math.PI * lcm) / (t0 * t0), "Dolžino pretvori v metre."), M((4 * Math.PI * Math.PI * (lcm / 100)) / (t * t), "Izmerjeni čas najprej deli s številom nihajev."), M((2 * Math.PI * (lcm / 100)) / (t0 * t0), "Ko kvadriraš $2\\pi$, dobiš $4\\pi^2$.")]),
          "Najprej izračunaj nihajni čas enega nihaja, nato iz formule za matematično nihalo izrazi $g$.",
          [dat("l", lcm, "cm"), `N = ${N}`, dat("t", tx(t), "s")],
          ["g"],
          ["t_0 = \\dfrac{t}{N}", "g = \\dfrac{4\\pi^2 l}{t_0^2}"],
          [`$t_0 = \\dfrac{${tx(t)}\\ \\mathrm{s}}{${N}} ${res(t0, 3, "s")}$, $l = ${qty(tx(lcm / 100), "m")}$`, `$g = \\dfrac{4\\pi^2 \\cdot ${tx(lcm / 100)}}{(${tx(t0, 3)})^2}\\ \\mathrm{m/s^2} ${res(gm, 2, "m/s^2")}$`],
        );
      }
      const kind = r.int(0, 2);
      if (kind === 0) {
        // Ura z nihalom: nihalo se podaljša, ura zaostaja.
        const lcm = r.dec(25, 100, 1);
        const dl = r.dec(0.1, 0.5, 2);
        const ratio = Math.sqrt(lcm / (lcm + dl / 10));
        const lost = 86400 * (1 - ratio);
        return T(
          `Stenska ura z nihalom gre točno, ko je nihalo dolgo $${qty(tx(lcm), "cm")}$. Poleti se nihalo zaradi toplote podaljša za $${qty(tx(dl), "mm")}$. Koliko sekund ura zaostane v enem dnevu? Zaokroži na eno decimalko.`,
          num(lost, "s", 1, [M((86400 * dl) / 10 / lcm, "Nihajni čas je sorazmeren s korenom dolžine, ne z dolžino."), M(86400 * (1 - Math.sqrt(lcm / (lcm + dl))), "Podaljšek pretvori iz mm v cm."), M(24 * (1 - ratio) * 60, "En dan ima 86 400 s.")]),
          "Ura šteje nihaje in za vsakega prišteje stari nihajni čas. Izračunaj razmerje nihajnih časov iz razmerja dolžin.",
          [dat("l", tx(lcm), "cm"), dat("\\Delta l", tx(dl), "mm")],
          ["\\Delta t"],
          ["t_0 = 2\\pi\\sqrt{\\dfrac{l}{g}}", "\\Delta t = 86\\,400\\ \\mathrm{s} \\cdot \\left(1 - \\dfrac{t_0}{t_0'}\\right)"],
          [`$l' = ${tx(lcm)}\\ \\mathrm{cm} + ${tx(dl / 10, 3)}\\ \\mathrm{cm} = ${qty(tx(lcm + dl / 10, 3), "cm")}$`, `$\\dfrac{t_0}{t_0'} = \\sqrt{\\dfrac{l}{l'}} = \\sqrt{\\dfrac{${tx(lcm)}}{${tx(lcm + dl / 10, 3)}}} ${eq(ratio, 7)} ${tx(ratio, 7)}$`, "V dnevu nihalo naredi $86\\,400\\ \\mathrm{s} / t_0'$ nihajev, ura pa pokaže $86\\,400\\ \\mathrm{s} \\cdot t_0 / t_0'$.", `$\\Delta t = 86\\,400\\ \\mathrm{s} \\cdot (1 - ${tx(ratio, 7)}) ${res(lost, 1, "s")}$`],
        );
      }
      if (kind === 1) {
        // Obratno vprašanje: neznana masa iz spremembe nihajnega časa.
        const m = r.int(10, 40) * 10;
        const dm = r.int(5, 30) * 10;
        const k = r.int(10, 80);
        const t1 = roundHalfUp(2 * Math.PI * Math.sqrt(m / 1000 / k), 3);
        const t2 = roundHalfUp(2 * Math.PI * Math.sqrt((m + dm) / 1000 / k), 3);
        const q = (t2 / t1) ** 2;
        const mc = dm / (q - 1);
        return T(
          `Neznana utež na vzmeti niha z nihajnim časom $${qty(tx(t1), "s")}$. Ko ji dodamo $${dm}\\ \\mathrm{g}$, je nihajni čas $${qty(tx(t2), "s")}$. Kolikšna je masa neznane uteži v gramih? Zaokroži na celo število.`,
          num(mc, "g", 0, [M(dm / (t2 / t1 - 1), "Nihajni čas je sorazmeren s korenom mase: razmerje časov kvadriraj."), M(mc + dm, "To je masa po dodajanju; vprašanje je po masi neznane uteži.")]),
          "Koeficient vzmeti ni znan, a je obakrat enak. Zapiši razmerje nihajnih časov.",
          [dat("t_1", tx(t1), "s"), dat("\\Delta m", dm, "g"), dat("t_2", tx(t2), "s")],
          ["m"],
          ["t_0 = 2\\pi\\sqrt{\\dfrac{m}{k}}", "\\dfrac{m + \\Delta m}{m} = \\left(\\dfrac{t_2}{t_1}\\right)^2"],
          [`$\\left(\\dfrac{t_2}{t_1}\\right)^2 = \\left(\\dfrac{${tx(t2)}}{${tx(t1)}}\\right)^2 ${eq(q, 5)} ${tx(q, 5)}$`, `$1 + \\dfrac{\\Delta m}{m} = ${tx(q, 5)} \\Rightarrow m = \\dfrac{\\Delta m}{${tx(q, 5)} - 1}$`, `$m = \\dfrac{${dm}}{${tx(q - 1, 5)}}\\ \\mathrm{g} ${res(mc, 0, "g")}$`],
        );
      }
      // Hitrost pri danem odmiku (ohranitev energije).
      const k = r.int(5, 60) * 5;
      const m = r.dec(0.1, 1.5, 1);
      const x0 = r.int(4, 15);
      const x = r.int(1, x0 - 1);
      const v = Math.sqrt((k * ((x0 / 100) ** 2 - (x / 100) ** 2)) / m);
      return T(
        `Utež z maso $${qty(tx(m), "kg")}$ niha na vzmeti s koeficientom $${k}\\ \\mathrm{N/m}$ z amplitudo $${x0}\\ \\mathrm{cm}$. Kolikšna je njena hitrost, ko je od ravnovesne lege odmaknjena $${x}\\ \\mathrm{cm}$? Zaokroži na tri decimalke.`,
        num(v, "m/s", 3, [M((x0 / 100) * Math.sqrt(k / m), "To je največja hitrost v ravnovesni legi; pri odmiku $x$ je del energije še prožnostne."), M(((x0 - x) / 100) * Math.sqrt(k / m), "Odšteti moraš kvadrata odmikov, ne odmikov: $x_0^2 - x^2$."), M(Math.sqrt((k * (x0 * x0 - x * x)) / m), "Odmika pretvori v metre.")]),
        "Energija nihanja je stalna: pri odmiku $x$ je vsota prožnostne in kinetične energije enaka $\\frac{1}{2} k x_0^2$.",
        [dat("m", tx(m), "kg"), dat("k", k, "N/m"), dat("x_0", x0, "cm"), dat("x", x, "cm")],
        ["v"],
        ["\\dfrac{1}{2} k x_0^2 = \\dfrac{1}{2} k x^2 + \\dfrac{1}{2} m v^2", "v = \\sqrt{\\dfrac{k (x_0^2 - x^2)}{m}}"],
        [`$W = \\dfrac{1}{2} \\cdot ${k} \\cdot (${tx(x0 / 100)})^2\\ \\mathrm{J} ${res(0.5 * k * (x0 / 100) ** 2, 5, "J")}$`, `$W_{pr} = \\dfrac{1}{2} \\cdot ${k} \\cdot (${tx(x / 100)})^2\\ \\mathrm{J} ${res(0.5 * k * (x / 100) ** 2, 5, "J")}$`, `$W_k = W - W_{pr} ${res(0.5 * k * ((x0 / 100) ** 2 - (x / 100) ** 2), 5, "J")}$`, `$v = \\sqrt{\\dfrac{2 W_k}{m}} ${res(v, 3, "m/s")}$`],
      );
    },
  },
]);
