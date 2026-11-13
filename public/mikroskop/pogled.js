// Iz stanja mikroskopa izračuna, kaj in kako narisati (upodobi.js narisi): vidno polje, zamegljenost, svetlost in pri
// največjih povečavah model molekul (sonda izmeri snov in membrano v središču). Brez DOM, a potrebuje upodobitev za sondo.
import { matrikaBarvil, BARVANJA } from "./barvila.js";
import { OBJEKTIVI, OKULAR, vidnoPolje, zamegljenost, svetlost, kontrast, TEM_LOCLJIVOST, utezModela } from "./optika.js";

export const ZACETNO = {
  nacin: "svetloba", // ali "tem"
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
  return s.nacin === "tem" ? s.m : OBJEKTIVI[s.objektiv].m * OKULAR;
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
  let b = o.snov;
  let a = o.snov;
  if (mem) {
    // snov na drugi strani in na tej strani (središče je lahko v sami membrani)
    const [onkraj, tu] = upo.sonda([
      [c[0] - n[0] * (d0 + 0.012), c[1] - n[1] * (d0 + 0.012)],
      [c[0] - n[0] * (d0 - 0.012), c[1] - n[1] * (d0 - 0.012)],
    ]);
    b = onkraj.snov;
    a = tu.snov;
  }
  if (a === 24) a = 1; // S_MEMBRANA → citoplazma
  if (b === 24) b = 1;
  let smer = o.smer;
  const ls = Math.hypot(smer[0], smer[1]);
  const smerL = ls > 0.5 ? 1 : 0;
  smer = ls > 1e-3 ? [smer[0] / ls, smer[1] / ls] : [1, 0];
  const mod = (x) => ((((x * 1000) % 4000) + 4000) % 4000);
  return {
    sonda: o,
    fine: [mod(c[0]), mod(c[1])],
    a,
    b,
    mem,
    y0: d0 * 1000,
    n,
    smer,
    smerL,
    faza: o.r1 * 1000,
  };
}

// Vrne { v (za narisi), mol (uniforme modela ali null), vp, sredisce }.
export function izracunajPogled(upo, preparat, s, n, { hitro = false } = {}) {
  const tem = s.nacin === "tem";
  const m = povecava(s);
  const vp = vidnoPolje(m, s.nacin);
  const um = vp / n;
  let sigmaUm;
  if (tem) sigmaUm = Math.hypot(TEM_LOCLJIVOST * 0.45, Math.abs(s.defokus) * vp * 0.02);
  else sigmaUm = zamegljenost(OBJEKTIVI[s.objektiv], { dz: s.dz, zaslonka: s.zaslonka, olje: s.olje });
  const sigma = Math.max(0, sigmaUm / um);
  const barv = BARVANJA[preparat.barvanje] || BARVANJA.he;
  let mol = null;
  const utez = tem ? utezModela(m) : 0;
  if (utez > 0 && !hitro) {
    const u = sondaModela(upo, s.sredisce, m);
    if (u) mol = { utez, uniforme: { ...u, barve: s.barve ? 1 : 0 } };
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
      barvila: matrikaBarvil(preparat.barvanje),
      debelina: barv.moc,
      sigma: Math.min(sigma, 38),
      mol,
      svetlost: tem ? 0.9 + 0.5 * s.zarnica : svetlost(obj, s.zarnica, s.zaslonka, s.olje),
      kontrast: tem ? 1.15 : kontrast(s.zaslonka),
      topla: tem ? 0 : Math.max(0, 0.55 - s.zarnica * 0.6),
      sum: tem ? (mol ? 0.02 : 0.09) : 0.012,
      krog: !tem,
    },
  };
}
