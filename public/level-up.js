// Prehod v višji razred, letnik ali na fakulteto (kartica na vrhu Učne poti).
// 1) Na začetku šolskega leta: »Si zdaj v 9. razredu?« – en klik in učna pot se prestavi.
// 2) Ob prehodu OŠ → SŠ ali SŠ → fakulteta: kaj je na novi ravni novega,
//    in (brez naročnine) povezava do paketov v zavihku Račun.
import { icon } from "./icons.js";
import { stopnja, rang } from "./stopnja.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Nova stopnja, če je sprememba nastavitev prehod navzgor ("SS" ali "UNI"), sicer null. */
export function stageUp(before, after) {
  // Regijski šolski sistemi nimajo slovenskih kartic »kaj je novega v srednji šoli«.
  if (after?.school_system && after.school_system !== "SI") return null;
  const a = rang(stopnja(before));
  const b = rang(stopnja(after));
  return b > a ? ["OS", "SS", "UNI"][b] : null;
}

const lsKey = (sid, year) => `evklid.levelup.${sid}.${year}`;
const lsGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

const WELCOME = {
  SS: {
    title: "Dobrodošel v srednji šoli!",
    lead: "Učna pot je zdaj prilagojena tvojemu letniku in ravni matematike.",
    items: [
      ["map", "Nove učne poti za SŠ: funkcije, trigonometrija, kemijsko računanje, mehanika …"],
      ["graduation-cap", "V 4. letniku sklop <b>Priprava na maturo</b> z mešanimi maturitetnimi nalogami."],
      ["sigma", "V Inštruktorju so nove tipke s simboli: koreni, sinus, logaritmi, grške črke in kemijske enačbe."],
      ["mic", "Vprašanje lahko inštruktorju tudi poveš: dotakni se mikrofona."],
    ],
    paid: "Za maturo največ pomaga redna vaja z inštruktorjem. V brezplačnem paketu je število vprašanj na dan omejeno; s paketom so vprašanja, simulacije in poskusi neomejeni.",
  },
  UNI: {
    title: "Odklenjeni so fakultetni predmeti",
    lead: "Opazili smo, da si začel uporabljati fakultetne predmete. Učna pot zdaj sledi predmetniku tvojega študijskega programa.",
    items: [
      ["book-open", "Predmeti tvojega programa po letnikih, z lekcijami v Učbeniku."],
      ["message-circle", "Inštruktor razlaga na fakultetni ravni: odvodi, integrali, vektorji, strokovni zapis."],
      ["sigma", "Napredna tipkovnica: integrali, limite, odvodi, vektorji in množice."],
      ["mic", "Vprašanje lahko poveš: dotakni se mikrofona v Inštruktorju."],
    ],
    paid: "Za študij priporočamo poln paket: neomejena vprašanja za inštruktorja in vse simulacije.",
  },
};

/**
 * Kartica ob prehodu na višjo stopnjo.
 * @param {HTMLElement} box
 * @param {{ stage: "SS"|"UNI", premium: boolean, accounts: boolean, offers?: { show: boolean, prices: boolean } | null, onAccount: () => void, onClose: () => void }} o
 */
export function renderWelcome(box, o) {
  const w = WELCOME[o.stage];
  if (!w) return;
  // Pravila ponudb (server/placila/ponudbe.js): ne med poukom, ne pod 15 let, ne, če jih je učitelj izklopil.
  const upsell = !o.premium && o.accounts && (!o.offers || (o.offers.show && o.offers.prices));
  box.innerHTML = `
    <div class="card level-card welcome">
      <div class="lc-head"><span class="lc-ic">${icon("party-popper")}</span><h2>${w.title}</h2>
        <button type="button" class="ghost icon-only lc-close" aria-label="Zapri">${icon("x")}</button></div>
      <p>${w.lead}</p>
      <ul class="lc-list">${w.items.map(([ic, t]) => `<li>${icon(ic)}<span>${t}</span></li>`).join("")}</ul>
      ${upsell ? `<p class="muted">${w.paid}</p>` : ""}
      <div class="actions">
        ${upsell ? `<button type="button" class="primary" data-lc="account">Poglej pakete</button>` : ""}
        <button type="button" class="${upsell ? "secondary" : "primary"}" data-lc="close">${upsell ? "Kasneje" : "Začnimo"}</button>
      </div>
    </div>`;
  box.hidden = false;
  const close = () => {
    box.hidden = true;
    box.innerHTML = "";
    o.onClose?.();
  };
  box.querySelector(".lc-close").onclick = close;
  box.querySelector('[data-lc="close"]').onclick = close;
  const acc = box.querySelector('[data-lc="account"]');
  if (acc)
    acc.onclick = () => {
      close();
      o.onAccount();
    };
}

/**
 * Predlog na začetku šolskega leta. Vrne true, če je kartica prikazana.
 * @param {HTMLElement} box
 * @param {{ studentId: number, suggestion: object|null, onApply: (s) => Promise<void>, onChoose: (s) => void }} o
 */
export function renderSuggestion(box, o) {
  const s = o.suggestion;
  if (!s || lsGet(lsKey(o.studentId, s.schoolYear))) return false;
  const loc = String(s.label).replace(/razred$/, "razredu").replace(/letnik$/, "letniku");
  const q = s.stageUp === "SS" ? "Greš letos v srednjo šolo?" : s.stageUp === "UNI" ? "Si se vpisal na fakulteto?" : `Si zdaj v ${esc(loc)}?`;
  const yes = s.choose ? "Izberi fakulteto" : s.stageUp === "SS" ? "Da, v 1. letnik" : `Da, v ${esc(s.label)}`;
  const note =
    s.stageUp === "SS"
      ? "Učna pot se prestavi na 1. letnik (osnovna raven matematike; višjo izbereš v Nastavitvah)."
      : s.stageUp === "UNI"
        ? "Izberi univerzo, fakulteto in program; učna pot bo sledila tvojemu predmetniku."
        : "Učna pot se prestavi na snov novega letnika. Osvojene teme ostanejo shranjene.";
  box.innerHTML = `
    <div class="card level-card">
      <div class="lc-head"><span class="lc-ic">${icon("circle-arrow-up")}</span>
        <div><span class="eyebrow">${s.study ? "Novo študijsko leto" : "Novo šolsko leto"} ${esc(s.schoolYear)}</span><h2>${q}</h2></div></div>
      <p class="muted">Zdaj imaš nastavljeno: ${esc(s.current)}. ${note}</p>
      <div class="actions">
        <button type="button" class="primary" data-lc="yes">${yes}</button>
        <button type="button" class="secondary" data-lc="no">Ne, ostajam</button>
      </div>
    </div>`;
  box.hidden = false;
  const dismiss = () => {
    lsSet(lsKey(o.studentId, s.schoolYear), "1");
    box.hidden = true;
    box.innerHTML = "";
  };
  box.querySelector('[data-lc="no"]').onclick = dismiss;
  box.querySelector('[data-lc="yes"]').onclick = async (e) => {
    e.target.disabled = true;
    dismiss();
    if (s.choose) o.onChoose(s);
    else await o.onApply(s);
  };
  return true;
}
