// Dodelava očesa po izvozu (docs/3d.md »Eye finishing«): node scripts/atlas/oko-dodelava.mjs [--suho]
// Vidni živec iz Z-Anatomy je ob zrklu tanek (≈ 1,9 mm), na koncu pa ima kavelj (del proti križišču vidnih živcev, ki
// brez lobanje visi v prazno). Pravi živec v očnici je debel 3–4 mm (z ovojnicami), dolg ≈ 25–30 mm in v rahlem
// loku S teče od papile do vrha očnice, kjer gre skozi skupni kitni obroč v vidni kanal. Skripta mrežo živca zamenja
// s cevjo po tej poti: od papile (središče dela optic_disc) skozi kitni obroč (Common tendinous ring), raven odrezan
// konec ob vidnem kanalu. Barva: UV in barva oglišča enega oglišča stare mreže (živec je enobarven).
// Enkrat (vozlišče dobi extras »cev«); oko.glb in oko-telefon.glb na mestu.
// Krog 9 (ocena krog 8): (a) živec dobi UV najbližjega oglišča stare mreže (pečena ovojnica z vlakni in žilicami,
// ne enobarvna »bela cev«), konec { sredisce, os, polmer } gre v oko.json (tkiva.živec.konec: senčilnik nariše prerez
// z ovojnicami in snopiči); (b) limbus: odprtina beločnice se razširi do LIMBUS (prej je bila šarenica v okrogli luknji s
// sivo poševno steno), obod roženice se zvezno spusti na površino beločnice (brez stopnice); (c) papila: čep HRA se
// splošči v ravnino notranje ploskve mrežnice in dobi tkivo mrežnice (disk in žile nariše senčilnik mrežnice, središče
// diska = središče čepa = začetek živca, mreznicaZile.disk v oko.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
export const POLMER = 0.00175; // 3,5 mm debel živec z ovojnicami

const sredina = (W) => { const c = [0, 0, 0]; for (const p of W) for (let k = 0; k < 3; k++) c[k] += p[k] / W.length; return c; };

// Os živca: kubična Bézierjeva krivulja od papile (iz zrkla naravnost ven) do točke za kitnim obročem, z rahlim S.
export function osZivca(papila, zrklo, obroc, n) {
  const d0 = G.v3.norm(G.v3.sub(papila, zrklo));
  const zac = G.v3.add(papila, G.v3.mul(d0, 0.0011)); // začetek v beločnici za papilo (ne sega v zrklo)
  const dE = G.v3.norm(G.v3.sub(obroc, zac));
  const kon = G.v3.add(obroc, G.v3.mul(dE, 0.004)); // 4 mm za obročem: vhod v vidni kanal
  const s = G.v3.norm(G.v3.cross(dE, [0, 1, 0]));
  const l = G.v3.dist(zac, kon);
  const b1 = G.v3.add(G.v3.add(zac, G.v3.mul(d0, 0.33 * l)), G.v3.mul(s, 0.07 * l));
  const b2 = G.v3.add(G.v3.sub(kon, G.v3.mul(dE, 0.33 * l)), G.v3.mul(s, -0.07 * l));
  const t = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u;
    t.push([0, 1, 2].map((c) => v * v * v * zac[c] + 3 * v * v * u * b1[c] + 3 * v * u * u * b2[c] + u * u * u * kon[c]));
  }
  return t;
}

// Cev okoli osi (vzporedni prenos okvirja), z ravnima pokrovoma. Vrne { P: [[x,y,z]], N: [[x,y,z]], F: [i…] }.
export function cev(os, polmer, stranic) {
  const P = [], N = [], F = [];
  let x = null;
  const tang = (i) => G.v3.norm(G.v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)]));
  for (let i = 0; i < os.length; i++) {
    const t = tang(i);
    x = x ? G.v3.norm(G.v3.sub(x, G.v3.mul(t, G.v3.dot(x, t)))) : G.v3.norm(G.v3.cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    const y = G.v3.cross(t, x);
    for (let j = 0; j < stranic; j++) {
      const a = (2 * Math.PI * j) / stranic;
      const n = G.v3.add(G.v3.mul(x, Math.cos(a)), G.v3.mul(y, Math.sin(a)));
      P.push(G.v3.add(os[i], G.v3.mul(n, polmer)));
      N.push(n);
    }
  }
  for (let i = 0; i + 1 < os.length; i++) for (let j = 0; j < stranic; j++) {
    const a = i * stranic + j, b = i * stranic + (j + 1) % stranic, c = a + stranic, d = b + stranic;
    F.push(a, b, d, a, d, c);
  }
  // pokrova: svoja oglišča z normalo vzdolž osi (raven rez)
  for (const [i, smer] of [[0, -1], [os.length - 1, 1]]) {
    const n = G.v3.mul(tang(i), smer);
    const s0 = P.length;
    for (let j = 0; j < stranic; j++) { P.push(P[i * stranic + j].slice()); N.push(n); }
    P.push(os[i].slice()); N.push(n);
    for (let j = 0; j < stranic; j++) {
      const a = s0 + j, b = s0 + (j + 1) % stranic, c = s0 + stranic;
      if (smer > 0) F.push(a, b, c); else F.push(b, a, c);
    }
  }
  // usmeritev navzven: prostornina mora biti pozitivna
  let v = 0;
  for (let q = 0; q < F.length; q += 3) v += G.v3.dot(P[F[q]], G.v3.cross(P[F[q + 1]], P[F[q + 2]]));
  if (v < 0) for (let q = 0; q < F.length; q += 3) { const a = F[q + 1]; F[q + 1] = F[q + 2]; F[q + 2] = a; }
  return { P, N, F };
}

export const LIMBUS = 0.0059; // polmer limbusa (m): roženica Ø ≈ 11,8 mm

// Okvir zrkla: središče škatle beločnice in os proti težišču roženice.
export function okvirZrkla(Wb, Wr) {
  const lo = [1, 1, 1], hi = [-1, -1, -1];
  for (const p of Wb) for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], p[c]); hi[c] = Math.max(hi[c], p[c]); }
  const O = lo.map((v, c) => (v + hi[c]) / 2);
  return { O, os: G.v3.norm(G.v3.sub(sredina(Wr), O)) };
}
const vOkvir = (p, { O, os }) => { const d = G.v3.sub(p, O); const z = G.v3.dot(d, os); const rad = G.v3.sub(d, G.v3.mul(os, z)); return { z, r: G.v3.len(rad), rad }; };
const gl = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Limbus (mreže iz G.preberi, spremeni na mestu). Beločnica: oglišča sprednjega roba (z > 0,7 R, r < rZ) se radialno
// preslikajo [rRob, rZ] → [LIMBUS, rZ] (odprtina = limbus, zaobljen rob ostane, a pod obodom roženice). Roženica:
// zunanja oglišča oboda (nad površino beločnice S(r) iz prvotnega profila) se z utežjo gl(LIMBUS − 0,5 mm, LIMBUS + 0,5 mm)
// spustijo 0,12 mm pod S(r). Vrne { rRob, premaknjenih } ali null, če je odprtina že široka (ponovljivo).
export function limbus(mb, mr, okvir, rL = LIMBUS) {
  const R = Math.max(...mb.W.map((p) => G.v3.len(G.v3.sub(p, okvir.O))));
  const zM = 0.7 * R, rZ = rL + 0.0006;
  const pb = mb.W.map((p) => vOkvir(p, okvir));
  const rob = pb.filter((q) => q.z > zM && q.r < rZ);
  if (!rob.length) return null;
  const rRob = Math.min(...rob.map((q) => q.r));
  if (rRob > rL - 0.0001) return null;
  // zunanja površina beločnice S(r) (največji z v pasovih po 0,25 mm) iz prvotnega profila, za r ≥ rZ
  const pas = new Map();
  for (const q of pb) if (q.z > zM && q.r >= rZ) { const k = Math.floor(q.r / 0.00025); pas.set(k, Math.max(pas.get(k) ?? -1, q.z)); }
  const kl = [...pas.keys()].sort((a, b) => a - b);
  const S = (r) => { const k = Math.floor(r / 0.00025); for (const x of kl) if (x >= k) return pas.get(x); return pas.get(kl[kl.length - 1]); };
  let st = 0;
  const Wb = mb.W.map((p, i) => {
    const q = pb[i];
    if (q.z <= zM || q.r >= rZ || q.r < 1e-6) return p;
    st++;
    const r2 = rL + ((q.r - rRob) * (rZ - rL)) / (rZ - rRob);
    return G.v3.add(G.v3.add(okvir.O, G.v3.mul(okvir.os, q.z)), G.v3.mul(q.rad, r2 / q.r));
  });
  const Wr = mr.W.map((p) => {
    const q = vOkvir(p, okvir);
    const cilj = S(Math.max(q.r, rZ)) - 0.00012;
    const t = gl(q.r, rL - 0.0005, rL + 0.0005);
    if (t <= 0 || q.z <= cilj) return p;
    st++;
    return G.v3.add(p, G.v3.mul(okvir.os, -t * (q.z - cilj)));
  });
  for (const [m, W] of [[mb, Wb], [mr, Wr]]) {
    const prej = m.W;
    for (let r = 0; r < m.zvar.length; r++) { const w = W[m.zvar[r]]; m.P[r * 3] = w[0]; m.P[r * 3 + 1] = w[1]; m.P[r * 3 + 2] = w[2]; }
    m.W = W;
    // normale premaknjenih oglišč na novo (gladke čez zvarjena oglišča)
    const N = G.normaleZvarjenih(m), nor = m.A.get("NORMAL");
    if (nor) for (let r = 0; r < m.zvar.length; r++) if (prej[m.zvar[r]] !== W[m.zvar[r]]) for (let c = 0; c < 3; c++) nor.d[r * 3 + c] = N[m.zvar[r]][c];
    m.spremenjeno = true;
  }
  return { rRob, premaknjenih: st };
}

// Papila: čep HRA (debel ≈ 1 mm, v prerezu dvignjen »kovanec«) se splošči: oglišča, ki ležijo bliže središču zrkla
// kot notranja ploskev mrežnice v svoji smeri (žarek iz središča), gredo 0,02 mm pred to ploskev. Vrne središče čepa.
export function sploscPapilo(mp, mm, O) {
  const tri = [];
  for (const i of mm.F) tri.push(mm.P[i * 3], mm.P[i * 3 + 1], mm.P[i * 3 + 2]);
  const bvh = new G.BVH(Float64Array.from(tri));
  let st = 0;
  const W = mp.W.map((p) => {
    const d = G.v3.sub(p, O), r = G.v3.len(d), u = G.v3.mul(d, 1 / r);
    const t = bvh.zarek(O, u, 0.03);
    if (t < 0 || r >= t - 0.00002) return p;
    st++;
    return G.v3.add(O, G.v3.mul(u, t - 0.00002));
  });
  for (let r = 0; r < mp.zvar.length; r++) { const w = W[mp.zvar[r]]; mp.P[r * 3] = w[0]; mp.P[r * 3 + 1] = w[1]; mp.P[r * 3 + 2] = w[2]; }
  const N = (mp.W = W, G.normaleZvarjenih(mp)), nor = mp.A.get("NORMAL");
  if (nor) for (let r = 0; r < mp.zvar.length; r++) for (let c = 0; c < 3; c++) nor.d[r * 3 + c] = N[mp.zvar[r]][c];
  mp.spremenjeno = true;
  return { sredisce: sredina(W), premaknjenih: st };
}

function limbOkvir(doc, vozl) {
  const b = vozl(/^sclera/), r = vozl(/^cornea/);
  if (!b || !r) return null;
  const W = (n) => G.preberi(n, n.getMesh().listPrimitives()[0]).W;
  const ok = okvirZrkla(W(b), W(r));
  return { sredisce: ok.O.map((x) => +x.toFixed(5)), os: ok.os.map((x) => +x.toFixed(4)), r0: +(LIMBUS - 0.0006).toFixed(5), r1: +(LIMBUS + 0.00005).toFixed(5) };
}

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const vozl = (rx) => doc.getRoot().listNodes().find((n) => n.getMesh() && rx.test(n.getName()));
  const zivec = vozl(/^Optic nerve/), papila = vozl(/^optic_disc/), belocnica = vozl(/^sclera/), obroc = vozl(/^Common tendinous ring/);
  if (!zivec || !papila || !belocnica || !obroc) throw new Error(`${path.basename(datoteka)}: manjka živec, papila, beločnica ali kitni obroč`);
  if (zivec.getExtras()?.cev) return { porocilo: [`${path.basename(datoteka)}: vidni živec je že cev (brez sprememb)`], limbus: limbOkvir(doc, vozl) };
  const W = (n) => G.preberi(n, n.getMesh().listPrimitives()[0]).W;
  const por0 = [];
  // limbus in papila (pred živcem: os živca gre iz središča sploščene papile)
  const belPrim = belocnica.getMesh().listPrimitives()[0], roz = vozl(/^cornea/), mrez = vozl(/^retina_L/);
  let limb = null;
  if (roz) {
    const mb = G.preberi(belocnica, belPrim), mr = G.preberi(roz, roz.getMesh().listPrimitives()[0]);
    const ok = okvirZrkla(mb.W, mr.W);
    // limbus za senčilnik roženice (tkiva.roženica.limbus): mehak modrikasto siv prehod v beločnico (krog 10, ocena:
    // »bled siv obroč«), r0..r1 od osi zrkla: širši pas (0,9 mm) in zunanji del v barvi beločnice (barva2)
    limb = { sredisce: ok.O.map((x) => +x.toFixed(5)), os: ok.os.map((x) => +x.toFixed(4)), r0: +(LIMBUS - 0.0009).toFixed(5), r1: +(LIMBUS + 0.0002).toFixed(5) };
    const l = limbus(mb, mr, ok);
    if (l) {
      por0.push(`limbus: odprtina beločnice ${(l.rRob * 1000).toFixed(2)} → ${(LIMBUS * 1000).toFixed(2)} mm, ${l.premaknjenih} oglišč`);
      if (!suho) { G.zapisi(doc, belocnica, belPrim, mb); G.zapisi(doc, roz, roz.getMesh().listPrimitives()[0], mr); }
    }
  }
  let disk = null;
  if (mrez) {
    const pp = papila.getMesh().listPrimitives()[0];
    const mp = G.preberi(papila, pp), mm = G.preberi(mrez, mrez.getMesh().listPrimitives()[0]);
    const o = sploscPapilo(mp, mm, okvirZrkla(W(belocnica), W(roz || belocnica)).O);
    disk = o.sredisce;
    por0.push(`papila: ${o.premaknjenih} oglišč v ravnino mrežnice, tkivo mrežnice`);
    if (!suho) { G.zapisi(doc, papila, pp, mp); papila.setExtras({ ...(papila.getExtras() || {}), tkivo: "mrežnica" }); }
  }
  const os = osZivca(disk || sredina(W(papila)), sredina(W(belocnica)), sredina(W(obroc)), telefon ? 14 : 28);
  const c = cev(os, POLMER, telefon ? 10 : 16);
  const prim = zivec.getMesh().listPrimitives()[0];
  const m = G.preberi(zivec, prim);
  // vir atributov: oglišče stare mreže najbližje sredini osi (stran od zrkla in od kavlja)
  const n0 = m.P.length / 3;
  const sr = os[Math.floor(os.length / 2)];
  let vir = 0, bd = Infinity;
  for (let r = 0; r < n0; r++) { const d = G.v3.dist([m.P[r * 3], m.P[r * 3 + 1], m.P[r * 3 + 2]], sr); if (d < bd) { bd = d; vir = r; } }
  // UV in barva iz najbližjega oglišča stare mreže (pečena ovojnica: vlakna, žilice), ne iz enega oglišča (enobarvna cev)
  const najblizje = (p) => { let v = vir, b = Infinity; for (let r = 0; r < n0; r++) { const d = (m.P[r * 3] - p[0]) ** 2 + (m.P[r * 3 + 1] - p[1]) ** 2 + (m.P[r * 3 + 2] - p[2]) ** 2; if (d < b) { b = d; v = r; } } return v; };
  for (let i = 0; i < c.P.length; i++) G.dodajOglisce(m, c.P[i], [[najblizje(c.P[i]), 1]], m.A.has("NORMAL") ? { NORMAL: c.N[i] } : {});
  // stara oglišča odpadejo
  m.P = m.P.slice(n0 * 3);
  for (const a of m.A.values()) a.d = a.d.slice(n0 * a.n);
  m.F = c.F.slice();
  m.spremenjeno = true;
  G.zvari(m);
  let dol = 0;
  for (let i = 0; i + 1 < os.length; i++) dol += G.v3.dist(os[i], os[i + 1]);
  const por = [...por0, `${path.basename(datoteka)}: vidni živec ${n0} → ${c.P.length} oglišč, cev ${(2 * POLMER * 1000).toFixed(1)} mm × ${(dol * 1000).toFixed(0)} mm`];
  const konec = { sredisce: os[os.length - 1].map((x) => +x.toFixed(5)), os: G.v3.norm(G.v3.sub(os[os.length - 1], os[os.length - 2])).map((x) => +x.toFixed(4)), polmer: POLMER };
  if (suho) return { porocilo: por, konec, disk, limbus: limb };
  G.zapisi(doc, zivec, prim, m);
  zivec.setExtras({ ...(zivec.getExtras() || {}), cev: 1 });
  await io.write(datoteka, doc);
  return { porocilo: por, konec, disk, limbus: limb };
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MAPA, "oko.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  for (const [ime, kljuc] of [["oko.glb", "racunalnik"], ["oko-telefon.glb", "telefon"]]) {
    const r = await dodelaj(path.join(MAPA, ime), { suho });
    for (const v of r.porocilo) console.log(v);
    if (suho) continue;
    if (kljuc === "racunalnik" && (r.konec || r.limbus)) {
      if (r.konec) podatki.tkiva["živec"].konec = r.konec;
      if (r.limbus && podatki.tkiva["roženica"]) podatki.tkiva["roženica"].limbus = { barva: "#a9b1bb", barva2: "#e9e4dc", moc: 0.5, ...(podatki.tkiva["roženica"].limbus || {}), ...r.limbus };
      if (r.disk && podatki.tkiva["mrežnica"]?.mreznicaZile) podatki.tkiva["mrežnica"].mreznicaZile.disk = r.disk.map((x) => +x.toFixed(5));
    }
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(MAPA, ime));
    let tri = 0;
    for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) tri += p.getIndices().getCount() / 3;
    podatki.trikotniki[kljuc] = tri;
  }
  if (!suho) fs.writeFileSync(j, JSON.stringify(podatki, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();
