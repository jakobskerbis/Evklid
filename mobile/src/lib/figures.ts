// Slike k nalogam (graf premice, številska premica), enako kot na spletu (public/app.js figureSvg),
// le da so barve iz teme in so koordinate točk vedno vidne (na telefonu ni lebdenja).
import type { Theme } from "./theme";
import { t } from "./i18n";

export type Figure = { type: "line"; k: number; n: number } | { type: "numberline"; x0: number; dir: number; closed: boolean };

const minus = (x: number) => (x < 0 ? "−" + -x : String(x));

function lineFigure(f: { k: number; n: number }, th: Theme) {
  const R = 6, S = 28, P = 22;
  const W = 2 * R * S + 2 * P;
  const X = (x: number) => P + (x + R) * S, Y = (y: number) => P + (R - y) * S;
  let g = "", nums = "";
  for (let i = -R; i <= R; i++) {
    g += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}"/><line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}"/>`;
    if (i && Math.abs(i) < R) {
      nums += `<text x="${X(i)}" y="${Y(0) + 17}" text-anchor="middle">${minus(i)}</text>`;
      nums += `<text x="${X(0) - 7}" y="${Y(i) + 4}" text-anchor="end">${minus(i)}</text>`;
    }
  }
  const f0 = (x: number) => f.k * x + f.n;
  const pts: number[] = [];
  for (let x = -R + 1; x < R; x++) if (Math.abs(f0(x)) < R) pts.push(x);
  pts.sort((a, b) => Math.abs(a) + Math.abs(f0(a)) - (Math.abs(b) + Math.abs(f0(b))));
  const dots = pts
    .slice(0, 3)
    .sort((a, b) => a - b)
    .map((x) => {
      const y = f0(x);
      const right = X(x) < W - 90;
      return `<circle cx="${X(x)}" cy="${Y(y)}" r="6.5" fill="${th.warm}"/><text x="${X(x) + (right ? 12 : -12)}" y="${Y(y) - 10}" text-anchor="${right ? "start" : "end"}" font-weight="700" fill="${th.text}" paint-order="stroke" stroke="${th.surface}" stroke-width="4">(${minus(x)}, ${minus(y)})</text>`;
    })
    .join("");
  return `<svg viewBox="0 0 ${W} ${W}" role="img" aria-label="${t("task.graphAria")}" font-size="12" font-family="system-ui">
  <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${th.text}"/></marker>
  <clipPath id="c"><rect x="${X(-R)}" y="${Y(R)}" width="${2 * R * S}" height="${2 * R * S}"/></clipPath></defs>
  <rect width="${W}" height="${W}" rx="14" fill="${th.surface}"/>
  <g stroke="${th.border}" stroke-width="1">${g}</g>
  <g stroke="${th.text}" stroke-width="1.6"><line x1="${X(-R)}" y1="${Y(0)}" x2="${X(R) + 12}" y2="${Y(0)}" marker-end="url(#a)"/><line x1="${X(0)}" y1="${Y(-R)}" x2="${X(0)}" y2="${Y(R) - 12}" marker-end="url(#a)"/></g>
  <g fill="${th.muted}">${nums}<text x="${X(0) - 7}" y="${Y(0) + 17}" text-anchor="end">0</text></g>
  <g fill="${th.text}" font-style="italic" font-size="15"><text x="${X(R) + 6}" y="${Y(0) - 10}">x</text><text x="${X(0) + 10}" y="${Y(R) - 4}">y</text></g>
  <line clip-path="url(#c)" x1="${X(-R - 1)}" y1="${Y(f0(-R - 1))}" x2="${X(R + 1)}" y2="${Y(f0(R + 1))}" stroke="${th.accent}" stroke-width="3"/>
  ${dots}</svg>`;
}

function numberLineFigure(f: { x0: number; dir: number; closed: boolean }, th: Theme) {
  const S = 40, P = 26, from = f.x0 - 5, to = f.x0 + 5;
  const W = (to - from) * S + 2 * P, H = 84, Y = 40;
  const X = (x: number) => P + (x - from) * S;
  let ticks = "";
  for (let x = from; x <= to; x++) {
    ticks += `<line x1="${X(x)}" y1="${Y - 7}" x2="${X(x)}" y2="${Y + 7}" stroke="${th.text}" stroke-width="1.5"/><text x="${X(x)}" y="${Y + 28}" text-anchor="middle" fill="${x === f.x0 ? th.text : th.muted}" font-weight="${x === f.x0 ? 700 : 400}">${minus(x)}</text>`;
  }
  const end = f.dir < 0 ? P - 8 : W - P + 8;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t("task.lineAria")}" font-size="14" font-family="system-ui">
  <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${th.text}"/></marker>
  <marker id="b" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${th.accent}"/></marker></defs>
  <rect width="${W}" height="${H}" rx="14" fill="${th.surface}"/>
  <line x1="${P - 14}" y1="${Y}" x2="${W - P + 14}" y2="${Y}" stroke="${th.text}" stroke-width="1.6" marker-end="url(#a)"/>
  ${ticks}
  <line x1="${X(f.x0)}" y1="${Y}" x2="${end}" y2="${Y}" stroke="${th.accent}" stroke-width="6" marker-end="url(#b)"/>
  <circle cx="${X(f.x0)}" cy="${Y}" r="8" fill="${f.closed ? th.accent : th.surface}" stroke="${th.accent}" stroke-width="3"/></svg>`;
}

export function figureHtml(f: Figure | null | undefined, th: Theme) {
  if (!f) return "";
  if (f.type === "line") return lineFigure(f, th);
  if (f.type === "numberline") return numberLineFigure(f, th);
  return "";
}
