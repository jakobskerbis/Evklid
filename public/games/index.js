// Razdelek IGRE: mreža pisanih ploščic (kot na portalih z igrami), filtri po področjih in vrstah,
// igra se odpre v istem pogledu. Igra = vrsta igre (engines.js) × matematični pojem (topics.js).
import { t } from "../i18n.js";
import { icon } from "../icons.js";
import { CONCEPTS, AREAS, SUBJECTS, conceptName, areaName, setNumberStyle, makeQuestion, shuffle } from "./topics.js";
import { gameLock as ruleLock, clearedPace, lessonsOf, PACE, CLEAR_CORRECT, CHECK_TASKS, CHECK_PASS, LOCKS_ON } from "./unlock.js";
// Zapora iger je izklopljena (LOCKS_ON v unlock.js): vse igre so odprte.
const gameLock = (...a) => (LOCKS_ON ? ruleLock(...a) : null);
// Označena pot (j 18:04: »samo označene poti, preko katerih lažje pridejo do razumevanja«): igra je
// na poti, ko učenec snov že zna (pravila iz unlock.js), je snov iz njegovega ali prejšnjega razreda
// oziroma obvladana na učni poti, in je naslednja po hitrosti: najprej mirna, nato srednja, nato hitra.
function onPath(e, c) {
  if (ruleLock(e.id, c, LS) || data.games[gameId(e, c)]?.cleared) return false;
  if (PACE[e.id] !== clearedPace(c.id, LS) + 1) return false;
  return c.year >= Math.min(data.year, 13) - 1 || lessonsOf(c.id).some((x) => LS.known.has(x));
}
import { ENGINES, fits } from "./engines.js";
import { runGame } from "./core.js";
import { GENRES, childhoodEngines, matchTitle, cleanTitles, MAX_TITLES } from "./childhood.js";
import { WISHES } from "./wishes.js";
import { ITEMS, SLOTS, DEFAULT_AVATAR, MULTI_MAX, avatarSvg, itemName, itemOf, itemRarity, isMulti, isNew, isNewDate, isWorn, worn, wear, takeOff, slotFull } from "../avatar.js";
import { seasonOf } from "../zbirke.js";
import { unlockedText } from "../zbirke-view.js";
import { pageSlice, pageNums } from "./pages.js";
import { STAGES, stageOf, startTierFor } from "./stage.js";
import { dailyCard, openDaily, pickLevel, saveLevel } from "./daily-view.js";
import { suggestedLevel } from "./daily.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const FILTER_KEY = "evklid.gamesFilter";

// Velik znak na ploščici.
const GLYPH = {
  add: "+", sub: "−", mul: "×", div: "÷", rem: "r", order: "( )", round: "≈", place: "10²",
  neg_add: "−3", neg_mul: "−·−", abs: "|x|", prime: "7", gcd: "D", lcm: "v", divrule: "⋮", factor: "2·3",
  frac_simplify: "⁴⁄₈", frac_add: "½", frac_mul: "⅔", frac_mixed: "1½", frac_compare: "¾", dec_add: "0,5", dec_mul: "0,1", frac_dec: "¼", pct_of: "%", pct_change: "+%", pct_find: "?%", ratio: "2:3", prop: "∝",
  square: "x²", cube: "x³", sqrt: "√", pow_rules: "aⁿ", neg_exp: "x⁻¹", sci: "10ⁿ", roots_rules: "2√3",
  like_terms: "3x", expand: "a(b)", binom: "(a+b)²", factor_alg: "( )( )", evaluate: "x=2", rational: "⁄x",
  lin1: "x=", lin2: "ax+b", lin_frac: "x⁄3", ineq: "<", system: "{ }", quad: "x²=", discr: "D", vieta: "x₁x₂", abs_eq: "|x|=", exp_eq: "2ˣ", log_eq: "log",
  fval: "f(x)", slope: "k", intercept: "f(0)", line_eq: "y=kx", quad_vertex: "∪", quad_zero: "x₁,₂", compose: "f∘g", inverse: "f⁻¹", log_val: "log", log_rules: "ln", domain: "D𝑓",
  angles_tri: "△", angles_lines: "∠", polygon_angle: "⬠", perimeter: "o", area: "▭", circle: "○", pyth: "c²", volume: "⬛", surface: "S", similar: "∼", coord_dist: "d", midpoint: "M", units: "cm",
  trig_right: "sin", trig_values: "cos", radians: "π", trig_unit: "◷", trig_eq: "sin x=", trig_id: "sin²",
  seq_next: "1,2,3", arith: "aₙ", geom: "qⁿ", series: "Σ", geom_inf: "∞",
  mean: "x̄", median: "Me", mode: "Mo", prob_basic: "🎲", prob_two: "🎲🎲", factorial: "n!", combin: "C", expected: "E",
  limit_poly: "lim", limit_00: "0⁄0", limit_inf: "→∞", limit_special: "e", der_power: "xⁿ′", der_poly: "f′", der_elem: "sin′", der_chain: "f(g)′", der_prod: "(uv)′", der_value: "f′(a)", extrema: "max", int_indef: "∫", int_def: "∫ₐᵇ", int_area: "∫▭",
  vec_add: "→+", vec_len: "|v|", dot: "a·b", cross: "a×b", det2: "det", mat_mul: "[ ]", cx_add: "a+bi", cx_mul: "i·i", cx_abs: "|z|", cx_pow: "iⁿ",
  // drugi predmeti
  f_prefix: "k·M", f_units: "[m]", f_conv: "km/h", f_speed: "v", f_accel: "a", f_fall: "g", f_uam: "v(t)", f_circ: "ω",
  f_weight: "Fg", f_density: "ρ", f_pressure: "p", f_fluids: "Fvz", f_newton: "F=ma", f_friction: "Ftr", f_lever: "M",
  f_work: "A", f_energy: "Wk", f_power: "P", f_eff: "η", f_mom: "G", f_temp: "°C", f_heat: "Q", f_states: "❄", f_gas: "pV",
  f_ohm: "U=RI", f_resist: "Ω", f_epower: "kWh", f_charge: "e", f_circuit: "⊣⊢", f_magnet: "N S", f_induct: "~",
  f_wave: "λ", f_optics: "α", f_lens: "f", f_halflife: "t½", f_atom: "⚛",
  k_sym: "Fe", k_atom: "p⁺n", k_shell: "e⁻", k_conf: "1s²", k_pse: "PSE", k_ion: "Na⁺", k_poly: "SO₄", k_formula: "H₂O", k_name: "NaCl", k_kisl: "H⁺",
  k_molar: "M", k_mol: "n", k_avog: "Nₐ", k_vm: "Vm", k_w: "w", k_conc: "c", k_stoich: "2:1", k_bal: "⇌", k_rtype: "A+B", k_rate: "v", k_ox: "+II", k_redox: "e⁻→",
  k_acid: "HCl", k_neut: "pH7", k_ph: "pH", k_hom: "CₙH", k_iupac: "C₂H₆", k_fg: "–OH", k_orgrx: "C=C", k_bond: "A–B", k_matter: "⚗",
  b_org: "🔬", b_cell: "◉", b_micro: "∷", b_div: "2n", b_chrom: "46", b_punnett: "Aa", b_blood: "AB0", b_gen: "♂♀", b_pair: "A–T", b_mrna: "AUG", b_codon: "UUU",
  b_organ: "♥", b_sys: "⚕", b_circ: "O₂", b_digest: "🍎", b_hormone: "⚡", b_photo: "☀", b_resp: "ATP", b_chain: "→", b_energy: "10%", b_eco: "🌲",
  b_class: "🐟", b_plant: "❀", b_evo: "🦕", b_immu: "🛡",
  n_units: "cm", n_measure: "📏", n_cell: "◉", n_states: "💧", n_mix: "⚗", n_props: "▣", n_change: "🔥", n_ph: "pH", n_plant: "🌱", n_animals: "🐾", n_body: "🦴", n_chain: "🐛→", n_energy: "☀", n_heat: "°C", n_weather: "☁", n_env: "♻",
  g_layers: "◎", g_plates: "⇄", g_quake: "M", g_mohs: "💎", g_minerals: "◆", g_rocks: "🪨", g_cycle: "↻", g_time: "Ma", g_halflife: "t½", g_strat: "≡", g_karst: "⌒", g_erosion: "≈", g_flow: "Q", g_water: "💧", g_atmos: "☁", g_ghg: "CO₂", g_energy: "⚡",
  r_bin2dec: "101", r_dec2bin: "→₂", r_hex: "0xF", r_units: "KiB", r_twos: "−1₂", r_ascii: "A65", r_gates: "&", r_bool: "¬∧", r_trace: ">_", r_seq: "[ ]", r_bigo: "O(n)", r_search: "⌕", r_ds: "⊏⊐", r_ports: ":80", r_osi: "OSI", r_ip: "IP", r_hw: "CPU",
  e_pct: "%", e_vat: "DDV", e_interest: "€%", e_profit: "€", e_breakeven: "✕", e_margin: "MC", e_elast: "Ed", e_shift: "S↑", e_equil: "S=D", e_market: "🏪", e_oppcost: "⚖", e_gdp: "BDP", e_unemp: "u", e_policy: "🏛", e_bank: "🏦", e_fx: "$€",
};

let ctx = null; // { api, getStudent, setStudent, toast, refreshXp, currentLang }
let data = { year: 8, games: {}, concepts: {}, known: [], passed: [] };
// Stanje za odklepanje (unlock.js), zgrajeno iz podatkov strežnika.
const lockState = () => ({ year: data.year, games: data.games, known: new Set(data.known || []), passed: new Set(data.passed || []) });
let LS = lockState();
let av = { coins: 0, owned: [], equipped: { ...DEFAULT_AVATAR }, perDay: 150 }; // kovanci in avatar
let filter = { subject: "MAT", area: "you", kind: "all", q: "" };
// Znak na ploščici za pojme drugih predmetov, če pojem nima svojega.
const SUBJ_GLYPH = { MAT: "∑", FIZ: "⚛", KEM: "⚗", BIO: "❀", NAR: "☼", GEO: "⛰", RAC: "01", EKO: "€" };
let game = null; // odprta igra
let trOpen = false;
let page = 0; // stran mreže iger (pages.js); ob vsaki spremembi izbire ali iskanja spet prva
let trends = null; // glasovi tedna (samo skrbnik ali računalnik s strežnikom, server/games.js)
let root = null;
let daily = null; // dnevna uganka: stanje stopenj in niz (server/daily-puzzle.js)
let dailyLevel = null; // izbrana stopnja na kartici (shranjena na napravi, sicer predlog po stopnji šolanja)

const kindName = (e) => t(`games.e.${e.id}`);
const gameId = (e, c) => `${e.id}:${c.id}`;
const tileColor = (c) => `hsl(${(CONCEPTS.indexOf(c) * 137.5) % 360} 78% 52%)`;
const areaColor = (id) => AREAS.find((a) => a[0] === id)?.[2] || "#2563eb";
// Pojem je »zate«, če je blizu tvojemu letu šolanja (malo za nazaj, eno leto naprej).
const forYou = (c) => (data.year >= 13 ? c.year >= 10 : c.year <= data.year + 1 && c.year >= data.year - 4);
// Stopnja učenca (stage.js): OŠ igrivo, SŠ in fakulteta resnejši videz in težji začetek.
const stage = () => stageOf(ctx?.getStudent()?.settings);
// V OŠ se vsaka igra začne lahko; težje gre šele, ko učencu gre (shranjena raven pojma).
const startTier = (c) => startTierFor(stage(), data.concepts[c.id]);
// Videz po stopnji velja za ves pogled iger (mreža, igra, kartice).
const applyStageLook = () => document.querySelector("#view-games")?.classList.toggle("gm-calm", STAGES[stage()].calm);

export function initGames(c) {
  ctx = c;
  try {
    Object.assign(filter, JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"), { q: "" });
    if (!SUBJECTS.includes(filter.subject)) filter.subject = "MAT";
  } catch {}
}
export const allGamesCount = () => ENGINES.reduce((n, e) => n + (e.fits ? CONCEPTS.filter((c) => e.fits(c)).length : CONCEPTS.length), 0);

export async function showGames() {
  root = document.querySelector("#games-content");
  if (!root || !ctx) return;
  setNumberStyle(ctx.currentLang());
  applyStageLook();
  if (game) return; // igra ostane odprta
  renderPortal();
  try {
    const s = ctx.getStudent();
    if (s) [data, av, trends, daily] =await Promise.all([ctx.api(`/api/students/${s.id}/games`), ctx.api(`/api/students/${s.id}/avatar`).catch(() => av), ctx.api("/api/games/trends").catch(() => null), ctx.api(`/api/students/${s.id}/daily`).catch(() => null)]);
    LS = lockState();
    if (!game) renderPortal();
  } catch {}
}

// Tipka nazaj: najprej zapre igro.
export function gamesBack() {
  if (!game) return false;
  closeGame();
  return true;
}

function saveFilter() {
  try {
    localStorage.setItem(FILTER_KEY, JSON.stringify({ subject: filter.subject, area: filter.area, kind: filter.kind }));
  } catch {}
}

function tile(e, c) {
  const st = data.games[gameId(e, c)];
  const locked = !!gameLock(e.id, c, LS);
  const path = !locked && onPath(e, c);
  return `<button type="button" class="gm-tile gm-k-${e.id}${locked ? " gm-locked" : ""}${path ? " gm-path" : ""}" data-game="${gameId(e, c)}" style="--a:${tileColor(c)};--b:${e.colors[0]}"${locked ? ` aria-label="${esc(`${t("games.locked")}: ${conceptName(c)}, ${kindName(e)}`)}"` : path ? ` aria-label="${esc(`${t("games.pathMark")}: ${conceptName(c)}, ${kindName(e)}`)}"` : ""}>
    ${isNewDate(e.added) ? `<span class="gm-new">${esc(t("games.new"))}</span>` : ""}<span class="gm-kind">${icon(e.icon)}</span>
    ${path ? `<span class="gm-pathmark" title="${esc(t("games.pathMark"))}">${icon("compass")}</span>` : ""}
    ${st?.best ? `<span class="gm-best">${icon("star")}${st.best}</span>` : ""}
    <span class="gm-glyph">${locked ? `<span class="gm-lock">${icon("lock")}</span>` : esc(GLYPH[c.id] || c.glyph || SUBJ_GLYPH[c.subject] || "∑")}</span>
    <span class="gm-name"><b>${esc(conceptName(c))}</b><small>${esc(kindName(e))}</small></span>
  </button>`;
}

// Igre iz otroštva (childhood.js): null = vprašalnik še ni bil izpolnjen, [] = preskočen.
const kidList = () => ctx.getStudent()?.settings?.game_childhood ?? null;

// Glasovi tedna za j-jev pregled (j 2026-10-30: »vsak teden seznam glasov, meni v pregled«).
const sorted = (o) => Object.entries(o || {}).sort((a, b) => b[1] - a[1]);
const wishName = (id) => t(`games.w.${id}`);
// Lastni naslov v pregledu: »fortnite (?)«, »minecraft → Gradnja mesta«.
const titleLabel = (x) => {
  const m = matchTitle(x);
  return m.genre ? `${x} → ${t(`games.g.${m.genre}`)}` : m.wish ? `${x} → ${wishName(m.wish)}` : `${x} (?)`;
};
function trendsText() {
  const tr = trends;
  const line = (list, name) => list.map(([id, n]) => `${name(id)} ${n}`).join(", ") || "—";
  return [
    `${t("games.trVotes", { week: tr.lastWeek })}: ${line(sorted(tr.wishes?.[tr.lastWeek]), wishName)}`,
    `${t("games.trNow")}: ${line(sorted(tr.wishes?.[tr.week]), wishName)}`,
    `${t("games.trRatings")}: ${line(Object.entries(tr.ratings || {}).map(([id, r]) => [id, `👍${r.up} 👎${r.down}`]), (id) => t(`games.e.${id}`))}`,
    `${t("games.trKid")}: ${line(sorted(tr.childhood), (id) => t(`games.g.${id}`))}`,
    // prosto besedilo otrok gre v kopijo (in v oblak) le, če ga je napisalo vsaj 2 učenca
    `${t("games.trTitles")}: ${line(sorted(tr.titles).filter(([, n]) => n >= 2), titleLabel)}`,
    // za izenačenje (docs/igre-tedensko.md: več glasov skupaj) in igranost
    `${t("games.trAll")}: ${line(sorted(tr.allWishes), wishName)}`,
    `${t("games.trPlays")}: ${line(sorted(tr.plays), (id) => t(`games.e.${id}`))}`,
  ].join("\n");
}
function trendsCard() {
  if (!trends) return "";
  const tr = trends;
  const rows = (list, name) => (list.length ? `<ol>${list.map(([id, n]) => `<li>${esc(name(id))} <b>${esc(n)}</b></li>`).join("")}</ol>` : `<p class="muted">${esc(t("games.trNone"))}</p>`);
  const body = !tr.enough
    ? `<p class="muted">${esc(t("games.trFew", { n: tr.students, min: tr.minStudents }))}</p>`
    : `<h3>${esc(t("games.trVotes", { week: tr.lastWeek }))}</h3>${rows(sorted(tr.wishes?.[tr.lastWeek]), wishName)}
      <h3>${esc(t("games.trNow"))}</h3>${rows(sorted(tr.wishes?.[tr.week]), wishName)}
      <h3>${esc(t("games.trRatings"))}</h3>${rows(Object.entries(tr.ratings || {}).map(([id, r]) => [id, `👍 ${r.up} · 👎 ${r.down}`]), (id) => t(`games.e.${id}`))}
      <h3>${esc(t("games.trKid"))}</h3>${rows(sorted(tr.childhood), (id) => t(`games.g.${id}`))}
      <h3>${esc(t("games.trTitles"))}</h3>${rows(sorted(tr.titles), titleLabel)}
      <h3>${esc(t("games.trAll"))}</h3>${rows(sorted(tr.allWishes), wishName)}
      <h3>${esc(t("games.trPlays"))}</h3>${rows(sorted(tr.plays), (id) => t(`games.e.${id}`))}
      <button type="button" class="secondary" data-act="trcopy">${icon("clipboard-check")}${esc(t("games.trCopy"))}</button>`;
  return `<details class="card gm-trends"${trOpen ? " open" : ""}><summary>📋 ${esc(t("games.trTitle"))}</summary><p class="muted small">${esc(t("games.trOnly"))}</p>${body}</details>`;
}

// Številke strani: 1 … 4 5 [6] 7 8 … 275, puščici za prejšnjo in naslednjo.
function pager(pages) {
  if (pages < 2) return "";
  // na ozkem zaslonu le en sosed na vsako stran, da gumbi ostanejo v eni vrstici
  const nums = pageNums(page, pages, matchMedia("(max-width: 420px)").matches ? 1 : 2);
  const btn = (n) => `<button type="button" data-page="${n}"${n === page ? ` class="active" aria-current="page"` : ""} aria-label="${esc(t("games.page", { n: n + 1 }))}">${n + 1}</button>`;
  const parts = nums.map((n, i) => (i && n - nums[i - 1] > 1 ? `<span class="gm-gap" aria-hidden="true">…</span>` : "") + btn(n));
  return `<nav class="gm-pager" aria-label="${esc(t("games.pages"))}">
    <button type="button" data-page="${page - 1}"${page ? "" : " disabled"} aria-label="${esc(t("games.prevPage"))}">${icon("arrow-left")}</button>
    ${parts.join("")}
    <button type="button" data-page="${page + 1}"${page < pages - 1 ? "" : " disabled"} aria-label="${esc(t("games.nextPage"))}">${icon("arrow-right")}</button>
  </nav>`;
}

function renderPortal() {
  const q = filter.q.trim().toLowerCase();
  const kid = kidList();
  const kidEngines = childhoodEngines(kid);
  if (filter.kind === "kid" && !kidEngines.length) filter.kind = "all";
  const kinds = ENGINES.filter((e) => filter.kind === "all" || e.id === filter.kind || (filter.kind === "kid" && kidEngines.includes(e.id)));
  const match = (c, e) => !q || `${conceptName(c)} ${areaName(c.area)} ${kindName(e)}`.toLowerCase().includes(q);
  // Iskanje gre čez vse predmete, sicer le izbrani predmet.
  // »Zate« brez iger za ta predmet (npr. fakultetni predmet v OŠ) → vsa področja predmeta.
  const anyForYou = CONCEPTS.some((c) => c.subject === filter.subject && forYou(c));
  const area = filter.area === "you" && !anyForYou ? "all" : filter.area;
  const pick = (c) => (q || c.subject === filter.subject) && (area === "you" ? forYou(c) : area === "all" || c.area === area);
  let total = 0;
  let paths = 0;
  // Najprej le seznam iger (brez HTML), nato HTML samo za igre na trenutni strani.
  const groups = AREAS.filter((a) => q || a[3] === filter.subject).map(([id]) => {
    // Sosednji ploščici se razlikujeta po snovi in po vrsti igre (pisana mreža).
    const cs = CONCEPTS.filter((c) => c.area === id && pick(c));
    const path = [];
    const open = [];
    const shut = [];
    // Vsak pojem začne pri drugi vrsti, razmaknjeno čez ves seznam vrst: že prvi krogi pokažejo vse vrste
    // (prej so vrste s konca ENGINES, npr. novejše igre, pri področju z malo pojmi prišle šele na konec).
    // (korak tuj dolžini seznama, da imata dva pojma vedno različen začetek)
    const K = kinds.length, gcd = (a, b) => (b ? gcd(b, a % b) : a);
    let step = Math.ceil(K / Math.max(1, cs.length));
    while (step > 1 && step < K && gcd(step, K) !== 1) step++;
    if (step >= K) step = 1;
    for (let r = 0; r < kinds.length; r++) cs.forEach((c, i) => {
      const e = kinds[(i * step + r) % kinds.length];
      if (fits(e, c) && match(c, e)) (gameLock(e.id, c, LS) ? shut : onPath(e, c) ? path : open).push([e, c]);
    });
    paths += path.length;
    const games = [...path, ...open, ...shut]; // igre na poti najprej
    total += games.length;
    return { id, games };
  }).filter((x) => x.games.length);
  const sl = pageSlice(groups, page);
  page = sl.page;
  const pages = sl.pages;
  const sections = sl.parts.map(({ id, games, all }) => `<section class="gm-sec"><h2><span class="gm-dot" style="background:${areaColor(id)}"></span>${esc(areaName(id))}<span class="gm-count">${all}</span></h2><div class="gm-grid">${games.map(([e, c]) => tile(e, c)).join("")}</div></section>`).join("");
  // Tvoje igre iz otroštva: vsaka izbrana vrsta igre z dvema snovma, ki ju zdaj izbereš (predmet, področje).
  let kidSec = "";
  if (kidEngines.length && filter.kind === "all" && !q && !page) {
    const pool = CONCEPTS.filter((c) => pick(c));
    const tiles = pool.length ? kidEngines.flatMap((id, i) => [0, 1].map((j) => [ENGINES.find((e) => e.id === id), pool[(i * 7 + j * 3) % pool.length]])).filter(([e, c], k, all) => e && fits(e, c) && all.findIndex(([e2, c2]) => e2 === e && c2 === c) === k).slice(0, 12) : [];
    if (tiles.length) kidSec = `<section class="gm-sec gm-kidsec"><h2><span class="gm-kid-ic" aria-hidden="true">🕹️</span>${esc(t("games.kidTitle"))}<span class="gm-count">${tiles.length}</span><button type="button" class="ghost gm-kidedit" data-act="kid">${icon("pencil")}${esc(t("games.kidEdit"))}</button></h2><div class="gm-grid">${tiles.map(([e, c]) => tile(e, c)).join("")}</div></section>`;
  }
  const kidAsk = kid === null && ctx.getStudent() && !q
    ? `<div class="gm-kidask"><span class="gm-kid-ic" aria-hidden="true">🕹️</span><span class="gm-kidask-t"><b>${esc(t("games.kidAsk"))}</b><small>${esc(t("games.kidAskSub"))}</small></span><span class="gm-kidask-b"><button type="button" class="primary" data-act="kid">${esc(t("games.kidPick"))}</button><button type="button" class="ghost" data-act="kidskip">${esc(t("games.kidLater"))}</button></span></div>`
    : "";
  const chip = (val, label, on, fresh = false) => `<button type="button" class="${on ? "active" : ""}" data-val="${val}">${fresh ? `<span class="gm-new-dot" aria-hidden="true"></span>` : ""}${esc(label)}</button>`;
  root.innerHTML = `
    <div class="gm-portal">
      <div class="gm-top">
        <div><h1>${icon("gamepad-2")} ${esc(t("nav.games"))}</h1><p class="muted">${esc(t("games.intro", { n: allGamesCount() }))}</p></div>
        <span class="gm-me-row"><button type="button" class="gm-me" data-act="shop" title="${esc(t("games.shop"))}">${avatarSvg(av.equipped, { size: 46 })}<span><b>${esc(t("games.avatar"))}</b><small>${icon("coins")} ${av.coins}</small></span></button>
        <button type="button" class="gm-me gm-zb" data-act="zbirke" title="${esc(t("zb.title"))}"><span class="gm-zb-ic">${icon("award")}</span><span><b>${esc(t("games.zbirke"))}</b><small>${esc(t("zb.pass"))}</small></span></button></span>
        <label class="gm-search">${icon("search")}<input type="search" value="${esc(filter.q)}" placeholder="${esc(t("games.search"))}" aria-label="${esc(t("games.search"))}"></label>
      </div>
      ${ctx.getStudent() && !q ? dailyCard(daily, { t, lang: ctx.currentLang(), level: curDailyLevel(), suggested: suggestedDaily() }) : ""}
      ${SUBJECTS.length > 1 ? `<div class="chip-row gm-subjects" role="group" aria-label="${esc(t("games.subjects"))}">${SUBJECTS.map((x) => chip(x, t(`subj.${x}`), filter.subject === x)).join("")}</div>` : ""}
      <div class="chip-row gm-areas" role="group" aria-label="${esc(t("games.areas"))}">
        ${chip("you", t("games.forYou"), filter.area === "you")}${chip("all", t("games.all"), filter.area === "all")}
        ${AREAS.filter((a) => a[3] === filter.subject).map(([id]) => chip(id, areaName(id), filter.area === id)).join("")}
      </div>
      <div class="chip-row gm-kinds" role="group" aria-label="${esc(t("games.kinds"))}">
        ${chip("all", t("games.allKinds"), filter.kind === "all")}${kidEngines.length ? chip("kid", `🕹️ ${t("games.kidChip")}`, filter.kind === "kid") : ""}${ENGINES.map((e) => chip(e.id, kindName(e), filter.kind === e.id, isNewDate(e.added))).join("")}
      </div>
      ${q ? "" : trendsCard()}${kidAsk}${ctx.getStudent() && !q ? `<button type="button" class="ghost gm-kidlink gm-wishlink" data-act="wish">🗳️ ${esc(data.wish ? t("games.wishMine", { g: t(`games.w.${data.wish}`) }) : t("games.wishAsk"))}</button>` : ""}${kid && !kidEngines.length ? `<button type="button" class="ghost gm-kidlink" data-act="kid">🕹️ ${esc(t("games.kidLink"))}</button>` : ""}
      ${paths ? `<p class="gm-pathhint">${icon("compass")} ${esc(t("games.pathHint"))}</p>` : ""}
      ${kidSec}${total ? sections : `<p class="muted gm-none">${esc(t("games.none"))}</p>`}
      ${pager(pages)}
    </div>`;
  root.querySelector(".gm-subjects")?.addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-val]");
    if (!b) return;
    filter.subject = b.dataset.val;
    if (!["you", "all"].includes(filter.area)) filter.area = "you";
    page = 0;
    saveFilter();
    renderPortal();
  });
  root.querySelector(".gm-areas").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-val]");
    if (!b) return;
    filter.area = b.dataset.val;
    page = 0;
    saveFilter();
    renderPortal();
  });
  root.querySelector(".gm-kinds").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-val]");
    if (!b) return;
    filter.kind = b.dataset.val;
    page = 0;
    saveFilter();
    renderPortal();
  });
  const input = root.querySelector(".gm-search input");
  input.addEventListener("input", () => {
    filter.q = input.value;
    page = 0;
    const pos = input.selectionStart;
    renderPortal();
    const i2 = root.querySelector(".gm-search input");
    i2.focus();
    i2.setSelectionRange(pos, pos);
  });
  root.querySelectorAll(".gm-tile").forEach((b) => b.addEventListener("click", () => openGame(b.dataset.game)));
  root.querySelector(".gm-pager")?.addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-page]");
    if (!b || b.disabled) return;
    page = +b.dataset.page;
    renderPortal();
    // na vrh mreže (pod iskanjem in izbiro), fokus na prvo igro nove strani (tipkovnica, bralnik zaslona)
    const first = root.querySelector(".gm-kidsec, .gm-sec, .gm-none");
    first?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    root.querySelector(".gm-sec .gm-tile")?.focus({ preventScroll: true });
  });
  root.querySelector('[data-act="shop"]').addEventListener("click", () => renderShop("", true));
  root.querySelector(".gm-daily")?.addEventListener("click", (ev) => {
    const lv = ev.target.closest("button[data-lv]");
    if (lv) {
      dailyLevel = lv.dataset.lv;
      saveLevel(dailyLevel);
      return renderPortal();
    }
    if (ev.target.closest('[data-act="daily"]')) openDailyPuzzle();
  });
  root.querySelector('[data-act="wish"]')?.addEventListener("click", askWish);
  root.querySelector(".gm-trends")?.addEventListener("toggle", (e) => (trOpen = e.target.open));
  root.querySelector('[data-act="trcopy"]')?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(trendsText());
      ctx.toast?.(t("games.trCopied"));
    } catch {}
  });
  root.querySelectorAll('[data-act="kid"]').forEach((b) => b.addEventListener("click", askChildhood));
  root.querySelector('[data-act="kidskip"]')?.addEventListener("click", () => saveChildhood([]));
  root.querySelector('.gm-top [data-act="zbirke"]')?.addEventListener("click", () => window.evklid?.openZbirke(null, "games"));
}

// Shrani izbiro v profil (velja na vseh napravah; inštruktor jo lahko spremeni iz klepeta).
async function saveChildhood(list, titles) {
  const s = ctx.getStudent();
  if (!s) return false;
  try {
    const settings = titles ? { game_childhood: list, game_titles: titles } : { game_childhood: list };
    const updated = await ctx.api(`/api/students/${s.id}`, { method: "PUT", body: { settings } });
    ctx.setStudent?.(updated);
  } catch (err) {
    ctx.toast?.(err.message, null);
    return false;
  }
  page = 0; // razdelek »Igre iz tvojega otroštva« je na prvi strani
  if (!game) renderPortal();
  return true;
}

// Vprašalnik: zvrsti iger iz otroštva; pod vsako piše, v katero Evklidovo igro se spremeni.
function askChildhood() {
  if (!ctx.getStudent() || document.querySelector(".gm-kidq")) return;
  const pick = new Set(kidList() || []);
  let titles = cleanTitles(ctx.getStudent()?.settings?.game_titles);
  const back = document.activeElement;
  const genreName = (id) => t(`games.g.${id}`);
  // Lastni naslov: kam ga Evklid poveže (obstoječa vrsta igre, želja za novo igro ali v pregled j-ju).
  const titleNote = (title) => {
    const m = matchTitle(title);
    return m.genre ? `→ ${genreName(m.genre)}` : m.wish ? t("games.kidOwnWish", { g: t(`games.w.${m.wish}`) }) : t("games.kidOwnNew");
  };
  const ownList = () =>
    titles.map((x, i) => `<li><span><b>${esc(x)}</b><small>${esc(titleNote(x))}</small></span><button type="button" class="ghost" data-rm="${i}" aria-label="${esc(`${t("games.kidOwnRemove")}: ${x}`)}">${icon("x")}</button></li>`).join("");
  const dlg = document.createElement("div");
  dlg.className = "iq-wrap";
  dlg.innerHTML = `<div class="iq card gm-kidq" role="dialog" aria-modal="true" aria-labelledby="kid-title">
    <h2 id="kid-title">🕹️ ${esc(t("games.kidQ"))}</h2>
    <p class="muted">${esc(t("games.kidQSub"))}</p>
    <div class="iq-grid">${GENRES.map((g) => `<button type="button" class="iq-opt${pick.has(g.id) ? " on" : ""}" data-g="${g.id}" aria-pressed="${pick.has(g.id)}"><span class="iq-emoji" aria-hidden="true">${g.emoji}</span><span>${esc(t(`games.g.${g.id}`))}<small class="gm-kidto">${icon("arrow-right", "i-dir")}${esc(g.engines.map((id) => t(`games.e.${id}`)).join(", "))}</small></span></button>`).join("")}</div>
    <div class="gm-own"><label for="kid-own"><b>✍️ ${esc(t("games.kidOwn"))}</b></label>
      <div class="gm-own-row"><input id="kid-own" type="text" maxlength="40" autocomplete="off" placeholder="${esc(t("games.kidOwnPh"))}"><button type="button" class="secondary" data-k="add">${icon("plus")}${esc(t("games.kidOwnAdd"))}</button></div>
      <ul class="gm-own-list" aria-live="polite">${ownList()}</ul></div>
    <div class="iq-actions"><button type="button" class="ghost" data-k="close">${esc(t("games.kidLater"))}</button><button type="button" class="primary" data-k="save">${icon("check")}${esc(t("common.save"))}</button></div>
  </div>`;
  document.body.appendChild(dlg);
  // po shranjevanju je portal nov (stari gumb ni več v strani): fokus na gumb »Uredi« ali vabilo
  const close = () => {
    dlg.remove();
    (back?.isConnected ? back : root?.querySelector('[data-act="kid"]'))?.focus?.({ preventScroll: true });
  };
  const input = dlg.querySelector("#kid-own");
  const addBtn = dlg.querySelector('[data-k="add"]');
  const drawOwn = () => {
    dlg.querySelector(".gm-own-list").innerHTML = ownList();
    addBtn.disabled = input.disabled = titles.length >= MAX_TITLES;
  };
  const setPick = (id, on) => {
    on ? pick.add(id) : pick.delete(id);
    const b = dlg.querySelector(`[data-g="${id}"]`);
    b?.classList.toggle("on", on);
    b?.setAttribute("aria-pressed", String(on));
  };
  // Dodan naslov z znano zvrstjo takoj označi to zvrst (igra pride v zbirko); zvrst, ki jo je označil
  // samo naslov, se ob odstranitvi naslova spet odznači.
  const auto = new Set();
  const addTitle = () => {
    const next = cleanTitles([...titles, input.value]);
    if (next.length === titles.length) return void (input.value = ""); // že na seznamu
    titles = next;
    const m = matchTitle(titles.at(-1));
    if (m.genre && !pick.has(m.genre)) {
      setPick(m.genre, true);
      auto.add(m.genre);
    }
    input.value = "";
    drawOwn();
    // pri polnem seznamu je polje onemogočeno: fokus na zadnji gumb »Odstrani«, da ne uide iz okna
    (input.disabled ? dlg.querySelector(".gm-own-list li:last-child button") : input)?.focus();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      addTitle();
    }
  });
  drawOwn();
  dlg.addEventListener("click", async (ev) => {
    if (ev.target.closest('[data-k="add"]')) return addTitle();
    const rm = ev.target.closest("[data-rm]");
    if (rm) {
      const [gone] = titles.splice(Number(rm.dataset.rm), 1);
      const g = matchTitle(gone).genre;
      if (auto.has(g) && !titles.some((x) => matchTitle(x).genre === g)) {
        setPick(g, false);
        auto.delete(g);
      }
      drawOwn();
      return input.focus();
    }
    const opt = ev.target.closest("[data-g]");
    if (opt) {
      const id = opt.dataset.g;
      auto.delete(id); // ročna izbira velja
      pick.has(id) ? pick.delete(id) : pick.add(id);
      opt.classList.toggle("on", pick.has(id));
      opt.setAttribute("aria-pressed", String(pick.has(id)));
      return;
    }
    if (ev.target === dlg || ev.target.closest('[data-k="close"]')) return close();
    const save = ev.target.closest('[data-k="save"]');
    if (!save) return;
    save.disabled = true;
    if (input.value.trim()) addTitle(); // napisan, a ne dodan naslov ne izgine
    const list = GENRES.map((g) => g.id).filter((id) => pick.has(id));
    if (!(await saveChildhood(list, titles))) {
      save.disabled = false;
      return;
    }
    close();
    if (list.length) {
      ctx.toast?.(t("games.kidAdded", { n: childhoodEngines(list).length }));
      root?.querySelector(".gm-kidsec")?.classList.add("gm-kidnew");
      root?.querySelector(".gm-kidsec")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      // fokus ostane v oknu (aria-modal)
      const f = [...dlg.querySelectorAll("button:not(:disabled), input:not(:disabled)")];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey ? i <= 0 : i === f.length - 1) {
        e.preventDefault();
        f.at(e.shiftKey ? -1 : 0)?.focus();
      }
    }
  });
  dlg.querySelector(".iq-opt")?.focus({ preventScroll: true });
}

// Glasovanje za novo vrsto igre tega tedna (wishes.js); tedenski zagon naredi najbolj želeno.
function askWish() {
  const s = ctx.getStudent();
  if (!s || document.querySelector(".gm-wishq")) return;
  let pick = data.wish;
  const back = document.activeElement;
  const dlg = document.createElement("div");
  dlg.className = "iq-wrap";
  dlg.innerHTML = `<div class="iq card gm-wishq" role="dialog" aria-modal="true" aria-labelledby="wish-title">
    <h2 id="wish-title">🗳️ ${esc(t("games.wishQ"))}</h2>
    <p class="muted">${esc(t("games.wishSub"))}</p>
    <div class="iq-grid" role="radiogroup" aria-labelledby="wish-title">${WISHES.map((w) => `<button type="button" class="iq-opt${pick === w.id ? " on" : ""}" data-w="${w.id}" role="radio" aria-checked="${pick === w.id}"><span class="iq-emoji" aria-hidden="true">${w.emoji}</span><span>${esc(t(`games.w.${w.id}`))}</span></button>`).join("")}</div>
    <div class="iq-actions"><button type="button" class="ghost" data-k="close">${esc(t("games.kidLater"))}</button><button type="button" class="primary" data-k="save"${pick ? "" : " disabled"}>${icon("check")}${esc(t("games.wishVote"))}</button></div>
  </div>`;
  document.body.appendChild(dlg);
  const save = dlg.querySelector('[data-k="save"]');
  const close = () => {
    dlg.remove();
    (back?.isConnected ? back : root?.querySelector('[data-act="wish"]'))?.focus?.({ preventScroll: true });
  };
  dlg.addEventListener("click", async (ev) => {
    const opt = ev.target.closest("[data-w]");
    if (opt) {
      pick = opt.dataset.w;
      dlg.querySelectorAll("[data-w]").forEach((b) => {
        b.classList.toggle("on", b === opt);
        b.setAttribute("aria-checked", String(b === opt));
      });
      save.disabled = false;
      return;
    }
    if (ev.target === dlg || ev.target.closest('[data-k="close"]')) return close();
    if (!ev.target.closest('[data-k="save"]') || !pick) return;
    save.disabled = true;
    try {
      await ctx.api(`/api/students/${s.id}/games/wish`, { method: "POST", body: JSON.stringify({ genre: pick }) });
    } catch (err) {
      ctx.toast?.(err.message, null);
      save.disabled = false;
      return;
    }
    data.wish = pick;
    if (trends) trends = await ctx.api("/api/games/trends").catch(() => trends); // plošča za j-ja s svežim glasom
    if (!game) renderPortal();
    close();
    ctx.toast?.(t("games.wishThanks"));
  });
  dlg.addEventListener("keydown", (e) => {
    // skupina izbir (role=radiogroup): puščice premaknejo fokus in izbiro na sosednjo zvrst
    const opts = [...dlg.querySelectorAll("[data-w]")];
    const at = opts.indexOf(document.activeElement);
    const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
    const step = { ArrowRight: rtl, ArrowDown: 1, ArrowLeft: -rtl, ArrowUp: -1 }[e.key];
    if (step && at >= 0) {
      e.preventDefault();
      const next = opts[(at + step + opts.length) % opts.length];
      next.focus();
      next.click();
      return;
    }
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      const f = [...dlg.querySelectorAll("button:not(:disabled)")];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey ? i <= 0 : i === f.length - 1) {
        e.preventDefault();
        f.at(e.shiftKey ? -1 : 0)?.focus();
      }
    }
  });
  dlg.querySelector(".iq-opt")?.focus({ preventScroll: true });
}

function openGame(id) {
  const [eid, cid] = id.split(":");
  const engine = ENGINES.find((e) => e.id === eid);
  const concept = CONCEPTS.find((c) => c.id === cid);
  if (!engine || !concept || !fits(engine, concept)) return;
  const lock = gameLock(eid, concept, LS);
  if (lock) return showLock(engine, concept, lock);
  root.innerHTML = `<div class="gm-host"></div>`;
  document.body.classList.add("gm-on");
  const title = `${kindName(engine)}: ${conceptName(concept)}`;
  game = runGame(root.querySelector(".gm-host"), {
    engine,
    concept,
    tier: startTier(concept),
    tierUp: STAGES[stage()].tierUp,
    best: data.games[id]?.best || 0,
    title,
    t,
    onExit: closeGame,
    rating: data.rated?.[eid] ?? null,
    // brez profila ocene ni kam shraniti: tudi gumbov 👍/👎 ni
    onRate: ctx.getStudent() && ((up) => {
      const s = ctx.getStudent();
      if (!s) return;
      data.rated = { ...data.rated, [eid]: up };
      ctx.api(`/api/students/${s.id}/games/rate`, { method: "POST", body: JSON.stringify({ engine: eid, up }) }).catch(() => {});
    }),
    onEnd: async (r) => {
      const s = ctx.getStudent();
      if (!s) return null;
      const info = await ctx.api(`/api/students/${s.id}/games/result`, { method: "POST", body: JSON.stringify({ game: id, ...r }) });
      const before = clearedPace(cid, LS);
      data.games[id] = { best: info.best, plays: (data.games[id]?.plays || 0) + 1, tier: r.tier, cleared: !!(data.games[id]?.cleared || info.cleared) };
      data.concepts[cid] = r.tier;
      LS = lockState();
      // Opravljena igra odklene hitrejše igre te snovi.
      if (LOCKS_ON && clearedPace(cid, LS) > before && clearedPace(cid, LS) < 3) info.unlocked = t("games.unlockedFaster");
      if (info.coins) av.coins += info.coins;
      // Nov lik ali predmet iz iger (Zbirke); skupaj z morebitnim odklepom hitrejše igre.
      const got = unlockedText(info.zbirke);
      if (got) {
        info.unlocked = info.unlocked ? `${info.unlocked} ${got}` : got;
        av.owned = [...new Set([...av.owned, ...info.zbirke])];
      }
      if (info.xp) ctx.refreshXp?.();
      return info;
    },
  });
  window.scrollTo(0, 0);
}

// Zaklenjena igra: kaj manjka in pot do odklepa (snov na učni poti, preizkus ali najprej mirnejša igra).
function showLock(engine, c, lock) {
  const name = conceptName(c);
  const others = lock.need === "pace" ? ENGINES.filter((e) => PACE[e.id] === lock.pace && fits(e, c) && !gameLock(e.id, c, LS)).slice(0, 3) : [];
  const text = lock.need === "learn" ? t("games.lockLearn", { name }) : t("games.lockPace", { n: CLEAR_CORRECT });
  root.innerHTML = `<div class="gm-portal"><div class="card gm-lockcard">
    <h2>${icon("lock")} ${esc(`${kindName(engine)}: ${name}`)}</h2>
    <p>${esc(text)}</p>
    <div class="actions">
      ${lock.topic && window.evklid?.openTopic ? `<button type="button" class="primary" data-act="topic">${icon("book-open")}${esc(t("games.learnTopic"))}</button>` : ""}
      ${lock.need === "learn" ? `<button type="button" class="${lock.topic ? "secondary" : "primary"}" data-act="check">${icon("clipboard-check")}${esc(t("games.checkBtn", { n: CHECK_TASKS }))}</button>` : ""}
      ${others.map((e, i) => `<button type="button" class="${i ? "secondary" : "primary"}" data-play="${gameId(e, c)}">${icon(e.icon)}${esc(kindName(e))}</button>`).join("")}
      <button type="button" class="text-btn" data-act="back">${icon("arrow-left")}${esc(t("games.back"))}</button>
    </div></div></div>`;
  root.querySelector('[data-act="topic"]')?.addEventListener("click", () => window.evklid.openTopic(lock.topic));
  root.querySelector('[data-act="check"]')?.addEventListener("click", () => runCheck(engine, c));
  root.querySelector('[data-act="back"]').addEventListener("click", renderPortal);
  root.querySelectorAll("[data-play]").forEach((b) => b.addEventListener("click", () => openGame(b.dataset.play)));
  window.scrollTo(0, 0);
}

// Preizkus brez časa: 5 nalog (3 lažje, 2 malo težji), 4 pravilne odklenejo mirne igre te snovi.
function runCheck(engine, c) {
  const tiers = [1, 1, 1, 2, 2];
  const qs = tiers.slice(0, CHECK_TASKS).map((tier) => makeQuestion(c.id, tier));
  let i = 0;
  let ok = 0;
  const shell = (body) => {
    root.innerHTML = `<div class="gm-portal"><div class="card gm-lockcard gm-check"><h2>${icon("clipboard-check")} ${esc(conceptName(c))}</h2>${body}</div></div>`;
  };
  const ask = () => {
    const q = qs[i];
    const opts = shuffle([q.a, ...shuffle(q.w).slice(0, 3)]);
    shell(`<p class="muted">${esc(t("games.checkQ", { i: i + 1, n: qs.length }))}</p>
      <p class="gm-check-q">${esc(q.q)}</p>
      <div class="gm-check-opts">${opts.map((o) => `<button type="button" class="secondary" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <p class="gm-check-fb" aria-live="polite"></p>`);
    root.querySelectorAll("[data-o]").forEach((b) =>
      b.addEventListener("click", () => {
        const right = b.dataset.o === q.a;
        if (right) ok++;
        root.querySelectorAll("[data-o]").forEach((x) => {
          x.disabled = true;
          if (x.dataset.o === q.a) x.classList.add("gm-right");
        });
        if (!right) b.classList.add("gm-wrong");
        const fb = root.querySelector(".gm-check-fb");
        fb.innerHTML = `${esc(right ? t("games.checkRight") : t("games.correctWas", { a: q.a }))} <button type="button" class="primary" data-act="next">${esc(t("games.checkNext"))}</button>`;
        fb.querySelector("button").addEventListener("click", () => (++i < qs.length ? ask() : done()));
        fb.querySelector("button").focus();
      }),
    );
  };
  const done = async () => {
    const pass = ok >= CHECK_PASS;
    if (pass) {
      data.passed = [...new Set([...(data.passed || []), c.id])];
      LS = lockState();
      const s = ctx.getStudent();
      if (s) ctx.api(`/api/students/${s.id}/games/unlock`, { method: "POST", body: JSON.stringify({ concept: c.id, correct: ok }) }).catch(() => {});
    }
    const first = pass ? ENGINES.find((e) => fits(e, c) && !gameLock(e.id, c, LS)) : null;
    const topic = gameLock(engine.id, c, { ...LS, passed: new Set() })?.topic;
    shell(`<p class="gm-check-res">${esc(t(pass ? "games.checkPass" : "games.checkFail", { ok, n: qs.length, need: CHECK_PASS }))}</p>
      <div class="actions">
        ${first ? `<button type="button" class="primary" data-play="${gameId(first, c)}">${icon(first.icon)}${esc(kindName(first))}</button>` : ""}
        ${!pass && topic && window.evklid?.openTopic ? `<button type="button" class="primary" data-act="topic">${icon("book-open")}${esc(t("games.learnTopic"))}</button>` : ""}
        ${!pass ? `<button type="button" class="secondary" data-act="retry">${icon("rotate-ccw")}${esc(t("games.again"))}</button>` : ""}
        <button type="button" class="text-btn" data-act="back">${icon("arrow-left")}${esc(t("games.back"))}</button>
      </div>`);
    root.querySelector("[data-play]")?.addEventListener("click", (ev) => openGame(ev.currentTarget.dataset.play));
    root.querySelector('[data-act="topic"]')?.addEventListener("click", () => window.evklid.openTopic(topic));
    root.querySelector('[data-act="retry"]')?.addEventListener("click", () => runCheck(engine, c));
    root.querySelector('[data-act="back"]').addEventListener("click", renderPortal);
  };
  ask();
}

// Trgovina z deli avatarja: kovanci iz iger, brez pravega denarja. Avatar vidijo drugi v ligi.
// Predmeti za znanje (public/zbirke.js) so tukaj samo za oblačenje: ne kupijo se, pogoj je v Zbirkah.
let shop = { slot: "hat", pick: null };
// Predmeti predala; sezonski predmeti passa s svojo sezono (imaš jih) ali s trenutno (zaklenjeni).
function slotItems(slot, owned) {
  const out = [];
  for (const x of ITEMS.filter((i) => i.slot === slot)) {
    if (x.collection !== "pass") out.push(x);
    else {
      const mine = [...owned].filter((id) => id.startsWith(`${x.id}~`));
      for (const id of mine.length ? mine : [`${x.id}~${seasonOf().key}`]) out.push({ ...x, id });
    }
  }
  return out;
}
function renderShop(msg = "", top = false) {
  const y = window.scrollY; // ob ponovnem izrisu ostane na istem mestu, na vrh samo ob odprtju trgovine
  const lang = ctx.currentLang?.() || "sl";
  const owned = new Set(av.owned);
  const has = (x) => x.price === 0 || owned.has(x.id);
  const pick = shop.pick && itemOf(shop.pick) ? { ...itemOf(shop.pick), id: shop.pick } : null;
  const preview = pick ? wear(av.equipped, pick.id) : av.equipped;
  const isOn = (x) => (/_none$/.test(x.id) && isMulti(x.slot) ? !worn(av.equipped, x.slot).length : isWorn(av.equipped, x.id));
  const need = pick && !has(pick) && !pick.earn ? pick.price - av.coins : 0;
  const action = !pick || isOn(pick)
    ? ""
    : has(pick)
      ? slotFull(av.equipped, pick.id)
        ? `<p class="muted">${esc(t("games.slotFull", { n: MULTI_MAX }))}</p>`
        : `<button type="button" class="primary" data-act="wear">${esc(t("games.wear"))}</button>`
      : pick.earn
        ? `<button type="button" class="secondary" data-act="how">${esc(t("zb.how"))}</button>`
        : need > 0
          ? `<p class="muted">${esc(t("games.needMore", { n: need }))} ${icon("coins")}</p>`
          : `<button type="button" class="primary" data-act="buy">${icon("coins")}${esc(t("games.buy", { n: pick.price }))}</button>`;
  // Sličica pokaže samo ta predmet (na tvoji barvi), da se v polnem predalu predmeti ločijo med sabo.
  const thumbBase = { ...DEFAULT_AVATAR, body: av.equipped.body };
  const card = (x) => {
    const on = isOn(x);
    const state = on ? t("games.wearing") : has(x) ? (x.price ? t("games.owned") : x.earn ? t(`games.rarity.${x.rarity}`) : t("games.rarity.free")) : x.earn ? `${icon("lock")} ${esc(t(x.collection === "igre" ? "zb.byGames" : "zb.byKnowledge"))}` : `${icon("coins")} ${x.price}`;
    // Izbran tuj predmet: gumb za nakup kar na kartici (na telefonu je predogled zgoraj izven zaslona).
    return `<div class="gm-item gm-r-${itemRarity(x)}${on ? " on" : ""}${shop.pick === x.id ? " sel" : ""}${x.earn && !has(x) ? " gm-earn" : ""}">
      <button type="button" class="gm-item-btn" data-item="${x.id}" aria-pressed="${on}">${avatarSvg(wear(thumbBase, x.id), { size: 72 })}
      ${isNew(x.id) ? `<span class="gm-new">${esc(t("games.new"))}</span>` : ""}<b>${esc(itemName(x, lang))}</b><small>${state}</small></button>${shop.pick === x.id ? action : ""}</div>`;
  };
  // Novo ta teden (tedenske posodobitve): dotik odpre predal predmeta in ga pokaže na avatarju.
  const fresh = ITEMS.filter((x) => isNew(x.id) && x.collection !== "pass");
  const freshRow = fresh.length
    ? `<section class="gm-fresh card"><h2>${icon("sparkles")} ${esc(t("games.newWeek"))}</h2><div class="gm-fresh-row">${fresh
        .map((x) => `<button type="button" class="gm-fresh-item gm-r-${itemRarity(x)}" data-fresh="${x.id}" title="${esc(itemName(x, lang))}">${avatarSvg(wear(thumbBase, x.id), { size: 56 })}<span>${esc(itemName(x, lang))}</span></button>`)
        .join("")}</div></section>`
    : "";
  const wishBox = `<section class="gm-wish card"><h2>${icon("message-square-heart")} ${esc(t("games.wishTitle"))}</h2><p class="muted">${esc(t("games.wishHint"))}</p>
    <form class="gm-wish-form"><input type="text" maxlength="200" name="wish" required placeholder="${esc(t("games.wishPlaceholder"))}" aria-label="${esc(t("games.wishTitle"))}"><button type="submit" class="secondary">${icon("send")}${esc(t("games.wishSend"))}</button></form></section>`;
  root.innerHTML = `<div class="gm-portal gm-shop">
    <button type="button" class="text-btn" data-act="back">${icon("arrow-left")}${esc(t("games.back"))}</button>
    <div class="gm-shop-top card">
      <div class="gm-shop-me">${avatarSvg(preview, { size: 150, title: t("games.avatar") })}</div>
      <div>
        <h1>${esc(t("games.avatar"))}</h1>
        <p class="gm-coinbig">${icon("coins")} <b>${av.coins}</b> <span class="muted">${esc(t("games.coins"))}</span></p>
        <p class="muted">${esc(t("games.coinsHint", { n: av.perDay }))}</p>
        ${pick ? `<p class="gm-pick"><b>${esc(itemName(pick, lang))}</b> · <span class="gm-rtag gm-r-${itemRarity(pick)}">${esc(t(`games.rarity.${itemRarity(pick)}`))}</span></p>` : ""}
        ${msg ? `<p class="gm-shop-msg" role="status">${esc(msg)}</p>` : ""}
      </div>
    </div>
    ${freshRow}
    <div class="chip-row gm-slots" role="group">${SLOTS.map((x) => `<button type="button" class="${shop.slot === x ? "active" : ""}" data-slot="${x}">${fresh.some((i) => i.slot === x) ? `<span class="gm-new-dot" aria-hidden="true"></span>` : ""}${esc(t(`games.slot.${x}`))}${isMulti(x) && worn(av.equipped, x).length ? ` <small>${worn(av.equipped, x).length}/${MULTI_MAX}</small>` : ""}</button>`).join("")}</div>
    ${isMulti(shop.slot) ? `<p class="muted gm-earn-hint">${icon("layers")}<span>${esc(t("games.multiHint", { n: MULTI_MAX }))}</span></p>` : ""}
    ${slotItems(shop.slot, owned).some((x) => x.earn) ? `<p class="muted gm-earn-hint">${icon(shop.slot === "kind" ? "gamepad-2" : "award")}<span>${esc(t(shop.slot === "kind" ? "zb.shopHintKind" : "zb.shopHint"))}${shop.slot === "kind" ? ` ${esc(t("zb.shopHintKindXp"))}` : ""} <button type="button" class="text-btn" data-act="zbirke">${esc(t("zb.open"))}</button></span></p>` : ""}
    <div class="gm-items">${slotItems(shop.slot, owned).map(card).join("")}</div>
    ${wishBox}
  </div>`;
  const s = ctx.getStudent();
  const save = async (url, body, okMsg) => {
    if (!s) return;
    try {
      av = await ctx.api(`/api/students/${s.id}/${url}`, { method: "POST", body: JSON.stringify(body) });
      shop.pick = null;
      renderShop(okMsg);
    } catch (e) {
      renderShop(e.message);
    }
  };
  root.querySelector('[data-act="back"]').addEventListener("click", () => ((shop.pick = null), renderPortal()));
  const sel = root.querySelector(".gm-item.sel .primary, .gm-item.sel p");
  sel?.closest(".gm-item").scrollIntoView({ block: "nearest" });
  root.querySelectorAll("[data-slot]").forEach((b) => b.addEventListener("click", () => ((shop.slot = b.dataset.slot), (shop.pick = null), renderShop())));
  root.querySelectorAll("[data-fresh]").forEach((b) =>
    b.addEventListener("click", () => {
      const x = itemOf(b.dataset.fresh);
      shop.slot = x.slot;
      shop.pick = x.id;
      renderShop();
      root.querySelector(".gm-item.sel")?.scrollIntoView({ block: "center" });
    }),
  );
  root.querySelector(".gm-wish-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const wish = f.wish.value.trim();
    if (!wish || !s) return;
    f.querySelector("button").disabled = true;
    try {
      await ctx.api(`/api/students/${s.id}/feedback`, { method: "POST", body: JSON.stringify({ kind: "cosmetics", ideas: wish, lang }) });
      f.outerHTML = `<p class="gm-shop-msg gm-wish-done" role="status" tabindex="-1">${esc(t("games.wishThanks"))}</p>`;
      root.querySelector(".gm-wish-done")?.focus();
    } catch (err) {
      f.querySelector("button").disabled = false;
      ctx.toast?.(err.message);
    }
  });
  root.querySelectorAll("[data-item]").forEach((b) =>
    b.addEventListener("click", () => {
      const x = { ...itemOf(b.dataset.item), id: b.dataset.item };
      // Svoj predmet takoj obleče (v predalu z več predmeti ga ponoven dotik sname), tujega najprej pokaže na avatarju.
      if (has(x)) {
        if (isOn(x)) return isMulti(x.slot) && !/_none$/.test(x.id) ? save("avatar", { equipped: takeOff(av.equipped, x.id) }, "") : undefined;
        if (slotFull(av.equipped, x.id)) return ((shop.pick = null), renderShop(t("games.slotFull", { n: MULTI_MAX })));
        return save("avatar", { equipped: wear(av.equipped, x.id) }, "");
      }
      shop.pick = x.id;
      renderShop();
    }),
  );
  root.querySelector('[data-act="wear"]')?.addEventListener("click", () => save("avatar", { equipped: preview }, ""));
  root.querySelector('[data-act="how"]')?.addEventListener("click", () => window.evklid?.openZbirke(pick.id, "games"));
  root.querySelector('[data-act="zbirke"]')?.addEventListener("click", () => window.evklid?.openZbirke(null, "games"));
  root.querySelector('[data-act="buy"]')?.addEventListener("click", async () => {
    if (!s) return;
    try {
      const full = slotFull(av.equipped, pick.id);
      av = await ctx.api(`/api/students/${s.id}/avatar/buy`, { method: "POST", body: JSON.stringify({ item: pick.id }) });
      if (full) return ((shop.pick = null), renderShop(t("games.boughtFull", { n: MULTI_MAX })));
      await save("avatar", { equipped: preview }, t("games.bought"));
    } catch (e) {
      renderShop(e.message);
    }
  });
  if (top) window.scrollTo(0, 0);
  else window.scrollTo(0, y);
}

// Dnevna uganka: predlagana stopnja po stopnji šolanja, izbrana na napravi.
const suggestedDaily = () => suggestedLevel(stage(), data.year);
const curDailyLevel = () => dailyLevel || pickLevel(stage(), data.year);
// Odpre dnevno uganko (s kartice v Igrah ali z vrstice na Učni poti). Brez profila ni lestvice: nič.
export function openDailyPuzzle() {
  const s = ctx?.getStudent();
  root = document.querySelector("#games-content");
  if (!s || !root) return;
  game?.destroy();
  document.body.classList.remove("gm-on");
  applyStageLook();
  game = openDaily(root, {
    api: ctx.api,
    student: s,
    t,
    lang: ctx.currentLang(),
    level: curDailyLevel(),
    suggested: suggestedDaily(),
    toast: ctx.toast,
    onLevel: (lv) => (dailyLevel = lv),
    onChange: (info) => (daily = { ...info, board: null }),
    onClose: closeGame,
  });
  root.closest(".view")?.scrollTo?.(0, 0);
}

function closeGame() {
  game?.destroy();
  game = null;
  document.body.classList.remove("gm-on");
  renderPortal();
}

// Ob odhodu iz pogleda igro ustavimo.
export function leaveGames() {
  if (game) {
    game.destroy();
    game = null;
    document.body.classList.remove("gm-on");
  }
}
