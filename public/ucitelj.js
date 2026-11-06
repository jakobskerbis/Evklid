// Stran za učitelje (ucitelj.html): šola, razredi, razredne naloge, pregled razreda, licenca.
// Učiteljev račun je zastonj. Zasebni prostor: učitelj vidi samo vzdevke, XP in rezultate pri razrednih nalogah.
// Strežnik: server/schools.js (šole, naloge, licence) in server/leagues.js (razredi, lestvice).
import { icon, hydrateIcons } from "./icons.js";
import { t, locale, applyI18n } from "./i18n.js";
import { openPrintable } from "./gradiva.js";
import { hostQuiz } from "./kviz.js";
import { nameHasContact } from "./ime-skupine.js";

applyI18n();
hydrateIcons();
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const root = $("#teacher-root");
const fmtDay = (s) => (s ? new Date(`${s}T12:00:00`).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" }) : "");

// Razredi brez računa (stara različica): koda in ključ v tem brskalniku.
const KEY = "teacherClasses";
const loadKeys = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const saveKeys = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
};
const keyOf = (code) => loadKeys().find((c) => c.code === code)?.key || null;

const toast = (m) => {
  const el = $("#toast");
  el.textContent = m;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (el.hidden = true), 4000);
};
async function api(url, { method = "GET", body, code } = {}) {
  const key = code ? keyOf(code) : null;
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json", ...(key ? { "X-Teacher-Key": key } : {}) }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  // Napaka s ključem prevoda (npr. lg.nameContact): v jeziku uporabnika, ne v slovenščini strežnika.
  if (!r.ok) throw Object.assign(new Error((d.code === "lg.nameContact" && t(d.code)) || d.error || t("common.error", { status: r.status })), { status: r.status, data: d });
  return d;
}

// Povezava za upravljanje (stara različica): ucitelj.html#code=XXX-XXX&key=...
const h = new URLSearchParams(location.hash.slice(1));
if (h.get("code") && h.get("key")) {
  const list = loadKeys();
  if (!list.some((c) => c.code === h.get("code"))) saveKeys([...list, { code: h.get("code"), key: h.get("key"), name: h.get("code") }]);
  history.replaceState(null, "", location.pathname);
}

let home = null; // { verified, schools, classes, doneSolved }
let paths = []; // šolske poti (predmet + letnik)
const open = new Set(); // razredi z odprtim pregledom
const pathLabel = (key) => paths.find((p) => p.key === key)?.label || "";
const STATUS = { done: ["circle-check", "tc.done"], started: ["circle", "tc.started"], todo: ["x", "tc.todo"] };

function licenceHtml(s) {
  if (!s.licence) return `<p class="muted">${icon("info")} ${esc(t("tc.noLicence"))}</p>`;
  const L = s.licence;
  const extra = [L.subjects ? L.subjects.map((x) => t(`subj.${x}`)).join(", ") : t("tc.allSubjects"), L.grades ? t("tc.grades", { list: L.grades.join(", ") }) : t("tc.allGrades")];
  const over = s.students > L.seats;
  return `<p>${icon("badge-check")} <b>${esc(t(`tc.plan.${L.plan}`))}</b> · ${esc(t("tc.validUntil", { date: fmtDay(L.validUntil) }))}</p>
    <p class="muted">${esc(t("tc.seats", { used: s.students, seats: L.seats }))} · ${esc(extra.join(" · "))}</p>
    ${over ? `<p class="tc-warn">${icon("info")} ${esc(t("tc.seatsOver", { n: s.students - L.seats }))}</p>` : ""}`;
}

function schoolCard(s) {
  return `<div class="card">
    <div class="group-head"><h2 class="h-icon">${icon("house")} ${esc(s.name)}</h2>${s.place ? `<span class="muted">${esc(s.place)}</span>` : ""}</div>
    ${licenceHtml(s)}
    <p class="muted">${esc(t("tc.teachers", { n: s.teachers }))} · ${esc(t(s.role === "admin" ? "tc.roleAdmin" : "tc.roleTeacher"))}</p>
    <p>${esc(t("tc.inviteHint"))} <span class="code-chip">${esc(s.inviteCode)}</span></p>
    <button type="button" class="ghost small" data-leave-school="${s.id}">${icon("log-out")}<span>${esc(t("tc.leaveSchool"))}</span></button>
  </div>`;
}

function schoolForms() {
  if (home.accounts === false) return ""; // brez računov ni šol, samo razredi s ključem
  if (!home.verified) return `<div class="card"><p>${icon("info")} ${esc(t("tc.verifyFirst"))}</p></div>`;
  if (home.schools.length >= 3) return "";
  return `<details class="card" ${home.schools.length ? "" : "open"}>
    <summary class="h-icon"><b>${icon("plus")} ${esc(t(home.schools.length ? "tc.addSchool" : "tc.firstSchool"))}</b></summary>
    <form id="school-form" class="form">
      <label>${esc(t("tc.schoolName"))}<input name="name" dir="auto" maxlength="80" required placeholder="${esc(t("tc.schoolNamePh"))}"></label>
      <label>${esc(t("tc.place"))}<input name="place" maxlength="60"></label>
      <label>${esc(t("tc.stage"))}<select name="stage"><option value="OS">${esc(t("tc.stageOS"))}</option><option value="SS">${esc(t("tc.stageSS"))}</option></select></label>
      <div class="form-actions"><button class="primary" type="submit">${esc(t("tc.createSchool"))}</button></div>
    </form>
    <form id="join-school" class="row">
      <input name="code" maxlength="12" autocomplete="off" autocapitalize="characters" required placeholder="${esc(t("tc.joinPh"))}" aria-label="${esc(t("tc.joinPh"))}">
      <button class="secondary" type="submit">${esc(t("tc.joinSchool"))}</button>
    </form>
  </details>`;
}

const pathOptions = (sel) =>
  `<option value="">${esc(t("tc.pathNone"))}</option>` + paths.map((p) => `<option value="${esc(p.key)}" ${p.key === sel ? "selected" : ""}>${esc(p.label)}</option>`).join("");
const schoolOptions = (sel) =>
  `<option value="">${esc(t("tc.noSchool"))}</option>` + home.schools.map((s) => `<option value="${s.id}" ${s.id === sel ? "selected" : ""}>${esc(s.name)}</option>`).join("");

function classForm() {
  return `<form id="class-form" class="card form">
    <h2 class="h-icon">${icon("plus")} ${esc(t("tc.newClass"))}</h2>
    <p class="muted">${esc(t("tc.newClassHint"))}</p>
    <label>${esc(t("tc.className"))}<input name="name" dir="auto" maxlength="40" required placeholder="${esc(t("tc.classNamePh"))}"></label>
    ${home.accounts === false ? "" : `<label>${esc(t("tc.path"))}<select name="path">${pathOptions("")}</select></label>`}
    ${home.schools.length ? `<label>${esc(t("tc.school"))}<select name="schoolId">${schoolOptions(home.schools[0].id)}</select></label>` : ""}
    <div class="form-actions"><button class="primary" type="submit">${esc(t("tc.create"))}</button></div>
  </form>`;
}

function classCard(c) {
  const school = home.schools.find((s) => s.id === c.schoolId);
  const sub = [pathLabel(c.path), school?.name, c.members != null ? t("tc.members", { n: c.members }) : ""].filter(Boolean).join(" · ");
  return `<div class="card" data-class="${esc(c.code)}">
    <div class="group-head"><h2 class="h-icon">${icon("graduation-cap")} <bdi>${esc(c.name)}</bdi></h2><span class="code-chip" title="${esc(t("tc.codeHint"))}">${esc(c.code)}</span></div>
    ${sub ? `<p class="muted">${esc(sub)}</p>` : ""}
    <button type="button" class="secondary" data-toggle="${esc(c.code)}" aria-expanded="${open.has(c.code)}">${icon(open.has(c.code) ? "chevron-down" : "chevron-right")}<span>${esc(t("tc.overview"))}</span></button>
    <div class="tc-body" ${open.has(c.code) ? "" : "hidden"}></div>
  </div>`;
}

function overviewHtml(c, v) {
  const head = v.assignments.map((a, i) => `<th scope="col" title="${esc(a.title)}"><span aria-hidden="true">${i + 1}</span><span class="sr-only">${i + 1}. ${esc(a.title)}</span></th>`).join("");
  const rows = v.members
    .map(
      (m) => `<tr><th scope="row">${esc(m.nickname)}</th>
      <td><input class="tc-label" data-ref="${m.ref}" value="${esc(m.label)}" maxlength="40" placeholder="${esc(t("tc.labelPh"))}" aria-label="${esc(t("tc.labelFor", { nick: m.nickname }))}"></td>
      <td>${m.xp}</td><td>${m.total}</td>
      ${v.assignments.map((a) => {
        const r = a.results[m.ref];
        const [ic, key] = STATUS[r.status];
        const label = `${t(key)} (${t("tc.solved", { n: r.solved })})`;
        return `<td class="tc-st tc-${r.status}" title="${esc(label)}"><span aria-label="${esc(label)}" role="img">${icon(ic)}</span><span class="tc-n">${r.solved}</span></td>`;
      }).join("")}
      <td><button type="button" class="ghost small" data-rm="${m.ref}" aria-label="${esc(t("tc.remove"))}" title="${esc(t("tc.remove"))}">${icon("x")}</button></td></tr>`,
    )
    .join("");
  const list = v.assignments.length
    ? `<ol class="tc-assign">${v.assignments
        .map(
          (a) => `<li><span><b>${esc(a.title)}</b>${a.due ? ` · ${esc(t("tc.due", { date: fmtDay(a.due) }))}` : ""}<br><span class="muted">${esc(t("tc.doneCount", { done: a.done, n: v.members.length }))}</span></span>
          <button type="button" class="ghost small" data-del-a="${a.id}" aria-label="${esc(t("tc.deleteAssignment"))}" title="${esc(t("tc.deleteAssignment"))}">${icon("x")}</button></li>`,
        )
        .join("")}</ol>`
    : `<p class="muted">${esc(t("tc.noAssignments"))}</p>`;
  return `
    <p class="muted small">${esc(t("tc.privacy"))}</p>
    <h3>${esc(t("tc.assignments"))}</h3>
    ${list}
    <form class="tc-add form">
      <label>${esc(t("tc.path"))}<select name="path">${pathOptions(c.path || "")}</select></label>
      <label>${esc(t("tc.topic"))}<select name="topic" required><option value="">${esc(t("tc.pickPath"))}</option></select></label>
      <label>${esc(t("tc.dueLabel"))}<input type="date" name="due"></label>
      <div class="form-actions"><button class="primary" type="submit">${icon("plus")}<span>${esc(t("tc.assign"))}</span></button></div>
      <p class="muted small">${esc(t("tc.doneRule", { n: home?.doneSolved ?? v.doneSolved }))}</p>
    </form>
    <h3>${esc(t("kv.section"))}</h3>
    <form class="tc-gr-form form">
      <label>${esc(t("tc.path"))}<select name="path">${pathOptions(c.path || "")}</select></label>
      <label>${esc(t("tc.topic"))}<select name="topic" required><option value="">${esc(t("tc.pickPath"))}</option></select></label>
      <label>${esc(t("kv.count"))}<select name="n">${[5, 8, 10, 12].map((n) => `<option value="${n}" ${n === 8 ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <div class="tc-gr">
        <label class="tc-offers"><input type="checkbox" name="key" checked> ${esc(t("kv.withKey"))}</label>
        <button type="button" class="secondary" data-sheet>${icon("clipboard-check")}<span>${esc(t("kv.sheet"))}</span></button>
      </div>
      <div class="tc-gr">
        <label>${esc(t("kv.seconds"))} <select name="seconds">${[20, 30, 45, 60, 90].map((n) => `<option value="${n}" ${n === 30 ? "selected" : ""}>${esc(t("kv.secs", { n }))}</option>`).join("")}</select></label>
        <button type="button" class="primary" data-quiz>${icon("zap")}<span>${esc(t("kv.live"))}</span></button>
        <button type="button" class="secondary" data-quiz-open hidden>${icon("zap")}<span>${esc(t("kv.reopen"))}</span></button>
      </div>
      <p class="muted small">${esc(t("kv.joinHow"))}</p>
    </form>
    <h3>${esc(t("tc.students"))}</h3>
    ${v.members.length
      ? `<div class="tc-scroll"><table class="table tc-table"><thead><tr><th scope="col">${esc(t("tc.nick"))}</th><th scope="col">${esc(t("tc.label"))}</th><th scope="col">${esc(t("tc.xpWeek"))}</th><th scope="col">${esc(t("tc.xpTotal"))}</th>${head}<th scope="col"><span class="sr-only">${esc(t("tc.remove"))}</span></th></tr></thead><tbody>${rows}</tbody></table></div>`
      : `<p class="muted">${esc(t("tc.empty", { code: c.code }))}</p>`}
    <div class="tc-actions">
      <label class="tc-offers"><input type="checkbox" data-offers ${v.offersOff ? "checked" : ""}> ${esc(t("tc.offersOff"))}</label>
      <label class="tc-offers"><input type="checkbox" data-showcase ${v.showcaseOff ? "checked" : ""}> ${esc(t("tc.showcaseOff"))}</label>
      <button type="button" class="secondary" data-export>${icon("download")}<span>${esc(t("tc.export"))}</span></button>
      ${home.schools.length ? `<label class="tc-move">${esc(t("tc.moveTo"))} <select data-move>${schoolOptions(c.schoolId ?? null)}</select></label>` : ""}
      <button type="button" class="danger" data-del-class>${esc(t("tc.deleteClass"))}</button>
    </div>`;
}

async function loadTopics(form) {
  const sel = form.elements.topic;
  const path = form.elements.path.value;
  sel.innerHTML = `<option value="">${esc(t(path ? "common.loading" : "tc.pickPath"))}</option>`;
  if (!path) return;
  try {
    const units = await api(`/api/teacher/topics?path=${encodeURIComponent(path)}`);
    sel.innerHTML =
      `<option value="">${esc(t("tc.pickTopic"))}</option>` +
      units.map((u) => `<optgroup label="${esc(u.unit)}">${u.topics.map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</optgroup>`).join("");
  } catch (e) {
    sel.innerHTML = `<option value="">${esc(e.message)}</option>`;
  }
}

async function loadOverview(card, c) {
  const body = $(".tc-body", card);
  body.innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;
  let v;
  try {
    v = await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/overview`, { code: c.code });
  } catch (e) {
    // Razred s ključem, ki ga ni več (izbrisan ali napačen ključ): pozabimo ga, kot prej stara stran.
    if (e.status === 403 && keyOf(c.code) && !home.classes.some((x) => x.code === c.code)) {
      saveKeys(loadKeys().filter((x) => x.code !== c.code));
      open.delete(c.code);
    }
    body.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
    return;
  }
  c.members = v.members.length;
  // Stari razred s ključem iz povezave ima za ime kodo; ime vzamemo s strežnika.
  if (keyOf(c.code) && c.name !== v.name) {
    c.name = v.name;
    saveKeys(loadKeys().map((x) => (x.code === c.code ? { ...x, name: v.name } : x)));
    const h2 = card.querySelector(".group-head h2");
    if (h2) h2.innerHTML = `${icon("graduation-cap")} <bdi>${esc(v.name)}</bdi>`;
  }
  body.innerHTML = overviewHtml(c, v);
  hydrateIcons(body);
  const add = $(".tc-add", body);
  add.elements.path.addEventListener("change", () => loadTopics(add));
  loadTopics(add);
  add.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/assignments`, { method: "POST", code: c.code, body: { topicId: add.elements.topic.value, due: add.elements.due.value || null } });
      toast(t("tc.assigned"));
      loadOverview(card, c);
    } catch (err) {
      toast(err.message);
    }
  });
  wireMaterials(body, c);
  body.querySelectorAll("[data-del-a]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!confirm(t("tc.deleteAssignmentConfirm"))) return;
      await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/assignments/${b.dataset.delA}`, { method: "DELETE", code: c.code }).catch((e) => toast(e.message));
      loadOverview(card, c);
    }),
  );
  body.querySelectorAll(".tc-label").forEach((inp) =>
    inp.addEventListener("change", async () => {
      try {
        await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/members/${inp.dataset.ref}`, { method: "PUT", code: c.code, body: { label: inp.value } });
        toast(t("common.saved"));
      } catch (e) {
        toast(e.message);
      }
    }),
  );
  body.querySelectorAll("[data-rm]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!confirm(t("tc.removeConfirm"))) return;
      await api(`/api/classes/${encodeURIComponent(c.code)}/members/${b.dataset.rm}`, { method: "DELETE", code: c.code }).catch((e) => toast(e.message));
      loadOverview(card, c);
    }),
  );
  $("[data-export]", body).addEventListener("click", async () => {
    const key = keyOf(c.code);
    const r = await fetch(`/api/teacher/classes/${encodeURIComponent(c.code)}/export.csv`, { headers: key ? { "X-Teacher-Key": key } : {} });
    if (!r.ok) return toast(t("common.error", { status: r.status }));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(await r.blob());
    a.download = `${c.name.replace(/[^\p{L}\p{N}]+/gu, "-")}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  // Ponudbe paketov in vitrine učencev: isti stikali, ista oblika zahteve.
  for (const [sel, url] of [["[data-offers]", "offers"], ["[data-showcase]", "showcase"]])
    $(sel, body).addEventListener("change", async (e) => {
      try {
        await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/${url}`, { method: "PUT", code: c.code, body: { off: e.target.checked } });
        toast(t("common.saved"));
      } catch (err) {
        e.target.checked = !e.target.checked;
        toast(err.message);
      }
    });
  $("[data-move]", body)?.addEventListener("change", async (e) => {
    try {
      await api(`/api/teacher/classes/${encodeURIComponent(c.code)}/school`, { method: "PUT", code: c.code, body: { schoolId: e.target.value || null } });
      toast(t("common.saved"));
      render();
    } catch (err) {
      toast(err.message);
    }
  });
  $("[data-del-class]", body).addEventListener("click", async () => {
    if (!confirm(t("tc.deleteClassConfirm"))) return;
    try {
      await api(`/api/classes/${encodeURIComponent(c.code)}`, { method: "DELETE", code: c.code });
      saveKeys(loadKeys().filter((x) => x.code !== c.code));
      open.delete(c.code);
      render();
    } catch (e) {
      toast(e.message);
    }
  });
}

// Delovni list (učitelju zastonj, z rešitvami ali brez) in kviz v živo za razred (server/kviz.js).
function wireMaterials(body, c) {
  const f = $(".tc-gr-form", body);
  const base = `/api/teacher/classes/${encodeURIComponent(c.code)}`;
  const headers = () => (keyOf(c.code) ? { "X-Teacher-Key": keyOf(c.code) } : {});
  f.elements.path.addEventListener("change", () => loadTopics(f));
  loadTopics(f);
  const topic = () => {
    if (!f.elements.topic.value) toast(t("tc.pickTopic"));
    return f.elements.topic.value;
  };
  const reopen = $("[data-quiz-open]", f);
  const host = (game) => hostQuiz({ code: c.code, key: keyOf(c.code), game, onClose: () => checkLive() });
  async function checkLive() {
    try {
      const g = await api(`${base}/kviz`, { code: c.code });
      reopen.hidden = !g.state || g.state === "end";
      reopen.onclick = () => host(g);
    } catch {
      reopen.hidden = true;
    }
  }
  checkLive();
  $("[data-sheet]", f).addEventListener("click", () => {
    const id = topic();
    if (id) openPrintable(`${base}/delovni-list?topic=${encodeURIComponent(id)}&n=${f.elements.n.value}${f.elements.key.checked ? "" : "&resitve=0"}`, toast, headers());
  });
  let starting = false; // dvojni klik ne odpre dveh projektorjev (drugi kviz bi zamenjal prvega)
  $("[data-quiz]", f).addEventListener("click", async () => {
    if (starting) return;
    const id = topic();
    if (!id) return;
    if (!reopen.hidden && !confirm(t("kv.replaceConfirm"))) return;
    starting = true;
    try {
      host(await api(`${base}/kviz`, { method: "POST", code: c.code, body: { topicId: id, n: Number(f.elements.n.value), seconds: Number(f.elements.seconds.value) } }));
    } catch (e) {
      toast(e.message);
    } finally {
      starting = false;
    }
  });
}

async function render() {
  try {
    [home, paths] = await Promise.all([api("/api/teacher/home"), paths.length ? paths : api("/api/paths")]);
  } catch (e) {
    if (e.status === 401) {
      root.innerHTML = `<div class="card"><p>${esc(t("tc.login"))}</p><button type="button" class="primary" id="go-login">${esc(t("tc.loginBtn"))}</button></div>`;
      $("#go-login").addEventListener("click", () => (location.href = "/"));
      return;
    }
    root.innerHTML = `<div class="card"><p>${esc(e.message)}</p></div>`;
    return;
  }
  // Stari razredi s ključem v tem brskalniku (brez računa) se pokažejo poleg razredov iz računa.
  const classes = [...home.classes];
  for (const k of loadKeys()) if (!classes.some((c) => c.code === k.code)) classes.push({ code: k.code, name: k.name, schoolId: null, path: null, members: null });
  root.innerHTML = `
    <h2 class="tc-h">${esc(t("tc.mySchool"))}</h2>
    ${home.schools.map(schoolCard).join("")}
    ${schoolForms()}
    <h2 class="tc-h">${esc(t("tc.myClasses"))}</h2>
    ${classes.map(classCard).join("") || `<p class="muted">${esc(t("tc.noClasses"))}</p>`}
    ${classForm()}
    <p class="muted small">${esc(t("tc.free"))}</p>`;
  hydrateIcons(root);

  $("#school-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    if (nameHasContact(f.name.value)) return toast(t("lg.nameContact")); // ime šole vidijo učenci razredov
    try {
      await api("/api/schools", { method: "POST", body: { name: f.name.value, place: f.place.value, stage: f.stage.value } });
      toast(t("tc.schoolCreated"));
      render();
    } catch (err) {
      toast(err.message);
    }
  });
  $("#join-school")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const s = await api("/api/schools/join", { method: "POST", body: { code: e.target.elements.code.value } });
      toast(t("tc.joined", { name: s.name }));
      render();
    } catch (err) {
      toast(err.message);
    }
  });
  root.querySelectorAll("[data-leave-school]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!confirm(t("tc.leaveSchoolConfirm"))) return;
      await api(`/api/schools/${b.dataset.leaveSchool}/me`, { method: "DELETE" }).catch((e) => toast(e.message));
      render();
    }),
  );
  $("#class-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    if (nameHasContact(f.name.value)) return toast(t("lg.nameContact"));
    try {
      let c;
      if (home.accounts === false) {
        // Brez računov: razred s ključem, ki ostane v tem brskalniku (kot v stari različici).
        c = await api("/api/classes", { method: "POST", body: { name: f.name.value } });
        saveKeys([...loadKeys(), { code: c.code, key: c.teacherKey, name: c.name }]);
      } else c = await api("/api/teacher/classes", { method: "POST", body: { name: f.name.value, path: f.path.value || null, schoolId: f.schoolId?.value || null } });
      toast(t("tc.classCreated", { code: c.code }));
      open.add(c.code);
      render();
    } catch (err) {
      toast(err.message);
    }
  });
  root.querySelectorAll("[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const code = b.dataset.toggle;
      const card = b.closest("[data-class]");
      const body = $(".tc-body", card);
      const show = body.hidden;
      body.hidden = !show;
      b.setAttribute("aria-expanded", String(show));
      b.innerHTML = `${icon(show ? "chevron-down" : "chevron-right")}<span>${esc(t("tc.overview"))}</span>`;
      if (show) {
        open.add(code);
        loadOverview(card, classes.find((c) => c.code === code));
      } else open.delete(code);
    }),
  );
  for (const code of open) {
    const card = root.querySelector(`[data-class="${CSS.escape(code)}"]`);
    const c = classes.find((x) => x.code === code);
    if (card && c) loadOverview(card, c);
  }
}

render();
