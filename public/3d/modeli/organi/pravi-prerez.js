// »Pravi prerez«: fotografije pravih prerezov človeškega telesa (barvne kriorezine) v 3D. Drsnik premika ravnino v treh
// smereh, preklop ženska/moški, dotik na rezini pove slovensko ime strukture (mreža oznak iz modelov HuBMAP HRA).
// Telo okoli rezine je površje istega volumna, zato se prerez in telo natančno ujemata; rez pokaže pravo tkivo.
// Podatki: public/3d/rezine/kazalo.json → mape teles (meta.json, mali.webp, a|k|s/<i>.webp, p/…, oznake.bin); pripravi jih
// scripts/atlas/rezine.py in rezine_oznake.py (docs/3d.md »Pravi prerez telesa«).
// Najprej uvodni zaslon (kaj gledaš, darovano telo); prerezi se pokažejo šele po izbiri. Raven OŠ (privzeta): telo je
// celo, začetek je prečni prerez prsnega koša naravnost na rezino (zunanja površina telesa ni v ospredju),
// imena so preprostejša (rezine-oznake.json »os«). Izjema od pravila »brez omrežja«: model bere
// samo te podatke. Nalaganje: najprej mali volumen (4 mm, vse smeri takoj), nato ostra rezina 1 mm za mirujoči drsnik,
// ob povečavi še ploščice 0,33 mm samo za vidni del.
// Vir fotografij: Courtesy of the U.S. National Library of Medicine (pogoji v public/3d/modeli/organi/viri.json).
import * as R from "../../rezine.js";

export const info = {
  id: "organ-pravi-prerez",
  naslov: "Pravi prerez telesa",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Fotografije pravih prerezov človeškega telesa. Courtesy of the U.S. National Library of Medicine; podatki niso nujno najnovejši ali najnatančnejši, NLM Evklida ne podpira in ne priporoča.",
  poskusi: "Premakni drsnik skozi prsni koš in se dotakni srca, pljuč ali vretenca na rezini.",
  merilo: { m: 1.8, oznaka: "1,8 m" },
};

const NAVEDBA = "Courtesy of the U.S. National Library of Medicine";
const IMENA_SMERI = { a: "Prečno", k: "Frontalno", s: "Sagitalno" };

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

// Model bere podatke iz datotek (canvas, slike): testi pogodbe v Node ga ne gradijo (test/3d-rezine.test.js preveri pomožne funkcije).
export const izDatotek = true;

export async function zgradi(THREE, ctx) {
  const t = (k, sl) => {
    const v = ctx.t ? ctx.t(k) : k;
    return !v || v === k ? sl : v;
  };
  const koren = new URL("../../rezine/", import.meta.url).href;
  let kazalo;
  try {
    kazalo = JSON.parse(globalThis.localStorage?.getItem("evklid.3d.rezine") || "null");
  } catch {}
  kazalo ||= await json(koren + "kazalo.json");
  const imena = await json(new URL("../../rezine-oznake.json", import.meta.url).href);
  const osnova = new URL(kazalo.osnova || "./", koren).href;
  const spoli = Object.keys(kazalo.telesa);
  const telefon = ctx.kakovost !== "visoka";
  // največje število rezin po smereh čez vsa telesa (drsnik ima eno območje; vrednost se pripne na izbrano telo)
  const mete = await Promise.all(spoli.map((s) => json(new URL(kazalo.telesa[s], osnova).href + "meta.json")));
  const najvec = (sm) => Math.max(...mete.map((m) => R.steviloRezin(m.dim, sm))) - 1;

  const group = new THREE.Group();
  const notranja = new THREE.Group(); // koordinate v mm volumna, postavljena v kroglo s polmerom 1
  group.add(notranja);
  const ravnina = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const ravenZ = Number(ctx.zacetek?.raven);
  const stanje = { raven: [1, 2, 3].includes(ravenZ) ? ravenZ : 1, odprto: false, spol: ctx.zacetek?.telo && spoli.includes(ctx.zacetek.telo) ? ctx.zacetek.telo : spoli[0], smer: ctx.zacetek?.smer || "a", i: { a: 0, k: 0, s: 0 }, telo: true, pogled: ([1, 2, 3].includes(ravenZ) ? ravenZ : 1) === 1 ? "ravno" : "3d", izbrana: 0 };
  let T = null; // naloženo telo: { meta, url, mali, ozn, dim }
  let napakaNalaganja = "", ponovi = "";
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
  const mat = (map, red) => {
    const m = new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide, toneMapped: false, depthWrite: red === 0, alphaTest: red === 0 ? 0.35 : 0, polygonOffset: red > 0, polygonOffsetFactor: -red, polygonOffsetUnits: -red * 2 });
    return m;
  };
  const ploskev = new THREE.Mesh(geoRezine, mat(texMala, 0));
  const ostra = new THREE.Mesh(geoRezine, mat(null, 1));
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
  ploskev.renderOrder = 1; ostra.renderOrder = 2; skupinaPloscic.renderOrder = 3; poudarek.renderOrder = 5;
  notranja.add(ploskev, ostra, skupinaPloscic, poudarek);
  ploskev.onBeforeRender = (renderer, _s, kamera) => {
    zadnjaKamera = kamera;
    visinaPlatna = renderer.domElement.clientHeight || 800;
    // kamera se je premaknila (povečava, vrtenje): ko se umiri, preveri, katere ploščice so na zaslonu
    const kk = kamera.position.toArray().concat(kamera.quaternion.toArray(), kamera.zoom).map((x) => x.toFixed(3)).join();
    if (kk !== kljucKamere) {
      kljucKamere = kk;
      clearTimeout(uraKamere);
      uraKamere = setTimeout(naloziPloscice, 350);
    }
  };

  // --- oznake smeri ob rezini (desno/levo telesa, spredaj/zadaj): ob robu vsebine, nikoli čez tkivo
  const napis = (besedilo) => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 64;
    const g = c.getContext("2d");
    g.font = "600 34px 'Instrument Sans', system-ui, sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillStyle = "rgba(214,224,240,0.92)";
    g.fillText(besedilo, 128, 34);
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false, transparent: true, toneMapped: false }));
    sp.raycast = () => {};
    sp.renderOrder = 6;
    return sp;
  };
  const smeri = { d: napis(t("a3.rez.right", "desno")), l: napis(t("a3.rez.left", "levo")), s: napis(t("a3.rez.front", "spredaj")), z: napis(t("a3.rez.back", "zadaj")) };
  const skupinaSmeri = new THREE.Group();
  skupinaSmeri.add(...Object.values(smeri));
  notranja.add(skupinaSmeri);
  function postaviOznakeSmeri() {
    const s = stanje.smer, i = stanje.i[s], { dim } = T;
    skupinaSmeri.visible = stanje.pogled === "ravno";
    const [wr, hr] = R.velikostRezine(dim, s);
    const vel = Math.max(60, Math.min((vsebina.u1 - vsebina.u0) * wr, (vsebina.v1 - vsebina.v0) * hr) * 0.34); // širina napisa v mm volumna
    for (const sp of Object.values(smeri)) sp.scale.set(vel, vel / 4, 1);
    const { u0, v0, u1, v1 } = vsebina, rob = vel * 0.42;
    const na = (sp, u, v, du, dv) => {
      const q = R.tockaRezine(dim, s, i, u, v);
      const p = R.tockaRezine(dim, s, i, u + du / wr, v + dv / hr);
      vMm(p[0], p[1], p[2], sp.position);
      sp.visible = true;
      return q;
    };
    for (const sp of Object.values(smeri)) sp.visible = false;
    const cv = (v0 + v1) / 2, cu = (u0 + u1) / 2;
    if (s === "a") {
      na(smeri.d, u0, cv, -rob * 1.3, 0); na(smeri.l, u1, cv, rob * 1.3, 0); na(smeri.s, cu, v0, 0, -rob * 0.5); na(smeri.z, cu, v1, 0, rob * 0.5);
    } else if (s === "k") {
      na(smeri.d, u0, Math.min(cv, 0.3), -rob * 1.3, 0); na(smeri.l, u1, Math.min(cv, 0.3), rob * 1.3, 0);
    } else {
      na(smeri.s, u0, Math.min(cv, 0.3), -rob * 1.5, 0); na(smeri.z, u1, Math.min(cv, 0.3), rob * 1.5, 0);
    }
  }

  // --- telo okoli rezine
  const matTelesa = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0, clippingPlanes: [ravnina], side: THREE.FrontSide });
  let telo = null, vsebina = { u0: 0, v0: 0, u1: 1, v1: 1 };

  const vMm = (x, y, z, v = new THREE.Vector3()) => v.set(x, -z, -y); // mm volumna → krajevne koordinate (Y gor, +Z spredaj)

  function postaviRezino() {
    const { dim } = T, s = stanje.smer, i = stanje.i[s];
    // prečna rezina ostane na sredini odra: telo drsi skozi ravnino (kamera miruje, rezina je velika)
    const [Wd, Hd, Zd] = dim, sc = notranja.scale.x;
    const m = R.rezinaMalega(T.mali, s, Math.floor(i / T.mali.mm));
    vsebina = R.okvirVsebine(m) || { u0: 0, v0: 0, u1: 1, v1: 1 };
    // prečna rezina: vsebina (npr. glava) na sredini odra, da zapolni okno
    const cu = (vsebina.u0 + vsebina.u1) / 2, cv = (vsebina.v0 + vsebina.v1) / 2;
    notranja.position.set(-(s === "a" ? cu : 0.5) * Wd * sc, (s === "a" ? i + 0.5 : Zd / 2) * sc, (s === "a" ? cv : 0.5) * Hd * sc);
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
    if (telo) telo.visible = stanje.telo && stanje.pogled !== "ravno"; // pogled naravnost je čista rezina kot v atlasu
    ostra.visible = ostraZa === kljuc();
    pocistiPloscice();
    clearTimeout(uraOstre); clearTimeout(uraPloscic);
    uraOstre = setTimeout(naloziOstro, 140);     // drsnik miruje: ostra rezina 1 mm
    uraPloscic = setTimeout(naloziPloscice, 450); // nato ploščice, če je rezina povečana
    osveziDele();
    narisiPoudarek();
    narisi();
  }
  const os = () => stanje.raven === 1; // raven OŠ: preprostejša imena, privzeto pogled naravnost na rezino
  const pripni = (sm, v) => Math.max(0, Math.min(R.steviloRezin(T.dim, sm) - 1, Math.round(v)));
  const kljuc = () => `${stanje.spol}/${stanje.smer}/${stanje.i[stanje.smer]}`;

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
    tekstura(`${T.url}${s}/${stanje.i[s]}.webp`).then(
      (tx) => {
        if (k !== kljuc()) return;
        ostra.material.map = tx;
        ostra.material.needsUpdate = true;
        ostra.visible = true;
        ostraZa = k;
        napakaNalaganja = "";
        narisi();
      },
      () => {
        // en ponovni poskus čez 2 s, nato sporočilo (brez povezave ostane slika nizke ločljivosti)
        if (k !== kljuc()) return;
        if (ponovi !== k) {
          ponovi = k;
          uraOstre = setTimeout(naloziOstro, 2000);
        } else {
          napakaNalaganja = t("a3.rez.offline", "Podatkov ni bilo mogoče naložiti. Preveri povezavo in poskusi znova.");
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
      const raven = naZaslonu > (telefon ? 420 : 330) ? 0 : naZaslonu > 190 ? 1 : -1;
      if (raven >= 0) potrebne.set(`${raven}/${pl.ime}`, { pl, lok, u1, v1 });
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
      tekstura(`${T.url}p/${s}/${kl}.webp`).then(
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
          narisi();
        },
        () => {},
      );
    }
  }

  // --- deli: strukture na trenutni rezini (seznam ob modelu) in poudarek izbrane
  // del za oznako mreže; na ravni OŠ preprostejše skupno ime (ali nič, če ga za to raven ni)
  function del(id) {
    const izv = T.meta.oznake.kljuci[id - 1];
    const kl = os() ? imena.os[izv] : izv;
    if (!kl) return null;
    if (deliPoId.has(kl)) return deliPoId.get(kl);
    const o = imena.oznake[kl];
    if (!o) return null;
    const d = { id: `o-${kl}`, ime: o.sl, la: o.la, opis: o.opis, barva: o.barva, meshes: [], tocka: [0, 0, 0], kljuc: kl };
    deliPoId.set(kl, d);
    return d;
  }
  const kljucOznake = (id) => (id ? (os() ? imena.os[T.meta.oznake.kljuci[id - 1]] : T.meta.oznake.kljuci[id - 1]) || "" : "");
  let rezOznak = null;
  function osveziDele() {
    rezOznak = T.ozn ? R.rezinaOznak(T.ozn, stanje.smer, stanje.i[stanje.smer]) : null;
    const novi = [];
    if (rezOznak && stanje.odprto) for (const [id] of R.struktureRezine(rezOznak, 3)) {
      const d = del(id);
      if (d && !novi.includes(d)) novi.push(d);
      if (novi.length >= 40) break;
    }
    const izb = stanje.izbrana ? deliPoId.get(stanje.izbrana) : null;
    if (izb && !novi.includes(izb)) novi.push(izb);
    if (novi.length !== seznamDelov.length || novi.some((d, k) => d !== seznamDelov[k])) seznamDelov = novi;
  }
  function narisiPoudarek() {
    const kl = stanje.izbrana;
    if (!rezOznak || !kl) {
      poudarek.visible = false;
      return;
    }
    const { w, h, data } = rezOznak;
    platnoPoudarka.width = w; platnoPoudarka.height = h;
    const c = new THREE.Color(deliPoId.get(kl)?.barva || "#6E9BFF");
    const je = new Uint8Array(256);
    T.meta.oznake.kljuci.forEach((_, k) => { if (kljucOznake(k + 1) === kl) je[k + 1] = 1; });
    const px = new Uint8ClampedArray(w * h * 4);
    let n = 0;
    for (let k = 0; k < data.length; k++)
      if (je[data[k]]) {
        const x = k % w, y = (k / w) | 0;
        const rob = x === 0 || y === 0 || x === w - 1 || y === h - 1 || !je[data[k - 1]] || !je[data[k + 1]] || !je[data[k - w]] || !je[data[k + w]];
        px[k * 4] = rob ? 255 : c.r * 255; px[k * 4 + 1] = rob ? 255 : c.g * 255; px[k * 4 + 2] = rob ? 255 : c.b * 255; px[k * 4 + 3] = rob ? 235 : 95;
        n++;
      }
    platnoPoudarka.getContext("2d").putImageData(new ImageData(px, w, h), 0, 0);
    texPoudarka.needsUpdate = true;
    poudarek.visible = n > 0;
  }

  // --- nalaganje telesa
  async function nalozi(spol) {
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
    const dim = meta.dim;
    // površje telesa
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
    telo.visible = stanje.telo && stanje.pogled !== "ravno";
    notranja.add(telo);
    // postavitev v kroglo s polmerom 1 (središče volumna v izhodišču)
    const [W, H, Z] = dim, s = 2 / Math.hypot(W, H, Z);
    notranja.scale.setScalar(s);
    T = { meta, url, mali, ozn, dim };
    deliPoId.clear();
    stanje.izbrana = "";
    for (const sm of R.SMERI) {
      const n = R.steviloRezin(dim, sm);
      const z = ctx.zacetek?.[`rezina-${sm}`];
      stanje.i[sm] = Math.max(0, Math.min(n - 1, Math.round(Number.isFinite(z) ? z : n * (sm === "a" ? 0.24 : 0.5))));
    }
    if (Z < 400) stanje.i.a = Math.round(Z / 2);
    notranja.visible = stanje.odprto;
    ostraZa = "";
    postaviRezino();
    ctx.napredek?.(1);
  }
  await nalozi(stanje.spol);

  const drsniki = {};
  const drsnik = (sm) => (drsniki[sm] = {
    tip: "drsnik", id: `rezina-${sm}`, oznaka: t("a3.rez.slice", "Rezina (mm)"), min: 0, max: Math.max(1, najvec(sm)), korak: 1,
    vrednost: stanje.i[sm],
    vidno: () => stanje.odprto && stanje.smer === sm,
    ob: (v) => {
      stanje.i[sm] = pripni(sm, v);
      if (stanje.i[sm] !== Math.round(v)) drsniki[sm].vrednost = stanje.i[sm];
      postaviRezino();
    },
  });
  const lega = () => {
    const s = stanje.smer, i = stanje.i[s];
    const cm = (i / 10).toLocaleString(document.documentElement.lang || "sl", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (T.meta.vzorec) return `${T.meta.od + (s === "a" ? i : 0)}`; // vzorec: številka izvorne rezine (lega v telesu ni znana)
    return s === "a" ? `${cm} cm ${t("a3.rez.fromTop", "pod vrhom")}` : s === "k" ? `${cm} cm ${t("a3.rez.fromFront", "od sprednje strani")}` : `${cm} cm ${t("a3.rez.fromRight", "od desne strani telesa")}`;
  };

  return {
    group,
    get deli() { return seznamDelov; },
    nadzor: [
      // uvod: prerezi se pokažejo šele na izbiro
      { tip: "izpis", id: "uvod", oznaka: t("a3.rez.introTitle", "Preden pogledaš"), vidno: () => !stanje.odprto,
        vrednost: () => t("a3.rez.intro", "To so fotografije pravih prerezov človeškega telesa. Človek je svoje telo po smrti daroval znanosti, da se lahko učimo, kako smo zgrajeni. Glej jih spoštljivo. Če ti pogled ni prijeten, se lahko kadar koli vrneš nazaj.") },
      { tip: "gumb", id: "pokazi", oznaka: t("a3.rez.introBtn", "Pokaži prereze"), vidno: () => !stanje.odprto, ponastaviPogled: true,
        ob: () => {
          stanje.odprto = true;
          notranja.visible = true;
          postaviRezino();
        } },
      { tip: "izbira", id: "raven", oznaka: t("a3.detail", "Podrobnost"), moznosti: [[1, t("a3.levelOS", "OŠ")], [2, t("a3.levelSS", "SŠ")], [3, t("a3.levelAll", "Vse")]], vrednost: stanje.raven, vidno: () => stanje.odprto, ponastaviPogled: true,
        ob: (v) => {
          stanje.raven = Number(v) || 1;
          deliPoId.clear();
          stanje.izbrana = "";
          postaviRezino();
        } },
      ...(spoli.length > 1 ? [{ tip: "izbira", id: "telo", oznaka: t("a3.rez.body", "Telo"), moznosti: spoli.map((s) => [s, s === "z" ? t("a3.rez.female", "Ženska") : t("a3.rez.male", "Moški")]), vrednost: stanje.spol, vidno: () => stanje.odprto, ponastaviPogled: true,
        ob: (v) => {
          const zahteva = (stanje.zahteva = (stanje.zahteva || 0) + 1);
          nalozi(v).then(() => {
            if (zahteva !== stanje.zahteva) return;
            stanje.spol = v;
            for (const sm of R.SMERI) drsniki[sm].vrednost = stanje.i[sm];
            napakaNalaganja = "";
          }, (err) => {
            console.error("3D rezine", err);
            napakaNalaganja = t("a3.rez.offline", "Podatkov ni bilo mogoče naložiti. Preveri povezavo in poskusi znova.");
            narisi();
          });
        } }] : []),
      { tip: "izbira", id: "smer", oznaka: t("a3.rez.direction", "Smer prereza"), moznosti: R.SMERI.map((s) => [s, t(`a3.rez.dir.${s}`, IMENA_SMERI[s])]), vrednost: stanje.smer, vidno: () => stanje.odprto, ponastaviPogled: true,
        ob: (v) => {
          stanje.smer = v;
          stanje.izbrana = "";
          postaviRezino();
        } },
      drsnik("a"), drsnik("k"), drsnik("s"),
      ...[-1, 1].map((k) => ({ tip: "gumb", id: k < 0 ? "nazaj1" : "naprej1", oznaka: k < 0 ? "− 1 mm" : "+ 1 mm", vidno: () => stanje.odprto,
        ob: () => {
          const sm = stanje.smer;
          stanje.i[sm] = pripni(sm, stanje.i[sm] + k);
          drsniki[sm].vrednost = stanje.i[sm];
          postaviRezino();
        } })),
      { tip: "izpis", id: "lega", oznaka: t("a3.rez.position", "Lega rezine"), vrednost: lega, vidno: () => stanje.odprto },
      { tip: "izbira", id: "pogled", oznaka: t("a3.rez.view", "Pogled"), moznosti: [["3d", t("a3.rez.view3d", "V telesu")], ["ravno", t("a3.rez.viewFlat", "Naravnost na rezino")]], vrednost: stanje.pogled, vidno: () => stanje.odprto, ponastaviPogled: true,
        ob: (v) => {
          stanje.pogled = v;
          postaviRezino();
        } },
      { tip: "stikalo", id: "telo3d", oznaka: t("a3.rez.showBody", "Telo okoli rezine"), vrednost: stanje.telo, vidno: () => stanje.odprto && stanje.pogled !== "ravno",
        ob: (v) => {
          stanje.telo = !!v;
          if (telo) telo.visible = stanje.telo && stanje.pogled !== "ravno";
          narisi();
        } },
      { tip: "izpis", id: "vir", oznaka: t("a3.rez.source", "Vir fotografij"), vidno: () => !stanje.odprto, vrednost: () => `${NAVEDBA}. ${t("a3.rez.notCurrent", "Podatki niso nujno najnovejši ali najnatančnejši; NLM Evklida ne podpira in ne priporoča.")}` },
      { tip: "izpis", id: "stanje", oznaka: t("a3.rez.status", "Stanje"), vidno: () => !!napakaNalaganja, vrednost: () => napakaNalaganja },
    ],
    povzetek: () => NAVEDBA,
    merilo: () => {
      const m = Math.hypot(...T.dim) / 1000;
      return { m, oznaka: `${m.toFixed(1).replace(".", ",")} m` };
    },
    pogled: () => {
      const s = stanje.smer, r = stanje.pogled === "ravno";
      if (s === "a") return r ? [0, -1, 0.06] : [0.35, 0.8, 1];
      if (s === "k") return r ? [0, 0.02, 1] : [0.3, 0.12, 1];
      return r ? [1, 0.02, 0] : [1, 0.12, 0.45];
    },
    okvir: () => {
      const s = stanje.smer, [w, h] = R.velikostRezine(T.dim, s), sc = notranja.scale.x;
      if (s !== "a" && stanje.pogled !== "ravno") return { sredisce: [0, 0, 0], polmer: 1 };
      // polmer iz vsebine rezine (glava je manjša od trupa), da rezina zapolni okno
      const rr = (Math.hypot((vsebina.u1 - vsebina.u0) * w, (vsebina.v1 - vsebina.v0) * h) / 2) * sc;
      if (s !== "a") return { sredisce: [0, 0, 0], polmer: Math.min(1, rr * 1.02) };
      return { sredisce: [0, 0, 0], polmer: stanje.pogled === "ravno" ? rr * 1.15 : rr * 1.9 }; // prostor za oznake smeri ob rezini
    },
    najblizje: 0.1, // povečava do ploščic 0,33 mm
    ao: () => false,
    izberi(id, hit) {
      if (hit) {
        if (hit.object !== ploskev || !stanje.odprto) return null;
        const p = notranja.worldToLocal(hit.point.clone());
        // ime samo tam, kjer ga mreža oznak res pozna: brez ugibanja po barvi (bolje brez imena kot napačno)
        const oz = T.ozn ? R.oznakaV(T.ozn, p.x, -p.z, -p.y) : 0;
        const d = oz ? del(oz) : null;
        stanje.izbrana = d ? d.kljuc : "";
        osveziDele();
        narisiPoudarek();
        narisi();
        return d ? d.id : null;
      }
      const d = seznamDelov.find((x) => x.id === id);
      stanje.izbrana = d ? d.kljuc : "";
      narisiPoudarek();
      narisi();
      return id;
    },
    dispose() {
      clearTimeout(uraOstre); clearTimeout(uraPloscic); clearTimeout(uraKamere);
      pocistiPloscice();
      for (const tx of predpomnilnik.values()) tx.dispose();
      texMala.dispose(); texPoudarka.dispose(); geoRezine.dispose(); matTelesa.dispose();
      telo?.geometry.dispose();
    },
  };
}
