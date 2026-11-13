// Igra kot nagrada (j 2026-11-01): na koncu serije nalog, ko je opravljen dnevni trening ali dosežen
// dnevni cilj XP, kartica ponudi eno igro iz pravkar vadene snovi. Nikoli med učenjem, le ponudba.
// Majhen modul brez iger, ker ga app.js naloži ob zagonu (igre se naložijo šele ob kliku).
import { gamesOn } from "./stage.js";

// Pojmi za nagradno igro ali null (brez ponudbe). n = konec serije s strežnika (reward: pojmi
// pravkar vadenih tem, xp: današnji XP in cilj); xp = zadnji znani XP, če ga n nima.
export function rewardOffer(settings, mode, n, xp = null) {
  if (!gamesOn(settings) || !n?.reward?.length) return null;
  const x = n.xp || xp;
  const goalDone = !!(x && x.goal > 0 && x.today >= x.goal);
  return mode === "daily" || goalDone ? n.reward : null;
}
