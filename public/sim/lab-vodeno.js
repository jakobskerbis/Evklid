// Vodeni poskus (načrt laboratorija, faza 1; j 25. 11. 2026 »začni zdaj«; docs/laboratorij.md »Vodeni poskus«).
// Nad kontrolami poskusa je kartica »Korak 2 od 8«: kaj naj učenec naredi, namig in obkrožena kontrola. Korak se odklene
// sam, ko stanje poskusa pokaže, da je učenec to res naredil (nastavitve, tabela meritev in dnevnik iz DOM, kot posnetek
// za inštruktorja v lab.js → stanjePoskusa), zato motorji poskusov (lab-*.js) za to nimajo nobene kode. Preklop
// »Vodeno | Prosto« je nad kartico; »Prosto« je dosedanji laboratorij. »↺ Ponastavi« (sim/index.js) poskus zgradi znova,
// zato vodenje znova začne pri prvem koraku.
import { h, segmented } from "./kit.js";
import { stanjePoskusa } from "./lab.js";
import { KORAKI, stevilo } from "./lab-vodeno-koraki.js";

export const imaVodeno = (key) => Object.hasOwn(KORAKI, key);

const besedilo = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
const nizko = (s) => String(s || "").toLocaleLowerCase("sl");

// Kontekst za `done(c)` v lab-vodeno-koraki.js: nastavitve, meritve, dnevnik od začetka vodenja, odgovorjeni sklepi.
export function kontekst(root, dnevnik) {
  const st = stanjePoskusa(root, { parametri: 60, odcitki: 0, vrstice: 500 });
  const par = new Map();
  for (const p of st.parameters) if (!par.has(nizko(p.ime))) par.set(nizko(p.ime), p.vrednost);
  const glava = (st.measurements?.stolpci || []).map((g) => g.replace(/\s+/g, " ").trim());
  const vrstice = (st.measurements?.vrstice || []).map((r) => Object.fromEntries(glava.map((g, i) => [g, r[i] ?? ""])));
  return {
    par: (ime) => par.get(nizko(ime)) ?? "",
    num: (ime) => stevilo(par.get(nizko(ime))),
    bilo: (re, vrsta) => dnevnik.some((d) => re.test(d.t) && (!vrsta || d.k === vrsta)),
    vrstice,
    // Kateri od vzorcev se ujema z najnovejšo vrstico dnevnika, ki se ujema s katerim od njih (-1: noben).
    zadnji: (...res) => {
      for (let k = dnevnik.length - 1; k >= 0; k--) {
        const i = res.findIndex((re) => re.test(dnevnik[k].t));
        if (i >= 0) return i;
      }
      return -1;
    },
    // Vprašanje »Sklep« z besedilom `re` je pravilno odgovorjeno (lab.js → conclusion).
    sklep: (re) => [...root.querySelectorAll(".lab-q")].some((q) => re.test(besedilo(q.querySelector(".lab-q-text"))) && q.querySelector(".lab-opt.ok")),
  };
}

// Kontrola, ki jo korak obkroži: gumb, stikalo ali oznaka drsnika/seznama/skupine, katere besedilo se začne s `t`.
function najdi(root, t) {
  const want = nizko(t);
  for (const el of root.querySelectorAll("button, .demo-check, .demo-slider-label, legend, [role=radiogroup][aria-label], input[aria-label]")) {
    if (el.closest(".lab-vod-wrap")) continue;
    const txt = nizko(el.matches("[aria-label]:not(button)") ? el.getAttribute("aria-label") : besedilo(el));
    if (!txt.startsWith(want)) continue;
    if (el.matches(".demo-slider-label")) return el.closest(".demo-slider, .lab-row, label") || el.parentElement;
    if (el.matches("legend")) return el.parentElement;
    return el;
  }
  return null;
}

// Priklop na nameščen poskus. `mount` je element, v katerega je mountSim narisal poskus.
// nacin: "vodeno" | "prosto"; onNacin(n) ob preklopu; onKonec() enkrat, ko so opravljeni vsi koraki.
export function vodi(mount, key, { nacin = "vodeno", onNacin, onKonec } = {}) {
  const def = KORAKI[key];
  mount?._vodi?.stop(); // isti element z novim poskusom: prejšnje vodenje se ustavi
  if (!def || !mount) return null;
  let mode = nacin === "prosto" ? "prosto" : "vodeno";
  let i = 0; // trenutni korak
  let dnevnik = []; // { t, k } vsa sporočila dnevnika od začetka vodenja
  let controls = null; // .demo-controls, v katerega je kartica vstavljena (nov element = poskus zgrajen znova)
  let shown = -1, shownMode = "", konecJavljen = false, timer = 0, sched = 0;
  const opazovani = new WeakSet();
  const cilji = new Set();

  const bar = segmented({ options: [["vodeno", "Vodeno"], ["prosto", "Prosto"]], value: mode, onChange: (v) => setMode(v) });
  bar.classList.add("lab-vod-nacin");
  bar.setAttribute("aria-label", "način poskusa");
  const card = h("section", { class: "lab-vod", "aria-label": "vodeni poskus" });
  // Bralnik zaslona ob novem koraku prebere samo »Korak 3 od 10: …«, ne cele kartice.
  const glas = h("p", { class: "lab-vod-glas", "aria-live": "polite" });
  // Obkrožena kontrola je lahko daleč pod kartico (na telefonu pod pripeto risbo): »Pokaži, kje« jo prinese v pogled.
  const kje = h("button", { type: "button", class: "ghost small lab-vod-kje" }, "Pokaži, kje ↓");
  kje.addEventListener("click", () => {
    const el = cilj();
    if (!el) return;
    // Brez gladkega drsenja: fokus spodaj sproži lab.js → pripni, ki bi gladko drsenje prekinil sredi poti.
    el.scrollIntoView({ block: "start" });
    el.querySelector?.("button, input, select")?.focus?.({ preventScroll: true });
  });
  const ui = h("div", { class: "lab-vod-wrap" }, bar, card, glas);
  const cilj = () => {
    const k = mode === "vodeno" ? def.koraki[i] : null;
    if (!k) return null;
    if (k.pokazi) return [...mount.querySelectorAll(k.pokazi)].at(-1) || null;
    return [...cilji][0] || null;
  };

  function setMode(n) {
    if (n === mode) return;
    mode = n;
    onNacin?.(n);
    render(true);
  }

  function attach() {
    const c = mount.querySelector(".lab-tit-top .demo-controls") || mount.querySelector(".demo-controls");
    if (!c) return false;
    if (c !== controls) {
      // Prvi priklop ali poskus zgrajen znova (»Ponastavi«): vodenje od začetka.
      if (controls) (i = 0), (dnevnik = []), (konecJavljen = false), (shown = -1);
      controls = c;
    }
    // Samo dnevniki (lab.js → eventLog), ne cela risba: ta se med animacijo spreminja vsako sličico.
    for (const log of mount.querySelectorAll(".lab-log")) if (!opazovani.has(log)) (opazovani.add(log), obs.observe(log, { childList: true }));
    if (ui.parentElement !== c || c.firstElementChild !== ui) c.prepend(ui);
    return true;
  }

  // Sporočila dnevnika (lab.js → eventLog hrani le zadnjih 5): vsako novo vrstico zapišemo, preden izgine.
  // Risbe se med animacijo spreminjajo vsako sličico, zato preverjanje sproži le nova vrstica dnevnika (ali klik, vnos).
  const obs = new MutationObserver((list) => {
    let novo = false;
    for (const m of list)
      for (const n of m.addedNodes)
        if (n.nodeType === 1 && n.matches("li.lab-ev")) {
          dnevnik.push({ t: besedilo(n), k: ["ok", "warn", "bad"].find((k) => n.classList.contains(k)) || "info" });
          novo = true;
        }
    if (novo) soon();
  });

  function soon() {
    if (sched) return;
    sched = setTimeout(() => ((sched = 0), tick()), 80);
  }

  function tick() {
    if (!mount.isConnected) return stop();
    if (!mount.getClientRects().length) return; // zavihek skrit, poskus ostane odprt (showLab)
    if (!attach()) return;
    if (mode === "vodeno") {
      const c = kontekst(mount, dnevnik);
      while (i < def.koraki.length && safe(() => def.koraki[i].done(c))) i++;
    }
    render();
  }
  const safe = (f) => {
    try {
      return !!f();
    } catch {
      return false;
    }
  };

  function oznaci() {
    for (const el of cilji) el.classList.remove("lab-vod-cilj");
    cilji.clear();
    const k = mode === "vodeno" ? def.koraki[i] : null;
    for (const t of k?.poudari || []) {
      const el = najdi(mount, t);
      if (el) (el.classList.add("lab-vod-cilj"), cilji.add(el));
    }
  }

  function render(force = false) {
    if (bar.get() !== mode) bar.set(mode, true);
    oznaci();
    kje.hidden = !cilj();
    if (!force && shown === i && shownMode === mode) return;
    shown = i;
    shownMode = mode;
    card.hidden = mode !== "vodeno";
    if (mode !== "vodeno") return card.replaceChildren(), (glas.textContent = "");
    const n = def.koraki.length;
    const done = i >= n;
    const prej = i > 0 ? def.koraki[i - 1] : null;
    const pct = Math.round((Math.min(i, n) / n) * 100);
    const kids = [
      h("div", { class: "lab-vod-head" },
        h("span", { class: "lab-vod-oznaka" }, done ? "Vodeni poskus: opravljeno" : `Korak ${i + 1} od ${n}`),
        h("span", { class: "lab-vod-proga", role: "progressbar", "aria-label": "napredek vodenega poskusa", "aria-valuemin": "0", "aria-valuemax": String(n), "aria-valuenow": String(Math.min(i, n)), "aria-valuetext": done ? "opravljeno" : `Korak ${i + 1} od ${n}` },
          Object.assign(h("span"), { style: `width:${pct}%` }))), // CSSOM (CSP brez slogov v atributih)
    ];
    if (i === 0) kids.push(h("p", { class: "lab-vod-cilj-poskusa" }, def.cilj));
    if (prej) kids.push(h("p", { class: "lab-vod-zakaj" }, h("b", {}, "✓ "), prej.zakaj));
    if (done) {
      kids.push(h("h3", {}, def.naslov), h("p", {}, def.konec));
      glas.textContent = `Vodeni poskus opravljen: ${def.naslov}`;
      if (!konecJavljen) (konecJavljen = true), onKonec?.();
    } else {
      const k = def.koraki[i];
      kids.push(h("h3", {}, k.naslov), h("p", { class: "lab-vod-kaj" }, k.kaj));
      if (k.poudari || k.pokazi) kids.push(kje);
      glas.textContent = `Korak ${i + 1} od ${n}: ${k.naslov}`;
      if (k.namig) kids.push(h("details", { class: "lab-vod-namig" }, h("summary", {}, "Namig"), h("p", {}, k.namig)));
    }
    card.replaceChildren(...kids);
  }

  function stop() {
    if (mount._vodi === api) delete mount._vodi;
    ui.remove();
    for (const el of cilji) el.classList.remove("lab-vod-cilj");
    clearInterval(timer);
    clearTimeout(sched);
    obs.disconnect();
    mount.removeEventListener("click", soon, true);
    mount.removeEventListener("input", soon, true);
    mount.removeEventListener("change", soon, true);
  }

  mount.addEventListener("click", soon, true);
  mount.addEventListener("input", soon, true);
  mount.addEventListener("change", soon, true);
  timer = setInterval(tick, 700); // tudi brez klika: npr. kroglica je padla, poskus se je ponastavil
  const api = {
    stop,
    get korak() {
      return i;
    },
    get nacin() {
      return mode;
    },
  };
  mount._vodi = api;
  tick();
  return api;
}
