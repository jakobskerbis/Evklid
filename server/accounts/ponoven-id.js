// id računa (parents.id, INTEGER PRIMARY KEY brez AUTOINCREMENT) dobi po izbrisu naslednji nov račun. Dogodek Stripa,
// ki račun najde samo po id v metapodatkih (metadata.parent_id, client_reference_id), zato lahko pripada izbrisanemu
// računu: A odpre plačilo, izbriše račun, B dobi isti id, A plača → B bi dobil A-jevo naročnino (pregled #505 A, P2-2).
// Račun iz metapodatkov velja samo, če je bil ustvarjen pred predmetom Stripa (seja, naročnina: obj.created).

const createdMs = (p) => {
  const s = String(p?.created_at || "");
  // datetime('now') v SQLite: »YYYY-MM-DD HH:MM:SS« v UTC, brez oznake pasu.
  return Date.parse(/[zZ]$|[+-]\d\d:?\d\d$/.test(s) ? s : `${s.replace(" ", "T")}Z`);
};

// true: račun je lahko lastnik predmeta (ustvarjen najkasneje v isti sekundi). Brez obj.created (stari ali ročni
// dogodki) ali brez berljivega created_at ostane kot prej.
export function ownsStripeObject(p, obj) {
  if (!p) return false;
  const created = Number(obj?.created);
  const at = createdMs(p);
  if (!Number.isFinite(created) || created <= 0 || !Number.isFinite(at)) return true;
  return at <= created * 1000 + 999;
}

// Račun po id iz metapodatkov ali null (z zapisom v dnevnik, ko id zdaj pripada mlajšemu računu: plačilo izbrisanega
// računa, ki ga je treba vrniti ročno v Stripu).
export function parentFromMeta(getParent, id, obj, log, what = "dogodek") {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  const p = getParent(n);
  if (!p) return null;
  if (ownsStripeObject(p, obj)) return p;
  log?.error?.(`[evklid] Stripe ${what} za izbrisan račun (id ${n} ima zdaj nov račun); ni pripisano, preveri v Stripu`, obj?.id || "");
  return null;
}
