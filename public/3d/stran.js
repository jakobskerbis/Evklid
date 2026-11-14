// Stran /3d: zbirka modelov in usmerjanje po naslovu (#atlas, #<id modela>?nadzor=vrednost). Ob odhodu z modela se
// prizor uniči (pomnilnik grafične kartice), modeli ostanejo v predpomnilniku service workerja za brez povezave.
import { t, applyI18n } from "/i18n.js";
import { icon } from "/icons.js";
import { seznamModelov, naloziModel, seznamDatotek } from "./modeli.js";
import { najdi } from "./iskanje.js";
import { vgrajeno, starsu } from "./vgrajeno.js";
import { preparatModela, pogledDela } from "/mikroskop/mapa.js";
import { DREVO, BARVE, poPoti, modeliVeje, vsiModeliDrevesa, ikonaVeje, slogIkon } from "./drevo.js";

const glavni = document.getElementById("k3-glavni");
const vAplikaciji = !!window.ReactNativeWebView;
let aktivno = null;
let zaporedje = 0;

const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const PREDMETI = { BIO: "subj.BIO", KEM: "subj.KEM", FIZ: "subj.FIZ", MAT: "subj.MAT", NAR: "subj.NAR" };
const predmet = (p) => {
  const k = PREDMETI[p];
  const s = k ? t(k) : p;
  return s === k ? p : s;
};

function razberi() {
  let h = location.hash.slice(1);
  try {
    h = decodeURIComponent(h);
  } catch {} // pokvarjen naslov (%E0%A4): id ne obstaja, stran pokaže »ne obstaja«
  const [id, q = ""] = h.split("?");
  return { id, param: Object.fromEntries(new URLSearchParams(q)) };
}

// Nazaj na zbirko: če smo prišli z nje, z zgodovino (tipka Nazaj ostane naravna), sicer zamenjamo naslov.
// V okvirju aplikacije (3D svet v »Uči se«) je zbirka aplikacija sama: okvir se zapre.
function nazaj() {
  if (history.state?.k3Iz) history.back(); // z zbirke ("hub") ali iz organa (»Poglej pod povečavo«, "povecava")
  else if (vgrajeno) starsu({ tip: "zapri3d" });
  else location.hash = "";
}
// Povezava z zbirke: oznako »prišel z zbirke« dobi nov vnos v zgodovini (pushState), da nazaj() ve, da sme nazaj.
// Hashchange se ob pushState ne sproži, zato usmerimo sami. Srednji klik ali Ctrl ostane navaden (nov zavihek).
// »Poglej z mikroskopom« (atlas, model, zbirka): nov vnos v zgodovini, da Nazaj vrne tja, od koder smo prišli.
// p: id preparata ali { p, m, snov, tocka } (mapa.js pogledDela: povečava in snov, na katero naj kaže kazalec).
function odpriMikroskop(p) {
  const c = typeof p === "string" ? { p } : p || {};
  const q = new URLSearchParams();
  if (c.p) q.set("p", c.p);
  if (c.m) q.set("m", String(c.m));
  if (c.snov?.length) q.set("s", c.snov.join(","));
  if (c.tocka) q.set("t", c.tocka);
  const qs = q.toString();
  history.pushState({ k3Iz: "mikroskop" }, "", `#mikroskop${qs ? `?${qs}` : ""}`);
  usmeri();
}

function izZbirke(e) {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  // Mesto na zbirki shranimo v njen vnos v zgodovini: Nazaj (z modela ali iz podveje) vrne na isto mesto.
  history.replaceState({ ...history.state, pomik: glavni.scrollTop }, "");
  history.pushState({ k3Iz: "hub" }, "", e.currentTarget.getAttribute("href"));
  usmeri();
}
// Naslov zbirke na veji v (»biologija/telo«) z iskanjem q; prazno = koren (ohrani ?vgrajeno ipd.).
function naslovZbirke(v, q = "") {
  const u = new URLSearchParams();
  if (v) u.set("v", v);
  if (q) u.set("q", q);
  return u.toString() ? `#?${u}` : location.pathname + location.search;
}

// Gumb »3D svet« ob napaki (model ne obstaja, ni WebGL): na zbirko, v okvirju aplikacije pa zapre okvir (zbirka v
// okvirju nima poti nazaj, Esc tam ne deluje).
function naZbirko(b) {
  b.href = "#";
  if (vgrajeno)
    b.addEventListener("click", (e) => {
      e.preventDefault();
      starsu({ tip: "zapri3d" });
    });
}

// Ikona področja za kartico modela brez sličice.
const IKONE = { celice: "droplet", organi: "heart", sistemi: "activity", kemija: "atom", fizika: "zap", matematika: "box", vesolje: "globe", procesi: "refresh-cw" };
const NEDAVNO = "evklid.3d.nedavno"; // zadnji odprti modeli (id, največ 8), samo v tej napravi
const beri = (k, privzeto) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? privzeto;
  } catch {
    return privzeto;
  }
};
function zapomni(id) {
  try {
    const prej = beri(NEDAVNO, []);
    const zdaj = [id, ...(Array.isArray(prej) ? prej : []).filter((x) => x !== id && typeof x === "string")].slice(0, 8);
    localStorage.setItem(NEDAVNO, JSON.stringify(zdaj));
  } catch {}
}
// Slog aplikacije (theme.js shrani nastavitve v »evklid.theme«; /3d ga ne naloži): nabor ikon vej drevesa.
const slogAplikacije = () => slogIkon(beri("evklid.theme", {})?.style);

async function zbirka(param) {
  document.title = t("a3.hubTitle");
  const box = mk("div", "k3-hub");
  const vrh = mk("header", "k3-hub-vrh");
  if (!vAplikaciji && !vgrajeno) {
    const b = mk("a", "a3-krog");
    b.href = "/";
    b.innerHTML = icon("arrow-left");
    b.setAttribute("aria-label", t("a3.backToApp"));
    b.title = t("a3.backToApp");
    vrh.append(b);
  }
  const nas = mk("div", "");
  nas.append(mk("h1", "", t("a3.hubTitle")), mk("p", "", t("a3.hubSub")));
  vrh.append(nas);

  // Iskanje in mikroskop: lepljiva vrstica na vrhu (ostane vidna med pomikanjem).
  const orodja = mk("div", "k3-hub-orodja");
  const vrsta = mk("div", "k3-hub-iskanje");
  const isk = mk("label", "k3-iskalnik");
  isk.innerHTML = icon("search");
  const vnos = mk("input", "");
  vnos.type = "search";
  vnos.enterKeyHint = "search";
  vnos.autocomplete = "off";
  vnos.spellcheck = false;
  vnos.autocapitalize = "off";
  vnos.placeholder = t("a3.searchModels");
  vnos.setAttribute("aria-label", t("a3.searchModels"));
  vnos.value = param.q || "";
  isk.append(vnos);
  // Mikroskop (j, 12. 11. 2026): svetlobni in elektronski, vsi preparati; gumb ob iskanju (osnutek drevesa).
  const mkGumb = mk("a", "k3-krog k3-hub-mikroskop");
  mkGumb.href = "#mikroskop";
  mkGumb.innerHTML = icon("microscope");
  mkGumb.setAttribute("aria-label", t("mk.start"));
  mkGumb.title = t("mk.start");
  mkGumb.addEventListener("click", izZbirke);
  vrsta.append(isk, mkGumb);
  const potNav = mk("nav", "k3-drevo-pot");
  potNav.setAttribute("aria-label", t("a3.treePath"));
  orodja.append(vrsta, potNav);
  const vsebina = mk("div", "k3-hub-vsebina");
  box.append(vrh, orodja, vsebina);
  glavni.replaceChildren(box);

  const modeli = (await seznamModelov()).map((m) => ({ ...m, podrocjeIme: t(`a3.area.${m.podrocje}`) }));
  const slicice = new Set((await seznamDatotek()).slicice || []);
  if (!box.isConnected) return null; // medtem odprt model ali atlas: ne prepišemo njegovega aktivno (pomik, unici)
  const poId = new Map(modeli.map((m) => [m.id, m]));
  const obstaja = new Set([...poId.keys(), "atlas"]);
  const veje = poPoti(param.v);
  // Veja brez modelov (strežnik nekega področja nima): pokažemo najbližjo višjo, ki jih ima.
  while (veje.length && !modeliVeje(veje[veje.length - 1], obstaja).length) veje.pop();
  const potId = veje.map((v) => v.id).join("/");
  // Stanje v naslovu (#?v=biologija/telo&q=…), da Nazaj z modela vrne isto vejo; iskanje naslov zamenja.
  if (potId !== (param.v || "")) history.replaceState(history.state, "", naslovZbirke(potId, param.q || ""));
  const shrani = () => history.replaceState(history.state, "", naslovZbirke(potId, vnos.value.trim()));

  const kartica = (m, { nadnaslov = false } = {}) => {
    const a = mk("a", "k3-kartica");
    a.href = `#${encodeURIComponent(m.id)}`;
    a.addEventListener("click", izZbirke);
    const sl = mk("span", "k3-slicica");
    sl.setAttribute("aria-hidden", "true");
    if (slicice.has(m.id)) {
      const img = mk("img", "");
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.src = `/3d/slicice/${encodeURIComponent(m.id)}.webp`;
      img.addEventListener("error", () => {
        img.remove();
        sl.innerHTML = icon(IKONE[m.podrocje] || "box");
      });
      sl.append(img);
    } else sl.innerHTML = icon(IKONE[m.podrocje] || "box");
    const bes = mk("span", "k3-kartica-besedilo");
    if (nadnaslov) bes.append(mk("small", "k3-nadnaslov", m.podrocjeIme));
    bes.append(mk("b", "", m.naslov));
    if (m.opis) bes.append(mk("small", "k3-kartica-opis", m.opis));
    a.append(sl, bes);
    return a;
  };
  const atlasKartica = () => {
    const z = mk("a", "k3-zvezda");
    z.href = "#atlas";
    z.addEventListener("click", izZbirke);
    const ic = mk("span", "k3-zvezda-ic");
    ic.innerHTML = icon("bone");
    const besedilo = mk("div", "");
    besedilo.append(mk("p", "k3-nadnaslov", t("a3.eyebrow")), mk("h2", "", t("a3.title")), mk("p", "", t("a3.hubAtlas")));
    const oznake = mk("div", "k3-zvezda-oznake");
    for (const k of ["okostje", "misice", "organi", "zile", "zivcevje"]) oznake.append(mk("span", "", t(`a3.l.${k}`)));
    const odpri = mk("span", "a3-pill a3-glavni");
    odpri.innerHTML = `${icon("box")}<span>${t("a3.open")}</span>`;
    z.append(ic, besedilo, oznake, odpri);
    if (slicice.has("atlas")) {
      const img = mk("img", "k3-zvezda-slika");
      img.alt = "";
      img.src = "/3d/slicice/atlas.webp";
      img.addEventListener("error", () => img.remove());
      z.append(img);
    }
    return z;
  };
  const mikroskopKartica = () => {
    const z = mk("a", "k3-zvezda k3-zvezda-mk");
    z.href = "#mikroskop";
    z.addEventListener("click", izZbirke);
    const ic = mk("span", "k3-zvezda-ic");
    ic.innerHTML = icon("microscope");
    const besedilo = mk("div", "");
    besedilo.append(mk("h2", "", t("mk.title")), mk("p", "", t("mk.hub")));
    const odpri = mk("span", "a3-pill a3-glavni");
    odpri.innerHTML = `${icon("microscope")}<span>${t("mk.start")}</span>`;
    z.append(ic, besedilo, odpri);
    return z;
  };
  const mreza = (seznam, opts) => {
    const g = mk("div", "k3-mreza");
    for (const m of seznam) g.append(kartica(m, opts));
    return g;
  };
  // Polica: vodoravna vrsta kartic (nazadnje odprto, drugi modeli).
  const polica = (naslov, seznam, { nadnaslov = false } = {}) => {
    const s = mk("section", "k3-podrocje");
    const glava = mk("div", "k3-podrocje-glava");
    glava.append(mk("h2", "", naslov));
    const vrsta = mk("div", "k3-polica");
    for (const m of seznam) vrsta.append(kartica(m, { nadnaslov }));
    // Puščici za miško (prst in sledilna ploščica vrsto potegneta sama); skriti, ko vrsta ni daljša od zaslona.
    const ovoj = mk("div", "k3-polica-ovoj");
    const puscica = (smer) => {
      const b = mk("button", `k3-krog k3-polica-gumb ${smer < 0 ? "levo" : "desno"}`);
      b.type = "button";
      b.tabIndex = -1; // tipkovnica gre po karticah, puščici sta samo za miško
      b.innerHTML = icon(smer < 0 ? "arrow-left" : "arrow-right");
      b.setAttribute("aria-label", t(smer < 0 ? "a3.scrollLeft" : "a3.scrollRight"));
      b.title = t(smer < 0 ? "a3.scrollLeft" : "a3.scrollRight");
      // Levo/desno sta fizični strani (tudi v RTL, kjer se vrsta začne desno): gumb levo pomakne vrsto v levo.
      b.addEventListener("click", () => vrsta.scrollBy({ left: smer * vrsta.clientWidth * 0.85, behavior: "smooth" }));
      return b;
    };
    const [lb, db] = [puscica(-1), puscica(1)];
    const osvezi = () => {
      const x = Math.abs(vrsta.scrollLeft);
      const rtl = document.documentElement.dir === "rtl";
      const konec = x >= vrsta.scrollWidth - vrsta.clientWidth - 2;
      (rtl ? db : lb).hidden = x <= 2;
      (rtl ? lb : db).hidden = konec;
    };
    vrsta.addEventListener("scroll", osvezi, { passive: true });
    requestAnimationFrame(osvezi);
    new ResizeObserver(osvezi).observe(vrsta);
    ovoj.append(lb, vrsta, db);
    s.append(glava, ovoj);
    return s;
  };

  // Drevo (public/3d/drevo.js): pot zgoraj, pod njo veje kot ikone ali, na zadnji veji, modeli kot kartice.
  const skupina = veje[0]?.sk;
  const ZNAKI = { bio: "droplet", kem: "atom", fiz: "zap", mat: "box" };
  const ime = (id) => t(`a3.tree.${id}`);
  const ikone = [];
  const veja = (v) => {
    const a = mk("a", "k3-veja");
    if (v.povezava) a.href = `#${v.povezava}`;
    else a.href = naslovZbirke([potId, v.id].filter(Boolean).join("/"));
    a.addEventListener("click", izZbirke);
    a.style.setProperty("--veja", BARVE[v.sk || skupina] || BARVE.fiz);
    const ovoj = mk("span", "k3-veja-ikona");
    ovoj.setAttribute("aria-hidden", "true");
    const img = mk("img", "");
    img.alt = "";
    img.decoding = "async";
    img.width = img.height = 256;
    img.dataset.veja = v.id;
    img.src = ikonaVeje(v.id, slogAplikacije());
    // Brez povezave in ikona še ni v predpomnilniku: znak skupine namesto prazne ploščice.
    img.addEventListener("error", () => {
      img.remove();
      ovoj.insertAdjacentHTML("afterbegin", icon(ZNAKI[v.sk || skupina] || "box"));
    });
    ikone.push(img);
    ovoj.append(img);
    const n = modeliVeje(v, obstaja).length;
    if (!v.povezava && n) ovoj.append(mk("span", "k3-veja-stevec", String(n)));
    a.append(ovoj, mk("span", "k3-veja-ime", ime(v.id)));
    return a;
  };
  // Menjava sloga v nastavitvah (druga stran ali okvir aplikacije): ikone se zamenjajo brez ponovnega nalaganja.
  const obSlogu = (e) => {
    if (!box.isConnected) return removeEventListener("storage", obSlogu);
    if (e.key && e.key !== "evklid.theme") return;
    const s = slogAplikacije();
    for (const img of ikone) if (img.isConnected) img.src = ikonaVeje(img.dataset.veja, s);
  };
  addEventListener("storage", obSlogu);

  const narisiPot = () => {
    const deli = [];
    const korak = (besedilo, v) => {
      const a = mk("a", "", besedilo);
      a.href = naslovZbirke(v);
      a.addEventListener("click", izZbirke);
      return a;
    };
    if (veje.length) {
      // Korak in ločilo za njim v enem kosu: ob prelomu vrstice »›« ostane na koncu prejšnje vrstice.
      const kos = (el) => {
        const s = mk("span", "");
        s.append(el, mk("span", "k3-drevo-loc", "›"));
        return s;
      };
      deli.push(kos(korak(t("a3.hubTitle"), "")));
      veje.forEach((v, i) => {
        if (i < veje.length - 1) deli.push(kos(korak(ime(v.id), veje.slice(0, i + 1).map((x) => x.id).join("/"))));
        else {
          const b = mk("b", "k3-drevo-zdaj", ime(v.id));
          b.setAttribute("aria-current", "page");
          b.tabIndex = -1; // fokus po premiku po drevesu
          deli.push(b);
        }
      });
    }
    potNav.replaceChildren(...deli);
    potNav.hidden = !deli.length;
  };

  function narisi() {
    const q = vnos.value.trim();
    const deli = [];
    ikone.length = 0;
    if (q) {
      potNav.hidden = true;
      const atlasZadetek = najdi([{ id: "atlas", naslov: t("a3.title"), opis: `${t("a3.hubAtlas")} ${t("a3.area.telo")}`, podrocjeIme: "" }], q).length > 0;
      const zadetki = najdi(modeli, q);
      const n = zadetki.length + (atlasZadetek ? 1 : 0);
      deli.push(mk("p", "k3-zadetki", n ? t("a3.results", { n }) : t("a3.noModels", { q })));
      if (atlasZadetek) deli.push(atlasKartica());
      if (najdi([{ id: "mikroskop", naslov: t("mk.title"), opis: t("mk.hub"), podrocjeIme: "" }], q).length) deli.push(mikroskopKartica());
      if (zadetki.length) deli.push(mreza(zadetki, { nadnaslov: true }));
    } else {
      narisiPot();
      const zdaj = veje[veje.length - 1];
      if (zdaj?.modeli) {
        const g = mreza(zdaj.modeli.map((id) => poId.get(id)).filter(Boolean));
        g.classList.add("k3-veja-modeli");
        deli.push(g);
      }
      else {
        const g = mk("div", "k3-drevo");
        for (const v of zdaj ? zdaj.otroci : DREVO) if (modeliVeje(v, obstaja).length) g.append(veja(v));
        deli.push(g);
      }
      if (!zdaj) {
        const nedavni = (beri(NEDAVNO, []) || []).map((id) => poId.get(id)).filter(Boolean);
        if (nedavni.length) deli.push(polica(t("a3.recent"), nedavni, { nadnaslov: true }));
        // Model, ki ga drevo še ne pozna (nov v index.js), ostane dosegljiv.
        const vDrevesu = vsiModeliDrevesa();
        const drugi = modeli.filter((m) => !vDrevesu.has(m.id));
        if (drugi.length) deli.push(polica(t("a3.treeMore"), drugi, { nadnaslov: true }));
      }
    }
    vsebina.replaceChildren(...deli);
  }

  let zamik = 0;
  vnos.addEventListener("input", () => {
    clearTimeout(zamik);
    zamik = setTimeout(() => (shrani(), narisi()), 120);
  });
  vnos.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && vnos.value) {
      e.preventDefault();
      vnos.value = "";
      shrani();
      narisi();
    }
  });
  narisi();
  // Vrnitev (Nazaj z modela, atlasa, mikroskopa ali iz podveje): isto mesto, shranjeno v vnosu zgodovine; sicer vrh.
  const nazajNa = +history.state?.pomik || 0;
  if (nazajNa) requestAnimationFrame(() => glavni.scrollTo({ top: nazajNa }));
  else glavni.scrollTo({ top: 0 });
  // Premik naprej po drevesu: fokus na novo mesto, da tipkovnica in bralnik zaslona ne začneta na vrhu.
  if (!nazajNa && !vnos.value.trim() && history.state?.k3Iz === "hub" && (!document.activeElement || document.activeElement === document.body))
    (potNav.querySelector(".k3-drevo-zdaj") || vsebina.querySelector(".k3-veja"))?.focus({ preventScroll: true });
  return {
    unici() {
      removeEventListener("storage", obSlogu);
    },
  };
}

// Sosednja modela na istem področju (puščici v glavi modela): po vrsti iz index.js.
async function sosedi(id) {
  const vsi = await seznamModelov();
  const m = vsi.find((x) => x.id === id);
  if (!m) return null;
  const isti = vsi.filter((x) => x.podrocje === m.podrocje);
  const i = isti.indexOf(m);
  return { i, n: isti.length, prej: isti[(i - 1 + isti.length) % isti.length], potem: isti[(i + 1) % isti.length] };
}

async function atlas(param, moj) {
  document.title = t("a3.title");
  const host = mk("div", "");
  glavni.replaceChildren(host);
  const { odpriAtlas } = await import("./atlas.js");
  if (moj !== zaporedje) return null;
  const a = await odpriAtlas(host, { zapri: nazaj, mikroskop: odpriMikroskop });
  if (moj !== zaporedje) {
    a.unici();
    return null;
  }
  if (param.izberi) a.izberiIzSeznama(param.izberi);
  window.__atlas = a; // za preizkuse (scripts/posnetki-3d.cjs)
  return a;
}

async function mikroskop(param, moj) {
  document.title = t("mk.title");
  const host = mk("div", "");
  glavni.replaceChildren(host);
  const { odpriMikroskop: odpri } = await import("/mikroskop/mikroskop.js");
  if (moj !== zaporedje) return null;
  // Menjava preparata v mikroskopu: naslov se zamenja (Nazaj gre še vedno tja, od koder smo prišli).
  // Prvi preparat je tisti iz naslova: naslov ostane cel (m in s), da ponovno nalaganje ali deljena povezava pokažeta isti del.
  let prvi = param.p || null;
  const obPreparatu = (p) => {
    const isti = p === prvi;
    prvi = null;
    if (!isti) history.replaceState(history.state, "", `#mikroskop?p=${encodeURIComponent(p)}`);
  };
  const snov = String(param.s || "").split(",").filter(Boolean).map(Number).filter(Number.isFinite);
  const cilj = +param.m > 0 || snov.length ? { m: +param.m > 0 ? +param.m : null, snov, tocka: param.t || null } : null;
  const m = await odpri(host, { preparat: param.p || null, cilj, zapri: nazaj, obPreparatu });
  if (moj !== zaporedje) {
    m.unici();
    return null;
  }
  return m;
}

async function model(id, param, moj) {
  const mod = await naloziModel(id);
  if (moj !== zaporedje) return null;
  if (!mod) {
    const p = mk("div", "k3-napaka");
    p.append(mk("p", "", t("a3.notFound")));
    const b = mk("a", "a3-pill");
    naZbirko(b);
    b.textContent = t("a3.hubTitle");
    p.append(b);
    glavni.replaceChildren(p);
    return null;
  }
  document.title = mod.info.naslov;
  const box = mk("div", "k3-model");
  const vrh = mk("header", "k3-model-vrh");
  const b = mk("button", "a3-krog");
  b.type = "button";
  b.innerHTML = icon("arrow-left");
  b.setAttribute("aria-label", t("a3.back"));
  b.title = t("a3.back");
  b.addEventListener("click", nazaj);
  const nas = mk("div", "k3-model-naslov");
  nas.append(mk("p", "k3-nadnaslov", `${t(`a3.area.${mod.info.podrocje}`)} · 3D`), mk("h1", "", mod.info.naslov));
  vrh.append(b, nas);
  // Desno v glavi: prejšnji in naslednji model istega področja (brskanje brez vračanja na zbirko), cel zaslon.
  const desno = mk("div", "k3-model-desno");
  const sos = await sosedi(id);
  if (moj !== zaporedje) return null;
  if (sos && sos.n > 1) {
    const gumb = (m, smer) => {
      // Puščici (chevron) se ločita od gumba Nazaj (puščica); prejšnji je zrcaljen chevron-right.
      const a = mk("a", `a3-krog k3-sosed${smer < 0 ? " k3-zrcali" : ""}`);
      a.href = `#${encodeURIComponent(m.id)}`;
      a.innerHTML = icon("chevron-right");
      const opis = `${t(smer < 0 ? "a3.prevModel" : "a3.nextModel")}: ${m.naslov}`;
      a.setAttribute("aria-label", opis);
      a.title = opis;
      // Zamenjava naslova: Nazaj iz modela gre še vedno na zbirko (ne po vseh ogledanih modelih).
      a.addEventListener("click", (e) => {
        if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        history.replaceState(history.state, "", a.getAttribute("href"));
        usmeri();
      });
      return a;
    };
    const st = mk("span", "k3-model-stevec", t("a3.position", { i: sos.i + 1, n: sos.n }));
    desno.append(gumb(sos.prej, -1), st, gumb(sos.potem, 1));
  }
  const prepModela = preparatModela(id);
  if (prepModela) {
    const mb = mk("button", "a3-krog k3-mikroskop");
    mb.type = "button";
    mb.innerHTML = icon("microscope");
    mb.setAttribute("aria-label", t("mk.open"));
    mb.title = t("mk.open");
    mb.addEventListener("click", () => odpriMikroskop(prepModela));
    desno.append(mb);
  }
  if (document.fullscreenEnabled && !vAplikaciji && !vgrajeno) {
    const fs = mk("button", "a3-krog k3-cel-zaslon");
    fs.type = "button";
    const oznaci = () => {
      if (!fs.isConnected && fs.dataset.ok) return document.removeEventListener("fullscreenchange", oznaci);
      fs.dataset.ok = "1";
      const on = !!document.fullscreenElement;
      fs.innerHTML = icon(on ? "minimize-2" : "maximize-2");
      fs.setAttribute("aria-label", t(on ? "a3.exitFullscreen" : "a3.fullscreen"));
      fs.title = t(on ? "a3.exitFullscreen" : "a3.fullscreen");
    };
    oznaci();
    fs.addEventListener("click", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => null));
    document.addEventListener("fullscreenchange", oznaci);
    desno.append(fs);
  }
  if (desno.children.length) vrh.append(desno);
  const telo = mk("div", "k3-model-telo");
  const mount = mk("div", "");
  telo.append(mount);
  box.append(vrh, telo);
  glavni.replaceChildren(box);
  zapomni(id);
  const { odpriModel } = await import("./pregledovalnik.js");
  if (moj !== zaporedje) return null;
  // »Poglej pod povečavo« (del s `povecava`): nov vnos v zgodovini, da Nazaj (gumb, tipka, Esc) vrne na organ.
  const povecava = (cilj) => {
    history.pushState({ k3Iz: "povecava" }, "", `#${encodeURIComponent(cilj)}`);
    usmeri();
  };
  // »Poglej z mikroskopom« v oknu dela: preparat za del (organi iz GLB) ali za model.
  const mikroskop = prepModela ? { za: (delId) => pogledDela(id, delId), odpri: odpriMikroskop } : null;
  return odpriModel(mount, mod, { zacetek: param, stran: true, povecava, mikroskop });
}

async function usmeri() {
  const moj = ++zaporedje;
  try {
    aktivno?.unici?.();
  } catch {}
  aktivno = null;
  const { id, param } = razberi();
  try {
    const r = !id ? await zbirka(param) : id === "atlas" ? await atlas(param, moj) : id === "mikroskop" ? await mikroskop(param, moj) : await model(id, param, moj);
    if (moj === zaporedje) aktivno = r; // zastarela pot (medtem nov naslov) ne prepiše prizora, ki je zdaj odprt
  } catch (err) {
    console.error("3D:", err);
    if (moj !== zaporedje) return;
    const p = mk("div", "k3-napaka");
    p.append(mk("p", "", t(err?.koda === "webgl" ? "a3.noWebgl" : "a3.loadError")));
    const b = mk("a", "a3-pill");
    naZbirko(b);
    b.textContent = t("a3.hubTitle");
    p.append(b);
    glavni.replaceChildren(p);
  }
}

applyI18n?.();
document.documentElement.lang = document.documentElement.lang || "sl";
addEventListener("hashchange", usmeri);
// Esc v modelu ali atlasu: nazaj na zbirko. Na window, da pridejo najprej na vrsto atlas in pregledovalnik (zaprejo
// list, kviz ali izbiro in pokličejo preventDefault); v polju za vnos (iskanje) Esc ostane polju.
addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || e.defaultPrevented) return;
  if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
  const { id, param } = razberi();
  if (id) {
    e.preventDefault();
    nazaj();
  } else if (param.v && !param.q) {
    // Zbirka na veji: Esc gre za vejo višje (kot Nazaj na telefonu).
    e.preventDefault();
    if (history.state?.k3Iz === "hub") history.back();
    else {
      history.replaceState(history.state, "", naslovZbirke(param.v.split("/").slice(0, -1).join("/")));
      usmeri();
    }
  }
});
usmeri();

// Service worker: stran in modeli delujejo tudi brez povezave (public/sw.js shrani modele v svoj predpomnilnik).
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker
    .register("/sw.js")
    .then(async () => {
      const reg = await navigator.serviceWorker.ready;
      const urls = performance.getEntriesByType("resource").map((e) => e.name).filter((u) => !/\/3d\/modeli\/.*\.glb/.test(u)).concat(location.href.split("#")[0]);
      reg.active?.postMessage({ type: "precache", urls });
    })
    .catch(() => null);
}
