// Stran /3d: zbirka modelov in usmerjanje po naslovu (#atlas, #<id modela>?nadzor=vrednost). Ob odhodu z modela se
// prizor uniči (pomnilnik grafične kartice), modeli ostanejo v predpomnilniku service workerja za brez povezave.
import { t, applyI18n } from "/i18n.js";
import { icon } from "/icons.js";
import { seznamModelov, naloziModel, seznamDatotek } from "./modeli.js";
import { najdi } from "./iskanje.js";
import { vgrajeno, starsu } from "./vgrajeno.js";

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
  // Odprta izbira dela ima svoj vnos v zgodovini (public/3d/izbira.js): gumb Nazaj ga najprej vzame (izbira se zapre),
  // nato gre naprej na zbirko.
  if (history.state?.k3Izbira) {
    addEventListener("popstate", () => nazaj(), { once: true });
    history.back();
    return;
  }
  if (history.state?.k3Iz) history.back(); // z zbirke ("hub") ali iz organa (»Poglej pod povečavo«, "povecava")
  else if (vgrajeno) starsu({ tip: "zapri3d" });
  else location.hash = "";
}
// Povezava z zbirke: oznako »prišel z zbirke« dobi nov vnos v zgodovini (pushState), da nazaj() ve, da sme nazaj.
// Hashchange se ob pushState ne sproži, zato usmerimo sami. Srednji klik ali Ctrl ostane navaden (nov zavihek).
function izZbirke(e) {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  history.pushState({ k3Iz: "hub" }, "", e.currentTarget.getAttribute("href"));
  usmeri();
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

// Področja v izbirniku zbirke: »telo« združi atlas, organe in organske sisteme; ikona za kartico brez sličice.
const TELO = ["organi", "sistemi"];
const IKONE = { telo: "bone", celice: "droplet", organi: "heart", sistemi: "activity", kemija: "atom", fizika: "zap", matematika: "box", vesolje: "globe", procesi: "refresh-cw" };
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
// Pomnjenje mesta na zbirki: ob vrnitvi z modela (Nazaj) se stran odpre na istem mestu.
let pomik = 0;

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

  // Iskanje in področja: lepljiva vrstica na vrhu (ostane vidna med pomikanjem).
  const orodja = mk("div", "k3-hub-orodja");
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
  const cipi = mk("div", "k3-cipi");
  cipi.setAttribute("role", "group");
  cipi.setAttribute("aria-label", t("a3.areas"));
  orodja.append(isk, cipi);
  const vsebina = mk("div", "k3-hub-vsebina");
  box.append(vrh, orodja, vsebina);
  glavni.replaceChildren(box);

  const modeli = (await seznamModelov()).map((m) => ({ ...m, podrocjeIme: t(`a3.area.${m.podrocje}`) }));
  const slicice = new Set((await seznamDatotek()).slicice || []);
  if (!box.isConnected) return null; // medtem odprt model ali atlas: ne prepišemo njegovega aktivno (pomik, unici)
  const podrocja = new Map();
  for (const m of modeli) {
    if (!podrocja.has(m.podrocje)) podrocja.set(m.podrocje, []);
    podrocja.get(m.podrocje).push(m);
  }
  const izbire = ["vse", "telo", ...[...podrocja.keys()].filter((p) => !TELO.includes(p))];
  let izbrano = izbire.includes(param.p) ? param.p : "vse";

  // Stanje v naslovu (#?p=celice&q=…), da Nazaj z modela vrne isto zbirko; zamenjava, ne nov vnos v zgodovini.
  const shrani = () => {
    const q = vnos.value.trim();
    const u = new URLSearchParams();
    if (izbrano !== "vse") u.set("p", izbrano);
    if (q) u.set("q", q);
    const h = u.toString() ? `#?${u}` : location.pathname + location.search;
    history.replaceState(history.state, "", h);
  };

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
  const mreza = (seznam, opts) => {
    const g = mk("div", "k3-mreza");
    for (const m of seznam) g.append(kartica(m, opts));
    return g;
  };
  // Polica: vodoravna vrsta kartic (vsa področja na enem zaslonu); »Pokaži vse« izbere področje.
  const polica = (naslov, seznam, { p = null, nadnaslov = false } = {}) => {
    const s = mk("section", "k3-podrocje");
    const glava = mk("div", "k3-podrocje-glava");
    const h = mk("h2", "", naslov);
    if (p) h.append(mk("span", "k3-stevec", String(seznam.length)));
    glava.append(h);
    if (p && seznam.length > 1) {
      const b = mk("button", "k3-vec");
      b.type = "button";
      b.innerHTML = `<span></span>${icon("chevron-right")}`;
      b.firstChild.textContent = t("a3.seeAll");
      b.addEventListener("click", () => izberi(p, true));
      glava.append(b);
    }
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

  function narisi() {
    const q = vnos.value.trim();
    const deli = [];
    if (q) {
      const atlasZadetek = najdi([{ id: "atlas", naslov: t("a3.title"), opis: `${t("a3.hubAtlas")} ${t("a3.area.telo")}`, podrocjeIme: "" }], q).length > 0;
      const zadetki = najdi(modeli.filter((m) => izbrano === "vse" || m.podrocje === izbrano || (izbrano === "telo" && TELO.includes(m.podrocje))), q);
      const n = zadetki.length + (atlasZadetek && (izbrano === "vse" || izbrano === "telo") ? 1 : 0);
      deli.push(mk("p", "k3-zadetki", n ? t("a3.results", { n }) : t("a3.noModels", { q })));
      if (atlasZadetek && (izbrano === "vse" || izbrano === "telo")) deli.push(atlasKartica());
      if (zadetki.length) deli.push(mreza(zadetki, { nadnaslov: true }));
    } else if (izbrano === "vse") {
      deli.push(atlasKartica());
      const vsi = new Map(modeli.map((m) => [m.id, m]));
      const nedavni = (beri(NEDAVNO, []) || []).map((id) => vsi.get(id)).filter(Boolean);
      if (nedavni.length) deli.push(polica(t("a3.recent"), nedavni, { nadnaslov: true }));
      for (const [p, seznam] of podrocja) deli.push(polica(t(`a3.area.${p}`), seznam, { p: TELO.includes(p) ? "telo" : p }));
    } else if (izbrano === "telo") {
      deli.push(atlasKartica());
      for (const p of TELO) {
        if (!podrocja.has(p)) continue;
        const s = mk("section", "k3-podrocje");
        s.append(mk("h2", "", t(`a3.area.${p}`)), mreza(podrocja.get(p)));
        deli.push(s);
      }
    } else {
      deli.push(mreza(podrocja.get(izbrano) || []));
    }
    vsebina.replaceChildren(...deli);
  }

  function izberi(p, naVrh) {
    izbrano = p;
    for (const b of cipi.children) b.setAttribute("aria-pressed", String(b.dataset.p === p));
    shrani();
    narisi();
    if (naVrh) glavni.scrollTo({ top: 0 });
    cipi.querySelector(`[data-p="${p}"]`)?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }
  for (const p of izbire) {
    const b = mk("button", "k3-cip");
    b.type = "button";
    b.dataset.p = p;
    b.setAttribute("aria-pressed", String(p === izbrano));
    const n = p === "vse" ? null : p === "telo" ? 1 + TELO.reduce((s, x) => s + (podrocja.get(x)?.length || 0), 0) : podrocja.get(p).length;
    b.append(mk("span", "", p === "vse" ? t("a3.all") : t(`a3.area.${p}`)));
    if (n) b.append(mk("small", "", String(n)));
    b.addEventListener("click", () => izberi(p, true));
    cipi.append(b);
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
  // Vrnitev z modela: isto mesto na zbirki (sicer vrh).
  const nazajNa = pomik; // rAF teče po spodnji ponastavitvi, zato vrednost vzamemo zdaj
  if (nazajNa) requestAnimationFrame(() => glavni.scrollTo({ top: nazajNa }));
  pomik = 0;
  return {
    unici() {
      pomik = glavni.scrollTop;
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
  const a = await odpriAtlas(host, { zapri: nazaj, zgodovina: true });
  if (moj !== zaporedje) {
    a.unici();
    return null;
  }
  if (param.izberi) a.izberiIzSeznama(param.izberi);
  window.__atlas = a; // za preizkuse (scripts/posnetki-3d.cjs)
  return a;
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
    // vnos odprte izbire dela zamenjamo: Nazaj s povečave vrne naravnost na organ (brez praznega koraka)
    if (history.state?.k3Izbira) history.replaceState({ k3Iz: "povecava" }, "", `#${encodeURIComponent(cilj)}`);
    else history.pushState({ k3Iz: "povecava" }, "", `#${encodeURIComponent(cilj)}`);
    usmeri();
  };
  return odpriModel(mount, mod, { zacetek: param, stran: true, povecava, zgodovina: true });
}

async function usmeri() {
  const moj = ++zaporedje;
  try {
    aktivno?.unici?.();
  } catch {}
  aktivno = null;
  const { id, param } = razberi();
  try {
    const r = !id ? await zbirka(param) : id === "atlas" ? await atlas(param, moj) : await model(id, param, moj);
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
  if (e.key !== "Escape" || e.defaultPrevented || !razberi().id) return;
  if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
  e.preventDefault();
  nazaj();
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
