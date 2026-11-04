// Avatar učenca (j: kovanci iz iger za predmete, kot skini; avatar je edino, kar učenec izbere in vidijo drugi).
// Samo vnaprej narisani deli (izvirni SVG), brez prostega besedila in nalaganja slik. Brez pravega denarja.
// Uporabljata ga odjemalec (risanje, trgovina) in strežnik (cene, preverjanje).
// Predmeti za znanje (značka, efekt, ozadja, kompleti, učni pass) so v public/zbirke.js: ne kupijo se,
// odklene jih samo obvladana snov.
import { KNOWLEDGE, DRAW, baseId, BODY_PATH } from "./zbirke.js";

export const SLOTS = ["kind", "body", "eyes", "mouth", "hat", "outfit", "acc", "badge", "bg", "fx"];
export const COINS_PER_CORRECT = 1;
export const COINS_PER_DAY = 150;

// Redkost po ceni (barva okvirja v trgovini).
// Redkost po ceni; kozmični in večni predmeti so samo za znanje in igre (public/zbirke.js).
export const rarity = (price) => (price === 0 ? "free" : price <= 25 ? "common" : price <= 60 ? "rare" : price <= 150 ? "epic" : price <= 1000 ? "legendary" : "mythic");
// Redkost predmeta: pri predmetih za znanje težavnost snovi, pri ostalih cena.
export const itemRarity = (x) => x?.rarity || rarity(x?.price ?? 0);

const it = (id, slot, price, sl, en) => ({ id, slot, price, name: { sl, en } });
export const ITEMS = [
  // lik (ostali liki se odklenejo z igranjem iger, public/zbirke.js)
  it("kind_blob", "kind", 0, "Klasičen", "Classic"),
  // telo
  it("body_blue", "body", 0, "Modra", "Blue"),
  it("body_green", "body", 0, "Zelena", "Green"),
  it("body_orange", "body", 0, "Oranžna", "Orange"),
  it("body_pink", "body", 0, "Roza", "Pink"),
  it("body_purple", "body", 0, "Vijolična", "Purple"),
  it("body_teal", "body", 0, "Turkizna", "Teal"),
  it("body_robot", "body", 0, "Robot", "Robot"),
  it("body_galaxy", "body", 0, "Galaksija", "Galaxy"),
  it("body_gold", "body", 0, "Zlata", "Gold"),
  it("body_rainbow", "body", 0, "Mavrica", "Rainbow"),
  // oči
  it("eyes_dots", "eyes", 0, "Pikice", "Dots"),
  it("eyes_happy", "eyes", 0, "Vesele", "Happy"),
  it("eyes_big", "eyes", 20, "Velike", "Big"),
  it("eyes_wink", "eyes", 30, "Pomežik", "Wink"),
  it("eyes_sleepy", "eyes", 30, "Zaspane", "Sleepy"),
  it("eyes_star", "eyes", 70, "Zvezdice", "Stars"),
  it("eyes_visor", "eyes", 130, "Vizir", "Visor"),
  // usta
  it("mouth_smile", "mouth", 0, "Nasmeh", "Smile"),
  it("mouth_grin", "mouth", 20, "Širok nasmeh", "Grin"),
  it("mouth_o", "mouth", 20, "Čudenje", "Wow"),
  it("mouth_tongue", "mouth", 30, "Jezik", "Tongue"),
  it("mouth_cat", "mouth", 50, "Mucek", "Kitty"),
  it("mouth_fangs", "mouth", 80, "Zobki", "Fangs"),
  // pokrivalo
  it("hat_none", "hat", 0, "Brez", "None"),
  it("hat_cap", "hat", 20, "Kapa s šiltom", "Cap"),
  it("hat_beanie", "hat", 30, "Zimska kapa", "Beanie"),
  it("hat_party", "hat", 40, "Zabavna kapa", "Party hat"),
  it("hat_flower", "hat", 40, "Rožica", "Flower"),
  it("hat_chef", "hat", 40, "Kuharska kapa", "Chef's hat"),
  it("hat_phones", "hat", 60, "Slušalke", "Headphones"),
  it("hat_grad", "hat", 80, "Diplomska kapa", "Graduation cap"),
  it("hat_viking", "hat", 110, "Vikinška čelada", "Viking helmet"),
  it("hat_wizard", "hat", 140, "Čarovniški klobuk", "Wizard hat"),
  it("hat_crown", "hat", 220, "Krona", "Crown"),
  it("hat_astro", "hat", 300, "Vesoljska čelada", "Space helmet"),
  it("hat_flame", "hat", 1500, "Ognjena krona", "Crown of fire"),
  // oblačilo
  it("outfit_none", "outfit", 0, "Brez", "None"),
  it("outfit_bow", "outfit", 20, "Metuljček", "Bow tie"),
  it("outfit_scarf", "outfit", 30, "Šal", "Scarf"),
  it("outfit_hoodie", "outfit", 50, "Pulover", "Hoodie"),
  it("outfit_lab", "outfit", 70, "Laboratorijska halja", "Lab coat"),
  it("outfit_puffer", "outfit", 90, "Puhovka", "Puffer jacket"),
  it("outfit_hero", "outfit", 150, "Junak s plaščem", "Hero cape"),
  it("outfit_armor", "outfit", 280, "Zlati oklep", "Golden armour"),
  it("outfit_starcape", "outfit", 2500, "Zvezdni plašč", "Starry cloak"),
  // dodatek
  it("acc_none", "acc", 0, "Brez", "None"),
  it("acc_glasses", "acc", 30, "Očala", "Glasses"),
  it("acc_shades", "acc", 40, "Sončna očala", "Sunglasses"),
  it("acc_monocle", "acc", 60, "Monokel", "Monocle"),
  it("acc_goggles", "acc", 90, "Zaščitna očala", "Lab goggles"),
  it("acc_blush", "acc", 20, "Rdeča lička", "Blush"),
  it("acc_bubble", "acc", 25, "Balonček iz žvečilke", "Bubble gum"),
  // ozadje
  it("bg_sky", "bg", 0, "Nebo", "Sky"),
  it("bg_mint", "bg", 0, "Meta", "Mint"),
  it("bg_grid", "bg", 30, "Karirast papir", "Graph paper"),
  it("bg_sun", "bg", 40, "Sonce", "Sunburst"),
  it("bg_ocean", "bg", 60, "Morje", "Ocean"),
  it("bg_stars", "bg", 90, "Zvezdna noč", "Starry night"),
  it("bg_pyramids", "bg", 120, "Piramide", "Pyramids"),
  it("bg_space", "bg", 150, "Vesolje", "Space"),
  it("bg_lava", "bg", 260, "Vulkan", "Volcano"),
  it("bg_nebula", "bg", 2000, "Meglica", "Nebula"),
  // značka in efekt (predmeti zanje so samo za znanje, public/zbirke.js)
  it("badge_none", "badge", 0, "Brez", "None"),
  it("fx_none", "fx", 0, "Brez", "None"),
  ...KNOWLEDGE,
];
export const ITEM = Object.fromEntries(ITEMS.map((x) => [x.id, x]));

// Tedenske posodobitve (j, 30. 10. 2026; docs/kozmetika-posodobitve.md): dan, ko je predmet prišel v
// aplikacijo. Teden dni ga trgovina in Zbirke kažejo z oznako »Novo«. Nov predmet = vrstica tukaj.
export const ADDED = {
  ...Object.fromEntries(["hat_flame", "bg_nebula", "outfit_starcape", "pot_blackhole", "pot_comet", "pot_starcrown", "kind_phoenix", "kind_whale", "meme_pica", "meme_gelato", "meme_tung", "meme_tungfx", "meme_kavicina", "meme_bananini", "meme_saturnita", "meme_slonini", "meme_smrekini"].map((id) => [id, "2026-10-30"])),
  ...Object.fromEntries(["meme_limone", "meme_spageti", "meme_skampi", "meme_testenine", "meme_kokos", "meme_frigo", "meme_luna", "meme_cajnik", "meme_lubenica"].map((id) => [id, "2026-10-30"])),
  ...Object.fromEntries(["hat_chef", "acc_bubble", "outfit_puffer", "bg_pyramids", "pot_rhind"].map((id) => [id, "2026-11-04"])),
};
export const NEW_DAYS = 7;
// Splošno: datum »YYYY-MM-DD« je mlajši od NEW_DAYS dni (tudi za nove vrste iger, oznaka .gm-new v games.css).
export function isNewDate(d, now = Date.now()) {
  const age = now - Date.parse(`${d}T00:00:00Z`);
  return !!d && age >= 0 && age < NEW_DAYS * 864e5;
}
export const isNew = (id, now = Date.now()) => isNewDate(ADDED[baseId(id)], now);
// Predmet za id iz inventarja (tudi sezonski »pass_coat~2026-1«).
export const itemOf = (id) => ITEM[baseId(id)] || null;
// Predali, v katerih nosiš več predmetov hkrati (seznam id-jev, največ MULTI_MAX). Predmeta na istem
// mestu (npr. dvoje očal) se izključujeta: novi zamenja starega. Ostali predali imajo en predmet.
export const MULTI = ["hat", "outfit", "acc", "badge", "fx"];
export const MULTI_MAX = 6;
const SPOT = { hat_phones: "ears", hat_flower: "flower", pot_laurel: "wreath", outfit_bow: "neck", outfit_scarf: "neck", acc_blush: "cheeks", acc_bubble: "bubble", pot_pregl: "hand", pass_pencil: "pencil", acc_joystick: "controller" };
const SPOT_MAIN = { hat: "head", outfit: "body", acc: "eyes" };
// Vrstni red risanja (spodaj → zgoraj); značke in efekti po vrsti oblačenja.
const SPOT_ORDER = { hat: ["wreath", "head", "ears", "flower"], outfit: ["body", "neck"], acc: ["cheeks", "bubble", "eyes", "hand", "pencil", "controller"] };
export const spotOf = (x) => SPOT[x.id] || SPOT_MAIN[x.slot] || x.id;
export const isMulti = (slot) => MULTI.includes(slot);

export const DEFAULT_AVATAR = { kind: "kind_blob", body: "body_blue", eyes: "eyes_dots", mouth: "mouth_smile", hat: [], outfit: [], acc: [], badge: [], bg: "bg_sky", fx: [] };
export const itemName = (x, lang) => x.name[lang] || x.name.en;
const isNone = (id) => /_none$/.test(id);

// Id-ji, ki jih avatar nosi v predalu (tudi star zapis z enim nizom).
export function worn(eq, slot) {
  const v = eq?.[slot];
  const list = Array.isArray(v) ? v : v ? [v] : [];
  return list.map(String).filter((id) => !isNone(id));
}
export const isWorn = (eq, id) => {
  const x = itemOf(id);
  return !!x && (isMulti(x.slot) ? worn(eq, x.slot).includes(id) : eq?.[x.slot] === id);
};
// Doda predmet v predal (predmet na istem mestu zamenja); »Brez« izprazni predal.
export function wear(eq, id) {
  const x = itemOf(id);
  if (!x) return eq;
  if (!isMulti(x.slot)) return { ...eq, [x.slot]: id };
  if (isNone(id)) return { ...eq, [x.slot]: [] };
  const spot = spotOf(x);
  return { ...eq, [x.slot]: [...worn(eq, x.slot).filter((i) => itemOf(i) && spotOf(itemOf(i)) !== spot), id] };
}
export function takeOff(eq, id) {
  const x = itemOf(id);
  if (!x) return eq;
  return isMulti(x.slot) ? { ...eq, [x.slot]: worn(eq, x.slot).filter((i) => i !== id) } : { ...eq, [x.slot]: DEFAULT_AVATAR[x.slot] };
}
// Ali je predal poln (nov predmet ne zamenja nobenega na istem mestu).
export function slotFull(eq, id) {
  const x = itemOf(id);
  if (!x || !isMulti(x.slot) || isNone(id)) return false;
  const list = worn(eq, x.slot);
  return !list.includes(id) && list.length >= MULTI_MAX && !list.some((i) => itemOf(i) && spotOf(itemOf(i)) === spotOf(x));
}

// Popravi izbiro: vsak del obstaja, je v pravem predalu in ga učenec ima (ali je brezplačen).
// any = true: samo znani deli, brez preverjanja lastništva (shranjen avatar za prikaz drugim).
export function cleanAvatar(eq, owned = [], any = false) {
  const have = new Set(owned);
  const ok = (id, slot) => {
    const x = itemOf(id);
    if (!x || x.slot !== slot) return false;
    // Sezonski predmet samo s sezono, ostali brez pripone.
    if (x.collection === "pass" ? !/^[a-z_]+~\d{4}-[12]$/.test(id) : id !== x.id) return false;
    return any || x.price === 0 || have.has(id);
  };
  const out = { ...DEFAULT_AVATAR };
  for (const slot of SLOTS) {
    if (isMulti(slot)) {
      let list = [];
      for (const id of worn(eq, slot)) if (ok(id, slot)) list = wear({ [slot]: list }, id)[slot];
      out[slot] = list.slice(-MULTI_MAX);
    } else {
      const id = eq?.[slot];
      if (typeof id === "string" && ok(id, slot)) out[slot] = id;
    }
  }
  return out;
}

// Mesta značk na prsih: ena ostane na svojem mestu, več jih je manjših (središče x, y in merilo).
const BADGE_AT = {
  2: [[35, 84], [65, 84]].map((p) => [...p, 0.78]),
  3: [[30, 82], [50, 89], [70, 82]].map((p) => [...p, 0.64]),
  4: [[29, 79], [71, 79], [38, 90], [62, 90]].map((p) => [...p, 0.56]),
  5: [[28, 77], [72, 77], [32, 89], [50, 90], [68, 89]].map((p) => [...p, 0.52]),
  6: [[29, 77], [50, 81], [71, 77], [33, 89], [50, 92], [67, 89]].map((p) => [...p, 0.46]),
};
function badges(list) {
  if (list.length <= 1) return list.map((id) => DRAW.badge(id)).join("");
  return list
    .map((id, i) => {
      const [x, y, k] = BADGE_AT[Math.min(list.length, MULTI_MAX)][i];
      const [ox, oy] = itemOf(id)?.sym ? [66, 83] : [64, 82]; // središče značke na njenem mestu
      return `<g transform="translate(${x} ${y}) scale(${k}) translate(${-ox} ${-oy})">${DRAW.badge(id)}</g>`;
    })
    .join("");
}
const byOrder = (slot, list) => (SPOT_ORDER[slot] ? [...list].sort((a, b) => SPOT_ORDER[slot].indexOf(spotOf(itemOf(a))) - SPOT_ORDER[slot].indexOf(spotOf(itemOf(b)))) : list);

// ---------- risanje (viewBox 0 0 100 100) ----------
const BODY = {
  body_blue: ["#3b82f6", "#1d4ed8"], body_green: ["#22c55e", "#15803d"], body_orange: ["#fb923c", "#c2410c"],
  body_pink: ["#f472b6", "#be185d"], body_purple: ["#a78bfa", "#6d28d9"], body_teal: ["#2dd4bf", "#0f766e"],
  body_robot: ["#cbd5e1", "#64748b"], body_galaxy: ["#4c1d95", "#1e1b4b"], body_gold: ["#fde047", "#ca8a04"], body_rainbow: ["#f87171", "#60a5fa"],
};
const INK = "#1f2937";

function defs(u, body) {
  const [a, b] = BODY[body] || BODY.body_blue;
  let fill = `<linearGradient id="g${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  if (body === "body_rainbow")
    fill = `<linearGradient id="g${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f87171"/><stop offset=".25" stop-color="#fbbf24"/><stop offset=".5" stop-color="#4ade80"/><stop offset=".75" stop-color="#60a5fa"/><stop offset="1" stop-color="#c084fc"/></linearGradient>`;
  return `<defs>${fill}<clipPath id="c${u}"><path d="${BODY_PATH}"/></clipPath></defs>`;
}

const BG = {
  bg_sky: () => `<rect width="100" height="100" fill="#dbeafe"/><circle cx="20" cy="20" r="9" fill="#fff" opacity=".8"/><circle cx="30" cy="18" r="7" fill="#fff" opacity=".8"/>`,
  bg_mint: () => `<rect width="100" height="100" fill="#d1fae5"/><circle cx="85" cy="18" r="6" fill="#a7f3d0"/><circle cx="12" cy="80" r="8" fill="#a7f3d0"/>`,
  bg_grid: () => `<rect width="100" height="100" fill="#f8fafc"/><path d="${Array.from({ length: 9 }, (_, i) => `M${(i + 1) * 10} 0V100M0 ${(i + 1) * 10}H100`).join("")}" stroke="#93c5fd" stroke-width=".8"/>`,
  bg_sun: () => `<rect width="100" height="100" fill="#fef3c7"/><g fill="#fde68a">${Array.from({ length: 12 }, (_, i) => `<path d="M50 50L${50 + 80 * Math.cos((i * Math.PI) / 6)} ${50 + 80 * Math.sin((i * Math.PI) / 6)}L${50 + 80 * Math.cos((i * Math.PI) / 6 + 0.26)} ${50 + 80 * Math.sin((i * Math.PI) / 6 + 0.26)}z"/>`).join("")}</g>`,
  bg_ocean: () => `<rect width="100" height="100" fill="#7dd3fc"/><path d="M0 70q12-8 25 0t25 0 25 0 25 0V100H0z" fill="#0ea5e9"/><path d="M0 84q12-7 25 0t25 0 25 0 25 0V100H0z" fill="#0369a1"/>`,
  bg_stars: () => `<rect width="100" height="100" fill="#1e293b"/><g fill="#fde047">${[[12, 14], [80, 10], [90, 40], [8, 50], [22, 86], [88, 82], [60, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join("")}</g><circle cx="84" cy="22" r="7" fill="#f8fafc"/><circle cx="87" cy="20" r="6" fill="#1e293b"/>`,
  bg_space: () => `<rect width="100" height="100" fill="#2e1065"/><g fill="#e9d5ff">${[[10, 10], [30, 6], [92, 30], [6, 70], [94, 90], [70, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3"/>`).join("")}</g><circle cx="14" cy="30" r="8" fill="#f472b6"/><ellipse cx="14" cy="30" rx="13" ry="3" fill="none" stroke="#fbcfe8" stroke-width="1.5"/>`,
  bg_nebula: (u) =>
    `<defs><radialGradient id="neb1${u}" cx=".25" cy=".3" r=".6"><stop offset="0" stop-color="#f472b6" stop-opacity=".95"/><stop offset="1" stop-color="#f472b6" stop-opacity="0"/></radialGradient><radialGradient id="neb2${u}" cx=".8" cy=".7" r=".6"><stop offset="0" stop-color="#22d3ee" stop-opacity=".85"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient><radialGradient id="neb3${u}" cx=".7" cy=".15" r=".4"><stop offset="0" stop-color="#a78bfa" stop-opacity=".9"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient></defs><rect width="100" height="100" fill="#0b1026"/><rect width="100" height="100" fill="url(#neb1${u})"/><rect width="100" height="100" fill="url(#neb2${u})"/><rect width="100" height="100" fill="url(#neb3${u})"/><g fill="#fff">${[[8, 8, 1.4], [30, 14, 1], [52, 6, 1.6], [90, 12, 1.2], [94, 44, 1], [6, 46, 1.2], [12, 92, 1.4], [88, 92, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g><path d="M78 30l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" fill="#fef9c3"/>`,
  bg_pyramids: (u) =>
    `<defs><linearGradient id="py${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdba74"/><stop offset="1" stop-color="#fef3c7"/></linearGradient></defs><rect width="100" height="100" fill="url(#py${u})"/><circle cx="84" cy="16" r="7" fill="#fef9c3"/><path d="M0 80L24 44 48 80z" fill="#e0b070" stroke="#a16207" stroke-width="1.2" stroke-linejoin="round"/><path d="M24 44L48 80H30z" fill="#c08a4f"/><path d="M60 80L80 52 100 80z" fill="#e0b070" stroke="#a16207" stroke-width="1.2" stroke-linejoin="round"/><path d="M80 52L100 80H86z" fill="#c08a4f"/><path d="M0 78q25-5 50 0t50 0V100H0z" fill="#ecc994"/><path d="M0 90q30-4 60 0t40 0" stroke="#d6a86b" stroke-width="1.5" fill="none"/>`,
  bg_lava: (u) => `<defs><linearGradient id="lv${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f1d1d"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="100" height="100" fill="url(#lv${u})"/><path d="M0 100L18 62 30 70 42 52 58 72 70 58 84 70 100 56V100z" fill="#292524"/><g fill="#fdba74">${[[20, 20], [70, 14], [86, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join("")}</g>`,
};

const BODY_EXTRA = {
  body_robot: () => `<g fill="#475569"><circle cx="27" cy="62" r="1.8"/><circle cx="73" cy="62" r="1.8"/><circle cx="27" cy="84" r="1.8"/><circle cx="73" cy="84" r="1.8"/></g><path d="M50 24V14" stroke="${INK}" stroke-width="2.5"/><circle cx="50" cy="12" r="4" fill="#ef4444" stroke="${INK}" stroke-width="2"/>`,
  body_galaxy: () => `<g fill="#e9d5ff">${[[34, 40], [66, 36], [40, 84], [70, 80], [58, 30], [28, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join("")}</g>`,
  body_gold: () => `<path d="M32 36q6-6 12-7" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/>`,
};

const EYES = {
  eyes_dots: () => `<circle cx="40" cy="52" r="4" fill="${INK}"/><circle cx="60" cy="52" r="4" fill="${INK}"/>`,
  eyes_happy: () => `<path d="M35 54q5-7 10 0M55 54q5-7 10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  eyes_big: () => `<g stroke="${INK}" stroke-width="2"><circle cx="39" cy="51" r="8" fill="#fff"/><circle cx="61" cy="51" r="8" fill="#fff"/></g><circle cx="40" cy="52" r="4.5" fill="${INK}"/><circle cx="62" cy="52" r="4.5" fill="${INK}"/><circle cx="41.5" cy="50" r="1.6" fill="#fff"/><circle cx="63.5" cy="50" r="1.6" fill="#fff"/>`,
  eyes_wink: () => `<circle cx="40" cy="52" r="4" fill="${INK}"/><path d="M55 53h10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  eyes_sleepy: () => `<path d="M34 51q6 5 12 0M54 51q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M72 36h6l-6 6h6" stroke="${INK}" stroke-width="1.6" fill="none"/>`,
  eyes_star: () => [40, 60].map((x) => `<path d="M${x} 45l2 4.5 5 .5-3.8 3.3 1.2 4.9-4.4-2.6-4.4 2.6 1.2-4.9-3.8-3.3 5-.5z" fill="#facc15" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`).join(""),
  eyes_visor: () => `<rect x="28" y="45" width="44" height="13" rx="6.5" fill="#0f172a" stroke="${INK}" stroke-width="2"/><rect x="34" y="49" width="10" height="5" rx="2.5" fill="#22d3ee"/><rect x="56" y="49" width="10" height="5" rx="2.5" fill="#22d3ee"/>`,
};

const MOUTH = {
  mouth_smile: () => `<path d="M42 66q8 7 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  mouth_grin: () => `<path d="M38 64h24q-2 12-12 12t-12-12z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M38.5 66h23" stroke="${INK}" stroke-width="1.2"/>`,
  mouth_o: () => `<ellipse cx="50" cy="68" rx="4.5" ry="5.5" fill="${INK}"/>`,
  mouth_tongue: () => `<path d="M42 65q8 6 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 68q4 9 8 0z" fill="#f87171" stroke="${INK}" stroke-width="1.5"/>`,
  mouth_cat: () => `<path d="M42 65q4 5 8 0q4 5 8 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M48 61h4l-2 2z" fill="${INK}"/>`,
  mouth_fangs: () => `<path d="M40 65q10 8 20 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M44 67l2 5 2-4M52 68l2 4 2-5" fill="#fff" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`,
};

const ACC = {
  acc_none: () => "",
  acc_bubble: () => `<circle cx="50" cy="69" r="8.5" fill="#f9a8d4" fill-opacity=".92" stroke="#db2777" stroke-width="1.8"/><path d="M45.5 65.5q2-3 5-3" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  acc_blush: () => `<ellipse cx="32" cy="62" rx="5" ry="3" fill="#fb7185" opacity=".6"/><ellipse cx="68" cy="62" rx="5" ry="3" fill="#fb7185" opacity=".6"/>`,
  acc_glasses: () => `<g fill="none" stroke="${INK}" stroke-width="2.5"><circle cx="40" cy="52" r="8"/><circle cx="60" cy="52" r="8"/><path d="M48 52h4M32 50l-8-3M68 50l8-3"/></g>`,
  acc_shades: () => `<path d="M30 46h18v7q0 7-9 7t-9-7zM52 46h18v7q0 7-9 7t-9-7z" fill="#111827" stroke="${INK}" stroke-width="2"/><path d="M48 49h4M30 48l-6-2M70 48l6-2" stroke="${INK}" stroke-width="2.5"/><path d="M34 50l4-2" stroke="#fff" stroke-width="1.5" opacity=".7"/>`,
  acc_monocle: () => `<circle cx="60" cy="52" r="8.5" fill="#bae6fd" fill-opacity=".35" stroke="#ca8a04" stroke-width="2.5"/><path d="M66 58q4 10 0 20" stroke="#ca8a04" stroke-width="1.2" fill="none"/>`,
  acc_goggles: () => `<path d="M22 50h56" stroke="#334155" stroke-width="5"/><rect x="29" y="43" width="19" height="15" rx="7" fill="#a5f3fc" fill-opacity=".6" stroke="${INK}" stroke-width="2.5"/><rect x="52" y="43" width="19" height="15" rx="7" fill="#a5f3fc" fill-opacity=".6" stroke="${INK}" stroke-width="2.5"/>`,
};

const HAT = {
  hat_none: () => "",
  hat_chef: () =>
    `<path d="M32 26q-11-2-9-12 3-8 12-5 2-8 15-8t15 8q9-3 12 5 2 10-9 12z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 14q2 5 0 10M60 14q-2 5 0 10" stroke="#e2e8f0" stroke-width="1.6" fill="none"/><rect x="32" y="23" width="36" height="11" rx="2" fill="#f8fafc" stroke="${INK}" stroke-width="2.5"/><path d="M41 24v9M50 24v9M59 24v9" stroke="#cbd5e1" stroke-width="1.5"/>`,
  hat_cap: () => `<path d="M24 34q2-18 26-18t26 18z" fill="#ef4444" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M60 34h26q0 5-6 5H60z" fill="#b91c1c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="16" r="2.5" fill="#b91c1c"/>`,
  hat_beanie: () => `<path d="M23 36q0-22 27-22t27 22z" fill="#14b8a6" stroke="${INK}" stroke-width="2.5"/><rect x="21" y="32" width="58" height="8" rx="4" fill="#0f766e" stroke="${INK}" stroke-width="2.5"/><circle cx="50" cy="12" r="5" fill="#f8fafc" stroke="${INK}" stroke-width="2"/>`,
  hat_party: () => `<path d="M36 30L50 2l14 28z" fill="#a855f7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 22l6 3M43 14l6 3M46 7l4 2" stroke="#fde047" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="3" r="3" fill="#fde047" stroke="${INK}" stroke-width="1.5"/>`,
  hat_flower: () => `<g transform="translate(68 26)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="5" ry="8" transform="rotate(${a}) translate(0 -7)" fill="#f9a8d4" stroke="${INK}" stroke-width="1.5"/>`).join("")}<circle r="4.5" fill="#fde047" stroke="${INK}" stroke-width="1.5"/></g>`,
  hat_phones: () => `<path d="M20 52q0-36 30-36t30 36" fill="none" stroke="${INK}" stroke-width="4.5"/><rect x="13" y="46" width="12" height="18" rx="5" fill="#ef4444" stroke="${INK}" stroke-width="2.5"/><rect x="75" y="46" width="12" height="18" rx="5" fill="#ef4444" stroke="${INK}" stroke-width="2.5"/>`,
  hat_grad: () => `<path d="M30 28q0 8 20 8t20-8v-8H30z" fill="#1f2937" stroke="${INK}" stroke-width="2"/><path d="M50 8L84 20 50 30 16 20z" fill="#374151" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 20l24 4v12" stroke="#facc15" stroke-width="2" fill="none"/><circle cx="74" cy="38" r="2.5" fill="#facc15"/>`,
  hat_viking: () => `<path d="M24 36q0-22 26-22t26 22z" fill="#94a3b8" stroke="${INK}" stroke-width="2.5"/><path d="M50 14v22" stroke="#64748b" stroke-width="3"/><path d="M26 30q-14-4-12-22 6 12 16 14zM74 30q14-4 12-22-6 12-16 14z" fill="#fef3c7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
  hat_wizard: () => `<path d="M20 34q30 8 60 0L58 26 44 -2 36 26z" fill="#4338ca" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M42 18l2 4 4 .5-3 2.5 1 4-4-2-4 2 1-4-3-2.5 4-.5z" fill="#fde047"/><circle cx="54" cy="10" r="1.6" fill="#fde047"/>`,
  hat_crown: () => `<path d="M28 34V14l11 10 11-14 11 14 11-10v20z" fill="#facc15" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="39" cy="28" r="2.5" fill="#ef4444"/><circle cx="50" cy="27" r="3" fill="#3b82f6"/><circle cx="61" cy="28" r="2.5" fill="#22c55e"/>`,
  hat_flame: () =>
    `<path d="M28 36C22 26 27 18 32 12c1 7 4 10 7 11C37 14 42 6 50 1c-1 9 3 14 7 16 1-6 5-10 9-12-1 7 1 12 4 15 3-3 5-4 7-4-1 8-3 15-7 20z" fill="#f97316" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M35 34c-3-6-1-11 2-14 1 4 3 6 5 6-1-6 2-11 8-15 0 6 2 10 5 11 1-3 3-5 6-6-1 5 0 9 3 11 0 3-1 5-3 7z" fill="#fde047"/><rect x="27" y="31" width="46" height="7" rx="2.5" fill="#b91c1c" stroke="${INK}" stroke-width="2"/><path d="M50 32l2.4 2.5L50 37l-2.4-2.5z" fill="#fef9c3" stroke="${INK}" stroke-width="1"/>`,
  hat_astro: () => `<circle cx="50" cy="56" r="40" fill="#bae6fd" fill-opacity=".28" stroke="#e2e8f0" stroke-width="4"/><circle cx="50" cy="56" r="40" fill="none" stroke="${INK}" stroke-width="1.5"/><path d="M26 32q8-10 20-12" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>`,
};

// Oblačila: del za telesom (plašč) in del na telesu (obrezan z obliko telesa).
const OUTFIT_BACK = {
  outfit_hero: () => `<path d="M26 64L10 98h80L74 64z" fill="#dc2626" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  outfit_starcape: () =>
    `<path d="M26 62L6 98h88L74 62z" fill="#1e1b4b" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><g fill="#fde68a">${[[14, 90, 1.6], [24, 78, 1.2], [84, 86, 1.6], [76, 74, 1.1], [90, 96, 1], [10, 97, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`,
};
const OUTFIT = {
  outfit_none: () => "",
  outfit_bow: () => `<path d="M50 78l-11-6v12zM50 78l11-6v12z" fill="#ef4444" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="78" r="3" fill="#b91c1c" stroke="${INK}" stroke-width="1.5"/>`,
  outfit_scarf: () => `<path d="M20 74q30 10 60 0v8q-30 10-60 0z" fill="#f59e0b" stroke="${INK}" stroke-width="2"/><path d="M62 80l4 16h8l-3-17z" fill="#d97706" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  outfit_puffer: (u) =>
    `<g clip-path="url(#c${u})"><path d="M0 76h100v28H0z" fill="#38bdf8" stroke="${INK}" stroke-width="2"/><path d="M0 85q50 5 100 0M0 93q50 5 100 0" stroke="#0284c7" stroke-width="2" fill="none"/><path d="M50 80v24" stroke="#0369a1" stroke-width="2"/></g><path d="M30 76q20 6 40 0" stroke="#7dd3fc" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="48.5" y="82" width="3" height="6" rx="1.2" fill="#e2e8f0" stroke="${INK}" stroke-width="1"/>`,
  outfit_hoodie: (u) => `<g clip-path="url(#c${u})"><path d="M0 76q50 10 100 0v30H0z" fill="#22c55e" stroke="${INK}" stroke-width="2"/><path d="M44 80v10M56 80v10" stroke="#f8fafc" stroke-width="2"/><rect x="38" y="88" width="24" height="8" rx="3" fill="#16a34a"/></g>`,
  outfit_lab: (u) => `<g clip-path="url(#c${u})"><path d="M0 74h100v30H0z" fill="#f8fafc" stroke="${INK}" stroke-width="2"/><path d="M50 74v26M50 74l-10 10M50 74l10 10" stroke="#cbd5e1" stroke-width="2" fill="none"/><rect x="58" y="84" width="10" height="8" fill="none" stroke="#94a3b8" stroke-width="1.5"/><path d="M61 80v8" stroke="#3b82f6" stroke-width="2"/></g>`,
  outfit_hero: (u) => `<g clip-path="url(#c${u})"><path d="M0 74h100v30H0z" fill="#2563eb"/></g><path d="M50 76l3 6 6 .6-4.5 4 1.4 6-5.9-3.3-5.9 3.3 1.4-6-4.5-4 6-.6z" fill="#facc15" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`,
  outfit_starcape: () =>
    `<path d="M28 72q22 10 44 0" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M50 72l2.6 5.4 5.9.6-4.4 4 1.3 5.8L50 84.8l-5.4 3 1.3-5.8-4.4-4 5.9-.6z" fill="#facc15" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`,
  outfit_armor: (u) => `<g clip-path="url(#c${u})"><path d="M0 72h100v32H0z" fill="#eab308" stroke="${INK}" stroke-width="2"/><path d="M0 82h100" stroke="#a16207" stroke-width="2"/></g><path d="M42 74h16v12q0 8-8 10-8-2-8-10z" fill="#fde047" stroke="${INK}" stroke-width="2"/>`,
};

let uid = 0;
// SVG niz avatarja; eq = { body, eyes, mouth, bg: id; hat, outfit, acc, badge, fx: seznam id-jev }.
export function avatarSvg(eq, { size = 64, title = "" } = {}) {
  const a = { ...DEFAULT_AVATAR, ...(eq || {}) };
  const u = `av${++uid}`;
  const body = BODY[a.body] ? a.body : "body_blue";
  // Največ MULTI_MAX (predogled novega predmeta v polnem predalu jih ima lahko 7: BADGE_AT jih ne pozna).
  const W = (slot) => byOrder(slot, worn(a, slot).filter((id) => itemOf(id)).slice(-MULTI_MAX));
  const fx = W("fx");
  const outfit = W("outfit");
  const each = (list, f) => list.map(f).join("");
  return `<svg class="avatar-svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img"${title ? ` aria-label="${title.replace(/"/g, "&quot;")}"` : ` aria-hidden="true"`}>
${defs(u, body)}${DRAW.bg(a.bg, u) ?? (BG[a.bg] || BG.bg_sky)(u)}${each(fx, (id) => DRAW.fxBack(id, u))}${each(outfit, (id) => (OUTFIT_BACK[id] || (() => ""))())}${DRAW.kindBack(a.kind, u)}
<path d="${BODY_PATH}" fill="url(#g${u})" stroke="${INK}" stroke-width="3"/>${(BODY_EXTRA[body] || (() => ""))()}${DRAW.kindFront(a.kind, u)}
<path d="M30 40q4-8 12-10" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
${each(outfit, (id) => DRAW.outfit(id, u) ?? (OUTFIT[id] || OUTFIT.outfit_none)(u))}${badges(W("badge"))}${(EYES[a.eyes] || EYES.eyes_dots)()}${(MOUTH[a.mouth] || MOUTH.mouth_smile)()}${each(W("acc"), (id) => DRAW.acc(id, u) ?? (ACC[id] || ACC.acc_none)())}${each(W("hat"), (id) => DRAW.hat(id) ?? (HAT[id] || HAT.hat_none)())}${each(fx, (id) => DRAW.fxFront(id))}</svg>`;
}
