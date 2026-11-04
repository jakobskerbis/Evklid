// Koledar aktivnosti (Napredek in Jaz): en kvadratek na dan za zadnjih 53 tednov, barva po XP tistega dne
// (XP dobiš za lekcije, vaje, igre in pogovor z inštruktorjem). Podatki: /api/students/:id/progress → xpDays.
// Teden se začne s ponedeljkom. Vsak stolpec ima 8 celic: oznaka meseca in 7 dni, zato ozek vsebnik (CSS) skrije
// prve tedne kar po vrstnem redu celic in pokaže zadnje pol leta.
import { t, locale } from "./i18n.js";

const WEEKS = 53;
const DAY = 86400000;
const iso = (d) => d.toISOString().slice(0, 10);

// Dnevi od ponedeljka pred 52 tedni do danes (UTC, kot date(created_at) na strežniku).
function calendar(now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = (today.getUTCDay() + 6) % 7; // pon = 0
  const start = new Date(today - (dow + (WEEKS - 1) * 7) * DAY);
  return { start, today };
}

export function activityStats(xpDays = [], now = new Date()) {
  const by = new Map(xpDays.map((d) => [d.day, d.xp || 0]));
  const { start, today } = calendar(now);
  let active = 0, best = 0, run = 0, week = 0;
  const weekStart = new Date(today - ((today.getUTCDay() + 6) % 7) * DAY);
  for (let d = new Date(start); d <= today; d = new Date(+d + DAY)) {
    const xp = by.get(iso(d)) || 0;
    if (xp > 0) (active++, run++, (best = Math.max(best, run)));
    else run = 0;
    if (d >= weekStart) week += xp;
  }
  return { active, best, week };
}

export function heatmapHtml(xpDays = [], now = new Date()) {
  const by = new Map(xpDays.map((d) => [d.day, d.xp || 0]));
  const { start, today } = calendar(now);
  const max = Math.max(1, ...by.values());
  const mFmt = new Intl.DateTimeFormat(locale(), { month: "short", timeZone: "UTC" });
  const dFmt = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" });
  let cells = "";
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const first = new Date(+start + w * 7 * DAY);
    const m = first.getUTCMonth();
    cells += `<span class="hm-m">${m !== lastMonth && w < WEEKS - 2 ? mFmt.format(first) : ""}</span>`;
    lastMonth = m;
    for (let k = 0; k < 7; k++) {
      const d = new Date(+first + k * DAY);
      if (d > today) {
        cells += `<i class="hm-d future"></i>`;
        continue;
      }
      const xp = by.get(iso(d)) || 0;
      const lvl = xp ? Math.min(4, Math.max(1, Math.ceil((xp / max) * 4))) : 0;
      cells += `<i class="hm-d l${lvl}${+d === +today ? " today" : ""}" title="${t("akt.day", { day: dFmt.format(d), xp })}"></i>`;
    }
  }
  const s = activityStats(xpDays, now);
  return `<div class="hm" role="img" aria-label="${t("akt.title")}"><div class="hm-grid">${cells}</div></div>
    <div class="hm-foot">
      <span>${t("akt.activeDays", { n: s.active })} · ${t("akt.best", { n: s.best })} · ${t("akt.week", { n: s.week })}</span>
      <span class="hm-legend" aria-hidden="true">${t("akt.less")}<i class="hm-d l0"></i><i class="hm-d l1"></i><i class="hm-d l2"></i><i class="hm-d l3"></i><i class="hm-d l4"></i>${t("akt.more")}</span>
    </div>`;
}

// XP po tednih (zadnjih 12 tednov) kot stolpci.
export function weeksHtml(xpDays = [], now = new Date()) {
  const by = new Map(xpDays.map((d) => [d.day, d.xp || 0]));
  const { today } = calendar(now);
  const mon = new Date(today - ((today.getUTCDay() + 6) % 7) * DAY);
  const fmt = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "numeric", timeZone: "UTC" });
  const weeks = [...Array(12)].map((_, i) => {
    const s = new Date(+mon - (11 - i) * 7 * DAY);
    let xp = 0;
    for (let k = 0; k < 7; k++) xp += by.get(iso(new Date(+s + k * DAY))) || 0;
    return { s, xp };
  });
  const max = Math.max(1, ...weeks.map((w) => w.xp));
  return `<div class="wk-bars">${weeks
    .map((w) => `<div class="wk" title="${fmt.format(w.s)}: ${w.xp} XP"><b>${w.xp || ""}</b><span style="--h:${(w.xp / max).toFixed(3)}"></span><small>${fmt.format(w.s)}</small></div>`)
    .join("")}</div>`;
}
