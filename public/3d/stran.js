// Stran /3d: zbirka modelov in usmerjanje po naslovu (#atlas, #<id modela>?nadzor=vrednost). Ob odhodu z modela se
// prizor uniči (pomnilnik grafične kartice), modeli ostanejo v predpomnilniku service workerja za brez povezave.
import { t, applyI18n } from "/i18n.js";
import { icon } from "/icons.js";
import { seznamModelov, naloziModel } from "./modeli.js";

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
function nazaj() {
  if (history.state?.k3Iz === "hub") history.back();
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

async function zbirka() {
  document.title = t("a3.hubTitle");
  const box = mk("div", "k3-hub");
  const vrh = mk("header", "k3-hub-vrh");
  if (!vAplikaciji) {
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
  box.append(vrh);
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
  box.append(z);
  glavni.replaceChildren(box);
  const modeli = await seznamModelov();
  const podrocja = new Map();
  for (const m of modeli) {
    if (!podrocja.has(m.podrocje)) podrocja.set(m.podrocje, []);
    podrocja.get(m.podrocje).push(m);
  }
  for (const [p, seznam] of podrocja) {
    const s = mk("section", "k3-podrocje");
    s.append(mk("h2", "", t(`a3.area.${p}`)));
    const mreza = mk("div", "k3-mreza");
    for (const m of seznam) {
      const a = mk("a", "k3-kartica");
      a.href = `#${encodeURIComponent(m.id)}`;
      a.addEventListener("click", izZbirke);
      a.append(mk("small", "k3-nadnaslov", predmet(m.predmet)), mk("b", "", m.naslov));
      if (m.opis) a.append(mk("small", "", m.opis));
      mreza.append(a);
    }
    s.append(mreza);
    box.append(s);
  }
  return null;
}

async function atlas(param, moj) {
  document.title = t("a3.title");
  const host = mk("div", "");
  glavni.replaceChildren(host);
  const { odpriAtlas } = await import("./atlas.js");
  if (moj !== zaporedje) return null;
  const a = await odpriAtlas(host, { zapri: nazaj });
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
    b.href = "#";
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
  const nas = mk("div", "");
  nas.append(mk("p", "k3-nadnaslov", `${t(`a3.area.${mod.info.podrocje}`)} · 3D`), mk("h1", "", mod.info.naslov));
  vrh.append(b, nas);
  const telo = mk("div", "k3-model-telo");
  const mount = mk("div", "");
  telo.append(mount);
  box.append(vrh, telo);
  glavni.replaceChildren(box);
  const { odpriModel } = await import("./pregledovalnik.js");
  if (moj !== zaporedje) return null;
  return odpriModel(mount, mod, { zacetek: param });
}

async function usmeri() {
  const moj = ++zaporedje;
  try {
    aktivno?.unici?.();
  } catch {}
  aktivno = null;
  const { id, param } = razberi();
  try {
    if (!id) aktivno = await zbirka();
    else if (id === "atlas") aktivno = await atlas(param, moj);
    else aktivno = await model(id, param, moj);
  } catch (err) {
    console.error("3D:", err);
    if (moj !== zaporedje) return;
    const p = mk("div", "k3-napaka");
    p.append(mk("p", "", t(err?.koda === "webgl" ? "a3.noWebgl" : "a3.loadError")));
    const b = mk("a", "a3-pill");
    b.href = "#";
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
