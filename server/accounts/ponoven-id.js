// id računa (parents.id, INTEGER PRIMARY KEY brez AUTOINCREMENT) dobi po izbrisu naslednji nov račun. Dogodek Stripa,
// ki račun najde samo po id v metapodatkih (metadata.parent_id, client_reference_id), zato lahko pripada izbrisanemu
// računu: A odpre plačilo, izbriše račun, B dobi isti id, A plača → B bi dobil A-jevo naročnino (pregled #505 A, P2-2).
//
// Zato vsako plačilo nosi tudi metadata.parent_uid (parents.uid: naključen, se ne ponovi; pregled #511 A, P1-1) in
// velja samo ob enakem uid. Stari predmeti brez uid (seje, odprte pred namestitvijo; potečejo v 24 h): samo seja
// Checkout in samo, če je račun starejši od nje. Naročnino Stripe ustvari šele ob plačilu (sub.created je po računu B),
// zato stara naročnina brez uid velja samo za račun, starejši od sub.created − 24 h (rok seje). Prava naročnina se
// sicer najde po stranki (parentByCustomer).

const createdMs = (p) => {
  const s = String(p?.created_at || "");
  // datetime('now') v SQLite: »YYYY-MM-DD HH:MM:SS« v UTC, brez oznake pasu.
  return Date.parse(/[zZ]$|[+-]\d\d:?\d\d$/.test(s) ? s : `${s.replace(" ", "T")}Z`);
};

// Zamik ure med strežnikom in Stripom (napad zahteva izbris in nov račun, kar traja dlje; pregled #511 A, P3-2).
const CLOCK_SKEW_MS = 5 * 60 * 1000;
// Najdaljša veljavnost seje Checkout (Stripe: 24 h).
const SESSION_MAX_S = 24 * 3600;

// true: račun je lahko lastnik predmeta (ustvarjen najkasneje ob njem, z zamikom ure). Brez obj.created ali brez
// berljivega created_at ostane kot prej.
export function ownsStripeObject(p, obj) {
  if (!p) return false;
  const created = Number(obj?.created);
  const at = createdMs(p);
  if (!Number.isFinite(created) || created <= 0 || !Number.isFinite(at)) return true;
  return at <= created * 1000 + CLOCK_SKEW_MS;
}

// Ali je plačilo (seja, naročnina) res od računa p. uid: metadata.parent_uid predmeta (ali seje, ki ga je ustvarila).
// Vrne null (velja) ali razlog za zapis neujemanja.
export function ownerMismatch(p, obj) {
  if (!p) return "racun_ne_obstaja";
  const uid = obj?.metadata?.parent_uid;
  if (uid) return p.uid && String(uid) === String(p.uid) ? null : "drug_racun";
  // Stripe vedno pošlje object; seja brez njega je le v starih testih in ročnih klicih.
  if (!obj?.object || obj.object === "checkout.session") return ownsStripeObject(p, obj) ? null : "drug_racun";
  // Stara naročnina brez uid: nastane ob plačilu seje, ki je bila odprta največ 24 h prej (rok seje Checkout).
  // Račun, starejši od tega roka, je obstajal že ob odprtju seje; mlajši (morda B z istim id) ne velja.
  const created = Number(obj.created);
  return ownsStripeObject(p, Number.isFinite(created) && created > 0 ? { created: created - SESSION_MAX_S } : obj) ? null : "brez_uid";
}

// Enkratni nakup (paket pred testom, dokup): vrstica (passes, ai_credit_buys) ima id INTEGER PRIMARY KEY in se ob
// izbrisu računa izbriše, zato lahko isti id dobi nakup novega računa (pregled #511 A, P2-2). Velja samo ob enakem
// uid lastnika vrstice; star nakup brez uid: ista seja (checkout_id) ali vrstica ni mlajša od seje (ponoven klik na
// povezavi za plačilo uporabi isto vrstico z novo sejo). Vrne null (velja) ali razlog.
export function purchaseMismatch(row, owner, session) {
  if (!row) return "nakup_ne_obstaja";
  if (String(row.parent_id) !== String(session?.metadata?.parent_id)) return "drug_racun";
  const uid = session?.metadata?.parent_uid;
  if (uid) return owner?.uid && String(uid) === String(owner.uid) ? null : "drug_racun";
  if (row.checkout_id && row.checkout_id === session?.id) return null;
  return ownsStripeObject(row, session) ? null : "drug_racun";
}

// Račun po id iz metapodatkov ali null. Ob neujemanju zapis v dnevnik in (če je podan) unmatched(razlog, id):
// plačilo izbrisanega računa, ki ga je treba vrniti ročno v Stripu.
export function parentFromMeta(getParent, id, obj, log, what = "dogodek", unmatched = null) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  const p = getParent(n);
  const why = ownerMismatch(p, obj);
  if (!why) return p;
  log?.error?.(`[evklid] Stripe ${what}: račun ${n} ni lastnik (${why}); ni pripisano, preveri v Stripu`, obj?.id || "");
  unmatched?.(why, n);
  return null;
}

// Minimalen zapis neujemajočega se plačila v kv (stripe_unmatched:<id dogodka>), za ročno vračilo. Brez podatkov kartice
// in brez e-naslova: samo id-ji Stripa, znesek, vrsta in razlog. Napaka pri zapisu gre naprej (webhook odgovori 500,
// Stripe pošlje znova), zato dogodek ni označen kot obdelan brez zapisa.
export function unmatchedRecorder(kv, event) {
  return (reason, parentId = null) => {
    const o = event?.data?.object || {};
    const id = (typeof event?.id === "string" && event.id) || o.id || `brez-id-${Date.now()}`;
    const ref = (x) => (typeof x === "string" ? x : x?.id || null);
    kv.set(
      `stripe_unmatched:${String(id).slice(0, 100)}`,
      JSON.stringify({
        event: String(event?.type || ""),
        object: ref(o.id),
        customer: ref(o.customer),
        payment_intent: ref(o.payment_intent),
        subscription: o.object === "subscription" ? ref(o.id) : ref(o.subscription),
        amount: o.amount_total ?? o.amount_paid ?? null,
        currency: o.currency || null,
        kind: o.metadata?.kind || null,
        parent_id: parentId ?? (o.metadata?.parent_id || o.client_reference_id || null),
        reason: String(reason),
        at: new Date().toISOString(),
      }),
    );
  };
}
