// Pogled »Zbirke in učni pass« (public/zbirke.js): vitrina, učni pass s 30 stopnjami, tri zbirke
// znanja z vnaprej vidnimi pogoji in pogled »preglej« (katera snov in kdaj je prinesla predmet).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { makeRowSortable } from "./vrstice.js";
import { avatarSvg, itemName, itemOf, DEFAULT_AVATAR, isNew, isWorn, wear, takeOff, slotFull, MULTI_MAX } from "./avatar.js";
import { COLLECTIONS, KNOWLEDGE, PASS_REWARDS, AWARD_MIN, baseId, variantOf, seasonLabel, elementTile } from "./zbirke.js";
import { shareCardModel, shareCardSvg, shareCardPng, shareCardFile, shareCardNative } from "./deli-kartico.js";
import { shareMode, shareResultKey } from "./deli-most.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const TAB_KEY = "evklid.zbirkeTab";

let ctx = null; // { api, getStudent, currentLang, showView }
let data = null; // odgovor /api/students/:id/zbirke
let root = null;
let tab = "pse";
let open = null; // id predmeta v pogledu »preglej«
let msg = "";
let from = null; // pogled, iz katerega je učenec prišel (gumb Nazaj na igre)

export function initZbirke(c) {
  ctx = c;
  try {
    tab = localStorage.getItem(TAB_KEY) || "pse";
  } catch {}
  document.querySelector("#view-zbirke .zb-back")?.addEventListener("click", () => ctx.showView(from || "me"));
  // Esc zapre pogled »preglej«, fokus se vrne na predmet, ki ga je odprl.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open && root && !root.closest(".view")?.hidden) closeInspect();
  });
}

export async function loadZbirke() {
  const s = ctx?.getStudent();
  if (!s) return null;
  data = await ctx.api(`/api/students/${s.id}/zbirke`);
  return data;
}

// Odpre pogled; item = predmet, ki ga takoj pokažemo v pogledu »preglej«.
export async function showZbirke(item = null, back = null) {
  root = document.querySelector("#zbirke-content");
  if (!root || !ctx) return;
  open = item;
  from = back;
  msg = "";
  dropShare(); // predogled kartice ne ostane od prejšnjega odprtja
  // Iz iger: namesto »← Jaz« gumb »← Nazaj na igre« (isto mesto, isti videz).
  const view = root.closest(".view");
  view?.classList.toggle("zb-from-games", from === "games");
  const zbBack = view?.querySelector(".zb-back");
  if (zbBack) zbBack.hidden = from !== "games";
  if (item) tab = collectionOf(item);
  if (data) render();
  try {
    await loadZbirke();
    render();
  } catch (e) {
    if (!data) root.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
  }
}

const lang = () => ctx?.currentLang?.() || "sl"; // unlockedText kličejo tudi igre
const collectionOf = (id) => itemOf(id)?.collection || "pse";
const ownedSet = () => new Set((data?.items || []).map((x) => x.id));
const equipped = () => data?.avatar?.equipped || { ...DEFAULT_AVATAR };
export const fmtDate = (sql) => {
  try {
    return new Date(String(sql).replace(" ", "T") + "Z").toLocaleDateString(lang());
  } catch {
    return String(sql).slice(0, 10);
  }
};

// Sličica predmeta: element kot ploščica, ostalo na avatarju.
export function itemThumb(id, size = 72, eq = DEFAULT_AVATAR) {
  const x = itemOf(id);
  if (!x) return "";
  if (x.sym) return `<svg class="zb-tile" viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true">${elementTile(x, { x0: 0, y0: 0, s: 20 })}</svg>`;
  return avatarSvg({ ...eq, [x.slot]: id }, { size });
}

// Pogoj za predmet, kot ga vidi učenec.
const num = (n) => Number(n || 0).toLocaleString(lang());
function condition(x, id) {
  if (x.collection === "pass") return t("zb.needPass", { tier: x.tier });
  if (x.need?.xp) return `${t("zb.needXp", { xp: num(x.need.xp) })} ${t("zb.potNow", { xp: num(data?.xp) })}.`;
  if (x.set) return t("zb.needSet", { count: x.need.own, name: itemName(COLLECTIONS.find((c) => c.id === x.collection), lang()) });
  if (x.need?.tek) return t("zb.needTek");
  if (x.need?.games) return t("zb.needGames", { n: num(x.need.games), now: num(data?.games?.correct || 0) });
  if (x.need?.cleared) return t("zb.needCleared", { n: x.need.cleared, now: data?.games?.cleared || 0 });
  if (x.need?.league) return `${t(`zb.need.${x.need.league}`)} ${t("zb.leagueMin", { n: AWARD_MIN })}`;
  const h = data?.hints?.[baseId(id)];
  return h ? t("zb.needTopic", { topic: h.name, path: h.path }) : "";
}

// Predmeti za zavihek: zbirka ali pass (sezonski predmeti trenutne sezone + prejšnje, ki jih imaš).
function tabItems() {
  if (tab !== "pass") return KNOWLEDGE.filter((x) => x.collection === tab).map((x) => x.id);
  return PASS_REWARDS.map((r) => `${r.id}~${data.pass.season}`);
}

function card(id) {
  const x = itemOf(id);
  const own = ownedSet().has(id);
  const on = isWorn(equipped(), id);
  const shown = data.showcase.includes(id);
  return `<button type="button" class="zb-card gm-r-${x.rarity}${own ? "" : " zb-locked"}${on ? " on" : ""}" data-zbopen="${esc(id)}">
    <span class="zb-thumb">${itemThumb(id, 72, DEFAULT_AVATAR)}${own ? "" : `<span class="zb-lock">${icon("lock")}</span>`}${shown ? `<span class="zb-star" title="${esc(t("zb.showcase"))}">${icon("star")}</span>` : ""}</span>
    ${isNew(id) ? `<span class="gm-new">${esc(t("games.new"))}</span>` : ""}<b>${esc(itemName(x, lang()))}</b>
    <small>${own ? esc(on ? t("games.wearing") : t(`games.rarity.${x.rarity}`)) : esc(x.collection === "pass" ? t("zb.needPassShort", { tier: x.tier }) : x.need?.xp ? `${num(x.need.xp)} XP` : x.need?.games ? `${num(Math.min(data?.games?.correct || 0, x.need.games))}/${num(x.need.games)}` : x.need?.cleared ? `${Math.min(data?.games?.cleared || 0, x.need.cleared)}/${x.need.cleared}` : t("zb.locked"))}</small>
  </button>`;
}

// Pot znanja in Smešni liki: koliko XP imaš in koliko manjka do naslednjega predmeta te zbirke.
function potLine(coll = "pot") {
  const next = KNOWLEDGE.filter((x) => x.collection === coll && x.need.xp > data.xp).sort((a, b) => a.need.xp - b.need.xp)[0];
  const pct = next ? Math.min(100, Math.round((data.xp / next.need.xp) * 100)) : 100;
  return `<div class="card zb-pot">
    <p><b>${esc(t("zb.potNow", { xp: num(data.xp) }))}</b>${next ? ` · ${esc(t("zb.potNext", { name: itemName(next, lang()), xp: num(next.need.xp - data.xp) }))}` : ""}</p>
    <div class="zb-bar"><span style="width:${pct}%"></span></div>
    <p class="muted small">${esc(t(coll === "smesni" ? "zb.smesniHint" : "zb.potHint"))}</p>
  </div>`;
}

function passCard() {
  const p = data.pass;
  const done = p.tier >= p.tiers;
  const inTier = p.xp - p.tier * p.perTier;
  const next = PASS_REWARDS.find((r) => r.tier > p.tier);
  const cells = Array.from({ length: p.tiers }, (_, i) => {
    const n = i + 1;
    const r = PASS_REWARDS.find((x) => x.tier === n);
    const cls = `zb-cell${n <= p.tier ? " got" : ""}${r ? " reward" : ""}${n === p.tier + 1 ? " now" : ""}`;
    if (!r) return `<li class="${cls}"><span>${n}</span></li>`;
    const id = `${r.id}~${p.season}`;
    const label = `${itemName(itemOf(id), lang())}, ${t("zb.needPassShort", { tier: n })}`;
    return `<li class="${cls}"><button type="button" class="zb-cell-btn" data-zbopen="${esc(id)}" aria-label="${esc(label)}">${itemThumb(id, 34)}</button></li>`;
  }).join("");
  return `<section class="card zb-pass">
    <div class="zb-pass-head">
      <div><h2>${icon("award")} ${esc(t("zb.pass"))}</h2><p class="muted">${esc(t(p.season.endsWith("-2") ? "zb.season2" : "zb.season1", { season: seasonLabel(p.season) }))}</p></div>
      <b class="zb-tier">${esc(t("zb.tier", { tier: p.tier, tiers: p.tiers }))}</b>
    </div>
    <div class="zb-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${p.tiers}" aria-valuenow="${p.tier}"><span style="width:${done ? 100 : Math.round((inTier / p.perTier) * 100)}%"></span></div>
    <p class="zb-next">${esc(done ? t("zb.passDone") : t("zb.toNext", { xp: p.perTier - inTier }))}${!done && next ? ` · ${esc(t("zb.nextReward", { tier: next.tier }))}` : ""}</p>
    <ol class="zb-track">${cells}</ol>
    <p class="muted small">${esc(t("zb.passHint", { cap: p.dayCap }))} ${esc(t("zb.streakFreeze"))}</p>
  </section>`;
}

// Od kod je predmet (tema s potjo ali vir): pogled »preglej« tukaj in v vitrini sošolca (public/leagues.js).
export function earnedWhere(id, row) {
  const x = itemOf(id);
  if (!x || !row) return "";
  if (row.topic) return t("zb.fromTopic", { topic: row.topic.path ? `${row.topic.name} (${row.topic.path})` : row.topic.name });
  const src = { pass: () => t("zb.fromPass", { season: seasonLabel(variantOf(id)) }), set: () => t("zb.fromSet"), xp: () => t(x.collection === "pot" ? "zb.fromXp" : "zb.fromXpAt", { xp: num(x.need?.xp) }), league: () => t("zb.fromLeague"), games: () => t("zb.fromGames") };
  return src[row.source]?.() || "";
}

function inspect(id) {
  const x = itemOf(id);
  if (!x) return "";
  const own = ownedSet().has(id);
  const row = data.items.find((i) => i.id === id);
  const on = isWorn(equipped(), id);
  const shown = data.showcase.includes(id);
  const v = variantOf(id);
  const where = earnedWhere(id, row);
  return `<div class="zb-inspect card" role="dialog" tabindex="-1" aria-modal="false" aria-label="${esc(itemName(x, lang()))}">
    <button type="button" class="ghost zb-x" data-act="close" aria-label="${esc(t("nav.back"))}">${icon("x")}</button>
    <div class="zb-big">${x.sym ? itemThumb(id, 120) : avatarSvg(wear(equipped(), id), { size: 170, title: itemName(x, lang()) })}</div>
    <div class="zb-info">
      <h2>${esc(itemName(x, lang()))}${v ? ` <small class="muted">${esc(seasonLabel(v))}</small>` : ""}</h2>
      <p><span class="gm-rtag gm-r-${x.rarity}">${esc(t(`games.rarity.${x.rarity}`))}</span> ${x.set ? `<span class="gm-rtag">${esc(t("zb.set"))}</span>` : ""}</p>
      ${own ? `<p>${icon("calendar")}<span>${esc(t("zb.got", { date: fmtDate(row?.at) }))}</span></p>${where ? `<p>${icon("book-open")}<span>${esc(where)}</span></p>` : ""}` : `<p class="zb-need">${icon("lock")}<span>${esc(condition(x, id))}</span></p>`}
      ${x.about ? `<p class="muted small">${icon("info")}<span>${esc(x.about[lang()] || x.about.en)}</span></p>` : ""}
      ${msg ? `<p class="gm-shop-msg" role="status">${esc(msg)}</p>` : ""}
      ${own ? `<div class="actions">
        <button type="button" class="primary" data-act="wear">${esc(on ? t("zb.takeOff") : t("games.wear"))}</button>
        <button type="button" class="secondary" data-act="show">${icon("star")}${esc(shown ? t("zb.removeShow") : t("zb.addShow"))}</button>
      </div>` : ""}
    </div>
  </div>`;
}

// Fokus po ponovnem izrisu: isti gumb kot prej (Obleci, V vitrino, zavihek …), da tipkovnica ne skoči na začetek.
function focusKey(el) {
  if (!el || !root?.contains(el) || !el.dataset) return null;
  if (el.dataset.act) return `[data-act="${el.dataset.act}"]`;
  if (el.dataset.tab) return `[data-tab="${el.dataset.tab}"]`;
  if (el.dataset.zbopen) return `.${el.classList[0]}[data-zbopen="${CSS.escape(el.dataset.zbopen)}"]`;
  return null;
}
let opener = null; // izbirnik predmeta, ki je odprl »preglej«

function closeInspect() {
  open = null;
  render(opener);
}

function render(focus = null) {
  if (!root || !data) return;
  const keep = focus || focusKey(document.activeElement);
  const own = ownedSet();
  const counts = Object.fromEntries(COLLECTIONS.map((c) => [c.id, KNOWLEDGE.filter((x) => x.collection === c.id)]));
  const tabs = [...COLLECTIONS.map((c) => ({ id: c.id, label: itemName(c, lang()), ic: c.icon, n: counts[c.id].filter((x) => own.has(x.id)).length, of: counts[c.id].length })), { id: "pass", label: t("zb.pass"), ic: "award" }];
  if (!tabs.some((x) => x.id === tab)) tab = "pse";
  const earlier = tab === "pass" ? data.items.filter((i) => itemOf(i.id)?.collection === "pass" && variantOf(i.id) !== data.pass.season).map((i) => i.id) : [];
  const show = data.showcase;
  root.innerHTML = `
    <div class="zb-top card">
      <div class="zb-me">${avatarSvg(equipped(), { size: 120, title: t("games.avatar") })}</div>
      <div class="zb-show">
        <h2>${icon("star")} ${esc(t("zb.showcase"))}</h2>
        <div class="zb-slots">${Array.from({ length: data.showcaseMax }, (_, i) => (show[i] ? `<button type="button" class="zb-slot full" data-zbopen="${esc(show[i])}" aria-label="${esc(itemName(itemOf(show[i]), lang()))}">${itemThumb(show[i], 56, equipped())}</button>` : `<span class="zb-slot"></span>`)).join("")}</div>
        <p class="muted small">${esc(show.length ? t("zb.showcaseHint") : t("zb.showcaseEmpty"))}</p>
        ${!shareHow() ? "" : `<button type="button" class="secondary zb-share-btn" data-act="share">${icon("share")}<span>${esc(t("share.button"))}</span></button>`}
      </div>
    </div>
    ${shareHtml()}
    <p class="zb-intro">${esc(t("zb.intro"))} <span class="muted">${esc(t("zb.rules"))}</span></p>
    ${passCard()}
    <div class="chip-row zb-tabs" role="tablist">${tabs.map((x) => `<button type="button" role="tab" aria-selected="${tab === x.id}" class="${tab === x.id ? "active" : ""}" data-tab="${x.id}">${icon(x.ic)}${esc(x.label)}${x.of ? ` <small>${x.n}/${x.of}</small>` : ""}</button>`).join("")}</div>
    ${tab === "pot" || tab === "smesni" ? potLine(tab) : tab === "lige" ? `<p class="muted zb-pot">${esc(t("zb.ligeHint"))}</p>` : tab === "igre" ? `<p class="muted zb-pot">${esc(t("zb.igreHint"))}</p>` : ""}
    <div class="zb-grid">${tabItems().map(card).join("")}</div>
    ${earlier.length ? `<h3 class="zb-sub">${esc(t("zb.earlier"))}</h3><div class="zb-grid">${earlier.map(card).join("")}</div>` : ""}
    ${open ? inspect(open) : ""}`;
  // Izbran zavihek naj bo viden (vrstica zavihkov se na ozkem zaslonu drsi vodoravno).
  const tabRow = root.querySelector(".zb-tabs");
  makeRowSortable(tabRow, "zbirke"); // vrstni red zavihkov po želji učenca (public/vrstice.js)
  const act = tabRow?.querySelector(".active");
  if (tabRow && act && act.offsetLeft + act.offsetWidth > tabRow.scrollLeft + tabRow.clientWidth) tabRow.scrollLeft = act.offsetLeft - tabRow.offsetLeft - 16;
  // Trak passa: trenutna stopnja na sredini.
  const track = root.querySelector(".zb-track");
  const now = track?.querySelector(".now") || track?.querySelector(".got:last-of-type");
  if (track && now) track.scrollLeft = Math.max(0, now.offsetLeft - track.offsetLeft - track.clientWidth / 2 + now.clientWidth / 2);
  if (keep) root.querySelector(keep)?.focus({ preventScroll: true });
  root.querySelectorAll("[data-tab]").forEach((b) =>
    b.addEventListener("click", () => {
      tab = b.dataset.tab;
      open = null;
      try {
        localStorage.setItem(TAB_KEY, tab);
      } catch {}
      render();
    }),
  );
  root.querySelectorAll("[data-zbopen]").forEach((b) =>
    b.addEventListener("click", () => {
      open = b.dataset.zbopen;
      opener = focusKey(b);
      msg = "";
      render(".zb-inspect");
    }),
  );
  root.querySelector('[data-act="close"]')?.addEventListener("click", closeInspect);
  root.querySelector('[data-act="share"]')?.addEventListener("click", makeShare);
  root.querySelector('[data-act="share-close"]')?.addEventListener("click", () => {
    dropShare();
    render('[data-act="share"]');
  });
  root.querySelector('[data-act="share-go"]')?.addEventListener("click", async () => {
    const s = share;
    if (!s?.blob || s.busy) return;
    if (shareHow() === "bridge") {
      // Aplikacija odpre sistemski meni za deljenje; sporočilo pove le to, kar aplikacija res potrdi.
      s.busy = true;
      s.msg = "";
      render('[data-act="share-go"]');
      let r;
      try {
        r = await shareCardNative(s.blob, { name: "evklid-zbirka.png" });
      } catch {
        r = { ok: false };
      } finally {
        s.busy = false;
      }
      const key = shareResultKey(r);
      s.msg = key ? t(key) : "";
    } else {
      const how = await shareCardFile(s.blob, { name: "evklid-zbirka.png", title: t("share.cardTitle") });
      s.msg = how === "downloaded" ? t("share.downloaded") : how === "shared" ? t("share.shared") : "";
    }
    if (share === s) render('[data-act="share-go"]');
  });
  root.querySelector('[data-act="wear"]')?.addEventListener("click", () => {
    const on = isWorn(equipped(), open);
    if (!on && slotFull(equipped(), open)) return ((msg = t("games.slotFull", { n: MULTI_MAX })), render());
    save("avatar", { equipped: on ? takeOff(equipped(), open) : wear(equipped(), open) }, (r) => ((data.avatar = r), ""));
  });
  root.querySelector('[data-act="show"]')?.addEventListener("click", () => {
    const has = show.includes(open);
    if (!has && show.length >= data.showcaseMax) return ((msg = t("zb.showFull")), render());
    save("zbirke/vitrina", { items: has ? show.filter((i) => i !== open) : [...show, open] }, (r) => ((data = r), ""));
  });
}

// Deljiva kartica: slika brez osebnih podatkov (public/deli-kartico.js), najprej predogled, nato Deli ali Prenesi.
let share = null; // { url, blob, msg }
// V mobilni aplikaciji (WebView) prenos in Web Share z datotekami ne delujeta: tam deli most aplikacije
// (public/deli-most.js, expo-sharing); aplikacija brez mostu (starejši APK) gumba ne pokaže (docs/mobilna-aplikacija.md).
const shareHow = () => (typeof navigator === "undefined" ? "" : shareMode(navigator.userAgent, window.EvklidNative));
function dropShare() {
  if (share?.url) URL.revokeObjectURL(share.url);
  share = null;
}
function shareHtml() {
  if (!share) return "";
  if (!share.blob) return `<div class="card zb-share" role="status"><p class="muted">${esc(share.msg || t("share.making"))}</p></div>`;
  const canFiles = shareHow() === "bridge" || !!navigator.canShare?.({ files: [new File([share.blob], "x.png", { type: "image/png" })] });
  return `<section class="card zb-share" aria-label="${esc(t("share.cardTitle"))}">
    <img src="${share.url}" alt="${esc(t("share.alt"))}" width="270" height="338">
    <div class="zb-share-info">
      <p>${esc(t("share.private"))}</p>
      <div class="actions">
        <button type="button" class="primary" data-act="share-go"${share.busy ? " disabled" : ""}>${icon(canFiles ? "share" : "download")}<span>${esc(t(canFiles ? "share.send" : "share.download"))}</span></button>
        <button type="button" class="ghost" data-act="share-close">${esc(t("share.close"))}</button>
      </div>
      ${share.msg ? `<p class="muted small" role="status">${esc(share.msg)}</p>` : ""}
    </div>
  </section>`;
}
async function makeShare() {
  dropShare();
  share = { msg: "" };
  render();
  try {
    const wm = document.querySelector(".brand-name");
    const wordmark = wm ? [wm.firstChild?.textContent || "", wm.querySelector("span")?.textContent || ""] : undefined;
    const svg = shareCardSvg(shareCardModel(data), { t, lang: lang(), wordmark, rtl: document.documentElement.dir === "rtl" });
    const blob = await shareCardPng(svg);
    share = { blob, url: URL.createObjectURL(blob), msg: "" };
  } catch {
    share = { msg: t("share.failed") };
  }
  render('[data-act="share-go"]');
}

async function save(url, body, apply) {
  const s = ctx.getStudent();
  if (!s) return;
  try {
    msg = apply(await ctx.api(`/api/students/${s.id}/${url}`, { method: "POST", body: JSON.stringify(body) })) || "";
  } catch (e) {
    msg = e.message;
  }
  render();
}

// Obvestilo o novih predmetih (po nalogi ali pogovoru): ime enega ali več predmetov.
export function unlockedText(ids) {
  const names = (ids || []).map((id) => itemOf(id)).filter(Boolean).map((x) => itemName(x, lang()));
  if (!names.length) return "";
  return names.length === 1 ? t("zb.new", { name: names[0] }) : t("zb.newMany", { names: names.join(", ") });
}

// Kartica za »Jaz«: avatar, vitrina in stopnja passa.
export async function meCard(el) {
  if (!el || !ctx?.getStudent()) return;
  try {
    const d = await loadZbirke();
    el.innerHTML = `<span class="zb-me-av">${avatarSvg(d.avatar.equipped, { size: 56 })}</span>
      <span class="lr-text"><b>${esc(t("zb.title"))}</b><small><span>${esc(t("zb.passLevel", { tier: d.pass.tier, tiers: d.pass.tiers }))}</span> · <span>${esc(t("zb.meCount", { n: d.items.filter((i) => itemOf(i.id)?.collection !== "pass").length, of: KNOWLEDGE.filter((x) => x.collection !== "pass").length }))}</span></small></span>
      <span class="zb-me-show">${d.showcase.map((id) => itemThumb(id, 34, d.avatar.equipped)).join("")}</span>${icon("chevron-right")}`;
    el.hidden = false;
  } catch {}
}
