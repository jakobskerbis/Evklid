// Ime skupine prijateljev ali razreda vidijo drugi otroci (lestvica, kviz, vitrina), zato v njem ni kontaktov:
// e-naslov ali @vzdevek, telefonska številka, povezava, profil na družbenih omrežjih, klepetalnicah ali pri ponudniku e-pošte.
// Uporabljata ga strežnik (server/leagues.js, server/schools.js) in odjemalec (opozorilo pred pošiljanjem).
// Raje kakšno ime zavrnemo preveč: učenec ali učitelj ga preprosto prepiše (npr. »8.b«, »Matematiki 2025/26«).

const SOCIAL =
  /(?:^|[^a-z])(?:snap(?:chat)?|insta(?:gram)?|tik ?tok|discord|whats ?app|telegram|viber|messenger|facebook|kik|wechat|onlyfans|twitch|reddit|threads|bereal|roblox|signal ?app|youtube|yt|twitter|skype|line|pinterest|gmail|hotmail|outlook|yahoo|icloud|gmx|siol|proton(?:mail)?)(?![a-z])|(?:^|[^a-z])(?:ig|fb|sc|wa|dc|tg|yt)\s*[:=]|^(?:ig|fb|dc|tg|yt)\s+(?!\p{Nd}{1,2}\.?\s*\p{L}?(?:\s|$))\S|#\d{4}(?!\d)|инста|телеграм|вайбер|ватсап|снап|тикток|дискорд/u;
const URL = /https?:|www\.|(?:^|[^a-z0-9])[a-z0-9-]+\s*(?:\.|\(dot\)|\[dot\])\s*(?:com|net|org|si|io|gg|me|ly|link|app|hr|rs|ba|mk|at|de|it|ru|eu|xyz|co|tv|info|biz|ai|be|gl|cc|su|ws|uk|us|ch)(?![\p{L}\p{N}])/u;
// @ v vseh oblikah (tudi polna širina ＠ – NFKC), e-naslov z »(at)«.
const AT = /@|\(at\)|\[at\]|\(a\)/u;

// Znaki, ki jih ne vidimo: znaki brez širine, mehki vezaj, smerne oznake, okvirji tipk (emoji števk), izbirniki različic.
// Za shranjevanje ostane ZWNJ (U+200C), ki ga perzijščina potrebuje v besedah.
const INVISIBLE = /(?!\u200c)[\p{Cf}\p{Me}\ufe0e\ufe0f]/gu;
export const stripInvisible = (s) => String(s ?? "").replace(INVISIBLE, "");

// Telefon (števke katere koli pisave): »+« ali »00« in vsaj 7 števk ali vsaj 9 števk v enem nizu s presledki, pikami, vezaji, pomišljaji,
// podčrtaji, vejicami in oklepaji (041 123 456, 041_123_456, 01 234 56 78). Poševnica ni ločilo: »2025/2026 7.a«.
// Šolsko leto (zaporedni leti: »2025-2026«, »2025.–2026.«, »2025/26«) ni telefon: »2025-2026 7.a«, »Odeljenje 7-3 2025-2026«.
const SCHOOL_YEAR = /(?<!\p{Nd})((?:19|20)\d\d)\.?(?:\s*[-/_.\p{Pd}]\s*|\s+)((?:19|20)?\d\d)\.?(?!\p{Nd})/gu;
function hasPhone(s) {
  s = s.replace(SCHOOL_YEAR, (m, a, b) => ((+b.slice(-2) - +a.slice(-2) + 100) % 100 === 1 ? " " : m));
  for (const m of s.matchAll(/(?:\+|00)?\p{Nd}[\p{Nd}\s().\-_,\p{Pd}]*\p{Nd}/gu)) {
    const digits = m[0].replace(/\P{Nd}/gu, "").length;
    if (digits >= 9 || (/^(?:\+|00)/.test(m[0]) && digits >= 7)) return true;
  }
  return false;
}

const HOMOGLYPH = { а: "a", е: "e", о: "o", р: "p", с: "c", у: "y", х: "x", і: "i", ј: "j", ѕ: "s", ԁ: "d", ο: "o", α: "a", ι: "i", ρ: "p", ν: "v", κ: "k", τ: "t" };

export function nameHasContact(name) {
  // NFKC (polna širina, krožne števke), brez nevidnih in kombiniranih znakov (»snap« z mehkim vezajem, »insta« z znakom brez širine); števke vseh pisav (٠٤١…)
  // šteje hasPhone (\p{Nd}).
  const s = String(name ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\p{Cf}\p{Mn}\p{Me}]/gu, "");
  if (!s) return false;
  // Cirilične in grške črke, ki so videti latinske (»instа« s cirilskim а), v besedah z latinico: za latinske vzorce jih zamenjamo.
  // Besed samo v cirilici ali grščini ne spreminjamo (»Путници« ni »yt«).
  const l = s.replace(/[\p{L}\p{N}]+/gu, (w) => (/[a-z]/.test(w) ? w.replace(/[аеорсухіјѕԁοαιρνκτ]/gu, (c) => HOMOGLYPH[c]) : w));
  return AT.test(s) || URL.test(l) || SOCIAL.test(s) || SOCIAL.test(l) || hasPhone(s);
}

export const NAME_CONTACT_ERROR = "Ime naj ne vsebuje e-naslova, telefona, povezave ali profila na omrežjih.";
