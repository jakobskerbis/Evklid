// Dnevni opomnik ob 12.00 (Ljubljana) do datuma cilja: »Matura: še 215 dni. Danes 15 minut?«
// Pošlje se na e-naslov računa (starša), za vsakega otroka z vključenim opomnikom in datumom cilja.
// Učenec ga izklopi v Nastavitvah → Cilj; v aplikaciji je isti opomnik kartica na Učni poti (public/goal.js).
import { esc, layout, button } from "./email.js";
import { daysUntil, fmtDateSl, validDate, GOALS } from "../../public/goal-data.js";

const NAMES = { sprotno: "Sprotno učenje", test: "Test v šoli", npz: "NPZ", matura: "Matura", tekmovanje: "Tekmovanje", izpit: "Izpit" };

// Datum in ura v Ljubljani.
export function ljNow(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", hour12: false })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24 };
}

export const isNoonTime = (d = new Date()) => ljNow(d).hour >= 12;

const daysWord = (n) => (n % 100 === 1 ? "dan" : n % 100 === 2 ? "dneva" : n % 100 === 3 || n % 100 === 4 ? "dnevi" : "dni");

// Ali ima otrok danes opomnik? Vrne število dni do cilja ali null.
export function reminderDays(child, today) {
  const s = child?.settings || {};
  if (!s.goal_reminder || !validDate(s.goal_date)) return null;
  const n = daysUntil(s.goal_date, today);
  return n === null || n < 0 ? null : n;
}

export function buildGoalReminder(child, n, { appUrl }) {
  const s = child.settings;
  const goal = NAMES[GOALS.includes(s.goal) ? s.goal : "sprotno"];
  const left = n === 0 ? "danes je dan cilja" : `še ${n} ${daysWord(n)}`;
  const subject = `${goal}: ${left} · ${child.name}`;
  const text = `${child.name}: ${goal} ${fmtDateSl(s.goal_date)} – ${left}. Danes 15 minut vaje (Današnji trening) naredi veliko razliko. ${appUrl}\nOpomnik izklopite v aplikaciji: Nastavitve → Cilj.`;
  return {
    subject,
    text,
    html: layout(
      `${goal}: ${left}`,
      `<p>${esc(child.name)} ima cilj <b>${esc(goal)}</b> (${esc(fmtDateSl(s.goal_date))}).</p>
       <p>Danes 15 minut? Kratek Današnji trening ali ponovitev teme, ki jo predlaga Evklid, je dovolj.</p>${button(appUrl, "Odpri Evklid")}`,
      "Opomnik izklopite v aplikaciji: Nastavitve → Cilj → Dnevni opomnik ob 12.00.",
    ),
  };
}
