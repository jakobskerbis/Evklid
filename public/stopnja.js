// Stopnja profila: OŠ, SŠ ali faks (j 2026-11-01, načrt »Delitev na OŠ, SŠ in faks«).
// Edino mesto, ki bere educational_track: vsa preverjanja »ali je faks / SŠ / OŠ« gredo prek te
// datoteke (strežnik, spletna aplikacija in mobilna aplikacija). test/stopnja.test.js prepove nova
// neposredna primerjanja educational_track drugje.
//
// Vrednosti: "OS" (osnovna šola), "SS" (srednja šola), "FAKS" (fakulteta). Vrstni red je od nižje k višji.
export const STOPNJE = ["OS", "SS", "FAKS"];

// Vrednost educational_track v nastavitvah profila → stopnja (in nazaj).
const BY_TRACK = { OSNOVNA_SOLA: "OS", SREDNJA_SOLA: "SS", UNIVERZA: "FAKS" };
export const TRACK = { OS: "OSNOVNA_SOLA", SS: "SREDNJA_SOLA", FAKS: "UNIVERZA" };

// Nastavitve iz profila ({ settings }), iz nastavitev samih ali iz delnega popravka ({ educational_track }).
const settingsOf = (p) => (p && typeof p.settings === "object" && p.settings ? p.settings : p) || {};

/**
 * Stopnja profila iz educational_track; brez nje iz curriculum_level (»2. letnik VR« je SŠ), sicer OŠ.
 * @param {object|null|undefined} profile profil učenca, njegove nastavitve ali popravek nastavitev
 * @returns {"OS"|"SS"|"FAKS"}
 */
export function stopnja(profile) {
  const s = settingsOf(profile);
  const t = BY_TRACK[s.educational_track];
  if (t) return t;
  const level = String(s.curriculum_level || "");
  if (/\b(faks|fakulteta)\b/i.test(level)) return "FAKS";
  if (/letnik\s+(OR|VR)\b|\bSŠ\b/i.test(level)) return "SS";
  return "OS";
}

export const jeFaks = (p) => stopnja(p) === "FAKS";
export const jeSs = (p) => stopnja(p) === "SS";
export const jeOs = (p) => stopnja(p) === "OS";
// Ali je v profilu (ali popravku) stopnja sploh zapisana.
export const imaStopnjo = (p) => !!BY_TRACK[settingsOf(p).educational_track];

// Položaj stopnje (0 OŠ, 1 SŠ, 2 faks); neznana stopnja je OŠ.
export const rang = (level) => Math.max(0, STOPNJE.indexOf(level));
// Višja od dveh stopenj.
export const visja = (a, b) => (rang(a) >= rang(b) ? a : b);

// Stopnja teme po poti učnega načrta: »UNI-…« faks, »MAT-SS-2« SŠ, ostalo (OŠ, tekmovanja, regije) OŠ.
export function stopnjaPoti(path) {
  const p = String(path || "");
  if (p.startsWith("UNI-")) return "FAKS";
  return p.split("-")[1] === "SS" ? "SS" : "OS";
}

// Kratka oznaka stopnje za lige in učbenik (stari zapis »UNI« ostane v bazi lig).
export const STAGE_CODE = { OS: "OS", SS: "SS", FAKS: "UNI" };
export const stageCode = (p) => STAGE_CODE[stopnja(p)];
// SQL izraz, ki iz stolpca z nastavitvami (JSON) izračuna isto oznako kot stageCode.
export const stageCodeSql = (col) =>
  `CASE json_extract(${col}, '$.educational_track') WHEN 'SREDNJA_SOLA' THEN 'SS' WHEN 'UNIVERZA' THEN 'UNI' ELSE 'OS' END`;
