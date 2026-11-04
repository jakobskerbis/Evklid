import { jeFaks, jeSs } from "./stopnja.js";
// Cilj učenca (NPZ, matura, tekmovanje, izpit …) in neobvezni datum. Vpraša se enkrat ob novem profilu,
// spremeni ali izbriše se v Nastavitvah. Brez DOM: uporabljata ga strežnik (prompt, opomnik ob 12.00) in odjemalec.

export const GOALS = ["sprotno", "test", "npz", "matura", "tekmovanje", "izpit"];
export const DEFAULT_GOAL = "sprotno";

// Cilji, ki imajo smisel za izbrano šolo: OŠ ima NPZ, SŠ maturo, fakulteta izpit; regijski sistemi svoje izpite.
export function goalsFor(settings = {}) {
  if (jeFaks(settings)) return ["sprotno", "izpit"];
  if (settings.school_system && settings.school_system !== "SI") return ["sprotno", "test", "izpit"];
  if (jeSs(settings)) return ["sprotno", "test", "matura", "tekmovanje"];
  return ["sprotno", "test", "npz", "tekmovanje"];
}

export const validDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

// Dni do datuma (v lokalnem času naprave ali podanem »today« kot YYYY-MM-DD). null = ni datuma.
export function daysUntil(date, today = null) {
  if (!validDate(date)) return null;
  const t0 = today && validDate(today) ? Date.parse(`${today}T00:00:00Z`) : (() => {
    const d = new Date();
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  })();
  return Math.round((Date.parse(`${date}T00:00:00Z`) - t0) / 86400000);
}

// Slovenski zapis datuma: 1. 6. 2027
export const fmtDateSl = (s) => (validDate(s) ? s.split("-").map(Number).reverse().join(". ") : "");

const NAMES_SL = { sprotno: "sprotno učenje", test: "test v šoli", npz: "NPZ", matura: "matura", tekmovanje: "tekmovanje", izpit: "izpit" };

// Za sistemski prompt inštruktorja (slovensko, kot ostali prompt).
export function goalPrompt(settings = {}, today = null) {
  const g = GOALS.includes(settings.goal) ? settings.goal : DEFAULT_GOAL;
  if (g === DEFAULT_GOAL && !validDate(settings.goal_date)) return "";
  const n = daysUntil(settings.goal_date, today);
  const when = n === null ? "" : n < 0 ? ` (${fmtDateSl(settings.goal_date)}, že mimo)` : ` (${fmtDateSl(settings.goal_date)}, še ${n} dni)`;
  return `; cilj učenca: ${NAMES_SL[g]}${when}`;
}

// Domači zaslon po cilju (j, 1. 11.): ena aplikacija, isti videz; cilj določi le dve bližnjici na Učni poti
// in ali sta nad načini učenja (first) ali pod njimi. Nič se ne skrije, vse ostane tudi v meniju.
// Bližnjice: scan, games, chat, textbook, exams (NPZ in matura), izpiti (regijski izpiti), tek (tekmovalni trening), contest.
export function goalShortcuts(settings = {}) {
  const g = GOALS.includes(settings.goal) ? settings.goal : DEFAULT_GOAL;
  if (jeFaks(settings)) return { first: g === "izpit", items: ["textbook", "chat"] };
  if (settings.school_system && settings.school_system !== "SI")
    return g === "izpit" ? { first: true, items: ["izpiti", "scan"] } : { first: false, items: ["scan", "chat"] };
  if (g === "npz" || g === "matura") return { first: true, items: ["exams", "scan"] };
  if (g === "tekmovanje") return { first: true, items: ["tek", "contest"] };
  if (g === "test") return { first: false, items: ["scan", "chat"] };
  return { first: false, items: ["scan", "games"] };
}

// Telefon: četrti zavihek spodnje vrstice po cilju (lab, exams ali competition); kar ni tam, je pod »Jaz«.
export function goalTabbarView(settings = {}, { siExams = false } = {}) {
  if (jeFaks(settings) || (settings.school_system && settings.school_system !== "SI")) return "lab";
  if (siExams && (settings.goal === "npz" || settings.goal === "matura")) return "exams";
  if (settings.goal === "tekmovanje") return "competition";
  return "lab";
}
