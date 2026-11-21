// Učna pot že v prvem odgovoru strani (naloga hitrost, j 20. 11. 2026: »vsaj 30 %, 60 %, če gre, brez padca kakovosti«).
// Prijavljen učenec je ob prvem obisku na počasnem telefonu do Učne poti čakal ~5 s: na prenos in zagon app.js
// (~130 modulov) ter na izris. Zdaj strežnik iz začetnih podatkov (server/zacetni-podatki.js, isti odgovori kot API v tej
// seji) z istimi funkcijami kot app.js (public/zacetna.js) sestavi Učno pot in jo pošlje v <template id="evklid-pot">.
// public/zacetek.js jo pred prvim izrisom pokaže namesto okostja (kot posnetek zadnjega zaslona), če velja za to napravo
// (jezik, brez zgodovinskega sloga, brez nastavitev videza Učne poti na napravi …); dotike pred zagonom app.js shrani
// in jih app.js izvede, ko je pripravljen. app.js Učno pot izriše sam in jo zamenja kot posnetek (app.js finishStart).
// Kar ta modul ne zna izrisati enako (fakulteta, regijski sistemi, cilj, predlog prehoda …), dobi okostje kot prej.
// Stran je osebna (no-store, brez ETag, server/vstopna-stran.js); vse besedilo iz baze je ubežano (esc).
// Izklop: EVKLID_POT_STREZNIK=0.
import { isLanguage, langInfo } from "../public/i18n/languages.js";
import { translator, landingLanguage, translateStatic } from "./pristajalna-takoj.js";
import * as izris from "../public/zacetna.js";
import { stopnja, jeFaks } from "../public/stopnja.js";
import { gamesOn } from "../public/games/stage.js";
import { hasGoal } from "../public/goal-data.js";
import { levelProgress } from "../public/xp-levels.js";

// Ključi SI_EXAMS v public/exam-papers.js (zavihek »NPZ in matura«); test/pot-takoj.test.js preveri, da sta enaka.
export const SI_EXAM_TRACKS = ["OSNOVNA_SOLA", "SREDNJA_SOLA"];

const attr = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const parse = (txt) => {
  try {
    return txt == null ? null : JSON.parse(txt);
  } catch {
    return null;
  }
};

// Jezik vmesnika, ki ga bo imel app.js: jezik profila (selectStudent ga nastavi, sicer stran naloži znova), brez njega
// jezik brskalnika (kot pristajalna stran). zacetek.js stran pokaže le, ko je jezik naprave res ta (data-jezik).
export function jezikStrani(req, settings) {
  const zaznan = landingLanguage(req.headers["accept-language"]);
  const want = isLanguage(settings?.language) ? settings.language : null;
  const lang = want || zaznan?.lang;
  if (!lang || lang === "sr-Latn") return null; // srbska latinica: prečrkovanje v brskalniku (i18n-osnova.js)
  return { lang, rtl: !!langInfo(lang).rtl, tag: zaznan?.tag || "", zaznan: zaznan?.lang || "" };
}

// Vrstica namestitve na Učni poti (public/install.js canOffer): na telefonu, ko aplikacija ni nameščena in je učenec ni
// skril (preveri zacetek.js). Safari na Macu je lahko tudi iPad (o tem odloči šele navigator.maxTouchPoints): okostje.
const naprava = (ua) => ({
  mobile: /iPhone|iPad|iPod|Android/.test(ua),
  macSafari: !/iPhone|iPad|iPod/.test(ua) && /Macintosh/.test(ua) && /Version\/\d+.*Safari/.test(ua),
});

// Notranjost <main id="view-path"> iz vstopne strani (z ikonami); null, če je ni.
const MAIN = /<main id="view-path" class="view narrow">([\s\S]*?)\n  <\/main>/;
export function lupinaPoti(html) {
  const m = MAIN.exec(html);
  return m ? m[1] : null;
}

const zamenjaj = (h, a, b) => {
  if (!h.includes(a)) throw new Error(`pot-takoj: ni »${a.slice(0, 60)}«`);
  return h.replace(a, () => b);
};
// Element z id: nastavi vsebino (html), atribute class (cls) in hidden.
function element(h, id, { html, cls, hidden, attrs = "" }) {
  const re = new RegExp(`<(\\w+)((?: [\\w-]+(?:="[^"]*")?)*?) id="${id}"([^>]*)>([\\s\\S]*?)</\\1>`);
  const m = re.exec(h);
  if (!m) throw new Error(`pot-takoj: ni #${id}`);
  let a = `${m[2]} id="${id}"${m[3]}`;
  if (cls != null) a = / class="[^"]*"/.test(a) ? a.replace(/ class="[^"]*"/, ` class="${cls}"`) : `${a} class="${cls}"`;
  if (hidden != null) a = a.replace(/ hidden(?=[ >]|$)/, "") + (hidden ? " hidden" : "");
  return h.slice(0, m.index) + `<${m[1]}${a}${attrs}>${html ?? m[4]}</${m[1]}>` + h.slice(m.index + m[0].length);
}

// Učna pot za vstopno stran ali null (stran ima okostje kot prej).
// html: vstopna stran (server/vstopna-stran.js entryHtml), podatki: { s, d } iz zacetniPodatki, req: zahteva strani.
export function potStrani(html, podatki, req, { publicDir, nakljucno = Math.random } = {}) {
  const s = podatki?.s;
  const d = podatki?.d || {};
  if (!s || !Number.isInteger(s.id)) return null;
  const st = s.settings || {};
  const sys = st.school_system || "SI";
  // Fakulteta (izbira predmeta), regijski sistemi (opomba) in cilj (vrstica, opomnik ob 12.00 po uri naprave): okostje.
  if (jeFaks(st) || sys !== "SI" || hasGoal(st)) return null;
  const sid = s.id;
  const p = parse(d[`/api/students/${sid}/path`]);
  const paths = parse(d[`/api/paths?subject=${st.subject}&system=${encodeURIComponent(sys)}`]);
  const xp = parse(d[`/api/students/${sid}/xp`]);
  const modes = parse(d[`/api/students/${sid}/modes?path=${encodeURIComponent(p?.key || "")}`]) || parse(d[`/api/students/${sid}/modes`]);
  const sch = parse(d[`/api/students/${sid}/schedule`]);
  const lvl = parse(d[`/api/students/${sid}/level-up`]);
  const cfg = parse(d["/api/config"]) || {};
  if (!p?.key || !Array.isArray(p.units) || !p.xp || !Array.isArray(paths) || !xp || !modes || !sch?.schedule || !lvl || lvl.suggestion) return null;
  const jezik = jezikStrani(req, st);
  if (!jezik) return null;
  const lupina = lupinaPoti(html);
  if (!lupina) return null;
  const t = translator(jezik.lang, publicDir);
  const games = gamesOn(st);
  const level = stopnja(st);
  const siExams = SI_EXAM_TRACKS.includes(st.educational_track || "");
  const ua = String(req.headers["user-agent"] || "");
  const dev = naprava(ua);
  const own = paths.find((x) => x.key === p.key);

  let h = lupina;
  // Glava poti (app.js loadPath): šola ima stalno pot (izbira je skrita), napis razreda in povezavo na nižje razrede.
  h = zamenjaj(h, '<div class="path-head">', '<div class="path-head fixed">');
  h = element(h, "path-select", { html: own ? `<option value="${own.key}" selected>${izris.esc(own.label.replace(/ \((?:UL|UM|UP|UNG) [A-Z]+\)$/, ""))}</option>` : "" });
  h = element(h, "path-level", { html: izris.esc(izris.pathLevelText(t, own, p, jezik.rtl)) });
  h = element(h, "path-lower", { hidden: own ? paths.indexOf(own) < 1 : !paths.length });
  const early = level === "OS" && /^[1-5]\./.test(String(st.curriculum_level || "").trim());
  if (early) h = element(h, "path-note", { html: izris.esc(t("path.earlyNote", { grade: izris.levelLabel(t, st.curriculum_level) })), hidden: false });
  h = element(h, "lang-note", { hidden: jezik.lang === "sl" });
  // Kartica mnenja (public/feedback.js): od drugega dne profila; dan in skritje preveri zacetek.js (ura in shramba naprave).
  if (cfg.feedback?.prompt && s.created_at) h = element(h, "feedback-card", { cls: "card fb-card", html: izris.feedbackCardHtml(t), hidden: false, attrs: ` data-pogoj="fb" data-nastal="${attr(s.created_at)}"` });
  // Namestitev (public/install.js): na telefonu, ko aplikacija ni nameščena in vrstica ni skrita (zacetek.js).
  if (dev.macSafari) return null;
  if (dev.mobile) h = element(h, "install-card", { cls: "card list-card install-mini", html: izris.installMiniHtml(t, true), hidden: false, attrs: ' data-pogoj="inst"' });
  // Današnji trening (app.js loadPath) in dnevna uganka (stanje iz /daily).
  let xc = izris.xpCardHtml(t, { p, done: modes.daily?.done, scan: true, games });
  const dz = games ? parse(d[`/api/students/${sid}/daily`]) : null;
  if (dz?.streak?.today) xc = zamenjaj(xc, `<span class="next-name">${t("dz.statusNew")}</span>`, `<span class="next-name">${izris.esc(t("dz.streak", { n: dz.streak.days }))}</span>`);
  // Kartice pred načini učenja (#xp-card, #schedule-card, #stage-card) v vrstnem redu stopnje (public/zacetna.js
  // uvrstiKartice): iz lupine vzamemo prazna mesta, jih napolnimo in vstavimo pred #modebar.
  const mesto = (id) => {
    const m = new RegExp(`\\n *<div id="${id}"[^>]*></div>`).exec(h);
    if (!m) throw new Error(`pot-takoj: ni #${id}`);
    h = h.slice(0, m.index) + h.slice(m.index + m[0].length);
    return m[0].replace(/^\n */, "");
  };
  const kartica = { "xp-card": element(mesto("xp-card"), "xp-card", { html: xc }) };
  // Urnik (public/urnik-kartica.js) in kartica stopnje (public/zacetna.js).
  const k = izris.scheduleCardHtml(t, sch.schedule, { faks: false });
  kartica["schedule-card"] = element(mesto("schedule-card"), "schedule-card", { html: k.html, hidden: false, attrs: k.empty ? ' data-pogoj="sch"' : "" });
  const stage = izris.stageCardHtml(level, { games, exams: siExams, schedule: sch.schedule, t, esc: izris.esc });
  kartica["stage-card"] = element(mesto("stage-card"), "stage-card", { html: stage, hidden: !stage });
  h = zamenjaj(h, '<nav id="modebar"', `${izris.vrstniRed(level, sch.schedule).map((id) => kartica[id]).join("")}<nav id="modebar"`);
  // Načini učenja (app.js refreshModes, setCardsDue): značke.
  h = element(h, "modebar", { cls: "modes vr-row", attrs: ' data-sortable="modebar"' });
  const znacka = (mode, n, title) => {
    const at = h.indexOf(`data-mode="${mode}"`);
    const b = h.indexOf('<b class="badge" hidden></b>', at);
    if (at < 0 || b < 0) throw new Error(`pot-takoj: značka ${mode}`);
    h = h.slice(0, b) + `<b class="badge"${n ? "" : " hidden"} title="${attr(title)}">${attr(n ?? "")}</b>` + h.slice(b + '<b class="badge" hidden></b>'.length);
  };
  znacka("review", modes.reviewBacklog, t("mode.reviewBadge", { n: modes.reviewBacklog }));
  if (modes.cardsDue !== undefined) znacka("cards", modes.cardsDue, t("cards.dueN", { n: modes.cardsDue }));
  // Bližnjice po cilju (app.js renderGoalModes): brez cilja pod načini učenja.
  const gm = izris.goalModes(st, { level, games, siExams, regionalExams: false });
  if (gm.first) return null;
  h = element(h, "goal-modes", { html: izris.goalModesHtml(t, gm.list), hidden: !gm.list.length });
  // Sklopi in dejstvo na dnu (dejstvo: naključno iz privzetega nabora; app.js prvič pokaže istega).
  const dejstvo = Math.min(izris.GREEK[1] - 1, Math.floor(nakljucno() * izris.GREEK[1]));
  h = element(h, "path-content", { html: izris.pathUnitsHtml(t, p) + izris.factHtml(t, izris.GREEK, dejstvo, "gr-path") });
  if (jezik.lang !== "sl") h = translateStatic(h, t);
  // Zgornja vrstica (public/zacetek.js glava): XP, niz dni, ime in začetnica profila, vrstica ravni pod XP (app.js paintBadge).
  const lp = levelProgress(xp.total);
  const hd = {
    x: String(xp.total),
    k: String(xp.streak),
    n: String(s.name || ""),
    i: (String(s.name || "?").trim().charAt(0) || "?").toUpperCase(),
    l: lp.pct / 100,
    lt: `${t("xp.title")} · ${t("xp.level", { n: lp.level })} · ${t("xp.toNext", { xp: lp.to - xp.total, n: lp.level + 1 })}`,
    pt: `${s.name} · ${t("pm.menu")}`,
  };
  if (jezik.lang !== "sl") hd.np = napisiLupine(html, t);
  return { html: h, sid, jezik, dejstvo, hd };
}

// Napisi lupine (zgornja vrstica, pasici, spodnja vrstica) v jeziku strani: zacetek.js jih pred zagonom zapiše kot
// applyI18n (public/i18n-osnova.js), ki jih ob zagonu zapiše enako. Lupina v HTML je slovenska.
export function napisiLupine(html, t) {
  const kosi = [];
  const a = html.indexOf('<header class="topbar">');
  const b = html.indexOf("<main ", a);
  if (a >= 0 && b > a) kosi.push(html.slice(a, b));
  const c = html.indexOf('<nav id="tabbar"');
  const e = c < 0 ? -1 : html.indexOf("</nav>", c);
  if (e > c) kosi.push(html.slice(c, e));
  const out = {};
  for (const m of kosi.join("\n").matchAll(/\sdata-i18n(?:-title|-aria)?="([^"]+)"/g)) out[m[1]] = t(m[1]);
  return out;
}

// <meta name="evklid-pot"> v <head> (pred public/zacetek.js, ki se po njej odloči pred prvim izrisom) in
// <template id="evklid-pot"> pred prvim <main> strani: ko zacetek.js vidi prvi <main>, je predloga že razčlenjena,
// tudi če omrežje stran prekine vmes (pregled #903, sicer okostje namesto Učne poti).
export function withPot(html, pot) {
  if (!pot || !html.includes('<meta charset="utf-8">')) return html;
  const at = html.indexOf('<main id="view-path" class="view narrow">');
  const end = at < 0 ? -1 : html.indexOf("\n  </main>", at);
  if (end < 0) return html;
  const j = pot.jezik;
  const meta = `<meta name="evklid-pot" data-s="${pot.sid}" data-jezik="${attr(j.lang)}" data-smer="${j.rtl ? "rtl" : "ltr"}" data-oznaka="${attr(j.tag)}" data-zaznan="${attr(j.zaznan)}" data-dejstvo="${pot.dejstvo}" data-glava="${attr(JSON.stringify(pot.hd))}">`;
  // Pred prvim <main> v <body> (#view-auth je pred #view-path): zacetek.js vstavi pred prvi <main>, ki ga vidi.
  const body = html.indexOf("<body");
  const prvi = body < 0 ? -1 : html.indexOf("\n  <main ", body);
  const pred = prvi >= 0 && prvi < at ? prvi + 3 : at;
  const out = html.slice(0, pred) + `<template id="evklid-pot">${pot.html}</template>\n  ` + html.slice(pred);
  return out.replace('<meta charset="utf-8">', () => `<meta charset="utf-8">\n  ${meta}`);
}

// Za server/vstopna-stran.js: (html, podatki, req) → html z Učno potjo ali brez nje (napaka: brez, stran je kot prej).
let napakaZapisana = false;
export function potTakoj({ publicDir }) {
  return (html, podatki, req) => {
    try {
      return withPot(html, potStrani(html, podatki, req, { publicDir }));
    } catch (err) {
      if (!napakaZapisana) console.error("[pot-takoj] Učna pot s strežnika izklopljena za to stran:", err);
      napakaZapisana = true;
      return html;
    }
  };
}
