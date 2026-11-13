// Pojmi za igre: kem2 (dopolnitev kem.js; glej README.md v tej mapi).
// Pokrije teme učnega načrta, ki v kem.js še nimajo igre (varno delo, ohranitev mase, energija, kovine in nekovine,
// računanje z množino, naravne spojine in polimeri, medmolekulske sile, entalpija, konjugirani pari, pufri,
// titracija, elektrokemija, izomerija, alkoholi, derivati kislin, ponovitev za maturo).
// Področja so iz kem.js (AREAS je zato prazen).
// Šolske relativne atomske mase: H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, S 32, Cl 35,5, Ca 40, Fe 56, Cu 63,5.
export const SUBJECT = "KEM";
export const AREAS = [];

// ---------- pomožne ----------
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
const L = (ctx, sl, en) => (ctx.lang === "sl" ? sl : en);
const rd = (x) => Math.round(x * 1e9) / 1e9;
const C = [];
const def = (id, area, year, glyph, sl, en, gen) => C.push({ id, area, year, glyph, name: { sl, en }, gen });

const SUBS = "₀₁₂₃₄₅₆₇₈₉", SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sub = (s) => String(s).replace(/\d/g, (d) => SUBS[d]);
const sup = (s) => String(s).replace(/\d/g, (d) => SUPS[d]).replace(/\+/g, "⁺").replace(/-/g, "⁻");
// "Ca3(PO4)2" → "Ca₃(PO₄)₂", "SO4^2-" → "SO₄²⁻", "->" → "→", "<=>" → "⇌"
const F = (s) =>
  String(s)
    .replace(/\^(\d*[+-])/g, (_, c) => sup(c))
    .replace(/([A-Za-z)\]])(\d+)/g, (_, l, d) => l + sub(d))
    .replace(/<=>/g, "⇌")
    .replace(/->/g, "→");

// Naloga: tipične napake najprej (premešane), nato rezervni napačni; 3–4 napačni, brez podvajanja.
function out(q, a, ws, fill = []) {
  const seen = new Set([a]);
  const w = [];
  for (const s of [...shuffle(ws), ...fill]) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w: shuffle(w) };
}
const nice = (x) =>
  Number.isFinite(x) && Math.abs(x) >= 1e-6 && Math.abs(x) < 1e9 && Math.abs(x - Number(x.toPrecision(4))) <= 1e-9 * Math.abs(x);
// Številski odgovor z enoto; napačni: števila (tipične napake) ali že oblikovani nizi.
function nq(ctx, q, a, unit, ws, opt = {}) {
  a = rd(a);
  const f = (x) => ctx.num(x) + (unit ? " " + unit : "");
  const ok = (x) => nice(x) && (opt.neg || x > 0) && Math.abs(x - a) > 1e-9 * Math.max(1, Math.abs(a)) && Math.abs(Math.round(x * 1e6) / 1e6 - x) <= 1e-9 * Math.abs(x);
  const W = ws.map((x) => (typeof x === "number" ? rd(x) : x)).filter((x) => typeof x !== "number" || ok(x)).map((x) => (typeof x === "number" ? f(x) : x));
  const Fl = [a * 2, a / 2, a * 10, a / 10, a * 3, a * 1.5, a + 1, a * 100, a / 100].map(rd).filter(ok).map(f);
  return out(q, f(a), W, Fl);
}
// celoštevilski odgovor
function ints(q, a, ws, min = 0) {
  const ok = (x) => Number.isInteger(x) && x >= min && x !== a;
  return out(q, String(a), ws.filter(ok).map(String), [1, -1, 2, -2, 3, 4].map((d) => a + d).filter(ok).map(String));
}
// Banka vprašanj: vnos [stopnja, "vprašanje|pravilno|napačno|…" (sl), isto (en)]; formule gredo skozi F.
// Stopnja 2 in 3 večinoma svoje vnose, včasih (30 %) z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = F(ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}
// decimalno število z natanko d decimalkami (npr. 5,0)
const fx = (ctx, x, d) => {
  const dec = ctx.num(1.5).charAt(1);
  return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d).replace(".", dec);
};
// predznačeno število (npr. +178)
const sg = (ctx, x) => (x > 0 ? "+" : "") + ctx.num(x);
const kj = (ctx, x) => sg(ctx, x) + " kJ";
// znanstveni zapis: 3,01 · 10²³
function sci(ctx, x) {
  let e = Math.floor(Math.log10(x));
  let m = Number((x / 10 ** e).toPrecision(4));
  if (m >= 10) {
    m = Number((m / 10).toPrecision(4));
    e++;
  }
  return `${ctx.num(m)} · 10${sup(e)}`;
}
const NA = 6.02e23;

// =====================================================================
// 8. RAZRED
// =====================================================================
const LAB = bank([
  [1, "Kislina ti brizgne v oko. Kaj storiš najprej?|izpiraš z vodo|pomaneš oko|nevtraliziraš z bazo|počakaš", "Acid splashes into your eye. First step?|rinse with water|rub the eye|neutralize with base|wait"],
  [1, "Zaščitna očala v laboratoriju nosimo?|ves čas poskusa|le pri segrevanju|le pri kislinah|nikoli", "Safety goggles in the lab are worn?|all the time|only when heating|only with acids|never"],
  [1, "Ali smemo v laboratoriju jesti in piti?|ne|da|le vodo|le med odmorom", "May you eat or drink in the lab?|no|yes|only water|only on breaks"],
  [1, "Piktogram s plamenom pomeni?|vnetljivo|jedko|strupeno|eksplozivno", "The flame pictogram means?|flammable|corrosive|toxic|explosive"],
  [1, "Piktogram z lobanjo pomeni?|akutno strupeno|vnetljivo|jedko|oksidativno", "The skull pictogram means?|acutely toxic|flammable|corrosive|oxidizing"],
  [1, "Piktogram: kaplji razjedata roko in kovino. Pomeni?|jedko|vnetljivo|strupeno|eksplozivno", "Pictogram: drops eating a hand and metal. Means?|corrosive|flammable|toxic|explosive"],
  [1, "Piktogram z eksplodirajočo bombo pomeni?|eksplozivno|vnetljivo|jedko|strupeno", "The exploding bomb pictogram means?|explosive|flammable|corrosive|toxic"],
  [1, "Kako varno povohamo snov?|pahljamo z roko|vohamo neposredno|globoko vdihnemo|jo okusimo", "How do you smell a substance safely?|waft it with a hand|sniff it directly|inhale deeply|taste it"],
  [1, "Odprtina epruvete pri segrevanju kaže?|stran od ljudi|proti tebi|proti sošolcu|navzdol", "When heating a test tube, its mouth points?|away from people|towards you|at a classmate|downwards"],
  [1, "Dolge lase pri delu z gorilnikom?|spnemo|razpustimo|spustimo naprej|zataknemo za uho", "Long hair near a burner should be?|tied back|left loose|hanging forward|tucked behind ears"],
  [1, "Kam zlijemo ostanke kemikalij?|v posodo za odpadke|v umivalnik|v koš za smeti|nazaj v steklenico", "Where do leftover chemicals go?|waste container|down the sink|into the bin|back into the bottle"],
  [1, "Manjšo opeklino najprej?|hladimo pod vodo|namažemo z maslom|prebodemo mehur|posujemo s soljo", "A small burn: first?|cool it under water|apply butter|pop the blister|cover it with salt"],
  [1, "Ali smemo kemikalije okušati?|nikoli|le razredčene|le sladke|le z dovoljenjem", "May you taste chemicals?|never|only if diluted|only sweet ones|only with permission"],
  [2, "Pri redčenju kisline vlivamo?|kislino v vodo|vodo v kislino|oboje hkrati|kakor koli", "When diluting an acid, pour?|acid into water|water into acid|both at once|either way"],
  [2, "Piktogram s plamenom nad krogom pomeni?|oksidativno|vnetljivo|eksplozivno|jedko", "Pictogram: flame over a circle means?|oxidizing|flammable|explosive|corrosive"],
  [2, "Piktogram s plinsko jeklenko pomeni?|plin pod tlakom|vnetljiv plin|strupen plin|eksplozivno", "Gas cylinder pictogram means?|gas under pressure|flammable gas|toxic gas|explosive"],
  [2, "Piktogram z mrtvo ribo in drevesom pomeni?|nevarno za okolje|strupeno za ljudi|vnetljivo|jedko", "Dead fish and tree pictogram means?|environmental hazard|toxic to humans|flammable|corrosive"],
  [2, "Piktogram s klicajem pomeni?|zdravju škodljivo|eksplozivno|vnetljivo|plin pod tlakom", "Exclamation mark pictogram means?|harmful or irritant|explosive|flammable|gas under pressure"],
  [2, "Goreče olje v čaši pogasimo tako, da čašo?|pokrijemo|polijemo z vodo|pihamo vanjo|premešamo", "Burning oil in a beaker: put it out by?|covering it|pouring water on it|blowing on it|stirring it"],
  [2, "Vročo epruveto primemo?|s prijemalko|z golo roko|s papirjem|s svinčnikom", "Hold a hot test tube with?|a test-tube holder|bare hands|a paper towel|a pencil"],
  [2, "Za merjenje prostornine je najprimernejši?|merilni valj|čaša|erlenmajerica|epruveta", "Best of these for measuring a volume?|measuring cylinder|beaker|conical flask|test tube"],
  [2, "Trdno snov zdrobimo v?|terilnici|epruveti|čaši|liju", "A solid is ground in a?|mortar|test tube|beaker|funnel"],
  [2, "Za filtracijo poleg filtrirnega papirja potrebujemo?|lij|terilnico|bireto|gorilnik", "Besides filter paper, filtering needs a?|funnel|mortar|burette|burner"],
  [2, "Delo s strupenimi hlapi poteka?|v digestoriju|ob oknu|na hodniku|na delovni mizi", "Work with toxic vapours is done?|in a fume hood|by the window|in the corridor|at the bench"],
  [3, "Oznaka H na etiketi pomeni?|stavek o nevarnosti|previdnostni stavek|hitro vnetljivo|vroče", "Label code H stands for?|hazard statement|precaution statement|highly flammable|hot"],
  [3, "Oznaka P na etiketi pomeni?|previdnostni stavek|stavek o nevarnosti|strupeno|pod tlakom", "Label code P stands for?|precaution statement|hazard statement|poison|pressurized"],
  [3, "Koliko je piktogramov za nevarnost (GHS)?|9|5|12|7", "How many GHS hazard pictograms are there?|9|5|12|7"],
  [3, "Opozorilna beseda za hujšo nevarnost?|nevarno|pozor|opozorilo|previdno", "Signal word for the more severe hazard?|Danger|Warning|Caution|Attention"],
  [3, "Razlito kislino na mizi najprej?|posujemo z NaHCO3|posujemo z NaOH|obrišemo z roko|polijemo z etanolom", "Acid spilled on the bench: first?|cover with NaHCO3|cover with NaOH|wipe it by hand|pour ethanol on it"],
  [3, "Kaj navaja varnostni list snovi?|nevarnosti in ukrepe|ceno|logotip proizvajalca|rok trajanja", "What does a safety data sheet list?|hazards and measures|the price|the maker's logo|expiry date"],
  [3, "Najbolj vroč del nesvetlečega plamena?|vrh modrega stožca|notranjost stožca|dno plamena|zunanji rob", "Hottest part of a blue burner flame?|tip of the blue cone|inside the cone|base of the flame|outer edge"],
  [3, "Zakaj vode ne vlivamo v koncentrirano kislino?|lahko brizgne|nastane strup|kislina zmrzne|nič se ne zgodi", "Why not pour water into concentrated acid?|it may spatter|a poison forms|the acid freezes|nothing happens"],
]);
def("k2_lab", "km_vez", 8, "GHS", "Varno delo v laboratoriju", "Lab safety", LAB);

// ---------- Kemijska reakcija, ohranitev mase ----------
const MRX = [
  ["C + O2 -> CO2", [12, 32], [44]],
  ["S + O2 -> SO2", [32, 32], [64]],
  ["Fe + S -> FeS", [56, 32], [88]],
  ["2 Mg + O2 -> 2 MgO", [48, 32], [80]],
  ["2 H2 + O2 -> 2 H2O", [4, 32], [36]],
  ["CaCO3 -> CaO + CO2", [100], [56, 44]],
  ["NaOH + HCl -> NaCl + H2O", [40, 36.5], [58.5, 18]],
  ["2 Cu + O2 -> 2 CuO", [127, 32], [159]],
];
function massQ(ctx, anyUnknown) {
  const [eq, re, pr] = pick(MRX);
  const k = pick(re.length + pr.length > 3 ? [1, 2] : [0.5, 1, 2, 3, 5]);
  const r = re.map((x) => rd(x * k)), p = pr.map((x) => rd(x * k));
  const all = [...r, ...p];
  const idx = anyUnknown ? R(0, all.length - 1) : r.length + R(0, p.length - 1);
  const show = (x, i) => (i === idx ? "x" : `${ctx.num(x)} g`);
  const lhs = r.map((x, i) => show(x, i)).join(" + "), rhs = p.map((x, i) => show(x, i + r.length)).join(" + ");
  const known = all.filter((_, i) => i !== idx);
  const ws = [known.reduce((s, x) => s + x, 0), ...known, all[idx] * 2];
  if (known.length >= 2) ws.push(Math.abs(known[0] - known[1]));
  return nq(ctx, `${F(eq)}; ${lhs} → ${rhs}. x = ?`, all[idx], "g", ws);
}
const EXC = [
  ["C", "O2", "CO2", 12, 32],
  ["Fe", "S", "FeS", 56, 32],
  ["S", "O2", "SO2", 32, 32],
  ["Mg", "O2", "MgO", 48, 32],
  ["H2", "O2", "H2O", 4, 32],
];
function excQ(ctx) {
  const [A, B, P, mA, mB] = pick(EXC);
  const k = pick([0.5, 1, 2]), e = pick([2, 4, 5, 8, 10]);
  const exA = Math.random() < 0.4;
  const a = rd(mA * k + (exA ? e : 0)), b = rd(mB * k + (exA ? 0 : e)), p = rd((mA + mB) * k);
  const X = exA ? A : B;
  const q = L(ctx, `${ctx.num(a)} g ${F(A)} in ${ctx.num(b)} g ${F(B)} → ${ctx.num(p)} g ${F(P)}. Koliko ${F(X)} ostane?`, `${ctx.num(a)} g ${F(A)} and ${ctx.num(b)} g ${F(B)} → ${ctx.num(p)} g ${F(P)}. ${F(X)} left over?`);
  return nq(ctx, q, e, "g", [Math.abs(b - a), Math.abs(p - (exA ? a : b)), a + b - p + e, exA ? a : b, 2 * e]);
}
const MASS = bank([
  [1, "Snovi, ki vstopajo v reakcijo, so?|reaktanti|produkti|katalizatorji|topila", "Substances that enter a reaction are?|reactants|products|catalysts|solvents"],
  [1, "Snovi, ki pri reakciji nastanejo, so?|produkti|reaktanti|katalizatorji|indikatorji", "Substances formed in a reaction are?|products|reactants|catalysts|indicators"],
  [1, "Celotna masa snovi pri kemijski reakciji?|se ohrani|se poveča|se zmanjša|se podvoji", "Total mass in a chemical reaction?|stays the same|increases|decreases|doubles"],
  [1, "Pri kemijski reakciji se atomi?|preuredijo|uničijo|ustvarijo iz nič|spremenijo v druge", "In a chemical reaction, atoms are?|rearranged|destroyed|created from nothing|turned into others"],
  [1, "Kaj NI znak kemijske spremembe?|taljenje ledu|nastanek plina|sprememba barve|nastanek oborine", "Which is NOT a sign of a chemical change?|melting ice|a gas forms|colour change|a precipitate forms"],
  [1, "Kaj je kemijska sprememba?|gorenje papirja|taljenje voska|vrenje vode|lomljenje stekla", "Which is a chemical change?|burning paper|melting wax|boiling water|breaking glass"],
  [1, "Na levi strani kemijske enačbe so?|reaktanti|produkti|samo elementi|samo plini", "The left side of a chemical equation shows?|reactants|products|only elements|only gases"],
  [2, "Sveča gori na tehtnici v odprtem prostoru. Masa?|se zmanjša|se poveča|ostane enaka|niha", "A candle burns on a balance in open air. Mass?|decreases|increases|stays the same|oscillates"],
  [2, "Magnezij zgori na zraku. Masa trdnega produkta je?|večja od mase Mg|manjša od mase Mg|enaka masi Mg|nič", "Magnesium burns in air. Mass of solid product?|greater than Mg|less than Mg|equal to Mg|zero"],
  [2, "Železni žebelj zarjavi. Njegova masa?|se poveča|se zmanjša|ostane enaka|izgine", "An iron nail rusts. Its mass?|increases|decreases|stays the same|vanishes"],
  [2, "Apnenec segrevamo v odprti posodi. Masa trdnine?|se zmanjša|se poveča|ostane enaka|se podvoji", "Limestone is heated in an open dish. Solid mass?|decreases|increases|stays the same|doubles"],
  [2, "Reakcija, pri kateri nastane plin, v zaprti posodi. Masa?|ostane enaka|se poveča|se zmanjša|je nič", "A gas forms in a sealed flask. Total mass?|stays the same|increases|decreases|becomes zero"],
  [2, "Masa se pri reakciji ohrani, ker se ohrani?|število atomov|število molekul|prostornina|barva", "Mass is conserved because what is conserved?|number of atoms|number of molecules|volume|colour"],
  [2, "Pri gorenju lesa nastanejo pepel in?|plini|samo voda|kovine|nič drugega", "Burning wood gives ash and?|gases|only water|metals|nothing else"],
  [3, "Masno razmerje m(C) : m(O) v CO2?|3 : 8|1 : 2|12 : 16|3 : 4", "Mass ratio m(C) : m(O) in CO2?|3 : 8|1 : 2|12 : 16|3 : 4"],
  [3, "Masno razmerje m(H) : m(O) v vodi?|1 : 8|2 : 1|1 : 16|1 : 2", "Mass ratio m(H) : m(O) in water?|1 : 8|2 : 1|1 : 16|1 : 2"],
  [3, "Masno razmerje m(Fe) : m(S) v FeS?|7 : 4|1 : 1|56 : 16|2 : 1", "Mass ratio m(Fe) : m(S) in FeS?|7 : 4|1 : 1|56 : 16|2 : 1"],
  [3, "Masno razmerje m(Mg) : m(O) v MgO?|3 : 2|1 : 1|24 : 32|2 : 3", "Mass ratio m(Mg) : m(O) in MgO?|3 : 2|1 : 1|24 : 32|2 : 3"],
]);
def("k2_mass", "km_rea", 8, "Σm", "Kemijska reakcija in ohranitev mase", "Reactions and conservation of mass", (t, ctx) => {
  if (t === 1) return Math.random() < 0.5 ? massQ(ctx, false) : MASS(1, ctx);
  if (t === 2) return Math.random() < 0.5 ? massQ(ctx, true) : MASS(2, ctx);
  const r = Math.random();
  return r < 0.5 ? excQ(ctx) : r < 0.7 ? massQ(ctx, true) : MASS(3, ctx);
});

// ---------- Energija pri reakcijah (OŠ) ----------
const EXO = bank([
  [1, "Pri eksotermni reakciji se okolica?|segreje|ohladi|ne spremeni|namagneti", "In an exothermic reaction the surroundings?|warm up|cool down|stay the same|become magnetic"],
  [1, "Pri endotermni reakciji se okolica?|ohladi|segreje|ne spremeni|zasveti", "In an endothermic reaction the surroundings?|cool down|warm up|stay the same|glow"],
  [1, "Reakcija, ki toploto sprošča, je?|eksotermna|endotermna|ravnotežna|počasna", "A reaction that releases heat is?|exothermic|endothermic|at equilibrium|slow"],
  [1, "Reakcija, ki toploto porablja, je?|endotermna|eksotermna|hitra|ravnotežna", "A reaction that takes in heat is?|endothermic|exothermic|fast|at equilibrium"],
  [1, "Energija, potrebna za začetek reakcije, je energija?|aktivacijska|vezna|jedrska|svetlobna", "Energy needed to start a reaction?|activation energy|bond energy|nuclear energy|light energy"],
  [1, "Hladilni obkladek (NH4NO3 v vodi) deluje, ker je proces?|endotermen|eksotermen|jedrski|električen", "A cold pack (NH4NO3 in water) works because it is?|endothermic|exothermic|nuclear|electric"],
  [1, "Grelni obkladek (oksidacija železa) je proces?|eksotermen|endotermen|jedrski|fizikalen", "A hand warmer (iron oxidizing) is?|exothermic|endothermic|nuclear|physical"],
  [1, "Epruveta se med reakcijo ohladi. Reakcija je?|endotermna|eksotermna|nevtralizacija|gorenje", "A test tube gets cold during a reaction. It is?|endothermic|exothermic|a neutralization|a combustion"],
  [1, "Čaša se med reakcijo segreje. Reakcija je?|eksotermna|endotermna|fotosinteza|taljenje", "A beaker warms up during a reaction. It is?|exothermic|endothermic|photosynthesis|melting"],
  [2, "Pri nastanku kemijskih vezi se energija?|sprosti|porabi|uniči|ne spremeni", "When chemical bonds form, energy is?|released|absorbed|destroyed|unchanged"],
  [2, "Za cepitev kemijskih vezi je energijo treba?|dovesti|odvesti|uničiti|zanemariti", "Breaking chemical bonds requires energy to be?|supplied|released|destroyed|ignored"],
  [2, "Produkti imajo manj energije kot reaktanti. Reakcija je?|eksotermna|endotermna|nemogoča|ravnotežna", "Products have less energy than reactants. It is?|exothermic|endothermic|impossible|at equilibrium"],
  [2, "Produkti imajo več energije kot reaktanti. Reakcija je?|endotermna|eksotermna|nemogoča|eksplozija", "Products have more energy than reactants. It is?|endothermic|exothermic|impossible|an explosion"],
  [2, "Raztapljanje NaOH v vodi je?|eksotermno|endotermno|brez toplote|jedrsko", "Dissolving NaOH in water is?|exothermic|endothermic|energy-neutral|nuclear"],
  [2, "Gašenje apna (CaO + H2O) je?|eksotermno|endotermno|fotokemijsko|jedrsko", "Slaking lime (CaO + H2O) is?|exothermic|endothermic|photochemical|nuclear"],
  [2, "Celično dihanje je proces, ki je?|eksotermen|endotermen|jedrski|fizikalen", "Cellular respiration is?|exothermic|endothermic|nuclear|physical"],
  [2, "Pri zmrzovanju voda toploto?|oddaja|sprejema|uničuje|ustvarja", "When water freezes, heat is?|given off|taken in|destroyed|created"],
]);
function eDiag(ctx) {
  const vals = [50, 100, 150, 200, 250, 300, 400];
  const Er = pick(vals);
  let Ep;
  do Ep = pick(vals); while (Ep === Er);
  const d = Math.abs(Er - Ep), s = Er + Ep;
  const rel = (x) => L(ctx, `sprosti se ${ctx.num(x)} kJ`, `releases ${ctx.num(x)} kJ`);
  const abs = (x) => L(ctx, `porabi se ${ctx.num(x)} kJ`, `absorbs ${ctx.num(x)} kJ`);
  const q = L(ctx, `Energija reaktantov ${ctx.num(Er)} kJ, produktov ${ctx.num(Ep)} kJ. Reakcija?`, `Reactant energy ${ctx.num(Er)} kJ, products ${ctx.num(Ep)} kJ. Reaction?`);
  return out(q, Er > Ep ? rel(d) : abs(d), [Er > Ep ? abs(d) : rel(d), rel(s), abs(s)]);
}
function bondQ(ctx) {
  const b = pick([300, 400, 500, 600, 800, 900]);
  let f;
  do f = pick([200, 300, 450, 600, 700, 1000]); while (f === b);
  const d = Math.abs(b - f);
  const rel = (x) => L(ctx, `sprosti se ${ctx.num(x)} kJ`, `releases ${ctx.num(x)} kJ`);
  const abs = (x) => L(ctx, `porabi se ${ctx.num(x)} kJ`, `absorbs ${ctx.num(x)} kJ`);
  const q = L(ctx, `Cepitev vezi: ${ctx.num(b)} kJ, nastanek vezi: ${ctx.num(f)} kJ. Reakcija?`, `Bonds broken: ${ctx.num(b)} kJ, bonds formed: ${ctx.num(f)} kJ. Reaction?`);
  return out(q, f > b ? rel(d) : abs(d), [f > b ? abs(d) : rel(d), rel(b + f), abs(b + f)]);
}
function eaRev(ctx) {
  const exo = Math.random() < 0.6;
  const Ea = pick([40, 60, 80, 100, 120, 150]);
  const dH = pick([20, 30, 50, 70].filter((x) => x !== Ea && (exo || x < Ea)));
  const rev = exo ? Ea + dH : Ea - dH;
  const q = exo
    ? L(ctx, `Eₐ = ${ctx.num(Ea)} kJ, reakcija sprosti ${ctx.num(dH)} kJ. Eₐ obratne reakcije?`, `Eₐ = ${ctx.num(Ea)} kJ, reaction releases ${ctx.num(dH)} kJ. Reverse Eₐ?`)
    : L(ctx, `Eₐ = ${ctx.num(Ea)} kJ, reakcija porabi ${ctx.num(dH)} kJ. Eₐ obratne reakcije?`, `Eₐ = ${ctx.num(Ea)} kJ, reaction absorbs ${ctx.num(dH)} kJ. Reverse Eₐ?`);
  return nq(ctx, q, rev, "kJ", [Ea, dH, exo ? Ea - dH : Ea + dH, exo ? Ea + 2 * dH : Ea - 2 * dH]);
}
def("k2_exo", "km_rea", 8, "Eₐ", "Energija pri reakcijah", "Energy in reactions", (t, ctx) => {
  if (t === 1) return Math.random() < 0.3 ? eDiag(ctx) : EXO(1, ctx);
  if (t === 2) return Math.random() < 0.5 ? eDiag(ctx) : EXO(2, ctx);
  const r = Math.random();
  return r < 0.35 ? eaRev(ctx) : r < 0.7 ? bondQ(ctx) : r < 0.85 ? eDiag(ctx) : EXO(2, ctx);
});

// ---------- Kovine, nekovine ----------
const FAM = [
  [["litij", "lithium"], ["natrij", "sodium"], ["kalij", "potassium"], ["rubidij", "rubidium"], ["cezij", "caesium"]],
  [["berilij", "beryllium"], ["magnezij", "magnesium"], ["kalcij", "calcium"], ["stroncij", "strontium"], ["barij", "barium"]],
  [["fluor", "fluorine"], ["klor", "chlorine"], ["brom", "bromine"], ["jod", "iodine"]],
  [["helij", "helium"], ["neon", "neon"], ["argon", "argon"], ["kripton", "krypton"], ["ksenon", "xenon"]],
];
const FAMN = [
  ["alkalijska kovina", "an alkali metal"],
  ["zemeljskoalkalijska kovina", "an alkaline earth metal"],
  ["halogen", "a halogen"],
  ["žlahtni plin", "a noble gas"],
];
function famQ(ctx, fams) {
  const f = pick(fams);
  const lang = ctx.lang === "sl" ? 0 : 1;
  const a = pick(FAM[f])[lang];
  const ws = [0, 1, 2, 3].filter((g) => g !== f).map((g) => pick(FAM[g])[lang]);
  return out(L(ctx, `Kateri element je ${FAMN[f][0]}?`, `Which element is ${FAMN[f][1]}?`), a, ws);
}
const METAL = bank([
  [1, "Edina kovina, ki je pri sobni temperaturi tekoča?|živo srebro|natrij|aluminij|baker", "The only metal that is liquid at room temperature?|mercury|sodium|aluminium|copper"],
  [1, "Kovine dobro prevajajo?|toploto in elektriko|samo zvok|samo svetlobo|nič", "Metals are good conductors of?|heat and electricity|only sound|only light|nothing"],
  [1, "Lastnost, da kovino lahko skujemo v tanek list?|kovnost|krhkost|prevodnost|trdota", "A metal can be hammered into sheets. Property?|malleability|brittleness|conductivity|hardness"],
  [1, "Alkalijske kovine so v skupini?|1|2|17|18", "Alkali metals are in group?|1|2|17|18"],
  [1, "Zemeljskoalkalijske kovine so v skupini?|2|1|13|18", "Alkaline earth metals are in group?|2|1|13|18"],
  [1, "Natrij hranimo pod?|petrolejem|vodo|kisom|milnico", "Sodium is stored under?|paraffin oil|water|vinegar|soapy water"],
  [1, "Natrij lahko režemo z nožem, ker je?|mehak|tekoč|krhek|plinast", "Sodium can be cut with a knife because it is?|soft|liquid|brittle|a gas"],
  [1, "Zlitina bakra in cinka je?|medenina|bron|jeklo|amalgam", "An alloy of copper and zinc is?|brass|bronze|steel|amalgam"],
  [1, "Zlitina bakra in kositra je?|bron|medenina|jeklo|amalgam", "An alloy of copper and tin is?|bronze|brass|steel|amalgam"],
  [1, "Jeklo je zlitina železa in?|ogljika|bakra|zlata|natrija", "Steel is iron alloyed with?|carbon|copper|gold|sodium"],
  [1, "Najbolj razširjena kovina v Zemljini skorji?|aluminij|železo|zlato|baker", "Most abundant metal in Earth's crust?|aluminium|iron|gold|copper"],
  [1, "Katera kovina rjavi?|železo|zlato|platina|srebro", "Which metal rusts?|iron|gold|platinum|silver"],
  [2, "Natrij z vodo da NaOH in?|vodik|kisik|klor|ogljikov dioksid", "Sodium and water give NaOH and?|hydrogen|oxygen|chlorine|carbon dioxide"],
  [2, "Raztopina, ki nastane iz natrija in vode, je?|bazična|kisla|nevtralna|oksidativna", "The solution from sodium and water is?|basic|acidic|neutral|oxidizing"],
  [2, "Najbolj reaktivna izmed Li, Na in K?|K|Li|Na|vse enako", "Most reactive of Li, Na and K?|K|Li|Na|all equal"],
  [2, "Reaktivnost alkalijskih kovin navzdol po skupini?|narašča|pada|je enaka|najprej pada", "Reactivity of alkali metals down the group?|increases|decreases|stays equal|first decreases"],
  [2, "Plamen obarva rumeno?|natrij|kalij|litij|baker", "Which colours a flame yellow?|sodium|potassium|lithium|copper"],
  [2, "Plamen obarva vijolično?|kalij|natrij|litij|baker", "Which colours a flame lilac?|potassium|sodium|lithium|copper"],
  [2, "Plamen obarva rdeče?|litij|natrij|kalij|baker", "Which colours a flame red?|lithium|sodium|potassium|copper"],
  [2, "Vodna raztopina Ca(OH)2 se imenuje?|apnica|apnenec|soda|slanica", "An aqueous solution of Ca(OH)2 is called?|limewater|limestone|soda|brine"],
  [2, "Gorenje magnezija daje svetlobo?|bleščeče belo|rdečo|modro|zeleno", "Burning magnesium gives light that is?|brilliant white|red|blue|green"],
  [2, "Formula živega apna?|CaO|Ca(OH)2|CaCO3|CaCl2", "Formula of quicklime?|CaO|Ca(OH)2|CaCO3|CaCl2"],
  [2, "Formula apnenca?|CaCO3|CaO|Ca(OH)2|CaSO4", "Formula of limestone?|CaCO3|CaO|Ca(OH)2|CaSO4"],
  [2, "Število zunanjih elektronov alkalijske kovine?|1|2|7|8", "Outer electrons of an alkali metal?|1|2|7|8"],
  [3, "2 Na + 2 H2O -> 2 NaOH + ?|H2|O2|H2O2|Na2O", "2 Na + 2 H2O -> 2 NaOH + ?|H2|O2|H2O2|Na2O"],
  [3, "Ca + 2 H2O -> Ca(OH)2 + ?|H2|O2|CaO|2 H2", "Ca + 2 H2O -> Ca(OH)2 + ?|H2|O2|CaO|2 H2"],
  [3, "2 Mg + O2 -> ?|2 MgO|MgO2|Mg2O|2 MgO2", "2 Mg + O2 -> ?|2 MgO|MgO2|Mg2O|2 MgO2"],
  [3, "Koeficient: ? K + 2 H2O -> 2 KOH + H2|2|1|4|3", "Coefficient: ? K + 2 H2O -> 2 KOH + H2|2|1|4|3"],
  [3, "Naboj iona zemeljskoalkalijske kovine?|2+|1+|2−|3+", "Charge of an alkaline earth metal ion?|2+|1+|2−|3+"],
  [3, "Zakaj alkalijskih kovin v naravi ni v elementarni obliki?|so zelo reaktivne|so redke|so plini|so pretežke", "Why are alkali metals never found free?|they're too reactive|they're too rare|they're gases|they're too heavy"],
  [3, "Kovine prevajajo elektriko zaradi?|prostih elektronov|ionov v raztopini|protonov|nevtronov", "Metals conduct electricity because of?|free electrons|ions in solution|protons|neutrons"],
  [3, "Trdo vodo povzročajo predvsem ioni?|Ca^2+ in Mg^2+|Na^+ in K^+|Cl^- in Br^-|Fe^3+ in Al^3+", "Hard water is caused mainly by?|Ca^2+ and Mg^2+|Na^+ and K^+|Cl^- and Br^-|Fe^3+ and Al^3+"],
  [3, "Kovina, pridobljena z elektrolizo taline Al2O3?|aluminij|železo|baker|zlato", "Metal made by electrolysis of molten Al2O3?|aluminium|iron|copper|gold"],
  [3, "Železo pridobivamo iz rude v?|plavžu|elektrolizerju|digestoriju|apnenici", "Iron is extracted from ore in a?|blast furnace|electrolytic cell|fume hood|lime kiln"],
]);
def("k2_metal", "km_atom", 8, "Na", "Kovine", "Metals", (t, ctx) => (t === 1 && Math.random() < 0.3 ? famQ(ctx, [0, 1]) : METAL(t, ctx)));

const NONMET = bank([
  [1, "Žlahtni plini so v skupini?|18|17|1|2", "Noble gases are in group?|18|17|1|2"],
  [1, "Halogeni so v skupini?|17|18|16|1", "Halogens are in group?|17|18|16|1"],
  [1, "Žlahtni plini so nereaktivni, ker imajo?|polno zunanjo lupino|en zunanji elektron|velike atome|naboj", "Noble gases are unreactive because they have?|a full outer shell|one outer electron|large atoms|a charge"],
  [1, "Plin, ki v svetlobnih napisih sveti rdeče?|neon|klor|kisik|dušik", "Gas in signs glowing red?|neon|chlorine|oxygen|nitrogen"],
  [1, "Negorljiv plin, lažji od zraka, za balone?|helij|vodik|neon|klor", "Non-flammable gas, lighter than air, for balloons?|helium|hydrogen|neon|chlorine"],
  [1, "Halogen, ki je pri sobni temperaturi tekoč?|brom|klor|fluor|jod", "Halogen that is liquid at room temperature?|bromine|chlorine|fluorine|iodine"],
  [1, "Halogen, ki je pri sobni temperaturi trdna snov?|jod|brom|klor|fluor", "Halogen that is solid at room temperature?|iodine|bromine|chlorine|fluorine"],
  [1, "Klor je pri sobni temperaturi?|plin|tekočina|trdnina|kovina", "At room temperature chlorine is a?|gas|liquid|solid|metal"],
  [1, "Halogeni tvorijo ione z nabojem?|1−|1+|2−|2+", "Halogens form ions with charge?|1−|1+|2−|2+"],
  [1, "Žlahtni plin, ki ga je v zraku največ?|argon|helij|neon|kripton", "Most common noble gas in air?|argon|helium|neon|krypton"],
  [1, "Kuhinjska sol je spojina natrija in?|klora|fluora|joda|broma", "Table salt is a compound of sodium and?|chlorine|fluorine|iodine|bromine"],
  [1, "Jodovica obarva škrob?|modro-črno|rdeče|zeleno|rumeno", "Iodine solution turns starch?|blue-black|red|green|yellow"],
  [2, "Najbolj reaktiven halogen?|fluor|klor|brom|jod", "Most reactive halogen?|fluorine|chlorine|bromine|iodine"],
  [2, "Reaktivnost halogenov navzdol po skupini?|pada|narašča|je enaka|najprej narašča", "Reactivity of halogens down the group?|decreases|increases|stays equal|first increases"],
  [2, "Halogeni so v elementarnem stanju?|dvoatomne molekule|posamezni atomi|ioni|kovine", "As elements, halogens exist as?|diatomic molecules|single atoms|ions|metals"],
  [2, "Cl2 + 2 KBr -> 2 KCl + ?|Br2|Cl2|KBr2|2 Br2", "Cl2 + 2 KBr -> 2 KCl + ?|Br2|Cl2|KBr2|2 Br2"],
  [2, "Ali klor izpodrine jod iz raztopine KI?|da|ne|le v talini|le pri segrevanju", "Does chlorine displace iodine from KI(aq)?|yes|no|only when molten|only when heated"],
  [2, "Ali jod izpodrine klor iz raztopine NaCl?|ne|da|le v talini|le na svetlobi", "Does iodine displace chlorine from NaCl(aq)?|no|yes|only when molten|only in light"],
  [2, "Plin, s katerim polnijo žarnice namesto zraka?|argon|kisik|klor|vodik", "Gas used in light bulbs instead of air?|argon|oxygen|chlorine|hydrogen"],
  [2, "Formula ozona?|O3|O2|O|O4", "Formula of ozone?|O3|O2|O|O4"],
  [2, "Diamant in grafit sta obliki elementa?|ogljik|silicij|žveplo|fosfor", "Diamond and graphite are forms of?|carbon|silicon|sulfur|phosphorus"],
  [2, "Dušika je v zraku približno?|78 %|21 %|1 %|50 %", "About how much of air is nitrogen?|78 %|21 %|1 %|50 %"],
  [2, "Kisika je v zraku približno?|21 %|78 %|1 %|50 %", "About how much of air is oxygen?|21 %|78 %|1 %|50 %"],
  [3, "Zunanjih elektronov ima halogen?|7|1|8|6", "Outer electrons in a halogen atom?|7|1|8|6"],
  [3, "2 Na + Cl2 -> ?|2 NaCl|NaCl2|Na2Cl|NaCl", "2 Na + Cl2 -> ?|2 NaCl|NaCl2|Na2Cl|NaCl"],
  [3, "H2 + Cl2 -> ?|2 HCl|HCl|H2Cl2|HCl2", "H2 + Cl2 -> ?|2 HCl|HCl|H2Cl2|HCl2"],
  [3, "Halogen, ki ga potrebuje ščitnica?|jod|klor|fluor|brom", "Halogen needed by the thyroid gland?|iodine|chlorine|fluorine|bromine"],
  [3, "Zobne paste ščitijo sklenino z ioni?|fluoridnimi|kloridnimi|bromidnimi|jodidnimi", "Toothpaste protects enamel with which ions?|fluoride|chloride|bromide|iodide"],
  [3, "Klor dodajajo pitni vodi za?|razkuževanje|mehčanje|barvanje|okus", "Chlorine is added to drinking water for?|disinfection|softening|colour|flavour"],
  [3, "Helij je v balonih varnejši od vodika, ker?|ni gorljiv|je lažji|je cenejši|je barven", "Helium is safer than hydrogen in balloons as it?|isn't flammable|is lighter|is cheaper|is coloured"],
  [3, "Žlahtni plini obstajajo kot?|enoatomni plini|dvoatomne molekule|kristali|ioni", "Noble gases exist as?|single atoms|diatomic molecules|crystals|ions"],
  [3, "Kateri žlahtni plin je radioaktiven?|radon|neon|argon|helij", "Which noble gas is radioactive?|radon|neon|argon|helium"],
]);
def("k2_nonmet", "km_atom", 8, "X₂", "Nekovine: halogeni in žlahtni plini", "Nonmetals: halogens and noble gases", (t, ctx) => (t === 1 && Math.random() < 0.3 ? famQ(ctx, [2, 3]) : NONMET(t, ctx)));

// =====================================================================
// 9. RAZRED
// =====================================================================
// ---------- Računanje z množino snovi ----------
const MOLS = [
  ["H2O", 18, { H: 2, O: 1 }],
  ["CO2", 44, { C: 1, O: 2 }],
  ["NH3", 17, { N: 1, H: 3 }],
  ["CH4", 16, { C: 1, H: 4 }],
  ["H2SO4", 98, { H: 2, S: 1, O: 4 }],
  ["C2H6", 30, { C: 2, H: 6 }],
  ["O2", 32, { O: 2 }],
  ["N2", 28, { N: 2 }],
  ["SO2", 64, { S: 1, O: 2 }],
  ["C3H8", 44, { C: 3, H: 8 }],
  ["C6H12O6", 180, { C: 6, H: 12, O: 6 }],
];
const atomsOf = (m) => Object.values(m[2]).reduce((s, x) => s + x, 0);
function molnT1(ctx) {
  if (Math.random() < 0.25) {
    const [A, B] = shuffle(MOLS).slice(0, 2);
    const n = pick([1, 2, 0.5, 3]);
    const q = L(ctx, `${ctx.num(n)} mol ${F(A[0])} ali ${ctx.num(n)} mol ${F(B[0])}: kje je več molekul?`, `${ctx.num(n)} mol ${F(A[0])} or ${ctx.num(n)} mol ${F(B[0])}: more molecules?`);
    return out(q, L(ctx, "enako", "same number"), [F(A[0]), F(B[0]), L(ctx, "ni mogoče vedeti", "can't tell")]);
  }
  const m = pick(MOLS);
  const el = pick(Object.keys(m[2]));
  const c = m[2][el], n = pick([0.5, 1, 2, 3, 4, 5]);
  const q = L(ctx, `Množina atomov ${el} v ${ctx.num(n)} mol ${F(m[0])}?`, `Amount of ${el} atoms in ${ctx.num(n)} mol ${F(m[0])}?`);
  return nq(ctx, q, n * c, "mol", [n, c, n + c, 2 * n * c, rd(n / c), n * atomsOf(m)]);
}
function molnT2(ctx) {
  if (Math.random() < 0.35) {
    const set = shuffle(MOLS.filter((m) => m[0] !== "C3H8")).slice(0, 4);
    const few = Math.random() < 0.4;
    const best = set.reduce((b, m) => ((few ? m[1] > b[1] : m[1] < b[1]) ? m : b));
    const mass = pick([10, 20, 50, 100]);
    const q = few ? L(ctx, `Po ${mass} g snovi: kje je najmanj molekul?`, `${mass} g of each: fewest molecules?`) : L(ctx, `Po ${mass} g snovi: kje je največ molekul?`, `${mass} g of each: most molecules?`);
    return out(q, F(best[0]), set.filter((m) => m !== best).map((m) => F(m[0])));
  }
  const m = pick(MOLS), n = pick([0.5, 1, 2, 0.1, 0.25, 3]);
  const mass = rd(n * m[1]);
  const q = L(ctx, `Število molekul v ${ctx.num(mass)} g ${F(m[0])}?`, `Number of molecules in ${ctx.num(mass)} g ${F(m[0])}?`);
  return out(q, sci(ctx, n * NA), [sci(ctx, mass * NA), sci(ctx, NA / n), sci(ctx, n * NA * atomsOf(m)), sci(ctx, n * NA * 10)], [sci(ctx, n * NA / 10), sci(ctx, m[1] * NA)]);
}
function molnT3(ctx) {
  if (Math.random() < 0.4) {
    const m = pick(MOLS), n = pick([0.5, 2, 0.1, 0.25, 3]);
    const q = L(ctx, `Masa ${sci(ctx, n * NA)} molekul ${F(m[0])}?`, `Mass of ${sci(ctx, n * NA)} molecules of ${F(m[0])}?`);
    return nq(ctx, q, n * m[1], "g", [m[1], rd(m[1] / n), n, n * m[1] * 2]);
  }
  const m = pick(MOLS.filter((x) => Object.keys(x[2]).length > 1)), n = pick([0.5, 1, 2, 0.1, 0.25]);
  const el = pick(Object.keys(m[2])), c = m[2][el];
  const mass = rd(n * m[1]);
  const q = L(ctx, `Število atomov ${el} v ${ctx.num(mass)} g ${F(m[0])}?`, `Number of ${el} atoms in ${ctx.num(mass)} g ${F(m[0])}?`);
  return out(q, sci(ctx, n * c * NA), [sci(ctx, n * NA), sci(ctx, n * NA * atomsOf(m)), sci(ctx, mass * c * NA), sci(ctx, n * c * NA * 10)], [sci(ctx, n * c * NA / 10)]);
}
def("k2_moln", "km_kol", 9, "N", "Masa, množina in število delcev", "Mass, amount and number of particles", (t, ctx) => (t === 1 ? molnT1(ctx) : t === 2 ? molnT2(ctx) : molnT3(ctx)));

// ---------- Ogljik in organske spojine ----------
const COND = [
  ["CH3–CH3", 2, 6], ["CH3–CH2–CH3", 3, 8], ["CH3–CH2–CH2–CH3", 4, 10], ["CH3–CH2–CH2–CH2–CH3", 5, 12],
  ["CH3–CH(CH3)–CH3", 4, 10], ["CH2=CH2", 2, 4], ["CH2=CH–CH3", 3, 6], ["CH2=CH–CH2–CH3", 4, 8],
  ["CH3–CH=CH–CH3", 4, 8], ["CH≡CH", 2, 2], ["CH≡C–CH3", 3, 4], ["CH3–C(CH3)2–CH3", 5, 12],
];
const fCH = (c, h) => F(`C${c > 1 ? c : ""}H${h}`);
function condQ(ctx) {
  const [s, c, h] = pick(COND);
  const q = L(ctx, `Molekulska formula spojine ${F(s)}?`, `Molecular formula of ${F(s)}?`);
  return out(q, fCH(c, h), [fCH(c, h + 2), fCH(c, h - 2), fCH(c, 2 * c + 2), fCH(c + 1, h), fCH(c, h + 1)].filter((x) => !x.includes("H₀")));
}
function bondCount(ctx) {
  const n = R(1, 6), h = 2 * n + 2;
  if (n > 2 && Math.random() < 0.4) {
    const q = L(ctx, `Število vezi C–C v nerazvejanem ${fCH(n, h)}?`, `Number of C–C bonds in unbranched ${fCH(n, h)}?`);
    return ints(q, n - 1, [n, n + 1, h, n - 2]);
  }
  const q = L(ctx, `Skupno število kovalentnih vezi v ${fCH(n, h)}?`, `Total number of covalent bonds in ${fCH(n, h)}?`);
  return ints(q, 3 * n + 1, [h, n - 1, 3 * n, 3 * n + 2, 4 * n]);
}
function noExist(ctx) {
  const n = R(1, 4);
  const bad = fCH(n, 2 * n + 3);
  const okF = ["CH4", "C2H6", "C3H8", "C4H10", "C2H4", "C3H6", "C4H8", "C2H2", "C3H4", "C4H6"].map(F);
  return out(L(ctx, "Katera molekulska formula ne more obstajati?", "Which molecular formula cannot exist?"), bad, shuffle(okF).slice(0, 3));
}
function singleBonds(ctx) {
  const n = R(2, 5);
  const q = L(ctx, `Število enojnih vezi v alkenu ${fCH(n, 2 * n)}?`, `Number of single bonds in the alkene ${fCH(n, 2 * n)}?`);
  return ints(q, 3 * n - 2, [3 * n - 1, 3 * n, 2 * n, n - 1], 1);
}
const CARBON = bank([
  [1, "Koliko kovalentnih vezi tvori atom ogljika?|4|2|3|1", "How many covalent bonds does carbon form?|4|2|3|1"],
  [1, "Organske spojine vedno vsebujejo?|ogljik|kisik|dušik|klor", "Organic compounds always contain?|carbon|oxygen|nitrogen|chlorine"],
  [1, "Katera spojina je organska?|CH4|CO2|CaCO3|CO", "Which compound is organic?|CH4|CO2|CaCO3|CO"],
  [1, "Katera spojina NI organska?|CaCO3|CH4|C2H5OH|C6H12O6", "Which compound is NOT organic?|CaCO3|CH4|C2H5OH|C6H12O6"],
  [1, "Ogljik je v periodnem sistemu v skupini?|14|12|16|2", "Carbon is in periodic table group?|14|12|16|2"],
  [1, "Vezi med atomoma C in H so?|kovalentne|ionske|kovinske|vodikove", "Bonds between C and H atoms are?|covalent|ionic|metallic|hydrogen bonds"],
  [1, "Večino organskih spojin gradijo elementi?|C, H, O, N|Na, Cl, K|Fe, Cu, Zn|He, Ne, Ar", "Most organic compounds are built from?|C, H, O, N|Na, Cl, K|Fe, Cu, Zn|He, Ne, Ar"],
  [1, "Atomi ogljika tvorijo dolge verige, ker se vežejo?|med seboj|le s kisikom|le z vodikom|ionsko", "Carbon forms long chains because its atoms bond?|to each other|only to oxygen|only to hydrogen|ionically"],
  [3, "Kakšno obliko ima molekula metana?|tetraedrično|linearno|ravninsko|kvadratno", "Shape of a methane molecule?|tetrahedral|linear|flat triangle|square"],
  [3, "Kot med vezmi v metanu je približno?|109,5°|90°|120°|180°", "Bond angle in methane is about?|109.5°|90°|120°|180°"],
  [3, "Ogljikovodik z eno trojno vezjo je?|alkin|alken|alkan|aren", "A hydrocarbon with one triple bond is an?|alkyne|alkene|alkane|arene"],
]);
def("k2_carbon", "km_org", 9, "C", "Ogljik in organske spojine", "Carbon and organic compounds", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.5 ? condQ(ctx) : CARBON(1, ctx);
  if (t === 2) return r < 0.35 ? bondCount(ctx) : r < 0.6 ? noExist(ctx) : r < 0.85 ? condQ(ctx) : CARBON(1, ctx);
  return r < 0.35 ? singleBonds(ctx) : r < 0.6 ? bondCount(ctx) : r < 0.75 ? noExist(ctx) : CARBON(3, ctx);
});

// ---------- Nafta, zemeljski plin, gorenje ----------
const HC = [["CH4", 1, 4], ["C2H6", 2, 6], ["C3H8", 3, 8], ["C4H10", 4, 10], ["C5H12", 5, 12], ["C2H4", 2, 4], ["C3H6", 3, 6], ["C2H2", 2, 2], ["C6H14", 6, 14]];
function combQ(ctx) {
  const [f, x, y] = pick(HC);
  let k = 1, o = x + y / 4;
  if (!Number.isInteger(o) || !Number.isInteger(y / 2)) k = 2;
  const A = k, O = o * k, Cc = x * k, W = (y / 2) * k;
  const c = (n) => (n > 1 ? n + " " : "");
  const askO = Math.random() < 0.65;
  const eq = `${c(A)}${F(f)} + ${askO ? "?" : c(O).trim() || "1"} O₂ → ${c(Cc)}CO₂ + ${askO ? c(W) : "? "}H₂O`.replace("+ 1 O₂", "+ O₂");
  const q = L(ctx, `Koeficient: ${eq}`, `Coefficient: ${eq}`);
  if (askO) return ints(q, O, [2 * Cc + W, Cc + W, O + 1, O - 1, Math.round(o)], 1);
  return ints(q, W, [y * k, W / 2, W + 1, Cc], 1);
}
const FUELS = [["CH4", 16, 1], ["C2H6", 30, 2], ["C3H8", 44, 3], ["C2H4", 28, 2], ["C4H10", 58, 4]];
function co2Q(ctx) {
  const [f, M, x] = pick(FUELS);
  const n = pick([0.5, 1, 2, 0.25, 0.1]);
  const m = rd(n * M);
  if (Math.random() < 0.3) {
    const O = x + (FUELS.find((u) => u[0] === f)[1] - 12 * x) / 4;
    const q = L(ctx, `Masa O₂ za popoln sežig ${ctx.num(m)} g ${F(f)}?`, `Mass of O₂ to burn ${ctx.num(m)} g ${F(f)} completely?`);
    return nq(ctx, q, n * O * 32, "g", [n * 32, n * O * 16, m, n * x * 32]);
  }
  const q = L(ctx, `Zgori ${ctx.num(m)} g ${F(f)}. Masa nastalega CO₂?`, `${ctx.num(m)} g of ${F(f)} burns. Mass of CO₂ formed?`);
  return nq(ctx, q, n * x * 44, "g", [m, n * 44, x * m, n * x * 12]);
}
const FUEL = bank([
  [1, "Glavna sestavina zemeljskega plina?|metan|etan|propan|butan", "Main component of natural gas?|methane|ethane|propane|butane"],
  [1, "Nafto v rafineriji ločujejo na frakcije s postopkom?|destilacija|filtracija|kristalizacija|sublimacija", "Crude oil is split into fractions by?|distillation|filtration|crystallization|sublimation"],
  [1, "Pri popolnem gorenju ogljikovodika nastaneta?|CO2 in H2O|CO in H2|C in H2O|CO2 in H2", "Complete combustion of a hydrocarbon gives?|CO2 and H2O|CO and H2|C and H2O|CO2 and H2"],
  [1, "Pri nepopolnem gorenju nastaja strupen plin?|CO|CO2|O2|N2", "Incomplete combustion produces the toxic gas?|CO|CO2|O2|N2"],
  [1, "Utekočinjeni naftni plin je predvsem?|propan in butan|metan|etan|vodik", "Liquefied petroleum gas is mainly?|propane and butane|methane|ethane|hydrogen"],
  [1, "Katero gorivo NI fosilno?|les|premog|nafta|zemeljski plin", "Which fuel is NOT a fossil fuel?|wood|coal|crude oil|natural gas"],
  [1, "Toplogredni plin, ki nastaja pri gorenju goriv?|CO2|O2|N2|Ar", "Greenhouse gas formed when fuels burn?|CO2|O2|N2|Ar"],
  [1, "Kisli dež povzroča predvsem?|SO2|CH4|O2|N2", "Acid rain is caused mainly by?|SO2|CH4|O2|N2"],
  [1, "Nafta je zmes predvsem?|ogljikovodikov|alkoholov|kislin|soli", "Crude oil is mainly a mixture of?|hydrocarbons|alcohols|acids|salts"],
  [1, "Zemeljskemu plinu dodajo dišavo, ker je sam?|brez vonja|strupen|barven|težak", "Natural gas gets an odorant because it is?|odourless|toxic|coloured|heavy"],
  [1, "Bencin in dizelsko gorivo sta frakciji?|nafte|zemeljskega plina|premoga|lesa", "Petrol and diesel are fractions of?|crude oil|natural gas|coal|wood"],
  [1, "Za gorenje potrebujemo gorivo, kisik in?|vžigno temperaturo|vodo|dušik|katalizator", "Burning needs fuel, oxygen and?|ignition temperature|water|nitrogen|a catalyst"],
  [3, "Pri destilaciji nafte se najprej (pri najnižji T) loči?|plin|bencin|dizel|bitumen", "In oil distillation, the lowest-boiling fraction is?|gas|petrol|diesel|bitumen"],
  [3, "Z daljšanjem verige alkana se vrelišče?|zviša|zniža|ne spremeni|izgubi", "As alkane chains get longer, the boiling point?|rises|falls|stays the same|vanishes"],
  [3, "Pri krekingu dolge verige ogljikovodikov razpadejo na?|krajše|daljše|atome|ione", "In cracking, long hydrocarbon chains are split into?|shorter ones|longer ones|atoms|ions"],
]);
def("k2_fuel", "km_org", 9, "CH₄", "Nafta, zemeljski plin in gorenje", "Oil, natural gas and combustion", (t, ctx) => {
  if (t === 1) return FUEL(1, ctx);
  if (t === 2) return Math.random() < 0.6 ? combQ(ctx) : FUEL(1, ctx);
  const r = Math.random();
  return r < 0.5 ? co2Q(ctx) : r < 0.75 ? combQ(ctx) : FUEL(3, ctx);
});

// ---------- Amini in aminokisline ----------
const AMINO = bank([
  [1, "Amini so derivati?|amoniaka|metana|vode|etanola", "Amines are derived from?|ammonia|methane|water|ethanol"],
  [1, "Funkcionalna skupina aminov?|–NH2|–OH|–COOH|–CHO", "Functional group of amines?|–NH2|–OH|–COOH|–CHO"],
  [1, "Aminokislina ima skupini?|–NH2 in –COOH|–OH in –CHO|–NH2 in –OH|–COOH in –CHO", "An amino acid has the groups?|–NH2 and –COOH|–OH and –CHO|–NH2 and –OH|–COOH and –CHO"],
  [1, "Iz aminokislin so zgrajene?|beljakovine|maščobe|škrob|celuloza", "Amino acids are the building blocks of?|proteins|fats|starch|cellulose"],
  [1, "Najpreprostejša aminokislina?|glicin|alanin|glukoza|metanol", "The simplest amino acid?|glycine|alanine|glucose|methanol"],
  [1, "Esencialne aminokisline moramo?|dobiti s hrano|tvoriti sami|izločati|shranjevati v kosteh", "Essential amino acids must be?|taken in with food|made by the body|excreted|stored in bones"],
  [1, "Vonj po gnilih ribah povzročajo?|amini|alkoholi|estri|sladkorji", "The smell of rotting fish comes from?|amines|alcohols|esters|sugars"],
  [1, "Vodna raztopina amina je?|bazična|kisla|nevtralna|oksidativna", "An aqueous solution of an amine is?|basic|acidic|neutral|oxidizing"],
  [1, "Približno koliko aminokislin gradi beljakovine?|20|5|100|1000", "About how many amino acids build proteins?|20|5|100|1000"],
  [1, "Formula metilamina?|CH3NH2|CH3OH|CH3COOH|NH3", "Formula of methylamine?|CH3NH2|CH3OH|CH3COOH|NH3"],
  [1, "Element, ki ga vsebujejo vsi amini?|dušik|žveplo|klor|fosfor", "Element found in every amine?|nitrogen|sulfur|chlorine|phosphorus"],
  [1, "Glicin je?|aminokislina|amin|alkohol|sladkor", "What is glycine?|an amino acid|an amine|an alcohol|a sugar"],
  [2, "Formula glicina?|H2N–CH2–COOH|CH3–CH2–OH|H2N–CH3|CH3–COOH", "Formula of glycine?|H2N–CH2–COOH|CH3–CH2–OH|H2N–CH3|CH3–COOH"],
  [2, "Stranska veriga alanina?|–CH3|–H|–OH|–COOH", "Side chain of alanine?|–CH3|–H|–OH|–COOH"],
  [2, "CH3–NH2 je?|primarni amin|sekundarni amin|terciarni amin|amid", "CH3–NH2 is a?|primary amine|secondary amine|tertiary amine|amide"],
  [2, "(CH3)2NH je?|sekundarni amin|primarni amin|terciarni amin|amid", "(CH3)2NH is a?|secondary amine|primary amine|tertiary amine|amide"],
  [2, "(CH3)3N je?|terciarni amin|primarni amin|sekundarni amin|amid", "(CH3)3N is a?|tertiary amine|primary amine|secondary amine|amide"],
  [2, "Ime spojine CH3–CH2–CH2–NH2?|propilamin|etilamin|propanol|butilamin", "Name of CH3–CH2–CH2–NH2?|propylamine|ethylamine|propanol|butylamine"],
  [2, "Ime spojine CH3–CH2–NH2?|etilamin|metilamin|etanol|etanamid", "Name of CH3–CH2–NH2?|ethylamine|methylamine|ethanol|ethanamide"],
  [2, "Amini reagirajo s kislinami, ker so?|baze|kisline|soli|oksidanti", "Amines react with acids because they are?|bases|acids|salts|oxidants"],
  [2, "Katera spojina je aminokislina?|H2N–CH2–COOH|CH3–COOH|CH3–NH2|HO–CH2–CHO", "Which compound is an amino acid?|H2N–CH2–COOH|CH3–COOH|CH3–NH2|HO–CH2–CHO"],
  [2, "Katera spojina je amin?|CH3–NH2|CH3–OH|CH3–COOH|CH3–CHO", "Which compound is an amine?|CH3–NH2|CH3–OH|CH3–COOH|CH3–CHO"],
  [3, "Ko se povežeta dve aminokislini, se izloči?|voda|amoniak|CO2|vodik", "When two amino acids join, what is released?|water|ammonia|CO2|hydrogen"],
  [3, "Iz treh aminokislin nastane?|tripeptid|dipeptid|polisaharid|triglicerid", "Three amino acids joined give a?|tripeptide|dipeptide|polysaccharide|triglyceride"],
  [3, "Molekulska formula glicina?|C2H5NO2|C2H4NO2|C2H5NO|CH5N", "Molecular formula of glycine?|C2H5NO2|C2H4NO2|C2H5NO|CH5N"],
  [3, "Molska masa glicina C2H5NO2?|75 g/mol|74 g/mol|89 g/mol|61 g/mol", "Molar mass of glycine C2H5NO2?|75 g/mol|74 g/mol|89 g/mol|61 g/mol"],
  [3, "Vez med aminokislinami v beljakovini?|peptidna|glikozidna|estrska|ionska", "Bond between amino acids in a protein?|peptide|glycosidic|ester|ionic"],
  [3, "Molekulska formula metilamina CH3NH2?|CH5N|CH3N|CH4N|C2H7N", "Molecular formula of methylamine CH3NH2?|CH5N|CH3N|CH4N|C2H7N"],
  [3, "Katera aminokislina vsebuje žveplo?|cistein|glicin|alanin|serin", "Which amino acid contains sulfur?|cysteine|glycine|alanine|serine"],
]);
def("k2_amino", "km_org", 9, "NH₂", "Amini in aminokisline", "Amines and amino acids", AMINO);

// ---------- Ogljikovi hidrati ----------
const CARB = bank([
  [1, "Molekulska formula glukoze?|C6H12O6|C12H22O11|C6H6|C6H10O5", "Molecular formula of glucose?|C6H12O6|C12H22O11|C6H6|C6H10O5"],
  [1, "Glukoza nastaja v rastlinah pri?|fotosintezi|dihanju|gorenju|vrenju", "Plants make glucose by?|photosynthesis|respiration|combustion|fermentation"],
  [1, "Reagent za dokaz škroba?|jodovica|apnica|fenolftalein|lakmus", "Test reagent for starch?|iodine solution|limewater|phenolphthalein|litmus"],
  [1, "Kuhinjski sladkor je?|saharoza|glukoza|škrob|celuloza", "Table sugar is?|sucrose|glucose|starch|cellulose"],
  [1, "Celuloza gradi rastlinske?|celične stene|mišice|kosti|lase", "Cellulose builds plant?|cell walls|muscles|bones|hairs"],
  [1, "Živali shranjujejo glukozo v obliki?|glikogena|škroba|celuloze|saharoze", "Animals store glucose as?|glycogen|starch|cellulose|sucrose"],
  [1, "Zaloga energije v gomoljih krompirja?|škrob|celuloza|glikogen|saharoza", "Energy store in potato tubers?|starch|cellulose|glycogen|sucrose"],
  [1, "Sadni sladkor je?|fruktoza|laktoza|škrob|celuloza", "Fruit sugar is?|fructose|lactose|starch|cellulose"],
  [1, "Mlečni sladkor je?|laktoza|fruktoza|saharoza|celuloza", "Milk sugar is?|lactose|fructose|sucrose|cellulose"],
  [1, "Ogljikove hidrate gradijo elementi?|C, H, O|C, H, N|C, O, S|C, H, Cl", "Carbohydrates are made of?|C, H, O|C, H, N|C, O, S|C, H, Cl"],
  [1, "Glukoza je?|monosaharid|disaharid|polisaharid|lipid", "Glucose is a?|monosaccharide|disaccharide|polysaccharide|lipid"],
  [1, "Škrob je?|polisaharid|monosaharid|disaharid|beljakovina", "Starch is a?|polysaccharide|monosaccharide|disaccharide|protein"],
  [1, "Saharoza je?|disaharid|monosaharid|polisaharid|aminokislina", "Sucrose is a?|disaccharide|monosaccharide|polysaccharide|amino acid"],
  [2, "Saharoza razpade na glukozo in?|fruktozo|galaktozo|škrob|celulozo", "Sucrose breaks down into glucose and?|fructose|galactose|starch|cellulose"],
  [2, "Laktoza razpade na glukozo in?|galaktozo|fruktozo|škrob|saharozo", "Lactose breaks down into glucose and?|galactose|fructose|starch|sucrose"],
  [2, "Škrob in celuloza sta zgrajena iz enot?|glukoze|fruktoze|saharoze|aminokislin", "Starch and cellulose are built from?|glucose|fructose|sucrose|amino acids"],
  [2, "Fehlingov reagent je pozitiven za?|glukozo|saharozo|škrob|maščobe", "Fehling's test is positive for?|glucose|sucrose|starch|fat"],
  [2, "Alkoholno vrenje glukoze da etanol in?|CO2|O2|H2O|H2", "Alcoholic fermentation of glucose gives ethanol and?|CO2|O2|H2O|H2"],
  [2, "6 CO2 + 6 H2O -> C6H12O6 + ?|6 O2|3 O2|6 H2|12 O2", "6 CO2 + 6 H2O -> C6H12O6 + ?|6 O2|3 O2|6 H2|12 O2"],
  [2, "C6H12O6 + 6 O2 -> 6 CO2 + ?|6 H2O|12 H2O|3 H2O|6 H2", "C6H12O6 + 6 O2 -> 6 CO2 + ?|6 H2O|12 H2O|3 H2O|6 H2"],
  [2, "C6H12O6 -> 2 C2H5OH + ?|2 CO2|CO2|2 CO|6 CO2", "C6H12O6 -> 2 C2H5OH + ?|2 CO2|CO2|2 CO|6 CO2"],
  [2, "Molska masa glukoze?|180 g/mol|342 g/mol|162 g/mol|90 g/mol", "Molar mass of glucose?|180 g/mol|342 g/mol|162 g/mol|90 g/mol"],
  [3, "Molska masa saharoze C12H22O11?|342 g/mol|360 g/mol|180 g/mol|324 g/mol", "Molar mass of sucrose C12H22O11?|342 g/mol|360 g/mol|180 g/mol|324 g/mol"],
  [3, "Ko iz glukoze in fruktoze nastane saharoza, se izloči?|voda|CO2|kisik|vodik", "When glucose and fructose form sucrose, what is released?|water|CO2|oxygen|hydrogen"],
  [3, "Vez med enotami monosaharidov?|glikozidna|peptidna|estrska|ionska", "Bond linking monosaccharide units?|glycosidic|peptide|ester|ionic"],
  [3, "Glukoza in fruktoza imata enako?|molekulsko formulo|strukturno formulo|okus|ime", "Glucose and fructose have the same?|molecular formula|structural formula|taste|name"],
  [3, "Riboza spada med?|pentoze|heksoze|disaharide|polisaharide", "Ribose is a?|pentose|hexose|disaccharide|polysaccharide"],
  [3, "Glikogen je shranjen v?|jetrih in mišicah|kosteh|koži|krvni plazmi", "Glycogen is stored in the?|liver and muscles|bones|skin|blood plasma"],
  [3, "Polisaharid v oklepu žuželk?|hitin|celuloza|škrob|glikogen", "Polysaccharide in insect exoskeletons?|chitin|cellulose|starch|glycogen"],
  [3, "Koliko etanola nastane pri vrenju 1 mol glukoze?|2 mol|1 mol|6 mol|3 mol", "Fermenting 1 mol glucose gives how much ethanol?|2 mol|1 mol|6 mol|3 mol"],
  [3, "Masa CO2 pri alkoholnem vrenju 180 g glukoze?|88 g|44 g|180 g|264 g", "Mass of CO2 from fermenting 180 g glucose?|88 g|44 g|180 g|264 g"],
]);
def("k2_carb", "km_org", 9, "C₆", "Ogljikovi hidrati", "Carbohydrates", CARB);

// ---------- Maščobe ----------
const FAT = bank([
  [1, "Maščobe se v vodi?|ne raztapljajo|dobro raztapljajo|razkrojijo|vnamejo", "In water, fats?|don't dissolve|dissolve well|decompose|ignite"],
  [1, "Olje plava na vodi, ker ima?|manjšo gostoto|večjo gostoto|enako gostoto|več vode", "Oil floats on water because of its?|lower density|higher density|equal density|water content"],
  [1, "Rastlinske maščobe so pri sobni T večinoma?|tekoče|trdne|plinaste|kristalne", "At room temperature, plant fats are mostly?|liquid|solid|gaseous|crystalline"],
  [1, "Živalske maščobe so pri sobni T večinoma?|trdne|tekoče|plinaste|hlapne", "At room temperature, animal fats are mostly?|solid|liquid|gaseous|volatile"],
  [1, "Maščoba na papirju pusti madež, ki je?|prosojen|moder|rdeč|črn", "Fat on paper leaves a spot that is?|translucent|blue|red|black"],
  [1, "Glavna vloga maščob v telesu?|zaloga energije|prenos kisika|prenos dednine|gradnja kosti", "Main role of fat in the body?|energy store|oxygen transport|carrying genes|building bones"],
  [1, "V čem se maščobe dobro raztapljajo?|v bencinu|v vodi|v kisu|v slanici", "Fats dissolve well in?|petrol|water|vinegar|brine"],
  [1, "Koliko maščobnih kislin je vezanih na glicerol?|3|1|2|4", "How many fatty acids are bound to glycerol?|3|1|2|4"],
  [1, "Maščobe gradijo elementi?|C, H, O|C, H, N|C, H, S|C, H, Cl", "Fats are made of?|C, H, O|C, H, N|C, H, S|C, H, Cl"],
  [1, "Milo dobimo iz maščobe in?|NaOH|HCl|vode|kisa", "Soap is made from fat and?|NaOH|HCl|water|vinegar"],
  [1, "Nasičene maščobne kisline imajo v verigi?|samo enojne vezi|dvojne vezi|trojne vezi|obroče", "Saturated fatty acids have?|only single bonds|double bonds|triple bonds|rings"],
  [1, "En gram maščobe da več energije kot gram?|sladkorja|olja|masti|loja", "A gram of fat gives more energy than a gram of?|sugar|oil|lard|tallow"],
  [2, "Koliko skupin OH ima glicerol?|3|1|2|4", "How many OH groups does glycerol have?|3|1|2|4"],
  [2, "Tekoča olja vsebujejo več?|nenasičenih kislin|nasičenih kislin|beljakovin|soli", "Liquid oils contain more?|unsaturated acids|saturated acids|protein|salt"],
  [2, "Strjevanje olj (hidrogeniranje) je adicija?|vodika|kisika|vode|klora", "Hardening oils is the addition of?|hydrogen|oxygen|water|chlorine"],
  [2, "Maščobe na zraku žarkijo zaradi?|oksidacije|redukcije|nevtralizacije|taljenja", "Fats go rancid because of?|oxidation|reduction|neutralization|melting"],
  [2, "Bazična hidroliza maščobe se imenuje?|umiljenje|esterifikacija|polimerizacija|vrenje", "Basic hydrolysis of a fat is called?|saponification|esterification|polymerization|fermentation"],
  [2, "Pri umiljenju poleg mila nastane?|glicerol|etanol|glukoza|ocetna kislina", "Saponification gives soap and?|glycerol|ethanol|glucose|acetic acid"],
  [2, "Stearinska kislina je?|nasičena|nenasičena|aromatska|anorganska", "Stearic acid is?|saturated|unsaturated|aromatic|inorganic"],
  [2, "Število dvojnih vezi C=C v oleinski kislini?|1|0|2|3", "Number of C=C bonds in oleic acid?|1|0|2|3"],
  [2, "Del molekule mila, ki se veže na maščobo?|nepolarni rep|polarna glava|ion Na^+|voda", "Part of a soap molecule that binds grease?|nonpolar tail|polar head|the Na^+ ion|water"],
  [2, "Holesterol uvrščamo med?|lipide|ogljikove hidrate|beljakovine|aminokisline", "Cholesterol is a?|lipid|carbohydrate|protein|amino acid"],
  [2, "Formula glicerola?|C3H5(OH)3|C2H5OH|CH3OH|C3H7OH", "Formula of glycerol?|C3H5(OH)3|C2H5OH|CH3OH|C3H7OH"],
  [3, "Naravne maščobne kisline imajo navadno ? število C|sodo|liho|vedno 3|vedno 6", "Natural fatty acids usually have an ? number of C|even|odd|always 3|always 6"],
  [3, "Koliko molekul vode se izloči pri nastanku triglicerida?|3|1|2|6", "How many water molecules form with one triglyceride?|3|1|2|6"],
  [3, "Več dvojnih vezi C=C v maščobi pomeni, da je?|bolj nenasičena|bolj nasičena|bolj trdna|brez glicerola", "More C=C bonds in a fat means it is?|more unsaturated|more saturated|more solid|glycerol-free"],
  [3, "Trans maščobe nastajajo pri delnem?|hidrogeniranju|gorenju|umiljenju|vrenju", "Trans fats form during partial?|hydrogenation|combustion|saponification|fermentation"],
]);
const FA = [["C15H31COOH", 15, 31], ["C17H35COOH", 17, 35], ["C17H33COOH", 17, 33], ["C17H31COOH", 17, 31], ["C17H29COOH", 17, 29], ["C15H29COOH", 15, 29]];
function faQ(ctx) {
  const [f, c, h] = pick(FA);
  const d = (2 * c + 1 - h) / 2;
  return ints(L(ctx, `Število dvojnih vezi C=C v ${F(f)}?`, `Number of C=C bonds in ${F(f)}?`), d, [d + 1, d + 2, d - 1, 2 * d]);
}
def("k2_fat", "km_org", 9, "C₁₇", "Maščobe", "Fats", (t, ctx) => (t === 3 && Math.random() < 0.4 ? faQ(ctx) : FAT(t, ctx)));

// ---------- Beljakovine ----------
const PROT = bank([
  [1, "Beljakovine so zgrajene iz?|aminokislin|glukoze|maščobnih kislin|glicerola", "Proteins are built from?|amino acids|glucose|fatty acids|glycerol"],
  [1, "Element v beljakovinah, ki ga v maščobah ni?|dušik|ogljik|vodik|kisik", "Element in proteins but not in fats?|nitrogen|carbon|hydrogen|oxygen"],
  [1, "Encimi so po zgradbi večinoma?|beljakovine|maščobe|škrob|sladkorji", "Enzymes are mostly?|proteins|fats|starch|sugars"],
  [1, "Pri kuhanju jajca beljakovine?|denaturirajo|se raztopijo|izhlapijo|postanejo sladkor", "When an egg is cooked, its proteins?|denature|dissolve|evaporate|turn into sugar"],
  [1, "Kaj NE povzroči denaturacije beljakovin?|hladna voda|vročina|močna kislina|težke kovine", "What does NOT denature proteins?|cold water|heat|strong acid|heavy metals"],
  [1, "Beljakovina v laseh in nohtih?|keratin|hemoglobin|inzulin|kolagen", "Protein in hair and nails?|keratin|haemoglobin|insulin|collagen"],
  [1, "Beljakovina, ki v krvi prenaša kisik?|hemoglobin|keratin|kolagen|inzulin", "Protein that carries oxygen in blood?|haemoglobin|keratin|collagen|insulin"],
  [1, "Hormon inzulin je po zgradbi?|beljakovina|maščoba|sladkor|steroid", "The hormone insulin is a?|protein|fat|sugar|steroid"],
  [1, "Peptidna vez povezuje skupini?|–COOH in –NH2|–OH in –OH|–COOH in –OH|–NH2 in –NH2", "A peptide bond joins the groups?|–COOH and –NH2|–OH and –OH|–COOH and –OH|–NH2 and –NH2"],
  [1, "Dober vir beljakovin v prehrani?|fižol|sladkor|olje|kis", "A good dietary source of protein?|beans|sugar|oil|vinegar"],
  [1, "Biuretni reagent se z beljakovinami obarva?|vijolično|modro|rdeče|zeleno", "Biuret reagent with proteins turns?|violet|blue|red|green"],
  [1, "Koncentrirana HNO3 obarva beljakovine?|rumeno|modro|zeleno|črno", "Concentrated HNO3 turns proteins?|yellow|blue|green|black"],
  [3, "Vijačnica α je del ? zgradbe beljakovine|sekundarne|primarne|terciarne|kvartarne", "The α-helix is part of the ? structure|secondary|primary|tertiary|quaternary"],
  [3, "Zgradba iz več polipeptidnih verig je?|kvartarna|primarna|sekundarna|terciarna", "Structure made of several chains is?|quaternary|primary|secondary|tertiary"],
  [3, "Sekundarno zgradbo stabilizirajo?|vodikove vezi|peptidne vezi|ionske vezi|kovinske vezi", "Secondary structure is held by?|hydrogen bonds|peptide bonds|ionic bonds|metallic bonds"],
  [3, "Disulfidne mostičke tvori aminokislina?|cistein|glicin|alanin|valin", "Disulfide bridges are formed by?|cysteine|glycine|alanine|valine"],
]);
function pepBonds(ctx) {
  const n = pick([3, 4, 5, 8, 10, 20, 50, 100, 150]);
  if (Math.random() < 0.4) {
    const q = L(ctx, `Veriga iz ${n} aminokislin: koliko molekul vode se izloči?`, `Water molecules released forming a chain of ${n} amino acids?`);
    return ints(q, n - 1, [n, n + 1, 2 * n, n - 2], 1);
  }
  const q = L(ctx, `Število peptidnih vezi v verigi iz ${n} aminokislin?`, `Peptide bonds in a chain of ${n} amino acids?`);
  return ints(q, n - 1, [n, n + 1, 2 * n, n - 2], 1);
}
function pepSeq(ctx) {
  const k = pick([2, 3]);
  if (Math.random() < 0.5) {
    const q = L(ctx, `${k} različne aminokisline (vsaka enkrat): koliko tripeptidov?`, `Tripeptides from ${k} different amino acids, each used once?`);
    if (k === 2) return ints(L(ctx, "Iz glicina in alanina (vsak enkrat): koliko dipeptidov?", "Glycine and alanine, each once: how many dipeptides?"), 2, [1, 4, 3]);
    return ints(q, 6, [3, 9, 27, 1]);
  }
  return ints(L(ctx, "Koliko različnih dipeptidov iz Gly in Ala (tudi Gly–Gly)?", "Different dipeptides from Gly and Ala (Gly–Gly allowed)?"), 4, [2, 3, 1, 8]);
}
function pepM(ctx) {
  const AA = [["Gly", 75], ["Ala", 89]];
  const k = pick([2, 3]);
  const seq = Array.from({ length: k }, () => pick(AA));
  const s = seq.reduce((t, x) => t + x[1], 0), M = s - 18 * (k - 1);
  const names = seq.map((x) => x[0]).join("–");
  const q = L(ctx, `Gly 75, Ala 89 g/mol. Molska masa ${names}?`, `Gly 75, Ala 89 g/mol. Molar mass of ${names}?`);
  return nq(ctx, q, M, "g/mol", [s, s - 18 * k, s + 18, s - 18 * (k - 2)]);
}
def("k2_prot", "km_org", 9, "CONH", "Beljakovine", "Proteins", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return PROT(1, ctx);
  if (t === 2) return r < 0.45 ? pepBonds(ctx) : r < 0.6 ? pepSeq(ctx) : PROT(1, ctx);
  return r < 0.4 ? pepM(ctx) : r < 0.6 ? pepBonds(ctx) : r < 0.7 ? pepSeq(ctx) : PROT(3, ctx);
});

// ---------- Polimeri (OŠ) ----------
const POLY = bank([
  [1, "Polimeri so zgrajeni iz manjših enot?|monomerov|ionov|izotopov|kristalov", "Polymers are built from small units called?|monomers|ions|isotopes|crystals"],
  [1, "Kateri polimer je naraven?|celuloza|polieten|PVC|polistiren", "Which polymer is natural?|cellulose|polyethene|PVC|polystyrene"],
  [1, "Kateri polimer je sintetičen?|polieten|škrob|celuloza|beljakovina", "Which polymer is synthetic?|polyethene|starch|cellulose|protein"],
  [1, "Plastika v okolju razpada?|zelo počasi|v nekaj dneh|takoj|v nekaj urah", "In the environment, plastic breaks down?|very slowly|in a few days|instantly|in a few hours"],
  [1, "Za okolje je s plastičnim odpadkom najbolje?|reciklirati ga|zažgati ga doma|odvreči v naravo|zakopati ga", "Best for the environment with plastic waste?|recycle it|burn it at home|dump it in nature|bury it"],
  [1, "Kaj je mikroplastika?|drobci plastike|bakterije|vrsta alg|kristali soli", "What is microplastic?|tiny plastic bits|bacteria|a kind of algae|salt crystals"],
  [1, "Monomer polietena?|eten|etan|etanol|metan", "Monomer of polyethene?|ethene|ethane|ethanol|methane"],
  [1, "Monomer polipropena?|propen|propan|eten|stiren", "Monomer of polypropene?|propene|propane|ethene|styrene"],
  [1, "Monomer PVC?|kloroeten|eten|propen|stiren", "Monomer of PVC?|chloroethene|ethene|propene|styrene"],
  [1, "Penasti polistiren uporabljamo za?|toplotno izolacijo|električne žice|steklenice za pijačo|tkanine", "Expanded polystyrene is used for?|thermal insulation|electric wires|drink bottles|fabrics"],
  [1, "Številka v trikotniku na embalaži pove?|vrsto plastike|ceno|maso|rok uporabe", "The number in the recycling triangle shows?|type of plastic|the price|the mass|expiry date"],
  [1, "Volna in svila sta naravni?|beljakovini|ogljikova hidrata|maščobi|minerala", "Wool and silk are natural?|proteins|carbohydrates|fats|minerals"],
  [1, "Bombaž je skoraj čista?|celuloza|beljakovina|maščoba|plastika", "Cotton is almost pure?|cellulose|protein|fat|plastic"],
  [2, "Termoplasti se pri segrevanju?|zmehčajo|takoj zoglenijo|strdijo|razpočijo", "When heated, thermoplastics?|soften|char at once|harden|burst"],
  [2, "Duroplasti se pri segrevanju?|ne zmehčajo|stalijo|izparijo|raztopijo", "When heated, thermosets?|don't soften|melt|evaporate|dissolve"],
  [2, "Plastika, ki jo lahko ponovno stalimo?|termoplast|duroplast|vulkanizirana guma|strjena smola", "Plastic that can be remelted?|thermoplastic|thermoset|vulcanized rubber|cured resin"],
  [2, "Pri gorenju PVC nastaja strupen plin?|HCl|O2|N2|H2O", "Burning PVC releases the toxic gas?|HCl|O2|N2|H2O"],
  [2, "Pri polimerizaciji etena se prekine?|dvojna vez|vez C–H|enojna vez C–C|molekula na atome", "In ethene polymerization, what breaks?|the double bond|a C–H bond|a C–C single bond|the whole molecule"],
  [2, "Iz kavčuka izdelujejo?|gumo|steklo|papir|beton", "Natural latex rubber is used to make?|rubber goods|glass|paper|concrete"],
  [2, "Poliamidna vlakna so?|sintetična|naravna|kovinska|mineralna", "Polyamide fibres are?|synthetic|natural|metallic|mineral"],
  [2, "Papir je izdelan predvsem iz?|celuloze|škroba|plastike|beljakovin", "Paper is made mainly of?|cellulose|starch|plastic|protein"],
  [2, "Plastenke PET so iz?|poliestra|polietena|PVC|škroba", "PET bottles are made of a?|polyester|polyethene|PVC|starch"],
  [3, "Ponavljajoča enota polietena?|–CH2–CH2–|–CH2=CH2–|–CH3|CH4", "Repeating unit of polyethene?|–CH2–CH2–|–CH2=CH2–|–CH3|CH4"],
  [3, "Ponavljajoča enota PVC?|–CH2–CHCl–|–CH2–CH2–|–CHCl=CHCl–|–CCl2–CCl2–", "Repeating unit of PVC?|–CH2–CHCl–|–CH2–CH2–|–CHCl=CHCl–|–CCl2–CCl2–"],
]);
function chainC(ctx) {
  const n = pick([100, 500, 1000, 2000, 5000]);
  if (Math.random() < 0.5) {
    const q = L(ctx, `Veriga polietena iz ${n} enot etena. Atomov C?`, `Polyethene chain of ${n} ethene units. C atoms?`);
    return ints(q, 2 * n, [n, 4 * n, n / 2, 6 * n]);
  }
  const q = L(ctx, `Molska masa verige iz ${n} enot etena (28 g/mol)?`, `Molar mass of a chain of ${n} ethene units (28 g/mol)?`);
  return nq(ctx, q, 28 * n, "g/mol", [n, 14 * n, 56 * n, 280 * n]);
}
def("k2_poly", "km_org", 9, "(–)ₙ", "Polimeri in plastika", "Polymers and plastics", (t, ctx) => (t === 3 && Math.random() < 0.45 ? chainC(ctx) : POLY(t, ctx)));

// =====================================================================
// 1. LETNIK
// =====================================================================
// ---------- Medmolekulske sile ----------
const HB = ["H2O", "NH3", "HF", "CH3OH", "C2H5OH", "CH3COOH"];
const NOHB = ["CH4", "CO2", "H2S", "HCl", "CH3Cl", "O2", "N2", "CH3–O–CH3", "C2H6", "Cl2"];
const BPSETS = [
  // od najvišjega do najnižjega vrelišča
  ["H2O", "HF", "NH3", "CH4"],
  ["C4H10", "C3H8", "C2H6", "CH4"],
  ["I2", "Br2", "Cl2", "F2"],
  ["Kr", "Ar", "Ne", "He"],
  ["C2H5OH", "CH3–O–CH3", "C3H8", "CH4"],
  ["HF", "HI", "HBr", "HCl"],
  ["H2O", "H2Se", "H2S", "CH4"],
];
const NONPOL = ["CO2", "CH4", "CCl4", "O2", "N2", "Cl2", "BF3"];
const POL = ["H2O", "NH3", "HCl", "CH3Cl", "H2S", "SO2", "HF"];
const IMF = bank([
  [1, "Vodikova vez nastane, ko je H vezan na?|N, O ali F|C ali H|Cl ali S|kovino", "A hydrogen bond forms when H is bonded to?|N, O or F|C or H|Cl or S|a metal"],
  [1, "Najšibkejše medmolekulske sile so?|disperzijske|vodikove vezi|dipol-dipol|ionske vezi", "The weakest intermolecular forces are?|dispersion|hydrogen bonds|dipole-dipole|ionic bonds"],
  [1, "Med nepolarnimi molekulami delujejo?|disperzijske sile|vodikove vezi|ionske vezi|kovalentne vezi", "Between nonpolar molecules act?|dispersion forces|hydrogen bonds|ionic bonds|covalent bonds"],
  [1, "Led plava na vodi zaradi?|vodikovih vezi|disperzijskih sil|ionskih vezi|kovalentnih vezi", "Ice floats on water because of?|hydrogen bonds|dispersion forces|ionic bonds|covalent bonds"],
  [1, "Medmolekulske sile so v primerjavi s kovalentno vezjo?|šibkejše|močnejše|enako močne|neskončne", "Compared with covalent bonds, intermolecular forces are?|weaker|stronger|equally strong|infinite"],
  [1, "Pri vrenju vode se prekinejo?|vodikove vezi|vezi O–H|ionske vezi|kovinske vezi", "When water boils, what breaks?|hydrogen bonds|O–H bonds|ionic bonds|metallic bonds"],
  [3, "H2O ima višje vrelišče od H2S zaradi?|vodikovih vezi|večje molske mase|ionskih vezi|kovinskih vezi", "H2O boils higher than H2S because of?|hydrogen bonds|larger molar mass|ionic bonds|metallic bonds"],
  [3, "Etanol in voda se mešata zaradi?|vodikovih vezi|disperzijskih sil|ionskih vezi|kovinskih vezi", "Ethanol and water mix because of?|hydrogen bonds|dispersion forces|ionic bonds|metallic bonds"],
  [3, "Disperzijske sile so močnejše, če ima molekula?|več elektronov|manj elektronov|nižjo maso|naboj nič", "Dispersion forces are stronger with?|more electrons|fewer electrons|lower mass|fewer atoms"],
  [3, "Pentan ima višje vrelišče od 2,2-dimetilpropana, ker je?|bolj podolgovat|bolj polaren|ionski|lažji", "Pentane boils above 2,2-dimethylpropane as it is?|more elongated|more polar|ionic|lighter"],
]);
function hbQ(ctx) {
  const a = pick(HB);
  const ws = shuffle(NOHB).slice(0, 3);
  return out(L(ctx, "Med molekulami katere snovi so vodikove vezi?", "Which substance forms hydrogen bonds?"), F(a), ws.map(F));
}
function bpQ(ctx) {
  const set = pick(BPSETS);
  const low = Math.random() < 0.4;
  const a = low ? set[3] : set[0];
  return out(L(ctx, low ? "Najnižje vrelišče ima?" : "Najvišje vrelišče ima?", low ? "Lowest boiling point?" : "Highest boiling point?"), F(a), set.filter((x) => x !== a).map(F));
}
function forceQ(ctx) {
  const types = [L(ctx, "vodikove vezi", "hydrogen bonds"), L(ctx, "disperzijske sile", "dispersion forces"), L(ctx, "dipol-dipol", "dipole-dipole"), L(ctx, "ionske vezi", "ionic bonds")];
  if (Math.random() < 0.5) {
    const m = pick(["H2O", "NH3", "HF", "CH3OH"]);
    return out(L(ctx, `Najmočnejše sile med molekulami ${F(m)}?`, `Strongest forces between ${F(m)} molecules?`), types[0], types.slice(1));
  }
  const m = pick(["CH4", "CO2", "I2", "Br2", "N2", "CCl4"]);
  return out(L(ctx, `Med molekulami ${F(m)} delujejo samo?`, `Between ${F(m)} molecules act only?`), types[1], [types[0], types[2], types[3]]);
}
function polQ(ctx) {
  const np = Math.random() < 0.5;
  const a = pick(np ? NONPOL : POL), ws = shuffle(np ? POL : NONPOL).slice(0, 3);
  return out(L(ctx, np ? "Katera molekula je nepolarna?" : "Katera molekula je polarna?", np ? "Which molecule is nonpolar?" : "Which molecule is polar?"), F(a), ws.map(F));
}
function solQ(ctx) {
  if (Math.random() < 0.5) return out(L(ctx, "Katera snov se dobro raztaplja v heksanu?", "Which substance dissolves well in hexane?"), F(pick(["I2", "Br2", "C8H18"])), shuffle(["NaCl", "KNO3", "CuSO4", "C6H12O6"]).slice(0, 3).map(F));
  return out(L(ctx, "Katera snov se dobro raztaplja v vodi?", "Which substance dissolves well in water?"), F(pick(["NaCl", "C2H5OH", "NH3", "C6H12O6"])), shuffle(["I2", "C8H18", "CCl4", "C6H14"]).slice(0, 3).map(F));
}
def("k2_imf", "km_vez", 10, "H··O", "Medmolekulske sile", "Intermolecular forces", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.45 ? hbQ(ctx) : r < 0.65 ? forceQ(ctx) : IMF(1, ctx);
  if (t === 2) return r < 0.45 ? bpQ(ctx) : r < 0.65 ? forceQ(ctx) : r < 0.85 ? polQ(ctx) : hbQ(ctx);
  return r < 0.35 ? bpQ(ctx) : r < 0.6 ? solQ(ctx) : IMF(3, ctx);
});

// ---------- Reakcijska entalpija ----------
const DHR = [
  ["2 H2 + O2 -> 2 H2O", -572],
  ["C + O2 -> CO2", -394],
  ["N2 + 3 H2 -> 2 NH3", -92],
  ["CaCO3 -> CaO + CO2", 178],
  ["CH4 + 2 O2 -> CO2 + 2 H2O", -890],
  ["N2 + O2 -> 2 NO", 180],
  ["2 SO2 + O2 -> 2 SO3", -198],
];
function dhT1(ctx) {
  const [eq, h] = pick(DHR);
  const r = Math.random();
  if (r < 0.45) {
    const q = L(ctx, `${F(eq)}, ΔH = ${kj(ctx, h)}. ΔH v obratni smeri?`, `${F(eq)}, ΔH = ${kj(ctx, h)}. Reverse ΔH?`);
    return out(q, kj(ctx, -h), [kj(ctx, h), kj(ctx, -2 * h), kj(ctx, 2 * h), "0 kJ"]);
  }
  if (r < 0.75 && !eq.startsWith("CH4")) {
    const half = Math.random() < 0.4;
    const q = half
      ? L(ctx, `${F(eq)}, ΔH = ${kj(ctx, h)}. Vsi koeficienti ×½: ΔH?`, `${F(eq)}, ΔH = ${kj(ctx, h)}. All coefficients ×½: ΔH?`)
      : L(ctx, `${F(eq)}, ΔH = ${kj(ctx, h)}. Vsi koeficienti ×2: ΔH?`, `${F(eq)}, ΔH = ${kj(ctx, h)}. All coefficients ×2: ΔH?`);
    const a = half ? h / 2 : 2 * h;
    return out(q, kj(ctx, a), [kj(ctx, h), kj(ctx, -a), kj(ctx, half ? 2 * h : h / 2)]);
  }
  const ex = h < 0;
  const q = L(ctx, `${F(eq)}, ΔH = ${kj(ctx, h)}. Reakcija je?`, `${F(eq)}, ΔH = ${kj(ctx, h)}. The reaction is?`);
  const A = [L(ctx, "eksotermna", "exothermic"), L(ctx, "endotermna", "endothermic")];
  return out(q, ex ? A[0] : A[1], [ex ? A[1] : A[0], L(ctx, "brez toplote", "heat-neutral"), L(ctx, "jedrska", "nuclear")]);
}
const HCOMB = [
  ["CH4", 16, -890, 0], ["C3H8", 44, -2220, 0], ["H2", 2, -286, 0], ["C", 12, -394, 0], ["C2H5OH", 46, -1367, 0], ["CaCO3", 100, 178, 1],
];
function dhT2(ctx) {
  const [f, M, h, dec] = pick(HCOMB);
  const n = pick([0.5, 2, 0.25, 0.1, 3]);
  const m = rd(n * M), Q = rd(Math.abs(h) * n);
  const q = dec
    ? L(ctx, `Razkroj ${F(f)}: ΔH = ${kj(ctx, h)}/mol. Toplota za ${ctx.num(m)} g?`, `Decomposing ${F(f)}: ΔH = ${kj(ctx, h)}/mol. Heat for ${ctx.num(m)} g?`)
    : L(ctx, `Sežig ${F(f)}: ΔH = ${kj(ctx, h)}/mol. Toplota iz ${ctx.num(m)} g?`, `Burning ${F(f)}: ΔH = ${kj(ctx, h)}/mol. Heat from ${ctx.num(m)} g?`);
  return nq(ctx, q, Q, "kJ", [Math.abs(h) * m, rd(Math.abs(h) / n), Math.abs(h), Q * 2]);
}
const HESS = [
  ["CO −111, CO₂ −394", "CO + ½ O₂ → CO₂", -283, [283, -505, -394]],
  ["SO₂ −297, SO₃ −396", "2 SO₂ + O₂ → 2 SO₃", -198, [198, -99, -396]],
  ["C₂H₄ +52, C₂H₆ −85", "C₂H₄ + H₂ → C₂H₆", -137, [137, -33, -85]],
  ["NO +90, NO₂ +33", "2 NO + O₂ → 2 NO₂", -114, [114, -57, 123]],
  ["C₂H₂ +227, C₂H₆ −85", "C₂H₂ + 2 H₂ → C₂H₆", -312, [312, 142, -85]],
  ["CH₄ −75, CO₂ −394, H₂O(l) −286", null, -891, [891, -605, -1041]],
];
const BOND = [
  ["H–H 436, Cl–Cl 242, H–Cl 431", "H₂ + Cl₂ → 2 HCl", -184, [184, 247, -862]],
  ["H–H 436, Br–Br 193, H–Br 366", "H₂ + Br₂ → 2 HBr", -103, [103, 263, -732]],
  ["N≡N 945, H–H 436, N–H 391", "N₂ + 3 H₂ → 2 NH₃", -93, [93, -965, -2346]],
];
function dhT3(ctx) {
  if (Math.random() < 0.6) {
    const [data, eq, a, ws] = pick(HESS);
    const head = L(ctx, `ΔtvH°: ${data}`, `ΔfH°: ${data}`);
    const q = eq ? `${head} kJ/mol. ΔH (${eq})?` : L(ctx, `${head} kJ/mol. ΔH sežiga CH₄?`, `${head} kJ/mol. Burn CH₄: ΔH?`);
    return out(q, kj(ctx, a), ws.map((x) => kj(ctx, x)));
  }
  const [data, eq, a, ws] = pick(BOND);
  return out(`${data} kJ/mol. ΔH (${eq})?`, kj(ctx, a), ws.map((x) => kj(ctx, x)));
}
def("k2_dh", "km_rea", 10, "ΔH", "Reakcijska entalpija", "Reaction enthalpy", (t, ctx) => (t === 1 ? dhT1(ctx) : t === 2 ? (Math.random() < 0.7 ? dhT2(ctx) : dhT1(ctx)) : Math.random() < 0.75 ? dhT3(ctx) : dhT2(ctx)));

// =====================================================================
// 2. LETNIK
// =====================================================================
// ---------- Konjugirani pari (Brønsted) ----------
const PAIRS = [
  ["HCl", "Cl^-"], ["HNO3", "NO3^-"], ["H2SO4", "HSO4^-"], ["HSO4^-", "SO4^2-"], ["H3O^+", "H2O"], ["H2O", "OH^-"],
  ["NH4^+", "NH3"], ["CH3COOH", "CH3COO^-"], ["H2CO3", "HCO3^-"], ["HCO3^-", "CO3^2-"], ["H3PO4", "H2PO4^-"],
  ["H2PO4^-", "HPO4^2-"], ["HF", "F^-"], ["HCN", "CN^-"],
];
const chErr = (s) => (s.endsWith("^2-") ? s.replace("^2-", "^-") : s.endsWith("^-") ? s.replace("^-", "^2-") : s.endsWith("^+") ? s.replace("^+", "") : null);
const ALLSP = [...new Set(PAIRS.flat())];
function conjQ(ctx) {
  const [A, B] = pick(PAIRS);
  if (Math.random() < 0.5) {
    const up = PAIRS.find((p) => p[1] === A);
    const ws = [up && up[0], chErr(B), ...shuffle(ALLSP.filter((s) => s !== A && s !== B)).slice(0, 2)];
    return out(L(ctx, `Konjugirana baza ${F(A)}?`, `Conjugate base of ${F(A)}?`), F(B), ws.filter(Boolean).map(F), shuffle(ALLSP.filter((s) => s !== A && s !== B)).map(F));
  }
  const down = PAIRS.find((p) => p[0] === B);
  const ws = [down && down[1], chErr(A), ...shuffle(ALLSP.filter((s) => s !== A && s !== B)).slice(0, 2)];
  return out(L(ctx, `Konjugirana kislina ${F(B)}?`, `Conjugate acid of ${F(B)}?`), F(A), ws.filter(Boolean).map(F), shuffle(ALLSP.filter((s) => s !== A && s !== B)).map(F));
}
const BLR = [
  ["HCl + H2O -> H3O^+ + Cl^-", "HCl", "H2O", "H3O^+", "Cl^-"],
  ["NH3 + H2O <=> NH4^+ + OH^-", "H2O", "NH3", "NH4^+", "OH^-"],
  ["CH3COOH + H2O <=> CH3COO^- + H3O^+", "CH3COOH", "H2O", "H3O^+", "CH3COO^-"],
  ["HCO3^- + H2O <=> CO3^2- + H3O^+", "HCO3^-", "H2O", "H3O^+", "CO3^2-"],
  ["HCO3^- + H2O <=> H2CO3 + OH^-", "H2O", "HCO3^-", "H2CO3", "OH^-"],
  ["NH4^+ + OH^- <=> NH3 + H2O", "NH4^+", "OH^-", "H2O", "NH3"],
  ["HF + NH3 <=> F^- + NH4^+", "HF", "NH3", "NH4^+", "F^-"],
  ["CO3^2- + H2O <=> HCO3^- + OH^-", "H2O", "CO3^2-", "HCO3^-", "OH^-"],
  ["HNO3 + H2O -> H3O^+ + NO3^-", "HNO3", "H2O", "H3O^+", "NO3^-"],
];
function roleQ(ctx) {
  const [eq, acid, base, cA, cB] = pick(BLR);
  const roles = [
    [acid, "Kislina med reaktanti?", "Acid among the reactants?"],
    [base, "Baza med reaktanti?", "Base among the reactants?"],
    [cB, "Konjugirana baza kisline?", "Conjugate base of the acid?"],
    [cA, "Konjugirana kislina baze?", "Conjugate acid of the base?"],
  ];
  const [a, s, e] = pick(roles);
  return out(`${F(eq)}. ${L(ctx, s, e)}`, F(a), [acid, base, cA, cB].filter((x) => x !== a).map(F));
}
function amphiQ(ctx) {
  const yes = ["H2O", "HCO3^-", "HSO4^-", "H2PO4^-", "HPO4^2-"];
  const no = ["Cl^-", "NH4^+", "SO4^2-", "CO3^2-", "H3O^+", "NO3^-", "F^-", "Na^+"];
  return out(L(ctx, "Katera zvrst je amfiprotna?", "Which species is amphiprotic?"), F(pick(yes)), shuffle(no).slice(0, 3).map(F));
}
const BL = bank([
  [1, "Po Brønstedu je kislina?|donor protona|akceptor protona|donor elektronov|akceptor elektronov", "A Brønsted acid is a?|proton donor|proton acceptor|electron donor|electron acceptor"],
  [1, "Po Brønstedu je baza?|akceptor protona|donor protona|donor elektronov|vir OH^- ionov", "A Brønsted base is a?|proton acceptor|proton donor|electron donor|source of OH^-"],
  [3, "Močnejša kot je kislina, njena konjugirana baza je?|šibkejša|močnejša|enako močna|nevtralna", "The stronger an acid, its conjugate base is?|weaker|stronger|equally strong|neutral"],
  [3, "Vodna raztopina NH4Cl je?|kisla|bazična|nevtralna|brez ionov", "An aqueous NH4Cl solution is?|acidic|basic|neutral|ion-free"],
  [3, "Vodna raztopina CH3COONa je?|bazična|kisla|nevtralna|brez ionov", "An aqueous CH3COONa solution is?|basic|acidic|neutral|ion-free"],
  [3, "Vodna raztopina NaCl je?|nevtralna|kisla|bazična|brez ionov", "An aqueous NaCl solution is?|neutral|acidic|basic|ion-free"],
]);
def("k2_bl", "km_kb", 11, "H⁺", "Konjugirani pari kislin in baz", "Conjugate acid–base pairs", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.75 ? conjQ(ctx) : BL(1, ctx);
  if (t === 2) return r < 0.65 ? roleQ(ctx) : conjQ(ctx);
  return r < 0.35 ? amphiQ(ctx) : r < 0.65 ? roleQ(ctx) : BL(3, ctx);
});

// ---------- Šibke kisline in pufri ----------
const p10 = (k) => `10${sup(-k)}`;
const WEAK = bank([
  [1, "Šibka kislina v vodi?|delno ionizira|popolnoma ionizira|sploh ne ionizira|izpari", "A weak acid in water?|partly ionizes|fully ionizes|doesn't ionize|evaporates"],
  [1, "Pufer je raztopina, ki?|ohranja pH|ima vedno pH 7|je zelo kisla|nevtralizira vse", "A buffer is a solution that?|resists pH change|always has pH 7|is very acidic|neutralizes anything"],
  [1, "Pufer sestavljata šibka kislina in njena?|konjugirana baza|močna baza|sol močne kisline|voda", "A buffer is a weak acid and its?|conjugate base|strong base|strong-acid salt|water"],
  [1, "Primer šibke kisline?|CH3COOH|HCl|HNO3|H2SO4", "An example of a weak acid?|CH3COOH|HCl|HNO3|H2SO4"],
  [1, "Primer šibke baze?|NH3|NaOH|KOH|LiOH", "An example of a weak base?|NH3|NaOH|KOH|LiOH"],
  [1, "Večja kot je Kₐ, kislina je?|močnejša|šibkejša|bolj razredčena|bolj bazična", "The larger Kₐ, the acid is?|stronger|weaker|more dilute|more basic"],
  [1, "Šibka in močna kislina, enaka c. pH šibke je?|višji|nižji|enak|vedno 7", "Weak vs strong acid, same c. pH of the weak one?|higher|lower|equal|always 7"],
  [1, "pKₐ je enak?|−log Kₐ|log Kₐ|1/Kₐ|14 − Kₐ", "pKₐ equals?|−log Kₐ|log Kₐ|1/Kₐ|14 − Kₐ"],
  [3, "Pufer razredčimo z vodo 10-krat. pH se?|skoraj ne spremeni|zviša za 1|zniža za 1|zviša na 7", "A buffer is diluted 10 times. Its pH?|hardly changes|rises by 1|falls by 1|becomes 7"],
  [3, "Pufer v krvi je predvsem?|H2CO3/HCO3^-|HCl/Cl^-|NaOH/Na^+|NH4^+/NH3", "The main buffer in blood is?|H2CO3/HCO3^-|HCl/Cl^-|NaOH/Na^+|NH4^+/NH3"],
  [3, "Kₐ · Kb konjugiranega para je enako?|Kw|1|0|Kₐ", "Kₐ · Kb of a conjugate pair equals?|Kw|1|0|Kₐ"],
]);
function strongestQ(ctx) {
  const set = shuffle([2, 3.2, 4.8, 6.4, 7.2, 9.2, 10.3]).slice(0, 4);
  const weak = Math.random() < 0.4;
  const a = weak ? Math.max(...set) : Math.min(...set);
  if (Math.random() < 0.5) {
    const ks = shuffle([2, 3, 4, 5, 7, 9]).slice(0, 4), b = weak ? Math.max(...ks) : Math.min(...ks);
    return out(L(ctx, weak ? "Najšibkejša kislina ima Kₐ?" : "Najmočnejša kislina ima Kₐ?", weak ? "The weakest acid has Kₐ?" : "The strongest acid has Kₐ?"), p10(b), ks.filter((k) => k !== b).map(p10));
  }
  return out(L(ctx, weak ? "Najšibkejša kislina ima pKₐ?" : "Najmočnejša kislina ima pKₐ?", weak ? "The weakest acid has pKₐ?" : "The strongest acid has pKₐ?"), ctx.num(a), set.filter((x) => x !== a).map((x) => ctx.num(x)));
}
function weakPH(ctx) {
  const pKa = pick([3, 4, 4.8, 5, 6]);
  const k = pick([0, 1, 2, 3].filter((x) => pKa >= x + 2));
  const pH = (pKa + k) / 2;
  const ka = Number.isInteger(pKa) ? `Kₐ = ${p10(pKa)}` : `pKₐ = ${ctx.num(pKa)}`;
  const q = L(ctx, `Šibka kislina: ${ka}, c = ${ctx.num(10 ** -k)} mol/L. pH?`, `Weak acid: ${ka}, c = ${ctx.num(10 ** -k)} mol/L. pH?`);
  return out(q, fx(ctx, pH, 1), [fx(ctx, k, 1), fx(ctx, pKa, 1), fx(ctx, pKa + k, 1), fx(ctx, pH + 1, 1)]);
}
function kaFromPH(ctx) {
  const k = pick([1, 2]);
  const p = pick([2, 3, 4].filter((x) => x > k));
  const e = 2 * p - k;
  const q = L(ctx, `Šibka kislina, c = ${ctx.num(10 ** -k)} mol/L, pH = ${p}. Kₐ?`, `Weak acid, c = ${ctx.num(10 ** -k)} mol/L, pH = ${p}. Kₐ?`);
  return out(q, p10(e), [p10(p), p10(2 * p), p10(2 * p + k), p10(p - k)].filter((s, i) => i < 3 || p - k > 0));
}
const BUF = [[4.8, "CH₃COOH/CH₃COO⁻"], [9.2, "NH₄⁺/NH₃"], [7.2, "H₂PO₄⁻/HPO₄²⁻"], [6.4, "H₂CO₃/HCO₃⁻"]];
function bufQ(ctx) {
  const [pKa] = pick(BUF);
  const [b, a, lg] = pick([[1, 1, 0], [10, 1, 1], [1, 10, -1], [100, 1, 2], [1, 100, -2]]);
  const pH = pKa + lg;
  const q = L(ctx, `Pufer: pKₐ = ${ctx.num(pKa)}; [A⁻] : [HA] = ${b} : ${a}. pH?`, `Buffer: pKₐ = ${ctx.num(pKa)}; [A⁻] : [HA] = ${b} : ${a}. pH?`);
  return out(q, fx(ctx, pH, 1), [fx(ctx, pKa - lg, 1), fx(ctx, pKa, 1), fx(ctx, pKa + 0.5, 1), fx(ctx, 7, 1), fx(ctx, pH + 1, 1)]);
}
def("k2_weak", "km_kb", 11, "Kₐ", "Šibke kisline in pufri", "Weak acids and buffers", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.5 ? strongestQ(ctx) : WEAK(1, ctx);
  if (t === 2) return r < 0.6 ? weakPH(ctx) : r < 0.85 ? kaFromPH(ctx) : strongestQ(ctx);
  return r < 0.5 ? bufQ(ctx) : r < 0.7 ? weakPH(ctx) : WEAK(3, ctx);
});

// ---------- Titracija ----------
const TITR = bank([
  [1, "Fenolftalein je v bazični raztopini?|rožnat|brezbarven|rumen|moder", "In a basic solution phenolphthalein is?|pink|colourless|yellow|blue"],
  [1, "Fenolftalein je v kisli raztopini?|brezbarven|rožnat|vijoličen|moder", "In an acidic solution phenolphthalein is?|colourless|pink|violet|blue"],
  [1, "Iz česa pri titraciji dodajamo titrant?|iz birete|iz pipete|iz merilne bučke|iz lija", "The titrant is added from a?|burette|pipette|volumetric flask|funnel"],
  [1, "pH v ekvivalentni točki titracije HCl z NaOH?|7|1|14|4", "pH at the equivalence point of HCl with NaOH?|7|1|14|4"],
  [1, "Pri titraciji analizirano raztopino damo v?|erlenmajerico|bireto|merilni valj|terilnico", "In a titration, the analyte goes in a?|conical flask|burette|measuring cylinder|mortar"],
  [3, "pH v ekvivalentni točki pri titraciji CH3COOH z NaOH?|nad 7|točno 7|pod 7|0", "pH at equivalence, CH3COOH titrated with NaOH?|above 7|exactly 7|below 7|0"],
  [3, "pH v ekvivalentni točki pri titraciji NH3 s HCl?|pod 7|točno 7|nad 7|14", "pH at equivalence, NH3 titrated with HCl?|below 7|exactly 7|above 7|14"],
]);
const CS = [0.1, 0.2, 0.5, 1], VS = [10, 20, 25, 40, 50];
function titrVol(ctx, diprotic) {
  for (let i = 0; i < 50; i++) {
    const ca = pick(CS), Va = pick(VS), cb = pick(CS);
    const Vb = rd(((diprotic ? 2 : 1) * ca * Va) / cb);
    if (!nice(Vb) || Vb > 200 || Vb < 5 || Math.round(Vb * 10) !== Vb * 10) continue;
    const acid = diprotic ? "H₂SO₄" : "HCl";
    const q = `${acid}: ${Va} mL, ${ctx.num(ca)} mol/L. V(NaOH, ${ctx.num(cb)} mol/L) = ?`;
    return nq(ctx, q, Vb, "mL", diprotic ? [Vb / 2, Vb * 2, Va] : [rd((Va * cb) / ca), Va, Vb * 2, rd(ca * Va * cb)]);
  }
  return nq(ctx, "HCl: 20 mL, 0,1 mol/L. V(NaOH, 0,2 mol/L) = ?".replace(/,(\d)/g, ctx.num(1.5).charAt(1) + "$1"), 10, "mL", [40, 20, 5]);
}
function titrConc(ctx, diprotic) {
  for (let i = 0; i < 50; i++) {
    const ca = pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.5]), Va = pick(VS), cb = pick(CS);
    const Vb = rd(((diprotic ? 2 : 1) * ca * Va) / cb);
    if (!nice(Vb) || Vb > 100 || Vb < 5 || Math.round(Vb * 10) !== Vb * 10) continue;
    const acid = diprotic ? "H₂SO₄" : "HCl";
    const q = L(ctx, `${Va} mL ${acid} porabi ${ctx.num(Vb)} mL NaOH (${ctx.num(cb)} mol/L). c(${acid})?`, `${Va} mL ${acid} uses ${ctx.num(Vb)} mL NaOH (${ctx.num(cb)} mol/L). c(${acid})?`);
    return nq(ctx, q, ca, "mol/L", diprotic ? [ca * 2, ca / 2, cb] : [rd((cb * Va) / Vb), cb, ca * 10, rd(cb * Vb)]);
  }
  return titrVol(ctx, diprotic);
}
function titrMass(ctx) {
  const ca = pick(CS), Va = pick(VS);
  const n = (ca * Va) / 1000, m = rd(40 * n);
  const q = L(ctx, `Masa NaOH, ki nevtralizira ${Va} mL HCl (${ctx.num(ca)} mol/L)?`, `Mass of NaOH that neutralizes ${Va} mL HCl (${ctx.num(ca)} mol/L)?`);
  return nq(ctx, q, m, "g", [m * 1000, rd(36.5 * n), rd(ca * Va), m * 2]);
}
def("k2_titr", "km_kb", 11, "cV", "Titracija", "Titration", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.4 ? titrVol(ctx, false) : r < 0.7 ? titrConc(ctx, false) : TITR(1, ctx);
  if (t === 2) return r < 0.4 ? titrVol(ctx, true) : r < 0.7 ? titrConc(ctx, false) : titrVol(ctx, false);
  return r < 0.35 ? titrConc(ctx, true) : r < 0.7 ? titrMass(ctx) : r < 0.85 ? titrVol(ctx, true) : TITR(3, ctx);
});

// ---------- Galvanski členi in elektroliza ----------
const EO = [["Mg", -2.37, 2], ["Al", -1.66, 3], ["Zn", -0.76, 2], ["Fe", -0.44, 2], ["Ni", -0.25, 2], ["Pb", -0.13, 2], ["Cu", 0.34, 2], ["Ag", 0.8, 1], ["Au", 1.5, 3]];
const ion = (m) => F(`${m[0]}^${m[2] === 1 ? "" : m[2]}+`);
const NAMES = { Zn: ["cink", "zinc"], Fe: ["železo", "iron"], Ni: ["nikelj", "nickel"], Pb: ["svinec", "lead"] };
function dispQ(ctx) {
  const ti = pick([2, 3, 4, 5]);
  const tgt = EO[ti];
  const below = EO.slice(0, ti).filter((m) => m[0] !== "Al"), above = EO.slice(ti + 1);
  const nm = NAMES[tgt[0]][ctx.lang === "sl" ? 0 : 1];
  const q = L(ctx, `Katera kovina izloči ${nm} iz raztopine ${ion(tgt)}?`, `Which metal displaces ${nm} from ${ion(tgt)}(aq)?`);
  return out(q, pick(below)[0], shuffle(above).slice(0, 3).map((m) => m[0]));
}
const ev = (ctx, x) => (x > 0 ? "+" : "") + fx(ctx, x, 2) + " V";
function cellV(ctx) {
  const [A, B] = shuffle(EO).slice(0, 2);
  const U = Math.abs(A[1] - B[1]);
  const q = L(ctx, `${A[0]} in ${B[0]}: E° = ${ev(ctx, A[1])} in ${ev(ctx, B[1])}. Napetost člena?`, `${A[0]} and ${B[0]}: E° = ${ev(ctx, A[1])} and ${ev(ctx, B[1])}. Cell voltage?`);
  const f = (x) => fx(ctx, x, 2) + " V";
  return out(q, f(U), [f(Math.abs(A[1] + B[1])), f(Math.abs(A[1])), f(Math.abs(B[1])), f(U * 2)].filter((s) => s !== f(0)));
}
function anodeQ(ctx) {
  const [A, B] = shuffle(EO).slice(0, 2);
  const lo = A[1] < B[1] ? A : B, hi = lo === A ? B : A;
  const an = Math.random() < 0.6;
  const q = L(ctx, `Člen ${A[0]} (${ev(ctx, A[1])}) in ${B[0]} (${ev(ctx, B[1])}). ${an ? "Anoda" : "Katoda"}?`, `Cell ${A[0]} (${ev(ctx, A[1])}) and ${B[0]} (${ev(ctx, B[1])}). ${an ? "Anode" : "Cathode"}?`);
  return out(q, (an ? lo : hi)[0], [(an ? hi : lo)[0], L(ctx, "obe", "both"), L(ctx, "nobena", "neither")]);
}
function spontQ(ctx) {
  const pool = EO.filter((m) => m[0] !== "Al");
  const [A, B] = shuffle(pool).slice(0, 2);
  const lo = A[1] < B[1] ? A : B, hi = lo === A ? B : A;
  const ws = new Set([`${hi[0]} + ${ion(lo)}`]);
  while (ws.size < 3) {
    const [X, Y] = shuffle(pool).slice(0, 2);
    const h = X[1] > Y[1] ? X : Y, l = h === X ? Y : X;
    ws.add(`${h[0]} + ${ion(l)}`);
  }
  return out(L(ctx, "Kateri par reagira sam od sebe?", "Which pair reacts spontaneously?"), `${lo[0]} + ${ion(hi)}`, [...ws]);
}
const CELL = bank([
  [1, "Na anodi galvanskega člena poteka?|oksidacija|redukcija|nevtralizacija|obarjanje", "At the anode of a galvanic cell occurs?|oxidation|reduction|neutralization|precipitation"],
  [1, "Na katodi galvanskega člena poteka?|redukcija|oksidacija|nevtralizacija|izhlapevanje", "At the cathode of a galvanic cell occurs?|reduction|oxidation|neutralization|evaporation"],
  [1, "V zunanjem krogu elektroni tečejo?|od anode h katodi|od katode k anodi|skozi solni most|v obe smeri", "In the external circuit electrons flow?|anode to cathode|cathode to anode|through salt bridge|both ways"],
  [1, "Solni most omogoča?|prehod ionov|prehod elektronov|prehod kovine|segrevanje", "The salt bridge allows the flow of?|ions|electrons|metal|heat"],
  [1, "Standardni potencial vodikove elektrode?|0 V|1 V|−1 V|0,34 V", "Standard potential of the hydrogen electrode?|0 V|1 V|−1 V|0.34 V"],
  [1, "Bolj negativen E° pomeni, da se kovina lažje?|oksidira|reducira|tali|raztaplja v olju", "A more negative E° means the metal is easier to?|oxidize|reduce|melt|dissolve in oil"],
  [1, "Kovina z bolj negativnim E° je v členu?|anoda|katoda|solni most|elektrolit", "In a cell, the metal with more negative E° is?|the anode|the cathode|the salt bridge|the electrolyte"],
  [1, "Pri elektrolizi na katodi poteka?|redukcija|oksidacija|nevtralizacija|obarjanje", "In electrolysis, at the cathode occurs?|reduction|oxidation|neutralization|precipitation"],
  [3, "Elektroliza taline NaCl: na katodi nastane?|Na|Cl2|H2|O2", "Electrolysis of molten NaCl: at the cathode?|Na|Cl2|H2|O2"],
  [3, "Elektroliza vodne raztopine NaCl: na katodi?|H2|Na|Cl2|O2", "Electrolysis of NaCl(aq): at the cathode?|H2|Na|Cl2|O2"],
  [3, "Elektroliza raztopine CuSO4: na katodi?|Cu|H2|O2|S", "Electrolysis of CuSO4(aq): at the cathode?|Cu|H2|O2|S"],
  [3, "Elektroliza raztopine CuSO4 (inertna anoda): na anodi?|O2|Cu|SO2|H2", "Electrolysis of CuSO4(aq), inert anode: at the anode?|O2|Cu|SO2|H2"],
  [3, "Elektroliza vode: razmerje V(H2) : V(O2)?|2 : 1|1 : 2|1 : 1|8 : 1", "Electrolysis of water: V(H2) : V(O2)?|2 : 1|1 : 2|1 : 1|8 : 1"],
  [3, "Žrtvena anoda za zaščito železa je lahko?|magnezij|baker|srebro|zlato", "A sacrificial anode to protect iron can be?|magnesium|copper|silver|gold"],
  [3, "Pri rjavenju se železo?|oksidira|reducira|nevtralizira|tali", "When iron rusts, it is?|oxidized|reduced|neutralized|melted"],
  [3, "Množina elektronov za 1 mol Al iz Al^3+?|3 mol|1 mol|2 mol|6 mol", "Electrons (mol) for 1 mol Al from Al^3+?|3 mol|1 mol|2 mol|6 mol"],
  [3, "Množina elektronov za 1 mol Cu iz Cu^2+?|2 mol|1 mol|3 mol|4 mol", "Electrons (mol) for 1 mol Cu from Cu^2+?|2 mol|1 mol|3 mol|4 mol"],
]);
def("k2_cell", "km_rea", 11, "E°", "Galvanski členi in elektroliza", "Galvanic cells and electrolysis", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.45 ? dispQ(ctx) : CELL(1, ctx);
  if (t === 2) return r < 0.45 ? cellV(ctx) : r < 0.8 ? anodeQ(ctx) : dispQ(ctx);
  return r < 0.4 ? spontQ(ctx) : r < 0.55 ? cellV(ctx) : CELL(3, ctx);
});

// =====================================================================
// 3. LETNIK
// =====================================================================
// ---------- Izomerija ----------
const ISOT = [
  ["verižna", "chain"],
  ["položajna", "position"],
  ["funkcionalna", "functional"],
  ["geometrijska", "cis-trans"],
  ["optična", "optical"],
  ["nista izomera", "not isomers"],
];
const ISOP = [
  ["butan in 2-metilpropan", "butane and 2-methylpropane", 0],
  ["pentan in 2,2-dimetilpropan", "pentane and 2,2-dimethylpropane", 0],
  ["heksan in 2-metilpentan", "hexane and 2-methylpentane", 0],
  ["propan-1-ol in propan-2-ol", "propan-1-ol and propan-2-ol", 1],
  ["but-1-en in but-2-en", "but-1-ene and but-2-ene", 1],
  ["1-kloropropan in 2-kloropropan", "1-chloropropane and 2-chloropropane", 1],
  ["etanol in dimetil eter", "ethanol and dimethyl ether", 2],
  ["propanal in propanon", "propanal and propanone", 2],
  ["propanojska kislina in metil etanoat", "propanoic acid and methyl ethanoate", 2],
  ["butan-1-ol in dietil eter", "butan-1-ol and diethyl ether", 2],
  ["cis- in trans-but-2-en", "cis- and trans-but-2-ene", 3],
  ["cis- in trans-1,2-dikloroeten", "cis- and trans-1,2-dichloroethene", 3],
  ["D- in L-alanin", "D- and L-alanine", 4],
  ["(R)- in (S)-butan-2-ol", "(R)- and (S)-butan-2-ol", 4],
  ["etanol in propan-1-ol", "ethanol and propan-1-ol", 5],
  ["butan in but-1-en", "butane and but-1-ene", 5],
];
function isoType(ctx) {
  const [s, e, k] = pick(ISOP);
  const lang = ctx.lang === "sl" ? 0 : 1;
  const others = [0, 1, 2, 3, 4, 5].filter((i) => i !== k);
  const q = L(ctx, `Vrsta izomerije: ${s}?`, `Type of isomerism: ${e}?`);
  return out(q, ISOT[k][lang], shuffle(others).slice(0, 4).map((i) => ISOT[i][lang]));
}
const ISOC = [
  ["C4H10", 2], ["C5H12", 3], ["C6H14", 5], ["C7H16", 9], ["C3H7Cl", 2], ["C4H9Cl", 4], ["C2H4Cl2", 2], ["C3H6Cl2", 4], ["C2H6O", 2], ["C3H8O", 3],
];
function isoCount(ctx) {
  if (Math.random() < 0.2) return ints(L(ctx, "Koliko strukturno izomernih alkoholov C₄H₉OH?", "How many structural isomers of the alcohol C₄H₉OH?"), 4, [2, 3, 5, 6], 1);
  const [f, n] = pick(ISOC);
  return ints(L(ctx, `Koliko strukturnih izomerov ima ${F(f)}?`, `How many structural isomers does ${F(f)} have?`), n, [n + 1, n - 1, n + 2, 2 * n], 1);
}
function cisTrans(ctx) {
  const yes = [["but-2-en", "but-2-ene"], ["1,2-dikloroeten", "1,2-dichloroethene"], ["pent-2-en", "pent-2-ene"], ["heks-3-en", "hex-3-ene"]];
  const no = [["but-1-en", "but-1-ene"], ["propen", "propene"], ["2-metilpropen", "2-methylpropene"], ["eten", "ethene"], ["1,1-dikloroeten", "1,1-dichloroethene"], ["2-metilbut-2-en", "2-methylbut-2-ene"]];
  const lang = ctx.lang === "sl" ? 0 : 1;
  return out(L(ctx, "Katera spojina ima cis-trans izomere?", "Which compound has cis-trans isomers?"), pick(yes)[lang], shuffle(no).slice(0, 3).map((x) => x[lang]));
}
function chiral(ctx) {
  const yes = [["butan-2-ol", "butan-2-ol"], ["2-klorobutan", "2-chlorobutane"], ["alanin", "alanine"], ["mlečna kislina", "lactic acid"], ["3-metilheksan", "3-methylhexane"]];
  const no = [["propan-2-ol", "propan-2-ol"], ["2-kloropropan", "2-chloropropane"], ["glicin", "glycine"], ["butan-1-ol", "butan-1-ol"], ["pentan-3-ol", "pentan-3-ol"], ["2-metilbutan", "2-methylbutane"]];
  const lang = ctx.lang === "sl" ? 0 : 1;
  return out(L(ctx, "Katera spojina ima kiralni atom C?", "Which compound has a chiral carbon atom?"), pick(yes)[lang], shuffle(no).slice(0, 3).map((x) => x[lang]));
}
const ISO = bank([
  [1, "Izomeri imajo enako?|molekulsko formulo|strukturno formulo|vrelišče|ime", "Isomers have the same?|molecular formula|structural formula|boiling point|name"],
  [1, "Zrcalni sliki, ki se ne prekrivata, sta?|enantiomera|diastereomera|homologa|verižna izomera", "Non-superimposable mirror images are?|enantiomers|diastereomers|homologues|chain isomers"],
  [1, "Kiralni atom C ima vezane?|4 različne skupine|2 enaki skupini|dvojno vez|3 vodike", "A chiral carbon is bonded to?|4 different groups|2 identical groups|a double bond|3 hydrogens"],
  [3, "Največ stereoizomerov pri 2 kiralnih atomih C?|4|2|8|3", "Max stereoisomers with 2 chiral carbons?|4|2|8|3"],
  [3, "Največ stereoizomerov pri 3 kiralnih atomih C?|8|6|3|9", "Max stereoisomers with 3 chiral carbons?|8|6|3|9"],
  [3, "Enantiomera se razlikujeta po?|predznaku sukanja|vrelišču|molski masi|tališču", "Enantiomers differ in their?|sign of rotation|boiling point|molar mass|melting point"],
  [3, "Zmes enakih množin enantiomerov je?|racemat|izotop|polimer|azeotrop", "An equimolar mix of enantiomers is a?|racemate|isotope|polymer|azeotrope"],
]);
def("k2_isomer", "km_org", 12, "iso", "Izomerija", "Isomerism", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.7 ? isoType(ctx) : ISO(1, ctx);
  if (t === 2) return r < 0.45 ? isoCount(ctx) : r < 0.75 ? cisTrans(ctx) : isoType(ctx);
  return r < 0.35 ? chiral(ctx) : r < 0.6 ? isoCount(ctx) : r < 0.75 ? cisTrans(ctx) : ISO(3, ctx);
});

// ---------- Halogenoalkani in alkoholi ----------
const ALC = [
  // [sl, sl rodilnik, en, vrsta 0/1/2, produkt blage oksidacije (sl|en), napačni (sl|en)]
  ["etanol", "etanola", "ethanol", 0, "etanal|ethanal", ["eten|ethene", "dietil eter|diethyl ether"]],
  ["propan-1-ol", "propan-1-ola", "propan-1-ol", 0, "propanal|propanal", ["propanon|propanone", "propen|propene"]],
  ["butan-1-ol", "butan-1-ola", "butan-1-ol", 0, "butanal|butanal", ["butanon|butanone", "but-1-en|but-1-ene"]],
  ["2-metilpropan-1-ol", "2-metilpropan-1-ola", "2-methylpropan-1-ol", 0, "2-metilpropanal|2-methylpropanal", ["propanon|propanone", "2-metilpropen|2-methylpropene"]],
  ["propan-2-ol", "propan-2-ola", "propan-2-ol", 1, "propanon|propanone", ["propanal|propanal", "propen|propene"]],
  ["butan-2-ol", "butan-2-ola", "butan-2-ol", 1, "butanon|butanone", ["butanal|butanal", "but-2-en|but-2-ene"]],
  ["pentan-3-ol", "pentan-3-ola", "pentan-3-ol", 1, "pentan-3-on|pentan-3-one", ["pentanal|pentanal", "pent-2-en|pent-2-ene"]],
  ["cikloheksanol", "cikloheksanola", "cyclohexanol", 1, "cikloheksanon|cyclohexanone", ["heksanal|hexanal", "cikloheksen|cyclohexene"]],
  ["2-metilpropan-2-ol", "2-metilpropan-2-ola", "2-methylpropan-2-ol", 2, null, ["2-metilpropanal|2-methylpropanal", "butanon|butanone", "propanon|propanone"]],
  ["2-metilbutan-2-ol", "2-metilbutan-2-ola", "2-methylbutan-2-ol", 2, null, ["2-metilbutanal|2-methylbutanal", "butanon|butanone", "pentan-2-on|pentan-2-one"]],
];
const lg = (ctx, s) => s.split("|")[ctx.lang === "sl" ? 0 : 1];
function alcType(ctx) {
  const a = pick(ALC);
  const T = [L(ctx, "primarni", "primary"), L(ctx, "sekundarni", "secondary"), L(ctx, "terciarni", "tertiary")];
  return out(L(ctx, `Vrsta alkohola: ${a[0]}?`, `Type of alcohol: ${a[2]}?`), T[a[3]], [...T.filter((_, i) => i !== a[3]), L(ctx, "fenol", "phenol")]);
}
function alcOx(ctx) {
  const a = pick(ALC);
  const none = L(ctx, "ne poteče", "no reaction");
  const ans = a[4] ? lg(ctx, a[4]) : none;
  const ws = a[5].map((s) => lg(ctx, s));
  if (a[4]) ws.push(none);
  return out(L(ctx, `Blaga oksidacija ${a[1]}: produkt?`, `Mild oxidation of ${a[2]}: product?`), ans, ws);
}
const ALCB = bank([
  [1, "Alkoholi imajo višje vrelišče kot alkani zaradi?|vodikovih vezi|večje mase|ionskih vezi|kovinskih vezi", "Alcohols boil higher than alkanes because of?|hydrogen bonds|larger mass|ionic bonds|metallic bonds"],
  [1, "Topnost alkoholov v vodi z daljšanjem verige?|pada|narašča|se ne spremeni|najprej narašča", "Solubility of alcohols in water as chains grow?|decreases|increases|stays the same|first increases"],
  [1, "Kateri alkohol je zelo strupen (slepota)?|metanol|etanol|glicerol|sorbitol", "Which alcohol is highly toxic (blindness)?|methanol|ethanol|glycerol|sorbitol"],
  [1, "Etanol z natrijem da natrijev etoksid in?|vodik|kisik|vodo|eten", "Ethanol and sodium give sodium ethoxide and?|hydrogen|oxygen|water|ethene"],
  [1, "Koliko skupin OH ima etan-1,2-diol?|2|1|3|4", "How many OH groups in ethane-1,2-diol?|2|1|3|4"],
  [2, "C2H5Br + NaOH (vodna raztopina): organski produkt?|C2H5OH|C2H4|C2H6|C2H5Na", "C2H5Br + NaOH (aqueous): organic product?|C2H5OH|C2H4|C2H6|C2H5Na"],
  [2, "C2H5Br + KOH (v etanolu, segrevanje): produkt?|C2H4|C2H5OH|C2H6|CH3CHO", "C2H5Br + KOH (in ethanol, heat): product?|C2H4|C2H5OH|C2H6|CH3CHO"],
  [2, "C2H5Br + OH^- -> C2H5OH + Br^- je?|substitucija|adicija|eliminacija|polimerizacija", "C2H5Br + OH^- -> C2H5OH + Br^- is?|substitution|addition|elimination|polymerization"],
  [2, "Dehidracija etanola (H2SO4, 170 °C) da?|eten|etan|etanal|etin", "Dehydrating ethanol (H2SO4, 170 °C) gives?|ethene|ethane|ethanal|ethyne"],
  [3, "Eliminacija HBr iz 2-bromobutana da večinoma?|but-2-en|but-1-en|butan|butan-2-ol", "Eliminating HBr from 2-bromobutane gives mainly?|but-2-ene|but-1-ene|butane|butan-2-ol"],
  [3, "Najvišje vrelišče ima?|1-jodopropan|1-bromopropan|1-kloropropan|1-fluoropropan", "Highest boiling point?|1-iodopropane|1-bromopropane|1-chloropropane|1-fluoropropane"],
  [3, "Najvišje vrelišče ima?|butan-1-ol|pentan|dietil eter|butanal", "Highest boiling point?|butan-1-ol|pentane|diethyl ether|butanal"],
  [3, "Klorofluoroogljikovodiki (CFC) škodijo?|ozonski plasti|tlom|podtalnici|kostem", "CFCs damage the?|ozone layer|soil|groundwater|bones"],
  [3, "Barva oborine AgCl?|bela|rumena|črna|modra", "Colour of the AgCl precipitate?|white|yellow|black|blue"],
  [3, "Barva oborine AgI?|rumena|bela|črna|modra", "Colour of the AgI precipitate?|yellow|white|black|blue"],
]);
def("k2_alcohol", "km_org", 12, "R–OH", "Halogenoalkani in alkoholi", "Haloalkanes and alcohols", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.5 ? alcType(ctx) : ALCB(1, ctx);
  if (t === 2) return r < 0.5 ? alcOx(ctx) : r < 0.65 ? alcType(ctx) : ALCB(2, ctx);
  return r < 0.4 ? alcOx(ctx) : ALCB(3, ctx);
});

// ---------- Karboksilne kisline in derivati ----------
const ACID = [["metanojska", "metanoat", "methanoic", "methanoate"], ["etanojska", "etanoat", "ethanoic", "ethanoate"], ["propanojska", "propanoat", "propanoic", "propanoate"], ["butanojska", "butanoat", "butanoic", "butanoate"]];
const ALK = [["metanol", "metil", "methanol", "methyl"], ["etanol", "etil", "ethanol", "ethyl"], ["propan-1-ol", "propil", "propan-1-ol", "propyl"], ["butan-1-ol", "butil", "butan-1-ol", "butyl"]];
function esterName(ctx) {
  const i = R(0, 3), j = R(0, 3);
  const sl = ctx.lang === "sl";
  const nm = (a, b) => (sl ? `${ALK[b][1]} ${ACID[a][1]}` : `${ALK[b][3]} ${ACID[a][3]}`);
  const q = sl ? `${ACID[i][0][0].toUpperCase() + ACID[i][0].slice(1)} kislina + ${ALK[j][0]}: ime estra?` : `${ACID[i][2][0].toUpperCase() + ACID[i][2].slice(1)} acid + ${ALK[j][2]}: ester name?`;
  const ws = [nm(j, i)];
  for (const [a, b] of [[i, (j + 1) % 4], [(i + 1) % 4, j], [i, (j + 3) % 4], [(i + 3) % 4, j]]) ws.push(nm(a, b));
  return out(q, nm(i, j), ws);
}
function esterFormula(ctx) {
  const i = R(0, 3), j = R(0, 3), n = i + j + 2;
  const sl = ctx.lang === "sl";
  const name = sl ? `${ALK[j][1]} ${ACID[i][1]}a` : `${ALK[j][3]} ${ACID[i][3]}`;
  const f = (c, h, o) => F(`C${c}H${h}O${o > 1 ? o : ""}`);
  if (Math.random() < 0.5) {
    const M = 14 * n + 32;
    return nq(ctx, L(ctx, `Molska masa estra ${name}?`, `Molar mass of ${name}?`), M, "g/mol", [M + 18, M - 14, M + 14, M - 16]);
  }
  return out(L(ctx, `Molekulska formula estra ${name}?`, `Molecular formula of ${name}?`), f(n, 2 * n, 2), [f(n, 2 * n + 2, 2), f(n, 2 * n, 1), f(n, 2 * n + 2, 3), f(n - 1, 2 * n - 2, 2)]);
}
const ACIDB = bank([
  [1, "Estri imajo pogosto vonj po?|sadju|gnilih jajcih|ribah|kisu", "Esters often smell of?|fruit|rotten eggs|fish|vinegar"],
  [1, "Ocetna kislina je?|šibka kislina|močna kislina|baza|alkohol", "Acetic acid is a?|weak acid|strong acid|base|alcohol"],
  [1, "CH3COOH + NaOH -> ?|CH3COONa + H2O|CH3ONa + HCOOH|CH3COOH2 + NaO|CH3Na + CO2", "CH3COOH + NaOH -> ?|CH3COONa + H2O|CH3ONa + HCOOH|CH3COOH2 + NaO|CH3Na + CO2"],
  [1, "Karboksilna kislina + Na2CO3: plin?|CO2|H2|O2|CO", "Carboxylic acid + Na2CO3: which gas?|CO2|H2|O2|CO"],
  [1, "Karboksilna kislina + Mg: plin?|H2|CO2|O2|CH4", "Carboxylic acid + Mg: which gas?|H2|CO2|O2|CH4"],
  [1, "Kislina v mravljah in koprivah?|metanojska|etanojska|citronska|mlečna", "Acid in ants and nettles?|methanoic acid|ethanoic acid|citric acid|lactic acid"],
  [1, "Kislina v kislem mleku?|mlečna|ocetna|metanojska|citronska", "Acid in sour milk?|lactic acid|acetic acid|methanoic acid|citric acid"],
  [1, "Esterifikacijo katalizira?|H2SO4|NaOH|NaCl|H2O", "Esterification is catalysed by?|H2SO4|NaOH|NaCl|H2O"],
  [1, "Amidi vsebujejo skupino?|–CONH2|–COOH|–NH2|–COO–", "Amides contain the group?|–CONH2|–COOH|–NH2|–COO–"],
  [1, "Sečnina CO(NH2)2 spada med?|amide|amine|estre|ketone", "Urea CO(NH2)2 is an?|amide|amine|ester|ketone"],
  [3, "Karboksilna kislina + NH3 (segrevanje) -> amid + ?|H2O|H2|NH4^+|CO2", "Carboxylic acid + NH3 (heat) -> amide + ?|H2O|H2|NH4^+|CO2"],
  [3, "Formula etanamida?|CH3CONH2|CH3COONH4|CH3CH2NH2|CH3COOH", "Formula of ethanamide?|CH3CONH2|CH3COONH4|CH3CH2NH2|CH3COOH"],
  [3, "Najmočnejša kislina?|trikloroetanojska|etanojska|propanojska|butanojska", "Strongest acid?|trichloroethanoic|ethanoic|propanoic|butanoic"],
  [3, "Kislinski klorid etanojske kisline?|CH3COCl|CH3CH2Cl|ClCH2COOH|CH3COOCl", "Acid chloride of ethanoic acid?|CH3COCl|CH3CH2Cl|ClCH2COOH|CH3COOCl"],
  [3, "Najbolj reaktiven derivat karboksilnih kislin?|kislinski klorid|amid|ester|anhidrid", "Most reactive carboxylic acid derivative?|acid chloride|amide|ester|anhydride"],
  [3, "Anhidrid nastane iz dveh molekul kisline z odcepom?|vode|CO2|H2|NH3", "An anhydride forms from two acids by losing?|water|CO2|H2|NH3"],
  [3, "Hidroliza estra v kislem da kislino in?|alkohol|aldehid|eter|keton", "Acid hydrolysis of an ester gives an acid and?|an alcohol|an aldehyde|an ether|a ketone"],
]);
def("k2_acidder", "km_org", 12, "COOR", "Karboksilne kisline in derivati", "Carboxylic acids and derivatives", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.35 ? esterName(ctx) : ACIDB(1, ctx);
  if (t === 2) return r < 0.5 ? esterName(ctx) : r < 0.8 ? esterFormula(ctx) : ACIDB(1, ctx);
  return r < 0.45 ? esterFormula(ctx) : r < 0.6 ? esterName(ctx) : ACIDB(3, ctx);
});

// ---------- Ogljikovi hidrati, lipidi, beljakovine (SŠ) ----------
const BIO = bank([
  [1, "Obročna oblika glukoze ima anomera?|α in β|D in L|cis in trans|E in Z", "The ring form of glucose has anomers?|α and β|D and L|cis and trans|E and Z"],
  [1, "Škrob sestavljata amiloza in?|amilopektin|celuloza|glikogen|hitin", "Starch is made of amylose and?|amylopectin|cellulose|glycogen|chitin"],
  [1, "Vez med enotami glukoze v celulozi?|β-1,4-glikozidna|α-1,4-glikozidna|peptidna|estrska", "Bond between glucose units in cellulose?|β-1,4-glycosidic|α-1,4-glycosidic|peptide|ester"],
  [1, "Vez med enotami glukoze v amilozi?|α-1,4-glikozidna|β-1,4-glikozidna|α-1,6-glikozidna|peptidna", "Bond between glucose units in amylose?|α-1,4-glycosidic|β-1,4-glycosidic|α-1,6-glycosidic|peptide"],
  [1, "Razvejitve v glikogenu so vezi?|α-1,6-glikozidne|α-1,4-glikozidne|β-1,4-glikozidne|peptidne", "Branch points in glycogen are?|α-1,6-glycosidic|α-1,4-glycosidic|β-1,4-glycosidic|peptide bonds"],
  [1, "Kateri sladkor NI reducirajoč?|saharoza|glukoza|fruktoza|maltoza", "Which sugar is NOT reducing?|sucrose|glucose|fructose|maltose"],
  [1, "Maltoza je sestavljena iz?|dveh glukoz|glukoze in fruktoze|glukoze in galaktoze|dveh fruktoz", "Maltose is made of?|two glucoses|glucose + fructose|glucose + galactose|two fructoses"],
  [1, "Fosfolipidi so glavna sestavina?|celičnih membran|maščobnih zalog|encimov|kosti", "Phospholipids are the main part of?|cell membranes|fat stores|enzymes|bones"],
  [1, "Fosfolipid ima glicerol, 2 maščobni kislini in?|fosfatno skupino|3. maščobno kislino|glukozo|aminokislino", "A phospholipid has glycerol, 2 fatty acids and?|a phosphate group|a 3rd fatty acid|glucose|an amino acid"],
  [1, "Število obročev v steroidnem ogrodju?|4|3|5|6", "Number of rings in the steroid skeleton?|4|3|5|6"],
  [1, "Aminokisline v beljakovinah imajo konfiguracijo?|L|D|E|Z", "Amino acids in proteins have the configuration?|L|D|E|Z"],
  [1, "Terciarno zgradbo stabilizirajo tudi?|disulfidni mostički|peptidne vezi|glikozidne vezi|estrske vezi", "Tertiary structure is also held by?|disulfide bridges|peptide bonds|glycosidic bonds|ester bonds"],
  [1, "Pri izoelektrični točki je aminokislina?|navzven nevtralna|kation|anion|oksidirana", "At its isoelectric point an amino acid is?|net neutral|a cation|an anion|oxidized"],
  [3, "Za umiljenje 1 mol triglicerida porabimo NaOH?|3 mol|1 mol|2 mol|6 mol", "Saponifying 1 mol of a triglyceride needs NaOH?|3 mol|1 mol|2 mol|6 mol"],
  [3, "Na 1 mol trioleina se adira H2?|3 mol|1 mol|6 mol|0 mol", "Moles of H2 that add to 1 mol triolein?|3 mol|1 mol|6 mol|0 mol"],
  [3, "Na 1 mol trilinoleina se adira H2?|6 mol|3 mol|2 mol|9 mol", "Moles of H2 that add to 1 mol trilinolein?|6 mol|3 mol|2 mol|9 mol"],
  [3, "Na 1 mol tristearina se adira H2?|0 mol|3 mol|1 mol|6 mol", "Moles of H2 that add to 1 mol tristearin?|0 mol|3 mol|1 mol|6 mol"],
]);
function oligoM(ctx) {
  const n = R(2, 6);
  const q = L(ctx, `M verige iz ${n} enot glukoze (M = 180 g/mol)?`, `M of a chain of ${n} glucose units (M = 180 g/mol)?`);
  return nq(ctx, q, 180 * n - 18 * (n - 1), "g/mol", [180 * n, 162 * n, 162 * n - 18, 180 * n - 18 * (n - 2)]);
}
function trigM(ctx) {
  const a = pick([256, 284, 282, 280]);
  const M = 92 + 3 * a - 54;
  const q = L(ctx, `M(glicerol) = 92, M(kisline) = ${a} g/mol. M triglicerida?`, `M(glycerol) = 92, M(acid) = ${a} g/mol. M of triglyceride?`);
  return nq(ctx, q, M, "g/mol", [92 + 3 * a, 92 + 3 * a - 18, 3 * a, 92 + a - 18]);
}
def("k2_biomol", "km_org", 12, "Mr", "Ogljikovi hidrati, lipidi, beljakovine", "Carbohydrates, lipids, proteins", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return BIO(1, ctx);
  if (t === 2) return r < 0.35 ? oligoM(ctx) : r < 0.55 ? pepM(ctx) : BIO(1, ctx);
  return r < 0.3 ? trigM(ctx) : r < 0.5 ? oligoM(ctx) : r < 0.65 ? pepM(ctx) : BIO(3, ctx);
});

// ---------- Polimerizacija, polikondenzacija ----------
const PTYPE = [
  ["polieten", "polyethene", 0], ["polipropen", "polypropene", 0], ["PVC", "PVC", 0], ["polistiren", "polystyrene", 0], ["PTFE", "PTFE", 0], ["poliakrilonitril", "polyacrylonitrile", 0],
  ["poliamid", "a polyamide", 1], ["PET (poliester)", "PET (a polyester)", 1], ["celuloza", "cellulose", 1], ["beljakovina", "a protein", 1], ["škrob", "starch", 1],
];
function ptypeQ(ctx) {
  const [s, e, k] = pick(PTYPE);
  const T = [L(ctx, "polimerizacija", "addition"), L(ctx, "polikondenzacija", "condensation"), L(ctx, "substitucija", "substitution"), L(ctx, "eliminacija", "elimination")];
  return out(L(ctx, `Kako nastane ${s}?`, `How is ${e} formed?`), T[k], T.filter((_, i) => i !== k));
}
const MONO = [
  ["PVC", "PVC", "kloroeten", "chloroethene"], ["PTFE", "PTFE", "tetrafluoroeten", "tetrafluoroethene"], ["polistirena", "polystyrene", "stiren", "styrene"],
  ["polipropena", "polypropene", "propen", "propene"], ["polietena", "polyethene", "eten", "ethene"], ["poliakrilonitrila", "polyacrylonitrile", "akrilonitril", "acrylonitrile"], ["naravnega kavčuka", "natural rubber", "izopren", "isoprene"],
];
function monoQ(ctx) {
  const m = pick(MONO);
  const sl = ctx.lang === "sl";
  return out(L(ctx, `Monomer ${m[0]}?`, `Monomer of ${m[1]}?`), sl ? m[2] : m[3], shuffle(MONO.filter((x) => x !== m)).slice(0, 3).map((x) => (sl ? x[2] : x[3])));
}
const PM = [["polieten", "polyethene", 28], ["polipropen", "polypropene", 42], ["PVC", "PVC", 62.5], ["polistiren", "polystyrene", 104], ["PTFE", "PTFE", 100]];
function dpQ(ctx) {
  const [s0, e0, M0] = pick(PM);
  const s = s0[0].toUpperCase() + s0.slice(1), e = e0[0].toUpperCase() + e0.slice(1);
  const n = pick([200, 500, 1000, 2000, 4000, 5000]);
  const M = rd(n * M0);
  if (Math.random() < 0.6) {
    return ints(L(ctx, `${s}: M = ${ctx.num(M)} g/mol, M₀ = ${ctx.num(M0)} g/mol. n = ?`, `${e}: M = ${ctx.num(M)} g/mol, M₀ = ${ctx.num(M0)} g/mol. n = ?`), n, [n * 10, n / 10, n * 2, n / 2]);
  }
  const q = L(ctx, `${s}: n = ${n}, M₀ = ${ctx.num(M0)} g/mol. M polimera?`, `${e}: n = ${n}, M₀ = ${ctx.num(M0)} g/mol. Polymer M?`);
  return nq(ctx, q, M, "g/mol", [M * 10, M / 10, n + M0, M * 2]);
}
const POLYSS = bank([
  [1, "Pri polikondenzaciji se poleg polimera izloči?|majhna molekula|nič|monomer|kisik", "In condensation polymerization, besides polymer forms?|a small molecule|nothing|a monomer|oxygen"],
  [1, "Poliestri nastanejo iz dikarboksilnih kislin in?|diolov|diaminov|alkenov|aminokislin", "Polyesters form from dicarboxylic acids and?|diols|diamines|alkenes|amino acids"],
  [1, "Poliamidi nastanejo iz dikarboksilnih kislin in?|diaminov|diolov|alkenov|monosaharidov", "Polyamides form from dicarboxylic acids and?|diamines|diols|alkenes|monosaccharides"],
  [1, "Vez v poliamidih?|amidna|estrska|glikozidna|eterska", "Bond in polyamides?|amide|ester|glycosidic|ether"],
  [1, "Vez v poliestrih?|estrska|amidna|glikozidna|eterska", "Bond in polyesters?|ester|amide|glycosidic|ether"],
  [1, "Monomer za adicijsko polimerizacijo mora imeti?|dvojno vez C=C|skupino –OH|skupino –COOH|obroč", "A monomer for addition polymerization needs?|a C=C double bond|an –OH group|a –COOH group|a ring"],
  [3, "Pri vulkanizaciji verige kavčuka povežejo mostički iz?|žvepla|kisika|klora|dušika", "In vulcanization, rubber chains are linked by?|sulfur bridges|oxygen bridges|chlorine bridges|nitrogen bridges"],
  [3, "Verige duroplasta so?|močno zamrežene|linearne|kratke|nepovezane", "The chains in a thermoset are?|highly cross-linked|linear|very short|unconnected"],
  [3, "Kopolimer nastane iz?|dveh vrst monomerov|enega monomera|dveh polimerov|soli in vode", "A copolymer is made from?|two kinds of monomer|one monomer|two polymers|salt and water"],
  [3, "Poliestri so bolj razgradljivi od polietena, ker?|jih hidroliziramo|so trdnejši|so težji|so kovinski", "Polyesters break down more easily than PE because they?|can be hydrolysed|are stronger|are heavier|are metallic"],
]);
def("k2_polyss", "km_org", 12, "[ ]ₙ", "Polimerizacija in polikondenzacija", "Addition and condensation polymers", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.5 ? ptypeQ(ctx) : POLYSS(1, ctx);
  if (t === 2) return r < 0.4 ? monoQ(ctx) : r < 0.7 ? dpQ(ctx) : ptypeQ(ctx);
  return r < 0.45 ? dpQ(ctx) : r < 0.6 ? monoQ(ctx) : POLYSS(3, ctx);
});

// =====================================================================
// 4. LETNIK (ponovitev za maturo)
// =====================================================================
const INSOL = ["AgCl", "BaSO4", "CaCO3", "PbI2", "AgBr", "Cu(OH)2", "Fe(OH)3", "BaCO3"];
const SOL = ["NaCl", "KNO3", "NH4Cl", "Na2SO4", "K2CO3", "CuSO4", "AgNO3", "MgCl2", "Ca(NO3)2"];
function solubQ(ctx) {
  if (Math.random() < 0.5) return out(L(ctx, "Katera snov je v vodi netopna?", "Which compound is insoluble in water?"), F(pick(INSOL)), shuffle(SOL).slice(0, 3).map(F));
  return out(L(ctx, "Katera snov je v vodi dobro topna?", "Which compound is soluble in water?"), F(pick(SOL)), shuffle(INSOL).slice(0, 3).map(F));
}
function oxideQ(ctx) {
  const ac = ["CO2", "SO2", "SO3", "P4O10", "NO2", "SiO2"], ba = ["Na2O", "CaO", "MgO", "K2O", "BaO", "Li2O"];
  if (Math.random() < 0.5) return out(L(ctx, "Kateri oksid je kisel?", "Which oxide is acidic?"), F(pick(ac)), shuffle(ba).slice(0, 3).map(F));
  return out(L(ctx, "Kateri oksid je bazičen?", "Which oxide is basic?"), F(pick(ba)), shuffle(ac).slice(0, 3).map(F));
}
const INORG = bank([
  [1, "Barva vodne raztopine Cu^2+?|modra|rumena|brezbarvna|rdeča", "Colour of Cu^2+(aq)?|blue|yellow|colourless|red"],
  [1, "Barva raztopine MnO4^-?|vijolična|modra|zelena|brezbarvna", "Colour of MnO4^- solution?|purple|blue|green|colourless"],
  [1, "Barva raztopine Cr2O7^2-?|oranžna|modra|vijolična|brezbarvna", "Colour of Cr2O7^2- solution?|orange|blue|purple|colourless"],
  [1, "Barva raztopine Fe^3+?|rumeno-rjava|modra|vijolična|brezbarvna", "Colour of Fe^3+(aq)?|yellow-brown|blue|purple|colourless"],
  [1, "Barva raztopine CrO4^2-?|rumena|modra|vijolična|brezbarvna", "Colour of CrO4^2- solution?|yellow|blue|purple|colourless"],
  [1, "Barva raztopine Na^+?|brezbarvna|rumena|modra|zelena", "Colour of Na^+(aq)?|colourless|yellow|blue|green"],
  [1, "Barva raztopine Ni^2+?|zelena|modra|vijolična|brezbarvna", "Colour of Ni^2+(aq)?|green|blue|purple|colourless"],
  [1, "Najbolj elektronegativen element?|F|O|Cl|N", "Most electronegative element?|F|O|Cl|N"],
  [1, "Alotropi kisika?|O2 in O3|H2O in H2O2|O in O^2-|CO in CO2", "Allotropes of oxygen?|O2 and O3|H2O and H2O2|O and O^2-|CO and CO2"],
  [1, "Barva raztopine Fe^2+?|bledo zelena|modra|vijolična|oranžna", "Colour of Fe^2+(aq)?|pale green|blue|purple|orange"],
  [1, "Plin, ki skali apnico?|CO2|O2|H2|N2", "Gas that turns limewater milky?|CO2|O2|H2|N2"],
  [2, "AgNO3 + NaCl: barva oborine?|bela|rumena|modra|rjava", "AgNO3 + NaCl: colour of precipitate?|white|yellow|blue|brown"],
  [2, "Cu^2+ + OH^-: barva oborine?|modra|bela|rjava|rumena", "Cu^2+ + OH^-: colour of precipitate?|blue|white|brown|yellow"],
  [2, "Fe^3+ + OH^-: barva oborine?|rjava|modra|bela|rumena", "Fe^3+ + OH^-: colour of precipitate?|brown|blue|white|yellow"],
  [2, "Ba^2+ + SO4^2- -> ?|BaSO4|BaS|Ba(SO4)2|BaO", "Ba^2+ + SO4^2- -> ?|BaSO4|BaS|Ba(SO4)2|BaO"],
  [2, "CO2 skozi apnico: motnost povzroča?|CaCO3|Ca(OH)2|CaO|CaCl2", "CO2 through limewater: the cloudiness is?|CaCO3|Ca(OH)2|CaO|CaCl2"],
  [2, "SO3 + H2O -> ?|H2SO4|H2SO3|H2S|SO4", "SO3 + H2O -> ?|H2SO4|H2SO3|H2S|SO4"],
  [2, "CaO + H2O -> ?|Ca(OH)2|CaH2|CaO2|CaCO3", "CaO + H2O -> ?|Ca(OH)2|CaH2|CaO2|CaCO3"],
  [2, "Na2O + H2O -> ?|2 NaOH|NaOH|Na2OH|NaO + H2", "Na2O + H2O -> ?|2 NaOH|NaOH|Na2OH|NaO + H2"],
  [2, "Amfoterni oksid?|Al2O3|Na2O|SO3|CaO", "Which oxide is amphoteric?|Al2O3|Na2O|SO3|CaO"],
  [3, "Katalizator pri sintezi NH3 iz N2 in H2?|Fe|Pt|V2O5|MnO2", "Catalyst for making NH3 from N2 and H2?|Fe|Pt|V2O5|MnO2"],
  [3, "Katalizator za pretvorbo SO2 v SO3 v industriji?|V2O5|Fe|Ni|MnO2", "Industrial catalyst for SO2 to SO3?|V2O5|Fe|Ni|MnO2"],
  [3, "Razkroj H2O2 pospeši?|MnO2|NaCl|H2O|CO2", "Decomposition of H2O2 is sped up by?|MnO2|NaCl|H2O|CO2"],
  [3, "Koordinacijsko število v [Cu(NH3)4]^2+?|4|2|6|1", "Coordination number in [Cu(NH3)4]^2+?|4|2|6|1"],
  [3, "Oksidacijsko število Fe v [Fe(CN)6]^3-?|+3|+2|−3|+6", "Oxidation number of Fe in [Fe(CN)6]^3-?|+3|+2|−3|+6"],
  [3, "Barva raztopine [Cu(NH3)4]^2+?|temno modra|rdeča|brezbarvna|rumena", "Colour of [Cu(NH3)4]^2+ solution?|deep blue|red|colourless|yellow"],
  [3, "Kovina, ki jo ščiti tanka oksidna plast?|Al|Na|K|Ca", "Metal protected by a thin oxide layer?|Al|Na|K|Ca"],
  [3, "P4O10 + 6 H2O -> ?|4 H3PO4|2 H3PO4|4 H3PO3|H3PO4", "P4O10 + 6 H2O -> ?|4 H3PO4|2 H3PO4|4 H3PO3|H3PO4"],
]);
def("k2_inorg", "km_atom", 13, "M²⁺", "Splošna in anorganska kemija", "General and inorganic chemistry", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.25 ? oxideQ(ctx) : INORG(1, ctx);
  if (t === 2) return r < 0.3 ? solubQ(ctx) : r < 0.45 ? oxideQ(ctx) : INORG(2, ctx);
  return r < 0.2 ? solubQ(ctx) : INORG(3, ctx);
});

const RT = [
  ["CH2=CH2 + Br2 -> CH2Br–CH2Br", 0],
  ["CH4 + Cl2 -> CH3Cl + HCl", 1],
  ["C2H5OH -> C2H4 + H2O", 2],
  ["C6H6 + Br2 -> C6H5Br + HBr", 1],
  ["C2H5Br + OH^- -> C2H5OH + Br^-", 1],
  ["CH≡CH + 2 H2 -> C2H6", 0],
  ["C2H5Cl -> C2H4 + HCl", 2],
  ["C6H6 + HNO3 -> C6H5NO2 + H2O", 1],
  ["CH2=CH2 + H2O -> C2H5OH", 0],
  ["CH3–CHBr–CH3 -> CH2=CH–CH3 + HBr", 2],
  ["CH2=CH–CH3 + HBr -> CH3–CHBr–CH3", 0],
];
function rtypeQ(ctx) {
  const [eq, k] = pick(RT);
  const T = [L(ctx, "adicija", "addition"), L(ctx, "substitucija", "substitution"), L(ctx, "eliminacija", "elimination"), L(ctx, "polimerizacija", "polymerization")];
  return out(`${F(eq)}. ${L(ctx, "Vrsta reakcije?", "Reaction type?")}`, T[k], T.filter((_, i) => i !== k));
}
const ORGM = bank([
  [1, "Kaj razbarva bromovico?|alken|alkan|benzen|alkohol", "What decolourizes bromine water?|an alkene|an alkane|benzene|an alcohol"],
  [1, "Poskus srebrnega ogledala dokazuje?|aldehide|ketone|alkohole|estre", "The silver mirror test detects?|aldehydes|ketones|alcohols|esters"],
  [1, "Fehlingov reagent z aldehidom da oborino?|opečnato rdečo|modro|belo|črno", "Fehling's reagent + aldehyde: precipitate colour?|brick-red|blue|white|black"],
  [1, "Molekulska formula benzena?|C6H6|C6H12|C6H14|C5H5", "Molecular formula of benzene?|C6H6|C6H12|C6H14|C5H5"],
  [1, "Značilna reakcija benzena?|substitucija|adicija|eliminacija|polimerizacija", "Typical reaction of benzene?|substitution|addition|elimination|polymerization"],
  [1, "Metilbenzen se imenuje tudi?|toluen|fenol|anilin|stiren", "Methylbenzene is also called?|toluene|phenol|aniline|styrene"],
  [1, "Hidroksibenzen je?|fenol|benzil alkohol|toluen|anilin", "Hydroxybenzene is?|phenol|benzyl alcohol|toluene|aniline"],
  [1, "Aminobenzen je?|anilin|fenol|toluen|benzojska kislina", "Aminobenzene is?|aniline|phenol|toluene|benzoic acid"],
  [1, "Skupina >C=O v ketonih je?|karbonilna|karboksilna|hidroksilna|amino", "The >C=O group in ketones is a?|carbonyl group|carboxyl group|hydroxyl group|amino group"],
  [2, "FeCl3 obarva vijolično raztopino?|fenola|etanola|benzena|etanojske kisline", "FeCl3 turns violet a solution of?|phenol|ethanol|benzene|ethanoic acid"],
  [2, "Jodoformska reakcija je pozitivna za?|etanol|metanol|propan-1-ol|benzen", "The iodoform test is positive for?|ethanol|methanol|propan-1-ol|benzene"],
  [2, "Vijolična raztopina KMnO4 z alkenom?|se razbarva|postane modra|se ne spremeni|zavre", "Purple KMnO4 solution with an alkene?|decolourizes|turns blue|stays the same|boils"],
  [2, "S katero spojino NaHCO3 sprošča CO2?|etanojska kislina|etanol|fenol|etanal", "Which compound releases CO2 from NaHCO3?|ethanoic acid|ethanol|phenol|ethanal"],
  [3, "Propen + HBr: glavni produkt?|2-bromopropan|1-bromopropan|1,2-dibromopropan|propan", "Propene + HBr: main product?|2-bromopropane|1-bromopropane|1,2-dibromopropane|propane"],
  [3, "Propen + H2O (H^+): glavni produkt?|propan-2-ol|propan-1-ol|propanal|propan", "Propene + H2O (H^+): main product?|propan-2-ol|propan-1-ol|propanal|propane"],
  [3, "Koliko izomerov ima diklorobenzen?|3|2|4|6", "How many isomers of dichlorobenzene?|3|2|4|6"],
  [3, "Koliko π-elektronov ima benzenov obroč?|6|3|12|2", "How many π electrons in a benzene ring?|6|3|12|2"],
  [3, "Dolžine vezi C–C v benzenu so?|vse enake|izmenično različne|ena daljša|vse različne", "C–C bond lengths in benzene are?|all equal|alternating|one longer|all different"],
  [3, "Katero spojino najlažje oksidiramo?|propanal|propanon|2-metilpropan-2-ol|propan", "Which compound is most easily oxidized?|propanal|propanone|2-methylpropan-2-ol|propane"],
]);
def("k2_orgmix", "km_org", 13, "C₆H₆", "Organska kemija: dokazne reakcije in areni", "Organic chemistry: tests and arenes", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return r < 0.3 ? rtypeQ(ctx) : ORGM(1, ctx);
  if (t === 2) return r < 0.45 ? rtypeQ(ctx) : ORGM(2, ctx);
  return r < 0.35 ? rtypeQ(ctx) : ORGM(3, ctx);
});

// ---------- Kemijsko računanje ----------
const WEL = [
  ["CaCO3", "Ca", 40, [60, 12, 48]], ["CaCO3", "C", 12, [88, 40, 48]], ["CaCO3", "O", 48, [16, 52, 40]],
  ["SO2", "S", 50, [32, 25, 64]], ["SO3", "S", 40, [60, 32, 25]], ["SO3", "O", 60, [40, 20, 48]],
  ["CH4", "C", 75, [25, 12, 80]], ["CH4", "H", 25, [75, 6.25, 4]], ["MgO", "Mg", 60, [40, 24, 50]],
  ["Fe2O3", "Fe", 70, [30, 35, 56]], ["Fe2O3", "O", 30, [70, 10, 16]], ["NH4NO3", "N", 35, [17.5, 65, 14]],
  ["C2H6", "C", 80, [40, 20, 12]], ["C2H6", "H", 20, [80, 10, 6]], ["NaOH", "Na", 57.5, [42.5, 23, 40]],
];
const MM = { CaCO3: 100, SO2: 64, SO3: 80, CH4: 16, MgO: 40, Fe2O3: 160, NH4NO3: 80, C2H6: 30, NaOH: 40 };
function wElQ(ctx) {
  const [f, el, w, ws] = pick(WEL);
  const P = (x) => ctx.num(x) + " %", G = (x) => ctx.num(rd(x)) + " g";
  if (Math.random() < 0.5) return out(L(ctx, `Masni delež ${el} v ${F(f)}?`, `Mass fraction of ${el} in ${F(f)}?`), P(w), ws.map(P));
  const m = rd(MM[f] * pick([0.5, 1, 2, 5]));
  const a = rd((m * w) / 100);
  return out(L(ctx, `Masa ${el} v ${ctx.num(m)} g ${F(f)}?`, `Mass of ${el} in ${ctx.num(m)} g ${F(f)}?`), G(a), [G(m - a), G(2 * a), G(a / 2), G(m), G(3 * a)].filter((x) => x !== G(a)));
}
function yieldQ(ctx) {
  const k = pick([0.5, 1, 2]), eta = pick([50, 60, 75, 80, 90]);
  const m = 100 * k, th = 56 * k, p = rd((th * eta) / 100);
  const q = L(ctx, `Razkroj ${ctx.num(m)} g CaCO₃ da ${ctx.num(p)} g CaO. Izkoristek?`, `Heating ${ctx.num(m)} g CaCO₃ gives ${ctx.num(p)} g CaO. Yield?`);
  return nq(ctx, q, eta, "%", [rd((p / m) * 100), 100 - eta, rd((th / m) * 100)]);
}
const LIM = [
  ["2 H2 + O2 -> 2 H2O", "H2", "O2", 2, 1, "H2O", 2],
  ["N2 + 3 H2 -> 2 NH3", "N2", "H2", 1, 3, "NH3", 2],
  ["2 Mg + O2 -> 2 MgO", "Mg", "O2", 2, 1, "MgO", 2],
  ["H2 + Cl2 -> 2 HCl", "H2", "Cl2", 1, 1, "HCl", 2],
];
function limQ(ctx, askP) {
  const [eq, A, B, a, b, P, p] = pick(LIM);
  let nA, nB;
  do {
    nA = R(1, 6);
    nB = R(1, 6);
  } while (nA / a === nB / b || (askP && !Number.isInteger(2 * Math.min(nA / a, nB / b) * p)));
  const limA = nA / a < nB / b;
  const head = `${F(eq)}; ${nA} mol ${F(A)}, ${nB} mol ${F(B)}.`;
  if (!askP) return out(`${head} ${L(ctx, "Omejujoči reaktant?", "Limiting reactant?")}`, F(limA ? A : B), [F(limA ? B : A), L(ctx, "nobeden", "neither"), L(ctx, "oba", "both")]);
  const nP = rd(((limA ? nA / a : nB / b) * p));
  const wrong = rd((limA ? nB / b : nA / a) * p);
  return nq(ctx, `${head} n(${F(P)}) = ?`, nP, "mol", [wrong, nA + nB, limA ? nA : nB, nP * 2]);
}
const EMPF = [
  // [formula, C, H, O] — družine za napačne
  ["CH4", 1, 4, 0], ["CH3", 1, 3, 0], ["CH2", 1, 2, 0], ["CH", 1, 1, 0], ["C3H8", 3, 8, 0], ["C2H5", 2, 5, 0], ["C3H4", 3, 4, 0],
  ["CH2O", 1, 2, 1], ["C2H6O", 2, 6, 1], ["CH4O", 1, 4, 1], ["C2H4O", 2, 4, 1], ["C3H6O", 3, 6, 1], ["C3H8O", 3, 8, 1],
];
function empQ(ctx) {
  const e = pick(EMPF);
  const n = pick([0.1, 0.2, 0.05]);
  const parts = [`${ctx.num(rd(12 * e[1] * n))} g C`, `${ctx.num(rd(e[2] * n))} g H`];
  if (e[3]) parts.push(`${ctx.num(rd(16 * e[3] * n))} g O`);
  const fam = EMPF.filter((x) => x !== e && !!x[3] === !!e[3]);
  return out(L(ctx, `Spojina: ${parts.join(", ")}. Empirična formula?`, `Compound: ${parts.join(", ")}. Empirical formula?`), F(e[0]), shuffle(fam).slice(0, 4).map((x) => F(x[0])));
}
function molFQ(ctx) {
  const opts = [["CH2", 14, 1, 2, 0, [2, 3, 4, 5, 6]], ["CH", 13, 1, 1, 0, [2, 6]], ["CH2O", 30, 1, 2, 1, [2, 3, 6]]];
  const [e, M0, c, h, o, ks] = pick(opts);
  const k = pick(ks);
  const f = (m) => F(`C${c * m > 1 ? c * m : ""}H${h * m > 1 ? h * m : ""}${o ? "O" + (o * m > 1 ? o * m : "") : ""}`);
  const q = L(ctx, `Empirična formula ${F(e)}, M = ${M0 * k} g/mol. Molekulska?`, `Empirical formula ${F(e)}, M = ${M0 * k} g/mol. Molecular?`);
  return out(q, f(k), [f(1), f(k + 1), f(k - 1 || k + 2), f(2 * k)]);
}
def("k2_calc", "km_kol", 13, "η", "Kemijsko računanje", "Chemical calculations", (t, ctx) => {
  const r = Math.random();
  if (t === 1) return wElQ(ctx);
  if (t === 2) return r < 0.35 ? yieldQ(ctx) : r < 0.7 ? limQ(ctx, false) : wElQ(ctx);
  return r < 0.3 ? empQ(ctx) : r < 0.5 ? molFQ(ctx) : r < 0.75 ? limQ(ctx, true) : yieldQ(ctx);
});

export const CONCEPTS = C;
