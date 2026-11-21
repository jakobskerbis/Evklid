// Formule v poljih za vnos (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«; 14. 11.:
// »Ulomek naj se izpiše namesto surovega zapisa, ne skupaj z njim«).
// Tipke Evklidove tipkovnice vstavijo zapis v vrstici, npr. (3)/(4), √(2), x^(2) (public/vnos-formul.js).
// - Polje v eni vrstici (odgovor naloge, kviz …) pokaže formulo kar v sebi: čez polje leži izris z ulomki, koreni in
//   potencami ter kazalcem, surovo besedilo polja je nevidno. Tap v izris postavi kazalec na najbližje mesto.
// - Večvrstično polje (vmesni koraki) ima izris pod seboj kot doslej.
// - Polje klepeta z inštruktorjem (#input, data-izris-v-polju; j, 14. 11.: »Naj se ulomki itd izpisujejo tudi pri vnosu v
//   inštruktorja«) ima izris v sebi kot polje v eni vrstici, le da se besedilo prelomi v več vrstic. Višino polja nastavi
//   app.js (autoGrow) po izrisu: dataset.izrisVisina in dogodek »vnos-izris-visina«.
// Vrednost polja ostane nespremenjena (preverjanje odgovora dobi točno to, kar je napisano). Prazno mesto (»()/()«) je
// okvirček. Kalkulator (sprotni izračun) ima svoje.
import { splitFormulas, hasFormula, varnaMesta, delisKazalcem, brisiNazaj, brisiNaprej, OZNAKA } from "./vnos-formul.js";

// Polja s svojim izrisom: kalkulator (sprotni izračun pod vnosom), skeniraj (.scan-preview);
// iskalnik spustnega seznama (ikona kljukice je sosed polja: .dd-search input + .dd-check).
const BREZ = "[data-brez-predogleda], .graph-overlay, #graph-slot, .gc, .sc, .tl, .fm, .pse, .scan-confirm, .dd-search, .razpri-area";
const predogledi = new WeakMap(); // večvrstično polje → element s predogledom pod njim
const izrisi = new WeakMap(); // polje v eni vrstici → izris čez njega
const zadnje = new WeakMap(); // polje → zadnji položaj kazalca (smer pomika s puščico)

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// \vphantom: prazno mesto s kazalcem (števec »()/()«) dobi višino števke, da ulomek ne zleze skupaj.
const KAZALEC = "\\htmlClass{vnos-kazalka}{\\vphantom{1}}";
const zaupaj = (c) => c.command === "\\htmlClass" && c.class === "vnos-kazalka";
const tex = (t) => {
  try {
    // Prazno mesto iz tipke (ulomek, koren, potenca, ki ga učenec še ni izpolnil) kot okvirček, da se vidi, kam pišeš.
    const src = t.replace(/\{\}/g, "{\\square}").split(OZNAKA).join(KAZALEC);
    return globalThis.katex.renderToString(`\\displaystyle ${src}`, { throwOnError: false, strict: "ignore", trust: zaupaj });
  } catch {
    return esc(t.split(OZNAKA).join(""));
  }
};
const html = (deli) =>
  deli.map((p) => ("tex" in p ? tex(p.tex) : esc(p.text).split(OZNAKA).join('<span class="vnos-kazalka"></span>'))).join("");

export function predogledHtml(vrednost) {
  return html(splitFormulas(vrednost));
}
/** Izris polja s kazalcem na mestu p (null: brez kazalca). */
export function izrisHtml(vrednost, p = null) {
  return html(delisKazalcem(vrednost, p));
}

function polje(el) {
  const f = el?.closest?.("input, textarea");
  if (!f || (f.tagName === "INPUT" && !/^(?:text|search|)$/.test(f.getAttribute("type") || ""))) return null;
  return f.closest(BREZ) ? null : f;
}

function dodajSlog() {
  if (slogDodan) return;
  slogDodan = true;
  const st = document.createElement("style");
  st.textContent = SLOG;
  document.head.append(st);
}

/** Polje z izrisom v sebi: polje v eni vrstici in polje klepeta (data-izris-v-polju). */
const vPolju = (f) => f.tagName === "INPUT" || f.hasAttribute("data-izris-v-polju");

function posodobi(f) {
  if (vPolju(f)) return izrisi.has(f) || hasFormula(f.value) ? posodobiIzris(f) : undefined;
  let pv = predogledi.get(f);
  const pokazi = !!globalThis.katex && hasFormula(f.value);
  if (!pokazi) {
    if (pv) pv.hidden = true;
    return;
  }
  if (!pv || !pv.isConnected) {
    dodajSlog();
    pv = document.createElement("div");
    pv.className = "formula-preview vnos-predogled";
    pv.setAttribute("aria-hidden", "true"); // bralnik zaslona bere polje samo
    f.after(pv);
    predogledi.set(f, pv);
    sledi(f);
  }
  if (pv.dataset.v !== f.value) {
    pv.innerHTML = predogledHtml(f.value);
    pv.dataset.v = f.value;
  }
  pv.hidden = false;
}

// ---------- izris v polju ----------

let mestaZa = { v: null, m: [] };
function mesta(v) {
  if (mestaZa.v !== v) mestaZa = { v, m: varnaMesta(v) };
  return mestaZa.m;
}

/** Kazalec sme stati le na mestu, kjer vpisan znak formule ne podre (ne med »)/(«): premakne ga v smeri pomika. */
function kazalec(f) {
  if (document.activeElement !== f) return null;
  let p, q;
  try {
    [p, q] = [f.selectionStart, f.selectionEnd];
  } catch {
    return null;
  }
  if (p !== q || typeof p !== "number") return null;
  const m = mesta(f.value);
  if (!m.includes(p)) {
    const prej = zadnje.get(f) ?? p;
    const naprej = m.find((x) => x >= p);
    const nazaj = m.filter((x) => x <= p).pop(); // brez findLast (iOS < 15.4)
    const n = p >= prej ? (naprej ?? nazaj) : (nazaj ?? naprej);
    if (n == null) return p;
    p = n;
    f.setSelectionRange(p, p);
  }
  zadnje.set(f, p);
  return p;
}

function posodobiIzris(f) {
  let o = izrisi.get(f);
  const pokazi = !!globalThis.katex && hasFormula(f.value) && !!f.parentElement;
  if (!pokazi) {
    if (o) {
      o.hidden = true;
      f.classList.remove("vnos-izrisan");
      if (o.classList.contains("vec")) novaVisina(f, null);
      else visina(f, null);
    }
    return;
  }
  if (!o || !o.isConnected) {
    dodajSlog();
    o = document.createElement("div");
    o.className = f.tagName === "TEXTAREA" ? "vnos-izris vec" : "vnos-izris";
    o.setAttribute("aria-hidden", "true"); // bralnik zaslona bere polje samo
    o.innerHTML = '<span class="vnos-izris-v"></span>';
    o.vnosPolje = f; // tipkovnica: tap v izris je tap v polje (public/tipkovnica.js textField)
    // Pritisk v izris ne vzame fokusa polju (sicer bi se izris ob izgubi fokusa izrisal na novo in klik bi se izgubil).
    o.addEventListener("mousedown", (e) => e.preventDefault());
    o.addEventListener("click", (e) => tap(f, o, e));
    const st = f.parentElement;
    if (getComputedStyle(st).position === "static") st.style.position = "relative";
    st.append(o); // zadnji otrok: pravila kot »input + button« ostanejo
    izrisi.set(f, o);
    predogledi.get(f)?.remove();
    sledi(f);
    if (typeof ResizeObserver === "function") new ResizeObserver(() => izrisi.get(f) === o && !o.hidden && postavi(f, o)).observe(f);
  }
  f.classList.add("vnos-izrisan");
  o.hidden = false;
  const p = kazalec(f);
  const v = o.firstChild;
  const k = `${p}\u0000${f.value}`;
  if (o.dataset.k !== k) {
    v.innerHTML = izrisHtml(f.value, p);
    o.dataset.k = k;
  }
  o.classList.toggle("izbor", document.activeElement === f && p == null && f.selectionStart !== f.selectionEnd);
  postavi(f, o);
}

// Izris pokrije notranjost polja (brez obrobe) z enako pisavo in barvo; visoko formulo (ulomek v ulomku) polje zraste.
function postavi(f, o) {
  if (!f.offsetParent) return void (o.style.display = "none");
  o.style.display = "";
  const cs = getComputedStyle(f);
  Object.assign(o.style, {
    left: `${f.offsetLeft + f.clientLeft}px`,
    top: `${f.offsetTop + f.clientTop}px`,
    width: `${f.clientWidth}px`,
    height: `${f.clientHeight}px`,
    paddingLeft: cs.paddingLeft,
    paddingRight: cs.paddingRight,
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    color: cs.color,
    opacity: cs.opacity === "1" ? "" : cs.opacity, // onemogočeno polje: kot polje samo (barva že sledi)
    // Dolga formula se odreže na robu besedila kot v navadnem polju, ne šele ob obrobi (4 px za kazalec).
    clipPath: `inset(0 ${Math.max(0, parseFloat(cs.paddingRight) - 4)}px 0 ${Math.max(0, parseFloat(cs.paddingLeft) - 4)}px)`,
    justifyContent: cs.textAlign === "center" ? "center" : cs.textAlign === "right" || cs.textAlign === "end" ? "flex-end" : "",
  });
  const v = o.firstChild;
  if (o.classList.contains("vec")) return postaviVec(f, o, cs);
  const treba = Math.ceil(v.offsetHeight + 8);
  if (treba > f.clientHeight || f.dataset.vnosVisina) visina(f, treba);
  // Kazalec ostane viden, ko je formula širša od polja (kot pri navadnem polju).
  const kz = v.querySelector(".vnos-kazalka");
  if (kz) {
    const r = kz.getBoundingClientRect();
    const b = o.getBoundingClientRect();
    const pl = parseFloat(cs.paddingLeft) || 0;
    if (r.right > b.right - pl) o.scrollLeft += r.right - (b.right - pl) + 2;
    else if (r.left < b.left + pl) o.scrollLeft -= b.left + pl - r.left + 2;
  } else if (document.activeElement !== f) o.scrollLeft = 0;
}

// Večvrstično polje z izrisom (klepet): besedilo se prelomi, polje zraste po izrisu (app.js), kazalec ostane viden.
function postaviVec(f, o, cs) {
  const pt = parseFloat(cs.paddingTop) || 0;
  const pb = parseFloat(cs.paddingBottom) || 0;
  Object.assign(o.style, { paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, lineHeight: cs.lineHeight, textAlign: cs.textAlign });
  const v = o.firstChild;
  novaVisina(f, Math.ceil(v.offsetHeight + pt + pb));
  const kz = v.querySelector(".vnos-kazalka");
  if (!kz) return;
  const r = kz.getBoundingClientRect();
  const b = o.getBoundingClientRect();
  if (r.bottom > b.bottom - pb) o.scrollTop += r.bottom - (b.bottom - pb) + 2;
  else if (r.top < b.top + pt) o.scrollTop -= b.top + pt - r.top + 2;
}
function novaVisina(f, h) {
  const prej = f.dataset.izrisVisina;
  if (h == null) delete f.dataset.izrisVisina;
  else f.dataset.izrisVisina = String(h);
  if (prej !== f.dataset.izrisVisina) f.dispatchEvent(new Event("vnos-izris-visina"));
}

// Višina polja za visoko formulo: treba = potrebna notranja višina v px, null = nazaj na svojo.
function visina(f, treba) {
  const prej = f.dataset.vnosVisina;
  if (treba == null) {
    if (prej != null) {
      f.style.height = prej === "-" ? "" : prej;
      delete f.dataset.vnosVisina;
    }
    return;
  }
  if (prej == null) f.dataset.vnosVisina = f.style.height || "-";
  f.style.height = prej === "-" || prej == null ? "" : prej;
  const naravna = f.clientHeight;
  if (treba <= naravna) {
    f.style.height = f.dataset.vnosVisina === "-" ? "" : f.dataset.vnosVisina;
    delete f.dataset.vnosVisina;
    return;
  }
  f.style.height = `${treba + f.offsetHeight - f.clientHeight}px`;
  if (getComputedStyle(f).boxSizing !== "border-box") {
    const cs = getComputedStyle(f);
    f.style.height = `${treba - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)}px`;
  }
}

/** Tap v izris: kazalec na mesto, ki je točki tapa najbližje (vsako dovoljeno mesto se izmeri enkrat). */
function tap(f, o, e) {
  if (f.disabled || f.readOnly) return;
  const v = o.firstChild;
  let best = f.value.length;
  let bd = Infinity;
  for (const q of mesta(f.value)) {
    v.innerHTML = izrisHtml(f.value, q);
    const r = v.querySelector(".vnos-kazalka")?.getBoundingClientRect();
    if (!r) continue;
    const d = Math.hypot(r.left - e.clientX, (r.top + r.bottom) / 2 - e.clientY);
    if (d < bd) [bd, best] = [d, q];
  }
  o.dataset.k = "";
  if (document.activeElement !== f) f.focus({ preventScroll: true });
  zadnje.set(f, best);
  f.setSelectionRange(best, best);
  posodobiIzris(f);
}

// Polje s predogledom ali izrisom: tudi vrednost ali kazalec, ki ju nastavi koda brez dogodka (plošča Piši: enota,
// prebrani zapis, Popravi; puščici tipkovnice; nastavitve ob menjavi profila), osveži izris. Polje, ki že ima svoj
// nastavljalec (klepet: app.js z njim poveča polje), ga obdrži: izris se doda zraven (prej je bil tam izpuščen, zato je
// po »Pošlji« v praznem polju ostal izris zadnjega ulomka).
function sledi(f) {
  if (sledeno.has(f)) return;
  sledeno.add(f);
  const d = Object.getOwnPropertyDescriptor(f, "value") || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(f), "value");
  if (d?.get && d?.set && d.configurable) {
    Object.defineProperty(f, "value", {
      configurable: true,
      get: () => d.get.call(f),
      set: (v) => {
        d.set.call(f, v);
        queueMicrotask(() => posodobi(f));
      },
    });
  }
  if (vPolju(f) && typeof f.setSelectionRange === "function") {
    const ssr = f.setSelectionRange;
    f.setSelectionRange = function (...a) {
      ssr.apply(this, a);
      if (izrisi.has(f)) queueMicrotask(() => posodobiIzris(f));
    };
  }
}
const sledeno = new WeakSet();

// Videz je tu (ne v style.css), ker se modul naloži šele ob prvem zapisu formule (prvo odprtje ostane enako veliko).
let slogDodan = false;
const SLOG =
  ".vnos-predogled{margin:6px 0 0;padding:6px 12px;border-radius:12px;background:color-mix(in srgb,var(--text) 5%,transparent);max-width:100%;box-sizing:border-box}" +
  // Surovo besedilo polja je nevidno (barva polja ostane za izris), izbor in kazalec tudi: kazalec nariše izris.
  ".vnos-izrisan{-webkit-text-fill-color:transparent!important;caret-color:transparent!important}" +
  ".vnos-izrisan::selection{background:transparent}" +
  ".vnos-izris{position:absolute;box-sizing:border-box;display:flex;align-items:center;overflow:hidden;white-space:pre;cursor:text;pointer-events:auto;line-height:1.2;z-index:1;border-radius:inherit;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}" +
  ".vnos-izris[hidden]{display:none!important}" +
  ".vnos-izris-v{display:inline-block;padding:4px 0;flex:none;direction:ltr;unicode-bidi:isolate}" + // formula je tudi na strani RTL od leve proti desni
  ".vnos-izris.izbor .vnos-izris-v{background:color-mix(in srgb,var(--accent) 30%,transparent);border-radius:4px}" +
  ".vnos-izris .katex{font-size:1.1em}" +
  // Klepet: besedilo se prelomi kot v polju; predolgo besedilo drsi navpično.
  ".vnos-izris.vec{display:block;white-space:pre-wrap;overflow-wrap:anywhere;overflow-x:hidden;overflow-y:auto;line-height:inherit}" +
  ".vnos-izris.vec .vnos-izris-v{display:block;padding:0}" +
  ".vnos-kazalka{display:inline-block;width:0;height:1.15em;vertical-align:-0.22em;border-left:2px solid var(--accent);margin-right:-2px;animation:vnos-utrip 1.1s steps(1) infinite}" +
  ".katex .vnos-kazalka{height:auto;vertical-align:baseline}" +
  "@keyframes vnos-utrip{55%{opacity:0}}" +
  "@media (prefers-reduced-motion:reduce){.vnos-kazalka{animation:none}}";

let zagnano = false;
// Ob prvem zapisu formule (app.js): odslej ima vsako polje izris ali predogled, ko je v njem zapis formule. prvo: polje,
// v katerem je učenec ravno pisal (njegov dogodek je že mimo).
export function initPredogledVnosa(prvo) {
  if (zagnano || typeof document === "undefined") return;
  zagnano = true;
  const ob = (e) => {
    const f = polje(e.target);
    if (f) posodobi(f);
  };
  document.addEventListener("input", ob, true);
  document.addEventListener("change", ob, true);
  // Kazalec se pokaže in skrije s fokusom; premik kazalca (puščice, klik) ga prestavi.
  const izr = (f) => f && izrisi.has(f) && posodobiIzris(f);
  document.addEventListener("focusin", (e) => izr(e.target), true);
  document.addEventListener("focusout", (e) => queueMicrotask(() => izr(e.target)), true);
  document.addEventListener("selectionchange", () => izr(document.activeElement), true);
  document.addEventListener("keyup", (e) => izr(e.target), true);
  // ⌫ in Del s tipkovnico računalnika: znak zgradbe (»)/(«) formule ne razbije (kot ⌫ Evklidove tipkovnice).
  document.addEventListener(
    "keydown",
    (e) => {
      const f = e.target;
      if (!/^(?:Backspace|Delete)$/.test(e.key) || e.ctrlKey || e.metaKey || e.altKey || !f?.classList?.contains("vnos-izrisan")) return;
      if (f.selectionStart !== f.selectionEnd) return;
      const out = (e.key === "Delete" ? brisiNaprej : brisiNazaj)(f.value, f.selectionStart);
      if (!out) return;
      e.preventDefault();
      urediNazaj(f, out);
    },
    true,
  );
  addEventListener("resize", () => document.querySelectorAll(".vnos-izrisan").forEach((f) => izr(f)));
  if (prvo) ob({ target: prvo });
}

/** Rezultat brisiNazaj v polje: ali zbriše prazno zgradbo (dogodek input) ali samo premakne kazalec. */
export function urediNazaj(f, out) {
  if (out.value !== f.value) {
    const v = f.value;
    let a = 0;
    while (a < out.value.length && v[a] === out.value[a]) a++;
    f.setRangeText("", a, a + v.length - out.value.length, "end");
    f.setSelectionRange(out.caret, out.caret);
    f.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContentBackward" }));
  } else f.setSelectionRange(out.caret, out.caret);
  zadnje.set(f, out.caret);
}
