// Atlas človeškega telesa (docs/3d.md): plasti telesa iz Z-Anatomy (public/3d/modeli/telo/*.glb), imena iz
// atlas-strukture.json in atlas-imena.json. Postavitev zaslona kot pri Astri (iskanje, Brskaj, učenje, povečava,
// kompas smeri, Nastavitve pogleda), videz Evklidov. Vsaka plast je razdeljena po razredih tkiva v nekaj
// BatchedMesh (en klic risanja na razred), zato je okostje z organi okoli 15 klicev risanja namesto 400.
// Izbran del se nariše posebej (sij), ostali potemnijo; rentgen naredi vse ostalo prosojno steklo.
import { THREE, ustvariSceno, kakovostNaprave } from "./scena.js";
import { GLTFLoader } from "/vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "/vendor/three/examples/jsm/libs/meshopt_decoder.module.js";
import { tkivo, ustvariMaterial } from "./tkiva.js";
import { seznamDatotek, mapaTelesaNaprave } from "./modeli.js";
import { normalizirajViri } from "./pogodba.js";
import { t, currentLang } from "/i18n.js";
import { icon } from "/icons.js";
import { vgrajeno, starsu } from "./vgrajeno.js";

export const SLOJI = [
  { id: "koza", ikona: "user", barva: "#e5b79e" },
  { id: "misice", ikona: "activity", barva: "#b03a33" },
  { id: "okostje", ikona: "bone", barva: "#e8dcc4" },
  { id: "sklepi", ikona: "circle", barva: "#a9c7df" },
  { id: "organi", ikona: "heart", barva: "#d99a83" },
  { id: "zile", ikona: "droplet", barva: "#c3262c" },
  { id: "zivcevje", ikona: "zap", barva: "#e8c547" },
  { id: "limfni", ikona: "flower", barva: "#78bd66" },
];
const ZACETNI = ["okostje", "organi"];
// Moške spolne strukture: v pogledu »Žensko« jih skrijemo (ženski model je ločena datoteka, če obstaja).
const MOSKO = /penis|testis|testes|scrot|prostat|epididym|seminal vesicle|ductus deferens|vas deferens|spermatic|cremaster|bulbourethral/i;
const POGLEDI = {
  spredaj: [0, 0.05, 1],
  zadaj: [0, 0.05, -1],
  strani: [-1, 0.05, 0],
  perspektiva: [0.62, 0.28, 1],
};
const KOMPAS = [
  ["zg", [0, 1, 0]],
  ["sp", [0, -1, 0]],
  ["l", [1, 0, 0]],
  ["d", [-1, 0, 0]],
  ["pr", [0, 0, 1]],
  ["za", [0, 0, -1]],
];
const KVIZ_VPRASANJ = 10;

const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const gumb = (cls, html, label) => {
  const b = mk("button", cls);
  b.type = "button";
  b.innerHTML = html;
  if (label) {
    b.setAttribute("aria-label", label);
    b.title = label;
  }
  return b;
};
const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
const mb = (b) => (b / 1048576).toFixed(1).replace(".", ",");
const shramba = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
};

// Pridevnik strani se ujema s spolom in številom imena: leva stegnenica, levi zob, levo oko, leve rebra …
export function pridevnikStrani(stran, spol = "m", mn = false) {
  const l = stran === "l";
  if (mn) return spol === "z" ? (l ? "leve" : "desne") : spol === "s" ? (l ? "leva" : "desna") : l ? "levi" : "desni";
  return spol === "z" ? (l ? "leva" : "desna") : spol === "s" ? (l ? "levo" : "desno") : l ? "levi" : "desni";
}
// Prva črka imena ostane velika, če je ime lastno (Ahilova tetiva, Evstahijeva cev).
const lastno = (beseda) => /^[A-ZČŠŽ][a-zčšž]+(ov|ova|ovo|ev|eva|evo|in|ina|ino|ski|ska|sko)$/.test(beseda);
const zMalo = (s) => (lastno(s.split(/\s/)[0]) || /^[A-ZČŠŽ]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
const zVeliko = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export function imeStrukture(row, im, jezik = "sl") {
  if (jezik === "sl" && im?.sl) {
    if (row.stran !== "l" && row.stran !== "r") return zVeliko(im.sl);
    return zVeliko(`${pridevnikStrani(row.stran, im.spol, !!im.mn)} ${zMalo(im.sl)}`);
  }
  const base = row.ime || row.id;
  return row.stran === "l" || row.stran === "r" ? `${base} (${t(row.stran === "l" ? "a3.left" : "a3.right")})` : base;
}

export async function odpriAtlas(el, { zapri = null } = {}) {
  const jezik = currentLang();
  const kakovost = kakovostNaprave();
  const mapa = mapaTelesaNaprave(kakovost); // telo-hd na računalniku, telo na telefonu (modeli.js)
  el.replaceChildren();
  el.classList.add("k3", "a3");
  el.setAttribute("data-kakovost", kakovost);
  el.setAttribute("data-modeli", mapa);

  // ---------- postavitev ----------
  const oder = mk("div", "a3-oder");
  const vrh = mk("header", "a3-vrh");
  const glava = mk("div", "a3-glava");
  const znak = mk("span", "a3-znak");
  znak.innerHTML = icon("bone");
  const naslovi = mk("div", "a3-naslovi");
  naslovi.append(mk("h1", "a3-naslov", t("a3.title")), mk("p", "a3-nadnaslov", t("a3.eyebrow")));
  const btnMeni = gumb("a3-krog", icon("ellipsis"), t("a3.more"));
  btnMeni.setAttribute("aria-haspopup", "menu");
  const btnZapri = gumb("a3-krog", icon("x"), t("a3.close"));
  glava.append(znak, naslovi, btnMeni, btnZapri);

  const vrsta2 = mk("div", "a3-vrsta");
  const iskanje = mk("div", "a3-iskanje");
  iskanje.innerHTML = icon("search");
  const vnos = document.createElement("input");
  vnos.type = "search";
  vnos.placeholder = t("a3.search");
  vnos.setAttribute("aria-label", t("a3.search"));
  vnos.setAttribute("autocomplete", "off");
  vnos.setAttribute("role", "combobox");
  vnos.setAttribute("aria-expanded", "false");
  vnos.setAttribute("aria-controls", "a3-rezultati");
  const rezultati = mk("ul", "a3-rezultati");
  rezultati.id = "a3-rezultati";
  rezultati.setAttribute("role", "listbox");
  rezultati.hidden = true;
  iskanje.append(vnos, rezultati);
  const btnBrskaj = gumb("a3-pill a3-brskaj", `${icon("layers")}<span>${t("a3.browse")}</span>`);
  const btnUci = gumb("a3-krog", icon("graduation-cap"), t("a3.learn"));
  vrsta2.append(iskanje, btnBrskaj, btnUci);

  const vrsta3 = mk("div", "a3-vrsta a3-vrsta3");
  const levo3 = mk("div", "a3-levo3");
  const stevec = mk("span", "a3-stevec");
  stevec.setAttribute("aria-live", "polite");
  const btnVse = gumb("a3-pill a3-mali", `${icon("eye")}<span>${t("a3.showAll")}</span>`);
  btnVse.hidden = true;
  levo3.append(stevec, btnVse);
  const povecava = mk("div", "a3-skupina");
  const btnManj = gumb("a3-krog", icon("zoom-out"), t("a3.zoomOut"));
  const btnVec = gumb("a3-krog", icon("zoom-in"), t("a3.zoomIn"));
  const btnPon = gumb("a3-krog", icon("rotate-ccw"), t("a3.reset"));
  povecava.append(btnManj, btnVec, btnPon);
  vrsta3.append(levo3, povecava);
  vrh.append(glava, vrsta2, vrsta3);

  const kompas = mk("div", "a3-kompas");
  kompas.setAttribute("role", "group");
  kompas.setAttribute("aria-label", t("a3.compass"));
  const kompasGumbi = KOMPAS.map(([k, d]) => {
    const b = gumb("a3-smer", "", t(`a3.dir.${k}`));
    b.textContent = t(`a3.dirShort.${k}`);
    b.dataset.smer = k;
    // Pogled od zgoraj ali spodaj: majhen odmik naprej, da se kamera ne obrne okoli navpične osi.
    b.addEventListener("click", () => pogled(new THREE.Vector3(d[0], d[1], d[2] + (d[1] ? 0.002 : 0))));
    kompas.append(b);
    return { b, d: new THREE.Vector3(...d) };
  });

  const dno = mk("div", "a3-dno");
  const namig = mk("p", "a3-namig", t(typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches ? "a3.hintMouse" : "a3.hint"));
  const btnNastavitve = gumb("a3-krog a3-nast", icon("sliders-horizontal"), t("a3.viewSettings"));
  const namigVrsta = mk("div", "a3-namig-vrsta");
  namigVrsta.append(namig, btnNastavitve);
  const kartica = mk("section", "a3-kartica");
  kartica.hidden = true;
  kartica.setAttribute("aria-live", "polite");
  const kviz = mk("section", "a3-kviz");
  kviz.hidden = true;
  dno.append(kartica, kviz, namigVrsta);

  const nalaganje = mk("div", "a3-nalaganje");
  nalaganje.setAttribute("role", "status");
  const nalNaslov = mk("b", "", t("a3.loading"));
  const nalBesedilo = mk("p", "", t("a3.loadingText"));
  const nalVrstica = mk("div", "a3-trak");
  const nalPolnilo = mk("i");
  nalVrstica.append(nalPolnilo);
  const nalStevilo = mk("span", "a3-trak-st", "0 %");
  const nalTrakVrsta = mk("div", "a3-trak-vrsta");
  nalTrakVrsta.append(nalVrstica, nalStevilo);
  nalaganje.append(nalNaslov, nalBesedilo, nalTrakVrsta);

  const list = mk("aside", "a3-list");
  list.hidden = true;
  list.setAttribute("role", "dialog");
  list.setAttribute("aria-modal", "false");
  const meni = mk("div", "a3-meni");
  meni.setAttribute("role", "menu");
  meni.hidden = true;

  el.append(oder, vrh, kompas, dno, nalaganje, list, meni);

  // ---------- podatki ----------
  const [strukture, imena, seznam] = await Promise.all([
    fetch(new URL("./atlas-strukture.json", import.meta.url)).then((r) => r.json()),
    fetch(new URL("./atlas-imena.json", import.meta.url))
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({})),
    seznamDatotek(),
  ]);
  // Žensko telo (public/3d/atlas-zenski.json, če obstaja zenski.glb): vrstice ženskih organov in moške strukture, ki
  // se v načinu Žensko skrijejo. Ženski organi so v plasti organov (notranje: sloj »zenski«), moški način jih skrije.
  const zenskiPodatki = seznam.datoteke?.["telo/zenski.glb"]
    ? await fetch(new URL("./atlas-zenski.json", import.meta.url))
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    : null;
  const skrijZensko = zenskiPodatki ? new Set(zenskiPodatki.skrij || []) : null;
  // Koža prsnega koša moškega telesa bi stala pred dojkami: v načinu Žensko jo skrijemo.
  const KOZA_PRSI = /^(Mammary region|Pectoral region|Inframammary region)/;
  for (const r of zenskiPodatki?.strukture || []) {
    r.zenski = true;
    strukture.push(r);
  }
  const vrstice = new Map(); // id → vrstica (+ izpeljano)
  for (const r of strukture) {
    const im = imena[r.ime] || null;
    r.im = im;
    r.prikaz = imeStrukture(r, im, jezik);
    r.la = jezik === "sl" || im?.la ? im?.la || "" : "";
    r.raven = im?.raven || (r.r >= 0.07 ? 1 : r.r >= 0.028 ? 2 : 3);
    // Ovojnice (fascije) so v viru le na delu telesa in zakrijejo mišice: privzeto skrite, pokažejo se ob izbiri.
    r.ovojnica = r.material === "Fascia" || /\bfascia\b/i.test(r.ime);
    r.kljuci = r.pot.map((_, i) => `${r.sistem}/${r.pot.slice(0, i + 1).join("/")}`);
    r.isci = norm([r.prikaz, im?.sl, im?.la, r.ime].filter(Boolean).join(" | "));
    // »mosko« = skrito v načinu Žensko
    r.mosko = !r.zenski && ((skrijZensko ? skrijZensko.has(r.id) : MOSKO.test(r.ime)) || (r.sistem === "koza" && KOZA_PRSI.test(r.id)));
    vrstice.set(r.id, r);
  }
  // Skupine v poti imajo lahko stran (».l«, ».r«): ime brez nje, pridevnik strani kot pri strukturah.
  const imeSkupine = (g) => {
    const st = /\.(l|r)$/.exec(g);
    const base = st ? g.slice(0, -2) : g;
    return imeStrukture({ ime: base, stran: st?.[1] || "" }, imena[base], jezik);
  };

  // Središča plasti in skupin za razmikanje (od središča plasti, skupine ostanejo skupaj).
  const sredisca = new Map();
  for (const r of strukture) {
    for (const k of [r.sistem, `${r.sistem}/${r.pot.slice(0, 2).join("/")}`]) {
      const s = sredisca.get(k) || { v: new THREE.Vector3(), n: 0 };
      s.v.x += r.c[0];
      s.v.y += r.c[1];
      s.v.z += r.c[2];
      s.n++;
      sredisca.set(k, s);
    }
  }
  for (const s of sredisca.values()) s.v.divideScalar(s.n);

  // ---------- stanje ----------
  const sloji = new Map(SLOJI.map((s) => [s.id, { ...s, nalozen: false, nalaganje: null, viden: ZACETNI.includes(s.id), skupine: [], deli: [] }]));
  const deli = new Map(); // id → { row, batch, inst, geo, m0, razred, barva }
  const skrit = new Set();
  const skriteSkupine = new Set();
  let samo = null; // Set id-jev ali null
  let izbran = null;
  let raven = 3;
  let spol = "m";
  let razmik = 0;
  let prerez = { on: false, os: "y", poz: 0.5 };
  let rentgen = false;
  let kvizStanje = null;
  const skupno = { uAlfa: { value: 1 }, uRob: { value: 0 }, uSvetlost: { value: 1 } };
  const materiali = new Map(); // razred → material (vsi BatchedMesh tega razreda)
  const svetSkupno = { uAlfa: { value: 1 }, uRob: { value: 0 }, uSvetlost: { value: 1 }, uObroba: { value: 0.35 } };
  const materialiSij = new Map();
  const ravnina = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1);
  const meje = new THREE.Box3(new THREE.Vector3(-0.45, 0, -0.2), new THREE.Vector3(0.45, 1.8, 0.2));

  // ---------- prizor ----------
  const kit = ustvariSceno(oder, { kakovost, oznaka: t("a3.title"), fov: 32, ponastavi: () => ponastaviPogled(), preveriZakritje: false });
  kit.controls.minDistance = 0.08;
  kit.controls.maxDistance = 6;
  const telo = new THREE.Group();
  kit.scene.add(telo);
  // Modeli imajo zapečeno okluzijo v pregibih (barva oglišč), zato je zaslonska (GTAO) šibkejša, le za stike med deli.
  if (kakovost === "visoka") kit.pripraviAO(0.035, { moc: 0.6 });

  // Studijska svetloba, vezana na kamero (telo je lepo osvetljeno s katere koli strani): topla ključna luč zgoraj levo
  // spredaj, hladna polnilna z desne in obrobna od zadaj (svetel rob loči obris od temnega odra). Okolje (RoomEnvironment
  // iz scena.js) da mehke odboje.
  kit.scene.add(kit.camera);
  const vezi = (luc, poz, cilj, barva, moc) => {
    kit.camera.add(luc, luc.target);
    luc.position.set(...poz);
    luc.target.position.set(...cilj);
    luc.color.set(barva);
    luc.intensity = moc;
  };
  const [kljucna, polnilna] = kit.luci;
  vezi(kljucna, [-1.3, 1.5, 0.7], [0, 0, -1.6], 0xfff0e0, 1.1);
  vezi(polnilna, [1.7, 0.15, 0.5], [0, 0, -1.6], 0xc4d6ff, 0.34);
  vezi(new THREE.DirectionalLight(), [0.5, 1.3, -4.2], [0, 0, -1], 0xdde8ff, 0.9);
  kit.scene.environmentIntensity = 0.62;

  // Mehka senca pod stopali (prelivni krog na tleh, brez senčnih map): telo stoji na odru, ne lebdi.
  const senca = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,0.62)");
    gr.addColorStop(0.35, "rgba(0,0,0,0.38)");
    gr.addColorStop(0.7, "rgba(0,0,0,0.1)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, -0.012, 0.01);
    m.scale.set(0.82, 0.46, 1);
    m.renderOrder = -1;
    m.raycast = () => {};
    return m;
  })();
  kit.scene.add(senca);

  const sij = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
  sij.matrixAutoUpdate = false;
  sij.visible = false;
  sij.renderOrder = 2;
  telo.add(sij);
  // Obris izbranega dela v barvi poudarka: ista geometrija, napihnjena vzdolž normal za stalno število slikovnih točk,
  // narisana s hrbtnimi ploskvami (vidi se le ob robu), plus širši mehak aditivni sij. Dve risanji samo za izbrani del.
  const POUDAREK = new THREE.Color("#6E9BFF");
  const uPx = { value: 0.002 };
  function materialObrisa(px, opacity, aditivno) {
    const m = new THREE.MeshBasicMaterial({ color: POUDAREK, transparent: true, opacity, side: THREE.BackSide, depthWrite: false, toneMapped: false, blending: aditivno ? THREE.AdditiveBlending : THREE.NormalBlending });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uPx = uPx;
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uPx;").replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        mvPosition.xyz += normalize( normalMatrix * normal ) * ( -mvPosition.z ) * uPx * ${px.toFixed(1)};
        gl_Position = projectionMatrix * mvPosition;`,
      );
    };
    m.customProgramCacheKey = () => `a3-obris-${px}`;
    return m;
  }
  const obrisi = [materialObrisa(2.2, 0.95, false), materialObrisa(7, 0.2, true)].map((m, i) => {
    const o = new THREE.Mesh(new THREE.BufferGeometry(), m);
    o.matrixAutoUpdate = false;
    o.renderOrder = 3 + i;
    o.raycast = () => {};
    sij.add(o);
    return o;
  });
  kit.naKorak(() => {
    uPx.value = (2 * Math.tan(THREE.MathUtils.degToRad(kit.camera.fov / 2))) / Math.max(1, kit.velikost.h);
    return false;
  });
  const vidiAO = () => kit.nastaviAO(kakovost === "visoka" && !rentgen && !prerez.on && !izbran && !sloji.get("koza").viden);

  function ponastaviPogled(trajanje = 0.7) {
    pogled(new THREE.Vector3(...POGLEDI.spredaj), { trajanje, cilj: new THREE.Vector3(0, 0.95, 0), polmer: 0.88 });
  }
  function pogled(smer, { trajanje = 0.7, cilj = null, polmer = null } = {}) {
    const c = cilj || kit.controls.target.clone();
    const d = polmer ? kit.fitRazdalja(polmer) : kit.camera.position.distanceTo(kit.controls.target);
    kit.poleti(c, polmer || 1, { smer: smer.clone().normalize(), razdalja: d, trajanje });
  }
  ponastaviPogled(0);

  function material(razred) {
    if (!materiali.has(razred)) materiali.set(razred, ustvariMaterial(razred, kakovost, skupno));
    return materiali.get(razred);
  }

  // ---------- nalaganje plasti ----------
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  async function prenesi(pot, obNapredku) {
    const info = seznam.datoteke?.[pot];
    const url = new URL(`./modeli/${pot}${info?.v ? `?v=${info.v}` : ""}`, import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const skupaj = info?.b || Number(res.headers.get("content-length")) || 0;
    if (!res.body?.getReader) {
      const buf = await res.arrayBuffer();
      obNapredku(buf.byteLength, skupaj || buf.byteLength);
      return buf;
    }
    const reader = res.body.getReader();
    const kosi = [];
    let n = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      kosi.push(value);
      n += value.byteLength;
      obNapredku(n, Math.max(skupaj, n));
    }
    const out = new Uint8Array(n);
    let o = 0;
    for (const k of kosi) {
      out.set(k, o);
      o += k.byteLength;
    }
    return out.buffer;
  }

  // Napredek več hkratnih prenosov v eni vrstici (MB in odstotki).
  const prenosi = new Map();
  function prikaziNapredek() {
    let n = 0;
    let s = 0;
    for (const p of prenosi.values()) {
      n += p.n;
      s += p.s;
    }
    const odst = s ? Math.min(100, Math.round((n / s) * 100)) : 0;
    nalPolnilo.style.width = `${odst}%`;
    nalStevilo.textContent = `${odst} %`;
    nalBesedilo.textContent = t("a3.loadingMb", { n: mb(n), s: mb(s) });
    nalaganje.hidden = prenosi.size === 0;
  }

  // Zrcaljeni deli v izvozu (večina ».l« mišic in kosti, ».r« žil, del živcev z vsake strani) imajo obrnjen vrstni red
  // oglišč in normale navznoter:
  // s privzetim izločanjem hrbtnih ploskev se vidi notranjost zadnje stene (napačna senca, tanke ovojnice izginejo,
  // obris izbranega dela prekrije cel del). Predznačena prostornina (glede na središče, kar v surovih celih številih
  // kvantizacije) je pri pravilno obrnjeni zaprti mreži pozitivna; zrcaljeno stran obrnemo ob nalaganju (~1 ms na 100k trikotnikov).
  const surovo = (a) => (a.isInterleavedBufferAttribute ? [a.data.array, a.data.stride, a.offset] : [a.array, a.itemSize, 0]);
  function predznacenaProstornina(g) {
    const [p, k, o] = surovo(g.attributes.position);
    const ix = g.index.array;
    const n = g.attributes.position.count;
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < n; i++) {
      cx += p[i * k + o];
      cy += p[i * k + o + 1];
      cz += p[i * k + o + 2];
    }
    cx /= n;
    cy /= n;
    cz /= n;
    let v = 0;
    for (let t = 0; t < ix.length; t += 3) {
      const a = ix[t] * k + o, b = ix[t + 1] * k + o, c = ix[t + 2] * k + o;
      const ax = p[a] - cx, ay = p[a + 1] - cy, az = p[a + 2] - cz;
      const bx = p[b] - cx, by = p[b + 1] - cy, bz = p[b + 2] - cz;
      const qx = p[c] - cx, qy = p[c + 1] - cy, qz = p[c + 2] - cz;
      v += ax * (by * qz - bz * qy) + ay * (bz * qx - bx * qz) + az * (bx * qy - by * qx);
    }
    return v;
  }
  function obrniVrstniRed(g) {
    const ix = g.index.array;
    for (let t = 0; t < ix.length; t += 3) {
      const x = ix[t + 1];
      ix[t + 1] = ix[t + 2];
      ix[t + 2] = x;
    }
    g.index.needsUpdate = true;
  }
  // Ali se normale oglišč ujemajo z vrstnim redom oglišč (vsota normala · ploskovna normala). Vrstni red in normale v
  // izvozu nista vedno obrnjena skupaj: pri delu zrcaljenih mišic (npr. desna zunanja poševna trebušna mišica) je bil
  // obrnjen samo vrstni red, zato je skupno obračanje normale postavilo navznoter (polovica telesa temna in mlečna).
  function soglasjeNormal(g) {
    const [p, k, o] = surovo(g.attributes.position);
    const [n, kn, on] = surovo(g.attributes.normal);
    const ix = g.index.array;
    let s = 0;
    for (let t = 0; t < ix.length; t += 3) {
      const a = ix[t], b = ix[t + 1], c = ix[t + 2];
      const ax = p[a * k + o], ay = p[a * k + o + 1], az = p[a * k + o + 2];
      const ux = p[b * k + o] - ax, uy = p[b * k + o + 1] - ay, uz = p[b * k + o + 2] - az;
      const wx = p[c * k + o] - ax, wy = p[c * k + o + 1] - ay, wz = p[c * k + o + 2] - az;
      const nx = n[a * kn + on] + n[b * kn + on] + n[c * kn + on];
      const ny = n[a * kn + on + 1] + n[b * kn + on + 1] + n[c * kn + on + 1];
      const nz = n[a * kn + on + 2] + n[b * kn + on + 2] + n[c * kn + on + 2];
      s += Math.sign(nx * (uy * wz - uz * wy) + ny * (uz * wx - ux * wz) + nz * (ux * wy - uy * wx));
    }
    return s;
  }
  function obrniNormale(g) {
    const nrm = g.attributes.normal;
    const [a, k, o] = surovo(nrm);
    const maks = a instanceof Int16Array ? 32767 : a instanceof Int8Array ? 127 : Infinity;
    for (let i = 0; i < nrm.count; i++) for (let j = 0; j < 3; j++) a[i * k + o + j] = Math.min(maks, -a[i * k + o + j]);
    nrm.needsUpdate = true;
  }

  function sestavi(sloj, gltf) {
    gltf.scene.updateMatrixWorld(true);
    const json = gltf.parser.json;
    const assoc = gltf.parser.associations;
    const kandidati = [];
    const videno = new Set();
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      let n = o;
      let idx;
      while (n && (idx = assoc.get(n)?.nodes) === undefined) n = n.parent;
      const node = idx !== undefined ? json.nodes[idx] : null;
      const id = o.userData?.zid || node?.extras?.zid || node?.name || o.name;
      const row = vrstice.get(id);
      if (!row) return;
      const g = o.geometry;
      for (const a of Object.keys(g.attributes)) if (a !== "position" && a !== "normal" && a !== "color") g.deleteAttribute(a);
      if (!g.attributes.normal) g.computeVertexNormals();
      // Zapečena okluzija (COLOR_0, siva RGBA8): vse geometrije v istem BatchedMesh morajo imeti iste lastnosti, zato
      // dobi del brez nje (npr. zenski.glb) belo (brez zatemnitve) v enaki obliki.
      if (!g.attributes.color) g.setAttribute("color", new THREE.BufferAttribute(new Uint8Array(g.attributes.position.count * 4).fill(255), 4, true));
      if (!g.index) {
        const n2 = g.attributes.position.count;
        g.setIndex([...Array(n2).keys()]);
      }
      // Zrcalni par (».l« in ».r«) ima v izvozu lahko skupen seznam indeksov ali normal; obračanje enega bi obrnilo tudi
      // drugega (desna polovica mišic je bila zato temna), zato vsak del dobi svojo kopijo.
      if (videno.has(g.index.array)) g.setIndex(new THREE.BufferAttribute(g.index.array.slice(), 1));
      videno.add(g.index.array);
      const nrmA = g.attributes.normal.isInterleavedBufferAttribute ? g.attributes.normal.data.array : g.attributes.normal.array;
      if (videno.has(nrmA)) g.setAttribute("normal", g.attributes.normal.clone());
      else videno.add(nrmA);
      g.computeBoundingBox();
      g.computeBoundingSphere();
      const t0 = tkivo(row);
      const sig = ["position", "normal", "color"].map((a) => `${g.attributes[a].array.constructor.name}${g.attributes[a].itemSize}${g.attributes[a].normalized}`).join("|");
      kandidati.push({ row, g, m0: o.matrixWorld.clone(), razred: t0.razred, barva: t0.barva, kljuc: `${t0.razred}|${sig}`, v: predznacenaProstornina(g) });
    });
    // Zaprte mreže z negativno prostornino so zrcaljene navznoter: obrnemo jih. Odprte ploskve (ovojnice) nimajo
    // zanesljivega predznaka; njihov material je dvostranski (tkiva.js), zato smer zanje ni pomembna.
    // Normale nato poravnamo z (popravljenim) vrstnim redom, za vse dele, tudi ovojnice (dvostranski material obrne
    // normalo na hrbtni strani, zato mora biti na sprednji pravilna).
    // Zapečena senca (scripts/atlas/izvozi-z-anatomy.py) je iz normal: pri delu z normalami navznoter v viru je izbočeno
    // brala kot vdolbino (večina leve polovice enakomerno temnejša, pregibi napačni). Pravilna senca izbočene mišice ali
    // kosti je skoraj povsod 1, zato pri zrcalnem paru z enako zgradbo (preverimo nekaj oglišč, zrcaljenih čez sredino)
    // temnejšo senco prepišemo s svetlejše.
    const poId = new Map(kandidati.map((k) => [k.row.id, k]));
    const pv = new THREE.Vector3(), pw = new THREE.Vector3();
    for (const k of kandidati) {
      const st = /\.(l|r)$/.exec(k.row.id);
      const par = st && poId.get(k.row.id.slice(0, -1) + (st[1] === "l" ? "r" : "l"));
      if (!par) continue;
      const P = k.g.attributes.position, Q = par.g.attributes.position;
      if (P.count !== Q.count || !k.g.attributes.color || !par.g.attributes.color) continue;
      const povp = (A) => {
        let v = 0;
        for (let i = 0; i < A.count; i++) v += A.getX(i);
        return v / Math.max(1, A.count);
      };
      if (povp(par.g.attributes.color) - povp(k.g.attributes.color) < 0.02) continue;
      let enako = true;
      for (let j = 0; j < 9 && enako; j++) {
        const i = Math.floor((j / 9) * P.count);
        pv.fromBufferAttribute(P, i).applyMatrix4(k.m0);
        pw.fromBufferAttribute(Q, i).applyMatrix4(par.m0);
        enako = Math.abs(Math.abs(pv.x) - Math.abs(pw.x)) + Math.abs(pv.y - pw.y) + Math.abs(pv.z - pw.z) < 0.003;
      }
      if (!enako) continue;
      const C = k.g.attributes.color, D = par.g.attributes.color;
      for (let i = 0; i < C.count; i++) C.setXYZW(i, D.getX(i), D.getY(i), D.getZ(i), D.getW(i));
      C.needsUpdate = true;
    }
    for (const k of kandidati) {
      if (k.v < 0 && k.razred !== "ovojnica") obrniVrstniRed(k.g);
      if (soglasjeNormal(k.g) < 0) obrniNormale(k.g);
    }
    const skupine = new Map();
    for (const k of kandidati) {
      if (!skupine.has(k.kljuc)) skupine.set(k.kljuc, []);
      skupine.get(k.kljuc).push(k);
    }
    for (const [, seznamK] of skupine) {
      const v = seznamK.reduce((a, k) => a + k.g.attributes.position.count, 0);
      const i = seznamK.reduce((a, k) => a + k.g.index.count, 0);
      const mat = material(seznamK[0].razred);
      const bm = new THREE.BatchedMesh(seznamK.length, v, i, mat);
      bm.perObjectFrustumCulled = true;
      bm.sortObjects = !!mat.transparent;
      bm.userData.sloj = sloj.id;
      for (const k of seznamK) {
        const gid = bm.addGeometry(k.g);
        const inst = bm.addInstance(gid);
        bm.setMatrixAt(inst, k.m0);
        bm.setColorAt(inst, k.barva);
        const del = { row: k.row, batch: bm, inst, geo: k.g, m0: k.m0, m: k.m0.clone(), razred: k.razred, barva: k.barva, sloj: sloj.id };
        bm.userData[inst] = del;
        deli.set(k.row.id, del);
        sloj.deli.push(del);
      }
      sloj.skupine.push(bm);
      telo.add(bm);
    }
  }

  async function naloziSloj(id) {
    const sloj = sloji.get(id);
    if (!sloj || sloj.nalozen) return;
    if (sloj.nalaganje) return sloj.nalaganje;
    // Podrobni modeli (telo-hd) na računalniku; ženski organi in plast, ki je v telo-hd ni, vedno iz telo/.
    const potTelo = id === "zenski" ? "telo/zenski.glb" : `telo/${id}.glb`;
    const pot = mapa === "telo-hd" && id !== "zenski" && seznam.datoteke?.[`telo-hd/${id}.glb`] ? `telo-hd/${id}.glb` : potTelo;
    const preberi = async (p) => {
      prenosi.set(id, { n: 0, s: seznam.datoteke?.[p]?.b || 0 });
      prikaziNapredek();
      const buf = await prenesi(p, (n, s) => {
        prenosi.set(id, { n, s });
        prikaziNapredek();
        osveziPlasti(); // MB v vrstici plasti (Brskaj)
      });
      return loader.parseAsync(buf, "");
    };
    sloj.nalaganje = (async () => {
      prenosi.set(id, { n: 0, s: seznam.datoteke?.[pot]?.b || 0 });
      prikaziNapredek();
      osveziPlasti();
      try {
        let gltf;
        try {
          gltf = await preberi(pot);
        } catch (err) {
          if (pot === potTelo) throw err;
          console.warn(`3D atlas: podrobna plast ${id} ni na voljo, nalagam telo/`, err);
          gltf = await preberi(potTelo);
        }
        sestavi(sloj, gltf);
        sloj.nalozen = true;
        uporabiRazmik();
        uporabiVidnost();
      } catch (err) {
        console.error(`3D atlas: plast ${id}`, err);
        sloj.napaka = true;
        sloj.viden = false;
        sporocilo(t("a3.loadError"));
      } finally {
        prenosi.delete(id);
        prikaziNapredek();
        sloj.nalaganje = null;
        osveziPlasti();
        kit.narisi();
      }
    })();
    osveziPlasti(); // zdaj je sloj.nalaganje nastavljen: vrstica pokaže »Nalaganje …«
    return sloj.nalaganje;
  }

  if (zenskiPodatki) sloji.set("zenski", { id: "zenski", nalozen: false, nalaganje: null, viden: false, skupine: [], deli: [], skrit: true });

  // ---------- vidnost ----------
  function viden(del) {
    const r = del.row;
    const s = sloji.get(del.sloj);
    if (!s?.viden) return false;
    if (del.sloj === "zenski" && (spol !== "z" || !sloji.get("organi").viden)) return false;
    if (spol === "z" && r.mosko) return false;
    if (r.raven > raven) return false;
    if (skrit.has(r.id)) return false;
    if (r.ovojnica && !ovojnice && !(samo && samo.has(r.id))) return false;
    if (samo && !samo.has(r.id)) return false;
    for (const k of r.kljuci) if (skriteSkupine.has(k)) return false;
    return true;
  }
  let ovojnice = false; // fascije pokažemo, ko jih uporabnik izbere v iskanju ali Brskaj
  let stVidnih = 0;
  function uporabiVidnost() {
    if (sloji.has("zenski")) sloji.get("zenski").viden = spol === "z";
    let n = 0;
    for (const d of deli.values()) {
      const v = viden(d);
      if (v) n++;
      d.batch.setVisibleAt(d.inst, v && d.row.id !== izbran);
    }
    stVidnih = n;
    stevec.textContent = t("a3.visible", { n });
    stevec.classList.toggle("on", !!(samo || skrit.size || skriteSkupine.size));
    btnVse.hidden = !(samo || skrit.size || skriteSkupine.size);
    if (izbran && deli.has(izbran) && !viden(deli.get(izbran))) izberi(null);
    vidiAO();
    kit.narisi();
  }

  // Razmikanje: od središča plasti (skupine ostanejo skupaj) in znotraj skupine, gladko ob drsniku.
  const _o = new THREE.Vector3();
  const _m = new THREE.Matrix4();
  function odmik(row, f, out) {
    const cl = sredisca.get(row.sistem)?.v;
    const cg = sredisca.get(`${row.sistem}/${row.pot.slice(0, 2).join("/")}`)?.v;
    if (!cl || !cg || !f) return out.set(0, 0, 0);
    out.set(cg.x - cl.x, (cg.y - cl.y) * 0.8, cg.z - cl.z).multiplyScalar(0.7 * f);
    out.x += (row.c[0] - cg.x) * 0.9 * f;
    out.y += (row.c[1] - cg.y) * 0.75 * f;
    out.z += (row.c[2] - cg.z) * 0.9 * f;
    return out;
  }
  function uporabiRazmik() {
    for (const d of deli.values()) {
      odmik(d.row, razmik, _o);
      d.m.copy(d.m0).premultiply(_m.makeTranslation(_o.x, _o.y, _o.z));
      d.batch.setMatrixAt(d.inst, d.m);
    }
    if (izbran && deli.has(izbran)) sij.matrix.copy(deli.get(izbran).m);
    sij.matrixWorldNeedsUpdate = true;
    kit.narisi();
  }
  const sredisceDela = (d) => odmik(d.row, razmik, new THREE.Vector3()).add(new THREE.Vector3(...d.row.c));

  // Material za vse sloje: prosojnost (rentgen), zatemnitev, prerez (obe strani ploskev, da se vidi notranjost).
  const svetlostOstalih = () => (izbran && !rentgen ? 0.3 : 1);
  function uporabiMateriale() {
    const ravnine = prerez.on ? [ravnina] : null;
    for (const o of obrisi) {
      if ((o.material.clippingPlanes?.length || 0) !== (ravnine?.length || 0)) {
        o.material.clippingPlanes = ravnine;
        o.material.needsUpdate = true;
      }
    }
    skupno.uRob.value = rentgen ? 1 : 0;
    skupno.uAlfa.value = rentgen ? 0.06 : 1;
    skupno.uSvetlost.value = svetlostOstalih();
    for (const m of [...materiali.values(), ...materialiSij.values()]) {
      const osnova = m.userData.osnovaProsojnost;
      const jeSij = m.userData.sij;
      const prosojen = (rentgen && !jeSij) || osnova < 1;
      const strani = prerez.on || m.userData.dvostransko ? THREE.DoubleSide : THREE.FrontSide;
      if (m.transparent !== prosojen || m.side !== strani || (m.clippingPlanes?.length || 0) !== (ravnine?.length || 0)) {
        m.transparent = prosojen;
        m.depthWrite = !prosojen;
        m.side = strani;
        m.clippingPlanes = ravnine;
        m.needsUpdate = true;
      }
      if (!jeSij) m.opacity = osnova;
    }
    for (const s of sloji.values()) for (const bm of s.skupine) bm.sortObjects = bm.material.transparent;
    vidiAO();
    kit.narisi();
  }
  function uporabiPrerez() {
    const os = prerez.os;
    const n = os === "y" ? [0, -1, 0] : os === "z" ? [0, 0, -1] : [-1, 0, 0];
    const lo = meje.min[os];
    const hi = meje.max[os];
    ravnina.normal.set(...n);
    ravnina.constant = lo + (hi - lo) * prerez.poz;
    uporabiMateriale();
  }

  // ---------- izbira ----------
  function materialSij(razred) {
    if (!materialiSij.has(razred)) {
      const m = ustvariMaterial(razred, kakovost, svetSkupno);
      m.userData.sij = true;
      m.emissiveIntensity = 1; // emissive = barva dela × 0,06 (izberi): izbrani del rahlo zažari v svoji barvi
      if (m.transparent) {
        m.transparent = false;
        m.opacity = 1;
        m.depthWrite = true;
      }
      m.userData.osnovaProsojnost = 1;
      materialiSij.set(razred, m);
    }
    return materialiSij.get(razred);
  }

  function izberi(id, { leti = true, tiho = false } = {}) {
    const prej = izbran;
    izbran = id && deli.has(id) ? id : null;
    if (prej && deli.has(prej)) {
      const d = deli.get(prej);
      d.batch.setVisibleAt(d.inst, viden(d));
    }
    if (!izbran) {
      sij.visible = false;
      kartica.hidden = true;
      uporabiMateriale();
      return;
    }
    const d = deli.get(izbran);
    d.batch.setVisibleAt(d.inst, false);
    sij.geometry = d.geo;
    for (const o of obrisi) o.geometry = d.geo;
    if (lebdiId === izbran) oznaciLebdenje(null);
    sij.material = materialSij(d.razred);
    sij.material.color.copy(d.barva);
    sij.material.emissive.copy(d.barva).multiplyScalar(0.06);
    sij.matrix.copy(d.m);
    sij.matrixWorldNeedsUpdate = true;
    sij.visible = true;
    uporabiMateriale();
    if (!tiho) pokaziKartico(d.row);
    if (leti) poletiK(sredisceDela(d), Math.max(0.03, d.row.r * 0.55));
  }

  // Prelet do dela tako, da je del na sredini prostega dela zaslona (med glavo in kartico ali namigom).
  function poletiK(c, polmer) {
    const { h } = kit.velikost;
    const r = el.getBoundingClientRect();
    const zgoraj = vrh.getBoundingClientRect().bottom - r.top;
    // Na širokem zaslonu je kartica levo spodaj (ne pokrije sredine), na telefonu čez vso širino.
    const ozek = dno.getBoundingClientRect().width > r.width * 0.7;
    const spodnji = ozek && !kartica.hidden ? kartica : ozek && !kviz.hidden ? kviz : namigVrsta;
    const spodaj = spodnji.getBoundingClientRect().top - r.top;
    const prostor = Math.max(120, spodaj - zgoraj);
    const tan = Math.tan(THREE.MathUtils.degToRad(kit.camera.fov / 2));
    const d = Math.max((polmer / tan) * (h / prostor), polmer / (tan * kit.camera.aspect)) * 1.12;
    const naPx = (2 * Math.tan(THREE.MathUtils.degToRad(kit.camera.fov / 2)) * d) / h;
    const dy = (zgoraj + prostor / 2 - h / 2) * naPx; // del mora biti dy nižje od sredine zaslona
    const smer = kit.camera.position.clone().sub(kit.controls.target).normalize();
    const gor = new THREE.Vector3(0, 1, 0).addScaledVector(smer, -smer.y).normalize();
    kit.poleti(c.clone().addScaledVector(gor, dy), polmer, { smer, razdalja: d });
  }

  function pokaziKartico(r) {
    kartica.replaceChildren();
    const sloj = SLOJI.find((s) => s.id === r.sistem);
    const pot = mk("nav", "a3-pot");
    pot.style.setProperty("--barva", sloj?.barva || "#6E9BFF");
    pot.setAttribute("aria-label", t("a3.breadcrumb"));
    pot.textContent = [t(`a3.l.${r.sistem}`), ...r.pot.slice(1).map(imeSkupine)].join(" › ");
    pot.title = pot.textContent;
    const vrhK = mk("div", "a3-k-vrh");
    const naslov = mk("h2", "", r.prikaz);
    const x = gumb("a3-krog a3-mali-krog", icon("x"), t("a3.close"));
    x.addEventListener("click", () => izberi(null));
    vrhK.append(naslov, x);
    kartica.append(pot, vrhK);
    if (r.la) kartica.append(mk("p", "a3-latinsko", r.la));
    if (r.im?.opis && jezik === "sl") kartica.append(mk("p", "a3-opis", r.im.opis));
    const akcije = mk("div", "a3-akcije");
    const bSkrij = gumb("a3-pill a3-mali", `${icon("eye-off")}<span>${t("a3.hide")}</span>`);
    bSkrij.addEventListener("click", () => {
      skrit.add(r.id);
      izberi(null);
      uporabiVidnost();
    });
    const bSamo = gumb("a3-pill a3-mali", `${icon("focus")}<span>${t("a3.only")}</span>`);
    bSamo.addEventListener("click", () => {
      samo = new Set([r.id]);
      uporabiVidnost();
      izberi(r.id, { leti: true });
    });
    const bVprasaj = gumb("a3-pill a3-mali a3-glavni", `${icon("message-circle")}<span>${t("a3.ask")}</span>`);
    bVprasaj.addEventListener("click", () => vprasaj(r));
    akcije.append(bSkrij, bSamo, bVprasaj);
    kartica.append(akcije);
    kartica.hidden = false;
  }

  // »Vprašaj inštruktorja«: v okvirju aplikacije (3D svet v »Uči se«) sporočilo strani okoli okvirja, v aplikaciji
  // (WebView) sporočilo aplikaciji, na spletu klepet z vnaprej vpisanim vprašanjem.
  function vprasaj(r) {
    const ime = r.la ? `${r.prikaz} (${r.la})` : r.prikaz;
    const besedilo = t("a3.askText", { ime });
    if (vgrajeno) {
      starsu({ tip: "vprasaj", besedilo });
      return;
    }
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ tip: "vprasaj", besedilo }));
      return;
    }
    location.href = `/?pogled=chat&vprasaj=${encodeURIComponent(besedilo)}`;
  }

  // Tap na model: izbira (ali odgovor v kvizu »Najdi strukturo«).
  const vidniObjekti = () => [...[...sloji.values()].flatMap((s) => (s.viden ? s.skupine : [])), ...(sij.visible ? [sij] : [])];
  function zadetek(ndc) {
    const hits = kit.zadetki(ndc, vidniObjekti(), (h) => !prerez.on || ravnina.distanceToPoint(h.point) >= 0);
    const h = hits[0];
    if (!h) return null;
    if (h.object === sij) return izbran;
    return h.object.userData[h.batchId]?.row.id || null;
  }
  kit.naTap((ndc) => {
    const id = zadetek(ndc);
    zapriPlavajoce();
    if (kvizStanje?.nacin === "najdi" && !kvizStanje.odgovorjeno) return odgovorNajdi(id);
    if (kvizStanje) return;
    izberi(id && id !== izbran ? id : null);
  });

  // Namig ob kazalcu (računalnik z miško): ime strukture pod kazalcem in rahlo osvetljen del. Med kvizom ga ni (izdal bi
  // odgovor). Žarek gre največ ~10-krat na sekundo in le, ko se miška premakne brez pritisnjenega gumba.
  const lebdi = mk("div", "a3-lebdi");
  lebdi.hidden = true;
  lebdi.setAttribute("aria-hidden", "true");
  kit.plast.append(lebdi);
  let lebdiId = null;
  let lebdiXY = null;
  let lebdiPremik = false;
  let lebdiCas = 0;
  const _barva = new THREE.Color();
  function oznaciLebdenje(id) {
    if (id === lebdiId) return;
    if (lebdiId && deli.has(lebdiId)) {
      const d = deli.get(lebdiId);
      d.batch.setColorAt(d.inst, d.barva);
    }
    lebdiId = id;
    if (id && deli.has(id) && id !== izbran) {
      const d = deli.get(id);
      d.batch.setColorAt(d.inst, _barva.copy(d.barva).multiplyScalar(1.3).lerp(POUDAREK, 0.14));
    }
    if (!id) lebdi.hidden = true;
    kit.narisi();
  }
  if (typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    kit.canvas.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      lebdiXY = { x: e.clientX, y: e.clientY, gumbi: e.buttons };
      lebdiPremik = true;
    });
    const ugasni = () => {
      lebdiXY = null;
      oznaciLebdenje(null);
    };
    kit.canvas.addEventListener("pointerleave", ugasni);
    kit.canvas.addEventListener("pointerdown", ugasni);
    kit.naKorak((_dt, cas) => {
      if (!lebdiPremik || !lebdiXY || cas - lebdiCas < 0.09) return false;
      lebdiPremik = false;
      lebdiCas = cas;
      if (lebdiXY.gumbi || kvizStanje) return oznaciLebdenje(null), false;
      const r = kit.canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(((lebdiXY.x - r.left) / r.width) * 2 - 1, -((lebdiXY.y - r.top) / r.height) * 2 + 1);
      const id = zadetek(ndc);
      oznaciLebdenje(id);
      const row = id && vrstice.get(id);
      if (row) {
        lebdi.textContent = row.prikaz;
        lebdi.style.transform = `translate(${Math.round(lebdiXY.x - r.left + 14)}px, ${Math.round(lebdiXY.y - r.top + 18)}px)`;
        lebdi.hidden = false;
      }
      return false;
    });
  }

  // ---------- kompas ----------
  const _q = new THREE.Quaternion();
  const _v = new THREE.Vector3();
  kit.naKorak(() => {
    _q.copy(kit.camera.quaternion).invert();
    const R = 24;
    const vrstni = kompasGumbi.map((k) => {
      _v.copy(k.d).applyQuaternion(_q);
      return { k, x: _v.x, y: _v.y, z: _v.z };
    });
    vrstni.sort((a, b) => a.z - b.z);
    vrstni.forEach((o, i) => {
      o.k.b.style.transform = `translate(${(o.x * R).toFixed(1)}px, ${(-o.y * R).toFixed(1)}px)`;
      o.k.b.style.zIndex = String(i + 1);
      o.k.b.classList.toggle("zadaj", o.z < -0.2);
    });
    return false;
  });

  // ---------- iskanje ----------
  let izbranRez = -1;
  function isci() {
    const q = norm(vnos.value.trim());
    rezultati.replaceChildren();
    izbranRez = -1;
    if (q.length < 2) {
      rezultati.hidden = true;
      vnos.setAttribute("aria-expanded", "false");
      return;
    }
    const besede = q.split(/\s+/);
    const zadetki = [];
    for (const r of vrstice.values()) {
      if (r.zenski && spol !== "z") continue;
      if (besede.every((b) => r.isci.includes(b))) zadetki.push(r);
    }
    zadetki.sort((a, b) => (norm(a.prikaz).startsWith(q) ? 0 : 1) - (norm(b.prikaz).startsWith(q) ? 0 : 1) || a.raven - b.raven || b.r - a.r);
    if (!zadetki.length) {
      const li = mk("li", "a3-rez-prazno", t("a3.noResults"));
      rezultati.append(li);
    }
    for (const r of zadetki.slice(0, 40)) {
      const li = mk("li", "a3-rez");
      li.setAttribute("role", "option");
      li.id = `a3-rez-${rezultati.childElementCount}`;
      const b = mk("b", "", r.prikaz);
      const s = mk("small", "", [r.la, t(`a3.l.${r.sistem}`)].filter(Boolean).join(" · "));
      li.append(b, s);
      li.addEventListener("mousedown", (e) => e.preventDefault());
      li.addEventListener("click", () => izberiIzSeznama(r.id));
      rezultati.append(li);
    }
    rezultati.hidden = false;
    vnos.setAttribute("aria-expanded", "true");
  }
  vnos.addEventListener("input", isci);
  vnos.addEventListener("focus", () => {
    zapriPlavajoce(true);
    if (vnos.value) isci();
  });
  vnos.addEventListener("blur", () =>
    setTimeout(() => {
      rezultati.hidden = true;
      vnos.setAttribute("aria-expanded", "false");
    }, 120),
  );
  vnos.addEventListener("keydown", (e) => {
    const vsi = [...rezultati.querySelectorAll(".a3-rez")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!vsi.length) return;
      izbranRez = (izbranRez + (e.key === "ArrowDown" ? 1 : -1) + vsi.length) % vsi.length;
      vsi.forEach((li, i) => li.setAttribute("aria-selected", String(i === izbranRez)));
      vnos.setAttribute("aria-activedescendant", vsi[izbranRez].id);
      vsi[izbranRez].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      (vsi[izbranRez] || vsi[0])?.click();
    } else if (e.key === "Escape") {
      vnos.value = "";
      isci();
    }
  });
  async function izberiIzSeznama(id) {
    const r = vrstice.get(id);
    if (!r) return;
    rezultati.hidden = true;
    vnos.blur();
    zapriList();
    const s = sloji.get(r.zenski ? "zenski" : r.sistem);
    if (r.zenski) spol = "z";
    else if (r.mosko && spol === "z") spol = "m"; // moška struktura iz iskanja: preklop na moško telo
    if (!s.viden) {
      s.viden = true;
    }
    if (r.zenski) sloji.get("organi").viden = true;
    skrit.delete(id);
    if (r.ovojnica) ovojnice = true;
    for (const k of r.kljuci) skriteSkupine.delete(k);
    if (samo && !samo.has(id)) samo = null;
    if (r.raven > raven) raven = 3;
    await naloziSloj(s.id);
    uporabiVidnost();
    osveziPlasti();
    izberi(id);
  }

  // ---------- listi (Brskaj, Nastavitve pogleda, Učenje, Viri) ----------
  let odprtList = null;
  function odpriList(vrsta, naslov, vsebina) {
    zapriPlavajoce();
    list.replaceChildren();
    list.dataset.vrsta = vrsta;
    const v = mk("div", "a3-list-vrh");
    const h = mk("h2", "", naslov);
    h.id = `a3-list-${vrsta}`;
    const x = gumb("a3-krog", icon("x"), t("a3.close"));
    x.addEventListener("click", zapriList);
    v.append(h, x);
    const telo2 = mk("div", "a3-list-telo");
    telo2.append(vsebina);
    list.append(v, telo2);
    list.setAttribute("aria-labelledby", h.id);
    list.hidden = false;
    el.classList.add("a3-list-odprt");
    odprtList = vrsta;
    x.focus({ preventScroll: true });
  }
  function zapriList() {
    if (list.hidden) return;
    list.hidden = true;
    el.classList.remove("a3-list-odprt");
    const prej = odprtList;
    odprtList = null;
    ({ brskaj: btnBrskaj, nastavitve: btnNastavitve, uci: btnUci, viri: btnMeni })[prej]?.focus({ preventScroll: true });
  }
  function zapriPlavajoce(obdrziIskanje = false) {
    meni.hidden = true;
    btnMeni.setAttribute("aria-expanded", "false");
    if (!obdrziIskanje) rezultati.hidden = true;
  }

  // Brskaj: plasti in drevo skupin s prikazom/skrivanjem.
  let plastiEl = null;
  function osveziPlasti() {
    if (!plastiEl) return;
    for (const row of plastiEl.querySelectorAll("[data-sloj]")) {
      const s = sloji.get(row.dataset.sloj);
      const sw = row.querySelector(".switch");
      sw.setAttribute("aria-checked", String(s.viden));
      row.classList.toggle("nalaga", !!s.nalaganje);
      const st = row.querySelector("small");
      const p = prenosi.get(s.id);
      st.textContent = s.nalaganje ? (p ? t("a3.loadingMb", { n: mb(p.n), s: mb(p.s) }) : t("a3.loading")) : s.napaka ? t("a3.loadError") : t("a3.structures", { n: strukture.filter((r) => r.sistem === s.id).length });
    }
  }
  async function preklopiSloj(id, on) {
    const s = sloji.get(id);
    s.viden = on;
    s.napaka = false;
    osveziPlasti();
    if (on && !s.nalozen) await naloziSloj(id);
    uporabiVidnost();
    osveziPlasti();
    if (id === "koza") vidiAO();
  }
  function brskaj() {
    const box = mk("div", "a3-brskaj-telo");
    box.append(mk("h3", "a3-podnaslov", t("a3.layers")));
    plastiEl = mk("div", "a3-plasti");
    for (const s of SLOJI) {
      const row = mk("div", "a3-plast");
      row.dataset.sloj = s.id;
      const ic = mk("span", "a3-plast-ic");
      ic.style.setProperty("--barva", s.barva);
      ic.innerHTML = icon(s.ikona);
      const txt = mk("span", "a3-plast-txt");
      txt.append(mk("b", "", t(`a3.l.${s.id}`)), mk("small", ""));
      const sw = mk("button", "switch");
      sw.type = "button";
      sw.setAttribute("role", "switch");
      sw.setAttribute("aria-label", t(`a3.l.${s.id}`));
      sw.addEventListener("click", () => preklopiSloj(s.id, !sloji.get(s.id).viden));
      row.append(ic, txt, sw);
      plastiEl.append(row);
    }
    box.append(plastiEl);
    osveziPlasti();
    box.append(mk("h3", "a3-podnaslov", t("a3.groups")));
    const drevo = mk("ul", "a3-drevo");
    drevo.setAttribute("role", "tree");
    drevo.setAttribute("aria-label", t("a3.groups"));
    // Drevo iz poti: plast → skupine → strukture; otroci se izrišejo šele ob odprtju.
    const koren = new Map();
    for (const r of strukture) {
      let raven2 = koren;
      let kljuc = r.sistem;
      if (!raven2.has(kljuc)) raven2.set(kljuc, { ime: t(`a3.l.${r.sistem}`), kljuc, otroci: new Map(), listi: [], st: 0, sloj: r.sistem });
      let vozel = raven2.get(kljuc);
      vozel.st++;
      for (const g of r.pot.slice(1)) {
        kljuc += `/${g}`;
        if (!vozel.otroci.has(kljuc)) vozel.otroci.set(kljuc, { ime: imeSkupine(g), kljuc, otroci: new Map(), listi: [], st: 0, sloj: r.sistem });
        vozel = vozel.otroci.get(kljuc);
        vozel.st++;
      }
      vozel.listi.push(r);
    }
    // Ključi skupin v vrsticah so »sistem/pot[0]/…«; drevo preskoči pot[0] (ime plasti), zato preslikamo.
    const kljucSkrivanja = (vozel) => {
      if (!vozel.kljuc.includes("/")) return null; // plast: stikalo plasti
      const r = najdiPrvo(vozel);
      const deliPoti = vozel.kljuc.split("/").slice(1);
      return `${r.sistem}/${[r.pot[0], ...deliPoti].join("/")}`;
    };
    const najdiPrvo = (v) => v.listi[0] || najdiPrvo(v.otroci.values().next().value);
    function vrsticaDrevesa(v, globina) {
      const li = mk("li", "a3-vozel");
      li.setAttribute("role", "treeitem");
      li.setAttribute("aria-expanded", "false");
      li.style.setProperty("--g", globina);
      const vrst = mk("div", "a3-vozel-vrsta");
      const odpri = gumb("a3-odpri", icon("chevron-right"), `${t("a3.expand")}: ${v.ime}`);
      const ime = mk("span", "a3-vozel-ime", v.ime);
      const st = mk("small", "", String(v.st));
      const k = kljucSkrivanja(v);
      const oko = gumb("a3-oko", icon("eye"), `${t("a3.toggleGroup")}: ${v.ime}`);
      const osveziOko = () => {
        const skrito = k ? skriteSkupine.has(k) : !sloji.get(v.sloj).viden;
        oko.innerHTML = icon(skrito ? "eye-off" : "eye");
        oko.setAttribute("aria-pressed", String(!skrito));
        li.classList.toggle("skrito", skrito);
      };
      oko.addEventListener("click", async () => {
        if (!k) await preklopiSloj(v.sloj, !sloji.get(v.sloj).viden);
        else {
          if (skriteSkupine.has(k)) skriteSkupine.delete(k);
          else skriteSkupine.add(k);
          if (!sloji.get(v.sloj).viden) await preklopiSloj(v.sloj, true);
          uporabiVidnost();
        }
        osveziOko();
      });
      osveziOko();
      vrst.append(odpri, ime, st, oko);
      li.append(vrst);
      let ul = null;
      odpri.addEventListener("click", () => {
        const odprto = li.getAttribute("aria-expanded") === "true";
        li.setAttribute("aria-expanded", String(!odprto));
        if (odprto) {
          ul?.remove();
          ul = null;
          return;
        }
        ul = mk("ul", "");
        ul.setAttribute("role", "group");
        for (const o of v.otroci.values()) ul.append(vrsticaDrevesa(o, globina + 1));
        for (const r of v.listi.sort((a, b) => a.prikaz.localeCompare(b.prikaz, "sl"))) {
          const l = mk("li", "a3-list-struktura");
          l.setAttribute("role", "treeitem");
          l.style.setProperty("--g", globina + 1);
          const b = gumb("a3-struktura", "", "");
          b.textContent = r.prikaz;
          b.addEventListener("click", () => izberiIzSeznama(r.id));
          l.append(b);
          ul.append(l);
        }
        li.append(ul);
      });
      return li;
    }
    for (const v of koren.values()) drevo.append(vrsticaDrevesa(v, 0));
    box.append(drevo);
    odpriList("brskaj", t("a3.browse"), box);
  }

  // Nastavitve pogleda.
  function nastavitve() {
    const box = mk("div", "a3-nast-telo");
    const seg = (oznaka, moznosti, vrednost, ob, cls = "") => {
      const s = mk("div", `seg a3-seg ${cls}`);
      s.setAttribute("role", "radiogroup");
      s.setAttribute("aria-label", oznaka);
      for (const [k, ime] of moznosti) {
        const b = mk("button", k === vrednost ? "active" : "", ime);
        b.type = "button";
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", String(k === vrednost));
        b.addEventListener("click", () => {
          s.querySelectorAll("button").forEach((x) => {
            x.classList.toggle("active", x === b);
            x.setAttribute("aria-checked", String(x === b));
          });
          ob(k);
        });
        s.append(b);
      }
      return s;
    };
    box.append(
      seg(t("a3.view"), [["spredaj", t("a3.front")], ["zadaj", t("a3.behind")], ["strani", t("a3.side")], ["perspektiva", t("a3.perspective")]], null, (k) => pogled(new THREE.Vector3(...POGLEDI[k])), "a3-seg-pogled"),
      seg(t("a3.body"), [["m", t("a3.male")], ["z", t("a3.female")]], spol, async (k) => {
        spol = k;
        if (k === "z" && sloji.has("zenski")) await naloziSloj("zenski");
        uporabiVidnost();
      }),
    );
    // Razmakni strukture.
    const raz = mk("div", "a3-drsnik");
    const razVrh = mk("div", "a3-drsnik-vrh");
    const razOut = mk("output", "", `${Math.round(razmik * 100)} %`);
    razVrh.append(mk("span", "", t("a3.explode")), razOut);
    const razVrsta = mk("div", "a3-drsnik-vrsta");
    const razIn = document.createElement("input");
    razIn.type = "range";
    razIn.min = 0;
    razIn.max = 100;
    razIn.step = 1;
    razIn.value = Math.round(razmik * 100);
    razIn.setAttribute("aria-label", t("a3.explode"));
    let rafRaz = 0;
    razIn.addEventListener("input", () => {
      razmik = Number(razIn.value) / 100;
      razOut.textContent = `${razIn.value} %`;
      cancelAnimationFrame(rafRaz);
      rafRaz = requestAnimationFrame(uporabiRazmik);
    });
    const razPon = gumb("a3-krog a3-mali-krog", icon("rotate-ccw"), t("a3.explodeReset"));
    razPon.addEventListener("click", () => {
      razIn.value = 0;
      razIn.dispatchEvent(new Event("input"));
    });
    razVrsta.append(razIn, razPon);
    raz.append(razVrh, razVrsta);
    box.append(raz);
    // Prerez.
    const pre = mk("div", "a3-blok");
    const preVrh = mk("div", "a3-stikalo-vrsta");
    const preSw = mk("button", "switch");
    preSw.type = "button";
    preSw.setAttribute("role", "switch");
    preSw.setAttribute("aria-checked", String(prerez.on));
    preSw.setAttribute("aria-label", t("a3.cut"));
    preVrh.append(mk("span", "", t("a3.cut")), preSw);
    const preOs = seg(t("a3.cutAxis"), [["y", t("a3.cutY")], ["z", t("a3.cutZ")], ["x", t("a3.cutX")]], prerez.os, (k) => {
      prerez.os = k;
      if (!prerez.on) {
        prerez.on = true;
        preSw.setAttribute("aria-checked", "true");
      }
      uporabiPrerez();
    });
    const preIn = document.createElement("input");
    preIn.type = "range";
    preIn.min = 0;
    preIn.max = 100;
    preIn.value = Math.round(prerez.poz * 100);
    preIn.setAttribute("aria-label", t("a3.cutPos"));
    preIn.addEventListener("input", () => {
      prerez.poz = Number(preIn.value) / 100;
      if (!prerez.on) {
        prerez.on = true;
        preSw.setAttribute("aria-checked", "true");
      }
      uporabiPrerez();
    });
    preSw.addEventListener("click", () => {
      prerez.on = !prerez.on;
      preSw.setAttribute("aria-checked", String(prerez.on));
      uporabiPrerez();
    });
    pre.append(preVrh, preOs, preIn);
    box.append(pre);
    // Rentgen.
    const ren = mk("div", "a3-stikalo-vrsta a3-blok");
    const renSw = mk("button", "switch");
    renSw.type = "button";
    renSw.setAttribute("role", "switch");
    renSw.setAttribute("aria-checked", String(rentgen));
    renSw.setAttribute("aria-label", t("a3.xray"));
    renSw.addEventListener("click", () => {
      rentgen = !rentgen;
      renSw.setAttribute("aria-checked", String(rentgen));
      uporabiMateriale();
    });
    const renTxt = mk("span", "a3-stikalo-txt");
    renTxt.append(mk("span", "", t("a3.xray")), mk("small", "", t("a3.xrayHint")));
    ren.append(renTxt, renSw);
    box.append(ren);
    // Podrobnost.
    const pod = mk("div", "a3-blok");
    pod.append(
      mk("span", "a3-oznaka-polja", t("a3.detail")),
      seg(t("a3.detail"), [[1, t("a3.levelOS")], [2, t("a3.levelSS")], [3, t("a3.levelAll")]], raven, (k) => {
        raven = k;
        uporabiVidnost();
      }),
    );
    box.append(pod);
    odpriList("nastavitve", t("a3.viewSettings"), box);
  }

  // Viri in licence: public/3d/viri.json in viri.json vsakega področja, ki ga ima (seznam.json → viri).
  async function viri() {
    const box = mk("div", "a3-viri");
    const beri = (u) => fetch(new URL(u, import.meta.url)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const vsebine = await Promise.all([
      beri("./viri.json").then((d) => normalizirajViri(d)),
      ...(seznam.viri || []).map((p) => beri(`./modeli/${p}/viri.json`).then((d) => normalizirajViri(d, p))),
    ]);
    const data = { viri: [], izkljuceno: [] };
    const ids = new Set();
    for (const d of vsebine) {
      for (const v of d?.viri || []) if (!ids.has(v.id)) ids.add(v.id), data.viri.push(v);
      data.izkljuceno.push(...(d?.izkljuceno || []));
    }
    box.append(mk("p", "a3-muted", t("a3.sourcesIntro")));
    for (const v of data?.viri || []) {
      const c = mk("article", "a3-vir");
      const h = mk("h3", "", v.ime);
      c.append(h);
      if (v.avtor) c.append(mk("p", "a3-muted", v.avtor));
      if (v.opis) c.append(mk("p", "", v.opis));
      const l = mk("p", "a3-licenca");
      const a = mk("a", "", v.licenca);
      if (v.licencaUrl) {
        a.href = v.licencaUrl;
        a.target = "_blank";
        a.rel = "noopener";
      }
      l.append(a);
      if (v.url) {
        const s = mk("a", "", v.url.replace(/^https?:\/\//, ""));
        s.href = v.url;
        s.target = "_blank";
        s.rel = "noopener";
        l.append(document.createTextNode(" · "), s);
      }
      c.append(l);
      box.append(c);
    }
    if (data?.izkljuceno?.length) {
      box.append(mk("h3", "a3-podnaslov", t("a3.excluded")));
      const ul = mk("ul", "a3-muted");
      for (const x of data.izkljuceno) ul.append(mk("li", "", x));
      box.append(ul);
    }
    odpriList("viri", t("a3.sources"), box);
  }

  // ---------- učenje (kviz) ----------
  function uci() {
    const box = mk("div", "a3-uci");
    box.append(mk("p", "a3-muted", t("a3.quizIntro")));
    for (const [nacin, ikona] of [["najdi", "target"], ["kaj", "circle-help"]]) {
      const b = gumb("a3-izbira-kviza", "", "");
      b.innerHTML = `<span class="a3-plast-ic">${icon(ikona)}</span><span class="a3-plast-txt"><b></b><small></small></span>${icon("chevron-right")}`;
      b.querySelector("b").textContent = t(`a3.quiz.${nacin}`);
      b.querySelector("small").textContent = t(`a3.quiz.${nacin}Sub`);
      b.addEventListener("click", () => zacniKviz(nacin));
      box.append(b);
    }
    odpriList("uci", t("a3.learn"), box);
  }
  function kandidati() {
    const vsi = [...deli.values()].filter((d) => viden(d) && d.row.r >= 0.012 && d.row.sistem !== "koza");
    const zImeni = vsi.filter((d) => d.row.im?.sl);
    const izbor = jezik === "sl" && zImeni.length >= 12 ? zImeni : vsi;
    // Pri »Vse« kviz vseeno sprašuje po strukturah ravni SŠ (segmenti bronhijev ipd. niso za kviz), če jih je dovolj.
    const zmerni = izbor.filter((d) => d.row.raven <= Math.min(raven, 2));
    return zmerni.length >= 12 ? zmerni : izbor;
  }
  const premesaj = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function zacniKviz(nacin) {
    zapriList();
    izberi(null);
    const pool = kandidati();
    if (pool.length < 4) return sporocilo(t("a3.quizTooFew"));
    // Različna imena (leva in desna stran štejeta kot isto ime), večje strukture najprej.
    const poImenu = new Map();
    for (const d of premesaj(pool)) if (!poImenu.has(d.row.ime)) poImenu.set(d.row.ime, d);
    const vprasanja = premesaj([...poImenu.values()]).slice(0, KVIZ_VPRASANJ);
    kvizStanje = { nacin, vprasanja, i: 0, prav: 0, narobe: 0, odgovorjeno: false, pool: [...poImenu.values()] };
    el.classList.add("a3-kviz-tece");
    kartica.hidden = true;
    pokaziVprasanje();
  }
  function pokaziVprasanje() {
    const k = kvizStanje;
    const d = k.vprasanja[k.i];
    k.odgovorjeno = false;
    kviz.replaceChildren();
    const vrhQ = mk("div", "a3-kviz-vrh");
    vrhQ.append(mk("span", "a3-kviz-st", t("a3.quizProgress", { i: k.i + 1, n: k.vprasanja.length })), mk("span", "a3-kviz-tocke", t("a3.quizScore", { n: k.prav })));
    const x = gumb("a3-krog a3-mali-krog", icon("x"), t("a3.quizEnd"));
    x.addEventListener("click", koncajKviz);
    vrhQ.append(x);
    kviz.append(vrhQ);
    if (k.nacin === "najdi") {
      kviz.append(mk("p", "a3-kviz-vpr", t("a3.quizFind", { ime: d.row.prikaz })));
      kviz.append(mk("p", "a3-kviz-fb", ""));
      // Pogled na celo telo, da je strukturo treba poiskati.
      izberi(null);
    } else {
      kviz.append(mk("p", "a3-kviz-vpr", t("a3.quizWhat")));
      const moznosti = [d, ...premesaj(k.pool.filter((x2) => x2.row.ime !== d.row.ime)).slice(0, 3)];
      const box = mk("div", "a3-kviz-moznosti");
      for (const m of premesaj(moznosti)) {
        const b = gumb("a3-pill a3-moznost", "", "");
        b.textContent = m.row.prikaz.replace(/\s*\((levo|desno|left|right)\)$/i, "");
        b.addEventListener("click", () => odgovorKaj(m, b));
        box.append(b);
      }
      kviz.append(box, mk("p", "a3-kviz-fb", ""));
      kviz.hidden = false; // pred preletom: poletiK meri prosti prostor nad kartico kviza
      izberi(d.row.id, { tiho: true });
    }
    kviz.hidden = false;
  }
  function povratno(ok, besedilo) {
    const fb = kviz.querySelector(".a3-kviz-fb");
    fb.textContent = besedilo;
    fb.classList.toggle("ok", ok);
    fb.classList.toggle("ne", !ok);
    kviz.querySelector(".a3-kviz-tocke").textContent = t("a3.quizScore", { n: kvizStanje.prav });
    const naprej = gumb("a3-pill a3-glavni a3-naprej", `<span>${t(kvizStanje.i + 1 < kvizStanje.vprasanja.length ? "a3.quizNext" : "a3.quizFinish")}</span>${icon("arrow-right")}`);
    naprej.addEventListener("click", () => {
      kvizStanje.i++;
      if (kvizStanje.i >= kvizStanje.vprasanja.length) koncajKviz(true);
      else pokaziVprasanje();
    });
    kviz.append(naprej);
    naprej.focus({ preventScroll: true });
  }
  function odgovorNajdi(id) {
    const k = kvizStanje;
    const d = k.vprasanja[k.i];
    if (!id) return;
    k.odgovorjeno = true;
    const ok = id === d.row.id;
    const istoIme = !ok && vrstice.get(id)?.ime === d.row.ime;
    if (ok) k.prav++;
    else k.narobe++;
    izberi(d.row.id, { tiho: true });
    povratno(ok, ok ? t("a3.quizRight") : istoIme ? t("a3.quizSide") : t("a3.quizWrongWas", { ime: vrstice.get(id)?.prikaz || "" }));
  }
  function odgovorKaj(m, b) {
    const k = kvizStanje;
    if (k.odgovorjeno) return;
    k.odgovorjeno = true;
    const d = k.vprasanja[k.i];
    const ok = m.row.ime === d.row.ime;
    if (ok) k.prav++;
    else k.narobe++;
    kviz.querySelectorAll(".a3-moznost").forEach((x) => {
      x.disabled = true;
      if (x.textContent === d.row.prikaz.replace(/\s*\((levo|desno|left|right)\)$/i, "")) x.classList.add("prav");
    });
    if (!ok) b.classList.add("narobe");
    povratno(ok, ok ? t("a3.quizRight") : t("a3.quizWrongIs", { ime: d.row.prikaz }));
  }
  async function koncajKviz(dokoncan = false) {
    const k = kvizStanje;
    if (!k) return;
    kvizStanje = null;
    izberi(null);
    if (dokoncan !== true) {
      kviz.hidden = true;
      el.classList.remove("a3-kviz-tece");
      return;
    }
    kviz.replaceChildren();
    const h = mk("h2", "", t("a3.quizDone"));
    const p = mk("p", "a3-kviz-vpr", t("a3.quizResult", { prav: k.prav, n: k.vprasanja.length }));
    const xp = mk("p", "a3-kviz-xp", "");
    const akc = mk("div", "a3-akcije");
    const znova = gumb("a3-pill a3-glavni", `${icon("refresh-cw")}<span>${t("a3.quizAgain")}</span>`);
    znova.addEventListener("click", () => zacniKviz(k.nacin));
    const konec = gumb("a3-pill", `<span>${t("a3.close")}</span>`);
    konec.addEventListener("click", () => {
      kviz.hidden = true;
      el.classList.remove("a3-kviz-tece");
    });
    akc.append(znova, konec);
    kviz.append(h, p, xp, akc);
    const dobljeno = await podeliXp(k);
    if (dobljeno > 0) xp.textContent = t("a3.quizXp", { n: dobljeno });
  }
  // XP za kviz: isti zapis kot pri igrah (POST /api/students/:id/games/result, server/games.js: 1 XP za 2 pravilna,
  // največ 20 na igro in 60 na dan iz iger). Brez prijavljenega profila (npr. WebView brez seje) ga tiho ni.
  async function podeliXp(k) {
    const sid = Number(shramba.get("studentId"));
    if (!sid || !k.prav) return 0;
    try {
      const r = await fetch(`/api/students/${sid}/games/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: `atlas:telo_${k.nacin}`, score: k.prav * 10, correct: k.prav, wrong: k.narobe, tier: raven }),
      });
      if (!r.ok) return 0;
      return (await r.json()).xp || 0;
    } catch {
      return 0;
    }
  }

  // ---------- drobno ----------
  let sporociloEl = null;
  function sporocilo(besedilo) {
    sporociloEl?.remove();
    sporociloEl = mk("div", "a3-sporocilo", besedilo);
    sporociloEl.setAttribute("role", "alert");
    el.append(sporociloEl);
    setTimeout(() => sporociloEl?.remove(), 4000);
  }

  btnBrskaj.addEventListener("click", () => (odprtList === "brskaj" ? zapriList() : brskaj()));
  btnNastavitve.addEventListener("click", () => (odprtList === "nastavitve" ? zapriList() : nastavitve()));
  btnUci.addEventListener("click", () => (odprtList === "uci" ? zapriList() : uci()));
  btnManj.addEventListener("click", () => kit.priblizaj(1 / 1.35));
  btnVec.addEventListener("click", () => kit.priblizaj(1.35));
  btnPon.addEventListener("click", () => {
    izberi(null);
    ponastaviPogled();
  });
  btnVse.addEventListener("click", () => {
    samo = null;
    skrit.clear();
    skriteSkupine.clear();
    uporabiVidnost();
    if (odprtList === "brskaj") brskaj();
  });
  btnMeni.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!meni.hidden) return zapriPlavajoce();
    meni.replaceChildren();
    const v = gumb("a3-meni-vrsta", `${icon("info")}<span>${t("a3.sources")}</span>`);
    v.setAttribute("role", "menuitem");
    v.addEventListener("click", () => {
      meni.hidden = true;
      viri();
    });
    meni.append(v);
    meni.hidden = false;
    btnMeni.setAttribute("aria-expanded", "true");
    v.focus();
  });
  btnZapri.hidden = !zapri;
  btnZapri.addEventListener("click", () => zapri?.());
  const naTipko = (e) => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (!meni.hidden) zapriPlavajoce();
    else if (!list.hidden) zapriList();
    else if (kvizStanje) koncajKviz();
    else if (izbran) izberi(null);
    else return;
    e.preventDefault();
  };
  document.addEventListener("keydown", naTipko);
  const naKlik = (e) => {
    if (!meni.hidden && !meni.contains(e.target) && e.target !== btnMeni) zapriPlavajoce();
  };
  document.addEventListener("click", naKlik);

  // ---------- zagon: okostje in organi ----------
  // Uvod (brez »manj gibanja«): telo se pokaže šele, ko sta naložena oba začetna sloja; kamera prileti s strani in
  // svetloba se prižge v slabi sekundi.
  const uvod = kit.gibanje;
  if (uvod) {
    telo.visible = false;
    senca.visible = false;
    pogled(new THREE.Vector3(0.95, 0.3, 1), { trajanje: 0, cilj: new THREE.Vector3(0, 0.95, 0), polmer: 1.45 });
  }
  uporabiVidnost();
  try {
    await Promise.all(ZACETNI.map((id) => naloziSloj(id)));
  } finally {
    telo.visible = true;
    senca.visible = true;
  }
  uporabiVidnost();
  if (uvod) {
    let cas = 0;
    const T = 0.9;
    skupno.uSvetlost.value = 0;
    senca.material.opacity = 0;
    const stop = kit.naKorak((dt) => {
      cas += dt;
      const e = Math.min(1, cas / T);
      skupno.uSvetlost.value = svetlostOstalih() * e * e * (3 - 2 * e);
      senca.material.opacity = e;
      if (e >= 1) stop();
      return true;
    });
    ponastaviPogled(1.7);
  }

  return {
    kit,
    izberi,
    get stVidnih() {
      return stVidnih;
    },
    // Za preizkuse (Playwright) in povezave: /3d#atlas?izberi=Femur.r
    izberiIzSeznama,
    nastavi(k, v) {
      if (k === "razmik") {
        razmik = v;
        uporabiRazmik();
      } else if (k === "rentgen") {
        rentgen = !!v;
        uporabiMateriale();
      } else if (k === "prerez") {
        prerez = { ...prerez, ...v };
        uporabiPrerez();
      }
    },
    unici() {
      document.removeEventListener("keydown", naTipko);
      document.removeEventListener("click", naKlik);
      kit.unici();
      for (const s of sloji.values()) for (const bm of s.skupine) bm.dispose();
      for (const m of [...materiali.values(), ...materialiSij.values(), ...obrisi.map((o) => o.material)]) m.dispose();
      senca.material.map.dispose();
      senca.material.dispose();
      senca.geometry.dispose();
      for (const d of deli.values()) d.geo.dispose();
      el.replaceChildren();
    },
  };
}
