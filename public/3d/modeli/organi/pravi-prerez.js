// »Pravi prerez«: fotografije pravih prerezov človeškega telesa (barvne kriorezine) v 3D. Drsnik premika ravnino v treh
// smereh, preklop ženska/moški, dotik na rezini pove slovensko ime strukture (mreža oznak iz modelov HuBMAP HRA).
// Telo okoli rezine je površje istega volumna, zato se prerez in telo natančno ujemata; rez pokaže pravo tkivo.
// Podatki: public/3d/rezine/kazalo.json → mape teles (meta.json, mali.webp, a|k|s/<i>.webp, p/…, oznake.bin); pripravi jih
// scripts/atlas/rezine.py in rezine_oznake.py (docs/3d.md »Pravi prerez telesa«).
// Brez uvodnega okna (j, 10. 11.: »ne bi rad delal take fame okoli prerezov«): ena mirna vrstica v opisu in navedba vira
// na odru. Raven OŠ (privzeta, dokler stopnje ni v profilu): telo je celo, začetek je prečni prerez prsnega koša naravnost
// na rezino, frontalni in sagitalni začneta izven sredine (ledvica), telo okoli rezine je izklopljeno, imena so
// preprostejša (rezine-oznake.json »os«; spolnih organov OŠ ne imenuje). Izjema od pravila »brez omrežja«: model bere
// samo te podatke. Nalaganje: najprej mali volumen (4 mm, vse smeri takoj), nato ostra rezina 1 mm za mirujoči drsnik,
// ob povečavi še ploščice 0,33 mm samo za vidni del.
// Vir fotografij: Courtesy of the U.S. National Library of Medicine (pogoji v public/3d/modeli/organi/viri.json).
import * as R from "../../rezine.js";
import * as V from "../../telo-vh.js";

export const info = {
  id: "organ-pravi-prerez",
  naslov: "Pravi prerez telesa",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Fotografije pravih prerezov človeškega telesa. Podatki NLM niso nujno najnovejši ali najnatančnejši; NLM Evklida ne podpira in ne priporoča.",
  poskusi: "Premakni drsnik skozi prsni koš in se dotakni srca, pljuč ali hrbtenice na rezini.",
  merilo: { m: 1.8, oznaka: "1,8 m" },
  namigOder: false, // pregledovalnik namiga »Povleci za vrtenje …« sploh ne ustvari (ne utripne pred gradnjo)
};

const NAVEDBA = "Courtesy of the U.S. National Library of Medicine";
const IMENA_SMERI = { a: "Prečno", k: "Frontalno", s: "Sagitalno" };
const VRSTA_VRETENCA = { "vratno-vretence": "C", "prsno-vretence": "Th", "ledveno-vretence": "L" };

function slika(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.decoding = "async";
    im.onload = () => res(im);
    im.onerror = () => rej(new Error(`ni slike ${url}`));
    im.src = url;
  });
}
const json = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${url}`))));

// Besedila pogleda v izbranem jeziku (veriga i18n/languages.js uiChain; srbska latinica iz cirilice kot v i18n.js).
// Brez datoteke (brez povezave, 404): tuji jeziki dobijo angleščino (R.BESEDILA_EN), slovenščina besedila iz kode.
async function naloziBesedila() {
  const [vse, jez, i18n] = await Promise.all([
    json(new URL("../../rezine-besedila.json", import.meta.url).href).catch((err) => {
      console.warn("3D rezine: besedil ni bilo mogoče naložiti", err?.message || err);
      return null;
    }),
    import(new URL("../../../i18n/languages.js", import.meta.url).href).catch(() => null),
    import(new URL("../../../i18n.js", import.meta.url).href).catch(() => null),
  ]);
  const lang = i18n?.currentLang?.() || document.documentElement.lang || "sl";
  const veriga = jez?.uiChain ? jez.uiChain(lang) : [lang, "en", "sl"];
  return R.slovarBesedil(vse, veriga, i18n?.srToLatin || ((x) => x));
}

// Model bere podatke iz datotek (canvas, slike): testi pogodbe v Node ga ne gradijo (test/3d-rezine.test.js preveri pomožne funkcije).
export const izDatotek = true;

export async function zgradi(THREE, ctx) {
  // besedila pogleda (a3.rez.*) niso v sl.js in ui/*.json (proračun prvega odprtja): public/3d/rezine-besedila.json
  // { jezik: { ključ: besedilo } } se naloži šele tukaj; veriga jezikov kot v i18n.js (npr. bho → hi → en → sl)
  // besedila, kazalo in imena oznak vzporedno (ocena B, krog 6: trije zaporedni krogi čakanja na počasnem omrežju)
  const koren = new URL("../../rezine/", import.meta.url).href;
  let kazalo;
  try {
    kazalo = JSON.parse(globalThis.localStorage?.getItem(R.KLJUC_KAZALA) || "null");
  } catch {}
  const [besedila, kazaloOmrezje, imena] = await Promise.all([
    naloziBesedila(),
    kazalo ? null : json(koren + "kazalo.json"),
    json(new URL("../../rezine-oznake.json", import.meta.url).href),
  ]);
  kazalo ||= kazaloOmrezje;
  const t = (k, sl) => {
    const v = ctx.t ? ctx.t(k) : k;
    if (v && v !== k) return v;
    return besedila(k) ?? sl;
  };
  const telefon = ctx.kakovost !== "visoka";
  // Gostovanje (vedro R2): vsako telo posebej (manjkajoče telo ne podre drugega); če ni nobenega, kazalo.rezerva
  // pokaže vzorec iz repozitorija (model ne pade)
  let osnova, spoli, mete;
  const pripravi = async (k) => {
    // največje število rezin po smereh čez vsa telesa (drsnik ima eno območje; vrednost se pripne na izbrano telo)
    ({ osnova, spoli, mete } = await R.telesaKazala(k, koren, json));
    kazalo = k;
  };
  const naRezervo = async (err) => {
    if (!kazalo.rezerva) throw err;
    console.warn("3D rezine: gostovanje ni dosegljivo, kažem vzorec", err?.message || err);
    await pripravi(kazalo.rezerva);
  };
  await pripravi(kazalo).catch(naRezervo);
  const najvec = (sm) => Math.max(...mete.map((m) => R.steviloRezin(m.dim, sm))) - 1;

  const group = new THREE.Group();
  const notranja = new THREE.Group(); // koordinate v mm volumna, postavljena v kroglo s polmerom 1
  group.add(notranja);
  const ravnina = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const ravenZ = Number(ctx.zacetek?.raven);
  const stanje = { raven: [1, 2, 3].includes(ravenZ) ? ravenZ : 1, spol: ctx.zacetek?.telo && spoli.includes(ctx.zacetek.telo) ? ctx.zacetek.telo : spoli[0], smer: ctx.zacetek?.smer || "a", i: { a: 0, k: 0, s: 0 }, telo: true, pogled: "3d", izbrana: 0, premaknjeno: { a: false, k: false, s: false }, nacin: V.privzetNacin(ravenZ || 1), razmik: 0, rentgen: true, slog: "" };
  stanje.slog = ctx.zacetek?.videz && ["s1", "s2", "s3", "foto"].includes(ctx.zacetek.videz) ? ctx.zacetek.videz : (stanje.raven >= 3 ? "s3" : stanje.raven === 2 ? "s2" : "s1");
  if (stanje.raven === 1) Object.assign(stanje, { ...R.pogledZaRaven(1), smer: stanje.smer });
  let T = null; // naloženo telo: { meta, url, mali, ozn, dim }
  let napakaNalaganja = "", ponovi = "", napakePloscic = 0;
  const manjkajoce = new Set(); // ploščice, ki jih ni (404; smer/rezina/raven/ime): ne zahtevamo jih znova
  const poskusiPloscic = new Map(), zacasnoDo = new Map(); // začasne napake: število poskusov, do kdaj nižja raven
  let uraPonovitve = 0;
  let ostraZa = "", zadnjaKamera = null, visinaPlatna = 800, kljucKamere = "";
  let uraOstre = 0, uraPloscic = 0, uraKamere = 0;
  const narisi = () => ctx.narisi?.(); // slike pridejo kasneje, tudi ko animacija ne teče (zmanjšano gibanje)
  const predpomnilnik = new Map(); // url → Texture (zadnjih nekaj)
  const deliPoId = new Map();
  let seznamDelov = [];

  // --- rezina: nizka ločljivost iz malega volumna (canvas), čez njo ostra slika in ploščice
  const platno = document.createElement("canvas");
  const texMala = new THREE.CanvasTexture(platno);
  texMala.colorSpace = THREE.SRGBColorSpace;
  texMala.minFilter = texMala.magFilter = THREE.LinearFilter;
  texMala.generateMipmaps = false;
  const geoRezine = new THREE.BufferGeometry();
  geoRezine.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12), 3));
  geoRezine.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));
  geoRezine.setIndex([0, 2, 1, 1, 2, 3]);
  // Fotografija rezine: barvna korekcija (V.GLSL_KOREKCIJA: posvetli srednje tone, dvigne sence) in ostrenje brez halojev
  // (unsharp samo na svetlosti, omejen na min/max sosedov – nič izmišljenega; sosedje na razdalji enega zaslonskega
  // piksla, fwidth). uFoto = 0 izklopi oboje (izvirnik).
  const popravek = { uPopravi: { value: 1 } };
  const mat = (map, red) => {
    const m = new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide, toneMapped: false, depthWrite: red === 0, alphaTest: red === 0 ? 0.35 : 0, polygonOffset: red > 0, polygonOffsetFactor: -red, polygonOffsetUnits: -red * 2 });
    if (red !== 3) {
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, popravek);
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", `#include <common>\nuniform float uPopravi;\n${V.GLSL_KOREKCIJA}
vec3 k3Srgb(vec3 c) { return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2)); }
float k3Y(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }`)
          .replace("#include <map_fragment>", `
#ifdef USE_MAP
  vec4 k3c = texture2D(map, vMapUv);
  if (uPopravi > 0.5) {
    vec2 d = clamp(fwidth(vMapUv), vec2(1e-5), vec2(0.01));
    vec3 c0 = k3Srgb(k3c.rgb);
    float y0 = k3Y(c0);
    float y1 = k3Y(k3Srgb(texture2D(map, vMapUv + vec2(d.x, 0.0)).rgb)), y2 = k3Y(k3Srgb(texture2D(map, vMapUv - vec2(d.x, 0.0)).rgb));
    float y3 = k3Y(k3Srgb(texture2D(map, vMapUv + vec2(0.0, d.y)).rgb)), y4 = k3Y(k3Srgb(texture2D(map, vMapUv - vec2(0.0, d.y)).rgb));
    float ys = y0 + 0.8 * (y0 - 0.25 * (y1 + y2 + y3 + y4));
    ys = clamp(ys, min(min(y1, y2), min(min(y3, y4), y0)), max(max(y1, y2), max(max(y3, y4), y0)));
    c0 = clamp(c0 + (ys - y0), 0.0, 1.0);
    k3c.rgb = pow(k3Popravi(c0), vec3(2.2));
  }
  diffuseColor *= k3c;
#endif`);
      };
      m.customProgramCacheKey = () => "k3-rezina-foto";
    }
    return m;
  };
  // rob fotografije pri podlakteh (roka sega čez rob kadra NLM, ravno odrezana): prosojnost zbledi v zadnjih 25 mm ob
  // desnem in levem robu volumna (smer a in k, kjer je u os od desne proti levi strani telesa)
  const robPodatki = new Uint8Array(256 * 4).fill(255);
  const texRoba = new THREE.DataTexture(robPodatki, 256, 1);
  texRoba.minFilter = texRoba.magFilter = THREE.LinearFilter;
  let robZa = "";
  const nastaviRob = (s, Wd) => {
    const k = s === "s" ? "s" : `${s}${Wd}`;
    if (robZa === k) return;
    robZa = k;
    const pas = s === "s" ? 0 : Math.min(0.08, 25 / Wd);
    for (let x = 0; x < 256; x++) {
      const u = (x + 0.5) / 256, d = Math.min(u, 1 - u);
      const a = pas ? Math.min(1, d / pas) : 1;
      robPodatki.fill(Math.round(255 * a * a * (3 - 2 * a)), x * 4, x * 4 + 4);
    }
    texRoba.needsUpdate = true;
  };
  const ploskev = new THREE.Mesh(geoRezine, mat(texMala, 0));
  const ostra = new THREE.Mesh(geoRezine, mat(null, 1));
  ploskev.material.alphaMap = texRoba; ostra.material.alphaMap = texRoba;
  ostra.visible = false;
  ostra.raycast = () => {};
  const platnoPoudarka = document.createElement("canvas");
  const texPoudarka = new THREE.CanvasTexture(platnoPoudarka);
  texPoudarka.minFilter = texPoudarka.magFilter = THREE.LinearFilter;
  texPoudarka.generateMipmaps = false;
  const poudarek = new THREE.Mesh(geoRezine, mat(texPoudarka, 3));
  poudarek.visible = false;
  poudarek.raycast = () => {};
  poudarek.userData.k3Sij = true;
  const skupinaPloscic = new THREE.Group();
  // vrstni red izrisa: mala → ostra → ploščice (3, 4) → poudarek (5). Skupina ploščic NIMA svojega renderOrder: three.js
  // bi jo kot skupino izrisal za vsemi predmeti brez skupine in ploščice 0,33 mm bi prekrile poudarek (krog 6).
  ploskev.renderOrder = 1; ostra.renderOrder = 2; poudarek.renderOrder = 5;
  notranja.add(ploskev, ostra, skupinaPloscic, poudarek);
  ploskev.onBeforeRender = (renderer, _s, kamera) => {
    zadnjaKamera = kamera;
    visinaPlatna = renderer.domElement.clientHeight || 800;
    sirinaPlatna = renderer.domElement.clientWidth || 800;
    // kamera se je premaknila (povečava, vrtenje): ko se umiri, preveri, katere ploščice so na zaslonu
    const kk = kamera.position.toArray().concat(kamera.quaternion.toArray(), kamera.zoom).map((x) => x.toFixed(3)).join();
    if (kk !== kljucKamere) {
      kljucKamere = kk;
      clearTimeout(uraKamere);
      uraKamere = setTimeout(() => { naloziPloscice(); preveriDebelinoObrisa(); }, 350);
    }
    drziOznakeSmeri(kamera);
  };

  // --- oznake smeri ob rezini (desno/levo telesa, spredaj/zadaj): ob robu vsebine, stalne velikosti na zaslonu (≥ 14 px)
  // in pri povečavi pripete na rob odra, da ostanejo vidne
  const VISINA_NAPISA = 30; // px CSS: višina napisa (pisava ≈ 16 px)
  const ROB_ORODIJ = 58, ROB_NAVEDBE = 26; // px CSS: orodna vrstica na vrhu odra, navedba vira (in merilo) na dnu
  // dve sliki napisa: prosto ob rezini (besedilo z obrobo) in pripeto na rob odra pri povečavi (temna ploščica, da napis
  // ni »na tkivu«, ampak je očitno del vmesnika; ocena A, krog 6)
  const napis = (besedilo) => {
    const slika = (ploscica) => {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 64;
      const g = c.getContext("2d");
      g.font = "600 34px 'Instrument Sans', system-ui, sans-serif";
      g.textAlign = "center"; g.textBaseline = "middle";
      const w = Math.min(250, g.measureText(besedilo).width + 28);
      if (ploscica) {
        g.fillStyle = "rgba(10,14,22,0.82)";
        g.beginPath();
        g.roundRect?.(128 - w / 2, 6, w, 54, 27);
        if (!g.roundRect) g.rect(128 - w / 2, 6, w, 54);
        g.fill();
      } else {
        g.lineJoin = "round"; g.lineWidth = 8; g.strokeStyle = "rgba(8,12,20,0.85)";
        g.strokeText(besedilo, 128, 34);
      }
      g.fillStyle = "rgba(226,234,246,0.96)";
      g.fillText(besedilo, 128, 34);
      const tx = new THREE.CanvasTexture(c);
      tx.colorSpace = THREE.SRGBColorSpace;
      return { tx, siroka: (ploscica ? w : g.measureText(besedilo).width) / 256 };
    };
    const prosto = slika(false), pripeto = slika(true);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: prosto.tx, depthTest: false, transparent: true, toneMapped: false, sizeAttenuation: false }));
    sp.raycast = () => {};
    sp.renderOrder = 6;
    sp.frustumCulled = false;
    sp.userData.sidro = new THREE.Vector3();
    sp.userData.sidro2 = null; // drugo mesto (npr. zgornji kot), če ob strani ni prostora
    sp.userData.slike = { prosto, pripeto };
    sp.userData.siroka = prosto.siroka;
    return sp;
  };
  const smeri = { d: napis(t("a3.right", "desno")), l: napis(t("a3.left", "levo")), s: napis(t("a3.rez.front", "spredaj")), z: napis(t("a3.rez.back", "zadaj")) };
  const skupinaSmeri = new THREE.Group();
  skupinaSmeri.add(...Object.values(smeri));
  notranja.add(skupinaSmeri);
  let sirinaPlatna = 800;
  const _v = new THREE.Vector3();
  function drziOznakeSmeri(kamera) {
    if (!skupinaSmeri.visible) return;
    const fov = kamera.isPerspectiveCamera ? 2 * Math.tan(THREE.MathUtils.degToRad(kamera.fov) / 2) / (kamera.zoom || 1) : 2;
    const sv = (VISINA_NAPISA / visinaPlatna) * fov / notranja.scale.x;
    for (const sp of Object.values(smeri)) {
      if (!sp.visible) continue;
      sp.scale.set(sv * 4, sv, 1);
      // sidro na robu vsebine → NDC; če je izven odra, ga pripnemo na rob (z odmikom za pol napisa)
      // zgoraj pod orodno vrstico odra (gumbi 40 px), spodaj nad navedbo vira (ocena kroga 6: pri povečavi na telefonu
      // je »spredaj« zdrsnil pod gumbe, »zadaj« na navedbo)
      const mx = 1 - ((sp.userData.slike.pripeto.siroka * VISINA_NAPISA * 4) / 2 + 10) / (sirinaPlatna / 2);
      const myGor = 1 - (VISINA_NAPISA / 2 + 8 + ROB_ORODIJ) / (visinaPlatna / 2), myDol = 1 - (VISINA_NAPISA / 2 + 6 + ROB_NAVEDBE) / (visinaPlatna / 2);
      // za koliko px CSS bi pripenjanje premaknilo napis (majhen premik je le poravnava ob robu, ne »pripeto«)
      const odmik = (q) => Math.max(0, (Math.abs(q.x) - mx) * sirinaPlatna / 2, (q.y - myGor) * visinaPlatna / 2, (-myDol - q.y) * visinaPlatna / 2);
      const MALO = 18;
      _v.copy(sp.userData.sidro).applyMatrix4(notranja.matrixWorld).project(kamera);
      // ob strani ni prostora (ozek telefon: »desno/levo« bi padla na nadlahti): drugo sidro v zgornjem kotu nad telesom
      if (odmik(_v) > MALO && sp.userData.sidro2) {
        const v2 = sp.userData.sidro2.clone().applyMatrix4(notranja.matrixWorld).project(kamera);
        if (odmik(v2) <= MALO) _v.copy(v2);
      }
      const pripeto = odmik(_v) > MALO;
      const sl = sp.userData.slike[pripeto ? "pripeto" : "prosto"];
      if (sp.material.map !== sl.tx) { sp.material.map = sl.tx; sp.material.needsUpdate = true; }
      _v.x = Math.max(-mx, Math.min(mx, _v.x));
      _v.y = Math.max(-myDol, Math.min(myGor, _v.y));
      _v.unproject(kamera);
      notranja.worldToLocal(_v);
      sp.position.copy(_v);
      sp.updateMatrixWorld();
    }
  }
  function postaviOznakeSmeri() {
    const s = stanje.smer, i = stanje.i[s], { dim } = T;
    skupinaSmeri.visible = stanje.pogled === "ravno";
    const [wr, hr] = R.velikostRezine(dim, s);
    // odmik od roba vsebine v mm volumna: ≈ pol napisa na zaslonu pri začetnem kadru
    const rob = Math.max(wr * (vsebina.u1 - vsebina.u0), hr * (vsebina.v1 - vsebina.v0)) * 0.09;
    const { u0, v0, u1, v1 } = vsebina;
    const na = (sp, u, v, du, dv) => {
      const p = R.tockaRezine(dim, s, i, u + du / wr, v + dv / hr);
      vMm(p[0], p[1], p[2], sp.userData.sidro);
      sp.position.copy(sp.userData.sidro);
      sp.userData.sidro2 = null;
      sp.visible = true;
    };
    const na2 = (sp, u, v, du, dv) => {
      const p = R.tockaRezine(dim, s, i, u + du / wr, v + dv / hr);
      sp.userData.sidro2 = vMm(p[0], p[1], p[2]);
    };
    for (const sp of Object.values(smeri)) sp.visible = false;
    const cv = (v0 + v1) / 2, cu = (u0 + u1) / 2;
    if (s === "a") {
      na(smeri.d, u0, cv, -rob * 1.6, 0); na(smeri.l, u1, cv, rob * 1.6, 0); na(smeri.s, cu, v0, 0, -rob * 0.7); na(smeri.z, cu, v1, 0, rob * 0.7);
      // ozek oder: »desno/levo« nad zunanjim robom nadlahti, v vrsti s »spredaj« (prečni prerez je tam prazen gel)
      const du = (u1 - u0) * wr * 0.07;
      na2(smeri.d, u0, v0, du, -rob * 0.7); na2(smeri.l, u1, v0, -du, -rob * 0.7);
    } else if (s === "k") {
      na(smeri.d, u0, Math.min(cv, 0.3), -rob * 1.6, 0); na(smeri.l, u1, Math.min(cv, 0.3), rob * 1.6, 0);
    } else {
      na(smeri.s, u0, Math.min(cv, 0.3), -rob * 2, 0); na(smeri.z, u1, Math.min(cv, 0.3), rob * 2, 0);
    }
  }

  // --- telo okoli rezine
  const matTelesa = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0, clippingPlanes: [ravnina], side: THREE.FrontSide });
  let telo = null, vsebina = { u0: 0, v0: 0, u1: 1, v1: 1 };
  // »Pravo telo 3D« (telo-vh.js): organi iz mreže oznak istih rezin; ko je naloženo, nadomesti površje telesa
  let organi3d = null;
  const vMreziRezine = () => stanje.razmik === 0; // razmik in police: rezina se ne bi ujemala, je skrita
  function uskladiTelo() {
    const vidno = stanje.telo && stanje.pogled !== "ravno";
    if (telo) telo.visible = vidno && !organi3d;
    if (organi3d) {
      const izbor = stanje.izbrana ? new Set(kljuciIzbire(stanje.izbrana)) : null;
      organi3d.nastavi({ foto: stanje.raven >= 3, nacin: stanje.nacin, razmik: stanje.razmik, izbor, rentgen: stanje.rentgen, vidno: vidno || stanje.razmik > 0 });
    }
    const r = vMreziRezine();
    ploskev.visible = r; skupinaPloscic.visible = r; skupinaSmeri.visible = r;
    if (!r) { ostra.visible = false; poudarek.visible = false; }
  }
  // ključi oznak izbire (celota »srce« → vsi deli srca na mreži)
  function kljuciIzbire(kl) {
    if (!organi3d) return [kl];
    const vsi = [...organi3d.mreze.keys()];
    if (organi3d.mreze.has(kl)) return [kl];
    const deli = V.deliCelote(kl, vsi);
    if (deli.length) return deli;
    return vsi.filter((k) => R.kljucZaRaven(imena, k, os()) === kl || k.startsWith(kl + "-"));
  }

  const vMm = (x, y, z, v = new THREE.Vector3()) => v.set(x, -z, -y); // mm volumna → krajevne koordinate (Y gor, +Z spredaj)

  function postaviRezino() {
    const { dim } = T, s = stanje.smer, i = stanje.i[s];
    // prečna rezina ostane na sredini odra: telo drsi skozi ravnino (kamera miruje, rezina je velika)
    const [Wd, Hd, Zd] = dim, sc = notranja.scale.x;
    nastaviRob(s, Wd);
    const m = R.zapolniLuknje(R.rezinaMalega(T.mali, s, Math.floor(i / T.mali.mm)));
    vsebina = R.okvirVsebine(m) || { u0: 0, v0: 0, u1: 1, v1: 1 };
    // vsebina rezine (npr. glava ali stran telesa) na sredini odra, da zapolni okno; »V telesu« pri frontalni in sagitalni
    // smeri ostane telo na sredini (kamera gleda celo telo)
    const cu = (vsebina.u0 + vsebina.u1) / 2, cv = (vsebina.v0 + vsebina.v1) / 2;
    if (s === "a") notranja.position.set(-cu * Wd * sc, (i + 0.5) * sc, cv * Hd * sc);
    else if (stanje.pogled !== "ravno") notranja.position.set(-0.5 * Wd * sc, (Zd / 2) * sc, 0.5 * Hd * sc);
    else if (s === "k") notranja.position.set(-cu * Wd * sc, cv * Zd * sc, (i + 0.5) * sc);
    else notranja.position.set(-(i + 0.5) * sc, cv * Zd * sc, cu * Hd * sc);
    const p = geoRezine.attributes.position, v = new THREE.Vector3();
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([u, w], k) => {
      const q = R.tockaRezine(dim, s, i, u, w);
      vMm(q[0], q[1], q[2], v);
      p.setXYZ(k, v.x, v.y, v.z);
    });
    p.needsUpdate = true;
    geoRezine.computeBoundingSphere();
    geoRezine.computeBoundingBox();
    // mala slika takoj
    if (platno.width !== m.w || platno.height !== m.h) {
      platno.width = m.w; platno.height = m.h;
      texMala.dispose();
    }
    platno.getContext("2d").putImageData(new ImageData(m.data, m.w, m.h), 0, 0);
    texMala.needsUpdate = true;
    // ravnina reza v svetovnih koordinatah: del telesa pred rezino (proti kameri) odrežemo
    const ravno = stanje.pogled === "ravno";
    const n = s === "a" ? new THREE.Vector3(0, ravno ? 1 : -1, 0) : s === "k" ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(-1, 0, 0);
    const tocka = vMm(...R.tockaRezine(dim, s, i, 0.5, 0.5));
    notranja.updateMatrixWorld(true);
    ravnina.setFromNormalAndCoplanarPoint(n, tocka).applyMatrix4(notranja.matrixWorld);
    postaviOznakeSmeri();
    uskladiTelo(); // pogled naravnost je čista rezina kot v atlasu
    ostra.visible = ostraZa === kljuc();
    pocistiPloscice();
    clearTimeout(uraOstre); clearTimeout(uraPloscic);
    uraOstre = setTimeout(naloziOstro, 140);     // drsnik miruje: ostra rezina 1 mm
    uraPloscic = setTimeout(naloziPloscice, 450); // nato ploščice, če je rezina povečana
    osveziDele();
    narisiPoudarek();
    narisi();
  }
  // Videz rezine (j, 10. 11. 22:30): OŠ šolski (s1, barve po organih), SŠ realističen (s2), fakulteta prava fotografija
  // (s3: popravljena fotografija z barvnimi obrisi). Slogi so vnaprej izrisane slike iste ločljivosti v <telo>/<slog>/;
  // kjer jih za rezino ni (meta.slogi.rezine), ostane fotografija s korekcijo v senčilniku.
  const SLOGI = ["s1", "s2", "s3"];
  const privzetSlog = (raven) => (raven >= 3 ? "s3" : raven === 2 ? "s2" : "s1");
  const slogZdaj = () => {
    const sl = T?.meta?.slogi;
    if (!sl || !stanje.slog || !sl.imena?.includes(stanje.slog)) return "";
    if (sl.smeri && !sl.smeri.includes(stanje.smer)) return "";
    if (Array.isArray(sl.rezine) && !sl.rezine.includes(stanje.i[stanje.smer])) return "";
    return stanje.slog;
  };
  const bazaSlik = () => { const sl = slogZdaj(); popravek.uPopravi.value = sl ? 0 : 1; return T.url + (sl ? `${sl}/` : ""); };
  const os = () => stanje.raven === 1; // raven OŠ: preprostejša imena, privzeto pogled naravnost na rezino
  const pripni = (sm, v) => Math.max(0, Math.min(R.steviloRezin(T.dim, sm) - 1, Math.round(v)));
  const kljuc = () => `${stanje.spol}/${slogZdaj()}/${stanje.smer}/${stanje.i[stanje.smer]}`;

  function tekstura(url) {
    if (predpomnilnik.has(url)) return Promise.resolve(predpomnilnik.get(url));
    return slika(url).then((im) => {
      const tx = new THREE.Texture(im);
      tx.colorSpace = THREE.SRGBColorSpace;
      tx.minFilter = THREE.LinearFilter;
      tx.generateMipmaps = false;
      tx.needsUpdate = true;
      predpomnilnik.set(url, tx);
      if (predpomnilnik.size > (telefon ? 10 : 28)) {
        const [prvi, stara] = predpomnilnik.entries().next().value;
        if (stara !== ostra.material.map && !skupinaPloscic.children.some((c) => c.material.map === stara)) {
          stara.dispose();
          predpomnilnik.delete(prvi);
        }
      }
      return tx;
    });
  }

  function naloziOstro() {
    if (T.meta.ostro === false) return;
    const k = kljuc(), s = stanje.smer;
    tekstura(`${bazaSlik()}${s}/${stanje.i[s]}.webp`).then(
      (tx) => {
        if (k !== kljuc()) return;
        ostra.material.map = tx;
        ostra.material.needsUpdate = true;
        ostra.visible = true;
        ostraZa = k;
        napakaNalaganja = "";
        if (stanje.izbrana) narisiPoudarek(); // obris po fotografiji (brez maščobe ob robu)
        narisi();
      },
      () => {
        // en ponovni poskus čez 2 s, nato sporočilo (brez povezave ostane slika nizke ločljivosti)
        if (k !== kljuc()) return;
        if (ponovi !== k) {
          ponovi = k;
          uraOstre = setTimeout(naloziOstro, 2000);
        } else {
          napakaNalaganja = t("a3.loadError", "Tega dela ni bilo mogoče naložiti. Preveri povezavo in poskusi znova.");
          narisi();
        }
      },
    );
  }

  // Ploščice podrobne ravni: samo tiste, ki so na zaslonu, in šele ko je rezina povečana.
  function pocistiPloscice() {
    for (const c of [...skupinaPloscic.children]) {
      skupinaPloscic.remove(c);
      c.geometry.dispose();
      c.material.dispose();
    }
  }
  function naloziPloscice() {
    if (!T) return;
    const p = T.meta.podrobno, s = stanje.smer, i = stanje.i[s];
    if (!p || !p.ravnine.includes(s) || !zadnjaKamera || T.meta.ostro === false) return;
    const k = kljuc();
    const potrebne = new Map();
    for (const pl of R.ploscice(p, T.dim, s, i)) {
      const u1 = Math.min(pl.u1, 1), v1 = Math.min(pl.v1, 1);
      const lok = [[pl.u0, pl.v0], [u1, pl.v0], [pl.u0, v1], [u1, v1]].map(([u, v]) => vMm(...R.tockaRezine(T.dim, s, i, u, v)));
      const ndc = lok.map((q) => q.clone().applyMatrix4(notranja.matrixWorld).project(zadnjaKamera));
      if (ndc.every((q) => q.x < -1) || ndc.every((q) => q.x > 1) || ndc.every((q) => q.y < -1) || ndc.every((q) => q.y > 1) || ndc.every((q) => q.z > 1)) continue;
      // stranica cele ploščice na zaslonu v pikslih CSS (iz diagonale vidnega dela)
      const delez = Math.hypot(u1 - pl.u0, v1 - pl.v0) / Math.hypot(pl.u1 - pl.u0, pl.v1 - pl.v0);
      const naZaslonu = ((Math.hypot(ndc[0].x - ndc[3].x, ndc[0].y - ndc[3].y) / 2) * visinaPlatna) / Math.SQRT2 / Math.max(delez, 0.05);
      const raven = R.ravenPloscice(naZaslonu, { telefon, dpr: globalThis.devicePixelRatio || 1 });
      // manjkajoča ploščica (404): tiho raven nižje (R.nizjaPloscica)
      const zdaj = Date.now();
      const sl = slogZdaj();
      const rv = R.nizjaPloscica(raven, (r) => manjkajoce.has(`${sl}/${s}/${i}/${r}/${pl.ime}`) || (zacasnoDo.get(`${sl}/${s}/${i}/${r}/${pl.ime}`) || 0) > zdaj);
      if (rv >= 0) potrebne.set(`${rv}/${pl.ime}`, { pl, lok, u1, v1 });
    }
    for (const c of [...skupinaPloscic.children])
      if (!potrebne.has(c.userData.kljuc)) {
        skupinaPloscic.remove(c);
        c.geometry.dispose();
        c.material.dispose();
      } else potrebne.delete(c.userData.kljuc);
    for (const [kl, { pl, lok, u1, v1 }] of potrebne) {
      // ploščica je vedno cela (512 px), slika rezine pa se lahko konča prej: uv do dejanskega roba
      const du = (u1 - pl.u0) / (pl.u1 - pl.u0), dv = (v1 - pl.v0) / (pl.v1 - pl.v0);
      tekstura(`${bazaSlik()}p/${s}/${kl}.webp`).then(
        (tx) => {
          if (k !== kljuc() || skupinaPloscic.children.some((c) => c.userData.kljuc === kl)) return;
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lok.flatMap((q) => [q.x, q.y, q.z])), 3));
          g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 1, du, 1, 0, 1 - dv, du, 1 - dv]), 2));
          g.setIndex([0, 2, 1, 1, 2, 3]);
          const m = new THREE.Mesh(g, mat(tx, 2));
          m.raycast = () => {};
          m.renderOrder = kl.startsWith("0/") ? 4 : 3;
          m.userData.kljuc = kl;
          skupinaPloscic.add(m);
          napakePloscic = 0;
          narisi();
        },
        (err) => {
          // ploščica ni prišla: tiho ostane nižja ločljivost (0,66 mm namesto 0,33 mm, sicer ostra slika 1 mm), ki je že
          // vidna; brez sporočila o napaki (ocena A, krog 6: okno »ni bilo mogoče naložiti« ob vidni sliki).
          // Samo 404 je »manjka« za vedno; začasna napaka (omrežje, 5xx) se ponovi čez 1, 4 in 15 s (ocena B, krog 7).
          if (k !== kljuc()) return;
          const pot = `${slogZdaj()}/${s}/${stanje.i[s]}/${kl}`, url = `${bazaSlik()}p/${s}/${kl}.webp`;
          if (++napakePloscic === 1) console.warn("3D rezine: ploščica ni na voljo", kl, err?.message || err);
          R.statusSlike(url).then((st) => {
            if (k !== kljuc()) return;
            const n = poskusiPloscic.get(pot) || 0, zamik = R.vrstaNapake(st) === "zacasno" ? R.zamikPonovitve(n) : null;
            if (zamik != null) {
              poskusiPloscic.set(pot, n + 1);
              zacasnoDo.set(pot, Date.now() + zamik - 50);
              clearTimeout(uraPonovitve);
              uraPonovitve = setTimeout(naloziPloscice, zamik);
            } else manjkajoce.add(pot);
            if (kl.startsWith("0/")) naloziPloscice(); // medtem nižja raven
          });
        },
      );
    }
  }

  // --- deli: strukture na trenutni rezini (seznam ob modelu) in poudarek izbrane
  // del za oznako mreže; na ravni OŠ preprostejše skupno ime (ali nič, če ga za to raven ni)
  // posamezno vretence (»prsno-vretence-th8«) ima na OŠ ime skupine svoje vrste (hrbtenica)
  const kljucOznake = (id) => {
    return R.kljucZaRaven(imena, id ? T.meta.oznake.kljuci[id - 1] : "", os());
  };
  const del = (id) => delKljuca(kljucOznake(id));
  function delKljuca(kl, raven = "") {
    if (!kl) return null;
    if (raven) kl = `${kl}-${raven.toLowerCase()}`;
    if (deliPoId.has(kl)) return deliPoId.get(kl);
    const o = R.opisOznake(imena, kl);
    if (!o) return null;
    // latinsko ime ne na OŠ (j, 10. 11.); kartica kot v atlasu: »Del: Srce«, »Odpri v 3D atlasu«, na polici »Pokaži v telesu«
    const d = { id: `o-${kl}`, ime: o.sl, la: os() ? "" : o.la, opis: o.opis, barva: o.barva, meshes: [], tocka: [0, 0, 0], kljuc: kl };
    Object.defineProperty(d, "gumbi", { enumerable: false, get: () => [
      ...(stanje.razmik > 0 ? [{ besedilo: t("a3.rez.showInBody", "Pokaži v telesu"), ikona: "undo-2", ponastaviPogled: true, ob: () => { bilePolice = false; nastaviRazmik(0); } }] : []),
      { besedilo: t("a3.rez.openAtlas", "Odpri v 3D atlasu"), ikona: "external-link", href: "/3d#atlas" },
    ] });
    deliPoId.set(kl, d);
    return d;
  }
  let rezOznak = null, tapUV = null;
  function osveziDele() {
    rezOznak = T.ozn ? R.rezinaOznak(T.ozn, stanje.smer, stanje.i[stanje.smer]) : null;
    const novi = [];
    if (rezOznak) for (const [id] of R.struktureRezine(rezOznak, 3)) {
      const d = del(id);
      if (d && !novi.includes(d)) novi.push(d);
      if (novi.length >= 40) break;
    }
    const izb = stanje.izbrana ? deliPoId.get(stanje.izbrana) : null;
    if (izb && !novi.includes(izb)) novi.push(izb);
    if (novi.length !== seznamDelov.length || novi.some((d, k) => d !== seznamDelov[k])) seznamDelov = novi;
  }
  // Poudarek izbrane strukture: mreža oznak je 2 mm, obris pa gladek (R.gladekObris: brez otočkov, povečan in zglajen),
  // da ni stopnic in drobcev ob robu.
  function narisiPoudarek() {
    const kl = stanje.izbrana;
    if (!rezOznak || !kl) {
      poudarek.visible = false;
      return;
    }
    const je = new Uint8Array(256);
    // vretence iz starejših oznak (vsa prsna vretenca ena oznaka): samo celice v višini izbranega vretenca
    const v = R.vretence(kl), staro = v?.raven && !T.meta.oznake.kljuci.includes(kl);
    T.meta.oznake.kljuci.forEach((_, k) => { const kk = kljucOznake(k + 1); if (kk === kl || (staro && kk === v.osnova)) je[k + 1] = 1; });
    let r = rezOznak;
    const meje = staro && stanje.smer !== "a" ? R.mejeVretenca(T.meta.oznake.ravni, v.raven) : null;
    if (meje) {
      const d = r.data.slice(), mm = T.ozn.mm;
      for (let y = 0; y < r.h; y++) {
        const z = (y + 0.5) * mm;
        if (z >= meje[0] && z < meje[1]) continue;
        for (let x = 0; x < r.w; x++) if (je[d[y * r.w + x]]) d[y * r.w + x] = 0;
      }
      r = { ...r, data: d };
    }
    const f = r.w * r.h > 120000 ? 3 : 4;
    // drobne luknje brez oznake znotraj strukture zapolnjene (žile z lastno oznako ostanejo luknje)
    // papilarne mišice ipd. (R.NOTRANJI) so del prekata: luknja iz njih se zapolni
    const notranje = new Uint8Array(256);
    for (const x of R.NOTRANJI[kl] || []) { const k = T.meta.oznake.kljuci.indexOf(x); if (k >= 0) notranje[k + 1] = 1; }
    // medprekatni pretin je del obrisa levega prekata (R.DELI_OBRISA; ocena A, krog 6)
    for (const x of R.DELI_OBRISA[kl] || []) { const k = T.meta.oznake.kljuci.indexOf(x); if (k >= 0) je[k + 1] = 1; }
    // žile do ~5 mm niso luknje (na fotografiji jih ni videti); obris srca in organov ne sega v maščobo ob njih
    const mm = T.ozn.mm, zile = R.ZILA_CELIC(mm);
    const zapolnjen = R.zapolniObris(r, je, 40, notranje, zile);
    const sv = svetlostCelic(r.w, r.h);
    if (sv) R.zapolniNevidneZile(zapolnjen, sv);
    const o = R.gladekObris(zapolnjen, Uint8Array.of(0, 1), f, tapUV,
      { celica: mm, tkivo: R.BREZ_MASCOBE.has(kl) ? vzorecTkiva(r.w * f, r.h * f) : null });
    if (!o) {
      poudarek.visible = false;
      zadnjiObris = null;
      return;
    }
    const c = new THREE.Color(deliPoId.get(kl)?.barva || "#6E9BFF");
    // vsi poudarki prosojni z obrobo (ocena B, krog 4: svetlo modri desni preddvor je na temni krvi prekril tkivo):
    // svetlejša barva → manj prekrivna (svetlost sRGB 0,33 → 25 %, 0,58 → 14 %), da se tkivo pod njo vedno vidi
    const hx = c.getHex(), svetlost = (0.2126 * (hx >> 16) + 0.7152 * ((hx >> 8) & 255) + 0.0722 * (hx & 255)) / 255;
    const polnilo = Math.round(Math.max(28, Math.min(64, 100 - 110 * svetlost)));
    const px = new Uint8ClampedArray(o.w * o.h * 4);
    for (let k = 0; k < o.data.length; k++) {
      if (!o.data[k]) continue;
      px[k * 4] = c.r * 255; px[k * 4 + 1] = c.g * 255; px[k * 4 + 2] = c.b * 255; px[k * 4 + 3] = polnilo;
    }
    zadnjiObris = { o, polnilo: new ImageData(px, o.w, o.h) };
    risiObris();
  }
  // Obrobo (vektorska črta R.crteObrisa: gladka, sklenjena) riše platno: bela črta ≈ 2,4 px zaslona s temnim robom, da je
  // vidna na svetli maščobi in na temni krvi (ocena A, krog 6: tanka, slabo kontrastna obroba). Debelina sledi povečavi:
  // ko se kamera umiri in se merilo spremeni za več kot ~40 %, se črta nariše znova (brez novega računanja maske).
  let zadnjiObris = null, merilObrisa = 0;
  function zaslonNaPikselObrisa() {
    if (!zadnjaKamera || !zadnjiObris) return 0;
    const s = stanje.smer, i = stanje.i[s], [wr] = R.velikostRezine(T.dim, s);
    const a = vMm(...R.tockaRezine(T.dim, s, i, 0.5, 0.5)), b = vMm(...R.tockaRezine(T.dim, s, i, 0.5 + 10 / wr, 0.5));
    const pa = a.applyMatrix4(notranja.matrixWorld).project(zadnjaKamera), pb = b.applyMatrix4(notranja.matrixWorld).project(zadnjaKamera);
    const pxNaMm = Math.hypot(((pb.x - pa.x) * sirinaPlatna) / 2, ((pb.y - pa.y) * visinaPlatna) / 2) / 10;
    return pxNaMm / (zadnjiObris.o.w / wr); // px zaslona na piksel platna obrisa
  }
  function risiObris() {
    const z = zadnjiObris;
    if (!z) return;
    const { o } = z;
    if (platnoPoudarka.width !== o.w || platnoPoudarka.height !== o.h) {
      platnoPoudarka.width = o.w; platnoPoudarka.height = o.h;
    }
    const g = platnoPoudarka.getContext("2d");
    g.putImageData(z.polnilo, 0, 0);
    const m = zaslonNaPikselObrisa() || 0.5;
    merilObrisa = m;
    const bela = Math.max(1.2, Math.min(14, 2.4 / m)), temna = Math.max(2.4, Math.min(24, 5 / m));
    const c = o.crte;
    if (c?.length) {
      g.beginPath();
      for (let k = 0; k < c.length; k += 4) { g.moveTo(c[k], c[k + 1]); g.lineTo(c[k + 2], c[k + 3]); }
      g.lineCap = g.lineJoin = "round";
      g.strokeStyle = "rgba(8,12,20,0.72)"; g.lineWidth = temna; g.stroke();
      g.strokeStyle = "rgba(255,255,255,0.96)"; g.lineWidth = bela; g.stroke();
    }
    texPoudarka.needsUpdate = true;
    poudarek.visible = true;
  }
  function preveriDebelinoObrisa() {
    if (!zadnjiObris || !poudarek.visible) return;
    const m = zaslonNaPikselObrisa();
    if (m && merilObrisa && Math.abs(Math.log(m / merilObrisa)) > 0.35) { risiObris(); narisi(); }
  }

  // Fotografija rezine (ostra slika 1 mm) v velikosti povečane mreže oznak: (X, Y) → false, če je tam maščoba.
  // Brez ostre slike (še se nalaga, napaka CORS) null: obris ostane po mreži oznak.
  function vzorecTkiva(w, h) {
    const im = ostraZa === kljuc() ? ostra.material.map?.image : null;
    if (!im) return null;
    try {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(im, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data;
      return (X, Y) => {
        const k = (Y * w + X) * 4;
        return d[k + 3] < 128 || !R.jeMascoba(d[k], d[k + 1], d[k + 2]);
      };
    } catch {
      return null;
    }
  }

  // Svetlost fotografije (ostra slika) po celicah mreže oznak: (x, y) → 0–255; brez ostre slike null.
  function svetlostCelic(w, h) {
    const im = ostraZa === kljuc() ? ostra.material.map?.image : null;
    if (!im) return null;
    try {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(im, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data;
      return (x, y) => { const k = (y * w + x) * 4; return 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]; };
    } catch {
      return null;
    }
  }

  // --- začetne lege: prečno skozi srce; na OŠ frontalno in sagitalno skozi desno ledvico (ne skozi sredino telesa)
  function zacetneLege(dim, ozn, meta, mali) {
    const n = (sm) => R.steviloRezin(dim, sm);
    const lege = { a: Math.round(dim[2] < 400 ? dim[2] / 2 : n("a") * 0.24), k: R.najpolnejsaRezina(mali, "k") ?? Math.round(n("k") * 0.5), s: Math.round(n("s") * 0.5) };
    const os = { k: Math.round(n("k") * 0.62), s: Math.round(n("s") * 0.36) };
    if (ozn) {
      const kl = meta.oznake.kljuci;
      const srce = R.sredisce(ozn, kl.indexOf("levi-prekat") + 1);
      if (srce) lege.a = Math.round(srce[2]);
      const led = R.sredisce(ozn, (kl.indexOf("desna-ledvica") + 1) || (kl.indexOf("ledvica") + 1), (x) => x < dim[0] / 2);
      if (led) { os.k = Math.round(led[1]); os.s = Math.round(led[0]); }
    }
    return { lege, os };
  }

  // --- nalaganje telesa (zahteva: hitra menjava teles ne pomeša podatkov – velja le zadnja)
  let zahteva = 0, zacetne = null;
  async function nalozi(spol) {
    const moja = ++zahteva;
    const url = new URL(kazalo.telesa[spol], osnova).href;
    const meta = await json(url + "meta.json");
    ctx.napredek?.(0.2);
    const list = await slika(url + meta.mali.datoteka);
    const c = document.createElement("canvas");
    c.width = list.naturalWidth; c.height = list.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(list, 0, 0);
    const mali = R.maliIzLista(g.getImageData(0, 0, c.width, c.height).data, c.width, meta.mali);
    ctx.napredek?.(0.6);
    let ozn = null;
    if (meta.oznake) {
      try {
        const buf = await fetch(url + meta.oznake.datoteka).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))));
        const [W, H, Z] = meta.oznake.dim;
        ozn = { dim: meta.oznake.dim, mm: meta.oznake.mm, data: R.razpakirajOznake(buf, W * H * Z) };
      } catch (err) {
        console.warn("3D rezine: oznake niso na voljo", err);
      }
    }
    if (moja !== zahteva) return false; // medtem je bilo izbrano drugo telo
    const dim = meta.dim;
    // površje telesa (zaprto, brez lukenj v koži in z ločenimi prsti: R.povrsje pripravi polje iz alfe)
    const p = R.povrsje(mali, telefon || mali.dim[0] * mali.dim[1] * mali.dim[2] > 6e6 ? 2 : 1);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(p.pos.length);
    for (let k = 0; k < p.pos.length; k += 3) {
      pos[k] = p.pos[k]; pos[k + 1] = -p.pos[k + 2]; pos[k + 2] = -p.pos[k + 1];
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const barve = new Float32Array(p.col.length);
    const cc = new THREE.Color();
    for (let k = 0; k < barve.length; k += 3) {
      cc.setRGB(p.col[k], p.col[k + 1], p.col[k + 2], THREE.SRGBColorSpace);
      barve[k] = cc.r; barve[k + 1] = cc.g; barve[k + 2] = cc.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(barve, 3));
    geo.setIndex(new THREE.BufferAttribute(p.idx, 1));
    geo.computeVertexNormals();
    if (telo) {
      notranja.remove(telo);
      telo.geometry.dispose();
    }
    telo = new THREE.Mesh(geo, matTelesa);
    telo.raycast = () => {}; // tap vedno zadene rezino, ne (odrezanega) telesa
    notranja.add(telo);
    // postavitev v kroglo s polmerom 1 (središče volumna v izhodišču)
    const [W, H, Z] = dim, sk = 2 / Math.hypot(W, H, Z);
    notranja.scale.setScalar(sk);
    T = { meta, url, mali, ozn, dim, vzorec: !!meta.vzorec || meta.od > 1001 };
    await naloziOrgane3D(url, meta, moja);
    if (moja !== zahteva) return false;
    stanje.spol = spol;
    deliPoId.clear();
    stanje.izbrana = "";
    tapUV = null;
    zacetne = zacetneLege(dim, ozn, meta, mali);
    for (const sm of R.SMERI) {
      const z = Number(ctx.zacetek?.[`rezina-${sm}`]);
      stanje.i[sm] = pripni(sm, Number.isFinite(z) && ctx.zacetek?.[`rezina-${sm}`] != null ? z : sm !== "a" && os() ? zacetne.os[sm] : zacetne.lege[sm]);
      stanje.premaknjeno[sm] = false;
    }
    if (T.vzorec) stanje.smer = "a"; // vzorec je le nekaj cm prsnega koša: frontalni in sagitalni prerez bi bil ozek trak
    uskladiTelo();
    ostraZa = "";
    napakaNalaganja = "";
    postaviRezino();
    ctx.napredek?.(1);
    return true;
  }
  // 3D organi (meta.telo3d iz rezine_telo3d.py): telefon dobi lažjo različico. Napaka ne podre rezin (ostane površje).
  async function naloziOrgane3D(url, meta, moja) {
    if (organi3d) { notranja.remove(organi3d.skupina); organi3d.dispose(); organi3d = null; }
    const t3 = meta.telo3d;
    if (!t3) return;
    try {
      const [inf, koren] = await Promise.all([
        json(url + (t3.json || "telo3d.json")),
        ctx.naloziGLB(url + (telefon ? t3.telefon || "telo3d-telefon.glb" : t3.racunalnik || "telo3d.glb"), (a, b) => b && ctx.napredek?.(0.6 + (0.35 * a) / b)),
      ]);
      if (moja !== zahteva) return;
      const { tkivo } = await import("../../tkiva.js"); // atlasove barve organov (tkiva.js uvozi sceno: šele tu, ne v Node)
      const barve = new Map();
      organi3d = V.zgradiTelo3D(THREE, koren, inf, {
        ravnina, telefon,
        barvaZa: (kl) => barve.get(kl) || barve.set(kl, kl === "koza" ? new THREE.Color("#e5b79e") : tkivo(V.vrsticaAtlasa(kl)).barva).get(kl),
        imeZa: (kl) => R.opisOznake(imena, kl)?.sl || kl,
        imeSistema: (id) => t(`a3.rez.sys.${id}`, V.SISTEMI.find((x) => x.id === id)?.os || id),
      });
      notranja.add(organi3d.skupina);
      // preizkusi (Playwright, DOM): zaslonska točka strukture, da tap zadene 3D organ; le z localStorage evklid.3d.test
      try {
        if (globalThis.localStorage?.getItem(R.KLJUC_KAZALA.replace(/rezine$/, "test"))) globalThis.__k3test = { tocka: tockaStrukture, stanje };
      } catch {}
    } catch (err) {
      console.warn("3D rezine: 3D organov ni bilo mogoče naložiti", err?.message || err);
      organi3d = null;
    }
  }

  // Zaslonska točka (px CSS na platnu) vidnega dela strukture: najbližje oglišče središču okvirja, ki ni odrezano.
  function tockaStrukture(kl) {
    const m = organi3d?.mreze.get(kl);
    if (!m || !zadnjaKamera) return null;
    m.updateMatrixWorld(true);
    const pos = m.geometry.attributes.position, v = new THREE.Vector3();
    m.geometry.computeBoundingBox();
    const c = m.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(m.matrixWorld);
    let best = null, bd = Infinity;
    for (let k = 0; k < pos.count; k += 7) {
      v.fromBufferAttribute(pos, k).applyMatrix4(m.matrixWorld);
      if (ravnina.distanceToPoint(v) < 2 * notranja.scale.x && !(stanje.razmik > 0)) continue;
      const d = v.distanceToSquared(c);
      if (d < bd) { bd = d; best = v.clone(); }
    }
    if (!best) return null;
    const p = best.project(zadnjaKamera);
    return [((p.x + 1) / 2) * sirinaPlatna, ((1 - p.y) / 2) * visinaPlatna];
  }

  // telo z napako podatkov (npr. mali.webp ženske) → najprej drugo telo, šele nato vzorec
  const opozori = (s, err) => console.warn(`3D rezine: telesa ${s} ni bilo mogoče naložiti`, err?.message || err);
  const izpusti = (ne) => {
    mete = mete.filter((_, j) => !ne.includes(spoli[j]));
    spoli = spoli.filter((s) => !ne.includes(s));
  };
  await R.prvoTelo(spoli, stanje.spol, nalozi, opozori).then(({ neuspela }) => izpusti(neuspela), async (err) => {
    await naRezervo(err);
    if (!spoli.includes(stanje.spol)) stanje.spol = spoli[0];
    await nalozi(stanje.spol);
  });

  const drsniki = {};
  const drsnik = (sm) => (drsniki[sm] = {
    tip: "drsnik", id: `rezina-${sm}`, oznaka: t("a3.rez.position", "Lega rezine"), // en napis za vse ravni in vzorec (ocena A, krog 5)
    izpis: (v) => lega(sm, pripni(sm, v)), min: 0, max: Math.max(1, najvec(sm)), korak: 1,
    vrednost: stanje.i[sm], gumba: { korak: 1, manj: () => (os() ? t("a3.rez.prev", "Prejšnja rezina") : "−1 mm"), vec: () => (os() ? t("a3.rez.next", "Naslednja rezina") : "+1 mm") }, lepljiv: true,
    vidno: () => stanje.smer === sm,
    ob: (v) => {
      stanje.i[sm] = pripni(sm, v);
      stanje.premaknjeno[sm] = true;
      if (stanje.i[sm] !== Math.round(v)) drsniki[sm].vrednost = stanje.i[sm];
      postaviRezino();
    },
  });
  const sinhroniziraj = () => {
    for (const sm of R.SMERI) drsniki[sm].vrednost = stanje.i[sm];
    nSmer.vrednost = stanje.smer; nPogled.vrednost = stanje.pogled; nTelo.vrednost = stanje.telo; nRaven.vrednost = stanje.raven;
    if (nSpol) nSpol.vrednost = stanje.spol;
  };
  // anatomska raven prečne rezine: vretence v tej višini (meta.oznake.ravni iz mrež HRA, npr. »Th8«)
  // OŠ: samo predel telesa (»v višini prsnega koša«), brez vretenca in milimetrov; drsnik ga pokaže namesto števila
  const lega = (smer = stanje.smer, i = stanje.i[smer]) => R.besediloLege({ smer, i, vzorec: T.vzorec, ravni: T.meta.oznake?.ravni, os: os(), n: R.steviloRezin(T.dim, smer) }, t, document.documentElement.lang || "sl");

  const nRaven = { tip: "izbira", id: "raven", oznaka: t("a3.detail", "Podrobnost"), moznosti: [[1, t("a3.levelOS", "OŠ")], [2, t("a3.levelSS", "SŠ")], [3, t("a3.levelAll", "Vse")]], vrednost: stanje.raven, ponastaviPogled: true,
    ob: (v) => {
      stanje.raven = Number(v) || 1;
      stanje.nacin = V.privzetNacin(stanje.raven);
      nNacin.vrednost = stanje.nacin;
      stanje.slog = privzetSlog(stanje.raven);
      nVidez.vrednost = stanje.slog;
      deliPoId.clear();
      stanje.izbrana = "";
      if (os()) {
        // OŠ: nazaj na prečni prerez naravnost, brez telesa okoli rezine; frontalni in sagitalni izven sredine (če ju ni premaknil)
        Object.assign(stanje, R.pogledZaRaven(1));
        for (const sm of ["k", "s"]) if (!stanje.premaknjeno[sm] && zacetne) stanje.i[sm] = pripni(sm, zacetne.os[sm]);
      }
      sinhroniziraj();
      postaviRezino();
    } };
  const nSpol = spoli.length > 1 ? { tip: "izbira", id: "telo", oznaka: t("a3.body", "Telo"), moznosti: spoli.map((s) => [s, s === "z" ? t("a3.rez.female", "Ženska") : t("a3.rez.male", "Moški")]), vrednost: stanje.spol, ponastaviPogled: true,
    ob: (v) => {
      // isto telo (npr. začetna vrednost »telo« iz naslova, ki jo pregledovalnik nastavi po gradnji): brez ponovnega nalaganja
      if (v === stanje.spol && T && !napakaNalaganja) return;
      nalozi(v).then((ok) => {
        if (ok) sinhroniziraj();
        ctx.napredek?.(null); // plast »Nalagam« po menjavi telesa izgine (sicer bi ostala na 100 %)
        narisi();
      }, (err) => {
        ctx.napredek?.(null);
        console.error("3D rezine", err);
        napakaNalaganja = t("a3.loadError", "Tega dela ni bilo mogoče naložiti. Preveri povezavo in poskusi znova.");
        zadnjeTelo = v;
        narisi();
      });
    } } : null;
  let zadnjeTelo = "";
  const nSmer = { tip: "izbira", id: "smer", oznaka: t("a3.rez.direction", "Smer prereza"), moznosti: R.SMERI.map((s) => [s, t(`a3.rez.dir.${s}`, IMENA_SMERI[s])]), vrednost: stanje.smer, vidno: () => !T.vzorec, ponastaviPogled: true,
    ob: (v) => {
      stanje.smer = v;
      stanje.izbrana = "";
      tapUV = null;
      postaviRezino();
    } };
  const nPogled = { tip: "izbira", id: "pogled", oznaka: t("a3.view", "Pogled"), moznosti: [["3d", t("a3.rez.view3d", "V telesu")], ["ravno", t("a3.rez.viewFlat", "Naravnost na rezino")]], vrednost: stanje.pogled, ponastaviPogled: true,
    ob: (v) => {
      stanje.pogled = v;
      postaviRezino();
    } };
  const nTelo = { tip: "stikalo", id: "telo3d", oznaka: t("a3.rez.showBody", "Telo okoli rezine"), vrednost: stanje.telo, vidno: () => stanje.pogled !== "ravno",
    ob: (v) => {
      stanje.telo = !!v;
      uskladiTelo();
      narisi();
    } };

  // »Jasen prikaz« / »Prava razmerja« (OŠ, SŠ: jasno; fakulteta: prava). Odstopanje je vedno označeno (izpis pod izbiro).
  const nNacin = { tip: "izbira", id: "velikosti", oznaka: t("a3.rez.display", "Velikosti"), moznosti: [["jasno", t("a3.rez.clear", "Jasen prikaz")], ["prava", t("a3.rez.exact", "Prava razmerja")]], vrednost: stanje.nacin,
    vidno: () => !!organi3d,
    ob: (v) => { stanje.nacin = v === "prava" ? "prava" : "jasno"; uskladiTelo(); narisi(); } };
  const nVidez = { tip: "izbira", id: "videz", oznaka: t("a3.rez.slice", "Rezina"), vrednost: stanje.slog,
    moznosti: [["s1", t("a3.rez.sliceOrgans", "Barve po organih")], ["s2", t("a3.rez.sliceReal", "Realistično")], ["s3", t("a3.rez.slicePhoto", "Prava fotografija")]],
    vidno: () => !!T?.meta?.slogi,
    ob: (v) => { stanje.slog = SLOGI.includes(v) ? v : ""; ostraZa = ""; pocistiPloscice(); postaviRezino(); } };
  const nOpomba = { tip: "izpis", id: "jasno", oznaka: "", vidno: () => !!organi3d && stanje.nacin === "jasno", vrednost: () => t("a3.rez.clearNote", "Prikaz poenostavljen za jasnost") };
  // »Razmakni strukture« (j, 21:59): 0–0,5 razmik na mestu, 0,5–1 police po sistemih in velikosti. Kamera se premakne le,
  // ko se spremeni vrsta pogleda (telo ↔ police), ne ob vsakem premiku drsnika.
  let bilePolice = false;
  const nastaviRazmik = (v) => {
    stanje.razmik = Math.max(0, Math.min(1, Number(v) || 0));
    nRazmik.vrednost = stanje.razmik;
    if (stanje.razmik > 0 && stanje.izbrana && !organi3d?.mreze.has(stanje.izbrana) && !kljuciIzbire(stanje.izbrana).length) stanje.izbrana = "";
    uskladiTelo();
    narisi();
  };
  const nRazmik = { tip: "drsnik", id: "razmik", oznaka: t("a3.explode", "Razmakni strukture"), min: 0, max: 1, korak: 0.01, vrednost: 0,
    izpis: (v) => `${Math.round(v * 100)} %`, vidno: () => !!organi3d,
    ponastaviPogled: (v) => { const p = V.fazaRazmika(v).police > 0.5; const sprememba = p !== bilePolice; bilePolice = p; return sprememba; },
    ob: (v) => nastaviRazmik(v) };
  const nRentgen = { tip: "stikalo", id: "rentgen", oznaka: t("a3.xray", "Rentgen"), vrednost: stanje.rentgen, vidno: () => !!organi3d && stanje.pogled !== "ravno",
    ob: (v) => { stanje.rentgen = !!v; uskladiTelo(); narisi(); } };

  return {
    group,
    get deli() { return seznamDelov; },
    odizberi() {
      stanje.izbrana = "";
      tapUV = null;
      narisiPoudarek();
      uskladiTelo();
      narisi();
    },
    nadzor: [
      nRaven,
      ...(nSpol ? [nSpol] : []),
      nSmer,
      drsnik("a"), drsnik("k"), drsnik("s"),
      nPogled,
      nTelo,
      nVidez,
      nRentgen,
      nNacin,
      nOpomba,
      nRazmik,
      { tip: "izpis", id: "stanje", oznaka: t("a3.rez.status", "Stanje"), vidno: () => !!napakaNalaganja, vrednost: () => napakaNalaganja },
      { tip: "gumb", id: "znova", oznaka: t("task.retry", "Poskusi znova"), vidno: () => !!napakaNalaganja,
        ob: () => {
          napakaNalaganja = ""; ponovi = ""; napakePloscic = 0; manjkajoce.clear(); poskusiPloscic.clear(); zacasnoDo.clear();
          if (zadnjeTelo && zadnjeTelo !== stanje.spol) return nSpol?.ob(zadnjeTelo);
          naloziOstro();
          naloziPloscice();
        } },
    ],
    navedba: { besedilo: NAVEDBA, opomba: t("a3.rez.notCurrent", "Podatki niso nujno najnovejši ali najnatančnejši; NLM Evklida ne podpira in ne priporoča.") },
    // »Poskusi:« glede na smer in predel rezine (ne »prsni koš« pri frontalnem prerezu ali v trebuhu)
    poskusi: () => (T ? R.poskusiZa(stanje.smer, R.predelRezine({ smer: stanje.smer, i: stanje.i[stanje.smer], n: R.steviloRezin(T.dim, stanje.smer), ravni: T.meta.oznake?.ravni, vzorec: T.vzorec })) : ""),
    // besedilna različica platna za bralnike zaslona: smer, lega in največje strukture na rezini
    opisPlatna: () => [info.naslov, t(`a3.rez.dir.${stanje.smer}`, IMENA_SMERI[stanje.smer]), lega(), seznamDelov.slice(0, 8).map((d) => d.ime).join(", ")].filter(Boolean).join(" · "),
    merilo: () => {
      const m = Math.hypot(...T.dim) / 1000;
      return { m, oznaka: `${m.toFixed(1).replace(".", ",")} m` };
    },
    pogled: () => {
      if (organi3d?.meje()) return [0, 0, 1];
      const s = stanje.smer, r = stanje.pogled === "ravno";
      if (s === "a") return r ? [0, -1, 0.06] : organi3d ? [0.5, 0.42, 1] : [0.35, 0.8, 1]; // z organi: bolj od spredaj, da se vidijo pod ravnino
      if (s === "k") return r ? [0, 0.02, 1] : [0.3, 0.12, 1];
      return r ? [1, 0.02, 0] : [1, 0.12, 0.45];
    },
    okvir: () => {
      const pm = organi3d?.meje();
      if (pm) {
        // police: središče v mm okvirja → lokalne koordinate rezin (x, −z, −y) → svet
        notranja.updateMatrixWorld(true);
        const c = notranja.localToWorld(new THREE.Vector3(pm.sredisce[0], -pm.sredisce[2], -pm.sredisce[1]));
        return { sredisce: c.toArray(), polmer: pm.polmer * notranja.scale.x };
      }
      const s = stanje.smer, [w, h] = R.velikostRezine(T.dim, s), sc = notranja.scale.x;
      if (s !== "a" && stanje.pogled !== "ravno") return { sredisce: [0, 0, 0], polmer: 1 };
      // polmer iz vsebine rezine (glava je manjša od trupa), da rezina zapolni okno; oznake smeri se pripnejo na rob odra
      const ew = (vsebina.u1 - vsebina.u0) * w * sc, eh = (vsebina.v1 - vsebina.v0) * h * sc;
      // naravnost: pravokotnik vsebine (postaviRezino jo postavi na sredino), ki zapolni 90 % odra (ocena B: ≥ 85 % pri 360 px)
      if (stanje.pogled === "ravno") {
        return { sredisce: [0, 0, 0], polmer: (Math.max(ew, eh) / 2) * 1.12, pravokotnik: [ew, eh], zapolni: 0.9 };
      }
      if (organi3d && T.meta.telo3d?.z) {
        // izrez (prsni koš): kader okoli izreza, ne okoli celega volumna
        const [z0, z1] = T.meta.telo3d.z, s0 = notranja.scale.x, iz = stanje.i.a;
        const cy = ((iz - (z0 + z1) / 2) * s0);
        return { sredisce: [0, cy, 0], polmer: Math.max(ew, eh, (z1 - z0) * s0) * 0.72 };
      }
      return { sredisce: [0, 0, 0], polmer: (Math.hypot(ew, eh) / 2) * 1.9 };
    },
    namigOder: false, // namig »Povleci za vrtenje …« bi na telefonu prekril rezino, oznako smeri in merilo (ocena A in B, krog 5)
    // povečava do ploščic 0,33 mm, a ne čez mero podatkov: telefon največ 1,6-kratna povečava pikslov naprave (ocena A,
    // krog 6: pri DPR 2 je bila slika mehka), računalnik 3-kratna (R.najblizjeZa)
    get najblizje() {
      if (!T?.meta?.podrobno) return 0.1; // vzorec in telesa brez ploščic: kot prej
      return R.najblizjeZa({ sk: notranja.scale.x, mm: 0.33, visina: telefon ? 420 : 700, telefon, dpr: globalThis.devicePixelRatio || 1 });
    },
    ao: () => false,
    izberi(id, hit) {
      if (hit?.object?.userData?.kljuc) {
        // dotik 3D strukture: prvi dotik dela (levi prekat) → del z napisom »Del: Srce«, drugi dotik istega dela → celo srce
        const surov = hit.object.userData.kljuc;
        const kl = surov === "koza" ? "" : R.kljucZaRaven(imena, surov, os());
        if (!kl) return null;
        const cel = V.celotaZa(kl), celD = cel ? delKljuca(cel) : null;
        let izb = kl;
        if (celD && stanje.izbrana === kl) izb = cel;
        else if (celD && stanje.izbrana === cel) izb = cel; // tretji dotik: pregledovalnik izbiro prekliče
        const d = delKljuca(izb);
        if (!d) return null;
        d.nad = izb === kl && celD ? t("a3.rez.partOf", "Del: {ime}").replace("{ime}", celD.ime) : "";
        stanje.izbrana = d.kljuc;
        tapUV = null;
        osveziDele();
        narisiPoudarek();
        uskladiTelo();
        narisi();
        return d.id;
      }
      if (hit) {
        if (hit.object !== ploskev) return null;
        const p = notranja.worldToLocal(hit.point.clone());
        // ime samo tam, kjer ga mreža oznak res pozna: brez ugibanja po barvi (bolje brez imena kot napačno)
        const oz = T.ozn ? R.oznakaV(T.ozn, p.x, -p.z, -p.y) : 0;
        // starejše oznake brez posameznih vretenc: raven iz višine dotika (meta.oznake.ravni)
        const kl = oz ? kljucOznake(oz) : "", v = R.vretence(kl);
        const rv = v && !v.raven ? R.ravenPri(T.meta.oznake.ravni, -p.y, VRSTA_VRETENCA[v.osnova]) : "";
        const d = oz ? delKljuca(kl, rv) : null;
        stanje.izbrana = d ? d.kljuc : "";
        if (d) { const cel = V.celotaZa(d.kljuc), celD = cel ? delKljuca(cel) : null; d.nad = celD ? t("a3.rez.partOf", "Del: {ime}").replace("{ime}", celD.ime) : ""; }
        tapUV = d ? R.uvTocke(T.dim, stanje.smer, [p.x, -p.z, -p.y]) : null;
        osveziDele();
        narisiPoudarek();
        uskladiTelo();
        narisi();
        return d ? d.id : null;
      }
      const d = seznamDelov.find((x) => x.id === id);
      stanje.izbrana = d ? d.kljuc : "";
      tapUV = null;
      narisiPoudarek();
      uskladiTelo();
      narisi();
      return id;
    },
    dispose() {
      clearTimeout(uraOstre); clearTimeout(uraPloscic); clearTimeout(uraKamere); clearTimeout(uraPonovitve);
      zahteva++;
      pocistiPloscice();
      for (const tx of predpomnilnik.values()) tx.dispose();
      texMala.dispose(); texPoudarka.dispose(); texRoba.dispose(); geoRezine.dispose(); matTelesa.dispose();
      organi3d?.dispose();
      telo?.geometry.dispose();
    },
  };
}
