// Telesa (OŠ in SŠ tabela Telesa): žični model, ki se zavrti z vodoravnim vlečenjem; zakriti robovi črtkano,
// osnovni ploskvi rahlo modri, višina v rumena s pravim kotom. Stikalo »Telo / Mreža« pokaže razgrnjeno mrežo
// (plašč rumenkasto, osnovi modro). Opcije: { telo: "kocka" | "kvader" | "prizma" | "valj" | "piramida" |
// "prisekana" | "stozec", ss: true za oznake s SŠ lista }.
// Valj in stožec sta mnogokotnika z N stranicami; njune stranske robove (tvorilke) rišemo samo na obrisu.
import { skica, st, crta, napis, vr, praviKot } from "./skica.js";
import { s } from "../sim/kit.js";

export const TETA = 0.36; // nagib pogleda od zgoraj (≈ 20°)
const N_KROG = 72;

const obroc = (n, R, zasuk = 0) => Array.from({ length: n }, (_, i) => [R * Math.cos(zasuk + (2 * Math.PI * i) / n), R * Math.sin(zasuk + (2 * Math.PI * i) / n)]);
const pravokotnik = (a, b) => [[-a / 2, -b / 2], [a / 2, -b / 2], [a / 2, b / 2], [-a / 2, b / 2]];

// Telo med spodnjim (y = 0) in zgornjim (y = v) mnogokotnikom; zgoraj = null pomeni vrh (0, v, 0).
function prizmoid(spodaj, zgoraj, v, gladko = false) {
  const n = spodaj.length;
  const V = spodaj.map(([x, z]) => [x, 0, z]);
  if (zgoraj) V.push(...zgoraj.map(([x, z]) => [x, v, z]));
  else V.push([0, v, 0]);
  const F = [{ v: spodaj.map((_, i) => i), vrsta: "osnova" }];
  if (zgoraj) F.push({ v: zgoraj.map((_, i) => n + i), vrsta: "osnova" });
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    F.push({ v: zgoraj ? [i, j, n + j, n + i] : [i, j, n], vrsta: "plasc" });
  }
  // Normale navzven: središče telesa je znotraj (telo je konveksno).
  const c = V.reduce((a, p) => a.map((x, k) => x + p[k] / V.length), [0, 0, 0]);
  for (const f of F) {
    const P = f.v.map((i) => V[i]);
    const nn = [0, 0, 0];
    P.forEach((p, k) => {
      const q = P[(k + 1) % P.length];
      nn[0] += (p[1] - q[1]) * (p[2] + q[2]);
      nn[1] += (p[2] - q[2]) * (p[0] + q[0]);
      nn[2] += (p[0] - q[0]) * (p[1] + q[1]);
    });
    const m = P.reduce((a, p) => a.map((x, k) => x + p[k] / P.length), [0, 0, 0]);
    const zn = Math.sign(nn[0] * (m[0] - c[0]) + nn[1] * (m[1] - c[1]) + nn[2] * (m[2] - c[2])) || 1;
    f.n = nn.map((x) => x * zn);
  }
  // Robovi: par oglišč → ploskvi ob robu. Gladek je rob med dvema stranskima ploskvama okroglega telesa.
  const R = new Map();
  F.forEach((f, fi) =>
    f.v.forEach((a, k) => {
      const b = f.v[(k + 1) % f.v.length], key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!R.has(key)) R.set(key, { a: Math.min(a, b), b: Math.max(a, b), f: [] });
      R.get(key).f.push(fi);
    }),
  );
  const E = [...R.values()].map((e) => ({ ...e, gladek: gladko && e.f.every((fi) => F[fi].vrsta === "plasc") }));
  return { V, F, E, n, v };
}

// Mere teles (v enotah skice) in računi za čipe.
export function telo(ime) {
  if (ime === "kocka" || ime === "kvader") {
    const [a, b, c] = ime === "kocka" ? [2, 2, 2] : [3, 2, 1.5];
    return { ime, a, b, c, ...prizmoid(pravokotnik(a, b), pravokotnik(a, b), c), P: 2 * (a * b + a * c + b * c), Vol: a * b * c, D: Math.hypot(a, b, c) };
  }
  if (ime === "prizma") {
    const a = 1.2, v = 2.5, O = ((3 * Math.sqrt(3)) / 2) * a * a, Spl = 6 * a * v;
    return { ime, a, ...prizmoid(obroc(6, a), obroc(6, a), v), O, Spl, P: 2 * O + Spl, Vol: O * v };
  }
  if (ime === "valj") {
    const r = 1.2, v = 2.5;
    return { ime, r, ...prizmoid(obroc(N_KROG, r), obroc(N_KROG, r), v, true), P: 2 * Math.PI * r * (r + v), Vol: Math.PI * r * r * v };
  }
  if (ime === "stozec") {
    const r = 1.2, v = 2.5, s_ = Math.hypot(r, v);
    return { ime, r, s: s_, ...prizmoid(obroc(N_KROG, r), null, v, true), P: Math.PI * r * (r + s_), Vol: (Math.PI * r * r * v) / 3 };
  }
  if (ime === "piramida") {
    const a = 2.4, v = 2.2, O = a * a, ha = Math.hypot(v, a / 2), Spl = 2 * a * ha;
    return { ime, a, ha, ...prizmoid(pravokotnik(a, a), null, v), O, Spl, P: O + Spl, Vol: (O * v) / 3 };
  }
  if (ime === "prisekana") {
    const a1 = 2.6, a2 = 1.2, v = 1.8, O1 = a1 * a1, O2 = a2 * a2, ha = Math.hypot(v, (a1 - a2) / 2), Spl = 2 * (a1 + a2) * ha;
    return { ime, a1, a2, ha, ...prizmoid(pravokotnik(a1, a1), pravokotnik(a2, a2), v), O1, O2, Spl, P: O1 + O2 + Spl, Vol: (v / 3) * (O1 + Math.sqrt(O1 * O2) + O2) };
  }
  throw new Error(`neznano telo ${ime}`);
}

// Pravokotna projekcija: zasuk φ okoli navpične osi, nagib TETA od zgoraj. Vrne [desno, gor, globina (bliže = več)].
export function projekcija(phi, teta = TETA) {
  const c = Math.cos(phi), sn = Math.sin(phi), ct = Math.cos(teta), stt = Math.sin(teta);
  return ([x, y, z]) => {
    const rx = x * c + z * sn, rz = -x * sn + z * c;
    return [rx, y * ct - rz * stt, y * stt + rz * ct];
  };
}

// Robovi z vidnostjo pri zasuku φ: ostri robovi so vidni, če je vidna vsaj ena sosednja ploskev, sicer črtkani;
// gladki robovi (tvorilke) se rišejo le na obrisu (ena ploskev vidna, druga ne).
export function robovi(T, phi, teta = TETA) {
  const P = projekcija(phi, teta);
  const o = [0, 0, 0];
  const vidna = T.F.map((f) => {
    const d = P(f.n)[2] - P(o)[2];
    return d > 1e-9;
  });
  const out = [];
  for (const e of T.E) {
    const vf = e.f.map((fi) => vidna[fi]);
    if (e.gladek) {
      if (vf[0] !== vf[1]) out.push({ a: e.a, b: e.b, vidno: true, obris: true });
    } else out.push({ a: e.a, b: e.b, vidno: vf.some(Boolean) });
  }
  return { robovi: out, vidna };
}

// Razgrnjena mreža: seznam likov { tocke: [[x, y]…], vrsta: "osnova" | "plasc" } in oznak { p, t }.
const krog = (cx, cy, r, n = 180) => obroc(n, r).map(([x, y]) => [cx + x, cy + y]);
const pr = (x, y, w, hh) => [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]];
// Pravilni n-kotnik na stranici PQ (na levi strani smeri P → Q).
function naStranici(P, Q, n) {
  const out = [P, Q];
  let [x, y] = Q, kot = Math.atan2(Q[1] - P[1], Q[0] - P[0]);
  const a = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  for (let i = 2; i < n; i++) {
    kot += (2 * Math.PI) / n;
    x += a * Math.cos(kot);
    y += a * Math.sin(kot);
    out.push([x, y]);
  }
  return out;
}

export function mreza(T) {
  const L = [], O = [], C = []; // liki, oznake, črte (polmer v krogu osnove)
  const plasc = (t) => L.push({ tocke: t, vrsta: "plasc" }), osnova = (t) => L.push({ tocke: t, vrsta: "osnova" });
  if (T.ime === "kocka" || T.ime === "kvader") {
    const { a, b, c } = T;
    [a, b, a, b].reduce((x, w) => (plasc(pr(x, 0, w, c)), x + w), 0);
    osnova(pr(0, -b, a, b));
    osnova(pr(0, c, a, b));
    O.push({ p: [a / 2, -0.25], t: "a" }, { p: [-0.25, c / 2], t: T.ime === "kocka" ? "a" : "c" });
    if (T.ime === "kvader") O.push({ p: [a + b / 2, -0.25], t: "b" });
  } else if (T.ime === "prizma") {
    const { a, v } = T;
    for (let i = 0; i < 6; i++) plasc(pr(i * a, 0, a, v));
    osnova(naStranici([2 * a, 0], [a, 0], 6));
    osnova(naStranici([a, v], [2 * a, v], 6));
    O.push({ p: [3.5 * a, -0.25], t: "a" }, { p: [6 * a + 0.25, v / 2], t: "v" });
  } else if (T.ime === "valj") {
    const { r, v } = T, o = 2 * Math.PI * r;
    plasc(pr(0, 0, o, v));
    osnova(krog(Math.PI * r, -r, r));
    C.push([[Math.PI * r, -r], [Math.PI * r + r, -r]]);
    osnova(krog(Math.PI * r, v + r, r));
    O.push({ p: [o * 0.2, -0.25], t: "2πr" }, { p: [o + 0.25, v / 2], t: "v" }, { p: [Math.PI * r + r * 0.5, -r + 0.25], t: "r" });
  } else if (T.ime === "stozec") {
    const { r, s: sl } = T, beta = (2 * Math.PI * r) / sl, n = 120;
    plasc([[0, 0], ...Array.from({ length: n + 1 }, (_, i) => {
      const t = -Math.PI / 2 - beta / 2 + (beta * i) / n;
      return [sl * Math.cos(t), sl * Math.sin(t)];
    })]);
    osnova(krog(0, -sl - r, r));
    C.push([[0, -sl - r], [r, -sl - r]]);
    O.push({ p: [sl * 0.62 * Math.cos(-Math.PI / 2 + beta / 2) + 0.3, sl * 0.62 * Math.sin(-Math.PI / 2 + beta / 2)], t: "s" }, { p: [r * 0.55, -sl - r + 0.25], t: "r" });
  } else if (T.ime === "piramida") {
    const { a, ha } = T, k = pravokotnik(a, a);
    osnova(k);
    k.forEach((p, i) => {
      const q = k[(i + 1) % 4], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], l = Math.hypot(m[0], m[1]);
      plasc([p, q, [m[0] + (m[0] / l) * ha, m[1] + (m[1] / l) * ha]]);
    });
    O.push({ p: [0, -a / 2 + 0.3], t: "a" });
  } else if (T.ime === "prisekana") {
    const { a1, a2, ha } = T, k = pravokotnik(a1, a1);
    osnova(k);
    k.forEach((p, i) => {
      const q = k[(i + 1) % 4], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], l = Math.hypot(m[0], m[1]);
      const nrm = [m[0] / l, m[1] / l], t = [(q[0] - p[0]) / a1, (q[1] - p[1]) / a1], z = [m[0] + nrm[0] * ha, m[1] + nrm[1] * ha];
      const trap = [p, q, [z[0] + (t[0] * a2) / 2, z[1] + (t[1] * a2) / 2], [z[0] - (t[0] * a2) / 2, z[1] - (t[1] * a2) / 2]];
      plasc(trap);
      if (i === 0) osnova(pr(z[0] - a2 / 2, z[1] - a2, a2, a2));
    });
    O.push({ p: [0, -a1 / 2 + 0.3], t: "a₁" }, { p: [0, -a1 / 2 - ha + 0.3], t: "a₂" });
  }
  return { liki: L, oznake: O, crte: C };
}

// Ploščina mnogokotnika (za test: vsota ploščin mreže = P).
export const ploscinaLika = (t) => Math.abs(t.reduce((a, p, i) => a + p[0] * t[(i + 1) % t.length][1] - t[(i + 1) % t.length][0] * p[1], 0)) / 2;

// Čipi po telesu; oznake formul kot na kartici (OŠ ali SŠ).
export function cipi(T, ss) {
  const PV = (P, V) => [{ barva: "ploskev", oznaka: P, vrednost: vr(T.P, 2) }, { barva: "ploskev", oznaka: V, vrednost: vr(T.Vol, 2) }];
  switch (T.ime) {
    case "kocka":
      return [{ barva: "glavna", oznaka: "a", vrednost: st(T.a, 1) }, ...PV("P = 6 a^2", "V = a^3"), { barva: "druga", oznaka: "D = a\\sqrt{3}", vrednost: vr(T.D, 2) }];
    case "kvader":
      return [{ barva: "glavna", oznaka: "a,\\ b,\\ c", vrednost: [T.a, T.b, T.c].map((x) => st(x, 1)).join("; ") }, ...PV("P = 2 (a b + a c + b c)", "V = a b c"), { barva: "druga", oznaka: "D = \\sqrt{a^2 + b^2 + c^2}", vrednost: vr(T.D, 2) }];
    case "prizma":
      return [{ barva: "glavna", oznaka: "a,\\ v", vrednost: `${st(T.a, 1)}; ${st(T.v, 1)}` }, { barva: "ploskev", oznaka: "O = \\frac{3 a^2 \\sqrt{3}}{2}", vrednost: vr(T.O, 2) }, { barva: "izbor", oznaka: "S_{pl} = 6 a v", vrednost: vr(T.Spl, 2) }, ...PV("P = 2 O + S_{pl}", ss ? "V = O v" : "V = O \\cdot v")];
    case "valj":
      return [{ barva: "glavna", oznaka: "r,\\ v", vrednost: `${st(T.r, 1)}; ${st(T.v, 1)}` }, ...PV(ss ? "P = 2 \\pi r (r + v)" : "P = 2 \\pi r^2 + 2 \\pi r v", "V = \\pi r^2 v")];
    case "stozec":
      return [{ barva: "glavna", oznaka: "r,\\ v", vrednost: `${st(T.r, 1)}; ${st(T.v, 1)}` }, { barva: "druga", oznaka: ss ? "s = \\sqrt{r^2 + v^2}" : "s^2 = r^2 + v^2", vrednost: vr(T.s, 2) }, ...PV(ss ? "P = \\pi r (r + s)" : "P = \\pi r^2 + \\pi r s", "V = \\frac{\\pi r^2 v}{3}")];
    case "piramida":
      return [{ barva: "glavna", oznaka: "a,\\ v", vrednost: `${st(T.a, 1)}; ${st(T.v, 1)}` }, { barva: "ploskev", oznaka: "O = a^2", vrednost: vr(T.O, 2) }, { barva: "izbor", oznaka: "S_{pl}", vrednost: vr(T.Spl, 2) }, ...PV("P = O + S_{pl}", ss ? "V = \\frac{O v}{3}" : "V = \\frac{O \\cdot v}{3}")];
    case "prisekana":
      return [{ barva: "glavna", oznaka: "a_1,\\ a_2,\\ v", vrednost: [T.a1, T.a2, T.v].map((x) => st(x, 1)).join("; ") }, { barva: "ploskev", oznaka: "O_1 = a_1^2", vrednost: vr(T.O1, 2) }, { barva: "ploskev", oznaka: "O_2 = a_2^2", vrednost: vr(T.O2, 2) }, { barva: "izbor", oznaka: "S_{pl}", vrednost: vr(T.Spl, 2) }, ...PV("P = O_1 + O_2 + S_{pl}", "V = \\frac{v}{3} \\left(O_1 + \\sqrt{O_1 O_2} + O_2\\right)")];
  }
  return [];
}

// Zaporedni robovi → verige oglišč (za eno črtkano črto namesto mnogo kratkih).
export function verige(robovi) {
  const sosedi = new Map();
  for (const e of robovi) for (const [x, y] of [[e.a, e.b], [e.b, e.a]]) (sosedi.get(x) || sosedi.set(x, []).get(x)).push(y);
  const uporabljen = new Set(), key = (x, y) => (x < y ? `${x}-${y}` : `${y}-${x}`), out = [];
  // Začnemo pri koncih verig (oglišče z enim sosedom), nato še zaprte zanke.
  const zacetki = [...sosedi.keys()].sort((x, y) => (sosedi.get(x).length === 1 ? -1 : 0) - (sosedi.get(y).length === 1 ? -1 : 0));
  for (const z of zacetki)
    for (const prvi of sosedi.get(z)) {
      if (uporabljen.has(key(z, prvi))) continue;
      const pot = [z];
      let a = z, b = prvi;
      while (b != null && !uporabljen.has(key(a, b))) {
        uporabljen.add(key(a, b));
        pot.push(b);
        const nasl = (sosedi.get(b) || []).find((c) => !uporabljen.has(key(b, c)));
        [a, b] = [b, sosedi.get(b).length === 2 ? nasl : undefined];
      }
      out.push(pot);
    }
  return out;
}

const OPIS = {
  kocka: "Kocka z robom a.",
  kvader: "Kvader z robovi a, b in c.",
  prizma: "Pravilna šeststrana prizma z osnovnim robom a in višino v.",
  valj: "Valj s polmerom osnove r in višino v.",
  stozec: "Stožec s polmerom osnove r, višino v in stranico s.",
  piramida: "Pravilna štiristrana piramida z osnovnim robom a in višino v.",
  prisekana: "Prisekana pravilna štiristrana piramida z osnovnima robovoma a₁ in a₂ ter višino v.",
};

const IMENA = { kocka: "Kocka", kvader: "Kvader", prizma: "Pravilna šeststrana prizma", valj: "Valj", stozec: "Stožec", piramida: "Pravilna štiristrana piramida", prisekana: "Prisekana piramida" };

export default function narisi(host, { telo: ime = "kocka", ss = false } = {}) {
  const W = 300, H = 230, M = 24;
  const T = telo(ime);
  const S = skica({ w: W, h: H, navodilo: `${OPIS[ime]} Povleci telo vodoravno ali pritisni puščici, da se zavrti; »Mreža« ga razgrne.`, oznaka: `${IMENA[ime]}: žični model in mreža` });
  // Merilo: telo se pri vsakem zasuku prilega okvirju.
  // Spodaj sega telo do −R_spodaj·sin θ, zgoraj do v·cos θ + R_zgoraj·sin θ (vrh: R_zgoraj = 0).
  const polmer = (y) => Math.max(0, ...T.V.filter((p) => p[1] === y).map(([x, , z]) => Math.hypot(x, z)));
  const Rs = polmer(0), Rz = polmer(T.v), Rmax = Math.max(Rs, Rz);
  const hz = T.v * Math.cos(TETA) + (Rs + Rz) * Math.sin(TETA);
  const k = Math.min((W - 2 * M) / (2 * Rmax), (H - 2 * M) / hz);
  const Y0 = H / 2 + (k * hz) / 2 - k * Rs * Math.sin(TETA);
  const zaslon = (p) => [W / 2 + k * p[0], Y0 - k * p[1]];
  let phi = 0.5, pogled = "Telo";

  function izrisTelo(g) {
    const P = projekcija(phi), Z = (p) => zaslon(P(p));
    const { robovi: R } = robovi(T, phi);
    const cS = Z([0, T.v / 2, 0]);
    // Osnovni ploskvi rahlo modri.
    T.F.forEach((f) => f.vrsta === "osnova" && s("polygon", { points: f.v.map((i) => Z(T.V[i])).join(" "), class: "sk-f-ploskev" }, g));
    // Zakriti robovi: zaporedne robove združimo v eno črto, da je črtkanje enakomerno (tudi na loku osnove valja).
    for (const pot of verige(R.filter((e) => !e.vidno))) s("polyline", { points: pot.map((i) => Z(T.V[i])).join(" "), class: "sk-s-glavna sk-thin sk-dash sk-faint" }, g);
    // Višina v z pravim kotom v središču osnove (pri kocki in kvadru telesna diagonala D).
    const oznaka = (p, t, barva, odmik = 12, sredisce = cS) => {
      const q = Z(p), d = [q[0] - sredisce[0], q[1] - sredisce[1]], l = Math.hypot(...d) || 1;
      napis(g, q[0] + (d[0] / l) * odmik, q[1] + (d[1] / l) * odmik + 4, t, barva, { "text-anchor": "middle" });
    };
    // Najbolj sprednji rob med danimi (po globini sredine).
    // Rob, ki je na zaslonu močno skrajšan (gledan skoraj od spredaj), ne dobi oznake: oznaka bi se zlila s sosednjo.
    const dolg = (e) => {
      const [p, q] = [Z(T.V[e[0]]), Z(T.V[e[1]])], prava = k * Math.hypot(...T.V[e[0]].map((x, i) => x - T.V[e[1]][i]));
      return Math.hypot(p[0] - q[0], p[1] - q[1]) >= Math.max(15, 0.5 * prava);
    };
    const spredaj = (seznam) => seznam.filter(dolg).reduce((b, e) => (!b || P(sred(e))[2] > P(sred(b))[2] ? e : b), null);
    const oznakaRoba = (e, t, odmik, sredisce) => e && oznaka(sred(e), t, "glavna", odmik, sredisce);
    const sred = ([a, b]) => T.V[a].map((x, i) => (x + T.V[b][i]) / 2);
    const spodnji = T.E.filter((e) => T.V[e.a][1] === 0 && T.V[e.b][1] === 0).map((e) => [e.a, e.b]);
    if (ime === "kocka" || ime === "kvader") {
      const a0 = 0, b0 = T.n + 2;
      crta(g, ...Z(T.V[a0]), ...Z(T.V[b0]), "druga", { "stroke-width": 2 });
      // »D« ob diagonali, odmaknjen pravokotno nanjo (nad njo), da ga črta ne prečka.
      const dm = Z(T.V[a0].map((x, i) => (x + T.V[b0][i]) / 2)), da = Z(T.V[a0]), db = Z(T.V[b0]);
      let nx = -(db[1] - da[1]), ny = db[0] - da[0];
      const nl = Math.hypot(nx, ny) || 1;
      if (ny > 0) (nx = -nx), (ny = -ny);
      napis(g, dm[0] + (nx / nl) * 10, dm[1] + (ny / nl) * 10 + 4, "D", "druga", { "text-anchor": "middle" });
      const vzX = spodnji.filter(([a, b]) => T.V[a][2] === T.V[b][2]), vzZ = spodnji.filter(([a, b]) => T.V[a][0] === T.V[b][0]);
      const navp = T.E.filter((e) => T.V[e.a][1] !== T.V[e.b][1]).map((e) => [e.a, e.b]);
      oznakaRoba(spredaj(ime === "kocka" ? spodnji : vzX), "a");
      if (ime === "kvader") {
        oznakaRoba(spredaj(vzZ), "b");
        oznakaRoba(spredaj(navp), "c", 10);
      }
    } else {
      const vrh = [0, T.v, 0], dno = [0, 0, 0];
      crta(g, ...Z(dno), ...Z(vrh), "izbor", { "stroke-width": 2 });
      const vm = Z([0, T.v / 2, 0]);
      napis(g, vm[0] + 6, vm[1], "v", "izbor");
      // Krak pravega kota: polmer r, pritrjen na telo (z vrtenjem se vidi, da se telo vrti; zadaj črtkan),
      // pri oglatih telesih do sredine sprednjega osnovnega roba.
      const okrogel = ime === "valj" || ime === "stozec";
      const kraj = okrogel ? [T.r, 0, 0] : sred(spodnji.reduce((b, e) => (P(sred(e))[2] > P(sred(b))[2] ? e : b)));
      const zadaj = okrogel && P(kraj)[2] < 0;
      crta(g, ...Z(dno), ...Z(kraj), okrogel ? "glavna" : "izbor", okrogel ? { "stroke-width": 2, class: `sk-s-glavna${zadaj ? " sk-dash" : ""}` } : { "stroke-width": 1.4 });
      praviKot(g, Z(dno), Z(kraj), Z([0, 1, 0]), 8, "izbor");
      if (okrogel) {
        const rm = Z(kraj.map((x) => x / 2));
        napis(g, rm[0], rm[1] + 15, "r", "glavna", { "text-anchor": "middle" });
      }
      if (ime === "stozec") {
        // Stranica s (zelena kot v čipu): od roba osnove do vrha, na desnem obrisu.
        const desni = [T.r * Math.cos(phi), 0, T.r * Math.sin(phi)];
        crta(g, ...Z(desni), ...Z(vrh), "druga", { "stroke-width": 2.5 });
        const sm = Z(desni.map((x, i) => (x + vrh[i]) / 2));
        napis(g, sm[0] + 9, sm[1], "s", "druga");
      } else if (ime === "prisekana") {
        oznakaRoba(spredaj(spodnji), "a₁", 14);
        // a₂ navzven od središča zgornje ploskve (ne čez višino v).
        const zgornji = T.E.filter((e) => T.V[e.a][1] === T.v && T.V[e.b][1] === T.v).map((e) => [e.a, e.b]);
        oznakaRoba(spredaj(zgornji), "a₂", 11, Z([0, T.v, 0]));
      } else if (!okrogel) oznakaRoba(spredaj(spodnji), "a", 14);
    }
    for (const e of R.filter((e) => e.vidno)) crta(g, ...Z(T.V[e.a]), ...Z(T.V[e.b]), "glavna", { "stroke-width": 2, "stroke-linecap": "round" });
  }

  function izrisMreza(g) {
    const { liki, oznake, crte } = mreza(T);
    const vse = liki.flatMap((l) => l.tocke);
    const [x0, x1] = [Math.min(...vse.map((p) => p[0])), Math.max(...vse.map((p) => p[0]))];
    const [y0, y1] = [Math.min(...vse.map((p) => p[1])), Math.max(...vse.map((p) => p[1]))];
    const m = Math.min((W - 24) / (x1 - x0), (H - 24) / (y1 - y0));
    const Q = ([x, y]) => [W / 2 + (x - (x0 + x1) / 2) * m, H / 2 - (y - (y0 + y1) / 2) * m];
    for (const l of liki) s("polygon", { points: l.tocke.map(Q).join(" "), class: `${l.vrsta === "plasc" ? "sk-f-izbor" : "sk-f-ploskev"}` }, g);
    for (const l of liki) s("polygon", { points: l.tocke.map(Q).join(" "), class: `sk-s-${l.vrsta === "plasc" ? "izbor" : "ploskev"} sk-thin`, style: "fill: none" }, g);
    for (const [p, q] of crte) crta(g, ...Q(p), ...Q(q), "glavna", { class: "sk-s-glavna sk-thin" });
    for (const o of oznake) {
      const [x, y] = Q(o.p);
      napis(g, x, y + 4, o.t, "glavna", { "text-anchor": "middle", style: "font-size: 12px" });
    }
  }

  function izris() {
    const g = S.plast("telo");
    if (pogled === "Telo") izrisTelo(g);
    else izrisMreza(g);
  }

  // Vrtenje: vodoravno vlečenje (navpično se stran še pomika) ali puščici levo/desno.
  const svg = S.svg;
  svg.setAttribute("tabindex", "0");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-roledescription", "vrtljiv model");
  let vlek = null, cakaj = false;
  const narisiKmalu = () => {
    if (cakaj) return;
    cakaj = true;
    requestAnimationFrame(() => ((cakaj = false), izris()));
  };
  svg.addEventListener("pointerdown", (e) => {
    if (pogled !== "Telo" || e.button > 0) return;
    vlek = { x: e.clientX, phi, id: e.pointerId };
    svg.setPointerCapture?.(e.pointerId);
    svg.style.cursor = "grabbing";
  });
  svg.addEventListener("pointermove", (e) => {
    if (!vlek || e.pointerId !== vlek.id) return;
    const r = svg.getBoundingClientRect();
    phi = vlek.phi + ((e.clientX - vlek.x) / (r.width || W)) * 2 * Math.PI;
    narisiKmalu();
  });
  const konec = () => ((vlek = null), (svg.style.cursor = pogled === "Telo" ? "grab" : ""));
  svg.addEventListener("pointerup", konec);
  svg.addEventListener("pointercancel", konec);
  svg.addEventListener("keydown", (e) => {
    if (pogled !== "Telo" || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    phi += (e.key === "ArrowRight" ? 1 : -1) * (Math.PI / 18);
    izris();
  });
  svg.style.cursor = "grab";

  S.cipi(cipi(T, ss));
  S.gumbi({ label: "Pogled", options: ["Telo", "Mreža"], value: pogled, onChange: (v) => ((pogled = v), konec(), izris()) });
  izris();
  host.append(S.el);
}
