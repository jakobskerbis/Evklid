// Začetna stran (Učna pot) po stopnji (j 2026-11-01, načrt »Delitev na OŠ, SŠ in faks«): isti videz in iste
// kartice, drug vrstni red, in ena kartica stopnje (#stage-card). Nič se ne skrije: vse ostane v zavihkih in pod Jaz.
// - OŠ: učna pot z današnjim treningom, igre, urnik.
// - SŠ: testi iz Urnika (ko je test v 14 dneh), priprava na maturo, učna pot.
// - Faks: Moj študij z izpitnimi roki, urnik, učna pot.
import { icon } from "./icons.js";
import { levelProgress } from "./xp-levels.js";
import { goalShortcuts, daysUntil, ponudiMaturo } from "./goal-data.js";

// Kartice med glavo učne poti in izbiro načina (#modebar), od zgoraj navzdol. Kartice, ki jih ni na seznamu
// (cilj, predlog prehoda), ostanejo nad njimi; mnenje in namestitev gresta tik pod #xp-card (uvrstiKartice).
export const VRSTNI_RED = {
  OS: ["xp-card", "stage-card", "schedule-card"],
  SS: ["xp-card", "schedule-card", "stage-card"],
  SS_TEST: ["schedule-card", "stage-card", "xp-card"],
  FAKS: ["stage-card", "schedule-card", "xp-card"],
};

// Vrste dogodkov v Urniku, ki štejejo kot test (enako kot public/schedule.js) in kot izpitni rok na faksu.
const TESTI = ["test", "kolokvij", "izpit", "ustno"];
const IZPITI = ["kolokvij", "izpit", "ustno"];

/**
 * Vrstni red kartic za stopnjo. SŠ: Urnik gre na vrh le, ko je v njem test v naslednjih 14 dneh.
 * @param {"OS"|"SS"|"FAKS"} level
 * @param {{ upcoming?: Array<{kind: string, daysLeft: number}> }|null} schedule pogled Urnika s strežnika
 */
export function vrstniRed(level, schedule = null) {
  if (level === "SS") {
    const test = (schedule?.upcoming || []).some((e) => TESTI.includes(e.kind) && e.daysLeft >= 0 && e.daysLeft <= 14);
    return test ? VRSTNI_RED.SS_TEST : VRSTNI_RED.SS;
  }
  return VRSTNI_RED[level] || VRSTNI_RED.OS;
}

/** Premakne kartice v .path-side v dani vrstni red (tik pred #modebar ali pred bližnjicami cilja tik nad njim). */
export function uvrstiKartice(side, order) {
  const bar = side?.querySelector("#modebar");
  if (!bar) return;
  // Bližnjice za cilj (#goal-modes, app.js renderGoalModes) ostanejo tik nad izbiro načina.
  const goal = side.querySelector("#goal-modes");
  const anchor = goal && goal.nextElementSibling === bar ? goal : bar;
  for (const id of order) {
    const el = side.querySelector(`#${id}`);
    if (el && el.parentElement === side) side.insertBefore(el, anchor);
  }
  // Mnenje in namestitev nikoli nad glavnim dejanjem (j, 20. 11. 2026): tik pod današnjim treningom (#xp-card).
  const xp = side.querySelector("#xp-card");
  for (const id of ["install-card", "feedback-card"]) {
    const el = side.querySelector(`#${id}`);
    if (el && xp && el.parentElement === side) side.insertBefore(el, xp.nextElementSibling);
  }
}

// Pogledi, ki jih kartica stopnje že odpre (ključi kot v goalShortcuts, public/goal-data.js): bližnjice za cilj
// jih ne ponovijo.
export function stageRows(level, { games = true, exams = true } = {}) {
  if (level === "OS") return games ? ["games"] : [];
  if (level === "SS") return exams ? ["exams"] : [];
  if (level === "FAKS") return ["textbook"];
  return [];
}

// Izpitno obdobje, ki je pred študentom (slovenske fakultete): zimsko januar–februar, poletno junij–julij,
// jesensko avgust–september. Mesec 0–11.
export function izpitnoObdobje(month) {
  if (month >= 2 && month <= 6) return "summer";
  if (month === 7 || month === 8) return "autumn";
  return "winter";
}

/** Izpitni roki iz Urnika (kolokviji, izpiti, ustni), najbližji prvi, največ n. */
export function izpitniRoki(schedule, n = 3) {
  return (schedule?.upcoming || []).filter((e) => IZPITI.includes(e.kind) && e.daysLeft >= 0).slice(0, n);
}

const when = (t, n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));
const row = (go, ic, title, sub, esc) =>
  `<button type="button" class="list-row" data-home-go="${go}"><span class="ic">${icon(ic)}</span><span class="lr-text"><b>${esc(title)}</b><small>${esc(sub)}</small></span>${icon("chevron-right")}</button>`;

/**
 * HTML kartice stopnje ali "" (ni kartice).
 * @param {"OS"|"SS"|"FAKS"} level
 * @param {{ games: boolean, exams: boolean, schedule: object|null, t: Function, esc: (s: string) => string, now?: Date }} o
 *   games: igre niso skrite; exams: zavihek »NPZ in matura« obstaja (slovenski šolski sistem)
 */
export function stageCardHtml(level, o) {
  const { esc, t } = o;
  if (level === "OS") return o.games ? `<div class="card list-card stage-card">${row("games", "gamepad-2", t("nav.games"), t("home.gamesSub"), esc)}</div>` : "";
  if (level === "SS") return o.exams ? `<div class="card list-card stage-card">${row("exams", "graduation-cap", t("home.matura"), t("home.maturaSub"), esc)}</div>` : "";
  if (level !== "FAKS") return "";
  const roki = izpitniRoki(o.schedule);
  const period = izpitnoObdobje((o.now || new Date()).getMonth());
  const list = roki.length
    ? `<ul class="stage-exams">${roki.map((e) => `<li><span class="se-name">${esc(e.name)}</span><span class="se-when">${esc(when(t, e.daysLeft))}</span></li>`).join("")}</ul>`
    : `<p class="muted stage-note">${esc(t("home.examsNone"))} ${esc(t(`home.period.${period}`))}</p>`;
  return `<div class="card list-card stage-card">
    ${row("textbook", "book-open", t("tbk.myStudy"), t("home.studySub"), esc)}
    <div class="stage-exams-box">
      <button type="button" class="sch-card-head" data-home-go="schedule"><span class="eyebrow">${esc(t("home.examsTitle"))}</span>${icon("chevron-right")}</button>
      ${list}
      ${roki.length ? "" : `<button type="button" class="secondary small" data-home-go="schedule">${icon("calendar-days")}${esc(t("home.examsAdd"))}</button>`}
    </div>
  </div>`;
}

// Izris cele Učne poti v nizih HTML, skupen brskalniku in strežniku (naloga hitrost, j 20. 11. 2026: »vsaj 30 %, 60 %,
// če gre, brez padca kakovosti«). public/app.js z njim izriše Učno pot; server/pot-takoj.js iz istih funkcij in istih
// podatkov sestavi Učno pot v prvem odgovoru strani (prijavljen učenec ob prvem obisku jo vidi, preden se app.js sploh
// prenese). Ker je izris en sam, se pogleda ne moreta razlikovati (test/pot-takoj.test.js primerja oba izrisa).
// Brez DOM in brez globalnega stanja: besedila (t), jezik in podatki pridejo kot argumenti. Ta modul uvozi samo module
// brez DOM (strežnik ga uvozi tudi), zato tu ni public/i18n-osnova.js.
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const escN = (s) => esc(s ?? "");

// Stanja vozlišč na poti: [ikona, napis].
export const nodeNames = (t) => ({
  due: ["rotate-ccw", t("node.due")],
  mastered: ["check", t("node.mastered")],
  learning: ["pencil", t("node.learning")],
  new: ["play", t("node.new")],
});
export const levelNames = (t) => ({ 1: t("level.1"), 2: t("level.2"), 3: t("level.3") });

// ---------- XP: raven, dnevni cilj, teden, niz dni (kartica na Učni poti, stran Jaz) ----------

// Raven z vrstico napredka. prev: prejšnji povzetek, da se vrstica napolni od prejšnjega stanja (ob novi ravni od začetka).
export function levelRowHtml(t, x, prev = null) {
  const lp = levelProgress(x.total);
  const before = prev && levelProgress(prev.total).level === lp.level ? levelProgress(prev.total).pct : 0;
  return `<div class="lvl-row">
    <span class="lvl-badge" aria-hidden="true">${icon("star")}<b>${lp.level}</b></span>
    <div class="lvl-main">
      <div class="lvl-top"><b>${escN(t("xp.level", { n: lp.level }))}</b><span>${escN(t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 }))}</span></div>
      <div class="lvl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${lp.pct}" aria-label="${escN(t("xp.toNext", { xp: lp.to - x.total, n: lp.level + 1 }))}"><i style="--p:${lp.pct / 100};--from:${before / 100}"></i></div>
    </div>
  </div>`;
}

// Dnevni cilj: krog, ki se polni z današnjim XP (ob doseženem cilju zlat s kljukico).
export function goalRingHtml(t, x) {
  const goal = x.goal || 50;
  const today = x.today || 0;
  const pct = Math.min(100, Math.round((today / goal) * 100));
  const done = today >= goal;
  return `<div class="goal-cell${done ? " done" : ""}">
    <span class="goal-ring" style="--p:${pct}" role="img" aria-label="${escN(t("xp.goalShort", { today, goal }))}">${done ? icon("check") : `<b>${today}</b>`}</span>
    <span>${escN(t("xp.goalShort", { today, goal }))}</span>
  </div>`;
}

export function xpStatsHtml(t, x, prev = null) {
  return `${levelRowHtml(t, x, prev)}
    <div class="stats-row">
      ${goalRingHtml(t, x)}
      <div><b>${x.week}</b><span>${escN(t("stats.week"))}</span></div>
      <div><b>${x.streak}</b><span>${escN(t("stats.streak", { n: x.streak }))}</span></div>
    </div>`;
}

// ---------- Učna pot ----------

// Napis poti v jeziku učenca: »Matematika, 2. letnik« → »Mathematics, Year 2« (oznaka poti s strežnika je slovenska).
// own: pot iz seznama poti (/api/paths), p: učna pot (/api/students/:id/path), rtl: pisava od desne proti levi.
export function pathLevelText(t, own, p, rtl = false) {
  const lvl = /^(.+), (\d+\. (?:razred|letnik).*)$/.exec(own?.label || "");
  if (!lvl) return own?.label || p.label || "";
  const subj = own.subject && ["MAT", "FIZ", "KEM", "NAR", "BIO", "GEO", "RAC", "EKO"].includes(own.subject) ? t(`subj.${own.subject}`) : lvl[1];
  return [subj || lvl[1], levelLabel(t, lvl[2])].join(rtl ? "، " : ", ");
}

// »8. razred« → »Grade 8« (public/level-picker.js levelLabel, isti zapis).
export function levelLabel(t, level) {
  const m = /^(\d+)\. (razred|letnik)(.*)$/.exec(String(level || ""));
  if (!m) return String(level || "");
  return t(m[2] === "razred" ? "lp.grade" : "path.year", { n: m[1] }) + m[3];
}

// Odštevanje do datuma cilja: »še 215 dni« / »danes« / »datum je že mimo« / "" brez datuma (public/goal.js countdown).
export function odstevanje(t, date, today = null) {
  const n = daysUntil(date, today);
  if (n === null) return "";
  if (n < 0) return t("goal.past");
  if (n === 0) return t("goal.today");
  return t("goal.left", { n });
}

// Vrh Učne poti (#xp-card, p = /path): [kartica, vrstica pod njo]. Navadno Današnji trening in »Naslednja tema«.
// Pri cilju matura kartica »Danes« (j, 20. 11. 2026): odštevanje do mature (goalDate), korak za danes (najprej
// ponavljanje, kar je na vrsti, nato tema iz »Najprej vadi« na strani NPZ in matura, dokler nobena še ni vadena pa tema Učne poti; podatki: /path → danes), približne
// minute in en gumb, po vsaj 3 dneh odsotnosti kratek pozdrav; Današnji trening je tedaj vrstica pod njo.
export function heroHtml(t, p, done = false, goalDate = "") {
  const d = p.danes;
  if (!d || (!d.due && !d.next))
    return [
      `<div class="hero">
      <div class="hero-icon">${icon("zap")}</div>
      <div class="hero-text"><h2>${t("daily.title")}</h2><p>${done ? t("daily.doneText") : t("daily.text")}</p></div>
      <button class="primary big" data-daily>${done ? t("daily.again") : t("daily.start")}</button>
    </div>`,
      p.next
        ? `<button class="next-row" data-open="${escN(p.next.id)}"><span class="eyebrow">${t("path.next")}</span><span class="next-name">${escN(p.next.name)}</span>${icon("chevron-right")}</button>`
        : `<div class="next-row done">${icon("trophy")}<span class="next-name">${t("path.allDone")}</span></div>`,
    ];
  const when = [t("goal.matura"), odstevanje(t, goalDate)].filter(Boolean).join(" · ");
  const min = escN(t("danes.min", { n: d.minutes }));
  const back = d.odsoten >= 3 ? `<p class="danes-back">${escN(t(d.due ? "danes.back" : "danes.backHi"))}</p>` : "";
  const step = d.due
    ? `<p><b>${escN(t("mode.reviewBadge", { n: d.review }))}</b> · ${min}</p>${d.next ? `<p>${escN(t("danes.then", { topic: d.next.name }))}</p>` : ""}`
    : `<p><b>${escN(t("danes.next", { topic: d.next.name }))}</b> · ${min}</p>`;
  const btn = d.due
    ? `<button class="primary big" data-danes-review>${escN(t("danes.review"))}</button>`
    : `<button class="primary big" data-danes-topic="${escN(d.next.id)}">${escN(t("ready.practice"))}</button>`;
  return [
    `<div class="hero danes">
      <div class="hero-icon">${icon("target")}</div>
      <div class="hero-text"><h2>${escN(t("danes.title"))}</h2><p>${escN(when)}</p>${back}${step}</div>
      ${btn}
    </div>`,
    `<button type="button" class="next-row" data-daily><span class="eyebrow">${escN(t("daily.title"))}</span><span class="next-name">${escN(t(done ? "daily.doneTitle" : "daily.about"))}</span>${icon("zap")}</button>`,
  ];
}

// Kartica na vrhu Učne poti (#xp-card): Današnji trening ali »Danes« (heroHtml) z vrsticami pod njo. o: { p (učna pot),
// done (trening danes opravljen), scan (zaslon skenerja obstaja), games (igre vklopljene), goalDate (datum cilja) }.
export function xpCardHtml(t, { p, done, scan, games, goalDate = "" }) {
  const [hero, row] = heroHtml(t, p, done, goalDate);
  return `
    ${hero}
    ${scan ? `<button type="button" class="next-row scan-path-row" data-scan-home><span class="eyebrow">${t("scan.title")}</span><span class="next-name">${t("scan.meSub")}</span>${icon("camera")}</button>` : ""}
    ${row}
    ${games ? `<button type="button" class="next-row dz-path-row" data-dnevna><span class="eyebrow">${t("dz.title")}</span><span class="next-name">${t("dz.statusNew")}</span>${icon("puzzle")}</button>` : ""}
    <div class="xp-stats">${xpStatsHtml(t, p.xp)}</div>`;
}

// Ponudba za star profil maturanta s privzetim ciljem (goal-data.js ponudiMaturo) v #goal-reminder: en dotik nastavi
// cilj matura. Drugim profilom "". Brez ure naprave, zato jo izriše tudi strežnik (server/pot-takoj.js).
export function maturaPonudbaHtml(t, settings) {
  if (!ponudiMaturo(settings)) return "";
  return `<span class="gr-ic" aria-hidden="true">${icon("target")}</span>
    <div class="gr-body">
      <b>${escN(t("danes.offerTitle"))}</b>
      <span>${escN(t("danes.offerText"))}</span>
      <div class="actions"><button type="button" class="primary small" data-matura-offer="yes">${escN(t("danes.offerYes"))}</button><button type="button" class="ghost small" data-matura-offer="no">${escN(t("danes.offerNo"))}</button></div>
    </div>`;
}

// Legenda in sklopi poti (brez kartice dejstev na dnu, ta je naključna: factHtml).
export function pathUnitsHtml(t, p) {
  const NODE = nodeNames(t);
  const LEVEL_NAMES = levelNames(t);
  return (
    `<div class="legend">${["mastered", "learning", "due"].map((k) => `<span class="lg ${k}">${icon(NODE[k][0])}${NODE[k][1]}</span>`).join("")}</div>` +
    p.units
      .map((u, ui) => {
        const rel = u.topics.filter((t) => t.practice).length ? u.topics.filter((t) => t.practice) : u.topics;
        const nDone = rel.filter((t) => t.status === "mastered").length;
        const pct = Math.round(u.progress * 100);
        return `<section class="unit card ${u.ahead ? "ahead" : ""} ${u.mastered ? "mastered" : ""}">
        <div class="unit-head">
          <div class="ring" style="--p:${pct}">${u.mastered ? icon("award") : `<span>${pct}%</span>`}</div>
          <div class="unit-title"><span class="eyebrow">${t("unit.label", { n: ui + 1 })}</span><h2>${esc(u.title)}</h2>
            <span class="muted">${u.suggest ? t("unit.aheadNote", { unit: `<bdi>${esc(u.suggest.unit)}</bdi>` }) : t("unit.progress", { done: nDone, total: rel.length })}</span></div>
        </div>
        <ol class="path">
          ${u.topics
            .map((tp) => {
              const st = tp.due ? "due" : tp.status;
              const isNext = p.next && p.next.id === tp.id;
              const sub = NODE[st][1] + (tp.practice && tp.status === "learning" ? ` · ${LEVEL_NAMES[tp.level]}` : "");
              return `<li><button class="node ${st} ${isNext ? "current" : ""}" data-open="${tp.id}">
                <span class="node-dot">${icon(NODE[st][0])}</span>
                <span class="node-text"><span class="node-name">${esc(tp.name)}</span><span class="node-sub">${isNext ? t("node.nextPrefix") : ""}${sub}</span></span>
              </button></li>`;
            })
            .join("")}
        </ol>
        <div class="unit-actions">
          ${u.hasPractice && u.started ? `<button class="secondary small" data-unit="${ui}">${icon("puzzle")}${t("unit.practice")}</button>` : ""}
          ${u.hasPractice && !u.mastered ? `<button class="secondary small" data-placement="${ui}">${icon("target")}${u.ahead ? t("unit.skipTest") : t("unit.test")}</button>` : ""}
        </div>
      </section>`;
      })
      .join("")
  );
}

// Privzeti nabor dejstev (Grški matematiki: greek.f1 … greek.f11); zgodovinski slogi imajo svojega (theme.js).
export const GREEK = ["greek", 11];
// Kartica zgodovinskih dejstev (public/greek.js izbere nabor in dejstvo). set: [predpona, število], i: dejstvo.
export function factHtml(t, set, i, cls = "") {
  const title = t(`${set[0]}.title`);
  return `<aside class="gr-fact ${cls}" aria-label="${title}" data-set="${set[0]}">
    <div class="gr-body"><span class="eyebrow">${title}</span><p class="gr-text" aria-live="polite" data-fact="${i}">${t(`${set[0]}.f${i + 1}`)}</p></div>
    <button type="button" class="ghost icon-only gr-next" title="${t("greek.next")}" aria-label="${t("greek.next")}">${icon("refresh-cw")}</button>
  </aside>`;
}

// ---------- kartice nad načini učenja ----------

// Kartica »Danes imaš …« iz pogleda Urnika (/api/students/:id/schedule → schedule). faks: izpitnih rokov tu ni (kartica
// »Moj študij«). Vrne { empty, html }: empty = urnik je prazen (kartica »Dodaj svoj urnik«, ki jo učenec lahko skrije).
export const TEST_KINDS = ["test", "kolokvij", "izpit", "ustno"];
export function scheduleCardHtml(t, s, { faks = false } = {}) {
  const when = (n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));
  if (!s.lessons.length && !s.events.length)
    return {
      empty: true,
      html: `<div class="card sch-card sch-card-empty"><button type="button" class="list-row" data-go-schedule><span class="ic">${icon("calendar-days")}</span><span class="lr-text"><b>${t("sch.addPrompt")}</b><small>${t("sch.addPromptSub")}</small></span>${icon("chevron-right")}</button><button type="button" class="ghost icon-only sch-card-x" aria-label="${escN(t("pad.close"))}" title="${escN(t("pad.close"))}">${icon("x")}</button></div>`,
    };
  const now = s.now.time;
  // Po zadnji današnji uri pokažemo jutrišnje ure.
  const todayLeft = s.today.filter((l) => l.end > now);
  const showTomorrow = !s.today.length || !todayLeft.length;
  const list = dedupe(showTomorrow ? s.tomorrow : s.today);
  // Ponovitev: naslednja ura s potjo v aplikaciji (danes), ali utrditev ure, ki je danes že bila.
  const nextL = !showTomorrow ? todayLeft.find((l) => l.path) : s.tomorrow.find((l) => l.path);
  const pastL = [...s.today].reverse().find((l) => l.path && l.end <= now);
  const cls = nextL || pastL;
  const after = !nextL && pastL;
  const rem = scheduleReminders(s);
  // Faks: izpitne roke kaže kartica »Moj študij« (public/zacetna.js), tu ne še enkrat.
  const next = faks ? null : s.upcoming.find((e) => TEST_KINDS.includes(e.kind) && e.daysLeft > 1 && e.daysLeft <= 14);
  return {
    empty: false,
    html: `<div class="card sch-card">
    ${rem
      .map(
        (e) => `<div class="sch-remind-row"><span class="ic">${icon("bell")}</span><div><b>${t(e.daysLeft === 0 ? "sch.remindToday" : "sch.remindTomorrow", { name: escN(e.name) })}${e.time ? ` · ${e.time}` : ""}</b><p class="muted">${t("sch.remindText")}</p></div>${e.path && TEST_KINDS.includes(e.kind) ? `<button type="button" class="primary" data-prep>${t("sch.prepare")}</button><button type="button" class="secondary" data-ustno="test">${icon("speech")} ${t("ustno.vprasajMe")}</button>` : ""}</div>`,
      )
      .join("")}
    <button type="button" class="sch-card-head" data-go-schedule><span class="eyebrow">${t(showTomorrow ? "sch.cardTomorrow" : "sch.cardToday")}</span>${icon("chevron-right")}</button>
    ${list.length ? `<div class="chip-row sch-chips">${list.map((l) => `<span class="sch-chip ${nextL && l.id === nextL.id ? "next" : ""}"><b>${l.start}</b> ${escN(l.name)}</span>`).join("")}</div>` : `<p class="muted">${t("sch.free")}</p>`}
    ${cls ? `<button type="button" class="secondary sch-class" data-class="${escN(cls.path)}">${icon("repeat")} ${t(after ? "sch.reviewAfter" : "sch.reviewBefore")}: ${escN(cls.name)}</button>` : ""}
    ${next ? `<p class="muted sch-next">${icon("clipboard-check")} ${t("sch.nextTest", { name: escN(next.name), when: when(next.daysLeft) })}</p>` : ""}
  </div>`,
  };
}
export const scheduleReminders = (s) => s.reminders.filter((e) => TEST_KINDS.includes(e.kind) || e.kind === "naloga");

// Iste ure več skupin vaj pokažemo enkrat.
function dedupe(list) {
  const seen = new Set();
  return list.filter((l) => {
    const k = `${l.start}|${l.name}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Domači zaslon po cilju: bližnjice na Učni poti (public/goal-data.js goalShortcuts). o: { level (OS/SS/FAKS), games
// (igre vklopljene), siExams (zavihek NPZ in matura), regionalExams (regijski izpiti) }. Vrne { first, list }.
export const GOAL_MODES = {
  scan: ["scan-line", "scan.title", "scan.meSub"],
  games: ["gamepad-2", "nav.games", "games.meSub"],
  chat: ["message-circle", "nav.chat", "goal.mChatSub"],
  textbook: ["book-open", "nav.textbook", "goal.mTextbookSub"],
  exams: ["clipboard-check", "nav.examsSi", "exam.meSub"],
  izpiti: ["clipboard-check", "nav.exams", "exam.title"],
  tek: ["medal", "session.tek", "goal.mTekSub"],
  contest: ["timer", "session.contest", "goal.mContestSub"],
};
export function goalModes(s, { level, games, siExams, regionalExams }) {
  const { first, items } = goalShortcuts(s);
  // Kar že odpre kartica stopnje (public/zacetna.js: OŠ igre, SŠ matura, faks Moj študij), tu nadomesti druga bližnjica.
  const shown = stageRows(level, { games, exams: siExams });
  const list = items
    .map((k) => (k === "games" && !games ? "chat" : k))
    .filter((k) => !(k === "exams" && !siExams) && !(k === "izpiti" && !regionalExams))
    .filter((k) => !shown.includes(k))
    .filter((k) => k !== "scan") // »Skeniraj nalogo« je že vrstica v #xp-card tik pod današnjim treningom (j, 18. 11. 2026)
    .filter((k, i, a) => a.indexOf(k) === i);
  // Nadomestki ne smejo podvojiti kartice stopnje (shown) niti ponuditi izklopljenih iger.
  for (const alt of ["chat", "textbook", "games"]) if (list.length < 2 && !list.includes(alt) && !shown.includes(alt) && (alt !== "games" || games)) list.push(alt);
  return { first, list };
}
export const goalModesHtml = (t, list) =>
  list
    .map((k) => {
      const [ic, name, sub] = GOAL_MODES[k];
      return `<button type="button" data-gm="${k}"><span class="ic">${icon(ic)}</span><span class="m-name">${t(name)}</span><span class="m-sub">${t(sub)}</span></button>`;
    })
    .join("");

// Kartica mnenja (public/feedback.js) in vrstica namestitve na Učni poti (public/install.js), brez dogodkov.
export const feedbackCardHtml = (t) => `
    <span class="fb-card-ic">${icon("message-square-heart")}</span>
    <div class="fb-card-text"><b>${escN(t("fb.cardTitle"))}</b><p class="muted">${escN(t("fb.cardText"))}</p></div>
    <button type="button" class="ghost icon-only fb-card-x" aria-label="${escN(t("fb.dismiss"))}" title="${escN(t("fb.dismiss"))}">${icon("x")}</button>
    <button type="button" class="primary fb-card-go">${escN(t("fb.cardBtn"))}</button>`;
export const installMiniHtml = (t, mobile) => `<button type="button" class="list-row inst-go"><span class="ic">${icon(mobile ? "smartphone" : "download")}</span><span class="lr-text"><b>${escN(t("inst.title"))}</b><small>${escN(mobile ? t("inst.meSub") : t("inst.textDesk"))}</small></span>${icon("chevron-right")}</button>
        <button type="button" class="ghost icon-only fb-card-x" aria-label="${escN(t("inst.dismiss"))}" title="${escN(t("inst.dismiss"))}">${icon("x")}</button>`;
