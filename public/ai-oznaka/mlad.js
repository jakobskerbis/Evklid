// OŠ 1.–5. razred (tudi tuj šolski sistem z istim letom šolanja): oznaka AI s preprostejšim besedilom
// (public/ai-oznaka/ai-oznaka.js, mobilna aplikacija mobile/src/lib/ai-oznaka.ts).
import { jeOs } from "../stopnja.js";
import { isRegional, gradeInfo } from "../regions.js";

export function mlad(s = {}) {
  if (isRegional(s.school_system)) {
    const y = gradeInfo(s.school_system, s.curriculum_level)?.level;
    return !!y && y <= 5;
  }
  return jeOs(s) && /^[1-5]\./.test(String(s.curriculum_level || "").trim());
}
