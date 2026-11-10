// Ustno spraševanje »Vprašaj me« (server/ustno-api.js). Naloži se šele ob odprtju (ni del prvega odprtja).
// Glas ali tipkanje sta enakovredna. Govor v besedilo spremeni brskalnik (SpeechRecognition): zvoka ne snemamo in ga
// ne pošiljamo; strežnik dobi samo besedilo, ki ga učenec pred oddajo vidi in lahko popravi. Brez časovnika.
// Brez povezave: samoocena (vprašanje → vzorčni odgovor → Znam / Delno / Ne znam), brez AI.
import { t as tGlobal, currentLang, locale } from "../i18n.js";
import { uiChain, UI_LANGUAGES, langInfo } from "../i18n/languages.js";
import { icon, hydrateIcons } from "../icons.js";
import { spokenMath } from "../speech.js";
import { zaznajNujno, stevilke, vrstice, klici, telHref, drzavaNaprave, izoliraj, izsiljevanje, opomba } from "../nujno.js";
import SL from "./besedila/sl.js";

const KEY_NOTICE = "evklid.ustno.obvestilo";
const KEY_PREFS = "evklid.ustno.nastavitve";
const ls = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// --- besedila (lastni slovar, naložen ob odprtju) ---
let dicts = [SL];
let dictsLang = null;
export async function loadDicts() {
  const lang = currentLang();
  if (dictsLang === lang) return;
  const chain = uiChain(lang);
  const want = chain.slice(0, chain.indexOf("sl")).map((c) => (c === "sr-Latn" ? "sr" : c)).filter((c) => UI_LANGUAGES.includes(c) && c !== "sl");
  const got = await Promise.all(
    want.map((c) =>
      fetch(`/ustno/besedila/${c}.json`)
        .then((r) => (r.ok ? r.json() : (r.body?.cancel?.(), null)))
        .catch(() => null),
    ),
  );
  dicts = [...got.filter(Boolean), SL];
  dictsLang = lang;
}
const plural = (n) => {
  try {
    return new Intl.PluralRules(currentLang()).select(n);
  } catch {
    return "other";
  }
};
export function tt(key, vars = {}) {
  let v;
  for (const d of dicts) if (d[key] !== undefined) {
    v = d[key];
    break;
  }
  if (v === undefined) return tGlobal(key, vars);
  if (typeof v === "object") v = v[plural(Number(vars.n))] ?? v.other;
  return v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

// --- prepoznavanje govora (brskalnik) ---
export const speechOk = () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const recLang = () => (currentLang() === "sl" ? "sl-SI" : locale());

// --- branje na glas (glas naprave) ---
function voiceFor(lang) {
  const vs = window.speechSynthesis?.getVoices() || [];
  const base = String(lang).split("-")[0].toLowerCase();
  return vs.find((v) => v.lang?.toLowerCase().replace("_", "-").startsWith(base)) || null;
}
function speak(text, onNoVoice) {
  const synth = window.speechSynthesis;
  if (!synth) return onNoVoice?.();
  synth.cancel();
  const go = () => {
    const v = voiceFor(currentLang());
    if (!v) return onNoVoice?.();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v;
    u.lang = v.lang;
    synth.speak(u);
  };
  if (synth.getVoices().length) go();
  else {
    synth.addEventListener("voiceschanged", go, { once: true });
    setTimeout(() => synth.getVoices().length || onNoVoice?.(), 1500);
  }
}
const stopSpeak = () => window.speechSynthesis?.cancel();

// --- »Si rekel …?«: strokovna beseda, ki je v prepisu skoraj (ne pa točno) zapisana ---
const fold = (s) => String(s).toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
function lev(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
export function misheard(text, terms) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const clean = words.map((w) => fold(w.replace(/[^\p{L}]/gu, "")));
  const have = new Set(clean);
  for (const term of terms || []) {
    const tw = fold(term).split(" ");
    if (tw.every((w) => have.has(w))) continue;
    const k = tw.length;
    for (let i = 0; i + k <= clean.length; i++) {
      const span = clean.slice(i, i + k).join(" ");
      if (!span || span === tw.join(" ") || span.length < 4) continue;
      const d = lev(span, tw.join(" "));
      // podobno, a ne isto: največ 2 napaki in vsaj 70 % ujemanja; prva črka enaka ali glas brez h (»omov« → »ohmov«)
      if (d > 0 && d <= 2 && 1 - d / Math.max(span.length, term.length) >= 0.7 && (span[0] === fold(term)[0] || fold(term).replace(/h/g, "").startsWith(span.slice(0, 2)))) {
        return { from: i, len: k, said: words.slice(i, i + k).join(" "), term };
      }
    }
  }
  return null;
}

// --- okno ---
let dlg = null;
let ctx = null;
let run = null; // stanje enega spraševanja
let rec = null;

function sheet() {
  if (dlg?.isConnected) return dlg;
  if (!document.querySelector('link[href="/ustno/ustno.css"]')) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "/ustno/ustno.css";
    document.head.append(l);
  }
  dlg = document.createElement("dialog");
  dlg.className = "us-okno";
  dlg.setAttribute("aria-labelledby", "us-title");
  dlg.addEventListener("close", () => {
    stopRec();
    stopSpeak();
  });
  document.body.append(dlg);
  return dlg;
}
function paint(body, { title = tt("u.naslov"), focus = null } = {}) {
  const d = sheet();
  d.innerHTML = `<div class="us-box" role="document">
    <div class="us-head"><span class="us-ic">${icon("mic")}</span><h2 id="us-title">${esc(title)}</h2>
      <button type="button" class="ghost icon-only" data-us="x" aria-label="${esc(tt("u.zapri"))}" title="${esc(tt("u.zapri"))}">${icon("x")}</button></div>
    <div class="us-body">${body}</div>
    <p class="us-live" role="status" aria-live="polite"></p>
  </div>`;
  d.dir = langInfo(currentLang()).rtl ? "rtl" : "ltr";
  hydrateIcons?.(d);
  d.querySelector('[data-us="x"]').addEventListener("click", () => d.close());
  if (!d.open) d.showModal();
  const f = focus ? d.querySelector(focus) : d.querySelector(".us-body h3, .us-body button, .us-body input, .us-body textarea");
  f?.focus?.();
  return d;
}
const live = (msg) => {
  const el = dlg?.querySelector(".us-live");
  if (el) el.textContent = msg || "";
};
const rich = (md) => (ctx?.renderRich ? ctx.renderRich(String(md || "")) : esc(md));

function prefs() {
  try {
    return { n: 5, nacin: "glas", beri: true, ...JSON.parse(ls.get(KEY_PREFS) || "{}") };
  } catch {
    return { n: 5, nacin: "glas", beri: true };
  }
}

/**
 * Odpre spraševanje. src: { tema } (lekcija), { test: true } (urnik), { besedilo } (klepet: »Vprašaj me … iz …«).
 * c: { api, student, renderRich, openLesson }.
 */
export async function odpri(src = {}, c = {}) {
  ctx = c;
  // Gumb data-ustno: "test" (urnik), "pogovor" (klepet: tema pogovora ali zadnje vprašanje), sicer id lekcije.
  if (typeof src === "string") {
    const last = [...document.querySelectorAll("#messages .msg.user")].pop()?.textContent?.trim();
    src = src === "test" ? { test: true } : src === "pogovor" ? (c.topic ? { tema: c.topic } : last ? { besedilo: last.slice(0, 300) } : {}) : { tema: src };
  }
  await loadDicts();
  paint(`<p class="muted">${esc(tt("u.nalagam"))}</p>`);
  const sid = c.student?.id;
  const q = new URLSearchParams();
  if (src.tema) q.set("tema", src.tema);
  if (src.test) q.set("test", "1");
  if (src.besedilo) q.set("besedilo", src.besedilo);
  let pre;
  try {
    pre = await c.api(`/api/students/${sid}/ustno?${q}`);
  } catch (e) {
    return paint(`<p class="us-err">${esc(e?.offline ? tt("u.brezPovezave") : e?.message || tt("u.ocenaNapaka"))}</p>`);
  }
  // število iz klepeta (»Vprašaj me 3 vprašanja …«)
  const asked = Number(/\b([358])\b/.exec(src.besedilo || "")?.[1]);
  setup(src, pre, asked);
}

function setup(src, pre, asked) {
  const p = prefs();
  if (asked) p.n = asked;
  const canVoice = speechOk() && pre.glas?.dovoljen;
  const voiceNote = !speechOk() ? tt("u.glasNi") : !pre.glas?.dovoljen ? tt("u.glasStars") : "";
  const nacin = canVoice ? p.nacin : "tipkanje";
  if (!pre.snov) {
    const d = paint(`<form class="us-form" data-us="isci">
        <p>${esc(src.besedilo ? tt("u.niVprasanj") : "")}</p>
        <label class="us-field"><span>${esc(tt("u.iskanje"))}</span><input name="q" maxlength="120" placeholder="${esc(tt("u.isciPh"))}" autocomplete="off" required></label>
        <button type="submit" class="primary">${esc(tt("u.isci"))}</button></form>`);
    d.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = e.target.q.value.trim();
      if (v) odpri({ besedilo: v }, ctx);
    });
    return;
  }
  const seg = (name, opts, cur) =>
    `<div class="us-seg" role="radiogroup">${opts.map(([v, label, dis]) => `<label class="${dis ? "dis" : ""}"><input type="radio" name="${name}" value="${v}" ${String(v) === String(cur) ? "checked" : ""} ${dis ? "disabled" : ""}><span>${esc(label)}</span></label>`).join("")}</div>`;
  const d = paint(
    `<form class="us-form" data-us="nastavi">
      <p class="us-snov"><span class="muted">${esc(tt("u.snov"))}:</span> <b dir="auto">${esc(pre.snov.naslov)}</b></p>
      <fieldset><legend>${esc(tt("u.koliko"))}</legend>${seg("n", (pre.stevila || [3, 5, 8]).map((n) => [n, String(n)]), p.n)}</fieldset>
      <fieldset><legend>${esc(tt("u.kako"))}</legend>${seg("nacin", [["glas", tt("u.glas"), !canVoice], ["tipkanje", tt("u.tipkam")]], nacin)}
        ${voiceNote ? `<p class="muted small">${esc(voiceNote)}</p>` : ""}</fieldset>
      <label class="check"><input type="checkbox" name="beri" ${p.beri ? "checked" : ""}><span>${esc(tt("u.beri"))}<br><small class="muted">${esc(tt("u.slusalke"))}</small></span></label>
      <p class="muted small">${icon("lock")} ${esc(tt("u.zasebno"))}</p>
      <div class="us-actions"><button type="submit" class="primary">${icon("play")} ${esc(tt("u.zacni"))}</button></div>
      <details class="us-self"><summary>${esc(tt("u.samoocena"))}</summary><p class="muted small">${esc(tt("u.samoocenaOpis"))}</p>
        <button type="button" class="secondary" data-us="self">${esc(tt("u.samoocena"))}</button></details>
    </form>`,
  );
  const form = d.querySelector("form");
  const read = () => ({ n: Number(form.n.value), nacin: form.nacin.value, beri: form.beri.checked });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = read();
    ls.set(KEY_PREFS, JSON.stringify(v));
    if (v.nacin === "glas" && ls.get(KEY_NOTICE) !== "1") return notice(() => start(src, v, false));
    start(src, v, false);
  });
  d.querySelector('[data-us="self"]').addEventListener("click", () => start(src, read(), true));
}

// Obvestilo pred prvo uporabo glasu (odločitev j).
function notice(next) {
  const d = paint(`<div class="us-notice"><p>${icon("info")} ${esc(tt("u.obvestilo"))}</p><div class="us-actions"><button type="button" class="primary" data-us="ok">${esc(tt("u.razumem"))}</button></div></div>`, { focus: '[data-us="ok"]' });
  d.querySelector('[data-us="ok"]').addEventListener("click", () => {
    ls.set(KEY_NOTICE, "1");
    next();
  });
}

async function start(src, v, samoocena, repeat = null) {
  paint(`<p class="muted">${esc(tt("u.nalagam"))}</p>`);
  const body = repeat ? { iz: repeat.id, vprasanja: repeat.i, naslov: repeat.naslov, n: v.n, nacin: v.nacin } : { ...src, n: v.n, nacin: v.nacin };
  let r;
  try {
    r = await ctx.api(`/api/students/${ctx.student.id}/ustno/${samoocena ? "samoocena" : "zacni"}`, { method: "POST", body });
  } catch (e) {
    return paint(`<p class="us-err">${esc(e?.body?.code?.startsWith("u.") ? tt(e.body.code) : e?.offline ? tt("u.brezPovezave") : e?.message || tt("u.ocenaNapaka"))}</p>`);
  }
  run = { id: r.id, naslov: r.naslov, qs: r.vprasanja, i: 0, nacin: v.nacin, beri: v.beri, samo: samoocena, self: [], res: [], src, v };
  question();
}

// --- vprašanje ---
function question(follow = null) {
  const q = run.qs[run.i];
  if (!q) return finish();
  if (run.samo) return selfQuestion(q);
  const voice = run.nacin === "glas" && speechOk();
  const label = follow ? tt("u.dodatno") : tt("u.vprasanje", { i: run.i + 1, n: run.qs.length });
  const text = follow || q.besedilo;
  const d = paint(
    `<p class="us-count">${esc(label)}</p>
    <h3 class="us-q" tabindex="-1" dir="auto">${rich(text)}</h3>
    <button type="button" class="ghost small" data-us="read">${icon("volume-2")} ${esc(tt("u.preberi"))}</button>
    ${voice ? `<div class="us-mic-row"><button type="button" class="us-mic" data-us="mic" aria-pressed="false" aria-label="${esc(tt("u.mikrofon"))}">${icon("mic")}</button><p class="us-mic-hint muted">${esc(tt("u.dotakni"))}</p></div>` : ""}
    ${q.vrsta === "izracunaj" && !follow ? `<p class="muted small">${esc(tt("u.racun"))}</p>` : ""}
    <label class="us-field"><span>${esc(tt("u.prepis"))}</span><textarea name="odgovor" rows="4" maxlength="3000" dir="auto"></textarea></label>
    ${q.vrsta === "izracunaj" && !follow ? `<label class="us-field"><span>${esc(tt("u.rezultat"))}</span><input name="rezultat" inputmode="decimal" maxlength="60" autocomplete="off" placeholder="${esc(q.enota ? `… ${q.enota}` : "")}"></label>` : ""}
    <div class="us-actions">
      ${voice ? `<button type="button" class="secondary" data-us="fix">${icon("pencil")} ${esc(tt("u.popravi"))}</button><button type="button" class="secondary" data-us="again">${icon("rotate-ccw")} ${esc(tt("u.povejZnova"))}</button>` : ""}
      <button type="button" class="primary" data-us="send">${icon("send")} ${esc(tt("u.oddaj"))}</button>
    </div>
    <div class="us-actions us-minor"><button type="button" class="ghost" data-us="dunno">${esc(tt("u.neVem"))}</button>${follow ? "" : `<button type="button" class="ghost" data-us="skip">${esc(tt("u.preskoci"))}</button>`}</div>
    <div class="us-ask" hidden></div>`,
    { focus: ".us-q" },
  );
  const area = d.querySelector("textarea");
  const result = d.querySelector('input[name="rezultat"]');
  const qEl = d.querySelector(".us-q");
  const sayIt = () => speak(q.govor && !follow ? q.govor : String(text).replace(/\$/g, ""), () => qEl.isConnected && live(tt("u.niGlasu")));
  if (run.beri) sayIt();
  d.querySelector('[data-us="read"]').addEventListener("click", sayIt);
  const mic = d.querySelector('[data-us="mic"]');
  if (mic) {
    mic.addEventListener("click", () => (rec ? stopRec() : startRec(area, mic)));
    d.querySelector('[data-us="again"]').addEventListener("click", () => {
      stopRec();
      area.value = "";
      startRec(area, mic);
    });
    d.querySelector('[data-us="fix"]').addEventListener("click", () => {
      stopRec();
      area.focus();
    });
  }
  const submit = async (skip = false) => {
    stopRec();
    stopSpeak();
    const answer = skip ? "" : area.value.trim();
    const res = skip ? "" : result?.value.trim() || "";
    if (!skip && !answer && !res) return live(tt("u.prazno"));
    // Varnost: lokalni zaznavalnik čez prepis (deluje tudi brez povezave).
    const n = zaznajNujno(`${answer} ${res}`);
    if (n) showNujno({ vrsta: n, izs: izsiljevanje(answer) });
    // »Si rekel …?« pred oddajo (koda v brskalniku, brez AI).
    const m = !skip && misheard(answer, q.besede);
    if (m && !d.dataset.asked) {
      d.dataset.asked = "1";
      const box = d.querySelector(".us-ask");
      box.hidden = false;
      box.innerHTML = `<p>${esc(tt("u.siRekel", { beseda: m.term }))}</p><div class="us-actions"><button type="button" class="secondary" data-a="da">${esc(tt("u.da"))}</button><button type="button" class="secondary" data-a="ne">${esc(tt("u.ne"))}</button></div>`;
      box.querySelector('[data-a="da"]').addEventListener("click", () => {
        const w = area.value.split(/(\s+)/);
        // zamenjaj besede m.from … m.from+len (indeksi brez presledkov)
        let k = -1;
        const out = [];
        let placed = false;
        for (const part of w) {
          if (/^\s+$/.test(part) || !part) {
            out.push(part);
            continue;
          }
          k++;
          if (k >= m.from && k < m.from + m.len) {
            if (!placed) out.push(m.term), (placed = true);
            else out.pop();
          } else out.push(part);
        }
        area.value = out.join("");
        box.hidden = true;
        submit();
      });
      box.querySelector('[data-a="ne"]').addEventListener("click", () => {
        box.hidden = true;
        submit();
      });
      box.querySelector('[data-a="da"]').focus();
      return;
    }
    await grade({ answer, res, skip, follow: !!follow });
  };
  d.querySelector('[data-us="send"]').addEventListener("click", () => submit(false));
  d.querySelector('[data-us="dunno"]').addEventListener("click", () => submit(true));
  d.querySelector('[data-us="skip"]')?.addEventListener("click", () => submit(true));
}

function startRec(area, btn) {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) return;
  const r = new Rec();
  rec = r;
  r.lang = recLang();
  r.interimResults = true;
  r.continuous = true;
  const base = area.value.replace(/\s+$/, "");
  let fin = "";
  const sl = currentLang() === "sl";
  const hint = dlg?.querySelector(".us-mic-hint");
  const on = (x) => {
    btn.classList.toggle("rec", x);
    btn.setAttribute("aria-pressed", String(x));
    if (hint) hint.textContent = tt(x ? "u.poslusam" : "u.dotakni");
  };
  r.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const x = e.results[i];
      if (x.isFinal) fin = `${fin} ${x[0].transcript.trim()}`.trim();
      else interim = `${interim} ${x[0].transcript.trim()}`.trim();
    }
    const said = [sl ? spokenMath(fin) : fin, interim].filter(Boolean).join(" ");
    area.value = [base, said].filter(Boolean).join(" ");
  };
  r.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") live(tGlobal("speech.denied") === "speech.denied" ? tt("u.glasNi") : tGlobal("speech.denied"));
  };
  r.onend = () => {
    if (rec === r) rec = null;
    on(false);
  };
  try {
    r.start();
    on(true);
  } catch {
    rec = null;
  }
}
function stopRec() {
  const r = rec;
  rec = null;
  try {
    r?.stop();
  } catch {}
}

async function grade({ answer, res, skip, follow }) {
  const q = run.qs[run.i];
  paint(`<p class="us-count">${esc(tt("u.vprasanje", { i: run.i + 1, n: run.qs.length }))}</p><p class="us-wait" role="status">${esc(tt("u.misli"))}</p>`);
  let r;
  try {
    r = await ctx.api(`/api/students/${ctx.student.id}/ustno/${run.id}/odgovor`, {
      method: "POST",
      body: { i: run.i, besedilo: answer, rezultat: res, nacin: run.nacin === "glas" && speechOk() ? "glas" : "tipkanje", dodatno: follow, preskoci: skip },
    });
  } catch (e) {
    if (e?.body?.nujno) showNujno(e.body.nujno, true);
    if (e?.offline) {
      // Brez povezave: preostanek kot samoocena (brez AI).
      run.samo = true;
      run.offline = true;
      live(tt("u.brezPovezave"));
      return selfQuestion(q, tt("u.brezPovezave"));
    }
    const msg = e?.body?.code?.startsWith("u.") ? tt(e.body.code) : e?.message || tt("u.ocenaNapaka");
    const d = paint(`<p class="us-err">${esc(msg)}</p><div class="us-actions"><button type="button" class="primary" data-us="retry">${esc(tt("u.poskusi"))}</button><button type="button" class="secondary" data-us="self">${esc(tt("u.samoocena"))}</button></div>`);
    d.querySelector('[data-us="retry"]').addEventListener("click", () => question(follow ? run.follow : null));
    d.querySelector('[data-us="self"]').addEventListener("click", () => {
      run.samo = true;
      selfQuestion(q);
    });
    return;
  }
  if (r.nujno) showNujno(r.nujno);
  run.res[run.i] = r;
  feedback(q, r, follow);
}

const STANJE = { povedal: ["u.povedal", "circle-check", "ok"], delno: ["u.delno", "circle-help", "part"], manjka: ["u.manjka", "circle", "miss"], napacno: ["u.napacno", "circle-x", "bad"] };
function feedback(q, r, wasFollow) {
  const groups = ["povedal", "delno", "manjka", "napacno"]
    .map((st) => {
      const list = r.pojmi.filter((p) => p.stanje === st);
      if (!list.length) return "";
      const [key, ic, cls] = STANJE[st];
      return `<div class="us-grp us-${cls}"><h4>${icon(ic)} ${esc(tt(key))}</h4><ul>${list
        .map((p) => `<li><span dir="auto">${rich(p.pojem)}</span>${p.navedek ? `<br><small class="muted">${esc(tt("u.navedek", { b: p.navedek }))}</small>` : ""}</li>`)
        .join("")}</ul></div>`;
    })
    .join("");
  const canFollow = r.dodatno && !wasFollow;
  const appeal = r.ugovori > 0 && r.pojmi.some((p) => p.stanje !== "povedal");
  const d = paint(
    `<p class="us-count">${esc(tt("u.vprasanje", { i: run.i + 1, n: run.qs.length }))} · <b>${esc(tt("u.tocke", { t: fmt(r.tocke), m: r.max }))}</b></p>
    ${groups}
    ${r.razlaga ? `<div class="us-expl" dir="auto">${rich(r.razlaga)}</div>` : ""}
    <details class="us-sample"><summary>${esc(tt("u.vzorec"))}</summary><div dir="auto">${rich(r.vzorec)}</div></details>
    ${canFollow ? `<div class="us-follow"><h4>${esc(tt("u.dodatno"))}</h4><p dir="auto">${esc(r.dodatno)}</p></div>` : ""}
    <div class="us-appeal" hidden><label class="us-field"><span>${esc(tt("u.razlogPh"))}</span><input name="razlog" maxlength="500"></label><button type="button" class="secondary" data-us="appealSend">${esc(tt("u.poslji"))}</button></div>
    <div class="us-actions">
      ${appeal ? `<button type="button" class="ghost" data-us="appeal">${icon("flag")} ${esc(tt("u.neStrinjam"))}</button>` : ""}
      ${canFollow ? `<button type="button" class="primary" data-us="follow">${esc(tt("u.dodatno"))}</button><button type="button" class="secondary" data-us="next">${esc(tt("u.naprej"))}</button>` : `<button type="button" class="primary" data-us="next">${esc(run.i + 1 < run.qs.length ? tt("u.naprej") : tt("u.konec"))}</button>`}
    </div>`,
    { focus: ".us-count" },
  );
  d.querySelector('[data-us="next"]').addEventListener("click", () => {
    run.i++;
    question();
  });
  d.querySelector('[data-us="follow"]')?.addEventListener("click", () => {
    run.follow = r.dodatno;
    question(r.dodatno);
  });
  const ap = d.querySelector(".us-appeal");
  d.querySelector('[data-us="appeal"]')?.addEventListener("click", (e) => {
    ap.hidden = false;
    e.currentTarget.hidden = true;
    ap.querySelector("input").focus();
  });
  d.querySelector('[data-us="appealSend"]')?.addEventListener("click", async () => {
    live(tt("u.misli"));
    try {
      const u = await ctx.api(`/api/students/${ctx.student.id}/ustno/${run.id}/ugovor`, { method: "POST", body: { i: run.i, razlog: ap.querySelector("input").value } });
      const next = { ...r, ...u };
      run.res[run.i] = next;
      feedback(q, next, wasFollow);
      live(tt("u.ponovniPregled"));
    } catch (e) {
      live(e?.body?.code?.startsWith("u.") ? tt(e.body.code) : e?.message || tt("u.ocenaNapaka"));
    }
  });
}
const fmt = (x) => (Number.isInteger(x) ? String(x) : x.toLocaleString(locale(), { maximumFractionDigits: 1 }));

// --- samoocena (brez AI) ---
function selfQuestion(q, note = "") {
  const d = paint(
    `${note ? `<p class="us-err">${esc(note)}</p>` : ""}<p class="us-count">${esc(tt("u.vprasanje", { i: run.i + 1, n: run.qs.length }))}</p>
    <h3 class="us-q" tabindex="-1" dir="auto">${rich(q.besedilo)}</h3>
    <button type="button" class="ghost small" data-us="read">${icon("volume-2")} ${esc(tt("u.preberi"))}</button>
    <p class="muted small">${esc(tt("u.samoocenaOpis"))}</p>
    <div class="us-actions"><button type="button" class="primary" data-us="show">${esc(tt("u.pokaziVzorec"))}</button></div>
    <div class="us-sample-open" hidden><h4>${esc(tt("u.vzorec"))}</h4><div dir="auto">${rich(q.vzorec)}</div>
      <div class="us-actions" role="group"><button type="button" class="secondary" data-v="znam">${esc(tt("u.znam"))}</button><button type="button" class="secondary" data-v="delno">${esc(tt("u.delno"))}</button><button type="button" class="secondary" data-v="neznam">${esc(tt("u.neZnam"))}</button></div></div>`,
    { focus: ".us-q" },
  );
  const qEl = d.querySelector(".us-q");
  const say = () => speak(q.govor, () => qEl.isConnected && live(tt("u.niGlasu")));
  if (run.beri) say();
  d.querySelector('[data-us="read"]').addEventListener("click", say);
  d.querySelector('[data-us="show"]').addEventListener("click", (e) => {
    const box = d.querySelector(".us-sample-open");
    box.hidden = false;
    e.currentTarget.hidden = true;
    box.querySelector("button").focus();
  });
  d.querySelectorAll("[data-v]").forEach((b) =>
    b.addEventListener("click", () => {
      run.self[run.i] = b.dataset.v;
      run.i++;
      question();
    }),
  );
}

// --- konec ---
async function finish() {
  paint(`<p class="muted">${esc(tt("u.nalagam"))}</p>`);
  let r = null;
  if (!run.offline) {
    try {
      r = await ctx.api(`/api/students/${ctx.student.id}/ustno/${run.id}/konec`, { method: "POST", body: run.self.length ? { samoocena: run.self } : {} });
    } catch {}
  }
  if (!r) {
    // brez povezave: izid izračunamo tukaj (ocenjena vprašanja + samoocena)
    const good = run.qs.map((q, i) => (run.res[i] ? run.res[i].dobro : run.self[i] === "znam"));
    r = {
      dobro: good.filter(Boolean).length,
      n: run.qs.length,
      znas: run.qs.map((q, i) => ({ i, besedilo: q.besedilo })).filter((x) => good[x.i]),
      ponovi: run.qs.map((q, i) => ({ i, besedilo: q.besedilo, topicId: q.topicId })).filter((x) => !good[x.i]),
      lekcije: [],
    };
  }
  const list = (items) => `<ul>${items.map((x) => `<li dir="auto">${rich(x.besedilo)}</li>`).join("")}</ul>`;
  const d = paint(
    `<h3 class="us-result" tabindex="-1">${esc(tt("u.izid", { k: r.dobro, n: r.n }))}</h3>
    ${r.znas.length ? `<div class="us-grp us-ok"><h4>${icon("check")} ${esc(tt("u.znas"))}</h4>${list(r.znas)}</div>` : ""}
    ${r.ponovi.length ? `<div class="us-grp us-part"><h4>${icon("repeat")} ${esc(tt("u.ponovi"))}</h4>${list(r.ponovi)}</div>` : `<p>${esc(tt("u.vseDobro"))}</p>`}
    <div class="us-actions">
      ${(r.lekcije || []).map((l) => `<button type="button" class="secondary" data-lesson="${esc(l.id)}">${icon("book-open")} ${esc(tt("u.odpriLekcijo", { ime: l.name }))}</button>`).join("")}
      ${r.ponovi.length && !run.offline ? `<button type="button" class="primary" data-us="weak">${icon("repeat")} ${esc(tt("u.ponoviSibka"))}</button>` : ""}
      <button type="button" class="ghost" data-us="close">${esc(tt("u.zapri"))}</button>
    </div>`,
    { focus: ".us-result" },
  );
  d.querySelector('[data-us="close"]').addEventListener("click", () => d.close());
  d.querySelectorAll("[data-lesson]").forEach((b) =>
    b.addEventListener("click", () => {
      d.close();
      ctx.openLesson?.(b.dataset.lesson);
    }),
  );
  d.querySelector('[data-us="weak"]')?.addEventListener("click", () => start(run.src, run.v, run.samo && !run.res.length, { id: run.id, i: r.ponovi.map((x) => x.i), naslov: run.naslov }));
}

// --- varnostni odgovor (public/nujno.js) v oknu spraševanja ---
function showNujno(n, meja = false) {
  if (!n?.vrsta || !dlg) return;
  const st = stevilke(ctx.student?.settings, drzavaNaprave());
  const tr = ([k, p]) => tGlobal(k, Object.fromEntries(Object.entries(izoliraj(p)).map(([a, v]) => [a, Array.isArray(v) ? tGlobal(v[0], v[1]) : v ?? ""])));
  const [head, ...rest] = vrstice(n.vrsta, st, { izsiljevanje: !!n.izs });
  const calls = klici(n.vrsta, st).filter(Boolean);
  dlg.querySelector(".us-nujno")?.remove();
  const el = document.createElement("section");
  el.className = `msg nujno-card nujno-${n.vrsta} us-nujno`;
  el.setAttribute("role", "alert");
  el.setAttribute("aria-labelledby", "us-nujno-h");
  el.innerHTML =
    `<button type="button" class="nujno-zapri" aria-label="${esc(tGlobal("nujno.zapri"))}">${icon("x")}</button>` +
    `<h3 id="us-nujno-h">${esc(tr(head))}</h3>` +
    rest.map((v) => `<p>${esc(tr(v))}</p>`).join("") +
    `<div class="nujno-klici">${calls.map((c) => `<a class="nujno-klic" href="${telHref(c)}">${icon("phone")} ${esc(tGlobal("nujno.klic", izoliraj({ n: c })))}</a>`).join("")}</div>` +
    `<p class="nujno-opomba">${esc(tGlobal(opomba(st, meja)))}</p>`;
  el.querySelector(".nujno-zapri").addEventListener("click", () => el.remove());
  const box = dlg.querySelector(".us-box");
  box.insertBefore(el, box.querySelector(".us-body"));
  // Okno ostane tudi na naslednjem zaslonu spraševanja.
  const keep = new MutationObserver(() => {
    if (!el.isConnected && dlg.open && !el.dataset.closed) dlg.querySelector(".us-box")?.insertBefore(el, dlg.querySelector(".us-body"));
  });
  el.querySelector(".nujno-zapri").addEventListener("click", () => {
    el.dataset.closed = "1";
    keep.disconnect();
  });
  keep.observe(dlg, { childList: true });
}
