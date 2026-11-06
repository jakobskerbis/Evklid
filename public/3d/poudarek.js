// Poudarek izbranega dela (j, 6. 11.: »Pljučne vene« v seznamu, a ni vedel, kje so): izbrani del ostane v polni
// motnosti z rahlim sijem ob robu v barvi svoje pike in se nariše nad ostalimi; vsi ostali deli postanejo prosojni
// (~0,16), brez pisanja v globino in skoraj sivi, da obliko modela še slutiš. Prehod je mehak (~0,35 s, brez animacije
// pri zmanjšanem gibanju). Uporablja ga pregledovalnik.js (organi, celice, telesa …); atlas ima isti videz v tkiva.js.
//
// Materiali: za vsak izvirni material modela največ dve kopiji (»duh« za ostale, »spredaj« za izbrani del), narejeni ob
// prvi izbiri in shranjene do zaprtja modela (pocisti). Preklop med deli in ponovne izbire ne klonirajo in ne prevajajo
// senčilnikov znova (telefon). Ob preklicu dobijo mreže spet izvirnike; kopije izvirnikov, ki jih model ne uporablja več
// (nov nabor ob preklopu molekule ...), se sprostijo ob naslednji izbiri.

export const DUH_ALFA = 0.16; // motnost ostalih delov
export const DUH_SIVO = 0.75; // delež razbarvanja ostalih delov
export const TRAJANJE = 0.35; // s, mehki prehod
export const VRSTNI_RED = 1000; // izbrani del v vrsti prosojnih za vsemi duhovi (obris je še za njim)

const ZAMIK = 1e-4;

// Vse, kar lahko prebarvamo z vstavkom v senčilnik: vgrajeni materiali (ShaderMaterial ostane, kakršen je).
const vgrajen = (m) => m && !m.isShaderMaterial && !m.isRawShaderMaterial;
const zRobom = (m) => m.isMeshStandardMaterial || m.isMeshPhongMaterial;

/** Ali je škatla povsem v odrezanem delu prereza (clippingPlanes: obdrži n·p + d ≥ 0; presek: odreže le presek). */
export function povsemOdrezan(THREE, box, ravnine, presek = false) {
  if (!ravnine?.length || box.isEmpty()) return false;
  const v = new THREE.Vector3();
  const vsiZunaj = (p) => {
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
      if (p.distanceToPoint(v) >= 0) return false;
    }
    return true;
  };
  // brez preseka: odrezano je vse za katero koli ravnino; s presekom le, kar je za vsemi (npr. četrtina)
  if (presek) {
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
      if (ravnine.some((p) => p.distanceToPoint(v) >= 0)) return false;
    }
    return true;
  }
  return ravnine.some(vsiZunaj);
}

/** Smeri, s katerih lahko pogledamo izbrani del: osi in diagonale (enotski vektorji). */
export function kandidatiSmeri(THREE, { pokoncno = false } = {}) {
  const out = [];
  if (pokoncno) {
    for (let i = 0; i < 8; i++) out.push(new THREE.Vector3(Math.sin((i * Math.PI) / 4), 0.25, Math.cos((i * Math.PI) / 4)).normalize());
    return out;
  }
  for (const v of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) out.push(new THREE.Vector3(...v));
  for (const x of [1, -1]) for (const y of [1, -1]) for (const z of [1, -1]) out.push(new THREE.Vector3(x, y, z).normalize());
  return out;
}

/**
 * Smer pogleda, s katere je izbrani del najbolj viden: za vsako smer (trenutna je prva) prešteje ovire na poti od delov
 * izbranega dela proti kameri (`ovire(točka, smer)` vrne utež ovir), doda majhno kazen za velik zasuk in za pogled od
 * zgoraj ali spodaj. Ob enakih ovirah ostane trenutna smer. `rok` (ms) omeji čas na počasnih telefonih.
 */
export function najboljsaSmer(THREE, { tocke, trenutna, kandidati, ovire, rok = 60, zdaj = () => performance.now() }) {
  const cur = trenutna.clone().normalize();
  const t0 = zdaj();
  let naj = cur, najOcena = Infinity;
  for (const k of [cur, ...kandidati]) {
    const s = k.clone().normalize();
    let n = 0;
    for (const p of tocke) n += ovire(p, s);
    const ocena = n / Math.max(1, tocke.length) + 0.5 * (1 - s.dot(cur)) + 0.3 * s.y * s.y;
    if (ocena < najOcena - 1e-9) (najOcena = ocena), (naj = s);
    if (zdaj() - t0 > rok) break;
  }
  return naj;
}

/** Ovire z žarki: število ploskev drugih mrež med točko in kamero (prosojne mreže štejejo manj). */
export function oviraZarki(THREE, mreze) {
  const rc = new THREE.Raycaster();
  const o = new THREE.Vector3();
  return (p, s) => {
    rc.set(o.copy(p).addScaledVector(s, ZAMIK), s);
    let n = 0;
    for (const h of rc.intersectObjects(mreze, false)) {
      const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
      n += m?.transparent ? Math.min(1, (m.opacity ?? 1) * 1.5) * 0.5 : 1;
      if (n > 12) break;
    }
    return n;
  };
}

export function ustvariPoudarek(THREE) {
  const u = {
    alfa: { value: 1 },
    sivo: { value: 0 },
    rob: { value: 0 },
    robBarva: { value: new THREE.Color("#6E9BFF") },
  };
  const kopije = new Map(); // izvirni material → { duh, spredaj }
  const zapisi = new Map(); // objekt → { izv: material ali seznam, ro: renderOrder }
  let p = 0; // 0 = brez poudarka, 1 = poln poudarek
  let cilj = 0;

  const nastaviUniforme = () => {
    u.alfa.value = 1 - (1 - DUH_ALFA) * p;
    u.sivo.value = DUH_SIVO * p;
    u.rob.value = 0.9 * p;
  };

  function vstavi(c, izv, vrsta) {
    const prej = izv.onBeforeCompile;
    let kljuc = "";
    try {
      kljuc = String(izv.customProgramCacheKey());
    } catch {}
    c.onBeforeCompile = (sh, r) => {
      prej.call(izv, sh, r);
      const f = sh.fragmentShader;
      if (!f.includes("#include <common>") || !f.includes("#include <opaque_fragment>")) return;
      const duh = vrsta === "duh";
      const rob = !duh && zRobom(izv);
      if (!duh && !rob) return;
      if (duh) Object.assign(sh.uniforms, { uK3Alfa: u.alfa, uK3Sivo: u.sivo });
      else Object.assign(sh.uniforms, { uK3Rob: u.rob, uK3RobBarva: u.robBarva });
      const dekl = duh ? "uniform float uK3Alfa;\nuniform float uK3Sivo;" : "uniform float uK3Rob;\nuniform vec3 uK3RobBarva;";
      const koda = duh
        ? `outgoingLight = mix( outgoingLight, vec3( dot( outgoingLight, vec3( 0.2126, 0.7152, 0.0722 ) ) ), uK3Sivo );
        diffuseColor.a *= uK3Alfa;`
        : `outgoingLight += uK3RobBarva * pow( 1.0 - abs( dot( normalize( normal ), normalize( vViewPosition ) ) ), 2.2 ) * uK3Rob;`;
      sh.fragmentShader = f.replace("#include <common>", `#include <common>\n${dekl}`).replace("#include <opaque_fragment>", `${koda}\n#include <opaque_fragment>`);
    };
    c.customProgramCacheKey = () => `${kljuc}|k3-${vrsta}`;
  }

  function kopija(izv, vrsta) {
    if (!vgrajen(izv)) return izv;
    let k = kopije.get(izv);
    if (!k) kopije.set(izv, (k = { duh: null, spredaj: null }));
    if (k[vrsta]) return k[vrsta];
    const c = izv.clone();
    c.clippingPlanes = izv.clippingPlanes; // isti seznam: prerez, ki ga model premika, velja tudi za kopijo
    c.userData = { ...c.userData, k3Izvirnik: izv };
    vstavi(c, izv, vrsta);
    c.transparent = true; // v vrsto prosojnih: izbrani del za duhovi, duhovi brez globine
    if (vrsta === "duh") {
      c.depthWrite = false;
      if (c.transmission) c.transmission = 0;
    } else {
      c.depthWrite = izv.depthWrite;
    }
    k[vrsta] = c;
    return c;
  }
  const izvirnik = (m) => m?.userData?.k3Izvirnik || m;

  /**
   * Prebarva model: `izbrane` (Set objektov izbranega dela) dobijo kopijo »spredaj«, vse ostale mreže, črte, točke in
   * napisi kopijo »duh«. `odrezan`: izbrani del je povsem v odrezanem delu prereza, zato zanj prerez ne velja.
   */
  function uporabi(koren, izbrane, { barva = "#6E9BFF", odrezan = false, gibanje = true } = {}) {
    u.robBarva.value.set(barva);
    const vidni = new Set();
    koren.traverse((o) => {
      if (o.userData?.k3Sij || !(o.isMesh || o.isLine || o.isPoints || o.isSprite) || !o.material) return;
      const z = zapisi.get(o);
      // model je material medtem zamenjal sam: nov izvirnik
      const izv = z && sedanjiIzvirnik(o, z) ? z.izv : o.material;
      const ro = z ? z.ro : o.renderOrder;
      const vrsta = izbrane.has(o) ? "spredaj" : "duh";
      const zamenjaj = (m) => {
        const x = izvirnik(m);
        vidni.add(x);
        const c = kopija(x, vrsta);
        if (vrsta === "spredaj" && c !== x) {
          const rez = odrezan ? null : x.clippingPlanes;
          if ((c.clippingPlanes?.length || 0) !== (rez?.length || 0)) c.needsUpdate = true;
          c.clippingPlanes = rez;
        }
        return c;
      };
      o.material = Array.isArray(izv) ? izv.map(zamenjaj) : zamenjaj(izv);
      o.renderOrder = vrsta === "spredaj" ? VRSTNI_RED + ro : ro;
      zapisi.set(o, { izv, ro, kopija: o.material });
    });
    // kopije materialov, ki jih model ne uporablja več (npr. nova molekula)
    for (const [izv, k] of kopije) {
      if (vidni.has(izv)) continue;
      k.duh?.dispose();
      k.spredaj?.dispose();
      kopije.delete(izv);
    }
    for (const o of zapisi.keys()) if (!o.parent && o !== koren) zapisi.delete(o);
    cilj = 1;
    if (!gibanje) p = 1;
    nastaviUniforme();
  }
  const sedanjiIzvirnik = (o, z) => o.material === z.kopija;

  // Izvirni materiali in vrstni red nazaj (kopije ostanejo za naslednjo izbiro).
  function obnovi() {
    for (const [o, z] of zapisi) {
      if (sedanjiIzvirnik(o, z)) o.material = z.izv;
      o.renderOrder = z.ro;
    }
    zapisi.clear();
  }

  // Kopije sledijo izvirnikom (model med animacijo spreminja motnost, barvo, vidnost).
  function sinhroniziraj() {
    for (const [izv, k] of kopije) {
      for (const c of [k.duh, k.spredaj]) {
        if (!c) continue;
        if (c.opacity !== izv.opacity) c.opacity = izv.opacity;
        if (c.visible !== izv.visible) c.visible = izv.visible;
        if (c.color && izv.color && !c.color.equals(izv.color)) c.color.copy(izv.color);
        if (c.emissive && izv.emissive && !c.emissive.equals(izv.emissive)) c.emissive.copy(izv.emissive);
        if (c === k.duh && c.clippingPlanes !== izv.clippingPlanes) c.clippingPlanes = izv.clippingPlanes;
      }
    }
  }

  /** Korak prehoda; vrne true, dokler se kaj spreminja. Ko poudarek ugasne, vrne izvirnike. */
  function korak(dt, gibanje = true) {
    if (!zapisi.size && p === 0) return false;
    sinhroniziraj();
    if (p === cilj) return false;
    p = gibanje ? Math.max(0, Math.min(1, p + (cilj > p ? 1 : -1) * (dt / TRAJANJE))) : cilj;
    nastaviUniforme();
    if (p === 0) obnovi();
    return true;
  }

  /** Mehko izklopi poudarek (pri zmanjšanem gibanju takoj). */
  function izklopi(gibanje = true) {
    cilj = 0;
    if (!gibanje || !zapisi.size) {
      p = 0;
      nastaviUniforme();
      obnovi();
    }
  }

  /** Vse nazaj in kopije sproščene (nova gradnja modela, zaprtje). */
  function pocisti() {
    cilj = p = 0;
    nastaviUniforme();
    obnovi();
    for (const k of kopije.values()) {
      k.duh?.dispose();
      k.spredaj?.dispose();
    }
    kopije.clear();
  }

  return {
    uporabi,
    izklopi,
    korak,
    pocisti,
    izvirnik: (o) => {
      const z = zapisi.get(o);
      return z && sedanjiIzvirnik(o, z) ? z.izv : o.material;
    },
    get aktiven() {
      return zapisi.size > 0;
    },
    get delez() {
      return p;
    },
    get steviloKopij() {
      let n = 0;
      for (const k of kopije.values()) n += !!k.duh + !!k.spredaj;
      return n;
    },
    uniforme: u,
  };
}
