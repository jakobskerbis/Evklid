// Grafi z drsniki v lekcijah (j, 11. 11. 2026): blok »:::risba graf« s ključem »drsnik:« strežnik izriše pri
// začetnih vrednostih (tisk, PDF, brez skript) in figuri doda telo bloka v data-risba. Tu pod sliko dodamo
// drsnike in ob premiku graf izrišemo znova z isto kodo kot strežnik (public/risbe-izris.js), zato je slika
// pri vsaki vrednosti matematično enaka strežniški. Izris vsako besedilo zapiše kot besedilo (brez HTML iz lekcije).
import { renderDrawing, fmt } from "./risbe-izris.js";

let zaporedna = 0;
const el = (tag, cls = "", text = "") => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};

function ozivi(fig) {
  const svg = fig.querySelector("svg.rs");
  const body = decodeURIComponent(fig.dataset.risba);
  const prva = renderDrawing("graf", body, { popustljivo: true });
  if (!svg || !prva.drsniki?.length) return;
  fig.dataset.ziva = "1";
  const cap = fig.querySelector("figcaption");
  const vrednosti = Object.fromEntries(prva.drsniki.map((d) => [d.name, d.value]));
  let caka = 0;
  const narisi = () => {
    caka = 0;
    try {
      const r = renderDrawing("graf", body, { vrednosti, popustljivo: true });
      svg.innerHTML = r.svg;
      svg.setAttribute("aria-label", r.opis);
      if (cap) cap.textContent = r.podnapis;
    } catch {
      // Ostane zadnja veljavna slika.
    }
  };
  const box = el("div", "rs-drsniki");
  for (const d of prva.drsniki) {
    const id = `rs-drsnik-${++zaporedna}`;
    const row = el("div", "rs-drsnik");
    const lab = el("label", "", d.label);
    lab.htmlFor = id;
    const out = el("output", "", fmt(d.value));
    out.htmlFor = id;
    out.setAttribute("aria-live", "off"); // vrednost pove že drsnik (aria-valuetext), ne dvakrat
    const inp = el("input");
    Object.assign(inp, { type: "range", id, min: String(d.lo), max: String(d.hi), step: String(d.step) });
    inp.value = String(d.value);
    inp.setAttribute("aria-valuetext", fmt(d.value));
    inp.addEventListener("input", () => {
      vrednosti[d.name] = Number(inp.value);
      const v = fmt(vrednosti[d.name]);
      out.textContent = v;
      inp.setAttribute("aria-valuetext", v);
      if (!caka) caka = requestAnimationFrame(narisi);
    });
    row.append(lab, out, inp);
    box.append(row);
  }
  svg.after(box);
}

/** Vsem grafom z drsniki pod »root« doda drsnike (vsakemu enkrat). Ob napaki ostane strežniška slika. */
export function oziviRisbe(root = document) {
  for (const fig of root.querySelectorAll("figure.risba-ziva[data-risba]")) {
    if (fig.dataset.ziva) continue;
    try {
      ozivi(fig);
    } catch {
      // Neveljaven zapis javi check-lesson.js; učenec vidi sliko pri začetnih vrednostih.
    }
  }
}
