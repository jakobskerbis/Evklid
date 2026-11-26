// Klikljive formule: kartica ob kliku na simbol ali enoto (slovar in označevanje sta v formula-data.js).
import { t, currentLang } from "./i18n.js";
import { cardFor, configureCard, claimMarks, createMarkPage, pruneTones } from "./formula-card.js";

configureCard({ t, lang: currentLang, katex: () => window.katex });

export { annotateTex, setFormulaSubject, withFormulaSubject, subjectWithGlossary, plainTex } from "./formula-data.js";

// Kartice ne pokažemo pri testih (Preizkus znanja, tekmovanje), ker bi zveza izdala rešitev.
const blocked = (el) => !!el.closest(".no-fx, button, .choice, label, input, textarea, .sym-key, [contenteditable]");
const decode = (s) => decodeURIComponent(s.replace(/\./g, "%"));

let pop = null;
let openEl = null;
let hooks = {}; // { opened, closed }: aplikacija doda zapis v zgodovino, da tipka Nazaj zapre okno (app.js)
let openW = 0; // širina okna ob odprtju
let quietUntil = 0; // lastno drsenje (okno na telefonu odmakne formulo nad list) ne zapre okna
// Lega drsenja strani in drsnega ovoja ob odprtju (in po lastnem drsenju): okno zapre le drsenje, ki lego zares
// spremeni. Zakasnel dogodek »scroll« (prejšnje drsenje, na počasni napravi ali v CI pride po odprtju) ga ne zapre.
let openPos = null;
const posOf = (t) => (t === document || t === document.documentElement || t === document.body ? window.scrollY : t.scrollTop);
function rememberPos(el) {
  openPos = new Map([[document, window.scrollY]]);
  const sc = el && scrollerOf(el);
  if (sc) openPos.set(sc, sc.scrollTop);
}
function close(fromBack = false) {
  if (!pop || pop.hidden) return false;
  pop.hidden = true;
  pop.style.transform = pop.style.transition = "";
  openEl?.setAttribute("aria-expanded", "false");
  openEl?.removeAttribute("aria-controls");
  openEl?.classList.remove("fx-open");
  openEl = null;
  if (!fromBack) hooks.closed?.();
  return true;
}
// Tipka Nazaj (telefon, brskalnik): zapre okno pomena, pogled ostane (app.js popstate).
export const closeFormulaPop = () => close(true);
// again: okno je bilo že odprto (druga črka), zapis v zgodovini že obstaja – sicer bi bilo treba Nazaj pritisniti
// dvakrat. focus: odprto s tipko (Enter), fokus gre v okno, da se s Tab pride do ✕.
function open(el, { again = false, focus = false } = {}) {
  const card = cardFor(decode(el.dataset.fx));
  if (!card) return;
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "fx-pop";
    pop.className = "fx-pop";
    pop.tabIndex = -1;
    pop.setAttribute("role", "dialog");
    pop.hidden = true;
    document.body.appendChild(pop);
    swipe(pop);
  }
  pop.setAttribute("aria-label", card.label);
  if (el.dataset.fxTone) pop.dataset.tone = el.dataset.fxTone;
  else delete pop.dataset.tone;
  pop.innerHTML = `${card.html}<button type="button" class="fx-close" aria-label="${t("fx.close")}">×</button>`;
  pop.style.transform = pop.style.transition = ""; // ostanek potega, če se je okno med njim zaprlo drugače
  pop.hidden = false;
  openEl = el;
  el.setAttribute("aria-expanded", "true");
  el.setAttribute("aria-controls", pop.id);
  el.classList.add("fx-open");
  openW = window.innerWidth;
  place(el);
  rememberPos(el);
  if (focus) pop.focus({ preventScroll: true });
  if (!again) hooks.opened?.();
}

// Telefon: kartico povlečeš navzdol in jo s tem zapreš, kot nakazuje ročaj (j 2026-11-25). Poteg navzgor ali
// poteg, ko je vsebina kartice odpeljana navzdol, ostane drsenje vsebine. Dovolj je 60 px ali hiter poteg.
function swipe(p) {
  let y0 = NaN, t0 = 0, dy = 0, drag = false;
  p.addEventListener("touchstart", (e) => {
    drag = false;
    dy = 0;
    y0 = p.classList.contains("fx-sheet") && e.touches.length === 1 && p.scrollTop <= 0 ? e.touches[0].clientY : NaN;
    t0 = performance.now();
  }, { passive: true });
  p.addEventListener("touchmove", (e) => {
    if (Number.isNaN(y0)) return;
    dy = e.touches[0].clientY - y0;
    if (!drag && dy < -6) { y0 = NaN; return; }
    if (!drag && dy > 6) drag = true;
    if (!drag) return;
    e.preventDefault();
    p.style.transition = "none";
    p.style.transform = `translateY(${Math.max(0, dy)}px)`;
  }, { passive: false });
  const end = () => {
    y0 = NaN;
    if (!drag || p.hidden) return void (drag = false);
    drag = false;
    const fast = dy > 20 && dy / Math.max(1, performance.now() - t0) > 0.5;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.style.transition = calm ? "none" : "transform 0.18s ease-out";
    if (dy < 60 && !fast) { p.style.transform = ""; return; }
    p.style.transform = `translateY(${p.offsetHeight + 16}px)`;
    const was = openEl;
    setTimeout(() => { if (openEl === was) close(); }, calm ? 0 : 180);
  };
  p.addEventListener("touchend", end);
  p.addEventListener("touchcancel", () => { y0 = NaN; drag = false; p.style.transform = ""; });
}

// Okno nikoli ne prekrije formule, na katero se nanaša (j, 6. 11.). Računalnik: ob simbolu, pod ali nad celo
// vrstico formule. Telefon (ozek zaslon): spodnji list nad spodnjim menijem; če bi list prekril formulo,
// stran zdrsne, da je formula nad njim.
const SHEET_MAX = 640;
function place(el) {
  const line = () => {
    const r0 = el.getBoundingClientRect();
    const f = (el.closest(".katex") || el).getBoundingClientRect();
    return { left: r0.left, width: r0.width, top: Math.min(r0.top, f.top), bottom: Math.max(r0.bottom, f.bottom) };
  };
  // Spodnji meni na telefonu (#tabbar) prekrije dno zaslona: okno naj se konča nad njim.
  const bar = document.getElementById("tabbar");
  const barTop = bar && getComputedStyle(bar).display !== "none" ? Math.min(window.innerHeight, bar.getBoundingClientRect().top) : window.innerHeight;
  const sheet = window.innerWidth <= SHEET_MAX;
  pop.classList.toggle("fx-sheet", sheet);
  if (sheet) {
    // Plavajoča kartica z odmikom od robov (j 2026-11-25: list, prilepljen na dno, je bil videti kot noga strani).
    // Nad spodnjim menijem 8 px nad njim; brez menija odmik in varni rob da CSS (.fx-sheet bottom).
    pop.style.width = "";
    pop.style.left = "";
    pop.style.top = "";
    pop.style.bottom = barTop < window.innerHeight ? `${window.innerHeight - barTop + 8}px` : "";
    pop.style.paddingBottom = "";
    const sheetTop = pop.getBoundingClientRect().top;
    const r = line();
    if (r.bottom + 8 > sheetTop) {
      // Formula pod listom: zdrsni jo nad list (drsni ovoj pogleda ali cela stran).
      const by = Math.min(r.bottom + 8 - sheetTop, Math.max(0, r.top - 8));
      const sc = scrollerOf(el);
      quietUntil = performance.now() + 500;
      if (sc) sc.scrollTop += by;
      else window.scrollBy(0, by);
    }
    return;
  }
  const w = Math.min(340, window.innerWidth - 24);
  pop.style.width = `${w}px`;
  pop.style.bottom = "";
  pop.style.paddingBottom = "";
  const h = pop.offsetHeight;
  const r = line();
  // Ves odstavek (vrstica v kartici, alineja, prikazna formula), če ni predolg: okno ne prekrije njegovega nadaljevanja.
  const blk = el.closest("p, li, td, th, dd, blockquote, h1, h2, h3, h4, .katex-display");
  const b = blk?.getBoundingClientRect();
  const para = b && b.height < window.innerHeight * 0.4 ? { left: b.left, right: b.right, top: Math.min(b.top, r.top), bottom: Math.max(b.bottom, r.bottom) } : null;
  const left = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 12));
  const spots = [];
  for (const a of para ? [para, r] : [r]) {
    if (a.bottom + 8 + h < barTop) spots.push({ left, top: a.bottom + 8 });
    if (a.top - h - 8 > 0) spots.push({ left, top: a.top - h - 8 });
  }
  // Ob robu odstavka (levo ali desno), če ni prostora ne pod ne nad njim.
  const top = Math.max(8, Math.min(r.top, barTop - h - 8));
  if (para && para.right + 8 + w < window.innerWidth) spots.push({ left: para.right + 8, top });
  if (para && para.left - 8 - w > 0) spots.push({ left: para.left - 8 - w, top });
  const at = spots[0] || { left, top: r.bottom + 8 };
  pop.style.left = `${at.left + window.scrollX}px`;
  pop.style.top = `${at.top + window.scrollY}px`;
}

// Okvir dotika naj objame znak, ne razmika za njim: KaTeX da presledek pred »=« in
// poševni popravek črke (margin-right) v ovoj oznake, zato je bil znak levo v okvirju.
const PAD = 0.08; // em, enako kot v ui.css
function fit(el) {
  while (el.lastElementChild?.classList.contains("mspace")) el.after(el.lastElementChild);
  while (el.firstElementChild?.classList.contains("mspace")) el.before(el.firstElementChild);
  const last = el.lastElementChild;
  const mr = last?.classList.contains("mord") && /em$/.test(last.style.marginRight) ? parseFloat(last.style.marginRight) : 0;
  if (mr > 0) {
    // Polovico popravka pustimo v okvirju (nagnjen vrh črke), polovico zunaj; širina vrstice ostane ista.
    last.style.marginRight = "0";
    el.style.paddingRight = `${PAD + mr / 2}em`;
    // Prozorni rob za dotik (--fx-r, glej fitTargets) se odšteje, da širina vrstice ostane ista.
    el.style.marginRight = `calc(${mr / 2 - PAD}em - var(--fx-r, 0px))`;
  }
}

// Površina za dotik (WCAG 2.5.8, K-11): klikljiv znak je pogosto ožji ali nižji od 24 px. Okvir dotika
// razširimo s prozornim robom (border) in enako velikim negativnim odmikom (margin), zato se postavitev ne
// spremeni; ozadje ob dotiku in obroč fokusa ostaneta na znaku (ui.css, padding-box). Rob seže največ do
// polovice razmika do sosednje klikljive oznake in največ do ovire (ponovljena ali izklopljena črka, povezava,
// gumb, polje): dotik zadene pravo črko ali kontrolnik. Ne seže čez okvir, ki vsebino odreže ali drsi (pri
// formuli ne sme nastati drsnik). Vrednosti v px: --fx-t, --fx-r, --fx-b, --fx-l.
const CILJ = 24; // px (axe target-size); brskalnik rob zaokroži navzdol na cel piksel, zato želeni rob zaokrožimo navzgor
const SIDES = ["--fx-t", "--fx-r", "--fx-b", "--fx-l"];
const OVIRA = "[data-fx]:not([role=button]), a[href], input, button, select, textarea, summary, label, [role=link], [role=tab], [contenteditable]";
const BLOK = "p, li, td, th, dd, dt, h1, h2, h3, h4, h5, h6, figcaption, .katex-display";
const PRAZNO = /(^|\s)(mspace|katex-strut|strut)(\s|$)/; // presledek v formuli ni ovira
// Sosednji znak v isti formuli (števka, operator, črka brez kartice): rob oznake ga ne sme prekriti.
function atom(el, dir) {
  let a = el[dir];
  while (a && PRAZNO.test(a.className)) a = a[dir];
  return a && !a.matches("[data-fx][role=button]") ? a : null;
}
let fitDirty = true; // okvirje preračunamo le, ko se je kaj spremenilo (ne ob vsakem umiru drsenja)
const fitted = new WeakSet();
const reach = new WeakMap(); // oznaka → [t, r, b, l], trenutni rob v px
function clearReach(el) {
  if (!reach.has(el)) return;
  reach.delete(el);
  for (const s of SIDES) el.style.removeProperty(s);
}
function clipOf(el, memo) {
  const chain = [];
  let box = null;
  for (let a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
    if (memo.has(a)) { box = memo.get(a); break; }
    chain.push(a);
    const cs = getComputedStyle(a);
    if (cs.overflowX !== "visible" || cs.overflowY !== "visible") { box = a; break; }
  }
  for (const a of chain) memo.set(a, box);
  return box;
}
function boundsOf(c, cache) {
  if (cache.has(c)) return cache.get(c);
  let b;
  if (!c) {
    // Brez okvirja: samo širina strani (vodoravno drsenje cele strani ne sme nastati).
    b = { left: 0, right: document.documentElement.clientWidth, top: -Infinity, bottom: Infinity };
  } else {
    // Le vidni del okvirja: rob, ki bi segel v drsno območje, bi to območje sam podaljšal.
    const r = c.getBoundingClientRect();
    const x = r.left + c.clientLeft, y = r.top + c.clientTop;
    b = { left: x, top: y, right: x + c.clientWidth, bottom: y + c.clientHeight };
    if (!sized.has(c)) { sized.add(c); fresh.add(c); resizeObs?.observe(c); }
  }
  cache.set(c, b);
  return b;
}
const sized = new WeakSet();
const fresh = new WeakSet(); // prvo obvestilo ResizeObserverja pride ob opazovanju in ni sprememba
const resizeObs = typeof ResizeObserver === "function" ? new ResizeObserver((list) => {
  let changed = false;
  for (const { target } of list) if (fresh.has(target)) fresh.delete(target); else changed = true;
  if (changed) { fitDirty = true; queueMarks(); }
}) : null;
const down = (x) => Math.max(0, Math.floor(x + 1e-6));
const boxOf = (el, e) => {
  const r = el.getBoundingClientRect();
  const [t, rr, b, l] = e || [0, 0, 0, 0];
  return { el, top: r.top + t, right: r.right - rr, bottom: r.bottom - b, left: r.left + l, w: r.width, h: r.height };
};
function fitTargets(els) {
  const memo = new Map(), cache = new Map(), items = [], seen = new Set(els), blocks = new Set(), near = new Set();
  for (const el of els) {
    fitted.add(el);
    const g = boxOf(el, reach.get(el));
    if (!g.w || !g.h) continue;
    const y = Math.max(0, Math.ceil((CILJ - (g.bottom - g.top)) / 2 - 1e-6)), x = Math.max(0, Math.ceil((CILJ - (g.right - g.left)) / 2 - 1e-6));
    const k = boundsOf(clipOf(el, memo), cache);
    g.e = [Math.min(y, g.top - k.top), Math.min(x, k.right - g.right), Math.min(y, k.bottom - g.bottom), Math.min(x, g.left - k.left)];
    items.push(g);
    const kx = el.closest(".katex");
    const blk = kx?.parentElement?.closest(BLOK) || kx?.parentElement;
    if (blk) blocks.add(blk);
    for (const a of [atom(el, "previousElementSibling"), atom(el, "nextElementSibling")]) if (a) near.add(a);
  }
  // Ovire: sosednji znaki iste formule ter ponovljene črke in kontrolniki v istem odstavku ali bloku (ne pa
  // kontrolnik, ki oznako vsebuje, npr. povezava okoli formule).
  for (const o of [...near, ...[...blocks].flatMap((blk) => [...blk.querySelectorAll(OVIRA)])]) {
    if (seen.has(o)) continue;
    seen.add(o);
    if (o.querySelector("[data-fx][role=button]")) continue;
    const g = boxOf(o);
    if (!g.w || !g.h) continue;
    g.fixed = true;
    g.e = [0, 0, 0, 0];
    items.push(g);
  }
  // Sosednji oznaki si razmik razdelita na pol, po osi z večjim razmikom; do ovire sme oznaka ves razmik.
  // Razširjeni okvirji se tako ne prekrivajo med sabo ne z ovirami.
  items.sort((a, b) => a.top - b.top);
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    for (let j = i + 1; j < items.length && items[j].top < a.bottom + CILJ; j++) {
      const o = items[j];
      if (a.fixed && o.fixed) continue;
      const gx = Math.max(o.left - a.right, a.left - o.right), gy = Math.max(o.top - a.bottom, a.top - o.bottom);
      if (gx >= CILJ || gy >= CILJ) continue;
      if (gx < 0 && gy < 0) {
        // Okvirja se že prekrivata (KaTeX-ov odmik 0,08 em). Dve oznaki: brez razširitve. Oznaka ob oviri
        // (npr. 3 v »3t«): brez razširitve proti oviri; navzgor in navzdol le, če ovira tam ne sega.
        if (!a.fixed && !o.fixed) { a.e.fill(0); o.e.fill(0); continue; }
        const [m, f] = a.fixed ? [o, a] : [a, o];
        if (f.left + f.right < m.left + m.right) m.e[3] = 0;
        else m.e[1] = 0;
        if (f.top < m.top) m.e[0] = 0;
        if (f.bottom > m.bottom) m.e[2] = 0;
        continue;
      }
      const gap = Math.max(gx, gy), h = a.fixed || o.fixed ? gap : gap / 2;
      if (gx >= gy) {
        const [l, r] = o.left >= a.right ? [a, o] : [o, a];
        l.e[1] = Math.min(l.e[1], h);
        r.e[3] = Math.min(r.e[3], h);
      } else {
        const [u, d] = o.top >= a.bottom ? [a, o] : [o, a];
        u.e[2] = Math.min(u.e[2], h);
        d.e[0] = Math.min(d.e[0], h);
      }
    }
  }
  for (const g of items) {
    if (g.fixed) continue;
    const e = g.e.map(down);
    const old = reach.get(g.el);
    if (old && old.every((v, i) => v === e[i])) continue;
    reach.set(g.el, e);
    e.forEach((v, i) => g.el.style.setProperty(SIDES[i], `${v}px`));
  }
}

// Simboli postanejo gumbi za tipkovnico in bralnike zaslona.
function enhance(root) {
  const els = root.querySelectorAll ? root.querySelectorAll("[data-fx]:not([tabindex])") : [];
  for (const el of els) {
    if (blocked(el)) { el.setAttribute("tabindex", "-1"); el.classList.add("fx-off"); continue; }
    const card = cardFor(decode(el.dataset.fx));
    if (!card) { el.setAttribute("tabindex", "-1"); el.classList.add("fx-off"); continue; }
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-expanded", "false");
    el.setAttribute("aria-label", card.label);
    fit(el);
    const html = el.closest(".katex-html");
    if (html && html.getAttribute("aria-hidden") === "true") {
      html.removeAttribute("aria-hidden");
      html.parentElement?.querySelector(".katex-mathml")?.setAttribute("aria-hidden", "true");
    }
  }
}

// Na strani (pogled, okno, razdelek lista formul, sporočilo v klepetu) je klikljiva le prva vidna pojavitev
// vsakega pomena; ostale so navadno besedilo (fx-dup). Ista črka z več pomeni dobi ton barve (data-fx-tone)
// za vsak pomen; ton ostane pomenu, dokler stran obstaja. .fx-page označi lastno stran.
const PAGE = ".msg, .fm-sec, .fx-page, [role=dialog], dialog, .view";
const pages = new WeakMap();
let marksQueued = false;
let scrollTimer = 0;
function queueMarks() {
  if (marksQueued) return;
  marksQueued = true;
  requestAnimationFrame(() => {
    marksQueued = false;
    refreshMarks();
  });
}
// Zaprt <details> (content-visibility) in hidden="until-found" imata okvirje, a nista vidna.
const visible = (el) => (el.checkVisibility ? el.checkVisibility() : el.getClientRects().length > 0);
// Na zaslonu mora biti vedno vsaj ena klikljiva črka (j, 5. 11.): oznako pomena dobi pojavitev, ki je trenutno
// na zaslonu (prva taka), ne prva na strani, ki je morda že odpeljana gor. Odprta in izbrana oznaka ostaneta.
const scrollerOf = (el) => {
  for (let a = el; a && a !== document.body; a = a.parentElement) if (/auto|scroll/.test(getComputedStyle(a).overflowY) && a.scrollHeight > a.clientHeight) return a;
  return null;
};
function onScreen(root) {
  const sc = scrollerOf(root);
  const r = sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight };
  const top = Math.max(0, r.top), bottom = Math.min(innerHeight, r.bottom);
  return (el) => {
    const b = el.getBoundingClientRect();
    return b.bottom > top && b.top < bottom;
  };
}
function refreshMarks() {
  const groups = new Map();
  for (const el of document.querySelectorAll("[data-fx][tabindex]")) {
    if (el.classList.contains("fx-off")) continue;
    const root = el.closest(PAGE) || document.body;
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(el);
  }
  // Najprej vsa branja (vidnost), nato pisanje, da brskalnik ne preračunava postavitve za vsak razdelek.
  const plans = [];
  for (const [root, els] of groups) {
    // Skrit razdelek (npr. skrit podzavihek kalkulatorja, ki ostane v pomnilniku): ena poizvedba namesto ene na
    // oznako. Viden razdelek lista formul (.fm-sec, oznake nikoli skrite s CSS) brez zaprtih <details> in [hidden]:
    // vse oznake so vidne (tisoč oznak v Formulah ob vsakem preklopu na telefonu; naloga hitrost, j 6. 11. 2026).
    // Drugod (pogled, sporočilo, dialog) je oznaka lahko skrita s slogom, zato tam preverimo vsako posebej.
    const whole = root === document.body ? null : visible(root);
    const all = whole && root.classList.contains("fm-sec") && !root.querySelector("details:not([open]), [hidden]");
    const vis = whole === false ? [] : all ? els : els.filter(visible);
    // Kartica, ki jo brskalnik preskoči (content-visibility: auto, daleč od zaslona), po definiciji ni na zaslonu:
    // njenih oznak ne merimo, ker bi getBoundingClientRect prisilil postavitev vse preskočene vsebine.
    const skipped = !!whole && root.checkVisibility?.({ contentVisibilityAuto: true }) === false;
    const inView = skipped ? () => false : onScreen(root);
    const first = (el) => el === openEl || el === document.activeElement;
    // Vrstni red za claimMarks: odprta/izbrana, nato na zaslonu, nato ostale (vsak del v vrstnem redu strani).
    const shown = [...vis.filter(first), ...vis.filter((el) => !first(el) && inView(el)), ...vis.filter((el) => !first(el) && !inView(el))];
    let page = pages.get(root);
    if (!page) pages.set(root, (page = createMarkPage()));
    page.owners.clear();
    const plan = claimMarks(page, root, shown.map((el) => decode(el.dataset.fx)));
    pruneTones(page);
    plans.push([els, new Map(shown.map((el, i) => [el, plan[i]])), skipped]);
  }
  for (const [els, plan] of plans) {
    for (const el of els) {
      const p = plan.get(el) || { dup: false, tone: 0 };
      const dup = p.dup && el !== openEl;
      if (el.classList.contains("fx-dup") !== dup) {
        el.classList.toggle("fx-dup", dup);
        fitDirty = true;
        // Ponovljena črka je navadno besedilo: brez vloge tudi brez aria-label in aria-expanded (WCAG 4.1.2, axe
        // aria-allowed-attr; bralnik prebere samo črko). Oznako hranimo v data-fx-label za vrnitev v gumb.
        if (dup) {
          el.removeAttribute("role");
          el.setAttribute("tabindex", "-1");
          if (el.hasAttribute("aria-label")) el.dataset.fxLabel = el.getAttribute("aria-label");
          el.removeAttribute("aria-label");
          el.removeAttribute("aria-expanded");
        } else {
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
          if (el.dataset.fxLabel) el.setAttribute("aria-label", el.dataset.fxLabel);
          el.setAttribute("aria-expanded", "false");
        }
      }
      const tone = p.tone && !dup ? String(p.tone) : null;
      if ((el.dataset.fxTone ?? null) !== tone) {
        if (tone) el.dataset.fxTone = tone;
        else delete el.dataset.fxTone;
      }
    }
  }
  // Okvir dotika za vse vidne klikljive oznake (ne le na zaslonu: drsenje ga ne sme spremeniti).
  const live = [];
  // Preskočena kartica (content-visibility) ostane brez merjenja: branje okvirja bi prisililo njeno postavitev.
  for (const [els, plan, skipped] of plans)
    for (const el of els) {
      if (!skipped && plan.has(el) && el.getAttribute("role") === "button") live.push(el);
      // Ponovljena ali skrita črka nima vloge gumba: njen rob (in odštevek v margin-right iz fit) mora izginiti.
      else if (el.getAttribute("role") !== "button") clearReach(el);
    }
  // Okvirje preračunamo, ko se je postavitev ali vloga spremenila ali je prišla nova oznaka; samo drsenje
  // jih ne spremeni (vsi okvirji se premaknejo skupaj), zato ga preskočimo (Formule: tisoč oznak).
  if (fitDirty || live.some((el) => !fitted.has(el))) {
    fitDirty = false;
    fitTargets(live);
  }
  for (const root of groups.keys()) if (root !== document.body && !sized.has(root)) { sized.add(root); fresh.add(root); resizeObs?.observe(root); }
}

// Klikljiva črka, okno pomena in zapiranje okna so svoj dotik: kartica (Ponavljanje), vrstica, povezava ali
// razdelek okoli formule se ob njem ne odzove (j, 6. 11.: tap na x₁ je obrnil kartico). Zato poslušamo v fazi
// zajemanja (capture) na dokumentu in dotik ustavimo, preden pride do elementa okoli.
const active = (el) => el && !blocked(el) && !el.classList.contains("fx-off") && !el.classList.contains("fx-dup");
// Pravi gumbi in polja zunaj okna delujejo že ob prvem dotiku (okno se le zapre); prazen prostor dotik porabi.
const CONTROL = "button, a[href], input, select, textarea, summary, label, [contenteditable], [role=tab], [role=link], #tabbar, nav";
function stop(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
}
let byKey = false; // zadnji »klik« na črko je sprožila tipka Enter ali preslednica
export function initFormulaInfo(h = {}) {
  hooks = h || {};
  document.addEventListener("click", (e) => {
    if (pop && !pop.hidden && pop.contains(e.target)) {
      // Dotik v oknu (tudi ✕) ne obrne kartice in ne odpre ničesar pod oknom.
      stop(e);
      if (e.target.closest(".fx-close")) { const el = openEl; close(); el?.focus({ preventScroll: true }); }
      return;
    }
    const el = e.target.closest("[data-fx]");
    if (active(el)) {
      e.preventDefault();
      stop(e);
      const focus = byKey;
      byKey = false;
      if (openEl === el) return close();
      const again = close(true); // druga črka: okno ostane odprto (zapis v zgodovini tudi, ne dodamo novega)
      open(el, { again, focus });
      return;
    }
    fitDirty = true; // zavihek ali razdelek se je morda odprl: postavitev je lahko nova
    queueMarks();
    // Okno je odprto: dotik v prazno ga zapre in se tu konča (kartica se ne obrne).
    if (openEl && !e.target.closest(CONTROL)) {
      e.preventDefault();
      stop(e);
    }
    close();
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openEl) { const el = openEl; stop(e); close(); el.focus(); return; }
    const el = e.target.closest?.("[data-fx][role=button]");
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); stop(e); byKey = true; el.click(); byKey = false; }
  }, true);
  // Telefon: vrstica brskalnika se ob drsenju skrije in spremeni le višino okna; okno pomena zapre le nova širina (obrat).
  window.addEventListener("resize", () => {
    if (window.innerWidth !== openW) close();
    clearTimeout(scrollTimer);
    fitDirty = true; // nova širina: okvirji dotika se preračunajo
    scrollTimer = setTimeout(queueMarks, 120);
  });
  // Pisave KaTeX se naložijo šele ob prvi uporabi in spremenijo velikost znakov: okvirji dotika se preračunajo.
  const nanovo = () => { fitDirty = true; queueMarks(); };
  document.fonts?.ready.then(nanovo);
  document.fonts?.addEventListener?.("loadingdone", nanovo);
  document.addEventListener("scroll", (e) => {
    if (pop?.contains(e.target)) return;
    const key = e.target === document.documentElement || e.target === document.body ? document : e.target;
    const same = openPos?.has(key) && Math.abs(posOf(key) - openPos.get(key)) < 2;
    if (openEl && !same && performance.now() > quietUntil) close();
    // Oznaka gre na pojavitev, ki je zdaj na zaslonu: enkrat, ko se drsenje umiri (ne ob vsaki sličici).
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(queueMarks, 120);
  }, true);
  enhance(document);
  queueMarks();
  document.addEventListener("toggle", nanovo, true);
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "attributes") { nanovo(); continue; }
      for (const node of m.removedNodes) if (node.nodeType === 1 && (node.matches?.("[data-fx]") || node.querySelector?.("[data-fx]"))) nanovo();
      for (const node of m.addedNodes) if (node.nodeType === 1) {
        if (node.matches?.("[data-fx]")) { enhance(node.parentElement || document); nanovo(); }
        else if (node.querySelector?.("[data-fx]")) { enhance(node); nanovo(); }
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open"] });
}

