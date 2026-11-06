// »Uči se → 3D svet« (j, 6. 11. 2026): mreža slik namesto seznama kartic. Zgoraj lepljivo iskalno polje in čipi predmetov
// (ostaneta vidna med drsenjem), vrstica »Nadaljuj«, nato mreža ploščic s sličico modela (public/3d/slicice, brez WebGL).
// Iskanje je takojšnje in išče tudi po delih modela in sinonimih (public/3d/iskalnik.json, sinonimi.json): zadetek pokaže
// ujemajoči del, dotik pa odpre model naravnost na njem (open3d(id, naslov, { del })). Čista logika iskanja: 3d/iskanje.js.
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { seznamModelov, seznamDatotek } from "./3d/modeli.js";
import { isciPloscice, zadnjiModel, paramDela, NEDAVNO } from "./3d/iskanje.js";

const IKONE = { atlas: "bone", celice: "droplet", organi: "heart", sistemi: "activity", kemija: "atom", fizika: "zap", matematika: "box", vesolje: "globe", procesi: "refresh-cw" };
const tr = (k, fallback) => {
  const s = t(k);
  return s === k ? fallback : s;
};
const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const json = (url) =>
  fetch(new URL(url, import.meta.url).href)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

const hrefOd = (id, param) => `/3d#${encodeURIComponent(id)}${param ? `?${new URLSearchParams(param)}` : ""}`;

/** Nariše zavihek v `box`. deps: { mine (predmet učenca), open (id, naslov, param) }. */
export async function render3d(box, { mine = "", open }) {
  let modeli;
  let datoteke;
  try {
    [modeli, datoteke] = await Promise.all([seznamModelov(), seznamDatotek()]);
  } catch {
    box.replaceChildren(mk("p", "muted", t("a3.loadError")));
    return;
  }
  const slicice = new Set(datoteke.slicice || []);
  const predmetIme = (p) => tr(`subj.${p}`, p);
  const ploscice = [
    { id: "atlas", naslov: t("a3.title"), opis: t("a3.hubAtlas"), podrocje: "atlas", predmet: "BIO", sinonimi: [], deli: [] },
    ...modeli.map((m) => ({ id: m.id, naslov: m.naslov, opis: m.opis || "", podrocje: m.podrocje, predmet: m.predmet, sinonimi: [], deli: [] })),
  ];
  for (const p of ploscice) {
    p.podrocjeIme = p.podrocje === "atlas" ? t("a3.uci.atlas") : tr(`a3.area.${p.podrocje}`, p.podrocje);
    p.predmetIme = predmetIme(p.predmet);
  }
  // Učenčev predmet najprej; atlas je biologija (brez znanega predmeta je prvi). Ostalo ostane v vrstnem redu zbirke.
  const moj = (p) => (mine && p.predmet === mine ? 0 : !mine && p.id === "atlas" ? 0 : 1);
  ploscice.sort((a, b) => moj(a) - moj(b));
  const red = new Map(ploscice.map((p, i) => [p.id, i]));

  const vrh = mk("div", "u3-vrh");
  const polje = mk("label", "u3-iskanje");
  polje.insertAdjacentHTML("afterbegin", icon("search"));
  const vnos = mk("input", "");
  vnos.type = "search";
  vnos.enterKeyHint = "search";
  vnos.autocomplete = "off";
  vnos.spellcheck = false;
  vnos.autocapitalize = "off";
  vnos.placeholder = t("a3.uci.search");
  vnos.setAttribute("aria-label", t("a3.uci.search"));
  polje.append(vnos);
  const cipi = mk("div", "u3-cipi");
  cipi.setAttribute("role", "group");
  cipi.setAttribute("aria-label", t("a3.areas"));
  vrh.append(polje, cipi);

  const nadaljuj = mk("a", "u3-nadaljuj");
  nadaljuj.hidden = true;
  const stevilo = mk("p", "u3-stevilo muted");
  stevilo.setAttribute("role", "status");
  const mreza = mk("ul", "u3-mreza");
  const prazno = mk("div", "u3-prazno");
  prazno.hidden = true;
  box.replaceChildren(vrh, nadaljuj, stevilo, mreza, prazno);

  // Čipi: Vse, področja (najprej predmet učenca), Atlas. Filtrirajo mrežo; iskanje išče znotraj izbranega čipa.
  const podrocja = [...new Set(ploscice.filter((p) => p.id !== "atlas").map((p) => p.podrocje))];
  const jeMoje = (p) => ploscice.some((x) => x.podrocje === p && mine && x.predmet === mine);
  podrocja.sort((a, b) => Number(jeMoje(b)) - Number(jeMoje(a)));
  const izbire = ["vse", ...podrocja, "atlas"];
  let izbrano = "vse";
  for (const p of izbire) {
    const b = mk("button", "u3-cip", p === "vse" ? t("a3.all") : p === "atlas" ? t("a3.uci.atlas") : tr(`a3.area.${p}`, p));
    b.type = "button";
    b.dataset.p = p;
    b.setAttribute("aria-pressed", String(p === izbrano));
    b.addEventListener("click", () => {
      izbrano = p;
      for (const c of cipi.children) c.setAttribute("aria-pressed", String(c.dataset.p === p));
      narisi();
    });
    cipi.append(b);
  }

  const ikona = (p) => icon(IKONE[p.podrocje] || "box");
  const plosca = (p, del) => {
    const li = mk("li", `u3-ploscica${p.id === "atlas" ? " u3-atlas" : ""}${mine && p.predmet === mine ? " mine" : ""}`);
    const param = paramDela(del);
    const a = mk("a", "u3-p");
    a.href = hrefOd(p.id, param);
    a.dataset.k3 = p.id;
    const sl = mk("span", "u3-slika");
    if (slicice.has(p.id)) {
      const img = mk("img", "");
      img.alt = ""; // ime je pod sličico v isti povezavi: bralnik ga prebere enkrat
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 560;
      img.height = 350;
      img.src = `/3d/slicice/${encodeURIComponent(p.id)}.webp`;
      img.addEventListener("error", () => {
        img.remove();
        sl.insertAdjacentHTML("beforeend", ikona(p));
      });
      sl.append(img);
    } else sl.insertAdjacentHTML("beforeend", ikona(p));
    a.append(sl, mk("b", "u3-ime", p.naslov));
    a.lastChild.setAttribute("dir", "auto");
    a.append(mk("small", "u3-oznaka", p.predmetIme));
    if (del) {
      const d = mk("small", "u3-del");
      d.append(`${t("a3.uci.part")}: `);
      const ime = mk("b", "", del[0]);
      ime.setAttribute("dir", "auto");
      d.append(ime);
      a.append(d);
    }
    const ime = del ? `${p.naslov}: ${del[0]}` : p.naslov;
    a.addEventListener("click", (e) => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // nov zavihek ostane navaden
      e.preventDefault();
      open(p.id, ime, param);
    });
    li.append(a);
    return li;
  };

  function narisi() {
    const q = vnos.value.trim();
    const sez = ploscice.filter((p) => izbrano === "vse" || p.podrocje === izbrano);
    const zadetki = q ? isciPloscice(sez, q, { red: (p) => red.get(p.id) }) : sez.map((p) => ({ p, del: null }));
    mreza.replaceChildren(...zadetki.map(({ p, del }) => plosca(p, del)));
    mreza.hidden = !zadetki.length;
    stevilo.textContent = q ? (zadetki.length ? t("a3.results", { n: zadetki.length }) : "") : "";
    stevilo.hidden = !q || !zadetki.length;
    nadaljuj.hidden = !!q || izbrano !== "vse" || !nadaljuj.href;
    prazno.hidden = !!zadetki.length;
    if (!zadetki.length) pokaziPrazno(q);
  }
  function pokaziPrazno(q) {
    prazno.replaceChildren(mk("b", "", t("a3.uci.none")), mk("p", "muted", q ? t("a3.noModels", { q }) : ""));
    const pred = mk("div", "u3-predlogi");
    pred.append(mk("span", "muted", t("a3.uci.try")));
    for (const id of ["atlas", "celica-zivalska", "organ-srce", "telesa"]) {
      const p = ploscice.find((x) => x.id === id);
      if (!p) continue;
      const b = mk("button", "u3-cip", p.naslov);
      b.type = "button";
      b.addEventListener("click", () => {
        izbrano = "vse";
        for (const c of cipi.children) c.setAttribute("aria-pressed", String(c.dataset.p === "vse"));
        vnos.value = p.naslov;
        narisi();
      });
      pred.append(b);
    }
    const vse = mk("button", "u3-cip u3-vse", t("a3.uci.showAll"));
    vse.type = "button";
    vse.addEventListener("click", () => {
      vnos.value = "";
      izbrano = "vse";
      for (const c of cipi.children) c.setAttribute("aria-pressed", String(c.dataset.p === "vse"));
      narisi();
      vnos.focus();
    });
    pred.append(vse);
    prazno.append(pred);
  }
  vnos.addEventListener("input", narisi);
  vnos.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && vnos.value) {
      e.preventDefault();
      e.stopPropagation();
      vnos.value = "";
      narisi();
    }
  });

  // Nadaljuj: zadnji odprti model te naprave (le če obstaja in je še v zbirki).
  const zadnji = zadnjiModel(ploscice.map((p) => p.id), () => localStorage.getItem(NEDAVNO));
  const pz = ploscice.find((p) => p.id === zadnji);
  if (pz) {
    nadaljuj.href = hrefOd(pz.id);
    nadaljuj.append(mk("span", "u3-nad-ic"), mk("span", "u3-nad-txt"));
    nadaljuj.firstChild.innerHTML = icon("play");
    nadaljuj.lastChild.append(mk("small", "", t("a3.uci.continue")), mk("b", "", pz.naslov));
    nadaljuj.lastChild.lastChild.setAttribute("dir", "auto");
    nadaljuj.addEventListener("click", (e) => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(pz.id, pz.naslov, null);
    });
  }
  narisi();

  // Kazalo delov in sinonimi (iskanje po delih): naložita se po izrisu; iskanje deluje že na naslovih in opisih.
  Promise.all([json("./3d/iskalnik.json"), json("./3d/sinonimi.json")]).then(([k, sin]) => {
    if (!box.isConnected) return;
    for (const p of ploscice) {
      if (k?.modeli?.[p.id]) p.deli = k.modeli[p.id];
      if (sin?.[p.id]) p.sinonimi = sin[p.id];
    }
    const at = ploscice.find((p) => p.id === "atlas");
    if (at && k?.atlas) at.deli = k.atlas.map(([id, ime, la]) => [ime, "izberi", id, la]);
    if (vnos.value.trim()) narisi();
  });
}
