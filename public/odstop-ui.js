// Zavihek Račun: povezava »Odstop od pogodbe« (ZVPot-1A, funkcija za odstop je na /odstop.html), pasica ob novi
// različici splošnih pogojev (terms_notice, samo objavljeni pogoji) in skrbniška kartica obvestil o odstopu
// (server/placila/odstop.js). Skrbniška kartica je samo za skrbnika, zato je v slovenščini (kot garancija-ui.js).
import { icon } from "./icons.js";
import { t, locale } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const $ = (sel, root = document) => root.querySelector(sel);
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency = "EUR") => (ZERO_DECIMAL.has(currency) ? minor : minor / 100).toLocaleString(locale(), { style: "currency", currency });
const versionText = (v) => {
  const [y, m, d] = String(v || "").split("-").map(Number);
  return y ? new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" }) : "";
};

// Povezava na funkcijo za odstop: v zavihku Račun vedno, nad karticami (ZVPot-1A: stalno na voljo, na vidnem mestu).
// Gumb (dotik ≥ 40 px); withdrawal_open (pogodba v roku ali nakup v trgovini): razred wd-open.
export const withdrawalLink = (acc) =>
  `<p class="wd-link"><a class="btn-secondary${acc.withdrawal_open ? " wd-open" : ""}" href="/odstop.html">${icon("arrow-right")}<span>${esc(t("acct.withdraw"))}</span></a></p>`;

export function termsBanner(acc) {
  const v = acc.parent?.terms_notice;
  if (!v) return "";
  return `<div class="card priv-banner" id="terms-banner" role="region" aria-labelledby="terms-new-title">
    <h2 id="terms-new-title" class="with-icon">${icon("info")}${esc(t("terms.newTitle"))}</h2>
    <p>${esc(t("terms.newText", { date: versionText(v) }))}</p>
    <p><a class="btn-secondary" href="/pogoji.html" target="_blank" rel="noopener">${icon("external-link")}<span>${esc(t("terms.newRead"))}</span></a></p>
    <p class="form-error" role="alert" hidden></p>
    <button type="button" class="primary" id="terms-accept" data-version="${esc(v)}">${esc(t("terms.newAccept"))}</button>
  </div>`;
}

const STATUS = { received: "prejeto", processing: "v obdelavi", done: "izvedeno", failed: "ni uspelo", closed: "zaključeno ročno" };

function adminHtml(v) {
  const head = `<p class="muted small">Vračilo: ${v.mode === "celotno" ? "vedno celotno" : "sorazmerno, če je plačnik potrdil takojšen začetek, sicer celotno"} · samodejno: ${v.auto ? "da" : "ne"} · Stripe: ${v.test_mode ? "testni način" : v.live ? "pravi način (EVKLID_ODSTOP_LIVE=1)" : "pravi način, samodejno vračilo izklopljeno"}</p>`;
  if (!v.withdrawals.length) return `${head}<p class="muted">Še ni obvestil o odstopu.</p>`;
  return `${head}<ul class="code-list">${v.withdrawals
    .map((w) => {
      const open = ["received", "failed", "processing"].includes(w.status);
      const refund = w.refund_target != null ? ` · vračilo ${esc(money(w.refund_cents || 0, w.currency || "EUR"))} od ${esc(money(w.refund_target, w.currency || "EUR"))} (${esc(w.refund_mode || "")})` : "";
      const old = w.overdue ? ` <span class="pill warn">več kot 7 dni</span>` : "";
      const ack = w.ack_ok === 1 ? "poslano" : w.ack_ok === -1 ? "ZADRŽANO (meja)" : "NI poslano";
      return `<li class="code-row${w.overdue ? " wd-overdue" : ""}"><div><b>${esc(w.name)}</b> · ${esc(w.email)}${w.account_email && w.account_email !== w.email ? ` (račun ${esc(w.account_email)})` : ""}
        <span class="pill${w.status === "failed" || w.status === "received" ? " warn" : w.status === "done" ? " ok" : ""}">${esc(STATUS[w.status] || w.status)}</span>${old}
        <br><small class="muted">${esc(w.submitted_text)} · ${esc(w.source === "app" ? "prijavljen" : "brez prijave")} · ${esc(w.contract_text)}${w.details ? ` · »${esc(w.details)}«` : ""}${refund} · potrdilo ${ack}${w.note ? ` · ${esc(w.note)}` : ""}</small></div>
        ${open ? `<div class="code-actions">${w.parent_id && w.contract !== "other" ? `<button type="button" data-wd-process="${w.id}">Izvedi odstop</button>` : `<button type="button" data-wd-link="${w.id}">Poveži z računom</button>`}<button type="button" data-wd-close="${w.id}">Zaključi ročno</button>${!w.parent_id && w.source === "public" && !w.refund_cents ? `<button type="button" data-wd-delete="${w.id}">Izbriši (neželeno)</button>` : ""}</div>` : ""}${w.ack_ok !== 1 ? `<div class="code-actions"><button type="button" data-wd-ack="${w.id}">Pošlji potrdilo znova</button></div>` : ""}</li>`;
    })
    .join("")}</ul>`;
}

export const withdrawalAdminCard = (acc) =>
  acc.promo?.codes ? `<div class="card" id="wd-admin"><h2>Odstopi od pogodbe</h2><div id="wd-admin-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : "";

// ctx: { api, toast, refresh }
export function bindWithdrawal(acc, { api, toast, refresh }) {
  const btn = $("#terms-accept");
  btn?.addEventListener("click", async () => {
    const err = $("#terms-banner .form-error");
    btn.disabled = true;
    try {
      await api("/api/account/terms", { method: "POST", body: { version: btn.dataset.version, accept: true } });
      $("#terms-banner")?.remove();
      toast(t("terms.newDone"), "check");
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      if (ex.status === 409) refresh();
    }
  });

  const out = $("#wd-admin-out");
  if (!out) return;
  const show = (v) => {
    out.innerHTML = adminHtml(v);
    const act = (sel, fn) => out.querySelectorAll(sel).forEach((b) => b.addEventListener("click", () => fn(b)));
    const run = async (b, url, body) => {
      b.disabled = true;
      try {
        await api(url, { method: "POST", body });
        toast("Narejeno.");
      } catch (ex) {
        toast(ex.message);
      }
      load();
    };
    act("[data-wd-process]", (b) => confirm("Izvedem vračilo in takoj prekličem nakup?") && run(b, `/api/admin/withdrawals/${b.dataset.wdProcess}/process`, {}));
    act("[data-wd-link]", (b) => {
      const pid = prompt("Id računa (preveri, da je obvestilo res od imetnika):");
      if (!pid) return;
      const contract = prompt("Pogodba: sub, pass:<id> ali credit:<id>", "sub");
      if (contract) run(b, `/api/admin/withdrawals/${b.dataset.wdLink}/process`, { parent_id: Number(pid), contract });
    });
    act("[data-wd-ack]", (b) => run(b, `/api/admin/withdrawals/${b.dataset.wdAck}/ack`, {}));
    act("[data-wd-delete]", async (b) => {
      if (!confirm("Izbrišem to obvestilo brez prijave kot neželeno?")) return;
      b.disabled = true;
      try {
        await api(`/api/admin/withdrawals/${b.dataset.wdDelete}`, { method: "DELETE" });
        toast("Izbrisano.");
      } catch (ex) {
        toast(ex.message);
      }
      load();
    });
    act("[data-wd-close]", (b) => {
      const note = prompt("Razlog (npr. urejeno pri trgovini, vrnjeno ročno v Stripu, prepozno):");
      if (!note) return;
      const w = v.withdrawals.find((x) => String(x.id) === b.dataset.wdClose);
      // Delno že vrnjeno: zaključi samo, če je preostanek vrnjen ročno.
      if (w?.refund_cents > 0 && !confirm("Del je že vrnjen. Si preostanek vrnil ročno v Stripu (vrnjeno ročno)?")) return;
      run(b, `/api/admin/withdrawals/${b.dataset.wdClose}/close`, { note, ...(w?.refund_cents > 0 ? { refunded_manually: true } : {}) });
    });
  };
  const load = () => api("/api/admin/withdrawals").then(show, (err) => (out.innerHTML = `<p class="form-error">${esc(err.message)}</p>`));
  load();
}
