// Dnevni opomnik ob OPOMNIK_URA (public/goal-data.js, 16.00 v Ljubljani) do datuma cilja: »Matura: še 215 dni. Danes 15 minut?«
// Pošlje se na e-naslov računa (starša), za vsakega otroka z vključenim opomnikom in datumom cilja; ne, če je otrok
// ta dan že vadil (vadilDanes). Račun »Zame« (self: učenec je lastnik računa) nagovori v 2. osebi ednine.
// Učenec ga izklopi v Nastavitvah → Cilj; v aplikaciji je isti opomnik kartica na Učni poti (public/goal.js).
import { esc, layout, button } from "./email.js";
import { daysUntil, fmtDateSl, validDate, GOALS, OPOMNIK_URA } from "../../public/goal-data.js";
import { ljDay } from "./weekly.js";

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

// Ura pošiljanja (e-pošta in potisno obvestilo): od OPOMNIK_URA naprej, enkrat na dan.
export const isReminderTime = (d = new Date()) => ljNow(d).hour >= OPOMNIK_URA;

// UTC meje dneva »YYYY-MM-DD« v Ljubljani v zapisu datetime('now'): [začetek, konec). Polnoč v Ljubljani je
// 22.00 UTC (poletni čas) ali 23.00 UTC (zimski) prejšnji dan.
const utcText = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");
const ljStart = (date) => {
  const ms = Date.parse(`${date}T00:00:00Z`) - 2 * 3600000;
  return ljDay(ms) === date ? ms : ms + 3600000;
};
const nextDay = (date) => new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
export const ljDayBounds = (date) => [utcText(ljStart(date)), utcText(ljStart(nextDay(date)))];

// Ali je učenec na dan »YYYY-MM-DD« (Ljubljana) že vadil: XP, dogodek (vaja, klepet), naloga s poskusom ali lastno
// sporočilo inštruktorju. Ena poizvedba EXISTS, omejena na ta dan (indeksi po učencu in času; sporočila le v
// pogovorih, spremenjenih ta dan), pripravljena enkrat na bazo.
const vadilStmt = new WeakMap();
export function vadilDanes(db, studentId, date) {
  let st = vadilStmt.get(db);
  if (!st) {
    st = db.prepare(`SELECT EXISTS (SELECT 1 FROM xp_events WHERE student_id = $s AND created_at >= $od AND created_at < $do)
      OR EXISTS (SELECT 1 FROM events WHERE student_id = $s AND created_at >= $od AND created_at < $do)
      OR EXISTS (SELECT 1 FROM tasks WHERE student_id = $s AND attempts > 0 AND created_at >= $od AND created_at < $do)
      OR EXISTS (SELECT 1 FROM conversations c JOIN messages m ON m.conversation_id = c.id
        WHERE c.student_id = $s AND c.updated_at >= $od AND m.role = 'user' AND m.created_at >= $od AND m.created_at < $do) AS v`);
    vadilStmt.set(db, st);
  }
  const [od, doo] = ljDayBounds(date);
  return !!st.get({ s: studentId, od, do: doo }).v;
}

const daysWord = (n) => (n % 100 === 1 ? "dan" : n % 100 === 2 ? "dneva" : n % 100 === 3 || n % 100 === 4 ? "dnevi" : "dni");

// Ali ima otrok danes opomnik? Vrne število dni do cilja ali null.
export function reminderDays(child, today) {
  const s = child?.settings || {};
  if (!s.goal_reminder || !validDate(s.goal_date)) return null;
  const n = daysUntil(s.goal_date, today);
  return n === null || n < 0 ? null : n;
}

// self: račun »Zame« (učenec je sam lastnik računa) – tikanje, brez tretje osebe in brez imena v zadevi.
export function buildGoalReminder(child, n, { appUrl, self = false }) {
  const s = child.settings;
  const goal = NAMES[GOALS.includes(s.goal) ? s.goal : "sprotno"];
  const left = n === 0 ? "danes je dan cilja" : `še ${n} ${daysWord(n)}`;
  const off = `Nastavitve → Cilj → Dnevni opomnik ob ${OPOMNIK_URA}.00`;
  if (self)
    return {
      subject: `${goal}: ${left}`,
      text: `${goal} ${fmtDateSl(s.goal_date)} – ${left}. Danes 15 minut? Kratek Današnji trening naredi veliko razliko. ${appUrl}\nOpomnik izklopiš v aplikaciji: Nastavitve → Cilj.`,
      html: layout(
        `${goal}: ${left}`,
        `<p>Tvoj cilj je <b>${esc(goal)}</b> (${esc(fmtDateSl(s.goal_date))}).</p>
       <p>Danes 15 minut? Kratek Današnji trening ali ponovitev teme, ki ti jo predlaga Evklid, je dovolj.</p>${button(appUrl, "Odpri Evklid")}`,
        `Opomnik izklopiš v aplikaciji: ${off}.`,
      ),
    };
  const subject = `${goal}: ${left} · ${child.name}`;
  const text = `${child.name}: ${goal} ${fmtDateSl(s.goal_date)} – ${left}. Danes 15 minut vaje (Današnji trening) naredi veliko razliko. ${appUrl}\nOpomnik izklopite v aplikaciji: Nastavitve → Cilj.`;
  return {
    subject,
    text,
    html: layout(
      `${goal}: ${left}`,
      `<p>${esc(child.name)} ima cilj <b>${esc(goal)}</b> (${esc(fmtDateSl(s.goal_date))}).</p>
       <p>Danes 15 minut? Kratek Današnji trening ali ponovitev teme, ki jo predlaga Evklid, je dovolj.</p>${button(appUrl, "Odpri Evklid")}`,
      `Opomnik izklopite v aplikaciji: ${off}.`,
    ),
  };
}
