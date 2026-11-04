// Stožnice kot presek stožca (SŠ, nad skico krožnice na kartici Krožnica): 3D pogled (Three.js) dvoplaščnega stožca
// iz modrih tvorilk, polprosojna rumenkasta ravnina z robom in presečna krivulja kot bela črta z rumenim sijem.
// Gumbi Krožnica / Elipsa / Parabola / Hiperbola / Skozi vrh nastavijo ravnino; v kotu: predvajaj, prerez, ponastavi.
// Plošča »PRESEK«: naklon ravnine τ, višina h na osi in polovični kot stožca α (drsnik in vnosno polje).
// Vrsta krivulje: τ = 0 krožnica, τ < 90° − α elipsa, τ = 90° − α parabola, τ > 90° − α hiperbola; h = 0 izrojeni primeri.
import { skica, st, vr } from "./skica.js";
import { h } from "../sim/kit.js";

export const VISINA = 1.6; // višina vsakega plašča (od vrha)
export const VRSTE = ["Krožnica", "Elipsa", "Parabola", "Hiperbola", "Skozi vrh"];
const RAD = Math.PI / 180;

// Ravnina gre skozi vrh, ko je h = 0 ali ko je navpična (τ = 90°): takrat vsebuje os stožca.
export const skoziVrh = (tau, hh) => Math.abs(hh * Math.cos(tau * RAD)) < 1e-9;

// Vrsta preseka iz τ, α (v stopinjah) in h.
export function vrsta(tau, alfa, hh) {
  const meja = 90 - alfa, d = tau - meja, eps = 1e-9;
  if (skoziVrh(tau, hh)) return d < -eps ? "točka" : d > eps ? "par premic" : "premica";
  if (Math.abs(tau) < eps) return "krožnica";
  return d < -eps ? "elipsa" : d > eps ? "hiperbola" : "parabola";
}

// Izsrednost preseka: e = sin τ / cos α (0 krožnica, < 1 elipsa, 1 parabola, > 1 hiperbola).
export const izsrednost = (tau, alfa) => Math.sin(tau * RAD) / Math.cos(alfa * RAD);

// Nastavitev gumba: ravnina, pri kateri nastane ta krivulja (parabola natanko pri τ = 90° − α).
export function nastavitev(ime, alfa, prej = { tau: 0, h: 1 }) {
  const meja = 90 - alfa, hh = Math.abs(prej.h) > 1e-9 ? prej.h : 1;
  if (ime === "Krožnica") return { tau: 0, h: hh };
  if (ime === "Elipsa") return { tau: Math.round(meja / 2), h: hh };
  if (ime === "Parabola") return { tau: meja, h: hh };
  if (ime === "Hiperbola") return { tau: Math.min(89, meja + Math.max(10, Math.round(alfa / 2))), h: hh };
  // Skozi vrh: h = 0, naklon ostane (točka, premica ali par premic).
  return { tau: prej.tau, h: 0 };
}

// Ravnina: skozi (0, h, 0), normala n = (0, cos τ, sin τ) (vodoravna ravnina, zasukana za τ okoli osi x).
// Točke preseka s stožcem p = t·(sin α cos θ, cos α, sin α sin θ), |t cos α| ≤ VISINA, znotraj kvadrata ravnine
// (polovica stranice pol); vrne odseke (seznami točk). Konci odsekov so poiskani z razpolavljanjem, zato krivulja
// sega točno do roba stožca ali ravnine.
export function krivulja(tau, alfa, hh, { n = 720, pol = 2.8 } = {}) {
  const ct = Math.cos(tau * RAD), stt = Math.sin(tau * RAD), ca = Math.cos(alfa * RAD), sa = Math.sin(alfa * RAD);
  const smer = (th) => [sa * Math.cos(th), ca, sa * Math.sin(th)];
  // Lokalne koordinate v ravnini: u = x, w = razdalja vzdolž naklona.
  const znotraj = (p) => Math.abs(p[1]) <= VISINA + 1e-9 && Math.abs(p[0]) <= pol + 1e-9 && Math.abs((p[1] - hh) * -stt + p[2] * ct) <= pol + 1e-9;
  // Razpolavljanje med dobro (a) in slabo (b) vrednostjo parametra.
  const meja = (a, b, tocka) => {
    for (let i = 0; i < 40; i++) {
      const m = (a + b) / 2, p = tocka(m);
      if (p && znotraj(p)) a = m;
      else b = m;
    }
    return tocka(a);
  };
  const odseki = [];
  // Vzorčenje po parametru u od u0 do u1 (n korakov); vsak odsek dobi natančna konca.
  const vzorci = (tocka, u0, u1, k) => {
    let tren = [], prej = null;
    for (let i = 0; i <= k; i++) {
      const u = u0 + ((u1 - u0) * i) / k, p = tocka(u), ok = !!p && znotraj(p);
      if (ok && !tren.length && prej != null) tren.push(meja(u, prej, tocka));
      if (ok) tren.push(p);
      else if (tren.length) {
        tren.push(meja(prej, u, tocka));
        if (tren.length > 1) odseki.push(tren);
        tren = [];
      }
      prej = u;
    }
    if (tren.length > 1) odseki.push(tren);
  };
  if (skoziVrh(tau, hh)) {
    // Skozi vrh: tvorilke, za katere je n·d = 0 (sin θ = −ct·ca / (stt·sa)), odrezane na kvadrat ravnine.
    const s = stt * sa > 1e-12 ? (-ct * ca) / (stt * sa) : Infinity;
    if (Math.abs(s) > 1 + 1e-12) return { odseki: [], tocka: [0, 0, 0] };
    const th = Math.asin(Math.max(-1, Math.min(1, s))), T = VISINA / ca;
    for (const t0 of Math.abs(Math.abs(s) - 1) < 1e-12 ? [th] : [th, Math.PI - th]) {
      const d = smer(t0);
      vzorci((t) => d.map((x) => x * t), -T, T, 64);
    }
    return { odseki, tocka: null };
  }
  vzorci((th) => {
    const d = smer(th), nd = ct * d[1] + stt * d[2];
    if (Math.abs(nd) < 1e-12) return null;
    const t = (hh * ct) / nd;
    return d.map((x) => x * t);
  }, 0, 2 * Math.PI, n);
  // Zaprta krivulja (krožnica, elipsa) ali veja čez θ = 0: prvi in zadnji odsek se stakneta.
  if (odseki.length > 1) {
    const a = odseki[0], b = odseki[odseki.length - 1];
    if (Math.hypot(...a[0].map((x, k) => x - b[b.length - 1][k])) < 1e-6) {
      odseki[0] = b.concat(a.slice(1));
      odseki.pop();
    }
  }
  return { odseki, tocka: null };
}

export default async function narisi(host, { potem } = {}) {
  const S = skica({ w: 300, h: 230, navodilo: "Povleci, da zavrtiš stožec.", oznaka: "Stožnice kot presek stožca z ravnino" });
  let tau = 35, hh = 1, alfa = 30;
  // 3D platno namesto SVG.
  const oder = h("div", { class: "sk-3d" });
  S.svg.replaceWith(oder);
  const napis = h("div", { class: "sk-3d-vrsta", "aria-live": "polite" });
  const gumbV = (znak, opis, fn) => h("button", { type: "button", class: "sk-3d-btn", "aria-label": opis, title: opis, onclick: fn }, znak);
  let tece = null, prerez = false, gotovo = false;
  const bPrerez = gumbV("✂", "Prerez: skrij del stožca nad ravnino", () => ((prerez = !prerez), bPrerez.classList.toggle("on", prerez), bPrerez.setAttribute("aria-pressed", prerez), posodobi()));
  bPrerez.setAttribute("aria-pressed", "false");
  const bPredvajaj = gumbV("▶", "Predvajaj: ravnina se počasi nagiba", () => (tece ? ustavi() : predvajaj()));
  const kot = h("div", { class: "sk-3d-kot" }, bPredvajaj, bPrerez, gumbV("⟲", "Ponastavi pogled", () => ponastavi()));
  oder.append(napis, kot);
  host.append(S.el);

  const seg = S.gumbi({ label: "Vrsta preseka", options: VRSTE, value: "", onChange: (v) => (ustavi(), nastavi(nastavitev(v, alfa, { tau, h: hh }))) });
  const panel = h("p", { class: "sk-panel-t" }, h("b", {}, "PRESEK"), " · Nagni in premakni ravnino");
  seg.after(panel);
  // Drsnik z vnosnim poljem (vnos se omeji na meje in korak drsnika).
  const polje = (sl, min, max, korak, d) => {
    const vnos = h("input", { type: "text", class: "sk-num", inputmode: "decimal", autocomplete: "off", "aria-label": sl.input.getAttribute("aria-label") });
    sl.querySelector("output").replaceWith(vnos); // vnosno polje namesto izpisa vrednosti
    const pokazi = () => (vnos.value = st(Number(sl.get()), d));
    sl.input.addEventListener("input", pokazi);
    vnos.addEventListener("keydown", (e) => e.key === "Enter" && vnos.blur());
    vnos.addEventListener("focus", () => ustavi()); // predvajanje ne prepisuje vnosa
    vnos.addEventListener("change", () => {
      const v = Math.min(max, Math.max(min, Math.round(Number(String(vnos.value).replace(",", ".").replace("−", "-")) / korak) * korak));
      if (!String(vnos.value).trim()) return pokazi(); // prazno polje ne pomeni 0
      if (Number.isFinite(v)) sl.set(Number(v.toFixed(d)));
      pokazi();
    });
    sl.pokazi = pokazi;
    pokazi();
    return sl;
  };
  const sTau = polje(S.drsnik({ label: "naklon τ (°)", min: 0, max: 90, step: 1, value: tau, digits: 0, barva: "izbor", onInput: (v) => (ustavi(), (tau = v), posodobi()) }), 0, 90, 1, 0);
  const sH = polje(S.drsnik({ label: "višina h", min: -1, max: 1, step: 0.1, value: hh, digits: 1, barva: "ploskev", onInput: (v) => (ustavi(), (hh = Math.round(v * 10) / 10), posodobi()) }), -1, 1, 0.1, 1);
  const sA = polje(S.drsnik({ label: "polovični kot α (°)", min: 15, max: 60, step: 1, value: alfa, digits: 0, barva: "ploskev", onInput: (v) => (ustavi(), (alfa = v), gotovo && zgradiStozec(), posodobi()) }), 15, 60, 1, 0);

  cipi(); // oznaka in čipi že med nalaganjem Three.js

  function nastavi(o) {
    tau = o.tau;
    hh = o.h;
    sTau.set(tau, true), sTau.pokazi();
    sH.set(hh, true), sH.pokazi();
    posodobi();
  }

  function cipi() {
    const v = vrsta(tau, alfa, hh), e = izsrednost(tau, alfa);
    const znak = Math.abs(tau - (90 - alfa)) < 1e-9 ? "=" : tau < 90 - alfa ? "<" : ">";
    napis.textContent = v.toUpperCase();
    seg.set(hh === 0 || skoziVrh(tau, hh) ? "Skozi vrh" : VRSTE.find((x) => x.toLowerCase() === v) || "", true);
    S.cipi([
      { barva: "izbor", oznaka: `\\tau ${znak} 90^\\circ - \\alpha`, vrednost: `${st(tau, 0)}° ${znak} ${st(90 - alfa, 0)}°` },
      { barva: "glavna", oznaka: "e = \\frac{\\sin \\tau}{\\cos \\alpha}", vrednost: skoziVrh(tau, hh) ? "–" : vr(e, 3) },
      { barva: "ploskev", oznaka: "\\text{presek}", vrednost: v },
    ]);
  }

  // Three.js se naloži šele zdaj (kartica je vidna).
  let T3;
  try {
    const THREE = await import("/vendor/three/build/three.module.js");
    const { OrbitControls } = await import("/vendor/three/examples/jsm/controls/OrbitControls.js");
    T3 = { THREE, OrbitControls };
  } catch {
    T3 = null;
  }
  let renderer = null;
  if (T3) {
    try {
      renderer = new T3.THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      renderer = null;
    }
  }
  if (!renderer) {
    oder.classList.add("sk-3d-brez");
    kot.hidden = true;
    oder.append(h("p", { class: "sk-hint" }, "3D pogled v tem brskalniku ni na voljo (WebGL)."));
    cipi();
    if (potem) (await potem()).default(host);
    return;
  }
  const { THREE, OrbitControls } = T3;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  const platno = renderer.domElement;
  platno.className = "sk-3d-platno";
  platno.tabIndex = 0;
  platno.setAttribute("aria-label", "3D pogled stožca in ravnine; povleci ali uporabi puščice za vrtenje");
  oder.prepend(platno);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const ZACETEK = new THREE.Vector3(4.6, 2.5, 5.6);
  camera.position.copy(ZACETEK);
  const controls = new OrbitControls(camera, platno);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  // Na telefonu navpični poteg še vedno pomika stran, vodoravni vrti stožec.
  platno.style.touchAction = "pan-y";
  platno.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), (e.key === "ArrowRight" ? -1 : 1) * 10 * RAD);
    controls.update();
    risi = true;
  });
  let risi = true;
  controls.addEventListener("change", () => (risi = true));

  const barva = (ime) => getComputedStyle(S.el).getPropertyValue(`--sk-${ime}`).trim() || "#ffffff";
  const rezStozca = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const stozec = new THREE.Group();
  scene.add(stozec);
  const matTv = new THREE.LineBasicMaterial({ color: barva("pt"), transparent: true, opacity: 0.75 });
  function zgradiStozec() {
    for (const c of [...stozec.children]) (c.geometry.dispose(), stozec.remove(c));
    const ca = Math.cos(alfa * RAD), sa = Math.sin(alfa * RAD), T = VISINA / ca, N = 40, tocke = [];
    for (let i = 0; i < N; i++) {
      const th = (2 * Math.PI * i) / N, d = [sa * Math.cos(th) * T, ca * T, sa * Math.sin(th) * T];
      tocke.push(new THREE.Vector3(-d[0], -d[1], -d[2]), new THREE.Vector3(...d));
    }
    for (const y of [-VISINA, VISINA]) {
      const R = VISINA * Math.tan(alfa * RAD);
      for (let i = 0; i < 96; i++) {
        const a = (2 * Math.PI * i) / 96, b = (2 * Math.PI * (i + 1)) / 96;
        tocke.push(new THREE.Vector3(R * Math.cos(a), y, R * Math.sin(a)), new THREE.Vector3(R * Math.cos(b), y, R * Math.sin(b)));
      }
    }
    stozec.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tocke), matTv));
    // Os stožca, tanko.
    stozec.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -VISINA - 0.3, 0), new THREE.Vector3(0, VISINA + 0.3, 0)]), new THREE.LineBasicMaterial({ color: 0x8a8fa8, transparent: true, opacity: 0.5 })));
  }
  zgradiStozec();

  const POL = 2.5;
  const ravnina = new THREE.Group();
  ravnina.add(new THREE.Mesh(new THREE.PlaneGeometry(2 * POL, 2 * POL).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: barva("izbor"), transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })));
  const rob = [[-POL, -POL], [POL, -POL], [POL, POL], [-POL, POL], [-POL, -POL]].map(([x, z]) => new THREE.Vector3(x, 0, z));
  ravnina.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rob), new THREE.LineBasicMaterial({ color: barva("izbor"), transparent: true, opacity: 0.8 })));
  scene.add(ravnina);
  const presek = new THREE.Group();
  scene.add(presek);
  const matSij = new THREE.MeshBasicMaterial({ color: barva("izbor"), transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
  const matCrta = new THREE.MeshBasicMaterial({ color: 0xffffff });

  function posodobi() {
    cipi();
    if (!gotovo) return; // Three.js se še nalaga (ali ga ni): čipi in oznaka so že pravi
    ravnina.position.set(0, hh, 0);
    ravnina.rotation.set(tau * RAD, 0, 0);
    const n = new THREE.Vector3(0, Math.cos(tau * RAD), Math.sin(tau * RAD));
    // Prerez: obdrži samo del stožca pod ravnino (−n·p + h·cos τ ≥ 0).
    rezStozca.normal.copy(n).negate();
    rezStozca.constant = hh * Math.cos(tau * RAD);
    if ((matTv.clippingPlanes?.length || 0) !== (prerez ? 1 : 0)) (matTv.clippingPlanes = prerez ? [rezStozca] : []), (matTv.needsUpdate = true);
    for (const c of [...presek.children]) (c.geometry.dispose(), presek.remove(c));
    const { odseki, tocka } = krivulja(tau, alfa, hh, { pol: POL });
    for (const o of odseki) {
      const pts = o.map((p) => new THREE.Vector3(...p));
      const pot = pts.length === 2 ? new THREE.LineCurve3(pts[0], pts[1]) : new THREE.CatmullRomCurve3(pts, false, "centripetal");
      const k = Math.min(600, pts.length * 2);
      presek.add(new THREE.Mesh(new THREE.TubeGeometry(pot, k, 0.07, 8, false), matSij));
      presek.add(new THREE.Mesh(new THREE.TubeGeometry(pot, k, 0.022, 8, false), matCrta));
    }
    if (tocka) {
      presek.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), matSij));
      presek.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 14), matCrta));
    }
    risi = true;
  }

  // Predvajaj: ravnina se nagiba od 0° do 90° (krožnica → elipsa → parabola → hiperbola), 9 sekund.
  function predvajaj() {
    if (hh === 0) nastavi({ tau, h: 1 });
    const t0 = performance.now(), od = 0;
    bPredvajaj.textContent = "❚❚";
    bPredvajaj.setAttribute("aria-label", "Ustavi predvajanje");
    tece = (t) => {
      // Do 89°: pri 90° bi ravnina vsebovala os (par premic skozi vrh), predvajanje pa naj konča pri hiperboli.
      const v = Math.min(89, od + ((t - t0) / 9000) * 89);
      if (Math.round(v) !== tau) {
        tau = Math.round(v);
        sTau.set(tau, true), sTau.pokazi();
        posodobi();
      }
      if (v >= 89) ustavi();
    };
  }
  function ustavi() {
    if (!tece) return;
    tece = null;
    bPredvajaj.textContent = "▶";
    bPredvajaj.setAttribute("aria-label", "Predvajaj: ravnina se počasi nagiba");
  }
  function ponastavi() {
    camera.position.copy(ZACETEK);
    controls.target.set(0, 0, 0);
    controls.update();
    velikost(true);
  }

  let sirina = 0;
  function velikost(vedno) {
    const w = oder.clientWidth || 300;
    if (w === sirina && vedno !== true) return;
    sirina = w;
    const hgt = Math.round(Math.min(340, Math.max(230, w * 0.78)));
    renderer.setSize(w, hgt, false);
    platno.style.width = "100%";
    platno.style.height = `${hgt}px`;
    camera.aspect = w / hgt;
    // Ozek zaslon: kamera dlje, da cel stožec ostane v sliki.
    camera.position.setLength(ZACETEK.length() * Math.max(1, 1.15 * (hgt / w)));
    camera.updateProjectionMatrix();
    risi = true;
  }
  const ro = new ResizeObserver(() => requestAnimationFrame(() => velikost()));
  ro.observe(oder);
  gotovo = true;
  velikost(true);
  posodobi();
  let zivo = true;
  function zanka(t) {
    if (!zivo) return;
    // Kartica ni več na strani: sprosti WebGL (brskalnik jih ima omejeno število).
    if (!platno.isConnected) {
      zivo = false;
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      return;
    }
    if (tece) tece(t);
    if (controls.update() || risi) {
      renderer.render(scene, camera);
      risi = false;
    }
    requestAnimationFrame(zanka);
  }
  requestAnimationFrame(zanka);
  if (potem) (await potem()).default(host);
}
