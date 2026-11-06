// Pogled »Lige«: tedenska liga, vzdevek, razredi in skupine prijateljev.
import { icon } from "./icons.js";
import { avatarSvg, itemOf, itemName, itemRarity, wear } from "./avatar.js";
import { DRAW } from "./zbirke.js";
import { t, currentLang, locale } from "./i18n.js";
import { nameHasContact } from "./ime-skupine.js";
import { quizCardHtml, playQuiz } from "./kviz.js";
import { itemThumb, earnedWhere } from "./zbirke-view.js";
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t("lg.error", { status: res.status }));
  return data;
};

// Barve lig (Bronasta … Diamantna) so v leagues.css kot .tier-0 … .tier-6.
const tierBadge = (i, cls = "") => `<span class="tier-badge tier-${i} ${cls}">${icon(i >= 6 ? "trophy" : "award")}</span>`;
// Imena lig (strežnik jih pošlje v slovenščini) iz prevodov; neznana stopnja ostane z imenom s strežnika.
const tierName = (i, fallback) => (Number.isInteger(i) && i >= 0 && i <= 6 ? t(`lg.tier${i}`) : fallback);
const OUTCOME = {
  up: "lg.up",
  down: "lg.down",
  stay: "lg.stay",
};

let current = null; // id učenca
let vitrine = null; // odgovor /api/students/:id/vitrina
let period = "week"; // razredi in prijatelji: ta teden | ta mesec
try {
  period = localStorage.getItem("evklid.boardPeriod") === "month" ? "month" : "week";
} catch {}

// Značka zmage sama (izrez okoli prsi avatarja); klik odpre Zbirke (app.js, [data-zb]).
const badgeSvg = (id, size = 34) => `<svg class="lg-badge" viewBox="48 64 32 32" width="${size}" height="${size}" aria-hidden="true">${DRAW.badge(id)}</svg>`;
const badgeName = (id) => (itemOf(id) ? itemName(itemOf(id), currentLang()) : id);

function timeLeft(iso) {
  const ms = new Date(iso) - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return d > 0 ? t("lg.leftDays", { d, h }) : t("lg.leftHours", { h });
}

// fill: velikost skupine; prosta mesta do nje pokažemo kot prazne vrstice (vidiš, kje so meje za napredovanje).
function boardHtml(rows, zones = false, fill = 0) {
  if (!rows.length) return `<p class="muted">${esc(t("lg.nobody"))}</p>`;
  const free = [...Array(Math.max(0, fill - rows.length))]
    .map((_, i) => `<li class="free"><span class="who"><span class="rank">${rows.length + i + 1}</span><span class="nick-name">${esc(t("lg.free"))}</span></span></li>`)
    .join("");
  return `<ol class="leaderboard league-board">${rows
    .map(
      (r) => `<li class="${r.me ? "me" : ""} ${zones ? `zone-${r.zone}` : ""}">
        <span class="who"><span class="rank">${r.rank}</span>${avatarSvg(r.avatar, { size: 44 })}<span class="nick-name">${esc(r.nickname)}</span>${r.me ? ` <span class="you">${esc(t("lg.you"))}</span>` : ""}</span>
        <b>${r.xp} <span class="xp-unit">XP</span></b>${zones && r.zone !== "stay" ? `<span class="zone-mark" title="${esc(t(r.zone === "up" ? "lg.zoneUp" : "lg.zoneDown"))}">${icon(r.zone === "up" ? "arrow-right" : "arrow-left")}</span>` : ""}</li>`,
    )
    .join("")}${free}</ol>`;
}

// Razredi in prijatelji: razvrstitev po tednu ali mesecu.
const byPeriod = (rows) =>
  period === "week" ? rows : [...rows].sort((a, b) => b.month - a.month).map((r, i) => ({ ...r, rank: i + 1, xp: r.month }));

function monthCard(M) {
  if (!M) return "";
  return `<div class="card">
      <h2 class="h-icon">${icon("calendar-days")} ${esc(t("lg.month"))}</h2>
      <p class="muted league-rule">${esc(t("lg.monthIntro", { n: M.awardMin }))} · ${icon("calendar")} ${esc(t("lg.ends", { time: timeLeft(M.endsAt) }))}</p>
      ${M.board.length ? boardHtml(M.board) : `<div class="league-empty">${icon("target")}<p>${esc(t("lg.monthEmpty"))}</p></div>`}
      ${M.me ? `<div class="lg-me-row">${boardHtml([M.me])}</div>` : ""}
    </div>`;
}

const fmtDay = (s, year = false) => new Date(`${s}T12:00:00`).toLocaleDateString(locale(), { day: "numeric", month: "numeric", ...(year ? { year: "numeric" } : {}) });

// Razredne naloge, ki jih je dal učitelj. Učitelj vidi samo rezultate pri teh temah (zasebni prostor).
function classTasksHtml(x) {
  if (!x) return "";
  const items = x.items
    .map((a) => {
      const st = a.status === "done" ? t("lg.taskDone") : t("lg.taskProgress", { solved: a.solved, goal: a.goal });
      return `<li class="${a.status === "done" ? "done" : ""}"><span><b>${esc(a.title)}</b>${a.due ? ` · ${esc(t("lg.taskDue", { date: fmtDay(a.due) }))}` : ""}<br><span class="st">${a.status === "done" ? icon("circle-check") : ""} ${esc(st)}</span></span>
        <button type="button" class="secondary small" data-task="${esc(a.topicId)}">${icon("play")}<span>${esc(t("lg.taskOpen"))}</span></button></li>`;
    })
    .join("");
  return `<h3 class="h-icon">${icon("list-checks")} ${esc(t("lg.tasks"))}</h3>
    ${items ? `<ul class="lg-tasks">${items}</ul>` : `<p class="muted">${esc(t("lg.noTasks"))}</p>`}
    <p class="muted small">${esc(t("lg.teacherSees"))}</p>
    <div class="tc-actions">
      <button type="button" class="ghost small" data-export>${icon("download")}<span>${esc(t("lg.export"))}</span></button>
      <button type="button" class="ghost small" data-transfer aria-expanded="false">${icon("arrow-left-right")}<span>${esc(t("lg.transfer"))}</span></button>
      <form class="lg-transfer row" hidden>
        <input name="code" placeholder="${esc(t("lg.codePh"))}" aria-label="${esc(t("lg.transferCode"))}" maxlength="9" autocomplete="off" autocapitalize="characters" required>
        <button class="primary" type="submit">${esc(t("lg.transferGo"))}</button>
      </form>
    </div>`;
}

// Kviz v živo v učenčevem razredu: kartica na vrhu Lig. Dokler so Lige odprte, preverimo vsakih 5 s,
// da se kartica pokaže, ko učitelj začne kviz (samo učenci, ki so v razredu).
let quizTimer = null;
let inQuiz = false;
async function refreshQuiz(studentId) {
  const box = document.getElementById("kv-live");
  if (!box || current !== studentId || box.closest("[hidden]")) {
    clearInterval(quizTimer);
    quizTimer = null;
    return;
  }
  if (inQuiz) return;
  const html = await quizCardHtml(studentId);
  if (current !== studentId || box.innerHTML === html) return;
  box.innerHTML = html;
  box.querySelectorAll("[data-kviz]").forEach((b) =>
    b.addEventListener("click", () => {
      inQuiz = true;
      playQuiz(studentId, b.dataset.kviz, () => {
        inQuiz = false;
        refreshQuiz(studentId);
      });
    }),
  );
}
function watchQuiz(studentId, inClass) {
  clearInterval(quizTimer);
  quizTimer = null;
  refreshQuiz(studentId);
  if (inClass) quizTimer = setInterval(() => refreshQuiz(studentId), 5000);
}

export async function loadLeague(studentId) {
  current = studentId;
  const root = $("#league-content");
  let data;
  let tasks = null; // razredne naloge (server/schools.js); brez njih liga še vedno deluje
  let vit = null;
  try {
    [data, tasks, vit] = await Promise.all([
      api(`/api/students/${studentId}/league`),
      api(`/api/students/${studentId}/assignments`).catch(() => null),
      api(`/api/students/${studentId}/vitrina`).catch(() => null), // vitrine v razredu (server/vitrina.js)
    ]);
  } catch (e) {
    root.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
    return;
  }
  if (current !== studentId) return;
  vitrine = vit;
  const L = data.league;
  const league = L.joined
    ? `<p class="muted league-rule"><span class="dot up"></span>${esc(t("lg.promote", { count: L.promoteCount }))}${L.demoteCount ? ` · <span class="dot down"></span>${esc(t("lg.demote", { count: L.demoteCount }))}` : ""} · ${icon("calendar")} ${esc(t("lg.ends", { time: timeLeft(L.endsAt) }))}</p>
       ${boardHtml(L.board, true, L.groupSize || 30)}`
    : `<div class="league-empty">${icon("target")}<p>${esc(t("lg.empty"))}</p></div>`;
  const award = L.lastWeek?.award;
  const wins = (L.awards || []).length
    ? `<div class="lg-wins"><span>${esc(t("lg.awards"))}</span>${L.awards.map((id) => `<button type="button" class="lg-win" data-zb="${esc(id)}" title="${esc(badgeName(id))}" aria-label="${esc(badgeName(id))}">${badgeSvg(id, 30)}</button>`).join("")}</div>`
    : "";

  root.innerHTML = `
    <div id="kv-live"></div>
    <div class="card league-hero tier-${L.tier}">
      <div class="lg-hero-av">${avatarSvg(L.avatar, { size: 84, title: L.nickname })}${tierBadge(L.tier, "big lg-tier")}</div>
      <div>
        <h2>${esc(t("lg.leagueName", { tier: tierName(L.tier, L.tierName) }))}</h2>
        <div class="nick">${icon("user")} <b>${esc(L.nickname)}</b> <button type="button" id="nick-change" class="ghost small">${icon("pencil")}<span>${esc(t("lg.change"))}</span></button></div>
        ${L.lastWeek ? `<div class="last">${esc(t(OUTCOME[L.lastWeek.outcome]))} (${esc(t("lg.place", { rank: L.lastWeek.rank }))})</div>` : ""}
        ${award ? `<button type="button" class="lg-award" data-zb="${esc(award)}">${badgeSvg(award, 36)}<span>${esc(t("lg.award", { name: badgeName(award) }))}</span>${icon("chevron-right")}</button>` : ""}
        ${wins}
      </div>
    </div>
    <div id="nick-picker" class="card" hidden></div>
    <div class="card lg-weekly">
      <h2 class="h-icon">${icon("trophy")} ${esc(t("lg.weekly"))}</h2>
      ${league}
      <p class="muted small lg-win-rule">${icon("medal")} ${esc(t("lg.weekWin"))}</p>
      <div class="tier-row">${L.tiers.map((n, i) => `<span class="${i === L.tier ? "cur" : i < L.tier ? "done" : ""}" title="${esc(tierName(i, n))}">${tierBadge(i)}<span>${esc(tierName(i, n))}</span></span>`).join("")}</div>
    </div>
    ${monthCard(data.month)}
    ${data.classes.length ? `<div class="chip-row lg-period" role="group">${["week", "month"].map((k) => `<button type="button" class="${period === k ? "active" : ""}" data-period="${k}" aria-pressed="${period === k}">${esc(t(k === "week" ? "lg.thisWeek" : "lg.thisMonth"))}</button>`).join("")}</div>` : ""}
    ${tasks?.licence ? `<p class="lg-licence muted">${icon("badge-check")} ${esc(t("lg.licence", { school: tasks.licence.school, date: fmtDay(tasks.licence.validUntil, true) }))}</p>` : ""}
    ${data.classes
      .map(
        (c) => `<div class="card">
          <div class="group-head">
            <h2 class="h-icon">${icon(c.kind === "class" ? "graduation-cap" : "users")} <bdi>${esc(c.name)}</bdi></h2>
            <span class="code-chip" title="${esc(t(c.kind === "friends" ? "lg.shareCode" : "lg.classCode"))}">${esc(c.code)}</span>
          </div>
          <p class="muted">${esc(t(period === "month" ? "lg.classMonth" : c.kind === "friends" ? "lg.boardFriends" : "lg.board"))}</p>
          ${boardHtml(byPeriod(c.board))}
          ${c.kind === "class" ? classTasksHtml(tasks?.classes.find((x) => x.classId === c.id)) : ""}
          ${c.kind === "class" ? showcaseHtml(vitrine?.classes.find((x) => x.id === c.id)) : ""}
          <button type="button" class="ghost small" data-leave="${c.id}">${icon("x")}<span>${esc(t("lg.leave"))}</span></button>
        </div>`,
      )
      .join("")}
    <div class="card form">
      <h2 class="h-icon">${icon("users")} ${esc(t("lg.groups"))}</h2>
      <p class="muted">${esc(t("lg.joinText"))}</p>
      <form id="join-form" class="row">
        <input id="join-code" placeholder="${esc(t("lg.codePh"))}" aria-label="${esc(t("lg.classCode"))}" maxlength="9" autocomplete="off" autocapitalize="characters" required>
        <button class="primary" type="submit">${esc(t("lg.join"))}</button>
      </form>
      <form id="friends-form" class="row">
        <input id="friends-name" placeholder="${esc(t("lg.groupPh"))}" aria-label="${esc(t("lg.groupPh"))}" maxlength="40">
        <button type="submit" class="secondary">${icon("plus")}<span>${esc(t("lg.create"))}</span></button>
      </form>
      <p class="muted">${esc(t("lg.teacher"))} <a href="ucitelj.html" target="_blank">${esc(t("lg.teacherLink"))}</a></p>
    </div>
    <div id="lg-vit-inspect"></div>`;

  watchQuiz(studentId, data.classes.some((c) => c.kind === "class"));
  bindShowcase(root, studentId);
  $("#nick-change").addEventListener("click", showNickPicker);
  root.querySelectorAll("[data-period]").forEach((b) =>
    b.addEventListener("click", () => {
      period = b.dataset.period;
      try {
        localStorage.setItem("evklid.boardPeriod", period);
      } catch {}
      loadLeague(studentId);
    }),
  );
  $("#join-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const r = await api(`/api/students/${studentId}/classes`, { method: "POST", body: { code: $("#join-code").value } });
      toast(t(r.already ? "lg.already" : "lg.joined", { name: r.class.name }));
      loadLeague(studentId);
    } catch (err) {
      toast(err.message);
    }
  });
  $("#friends-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (nameHasContact($("#friends-name").value)) return toast(t("lg.nameContact"));
    try {
      const r = await api(`/api/students/${studentId}/friend-groups`, { method: "POST", body: { name: $("#friends-name").value } });
      toast(t("lg.created", { code: r.code }));
      loadLeague(studentId);
    } catch (err) {
      toast(err.message);
    }
  });
  root.querySelectorAll("[data-task]").forEach((b) => b.addEventListener("click", () => window.evklid?.openTopic?.(b.dataset.task)));
  root.querySelectorAll("[data-transfer]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.nextElementSibling;
      f.hidden = !f.hidden;
      b.setAttribute("aria-expanded", String(!f.hidden));
      if (!f.hidden) f.elements.code.focus();
    }),
  );
  root.querySelectorAll(".lg-transfer").forEach((f) =>
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!confirm(t("lg.transferConfirm"))) return;
      try {
        const r = await api(`/api/students/${studentId}/transfer`, { method: "POST", body: { code: f.elements.code.value } });
        toast(t("lg.transferred", { name: r.class.name }));
        loadLeague(studentId);
      } catch (err) {
        toast(err.message);
      }
    }),
  );
  root.querySelectorAll("[data-export]").forEach((b) =>
    b.addEventListener("click", async () => {
      const r = await fetch(`/api/students/${studentId}/school-export`);
      if (!r.ok) return toast(t("lg.error", { status: r.status }));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(await r.blob());
      a.download = "evklid-napredek.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }),
  );
  root.querySelectorAll("[data-leave]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!confirm(t("lg.leaveConfirm"))) return;
      await api(`/api/students/${studentId}/classes/${b.dataset.leave}`, { method: "DELETE" });
      loadLeague(studentId);
    }),
  );
}

// Vitrine v razredu (server/vitrina.js): vklop »Pokaži mojo vitrino sošolcem« (privzeto izklopljen) in vitrine
// sošolcev, ki so ga vklopili. Učenec vidi samo vzdevek (kot na lestvici), avatar, XP in do tri predmete.
function showcaseHtml(v) {
  if (!v) return "";
  const toggle = v.off
    ? `<p class="muted small lg-vit-off">${icon("lock")} ${esc(t("lg.vitOff"))}</p>`
    : `<label class="lg-vit-toggle"><input type="checkbox" role="switch" data-vitrina="${v.id}" ${v.on ? "checked" : ""}><span><b>${esc(t("lg.vitShare"))}</b><small class="muted">${esc(t("lg.vitShareHint"))}</small></span></label>`;
  const list = v.list.length
    ? `<ul class="lg-vit-list">${v.list
        .map(
          (r, i) => `<li class="${r.me ? "me" : ""}">
            <span class="lg-vit-who">${avatarSvg(r.avatar, { size: 56 })}<span><b class="nick-name">${esc(r.nickname)}</b>${r.me ? ` <span class="you">${esc(t("lg.you"))}</span>` : ""}<small>${period === "month" ? r.month : r.xp} XP</small></span></span>
            <span class="lg-vit-items">${r.items.length
              ? r.items.map((it, j) => `<button type="button" class="lg-vit-item gm-r-${itemRarity(itemOf(it.item))}" data-vit="${v.id}:${i}:${j}" aria-label="${esc(t("lg.vitOpen", { name: itemOf(it.item) ? itemName(itemOf(it.item), currentLang()) : it.item }))}">${itemThumb(it.item, 48, r.avatar)}</button>`).join("")
              : `<small class="muted">${esc(t("lg.vitNoItems"))}</small>`}</span>
          </li>`,
        )
        .join("")}</ul>`
    : `<p class="muted small">${esc(t("lg.vitEmpty"))}</p>`;
  return `<h3 class="h-icon">${icon("star")} ${esc(t("lg.vitrine"))}</h3>${toggle}${v.off ? "" : list}`;
}

let vitOpener = null;
function closeVitInspect() {
  const box = document.getElementById("lg-vit-inspect");
  if (box) box.innerHTML = "";
  vitOpener?.focus?.({ preventScroll: true });
  vitOpener = null;
}
// »Preglej« predmet sošolca: katera tema (predmet, letnik) in kdaj ga je dobil (samo datum).
function openVitInspect(btn) {
  const [cid, i, j] = btn.dataset.vit.split(":").map(Number);
  const r = vitrine?.classes.find((x) => x.id === cid)?.list[i];
  const it = r?.items[j];
  const x = it && itemOf(it.item);
  const box = document.getElementById("lg-vit-inspect");
  if (!x || !box) return;
  vitOpener = btn;
  const name = itemName(x, currentLang());
  // Tema in predmet (npr. »Kemija«), brez razreda ali letnika.
  const subj = it.topic?.subject && t(`subj.${it.topic.subject}`);
  const where = earnedWhere(it.item, { ...it, topic: it.topic && { name: it.topic.name, path: subj && subj !== `subj.${it.topic.subject}` ? subj : "" } });
  box.innerHTML = `<div class="zb-inspect card lg-vit-inspect" role="dialog" tabindex="-1" aria-modal="false" aria-label="${esc(name)}">
    <button type="button" class="ghost zb-x" data-vit-close aria-label="${esc(t("nav.back"))}">${icon("x")}</button>
    <div class="zb-big">${x.sym ? itemThumb(it.item, 120) : avatarSvg(wear(r.avatar, it.item), { size: 170, title: name })}</div>
    <div class="zb-info">
      <h2>${esc(name)}</h2>
      <p><span class="gm-rtag gm-r-${itemRarity(x)}">${esc(t(`games.rarity.${itemRarity(x)}`))}</span></p>
      <p>${icon("user")}<span>${esc(t("lg.vitOf", { nick: r.nickname }))}</span></p>
      ${it.date ? `<p>${icon("calendar")}<span>${esc(t("zb.got", { date: fmtDay(it.date, true) }))}</span></p>` : ""}
      ${where ? `<p>${icon("book-open")}<span>${esc(where)}</span></p>` : ""}
    </div>
  </div>`;
  const dlg = box.firstElementChild;
  dlg.querySelector("[data-vit-close]").addEventListener("click", closeVitInspect);
  dlg.addEventListener("keydown", (e) => e.key === "Escape" && closeVitInspect());
  dlg.focus({ preventScroll: true });
}

function bindShowcase(root, studentId) {
  root.querySelectorAll("[data-vit]").forEach((b) => b.addEventListener("click", () => openVitInspect(b)));
  root.querySelectorAll("[data-vitrina]").forEach((inp) =>
    inp.addEventListener("change", async () => {
      try {
        await api(`/api/students/${studentId}/classes/${inp.dataset.vitrina}/vitrina`, { method: "PUT", body: { on: inp.checked } });
        toast(t(inp.checked ? "lg.vitOn" : "lg.vitHidden"));
        loadLeague(studentId);
      } catch (err) {
        inp.checked = !inp.checked;
        toast(err.message);
      }
    }),
  );
}

async function showNickPicker() {
  const box = $("#nick-picker");
  const opts = await api(`/api/students/${current}/nickname-options`);
  box.hidden = false;
  box.innerHTML = `<h2>${esc(t("lg.pickNick"))}</h2>
    <p class="muted">${esc(t("lg.nickWhy"))}</p>
    <div class="nick-list">${opts.map((o) => `<button type="button" class="secondary small" data-nick="${esc(o)}">${esc(o)}</button>`).join("")}</div>
    <button type="button" id="nick-more" class="ghost small">${icon("refresh-cw")}<span>${esc(t("lg.moreNicks"))}</span></button>`;
  box.querySelectorAll("[data-nick]").forEach((b) =>
    b.addEventListener("click", async () => {
      await api(`/api/students/${current}/nickname`, { method: "PUT", body: { nickname: b.dataset.nick } });
      loadLeague(current);
    }),
  );
  $("#nick-more").addEventListener("click", showNickPicker);
}

function toast(msg) {
  const el = $("#toast");
  if (!el) return alert(msg);
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (el.hidden = true), 4000);
}
