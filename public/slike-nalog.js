// Slike pri nalogah (iz public/app.js, da app.js ostane v proračunu 80 KB stisnjeno na datoteko).
import { icon } from "./icons.js";
import { t } from "./i18n-osnova.js";

// Slike pri nalogah: graf premice in številska premica. Barve so enake v svetlem
// in temnem načinu (risba je na belem »listu«).
let figSeq = 0;
export function figureSvg(f) {
  if (f.type === "line") return lineFigure(f);
  if (f.type === "numberline") return numberLineFigure(f);
  return "";
}

function lineFigure(f) {
  const id = `fig${++figSeq}`;
  const R = 6, S = 28, P = 22; // polmer mreže, velikost enote, rob
  const W = 2 * R * S + 2 * P;
  const X = (x) => P + (x + R) * S, Y = (y) => P + (R - y) * S;
  let g = "", nums = "";
  for (let i = -R; i <= R; i++) {
    g += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}"/><line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}"/>`;
    if (i && Math.abs(i) < R) {
      nums += `<text x="${X(i)}" y="${Y(0) + 17}" text-anchor="middle">${i < 0 ? "−" + -i : i}</text>`;
      nums += `<text x="${X(0) - 7}" y="${Y(i) + 4}" text-anchor="end">${i < 0 ? "−" + -i : i}</text>`;
    }
  }
  const f0 = (x) => f.k * x + f.n;
  // Do tri točke s celimi koordinatami blizu izhodišča; dotik pokaže koordinate.
  const pts = [];
  for (let x = -R + 1; x < R; x++) if (Math.abs(f0(x)) < R) pts.push(x);
  pts.sort((a, b) => Math.abs(a) + Math.abs(f0(a)) - (Math.abs(b) + Math.abs(f0(b))));
  const shown = pts.slice(0, 3).sort((a, b) => a - b);
  const ptsSvg = shown
    .map((x) => {
      const y = f0(x);
      const right = X(x) < W - 90;
      return `<g class="fig-pt" tabindex="0" role="button" aria-label="${t("task.pointAria", { x, y })}">
        <circle cx="${X(x)}" cy="${Y(y)}" r="14" class="hit"/><circle cx="${X(x)}" cy="${Y(y)}" r="6.5" class="dot"/>
        <text x="${X(x) + (right ? 12 : -12)}" y="${Y(y) - 10}" text-anchor="${right ? "start" : "end"}" class="coord">(${x}, ${y})</text></g>`;
    })
    .join("");
  return `<figure class="fig"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="${t("task.graphAria")}">
    <defs><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrow"/></marker>
      <clipPath id="${id}c"><rect x="${X(-R)}" y="${Y(R)}" width="${2 * R * S}" height="${2 * R * S}"/></clipPath></defs>
    <rect x="0" y="0" width="${W}" height="${W}" rx="14" class="paper"/>
    <g class="grid">${g}</g>
    <line x1="${X(-R)}" y1="${Y(0)}" x2="${X(R) + 12}" y2="${Y(0)}" class="axis" marker-end="url(#${id}a)"/>
    <line x1="${X(0)}" y1="${Y(-R)}" x2="${X(0)}" y2="${Y(R) - 12}" class="axis" marker-end="url(#${id}a)"/>
    <g class="nums">${nums}<text x="${X(0) - 7}" y="${Y(0) + 17}" text-anchor="end">0</text></g>
    <text x="${X(R) + 6}" y="${Y(0) - 10}" class="axis-name">x</text><text x="${X(0) + 10}" y="${Y(R) - 4}" class="axis-name">y</text>
    <line clip-path="url(#${id}c)" x1="${X(-R - 1)}" y1="${Y(f0(-R - 1))}" x2="${X(R + 1)}" y2="${Y(f0(R + 1))}" class="plot"/>
    ${ptsSvg}</svg>
    <figcaption>${icon("info")} ${t("task.tapPoint")}</figcaption></figure>`;
}

function numberLineFigure(f) {
  const id = `fig${++figSeq}`;
  const S = 40, P = 26, from = f.x0 - 5, to = f.x0 + 5;
  const W = (to - from) * S + 2 * P, H = 84, Y = 40;
  const X = (x) => P + (x - from) * S;
  let ticks = "";
  for (let x = from; x <= to; x++) {
    ticks += `<line x1="${X(x)}" y1="${Y - 7}" x2="${X(x)}" y2="${Y + 7}" class="tick"/><text x="${X(x)}" y="${Y + 28}" text-anchor="middle" class="${x === f.x0 ? "strong" : ""}">${x < 0 ? "−" + -x : x}</text>`;
  }
  const end = f.dir < 0 ? P - 8 : W - P + 8;
  return `<figure class="fig wide"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t("task.lineAria")}">
    <defs><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrow"/></marker>
      <marker id="${id}b" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ray-arrow"/></marker></defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="14" class="paper"/>
    <line x1="${P - 14}" y1="${Y}" x2="${W - P + 14}" y2="${Y}" class="axis" marker-end="url(#${id}a)"/>
    ${ticks}
    <line x1="${X(f.x0)}" y1="${Y}" x2="${end}" y2="${Y}" class="ray" marker-end="url(#${id}b)"/>
    <circle cx="${X(f.x0)}" cy="${Y}" r="8" class="${f.closed ? "closed" : "open"}"/></svg></figure>`;
}

// Dotik točke na grafu pokaže ali skrije njene koordinate.
document.addEventListener("click", (e) => e.target.closest(".fig-pt")?.classList.toggle("show"));
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.closest?.(".fig-pt")) {
    e.preventDefault();
    e.target.closest(".fig-pt").classList.toggle("show");
  }
});
