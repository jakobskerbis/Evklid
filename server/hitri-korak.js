// Poskus (j, 17. 11. 2026, privzeto IZKLOPLJEN): lahek prvi korak brez razmišljanja modela, da prvo besedilo pride
// prej. Velja samo, ko je EVKLID_HITRI_KORAK=1 in:
// - hitri model (Haiku: način »chat« ali »lite«, ne »Razloži podrobneje«, ne »think«, Sonnet ali Opus),
// - OŠ ali SŠ (ne fakulteta) in ne tekmovanja (tekmovalna smer ali tema),
// - način A (vodenje po korakih),
// - brez slike, in naš reševalnik je nalogo že točno rešil (presolve: model dobi rezultat v skriti opombi),
// - prvo sporočilo pogovora (pravi prvi korak): preklop razmišljanja sredi pogovora bi podrl predpomnilnik zgodovine.
// Kakovost potem varuje preverjanje bloka RACUN in koda (»Popravek«). Vklop odobri j po meritvi
// (scripts/meri-hitri-korak.mjs). To je usmerjanje AI: sprememba potrebuje dva pregleda in j-jevo potrditev.
import { jeFaks } from "../public/stopnja.js";

export const hitriKorakOn = () => process.env.EVKLID_HITRI_KORAK === "1";

// solveAsk: izrecna prošnja za rešitev v načinu A (server/nacin.js) zahteva celo rešitev, ne prvega koraka.
export function hitriKorak({ mode, settings = {}, pre = null, image = false, competition = false, isFirst = false, solveAsk = false }) {
  if (!hitriKorakOn() || !isFirst || solveAsk) return false;
  if (mode !== "chat" && mode !== "lite") return false;
  if (!pre?.problems?.length || image) return false;
  if (jeFaks(settings) || competition || settings.track === "COMPETITION") return false;
  return (settings.solving_mode || "A") !== "B";
}
