// Glava vidnega živca in ovojnica (docs/3d.md »Round r1, eye«): node scripts/atlas/oko-zivec.mjs [--suho]
// Teče po oko-dodelava.mjs. Ocena 20. nov: v prerezu je bila ob izstopu živca kremasta stopničasta »lijakasta ovratnica«
// (duralna ovojnica m4, razširjena v beločnico, širša od živca), papila je bila izbočen kremast valj, živec sam pa se
// v prerezu ni rezal (brezReza) in je za ovojnico tekel kot cela cev. Prav: živec zapusti zrklo ≈ 3 mm nazalno od
// zadnjega pola kot valj Ø 3–4 mm; v vzdolžnem prerezu so vlakna (krem) v duralni ovojnici, ki se zvezno nadaljuje v
// beločnico, med njima tanka subarahnoidna reža; v ravnini beločnice lamina cribrosa, v osi osrednja arterija in vena
// mrežnice; papila v ravnini mrežnice s plitko ekskavacijo.
// Skripta zamenja mreži živca in ovojnice:
//  * os živca: od notranje ploskve mrežnice (žarek iz središča zrkla skozi središče papile) PRAVO mm naravnost v
//    ravnini reza (prerez.ravnine[0] v oko.json; ravnina gre skozi os zrkla in papilo), nato v loku do vhoda v vidni
//    kanal za skupnim kitnim obročem (kot prej);
//  * polmer živca: v mrežnici in žilnici R_PAPILA (papila Ø 1,7 mm), skozi kanal beločnice zvezno do R_ZIVEC na
//    zunanji ploskvi beločnice (kanal je lijak, ki se navzven širi), za njo stalen (mielin);
//  * ovojnica: votla cev (stena STENA) z notranjim polmerom R_ZIVEC + REZA, začne se ZAMIK_OVOJNICE v beločnici
//    (zvezno nadaljevanje), konec KRAJSA pred koncem živca; brez razširitve čez beločnico;
//  * oko.json: živec se v prerezu reže (brez brezReza), rezSnopi.os = smer osi pri zrklu, rezSnopi.crte = osrednja
//    arterija in vena (vzporedni črti ob osi do ZILE_DO za beločnico) in lamina cribrosa (prečna črta).
// Ponovljivo: vozlišči dobita extras »r1«.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";
import { okvirZrkla, cev } from "./oko-dodelava.mjs";

const MAPA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
export const PRAVO = 0.011, R_PAPILA = 0.00085, R_ZIVEC = 0.00145, REZA = 0.00022, STENA = 0.00034;
export const ZLIVANJE = 0.0004, ZAMIK_OVOJNICE = 0.00035, KRAJSA = 0.0016, ZILE_DO = 0.008, CUP = 0.00008;

const gl = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const sredina = (W) => { const c = [0, 0, 0]; for (const p of W) for (let k = 0; k < 3; k++) c[k] += p[k] / W.length; return c; };
const bvhMreze = (m) => { const t = []; for (const i of m.F) t.push(m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]); return new G.BVH(Float64Array.from(t)); };

// Os: točke od začetka (mrežnica) naravnost do PRAVO, nato kubični lok do konca (tangenta zvezna).
export function osR1(zac, u, kon, n) {
  const t = [];
  const naRavno = Math.max(6, Math.round(n * 0.45));
  // gosto ob zrklu (kanal beločnice), nato enakomerno
  const us = [0, 0.02, 0.04, 0.07, 0.1, 0.14, 0.18, 0.23, 0.29, 0.36];
  for (let i = 1; i <= naRavno; i++) if (i / naRavno > us[us.length - 1] + 0.02) us.push(i / naRavno);
  for (const f of us) t.push(G.v3.add(zac, G.v3.mul(u, f * PRAVO)));
  const p0 = t[t.length - 1], dE = G.v3.norm(G.v3.sub(kon, p0)), l = G.v3.dist(p0, kon);
  const b1 = G.v3.add(p0, G.v3.mul(u, 0.4 * l)), b2 = G.v3.sub(kon, G.v3.mul(dE, 0.3 * l));
  const m = n - naRavno;
  for (let i = 1; i <= m; i++) {
    const s = i / m, v = 1 - s;
    t.push([0, 1, 2].map((c) => v * v * v * p0[c] + 3 * v * v * s * b1[c] + 3 * v * s * s * b2[c] + s * s * s * kon[c]));
  }
  return t;
}

// Votla cev: zunanja ploskev navzven, notranja navznoter, obročasta pokrova. rz, rn: polmera po dolžini (funkciji).
export function votlaCev(os, rz, rn, stranic) {
  const a = cev(os, rz, stranic), b = cev(os, rn, stranic);
  const ring = (c) => c.P.slice(0, os.length * stranic);
  const P = [...ring(a), ...ring(b)], N = [...a.N.slice(0, os.length * stranic), ...b.N.slice(0, os.length * stranic).map((v) => G.v3.mul(v, -1))];
  const F = [], o = os.length * stranic;
  for (let i = 0; i + 1 < os.length; i++) for (let j = 0; j < stranic; j++) {
    const p = i * stranic + j, q = i * stranic + (j + 1) % stranic;
    F.push(p, q, q + stranic, p, q + stranic, p + stranic); // zunaj
    F.push(o + p, o + q + stranic, o + q, o + p, o + p + stranic, o + q + stranic); // znotraj (obrnjeno)
  }
  // obročasta pokrova (svoja oglišča, normala vzdolž osi)
  for (const [i, smer] of [[0, -1], [os.length - 1, 1]]) {
    const t = G.v3.mul(G.v3.norm(G.v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)])), smer);
    const s0 = P.length;
    for (let j = 0; j < stranic; j++) { P.push(P[i * stranic + j].slice()); N.push(t); }
    for (let j = 0; j < stranic; j++) { P.push(P[o + i * stranic + j].slice()); N.push(t); }
    for (let j = 0; j < stranic; j++) {
      const p = s0 + j, q = s0 + (j + 1) % stranic;
      if (smer > 0) F.push(p, q, q + stranic, p, q + stranic, p + stranic);
      else F.push(p, q + stranic, q, p, p + stranic, q + stranic);
    }
  }
  return { P, N, F };
}

// Zamenja mrežo vozlišča z novo (P, N, F); atributi iz najbližjega oglišča stare mreže.
function zamenjaj(doc, node, nova, { enVir = false } = {}) {
  const prim = node.getMesh().listPrimitives()[0];
  const m = G.preberi(node, prim);
  const n0 = m.P.length / 3;
  const najblizje = (p) => { let v = 0, b = Infinity; for (let r = 0; r < n0; r += 1) { const d = (m.P[r * 3] - p[0]) ** 2 + (m.P[r * 3 + 1] - p[1]) ** 2 + (m.P[r * 3 + 2] - p[2]) ** 2; if (d < b) { b = d; v = r; } } return v; };
  // enVir: vsa nova oglišča dobijo UV in barvo enega oglišča (sredina stare mreže): pri drugačni obliki bi najbližja
  // oglišča raztrgala zapečeno teksturo v lise (ovojnica v pogledu od zadaj)
  const sr = enVir ? najblizje(sredina(Array.from({ length: n0 }, (_, r) => [m.P[r * 3], m.P[r * 3 + 1], m.P[r * 3 + 2]]))) : -1;
  for (let i = 0; i < nova.P.length; i++) G.dodajOglisce(m, nova.P[i], [[enVir ? sr : najblizje(nova.P[i]), 1]], m.A.has("NORMAL") ? { NORMAL: nova.N[i] } : {});
  m.P = m.P.slice(n0 * 3);
  for (const a of m.A.values()) a.d = a.d.slice(n0 * a.n);
  m.F = nova.F.slice();
  m.spremenjeno = true;
  G.zvari(m);
  G.zapisi(doc, node, prim, m);
}

export async function obdelaj(datoteka, ravnina, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const vozl = (rx) => doc.getRoot().listNodes().find((n) => n.getMesh() && rx.test(n.getName()));
  const zivec = vozl(/^Optic nerve/), ovoj = vozl(/^Dural sheath/), bel = vozl(/^sclera/), roz = vozl(/^cornea/), mrez = vozl(/^retina_L/), pap = vozl(/^optic_disc/), obroc = vozl(/^Common tendinous ring/);
  if (!zivec || !ovoj || !bel || !roz || !mrez || !pap || !obroc) throw new Error(`${path.basename(datoteka)}: manjka vozlišče`);
  if (zivec.getExtras()?.r1) return { porocilo: `${path.basename(datoteka)}: živec r1 že narejen` };
  const W = (n) => G.preberi(n, n.getMesh().listPrimitives()[0]);
  const mb = W(bel), mr = W(mrez), mp = W(pap);
  const { O } = okvirZrkla(mb.W, W(roz).W);
  const disk = sredina(mp.W);
  // smer izstopa: iz središča zrkla skozi papilo, v ravnini reza
  let u = G.v3.norm(G.v3.sub(disk, O));
  const nR = G.v3.norm(ravnina.n);
  u = G.v3.norm(G.v3.sub(u, G.v3.mul(nR, G.v3.dot(u, nR))));
  const O2 = G.v3.sub(O, G.v3.mul(nR, G.v3.dot(nR, O) + ravnina.d / G.v3.len(ravnina.n))); // središče na ravnini
  // v osi je kanal (luknja v beločnici in mrežnici): ploskve iz venca žarkov 2–2,6 mm okoli papile (mediana razdalj)
  const bR = bvhMreze(mr), bB = bvhMreze(mb);
  const e1 = G.v3.norm(G.v3.cross(u, nR)), e2 = G.v3.cross(u, e1);
  const venec = (fn) => {
    const v = [];
    for (const kot of [0.17, 0.21]) for (let k = 0; k < 12; k++) {
      const f = (2 * Math.PI * k) / 12, d = G.v3.norm(G.v3.add(G.v3.mul(u, Math.cos(kot)), G.v3.add(G.v3.mul(e1, Math.sin(kot) * Math.cos(f)), G.v3.mul(e2, Math.sin(kot) * Math.sin(f)))));
      const t = fn(d);
      if (t > 0) v.push(t);
    }
    v.sort((a, b) => a - b);
    return v.length ? v[Math.floor(v.length / 2)] : -1;
  };
  const tMrez = venec((d) => bR.zarek(O2, d, 0.03));
  const tBn = venec((d) => bB.zarek(O2, d, 0.03)); // notranja ploskev beločnice
  const tBz = venec((d) => { const t = bB.zarek(G.v3.add(O2, G.v3.mul(d, 0.03)), G.v3.mul(d, -1), 0.03); return t > 0 ? 0.03 - t : -1; }); // zunanja
  if (tMrez <= 0 || tBz <= 0 || tBn <= 0) throw new Error("žarek ne zadene mrežnice/beločnice");
  console.log(`  papila ${(G.v3.dot(G.v3.sub(disk, O2), u) * 1000).toFixed(2)} mm, mrežnica ${(tMrez * 1000).toFixed(2)} mm, od ravnine ${(G.v3.dot(nR, disk) * 1000 + ravnina.d * 1000).toFixed(2)} mm`);
  const zac = G.v3.add(O2, G.v3.mul(u, tMrez + CUP)); // plitva ekskavacija: konec živca tik za ploskvijo mrežnice
  const sB0 = tBn - tMrez - CUP, sB1 = tBz - tMrez - CUP; // notranja in zunanja ploskev beločnice od začetka
  const kon = G.v3.add(sredina(W(obroc).W), G.v3.mul(G.v3.norm(G.v3.sub(sredina(W(obroc).W), zac)), 0.004));
  const os = osR1(zac, u, kon, telefon ? 18 : 34);
  const rZ = (s) => R_PAPILA + (R_ZIVEC - R_PAPILA) * gl(s, sB0 - 0.0001, sB1);
  const stranic = telefon ? 12 : 20;
  const novZ = cev(os, rZ, stranic);
  // ovojnica: od ZAMIK_OVOJNICE pod zunanjo ploskvijo beločnice do KRAJSA pred koncem živca
  let dol = 0; const sOs = [0];
  for (let i = 1; i < os.length; i++) sOs.push((dol += G.v3.dist(os[i], os[i - 1])));
  const s0 = sB1 - Math.max(ZAMIK_OVOJNICE, 0.7 * (sB1 - sB0)), s1 = dol - KRAJSA;
  const osO = [];
  for (let i = 0; i < os.length; i++) if (sOs[i] > s0 && sOs[i] < s1) osO.push(os[i]);
  const tocka = (s) => { for (let i = 1; i < os.length; i++) if (sOs[i] >= s) { const f = (s - sOs[i - 1]) / (sOs[i] - sOs[i - 1]); return G.v3.add(os[i - 1], G.v3.mul(G.v3.sub(os[i], os[i - 1]), f)); } return os[os.length - 1]; };
  osO.unshift(tocka(s0)); osO.push(tocka(s1));
  // v beločnici se ovojnica zlije z njo: notranji polmer = živec (subarahnoidna reža se ob beločnici slepo konča),
  // zunanji je ob začetku za ZLIVANJE širši in se v 1,4 mm zoži na steno STENA
  const rn = (t) => rZ(s0 + t) + 0.00001 + REZA * gl(t, sB1 - s0, sB1 - s0 + 0.0009);
  const rz = (t) => rn(t) + STENA + ZLIVANJE * (1 - gl(t, sB1 - s0 - 0.0002, sB1 - s0 + 0.0012));
  const novO = votlaCev(osO, rz, rn, telefon ? 14 : 24);
  const crte = [];
  if (!telefon) {
    // osrednja arterija (spredaj v osi) in vena mrežnice: vzporedni črti ±0,13 mm ob osi v ravnini reza
    const p = G.v3.norm(G.v3.cross(nR, u));
    const kZ = G.v3.add(zac, G.v3.mul(u, sB1 + ZILE_DO));
    crte.push({ a: G.v3.add(zac, G.v3.mul(p, 0.00013)), b: G.v3.add(kZ, G.v3.mul(p, 0.00013)), polmer: 0.0001, barva: "#9b2a22", moc: 0.9 });
    crte.push({ a: G.v3.add(zac, G.v3.mul(p, -0.00015)), b: G.v3.add(kZ, G.v3.mul(p, -0.00015)), polmer: 0.00012, barva: "#5c1f2c", moc: 0.9 });
    // lamina cribrosa: prečni svetlejši pas v ravnini beločnice (sredina kanala)
    const sl = G.v3.add(zac, G.v3.mul(u, 0.4 * sB0 + 0.6 * sB1 - 0.0002));
    crte.push({ a: G.v3.add(sl, G.v3.mul(p, -0.0011)), b: G.v3.add(sl, G.v3.mul(p, 0.0011)), polmer: 0.00011, barva: "#f3eee4", moc: 0.75 });
  }
  const r = (x) => +x.toFixed(5);
  const opis = { os: u.map((x) => +x.toFixed(4)), crte: crte.map((c) => ({ ...c, a: c.a.map(r), b: c.b.map(r) })), konec: { sredisce: os[os.length - 1].map(r), os: G.v3.norm(G.v3.sub(os[os.length - 1], os[os.length - 2])).map((x) => +x.toFixed(4)), polmer: R_ZIVEC } };
  const por = `${path.basename(datoteka)}: živec od mrežnice (${(tMrez * 1000).toFixed(2)} mm od središča), beločnica ${(sB0 * 1000).toFixed(2)}–${(sB1 * 1000).toFixed(2)} mm, Ø ${(2 * R_ZIVEC * 1000).toFixed(1)} mm, ovojnica Ø ${(2 * rz(0.004) * 1000).toFixed(1)} mm, dolžina ${(dol * 1000).toFixed(0)} mm`;
  if (suho) return { porocilo: por, opis };
  zamenjaj(doc, zivec, novZ);
  zamenjaj(doc, ovoj, novO, { enVir: true });
  for (const n of [zivec, ovoj]) n.setExtras({ ...(n.getExtras() || {}), r1: 1 });
  // čep papile HRA (debel ≈ 1 mm, v prerezu izbočen kremast valj) odpade: živec zdaj zapolni kanal do mrežnice, disk in
  // ekskavacijo nariše senčilnik mrežnice (mreznicaZile.disk)
  const mesh = pap.getMesh();
  pap.dispose();
  if (!mesh.listParents().some((q) => q.propertyType === "Node")) mesh.dispose();
  for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((q) => q === doc.getRoot())) acc.dispose();
  await io.write(datoteka, doc);
  return { porocilo: por, opis };
}

// Polmer modela kot v organ.js (največja razdalja oglišča od središča škatle): okvir pogledov je relativen nanj.
async function polmerModela(dat) {
  const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(dat);
  const W = [];
  for (const n of doc.getRoot().listNodes()) if (n.getMesh()) W.push(...G.preberi(n, n.getMesh().listPrimitives()[0]).W);
  const lo = [1, 1, 1], hi = [-1, -1, -1];
  for (const p of W) for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], p[c]); hi[c] = Math.max(hi[c], p[c]); }
  const c = lo.map((v, k) => (v + hi[k]) / 2);
  let r = 0;
  for (const p of W) r = Math.max(r, G.v3.dist(p, c));
  return r;
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MAPA, "oko.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  const r0 = await polmerModela(path.join(MAPA, "oko.glb"));
  const rav = podatki.prerez.ravnine[0];
  for (const [ime, kljuc] of [["oko.glb", "racunalnik"], ["oko-telefon.glb", "telefon"]]) {
    const r = await obdelaj(path.join(MAPA, ime), rav, { suho });
    console.log(r.porocilo);
    if (suho || !r.opis) continue;
    if (kljuc === "racunalnik") {
      const z = podatki.tkiva["živec"];
      delete z.brezReza;
      z.rezSnopi = { ...(z.rezSnopi || {}), os: r.opis.os, crte: r.opis.crte };
      z.konec = r.opis.konec;
      for (const d of podatki.deli || []) if (d.vozlisca) d.vozlisca = d.vozlisca.filter((v) => !/^optic_disc/.test(v));
    }
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(MAPA, ime));
    let tri = 0;
    for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) tri += p.getIndices().getCount() / 3;
    podatki.trikotniki[kljuc] = tri;
  }
  if (suho) return;
  // okvirji pogledov ostanejo enako veliki v metrih (nova os živca spremeni polmer modela)
  const k = r0 / (await polmerModela(path.join(MAPA, "oko.glb")));
  if (Math.abs(k - 1) > 1e-4) for (const p of Object.values(podatki.pogledi || {})) if (p.okvir) for (const kl of ["polmer", "polmerTelefon"]) if (p.okvir[kl]) p.okvir[kl] = +(p.okvir[kl] * k).toFixed(4);
  console.log(`okvir: polmer modela ×${(1 / k).toFixed(4)}`);
  fs.writeFileSync(j, JSON.stringify(podatki, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();
