// Razvrstitev orodij kalkulatorja po predmetih in temah ter iskanje (brez DOM; testi v test/orodja-iskanje.test.js).
// Orodja po predmetih in temah (j 28. 11.: »naj bodo orodja urejena po predmetih in temah, da ne bodo vsa v eni
// predolgi vrsti«): predmet → tema → orodja. Isto orodje je lahko pri več predmetih (enote pri fiziki in kemiji).
// Prvo orodje predmeta je privzeto (matematika: enačbe, fizika: enote, kemija: enačbe reakcij).
export const TOOL_GROUPS = {
  MAT: [
    ["alg", ["eq", "complex", "matrix", "base"]],
    ["ana", ["calc", "table", "ode"]],
    ["geo", ["vec", "plot3"]],
    ["stat", ["stats", "sheet", "tests", "prob", "trials"]],
    ["fin", ["tvm"]],
  ],
  FIZ: [
    ["meas", ["units", "err", "stats", "table"]],
    ["mech", ["vec", "eq", "calc", "ode"]],
  ],
  KEM: [
    ["rxn", ["rxn"]],
    ["sol", ["conc", "solub"]],
    ["kcalc", ["units", "err", "eq", "stats"]],
  ],
};
/** Iskanje brez šumnikov in velikih črk: »ENACBE« najde »Enačbe«. */
export const fold = (x) => String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
/** Predmet in tema, kjer je orodje k: najprej pri predmetu prefer (učenčev predmet), sicer prvi, ki ga ima. */
export function toolPlace(k, prefer = "MAT") {
  for (const s of [prefer, ...Object.keys(TOOL_GROUPS)]) {
    const g = (TOOL_GROUPS[s] || []).find(([, l]) => l.includes(k));
    if (g) return { subj: s, topic: g[0] };
  }
  return null;
}
