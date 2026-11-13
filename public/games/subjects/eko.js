// Pojmi za igre: eko (glej README.md v tej mapi).
// Ekonomija, 1. letnik fakultete. Brez uvozov: pomožne funkcije so lokalne.

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
function mk(q, a, ws, fill) {
  a = String(a);
  const out = [];
  const seen = new Set([a]);
  const add = (w) => {
    if (w == null || w === "") return;
    const s = String(w);
    if (!seen.has(s) && !/NaN|undefined|Infinity/.test(s)) {
      seen.add(s);
      out.push(s);
    }
  };
  ws.forEach(add);
  for (let i = 0; out.length < 3 && fill && i < 80; i++) add(fill(i));
  // rezerva za številske odgovore: bližnja števila v istem zapisu
  const m = /^(−?)(\d+)([.,]\d+)?$/.exec(a);
  if (m) {
    const v = Number((m[1] ? "-" : "") + m[2] + (m[3] || "").replace(",", "."));
    const sep = (m[3] || "").startsWith(",") ? "," : ".";
    const dec = m[3] ? m[3].length - 1 : 0;
    const step = dec ? 10 ** -dec : 1;
    for (let i = 1; out.length < 3 && i < 40; i++) {
      const x = v + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * step;
      add((x < 0 ? "−" : "") + Math.abs(x).toFixed(dec).replace(".", sep));
    }
  }
  return { q, a, w: shuffle(out.slice(0, 3)) };
}
function bank(items, t, ctx) {
  let c = items.filter((x) => (t === 1 ? x[0] === 1 : t === 2 ? x[0] <= 2 : x[0] >= 2));
  if (!c.length) c = items;
  const it = pick(c);
  const [q, a, ...ws] = ctx.lang === "sl" ? it[1] : it[2];
  return mk(q, a, shuffle(ws));
}
const r2 = (x) => Math.round(x * 100) / 100;
const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9;
// znesek v evrih: sl »12,50 €«, en »€12.50«
function eur(ctx, x) {
  const v = r2(x);
  let s = ctx.num(Math.abs(v));
  if (/[.,]\d$/.test(s)) s += "0";
  const neg = v < 0 ? "−" : "";
  return ctx.lang === "sl" ? `${neg}${s} €` : `${neg}€${s}`;
}
// odstotek: sl »12,5 %«, en »12.5%«; sign doda »+« pri pozitivnih
function pct(ctx, x, sign = false) {
  const v = r2(x);
  const s = ctx.num(Math.abs(v));
  const sg = v < 0 ? "−" : sign && v > 0 ? "+" : "";
  return ctx.lang === "sl" ? `${sg}${s} %` : `${sg}${s}%`;
}
const yrs = (ctx, n) => (ctx.lang === "sl" ? `${n} ${n === 1 ? "leto" : n === 2 ? "leti" : n <= 4 ? "leta" : "let"}` : `${n} yr`);
// nadomestni napačni zneski: ± korak
const eurFill = (ctx, a, step) => (i) => eur(ctx, a + (i % 2 ? -1 : 1) * step * (1 + Math.floor(i / 2)));
const pctFill = (ctx, a, step, sign) => (i) => pct(ctx, a + (i % 2 ? -1 : 1) * step * (1 + Math.floor(i / 2)), sign);

// ---------- banke ----------
const MARKETS = [
  ["popolna konkurenca", "perfect competition"],
  ["monopolistična konk.", "monopolistic comp."],
  ["oligopol", "oligopoly"],
  ["monopol", "monopoly"],
];
// [stopnja, sl, en, struktura]
const MARKET_ITEMS = [
  [1, "En sam prodajalec brez bližnjih substitutov?", "A single seller, no close substitutes?", 3],
  [1, "Nekaj velikih, soodvisnih podjetij?", "A few large, interdependent firms?", 2],
  [1, "Veliko podjetij, enaki izdelki?", "Many firms, identical products?", 0],
  [1, "Veliko podjetij, diferencirani izdelki?", "Many firms, differentiated products?", 1],
  [1, "Trg pšenice (zelo veliko kmetov)?", "Wheat market (very many farmers)?", 0],
  [1, "Restavracije v velikem mestu?", "Restaurants in a big city?", 1],
  [1, "Podjetje je prejemnik cene?", "The firm is a price taker?", 0],
  [2, "Krivulja povpraševanja podjetja je vodoravna?", "The firm's demand curve is horizontal?", 0],
  [2, "Karteli in teorija iger?", "Cartels and game theory?", 2],
  [2, "Edini ponudnik vode v mestu?", "The only water supplier in a town?", 3],
  [1, "Mobilni operaterji v državi?", "Mobile network operators in a country?", 2],
  [2, "Frizerski saloni v mestu?", "Hair salons in a town?", 1],
  [3, "Najvišje vstopne ovire?", "Highest barriers to entry?", 3],
  [3, "Na dolgi rok P = min ATC?", "Long run: P = minimum ATC?", 0],
  [3, "Oglaševanje, blagovne znamke, prost vstop?", "Advertising, brands, free entry?", 1],
  [3, "Proizvajalci velikih potniških letal?", "Makers of large passenger jets?", 2],
  [3, "Na dolgi rok P = ATC > MC?", "Long run: P = ATC > MC?", 1],
];

const SHIFT_ANS = [
  ["P↑ Q↑", "P↑ Q↑"],
  ["P↓ Q↓", "P↓ Q↓"],
  ["P↓ Q↑", "P↓ Q↑"],
  ["P↑ Q↓", "P↑ Q↓"],
];
// [stopnja, sl, en, premik: 0 D↑, 1 D↓, 2 S↑, 3 S↓]
const SHIFTS = [
  [1, "Povpraševanje se poveča", "Demand increases", 0],
  [1, "Povpraševanje se zmanjša", "Demand decreases", 1],
  [1, "Ponudba se poveča", "Supply increases", 2],
  [1, "Ponudba se zmanjša", "Supply decreases", 3],
  [1, "Več kupcev na trgu", "More buyers in the market", 0],
  [1, "Nova, cenejša tehnologija", "New, cheaper technology", 2],
  [1, "Slaba letina (trg jabolk)", "Poor harvest (apple market)", 3],
  [1, "Dohodek ↑ (normalna dobrina)", "Income ↑ (normal good)", 0],
  [2, "Cena substituta ↑", "Price of a substitute ↑", 0],
  [2, "Cena komplementa ↑", "Price of a complement ↑", 1],
  [2, "Cena substituta ↓", "Price of a substitute ↓", 1],
  [2, "Cena komplementa ↓", "Price of a complement ↓", 0],
  [2, "Cena surovin ↑", "Input prices ↑", 3],
  [2, "Subvencija proizvajalcem", "Subsidy to producers", 2],
  [2, "Trošarina, ki jo plačajo proizvajalci", "Excise tax paid by producers", 3],
  [2, "Dobrina postane modna", "The good becomes fashionable", 0],
  [2, "Na trg vstopijo nova podjetja", "New firms enter the market", 2],
  [2, "Kupci pričakujejo podražitev", "Buyers expect higher prices", 0],
  [2, "Dohodek ↑ (inferiorna dobrina)", "Income ↑ (inferior good)", 1],
  [2, "Višje plače delavcev v panogi", "Higher wages in the industry", 3],
];
const BOTH = [
  ["D↑ in S↑ hkrati", "D↑ and S↑ together", 0],
  ["D↓ in S↓ hkrati", "D↓ and S↓ together", 1],
  ["D↑ in S↓ hkrati", "D↑ and S↓ together", 2],
  ["D↓ in S↑ hkrati", "D↓ and S↑ together", 3],
];
const BOTH_ANS = [
  ["Q↑, P nedoločena", "Q↑, P uncertain"],
  ["Q↓, P nedoločena", "Q↓, P uncertain"],
  ["P↑, Q nedoločena", "P↑, Q uncertain"],
  ["P↓, Q nedoločena", "P↓, Q uncertain"],
];

const UNEMP_TYPES = [
  ["frikcijska", "frictional"],
  ["strukturna", "structural"],
  ["ciklična", "cyclical"],
  ["sezonska", "seasonal"],
];
const UNEMP_ITEMS = [
  ["Brezposelnost med menjavo služb?", "Unemployment while changing jobs?", 0],
  ["Diplomant išče prvo službo?", "A graduate looking for a first job?", 0],
  ["Znanja ne ustrezajo prostim mestom?", "Skills don't match the vacancies?", 1],
  ["Panogo nadomesti avtomatizacija?", "An industry is replaced by automation?", 1],
  ["Brezposelnost zaradi recesije?", "Unemployment caused by a recession?", 2],
  ["Delavci v turizmu pozimi ob morju?", "Beach-resort workers in winter?", 3],
  ["Gradbeni delavci v hudi zimi?", "Construction workers in a harsh winter?", 3],
  ["Upade agregatno povpraševanje?", "Aggregate demand falls?", 2],
];

// [sl, en] ukrepi; skupine: 0 ekspanzivna fiskalna, 1 restriktivna fiskalna, 2 ekspanzivna denarna, 3 restriktivna denarna
const MEASURES = [
  [["nižji davki", "lower taxes"], ["višja javna poraba", "more gov. spending"], ["višji transferji", "higher transfers"]],
  [["višji davki", "higher taxes"], ["nižja javna poraba", "less gov. spending"], ["nižji transferji", "lower transfers"]],
  [["nižja obrestna mera", "lower interest rate"], ["nakup obveznic", "buying bonds"], ["nižja obv. rezerva", "lower reserve ratio"]],
  [["višja obrestna mera", "higher interest rate"], ["prodaja obveznic", "selling bonds"], ["višja obv. rezerva", "higher reserve ratio"]],
];
const POLICY_Q = [
  ["Ukrep ekspanzivne fiskalne politike?", "Expansionary fiscal policy measure?"],
  ["Ukrep restriktivne fiskalne politike?", "Contractionary fiscal policy measure?"],
  ["Ukrep ekspanzivne denarne politike?", "Expansionary monetary policy measure?"],
  ["Ukrep restriktivne denarne politike?", "Contractionary monetary policy measure?"],
];

export const AREAS = [
  ["ek_fin", { sl: "Odstotki, cene in obresti", en: "Percentages, prices and interest" }, "#ca8a04"],
  ["ek_pod", { sl: "Podjetje: stroški in prihodki", en: "The firm: costs and revenue" }, "#0d9488"],
  ["ek_mikro", { sl: "Trg: povpraševanje in ponudba", en: "Markets: supply and demand" }, "#4f46e5"],
  ["ek_makro", { sl: "Makroekonomija", en: "Macroeconomics" }, "#be123c"],
  ["ek_den", { sl: "Denar, banke in tečaji", en: "Money, banks and exchange rates" }, "#15803d"],
];

export const CONCEPTS = [
  {
    id: "e_pct",
    area: "ek_fin",
    year: 12,
    name: { sl: "Odstotna sprememba", en: "Percentage change" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const P = (x) => pct(ctx, x, true);
      if (t === 1) {
        const a = R(2, 20) * 20, p = pick([10, 20, 25, 50]), up = Math.random() < 0.5;
        const b = (a * (100 + (up ? p : -p))) / 100;
        const ch = up ? p : -p;
        return mk(sl ? `Cena ${eur(ctx, a)} → ${eur(ctx, b)}: sprememba?` : `Price ${eur(ctx, a)} → ${eur(ctx, b)}: change?`, P(ch), [P(Math.round(((b - a) / b) * 1000) / 10), P(-ch), isInt(b - a) && Math.abs(b - a) !== p ? P(b - a) : null, P(ch / 2), P(ch * 2)]);
      }
      if (t === 2) {
        const k = R(0, 2);
        if (k === 0) {
          const p = pick([10, 20, 30, 40, 50]);
          return mk(sl ? `+${p} %, nato −${p} %: skupaj?` : `+${p}%, then −${p}%: overall?`, P(-(p * p) / 100), [P(0), P((p * p) / 100), P(-p), P(-(p * p) / 50)]);
        }
        const [p, q] = pick([[10, 10], [20, 10], [10, 20], [20, 20], [50, 20], [10, 50], [50, 50], [20, 50], [30, 10]]);
        if (k === 1) {
          const r = ((100 + p) * (100 + q)) / 100 - 100;
          return mk(sl ? `+${p} %, nato še +${q} %: skupaj?` : `+${p}%, then +${q}%: overall?`, P(r), [P(p + q), P((p * q) / 100), P(r + 10), P(r - 1)]);
        }
        const r = ((100 - p) * (100 - q)) / 100 - 100;
        return mk(sl ? `−${p} %, nato še −${q} %: skupaj?` : `−${p}%, then −${q}%: overall?`, P(r), [P(-(p + q)), P(-(p * q) / 100), P(r - 10), P(r + 1)]);
      }
      const k = R(0, 2);
      if (k === 0) {
        const r1 = R(1, 8), d = pick([1, 2]);
        const r2_ = r1 + d;
        const rel = Math.round((d / r1) * 1000) / 10;
        const n = ctx.num;
        return mk(sl ? `Obrestna mera ${r1} % → ${r2_} %: za koliko odstotnih točk?` : `Rate ${r1}% → ${r2_}%: change in percentage points?`, n(d), [n(rel), n(r2_), n(d * 10), n(r1)]);
      }
      if (k === 1) {
        const orig = R(4, 40) * 10, p = pick([10, 20, 25, 50]);
        const now = (orig * (100 + p)) / 100;
        return mk(sl ? `Po podražitvi za ${p} % stane ${eur(ctx, now)}; prej?` : `After a ${p}% rise it costs ${eur(ctx, now)}; before?`, eur(ctx, orig), [eur(ctx, (now * (100 - p)) / 100), eur(ctx, now - p), eur(ctx, (now * 100) / (100 + 2 * p))], eurFill(ctx, orig, 5));
      }
      const [p, back] = pick([[20, 25], [50, 100], [60, 150], [75, 300], [80, 400], [10, 100 / 9]]);
      return mk(sl ? `Cena pade za ${p} %. Za koliko mora zrasti nazaj?` : `Price falls ${p}%. Rise needed to recover?`, P(back), [P(p), P(p / 2), P(back / 2), P(2 * p)], pctFill(ctx, back, 10, true));
    },
  },
  {
    id: "e_vat",
    area: "ek_fin",
    year: 12,
    name: { sl: "DDV in popusti", en: "VAT and discounts" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const E = (x) => eur(ctx, x);
      if (t === 1) {
        if (Math.random() < 0.5) {
          const k = R(1, 10), net = 50 * k;
          return mk(sl ? `Neto ${E(net)}, DDV 22 %: cena z DDV?` : `${E(net)} net, 22% VAT: price with VAT?`, E(61 * k), [E(11 * k), E(net + 22), E(net * 0.78), E(net * 1.2)], eurFill(ctx, 61 * k, 5));
        }
        const p = R(2, 20) * 10, d = pick([10, 20, 25, 50]);
        return mk(sl ? `${E(p)}, popust ${d} %: cena?` : `${E(p)}, ${d}% off: price?`, E((p * (100 - d)) / 100), [E((p * d) / 100), E(p - d), E((p * (100 + d)) / 100)], eurFill(ctx, (p * (100 - d)) / 100, 5));
      }
      if (t === 2) {
        const k = R(1, 10), gross = 61 * k, net = 50 * k;
        if (Math.random() < 0.5) return mk(sl ? `Cena z DDV ${E(gross)} (22 %): brez DDV?` : `${E(gross)} incl. 22% VAT: net price?`, E(net), [E(gross * 0.78), E(gross - 22), E(11 * k)], eurFill(ctx, net, 5));
        return mk(sl ? `Cena z DDV ${E(gross)} (22 %): koliko je DDV?` : `${E(gross)} incl. 22% VAT: VAT amount?`, E(11 * k), [E(gross * 0.22), E(net), E(22 * k)], eurFill(ctx, 11 * k, 2));
      }
      const m = R(0, 2);
      if (m === 0) {
        const p = R(2, 20) * 50, [d1, d2] = pick([[20, 10], [10, 10], [20, 20], [50, 20], [30, 10], [25, 20]]);
        const v = (p * (100 - d1) * (100 - d2)) / 10000;
        return mk(sl ? `${E(p)}: popust ${d1} %, nato še ${d2} %: cena?` : `${E(p)}: ${d1}% off, then ${d2}% more: price?`, E(v), [E((p * (100 - d1 - d2)) / 100), E(p - d1 - d2), E((p * (100 - d1)) / 100)], eurFill(ctx, v, 10));
      }
      if (m === 1) {
        const k = R(1, 10), net = 200 * k;
        return mk(sl ? `Neto ${E(net)}, znižana stopnja DDV ${ctx.num(9.5)} %: z DDV?` : `${E(net)} net, reduced VAT ${ctx.num(9.5)}%: with VAT?`, E(219 * k), [E(244 * k), E(19 * k), E(net + 9.5)], eurFill(ctx, 219 * k, 10));
      }
      const net = R(1, 10) * 50, d = pick([10, 20]);
      const v = net * (1 - d / 100) * 1.22;
      return mk(sl ? `Neto ${E(net)}, popust ${d} %, nato DDV 22 %: cena?` : `${E(net)} net, ${d}% off, then 22% VAT: price?`, E(v), [E(net * (1 + (22 - d) / 100)), E(net * 1.22), E(net * (1 - d / 100))], eurFill(ctx, v, 1));
    },
  },
  {
    id: "e_interest",
    area: "ek_fin",
    year: 13,
    name: { sl: "Navadno in obrestno obrestovanje", en: "Simple and compound interest" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const E = (x) => eur(ctx, x);
      const pc = (x) => pct(ctx, x);
      if (t === 1) {
        const P = pick([500, 1000, 2000, 5000]), r = pick([2, 3, 4, 5, 10]), n = R(2, 5);
        const I = (P * r * n) / 100;
        return mk(sl ? `Navadno obrestovanje: ${E(P)}, ${pc(r)}, ${yrs(ctx, n)} → obresti?` : `Simple interest: ${E(P)}, ${pc(r)}, ${yrs(ctx, n)} → interest?`, E(I), [E((P * r) / 100), E(P + I), E(P * ((1 + r / 100) ** n - 1))], eurFill(ctx, I, (P * r) / 100));
      }
      if (t === 2) {
        const P = pick([500, 1000, 2000, 5000]), r = pick([5, 10, 20]);
        const K = P * (1 + r / 100) ** 2;
        if (Math.random() < 0.5)
          return mk(sl ? `Obrestno obrestovanje: ${E(P)}, ${pc(r)}, 2 leti → ?` : `Compound interest: ${E(P)}, ${pc(r)}, 2 yr → ?`, E(K), [E(P * (1 + (2 * r) / 100)), E(P * (1 + r / 100)), E(K - P), E(P * (1 + r / 100) ** 3)]);
        return mk(sl ? `Obrestno obrestovanje: ${E(P)}, ${pc(r)}, 2 leti → obresti?` : `Compound interest: ${E(P)}, ${pc(r)}, 2 yr → interest?`, E(K - P), [E((P * 2 * r) / 100), E(K), E((P * r) / 100)], eurFill(ctx, K - P, P / 100));
      }
      const k = R(0, 1);
      const P = pick([1000, 2000]), r = pick([5, 10, 20]);
      if (k === 0) {
        const K = P * (1 + r / 100) ** 3;
        return mk(sl ? `Obrestno obrestovanje: ${E(P)}, ${pc(r)}, 3 leta → ?` : `Compound interest: ${E(P)}, ${pc(r)}, 3 yr → ?`, E(K), [E(P * (1 + (3 * r) / 100)), E(P * (1 + r / 100) ** 2), E(K - P)]);
      }
      const K = P * (1 + r / 100) ** 2;
      return mk(sl ? `Sedanja vrednost ${E(K)} čez 2 leti pri ${pc(r)}?` : `Present value of ${E(K)} in 2 yr at ${pc(r)}?`, E(P), [E(K / (1 + (2 * r) / 100)), E(K * (1 - r / 100) ** 2), E(K / (1 + r / 100))]);
    },
  },
  {
    id: "e_profit",
    area: "ek_pod",
    year: 13,
    name: { sl: "Prihodki, stroški, dobiček", en: "Revenue, cost and profit" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const E = (x) => eur(ctx, x);
      if (t === 1) {
        if (Math.random() < 0.5) {
          const P = R(2, 30), Q = R(2, 20) * 10;
          return mk(sl ? `Cena ${E(P)}, prodanih ${Q} kosov: prihodek?` : `Price ${E(P)}, ${Q} units sold: revenue?`, E(P * Q), [E(P + Q), E((P * Q) / 10), E(P * Q * 10)], eurFill(ctx, P * Q, P * 10));
        }
        const TR = R(20, 90) * 10, TC = TR - R(1, 15) * 10;
        return mk(sl ? `Prihodek ${E(TR)}, stroški ${E(TC)}: dobiček?` : `Revenue ${E(TR)}, cost ${E(TC)}: profit?`, E(TR - TC), [E(TR + TC), E(TC - TR), E(TC)], eurFill(ctx, TR - TC, 10));
      }
      if (t === 2) {
        const k = R(0, 2);
        if (k === 0) {
          const FC = R(2, 20) * 50, v = R(2, 15), Q = R(2, 20) * 10;
          return mk(sl ? `Fiksni str. ${E(FC)}, var. ${E(v)}/kos, ${Q} kosov: skupni str.?` : `FC = ${E(FC)}, VC = ${E(v)}/unit, Q = ${Q}: TC?`, E(FC + v * Q), [E(v * Q), E(FC + v), E((FC + v) * Q)], eurFill(ctx, FC + v * Q, 10));
        }
        if (k === 1) {
          const Q = R(2, 20) * 10, a = R(2, 30);
          return mk(sl ? `Skupni stroški ${E(a * Q)}, ${Q} kosov: povprečni strošek?` : `TC = ${E(a * Q)}, Q = ${Q}: ATC?`, E(a), [E(a * 10), E(a * Q - Q), E(a / 10)], eurFill(ctx, a, 1));
        }
        const TC = R(20, 90) * 10, TR = TC - R(1, 15) * 10;
        return mk(sl ? `Prihodek ${E(TR)}, stroški ${E(TC)}: dobiček?` : `Revenue ${E(TR)}, cost ${E(TC)}: profit?`, E(TR - TC), [E(TC - TR), E(TR + TC), E(TR)], eurFill(ctx, TR - TC, 10));
      }
      const P = R(8, 30), v = R(2, P - 2), Q = R(5, 30) * 10, FC = R(1, 20) * 50;
      const pi = (P - v) * Q - FC;
      return mk(sl ? `Cena ${E(P)}, var. ${E(v)}/kos, fiksni ${E(FC)}, ${Q} kosov: dobiček?` : `P = ${E(P)}, AVC = ${E(v)}, FC = ${E(FC)}, Q = ${Q}: profit?`, E(pi), [E((P - v) * Q), E(P * Q - FC), E((P - v) * Q + FC), E(P * Q - v - FC)], eurFill(ctx, pi, 50));
    },
  },
  {
    id: "e_breakeven",
    area: "ek_pod",
    year: 14,
    name: { sl: "Prag rentabilnosti", en: "Break-even point" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const E = (x) => eur(ctx, x);
      const n = ctx.num;
      const cm = pick([2, 4, 5, 10]), v = R(1, 20), P = v + cm;
      if (t === 1 && Math.random() < 0.5)
        return mk(sl ? `Cena ${E(P)}, var. stroški ${E(v)}/kos: prispevek za kritje?` : `Price ${E(P)}, variable cost ${E(v)}/unit: contribution?`, E(cm), [E(P + v), E(P), E(v)], eurFill(ctx, cm, 1));
      const Q = t === 1 ? R(2, 20) * 10 : R(5, 60) * 20;
      const FC = cm * Q;
      const near = (i) => n(Q + (i % 2 ? -1 : 1) * 10 * (1 + Math.floor(i / 2)));
      if (t === 3) {
        const pi = R(1, 10) * cm * 50;
        const Qt = (FC + pi) / cm;
        return mk(sl ? `Fiksni ${E(FC)}, cena ${E(P)}, var. ${E(v)}/kos, dobiček ${E(pi)}: Q?` : `FC ${E(FC)}, P ${E(P)}, AVC ${E(v)}, target profit ${E(pi)}: Q?`, n(Qt), [Q, Math.abs(FC - pi) / cm, Math.round((FC + pi) / P)].map(n), (i) => n(Qt + (i % 2 ? -1 : 1) * 10 * (1 + Math.floor(i / 2))));
      }
      if (t === 2 && Math.random() < 0.4)
        return mk(sl ? `Fiksni ${E(FC)}, cena ${E(P)}, var. ${E(v)}/kos: prag v evrih?` : `FC ${E(FC)}, P ${E(P)}, AVC ${E(v)}: break-even revenue?`, E(Q * P), [E(FC), E(Q * v), E(Q)], eurFill(ctx, Q * P, P * 10));
      return mk(sl ? `Fiksni ${E(FC)}, cena ${E(P)}, var. ${E(v)}/kos: prag v kosih?` : t === 1 ? `Fixed ${E(FC)}, price ${E(P)}, variable ${E(v)}/unit: break-even Q?` : `FC ${E(FC)}, P ${E(P)}, AVC ${E(v)}: break-even Q?`, n(Q), [Math.round(FC / P), Math.round(FC / v), Math.round(FC / (P + v))].map(n), near);
    },
  },
  {
    id: "e_margin",
    area: "ek_pod",
    year: 14,
    name: { sl: "Mejni stroški in mejni prihodek", en: "Marginal cost and revenue" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const E = (x) => eur(ctx, x);
      if (t === 1) {
        const q = R(2, 9), a = R(10, 60) * 5, mc = R(2, 30);
        const b = a + mc;
        const kos = (k) => (k === 2 ? "kosa" : k <= 4 ? "kose" : "kosov");
        return mk(sl ? `Stroški za ${q} ${kos(q)} ${E(a)}, za ${q + 1} ${kos(q + 1)} ${E(b)}: mejni strošek?` : `Cost of ${q} units ${E(a)}, of ${q + 1} units ${E(b)}: marginal cost?`, E(mc), [E(b), E(b / (q + 1)), E(a / q)], eurFill(ctx, mc, 1));
      }
      if (t === 2) {
        if (Math.random() < 0.5) {
          const P1 = R(10, 30), Q1 = R(2, 10), P2 = P1 - R(1, 3), Q2 = Q1 + 1;
          const MR = P2 * Q2 - P1 * Q1;
          return mk(sl ? `P = ${E(P1)} pri Q = ${Q1}; P = ${E(P2)} pri Q = ${Q2}: mejni prihodek?` : `P = ${E(P1)} at Q = ${Q1}; P = ${E(P2)} at Q = ${Q2}: MR?`, E(MR), [E(P2), E(P2 * Q2), E(P1 - P2), MR !== 0 ? E(-MR) : null], eurFill(ctx, MR, 1));
        }
        const q1 = R(1, 5) * 10, dq = pick([5, 10, 20]), mc = R(2, 20);
        const t1 = R(20, 80) * 10, t2 = t1 + mc * dq;
        return mk(sl ? `Q: ${q1} → ${q1 + dq}, stroški: ${E(t1)} → ${E(t2)}: mejni strošek?` : `Q: ${q1} → ${q1 + dq}, TC: ${E(t1)} → ${E(t2)}: MC?`, E(mc), [E(mc * dq), E(t2 / (q1 + dq)), E((mc * dq) / (q1 + dq))], eurFill(ctx, mc, 1));
      }
      return bank(
        [
          [3, ["Dobiček je največji, ko?", "MR = MC", "MR = 0", "P = AVC", "TR = TC"], ["Profit is maximised when?", "MR = MC", "MR = 0", "P = AVC", "TR = TC"]],
          [3, ["Prihodek (TR) je največji, ko?", "MR = 0", "MR = MC", "P = MC", "TR = TC"], ["Revenue (TR) is maximised when?", "MR = 0", "MR = MC", "P = MC", "TR = TC"]],
          [3, ["Kratkoročni prag zaprtja?", "P = min AVC", "P = min ATC", "MR = 0", "TR = TC"], ["Short-run shutdown point?", "P = min AVC", "P = min ATC", "MR = 0", "TR = TC"]],
          [3, ["Prag pokritja v popolni konkurenci?", "P = min ATC", "P = min AVC", "MR = 0", "TR = 0"], ["Break-even point in perfect competition?", "P = min ATC", "P = min AVC", "MR = 0", "TR = 0"]],
          [3, ["MC seka ATC v njegovem?", "minimumu", "maksimumu", "prevoju", "začetku"], ["MC crosses ATC at its?", "minimum", "maximum", "inflection point", "start"]],
          [3, ["Popolna konkurenca: MR = ?", "P", "0", "2P", "P/2"], ["Perfect competition: MR = ?", "P", "0", "2P", "P/2"]],
          [3, ["Linearno povpraševanje: krivulja MR je?", "dvakrat strmejša", "enako strma", "pol manj strma", "vodoravna"], ["Linear demand: the MR curve is?", "twice as steep", "equally steep", "half as steep", "horizontal"]],
          [3, ["Monopolist proizvaja, kjer je?", "MR = MC", "P = MC", "P = ATC", "MR = 0"], ["A monopolist produces where?", "MR = MC", "P = MC", "P = ATC", "MR = 0"]],
        ],
        3,
        ctx,
      );
    },
  },
  {
    id: "e_elast",
    area: "ek_mikro",
    year: 14,
    name: { sl: "Elastičnost povpraševanja", en: "Elasticity of demand" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const CL = sl ? ["elastično", "neelastično", "enotsko elastično", "povsem neelastično", "povsem elastično"] : ["elastic", "inelastic", "unit elastic", "perfectly inelastic", "perfectly elastic"];
      const others = (i) => shuffle(CL.filter((_, k) => k !== i));
      if (t === 1) {
        if (Math.random() < 0.35) {
          const [s, e, i] = pick([
            ["Cena ↑, prihodek ↓", "Price ↑, revenue ↓", 0],
            ["Cena ↑, prihodek ↑", "Price ↑, revenue ↑", 1],
            ["Cena ↑, prihodek enak", "Price ↑, revenue unchanged", 2],
            ["Cena ↓, prihodek ↑", "Price ↓, revenue ↑", 0],
            ["Cena ↓, prihodek ↓", "Price ↓, revenue ↓", 1],
          ]);
          // pri ceni ↑ in prihodku ↓ je možna tudi povsem elastična, pri prihodku ↑ povsem neelastična – ju izpustimo
          const ws = i === 0 ? [CL[1], CL[2], CL[3]] : i === 1 ? [CL[0], CL[2], CL[4]] : [CL[0], CL[1], pick([CL[3], CL[4]])];
          return mk(sl ? `${s}: povpraševanje je?` : `${e}: demand is?`, CL[i], ws);
        }
        const [e, i] = pick([[0, 3], [0.2, 1], [0.25, 1], [0.4, 1], [0.5, 1], [0.8, 1], [1, 2], [1.5, 0], [2, 0], [2.5, 0], [3, 0], [4, 0]]);
        // Ed = 0 je tudi »neelastično« v širšem smislu, zato tega ne ponudimo kot napačnega
        return mk(sl ? `Cenovna elastičnost ${n(-e)}: povpraševanje je?` : `Price elasticity ${n(-e)}: demand is?`, CL[i], others(i).filter((x) => !(i === 3 && x === CL[1])));
      }
      if (t === 2) {
        const [p, e] = pick([[10, 0.5], [10, 2], [10, 1.5], [5, 2], [4, 0.5], [20, 0.5], [2, 3], [5, 0.4], [10, 0.2], [4, 1.5], [20, 1.5], [5, 3]]);
        const q = p * e;
        if (Math.random() < 0.5) {
          const ws = [-(1 / e), -(q - p), -e - 0.5, -e + 0.5, -(q + p) / p].map((x) => Math.round(x * 100) / 100).filter((x) => x < 0 && x !== -e);
          return mk(sl ? `Cena +${p} %, količina −${n(q)} %: cenovna elastičnost?` : `Price +${p}%, quantity −${n(q)}%: price elasticity?`, n(-e), ws.map(n));
        }
        const P = (x) => pct(ctx, x, true);
        return mk(sl ? `Cenovna elastičnost ${n(-e)}, cena +${p} %: količina?` : `Price elasticity ${n(-e)}, price +${p}%: quantity?`, P(-q), [P(q), P(-Math.round((p / e) * 100) / 100), P(-(e + p)), P(-p)]);
      }
      const k = R(0, 2);
      if (k === 0) {
        const [p, q, up] = pick([[10, 5, 1], [10, 15, 1], [10, 20, 1], [5, 10, 1], [10, 5, 0], [4, 2, 0], [20, 10, 1], [10, 30, 1]]);
        const e = (up ? q : -q) / p;
        const ws = [-e, Math.round((p / q) * 100) / 100 * (up ? 1 : -1), e + 1, (up ? q : -q) - p].map((x) => Math.round(x * 100) / 100);
        return mk(sl ? `Dohodek +${p} %, količina ${up ? "+" : "−"}${q} %: dohodkovna elastičnost?` : `Income +${p}%, quantity ${up ? "+" : "−"}${q}%: income elasticity?`, n(e), ws.map(n));
      }
      if (k === 1) {
        const G = sl ? ["inferiorna", "nujna", "luksuzna", "komplementarna"] : ["inferior", "necessity", "luxury", "complement"];
        const [e, i] = pick([[-0.5, 0], [-1.2, 0], [-0.3, 0], [0.3, 1], [0.5, 1], [0.8, 1], [1.5, 2], [2, 2], [2.5, 2]]);
        return mk(sl ? `Dohodkovna elastičnost ${n(e)}: dobrina je?` : `Income elasticity ${n(e)}: the good is a?`, G[i], G.filter((_, j) => j !== i));
      }
      const G = sl ? ["substituta", "komplementa", "neodvisni", "inferiorni"] : ["substitutes", "complements", "independent", "inferior goods"];
      const [e, i] = pick([[0.4, 0], [0.8, 0], [1.5, 0], [-0.5, 1], [-1, 1], [-2, 1], [0, 2]]);
      return mk(sl ? `Križna elastičnost ${n(e)}: dobrini sta?` : `Cross elasticity ${n(e)}: the goods are?`, G[i], G.filter((_, j) => j !== i));
    },
  },
  {
    id: "e_shift",
    area: "ek_mikro",
    year: 13,
    name: { sl: "Premiki povpraševanja in ponudbe", en: "Shifts in supply and demand" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 3 && Math.random() < 0.35) {
        const [s, e, i] = pick(BOTH);
        return mk(sl ? `${s} → P, Q?` : `${e} → P, Q?`, BOTH_ANS[i][sl ? 0 : 1], BOTH_ANS.filter((_, k) => k !== i).map((x) => x[sl ? 0 : 1]));
      }
      const pool = SHIFTS.filter((x) => (t === 1 ? x[0] === 1 : x[0] >= (t === 3 ? 2 : 1)));
      const [, s, e, i] = pick(pool);
      return mk(sl ? `${s} → P, Q?` : `${e} → P, Q?`, SHIFT_ANS[i][0], SHIFT_ANS.filter((_, k) => k !== i).map((x) => x[0]));
    },
  },
  {
    id: "e_equil",
    area: "ek_mikro",
    year: 14,
    name: { sl: "Tržno ravnovesje", en: "Market equilibrium" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const b = t === 1 ? 1 : R(1, 4), d = t === 1 ? 1 : R(1, 4);
      const Ps = R(4, 30), Qs = R(10, 100);
      const a = Qs + b * Ps, c = Qs - d * Ps;
      const coef = (k) => (k === 1 ? "P" : `${k}P`);
      const sup = c === 0 ? coef(d) : `${n(c)} + ${coef(d)}`;
      const sys = `Qd = ${a} − ${coef(b)}, Qs = ${sup}`;
      const nearP = (i) => n(Ps + (i % 2 ? -1 : 1) * (1 + Math.floor(i / 2)));
      if (t < 3 || Math.random() < 0.3) {
        const ws = [Qs, (a + c) / (b + d), (a - c) / b, (a - c) / d].filter((x) => isInt(x) && x > 0).map(n);
        return mk(`${sys}: P*?`, n(Ps), ws, nearP);
      }
      if (Math.random() < 0.5) return mk(`${sys}: Q*?`, n(Qs), [Ps, Qs + b, Qs - d, a].map(n), (i) => n(Qs + (i % 2 ? -1 : 1) * (1 + Math.floor(i / 2))));
      const k = R(1, 5), above = Math.random() < 0.5;
      const P0 = above ? Ps + k : Ps - k;
      const gap = (b + d) * k;
      const qd = a - b * P0, qs = c + d * P0;
      // pri tej ceni morata biti obe količini pozitivni, sicer vprašanje nima smisla
      if (P0 <= 0 || qd <= 0 || qs <= 0) return mk(`${sys}: Q*?`, n(Qs), [Ps, Qs + b, Qs - d, a].map(n), (i) => n(Qs + (i % 2 ? -1 : 1) * (1 + Math.floor(i / 2))));
      const what = above ? (sl ? "presežek" : "surplus") : sl ? "primanjkljaj" : "shortage";
      return mk(`${sys}; P = ${P0}: ${what}?`, n(gap), [qd, qs, b * k, d * k, gap * 2].filter((x) => x > 0).map(n));
    },
  },
  {
    id: "e_market",
    area: "ek_mikro",
    year: 14,
    name: { sl: "Tržne strukture", en: "Market structures" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const pool = MARKET_ITEMS.filter((x) => (t === 1 ? x[0] === 1 : t === 2 ? x[0] <= 2 : x[0] >= 2));
      const [, s, e, i] = pick(pool);
      return mk(sl ? s : e, MARKETS[i][sl ? 0 : 1], MARKETS.filter((_, k) => k !== i).map((x) => x[sl ? 0 : 1]));
    },
  },
  {
    id: "e_oppcost",
    area: "ek_mikro",
    year: 13,
    name: { sl: "Oportunitetni strošek in primerjalna prednost", en: "Opportunity cost and comparative advantage" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      if (t === 1) {
        const a = R(1, 6), k = pick([2, 3, 4, 5]), b = a * k;
        if (Math.random() < 0.6)
          return mk(sl ? `Ura dela: ${a} A ali ${b} B. Oportunitetni strošek 1 A?` : `1 hour: ${a} A or ${b} B. Opportunity cost of 1 A?`, `${n(k)} B`, [`${n(Math.round(100 / k) / 100)} B`, `${n(b)} B`, `${n(a)} B`, `${n(k + 1)} B`]);
        const k2 = pick([2, 4, 5]), b2 = a * k2;
        return mk(sl ? `Ura dela: ${a} A ali ${b2} B. Oportunitetni strošek 1 B?` : `1 hour: ${a} A or ${b2} B. Opportunity cost of 1 B?`, `${n(1 / k2)} A`, [`${n(k2)} A`, `${n(a)} A`, `${n(b2)} A`, `${n(1 / k2 + 1)} A`]);
      }
      if (t === 2 || Math.random() < 0.4) {
        // X in Y: koliko A ali B na uro; različni oportunitetni stroški
        for (;;) {
          const a1 = R(1, 8), b1 = R(1, 8), a2 = R(1, 8), b2 = R(1, 8);
          const ox = b1 / a1, oy = b2 / a2;
          if (ox === oy) continue;
          const inA = Math.random() < 0.5;
          // primerjalna prednost pri A: nižji oportunitetni strošek A (B/A); pri B: nižji A/B
          const win = inA ? (ox < oy ? "X" : "Y") : ox > oy ? "X" : "Y";
          const absWin = inA ? (a1 > a2 ? "X" : a2 > a1 ? "Y" : null) : b1 > b2 ? "X" : b2 > b1 ? "Y" : null;
          if (t === 2 && absWin === win && Math.random() < 0.5) continue; // pogosteje primeri, kjer se absolutna in primerjalna razlikujeta
          const g = inA ? "A" : "B";
          const lose = win === "X" ? "Y" : "X";
          return mk(sl ? `Ura: X ${a1} A ali ${b1} B, Y ${a2} A ali ${b2} B. Primerjalna prednost v ${g}?` : `1 hour: X ${a1} A or ${b1} B, Y ${a2} A or ${b2} B. Comp. advantage in ${g}?`, win, [lose, sl ? "X in Y" : "X and Y", sl ? "nihče" : "neither"]);
        }
      }
      const h = R(2, 8), w = pick([8, 10, 12, 15, 20]), f = R(1, 10) * 10;
      return mk(sl ? `Tečaj (${eur(ctx, f)}) vzame ${h} h dela po ${eur(ctx, w)}/h: oport. strošek?` : `Course (${eur(ctx, f)}) takes ${h} h of work at ${eur(ctx, w)}/h: opp. cost?`, eur(ctx, h * w + f), [eur(ctx, f), eur(ctx, h * w), eur(ctx, w + f), eur(ctx, h * w - f)], eurFill(ctx, h * w + f, 10));
    },
  },
  {
    id: "e_gdp",
    area: "ek_makro",
    year: 14,
    name: { sl: "BDP, inflacija, realno in nominalno", en: "GDP, inflation, real vs nominal" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const pc = (x, s = false) => pct(ctx, x, s);
      if (t === 1) {
        if (Math.random() < 0.5) {
          const N = pick([2, 4, 5]), Y = N * R(5, 20);
          const v = (Y / N) * 1000;
          return mk(sl ? `BDP ${Y} mrd. €, ${N} mio. prebivalcev: na prebivalca?` : `GDP €${Y} bn, ${N} m people: per capita?`, eur(ctx, v), [eur(ctx, Y / N), eur(ctx, v * 10), eur(ctx, v / 10), eur(ctx, Y * N * 1000)]);
        }
        const C = R(50, 70) * 10, I = R(10, 25) * 10, G = R(15, 25) * 10;
        let NX = R(-8, 8) * 10;
        if (NX === 0) NX = -30;
        const Y = C + I + G + NX;
        return mk(sl ? `C ${C}, I ${I}, G ${G}, NX ${n(NX)} (mrd. €): BDP?` : `C ${C}, I ${I}, G ${G}, NX ${n(NX)} (€ bn): GDP?`, n(Y), [C + I + G - NX, C + I + G, C + I + NX, C + G + NX].map(n), (i) => n(Y + (i % 2 ? -1 : 1) * 10 * (1 + Math.floor(i / 2))));
      }
      if (t === 2) {
        if (Math.random() < 0.5) {
          const a = pick([100, 120, 125, 150, 200, 250]), p = pick([2, 4, 5, 8, 10, 20]);
          const b = (a * (100 + p)) / 100;
          return mk(sl ? `ICŽP: ${n(a)} → ${n(b)}. Stopnja inflacije?` : `CPI: ${n(a)} → ${n(b)}. Inflation rate?`, pc(p), [pc(b - a), pc(Math.round(((b - a) / b) * 10000) / 100), pc((b / a) * 100), pc(p * 2)], pctFill(ctx, p, 1));
        }
        const i = R(1, 10), pi = R(0, 8);
        if (i === pi) return mk(sl ? `Nominalna obr. mera ${pc(i)}, inflacija ${pc(pi)}: realna ≈ ?` : `Nominal rate ${pc(i)}, inflation ${pc(pi)}: real rate ≈ ?`, pc(0), [pc(2 * i), pc(i), pc(-i)]);
        return mk(sl ? `Nominalna obr. mera ${pc(i)}, inflacija ${pc(pi)}: realna ≈ ?` : `Nominal rate ${pc(i)}, inflation ${pc(pi)}: real rate ≈ ?`, pc(i - pi), [pc(i + pi), pc(pi - i), pc(i)], pctFill(ctx, i - pi, 1));
      }
      const k = R(0, 2);
      if (k === 0) {
        const Rl = R(5, 20) * 100, D = pick([80, 90, 110, 120, 125, 150, 200]);
        const N = (Rl * D) / 100;
        return mk(sl ? `Nominalni BDP ${n(N)}, deflator ${D}: realni BDP?` : `Nominal GDP ${n(N)}, deflator ${D}: real GDP?`, n(Rl), [(N * D) / 100, N - (D - 100), N, Math.round(N / D)].map(n), (i) => n(Rl + (i % 2 ? -1 : 1) * 100 * (1 + Math.floor(i / 2))));
      }
      if (k === 1) {
        const Rl = R(5, 20) * 100, D = pick([80, 90, 110, 120, 125, 150, 200]);
        const N = (Rl * D) / 100;
        return mk(sl ? `Nominalni BDP ${n(N)}, realni ${n(Rl)}: deflator?` : `Nominal GDP ${n(N)}, real ${n(Rl)}: deflator?`, n(D), [Math.round((Rl / N) * 1000) / 10, D - 100, N - Rl].map(n)); // ne D/100: deflator kot razmerje (1,1) je tudi zagovorljiv
      }
      const g = R(3, 10), pi = R(1, 6);
      return mk(sl ? `Nominalni BDP +${pc(g)}, inflacija ${pc(pi)}: realna rast ≈ ?` : `Nominal GDP +${pc(g)}, inflation ${pc(pi)}: real growth ≈ ?`, pc(g - pi, true), [pc(g + pi, true), pc(pi - g, true), pc(g, true)], pctFill(ctx, g - pi, 1, true));
    },
  },
  {
    id: "e_unemp",
    area: "ek_makro",
    year: 13,
    name: { sl: "Brezposelnost", en: "Unemployment" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const pc = (x) => pct(ctx, x);
      if (t === 1 && Math.random() < 0.5) {
        const [s, e, i] = pick(UNEMP_ITEMS);
        return mk(sl ? s : e, UNEMP_TYPES[i][sl ? 0 : 1], UNEMP_TYPES.filter((_, k) => k !== i).map((x) => x[sl ? 0 : 1]));
      }
      if (t <= 2) {
        const L = pick(t === 1 ? [100, 200, 500, 1000] : [200, 400, 500, 800, 1000, 2000, 2500]), u = pick([4, 5, 6, 8, 10, 12, 15, 20]);
        const U = (L * u) / 100, E = L - U;
        return mk(sl ? `Zaposleni ${n(E)}, brezposelni ${n(U)}: stopnja brezposelnosti?` : `Employed ${n(E)}, unemployed ${n(U)}: unemployment rate?`, pc(u), [pc(Math.round((U / E) * 1000) / 10), pc(100 - u)], pctFill(ctx, u, 1));
      }
      let W, a, u, L, U, E;
      do {
        W = pick([1000, 2000, 500]);
        a = pick([50, 55, 60, 65, 70, 75]);
        u = pick([4, 5, 8, 10, 20]);
        L = (W * a) / 100;
        U = (L * u) / 100;
        E = L - U;
      } while (!isInt(L) || !isInt(U));
      if (Math.random() < 0.6)
        return mk(sl ? `Zaposl. ${n(E)}, brezposl. ${n(U)}, neaktivni ${n(W - L)}: aktivnost?` : `Emp. ${n(E)}, unemp. ${n(U)}, inactive ${n(W - L)}: participation?`, pc(a), [pc((E / W) * 100), pc(u), pc(100 - a), pc((U / W) * 100)]);
      return mk(sl ? `Zaposl. ${n(E)}, brezposl. ${n(U)}, neaktivni ${n(W - L)}: brezposelnost?` : `Emp. ${n(E)}, unemp. ${n(U)}, inactive ${n(W - L)}: unemp. rate?`, pc(u), [pc((U / W) * 100), pc(Math.round((U / E) * 1000) / 10), pc(a)]);
    },
  },
  {
    id: "e_policy",
    area: "ek_makro",
    year: 14,
    name: { sl: "Fiskalna in denarna politika", en: "Fiscal and monetary policy" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const L = sl ? 0 : 1;
      if (t === 3 && Math.random() < 0.3)
        return bank(
          [
            [3, ["Kdo vodi denarno politiko evrskega območja?", "ECB", "vlada", "Evropska komisija", "Evropski parlament"], ["Who runs euro-area monetary policy?", "the ECB", "the government", "European Commission", "European Parliament"]],
            [3, ["Visoka inflacija: ECB običajno?", "zviša obr. mere", "zniža obr. mere", "zniža davke", "poveča porabo"], ["High inflation: the ECB usually?", "raises rates", "cuts rates", "cuts taxes", "spends more"]],
            [3, ["Recesija: vlada lahko?", "poveča porabo", "zviša davke", "zmanjša porabo", "zviša obr. mere"], ["Recession: the government can?", "spend more", "raise taxes", "spend less", "raise rates"]],
            [3, ["Proračunski primanjkljaj: odhodki so?", "večji od prihodkov", "manjši od prihodkov", "enaki prihodkom", "enaki nič"], ["Budget deficit: spending is?", "above revenue", "below revenue", "equal to revenue", "zero"]],
          ],
          3,
          ctx,
        );
      if (t === 2 && Math.random() < 0.4)
        return bank(
          [
            [2, ["Ekspanzivna denarna politika: obrestne mere?", "se znižajo", "se zvišajo", "ostanejo enake", "se podvojijo"], ["Expansionary monetary policy: interest rates?", "fall", "rise", "stay the same", "double"]],
            [2, ["Restriktivna denarna politika: inflacija?", "se zniža", "se zviša", "ostane enaka", "se podvoji"], ["Contractionary monetary policy: inflation?", "falls", "rises", "stays the same", "doubles"]],
            [2, ["Višji davki: razpoložljivi dohodek?", "se zmanjša", "se poveča", "ostane enak", "se podvoji"], ["Higher taxes: disposable income?", "falls", "rises", "stays the same", "doubles"]],
            [2, ["Centralna banka kupi obveznice: denarna masa?", "se poveča", "se zmanjša", "ostane enaka", "se prepolovi"], ["Central bank buys bonds: money supply?", "rises", "falls", "stays the same", "halves"]],
          ],
          2,
          ctx,
        );
      const g = R(0, 3);
      const a = pick(MEASURES[g]);
      const ws = shuffle(MEASURES.filter((_, k) => k !== g).flat());
      return mk(POLICY_Q[g][L], a[L], ws.map((x) => x[L]));
    },
  },
  {
    id: "e_bank",
    area: "ek_den",
    year: 14,
    name: { sl: "Banke in denarni multiplikator", en: "Banks and the money multiplier" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const E = (x) => eur(ctx, x);
      if (t === 1 && Math.random() < 0.4)
        return bank(
          [
            [1, ["Funkcija denarja?", "menjalni posrednik", "vir dobička", "proizvodni dejavnik", "zaščita pred infl."], ["A function of money?", "medium of exchange", "source of profit", "factor of production", "inflation hedge"]],
            [1, ["Funkcija denarja?", "merilo vrednosti", "vir dobička", "proizvodni dejavnik", "zaščita pred infl."], ["A function of money?", "unit of account", "source of profit", "factor of production", "inflation hedge"]],
            [1, ["Funkcija denarja?", "hranilec vrednosti", "vir dobička", "proizvodni dejavnik", "zaščita pred infl."], ["A function of money?", "store of value", "source of profit", "factor of production", "inflation hedge"]],
            [1, ["Centralna banka evrskega območja?", "ECB", "IMF", "Svetovna banka", "EIB"], ["Central bank of the euro area?", "ECB", "IMF", "World Bank", "EIB"]],
          ],
          1,
          ctx,
        );
      const rr = pick([1, 2, 4, 5, 10, 20, 25, 50]);
      const pc = (x) => pct(ctx, x);
      if (t === 1 || Math.random() < 0.3) return mk(sl ? `Obvezna rezerva ${pc(rr)}: denarni multiplikator?` : `Reserve ratio ${pc(rr)}: money multiplier?`, n(100 / rr), [rr, rr / 100, 100 - rr, 100 / rr - 1].map(n));
      const r = pick([5, 10, 20, 25]);
      const D = R(1, 20) * 500;
      if (t === 2) {
        if (Math.random() < 0.5) return mk(sl ? `Depozit ${E(D)}, obvezna rezerva ${pc(r)}: rezerva?` : `Deposit ${E(D)}, reserve ratio ${pc(r)}: required reserve?`, E((D * r) / 100), [E(D - (D * r) / 100), E(D * (100 / r)), E(D / r)], eurFill(ctx, (D * r) / 100, 50));
        return mk(sl ? `Depozit ${E(D)}, obvezna rezerva ${pc(r)}: lahko posodi?` : `Deposit ${E(D)}, reserve ratio ${pc(r)}: can lend?`, E(D - (D * r) / 100), [E((D * r) / 100), E(D), E((D * 100) / r)], eurFill(ctx, D - (D * r) / 100, 50));
      }
      const tot = (D * 100) / r;
      if (Math.random() < 0.5) return mk(sl ? `Depozit ${E(D)}, obv. rezerva ${pc(r)}: največ vseh depozitov?` : `Initial deposit ${E(D)}, rr = ${pc(r)}: max total deposits?`, E(tot), [E(tot - D), E(D + (D * r) / 100), E(D - (D * r) / 100), E((D * r) / 100)]);
      return mk(sl ? `Depozit ${E(D)}, obv. rezerva ${pc(r)}: največ novih posojil?` : `Initial deposit ${E(D)}, rr = ${pc(r)}: max total new loans?`, E(tot - D), [E(tot), E(D - (D * r) / 100), E((D * r) / 100)]);
    },
  },
  {
    id: "e_fx",
    area: "ek_den",
    year: 13,
    name: { sl: "Menjalni tečaji", en: "Exchange rates" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const E = (x) => eur(ctx, x);
      const fx = (x, c) => {
        let s = n(r2(x));
        if (/[.,]\d$/.test(s)) s += "0";
        return `${s} ${c}`;
      };
      const [r, c] = pick([[1.1, "USD"], [1.2, "USD"], [1.25, "USD"], [1.5, "USD"], [0.9, "CHF"], [0.95, "CHF"], [0.8, "GBP"], [0.85, "GBP"]]);
      const A = R(1, 20) * 20;
      if (t === 1) return mk(`${E(1)} = ${n(r)} ${c}: ${E(A)} = ?`, fx(A * r, c), [fx(A / r, c), fx(A, c), fx(A * r * 1.1, c), fx(A + r, c)]);
      if (t === 2) return mk(`${E(1)} = ${n(r)} ${c}: ${fx(A * r, c)} = ?`, E(A), [E(A * r * r), E(A * r), E((A * r) / (r * r) + 10)], eurFill(ctx, A, 5));
      if (Math.random() < 0.6) {
        const [r1, r_2] = pick([[1, 1.25], [1.25, 1], [1.2, 1.5], [1.5, 1.2], [0.8, 1], [1, 0.8], [1, 2], [2, 1]]);
        const eu = (r_2 / r1 - 1) * 100, us = (r1 / r_2 - 1) * 100;
        const P = (x) => pct(ctx, x, true);
        const euro = Math.random() < 0.5;
        const q = sl ? `1 € = ${n(r1)} → ${n(r_2)} USD: sprememba vrednosti ${euro ? "evra" : "dolarja"}?` : `€1 = ${n(r1)} → ${n(r_2)} USD: change in the ${euro ? "euro" : "dollar"}?`;
        const a = euro ? eu : us, o = euro ? us : eu;
        return mk(q, P(a), [P(o), P(-a), P(-o)]);
      }
      const [u, g, x] = pick([[1.2, 0.8, 1.5], [1.5, 0.75, 2], [1.2, 0.96, 1.25], [1, 0.8, 1.25], [1.6, 0.8, 2], [1.1, 0.88, 1.25]]);
      return mk(`${E(1)} = ${n(u)} USD = ${n(g)} GBP: 1 GBP = ?`, fx(x, "USD"), [fx(1 / x, "USD"), fx(u * g, "USD"), fx(u - g, "USD"), fx(u + g, "USD")]);
    },
  },
];
