// Iz paketa lucide-static zgradi public/icons.js z ikonami, ki jih uporablja vmesnik.
//   node scripts/build-icons.js
import fs from "node:fs";
import path from "node:path";

const NAMES = [
  "map", "compass", "repeat", "clipboard-check", "zap", "message-circle", "chart-column", "settings", "user",
  "star", "flame", "check", "x", "lock", "pencil", "keyboard", "eraser", "undo-2", "trash-2", "plus", "eye",
  "camera", "send", "arrow-left", "arrow-right", "lightbulb", "trophy", "target", "puzzle", "book-open",
  "sparkles", "circle-help", "menu", "chevron-right", "graduation-cap", "play", "rotate-ccw", "gift", "award",
  "calendar", "info", "search", "users", "circle-check", "circle-x", "bot", "trending-up", "download", "flask-conical", "monitor-play", "refresh-cw", "medal", "timer", "skip-forward", "flag",
  "sigma", "sun", "moon", "sun-moon", "palette", "dices", "paintbrush", "mic", "square", "circle-arrow-up", "party-popper", "globe", "wifi-off", "cloud-upload", "feather", "message-square-heart",
  "library", "file-text", "list-checks", "external-link", "notebook-pen", "bell",
  // znanstveni kalkulator in enote
  "calculator", "atom", "ruler", "arrow-left-right",
  // grafični kalkulator
  "chart-spline", "square-function", "zoom-in", "zoom-out", "house", "maximize", "maximize-2", "minimize-2", "image-down", "save",
  "folder-open", "ellipsis-vertical", "pause", "table", "sliders-horizontal", "copy", "chevron-down", "delete", "corner-down-left",
  "wrench", "text", "redo-2", "activity", "chart-area", "flower", "infinity", "spline", "circle",
  // namestitev aplikacije
  "share", "square-plus", "smartphone",
  // kartice za ponavljanje
  "layers",
  // igre
  "gamepad-2", "volume-2", "volume-x", "heart",
  // števec porabe AI (samo skrbnik)
  "wallet",
  // meni profila (ime zgoraj desno)
  "user-plus", "log-out",
  // urnik
  "bell", "calendar-days", "calendar-clock", "link",
  // kotiček zanimanj
  "newspaper", "pin", "pin-off",
  // igre: zaklenjene igre in gradnja
  "unlock", "castle",
  // igre v slogu mobilnih iger (public/games/fun.js)
  "chef-hat", "car", "paw-print", "shopping-basket", "grid-2x2", "cherry", "droplet", "bomb", "blocks", "gem", "spade", "joystick", "venetian-mask",
  // skeniranje nalog (public/scan/)
  "scan-line", "scan-text", "badge-check", "image",
  // kovanci (igre, zbirke)
  "coins",
  // 3D atlas in modeli (public/3d/)
  "ellipsis", "eye-off", "scissors", "box", "bone", "rotate-3d", "focus",
];
const dir = path.join("node_modules", "lucide-static", "icons");
const out = {};
for (const n of NAMES) {
  const svg = fs.readFileSync(path.join(dir, `${n}.svg`), "utf8");
  out[n] = svg.slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>")).replace(/\s*\n\s*/g, "").trim();
}
// Lastne ikone (ista mreža 24 × 24, currentColor).
// »elementi«: Evklidovi Elementi, I. knjiga, 1. trditev – enakostranični trikotnik nad daljico AB iz dveh krogov
// s središčema A in B (logotip v aplikaciji; ikona za namestitev in favicon ostaneta v public/icons/).
const CUSTOM = {
  elementi:
    '<circle cx="8.5" cy="12" r="7" stroke-width="1.5" /><circle cx="15.5" cy="12" r="7" stroke-width="1.5" />' +
    '<path d="M8.5 12h7L12 5.94z" fill="currentColor" fill-opacity="0.3" stroke-width="1.75" />',
};
Object.assign(out, CUSTOM);
const js = `// Ikone Lucide (ISC licenca, https://lucide.dev) in lastne (CUSTOM). Ustvarjeno s scripts/build-icons.js.
const P = ${JSON.stringify(out, null, 0).replace(/","/g, '",\n  "')};

// Zgodovinski slogi (public/theme.js → ERAS[slog].icons) imajo svoje ikone obdobja v public/eras/<slog>/ikone.json
// (scripts/ikone-obdobij.js): { map: { ime: ikona obdobja }, svg: { ikona obdobja: vsebina } }. theme.js jih začne
// nalagati že v <head>; ko pridejo ali ko se slog zamenja (dogodek evklid:era), se že izrisane ikone zamenjajo same.
let ERA = null;
const body = (name) => (ERA && ERA.svg[ERA.map[name]]) || P[name] || "";

export function icon(name, cls = "") {
  return \`<svg class="i \${cls}" data-i="\${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\${body(name)}</svg>\`;
}

// Zamenja <i data-icon="ime"></i> v HTML z ikonami.
export function hydrateIcons(root = document) {
  root.querySelectorAll("i[data-icon]").forEach((el) => {
    el.outerHTML = icon(el.dataset.icon, el.className);
  });
}

// Ikona inštruktorja v mehurčkih (style.css → .msg.assistant::after) je maska iz ikone »sparkles« obdobja.
function tutorMark() {
  const root = document.documentElement;
  const svg = ERA && ERA.svg[ERA.map.sparkles];
  if (!svg) return root.removeAttribute("data-tutor-ic"), root.style.removeProperty("--tutor-ic");
  const file = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\${svg}</svg>\`;
  root.style.setProperty("--tutor-ic", \`url("data:image/svg+xml,\${encodeURIComponent(file)}")\`);
  root.setAttribute("data-tutor-ic", "");
}

async function useEra(id) {
  const set = (id && (await window.STEMTheme?.iconSet?.(id))) || null;
  if ((document.documentElement.dataset.era || "") !== (id || "") || set === ERA) return;
  const names = new Set([...Object.keys(ERA?.map || {}), ...Object.keys(set?.map || {})]);
  ERA = set;
  document.querySelectorAll("svg.i[data-i]").forEach((el) => {
    if (names.has(el.dataset.i)) el.innerHTML = body(el.dataset.i);
  });
  tutorMark();
}
if (typeof document !== "undefined" && typeof window !== "undefined") {
  useEra(document.documentElement.dataset.era || "");
  window.addEventListener("evklid:era", (e) => useEra(e.detail || ""));
}
`;
fs.writeFileSync(path.join("public", "icons.js"), js);
console.log(`icons.js: ${Object.keys(out).length} ikon`);
