// Popravek žil v GLB (naknadna obdelava, ponovljiva): luknje, obrnjene ploskve, odrezane stene, debelina sten.
//
// Zagon:
//   node scripts/atlas/popravi-zile.mjs                 vse datoteke iz NACRT (organi-3d/srce*, jetra*, telo*/zile)
//   node scripts/atlas/popravi-zile.mjs srce            samo datoteke, katerih pot vsebuje »srce«
//   node scripts/atlas/popravi-zile.mjs srce --suho     brez pisanja, samo poročilo
//   node scripts/atlas/popravi-zile.mjs --vhod a.glb --izhod b.glb --nacrt srce   druga datoteka z načrtom »srce«
//                                                       (npr. nov izvoz ali teksturirana različica iz PR #567)
//
// Kaj naredi (po delih, izbranih z imenom vozlišča; imena, materiali, extras in UV ostanejo):
//   usmeri    vse ploskve komponente enako navite, zunanja stran navzven
//   dopolni   stena cevi, ki jo je izvoz odrezal z ravnino škatle (»leča« vzdolž cevi): iz preostale stene določi os in
//             polmer cevi ter manjkajoči del stene zgradi na istem valju (brez šiva: robna oglišča ostanejo)
//   zgosti    oglate velike žile (6 ali 12 stranic) dobijo do 24 stranic, kjer gladka cev odstopa od tetive (NACRT.zgosti)
//   stiki     konca sosednjih delov iste žile dobita ista oglišča in normale (lok ↔ prsna aorta, deblo ↔ razcepišče),
//             šiv se zgladi (tudi ob dograjeni steni)
//   stena     votla žila z resnično debelino: notranja stena v razdalji »mm« in obroč na vsakem odprtem koncu (raven
//             rob samo na vidnih koncih)
//   polna     drobna žila: vsak odprt konec zapre s pokrovom (zaprta polna cevka)
//   zakrpaj   zapre majhne luknje (npr. po poenostavljanju za telefon)
// Ponovni zagon na že popravljeni datoteki ne naredi nič (dela brez odprtih robov preskoči).
// Po popravku: node scripts/atlas/preveri-mreze.mjs --izhodisce (izhodišče se sme samo zmanjšati).
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import * as G from "./zile-mreza.mjs";
import { jeZila } from "./preveri-mreze.mjs";

const { v3 } = G;
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MODELI = path.join(ROOT, "public", "3d", "modeli");
const MM = 1e-3;
const beriJson = (ime) => JSON.parse(fs.readFileSync(path.join(MODELI, "organi-3d", ime), "utf8"));
const kl = (p) => `${Math.round(p[0] / 2e-6)},${Math.round(p[1] / 2e-6)},${Math.round(p[2] / 2e-6)}`; // položaj oglišča na stiku

// Debeline sten (mm) po j-jevem naročilu 11. 11. 2026: aorta 2,5, pljučno deblo 1,5, vene 1.
export const NACRT = {
  srce: {
    datoteke: ["organi-3d/srce.glb", "organi-3d/srce-telefon.glb"],
    dopolni: [["Aortic arch", "Thoracic aorta"], ["Left pulmonary artery"]],
    stena: [
      [/^(Ascending aorta|Aortic arch|Thoracic aorta)$/, 2.5],
      [/^(Pulmonary trunk|Bifurcation of pulmonary trunk|(Left|Right) pulmonary artery)$/, 1.5],
      [/vena cava|pulmonary vein/, 1.0],
    ],
    polna: /coronary|cardiac vein|interventricular|Circumflex|vein of left ventricle/i,
    // Zgostitev oglatih velikih žil (12 stranic → 24, kjer gladka cev od tetive odstopa za več kot toliko mm).
    // Telefon: samo aorta (polmer ≥ 14 mm), ker ima srce za telefon mejo 90 000 trikotnikov.
    zgosti: (pot) => (/telefon/.test(path.basename(pot)) ? 0.44 : 0.15),
    stikiSkupaj: true, // deli iste žile: skupna mreža kvantizacije in oznaka »stik« (prerez brez pregrade na stiku)
    senca: true, // COLOR_0.r spremenjenih delov na novo (enak postopek kot izvoz)
    odprtost: true, // COLOR_0.g (izvoz srca: odprtost=True)
    // Velikost organa ob izvozu (diagonala škatle; dolžina žarkov sence je 0,14 × velikost). Namenoma velikost ob
    // izvozu, ne škatla z dograjenim lokom: nespremenjeni deli imajo senco zapečeno s to dolžino.
    velikost: beriJson("srce.json").velikost,
  },
};

// Jetra: žile so že votle (zunanja in notranja lupina kot ločeni zaprti komponenti); pri poenostavljanju za telefon
// so v vejicah ostale drobne luknje.
NACRT.jetra = {
  datoteke: ["organi-3d/jetra.glb", "organi-3d/jetra-telefon.glb"],
  zakrpaj: [[/^(Hepatic|Common hepatic|Proper hepatic|Bile duct)/, 60]],
  senca: true,
  velikost: beriJson("jetra.json").velikost,
};

// Telo (plast žil): cevi s šestimi stranicami, odprte na obeh koncih, del ploskev obrnjen. Velike žile dobijo steno,
// vse druge postanejo zaprte polne cevke. Imena vozlišč imajo pripono (».001«), zato izbiramo po extras.zid.
NACRT.telo = {
  datoteke: ["telo/zile.glb", "telo-hd/zile.glb"],
  izberi: (ime, extras) => jeZila(ime, extras),
  stena: [
    [/^(Ascending aorta|Aortic arch|Thoracic aorta|Abdominal aorta)$/, 2.5],
    [/^(Pulmonary trunk|Bifurcation of pulmonary trunk|(Left|Right) pulmonary artery)$/, 1.5],
    [/^(Brachiocephalic trunk|(Left|Right) common carotid artery|(Left|Right) subclavian artery|Common iliac artery\.[lr])$/, 1.5],
    [/^(Superior vena cava|Inferior vena cava.*|(Left|Right) brachiocephalic vein|Common iliac vein\.[lr]|(Left|Right) (superior|inferior) pulmonary vein)$/, 1.0],
  ],
  polna: /./,
  // 6 stranic → 12 → 24 pri velikih žilah (HD); navadna različica (telefon) ostane pri 12
  zgosti: (pot) => (/telo-hd/.test(pot) ? 0.3 : 0.7),
  // Konec drobne žile: rahlo izbočen pokrov z ogliščem v sredini (normala v smeri osi) in svojimi oglišči na robu
  // (normala med steno in osjo). Raven pokrov iz oglišč obroča (normale stene, pravokotne na pogled) se je od
  // spredaj osenčil bledo sivo. Kupolo dobi samo prost konec; konec, ki tiči v drugi žili, ostane raven.
  pokrov: "kupola",
};

const log = (...a) => console.log(...a);
const mm = (x) => (x / MM).toFixed(1);

// ---------------------------------------------------------------------------------------------------------------
// dopolni: odrezana stena cevi
// ---------------------------------------------------------------------------------------------------------------

// Zanka z verigo oglišč na osni ravnini (obrez škatle). Ali je to odrezana stena vzdolž cevi (leča, žleb) ali konec
// cevi, odloči dopolni(): zanka konca obkroži os cevi, zanka odrezane stene ne.
function lecaZanke(m, z) {
  const ravnine = [];
  for (let os = 0; os < 3; os++) {
    const urejene = z.map((e) => m.W[e.w][os]).sort((a, b) => a - b);
    // najpogostejše vrednosti (okno 40 µm), nato pripadnost ± 0,3 mm (poenostavljanje za telefon robna oglišča malo premakne)
    let i0 = 0;
    const kand = [];
    for (let i = 0; i < urejene.length; i++) {
      while (urejene[i] - urejene[i0] > 4e-5) i0++;
      kand.push({ st: i - i0 + 1, v: (urejene[i] + urejene[i0]) / 2 });
    }
    kand.sort((a, b) => b.st - a.st);
    for (const k of kand) {
      if (k.st < 4) break;
      if (ravnine.some((r) => r.os === os && Math.abs(r.v - k.v) < 1e-3)) continue;
      let vsota = 0;
      for (const p of m.W) vsota += p[os] - k.v;
      const n = [0, 0, 0];
      n[os] = vsota > 0 ? -1 : 1;
      ravnine.push({ os, v: k.v, n });
    }
  }
  if (!ravnine.length) return null;
  const ravninaOgl = z.map((e) => ravnine.find((r) => Math.abs(m.W[e.w][r.os] - r.v) < 3e-4) || null);
  const upor = ravnine.filter((r) => ravninaOgl.filter((x) => x === r).length >= 4);
  const naRavnini = ravninaOgl.map((r) => !!r && upor.includes(r));
  const st = naRavnini.filter(Boolean).length;
  if (st < 5 || st < 0.3 * z.length) return null;
  const n = v3.norm(upor.reduce((a, r) => v3.add(a, r.n), [0, 0, 0]));
  return { n, naRavnini, opis: upor.map((r) => `${"xyz"[r.os]} = ${mm(r.v)} mm`).join(", ") };
}

const loki = new Map(); // skupni dopolnjeni obroči med deli (ključ: zaokroženo središče)

export function dopolni(skupina) {
  // 1. zanke in leče
  const vse = [];
  for (const d of skupina) {
    for (const z of G.zanke(d.m)) vse.push({ d, z, opis: G.opisZanke(d.m, z), leca: lecaZanke(d.m, z) });
  }
  const lece = vse.filter((x) => x.leca);
  if (!lece.length) return 0;
  // 2. os: sledimo od vsakega okroglega konca, izberemo sled, ki se lečam najbolje prilega
  const tocke = [];
  for (const d of skupina) tocke.push(...d.m.W);
  const sledi = [];
  for (const x of vse) {
    if (x.leca || x.opis.okroglost < 0.8 || x.z.length < 6) continue;
    // smer v cev: stran, kjer so bližnja oglišča
    let sk = 0;
    for (const p of tocke) { const dd = v3.sub(p, x.opis.c); if (v3.len(dd) < 3 * x.opis.r) sk += v3.dot(dd, x.opis.n); }
    const os = G.osCevi(tocke, x.opis.c, v3.mul(x.opis.n, sk >= 0 ? 1 : -1), x.opis.r);
    if (os.length >= 4) sledi.push(os);
  }
  let dodano = 0;
  for (const x of lece) {
    const { d, z, leca } = x;
    const m = d.m;
    let naj = null;
    for (const os of sledi) {
      const par = G.parametrizacija(os, leca.n);
      let napaka = 0, st = 0;
      z.forEach((e, i) => { if (!leca.naRavnini[i]) return; const q = par.izTocke(m.W[e.w]); napaka += Math.abs(q.rho - par.vTocki(q.s).r) / par.vTocki(q.s).r; st++; });
      napaka /= st;
      if (!naj || napaka < naj.napaka) naj = { par, napaka, os };
    }
    if (!naj || naj.napaka > 0.12) { log(`   ! ${d.ime}: osi cevi ob odrezani steni ni mogoče zanesljivo določiti (odstopanje ${naj ? (naj.napaka * 100).toFixed(0) : "?"} %), luknja ostane`); continue; }
    const par = naj.par;
    // 3. veriga na ravnini in ostanek obroča
    const L = z.length;
    const tek = []; // začetki nizov oglišč izven ravnine
    for (let i = 0; i < L; i++) if (!leca.naRavnini[i] && leca.naRavnini[(i + L - 1) % L]) tek.push(i);
    if (tek.length > 1) { log(`   ! ${d.ime}: odrezana stena z več konci obroča, luknja ostane`); continue; }
    // mnogokotnik luknje: seznam { r (izrisno oglišče) }
    let poly, novLok = null; // izrisna oglišča po vrsti zanke
    if (!tek.length) poly = z.map((e) => e.r);
    else {
      const i0 = tek[0];
      let i1 = i0;
      while (!leca.naRavnini[(i1 + 1) % L]) i1 = (i1 + 1) % L; // zadnje oglišče izven ravnine
      const iA = (i0 + L - 1) % L, iB = (i1 + 1) % L; // A → obroč → B
      const obroc = [];
      for (let i = i0; ; i = (i + 1) % L) { obroc.push(m.W[z[i].w]); if (i === i1) break; }
      const A = m.W[z[iA].w], B = m.W[z[iB].w];
      const rav = G.ravnina([A, ...obroc, B]);
      const [u, w] = rav.osi;
      const v2 = (p) => { const dd = v3.sub(p, rav.c); return [v3.dot(dd, u), v3.dot(dd, w)]; };
      const k = G.krog2((obroc.length >= 3 ? obroc : [A, ...obroc, B]).map(v2));
      if (!k) { log(`   ! ${d.ime}: obroča ob odrezani steni ni mogoče določiti, luknja ostane`); continue; }
      const sred = v3.add(rav.c, v3.add(v3.mul(u, k.x), v3.mul(w, k.y)));
      const kljuc = sred.map((c) => Math.round(c / 2e-4)).join(",");
      let lok = loki.get(kljuc); // točke od B proti A po zunanji strani
      if (lok) {
        if (v3.dist(lok.B, B) > v3.dist(lok.B, A)) lok = { tocke: lok.tocke.slice().reverse(), B: lok.A, A: lok.B, sred: lok.sred };
      } else {
        const kot = (p) => { const q = v2(p); return Math.atan2(q[1] - k.y, q[0] - k.x); };
        const a0 = kot(B);
        let a1 = kot(A);
        // smer loka: skozi zunanjo stran ravnine obreza
        const naKrogu = (a) => v3.add(sred, v3.add(v3.mul(u, k.r * Math.cos(a)), v3.mul(w, k.r * Math.sin(a))));
        let razpon = a1 - a0;
        while (razpon <= 0) razpon += 2 * Math.PI;
        const sredina = naKrogu(a0 + razpon / 2);
        if (v3.dot(v3.sub(sredina, A), leca.n) < 0) razpon -= 2 * Math.PI;
        const st = Math.max(1, Math.round(Math.abs(razpon) / (Math.PI / 6)));
        const tocke = [];
        for (let i = 1; i < st; i++) tocke.push(naKrogu(a0 + (razpon * i) / st));
        lok = { tocke, A, B, sred };
        loki.set(kljuc, lok);
      }
      // luknja: ravninska veriga B … A (po zanki), nato lok nazaj od A proti B (oglišča loka nastanejo spodaj)
      poly = [];
      for (let i = iB; ; i = (i + 1) % L) { poly.push(z[i].r); if (i === iA) break; }
      novLok = { lok, rB: z[iB].r, rA: z[iA].r };
    }
    // odprtina, ki obkroži os, je konec cevi (ravnina jo je odrezala počez): ostane odprt konec z obročem
    {
      const tt = [...poly.map((r) => G.pol(m, r)), ...(novLok ? novLok.lok.tocke.slice().reverse() : [])];
      let ovoj = 0;
      for (let i = 0; i < tt.length; i++) {
        let dk = par.izTocke(tt[(i + 1) % tt.length]).kot - par.izTocke(tt[i]).kot;
        while (dk > Math.PI) dk -= 2 * Math.PI;
        while (dk < -Math.PI) dk += 2 * Math.PI;
        ovoj += dk;
      }
      if (Math.abs(ovoj) > Math.PI) continue;
    }
    if (novLok) {
      const { lok, rB, rA } = novLok;
      const nova = lok.tocke.map((p, i) => {
        const t = (i + 1) / (lok.tocke.length + 1);
        return G.dodajOglisce(m, p, [[rB, 1 - t], [rA, t]], { NORMAL: v3.norm(v3.sub(p, lok.sred)) });
      });
      poly.push(...nova.slice().reverse());
    }
    // 4. parametrizacija in triangulacija
    const q = poly.map((r) => par.izTocke(G.pol(m, r)));
    const rs = q.reduce((a, b) => a + par.vTocki(b.s).r, 0) / q.length;
    const koti = q.map((x2) => x2.kot);
    if (Math.max(...koti) - Math.min(...koti) > 5.2) { log(`   ! ${d.ime}: odprtina sega čez več kot pol oboda cevi (konec cevi, ne leča), ostane odprta`); continue; }
    const p2 = q.map((x2) => [x2.s, x2.kot * rs]);
    const h = (rs * 2 * Math.PI) / 18;
    const notr = G.notranjeTocke(p2, h);
    const { tri } = G.trianguliraj(p2, notr);
    const obstojeca = poly.slice();
    const novi = notr.map((p) => {
      const o = par.naCevi(p[0], p[1] / rs);
      const utezi = obstojeca.map((r, i) => [r, 1 / ((p2[i][0] - p[0]) ** 2 + (p2[i][1] - p[1]) ** 2 + 1e-12)]);
      return G.dodajOglisce(m, o.p, utezi, { NORMAL: o.n });
    });
    const id = (i) => (i < poly.length ? poly[i] : novi[i - poly.length]);
    // usmeritev: rob zanke a → b mora biti v novem trikotniku b → a
    const a = m.zvar[poly[0]], b = m.zvar[poly[1]];
    let obrni = false;
    for (const t of tri) for (let kk = 0; kk < 3; kk++) if (m.zvar[id(t[kk])] === a && m.zvar[id(t[(kk + 1) % 3])] === b) obrni = true;
    for (const t of tri) m.F.push(id(t[0]), id(t[obrni ? 2 : 1]), id(t[obrni ? 1 : 2]));
    // normale robnih oglišč na ravnini: radialno od osi (prej izračunane brez manjkajoče stene)
    z.forEach((e, i) => {
      if (!leca.naRavnini[i]) return;
      const qq = par.izTocke(m.W[e.w]);
      const o = par.vTocki(qq.s);
      const n = v3.norm(v3.sub(v3.sub(m.W[e.w], o.c), v3.mul(o.t, v3.dot(v3.sub(m.W[e.w], o.c), o.t))));
      for (let r = 0; r < m.zvar.length; r++) if (m.zvar[r] === e.w) G.nastaviAtribut(m, "NORMAL", r, n);
    });
    // jedro glajenja (zgladiOkoli): šiv med staro in dograjeno steno in dograjena stena sama
    if (!m.jedro) m.jedro = [];
    for (const r of [...poly, ...novi]) m.jedro.push({ p: G.pol(m, r), D: 0.8 * rs });
    m.spremenjeno = true;
    dodano += tri.length;
    log(`   ${d.ime}: dopolnjena odrezana stena (${z.length} robov, ravnina ${leca.opis}, polmer cevi ${mm(rs)} mm, odstopanje osi ${(naj.napaka * 100).toFixed(1)} %): +${tri.length} trikotnikov`);
  }
  return dodano;
}

// ---------------------------------------------------------------------------------------------------------------
// stiki: konca sosednjih delov iste žile
// ---------------------------------------------------------------------------------------------------------------

// Stiki med deli iste žile (npr. vzpenjajoča aorta ↔ aortni lok): obroča na istem mestu morata imeti ista oglišča in
// iste normale, sicer se ob stiku vidi reža ali rob obroča. Premakne se obroč z več oglišči (ali drugi del): oglišča
// na oglišča drugega obroča (enako število) ali na njegov mnogokotnik; premik zamre v razdalji 1,2 polmera.
export function stiki(deli) {
  const vse = [];
  for (const d of deli) for (const z of G.zanke(d.m)) vse.push({ d, z, o: G.opisZanke(d.m, z) });
  let st = 0;
  for (let i = 0; i < vse.length; i++) for (let j = i + 1; j < vse.length; j++) {
    let x = vse[i], y = vse[j];
    if (x.d === y.d) continue;
    if (v3.dist(x.o.c, y.o.c) > 0.25 * Math.max(x.o.r, y.o.r) || Math.abs(x.o.r - y.o.r) > 0.2 * Math.max(x.o.r, y.o.r)) continue;
    if (Math.abs(v3.dot(x.o.n, y.o.n)) < 0.9) continue; // sotočje dveh žil pod kotom, ne stik iste cevi
    if (x.z.length > y.z.length) [x, y] = [y, x]; // y se premakne na x
    const cilj = x.z.map((e) => x.d.m.W[e.w]);
    const m = y.d.m;
    const rob = y.z.map((e) => e.w);
    const premik = new Map();
    let enako = x.z.length === y.z.length;
    if (enako) {
      const zasedeno = new Set();
      for (const w of rob) {
        let bi = -1, bd = Infinity;
        cilj.forEach((q, k) => { const dd = v3.dist(m.W[w], q); if (dd < bd) { bd = dd; bi = k; } });
        if (zasedeno.has(bi)) { enako = false; break; }
        zasedeno.add(bi);
        premik.set(w, v3.sub(cilj[bi], m.W[w]));
      }
      // obroča sta zasukana drug proti drugemu: oglišče na oglišče bi cev zvilo; raje na mnogokotnik in unija oglišč
      if (enako) for (const q of premik.values()) if (v3.len(q) > 0.12 * y.o.r) { enako = false; break; }
    }
    if (!enako) {
      premik.clear();
      for (const w of rob) {
        const p = m.W[w];
        let best = null, bd = Infinity;
        for (let k = 0; k < cilj.length; k++) {
          const p0 = cilj[k], p1 = cilj[(k + 1) % cilj.length];
          const ab = v3.sub(p1, p0);
          const u = Math.max(0, Math.min(1, v3.dot(v3.sub(p, p0), ab) / (v3.dot(ab, ab) || 1)));
          const q = v3.add(p0, v3.mul(ab, u));
          const dd = v3.dist(p, q);
          if (dd < bd) { bd = dd; best = q; }
        }
        premik.set(w, v3.sub(best, p));
      }
    }
    let najP = 0;
    for (const p of premik.values()) najP = Math.max(najP, v3.len(p));
    if (najP > 0.3 * y.o.r) { log(`   ! ${y.d.ime} ↔ ${x.d.ime}: konca sta blizu, a druge oblike (premik ${mm(najP)} mm), stik ostane neporavnan`); continue; }
    if (najP > 2e-6) {
      const D = 1.2 * y.o.r;
      const novo = m.W.map((p, w) => {
        if (premik.has(w)) return v3.add(p, premik.get(w));
        let bd = Infinity, bw = -1;
        for (const r of rob) { const dd = v3.dist(p, m.W[r]); if (dd < bd) { bd = dd; bw = r; } }
        if (bd >= D) return p;
        const t = 1 - bd / D;
        return v3.add(p, v3.mul(premik.get(bw), t * t * (3 - 2 * t)));
      });
      const premaknjena = new Set();
      for (let r = 0; r < m.zvar.length; r++) {
        const p = novo[m.zvar[r]];
        if (p !== m.W[m.zvar[r]]) premaknjena.add(r);
        m.P[r * 3] = p[0]; m.P[r * 3 + 1] = p[1]; m.P[r * 3 + 2] = p[2];
      }
      G.zvari(m);
      const N = G.normaleZvarjenih(m);
      for (const r of premaknjena) G.nastaviAtribut(m, "NORMAL", r, N[m.zvar[r]]);
      m.spremenjeno = true;
      st++;
      log(`   ${y.d.ime}: konec poravnan z obročem dela »${x.d.ime}« (največji premik ${mm(najP)} mm)`);
    }
    // različno število oglišč: oba obroča dobita unijo oglišč (brez T-stikov, notranji steni se ujemata)
    if (!enako) {
      const dodanih = uskladiObroca(x.d.m, m, x.o.c);
      st += dodanih;
      if (dodanih) log(`   ${x.d.ime} ↔ ${y.d.ime}: obroča stika usklajena (+${dodanih} oglišč)`);
    }
    // skupne normale na stiku
    const Nx = G.normaleZvarjenih(x.d.m), Ny = G.normaleZvarjenih(m);
    const poKljucu = new Map();
    x.d.m.W.forEach((p, w) => poKljucu.set(kl(p), w));
    for (let r = 0; r < m.zvar.length; r++) {
      const wx = poKljucu.get(kl(m.W[m.zvar[r]]));
      if (wx === undefined) continue;
      const n = v3.norm(v3.add(Nx[wx], Ny[m.zvar[r]]));
      G.nastaviAtribut(m, "NORMAL", r, n);
      for (let q = 0; q < x.d.m.zvar.length; q++) if (x.d.m.zvar[q] === wx) G.nastaviAtribut(x.d.m, "NORMAL", q, n);
      skupneNormale.set(kl(m.W[m.zvar[r]]), n);
    }
  }
  // Stik treh ali več delov (razcepišče: veji se začneta v obroču glavne cevi): pari zgoraj bi dali glavni cevi in
  // vejama različne normale (stopnica v svetlosti ob obroču). Vsi deli dobijo isto normalo: vsoto svojih gladkih.
  const naStiku = new Map(); // ključ položaja → [{ m, w }]
  for (const d of new Set(vse.map((x) => x.d))) d.m.W.forEach((p, w) => {
    const k = kl(p);
    if (!skupneNormale.has(k)) return;
    let l = naStiku.get(k);
    if (!l) naStiku.set(k, (l = []));
    l.push({ m: d.m, w });
  });
  const gladke = new Map();
  for (const [k, l] of naStiku) {
    if (l.length < 3) continue;
    let n = [0, 0, 0];
    for (const { m, w } of l) { if (!gladke.has(m)) gladke.set(m, G.normaleZvarjenih(m)); n = v3.add(n, gladke.get(m)[w]); }
    if (v3.len(n) < 0.5) continue; // normale si nasprotujejo: ostane, kot je
    n = v3.norm(n);
    skupneNormale.set(k, n);
    for (const { m, w } of l) for (let r = 0; r < m.zvar.length; r++) if (m.zvar[r] === w) G.nastaviAtribut(m, "NORMAL", r, n);
  }
  return st;
}
// Stik obročev z različnim številom oglišč (oglišča y že ležijo na mnogokotniku x): rob obroča x razpolovimo v vsakem
// oglišču y, ki leži sredi roba, in rob obroča y v vsakem oglišču x, dokler nimata obroča istih oglišč. Razpolovitev
// robnega roba razdeli njegov edini trikotnik na dva. Vrne število dodanih oglišč.
function uskladiObroca(mx, my, c) {
  const obroc = (m) => {
    let naj = null, nd = Infinity;
    for (const z of G.zanke(m)) { const d = v3.dist(G.opisZanke(m, z).c, c); if (d < nd) { nd = d; naj = z; } }
    return naj;
  };
  const razdeli = (m, e, p) => {
    for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) {
      if (m.F[f + k] !== e.r || m.F[f + (k + 1) % 3] !== e.r2) continue;
      const cc = m.F[f + (k + 2) % 3];
      const u = v3.dist(G.pol(m, e.r), p) / (v3.dist(G.pol(m, e.r), G.pol(m, e.r2)) || 1);
      const n = G.dodajOglisce(m, p, [[e.r, 1 - u], [e.r2, u]]);
      m.F[f] = e.r; m.F[f + 1] = n; m.F[f + 2] = cc;
      m.F.push(n, e.r2, cc);
      return true;
    }
    return false;
  };
  const premakni = (m, w, p) => { for (let r = 0; r < m.zvar.length; r++) if (m.zvar[r] === w) { m.P[r * 3] = p[0]; m.P[r * 3 + 1] = p[1]; m.P[r * 3 + 2] = p[2]; } m.spremenjeno = true; };
  let dodanih = 0;
  for (let varno = 0; varno < 400; varno++) {
    const zx = obroc(mx), zy = obroc(my);
    if (!zx || !zy) break;
    const kx = new Map(zx.map((e) => [kl(mx.W[e.w]), e])), ky = new Set(zy.map((e) => kl(my.W[e.w])));
    const naRobu = (z, m, p) => { // najbližji rob zanke: { e, u, d }
      let naj = null;
      for (const e of z) {
        const a = m.W[e.w], b = m.W[e.w2], ab = v3.sub(b, a);
        const u = Math.max(0, Math.min(1, v3.dot(v3.sub(p, a), ab) / (v3.dot(ab, ab) || 1)));
        const d = v3.dist(p, v3.add(a, v3.mul(ab, u)));
        if (!naj || d < naj.d) naj = { e, u, d, l: v3.len(ab) };
      }
      return naj;
    };
    let sprememba = false;
    const ey = zy.find((e) => !kx.has(kl(my.W[e.w])));
    if (ey) {
      const p = my.W[ey.w];
      const r = naRobu(zx, mx, p);
      if (r.u * r.l < 2e-5 || (1 - r.u) * r.l < 2e-5) premakni(my, ey.w, r.u < 0.5 ? mx.W[r.e.w] : mx.W[r.e.w2]); // skoraj v oglišču x
      else { if (!razdeli(mx, r.e, p)) break; dodanih++; }
      sprememba = true;
    } else {
      const ex = zx.find((e) => !ky.has(kl(mx.W[e.w])));
      if (ex) {
        const p = mx.W[ex.w];
        const r = naRobu(zy, my, p);
        if (!razdeli(my, r.e, p)) break;
        dodanih++;
        sprememba = true;
      }
    }
    if (!sprememba) break;
    G.zvari(mx); G.zvari(my);
  }
  // oglišči y, premaknjeni v isto oglišče x: trikotnik brez ploščine odpade
  if (G.brezIzrojenih(my)) G.zvari(my);
  return dodanih;
}

// Vrstni red dveh položajev (po zaokroženih koordinatah): enak v obeh delih stika.
const vecji = (p, q) => { for (let c = 0; c < 3; c++) { const d = Math.round(p[c] / 2e-6) - Math.round(q[c] / 2e-6); if (d) return d > 0; } return false; };
// Razcepišče (obroč, ki si ga delijo trije ali več delov): po uskladitvi je obroč unija oglišč vseh delov, od katerih
// so ena na krožnici (zgoščena cev), druga na tetivah sosednjega obroča. Tak nazobčan obroč se ob stiku treh cevi
// osenči kot »zobje« (telefon: 12 stranic). Oglišča obroča prestavimo na skupno krožnico v ravnini obroča; premik
// zamre v razdalji 1,2 polmera, v vseh delih enako. Vrne število prestavljenih oglišč.
export function zaokroziRazcepisca(deli) {
  const stDelov = new Map(); // ključ položaja na odprtem koncu → število delov
  const zanke = deli.map((d) => G.zanke(d.m));
  deli.forEach((d, i) => { for (const k of new Set(zanke[i].flat().map((e) => kl(d.m.W[e.w])))) stDelov.set(k, (stDelov.get(k) || 0) + 1); });
  const cilj = new Map(); // ključ → nov položaj
  const krogi = [];
  deli.forEach((d, i) => {
    for (const z of zanke[i]) {
      if (!z.every((e) => stDelov.get(kl(d.m.W[e.w])) >= 3)) continue;
      const o = G.opisZanke(d.m, z);
      if (o.okroglost < 0.7 || o.odmik > 0.2 * o.r || krogi.some((k) => v3.dist(k.c, o.c) < 0.25 * o.r)) continue;
      krogi.push(o);
      for (const e of z) {
        const p = d.m.W[e.w];
        const v = v3.sub(p, o.c);
        const vRavnini = v3.sub(v, v3.mul(o.n, v3.dot(v, o.n)));
        cilj.set(kl(p), v3.add(o.c, v3.mul(v3.norm(vRavnini), o.r)));
      }
    }
  });
  if (!cilj.size) return 0;
  let st = 0;
  for (const d of deli) {
    const m = d.m;
    const rob = [];
    m.W.forEach((p, w) => { const c = cilj.get(kl(p)); if (c) rob.push({ w, premik: v3.sub(c, p) }); });
    if (!rob.length) continue;
    const naRobu = new Map(rob.map((x) => [x.w, x.premik]));
    let D = 0;
    for (const k of krogi) if (v3.dist(k.c, m.W[rob[0].w]) < 2 * k.r) D = 1.2 * k.r;
    const novo = m.W.map((p, w) => {
      if (naRobu.has(w)) return v3.add(p, naRobu.get(w));
      let bd = Infinity, bp = null;
      for (const x of rob) { const dd = v3.dist(p, m.W[x.w]); if (dd < bd) { bd = dd; bp = x.premik; } }
      if (bd >= D) return p;
      const u = 1 - bd / D;
      return v3.add(p, v3.mul(bp, u * u * (3 - 2 * u)));
    });
    const premaknjena = [];
    for (let r = 0; r < m.zvar.length; r++) {
      const p = novo[m.zvar[r]];
      if (p !== m.W[m.zvar[r]]) premaknjena.push(r);
      m.P[r * 3] = p[0]; m.P[r * 3 + 1] = p[1]; m.P[r * 3 + 2] = p[2];
    }
    G.zvari(m);
    const N = G.normaleZvarjenih(m);
    for (const r of premaknjena) G.nastaviAtribut(m, "NORMAL", r, N[m.zvar[r]]);
    m.spremenjeno = true;
    st += rob.length;
  }
  if (st) log(`   razcepišča: ${krogi.length} obročev na krožnico (${st} oglišč)`);
  return st;
}

const skupneNormale = new Map(); // položaj oglišča na stiku → normala (stena: ista smer odmika v obeh delih)

// ---------------------------------------------------------------------------------------------------------------
// zakrpaj, polna, stena
// ---------------------------------------------------------------------------------------------------------------

// Zapre zanko s trikotniki. Okrogla zanka: pahljača do sredine (rahlo izbočena, »vrh«); sicer triangulacija v ravnini.
function zapriZanko(m, z, { vrh = 0, raven = false, svojRob = false } = {}) {
  const o = G.opisZanke(m, z);
  const E = raven ? G.robovi(m) : null;
  const obstaja = (a, b) => E.has(a < b ? a * 4294967296 + b : b * 4294967296 + a);
  let tri = null, p2 = null;
  if (z.length > 3 && (raven || !(o.okroglost > 0.6 && o.odmik < 0.35 * o.r))) {
    const rav = G.ravnina(z.map((e) => m.W[e.w]));
    p2 = z.map((e) => { const dd = v3.sub(m.W[e.w], rav.c); return [v3.dot(dd, rav.osi[0]), v3.dot(dd, rav.osi[1])]; });
    tri = G.trianguliraj(p2).tri;
    // raven pokrov ne sme narediti trikotnika brez ploščine ali roba, ki v mreži že obstaja (nemnogoteren rob)
    if (raven) {
      const L = z.length;
      const slab = tri.some((t) => {
        const a = m.W[z[t[0]].w], b = m.W[z[t[1]].w], c = m.W[z[t[2]].w];
        if (v3.len(v3.cross(v3.sub(b, a), v3.sub(c, a))) < 1e-12) return true;
        for (let k = 0; k < 3; k++) { const i = t[k], j = t[(k + 1) % 3]; if (Math.abs(i - j) !== 1 && Math.abs(i - j) !== L - 1 && obstaja(z[i].w, z[j].w)) return true; }
        return false;
      });
      if (slab) tri = null;
    }
  }
  if (z.length === 3) { m.F.push(z[1].r, z[0].r, z[2].r); return 1; }
  if (!tri) {
    const ven = v3.mul(o.n, -1);
    const c = G.dodajOglisce(m, v3.add(o.c, v3.mul(ven, vrh * o.r)), z.map((e) => [e.r, 1]), { NORMAL: ven });
    if (!svojRob) { for (const e of z) m.F.push(e.r2, e.r, c); return z.length; }
    // pokrov s svojimi oglišči na robu: normala med steno in osjo (z normalo stene je rob pokrova od spredaj bled)
    const nd = m.A.get("NORMAL")?.d;
    const rob = new Map();
    const naRobu = (r) => {
      if (!rob.has(r)) {
        const n = nd ? v3.norm(v3.add(v3.mul([nd[r * 3], nd[r * 3 + 1], nd[r * 3 + 2]], 0.6), ven)) : ven;
        rob.set(r, G.dodajOglisce(m, G.pol(m, r), [[r, 1]], { NORMAL: n }));
      }
      return rob.get(r);
    };
    for (const e of z) m.F.push(naRobu(e.r2), naRobu(e.r), c);
    return z.length;
  }
  const a = z[0].w, b = z[0].w2;
  let obrni = false;
  for (const t of tri) for (let k = 0; k < 3; k++) if (z[t[k]].w === a && z[t[(k + 1) % 3]].w === b) obrni = true;
  for (const t of tri) m.F.push(z[t[0]].r, z[t[obrni ? 2 : 1]].r, z[t[obrni ? 1 : 2]].r);
  return tri.length;
}

// »prost(c, ven, r)«: ali je konec (središče, smer navzven, polmer) prost. Kupolo dobi samo prost konec; konec, ki
// tiči v drugi žili, ostane raven (kupola bi tam pogledala skozi steno sosede ali naredila svetel obroč na stopnici).
export function polna(d, pokrov, prost = null) {
  const z = G.zanke(d.m);
  let st = 0, ravnih = 0;
  for (const zz of z) {
    let raven = pokrov === true || pokrov === "raven";
    if (!raven && prost) { const o = G.opisZanke(d.m, zz); if (!prost(o.c, v3.mul(o.n, -1), o.r)) { raven = true; ravnih++; } }
    st += zapriZanko(d.m, zz, raven ? { raven: true } : { vrh: 0.3, svojRob: pokrov === "kupola" });
  }
  if (z.length) { d.m.spremenjeno = true; G.zvari(d.m); }
  const zasitih = zasijRobove(d.m);
  return { koncev: z.length, trikotnikov: st, zasitih, ravnih };
}

// Ali je točka v kateri od drugih mrež (parnost žarka v treh smereh; že ena liha smer šteje za »znotraj«, ker
// napaka v to smer pomeni le raven pokrov kot doslej). Mreže: [{ m, mn, mx }] s škatlo.
const SMERI_KONCA = [[0.5377, 0.7151, 0.4463], [-0.6713, 0.2911, 0.6816], [0.3015, -0.8452, 0.4413]];
export function vDrugiMrezi(p, mreze) {
  for (const { m, mn, mx } of mreze) {
    if (p[0] < mn[0] || p[1] < mn[1] || p[2] < mn[2] || p[0] > mx[0] || p[1] > mx[1] || p[2] > mx[2]) continue;
    const vse = m.vsePloskve && m.vsePloskve.length === m.F.length / 3 ? m.vsePloskve : (m.vsePloskve = Array.from({ length: m.F.length / 3 }, (_, i) => i));
    for (const s of SMERI_KONCA) if (G.steviloZadetkov(m, p, s, vse) % 2) return true;
  }
  return false;
}

// Odprti robovi, ki niso zanka (nemnogoterna mreža, npr. »Cavernous sinus«): reža med dvema skoraj enakima
// ogliščema (nekaj µm narazen, zato se pri varjenju nista združili). Robno oglišče prestavimo na bližnje robno
// oglišče (do »tol«), trikotniki brez ploščine odpadejo; kar se pri tem sklene v zanko, se zapre. Vrne število
// združenih oglišč.
export function zasijRobove(m, tol = 6e-6) {
  let zdruzenih = 0;
  for (let krog = 0; krog < 3; krog++) {
    const rob = new Set();
    for (const [k, l] of G.robovi(m)) if (l.length === 1) { rob.add(Math.floor(k / 4294967296)); rob.add(k % 4294967296); }
    if (!rob.size) break;
    const ogl = [...rob].sort((a, b) => a - b);
    const cilj = new Map();
    for (let i = 0; i < ogl.length; i++) for (let j = i + 1; j < ogl.length; j++) {
      if (cilj.has(ogl[i]) || cilj.has(ogl[j]) || [...cilj.values()].includes(ogl[j])) continue;
      if (v3.dist(m.W[ogl[i]], m.W[ogl[j]]) <= tol) cilj.set(ogl[j], ogl[i]);
    }
    if (!cilj.size) break;
    // šiv ne sme narediti nemnogoternega roba (tri ploskve na robu): tedaj mreža ostane, kot je bila
    const nemnog = () => { let n = 0; for (const l of G.robovi(m).values()) if (l.length > 2) n++; return n; };
    const prej = { n: nemnog(), P: m.P.slice(), F: m.F.slice(), A: new Map([...m.A].map(([s, a]) => [s, { n: a.n, d: a.d.slice() }])) };
    const razveljavi = () => { m.P = prej.P; m.F = prej.F; m.A = prej.A; G.zvari(m); };
    for (let r = 0; r < m.zvar.length; r++) {
      const c = cilj.get(m.zvar[r]);
      if (c === undefined) continue;
      const p = m.W[c];
      m.P[r * 3] = p[0]; m.P[r * 3 + 1] = p[1]; m.P[r * 3 + 2] = p[2];
    }
    G.zvari(m);
    if (G.brezIzrojenih(m)) G.zvari(m);
    const z = G.zanke(m);
    for (const zz of z) zapriZanko(m, zz, { raven: true });
    if (z.length) G.zvari(m);
    if (nemnog() > prej.n) { razveljavi(); break; }
    zdruzenih += cilj.size;
    m.spremenjeno = true;
  }
  return zdruzenih;
}

export function zakrpaj(d, najObsegMm = Infinity) {
  let st = 0;
  for (let krog = 0; krog < 3; krog++) {
    const z = G.zanke(d.m).filter((zz) => G.opisZanke(d.m, zz).obseg <= najObsegMm * MM);
    if (!z.length) break;
    for (const zz of z) zapriZanko(d.m, zz);
    st += z.length;
    d.m.spremenjeno = true;
    G.zvari(d.m);
  }
  return st;
}

// Notranja stena v razdalji t in obroč na vsaki zanki. Senca notranje stene: COLOR_0.r pomnožen s »senca«.
// skrita: Set ključev položajev (kl) oglišč na koncih, ki jih ni videti (stik z drugim delom iste žile ali konec v
// sosednji žili): tam obroč uporabi oglišča sten (normala in senca stene), da skozi špranjo stika ali ob robu sosede
// ni videti drugače osenčenega ravnega obroča (pikčasta črta, bela črta). izpostavljena: tista skrita oglišča, ki v
// resnici niso v sosedi (konec ob drobni žili): obroč tam dobi svoje notranje oglišče z normalo zunanje stene.
export function stena(d, tMm, { senca = 1, skrita = null, izpostavljena = null } = {}) {
  const m = d.m;
  const z = G.zanke(m);
  if (!z.length) return null;
  const t = tMm * MM;
  const N = G.normaleZvarjenih(m);
  const smer = N.map((n, w) => (skupneNormale.get(kl(m.W[w])) || n).slice());
  // na koncih: odmik v ravnini konca (raven obroč)
  const zunaj = new Map(); // w → smer iz konca cevi
  for (const zz of z) {
    const o = G.opisZanke(m, zz);
    if (o.odmik > 0.2 * o.r) continue;
    for (const e of zz) {
      const n = smer[e.w];
      const p = v3.sub(n, v3.mul(o.n, v3.dot(n, o.n)));
      if (v3.len(p) > 0.3) smer[e.w] = v3.norm(p);
      zunaj.set(e.w, v3.mul(o.n, -1));
    }
  }
  // debelina po ogliščih: največ 30 % razdalje do nasprotne stene (ozke cevi in razcepi), a vsaj 40 % želene
  const deb = m.W.map((p, w) => {
    if (skupneNormale.has(kl(p))) return t; // stik: enako v obeh delih
    const zad = G.zarek(m, p, v3.mul(smer[w], -1), 1e-5, null, 1);
    return zad ? Math.max(0.4 * t, Math.min(t, 0.3 * zad.t)) : t;
  });
  // Odmik ne sme obrniti roba (ostra vdolbina, npr. aortni sinusi): rob e med ogliščema z normalama ni, nj se po
  // odmiku skrajša na e − t (ni − nj); debelino omejimo, da ostane vsaj 30 % dolžine, nato jo zgladimo po sosedih.
  {
    const sos = m.W.map(() => new Set());
    for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) { const a = m.zvar[m.F[f + k]], b = m.zvar[m.F[f + (k + 1) % 3]]; sos[a].add(b); sos[b].add(a); }
    for (let w = 0; w < deb.length; w++) {
      if (zunaj.has(w) || skupneNormale.has(kl(m.W[w]))) continue;
      for (const u of sos[w]) {
        const e = v3.sub(m.W[u], m.W[w]);
        const krc = v3.dot(e, v3.sub(smer[u], smer[w])); // > 0: rob se krajša
        if (krc > 1e-12) deb[w] = Math.max(0.15 * t, Math.min(deb[w], (0.7 * v3.dot(e, e)) / krc));
      }
    }
    for (let krog = 0; krog < 2; krog++) {
      const d0 = deb.slice();
      for (let w = 0; w < deb.length; w++) {
        if (zunaj.has(w) || !sos[w].size) continue;
        let sr = 0;
        for (const u of sos[w]) sr += d0[u];
        deb[w] = Math.min(d0[w], 0.5 * d0[w] + (0.5 * sr) / sos[w].size);
      }
    }
  }
  const n0 = m.P.length / 3;
  const T0 = m.F.length / 3;
  const barva = m.A.get("COLOR_0");
  const notr = new Array(n0);
  for (let i = 0; i < n0; i++) {
    const w = m.zvar[i];
    const p = v3.sub(G.pol(m, i), v3.mul(smer[w], deb[w]));
    const nrm = m.A.get("NORMAL");
    const attr = {};
    if (nrm) attr.NORMAL = [-nrm.d[i * 3], -nrm.d[i * 3 + 1], -nrm.d[i * 3 + 2]];
    if (barva) { attr.COLOR_0 = []; for (let c = 0; c < barva.n; c++) attr.COLOR_0.push(barva.d[i * barva.n + c] * (c === 0 ? senca : 1)); }
    const tg = m.A.get("TANGENT");
    if (tg) attr.TANGENT = [tg.d[i * 4], tg.d[i * 4 + 1], tg.d[i * 4 + 2], -tg.d[i * 4 + 3]];
    notr[i] = G.dodajOglisce(m, p, [[i, 1]], attr);
  }
  for (let f = 0; f < T0; f++) m.F.push(notr[m.F[f * 3]], notr[m.F[f * 3 + 2]], notr[m.F[f * 3 + 1]]);
  // obroči
  let obrocev = 0;
  for (const zz of z) {
    const rz = new Map(), rn = new Map();
    const ven = (w) => {
      if (zunaj.has(w)) return zunaj.get(w);
      return null;
    };
    // normala obroča: iz ploskev obroča (neravne zanke) ali ravnine konca
    const nObr = new Map();
    for (const e of zz) {
      const a = m.W[e.w], b = m.W[e.w2], ai = G.pol(m, notr[e.r]);
      const n = v3.cross(v3.sub(a, b), v3.sub(ai, b));
      for (const w of [e.w, e.w2]) { const s = nObr.get(w) || [0, 0, 0]; nObr.set(w, v3.add(s, n)); }
    }
    for (const e of zz) {
      if (rz.has(e.w)) continue;
      if (skrita && skrita.has(kl(m.W[e.w]))) {
        rz.set(e.w, e.r);
        rn.set(e.w, notr[e.r]);
        const nd = m.A.get("NORMAL")?.d;
        if (!nd || !izpostavljena || !izpostavljena.has(kl(m.W[e.w]))) continue;
        // izpostavljen del skritega obroča: notranje oglišče z normalo zunanje stene (z normalo notranje stene je črn);
        // del normale proti ploskvi obroča odpade (poševen konec), da je poravnajNormale ne obrne navznoter
        const g = v3.norm(nObr.get(e.w));
        const n0 = [nd[e.r * 3], nd[e.r * 3 + 1], nd[e.r * 3 + 2]];
        const n = v3.norm(v3.sub(n0, v3.mul(g, Math.min(0, v3.dot(n0, g)))));
        rn.set(e.w, G.dodajOglisce(m, G.pol(m, notr[e.r]), [[e.r, 1]], { NORMAL: n }));
        continue;
      }
      const n = ven(e.w) || v3.norm(nObr.get(e.w));
      rz.set(e.w, G.dodajOglisce(m, G.pol(m, e.r), [[e.r, 1]], { NORMAL: n }));
      rn.set(e.w, G.dodajOglisce(m, G.pol(m, notr[e.r]), [[e.r, 1]], { NORMAL: n }));
    }
    for (const e of zz) {
      const a = rz.get(e.w), b = rz.get(e.w2), ai = rn.get(e.w), bi = rn.get(e.w2);
      // Stik dveh delov iste žile: sosednji del ima isti obroč v nasprotni smeri. Diagonalo štirikotnika določi
      // položaj oglišč, ne smer zanke, da imata dela na stiku iste trikotnike (pregrada, ki jo pregledovalnik odstrani).
      const ka = kl(m.W[e.w]), kb = kl(m.W[e.w2]);
      if (skupneNormale.has(ka) && skupneNormale.has(kb) && vecji(m.W[e.w], m.W[e.w2])) m.F.push(b, a, bi, a, ai, bi);
      else m.F.push(b, a, ai, b, ai, bi);
    }
    obrocev++;
  }
  m.spremenjeno = true;
  G.zvari(m);
  // Del iz več cevi (razcepišče: veja se začne v svetlini glavne cevi): oglišča manjše cevi, ki ležijo v svetlini
  // večje, potisnemo v sredino njene stene, da se začetek veje ne vidi v svetlini (v prerezu) in ostane zaprt.
  const { komp, st: stKomp } = G.komponente(m);
  if (stKomp > 1) {
    const vel = new Array(stKomp).fill(0);
    for (let f = 0; f < komp.length; f++) vel[komp[f]] += v3.len(G.normalaPloskve(m, f));
    const red = vel.map((_, i) => i).sort((a, b) => vel[b] - vel[a]);
    let skritih = 0;
    for (let bi = 1; bi < red.length; bi++) for (let ai = 0; ai < bi; ai++) {
      const A = red[ai], B = red[bi];
      const notrA = [];
      for (let f = T0; f < 2 * T0; f++) if (komp[f] === A) notrA.push(f);
      const oglB = new Set();
      for (let f = 0; f < komp.length; f++) if (komp[f] === B) for (let k = 0; k < 3; k++) oglB.add(m.zvar[m.F[f * 3 + k]]);
      const nov = new Map();
      for (const w of oglB) {
        const p = m.W[w];
        let bd = Infinity, bq = null, bn = null;
        for (const f of notrA) {
          const a = G.pol(m, m.F[f * 3]), b = G.pol(m, m.F[f * 3 + 1]), c = G.pol(m, m.F[f * 3 + 2]);
          const q = G.najblizjaNaTrikotniku(p, a, b, c);
          const dd = v3.dist(p, q);
          if (dd < bd) { bd = dd; bq = q; bn = v3.norm(v3.cross(v3.sub(b, a), v3.sub(c, a))); }
        }
        if (bq && v3.dot(v3.sub(p, bq), bn) > 1e-7) nov.set(w, v3.sub(bq, v3.mul(bn, 0.5 * t)));
      }
      if (!nov.size) continue;
      for (let r = 0; r < m.zvar.length; r++) { const q = nov.get(m.zvar[r]); if (q) { m.P[r * 3] = q[0]; m.P[r * 3 + 1] = q[1]; m.P[r * 3 + 2] = q[2]; } }
      skritih += nov.size;
      G.zvari(m);
    }
    if (skritih) log(`   ${d.ime}: ${skritih} oglišč začetka veje skritih v steno glavne cevi`);
  }
  G.poravnajNormale(m);
  let V = 0;
  for (let f = 0; f < m.F.length; f += 3) V += v3.dot(G.pol(m, m.F[f]), v3.cross(G.pol(m, m.F[f + 1]), G.pol(m, m.F[f + 2])));
  if (V <= 0) throw new Error(`${d.ime}: stena je obrnjena navznoter (prostornina ${V})`);
  return { obrocev, najmanj: Math.min(...deb) };
}

// Glajenje šivov: ob stiku dveh delov iste žile (drug polmer in smer cevi na vsaki strani: rob in stopnica v
// odsevu) in ob dograjeni steni (m.jedro iz dopolni) oglišča zgladimo po Taubinu (λ/μ: brez krčenja cevi). Deli se
// gladijo skupaj (oglišča stika so ista v obeh delih), učinek zamre z razdaljo od jedra; drugi odprti konci ostanejo
// na mestu. Nato vse normale zglajenih delov na novo iz geometrije. Vrne število premaknjenih oglišč.
function zgladiOkoli(deli, { krogov = 24, lambda = 0.5, mu = -0.52 } = {}) {
  const jedro = [];
  const naKoncih = new Map(); // položaj oglišča na odprtem koncu → število delov, ki ga imajo na koncu
  const zanke = deli.map((d) => G.zanke(d.m));
  deli.forEach((d, i) => { for (const k of new Set(zanke[i].flat().map((e) => kl(d.m.W[e.w])))) naKoncih.set(k, (naKoncih.get(k) || 0) + 1); });
  const stik = (p) => naKoncih.get(kl(p)) > 1;
  deli.forEach((d, i) => {
    if (d.m.jedro) jedro.push(...d.m.jedro);
    for (const z of zanke[i]) {
      const o = G.opisZanke(d.m, z);
      for (const e of z) if (stik(d.m.W[e.w])) jedro.push({ p: d.m.W[e.w], D: 1.2 * o.r });
    }
  });
  if (!jedro.length) return 0;
  // skupni graf zvarjenih oglišč vseh delov
  const id = new Map(), P = [], sos = [], pri = [];
  for (const d of deli) {
    const m = d.m;
    d.g = m.W.map((p) => {
      const k = kl(p);
      let g = id.get(k);
      if (g === undefined) { g = P.length; id.set(k, g); P.push(p.slice()); sos.push(new Set()); pri.push(false); }
      return g;
    });
    for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) {
      const a = d.g[m.zvar[m.F[f + k]]], b = d.g[m.zvar[m.F[f + (k + 1) % 3]]];
      if (a !== b) { sos[a].add(b); sos[b].add(a); }
    }
    // prost konec in stik treh delov (razcepišče: veji se začneta v istem obroču in se prekrivata) ostaneta na mestu
    for (const z of G.zanke(m)) for (const e of z) if (!stik(m.W[e.w]) || naKoncih.get(kl(m.W[e.w])) > 2) pri[d.g[e.w]] = true;
  }
  const utez = P.map((p, g) => {
    if (pri[g]) return 0;
    let u = 0;
    for (const j of jedro) { const t = 1 - v3.dist(p, j.p) / j.D; if (t > u) u = t; }
    return u <= 0 ? 0 : u * u * (3 - 2 * u);
  });
  const giblj = utez.map((u, g) => (u > 0 ? g : -1)).filter((g) => g >= 0);
  if (!giblj.length) return 0;
  const korak = (k) => {
    const nov = giblj.map((g) => {
      const c = [0, 0, 0];
      for (const h of sos[g]) { c[0] += P[h][0]; c[1] += P[h][1]; c[2] += P[h][2]; }
      const n = sos[g].size || 1;
      return [P[g][0] + k * utez[g] * (c[0] / n - P[g][0]), P[g][1] + k * utez[g] * (c[1] / n - P[g][1]), P[g][2] + k * utez[g] * (c[2] / n - P[g][2])];
    });
    giblj.forEach((g, i) => { P[g] = nov[i]; });
  };
  for (let i = 0; i < krogov; i++) { korak(lambda); korak(mu); }
  for (const d of deli) {
    const m = d.m;
    let premik = false;
    for (let r = 0; r < m.zvar.length; r++) {
      const g = d.g[m.zvar[r]];
      if (utez[g] <= 0) continue;
      m.P[r * 3] = P[g][0]; m.P[r * 3 + 1] = P[g][1]; m.P[r * 3 + 2] = P[g][2];
      premik = true;
    }
    delete d.g;
    if (!premik) continue;
    G.zvari(m);
    const N = G.normaleZvarjenih(m);
    for (let r = 0; r < m.zvar.length; r++) G.nastaviAtribut(m, "NORMAL", r, N[m.zvar[r]]);
    m.spremenjeno = true;
  }
  log(`   glajenje šivov: ${giblj.length} oglišč`);
  return giblj.length;
}

// Skriti konci: oglišča odprtih koncev, ki ležijo na stiku z drugim delom iste žile (stiki) ali v notranjosti sosednje
// žile (konec veje v glavni cevi, votla vena ↔ brahiocefalni veni). Soseda je cev z odprtimi konci, zato jo za štetje
// presečišč žarka zapremo s pahljačo čez vsak konec. Rezultat: d.skrita (Set ključev položajev) za steno().
function skritiKonci(deli, sosede = []) {
  const telesa = [...deli, ...sosede].map((d) => {
    const m = d.m;
    const tri = [];
    for (let f = 0; f < m.F.length; f++) tri.push(...G.pol(m, m.F[f]));
    for (const z of G.zanke(m)) {
      const c = G.opisZanke(m, z).c;
      for (const e of z) tri.push(...m.W[e.w], ...m.W[e.w2], ...c);
    }
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < tri.length; i++) { const c = i % 3; if (tri[i] < mn[c]) mn[c] = tri[i]; if (tri[i] > mx[c]) mx[c] = tri[i]; }
    return { d, tri, mn, mx };
  });
  const smeri = [[0.5377, 0.7151, 0.4463], [-0.6713, 0.2911, 0.6816], [0.3015, -0.8452, 0.4413]];
  const zadetkov = (tri, o, s) => {
    let st = 0;
    for (let k = 0; k < tri.length; k += 9) {
      const e1x = tri[k + 3] - tri[k], e1y = tri[k + 4] - tri[k + 1], e1z = tri[k + 5] - tri[k + 2];
      const e2x = tri[k + 6] - tri[k], e2y = tri[k + 7] - tri[k + 1], e2z = tri[k + 8] - tri[k + 2];
      const px = s[1] * e2z - s[2] * e2y, py = s[2] * e2x - s[0] * e2z, pz = s[0] * e2y - s[1] * e2x;
      const det = e1x * px + e1y * py + e1z * pz;
      if (Math.abs(det) < 1e-24) continue;
      const tx = o[0] - tri[k], ty = o[1] - tri[k + 1], tz = o[2] - tri[k + 2];
      const u = (tx * px + ty * py + tz * pz) / det;
      if (u < 0 || u > 1) continue;
      const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
      const w = (s[0] * qx + s[1] * qy + s[2] * qz) / det;
      if (w < 0 || u + w > 1) continue;
      if ((e2x * qx + e2y * qy + e2z * qz) / det > 0) st++;
    }
    return st;
  };
  for (const t of telesa.slice(0, deli.length)) {
    const { d } = t;
    d.skrita = new Set();
    d.izpostavljena = new Set(); // skrita samo po pravilu »nadaljevanje«: v resnici vidna ob robu drobne žile
    let vSosedi = 0;
    for (const z of G.zanke(d.m)) {
      let nadaljevanje = false; // konec, ki se nadaljuje v drobno žilo (brahiocefalna vena → podključnična in jugularna)
      for (const e of z) {
        const p = d.m.W[e.w];
        const k = kl(p);
        if (skupneNormale.has(k)) { d.skrita.add(k); continue; }
        for (const o of telesa) {
          if (o === t || [0, 1, 2].some((c) => p[c] < o.mn[c] || p[c] > o.mx[c])) continue;
          if (smeri.filter((s) => zadetkov(o.tri, p, s) % 2 === 1).length >= 2) {
            d.skrita.add(k); vSosedi++;
            if (sosede.includes(o.d)) nadaljevanje = true;
            break;
          }
        }
      }
      // tak konec ni nikoli viden v celoti: ves obroč brez ravnega roba, sicer se ob robu drobne žile vidi bel srp
      if (nadaljevanje) for (const e of z) { const k = kl(d.m.W[e.w]); if (!d.skrita.has(k)) { d.skrita.add(k); d.izpostavljena.add(k); vSosedi++; } }
    }
    if (vSosedi) log(`   ${d.ime}: ${vSosedi} oglišč koncev v sosednji žili (obroč brez ravnega roba)`);
  }
}

// Senca na stiku delov: oglišča na istem mestu z isto smerjo normale v različnih delih (stik dveh delov ene žile)
// dobijo povprečno senco, sicer se ob stiku vidi stopnica v svetlosti.
function zvariSenco(deli) {
  const sk = new Map();
  for (const d of deli) {
    const m = d.m;
    if (!m.A.get("COLOR_0") || !m.A.get("NORMAL")) continue;
    for (let i = 0; i < m.zvar.length; i++) {
      const k = kl(G.pol(m, i));
      let l = sk.get(k);
      if (!l) sk.set(k, (l = []));
      l.push({ d, i });
    }
  }
  for (const l of sk.values()) {
    if (l.length < 2 || l.every((x) => x.d === l[0].d)) continue;
    const upor = new Set();
    for (let a = 0; a < l.length; a++) {
      if (upor.has(a)) continue;
      const na = l[a].d.m.A.get("NORMAL").d, ia = l[a].i * 3;
      const skupina = [a];
      for (let b = a + 1; b < l.length; b++) {
        if (upor.has(b)) continue;
        const nb = l[b].d.m.A.get("NORMAL").d, ib = l[b].i * 3;
        if (na[ia] * nb[ib] + na[ia + 1] * nb[ib + 1] + na[ia + 2] * nb[ib + 2] > 0.8) { skupina.push(b); upor.add(b); }
      }
      if (skupina.length < 2) continue;
      const st = Math.min(2, l[a].d.m.A.get("COLOR_0").n);
      for (let c = 0; c < st; c++) {
        let v = 0;
        for (const x of skupina) { const bb = l[x].d.m.A.get("COLOR_0"); v += bb.d[l[x].i * bb.n + c]; }
        v /= skupina.length;
        for (const x of skupina) { const bb = l[x].d.m.A.get("COLOR_0"); bb.d[l[x].i * bb.n + c] = v; }
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Datoteka
// ---------------------------------------------------------------------------------------------------------------

// Vrstni red trikotnikov in oglišč za predpomnilnik oglišč (meshoptimizer); neuporabljena oglišča odpadejo.
function preuredi(m) {
  const idx = Uint32Array.from(m.F);
  const [remap, st] = MeshoptEncoder.reorderMesh(idx, true, true);
  const n = m.P.length / 3;
  const P = new Array(st * 3);
  const A = new Map([...m.A].map(([sem, a]) => [sem, { n: a.n, d: new Array(st * a.n) }]));
  for (let i = 0; i < n; i++) {
    const j = remap[i];
    if (j === 0xffffffff) continue;
    for (let c = 0; c < 3; c++) P[j * 3 + c] = m.P[i * 3 + c];
    for (const [sem, a] of m.A) for (let c = 0; c < a.n; c++) A.get(sem).d[j * a.n + c] = a.d[i * a.n + c];
  }
  m.P = P; m.A = A; m.F = Array.from(idx); // reorderMesh indekse že prepiše na nova oglišča
  G.zvari(m);
}

// Enaki dostopniki (isti tip in vsebina) se združijo v enega, kot pri »gltf-transform dedup« (zrcalni pari v telesu
// si delijo indekse in barve; brez tega datoteka po prepisu zraste).
function zdruziEnake(doc) {
  const prvi = new Map();
  const kljuc = (a) => {
    const arr = a.getArray();
    return `${a.getType()}|${arr.constructor.name}|${a.getNormalized()}|${arr.length}|${createHash("sha1").update(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength)).digest("base64")}`;
  };
  const kanon = (a, vloga) => {
    const k = vloga + kljuc(a);
    if (!prvi.has(k)) prvi.set(k, a);
    return prvi.get(k);
  };
  for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
    const ind = prim.getIndices();
    if (ind) prim.setIndices(kanon(ind, "i"));
    for (const sem of prim.listSemantics()) prim.setAttribute(sem, kanon(prim.getAttribute(sem), "a"));
  }
}

let io = null;
async function bralnik() {
  if (io) return io;
  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;
  io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder, "meshopt.encoder": MeshoptEncoder });
  return io;
}

export async function popravi(vhod, izhod, nacrt, { suho = false } = {}) {
  const doc = await (await bralnik()).read(vhod);
  const deli = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const prims = mesh.listPrimitives().filter((p) => p.getMode() === 4 && p.getAttribute("POSITION"));
    if (prims.length !== 1) continue; // več primitivov na del: ne obravnavamo (v današnjih GLB jih ni)
    const extras = node.getExtras() || {};
    if (nacrt.izberi && !nacrt.izberi(node.getName(), extras)) continue;
    deli.push({ ime: extras.zid || node.getName(), node, prim: prims[0], m: null, vsi: true });
  }
  const del = (ime) => {
    const d = deli.find((x) => x.ime === ime);
    if (d && !d.m) d.m = G.preberi(d.node, d.prim);
    return d;
  };
  const nalozi = (d) => { if (!d.m) d.m = G.preberi(d.node, d.prim); return d; };
  const izvirne = new Map(); // še neobdelani deli (samo za preskus, ali konec tiči v drugi žili)
  const skatla = (m) => {
    if (m.skatla && !m.spremenjeno) return m.skatla;
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < m.P.length; i++) { const v = m.P[i], c = i % 3; if (v < mn[c]) mn[c] = v; if (v > mx[c]) mx[c] = v; }
    return (m.skatla = { m, mn, mx });
  };
  const odprt = (d) => G.zanke(d.m).length > 0;
  const T0 = new Map();
  const stej = (d) => { if (!T0.has(d)) T0.set(d, d.m.F.length / 3); };
  loki.clear();

  for (const sk of nacrt.dopolni || []) {
    const s = sk.map(del).filter(Boolean);
    if (!s.length) continue;
    s.forEach(stej);
    for (const d of s) { G.usmeri(d.m); G.poravnajNormale(d.m); }
    dopolni(s);
    for (const d of s) G.zvari(d.m);
  }
  // deli z debelo steno: zgostitev oglatih cevi, stiki, skriti konci
  {
    const s = deli.filter((d) => (nacrt.stena || []).some(([rx]) => rx.test(d.ime)));
    for (const d of s) { nalozi(d); stej(d); G.usmeri(d.m); G.poravnajNormale(d.m); }
    const tol = nacrt.zgosti ? nacrt.zgosti(vhod) : 0;
    if (tol) for (const d of s.filter(odprt)) {
      const dT = G.zgosti(d.m, tol * MM);
      if (dT) log(`   ${d.ime}: zgoščena cev, +${dT} trikotnikov (konci ${G.zanke(d.m).map((z) => z.length).join(", ")} oglišč)`);
    }
    // stik treh delov (votla vena + brahiocefalni veni): ponavljamo, dokler nimajo vsi obroči istih oglišč
    const vsiStiki = () => { for (let i = 0; i < 4; i++) { skupneNormale.clear(); if (!stiki(s.filter(odprt))) break; } };
    vsiStiki();
    if (zaokroziRazcepisca(s.filter(odprt))) vsiStiki();
    // glajenje šivov (stik delov, dograjena stena), nato skupne normale stikov na novo
    if (zgladiOkoli(s.filter(odprt))) vsiStiki();
    // sosede za skrite konce: tudi drobne žile (podključnična in jugularna vena ob koncu brahiocefalne vene)
    const drobne = deli.filter((d) => !s.includes(d) && nacrt.polna && nacrt.polna.test(d.ime));
    for (const d of drobne) { nalozi(d); stej(d); }
    skritiKonci(s.filter(odprt), drobne);
  }
  for (const d of deli) {
    const st = (nacrt.stena || []).find(([rx]) => rx.test(d.ime));
    const jePolna = nacrt.polna && nacrt.polna.test(d.ime);
    const krpa = (nacrt.zakrpaj || []).find(([rx]) => rx.test(d.ime));
    if (!st && !jePolna && !krpa) continue;
    nalozi(d);
    stej(d);
    const iz = G.brezIzrojenih(d.m);
    const opombe = [];
    if (iz) opombe.push(`odstranjenih izrojenih ${iz}`);
    // krpanje pred usmeritvijo komponent: zunanja lupina mora biti zaprta, da usmeritev v njej prepozna svetlino
    let obrnjenePrej = 0;
    if (krpa) {
      obrnjenePrej = G.usmeri(d.m, { samoNavitje: true }).obrnjene;
      const k = zakrpaj(d, krpa[1]);
      if (k) opombe.push(`zakrpanih lukenj ${k}`);
    }
    const u = G.usmeri(d.m);
    u.obrnjene += obrnjenePrej;
    G.poravnajNormale(d.m);
    if (u.obrnjene) opombe.push(`obrnjenih ploskev ${u.obrnjene}`);
    if (u.navznoter) opombe.push(`kosov obrnjenih navzven ${u.navznoter}`);
    if (st && odprt(d)) {
      const r = stena(d, st[1], { skrita: d.skrita, izpostavljena: d.izpostavljena });
      if (r) opombe.push(`stena ${st[1]} mm (najmanj ${mm(r.najmanj)} mm), obročev ${r.obrocev}`);
    } else if (jePolna && (odprt(d) || [...G.robovi(d.m).values()].some((l) => l.length === 1))) {
      const drugi = nacrt.pokrov === "kupola" ? deli.filter((x) => x !== d).map((x) => skatla(x.m || (izvirne.get(x) || izvirne.set(x, G.preberi(x.node, x.prim)).get(x)))) : null;
      const r = polna(d, nacrt.pokrov, drugi && ((c, ven, rr) => !vDrugiMrezi(v3.add(c, v3.mul(ven, 0.3 * rr)), drugi) && !vDrugiMrezi(v3.add(c, v3.mul(ven, 0.05 * rr)), drugi)));
      opombe.push(`zaprtih koncev ${r.koncev}${r.ravnih ? ` (ravnih, ker tičijo v drugi žili: ${r.ravnih})` : ""}${r.zasitih ? `, zašitih rež ${r.zasitih}` : ""}`);
    }
    if (!odprt(d)) { const u2 = G.usmeri(d.m); if (u2.navznoter || u2.obrnjene) G.poravnajNormale(d.m); } // zaprto: predznak prostornine
    if (opombe.length) log(`   ${d.ime}: ${opombe.join(", ")}`);
  }
  // Deli, ki se stikajo (ista oglišča na stiku): skupna mreža kvantizacije in oznaka »stik« v extras vozlišča;
  // pregledovalnik organov (organ.js) pri takih delih odstrani dvojne trikotnike pregrade na stiku.
  if (nacrt.stikiSkupaj) {
    const s = deli.filter((d) => d.m && d.m.spremenjeno && (nacrt.stena || []).some(([rx]) => rx.test(d.ime)));
    const sk = s.map((_, i) => i);
    const najdi = (i) => { while (sk[i] !== i) i = sk[i] = sk[sk[i]]; return i; };
    const prvi = new Map();
    s.forEach((d, i) => {
      for (const k of new Set(d.m.W.map(kl))) {
        if (!skupneNormale.has(k)) continue;
        if (prvi.has(k)) sk[najdi(i)] = najdi(prvi.get(k)); else prvi.set(k, i);
      }
    });
    const skupine = new Map();
    s.forEach((d, i) => { const r = najdi(i); if (!skupine.has(r)) skupine.set(r, []); skupine.get(r).push(d); });
    for (const l of skupine.values()) {
      if (l.length < 2) continue;
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (const d of l) for (let i = 0; i < d.m.P.length; i++) { const c = i % 3, v = d.m.P[i]; if (v < mn[c]) mn[c] = v; if (v > mx[c]) mx[c] = v; }
      // premik in merilo zaokrožena na float32 (tako ju bere pregledovalnik), z nekaj rezerve za zaokrožitev
      const mreza = { c: mn.map((v, c) => Math.fround((v + mx[c]) / 2)), h: Math.fround(Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2 * 1.0001) };
      for (const d of l) { d.m.mreza = mreza; if (!suho) d.node.setExtras({ ...(d.node.getExtras() || {}), stik: 1 }); }
      log(`   skupna mreža oglišč (korak ${(mreza.h / 32767 * 1e6).toFixed(1)} µm): ${l.map((d) => d.ime).join(", ")}`);
    }
  }
  // senca okolice (COLOR_0) za spremenjene dele: ovire so vsi deli modela v končni obliki
  const spremenjeni = deli.filter((d) => d.m && d.m.spremenjeno);
  for (const d of spremenjeni) G.poravnajNormale(d.m);
  if (spremenjeni.length && nacrt.senca) {
    let st = 0;
    for (const d of deli) { if (!d.m) d.m = G.preberi(d.node, d.prim); st += d.m.F.length / 3; }
    const tri = new Float64Array(st * 9);
    let k = 0;
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (const d of deli) for (let f = 0; f < d.m.F.length; f++) for (let c = 0; c < 3; c++) { const v = d.m.P[d.m.F[f] * 3 + c]; tri[k++] = v; if (v < mn[c]) mn[c] = v; if (v > mx[c]) mx[c] = v; }
    const velikost = nacrt.velikost || Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
    const bvh = new G.BVH(tri);
    for (const d of spremenjeni) G.zapeciSenco(d.m, bvh, velikost, { odprtost: !!nacrt.odprtost });
    zvariSenco(spremenjeni);
  }
  const meshopt = doc.getRoot().listExtensionsUsed().some((e) => e.extensionName === "EXT_meshopt_compression");
  let sprem = 0, dT = 0;
  for (const d of deli) {
    if (!d.m || !d.m.spremenjeno) continue;
    if (meshopt) preuredi(d.m); // vrstni red za boljše stiskanje, kot gltf-transform meshopt
    sprem++;
    dT += d.m.F.length / 3 - T0.get(d);
    if (!suho) G.zapisi(doc, d.node, d.prim, d.m);
  }
  if (!suho && sprem) {
    zdruziEnake(doc);
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((p) => p.propertyType === "Root")) acc.dispose();
    await (await bralnik()).write(izhod, doc);
  } else if (!suho && path.resolve(vhod) !== path.resolve(izhod)) {
    fs.copyFileSync(vhod, izhod); // nič za popraviti: izhod je nespremenjena kopija vhoda
    log(`   brez sprememb: ${izhod} je kopija vhoda`);
  }
  return { delov: sprem, trikotnikov: dT };
}

async function glavni() {
  const arg = process.argv.slice(2);
  const zast = (ime) => { const i = arg.indexOf(ime); return i >= 0 ? arg[i + 1] : null; };
  const suho = arg.includes("--suho");
  const filtri = arg.filter((a, i) => !a.startsWith("--") && !["--vhod", "--izhod", "--nacrt"].includes(arg[i - 1]));
  if (zast("--vhod")) {
    const nacrt = NACRT[zast("--nacrt")];
    if (!nacrt || !zast("--izhod")) { console.error("Uporaba: --vhod a.glb --izhod b.glb --nacrt <" + Object.keys(NACRT).join("|") + ">"); process.exit(1); }
    log(zast("--vhod"));
    const r = await popravi(zast("--vhod"), zast("--izhod"), nacrt, { suho });
    log(`   spremenjenih delov ${r.delov}, trikotnikov ${r.trikotnikov >= 0 ? "+" : ""}${r.trikotnikov}`);
    return;
  }
  for (const [ime, nacrt] of Object.entries(NACRT)) for (const rel of nacrt.datoteke) {
    if (filtri.length && !filtri.some((f) => rel.includes(f) || ime === f)) continue;
    const pot = path.join(MODELI, rel);
    const prej = fs.statSync(pot).size;
    log(rel);
    const r = await popravi(pot, pot, nacrt, { suho });
    const potem = fs.statSync(pot).size;
    log(`   spremenjenih delov ${r.delov}, trikotnikov ${r.trikotnikov >= 0 ? "+" : ""}${r.trikotnikov}, velikost ${(prej / 1048576).toFixed(2)} → ${(potem / 1048576).toFixed(2)} MB`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();
