// Igre po stopnji učenca (j, 2. 11. 2026): igre ostanejo za vse stopnje, a se jim prilagodijo.
// OŠ: igriv videz, vsaka igra se začne lahko. SŠ in fakulteta: resnejši videz (games.css, .gm-calm),
// igra se začne na težji ravni in hitreje preide na težje naloge. Ravni nalog so 1–3 (topics.js).
export const STAGES = {
  os: { minTier: 1, tierUp: 5, calm: false },
  ss: { minTier: 2, tierUp: 4, calm: true },
  faks: { minTier: 3, tierUp: 3, calm: true },
};

// Stopnja iz nastavitev profila (regijski sistemi imajo educational_track izračunan iz razreda).
export function stageOf(settings) {
  const track = settings?.educational_track;
  return track === "UNIVERZA" ? "faks" : track === "SREDNJA_SOLA" ? "ss" : "os";
}

// Začetna raven igre: shranjena raven pojma, a ne pod najnižjo za stopnjo.
export const startTierFor = (stage, saved) => Math.min(3, Math.max(STAGES[stage]?.minTier || 1, saved || 1));

// Stikalo »Skrij igre« (nastavitev profila games: on | off).
export const gamesOn = (settings) => settings?.games !== "off";

// Prenos v ozadju (igre, orodja, 3D; public/app.js): samo na hitri povezavi brez omejitve podatkov (Wi-Fi, računalnik).
// Ne ob varčevanju s podatki, na počasni povezavi (2G, 3G) in na mobilnih podatkih, kjer brskalnik to pove
// (navigator.connection.type; večina brskalnikov tega ne pove, takrat odloča hitrost). Tam se vse naloži ob uporabi
// (lahek zagon, j 17. 11. 2026). Kar učenec izrecno uporabi ali prenese za delo brez povezave, se naloži vedno.
export const backgroundLoadOk = (c) => !c || !(c.saveData || /^(slow-2g|2g|3g)$/.test(c.effectiveType || "") || c.type === "cellular");
