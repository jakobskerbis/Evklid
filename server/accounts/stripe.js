// Tanek odjemalec za Stripe REST API (brez dodatne knjižnice) in preverjanje webhookov.
import crypto from "node:crypto";
import { plansFor, planByKey, SCHOOL_PLANS } from "./plans.js";

// Stripe GET /prices sprejme največ 10 lookup_keys naenkrat.
const LOOKUP_CHUNK = 10;

const API = "https://api.stripe.com/v1";

// {a: {b: 1}, c: [{d: 2}], e: ["x"]} -> a[b]=1&c[0][d]=2&e[0]=x
export function formEncode(obj, prefix = "", out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") formEncode(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

export class Stripe {
  constructor({ secretKey = process.env.STRIPE_SECRET_KEY, fetchFn = globalThis.fetch, kv } = {}) {
    this.key = secretKey;
    this.fetch = fetchFn;
    this.kv = kv; // { get(key), set(key, value) }
  }
  get enabled() {
    return !!this.key;
  }
  // Testni način (ključ sk_test_ ali rk_test_): j še nima s.p., zato nadgradnja s proracijo deluje samo v
  // testnem načinu, razen če EVKLID_STRIPE_LIVE_UPGRADE=1 (server/accounts/index.js, /api/billing/upgrade).
  get testMode() {
    return /^(sk|rk)_test_/.test(String(this.key || ""));
  }
  async request(method, path, params) {
    if (!this.key) throw new Error("STRIPE_SECRET_KEY ni nastavljen.");
    let url = API + path;
    const init = { method, headers: { Authorization: `Bearer ${this.key}`, "Stripe-Version": "2024-06-20" } };
    if (params && method === "GET") url += "?" + formEncode(params).toString();
    else if (params) {
      init.headers["Content-Type"] = "application/x-www-form-urlencoded";
      init.body = formEncode(params).toString();
    }
    // Največ 60 s na klic (točka A7): obdelava dogodka Stripe mora končati precej pred PREVZEM_MS (5 min), sicer bi
    // jo ponovna dostava prevzela in izvedla še enkrat (privzeta meja fetch je 300 s za glave in 300 s za telo).
    const res = await this.fetch(url, { ...init, signal: AbortSignal.timeout(60_000) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(body?.error?.message || `Stripe ${res.status}`);
      err.status = res.status;
      err.stripe = body?.error;
      throw err;
    }
    return body;
  }

  // Izdelek in cene v valuti (po lookup_key; v evrih 10 cen: stopnje in družinska paketa). Ustvari jih, če manjkajo.
  // EUR: cene iz PLANS; regijske valute (INR, NGN …) imajo svoje cene istega izdelka.
  // Če se znesek spremeni, ustvari novo ceno (lookup_key se prenese nanjo)
  // in staro arhivira; obstoječe naročnine ostanejo pri stari ceni.
  // extra: { plans, cacheKey } za cene zunaj portala (Osebno ob šolski licenci), na istem izdelku.
  async ensurePrices(currency = "EUR", extra = null) {
    const cacheKey = extra?.cacheKey || (currency === "EUR" ? "stripe_prices" : `stripe_prices_${currency}`);
    const plans = extra?.plans || plansFor(currency);
    const amounts = Object.fromEntries(plans.map((p) => [p.key, p.amount]));
    const cached = this.kv?.get(cacheKey);
    if (cached) {
      const c = JSON.parse(cached);
      if (JSON.stringify(c.amounts) === JSON.stringify(amounts)) return c;
    }
    const data = [];
    const keys = plans.map((p) => p.key);
    for (let i = 0; i < keys.length; i += LOOKUP_CHUNK) {
      const found = await this.request("GET", "/prices", { lookup_keys: keys.slice(i, i + LOOKUP_CHUNK), active: "true", limit: 100 });
      data.push(...(found.data || []));
    }
    const existing = Object.fromEntries(data.map((p) => [p.lookup_key, p]));
    let product = data[0]?.product;
    if (!product && (currency !== "EUR" || extra)) product = (await this.ensurePrices("EUR")).product;
    if (!product) {
      product = (await this.request("POST", "/products", { name: "Evklid", description: "AI inštruktor za matematiko, fiziko in kemijo" })).id;
    }
    const byKey = {};
    for (const plan of plans) {
      const old = existing[plan.key];
      if (old && old.unit_amount === plan.amount) {
        byKey[plan.key] = old.id;
        continue;
      }
      const price = await this.request("POST", "/prices", {
        product,
        currency: currency.toLowerCase(),
        unit_amount: plan.amount,
        tax_behavior: "inclusive",
        lookup_key: plan.key,
        transfer_lookup_key: old ? true : undefined,
        nickname: currency === "EUR" ? plan.label : `${plan.label} (${currency})`,
        recurring: { interval: plan.interval },
        metadata: { seats: plan.seats },
      });
      byKey[plan.key] = price.id;
      if (old) {
        await this.request("POST", `/prices/${old.id}`, { active: false });
      }
    }
    const result = { product, prices: byKey, amounts };
    this.kv?.set(cacheKey, JSON.stringify(result));
    return result;
  }

  // Cene Osebno ob šolski licenci (niso v portalu za preklop paketa).
  ensureSchoolPrices() {
    return this.ensurePrices("EUR", { plans: SCHOOL_PLANS, cacheKey: "stripe_prices_sola" });
  }

  // Nastavitve portala za stranke: odpoved, kartica, računi in preklop paketa samo med mesečnim in letnim
  // obdobjem ISTEGA paketa (planKey = sedanji paket naročnine). Ena konfiguracija na paket: portal z vsemi cenami bi
  // dovolil npr. preklop s faksa na ceno OŠ s proracijo ob ohranjenem faksu. Stari paket »2 otroka«, neznan paket
  // in račun brez naročnine: brez preklopa. Ključ predpomnilnika vsebuje id-ja cen, zato nova cena (ensurePrices)
  // samodejno ustvari novo konfiguracijo.
  async ensurePortalConfig(planKey = null) {
    const plan = planByKey(planKey);
    let product = null;
    let prices = [];
    if (plan && !plan.legacy) {
      const set = plan.school ? await this.ensureSchoolPrices() : await this.ensurePrices(plan.currency || "EUR");
      const month = plan.key.replace(/_year(?=$|_)/, "_month");
      const year = month.replace(/_month(?=$|_)/, "_year");
      prices = [set.prices[month], set.prices[year]].filter(Boolean);
      product = set.product;
    }
    const swap = prices.length === 2;
    const cacheKey = `stripe_portal_config:${swap ? prices.join(",") : "brez_preklopa"}`;
    const cached = this.kv?.get(cacheKey);
    if (cached) return cached;
    const conf = await this.request("POST", "/billing_portal/configurations", {
      business_profile: { headline: "Evklid – upravljanje naročnine" },
      features: {
        customer_update: { enabled: true, allowed_updates: ["email", "address", "name"] },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: { enabled: true, mode: "at_period_end" },
        subscription_update: swap
          ? { enabled: true, default_allowed_updates: ["price"], proration_behavior: "create_prorations", products: [{ product, prices }] }
          : { enabled: false },
      },
    });
    this.kv?.set(cacheKey, conf.id);
    return conf.id;
  }
}

// Preverjanje podpisa Stripe-Signature: t=…,v1=…
export function verifyWebhook(rawBody, header, secret, toleranceSec = 300, now = Date.now()) {
  if (!secret || !header) return false;
  let t = null;
  const sigs = [];
  for (const item of String(header).split(",")) {
    const [k, v] = item.split("=");
    if (k === "t") t = Number(v);
    if (k === "v1") sigs.push(v);
  }
  if (!t || !sigs.length || Math.abs(now / 1000 - t) > toleranceSec) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

export function signWebhook(rawBody, secret, t = Math.floor(Date.now() / 1000)) {
  const v1 = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return `t=${t},v1=${v1}`;
}
