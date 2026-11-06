// Dejansko plačilo naročnine po obdobjih (j 2026-11-06 12:53, pregled #462 A2): meja AI in vračilo iz tega, kar je
// kupec za obdobje res plačal brez DDV (promocijske kode Stripa, proracije, delna vračila), ne iz cenika.
//
// Ob invoice.paid se vsaka vrstica računa naročnine zapiše z obdobjem (period.start–end) in zneskom brez DDV in popustov
// v €; proracije (tudi negativne, npr. preklop letno → mesečno) imajo svoje obdobje. Denar okna meje je vsota vrstic,
// razporejena po času: znesek × prekrivanje z oknom / dolžina obdobja vrstice. Zapis je v kv (ai_paid_<račun>).
import { vatRateFor, eurPerUnitNow, currencyDecimals } from "../accounts/plans.js";

const KEEP_DAYS = 400; // dlje od najdaljšega obdobja (leto) + rok za odstop
const MAX_ROWS = 200;
const sum = (list, f = (x) => x) => (Array.isArray(list) ? list : []).reduce((t, x) => t + (Number(f(x)) || 0), 0);

// Vrstice računa naročnine: [{ start, end, eur, cents }] (ms; eur brez DDV in popustov; cents z DDV, za vračilo).
// country: država kupca (račun, sicer profil starša), za DDV, kadar ga Stripe na računu ne izračuna.
export function invoiceRows(inv, { country = null, addonCents = 0 } = {}) {
  const cur = String(inv?.currency || "eur").toUpperCase();
  const unit = 10 ** currencyDecimals(cur);
  const rate = cur === "EUR" ? 1 : eurPerUnitNow(cur);
  if (!rate) return [];
  const vat = vatRateFor(inv?.customer_address?.country || country);
  let addon = Math.max(0, Number(addonCents) || 0);
  const rows = [];
  for (const l of inv?.lines?.data || []) {
    const start = Number(l?.period?.start) * 1000;
    const end = Number(l?.period?.end) * 1000;
    if (!(end > start)) continue;
    // Popusti (promocijske kode): discount_amounts (starejši API) ali pretax_credit_amounts vrste discount.
    const discount = sum(l.discount_amounts, (d) => d.amount) + sum(l.pretax_credit_amounts, (d) => (d.type === "discount" ? d.amount : 0));
    let gross = (Number(l.amount) || 0) - discount;
    // Stari dodatek »Podari« ni plačilo naročnine (server/placila/podari.js addonOf): odštejemo ga pri prvi vrstici.
    if (addon > 0 && gross > 0) {
      const cut = Math.min(addon, gross);
      gross -= cut;
      addon -= cut;
    }
    // DDV: iz računa (Stripe Tax: tax_amounts / taxes, vključen v ceno ali dodan), sicer po državi kupca.
    const taxes = [...(l.tax_amounts || []).map((t) => ({ amount: t.amount, inclusive: t.inclusive })), ...(l.taxes || []).map((t) => ({ amount: t.amount, inclusive: t.tax_behavior === "inclusive" }))];
    const net = taxes.length ? gross - sum(taxes.filter((t) => t.inclusive), (t) => t.amount) : gross / (1 + vat);
    const paid = taxes.length ? gross + sum(taxes.filter((t) => !t.inclusive), (t) => t.amount) : gross;
    rows.push({ start, end, eur: (net / unit) * rate, cents: Math.round(paid), currency: cur });
  }
  return rows;
}

export function createPaidPeriods(kv) {
  const key = (parentId) => `ai_paid_${parentId}`;
  const load = (parentId) => {
    try {
      const v = JSON.parse(kv.get(key(parentId)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };
  const save = (parentId, list, now = Date.now()) => {
    const keep = list.filter((r) => r.end > now - KEEP_DAYS * 86400000).slice(-MAX_ROWS);
    kv.set(key(parentId), JSON.stringify(keep));
  };
  return {
    // Plačan račun naročnine (invoice.paid): vrstice tega računa zamenjajo prejšnji zapis istega računa.
    record(parentId, inv, opts = {}) {
      const sub = typeof inv?.subscription === "string" ? inv.subscription : inv?.subscription?.id || inv?.parent?.subscription_details?.subscription || null;
      if (!parentId || !sub || !inv?.id) return 0;
      const rows = invoiceRows(inv, opts).map((r) => ({ ...r, sub, inv: inv.id, refunded: 0 }));
      save(parentId, [...load(parentId).filter((r) => r.inv !== inv.id), ...rows]);
      return rows.length;
    },
    // Vračilo (charge.refunded) dela računa: delež vrnjenega zmanjša denar vseh vrstic tega računa.
    refund(parentId, invoiceId, fraction) {
      const f = Math.min(1, Math.max(0, Number(fraction) || 0));
      const list = load(parentId);
      let hit = 0;
      for (const r of list) if (r.inv === invoiceId) (r.refunded = f), hit++;
      if (hit) save(parentId, list);
      return hit;
    },
    // Ali je za naročnino sub zapisano kakšno plačilo (sicer velja cenik, npr. naročnine pred to spremembo).
    has(parentId, sub) {
      return load(parentId).some((r) => r.sub === sub);
    },
    // Denar brez DDV v € za okno [start, end) naročnine sub (vrstice po času, brez vrnjenega dela):
    // { eur, rows } (rows = število vrstic, ki okno prekrivajo; 0 = za okno ni zapisa).
    eurIn(parentId, sub, start, end) {
      let eur = 0;
      let rows = 0;
      for (const r of load(parentId)) {
        if (r.sub !== sub) continue;
        const overlap = Math.min(end, r.end) - Math.max(start, r.start);
        if (overlap > 0) {
          eur += r.eur * (1 - (r.refunded || 0)) * (overlap / (r.end - r.start));
          rows++;
        }
      }
      return { eur: Math.max(0, eur), rows };
    },
    // Plačano z DDV (najmanjše enote valute) za obdobje [start, end), za izračun vračila ob odstopu.
    centsIn(parentId, sub, start, end) {
      let cents = 0;
      let currency = null;
      for (const r of load(parentId)) {
        if (r.sub !== sub) continue;
        const overlap = Math.min(end, r.end) - Math.max(start, r.start);
        if (overlap > 0) {
          cents += r.cents * (1 - (r.refunded || 0)) * (overlap / (r.end - r.start));
          currency = r.currency;
        }
      }
      return { cents: Math.max(0, Math.floor(cents)), currency };
    },
  };
}
