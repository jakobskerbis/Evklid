// Gimnazija: drugi tip naloge za teme fiz-ss1, ki so imele en sam generator (j, 2026-11-25).
// Obstoječi generatorji (fiz.js: hitrost, pospesek, newton2, energija) so preprosti in skupni z OŠ;
// tu so naloge gimnazijske ravni: lega in srečanje, zavorna in ustavitvena pot, navpični met,
// sistemi teles in klanec, prožnostna energija in izgube. Merila: docs/kakovost.md §2.
// Vsi rezultati so izračunani v kodi iz istih (zaokroženih) števil, ki jih vidi dijak.
import { NAMES, g } from "../rng.js";
import { roundHalfUp, fmt } from "../check.js";
import { tx } from "./mat.js";
import { num, pickAns, wrapGens } from "./matura-util.js";

const GZ = 9.81;
const G_TEX = "9{,}81";
const C_ZVOK = 340;
const T1 = (s) => `FIZ-SS-1/${s}`;

// ---------- pomožne funkcije ----------
// Količina z enoto (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}".
const qty = (val, unit) => (!unit ? `${val}` : `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`);
const dat = (sym, val, unit) => `${sym} = ${qty(val, unit)}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const ap = (x, d) => (needsRounding(x, d) ? "\\approx" : "=");
// Končni rezultat: »≈ 12,40 m« (na d decimalk).
const res = (x, d, unit) => `${ap(x, d)} ${qty(tx(x, d), unit)}`;
// Vmesni rezultat brez končnih ničel.
const txr = (x, d) => tx(roundHalfUp(x, d));
const mid = (x, d, unit) => `${ap(x, d)} ${qty(txr(x, d), unit)}`;
const pt = (s) => (String(s).startsWith("-") ? `(${s})` : `${s}`);
const dw = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : d === 3 ? "na tri decimalke" : `na ${d} decimalke`);
const M = (value, why) => ({ value, why });
const ime = (r) => r.pick(NAMES);
const rad = (a) => (a * Math.PI) / 180;
const kmh = (v) => v / 3.6;
const acc = (value, d, mistakes) => ({ ...num(value, d, mistakes, "m/s²"), unitAlternatives: ["m/s2", "m/s^2"] });

// Podatek, katerega števila niso v besedilu (npr. g), besedilo navede z »Uporabi …«.
const normT = (x) => String(x).replace(/\{,\}/g, ",").replace(/\\[,;: ]|~/g, " ");
const numsT = (x) => normT(x).replace(/\\mathrm\{(?:[^{}]|\{[^{}]*\})*\}/g, "").match(/-?\d+(?:,\d+)?/g) || [];
function withConsts(text, given) {
  const miss = given.filter((gv) => numsT(gv.split("=").slice(1).join("=")).some((x) => !normT(text).includes(x)));
  if (!miss.length) return text;
  const l = miss.map((gv) => `$${gv}$`);
  const list = l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} in ${l.at(-1)}`;
  if (text.includes(" Zaokroži ")) return text.replace(" Zaokroži ", ` Uporabi ${list}${l.length === 1 ? " in" : " ter"} zaokroži `);
  return `${text} Uporabi ${list}.`;
}
// Sestavi nalogo; steps so vrstice rešitve.
const T = (text, answer, hint, given, find, formula, steps) => ({ text: withConsts(text, given), answer, hint, data: { given, find }, formula, solution: steps.join("\n") });
const gD = () => dat("g", G_TEX, "m/s^2");

const GENS = [
  // ================= premo enakomerno gibanje =================
  {
    id: "gim-premo-enakomerno-dop",
    topics: [T1("premo-enakomerno-gibanje")],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Lega ob času t: x = x0 + v t (tudi negativna hitrost).
          const x0 = r.nonZero(-30, 40);
          const v = r.pick([-6, -5, -4, -3, -2.5, -2, -1.5, 1.5, 2, 2.5, 3, 4, 5, 6]);
          const t = r.int(2, 15);
          const x = x0 + v * t;
          const body = r.pick(["Tekač", "Kolesar", "Rolkar", "Avto"]);
          return T(
            `${body} se giblje premo enakomerno vzdolž osi $x$. Ob času $t = 0$ je na mestu $x_0 = ${qty(tx(x0), "m")}$, hitrost je $v = ${qty(tx(v), "m/s")}$. Na katerem mestu je ob času $t = ${qty(t, "s")}$? Rezultat zapiši v metrih.`,
            num(x, null, [M(v * t, "Si upošteval začetno lego x₀?"), M(x0 - v * t, "Pazi na predznak: x = x₀ + v·t, hitrost vstaviš s predznakom."), M(x0 + Math.abs(v) * t, "Negativna hitrost pomeni gibanje v negativni smeri osi x.")], "m"),
            "Pri enakomernem gibanju se lega vsako sekundo spremeni za $v$; začni pri $x_0$.",
            [dat("x_0", tx(x0), "m"), dat("v", tx(v), "m/s"), dat("t", t, "s")],
            ["x"],
            "x = x_0 + v \\cdot t",
            [`$x = x_0 + v \\cdot t$`, `$x = ${qty(tx(x0), "m")} + ${pt(qty(tx(v), "m/s"))} \\cdot ${qty(t, "s")}$`, `$x = ${qty(tx(x0), "m")} ${v * t < 0 ? "-" : "+"} ${qty(tx(Math.abs(v * t)), "m")} = ${qty(tx(x), "m")}$`],
          );
        }
        if (k === 1) {
          // Hitrost iz dveh leg: v = Δx / Δt (lahko negativna).
          const t1 = r.int(1, 6);
          const dt = r.int(2, 8);
          const t2 = t1 + dt;
          const v = r.pick([-4, -3, -2.5, -2, -1.5, -1, 1, 1.5, 2, 2.5, 3, 4, 5]);
          const x1 = r.int(-20, 30);
          const x2 = x1 + v * dt;
          return T(
            `${n} se s skirojem pelje premo enakomerno vzdolž osi $x$. Ob času $t_1 = ${qty(t1, "s")}$ je na mestu $x_1 = ${qty(tx(x1), "m")}$, ob času $t_2 = ${qty(t2, "s")}$ pa na mestu $x_2 = ${qty(tx(x2), "m")}$. Kolikšna je ${g(n, "njegova", "njena")} hitrost (s predznakom)?`,
            num(v, null, [M(x2 / t2, "Hitrost je sprememba lege deljeno s spremembo časa, ne lega deljeno s časom."), M((x2 - x1) / t2, "Deli s časovnim intervalom t₂ − t₁, ne s t₂."), M(-v, "Pazi na predznak: Δx = x₂ − x₁.")], "m/s"),
            "Izračunaj premik $\\Delta x = x_2 - x_1$ in čas $\\Delta t = t_2 - t_1$.",
            [dat("t_1", t1, "s"), dat("x_1", tx(x1), "m"), dat("t_2", t2, "s"), dat("x_2", tx(x2), "m")],
            ["v"],
            "v = \\dfrac{\\Delta x}{\\Delta t} = \\dfrac{x_2 - x_1}{t_2 - t_1}",
            [`$\\Delta x = x_2 - x_1 = ${qty(tx(x2), "m")} - ${pt(qty(tx(x1), "m"))} = ${qty(tx(v * dt), "m")}$`, `$\\Delta t = t_2 - t_1 = ${qty(t2, "s")} - ${qty(t1, "s")} = ${qty(dt, "s")}$`, `$v = \\dfrac{\\Delta x}{\\Delta t} = \\dfrac{${qty(tx(v * dt), "m")}}{${qty(dt, "s")}} = ${qty(tx(v), "m/s")}$`],
          );
        }
        // Pomen negativne hitrosti (pojem).
        const v = r.pick([-1.5, -2, -2.5, -3, -4, -5, -6, -8, -12]);
        const x0 = r.int(5, 60);
        const tz = x0 / -v;
        return T(
          `Telo se giblje premo enakomerno vzdolž osi $x$ s hitrostjo $v = ${qty(tx(v), "m/s")}$. Ob času $t = 0$ je na mestu $x_0 = ${qty(x0, "m")}$. Katera trditev drži?`,
          pickAns(r, `giblje se v negativni smeri osi x in vsako sekundo prepotuje ${fmt(-v)} m`, [
            ["telo zavira, ker je hitrost negativna", "Hitrost je stalna; predznak pove smer gibanja, ne zaviranja."],
            ["telo je levo od izhodišča, ker je hitrost negativna", `Lega in hitrost sta različni količini: ob t = 0 je telo na x = ${x0} m, desno od izhodišča.`],
            ["razdalja telesa od izhodišča se ves čas zmanjšuje", `Telo gre skozi izhodišče ob t ≈ ${fmt(roundHalfUp(tz, 2))} s, potem se razdalja spet povečuje.`],
          ]),
          "Predznak hitrosti pove smer gibanja glede na os $x$; zapiši $x(t) = x_0 + v t$.",
          [dat("v", tx(v), "m/s"), dat("x_0", x0, "m")],
          ["\\text{smer gibanja}"],
          "x = x_0 + v \\cdot t",
          [`$x(t) = ${qty(x0, "m")} ${sgn(v)} ${qty(tx(-v), "m/s")} \\cdot t$: lega se s časom zmanjšuje.`, `Hitrost je stalna (ni pojemka), velikost hitrosti je $${qty(tx(-v), "m/s")}$; telo gre skozi izhodišče ob $t ${ap(tz, 2)} ${qty(txr(tz, 2), "s")}$ in nadaljuje v negativni smeri.`, `Drži: giblje se v negativni smeri osi $x$, vsako sekundo za $${qty(tx(-v), "m")}$.`],
        );
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Povprečna hitrost na dveh enakih polovicah poti (harmonična sredina).
          const c = r.pick([
            { who: `${n} se s kolesom pelje`, lo: 8, hi: 18, d: 10 },
            { who: "Avtobus vozi", lo: 30, hi: 60, d: 30 },
            { who: "Tovornjak vozi", lo: 40, hi: 60, d: 20 },
            { who: `${n} teče`, lo: 6, hi: 9, d: 4 },
          ]);
          const v1 = r.int(c.lo, c.hi);
          let v2 = r.int(c.lo + c.d / 2, c.hi + c.d);
          if (v2 === v1) v2 += 3;
          const vp = (2 * v1 * v2) / (v1 + v2);
          return T(
            `${c.who} iz kraja A v kraj B. Prvo polovico poti premaga s stalno hitrostjo $${qty(v1, "km/h")}$, drugo polovico s stalno hitrostjo $${qty(v2, "km/h")}$. Kolikšna je povprečna hitrost na vsej poti? Zaokroži na eno decimalko.`,
            num(vp, 1, [M((v1 + v2) / 2, "Povprečna hitrost ni povprečje hitrosti: polovici poti ne trajata enako dolgo."), M((v1 * v2) / (v1 + v2), "Vsaka polovica je dolga s/2; skupni čas je s/(2v₁) + s/(2v₂).")], "km/h"),
            "Celotno pot označi s $s$; izračunaj čas za vsako polovico in nato $\\bar v = \\dfrac{s}{t_1 + t_2}$.",
            [dat("v_1", v1, "km/h"), dat("v_2", v2, "km/h")],
            ["\\bar v"],
            ["\\bar v = \\dfrac{s}{t_1 + t_2}", "t_1 = \\dfrac{s/2}{v_1},\\quad t_2 = \\dfrac{s/2}{v_2}"],
            [`$t_1 + t_2 = \\dfrac{s}{2 v_1} + \\dfrac{s}{2 v_2} = \\dfrac{s (v_1 + v_2)}{2 v_1 v_2}$`, `$\\bar v = \\dfrac{s}{t_1 + t_2} = \\dfrac{2 v_1 v_2}{v_1 + v_2}$`, `$\\bar v = \\dfrac{2 \\cdot ${v1} \\cdot ${v2}}{${v1} + ${v2}}\\ \\mathrm{km/h} ${res(vp, 1, "km/h")}$`],
          );
        }
        if (k === 1) {
          // Povprečna hitrost iz dveh časovnih odsekov (časi v minutah).
          const v1 = r.int(30, 90);
          const v2 = r.int(30, 90);
          const t1 = r.int(5, 40);
          let t2 = r.int(5, 40);
          if (t2 === t1) t2 += 7;
          const s1 = (v1 * t1) / 60;
          const s2 = (v2 * t2) / 60;
          const vp = (s1 + s2) / ((t1 + t2) / 60);
          const who = r.pick(["Avtobus", "Avto", "Vlak", "Motorist"]);
          return T(
            `${who} vozi $${t1}$ minut s stalno hitrostjo $${qty(v1, "km/h")}$, nato $${t2}$ minut s stalno hitrostjo $${qty(v2, "km/h")}$. Kolikšna je povprečna hitrost v tem času? Zaokroži na eno decimalko.`,
            num(vp, 1, [M((v1 + v2) / 2, "Odseka trajata različno dolgo, zato povprečna hitrost ni povprečje hitrosti."), M(s1 + s2, "To je skupna pot v km; deliti jo moraš še s skupnim časom.")], "km/h"),
            "Najprej izračunaj pot na vsakem odseku ($s = v t$, čas v urah), nato skupno pot deli s skupnim časom.",
            [dat("t_1", t1, "min"), dat("v_1", v1, "km/h"), dat("t_2", t2, "min"), dat("v_2", v2, "km/h")],
            ["\\bar v"],
            ["s = v \\cdot t", "\\bar v = \\dfrac{s_1 + s_2}{t_1 + t_2}"],
            [`$s_1 = v_1 t_1 = ${qty(v1, "km/h")} \\cdot \\dfrac{${t1}}{60}\\ \\mathrm{h} ${mid(s1, 3, "km")}$`, `$s_2 = v_2 t_2 = ${qty(v2, "km/h")} \\cdot \\dfrac{${t2}}{60}\\ \\mathrm{h} ${mid(s2, 3, "km")}$`, `$\\bar v = \\dfrac{s_1 + s_2}{t_1 + t_2} = \\dfrac{${txr(s1 + s2, 3)}\\ \\mathrm{km}}{\\frac{${t1 + t2}}{60}\\ \\mathrm{h}} ${res(vp, 1, "km/h")}$`],
          );
        }
        // Blisk in grom: s = c t, rezultat v km.
        const t = r.dec(1, 12, 1);
        const s = (C_ZVOK * t) / 1000;
        return T(
          `${n} med nevihto ${g(n, "opazi", "opazi")} blisk, grom pa ${g(n, "zasliši", "zasliši")} $${qty(tx(t), "s")}$ pozneje. Svetloba pride praktično takoj, zvok potuje s hitrostjo $c = ${qty(C_ZVOK, "m/s")}$. Kako daleč (v km) je udarila strela? Zaokroži na dve decimalki.`,
          num(s, 2, [M(C_ZVOK * t, "Rezultat je v metrih; pretvori ga v kilometre."), M(C_ZVOK / t / 1000, "Pot je hitrost krat čas, ne hitrost deljeno s časom.")], "km"),
          "Zvok potuje enakomerno: $s = c t$. Metre nato pretvori v kilometre.",
          [dat("t", tx(t), "s"), dat("c", C_ZVOK, "m/s")],
          ["s\\ [\\mathrm{km}]"],
          ["s = c \\cdot t", "1\\ \\mathrm{km} = 1000\\ \\mathrm{m}"],
          [`$s = c \\cdot t = ${qty(C_ZVOK, "m/s")} \\cdot ${qty(tx(t), "s")} = ${qty(tx(C_ZVOK * t), "m")}$`, `$s = \\dfrac{${tx(C_ZVOK * t)}}{1000}\\ \\mathrm{km} ${res(s, 2, "km")}$`],
        );
      }
      const k = r.int(0, 2);
      if (k === 0) {
        // Srečanje dveh vozil, ki vozita drug proti drugemu.
        const d = r.int(20, 150);
        const v1 = r.int(40, 110);
        let v2 = r.int(30, 100);
        if (v2 === v1) v2 += 5;
        const t = d / (v1 + v2);
        const askX = r.next() < 0.5;
        const text = `Kraja A in B sta po ravni cesti oddaljena $${qty(d, "km")}$. Iz A odpelje avto s stalno hitrostjo $${qty(v1, "km/h")}$, ob istem času iz B proti A tovornjak s stalno hitrostjo $${qty(v2, "km/h")}$.`;
        const given = [dat("d", d, "km"), dat("v_1", v1, "km/h"), dat("v_2", v2, "km/h")];
        const tLine = `$t = \\dfrac{d}{v_1 + v_2} = \\dfrac{${qty(d, "km")}}{${qty(v1 + v2, "km/h")}} ${mid(t, 4, "h")}$`;
        if (askX) {
          const x = v1 * t;
          return T(
            `${text} Koliko kilometrov od A se srečata? Zaokroži na eno decimalko.`,
            num(x, 1, [M(d / 2, "Vozili nista enako hitri, zato se ne srečata na polovici poti."), M(v2 * t, "To je pot tovornjaka (od B); vprašanje je razdalja od A."), M((d * v1) / Math.abs(v1 - v2), "Vozili gresta drug proti drugemu: razdalja se manjša z vsoto hitrosti.")], "km"),
            "Razdalja med voziloma se vsako uro zmanjša za $v_1 + v_2$; najprej izračunaj čas do srečanja.",
            given,
            ["x_A"],
            ["t = \\dfrac{d}{v_1 + v_2}", "x_A = v_1 \\cdot t"],
            [`$v_1 t + v_2 t = d$`, tLine, `$x_A = v_1 \\cdot t = \\dfrac{${v1} \\cdot ${d}}{${v1 + v2}}\\ \\mathrm{km} ${res(x, 1, "km")}$`],
          );
        }
        const tm = t * 60;
        return T(
          `${text} Čez koliko minut se srečata? Zaokroži na eno decimalko.`,
          num(tm, 1, [M(t, "To je čas v urah; vprašanje je v minutah."), M((d / Math.abs(v1 - v2)) * 60, "Vozili gresta drug proti drugemu: hitrosti seštej, ne odštej."), M((d / v1) * 60, "Upoštevaj, da se giblje tudi tovornjak.")], "min"),
          "Razdalja med voziloma se vsako uro zmanjša za $v_1 + v_2$.",
          given,
          ["t\\ [\\mathrm{min}]"],
          ["t = \\dfrac{d}{v_1 + v_2}", "1\\ \\mathrm{h} = 60\\ \\mathrm{min}"],
          [`$v_1 t + v_2 t = d$`, tLine, `$t = ${txr(t, 4)} \\cdot 60\\ \\mathrm{min} ${res(tm, 1, "min")}$`],
        );
      }
      if (k === 1) {
        // Dohitevanje: drugi odide pozneje in hitreje.
        const v1 = r.int(12, 24);
        const v2 = r.int(40, 80);
        const dtm = r.int(10, 45);
        const tm = (v1 * dtm) / (v2 - v1);
        return T(
          `${n} odpelje od doma s kolesom s stalno hitrostjo $${qty(v1, "km/h")}$. Čez $${dtm}$ minut ${g(n, "mu", "ji")} po isti cesti sledi mama z avtom s stalno hitrostjo $${qty(v2, "km/h")}$. Čez koliko minut od svojega odhoda ${g(n, "ga", "jo")} mama dohiti? Zaokroži na eno decimalko.`,
          num(tm, 1, [M((v1 * dtm) / (v2 + v1), "Pri dohitevanju se razdalja manjša z razliko hitrosti, ne z vsoto."), M((v2 * dtm) / (v2 - v1), "To je čas od odhoda s kolesom; vprašanje je čas od odhoda mame."), M((v1 * dtm) / v2, "Upoštevaj, da se kolo med dohitevanjem še naprej pelje.")], "min"),
          "Izračunaj prednost kolesa ob odhodu mame; ta se zmanjšuje z razliko hitrosti $v_2 - v_1$.",
          [dat("v_1", v1, "km/h"), dat("\\Delta t", dtm, "min"), dat("v_2", v2, "km/h")],
          ["t\\ [\\mathrm{min}]"],
          ["d_0 = v_1 \\cdot \\Delta t", "t = \\dfrac{d_0}{v_2 - v_1}"],
          [`$d_0 = v_1 \\Delta t = ${qty(v1, "km/h")} \\cdot \\dfrac{${dtm}}{60}\\ \\mathrm{h} ${mid((v1 * dtm) / 60, 3, "km")}$`, `$t = \\dfrac{d_0}{v_2 - v_1} = \\dfrac{${txr((v1 * dtm) / 60, 3)}\\ \\mathrm{km}}{${qty(v2 - v1, "km/h")}} ${mid(tm / 60, 4, "h")}$`, `$t = \\dfrac{${v1} \\cdot ${dtm}}{${v2 - v1}}\\ \\mathrm{min} ${res(tm, 1, "min")}$`],
        );
      }
      // Vlak skozi predor (obratna naloga, hitrost iz časa).
      const L = r.int(8, 30) * 10;
      const D = r.int(20, 200) * 10;
      const vTrue = r.int(40, 120);
      const t = roundHalfUp((L + D) / kmh(vTrue), 1);
      const v = ((L + D) / t) * 3.6;
      return T(
        `Vlak, dolg $${qty(L, "m")}$, pelje s stalno hitrostjo skozi predor, dolg $${qty(D, "m")}$. Od trenutka, ko čelo vlaka zapelje v predor, do trenutka, ko zadnji vagon zapusti predor, mine $${qty(tx(t), "s")}$. Kolikšna je hitrost vlaka v km/h? Zaokroži na eno decimalko.`,
        num(v, 1, [M((D / t) * 3.6, "Vlak mora prevoziti dolžino predora in še svojo dolžino."), M((L + D) / t, "To je hitrost v m/s; pretvori jo v km/h (pomnoži s 3,6)."), M(((D - L) / t) * 3.6, "Dolžino vlaka prišteješ, ne odšteješ.")], "km/h"),
        "Nariši skico: koliko poti naredi čelo vlaka, dokler zadnji vagon ne zapusti predora?",
        [dat("L", L, "m"), dat("D", D, "m"), dat("t", tx(t), "s")],
        ["v\\ [\\mathrm{km/h}]"],
        ["s = D + L", "v = \\dfrac{s}{t}", "1\\ \\mathrm{m/s} = 3{,}6\\ \\mathrm{km/h}"],
        [`$s = D + L = ${qty(D, "m")} + ${qty(L, "m")} = ${qty(L + D, "m")}$`, `$v = \\dfrac{s}{t} = \\dfrac{${qty(L + D, "m")}}{${qty(tx(t), "s")}} ${mid((L + D) / t, 3, "m/s")}$`, `$v = ${txr((L + D) / t, 3)} \\cdot 3{,}6\\ \\mathrm{km/h} ${res(v, 1, "km/h")}$`],
      );
    },
  },

  // ================= enakomerno pospešeno gibanje =================
  {
    id: "gim-pospeseno-dop",
    topics: [T1("enakomerno-pospeseno-gibanje")],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Pospešek iz spremembe hitrosti (tudi zaviranje, negativen pospešek).
          const down = r.next() < 0.6;
          const who = r.pick(["avtomobila", "vlaka", "kolesarja", "motorista"]);
          const vmax = who === "kolesarja" ? 12 : 30;
          let v1 = r.int(3, vmax);
          let v2 = r.int(3, vmax);
          if (v1 === v2) v2 = v1 > 6 ? v1 - 3 : v1 + 3;
          if (down !== v1 > v2) [v1, v2] = [v2, v1];
          // Največ 6 m/s² (realno za avto, vlak, kolo).
          const t = Math.max(r.int(2, 12), Math.ceil(Math.abs(v2 - v1) / 6));
          const a = (v2 - v1) / t;
          return T(
            `Hitrost ${who} se v $${qty(t, "s")}$ enakomerno ${down ? "zmanjša" : "poveča"} z $${qty(v1, "m/s")}$ na $${qty(v2, "m/s")}$. Kolikšen je pospešek (s predznakom)? Zaokroži na dve decimalki.`,
            acc(a, 2, [M(-a, down ? "Hitrost se zmanjšuje, zato je pospešek negativen: a = (v₂ − v₁)/t." : "Hitrost se povečuje, zato je pospešek pozitiven."), M(v2 / t, "Pospešek je sprememba hitrosti deljena s časom, ne končna hitrost deljena s časom."), M((v1 + v2) / t, "Hitrosti odštej (končna − začetna), ne seštej.")]),
            "Pospešek je sprememba hitrosti v enoti časa: najprej izračunaj $\\Delta v = v_2 - v_1$.",
            [dat("v_1", v1, "m/s"), dat("v_2", v2, "m/s"), dat("t", t, "s")],
            ["a"],
            "a = \\dfrac{\\Delta v}{t} = \\dfrac{v_2 - v_1}{t}",
            [`$\\Delta v = v_2 - v_1 = ${qty(v2, "m/s")} - ${qty(v1, "m/s")} = ${qty(v2 - v1, "m/s")}$`, `$a = \\dfrac{\\Delta v}{t} = \\dfrac{${qty(v2 - v1, "m/s")}}{${qty(t, "s")}} ${res(a, 2, "m/s^2")}$`],
          );
        }
        if (k === 1) {
          // Pot s povprečno hitrostjo: s = (v1 + v2)/2 · t.
          const v1 = r.int(1, 6);
          const v2 = v1 + r.int(2, 6);
          const t = r.int(3, 15);
          const s = ((v1 + v2) / 2) * t;
          return T(
            `${n} na kolesu v $${qty(t, "s")}$ enakomerno pospeši s hitrosti $${qty(v1, "m/s")}$ na $${qty(v2, "m/s")}$. Koliko poti pri tem prevozi? Zaokroži na eno decimalko.`,
            num(s, 1, [M(v2 * t, "Hitrost ni bila ves čas končna; uporabi povprečno hitrost."), M(((v2 - v1) / 2) * t, "Povprečna hitrost je (v₁ + v₂)/2, ne (v₂ − v₁)/2."), M(v1 * t, "Hitrost se je med pospeševanjem večala; uporabi povprečno hitrost.")], "m"),
            "Pri enakomerno pospešenem gibanju je povprečna hitrost aritmetična sredina začetne in končne hitrosti.",
            [dat("t", t, "s"), dat("v_1", v1, "m/s"), dat("v_2", v2, "m/s")],
            ["s"],
            ["\\bar v = \\dfrac{v_1 + v_2}{2}", "s = \\bar v \\cdot t"],
            [`$\\bar v = \\dfrac{v_1 + v_2}{2} = \\dfrac{${v1} + ${v2}}{2}\\ \\mathrm{m/s} = ${qty(tx((v1 + v2) / 2), "m/s")}$`, `$s = \\bar v \\cdot t = ${qty(tx((v1 + v2) / 2), "m/s")} \\cdot ${qty(t, "s")} ${res(s, 1, "m")}$`],
          );
        }
        // Pojem: negativni pospešek obrne smer gibanja.
        const v0 = r.int(4, 12);
        const a = -r.int(1, 4);
        const t = Math.floor(v0 / -a) + 1 + r.int(0, 2);
        const v = v0 + a * t;
        return T(
          `Telo se giblje vzdolž osi $x$. Ob času $t = 0$ ima hitrost $v_0 = ${qty(v0, "m/s")}$, pospešek je ves čas $a = ${qty(tx(a), "m/s^2")}$. Kaj velja za gibanje ob času $t = ${qty(t, "s")}$?`,
          pickAns(r, `giblje se v negativni smeri osi x s hitrostjo velikosti ${fmt(-v)} m/s`, [
            ["telo miruje, ker se je ustavilo in tam ostane", "Pospešek deluje tudi po ustavitvi, zato telo začne pospeševati v nasprotno smer."],
            [`giblje se v pozitivni smeri osi x s hitrostjo ${fmt(-v)} m/s`, "Hitrost v = v₀ + a·t je negativna: telo se je obrnilo."],
            [`giblje se v pozitivni smeri osi x s hitrostjo ${fmt(v0 - a * t)} m/s`, "Pospešek je negativen, zato se hitrost zmanjšuje, ne povečuje."],
          ]),
          "Izračunaj hitrost $v = v_0 + a t$ in poglej njen predznak.",
          [dat("v_0", v0, "m/s"), dat("a", tx(a), "m/s^2"), dat("t", t, "s")],
          ["v", "\\text{smer gibanja}"],
          "v = v_0 + a \\cdot t",
          [`$v = v_0 + a t = ${qty(v0, "m/s")} + ${pt(qty(tx(a), "m/s^2"))} \\cdot ${qty(t, "s")} = ${qty(tx(v), "m/s")}$`, `Telo se ustavi ob $t ${ap(v0 / -a, 2)} ${txr(v0 / -a, 2)}\\ \\mathrm{s}$, potem se giblje v negativni smeri.`, `Hitrost je negativna: giblje se v negativni smeri, velikost hitrosti je $${qty(tx(-v), "m/s")}$.`],
        );
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Zavorna pot, hitrost v km/h.
          const v0k = r.int(30, 130);
          const a = r.dec(4, 8, 1);
          const v0 = kmh(v0k);
          const s = (v0 * v0) / (2 * a);
          return T(
            `${n} vozi s hitrostjo $${qty(v0k, "km/h")}$ in začne zavirati s stalnim pojemkom velikosti $${qty(tx(a), "m/s^2")}$. Kolikšna je zavorna pot do ustavitve? Zaokroži na eno decimalko.`,
            num(s, 1, [M((v0k * v0k) / (2 * a), "Hitrost najprej pretvori v m/s (deli s 3,6)."), M((v0 * v0) / a, "V formuli s = v₀²/(2a) je v imenovalcu 2a."), M(v0 / (2 * a), "Hitrost moraš kvadrirati.")], "m"),
            "Hitrost pretvori v m/s, nato uporabi zvezo med hitrostjo in potjo, v kateri ni časa.",
            [dat("v_0", v0k, "km/h"), dat("a", tx(a), "m/s^2")],
            ["s"],
            ["v^2 = v_0^2 - 2 a s", "s = \\dfrac{v_0^2}{2 a} \\quad (v = 0)"],
            [`$v_0 = \\dfrac{${v0k}}{3{,}6}\\ \\mathrm{m/s} ${mid(v0, 2, "m/s")}$`, `$0 = v_0^2 - 2 a s \\;\\Rightarrow\\; s = \\dfrac{v_0^2}{2 a}$`, `$s = \\dfrac{(${txr(v0, 2)}\\ \\mathrm{m/s})^2}{2 \\cdot ${qty(tx(a), "m/s^2")}} ${res(s, 1, "m")}$`],
          );
        }
        if (k === 1) {
          // Pojemek iz zavorne poti.
          const v0 = r.int(10, 30);
          const s = r.int(15, 90);
          const a = (v0 * v0) / (2 * s);
          const who = r.pick(["Avto", "Motorist", "Kombi", "Avtobus"]);
          return T(
            `${who} s hitrostjo $${qty(v0, "m/s")}$ enakomerno zavira in se ustavi na poti $${qty(s, "m")}$. Kolikšna je velikost pojemka? Zaokroži na dve decimalki.`,
            acc(a, 2, [M((v0 * v0) / s, "Iz v₀² = 2as sledi a = v₀²/(2s): ne pozabi faktorja 2."), M(v0 / s, "Hitrost moraš kvadrirati."), M(v0 / (2 * s), "Hitrost moraš kvadrirati.")]),
            "Čas ni podan: uporabi zvezo $v^2 = v_0^2 - 2 a s$ s končno hitrostjo $0$.",
            [dat("v_0", v0, "m/s"), dat("s", s, "m")],
            ["a"],
            ["v^2 = v_0^2 - 2 a s", "a = \\dfrac{v_0^2}{2 s} \\quad (v = 0)"],
            [`$0 = v_0^2 - 2 a s \\;\\Rightarrow\\; a = \\dfrac{v_0^2}{2 s}$`, `$a = \\dfrac{(${qty(v0, "m/s")})^2}{2 \\cdot ${qty(s, "m")}} = \\dfrac{${v0 * v0}}{${2 * s}}\\ \\mathrm{m/s^2} ${res(a, 2, "m/s^2")}$`],
          );
        }
        // Iz mirovanja: s in t → končna hitrost (prek pospeška).
        // Stvaren pospešek za vsak primer; pot zaokrožimo na cele metre, rezultat izračunamo iz prikazanih števil.
        const c = r.pick([
          { who: "Letalo na stezi", lo: 2, hi: 4, t0: 8, t1: 22 },
          { who: "Športni avto", lo: 3, hi: 6, t0: 3, t1: 8 },
          { who: "Vlak", lo: 0.3, hi: 1.2, t0: 10, t1: 40 },
          { who: "Smučar", lo: 1, hi: 3, t0: 3, t1: 10 },
        ]);
        const t = r.int(c.t0, c.t1);
        const s = Math.max(10, Math.round((r.dec(c.lo, c.hi, 2) * t * t) / 2));
        const a = (2 * s) / t ** 2;
        const v = a * t;
        const who = c.who;
        return T(
          `${who} iz mirovanja enakomerno pospešuje in v $${qty(t, "s")}$ prepotuje $${qty(s, "m")}$. Kolikšna je njegova hitrost na koncu? Zaokroži na eno decimalko.`,
          num(v, 1, [M(s / t, "To je povprečna hitrost; pri pospeševanju iz mirovanja je končna dvakrat večja."), M(a, "To je pospešek; pomnoži ga še s časom."), M((s / t ** 2) * t, "Iz s = at²/2 sledi a = 2s/t².")], "m/s"),
          "Iz poti in časa najprej izračunaj pospešek ($s = \\frac{1}{2} a t^2$), nato hitrost.",
          [dat("t", t, "s"), dat("s", s, "m")],
          ["v"],
          ["s = \\dfrac{a t^2}{2}", "v = a \\cdot t"],
          [`$a = \\dfrac{2 s}{t^2} = \\dfrac{2 \\cdot ${qty(s, "m")}}{(${qty(t, "s")})^2} ${mid(a, 4, "m/s^2")}$`, `$v = a t = ${txr(a, 4)}\\ \\mathrm{m/s^2} \\cdot ${qty(t, "s")} ${res(v, 1, "m/s")}$`, `(Preverba: $v = \\dfrac{2 s}{t}$, ker je povprečna hitrost $\\dfrac{v}{2}$.)`],
        );
      }
      const k = r.int(0, 2);
      if (k === 0) {
        // Ustavitvena pot: reakcijska + zavorna.
        const v0k = r.int(40, 130);
        const tr = r.dec(0.5, 1.5, 1);
        const a = r.dec(4.5, 8.5, 1);
        const v0 = kmh(v0k);
        const sr = v0 * tr;
        const sz = (v0 * v0) / (2 * a);
        return T(
          `${n} vozi s hitrostjo $${qty(v0k, "km/h")}$, ko na cesto skoči srna. Reakcijski čas je $${qty(tx(tr), "s")}$, nato avto zavira s pojemkom $${qty(tx(a), "m/s^2")}$. Kolikšna je ustavitvena pot (od opazitve do ustavitve)? Zaokroži na eno decimalko.`,
          num(sr + sz, 1, [M(sz, "Med reakcijskim časom avto še vozi s polno hitrostjo; prištej reakcijsko pot."), M(v0k * tr + (v0k * v0k) / (2 * a), "Hitrost najprej pretvori v m/s."), M(sr + (v0 * v0) / a, "Zavorna pot je v₀²/(2a).")], "m"),
          "Razdeli na dva dela: med reakcijskim časom je gibanje enakomerno, potem enakomerno pojemajoče.",
          [dat("v_0", v0k, "km/h"), dat("t_r", tx(tr), "s"), dat("a", tx(a), "m/s^2")],
          ["s"],
          ["s_r = v_0 \\cdot t_r", "s_z = \\dfrac{v_0^2}{2 a}", "s = s_r + s_z"],
          [`$v_0 = \\dfrac{${v0k}}{3{,}6}\\ \\mathrm{m/s} ${mid(v0, 3, "m/s")}$`, `$s_r = v_0 t_r ${mid(sr, 2, "m")}$`, `$s_z = \\dfrac{v_0^2}{2 a} ${mid(sz, 2, "m")}$`, `$s = s_r + s_z ${res(sr + sz, 1, "m")}$`],
        );
      }
      if (k === 1) {
        // Obratno: največja hitrost, da se ustavi pred oviro (kvadratna enačba).
        const d = r.int(20, 80);
        const tr = r.dec(0.6, 1.2, 1);
        const a = r.dec(5, 8, 1);
        const v = -a * tr + Math.sqrt((a * tr) ** 2 + 2 * a * d);
        const vk = v * 3.6;
        return T(
          `${n} opazi oviro $${qty(d, "m")}$ pred avtom. Reakcijski čas je $${qty(tx(tr), "s")}$, največji pojemek pri zaviranju $${qty(tx(a), "m/s^2")}$. Kolikšna je največja hitrost, pri kateri se še ustavi pred oviro? Rezultat zapiši v km/h in zaokroži na eno decimalko.`,
          num(vk, 1, [M(Math.sqrt(2 * a * d) * 3.6, "Upoštevaj tudi pot, ki jo avto prevozi med reakcijskim časom."), M(v, "To je hitrost v m/s; pretvori jo v km/h."), M((d / tr) * 3.6, "Zavorna pot ni nič: ustavitvena pot je reakcijska plus zavorna.")], "km/h"),
          "Zapiši $v t_r + \\dfrac{v^2}{2 a} = d$ in reši kvadratno enačbo za $v$ (pozitivna rešitev).",
          [dat("d", d, "m"), dat("t_r", tx(tr), "s"), dat("a", tx(a), "m/s^2")],
          ["v_{\\max}\\ [\\mathrm{km/h}]"],
          ["v \\cdot t_r + \\dfrac{v^2}{2 a} = d", "v = -a t_r + \\sqrt{(a t_r)^2 + 2 a d}"],
          [`$v t_r + \\dfrac{v^2}{2 a} = d \\;\\Rightarrow\\; v^2 + 2 a t_r v - 2 a d = 0$`, `$v = -a t_r + \\sqrt{(a t_r)^2 + 2 a d} = -${txr(a * tr, 2)} + \\sqrt{${txr((a * tr) ** 2, 4)} + ${txr(2 * a * d, 2)}}\\ \\mathrm{m/s} ${mid(v, 3, "m/s")}$`, `$v = ${txr(v, 3)} \\cdot 3{,}6\\ \\mathrm{km/h} ${res(vk, 1, "km/h")}$`],
        );
      }
      // Pospeševalni pas: pospešek ali čas iz dveh hitrosti in poti.
      const v1k = r.int(30, 60);
      const v2k = r.int(80, 110);
      const s = r.int(15, 30) * 10;
      const v1 = kmh(v1k);
      const v2 = kmh(v2k);
      const given = [dat("v_1", v1k, "km/h"), dat("v_2", v2k, "km/h"), dat("s", s, "m")];
      const conv = `$v_1 = \\dfrac{${v1k}}{3{,}6}\\ \\mathrm{m/s} ${mid(v1, 3, "m/s")}$, $v_2 = \\dfrac{${v2k}}{3{,}6}\\ \\mathrm{m/s} ${mid(v2, 3, "m/s")}$`;
      const intro = `Avto na pospeševalnem pasu avtoceste enakomerno pospeši s $${qty(v1k, "km/h")}$ na $${qty(v2k, "km/h")}$ na poti $${qty(s, "m")}$.`;
      if (r.next() < 0.5) {
        const a = (v2 * v2 - v1 * v1) / (2 * s);
        return T(
          `${intro} Kolikšen je pospešek? Zaokroži na dve decimalki.`,
          acc(a, 2, [M((v2k * v2k - v1k * v1k) / (2 * s), "Hitrosti najprej pretvori v m/s."), M((v2 - v1) ** 2 / (2 * s), "V formuli je razlika kvadratov hitrosti, ne kvadrat razlike."), M((v2 * v2 - v1 * v1) / s, "Iz v₂² − v₁² = 2as deliš z 2s.")]),
          "Čas ni podan: uporabi $v_2^2 = v_1^2 + 2 a s$ (hitrosti v m/s).",
          given,
          ["a"],
          ["v_2^2 = v_1^2 + 2 a s", "a = \\dfrac{v_2^2 - v_1^2}{2 s}"],
          [conv, `$a = \\dfrac{v_2^2 - v_1^2}{2 s} = \\dfrac{${txr(v2 * v2, 2)} - ${txr(v1 * v1, 2)}}{2 \\cdot ${s}}\\ \\mathrm{m/s^2} ${res(a, 2, "m/s^2")}$`],
        );
      }
      const t = (2 * s) / (v1 + v2);
      return T(
        `${intro} Koliko časa pospešuje? Zaokroži na eno decimalko.`,
        num(t, 1, [M(s / v2, "Hitrost ni bila ves čas končna; uporabi povprečno hitrost (v₁ + v₂)/2."), M((2 * s) / (v1k + v2k), "Hitrosti najprej pretvori v m/s."), M(s / (v1 + v2), "Povprečna hitrost je (v₁ + v₂)/2, zato je t = 2s/(v₁ + v₂).")], "s"),
        "Pri enakomernem pospeševanju je povprečna hitrost $\\dfrac{v_1 + v_2}{2}$; hitrosti pretvori v m/s.",
        given,
        ["t"],
        ["s = \\dfrac{v_1 + v_2}{2} \\cdot t", "t = \\dfrac{2 s}{v_1 + v_2}"],
        [conv, `$\\bar v = \\dfrac{v_1 + v_2}{2} ${mid((v1 + v2) / 2, 3, "m/s")}$`, `$t = \\dfrac{s}{\\bar v} = \\dfrac{2 \\cdot ${qty(s, "m")}}{${txr(v1 + v2, 3)}\\ \\mathrm{m/s}} ${res(t, 1, "s")}$`],
      );
    },
  },

  // ================= prosti pad in navpični met =================
  {
    id: "gim-prosti-pad-dop",
    topics: [T1("prosti-pad-in-navpicni-met")],
    gen(level, r) {
      const n = ime(r);
      const noAir = "Zračni upor zanemari.";
      if (level === 1) {
        const k = r.int(0, 3);
        if (k === 0) {
          const c = r.pick([
            { what: "Kamen spustimo z mostu", lo: 10, hi: 80 },
            { what: "Ključ pade z balkona", lo: 3, hi: 25 },
            { what: "Jabolko pade z veje", lo: 1.5, hi: 6 },
            { what: "Kroglico spustimo z razglednega stolpa", lo: 15, hi: 60 },
          ]);
          const h = r.dec(c.lo, c.hi, 1);
          const t = Math.sqrt((2 * h) / GZ);
          const what = c.what;
          return T(
            `${what}, ki je $${qty(tx(h), "m")}$ nad tlemi. Koliko časa pada? ${noAir} Zaokroži na dve decimalki.`,
            num(t, 2, [M(Math.sqrt(h / GZ), "Iz h = g t²/2 sledi t² = 2h/g: ne pozabi faktorja 2."), M((2 * h) / GZ, "To je t²; izračunati moraš še koren."), M(h / GZ, "Pot pri prostem padu je g t²/2, ne g t.")], "s"),
            "Prosti pad je enakomerno pospešeno gibanje iz mirovanja s pospeškom $g$; izrazi čas iz $h = \\frac{1}{2} g t^2$.",
            [dat("h", tx(h), "m"), gD()],
            ["t"],
            ["h = \\dfrac{g t^2}{2}", "t = \\sqrt{\\dfrac{2 h}{g}}"],
            [`$t = \\sqrt{\\dfrac{2 h}{g}} = \\sqrt{\\dfrac{2 \\cdot ${qty(tx(h), "m")}}{${qty(G_TEX, "m/s^2")}}}$`, `$t = \\sqrt{${txr((2 * h) / GZ, 4)}\\ \\mathrm{s^2}} ${res(t, 2, "s")}$`],
          );
        }
        if (k === 1) {
          const t = r.dec(0.5, 4, 1);
          const h = (GZ * t * t) / 2;
          return T(
            `${n} spusti kamen v globoko brezno. Koliko metrov pade kamen v prvih $${qty(tx(t), "s")}$? ${noAir} Zaokroži na eno decimalko.`,
            num(h, 1, [M(GZ * t * t, "Pozabil si faktor ½ v formuli h = g t²/2."), M(GZ * t, "To je hitrost po tem času, ne pot."), M((GZ * t) / 2, "Čas moraš kvadrirati.")], "m"),
            "Pot pri prostem padu iz mirovanja: $h = \\frac{1}{2} g t^2$.",
            [dat("t", tx(t), "s"), gD()],
            ["h"],
            "h = \\dfrac{g t^2}{2}",
            [`$t^2 = (${qty(tx(t), "s")})^2 = ${qty(txr(t * t, 2), "s^2")}$`, `$h = \\dfrac{g t^2}{2} = \\dfrac{${qty(G_TEX, "m/s^2")} \\cdot ${qty(txr(t * t, 2), "s^2")}}{2} ${res(h, 1, "m")}$`],
          );
        }
        if (k === 2) {
          const v0 = r.int(5, 30);
          const h = (v0 * v0) / (2 * GZ);
          const what = r.pick(["Žogo", "Kamen", "Teniško žogico", "Ključe"]);
          return T(
            `${what} vržemo navpično navzgor z začetno hitrostjo $${qty(v0, "m/s")}$. Kako visoko nad metiščem pride? ${noAir} Zaokroži na dve decimalki.`,
            num(h, 2, [M((v0 * v0) / GZ, "Iz v₀² = 2gh sledi h = v₀²/(2g): ne pozabi faktorja 2."), M(v0 / GZ, "To je čas vzpona, ne višina."), M(v0 / (2 * GZ), "Hitrost moraš kvadrirati.")], "m"),
            "V najvišji točki je hitrost $0$; uporabi zvezo med hitrostjo in potjo brez časa.",
            [dat("v_0", v0, "m/s"), gD()],
            ["h_{\\max}"],
            ["v^2 = v_0^2 - 2 g h", "h_{\\max} = \\dfrac{v_0^2}{2 g}"],
            [`$0 = v_0^2 - 2 g h_{\\max} \\;\\Rightarrow\\; h_{\\max} = \\dfrac{v_0^2}{2 g}$`, `$h_{\\max} = \\dfrac{(${qty(v0, "m/s")})^2}{2 \\cdot ${qty(G_TEX, "m/s^2")}} = \\dfrac{${v0 * v0}}{${tx(2 * GZ)}}\\ \\mathrm{m} ${res(h, 2, "m")}$`],
          );
        }
        const v0 = r.dec(3, 25, 1);
        const t = v0 / GZ;
        return T(
          `Puščico izstrelimo navpično navzgor s hitrostjo $${qty(tx(v0), "m/s")}$. Koliko časa se dviga, preden se ustavi v najvišji točki? ${noAir} Zaokroži na dve decimalki.`,
          num(t, 2, [M((2 * v0) / GZ, "To je čas leta do vrnitve na metišče; vzpon traja polovico tega."), M(v0 * GZ, "Iz v = v₀ − g t pri v = 0 sledi t = v₀/g: deli, ne množi.")], "s"),
          "Hitrost se vsako sekundo zmanjša za $g$; v najvišji točki je $v = 0$.",
          [dat("v_0", tx(v0), "m/s"), gD()],
          ["t"],
          ["v = v_0 - g t", "t = \\dfrac{v_0}{g} \\quad (v = 0)"],
          [`$0 = v_0 - g t \\;\\Rightarrow\\; t = \\dfrac{v_0}{g}$`, `$t = \\dfrac{${qty(tx(v0), "m/s")}}{${qty(G_TEX, "m/s^2")}} ${res(t, 2, "s")}$`],
        );
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Met navpično navzdol z višine: hitrost ob tleh.
          const h = r.dec(5, 50, 1);
          const v0 = r.int(2, 15);
          const v = Math.sqrt(v0 * v0 + 2 * GZ * h);
          return T(
            `${n} z razglednega stolpa, $${qty(tx(h), "m")}$ nad tlemi, vrže kamen navpično navzdol s hitrostjo $${qty(v0, "m/s")}$. S kolikšno hitrostjo kamen prileti na tla? ${noAir} Zaokroži na eno decimalko.`,
            num(v, 1, [M(v0 + Math.sqrt(2 * GZ * h), "Hitrosti ne seštevaš: v² = v₀² + 2gh, potem koren."), M(Math.sqrt(2 * GZ * h), "Upoštevaj tudi začetno hitrost v₀."), M(Math.sqrt(v0 * v0 + GZ * h), "V formuli je 2gh.")], "m/s"),
            "Uporabi $v^2 = v_0^2 + 2 g h$ (gibanje navzdol, pospešek v smeri gibanja).",
            [dat("h", tx(h), "m"), dat("v_0", v0, "m/s"), gD()],
            ["v"],
            "v^2 = v_0^2 + 2 g h",
            [`$v^2 = v_0^2 + 2 g h = ${v0 * v0}\\ \\mathrm{m^2/s^2} + 2 \\cdot ${G_TEX} \\cdot ${tx(h)}\\ \\mathrm{m^2/s^2} ${mid(v * v, 3, "m^2/s^2")}$`, `$v = \\sqrt{${txr(v * v, 3)}}\\ \\mathrm{m/s} ${res(v, 1, "m/s")}$`],
          );
        }
        if (k === 1) {
          // Obratno: iz časa leta do vrnitve višina meta.
          const t = r.dec(1, 6, 1);
          const v0 = (GZ * t) / 2;
          const h = (GZ * t * t) / 8;
          return T(
            `${n} vrže žogo navpično navzgor in jo čez $${qty(tx(t), "s")}$ ujame na isti višini, kot jo je ${g(n, "vrgel", "vrgla")}. Kako visoko nad roko se je dvignila žoga? ${noAir} Zaokroži na dve decimalki.`,
            num(h, 2, [M((GZ * t * t) / 2, "Vzpon traja le polovico celotnega časa leta."), M((GZ * t * t) / 4, "Vzpon traja t/2, zato je h = g (t/2)²/2."), M(v0, "To je začetna hitrost (m/s), ne višina.")], "m"),
            "Let je simetričen: vzpon traja polovico celotnega časa. Iz tega dobiš $v_0$ ali neposredno višino.",
            [dat("t", tx(t), "s"), gD()],
            ["h_{\\max}"],
            ["t_{\\text{vzpon}} = \\dfrac{t}{2}", "h_{\\max} = \\dfrac{g\\, t_{\\text{vzpon}}^2}{2}"],
            [`$t_{\\text{vzpon}} = \\dfrac{${qty(tx(t), "s")}}{2} = ${qty(tx(t / 2), "s")}$`, `$v_0 = g\\, t_{\\text{vzpon}} ${mid(v0, 3, "m/s")}$`, `$h_{\\max} = \\dfrac{g\\, t_{\\text{vzpon}}^2}{2} = \\dfrac{${G_TEX} \\cdot ${tx(t / 2)}^2}{2}\\ \\mathrm{m} ${res(h, 2, "m")}$`],
          );
        }
        // Pot v n-ti sekundi prostega pada.
        const k2 = r.int(2, 7);
        const ord = ["", "prvi", "drugi", "tretji", "četrti", "peti", "šesti", "sedmi"][k2];
        const dh = (GZ / 2) * (k2 * k2 - (k2 - 1) * (k2 - 1));
        const what = r.pick(["Kamen", "Kovanec", "Kroglica", "Ledena sveča"]);
        return T(
          `${what} prosto pada iz mirovanja z velike višine. Koliko metrov preleti v ${ord} sekundi padanja (med $t = ${k2 - 1}\\ \\mathrm{s}$ in $t = ${qty(k2, "s")}$)? ${noAir} Zaokroži na eno decimalko.`,
          num(dh, 1, [M((GZ * k2 * k2) / 2, "To je vsa pot v prvih t sekundah; odštej pot do začetka te sekunde."), M(GZ / 2, "To je pot v prvi sekundi; pozneje telo pade več, ker je hitrejše."), M(GZ * k2, "To je hitrost ob koncu sekunde, ne pot.")], "m"),
          "Izračunaj pot do konca te sekunde in pot do njenega začetka ter ju odštej.",
          [dat("t_1", k2 - 1, "s"), dat("t_2", k2, "s"), gD()],
          ["\\Delta h"],
          ["h(t) = \\dfrac{g t^2}{2}", "\\Delta h = h(t_2) - h(t_1)"],
          [`$h(${k2}\\ \\mathrm{s}) = \\dfrac{${G_TEX} \\cdot ${k2 * k2}}{2}\\ \\mathrm{m} ${mid((GZ * k2 * k2) / 2, 3, "m")}$`, `$h(${k2 - 1}\\ \\mathrm{s}) = \\dfrac{${G_TEX} \\cdot ${(k2 - 1) ** 2}}{2}\\ \\mathrm{m} ${mid((GZ * (k2 - 1) ** 2) / 2, 3, "m")}$`, `$\\Delta h = h(t_2) - h(t_1) ${res(dh, 1, "m")}$`],
        );
      }
      const k = r.int(0, 2);
      if (k === 0) {
        // Met z balkona navzgor ali navzdol: čas do tal (kvadratna enačba).
        const h0 = r.dec(5, 25, 1);
        const v0 = r.int(3, 15);
        const up = r.next() < 0.6;
        const disc = Math.sqrt(v0 * v0 + 2 * GZ * h0);
        const t = ((up ? v0 : -v0) + disc) / GZ;
        const other = ((up ? -v0 : v0) + disc) / GZ;
        return T(
          `${n} z balkona, $${qty(tx(h0), "m")}$ nad tlemi, vrže žogo navpično ${up ? "navzgor" : "navzdol"} s hitrostjo $${qty(v0, "m/s")}$. Čez koliko časa žoga pade na tla? ${noAir} Zaokroži na dve decimalki.`,
          num(t, 2, [M(other, up ? "To bi veljalo za met navzdol; žoga gre najprej navzgor." : "To bi veljalo za met navzgor; žoga gre takoj navzdol."), M(Math.sqrt((2 * h0) / GZ), "Upoštevaj tudi začetno hitrost žoge."), ...(up ? [M((2 * v0) / GZ, "To je čas do vrnitve na višino balkona; žoga mora pasti še do tal.")] : [])], "s"),
          `Postavi os navzgor z izhodiščem na tleh: $y(t) = h_0 ${up ? "+" : "-"} v_0 t - \\frac{1}{2} g t^2$ in reši $y = 0$.`,
          [dat("h_0", tx(h0), "m"), dat("v_0", v0, "m/s"), gD()],
          ["t"],
          [`y = h_0 ${up ? "+" : "-"} v_0 t - \\dfrac{g t^2}{2} = 0`, `t = \\dfrac{${up ? "" : "-"}v_0 + \\sqrt{v_0^2 + 2 g h_0}}{g}`],
          [`$\\dfrac{g}{2} t^2 ${up ? "-" : "+"} v_0 t - h_0 = 0$`, `$\\sqrt{v_0^2 + 2 g h_0} = \\sqrt{${v0 * v0} + 2 \\cdot ${G_TEX} \\cdot ${tx(h0)}}\\ \\mathrm{m/s} ${mid(disc, 3, "m/s")}$`, `$t = \\dfrac{${up ? "" : "-"}${v0} + ${txr(disc, 3)}}{${G_TEX}}\\ \\mathrm{s} ${res(t, 2, "s")}$ (pozitivna rešitev)`],
        );
      }
      if (k === 1) {
        // Globina vodnjaka iz časa do zvoka pljuska.
        const hTrue = r.int(12, 90);
        const T0 = roundHalfUp(Math.sqrt((2 * hTrue) / GZ) + hTrue / C_ZVOK, 2);
        const A = 1 / C_ZVOK;
        const B = Math.sqrt(2 / GZ);
        const u = (-B + Math.sqrt(B * B + 4 * A * T0)) / (2 * A);
        const h = u * u;
        return T(
          `${n} spusti kamen v vodnjak in pljusk zasliši $${qty(tx(T0), "s")}$ po tem, ko ga je ${g(n, "spustil", "spustila")}. Zvok potuje s hitrostjo $c = ${qty(C_ZVOK, "m/s")}$. Kako globoko je gladina vode? ${noAir} Zaokroži na eno decimalko.`,
          num(h, 1, [M((GZ * T0 * T0) / 2, "Izmerjeni čas obsega padanje kamna in pot zvoka navzgor."), M(C_ZVOK * T0, "Kamen ne pada s hitrostjo zvoka; čas je vsota časa padanja in časa zvoka.")], "m"),
          "Čas je vsota dveh delov: $t_1 = \\sqrt{2h/g}$ (pad) in $t_2 = h/c$ (zvok). Uvedi $u = \\sqrt{h}$ in dobiš kvadratno enačbo.",
          [dat("t", tx(T0), "s"), dat("c", C_ZVOK, "m/s"), gD()],
          ["h"],
          ["t = \\sqrt{\\dfrac{2 h}{g}} + \\dfrac{h}{c}", "u = \\sqrt{h}:\\quad \\dfrac{1}{c} u^2 + \\sqrt{\\dfrac{2}{g}}\\, u - t = 0"],
          [`$\\sqrt{\\dfrac{2 h}{g}} + \\dfrac{h}{c} = t$; z $u = \\sqrt{h}$: $\\dfrac{u^2}{${C_ZVOK}} + ${txr(B, 5)}\\, u - ${tx(T0)} = 0$`, `$u = \\dfrac{-${txr(B, 5)} + \\sqrt{${txr(B * B, 5)} + 4 \\cdot \\frac{1}{${C_ZVOK}} \\cdot ${tx(T0)}}}{2 / ${C_ZVOK}} ${mid(u, 4, "")}$`, `$h = u^2 ${res(h, 1, "m")}$`, `(Preverba: $t_1 ${mid(Math.sqrt((2 * h) / GZ), 3, "s")}$, $t_2 ${mid(h / C_ZVOK, 3, "s")}$.)`],
        );
      }
      // Kdaj je telo prvič na dani višini (navpični met navzgor).
      const v0 = r.int(10, 25);
      const hmax = (v0 * v0) / (2 * GZ);
      const h = roundHalfUp(r.dec(0.2, 0.9, 2) * hmax, 1);
      const disc = Math.sqrt(v0 * v0 - 2 * GZ * h);
      const t1 = (v0 - disc) / GZ;
      const t2 = (v0 + disc) / GZ;
      return T(
        `Raketico izstrelimo navpično navzgor z začetno hitrostjo $${qty(v0, "m/s")}$. Kdaj je prvič $${qty(tx(h), "m")}$ nad izstrelitvenim mestom? ${noAir} Zaokroži na dve decimalki.`,
        num(t1, 2, [M(t2, "To je drugič (na poti navzdol); vprašanje je prvič."), M(h / v0, "Hitrost se med vzponom zmanjšuje; uporabi y = v₀t − g t²/2."), M(v0 / GZ, "To je čas do najvišje točke.")], "s"),
        "Zapiši $h = v_0 t - \\frac{1}{2} g t^2$ in reši kvadratno enačbo; manjša rešitev je pot navzgor.",
        [dat("v_0", v0, "m/s"), dat("h", tx(h), "m"), gD()],
        ["t_1"],
        ["h = v_0 t - \\dfrac{g t^2}{2}", "t_{1,2} = \\dfrac{v_0 \\mp \\sqrt{v_0^2 - 2 g h}}{g}"],
        [`$\\dfrac{g}{2} t^2 - v_0 t + h = 0$`, `$\\sqrt{v_0^2 - 2 g h} = \\sqrt{${v0 * v0} - 2 \\cdot ${G_TEX} \\cdot ${tx(h)}}\\ \\mathrm{m/s} ${mid(disc, 3, "m/s")}$`, `$t_1 = \\dfrac{${v0} - ${txr(disc, 3)}}{${G_TEX}}\\ \\mathrm{s} ${res(t1, 2, "s")}$ (druga rešitev $t_2 ${mid(t2, 2, "s")}$ je na poti navzdol)`],
      );
    },
  },

  // ================= Newtonovi zakoni =================
  {
    id: "gim-newton-dop",
    topics: [T1("newtonovi-zakoni")],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const k = r.int(0, 2);
        if (k === 0) {
          // 1. zakon: stalna hitrost → vlečna sila = trenje → koeficient trenja.
          const m = r.int(10, 80);
          const kt = r.int(15, 60) / 100;
          const F = Math.round(kt * m * GZ);
          const kk = F / (m * GZ);
          return T(
            `${n} vleče zaboj z maso $${qty(m, "kg")}$ po vodoravnih tleh z vodoravno silo $${qty(F, "N")}$; zaboj se giblje s stalno hitrostjo. Kolikšen je koeficient trenja med zabojem in tlemi? Zaokroži na dve decimalki.`,
            num(kk, 2, [M(F / m, "Sila trenja je k·m·g: silo deli s težo, ne z maso."), M((m * GZ) / F, "Koeficient je sila trenja deljena s težo: k = F/(m g), ne obratno.")], null),
            "Stalna hitrost pomeni, da je rezultanta sil nič (1. Newtonov zakon): vlečna sila je enaka sili trenja.",
            [dat("m", m, "kg"), dat("F", F, "N"), gD()],
            ["k_{tr}"],
            ["F = F_{tr} = k_{tr} \\cdot m \\cdot g", "k_{tr} = \\dfrac{F}{m g}"],
            [`Stalna hitrost: $F_{tr} = F = ${qty(F, "N")}$`, `$m g = ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${mid(m * GZ, 2, "N")}$`, `$k_{tr} = \\dfrac{F}{m g} = \\dfrac{${F}}{${txr(m * GZ, 2)}} ${ap(kk, 2)} ${tx(kk, 2)}$`],
          );
        }
        if (k === 1) {
          // 1. zakon (pojem): stalna hitrost → upor enak vlečni sili.
          const v = r.int(50, 130);
          const F = r.int(30, 90) * 10;
          return T(
            `Avto vozi po ravni cesti s stalno hitrostjo $${qty(v, "km/h")}$. Vodoravna sila, s katero cesta poganja avto (vlečna sila), je $F = ${qty(F, "N")}$. Kaj velja za vsoto vseh uporov (zračni upor in kotalno trenje)?`,
            pickAns(r, `enaka je ${F} N in kaže nasprotno smeri vožnje`, [
              [`manjša je od ${F} N, sicer se avto ne bi gibal naprej`, "Za gibanje s stalno hitrostjo ni potrebna rezultanta: po 1. Newtonovem zakonu je rezultanta nič."],
              ["enaka je nič, ker se hitrost ne spreminja", "Nič je rezultanta sil, ne upor: vlečna sila in upor se izničita."],
              [`večja je od ${F} N, ker avto vozi hitro`, "Če bi bil upor večji od vlečne sile, bi avto zaviral."],
            ]),
            "Stalna hitrost pomeni pospešek nič. Kolikšna je potem rezultanta sil?",
            [dat("v", v, "km/h"), dat("F", F, "N")],
            ["F_{u}"],
            ["\\vec v = \\text{konst.} \\;\\Rightarrow\\; \\sum \\vec F = 0", "F - F_u = 0"],
            ["Hitrost je stalna, zato je $a = 0$ in $\\sum F = m a = 0$.", `$F - F_u = 0 \\;\\Rightarrow\\; F_u = F = ${qty(F, "N")}$`, "Upor kaže nasprotno smeri vožnje."],
          );
        }
        // 3. zakon: odriv na rolkah.
        const m1 = r.int(30, 90);
        let m2 = r.int(30, 90);
        if (m2 === m1) m2 += 7;
        const a1 = r.dec(0.3, 2, 2);
        const n2 = r.pick(NAMES.filter((x) => x !== n));
        const a2 = (m1 * a1) / m2;
        return T(
          `${n} ($${qty(m1, "kg")}$) in ${n2} ($${qty(m2, "kg")}$) stojita na rolkah in se odrineta ${g(n, "", "F") + g(n2, "", "F") === "FF" ? "druga od druge" : "drug od drugega"}. Med odrivanjem ima ${n} pospešek $${qty(tx(a1), "m/s^2")}$. Kolikšen je takrat pospešek, ki ga ima ${n2}? Trenje zanemari in zaokroži na dve decimalki.`,
          acc(a2, 2, [M(a1, "Sili sta enako veliki, pospeška pa ne: lažji dobi večji pospešek."), M((m2 * a1) / m1, "Iz m₁a₁ = m₂a₂ sledi a₂ = m₁a₁/m₂; pazi na vrstni red mas.")]),
          "Po 3. Newtonovem zakonu delujeta drug na drugega z enako velikima silama; uporabi $F = m a$ za vsakega.",
          [dat("m_1", m1, "kg"), dat("m_2", m2, "kg"), dat("a_1", tx(a1), "m/s^2")],
          ["a_2"],
          ["F_1 = F_2 \\;\\Rightarrow\\; m_1 a_1 = m_2 a_2", "a_2 = \\dfrac{m_1 a_1}{m_2}"],
          [`$F = m_1 a_1 = ${m1} \\cdot ${tx(a1)}\\ \\mathrm{N} ${mid(m1 * a1, 2, "N")}$`, `$a_2 = \\dfrac{F}{m_2} = \\dfrac{${txr(m1 * a1, 2)}\\ \\mathrm{N}}{${qty(m2, "kg")}} ${res(a2, 2, "m/s^2")}$`],
        );
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Tehtnica v dvigalu.
          const m = r.int(45, 95);
          const a = r.dec(0.5, 3, 1);
          const c = r.int(0, 3);
          const desc = ["se pelje navzgor in pospešuje", "se pelje navzdol in zavira", "se pelje navzgor in zavira", "se pelje navzdol in pospešuje"][c];
          const up = c < 2; // pospešek kaže navzgor
          const N = m * (GZ + (up ? a : -a));
          return T(
            `${n} z maso $${qty(m, "kg")}$ stoji na osebni tehtnici v dvigalu, ki ${desc} s pospeškom velikosti $${qty(tx(a), "m/s^2")}$. S kolikšno silo pritiska na tehtnico? Zaokroži na celo število.`,
            num(N, 0, [M(m * GZ, "Dvigalo pospešuje, zato sila podlage ni enaka teži."), M(m * (GZ + (up ? -a : a)), "Preveri smer pospeška: pri zaviranju kaže pospešek nasprotno hitrosti."), M(m * a, "Na človeka delujeta teža in sila tehtnice; teže ne izpusti.")], "N"),
            "Najprej ugotovi smer pospeška (pri zaviranju je nasprotna smeri gibanja), nato zapiši 2. Newtonov zakon za človeka.",
            [dat("m", m, "kg"), dat("a", tx(a), "m/s^2"), gD()],
            ["N"],
            [up ? "N - m g = m a" : "m g - N = m a", up ? "N = m (g + a)" : "N = m (g - a)"],
            [`Pospešek kaže ${up ? "navzgor" : "navzdol"}.`, `$${up ? "N - m g = m a \\;\\Rightarrow\\; N = m (g + a)" : "m g - N = m a \\;\\Rightarrow\\; N = m (g - a)"}$`, `$N = ${m} \\cdot (${G_TEX} ${up ? "+" : "-"} ${tx(a)})\\ \\mathrm{N} ${res(N, 0, "N")}$`, "Po 3. Newtonovem zakonu človek pritiska na tehtnico z enako veliko silo."],
          );
        }
        if (k === 1) {
          // Hokejski plošček: koeficient trenja iz poti do ustavitve.
          const v0 = r.dec(4, 12, 1);
          const kTrue = r.int(5, 15) / 100;
          const s = roundHalfUp((v0 * v0) / (2 * kTrue * GZ), 1);
          const a = (v0 * v0) / (2 * s);
          const kk = a / GZ;
          return T(
            `Hokejski plošček drsi po ledu z začetno hitrostjo $${qty(tx(v0), "m/s")}$ in se zaradi trenja ustavi po $${qty(tx(s), "m")}$. Kolikšen je koeficient trenja med ploščkom in ledom? Zaokroži na tri decimalke.`,
            num(kk, 3, [M((v0 * v0) / (GZ * s), "Iz v₀² = 2as sledi a = v₀²/(2s): ne pozabi faktorja 2."), M(a, "To je pojemek; koeficient dobiš, ko ga deliš z g."), M(v0 / (2 * GZ * s), "Hitrost moraš kvadrirati.")], null),
            "Najprej iz poti do ustavitve izračunaj pojemek, nato uporabi $F_{tr} = k_{tr} m g = m a$.",
            [dat("v_0", tx(v0), "m/s"), dat("s", tx(s), "m"), gD()],
            ["k_{tr}"],
            ["a = \\dfrac{v_0^2}{2 s}", "k_{tr} m g = m a \\;\\Rightarrow\\; k_{tr} = \\dfrac{a}{g}"],
            [`$a = \\dfrac{v_0^2}{2 s} = \\dfrac{(${qty(tx(v0), "m/s")})^2}{2 \\cdot ${qty(tx(s), "m")}} ${mid(a, 4, "m/s^2")}$`, `$k_{tr} m g = m a \\;\\Rightarrow\\; k_{tr} = \\dfrac{a}{g}$ (masa se pokrajša)`, `$k_{tr} = \\dfrac{${txr(a, 4)}}{${G_TEX}} ${ap(kk, 3)} ${tx(kk, 3)}$`],
          );
        }
        // Vlečenje pod kotom po gladki podlagi.
        const m = r.int(10, 60);
        const F = r.int(20, 150);
        const al = r.pick([20, 25, 30, 35, 40, 45, 50, 60]);
        const a = (F * Math.cos(rad(al))) / m;
        return T(
          `${n} vleče sani z maso $${qty(m, "kg")}$ po gladkem ledu (brez trenja) z vrvjo, ki oklepa z vodoravnico kot $${al}^\\circ$. Sila vrvi je $${qty(F, "N")}$. Kolikšen je pospešek sani? Zaokroži na dve decimalki.`,
          acc(a, 2, [M(F / m, "Sani pospešuje le vodoravna komponenta sile: F·cos α."), M((F * Math.sin(rad(al))) / m, "Vodoravna komponenta je F·cos α (kot merimo od vodoravnice)."), M(F * Math.cos(rad(al)) * m, "Pospešek je sila deljena z maso.")]),
          "Silo razstavi na vodoravno in navpično komponento; sani se gibljejo vodoravno.",
          [dat("m", m, "kg"), dat("\\alpha", `${al}^\\circ`, ""), dat("F", F, "N")],
          ["a"],
          ["F_x = F \\cos\\alpha", "a = \\dfrac{F_x}{m}"],
          [`$F_x = F \\cos\\alpha = ${F}\\ \\mathrm{N} \\cdot \\cos ${al}^\\circ ${mid(F * Math.cos(rad(al)), 2, "N")}$`, `$a = \\dfrac{F_x}{m} = \\dfrac{${txr(F * Math.cos(rad(al)), 2)}\\ \\mathrm{N}}{${qty(m, "kg")}} ${res(a, 2, "m/s^2")}$`],
        );
      }
      const k = r.int(0, 2);
      if (k === 0) {
        // Klada na mizi, povezana prek škripca z visečo utežjo; trenje na mizi.
        const m1 = r.dec(1, 5, 1);
        const kt = r.int(10, 40) / 100;
        const m2 = roundHalfUp(kt * m1 + r.dec(0.3, 2, 1), 1);
        const a = ((m2 - kt * m1) * GZ) / (m1 + m2);
        const askT = r.next() < 0.4;
        const intro = `Klada z maso $${qty(tx(m1), "kg")}$ leži na vodoravni mizi (koeficient trenja $${tx(kt)}$). Z lahko vrvjo prek škripca na robu mize je povezana z utežjo z maso $${qty(tx(m2), "kg")}$, ki prosto visi.`;
        const given = [dat("m_1", tx(m1), "kg"), dat("k_{tr}", tx(kt), ""), dat("m_2", tx(m2), "kg"), gD()];
        const s1 = `$(m_1 + m_2) a = m_2 g - k_{tr} m_1 g$`;
        const s2 = `$a = \\dfrac{(${tx(m2)} - ${tx(kt)} \\cdot ${tx(m1)}) \\cdot ${G_TEX}}{${tx(m1)} + ${tx(m2)}}\\ \\mathrm{m/s^2} ${askT ? mid(a, 4, "m/s^2") : res(a, 2, "m/s^2")}$`;
        if (askT) {
          const Tv = m2 * (GZ - a);
          return T(
            `${intro} Kolikšna je sila vrvi med gibanjem? Zaokroži na dve decimalki.`,
            num(Tv, 2, [M(m2 * GZ, "Utež pospešuje navzdol, zato je sila vrvi manjša od njene teže."), M(m2 * a, "Na utež delujeta teža in sila vrvi: m₂a = m₂g − F_v."), M(kt * m1 * GZ, "To je le sila trenja; klada tudi pospešuje.")], "N"),
            "Najprej izračunaj pospešek sistema, nato zapiši 2. Newtonov zakon samo za visečo utež.",
            given,
            ["F_v"],
            ["a = \\dfrac{(m_2 - k_{tr} m_1) g}{m_1 + m_2}", "m_2 a = m_2 g - F_v"],
            [s1, s2, `$F_v = m_2 (g - a) = ${tx(m2)} \\cdot (${G_TEX} - ${txr(a, 4)})\\ \\mathrm{N} ${res(Tv, 2, "N")}$`],
          );
        }
        return T(
          `${intro} Kolikšen je pospešek sistema? Zaokroži na dve decimalki.`,
          acc(a, 2, [M((m2 * GZ) / (m1 + m2), "Upoštevaj še silo trenja na kladi."), M(((m2 - kt * m1) * GZ) / m2, "Pospešujeta obe telesi: deli s skupno maso m₁ + m₂."), M(((m2 + kt * m1) * GZ) / (m1 + m2), "Trenje nasprotuje gibanju, zato ga odšteješ.")]),
          "Obravnavaj obe telesi skupaj: rezultanta je teža uteži minus trenje na kladi, pospešuje pa skupna masa.",
          given,
          ["a"],
          ["(m_1 + m_2) a = m_2 g - k_{tr} m_1 g", "a = \\dfrac{(m_2 - k_{tr} m_1) g}{m_1 + m_2}"],
          [s1, s2],
        );
      }
      if (k === 1) {
        // Klanec s trenjem.
        const al = r.pick([25, 30, 35, 40, 45, 50]);
        const kt = r.int(10, Math.min(40, Math.floor(Math.tan(rad(al)) * 100) - 10)) / 100;
        const a = GZ * (Math.sin(rad(al)) - kt * Math.cos(rad(al)));
        const what = r.pick(["Zaboj drsi", "Sani drsijo", "Smučar drsi", "Klada drsi"]);
        return T(
          `${what} po klancu z naklonom $${al}^\\circ$ navzdol. Koeficient trenja je $${tx(kt)}$. Kolikšen je pospešek? Zaokroži na dve decimalki.`,
          acc(a, 2, [M(GZ * Math.sin(rad(al)), "Upoštevaj še silo trenja."), M(GZ * (Math.sin(rad(al)) - kt), "Sila podlage na klancu je m g cos α, zato je trenje k·m·g·cos α."), M(GZ * (Math.cos(rad(al)) - kt * Math.sin(rad(al))), "Dinamična komponenta teže vzdolž klanca je m g sin α, pravokotno nanj m g cos α.")]),
          "Težo razstavi na komponento vzdolž klanca in pravokotno nanj; trenje je sorazmerno s silo podlage.",
          [dat("\\alpha", `${al}^\\circ`, ""), dat("k_{tr}", tx(kt), ""), gD()],
          ["a"],
          ["m a = m g \\sin\\alpha - k_{tr} m g \\cos\\alpha", "a = g (\\sin\\alpha - k_{tr} \\cos\\alpha)"],
          [`$F_\\parallel = m g \\sin\\alpha$, $N = m g \\cos\\alpha$, $F_{tr} = k_{tr} m g \\cos\\alpha$`, `$a = g (\\sin\\alpha - k_{tr} \\cos\\alpha) = ${G_TEX} \\cdot (${txr(Math.sin(rad(al)), 4)} - ${tx(kt)} \\cdot ${txr(Math.cos(rad(al)), 4)})\\ \\mathrm{m/s^2}$`, `$a ${res(a, 2, "m/s^2")}$`],
        );
      }
      // Dva zaboja, ki se dotikata: sila med njima.
      const m1 = r.int(2, 40);
      let m2 = r.int(2, 40);
      if (m2 === m1) m2 += 3;
      const F = r.int(20, 200);
      const a = F / (m1 + m2);
      const F12 = m2 * a;
      return T(
        `Na gladkih vodoravnih tleh (brez trenja) stojita drug ob drugem zaboja z masama $${qty(m1, "kg")}$ in $${qty(m2, "kg")}$. ${n} potiska prvi zaboj z vodoravno silo $${qty(F, "N")}$, ta pa potiska drugega. S kolikšno silo deluje prvi zaboj na drugega? Zaokroži na eno decimalko.`,
        num(F12, 1, [M(F, "Sila F pospešuje oba zaboja; na drugega deluje le del te sile."), M(m1 * a, "To je rezultanta na prvem zaboju; drugi zaboj pospešuje sila F₁₂ = m₂a."), M(F / 2, "Sila se ne razdeli na pol, ampak v razmerju mas.")], "N"),
        "Najprej izračunaj skupni pospešek obeh zabojev, nato 2. Newtonov zakon samo za drugi zaboj.",
        [dat("m_1", m1, "kg"), dat("m_2", m2, "kg"), dat("F", F, "N")],
        ["F_{12}"],
        ["a = \\dfrac{F}{m_1 + m_2}", "F_{12} = m_2 a"],
        [`$a = \\dfrac{F}{m_1 + m_2} = \\dfrac{${qty(F, "N")}}{${qty(m1 + m2, "kg")}} ${mid(a, 4, "m/s^2")}$`, `$F_{12} = m_2 a = ${m2} \\cdot ${txr(a, 4)}\\ \\mathrm{N} ${res(F12, 1, "N")}$`],
      );
    },
  },

  // ================= energija =================
  {
    id: "gim-energija-dop",
    topics: [T1("energija")],
    gen(level, r) {
      const n = ime(r);
      if (level === 1) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Prožnostna energija vzmeti.
          const c = r.pick([
            { what: "Vzmet v igrači", k0: 10, k1: 40, step: 10, x0: 3, x1: 12 },
            { what: "Vzmet na fizikalnem vozičku", k0: 5, k1: 20, step: 10, x0: 5, x1: 15 },
            { what: "Vzmet blažilca na gorskem kolesu", k0: 10, k1: 30, step: 500, x0: 2, x1: 8 },
            { what: "Vzmet v zapiralu vrat", k0: 20, k1: 80, step: 10, x0: 5, x1: 20 },
          ]);
          const kv = r.int(c.k0, c.k1) * c.step;
          const x = r.int(c.x0, c.x1) / 100;
          const W = (kv * x * x) / 2;
          const d = W < 1 ? 3 : 2;
          const what = c.what;
          return T(
            `${what} ima koeficient $k = ${qty(kv, "N/m")}$. Stisnemo jo za $x = ${qty(tx(x), "m")}$. Kolikšna je prožnostna energija stisnjene vzmeti? Zaokroži ${dw(d)}.`,
            num(W, d, [M(kv * x * x, "Pozabil si faktor ½ v formuli W_pr = k x²/2."), M((kv * x) / 2, "Skrček moraš kvadrirati."), M(kv * x, "To je sila vzmeti (N), ne energija.")], "J"),
            "Prožnostna energija je sorazmerna s kvadratom skrčka.",
            [dat("k", kv, "N/m"), dat("x", tx(x), "m")],
            ["W_{pr}"],
            "W_{pr} = \\dfrac{k x^2}{2}",
            [`$x^2 = (${qty(tx(x), "m")})^2 = ${qty(tx(x * x), "m^2")}$`, `$W_{pr} = \\dfrac{k x^2}{2} = \\dfrac{${kv} \\cdot ${tx(x * x)}}{2}\\ \\mathrm{J} ${res(W, d, "J")}$`],
          );
        }
        if (k === 1) {
          // Razmerje kinetičnih energij.
          const f = r.pick([1.5, 2, 2.5, 3, 4]);
          // Končna hitrost ostane stvarna za izbrano vozilo; pri f = 1,5 in 2,5 je v1 sod, da je v2 celo število.
          const [who, vmax] = r.pick([["avtomobila", 130], ["vlaka", 200], ["motorista", 140], ["kolesarja", 48]]);
          const v1max = Math.floor(vmax / f);
          let v1 = r.int(Math.max(6, Math.floor(v1max / 3)), v1max);
          if (!Number.isInteger(v1 * f)) v1 -= 1;
          const v2 = v1 * f;
          const q = (v2 / v1) ** 2;
          return T(
            `Hitrost ${who} se poveča z $v_1 = ${qty(v1, "km/h")}$ na $v_2 = ${qty(tx(v2), "km/h")}$. Kolikokrat večja je zdaj njegova kinetična energija?`,
            num(q, null, [M(f, "Kinetična energija ni sorazmerna s hitrostjo, ampak s kvadratom hitrosti."), M(2 * f, "Razmerje hitrosti kvadriraj, ne podvoji."), M(((v2 - v1) / v1) ** 2, "Kvadriraj razmerje hitrosti v₂/v₁, ne razlike.")], null),
            "Masa ostane enaka; zapiši razmerje $\\dfrac{W_{k2}}{W_{k1}}$ in pokrajšaj.",
            [dat("v_1", v1, "km/h"), dat("v_2", tx(v2), "km/h")],
            ["\\dfrac{W_{k2}}{W_{k1}}"],
            ["W_k = \\dfrac{m v^2}{2}", "\\dfrac{W_{k2}}{W_{k1}} = \\left(\\dfrac{v_2}{v_1}\\right)^2"],
            [`$\\dfrac{W_{k2}}{W_{k1}} = \\dfrac{m v_2^2 / 2}{m v_1^2 / 2} = \\left(\\dfrac{v_2}{v_1}\\right)^2$`, `$\\dfrac{v_2}{v_1} = \\dfrac{${tx(v2)}}{${v1}} = ${tx(f)}$`, `$\\left(${tx(f)}\\right)^2 = ${tx(q)}$`],
          );
        }
        // Pojem: ohranitev energije pri nihalu.
        const h = r.int(5, 40);
        const m = r.int(5, 20) * 10;
        const formB = r.next() < 0.5;
        const intro = `Kroglico nihala z maso $${qty(m, "g")}$ spustimo iz mirovanja v skrajni legi, ki je $h = ${qty(h, "cm")}$ nad najnižjo lego. Zračni upor zanemarimo.`;
        const common = { hint: "Mehanska energija $W_k + W_p$ se ohranja; v skrajni legi kroglica za hip miruje.", given: [dat("m", m, "g"), dat("h", h, "cm")], formula: ["W_k + W_p = \\text{konst.}", "W_p = m g h"] };
        if (formB) {
          return T(
            `${intro} Kako visoko nad najnižjo lego se kroglica dvigne na drugi strani?`,
            pickAns(r, `natanko ${h} cm`, [
              [`manj kot ${h} cm, ker se del energije porabi za hitrost`, "V skrajni legi na drugi strani je hitrost spet nič, zato je vsa energija spet potencialna."],
              [`več kot ${h} cm, ker v najnižji legi pridobi hitrost`, "Hitrost v najnižji legi dobi iz potencialne energije; več energije, kot jo je imela, ne more imeti."],
              [`${fmt(h / 2)} cm, ker se energija razdeli na kinetično in potencialno`, "V skrajni legi ni kinetične energije; vsota se ohranja, zato je potencialna enaka začetni."],
            ]),
            common.hint,
            common.given,
            ["h'"],
            common.formula,
            ["Brez izgub se mehanska energija ohranja.", `V obeh skrajnih legah je $W_k = 0$, zato $m g h' = m g h$.`, `$h' = h = ${qty(h, "cm")}$`],
          );
        }
        return T(
          `${intro} Kje ima kroglica največjo kinetično energijo?`,
          pickAns(r, "v najnižji legi, kjer je potencialna energija najmanjša", [
            ["v skrajni legi, kjer jo spustimo", "V skrajni legi kroglica za hip miruje, zato je W_k = 0."],
            ["povsod enako, ker se energija ohranja", "Ohranja se vsota W_k + W_p, ne vsak del posebej."],
            [`na polovici višine (${fmt(h / 2)} cm), kjer sta obe energiji enaki`, "Tam je W_k šele polovica največje; kroglica pospešuje vse do najnižje lege."],
          ]),
          common.hint,
          common.given,
          ["\\text{lega z največjo } W_k"],
          common.formula,
          ["$W_k + W_p = m g h$ (konstanta).", "$W_k = m g h - W_p$ je največja, kjer je $W_p$ najmanjša.", `To je najnižja lega: tam je $W_k = m g h$.`],
        );
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          // Vzmetna puška: prožnostna → kinetična (pretvorba cm, g).
          const kv = r.int(20, 150) * 10;
          const xc = r.int(2, 10);
          const mg = r.int(5, 50);
          const x = xc / 100;
          const m = mg / 1000;
          const v = x * Math.sqrt(kv / m);
          return T(
            `Vzmet igrače s koeficientom $${qty(kv, "N/m")}$ stisnemo za $${qty(xc, "cm")}$ in z njo izstrelimo kroglico z maso $${qty(mg, "g")}$ vodoravno. S kolikšno hitrostjo kroglica zapusti vzmet? Trenje zanemari in zaokroži na dve decimalki.`,
            num(v, 2, [M(x * Math.sqrt(kv / mg), "Maso pretvori v kilograme."), M(xc * Math.sqrt(kv / m), "Skrček pretvori v metre."), M((kv * x * x) / m, "To je v²; izračunati moraš še koren.")], "m/s"),
            "Vsa prožnostna energija vzmeti se pretvori v kinetično energijo kroglice; enote pretvori v m in kg.",
            [dat("k", kv, "N/m"), dat("x", xc, "cm"), dat("m", mg, "g")],
            ["v"],
            ["\\dfrac{k x^2}{2} = \\dfrac{m v^2}{2}", "v = x \\sqrt{\\dfrac{k}{m}}"],
            [`$x = ${qty(tx(x), "m")}$, $m = ${qty(tx(m), "kg")}$`, `$W_{pr} = \\dfrac{k x^2}{2} = \\dfrac{${kv} \\cdot ${tx(x * x)}}{2}\\ \\mathrm{J} ${mid((kv * x * x) / 2, 4, "J")}$`, `$v = \\sqrt{\\dfrac{2 W_{pr}}{m}} = x \\sqrt{\\dfrac{k}{m}} = ${tx(x)} \\cdot \\sqrt{\\dfrac{${kv}}{${tx(m)}}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`],
          );
        }
        if (k === 1) {
          // Sani: koliko mehanske energije se pretvori v notranjo (delo trenja).
          const m = r.int(20, 90);
          const h = r.dec(3, 25, 1);
          const vmax = Math.sqrt(2 * GZ * h);
          const v = roundHalfUp(r.dec(0.35, 0.85, 2) * vmax, 1);
          const Wp = m * GZ * h;
          const Wk = (m * v * v) / 2;
          return T(
            `${n} se s sanmi (skupna masa $${qty(m, "kg")}$) spusti iz mirovanja z vrha hriba, ki je $${qty(tx(h), "m")}$ višje od vznožja. Ob vznožju ima hitrost $${qty(tx(v), "m/s")}$. Koliko mehanske energije se je zaradi trenja in upora pretvorilo v notranjo energijo? Zaokroži na celo število.`,
            num(Wp - Wk, 0, [M(Wp, "To je vsa začetna energija; del je ostal kot kinetična energija."), M(Wk, "To je kinetična energija ob vznožju, ne izguba."), M(Wp - m * v * v, "Pozabil si faktor ½ pri kinetični energiji.")], "J"),
            "Izguba je razlika med začetno potencialno in končno kinetično energijo.",
            [dat("m", m, "kg"), dat("h", tx(h), "m"), dat("v", tx(v), "m/s"), gD()],
            ["\\Delta W"],
            ["W_p = m g h", "W_k = \\dfrac{m v^2}{2}", "\\Delta W = W_p - W_k"],
            [`$W_p = m g h = ${m} \\cdot ${G_TEX} \\cdot ${tx(h)}\\ \\mathrm{J} ${mid(Wp, 2, "J")}$`, `$W_k = \\dfrac{m v^2}{2} = \\dfrac{${m} \\cdot ${tx(v)}^2}{2}\\ \\mathrm{J} ${mid(Wk, 2, "J")}$`, `$\\Delta W = W_p - W_k ${res(Wp - Wk, 0, "J")}$`],
          );
        }
        // Hitrost na dani višini pri poševnem metu (smer ni pomembna).
        const v0 = r.int(8, 25);
        const hmax = (v0 * v0) / (2 * GZ);
        const h = roundHalfUp(r.dec(0.15, 0.85, 2) * hmax, 1);
        const al = r.pick([30, 40, 50, 60, 70]);
        const v = Math.sqrt(v0 * v0 - 2 * GZ * h);
        return T(
          `${n} vrže kamen s hitrostjo $${qty(v0, "m/s")}$ poševno navzgor pod kotom $${al}^\\circ$. Kolikšna je hitrost kamna, ko je $${qty(tx(h), "m")}$ nad metiščem? Zračni upor zanemari. Zaokroži na dve decimalki.`,
          num(v, 2, [M(Math.sqrt(v0 * v0 + 2 * GZ * h), "Kamen se dviga, zato se kinetična energija zmanjšuje: v² = v₀² − 2gh."), M(v0 - Math.sqrt(2 * GZ * h), "Energije odštevaš, hitrosti ne: najprej v², potem koren."), M(Math.sqrt(v0 * v0 - GZ * h), "Iz m v₀²/2 = m v²/2 + m g h sledi v² = v₀² − 2gh.")], "m/s"),
          "Uporabi ohranitev mehanske energije; smer meta (kot) pri tem ni pomembna.",
          [dat("v_0", v0, "m/s"), dat("h", tx(h), "m"), gD()],
          ["v"],
          ["\\dfrac{m v_0^2}{2} = \\dfrac{m v^2}{2} + m g h", "v = \\sqrt{v_0^2 - 2 g h}"],
          [`$\\dfrac{m v_0^2}{2} = \\dfrac{m v^2}{2} + m g h \\;\\Rightarrow\\; v^2 = v_0^2 - 2 g h$ (masa in kot ne vplivata)`, `$v^2 = ${v0 * v0} - 2 \\cdot ${G_TEX} \\cdot ${tx(h)} ${mid(v * v, 3, "m^2/s^2")}$`, `$v = \\sqrt{${txr(v * v, 3)}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`],
        );
      }
      const k = r.int(0, 2);
      if (k === 0) {
        // Utež pade na vzmet: največji skrček (kvadratna enačba).
        const m = r.dec(0.2, 3, 1);
        const h = r.int(10, 100) / 100;
        const kv = r.int(20, 300) * 10;
        const mg = m * GZ;
        const x = (mg + Math.sqrt(mg * mg + 2 * kv * mg * h)) / kv;
        return T(
          `Utež z maso $${qty(tx(m), "kg")}$ spustimo z višine $${qty(tx(h), "m")}$ nad navpično vzmetjo s koeficientom $${qty(kv, "N/m")}$. Za koliko centimetrov se vzmet največ skrči? Zaokroži na eno decimalko.`,
          num(x * 100, 1, [M(Math.sqrt((2 * mg * h) / kv) * 100, "Med stiskanjem vzmeti utež pade še za x, zato je izguba W_p enaka m g (h + x)."), M(x, "Rezultat je v metrih; pretvori ga v centimetre."), M(((mg + Math.sqrt(mg * mg + kv * mg * h)) / kv) * 100, "Iz m g (h + x) = k x²/2 dobiš k x² − 2 m g x − 2 m g h = 0.")], "cm"),
          "Ko je vzmet najbolj stisnjena, utež miruje; utež pade skupno za $h + x$.",
          [dat("m", tx(m), "kg"), dat("h", tx(h), "m"), dat("k", kv, "N/m"), gD()],
          ["x\\ [\\mathrm{cm}]"],
          ["m g (h + x) = \\dfrac{k x^2}{2}", "x = \\dfrac{m g + \\sqrt{(m g)^2 + 2 k m g h}}{k}"],
          [`$m g (h + x) = \\dfrac{k x^2}{2} \\;\\Rightarrow\\; k x^2 - 2 m g x - 2 m g h = 0$`, `$m g = ${tx(m)} \\cdot ${G_TEX}\\ \\mathrm{N} ${mid(mg, 3, "N")}$`, `$x = \\dfrac{m g + \\sqrt{(m g)^2 + 2 k m g h}}{k} ${mid(x, 4, "m")}$ (pozitivna rešitev)`, `$x ${res(x * 100, 1, "cm")}$`],
        );
      }
      if (k === 1) {
        // Vzmet izstreli klado po hrapavi podlagi: pot do ustavitve.
        const kv = r.int(20, 150) * 10;
        const xc = r.int(3, 15);
        const m = r.dec(0.2, 2, 1);
        const kt = r.int(10, 50) / 100;
        const x = xc / 100;
        const s = (kv * x * x) / (2 * kt * m * GZ);
        return T(
          `Klado z maso $${qty(tx(m), "kg")}$ potisnemo ob vzmet s koeficientom $${qty(kv, "N/m")}$ in vzmet stisnemo za $${qty(xc, "cm")}$. Ko klado spustimo, jo vzmet požene po vodoravni podlagi s koeficientom trenja $${tx(kt)}$. Koliko poti opravi klada do ustavitve (od začetne lege)? Zaokroži na dve decimalki.`,
          num(s, 2, [M((kv * xc * xc) / (2 * kt * m * GZ), "Skrček pretvori v metre."), M((kv * x * x) / (2 * kt * m), "Sila trenja je k_tr·m·g: ne pozabi g."), M((kv * x * x) / (kt * m * GZ), "Prožnostna energija je k x²/2.")], "m"),
          "Vsa prožnostna energija se porabi za delo proti trenju: $W_{pr} = F_{tr} \\cdot s$.",
          [dat("m", tx(m), "kg"), dat("k", kv, "N/m"), dat("x", xc, "cm"), dat("k_{tr}", tx(kt), ""), gD()],
          ["s"],
          ["\\dfrac{k x^2}{2} = k_{tr} m g s", "s = \\dfrac{k x^2}{2 k_{tr} m g}"],
          [`$W_{pr} = \\dfrac{k x^2}{2} = \\dfrac{${kv} \\cdot ${tx(x)}^2}{2}\\ \\mathrm{J} ${mid((kv * x * x) / 2, 4, "J")}$`, `$F_{tr} = k_{tr} m g = ${tx(kt)} \\cdot ${tx(m)} \\cdot ${G_TEX}\\ \\mathrm{N} ${mid(kt * m * GZ, 4, "N")}$`, `$s = \\dfrac{W_{pr}}{F_{tr}} ${res(s, 2, "m")}$`],
        );
      }
      // Nihalo: hitrost v najnižji legi iz kota odklona.
      const l = r.dec(0.5, 3, 1);
      const al = r.pick([20, 25, 30, 35, 40, 45, 50, 60, 70]);
      const hh = l * (1 - Math.cos(rad(al)));
      const v = Math.sqrt(2 * GZ * hh);
      return T(
        `Nitno nihalo z dolžino $${qty(tx(l), "m")}$ odklonimo za kot $${al}^\\circ$ od navpičnice in spustimo iz mirovanja. Kolikšna je hitrost kroglice v najnižji legi? Zračni upor zanemari. Zaokroži na dve decimalki.`,
        num(v, 2, [M(Math.sqrt(2 * GZ * l), "Kroglica ne pade za vso dolžino niti: h = l (1 − cos α)."), M(Math.sqrt(2 * GZ * l * Math.cos(rad(al))), "Višinska razlika je l − l cos α, ne l cos α."), M(Math.sqrt(2 * GZ * l * Math.sin(rad(al))), "Kot merimo od navpičnice: višinska razlika je l (1 − cos α).")], "m/s"),
        "Najprej iz skice določi, za koliko je skrajna lega višje od najnižje: $h = l - l\\cos\\alpha$.",
        [dat("l", tx(l), "m"), dat("\\alpha", `${al}^\\circ`, ""), gD()],
        ["v"],
        ["h = l (1 - \\cos\\alpha)", "m g h = \\dfrac{m v^2}{2} \\;\\Rightarrow\\; v = \\sqrt{2 g h}"],
        [`$h = l (1 - \\cos\\alpha) = ${tx(l)} \\cdot (1 - \\cos ${al}^\\circ)\\ \\mathrm{m} ${mid(hh, 4, "m")}$`, `$v = \\sqrt{2 g h} = \\sqrt{2 \\cdot ${G_TEX} \\cdot ${txr(hh, 4)}}\\ \\mathrm{m/s} ${res(v, 2, "m/s")}$`],
      );
    },
  },
];

function sgn(v) {
  return v < 0 ? "-" : "+";
}

export const GIMNAZIJA_FIZ_SS1 = wrapGens(GENS);
