// Deljiva kartica zbirke (j-jev dokument o kozmetiki: »Deljiva kartica (slika) za družbena omrežja brez osebnih
// podatkov«). Sliko nariše odjemalec (SVG → canvas → PNG) in je ne pošlje na strežnik.
// Na kartici so samo avatar, do trije predmeti iz vitrine z okvirjem redkosti, števila zbranih predmetov po zbirkah
// in znak aplikacije: nikoli ime, vzdevek, šola, razred, e-naslov ali id. Zato shareCardModel podatke vzame
// po seznamu dovoljenih polj (ne odstrani prepovedanih), shareCardSvg pa riše samo model.
// Modul ne uporablja DOM-a (razen shareCardPng in shareCardFile), da ga preizkusi test/vitrina.test.js.
import { avatarSvg, itemOf, itemName, itemRarity, cleanAvatar, DEFAULT_AVATAR } from "./avatar.js";
import { COLLECTIONS, KNOWLEDGE, elementTile } from "./zbirke.js";
import { icon } from "./icons.js";

export const CARD_W = 1080;
export const CARD_H = 1350; // 4 : 5, kot objava na družbenih omrežjih
const SHOW_MAX = 3;

// Model kartice iz odgovora /api/students/:id/zbirke. Vzame samo dovoljena polja.
export function shareCardModel(d) {
  const owned = new Set((d?.items || []).map((i) => String(i?.id)));
  const showcase = (Array.isArray(d?.showcase) ? d.showcase : [])
    .map(String)
    .filter((id) => owned.has(id) && itemOf(id))
    .slice(0, SHOW_MAX)
    .map((id) => ({ id, rarity: itemRarity(itemOf(id)) }));
  const collections = COLLECTIONS.map((c) => {
    const all = KNOWLEDGE.filter((x) => x.collection === c.id);
    return { id: c.id, n: all.filter((x) => owned.has(x.id)).length, of: all.length };
  });
  const tier = Number(d?.pass?.tier) || 0;
  const tiers = Number(d?.pass?.tiers) || 0;
  return {
    avatar: cleanAvatar(d?.avatar?.equipped || DEFAULT_AVATAR, [], true),
    showcase,
    collections,
    total: { n: collections.reduce((s, c) => s + c.n, 0), of: collections.reduce((s, c) => s + c.of, 0) },
    pass: { tier: Math.max(0, Math.min(tier, tiers)), tiers },
  };
}

// Okvirji redkosti (iste barve kot .gm-r-* v games.css).
const FRAME = {
  free: ["#94a3b8"],
  common: ["#94a3b8"],
  rare: ["#3b82f6"],
  epic: ["#a855f7"],
  legendary: ["#fde68a", "#f59e0b", "#b45309", "#fde047"],
  mythic: ["#fb7185", "#e11d48", "#a855f7", "#f0abfc"],
  cosmic: ["#22d3ee", "#6366f1", "#a855f7", "#0ea5e9"],
  eternal: ["#f87171", "#fbbf24", "#4ade80", "#22d3ee", "#818cf8", "#f472b6"],
};
const xml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
// Vgnezden SVG (avatar, ikona) na mesto x, y v velikosti size.
const place = (svg, x, y, size) => svg.replace(/^<svg\b[^>]*?\sviewBox="([^"]+)"[^>]*>/, (_, vb) => `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${vb}">`);
const thumb = (id, eq, x, y, size) => {
  const it = itemOf(id);
  if (it?.sym) return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 20 20">${elementTile(it, { x0: 0, y0: 0, s: 20 })}</svg>`;
  return place(avatarSvg({ ...eq, [it.slot]: id }, { size }), x, y, size);
};
// Besedilo, ki je predolgo za okvir, skrajšamo (brez merjenja pisave: približek po številu znakov).
const fit = (s, max) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

// Približna širina besedila v točkah (krepka pisava): širok znak (CJK, kana, hangul) ≈ 1 em, ostali ≈ 0,6 em.
const WIDE = /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/;
export const textWidth = (s, size) => [...String(s)].reduce((w, c) => w + (WIDE.test(c) ? 1 : 0.6) * size, 0);
// Varovalo za vsako vrstico: predolgo besedilo brskalnik stisne na največjo širino (textLength), nikoli ga ne odreže.
const squeeze = (s, size, max) => (textWidth(s, size) > max ? ` textLength="${max}" lengthAdjust="spacingAndGlyphs"` : "");
const line = (x, y, size, s, max, attrs) => `<text x="${x}" y="${y}" font-size="${size}"${squeeze(s, size, max)} ${attrs}>${xml(s)}</text>`;

// SVG kartice. t = prevodi (ključ, spremenljivke), lang = jezik imen predmetov, wordmark = [»Evkli«, »d«].
export function shareCardSvg(m, { t, lang = "sl", wordmark = ["Evkli", "d"], rtl = false } = {}) {
  const W = CARD_W;
  const font = `font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"`;
  const dir = rtl ? ` direction="rtl"` : "";
  const defs = Object.entries(FRAME)
    .map(([r, c]) => `<linearGradient id="fr-${r}" x1="0" y1="0" x2="1" y2="1">${c.map((col, i) => `<stop offset="${c.length > 1 ? i / (c.length - 1) : 0}" stop-color="${col}"/>`).join("")}</linearGradient>`)
    .join("");
  // Glava: znak in ime aplikacije.
  const logo = place(icon("kristal"), 0, 0, 64).replace("<svg ", `<svg color="#fde68a" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" `);
  const head = `<g transform="translate(${W / 2 - 150} 56)">${logo}<text x="84" y="50" font-size="58" font-weight="800" fill="#ffffff" ${font}>${xml(wordmark[0])}<tspan fill="#fbbf24">${xml(wordmark[1] || "")}</tspan></text></g>`;
  // Avatar.
  const av = 360, avY = 140;
  const avX = (W - av) / 2;
  const avatar = `<rect x="${avX - 12}" y="${avY - 12}" width="${av + 24}" height="${av + 24}" rx="60" fill="#ffffff" opacity=".14"/><clipPath id="av-clip"><rect x="${avX}" y="${avY}" width="${av}" height="${av}" rx="48"/></clipPath><g clip-path="url(#av-clip)">${place(avatarSvg(m.avatar, { size: av }), avX, avY, av)}</g>`;
  const mid = `text-anchor="middle" font-weight="800" fill="#ffffff" ${font}${dir}`;
  const title = line(W / 2, 572, 44, t("share.cardTitle"), 960, mid);
  // Trije predmeti z okvirjem redkosti.
  const fw = 280, fh = 330, gap = 40, y0 = 612;
  const x0 = (W - (3 * fw + 2 * gap)) / 2;
  const slots = Array.from({ length: SHOW_MAX }, (_, i) => {
    const s = m.showcase[i];
    const x = x0 + (rtl ? SHOW_MAX - 1 - i : i) * (fw + gap);
    if (!s) return `<rect x="${x}" y="${y0}" width="${fw}" height="${fh}" rx="34" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".35" stroke-width="4" stroke-dasharray="14 12"/>`;
    const it = itemOf(s.id);
    const r = FRAME[s.rarity] ? s.rarity : "common";
    return `<g><rect x="${x}" y="${y0}" width="${fw}" height="${fh}" rx="34" fill="#ffffff" stroke="url(#fr-${r})" stroke-width="12"/>
      ${thumb(s.id, m.avatar, x + 50, y0 + 26, 180)}
      ${line(x + fw / 2, y0 + 250, 27, fit(itemName(it, lang), 24), 240, `text-anchor="middle" font-weight="800" fill="#1f2937" ${font}${dir}`)}
      ${line(x + fw / 2, y0 + 292, 23, t(`games.rarity.${s.rarity}`), 240, `text-anchor="middle" font-weight="700" fill="#64748b" ${font}${dir}`)}</g>`;
  }).join("");
  // Zbirke: skupaj, stopnja passa (vsaka v svoji vrstici) in po zbirkah (dva stolpca).
  const total = line(W / 2, 1004, 36, t("share.cardTotal", { n: m.total.n, of: m.total.of }), 960, mid);
  const pass = line(W / 2, 1048, 28, t("zb.passLevel", { tier: m.pass.tier, tiers: m.pass.tiers }), 960, mid.replace('fill="#ffffff"', 'fill="#c7d2fe"'));
  const colW = 440, rowH = 52, cy0 = 1084;
  const rows = m.collections
    .map((c, i) => {
      const meta = COLLECTIONS.find((x) => x.id === c.id);
      const col = i % 2, row = Math.floor(i / 2);
      const cx = (W - 2 * colW - 40) / 2 + (rtl ? 1 - col : col) * (colW + 40);
      const y = cy0 + row * rowH;
      const pct = c.of ? c.n / c.of : 0;
      const [a, b] = rtl ? [cx + colW, cx] : [cx, cx + colW];
      return `${line(a, y + 22, 24, fit(itemName(meta, lang), 30), colW - 90, `text-anchor="start" font-weight="700" fill="#e0e7ff" ${font}${dir}`)}
        <text x="${b}" y="${y + 22}" text-anchor="end" font-size="24" font-weight="800" fill="#ffffff" ${font}${dir}>${c.n}/${c.of}</text>
        <rect x="${cx}" y="${y + 32}" width="${colW}" height="8" rx="4" fill="#ffffff" fill-opacity=".18"/>
        <rect x="${rtl ? cx + colW * (1 - pct) : cx}" y="${y + 32}" width="${Math.round(colW * pct)}" height="8" rx="4" fill="#4ade80"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${CARD_H}" viewBox="0 0 ${W} ${CARD_H}">
<defs><linearGradient id="card-bg" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0f172a"/></linearGradient>${defs}</defs>
<rect width="${W}" height="${CARD_H}" fill="url(#card-bg)"/>
<circle cx="140" cy="1180" r="260" fill="#6366f1" opacity=".12"/><circle cx="960" cy="200" r="220" fill="#22d3ee" opacity=".10"/>
${head}${avatar}${title}${slots}${total}${pass}${rows}</svg>`;
}

// PNG iz SVG prek canvasa (samo v brskalniku).
export async function shareCardPng(svg) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise((ok, fail) => {
      img.onload = ok;
      img.onerror = () => fail(new Error("svg"));
      img.src = url;
    });
    const c = document.createElement("canvas");
    c.width = CARD_W;
    c.height = CARD_H;
    c.getContext("2d").drawImage(img, 0, 0, CARD_W, CARD_H);
    return await new Promise((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("png"))), "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Deli sliko (Web Share API z datotekami) ali jo prenese. Vrne "shared", "downloaded" ali "cancelled".
export async function shareCardFile(blob, { name = "zbirka.png", title = "" } = {}) {
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return "downloaded";
}
