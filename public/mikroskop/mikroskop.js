// Virtualni mikroskop (docs/mikroskop.md): svetlobni mikroskop s štirimi objektivi (4×, 10×, 40×, 100× z oljem), grobim
// in finim vijakom, lučko in zaslonko, nad 1000× presevni elektronski mikroskop (TEM) do 50 000 000× (j, 12. 11. 2026),
// pri največjih povečavah model molekul in atomov. Odpre ga stran /3d (#mikroskop?p=<id>, gumb »Poglej z mikroskopom«
// pri tkivih 3D sveta) in laboratorij (pogon simulacij »lab-mikroskop«). Besedila vsebine so slovenska kot pri 3D modelih.
import { MOL, ELEMENTI, ZNACILNO, ZNACILNA_TOCKA, elementiMolekule } from "./molekule-vrste.js";
import { ustvariUpodobitev } from "./upodobi.js";
import { izracunajPogled, ZACETNO, povecava, najblizjaMolekula, fino } from "./pogled.js";
import { svetlost, OBJEKTIVI, OKULAR, MIN_M, SVETLOBNI_MAX, MAX_M, SEM_MAX, vidnoPolje, locljivost, globinskaOstrina, globinskaOstrinaSem, merilce, oznakaDolzine, oznakaPovecave, utezModela, raven } from "./optika.js";
import { BARVANJA } from "./barvila.js";
import { PREPARATI, SKUPINE, ZACETNI, naloziPreparat } from "./preparati/index.js";
import { t } from "/i18n.js";
import { icon as ikona } from "/icons.js";

const CSS = ["/3d/3d.css", "/mikroskop/mikroskop.css"];

const SNOVI = {
  0: "prazen prostor (stekelce)", 1: "citoplazma", 2: "jedro", 3: "kolagenska vlakna", 4: "mineral (hidroksiapatit)", 5: "eritrocit",
  6: "maščoba", 7: "miofibrile", 8: "mielinska ovojnica", 9: "zunajcelični matriks", 10: "keratin", 11: "celična stena",
  12: "vakuola", 13: "koloid", 14: "krvna plazma", 15: "elastična vlakna", 16: "sluz", 17: "virus", 18: "sklenina",
  20: "mitohondrij", 21: "zrnati endoplazemski retikulum", 22: "ribosomi", 23: "glikogen", 24: "membrana (fosfolipidni dvosloj)",
  25: "kloroplast", 26: "zrnce (mešiček)", 27: "kromosomi", 28: "jedrce", 29: "Golgijev aparat", 30: "mikrovili",
  31: "dedni zapis virusa (DNK ali RNK)", 32: "gladki endoplazemski retikulum",
};
const CELICE = {
  0: "celica", 1: "jetrna celica (hepatocit)", 2: "fibroblast", 3: "limfocit", 4: "nevron", 5: "žlezna celica", 6: "rastlinska celica",
  7: "bakterija", 8: "celica z migetalkami", 9: "ploščata epitelna celica", 10: "celica glije", 11: "kvasovka", 12: "pražival",
  13: "gladka mišična celica", 14: "maščobna celica", 15: "levkocit", 16: "mišično vlakno", 17: "živčni izrastki",
  18: "fotoreceptor (paličnica ali čepnica)",
};
// Ravni (optika.js raven()) in skupine izbirnika (preparati/index.js SKUPINE) se prevedejo s ključi mk.level.* in mk.group.*.
const imeRavni = (rv) => (rv ? t(`mk.level.${rv}`) : "");

const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const dec = (x, d = 2) => x.toFixed(d).replace(".", ",").replace("-", "−");
const omeji = (x, a, b) => Math.min(b, Math.max(a, x));

function naloziCss() {
  for (const href of CSS)
    if (!document.querySelector(`link[href="${href}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.append(l);
    }
}

// Drsnik s prikazom vrednosti (j: korak 1/10000, dve decimalki; brez malih puščic).
function drsnik(ime, { min, max, vrednost, prikaz, ob }) {
  const w = mk("label", "k3-drsnik mk-drsnik");
  const vrh = mk("span", "k3-drsnik-vrh");
  const out = mk("output", "");
  vrh.append(mk("span", "", ime), out);
  const inp = mk("input");
  inp.type = "range";
  inp.setAttribute("aria-label", ime);
  inp.min = 0;
  inp.max = 1;
  inp.step = 0.0001;
  const vPol = (v) => (v - min) / (max - min);
  const izPol = (u) => min + u * (max - min);
  const nastavi = (v) => {
    inp.value = String(vPol(v));
    out.textContent = prikaz(v);
  };
  inp.addEventListener("input", () => {
    const v = izPol(Number(inp.value));
    out.textContent = prikaz(v);
    ob(v);
  });
  nastavi(vrednost);
  w.append(vrh, inp);
  return { el: w, nastavi, inp };
}

// cilj (»Poglej z mikroskopom« pri delu 3D modela, mapa.js pogledDela): { m: povečava, snov: [S_*] } – mikroskop se odpre pri
// tej povečavi, sredina in kazalec pa na najbližjem mestu s to snovjo (npr. jedrce, vakuola, kloroplast).
export async function odpriMikroskop(el, { preparat = null, cilj = null, zapri = null, obPreparatu = null, vLekciji = false } = {}) {
  naloziCss();
  el.replaceChildren();
  el.classList.add("k3", "mk");
  if (vLekciji) el.classList.add("mk-lekcija");

  // ---------- zgradba ----------
  const vrh = mk("header", "k3-model-vrh mk-vrh");
  if (zapri) {
    const b = mk("button", "a3-krog");
    b.type = "button";
    b.innerHTML = ikona("arrow-left");
    b.setAttribute("aria-label", t("a3.back"));
    b.title = t("a3.back");
    b.addEventListener("click", zapri);
    vrh.append(b);
  }
  const naslov = mk("div", "k3-model-naslov");
  const nadnaslov = mk("p", "k3-nadnaslov", t("mk.title"));
  const h1 = mk(vLekciji ? "h3" : "h1", "", "");
  naslov.append(nadnaslov, h1);
  const bIzberi = mk("button", "a3-pill mk-izberi");
  bIzberi.type = "button";
  bIzberi.innerHTML = `${ikona("layers")}<span>${t("mk.specimens")}</span>`;
  bIzberi.setAttribute("aria-haspopup", "dialog");
  vrh.append(naslov, bIzberi);

  const telo = mk("div", "mk-telo");
  const oder = mk("div", "mk-oder");
  const platno = mk("canvas", "mk-platno");
  platno.tabIndex = 0;
  platno.setAttribute("role", "img");
  const oznaka = mk("div", "mk-oznaka"); // ime pod kazalcem miške ali pod prstom
  oznaka.hidden = true;
  const igla = mk("div", "mk-igla"); // kazalec v okularju
  igla.setAttribute("aria-hidden", "true");
  const merilo = mk("div", "k3-merilo mk-merilo");
  const meriloCrta = mk("span", "k3-merilo-crta");
  const meriloNapis = mk("span", "");
  merilo.append(meriloCrta, meriloNapis);
  const znacka = mk("div", "mk-znacka");
  const nalaganje = mk("div", "mk-nalaganje", t("mk.loading"));
  // 100× brez olja: gumb kar na odru, da ga na telefonu ni treba iskati pod sliko
  const bKapni = mk("button", "a3-pill mk-kapni");
  bKapni.type = "button";
  bKapni.hidden = true;
  const oznakeMol = mk("div", "mk-mol-oznake"); // imena molekul na sliki (raven molekul in atomov)
  oznakeMol.setAttribute("aria-hidden", "true");
  oder.append(platno, oznakeMol, igla, oznaka, merilo, znacka, bKapni, nalaganje);
  const kazalec = mk("p", "mk-kazalec");
  kazalec.setAttribute("aria-live", "polite");

  const plosca = mk("div", "mk-plosca");
  telo.append(mk("div", "mk-levo"), plosca);
  telo.firstChild.append(oder, kazalec);
  el.append(vrh, telo);

  // ---------- stanje ----------
  let upo;
  try {
    upo = ustvariUpodobitev(platno, { temSonda: () => s.nacin === "tem" });
  } catch (e) {
    bIzberi.hidden = true; // glava z gumbom Nazaj ostane
    el.replaceChildren(vrh, mk("p", "k3-napaka", t(e?.koda === "webgl" ? "a3.noWebgl" : "a3.loadError")));
    return { unici() {} };
  }
  // Če telefon ponastavi grafiko (izgubljen kontekst WebGL, npr. po predolgem izrisu ali v ozadju), slika ne sme ostati
  // črna: ob obnovi se upodobitev in preparat pripravita znova.
  platno.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (!zivo) return;
    delo = null;
    nalaganje.hidden = false;
  });
  platno.addEventListener("webglcontextrestored", () => {
    if (!zivo) return;
    try {
      upo = ustvariUpodobitev(platno, { temSonda: () => s.nacin === "tem" });
    } catch {
      return;
    }
    pKljuc = mKljuc = "";
    molZacet = false;
    idKljuc = "";
    const id = prep?.id;
    if (id) izberiPreparat(id, { zacetek: false }).catch(() => {});
    else nalaganje.hidden = true;
  });
  let prep = null;
  let s = { ...ZACETNO };
  let zivo = true;
  let interakcija = 0;
  let cakaIzris = false;
  let zadnji = null; // zadnji pogled (vp, n, velikost)

  // ---------- plošča z nadzorom ----------
  const sekcija = (naslovS) => {
    const sec = mk("section", "mk-sekcija");
    if (naslovS) sec.append(mk("h2", "mk-sek-naslov", naslovS));
    plosca.append(sec);
    return sec;
  };
  const secPov = sekcija(t("mk.magnification"));
  const revolver = mk("div", "mk-revolver");
  revolver.setAttribute("role", "group");
  revolver.setAttribute("aria-label", t("mk.objective"));
  const gumbiObj = OBJEKTIVI.map((o, i) => {
    const b = mk("button", "a3-pill mk-obj");
    b.type = "button";
    b.innerHTML = `<b>${o.m}×</b><small>${o.olje ? t("mk.oilShort") : `NA ${dec(o.na)}`}</small>`;
    b.addEventListener("click", () => izberiObjektiv(i));
    revolver.append(b);
    return b;
  });
  // SEM (vrstični elektronski mikroskop, j 13. 11. 2026): površina v 3D videzu, povečava zvezno do SEM_MAX
  const bSem = mk("button", "a3-pill mk-obj mk-sem");
  bSem.type = "button";
  bSem.innerHTML = `<b>SEM</b><small>${t("mk.surface")}</small>`;
  bSem.addEventListener("click", () => {
    if (s.nacin === "sem") return;
    const m = omeji(povecava(s), MIN_M, SEM_MAX);
    kTkivu(true);
    s.nacin = "sem";
    s.m = m;
    narisi();
  });
  revolver.append(bSem);
  const bTem = mk("button", "a3-pill mk-obj mk-tem");
  bTem.type = "button";
  bTem.innerHTML = `<b>TEM</b><small>${t("mk.section")}</small>`;
  bTem.addEventListener("click", () => {
    if (s.nacin === "tem") return;
    const m = omeji(Math.max(5000, povecava(s) * 5), MIN_M, MAX_M);
    kTkivu(true);
    s.nacin = "tem";
    s.m = m;
    narisi();
  });
  revolver.append(bTem);
  // drsnik je logaritemski; pri SEM sega do SEM_MAX, sicer (svetloba in TEM skupaj) do MAX_M
  const zvezno = () => s.nacin === "tem" || s.nacin === "sem";
  const najvec = () => (s.nacin === "sem" ? SEM_MAX : MAX_M);
  const logMin = Math.log(MIN_M);
  const izU = (u) => Math.exp(logMin + u * (Math.log(najvec()) - logMin));
  const vU = (m) => (Math.log(m) - logMin) / (Math.log(najvec()) - logMin);
  const dPov = drsnik(t("mk.total"), {
    min: 0, max: 1, vrednost: 0,
    prikaz: (u) => oznakaPovecave(izU(u)),
    ob: (u) => {
      interakcija = 1; // med vlečenjem hiter predogled, polna slika po spustu
      nastaviPovecavo(izU(u), { izDrsnika: true });
    },
  });
  // gumba − in + ob drsniku (j, 13. 11. 2026): pri svetlobi menjata objektiv, pri TEM povečavo podvojita ali razpolovita
  const gumbPov = (ikonaIme, kljuc, f) => {
    const b = mk("button", "a3-krog mk-pov-gumb");
    b.type = "button";
    b.innerHTML = ikona(ikonaIme);
    b.setAttribute("aria-label", t(kljuc));
    b.title = t(kljuc);
    // tap: en korak; držanje: po 0,4 s se korak ponavlja (pri TEM v manjših korakih, da je spreminjanje gladko)
    let cakaj = 0, prej = 0, kazalecCas = -1e9;
    const ustavi = () => {
      clearTimeout(cakaj);
      cakaj = prej = 0;
    };
    const korak = () => {
      if (!zivo || !b.isConnected || b.disabled || document.hidden) return ustavi();
      const zdaj = performance.now();
      const dt = prej ? Math.min(0.5, (zdaj - prej) / 1000) : 0.04;
      prej = zdaj;
      const tem = zvezno();
      interakcija = 1; // med držanjem hitri izris v polovični ločljivosti, polni po spustu (kot kolesce)
      // TEM: zvezno, ×10 na 1,5 s ne glede na hitrost naprave; svetloba: naslednji objektiv
      zoom(tem ? Math.pow(10, ((f > 1 ? 1 : -1) * dt) / 1.5) : f);
      cakaj = setTimeout(korak, zvezno() ? 40 : 420); // način po koraku: ob prehodu TEM → svetloba naslednji objektiv šele čez 0,42 s
    };
    b.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || b.disabled) return;
      e.preventDefault();
      b.setPointerCapture?.(e.pointerId);
      kazalecCas = performance.now();
      ustavi();
      zoom(f);
      cakaj = setTimeout(korak, 400);
    });
    for (const ime of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(ime, ustavi);
    b.addEventListener("pointerup", () => (kazalecCas = performance.now()));
    // klik brez kazalca: tipkovnica (Enter, preslednica) in bralniki zaslona (VoiceOver/TalkBack lahko pošljejo detail 1);
    // klik takoj po pointerdown/pointerup je že narejen korak
    b.addEventListener("click", () => {
      if (performance.now() - kazalecCas > 1000) zoom(f);
    });
    b.addEventListener("contextmenu", (e) => e.preventDefault()); // dolgi pritisk na telefonu ne odpre menija
    return b;
  };
  const bManj = gumbPov("zoom-out", "a3.zoomOut", 0.5);
  const bVec = gumbPov("zoom-in", "a3.zoomIn", 2);
  const vrstaPov = mk("div", "mk-pov");
  vrstaPov.append(bManj, dPov.el, bVec);
  secPov.append(revolver, vrstaPov);

  const secLuc = sekcija(t("mk.light"));
  const dGrobi = drsnik(t("mk.coarse"), { min: -150, max: 150, vrednost: 0, prikaz: (v) => `${dec(v)} µm`, ob: (v) => ((s.grobi = v), nastaviOstrino()) });
  const dFini = drsnik(t("mk.fine"), { min: -8, max: 8, vrednost: 0, prikaz: (v) => `${dec(v)} µm`, ob: (v) => ((s.fini = v), nastaviOstrino()) });
  const dLucka = drsnik(t("mk.lamp"), { min: 0, max: 1, vrednost: s.zarnica, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zarnica = v), (lucRocno = true), narisi()) });
  const dZaslonka = drsnik(t("mk.diaphragm"), { min: 0.05, max: 1, vrednost: s.zaslonka, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zaslonka = v), narisi()) });
  const vrstaOlje = mk("div", "mk-vrsta");
  const bOlje = mk("button", "a3-pill mk-stikalo");
  bOlje.type = "button";
  bOlje.setAttribute("aria-pressed", "false");
  bOlje.innerHTML = `${ikona("droplet")}<span>${t("mk.oil")}</span>`;
  bOlje.addEventListener("click", () => {
    s.olje = !s.olje;
    narisi();
  });
  bKapni.innerHTML = `${ikona("droplet")}<span>${t("mk.addOil")}</span>`;
  bKapni.addEventListener("click", () => {
    s.olje = true;
    narisi();
  });
  const bIzostri = mk("button", "a3-pill");
  bIzostri.type = "button";
  bIzostri.innerHTML = `${ikona("focus")}<span>${t("mk.focus")}</span>`;
  bIzostri.title = t("mk.focusTitle");
  bIzostri.addEventListener("click", () => {
    s.grobi = 0;
    s.fini = omeji(-s.dzObj, -8, 8);
    dGrobi.nastavi(0);
    dFini.nastavi(s.fini);
    nastaviOstrino();
  });
  vrstaOlje.append(bOlje, bIzostri);
  const opozorilo = mk("p", "mk-opozorilo");
  opozorilo.hidden = true;
  secLuc.append(dGrobi.el, dFini.el, dLucka.el, dZaslonka.el, vrstaOlje, opozorilo);

  const secTem = sekcija(t("mk.electron"));
  const dDefokus = drsnik(t("mk.defocus"), { min: -1, max: 1, vrednost: 0, prikaz: (v) => dec(v), ob: (v) => ((s.defokus = v), narisi()) });
  const dSvetlost = drsnik(t("mk.beam"), { min: 0, max: 1, vrednost: s.zarnica, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zarnica = v), narisi()) });
  const bBarve = mk("button", "a3-pill mk-stikalo");
  bBarve.type = "button";
  bBarve.innerHTML = `${ikona("sun")}<span>${t("mk.colors")}</span>`;
  bBarve.addEventListener("click", () => {
    s.barve = !s.barve;
    narisi();
  });
  secTem.append(dDefokus.el, dSvetlost.el, bBarve);

  const secSem = sekcija(t("mk.sem"));
  const dSnopSem = drsnik(t("mk.beam"), { min: 0, max: 1, vrednost: s.zarnica, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zarnica = v), narisi()) });
  secSem.append(dSnopSem.el);

  const secPodatki = sekcija(null);
  const tabela = mk("dl", "mk-podatki");
  const resnica = mk("p", "mk-resnica");
  secPodatki.append(tabela, resnica);

  // molekule v vidnem polju z imeni in vlogo (j, 13. 11. 2026: »z poimenovanji«), pri atomih še legenda elementov
  const secMol = sekcija(t("mk.molList"));
  const seznamMol = mk("ul", "mk-mol-seznam");
  const atomiMol = mk("div", "mk-mol-atomi");
  secMol.append(seznamMol, atomiMol);
  secMol.hidden = true;

  const secInfo = sekcija(t("mk.about"));
  const opis = mk("p", "mk-opis");
  const barvanje = mk("p", "mk-barvanje");
  const naloga = mk("p", "mk-naloga");
  secInfo.append(opis, barvanje, naloga);

  // ---------- izbirnik preparatov ----------
  const izbirnik = mk("div", "mk-izbirnik");
  izbirnik.hidden = true;
  izbirnik.setAttribute("role", "dialog");
  izbirnik.setAttribute("aria-modal", "true");
  izbirnik.setAttribute("aria-label", t("mk.specimens"));
  const izbOkno = mk("div", "mk-izb-okno");
  izbOkno.tabIndex = -1; // klik na prazno v oknu obdrži fokus v izbirniku, da Esc zapre izbirnik in ne mikroskopa (stran.js)
  const izbVrh = mk("div", "mk-izb-vrh");
  const iskanje = mk("input", "mk-iskanje");
  iskanje.type = "search";
  iskanje.placeholder = t("mk.search");
  iskanje.setAttribute("aria-label", t("mk.search"));
  const bZapriIzb = mk("button", "a3-krog a3-mali-krog");
  bZapriIzb.type = "button";
  bZapriIzb.innerHTML = ikona("x");
  bZapriIzb.setAttribute("aria-label", t("a3.close"));
  izbVrh.append(iskanje, bZapriIzb);
  const izbSeznam = mk("div", "mk-izb-seznam");
  izbOkno.append(izbVrh, izbSeznam);
  izbirnik.append(izbOkno);
  el.append(izbirnik);
  const norm = (x) => x.toLocaleLowerCase("sl").normalize("NFD").replace(/[̀-ͯ]/g, "");
  function napolniIzbirnik() {
    const q = norm(iskanje.value.trim());
    izbSeznam.replaceChildren();
    for (const [sk] of SKUPINE) {
      const v = PREPARATI.filter((p) => p.skupina === sk && (!q || norm(p.ime).includes(q)));
      if (!v.length) continue;
      izbSeznam.append(mk("h3", "mk-izb-skupina", t(`mk.group.${sk}`)));
      const g = mk("div", "mk-izb-mreza");
      for (const p of v) {
        const b = mk("button", "mk-izb-gumb", p.ime);
        b.type = "button";
        if (prep && p.id === prep.id) b.setAttribute("aria-current", "true");
        b.addEventListener("click", () => {
          zapriIzbirnik();
          izberiPreparat(p.id);
        });
        g.append(b);
      }
      izbSeznam.append(g);
    }
  }
  function odpriIzbirnik() {
    napolniIzbirnik();
    izbirnik.hidden = false;
    iskanje.focus({ preventScroll: true });
  }
  function zapriIzbirnik() {
    izbirnik.hidden = true;
    bIzberi.focus({ preventScroll: true });
  }
  bIzberi.addEventListener("click", odpriIzbirnik);
  bZapriIzb.addEventListener("click", zapriIzbirnik);
  iskanje.addEventListener("input", napolniIzbirnik);
  izbirnik.addEventListener("click", (e) => {
    if (e.target === izbirnik) zapriIzbirnik();
  });
  izbirnik.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      zapriIzbirnik();
    } else if (e.key === "Tab") {
      // fokus ostane v izbirniku (Tab s prvega/zadnjega gumba skoči na drugi konec)
      const f = [...izbirnik.querySelectorAll("input,button")].filter((x) => !x.hidden && x.offsetParent);
      if (!f.length) return;
      const [a, b] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) (e.preventDefault(), b.focus());
      else if (!e.shiftKey && document.activeElement === b) (e.preventDefault(), a.focus());
    }
  });

  // ---------- optika ----------
  s.grobi = 0;
  s.fini = 0;
  s.dzObj = 0; // odmik zaradi menjave objektiva (ni povsem parfokalen)
  function nastaviOstrino() {
    s.dz = s.grobi + s.fini + s.dzObj;
    narisi();
  }
  function izberiObjektiv(i) {
    const prej = OBJEKTIVI[s.objektiv];
    if (s.nacin !== "svetloba") {
      s.nacin = "svetloba";
    } else if (i !== s.objektiv) {
      s.dzObj += OBJEKTIVI[i].parfokal - prej.parfokal;
    }
    s.objektiv = i;
    s.m = OBJEKTIVI[i].m * OKULAR;
    samodejnaLucka();
    nastaviOstrino();
  }
  // Kot v laboratoriju: dokler lučke ne nastaviš sam, je ob vsakem objektivu nastavljena tako, da je podlaga skoraj bela
  // (pri večjem objektivu pride skozi manj svetlobe, zato lučka močneje sveti).
  let lucRocno = false;
  function samodejnaLucka() {
    if (lucRocno || s.nacin !== "svetloba") return;
    const polna = svetlost(OBJEKTIVI[s.objektiv], 1, s.zaslonka, s.olje);
    s.zarnica = Math.max(0.05, Math.min(1, 0.95 / polna));
  }
  function nastaviPovecavo(m, { izDrsnika = false } = {}) {
    if (s.nacin === "sem") {
      // pri robu (držanje −/+ se ustavi znotraj 1 %) točno 40× ali 300 000×, da se podatki ujemajo z oznako
      s.m = m < MIN_M * 1.01 ? MIN_M : m > SEM_MAX * 0.99 ? SEM_MAX : m;
      return narisi({ izDrsnika });
    }
    m = omeji(m, MIN_M, MAX_M);
    if (m > SVETLOBNI_MAX * 1.05) {
      if (s.nacin !== "tem") kTkivu(true);
      s.nacin = "tem";
      s.m = m;
    } else {
      // svetlobni mikroskop ima samo štiri objektive: najbližji v logaritemskem smislu
      let i = 0;
      for (let k = 0; k < OBJEKTIVI.length; k++) if (Math.abs(Math.log(OBJEKTIVI[k].m * OKULAR / m)) < Math.abs(Math.log(OBJEKTIVI[i].m * OKULAR / m))) i = k;
      if (s.nacin === "tem" || i !== s.objektiv) izberiObjektiv(i);
    }
    narisi({ izDrsnika });
  }
  // Ob začetku in prehodu na TEM: če je na sredini prazno stekelce, se premakni na najbližje tkivo (vidno polje TEM je ~30 µm).
  // Ob prehodu na elektronski mikroskop, dokler uporabnik ni sam premikal preparata, gre na značilno snov preparata
  // (kri: eritrocit, mišica: miofibrila, T4: DNK v glavi), da so na ravni molekul vidne molekule, po katerih je preparat znan.
  let rocno = false;
  function kTkivu(znacilno = false) {
    if (!prep) return;
    const [x0, y0] = s.sredisce;
    const zel = znacilno && !rocno ? ZNACILNO[prep.id] : null;
    const prazno = (o) => Math.round(o.snovT) === 0;
    const ustreza = (o) => (zel ? zel.includes(Math.round(o.snov)) : !prazno(o));
    const c = upo.sonda([s.sredisce]);
    if (!c || ustreza(c[0])) return;
    if (zel) {
      // vnaprej izračunana točka globoko v značilni snovi; če je ni (spremenjena oblika), okolica točke, nato okolica sredine
      const z = ZNACILNA_TOCKA[prep.id];
      if (z && ustreza(upo.sonda([z])[0])) return void (s.sredisce = [...z]);
      if (z && poisci(z[0], z[1], ustreza, 0.02, 1.3, 5)) return;
      if (poisci(x0, y0, ustreza, 0.03, 1.25, 100)) return;
    }
    if (prazno(c[0])) poisci(x0, y0, (o) => !prazno(o), 3, 2, 100);
  }
  // Išče po krogih (polmer r0, r0·k, … do rMax µm, vsak krog zasukan; točke na krogu največ ~0,4 µm narazen, a vsaj 8 in
  // največ 64) in premakne sredino na prvo ustrezno točko.
  let rokIskanja = Infinity;
  function poisci(x0, y0, ustreza, r0, k, rMax) {
    for (let r = r0, j = 0; r <= rMax && performance.now() < rokIskanja; r *= k, j++) {
      const n = Math.min(64, Math.max(8, 8 * Math.ceil((2 * Math.PI * r) / 0.4 / 8)));
      const tocke = Array.from({ length: n }, (_, i) => {
        const f = ((i + 0.618 * j) * 2 * Math.PI) / n;
        return [x0 + r * Math.cos(f), y0 + r * Math.sin(f)];
      });
      for (let a = 0; a < n; a += 8) {
        const o = upo.sonda(tocke.slice(a, a + 8));
        const i = o?.findIndex(ustreza) ?? -1;
        if (i >= 0) {
          s.sredisce = tocke[a + i];
          return true;
        }
      }
    }
    return false;
  }
  const zoom = (f) => {
    if (s.nacin === "sem") return nastaviPovecavo(s.m * f);
    if (s.nacin === "tem") {
      if (f < 1 && s.m * f < SVETLOBNI_MAX * 1.05) return izberiObjektiv(OBJEKTIVI.length - 1);
      return nastaviPovecavo(s.m * f);
    }
    if (f > 1) {
      if (s.objektiv < OBJEKTIVI.length - 1) izberiObjektiv(s.objektiv + 1);
      else nastaviPovecavo(2000);
    } else if (s.objektiv > 0) izberiObjektiv(s.objektiv - 1);
  };

  // ---------- izris ----------
  function velikost() {
    const r = oder.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(64, Math.round(r.width * dpr));
    const H = Math.max(64, Math.round(r.height * dpr));
    if (platno.width !== W || platno.height !== H) {
      platno.width = W;
      platno.height = H;
    }
    // svetlobni: okrogel okular v krajši stranici; TEM: kvadratna slika pokrije ves oder (daljšo stranico), da ni praznih robov
    const pokrij = zvezno();
    const css = pokrij ? Math.max(r.width, r.height) : Math.min(r.width, r.height);
    const N = pokrij ? Math.max(W, H) : Math.min(W, H);
    const cap = N > 1100 ? 1024 : 768;
    return { W, H, css, N, n: Math.min(N, cap) };
  }
  function narisi({ izDrsnika = false } = {}) {
    if (!izDrsnika) posodobiNadzor();
    else posodobiNadzor({ brezDrsnika: true });
    if (cakaIzris) return;
    cakaIzris = true;
    requestAnimationFrame(izrisi);
  }
  // Izris v dveh korakih (j, 13. 11. 2026: »mikroskop je počasen«): ob spremembi pogleda takoj hiter predogled v nižji
  // ločljivosti, nato polna slika po vodoravnih pasovih v ozadju (pas ~25 ms, med pasovi stran ostane odzivna in
  // telefon ne zamrzne). Drsniki, ki preparata ne spremenijo (lučka, zaslonka, ostrina), le znova sestavijo že
  // narisan preparat. Čas izrisa se meri, zato se predogled in pasovi prilagodijo hitrosti naprave.
  let polnaPozneje = 0;
  let skala = 0.4; // ločljivost predogleda glede na polno (0,15–0,75)
  let msNaVzorec = 0; // izmerjen čas preparata na vzorec (ms), 0 = še ne vemo
  let pKljuc = ""; // pogled, za katerega je preparat v polni ločljivosti v celoti narisan
  let brezSS = false; // naprava je prepočasna za 4 vzorce na točko (do menjave preparata)
  let mKljuc = ""; // pogled, za katerega je sloj molekul v celoti narisan
  let msNaMol = 0; // izmerjen čas sloja molekul na točko (ms)
  let molZacet = false;
  let delo = null; // izris po pasovih, ki še teče: { kljuc, mK, r, css, faza (0 preparat, 1 molekule), y, h }
  const PAS_MS = 25;
  const kljucPreparata = (v) => JSON.stringify([prep?.id, v.n, v.sredisce, v.umNaTocko, v.nacin, v.barvila, v.debelina, v.ss]);
  const kljucMol = (r) => {
    const U = r.mol.uniforme;
    return JSON.stringify([prep?.id, r.v.n, r.v.umNaTocko, U.fine, U.mem, U.y0, U.n, U.smer, U.smerL, U.faza, U.barve, U.pA, U.pB, U.memVrsta, U.zun, U.bodice, r.mol.reze]);
  };
  function izmeri(fn, vzorcev) {
    const t0 = performance.now();
    fn();
    upo.pocakaj();
    const ms = performance.now() - t0;
    const m = ms / Math.max(1, vzorcev);
    msNaVzorec = msNaVzorec ? 0.6 * msNaVzorec + 0.4 * m : m;
    return ms;
  }
  // sloj molekul je ~100× dražji od preparata: dokler njegova hitrost ni izmerjena, prvi pas je le 4 vrstice
  const visinaPasuMol = (n) => (msNaMol ? Math.max(4, Math.min(n, Math.round(PAS_MS / Math.max(1e-7, msNaMol * n)))) : 4);
  const visinaPasu = (n, ss) => Math.max(4, Math.min(n, Math.round(PAS_MS / Math.max(1e-7, msNaVzorec * n * ss))));
  // hiter izris v nižji ločljivosti (med premikanjem in kot predogled); skala se prilagodi, da traja ~30 ms
  function predogled(css, N, n) {
    // ko je hitrost naprave že izmerjena, skala takoj ustreza ~30 ms (zahtevnejši preparati so lahko večkrat počasnejši)
    if (msNaVzorec) skala = Math.round(20 * Math.max(0.15, Math.min(0.75, Math.sqrt(30 / (msNaVzorec * n * n))))) / 20;
    const nn = Math.min(n, Math.max(96, 32 * Math.round((n * skala) / 32)));
    if (nn === n) pKljuc = ""; // predogled v polni velikosti prepiše polno sliko
    const r = izracunajPogled(upo, prep, s, nn, { hitro: true });
    r.v.ss = r.v.ss || 1;
    r.v.zaslonN = N;
    r.v.cas = performance.now() / 1000;
    const ms = izmeri(() => upo.narisiPreparat(r.v), nn * nn * (r.v.ss || 1));
    upo.sestavi(r.v);
    const f = Math.max(0.8, Math.min(1.25, Math.sqrt(30 / Math.max(1, ms))));
    skala = Math.round(20 * Math.max(0.15, Math.min(0.75, skala * f))) / 20;
    zadnji = { vp: r.vp, css, m: r.m, mol: r.mol };
    oznakeMol.replaceChildren();
    posodobiMerilo();
  }
  // Pri največjih povečavah (vidno polje pod 20 nm) je sredina pogosto v vodi med molekulami (npr. med filamenti
  // miofibrile): ob spremembi povečave se preparat premakne na najbližjo molekulo v krogu ~30 nm, da se vidi, iz česa
  // je snov na sredini (j, 13. 11. 2026: srčna mišica pri 50 000 000×). Premikanje preparata potem deluje kot prej.
  let molM = 0;
  function kMolekuli(n) {
    if (s.nacin !== "tem" || s.m === molM || !upo.molPripravljen()) return;
    molM = s.m;
    if (vidnoPolje(s.m, "tem") >= 0.02) return;
    const r = izracunajPogled(upo, prep, s, n, { hitro: false });
    const k = 64; // mreža 64 × 64 po 1 nm
    const id = r.mol && upo.idMolekul({ ...r.v, n: k, umNaTocko: 0.001 }, k);
    if (!id) return;
    const d = najblizjaMolekula(id, k, r.mol.reze);
    if (!d) return;
    const [dx, dy] = d;
    const nova = [s.sredisce[0] + dx / 1000, s.sredisce[1] + dy / 1000];
    // čez šiv sveta molekul (pogled.js fino) bi bila na novem mestu druga molekula: tam ostane
    if (Math.abs(fino(nova[0]) - fino(s.sredisce[0]) - dx) > 1 || Math.abs(fino(nova[1]) - fino(s.sredisce[1]) - dy) > 1) return;
    s.sredisce = nova;
  }
  function izrisi() {
    cakaIzris = false;
    if (!zivo || !prep) return;
    const { css, N, n } = velikost();
    if (interakcija === 0) kMolekuli(n);
    if (interakcija > 0) {
      delo = null;
      predogled(css, N, n);
      clearTimeout(polnaPozneje);
      polnaPozneje = setTimeout(() => {
        interakcija = 0;
        narisi();
      }, 160);
      return;
    }
    const r = izracunajPogled(upo, prep, s, n, { hitro: false });
    r.v.ss = r.v.ss || 1;
    // na počasni napravi štirje vzorci na točko ne odtehtajo čakanja (polna slika naj bo v manj kot ~1 s); hitrost se
    // izmeri s predogledom, odločitev velja do menjave preparata (sicer bi drsnik lučke lahko sprožil nov izris)
    if (r.v.ss > 1 && !msNaVzorec) predogled(css, N, n);
    if (r.v.ss > 1 && (brezSS || msNaVzorec * n * n * r.v.ss > 800)) {
      brezSS = true;
      r.v.ss = 1;
    }
    r.v.zaslonN = N;
    r.v.cas = performance.now() / 1000;
    // sloj molekul: program se prevaja v ozadju šele ob prvem obisku TEM (ko je pripravljen, se slika osveži)
    if (r.mol && !molZacet) {
      molZacet = true;
      upo.pripraviMol().then((ok) => ok && zivo && narisi());
    }
    const kljuc = kljucPreparata(r.v);
    const mK = r.mol && upo.molPripravljen() ? kljucMol(r) : "";
    if (!upo.ima(n)) pKljuc = mKljuc = "";
    const rabiP = kljuc !== pKljuc;
    const rabiM = !!mK && mK !== mKljuc;
    if (!rabiP && !rabiM) return koncaj(r, css);
    if (delo && delo.kljuc === kljuc && delo.mK === mK) {
      // izris tega pogleda že teče: ob koncu naj velja zadnje stanje drsnikov
      delo.r = r;
      delo.css = css;
      return;
    }
    // nov pogled: najprej predogled, razen če je polna slika tako ali tako hitra
    if (rabiP) {
      if (!msNaVzorec || msNaVzorec * n * n * r.v.ss > 2 * PAS_MS) predogled(css, N, n);
      pKljuc = "";
    }
    mKljuc = "";
    const d = (delo = { kljuc, mK, r, css, faza: rabiP ? 0 : 1, y: 0, h: rabiP ? visinaPasu(n, r.v.ss) : visinaPasuMol(n) });
    requestAnimationFrame(() => nadaljuj(d));
  }
  // vsak izris ima svojo zanko pasov; ko ga zamenja nov pogled, se stara zanka ustavi (sicer bi se zanke kopičile)
  function nadaljuj(d) {
    if (!zivo || !prep || delo !== d) return;
    const v = d.r.v;
    const y1 = Math.min(v.n, d.y + d.h);
    if (d.faza === 0) {
      izmeri(() => upo.narisiPreparat(v, d.y, y1), v.n * (y1 - d.y) * (v.ss || 1));
      d.y = y1;
      d.h = visinaPasu(v.n, v.ss || 1);
      if (d.y < v.n) return void requestAnimationFrame(() => nadaljuj(d));
      pKljuc = d.kljuc;
      if (d.mK) {
        // nato sloj molekul, prav tako po pasovih
        d.faza = 1;
        d.y = 0;
        d.h = visinaPasuMol(v.n);
        return void requestAnimationFrame(() => nadaljuj(d));
      }
    } else {
      const t0 = performance.now();
      upo.narisiMol(v, d.y, y1);
      upo.pocakajMol();
      const ms = (performance.now() - t0) / Math.max(1, v.n * (y1 - d.y));
      msNaMol = msNaMol ? 0.6 * msNaMol + 0.4 * ms : ms;
      d.y = y1;
      d.h = visinaPasuMol(v.n);
      if (d.y < v.n) {
        // sproti pokaži že narisani del (na počasnem telefonu traja celoten sloj nekaj sekund)
        if (d.r.mol) upo.sestavi(v, d.r.mol.utez, d.y / v.n);
        return void requestAnimationFrame(() => nadaljuj(d));
      }
      mKljuc = d.mK;
    }
    delo = null;
    koncaj(d.r, d.css);
  }
  function koncaj(r, css) {
    const id = idMolekul(r);
    const molGotov = r.mol && mKljuc && mKljuc === kljucMol(r);
    upo.sestavi(r.v, molGotov ? r.mol.utez : 0);
    zadnji = { vp: r.vp, css, m: r.m, mol: r.mol };
    posodobiMolekule(r, css, id);
    posodobiMerilo();
    posodobiKazalec();
  }

  // ---------- molekule z imeni ----------
  // Senčilnik molekul v mreži K × K zapiše, katera molekula je kje (upo.idMolekul); za vsako molekulo poiščemo točko
  // globoko v njej (največ sosedov iste molekule), tam je oznaka. Pod sliko je seznam z vlogo, pri atomih še elementi.
  const K = 48;
  // svetlost, defokus in šum ne premaknejo molekul: ob istem pogledu velja zadnja mreža
  let idKljuc = "";
  let idZadnji = null;
  function idMolekul(r) {
    if (!r.mol || r.mol.utez < 0.5) return null;
    const U = r.mol.uniforme;
    const kljuc = JSON.stringify([r.v.sredisce, r.v.umNaTocko, r.v.n, U.pA, U.pB, U.memVrsta, U.zun, U.mem, U.y0, U.n, U.fine, U.smer, U.faza, r.mol.reze]);
    if (kljuc !== idKljuc) {
      idZadnji = upo.idMolekul(r.v, K);
      idKljuc = idZadnji ? kljuc : ""; // program molekul še ni pripravljen: poskusi znova ob naslednjem izrisu
    }
    return idZadnji;
  }
  function posodobiMolekule(r, css, id) {
    const reze = id ? r.mol.reze : null;
    oznakeMol.replaceChildren();
    secMol.hidden = !id;
    if (!id) return;
    const ime = (i, j) => {
      const k = id[j * K + i] - 1;
      return k >= 0 ? reze[k] : null;
    };
    const rob = oder.getBoundingClientRect();
    const naZaslon = (i, j) => [rob.width / 2 + ((i + 0.5) / K - 0.5) * css, rob.height / 2 - ((j + 0.5) / K - 0.5) * css];
    const vse = new Map();
    for (let j = 0; j < K; j++)
      for (let i = 0; i < K; i++) {
        const m = ime(i, j);
        if (!m) continue;
        let e = vse.get(m);
        if (!e) vse.set(m, (e = { n: 0, naj: -1, tocka: null }));
        e.n++;
        const [x, y] = naZaslon(i, j);
        if (x < 40 || x > rob.width - 40 || y < 44 || y > rob.height - 44) continue; // oznaka naj bo na odru (izmeri se ob postavitvi)
        let sos = 0;
        for (let dj = -2; dj <= 2; dj++)
          for (let di = -2; di <= 2; di++) if (ime(Math.min(K - 1, Math.max(0, i + di)), Math.min(K - 1, Math.max(0, j + dj))) === m) sos++;
        const ocena = sos - 0.02 * Math.hypot(i - K / 2, j - K / 2);
        if (ocena > e.naj) {
          e.naj = ocena;
          e.tocka = [x, y];
        }
      }
    // večje najprej; voda le, če je prostor
    const red = [...vse.entries()].sort((a, b) => (a[0] === "voda") - (b[0] === "voda") || b[1].n - a[1].n);
    // oznako postavimo, izmerimo in obdržimo le, če je cela na odru in ne prekriva že postavljene
    const postavljene = [];
    for (const [m, e] of red) {
      if (!e.tocka || postavljene.length >= 5) continue;
      const o = mk("span", "mk-mol-oznaka");
      const pika = mk("i", "");
      pika.style.background = MOL[m].barva;
      o.append(pika, document.createTextNode(t(`mk.mol.${m}`)));
      o.style.left = `${e.tocka[0]}px`;
      o.style.top = `${e.tocka[1]}px`;
      oznakeMol.append(o);
      const b = o.getBoundingClientRect();
      const zunaj = b.left < rob.left + 4 || b.right > rob.right - 4 || b.top < rob.top + 36 || b.bottom > rob.bottom - 36;
      const cez = postavljene.some((p) => b.left < p.right + 6 && p.left < b.right + 6 && b.top < p.bottom + 4 && p.top < b.bottom + 4);
      if (zunaj || cez) o.remove();
      else postavljene.push(b);
    }
    seznamMol.replaceChildren(
      ...red.map(([m]) => {
        const li = mk("li", "");
        const pika = mk("i", "");
        pika.style.background = MOL[m].barva;
        li.append(pika, mk("b", "", t(`mk.mol.${m}`)), mk("span", "", t(`mk.molv.${m}`)));
        return li;
      }),
    );
    // atomi: pri manj kot ~0,06 nm na točko so molekule narisane iz atomov
    const atomi = r.v.umNaTocko * 1000 < 0.06;
    atomiMol.hidden = !atomi;
    if (atomi) {
      const el = [...new Set(red.flatMap(([m]) => elementiMolekule(m)))];
      atomiMol.replaceChildren(
        mk("h3", "mk-sek-naslov", t("mk.atomList")),
        ...el.map((x) => {
          const c = mk("span", "mk-el");
          const pika = mk("i", "");
          pika.style.background = ELEMENTI[x];
          c.append(pika, document.createTextNode(x));
          return c;
        }),
      );
    }
  }

  function posodobiMerilo() {
    if (!zadnji) return;
    const pxNaUm = zadnji.css / zadnji.vp;
    const r = oder.getBoundingClientRect();
    const [um, napis] = merilce((Math.min(r.width, r.height) * 0.28) / pxNaUm);
    meriloCrta.style.width = `${Math.max(8, um * pxNaUm)}px`;
    meriloNapis.textContent = napis;
  }

  // ---------- kaj je pod kazalcem ----------
  function imeTocke(p) {
    const r = upo.sonda([p]);
    if (!r) return null;
    const o = r[0];
    const tem = s.nacin === "tem";
    const snovT = Math.round(o.snovT);
    const snovU = Math.round(o.snov);
    const tip = Math.round(o.tip);
    // snovi[0] preparata (svetlina cevke, Haversov kanal …) velja le znotraj rezine (velikost = polosi v µm; rezine so
    // približno eliptične), zunaj nje je prazno stekelce
    const zunaj = prep.velikost && (p[0] / prep.velikost[0]) ** 2 + (p[1] / prep.velikost[1]) ** 2 > 1;
    const imeSnovi = (k) => (k === 0 && zunaj ? SNOVI[0] : prep.snovi?.[k] ?? SNOVI[k] ?? "");
    const celica = prep.imena?.[tip] ?? CELICE[tip] ?? "celica";
    const vCelici = snovT === 1 || snovT === 2 || snovT === 25 || snovT === 27;
    let ime;
    if (tem && snovU === 31) ime = SNOVI[31];
    else if (tem && snovU >= 20 && snovU !== snovT) ime = `${SNOVI[snovU]} · ${celica}`;
    else if (vCelici) ime = snovT === 1 ? celica : `${imeSnovi(snovT)} · ${celica}`;
    else ime = imeSnovi(snovT) || celica;
    return ime.charAt(0).toUpperCase() + ime.slice(1);
  }
  function posodobiKazalec() {
    if (!prep || !zadnji) return;
    const ime = imeTocke(s.sredisce);
    const rv = raven(zadnji.m, s.nacin);
    kazalec.textContent = ime ? t(zvezno() ? "mk.center" : "mk.pointer", { name: ime }) : "";
    platno.setAttribute("aria-label", `${prep.ime}, ${oznakaPovecave(zadnji.m)}, ${imeRavni(rv)}. ${kazalec.textContent}`);
  }
  let skrijOznako = 0;
  function pokaziOznako(ex, ey, trajno) {
    if (!zadnji || !prep) return;
    const r = oder.getBoundingClientRect();
    const x = ex - r.left, y = ey - r.top;
    const k = zadnji.vp / zadnji.css;
    const p = [s.sredisce[0] + (x - r.width / 2) * k, s.sredisce[1] - (y - r.height / 2) * k];
    if (Math.abs(x - r.width / 2) > zadnji.css / 2 || Math.abs(y - r.height / 2) > zadnji.css / 2) {
      oznaka.hidden = true;
      return;
    }
    const ime = imeTocke(p);
    if (!ime) return;
    oznaka.textContent = ime;
    oznaka.hidden = false;
    oznaka.style.left = `${x}px`;
    oznaka.style.top = `${y}px`;
    oznaka.classList.toggle("mk-oznaka-levo", x > r.width * 0.6);
    clearTimeout(skrijOznako);
    if (!trajno) skrijOznako = setTimeout(() => (oznaka.hidden = true), 2600);
  }

  // ---------- nadzor (prikaz stanja) ----------
  function posodobiNadzor({ brezDrsnika = false } = {}) {
    const tem = s.nacin === "tem";
    const sem = s.nacin === "sem";
    const luc = !tem && !sem;
    const m = povecava(s);
    gumbiObj.forEach((b, i) => b.setAttribute("aria-pressed", String(luc && i === s.objektiv)));
    bTem.setAttribute("aria-pressed", String(tem));
    bSem.setAttribute("aria-pressed", String(sem));
    if (!brezDrsnika) dPov.nastavi(vU(m));
    bManj.disabled = m <= MIN_M * 1.01;
    bVec.disabled = m >= najvec() * 0.99;
    secLuc.hidden = !luc;
    secTem.hidden = !tem;
    secSem.hidden = !sem;
    if (sem && !brezDrsnika) dSnopSem.nastavi(s.zarnica);
    if (tem && !brezDrsnika) dSvetlost.nastavi(s.zarnica);
    if (luc && !brezDrsnika) dLucka.nastavi(s.zarnica); // lučka, snop TEM in snop SEM so ista vrednost
    oder.classList.toggle("mk-tem", !luc);
    igla.hidden = !luc;
    bOlje.setAttribute("aria-pressed", String(s.olje));
    bBarve.setAttribute("aria-pressed", String(s.barve));
    const obj = OBJEKTIVI[s.objektiv];
    const brezOlja = luc && obj.olje && !s.olje;
    const oljeBrezPotrebe = luc && !obj.olje && s.olje;
    opozorilo.hidden = !brezOlja && !oljeBrezPotrebe;
    bKapni.hidden = !brezOlja;
    opozorilo.textContent = brezOlja ? t("mk.noOil") : oljeBrezPotrebe ? t("mk.oilNotNeeded") : "";
    const utez = tem ? utezModela(m) : 0;
    bBarve.hidden = utez <= 0;
    znacka.textContent = `${oznakaPovecave(m)} · ${tem ? "TEM" : sem ? "SEM" : t("mk.badgeObjective", { m: obj.m })}`;
    const vp = vidnoPolje(m, s.nacin);
    const vrstice = [
      [t("mk.magnification"), luc ? `${obj.m}× · ${OKULAR}× = ${oznakaPovecave(m)}` : oznakaPovecave(m)],
      [t("mk.fieldOfView"), oznakaDolzine(vp)],
      [t("mk.resolution"), tem ? t("mk.temResolution") : sem ? t("mk.semResolution") : t("mk.rayleigh", { d: oznakaDolzine(locljivost(obj, s.zaslonka, s.olje)) })],
    ];
    if (luc) vrstice.push([t("mk.depthOfField"), oznakaDolzine(globinskaOstrina(obj, s.olje))]);
    if (sem) vrstice.push([t("mk.depthOfField"), oznakaDolzine(globinskaOstrinaSem(m))]);
    vrstice.push([t("mk.whatYouSee"), imeRavni(raven(m, s.nacin))]);
    tabela.replaceChildren(...vrstice.flatMap(([a, b]) => [mk("dt", "", a), mk("dd", "", b)]));
    resnica.textContent = sem
      ? t("mk.truth.sem")
      : !tem
      ? m >= 1000
        ? t("mk.truth.light")
        : ""
      : utez > 0
        ? (prep?.snovi?.[18] || prep?.snovi?.[4]) && /kost|zob/.test(prep.id)
          ? t("mk.truth.crystal")
          : t("mk.truth.model")
        : t("mk.truth.tem");
    resnica.hidden = !resnica.textContent;
  }

  // ---------- preparat ----------
  let ciljPorabljen = false; // cilj velja le za prvi preparat
  // snov ultrastrukture → snov tkiva, v kateri leži (S_* iz glsl.js): jedrce in kromatin v jedru, organeli v citoplazmi
  const GOSTITELJ = { 28: [2], 27: [2], 20: [1], 21: [1], 22: [1], 26: [1], 29: [1], 23: [1], 32: [1] };
  let zahteva = 0; // hitra menjava preparata: velja zadnja izbira, tudi če se prejšnja datoteka naloži pozneje
  async function izberiPreparat(id, { zacetek = true } = {}) {
    const moja = ++zahteva;
    brezSS = false;
    molM = 0;
    const p = await naloziPreparat(id);
    if (!p || !zivo || moja !== zahteva) return;
    nalaganje.hidden = false;
    h1.textContent = p.ime;
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    if (!zivo || moja !== zahteva) return;
    const velja = () => zivo && moja === zahteva;
    try {
      await upo.nastaviPreparat(p, velja);
    } catch (e) {
      nalaganje.hidden = true;
      if (!velja()) return; // mikroskop zaprt ali izbran drug preparat med prevajanjem
      throw e;
    }
    if (!velja()) return;
    prep = p;
    nalaganje.hidden = true;
    if (zacetek) {
      s = { ...ZACETNO, grobi: 0, fini: 0, dzObj: 0, zarnica: s.zarnica ?? ZACETNO.zarnica, barve: s.barve };
      s.sredisce = [...(p.zacetek?.sredisce || [0, 0])];
      rocno = false;
      const c = cilj && !ciljPorabljen ? cilj : null;
      ciljPorabljen = true;
      const m0 = Math.min(MAX_M, Math.max(MIN_M, c?.m || p.zacetek?.m || 40));
      if (m0 > SVETLOBNI_MAX) {
        s.nacin = "tem";
        s.m = m0;
      } else {
        s.objektiv = Math.max(0, OBJEKTIVI.findIndex((o) => o.m * OKULAR >= m0));
        s.m = OBJEKTIVI[s.objektiv].m * OKULAR;
      }
      s.olje = s.objektiv === OBJEKTIVI.length - 1;
      samodejnaLucka();
      if (c?.snov?.length) {
        // kazalec na izbrani del celice (organel): najbližje mesto s to snovjo, iskanje v vedno večjih krogih
        // pri svetlobnem mikroskopu velja snov tkiva (vakuola, jedro, stena), pri TEM snov ultrastrukture (jedrce, mitohondrij)
        const ustreza = (o) => c.snov.includes(Math.round(m0 > SVETLOBNI_MAX ? o.snov : o.snovT));
        const o = upo.sonda([s.sredisce]);
        const rMax = Math.max(...(p.velikost || [2000]));
        rokIskanja = performance.now() + 250; // iskanje bere GPE: na počasnem telefonu največ ~¼ s
        if (o && !ustreza(o[0])) {
          // drobne dele (jedrce, mitohondrij) najprej poišči v njihovem gostitelju (jedro, citoplazma), nato natančno v njem
          const [x0, y0] = s.sredisce;
          const gost = m0 > SVETLOBNI_MAX ? GOSTITELJ[c.snov[0]] : null;
          const vGostu = gost && poisci(x0, y0, (x) => gost.includes(Math.round(x.snovT)), 0.5, 1.3, rMax);
          const blizu = vGostu ? [...s.sredisce] : null;
          const najden = (vGostu && poisci(blizu[0], blizu[1], ustreza, 0.02, 1.2, 25)) || poisci(x0, y0, ustreza, Math.max(0.02, 0.003 * vidnoPolje(s.m, s.nacin)), 1.3, rMax);
          if (!najden) {
            if (blizu) s.sredisce = blizu; // vsaj v gostitelju (jedro, citoplazma)
            else kTkivu();
          }
        }
        rokIskanja = Infinity;
        rocno = true; // ob prehodu na TEM ostane na tem delu, ne skoči na značilno snov preparata
      } else kTkivu(); // igla naj na začetku kaže na celico, ne na prazno stekelce
      dGrobi.nastavi(0);
      dFini.nastavi(0);
      dDefokus.nastavi(0);
      s.dz = 0;
    }
    const b = BARVANJA[p.barvanje] || BARVANJA.he;
    opis.textContent = p.opis || "";
    barvanje.replaceChildren(mk("b", "", `${t("mk.staining")} `), `${b.ime}. ${b.opis}`);
    naloga.replaceChildren(mk("b", "", `${t("mk.find")} `), p.isci || "");
    naloga.hidden = !p.isci;
    obPreparatu?.(p.id);
    narisi();
  }

  // ---------- premikanje, povečava, dotik ----------
  const kazalci = new Map();
  let zacetekPinch = null;
  let premaknil = false;
  platno.addEventListener("pointerdown", (e) => {
    platno.setPointerCapture?.(e.pointerId);
    kazalci.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY });
    premaknil = false;
    if (kazalci.size === 2) {
      const [a, b] = [...kazalci.values()];
      zacetekPinch = { d: Math.hypot(a.x - b.x, a.y - b.y), m: povecava(s), korak: 1 };
    }
  });
  platno.addEventListener("pointermove", (e) => {
    const k = kazalci.get(e.pointerId);
    if (!k) {
      if (e.pointerType === "mouse") pokaziOznako(e.clientX, e.clientY, true);
      return;
    }
    const dx = e.clientX - k.x, dy = e.clientY - k.y;
    k.x = e.clientX;
    k.y = e.clientY;
    if (Math.hypot(e.clientX - k.x0, e.clientY - k.y0) > 6) premaknil = true;
    if (kazalci.size === 2 && zacetekPinch) {
      const [a, b] = [...kazalci.values()];
      const f = Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, zacetekPinch.d);
      interakcija = 1;
      if (zvezno() || zacetekPinch.m * f > SVETLOBNI_MAX * 1.05) nastaviPovecavo(zacetekPinch.m * f);
      else if (f > zacetekPinch.korak * 1.6) {
        zacetekPinch.korak *= 1.6;
        zoom(2);
      } else if (f < zacetekPinch.korak / 1.6) {
        zacetekPinch.korak /= 1.6;
        zoom(0.5);
      }
      return;
    }
    if (!zadnji || kazalci.size !== 1) return;
    const kk = zadnji.vp / zadnji.css;
    s.sredisce = [s.sredisce[0] - dx * kk, s.sredisce[1] + dy * kk];
    rocno = true;
    interakcija = 1;
    oznaka.hidden = true;
    narisi();
  });
  const konec = (e) => {
    const k = kazalci.get(e.pointerId);
    kazalci.delete(e.pointerId);
    if (kazalci.size < 2) zacetekPinch = null;
    if (k && !premaknil && e.type === "pointerup" && e.pointerType !== "mouse") pokaziOznako(e.clientX, e.clientY, false);
  };
  platno.addEventListener("pointerup", konec);
  platno.addEventListener("pointercancel", konec);
  platno.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") oznaka.hidden = true;
  });
  let kolesce = 0;
  platno.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (zvezno()) {
        interakcija = 1;
        const f = Math.exp(-omeji(e.deltaY, -120, 120) * 0.004);
        if (s.nacin === "tem" && f < 1 && s.m * f < SVETLOBNI_MAX * 1.05) return izberiObjektiv(OBJEKTIVI.length - 1);
        return nastaviPovecavo(s.m * f);
      }
      kolesce += e.deltaY;
      if (Math.abs(kolesce) > 80) {
        zoom(kolesce < 0 ? 2 : 0.5);
        kolesce = 0;
      }
    },
    { passive: false },
  );
  platno.addEventListener("keydown", (e) => {
    if (!zadnji) return;
    const k = zadnji.vp * 0.1;
    const smeri = { ArrowLeft: [-k, 0], ArrowRight: [k, 0], ArrowUp: [0, k], ArrowDown: [0, -k] };
    if (smeri[e.key]) {
      e.preventDefault();
      s.sredisce = [s.sredisce[0] + smeri[e.key][0], s.sredisce[1] + smeri[e.key][1]];
      rocno = true;
      narisi();
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoom(zvezno() ? 1.5 : 2);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoom(zvezno() ? 1 / 1.5 : 0.5);
    }
  });
  const ro = new ResizeObserver(() => narisi());
  ro.observe(oder);

  await izberiPreparat(PREPARATI.some((p) => p.id === preparat) ? preparat : ZACETNI);

  return {
    izberiPreparat,
    get stanje() {
      return { ...s, preparat: prep?.id };
    },
    nastavi(nov) {
      Object.assign(s, nov);
      narisi();
    },
    unici() {
      zivo = false;
      ro.disconnect();
      clearTimeout(polnaPozneje);
      upo.unici();
      el.replaceChildren();
    },
  };
}

// Pogon simulacij »lab-mikroskop« (public/sim/index.js): mikroskop v lekciji ali laboratoriju.
export function simMikroskop(el, opts = {}) {
  el.__mikroskop?.unici?.();
  el.__mikroskop = null;
  const gen = (el.__mikroskopGen = (el.__mikroskopGen || 0) + 1);
  const naloga = document.createElement("p");
  naloga.className = "demo-try";
  const napis = document.createElement("b");
  napis.textContent = t("sc.try");
  naloga.append(napis, " ", t("mk.tryText"));
  const box = document.createElement("div");
  el.append(naloga, box);
  odpriMikroskop(box, { preparat: opts.preparat || null, vLekciji: true })
    // »Ponastavi« pred koncem nalaganja: ta mikroskop je že zamenjan, zato ga takoj uničimo (kontekst WebGL)
    .then((m) => (el.__mikroskopGen === gen ? (el.__mikroskop = m) : m.unici()))
    .catch((err) => {
    console.error("Mikroskop:", err);
    box.textContent = t("mk.loadError");
  });
}
