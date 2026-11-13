// Iz stanja mikroskopa izračuna, kaj in kako narisati (upodobi.js narisi): vidno polje, zamegljenost, svetlost in pri
// največjih povečavah model molekul (sonda izmeri snov in membrano v središču). Brez DOM, a potrebuje upodobitev za sondo.
import { matrikaBarvil, BARVANJA } from "./barvila.js";
import { uniformeMolekul } from "./molekule-vrste.js";
import { OBJEKTIVI, OKULAR, vidnoPolje, zamegljenost, svetlost, kontrast, lomSvetlobe, TEM_LOCLJIVOST, SEM_LOCLJIVOST, utezModela } from "./optika.js";

export const ZACETNO = {
  nacin: "svetloba", // ali "sem" (vrstični) ali "tem" (presevni elektronski mikroskop)
  objektiv: 0, // indeks v OBJEKTIVI
  m: 40, // skupna povečava (pri svetlobi = objektiv × okular)
  sredisce: [0, 0], // µm
  dz: 0, // odmik od ostrine (µm), svetlobni mikroskop
  olje: false,
  zarnica: 0.7,
  zaslonka: 0.6,
  defokus: 0, // TEM, -1..1
  barve: true, // model molekul v barvah
};

export function povecava(s) {
  return s.nacin === "tem" || s.nacin === "sem" ? s.m : OBJEKTIVI[s.objektiv].m * OKULAR;
}

// Membrana in snov ob središču (za model molekul). Vrne uniforme ali null.
function sondaModela(upo, c, m) {
  const eps = 0.002; // µm
  const r = upo.sonda([c, [c[0] + eps, c[1]], [c[0] - eps, c[1]], [c[0], c[1] + eps], [c[0], c[1] - eps]]);
  if (!r) return null;
  const [o, xp, xm, yp, ym] = r;
  let n = [(xp.meja - xm.meja) / (2 * eps), (yp.meja - ym.meja) / (2 * eps)];
  const ln = Math.hypot(n[0], n[1]);
  n = ln > 1e-6 ? [n[0] / ln, n[1] / ln] : [0, 1];
  const d0 = o.meja; // µm, razdalja do najbližje membrane
  const vp = vidnoPolje(m, "tem");
  const mem = d0 < vp ? 1 : 0;
  let sa = o, sb = o;
  if (mem) {
    // snov na drugi strani in na tej strani (središče je lahko v sami membrani)
    [sb, sa] = upo.sonda([
      [c[0] - n[0] * (d0 + 0.012), c[1] - n[1] * (d0 + 0.012)],
      [c[0] - n[0] * (d0 - 0.012), c[1] - n[1] * (d0 - 0.012)],
    ]);
  }
  // snov (ultrastruktura TEM), vrsta celice in r1 (vrsta virusa) za izbiro pravih molekul (molekule-vrste.js)
  const strana = (x) => ({ snov: Math.round(x.snov) === 24 ? 1 : Math.round(x.snov), tip: Math.round(x.tip), r1: x.r1 }); // S_MEMBRANA → citoplazma
  let smer = o.smer;
  const ls = Math.hypot(smer[0], smer[1]);
  const smerL = ls > 0.5 ? 1 : 0;
  smer = ls > 1e-3 ? [smer[0] / ls, smer[1] / ls] : [1, 0];
  const mod = (x) => ((((x * 1000) % 4000) + 4000) % 4000);
  return {
    sonda: o,
    fine: [mod(c[0]), mod(c[1])],
    stranA: strana(sa),
    stranB: strana(sb),
    mem,
    y0: d0 * 1000,
    n,
    smer,
    smerL,
    faza: o.r1 * 1000,
  };
}

// Kako močno preparat lomi svetlobo (optika.js lomSvetlobe), če preparat ne pove sam (vlaga): celice v vodi ali barvilu
// pod krovnim steklom močno, posušen razmaz srednje, rezina v balzamu ali smoli malo.
const VLAGA = { naravno: 1, jod: 1, metilensko: 0.9, orcein: 0.8, giemsa: 0.5, gram: 0.5, obrus: 0.4 };

// Vrne { v (za narisi), mol (uniforme modela ali null), vp, sredisce }.
export function izracunajPogled(upo, preparat, s, n, { hitro = false } = {}) {
  const tem = s.nacin === "tem";
  const sem = s.nacin === "sem";
  const m = povecava(s);
  const vp = vidnoPolje(m, s.nacin);
  const um = vp / n;
  let sigmaUm;
  if (sem) sigmaUm = SEM_LOCLJIVOST * 0.45; // globinska ostrina je velika: vsa površina je ostra
  else if (tem) sigmaUm = Math.hypot(TEM_LOCLJIVOST * 0.45, Math.abs(s.defokus) * vp * 0.02);
  else sigmaUm = zamegljenost(OBJEKTIVI[s.objektiv], { dz: s.dz, zaslonka: s.zaslonka, olje: s.olje });
  const sigma = Math.max(0, sigmaUm / um);
  const barv = BARVANJA[preparat.barvanje] || BARVANJA.he;
  let mol = null;
  const utez = tem ? utezModela(m) : 0;
  if (utez > 0 && !hitro) {
    const u = sondaModela(upo, s.sredisce, m);
    if (u) {
      const mu = uniformeMolekul(u.stranA, u.stranB, u.mem, preparat.id);
      mol = { utez, uniforme: { ...u, ...mu, barve: s.barve ? 1 : 0 }, reze: mu.reze };
    }
  }
  const obj = OBJEKTIVI[s.objektiv];
  return {
    m,
    vp,
    mol,
    v: {
      n,
      sredisce: s.sredisce,
      umNaTocko: um,
      tem,
      nacin: sem ? 3 : tem ? 1 : 0, // uNacin v senčilniku preparata
      elektroni: tem || sem,
      barvila: matrikaBarvil(preparat.barvanje),
      debelina: barv.moc,
      sigma: Math.min(sigma, 38),
      mol,
      svetlost: tem || sem ? 0.9 + 0.5 * s.zarnica : svetlost(obj, s.zarnica, s.zaslonka, s.olje),
      kontrast: tem ? 1.15 : sem ? 1.0 : kontrast(s.zaslonka),
      topla: tem || sem ? 0 : Math.max(0, 0.55 - s.zarnica * 0.6),
      // šum: SEM pri šibkem snopu bolj šumi (manj elektronov na točko)
      sum: tem ? (mol ? 0.02 : 0.09) : sem ? 0.05 + 0.08 * (1 - s.zarnica) : 0.012,
      krog: !tem && !sem,
      // pri majhni povečavi štirje vzorci na točko (glsl.js svetloba); med premikanjem (hitro) le eden
      ss: !tem && !sem && !hitro && um > 0.8 ? 4 : 1,
      lom: tem || sem ? 0 : lomSvetlobe(obj, s.dz, s.zaslonka, preparat.vlaga ?? VLAGA[preparat.barvanje] ?? 0.2, s.olje),
    },
  };
}
