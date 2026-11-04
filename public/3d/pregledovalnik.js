// Splošni pregledovalnik 3D modelov, zgrajenih v kodi (pogodba v docs/3d.md): prizor iz scena.js, deli z barvnimi
// točkami in seznamom gumbov (tipkovnica: Tab do seznama, Enter izbere), nadzor iz `nadzor` (drsnik, izbira, gumb,
// stikalo, izpis), merilo iz `merilo`, »Ponastavi«, predvajaj/ustavi, ko ima model `korak`. Uporabljata ga stran /3d
// in pogon simulacij »3d-<id>« v lekcijah (public/3d/sim.js).
import { THREE, ustvariSceno, kakovostNaprave, gibanje } from "./scena.js";
import { t } from "/i18n.js";
import { icon } from "/icons.js";

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
  const orodja = mk("div", "k3-orodja");
  const spodaj = mk("div", "k3-spodaj");
  const nadzorEl = mk("div", "k3-nadzor");
  const deliEl = mk("div", "k3-deli");
  deliEl.setAttribute("role", "group");
  deliEl.setAttribute("aria-label", t("a3.parts"));
  spodaj.append(nadzorEl, deliEl);
  el.append(oder, spodaj);
  // Esc prekliče izbiro dela (šele naslednji Esc gre na strani /3d nazaj na zbirko).
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !izbran || e.defaultPrevented) return;
    e.preventDefault();
    izberi(null);
  });

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
  orodja.append(btnTeci, btnPonastavi);

  function nastaviTek(on) {
    tece = on;
    btnTeci.innerHTML = icon(on ? "pause" : "play");
    btnTeci.setAttribute("aria-label", t(on ? "a3.pause" : "a3.play"));
    btnTeci.title = t(on ? "a3.pause" : "a3.play");
    btnTeci.setAttribute("aria-pressed", String(on));
    kit?.narisi();
  }

  const svetovnaTocka = (d) => (v) => {
    v.set(...(d.tocka || [0, 0, 0]));
    return model?.group ? model.group.localToWorld(v) : v;
  };

  // Izbrani del: rahel modri sij na njegovih mrežah (kopije materialov, izvirniki ostanejo).
  const sij = new Map(); // mesh → izvirni material
  function obarvaj(d) {
    for (const [m, mat] of sij) m.material = mat;
    sij.clear();
    if (!d) return;
    for (const m of d.meshes || []) {
      if (!m?.material) continue;
      sij.set(m, m.material);
      const kopija = (Array.isArray(m.material) ? m.material : [m.material]).map((x) => {
        const c = x.clone();
        if (c.emissive) {
          c.emissive = new THREE.Color(d.barva || "#6E9BFF");
          c.emissiveIntensity = 0.28;
        }
        return c;
      });
      m.material = Array.isArray(m.material) ? kopija : kopija[0];
    }
  }

  // hit = { object, instanceId, point } iz tapa (null iz seznama delov); model.izberi lahko vrne drug del (npr. element
  // v InstancedMesh). preklopi: ponoven tap na izbrani del izbiro prekliče.
  function izberi(id, { leti = true, hit = null, preklopi = false } = {}) {
    let cilj = id;
    if ((id || hit) && typeof model?.izberi === "function") {
      try {
        const r = model.izberi(id, hit);
        if (typeof r === "string") cilj = r;
      } catch (err) {
        console.error("3D izberi", err);
      }
    }
    if (preklopi && cilj && cilj === izbran) cilj = null;
    const d = (model?.deli || []).find((x) => x.id === cilj) || null;
    izbran = d ? d.id : null;
    obarvaj(d);
    kit.izbranaTocka(izbran);
    deliEl.querySelectorAll("[data-del]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.del === izbran)));
    if (!d) {
      kit.pokaziOznako(null);
      return;
    }
    const v = svetovnaTocka(d)(new THREE.Vector3());
    kit.pokaziOznako(d.id, d.ime, d.opis, v);
    if (leti && model.postavitev === "organ") {
      // Organ: ista smer pogleda, le rahlo bližje k točki (organ ostane v kadru, točka ostane vidna).
      const [c, r] = zacetniOkvir();
      kit.poleti(c.lerp(v, 0.35), r * 0.8);
    } else if (leti) {
      // Prelet: proti točki, a celica ostane v kadru (polmer 0,6 namesto celega modela).
      const smer = v.clone().sub(model.group.getWorldPosition(new THREE.Vector3()));
      kit.poleti(v.clone().multiplyScalar(0.5), 0.75, smer.lengthSq() > 1e-6 ? { smer: smer.add(kit.camera.position.clone().normalize().multiplyScalar(1.5)) } : {});
    }
  }

  function deli() {
    const seznam = Array.isArray(model?.deli) ? model.deli : [];
    zadnjiDeli = [...seznam];
    deliEl.replaceChildren();
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
    deliEl.hidden = !seznam.length;
    kit.nastaviTocke(
      seznam.filter((d) => Array.isArray(d.tocka) && !d.skrijTocko).map((d) => ({ id: d.id, ime: d.ime, barva: d.barva, pos: svetovnaTocka(d) })),
      { ob: (id) => izberi(id === izbran ? null : id), zakriva: () => (model?.group ? [model.group] : []) },
    );
    if (izbran && !seznam.some((d) => d.id === izbran)) izberi(null, { leti: false });
  }

  const merilo = () => {
    const m = model && "merilo" in model && model.merilo !== undefined ? (typeof model.merilo === "function" ? model.merilo() : model.merilo) : info.merilo;
    kit.nastaviMerilo(m || null, 2);
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
        try {
          c.ob?.(v);
        } catch (err) {
          console.error("3D nadzor", c.id, err);
        }
        poSpremembi();
        if (c.ponastaviPogled) kit.poleti(...zacetniOkvir(), { smer: zacetnaSmer(), trajanje: 0.7 });
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
          const sel = mk("select", "k3-izbor");
          sel.setAttribute("aria-label", c.oznaka);
          for (const [k, ime] of c.moznosti) {
            const o = mk("option", "", ime);
            o.value = String(k);
            sel.append(o);
          }
          sel.value = String(c.vrednost);
          const si = { c, zadnja: c.vrednost, nastavi: (v) => (sel.value = String(v)) };
          sinh.push(si);
          sel.addEventListener("change", () => {
            const k = c.moznosti.find(([x]) => String(x) === sel.value)?.[0];
            if (k === undefined) return;
            c.vrednost = si.zadnja = k;
            klic(k);
          });
          box.append(sel);
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
    sij.clear();
    try {
      model?.dispose?.();
    } catch {}
    if (model?.group) kit?.scene.remove(model.group);
    if (!kit) {
      kit = ustvariSceno(oder, { kakovost: opts.kakovost, oznaka: info.naslov, ponastavi: () => zgradiVse(true) });
      oder.append(orodja);
      kit.naTap((ndc) => {
        if (!model?.group) return;
        const hit = kit.zadetki(ndc, [model.group])[0];
        if (!hit) return izberi(null);
        const d = (model.deli || []).find((x) => (x.meshes || []).some((m) => m === hit.object || m === hit.object.parent));
        izberi(d?.id ?? null, { hit: { object: hit.object, instanceId: hit.instanceId ?? null, point: hit.point.clone() }, preklopi: true });
      });
      pocisti.push(
        kit.naKorak((dt) => {
          cas += dt;
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
            if (typeof model?.merilo === "function") merilo();
          }
          if (!model?.korak || !tece) return false;
          try {
            model.korak(cas, dt);
          } catch (err) {
            console.error("3D korak", err);
            tece = false;
          }
          return true;
        }),
      );
      if (kit.kakovost === "visoka") kit.pripraviAO(0.3);
    }
    const moj = ++gradnja;
    const ctx = {
      kakovost: kit.kakovost,
      gibanje: kit.gibanje,
      zacetek: { ...zacetek },
      t,
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
    else if (nadzorEl.parentNode !== spodaj) spodaj.prepend(nadzorEl);
    if (model.group) kit.scene.add(model.group);
    kit.nastaviLuci(model.luci !== false);
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
    btnTeci.hidden = typeof model.korak !== "function";
    nastaviTek(typeof model.korak === "function" && kit.gibanje);
    cas = 0;
    nadzor();
    deli();
    merilo();
    kit.pokaziOznako(null);
    podrobnostiGumb();
    if (typeof model.ao === "function") kit.nastaviAO(model.ao() !== false);
    if (ponastavi || !opts.ohraniPogled) {
      kit.controls.minDistance = 0.4;
      kit.controls.maxDistance = 12;
      const leti = () => kit.poleti(...zacetniOkvir(), { smer: zacetnaSmer(), trajanje: ponastavi ? 0.6 : 0 });
      leti();
      // Postavitev »organ« spremeni višino odra šele ob naslednji postavitvi strani (ResizeObserver): kader ponovimo,
      // da organ pade v ožji zorni kot (pokončen telefon).
      if (model.postavitev === "organ" && !ponastavi) requestAnimationFrame(() => requestAnimationFrame(() => !unicen && model === m && leti()));
    }
    kit.narisi();
  }

  zgradiVse(false);
  return {
    get kit() {
      return kit;
    },
    get model() {
      return model;
    },
    izberi,
    unici() {
      for (const f of pocisti) f();
      unicen = true;
      try {
        model?.dispose?.();
      } catch {}
      kit?.unici();
      el.replaceChildren();
    },
  };
}

export { kakovostNaprave, gibanje };
