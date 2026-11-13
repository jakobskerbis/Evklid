// Besedilo, ki na zaslonu nima prostora, se samodejno pokaže v celoti v pojavnem oknu (mirna animacija).
// En pomočnik za tri primere (docs/oblikovanje.md, »Besedilo vedno vidno«):
// - vnos v Inštruktorju je višji od največje višine polja: večje polje, usklajeno z #input;
// - besedilo naloge ne gre nad odprto ploščo za vnos (telefon);
// - odgovor inštruktorja ne gre v vidni del klepeta, ko je odprta tipkovnica.
// Okno se odpre enkrat na dogodek: ko ga učenec zapre, ostane zaprto, dokler se besedilo bistveno ne spremeni.
import { t } from "./i18n.js";
import { icon } from "./icons.js";

const dismissed = new Map(); // vrsta → { sig, len }
let cur = null; // { kind, sig, el, field, sync }

const vv = () => window.visualViewport || { height: window.innerHeight, offsetTop: 0 };

/** Ali je okno te vrste odprto. */
export const fullOpen = (kind) => cur?.kind === kind;

function wasDismissed(kind, sig, len) {
  const d = dismissed.get(kind);
  if (!d || d.sig !== sig) return false;
  return Math.abs(len - d.len) < 40; // bistvena sprememba: vsaj 40 znakov več ali manj
}

/** Zapre okno (dismiss: učenec ga je zaprl sam, zato se ne odpre znova za isto besedilo). */
export function closeFull({ dismiss = false } = {}) {
  if (!cur) return;
  const c = cur;
  cur = null;
  if (dismiss) dismissed.set(c.kind, { sig: c.sig, len: c.len() });
  c.field?.removeEventListener("input", c.fromField);
  window.visualViewport?.removeEventListener("resize", c.place);
  window.removeEventListener("resize", c.place);
  c.el.remove();
  if (c.field && c.focused) {
    const pos = c.area.selectionStart;
    c.field.focus({ preventScroll: true });
    try {
      c.field.setSelectionRange(pos, pos);
    } catch {}
  }
}

/**
 * Pokaže besedilo v celoti.
 * kind: "composer" | "task" | "reply"; sig: id besedila (naloga, sporočilo; pri vnosu prazen niz);
 * title: naslov; html: vsebina za branje; field: <textarea>, ki ga okno ureja (vnos).
 */
export function showFull({ kind, sig = "", title, html = "", field = null }) {
  const len = () => (field ? field.value.length : html.length);
  if (cur?.kind === kind && cur.sig === sig) return;
  if (wasDismissed(kind, sig, len())) return;
  closeFull();
  const el = document.createElement("div");
  el.className = `razpri razpri-${kind}`;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", title);
  el.innerHTML = `<div class="razpri-head"><b dir="auto"></b><button type="button" class="razpri-x" aria-label="${t("full.close")}" title="${t("full.close")}">${icon("x")}</button></div>
    ${field ? `<textarea class="razpri-area" dir="auto"></textarea>` : `<div class="razpri-body" dir="auto"></div>`}`;
  el.querySelector("b").textContent = title;
  const c = { kind, sig, el, field, len, focused: false };
  if (field) {
    const area = el.querySelector("textarea");
    c.area = area;
    area.value = field.value;
    area.placeholder = field.placeholder;
    // Usklajeno v obe smeri: polje spodaj ostane vir za pošiljanje.
    area.addEventListener("input", () => {
      field.value = area.value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    c.fromField = () => {
      if (area.value !== field.value) area.value = field.value;
    };
    field.addEventListener("input", c.fromField);
    area.addEventListener("keydown", (e) => {
      // Enter pošlje kot v polju spodaj (Shift+Enter nova vrstica).
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        closeFull();
        field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
      }
    });
  } else el.querySelector(".razpri-body").innerHTML = html;
  el.querySelector(".razpri-x").addEventListener("click", () => closeFull({ dismiss: true }));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeFull({ dismiss: true });
    }
  });
  // Okno je v vidnem delu zaslona (nad tipkovnico).
  c.place = () => {
    const v = vv();
    el.style.top = `${Math.round(v.offsetTop + 10)}px`;
    el.style.maxHeight = `${Math.round(v.height * (field ? 0.62 : 0.8))}px`;
    if (field) el.style.height = el.style.maxHeight; // večje polje: čim več vrstic hkrati
  };
  c.place();
  window.visualViewport?.addEventListener("resize", c.place);
  window.addEventListener("resize", c.place);
  document.body.append(el);
  cur = c;
  // Pri vnosu pisanje teče naprej v večjem polju (tipkovnica ostane odprta, kazalec na istem mestu).
  if (field && document.activeElement === field) {
    const pos = field.selectionStart;
    c.focused = true;
    c.area.focus({ preventScroll: true });
    c.area.setSelectionRange(pos, pos);
    c.area.scrollTop = c.area.scrollHeight;
  }
}
