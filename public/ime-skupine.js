// Ime skupine prijateljev ali razreda vidijo drugi otroci (lestvica, kviz, vitrina), zato v njem ni kontaktov:
// e-naslov ali @vzdevek, telefonska številka, povezava, profil na družbenih omrežjih ali klepetalnicah.
// Uporabljata ga strežnik (server/leagues.js, server/schools.js) in odjemalec (opozorilo pred pošiljanjem).
// Raje kakšno ime zavrnemo preveč: učenec ali učitelj ga preprosto prepiše (npr. »8.b«, »Matematiki 2025/26«).

const SOCIAL =
  /(?:^|[^a-z])(?:snap(?:chat)?|insta(?:gram)?|tik ?tok|discord|whats ?app|telegram|viber|messenger|facebook|kik|wechat|onlyfans|twitch|reddit|threads|bereal|roblox|steam|signal ?app)(?![a-z])|(?:^|[^a-z])(?:ig|fb|sc|wa|dc|tg)\s*[:=]|инста|телеграм|вайбер|ватсап|снап|тикток|дискорд/u;
const URL = /https?:|www\.|(?:^|[^a-z0-9])[a-z0-9-]+\s*(?:\.|\(dot\)|\[dot\])\s*(?:com|net|org|si|io|gg|me|ly|link|app|hr|rs|ba|mk|at|de|it|ru|eu|xyz|co|tv|info|biz)(?![a-z])/u;
// @ v vseh oblikah (tudi polna širina ＠ – NFKC), e-naslov z »(at)«.
const AT = /@|\(at\)|\[at\]/u;

// Telefon: »+« ali »00« in vsaj 7 števk ali vsaj 9 števk v enem nizu s presledki, pikami, vezaji in oklepaji
// (041 123 456, 01 234 56 78). Leto ali šolsko leto (2025 2026, 2025/26) ima manj števk.
function hasPhone(s) {
  for (const m of s.matchAll(/(?:\+|00)?\d[\d\s().\-]*\d/g)) {
    const digits = m[0].replace(/\D/g, "").length;
    if (digits >= 9 || (/^(?:\+|00)/.test(m[0]) && digits >= 7)) return true;
  }
  return false;
}

export function nameHasContact(name) {
  const s = String(name ?? "").normalize("NFKC").toLowerCase();
  if (!s) return false;
  return AT.test(s) || URL.test(s) || SOCIAL.test(s) || hasPhone(s);
}

export const NAME_CONTACT_ERROR = "Ime naj ne vsebuje e-naslova, telefona, povezave ali profila na omrežjih.";
