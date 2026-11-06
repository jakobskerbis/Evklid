// Splošni pregledovalnik 3D modelov, zgrajenih v kodi (pogodba v docs/3d.md): prizor iz scena.js, deli s seznamom
// gumbov (tipkovnica: Tab do seznama, Enter izbere) in oknom izbranega dela ob odru (nikoli čez model), nadzor iz `nadzor` (drsnik, izbira, gumb,
// stikalo, izpis), merilo iz `merilo`, »Ponastavi«, predvajaj/ustavi, ko ima model `korak`. Uporabljata ga stran /3d
// in pogon simulacij »3d-<id>« v lekcijah (public/3d/sim.js).
import { THREE, ustvariSceno, kakovostNaprave, gibanje, poveziGumbVrtenja } from "./scena.js";
import { obsegVidnega, vKadru, vidnaKrogla } from "./kader.js";
import { t } from "/i18n.js";
import { icon } from "/icons.js";
import { ravenProfila, razlaga, imaRavni } from "./raven.js";
import { SKUPINE, zacetnaIzbira } from "./skupine.js";
import { najdiOvoje, okvir } from "./ovoji.js";

const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

// Začetne vrednosti iz kataloga ali naslova (?telo=valj): pretvorba v tip kontrole.
function pretvori(c, v) {
  if (c.tip === "drsnik") {
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? Math.min(c.max, Math.max(c.min, n)) : c.vrednost;
  }
  if (c.tip === "stikalo") return v === true || /^(1|true|da|on)$/i.test(String(v));
  if (c.tip === "izbira") return (c.moznosti || []).some(([k]) => String(k) === String(v)) ? (c.moznosti.find(([k]) => String(k) === String(v))[0]) : c.vrednost;
  return v;
}

const decimalke = (korak) => {
  const s = String(korak ?? 1);
  return s.includes(".") ? s.split(".")[1].length : 0;
};
const stevilo = (v, korak) => Number(v).toFixed(decimalke(korak)).replace(".", ",").replace("-", "−");

export function odpriModel(el, mod, opts = {}) {
  const { info, zgradi } = mod;
  const zacetek = { ...(opts.zacetek || {}) };
  let kit = null;
  let model = null;
  let izbran = null;
  let tece = true;
  let izpisi = [];
  let sinh = []; // drsnik/stikalo/izbira: { c, zadnja, nastavi } – gradnik sledi c.vrednost, ko jo spremeni model
  let zadnjiDeli = []; // deli ob zadnji gradnji seznama (primerjava po predmetih)
  let vidni = []; // [nadzor, element] za nadzore z vidno()
  let casIzpisa = 0;
  let cas = 0;
  const pocisti = [];

  el.replaceChildren();
  el.classList.add("k3", "k3-pregled");
  const oder = mk("div", "k3-oder-ovoj");
  const povzetekEl = mk("div", "k3-povzetek");
  povzetekEl.hidden = true;
  const orodja = mk("div", "k3-orodja");
  const spodaj = mk("div", "k3-spodaj");
  const nadzorEl = mk("div", "k3-nadzor");
  const deliEl = mk("div", "k3-deli");
  deliEl.setAttribute("role", "group");
  deliEl.setAttribute("aria-label", t("a3.parts"));
  // Okno izbranega dela (j, 5. 11.): nikoli čez model. Je prvi del plošče ob odru: na računalniku desno ob modelu, na
  // telefonu pod odrom (spodnji list), v lekcijah pod odrom. Zapre ga ×, Esc ali tap na prazen del odra.
  const infoEl = mk("section", "k3-info");
  infoEl.hidden = true;
  // Bralnik zaslona: ime izbranega dela v ločenem, vedno prisotnem statusu (živo območje v skritem oknu ne bi
  // bilo prebrano ob prvem prikazu).
  const statusEl = mk("p", "k3-sr");
  statusEl.setAttribute("role", "status");
  spodaj.append(infoEl, nadzorEl, deliEl);
  el.append(oder, spodaj, statusEl);
  // Stran /3d (opts.stran): plošča ob odru (desno na širokih zaslonih, spodaj na telefonu) z opisom modela, nadzorom in
  // seznamom delov; plošča se drsi sama, oder ostane ves čas viden. V lekcijah ostane postavitev kot prej.
  let oModelu = null;
  let deliGlava = null;
  if (opts.stran) {
    el.classList.add("k3-stran-pregled");
    spodaj.classList.add("k3-plosca");
    oModelu = mk("section", "k3-o-modelu");
    oModelu.setAttribute("aria-label", t("a3.about"));
    if (info.opis) oModelu.append(mk("p", "k3-o-opis", info.opis));
    if (info.poskusi) {
      const p = mk("p", "k3-o-poskusi");
      p.append(mk("b", "", `${t("sc.try")} `), mk("bdi", "", info.poskusi)); // bdi: slovensko besedilo v RTL ostane LTR
      oModelu.append(p);
    }
    oModelu.hidden = !oModelu.children.length;
    deliGlava = mk("h2", "k3-deli-glava");
    spodaj.insertBefore(oModelu, nadzorEl);
    spodaj.insertBefore(deliGlava, deliEl);
  }
  // Esc prekliče izbiro dela (šele naslednji Esc gre na strani /3d nazaj na zbirko); kot × vrne fokus na del v
  // seznamu, če je bil v oknu, ki se zapre.
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !izbran || e.defaultPrevented) return;
    e.preventDefault();
    zapriInfo();
  });
  function zapriInfo() {
    const id = izbran;
    const vOknu = infoEl.contains(document.activeElement);
    izberi(null);
    if (vOknu || !el.contains(document.activeElement)) deliEl.querySelector(`[data-del="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  }

  const btnPonastavi = mk("button", "k3-krog");
  btnPonastavi.dataset.reset = ""; // scripts/preveri-simulacije.cjs ga prepozna kot »Ponastavi«
  btnPonastavi.type = "button";
  btnPonastavi.innerHTML = icon("rotate-ccw");
  btnPonastavi.setAttribute("aria-label", t("a3.reset"));
  btnPonastavi.title = t("a3.reset");
  btnPonastavi.addEventListener("click", () => zgradiVse(true));
  const btnTeci = mk("button", "k3-krog");
  btnTeci.type = "button";
  btnTeci.addEventListener("click", () => nastaviTek(!tece));
  // Povečava z gumbi (poleg koleščka in prstov): miška brez koleščka, sledilna ploščica, dostopnost.
  const povecava = (f, ikona, kljuc) => {
    const b = mk("button", "k3-krog k3-povecava");
    b.type = "button";
    b.innerHTML = icon(ikona);
    b.setAttribute("aria-label", t(kljuc));
    b.title = t(kljuc);
    b.addEventListener("click", () => kit?.priblizaj(f));
    return b;
  };
  const btnVrtenje = mk("button", "k3-krog k3-vrtenje");
  btnVrtenje.type = "button";
  orodja.append(btnVrtenje, povecava(1 / 1.35, "zoom-out", "a3.zoomOut"), povecava(1.35, "zoom-in", "a3.zoomIn"), btnTeci, btnPonastavi);

  function nastaviTek(on) {
    tece = on;
    btnTeci.innerHTML = icon(on ? "pause" : "play");
    btnTeci.setAttribute("aria-label", t(on ? "a3.pause" : "a3.play"));
    btnTeci.title = t(on ? "a3.pause" : "a3.play");
    btnTeci.setAttribute("aria-pressed", String(on));
    kit?.narisi();
  }

  // Izbrani del zasije v svoji barvi na vseh svojih mrežah, torej na vseh primerkih iste vrste (vsi mitohondriji so ena
  // InstancedMesh). Kopije materialov (ob preklicu ali drugi izbiri sproščene), izvirniki ostanejo. Manjši deli dobijo
  // še tanek obris v barvi poudarka (kot v atlasu): sij v lastni barvi je na svetlih ozkih delih (aksonema) komaj viden.
  const sij = new Map(); // mesh → { izv: izvirni material, kopija: material ali seznam kopij }
  const obrisi = []; // prekrivne mreže obrisa (userData.k3Sij: ne štejejo v kader, tap jih ne zadene)
  const uPx = { value: 0.002 };
  let matObrisa = null;
  function materialObrisa() {
    if (matObrisa) return matObrisa;
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color("#6E9BFF"), transparent: true, opacity: 0.9, side: THREE.BackSide, depthWrite: false, toneMapped: false });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uPx = uPx;
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uPx;").replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec3 nObr = normal;
        #ifdef USE_INSTANCING
          nObr = mat3( instanceMatrix ) * nObr;
        #endif
        mvPosition.xyz += normalize( normalMatrix * nObr ) * ( -mvPosition.z ) * uPx * 1.8;
        gl_Position = projectionMatrix * mvPosition;`,
      );
    };
    m.customProgramCacheKey = () => "k3-obris";
    return (matObrisa = m);
  }
  function narisiObris(d) {
    for (const o of obrisi.splice(0)) o.removeFromParent();
    if (!d || !model?.group) return;
    const vel = obsegVidnega(THREE, model.group).getSize(new THREE.Vector3()).length();
    const b = okvirDela(d, new THREE.Box3());
    // veliki deli (membrana, stena) so pogosto odprte lupine: obris bi obarval njihovo notranjost
    if (b.isEmpty() || b.getSize(new THREE.Vector3()).length() > vel * 0.6) return;
    uPx.value = (2 * Math.tan(THREE.MathUtils.degToRad(kit.camera.fov / 2))) / Math.max(1, kit.velikost.h);
    for (const m of d.meshes || []) {
      if (!m?.isMesh || !m.geometry?.attributes?.normal) continue;
      const izv = Array.isArray(m.material) ? m.material[0] : m.material;
      if (!izv || izv.transparent || izv.side !== THREE.FrontSide) continue;
      const mat = izv.clippingPlanes?.length ? Object.assign(materialObrisa().clone(), { clippingPlanes: izv.clippingPlanes }) : materialObrisa();
      if (mat !== matObrisa) Object.assign(mat, { onBeforeCompile: matObrisa.onBeforeCompile, customProgramCacheKey: () => "k3-obris-rez" });
      const o = m.isInstancedMesh ? new THREE.InstancedMesh(m.geometry, mat, m.count) : new THREE.Mesh(m.geometry, mat);
      if (m.isInstancedMesh) o.instanceMatrix = m.instanceMatrix;
      o.userData.k3Sij = true;
      o.userData.k3Obris = mat !== matObrisa;
      o.raycast = () => {};
      o.renderOrder = 9;
      o.frustumCulled = false;
      o.onBeforeRender = () => {
        if (m.isInstancedMesh) o.count = m.count;
        uPx.value = (2 * Math.tan(THREE.MathUtils.degToRad(kit.camera.fov / 2))) / Math.max(1, kit.velikost.h);
      };
      m.add(o);
      obrisi.push(o);
    }
  }
  function obarvaj(d) {
    for (const o of obrisi) if (o.userData.k3Obris) o.material.dispose();
    narisiObris(null);
    for (const [m, { izv, kopija }] of sij) {
      if (m.material === kopija) m.material = izv; // model je material medtem morda zamenjal sam
      for (const x of Array.isArray(kopija) ? kopija : [kopija]) x.dispose();
    }
    sij.clear();
    if (!d) return;
    const barva = new THREE.Color(d.barva || "#6E9BFF");
    for (const m of d.meshes || []) {
      if (!m?.material || sij.has(m)) continue;
      const kopije = (Array.isArray(m.material) ? m.material : [m.material]).map((x) => {
        const c = x.clone();
        if (c.emissive) {
          c.emissive = barva.clone();
          c.emissiveIntensity = 0.85;
        }
        return c;
      });
      const kopija = Array.isArray(m.material) ? kopije : kopije[0];
      sij.set(m, { izv: m.material, kopija });
      m.material = kopija;
    }
    narisiObris(d);
  }

  // Namig, kaj je klikljivo (namesto barvnih krogcev čez model): ob prvem ogledu nabora delov po en primerek vsakega dela
  // dvakrat mehko zasije v svoji barvi. Deli, ki ovijejo skoraj ves model (membrana, stena), ne zasijejo, da ne zalijejo
  // vsega. Prekrivna mreža si deli geometrijo z izvirnikom, je prosojna in je tap ne zadene.
  let namigSij = null; // { mreze, mat[], t }
  const videniNabori = new Set();
  const TRAJANJE_SIJA = 3.2;
  function ustaviNamigSij() {
    if (!namigSij) return;
    for (const o of namigSij.mreze) o.removeFromParent();
    for (const m of namigSij.mat) m.dispose();
    namigSij = null;
    kit?.narisi();
  }
  function sijPrimerka(m, barva) {
    const izv = Array.isArray(m.material) ? m.material[0] : m.material;
    if (!m.geometry?.attributes?.position || !izv || izv.visible === false) return null;
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(barva || "#6E9BFF"), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      side: izv.side === THREE.BackSide ? THREE.BackSide : THREE.FrontSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
      toneMapped: false,
    });
    if (izv.clippingPlanes?.length) mat.clippingPlanes = izv.clippingPlanes;
    const o = new THREE.Mesh(m.geometry, mat);
    o.userData.k3Sij = true;
    o.raycast = () => {};
    o.renderOrder = 10;
    if (m.isInstancedMesh) {
      // primerek, ki je najbližje kameri (v prerezu celice je ta navadno viden)
      const mm = new THREE.Matrix4(), p = new THREE.Vector3(), cam = kit.camera.position;
      let naj = -1, d = Infinity;
      for (let i = 0; i < m.count; i++) {
        m.getMatrixAt(i, mm);
        p.setFromMatrixPosition(mm).applyMatrix4(m.matrixWorld);
        const x = p.distanceToSquared(cam);
        if (x < d) (d = x), (naj = i);
      }
      if (naj < 0) return null;
      m.getMatrixAt(naj, o.matrix);
      o.matrixAutoUpdate = false;
    }
    m.add(o);
    return o;
  }
  function namigniDele() {
    ustaviNamigSij();
    const seznam = Array.isArray(model?.deli) ? model.deli : [];
    if (!seznam.length || !model?.group || izbran) return;
    const kljuc = seznam.map((d) => d.id).join("|");
    if (videniNabori.has(kljuc)) return;
    videniNabori.add(kljuc);
    const vel = obsegVidnega(THREE, model.group).getSize(new THREE.Vector3()).length();
    const mreze = [], mat = [];
    for (const d of seznam) {
      const b = okvirDela(d, new THREE.Box3());
      if (b.isEmpty() || b.getSize(new THREE.Vector3()).length() > vel * 0.75) continue;
      // po en primerek: prva vidna mreža dela (pri InstancedMesh en primerek)
      for (const m of d.meshes || []) {
        if (!m?.isMesh || !vidnaVeja(m)) continue;
        const o = sijPrimerka(m, d.barva);
        if (o) {
          mreze.push(o);
          mat.push(o.material);
          break;
        }
      }
    }
    if (!mreze.length) return;
    namigSij = { mreze, mat, t: 0 };
    kit.narisi();
  }
  const vidnaVeja = (o) => {
    for (let x = o; x; x = x.parent) if (!x.visible) return false;
    return true;
  };
  function korakNamigSija(dt) {
    if (!namigSij) return false;
    namigSij.t += dt;
    const t = namigSij.t;
    if (t >= TRAJANJE_SIJA) {
      ustaviNamigSij();
      return true;
    }
    // dva mehka utripa; pri manj gibanja enakomeren sij, ki na koncu ugasne
    const a = kit.gibanje ? Math.sin((Math.PI * 2 * t) / TRAJANJE_SIJA) ** 2 : t < TRAJANJE_SIJA - 0.3 ? 1 : 0;
    for (const m of namigSij.mat) m.opacity = 0.55 * a;
    return true;
  }

  // Izbrani del: deli, ki ga res obdajajo (celična stena, membrana, ovojnica ...), postanejo nevidni, da se izbrani
  // vidi (j, 4. 11.). »Obdaja« = vseh šest žarkov od zunaj (±x, ±y, ±z) proti središču izbranega zadene ploskev tega
  // dela (tudi skrit pokrov izreza), preden pride do središča; razpršeni deli (ribosomi, silnice, pasovi, vijačnica DNK) tega ne izpolnijo.
  // Ovoj mora biti tudi večji od izbranega. Skrijemo s plastjo 31, ki je kamera in tap ne vidita; model sam še naprej
  // upravlja `visible`. Samo biologija (celice, virusi, organi): pri fiziki, kemiji in matematiki so »ovoji« (silnice,
  // lupine, telesa) snov učenja.
  const SKRITA_PLAST = 31;
  const skrite = new Map(); // object → izvirna maska plasti
  const okvirDela = (d, box) => okvir(d, box);
  // Ovoji in stene okoli izbranega dela ali skupine (public/3d/ovoji.js: najdiOvoje, test 3d-ovoji).
  function skrijObdajajoce(d) {
    for (const [o, maska] of skrite) o.layers.mask = maska;
    skrite.clear();
    if (!d || !model?.deli || (info.predmet || "BIO") !== "BIO" || !model.group) return;
    for (const o of najdiOvoje(THREE, d, model.deli, model.group)) {
      skrite.set(o, o.layers.mask);
      o.layers.set(SKRITA_PLAST);
    }
  }

  // hit = { object, instanceId, point } iz tapa (null iz seznama delov); model.izberi lahko vrne drug del (npr. element
  // v InstancedMesh). preklopi: ponoven tap na izbrani del izbiro prekliče. pomakni: false = del iz naslova ob odprtju
  // (plošča in stran se ne premakneta).
  // Skupine delov (skupine.js): »skupina-<id>« izbere vse dele skupine hkrati (osvetlitev in skriti ovoji okoli njih).
  const PRED = "skupina-";
  function skupineModela() {
    const deli = Array.isArray(model?.deli) ? model.deli : [];
    return (SKUPINE[info.id] || [])
      .map((g) => {
        const clani = deli.filter((d) => g.deli.includes(d.id));
        const meshes = [...new Set(clani.flatMap((d) => d.meshes || []))];
        const ime = t(`a3.grp.${g.id}`);
        // razlaga skupine po ravni (skupine.js opisOs/opis/opisStudij, pregled #461 C P2-2), pod njo seznam članov
        const seznam = clani.map((d) => d.ime).join(", ");
        return { id: PRED + g.id, skupinaDelov: true, ime, barva: "#6E9BFF", meshes, opis: g.opis || seznam, opisOs: g.opisOs, opisStudij: g.opisStudij, seznam: g.opis ? seznam : "", smer: g.smer, clani };
      })
      .filter((g) => g.clani.length > 1 && g.meshes.length);
  }
  const najdiDel = (id) => (model?.deli || []).find((x) => x.id === id) || (String(id || "").startsWith(PRED) ? skupineModela().find((g) => g.id === id) : null) || null;
  function izberi(id, { leti = true, hit = null, preklopi = false, pomakni = true } = {}) {
    let cilj = id;
    if ((id || hit) && typeof model?.izberi === "function" && !String(id || "").startsWith(PRED)) {
      try {
        const r = model.izberi(id, hit);
        if (typeof r === "string") cilj = r;
      } catch (err) {
        console.error("3D izberi", err);
      }
    }
    if (preklopi && cilj && cilj === izbran) cilj = null;
    const d = najdiDel(cilj);
    // kader vidnega modela pred skrivanjem ovojev: primerjava pokaže, ali se je vidni model opazno spremenil
    const prej = leti && model?.group ? kadrModela() : null;
    izbran = d ? d.id : null;
    ustaviNamigSij();
    obarvaj(d);
    skrijObdajajoce(d);
    kit.narisi();
    deliEl.querySelectorAll("[data-del]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.del === izbran)));
    pokaziInfo(d, { izTapa: !!hit, pomakni });
    if (!prej) return;
    if (d) kadrirajIzbiro(d, prej);
    else kadrirajPogled(prej); // preklic, ki je ovoj (membrano, steno) spet pokazal: znova cel model
  }

  // Okno izbranega dela v plošči: barvna pika, ime, latinsko ime, opis, »Poglej pod povečavo«, ×.
  function pokaziInfo(d, { izTapa = false, pomakni = false } = {}) {
    infoEl.replaceChildren();
    infoEl.hidden = !d;
    el.classList.toggle("k3-ima-info", !!d);
    statusEl.textContent = d ? d.ime : "";
    if (!d) return;
    infoEl.style.setProperty("--barva", d.barva || "#6E9BFF");
    infoEl.setAttribute("aria-label", d.ime);
    const glava = mk("div", "k3-info-glava");
    const naslov = mk("div", "k3-info-naslov");
    // stran /3d: h1 ime modela, h2 okno dela in »Deli«; v lekciji je okno pod naslovi lekcije (h3)
    naslov.append(mk(opts.stran ? "h2" : "h3", "k3-info-ime", d.ime));
    // razlaga po ravni (raven.js): OŠ preprosto, SŠ z latinskim imenom, študij še podrobneje; globlje v »Več o tem«
    const rz = imaRavni(model?.deli) ? razlaga(d, raven) : { opis: d.opis, la: d.la, vec: null };
    if (rz.la) naslov.append(mk("i", "k3-la", rz.la)); // latinsko ime (organi, prerezi tkiv)
    const x = mk("button", "k3-krog k3-info-zapri");
    x.type = "button";
    x.innerHTML = icon("x");
    x.setAttribute("aria-label", t("a3.close"));
    x.title = t("a3.close");
    x.addEventListener("click", zapriInfo);
    glava.append(mk("i", "k3-pika"), naslov, x);
    infoEl.append(glava);
    if (rz.opis) infoEl.append(mk("p", "k3-info-opis", rz.opis));
    if (d.seznam) infoEl.append(mk("p", "k3-info-clani", d.seznam)); // člani skupine pod razlago
    if (rz.vec) {
      const vec = mk("details", "k3-info-vec");
      vec.append(mk("summary", "", t("a3.moreAbout")), mk("p", "k3-info-opis", rz.vec));
      infoEl.append(vec);
    }
    // Del s `povecava: "<id modela>"` (docs/3d.md): gumb odpre povečan prikaz (stran /3d da opts.povecava).
    if (d.povecava && typeof opts.povecava === "function") {
      const b = mk("button", "k3-pill k3-povecava-gumb");
      b.type = "button";
      b.innerHTML = `${icon("zoom-in")}<span></span>`;
      b.lastChild.textContent = t("a3.magnify");
      b.addEventListener("click", () => opts.povecava(d.povecava));
      infoEl.append(b);
    }
    // Stran /3d: plošča se drsi sama in okno je na njenem vrhu. Tap na model: plošča takoj na vrh (gladko drsenje se je
    // na počasnih napravah ustavilo pred vrhom). Izbira iz seznama: le toliko, da je okno vidno (seznam ne skoči).
    // Lekcija: okno je pod odrom; če je pod robom zaslona, se stran pomakne do njega.
    if (!pomakni) return;
    if (opts.stran) {
      if (izTapa) spodaj.scrollTop = 0;
      else infoEl.scrollIntoView({ block: "nearest" });
    } else {
      const r = infoEl.getBoundingClientRect();
      if (r.bottom > innerHeight || r.top < 0) infoEl.scrollIntoView({ block: "nearest", behavior: kit?.gibanje ? "smooth" : "auto" });
    }
  }

  // Kader modela: organ in model z `okvir` imata ročno nastavljen okvir; model iz kode vidni obseg (pogled lahko pokaže le del), a nikoli
  // večji od začetne krogle (tla, silnice) in ne premajhen.
  function kadrModela() {
    const [c0, r0] = zacetniOkvir();
    if (model?.postavitev === "organ" || model?.okvir || !model?.group) return [c0, r0];
    const b = obsegVidnega(THREE, model.group, { kamera: kit.camera });
    if (b.isEmpty()) return [c0, r0];
    const s = b.getBoundingSphere(new THREE.Sphere());
    if (s.radius > r0 * 1.05) return [c0, r0];
    return [s.center, Math.max(s.radius, r0 * 0.6)];
  }
  // Kamera po izbiri dela ali pogleda (j, 5. 11.; pregled PR #459): premakne se, ko se je vidni model opazno spremenil
  // (`drug`, npr. »Glava in vrat (povečano)« ali skrit ovoj) ali je model oz. izbrani del povsem izven kadra. Kader, ki
  // ga je uporabnik sam povečal ali premaknil, sicer ostane (nikoli ga ne oddaljimo samo zato, ker model sega čez rob).
  // Dokler je kamera v samodejnem kadru, poskrbimo, da je model cel v kadru (telefon: okno pod odrom zmanjša oder).
  let avto = null; // zadnji samodejni kader { c, d }
  function poleti(c, r, o = {}) {
    kit.poleti(c, r, o);
    avto = { c: c.clone(), d: o.razdalja ?? kit.fitRazdalja(r) };
  }
  function uporabnikovKader() {
    if (!avto || kit.leti) return false;
    const d = kit.camera.position.distanceTo(kit.controls.target);
    return Math.abs(d - avto.d) > 0.04 * avto.d || kit.controls.target.distanceTo(avto.c) > 0.04 * avto.d;
  }
  const drugKader = ([pc, pr], [mc, mr]) => mc.distanceTo(pc) > 0.2 * Math.max(mr, pr) || mr / pr > 1.25 || pr / mr > 1.25;
  function kadrirajPogled(prej) {
    kit.posodobiVelikost?.();
    const [mc, mr] = kadrModela();
    const drug = drugKader(prej, [mc, mr]);
    if (!drug && vidnaKrogla(THREE, kit.camera, mc, mr) && (uporabnikovKader() || vKadru(THREE, kit.camera, mc, mr, 1.02))) return;
    poleti(mc, mr, { trajanje: 0.6 });
  }
  function kadrirajIzbiro(d, prej) {
    kit.posodobiVelikost?.();
    const [mc, mr] = kadrModela();
    const b = okvirDela(d, new THREE.Box3());
    const s = b.isEmpty() ? null : b.getBoundingSphere(new THREE.Sphere());
    const drug = drugKader(prej, [mc, mr]);
    if (d.smer && s) return poleti(s.center, Math.max(s.radius, 0.35 * mr), { smer: new THREE.Vector3(...d.smer) }); // skupina z lastno smerjo
    const povsemIzven = !vidnaKrogla(THREE, kit.camera, mc, mr) || (s && !vidnaKrogla(THREE, kit.camera, s.center, s.radius));
    if (!drug && !povsemIzven) {
      if (uporabnikovKader()) return;
      const delOk = !s || vKadru(THREE, kit.camera, s.center, s.radius, 0.96);
      if (delOk && vKadru(THREE, kit.camera, mc, mr, 1.02)) return;
    }
    // del, ki sega čez kader modela (npr. bronhiol ob pljučnih mešičkih): krogla, ki objame model in del
    let c = mc, r = mr;
    const dd = s ? s.center.distanceTo(mc) : 0;
    if (s && dd + s.radius > mr) {
      r = (mr + dd + s.radius) / 2;
      c = mc.clone().lerp(s.center, dd > 1e-9 ? (r - mr) / dd : 0);
    }
    poleti(c, r);
  }

  // Raven razlage (raven.js): preklop »OŠ / SŠ / Študij« nad seznamom delov; vsi deli so vedno vidni, prilagodi se
  // samo razlaga izbranega dela. Začetna raven je raven profila, ob menjavi modela se vrne nanjo.
  const ravenZacetna = Number(opts.raven) || ravenProfila();
  let raven = ravenZacetna;
  const ravenEl = mk("div", "k3-raven");
  ravenEl.setAttribute("role", "group");
  ravenEl.setAttribute("aria-label", t("a3.detail"));
  function deli() {
    const seznam = Array.isArray(model?.deli) ? model.deli : [];
    zadnjiDeli = [...seznam];
    deliEl.replaceChildren();
    const zRavnmi = imaRavni(seznam);
    ravenEl.replaceChildren();
    ravenEl.hidden = !zRavnmi;
    if (zRavnmi) {
      for (const [k, oz] of [[1, "a3.levelOS"], [2, "a3.levelSS"], [3, "a3.levelUni"]]) {
        const g = mk("button", "k3-raven-gumb", t(oz));
        g.type = "button";
        g.setAttribute("aria-pressed", String(k === raven));
        g.addEventListener("click", () => {
          if (raven === k) return;
          raven = k;
          ravenEl.querySelectorAll("button").forEach((x, i) => x.setAttribute("aria-pressed", String(i + 1 === raven)));
          const d = najdiDel(izbran);
          if (d) pokaziInfo(d);
          mere();
        });
        ravenEl.append(g);
      }
      if (ravenEl.parentNode !== deliEl.parentNode) deliEl.parentNode?.insertBefore(ravenEl, deliEl);
    }
    for (const g of skupineModela()) {
      // skupine pred deli (npr. Zaklopke, Velike žile): en dotik osvetli vse njihove dele
      const b = mk("button", "k3-del k3-del-skupina");
      b.type = "button";
      b.dataset.del = g.id;
      b.setAttribute("aria-pressed", String(g.id === izbran));
      b.append(mk("span", "", g.ime));
      b.title = g.opis;
      b.addEventListener("click", () => izberi(g.id === izbran ? null : g.id));
      deliEl.append(b);
    }
    for (const d of seznam) {
      const b = mk("button", "k3-del");
      b.type = "button";
      b.dataset.del = d.id;
      b.setAttribute("aria-pressed", String(d.id === izbran));
      const pika = mk("i", "k3-pika");
      pika.style.setProperty("--barva", d.barva || "#6E9BFF");
      b.append(pika, mk("span", "", d.ime));
      if (d.opis) b.title = d.opis;
      b.addEventListener("click", () => izberi(d.id === izbran ? null : d.id));
      deliEl.append(b);
    }
    const stevilo = seznam.length;
    deliEl.hidden = !seznam.length;
    if (deliGlava) {
      deliGlava.hidden = !seznam.length;
      deliGlava.replaceChildren(t("a3.parts"), mk("span", "k3-stevec", String(stevilo)));
    }
    // Brez barvnih krogcev čez model (j, 5. 11.): kaj je klikljivo, pokaže sij delov ob prvem ogledu (namigniDele).
    if (izbran && !najdiDel(izbran)) izberi(null, { leti: false });
    else if (izbran) skrijObdajajoce(najdiDel(izbran)); // nova faza: drugi ovoji
    // nov nabor delov (odprtje, drug pogled, faza): po kadriranju (naslednja sličica) en primerek vsakega dela zasije
    if (!izbran) requestAnimationFrame(() => !unicen && namigniDele());
  }

  // Legenda s pravimi merami ob modelu (ne čez; j 6. 11.): model.mere = [{ ime, vrednost }] (npr. organ <o>.json
  // »mere«). Na plošči pod opisom modela; OŠ vidi prvi dve, SŠ štiri, ostale pod »Več o tem«, študij vse.
  let mereEl = null;
  const mere = () => {
    mereEl?.remove();
    mereEl = null;
    const seznam = Array.isArray(model?.mere) ? model.mere.filter((x) => x && x.ime && x.vrednost) : [];
    if (!seznam.length) return;
    mereEl = mk("section", "k3-mere");
    mereEl.append(mk("h2", "k3-mere-glava", t("a3.measures")));
    const vrstice = (xs) => {
      const dl = mk("dl", "k3-mere-seznam");
      for (const x of xs) dl.append(mk("dt", "", x.ime), mk("dd", "", x.vrednost));
      return dl;
    };
    const vidne = seznam.slice(0, raven <= 1 ? 2 : raven === 2 ? 4 : seznam.length);
    mereEl.append(vrstice(vidne));
    if (vidne.length < seznam.length) {
      const vec = mk("details", "k3-info-vec");
      vec.append(mk("summary", "", t("a3.moreAbout")), vrstice(seznam.slice(vidne.length)));
      mereEl.append(vec);
    }
    if (oModelu) {
      oModelu.append(mereEl);
      oModelu.hidden = false;
    } else spodaj.insertBefore(mereEl, deliEl);
  };
  const merilo = () => {
    const m = model && "merilo" in model && model.merilo !== undefined ? (typeof model.merilo === "function" ? model.merilo() : model.merilo) : info.merilo;
    kit.nastaviMerilo(m || null, 2);
    // model.povzetek(): kratka vrstica na odru (npr. prostornina in površina), vidna tudi med vlečenjem drsnika
    let p = "";
    try {
      p = typeof model?.povzetek === "function" ? String(model.povzetek() || "") : "";
    } catch {}
    povzetekEl.textContent = p;
    povzetekEl.hidden = !p;
  };
  // Smer kamere ob odprtju in »Ponastavi«: model.pogled ([x, y, z] ali funkcija, ki ga vrne), sicer privzeto.
  const zacetnaSmer = () => {
    let p = null;
    try {
      p = typeof model?.pogled === "function" ? model.pogled() : model?.pogled;
    } catch {}
    const v = Array.isArray(p) && p.length === 3 && p.every(Number.isFinite) ? new THREE.Vector3(...p) : null;
    return v && v.lengthSq() > 1e-9 ? v : new THREE.Vector3(0.35, 0.3, 1);
  };
  // Okvir ob odprtju in »Ponastavi«: model.okvir() → { sredisce: [x, y, z], polmer }, sicer izhodišče in polmer 1.
  const zacetniOkvir = () => {
    let o = null;
    try {
      o = typeof model?.okvir === "function" ? model.okvir() : model?.okvir;
    } catch {}
    const c = Array.isArray(o?.sredisce) && o.sredisce.length === 3 && o.sredisce.every(Number.isFinite) ? new THREE.Vector3(...o.sredisce) : new THREE.Vector3();
    return [c, o?.polmer > 0 ? o.polmer : 1];
  };
  const osveziIzpise = () => {
    for (const [c, out] of izpisi) {
      try {
        out.textContent = String(c.vrednost?.() ?? "");
      } catch {}
    }
  };
  // Nadzor z vidno(): skrit, ko vrne false; preveri se po vsakem ob().
  const osveziVidnost = () => {
    for (const [c, el] of vidni) {
      let v = true;
      try {
        v = c.vidno() !== false;
      } catch {}
      el.hidden = !v;
    }
    nadzorEl.hidden = ![...nadzorEl.children].some((e) => !e.hidden);
  };
  const poSpremembi = () => {
    if (typeof model?.ao === "function") kit.nastaviAO(model.ao() !== false);
    deli();
    merilo();
    osveziVidnost();
    osveziIzpise();
    kit.narisi();
  };

  function nadzor() {
    nadzorEl.replaceChildren();
    izpisi = [];
    vidni = [];
    sinh = [];
    for (const c of Array.isArray(model?.nadzor) ? model.nadzor : []) {
      const prej = nadzorEl.lastElementChild;
      const klic = (v) => {
        // ponastaviPogled: preklop pogleda (npr. prerez organa) prekliče izbiro in kamero obrne v novo začetno smer.
        if (c.ponastaviPogled && izbran) izberi(null, { leti: false });
        const prej = c.tip === "izbira" && !c.ponastaviPogled ? kadrModela() : null;
        try {
          c.ob?.(v);
        } catch (err) {
          console.error("3D nadzor", c.id, err);
        }
        // nadzor je lahko zamenjal materiale (»Učne barve«): sij izbranega dela znova na nove materiale
        if (izbran && !c.ponastaviPogled) obarvaj(najdiDel(izbran));
        poSpremembi();
        if (c.ponastaviPogled) poleti(...zacetniOkvir(), { smer: zacetnaSmer(), trajanje: 0.7, pokonci: true });
        else if (prej) kadrirajPogled(prej);
      };
      if (c.tip === "drsnik") {
        const lab = mk("label", "k3-drsnik");
        const vrh = mk("span", "k3-drsnik-vrh");
        const out = mk("output", "", stevilo(c.vrednost, c.korak));
        vrh.append(mk("span", "", c.oznaka), out);
        const inp = document.createElement("input");
        inp.type = "range";
        inp.min = c.min;
        inp.max = c.max;
        inp.step = c.korak ?? "any";
        inp.value = c.vrednost;
        inp.setAttribute("aria-label", c.oznaka);
        const sd = { c, zadnja: c.vrednost, nastavi: (v) => ((inp.value = v), (out.textContent = stevilo(v, c.korak))) };
        sinh.push(sd);
        // Med vlečenjem drsnika ostaneta vidna le njegov gumb in tirnica (j, 4. 11.: »da vidiš, kje ustaviti«): plošča,
        // orodja, točke in napisi postanejo prosojni, ob spustu se vrnejo.
        inp.addEventListener("pointerdown", (e) => {
          if (e.button !== 0) return; // desni klik: kontekstni meni pogoltne spust
          const id = e.pointerId;
          const koren = lab.closest(".k3-pregled") || lab;
          lab.classList.add("k3-aktiven");
          koren.classList.add("k3-drsam");
          // Brez pointercancel: iOS ga pošlje takoj, ko drsnik prevzame poteg, in prosojnost bi izginila. Konec
          // vlečenja zato ujamemo s pointerup, touchend (iOS) ali change ob spustu.
          const KONEC = ["pointerup", "touchend", "touchcancel", "blur", "contextmenu"];
          const konec = (ev) => {
            if (ev.pointerId !== undefined && ev.pointerId !== id) return; // drug prst na odru ne konča vlečenja
            if (ev.touches?.length) return; // dvig drugega prsta (touchend nima pointerId)
            lab.classList.remove("k3-aktiven");
            koren.classList.remove("k3-drsam");
            for (const t of KONEC) window.removeEventListener(t, konec);
            inp.removeEventListener("change", konec);
          };
          for (const t of KONEC) window.addEventListener(t, konec);
          inp.addEventListener("change", konec);
        });
        inp.addEventListener("input", () => {
          const v = Number(inp.value);
          c.vrednost = sd.zadnja = v;
          out.textContent = stevilo(v, c.korak);
          klic(v);
        });
        lab.append(vrh, inp);
        nadzorEl.append(lab);
      } else if (c.tip === "izbira") {
        const box = mk("div", "k3-izbira");
        box.append(mk("span", "k3-izbira-oznaka", c.oznaka));
        // Dolg seznam (npr. 44 molekul): spustni meni namesto stene gumbov.
        if ((c.moznosti || []).length > 8) {
          // Lasten spustni seznam v slogu 3D strani (j, 4. 11.: ne sistemskega sivega okna na telefonu).
          const sel = mk("button", "k3-izbor");
          sel.type = "button";
          sel.setAttribute("aria-haspopup", "listbox");
          sel.setAttribute("aria-expanded", "false");
          sel.setAttribute("aria-label", c.oznaka);
          const seznam = mk("div", "k3-izbor-seznam");
          seznam.setAttribute("role", "listbox");
          seznam.setAttribute("aria-label", c.oznaka);
          seznam.hidden = true;
          const moznosti = c.moznosti.map(([k, ime]) => {
            const o = mk("button", "k3-izbor-moznost", ime);
            o.type = "button";
            o.setAttribute("role", "option");
            o.tabIndex = -1;
            o.addEventListener("click", () => {
              zapri(true);
              if (String(k) === String(c.vrednost)) return;
              c.vrednost = si.zadnja = k;
              oznaci(k);
              klic(k);
            });
            return [k, o];
          });
          seznam.append(...moznosti.map(([, o]) => o));
          const oznaci = (v) => {
            for (const [k, o] of moznosti) o.setAttribute("aria-selected", String(String(k) === String(v)));
            sel.textContent = c.moznosti.find(([k]) => String(k) === String(v))?.[1] ?? "";
          };
          const zunaj = (ev) => { if (!box.contains(ev.target)) zapri(false); };
          const zapri = (fokus) => {
            if (seznam.hidden) return;
            seznam.hidden = true;
            box.classList.remove("k3-odprt");
            sel.setAttribute("aria-expanded", "false");
            document.removeEventListener("pointerdown", zunaj, true);
            if (fokus) sel.focus();
          };
          const odpri = () => {
            seznam.hidden = false;
            box.classList.add("k3-odprt");
            sel.setAttribute("aria-expanded", "true");
            const izbrana = moznosti.find(([k]) => String(k) === String(c.vrednost))?.[1] || moznosti[0]?.[1];
            izbrana?.focus({ preventScroll: true });
            if (izbrana) seznam.scrollTop = izbrana.offsetTop - seznam.clientHeight / 2 + izbrana.offsetHeight / 2;
            seznam.scrollIntoView?.({ block: "nearest" });
            document.addEventListener("pointerdown", zunaj, true);
          };
          sel.addEventListener("click", () => (seznam.hidden ? odpri() : zapri(false)));
          sel.addEventListener("keydown", (ev) => {
            if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); odpri(); }
          });
          seznam.addEventListener("keydown", (ev) => {
            const gumbi = moznosti.map(([, o]) => o), i = gumbi.indexOf(document.activeElement);
            if (ev.key === "Escape") { ev.preventDefault(); zapri(true); }
            else if (ev.key === "Tab") zapri(false);
            else if (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Home" || ev.key === "End") {
              ev.preventDefault();
              const n = ev.key === "Home" ? 0 : ev.key === "End" ? gumbi.length - 1 : Math.max(0, Math.min(gumbi.length - 1, i + (ev.key === "ArrowDown" ? 1 : -1)));
              gumbi[n]?.focus();
            }
          });
          const si = { c, zadnja: c.vrednost, nastavi: (v) => oznaci(v) };
          sinh.push(si);
          oznaci(c.vrednost);
          box.classList.add("k3-izbira-meni");
          box.append(sel, seznam);
          nadzorEl.append(box);
          if (typeof c.vidno === "function") vidni.push([c, box]);
          continue;
        }
        const seg = mk("div", "seg k3-seg");
        seg.setAttribute("role", "radiogroup");
        seg.setAttribute("aria-label", c.oznaka);
        const oznaci = (v) =>
          seg.querySelectorAll("button").forEach((x) => {
            const da = x.dataset.k === String(v);
            x.classList.toggle("active", da);
            x.setAttribute("aria-checked", String(da));
          });
        const si = { c, zadnja: c.vrednost, nastavi: oznaci };
        sinh.push(si);
        for (const [k, ime] of c.moznosti || []) {
          const b = mk("button", String(k) === String(c.vrednost) ? "active" : "", ime);
          b.dataset.k = String(k);
          b.type = "button";
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", String(String(k) === String(c.vrednost)));
          b.addEventListener("click", () => {
            c.vrednost = si.zadnja = k;
            oznaci(k);
            klic(k);
          });
          seg.append(b);
        }
        box.append(seg);
        nadzorEl.append(box);
      } else if (c.tip === "gumb") {
        const b = mk("button", "k3-pill", c.oznaka);
        b.type = "button";
        b.addEventListener("click", () => klic());
        nadzorEl.append(b);
      } else if (c.tip === "stikalo") {
        const lab = mk("div", "k3-stikalo");
        const sw = mk("button", "switch");
        sw.type = "button";
        sw.setAttribute("role", "switch");
        sw.setAttribute("aria-checked", String(!!c.vrednost));
        sw.setAttribute("aria-label", c.oznaka);
        const ss = { c, zadnja: c.vrednost, nastavi: (v) => sw.setAttribute("aria-checked", String(!!v)) };
        sinh.push(ss);
        sw.addEventListener("click", () => {
          c.vrednost = ss.zadnja = !c.vrednost;
          sw.setAttribute("aria-checked", String(!!c.vrednost));
          klic(!!c.vrednost);
        });
        lab.append(mk("span", "", c.oznaka), sw);
        nadzorEl.append(lab);
      } else if (c.tip === "izpis") {
        const line = mk("div", "k3-izpis");
        const out = mk("output", "");
        out.setAttribute("aria-live", "polite");
        line.append(mk("span", "", c.oznaka), out);
        izpisi.push([c, out]);
        nadzorEl.append(line);
      }
      const el = nadzorEl.lastElementChild;
      if (typeof c.vidno === "function" && el && el !== prej) vidni.push([c, el]);
    }
    osveziVidnost();
    osveziIzpise();
  }

  let gradnja = 0;
  let unicen = false;
  function zgradiVse(ponastavi) {
    izbran = null;
    ustaviNamigSij();
    if (kit) pokaziInfo(null);
    obarvaj(null); // izvirni materiali nazaj, kopije sproščene
    skrijObdajajoce(null);
    try {
      model?.dispose?.();
    } catch {}
    if (model?.group) kit?.scene.remove(model.group);
    if (!kit) {
      kit = ustvariSceno(oder, { kakovost: opts.kakovost, oznaka: info.naslov, ponastavi: () => zgradiVse(true), prostoVrtenje: true });
      poveziGumbVrtenja(btnVrtenje, kit, icon, t);
      oder.append(orodja, povzetekEl);
      kit.naTap((ndc) => {
        if (!model?.group) return;
        const hit = kit.zadetki(ndc, [model.group])[0];
        if (!hit) return izberi(null);
        const zadeti = (model.deli || []).filter((x) => (x.meshes || []).some((m) => m === hit.object || m === hit.object.parent));
        // tap: OŠ izbere skupni del (npr. Venčne arterije), SŠ in študij najožji (posamezno žilo)
        const d = raven <= 1 ? zadeti.find((x) => !x.skupina) || zadeti[0] : zadeti.find((x) => x.skupina) || zadeti[0];
        izberi(d?.id ?? null, { hit: { object: hit.object, instanceId: hit.instanceId ?? null, point: hit.point.clone() }, preklopi: true });
      });
      pocisti.push(
        kit.naKorak((dt) => {
          cas += dt;
          const sije = korakNamigSija(dt);
          if (casIzpisa += dt, casIzpisa > 0.25) {
            casIzpisa = 0;
            // deli je lahko getter, ki se spreminja s fazo: ob spremembi znova zgradimo seznam in točke.
            const zdaj = Array.isArray(model?.deli) ? model.deli : [];
            if (zdaj.length !== zadnjiDeli.length || zdaj.some((d, i) => d !== zadnjiDeli[i])) deli();
            // Vrednost, ki jo je spremenil model (npr. predvajalnik korakov): gradnik posodobimo le ob spremembi.
            for (const x of sinh) {
              if (x.c.vrednost === x.zadnja) continue;
              x.zadnja = x.c.vrednost;
              try {
                x.nastavi(x.c.vrednost);
              } catch {}
            }
            osveziVidnost();
            osveziIzpise();
            if (typeof model?.merilo === "function" || typeof model?.povzetek === "function") merilo();
          }
          if (!model?.korak || !tece) return sije;
          try {
            // korak lahko vrne false, ko ni več česa premikati (prizor se tedaj ne riše vsako sličico)
            if (model.korak(cas, dt) === false) return sije;
          } catch (err) {
            console.error("3D korak", err);
            tece = false;
          }
          return true;
        }),
      );
      if (kit.kakovost === "visoka") kit.pripraviAO(0.3);
      if (opts.stran) {
        // Namig na odru, dokler se ga prvič ne dotakneš (kot v atlasu).
        const grob = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
        const namig = mk("p", "k3-namig", t(grob ? "a3.hintModel" : "a3.hintModelMouse"));
        oder.append(namig);
        oder.classList.add("k3-namig-viden"); // telefon: merilo nad namigom, dokler je ta viden
        let skrit = false;
        const skrij = () => {
          if (skrit) return;
          skrit = true;
          namig.classList.add("skrit");
          oder.classList.remove("k3-namig-viden");
        };
        setTimeout(skrij, 9000);
        kit.canvas.addEventListener("pointerdown", skrij, { once: true });
        kit.canvas.addEventListener("wheel", skrij, { once: true, passive: true });
      }
    }
    const moj = ++gradnja;
    const ctx = {
      kakovost: kit.kakovost,
      gibanje: kit.gibanje,
      zacetek: { ...zacetek },
      t,
      raven: ravenZacetna, // raven profila (1 OŠ): organ.js privzeto vklopi učne barve (barve.js)
      // Modeli iz datotek (docs/3d.md): naloziGLB(pot glede na public/3d/modeli/) in organi iz modeli/organi-3d (organ.js).
      naloziGLB: (pot, napredek) => import("./organ.js").then((m) => m.naloziGLB(new URL(pot, new URL("./modeli/", import.meta.url)).href, napredek)),
      organ: (ime) => import("./organ.js").then((m) => m.zgradiOrgan(ime, ctx)),
      napredek: (d) => nalaganje(d),
    };
    let r;
    try {
      r = zgradi(THREE, ctx);
    } catch (err) {
      return napaka(err);
    }
    if (r && typeof r.then === "function") {
      model = null;
      nalaganje(0);
      r.then(
        (m) => moj === gradnja && !unicen && dokoncaj(m || {}, ponastavi),
        (err) => moj === gradnja && !unicen && napaka(err),
      );
      return;
    }
    dokoncaj(r || {}, ponastavi);
  }

  // Nalaganje (graditelj vrne obljubo): prekrivna plast z deležem prenosa; napaka: sporočilo namesto praznega odra.
  let nalagEl = null;
  function nalaganje(d) {
    if (d == null) {
      nalagEl?.remove();
      nalagEl = null;
      return;
    }
    if (!nalagEl) {
      nalagEl = mk("div", "k3-nalaganje");
      nalagEl.setAttribute("role", "status");
      nalagEl.append(mk("p", "", t("a3.organLoading")), mk("span", "k3-nalaganje-trak"));
      nalagEl.lastChild.append(mk("i", ""));
      oder.append(nalagEl);
    }
    nalagEl.lastChild.firstChild.style.width = `${Math.round(Math.max(0.04, Math.min(1, d)) * 100)}%`;
  }
  function napaka(err) {
    console.error("3D model", err);
    nalaganje(0);
    nalagEl.classList.add("napaka");
    nalagEl.firstChild.textContent = t("a3.loadError");
    nalagEl.lastChild.hidden = true;
  }

  // »Podrobnosti organa«: gumb pod odrom in list z besedilom (model.podrobnosti = { naslov, odseki: [{ naslov, besedilo }] }).
  let listEl = null;
  function podrobnostiGumb() {
    el.querySelector(".k3-podrobnosti-gumb")?.remove();
    if (!model?.podrobnosti?.odseki?.length) return;
    const b = mk("button", "k3-pill k3-podrobnosti-gumb");
    b.type = "button";
    b.innerHTML = `<span></span>${icon("arrow-right")}`;
    b.firstChild.textContent = t("a3.organDetails");
    b.setAttribute("aria-haspopup", "dialog");
    b.addEventListener("click", () => odpriList(b));
    spodaj.append(b);
  }
  function zapriList() {
    if (!listEl) return;
    const vrni = listEl._vrni;
    listEl.remove();
    listEl = null;
    vrni?.focus();
  }
  function odpriList(vrni) {
    zapriList();
    const p = model.podrobnosti;
    const ozadje = mk("div", "k3-list-ozadje");
    const list = mk("section", "k3-list");
    list.setAttribute("role", "dialog");
    list.setAttribute("aria-modal", "true");
    const h = mk("h2", "", p.naslov || info.naslov);
    h.id = `k3-list-${info.id}`;
    list.setAttribute("aria-labelledby", h.id);
    const zapri = mk("button", "k3-krog");
    zapri.type = "button";
    zapri.innerHTML = icon("x");
    zapri.setAttribute("aria-label", t("a3.close"));
    zapri.title = t("a3.close");
    zapri.addEventListener("click", zapriList);
    const glava = mk("header", "k3-list-glava");
    glava.append(mk("div", ""), zapri);
    glava.firstChild.append(mk("p", "k3-nadnaslov", t("a3.organDetails")), h);
    const vsebina = mk("div", "k3-list-vsebina");
    for (const o of p.odseki) {
      const art = mk("article", "");
      art.append(mk("h3", "", o.naslov), mk("p", "", o.besedilo));
      vsebina.append(art);
    }
    list.append(glava, vsebina);
    ozadje.append(list);
    ozadje.addEventListener("click", (e) => e.target === ozadje && zapriList());
    ozadje.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        zapriList();
      } else if (e.key === "Tab") {
        // Fokus ostane v listu (en sam gumb in drsno besedilo).
        e.preventDefault();
        (document.activeElement === zapri ? vsebina : zapri).focus();
      }
    });
    vsebina.tabIndex = 0;
    el.append(ozadje);
    listEl = ozadje;
    listEl._vrni = vrni;
    zapri.focus();
  }

  function dokoncaj(m, ponastavi) {
    model = m;
    nalaganje(null);
    el.classList.toggle("k3-organ", model.postavitev === "organ");
    // Organ: nadzor (npr. stikalo »Prerez«) lebdi na odru levo zgoraj, spodaj ostanejo deli in »Podrobnosti organa«.
    if (model.postavitev === "organ") oder.append(nadzorEl);
    else if (nadzorEl.parentNode !== spodaj) spodaj.insertBefore(nadzorEl, deliGlava || deliEl);
    if (model.group) kit.scene.add(model.group);
    kit.nastaviLuci(model.luci !== false);
    // Skupni studijski HDR (model.okolje = { ime, jakost, zasuk }), sicer privzeto okolje kompleta.
    kit.nastaviOkolje(model.luci !== false ? model.okolje?.ime || null : null, model.okolje || {}).catch(() => kit.nastaviOkolje(null));
    // Začetne vrednosti kontrol (katalog ali naslov): nastavimo in pokličemo ob().
    for (const c of Array.isArray(model.nadzor) ? model.nadzor : []) {
      if (c.id in zacetek && c.tip !== "gumb" && c.tip !== "izpis") {
        // ob() dobi pretvorjeno vrednost neposredno: getter lahko vrne staro stanje, dokler ob() ne teče.
        const v = pretvori(c, zacetek[c.id]);
        c.vrednost = v;
        try {
          c.ob?.(v);
        } catch (err) {
          console.error("3D nadzor", c.id, err);
        }
      }
    }
    btnTeci.hidden = typeof model.korak !== "function" || model.korakBrezGumba === true;
    nastaviTek(typeof model.korak === "function" && kit.gibanje);
    cas = 0;
    nadzor();
    if (!ponastavi) raven = ravenZacetna; // nov model: raven profila (pregled #461)
    deli();
    merilo();
    mere();
    pokaziInfo(null);
    podrobnostiGumb();
    if (typeof model.ao === "function") kit.nastaviAO(model.ao() !== false);
    if (ponastavi || !opts.ohraniPogled) {
      kit.controls.minDistance = 0.4;
      kit.controls.maxDistance = 12;
      // Model cel in na sredini (kadrModela: vidni obseg, organ svoj okvir).
      const leti = () => poleti(...kadrModela(), { smer: zacetnaSmer(), trajanje: ponastavi ? 0.6 : 0, pokonci: true });
      leti();
      // Postavitev »organ« spremeni višino odra šele ob naslednji postavitvi strani (ResizeObserver): kader ponovimo,
      // da organ pade v ožji zorni kot (pokončen telefon).
      if (model.postavitev === "organ" && !ponastavi) requestAnimationFrame(() => requestAnimationFrame(() => !unicen && model === m && leti()));
    }
    kit.narisi();
    // Del iz naslova (»#organ-srce?del=levi prekat«, gumb inštruktorja public/odpri.js): po id-ju ali imenu.
    if (zacetek.del && !ponastavi) {
      // del (tudi »membrana« → Celična membrana, sinonimi »mitralna zaklopka«) pred skupino (»zaklopke«, »organeli« …;
      // id iz strežnika ali besede, tudi v jeziku vmesnika): skupine.js zacetnaIzbira
      const cilj = zacetnaIzbira(info.id, model.deli, zacetek.del, Object.fromEntries((SKUPINE[info.id] || []).map((x) => [x.id, [t(`a3.grp.${x.id}`)]])));
      if (cilj) requestAnimationFrame(() => !unicen && model === m && izberi(cilj, { pomakni: false }));
    }
  }

  zgradiVse(false);
  const api = {
    get kit() {
      return kit;
    },
    get model() {
      return model;
    },
    izberi,
    // kader modela [središče, polmer] (scripts/preveri-3d-okna.cjs preveri, da je cel v kadru)
    kader: () => kadrModela(),
    unici() {
      for (const f of pocisti) f();
      unicen = true;
      ustaviNamigSij();
      obarvaj(null);
      matObrisa?.dispose();
      try {
        model?.dispose?.();
      } catch {}
      kit?.unici();
      el.replaceChildren();
    },
  };
  el.k3Pregled = api; // scripts/preveri-3d-okna.cjs bere kamero in model (kader, prekrivanje)
  return api;
}

export { kakovostNaprave, gibanje };
