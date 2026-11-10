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
export function razvrstiPolice(strukture, { sirina = 1400, razmak = 18, naslov = 34 } = {}) {
  const red = new Map(SISTEMI.map((s, i) => [s.id, i]));
  const s = strukture
    .map((x) => ({ ...x, sistem: x.sistem || sistemKljuca(x.kljuc) }))
    .sort((a, b) => red.get(a.sistem) - red.get(b.sistem) || b.prostornina - a.prostornina || (a.kljuc < b.kljuc ? -1 : 1));
  const vrste = [], mesta = new Map();
  let y = 0, trenutni = null, x = 0, visina = 0;
  const novaVrsta = (sistem, zNaslovom) => {
    if (trenutni) y += visina + razmak;
    if (zNaslovom) y += naslov;
    x = 0; visina = 0;
    trenutni = { sistem, y, x0: 0 };
    if (zNaslovom) vrste.push(trenutni);
  };
  for (const d of s) {
    const w = 2 * Math.max(4, d.polmer);
    if (!trenutni || trenutni.sistem !== d.sistem) novaVrsta(d.sistem, true);
    else if (x + w > sirina) novaVrsta(d.sistem, false);
    mesta.set(d.kljuc, [x + w / 2, y + w / 2]);
    x += w + razmak;
    visina = Math.max(visina, w);
  }
  return { vrste, mesta, visina: y + visina, vrstniRed: s.map((d) => d.kljuc) };
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
  const lastno = { uNapih: { value: 0 }, uSvetlost: { value: 1 } };
  m.userData.k3 = lastno;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, skupno, lastno, { uQ: { value: q } });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uNapih; uniform float uQ;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed += objectNormal * (uNapih / uQ);");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nuniform float uFoto; uniform float uSvetlost;\n${GLSL_KOREKCIJA}`)
      // vColor = surova barva tkiva iz volumna (sRGB 0–1); uFoto 1 = pravo tkivo (popravljena barva), 0 = barva po organih
      .replace("#include <color_fragment>", `
        #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
          vec3 k3t = k3Popravi(vColor.rgb);
          k3t = pow(k3t, vec3(2.2));
          diffuseColor.rgb = mix(diffuseColor.rgb, k3t, uFoto);
        #endif
        diffuseColor.rgb *= uSvetlost;`);
  };
  m.customProgramCacheKey = () => (koza ? "k3-vh-koza" : "k3-vh");
  return m;
}
