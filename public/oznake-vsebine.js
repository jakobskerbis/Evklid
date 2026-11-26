// Poštene oznake vsebine v učbeniku in na naših polah (N-03; pravila so v server/oznake-vsebine.js, tu je samo izris).
// Strežnik pošlje seznam { id, ... }; neznane oznake se ne izrišejo, da stara stran nikoli ne pokaže več, kot je dokazano.
import { t, locale } from "./i18n.js";
import { dateText } from "./datum.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ikona: funkcija (ime) → SVG ali "" (učbenik in pole imata vsak svojo).
export function oznakeHtml(oznake, { ikona = () => "", vrsta = "lekcija" } = {}) {
  if (!Array.isArray(oznake) || !oznake.length) return "";
  const vrstica = [];
  const razlage = [];
  for (const o of oznake) {
    if (o?.id === "osnutek") {
      vrstica.push(`<span class="oz oz-osnutek">${ikona("pencil")}${esc(t("oz.osnutek"))}</span>`);
      razlage.push(t(vrsta === "pola" ? "oz.osnutekTipPola" : "oz.osnutekTip"));
    } else if (o?.id === "pregledal_ai") {
      vrstica.push(`<span class="oz oz-ai">${ikona("sparkles")}${esc(t("oz.pregledalAi"))}</span>`);
      razlage.push(t("oz.pregledalAiTip"));
    } else if (o?.id === "strojno" && Number.isInteger(o.koraki) && o.koraki > 0) {
      vrstica.push(`<span class="oz oz-strojno">${ikona("list-checks")}${esc(t("oz.strojno"))}</span>`);
      razlage.push(t("oz.strojnoTip", { n: o.koraki }));
    } else if (o?.id === "strokovno" && o.datum) {
      vrstica.push(`<span class="oz oz-strokovno">${ikona("badge-check")}${esc(t("oz.strokovno"))}</span>`);
      razlage.push(t("oz.strokovnoTip", { datum: dateText(o.datum, locale()) }));
    } else if (o?.id === "formalno" && Number.isInteger(o.izreki) && o.izreki > 0) {
      vrstica.push(`<span class="oz oz-formalno">${ikona("sigma")}${esc(t("oz.formalno", { n: o.izreki }))}</span>`);
      razlage.push(t("oz.formalnoTip", { n: o.izreki }));
    }
  }
  if (!vrstica.length) return "";
  // Brez strokovnega pregleda to vedno piše na vidnem mestu, ne samo v razlagi.
  if (!oznake.some((o) => o?.id === "strokovno")) {
    vrstica.push(`<span class="oz oz-ni">${esc(t("oz.niStrokovnoCip"))}</span>`);
    razlage.push(t(vrsta === "pola" ? "oz.niStrokovnoPola" : "oz.niStrokovno"));
  }
  return `<details class="oz-vrstica"><summary><span class="oz-cipi">${vrstica.join("")}</span><span class="oz-kaj">${esc(t("oz.kaj"))}</span></summary><ul class="oz-razlage">${razlage.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></details>`;
}
