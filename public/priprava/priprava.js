// Vmesnik priprave na test (docs/priprava.md, PR 7; makete potrdil j 25. 11. 2026): ena učna izkušnja od testa do
// dnevnega načrta. Koraki ob prvi pripravi: 1 test (sklopi, datum) → 2 zapiski (fotografija, datoteka, besedilo) →
// 3 teme testa (obseg, odstranitev tem) → prvi kviz (naloge Vadnice, preveri koda) → napredek in načrt. Potem je
// začetni zaslon »Danes«: pripravljenost iz izkazanega znanja, današnje enote, naslednji dnevi, teme testa in razlaga
// teme iz zapiskov z virom. Isti deli na telefonu, iPadu in računalniku; širši zaslon jih postavi drug ob drugega
// (public/priprava/priprava.css).
//
// Brez napovedi ocene in brez obljub; pripravljenost šteje samo rešene naloge. Besedilo iz zapiskov se izriše kot
// besedilo (izris.js), [?] ostane viden. Modul, slog in besedila se naložijo šele ob odprtju (public/app.js).
import { t as tg, currentLang, locale } from "../i18n.js";
import { uiDicts } from "../i18n/languages.js";
import { icon } from "../icons.js";
import { dateText } from "../datum.js";
import { stevilke, vrstice, klici, telHref, drzavaNaprave, izoliraj, opomba } from "../nujno.js";
import SL from "./sl.js";
import { esc, besediloZFormulami, oznaciNegotovo, dniMed, negotovihPoViru, RAZRED_STANJA, naslednjaEnota } from "./izris.js";

let D = null; // odvisnosti iz app.js (odpri)
let dicts = [SL];
let nalozeno = null;
let P = {}; // { plan, pid, priprava, nacrt, napredek, teme, izseki, strani, zaslon }
let zaslon = 0; // števec izrisov: odgovor starega zaslona ne prepiše novega

// ---------- besedila ----------
const mnozina = new Map();
const oblika = (n) => {
  const l = currentLang();
  if (!mnozina.has(l)) {
    let pr;
    try {
      pr = new Intl.PluralRules(l);
    } catch {
      pr = new Intl.PluralRules("en");
    }
    mnozina.set(l, pr);
  }
  return mnozina.get(l).select(n);
};
export function t(key, vars = {}) {
  for (const d of dicts) {
    let v = d[key];
    if (v === undefined) continue;
    if (typeof v === "object") v = v[oblika(Number(vars.n))] ?? v.other;
    return String(v).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
  }
  return tg(key, vars);
}
function naloziBesedila() {
  const kode = uiDicts(currentLang());
  return Promise.all(
    kode.map(async (k) => {
      try {
        const r = await fetch(`/priprava/i18n/${k}.json`);
        return r.ok ? await r.json() : null;
      } catch {
        return null;
      }
    }),
  ).then((ds) => (dicts = [...ds.filter(Boolean), SL]));
}
function naloziSlog() {
  if (document.querySelector("link[data-priprava]")) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "/priprava/priprava.css";
  l.dataset.priprava = "";
  document.head.appendChild(l);
}

// ---------- pomočniki ----------
const sid = () => D.getStudent()?.id;
const pot = (rest = "") => `/api/students/${sid()}/priprave/${P.pid}${rest}`;
const box = () => D.box();
const nov = () => ++zaslon;
const velja = (n) => n === zaslon && !!box();
const datum = (d, opts = { weekday: "short", day: "numeric", month: "numeric" }) => (d ? dateText(`${d}T12:00:00Z`, locale(), { ...opts, timeZone: "UTC" }) : "");
const LS = (pid) => `evklid.priprava.${pid}.uvod`;
const lsGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
const sprememba = () => dispatchEvent(new Event("evklid:sprememba"));
const napaka = (err, rezerva = "pr.err.other") => {
  const c = err?.body?.code;
  if (c && SL[`pr.err.${c}`] !== undefined) return t(`pr.err.${c}`);
  return err?.message || t(rezerva);
};
const formula = (tex) => D.renderMath(tex, false, false);
const glava = ({ naslov, pod, nazaj, desno = "" }) => `<header class="pr-head">
    ${nazaj ? `<button type="button" class="ghost icon-only pr-nazaj" data-pr-nazaj aria-label="${esc(t("pr.back"))}">${icon("arrow-left")}</button>` : ""}
    <div class="pr-head-t"><h1>${esc(naslov)}</h1>${pod ? `<p class="muted">${esc(pod)}</p>` : ""}</div>${desno}</header>`;
const koraki = (n) =>
  `<div class="pr-koraki" role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${n}" aria-label="${esc(t("pr.step", { n }))}">${[1, 2, 3]
    .map((i) => `<span class="${i <= n ? "on" : ""}"></span>`)
    .join("")}</div>`;
const izrisi = (html, n) => {
  if (!velja(n)) return null;
  const el = box();
  el.innerHTML = `<div class="pr">${html}</div>`;
  D.renderDone?.(el);
  return el.querySelector(".pr");
};
const nalagam = (n) => izrisi(`<p class="muted pr-nalagam" role="status">${esc(t("pr.loading"))}</p>`, n);
const napakaZaslona = (err, n, znova) => {
  const el = izrisi(`<div class="card pr-napaka" role="alert"><p>${esc(napaka(err))}</p><button type="button" class="secondary" data-pr-znova>${icon("refresh-cw")} ${esc(t("pr.retry"))}</button></div>`, n);
  el?.querySelector("[data-pr-znova]").addEventListener("click", znova);
};
function nujnoHtml(n) {
  if (!n?.vrsta) return "";
  const st = stevilke(D.getStudent()?.settings, drzavaNaprave());
  const tr = ([k, p]) => t(k, Object.fromEntries(Object.entries(izoliraj(p)).map(([a, x]) => [a, Array.isArray(x) ? t(x[0], x[1]) : x ?? ""])));
  const [head, ...rest] = vrstice(n.vrsta, st, { izsiljevanje: !!n.izs });
  return `<section class="msg nujno-card nujno-${esc(n.vrsta)}" role="alert"><h3>${esc(tr(head))}</h3>${rest.map((x) => `<p>${esc(tr(x))}</p>`).join("")}
    <div class="nujno-klici">${klici(n.vrsta, st)
      .filter(Boolean)
      .map((c) => `<a class="nujno-klic" href="${telHref(c)}">${icon("phone")} ${esc(t("nujno.klic", izoliraj({ n: c })))}</a>`)
      .join("")}</div><p class="nujno-opomba">${esc(t(opomba(st, false)))}</p></section>`;
}

// ---------- vstop ----------
/**
 * deps: { api, renderMath, renderDone?, toast, showView, setActiveMode, setBack, startSession, addSession, openTopic,
 *         nextPractice, learnWithTutor, openLesson, getStudent, pathKey, box }
 * opts: { uredi: true } odpre korak 1 (sprememba testa).
 */
export async function odpri(deps, opts = {}) {
  D = deps;
  naloziSlog();
  nalozeno ||= naloziBesedila();
  const n = nov();
  D.setActiveMode("test");
  D.setBack?.("path");
  D.showView("topic");
  nalagam(n);
  let plan;
  try {
    [plan] = await Promise.all([D.api(`/api/students/${sid()}/test-plan`).then((r) => r.plan), nalozeno]);
  } catch (err) {
    return napakaZaslona(err, n, () => odpri(deps, opts));
  }
  if (!velja(n)) return;
  P = { plan, pid: plan?.pripravaId ?? null };
  if (!plan || opts.uredi || plan.daysLeft < 0) return korakTest(n);
  // Prva priprava: zapiski in teme, dokler učenec ne začne prvega kviza ali doda vira (potem je doma »Danes«).
  if (lsGet(LS(P.pid))) return domov(n);
  try {
    P.priprava = (await D.api(pot())).priprava;
  } catch (err) {
    return napakaZaslona(err, n, () => odpri(deps, opts));
  }
  if (!velja(n)) return;
  if (P.priprava.viri.length) {
    lsSet(LS(P.pid), "1");
    return domov(n);
  }
  return korakZapiski(n);
}

// ---------- korak 1: test ----------
async function korakTest(n = nov()) {
  nalagam(n);
  let p;
  try {
    p = await D.api(`/api/students/${sid()}/path?key=${encodeURIComponent(P.plan?.path || D.pathKey() || "")}`);
  } catch (err) {
    return napakaZaslona(err, n, () => korakTest());
  }
  const plan = P.plan;
  const danes = new Date().toISOString().slice(0, 10);
  const izbrani = new Set(plan?.path === p.key ? plan.units : []);
  const enote = p.units
    .map((u, i) =>
      u.hasPractice
        ? `<li><label class="pr-vrsta"><input type="checkbox" name="unit" value="${i}" ${izbrani.has(i) ? "checked" : ""}><span>${esc(u.title)}</span></label></li>`
        : "",
    )
    .join("");
  const el = izrisi(
    `${glava({ naslov: t("pr.newTitle"), pod: `${t("pr.step", { n: 1 })} · ${t("pr.step1")}`, nazaj: !!plan && plan.daysLeft >= 0 })}${koraki(1)}
    <form class="pr-form" id="pr-test" novalidate>
      <div class="pr-uvod"><h2>${esc(t("pr.which"))}</h2><p class="muted">${esc(t("pr.whichSub"))}</p><p class="muted pr-pot">${esc(p.label || "")}</p></div>
      <ul class="card pr-seznam">${enote}</ul>
      <div class="card pr-datum"><label for="pr-datum">${esc(t("pr.date"))}</label><input id="pr-datum" type="date" name="date" min="${danes}" value="${plan?.date && plan.date >= danes ? plan.date : ""}" required></div>
      <p class="pr-err" role="alert" aria-live="assertive"></p>
      <div class="pr-dno"><button class="primary big" type="submit">${esc(t("pr.next2"))}</button>
      ${plan ? `<button type="button" class="text-btn pr-odstrani" data-pr-odstrani>${esc(t("pr.remove"))}</button>` : ""}</div>
    </form>`,
    n,
  );
  if (!el) return;
  el.querySelector("[data-pr-nazaj]")?.addEventListener("click", () => domov());
  const f = el.querySelector("#pr-test");
  const err = el.querySelector(".pr-err");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(f);
    const units = fd.getAll("unit").map(Number);
    if (!units.length) return (err.textContent = t("pr.pickUnit"));
    if (!fd.get("date")) return (err.textContent = t("pr.pickDate"));
    const gumb = f.querySelector("button[type=submit]");
    gumb.disabled = true;
    try {
      const r = await D.api(`/api/students/${sid()}/test-plan`, { method: "POST", body: { path: p.key, units, date: fd.get("date") } });
      P = { plan: r.plan, pid: r.plan.pripravaId };
      if (lsGet(LS(P.pid))) return domov();
      korakZapiski();
    } catch (x) {
      err.textContent = napaka(x);
      gumb.disabled = false;
    }
  });
  const odstrani = el.querySelector("[data-pr-odstrani]");
  odstrani?.addEventListener("click", async () => {
    if (odstrani.dataset.sure !== "1") {
      odstrani.dataset.sure = "1";
      odstrani.textContent = t("pr.removeSure");
      return;
    }
    try {
      await D.api(`/api/students/${sid()}/test-plan`, { method: "DELETE" });
      P = {};
      korakTest();
    } catch (x) {
      err.textContent = napaka(x);
    }
  });
}

// ---------- korak 2: zapiski ----------
const SPREJME_DATOTEKE = ".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation";
let obdelava = null; // tekoča obdelava virov (ena naenkrat)

async function naloziVire() {
  const [pr, iz, zap] = await Promise.all([
    D.api(pot()),
    D.api(pot("/izseki")).catch(() => ({ izseki: [] })),
    P.strani === undefined ? D.api(`/api/students/${sid()}/zapiski`).catch(() => null) : null,
  ]);
  P.priprava = pr.priprava;
  P.negotovo = negotovihPoViru(iz.izseki);
  if (zap?.pages) P.strani = zap.pages;
}

async function korakZapiski(n = nov(), { uvod = true, sporocilo = "" } = {}) {
  P.zaslon = uvod ? "uvod-zapiski" : "zapiski";
  nalagam(n);
  try {
    await naloziVire();
  } catch (err) {
    return napakaZaslona(err, n, () => korakZapiski(undefined, { uvod }));
  }
  izrisiZapiske(n, { uvod, sporocilo });
  obdelajVire(n, { uvod });
}

function virVrstica(v) {
  const ime = v.ime || t(v.vrsta === "slika" ? "pr.srcPhoto" : v.vrsta === "besedilo" ? "pr.srcText" : "pr.srcText");
  const stanje =
    v.stanje === "obdelan"
      ? `<span class="pr-stanje ok">${esc(t("pr.srcDone"))}</span>`
      : v.stanje === "napaka"
        ? `<span class="pr-stanje ne">${esc(t("pr.srcError"))}</span>`
        : `<span class="pr-stanje">${esc(t(v.stanje === "branje" ? "pr.srcReading" : "pr.srcWaiting"))}</span>`;
  const meta = [v.strani ? t("pr.srcPages", { n: v.strani }) : "", t("pr.srcCuts", { n: v.izsekov || 0 })].filter(Boolean).join(" · ");
  const neg = P.negotovo?.get(v.id) || 0;
  const skeni = v.stanje === "branje" && v.vrsta === "pdf";
  return `<li class="card pr-vir" data-vir="${v.id}">
      <div class="pr-vir-vrh"><span class="pr-vir-ime" dir="auto">${esc(ime)}</span>${stanje}</div>
      <div class="muted pr-vir-meta">${esc(meta)}</div>
      ${v.stanje === "branje" ? `<div class="pr-tek" aria-hidden="true"><span></span></div>` : ""}
      ${skeni ? `<p class="muted pr-mala">${esc(t("pr.srcScanLeft"))}</p>` : ""}
      ${v.stanje === "napaka" ? `<p class="pr-opozorilo ne">${esc(t(`pr.err.${v.napaka}`) !== `pr.err.${v.napaka}` ? t(`pr.err.${v.napaka}`) : t("pr.err.other"))}</p>` : ""}
      ${neg ? `<p class="pr-opozorilo">${oznaciNegotovo(esc(t("pr.srcUnsure", { n: neg })))}</p>` : ""}
      <div class="pr-vir-dej">${v.stanje === "napaka" && v.vrsta !== "slika" ? `<button type="button" class="text-btn" data-pr-znova-vir="${v.id}">${esc(t("pr.retry"))}</button>` : ""}
      <button type="button" class="text-btn pr-brisi" data-pr-brisi="${v.id}">${icon("trash-2")} ${esc(t("pr.srcDelete"))}</button></div>
    </li>`;
}

function izrisiZapiske(n, { uvod, sporocilo = "" }) {
  const viri = P.priprava?.viri || [];
  const strani = P.strani ? t("pr.quota", { n: P.strani.left }) : t("pr.quotaNone");
  const el = izrisi(
    `${uvod ? glava({ naslov: t("pr.newTitle"), pod: `${t("pr.step", { n: 2 })} · ${t("pr.step2")}`, nazaj: true }) + koraki(2) : glava({ naslov: t("pr.myNotes"), pod: P.plan?.unitTitles?.join(", ") || "", nazaj: true })}
    <div class="pr-uvod"><h2>${esc(t("pr.addTitle"))}</h2><p class="muted">${oznaciNegotovo(esc(t("pr.addSub")))}</p></div>
    <div class="pr-dodaj">
      <label class="pr-dodaj-gumb"><input type="file" accept="image/*" capture="environment" multiple data-pr-foto hidden>${icon("camera")}<span>${esc(t("pr.photo"))}</span></label>
      <label class="pr-dodaj-gumb"><input type="file" accept="${SPREJME_DATOTEKE}" multiple data-pr-datoteka hidden>${icon("file-text")}<span>${esc(t("pr.file"))}</span><small>${esc(t("pr.fileTypes"))}</small></label>
      <button type="button" class="pr-dodaj-gumb" data-pr-prilepi aria-expanded="false">${icon("text")}<span>${esc(t("pr.paste"))}</span></button>
    </div>
    <form class="card pr-prilepi" hidden data-pr-prilepi-obrazec><textarea rows="6" maxlength="100000" placeholder="${esc(t("pr.pastePh"))}" aria-label="${esc(t("pr.paste"))}"></textarea>
      <button type="submit" class="primary">${esc(t("pr.pasteAdd"))}</button></form>
    <p class="pr-err" role="alert" aria-live="assertive">${esc(sporocilo)}</p>
    <section class="pr-viri"><h2 class="pr-h2">${esc(t("pr.added"))}</h2>
      ${viri.length ? `<ul class="pr-vir-seznam">${viri.map(virVrstica).join("")}</ul>` : `<p class="muted">${esc(t("pr.noSources"))}</p>`}</section>
    <p class="muted pr-mala">${esc(strani)} ${esc(t("pr.privacy"))}</p>
    <div class="pr-dno">${
      uvod
        ? `<button type="button" class="primary big" data-pr-naprej>${esc(t("pr.next3"))}</button><button type="button" class="text-btn" data-pr-brez>${esc(t("pr.skipNotes"))}</button>`
        : `<button type="button" class="primary big" data-pr-naprej>${esc(t("pr.topicsTitle"))}</button>`
    }</div>`,
    n,
  );
  if (!el) return;
  el.querySelector("[data-pr-nazaj]").addEventListener("click", () => (uvod ? korakTest() : domov()));
  el.querySelector("[data-pr-naprej]").addEventListener("click", () => korakTeme(undefined, { uvod }));
  el.querySelector("[data-pr-brez]")?.addEventListener("click", () => korakTeme(undefined, { uvod }));
  const err = el.querySelector(".pr-err");
  const dodaj = async (files) => {
    for (const f of files) {
      err.textContent = "";
      try {
        await poslji(f);
      } catch (x) {
        err.textContent = napaka(x);
      }
    }
    if (velja(n)) korakZapiski(nov(), { uvod });
  };
  el.querySelector("[data-pr-foto]").addEventListener("change", (e) => dodaj([...e.target.files]));
  el.querySelector("[data-pr-datoteka]").addEventListener("change", (e) => dodaj([...e.target.files]));
  const obr = el.querySelector("[data-pr-prilepi-obrazec]");
  const pril = el.querySelector("[data-pr-prilepi]");
  pril.addEventListener("click", () => {
    obr.hidden = !obr.hidden;
    pril.setAttribute("aria-expanded", String(!obr.hidden));
    if (!obr.hidden) obr.querySelector("textarea").focus();
  });
  obr.addEventListener("submit", async (e) => {
    e.preventDefault();
    const besedilo = obr.querySelector("textarea").value;
    if (!besedilo.trim()) return;
    const g = obr.querySelector("button");
    g.disabled = true;
    try {
      await D.api(pot("/viri"), { method: "POST", body: { besedilo } });
      korakZapiski(nov(), { uvod });
    } catch (x) {
      err.textContent = napaka(x);
      g.disabled = false;
    }
  });
  el.querySelectorAll("[data-pr-brisi]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (b.dataset.sure !== "1") {
        b.dataset.sure = "1";
        b.textContent = t("pr.srcDeleteSure");
        return;
      }
      try {
        await D.api(pot(`/viri/${b.dataset.prBrisi}`), { method: "DELETE" });
        korakZapiski(nov(), { uvod });
      } catch (x) {
        err.textContent = napaka(x);
      }
    }),
  );
  el.querySelectorAll("[data-pr-znova-vir]").forEach((b) =>
    b.addEventListener("click", async () => {
      b.disabled = true;
      try {
        await D.api(pot(`/viri/${b.dataset.prZnovaVir}/obdelaj`), { method: "POST" });
      } catch (x) {
        err.textContent = napaka(x);
      }
      korakZapiski(nov(), { uvod });
    }),
  );
}

// Datoteka kot telo zahteve (api() pošilja JSON): vrsta po vsebini na strežniku, ime v glavi.
async function poslji(file) {
  const res = await fetch(pot("/viri"), {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", "X-Ime-Datoteke": encodeURIComponent(file.name || "") },
    body: file,
  });
  sprememba();
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error || t("pr.err.other")), { status: res.status, body });
  }
  return res.json();
}

// Obdelava virov po vrsti: »caka« → obdelaj (uvoz brez AI), »branje« → preberi (fotografija, skenirane strani; stran iz
// meje). Po vsakem viru zaslon pokaže novo stanje. Ustavi se ob meji strani ali preizkusnem načinu (brez zanke).
async function obdelajVire(n, { uvod }) {
  if (obdelava) return;
  const odprti = (P.priprava?.viri || []).filter((v) => v.stanje === "caka" || v.stanje === "branje");
  if (!odprti.length) return;
  obdelava = (async () => {
    let sporocilo = "";
    for (const v of odprti) {
      if (!velja(n)) return;
      for (let poskus = 0; poskus < 6; poskus++) {
        try {
          const r = await D.api(pot(`/viri/${v.id}/${v.stanje === "caka" ? "obdelaj" : "preberi"}`), { method: "POST" });
          if (r?.mock) sporocilo = t("pr.err.mock");
          if (r?.pages) P.strani = r.pages;
          if (r?.ustavljeno === "meja") sporocilo = t("pr.err.zapiski_strani");
          // Skeniran PDF: največ 5 strani na zahtevek; nadaljuje, dokler ima neprebrane strani in branje napreduje.
          if (r?.vir?.stanje === "branje" && v.vrsta === "pdf" && r.prebrano?.length && !r.ustavljeno) continue;
          break;
        } catch (x) {
          if (x?.status === 429 && x.body?.code === "priprava_zasedeno") {
            await new Promise((ok) => setTimeout(ok, 5000));
            continue;
          }
          sporocilo = napaka(x);
          break;
        }
      }
      if (sporocilo) break;
    }
    if (velja(n)) korakZapiski(nov(), { uvod, sporocilo });
  })().finally(() => (obdelava = null));
}

// ---------- korak 3: teme testa ----------
async function korakTeme(n = nov(), { uvod = false } = {}) {
  nalagam(n);
  let z;
  try {
    [z] = await Promise.all([D.api(pot("/teme")), P.priprava ? null : D.api(pot()).then((r) => (P.priprava = r.priprava))]);
  } catch (err) {
    return napakaZaslona(err, n, () => korakTeme(undefined, { uvod }));
  }
  P.teme = z;
  const izkljucene = new Set((P.priprava?.izkljucene || []).concat((z.izkljucene || []).map((x) => x.id)));
  const vrstica = (tm, vObsegu) => {
    const ven = !vObsegu;
    const pod = ven ? t("pr.removed") : tm.izsekov ? t("pr.inNotes", { n: tm.izsekov }) : t("pr.notInNotes");
    return `<li class="pr-tema${ven ? " ven" : ""}">
      ${z.obseg ? `<input type="checkbox" id="pr-t-${esc(tm.id)}" data-pr-tema="${esc(tm.id)}" ${ven ? "" : "checked"}>` : ""}
      <label ${z.obseg ? `for="pr-t-${esc(tm.id)}"` : ""} class="pr-tema-t"><span class="pr-tema-ime" dir="auto">${esc(tm.ime)}</span><small class="${ven ? "muted" : tm.izsekov ? "pr-ok" : "muted"}">${esc(pod)}</small></label>
    </li>`;
  };
  const obseg = z.obseg
    ? [...z.obseg.map((tm) => vrstica(tm, true)), ...(z.izkljucene || []).map((tm) => vrstica({ ...tm, izsekov: 0 }, false))]
    : z.teme.map((tm) => vrstica({ ...tm, izsekov: tm.izseki.length }, true));
  const opombe = [
    z.pokritost ? t("pr.coverage", { a: z.pokritost.pokrite, b: z.pokritost.vseh }) : "",
    z.samoVZapiskih?.length ? t("pr.unmatched", { n: z.samoVZapiskih.length }) : "",
    z.delno ? t("pr.partial", { n: z.pregledanih }) : "",
  ].filter(Boolean);
  const danes = new Date().toISOString().slice(0, 10);
  const el = izrisi(
    `${uvod ? glava({ naslov: t("pr.newTitle"), pod: `${t("pr.step", { n: 3 })} · ${t("pr.step3")}`, nazaj: true }) + koraki(3) : glava({ naslov: t("pr.topicsCard"), nazaj: true })}
    <div class="pr-uvod"><h2>${esc(t("pr.topicsTitle"))}</h2><p class="muted">${esc(z.obseg ? `${P.plan?.unitTitles?.join(", ") || ""}${P.plan?.unitTitles?.length ? ". " : ""}${t("pr.topicsSub")}` : t("pr.topicsSubNoScope"))}</p></div>
    ${obseg.length ? `<ul class="card pr-seznam pr-teme">${obseg.join("")}</ul>` : `<p class="muted">${esc(t("pr.noTopics"))}</p>`}
    ${opombe.length ? `<p class="muted pr-mala">${esc(opombe.join(" "))}</p>` : ""}
    ${P.plan ? `<div class="card pr-datum"><label for="pr-datum3">${esc(t("pr.date"))}</label><input id="pr-datum3" type="date" min="${danes}" value="${esc(P.plan.date || "")}"></div>` : ""}
    ${z.predznanje?.length ? `<p class="muted pr-mala">${esc(t("pr.prior", { list: z.predznanje.map((x) => x.ime).join(", ") }))}</p>` : ""}
    <p class="pr-err" role="alert" aria-live="assertive"></p>
    <div class="pr-dno">${
      uvod
        ? `<button type="button" class="primary big pr-kviz" data-pr-kviz><span>${esc(t("pr.startQuiz"))}</span><small>${esc(t("pr.startQuizSub"))}</small></button><p class="muted pr-mala pr-sredina">${esc(t("pr.startQuizNote"))}</p>`
        : `<button type="button" class="primary big" data-pr-domov>${esc(t("pr.toPlan"))}</button>`
    }</div>`,
    n,
  );
  if (!el) return;
  const err = el.querySelector(".pr-err");
  el.querySelector("[data-pr-nazaj]").addEventListener("click", () => (uvod ? korakZapiski(undefined, { uvod: true }) : domov()));
  el.querySelector("[data-pr-domov]")?.addEventListener("click", () => domov());
  el.querySelector("[data-pr-kviz]")?.addEventListener("click", () => zacniKviz(err));
  // Odstranjena tema (ni na testu) gre takoj na strežnik: obseg, načrt in kviz jo izpustijo.
  el.querySelectorAll("[data-pr-tema]").forEach((c) =>
    c.addEventListener("change", async () => {
      c.disabled = true;
      if (c.checked) izkljucene.delete(c.dataset.prTema);
      else izkljucene.add(c.dataset.prTema);
      try {
        const r = await D.api(pot(), { method: "PUT", body: { izkljucene: [...izkljucene] } });
        P.priprava = { ...P.priprava, ...r.priprava };
        c.closest(".pr-tema").classList.toggle("ven", !c.checked);
        const small = c.closest(".pr-tema").querySelector("small");
        const tm = z.obseg.find((x) => x.id === c.dataset.prTema);
        small.textContent = !c.checked ? t("pr.removed") : tm?.izsekov ? t("pr.inNotes", { n: tm.izsekov }) : t("pr.notInNotes");
        small.className = !c.checked ? "muted" : tm?.izsekov ? "pr-ok" : "muted";
      } catch (x) {
        c.checked = !c.checked;
        err.textContent = napaka(x);
      }
      c.disabled = false;
    }),
  );
  // Nov datum gre skozi načrt testa (isti test se posodobi, urnik in viri ostanejo).
  el.querySelector("#pr-datum3")?.addEventListener("change", async (e) => {
    if (!e.target.value) return;
    try {
      const r = await D.api(`/api/students/${sid()}/test-plan`, { method: "POST", body: { path: P.plan.path, units: P.plan.units, date: e.target.value } });
      P.plan = r.plan;
      P.pid = r.plan.pripravaId;
    } catch (x) {
      err.textContent = napaka(x);
      e.target.value = P.plan.date;
    }
  });
}

// ---------- kviz ----------
function kvizSeja() {
  D.addSession("priprava-kviz", {
    mode: "priprava",
    endpoint: `priprave/${P.pid}/kviz`,
    icon: "clipboard-check",
    title: esc(t("pr.quizTitle")),
    intro: esc(t("pr.quizIntro")),
    back: "path",
    doneHtml: kvizKonec,
    wire: kvizPovezi,
    errorText: (err) => napaka(err),
  });
}
async function zacniKviz(err) {
  kvizSeja();
  lsSet(LS(P.pid), "1");
  try {
    // Teme brez nalog: kviza ni, načrt pa je (zapiski).
    const nacrt = await D.api(pot("/nacrt"));
    P.nacrt = nacrt;
    if (!nacrt.dnevi.some((d) => d.naloge.some((x) => x.tema?.vaja))) {
      D.toast(t("pr.noQuizTopics"));
      return domov();
    }
  } catch (x) {
    if (err) err.textContent = napaka(x);
    return;
  }
  D.startSession("priprava-kviz", { dolzina: 6 });
}
const OZNAKA_KVIZA = { ok: "ok", few: "delno", more: "ne" };
function kvizKonec(n) {
  const list = (n.list || []).filter((k) => k.status !== "none");
  return `<div class="card result pr-konec"><h2>${esc(t("pr.quizDone"))}</h2>
    <p class="pr-rezultat"><b>${esc(t("pr.quizScore", { a: n.correct, b: n.total }))}</b></p>
    <p class="muted pr-mala">${esc(t("pr.quizChecked"))}</p>
    ${list.length ? `<h3>${esc(t("pr.byTopic"))}</h3><ul class="pr-seznam pr-po-temah">${list.map((k) => `<li><span dir="auto">${esc(k.name)}</span><span class="pr-chip ${OZNAKA_KVIZA[k.status]}">${esc(t(`pr.q.${k.status}`))} · <bdi>${k.correct}/${k.total}</bdi></span></li>`).join("")}</ul>` : ""}
    <div class="pr-nacrt-po" data-pr-nacrt-po aria-live="polite"></div>
    <p class="muted pr-mala">${esc(t("pr.noForecast"))}</p>
    <div class="pr-dno"><button type="button" class="primary big" data-pr-domov>${esc(t("pr.toToday"))}</button></div></div>`;
}
async function kvizPovezi(el) {
  el.querySelector("[data-pr-domov]")?.addEventListener("click", () => domov());
  const slot = el.querySelector("[data-pr-nacrt-po]");
  if (!slot) return;
  try {
    const nacrt = await D.api(pot("/nacrt"));
    P.nacrt = nacrt;
    const fokus = [...new Set(nacrt.dnevi.flatMap((d) => d.naloge).filter((x) => x.tema && x.vrsta !== "ponovitev").map((x) => x.tema.ime))].slice(0, 3);
    const dni = nacrt.dnevi.slice(0, 7);
    slot.innerHTML = `<section class="pr-nacrt-kartica"><h3>${esc(nacrt.datum ? t("pr.planTitleDate", { date: datum(nacrt.datum, { weekday: "short", day: "numeric", month: "numeric" }) }) : t("pr.planTitle"))}</h3>
      ${fokus.length ? `<p>${esc(t("pr.planFocus", { list: fokus.join(", ") }))}</p>` : ""}
      ${nacrt.dnevi.some((d) => d.naloge.some((x) => x.vrsta === "poskusni_test")) ? `<p>${esc(t("pr.planMock"))}</p>` : ""}
      <ol class="pr-trak">${dni.map((d) => `<li class="${d.naloge.some((x) => x.vrsta === "poskusni_test") ? "test" : d.naloge.length ? "on" : ""}"><span>${esc(datum(d.datum, { weekday: "short" }))}</span></li>`).join("")}</ol></section>`;
  } catch {
    slot.innerHTML = "";
  }
}

// ---------- Danes ----------
export async function domov(n = nov()) {
  P.zaslon = "domov";
  nalagam(n);
  try {
    const [pr, nacrt, napredek] = await Promise.all([D.api(pot()), D.api(pot("/nacrt")), D.api(pot("/napredek"))]);
    Object.assign(P, { priprava: pr.priprava, nacrt, napredek });
  } catch (err) {
    if (err?.status === 404) return odpri(D, { uredi: true });
    return napakaZaslona(err, n, () => domov());
  }
  izrisiDomov(n);
}

function enotaHtml(u, i, nacrt) {
  const potrebno = nacrt.potrebnoNalog?.[u.vrsta];
  const reseno = Math.min(potrebno || 0, nacrt.nalogDanes?.[u.tema?.id] || 0);
  const naslednja = nacrt.naslednja && u.tema && nacrt.naslednja.tema?.id === u.tema.id && nacrt.naslednja.vrsta === u.vrsta;
  const pod = u.opravljeno
    ? t("pr.done")
    : u.vrsta === "poskusni_test"
      ? t("pr.mockSub")
      : u.vrsta === "zapiski"
        ? t("pr.cutsN", { n: u.tema?.izsekov || 0 })
        : `${t("pr.tasksOf", { a: reseno, b: potrebno })}${naslednja ? ` · ${t("pr.nextMark")}` : ""}`;
  const ime = `${t(`pr.u.${u.vrsta}`)}${u.tema ? ` · ${u.tema.ime}` : ""}`;
  return `<li><button type="button" class="pr-enota${u.opravljeno ? " opravljeno" : ""}${naslednja ? " naslednja" : ""}" data-pr-enota="${i}">
      <span class="pr-krog" aria-hidden="true">${u.opravljeno ? icon("check") : ""}</span>
      <span class="pr-enota-t"><span class="pr-enota-ime" dir="auto">${esc(ime)}</span><small>${esc(pod)}</small></span>${icon("chevron-right")}</button></li>`;
}

function izrisiDomov(n) {
  const { priprava, nacrt, napredek, plan } = P;
  const pr = nacrt.pripravljenost;
  const doTesta = priprava.datum_testa ? dniMed(nacrt.danes, priprava.datum_testa) : null;
  const kdaj =
    doTesta === null ? t("pr.noDate") : doTesta < 0 ? t("pr.past") : doTesta === 0 ? t("pr.today") : doTesta === 1 ? t("pr.tomorrow") : t("pr.inDays", { n: doTesta });
  const danes = nacrt.dnevi[0]?.datum === nacrt.danes ? nacrt.dnevi[0].naloge : [];
  const naprej = naslednjaEnota(nacrt);
  const naprejI = naprej ? danes.indexOf(danes.find((u) => u.vrsta === naprej.vrsta && u.tema?.id === naprej.tema?.id)) : -1;
  const dnevi = nacrt.dnevi.filter((d) => d.datum !== nacrt.danes).slice(0, 6);
  const stanje = new Map((napredek?.teme || []).map((x) => [x.id, x]));
  const teme = (napredek?.teme || []).map((x) => {
    const s = x.stanje === "zapiski" ? "zapiski" : x.nalog ? x.stanje : x.stanje === "nova" ? "brez" : x.stanje;
    return `<li><button type="button" class="pr-tema-v" data-pr-tema-odpri="${esc(x.id)}"><span dir="auto">${esc(x.ime)}</span><span class="pr-chip ${RAZRED_STANJA[x.stanje] || "siv"}">${esc(t(`pr.s.${s}`))}</span>${icon("chevron-right")}</button></li>`;
  });
  const viri = priprava.viri.length;
  const izsekov = priprava.viri.reduce((a, v) => a + (v.izsekov || 0), 0);
  const el = izrisi(
    `${glava({
      naslov: t("pr.title"),
      pod: [priprava.naslov, plan?.unitTitles?.join(", ")].filter(Boolean).join(" · "),
      desno: `<button type="button" class="ghost icon-only" data-pr-nastavitve aria-label="${esc(t("pr.settings"))}" title="${esc(t("pr.settings"))}">${icon("settings")}</button>`,
    })}
    <div class="pr-mreza">
      <section class="pr-junak pr-a">
        <div class="pr-junak-vrh"><b>${esc(kdaj)}</b><span>${esc(datum(priprava.datum_testa, { weekday: "short", day: "numeric", month: "numeric" }))}</span></div>
        ${
          pr.odstotek === null
            ? `<p>${esc(t("pr.readyNone"))}</p>`
            : `<div class="pr-odstotek"><b>${pr.odstotek} %</b><span>${esc(t("pr.ready"))}</span></div>
        <div class="pr-trak-napredka" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pr.odstotek}" aria-label="${esc(t("pr.ready"))}"><span style="width:${pr.odstotek}%"></span></div>
        <p>${esc(t("pr.readyText", { a: pr.obvladanih, b: pr.preverljivih }))}</p>`
        }
      </section>
      <section class="card pr-danes pr-b">
        <h2 class="pr-h2">${esc(t("pr.todayTitle"))}</h2>
        ${danes.length ? `<ul class="pr-enote">${danes.map((u, i) => enotaHtml(u, i, nacrt)).join("")}</ul>` : `<p class="muted">${esc(t("pr.todayEmpty"))}</p>`}
        ${naprej ? `<button type="button" class="primary big pr-naprej" data-pr-enota="${naprejI}">${esc(t("pr.continue", { what: `${t(`pr.u.${naprej.vrsta}`).toLowerCase()}${naprej.tema ? ` ${naprej.tema.ime}` : ""}` }))}</button>` : ""}
      </section>
      <section class="pr-dnevi-o pr-c">
        <h2 class="pr-h2 muted">${esc(t("pr.nextDays"))}</h2>
        <ol class="pr-dnevi">${dnevi
          .map((d) => {
            const test = d.naloge.some((x) => x.vrsta === "poskusni_test");
            return `<li class="${test ? "test" : ""}"><span class="muted">${esc(datum(d.datum, { weekday: "short", day: "numeric", month: "numeric" }))}</span><b>${esc(test ? t("pr.u.poskusni_test") : d.naloge.length ? t("pr.units", { n: d.naloge.length }) : t("pr.free"))}</b></li>`;
          })
          .join("")}</ol>
        ${nacrt.stisnjeno ? `<p class="muted pr-mala">${esc(t("pr.squeezed", { n: nacrt.nePrideNaVrsto.length }))}</p>` : ""}
      </section>
      <section class="card pr-teme-k pr-d">
        <div class="pr-h-vrsta"><h2 class="pr-h2">${esc(t("pr.topicsCard"))}</h2><button type="button" class="text-btn" data-pr-obseg>${esc(t("pr.editScope"))}</button></div>
        <ul class="pr-teme-seznam">${teme.join("")}</ul>
      </section>
      <nav class="pr-povezave pr-e" aria-label="${esc(t("pr.title"))}">
        <button type="button" class="pr-povezava" data-pr-obseg><b>${esc(t("pr.topicsCard"))}</b><small>${esc(t("pr.topicsN", { n: napredek?.teme?.length || 0 }))}</small></button>
        <button type="button" class="pr-povezava" data-pr-zapiski><b>${esc(t("pr.myNotes"))}</b><small>${esc(t("pr.notesMeta", { a: t("pr.sourcesN", { n: viri }), b: t("pr.srcCuts", { n: izsekov }) }))}</small></button>
      </nav>
    </div>`,
    n,
  );
  if (!el) return;
  el.querySelector("[data-pr-nastavitve]").addEventListener("click", () => korakTest());
  el.querySelectorAll("[data-pr-obseg]").forEach((b) => b.addEventListener("click", () => korakTeme()));
  el.querySelector("[data-pr-zapiski]").addEventListener("click", () => korakZapiski(undefined, { uvod: false }));
  el.querySelectorAll("[data-pr-enota]").forEach((b) => b.addEventListener("click", () => odpriEnoto(danes[Number(b.dataset.prEnota)] || naprej)));
  el.querySelectorAll("[data-pr-tema-odpri]").forEach((b) => b.addEventListener("click", () => tema(b.dataset.prTemaOdpri, stanje.get(b.dataset.prTemaOdpri))));
}

// Enota načrta: nova snov (lekcija in naloge teme), vaja in ponovitev (naloge teme), zapiski (razlaga iz zapiskov),
// poskusni test (mešane naloge iz sklopov, obstoječi /test-prep).
async function odpriEnoto(u) {
  if (!u) return;
  if (u.vrsta === "poskusni_test") return D.startSession("test-prep");
  if (u.vrsta === "zapiski") return tema(u.tema.id);
  await vadi(u.tema.id, u.vrsta === "nova");
}
async function vadi(id, uvod = false) {
  const pretest = await D.openTopic(id);
  if (!pretest) await D.nextPractice(uvod ? { stay: true } : undefined);
}

// ---------- tema: razlaga iz zapiskov z virom ----------
async function tema(id, info = null, n = nov()) {
  P.zaslon = "tema";
  nalagam(n);
  let z, r;
  try {
    [z, r] = await Promise.all([
      P.teme ? P.teme : D.api(pot("/teme")),
      D.api(pot(`/razlaga?tema_id=${encodeURIComponent(id)}`)).catch((e) => (e?.status === 404 ? null : Promise.reject(e))),
      P.priprava ? null : D.api(pot()).then((x) => (P.priprava = x.priprava)),
    ]);
  } catch (err) {
    return napakaZaslona(err, n, () => tema(id, info));
  }
  P.teme = z;
  const tm = z.teme.find((x) => x.id === id) || z.obseg?.find((x) => x.id === id) || { id, ime: info?.ime || id, izseki: [] };
  izrisiTemo(n, tm, r, info);
}

function virIme(vid) {
  const v = (P.priprava?.viri || []).find((x) => x.id === vid);
  return v ? v.ime || t(v.vrsta === "slika" ? "pr.srcPhoto" : "pr.srcText") : "";
}
function odstavekHtml(o, i) {
  const viri = (o.viri || []).filter((v) => v.vir_id);
  return `<article class="card pr-odstavek">
      <p class="pr-besedilo" dir="auto">${besediloZFormulami(o.besedilo, formula)}</p>
      ${o.navedek ? `<blockquote class="pr-navedek" dir="auto">»${oznaciNegotovo(esc(o.navedek))}«</blockquote>` : ""}
      ${o.negotovo ? `<p class="pr-opozorilo" role="note">${icon("info")} <span>${oznaciNegotovo(esc(t("pr.unsureNote")))}</span></p>` : ""}
      ${viri
        .map(
          (v) => `<div class="pr-vir-izsek"><button type="button" class="text-btn pr-vir-gumb" data-pr-izsek="${v.id}" data-pr-vir="${v.vir_id}" aria-expanded="false">${icon("file-text")} <span dir="auto">${esc(
            v.stran ? t("pr.source", { name: virIme(v.vir_id), n: v.stran }) : t("pr.sourceNoPage", { name: virIme(v.vir_id) }),
          )}</span></button><div class="pr-izsek" hidden data-pr-izsek-besedilo="${i}-${v.id}"></div></div>`,
        )
        .join("")}
    </article>`;
}

function izrisiTemo(n, tm, r, info, sporocilo = "") {
  const izsekov = tm.izseki?.length || 0;
  const vaja = info ? info.stanje !== "zapiski" : true;
  const prebranoDanes = (P.nacrt?.dnevi?.[0]?.naloge || []).some((x) => x.vrsta === "zapiski" && x.tema?.id === tm.id && x.opravljeno);
  const zapiskiEnota = info?.stanje === "zapiski";
  let vsebina;
  if (r) {
    vsebina = `<div class="pr-chipi"><span class="pr-chip ok">${icon("badge-check")} ${esc(t("pr.supported"))}</span><span class="pr-chip siv">${icon("bot")} ${esc(t("pr.byAi"))}</span></div>
      ${r.nujno ? nujnoHtml(r.nujno) : ""}
      ${r.zastarela ? `<div class="card pr-opozorilo-k" role="note"><p>${esc(t("pr.stale"))}</p><button type="button" class="secondary" data-pr-razlozi="znova">${esc(t("pr.remakeExpl"))}</button></div>` : ""}
      ${r.odstavki.map(odstavekHtml).join("")}
      <p class="muted pr-mala">${r.zavrnjenih ? `${esc(t("pr.dropped", { n: r.zavrnjenih }))} ` : ""}${esc(t("pr.notCorrect"))}</p>`;
  } else if (izsekov) {
    vsebina = `<div class="card pr-razlozi"><p>${esc(t("pr.makeExplText"))}${P.strani ? ` ${esc(t("pr.quota", { n: P.strani.left }))}` : ""}</p>
      <button type="button" class="primary" data-pr-razlozi="nova">${esc(t("pr.makeExpl"))}</button></div>`;
  } else vsebina = `<p class="card muted">${esc(t("pr.noCuts"))}</p>`;
  const el = izrisi(
    `${glava({ naslov: tm.ime, pod: t("pr.explTitle"), nazaj: true })}
    <p class="pr-err" role="alert" aria-live="assertive">${esc(sporocilo)}</p>
    <div class="pr-tema-mreza"><div class="pr-tema-glavno">${vsebina}</div>
    <aside class="pr-tema-dej">
      ${vaja ? `<button type="button" class="primary big" data-pr-vadi>${esc(t("pr.practice"))}</button>` : ""}
      ${zapiskiEnota ? `<button type="button" class="${vaja ? "secondary" : "primary"} big" data-pr-prebrano ${prebranoDanes ? 'aria-pressed="true"' : ""}>${icon("check")} ${esc(t(prebranoDanes ? "pr.markedRead" : "pr.markRead"))}</button>` : ""}
      <button type="button" class="secondary big" data-pr-lekcija>${icon("book-open")} ${esc(t("pr.lesson"))}</button>
      <button type="button" class="secondary big" data-pr-tutor>${icon("message-circle")} ${esc(t("pr.tutor"))}</button>
    </aside></div>`,
    n,
  );
  if (!el) return;
  el.querySelector("[data-pr-nazaj]").addEventListener("click", () => domov());
  el.querySelector("[data-pr-vadi]")?.addEventListener("click", () => vadi(tm.id));
  el.querySelector("[data-pr-lekcija]").addEventListener("click", () => D.openLesson(tm.id));
  el.querySelector("[data-pr-tutor]").addEventListener("click", () => D.learnWithTutor({ id: tm.id, name: tm.ime }));
  el.querySelector("[data-pr-prebrano]")?.addEventListener("click", async (e) => {
    const b = e.currentTarget;
    const zdaj = b.getAttribute("aria-pressed") === "true";
    try {
      await D.api(pot("/nacrt/prebrano"), { method: "POST", body: { tema_id: tm.id, prebrano: !zdaj } });
      b.setAttribute("aria-pressed", String(!zdaj));
      b.innerHTML = `${icon("check")} ${esc(t(!zdaj ? "pr.markedRead" : "pr.markRead"))}`;
      P.nacrt = null;
    } catch (x) {
      el.querySelector(".pr-err").textContent = napaka(x);
    }
  });
  el.querySelectorAll("[data-pr-razlozi]").forEach((b) =>
    b.addEventListener("click", async () => {
      b.disabled = true;
      b.textContent = t("pr.making");
      const nn = nov();
      try {
        const out = await D.api(pot("/razlaga"), { method: "POST", body: { tema_id: tm.id, ...(b.dataset.prRazlozi === "znova" ? { znova: true } : {}) } });
        if (out.pages) P.strani = out.pages;
        izrisiTemo(nn, tm, out, info);
      } catch (x) {
        if (x?.body?.pages) P.strani = x.body.pages;
        izrisiTemo(nn, tm, r, info, napaka(x));
        if (x?.body?.nujno) {
          const g = box()?.querySelector(".pr-tema-glavno");
          g?.insertAdjacentHTML("afterbegin", nujnoHtml(x.body.nujno));
        }
      }
    }),
  );
  // Izvirni izsek (dobesedno, z oznakami [?]): učenec preveri navedek v svojih zapiskih.
  const izseki = new Map();
  el.querySelectorAll("[data-pr-izsek]").forEach((b) =>
    b.addEventListener("click", async () => {
      const box2 = b.parentElement.querySelector("[data-pr-izsek-besedilo]");
      if (!box2.hidden) {
        box2.hidden = true;
        b.setAttribute("aria-expanded", "false");
        return;
      }
      const vid = b.dataset.prVir;
      try {
        if (!izseki.has(vid)) izseki.set(vid, (await D.api(pot(`/izseki?vir=${encodeURIComponent(vid)}`))).izseki);
        const iz = izseki.get(vid).find((x) => String(x.id) === b.dataset.prIzsek);
        box2.innerHTML = iz ? `<p class="pr-izvirnik" dir="auto">${oznaciNegotovo(esc(iz.besedilo))}</p>` : "";
        box2.hidden = !iz;
        b.setAttribute("aria-expanded", String(!!iz));
      } catch (x) {
        el.querySelector(".pr-err").textContent = napaka(x);
      }
    }),
  );
}

// Za teste in app.js: trenutni zaslon priprave (ali ga osvežiti ob vrnitvi).
export const trenutni = () => P.zaslon || null;
