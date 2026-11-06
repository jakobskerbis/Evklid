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
  const json = (k, d) => {
    try {
      return JSON.parse(kv.get(k) || "null") ?? d;
    } catch {
      return d;
    }
  };
  const refunds = (parentId) => json(`ai_paid_refunds_${parentId}`, {});
  const loadBal = (parentId) => {
    const b = json(`ai_paid_bal_${parentId}`, null);
    return b && typeof b === "object" ? { credit: Number(b.credit) || 0, inv: b.inv || {} } : { credit: 0, inv: {} };
  };
  const saveBal = (parentId, b) => {
    const ids = Object.keys(b.inv);
    if (ids.length > MAX_ROWS) for (const id of ids.slice(0, ids.length - MAX_ROWS)) delete b.inv[id];
    kv.set(`ai_paid_bal_${parentId}`, JSON.stringify(b));
  };
  return {
    // Plačan račun naročnine (invoice.paid): vrstice tega računa zamenjajo prejšnji zapis istega računa.
    // Vračilo istega računa ostane (pregled #462 H3/K3-3: ponovljen ali zakasnel invoice.paid ga ne izbriše).
    // Dobroimetje stranke: račun, plačan z dobroimetjem, ki ni prišlo iz denarja (nagrada za priporočilo, ročni
    // dobropis), ne šteje kot plačilo (H2/K3-2, j: mesec za priporočilo = meja aktivacijske kode). Dobroimetje iz
    // denarja (proracija: račun z negativnim zneskom, npr. preklop letno → mesečno) šteje, ker ga negativna vrstica
    // že odšteje (ai_paid_bal_<račun>).
    record(parentId, inv, opts = {}) {
      const sub = typeof inv?.subscription === "string" ? inv.subscription : inv?.subscription?.id || inv?.parent?.subscription_details?.subscription || null;
      if (!parentId || !sub || !inv?.id) return 0;
      const old = load(parentId);
      const refunded = Math.max(refunds(parentId)[inv.id] || 0, ...old.filter((r) => r.inv === inv.id).map((r) => r.refunded || 0));
      let rows = invoiceRows(inv, opts).map((r) => ({ ...r, sub, inv: inv.id, refunded }));
      // Dobroimetje: starting/ending_balance v najmanjših enotah (negativno = dobroimetje stranke).
      const bal = loadBal(parentId);
      const prev = bal.inv[inv.id];
      if (prev) bal.credit += (prev.usedReal || 0) - (prev.added || 0);
      const delta = (Number(inv.ending_balance) || 0) - (Number(inv.starting_balance) || 0);
      const effect = { added: 0, usedReal: 0 };
      if (delta < 0) {
        effect.added = -delta; // račun z negativnim zneskom: dobroimetje iz proracije (pravi denar)
        bal.credit += effect.added;
      } else if (delta > 0) {
        effect.usedReal = Math.min(bal.credit, delta);
        bal.credit -= effect.usedReal;
        const fake = delta - effect.usedReal;
        const pos = rows.reduce((t, r) => t + Math.max(0, r.cents), 0);
        if (fake > 0 && pos > 0) {
          const k = Math.max(0, 1 - fake / pos);
          rows = rows.map((r) => (r.cents > 0 ? { ...r, eur: r.eur * k, cents: Math.round(r.cents * k) } : r));
        }
      }
      bal.inv[inv.id] = effect;
      saveBal(parentId, bal);
      save(parentId, [...old.filter((r) => r.inv !== inv.id), ...rows]);
      return rows.length;
    },
    // Vračilo (charge.refunded) dela računa: delež vrnjenega zmanjša denar vseh vrstic tega računa. Shrani se tudi,
    // ko računa še ni (vračilo pred invoice.paid), in velja ob poznejšem zapisu.
    refund(parentId, invoiceId, fraction) {
      const f = Math.min(1, Math.max(0, Number(fraction) || 0));
      const all = refunds(parentId);
      all[invoiceId] = Math.max(all[invoiceId] || 0, f);
      const ids = Object.keys(all);
      if (ids.length > MAX_ROWS) for (const id of ids.slice(0, ids.length - MAX_ROWS)) if (id !== invoiceId) delete all[id];
      kv.set(`ai_paid_refunds_${parentId}`, JSON.stringify(all));
      const list = load(parentId);
      let hit = 0;
      for (const r of list) if (r.inv === invoiceId) (r.refunded = Math.max(r.refunded || 0, f)), hit++;
      if (hit) save(parentId, list);
      return hit || 1;
    },
    // Konec zadnjega plačanega obdobja naročnine sub (ms) ali 0.
    lastEnd(parentId, sub) {
      return load(parentId).reduce((t, r) => (r.sub === sub ? Math.max(t, r.end) : t), 0);
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
