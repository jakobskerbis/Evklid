// Virtualni mikroskop (docs/mikroskop.md): svetlobni mikroskop s štirimi objektivi (4×, 10×, 40×, 100× z oljem), grobim
// in finim vijakom, lučko in zaslonko, nad 1000× presevni elektronski mikroskop (TEM) do 50 000 000× (j, 12. 11. 2026),
// pri največjih povečavah model molekul in atomov. Odpre ga stran /3d (#mikroskop?p=<id>, gumb »Poglej z mikroskopom«
// pri tkivih 3D sveta) in laboratorij (pogon simulacij »lab-mikroskop«). Besedila vsebine so slovenska kot pri 3D modelih.
import { ustvariUpodobitev } from "./upodobi.js";
import { izracunajPogled, ZACETNO, povecava } from "./pogled.js";
import { OBJEKTIVI, OKULAR, MIN_M, SVETLOBNI_MAX, MAX_M, vidnoPolje, locljivost, globinskaOstrina, merilce, oznakaDolzine, oznakaPovecave, utezModela, raven } from "./optika.js";
import { BARVANJA } from "./barvila.js";
import { PREPARATI, SKUPINE, ZACETNI, naloziPreparat } from "./preparati/index.js";
import { t } from "/i18n.js";
import { icon as ikona } from "/icons.js";

const CSS = ["/3d/3d.css", "/mikroskop/mikroskop.css"];

const SNOVI = {
  0: "prazen prostor (stekelce)", 1: "citoplazma", 2: "jedro", 3: "kolagenska vlakna", 4: "mineral (hidroksiapatit)", 5: "eritrocit",
  6: "maščoba", 7: "miofibrile", 8: "mielinska ovojnica", 9: "zunajcelični matriks", 10: "keratin", 11: "celična stena",
  12: "vakuola", 13: "koloid", 14: "krvna plazma", 15: "elastična vlakna", 16: "sluz", 17: "virus", 18: "sklenina",
  20: "mitohondrij", 21: "endoplazemski retikulum", 22: "ribosomi", 23: "glikogen", 24: "membrana (fosfolipidni dvosloj)",
  25: "kloroplast", 26: "zrnce (mešiček)", 27: "kromosomi", 28: "jedrce", 29: "Golgijev aparat", 30: "mikrovili",
};
const CELICE = {
  0: "celica", 1: "jetrna celica (hepatocit)", 2: "fibroblast", 3: "limfocit", 4: "nevron", 5: "žlezna celica", 6: "rastlinska celica",
  7: "bakterija", 8: "celica z migetalkami", 9: "ploščata epitelna celica", 10: "celica glije", 11: "kvasovka", 12: "pražival",
  13: "gladka mišična celica", 14: "maščobna celica", 15: "levkocit", 16: "mišično vlakno", 17: "živčni izrastki",
  18: "fotoreceptor (paličnica ali čepnica)",
};
const RAVNI = {
  tkivo: "tkivo", celice: "celice", "celice-blizu": "celice in jedra", organeli: "organeli", membrane: "membrane in makromolekule",
  molekule: "molekule (model)", atomi: "atomi (model)",
};

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

export async function odpriMikroskop(el, { preparat = null, zapri = null, obPreparatu = null, vLekciji = false } = {}) {
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
  bIzberi.innerHTML = `${ikona("layers")}<span>Preparati</span>`;
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
  const nalaganje = mk("div", "mk-nalaganje", "Pripravljam preparat …");
  // 100× brez olja: gumb kar na odru, da ga na telefonu ni treba iskati pod sliko
  const bKapni = mk("button", "a3-pill mk-kapni");
  bKapni.type = "button";
  bKapni.hidden = true;
  oder.append(platno, igla, oznaka, merilo, znacka, bKapni, nalaganje);
  const kazalec = mk("p", "mk-kazalec");
  kazalec.setAttribute("aria-live", "polite");

  const plosca = mk("div", "mk-plosca");
  telo.append(mk("div", "mk-levo"), plosca);
  telo.firstChild.append(oder, kazalec);
  el.append(vrh, telo);

  // ---------- stanje ----------
  let upo;
  try {
    upo = ustvariUpodobitev(platno);
  } catch (e) {
    bIzberi.hidden = true; // glava z gumbom Nazaj ostane
    el.replaceChildren(vrh, mk("p", "k3-napaka", t(e?.koda === "webgl" ? "a3.noWebgl" : "a3.loadError")));
    return { unici() {} };
  }
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
  const secPov = sekcija("Povečava");
  const revolver = mk("div", "mk-revolver");
  revolver.setAttribute("role", "group");
  revolver.setAttribute("aria-label", "Objektiv");
  const gumbiObj = OBJEKTIVI.map((o, i) => {
    const b = mk("button", "a3-pill mk-obj");
    b.type = "button";
    b.innerHTML = `<b>${o.m}×</b><small>${o.olje ? "olje" : `NA ${dec(o.na)}`}</small>`;
    b.addEventListener("click", () => izberiObjektiv(i));
    revolver.append(b);
    return b;
  });
  const bTem = mk("button", "a3-pill mk-obj mk-tem");
  bTem.type = "button";
  bTem.innerHTML = "<b>TEM</b><small>elektroni</small>";
  bTem.addEventListener("click", () => {
    if (s.nacin !== "tem") nastaviPovecavo(Math.max(5000, povecava(s) * 5));
  });
  revolver.append(bTem);
  const logMin = Math.log(MIN_M), logMax = Math.log(MAX_M);
  const dPov = drsnik("Skupna povečava", {
    min: 0, max: 1, vrednost: 0,
    prikaz: (u) => oznakaPovecave(Math.exp(logMin + u * (logMax - logMin))),
    ob: (u) => nastaviPovecavo(Math.exp(logMin + u * (logMax - logMin)), { izDrsnika: true }),
  });
  secPov.append(revolver, dPov.el);

  const secLuc = sekcija("Svetlobni mikroskop");
  const dGrobi = drsnik("Grobi vijak", { min: -150, max: 150, vrednost: 0, prikaz: (v) => `${dec(v)} µm`, ob: (v) => ((s.grobi = v), nastaviOstrino()) });
  const dFini = drsnik("Fini vijak", { min: -8, max: 8, vrednost: 0, prikaz: (v) => `${dec(v)} µm`, ob: (v) => ((s.fini = v), nastaviOstrino()) });
  const dLucka = drsnik("Lučka", { min: 0, max: 1, vrednost: s.zarnica, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zarnica = v), narisi()) });
  const dZaslonka = drsnik("Zaslonka", { min: 0.05, max: 1, vrednost: s.zaslonka, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zaslonka = v), narisi()) });
  const vrstaOlje = mk("div", "mk-vrsta");
  const bOlje = mk("button", "a3-pill mk-stikalo");
  bOlje.type = "button";
  bOlje.setAttribute("aria-pressed", "false");
  bOlje.innerHTML = `${ikona("droplet")}<span>Imerzijsko olje</span>`;
  bOlje.addEventListener("click", () => {
    s.olje = !s.olje;
    narisi();
  });
  bKapni.innerHTML = `${ikona("droplet")}<span>Kapni imerzijsko olje</span>`;
  bKapni.addEventListener("click", () => {
    s.olje = true;
    narisi();
  });
  const bIzostri = mk("button", "a3-pill");
  bIzostri.type = "button";
  bIzostri.innerHTML = `${ikona("focus")}<span>Izostri</span>`;
  bIzostri.title = "Fini in grobi vijak nastavi na ostrino";
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

  const secTem = sekcija("Elektronski mikroskop (TEM)");
  const dDefokus = drsnik("Defokus", { min: -1, max: 1, vrednost: 0, prikaz: (v) => dec(v), ob: (v) => ((s.defokus = v), narisi()) });
  const dSvetlost = drsnik("Snop elektronov", { min: 0, max: 1, vrednost: s.zarnica, prikaz: (v) => `${dec(v * 100)} %`, ob: (v) => ((s.zarnica = v), narisi()) });
  const bBarve = mk("button", "a3-pill mk-stikalo");
  bBarve.type = "button";
  bBarve.innerHTML = `${ikona("sun")}<span>Model v barvah</span>`;
  bBarve.addEventListener("click", () => {
    s.barve = !s.barve;
    narisi();
  });
  secTem.append(dDefokus.el, dSvetlost.el, bBarve);

  const secPodatki = sekcija(null);
  const tabela = mk("dl", "mk-podatki");
  const resnica = mk("p", "mk-resnica");
  secPodatki.append(tabela, resnica);

  const secInfo = sekcija("O preparatu");
  const opis = mk("p", "mk-opis");
  const barvanje = mk("p", "mk-barvanje");
  const naloga = mk("p", "mk-naloga");
  secInfo.append(opis, barvanje, naloga);

  // ---------- izbirnik preparatov ----------
  const izbirnik = mk("div", "mk-izbirnik");
  izbirnik.hidden = true;
  izbirnik.setAttribute("role", "dialog");
  izbirnik.setAttribute("aria-modal", "true");
  izbirnik.setAttribute("aria-label", "Preparati");
  const izbOkno = mk("div", "mk-izb-okno");
  izbOkno.tabIndex = -1; // klik na prazno v oknu obdrži fokus v izbirniku, da Esc zapre izbirnik in ne mikroskopa (stran.js)
  const izbVrh = mk("div", "mk-izb-vrh");
  const iskanje = mk("input", "mk-iskanje");
  iskanje.type = "search";
  iskanje.placeholder = "Išči preparat";
  iskanje.setAttribute("aria-label", "Išči preparat");
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
    for (const [sk, ime] of SKUPINE) {
      const v = PREPARATI.filter((p) => p.skupina === sk && (!q || norm(p.ime).includes(q)));
      if (!v.length) continue;
      izbSeznam.append(mk("h3", "mk-izb-skupina", ime));
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
    if (s.nacin === "tem") {
      s.nacin = "svetloba";
    } else if (i !== s.objektiv) {
      s.dzObj += OBJEKTIVI[i].parfokal - prej.parfokal;
    }
    s.objektiv = i;
    s.m = OBJEKTIVI[i].m * OKULAR;
    nastaviOstrino();
  }
  function nastaviPovecavo(m, { izDrsnika = false } = {}) {
    m = omeji(m, MIN_M, MAX_M);
    if (m > SVETLOBNI_MAX * 1.05) {
      if (s.nacin !== "tem") kTkivu();
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
  function kTkivu() {
    if (!prep) return;
    const [x0, y0] = s.sredisce;
    const prazno = (o) => Math.round(o.snovT) === 0;
    const c = upo.sonda([s.sredisce]);
    if (!c || !prazno(c[0])) return;
    for (const r of [3, 6, 12, 24, 48, 96]) {
      const tocke = Array.from({ length: 8 }, (_, i) => [x0 + r * Math.cos((i * Math.PI) / 4), y0 + r * Math.sin((i * Math.PI) / 4)]);
      const o = upo.sonda(tocke);
      const i = o?.findIndex((t) => !prazno(t)) ?? -1;
      if (i >= 0) {
        s.sredisce = tocke[i];
        return;
      }
    }
  }
  const zoom = (f) => {
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
    const pokrij = s.nacin === "tem";
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
  let polnaPozneje = 0;
  function izrisi() {
    cakaIzris = false;
    if (!zivo || !prep) return;
    const { css, N, n } = velikost();
    const hitro = interakcija > 0;
    const nn = hitro ? Math.max(160, Math.round(n * 0.6)) : n;
    const r = izracunajPogled(upo, prep, s, nn, { hitro });
    r.v.zaslonN = N;
    r.v.cas = performance.now() / 1000;
    upo.narisi(r.v);
    zadnji = { vp: r.vp, css, m: r.m, mol: r.mol };
    posodobiMerilo();
    if (hitro) {
      clearTimeout(polnaPozneje);
      polnaPozneje = setTimeout(() => {
        interakcija = 0;
        narisi();
      }, 160);
    } else posodobiKazalec();
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
    if (tem && snovU >= 20 && snovU !== snovT) ime = `${SNOVI[snovU]} · ${celica}`;
    else if (vCelici) ime = snovT === 1 ? celica : `${imeSnovi(snovT)} · ${celica}`;
    else ime = imeSnovi(snovT) || celica;
    return ime.charAt(0).toUpperCase() + ime.slice(1);
  }
  function posodobiKazalec() {
    if (!prep || !zadnji) return;
    const ime = imeTocke(s.sredisce);
    const rv = raven(zadnji.m, s.nacin);
    kazalec.textContent = ime ? `${s.nacin === "tem" ? "Na sredini" : "Kazalec"}: ${ime}` : "";
    platno.setAttribute("aria-label", `${prep.ime}, ${oznakaPovecave(zadnji.m)}, ${RAVNI[rv] || rv}. ${kazalec.textContent}`);
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
    const m = povecava(s);
    gumbiObj.forEach((b, i) => b.setAttribute("aria-pressed", String(!tem && i === s.objektiv)));
    bTem.setAttribute("aria-pressed", String(tem));
    if (!brezDrsnika) dPov.nastavi((Math.log(m) - logMin) / (logMax - logMin));
    secLuc.hidden = tem;
    secTem.hidden = !tem;
    oder.classList.toggle("mk-tem", tem);
    igla.hidden = tem;
    bOlje.setAttribute("aria-pressed", String(s.olje));
    bBarve.setAttribute("aria-pressed", String(s.barve));
    const obj = OBJEKTIVI[s.objektiv];
    const brezOlja = !tem && obj.olje && !s.olje;
    const oljeBrezPotrebe = !tem && !obj.olje && s.olje;
    opozorilo.hidden = !brezOlja && !oljeBrezPotrebe;
    bKapni.hidden = !brezOlja;
    opozorilo.textContent = brezOlja
      ? "Objektiv 100× potrebuje kapljico imerzijskega olja med lečo in krovnim stekelcem. Brez olja je slika temnejša in mehka."
      : oljeBrezPotrebe
        ? "Olje uporabljaš samo s 100× objektivom. Pri drugih objektivih ga obriši z leče in stekelca."
        : "";
    const utez = tem ? utezModela(m) : 0;
    bBarve.hidden = utez <= 0;
    znacka.textContent = `${oznakaPovecave(m)}${tem ? " · TEM" : ` · objektiv ${obj.m}×`}`;
    const vp = vidnoPolje(m, s.nacin);
    const vrstice = [
      ["Povečava", tem ? oznakaPovecave(m) : `${obj.m}× · ${OKULAR}× = ${oznakaPovecave(m)}`],
      ["Vidno polje", oznakaDolzine(vp)],
      ["Ločljivost", tem ? "≈ 1,5 nm (omejuje jo rezina)" : `${oznakaDolzine(locljivost(obj, s.zaslonka, s.olje))} (Rayleigh)`],
    ];
    if (!tem) vrstice.push(["Globinska ostrina", oznakaDolzine(globinskaOstrina(obj, s.olje))]);
    vrstice.push(["Kaj vidiš", RAVNI[raven(m, s.nacin)] || ""]);
    tabela.replaceChildren(...vrstice.flatMap(([a, b]) => [mk("dt", "", a), mk("dd", "", b)]));
    resnica.textContent = !tem
      ? m >= 1000
        ? "Svetlobni mikroskop ne loči podrobnosti, manjših od približno 0,2 µm (polovica valovne dolžine svetlobe). Za večje povečave preklopi na elektronski mikroskop."
        : ""
      : utez > 0
        ? (prep?.snovi?.[18] || prep?.snovi?.[4]) && /kost|zob/.test(prep.id)
          ? "Od tu naprej je slika model. Kristale hidroksiapatita v kosti in sklenini visokoločljivi TEM res pokaže do vrst atomov, molekul v mehkem tkivu pa ne. Barve atomov so dogovorjene: O rdeča, Ca zelena, P oranžna, H bela."
          : "Od tu naprej je slika model. V biološki rezini TEM ne loči posameznih molekul in atomov: rezina, kovinsko barvilo in poškodbe z elektroni omejijo ločljivost na 1–2 nm. Barve so dogovorjene (atomi: C siva, O rdeča, N modra, H bela, P oranžna)."
        : "Elektronski mikroskop: slika je črno-bela, ker elektroni nimajo barve. Rezina je 70 nm tanka in kontrastirana s težkimi kovinami (uran, svinec), zato so membrane temne.";
    resnica.hidden = !resnica.textContent;
  }

  // ---------- preparat ----------
  let zahteva = 0; // hitra menjava preparata: velja zadnja izbira, tudi če se prejšnja datoteka naloži pozneje
  async function izberiPreparat(id, { zacetek = true } = {}) {
    const moja = ++zahteva;
    const p = await naloziPreparat(id);
    if (!p || !zivo || moja !== zahteva) return;
    nalaganje.hidden = false;
    h1.textContent = p.ime;
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    if (!zivo || moja !== zahteva) return;
    upo.nastaviPreparat(p);
    prep = p;
    nalaganje.hidden = true;
    if (zacetek) {
      s = { ...ZACETNO, grobi: 0, fini: 0, dzObj: 0, zarnica: s.zarnica ?? ZACETNO.zarnica, barve: s.barve };
      s.sredisce = [...(p.zacetek?.sredisce || [0, 0])];
      const m0 = p.zacetek?.m || 40;
      if (m0 > SVETLOBNI_MAX) {
        s.nacin = "tem";
        s.m = m0;
      } else {
        s.objektiv = Math.max(0, OBJEKTIVI.findIndex((o) => o.m * OKULAR >= m0));
        s.m = OBJEKTIVI[s.objektiv].m * OKULAR;
      }
      s.olje = s.objektiv === OBJEKTIVI.length - 1;
      kTkivu(); // igla naj na začetku kaže na celico, ne na prazno stekelce
      dGrobi.nastavi(0);
      dFini.nastavi(0);
      dDefokus.nastavi(0);
      s.dz = 0;
    }
    const b = BARVANJA[p.barvanje] || BARVANJA.he;
    opis.textContent = p.opis || "";
    barvanje.replaceChildren(mk("b", "", "Barvanje: "), `${b.ime}. ${b.opis}`);
    naloga.replaceChildren(mk("b", "", "Poišči: "), p.isci || "");
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
      if (s.nacin === "tem" || zacetekPinch.m * f > SVETLOBNI_MAX * 1.05) nastaviPovecavo(zacetekPinch.m * f);
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
      if (s.nacin === "tem") {
        interakcija = 1;
        const f = Math.exp(-omeji(e.deltaY, -120, 120) * 0.004);
        if (f < 1 && s.m * f < SVETLOBNI_MAX * 1.05) return izberiObjektiv(OBJEKTIVI.length - 1);
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
      narisi();
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoom(s.nacin === "tem" ? 1.5 : 2);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoom(s.nacin === "tem" ? 1 / 1.5 : 0.5);
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
  naloga.innerHTML =
    "<b>Preizkusi:</b> začni z objektivom 4×, poišči celico in jo s potegom postavi pod iglo. Preklopi na 10× in 40× ter izostri s finim vijakom. Pri 100× kapni olje, nato preklopi na TEM in povečuj do molekul in atomov.";
  const box = document.createElement("div");
  el.append(naloga, box);
  odpriMikroskop(box, { preparat: opts.preparat || null, vLekciji: true })
    // »Ponastavi« pred koncem nalaganja: ta mikroskop je že zamenjan, zato ga takoj uničimo (kontekst WebGL)
    .then((m) => (el.__mikroskopGen === gen ? (el.__mikroskop = m) : m.unici()))
    .catch((err) => {
    console.error("Mikroskop:", err);
    box.textContent = "Mikroskopa ni bilo mogoče naložiti.";
  });
}
