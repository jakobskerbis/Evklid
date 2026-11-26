// K-04 (načrt kakovosti po reviziji): kateri preverjevalnik ne dela, za /healthz/stanje. Ob izpadu nobena trditev ne
// dobi višjega statusa, kot ga dovoljujejo dokazi (test/odpoved-preverjevalnikov.test.js); tu je le, da skrbnik vidi,
// zakaj je več trditev »Nepreverjeno«.
//
//   sympy  računsko preverjanje (server/cas.js): izklopljen (EVKLID_CAS=0), zadnji zagon ni uspel ali vsaj
//          NIZ_NEUSPEHOV zahtev zapored brez odgovora (zatikanje, sesutje) → ne dela; null = še ni bil zagnan
//          (Straža, scripts/straza.mjs, gleda le cas.deluje: ena prepočasna naloga ne sproži alarma)
//   lean   dokazi Lean ob lekcijah (lean/Evklid/Lekcije, docs/lean.md): Lean ne teče na strežniku, oznaka »Formalno
//          dokazano« izhaja iz dokazov v repozitoriju, ki jih preveri CI (lean.yml); nič dokazov → ne dela
//   model  AI, ki sestavi rešitev (server/zdravje.js ai): sam nikoli ne določi statusa; ob izpadu rešitve ni
import { casStanje } from "./cas.js";
import { leanDokazi } from "./oznake-vsebine.js";

export const NIZ_NEUSPEHOV = 3;

export function stanjePreverjevalnikov({ cas = casStanje(), ai = null, lean = null } = {}) {
  let dokazov = lean;
  if (dokazov === null) {
    try {
      dokazov = leanDokazi().size;
    } catch {
      dokazov = 0;
    }
  }
  const out = {
    sympy: {
      deluje: cas?.vklopljen === false || (cas?.neuspesnih ?? 0) >= NIZ_NEUSPEHOV ? false : (cas?.deluje ?? null),
      vklopljen: cas?.vklopljen !== false,
      ...(cas?.neuspesnih ? { neuspesnih: cas.neuspesnih, razlog: cas.razlog } : {}),
    },
    lean: { deluje: dokazov > 0, dokazov },
    model: { deluje: ai ? ai.deluje !== false : null },
  };
  out.nedelujejo = Object.keys(out).filter((k) => out[k].deluje === false);
  return out;
}
