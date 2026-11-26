// Zapis naloge v polju za vnos na zaslonu Skeniraj (j 26. 11.: urejanje »kar v formuli, kot v klepetu«). Prebrana
// naloga je v obliki za razčlenjevalnik (»2*x^2-[?]*x-5=0«, »sqrt(x+7)«); v polju jo pokažemo v obliki, ki jo piše
// Evklidova tipkovnica (»2·x^2-□·x-5=0«, »√(x+7)«), da jo izris v polju (public/predogled-vnosa.js) pokaže kot formulo
// in da je tudi zapis za tipke berljiv. Spremembe so le tiste, pri katerih lastni reševalnik (public/scan/solvecore.js)
// in SymPy (server/cas/worker.py) dasta isti rezultat (test/scan-zapis-polja.test.js); π in ulomki ostanejo, kot so
// (»π« bi reševalnik pri sin bral v stopinjah, »(1,5)/(2)« ne razčleni).
import { NEJASNO } from "./nejasno.js";

// Oznaka nejasnega znaka v polju: en znak, ki ga učenec opazi in z eno tipko izbriše (v nalogi ostane [?]).
export const VIDNA_OZNAKA = "□";

export function lepZapis(text) {
  return String(text ?? "")
    .replace(/\*\*/g, "^")
    .replace(/(?<![\p{L}_])sqrt\s*\(/gu, "√(")
    .replace(/\s*\*\s*/g, "·")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥");
}

export const zaPolje = (text) => lepZapis(text).split(NEJASNO).join(VIDNA_OZNAKA);
export const izPolja = (value) => String(value ?? "").split(VIDNA_OZNAKA).join(NEJASNO);
