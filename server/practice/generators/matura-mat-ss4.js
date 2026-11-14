// Generatorji za teme 4. letnika gimnazije, ki so prišle z maturitetno potjo (MAT-SS-4).
// Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi iz istih (zaokroženih)
// števil, ki jih vidi dijak. Izvirne naloge, ne prepisane maturitetne.
import { g, nOf } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const P = "mat-ss4-matura-";
const T = (s) => `MAT-SS-4/${s}`;

// ---------- pomožne funkcije ----------
const eur = (value, mistakes = []) => ({ ...num(value, 2, mistakes, "€"), unitAlternatives: ["eur", "evrov", "evra"] });
// Negativen izraz v oklepaju: pt("-3") → "(-3)".
const pt = (s) => (String(s).startsWith("-") ? `(${s})` : `${s}`);
function poly(cs, v = "x") {
  const n = cs.length - 1;
  let s = "";
  cs.forEach((c, i) => {
    const e = n - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const coef = abs === 1 && e > 0 ? "" : tx(abs);
    const pw = e === 0 ? "" : e === 1 ? v : `${v}^${e}`;
    if (s === "") s = (c < 0 ? "-" : "") + coef + pw;
    else s += (c < 0 ? " - " : " + ") + coef + pw;
  });
  return s || "0";
}
const tm = (c, v, first = false) => `${c < 0 ? (first ? "-" : "- ") : first ? "" : "+ "}${Math.abs(c) === 1 ? "" : tx(Math.abs(c))}${v}`;
const le = (a, b, v = "x") => (a === 0 ? `${b}` : `${tm(a, v, true)}${b ? ` ${sg(b)}` : ""}`);
const ev = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
const der = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
function mul(p, q) {
  const out = Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}
// x - a brez oklepaja (za imenovalec) in z oklepajem (za produkt).
const xm = (a) => (a === 0 ? "x" : `x ${sg(-a)}`);
const lin = (a) => (a === 0 ? "x" : `(x ${sg(-a)})`);
const xp = (k) => (k === 1 ? "x" : `x^{${k}}`);
const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < 1e-9 ? "=" : "\\approx");
// Vmesni rezultat, zaokrožen na d decimalk, brez končnih ničel: 0,2401 namesto 0,240100.
const txr = (x, d) => tx(roundHalfUp(x, d));
const iv = (a, b) => (Number.isInteger(a) && Number.isInteger(b) ? `[${tx(a)}, ${tx(b)}]` : `[${tx(a)}; ${tx(b)}]`);
// Izbirni odgovor z razlago vsake napačne možnosti: wrongs = [[možnost, "zakaj"], ...].
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
const V = (n, k) => Math.round(fact(n) / fact(n - k));
// Število z besedo, število v $…$: nw(3, "leto", "leti", "leta", "let") → "$3$ leta".
function nw(n, a, b, c, d) {
  const s = nOf(n, a, b, c, d);
  const i = s.indexOf(" ");
  return `$${s.slice(0, i)}$${s.slice(i)}`;
}
const yrs = (n) => nw(n, "leto", "leti", "leta", "let");
const E = "\\ \\text{€}";
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
function pearson(xs, ys) {
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  xs.forEach((x, i) => {
    sxy += (x - mx) * (ys[i] - my);
    sxx += (x - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  });
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

// ---------- anuitete ----------
const PS = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const rOf = (p) => 1 + p / 100;
const annuity = (G0, q, n) => (G0 * q ** n * (q - 1)) / (q ** n - 1);
const r2 = (x) => roundHalfUp(x, 2);
const LOANS = ["za nov avto", "za opremo frizerskega salona", "za sončno elektrarno na strehi", "za prenovo kopalnice", "za nov traktor", "za študij v tujini", "za toplotno črpalko"];

// ---------- bisekcija ----------
// k korakov bisekcije; wrong = vsakič obdrži napačno polovico (tipična napaka).
function bis(f, a, b, k, wrong = false) {
  const st = [];
  let fa = f(a);
  for (let i = 0; i < k; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    const left = fa * fc < 0;
    const na = left !== wrong ? a : c;
    const nb = left !== wrong ? c : b;
    st.push({ a, b, c, fc, na, nb });
    if (na === c) fa = fc;
    a = na;
    b = nb;
  }
  return st;
}
const fdec = (v) => (Math.abs(v) >= 0.01 ? 3 : 5);
function bisLines(f, a, b, st, k) {
  const fv = (v) => `${ap(v, 3)} ${Number.isInteger(v) ? tx(v) : tx(v, 3)}`;
  const lines = [`$f(${tx(a)}) ${fv(f(a))}$ in $f(${tx(b)}) ${fv(f(b))}$ imata različna predznaka.`];
  st.forEach((s, i) => {
    const d = fdec(s.fc);
    if (i < k - 1) lines.push(`$c_${i + 1} = ${tx(s.c)}$, $f(${tx(s.c)}) ${ap(s.fc, d)} ${tx(s.fc, d)}$ ${s.fc > 0 ? "$> 0$" : "$< 0$"}, nov interval $${iv(s.na, s.nb)}$`);
    else lines.push(`$c_${i + 1} = \\dfrac{${tx(s.a)} + ${tx(s.b)}}{2} = ${tx(s.c)}$`);
  });
  return lines.join("\n");
}

// ---------- verjetnost ----------
const Pn = (n, k, p) => C(n, k) * p ** k * (1 - p) ** (n - k);
const BER = [
  { intro: (p) => `Semensko zrno vzkali z verjetnostjo $${p}$.`, act: (n) => `Posadimo ${nw(n, "zrno", "zrni", "zrna", "zrn")}, ki kalijo neodvisno.`, what: "vzkaljenih zrn", ps: [0.6, 0.7, 0.75, 0.8, 0.9] },
  { intro: (p, nm) => `${nm} zadene prosti met z verjetnostjo $${p}$.`, act: (n, nm) => `Na treningu ${g(nm, "bo vrgel", "bo vrgla")} ${nw(n, "prosti met", "prosta meta", "proste mete", "prostih metov")}.`, what: "zadetih prostih metov", ps: [0.4, 0.6, 0.7, 0.75, 0.8] },
  { intro: (p) => `Izdelek s tekočega traku je pokvarjen z verjetnostjo $${p}$.`, act: (n) => `Kontrolorka naključno vzame ${nw(n, "izdelek", "izdelka", "izdelke", "izdelkov")}.`, what: "pokvarjenih izdelkov", ps: [0.1, 0.2, 0.25, 0.3] },
  { intro: (p) => `Jutranji vlak zamudi z verjetnostjo $${p}$, neodvisno od drugih dni.`, act: (n, nm) => `${nm} se z njim pelje ${nw(n, "dan", "dneva", "dni", "dni")}.`, what: "dni z zamudo", ps: [0.1, 0.2, 0.25, 0.3, 0.4] },
  { intro: (p) => `Lokostrelec zadene rumeni krog z verjetnostjo $${p}$.`, act: (n) => `Ustreli ${nw(n, "puščico", "puščici", "puščice", "puščic")}.`, what: "zadetkov v rumeni krog", ps: [0.2, 0.25, 0.3, 0.4, 0.6, 0.7] },
];

const GENS = [
  // ================= anuitete =================
  {
    id: P + "anuitete",
    topics: [T("anuitete-in-amortizacijski-nacrt")],
    gen(level, r) {
      const nm = name(r);
      const p = r.pick(PS);
      const q = rOf(p);
      const pT = `${tx(p)}\\ \\%`;
      const rLine = `$r = 1 + \\dfrac{${tx(p)}}{100} = ${tx(q)}$`;
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const G0 = r.int(6, 60) * 500;
          const n = r.int(3, 10);
          const qn = q ** n;
          const a = annuity(G0, q, n);
          return {
            text: `${nm} najame posojilo ${r.pick(LOANS)} v višini $${G0}$ € pri letni obrestni meri $${pT}$. Vrne ga v $${n}$ enakih letnih obrokih (anuitetah), ki jih plača ob koncu vsakega leta. Kolikšna je anuiteta? Zaokroži na cent.`,
            answer: eur(a, [
              { value: G0 / n, why: "Si posojilo le razdelil na enake dele? Dolg se vsako leto obrestuje, zato je obrok večji." },
              { value: (G0 * qn) / n, why: "Si končno vrednost posojila delil s številom obrokov? Prej plačani obroki se obrestujejo dlje, zato jih ne smeš kar sešteti." },
              { value: (G0 * (1 + (n * p) / 100)) / n, why: "Si obresti računal vsako leto od celega posojila? Obrestuje se le ostanek dolga, in to obrestno obrestno." },
            ]),
            hint: "Posojilo in vse anuitete preračunaj na konec zadnjega leta in vrednosti izenači.",
            data: { given: [`G_0 = ${G0}${E}`, `p = ${pT}`, `n = ${n}`], find: ["a"] },
            formula: ["r = 1 + \\dfrac{p}{100}", "a = G_0 \\cdot \\dfrac{r^n (r - 1)}{r^n - 1}"],
            solution: `${rLine}\n$r^{${n}} ${ap(qn, 6)} ${tx(qn, 6)}$\n$a = ${G0} \\cdot \\dfrac{${tx(qn, 6)} \\cdot ${tx(q - 1)}}{${tx(qn - 1, 6)}}$\n$a \\approx ${tx(a, 2)}$ €`,
          };
        }
        if (t === 1) {
          const G0 = r.int(6, 60) * 500;
          const n = r.int(4, 10);
          const a = r2(annuity(G0, q, n));
          const o1 = r2((G0 * p) / 100);
          const R1 = a - o1;
          return {
            text: `Posojilo $${G0}$ € z letno obrestno mero $${pT}$ odplačujemo z $${n}$ letnimi anuitetami po $${tx(a, 2)}$ €. Kolikšna je razdolžnina v prvem letu, torej del prve anuitete, ki zmanjša dolg? Zaokroži na cent.`,
            answer: eur(R1, [
              { value: o1, why: "To so obresti prvega leta; razdolžnina je preostali del anuitete." },
              { value: G0 / n, why: "Razdolžnine niso enake: na začetku gre večji del anuitete za obresti." },
            ]),
            hint: "Najprej izračunaj obresti prvega leta od celotnega posojila.",
            data: { given: [`G_0 = ${G0}${E}`, `p = ${pT}`, `a = ${tx(a, 2)}${E}`], find: ["R_1"] },
            formula: ["o_1 = G_0 \\cdot \\dfrac{p}{100}", "R_1 = a - o_1"],
            solution: `$o_1 = ${G0} \\cdot \\dfrac{${tx(p)}}{100} = ${tx(o1, 2)}$ €\n$R_1 = a - o_1 = ${tx(a, 2)} - ${tx(o1, 2)}$\n$R_1 = ${tx(R1, 2)}$ €`,
          };
        }
        const X = r.int(10, 100) * 100;
        const k = r.int(2, 6);
        const G0v = X / q ** k;
        return {
          text: `${nm} mora čez ${yrs(k)} vrniti $${X}$ €. Z upnikom se dogovori, da dolg poravna že danes. Koliko mora plačati danes, če upoštevata letno obrestno mero $${pT}$ in obrestno obrestovanje? Zaokroži na cent.`,
          answer: eur(G0v, [
            { value: X * q ** k, why: "Si glavnico preračunal naprej (krat $r^k$) namesto nazaj na današnji dan?" },
            { value: X * (1 - (k * p) / 100), why: "Si obresti odšteval navadno? Na današnji dan preračunaš z deljenjem z $r^k$." },
            { value: X / q, why: "Znesek zapade šele čez več let: deli z $r$ za vsako leto posebej." },
          ]),
          hint: "Današnja vrednost je glavnica, ki v danih letih z obrestmi naraste na dolgovani znesek.",
          data: { given: [`G = ${X}${E}`, `p = ${pT}`, `k = ${k}`], find: ["G_0"] },
          formula: ["r = 1 + \\dfrac{p}{100}", "G_0 = \\dfrac{G}{r^k}"],
          solution: `${rLine}\n$r^{${k}} ${ap(q ** k, 6)} ${tx(q ** k, 6)}$\n$G_0 = \\dfrac{${X}}{${tx(q ** k, 6)}} \\approx ${tx(G0v, 2)}$ €`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const G0 = r.int(10, 80) * 500;
          const n = r.int(6, 12);
          const k = r.int(2, n - 2);
          const a = r2(annuity(G0, q, n));
          const qk = q ** k;
          const grow = G0 * qk;
          const paid = (a * (qk - 1)) / (q - 1);
          const Dk = grow - paid;
          return {
            text: `${nm} odplačuje posojilo $${G0}$ € z $${n}$ letnimi anuitetami po $${tx(a, 2)}$ € pri letni obrestni meri $${pT}$. Koliko dolga ostane takoj po plačilu $${k}$. anuitete? Zaokroži na cent.`,
            answer: eur(Dk, [
              { value: G0 - k * a, why: "Si od posojila le odštel plačane anuitete? Dolg se vmes obrestuje." },
              { value: grow - k * a, why: "Tudi plačane anuitete je treba preračunati na isti trenutek: vsaka se obrestuje od dneva plačila naprej." },
              { value: (G0 * (n - k)) / n, why: "Dolg ne pada enakomerno: razdolžnine so na začetku majhne in nato rastejo." },
            ]),
            hint: `Posojilo in že plačane anuitete preračunaj na trenutek po ${k}. plačilu ter ju odštej.`,
            data: { given: [`G_0 = ${G0}${E}`, `p = ${pT}`, `a = ${tx(a, 2)}${E}`, `k = ${k}`], find: [`D_{${k}}`] },
            formula: ["D_k = G_0 r^k - a \\cdot \\dfrac{r^k - 1}{r - 1}"],
            solution: `${rLine}, $r^{${k}} ${ap(qk, 6)} ${tx(qk, 6)}$\n$D_{${k}} = ${G0} \\cdot ${tx(qk, 6)} - ${tx(a, 2)} \\cdot \\dfrac{${tx(qk - 1, 6)}}{${tx(q - 1)}}$\n$D_{${k}} \\approx ${tx(grow, 2)} - ${tx(paid, 2)}$\n$D_{${k}} \\approx ${tx(Dk, 2)}$ €`,
          };
        }
        if (t === 1) {
          const G0 = r.int(10, 60) * 500;
          const n = r.int(5, 10);
          const j = r.int(2, 3);
          const a = r2(annuity(G0, q, n));
          let D = G0;
          const rows = [];
          for (let i = 1; i <= j; i++) {
            const o = r2((D * p) / 100);
            const R = r2(a - o);
            const Dn = r2(D - R);
            rows.push({ i, D, o, R, Dn });
            D = Dn;
          }
          const last = rows[j - 1];
          const askO = r.next() < 0.5;
          const lines = rows.map((w) => `${w.i}. leto: $o_${w.i} = ${tx(w.D, 2)} \\cdot ${tx(p / 100)} ${ap((w.D * p) / 100, 2)} ${tx(w.o, 2)}$ €, $R_${w.i} = ${tx(a, 2)} - ${tx(w.o, 2)} = ${tx(w.R, 2)}$ €, $D_${w.i} = ${tx(w.Dn, 2)}$ €`);
          return {
            text: `Posojilo $${G0}$ € z letno obrestno mero $${pT}$ odplačujemo z $${n}$ letnimi anuitetami po $${tx(a, 2)}$ €. V amortizacijskem načrtu (vsak znesek zaokrožimo na cent) izračunaj ${askO ? "obresti" : "razdolžnino"} v $${j}$. letu.`,
            answer: askO
              ? eur(last.o, [
                  { value: rows[0].o, why: "Obresti se računajo od ostanka dolga po prejšnjem letu, ne od celotnega posojila." },
                  { value: last.R, why: "To je razdolžnina; obresti so del anuitete, ki ne zmanjša dolga." },
                ])
              : eur(last.R, [
                  { value: rows[0].R, why: "To je razdolžnina prvega leta; razdolžnine iz leta v leto rastejo." },
                  { value: last.o, why: "To so obresti; razdolžnina je anuiteta minus obresti." },
                  { value: a - rows[0].o, why: "Obresti v tem letu računaš od ostanka dolga, ne od celotnega posojila." },
                ]),
            hint: "Načrt izpolnjuj vrstico za vrstico: obresti od dolga, razdolžnina je anuiteta minus obresti, nov dolg je dolg minus razdolžnina.",
            data: { given: [`G_0 = ${G0}${E}`, `p = ${pT}`, `a = ${tx(a, 2)}${E}`], find: [askO ? `o_${j}` : `R_${j}`] },
            formula: ["o_k = D_{k-1} \\cdot \\dfrac{p}{100}", "R_k = a - o_k", "D_k = D_{k-1} - R_k"],
            solution: lines.join("\n") + `\n${askO ? `Obresti v ${j}. letu: $o_${j} = ${tx(last.o, 2)}$ €` : `Razdolžnina v ${j}. letu: $R_${j} = ${tx(last.R, 2)}$ €`}`,
          };
        }
        const G0 = r.int(6, 60) * 500;
        const n = r.int(4, 12);
        const a = r2(annuity(G0, q, n));
        const total = n * a - G0;
        return {
          text: `${nm} vzame posojilo $${G0}$ € pri letni obrestni meri $${pT}$ in ga vrne z $${n}$ letnimi anuitetami po $${tx(a, 2)}$ €. Koliko obresti plača skupaj? Zaokroži na cent.`,
          answer: eur(total, [
            { value: (G0 * p * n) / 100, why: "Obresti se vsako leto računajo od manjšega dolga, ne od celotnega posojila." },
            { value: n * a, why: "To je vsota vseh anuitet; obresti so znesek, ki ga plačaš več od posojila." },
            { value: G0 * (q ** n - 1), why: "Toliko obresti bi plačal, če bi ves dolg vrnil šele na koncu." },
          ]),
          hint: "Vsota vseh razdolžnin je ravno posojilo. Kaj je potem ostalo od vseh plačil?",
          data: { given: [`G_0 = ${G0}${E}`, `p = ${pT}`, `n = ${n}`, `a = ${tx(a, 2)}${E}`], find: ["o"] },
          formula: ["R_1 + R_2 + \\dots + R_n = G_0", "o = n \\cdot a - G_0"],
          solution: `Vsa plačila: $${n} \\cdot ${tx(a, 2)} = ${tx(n * a, 2)}$ €\nOd tega razdolžnine skupaj vrnejo posojilo $${G0}$ €.\n$o = ${tx(n * a, 2)} - ${G0} = ${tx(total, 2)}$ €`,
        };
      }
      // raven 3: načelo ekvivalence glavnic in obratna naloga
      const t = r.int(0, 2);
      if (t === 0) {
        const X1 = r.int(10, 60) * 100;
        const X2 = r.int(10, 60) * 100;
        const t1 = r.int(1, 3);
        const t2 = t1 + r.int(2, 4);
        const tt = r.int(t1 + 1, t2 - 1);
        const v1 = X1 * q ** (tt - t1);
        const v2 = X2 / q ** (t2 - tt);
        const Vv = v1 + v2;
        return {
          text: `${nm} dolguje $${X1}$ € z rokom plačila čez ${yrs(t1)} in $${X2}$ € z rokom čez ${yrs(t2)}. Z upnikom se dogovori, da oba dolga poravna z enim plačilom čez ${yrs(tt)}. Kolikšno je to plačilo pri letni obrestni meri $${pT}$? Zaokroži na cent.`,
          answer: eur(Vv, [
            { value: X1 + X2, why: "Zneskov z različnimi roki ne smeš kar sešteti; preračunaj ju na isti trenutek." },
            { value: X1 / q ** (tt - t1) + X2 * q ** (t2 - tt), why: "Si preračunaval v napačno smer? Znesek, ki zapade prej, do plačila naraste, poznejšega pa preračunaš nazaj." },
            { value: X1 * q ** (tt - t1) + X2, why: "Tudi drugi znesek je treba preračunati na dan plačila (nazaj, z deljenjem)." },
          ]),
          hint: "Izberi trenutek primerjave na dan enkratnega plačila in vsak dolg preračunaj nanj.",
          data: { given: [`G_1 = ${X1}${E}`, `t_1 = ${t1}`, `G_2 = ${X2}${E}`, `t_2 = ${t2}`, `t = ${tt}`, `p = ${pT}`], find: ["X"] },
          formula: ["\\text{naprej: } G \\cdot r^k, \\quad \\text{nazaj: } \\dfrac{G}{r^k}", "r = 1 + \\dfrac{p}{100}"],
          solution: `${rLine}\nPrvi dolg do plačila naraste: $${X1} \\cdot ${tx(q)}^{${tt - t1}} ${ap(v1, 4)} ${txr(v1, 4)}$ €\nDrugega preračunamo nazaj: $\\dfrac{${X2}}{${tx(q)}^{${t2 - tt}}} ${ap(v2, 4)} ${txr(v2, 4)}$ €\n$X \\approx ${txr(v1, 4)} + ${txr(v2, 4)} ${ap(Vv, 2)} ${tx(Vv, 2)}$ €`,
        };
      }
      if (t === 1) {
        const G0 = r.int(20, 100) * 100;
        const t1 = r.int(1, 2);
        const t2 = t1 + r.int(1, 3);
        const s = q ** -t1 + q ** -t2;
        const x = G0 / s;
        return {
          text: `${nm} si sposodi $${G0}$ € in dolg poplača z dvema enakima obrokoma: prvim čez ${yrs(t1)} in drugim čez ${yrs(t2)}. Kolikšen je obrok pri letni obrestni meri $${pT}$? Zaokroži na cent.`,
          answer: eur(x, [
            { value: G0 / 2, why: "Obroka morata pokriti tudi obresti; plačila primerjaj na isti dan." },
            { value: (G0 * q ** t2) / 2, why: "Si posojilo preračunal na dan drugega obroka, prvega obroka pa ne? Tudi prvi obrok se do takrat obrestuje." },
            { value: (G0 * q ** t1) / 2, why: "Obroka zapadeta ob različnih rokih, zato ju preračunaj na isti trenutek vsakega posebej." },
          ]),
          hint: "Po načelu ekvivalence glavnic izenači današnjo vrednost posojila z današnjo vrednostjo obeh obrokov.",
          data: { given: [`G_0 = ${G0}${E}`, `t_1 = ${t1}`, `t_2 = ${t2}`, `p = ${pT}`], find: ["x"] },
          formula: ["G_0 = \\dfrac{x}{r^{t_1}} + \\dfrac{x}{r^{t_2}}", "r = 1 + \\dfrac{p}{100}"],
          solution: `${rLine}\n$${G0} = \\dfrac{x}{${tx(q)}^{${t1}}} + \\dfrac{x}{${tx(q)}^{${t2}}} \\approx x \\cdot ${tx(s, 6)}$\n$x = \\dfrac{${G0}}{${tx(s, 6)}} \\approx ${tx(x, 2)}$ €`,
        };
      }
      const a = r.int(30, 150) * 10;
      const n = r.int(4, 15);
      const qn = q ** n;
      const future = (a * (qn - 1)) / (q - 1);
      const G0 = future / qn;
      return {
        text: `${nm} lahko ob koncu vsakega leta za odplačilo posojila nameni $${a}$ €. Kolikšno posojilo lahko najame danes, če ga želi odplačati z $${n}$ enakimi letnimi anuitetami pri letni obrestni meri $${pT}$? Zaokroži na cent.`,
        answer: eur(G0, [
          { value: n * a, why: "Prihodnje anuitete so danes vredne manj, zato jih ne smeš kar sešteti." },
          { value: future, why: "To je vrednost vseh anuitet ob koncu zadnjega leta; posojilo pa najame danes." },
          { value: a * qn, why: "Uporabi formulo za anuiteto in iz nje izrazi $G_0$." },
        ]),
        hint: "V zvezo med posojilom in anuiteto vstavi znano anuiteto in izrazi posojilo $G_0$.",
        data: { given: [`a = ${a}${E}`, `n = ${n}`, `p = ${pT}`], find: ["G_0"] },
        formula: ["G_0 r^n = a \\cdot \\dfrac{r^n - 1}{r - 1}"],
        solution: `${rLine}, $r^{${n}} ${ap(qn, 6)} ${tx(qn, 6)}$\nVrednost anuitet ob koncu: $${a} \\cdot \\dfrac{${tx(qn - 1, 6)}}{${tx(q - 1)}} \\approx ${tx(future, 2)}$ €\n$G_0 = \\dfrac{${tx(future, 2)}}{${tx(qn, 6)}} \\approx ${tx(G0, 2)}$ €`,
      };
    },
  },

  // ================= zvezne funkcije in bisekcija =================
  {
    id: P + "bisekcija",
    topics: [T("zvezne-funkcije-in-bisekcija")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const m = r.int(-2, 1);
          const j = r.int(0, 3);
          const s = r.pick([1, -1]);
          const xs = [0, 1, 2, 3, 4].map((i) => m + i);
          const vals = xs.map((_, i) => (i <= j ? s : -s) * r.int(1, 9));
          const opt = (i) => `[${xs[i]}, ${xs[i + 1]}]`;
          const wrongs = [0, 1, 2, 3].filter((i) => i !== j).map((i) => [opt(i), `Vrednosti $f(${xs[i]}) = ${vals[i]}$ in $f(${xs[i + 1]}) = ${vals[i + 1]}$ imata enak predznak, zato izrek o ničli tu ne pove ničesar.`]);
          return {
            text: `Funkcija $f$ je zvezna na intervalu $[${xs[0]}, ${xs[4]}]$. Znane so vrednosti ${xs.map((x, i) => `$f(${x}) = ${vals[i]}$`).join(", ")}. Na katerem intervalu izrek o ničli zagotavlja ničlo funkcije $f$?`,
            answer: pickAns(r, opt(j), wrongs),
            options_tex: true,
            hint: "Poišči sosednji vrednosti z različnima predznakoma.",
            data: { given: xs.map((x, i) => `f(${x}) = ${vals[i]}`), find: ["\\text{interval z ničlo}"] },
            formula: "f(a) \\cdot f(b) < 0 \\Rightarrow f(\\xi) = 0 \\text{ za neki } \\xi \\in (a, b)",
            solution: `Sosednji vrednosti z različnima predznakoma sta $f(${xs[j]}) = ${vals[j]}$ in $f(${xs[j + 1]}) = ${vals[j + 1]}$.\nNjun produkt je negativen in $f$ je zvezna, zato ima ničlo na $${opt(j)}$.`,
          };
        }
        if (t === 1) {
          const a = r.int(-3, 2);
          const L = r.int(1, 6);
          const b = a + L;
          const n = r.int(3, 8);
          return {
            text: `Ničlo zvezne funkcije iščemo z bisekcijo na intervalu $[${a}, ${b}]$. Kako dolg je interval, ki ostane po $${n}$ korakih? Vpiši okrajšan ulomek.`,
            answer: frA(L, 2 ** n, [
              { value: L / (2 * n), why: "Si dolžino delil z $2n$? Vsak korak interval razpolovi, zato po $n$ korakih deliš z $2^n$." },
              { value: L / 2 ** (n - 1), why: "Preštej korake: že po prvem koraku je dolžina $\\frac{b - a}{2}$." },
              { value: L / 2 ** (n + 1), why: "Preštej korake: po $n$ korakih je interval razpolovljen $n$-krat." },
            ]),
            hint: "Vsak korak bisekcije interval razpolovi.",
            data: { given: [`a = ${a}`, `b = ${b}`, `n = ${n}`], find: ["d_n"] },
            formula: "d_n = \\dfrac{b - a}{2^n}",
            solution: `$b - a = ${b} - ${pt(a)} = ${L}$\n$d_{${n}} = \\dfrac{${L}}{2^{${n}}} = \\dfrac{${L}}{${2 ** n}} = ${ft(L, 2 ** n)}$`,
          };
        }
        const a = r.int(-2, 2);
        const b = a + r.int(2, 5);
        const same = r.next() < 0.5;
        let u;
        let v;
        if (same) {
          const s = r.pick([1, -1]);
          u = s * r.int(1, 4);
          v = s * r.int(6, 12);
        } else {
          u = -r.int(2, 8);
          v = r.int(2, 8);
        }
        if (r.next() < 0.5) [u, v] = [v, u];
        const lo = Math.min(u, v);
        const hi = Math.max(u, v);
        let c = 0;
        while (c === 0) c = r.int(lo + 1, hi - 1);
        const correct = `${c}`;
        const wrongs = [
          [`${hi + r.int(1, 4)}`, "Ta vrednost je večja od obeh krajiščnih vrednosti. Funkcija jo lahko zavzame, ni pa nujno."],
          [`${lo - r.int(1, 4)}`, "Ta vrednost je manjša od obeh krajiščnih vrednosti. Funkcija jo lahko zavzame, ni pa nujno."],
          same
            ? [`nobene, ker sta $f(${a})$ in $f(${b})$ istega predznaka`, "Ničle res ni nujno, vse vrednosti med $f(a)$ in $f(b)$ pa zvezna funkcija zavzame vedno."]
            : ["samo 0, drugih vrednosti ne zagotovo", "Izrek o ničli je le poseben primer: zvezna funkcija zavzame vse vrednosti med $f(a)$ in $f(b)$."],
        ];
        return {
          text: `Funkcija $f$ je zvezna na intervalu $[${a}, ${b}]$, $f(${a}) = ${u}$ in $f(${b}) = ${v}$. Katero vrednost funkcija $f$ na tem intervalu zagotovo zavzame?`,
          answer: pickAns(r, correct, wrongs),
          hint: "Zvezna funkcija na zaprtem intervalu zavzame vse vrednosti med $f(a)$ in $f(b)$.",
          data: { given: [`f(${a}) = ${u}`, `f(${b}) = ${v}`], find: ["\\text{zagotovo zavzeta vrednost}"] },
          formula: "y \\text{ med } f(a) \\text{ in } f(b) \\Rightarrow f(\\xi) = y \\text{ za neki } \\xi \\in [a, b]",
          solution: `Graf zvezne funkcije nima skokov, zato zavzame vse vrednosti med $${lo}$ in $${hi}$.\nOd ponujenih vrednosti je med njima le $${c}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const kind = r.int(0, 2);
          let f;
          let tex;
          let a;
          if (kind === 0) {
            a = r.int(1, 5);
            const N = r.int(a * a + 1, (a + 1) ** 2 - 1);
            f = (x) => x * x - N;
            tex = `x^2 - ${N}`;
          } else if (kind === 1) {
            a = r.int(1, 3);
            const N = r.int(a ** 3 + 1, (a + 1) ** 3 - 1);
            f = (x) => x ** 3 - N;
            tex = `x^3 - ${N}`;
          } else {
            a = r.int(0, 2);
            const c1 = r.int(1, 5);
            const c0 = r.int(-((a + 1) ** 3 + c1 * (a + 1)) + 1, -(a ** 3 + c1 * a) - 1);
            f = (x) => x ** 3 + c1 * x + c0;
            tex = poly([1, 0, c1, c0]);
          }
          const b = a + 1;
          const st = bis(f, a, b, 3);
          if (st.some((s) => Math.abs(s.fc) < 1e-9)) return null;
          const bad = bis(f, a, b, 3, true);
          const c3 = st[2].c;
          return {
            text: `Ničlo funkcije $f(x) = ${tex}$ iščemo z bisekcijo na intervalu $[${a}, ${b}]$. Prva sredina je $c_1 = ${tx(st[0].c)}$. Izračunaj tretjo sredino $c_3$.`,
            answer: num(c3, null, [
              { value: bad[2].c, why: "Si obdržal polovico, na kateri imata krajišči enak predznak? Ničla je tam, kjer se predznak zamenja." },
              { value: st[1].c, why: "To je druga sredina; naredi še en korak." },
            ]),
            hint: "Izračunaj $f(c_1)$ in obdrži polovico intervala, na kateri $f$ zamenja predznak. Nato ponovi.",
            data: { given: [`f(x) = ${tex}`, `a = ${a}`, `b = ${b}`], find: ["c_3"] },
            formula: ["c = \\dfrac{a + b}{2}", "f(a) \\cdot f(c) < 0 \\Rightarrow [a, c], \\text{ sicer } [c, b]"],
            solution: bisLines(f, a, b, st, 3),
          };
        }
        const a = r.int(-2, 3);
        const L = r.int(1, 5);
        const b = a + L;
        const eps = r.pick([0.1, 0.05, 0.01, 0.005, 0.001]);
        let n = 0;
        while (L / 2 ** n >= eps) n++;
        if (Math.abs(L / 2 ** n - eps) < 1e-12 || Math.abs(L / 2 ** (n - 1) - eps) < 1e-12) return null;
        return {
          text: `Ničlo zvezne funkcije iščemo z bisekcijo na intervalu $[${a}, ${b}]$. Najmanj koliko korakov moramo narediti, da bo preostali interval krajši od $${tx(eps)}$?`,
          answer: num(n, null, [
            { value: n - 1, why: "Pri tem številu korakov interval še ni krajši od $\\varepsilon$. Preveri neenačbo še enkrat." },
            { value: Math.ceil(Math.log10(L / eps)), why: "Si delil z $10$ namesto z $2$? Vsak korak interval le razpolovi." },
            { value: Math.ceil(L / eps), why: "Bisekcija ne skrajša intervala vsakič za $\\varepsilon$, ampak ga razpolovi." },
          ]),
          hint: "Po $n$ korakih je dolžina $\\frac{b - a}{2^n}$. Poišči najmanjši $n$, pri katerem je manjša od $\\varepsilon$.",
          data: { given: [`a = ${a}`, `b = ${b}`, `\\varepsilon = ${tx(eps)}`], find: ["n"] },
          formula: "\\dfrac{b - a}{2^n} < \\varepsilon",
          solution: `$\\dfrac{${L}}{2^n} < ${tx(eps)}$, torej $2^n > \\dfrac{${L}}{${tx(eps)}} = ${tx(L / eps)}$\n$2^{${n - 1}} = ${2 ** (n - 1)}$ je premalo, $2^{${n}} = ${2 ** n}$ zadošča.\n$n = ${n}$`,
        };
      }
      // raven 3
      if (r.next() < 0.5) {
        // presečišče dveh krivulj = ničla razlike
        const kind = r.int(0, 1);
        let h;
        let A;
        let B;
        let hTex;
        if (kind === 0) {
          const tt = r.int(1, 4);
          const s = r.int(3, 30);
          h = (x) => x ** 3 + tt * x - s;
          A = "x^3";
          B = `${s} ${tm(-tt, "x")}`;
          hTex = poly([1, 0, tt, -s]);
        } else {
          const s = r.int(3, 12);
          h = (x) => 2 ** x + x - s;
          A = "2^x";
          B = `${s} - x`;
          hTex = `2^x + x - ${s}`;
        }
        let m = null;
        for (let k = 0; k <= 4; k++) if (h(k) < 0 && h(k + 1) > 0) m = k;
        if (m === null) return null;
        const st = bis(h, m, m + 1, 3);
        if (st.some((s) => Math.abs(s.fc) < 1e-9)) return null;
        const bad = bis(h, m, m + 1, 3, true);
        const lines = bisLines(h, m, m + 1, st, 3).replaceAll("f(", "h(");
        return {
          text: `Krivulji $y = ${A}$ in $y = ${B}$ se sekata v točki z absciso med $${m}$ in $${m + 1}$. Z bisekcijo na intervalu $[${m}, ${m + 1}]$ izračunaj tretjo sredino $c_3$.`,
          answer: num(st[2].c, null, [
            { value: bad[2].c, why: "Si obdržal polovico, na kateri imata krajišči enak predznak? Presečišče je tam, kjer razlika zamenja predznak." },
            { value: st[1].c, why: "To je druga sredina; naredi še en korak." },
          ]),
          hint: "Presečišče je ničla razlike obeh funkcij. Zapiši to razliko in v vsaki sredini preveri njen predznak.",
          data: { given: [`y_1 = ${A}`, `y_2 = ${B}`, `a = ${m}`, `b = ${m + 1}`], find: ["c_3"] },
          formula: ["h(x) = y_1 - y_2", "c = \\dfrac{a + b}{2}"],
          solution: `Iščemo ničlo funkcije $h(x) = ${hTex}$.\n${lines}`,
        };
      }
      // koliko intervalov [k, k+1] zagotovo vsebuje ničlo
      const pool = r.shuffle([-7, -5, -3, -1, 1, 3, 5, 7]);
      const dbl = r.next() < 0.35;
      const roots = dbl ? [pool[0], pool[0], pool[1]] : pool.slice(0, 3);
      const cs = roots.reduce((acc, al) => mul(acc, [2, -al]), [1]);
      const p0 = r.int(-3, 0);
      const q0 = p0 + r.int(4, 5);
      const xs = [];
      for (let x = p0; x <= q0; x++) xs.push(x);
      const vals = xs.map((x) => ev(cs, x));
      const ch = [];
      for (let i = 0; i < xs.length - 1; i++) if (vals[i] * vals[i + 1] < 0) ch.push(i);
      const inside = new Set(roots.filter((al) => al / 2 > p0 && al / 2 < q0)).size;
      return {
        text: `Za funkcijo $f(x) = ${poly(cs)}$ izračunaj vrednosti v celih številih od $${p0}$ do $${q0}$. Na koliko intervalih oblike $[k, k + 1]$ s krajišči med $${p0}$ in $${q0}$ izrek o ničli zagotavlja ničlo?`,
        answer: num(ch.length, null, [
          { value: 3, why: "Stopnja polinoma pove največje število ničel, ne števila zagotovljenih ničel na tem intervalu." },
          { value: inside, why: "Pri dvojni ničli $f$ ne zamenja predznaka, zato je izrek o ničli ne zazna." },
          { value: vals.filter((v) => v < 0).length, why: "Ne štej negativnih vrednosti, ampak menjave predznaka med sosednjima celima številoma." },
        ]),
        hint: "Napiši tabelo vrednosti $f(k)$ in poišči sosednji števili, kjer se predznak zamenja.",
        data: { given: [`f(x) = ${poly(cs)}`, `a = ${p0}`, `b = ${q0}`], find: ["\\text{število intervalov}"] },
        formula: "f(k) \\cdot f(k + 1) < 0 \\Rightarrow \\text{ničla na } (k, k + 1)",
        solution: `${xs.map((x, i) => `$f(${x}) = ${vals[i]}$`).join(", ")}\n${ch.length ? `Predznak se zamenja na ${ch.map((i) => `$[${xs[i]}, ${xs[i + 1]}]$`).join(", ")}.` : "Predznak se nikjer ne zamenja."}\nŠtevilo takih intervalov: $${ch.length}$`,
      };
    },
  },

  // ================= odvedljivost in implicitni odvod =================
  {
    id: P + "odvedljivost",
    topics: [T("odvedljivost-in-implicitni-odvod")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.55) {
          const ab = (a) => (a === 0 ? "\\lvert x \\rvert" : `\\lvert ${xm(a)} \\rvert`);
          const kind = r.int(0, 4);
          let tex;
          let ans;
          let ms = [];
          let expl;
          const pts = r.shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
          if (kind === 0) {
            const k = r.int(2, 3);
            const ps = pts.slice(0, k).sort((x, y) => x - y);
            const co = ps.map(() => r.pick([1, 1, 2, 3]));
            tex = ps.map((p, i) => `${i ? "+ " : ""}${co[i] === 1 ? "" : co[i]}${ab(p)}`).join(" ");
            ans = k;
            ms = [{ value: k - 1, why: "Vsaka absolutna vrednost s svojo ničlo da en vogal grafa." }];
            expl = `Izrazi pod absolutnimi vrednostmi zamenjajo predznak v ${ps.map((p) => `$x = ${p}$`).join(", ")}; v vsaki teh točk ima graf vogal.`;
          } else if (kind === 1) {
            const k = r.int(1, 4);
            tex = `\\lvert x^2 - ${k * k} \\rvert`;
            ans = 2;
            ms = [{ value: 1, why: `Izraz $x^2 - ${k * k}$ ima dve ničli, $x = ${k}$ in $x = -${k}$.` }];
            expl = `$x^2 - ${k * k}$ zamenja predznak v $x = -${k}$ in $x = ${k}$; v obeh ima graf vogal.`;
          } else if (kind === 2) {
            const [a, b] = pts;
            tex = `${a === 0 ? "x" : `(${xm(a)})`}${ab(a)} + ${ab(b)}`;
            ans = 1;
            ms = [{ value: 2, why: `Funkcija $${a === 0 ? "x" : `(${xm(a)})`}${ab(a)}$ je v $x = ${a}$ odvedljiva: levi in desni odvod sta tam $0$.` }];
            expl = `Člen $${a === 0 ? "x" : `(${xm(a)})`}${ab(a)}$ je v $x = ${a}$ odvedljiv (oba enostranska odvoda sta $0$).\nVogal ostane le v $x = ${b}$.`;
          } else if (kind === 3) {
            const k = r.int(1, 9);
            const b = pts[0];
            tex = `\\lvert x^2 + ${k} \\rvert + ${ab(b)}`;
            ans = 1;
            ms = [{ value: 2, why: `Izraz $x^2 + ${k}$ je vedno pozitiven, zato ta absolutna vrednost ne naredi vogala.` }];
            expl = `$x^2 + ${k} > 0$ za vse $x$, zato je $\\lvert x^2 + ${k} \\rvert = x^2 + ${k}$ odvedljiva.\nVogal je le v $x = ${b}$.`;
          } else {
            const k = r.int(1, 3);
            tex = `\\lvert x^3 - ${k * k}x \\rvert`;
            ans = 3;
            ms = [{ value: 2, why: "Ne pozabi ničle $x = 0$: tudi tam izraz zamenja predznak." }];
            expl = `$x^3 - ${k * k}x = x(x - ${k})(x + ${k})$ zamenja predznak v $x = -${k}$, $x = 0$ in $x = ${k}$.`;
          }
          return {
            text: `V koliko točkah je funkcija $f(x) = ${tex}$ zvezna, ni pa odvedljiva?`,
            answer: num(ans, null, ms),
            hint: "Poišči, kje izraz pod absolutno vrednostjo zamenja predznak. Tam ima graf lahko vogal.",
            data: { given: [`f(x) = ${tex}`], find: ["\\text{število točk}"] },
            formula: "f'_-(a) \\ne f'_+(a) \\Rightarrow f \\text{ v } a \\text{ ni odvedljiva}",
            solution: `${expl}\nŠtevilo takih točk: $${ans}$`,
          };
        }
        const [p, q, R] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
        const sw = r.next() < 0.5;
        const x0 = (sw ? q : p) * r.pick([1, -1]);
        const y0 = (sw ? p : q) * r.pick([1, -1]);
        return {
          text: `Krožnica ima enačbo $x^2 + y^2 = ${R * R}$. Izračunaj smerni koeficient tangente v točki $T(${x0}, ${y0})$. Vpiši okrajšan ulomek.`,
          answer: frA(-x0, y0, [
            { value: -y0 / x0, why: "Si zamenjal števec in imenovalec? Iz $2x + 2y\\,y' = 0$ izrazi $y'$." },
            { value: x0 / y0, why: "Preveri predznak pri izražanju $y'$." },
          ]),
          hint: "Obe strani enačbe odvajaj po $x$; $y$ je funkcija od $x$, zato je $(y^2)' = 2y\\,y'$.",
          data: { given: [`x^2 + y^2 = ${R * R}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["k"] },
          formula: ["2x + 2y\\,y' = 0", "y' = -\\dfrac{x}{y}"],
          solution: `$2x + 2y\\,y' = 0$, torej $y' = -\\dfrac{x}{y}$\n$k = -\\dfrac{${x0}}{${pt(y0)}} = ${ft(-x0, y0)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const pp = r.int(1, 4);
          let qq = r.int(1, 4);
          if (qq === pp) qq = pp === 4 ? 1 : pp + 1;
          const x0 = r.nonZero(-3, 3);
          const y0 = r.nonZero(-3, 3);
          const s = pp * x0 * x0 + qq * y0 * y0;
          const lhs = `${pp === 1 ? "" : pp}x^2 + ${qq === 1 ? "" : qq}y^2`;
          return {
            text: `Elipsa ima enačbo $${lhs} = ${s}$. Izračunaj smerni koeficient tangente v točki $T(${x0}, ${y0})$. Vpiši okrajšan ulomek ali celo število.`,
            answer: frA(-pp * x0, qq * y0, [
              { value: -x0 / y0, why: "Si pozabil na koeficienta pri $x^2$ in $y^2$? Pri odvajanju ostaneta." },
              { value: (pp * x0) / (qq * y0), why: "Preveri predznak pri izražanju $y'$." },
              { value: -(qq * y0) / (pp * x0), why: "Si zamenjal števec in imenovalec?" },
            ]),
            hint: "Odvajaj obe strani po $x$, pri tem je $(y^2)' = 2y\\,y'$. Nato izrazi $y'$ in vstavi točko.",
            data: { given: [`${lhs} = ${s}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["k"] },
            formula: ["(y^2)' = 2y\\,y'"],
            solution: `$${2 * pp}x + ${2 * qq}y\\,y' = 0$\n$y' = -\\dfrac{${2 * pp}x}{${2 * qq}y} = -\\dfrac{${pp === 1 ? "" : pp}x}{${qq === 1 ? "" : qq}y}$\n$k = -\\dfrac{${pp} \\cdot ${pt(x0)}}{${qq} \\cdot ${pt(y0)}} = ${ft(-pp * x0, qq * y0)}$`,
          };
        }
        if (t === 1) {
          const x0 = r.nonZero(-6, 6);
          let y0 = r.nonZero(-6, 6);
          if (Math.abs(y0) === Math.abs(x0)) y0 = y0 > 0 ? y0 + 1 : y0 - 1;
          const c = x0 * y0;
          return {
            text: `Hiperbola ima enačbo $xy = ${c}$. Z implicitnim odvajanjem izračunaj smerni koeficient tangente v točki $T(${x0}, ${y0})$. Vpiši okrajšan ulomek ali celo število.`,
            answer: frA(-y0, x0, [
              { value: -x0 / y0, why: "Si odvajal kot pri krožnici? Pri $xy$ uporabi pravilo za odvod produkta: $(xy)' = y + x\\,y'$." },
              { value: y0 / x0, why: "Preveri predznak pri izražanju $y'$." },
              { value: 0, why: "Odvod leve strani ni $0$: $(xy)' = y + x\\,y'$." },
            ]),
            hint: "Levo stran odvajaj kot produkt dveh funkcij od $x$.",
            data: { given: [`xy = ${c}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["k"] },
            formula: ["(xy)' = y + x\\,y'"],
            solution: `$y + x\\,y' = 0$, torej $y' = -\\dfrac{y}{x}$\n$k = -\\dfrac{${y0}}{${x0}} = ${ft(-y0, x0)}$`,
          };
        }
        const pp = r.nonZero(-2, 2);
        const qq = r.int(-3, 3);
        const m = r.int(-2, 2);
        const fm = pp * m * m + qq;
        const d = 2 * pp * m;
        const kind = r.int(0, 2);
        let s;
        let tt;
        if (kind === 0) s = d;
        else if (kind === 1) s = d + r.nonZero(-3, 3);
        else s = r.pick([d, d + r.nonZero(-2, 2)]);
        tt = fm - s * m;
        if (kind === 2) tt += r.nonZero(-3, 3);
        const right = s * m + tt;
        const left = poly([pp, 0, qq]);
        const rt = le(s, tt);
        const OPT = ["zvezna in odvedljiva", "zvezna, a ni odvedljiva", "ni zvezna in zato ni odvedljiva", "ni zvezna, je pa odvedljiva"];
        const correct = OPT[kind];
        const why = {
          [OPT[0]]: kind === 1 ? `Vrednosti se ujemata, odvoda z leve ($${d}$) in z desne ($${s}$) pa ne.` : "Vrednosti z leve in desne se ne ujemata, zato funkcija ni zvezna.",
          [OPT[1]]: kind === 0 ? `Tudi odvoda z leve in desne sta enaka ($${d}$), zato je funkcija odvedljiva.` : "Funkcija ni zvezna: vrednosti z leve in desne se razlikujeta.",
          [OPT[2]]: "Preveri: obe formuli v tej točki dasta isto vrednost, zato je funkcija zvezna.",
          [OPT[3]]: "Nezvezna funkcija ne more biti odvedljiva, tudi če se naklona ujemata.",
        };
        return {
          text: `Dana je funkcija $f(x) = \\begin{cases} ${left}, & x \\le ${m} \\\\ ${rt}, & x > ${m} \\end{cases}$. Kaj velja za $f$ v točki $x = ${m}$?`,
          answer: pickAns(r, correct, OPT.filter((o) => o !== correct).map((o) => [o, why[o]])),
          hint: "Najprej primerjaj vrednosti obeh formul v tej točki, nato še njuna odvoda.",
          data: { given: [`f_1(x) = ${left}`, `f_2(x) = ${rt}`, `a = ${m}`], find: ["\\text{zveznost in odvedljivost v } a"] },
          formula: ["f_1(a) = f_2(a) \\Rightarrow \\text{zvezna}", "f_1'(a) = f_2'(a) \\Rightarrow \\text{odvedljiva}"],
          solution: `Vrednosti: $f_1(${m}) = ${fm}$, $f_2(${m}) = ${right}$${fm === right ? ": enaki, $f$ je zvezna." : ": različni, $f$ ni zvezna in zato ni odvedljiva."}${fm === right ? `\nOdvoda: $f_1'(x) = ${le(2 * pp, 0)}$, $f_1'(${m}) = ${d}$; $f_2'(${m}) = ${s}$${d === s ? ": enaka, $f$ je odvedljiva." : ": različna, $f$ ni odvedljiva."}` : ""}\nPravilno: ${correct}.`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const aa = r.pick([-1, 1, 3, -3]);
        const x0 = r.nonZero(-3, 3);
        const y0 = r.nonZero(-3, 3);
        const den = aa * x0 + 2 * y0;
        const nu = -(2 * x0 + aa * y0);
        const c = x0 * x0 + aa * x0 * y0 + y0 * y0;
        if (den === 0 || c === 0) return null;
        const nN = y0 * den - nu * x0; // n = y0 - k x0 = (y0·den − nu·x0)/den
        const kw = -(2 * x0 + aa * y0) / (2 * y0);
        return {
          text: `Krivulja ima enačbo $x^2 ${tm(aa, "xy")} + y^2 = ${c}$. Tangenta v točki $T(${x0}, ${y0})$ ima enačbo $y = kx + n$. Izračunaj $n$ in ga vpiši kot okrajšan ulomek ali celo število.`,
          answer: frA(nN, den, [
            { value: nu / den, why: "To je smerni koeficient $k$; $n$ dobiš, ko v $y = kx + n$ vstaviš koordinati točke." },
            { value: y0 - kw * x0, why: "Si pri odvajanju člena z $xy$ pozabil pravilo za produkt $(xy)' = y + x\\,y'$?" },
            { value: y0 + (nu / den) * x0, why: "Preveri predznak: $n = y_0 - k x_0$." },
          ]),
          hint: "Odvajaj obe strani po $x$ (pri $xy$ uporabi pravilo za produkt), vstavi točko in izrazi $y'$.",
          data: { given: [`x^2 ${tm(aa, "xy")} + y^2 = ${c}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["n"] },
          formula: ["(xy)' = y + x\\,y'", "(y^2)' = 2y\\,y'", "n = y_0 - k x_0"],
          solution: `$2x ${tm(aa, "(y + x\\,y')")} + 2y\\,y' = 0$\nV točki $T$: $${2 * x0} ${sg(aa * y0)} ${sg(aa * x0)}\\,y' ${sg(2 * y0)}\\,y' = 0$\n$k = y' = ${ft(nu, den)}$\n$n = ${y0} - ${pt(ft(nu, den))} \\cdot ${pt(x0)} = ${ft(nN, den)}$`,
        };
      }
      if (t === 1) {
        const [u, w, R] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
        const sw = r.next() < 0.5;
        const dx = (sw ? w : u) * r.pick([1, -1]);
        const dy = (sw ? u : w) * r.pick([1, -1]);
        let p = r.int(-3, 3);
        const q = r.int(-3, 3);
        if (p === 0 && q === 0) p = 2;
        const x0 = p + dx;
        const y0 = q + dy;
        const nN = y0 * dy + dx * x0; // n = y0 + (dx/dy) x0
        const eq = `${lin(p)}^2 + ${q === 0 ? "y" : `(y ${sg(-q)})`}^2 = ${R * R}`;
        return {
          text: `Krožnica ima enačbo $${eq}$. Tangenta v točki $T(${x0}, ${y0})$ ima enačbo $y = kx + n$. Izračunaj $n$ in ga vpiši kot okrajšan ulomek ali celo število.`,
          answer: frA(nN, dy, [
            { value: y0 !== 0 ? y0 + (x0 / y0) * x0 : NaN, why: "Si uporabil $y' = -\\frac{x}{y}$? To velja le za krožnico s središčem v izhodišču." },
            { value: -dx / dy, why: "To je smerni koeficient $k$; $n$ dobiš, ko v $y = kx + n$ vstaviš koordinati točke." },
            { value: y0 - (dx / dy) * x0, why: "Preveri predznak smernega koeficienta: $y' = -\\frac{x - p}{y - q}$." },
          ]),
          hint: "Odvajaj obe strani po $x$; $\\left((y - q)^2\\right)' = 2(y - q)\\,y'$. Izrazi $y'$ in vstavi točko.",
          data: { given: [`${eq}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["n"] },
          formula: ["2(x - p) + 2(y - q)\\,y' = 0", "n = y_0 - k x_0"],
          solution: `$y' = -\\dfrac{${xm(p)}}{${q === 0 ? "y" : `y ${sg(-q)}`}}$\n$k = -\\dfrac{${dx}}{${pt(dy)}} = ${ft(-dx, dy)}$\n$n = ${y0} - ${pt(ft(-dx, dy))} \\cdot ${pt(x0)} = ${ft(nN, dy)}$`,
        };
      }
      const pp = r.nonZero(-2, 2);
      const qq = r.int(-4, 4);
      const ss = r.int(-5, 5);
      const m = r.nonZero(-2, 2);
      const fm = pp * m * m + qq * m + ss;
      const a = 2 * pp * m + qq;
      const b = fm - a * m;
      const left = poly([pp, qq, ss]);
      return {
        text: `Dana je funkcija $f(x) = \\begin{cases} ${left}, & x \\le ${m} \\\\ ax + b, & x > ${m} \\end{cases}$. Določi $a$ in $b$ tako, da bo $f$ v točki $x = ${m}$ odvedljiva. Vpiši $b$.`,
        answer: num(b, null, [
          { value: fm, why: `Desna formula v točki $x = ${m}$ da $a \\cdot ${pt(m)} + b$, zato $b$ ni kar enak $f(${m})$.` },
          { value: fm - qq * m, why: `Preveri smerni koeficient $a = f_1'(${m})$: odvajaj tudi člen z $x^2$.` },
          { value: -b, why: "Preveri predznak pri izražanju $b$." },
        ]),
        hint: "Odvedljiva funkcija je zvezna. Zahtevaj, da se v tej točki ujemata vrednosti in odvoda obeh formul.",
        data: { given: [`f_1(x) = ${left}`, `a_0 = ${m}`], find: ["b"] },
        formula: ["f_1(a_0) = a \\cdot a_0 + b", "f_1'(a_0) = a"],
        solution: `Odvoda: $f_1'(x) = ${le(2 * pp, qq)}$, zato $a = f_1'(${m}) = ${a}$.\nVrednosti: $f_1(${m}) = ${fm}$ mora biti enako $${a} \\cdot ${pt(m)} + b$.\n$b = ${fm} - ${pt(a * m)} = ${b}$`,
      };
    },
  },

  // ================= drugi odvod, prevoj, konveksnost =================
  {
    id: P + "drugi-odvod",
    topics: [T("drugi-odvod-prevoj-in-konveksnost")],
    gen(level, r) {
      // kubična funkcija z ničlama odvoda r1 < r2 (r1 + r2 sodo)
      const cubic = () => {
        const ka = r.nonZero(-2, 2);
        const r1 = r.int(-4, 2);
        const r2 = r1 + 2 * r.int(1, 3);
        const d = r.int(-6, 6);
        return { ka, r1, r2, cs: [ka, (-3 * ka * (r1 + r2)) / 2, 3 * ka * r1 * r2, d], x0: (r1 + r2) / 2 };
      };
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const deg = r.pick([3, 4]);
          const cs = [r.nonZero(-3, 3), ...Array.from({ length: deg }, () => r.int(-5, 5))];
          const x0 = r.int(-3, 3);
          const d1 = der(cs);
          const d2 = der(d1);
          const val = ev(d2, x0);
          return {
            text: `Dana je funkcija $f(x) = ${poly(cs)}$. Izračunaj $f''(${x0})$.`,
            answer: num(val, null, [
              { value: ev(d1, x0), why: `To je $f'(${x0})$; odvajaj še enkrat.` },
              { value: ev(cs, x0), why: "To je vrednost funkcije, ne drugega odvoda." },
            ]),
            hint: "Funkcijo odvajaj dvakrat zapored in šele nato vstavi število.",
            data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${x0}`], find: [`f''(${x0})`] },
            formula: "f''(x) = \\bigl(f'(x)\\bigr)'",
            solution: `$f'(x) = ${poly(d1)}$\n$f''(x) = ${poly(d2)}$\n$f''(${x0}) = ${val}$`,
          };
        }
        if (t === 1) {
          const a = r.nonZero(-3, 3);
          const b = r.nonZero(-9, 9);
          const cs = [a, b, r.int(-6, 6), r.int(-6, 6)];
          return {
            text: `Izračunaj absciso prevoja funkcije $f(x) = ${poly(cs)}$. Vpiši okrajšan ulomek ali celo število.`,
            answer: frA(-b, 3 * a, [
              { value: -b / (6 * a), why: "Si pri odvajanju $bx^2$ pozabil faktor $2$? Drugi odvod je $6ax + 2b$." },
              { value: b / (3 * a), why: "Preveri predznak pri reševanju enačbe $f''(x) = 0$." },
              { value: -b / a, why: "Drugi odvod je $6ax + 2b$, ne $ax + b$." },
            ]),
            hint: "Prevoj kubične funkcije je v ničli drugega odvoda.",
            data: { given: [`f(x) = ${poly(cs)}`], find: ["x_0"] },
            formula: "f''(x_0) = 0",
            solution: `$f'(x) = ${poly(der(cs))}$\n$f''(x) = ${poly(der(der(cs)))} = 0$\n$x_0 = ${ft(-2 * b, 6 * a)}$, $f''$ tu zamenja predznak.`,
          };
        }
        const k = r.nonZero(-4, 4);
        const z = r.int(-3, 3);
        const d2 = [6 * k, -6 * k * z];
        const x1 = z + r.nonZero(-3, 3);
        const v = ev(d2, x1);
        const correct = v > 0 ? "konveksen" : "konkaven";
        return {
          text: `Za funkcijo $f$ velja $f''(x) = ${poly(d2)}$. Kakšen je graf $f$ v okolici točke $x = ${x1}$?`,
          answer: pickAns(r, correct, [
            [v > 0 ? "konkaven" : "konveksen", `Preveri predznak: $f''(${x1}) = ${v}$.`],
            ["ima prevoj", `V prevoju je $f'' = 0$, tu pa je $f''(${x1}) = ${v}$.`],
            ["brez prvega odvoda tega ne moremo vedeti", "Konveksnost določa predznak $f''$, prvega odvoda ne potrebujemo."],
          ]),
          hint: "Vstavi točko v drugi odvod in poglej predznak.",
          data: { given: [`f''(x) = ${poly(d2)}`, `x_1 = ${x1}`], find: ["\\text{konveksnost}"] },
          formula: ["f'' > 0 \\Rightarrow \\text{konveksna}", "f'' < 0 \\Rightarrow \\text{konkavna}"],
          solution: `$f''(${x1}) = ${v}$ ${v > 0 ? "$> 0$" : "$< 0$"}\nGraf je v okolici te točke ${correct}.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        const { ka, r1, r2, cs, x0 } = cubic();
        const d1 = der(cs);
        const d2 = der(d1);
        if (t === 0) {
          const cv = ka > 0 ? `(${x0}, \\infty)` : `(-\\infty, ${x0})`;
          const cc = ka > 0 ? `(-\\infty, ${x0})` : `(${x0}, \\infty)`;
          return {
            text: `Na katerem intervalu je funkcija $f(x) = ${poly(cs)}$ konveksna?`,
            answer: pickAns(r, cv, [
              [cc, "Tu je $f'' < 0$: graf je konkaven."],
              [`(${r1}, ${r2})`, `Na tem intervalu je $f' ${ka > 0 ? "< 0" : "> 0"}$ (funkcija ${ka > 0 ? "pada" : "narašča"}). Konveksnost določa predznak $f''$, ne $f'$.`],
              [`(-\\infty, ${r1}) \\cup (${r2}, \\infty)`, "To so intervali, kjer ima $f'$ isti predznak. Konveksnost določa predznak $f''$."],
            ]),
            options_tex: true,
            hint: "Izračunaj drugi odvod in ugotovi, kje je pozitiven.",
            data: { given: [`f(x) = ${poly(cs)}`], find: ["\\text{interval konveksnosti}"] },
            formula: "f''(x) > 0 \\Rightarrow f \\text{ konveksna}",
            solution: `$f'(x) = ${poly(d1)}$\n$f''(x) = ${poly(d2)}$, ničla pri $x = ${x0}$\n$f''(x) > 0$ za $x ${ka > 0 ? ">" : "<"} ${x0}$, zato je $f$ konveksna na $${cv}$.`,
          };
        }
        if (t === 1) {
          const ri = r.pick([r1, r2]);
          const v = ev(d2, ri);
          const correct = v > 0 ? "lokalni minimum" : "lokalni maksimum";
          return {
            text: `Funkcija $f(x) = ${poly(cs)}$ ima stacionarno točko pri $x = ${ri}$. Kakšna je ta točka?`,
            answer: pickAns(r, correct, [
              [v > 0 ? "lokalni maksimum" : "lokalni minimum", v > 0 ? "Pri $f''(a) > 0$ je graf konveksen ($\\cup$), zato je to minimum." : "Pri $f''(a) < 0$ je graf konkaven ($\\cap$), zato je to maksimum."],
              ["prevoj", `V prevoju je $f'' = 0$, tu pa je $f''(${ri}) = ${v}$.`],
              ["test z drugim odvodom ne odloči", "Test ne odloči le, kadar je $f''(a) = 0$."],
            ]),
            hint: "Izračunaj $f''$ v stacionarni točki in poglej predznak.",
            data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${ri}`], find: ["\\text{vrsta točke}"] },
            formula: ["f'(a) = 0,\\ f''(a) > 0 \\Rightarrow \\text{minimum}", "f'(a) = 0,\\ f''(a) < 0 \\Rightarrow \\text{maksimum}"],
            solution: `$f'(x) = ${poly(d1)}$, $f'(${ri}) = ${ev(d1, ri)}$\n$f''(x) = ${poly(d2)}$\n$f''(${ri}) = ${v}$ ${v > 0 ? "$> 0$" : "$< 0$"}, torej ${correct}.`,
          };
        }
        const y0 = ev(cs, x0);
        return {
          text: `Izračunaj ordinato prevoja funkcije $f(x) = ${poly(cs)}$.`,
          answer: num(y0, null, [
            { value: x0, why: "To je abscisa prevoja; izračunaj še vrednost funkcije v njej." },
            { value: ev(d1, x0), why: "To je naklon tangente v prevoju, ne ordinata." },
          ]),
          hint: "Najprej poišči ničlo drugega odvoda, nato izračunaj vrednost funkcije v njej.",
          data: { given: [`f(x) = ${poly(cs)}`], find: ["y_0"] },
          formula: ["f''(x_0) = 0", "y_0 = f(x_0)"],
          solution: `$f''(x) = ${poly(d2)} = 0 \\Rightarrow x_0 = ${x0}$\n$y_0 = f(${x0}) = ${y0}$`,
          zeroOk: true,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const u = r.int(-3, 1);
        const v = u + r.int(1, 3);
        const k = r.pick([1, -1]);
        const cs = [k, -2 * k * (u + v), 6 * k * u * v, r.int(-6, 6), r.int(-6, 6)];
        const d2 = der(der(cs));
        const yv = ev(cs, v);
        return {
          text: `Funkcija $f(x) = ${poly(cs)}$ ima dva prevoja. Izračunaj ordinato prevoja z večjo absciso.`,
          answer: num(yv, null, [
            { value: v, why: "To je abscisa prevoja; izračunaj še vrednost funkcije v njej." },
            { value: ev(cs, u), why: "To je prevoj z manjšo absciso." },
          ]),
          hint: "Ničli drugega odvoda sta abscisi prevojev; večjo vstavi v $f$.",
          data: { given: [`f(x) = ${poly(cs)}`], find: ["y_0"] },
          formula: ["f''(x_0) = 0", "y_0 = f(x_0)"],
          solution: `$f''(x) = ${poly(d2)} = ${k < 0 ? "-" : ""}12${lin(u)}${lin(v)}$\nNičli: $x = ${u}$ in $x = ${v}$, $f''$ v obeh zamenja predznak.\n$y_0 = f(${v}) = ${yv}$`,
          zeroOk: true,
        };
      }
      if (t === 1) {
        const x0 = r.nonZero(-3, 3);
        const kk = r.int(-6, 6);
        const c = r.nonZero(-5, 5);
        const a = -3 * x0;
        const b = kk + 3 * x0 * x0;
        return {
          text: `Funkcija $f(x) = x^3 + ax^2 + bx ${sg(c)}$ ima prevoj pri $x = ${x0}$, tangenta v prevoju pa ima smerni koeficient $${kk}$. Izračunaj $b$.`,
          answer: num(b, null, [
            { value: kk - 3 * x0 * x0, why: "Si pozabil člen $2a x_0$? Koeficient $a$ ni $0$; najprej ga izračunaj iz pogoja za prevoj." },
            { value: kk, why: "$f'(x_0)$ ni samo $b$: vsebuje tudi $3x_0^2 + 2a x_0$." },
            { value: kk - x0 * x0, why: "Iz $6x_0 + 2a = 0$ sledi $a = -3x_0$; preveri izražanje $a$." },
          ]),
          hint: "Iz $f''(x_0) = 0$ izračunaj $a$, nato uporabi $f'(x_0) = k$.",
          data: { given: [`x_0 = ${x0}`, `k = ${kk}`], find: ["b"] },
          formula: ["f''(x_0) = 0", "f'(x_0) = k"],
          solution: `$f''(x) = 6x + 2a$, $6 \\cdot ${pt(x0)} + 2a = 0 \\Rightarrow a = ${a}$\n$f'(x) = 3x^2 + 2ax + b$, $3 \\cdot ${pt(x0)}^2 + 2 \\cdot ${pt(a)} \\cdot ${pt(x0)} + b = ${kk}$\n$${3 * x0 * x0} ${sg(2 * a * x0)} + b = ${kk} \\Rightarrow b = ${b}$`,
        };
      }
      const k = r.pick([1, 1, 2]);
      const T0 = r.int(1, 5);
      const c = r.int(0, 10);
      const cs = [-k, 3 * k * T0, c, 0];
      const v = der(cs);
      const vmax = ev(v, T0);
      return {
        text: `Lega telesa, ki se giblje po premici, je $s(t) = ${poly(cs, "t")}$ ($s$ v metrih, $t$ v sekundah, $t \\ge 0$). Kolikšna je največja hitrost telesa? Vpiši število v m/s.`,
        answer: num(vmax, null, [
          { value: ev(cs, T0), why: "To je lega ob tem času, ne hitrost." },
          { value: c, why: "To je začetna hitrost; največja je takrat, ko je pospešek $0$." },
          { value: T0, why: "To je čas, ob katerem je hitrost največja; izračunaj še hitrost." },
        ]),
        hint: "Hitrost je $s'$, pospešek $s''$. Hitrost je največja, ko je pospešek enak $0$.",
        data: { given: [`s(t) = ${poly(cs, "t")}`], find: ["v_{\\max}"] },
        formula: ["v = s'(t)", "a = s''(t) = 0"],
        solution: `$v(t) = ${poly(v, "t")}$\n$a(t) = ${poly(der(v), "t")} = 0 \\Rightarrow t = ${T0}$ s (pospešek tu iz pozitivnega preide v negativnega)\n$v_{\\max} = v(${T0}) = ${vmax}$ m/s`,
      };
    },
  },

  // ================= per partes in racionalne funkcije =================
  {
    id: P + "integrali",
    topics: [T("integracija-per-partes-in-racionalnih-funkcij")],
    gen(level, r) {
      // razcep (px + q)/((x − a)(x − b)) = A/(x − a) + B/(x − b) s celimi A, B
      const pf = () => {
        const A = r.nonZero(-4, 4);
        const B = r.nonZero(-4, 4);
        const a = r.int(-4, 3);
        const b = a + r.int(1, 4);
        const p = A + B;
        const q = -(A * b + B * a);
        return { A, B, a, b, p, q, numTex: le(p, q) };
      };
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(-1, 1);
          const b = a + r.int(1, 2);
          const k = r.pick([1, 1, 2, 3]);
          const F = (x) => k * (x - 1) * Math.exp(x);
          const val = F(b) - F(a);
          const kT = k === 1 ? "" : k;
          return {
            text: `Izračunaj $\\displaystyle\\int_{${a}}^{${b}} ${kT}x\\,e^x\\,dx$. Zaokroži na tri decimalke.`,
            answer: num(val, 3, [
              { value: k * (b * Math.exp(b) - a * Math.exp(a)), why: "Si pozabil drugi del metode per partes, $-\\int u'\\,v\\,dx$?" },
              { value: k * ((b + 1) * Math.exp(b) - (a + 1) * Math.exp(a)), why: "Preveri predznak: $\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx$." },
              { value: k * ((b * b) / 2 * Math.exp(b) - (a * a) / 2 * Math.exp(a)), why: "Integral produkta ni produkt integralov." },
            ]),
            hint: "Izberi $u = x$ (z odvajanjem se poenostavi) in $v' = e^x$.",
            data: { given: [`a = ${a}`, `b = ${b}`], find: [`\\int_{${a}}^{${b}} ${kT}x\\,e^x\\,dx`] },
            formula: ["\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx", "\\int x\\,e^x\\,dx = (x - 1)e^x + C"],
            solution: `$u = x$, $v' = e^x$: $\\int x\\,e^x\\,dx = x\\,e^x - \\int e^x\\,dx = (x - 1)e^x + C$\n$${k === 1 ? "" : `${k} \\cdot `}\\Bigl[(x - 1)e^x\\Bigr]_{${a}}^{${b}} = ${k === 1 ? "" : `${k} \\cdot `}\\bigl(${tx(F(b) / k, 4)} - ${pt(tx(F(a) / k, 4))}\\bigr)$\n$${ap(val, 3)} ${tx(val, 3)}$`,
          };
        }
        if (t === 1) {
          const { A, B, a, b, p, q, numTex } = pf();
          const askA = r.next() < 0.5;
          const ans = askA ? A : B;
          const other = askA ? B : A;
          const rootV = askA ? a : b;
          return {
            text: `Razcepi na parcialne ulomke: $\\dfrac{${numTex}}{${lin(a)}${lin(b)}} = \\dfrac{A}{${xm(a)}} + \\dfrac{B}{${xm(b)}}$. Koliko je $${askA ? "A" : "B"}$?`,
            answer: num(ans, null, [
              { value: other, why: "To je koeficient pri drugem ulomku." },
              { value: -ans, why: "Preveri predznak vrednosti drugega faktorja v izbrani ničli." },
              { value: p * rootV + q, why: "Po vstavljanju ničle deli še z vrednostjo drugega faktorja." },
            ]),
            hint: "Enačbo pomnoži z imenovalcem in vstavi ničlo imenovalca, pri kateri en člen izgine.",
            data: { given: [`f(x) = \\dfrac{${numTex}}{${lin(a)}${lin(b)}}`], find: [askA ? "A" : "B"] },
            formula: `${numTex} = A${lin(b)} + B${lin(a)}`,
            solution: `$${numTex} = A${lin(b)} + B${lin(a)}$\nZa $x = ${a}$: $${p * a + q} = A \\cdot ${pt(a - b)}$, torej $A = ${A}$.\nZa $x = ${b}$: $${p * b + q} = B \\cdot ${pt(b - a)}$, torej $B = ${B}$.`,
          };
        }
        const SETS = [
          ["x\\,e^x", "(x - 1)e^x + C", [["(x + 1)e^x + C", "Odvajaj: dobiš $(x + 2)e^x$."], ["\\frac{x^2}{2}e^x + C", "Integral produkta ni produkt integralov."], ["x\\,e^x + C", "Odvod $x\\,e^x$ je $(x + 1)e^x$."]]],
          ["x\\cos x", "x\\sin x + \\cos x + C", [["x\\sin x - \\cos x + C", "Odvajaj: dobiš $x\\cos x + 2\\sin x$; preveri $\\int \\sin x\\,dx$."], ["\\frac{x^2}{2}\\sin x + C", "Integral produkta ni produkt integralov."], ["-x\\sin x - \\cos x + C", "Odvod je $-x\\cos x$: predznak je napačen."]]],
          ["x\\sin x", "-x\\cos x + \\sin x + C", [["x\\cos x - \\sin x + C", "Odvod je $-x\\sin x$: predznak je napačen."], ["-x\\cos x - \\sin x + C", "Odvajaj: dobiš $x\\sin x - 2\\cos x$; preveri $\\int \\cos x\\,dx$."], ["-\\frac{x^2}{2}\\cos x + C", "Integral produkta ni produkt integralov."]]],
          ["\\ln x", "x\\ln x - x + C", [["\\frac{1}{x} + C", "To je odvod $\\ln x$, ne integral."], ["x\\ln x + C", "Odvod $x\\ln x$ je $\\ln x + 1$; manjka še $-x$."], ["\\frac{\\ln^2 x}{2} + C", "To je integral funkcije $\\frac{\\ln x}{x}$."]]],
        ];
        const [f, ok, wr] = r.pick(SETS);
        return {
          text: `Katera funkcija je nedoločeni integral $\\displaystyle\\int ${f}\\,dx$?`,
          answer: pickAns(r, ok, wr),
          options_tex: true,
          hint: "Ponujene funkcije odvajaj in preveri, katera da integrand. Ali pa integriraj per partes.",
          data: { given: [`f(x) = ${f}`], find: ["\\int f(x)\\,dx"] },
          formula: "\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx",
          solution: `Per partes ${f === "\\ln x" ? "z $u = \\ln x$, $v' = 1$" : "z $u = x$"}: $\\int ${f}\\,dx = ${ok}$\nPreizkus z odvajanjem: $\\left(${ok.replace(" + C", "")}\\right)' = ${f}$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [n, d] = r.pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [1, 1]]);
          const c = (n * Math.PI) / d;
          const bT = d === 1 ? "\\pi" : `\\frac{${n === 1 ? "" : n}\\pi}{${d}}`;
          const cosv = r.next() < 0.5;
          const val = cosv ? c * Math.sin(c) + Math.cos(c) - 1 : -c * Math.cos(c) + Math.sin(c);
          const ms = cosv
            ? [
                { value: c * Math.sin(c), why: "Pozabil si drugi del: $-\\int \\sin x\\,dx = \\cos x$." },
                { value: c * Math.sin(c) - Math.cos(c) + 1, why: "Preveri predznak: $\\int \\sin x\\,dx = -\\cos x$." },
                { value: ((c * c) / 2) * Math.sin(c), why: "Integral produkta ni produkt integralov." },
              ]
            : [
                { value: -c * Math.cos(c), why: "Pozabil si člen $\\sin x$, ki pride iz $-\\int u'\\,v\\,dx$." },
                { value: -c * Math.cos(c) - Math.sin(c), why: "Preveri: $\\int \\cos x\\,dx = \\sin x$." },
                { value: ((c * c) / 2) * (1 - Math.cos(c)), why: "Integral produkta ni produkt integralov." },
              ];
          const F = cosv ? "x\\sin x + \\cos x" : "-x\\cos x + \\sin x";
          return {
            text: `Izračunaj $\\displaystyle\\int_0^{${bT}} x${cosv ? "\\cos" : "\\sin"} x\\,dx$. Zaokroži na tri decimalke.`,
            answer: num(val, 3, ms),
            hint: `Izberi $u = x$ in $v' = ${cosv ? "\\cos" : "\\sin"} x$.`,
            data: { given: [`a = 0`, `b = ${bT}`], find: [`\\int_0^{${bT}} x${cosv ? "\\cos" : "\\sin"} x\\,dx`] },
            formula: ["\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx"],
            solution: `$u = x$, $v = ${cosv ? "\\sin x" : "-\\cos x"}$: $\\int x${cosv ? "\\cos" : "\\sin"} x\\,dx = ${F} + C$\n$\\Bigl[${F}\\Bigr]_0^{${bT}} \\approx \\left(${tx(c, 4)} \\cdot ${tx(cosv ? Math.sin(c) : -Math.cos(c), 4)} ${sg(roundHalfUp(cosv ? Math.cos(c) : Math.sin(c), 4))}\\right) - ${cosv ? "1" : "0"}$\n$${ap(val, 3)} ${tx(val, 3)}$`,
          };
        }
        if (t === 1) {
          const bb = r.pick([2, 3, 4, 5, "e", "e^2"]);
          const b = bb === "e" ? Math.E : bb === "e^2" ? Math.E ** 2 : bb;
          const val = b * Math.log(b) - b + 1;
          return {
            text: `Izračunaj $\\displaystyle\\int_1^{${bb}} \\ln x\\,dx$. ${bb === "e" ? "Vpiši natančno vrednost." : "Zaokroži na tri decimalke."}`,
            answer: num(val, bb === "e" ? null : 3, [
              { value: 1 / b - 1, why: "Si $\\ln x$ odvajal namesto integriral?" },
              { value: b * Math.log(b) - b, why: "Ne pozabi odšteti vrednosti primitivne funkcije v spodnji meji $1$." },
              { value: b * Math.log(b), why: "Pri per partes manjka člen $-\\int x \\cdot \\frac{1}{x}\\,dx = -x$." },
            ]),
            hint: "Zapiši $\\ln x = \\ln x \\cdot 1$ in vzemi $u = \\ln x$, $v' = 1$.",
            data: { given: ["a = 1", `b = ${bb}`], find: [`\\int_1^{${bb}} \\ln x\\,dx`] },
            formula: ["\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx", "\\int \\ln x\\,dx = x\\ln x - x + C"],
            solution: `$\\int \\ln x\\,dx = x\\ln x - \\int x \\cdot \\dfrac{1}{x}\\,dx = x\\ln x - x + C$\n$\\Bigl[x\\ln x - x\\Bigr]_1^{${bb}} = ${pt(bb)}\\ln ${pt(bb)} - ${bb} - (1 \\cdot \\ln 1 - 1)$\n$${ap(val, 3)} ${tx(val, bb === "e" ? null : 3)}$`,
          };
        }
        const { A, B, a, b, p, q, numTex } = pf();
        const dTex = poly([1, -(a + b), a * b]);
        return {
          text: `Funkcijo razcepi na parcialne ulomke: $\\dfrac{${numTex}}{${dTex}} = \\dfrac{A}{x - x_1} + \\dfrac{B}{x - x_2}$, kjer sta $x_1 < x_2$ ničli imenovalca. Koliko je $B$?`,
          answer: num(B, null, [
            { value: A, why: "To je koeficient pri ulomku z manjšo ničlo." },
            { value: -B, why: "Preveri predznak: vstavi ničlo v $x - x_1$." },
            { value: p * b + q, why: "Po vstavljanju ničle deli še z vrednostjo drugega faktorja." },
          ]),
          hint: "Imenovalec najprej razcepi na linearna faktorja.",
          data: { given: [`f(x) = \\dfrac{${numTex}}{${dTex}}`], find: ["B"] },
          formula: ["\\dfrac{px + q}{(x - x_1)(x - x_2)} = \\dfrac{A}{x - x_1} + \\dfrac{B}{x - x_2}"],
          solution: `$${dTex} = ${lin(a)}${lin(b)}$, torej $x_1 = ${a}$, $x_2 = ${b}$\n$${numTex} = A${lin(b)} + B${lin(a)}$\nZa $x = ${b}$: $${p * b + q} = B \\cdot ${pt(b - a)}$, torej $B = ${B}$.`,
        };
      }
      // raven 3
      if (r.next() < 0.5) {
        const { A, B, a, b, numTex } = pf();
        let c;
        let d;
        if (r.next() < 0.5) {
          c = b + r.int(1, 2);
          d = c + r.int(1, 3);
        } else {
          d = a - r.int(1, 2);
          c = d - r.int(1, 3);
        }
        const L = (x0, x1, z) => Math.log(Math.abs((x1 - z) / (x0 - z)));
        const val = A * L(c, d, a) + B * L(c, d, b);
        if (Math.abs(val) < 0.0005) return null;
        return {
          text: `Izračunaj $\\displaystyle\\int_{${c}}^{${d}} \\dfrac{${numTex}}{${lin(a)}${lin(b)}}\\,dx$. Zaokroži na tri decimalke.`,
          answer: num(val, 3, [
            { value: A * L(c, d, a), why: "Ne pozabi drugega parcialnega ulomka." },
            { value: A * Math.log(Math.abs(d - a)) + B * Math.log(Math.abs(d - b)), why: "Odšteti moraš še vrednost primitivne funkcije v spodnji meji." },
            { value: A * L(c, d, a) - B * L(c, d, b), why: "Preveri predznak koeficienta $B$." },
          ]),
          hint: "Najprej razcepi na parcialne ulomke, nato vsak ulomek integriraj v naravni logaritem.",
          data: { given: [`a = ${c}`, `b = ${d}`], find: ["\\int f(x)\\,dx"] },
          formula: ["\\int \\dfrac{k}{x - a}\\,dx = k\\ln\\lvert x - a\\rvert + C"],
          solution: `Razcep: $\\dfrac{${numTex}}{${lin(a)}${lin(b)}} = \\dfrac{${A}}{${xm(a)}} + \\dfrac{${B}}{${xm(b)}}$\nPrimitivna funkcija: $${A}\\ln\\lvert ${xm(a)} \\rvert ${sg(B)}\\ln\\lvert ${xm(b)} \\rvert$\n$${A}\\ln\\dfrac{${Math.abs(d - a)}}{${Math.abs(c - a)}} ${sg(B)}\\ln\\dfrac{${Math.abs(d - b)}}{${Math.abs(c - b)}} ${ap(val, 3)} ${tx(val, 3)}$`,
        };
      }
      if (r.next() < 0.5) {
        const b = r.int(1, 3);
        const val = (b * b - 2 * b + 2) * Math.exp(b) - 2;
        return {
          text: `Izračunaj $\\displaystyle\\int_0^{${b}} x^2 e^x\\,dx$. Zaokroži na tri decimalke.`,
          answer: num(val, 3, [
            { value: (b * b - 2 * b) * Math.exp(b), why: "Pri drugem per partes ne pozabi člena $-\\int 2e^x\\,dx$." },
            { value: (b * b + 2 * b - 2) * Math.exp(b) + 2, why: "Preveri predznak: per partes je $u\\,v - \\int u'\\,v\\,dx$." },
            { value: ((b ** 3) / 3) * Math.exp(b), why: "Integral produkta ni produkt integralov." },
          ]),
          hint: "Per partes uporabi dvakrat: najprej $u = x^2$, nato še $u = x$.",
          data: { given: ["a = 0", `b = ${b}`], find: [`\\int_0^{${b}} x^2 e^x\\,dx`] },
          formula: ["\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx", "\\int x\\,e^x\\,dx = (x - 1)e^x + C"],
          solution: `$\\int x^2 e^x\\,dx = x^2 e^x - 2\\int x\\,e^x\\,dx = x^2 e^x - 2(x - 1)e^x + C = (x^2 - 2x + 2)e^x + C$\n$\\Bigl[(x^2 - 2x + 2)e^x\\Bigr]_0^{${b}} = ${b === 1 ? "e" : `${b * b - 2 * b + 2}e^{${b}}`} - 2$\n$${ap(val, 3)} ${tx(val, 3)}$`,
        };
      }
      const bb = r.pick([2, 3, 4, "e"]);
      const b = bb === "e" ? Math.E : bb;
      const val = ((b * b) / 2) * Math.log(b) - (b * b) / 4 + 1 / 4;
      return {
        text: `Izračunaj $\\displaystyle\\int_1^{${bb}} x\\ln x\\,dx$. Zaokroži na tri decimalke.`,
        answer: num(val, 3, [
          { value: ((b * b) / 2) * Math.log(b), why: "Ne pozabi odšteti $\\int \\frac{x^2}{2} \\cdot \\frac{1}{x}\\,dx = \\frac{x^2}{4}$." },
          { value: ((b * b) / 2) * Math.log(b) - (b * b) / 4, why: "Ne pozabi vrednosti v spodnji meji: $F(1) = -\\frac{1}{4}$." },
          { value: (b * Math.log(b) - b + 1) * ((b * b - 1) / 2), why: "Integral produkta ni produkt integralov." },
        ]),
        hint: "Vzemi $u = \\ln x$ (z odvajanjem se poenostavi) in $v' = x$.",
        data: { given: ["a = 1", `b = ${bb}`], find: [`\\int_1^{${bb}} x\\ln x\\,dx`] },
        formula: ["\\int u\\,v'\\,dx = u\\,v - \\int u'\\,v\\,dx"],
        solution: `$u = \\ln x$, $v = \\dfrac{x^2}{2}$: $\\int x\\ln x\\,dx = \\dfrac{x^2}{2}\\ln x - \\int \\dfrac{x}{2}\\,dx = \\dfrac{x^2}{2}\\ln x - \\dfrac{x^2}{4} + C$\n$\\Bigl[\\dfrac{x^2}{2}\\ln x - \\dfrac{x^2}{4}\\Bigr]_1^{${bb}} = \\dfrac{${bb === "e" ? "e^2" : b * b}}{2}\\ln ${bb} - \\dfrac{${bb === "e" ? "e^2" : b * b}}{4} + \\dfrac{1}{4}$\n$${ap(val, 3)} ${tx(val, 3)}$`,
      };
    },
  },

  // ================= binomski izrek =================
  {
    id: P + "binomski-izrek",
    topics: [T("binomski-izrek")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.int(5, 14);
          const k = r.int(2, n - 2);
          const v = C(n, k);
          return {
            text: `Izračunaj binomski simbol $\\dbinom{${n}}{${k}}$.`,
            answer: num(v, null, [
              { value: V(n, k), why: "Si pozabil deliti s $k!$? To je število variacij." },
              { value: fact(n) / fact(k), why: "V imenovalcu sta $k!$ in $(n - k)!$." },
              { value: C(n, k - 1), why: "Si vzel sosednje število v vrstici Pascalovega trikotnika?" },
            ]),
            hint: "Uporabi $\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}$ in pred množenjem krajšaj.",
            data: { given: [`n = ${n}`, `k = ${k}`], find: [`\\binom{${n}}{${k}}`] },
            formula: "\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n - k)!}",
            solution: `$\\dbinom{${n}}{${k}} = \\dfrac{${n}!}{${k}! \\cdot ${n - k}!}$\n$\\dbinom{${n}}{${k}} = ${v}$`,
          };
        }
        if (t === 1) {
          const a = r.nonZero(-3, 3);
          const b = r.nonZero(-5, 5);
          const n = r.int(4, 15);
          const sq = r.next() < 0.4;
          const base = sq ? `${tm(a, "x^2", true)} ${sg(b)}` : le(a, b);
          return {
            text: `Koliko členov ima razvoj $(${base})^{${n}}$ po binomskem izreku?`,
            answer: num(n + 1, null, [{ value: n, why: "Eksponenti pri prvem členu gredo od $n$ do $0$: to je $n + 1$ vrednosti." }, ...(sq ? [{ value: 2 * n + 1, why: "Število členov je odvisno le od eksponenta binoma, ne od potence pri $x$." }] : [])]),
            hint: "V razvoju $(a + b)^n$ eksponent pri $a$ pada od $n$ do $0$.",
            data: { given: [`n = ${n}`], find: ["\\text{število členov}"] },
            formula: "(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
            solution: `Členi ustrezajo $k = 0, 1, \\dots, ${n}$.\nŠtevilo členov: $${n} + 1 = ${n + 1}$`,
          };
        }
        const n = r.int(5, 12);
        return {
          text: `Koliko je vsota vseh števil v vrstici $${n}$ Pascalovega trikotnika (vrstice štejemo od $0$)?`,
          answer: num(2 ** n, null, [
            { value: 2 * n, why: "Vsota vrstice se z vsako vrstico podvoji, ne poveča za $2$." },
            { value: n * n, why: "Vsota vrstice $n$ je potenca števila $2$." },
            { value: 2 ** (n + 1), why: "Vrstice štejemo od $0$: vrstica $0$ ima vsoto $1$." },
          ]),
          hint: "V razvoj $(a + b)^n$ vstavi $a = b = 1$.",
          data: { given: [`n = ${n}`], find: ["\\text{vsota}"] },
          formula: "\\binom{n}{0} + \\binom{n}{1} + \\dots + \\binom{n}{n} = 2^n",
          solution: `$(1 + 1)^{${n}} = \\dbinom{${n}}{0} + \\dbinom{${n}}{1} + \\dots + \\dbinom{${n}}{${n}}$\nVsota je $2^{${n}} = ${2 ** n}$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.int(4, 8);
          const a = r.pick([1, 2, 3, -1, -2]);
          const b = r.nonZero(-3, 3);
          const k = r.int(1, n - 1);
          const v = C(n, k) * a ** k * b ** (n - k);
          if (Math.abs(v) > 200000) return null;
          return {
            text: `Kolikšen je koeficient pri $${xp(k)}$ v razvoju $(${le(a, b)})^{${n}}$?`,
            answer: num(v, null, [
              { value: a < 0 || b < 0 ? -v : NaN, why: "Pazi na predznak: negativno število na liho potenco je negativno." },
              { value: C(n, k), why: "Pozabil si potencirati števili v binomu." },
              { value: C(n, k) * a ** (n - k) * b ** k, why: "Zamenjal si eksponenta: ob $x^k$ je tudi število pred $x$ na $k$-to potenco." },
            ]),
            hint: `Splošni člen je $\\binom{n}{k}(ax)^k b^{n-k}$. Za $${xp(k)}$ potrebuješ $k = ${k}$.`,
            data: { given: [`p(x) = (${le(a, b)})^{${n}}`, `k = ${k}`], find: [`\\text{koeficient pri } ${xp(k)}`] },
            formula: "(ax + b)^n = \\sum_{k=0}^{n} \\binom{n}{k}(ax)^k b^{n-k}",
            solution: `Člen z $${xp(k)}$: $\\dbinom{${n}}{${k}}(${a === 1 ? "" : a === -1 ? "-" : a}x)^{${k}} \\cdot ${pt(b)}^{${n - k}}$\nKoeficient: $${C(n, k)} \\cdot ${pt(a ** k)} \\cdot ${pt(b ** (n - k))} = ${v}$`,
          };
        }
        if (t === 1) {
          let a;
          let b;
          do {
            a = r.nonZero(-3, 4);
            b = r.nonZero(-4, 4);
          } while (Math.abs(a + b) < 2 || Math.abs(a + b) > 5);
          const n = r.int(3, 7);
          const sq = r.next() < 0.4;
          const base = sq ? `${tm(a, "x^2", true)} ${sg(b)}` : le(a, b);
          const v = (a + b) ** n;
          return {
            text: `Kolikšna je vsota vseh koeficientov v razvoju $(${base})^{${n}}$?`,
            answer: num(v, null, [
              { value: a ** n + b ** n, why: "Vsota koeficientov ni vsota potenc krajnih členov; vstavi $x = 1$." },
              { value: 2 ** n, why: "To je vsota binomskih simbolov; upoštevaj še števili v binomu." },
              { value: (Math.abs(a) + Math.abs(b)) ** n, why: "Pri $x = 1$ upoštevaj predznake." },
            ]),
            hint: "Vsoto koeficientov polinoma dobiš, ko vanj vstaviš $x = 1$.",
            data: { given: [`p(x) = (${base})^{${n}}`], find: ["p(1)"] },
            formula: "\\text{vsota koeficientov} = p(1)",
            solution: `$p(1) = (${a} ${sg(b)})^{${n}} = ${pt(a + b)}^{${n}}$\n$p(1) = ${v}$`,
          };
        }
        const n = r.int(5, 10);
        const c = r.nonZero(-3, 3);
        const j = r.int(2, Math.min(n, 6));
        const v = C(n, j - 1) * c ** (j - 1);
        return {
          text: `Kolikšen je koeficient ${j}. člena v razvoju $(x ${sg(c)})^{${n}}$, če člene urejamo po padajočih potencah $x$?`,
          answer: num(v, null, [
            { value: C(n, j) * c ** j, why: "Člen $T_{k+1}$ ima binomski simbol $\\binom{n}{k}$: pri $j$-tem členu je $k = j - 1$." },
            { value: C(n, j - 1), why: "Ne pozabi potencirati števila v binomu." },
            { value: c < 0 ? -v : NaN, why: "Pazi na predznak potence negativnega števila." },
          ]),
          hint: "Splošni člen je $T_{k+1} = \\binom{n}{k}x^{n-k}c^k$.",
          data: { given: [`p(x) = (x ${sg(c)})^{${n}}`, `j = ${j}`], find: [`\\text{koeficient } T_{${j}}`] },
          formula: "T_{k+1} = \\dbinom{n}{k} a^{n-k} b^k",
          solution: `$k = ${j} - 1 = ${j - 1}$\n$T_{${j}} = \\dbinom{${n}}{${j - 1}} x^{${n - j + 1}} \\cdot ${pt(c)}^{${j - 1}}$\nKoeficient: $${C(n, j - 1)} \\cdot ${pt(c ** (j - 1))} = ${v}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [p, q] = r.pick([[1, 1], [2, 1], [1, 2]]);
        let n;
        if (p === q) n = 2 * r.int(2, 5);
        else n = 3 * r.int(1, 3);
        const k = (p * n) / (p + q);
        const c = r.nonZero(-3, 3);
        const v = C(n, k) * c ** k;
        if (Math.abs(v) > 200000) return null;
        const ptx = (e) => (e === 1 ? "x" : `x^${e}`);
        const base = `${ptx(p)} ${c < 0 ? "-" : "+"} \\dfrac{${Math.abs(c)}}{${ptx(q)}}`;
        return {
          text: `Izračunaj člen brez $x$ v razvoju $\\left(${base}\\right)^{${n}}$.`,
          answer: num(v, null, [
            { value: C(n, k), why: "Pozabil si potencirati število v drugem členu binoma." },
            { value: C(n, k) * c ** (n - k), why: "Število je v drugem členu binoma, zato ima eksponent $k$, ne $n - k$." },
            { value: p !== q && n % 2 === 0 ? C(n, n / 2) * c ** (n / 2) : c < 0 ? -v : NaN, why: p !== q && n % 2 === 0 ? "Člen brez $x$ ni nujno srednji člen; izenači eksponent pri $x$ z $0$." : "Pazi na predznak potence negativnega števila." },
          ]),
          hint: "Zapiši splošni člen, združi potence $x$ in eksponent izenači z $0$.",
          data: { given: [`p(x) = \\left(${base}\\right)^{${n}}`], find: ["T_{k+1} \\text{ brez } x"] },
          formula: "T_{k+1} = \\dbinom{n}{k} a^{n-k} b^k",
          solution: `$T_{k+1} = \\dbinom{${n}}{k}(${ptx(p)})^{${n} - k}\\left(\\dfrac{${c}}{${ptx(q)}}\\right)^k$, eksponent pri $x$: $${p === 1 ? "" : p}(${n} - k) - ${q === 1 ? "" : q}k$\n$${p === 1 ? "" : p}(${n} - k) - ${q === 1 ? "" : q}k = 0 \\Rightarrow k = ${k}$\n$T_{${k + 1}} = \\dbinom{${n}}{${k}} \\cdot ${pt(c)}^{${k}} = ${C(n, k)} \\cdot ${pt(c ** k)} = ${v}$`,
        };
      }
      if (t === 1) {
        const n = r.int(4, 12);
        const a = r.pick([2, 3, -2, -3]);
        const s = n * a;
        const tt = C(n, 2) * a * a;
        return {
          text: `V razvoju $(1 + ax)^n$ je koeficient pri $x$ enak $${s}$, koeficient pri $x^2$ pa $${tt}$. Izračunaj $n$.`,
          answer: num(n, null, [
            { value: s, why: "Koeficient pri $x$ je $n \\cdot a$, ne $n$." },
            { value: (2 * tt) / s, why: "To je vrednost $(n - 1)a$; izračunaj še $a$ in nato $n$." },
          ]),
          hint: "Zapiši obe enačbi: $na = \\dots$ in $\\binom{n}{2}a^2 = \\dots$, nato drugo deli s prvo.",
          data: { given: [`na = ${s}`, `\\dbinom{n}{2}a^2 = ${tt}`], find: ["n"] },
          formula: "(1 + ax)^n = 1 + \\dbinom{n}{1}ax + \\dbinom{n}{2}a^2x^2 + \\dots",
          solution: `$na = ${s}$ in $\\dfrac{n(n - 1)}{2}a^2 = ${tt}$\nDrugo enačbo delimo s prvo: $\\dfrac{(n - 1)a}{2} = \\dfrac{${tt}}{${s}}$, torej $(n - 1)a = ${(2 * tt) / s}$\n$a = na - (n - 1)a = ${s} - ${pt((2 * tt) / s)} = ${a}$\n$n = \\dfrac{${s}}{${a}} = ${n}$`,
        };
      }
      const n = r.int(4, 8);
      const c = r.nonZero(-3, 3);
      const kMax = Math.floor((2 * n - 1) / 3);
      const k = r.int(1, kMax);
      const m = 2 * n - 3 * k;
      const v = C(n, k) * c ** k;
      if (Math.abs(v) > 200000) return null;
      return {
        text: `Kolikšen je koeficient pri $${xp(m)}$ v razvoju $\\left(x^2 ${c < 0 ? "-" : "+"} \\dfrac{${Math.abs(c)}}{x}\\right)^{${n}}$?`,
        answer: num(v, null, [
          { value: C(n, k), why: "Pozabil si potencirati število v drugem členu binoma." },
          { value: C(n, k) * c ** (n - k), why: "Število je v drugem členu binoma, zato ima eksponent $k$." },
          { value: c < 0 ? -v : NaN, why: "Pazi na predznak potence negativnega števila." },
        ]),
        hint: "V splošnem členu je potenca $x$ enaka $2(n - k) - k$. Izenači jo z iskanim eksponentom.",
        data: { given: [`p(x) = \\left(x^2 ${c < 0 ? "-" : "+"} \\dfrac{${Math.abs(c)}}{x}\\right)^{${n}}`, `m = ${m}`], find: [`\\text{koeficient pri } ${xp(m)}`] },
        formula: "T_{k+1} = \\dbinom{n}{k}(x^2)^{n-k}\\left(\\dfrac{c}{x}\\right)^k",
        solution: `Eksponent pri $x$: $2(${n} - k) - k = ${2 * n} - 3k$\n$${2 * n} - 3k = ${m} \\Rightarrow k = ${k}$\nKoeficient: $\\dbinom{${n}}{${k}} \\cdot ${pt(c)}^{${k}} = ${C(n, k)} \\cdot ${pt(c ** k)} = ${v}$`,
      };
    },
  },

  // ================= zaporedje neodvisnih poskusov =================
  {
    id: P + "bernoulli",
    topics: [T("zaporedje-neodvisnih-poskusov")],
    gen(level, r) {
      const nm = name(r);
      const ctx = r.pick(BER);
      const story = (p, n) => `${ctx.intro(tx(p), nm)} ${ctx.act(n, nm)}`;
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.pick(ctx.ps);
          const n = r.int(3, 6);
          const k = r.int(1, n - 1);
          const val = Pn(n, k, p);
          if (val < 0.0005) return null;
          return {
            text: `${story(p, n)} Kolikšna je verjetnost, da bo število ${ctx.what} natanko $${k}$? Zaokroži na štiri decimalke.`,
            answer: num(val, 4, [
              { value: p ** k * (1 - p) ** (n - k), why: "To je verjetnost enega samega poteka; pomnoži še s številom potekov $\\binom{n}{k}$." },
              { value: C(n, k) * p ** k, why: "Manjka verjetnost neuspehov $q^{n-k}$." },
              { value: C(n, k) * p ** (n - k) * (1 - p) ** k, why: "Si zamenjal $p$ in $q$? Eksponent $k$ pripada verjetnosti uspeha." },
            ]),
            hint: "Uporabi Bernoullijevo formulo. Najprej zapiši $n$, $k$, $p$ in $q = 1 - p$.",
            data: { given: [`n = ${n}`, `k = ${k}`, `p = ${tx(p)}`], find: [`P_{${n}}(${k})`] },
            formula: "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}",
            solution: `$q = 1 - ${tx(p)} = ${tx(1 - p)}$\n$P_{${n}}(${k}) = \\dbinom{${n}}{${k}} \\cdot ${tx(p)}^{${k}} \\cdot ${tx(1 - p)}^{${n - k}} = ${C(n, k)} \\cdot ${txr(p ** k, 6)} \\cdot ${txr((1 - p) ** (n - k), 6)}$\n$P_{${n}}(${k}) ${ap(val, 4)} ${tx(val, 4)}$`,
          };
        }
        if (t === 1) {
          const p = r.pick(ctx.ps);
          const n = r.int(3, 8);
          const val = 1 - (1 - p) ** n;
          if (val > 0.9995) return null;
          return {
            text: `${story(p, n)} Kolikšna je verjetnost, da bo število ${ctx.what} vsaj $1$? Zaokroži na štiri decimalke.`,
            answer: num(val, 4, [
              { value: n * p, why: "Verjetnosti neodvisnih poskusov ne smeš kar seštevati." },
              { value: (1 - p) ** n, why: "To je verjetnost, da ni nobenega uspeha; odštej jo od $1$." },
              { value: 1 - p ** n, why: "Nasprotni dogodek dogodka »vsaj en« je »nobeden«, ne »vsi«." },
            ]),
            hint: "Uporabi nasprotni dogodek: nobenega uspeha.",
            data: { given: [`n = ${n}`, `p = ${tx(p)}`], find: ["P(X \\ge 1)"] },
            formula: "P(X \\ge 1) = 1 - q^n",
            solution: `$q = ${tx(1 - p)}$\n$P(X = 0) = ${tx(1 - p)}^{${n}} ${ap((1 - p) ** n, 6)} ${txr((1 - p) ** n, 6)}$\n$P(X \\ge 1) = 1 - ${txr((1 - p) ** n, 6)} ${ap(val, 4)} ${tx(val, 4)}$`,
          };
        }
        if (r.next() < 0.5) {
          const n = r.int(2, 4);
          const k = r.int(1, n);
          return {
            text: `Pošteno igralno kocko vržemo $${n}$-krat. Kolikšna je verjetnost, da šestica pade natanko $${k}$-krat? Vpiši okrajšan ulomek.`,
            answer: frA(C(n, k) * 5 ** (n - k), 6 ** n, [
              { value: C(n, k) / 6 ** n, why: "Manjka verjetnost, da v ostalih metih šestica ne pade: $\\left(\\frac{5}{6}\\right)^{n-k}$." },
              { value: 5 ** (n - k) / 6 ** n, why: "Manjka binomski simbol: šestice lahko padejo v različnih metih." },
              { value: k / 6, why: "Verjetnosti ne smeš seštevati; uporabi Bernoullijevo formulo." },
            ]),
            hint: "Uspeh je šestica, $p = \\frac{1}{6}$, $q = \\frac{5}{6}$.",
            data: { given: [`n = ${n}`, `k = ${k}`], find: [`P_{${n}}(${k})`] },
            formula: "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}",
            solution: `$P_{${n}}(${k}) = \\dbinom{${n}}{${k}}\\left(\\dfrac{1}{6}\\right)^{${k}}\\left(\\dfrac{5}{6}\\right)^{${n - k}}$\n$P_{${n}}(${k}) = \\dfrac{${C(n, k)} \\cdot ${5 ** (n - k)}}{${6 ** n}} = ${ft(C(n, k) * 5 ** (n - k), 6 ** n)}$`,
          };
        }
        const n = r.int(3, 8);
        const k = r.int(1, n - 1);
        return {
          text: `Pošten kovanec vržemo $${n}$-krat. Kolikšna je verjetnost, da grb pade natanko $${k}$-krat? Vpiši okrajšan ulomek.`,
          answer: frA(C(n, k), 2 ** n, [
            { value: 1 / 2 ** n, why: "To je verjetnost enega poteka; pomnoži še z $\\binom{n}{k}$." },
            { value: k / n, why: "To je delež grbov, ne verjetnost." },
          ]),
          hint: "Pri kovancu je $p = q = \\frac{1}{2}$, zato je vsak potek enako verjeten.",
          data: { given: [`n = ${n}`, `k = ${k}`], find: [`P_{${n}}(${k})`] },
          formula: "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}",
          solution: `$P_{${n}}(${k}) = \\dbinom{${n}}{${k}}\\left(\\dfrac{1}{2}\\right)^{${n}} = \\dfrac{${C(n, k)}}{${2 ** n}}$\n$P_{${n}}(${k}) = ${ft(C(n, k), 2 ** n)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.pick(ctx.ps);
          const n = r.int(5, 8);
          const k = r.int(1, 2);
          const terms = Array.from({ length: k + 1 }, (_, j) => Pn(n, j, p));
          const val = terms.reduce((s, x) => s + x, 0);
          if (val < 0.0005 || val > 0.9995) return null;
          return {
            text: `${story(p, n)} Kolikšna je verjetnost, da bo število ${ctx.what} največ $${k}$? Zaokroži na štiri decimalke.`,
            answer: num(val, 4, [
              { value: Pn(n, k, p), why: "»Največ« vključuje tudi manjše vrednosti: seštej $P_n(0)$ do $P_n(k)$." },
              { value: val - Pn(n, k, p), why: "»Največ $k$« vključuje tudi natanko $k$." },
              { value: 1 - val, why: "To je verjetnost nasprotnega dogodka (več kot $k$)." },
            ]),
            hint: `Seštej verjetnosti za $0$ do $${k}$ uspehov.`,
            data: { given: [`n = ${n}`, `p = ${tx(p)}`, `k = ${k}`], find: [`P(X \\le ${k})`] },
            formula: "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}",
            solution: `${terms.map((x, j) => `$P_{${n}}(${j}) ${ap(x, 6)} ${txr(x, 6)}$`).join(", ")}\n$P(X \\le ${k}) ${ap(val, 4)} ${tx(val, 4)}$`,
          };
        }
        if (t === 1) {
          const p = r.pick(ctx.ps);
          const n = r.int(5, 12);
          if (Math.abs((n + 1) * p - Math.round((n + 1) * p)) < 1e-9) return null;
          const ps = Array.from({ length: n + 1 }, (_, j) => Pn(n, j, p));
          const mode = ps.indexOf(Math.max(...ps));
          const nb = [mode - 1, mode, mode + 1].filter((j) => j >= 0 && j <= n);
          return {
            text: `${story(p, n)} Katero število ${ctx.what} je najverjetnejše?`,
            answer: num(mode, null, [
              { value: n - mode, why: "Si štel neuspehe namesto uspehov?" },
              { value: Math.round(n * p), why: "Najverjetnejše število ni nujno zaokroženi $n \\cdot p$; primerjaj sosednje verjetnosti." },
            ]),
            hint: "Začni pri $k$ blizu $n \\cdot p$ in primerjaj $P_n(k)$ s sosednjima verjetnostma.",
            data: { given: [`n = ${n}`, `p = ${tx(p)}`], find: ["k \\text{ z največjo } P_n(k)"] },
            formula: "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}",
            solution: `$n \\cdot p = ${tx(n * p)}$, zato primerjamo verjetnosti blizu tega števila.\n${nb.map((j) => `$P_{${n}}(${j}) ${ap(ps[j], 4)} ${tx(ps[j], 4)}$`).join(", ")}\nNajvečja je pri $k = ${mode}$.`,
            zeroOk: true,
          };
        }
        const n = r.int(2, 5);
        return {
          text: `${nm} $${n}$-krat vrže pošteno igralno kocko. Kolikšna je verjetnost, da vsaj enkrat pade šestica? Vpiši okrajšan ulomek.`,
          answer: frA(6 ** n - 5 ** n, 6 ** n, [
            { value: n / 6, why: "Verjetnosti ne smeš seštevati: pri šestih metih bi dobil $1$." },
            { value: 5 ** n / 6 ** n, why: "To je verjetnost, da šestica ne pade nikoli; odštej jo od $1$." },
            { value: 1 / 6 ** n, why: "To je verjetnost, da pade šestica v vsakem metu." },
          ]),
          hint: "Uporabi nasprotni dogodek: šestica ne pade nikoli.",
          data: { given: [`n = ${n}`], find: ["P(X \\ge 1)"] },
          formula: "P(X \\ge 1) = 1 - q^n",
          solution: `$P(X = 0) = \\left(\\dfrac{5}{6}\\right)^{${n}} = \\dfrac{${5 ** n}}{${6 ** n}}$\n$P(X \\ge 1) = 1 - \\dfrac{${5 ** n}}{${6 ** n}} = ${ft(6 ** n - 5 ** n, 6 ** n)}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const p = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]);
        const Pm = r.pick([0.9, 0.95, 0.99]);
        let n = 1;
        while (1 - (1 - p) ** n <= Pm) n++;
        if (Math.abs(1 - (1 - p) ** n - Pm) < 1e-9 || Math.abs(1 - (1 - p) ** (n - 1) - Pm) < 1e-9) return null;
        const c2 = r.int(0, 1);
        const text =
          c2 === 0
            ? `Srečka na šolskem srečelovu zadene z verjetnostjo $${tx(p)}$, neodvisno od drugih srečk. Najmanj koliko srečk mora ${nm} kupiti, da bo verjetnost vsaj enega dobitka večja od $${tx(Pm)}$?`
            : `Pri enem metu trnka ribič ujame ribo z verjetnostjo $${tx(p)}$, meti so neodvisni. Najmanj kolikokrat mora vreči trnek, da bo verjetnost vsaj enega ulova večja od $${tx(Pm)}$?`;
        const lg = Math.log(1 - Pm) / Math.log(1 - p);
        return {
          text,
          answer: num(n, null, [
            { value: n - 1, why: "Pri tem številu poskusov je verjetnost še premajhna; rešitev neenačbe zaokroži navzgor." },
            { value: Math.ceil(Pm / p), why: "Verjetnosti »vsaj enega« ne dobiš s seštevanjem $p$; uporabi $1 - q^n$." },
          ]),
          hint: "Zapiši neenačbo $1 - q^n > P$ in jo reši z logaritmiranjem. Pazi na smer neenačbe.",
          data: { given: [`p = ${tx(p)}`, `P = ${tx(Pm)}`], find: ["n"] },
          formula: ["1 - q^n > P", "n > \\dfrac{\\log(1 - P)}{\\log q}"],
          solution: `$q = ${tx(1 - p)}$; $${tx(1 - p)}^n < ${tx(1 - Pm)}$\n$n > \\dfrac{\\log ${tx(1 - Pm)}}{\\log ${tx(1 - p)}} \\approx ${tx(lg, 2)}$ (deljenje z negativnim $\\log q$ obrne neenačbo)\nNajmanjši tak $n$ je $${n}$.`,
        };
      }
      if (t === 1) {
        const p = r.pick(ctx.ps);
        const n = r.int(4, 8);
        const q = 1 - p;
        const p0 = q ** n;
        const p1 = n * p * q ** (n - 1);
        const val = 1 - p0 - p1;
        if (val < 0.0005 || val > 0.9995) return null;
        return {
          text: `${story(p, n)} Kolikšna je verjetnost, da bo število ${ctx.what} vsaj $2$? Zaokroži na štiri decimalke.`,
          answer: num(val, 4, [
            { value: 1 - p0, why: "Od $1$ moraš odšteti tudi verjetnost natanko enega uspeha." },
            { value: Pn(n, 2, p), why: "»Vsaj $2$« vključuje tudi več kot $2$ uspeha." },
            { value: 1 - p0 - p * q ** (n - 1), why: "$P_n(1)$ vsebuje binomski simbol $\\binom{n}{1} = n$." },
          ]),
          hint: "Uporabi nasprotni dogodek: $0$ ali $1$ uspeh.",
          data: { given: [`n = ${n}`, `p = ${tx(p)}`], find: ["P(X \\ge 2)"] },
          formula: ["P(X \\ge 2) = 1 - P_n(0) - P_n(1)", "P_n(k) = \\dbinom{n}{k} p^k q^{n-k}"],
          solution: `$P_{${n}}(0) = ${tx(q)}^{${n}} ${ap(p0, 6)} ${txr(p0, 6)}$\n$P_{${n}}(1) = ${n} \\cdot ${tx(p)} \\cdot ${tx(q)}^{${n - 1}} ${ap(p1, 6)} ${txr(p1, 6)}$\n$P(X \\ge 2) = 1 - ${txr(p0, 6)} - ${txr(p1, 6)} ${ap(val, 4)} ${tx(val, 4)}$`,
        };
      }
      const n = r.int(5, 10);
      const m = r.int(3, 5);
      const p = 1 / m;
      const kmin = r.int(2, Math.ceil(n / 2));
      const terms = [];
      for (let j = kmin; j <= n; j++) terms.push(Pn(n, j, p));
      const val = terms.reduce((s, x) => s + x, 0);
      if (val < 0.0005) return null;
      return {
        text: `Test ima $${n}$ vprašanj, vsako s $${m}$ ponujenimi odgovori, od katerih je pravilen natanko eden. ${nm} vse odgovore ugiba. Kolikšna je verjetnost, da ${g(nm, "bo pravilno odgovoril", "bo pravilno odgovorila")} na vsaj $${kmin}$ vprašanj? Zaokroži na štiri decimalke.`,
        answer: num(val, 4, [
          { value: Pn(n, kmin, p), why: "»Vsaj« pomeni: seštej vse verjetnosti od $k$ do $n$." },
          { value: val - Pn(n, kmin, p), why: "»Vsaj $k$« vključuje tudi natanko $k$." },
          { value: 1 - val, why: "To je verjetnost nasprotnega dogodka (manj kot $k$ pravilnih)." },
        ]),
        hint: `Uspeh je pravilen odgovor, $p = \\frac{1}{${m}}$. Razmisli, ali je krajša pot neposredna vsota ali nasprotni dogodek.`,
        data: { given: [`n = ${n}`, `m = ${m}`, `k = ${kmin}`], find: [`P(X \\ge ${kmin})`] },
        formula: ["P_n(k) = \\dbinom{n}{k} p^k q^{n-k}", "P(X \\ge k) = 1 - P(X \\le k - 1)"],
        solution: `$p = ${ft(1, m)}$, $q = ${ft(m - 1, m)}$\n$P(X \\le ${kmin - 1}) = ${Array.from({ length: kmin }, (_, j) => `P_{${n}}(${j})`).join(" + ")} ${ap(1 - val, 6)} ${txr(1 - val, 6)}$\n$P(X \\ge ${kmin}) = 1 - ${txr(1 - val, 6)} ${ap(val, 4)} ${tx(val, 4)}$`,
      };
    },
  },

  // ================= statistična naloga =================
  {
    id: P + "statisticna-naloga",
    topics: [T("statisticna-naloga")],
    gen(level, r) {
      const nm = name(r);
      const SAMPLES = [
        { what: "število prebranih knjig v zadnjem letu", lo: 0, hi: 15, unit: "" },
        { what: "čas poti v šolo v minutah", lo: 5, hi: 45, unit: "min" },
        { what: "število točk na testu", lo: 8, hi: 30, unit: "točk" },
        { what: "število ur športa na teden", lo: 0, hi: 12, unit: "h" },
        { what: "število ur spanja v noči pred testom", lo: 4, hi: 10, unit: "h" },
      ];
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const ITEMS = {
            opisni: ["barva avtomobila", "najljubši šolski predmet", "krvna skupina", "poštna številka kraja bivanja", "način prihoda v šolo", "številka na dresu igralca"],
            vrstni: ["velikost majice (S, M, L, XL)", "zadovoljstvo s šolsko malico (nezadovoljen, delno zadovoljen, zadovoljen, zelo zadovoljen)", "uvrstitev na šolskem krosu (1., 2., 3. mesto …)", "pekočnost omake (blaga, srednja, pekoča)"],
            številski: ["telesna višina v centimetrih", "število bratov in sester", "čas teka na 60 m v sekundah", "mesečna žepnina v evrih", "število ur spanja v noči"],
          };
          const type = r.pick(Object.keys(ITEMS));
          const item = r.pick(ITEMS[type]);
          const WHY = {
            opisni: { vrstni: "Vrednosti sicer niso števila, a jih lahko uredimo po stopnji, zato podatki niso le opisni.", številski: "Vrednosti so izmerjena ali prešteta števila, s katerimi lahko smiselno računamo." },
            vrstni: { opisni: "Vrednosti nimajo naravnega vrstnega reda: nobena ni »večja« od druge.", številski: "S temi vrednostmi lahko smiselno računamo (razlike, povprečje), zato so podatki številski." },
            številski: { opisni: "Tudi če so zapisani s števkami, so to le oznake; povprečje takih števil nima pomena.", vrstni: "Vrednosti lahko uredimo, razlik med njimi pa ne moremo smiselno izmeriti ali odšteti." },
          };
          const wrongs = Object.keys(ITEMS).filter((o) => o !== type).map((o) => [o, WHY[o][type]]);
          const expl = { opisni: "Vrednosti so imena oziroma oznake brez naravnega vrstnega reda, zato so podatki opisni.", vrstni: "Vrednosti lahko uredimo po vrsti, razlike med njimi pa niso merljive, zato so podatki vrstni.", številski: "Vrednosti so števila, s katerimi lahko smiselno računamo, zato so podatki številski." };
          return {
            text: `${nm} v anketi med dijaki zbira podatke o spremenljivki »${item}«. Kakšni so ti podatki?`,
            answer: pickAns(r, type, wrongs),
            hint: "Vprašaj se: so vrednosti števila, s katerimi lahko računamo? Če niso, ali jih lahko vsaj uredimo po vrsti?",
            data: { given: [`\\text{spremenljivka} = \\text{${item.replace(/[…]/g, "...")}}`], find: ["\\text{vrsta podatkov}"] },
            formula: false,
            solution: `${expl[type]}\nPravilno: ${type}.`,
          };
        }
        if (t === 1) {
          const SC = [
            (N, s) => ({ intro: `${nm} želi ugotoviti, koliko ur na noč spijo dijaki ${g(nm, "njegove", "njene")} šole. Na šoli je $${N}$ dijakov, anketira jih $${s}$, izbranih naključno.`, pop: `vseh ${N} dijakov šole`, smp: `${s} anketiranih dijakov`, v: "število ur spanja", st: "povprečno število ur spanja anketiranih dijakov" }),
            (N, s) => ({ intro: `Tovarna dnevno izdela $${N}$ žarnic. Kontrola preizkusi $${s}$ naključno izbranih žarnic in izmeri njihovo življenjsko dobo.`, pop: `vseh ${N} žarnic dnevne proizvodnje`, smp: `${s} preizkušenih žarnic`, v: "življenjska doba žarnice", st: "povprečna življenjska doba preizkušenih žarnic" }),
            (N, s) => ({ intro: `V ribniku živi približno $${N}$ postrvi. Biologinja ujame $${s}$ postrvi, jim izmeri dolžino in jih spusti nazaj.`, pop: `vseh približno ${N} postrvi v ribniku`, smp: `${s} ujetih postrvi`, v: "dolžina postrvi", st: "povprečna dolžina ujetih postrvi" }),
            (N, s) => ({ intro: `Občina ima $${N}$ gospodinjstev. Raziskovalci pri $${s}$ naključno izbranih gospodinjstvih zabeležijo mesečno porabo elektrike.`, pop: `vseh ${N} gospodinjstev v občini`, smp: `${s} izbranih gospodinjstev`, v: "mesečna poraba elektrike", st: "povprečna poraba izbranih gospodinjstev" }),
          ];
          const N = r.int(30, 95) * 10;
          const s = r.int(30, 80);
          const sc = r.pick(SC)(N, s);
          const askPop = r.next() < 0.5;
          const correct = askPop ? sc.pop : sc.smp;
          const wrongs = [
            [askPop ? sc.smp : sc.pop, askPop ? "To je vzorec: le izmerjeni del populacije." : "To je populacija: vse enote, o katerih želimo nekaj izvedeti."],
            [sc.v, "To je spremenljivka: lastnost, ki jo merimo pri vsaki enoti."],
            [sc.st, "To je statistika, izračunana iz vzorca, ne skupina enot."],
          ];
          return {
            text: `${sc.intro} Kaj je v tej raziskavi ${askPop ? "populacija" : "vzorec"}?`,
            answer: pickAns(r, correct, wrongs),
            hint: "Populacija so vse enote, o katerih želimo sklepati; vzorec je del, ki ga res izmerimo.",
            data: { given: [`N = ${N}`, `n = ${s}`], find: [askPop ? "\\text{populacija}" : "\\text{vzorec}"] },
            formula: false,
            solution: `Populacija: ${sc.pop}. Vzorec: ${sc.smp}.\nPravilno: ${correct}.`,
          };
        }
        const S = r.pick(SAMPLES);
        const n = r.int(5, 8);
        const xs = Array.from({ length: n }, () => r.int(S.lo, S.hi));
        const sum = xs.reduce((a, b) => a + b, 0);
        const m = sum / n;
        return {
          text: `${nm} je pri ${n} sošolcih zapisal${g(nm, "", "a")} ${S.what}: ${xs.map((x) => `$${x}$`).join(", ")}. Izračunaj aritmetično sredino. Zaokroži na eno decimalko.`,
          answer: num(m, 1, [
            { value: median(xs), why: "To je mediana, ne aritmetična sredina." },
            { value: sum / (n - 1), why: "Vsoto deli s številom vseh podatkov." },
            { value: (Math.min(...xs) + Math.max(...xs)) / 2, why: "To je sredina med najmanjšim in največjim podatkom, ne povprečje vseh." },
          ]),
          hint: "Seštej vse podatke in vsoto deli z njihovim številom.",
          data: { given: [`x_i = ${xs.join(", ")}`, `N = ${n}`], find: ["\\bar x"] },
          formula: "\\bar x = \\dfrac{x_1 + x_2 + \\dots + x_N}{N}",
          solution: `Vsota: $${xs.join(" + ")} = ${sum}$\n$\\bar x = \\dfrac{${sum}}{${n}} ${ap(m, 1)} ${tx(m, 1)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const S = r.pick(SAMPLES);
          const n = r.pick([6, 7, 8]);
          let xs;
          let tries = 0;
          do {
            xs = Array.from({ length: n }, () => r.int(S.lo, S.hi));
            tries++;
          } while (tries < 20 && JSON.stringify(xs) === JSON.stringify([...xs].sort((a, b) => a - b)));
          const me = median(xs);
          const raw = n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2;
          const sorted = [...xs].sort((a, b) => a - b);
          return {
            text: `${nm} je pri ${n} sošolcih zapisal${g(nm, "", "a")} ${S.what}: ${xs.map((x) => `$${x}$`).join(", ")}. Določi mediano.`,
            answer: num(me, null, [
              { value: raw, why: "Pred iskanjem mediane podatke uredi po velikosti." },
              { value: roundHalfUp(mean(xs), 1), why: "To je aritmetična sredina, ne mediana." },
              { value: n % 2 ? NaN : sorted[n / 2 - 1], why: "Pri sodem številu podatkov je mediana povprečje srednjih dveh." },
            ]),
            hint: "Podatke najprej uredi po velikosti.",
            data: { given: [`x_i = ${xs.join(", ")}`, `N = ${n}`], find: ["\\mathrm{Me}"] },
            formula: n % 2 ? "\\mathrm{Me} = x_{\\frac{N+1}{2}} \\text{ (urejeni podatki)}" : "\\mathrm{Me} = \\dfrac{x_{N/2} + x_{N/2 + 1}}{2} \\text{ (urejeni podatki)}",
            solution: `Urejeni podatki: ${sorted.map((x) => `$${x}$`).join(", ")}\n${n % 2 ? `Srednji, ${(n + 1) / 2}. podatek: $\\mathrm{Me} = ${me}$` : `Srednja dva sta $${sorted[n / 2 - 1]}$ in $${sorted[n / 2]}$: $\\mathrm{Me} = \\dfrac{${sorted[n / 2 - 1]} + ${sorted[n / 2]}}{2} = ${tx(me)}$`}`,
          };
        }
        if (t === 1) {
          const CTX = {
            pozitivna: [["število ur učenja", "število točk na testu", 1, 10, 4, 3, "dijakih"], ["dnevno temperaturo v °C", "število prodanih sladoledov", 14, 32, 3, 2, "dnevih"], ["površino stanovanja v m²", "mesečno najemnino v €", 30, 90, 100, 8, "stanovanjih"]],
            negativna: [["starost avtomobila v letih", "ceno v tisoč €", 1, 12, 20, -1.5, "rabljenih avtomobilih"], ["nadmorsko višino v 100 m", "povprečno julijsko temperaturo v °C", 2, 18, 24, -0.7, "krajih"], ["število ur pred zaslonom na dan", "število ur spanja", 1, 8, 10, -0.5, "dijakih"]],
            ni: [["številko čevlja", "oceno iz zgodovine", 36, 45, 0, 0, "dijakih"], ["dan v mesecu", "število izposojenih knjig v knjižnici", 1, 30, 0, 0, "dnevih"]],
          };
          const kind = r.pick(Object.keys(CTX));
          const [X, Y, lo, hi, y0, k, unitW] = r.pick(CTX[kind]);
          const n = 6;
          let xs;
          let ys;
          let ok = false;
          for (let i = 0; i < 60 && !ok; i++) {
            const set = new Set();
            while (set.size < n) set.add(r.int(lo, hi));
            xs = r.shuffle([...set]);
            if (kind === "ni") ys = xs.map(() => r.int(1, 5) + (X.startsWith("dan") ? r.int(10, 30) : 0));
            else ys = xs.map((x) => Math.max(0, Math.round(y0 + k * x + (r.next() - 0.5) * Math.abs(k) * (hi - lo) * 0.25)));
            const rv = pearson(xs, ys);
            ok = kind === "pozitivna" ? rv > 0.75 : kind === "negativna" ? rv < -0.75 : Math.abs(rv) < 0.25;
          }
          if (!ok) return null;
          const correct = kind === "ni" ? "ni povezanosti" : kind;
          const WHY = {
            pozitivna: "Pri večjih $x$ vrednosti $y$ v povprečju niso večje.",
            negativna: "Pri večjih $x$ vrednosti $y$ v povprečju niso manjše.",
            "ni povezanosti": "Uredi pare po $x$: vrednosti $y$ se pri tem opazno spreminjajo v eno smer.",
          };
          const sorted = xs.map((x, i) => [x, ys[i]]).sort((a, b) => a[0] - b[0]);
          return {
            text: `Pri ${n} ${unitW} so zabeležili ${X} ($x$) in ${Y} ($y$). Pari $(x, y)$: ${xs.map((x, i) => `$(${x}, ${ys[i]})$`).join(", ")}. Kakšna je povezanost med $x$ in $y$?`,
            answer: pickAns(r, correct, ["pozitivna", "negativna", "ni povezanosti"].filter((o) => o !== correct).map((o) => [o, WHY[o]])),
            hint: "Pare uredi po $x$ in opazuj, kako se spreminja $y$. Lahko si predstavljaš razsevni diagram.",
            data: { given: [`x = ${xs.join(", ")}`, `y = ${ys.join(", ")}`], find: ["\\text{povezanost}"] },
            formula: false,
            solution: `Urejeno po $x$: ${sorted.map(([a, b]) => `$(${a}, ${b})$`).join(", ")}\n${kind === "pozitivna" ? "Z naraščajočim $x$ $y$ v povprečju narašča: povezanost je pozitivna." : kind === "negativna" ? "Z naraščajočim $x$ $y$ v povprečju pada: povezanost je negativna." : "Vrednosti $y$ ne kažejo smeri: povezanosti ni."}\nKorelacijski koeficient je $r ${ap(pearson(xs, ys), 2)} ${tx(pearson(xs, ys), 2)}$.`,
          };
        }
        const rv = r.pick([-0.95, -0.91, -0.87, -0.83, -0.12, -0.05, 0.04, 0.09, 0.14, 0.82, 0.88, 0.93, 0.97]);
        const [X, Y] = r.pick([["mesečni obisk fitnesa", "telesna pripravljenost"], ["čas igranja videoiger", "ocena iz matematike"], ["višina dijaka", "dolžina skoka v daljino"], ["število ur dela ob šoli", "povprečna ocena"]]);
        const kind = rv > 0.5 ? 0 : rv < -0.5 ? 1 : 2;
        const OPT = ["močna pozitivna povezanost", "močna negativna povezanost", "povezanosti skoraj ni", "ena spremenljivka zagotovo vpliva na drugo"];
        const W = [
          rv > 0 ? "Povezanost je pozitivna, a je $r$ blizu $0$, zato šibka." : "Pri negativnem $r$ povezanost ni pozitivna.",
          rv < 0 ? "Povezanost je negativna, a je $r$ blizu $0$, zato šibka." : "Pri pozitivnem $r$ povezanost ni negativna.",
          "Ker je $\\lvert r \\rvert$ blizu $1$, so točke blizu premice: povezanost je močna.",
          "Korelacijski koeficient meri le povezanost, ne dokazuje vzroka.",
        ];
        const correct = OPT[kind];
        return {
          text: `Za ${r.int(20, 60)} dijakov so zbrali podatke o spremenljivkah »${X}« in »${Y}«. Korelacijski koeficient je $r = ${tx(rv)}$. Katera trditev najbolje opiše povezanost?`,
          answer: pickAns(r, correct, OPT.map((o, i) => [o, W[i]]).filter(([o]) => o !== correct)),
          hint: "Predznak $r$ pove smer, absolutna vrednost $r$ pa moč povezanosti.",
          data: { given: [`r = ${tx(rv)}`], find: ["\\text{povezanost}"] },
          formula: "-1 \\le r \\le 1",
          solution: `Predznak: $r ${rv > 0 ? "> 0" : "< 0"}$. Velikost: $\\lvert r \\rvert = ${tx(Math.abs(rv))}$ je ${Math.abs(rv) > 0.5 ? "blizu $1$" : "blizu $0$"}.\nPravilno: ${correct}.`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [gA, gB, what] = r.pick([
          ["dijaki, ki se v šolo vozijo z avtobusom", "dijaki, ki hodijo peš", "čas poti v minutah"],
          ["dnevi s soncem", "deževni dnevi", "najvišjo temperaturo v °C"],
          ["sadike z gnojilom", "sadike brez gnojila", "višino v centimetrih"],
          ["dijaki, ki so se učili ob glasbi", "dijaki, ki so se učili v tišini", "število točk na testu"],
        ]);
        const nA = r.int(4, 6);
        const nB = r.int(4, 6);
        const base = r.int(12, 22);
        const A = Array.from({ length: nA }, () => base + r.int(2, 9));
        const B = Array.from({ length: nB }, () => base + r.int(-3, 4));
        const mA = mean(A);
        const mB = mean(B);
        const diff = mA - mB;
        if (diff < 0.15) return null;
        const sumA = A.reduce((a, b) => a + b, 0);
        const sumB = B.reduce((a, b) => a + b, 0);
        return {
          text: `Raziskava je primerjala ${what}. Skupina A (${gA}): ${A.map((x) => `$${x}$`).join(", ")}. Skupina B (${gB}): ${B.map((x) => `$${x}$`).join(", ")}. Za koliko je aritmetična sredina skupine A večja od sredine skupine B? Zaokroži na eno decimalko.`,
          answer: num(diff, 1, [
            { value: median(A) - median(B), why: "To je razlika median, ne aritmetičnih sredin." },
            { value: sumA - sumB, why: "Skupini nista enako veliki; primerjaj sredini, ne vsot." },
            { value: (sumA - sumB) / ((nA + nB) / 2), why: "Vsako sredino računaj posebej z velikostjo svoje skupine." },
          ]),
          hint: "Za vsako skupino posebej izračunaj aritmetično sredino, nato ju odštej.",
          data: { given: [`x_A = ${A.join(", ")}`, `x_B = ${B.join(", ")}`], find: ["\\bar x_A - \\bar x_B"] },
          formula: "\\bar x = \\dfrac{x_1 + x_2 + \\dots + x_N}{N}",
          solution: `$\\bar x_A = \\dfrac{${sumA}}{${nA}} ${ap(mA, 3)} ${txr(mA, 3)}$\n$\\bar x_B = \\dfrac{${sumB}}{${nB}} ${ap(mB, 3)} ${txr(mB, 3)}$\n$\\bar x_A - \\bar x_B ${ap(diff, 1)} ${tx(diff, 1)}$`,
        };
      }
      if (t === 1) {
        const S = r.pick(SAMPLES);
        const n = r.int(5, 8);
        const known = Array.from({ length: n - 1 }, () => r.int(S.lo, S.hi));
        const sumK = known.reduce((a, b) => a + b, 0);
        const cands = [];
        for (let v = S.lo; v <= S.hi; v++) if ((2 * (sumK + v)) % n === 0) cands.push(v);
        if (!cands.length) return null;
        const v = r.pick(cands);
        const m = (sumK + v) / n;
        return {
          text: `${nm} je pri ${n} sošolcih zapisal${g(nm, "", "a")} ${S.what}. Aritmetična sredina vseh ${n} podatkov je $${tx(m)}$. ${n - 1 === 4 ? "Znani so 4 podatki" : `Znanih je ${n - 1} podatkov`}: ${known.map((x) => `$${x}$`).join(", ")}. Koliko je manjkajoči podatek?`,
          answer: num(v, null, [
            { value: m, why: "Manjkajoči podatek ni nujno enak povprečju." },
            { value: (n - 1) * m - sumK, why: "Vsota vseh podatkov je $N \\cdot \\bar x$, kjer je $N$ število vseh podatkov, tudi manjkajočega." },
            { value: mean(known), why: "To je povprečje znanih podatkov; uporabi vsoto vseh." },
          ]),
          hint: "Iz povprečja izračunaj vsoto vseh podatkov.",
          data: { given: [`\\bar x = ${tx(m)}`, `N = ${n}`, `x_i = ${known.join(", ")}`], find: [`x_{${n}}`] },
          formula: "x_1 + x_2 + \\dots + x_N = N \\cdot \\bar x",
          solution: `Vsota vseh: $${n} \\cdot ${tx(m)} = ${tx(n * m)}$\nVsota znanih: $${sumK}$\nManjkajoči podatek: $${tx(n * m)} - ${sumK} = ${v}$`,
          zeroOk: true,
        };
      }
      const [X, Y, Z, units] = r.pick([
        ["mesečno prodajo sladoleda", "število reševanj iz vode", "toplo vreme, ko več ljudi kupuje sladoled in se kopa", "mesecev"],
        ["številko čevlja", "hitrost branja", "starost otrok, saj starejši otroci rastejo in berejo hitreje", "otrok od 6 do 12 let"],
        ["število gasilcev na požarišču", "škodo po požaru", "velikost požara, ki zahteva več gasilcev in povzroči več škode", "požarov"],
        ["dnevno število prodanih dežnikov", "število prometnih nesreč", "deževno vreme, ko ljudje kupujejo dežnike in so ceste spolzke", "dni"],
      ]);
      const rv = r.pick([0.81, 0.84, 0.87, 0.9, 0.93]);
      const correct = `povezanost je močna in pozitivna, a vzroka ne dokazuje; verjetno na oboje vpliva ${Z}`;
      return {
        text: `Za ${r.int(12, 40)} ${units} so zabeležili ${X} in ${Y}. Korelacijski koeficient je $r = ${tx(rv)}$. Katera trditev je pravilna?`,
        answer: pickAns(r, correct, [
          ["podatki dokazujejo, da večje vrednosti prve spremenljivke povzročijo večje vrednosti druge", "Povezanost ni dokaz vzroka; pogosto obe spremenljivki poganja tretja."],
          ["povezanost je negativna", "Pozitiven $r$ pomeni pozitivno povezanost."],
          ["ker je $r$ blizu $1$, vse točke ležijo na premici", "Natanko na premici ležijo točke le pri $r = 1$; pri $r$ blizu $1$ so blizu premice."],
        ]),
        hint: "Loči med povezanostjo in vzročnostjo. Pomisli, ali bi lahko obe spremenljivki rasli zaradi skupnega razloga.",
        data: { given: [`r = ${tx(rv)}`], find: ["\\text{pravilna interpretacija}"] },
        formula: false,
        solution: `$r = ${tx(rv)}$ je pozitiven in blizu $1$: povezanost je močna in pozitivna.\nKorelacija ne dokazuje vzroka; tu je skupni vzrok ${Z}.`,
      };
    },
  },
];

export const MATURA_MAT_SS4 = wrapGens(GENS, { dropZero: false });
