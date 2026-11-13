// Naloge za teme fizike in kemije, dodane po primerjavi z učnimi načrti (2026-10-30): fizika v sodobnih
// napravah (OŠ 9), prožnost, navor, prevajanje toplote in sevanje, izmenični tok, elektromagnetno valovanje,
// astronomija (gimnazija), elementi v periodnem sistemu in dušikove organske spojine (gimnazija).
// Merila: docs/kakovost.md §2. Vsak odgovor je izračunan v kodi iz istih števil, kot so v besedilu;
// konstante so zapisane v besedilu naloge.
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { lv, tt, tx, dat, res, dw, M, num, choice, T, sortiraj } from "./vrzeli-util.js";

const zaok = (d) => ` Rezultat zaokroži ${dw(d)}.`;
const PI = Math.PI;
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

// ------------------------------------------------------------ konstante (zapis v besedilu = zapis v podatkih)
const GZ = 9.81;
const G_DAT = dat("g", "9{,}81", "m/s²");
const C0 = 3e8;
const C_DAT = dat("c", "3{,}00 \\cdot 10^8", "m/s");
const CKM_DAT = dat("c", "300\\,000", "km/s");
const SIG = 5.67e-8;
const SIG_DAT = dat("\\sigma", "5{,}67 \\cdot 10^{-8}", "W/(m²\\,K⁴)");
const GRAV = 6.67e-11;
const GRAV_DAT = dat("G", "6{,}67 \\cdot 10^{-11}", "N\\,m²/kg²");
const MZ = 5.97e24;
const MZ_DAT = dat("M_{\\text{Z}}", "5{,}97 \\cdot 10^{24}", "kg");
const RZ = 6370;
const RZ_DAT = dat("R_{\\text{Z}}", "6370", "km");
const WIEN = 2.9e-3;
const WIEN_DAT = dat("k_{\\text{W}}", "2{,}90 \\cdot 10^{-3}", "m\\,K");
const TSUN = 5780;
const TSUN_DAT = dat("T_{\\odot}", "5780", "K");
const LSUN = 3.83e26;
const LSUN_DAT = dat("L_{\\odot}", "3{,}83 \\cdot 10^{26}", "W");
const AU = 1.5e11;
const AU_DAT = dat("1\\ \\text{a. e.}", "1{,}50 \\cdot 10^{11}", "m");
const LY = 9.46e15;
const LY_DAT = dat("1\\ \\text{sv. l.}", "9{,}46 \\cdot 10^{15}", "m");
const VM = 22.4;
const VM_DAT = dat("V_{\\text{m}}", "22{,}4", "L/mol");
const $ = (s) => `$${s}$`;
// znanstveni zapis s tremi veljavnimi mestami: vrne vrednost, kot je zapisana, in zapis
function sci3(x) {
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = roundHalfUp(x / 10 ** e, 2);
  if (m >= 10) (m /= 10), e++;
  return { v: m * 10 ** e, t: e === 0 ? tx(m, 2) : `${tx(m, 2)} \\cdot 10^{${e}}` };
}
// število decimalk, da ostanejo tri veljavna mesta (za majhna števila)
const sig3 = (x) => Math.max(0, 2 - Math.floor(Math.log10(Math.abs(x))));

// ------------------------------------------------------------ kemija: relativne atomske mase in formule
const AR = { H: 1.01, Li: 6.94, Be: 9.01, B: 10.81, C: 12.01, N: 14.01, O: 16.0, F: 19.0, Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08, Fe: 55.85, Co: 58.93, Br: 79.9, I: 126.9 };
// "Ca5(PO4)3OH" → { Ca: 5, P: 3, O: 13, H: 1 }; flat = true: prezre indeks za oklepajem (tipična napaka)
function atoms(f, flat = false) {
  let i = 0;
  const count = () => {
    let s = "";
    while (i < f.length && /\d/.test(f[i])) s += f[i++];
    return s ? +s : 1;
  };
  const group = () => {
    const c = {};
    while (i < f.length && f[i] !== ")") {
      let sub;
      if (f[i] === "(") {
        i++;
        sub = group();
        i++;
      } else {
        const m = f.slice(i).match(/^[A-Z][a-z]?/);
        i += m[0].length;
        sub = { [m[0]]: 1 };
      }
      const n = f[i - 1] === ")" && flat ? (count(), 1) : count();
      for (const [k, v] of Object.entries(sub)) c[k] = (c[k] || 0) + v * n;
    }
    return c;
  };
  return group();
}
const molar = (f) => Object.entries(atoms(f)).reduce((s, [k, n]) => s + AR[k] * n, 0);
const ftex = (f) => `\\mathrm{${f.replace(/\d+/g, (d) => (d.length > 1 ? `_{${d}}` : `_${d}`))}}`;
const arList = (els) => els.map((e) => `A_r(\\mathrm{${e}}) = ${tx(AR[e], 2)}`);
const arText = (els) => arList(els).map($).join(", ");
const molarSteps = (f) => {
  const a = atoms(f);
  return `$M(${ftex(f)}) = ${Object.entries(a).map(([k, n]) => (n > 1 ? `${n} \\cdot ${tx(AR[k], 2)}` : tx(AR[k], 2))).join(" + ")} = ${tx(molar(f), 2)}\\ \\mathrm{g/mol}$`;
};

// ============================================================ generatorji
export const DODATNE_VRZELI_FIZ_KEM = [
  // ------------------------------------------------------------ OŠ 9: fizika v sodobnih napravah
  {
    id: "vrz-naprave",
    topics: ["FIZ-OS-9/fizika-v-sodobnih-napravah"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 3);
      if (k === 3 || (level === 1 && k === 0)) return sortiraj("naprave", level, r);
      if (level === 1 && k === 1) {
        const Pin = 50 * r.int(4, 20), eta = r.int(12, 23), Pout = (Pin * eta) / 100;
        const G = [dat("P_{\\text{vh}}", tx(Pin), "W"), dat("P_{\\text{el}}", tx(Pout), "W")];
        return T(
          `Na sončno celico pada svetloba z močjo ${$(G[0])}. Celica daje električno moč ${$(G[1])}. Kolikšen je izkoristek celice v odstotkih?`,
          num(eta, "%", null, [M((Pin / Pout) * 100, "Obrnil si razmerje: koristno (električno) moč deliš s prejeto."), M(Pout / Pin, "Razmerje pomnoži s 100 %, da dobiš odstotke.")]),
          "Izkoristek je razmerje med koristno (električno) močjo in močjo svetlobe, ki pade na celico.",
          G, ["\\eta"],
          "\\eta = \\dfrac{P_{\\text{el}}}{P_{\\text{vh}}} \\cdot 100\\ \\%",
          [`$\\eta = \\dfrac{${tx(Pout)}\\ \\mathrm{W}}{${tx(Pin)}\\ \\mathrm{W}} \\cdot 100\\ \\% = ${eta}\\ \\%$`, "Preostanek svetlobe se večinoma spremeni v notranjo energijo celice (celica se segreje)."],
        );
      }
      if (level === 1) {
        const t = r.int(66, 89), s = 300 * t;
        const G = [dat("t", tx(t), "ms"), CKM_DAT];
        return T(
          `Radijski signal s satelita GPS pripotuje do sprejemnika v času ${$(G[0])}. Signal potuje s svetlobno hitrostjo ${$(G[1])}. Koliko kilometrov je satelit oddaljen od sprejemnika?`,
          num(s, "km", null, [M(300000 * t, "Milisekunde pretvori v sekunde: 1 ms = 0,001 s."), M(s / 2, "Signal potuje le od satelita do sprejemnika, zato ne deliš z 2.")]),
          "Čas pretvori v sekunde in uporabi s = c · t.",
          G, ["s"], "s = c\\,t",
          [`$t = ${t}\\ \\mathrm{ms} = ${tx(t / 1000)}\\ \\mathrm{s}$`, `$s = c\\,t = 300\\,000\\ \\mathrm{km/s} \\cdot ${tx(t / 1000)}\\ \\mathrm{s} = ${tx(s)}\\ \\mathrm{km}$`],
        );
      }
      if (level === 2 && k === 0) {
        const S = r.pick([1.6, 1.8, 2, 2.5, 8, 10, 12, 15]), eta = r.int(15, 22), j = r.pick([800, 900, 1000]);
        const P = (eta / 100) * j * S;
        const G = [dat("S", tx(S), "m²"), dat("j", tx(j), "W/m²"), dat("\\eta", tx(eta), "%")];
        return T(
          `Sončni paneli na strehi imajo površino ${$(G[0])}. Na vsak kvadratni meter panelov pada svetloba z močjo ${$(G[1])}. Izkoristek panelov je ${$(G[2])}. Kolikšno električno moč dajejo paneli?${zaok(0)}`,
          num(P, "W", 0, [M(j * S, "Upoštevaj izkoristek: v električno energijo se pretvori le del svetlobe."), M(eta * j * S, "Izkoristek v odstotkih deli s 100.")]),
          "Najprej izračunaj moč svetlobe, ki pade na vse panele, nato upoštevaj izkoristek.",
          G, ["P_{\\text{el}}"],
          ["P_{\\text{vh}} = j\\,S", "P_{\\text{el}} = \\eta\\,P_{\\text{vh}}"],
          [`$P_{\\text{vh}} = j\\,S = ${tx(j)}\\ \\mathrm{W/m^2} \\cdot ${tx(S)}\\ \\mathrm{m^2} = ${tx(j * S)}\\ \\mathrm{W}$`, `$P_{\\text{el}} = ${tx(eta / 100)} \\cdot ${tx(j * S)}\\ \\mathrm{W} ${res(P, 0, "W")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const P = r.pick([1.5, 2, 2.4, 3, 3.6, 4.5, 5]), t = r.int(3, 9), E = P * t;
        const G = [dat("P", tx(P), "kW"), dat("t", tx(t), "h")];
        if (r.int(0, 1)) {
          return T(
            `Sončna elektrarna na strehi hiše dela s povprečno močjo ${$(G[0])} v času ${$(G[1])} na dan. Koliko kilovatnih ur električne energije da v enem dnevu?`,
            num(E, "kWh", null, [M(E * 1000, "Moč je že v kilovatih, zato energija pride v kWh brez množenja s 1000."), M(P / t, "Energija je produkt moči in časa, ne količnik.")]),
            "Energija je moč, pomnožena s časom. Kilovat krat ura je kilovatna ura.",
            G, ["E"], "E = P\\,t",
            [`$E = P\\,t = ${tx(P)}\\ \\mathrm{kW} \\cdot ${t}\\ \\mathrm{h} = ${tx(E)}\\ \\mathrm{kWh}$`, `To je ${tx(E * 3.6)} MJ, saj je 1 kWh = 3,6 MJ.`],
          );
        }
        const use = Math.ceil(E * r.pick([1.2, 1.5, 2, 2.5])), pct = (E / use) * 100;
        const G2 = [...G, dat("E_{\\text{p}}", tx(use), "kWh")];
        return T(
          `Sončna elektrarna na strehi dela s povprečno močjo ${$(G[0])} v času ${$(G[1])} na dan. Gospodinjstvo porabi na dan ${$(G2[2])} električne energije. Koliko odstotkov dnevne porabe pokrije elektrarna?${zaok(0)}`,
          num(pct, "%", 0, [M(E / use, "Razmerje pomnoži s 100 %."), M((use / E) * 100, "Obrnil si razmerje: pridobljeno energijo deliš s porabo.")]),
          "Izračunaj, koliko energije da elektrarna v enem dnevu, in jo primerjaj s porabo.",
          G2, ["\\text{delež}"], ["E = P\\,t", "\\text{delež} = \\dfrac{E}{E_{\\text{p}}} \\cdot 100\\ \\%"],
          [`$E = ${tx(P)}\\ \\mathrm{kW} \\cdot ${t}\\ \\mathrm{h} = ${tx(E)}\\ \\mathrm{kWh}$`, `$\\text{delež} = \\dfrac{${tx(E)}}{${use}} \\cdot 100\\ \\% ${res(pct, 0, "%")}$`],
        );
      }
      if (level === 2) {
        const t = r.pick([2.5, 2.52, 2.54, 2.56, 2.58, 2.6, 2.62, 2.66, 2.7]), d = Math.round(150000 * t);
        const G = [dat("t", tx(t, 2), "s"), CKM_DAT];
        return T(
          `Astronomi usmerijo laserski žarek proti zrcalu, ki so ga astronavti pustili na Luni. Odbiti žarek se vrne po času ${$(G[0])}. Svetloba potuje s hitrostjo ${$(G[1])}. Koliko kilometrov je do Lune?`,
          num(d, "km", null, [M(2 * d, "Žarek prepotuje pot do Lune in nazaj, zato pot deliš z 2.")]),
          "Svetloba v izmerjenem času prepotuje dvojno razdaljo.",
          G, ["d"], "d = \\dfrac{c\\,t}{2}",
          [`$2d = c\\,t = 300\\,000\\ \\mathrm{km/s} \\cdot ${tx(t, 2)}\\ \\mathrm{s} = ${tx(2 * d)}\\ \\mathrm{km}$`, `$d = ${tx(d)}\\ \\mathrm{km}$`],
        );
      }
      if (k === 0) {
        const dt = 5 * r.int(2, 30), ds = (3 * dt) / 10;
        const G = [dat("\\Delta t", tx(dt), "ns"), C_DAT];
        return T(
          `Ura na satelitu GPS se zmoti za ${$(G[0])}. Signal potuje s hitrostjo ${$(G[1])}. Za koliko metrov se zato zmoti izračunana razdalja do satelita?`,
          num(ds, "m", null, [M(ds * 1000, "1 ns = 10⁻⁹ s, ne 10⁻⁶ s."), M(ds / 2, "Signal potuje le v eno smer, zato ne deliš z 2.")]),
          "Napačen čas pomeni napačno pot: v času Δt signal prepotuje c · Δt.",
          G, ["\\Delta s"], "\\Delta s = c\\,\\Delta t",
          [`$\\Delta t = ${dt}\\ \\mathrm{ns} = ${dt} \\cdot 10^{-9}\\ \\mathrm{s}$`, `$\\Delta s = 3{,}00 \\cdot 10^8\\ \\mathrm{m/s} \\cdot ${dt} \\cdot 10^{-9}\\ \\mathrm{s} = ${tx(ds)}\\ \\mathrm{m}$`, "Zato morajo biti ure na satelitih izjemno natančne (atomske ure)."],
        );
      }
      if (k === 1) {
        const Pel = r.pick([600, 700, 1000, 1200, 1600]), eta = r.int(32, 37), Pth = Pel / (eta / 100), waste = r.int(0, 1);
        const G = [dat("P_{\\text{el}}", tx(Pel), "MW"), dat("\\eta", tx(eta), "%")];
        const ans = waste ? Pth - Pel : Pth;
        return T(
          `Jedrska elektrarna oddaja v omrežje električno moč ${$(G[0])}. Izkoristek pretvorbe toplote iz reaktorja v električno energijo je ${$(G[1])}. ${waste ? "Kolikšno toplotno moč elektrarna odda okolici (reki ali zraku v hladilnem stolpu)?" : "Kolikšna je toplotna moč reaktorja?"}${zaok(0)}`,
          num(ans, "MW", 0, waste ? [M(Pth, "To je vsa toplotna moč reaktorja; odšteti moraš še električno moč."), M(Pel * (1 - eta / 100), "Električna moč je le del toplotne: najprej izračunaj toplotno moč P_el/η.")] : [M((Pel * eta) / 100, "Toplotna moč reaktorja je večja od električne: deliš z izkoristkom."), M(Pel / eta, "Izkoristek v odstotkih deli s 100.")]),
          "Električna moč je le del (η) toplotne moči reaktorja. Ostalo gre v okolico.",
          G, [waste ? "P_{\\text{okolica}}" : "P_{\\text{t}}"],
          waste ? ["P_{\\text{t}} = \\dfrac{P_{\\text{el}}}{\\eta}", "P_{\\text{okolica}} = P_{\\text{t}} - P_{\\text{el}}"] : "P_{\\text{t}} = \\dfrac{P_{\\text{el}}}{\\eta}",
          [`$P_{\\text{t}} = \\dfrac{${Pel}\\ \\mathrm{MW}}{${tx(eta / 100)}} ${res(Pth, Number.isInteger(roundHalfUp(Pth, 6)) ? 0 : 1, "MW")}$`, ...(waste ? [`$P_{\\text{okolica}} = ${tx(Pth, Number.isInteger(roundHalfUp(Pth, 6)) ? 0 : 1)}\\ \\mathrm{MW} - ${Pel}\\ \\mathrm{MW} ${res(ans, 0, "MW")}$`] : [`Zaokroženo: $${tx(Pth, 0)}\\ \\mathrm{MW}$`])],
        );
      }
      const P = r.pick([3, 4, 5, 6, 8, 10]), eta = r.int(15, 22), S = (P * 100) / eta;
      const G = [dat("P_{\\text{el}}", tx(P), "kW"), dat("j", "1000", "W/m²"), dat("\\eta", tx(eta), "%")];
      return T(
        `Hiša potrebuje električno moč ${$(G[0])}. Na vsak kvadratni meter sončnih panelov pada svetloba z močjo ${$(G[1])}, izkoristek panelov je ${$(G[2])}. Kolikšna mora biti površina panelov?${zaok(1)}`,
        num(S, "m²", 1, [M(P, "Upoštevaj izkoristek: električne moči je manj kot moči svetlobe."), M(S / 100, "Izkoristek v odstotkih deli s 100.")], { unitAlternatives: ["m2", "m^2"] }),
        "Iz zahtevane električne moči in izkoristka izračunaj, koliko moči svetlobe potrebuješ; nato deli z močjo na kvadratni meter.",
        G, ["S"], ["P_{\\text{vh}} = \\dfrac{P_{\\text{el}}}{\\eta}", "S = \\dfrac{P_{\\text{vh}}}{j}"],
        [`$P_{\\text{vh}} = \\dfrac{${P}\\,000\\ \\mathrm{W}}{${tx(eta / 100)}} ${res(P * 1000 / (eta / 100), 0, "W")}$`, `$S = \\dfrac{P_{\\text{vh}}}{j} ${res(S, 1, "m²")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 1: navor in ravnovesje
  {
    id: "vrz-navor",
    topics: ["FIZ-SS-1/navor-in-ravnovesje"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k === 0) {
        const F = 5 * r.int(2, 40), rc = r.int(10, 60), Mo = (F * rc) / 100;
        const G = [dat("F", tx(F), "N"), dat("r", tx(rc), "cm")];
        return T(
          `Z ključem privijamo vijak. Na ročico delujemo s silo ${$(G[0])}, ki je pravokotna na ročico, na razdalji ${$(G[1])} od osi vijaka. Kolikšen je navor sile?`,
          num(Mo, "N m", null, [M(F * rc, "Ročico pretvori v metre: 1 cm = 0,01 m."), M(F / (rc / 100), "Navor je produkt sile in ročice, ne količnik.")]),
          "Navor sile, ki je pravokotna na ročico, je sila krat ročica (v metrih).",
          G, ["M"], "M = F\\,r",
          [`$r = ${rc}\\ \\mathrm{cm} = ${tx(rc / 100)}\\ \\mathrm{m}$`, `$M = F\\,r = ${F}\\ \\mathrm{N} \\cdot ${tx(rc / 100)}\\ \\mathrm{m} = ${tx(Mo)}\\ \\mathrm{N\\,m}$`],
        );
      }
      if (level === 1 && k === 1) {
        const m = r.int(2, 25), rr = r.pick([0.4, 0.5, 0.6, 0.75, 0.8, 1.2, 1.5]), Mo = m * GZ * rr;
        const G = [dat("m", tx(m), "kg"), dat("r", tx(rr), "m"), G_DAT];
        return T(
          `Vodoravna palica je na enem koncu vrtljivo pritrjena. Na razdalji ${$(G[1])} od osi visi utež z maso ${$(G[0])}. Kolikšen navor glede na os povzroča teža uteži? Uporabi ${$(G[2])}.${zaok(1)}`,
          num(Mo, "N m", 1, [M(m * rr, "Navor povzroča teža uteži F_g = m g, ne masa.")]),
          "Najprej izračunaj težo uteži, nato navor teže glede na os.",
          G, ["M"], ["F_g = m\\,g", "M = F_g\\,r"],
          [`$F_g = m\\,g = ${m}\\ \\mathrm{kg} \\cdot 9{,}81\\ \\mathrm{m/s^2} = ${tx(m * GZ)}\\ \\mathrm{N}$`, `$M = F_g\\,r = ${tx(m * GZ)}\\ \\mathrm{N} \\cdot ${tx(rr)}\\ \\mathrm{m} ${res(Mo, 1, "N\\,m")}$`],
        );
      }
      if (level === 1) {
        const Mo = 2 * r.int(5, 30), rc = r.pick([20, 25, 30, 40, 50]), F = Mo / (rc / 100);
        const G = [dat("M", tx(Mo), "N\\,m"), dat("r", tx(rc), "cm")];
        return T(
          `Matico moramo priviti z navorom ${$(G[0])}. Ključ držimo na razdalji ${$(G[1])} od osi matice. S kolikšno silo, pravokotno na ključ, moramo delovati?${zaok(0)}`,
          num(F, "N", 0, [M(Mo / rc, "Ročico pretvori v metre."), M((Mo * rc) / 100, "Iz M = F r izraziš F = M / r.")]),
          "Iz enačbe za navor izrazi silo. Ročico zapiši v metrih.",
          G, ["F"], "M = F\\,r \\Rightarrow F = \\dfrac{M}{r}",
          [`$r = ${tx(rc / 100)}\\ \\mathrm{m}$`, `$F = \\dfrac{M}{r} = \\dfrac{${Mo}\\ \\mathrm{N\\,m}}{${tx(rc / 100)}\\ \\mathrm{m}} ${res(F, 0, "N")}$`, "Daljši ključ pomeni manjšo potrebno silo."],
        );
      }
      if (level === 2 && k === 0) {
        const m1 = 10 * r.int(5, 30), r1 = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]), r2 = r.pick([1.2, 1.5, 1.8, 2]), F = (m1 * GZ * r1) / r2;
        const G = [dat("m", tx(m1), "kg"), dat("r_1", tx(r1), "m"), dat("r_2", tx(r2), "m"), G_DAT];
        return T(
          `Z drogom kot vzvodom dvigamo kamen z maso ${$(G[0])}. Kamen je na razdalji ${$(G[1])} od podpore, drog pritiskamo navpično navzdol na razdalji ${$(G[2])} od podpore na drugi strani. S kolikšno silo moramo pritiskati, da je drog v ravnovesju? Uporabi ${$(G[3])}.${zaok(0)}`,
          num(F, "N", 0, [M((m1 * GZ * r2) / r1, "Obrnil si ročici: na daljši ročici je potrebna manjša sila."), M((m1 * r1) / r2, "Na kamen deluje teža m g, ne masa.")]),
          "V ravnovesju sta navora obeh sil glede na podporo enaka.",
          G, ["F"], "F\\,r_2 = m\\,g\\,r_1",
          [`$F_g = m\\,g = ${m1} \\cdot 9{,}81\\ \\mathrm{N} = ${tx(m1 * GZ)}\\ \\mathrm{N}$`, `$F = \\dfrac{F_g\\,r_1}{r_2} = \\dfrac{${tx(m1 * GZ)}\\ \\mathrm{N} \\cdot ${tx(r1)}\\ \\mathrm{m}}{${tx(r2)}\\ \\mathrm{m}} ${res(F, 0, "N")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const [a, b] = r.shuffle(NAMES).slice(0, 2);
        const m1 = r.int(25, 45);
        let m2;
        do m2 = r.int(25, 45);
        while (m2 === m1);
        const d1 = r.pick([1, 1.2, 1.4, 1.5, 1.6, 1.8]), d2 = (m1 * d1) / m2;
        const G = [dat("m_1", tx(m1), "kg"), dat("d_1", tx(d1), "m"), dat("m_2", tx(m2), "kg")];
        return T(
          `${a} z maso ${$(G[0])} sedi na gugalnici na razdalji ${$(G[1])} od osi. Kako daleč od osi na drugi strani mora sedeti ${b} z maso ${$(G[2])}, da je gugalnica v ravnovesju?${zaok(2)}`,
          num(d2, "m", 2, [M((m2 * d1) / m1, "Težji otrok mora sedeti bližje osi, ne dlje."), M(d1, "Pri različnih masah razdalji nista enaki.")]),
          "Navora tež obeh otrok glede na os morata biti enaka; g se pokrajša.",
          G, ["d_2"], "m_1\\,g\\,d_1 = m_2\\,g\\,d_2",
          [`$m_1\\,d_1 = m_2\\,d_2$ (g se pokrajša)`, `$d_2 = \\dfrac{m_1\\,d_1}{m_2} = \\dfrac{${m1}\\ \\mathrm{kg} \\cdot ${tx(d1)}\\ \\mathrm{m}}{${m2}\\ \\mathrm{kg}} ${res(d2, 2, "m")}$`],
        );
      }
      if (level === 2) {
        const F = r.int(20, 200), rr = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.8]), al = r.pick([20, 30, 40, 45, 50, 60, 70]);
        const s = Math.sin((al * PI) / 180), Mo = F * rr * s;
        const G = [dat("F", tx(F), "N"), dat("r", tx(rr), "m"), `\\alpha = ${al}^\\circ`];
        return T(
          `Na vrata, ki se vrtijo okoli tečajev, delujemo s silo ${$(G[0])} na razdalji ${$(G[1])} od tečajev. Sila oklepa z ravnino vrat kot ${$(G[2])} in leži v vodoravni ravnini. Kolikšen je navor sile glede na os tečajev?${zaok(1)}`,
          num(Mo, "N m", 1, [M(F * rr * Math.cos((al * PI) / 180), "Navor povzroča le komponenta sile, pravokotna na vrata: F sin α, ne F cos α."), M(F * rr, "Sila ni pravokotna na vrata, zato upoštevaj kot.")]),
          "Le komponenta sile, ki je pravokotna na ročico, povzroča vrtenje.",
          G, ["M"], "M = F\\,r\\,\\sin\\alpha",
          [`$F_\\perp = F \\sin\\alpha = ${F}\\ \\mathrm{N} \\cdot \\sin ${al}^\\circ ${res(F * s, 2, "N")}$`, `$M = F_\\perp\\,r ${res(Mo, 1, "N\\,m")}$`],
        );
      }
      if (k === 0) {
        const L = r.pick([2, 3, 4, 5, 6]), mb = r.int(10, 40), mz = r.int(20, 120), x = r.int(1, 2 * L - 1) / 2, askB = r.int(0, 1);
        const FB = ((mb * L) / 2 + mz * x) * GZ / L, FA = (mb + mz) * GZ - FB;
        const ans = askB ? FB : FA;
        const G = [dat("L", tx(L), "m"), dat("m_{\\text{g}}", tx(mb), "kg"), dat("m_{\\text{z}}", tx(mz), "kg"), dat("x", tx(x), "m"), G_DAT];
        return T(
          `Homogena greda z dolžino ${$(G[0])} in maso ${$(G[1])} leži vodoravno na dveh podporah na krajiščih A in B. Na razdalji ${$(G[3])} od krajišča A stoji zaboj z maso ${$(G[2])}. S kolikšno silo deluje na gredo podpora ${askB ? "B" : "A"}? Uporabi ${$(G[4])}.${zaok(0)}`,
          num(ans, "N", 0, [M(askB ? FA : FB, `To je sila podpore ${askB ? "A" : "B"}.`), M(askB ? (mz * GZ * x) / L : (mz * GZ * (L - x)) / L, "Upoštevaj tudi težo grede, ki prijemlje v njeni sredini."), M(((mb + mz) * GZ) / 2, "Podpori nosita enako le, če je breme na sredini.")]),
          `Zapiši ravnovesje navorov glede na krajišče ${askB ? "A" : "B"}: tako sila te podpore nima navora.`,
          G, [askB ? "F_B" : "F_A"],
          askB ? "F_B\\,L = m_{\\text{g}}\\,g\\,\\tfrac{L}{2} + m_{\\text{z}}\\,g\\,x" : "F_A\\,L = m_{\\text{g}}\\,g\\,\\tfrac{L}{2} + m_{\\text{z}}\\,g\\,(L - x)",
          askB
            ? [`Navori glede na A: $F_B \\cdot ${L}\\ \\mathrm{m} = ${mb} \\cdot 9{,}81 \\cdot ${tx(L / 2)} + ${mz} \\cdot 9{,}81 \\cdot ${tx(x)}\\ \\mathrm{N\\,m}$`, `$F_B ${res(FB, 0, "N")}$`]
            : [`Navori glede na B: $F_A \\cdot ${L}\\ \\mathrm{m} = ${mb} \\cdot 9{,}81 \\cdot ${tx(L / 2)} + ${mz} \\cdot 9{,}81 \\cdot ${tx(L - x)}\\ \\mathrm{N\\,m}$`, `$F_A ${res(FA, 0, "N")}$`, `Preizkus: $F_A + F_B = (m_{\\text{g}} + m_{\\text{z}})\\,g ${res((mb + mz) * GZ, 0, "N")}$`],
        );
      }
      if (k === 1) {
        const m1 = r.int(1, 12), m2 = r.int(1, 12) + (r.int(0, 1) ? 0 : 0.5), L = r.pick([0.6, 0.8, 1, 1.2, 1.5, 2]), x = (m2 * L) / (m1 + m2);
        const G = [dat("L", tx(L), "m"), dat("m_1", tx(m1), "kg"), dat("m_2", tx(m2), "kg")];
        return T(
          `Na krajiščih lahke palice z dolžino ${$(G[0])} visita uteži ${$(G[1])} in ${$(G[2])}. Na kateri razdalji od uteži $m_1$ moramo palico podpreti, da bo v ravnovesju?${zaok(2)}`,
          num(x, "m", 2, [M(L / 2, "Palica je v ravnovesju na sredini le pri enakih masah."), M((m1 * L) / (m1 + m2), "Podpora je bližje težji uteži: od m₁ meriš m₂L/(m₁ + m₂).")]),
          "Podpora mora biti v težišču: navora tež obeh uteži glede na podporo sta enaka.",
          G, ["x"], ["m_1\\,g\\,x = m_2\\,g\\,(L - x)", "x = \\dfrac{m_2\\,L}{m_1 + m_2}"],
          [`$m_1\\,x = m_2\\,(L - x) \\Rightarrow x = \\dfrac{m_2\\,L}{m_1 + m_2}$`, `$x = \\dfrac{${tx(m2)} \\cdot ${tx(L)}}{${tx(m1 + m2)}}\\ \\mathrm{m} ${res(x, 2, "m")}$`],
        );
      }
      const L = r.pick([2, 2.4, 3, 4]), m = r.int(8, 30), a = r.int(Math.ceil(L * 1.5), Math.floor(L * 4)) / 10, Mx = (m * (L / 2 - a)) / a;
      const G = [dat("L", tx(L), "m"), dat("m", tx(m), "kg"), dat("a", tx(a), "m")];
      return T(
        `Homogena deska z dolžino ${$(G[0])} in maso ${$(G[1])} leži na vodoravni mizi tako, da sega čez rob za ${$(G[2])}. Kolikšno največjo maso lahko obesimo na krajišče deske, ki štrli čez rob, da se deska še ne prevrne?${zaok(1)}`,
        num(Mx, "kg", 1, [M((m * a) / (L / 2 - a), "Obrnil si ročici: breme ima ročico a, teža deske pa L/2 − a."), M((m * (L - a)) / a, "Teža deske prijemlje v njeni sredini, ki je od roba mize oddaljena L/2 − a.")]),
        "Deska se začne prevračati okoli roba mize. Primerjaj navora teže deske in teže bremena glede na rob.",
        G, ["m_{\\text{b}}"], "m_{\\text{b}}\\,g\\,a = m\\,g\\left(\\tfrac{L}{2} - a\\right)",
        [`Os vrtenja je rob mize. Težišče deske je od roba oddaljeno $\\tfrac{L}{2} - a = ${tx(L / 2 - a)}\\ \\mathrm{m}$.`, `$m_{\\text{b}} = \\dfrac{m\\left(\\tfrac{L}{2} - a\\right)}{a} = \\dfrac{${m} \\cdot ${tx(L / 2 - a)}}{${tx(a)}}\\ \\mathrm{kg} ${res(Mx, 1, "kg")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 1: prožnost
  {
    id: "vrz-proznost",
    topics: ["FIZ-SS-1/proznost"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const kDat = (s, v) => dat(s, tx(v), "N/m");
      const ser = (a, b) => (a * b) / (a + b);
      if (level === 1 && k === 0) {
        const kk = 10 * r.int(4, 60), x = r.int(2, 25), F = (kk * x) / 100;
        const G = [kDat("k", kk), dat("x", tx(x), "cm")];
        return T(
          `Vzmet s prožnostnim koeficientom ${$(G[0])} raztegnemo za ${$(G[1])}. S kolikšno silo jo moramo vleči?`,
          num(F, "N", null, [M(kk * x, "Raztezek pretvori v metre."), M(kk / (x / 100), "Sila je produkt koeficienta in raztezka.")]),
          "Uporabi Hookov zakon; raztezek zapiši v metrih.",
          G, ["F"], "F = k\\,x",
          [`$x = ${x}\\ \\mathrm{cm} = ${tx(x / 100)}\\ \\mathrm{m}$`, `$F = k\\,x = ${kk}\\ \\mathrm{N/m} \\cdot ${tx(x / 100)}\\ \\mathrm{m} = ${tx(F)}\\ \\mathrm{N}$`],
        );
      }
      if (level === 1 && k === 1) {
        const m = r.pick([0.1, 0.2, 0.25, 0.3, 0.5, 0.75, 1, 1.5, 2]), x = r.int(2, 20), kk = (m * GZ) / (x / 100);
        const G = [dat("m", tx(m), "kg"), dat("x", tx(x), "cm"), G_DAT];
        return T(
          `Ko na vzmet obesimo utež z maso ${$(G[0])}, se vzmet raztegne za ${$(G[1])}. Kolikšen je prožnostni koeficient vzmeti? Uporabi ${$(G[2])}.${zaok(0)}`,
          num(kk, "N/m", 0, [M(m / (x / 100), "Vzmet razteza teža uteži m g, ne masa."), M((m * GZ) / x, "Raztezek pretvori v metre.")]),
          "V ravnovesju je sila vzmeti enaka teži uteži.",
          G, ["k"], ["k\\,x = m\\,g", "k = \\dfrac{m\\,g}{x}"],
          [`$F = m\\,g = ${tx(m)} \\cdot 9{,}81\\ \\mathrm{N} ${res(m * GZ, 3, "N")}$`, `$k = \\dfrac{F}{x} = \\dfrac{${tx(m * GZ, 3)}\\ \\mathrm{N}}{${tx(x / 100)}\\ \\mathrm{m}} ${res(kk, 0, "N/m")}$`],
        );
      }
      if (level === 1) {
        const F = r.int(2, 40), kk = 10 * r.int(5, 80), x = (F / kk) * 100;
        const G = [dat("F", tx(F), "N"), kDat("k", kk)];
        return T(
          `Za koliko centimetrov se raztegne vzmet s prožnostnim koeficientom ${$(G[1])}, če jo vlečemo s silo ${$(G[0])}?${zaok(1)}`,
          num(x, "cm", 1, [M(F / kk, "To je raztezek v metrih; pretvori ga v centimetre."), M((kk / F) * 100, "Raztezek je sila, deljena s koeficientom.")]),
          "Iz Hookovega zakona izrazi raztezek in ga pretvori v centimetre.",
          G, ["x"], "x = \\dfrac{F}{k}",
          [`$x = \\dfrac{F}{k} = \\dfrac{${F}\\ \\mathrm{N}}{${kk}\\ \\mathrm{N/m}} ${res(F / kk, 4, "m")}$`, `$x ${res(x, 1, "cm")}$`],
        );
      }
      if (level === 2 && k === 0) {
        const k1 = 10 * r.int(5, 60), k2 = 10 * r.int(5, 60), z = r.int(0, 1), K = z ? ser(k1, k2) : k1 + k2;
        const G = [kDat("k_1", k1), kDat("k_2", k2)];
        return T(
          `Vzmeti s prožnostnima koeficientoma ${$(G[0])} in ${$(G[1])} vežemo ${z ? "zaporedno (eno pod drugo)" : "vzporedno (drugo ob drugi, breme visi na obeh in obe se raztegneta enako)"}. Kolikšen je prožnostni koeficient vezave?${zaok(0)}`,
          num(K, "N/m", 0, z ? [M(k1 + k2, "To velja za vzporedno vezavo; pri zaporedni se seštevajo obratne vrednosti."), M((k1 + k2) / 2, "Koeficienta ne povprečiš.")] : [M(ser(k1, k2), "To velja za zaporedno vezavo; pri vzporedni se koeficienta seštejeta."), M((k1 + k2) / 2, "Koeficienta ne povprečiš.")]),
          z ? "Pri zaporedni vezavi deluje na obe vzmeti enaka sila, raztezka pa se seštejeta." : "Pri vzporedni vezavi sta raztezka enaka, sili vzmeti pa se seštejeta.",
          G, ["k"], z ? "\\dfrac{1}{k} = \\dfrac{1}{k_1} + \\dfrac{1}{k_2}" : "k = k_1 + k_2",
          z
            ? [`$\\dfrac{1}{k} = \\dfrac{1}{${k1}} + \\dfrac{1}{${k2}}\\ \\mathrm{m/N}$`, `$k = \\dfrac{k_1\\,k_2}{k_1 + k_2} = \\dfrac{${k1} \\cdot ${k2}}{${k1 + k2}}\\ \\mathrm{N/m} ${res(K, 0, "N/m")}$`, "Zaporedna vezava je mehkejša od vsake vzmeti posebej."]
            : [`$k = k_1 + k_2 = ${k1}\\ \\mathrm{N/m} + ${k2}\\ \\mathrm{N/m} = ${K}\\ \\mathrm{N/m}$`, "Vzporedna vezava je trša od vsake vzmeti posebej."],
        );
      }
      if (level === 2 && k === 1) {
        const L0 = r.int(10, 30), m1 = r.pick([0.1, 0.2, 0.25, 0.5]), dl1 = r.int(2, 8), L1 = L0 + dl1;
        let m2;
        do m2 = r.pick([0.15, 0.3, 0.4, 0.6, 0.75, 1]);
        while (m2 === m1);
        const L = L0 + (dl1 * m2) / m1;
        const G = [dat("L_0", tx(L0), "cm"), dat("m_1", tx(m1), "kg"), dat("L_1", tx(L1), "cm"), dat("m_2", tx(m2), "kg")];
        return T(
          `Neobremenjena vzmet je dolga ${$(G[0])}. Ko nanjo obesimo utež z maso ${$(G[1])}, je dolga ${$(G[2])}. Kolikšna bo dolžina vzmeti, če namesto te uteži obesimo utež z maso ${$(G[3])}?${zaok(1)}`,
          num(L, "cm", 1, [M((L1 * m2) / m1, "S silo je sorazmeren raztezek, ne dolžina vzmeti."), M((dl1 * m2) / m1, "To je raztezek; prištej še dolžino neobremenjene vzmeti.")]),
          "Po Hookovem zakonu je raztezek sorazmeren s silo, torej z maso obešene uteži.",
          G, ["L"], ["x = L - L_0", "\\dfrac{x_2}{x_1} = \\dfrac{m_2}{m_1}"],
          [`$x_1 = L_1 - L_0 = ${dl1}\\ \\mathrm{cm}$`, `$x_2 = x_1\\,\\dfrac{m_2}{m_1} = ${dl1} \\cdot \\dfrac{${tx(m2)}}{${tx(m1)}}\\ \\mathrm{cm} ${res((dl1 * m2) / m1, 2, "cm")}$`, `$L = L_0 + x_2 ${res(L, 1, "cm")}$`],
        );
      }
      if (level === 2) {
        const kk = 10 * r.int(5, 60), x = r.int(2, 15), m = (kk * x) / 100 / GZ;
        const G = [kDat("k", kk), dat("x", tx(x), "cm"), G_DAT];
        return T(
          `Kolikšno maso moramo obesiti na vzmet s prožnostnim koeficientom ${$(G[0])}, da se raztegne za ${$(G[1])}? Uporabi ${$(G[2])}.${zaok(2)}`,
          num(m, "kg", 2, [M((kk * x) / 100, "To je teža (sila) v newtonih; masa je F/g."), M((kk * x) / GZ, "Raztezek pretvori v metre.")]),
          "Sila vzmeti mora uravnovesiti težo uteži: k x = m g.",
          G, ["m"], "m = \\dfrac{k\\,x}{g}",
          [`$F = k\\,x = ${kk}\\ \\mathrm{N/m} \\cdot ${tx(x / 100)}\\ \\mathrm{m} = ${tx((kk * x) / 100)}\\ \\mathrm{N}$`, `$m = \\dfrac{F}{g} = \\dfrac{${tx((kk * x) / 100)}}{9{,}81}\\ \\mathrm{kg} ${res(m, 2, "kg")}$`],
        );
      }
      if (k === 0) {
        const k1 = 10 * r.int(5, 40), k2 = 10 * r.int(5, 40), z = r.int(0, 1), K = z ? ser(k1, k2) : k1 + k2;
        const m = r.pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5]), x = ((m * GZ) / K) * 100;
        const Kw = z ? k1 + k2 : ser(k1, k2);
        const G = [kDat("k_1", k1), kDat("k_2", k2), dat("m", tx(m), "kg"), G_DAT];
        return T(
          `Vzmeti s koeficientoma ${$(G[0])} in ${$(G[1])} sta vezani ${z ? "zaporedno" : "vzporedno"}. Na vezavo obesimo utež z maso ${$(G[2])}. Za koliko centimetrov se raztegne vezava? Uporabi ${$(G[3])}.${zaok(1)}`,
          num(x, "cm", 1, [M(((m * GZ) / Kw) * 100, z ? "Pri zaporedni vezavi se seštevajo obratne vrednosti koeficientov." : "Pri vzporedni vezavi se koeficienta seštejeta."), M((m * GZ) / K, "Rezultat je v metrih; pretvori ga v centimetre.")]),
          "Najprej izračunaj prožnostni koeficient vezave, nato raztezek pod težo uteži.",
          G, ["x"], [z ? "k = \\dfrac{k_1\\,k_2}{k_1 + k_2}" : "k = k_1 + k_2", "x = \\dfrac{m\\,g}{k}"],
          [`$k ${res(K, 2, "N/m")}$`, `$x = \\dfrac{m\\,g}{k} = \\dfrac{${tx(m * GZ, 3)}\\ \\mathrm{N}}{${tx(K, 2)}\\ \\mathrm{N/m}} ${res(x / 100, 4, "m")}$`, `$x ${res(x, 1, "cm")}$`],
        );
      }
      if (k === 1) {
        const kk = 10 * r.int(5, 40), n = r.pick([2, 3, 4]), par = r.int(0, 1), ans = par ? n * n * kk : n * kk;
        const G = [kDat("k", kk), dat("n", tx(n), "")];
        return T(
          `Vzmet s prožnostnim koeficientom ${$(G[0])} razrežemo na ${$(G[1])} enakih delov. ${par ? "Vse dele vežemo vzporedno. Kolikšen je prožnostni koeficient te vezave?" : "Kolikšen je prožnostni koeficient enega dela?"}`,
          num(ans, "N/m", null, par ? [M(n * kk, "To je koeficient enega dela; vzporedna vezava n delov ima še n-krat večjega."), M(kk, "Krajši deli so trši, vzporedna vezava pa še trša.")] : [M(kk / n, "Krajša vzmet je trša: pri isti sili se raztegne manj."), M(kk, "Krajša vzmet se pri isti sili raztegne manj, zato ima večji koeficient.")]),
          "Pri isti sili se vsak košček vzmeti raztegne enako; raztezek dela je zato n-krat manjši od raztezka cele vzmeti.",
          G, [par ? "k_{\\text{v}}" : "k_{\\text{d}}"], par ? ["k_{\\text{d}} = n\\,k", "k_{\\text{v}} = n\\,k_{\\text{d}}"] : "k_{\\text{d}} = n\\,k",
          [`Cela vzmet je zaporedna vezava ${n} enakih delov: $\\dfrac{1}{k} = \\dfrac{${n}}{k_{\\text{d}}} \\Rightarrow k_{\\text{d}} = ${n}\\,k = ${n * kk}\\ \\mathrm{N/m}$`, ...(par ? [`Vzporedna vezava ${n} delov: $k_{\\text{v}} = ${n} \\cdot ${n * kk}\\ \\mathrm{N/m} = ${ans}\\ \\mathrm{N/m}$`] : [])],
        );
      }
      const k1 = 10 * r.int(10, 60), f = r.pick([0.4, 0.5, 0.6, 0.75]), K = k1 * f, k2 = (k1 * K) / (k1 - K);
      const G = [kDat("k_1", k1), kDat("k", K)];
      return T(
        `Vzmet s koeficientom ${$(G[0])} je pretrda. S kolikšnim koeficientom moramo zaporedno z njo vezati drugo vzmet, da bo prožnostni koeficient vezave ${$(G[1])}?${zaok(0)}`,
        num(k2, "N/m", 0, [M(k1 - K, "Pri zaporedni vezavi se ne odštevajo koeficienti, ampak obratne vrednosti."), M(K, "To je koeficient vezave, ne druge vzmeti.")]),
        "Zapiši enačbo za zaporedno vezavo in izrazi neznani koeficient.",
        G, ["k_2"], ["\\dfrac{1}{k} = \\dfrac{1}{k_1} + \\dfrac{1}{k_2}", "k_2 = \\dfrac{k_1\\,k}{k_1 - k}"],
        [`$\\dfrac{1}{k_2} = \\dfrac{1}{k} - \\dfrac{1}{k_1} = \\dfrac{k_1 - k}{k_1\\,k}$`, `$k_2 = \\dfrac{${k1} \\cdot ${tx(K)}}{${k1} - ${tx(K)}}\\ \\mathrm{N/m} ${res(k2, 0, "N/m")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2: prevajanje toplote in sevanje
  {
    id: "vrz-prevajanje",
    topics: ["FIZ-SS-2/prevajanje-toplote-in-sevanje"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const MAT = [["opeke", 0.6, "cm", [24, 38]], ["betona", 1.7, "cm", [15, 30]], ["stekla", 1, "mm", [4, 8]], ["lesa", 0.15, "cm", [2, 6]], ["stiropora", 0.035, "cm", [5, 20]]];
      const lamDat = (v, s = "\\lambda") => dat(s, tx(v), "W/(m\\,K)");
      if (level === 1 && k === 0) {
        const [nm, lam, u, [a, b]] = r.pick(MAT), d = r.int(a, b), dm = u === "cm" ? d / 100 : d / 1000;
        const S = u === "mm" ? r.pick([1, 1.5, 2, 2.4]) : r.int(5, 30), dT = r.int(10, 30), P = (lam * S * dT) / dm;
        const G = [lamDat(lam), dat("S", tx(S), "m²"), dat("d", tx(d), u), dat("\\Delta T", tx(dT), "K")];
        return T(
          `${u === "mm" ? "Šipa" : "Stena"} iz ${nm} s toplotno prevodnostjo ${$(G[0])} ima površino ${$(G[1])} in debelino ${$(G[2])}. Notranja stran je za ${$(G[3])} toplejša od zunanje. Kolikšen toplotni tok teče skozi ${u === "mm" ? "šipo" : "steno"}?${zaok(0)}`,
          num(P, "W", 0, [M((lam * S * dT) / d, "Debelino pretvori v metre."), M(lam * S * dT * dm, "Toplotni tok je obratno sorazmeren z debelino: deliš z d.")]),
          "Toplotni tok je sorazmeren s toplotno prevodnostjo, površino in razliko temperatur ter obratno sorazmeren z debelino.",
          G, ["P"], "P = \\dfrac{\\lambda\\,S\\,\\Delta T}{d}",
          [`$d = ${d}\\ \\mathrm{${u}} = ${tx(dm)}\\ \\mathrm{m}$`, `$P = \\dfrac{${tx(lam)} \\cdot ${tx(S)} \\cdot ${dT}}{${tx(dm)}}\\ \\mathrm{W} ${res(P, 0, "W")}$`],
        );
      }
      if (level === 1 && k === 1) {
        const T0 = 10 * r.int(30, 150), j = SIG * T0 ** 4, kw = T0 >= 800, d = kw ? 1 : 0;
        const G = [dat("T", tx(T0), "K"), SIG_DAT];
        return T(
          `Kolikšna je gostota energijskega toka, ki ga seva površina črnega telesa s temperaturo ${$(G[0])}? Uporabi ${$(G[1])}. Rezultat zapiši v ${kw ? "kW/m²" : "W/m²"} in ga zaokroži ${dw(d)}.`,
          num(kw ? j / 1000 : j, kw ? "kW/m²" : "W/m²", d, [M(kw ? j : j * 1000, kw ? "Rezultat pretvori v kilovate: deli s 1000." : "Rezultat je že v W/m²."), M((SIG * T0 ** 3) / (kw ? 1000 : 1), "Po Stefanovem zakonu je gostota sorazmerna s četrto potenco temperature.")], { unitAlternatives: [kw ? "kW/m2" : "W/m2"] }),
          "Uporabi Stefanov zakon j = σT⁴. Temperatura mora biti v kelvinih.",
          G, ["j"], "j = \\sigma\\,T^4",
          [`$T^4 = ${T0}^4\\ \\mathrm{K^4} \\approx ${sci3(T0 ** 4).t}\\ \\mathrm{K^4}$`, `$j = \\sigma\\,T^4 ${res(j, 0, "W/m²")}${kw ? ` ${res(j / 1000, 1, "kW/m²")}` : ""}$`],
        );
      }
      if (level === 1) {
        const pick = r.shuffle(MAT).slice(0, 3), best = r.int(0, 1);
        const sorted = [...pick].sort((a, b) => a[1] - b[1]), right = best ? sorted[0] : sorted[2];
        const G = pick.map((m) => lamDat(m[1], `\\lambda_{\\text{${m[0]}}}`));
        const nom = (m) => cap({ opeke: "opeka", betona: "beton", stekla: "steklo", lesa: "les", stiropora: "stiropor" }[m[0]]);
        const wrong = pick.filter((m) => m !== right).map((m) => [nom(m), `Toplotna prevodnost ${m[0]} je ${tx(m[1]).replace("{,}", ",")} W/(m K), kar je ${m[1] > right[1] ? "več" : "manj"} kot pri materialu ${nom(right).toLowerCase()}, zato skozi plast teče ${m[1] > right[1] ? "večji" : "manjši"} toplotni tok.`]);
        return T(
          `Plasti iz treh materialov imajo enako debelino in površino ter enako razliko temperatur na obeh straneh. Toplotne prevodnosti so ${G.map($).join(", ")}. Skozi katero plast teče ${best ? "najmanjši" : "največji"} toplotni tok (${best ? "najboljši izolator" : "najboljši prevodnik"})?`,
          choice(r, nom(right), wrong),
          "Pri enaki debelini, površini in razliki temperatur je toplotni tok sorazmeren s toplotno prevodnostjo λ.",
          G, ["\\text{material}"], "P = \\dfrac{\\lambda\\,S\\,\\Delta T}{d}",
          [`Toplotni tok je sorazmeren z λ. ${best ? "Najmanjšo" : "Največjo"} prevodnost ima ${nom(right).toLowerCase()}: $\\lambda = ${tx(right[1])}\\ \\mathrm{W/(m\\,K)}$.`],
        );
      }
      if (level === 2 && k === 0) {
        const d = r.int(4, 8), S = r.pick([1, 1.2, 1.5, 2, 2.5]), dT = r.int(10, 25), th = r.pick([1, 2, 5, 8, 10, 24]);
        const P = (1 * S * dT) / (d / 1000), Q = (P * th * 3600) / 1e6;
        const G = [lamDat(1), dat("d", tx(d), "mm"), dat("S", tx(S), "m²"), dat("\\Delta T", tx(dT), "K"), dat("t", tx(th), "h")];
        return T(
          `Okno z enojno šipo (toplotna prevodnost stekla ${$(G[0])}, debelina ${$(G[1])}) ima površino ${$(G[2])}. Zunaj je za ${$(G[3])} hladneje kot v sobi. Koliko toplote uide skozi šipo v času ${$(G[4])}? Rezultat zapiši v megajoulih in ga zaokroži ${dw(1)}. (Zanemari plasti zraka ob šipi.)`,
          num(Q, "MJ", 1, [M(Q / 3600, "Čas pretvori v sekunde: 1 h = 3600 s."), M(Q / 1000, "Debelino pretvori v metre: 1 mm = 0,001 m.")]),
          "Izračunaj toplotni tok skozi šipo, nato toploto Q = P t.",
          G, ["Q"], ["P = \\dfrac{\\lambda\\,S\\,\\Delta T}{d}", "Q = P\\,t"],
          [`$P = \\dfrac{1 \\cdot ${tx(S)} \\cdot ${dT}}{${tx(d / 1000)}}\\ \\mathrm{W} ${res(P, 0, "W")}$`, `$t = ${th}\\ \\mathrm{h} = ${th * 3600}\\ \\mathrm{s}$`, `$Q = P\\,t \\approx ${sci3(Q * 1e6).t}\\ \\mathrm{J} ${res(Q, 1, "MJ")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const th = r.int(50, 900), S = r.pick([0.01, 0.02, 0.05, 0.1, 0.25, 0.5]), TK = th + 273, P = SIG * S * TK ** 4;
        const G = [dat("S", tx(S), "m²"), dat("\\vartheta", tx(th), "°C"), SIG_DAT];
        return T(
          `Površina ${$(G[0])} kovinske plošče ima temperaturo ${$(G[1])}. Kolikšno moč izseva plošča, če jo obravnavamo kot črno telo? Uporabi ${$(G[2])}.${zaok(0)}`,
          num(P, "W", 0, [M(SIG * S * th ** 4, "Temperaturo pretvori v kelvine: T = ϑ + 273 K."), M(SIG * TK ** 4, "Gostoto energijskega toka pomnoži s površino.")]),
          "Temperatura v Stefanovem zakonu mora biti v kelvinih.",
          G, ["P"], "P = \\sigma\\,S\\,T^4",
          [`$T = ${th} + 273 = ${TK}\\ \\mathrm{K}$`, `$P = \\sigma\\,S\\,T^4 = 5{,}67 \\cdot 10^{-8} \\cdot ${tx(S)} \\cdot ${TK}^4\\ \\mathrm{W} ${res(P, 0, "W")}$`],
        );
      }
      if (level === 2) {
        const t1 = r.int(0, 100), t2 = t1 + r.int(50, 600), ratio = ((t2 + 273) / (t1 + 273)) ** 4;
        const G = [dat("\\vartheta_1", tx(t1), "°C"), dat("\\vartheta_2", tx(t2), "°C")];
        return T(
          `Kovinsko kroglo segrejemo z ${$(G[0])} na ${$(G[1])}. Kolikokrat se poveča moč, ki jo krogla izseva? Kroglo obravnavaj kot črno telo.${zaok(2)}`,
          num(ratio, "", 2, [M((t2 + 273) / (t1 + 273), "Izsevana moč je sorazmerna s četrto potenco temperature."), M(t1 > 0 ? (t2 / t1) ** 4 : NaN, "Temperaturi pretvori v kelvine.")]),
          "Razmerje izsevanih moči je razmerje četrtih potenc absolutnih temperatur.",
          G, ["\\dfrac{P_2}{P_1}"], "\\dfrac{P_2}{P_1} = \\left(\\dfrac{T_2}{T_1}\\right)^4",
          [`$T_1 = ${t1 + 273}\\ \\mathrm{K}$, $T_2 = ${t2 + 273}\\ \\mathrm{K}$`, `$\\dfrac{P_2}{P_1} = \\left(\\dfrac{${t2 + 273}}{${t1 + 273}}\\right)^4 ${res(ratio, 2, "")}$`],
        );
      }
      if (k === 0) {
        const d1 = r.pick([20, 25, 30, 38]), d2 = r.pick([5, 8, 10, 12, 15, 20]), S = r.int(10, 40), dT = r.int(15, 30);
        const R = d1 / 100 / 0.6 + d2 / 100 / 0.035, P = (S * dT) / R, P0 = (0.6 * S * dT) / (d1 / 100), askRatio = r.int(0, 1);
        const G = [dat("d_1", tx(d1), "cm"), lamDat(0.6, "\\lambda_1"), dat("d_2", tx(d2), "cm"), lamDat(0.035, "\\lambda_2"), dat("S", tx(S), "m²"), dat("\\Delta T", tx(dT), "K")];
        const intro = `Zunanja stena hiše je iz opeke (debelina ${$(G[0])}, ${$(G[1])}) in je obložena s stiroporom (debelina ${$(G[2])}, ${$(G[3])}). Površina stene je ${$(G[4])}, razlika temperatur med notranjo in zunanjo površino je ${$(G[5])}.`;
        return T(
          `${intro} ${askRatio ? `Kolikokrat manjši je toplotni tok skozi izolirano steno kot skozi enako steno brez stiropora?${zaok(1)}` : `Kolikšen toplotni tok teče skozi izolirano steno?${zaok(0)}`}`,
          askRatio
            ? num(P0 / P, "", 1, [M(P / P0, "Obrnil si razmerje: tok brez izolacije je večji."), M((0.6 / (d1 / 100)) / (0.035 / (d2 / 100)), "Upori plasti se seštevajo; primerjaj vsoto uporov z uporom same opeke.")])
            : num(P, "W", 0, [M(S * dT * (0.6 / (d1 / 100) + 0.035 / (d2 / 100)), "Pri zaporednih plasteh se seštevajo toplotni upori d/λ, ne prevodnosti."), M(P0, "Upoštevaj obe plasti.")]),
          "Skozi obe plasti teče enak toplotni tok; razmerja d/λ (toplotni upori) se seštejeta.",
          G, [askRatio ? "\\dfrac{P_0}{P}" : "P"],
          ["P = \\dfrac{S\\,\\Delta T}{\\dfrac{d_1}{\\lambda_1} + \\dfrac{d_2}{\\lambda_2}}", ...(askRatio ? ["P_0 = \\dfrac{\\lambda_1\\,S\\,\\Delta T}{d_1}"] : [])],
          [`$\\dfrac{d_1}{\\lambda_1} = \\dfrac{${tx(d1 / 100)}}{0{,}6} ${res(d1 / 100 / 0.6, 3, "m²\\,K/W")}$, $\\dfrac{d_2}{\\lambda_2} = \\dfrac{${tx(d2 / 100)}}{0{,}035} ${res(d2 / 100 / 0.035, 3, "m²\\,K/W")}$`, `$P = \\dfrac{${S} \\cdot ${dT}}{${tx(R, 3)}}\\ \\mathrm{W} ${res(P, 0, "W")}$`, ...(askRatio ? [`$P_0 = \\dfrac{0{,}6 \\cdot ${S} \\cdot ${dT}}{${tx(d1 / 100)}}\\ \\mathrm{W} ${res(P0, 0, "W")}$`, `$\\dfrac{P_0}{P} ${res(P0 / P, 1, "")}$`] : [])],
        );
      }
      if (k === 1) {
        const S = r.pick([1.6, 1.7, 1.8, 1.9, 2]), tk = r.int(30, 34), to = r.int(15, 24), Tk = tk + 273, To = to + 273;
        const P = SIG * S * (Tk ** 4 - To ** 4);
        const G = [dat("S", tx(S), "m²"), dat("\\vartheta_{\\text{k}}", tx(tk), "°C"), dat("\\vartheta_{\\text{o}}", tx(to), "°C"), SIG_DAT];
        return T(
          `Gola koža človeka ima površino ${$(G[0])} in temperaturo ${$(G[1])}. Stene sobe imajo temperaturo ${$(G[2])}. Kolikšna je neto moč, ki jo človek odda s sevanjem? Kožo in stene obravnavaj kot črno telo, ${$(G[3])}.${zaok(0)}`,
          num(P, "W", 0, [M(SIG * S * Tk ** 4, "Telo tudi prejema sevanje sten: odštej σ S T_o⁴."), M(SIG * S * (tk ** 4 - to ** 4), "Temperaturi pretvori v kelvine.")]),
          "Telo seva σST_k⁴ in hkrati vpija sevanje okolice σST_o⁴. Neto moč je razlika.",
          G, ["P"], "P = \\sigma\\,S\\,(T_{\\text{k}}^4 - T_{\\text{o}}^4)",
          [`$T_{\\text{k}} = ${Tk}\\ \\mathrm{K}$, $T_{\\text{o}} = ${To}\\ \\mathrm{K}$`, `$P = 5{,}67 \\cdot 10^{-8} \\cdot ${tx(S)} \\cdot (${Tk}^4 - ${To}^4)\\ \\mathrm{W} ${res(P, 0, "W")}$`, "Zato nas v sobi s hladnimi stenami zebe, čeprav je zrak topel."],
        );
      }
      const lam = 0.035, d0 = r.int(4, 20), S = r.int(10, 40), dT = r.int(15, 30), P = Math.max(10, Math.round((lam * S * dT) / (d0 / 100) / 10) * 10), d = ((lam * S * dT) / P) * 100;
      const G = [lamDat(lam), dat("S", tx(S), "m²"), dat("\\Delta T", tx(dT), "K"), dat("P", tx(P), "W")];
      return T(
        `Strop s površino ${$(G[1])} želimo izolirati s stiroporom (${$(G[0])}). Pri razliki temperatur ${$(G[2])} naj skozi izolacijo teče toplotni tok največ ${$(G[3])}. Kako debela mora biti plast stiropora? Upor drugih plasti zanemari.${zaok(1)}`,
        num(d, "cm", 1, [M(d / 100, "Rezultat je v metrih; pretvori ga v centimetre."), M((P / (lam * S * dT)) * 100, "Debelina je v števcu ulomka: d = λ S ΔT / P.")]),
        "Iz enačbe za toplotni tok izrazi debelino.",
        G, ["d"], "d = \\dfrac{\\lambda\\,S\\,\\Delta T}{P}",
        [`$d = \\dfrac{0{,}035 \\cdot ${S} \\cdot ${dT}}{${P}}\\ \\mathrm{m} ${res(d / 100, 4, "m")}$`, `$d ${res(d, 1, "cm")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 3: izmenični tok in nihajni krog
  {
    id: "vrz-izmenicni",
    topics: ["FIZ-SS-3/izmenicni-tok-in-nihajni-krog"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2), S2 = Math.SQRT2;
      if (level === 1 && k === 0) {
        if (r.int(0, 1)) {
          const U0 = r.pick([10, 24, 50, 100, 120, 325, 400, 565]), U = U0 / S2;
          const G = [dat("U_0", tx(U0), "V")];
          return T(
            `Temenska (največja) vrednost izmenične napetosti je ${$(G[0])}. Kolikšna je efektivna napetost?${zaok(1)}`,
            num(U, "V", 1, [M(U0 / 2, "Deliš s √2, ne z 2."), M(U0 * S2, "Efektivna napetost je manjša od temenske: deliš s √2.")]),
            "Pri sinusni napetosti je efektivna vrednost temenska, deljena s √2.",
            G, ["U_{\\text{ef}}"], "U_{\\text{ef}} = \\dfrac{U_0}{\\sqrt{2}}",
            [`$U_{\\text{ef}} = \\dfrac{${U0}\\ \\mathrm{V}}{\\sqrt{2}} ${res(U, 1, "V")}$`, "Enosmerna napetost $U_{\\text{ef}}$ bi na uporniku dala enako povprečno moč kot ta izmenična napetost."],
          );
        }
        const U = r.pick([6, 12, 24, 110, 230, 400]), U0 = U * S2;
        const G = [dat("U_{\\text{ef}}", tx(U), "V")];
        return T(
          `Efektivna vrednost izmenične napetosti je ${$(G[0])}. Kolikšna je temenska (največja) vrednost napetosti?${zaok(1)}`,
          num(U0, "V", 1, [M(U / S2, "Temenska napetost je večja od efektivne: množiš s √2."), M(2 * U, "Množiš s √2, ne z 2.")]),
          "Temenska vrednost je √2-krat večja od efektivne.",
          G, ["U_0"], "U_0 = \\sqrt{2}\\,U_{\\text{ef}}",
          [`$U_0 = \\sqrt{2} \\cdot ${U}\\ \\mathrm{V} ${res(U0, 1, "V")}$`, "Napetost niha med $-U_0$ in $+U_0$; naprave, ki jih priključimo, morajo zdržati temensko napetost."],
        );
      }
      if (level === 1 && k === 1) {
        const P = r.pick([60, 100, 500, 800, 1000, 1200, 1500, 2000, 2200]), I = P / 230;
        const G = [dat("P", tx(P), "W"), dat("U_{\\text{ef}}", "230", "V")];
        return T(
          `Grelnik z močjo ${$(G[0])} priključimo na omrežno napetost ${$(G[1])}. Kolikšen je efektivni tok skozi grelnik?${zaok(2)}`,
          num(I, "A", 2, [M(P / (230 * S2), "Povprečna moč je produkt efektivnih vrednosti; √2 tu ne nastopa."), M(230 / P, "Tok je moč, deljena z napetostjo.")]),
          "Povprečna moč izmeničnega toka je produkt efektivne napetosti in efektivnega toka.",
          G, ["I_{\\text{ef}}"], "P = U_{\\text{ef}}\\,I_{\\text{ef}}",
          [`$I_{\\text{ef}} = \\dfrac{P}{U_{\\text{ef}}} = \\dfrac{${P}\\ \\mathrm{W}}{230\\ \\mathrm{V}} ${res(I, 2, "A")}$`, `Temenski tok je $\\sqrt{2}$-krat večji: $I_0 ${res(I * S2, 2, "A")}$.`],
        );
      }
      if (level === 1) {
        const nu = r.pick([50, 60, 100, 400, 1000]);
        if (r.int(0, 1)) {
          const t0 = 1000 / nu;
          const G = [dat("\\nu", tx(nu), "Hz")];
          return T(
            `Frekvenca izmenične napetosti je ${$(G[0])}. Kolikšen je nihajni čas v milisekundah?${zaok(2)}`,
            num(t0, "ms", 2, [M(1 / nu, "To je v sekundah; pretvori v milisekunde."), M(1000 / (2 * PI * nu), "Nihajni čas je 1/ν; 2π nastopa pri krožni frekvenci.")]),
            "Nihajni čas je obratna vrednost frekvence.",
            G, ["t_0"], "t_0 = \\dfrac{1}{\\nu}",
            [`$t_0 = \\dfrac{1}{${nu}\\ \\mathrm{Hz}} ${res(1 / nu, 5, "s")}$`, `$t_0 ${res(t0, 2, "ms")}$, saj je $1\\ \\mathrm{s} = 1000\\ \\mathrm{ms}$.`],
          );
        }
        const w = 2 * PI * nu;
        const G = [dat("\\nu", tx(nu), "Hz")];
        return T(
          `Frekvenca izmenične napetosti je ${$(G[0])}. Kolikšna je krožna frekvenca ω?${zaok(0)}`,
          num(w, "s⁻¹", 0, [M(nu, "Krožna frekvenca je 2π-krat večja od frekvence."), M(PI * nu, "ω = 2πν, ne πν.")], { unitAlternatives: ["1/s", "s^-1", "s-1", "rad/s"] }),
          "Krožna frekvenca je ω = 2πν.",
          G, ["\\omega"], "\\omega = 2\\pi\\nu",
          [`$\\omega = 2\\pi \\cdot ${nu}\\ \\mathrm{s^{-1}} ${res(w, 0, "s^{-1}")}$`, "V enem nihaju se faza poveča za $2\\pi$, zato je $\\omega = 2\\pi/t_0 = 2\\pi\\nu$."],
        );
      }
      if (level === 2 && k === 0) {
        const U0 = r.pick([10, 20, 50, 100, 170, 325]), R = r.pick([10, 22, 47, 50, 100, 220]), P = (U0 * U0) / (2 * R);
        const G = [dat("U_0", tx(U0), "V"), dat("R", tx(R), "Ω")];
        return T(
          `Na upornik z uporom ${$(G[1])} priključimo izmenično napetost s temensko vrednostjo ${$(G[0])}. Kolikšna je povprečna moč na uporniku?${zaok(1)}`,
          num(P, "W", 1, [M((U0 * U0) / R, "V obrazec P = U²/R vstaviš efektivno napetost, ne temenske."), M((U0 / 2) ** 2 / R, "Efektivna napetost je U₀/√2, ne U₀/2.")]),
          "Najprej izračunaj efektivno napetost; povprečna moč je U_ef²/R.",
          G, ["\\bar{P}"], ["U_{\\text{ef}} = \\dfrac{U_0}{\\sqrt{2}}", "\\bar{P} = \\dfrac{U_{\\text{ef}}^2}{R}"],
          [`$U_{\\text{ef}}^2 = \\dfrac{U_0^2}{2} = \\dfrac{${U0 * U0}}{2}\\ \\mathrm{V^2} = ${tx((U0 * U0) / 2)}\\ \\mathrm{V^2}$`, `$\\bar{P} = \\dfrac{${tx((U0 * U0) / 2)}}{${R}}\\ \\mathrm{W} ${res(P, 1, "W")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const L = r.pick([10, 20, 40, 50, 100]), C = r.pick([1, 2, 5, 10, 22, 47, 100]), nu = 1 / (2 * PI * Math.sqrt(L * 1e-3 * C * 1e-6));
        const G = [dat("L", tx(L), "mH"), dat("C", tx(C), "µF")];
        return T(
          `Nihajni krog sestavljata tuljava z induktivnostjo ${$(G[0])} in kondenzator s kapaciteto ${$(G[1])}. Kolikšna je lastna frekvenca nihajnega kroga?${zaok(0)}`,
          num(nu, "Hz", 0, [M(nu * 2 * PI, "Pozabil si deliti z 2π: 1/√(LC) je krožna frekvenca."), M(1 / (2 * PI * L * 1e-3 * C * 1e-6) / 1e3, "Pod korenom je produkt LC.")]),
          "Uporabi Thomsonovo enačbo; L in C zapiši v osnovnih enotah (H, F).",
          G, ["\\nu_0"], "\\nu_0 = \\dfrac{1}{2\\pi\\sqrt{L\\,C}}",
          [`$L = ${tx(L / 1000)}\\ \\mathrm{H}$, $C = ${C} \\cdot 10^{-6}\\ \\mathrm{F}$`, `$L\\,C = ${tx(L * C / 1000, 3)} \\cdot 10^{-6}\\ \\mathrm{s^2}$`, `$\\nu_0 = \\dfrac{1}{2\\pi\\sqrt{L\\,C}} ${res(nu, 0, "Hz")}$`],
        );
      }
      if (level === 2) {
        const U0 = r.pick([12, 24, 100, 325]), t = r.pick([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]), ph = (PI * t) / 10, u = U0 * Math.sin(ph);
        const G = [dat("U_0", tx(U0), "V"), dat("\\nu", "50", "Hz"), dat("t", tx(t), "ms")];
        return T(
          `Napetost izvira se spreminja kot $u(t) = U_0 \\sin(\\omega t)$, kjer je ${$(G[0])} in ${$(G[1])}. Kolikšna je napetost ob času ${$(G[2])}?${zaok(1)}`,
          num(u, "V", 1, [M(U0 * Math.sin((ph * PI) / 180), "Kalkulator mora računati v radianih, ne v stopinjah."), M((U0 / S2) * Math.sin(ph), "V enačbo vstaviš temensko napetost U₀.")]),
          "Izračunaj ω = 2πν in fazo ωt v radianih.",
          G, ["u"], ["\\omega = 2\\pi\\nu", "u = U_0 \\sin(\\omega t)"],
          [`$\\omega = 2\\pi \\cdot 50\\ \\mathrm{s^{-1}} ${res(100 * PI, 1, "s^{-1}")}$`, `$\\omega t = 100\\pi \\cdot ${tx(t / 1000)} = ${tx(t / 10)}\\pi ${res(ph, 3, "")}$`, `$u = ${U0}\\ \\mathrm{V} \\cdot \\sin(${tx(ph, 3)}) ${res(u, 1, "V")}$`],
        );
      }
      if (k === 0) {
        const L = r.pick([100, 150, 200, 250, 300, 400, 500]), nu = r.pick([540, 600, 700, 810, 900, 1000, 1200, 1400, 1600]);
        const C = 1 / (4 * PI * PI * (nu * 1e3) ** 2 * L * 1e-6) * 1e12;
        const G = [dat("L", tx(L), "µH"), dat("\\nu", tx(nu), "kHz")];
        return T(
          `Radijski sprejemnik za srednje valove ima v nihajnem krogu tuljavo z induktivnostjo ${$(G[0])}. Kolikšna mora biti kapaciteta kondenzatorja, da sprejemnik ujame postajo s frekvenco ${$(G[1])}? Rezultat zapiši v pikofaradih in ga zaokroži ${dw(0)}.`,
          num(C, "pF", 0, [M(C * 2 * PI, "Kvadriraj ves imenovalec: (2πν)² = 4π²ν²."), M(C * 4 * PI * PI, "Pozabil si faktor 4π².")]),
          "Iz Thomsonove enačbe izrazi kapaciteto: C = 1/(4π²ν²L).",
          G, ["C"], "C = \\dfrac{1}{4\\pi^2\\nu^2 L}",
          [`$\\nu = ${nu} \\cdot 10^3\\ \\mathrm{Hz}$, $L = ${L} \\cdot 10^{-6}\\ \\mathrm{H}$`, `$C = \\dfrac{1}{4\\pi^2 (${nu} \\cdot 10^3)^2 \\cdot ${L} \\cdot 10^{-6}}\\ \\mathrm{F} ${res(C, 0, "pF")}$`],
        );
      }
      if (k === 1) {
        const n1 = r.pick([540, 600, 700, 800]), n2 = r.pick([1000, 1200, 1500, 1600]), C1 = r.pick([200, 300, 365, 400, 500]), C2 = C1 * (n1 / n2) ** 2;
        const G = [dat("\\nu_1", tx(n1), "kHz"), dat("C_1", tx(C1), "pF"), dat("\\nu_2", tx(n2), "kHz")];
        return T(
          `Sprejemnik je uglašen na postajo s frekvenco ${$(G[0])}, kapaciteta vrtljivega kondenzatorja je ${$(G[1])}. Na kolikšno kapaciteto moramo nastaviti kondenzator, da ujamemo postajo s frekvenco ${$(G[2])}? Induktivnost se ne spremeni.${zaok(0)}`,
          num(C2, "pF", 0, [M(C1 * (n1 / n2), "Frekvenca je obratno sorazmerna s korenom kapacitete, zato razmerje frekvenc kvadriraš."), M(C1 * (n2 / n1) ** 2, "Za višjo frekvenco potrebuješ manjšo kapaciteto, ne večje.")]),
          "Iz Thomsonove enačbe sledi ν ∝ 1/√C, torej C ∝ 1/ν².",
          G, ["C_2"], "\\dfrac{C_2}{C_1} = \\left(\\dfrac{\\nu_1}{\\nu_2}\\right)^2",
          [`Pri isti induktivnosti je $\\nu \\propto 1/\\sqrt{C}$, zato $\\dfrac{C_2}{C_1} = \\left(\\dfrac{\\nu_1}{\\nu_2}\\right)^2$.`, `$C_2 = ${C1}\\ \\mathrm{pF} \\cdot \\left(\\dfrac{${n1}}{${n2}}\\right)^2 ${res(C2, 0, "pF")}$`],
        );
      }
      const C = r.pick([1, 2, 4.7, 10, 22]), L = r.pick([5, 10, 20, 50, 100]), U0 = r.pick([5, 10, 12, 20, 50]), I0 = U0 * Math.sqrt((C * 1e-6) / (L * 1e-3)) * 1000;
      const G = [dat("C", tx(C), "µF"), dat("U_0", tx(U0), "V"), dat("L", tx(L), "mH")];
      return T(
        `Kondenzator s kapaciteto ${$(G[0])} nabijemo na napetost ${$(G[1])} in ga priključimo na tuljavo z induktivnostjo ${$(G[2])}. Kolikšen je največji tok v nihajnem krogu? Upor zanemari. Rezultat zapiši v miliamperih in ga zaokroži ${dw(1)}.`,
        num(I0, "mA", 1, [M(U0 * Math.sqrt((L * 1e-3) / (C * 1e-6)) * 1000, "Obrnil si razmerje: I₀ = U₀√(C/L)."), M(((U0 * C * 1e-6) / (L * 1e-3)) * 1000, "Razmerje C/L moraš koreniti.")]),
        "Energija električnega polja kondenzatorja se v četrt nihaja v celoti spremeni v energijo magnetnega polja tuljave.",
        G, ["I_0"], "\\tfrac{1}{2} C U_0^2 = \\tfrac{1}{2} L I_0^2",
        [`$I_0 = U_0 \\sqrt{\\dfrac{C}{L}} = ${U0}\\ \\mathrm{V} \\cdot \\sqrt{\\dfrac{${tx(C)} \\cdot 10^{-6}\\ \\mathrm{F}}{${tx(L / 1000)}\\ \\mathrm{H}}}$`, `$I_0 ${res(I0 / 1000, 4, "A")} ${res(I0, 1, "mA")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 3: elektromagnetno valovanje
  {
    id: "vrz-em-valovanje",
    topics: ["FIZ-SS-3/elektromagnetno-valovanje"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k === 0) {
        const nu = r.pick([88.1, 89.5, 91.3, 94.1, 96.4, 98.9, 100.2, 102.5, 104.8, 107.6]), lam = C0 / (nu * 1e6);
        const G = [dat("\\nu", tx(nu), "MHz"), C_DAT];
        return T(
          `Radijska postaja oddaja na frekvenci ${$(G[0])}. Kolikšna je valovna dolžina radijskih valov? Hitrost valov je ${$(G[1])}.${zaok(2)}`,
          num(lam, "m", 2, [M(lam * 1e6, "Megaherce pretvori v herce: 1 MHz = 10⁶ Hz."), M(lam / 2, "Valovna dolžina je c/ν, brez deljenja z 2.")]),
          "Valovna dolžina je hitrost valovanja, deljena s frekvenco.",
          G, ["\\lambda"], "\\lambda = \\dfrac{c}{\\nu}",
          [`$\\nu = ${tx(nu)} \\cdot 10^6\\ \\mathrm{Hz}$`, `$\\lambda = \\dfrac{3{,}00 \\cdot 10^8}{${tx(nu)} \\cdot 10^6}\\ \\mathrm{m} ${res(lam, 2, "m")}$`],
        );
      }
      if (level === 1 && k === 1) {
        const lam = 10 * r.int(40, 70), nu = 3e5 / lam;
        const G = [dat("\\lambda", tx(lam), "nm"), C_DAT];
        return T(
          `Svetloba ima v vakuumu valovno dolžino ${$(G[0])}. Kolikšna je njena frekvenca v terahercih (1 THz = 10¹² Hz)? Uporabi ${$(G[1])}.${zaok(0)}`,
          num(nu, "THz", 0, [M(nu / 1000, "1 nm = 10⁻⁹ m; preveri pretvorbo."), M(lam / 3e5, "Frekvenca je c/λ, ne λ/c.")]),
          "Valovno dolžino pretvori v metre in uporabi ν = c/λ.",
          G, ["\\nu"], "\\nu = \\dfrac{c}{\\lambda}",
          [`$\\lambda = ${lam} \\cdot 10^{-9}\\ \\mathrm{m}$`, `$\\nu = \\dfrac{3{,}00 \\cdot 10^8}{${lam} \\cdot 10^{-9}}\\ \\mathrm{Hz} ${res(nu, 0, "")} \\cdot 10^{12}\\ \\mathrm{Hz} ${res(nu, 0, "THz")}$`],
        );
      }
      if (level === 1) {
        const BANDS = [
          ["radijski valovi", "daljše od približno 1 m", [[3, "m"], [25, "m"], [300, "m"], [1.5, "km"]]],
          ["mikrovalovi", "od približno 1 mm do 1 m", [[12, "cm"], [3, "cm"], [5, "mm"], [30, "cm"]]],
          ["infrardeča svetloba", "od približno 700 nm do 1 mm", [[10, "µm"], [1500, "nm"], [50, "µm"], [900, "nm"]]],
          ["vidna svetloba", "od približno 400 nm do 700 nm", [[450, "nm"], [550, "nm"], [650, "nm"], [500, "nm"]]],
          ["ultravijolična svetloba", "od približno 10 nm do 400 nm", [[250, "nm"], [300, "nm"], [120, "nm"], [350, "nm"]]],
          ["rentgenski žarki", "od približno 0,01 nm do 10 nm", [[0.1, "nm"], [1, "nm"], [0.5, "nm"], [5, "nm"]]],
          ["žarki gama", "krajše od približno 0,01 nm", [[1, "pm"], [0.5, "pm"], [2, "pm"], [5, "pm"]]],
        ];
        const bi = r.int(0, BANDS.length - 1), [name, , vals] = BANDS[bi], [v, u] = r.pick(vals);
        const G = [dat("\\lambda", tx(v), u)];
        const wrong = BANDS.filter((_, i) => i !== bi).map(([n, rng]) => [cap(n), `Valovne dolžine ${n === "žarki gama" ? "žarkov gama" : n === "radijski valovi" ? "radijskih valov" : n === "mikrovalovi" ? "mikrovalov" : n === "rentgenski žarki" ? "rentgenskih žarkov" : `območja »${n}«`} so ${rng}.`]);
        return T(
          `Elektromagnetno valovanje ima valovno dolžino ${$(G[0])}. V kateri del spektra sodi?`,
          choice(r, cap(name), wrong),
          "Spekter od najdaljših do najkrajših valovnih dolžin: radijski valovi, mikrovalovi, infrardeča, vidna, ultravijolična svetloba, rentgenski žarki, žarki gama.",
          G, ["\\text{del spektra}"], false,
          [`Valovne dolžine območja »${name}« so ${BANDS[bi][1]}; ${tx(v).replace("{,}", ",")} ${u} je v tem območju.`, "Vsa ta valovanja so elektromagnetna in v vakuumu potujejo s svetlobno hitrostjo; razlikujejo se po valovni dolžini in frekvenci."],
        );
      }
      if (level === 2 && k === 0) {
        if (r.int(0, 1)) {
          const dm = r.int(56, 400) / 100, t = (dm * 1e11) / C0 / 60;
          const G = [dat("d", `${tx(dm)} \\cdot 10^8`, "km"), C_DAT];
          return T(
            `Mars je od Zemlje oddaljen ${$(G[0])}. Koliko minut potrebuje radijski signal, ki ga z Zemlje pošljemo roverju na Marsu? Signal potuje s hitrostjo ${$(G[1])}.${zaok(1)}`,
            num(t, "min", 1, [M(t * 60, "To je čas v sekundah; pretvori v minute."), M(t / 1000, "Kilometre pretvori v metre.")]),
            "Pretvori razdaljo v metre, izračunaj čas t = d/c in ga pretvori v minute.",
            G, ["t"], "t = \\dfrac{d}{c}",
            [`$d = ${tx(dm)} \\cdot 10^{11}\\ \\mathrm{m}$`, `$t = \\dfrac{d}{c} ${res(t * 60, 0, "s")} ${res(t, 1, "min")}$`, "Rover zato ne moremo voditi v živo: ukaz in odgovor potujeta več minut."],
          );
        }
        const [what, d] = r.pick([["od Lune do Zemlje", 384000], ["od geostacionarnega satelita do sprejemnika na ekvatorju", 35800], ["od Mednarodne vesoljske postaje do Zemlje (navpično navzdol)", 400]]);
        const t = (d * 1000) / C0, dd = d === 400 ? 5 : 3;
        const G = [dat("d", tx(d), "km"), C_DAT];
        return T(
          `Koliko časa potuje radijski signal ${what}? Razdalja je ${$(G[0])}, hitrost signala ${$(G[1])}. Rezultat zapiši v sekundah in ga zaokroži ${dw(dd)}.`,
          num(t, "s", dd, [M(t / 1000, "Kilometre pretvori v metre."), M(2 * t, "Signal potuje le v eno smer.")]),
          "Čas je razdalja, deljena s hitrostjo; razdaljo zapiši v metrih.",
          G, ["t"], "t = \\dfrac{d}{c}",
          [`$d = ${tx(d * 1000)}\\ \\mathrm{m}$`, `$t = \\dfrac{${tx(d * 1000)}}{3{,}00 \\cdot 10^8}\\ \\mathrm{s} ${res(t, dd, "s")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const t = r.int(20, 600), d = 0.15 * t;
        const G = [dat("t", tx(t), "µs"), C_DAT];
        return T(
          `Radar odda kratek sunek mikrovalov. Odmev od letala sprejme po času ${$(G[0])}. Kako daleč je letalo v kilometrih? Mikrovalovi potujejo s hitrostjo ${$(G[1])}.${zaok(2)}`,
          num(d, "km", 2, [M(2 * d, "Valovanje prepotuje pot do letala in nazaj: deliš z 2."), M(d * 1000, "Rezultat je v metrih; pretvori ga v kilometre.")]),
          "V izmerjenem času valovanje prepotuje dvojno razdaljo.",
          G, ["d"], "d = \\dfrac{c\\,t}{2}",
          [`$t = ${t} \\cdot 10^{-6}\\ \\mathrm{s}$`, `$d = \\dfrac{3{,}00 \\cdot 10^8 \\cdot ${t} \\cdot 10^{-6}}{2}\\ \\mathrm{m} = ${tx(150 * t)}\\ \\mathrm{m} ${res(d, 2, "km")}$`],
        );
      }
      if (level === 2) {
        const nu = r.pick([27, 88, 100, 146, 433, 446, 900]), lam = C0 / (nu * 1e6), L = (lam / 4) * 100;
        const G = [dat("\\nu", tx(nu), "MHz"), C_DAT];
        return T(
          `Palična antena je najučinkovitejša, ko je njena dolžina četrtina valovne dolžine. Kako dolga naj bo antena za frekvenco ${$(G[0])}? Uporabi ${$(G[1])}. Rezultat zapiši v centimetrih in ga zaokroži ${dw(1)}.`,
          num(L, "cm", 1, [M(lam * 100, "To je cela valovna dolžina; antena je dolga četrtino."), M((lam / 2) * 100, "Antena je dolga četrtino, ne polovico valovne dolžine.")]),
          "Izračunaj valovno dolžino λ = c/ν in jo deli s 4.",
          G, ["l"], ["\\lambda = \\dfrac{c}{\\nu}", "l = \\dfrac{\\lambda}{4}"],
          [`$\\lambda = \\dfrac{3{,}00 \\cdot 10^8}{${nu} \\cdot 10^6}\\ \\mathrm{m} ${res(lam, 4, "m")}$`, `$l = \\dfrac{\\lambda}{4} ${res(L, 1, "cm")}$`],
        );
      }
      if (k === 0) {
        if (r.int(0, 1)) {
          const nu = r.pick([2.4, 2.45, 2.5]), d = (C0 / (nu * 1e9) / 2) * 100;
          const G = [dat("\\nu", tx(nu), "GHz"), C_DAT];
          return T(
            `V mikrovalovni pečici nastane stoječe valovanje s frekvenco ${$(G[0])}. Hrana se najbolj segreje v hrbtih, ki so med seboj oddaljeni za polovico valovne dolžine. Kolikšna je razdalja med sosednjima hrbtoma? Uporabi ${$(G[1])}. Rezultat zapiši v centimetrih in ga zaokroži ${dw(1)}.`,
            num(d, "cm", 1, [M(2 * d, "Sosednja hrbta sta oddaljena za λ/2, ne za λ."), M(d / 2, "Razdalja med hrbtoma je λ/2, ne λ/4.")]),
            "Izračunaj valovno dolžino in jo razpolovi.",
            G, ["d"], ["\\lambda = \\dfrac{c}{\\nu}", "d = \\dfrac{\\lambda}{2}"],
            [`$\\lambda = \\dfrac{3{,}00 \\cdot 10^8}{${tx(nu)} \\cdot 10^9}\\ \\mathrm{m} ${res(2 * d, 2, "cm")}$`, `$d = \\dfrac{\\lambda}{2} ${res(d, 1, "cm")}$`],
          );
        }
        const d = r.pick([5.8, 5.9, 6, 6.1, 6.2, 6.3]), c = 2 * (d / 100) * 2.45e9 / 1000;
        const G = [dat("d", tx(d), "cm"), dat("\\nu", "2{,}45", "GHz")];
        return T(
          `${((nm) => `${nm} je v mikrovalovno pečico brez vrtljivega krožnika ${g(nm, "postavil", "postavila")}`)(r.pick(NAMES))} ploščo s čokolado. Po kratkem segrevanju se je čokolada stopila v pegah, ki so bile med seboj oddaljene ${$(G[0])} (pol valovne dolžine). Frekvenca mikrovalov je ${$(G[1])}. Kolikšno hitrost svetlobe dobimo iz tega poskusa v km/s?${zaok(0)}`,
          num(c, "km/s", 0, [M(c / 2, "Razdalja med pegama je λ/2, zato je λ = 2d."), M(c * 1000, "Rezultat je v m/s; pretvori v km/s.")]),
          "Iz razdalje med pegama določi valovno dolžino, nato c = λν.",
          G, ["c"], ["\\lambda = 2d", "c = \\lambda\\,\\nu"],
          [`$\\lambda = 2d = ${tx(2 * d)}\\ \\mathrm{cm} = ${tx((2 * d) / 100)}\\ \\mathrm{m}$`, `$c = \\lambda\\,\\nu = ${tx((2 * d) / 100)} \\cdot 2{,}45 \\cdot 10^9\\ \\mathrm{m/s} ${res(c, 0, "km/s")}$`],
        );
      }
      if (k === 1) {
        const [snovA, snovG, n] = r.pick([["vodo", "vode", 1.33], ["steklo", "stekla", 1.5], ["kremenovo steklo", "kremenovega stekla", 1.46], ["flintovo steklo", "flintovega stekla", 1.65], ["diamant", "diamanta", 2.42]]), lam = 10 * r.int(40, 70);
        if (r.int(0, 1)) {
          const l2 = lam / n;
          const G = [dat("\\lambda_0", tx(lam), "nm"), dat("n", tx(n), "")];
          return T(
            `Svetloba z valovno dolžino ${$(G[0])} (v vakuumu) vstopi v ${snovA} z lomnim količnikom ${$(G[1])}. Kolikšna je valovna dolžina svetlobe v tej snovi?${zaok(0)}`,
            num(l2, "nm", 0, [M(lam * n, "V snovi je svetloba počasnejša, frekvenca pa ostane enaka, zato je valovna dolžina krajša."), M(lam, "Frekvenca se ohrani, valovna dolžina pa se spremeni.")]),
            "Pri prehodu v snov se frekvenca ohrani, hitrost pa se zmanjša na c/n.",
            G, ["\\lambda"], "\\lambda = \\dfrac{\\lambda_0}{n}",
            [`$c' = \\dfrac{c}{n}$, $\\nu$ ostane enaka, zato $\\lambda = \\dfrac{c'}{\\nu} = \\dfrac{\\lambda_0}{n}$`, `$\\lambda = \\dfrac{${lam}\\ \\mathrm{nm}}{${tx(n)}} ${res(l2, 0, "nm")}$`],
          );
        }
        const v = 3e5 / n;
        const G = [dat("n", tx(n), ""), CKM_DAT];
        return T(
          `Lomni količnik ${snovG} je ${$(G[0])}. S kolikšno hitrostjo se svetloba širi v tej snovi? Hitrost svetlobe v vakuumu je ${$(G[1])}.${zaok(0)}`,
          num(v, "km/s", 0, [M(3e5 * n, "V snovi je svetloba počasnejša: deliš z n."), M(3e5, "Hitrost svetlobe v snovi je manjša kot v vakuumu.")]),
          "Lomni količnik pove, kolikokrat je svetloba v snovi počasnejša kot v vakuumu.",
          G, ["c'"], "c' = \\dfrac{c}{n}",
          [`$c' = \\dfrac{300\\,000\\ \\mathrm{km/s}}{${tx(n)}} ${res(v, 0, "km/s")}$`],
        );
      }
      // frekvenca vidne svetlobe (energija fotona je snov 4. letnika, zato je tu ni)
      const lam = 10 * r.int(38, 75), nu = C0 / (lam * 1e-9) / 1e12;
      const G = [dat("\\lambda", tx(lam), "nm"), C_DAT];
      return T(
        `Vidna svetloba ima v vakuumu valovno dolžino ${$(G[0])}. Kolikšna je njena frekvenca? Uporabi ${$(G[1])}. Rezultat zapiši v terahercih (1 THz = 10¹² Hz) in ga zaokroži ${dw(0)}.`,
        num(nu, "THz", 0, [M(C0 / lam / 1e12, "Nanometre pretvori v metre: 1 nm = 10⁻⁹ m."), M(nu * 1e12, "Rezultat je v hercih; pretvori ga v teraherce.")]),
        "Iz c = λν izrazi ν. Valovno dolžino najprej pretvori v metre.",
        G, ["\\nu"], "\\nu = \\dfrac{c}{\\lambda}",
        [`$\\lambda = ${lam} \\cdot 10^{-9}\\ \\mathrm{m}$`, `$\\nu = \\dfrac{3{,}00 \\cdot 10^8\\ \\mathrm{m/s}}{${lam} \\cdot 10^{-9}\\ \\mathrm{m}} \\approx ${sci3(nu * 1e12).t}\\ \\mathrm{Hz} ${res(nu, 0, "THz")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 4: osončje in gibanje planetov
  {
    id: "vrz-osoncje",
    topics: ["FIZ-SS-4/osoncje-in-gibanje-planetov"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const AE = "a.\\,e.";
      const PL = [["Merkur", 0.39, 0.579, 88], ["Venera", 0.72, 1.08, 225], ["Zemlja", 1, 1.5, 365], ["Mars", 1.52, 2.28, 687], ["Jupiter", 5.2, 7.78, 4333], ["Saturn", 9.58, 14.3, 10759]];
      if (level === 1 && k === 0) {
        const [nm, a] = r.pick([["Asteroid Ceres", 2.77], ["Mars", 1.52], ["Jupiter", 5.2], ["Saturn", 9.58], ["Uran", 19.2], ["Neptun", 30.1], ["Pritlikavi planet Pluton", 39.5], ["Asteroid Vesta", 2.36], ["Asteroid Juno", 2.67]]);
        const t = a ** 1.5;
        const G = [dat("a", tx(a), AE)];
        return T(
          `${nm} kroži okoli Sonca po tiru z veliko polosjo ${$(G[0])} (astronomskih enot; Zemlja ima veliko polos 1 a. e. in obhodni čas 1 leto). Koliko let traja en obhod? Vpiši samo število.${zaok(2)}`,
          num(t, "", 2, [M(a * a, "Po 3. Keplerjevem zakonu je t₀² sorazmeren z a³, torej t₀ = a^(3/2)."), M(a ** (2 / 3), "Obrnil si eksponent: t₀ = a^(3/2).")]),
          "Za telesa okoli Sonca velja t₀² / a³ = konst. V letih in astronomskih enotah je konstanta 1.",
          G, ["t_0"], "\\dfrac{t_0^2}{a^3} = \\dfrac{(1\\ \\text{leto})^2}{(1\\ \\text{a. e.})^3}",
          [`$t_0^2 = a^3 = ${tx(a)}^3 ${res(a ** 3, 2, "")}$`, `$t_0 = \\sqrt{${tx(a ** 3, 2)}} ${res(t, 2, "")}$ let`],
        );
      }
      if (level === 1 && k === 1) {
        const [nm, , r8, d] = r.pick(PL), v = (2 * PI * r8 * 1e8) / (d * 86400);
        const G = [dat("r", `${tx(r8)} \\cdot 10^8`, "km"), dat("t_0", tx(d), "dni")];
        return T(
          `${nm} kroži okoli Sonca po približno krožnem tiru s polmerom ${$(G[0])}. Obhodni čas je ${$(G[1])}. Kolikšna je hitrost planeta v km/s?${zaok(1)}`,
          num(v, "km/s", 1, [M(v / (2 * PI), "Pot v enem obhodu je obseg kroga 2πr."), M(v * 86400, "Dneve pretvori v sekunde: 1 dan = 86 400 s.")]),
          "V enem obhodnem času planet prepotuje obseg kroga 2πr.",
          G, ["v"], "v = \\dfrac{2\\pi r}{t_0}",
          [`$t_0 = ${d} \\cdot 86\\,400\\ \\mathrm{s} = ${tx(d * 86400)}\\ \\mathrm{s}$`, `$v = \\dfrac{2\\pi \\cdot ${tx(r8)} \\cdot 10^8\\ \\mathrm{km}}{${tx(d * 86400)}\\ \\mathrm{s}} ${res(v, 1, "km/s")}$`],
        );
      }
      if (level === 1) {
        const Q = [
          ["Kje na eliptičnem tiru se planet giblje najhitreje?", "V periheliju, ko je najbližje Soncu.", [["V afeliju, ko je najdlje od Sonca.", "Po 2. Keplerjevem zakonu zveznica Sonce–planet v enakih časih opiše enake ploščine; blizu Sonca mora zato planet v istem času prepotovati daljšo pot."], ["Povsod enako hitro.", "Razdalja do Sonca se na eliptičnem tiru spreminja, zato se po 2. Keplerjevem zakonu spreminja tudi hitrost."], ["Na koncih male osi elipse.", "Tam je planet na srednji razdalji; najhitrejši je najbližje Soncu."]], "2. Keplerjev zakon"],
          ["Kje je Sonce glede na eliptični tir planeta?", "V enem od gorišč elipse.", [["V središču elipse.", "Po 1. Keplerjevem zakonu je Sonce v gorišču, ne v središču elipse."], ["Na tiru planeta.", "Sonce je znotraj tira, v gorišču elipse."], ["V obeh goriščih hkrati.", "Sonce je v enem gorišču; drugo gorišče je prazno."]], "1. Keplerjev zakon"],
          ["Od česa je po 3. Keplerjevem zakonu odvisen obhodni čas planeta okoli Sonca?", "Od velike polosi tira.", [["Od mase planeta.", "Masa planeta je v primerjavi z maso Sonca zanemarljiva; obhodni čas je odvisen le od velike polosi."], ["Od polmera planeta.", "Velikost planeta ne vpliva na njegov tir."], ["Od hitrosti vrtenja planeta okoli svoje osi.", "Vrtenje okoli osi (dan) ni povezano z obhodom okoli Sonca (leto)."]], "3. Keplerjev zakon"],
        ];
        if (r.int(0, 2) < 2) {
          const [q, right, wrong, law] = r.pick(Q);
          return T(q, choice(r, right, wrong), "Spomni se treh Keplerjevih zakonov.", [`${tt("tir planeta")} = ${tt("elipsa")}`], [tt("odgovor")], false, [`${right} (${law})`, wrong[0][1]]);
        }
        const opts = r.shuffle(PL).slice(0, 4), right = opts.reduce((a, b) => (b[1] > a[1] ? b : a));
        const G = opts.map(([n, a]) => dat(`a_{\\text{${n}}}`, tx(a), AE));
        return T(
          `Velike polosi tirov so ${G.map($).join(", ")}. Kateri od teh planetov ima najdaljši obhodni čas?`,
          choice(r, right[0], opts.filter((o) => o !== right).map(([n, a, , d]) => [n, `${n} je bližje Soncu (${tx(a).replace("{,}", ",")} a. e.), zato je njegov obhodni čas krajši: ${d} dni.`])),
          "Po 3. Keplerjevem zakonu je obhodni čas daljši, čim večja je velika polos.",
          G, [tt("planet")], "\\dfrac{t_0^2}{a^3} = \\text{konst.}",
          [`Največjo veliko polos ima ${right[0]}: ${tx(right[1]).replace("{,}", ",")} a. e.`, `Njegov obhodni čas je ${right[3]} dni, kar je najdlje.`],
        );
      }
      if (level === 2 && k === 0) {
        const [nm, t] = r.pick([["Halleyjev komet", 76], ["Enckejev komet", 3.3], ["Komet Tempel-Tuttle", 33], ["Jupiter", 11.9], ["Saturn", 29.5], ["Uran", 84], ["Neptun", 165], ["Pluton", 248], ["Asteroid Hygiea", 5.6]]);
        const a = t ** (2 / 3);
        const G = [dat("t_0", tx(t), "let")];
        return T(
          `${nm} obkroži Sonce v ${$(G[0])}. Kolikšna je velika polos njegovega tira v astronomskih enotah? Vpiši samo število.${zaok(2)}`,
          num(a, "", 2, [M(t ** 1.5, "Obrnil si eksponent: a = t₀^(2/3)."), M(t * t, "Iz t₀² = a³ sledi a = ∛(t₀²).")]),
          "Uporabi 3. Keplerjev zakon v letih in astronomskih enotah: t₀² = a³.",
          G, ["a"], "a^3 = t_0^2",
          [`$a^3 = t_0^2 = ${tx(t)}^2 ${res(t * t, 2, "")}$`, `$a = \\sqrt[3]{${tx(t * t, 2)}} ${res(a, 2, "")}$ a. e.`],
        );
      }
      if (level === 2 && k === 1) {
        const h = 50 * r.int(4, 40), rr = (RZ + h) * 1000, v = Math.sqrt((GRAV * MZ) / rr) / 1000;
        const G = [dat("h", tx(h), "km"), GRAV_DAT, MZ_DAT, RZ_DAT];
        return T(
          `Satelit kroži okoli Zemlje na višini ${$(G[0])} nad površjem. Kolikšna je njegova hitrost? Uporabi ${$(G[1])}, ${$(G[2])} in ${$(G[3])}. Rezultat zapiši v km/s in ga zaokroži ${dw(2)}.`,
          num(v, "km/s", 2, [M(Math.sqrt((GRAV * MZ) / (h * 1000)) / 1000, "Polmer tira je R_Z + h, ne le višina nad površjem."), M(Math.sqrt((GRAV * MZ) / rr), "Rezultat je v m/s; pretvori v km/s.")]),
          "Gravitacijska sila Zemlje je centripetalna sila: G M m / r² = m v² / r.",
          G, ["v"], "v = \\sqrt{\\dfrac{G\\,M_{\\text{Z}}}{R_{\\text{Z}} + h}}",
          [`$r = R_{\\text{Z}} + h = ${RZ + h}\\ \\mathrm{km} = ${tx(rr)}\\ \\mathrm{m}$`, `$v = \\sqrt{\\dfrac{6{,}67 \\cdot 10^{-11} \\cdot 5{,}97 \\cdot 10^{24}}{${tx(rr)}}}\\ \\mathrm{m/s} ${res(v * 1000, 0, "m/s")} ${res(v, 2, "km/s")}$`],
        );
      }
      if (level === 2) {
        const h = 50 * r.int(4, 40), rr = (RZ + h) * 1000, t = (2 * PI * Math.sqrt(rr ** 3 / (GRAV * MZ))) / 60;
        const G = [dat("h", tx(h), "km"), GRAV_DAT, MZ_DAT, RZ_DAT];
        return T(
          `Satelit kroži okoli Zemlje na višini ${$(G[0])} nad površjem. Koliko minut traja en obhod? Uporabi ${$(G[1])}, ${$(G[2])} in ${$(G[3])}.${zaok(0)}`,
          num(t, "min", 0, [M((2 * PI * Math.sqrt((h * 1000) ** 3 / (GRAV * MZ))) / 60, "Polmer tira je R_Z + h."), M(t * 60, "To je čas v sekundah; pretvori v minute.")]),
          "Iz enakosti gravitacijske in centripetalne sile izpelji obhodni čas.",
          G, ["t_0"], "t_0 = 2\\pi\\sqrt{\\dfrac{r^3}{G\\,M_{\\text{Z}}}}",
          [`$r = R_{\\text{Z}} + h = ${tx(rr)}\\ \\mathrm{m}$`, `$t_0 = 2\\pi\\sqrt{\\dfrac{(${tx(rr)})^3}{6{,}67 \\cdot 10^{-11} \\cdot 5{,}97 \\cdot 10^{24}}}\\ \\mathrm{s} ${res(t * 60, 0, "s")} ${res(t, 0, "min")}$`],
        );
      }
      if (k === 0) {
        // v_p iz energijskega zakona (v_Z = 29,78 km/s pri 1 a. e.), da je tir res elipsa z danima r_p in r_a.
        const rp = r.int(5, 15) / 10, ra = r.int(30, 350) / 10, vp = roundHalfUp(29.78 * Math.sqrt((2 * ra) / (rp * (rp + ra))), 1), va = (vp * rp) / ra;
        const G = [dat("r_{\\text{p}}", tx(rp), AE), dat("r_{\\text{a}}", tx(ra), AE), dat("v_{\\text{p}}", tx(vp), "km/s")];
        return T(
          `Komet je v periheliju ${$(G[0])} od Sonca in ima tam hitrost ${$(G[2])}. V afeliju je ${$(G[1])} od Sonca. Kolikšna je njegova hitrost v afeliju?${zaok(2)}`,
          num(va, "km/s", 2, [M((vp * ra) / rp, "Obrnil si razmerje: daleč od Sonca je komet počasnejši."), M(vp, "Hitrost kometa se po 2. Keplerjevem zakonu spreminja.")]),
          "V periheliju in afeliju je hitrost pravokotna na zveznico s Soncem. Po 2. Keplerjevem zakonu je r · v tam enak.",
          G, ["v_{\\text{a}}"], "r_{\\text{p}}\\,v_{\\text{p}} = r_{\\text{a}}\\,v_{\\text{a}}",
          [`$v_{\\text{a}} = v_{\\text{p}}\\,\\dfrac{r_{\\text{p}}}{r_{\\text{a}}} = ${vp} \\cdot \\dfrac{${tx(rp)}}{${tx(ra)}}\\ \\mathrm{km/s} ${res(va, 2, "km/s")}$`],
        );
      }
      if (k === 1) {
        const th = r.pick([2, 3, 4, 6, 8, 12, 24]), t = th * 3600, rr = Math.cbrt((GRAV * MZ * t * t) / (4 * PI * PI)) / 1000, h = rr - RZ;
        const G = [dat("t_0", tx(th), "h"), GRAV_DAT, MZ_DAT, RZ_DAT];
        return T(
          `Na kolikšni višini nad površjem Zemlje mora krožiti satelit, da je njegov obhodni čas ${$(G[0])}? Uporabi ${$(G[1])}, ${$(G[2])} in ${$(G[3])}. Rezultat zapiši v kilometrih in ga zaokroži ${dw(0)}.`,
          num(h, "km", 0, [M(rr, "To je polmer tira; višina nad površjem je r − R_Z."), M(Math.cbrt((GRAV * MZ * th * th) / (4 * PI * PI)) / 1000 - RZ, "Obhodni čas pretvori v sekunde.")]),
          "Iz enakosti gravitacijske in centripetalne sile izrazi polmer tira, nato odštej polmer Zemlje.",
          G, ["h"], ["r^3 = \\dfrac{G\\,M_{\\text{Z}}\\,t_0^2}{4\\pi^2}", "h = r - R_{\\text{Z}}"],
          [`$t_0 = ${th} \\cdot 3600\\ \\mathrm{s} = ${t}\\ \\mathrm{s}$`, `$r = \\sqrt[3]{\\dfrac{6{,}67 \\cdot 10^{-11} \\cdot 5{,}97 \\cdot 10^{24} \\cdot ${t}^2}{4\\pi^2}}\\ \\mathrm{m} ${res(rr, 0, "km")}$`, `$h = r - R_{\\text{Z}} ${res(h, 0, "km")}$`],
        );
      }
      const [luna, rk, td] = r.pick([["Io", 421700, 1.769], ["Evropa", 671100, 3.551], ["Ganimed", 1070400, 7.155], ["Kalisto", 1882700, 16.69]]);
      const tt0 = td * 86400, MJ = (4 * PI * PI * (rk * 1000) ** 3) / (GRAV * tt0 * tt0), ratio = MJ / MZ;
      const G = [dat("r", tx(rk), "km"), dat("t_0", tx(td), "dneva"), GRAV_DAT, MZ_DAT];
      return T(
        `Jupitrova luna ${luna} kroži okoli Jupitra po skoraj krožnem tiru s polmerom ${$(G[0])}, obhodni čas je ${$(G[1])}. Kolikokrat je masa Jupitra večja od mase Zemlje? Uporabi ${$(G[2])} in ${$(G[3])}.${zaok(0)}`,
        num(ratio, "", 0, [M(ratio / 1e9, "Polmer pretvori v metre: (10³)³ = 10⁹."), M(ratio * 86400 * 86400, "Obhodni čas pretvori v sekunde.")]),
        "Gravitacijska sila Jupitra je centripetalna sila na luno; iz tega izrazi maso Jupitra.",
        G, ["\\dfrac{M_{\\text{J}}}{M_{\\text{Z}}}"], "M_{\\text{J}} = \\dfrac{4\\pi^2 r^3}{G\\,t_0^2}",
        [`$r = ${tx(rk * 1000)}\\ \\mathrm{m}$, $t_0 = ${tx(td)} \\cdot 86\\,400\\ \\mathrm{s} ${res(tt0, 0, "s")}$`, `$M_{\\text{J}} = \\dfrac{4\\pi^2 r^3}{G\\,t_0^2} ${res(MJ / 1e27, 2, "")} \\cdot 10^{27}\\ \\mathrm{kg}$`, `$\\dfrac{M_{\\text{J}}}{M_{\\text{Z}}} ${res(ratio, 0, "")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 4: zvezde in vesolje
  {
    id: "vrz-zvezde",
    topics: ["FIZ-SS-4/zvezde-in-vesolje"],
    gen(level, r) {
      level = lv(level);
      if (level === 1) {
        const k = r.int(0, 3);
        if (k === 0) {
          const T0 = 100 * r.int(25, 300), lam = (WIEN / T0) * 1e9;
          const G = [dat("T", tx(T0), "K"), WIEN_DAT];
          return T(
            `Površina zvezde ima temperaturo ${$(G[0])}. Pri kateri valovni dolžini zvezda seva največ? Uporabi Wienov zakon s konstanto ${$(G[1])}. Rezultat zapiši v nanometrih in ga zaokroži ${dw(0)}.`,
            num(lam, "nm", 0, [M(lam / 1000, "1 m = 10⁹ nm; preveri pretvorbo."), M(((WIEN * T0) * 1e9) / 1e12, "Valovna dolžina je obratno sorazmerna s temperaturo: λ = k_W / T.")]),
            "Po Wienovem zakonu je λ_max · T = k_W.",
            G, ["\\lambda_{\\max}"], "\\lambda_{\\max} = \\dfrac{k_{\\text{W}}}{T}",
            [`$\\lambda_{\\max} = \\dfrac{2{,}90 \\cdot 10^{-3}\\ \\mathrm{m\\,K}}{${T0}\\ \\mathrm{K}} ${res(lam, 0, "nm")}$`, lam < 400 ? "To je v ultravijoličnem delu spektra; zvezda je videti modrikasta." : lam <= 700 ? "To je v vidnem delu spektra." : "To je v infrardečem delu spektra; zvezda je videti rdečkasta."],
          );
        }
        if (k === 1) {
          const T0 = 100 * r.int(30, 120), j = (SIG * T0 ** 4) / 1e6;
          const G = [dat("T", tx(T0), "K"), SIG_DAT];
          return T(
            `Kolikšna je gostota energijskega toka, ki ga seva površina zvezde s temperaturo ${$(G[0])}? Zvezdo obravnavaj kot črno telo, ${$(G[1])}. Rezultat zapiši v MW/m² in ga zaokroži ${dw(1)}.`,
            num(j, "MW/m²", 1, [M(j * 1000, "1 MW = 10⁶ W, ne 10³ W."), M((SIG * T0 ** 3) / 1e6, "Gostota je sorazmerna s četrto potenco temperature.")], { unitAlternatives: ["MW/m2"] }),
            "Uporabi Stefanov zakon j = σT⁴.",
            G, ["j"], "j = \\sigma\\,T^4",
            [`$j = 5{,}67 \\cdot 10^{-8} \\cdot ${T0}^4\\ \\mathrm{W/m^2} \\approx ${sci3(j * 1e6).t}\\ \\mathrm{W/m^2}$`, `$j ${res(j, 1, "MW/m²")}$`],
          );
        }
        if (k === 2) {
          const lam = 10 * r.int(10, 100), T0 = WIEN / (lam * 1e-9);
          const G = [dat("\\lambda_{\\max}", tx(lam), "nm"), WIEN_DAT];
          return T(
            `Zvezda seva največ pri valovni dolžini ${$(G[0])}. Kolikšna je temperatura njene površine? Uporabi ${$(G[1])}.${zaok(0)}`,
            num(T0, "K", 0, [M(T0 / 1000, "Nanometre pretvori v metre: 1 nm = 10⁻⁹ m."), M(T0 - 273, "Rezultat je v kelvinih; ne pretvarjaj v stopinje Celzija.")]),
            "Iz Wienovega zakona izrazi temperaturo.",
            G, ["T"], "T = \\dfrac{k_{\\text{W}}}{\\lambda_{\\max}}",
            [`$\\lambda_{\\max} = ${lam} \\cdot 10^{-9}\\ \\mathrm{m}$`, `$T = \\dfrac{2{,}90 \\cdot 10^{-3}}{${lam} \\cdot 10^{-9}}\\ \\mathrm{K} ${res(T0, 0, "K")}$`],
          );
        }
        const COL = ["modra", "bela", "rumena", "oranžna", "rdeča"];
        const opts = r.shuffle(COL).slice(0, 3), hot = r.int(0, 1), right = hot ? opts.reduce((a, b) => (COL.indexOf(b) < COL.indexOf(a) ? b : a)) : opts.reduce((a, b) => (COL.indexOf(b) > COL.indexOf(a) ? b : a));
        return T(
          `Tri zvezde so različnih barv: ${opts.join(", ")}. Katera ima ${hot ? "najvišjo" : "najnižjo"} površinsko temperaturo?`,
          choice(r, `${cap(right)} zvezda`, opts.filter((o) => o !== right).map((o) => [`${cap(o)} zvezda`, `${cap(o)} zvezda je ${COL.indexOf(o) < COL.indexOf(right) ? "toplejša" : "hladnejša"}: čim višja je temperatura, tem krajša je valovna dolžina, pri kateri zvezda seva največ (Wienov zakon).`])),
          "Po Wienovem zakonu toplejša telesa sevajo največ pri krajših valovnih dolžinah: od rdeče prek rumene in bele do modre.",
          [`${tt("barve")} = ${tt(opts.join(", "))}`], [tt("zvezda")], "\\lambda_{\\max}\\,T = k_{\\text{W}}",
          [`Barva zvezde kaže, kje je vrh njenega spektra. ${cap(right)} zvezda ima vrh pri ${hot ? "najkrajši" : "najdaljši"} valovni dolžini, zato je ${hot ? "najtoplejša" : "najhladnejša"}.`, "Od najtoplejše do najhladnejše: modra, bela, rumena, oranžna, rdeča."],
        );
      }
      const k = r.int(0, 2);
      if (level === 2 && k === 0) {
        const R = r.pick([0.5, 0.8, 1.5, 2, 2.5, 5, 10, 20]), T0 = 100 * r.int(30, 120), L = R * R * (T0 / TSUN) ** 4;
        const d = L < 1 ? sig3(L) : L < 100 ? 1 : 0;
        const G = [dat("\\dfrac{R}{R_{\\odot}}", tx(R), ""), dat("T", tx(T0), "K"), TSUN_DAT];
        return T(
          `Polmer zvezde je ${R > 1 ? `${tx(R).replace("{,}", ",")}-krat večji od polmera Sonca` : `${tx(R).replace("{,}", ",")} polmera Sonca`} $(${G[0]})$, površinska temperatura pa ${$(G[1])}. Kolikšno je razmerje med izsevom zvezde in izsevom Sonca $\\dfrac{L}{L_{\\odot}}$? Temperatura Sončevega površja je ${$(G[2])}.${zaok(d)}`,
          num(L, "", d, [M(R * R * (T0 / TSUN), "Izsev je sorazmeren s četrto potenco temperature."), M(R * (T0 / TSUN) ** 4, "Izsev je sorazmeren s površino, torej s kvadratom polmera.")]),
          "Izsev je L = 4πR²σT⁴. Razmerje izsevov zapiši z razmerjema polmerov in temperatur.",
          G, ["\\dfrac{L}{L_{\\odot}}"], "\\dfrac{L}{L_{\\odot}} = \\left(\\dfrac{R}{R_{\\odot}}\\right)^2 \\left(\\dfrac{T}{T_{\\odot}}\\right)^4",
          [`$\\left(\\dfrac{T}{T_{\\odot}}\\right)^4 = \\left(\\dfrac{${T0}}{5780}\\right)^4 ${res((T0 / TSUN) ** 4, 4, "")}$`, `$\\dfrac{L}{L_{\\odot}} = ${tx(R)}^2 \\cdot ${tx((T0 / TSUN) ** 4, 4)} ${res(L, d, "")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const [nm, a] = r.pick([["Merkur", 0.39], ["Venera", 0.72], ["Zemlja", 1], ["Mars", 1.52], ["Jupiter", 5.2], ["Saturn", 9.58]]);
        const d = a * AU, j = LSUN / (4 * PI * d * d);
        const G = [dat("a", tx(a), "a.\\,e."), LSUN_DAT, AU_DAT];
        const dd = j < 100 ? 1 : 0;
        return T(
          `${nm} je od Sonca oddaljen${["Venera", "Zemlja"].includes(nm) ? "a" : ""} ${$(G[0])}. Kolikšna je gostota energijskega toka Sončevega sevanja na tej razdalji? Izsev Sonca je ${$(G[1])}, ${$(G[2])}.${zaok(dd)}`,
          num(j, "W/m²", dd, [M(LSUN / (PI * d * d), "Sevanje se porazdeli po površini krogle 4πr², ne kroga πr²."), M(LSUN / (4 * PI * a * a * 1.5e8 * 1.5e8), "Razdaljo pretvori v metre, ne v kilometre.")], { unitAlternatives: ["W/m2"] }),
          "Sonce seva enakomerno na vse strani; na razdalji r se izsev porazdeli po površini krogle 4πr².",
          G, ["j"], "j = \\dfrac{L_{\\odot}}{4\\pi r^2}",
          [`$r = ${tx(a)} \\cdot 1{,}50 \\cdot 10^{11}\\ \\mathrm{m} ${Math.abs(sci3(d).v - d) > 1e-6 * d ? "\\approx" : "="} ${sci3(d).t}\\ \\mathrm{m}$`, `$j = \\dfrac{3{,}83 \\cdot 10^{26}}{4\\pi (${sci3(d).t})^2}\\ \\mathrm{W/m^2} ${res(j, dd, "W/m²")}$`],
        );
      }
      if (level === 2) {
        const RX = [
          ["{}^{2}_{1}\\mathrm{H} + {}^{3}_{1}\\mathrm{H} \\rightarrow {}^{4}_{2}\\mathrm{He} + {}^{1}_{0}\\mathrm{n}", [["^{2}\\mathrm{H}", 2.0141, 1], ["^{3}\\mathrm{H}", 3.01605, 1]], [["^{4}\\mathrm{He}", 4.0026, 1], ["\\mathrm{n}", 1.00866, 1]]],
          ["{}^{3}_{2}\\mathrm{He} + {}^{3}_{2}\\mathrm{He} \\rightarrow {}^{4}_{2}\\mathrm{He} + 2\\,{}^{1}_{1}\\mathrm{H}", [["^{3}\\mathrm{He}", 3.01603, 2]], [["^{4}\\mathrm{He}", 4.0026, 1], ["^{1}\\mathrm{H}", 1.00783, 2]]],
          ["{}^{2}_{1}\\mathrm{H} + {}^{1}_{1}\\mathrm{H} \\rightarrow {}^{3}_{2}\\mathrm{He}", [["^{2}\\mathrm{H}", 2.0141, 1], ["^{1}\\mathrm{H}", 1.00783, 1]], [["^{3}\\mathrm{He}", 3.01603, 1]]],
          ["{}^{12}_{6}\\mathrm{C} + {}^{4}_{2}\\mathrm{He} \\rightarrow {}^{16}_{8}\\mathrm{O}", [["^{12}\\mathrm{C}", 12, 1], ["^{4}\\mathrm{He}", 4.0026, 1]], [["^{16}\\mathrm{O}", 15.99491, 1]]],
          ["{}^{2}_{1}\\mathrm{H} + {}^{2}_{1}\\mathrm{H} \\rightarrow {}^{3}_{2}\\mathrm{He} + {}^{1}_{0}\\mathrm{n}", [["^{2}\\mathrm{H}", 2.0141, 2]], [["^{3}\\mathrm{He}", 3.01603, 1], ["\\mathrm{n}", 1.00866, 1]]],
        ];
        const [eqn, L, R] = r.pick(RX);
        const mL = L.reduce((s, x) => s + x[1] * x[2], 0), mR = R.reduce((s, x) => s + x[1] * x[2], 0), dm = mL - mR, E = dm * 931.5;
        const uniq = [...new Map([...L, ...R].map((x) => [x[0], x])).values()];
        const G = [...uniq.map(([s, m]) => dat(`m(${s})`, tx(m, 5), "u")), dat("1\\ \\mathrm{u}\\,c^2", "931{,}5", "MeV")];
        const side = (S) => S.map(([s, m, n]) => (n > 1 ? `${n} \\cdot ${tx(m, 5)}` : tx(m, 5))).join(" + ");
        return T(
          `V zvezdah poteka zlivanje jeder $${eqn}$. Mase atomov so ${G.slice(0, -1).map($).join(", ")}. Koliko energije se sprosti pri eni reakciji? Uporabi ${$(G[G.length - 1])}. Rezultat zapiši v MeV in ga zaokroži ${dw(2)}.`,
          num(E, "MeV", 2, [M(mL * 931.5, "Energija ustreza masnemu primanjkljaju (razliki mas), ne vsej masi."), M(dm, "Masni primanjkljaj v u pretvori v energijo: 1 u ustreza 931,5 MeV.")]),
          "Izračunaj, za koliko je masa produktov manjša od mase reaktantov (masni primanjkljaj), in ga pretvori v energijo.",
          G, ["E"], ["\\Delta m = m_{\\text{pred}} - m_{\\text{po}}", "E = \\Delta m\\,c^2"],
          [`$m_{\\text{pred}} = ${side(L)} = ${tx(mL, 5)}\\ \\mathrm{u}$`, `$m_{\\text{po}} = ${side(R)} = ${tx(mR, 5)}\\ \\mathrm{u}$`, `$\\Delta m = ${tx(dm, 5)}\\ \\mathrm{u}$`, `$E = ${tx(dm, 5)} \\cdot 931{,}5\\ \\mathrm{MeV} ${res(E, 2, "MeV")}$`],
        );
      }
      if (k === 0) {
        const Lr = r.pick([0.01, 0.05, 0.5, 2, 10, 50, 100, 1000, 10000]), T0 = 100 * r.int(30, 250), R = Math.sqrt(Lr) * (TSUN / T0) ** 2;
        const d = R < 1 ? sig3(R) : 2;
        const G = [dat("\\dfrac{L}{L_{\\odot}}", tx(Lr), ""), dat("T", tx(T0), "K"), TSUN_DAT];
        return T(
          `Izsev zvezde je ${tx(Lr).replace("{,}", ",")}-krat tolikšen kot izsev Sonca $(${G[0]})$, temperatura njenega površja je ${$(G[1])}. Kolikšno je razmerje med polmerom zvezde in polmerom Sonca $\\dfrac{R}{R_{\\odot}}$? Temperatura Sončevega površja je ${$(G[2])}.${zaok(d)}`,
          num(R, "", d, [M(Lr * (TSUN / T0) ** 4, "Iz L ∝ R² T⁴ moraš na koncu koreniti."), M(Math.sqrt(Lr) * (TSUN / T0), "Temperaturno razmerje nastopa s kvadratom: R ∝ √L / T².")]),
          "Iz L = 4πR²σT⁴ izrazi razmerje polmerov.",
          G, ["\\dfrac{R}{R_{\\odot}}"], "\\dfrac{R}{R_{\\odot}} = \\sqrt{\\dfrac{L}{L_{\\odot}}} \\left(\\dfrac{T_{\\odot}}{T}\\right)^2",
          [`$\\sqrt{\\dfrac{L}{L_{\\odot}}} ${res(Math.sqrt(Lr), 3, "")}$, $\\left(\\dfrac{5780}{${T0}}\\right)^2 ${res((TSUN / T0) ** 2, 4, "")}$`, `$\\dfrac{R}{R_{\\odot}} ${res(R, d, "")}$`, ...(R > 50 ? ["Tako velik polmer imajo velikanke in orjakinje."] : R < 0.05 ? ["Tako majhen polmer imajo bele pritlikavke."] : [])],
        );
      }
      if (k === 1) {
        const f = r.pick([0.5, 2, 5, 10, 25, 60, 100]), dly = r.int(4, 500), Lw = f * LSUN, j0 = Lw / (4 * PI * (dly * LY) ** 2), J = sci3(j0);
        const dist = Math.sqrt(Lw / (4 * PI * J.v)) / LY;
        const G = [dat("\\dfrac{L}{L_{\\odot}}", tx(f), ""), dat("j", J.t, "W/m²"), LSUN_DAT, LY_DAT];
        return T(
          `Zvezda ima ${tx(f).replace("{,}", ",")}-krat tolikšen izsev kot Sonce $(${G[0]})$. Na Zemlji izmerimo gostoto energijskega toka njene svetlobe ${$(G[1])}. Koliko svetlobnih let je zvezda oddaljena? ${$(G[2])}, ${$(G[3])}.${zaok(0)}`,
          num(dist, "", 0, [M(dist * Math.sqrt(4 * PI), "Svetloba se razširi po površini krogle 4πr²."), M(dist * dist * LY, "Na koncu koreniš in razdaljo pretvoriš v svetlobna leta.")]),
          "Izsev se razširi po površini krogle s polmerom r: j = L / (4πr²). Izrazi r.",
          G, ["r"], "r = \\sqrt{\\dfrac{L}{4\\pi j}}",
          [`$L = ${tx(f)} \\cdot 3{,}83 \\cdot 10^{26}\\ \\mathrm{W} ${Math.abs(sci3(Lw).v - Lw) > 1e-9 * Lw ? "\\approx" : "="} ${sci3(Lw).t}\\ \\mathrm{W}$`, `$r = \\sqrt{\\dfrac{L}{4\\pi j}} \\approx ${sci3(dist * LY).t}\\ \\mathrm{m}$`, `$r = \\dfrac{${sci3(dist * LY).t}}{9{,}46 \\cdot 10^{15}} ${res(dist, 0, "")}$ sv. l.`],
        );
      }
      const l1 = 10 * r.int(20, 60), l2 = l1 + 10 * r.int(5, 50), ratio = (l2 / l1) ** 4;
      const G = [dat("\\lambda_1", tx(l1), "nm"), dat("\\lambda_2", tx(l2), "nm")];
      return T(
        `Zvezdi imata enak polmer. Prva seva največ pri valovni dolžini ${$(G[0])}, druga pri ${$(G[1])}. Kolikokrat je izsev prve zvezde večji od izseva druge?${zaok(1)}`,
        num(ratio, "", 1, [M(l2 / l1, "Izsev je sorazmeren s T⁴, zato razmerje potenciraš na četrto."), M((l1 / l2) ** 4, "Krajša valovna dolžina pomeni višjo temperaturo in večji izsev.")]),
        "Po Wienovem zakonu je T obratno sorazmerna z λ_max; po Stefanovem zakonu je pri enakem polmeru izsev sorazmeren s T⁴.",
        G, ["\\dfrac{L_1}{L_2}"], ["\\dfrac{T_1}{T_2} = \\dfrac{\\lambda_2}{\\lambda_1}", "\\dfrac{L_1}{L_2} = \\left(\\dfrac{T_1}{T_2}\\right)^4"],
        [`$\\dfrac{T_1}{T_2} = \\dfrac{${l2}}{${l1}} ${res(l2 / l1, 4, "")}$`, `$\\dfrac{L_1}{L_2} = \\left(\\dfrac{${l2}}{${l1}}\\right)^4 ${res(ratio, 1, "")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2 kemija: lastnosti elementov v periodnem sistemu
  {
    id: "vrz-periodne-lastnosti",
    topics: ["KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      // simbol, ime, Z, skupina, perioda, vrsta (k = kovina, n = nekovina, p = polkovina)
      const EL = [
        ["Li", "litij", 3, 1, 2, "k"], ["Be", "berilij", 4, 2, 2, "k"], ["B", "bor", 5, 13, 2, "p"], ["C", "ogljik", 6, 14, 2, "n"], ["N", "dušik", 7, 15, 2, "n"], ["O", "kisik", 8, 16, 2, "n"], ["F", "fluor", 9, 17, 2, "n"],
        ["Na", "natrij", 11, 1, 3, "k"], ["Mg", "magnezij", 12, 2, 3, "k"], ["Al", "aluminij", 13, 13, 3, "k"], ["Si", "silicij", 14, 14, 3, "p"], ["P", "fosfor", 15, 15, 3, "n"], ["S", "žveplo", 16, 16, 3, "n"], ["Cl", "klor", 17, 17, 3, "n"],
        ["K", "kalij", 19, 1, 4, "k"], ["Ca", "kalcij", 20, 2, 4, "k"], ["Ga", "galij", 31, 13, 4, "k"], ["Ge", "germanij", 32, 14, 4, "p"], ["As", "arzen", 33, 15, 4, "p"], ["Se", "selen", 34, 16, 4, "n"], ["Br", "brom", 35, 17, 4, "n"],
        ["Rb", "rubidij", 37, 1, 5, "k"], ["Sr", "stroncij", 38, 2, 5, "k"], ["In", "indij", 49, 13, 5, "k"], ["Sn", "kositer", 50, 14, 5, "k"], ["Sb", "antimon", 51, 15, 5, "p"], ["Te", "telur", 52, 16, 5, "p"], ["I", "jod", 53, 17, 5, "n"],
        ["Cs", "cezij", 55, 1, 6, "k"], ["Ba", "barij", 56, 2, 6, "k"],
      ];
      const val = (e) => (e[3] <= 2 ? e[3] : e[3] - 10);
      const nm = (e) => `${e[1]} (${e[0]})`;
      const TYPES = { k: ["kovina", "leži levo od stopničaste meje med kovinami in nekovinami"], n: ["nekovina", "leži desno zgoraj od stopničaste meje"], p: ["polkovina", "leži ob stopničasti meji (B, Si, Ge, As, Sb, Te)"] };
      if (level === 1 && k === 0) {
        // selen izpustimo: nekateri učbeniki ga štejejo med polkovine
        const e = r.pick(EL.filter((x) => x[0] !== "Se")), [right, why] = TYPES[e[5]];
        return T(
          `Ali je ${nm(e)} kovina, nekovina ali polkovina?`,
          choice(r, cap(right), Object.entries(TYPES).filter(([t]) => t !== e[5]).map(([, [n]]) => [cap(n), `${cap(e[1])} ${why}, zato je ${right}.`])),
          "Poišči element v periodnem sistemu: kovine so levo od stopničaste meje (B–Si–Ge–As–Sb–Te), nekovine desno zgoraj, polkovine ob meji.",
          [`${tt("element")} = ${tt(nm(e))}`], [tt("vrsta elementa")], false,
          [`${cap(e[1])} je v ${e[4]}. periodi in ${e[3]}. skupini.`, `${cap(e[1])} ${why}, zato je ${right}.`],
        );
      }
      if (level === 1) {
        const e = r.pick(EL), asksShells = k === 2;
        const ans = asksShells ? e[4] : val(e);
        return T(
          `Element ima vrstno število $Z = ${e[2]}$. ${asksShells ? "Koliko elektronskih lupin (energijskih nivojev) zasedajo elektroni v njegovem atomu?" : "Koliko valenčnih elektronov ima njegov atom?"}`,
          num(ans, "", null, asksShells ? [M(val(e), "To je število valenčnih elektronov; število lupin je enako številki periode."), M(e[3], "Številka skupine ne pove števila lupin.")] : [M(e[3], "Pri skupinah 13–17 je število valenčnih elektronov enako številki skupine minus 10."), M(e[4], "To je številka periode (število lupin)."), M(8 - val(e), "Toliko elektronov atomu manjka do okteta.")]),
          asksShells ? "Poišči element v periodnem sistemu: številka periode pove število lupin." : "Poišči element v periodnem sistemu: pri glavnih skupinah število valenčnih elektronov pove številka skupine (pri 13–17 odšteješ 10).",
          [`Z = ${e[2]}`], [asksShells ? tt("število lupin") : tt("število valenčnih elektronov")], false,
          [`Element z $Z = ${e[2]}$ je ${nm(e)}, v ${e[4]}. periodi in ${e[3]}. skupini.`, asksShells ? `Elektroni zasedajo ${e[4]} lupin${e[4] === 2 ? "i" : e[4] <= 4 ? "e" : ""}.` : `Valenčnih elektronov je ${val(e)}.`],
        );
      }
      if (level === 2 && k === 0) {
        let set, byPeriod;
        do {
          byPeriod = r.int(0, 1);
          if (byPeriod) {
            const p = r.int(2, 5);
            set = r.shuffle(EL.filter((e) => e[4] === p)).slice(0, 3);
          } else {
            const g = r.pick([1, 2, 13, 14, 15, 16, 17]);
            set = r.shuffle(EL.filter((e) => e[3] === g)).slice(0, 3);
          }
        } while (set.length < 3);
        const PROPS = [
          ["največji polmer atoma", 1, "polmer atoma"],
          ["največjo elektronegativnost", -1, "elektronegativnost"],
          ["najbolj izražen kovinski značaj", 1, "kovinski značaj"],
          ["najmanjši polmer atoma", -1, "polmer atoma"],
          ...(byPeriod ? [] : [["največjo prvo ionizacijsko energijo", -1, "ionizacijska energija"]]),
        ];
        const [q, dirn, what] = r.pick(PROPS);
        // pozicija: v periodi levo = večji polmer, v skupini nižje = večji polmer
        const pos = (e) => (byPeriod ? -e[3] : e[4]);
        const right = set.reduce((a, b) => (dirn * pos(b) > dirn * pos(a) ? b : a));
        const rule = byPeriod ? "V periodi od leve proti desni narašča naboj jedra, elektroni pa so v isti lupini, zato se polmer atoma manjša, elektronegativnost in ionizacijska energija pa večata; kovinski značaj slabi." : "V skupini navzdol ima atom vedno več lupin, zato se polmer atoma veča, elektronegativnost in ionizacijska energija pa manjšata; kovinski značaj se krepi.";
        return T(
          `Kateri od elementov ${set.map(nm).join(", ")} ima ${q}?`,
          choice(r, cap(nm(right)), set.filter((e) => e !== right).map((e) => [cap(nm(e)), `${cap(e[1])} je ${byPeriod ? `v ${e[3]}. skupini, ${e[3] < right[3] ? "levo" : "desno"} od elementa ${right[0]}` : `v ${e[4]}. periodi, ${e[4] < right[4] ? "višje" : "nižje"} od elementa ${right[0]}`}. ${rule}`])),
          byPeriod ? "Vsi trije elementi so v isti periodi. Kako se lastnost spreminja od leve proti desni?" : "Vsi trije elementi so v isti skupini. Kako se lastnost spreminja od zgoraj navzdol?",
          [`${tt("elementi")} = ${tt(set.map((e) => e[0]).join(", "))}`], [tt("element")], false,
          [`Elementi so v ${byPeriod ? `${set[0][4]}. periodi` : `${set[0][3]}. skupini`}. ${rule}`, `${cap(what)}: odgovor je ${nm(right)}.`],
        );
      }
      const OXE = EL.filter((e) => !["O", "F"].includes(e[0]) && e[4] <= 5 && !["In", "Sn", "Sb", "Te", "I", "Ga", "Ge", "As", "Se", "Br"].includes(e[0]));
      if (level === 2 && k === 1) {
        const e = r.pick(OXE), n = val(e);
        return T(
          `Kolikšno je najvišje oksidacijsko število, ki ga lahko ima ${nm(e)} v spojinah?`,
          num(n, "", null, [M(e[3], "Pri skupinah 13–17 je najvišje oksidacijsko število enako številki skupine minus 10."), M(8 - n, "Toliko elektronov atom sprejme do okteta; to je najnižje (negativno) oksidacijsko število.")]),
          "Najvišje oksidacijsko število elementa glavne skupine je enako številu njegovih valenčnih elektronov.",
          [`${tt("element")} = ${tt(nm(e))}`], [tt("najvišje oksidacijsko število")], false,
          [`${cap(e[1])} je v ${e[3]}. skupini in ima ${n} valenčn${n === 1 ? "i elektron" : n === 2 ? "a elektrona" : n <= 4 ? "e elektrone" : "ih elektronov"}.`, `V spojinah s kisikom jih lahko odda (ali deli) vse, zato je najvišje oksidacijsko število $+${n}$.`],
        );
      }
      if (level === 2) {
        const e = r.pick(OXE), n = val(e), O = n % 2 ? n : n / 2, E2 = n % 2 ? 2 : 1;
        const f = `${e[0]}${E2 > 1 ? 2 : ""}${O > 1 ? `O${O}` : "O"}`;
        return T(
          `Koliko atomov kisika je v formuli oksida, v katerem ima ${nm(e)} najvišje oksidacijsko število? Formulo zapiši z najmanjšimi celimi indeksi.`,
          num(O, "", null, n % 2 ? [M(n / 2, "Pri lihem oksidacijskem številu potrebuješ dva atoma elementa: E₂Oₙ."), M(2 * n, "Kisik ima oksidacijsko število −2; vsota oksidacijskih števil v spojini je 0.")] : [M(n, "Pri sodem oksidacijskem številu indeksa okrajšaš: na en atom elementa pride n/2 atomov kisika."), M(2 * n, "Kisik ima oksidacijsko število −2; vsota oksidacijskih števil v spojini je 0.")]),
          "Najvišje oksidacijsko število je enako številu valenčnih elektronov. Kisik ima −2, vsota v spojini je 0.",
          [`${tt("element")} = ${tt(nm(e))}`], [tt("število atomov O")], "\\text{vsota oksidacijskih števil} = 0",
          [`Najvišje oksidacijsko število elementa ${e[0]} je $+${n}$, kisika $-2$.`, `Formula: $${ftex(f)}$, saj je $${E2} \\cdot (+${n}) + ${O} \\cdot (-2) = 0$.`],
        );
      }
      if (k === 1) return sortiraj("oksidi", r.pick([2, 3]), r);
      if (k === 0) {
        const f = r.pick(["Li2O", "Na2O", "K2O", "MgO", "CaO", "Al2O3", "SiO2", "P2O5", "SO2", "SO3", "CO2", "N2O5", "Cl2O7", "Fe2O3", "B2O3"]);
        const a = atoms(f), els = Object.keys(a), Mx = molar(f), w = ((a.O * AR.O) / Mx) * 100;
        const G = arList(els);
        return T(
          `Izračunaj masni delež kisika v oksidu $${ftex(f)}$. Uporabi ${arText(els)}. Rezultat zapiši v odstotkih in ga zaokroži ${dw(1)}.`,
          num(w, "%", 1, [M((AR.O / Mx) * 100, "Upoštevaj vse atome kisika v formuli."), M(((a.O * AR.O) / (Mx - a.O * AR.O)) * 100, "Maso kisika deliš z molsko maso cele spojine.")]),
          "Masni delež je masa kisika v enem molu spojine, deljena z molsko maso spojine.",
          G, ["w(\\mathrm{O})"], "w(\\mathrm{O}) = \\dfrac{N(\\mathrm{O})\\,A_r(\\mathrm{O})}{M_r}",
          [molarSteps(f), `$w(\\mathrm{O}) = \\dfrac{${a.O} \\cdot 16{,}00}{${tx(Mx, 2)}} \\cdot 100\\ \\% ${res(w, 1, "%")}$`],
        );
      }
      const RX = [
        ["Na2O", "Na_2O + H_2O \\rightarrow 2\\,NaOH", "NaOH", 2],
        ["K2O", "K_2O + H_2O \\rightarrow 2\\,KOH", "KOH", 2],
        ["Li2O", "Li_2O + H_2O \\rightarrow 2\\,LiOH", "LiOH", 2],
        ["CaO", "CaO + H_2O \\rightarrow Ca(OH)_2", "Ca(OH)2", 1],
        ["MgO", "MgO + H_2O \\rightarrow Mg(OH)_2", "Mg(OH)2", 1],
        ["SO3", "SO_3 + H_2O \\rightarrow H_2SO_4", "H2SO4", 1],
        ["N2O5", "N_2O_5 + H_2O \\rightarrow 2\\,HNO_3", "HNO3", 2],
        ["P4O10", "P_4O_{10} + 6\\,H_2O \\rightarrow 4\\,H_3PO_4", "H3PO4", 4],
      ];
      const [ox, eqn, prod, kf] = r.pick(RX), m = r.int(4, 60) / 2, Mo = molar(ox), Mp = molar(prod), mp = (m / Mo) * kf * Mp;
      const els = [...new Set([...Object.keys(atoms(ox)), ...Object.keys(atoms(prod))])];
      const G = [dat(`m(${ftex(ox)})`, tx(m), "g"), ...arList(els)];
      return T(
        `Oksid reagira z vodo: $\\mathrm{${eqn}}$. Koliko gramov $${ftex(prod)}$ nastane iz ${$(G[0])} oksida? Uporabi ${arText(els)}.${zaok(2)}`,
        num(mp, "g", 2, [M((m / Mo) * Mp, "Upoštevaj množinsko razmerje iz enačbe."), M(m, "Masa produkta ni enaka masi oksida; računaj z množino.")]),
        "Maso oksida pretvori v množino, z razmerjem iz enačbe izračunaj množino produkta in jo pretvori v maso.",
        G, [`m(${ftex(prod)})`], ["n = \\dfrac{m}{M}", `n(${ftex(prod)}) = ${kf > 1 ? kf : ""}\\,n(${ftex(ox)})`],
        [molarSteps(ox), molarSteps(prod), `$n(${ftex(ox)}) = \\dfrac{${tx(m)}}{${tx(Mo, 2)}}\\ \\mathrm{mol} ${res(m / Mo, 4, "mol")}$`, `$n(${ftex(prod)}) = ${kf} \\cdot ${tx(m / Mo, 4)}\\ \\mathrm{mol} ${res((m / Mo) * kf, 4, "mol")}$`, `$m = n\\,M ${res(mp, 2, "g")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2 kemija: alkalijske kovine in halogeni
  {
    id: "vrz-alkalijske",
    topics: ["KEM-SS-2/alkalijske-kovine-in-halogeni"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const ALK = [["Li", "litij", "litijev"], ["Na", "natrij", "natrijev"], ["K", "kalij", "kalijev"]];
      if (level === 1 && k === 0) {
        const [s, n] = r.pick(ALK), nm = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2]);
        const G = [dat(`n(\\mathrm{${s}})`, tx(nm), "mol")];
        return T(
          `Z vodo zreagira ${$(G[0])} ${n === "litij" ? "litija" : n === "natrij" ? "natrija" : "kalija"}: $\\mathrm{2\\,${s} + 2\\,H_2O \\rightarrow 2\\,${s}OH + H_2}$. Koliko molov vodika nastane?`,
          num(nm / 2, "mol", null, [M(nm, "Iz dveh molov kovine nastane en mol vodika."), M(2 * nm, "Razmerje je 2 : 1, torej deliš z 2.")]),
          "Iz urejene enačbe preberi množinsko razmerje med kovino in vodikom.",
          G, ["n(\\mathrm{H_2})"], `n(\\mathrm{H_2}) = \\tfrac{1}{2}\\,n(\\mathrm{${s}})`,
          [`Iz enačbe: $n(\\mathrm{${s}}) : n(\\mathrm{H_2}) = 2 : 1$`, `$n(\\mathrm{H_2}) = \\dfrac{${tx(nm)}}{2}\\ \\mathrm{mol} = ${tx(nm / 2)}\\ \\mathrm{mol}$`],
        );
      }
      if (level === 1 && k === 1) {
        const alk = r.int(0, 1), most = r.int(0, 1);
        const SER = alk ? [["Li", "litij"], ["Na", "natrij"], ["K", "kalij"], ["Rb", "rubidij"], ["Cs", "cezij"]] : [["F₂", "fluor"], ["Cl₂", "klor"], ["Br₂", "brom"], ["I₂", "jod"]];
        const opts = r.shuffle(SER).slice(0, 3), idx = (o) => SER.indexOf(o);
        // alkalijske kovine: reaktivnost narašča navzdol; halogeni: reaktivnost pada navzdol
        const score = (o) => (alk ? idx(o) : -idx(o)) * (most ? 1 : -1);
        const right = opts.reduce((a, b) => (score(b) > score(a) ? b : a));
        const rule = alk ? "Alkalijske kovine oddajo en elektron. Navzdol po skupini je valenčni elektron dlje od jedra in ga atom laže odda, zato reaktivnost narašča." : "Halogeni sprejmejo en elektron. Navzdol po skupini je atom večji in privlak jedra na dodatni elektron šibkejši, zato reaktivnost pada.";
        return T(
          alk ? `Katera od kovin ${opts.map((o) => o[1]).join(", ")} reagira z vodo ${most ? "najburneje" : "najmanj burno"}?` : `Kateri od halogenov ${opts.map((o) => o[1]).join(", ")} je ${most ? "najreaktivnejši" : "najmanj reaktiven"}?`,
          choice(r, cap(right[1]), opts.filter((o) => o !== right).map((o) => [cap(o[1]), `${cap(o[1])} je v skupini ${idx(o) < idx(right) ? "višje" : "nižje"} kot ${right[1]}. ${rule}`])),
          alk ? "Kako se po 1. skupini navzdol spreminja, kako lahko atom odda valenčni elektron?" : "Kako se po 17. skupini navzdol spreminja, kako močno atom privlači dodatni elektron?",
          [`${tt(alk ? "kovine" : "halogeni")} = ${tt(opts.map((o) => o[0]).join(", "))}`], [tt("element")], false,
          [rule, `${most ? "Najreaktivnejši" : "Najmanj reaktiven"} je zato ${right[1]}.`],
        );
      }
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [s, n] = r.pick(ALK);
          return T(
            `Kateri produkti nastanejo pri reakciji ${n === "litij" ? "litija" : n === "natrij" ? "natrija" : "kalija"} z vodo?`,
            choice(r, `${s}OH + H₂`, [[`${s}₂O + H₂`, "Z vodo nastane hidroksid, ne oksid."], [`${s}OH + O₂`, "Atomi kisika ostanejo v hidroksidu; sprosti se vodik."], [`${s}H + O₂`, "Kovina odda elektron vodikovemu atomu vode; nastaneta hidroksid in plin vodik."]]),
            "Alkalijske kovine z vodo tvorijo hidrokside; sprošča se plin, ki gori.",
            [`${tt("reaktanta")} = ${tt(`${s}, H₂O`)}`], [tt("produkti")], false,
            [`$\\mathrm{2\\,${s} + 2\\,H_2O \\rightarrow 2\\,${s}OH + H_2}$`, "Raztopina postane bazična (hidroksidni ioni), sproščeni vodik lahko zagori."],
          );
        }
        if (t === 1) {
          const [s] = r.pick([...ALK, ["Rb"], ["Cs"]]), [x] = r.pick([["Cl"], ["Br"], ["I"], ["F"]]);
          return T(
            `Alkalijska kovina reagira s halogenom: $\\mathrm{2\\,${s} + ${x}_2 \\rightarrow\\ ?}$ Katera spojina nastane?`,
            choice(r, `${s}${x}`, [[`${s}${x}₂`, `Alkalijska kovina tvori ion ${s}⁺, halogen ion ${x}⁻, zato je razmerje 1 : 1.`], [`${s}₂${x}`, `Halogenidni ion ima naboj −1, ne −2, zato je razmerje 1 : 1.`], [`${s}₂${x}₂`, "Formulo ionske spojine zapišemo z najmanjšimi celimi indeksi."]]),
            "Alkalijska kovina odda en elektron (ion z nabojem +1), halogen sprejme enega (ion z nabojem −1).",
            [`${tt("reaktanta")} = ${tt(`${s}, ${x}₂`)}`], [tt("produkt")], false,
            [`$\\mathrm{2\\,${s} + ${x}_2 \\rightarrow 2\\,${s}${x}}$`, `Nastane ionska spojina iz ionov $\\mathrm{${s}^+}$ in $\\mathrm{${x}^-}$ (halogenid).`],
          );
        }
        const H = ["Cl", "Br", "I"], a = r.int(0, 2);
        let b;
        do b = r.int(0, 2);
        while (b === a);
        const X = H[a], Y = H[b], goes = a < b;
        const right = goes ? `2 K${X} + ${Y}₂` : "Reakcija ne poteče.";
        const wrong = goes ? [["Reakcija ne poteče.", `${X === "Cl" ? "Klor" : "Brom"} je reaktivnejši od ${Y === "Br" ? "broma" : "joda"} in ga izpodrine.`], [`K${X}${Y}`, "Halogen izpodrine drugega halogena iz soli; nastaneta nova sol in element."]] : [[`2 K${X} + ${Y}₂`, `${X === "Br" ? "Brom" : "Jod"} je manj reaktiven od ${Y === "Cl" ? "klora" : "broma"}, zato ga ne more izpodriniti iz soli.`], [`K${X}${Y}`, "Halogeni ne tvorijo takšnih spojin s kalijem; reaktivnejši halogen ostane v soli."]];
        return T(
          `Kaj se zgodi, ko v raztopino kalijevega ${Y === "Cl" ? "klorida" : Y === "Br" ? "bromida" : "jodida"} dodamo ${X === "Cl" ? "klorovico" : X === "Br" ? "bromovico" : "raztopino joda"}: $\\mathrm{${X}_2 + 2\\,K${Y} \\rightarrow\\ ?}$`,
          choice(r, right, wrong),
          "Reaktivnejši halogen (višje v 17. skupini) izpodrine manj reaktivnega iz njegove soli.",
          [`${tt("reaktanta")} = ${tt(`${X}₂, K${Y}`)}`], [tt("produkti")], false,
          [goes ? `$\\mathrm{${X}_2 + 2\\,K${Y} \\rightarrow 2\\,K${X} + ${Y}_2}$` : `${X === "Br" ? "Brom" : "Jod"} je v 17. skupini nižje kot ${Y === "Cl" ? "klor" : "brom"}, zato je manj reaktiven.`, goes ? `${X === "Cl" ? "Klor" : "Brom"} je reaktivnejši (v skupini višje), zato izpodrine ${Y === "Br" ? "brom" : "jod"}.` : "Reakcija ne poteče."],
        );
      }
      if (level === 2 && k === 2) return sortiraj("halogeni", 2, r);
      if (level === 2) {
        const [s, n, adj] = r.pick(ALK), m = r.int(10, 200) / 10, A = AR[s], nn = m / A;
        if (k === 0) {
          const V = (nn / 2) * VM;
          const G = [dat(`m(\\mathrm{${s}})`, tx(m), "g"), dat(`A_r(\\mathrm{${s}})`, tx(A, 2), ""), VM_DAT];
          return T(
            `${tx(m).replace("{,}", ",")} g ${n === "litij" ? "litija" : n === "natrij" ? "natrija" : "kalija"} $(${G[0]})$ zreagira z vodo: $\\mathrm{2\\,${s} + 2\\,H_2O \\rightarrow 2\\,${s}OH + H_2}$. Kolikšna prostornina vodika nastane pri normalnih pogojih? Uporabi $${G[1]}$ in ${$(G[2])}.${zaok(2)}`,
            num(V, "L", 2, [M(nn * VM, "Iz dveh molov kovine nastane en mol vodika."), M((m / 2) * VM, "Maso najprej pretvori v množino.")]),
            "Maso kovine pretvori v množino, upoštevaj razmerje 2 : 1 in pomnoži z molsko prostornino.",
            G, ["V(\\mathrm{H_2})"], ["n = \\dfrac{m}{M}", "V = n\\,V_{\\text{m}}"],
            [`$n(\\mathrm{${s}}) = \\dfrac{${tx(m)}}{${tx(A, 2)}}\\ \\mathrm{mol} ${res(nn, 4, "mol")}$`, `$n(\\mathrm{H_2}) = \\tfrac{1}{2}\\,n(\\mathrm{${s}}) ${res(nn / 2, 4, "mol")}$`, `$V = ${tx(nn / 2, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`],
          );
        }
        const Mh = molar(`${s}OH`), mh = nn * Mh;
        const G = [dat(`m(\\mathrm{${s}})`, tx(m), "g"), ...arList([s, "O", "H"])];
        return T(
          `Koliko gramov ${adj}ega hidroksida nastane, ko z vodo zreagira ${$(G[0])} ${n === "litij" ? "litija" : n === "natrij" ? "natrija" : "kalija"}? Uporabi ${arText([s, "O", "H"])}.${zaok(2)}`,
          num(mh, "g", 2, [M(m, "Masa hidroksida ni enaka masi kovine: dodata se kisik in vodik."), M((m * A) / Mh, "Obrnil si razmerje molskih mas.")]),
          "Iz enačbe 2 M + 2 H₂O → 2 MOH + H₂: iz enega mola kovine nastane en mol hidroksida.",
          G, [`m(\\mathrm{${s}OH})`], ["n = \\dfrac{m}{M}", `n(\\mathrm{${s}OH}) = n(\\mathrm{${s}})`],
          [`$n(\\mathrm{${s}}) = \\dfrac{${tx(m)}}{${tx(A, 2)}}\\ \\mathrm{mol} ${res(nn, 4, "mol")}$`, molarSteps(`${s}OH`), `$m = ${tx(nn, 4)} \\cdot ${tx(Mh, 2)}\\ \\mathrm{g} ${res(mh, 2, "g")}$`],
        );
      }
      if (k === 0) {
        const [X, Y] = r.pick([["Cl", "Br"], ["Cl", "I"], ["Br", "I"]]), m = r.int(10, 100) / 2, MKY = molar(`K${Y}`), n = m / MKY, askV = X === "Cl" && r.int(0, 1);
        const els = askV ? ["K", Y] : ["K", Y];
        const G = [dat(`m(\\mathrm{K${Y}})`, tx(m), "g"), ...arList(els), ...(askV ? [VM_DAT] : [])];
        const ans = askV ? (n / 2) * VM : (n / 2) * 2 * AR[Y];
        return T(
          `Raztopina vsebuje ${$(G[0])} kalijevega ${Y === "Br" ? "bromida" : "jodida"}. Uvajamo ${X === "Cl" ? "klor" : "brom"}: $\\mathrm{${X}_2 + 2\\,K${Y} \\rightarrow 2\\,K${X} + ${Y}_2}$. ${askV ? "Kolikšna prostornina klora (pri normalnih pogojih) je potrebna za popolno reakcijo?" : `Koliko gramov ${Y === "Br" ? "broma" : "joda"} nastane?`} Uporabi ${arText(els)}${askV ? ` in ${$(dat("V_{\\text{m}}", "22{,}4", "L/mol"))}` : ""}.${zaok(2)}`,
          num(ans, askV ? "L" : "g", 2, [M(askV ? n * VM : n * 2 * AR[Y], `Iz enačbe: 2 mol K${Y} ustrezata 1 mol ${askV ? "Cl₂" : `${Y}₂`}, zato množino K${Y} deliš z 2.`), M(askV ? NaN : (n / 2) * AR[Y], `Molekula ${Y}₂ ima dva atoma: M = 2 A_r.`)]),
          "Maso soli pretvori v množino in uporabi razmerje iz enačbe (2 : 1).",
          G, [askV ? "V(\\mathrm{Cl_2})" : `m(\\mathrm{${Y}_2})`], ["n = \\dfrac{m}{M}", askV ? "V = n\\,V_{\\text{m}}" : "m = n\\,M"],
          [molarSteps(`K${Y}`), `$n(\\mathrm{K${Y}}) = \\dfrac{${tx(m)}}{${tx(MKY, 2)}}\\ \\mathrm{mol} ${res(n, 4, "mol")}$`, `$n(\\mathrm{${askV ? X : Y}_2}) = \\tfrac{1}{2}\\,n(\\mathrm{K${Y}}) ${res(n / 2, 4, "mol")}$`, askV ? `$V = ${tx(n / 2, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(ans, 2, "L")}$` : `$m = ${tx(n / 2, 4)} \\cdot ${tx(2 * AR[Y], 2)}\\ \\mathrm{g} ${res(ans, 2, "g")}$`],
        );
      }
      if (k === 1) {
        const [s] = r.pick([["Na"], ["K"]]), V = r.int(5, 60) / 10, n = V / VM, f = `${s}Cl`, Mf = molar(f), m = 2 * n * Mf;
        const G = [dat("V(\\mathrm{Cl_2})", tx(V), "L"), VM_DAT, ...arList([s, "Cl"])];
        return T(
          `${s === "Na" ? "Natrij" : "Kalij"} gori v kloru: $\\mathrm{2\\,${s} + Cl_2 \\rightarrow 2\\,${s}Cl}$. Pri reakciji se porabi ${$(G[0])} klora (normalni pogoji). Koliko gramov soli nastane? Uporabi ${$(G[1])}, ${arText([s, "Cl"])}.${zaok(2)}`,
          num(m, "g", 2, [M(n * Mf, "Iz enega mola klora nastaneta dva mola soli."), M(V * Mf, "Prostornino plina najprej pretvori v množino: n = V/V_m.")]),
          "Prostornino klora pretvori v množino, upoštevaj razmerje 1 : 2 in izračunaj maso soli.",
          G, [`m(\\mathrm{${f}})`], ["n = \\dfrac{V}{V_{\\text{m}}}", `n(\\mathrm{${f}}) = 2\\,n(\\mathrm{Cl_2})`],
          [`$n(\\mathrm{Cl_2}) = \\dfrac{${tx(V)}}{22{,}4}\\ \\mathrm{mol} ${res(n, 4, "mol")}$`, `$n(\\mathrm{${f}}) = 2 \\cdot ${tx(n, 4)}\\ \\mathrm{mol} ${res(2 * n, 4, "mol")}$`, molarSteps(f), `$m = ${tx(2 * n, 4)} \\cdot ${tx(Mf, 2)}\\ \\mathrm{g} ${res(m, 2, "g")}$`],
        );
      }
      const [s, n] = r.pick(ALK), V = r.int(5, 60) / 10, nH = V / VM, m = 2 * nH * AR[s];
      const G = [dat("V(\\mathrm{H_2})", tx(V), "L"), VM_DAT, dat(`A_r(\\mathrm{${s}})`, tx(AR[s], 2), "")];
      return T(
        `Pri reakciji ${n === "litij" ? "litija" : n === "natrij" ? "natrija" : "kalija"} z vodo smo zbrali ${$(G[0])} vodika (normalni pogoji): $\\mathrm{2\\,${s} + 2\\,H_2O \\rightarrow 2\\,${s}OH + H_2}$. Koliko gramov kovine je zreagiralo? Uporabi ${$(G[1])} in $${G[2]}$.${zaok(2)}`,
        num(m, "g", 2, [M(nH * AR[s], "Za en mol vodika potrebuješ dva mola kovine."), M(V * AR[s], "Prostornino plina najprej pretvori v množino.")]),
        "Prostornino vodika pretvori v množino in uporabi razmerje iz enačbe.",
        G, [`m(\\mathrm{${s}})`], ["n = \\dfrac{V}{V_{\\text{m}}}", `n(\\mathrm{${s}}) = 2\\,n(\\mathrm{H_2})`],
        [`$n(\\mathrm{H_2}) = \\dfrac{${tx(V)}}{22{,}4}\\ \\mathrm{mol} ${res(nH, 4, "mol")}$`, `$n(\\mathrm{${s}}) = 2\\,n(\\mathrm{H_2}) ${res(2 * nH, 4, "mol")}$`, `$m = ${tx(2 * nH, 4)} \\cdot ${tx(AR[s], 2)}\\ \\mathrm{g} ${res(m, 2, "g")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2 kemija: elementi v bioloških sistemih
  {
    id: "vrz-biogeni",
    topics: ["KEM-SS-2/elementi-v-bioloskih-sistemih"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const COMP = [
        ["glukoza", "C6H12O6"], ["sečnina", "CO(NH2)2"], ["glicin", "C2H5NO2"], ["cistein", "C3H7NO2S"], ["metionin", "C5H11NO2S"], ["ATP", "C10H16N5O13P3"],
        ["hidroksiapatit", "Ca5(PO4)3OH"], ["kalcijev fosfat", "Ca3(PO4)2"], ["amonijev sulfat", "(NH4)2SO4"], ["amonijev nitrat", "NH4NO3"], ["amonijev hidrogenfosfat", "(NH4)2HPO4"],
        ["kalcijev nitrat", "Ca(NO3)2"], ["železov(II) sulfat", "FeSO4"], ["kalijev nitrat", "KNO3"], ["magnezijev sulfat", "MgSO4"], ["kalcijev dihidrogenfosfat", "Ca(H2PO4)2"], ["kalcijev karbonat", "CaCO3"],
      ];
      const PAREN = COMP.filter(([, f]) => f.includes("("));
      const ELN = { C: "ogljika", H: "vodika", O: "kisika", N: "dušika", P: "fosforja", S: "žvepla", Ca: "kalcija", Fe: "železa", K: "kalija", Mg: "magnezija" };
      if (k === 1 && level < 3) return sortiraj("biogeni", level, r);
      if (level === 1 && k === 0) {
        const [nm, f] = r.int(0, 2) ? r.pick(PAREN) : r.pick(COMP), a = atoms(f), flat = atoms(f, true), el = r.pick(Object.keys(a));
        return T(
          `Koliko atomov ${ELN[el]} je v formulski enoti (molekuli) $${ftex(f)}$ (${nm})?`,
          num(a[el], "", null, [M(flat[el], "Indeks za oklepajem pomnoži vse atome v oklepaju.")]),
          "Seštej indekse elementa; indeks za oklepajem pomnoži vse, kar je v oklepaju.",
          [`${tt("formula")} = ${ftex(f)}`], [`N(\\mathrm{${el}})`], false,
          [`V formuli $${ftex(f)}$ ${f.includes("(") ? "upoštevaj indeks za oklepajem" : "preberi indeks ob simbolu"}.`, `Atomov ${ELN[el]}: ${a[el]}.`],
        );
      }
      if (level === 1) {
        const [nm, f] = r.int(0, 2) ? r.pick(PAREN) : r.pick(COMP), a = atoms(f), flat = atoms(f, true), tot = Object.values(a).reduce((s, x) => s + x, 0);
        return T(
          `Koliko atomov je skupaj v eni formulski enoti (molekuli) $${ftex(f)}$ (${nm})?`,
          num(tot, "", null, [M(Object.keys(a).length, "To je število različnih elementov, ne atomov."), M(Object.values(flat).reduce((s, x) => s + x, 0), "Indeks za oklepajem pomnoži vse atome v oklepaju.")]),
          "Za vsak element preštej atome (upoštevaj indekse in oklepaje) in jih seštej.",
          [`${tt("formula")} = ${ftex(f)}`], [tt("število atomov")], false,
          [Object.entries(a).map(([e, n]) => `${e}: ${n}`).join(", "), `Skupaj: ${tot} atomov.`],
        );
      }
      if (level === 2 && k === 0) {
        const [nm, f] = r.pick(COMP), a = atoms(f), el = r.pick(Object.keys(a).filter((e) => e !== "O" && e !== "H")), els = Object.keys(a), Mx = molar(f), w = ((a[el] * AR[el]) / Mx) * 100;
        return T(
          `Izračunaj masni delež ${ELN[el]} v spojini $${ftex(f)}$ (${nm}). Uporabi ${arText(els)}. Rezultat zapiši v odstotkih in ga zaokroži ${dw(1)}.`,
          num(w, "%", 1, [M((AR[el] / Mx) * 100, "Upoštevaj vse atome elementa v formuli."), M(a[el] * AR[el], "Maso elementa deli z molsko maso spojine.")]),
          "Masni delež je masa elementa v enem molu spojine, deljena z molsko maso spojine.",
          arList(els), [`w(\\mathrm{${el}})`], `w(\\mathrm{${el}}) = \\dfrac{N(\\mathrm{${el}})\\,A_r(\\mathrm{${el}})}{M_r}`,
          [molarSteps(f), `$w(\\mathrm{${el}}) = \\dfrac{${a[el]} \\cdot ${tx(AR[el], 2)}}{${tx(Mx, 2)}} \\cdot 100\\ \\% ${res(w, 1, "%")}$`],
        );
      }
      if (level === 2) {
        const [nm, f, el] = r.pick([["amonijev nitrat", "NH4NO3", "N"], ["amonijev sulfat", "(NH4)2SO4", "N"], ["sečnina", "CO(NH2)2", "N"], ["kalcijev dihidrogenfosfat", "Ca(H2PO4)2", "P"], ["kalijev nitrat", "KNO3", "K"], ["amonijev hidrogenfosfat", "(NH4)2HPO4", "P"], ["kalcijev nitrat", "Ca(NO3)2", "N"]]);
        const a = atoms(f), els = Object.keys(a), Mx = molar(f), m = r.pick([5, 10, 20, 25, 40, 50]), me = (m * a[el] * AR[el]) / Mx;
        const G = [dat("m", tx(m), "kg"), ...arList(els)];
        return T(
          `Kmet raztrosi ${$(G[0])} gnojila $${ftex(f)}$ (${nm}). Koliko kilogramov ${ELN[el]} dobijo rastline? Uporabi ${arText(els)}.${zaok(2)}`,
          num(me, "kg", 2, [M((m * AR[el]) / Mx, "Upoštevaj vse atome elementa v formuli."), M(m, "Gnojilo ni čisti element; izračunaj masni delež.")]),
          "Izračunaj masni delež elementa v gnojilu in ga pomnoži z maso gnojila.",
          G, [`m(\\mathrm{${el}})`], ["w = \\dfrac{N\\,A_r}{M_r}", "m(\\mathrm{X}) = w\\,m"],
          [molarSteps(f), `$w(\\mathrm{${el}}) = \\dfrac{${a[el]} \\cdot ${tx(AR[el], 2)}}{${tx(Mx, 2)}} ${res((a[el] * AR[el]) / Mx, 4, "")}$`, `$m(\\mathrm{${el}}) = ${tx((a[el] * AR[el]) / Mx, 4)} \\cdot ${m}\\ \\mathrm{kg} ${res(me, 2, "kg")}$`],
        );
      }
      if (k === 2) return sortiraj("biogeni", 3, r);
      const PROT = [["hemoglobin", "Fe", 4, 64500], ["mioglobin", "Fe", 1, 17000], ["citokrom c", "Fe", 1, 12400], ["inzulin", "S", 6, 5808], ["vitamin B12", "Co", 1, 1355.4], ["klorofil a", "Mg", 1, 893.5], ["tiroksin", "I", 4, 776.9]];
      const [nm, el, n, Mreal] = r.pick(PROT), w0 = ((n * AR[el]) / Mreal) * 100, wd = sig3(w0), w = roundHalfUp(w0, wd);
      const ELG = { Fe: "železa", S: "žvepla", Co: "kobalta", Mg: "magnezija", I: "joda" };
      if (k === 0) {
        const Mx = (n * AR[el]) / (w / 100), big = Mx > 5000, val = big ? Mx / 1000 : Mx, d = big ? 1 : 0;
        const G = [dat(`w(\\mathrm{${el}})`, tx(w, wd), "%"), dat(`N(\\mathrm{${el}})`, tx(n), ""), dat(`A_r(\\mathrm{${el}})`, tx(AR[el], 2), "")];
        return T(
          `Masni delež ${ELG[el]} v ${nm === "vitamin B12" ? "vitaminu B12" : nm === "klorofil a" ? "klorofilu a" : nm === "citokrom c" ? "citokromu c" : `${nm}u`} je ${$(G[0])}. Ena molekula vsebuje ${n === 1 ? "en atom" : n === 2 ? "dva atoma" : n <= 4 ? `${n} atome` : `${n} atomov`} ${ELG[el]} $(${G[1]})$. Kolikšna je molska masa te snovi? Uporabi $${G[2]}$. Rezultat zapiši v ${big ? "kg/mol" : "g/mol"} in ga zaokroži ${dw(d)}.`,
          num(val, big ? "kg/mol" : "g/mol", d, [M(big ? AR[el] / (w / 100) / 1000 : AR[el] / (w / 100), "Upoštevaj število atomov v molekuli."), M(big ? (n * AR[el] * w) / 100 / 1000 : (n * AR[el] * w) / 100, "Masni delež je masa elementa, deljena z molsko maso: M = N A_r / w.")]),
          "Masni delež elementa je w = N · A_r / M. Iz tega izrazi M.",
          G, ["M"], `M = \\dfrac{N(\\mathrm{${el}})\\,A_r(\\mathrm{${el}})}{w(\\mathrm{${el}})}`,
          [`$w = ${tx(w, wd)}\\ \\% = ${tx(w / 100, wd + 2)}$`, `$M = \\dfrac{${n} \\cdot ${tx(AR[el], 2)}}{${tx(w / 100, wd + 2)}}\\ \\mathrm{g/mol} ${res(Mx, 0, "g/mol")}${big ? ` ${res(val, 1, "kg/mol")}` : ""}$`],
        );
      }
      const Mr = Mreal >= 5000 ? Math.round(Mreal / 100) * 100 : Mreal, nn = ((w / 100) * Mr) / AR[el];
      const G = [dat(`w(\\mathrm{${el}})`, tx(w, wd), "%"), dat("M", tx(Mr), "g/mol"), dat(`A_r(\\mathrm{${el}})`, tx(AR[el], 2), "")];
      return T(
        `${cap(nm)} ima molsko maso ${$(G[1])}, masni delež ${ELG[el]} je ${$(G[0])}. Koliko atomov ${ELG[el]} je v eni molekuli? Uporabi $${G[2]}$.${zaok(0)}`,
        num(nn, "", 0, [M(((w / 100) * Mr), "Maso elementa v molu snovi deli še z A_r, da dobiš število atomov."), M((w * Mr) / AR[el], "Odstotke pretvori v delež: deli s 100.")]),
        "Iz masnega deleža izračunaj maso elementa v enem molu snovi in jo deli z molsko maso elementa.",
        G, [`N(\\mathrm{${el}})`], `N = \\dfrac{w\\,M}{A_r}`,
        [`$m(\\mathrm{${el}}) = ${tx(w / 100, wd + 2)} \\cdot ${tx(Mr)}\\ \\mathrm{g} ${res((w / 100) * Mr, 2, "g")}$ na mol snovi`, `$N = \\dfrac{${tx((w / 100) * Mr, 2)}}{${tx(AR[el], 2)}} ${res(nn, 2, "")}$, torej ${Math.round(nn)}`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 3 kemija: dušikove organske spojine
  {
    id: "vrz-dusikove",
    topics: ["KEM-SS-3/dusikove-organske-spojine"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k === 2) return sortiraj("dusikove", 1, r);
      if (level === 1 && k === 0) {
        const n = r.int(1, 6), nm = ["metanamin", "etanamin", "propan-1-amin", "butan-1-amin", "pentan-1-amin", "heksan-1-amin"][n - 1], H = 2 * n + 3;
        return T(
          `Koliko vodikovih atomov ima molekula ${nm}a?`,
          num(H, "", null, [M(2 * n + 1, "Pozabil si vodikova atoma v amino skupini –NH₂."), M(2 * n + 2, "Amin ima formulo CₙH₂ₙ₊₁NH₂, ne CₙH₂ₙ₊₂.")]),
          "Zapiši alkilno skupino CₙH₂ₙ₊₁ in ji dodaj amino skupino –NH₂.",
          [`${tt("spojina")} = ${tt(nm)}`], [`N(\\mathrm{H})`], "\\mathrm{C}_n\\mathrm{H}_{2n+1}\\mathrm{NH_2}",
          [`${cap(nm)} ima ${n} ogljikov${n === 1 ? " atom" : n === 2 ? "a atoma" : n <= 4 ? "e atome" : "ih atomov"}: $\\mathrm{C_{${n}}H_{${2 * n + 1}}NH_2}$.`, `Vodikovih atomov: $${2 * n + 1} + 2 = ${H}$.`],
        );
      }
      if (level === 1) {
        const AM = [["CH₃NH₂", "metanamin", 1], ["CH₃CH₂NH₂", "etanamin", 1], ["(CH₃)₂NH", "dimetilamin", 2], ["(CH₃)₃N", "trimetilamin", 3], ["CH₃NHCH₂CH₃", "N-metiletanamin", 2], ["(CH₃CH₂)₃N", "trietilamin", 3], ["(CH₃)₂CHNH₂", "propan-2-amin", 1], ["(CH₃)₃CNH₂", "2-metilpropan-2-amin", 1], ["(CH₃CH₂)₂NH", "dietilamin", 2], ["(CH₃)₂NCH₂CH₃", "N,N-dimetiletanamin", 3], ["C₆H₅NH₂", "anilin", 1]];
        const [f, nm, c] = r.pick(AM), NAME = ["", "primarni", "sekundarni", "terciarni"];
        const why = `Na dušik ${c === 1 ? "je vezan en ogljikov atom" : c === 2 ? "sta vezana dva ogljikova atoma" : "so vezani trije ogljikovi atomi"}, zato je amin ${NAME[c]}.${(nm.includes("propan-2") || nm.includes("metilpropan-2")) ? " Šteješ ogljikove atome na dušiku, ne kakšen je ogljik, na katerem je skupina –NH₂." : ""}`;
        return T(
          `Ali je ${nm} (${f}) primarni, sekundarni ali terciarni amin?`,
          { type: "choice", options: ["Primarni", "Sekundarni", "Terciarni"], index: c - 1, why: [1, 2, 3].map((i) => (i === c ? null : why)) },
          "Preštej, koliko ogljikovih atomov je neposredno vezanih na dušikov atom.",
          [`${tt("spojina")} = ${tt(nm)}`], [tt("vrsta amina")], false,
          [`V formuli ${f} poišči dušik in preštej ogljikove atome, vezane nanj.`, why],
        );
      }
      if (level === 2 && k === 0) {
        const [nm, f] = r.pick([["metanamin", "CH5N"], ["etanamin", "C2H7N"], ["anilin", "C6H7N"], ["glicin", "C2H5NO2"], ["alanin", "C3H7NO2"], ["etanamid", "C2H5NO"], ["sečnina", "CH4N2O"], ["trimetilamin", "C3H9N"], ["valin", "C5H11NO2"]]);
        const a = atoms(f), els = Object.keys(a), Mx = molar(f), w = ((a.N * AR.N) / Mx) * 100;
        return T(
          `Izračunaj masni delež dušika v spojini $${ftex(f)}$ (${nm}). Uporabi ${arText(els)}. Rezultat zapiši v odstotkih in ga zaokroži ${dw(1)}.`,
          num(w, "%", 1, [M((AR.N / Mx) * 100, "Upoštevaj vse atome dušika."), M(((a.N * AR.N) / (Mx - a.N * AR.N)) * 100, "Maso dušika deliš z molsko maso cele spojine.")]),
          "Izračunaj molsko maso spojine in delež, ki ga prispevajo atomi dušika.",
          arList(els), ["w(\\mathrm{N})"], "w(\\mathrm{N}) = \\dfrac{N(\\mathrm{N})\\,A_r(\\mathrm{N})}{M_r}",
          [molarSteps(f), `$w(\\mathrm{N}) = \\dfrac{${a.N} \\cdot 14{,}01}{${tx(Mx, 2)}} \\cdot 100\\ \\% ${res(w, 1, "%")}$`],
        );
      }
      if (level === 2 && k === 1) {
        const [nm, f, salt, ftx, stx] = r.pick([
          ["metanamin", "CH5N", "metilamonijev klorid", "CH_3NH_2", "CH_3NH_3^+Cl^-"],
          ["etanamin", "C2H7N", "etilamonijev klorid", "CH_3CH_2NH_2", "CH_3CH_2NH_3^+Cl^-"],
          ["dimetilamin", "C2H7N", "dimetilamonijev klorid", "(CH_3)_2NH", "(CH_3)_2NH_2^+Cl^-"],
          ["anilin", "C6H7N", "fenilamonijev klorid", "C_6H_5NH_2", "C_6H_5NH_3^+Cl^-"],
        ]);
        const Ma = molar(f), Ms = Ma + molar("HCl"), m = r.int(4, 80) / 4, ms = (m / Ma) * Ms;
        const G = [dat("m", tx(m), "g"), ...arList(["C", "H", "N", "Cl"])];
        return T(
          `Amini so baze in s kislinami tvorijo soli: $\\mathrm{${ftx} + HCl \\rightarrow ${stx}}$. Koliko gramov soli (${salt}) nastane iz ${$(G[0])} ${nm === "anilin" ? "anilina" : nm === "metanamin" ? "metanamina" : nm === "etanamin" ? "etanamina" : "dimetilamina"} s prebitkom klorovodikove kisline? Uporabi ${arText(["C", "H", "N", "Cl"])}.${zaok(2)}`,
          num(ms, "g", 2, [M(m, "Sol ima večjo molsko maso od amina: doda se HCl."), M((m / Ma) * molar("HCl"), "To je le masa vezanega HCl; sol vsebuje amin in HCl.")]),
          "Maso amina pretvori v množino; iz enega mola amina nastane en mol soli.",
          G, ["m(\\text{sol})"], ["n = \\dfrac{m}{M}", "m(\\text{sol}) = n\\,M(\\text{sol})"],
          [molarSteps(f), `$M(\\text{sol}) = ${tx(Ma, 2)} + 36{,}46 = ${tx(Ms, 2)}\\ \\mathrm{g/mol}$`, `$n = \\dfrac{${tx(m)}}{${tx(Ma, 2)}}\\ \\mathrm{mol} ${res(m / Ma, 4, "mol")}$`, `$m(\\text{sol}) = ${tx(m / Ma, 4)} \\cdot ${tx(Ms, 2)}\\ \\mathrm{g} ${res(ms, 2, "g")}$`],
        );
      }
      const AA = [["glicin", 75.07], ["alanin", 89.09], ["serin", 105.09], ["valin", 117.15], ["cistein", 121.16], ["levcin", 131.17], ["fenilalanin", 165.19]];
      if (level === 2 || k === 2) {
        const three = level === 3, pick = r.shuffle(AA).slice(0, three ? 3 : 2), sum = pick.reduce((s, a) => s + a[1], 0), nb = pick.length - 1, Mp = sum - nb * 18.02;
        const G = [...pick.map(([n, m]) => dat(`M(\\text{${n}})`, tx(m, 2), "g/mol")), dat("M(\\mathrm{H_2O})", "18{,}02", "g/mol")];
        return T(
          `Iz aminokislin ${pick.map((a) => a[0] + "a").join(", ").replace(/, ([^,]*)$/, " in $1")} nastane ${three ? "tripeptid" : "dipeptid"}. Kolikšna je njegova molska masa? Molske mase so ${G.slice(0, -1).map($).join(", ")}, ${$(G[G.length - 1])}.${zaok(2)}`,
          num(Mp, "g/mol", 2, [M(sum, "Pri nastanku vsake peptidne vezi se odcepi molekula vode."), M(sum - (three ? 1 : 2) * 18.02, three ? "Med tremi aminokislinami nastaneta dve peptidni vezi, zato se odcepita dve molekuli vode." : "Med dvema aminokislinama nastane ena peptidna vez, odcepi se ena molekula vode.")]),
          "Pri kondenzaciji aminokislin se ob vsaki peptidni vezi odcepi ena molekula vode.",
          G, ["M(\\text{peptid})"], `M = \\sum M(\\text{aminokislin}) - ${nb} \\cdot M(\\mathrm{H_2O})`,
          [`Peptidnih vezi je ${nb}, odcepi se ${nb === 1 ? "ena molekula" : "dve molekuli"} vode.`, `$M = ${pick.map((a) => tx(a[1], 2)).join(" + ")} - ${nb} \\cdot 18{,}02 ${res(Mp, 2, "g/mol")}$`],
        );
      }
      if (k === 0) {
        const [nm, Kb, Kt] = r.pick([["metanamin", 4.4e-4, "4{,}4 \\cdot 10^{-4}"], ["etanamin", 5.6e-4, "5{,}6 \\cdot 10^{-4}"], ["dimetilamin", 5.4e-4, "5{,}4 \\cdot 10^{-4}"], ["trimetilamin", 6.3e-5, "6{,}3 \\cdot 10^{-5}"], ["anilin", 4.3e-10, "4{,}3 \\cdot 10^{-10}"]]);
        const c = r.pick(Kb > 1e-5 ? [0.1, 0.2, 0.5, 1] : [0.01, 0.05, 0.1, 0.2]), x = Math.sqrt(Kb * c), pOH = -Math.log10(x), pH = 14 - pOH;
        const G = [dat("c", tx(c), "mol/L"), dat("K_b", Kt, "")];
        return T(
          `Izračunaj pH vodne raztopine ${nm === "anilin" ? "anilina" : nm === "metanamin" ? "metanamina" : nm === "etanamin" ? "etanamina" : nm === "dimetilamin" ? "dimetilamina" : "trimetilamina"} s koncentracijo ${$(G[0])}. Konstanta baze je ${$(G[1])}. Predpostavi, da zreagira le majhen del amina ($c - x \\approx c$).${zaok(2)}`,
          num(pH, "", 2, [M(pOH, "To je pOH; pH = 14 − pOH."), M(14 + Math.log10(c), "Amin je šibka baza: koncentracija OH⁻ ni enaka koncentraciji amina."), M(14 + Math.log10(Kb * c), "Koncentracija OH⁻ je koren iz K_b c.")]),
          "Amin sprejme proton od vode: RNH₂ + H₂O ⇌ RNH₃⁺ + OH⁻. Iz K_b izračunaj [OH⁻], nato pOH in pH.",
          G, ["\\mathrm{pH}"], ["[\\mathrm{OH^-}] = \\sqrt{K_b\\,c}", "\\mathrm{pH} = 14 - \\mathrm{pOH}"],
          [`$[\\mathrm{OH^-}] = \\sqrt{${Kt} \\cdot ${tx(c)}}\\ \\mathrm{mol/L} \\approx ${sci3(x).t}\\ \\mathrm{mol/L}$`, `$\\mathrm{pOH} = -\\log [\\mathrm{OH^-}] ${res(pOH, 2, "")}$`, `$\\mathrm{pH} = 14 - ${tx(pOH, 2)} ${res(pH, 2, "")}$`],
        );
      }
      const CL = [
        [3, ["metanamin", "etanamin", "dimetilamin"], "Alkilne skupine potiskajo elektrone k dušiku, zato je njegov prosti elektronski par bolj dostopen: alkilamini so močnejše baze od amonijaka."],
        [2, ["amonijak"], "Amonijak je šibka baza: alkilamini so močnejši, anilin in amidi pa šibkejši."],
        [1, ["anilin"], "Pri anilinu se prosti elektronski par dušika delno razporedi po benzenovem obroču, zato je anilin precej šibkejša baza od amonijaka."],
        [0, ["etanamid", "sečnina"], "Pri amidih prosti elektronski par dušika privlači sosednja karbonilna skupina, zato amidi v vodi skoraj niso bazični."],
      ];
      const cls = r.shuffle(CL).slice(0, 3), strongest = r.int(0, 1), pick = cls.map((c) => [r.pick(c[1]), c[0], c[2]]);
      const right = pick.reduce((a, b) => ((strongest ? b[1] > a[1] : b[1] < a[1]) ? b : a));
      return T(
        `Katera od spojin ${pick.map((p) => p[0]).join(", ")} je v vodni raztopini ${strongest ? "najmočnejša" : "najšibkejša"} baza?`,
        choice(r, cap(right[0]), pick.filter((p) => p !== right).map((p) => [cap(p[0]), p[2]])),
        "Bazičnost je odvisna od tega, kako dostopen je prosti elektronski par na dušiku.",
        [`${tt("spojine")} = ${tt(pick.map((p) => p[0]).join(", "))}`], [tt("spojina")], false,
        [right[2], "Vrstni red bazičnosti: alkilamini > amonijak > anilin > amidi."],
      );
    },
  },
];
