// Zavihek Račun: garancija »Boljša ocena ali vrnemo denar« in »Podari Evklid« (strežnik: server/placila/garancija.js,
// server/placila/podari.js). Skrbniški kartici (zahtevki za vračilo, kode za šole) vidi samo skrbnik, zato sta v slovenščini.
import { icon } from "./icons.js";
import { t, locale, currentLang } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const $ = (sel, root = document) => root.querySelector(sel);
const fmtEur = (c) => (c / 100).toLocaleString(locale(), { style: "currency", currency: "EUR" });
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "long", year: "numeric" }) : "");
const SUBJ = (s) => t(`subj.${s}`);

// Vrstica pri izbiri paketa: obljuba in povezava do pogojev.
export const guaranteeLine = () =>
  `<p class="guarantee-line">${icon("check")} <span><b>${esc(t("gar.title"))}</b> · ${esc(t("gar.short"))} <a href="/garancija.html" target="_blank" rel="noopener">${esc(t("gar.terms"))}</a></span></p>`;

function weekList(g) {
  return `<ol class="gar-weeks" aria-label="${esc(t("gar.weeksLabel"))}">${g.weeks
    .map((w) => {
      const label = t("gar.weekState", { week: w.week, days: Math.min(w.days, g.terms.minDays), min: g.terms.minDays });
      const mark = w.state === "ok" ? icon("check") : w.state === "miss" ? icon("x") : `${Math.min(w.days, g.terms.minDays)}/${g.terms.minDays}`;
      return `<li class="gar-week ${w.state}" title="${esc(label)}"><span class="sr-only">${esc(label)}</span><span aria-hidden="true">${mark}</span></li>`;
    })
    .join("")}</ol>`;
}

const gradeOptions = (max) => `<option value="" selected>–</option>` + Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("");

export function guaranteeBox(acc) {
  const g = acc.guarantee;
  if (!g || g.used || (!g.id && !g.can_enroll)) return "";
  const head = `<h2>${icon("award")} ${esc(t("gar.title"))}</h2>`;
  const terms = `<a href="/garancija.html" target="_blank" rel="noopener">${esc(t("gar.terms"))}</a>`;
  if (!g.id) {
    const kids = acc.children.filter((c) => g.students.includes(c.id));
    return `<div class="card gar-card">${head}
      <p>${esc(t("gar.text", { enroll: g.terms.enrollDays, weeks: g.terms.weeks, min: g.terms.minDays }))} ${terms}</p>
      <details><summary>${esc(t("gar.enroll"))}</summary>
        <form id="gar-enroll" class="form" novalidate>
          <label>${esc(t("meter.profile"))} <select name="student_id">${kids.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
          <label>${esc(t("gar.subject"))} <select name="subject">${g.subjects.map((s) => `<option value="${s}">${esc(SUBJ(s))}</option>`).join("")}</select></label>
          <label>${esc(t("gar.gradeNow"))} <select name="grade">${gradeOptions(4)}</select></label>
          <label class="check"><input type="checkbox" name="terms" required><span>${esc(t("gar.agree"))}</span></label>
          <p class="form-error" role="alert" hidden></p>
          <button class="primary" type="submit">${esc(t("gar.enrollBtn"))}</button>
        </form></details></div>`;
  }
  const name = acc.children.find((c) => c.id === g.student_id)?.name || "";
  const who = `<p class="muted">${esc(t("gar.who", { name, subject: SUBJ(g.subject), grade: g.grade_before }))}</p>`;
  let body = "";
  if (g.phase === "practice") {
    // Tekoči teden = zadnji, ki se je že začel (lahko je že »ok«, če so 3 dnevi že zbrani).
    const now = g.weeks.filter((w) => w.state !== "future").at(-1) || g.weeks[0];
    body = `${weekList(g)}<p>${esc(t("gar.practice", { week: now?.week || g.terms.weeks, weeks: g.terms.weeks, days: Math.min(now?.days || 0, g.terms.minDays), min: g.terms.minDays }))}</p>
      <p class="muted">${esc(t("gar.claimFrom", { date: fmtDate(g.claim_opens) }))}</p>`;
  } else if (g.phase === "claim") {
    body = `${weekList(g)}<p>${esc(t("gar.claimOpen", { date: fmtDate(g.claim_until) }))}</p>
      <form id="gar-claim" class="form" novalidate>
        <label>${esc(t("gar.gradeAfter"))} <select name="grade">${gradeOptions(5)}</select></label>
        <label class="check"><input type="checkbox" name="honest" required><span>${esc(t("gar.honest"))}</span></label>
        <p class="form-error" role="alert" hidden></p>
        <button class="primary" type="submit">${esc(t("gar.claimBtn"))}</button>
      </form>`;
  } else {
    const msg = {
      lapsed: t("gar.lapsed", { week: g.missed, min: g.terms.minDays }),
      expired: t("gar.expired"),
      claimed: t("gar.claimed"),
      improved: t("gar.improved", { before: g.grade_before, after: g.grade_after }),
      refunded: t("gar.refunded", { amount: fmtEur(g.refunded_cents || 0) }),
      rejected: t("gar.rejected", { note: g.note || "" }),
    }[g.phase];
    body = `${g.phase === "lapsed" ? weekList(g) : ""}<p>${esc(msg || "")}</p>`;
  }
  return `<div class="card gar-card">${head}${who}${body}<p class="muted">${terms}</p></div>`;
}

export function podariBox(acc) {
  const s = acc.podari;
  if (!s) return "";
  const counter = `<p class="podari-count">${esc(t("pod.counter", { months: s.donated_months + s.evklid_months, used: s.in_use_months }))}</p>`;
  const buy =
    acc.billing && !acc.parent.minor && !acc.parent.guest
      ? `<details><summary>${esc(t("pod.buy", { price: fmtEur(s.month_price) }))}</summary>
        <form id="podari-form" class="form" novalidate>
          <label class="check pay-consent"><input type="checkbox" name="adult" required><span>${esc(t("pod.adult"))}</span></label>
          <label class="check pay-consent"><input type="checkbox" name="understand" required><span>${esc(t("pod.notDonation"))}</span></label>
          <p class="form-error" role="alert" hidden></p>
          <button class="primary" type="submit">${esc(t("pay.continue"))}</button>
        </form></details>`
      : "";
  return `<div class="card podari-card"><h2>${icon("gift")} ${esc(t("pod.title"))}</h2>
    <p>${esc(t("pod.text"))}</p>${counter}${buy}</div>`;
}

// ---------- skrbnik ----------
const PHASE = { practice: "vaja teče", claim: "čaka zahtevek", lapsed: "ni vaje", expired: "rok potekel", claimed: "oddan zahtevek", improved: "boljša ocena", refunded: "vrnjeno", rejected: "zavrnjeno" };

function adminGuaranteesHtml(list) {
  if (!list.length) return `<p class="muted">Še ni prijav na garancijo.</p>`;
  return `<ul class="code-list">${list
    .map(
      (g) => `<li class="code-row"><div><b>${esc(g.email || "izbrisan račun")}</b> · ${esc(g.student || "–")} · ${esc(SUBJ(g.subject))}
        <span class="pill${g.status === "claimed" ? " warn" : ""}">${esc(PHASE[g.phase] || g.status)}</span>
        <br><small class="muted">Ocena ${g.grade_before} → ${g.grade_after ?? "?"} · dni vaje po tednih: ${esc(g.weeks.join(", "))}${g.refunded_cents ? ` · vrnjeno ${esc(fmtEur(g.refunded_cents))}` : ""}${g.note ? ` · ${esc(g.note)}` : ""}</small></div>
        ${g.status === "claimed" ? `<div class="code-actions"><button type="button" data-gar-refund="${g.id}">Vrni denar</button><button type="button" data-gar-reject="${g.id}">Zavrni</button></div>` : ""}</li>`,
    )
    .join("")}</ul>`;
}

function adminPodariHtml(v) {
  const codes = v.codes
    .map(
      (c) => `<li class="code-row"><div><b dir="ltr">${esc(c.code)}</b> · ${esc(c.school)} · ${c.level === "SS" ? "SŠ" : "OŠ"} · ${c.source === "sklad" ? "iz sklada" : "pilot"}
        <span class="pill${c.redeemed ? " ok" : ""}">${c.status === "revoked" ? "preklicana" : c.redeemed ? "vpisana" : "nevpisana"}</span></div>
        ${c.status === "paid" && !c.redeemed ? `<div class="code-actions"><button type="button" data-pod-copy="${esc(c.code)}" aria-label="Kopiraj ${esc(c.code)}">Kopiraj</button><button type="button" data-pod-revoke="${c.id}">Prekliči</button></div>` : ""}</li>`,
    )
    .join("");
  return `<p>V skladu: <b>${esc(fmtEur(v.balance))}</b> (${v.donated_months} mes. od kupcev) · Evklid je podaril ${v.evklid_months} mes. · v uporabi ${v.in_use_months} mes. · pilotnih kod ta mesec še ${v.pilot_month_left} (na šolo največ ${v.per_school}).</p>
    <form id="pod-admin-form" class="form" novalidate>
      <label>Šola <input name="school" maxlength="80" required></label>
      <label>Število kod <input name="count" type="number" min="1" max="10" value="2" required></label>
      <label>Stopnja <select name="level"><option value="OS">OŠ</option><option value="SS">SŠ</option></select></label>
      <label>Vir <select name="source"><option value="pilot">pilot (moj proračun za AI)</option><option value="sklad">sklad (plačali kupci)</option></select></label>
      <p class="form-error" role="alert" hidden></p>
      <button class="primary" type="submit">Ustvari kode (3 mesece)</button>
    </form>
    ${codes ? `<ul class="code-list">${codes}</ul>` : ""}`;
}

export const adminCards = (acc) =>
  acc.promo?.codes
    ? `<div class="card" id="gar-admin"><h2>Garancija: zahtevki</h2><div id="gar-admin-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>
       <div class="card" id="pod-admin"><h2>Podari Evklid: kode za šole</h2><div id="pod-admin-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>`
    : "";

// ctx: { api, toast, showError, refresh }
export function bindGuarantee(acc, { api, toast, showError, refresh }) {
  const submit = (id, url, body) =>
    $(id)?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("button[type=submit]", e.target);
      btn.disabled = true;
      try {
        await api(url, { method: "POST", body: body(e.target) });
        await refresh();
      } catch (err) {
        btn.disabled = false;
        showError(e.target, err);
      }
    });
  submit("#gar-enroll", "/api/guarantee/enroll", (f) => {
    if (!f.terms.checked) throw new Error(t("gar.agreeMissing"));
    return { student_id: Number(f.student_id.value), subject: f.subject.value, grade: Number(f.grade.value), terms: true };
  });
  submit("#gar-claim", "/api/guarantee/claim", (f) => {
    if (!f.honest.checked) throw new Error(t("gar.agreeMissing"));
    return { grade: Number(f.grade.value), honest: true };
  });
  $("#podari-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", e.target);
    btn.disabled = true;
    try {
      if (!e.target.adult.checked || !e.target.understand.checked) throw new Error(t("payp.consentMissing"));
      const r = await api("/api/billing/podari", { method: "POST", body: { adult: true, understand: true, lang: currentLang() } });
      location.href = r.url;
    } catch (err) {
      btn.disabled = false;
      showError(e.target, err);
    }
  });

  // Skrbnik: zahtevki in kode (naložijo se posebej, da Račun ostane hiter).
  const garOut = $("#gar-admin-out");
  const podOut = $("#pod-admin-out");
  if (garOut) {
    const show = (list) => {
      garOut.innerHTML = adminGuaranteesHtml(list);
      garOut.querySelectorAll("[data-gar-refund]").forEach((b) =>
        b.addEventListener("click", async () => {
          if (!confirm("Vrnem vsa plačila naročnine in takoj prekličem naročnino?")) return;
          b.disabled = true;
          try {
            show((await api(`/api/admin/guarantees/${b.dataset.garRefund}/refund`, { method: "POST", body: {} })).guarantees);
            toast("Vračilo je narejeno.");
          } catch (err) {
            b.disabled = false;
            toast(err.message);
            if (err.data?.guarantees) show(err.data.guarantees);
          }
        }),
      );
      garOut.querySelectorAll("[data-gar-reject]").forEach((b) =>
        b.addEventListener("click", async () => {
          const note = prompt("Razlog za zavrnitev (vidi ga starš):");
          if (!note) return;
          try {
            show((await api(`/api/admin/guarantees/${b.dataset.garReject}/reject`, { method: "POST", body: { note } })).guarantees);
          } catch (err) {
            toast(err.message);
          }
        }),
      );
    };
    api("/api/admin/guarantees").then((r) => show(r.guarantees), (err) => (garOut.innerHTML = `<p class="form-error">${esc(err.message)}</p>`));
  }
  if (podOut) {
    const show = (v) => {
      podOut.innerHTML = adminPodariHtml(v);
      $("#pod-admin-form", podOut).addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = e.target;
        const btn = $("button[type=submit]", f);
        btn.disabled = true;
        try {
          show(await api("/api/admin/podari/codes", { method: "POST", body: { school: f.school.value, count: Number(f.count.value), level: f.level.value, source: f.source.value } }));
          toast("Kode so ustvarjene. Pošlji jih šoli.");
        } catch (err) {
          btn.disabled = false;
          showError(f, err);
        }
      });
      podOut.querySelectorAll("[data-pod-copy]").forEach((b) =>
        b.addEventListener("click", async () => {
          await navigator.clipboard?.writeText(b.dataset.podCopy).catch(() => {});
          toast(t("gift.copied"));
        }),
      );
      podOut.querySelectorAll("[data-pod-revoke]").forEach((b) =>
        b.addEventListener("click", async () => {
          if (!confirm("Prekličem to kodo?")) return;
          try {
            show(await api(`/api/admin/podari/codes/${b.dataset.podRevoke}/revoke`, { method: "POST", body: {} }));
          } catch (err) {
            toast(err.message);
          }
        }),
      );
    };
    api("/api/admin/podari").then(show, (err) => (podOut.innerHTML = `<p class="form-error">${esc(err.message)}</p>`));
  }
}
