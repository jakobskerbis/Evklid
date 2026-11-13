// Pojmi za igre: fiz2 (dopolnitev fiz.js; glej README.md v tej mapi).
// Pokrije teme učnega načrta, ki v fiz.js še nimajo igre (merske napake, svetloba in nebo, sile v 8. razredu,
// vektorji, gravitacija, raztezanje, termodinamika, elektrostatika, nihanje, zvok, valovna optika, spektri).
// Področja so iz fiz.js (AREAS je zato prazen).
export const SUBJECT = "FIZ";
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
// »lepo« število: največ 4 veljavna mesta
const nice = (x) =>
  Number.isFinite(x) && Math.abs(x) >= 1e-6 && Math.abs(x) < 1e9 && Math.abs(x - Number(x.toPrecision(4))) <= 1e-9 * Math.abs(x);
// Številski odgovor z enoto; napačni: števila (tipične napake) ali že oblikovani nizi.
function nq(ctx, q, a, unit, ws, opt = {}) {
  a = rd(a);
  const f = (x) => ctx.num(x) + (unit ? " " + unit : "");
  const ok = (x) => nice(x) && (opt.neg || x > 0) && Math.abs(x - a) > 1e-9 * Math.max(1, Math.abs(a)) && Math.abs(Math.round(x * 1e6) / 1e6 - x) <= 1e-9 * Math.abs(x);
  const W = ws.map((x) => (typeof x === "number" ? rd(x) : x)).filter((x) => typeof x !== "number" || ok(x)).map((x) => (typeof x === "number" ? f(x) : x));
  const F = [a * 2, a / 2, a * 10, a / 10, a * 3, a * 1.5, a + 1, a * 100, a / 100].map(rd).filter(ok).map(f);
  return out(q, f(a), W, F);
}
// Banka vprašanj: vnos [stopnja, "vprašanje|pravilno|napačno|…" (sl), isto (en)].
// Stopnja 2 in 3 večinoma svoje vnose, včasih (30 %) z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}
// decimalno število z natanko d decimalkami (npr. 5,0)
const fx = (ctx, x, d) => {
  const dec = ctx.num(1.5).charAt(1);
  return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d).replace(".", dec);
};
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n) => String(n).replace(/\d/g, (d) => SUP[d]).replace("-", "⁻");
// razmerje a/b kot »2F«, »F/4«, »4F/9« (s simbolom X)
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function ratio(X, num, den) {
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (num === den) return X;
  if (den === 1) return `${num}${X}`;
  if (num === 1) return `${X}/${den}`;
  return `${num}${X}/${den}`;
}

// =====================================================================
// MERSKE NAPAKE
// =====================================================================
const DEV = {
  3: [[-1, 0, 1], [-2, 1, 1], [2, -1, -1], [-2, 0, 2], [-3, 1, 2], [3, -1, -2], [-1, -1, 2], [1, 1, -2]],
  4: [[-1, 0, 0, 1], [-2, 1, 0, 1], [-1, -1, 1, 1], [-2, -1, 1, 2], [-3, 1, 1, 1], [3, -1, -1, -1], [2, -2, 1, -1]],
  5: [[-2, -1, 0, 1, 2], [-1, -1, 0, 1, 1], [-2, 0, 0, 1, 1], [2, 0, 0, -1, -1], [3, -1, -1, -1, 0], [-3, 1, 1, 0, 1]],
};
// [enota, delitelj (10 → ena decimalka), najmanjša in največja osnova]
const MEAS = [["cm", 10, 100, 300], ["s", 10, 20, 99], ["g", 1, 50, 300], ["mm", 10, 20, 90]];
function measure(k) {
  const [u, div, lo, hi] = pick(MEAS);
  const base = R(lo + 3, hi - 3), devs = shuffle(pick(DEV[k]));
  const vals = devs.map((d) => (base + d) / div);
  const maxd = Math.max(...devs.map(Math.abs)) / div;
  return { u, div, vals, mean: base / div, maxd, step: 1 / div };
}
def("f2_mean", "fz_mer", 8, "x̄", "Večkratno merjenje in povprečje", "Repeated measurements and the mean", (t, ctx) => {
  const show = (m) => (ctx.lang === "sl" ? m.vals.map((v) => fx(ctx, v, m.div === 10 ? 1 : 0)).join("; ") : m.vals.map((v) => fx(ctx, v, m.div === 10 ? 1 : 0)).join(", "));
  const d = (m) => (m.div === 10 ? 1 : 0);
  if (t < 3) {
    const m = measure(t === 1 ? 3 : pick([4, 5]));
    const k = m.vals.length, sum = m.vals.reduce((s, v) => s + v, 0);
    const q = L(ctx, `Meritve: ${show(m)} ${m.u}. Povprečje?`, `Readings: ${show(m)} ${m.u}. Mean?`);
    const f = (x) => `${fx(ctx, x, d(m))} ${m.u}`;
    const ws = [sum, Math.max(...m.vals), Math.min(...m.vals), sum / (k - 1), m.mean + m.step].filter((x) => Math.abs(x * m.div - Math.round(x * m.div)) < 1e-9);
    return out(q, f(m.mean), ws.map(f), [m.mean - m.step, m.mean + 2 * m.step].map(f));
  }
  const m = measure(3);
  const f = (x) => `${fx(ctx, x, d(m))} ${m.u}`;
  if (Math.random() < 0.5) {
    const q = L(ctx, `Meritve: ${show(m)} ${m.u}. Največji odmik od povprečja?`, `Readings: ${show(m)} ${m.u}. Largest deviation from mean?`);
    const range = Math.max(...m.vals) - Math.min(...m.vals);
    return out(q, f(m.maxd), [range, m.step, m.maxd / 2, m.maxd + m.step].map((x) => f(rd(x))), [m.maxd * 3, m.maxd * 4, m.maxd + 2 * m.step].map((x) => f(rd(x))));
  }
  const P = (a, b) => `(${fx(ctx, a, d(m))} ± ${fx(ctx, b, d(m))}) ${m.u}`;
  const q = L(ctx, `Povprečje ${f(m.mean)}, največji odmik ${f(m.maxd)}. Zapis?`, `Mean ${f(m.mean)}, largest deviation ${f(m.maxd)}. Result?`);
  return out(q, P(m.mean, m.maxd), [P(m.mean, 2 * m.maxd), P(m.mean - m.maxd, m.maxd), P(m.mean, m.maxd / 2), P(m.mean + m.maxd, m.maxd)]);
});

// [x, relativna napaka v %], Δx = x · p / 100 je lepo število
const RELX = [[20, 5], [25, 4], [40, 5], [50, 2], [50, 4], [80, 5], [100, 1], [100, 2], [200, 0.5], [250, 2], [500, 1], [40, 2.5], [10, 1], [60, 5]];
const ACC = [[10, 0.1, 1], [20, 0.2, 1], [20, 0.4, 2], [25, 0.5, 2], [50, 0.5, 1], [40, 0.2, 0.5], [10, 0.2, 2], [5, 0.1, 2], [30, 0.3, 1]];
def("f2_err", "fz_mer", 10, "±", "Absolutna in relativna napaka", "Absolute and relative error", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const [x, p] = pick(RELX), u = pick(["cm", "m", "g", "s"]), dx = rd((x * p) / 100);
    if (Math.random() < 0.6) return nq(ctx, L(ctx, `x = (${x} ± ${n(dx)}) ${u}: relativna napaka?`, `x = (${x} ± ${n(dx)}) ${u}: relative error?`), p, "%", [p / 100, 100 / p, dx, p * 10]);
    return nq(ctx, L(ctx, `x = ${x} ${u}, relativna napaka ${n(p)} %: Δx = ?`, `x = ${x} ${u}, relative error ${n(p)} %: Δx = ?`), dx, u, [x * p, p, x / p, dx * 10]);
  }
  if (t === 2) {
    const k = R(0, 2);
    if (k === 0) {
      // vsota ali razlika: absolutni napaki se seštejeta
      for (;;) {
        const A = R(8, 40), B = R(2, 20), da = pick([0.1, 0.2, 0.5]), db = pick([0.1, 0.2, 0.3, 0.5]);
        if (da === db || A === B) continue;
        const u = pick(["cm", "m", "s"]), V = (v, e) => `(${fx(ctx, v, 1)} ± ${fx(ctx, e, 1)}) ${u}`;
        const plus = Math.random() < 0.5, s = plus ? A + B : A - B;
        if (s <= 0) continue;
        const q = L(ctx, `a = ${V(A, da)}, b = ${V(B, db)}: a ${plus ? "+" : "−"} b = ?`, `a = ${V(A, da)}, b = ${V(B, db)}: a ${plus ? "+" : "−"} b = ?`);
        return out(q, V(s, da + db), [V(s, Math.abs(da - db)), V(s, Math.max(da, db)), V(plus ? A - B : A + B, da + db), V(s, (da + db) / 2)].filter((x) => !x.includes("± 0,0)") && !x.includes("± 0.0)")));
      }
    }
    const p1 = pick([0.5, 1, 2, 3, 4, 5]), p2 = pick([0.5, 1, 2, 3, 4, 5].filter((x) => x !== p1));
    if (k === 1) {
      const op = pick(["a·b", "a/b"]);
      return nq(ctx, L(ctx, `Δa/a = ${n(p1)} %, Δb/b = ${n(p2)} %: relativna napaka ${op}?`, `Δa/a = ${n(p1)} %, Δb/b = ${n(p2)} %: relative error of ${op}?`), p1 + p2, "%", [Math.abs(p1 - p2), p1 * p2, (p1 + p2) / 2, Math.max(p1, p2)]);
    }
    const [e, sl, en] = pick([[2, "S = a²", "S = a²"], [3, "V = a³", "V = a³"], [2, "S = πr²", "S = πr²"], [0.5, "√x", "√x"]]);
    const p = pick([1, 2, 3, 4]);
    const v = e === 2 && sl.includes("π") ? "r" : e === 0.5 ? "x" : "a";
    return nq(ctx, L(ctx, `Δ${v}/${v} = ${p} %: relativna napaka ${sl}?`, `Δ${v}/${v} = ${p} %: relative error of ${en}?`), p * e, "%", [p, e === 0.5 ? p * 2 : p / e, p ** e, p + e]);
  }
  if (Math.random() < 0.5) {
    for (;;) {
      const [A, da, p1] = pick(ACC), [B, db, p2] = pick(ACC);
      if (A === B) continue;
      const S = A * B, dS = rd((S * (p1 + p2)) / 100);
      const V = (v, e) => `(${fx(ctx, v, 1)} ± ${fx(ctx, e, 1)}) cm`;
      const q = L(ctx, `a = ${V(A, da)}, b = ${V(B, db)}, S = ab: ΔS?`, `a = ${V(A, da)}, b = ${V(B, db)}, S = ab: ΔS?`);
      return nq(ctx, q, dS, "cm²", [da + db, da * db, S * (p1 + p2), A * db, B * da]);
    }
  }
  // zapis rezultata: zaokrožimo na mesto napake
  const dv = pick([0.02, 0.03, 0.05, 0.2, 0.3, 0.5]), dec = dv < 0.1 ? 2 : 1, u = pick(["cm", "s", "g", "m"]);
  let v;
  do v = R(10000, 99999) / 1000 + R(1, 9) / 10000;
  while (Math.floor(v * 10 ** (dec + 1)) % 10 < 5); // zaokroževanje navzgor ≠ odrezovanje
  const P = (x, dd) => `(${fx(ctx, x, dd)} ± ${fx(ctx, dv, dec)}) ${u}`;
  const vr = Math.round(v * 10 ** dec) / 10 ** dec, vt = Math.floor(v * 10 ** dec) / 10 ** dec;
  const q = L(ctx, `Rezultat ${fx(ctx, v, 4)} ${u}, napaka ${fx(ctx, dv, dec)} ${u}. Zapis?`, `Result ${fx(ctx, v, 4)} ${u}, error ${fx(ctx, dv, dec)} ${u}. Write as?`);
  return out(q, P(vr, dec), [P(v, 4), P(vt, dec), P(Math.round(v * 10 ** (dec - 1)) / 10 ** (dec - 1), dec - 1), P(Math.round(v), 0)]);
});

// =====================================================================
// SVETLOBA IN NEBO (8. razred)
// =====================================================================
const LIGHT = bank([
  [1, "Telo, ki oddaja lastno svetlobo, je?|svetilo|osvetljeno telo|senca|zrcalo", "A body that emits its own light is?|a light source|a lit object|a shadow|a mirror"],
  [1, "Kaj od naštetega je svetilo?|plamen sveče|Luna|zrcalo|list papirja", "Which is a light source?|a candle flame|the Moon|a mirror|a sheet of paper"],
  [1, "Kaj od naštetega ni svetilo?|Luna|Sonce|žareča nitka|plamen", "Which is NOT a light source?|the Moon|the Sun|a glowing filament|a flame"],
  [1, "Snov, ki prepušča skoraj vso svetlobo?|prozorna|neprozorna|prosojna|črna", "Material letting almost all light through?|transparent|opaque|translucent|black"],
  [1, "Mlečno steklo je?|prosojno|prozorno|neprozorno|svetilo", "Frosted glass is?|translucent|transparent|opaque|a light source"],
  [1, "Les je za svetlobo?|neprozoren|prozoren|prosojen|svetilo", "For light, wood is?|opaque|transparent|translucent|a light source"],
  [1, "Ravna črta, ki kaže pot svetlobe?|svetlobni žarek|senca|svetilo|zrcalo", "A straight line showing light's path?|a light ray|a shadow|a light source|a mirror"],
  [1, "Območje, kamor svetloba sploh ne pride?|senca|polsenca|svetlobni snop|žarek", "Region that light does not reach at all?|umbra|penumbra|light beam|ray"],
  [1, "Delno osvetljeno območje ob robu sence?|polsenca|senca|svetilo|odsev", "Partly lit zone at a shadow's edge?|penumbra|umbra|light source|reflection"],
  [1, "Senca je daljša, ko je Sonce?|nizko na nebu|visoko na nebu|točno nad nami|za oblakom", "Shadows are longer when the Sun is?|low in the sky|high in the sky|straight overhead|behind clouds"],
  [1, "Opoldne je senca?|najkrajša|najdaljša|enaka kot zjutraj|dvakrat daljša", "At noon a shadow is?|shortest|longest|as long as at dawn|twice as long"],
  [1, "Gledano od svetila je senca?|za telesom|pred telesom|na svetilu|nad svetilom", "Seen from the lamp, the shadow is?|behind the object|in front of it|on the lamp|above the lamp"],
  [1, "Telo vidimo, ko v oko pride?|svetloba s telesa|svetloba iz očesa|zvok|toplota", "We see an object when what enters the eye?|light from it|light from the eye|sound|heat"],
  [2, "Svetloba potuje tudi skozi?|vakuum|les|kamen|kovino", "Light can also travel through?|a vacuum|wood|stone|metal"],
  [2, "Slika na zaslonu luknjične kamere je?|obrnjena|pokončna|vedno enako velika|brez barv", "A pinhole camera image is?|inverted|upright|always the same size|colourless"],
  [2, "Večja luknjica v luknjični kameri: slika?|svetlejša, zabrisana|temnejša, ostrejša|izgine|pokončna", "Bigger pinhole in a pinhole camera: image?|brighter, blurrier|darker, sharper|vanishes|upright"],
  [2, "Telo približamo svetilu. Senca na steni?|se poveča|se zmanjša|ostane enaka|izgine", "Object moved closer to the lamp. Shadow on wall?|gets bigger|gets smaller|stays the same|vanishes"],
  [2, "Dve točkasti svetili osvetljujeta telo. Senc je?|dve|ena|nič|štiri", "Two point lamps light an object. Shadows?|two|one|none|four"],
  [2, "Bela površina svetlobo večinoma?|odbije|vpije|prepusti|proizvede", "A white surface mostly?|reflects light|absorbs light|transmits light|emits light"],
  [2, "Črna površina svetlobo večinoma?|vpije|odbije|prepusti|proizvede", "A black surface mostly?|absorbs light|reflects light|transmits light|emits light"],
  [2, "Bliskavico vidimo prej kot grom, ker?|je svetloba hitrejša|je zvok hitrejši|je grom tišji|je oko bližje", "We see lightning before thunder because?|light is faster|sound is faster|thunder is quiet|eyes are closer"],
  [2, "Snop svetlobe iz laserja je?|vzporeden|razpršen|ukrivljen|krožen", "A laser beam is?|parallel|diverging|curved|circular"],
  [2, "Snop svetlobe iz žarnice je?|razpršen|vzporeden|zbiren|ukrivljen", "Light from a bulb forms a beam that is?|diverging|parallel|converging|curved"],
  [2, "Točkasto svetilo da senco?|z ostrim robom|z zabrisanim robom|brez sence|barvno", "A point source casts a shadow that has?|sharp edges|blurred edges|no shadow|colours"],
  [2, "Polsenca nastane, ko je svetilo?|razsežno|točkasto|ugasnjeno|zrcalo", "A penumbra forms when the source is?|extended|a point|switched off|a mirror"],
  [3, "Svetloba je oblika?|energije|snovi|zvoka|sile", "Light is a form of?|energy|matter|sound|force"],
  [3, "Kaj dokazuje, da se svetloba širi premočrtno?|ostra senca|mavrica|odmev|vzgon", "What shows that light travels in straight lines?|sharp shadows|a rainbow|an echo|buoyancy"],
  [3, "Luknjična kamera: zaslon odmaknemo. Slika?|se poveča|se zmanjša|izgine|se obrne pokonci", "Pinhole camera: screen moved back. Image?|gets bigger|gets smaller|vanishes|turns upright"],
]);
def("f2_light", "fz_val", 8, "◐", "Širjenje svetlobe in senca", "How light travels; shadows", (t, ctx) => {
  const n = ctx.num;
  if (t === 2 && Math.random() < 0.5) {
    const h1 = pick([0.5, 1, 1.5, 2]), k = pick([0.5, 1.5, 2, 3]), s1 = rd(h1 * k), h2 = pick([2, 3, 4, 5, 6, 8, 10, 12]), s2 = rd(h2 * k);
    const q = L(ctx, `Palica ${n(h1)} m, senca ${n(s1)} m. Višina drevesa s senco ${n(s2)} m?`, `${n(h1)} m stick, ${n(s1)} m shadow. Tree with ${n(s2)} m shadow: height?`);
    return nq(ctx, q, h2, "m", [s2 * k, s2, s2 + h1 - s1, s2 / h1]);
  }
  if (t === 3 && Math.random() < 0.7) {
    if (Math.random() < 0.5) {
      // točkasto svetilo: senca = h · b / a
      for (;;) {
        const h = pick([2, 3, 4, 5, 6, 10]), a = pick([10, 20, 25, 30, 40]), b = pick([40, 50, 60, 80, 100, 120]);
        const H = rd((h * b) / a);
        if (b <= a || !Number.isInteger(H * 2)) continue;
        const q = L(ctx, `Palica ${h} cm je ${a} cm od svetila in ${b - a} cm od stene. Senca?`, `${h} cm stick, ${a} cm from a lamp, ${b - a} cm from a wall. Shadow?`);
        return nq(ctx, q, H, "cm", [(h * a) / b, h + b - a, (h * (b - a)) / a, h * 2]);
      }
    }
    for (;;) {
      const H = pick([2, 4, 5, 6, 8, 10, 12, 15]), d = pick([10, 20, 25, 30, 40, 50]), b = pick([10, 20]);
      const img = rd((H * b) / d);
      if (!Number.isInteger(img * 10)) continue;
      const q = L(ctx, `Drevo ${H} m je ${d} m od luknjice, zaslon ${b} cm za njo. Slika?`, `${H} m tree, ${d} m from a pinhole, screen ${b} cm behind. Image?`);
      return nq(ctx, q, img, "cm", [(d * b) / H, (H * d) / b, H * b, img * 10]);
    }
  }
  return LIGHT(t, ctx);
});

def("f2_sky", "fz_val", 8, "☾", "Zemlja, Luna in mrki", "Earth, Moon and eclipses", bank([
  [1, "Čas enega obhoda Zemlje okoli Sonca?|1 leto|1 dan|1 mesec|1 teden", "Time for Earth to orbit the Sun once?|1 year|1 day|1 month|1 week"],
  [1, "Čas enega obhoda Lune okoli Zemlje?|≈ 1 mesec|1 dan|1 leto|1 teden", "Time for the Moon to orbit Earth once?|≈ 1 month|1 day|1 year|1 week"],
  [1, "Dan in noč povzroča?|vrtenje Zemlje|kroženje Lune|kroženje Zemlje|Lunine mene", "Day and night are caused by?|Earth's rotation|the Moon's orbit|Earth's orbit|Moon phases"],
  [1, "Kje Sonce vzhaja?|na vzhodu|na zahodu|na severu|na jugu", "Where does the Sun rise?|in the east|in the west|in the north|in the south"],
  [1, "Kje Sonce zahaja?|na zahodu|na vzhodu|na severu|na jugu", "Where does the Sun set?|in the west|in the east|in the north|in the south"],
  [1, "Lunina mena, ko Lune ne vidimo?|mlaj|ščip|prvi krajec|zadnji krajec", "Moon phase when the Moon is not visible?|new moon|full moon|first quarter|last quarter"],
  [1, "Lunina mena, ko je vidna vsa Luna?|ščip|mlaj|prvi krajec|zadnji krajec", "Moon phase with the whole disc visible?|full moon|new moon|first quarter|last quarter"],
  [1, "Sonce je?|zvezda|planet|luna|komet", "The Sun is a?|star|planet|moon|comet"],
  [1, "Luna je Zemljin?|naravni satelit|planet|zvezda|komet", "The Moon is Earth's?|natural satellite|planet|star|comet"],
  [1, "Planet, najbližji Soncu?|Merkur|Venera|Zemlja|Mars", "Planet closest to the Sun?|Mercury|Venus|Earth|Mars"],
  [1, "Največji planet Osončja?|Jupiter|Saturn|Zemlja|Neptun", "Largest planet in the Solar System?|Jupiter|Saturn|Earth|Neptune"],
  [1, "Koliko planetov ima Osončje?|8|9|7|10", "How many planets are in the Solar System?|8|9|7|10"],
  [1, "Tretji planet od Sonca?|Zemlja|Mars|Venera|Jupiter", "Third planet from the Sun?|Earth|Mars|Venus|Jupiter"],
  [2, "Letne čase povzroča?|nagnjena Zemljina os|razdalja do Sonca|Lunine mene|vrtenje Lune", "Seasons are caused by?|Earth's tilted axis|distance to the Sun|Moon phases|the Moon's spin"],
  [2, "Lunin mrk je mogoč le ob?|ščipu|mlaju|prvem krajcu|zadnjem krajcu", "A lunar eclipse can only happen at?|full moon|new moon|first quarter|last quarter"],
  [2, "Sončev mrk je mogoč le ob?|mlaju|ščipu|prvem krajcu|zadnjem krajcu", "A solar eclipse can only happen at?|new moon|full moon|first quarter|last quarter"],
  [2, "Naslednja glavna mena po mlaju?|prvi krajec|zadnji krajec|ščip|Lunin mrk", "Next main phase after new moon?|first quarter|last quarter|full moon|lunar eclipse"],
  [2, "Naslednja glavna mena po ščipu?|zadnji krajec|prvi krajec|mlaj|Sončev mrk", "Next main phase after full moon?|last quarter|first quarter|new moon|solar eclipse"],
  [2, "Kje je Sonce pri nas opoldne?|na jugu|na severu|na vzhodu|na zahodu", "Where is the Sun at noon in Slovenia?|in the south|in the north|in the east|in the west"],
  [2, "Pri nas je najdaljši dan okoli?|21. junija|21. decembra|21. marca|1. januarja", "In Slovenia the longest day is around?|21 June|21 December|21 March|1 January"],
  [2, "Pri nas je najkrajši dan okoli?|21. decembra|21. junija|23. septembra|1. maja", "In Slovenia the shortest day is around?|21 December|21 June|23 September|1 May"],
  [2, "Ob enakonočju sta dan in noč?|enako dolga|različno dolga|brez Sonca|dolga po 24 h", "At an equinox, day and night are?|equally long|of different length|sunless|24 h each"],
  [2, "Planet z izrazitimi obroči?|Saturn|Mars|Merkur|Venera", "Planet with prominent rings?|Saturn|Mars|Mercury|Venus"],
  [2, "Rdeči planet?|Mars|Venera|Jupiter|Neptun", "The red planet?|Mars|Venus|Jupiter|Neptune"],
  [2, "Planeti krožijo okoli Sonca zaradi?|gravitacije|magnetizma|vetra|svetlobe", "Planets orbit the Sun because of?|gravity|magnetism|wind|light"],
  [3, "Vzrok za Lunine mene?|kroženje Lune|Zemljina senca|vrtenje Sonca|oblaki", "Cause of the Moon's phases?|the Moon's orbit|Earth's shadow|the Sun's spin|clouds"],
  [3, "Mrka ni ob vsakem ščipu, ker je Lunina tirnica?|nagnjena|krožna|prekratka|predaleč", "No eclipse at every full moon: the Moon's orbit is?|tilted|circular|too short|too far"],
  [3, "Pri nas je poletje. V Avstraliji je?|zima|poletje|pomlad|vedno vroče", "Summer here. In Australia it is?|winter|summer|spring|always hot"],
  [3, "Zemlja je Soncu najbližje v?|januarju|juliju|marcu|septembru", "Earth is closest to the Sun in?|January|July|March|September"],
  [3, "Na severni polobli je prvi krajec osvetljen?|na desni|na levi|zgoraj|spodaj", "In the northern hemisphere the first quarter is lit on the?|right|left|top|bottom"],
  [3, "Svetloba z Lune do Zemlje potuje približno?|1 s|8 min|1 h|1 dan", "Moonlight reaches Earth in about?|1 s|8 min|1 h|1 day"],
  [3, "Razdalja Zemlja–Luna je približno?|384 000 km|150 milijonov km|38 000 km|3840 km", "Earth–Moon distance is about?|384 000 km|150 million km|38 000 km|3840 km"],
  [3, "Razdalja Zemlja–Sonce je približno?|150 milijonov km|384 000 km|15 milijonov km|1,5 milijarde km", "Earth–Sun distance is about?|150 million km|384 000 km|15 million km|1.5 billion km"],
  [3, "Med Sončevim mrkom pade Lunina senca na?|Zemljo|Sonce|Luno|Mars", "During a solar eclipse the Moon's shadow falls on?|Earth|the Sun|the Moon|Mars"],
  [3, "Zvezda, najbližja Zemlji?|Sonce|Severnica|Sirij|Proksima Kentavra", "Star nearest to Earth?|the Sun|Polaris|Sirius|Proxima Centauri"],
  [3, "Severnica kaže smer?|severa|juga|vzhoda|zahoda", "The Pole Star shows the direction of?|north|south|east|west"],
  [3, "Kdaj je opoldansko Sonce pri nas najvišje?|poleti|pozimi|spomladi|jeseni", "When is the noon Sun highest in Slovenia?|in summer|in winter|in spring|in autumn"],
  [3, "Koliko dni ima prestopno leto?|366|365|364|360", "How many days in a leap year?|366|365|364|360"],
  [3, "Med popolnim Luninim mrkom je Luna pogosto?|rdečkasta|zelena|svetlejša|modra", "During a total lunar eclipse the Moon often looks?|reddish|green|brighter|blue"],
]));

// =====================================================================
// SILE (8. razred in 1. letnik)
// =====================================================================
const FORCE8 = bank([
  [1, "Naprava za merjenje sile?|silomer|termometer|ampermeter|meter", "Instrument that measures force?|spring balance|thermometer|ammeter|ruler"],
  [1, "Kaj lahko sila spremeni telesu?|gibanje ali obliko|maso|barvo|število atomov", "What can a force change about a body?|motion or shape|mass|colour|number of atoms"],
  [1, "Kako na sliki narišemo silo?|kot puščico|kot krog|kot piko|kot kvadrat", "How is a force drawn?|as an arrow|as a circle|as a dot|as a square"],
  [1, "Dolžina puščice sile pove?|velikost sile|smer sile|prijemališče|maso telesa", "The length of a force arrow shows?|its magnitude|its direction|point of action|the body's mass"],
  [1, "Sila ima velikost, smer in?|prijemališče|maso|temperaturo|barvo", "A force has size, direction and?|point of application|mass|temperature|colour"],
  [1, "Vzmet se raztegne dvakrat bolj, ko je sila?|dvakrat večja|dvakrat manjša|enaka|štirikrat večja", "A spring stretches twice as much when the force is?|twice as big|half as big|the same|four times as big"],
  [1, "Enota sile se imenuje?|newton|joule|watt|pascal", "The unit of force is the?|newton|joule|watt|pascal"],
  [2, "Silomer deluje, ker je raztezek vzmeti?|sorazmeren sili|neodvisen od sile|vedno enak|sorazmeren času", "A spring balance works because extension is?|proportional to F|independent of F|always the same|proportional to time"],
  [2, "Prevelika sila vzmet trajno?|deformira|okrepi|skrajša|namagneti", "Too large a force permanently?|deforms the spring|strengthens it|shortens it|magnetizes it"],
  [2, "Sila, s katero Zemlja privlači telo?|teža|trenje|vzgon|sila podlage", "Force with which Earth pulls a body?|weight|friction|buoyancy|normal force"],
  [2, "Pri delovanju sile vedno sodelujeta?|dve telesi|toplota in svetloba|gibanje in čas|masa in barva", "A force always involves?|two bodies|heat and light|motion and time|mass and colour"],
]);
def("f2_spring", "fz_sil", 8, "N", "Sila in vzmetna tehtnica", "Force and the spring balance", (t, ctx) => {
  const n = ctx.num;
  if (t < 3 && Math.random() < 0.35) return FORCE8(t, ctx);
  const F1 = pick([1, 2, 0.5]), x1 = pick([1, 2, 3, 4, 5]);
  if (t === 1) {
    const F = pick([2, 3, 4, 5, 6, 8].map((k) => F1 * k).filter((f) => f !== F1)), x = rd((x1 * F) / F1);
    return nq(ctx, L(ctx, `Vzmet: ${n(F1)} N → ${x1} cm. Raztezek pri ${n(F)} N?`, `Spring: ${n(F1)} N → ${x1} cm. Extension at ${n(F)} N?`), x, "cm", [x / 2, F + x1 - F1, x1, x1 * F]);
  }
  if (t === 2) {
    const k = pick([2, 3, 4, 5, 6]), x = x1 * k, F = rd(F1 * k);
    return nq(ctx, L(ctx, `Vzmet: ${n(F1)} N → ${x1} cm. Sila pri raztezku ${x} cm?`, `Spring: ${n(F1)} N → ${x1} cm. Force at ${x} cm extension?`), F, "N", [(x * x1) / F1, x / F1, x - x1 + F1, x]);
  }
  const k = R(0, 2);
  if (k === 0) {
    const L0 = pick([8, 10, 12, 15, 20]), Fa = pick([1, 2, 4]), xa = pick([2, 3, 4]), Fb = Fa * pick([2, 3, 1.5]), xb = rd((xa * Fb) / Fa);
    return nq(ctx, L(ctx, `Vzmet je dolga ${L0} cm, pri ${n(Fa)} N ${L0 + xa} cm. Dolžina pri ${n(Fb)} N?`, `Spring ${L0} cm long, ${L0 + xa} cm at ${n(Fa)} N. Length at ${n(Fb)} N?`), L0 + xb, "cm", [((L0 + xa) * Fb) / Fa, xb, L0 + xa + xb, L0 + Fb]);
  }
  if (k === 1) {
    const m1 = pick([50, 100, 200]), xm = pick([1, 2, 3, 4]), m2 = m1 * pick([2, 3, 4, 5]), x = (xm * m2) / m1;
    return nq(ctx, L(ctx, `Utež ${m1} g raztegne vzmet za ${xm} cm. Raztezek pri ${m2} g?`, `A ${m1} g mass stretches a spring ${xm} cm. Extension for ${m2} g?`), x, "cm", [xm, x * 2, xm + m2 / 100, x / 2]);
  }
  const xmax = pick([10, 12, 15, 20]), Fmax = rd((F1 * xmax) / x1);
  if (!nice(Fmax)) return nq(ctx, L(ctx, `Silomer: 1 N → 2 cm, skala do 10 cm. Največja sila?`, `Spring balance: 1 N → 2 cm, scale up to 10 cm. Max force?`), 5, "N", [20, 10, 2]);
  return nq(ctx, L(ctx, `Silomer: ${n(F1)} N → ${x1} cm, skala do ${xmax} cm. Največja sila?`, `Spring balance: ${n(F1)} N → ${x1} cm, scale up to ${xmax} cm. Max force?`), Fmax, "N", [(xmax * x1) / F1, xmax, Fmax / 2, Fmax * 2]);
});

const TRIPLE = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [30, 40, 50], [60, 80, 100], [15, 20, 25], [24, 32, 40]];
def("f2_sum", "fz_sil", 8, "ΣF", "Sestavljanje sil in ravnovesje", "Combining forces and equilibrium", (t, ctx) => {
  if (t === 1) {
    const F1 = R(3, 12) * 5, F2 = R(1, 10) * 5;
    if (F1 === F2) return nq(ctx, L(ctx, `Sili ${F1} N in ${F2} N v isto smer. Rezultanta?`, `Forces ${F1} N and ${F2} N, same direction. Resultant?`), 2 * F1, "N", ["0 N", F1, F1 / 2, 3 * F1]);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Sili ${F1} N in ${F2} N v isto smer. Rezultanta?`, `Forces ${F1} N and ${F2} N, same direction. Resultant?`), F1 + F2, "N", [Math.abs(F1 - F2), (F1 + F2) / 2, Math.max(F1, F2), F1 * 2]);
    return nq(ctx, L(ctx, `Sili ${F1} N in ${F2} N v nasprotni smeri. Rezultanta?`, `Forces ${F1} N and ${F2} N, opposite directions. Resultant?`), Math.abs(F1 - F2), "N", [F1 + F2, "0 N", Math.abs(F1 - F2) / 2, Math.max(F1, F2)]);
  }
  const dir = (F, right) => L(ctx, `${ctx.num(F)} N v ${right ? "desno" : "levo"}`, `${ctx.num(F)} N to the ${right ? "right" : "left"}`);
  if (t === 2) {
    if (Math.random() < 0.4) {
      const F = R(2, 20) * 5, right = Math.random() < 0.5;
      const q = L(ctx, `Na telo deluje sila ${F} N v ${right ? "desno" : "levo"}. Katera jo uravnovesi?`, `A ${F} N force acts to the ${right ? "right" : "left"}. Balancing force?`);
      return out(q, dir(F, !right), [dir(F, right), dir(2 * F, !right), dir(F / 2, !right), "0 N"]);
    }
    for (;;) {
      const a = R(1, 8) * 5, b = R(1, 8) * 5, c = R(1, 12) * 5, r = a + b - c;
      if (r === 0 || a === b) continue;
      const q = L(ctx, `V desno ${a} N in ${b} N, v levo ${c} N. Rezultanta?`, `${a} N and ${b} N to the right, ${c} N to the left. Resultant?`);
      return out(q, dir(Math.abs(r), r > 0), [dir(Math.abs(r), r < 0), dir(a + b + c, true), dir(Math.abs(a - b + c) || a + b, r > 0), dir(Math.abs(a - b - c) || c, r > 0)]);
    }
  }
  const [a, b, c] = pick(TRIPLE);
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `Pravokotni sili ${a} N in ${b} N. Rezultanta?`, `Perpendicular forces ${a} N and ${b} N. Resultant?`), c, "N", [a + b, b - a, (a + b) / 2, a * a + b * b]);
  return nq(ctx, L(ctx, `Pravokotni sili ${a} N in ${b} N. Uravnovešajoča sila?`, `Perpendicular forces ${a} N and ${b} N. Balancing force?`), c, "N", [a + b, b - a, 0, a * a + b * b]);
});

const DRAG = bank([
  [1, "Smer sile trenja?|nasprotna gibanju|v smeri gibanja|navpično navzgor|navpično navzdol", "Direction of friction?|opposite to motion|along the motion|straight up|straight down"],
  [1, "Kaj zmanjša trenje?|mazanje z oljem|hrapava podlaga|večja teža|pesek na ledu", "What reduces friction?|oiling|a rough surface|more weight|sand on ice"],
  [1, "Kaj poveča trenje?|pesek na poledici|olje|led|gladka podlaga", "What increases friction?|sand on an icy road|oil|ice|a smooth surface"],
  [1, "Trenje je večje na podlagi, ki je?|hrapava|gladka|ledena|polirana", "Friction is larger on a surface that is?|rough|smooth|icy|polished"],
  [1, "Sila, ki zavira gibanje skozi zrak?|zračni upor|vzgon|teža|sila vrvi", "Force resisting motion through air?|air resistance|buoyancy|weight|tension"],
  [1, "Zračni upor je večji pri?|večji hitrosti|manjši hitrosti|mirovanju|večji masi", "Air resistance is larger at?|higher speed|lower speed|rest|higher mass"],
  [1, "Padalo zmanjša hitrost padanja, ker poveča?|zračni upor|težo|maso|vzgon", "A parachute slows the fall by increasing?|air resistance|weight|mass|buoyancy"],
  [1, "Trenje med podplati in tlemi nam omogoča?|hojo|lebdenje|plavanje|letenje", "Friction between soles and floor lets us?|walk|hover|swim|fly"],
  [1, "Na ledu zlahka zdrsnemo, ker je trenje?|majhno|veliko|neskončno|vedno nič", "We slip on ice because friction is?|small|large|infinite|always zero"],
  [1, "Oblika avtomobila z majhnim uporom?|aerodinamična|kockasta|ploščata spredaj|hrapava", "Car shape with low drag?|streamlined|boxy|flat-fronted|rough"],
  [1, "Ko drgnemo dlani, se?|segrejejo|ohladijo|namagnetijo|zmrznejo", "Rubbing your hands together makes them?|warm|cold|magnetic|frozen"],
  [1, "Kotalno trenje je v primerjavi z drsnim?|manjše|večje|enako|vedno nič", "Rolling friction compared with sliding?|smaller|larger|equal|always zero"],
  [2, "Trenje se poveča, ko povečamo?|pritisno silo|barvo telesa|dolžino vrvi|temperaturo zraka", "Friction increases when we increase the?|normal force|body's colour|rope length|air temperature"],
  [2, "Drsno trenje (ista teža) skoraj ni odvisno od?|velikosti ploskve|vrste podlage|hrapavosti|pritisne sile", "Sliding friction (same weight) hardly depends on?|contact area|surface type|roughness|normal force"],
  [2, "Zaboj obtežimo, teža se podvoji. Trenje?|se podvoji|se razpolovi|ostane enako|se početveri", "A box's weight is doubled. Friction?|doubles|halves|stays the same|quadruples"],
  [2, "Zračni upor je odvisen od hitrosti in?|oblike telesa|barve telesa|vonja telesa|starosti telesa", "Air drag depends on speed and?|shape|colour|smell|age"],
  [2, "Upor v vodi glede na zrak (ista hitrost)?|večji|manjši|enak|nič", "Drag in water vs air (same speed)?|larger|smaller|equal|zero"],
  [2, "Sila lepenja deluje, ko telo?|miruje|drsi|se kotali|pada", "Static friction acts when a body?|is at rest|slides|rolls|falls"],
  [2, "Da zaboj premaknemo, mora biti sila večja od?|sile lepenja|teže zaboja|sile podlage|mase zaboja", "To start moving a box, the push must exceed?|max static friction|its weight|the normal force|its mass"],
  [2, "Največja sila lepenja v primerjavi z drsnim trenjem?|večja|manjša|enaka|nič", "Max static friction vs sliding friction?|larger|smaller|equal|zero"],
  [2, "Enakomerno vlečenje: vlečna sila je enaka?|sili trenja|teži|nič|masi", "Pulling at constant speed: pull equals?|friction|weight|zero|mass"],
  [2, "Zimske pnevmatike imajo globok profil za?|večje trenje|manjše trenje|manjši upor|lepši videz", "Winter tyres have deep treads for?|more friction|less friction|less drag|looks"],
  [2, "Padalec pada enakomerno, ko je upor enak?|teži|nič|masi|vzgonu", "A skydiver falls at constant speed when drag equals?|weight|zero|mass|buoyancy"],
  [2, "Pri veliki hitrosti avto porabi več goriva zaradi?|zračnega upora|trenja v ležajih|teže|vzgona", "At high speed a car uses more fuel mainly due to?|air drag|bearing friction|weight|buoyancy"],
]);
def("f2_drag", "fz_sil", 8, "Fₜᵣ", "Trenje in upor", "Friction and drag", (t, ctx) => {
  if (t === 1 && Math.random() < 0.3) {
    const F = R(2, 20) * 5;
    return nq(ctx, L(ctx, `Vlečna sila ${F} N, zaboj drsi enakomerno. Trenje?`, `Pull ${F} N, the box slides at constant speed. Friction?`), F, "N", ["0 N", 2 * F, F / 2]);
  }
  // trenje je sorazmerno pritisni sili (teži na vodoravni podlagi)
  const prop = () => {
    const G = pick([100, 200, 400, 500]), k = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), Ft = rd(G * k), G2 = G * pick([2, 3, 4, 0.5, 1.5]);
    const q = L(ctx, `Teža ${G} N, trenje ${ctx.num(Ft)} N. Trenje pri teži ${G2} N?`, `Weight ${G} N, friction ${ctx.num(Ft)} N. Friction at weight ${G2} N?`);
    return nq(ctx, q, rd(G2 * k), "N", [Ft, Ft + G2 - G, G2, (Ft * G) / G2]);
  };
  if (t === 2 && Math.random() < 0.3) return prop();
  if (t === 3) {
    const r = Math.random();
    if (r < 0.4) {
      const Ft = R(2, 12) * 5, F = Ft + R(1, 10) * 5;
      return nq(ctx, L(ctx, `Vlečna sila ${F} N, trenje ${Ft} N. Rezultanta?`, `Pull ${F} N, friction ${Ft} N. Net force?`), F - Ft, "N", [F + Ft, F, Ft]);
    }
    if (r < 0.7) return prop();
  }
  return DRAG(t, ctx);
});

// ----- vektorji v kinematiki (1. letnik) -----
def("f2_relv", "fz_gib", 10, "⇉", "Sestavljanje hitrosti", "Adding velocities", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.6) {
      const vb = R(3, 8), vr = R(1, vb - 1), down = Math.random() < 0.5;
      const q = L(ctx, `Čoln ${vb} m/s glede na vodo, tok ${vr} m/s. Hitrost ${down ? "s tokom" : "proti toku"}?`, `Boat ${vb} m/s rel. to water, current ${vr} m/s. Speed ${down ? "downstream" : "upstream"}?`);
      return nq(ctx, q, down ? vb + vr : vb - vr, "m/s", [down ? vb - vr : vb + vr, vb, (vb + vr) / 2, vr]);
    }
    const vt = pick([10, 15, 20, 25, 30]), vp = pick([1, 2]), fwd = Math.random() < 0.5;
    const q = L(ctx, `Vlak ${vt} m/s, potnik hodi ${fwd ? "naprej" : "nazaj"} ${vp} m/s. Hitrost glede na tla?`, `Train ${vt} m/s, passenger walks ${fwd ? "forward" : "back"} ${vp} m/s. Ground speed?`);
    return nq(ctx, q, fwd ? vt + vp : vt - vp, "m/s", [fwd ? vt - vp : vt + vp, vt, vp]);
  }
  const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [1.5, 2, 2.5], [2.4, 3.2, 4], [9, 12, 15]]);
  if (t === 2) {
    if (Math.random() < 0.5) {
      const q = L(ctx, `Čoln ${ctx.num(b)} m/s ⊥ tok ${ctx.num(a)} m/s. Hitrost glede na breg?`, `Boat ${ctx.num(b)} m/s ⊥ current ${ctx.num(a)} m/s. Speed vs bank?`);
      return nq(ctx, q, c, "m/s", [a + b, b - a, a * a + b * b, (a + b) / 2]);
    }
    let w, tt;
    do (w = pick([30, 60, 90, 120])), (tt = rd(w / b));
    while (!Number.isInteger(tt * 10));
    const q = L(ctx, `Reka ${w} m, čoln ${ctx.num(b)} m/s ⊥ tok ${ctx.num(a)} m/s. Čas prečkanja?`, `River ${w} m, boat ${ctx.num(b)} m/s ⊥ current ${ctx.num(a)} m/s. Crossing time?`);
    return nq(ctx, q, tt, "s", [w / c, w / a, w / (a + b), w / (b - a)]);
  }
  if (Math.random() < 0.5) {
    for (;;) {
      const w = pick([30, 60, 90, 120]), tt = rd(w / b), drift = rd(a * tt);
      if (!Number.isInteger(tt * 10) || !nice(drift)) continue;
      const q = L(ctx, `Reka ${w} m, čoln ${ctx.num(b)} m/s ⊥ tok ${ctx.num(a)} m/s. Tok ga odnese za?`, `River ${w} m, boat ${ctx.num(b)} m/s ⊥ current ${ctx.num(a)} m/s. Drift?`);
      return nq(ctx, q, drift, "m", [w, rd((w * b) / a), rd(c * tt), rd((w * c) / b)]);
    }
  }
  // čoln usmerimo poševno, da gre naravnost čez: hitrost glede na breg = √(vč² − vt²)
  const q = L(ctx, `Čoln ${ctx.num(c)} m/s glede na vodo, tok ${ctx.num(a)} m/s, pot ⊥ breg. v?`, `Boat ${ctx.num(c)} m/s rel. water, current ${ctx.num(a)} m/s, path ⊥ bank. v?`);
  return nq(ctx, q, b, "m/s", [c, c - a, c + a, rd(Math.sqrt(c * c + a * a))]);
});

const HTHROW = bank([
  [2, "Vodoravni met: vodoravna komponenta hitrosti?|stalna|narašča|pada|je nič", "Horizontal throw: horizontal velocity?|constant|increases|decreases|zero"],
  [2, "Z iste višine A spustimo, B vržemo vodoravno. Prej pade?|obe hkrati|A|B|težje telo", "Same height: ball A dropped, B thrown sideways. First down?|both at once|A|B|the heavier one"],
  [2, "Tir vodoravnega meta (brez upora)?|parabola|krožnica|premica|elipsa", "Path of a horizontal throw (no drag)?|parabola|circle|straight line|ellipse"],
  [2, "Pospešek pri vodoravnem metu?|g navpično navzdol|g vodoravno|0|v₀/t", "Acceleration in a horizontal throw?|g downward|g horizontal|zero|v₀/t"],
  [3, "Dvakrat večja v₀ (ista višina): domet?|dvakrat večji|enak|štirikrat večji|pol manjši", "Double v₀ (same height): range?|doubles|unchanged|quadruples|halves"],
  [3, "Štirikrat večja višina (ista v₀): čas leta?|dvakrat daljši|štirikrat daljši|enak|pol krajši", "Height ×4 (same v₀): flight time?|×2|×4|unchanged|halved"],
  [3, "Čas leta pri vodoravnem metu ni odvisen od?|vodoravne hitrosti|višine|g|kraja na Zemlji", "Flight time of a horizontal throw doesn't depend on?|horizontal speed|height|g|place on Earth"],
]);
def("f2_hthrow", "fz_gib", 10, "↷", "Vodoravni met", "Horizontal projectile", (t, ctx) => {
  const n = ctx.num, G = "(g = 10 m/s²)";
  if (t === 1) {
    const tt = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), h = rd(5 * tt * tt);
    if (Math.random() < 0.4) return nq(ctx, L(ctx, `Vodoravni met traja ${n(tt)} s. Višina meta? ${G}`, `A horizontal throw lasts ${n(tt)} s. Height? ${G}`), h, "m", [10 * tt * tt, 10 * tt, 5 * tt, 2 * h]);
    return nq(ctx, L(ctx, `Vodoravni met z višine ${n(h)} m. Čas leta? ${G}`, `Horizontal throw from ${n(h)} m. Flight time? ${G}`), tt, "s", [h / 5, h / 10, tt * tt, 2 * tt]);
  }
  if (Math.random() < 0.3) return HTHROW(t, ctx);
  if (t === 2) {
    const tt = pick([1, 2, 3, 4]), h = 5 * tt * tt, v0 = pick([5, 8, 10, 12, 15, 20]);
    return nq(ctx, L(ctx, `v₀ = ${v0} m/s, višina ${h} m. Domet? ${G}`, `v₀ = ${v0} m/s, height ${h} m. Range? ${G}`), v0 * tt, "m", [v0 * (h / 10), v0 * tt * tt, v0 * 2 * tt, v0 * h]);
  }
  if (Math.random() < 0.5) {
    const [v0, tt] = pick([[15, 2], [30, 4], [40, 3], [7.5, 1], [20, 1.5], [12, 0.5], [45, 6], [9, 1.2]]), vy = 10 * tt, h = rd(5 * tt * tt), v = rd(Math.hypot(v0, vy));
    return nq(ctx, L(ctx, `v₀ = ${n(v0)} m/s, višina ${n(h)} m. Hitrost ob tleh? ${G}`, `v₀ = ${n(v0)} m/s, height ${n(h)} m. Impact speed? ${G}`), v, "m/s", [v0 + vy, vy, v0, rd(Math.sqrt(v0 * v0 + 2 * 10 * h * 2))]);
  }
  const tt = pick([1, 2, 3, 4]), h = 5 * tt * tt, v0 = pick([5, 10, 15, 20, 25]), d = v0 * tt;
  return nq(ctx, L(ctx, `Višina ${h} m, domet ${d} m. v₀ = ? ${G}`, `Height ${h} m, range ${d} m. v₀ = ? ${G}`), v0, "m/s", [d / (h / 10), d * tt, d / (tt * tt), d / h]);
});

const FORCES = bank([
  [1, "Sila, s katero podlaga deluje na telo?|sila podlage|teža|trenje|vzgon", "Force of a surface pushing on a body?|normal force|weight|friction|buoyancy"],
  [1, "Sila stisnjene vzmeti?|prožnostna sila|teža|trenje|vzgon", "Force from a compressed spring?|elastic force|weight|friction|buoyancy"],
  [1, "Sila, s katero Zemlja privlači telo?|teža|sila podlage|trenje|vzgon", "Force with which Earth pulls a body?|weight|normal force|friction|buoyancy"],
  [1, "Sila tekočine navzgor na potopljeno telo?|vzgon|teža|trenje|sila podlage", "Upward force of a fluid on a submerged body?|buoyancy|weight|friction|normal force"],
  [1, "Sila podlage je glede na podlago?|pravokotna|vzporedna|pod kotom 45°|poljubna", "The normal force relative to the surface is?|perpendicular|parallel|at 45°|random"],
  [1, "Trenje je glede na podlago?|vzporedno|pravokotno|pod kotom 45°|navpično", "Friction relative to the surface is?|parallel|perpendicular|at 45°|vertical"],
  [1, "Teža vedno kaže?|navpično navzdol|pravokotno na klanec|vzdolž klanca|navpično navzgor", "Weight always points?|vertically down|normal to surface|along the slope|vertically up"],
  [1, "Knjiga miruje na mizi. Sila podlage je enaka?|teži knjige|nič|dvojni teži|masi knjige", "A book rests on a table. Normal force equals?|its weight|zero|twice its weight|its mass"],
  [1, "Sila, ki deluje na daljavo (brez dotika)?|teža|trenje|sila podlage|zračni upor", "Which force acts at a distance?|gravity|friction|normal force|air drag"],
  [1, "Vsota sil na telo, ki miruje?|0 N|teža|sila podlage|trenje", "Net force on a body at rest?|0 N|its weight|normal force|friction"],
  [1, "Enota koeficienta vzmeti?|N/m|Nm|N|kg/m", "Unit of the spring constant?|N/m|N·m|N|kg/m"],
  [1, "Prožnostna sila vzmeti je sorazmerna?|raztezku|masi vzmeti|dolžini vzmeti|času", "A spring's force is proportional to its?|extension|mass|length|age"],
]);
def("f2_forces", "fz_sil", 10, "F∥", "Vrste sil, sestavljanje in razstavljanje", "Kinds of forces, components", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) return FORCES(1, ctx);
  if (t === 2) {
    if (Math.random() < 0.25) return FORCES(1, ctx);
    if (Math.random() < 0.6) {
      const k = pick([50, 100, 200, 400, 500]), x = pick([2, 4, 5, 10, 20]), F = rd((k * x) / 100);
      if (Math.random() < 0.5) return nq(ctx, L(ctx, `k = ${k} N/m, raztezek ${x} cm. Sila vzmeti?`, `k = ${k} N/m, extension ${x} cm. Spring force?`), F, "N", [k * x, k / x, F * 10, (k * x) / 1000]);
      return nq(ctx, L(ctx, `Sila ${n(F)} N raztegne vzmet za ${x} cm. k = ?`, `A ${n(F)} N force stretches a spring ${x} cm. k = ?`), k, "N/m", [F / x, F * x, k / 100, F * x * 100]);
    }
    const F = pick([10, 20, 40, 50, 60, 80, 100]);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Sila ${F} N pod 60° nad vodoravnico. Vodoravna komponenta?`, `Force ${F} N at 60° above horizontal. Horizontal component?`), F / 2, "N", [F, F * 2, rd(F * 0.866), F / 3]);
    return nq(ctx, L(ctx, `Sila ${F} N pod 30° nad vodoravnico. Navpična komponenta?`, `Force ${F} N at 30° above horizontal. Vertical component?`), F / 2, "N", [F, F * 2, rd(F * 0.866), F / 3]);
  }
  if (Math.random() < 0.5) {
    const G = pick([20, 40, 50, 100, 200, 500]);
    return nq(ctx, L(ctx, `Klanec 30°, teža ${G} N. Komponenta teže vzdolž klanca?`, `30° slope, weight ${G} N. Weight component along the slope?`), G / 2, "N", [G, G / 10, rd(G * 0.866), G * 2]);
  }
  const G = pick([10, 20, 50, 100, 200, 500]), along = Math.random() < 0.5;
  const q = L(ctx, `Klanec (sin α = 0,6), teža ${G} N. Komponenta ${along ? "vzdolž klanca" : "⊥ na klanec"}?`, `Slope (sin α = 0.6), weight ${G} N. Component ${along ? "along it" : "normal to it"}?`);
  return nq(ctx, q, along ? 0.6 * G : 0.8 * G, "N", [along ? 0.8 * G : 0.6 * G, G, G / 0.6, 0.4 * G]);
});

// =====================================================================
// GRAVITACIJA (2. letnik)
// =====================================================================
const GRAV = bank([
  [1, "Tirnica planeta okoli Sonca je?|elipsa|parabola|premica|spirala", "A planet's orbit around the Sun is?|an ellipse|a parabola|a straight line|a spiral"],
  [1, "Kje v tirnici planeta je Sonce?|v gorišču elipse|v središču elipse|na robu elipse|zunaj elipse", "Where in a planet's orbit is the Sun?|at a focus|at the centre|on the edge|outside it"],
  [1, "Gravitacijska sila med telesoma je vedno?|privlačna|odbojna|nič|odvisna od naboja", "Gravitational force between bodies is always?|attractive|repulsive|zero|charge-dependent"],
  [1, "Gravitacijska konstanta G?|6,67·10⁻¹¹ Nm²/kg²|9,81 m/s²|6,02·10²³ mol⁻¹|9·10⁹ Nm²/As²", "Gravitational constant G?|6.67·10⁻¹¹ Nm²/kg²|9.81 m/s²|6.02·10²³ mol⁻¹|9·10⁹ Nm²/C²"],
  [2, "Planet je na tirnici hitrejši, ko je?|bliže Soncu|dlje od Sonca|vedno enako hiter|na polovici poti", "A planet moves faster when it is?|closer to the Sun|farther from the Sun|always the same|halfway"],
  [2, "Obhodni čas geostacionarnega satelita?|24 h|1 h|12 h|1 leto", "Period of a geostationary satellite?|24 h|1 h|12 h|1 year"],
  [2, "Astronavti na postaji so v breztežnosti, ker?|prosto padajo|ni gravitacije|ni zraka|so predaleč", "Astronauts in orbit are weightless because they?|are in free fall|feel no gravity|have no air|are too far"],
  [2, "Satelit na nižji krožni tirnici ima hitrost?|večjo|manjšo|enako|nič", "A satellite on a lower circular orbit has speed?|higher|lower|the same|zero"],
  [2, "Pospešek satelita na krožni tirnici kaže?|proti Zemlji|v smeri gibanja|stran od Zemlje|ga ni", "A satellite's acceleration on a circular orbit points?|toward Earth|along its motion|away from Earth|it has none"],
  [3, "Prva kozmična hitrost (ob Zemlji)?|7,9 km/s|11,2 km/s|340 m/s|300 000 km/s", "Orbital speed near Earth's surface?|7.9 km/s|11.2 km/s|340 m/s|300 000 km/s"],
  [3, "Ubežna hitrost z Zemlje?|11,2 km/s|7,9 km/s|340 m/s|300 000 km/s", "Escape speed from Earth?|11.2 km/s|7.9 km/s|340 m/s|300 000 km/s"],
  [3, "Geostacionarni satelit kroži nad?|ekvatorjem|severnim polom|Slovenijo|južnim polom", "A geostationary satellite is above the?|equator|North Pole|Slovenia|South Pole"],
  [3, "Masa Zemlje iz g na površju in polmera R?|gR²/G|gR/G|GR²/g|g/(GR²)", "Earth's mass from surface g and radius R?|gR²/G|gR/G|GR²/g|g/(GR²)"],
]);
// spremembe za F ∝ m₁m₂/r² in F ∝ q₁q₂/r²; vrne [num, den] razmerja
function lawRatio(a, b, k) {
  // k = [kn, kd]: r → (kn/kd)·r
  const [kn, kd] = k;
  return [a * b * kd * kd, kn * kn];
}
function lawQ(ctx, t, sym, Fsl, Fen) {
  const A = sym === "m" ? ["m₁", "m₂"] : ["q₁", "q₂"];
  let a = 1, b = 1, k = [1, 1];
  for (;;) {
    a = 1; b = 1; k = [1, 1];
    const ch = t === 1 ? [pick([0, 1])] : [pick([0, 1, 2]), pick([0, 1, 2])];
    if (ch.includes(0)) a = pick([2, 3, 4]);
    if (ch.includes(1)) k = pick([[2, 1], [3, 1], [1, 2], [4, 1], [1, 3]]);
    if (ch.includes(2)) b = pick([2, 3]);
    if (a * b * k[1] * k[1] !== k[0] * k[0]) break;
  }
  const parts = [];
  if (a !== 1) parts.push(`${A[0]} → ${a}${A[0]}`);
  if (b !== 1) parts.push(`${A[1]} → ${b}${A[1]}`);
  if (k[0] !== k[1]) parts.push(k[1] === 1 ? `r → ${k[0]}r` : `r → r/${k[1]}`);
  const [nm, dn] = lawRatio(a, b, k);
  const ans = ratio("F", nm, dn);
  const ws = [ratio("F", a * b * k[1], k[0]), ratio("F", a * b * k[0] * k[0], k[1] * k[1]), ratio("F", k[0] * k[0], a * b * k[1] * k[1]), ratio("F", a + b - 1, 1), ratio("F", nm * 2, dn), "F"];
  return out(`${parts.join(", ")}. ${L(ctx, Fsl, Fen)} F → ?`, ans, ws, [ratio("F", nm, dn * 2), ratio("F", nm * 4, dn)]);
}
def("f2_grav", "fz_sil", 11, "Gm", "Gravitacijski zakon in sateliti", "Law of gravitation and satellites", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) return Math.random() < 0.6 ? lawQ(ctx, 1, "m", "Gravitacijska sila", "Gravitational force") : GRAV(1, ctx);
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) return lawQ(ctx, 2, "m", "Gravitacijska sila", "Gravitational force");
    if (k === 1) {
      const [h, g] = pick([[1, 2.5], [3, 0.625], [9, 0.1], [4, 0.4]]);
      const hs = h === 1 ? "R" : `${h}R`;
      return nq(ctx, L(ctx, `Na višini ${hs} nad površjem Zemlje: g = ? (g₀ = 10 m/s²)`, `At height ${hs} above Earth's surface: g = ? (g₀ = 10 m/s²)`), g, "m/s²", [10 / (h + 1), 10 / (h * h), 10 / h, 10 / (h + 1) ** 3]);
    }
    if (k === 2) {
      const [r, T, v] = pick([[4, "8T", "v/2"], [9, "27T", "v/3"], [16, "64T", "v/4"]]);
      if (Math.random() < 0.5) return out(L(ctx, `Satelit: r → ${r}r. Obhodni čas T → ?`, `Satellite: r → ${r}r. Orbital period T → ?`), T, [`${r}T`, `${r * r}T`, `${Math.sqrt(r)}T`, `T/${Math.sqrt(r) ** 3}`]);
      return out(L(ctx, `Satelit: r → ${r}r. Hitrost v → ?`, `Satellite: r → ${r}r. Speed v → ?`), v, [`v/${r}`, `${Math.sqrt(r)}v`, `${r}v`, `v/${r * r}`]);
    }
    return GRAV(2, ctx);
  }
  if (Math.random() < 0.3) return GRAV(3, ctx);
  if (Math.random() < 0.4) return lawQ(ctx, 3, "m", "Gravitacijska sila", "Gravitational force");
  const [a, k] = pick([[2, 2], [4, 2], [8, 2], [1, 2], [9, 3], [16, 4], [0.5, 0.5], [2, 0.5], [3, 1], [0.25, 0.5]]);
  const mS = (x) => (x === 1 ? "" : n(x));
  const q = L(ctx, `Planet: M = ${mS(a)}M₀, R = ${mS(k)}R₀ (Zemlja: g₀ = 10 m/s²). g = ?`, `Planet: M = ${mS(a)}M₀, R = ${mS(k)}R₀ (Earth: g₀ = 10 m/s²). g = ?`);
  return nq(ctx, q, rd((10 * a) / (k * k)), "m/s²", [(10 * a) / k, 10 * a * k * k, (10 * k * k) / a, 10 * a, 10]);
});

// =====================================================================
// TOPLOTA (2. letnik): raztezanje, termodinamika
// =====================================================================
const EXP = bank([
  [1, "Zakaj imajo mostovi dilatacijske reže?|zaradi raztezanja|zaradi vetra|za odtok vode|za okras", "Why do bridges have expansion joints?|thermal expansion|wind|drainage|decoration"],
  [1, "Bimetalni trak se ob segrevanju?|ukrivi|enakomerno skrajša|stali|namagneti", "When heated, a bimetallic strip?|bends|shortens evenly|melts|becomes magnetic"],
  [1, "Enota linearnega razteznostnega koeficienta?|K⁻¹|K|m/K|m·K", "Unit of the linear expansion coefficient?|K⁻¹|K|m/K|m·K"],
  [1, "Tračnice so poleti?|daljše|krajše|enako dolge|težje", "In summer, rails are?|longer|shorter|the same length|heavier"],
  [2, "Voda med 0 °C in 4 °C se pri segrevanju?|skrči|raztegne|izpari|strdi", "Water between 0 °C and 4 °C, when heated?|contracts|expands|evaporates|freezes"],
  [2, "Prostorninski koeficient trdnine β ≈ ?|3α|α|2α|α³", "Volume coefficient of a solid β ≈ ?|3α|α|2α|α³"],
  [2, "Kovinski pokrov kozarca se laže odvije pod?|toplo vodo|mrzlo vodo|ledom|soljo", "A metal jar lid unscrews more easily under?|warm water|cold water|ice|salt"],
]);
const AL = [1, 1.2, 1.7, 2, 2.4, 0.9];
def("f2_expand", "fz_top", 11, "Δl", "Temperaturno raztezanje", "Thermal expansion", (t, ctx) => {
  const n = ctx.num, E5 = "·10⁻⁵ K⁻¹";
  if (t < 3 && Math.random() < 0.3) return EXP(t, ctx);
  if (t === 1) {
    for (;;) {
      const am = pick(AL), l = pick([10, 20, 50, 100, 200, 500]), dT = pick([10, 20, 25, 40, 50]), dl = rd((am * l * dT) / 100);
      if (!Number.isInteger(dl * 100) || dl < 0.5) continue;
      return nq(ctx, `α = ${n(am)}${E5}, l = ${l} m, ΔT = ${dT} K: Δl = ? mm`, dl, "", [dl * 10, dl / 10, rd((am * l) / 100), dl * 1000, rd(am * l * dT)]);
    }
  }
  if (t === 2) {
    if (Math.random() < 0.4) {
      const am = pick(AL), b = rd(3 * am), cube = Number((am ** 3).toFixed(2));
      return out(`α = ${n(am)}${E5}: β = ?`, `${n(b)}${E5}`, [`${n(am)}${E5}`, `${n(rd(2 * am))}${E5}`, `${n(cube)}·10⁻¹⁵ K⁻¹`, `${n(Math.round((am / 3) * 100) / 100)}${E5}`]);
    }
    for (;;) {
      const [bm, e] = pick([[1, -3], [2, -4], [1.8, -4], [1, -4]]), V = pick([1, 2, 5, 10, 20, 50, 100]), dT = pick([10, 20, 25, 50]);
      const dV = rd(bm * 10 ** e * V * dT);
      if (!Number.isInteger(dV * 1000) || dV < 0.01) continue;
      return nq(ctx, `β = ${n(bm)}·10${sup(e)} K⁻¹, V = ${V} L, ΔT = ${dT} K: ΔV = ? L`, dV, "", [dV * 10, dV / 10, rd(dV / 3), rd(bm * V * dT / 100)]);
    }
  }
  if (Math.random() < 0.5) {
    for (;;) {
      const am = pick(AL), l = pick([10, 20, 50, 100]), dT = pick([10, 20, 25, 40, 50]), dl = rd((am * l * dT) / 100);
      if (!Number.isInteger(dl * 10) || dl < 1) continue;
      return nq(ctx, `l = ${l} m, α = ${n(am)}${E5}, Δl = ${n(dl)} mm: ΔT = ?`, dT, "K", [dT * 10, dT / 10, rd(dl / am), dT + 273]);
    }
  }
  const l0 = pick([1, 2, 5, 10]), am = pick([1, 2]), t2 = pick([70, 120]), dT = t2 - 20, dl = rd(l0 * am * 1e-5 * dT);
  const f = (x) => `${n(rd(x))} m`;
  const q = L(ctx, `l = ${l0} m pri 20 °C, α = ${am}${E5}. Dolžina pri ${t2} °C?`, `l = ${l0} m at 20 °C, α = ${am}${E5}. Length at ${t2} °C?`);
  return out(q, f(l0 + dl), [f(l0 + l0 * am * 1e-5 * t2), f(dl), f(l0 + 10 * dl), f(l0 + dl / 10)]);
});

const THERMO = bank([
  [1, "Prvi zakon termodinamike je zakon o ohranitvi?|energije|mase|naboja|gibalne količine", "The first law of thermodynamics is conservation of?|energy|mass|charge|momentum"],
  [1, "Notranja energija idealnega plina je odvisna le od?|temperature|prostornine|tlaka|oblike posode", "Internal energy of an ideal gas depends only on?|temperature|volume|pressure|container shape"],
  [1, "Toplotni stroj z izkoristkom 100 %?|ni mogoč|je mogoč|je vsak motor|je hladilnik", "A heat engine with 100 % efficiency?|is impossible|is possible|is any engine|is a fridge"],
  [1, "Pri adiabatni spremembi plin toplote?|ne izmenja|prejme|odda|podvoji", "In an adiabatic process the gas?|exchanges no heat|absorbs heat|releases heat|doubles its heat"],
  [2, "Del prejete toplote toplotni stroj vedno odda?|hladnejšemu telesu|toplejšemu telesu|gorivu|nikomur", "A heat engine always gives part of its heat to?|a colder body|a hotter body|the fuel|nobody"],
  [2, "Hladilnik prenaša toploto od hladnega k toplemu, ker?|prejema delo|krši zakone|nima trenja|je vakuum", "A fridge moves heat from cold to warm because it?|uses work|breaks the laws|has no friction|is a vacuum"],
  [3, "Idealni stroj ima večji η, ko je hladni rezervoar?|hladnejši|toplejši|večji|manjši", "An ideal engine has a higher η when the cold side is?|colder|warmer|larger|smaller"],
  [3, "Pri izotermni razširitvi idealni plin vso prejeto toploto?|pretvori v delo|shrani kot Wₙ|odda nazaj|izgubi", "In an isothermal expansion an ideal gas turns all heat into?|work|internal energy|more heat|nothing"],
  [3, "T₁ in T₂ v η = 1 − T₂/T₁ vstavimo v?|kelvinih|stopinjah Celzija|joulih|vatih", "Temperatures in η = 1 − T₂/T₁ must be in?|kelvin|degrees Celsius|joules|watts"],
]);
def("f2_thermo", "fz_top", 11, "η", "Prvi zakon termodinamike, toplotni stroji", "First law; heat engines", (t, ctx) => {
  const n = ctx.num, dU = L(ctx, "ΔWₙ", "ΔU");
  if (t === 1) {
    if (Math.random() < 0.3) return THERMO(1, ctx);
    const k = R(0, 2), Q = R(2, 10) * 100, A = R(1, 9) * 100;
    if (k === 0 && A !== Q) return nq(ctx, L(ctx, `Plin prejme ${Q} J toplote in opravi ${A} J dela. ${dU} = ?`, `Gas absorbs ${Q} J of heat and does ${A} J of work. ${dU} = ?`), Q - A, "J", [Q + A, A - Q, Q, A], { neg: true });
    if (k === 1 && A !== Q) return nq(ctx, L(ctx, `Plin stisnemo z delom ${A} J, odda ${Q} J toplote. ${dU} = ?`, `${A} J of work done on gas; it gives off ${Q} J. ${dU} = ?`), A - Q, "J", [Q + A, Q - A, A, -A - Q], { neg: true });
    return nq(ctx, L(ctx, `Pri stalni prostornini plin prejme ${Q} J toplote. ${dU} = ?`, `At constant volume a gas absorbs ${Q} J of heat. ${dU} = ?`), Q, "J", ["0 J", -Q, 2 * Q, Q / 2], { neg: true });
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) {
      const A = R(1, 9) * 50;
      return nq(ctx, L(ctx, `Plin pri adiabatni razširitvi opravi ${A} J dela. ${dU} = ?`, `In an adiabatic expansion a gas does ${A} J of work. ${dU} = ?`), -A, "J", [A, "0 J", -2 * A, 2 * A], { neg: true });
    }
    if (k === 1) {
      const Q1 = pick([400, 500, 800, 1000, 2000]), p = pick([10, 20, 25, 30, 40, 50]), A = (Q1 * p) / 100;
      return nq(ctx, L(ctx, `Stroj prejme ${Q1} J toplote in opravi ${A} J dela. η = ?`, `An engine takes in ${Q1} J of heat, does ${A} J of work. η?`), p, "%", [100 - p, p / 100, rd((100 * A) / (Q1 - A)), 2 * p].filter((x) => x < 100));
    }
    if (k === 2) {
      const Q1 = pick([500, 800, 1000, 1200, 2000]), Q2 = Q1 * pick([0.5, 0.6, 0.7, 0.75, 0.8]);
      return nq(ctx, L(ctx, `Stroj prejme ${Q1} J, odda ${Q2} J toplote. Delo?`, `An engine takes in ${Q1} J of heat, gives off ${Q2} J. Work?`), Q1 - Q2, "J", [Q1 + Q2, Q1, Q2], {});
    }
    return THERMO(2, ctx);
  }
  if (Math.random() < 0.25) return THERMO(3, ctx);
  const [T1, T2] = pick([[600, 300], [500, 300], [400, 300], [800, 400], [1000, 300], [750, 300], [600, 450], [500, 400], [1200, 300], [900, 450], [1000, 400], [800, 600], [1000, 500], [550, 330], [700, 350], [1500, 300]]);
  const t1 = T1 - 273, t2 = T2 - 273, eta = Math.round(100 * (1 - T2 / T1));
  const P = (x) => `${n(Math.round(x))} %`;
  const q = L(ctx, `Idealni toplotni stroj med ${t1} °C in ${t2} °C. Največji η?`, `Ideal heat engine between ${t1} °C and ${t2} °C. Max η?`);
  return out(q, P(eta), [P(100 * (1 - t2 / t1)), P((100 * T2) / T1), P((100 * (T1 - T2)) / T2), P(100 - (t1 - t2) / 10)].filter((x) => !x.startsWith("−") && parseFloat(x) <= 100), [P(eta + 10), P(eta - 5), P(eta + 20)]);
});

// =====================================================================
// ELEKTROSTATIKA (2. letnik)
// =====================================================================
const COUL = bank([
  [1, "Coulombova sila pada z razdaljo kot?|1/r²|1/r|r²|1/r³", "Coulomb force falls with distance as?|1/r²|1/r|r²|1/r³"],
  [1, "Osnovni naboj e?|1,6·10⁻¹⁹ As|9,1·10⁻³¹ As|6,02·10²³ As|1 As", "Elementary charge e?|1.6·10⁻¹⁹ C|9.1·10⁻³¹ C|6.02·10²³ C|1 C"],
  [1, "Celoten naboj zaprtega sistema?|ostane enak|narašča|pada|je vedno 0", "Total charge of an isolated system?|stays constant|increases|decreases|is always 0"],
  [1, "Konstanta k v Coulombovem zakonu?|9·10⁹ Nm²/As²|6,67·10⁻¹¹ Nm²/kg²|9,81 m/s²|3·10⁸ m/s", "Constant k in Coulomb's law?|9·10⁹ Nm²/C²|6.67·10⁻¹¹ Nm²/kg²|9.81 m/s²|3·10⁸ m/s"],
  [1, "Naboja +2 µAs in −3 µAs se?|privlačita|odbijata|ne čutita|vrtita", "Charges +2 µC and −3 µC?|attract|repel|ignore each other|spin"],
]);
def("f2_coul", "fz_ele", 11, "q₁q₂", "Coulombov zakon", "Coulomb's law", (t, ctx) => {
  const n = ctx.num, U = L(ctx, "µAs", "µC");
  if (t === 1) return Math.random() < 0.65 ? lawQ(ctx, 1, "q", "Električna sila", "Electric force") : COUL(1, ctx);
  if (t === 2) {
    if (Math.random() < 0.2) return lawQ(ctx, 2, "q", "Električna sila", "Electric force");
    const r = pick([3, 6, 10, 15, 30]), q1 = R(1, 5), q2 = R(1, 5), F = rd((90 * q1 * q2) / (r * r));
    return nq(ctx, L(ctx, `q₁ = ${q1} µAs, q₂ = ${q2} µAs, r = ${r} cm, k = 9·10⁹ Nm²/As². F?`, `q₁ = ${q1} µC, q₂ = ${q2} µC, r = ${r} cm, k = 9·10⁹ Nm²/C². F?`), F, "N", [rd((0.9 * q1 * q2) / r), F * 10, F / 10, F * 100, rd(F / r)]);
  }
  if (Math.random() < 0.5) {
    const [m, e] = pick([[1.6, -18], [3.2, -17], [8, -19], [1.6, -16], [4.8, -18], [1.6, -15], [6.4, -18], [3.2, -18]]);
    const N = Math.round((m * 10 ** e) / 1.6e-19);
    const sci = `${n(m)}·10${sup(e)}`;
    const q = L(ctx, `Telo ima naboj +${sci} As. Koliko elektronov mu manjka?`, `A body has charge +${sci} C. Missing electrons?`);
    return nq(ctx, q, N, "", [N * 10, N / 10, N * 2, N / 2, N * 4, N * 100].filter(Number.isInteger));
  }
  const r = pick([3, 10, 30]), q0 = pick([1, 2, 3, 4, 5]), F = rd((90 * q0 * q0) / (r * r));
  return nq(ctx, L(ctx, `Naboja po ${q0} µAs, F = ${n(F)} N, k = 9·10⁹ Nm²/As². r?`, `Charges ${q0} µC each, F = ${n(F)} N, k = 9·10⁹ Nm²/C². r?`), r, "cm", [r * r, r / 10, r * 10, 2 * r]);
});

const EFIELD = bank([
  [1, "Silnice električnega polja kažejo?|od + proti −|od − proti +|v krogih|naključno", "Electric field lines point?|from + to −|from − to +|in circles|randomly"],
  [1, "Polje med ploščama nabitega kondenzatorja je?|homogeno|nič|krožno|radialno", "Field between charged capacitor plates is?|uniform|zero|circular|radial"],
  [1, "Enota jakosti električnega polja?|V/m|V·m|N·m|A/m", "Unit of electric field strength?|V/m|V·m|N·m|A/m"],
  [1, "Enota kapacitete?|F|V|As|Ω", "Unit of capacitance?|F|V|C|Ω"],
  [1, "Pozitiven naboj se v polju premakne?|v smeri silnic|proti silnicam|prečno na silnice|ne premakne se", "A free positive charge in a field moves?|along field lines|against field lines|across field lines|not at all"],
  [3, "Polje v notranjosti prevodnika (ravnovesje)?|je nič|je največje|kaže navzven|je enako zunanjemu", "Field inside a conductor (equilibrium)?|zero|maximal|points outward|same as outside"],
]);
def("f2_efield", "fz_ele", 11, "E", "Električno polje in kondenzator", "Electric field and capacitors", (t, ctx) => {
  const n = ctx.num, U = L(ctx, "µAs", "µC");
  if (t === 1) {
    if (Math.random() < 0.3) return EFIELD(1, ctx);
    if (Math.random() < 0.5) {
      const q = pick([1, 2, 4, 5]), F = q * pick([1, 2, 3, 4, 5, 10]), E = F / q;
      return nq(ctx, L(ctx, `Na naboj ${q} ${U} deluje sila ${F} mN. E = ?`, `A ${q} ${U} charge feels a force of ${F} mN. E = ?`), E, "kV/m", [F * q, rd(q / F), E * 1000, `${n(E)} V/m`]);
    }
    const Uv = pick([12, 50, 100, 200, 500, 1000]), d = pick([1, 2, 5, 10]), E = rd(Uv / d);
    return nq(ctx, L(ctx, `Plošči na razdalji ${d} mm, U = ${Uv} V. E = ?`, `Plates ${d} mm apart, U = ${Uv} V. E = ?`), E, "kV/m", [Uv * d, rd(E * 10), rd(E / 10), `${n(E)} V/m`]);
  }
  if (t === 2) {
    if (Math.random() < 0.6) {
      const Cf = pick([1, 2, 5, 10, 20, 50, 100]), Uv = pick([5, 6, 9, 12, 20, 50]), Q = Cf * Uv;
      if (Math.random() < 0.5) return nq(ctx, L(ctx, `C = ${Cf} µF, U = ${Uv} V. Naboj na kondenzatorju?`, `C = ${Cf} µF, U = ${Uv} V. Charge on the capacitor?`), Q, U, [rd(Cf / Uv), rd(Uv / Cf), Q * 1000, Q / 1000]);
      return nq(ctx, L(ctx, `Naboj ${Q} ${U} pri napetosti ${Uv} V. C = ?`, `Charge ${Q} ${U} at ${Uv} V. C = ?`), Cf, "µF", [Q * Uv, rd(Uv / Q), Cf * 1000, Cf / 10]);
    }
    const Uv = pick([10, 50, 100, 200, 500, 1000]);
    return nq(ctx, L(ctx, `Elektron preleti napetost ${Uv} V. Pridobljena energija?`, `An electron is accelerated through ${Uv} V. Energy gained?`), Uv, "eV", [Uv / 2, Uv * Uv, `${Uv} V`, Uv * 2]);
  }
  if (Math.random() < 0.5) {
    const Cf = pick([1, 2, 4, 10, 20, 100]), Uv = pick([10, 20, 50, 100, 200]), W = rd((Cf * Uv * Uv) / 2000);
    if (W < 0.01) return nq(ctx, L(ctx, `C = 10 µF, U = 100 V. Energija kondenzatorja?`, `C = 10 µF, U = 100 V. Energy stored?`), 50, "mJ", [100, 0.5, 5]);
    return nq(ctx, L(ctx, `C = ${Cf} µF, U = ${Uv} V. Energija kondenzatorja?`, `C = ${Cf} µF, U = ${Uv} V. Energy stored?`), W, "mJ", [2 * W, rd((Cf * Uv) / 2000), W * 1000, W / 1000]);
  }
  const [sl, en, a, ws] = pick([
    ["d → 2d", "d → 2d", "C/2", ["2C", "C/4", "C"]],
    ["d → d/2", "d → d/2", "2C", ["C/2", "4C", "C"]],
    ["S → 2S", "A → 2A", "2C", ["C/2", "4C", "C"]],
    ["S → 3S, d → 3d", "A → 3A, d → 3d", "C", ["9C", "C/9", "3C"]],
    ["dielektrik εᵣ = 4", "dielectric εᵣ = 4", "4C", ["C/4", "2C", "C"]],
    ["S → 2S, d → d/2", "A → 2A, d → d/2", "4C", ["C", "2C", "C/4"]],
  ]);
  if (Math.random() < 0.25) return out(L(ctx, `Kondenzator: napetost U → 2U. Naboj Q → ?`, `Capacitor: U → 2U. Charge Q → ?`), "2Q", ["Q", "4Q", "Q/2"]);
  return out(L(ctx, `Ploščati kondenzator: ${sl}. Kapaciteta C → ?`, `Plate capacitor: ${en}. Capacitance C → ?`), a, ws);
});

// =====================================================================
// NIHANJE, ZVOK, VALOVNA OPTIKA (3. letnik)
// =====================================================================
const OSC = bank([
  [1, "Kje ima nihalo največjo hitrost?|v ravnovesni legi|v skrajni legi|povsod enako|nikjer", "Where is a pendulum fastest?|at equilibrium|at the extreme|everywhere equal|nowhere"],
  [1, "Kje ima nihalo največji pospešek?|v skrajni legi|v ravnovesni legi|povsod enak|nikjer", "Where is a pendulum's acceleration largest?|at the extreme|at equilibrium|everywhere equal|nowhere"],
  [1, "Največji odmik od ravnovesne lege?|amplituda|nihajni čas|frekvenca|valovna dolžina", "Largest displacement from equilibrium?|amplitude|period|frequency|wavelength"],
  [1, "Čas enega nihaja?|nihajni čas|frekvenca|amplituda|faza", "Time of one oscillation?|period|frequency|amplitude|phase"],
  [1, "Število nihajev v eni sekundi?|frekvenca|nihajni čas|amplituda|odmik", "Number of oscillations per second?|frequency|period|amplitude|displacement"],
  [1, "Kinetična energija nihala v skrajni legi?|0|največja|polovica celotne|negativna", "Kinetic energy of a pendulum at the extreme?|zero|maximal|half the total|negative"],
]);
def("f2_osc", "fz_val", 12, "∿", "Nihanje", "Oscillations", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    if (Math.random() < 0.4) return OSC(1, ctx);
    const T = pick([0.2, 0.25, 0.5, 1, 2, 4]), N = pick([10, 20, 50].filter((x) => nice(x * T))), tt = rd(N * T);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Nihalo naredi ${N} nihajev v ${n(tt)} s. Nihajni čas?`, `A pendulum makes ${N} oscillations in ${n(tt)} s. Period?`), T, "s", [N / tt, tt, N * tt]);
    return nq(ctx, L(ctx, `Nihalo naredi ${N} nihajev v ${n(tt)} s. Frekvenca?`, `A pendulum makes ${N} oscillations in ${n(tt)} s. Frequency?`), rd(N / tt), "Hz", [T, tt, N * tt]);
  }
  if (t === 2) {
    const [sl, en, a, ws] = pick([
      ["Matematično nihalo: l → 4l", "Simple pendulum: l → 4l", "2T", ["4T", "T/2", "T"]],
      ["Matematično nihalo: l → l/4", "Simple pendulum: l → l/4", "T/2", ["T/4", "2T", "T"]],
      ["Matematično nihalo: l → 2l", "Simple pendulum: l → 2l", "√2·T", ["2T", "4T", "T/2"]],
      ["Matematično nihalo: m → 2m", "Simple pendulum: m → 2m", "T", ["2T", "√2·T", "T/2"]],
      ["Vzmetno nihalo: m → 4m", "Mass on a spring: m → 4m", "2T", ["4T", "T/2", "T"]],
      ["Vzmetno nihalo: k → 4k", "Mass on a spring: k → 4k", "T/2", ["2T", "T/4", "T"]],
      ["Majhna amplituda: A → 2A", "Small amplitude: A → 2A", "T", ["2T", "√2·T", "T/2"]],
      ["Matematično nihalo na Luni (g/6)", "Simple pendulum on the Moon (g/6)", "√6·T", ["6T", "T/6", "T"]],
      ["Vzmetno nihalo na Luni (g/6)", "Mass on a spring on the Moon (g/6)", "T", ["√6·T", "6T", "T/6"]],
      ["Vzmetno nihalo: k → k/4", "Mass on a spring: k → k/4", "2T", ["T/2", "4T", "T"]],
      ["Vzmetno nihalo: m → m/4", "Mass on a spring: m → m/4", "T/2", ["2T", "T/4", "T"]],
      ["Matematično nihalo: l → 9l", "Simple pendulum: l → 9l", "3T", ["9T", "T/3", "81T"]],
      ["Vzmetno nihalo: m → 9m", "Mass on a spring: m → 9m", "3T", ["9T", "T/3", "T"]],
      ["Matematično nihalo: g → 4g", "Simple pendulum: g → 4g", "T/2", ["2T", "T/4", "T"]],
      ["Vzmetno nihalo: g → 4g", "Mass on a spring: g → 4g", "T", ["T/2", "2T", "T/4"]],
    ]);
    return out(L(ctx, `${sl}. Nihajni čas T → ?`, `${en}. Period T → ?`), a, ws);
  }
  const k = R(0, 2);
  if (k === 0) {
    const [m, kk] = pick([[0.1, 10], [0.4, 10], [1, 100], [0.5, 50], [1, 25], [2, 50], [1, 4], [2, 8], [0.2, 20], [0.5, 2]]);
    const r = m / kk, T = 2 * Math.PI * Math.sqrt(r);
    const f = (x) => `${fx(ctx, x, 2)} s`;
    return out(L(ctx, `Vzmetno nihalo: m = ${n(m)} kg, k = ${kk} N/m. T = ?`, `Mass on a spring: m = ${n(m)} kg, k = ${kk} N/m. T = ?`), f(T), [f(Math.sqrt(r)), f(2 * Math.PI * r), f(2 * Math.PI * Math.sqrt(1 / r)), f(Math.PI * Math.sqrt(r))]);
  }
  if (k === 1) {
    const l = pick([0.25, 1, 4, 9]), T = 2 * Math.PI * Math.sqrt(l / 9.81);
    const f = (x) => `${fx(ctx, x, 1)} s`;
    return out(L(ctx, `Matematično nihalo l = ${n(l)} m. T = ? (g = 9,81 m/s²)`, `Simple pendulum l = ${n(l)} m. T = ? (g = 9.81 m/s²)`), f(T), [f((2 * Math.PI * l) / 9.81), f(Math.sqrt(l / 9.81)), f(2 * Math.PI * Math.sqrt(9.81 / l)), f(Math.PI * Math.sqrt(l / 9.81))]);
  }
  const kk = pick([50, 100, 200, 400, 800]), A = pick([5, 10, 20]), W = rd((kk * (A / 100) ** 2) / 2);
  return nq(ctx, L(ctx, `Vzmetno nihalo: k = ${kk} N/m, amplituda ${A} cm. Energija?`, `Mass on a spring: k = ${kk} N/m, amplitude ${A} cm. Energy?`), W, "J", [2 * W, rd((kk * A) / 200), (kk * A * A) / 2, W / 2]);
});

const SOUND = bank([
  [1, "Zvok se ne širi skozi?|vakuum|zrak|vodo|jeklo", "Sound cannot travel through?|a vacuum|air|water|steel"],
  [1, "Hitrost zvoka v zraku je približno?|340 m/s|300 000 km/s|34 m/s|3400 m/s", "Speed of sound in air is about?|340 m/s|300 000 km/s|34 m/s|3400 m/s"],
  [1, "Zvok v zraku je valovanje, ki je?|longitudinalno|transverzalno|elektromagnetno|svetlobno", "Sound in air is a wave that is?|longitudinal|transverse|electromagnetic|light"],
  [1, "Slišno območje človeka?|20 Hz–20 kHz|2 Hz–2 kHz|200 Hz–200 kHz|20 kHz–20 MHz", "Human hearing range?|20 Hz–20 kHz|2 Hz–2 kHz|200 Hz–200 kHz|20 kHz–20 MHz"],
  [1, "Zvok s frekvenco nad 20 kHz?|ultrazvok|infrazvok|šum|odmev", "Sound above 20 kHz?|ultrasound|infrasound|noise|echo"],
  [1, "Zvok s frekvenco pod 20 Hz?|infrazvok|ultrazvok|ton|odmev", "Sound below 20 Hz?|infrasound|ultrasound|a tone|an echo"],
  [1, "Višino tona določa?|frekvenca|amplituda|hitrost zvoka|smer širjenja", "Pitch is determined by?|frequency|amplitude|speed of sound|direction"],
  [1, "Glasnejši zvok (ista frekvenca) ima večjo?|amplitudo|frekvenco|hitrost|valovno dolžino", "A louder sound (same pitch) has a larger?|amplitude|frequency|speed|wavelength"],
  [1, "Enota jakostne ravni zvoka?|dB|Hz|W|Pa", "Unit of sound intensity level?|dB|Hz|W|Pa"],
  [1, "Odmev je?|odbit zvok|lomljen zvok|ultrazvok|tišina", "An echo is?|reflected sound|refracted sound|ultrasound|silence"],
  [1, "Netopirji za orientacijo uporabljajo?|ultrazvok|infrazvok|svetlobo|magnetizem", "Bats navigate using?|ultrasound|infrasound|light|magnetism"],
  [1, "Zvok v vodi je v primerjavi z zrakom?|hitrejši|počasnejši|enako hiter|ga ni", "Sound in water compared with air is?|faster|slower|equally fast|absent"],
  [1, "Jakostna raven na pragu bolečine?|približno 120 dB|0 dB|20 dB|60 dB", "Intensity level at the threshold of pain?|about 120 dB|0 dB|20 dB|60 dB"],
]);
def("f2_sound", "fz_val", 12, "dB", "Zvok in Dopplerjev pojav", "Sound and the Doppler effect", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) return SOUND(1, ctx);
  if (t === 2) {
    if (Math.random() < 0.2) return SOUND(1, ctx);
    const k = R(0, 3);
    if (k === 0) {
      const [f, a, ws] = pick([[10, "+10 dB", ["+1 dB", "+100 dB", "+3 dB"]], [100, "+20 dB", ["+100 dB", "+2 dB", "+10 dB"]], [1000, "+30 dB", ["+1000 dB", "+3 dB", "+300 dB"]], [2, "+3 dB", ["+2 dB", "+20 dB", "+6 dB"]]]);
      return out(L(ctx, `Jakost zvoka se poveča ${f}-krat. Raven se poveča za?`, `Sound intensity ×${f}. Level changes by?`), a, ws);
    }
    if (k === 1) {
      const Lv = pick([40, 50, 60, 70, 80]), [N, d] = pick([[2, 3], [10, 10], [100, 20]]);
      const q = N === 2 ? L(ctx, `Dva enaka vira, vsak ${Lv} dB. Skupna raven?`, `Two equal sources, ${Lv} dB each. Total level?`) : L(ctx, `${N} enakih virov, vsak ${Lv} dB. Skupna raven?`, `${N} equal sources, ${Lv} dB each. Total level?`);
      return out(q, `${Lv + d} dB`, [`${N * Lv} dB`, `${Lv} dB`, `${Lv + 2 * d} dB`, `${Lv + N} dB`].filter((x) => x !== `${Lv + d} dB`));
    }
    if (k === 2) {
      const [r, a, ws] = pick([[2, "−6 dB", ["−3 dB", "−2 dB", "−12 dB"]], [10, "−20 dB", ["−10 dB", "−100 dB", "−40 dB"]], [4, "−12 dB", ["−6 dB", "−4 dB", "−16 dB"]]]);
      return out(L(ctx, `Razdalja do točkastega vira ×${r}. Raven se spremeni za?`, `Distance from a point source ×${r}. Level changes by?`), a, ws);
    }
    const L1 = pick([20, 30, 40, 50]), dL = pick([10, 20, 30, 40]);
    return out(L(ctx, `Raven ${L1} dB → ${L1 + dL} dB. Kolikokrat večja jakost?`, `Level ${L1} dB → ${L1 + dL} dB. Intensity × ?`), `${10 ** (dL / 10)}×`, [`${dL}×`, `${dL / 10}×`, `${n(rd((L1 + dL) / L1))}×`, `${2 * dL}×`]);
  }
  // Doppler: c = 340 m/s
  const c = 340;
  const [mode, v, fs] = pick([
    [0, 20, [320, 480, 640, 800, 960]], [0, 40, [300, 600, 900]], [0, 68, [400, 480, 800]], [0, 85, [300, 600, 900]],
    [1, 20, [360, 720, 900]], [1, 60, [400, 800, 1000]], [1, 85, [500, 1000]],
    [2, 34, [500, 600, 1000]], [2, 17, [400, 600, 1000]],
    [3, 34, [500, 1000]], [3, 68, [500, 1000]],
  ]);
  const f = pick(fs);
  const form = [f * c / (c - v), f * c / (c + v), f * (c + v) / c, f * (c - v) / c];
  const a = Math.round(form[mode]);
  const Hz = (x) => `${n(Math.round(x))} Hz`;
  const s = v === 20 || v === 68 ? "z" : "s"; // z dvajsetimi, z oseminšestdesetimi; s štiridesetimi …
  const qs = [
    L(ctx, `Vir ${f} Hz se nam bliža ${s} ${v} m/s (c = 340 m/s). ν' = ?`, `A ${f} Hz source approaches at ${v} m/s (c = 340 m/s). f' = ?`),
    L(ctx, `Vir ${f} Hz se oddaljuje ${s} ${v} m/s (c = 340 m/s). ν' = ?`, `A ${f} Hz source recedes at ${v} m/s (c = 340 m/s). f' = ?`),
    L(ctx, `Bližamo se viru ${f} Hz ${s} ${v} m/s (c = 340 m/s). ν' = ?`, `Listener nears a ${f} Hz source at ${v} m/s, c = 340 m/s. f'?`),
    L(ctx, `Oddaljujemo se od vira ${f} Hz ${s} ${v} m/s, c = 340 m/s. ν'?`, `Listener leaves a ${f} Hz source at ${v} m/s, c = 340 m/s. f'?`),
  ];
  const far = (x) => Math.abs(Math.round(x) - a) > 0.02 * a; // ne 420 Hz proti 421 Hz
  return out(qs[mode], Hz(a), [...form, f].filter(far).map(Hz), [a + 2 * (a - f), 2 * f - a, a * 1.1, a * 0.9].filter(far).map(Hz));
});

const WOPT = bank([
  [1, "Ojačitev: razlika poti je?|Nλ|(N + ½)λ|λ/4|2λ/3", "Constructive interference: path difference?|Nλ|(N + ½)λ|λ/4|2λ/3"],
  [1, "Oslabitev: razlika poti je?|(N + ½)λ|Nλ|2Nλ|λ/3", "Destructive interference: path difference?|(N + ½)λ|Nλ|2Nλ|λ/3"],
  [1, "Uklon je izrazit, ko je reža?|primerljiva z λ|mnogo večja od λ|nič|neskončna", "Diffraction is strong when the slit width is?|comparable to λ|much larger than λ|zero|infinite"],
  [1, "Polarizirati je mogoče le valovanje, ki je?|transverzalno|longitudinalno|zvočno|v plinu", "Which waves can be polarized?|transverse|longitudinal|sound waves|waves in a gas"],
  [1, "Zvoka v zraku ni mogoče polarizirati, ker je?|longitudinalen|prepočasen|transverzalen|preglasen", "Sound in air can't be polarized because it is?|longitudinal|too slow|transverse|too loud"],
  [1, "Barve na milnem mehurčku so posledica?|interference|polarizacije|uklona na reži|absorpcije", "Colours on a soap bubble come from?|interference|polarization|slit diffraction|absorption"],
  [1, "Polarizacijska sončna očala zmanjšajo?|bleščanje|ostrino|barve|hitrost svetlobe", "Polarizing sunglasses reduce?|glare|sharpness|colours|light speed"],
  [1, "Valovanje zaide za oviro. Pojav?|uklon|lom|odboj|polarizacija", "A wave bends around an obstacle. This is?|diffraction|refraction|reflection|polarization"],
  [1, "Poskus z dvema režama dokazuje, da je svetloba?|valovanje|curek kroglic|zvok|snov", "The double-slit experiment shows light is?|a wave|a stream of balls|sound|matter"],
  [1, "Za dvema režama na zaslonu vidimo?|izmenične proge|eno svetlo piko|dve piki|popolno temo", "Behind a double slit the screen shows?|bright/dark fringes|one bright dot|two dots|total darkness"],
  [1, "Svetloba po prehodu skozi polarizator je?|polarizirana|nepolarizirana|bela|ultravijolična", "Light after a polarizer is?|polarized|unpolarized|white|ultraviolet"],
  [1, "Valovanji v fazi se seštejeta v?|ojačitev|oslabitev|polarizacijo|uklon", "Two waves in phase give?|reinforcement|cancellation|polarization|diffraction"],
]);
const MALUS = [[0, "I₀"], [30, "3I₀/4"], [45, "I₀/2"], [60, "I₀/4"], [90, "0"]];
def("f2_wopt", "fz_val", 12, "λ", "Uklon, interferenca, polarizacija", "Diffraction, interference, polarization", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) return WOPT(1, ctx);
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) {
      if (Math.random() < 0.25) return out(L(ctx, `Nepolarizirana svetloba I₀ skozi polarizator. I = ?`, `Unpolarized light I₀ through a polarizer. I = ?`), "I₀/2", ["I₀", "I₀/4", "0"]);
      const [phi, a] = pick(MALUS);
      return out(L(ctx, `Polarizirana svetloba I₀, polarizator zasukan za ${phi}°. I = ?`, `Polarized light I₀, polarizer turned by ${phi}°. I = ?`), a, MALUS.filter((x) => x[1] !== a).map((x) => x[1]));
    }
    if (k === 1) {
      const la = pick([400, 500, 600]), m = R(1, 6), ds = (m * la) / 2;
      const opts = L(ctx, "ojačitev|oslabitev|ni interference|popolni odboj", "constructive|destructive|no interference|total reflection").split("|");
      return out(L(ctx, `λ = ${la} nm, razlika poti ${ds} nm. Interferenca?`, `λ = ${la} nm, path difference ${ds} nm. Interference?`), opts[m % 2], opts.filter((_, i) => i !== m % 2));
    }
    if (k === 2) {
      const N = pick([100, 200, 250, 500, 1000]), d = 1000 / N;
      return nq(ctx, L(ctx, `Uklonska mrežica: ${N} rež na mm. Razmik med režami?`, `Grating with ${N} lines per mm. Line spacing?`), d, "µm", [N / 1000, N, d * 10, d / 10, d * 1000]);
    }
    const la = pick([400, 500, 600]), N = R(1, 5);
    return out(L(ctx, `λ = ${la} nm, razlika poti ${N * la} nm. Red ojačitve N?`, `λ = ${la} nm, path difference ${N * la} nm. Order N?`), String(N), [2 * N, N + 1, N + 2, N - 1, 2 * N + 1, N + 3].filter((x) => x >= 0 && x !== N).map(String));
  }
  const k = R(0, 2);
  if (k === 0) {
    const [d, N] = pick([[1, 1], [1.2, 1], [0.8, 1], [1.4, 1], [2, 2], [2.4, 2], [1.6, 2], [3, 3], [3.6, 3]]), la = rd((d * 1000 * 0.5) / N);
    return nq(ctx, L(ctx, `Mrežica d = ${n(d)} µm, ${N}. red ojačitve pri 30°. λ = ?`, `Grating d = ${n(d)} µm, order ${N} at 30°. λ = ?`), la, "nm", [rd(d * 500), d * 1000, rd(la * 2), rd((d * 1000) / N)]);
  }
  if (k === 1) {
    for (;;) {
      const la = pick([400, 500, 600]), Ls = pick([1, 2]), d = pick([0.2, 0.4, 0.5, 1]), dx = rd((la * Ls) / d / 1000);
      if (!Number.isInteger(dx * 10)) continue;
      return nq(ctx, L(ctx, `Reži d = ${n(d)} mm, zaslon ${Ls} m, λ = ${la} nm. Razmik prog?`, `Slits d = ${n(d)} mm, screen ${Ls} m, λ = ${la} nm. Fringe spacing?`), dx, "mm", [dx * 10, dx / 10, rd((la * d) / Ls / 1000), dx * 2]);
    }
  }
  for (;;) {
    const d = pick([1, 1.5, 2, 3]), la = pick([400, 500, 600, 700]), r = (d * 1000) / la;
    if (Number.isInteger(r)) continue;
    const Nm = Math.floor(r);
    return out(L(ctx, `Mrežica d = ${n(d)} µm, λ = ${la} nm. Najvišji red ojačitve?`, `Grating d = ${n(d)} µm, λ = ${la} nm. Highest order?`), String(Nm), [Nm + 1, 2 * Nm, Nm - 1, Nm + 2, Nm + 3].filter((x) => x >= 0 && x !== Nm).map(String));
  }
});

const LEVELS = bank([
  [1, "Elektron preide na nižji nivo. Atom?|izseva foton|absorbira foton|se ionizira|izgubi proton", "An electron drops to a lower level. The atom?|emits a photon|absorbs a photon|is ionized|loses a proton"],
  [1, "Za prehod na višji nivo mora atom?|absorbirati foton|izsevati foton|izgubiti nevtron|se ohladiti", "To jump to a higher level the atom must?|absorb a photon|emit a photon|lose a neutron|cool down"],
  [1, "Spekter razredčenega vročega plina je?|črtast|zvezen|bel|enobarven", "Spectrum of a hot, thin gas?|line spectrum|continuous|white|single colour"],
  [1, "Spekter žareče nitke v žarnici je?|zvezen|črtast|samo rdeč|prazen", "Spectrum of a glowing filament?|continuous|line spectrum|only red|empty"],
  [1, "Stanje atoma z najnižjo energijo?|osnovno stanje|vzbujeno stanje|ionizirano stanje|nestabilno stanje", "Lowest-energy state of an atom?|ground state|excited state|ionized state|unstable state"],
  [1, "Energija elektrona v vodiku pri n = 1?|−13,6 eV|13,6 eV|−3,4 eV|0 eV", "Electron energy in hydrogen at n = 1?|−13.6 eV|13.6 eV|−3.4 eV|0 eV"],
  [1, "Temne črte v spektru Sonca so?|absorpcijske črte|emisijske črte|sence planetov|napake merjenja", "Dark lines in the Sun's spectrum are?|absorption lines|emission lines|planet shadows|errors"],
  [1, "Vsak element ima?|svoj črtasti spekter|enak spekter|zvezen spekter|eno samo črto", "Each element has?|a unique spectrum|the same spectrum|a continuous one|a single line"],
  [1, "Energijski nivoji v atomu so?|diskretni|zvezni|vsi enaki|naključni", "Energy levels in an atom are?|discrete|continuous|all equal|random"],
]);
// vodik: E_n = −13,6 eV / n²; prehodi z lepo energijo
const HTR = [[4, 2], [2, 1], [4, 1], [3, 2], [3, 1]];
def("f2_levels", "fz_val", 13, "Eₙ", "Energijski nivoji in spektri", "Energy levels and spectra", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    if (Math.random() < 0.5) return LEVELS(1, ctx);
    for (;;) {
      const Eh = -pick([1, 1.5, 2, 2.5, 3, 4]), El = -pick([5, 6, 8, 10, 13.6, 7.5]), dE = rd(Eh - El);
      if (dE <= 0) continue;
      return nq(ctx, L(ctx, `Elektron preide z nivoja ${n(Eh)} eV na ${n(El)} eV. E fotona?`, `Electron goes from ${n(Eh)} eV to ${n(El)} eV. Photon E?`), dE, "eV", [rd(-Eh - El), -Eh, -El, dE * 2]);
    }
  }
  if (t === 2) {
    if (Math.random() < 0.4) {
      const k = pick([2, 4]), E = rd(-13.6 / (k * k));
      if (Math.random() < 0.5) return nq(ctx, L(ctx, `Vodik (E₁ = −13,6 eV): energija nivoja n = ${k}?`, `Hydrogen (E₁ = −13.6 eV): energy of level n = ${k}?`), E, "eV", [rd(-13.6 / k), rd(-13.6 * k * k), -E, rd(-13.6 + 13.6 / (k * k))], { neg: true });
      return nq(ctx, L(ctx, `Vodik (E₁ = −13,6 eV): ionizacijska energija iz n = ${k}?`, `Hydrogen (E₁ = −13.6 eV): ionization energy from n = ${k}?`), -E, "eV", [13.6, rd(13.6 / k), rd(13.6 + E), rd(13.6 * k)]);
    }
    for (;;) {
      const Eh = -pick([0.5, 1, 1.5, 2]), dE = pick([1.24, 2, 2.48, 3.1, 4, 6.2, 1.55]), El = rd(Eh - dE), la = Math.round(1240 / dE);
      const f = (x) => `${n(Math.round(x))} nm`;
      const q = L(ctx, `Prehod z ${n(Eh)} eV na ${n(El)} eV. λ fotona? (hc = 1240 eV·nm)`, `Transition ${n(Eh)} eV → ${n(El)} eV. Photon λ? (hc = 1240 eV·nm)`);
      return out(q, f(la), [f(1240 / -Eh), f(1240 / -El), f(1240 * dE), f(1240 / (rd(-Eh - El)))].filter((x) => x !== f(la)), [f(la * 2), f(la / 2)]);
    }
  }
  if (Math.random() < 0.15) {
    const [E, k] = pick([[10.2, 2], [12.75, 4]]);
    return out(L(ctx, `Vodik v osnovnem stanju absorbira foton ${n(E)} eV. Nov nivo?`, `Ground-state hydrogen absorbs a ${n(E)} eV photon. New level?`), `n = ${k}`, [`n = ${k + 1}`, `n = ${k - 1 || 3}`, `n = ${k + 2}`, "ionizacija|ionized".split("|")[ctx.lang === "sl" ? 0 : 1]]);
  }
  if (Math.random() < 0.4) {
    const k = pick([3, 4, 5, 6, 7]);
    return nq(ctx, L(ctx, `Atomi vodika vzbujeni na n = ${k}. Največ spektralnih črt?`, `Hydrogen atoms excited to n = ${k}. Max number of lines?`), (k * (k - 1)) / 2, "", [k - 1, k, k * k, (k * (k + 1)) / 2]);
  }
  const [a, b] = pick(HTR), E = 13.6 * (1 / (b * b) - 1 / (a * a)), la = 1240 / E;
  const f = (x) => `${n(Math.round(x))} nm`;
  const q = L(ctx, `Vodik, prehod ${a} → ${b}: λ = ? (hc = 1240 eV·nm)`, `Hydrogen, transition ${a} → ${b}: λ = ? (hc = 1240 eV·nm)`);
  return out(q, f(la), [f(1240 / (13.6 / (a * a))), f(1240 / (13.6 / (b * b))), f(1240 / (13.6 * (1 / b - 1 / a))), f(1240 / (13.6 * (1 / (b * b) + 1 / (a * a))))].filter((x) => x !== f(la)), [f(la * 2)]);
});

export const CONCEPTS = C;
