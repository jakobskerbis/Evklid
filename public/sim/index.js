// Seznam simulacij: id → [datoteka, ime izvožene funkcije].
// Datoteke se naložijo šele, ko jih učenec potrebuje (dinamični import).
// Ta datoteka nima kode za brskalnik na najvišji ravni, zato jo uvozi tudi strežnik.

export const ENGINES = {
  // starejše demonstracije (public/demos.js)
  linearna: ["../demos.js", "linearna"],
  pitagora: ["../demos.js", "pitagora"],
  ulomki: ["../demos.js", "ulomki"],
  ohm: ["../demos.js", "ohm"],
  "prosti-pad": ["fiz-meh.js", "prostiPad"],
  nihalo: ["../demos.js", "nihalo"],
  plini: ["../demos.js", "plini"],
  enacbe: ["../demos.js", "enacbe"],
  ph: ["../demos.js", "ph"],
  // matematika: števila
  mestna: ["mat-stevila.js", "mestna"],
  stotica: ["mat-stevila.js", "stotica"],
  delitelji: ["mat-stevila.js", "delitelji"],
  razcep: ["mat-stevila.js", "razcep"],
  dvvenn: ["mat-stevila.js", "dvvenn"],
  evklid: ["mat-stevila.js", "evklid"],
  skoki: ["mat-stevila.js", "skoki"],
  decimalke: ["mat-stevila.js", "decimalke"],
  periode: ["mat-stevila.js", "periode"],
  "ulomki-primerjava": ["mat-stevila.js", "ulomkiPrimerjava"],
  "ulomki-racun": ["mat-stevila.js", "ulomkiRacun"],
  "ulomki-mnozenje": ["mat-stevila.js", "ulomkiMnozenje"],
  trak: ["mat-stevila.js", "trak"],
  razmerje: ["mat-stevila.js", "razmerje"],
  sorazmerje: ["mat-stevila.js", "sorazmerje"],
  odstotki: ["mat-stevila.js", "odstotki"],
  potence: ["mat-stevila.js", "potence"],
  znanstveni: ["mat-stevila.js", "znanstveni"],
  koren: ["mat-stevila.js", "koren"],
  realna: ["mat-stevila.js", "realna"],
  venn: ["mat-stevila.js", "venn"],
  enote: ["mat-stevila.js", "enote"],
  // matematika: algebra
  tehtnica: ["mat-algebra.js", "tehtnica"],
  neenacba: ["mat-algebra.js", "neenacba"],
  ploscice: ["mat-algebra.js", "ploscice"],
  povrsinski: ["mat-algebra.js", "povrsinski"],
  sistem: ["mat-algebra.js", "sistem"],
  // matematika: ravninska geometrija
  premice: ["mat-geo.js", "premice"],
  kot: ["mat-geo.js", "kot"],
  "pari-kotov": ["mat-geo.js", "pariKotov"],
  krog: ["mat-geo.js", "krog"],
  konstrukcija: ["mat-geo.js", "konstrukcija"],
  simetrija: ["mat-geo.js", "simetrija"],
  pravokotnik: ["mat-geo.js", "pravokotnik"],
  trikotnik: ["mat-geo.js", "trikotnik"],
  ploscine: ["mat-geo.js", "ploscine"],
  stirikotnik: ["mat-geo.js", "stirikotnik"],
  "krog-ploscina": ["mat-geo.js", "krogPloscina"],
  izsek: ["mat-geo.js", "izsek"],
  veckotnik: ["mat-geo.js", "veckotnik"],
  koordinate: ["mat-geo.js", "koordinate"],
  "dve-tocki": ["mat-geo.js", "dveTocki"],
  podobnost: ["mat-geo.js", "podobnost"],
  tales: ["mat-geo.js", "tales"],
  "pitagora-uporaba": ["mat-geo.js", "pitagoraUporaba"],
  // matematika: statistika in verjetnost
  diagram: ["mat-stat.js", "diagram"],
  sredina: ["mat-stat.js", "sredina"],
  statistika: ["mat-stat.js", "statistika"],
  verjetnost: ["mat-stat.js", "verjetnost"],
  kombinatorika: ["mat-stat.js", "kombinatorika"],
  // matematika: geometrijska telesa
  telesa: ["mat-telesa.js", "telesa"],
  // matematika: funkcije in analiza
  graf: ["mat-funkcije.js", "graf"],
  odvod: ["mat-funkcije.js", "odvod"],
  integral: ["mat-funkcije.js", "integral"],
  zaporedje: ["mat-funkcije.js", "zaporedje"],
  vrsta: ["mat-funkcije.js", "vrsta"],
  obresti: ["mat-funkcije.js", "obresti"],
  kompleksna: ["mat-funkcije.js", "kompleksna"],
  srecanje: ["mat-funkcije.js", "srecanje"],
  // matematika: trigonometrija, vektorji, stožnice, obodni kot
  "trig-trikotnik": ["mat-trig.js", "trigTrikotnik"],
  enotska: ["mat-trig.js", "enotska"],
  vektorji: ["mat-trig.js", "vektorji"],
  stozernice: ["mat-trig.js", "stozernice"],
  obodni: ["mat-trig.js", "obodni"],
  // fizika: merjenje, sile, gostota, tlak, gibanje
  meritve: ["fiz-meh.js", "meritve"],
  vzmet: ["fiz-meh.js", "vzmet"],
  teza: ["fiz-meh.js", "teza"],
  sile: ["fiz-meh.js", "sile"],
  klada: ["fiz-meh.js", "klada"],
  gostota: ["fiz-meh.js", "gostota"],
  tlak: ["fiz-meh.js", "tlak"],
  gibanje: ["fiz-meh.js", "gibanje"],
  // fizika: delo, energija, met, klanec, trki, kroženje, orbite
  delo: ["fiz-energija.js", "delo"],
  skejt: ["fiz-energija.js", "skejt"],
  izkoristek: ["fiz-energija.js", "izkoristek"],
  met: ["fiz-energija.js", "met"],
  klanec: ["fiz-energija.js", "klanec"],
  trki: ["fiz-energija.js", "trki"],
  krozenje: ["fiz-energija.js", "krozenje"],
  orbita: ["fiz-energija.js", "orbita"],
  // fizika: toplota
  delci: ["fiz-toplota.js", "delci"],
  mesanje: ["fiz-toplota.js", "mesanje"],
  prenos: ["fiz-toplota.js", "prenos"],
  raztezanje: ["fiz-toplota.js", "raztezanje"],
  pv: ["fiz-toplota.js", "pv"],
  // fizika: elektrika in magnetizem
  naboji: ["fiz-elektro.js", "naboji"],
  "krog-el": ["fiz-elektro.js", "krogEl"],
  poraba: ["fiz-elektro.js", "poraba"],
  magnet: ["fiz-elektro.js", "magnet"],
  lorentz: ["fiz-elektro.js", "lorentz"],
  indukcija: ["fiz-elektro.js", "indukcija"],
  // fizika: optika, valovanje, moderna fizika
  senca: ["fiz-valovi.js", "senca"], zarki: ["fiz-valovi.js", "zarki"], osoncje: ["fiz-valovi.js", "osoncje"],
  val: ["fiz-valovi.js", "val"], lece: ["fiz-valovi.js", "lece"], interferenca: ["fiz-valovi.js", "interferenca"],
  fotoefekt: ["fiz-valovi.js", "fotoefekt"], spektri: ["fiz-valovi.js", "spektri"], razpad: ["fiz-valovi.js", "razpad"],
  // kemija: snovi, atom, periodni sistem, vezi
  razvrsti: ["kem-snov.js", "razvrsti"], atom: ["kem-snov.js", "atom"], periodni: ["kem-snov.js", "periodni"], vezi: ["kem-snov.js", "vezi"],
  formule: ["kem-snov.js", "formule"], medmolekulske: ["kem-snov.js", "medmolekulske"], oksidacijska: ["kem-snov.js", "oksidacijska"],
  // kemija: reakcije
  "energija-reakcije": ["kem-reakcije.js", "energijaReakcije"], reaktivnost: ["kem-reakcije.js", "reaktivnost"], titracija: ["kem-reakcije.js", "titracija"],
  hitrost: ["kem-reakcije.js", "hitrost"], ravnotezje: ["kem-reakcije.js", "ravnotezje"], disociacija: ["kem-reakcije.js", "disociacija"], galvanski: ["kem-reakcije.js", "galvanski"],
  // naravoslovje (OŠ 6. in 7. razred)
  uvrsti: ["nar.js", "uvrsti"],
  // biologija
  krizanje: ["bio.js", "krizanje"],
  hw: ["bio.js", "hw"],
  piramida: ["bio.js", "piramida"],
  populacija: ["bio.js", "populacija"],
  encim: ["bio.js", "encim"],
  osmoza: ["bio.js", "osmoza"],
  dna: ["bio.js", "dna"],
  // kemija: računanje, organska kemija
  mol: ["kem-racun.js", "mol"], stehiometrija: ["kem-racun.js", "stehiometrija"], raztopina: ["kem-racun.js", "raztopina"],
  organska: ["kem-organska.js", "organska"], destilacija: ["kem-organska.js", "destilacija"], polimer: ["kem-organska.js", "polimer"], "organske-reakcije": ["kem-organska.js", "organskeReakcije"],
  // tekmovanja: matematika
  vitezi: ["mat-tek.js", "vitezi"], predalcki: ["mat-tek.js", "predalcki"], invarianta: ["mat-tek.js", "invarianta"], nim: ["mat-tek.js", "nim"],
  ostanki: ["mat-tek.js", "ostanki"], poti: ["mat-tek.js", "poti"], diofant: ["mat-tek.js", "diofant"], ura: ["mat-tek.js", "ura"],
  sredine: ["mat-tek.js", "sredine"], urejanje: ["mat-tek.js", "urejanje"], vieta: ["mat-tek.js", "vieta"], funkcijska: ["mat-tek.js", "funkcijska"],
  hanoi: ["mat-tek.js", "hanoi"], grafi: ["mat-tek.js", "grafi"], potenca: ["mat-tek.js", "potenca"], ceva: ["mat-tek.js", "ceva"],
  najkrajsa: ["mat-tek.js", "najkrajsa"], legendre: ["mat-tek.js", "legendre"],
  // tekmovanja: fizika in kemija
  vzvod: ["fiz-tek.js", "vzvod"], stojece: ["fiz-tek.js", "stojece"], kirchhoff: ["fiz-tek.js", "kirchhoff"], dimenzije: ["fiz-tek.js", "dimenzije"],
  hess: ["kem-tek.js", "hess"], pufer: ["kem-tek.js", "pufer"], vsepr: ["kem-tek.js", "vsepr"],
  // virtualni laboratorij (modeli v lab-model.js, testi v test/laboratorij.test.js, opis v docs/laboratorij.md)
  "lab-ohm": ["lab-fiz.js", "labOhm"],
  "lab-co2": ["lab-kem.js", "labCo2"],
  "lab-titracija": ["lab-titracija.js", "labTitracija"],
  "lab-vezava": ["lab-elektrika.js", "labVezava"],
  "lab-prevodnost": ["lab-elektrika.js", "labPrevodnost"],
  "lab-grelnik": ["lab-toplota.js", "labGrelnik"],
  "lab-mesanje": ["lab-toplota.js", "labMesanje"],
  "lab-faze": ["lab-toplota.js", "labFaze"],
  "lab-ohlajanje": ["lab-toplota.js", "labOhlajanje"],
  "lab-lom": ["lab-optika.js", "labLom"],
  "lab-leca": ["lab-optika.js", "labLeca"],
  "lab-hooke": ["lab-sile.js", "labHooke"],
  "lab-gostota": ["lab-sile.js", "labGostota"],
  "lab-vzgon": ["lab-sile.js", "labVzgon"],
  "lab-tlak": ["lab-sile.js", "labTlak"],
  "lab-ph": ["lab-indikatorji.js", "labPh"],
  "lab-dokaz": ["lab-indikatorji.js", "labDokaz"],
  "lab-slina": ["lab-indikatorji.js", "labSlina"],
  "lab-elektroliza": ["lab-elektrokemija.js", "labElektroliza"],
  "lab-galvanski": ["lab-elektrokemija.js", "labGalvanski"],
  "lab-kovine": ["lab-elektrokemija.js", "labKovine"],
  // teme, dodane po primerjavi z učnimi načrti (2026-10-30)
  logika: ["vrzeli.js", "logika"], prostor: ["vrzeli.js", "prostor"], "koord-trikotnik": ["vrzeli.js", "koordTrikotnik"],
  "vezava-vzmeti": ["vrzeli.js", "vezavaVzmeti"], izmenicni: ["vrzeli.js", "izmenicni"], "em-spekter": ["vrzeli.js", "emSpekter"], zvezde: ["vrzeli.js", "zvezde"], domine: ["vrzeli.js", "domine"],
  // zbirka več simulacij (za mešane maturitetne naloge)
  zbirka: ["index.js", "zbirka"],
  // 3D modeli iz kode (docs/3d.md): id »3d-<id modela>«, npr. "3d-celica-zivalska"; pogon naloži prizor šele ob prikazu
  "3d": ["../3d/sim.js", "sim3d"],
};

// »3d-<id>« je pogon "3d" z izbranim modelom (seznam modelov je po področjih v public/3d/modeli/<podrocje>/index.js).
const TRI_D = /^3d-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
export const hasEngine = (id) => Object.hasOwn(ENGINES, id) || TRI_D.test(id);

// Nariše simulacijo v el. Vrne true, če je uspelo.
export async function mountSim(id, el, opts = {}) {
  const m3 = TRI_D.exec(id);
  if (m3) opts = { ...(opts || {}), model: m3[1], noReset: true }; // pregledovalnik ima svoj »Ponastavi«
  const e = ENGINES[m3 ? "3d" : id];
  if (!e) return false;
  const mod = await import(new URL(e[0], import.meta.url).href);
  const fn = mod[e[1]] || mod.DEMOS?.[e[1]];
  if (typeof fn !== "function") return false;
  el.replaceChildren();
  el.classList.add("demo", `demo-${id}`);
  try {
    fn(el, opts || {});
    focusableTargets(el);
    // Ponastavi: simulacijo postavi znova v začetno stanje (ne pri zbirki, ki ima svoje podsimulacije).
    if (id !== "zbirka" && !opts?.noReset) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ghost small demo-reset";
      b.textContent = "↺ Ponastavi";
      b.setAttribute("aria-label", "Ponastavi simulacijo na začetek");
      b.addEventListener("click", () => mountSim(id, el, opts));
      el.append(b);
    }
    // Prikaz na grafu: gumbi za vklop in izklop krivulj, točk, oznak in mreže (public/sim/prikaz.js).
    if (id !== "zbirka" && !m3 && id !== "3d")
      Promise.all([import("./prikaz.js"), import("../i18n.js")])
        .then(([m, i18n]) => m.layerToggles(el, i18n.t))
        .catch((err) => console.error("Prikaz na grafu:", err));
  } catch (err) {
    console.error(`Simulacija ${id}:`, err);
    el.replaceChildren();
    el.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "Simulacije ni bilo mogoče naložiti." }));
    return false;
  }
  return true;
}

// Elementi, ki se jih da klikniti ali vleči (.drag), so dosegljivi s tipko Tab; Enter ali preslednica
// jih klikne (vlečenje s puščicami doda kit.draggable). Simulacije pogosto rišejo znova, zato opazujemo spremembe.
function focusableTargets(el) {
  const mark = () =>
    el.querySelectorAll(".drag:not([tabindex])").forEach((t) => {
      t.setAttribute("tabindex", "0");
      if (!t.getAttribute("role")) t.setAttribute("role", "button");
      if (!t.getAttribute("aria-label")) t.setAttribute("aria-label", (t.textContent || "").trim() || "Izberi");
    });
  mark();
  if (el.dataset.kbd) return;
  el.dataset.kbd = "1";
  new MutationObserver(mark).observe(el, { childList: true, subtree: true });
  el.addEventListener("keydown", (ev) => {
    const t = ev.target.closest?.(".drag");
    if (!t || (ev.key !== "Enter" && ev.key !== " ")) return;
    ev.preventDefault();
    t.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

// Zbirka: izbirni seznam več simulacij, npr. za ponavljanje pred maturo.
// items: [[id, naslov, opts?], …]; prikažemo le tiste, ki obstajajo.
export function zbirka(el, { items = [] } = {}) {
  const list = items.map((it) => (Array.isArray(it) ? { id: it[0], title: it[1], opts: it[2] || {} } : it)).filter((d) => d && hasEngine(d.id) && d.id !== "zbirka");
  if (!list.length) return;
  const mk = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text != null ? { textContent: text } : {});
  const sel = mk("select");
  sel.setAttribute("aria-label", "Izberi simulacijo");
  list.forEach((d, i) => sel.append(Object.assign(mk("option", "", d.title), { value: String(i) })));
  const lab = mk("label", "demo-slider demo-pick");
  lab.append(mk("span", "demo-slider-label", "simulacija"), sel);
  const box = mk("div", "demo-sub");
  const show = () => {
    const inner = mk("div");
    box.replaceChildren(inner);
    const d = list[Number(sel.value)];
    mountSim(d.id, inner, d.opts);
  };
  sel.addEventListener("change", show);
  el.append(lab, box);
  show();
}

