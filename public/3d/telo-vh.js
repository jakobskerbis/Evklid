// »Pravo telo 3D« (docs/3d.md): 3D organi iz mreže oznak rezin (scripts/atlas/rezine_telo3d.py), v istih koordinatah
// (mm okvirja rezin) kot rezine, zato se rezina in 3D ujemata po definiciji. Tu so čiste funkcije (sistemi, celota
// dela, jasen prikaz, razmik in police »Razmakni strukture«) in gradnja materialov; model je pravi-prerez.js.

// Organski sistemi v vrstnem redu polic (j, 10. 11.: najprej po sistemih, znotraj po velikosti). os = ime za OŠ.
export const SISTEMI = [
  { id: "srce", ime: "Srce in ožilje", os: "Srce in žile" },
  { id: "dihala", ime: "Dihala", os: "Dihala" },
  { id: "prebavila", ime: "Prebavila", os: "Prebavila" },
  { id: "secila", ime: "Sečila in spolovila", os: "Sečila in spolovila" },
  { id: "zivcevje", ime: "Živčevje in čutila", os: "Možgani, živci in oči" },
  { id: "kosti", ime: "Kosti in sklepi", os: "Kosti" },
  { id: "misice", ime: "Mišice", os: "Mišice" },
  { id: "ostalo", ime: "Koža in ostalo", os: "Koža in ostalo" },
];

const PRAVILA = [
  [/prekat|preddvor|pretin|zaklopk|papilarn|vencne|aorta|votla-vena|pljucna-(arterija|vena)|^arterija|^vena|^srce$/, "srce"],
  [/pljuc|sapni|grl|hrustan|poklopec|nebnic|podjezicnic/, "dihala"],
  [/jezik|zobje|nebo|ustna|slinavk|jetra|zolc|vranica|trebusna|dvanajstnik|crevo|danka|pozirnik|zelodec/, "prebavila"],
  [/ledvic|secevod|secni|secnica|prostata|semenjak|semenovod|maternic|jajcni|jajcevod|noznica|dojka/, "secila"],
  [/mozg|talamus|hrbtenjac|zrklo|leca|steklovina|vidni-zivec|zivec/, "zivcevje"],
  [/vretenc|plosca|krizinca|trtica|kolcnica|prsnica|stegnenica|golenica|mecnica|pogacica|sklepni|meniskus|kolenske|^kost|lobanja|rebr/, "kosti"],
  [/misic|prema-stegenska|kita/, "misice"],
];
// priželjc spada med limfne organe (ostalo), očesne mišice k čutilom
const IZJEME = { prizeljc: "ostalo", "ocesne-misice": "zivcevje", "misice-grla": "dihala", "papilarne-misice": "srce", koza: "ostalo" };

export function sistemKljuca(kl) {
  if (IZJEME[kl]) return IZJEME[kl];
  for (const [re, s] of PRAVILA) if (re.test(kl)) return s;
  return "ostalo";
}

// Del organa → celota (prvi dotik dela pokaže »Del: Srce«, drugi dotik izbere celo srce)
const CELOTE = [
  [/^(levi|desni)-(prekat|preddvor)$|^medprekatni-pretin$|^srcne-zaklopke$|^papilarne-misice$|^vencne-zile$/, "srce"],
  [/^(veliki|mali)-mozgani$|^mozgansko-deblo$|^talamus$|^mozganski-prekat$/, "mozgani"],
  [/^(zrklo|leca|steklovina)$/, "oko"],
  [/^(scitasti|obrocasti)-hrustanec$|^poklopec$|^hrustanci-grla$|^misice-grla$/, "grlo"],
  [/-vretence(-[a-z]+\d+)?$|^medvretencna-plosca$/, "hrbtenica"],
];
export function celotaZa(kl) {
  for (const [re, c] of CELOTE) if (re.test(kl)) return c;
  return null;
}
// ključi vseh delov, ki sestavljajo celoto (med prisotnimi)
export const deliCelote = (celota, kljuci) => kljuci.filter((k) => celotaZa(k) === celota);

// Jasen prikaz (OŠ, SŠ privzeto): drobne in tanke strukture se v 3D napihnejo vzdolž normale, na rezini se njihova barvna
// plast razširi za eno celico. »Prava razmerja« (fakulteta): vse v točnih merah.
export const MAJHNE = /zaklopk|vencne|^arterija$|^vena$|pljucna-(arterija|vena)|sapnice|secevod|jajcevod|semenovod|zolcni-vodi|vidni-zivec|ocesne-misice|prizeljc|slinavk|nebnic|podjezicnic|papilarn|hrbtenjac|leca|talamus|^zivec/;
export function napihZa(kl, nacin) {
  if (nacin !== "jasno" || !MAJHNE.test(kl)) return 0;
  return /zaklopk|vencne|^arterija$|^vena$|zivec|jajcevod|semenovod|secevod|zolcni/.test(kl) ? 1.4 : 0.9; // mm
}
export const privzetNacin = (raven) => (raven >= 3 ? "prava" : "jasno");
export const privzetaRezina = (raven) => (raven >= 3 ? "foto" : "organi"); // j, 10. 11. 22:00

// Razmakni strukture: drsnik 0–1. Do 0,5 razmik na mestu (od središča telesa, velikost ostane), od 0,5 do 1 gladek prehod
// na police. Vrne { razmik: 0–1, police: 0–1 }.
export function fazaRazmika(f) {
  const x = Math.max(0, Math.min(1, Number(f) || 0));
  if (x <= 0.5) return { razmik: x / 0.5, police: 0 };
  const t = (x - 0.5) / 0.5;
  return { razmik: 1, police: t * t * (3 - 2 * t) };
}
// odmik strukture pri razmiku na mestu: smer od središča telesa (mm), dolžina sorazmerna razdalji (do +60 %)
export function odmikRazmika(c, c0, r) {
  return [0, 1, 2].map((k) => (c[k] - c0[k]) * 0.6 * r);
}

// Police: najprej po sistemu (SISTEMI), znotraj po prostornini (največja prva = levo). strukture: [{ kljuc, prostornina,
// polmer, sistem? }]. Vrne { vrste: [{ sistem, y, x0 }], mesta: Map(kljuc → [x, y]) } v mm v ravnini polic (x desno,
// y navzdol); sirina = največja širina vrste (telefon ožje: police v stolpcu, več vrst, drsenje navzdol).
export function razvrstiPolice(strukture, { sirina = 1400, razmak = 18, naslov = 34, napis = null, visinaNapisa = 0 } = {}) {
  const red = new Map(SISTEMI.map((s, i) => [s.id, i]));
  const s = strukture
    .map((x) => ({ ...x, sistem: x.sistem || sistemKljuca(x.kljuc) }))
    .sort((a, b) => red.get(a.sistem) - red.get(b.sistem) || b.prostornina - a.prostornina || (a.kljuc < b.kljuc ? -1 : 1));
  const vrste = [], mesta = new Map();
  let y = 0, trenutni = null, x = 0, visina = 0, najvecX = 0;
  const novaVrsta = (sistem, zNaslovom) => {
    if (trenutni) y += visina + razmak;
    if (zNaslovom) y += naslov;
    x = 0; visina = 0;
    trenutni = { sistem, y, x0: 0 };
    if (zNaslovom) vrste.push(trenutni);
  };
  for (const d of s) {
    const w = 2 * Math.max(4, d.polmer);
    // prostor za ime pod strukturo: širina mesta je večja od strukture in imena, višina vrste vključuje ime
    const ws = Math.max(w, napis ? napis(d.kljuc) : 0);
    if (!trenutni || trenutni.sistem !== d.sistem) novaVrsta(d.sistem, true);
    else if (x + ws > sirina) novaVrsta(d.sistem, false);
    mesta.set(d.kljuc, [x + ws / 2, y + w / 2]);
    x += ws + razmak;
    visina = Math.max(visina, w + visinaNapisa * 1.8);
    najvecX = Math.max(najvecX, x - razmak);
  }
  return { vrste, mesta, visina: y + visina, sirina: najvecX, vrstniRed: s.map((d) => d.kljuc) };
}

// Barve po organih (rezina in 3D, OŠ/SŠ privzeto): iste kot v atlasu (tkiva.js: srce rdeče, pljuča roza, kosti bele …).
// Ključ oznake → [ime materiala Z-Anatomy, angleško ime za ORGANI v tkiva.js, sistem atlasa].
export const ATLAS = {
  srce: ["Organ", "heart", "organi"], aorta: ["Artery", "aorta", "zile"], "votla-vena": ["Vein", "vena cava", "zile"],
  "pljucna-arterija": ["Pulmonary artery", "", "zile"], "pljucna-vena": ["Pulmonary vein", "", "zile"], arterija: ["Artery", "", "zile"],
  vena: ["Vein", "", "zile"], "vencne-zile": ["Artery", "", "zile"], "srcne-zaklopke": ["Ligament", "", "organi"],
  pljuca: ["Lung", "", "organi"], sapnik: ["Bronchi", "", "organi"], sapnice: ["Bronchi", "", "organi"], jetra: ["Organ", "liver", "organi"],
  zolcnik: ["Gallbladder", "", "organi"], "zolcni-vodi": ["Ductus", "", "organi"], vranica: ["Organ", "spleen", "organi"],
  "trebusna-slinavka": ["Organ", "pancreas", "organi"], crevo: ["Intestine", "intestine", "organi"], ledvica: ["Organ", "kidney", "organi"],
  "secni-mehur": ["Organ", "bladder", "organi"], spolni: ["Organ", "uterus", "organi"], kost: ["Bone", "", "okostje"],
  hrustanec: ["Cartilage", "", "sklepi"], mozgani: ["Brain", "", "zivcevje"], "mali-mozgani": ["Cerebellum", "", "zivcevje"],
  zivec: ["Nerve", "", "zivcevje"], hrbtenjaca: ["Nerve", "", "zivcevje"], oko: ["Eye", "", "zivcevje"], leca: ["Cornea", "", "zivcevje"],
  misica: ["Superficial", "", "misice"], zleza: ["Gland", "", "organi"], jezik: ["Organ", "tongue", "organi"], zobje: ["Teeth", "", "okostje"],
  sluznica: ["Mucosa", "", "organi"], dojka: ["Fat", "", "organi"], koza: ["Skin", "", "koza"], limfni: ["Lymph", "", "limfni"],
};
export function vrsticaAtlasa(kl) {
  const k = /prekat|preddvor|pretin|papilarn/.test(kl) ? "srce" : /pljuca/.test(kl) ? "pljuca" : /vretenc|krizinca|trtica|kolcnica|prsnica|stegnenica|golenica|mecnica|pogacica/.test(kl) ? "kost"
    : /plosca|hrustan|meniskus|sklepni|poklopec/.test(kl) ? "hrustanec" : /crevo|dvanajstnik|danka/.test(kl) ? "crevo" : /ledvic|ledvicni-meh/.test(kl) ? "ledvica"
      : /maternic|jajcni|jajcevod|noznica|prostata|semenjak|semenovod|secevod|secnica/.test(kl) ? "spolni" : /mali-mozgani/.test(kl) ? "mali-mozgani"
        : /mozg|talamus/.test(kl) ? "mozgani" : /zrklo|steklovina/.test(kl) ? "oko" : /vidni-zivec|zivec/.test(kl) ? "zivec" : /misic|kita|prema/.test(kl) ? "misica"
          : /slinavk|scitast|nebnic|podjezicnic/.test(kl) ? "zleza" : /ustna|nebo/.test(kl) ? "sluznica" : /prizeljc/.test(kl) ? "limfni" : kl;
  const [material, ime, sistem] = ATLAS[k] || ATLAS.sluznica;
  return { material, ime: ime || kl, sistem, id: kl };
}

// Barvna korekcija fotografije (rezina in barve tkiva v 3D): ista v senčilniku in v testih. Vhod/izhod 0–1 sRGB.
// Posvetli srednje tone, dvigne sence (temna kri, pljuča), rahlo nasiči; modrikast gel ostane zunaj (alfa).
export const KOREKCIJA = { crna: [0.035, 0.03, 0.04], bela: [0.9, 0.86, 0.82], gama: 0.82, nasicenost: 1.06 };
export function popraviBarvo([r, g, b], k = KOREKCIJA) {
  const c = [r, g, b].map((x, i) => Math.max(0, Math.min(1, (x - k.crna[i]) / (k.bela[i] - k.crna[i]))) ** k.gama);
  const y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return c.map((x) => Math.max(0, Math.min(1, y + (x - y) * k.nasicenost)));
}
// isto v GLSL (vec3 c v sRGB 0–1)
export const GLSL_KOREKCIJA = `
vec3 k3Popravi(vec3 c) {
  c = clamp((c - vec3(${KOREKCIJA.crna.join(",")})) / (vec3(${KOREKCIJA.bela.join(",")}) - vec3(${KOREKCIJA.crna.join(",")})), 0.0, 1.0);
  c = pow(c, vec3(${KOREKCIJA.gama.toFixed(3)}));
  float y = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return clamp(vec3(y) + (c - vec3(y)) * ${KOREKCIJA.nasicenost.toFixed(3)}, 0.0, 1.0);
}`;

// Material 3D strukture. barva: atlasova barva (THREE.Color); skupno: { uFoto, uNapihMm } (enako za vse), lastno:
// uNapih (mm), uSvetlost (zbledi ob izbiri drugega). Geometrija je v enotah 0,05 mm (kvantizirani GLB): napih se deli.
export function materialStrukture(THREE, { barva, ravnina, skupno, q = 0.05, koza = false }) {
  const m = new THREE.MeshStandardMaterial({
    color: barva, vertexColors: true, roughness: koza ? 0.7 : 0.55, metalness: 0, clippingPlanes: ravnina ? [ravnina] : null,
    transparent: koza, opacity: 1, depthWrite: !koza, side: koza ? THREE.FrontSide : THREE.DoubleSide,
  });
  // Vrednosti na mrežo (napih, svetlost) in skupna (foto) so konstante v senčilniku, ključ programa jih vsebuje: lastne
  // uniforme v programu, ki si ga deli več materialov z istim ključem, so se v three r187 brale le iz enega materiala
  // (zbledi ni delal). Različic je malo (svetlost 2 × napih 3 × foto 2 × koža), zato prevajanje ni drago.
  const lastno = { uNapih: { value: 0 }, uSvetlost: { value: 1 } };
  m.userData.k3 = lastno;
  const f = (x) => Number(x).toFixed(3);
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <begin_vertex>", `#include <begin_vertex>\ntransformed += objectNormal * (${f(lastno.uNapih.value / q)});`);
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${GLSL_KOREKCIJA}`)
      // vColor = surova barva tkiva iz volumna (sRGB 0–1); foto 1 = pravo tkivo (popravljena barva), 0 = barva po organih
      .replace("#include <color_fragment>", `
        #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
          vec3 k3t = pow(k3Popravi(vColor.rgb), vec3(2.2));
          diffuseColor.rgb = mix(diffuseColor.rgb, k3t * diffuseColor.rgb, ${f(skupno.uFoto.value)});
        #endif`);
  };
  m.customProgramCacheKey = () => `k3-vh|${koza ? 1 : 0}|${f(lastno.uNapih.value)}|${f(skupno.uFoto.value)}`;
  // zbledenje (uSvetlost) prek vgrajene barve materiala (osveži se ob vsakem izrisu): barva po organih × svetlost,
  // pri pravem tkivu siva svetlost × barva tkiva
  m.userData.osveziBarvo = () => {
    const sv = lastno.uSvetlost.value;
    if (skupno.uFoto.value > 0.5) m.color.setScalar(sv);
    else m.color.copy(barva).multiplyScalar(sv);
  };
  return m;
}

// Napis (ime na polici, naslov vrste): sprite s platnom, velikost v mm sveta (raste s povečavo kot telo).
function napisPolice(THREE, besedilo, { visina = 14, krepko = false, barva = "#e8eef8" } = {}) {
  const c = document.createElement("canvas");
  const g0 = c.getContext("2d");
  const pis = `${krepko ? 700 : 600} 44px 'Instrument Sans', system-ui, sans-serif`;
  g0.font = pis;
  const w = Math.ceil(g0.measureText(besedilo).width + 36);
  c.width = Math.min(2048, w); c.height = 72;
  const g = c.getContext("2d");
  g.font = pis; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillStyle = "rgba(12,17,28,0.78)";
  g.beginPath(); g.roundRect ? g.roundRect(2, 6, c.width - 4, 60, 30) : g.rect(2, 6, c.width - 4, 60); g.fill();
  g.fillStyle = barva; g.fillText(besedilo, c.width / 2, 37);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, toneMapped: false }));
  sp.scale.set((visina * c.width) / c.height, visina, 1);
  sp.renderOrder = 8;
  sp.raycast = () => {};
  return sp;
}

// 3D telo iz telo3d.glb: { skupina, mreze: Map(ključ → Mesh), nastavi({…}), dispose }. koren = surova scena glTF (vozlišče
// = ključ oznake, položaji v mm okvirja rezin, kvantizirani). info = telo3d.json (prostornina, središče, polmer v mm).
// barvaZa(kl) → THREE.Color (atlasova barva), imeZa(kl) → ime za napis na polici, sistemi → { id: ime vrste }.
export function zgradiTelo3D(THREE, koren, info, { ravnina, barvaZa, imeZa, imeSistema, telefon = false }) {
  const skupina = new THREE.Group();
  // mm okvirja (x desno→levo, y spredaj→zadaj, z glava→noge) → lokalne koordinate rezin (x, −z, −y) kot vMm v modelu
  const ovoj = new THREE.Group();
  ovoj.matrixAutoUpdate = false;
  ovoj.matrix.set(1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
  skupina.add(ovoj);
  const skupno = { uFoto: { value: 0 } };
  const mreze = new Map();
  const vozlisca = [];
  koren.updateMatrixWorld(true);
  koren.traverse((o) => { if (o.isMesh) vozlisca.push(o); });
  for (const o of vozlisca) {
    const v = o.parent && o.parent !== koren && !o.name ? o.parent : o;
    const kl = (v.name || o.name || "").replace(/_\d+$/, "");
    const m = new THREE.Mesh(o.geometry, materialStrukture(THREE, { barva: barvaZa(kl), ravnina, skupno, koza: kl === "koza" }));
    m.name = kl;
    m.scale.copy(o.getWorldScale(new THREE.Vector3()));
    m.userData.kljuc = kl;
    m.userData.izhodisce = new THREE.Vector3(); // premik razmika/polic (mm okvirja)
    if (kl === "koza") m.renderOrder = 2;
    // tap: samo del, ki ni odrezan z ravnino (raycaster ne upošteva clippingPlanes)
    const izvirni = THREE.Mesh.prototype.raycast;
    m.raycast = function (rc, out) {
      if (!this.visible || this.userData.k3Skrit) return;
      const zac = out.length;
      izvirni.call(this, rc, out);
      const plo = this.material.clippingPlanes?.[0];
      if (plo) for (let k = out.length - 1; k >= zac; k--) if (plo.distanceToPoint(out[k].point) < 0) out.splice(k, 1);
    };
    ovoj.add(m);
    mreze.set(kl, m);
  }
  const strukture = info?.strukture || {};
  // središče telesa (mm) za razmik
  const c0 = [0, 0, 0];
  let n0 = 0;
  for (const [kl, s] of Object.entries(strukture)) if (s.sredisce && kl !== "koza") { for (let k = 0; k < 3; k++) c0[k] += s.sredisce[k]; n0++; }
  if (n0) for (let k = 0; k < 3; k++) c0[k] /= n0;
  // police (izračunane enkrat; telefon ožje, več vrst)
  // polmer v json je pol diagonale okvirja: za polico 0,75 tega (struktura ne leži po diagonali)
  const seznam = [...mreze.keys()].filter((k) => k !== "koza" && strukture[k]?.sredisce).map((k) => ({ kljuc: k, prostornina: strukture[k].prostornina_cm3 || 0, polmer: 0.75 * (strukture[k].polmer || 10) }));
  // širina polic iz skupne površine (računalnik ≈ 16 : 10, telefon pokončno ≈ 9 : 16)
  const ploscina = seznam.reduce((a, d) => a + (2 * Math.max(4, d.polmer) + 22) ** 2, 0);
  const sirinaCilj = Math.sqrt(ploscina) * (telefon ? 0.9 : 2.0);
  const visNapisa = Math.max(10, sirinaCilj / (telefon ? 22 : 42));
  const dolzina = (kl) => visNapisa * 0.56 * String(imeZa(kl)).length + visNapisa;
  const pol = razvrstiPolice(seznam, { sirina: sirinaCilj, razmak: 22, naslov: visNapisa * 3, napis: dolzina, visinaNapisa: visNapisa });
  const napisi = new THREE.Group();
  napisi.visible = false;
  ovoj.add(napisi);
  const x0 = c0[0] - pol.sirina / 2, zVrh = c0[2] - pol.visina / 2;
  const cilj = (kl) => {
    const m = pol.mesta.get(kl), s = strukture[kl];
    return m ? [x0 + m[0] - s.sredisce[0], c0[1] - s.sredisce[1], zVrh + m[1] - s.sredisce[2]] : [0, 0, 0];
  };
  // napisi v ravnini polic (y = spredaj, malo pred strukturami); sprite je v ovoju, ki je zrcaljen (det < 0): velikost
  // ostane, smer pogleda kamere ni pomembna
  for (const v of pol.vrste) {
    const sp = napisPolice(THREE, imeSistema(v.sistem), { visina: visNapisa * 1.6, krepko: true, barva: "#9fc2ff" });
    sp.position.set(x0 + (sp.scale.x / 2), c0[1] - 200, zVrh + v.y - visNapisa * 1.2);
    napisi.add(sp);
  }
  for (const [kl, [mx, my]] of pol.mesta) {
    const s = strukture[kl];
    const sp = napisPolice(THREE, imeZa(kl), { visina: visNapisa });
    sp.position.set(x0 + mx, c0[1] - 200, zVrh + my + Math.max(4, 0.75 * s.polmer) + visNapisa * 0.8);
    napisi.add(sp);
  }
  let faza = { razmik: 0, police: 0 }, izbrani = null, rentgen = true, klip = true;
  function nastavi({ foto, nacin, razmik, izbor, rentgen: rg, klip: kp, vidno } = {}) {
    if (foto != null) skupno.uFoto.value = foto ? 1 : 0;
    if (nacin) for (const [kl, m] of mreze) m.material.userData.k3.uNapih.value = napihZa(kl, nacin);
    if (razmik != null) faza = fazaRazmika(razmik);
    if (izbor !== undefined) izbrani = izbor && izbor.size ? izbor : null;
    if (rg != null) rentgen = rg;
    const brezKlipa = faza.razmik > 0 || faza.police > 0;
    const k = kp != null ? kp : klip;
    klip = k;
    for (const [kl, m] of mreze) {
      // razmik na mestu, nato police
      const s = strukture[kl];
      if (s?.sredisce && kl !== "koza") {
        const o = odmikRazmika(s.sredisce, c0, faza.razmik), c = cilj(kl), t = faza.police;
        m.position.set(o[0] * (1 - t) + c[0] * t, o[1] * (1 - t) + c[1] * t, o[2] * (1 - t) + c[2] * t);
      }
      const jeKoza = kl === "koza";
      m.visible = vidno !== false && !(jeKoza && (brezKlipa || izbrani));
      const plo = !brezKlipa && klip && ravnina ? [ravnina] : [];
      if ((m.material.clippingPlanes?.length || 0) !== plo.length) {
        m.material.clippingPlanes = plo;
        m.material.needsUpdate = true;
      }
      const u = m.material.userData.k3;
      const izbran = !izbrani || izbrani.has(kl);
      const sv = izbran ? 1 : 0.07, // linearno (≈ 30 % svetlosti na zaslonu)
        kljucU = `${u.uNapih.value}|${skupno.uFoto.value}`;
      u.uSvetlost.value = sv;
      m.material.userData.osveziBarvo();
      // lastne uniforme se v skupnem programu (isti customProgramCacheKey) naložijo zanesljivo le ob osvežitvi materiala
      if (u.zadnje !== kljucU) { u.zadnje = kljucU; m.material.needsUpdate = true; }
      m.material.emissive?.set(izbrani && izbrani.has(kl) ? barvaZa(kl) : 0x000000);
      m.material.emissiveIntensity = 0.35;
      if (jeKoza) m.material.opacity = rentgen ? 0.16 : 1;
    }
    napisi.visible = faza.police > 0.98;
  }
  const meje = () => {
    if (faza.police > 0.5) {
      // telefon: police v stolpcu, kader na prve vrste (drsenje navzdol = premik kamere); računalnik: vse police
      if (telefon && pol.visina > pol.sirina * 1.6) return { sredisce: [c0[0], c0[1], c0[2] - pol.visina / 2 + pol.sirina * 0.8], polmer: pol.sirina * 0.85, police: true };
      return { sredisce: [c0[0], c0[1], c0[2]], polmer: Math.hypot(pol.sirina, pol.visina) * 0.5, police: true };
    }
    return null;
  };
  return {
    skupina, mreze, nastavi, meje, police: pol, sredisce: c0,
    get faza() { return faza; },
    dispose() {
      for (const m of mreze.values()) m.material.dispose();
      napisi.traverse((o) => { if (o.material) { o.material.map?.dispose(); o.material.dispose(); } });
    },
  };
}
