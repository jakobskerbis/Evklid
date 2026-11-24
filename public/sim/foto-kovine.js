// Fotografski prikaz poskusa lab-kovine (kovine v kislinah in raztopinah soli): sloji iz scripts/lab-foto/prizor_kovine.py,
// krmilnik in gradniki v foto.js (docs/laboratorij.md »Fotografski prikaz«). Iz modela (lab-model-elektrokemija.js) so:
// posoda (erlenmajerica za kisline, čaša za soli), zamašek z brizgo, barva raztopine (Beer–Lambert), pena in prelivanje,
// lega bata (prostornina plina v brizgi), kovina (vrsta → barva F0, oblika, preostala masa), prevleka in mehurčki.
// Lestvico brizge (1 mL črte, številke na 10 mL) nariše aplikacija, bat je ločen sloj, ki ga premaknemo.
import { s, label } from "./kit.js";
import { visinaIzProstornine, eksponent } from "./foto.js";
import { KOVINE } from "./lab-model-elektrokemija.js";

export const OKNA_KOVINE = { kovine: [0, 0, 400, 300], dno: [4, 4, 150, 92], lupa: [150, 160, 236, 80] };
const rgb = (c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;
const gam = (u) => 255 * (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055);
// Odbojnost kovin pri vpadu pravokotno (F0, linearno): Fe, Cu, Zn po physicallybased.info (iz optičnih konstant);
// magnezij ocena (srebrno bel kot aluminij, a z oksidno plastjo malo temnejši). Izris je »bela« kovina (F0 = 1): pri kovini
// je barva odboja F0, zato pomnožimo sliko z F0 (v sRGB, ker je kodiranje potenčna funkcija, je to isto kot linearno).
export const F0_LIN = { Mg: [0.86, 0.87, 0.88], Zn: [0.664, 0.824, 0.85], Fe: [0.531, 0.512, 0.496], Cu: [0.955, 0.638, 0.538] };
export const F0 = Object.fromEntries(Object.entries(F0_LIN).map(([k, v]) => [k, v.map(gam)]));
// Mere kovine v izrisu (ocena za šolske vzorce; model določa le debelino traku in premer zrnc): magnezijev trak 3 mm × 0,2 mm,
// navit v vijačnico; trak (folija) drugih kovin 10 mm × 0,25 mm; zrnca Ø 3 mm; prah z nasipno gostoto 50 %.
export const TRAK_MM = { Mg: { w: 3, d: 0.2 }, drugo: { w: 10, d: 0.25 } };
const ZRNO_CM3 = (Math.PI * 0.3 ** 3) / 6;

// Kateri sloj kovine in koliko ga pokažemo: f = delež dolžine traku ali števila zrnc, sc = merilo kupčka prahu.
export function prikazKovine(kovina, oblika, m, mk) {
  const rho = KOVINE[kovina].rho;
  if (oblika === "trak") {
    const T = kovina === "Mg" ? TRAK_MM.Mg : TRAK_MM.drugo, L = (m / (rho * (T.w / 10) * (T.d / 10))) * 10; // mm
    const obl = kovina === "Mg" ? "zvitek" : "trak", Lmax = obl === "zvitek" ? mk.zvitek.L : mk.trak.L;
    return { obl, L, f: Math.min(1, L / Lmax) };
  }
  if (oblika === "granule") {
    const n = m / (rho * ZRNO_CM3), N = mk.zrnca.N, k = Math.min(N, Math.max(1, Math.round(n)));
    return { obl: "zrnca", n, k, f: k / N };
  }
  const V = (m / rho / mk.prah.fi) * 1000; // mm³
  return { obl: "prah", V, sc: Math.cbrt(V / mk.prah.V) };
}

// st: { posoda "bucka"|"casa"|"prazna", zamasek, V, pena, prelito, barva, brizga, polozaj (mL), batIzpadel,
//       kos { kovina, oblika, m } | null, mehurcki 0–4, prevleka 0–1, prevlekaBarva, ocala, hitrost }
// P: plast mehurčkov motorja (plastMehurckov), mehurcki: risalnik mehurčkov motorja.
export function risiKovine(o, meta, st, P, mehurcki) {
  const S = meta.sidra.kovine, k = meta.merila.kovine, kx = meta.merila.vodoravno.kovine, g = o.okno("kovine");
  o.slika("kovine", g);
  const pos = st.posoda, Bm = pos === "casa" ? meta.casa : meta.bucka;
  const kos = pos !== "prazna" && st.kos && st.kos.m > 1e-6 ? st.kos : null;
  const pk = kos && prikazKovine(kos.kovina, kos.oblika, kos.m, meta.kovina);
  let yL = null;
  if (pos === "prazna") o.slika("k-bucka", mehkiRob(o, g, meta.sloji["k-bucka"]));
  else {
    const ime = pos === "casa" ? "k-casa" : st.zamasek ? "k-bucka-zamasek" : "k-bucka-polna";
    o.tekocina(ime, `${ime}-debelina`, st.barva, mehkiRob(o, g, meta.sloji[ime]));
    yL = (pos === "casa" ? S.casaDno : S.buckaDno) - visinaIzProstornine(Bm.VodH, st.V) * k;
    if (kos) kovina(o, g, meta, "k", pos, pk, st, `${ime}-debelina`);
    if (st.pena > 2) pena(g, meta, pos, st, S, k, kx);
  }
  if (st.prelito) {
    const [vx, vy] = S.vrat, d = `M${vx},${vy} q7,3 8,${S.pult - vy - 8} q5,6 20,7`;
    s("path", { d, class: "lab-ek-spill-rob" }, g);
    s("path", { d, class: "lab-ek-spill" }, g);
  }
  // bat: v valju od roba bata do prijemke, zunaj valja od konca valja naprej
  const Bz = S.brizga, u = Bz.x100 / 100 - Bz.x0 / 100, izp = meta.brizga.izpadeML;
  const p = Math.max(0, Math.min(izp, st.polozaj || 0));
  if (st.batIzpadel) o.slika("k-bat-miza", g);
  else {
    const mn = meta.sloji["k-bat-noter"], mz = meta.sloji["k-bat-zunaj"], xf = Bz.x0 + p * u;
    if (xf < Bz.obroc) o.slika("k-bat-noter", o.izrez(xf, mn.y, Bz.obroc - xf, mn.h, g), { transform: `translate(${(p * u).toFixed(2)} 0)` });
    o.slika("k-bat-zunaj", o.izrez(Bz.konec, mz.y, 400 - Bz.konec, mz.h, g), { transform: `translate(${((p - 100) * u).toFixed(2)} 0)` });
  }
  lestvica(g, Bz.crte, (v) => Bz.x0 + v * u, 0, 100, 0.32, 5.2);
  // mehurčki (plast motorja) od kovine do gladine
  if (kos && st.mehurcki > 0 && yL != null) {
    const [xa, xb, yt] = meta.kovina.obseg[`k-${pos}-${pk.obl}`];
    const [x0, x1, y0] = obsegKovine(xa, xb, yt, pk, S.kovina);
    mehurcki(P.g, { x: (x0 + x1) / 2, w: Math.max(2, x1 - x0), y0, y1: yL + 1, n: [0, 2, 5, 10, 18][st.mehurcki], r: st.mehurcki >= 4 ? [0.5, 1.3] : [0.4, 0.9], v: 150 * k, key: 3 });
  }
  // napisi
  const yN = S.pult + 12;
  label(o.g, 6, yN, pos === "casa" ? "čaša 100 mL" : "erlenmajerica 100 mL", "lab-ek-miza", "start");
  // bat je izpadel: opozorilo namesto napisa brizge (3 enote niže bi ga prekrilo)
  label(o.g, (Bz.x0 + Bz.x100) / 2, Bz.dno + 11, st.batIzpadel ? "bat je izpadel" : "plinska brizga 100 mL", st.batIzpadel ? "lab-warn small" : "tick small");
  if (!st.ocala) label(o.g, 255, 14, "brez zaščitnih očal", "lab-warn");
  if (st.hitrost > 1) label(o.g, 360, 30, `čas teče ×${st.hitrost}`, "lab-warn small");
  const d = S.merilo50[1] - S.merilo50[0];
  s("path", { d: `M${392 - d},${292} v-4 h${d} v4`, class: "lab-scale lab-ek-mizacrta" }, o.g);
  label(o.g, 392 - d / 2, 285, "5 cm", "lab-ek-miza");

  // ---- dno posode s kovino, povečano 4×
  if (kos) {
    const D = meta.sidra.dno, kd = meta.merila.dno, w = o.okno("dno");
    const ime = pos === "casa" ? "dno-casa" : st.zamasek ? "dno-bucka-z" : "dno-bucka";
    o.tekocina(ime, `${ime}-debelina`, st.barva, w);
    kovina(o, w, meta, "dno", pos, pk, st, `${ime}-debelina`);
    w.okvir();
    label(w.zunaj, 75, 88, `kovina, povečano ${Math.round(kd / k)}×`, "lbl small");
    if (st.mehurcki > 0) {
      const [ox, oy, ow, oh] = OKNA_KOVINE.dno, yl = (pos === "casa" ? D.casaDno : D.buckaDno) - visinaIzProstornine(Bm.VodH, st.V) * kd;
      const [xa, xb, yt] = meta.kovina.obseg[`dno-${pos}-${pk.obl}`];
      const [x0, x1, y0] = obsegKovine(xa, xb, yt, pk, D.kovina);
      const c = okvirPlasti(P, ox, oy, ow, oh);
      mehurcki(c, { x: ox + (x0 + x1) / 2, w: Math.max(4, x1 - x0), y0: oy + y0, y1: oy + yl + 2, n: [0, 3, 6, 10, 16][st.mehurcki], r: st.mehurcki >= 4 ? [1, 2.6] : [0.7, 1.8], v: 40 * kd, key: 9 });
    }
  }
  // ---- rob bata, povečano 5× (kamera v višini osi: odčitek brez paralakse)
  if (st.brizga) {
    const L = meta.sidra.lupa, ul = meta.brizga.mmNaML * meta.merila.vodoravno.lupa, w = o.okno("lupa");
    o.slika("lupa", w);
    if (!st.batIzpadel) o.slika("lupa-bat", w);
    lestvica(w, L.crte, (v) => L.sredina + (v - p) * ul, Math.max(0, Math.ceil(p - 21)), Math.min(100, Math.floor(p + 21)), 1.1, 11);
    w.okvir();
    label(w.zunaj, 230, 12, `rob bata, povečano ${Math.round(meta.merila.lupa / k)}×`, "lbl small", "end");
  }
}

// Lestvica na sprednji strani valja brizge: 1 mL kratka, 5 mL srednja, 10 mL dolga črta s številko (tisk, temno).
function lestvica(g, C, X, od, do_, sw, fs) {
  const t = s("g", { stroke: "rgb(28,30,32)", "stroke-opacity": 0.88, "stroke-width": sw, fill: "rgb(28,30,32)" }, g);
  for (let v = od; v <= do_; v++) {
    const x = X(v), y1 = v % 10 === 0 ? C.dolga : v % 5 === 0 ? C.srednja : C.kratka;
    s("line", { x1: x, y1: C.spodaj, x2: x, y2: y1 }, t);
    if (v % 10 === 0) s("text", { x, y: C.stevilke, "font-size": fs, "text-anchor": "middle", stroke: "none", "font-weight": 600, style: "font-variant-numeric:tabular-nums" }, t, String(v));
  }
}

// Navidezni obseg kovine za mehurčke: trak in zrnca le do deleža f, prah pomanjšan okoli sredine dna.
function obsegKovine(xa, xb, yt, pk, [cx, cy]) {
  if (pk.obl === "prah") return [cx + (xa - cx) * pk.sc, cx + (xb - cx) * pk.sc, cy + (yt - cy) * pk.sc];
  if (pk.obl === "zrnca") return [xa, xb, yt];
  const d = ((xb - xa) * (1 - pk.f)) / 2;
  return [xa + d, xb - d, yt];
}

// Desni rob izreza posode se zlije z osnovo (8 enot): izrisa se na robu razlikujeta za šum in odboje posode.
function mehkiRob(o, g, m) {
  const id = o.id("r"), gid = o.id("q");
  const lg = s("linearGradient", { id: gid, gradientUnits: "userSpaceOnUse", x1: m.x + m.w - 8, y1: 0, x2: m.x + m.w, y2: 0 }, o.defs);
  s("stop", { offset: 0, "stop-color": "#fff" }, lg); s("stop", { offset: 1, "stop-color": "#000" }, lg);
  s("rect", { x: m.x, y: m.y, width: m.w, height: m.h, fill: `url(#${gid})` }, s("mask", { id, maskUnits: "userSpaceOnUse", x: m.x, y: m.y, width: m.w, height: m.h }, o.defs));
  return s("g", { mask: `url(#${id})` }, g);
}
// Izrez plasti mehurčkov (pravokotnik okna povečave).
function okvirPlasti(P, x, y, w, hh) {
  const id = `${P.g._uid}-o${x}`;
  P.g._sig.push(`o${x},${y}`);
  s("rect", { x, y, width: w, height: hh, rx: 8 }, s("clipPath", { id }, P.g));
  const c = s("g", { "clip-path": `url(#${id})` }, P.g);
  c._sig = P.g._sig;
  c._uid = P.g._uid;
  return c;
}

// Kovina za steklom: sloj bele kovine × F0 (ali prevleka), obarvan z raztopino pred njo (pol poti: kovina je na sredini),
// prikazan delež iz sloja »id« (meja: vrednost ≤ ID_MAX · f) ali pomanjšan kupček prahu.
function kovina(o, g, meta, pre, pos, pk, st, deb) {
  const ime = `${pre}-${pos}-${pk.obl}`, sl = meta.sloji[ime];
  const zun = s("g", {}, g);
  if (pk.obl === "prah") {
    const [cx, cy] = pre === "k" ? meta.sidra.kovine.kovina : meta.sidra.dno.kovina;
    zun.setAttribute("transform", `translate(${cx} ${cy}) scale(${pk.sc.toFixed(4)}) translate(${-cx} ${-cy})`);
  } else {
    // trak: prikazan del (od začetka) premaknemo na sredino mesta, kjer leži cel trak
    if (pk.obl !== "zrnca") {
      const [xa, xb] = meta.kovina.obseg[ime];
      zun.setAttribute("transform", `translate(${(((xb - xa) * (1 - pk.f)) / 2).toFixed(2)} 0)`);
    }
    const mid = o.id("i"), fid = o.id("j"), thr = meta.kovina.idMax * pk.f + 1.5 / 255;
    const f = s("filter", { id: fid, x: 0, y: 0, width: 1, height: 1, "color-interpolation-filters": "sRGB" }, o.defs);
    const ct = s("feComponentTransfer", {}, f);
    ["R", "G", "B"].forEach((c) => s(`feFunc${c}`, { type: "linear", slope: -255, intercept: +(255 * thr).toFixed(3) }, ct));
    const mi = meta.sloji[`${ime}-id`];
    o.slika(`${ime}-id`, s("mask", { id: mid, maskUnits: "userSpaceOnUse", x: mi.x, y: mi.y, width: mi.w, height: mi.h }, o.defs), { filter: `url(#${fid})` });
    zun.setAttribute("mask", `url(#${mid})`);
  }
  o.slika(ime, zun);
  const aid = o.id("a");
  o.slika(ime, s("mask", { id: aid, maskUnits: "userSpaceOnUse", x: sl.x, y: sl.y, width: sl.w, height: sl.h, style: "mask-type:alpha" }, o.defs));
  const a = Math.min(0.95, 0.95 * (st.prevleka || 0)), c0 = F0[st.kos.kovina], pc = st.prevlekaBarva;
  const c = pc && a > 0.02 ? c0.map((v, i) => v * (1 - a) + pc[i] * a) : c0;
  s("rect", { x: sl.x, y: sl.y, width: sl.w, height: sl.h, fill: rgb(c), mask: `url(#${aid})`, style: "mix-blend-mode:multiply" }, zun);
  if (st.barva) {
    const fid = o.id("h"), ct = s("feComponentTransfer", {}, s("filter", { id: fid, x: 0, y: 0, width: 1, height: 1, "color-interpolation-filters": "sRGB" }, o.defs));
    ["R", "G", "B"].forEach((ch, i) => s(`feFunc${ch}`, { type: "gamma", amplitude: 1, exponent: (eksponent(st.barva[i]) / 2).toFixed(4), offset: 0 }, ct));
    const ga = s("g", { mask: `url(#${aid})`, style: "mix-blend-mode:multiply" }, zun);
    o.slika(deb, ga, { filter: `url(#${fid})` });
  }
}

// Pena nad gladino (model: prostornina pene v mL): bel pas med gladino in višino, ki ustreza V + pena, ob stenah posode.
function pena(g, meta, pos, st, S, k, kx) {
  const B = pos === "casa" ? meta.casa : meta.bucka, yD = pos === "casa" ? S.casaDno : S.buckaDno;
  const h0 = visinaIzProstornine(B.VodH, st.V), h1 = Math.min(B.visina - B.dno - 1, visinaIzProstornine(B.VodH, st.V + Math.min(st.pena, 120)));
  const r = (h) => (pos === "casa" ? B.notranjiPolmer : lin(B.polmer, h + B.dno)) * kx;
  const L = [], R = [];
  for (let i = 0; i <= 8; i++) {
    const h = h0 + ((h1 - h0) * i) / 8, y = yD - h * k;
    L.push(`${(S.os - r(h)).toFixed(2)},${y.toFixed(2)}`);
    R.unshift(`${(S.os + r(h)).toFixed(2)},${y.toFixed(2)}`);
  }
  s("path", { d: `M${L.join(" L")} L${R.join(" L")} Z`, fill: "rgb(250,252,253)", "fill-opacity": 0.72, class: "lab-ek-foam" }, g);
  const n = Math.min(40, Math.round(st.pena));
  for (let i = 0; i < n; i++) {
    const h = h0 + ((i * 0.377) % 1) * (h1 - h0), w = r(h) * 0.9;
    s("circle", { cx: S.os - w + ((i * 0.618) % 1) * 2 * w, cy: yD - h * k, r: 0.5 + ((i * 0.29) % 1) * 0.9, class: "lab-ek-foam-b" }, g);
  }
}
const lin = (tab, x) => {
  for (let i = 1; i < tab.length; i++) if (tab[i][0] >= x) return tab[i - 1][1] + ((tab[i][1] - tab[i - 1][1]) * (x - tab[i - 1][0])) / (tab[i][0] - tab[i - 1][0] || 1);
  return tab[tab.length - 1][1];
};
