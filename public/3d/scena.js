// Skupni gradnik 3D prizorov (docs/3d.md): izrisovalnik z varčno ločljivostjo, studijska svetloba (PMREM iz
// RoomEnvironment), filmska preslikava tonov, vrtenje z dušenjem in prsti, izbira s tapom, mehak prelet kamere,
// barvne točke (ostanejo pripete, skrijejo se za predmeti in za kamero), oznaka ob točki, merilo, samodejna
// kakovost po napravi (šibek telefon: manjša ločljivost, brez dragih učinkov) in risanje samo ob spremembi.
// Uvozi gredo po polni poti (/vendor/three/…), zato modul deluje tudi v glavni aplikaciji brez importmap.
import * as THREE from "/vendor/three/build/three.module.js";
import { OrbitControls } from "/vendor/three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "/vendor/three/examples/jsm/environments/RoomEnvironment.js";

export { THREE };

const shramba = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

// Manj gibanja (sistemska nastavitev): brez samodejnega vrtenja, preleti so takojšnji.
export const gibanje = () => !(typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);

// Kakovost: »visoka« samo na računalniku ali močni tablici; telefon dobi »nizka« (60 sličic na sekundo pred lepoto).
// Ročna izbira: ?kakovost=nizka|visoka ali shramba evklid.3d.kakovost.
export function kakovostNaprave() {
  const q = typeof location !== "undefined" ? new URLSearchParams(location.search).get("kakovost") : null;
  const izbrana = q || shramba.get("evklid.3d.kakovost");
  if (izbrana === "nizka" || izbrana === "visoka") return izbrana;
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const dotik = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  const jedra = nav.hardwareConcurrency || 4;
  const pomnilnik = nav.deviceMemory || 8;
  const lahki = nav.connection?.saveData === true;
  if (lahki || dotik || jedra < 4 || pomnilnik < 4) return "nizka";
  return "visoka";
}

// Lepe dolžine za merilo: 1, 2, 5 × 10^k v primerni enoti, z decimalno vejico.
const ENOTE = [
  [1e3, "km"],
  [1, "m"],
  [1e-2, "cm"],
  [1e-3, "mm"],
  [1e-6, "µm"],
  [1e-9, "nm"],
  [1e-12, "pm"],
];
export function lepaDolzina(maks) {
  if (!(maks > 0)) return null;
  const p = 10 ** Math.floor(Math.log10(maks));
  const n = [5, 2, 1].map((k) => k * p).find((v) => v <= maks) || p;
  const [f, e] = ENOTE.find(([f]) => n >= f * 0.999) || ENOTE[ENOTE.length - 1];
  const v = Math.round((n / f) * 1000) / 1000;
  return { m: n, oznaka: `${String(v).replace(".", ",")} ${e}` };
}

export function ustvariSceno(el, opts = {}) {
  const kakovost = opts.kakovost || kakovostNaprave();
  const visoka = kakovost === "visoka";
  const gib = opts.gibanje ?? gibanje();
  el.classList.add("k3-oder");
  const canvas = document.createElement("canvas");
  canvas.className = "k3-platno";
  canvas.tabIndex = 0;
  if (opts.oznaka) canvas.setAttribute("aria-label", opts.oznaka);
  const plast = document.createElement("div");
  plast.className = "k3-plast";
  const tockeEl = document.createElement("div");
  tockeEl.className = "k3-tocke";
  plast.append(tockeEl);
  el.append(canvas, plast);

  // Ozadje nariše CSS (barva odra pod prosojnim platnom), ne WebGL: tako je barva točno ista z učinki (GTAO) ali
  // brez njih (prej je kompozitor barvo brisanja dvakrat pretvoril v sRGB: 0x0e131c → rgb(53,66,87)), oder ima lahko
  // mehak prelivni sij, platno pa riše samo predmete (premultiplicirana prosojnost, robovi gladki prek ozadja).
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", alpha: true, premultipliedAlpha: true, stencil: false });
  } catch (err) {
    // Brez WebGL (izklopljen v brskalniku, star gonilnik): klicatelj pokaže a3.noWebgl namesto »Preveri povezavo«.
    throw Object.assign(new Error("WebGL ni na voljo", { cause: err }), { koda: "webgl" });
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.osvetlitev ?? 0.95;
  renderer.setClearColor(0x000000, 0);
  el.style.backgroundColor = `#${new THREE.Color(opts.ozadje ?? 0x0e131c).getHexString()}`;
  renderer.localClippingEnabled = true;
  const najvecjaLocljivost = Math.min(window.devicePixelRatio || 1, visoka ? 2 : 1.5);
  let locljivost = najvecjaLocljivost;
  renderer.setPixelRatio(locljivost);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const okolje = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = okolje;
  scene.environmentIntensity = opts.okolje ?? 0.72;
  // Rahla usmerjena luč od zgoraj spredaj: oblika dobi globino tudi brez senc.
  const luc = new THREE.DirectionalLight(0xfff4e8, 0.75);
  luc.position.set(0.6, 1.4, 1.2);
  const luc2 = new THREE.DirectionalLight(0xbfd4ff, 0.3);
  luc2.position.set(-1, 0.4, -1);
  scene.add(luc, luc2);
  // Model s svojo osvetlitvijo (zgradi vrne luci: false, npr. Sonce v vesolju): brez okolja in lastnih luči kompleta.
  function nastaviLuci(vklop) {
    scene.environment = vklop ? okolje : null;
    luc.visible = luc2.visible = !!vklop;
    narisi();
  }

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.01, 200);
  camera.position.set(0, 0, 3.6);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = gib;
  controls.dampingFactor = 0.09;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 1.1;
  controls.panSpeed = 0.9;
  controls.screenSpacePanning = true;
  controls.zoomToCursor = true;
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  let dirty = true;
  const narisi = () => (dirty = true);
  controls.addEventListener("change", narisi);

  // Učinki samo pri visoki kakovosti (zaostrovanje okluzije v pregibih), naložijo se po potrebi. Vrstni red:
  // 1) neprosojni predmeti v ciljno sliko, 2) GTAO iz njihove globine in normal, 3) okluzija se zmnoži v isto sliko,
  // 4) prosojni, aditivni, črte, točke in napisi (sprite) se narišejo šele po okluziji (globina iz koraka 1 ostane),
  // zato jih GTAO ne potemni in ne mečejo lažnih senc, 5) preslikava tonov in sRGB (OutputPass) na nepremultiplicirani
  // barvi. Prozorno ozadje (alfa 0) ostane prozorno: oder pod platnom pokaže pravo barvo.
  let composer = null;
  let gtao = null;
  let aoVkljucen = false;
  const prosojen = (o) => {
    if (o.isSprite || o.isPoints || o.isLine) return true;
    const m = o.material;
    if (!m) return false;
    // Dvostranske ploskve (trakovi beljakovine, opne) nimajo prostornine za okluzijo: rišejo se po GTAO, nepotemnjene.
    const p = (x) => x.transparent || x.blending !== THREE.NormalBlending || x.side === THREE.DoubleSide;
    return Array.isArray(m) ? m.some(p) : p(m);
  };
  const prosojni = [];
  const neprosojni = [];
  function razvrsti() {
    prosojni.length = 0;
    neprosojni.length = 0;
    scene.traverseVisible((o) => {
      if (o.isMesh || o.isSprite || o.isPoints || o.isLine) (prosojen(o) ? prosojni : neprosojni).push(o);
    });
  }
  const vidni = (seznam, v) => {
    for (const o of seznam) o.visible = v;
  };
  async function pripraviAO(polmer = 0.25, { moc = 0.85 } = {}) {
    if (!visoka || composer) return;
    try {
      const [{ EffectComposer }, { RenderPass }, { GTAOPass }, { OutputPass }, { Pass, FullScreenQuad }, { OutputShader }] = await Promise.all([
        import("/vendor/three/examples/jsm/postprocessing/EffectComposer.js"),
        import("/vendor/three/examples/jsm/postprocessing/RenderPass.js"),
        import("/vendor/three/examples/jsm/postprocessing/GTAOPass.js"),
        import("/vendor/three/examples/jsm/postprocessing/OutputPass.js"),
        import("/vendor/three/examples/jsm/postprocessing/Pass.js"),
        import("/vendor/three/examples/jsm/shaders/OutputShader.js"),
      ]);
      if (unicen) return;
      class NeprosojniPass extends RenderPass {
        render(r, writeBuffer, readBuffer, dt, mask) {
          razvrsti();
          vidni(prosojni, false);
          r.setClearColor(0x000000, 0);
          super.render(r, writeBuffer, readBuffer, dt, mask);
          vidni(prosojni, true);
        }
      }
      class OkluzijaPass extends GTAOPass {
        render(r, writeBuffer, readBuffer) {
          vidni(prosojni, false);
          super.render(r, writeBuffer, readBuffer);
          vidni(prosojni, true);
        }
      }
      class ProsojniPass extends Pass {
        constructor() {
          super();
          this.needsSwap = false;
          this.kvad = new FullScreenQuad(gtao.blendMaterial);
        }
        render(r, _writeBuffer, readBuffer) {
          const ac = r.autoClear;
          r.autoClear = false;
          r.setRenderTarget(readBuffer);
          gtao.blendMaterial.uniforms.intensity.value = gtao.blendIntensity;
          gtao.blendMaterial.uniforms.tDiffuse.value = gtao.pdRenderTarget.texture;
          this.kvad.render(r);
          if (prosojni.length) {
            vidni(neprosojni, false);
            r.render(scene, camera);
            vidni(neprosojni, true);
          }
          r.autoClear = ac;
        }
        dispose() {
          this.kvad.dispose();
        }
      }
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
      composer = new EffectComposer(renderer, rt);
      composer.addPass(new NeprosojniPass(scene, camera));
      gtao = new OkluzijaPass(scene, camera, 1, 1);
      gtao.output = GTAOPass.OUTPUT.Off;
      gtao.needsSwap = false;
      gtao.updateGtaoMaterial({ radius: polmer, distanceExponent: 1.4, thickness: 1.2, scale: 1, samples: 12 });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
      gtao.blendIntensity = moc;
      composer.addPass(gtao);
      composer.addPass(new ProsojniPass());
      const izhod = new OutputPass();
      // Preslikava tonov na nepremultiplicirani barvi (robovi in prosojni predmeti nad prozornim ozadjem), nato spet premultiplicirano.
      const vir = "gl_FragColor = texture2D( tDiffuse, vUv );";
      if (OutputShader.fragmentShader.includes(vir)) {
        izhod.material.fragmentShader = OutputShader.fragmentShader
          .replace(vir, `${vir}\n float evkA = clamp( gl_FragColor.a, 0.0, 1.0 );\n gl_FragColor.rgb /= max( evkA, 1e-3 );`)
          .replace(/\}\s*$/, " gl_FragColor = vec4( gl_FragColor.rgb * evkA, evkA );\n}");
      }
      composer.addPass(izhod);
      velikost();
      aoVkljucen = true;
      narisi();
    } catch (err) {
      console.warn("3D: okluzija ni na voljo", err);
      composer = null;
    }
  }
  const nastaviAO = (on) => {
    const prej = aoVkljucen;
    aoVkljucen = !!(on && composer);
    if (prej !== aoVkljucen) narisi();
  };

  let w = 1;
  let h = 1;
  function velikost() {
    const r = el.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    composer?.setPixelRatio(locljivost);
    composer?.setSize(w, h);
    narisi();
  }
  const ro = new ResizeObserver(velikost);
  ro.observe(el);
  velikost();

  // Prelet kamere: cilj in položaj se mehko premakneta (ease in-out); pri manj gibanja takoj.
  let let_ = null;
  // Razdalja, pri kateri krogla s polmerom `polmer` cela pade v ožji od obeh zornih kotov (pokončen telefon: vodoravni).
  const fitRazdalja = (polmer) => {
    const navp = THREE.MathUtils.degToRad(camera.fov / 2);
    const vodo = Math.atan(Math.tan(navp) * camera.aspect);
    return (polmer / Math.sin(Math.min(navp, vodo))) * 1.08;
  };
  function poleti(sredisce, polmer, { smer = null, trajanje = 0.85, razdalja = null } = {}) {
    const cilj = new THREE.Vector3().copy(sredisce);
    const s = (smer ? new THREE.Vector3().copy(smer) : camera.position.clone().sub(controls.target)).normalize();
    const d = razdalja ?? fitRazdalja(polmer);
    const poz = cilj.clone().addScaledVector(s, d);
    if (!gib || trajanje <= 0) {
      controls.target.copy(cilj);
      camera.position.copy(poz);
      let_ = null;
      controls.update();
      narisi();
      return;
    }
    let_ = { t: 0, trajanje, odC: controls.target.clone(), doC: cilj, odP: camera.position.clone(), doP: poz };
    narisi();
  }
  function korakLeta(dt) {
    if (!let_) return false;
    let_.t = Math.min(1, let_.t + dt / let_.trajanje);
    const x = let_.t;
    const e = x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
    controls.target.lerpVectors(let_.odC, let_.doC, e);
    // Položaj: po krogli okoli cilja, da kamera ne zareže skozi telo.
    const a = let_.odP.clone().sub(let_.odC);
    const b = let_.doP.clone().sub(let_.doC);
    const la = a.length();
    const lb = b.length();
    const smer = a.normalize().lerp(b.normalize(), e).normalize();
    camera.position.copy(controls.target).addScaledVector(smer, la + (lb - la) * e);
    if (let_.t >= 1) let_ = null;
    return true;
  }
  const obrni = (az, pol) => {
    controls.rotateLeft(az);
    controls.rotateUp(pol);
    controls.update();
    narisi();
  };
  const priblizaj = (k) => {
    if (k > 1) controls.dollyIn(k);
    else controls.dollyOut(1 / k);
    controls.update();
    narisi();
  };
  // Tipkovnica na platnu: puščice vrtijo, + in − približata, Home ponastavi pogled (opts.ponastavi).
  canvas.addEventListener("keydown", (e) => {
    const k = e.key;
    const s = Math.PI / 18;
    if (k === "ArrowLeft") obrni(s, 0);
    else if (k === "ArrowRight") obrni(-s, 0);
    else if (k === "ArrowUp") obrni(0, s);
    else if (k === "ArrowDown") obrni(0, -s);
    else if (k === "+" || k === "=") priblizaj(1.2);
    else if (k === "-" || k === "_") priblizaj(1 / 1.2);
    else if (k === "Home" && opts.ponastavi) opts.ponastavi();
    else return;
    e.preventDefault();
  });

  // Tap (kratek dotik brez vlečenja) za izbiro; vlečenje vrti.
  const tapi = new Set();
  let dol = null;
  canvas.addEventListener("pointerdown", (e) => {
    dol = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, vec: false };
    let_ = null; // dotik prekine prelet
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dol && e.pointerId !== dol.id) dol.vec = true; // drugi prst: povečava, ne tap
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!dol || e.pointerId !== dol.id) return;
    const d = Math.hypot(e.clientX - dol.x, e.clientY - dol.y);
    const ok = !dol.vec && d < 7 && performance.now() - dol.t < 600;
    dol = null;
    if (!ok) return;
    const r = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    for (const f of tapi) f(ndc, e);
  });
  const naTap = (f) => (tapi.add(f), () => tapi.delete(f));

  const raycaster = new THREE.Raycaster();
  raycaster.camera = camera; // zakritje točk (raycaster.set brez kamere): Sprite.raycast potrebuje kamero
  // Točke (oblak elektronov, pike orbital) zadene samo tap blizu točke: privzeti prag 1 je pri modelu s polmerom 1 cel model.
  raycaster.params.Points.threshold = 0.02;
  function zadetki(ndc, objekti, filter = null) {
    raycaster.setFromCamera(ndc, camera);
    // Najbližji zadetek prvi (mreže lahko imajo svoj raycast, ki doda zadetke v poljubnem vrstnem redu).
    const vsi = raycaster.intersectObjects(objekti, true).sort((a, b) => a.distance - b.distance);
    return filter ? vsi.filter(filter) : vsi;
  }

  // Barvne točke: gumbi v plasti nad platnom; ostanejo pripete na točko v prostoru.
  let tocke = [];
  let zakrivala = () => [];
  let tockaOb = null;
  let stevecZakritja = 0;
  function nastaviTocke(seznam, { ob = null, zakriva = null } = {}) {
    tockeEl.replaceChildren();
    tockaOb = ob;
    if (zakriva) zakrivala = zakriva;
    tocke = seznam.map((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "k3-tocka";
      b.style.setProperty("--barva", t.barva || "#6E9BFF");
      b.setAttribute("aria-label", t.ime || t.id);
      b.title = t.ime || "";
      b.tabIndex = -1; // s tipkovnico gre izbira prek seznama delov
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        tockaOb?.(t.id);
      });
      tockeEl.append(b);
      return { ...t, el: b, zakrita: false, v: new THREE.Vector3() };
    });
    stevecZakritja = 0;
    narisi();
  }
  const izbranaTocka = (id) => {
    for (const t of tocke) t.el.classList.toggle("on", t.id === id);
  };
  const _p = new THREE.Vector3();
  const _smer = new THREE.Vector3();
  function postaviTocke() {
    if (!tocke.length && !oznaka) return;
    const preveri = ++stevecZakritja % 6 === 0;
    const ovire = preveri ? zakrivala() : null;
    for (const t of tocke) {
      const svet = typeof t.pos === "function" ? t.pos(t.v) : t.v.copy(t.pos);
      _p.copy(svet).project(camera);
      const zadaj = _p.z > 1 || _p.z < -1;
      const x = (_p.x * 0.5 + 0.5) * w;
      const y = (-_p.y * 0.5 + 0.5) * h;
      if (preveri && ovire?.length && !zadaj) {
        _smer.copy(svet).sub(camera.position);
        const d = _smer.length();
        raycaster.set(camera.position, _smer.normalize());
        raycaster.far = d;
        const hit = raycaster.intersectObjects(ovire, true)[0];
        raycaster.far = Infinity;
        t.zakrita = !!hit && hit.distance < d - Math.max(0.02, d * 0.015);
      }
      t.x = x;
      t.y = y;
      t.vidna = !(zadaj || x < -20 || y < -20 || x > w + 20 || y > h + 20);
      t.el.classList.toggle("skrita", !t.vidna);
      t.el.classList.toggle("zakrita", !zadaj && t.zakrita);
    }
    razmakniTocke();
    if (oznaka) {
      const t = tocke.find((x) => x.id === oznaka.id);
      const pos = t ? t.v : oznaka.pos;
      _p.copy(pos).project(camera);
      const x = (_p.x * 0.5 + 0.5) * w;
      const y = (-_p.y * 0.5 + 0.5) * h;
      const vidna = _p.z <= 1 && !(t && t.zakrita);
      const desno = x < w * 0.6;
      oznaka.el.classList.toggle("levo", !desno);
      oznaka.el.style.transform = `translate(${desno ? x + 16 : x - 16}px, ${y}px)`;
      oznaka.el.classList.toggle("skrita", !vidna);
    }
  }
  // Točke, ki se prekrivajo, razmaknemo navpično (od zgoraj navzdol, največ 36 px od prave lege).
  const RAZMIK = 26;
  function razmakniTocke() {
    const vidne = tocke.filter((t) => t.vidna && !t.zakrita).sort((a, b) => a.y - b.y);
    const postavljene = [];
    for (const t of vidne) {
      let y = t.y;
      for (let i = 0; i < 4; i++) {
        const trk = postavljene.find((p) => Math.abs(p.x - t.x) < RAZMIK && Math.abs(p.yy - y) < RAZMIK);
        if (!trk) break;
        y = trk.yy + RAZMIK;
      }
      t.yy = Math.min(y, t.y + 36);
      postavljene.push(t);
    }
    for (const t of tocke) {
      const y = t.vidna && !t.zakrita ? t.yy : t.y;
      t.el.style.transform = `translate(${t.x}px, ${y}px)`;
      t.el.classList.toggle("razmaknjena", y - t.y > 1);
    }
  }
  if (opts.preveriZakritje === false) zakrivala = () => [];

  // Oznaka ob točki (ime in kratek opis), sledi točki ob vrtenju.
  let oznaka = null;
  function pokaziOznako(id, naslov, opis, pos = null) {
    oznaka?.el.remove();
    oznaka = null;
    if (!naslov) return narisi();
    const d = document.createElement("div");
    d.className = "k3-oznaka";
    d.setAttribute("role", "status");
    const b = document.createElement("b");
    b.textContent = naslov;
    d.append(b);
    if (opis) {
      const s = document.createElement("span");
      s.textContent = opis;
      d.append(s);
    }
    plast.append(d);
    oznaka = { id, el: d, pos: pos ? new THREE.Vector3().copy(pos) : new THREE.Vector3() };
    narisi();
  }

  // Merilo: črta prave dolžine na globini cilja; merilo.m je prava velikost dolžine `enota` v svetu.
  let merilo = null;
  let meriloEl = null;
  function nastaviMerilo(m, enota = 2) {
    merilo = m && m.m > 0 ? { m: m.m, enota } : null;
    if (!merilo) {
      meriloEl?.remove();
      meriloEl = null;
      return;
    }
    if (!meriloEl) {
      meriloEl = document.createElement("div");
      meriloEl.className = "k3-merilo";
      meriloEl.innerHTML = '<span class="k3-merilo-crta"></span><span class="k3-merilo-napis"></span>';
      plast.append(meriloEl);
    }
    narisi();
  }
  function posodobiMerilo() {
    if (!merilo || !meriloEl) return;
    const d = camera.position.distanceTo(controls.target);
    const pxNaEnoto = h / 2 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d);
    const mNaEnoto = merilo.m / merilo.enota;
    const maksPx = Math.min(140, w * 0.3);
    const l = lepaDolzina((maksPx / pxNaEnoto) * mNaEnoto);
    if (!l) return;
    const px = (l.m / mNaEnoto) * pxNaEnoto;
    meriloEl.firstChild.style.width = `${px.toFixed(1)}px`;
    meriloEl.lastChild.textContent = l.oznaka;
  }

  // Zanka: riše samo ob spremembi (baterija), stalno samo med animacijo ali preletom.
  const koraki = new Set();
  let stalno = 0;
  let unicen = false;
  let zadnji = performance.now();
  let raf = 0;
  const casi = [];
  let prejRisal = false;
  let stevec = 0;
  function zanka(now) {
    raf = requestAnimationFrame(zanka);
    const dt = Math.min(0.1, (now - zadnji) / 1000);
    zadnji = now;
    if (++stevec % 60 === 0 && !el.isConnected) return unici();
    let risi = dirty;
    if (korakLeta(dt)) risi = true;
    if (controls.update(dt)) risi = true;
    for (const f of koraki) if (f(dt, now / 1000) !== false) risi = true;
    if (stalno > 0) risi = true;
    if (!risi) {
      prejRisal = false;
      return;
    }
    dirty = false;
    if (aoVkljucen && composer) composer.render(dt);
    else renderer.render(scene, camera);
    postaviTocke();
    posodobiMerilo();
    // Samodejna kakovost: ob počasnem risanju najprej brez okluzije, nato nižja ločljivost.
    if (prejRisal) {
      casi.push(dt);
      if (casi.length >= 40) {
        const avg = casi.reduce((a, b) => a + b, 0) / casi.length;
        casi.length = 0;
        if (avg > 0.026) {
          if (aoVkljucen) {
            aoVkljucen = false;
            composer = null;
          } else if (locljivost > 1) {
            locljivost = Math.max(1, locljivost - 0.25);
            renderer.setPixelRatio(locljivost);
            velikost();
          }
        }
      }
    }
    prejRisal = true;
  }
  raf = requestAnimationFrame(zanka);
  // Med preletom ali animacijo tudi vrstica s točkami teče gladko.
  const naKorak = (f) => (koraki.add(f), () => koraki.delete(f));
  const stalnoRisi = (on) => {
    stalno = Math.max(0, stalno + (on ? 1 : -1));
    narisi();
  };

  function unici() {
    if (unicen) return;
    unicen = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    controls.dispose();
    okolje.dispose();
    pmrem.dispose();
    composer?.dispose?.();
    renderer.dispose();
    renderer.forceContextLoss?.();
    canvas.remove();
    plast.remove();
    opts.obUnicenju?.();
  }

  return {
    THREE,
    nastaviLuci,
    luci: [luc, luc2], // ključna in zadnja luč kompleta (atlas jima prilagodi smer in moč)
    kakovost,
    gibanje: gib,
    renderer,
    scene,
    camera,
    controls,
    canvas,
    plast,
    narisi,
    poleti,
    fitRazdalja,
    obrni,
    priblizaj,
    naTap,
    zadetki,
    raycaster,
    nastaviTocke,
    izbranaTocka,
    pokaziOznako,
    nastaviMerilo,
    pripraviAO,
    nastaviAO,
    naKorak,
    stalnoRisi,
    get aoVkljucen() {
      return aoVkljucen;
    },
    get unicen() {
      return unicen;
    },
    get velikost() {
      return { w, h };
    },
    unici,
  };
}
