// Indija: izpitne naloge iz biologije (NEET-UG, CBSE/ICSE/ISC), angleško in hindijsko.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, topic, lang); besedila z L = bi(lang).
// Vsebina samo po racionaliziranih učbenikih NCERT za 11. in 12. razred (brez izbrisanih poglavij:
// prebava, prenos v rastlinah, mineralna prehrana, razmnoževanje organizmov, okoljska vprašanja).
//
// Za vsako temo sta dva generatorja:
//  - pojmovni (exi-bio-<tema>): naloge v slogu NEET iz podatkovnih tabel (BANK): raven 1 priklic dejstva,
//    raven 2 izbira pravilne trditve, prirejanje stolpcev, trditev–razlog; raven 3 dve trditvi,
//    »koliko trditev je pravilnih«, »koliko parov je pravilno prirejenih« (številski odgovor);
//  - računski (exi-bio-<tema>-calc …): razmerja, verjetnosti, števila kromosomov, energija ipd.
// Naključna števila in izbire so v obeh jezikih enake (r.* nikoli znotraj veje, ki je odvisna od jezika).
import { en, num, numM, task as baseTask, bi, roundToL, fracTex, fraction, fractionM } from "./exam-util.js";

// Hindijska rešitev, ki je samo račun, dobi uvodno vrstico »हल:« (kot v učbenikih NCERT v hindijščini).
const DEV = /[\u0900-\u097F]/;
const task = (o) => {
  const hi = DEV.test(o.text || "");
  const bare = (x) => !DEV.test(String(x || "").replace(/\$[^$]*\$/g, ""));
  return baseTask(hi && bare(o.solution) ? { ...o, solution: `हल:\n${o.solution}` } : o);
};

const T = (slug) => `BIO-EXB/${slug}`;
const LANGS = ["en", "hi"];
const LET = ["a", "b", "c", "d", "e", "f"];
const ROM = ["i", "ii", "iii", "iv"];
const ABC = ["A", "B", "C", "D"];
const NAMES = [["Aarav", "आरव"], ["Priya", "प्रिया"], ["Rohan", "रोहन"], ["Ananya", "अनन्या"], ["Kabir", "कबीर"], ["Meera", "मीरा"], ["Ishaan", "ईशान"], ["Diya", "दीया"]];

// Varno besedilo za vrstico podatkov (KaTeX \text brez posebnih znakov).
const strip = (s) => String(s).replace(/[*$\\{}^_%&#~]/g, "");
const tx = (s) => `\\text{${strip(s)}}`;
const S = (...lines) => lines.filter((x) => x !== null && x !== undefined && x !== "").join("\n");
const fill = (s, x) => s.split("%").join(x);
const sum = (a) => a.reduce((x, y) => x + y, 0);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Izbira ene pravilne možnosti: correct = [en, hi]; wrong = [[en, hi, whyEn, whyHi], …] (uporabi prve tri).
// Vrstni red premeša RNG (enako v obeh jezikih).
function mc(r, L, correct, wrong) {
  const items = [[correct[0], correct[1], null, null], ...wrong.slice(0, 3)];
  const order = r.shuffle([0, 1, 2, 3]);
  return {
    type: "choice",
    options: order.map((i) => L(items[i][0], items[i][1])),
    index: order.indexOf(0),
    why: order.map((i) => (i ? L(items[i][2], items[i][3]) : null)),
  };
}
// Izbira s stalnim vrstnim redom možnosti (trditev–razlog, dve trditvi): opts = [[en, hi]], whys = [[en, hi] | null].
const fixedChoice = (L, opts, index, whys) => ({
  type: "choice",
  options: opts.map((o) => L(o[0], o[1])),
  index,
  why: whys.map((w) => (w ? L(w[0], w[1]) : null)),
});

// ---------------------------------------------------------------------------------------------
// Pojmovni motor. Banka teme:
//  sets: [{ k: [en, hi] (vrsta pojma), q: [en, hi] (vprašanje s % za pojem), rq: [en, hi] (obratno, % za opis),
//           items: [[pojemEn, pojemHi, dejstvoEn, dejstvoHi], …] }]   (dejstvo velja samo za svoj pojem v nizu)
//  tf: [[en, hi]] pravilne trditve;  ff: [[en, hi, popravekEn, popravekHi]] napačne trditve s popravkom;
//  ar: [[trditevEn, trditevHi, razlogEn, razlogHi]] pravilna trditev in razlog, ki jo pojasni.
// ---------------------------------------------------------------------------------------------
const AR_OPTS = [
  ["Both A and R are true, and R is the correct explanation of A.", "A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है।"],
  ["Both A and R are true, but R is not the correct explanation of A.", "A और R दोनों सत्य हैं, परंतु R, A की सही व्याख्या नहीं है।"],
  ["A is true, but R is false.", "A सत्य है, परंतु R असत्य है।"],
  ["A is false, but R is true.", "A असत्य है, परंतु R सत्य है।"],
];
const TS_OPTS = [
  ["Both Statement I and Statement II are correct.", "कथन I और कथन II दोनों सही हैं।"],
  ["Both Statement I and Statement II are incorrect.", "कथन I और कथन II दोनों गलत हैं।"],
  ["Statement I is correct but Statement II is incorrect.", "कथन I सही है, परंतु कथन II गलत है।"],
  ["Statement I is incorrect but Statement II is correct.", "कथन I गलत है, परंतु कथन II सही है।"],
];
const TS_CLAIM = [[1, 1], [0, 0], [1, 0], [0, 1]];

// Raven 1: pojem → dejstvo.
function termToFact(r, L, B) {
  const set = r.pick(B.sets);
  const it = r.shuffle(set.items).slice(0, 4);
  const t = it[0];
  const answer = mc(r, L, [t[2], t[3]], it.slice(1).map((o) => [o[2], o[3], `This is true of ${o[0]}, not of ${t[0]}.`, `यह ${o[1]} के लिए सही है, ${t[1]} के लिए नहीं।`]));
  return task({
    text: L(fill(set.q[0], `**${t[0]}**`), fill(set.q[1], `**${t[1]}**`)),
    answer,
    data: { given: [tx(L(t[0], t[1]))], find: [tx(L("matching feature", "मेल खाती विशेषता"))] },
    hint: L(`Recall the defining feature of ${t[0]}. Each wrong option is true of a different ${set.k[0]}.`, `${t[1]} की मुख्य पहचान याद कीजिए। हर गलत विकल्प किसी दूसरे ${set.k[1]} पर लागू होता है।`),
    solution: L(
      S(`✓ **${t[0]}** — ${t[2]}.`, ...it.slice(1).map((o) => `✗ ${o[2]} → ${o[0]}`)),
      S(`✓ **${t[1]}** — ${t[3]}।`, ...it.slice(1).map((o) => `✗ ${o[3]} → ${o[1]}`)),
    ),
  });
}
// Raven 1: dejstvo → pojem.
function factToTerm(r, L, B) {
  const set = r.pick(B.sets);
  const it = r.shuffle(set.items).slice(0, 4);
  const t = it[0];
  const answer = mc(r, L, [t[0], t[1]], it.slice(1).map((o) => [o[0], o[1], `${o[0]}: ${o[2]}.`, `${o[1]}: ${o[3]}।`]));
  return task({
    text: L(fill(set.rq[0], `“${t[2]}”`), fill(set.rq[1], `“${t[3]}”`)),
    answer,
    data: { given: [tx(L("the description", "दिया गया विवरण"))], find: [tx(L(set.k[0], set.k[1]))] },
    hint: L(`Go through the options one by one and recall the key feature of each ${set.k[0]}.`, `विकल्पों को एक-एक करके देखिए और प्रत्येक ${set.k[1]} की मुख्य विशेषता याद कीजिए।`),
    solution: L(
      S(`✓ **${t[0]}** — ${t[2]}.`, ...it.slice(1).map((o) => `✗ ${o[0]} — ${o[2]}`)),
      S(`✓ **${t[1]}** — ${t[3]}।`, ...it.slice(1).map((o) => `✗ ${o[1]} — ${o[3]}`)),
    ),
  });
}
// Raven 2: katera trditev je pravilna.
function correctStatement(r, L, B) {
  const t = r.pick(B.tf);
  const fs = r.shuffle(B.ff).slice(0, 3);
  const answer = mc(r, L, t, fs);
  return task({
    text: L("Which of the following statements is correct?", "निम्नलिखित में से कौन-सा कथन सही है?"),
    answer,
    data: { given: [tx(L("4 statements", "4 कथन"))], find: [tx(L("the correct statement", "सही कथन"))] },
    hint: L("Look for the detail that is wrong in each statement: a swapped term, a wrong number or a reversed effect.", "प्रत्येक कथन में गलत विवरण खोजिए: बदला हुआ पद, गलत संख्या या उल्टा प्रभाव।"),
    solution: L(
      S(`✓ ${t[0]}`, ...fs.map((f) => `✗ ${f[0]} — ${f[2]}`)),
      S(`✓ ${t[1]}`, ...fs.map((f) => `✗ ${f[1]} — ${f[3]}`)),
    ),
  });
}
// Raven 2: prirejanje stolpcev (kodo A-ii, B-iv …).
function matchColumns(r, L, B) {
  const set = r.pick(B.sets);
  const it = r.shuffle(set.items).slice(0, 4);
  const perm = r.shuffle([0, 1, 2, 3]); // perm[k] = pojem, čigar dejstvo je na mestu k v stolpcu II
  const pos = [0, 1, 2, 3].map((j) => perm.indexOf(j));
  const code = (p) => p.map((x, j) => `${ABC[j]}-${ROM[x]}`).join(", ");
  const swaps = r.shuffle([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]).slice(0, 3);
  const wrong = swaps.map(([a, b]) => {
    const p = [...pos];
    [p[a], p[b]] = [p[b], p[a]];
    return [code(p), code(p), `${ABC[a]} (${it[a][0]}) goes with ${ROM[pos[a]]}, not ${ROM[p[a]]}.`, `${ABC[a]} (${it[a][1]}) का मेल ${ROM[pos[a]]} से है, ${ROM[p[a]]} से नहीं।`];
  });
  const answer = mc(r, L, [code(pos), code(pos)], wrong);
  const colI = (l) => it.map((o, j) => `${ABC[j]}. ${o[l]}`).join("\n");
  const colII = (l) => perm.map((j, k) => `${ROM[k]}. ${it[j][l + 2]}`).join("\n");
  return task({
    text: L(
      `Match Column I (${set.k[0]}) with Column II and choose the correct code.\n\nColumn I:\n${colI(0)}\n\nColumn II:\n${colII(0)}`,
      `स्तंभ I (${set.k[1]}) का स्तंभ II से मिलान कीजिए और सही कूट चुनिए।\n\nस्तंभ I:\n${colI(1)}\n\nस्तंभ II:\n${colII(1)}`,
    ),
    answer,
    data: { given: [tx(L("Column I: A–D", "स्तंभ I: A–D")), tx(L("Column II: i–iv", "स्तंभ II: i–iv"))], find: [tx(L("correct code", "सही कूट"))] },
    hint: L("Match the pair you are surest of first; that alone usually rules out two codes.", "पहले वह जोड़ी मिलाइए जिसके बारे में आप सबसे अधिक निश्चित हैं; इससे प्रायः दो कूट हट जाते हैं।"),
    solution: L(
      S(...it.map((o, j) => `${ABC[j]}. ${o[0]} → ${ROM[pos[j]]}. ${o[2]}`), `Code: ${code(pos)}`),
      S(...it.map((o, j) => `${ABC[j]}. ${o[1]} → ${ROM[pos[j]]}. ${o[3]}`), `कूट: ${code(pos)}`),
    ),
  });
}
// Raven 2: trditev (A) in razlog (R).
function assertionReason(r, L, B) {
  const c = r.int(0, 3);
  const prs = r.shuffle(B.ar).slice(0, 2);
  const f = r.pick(B.ff);
  // c = 1: R je trditev drugega para (samostojna, resnična, ne pojasni A); c = 3: A je napačna trditev, R njen popravek.
  const A = c === 3 ? [f[0], f[1]] : [prs[0][0], prs[0][1]];
  const R = c === 0 ? [prs[0][2], prs[0][3]] : c === 1 ? [prs[1][0], prs[1][1]] : c === 2 ? [f[0], f[1]] : [f[2], f[3]];
  const fw = [f[2], f[3]];
  const whys = {
    0: [null, ["R is the very reason for A, so it does explain A.", "R ही A का कारण है, अतः R, A की सही व्याख्या करता है।"], ["R is a correct statement.", "R एक सही कथन है।"], ["A is a correct statement.", "A एक सही कथन है।"]],
    1: [["R is true, but it is about a different point and does not explain A.", "R सत्य है, परंतु यह किसी दूसरी बात से संबंधित है और A की व्याख्या नहीं करता।"], null, ["R is a correct statement.", "R एक सही कथन है।"], ["A is a correct statement.", "A एक सही कथन है।"]],
    2: [[`R is false: ${fw[0]}`, `R असत्य है: ${fw[1]}`], [`R is false: ${fw[0]}`, `R असत्य है: ${fw[1]}`], null, ["It is the other way round: A is true and R is false.", "बात उलटी है: A सत्य है और R असत्य।"]],
    3: [["A is false; R states the correct fact.", "A असत्य है; R सही तथ्य बताता है।"], ["A is false, so ‘both true’ cannot be right.", "A असत्य है, इसलिए ‘दोनों सत्य’ सही नहीं हो सकता।"], ["It is the other way round: R is true and A is false.", "बात उलटी है: R सत्य है और A असत्य।"], null],
  }[c];
  const verdict = [
    ["Both are true and R explains A.", "दोनों सत्य हैं और R, A की व्याख्या करता है।"],
    ["Both are true, but R does not explain A.", "दोनों सत्य हैं, परंतु R, A की व्याख्या नहीं करता।"],
    [`A is true; R is false — ${fw[0]}`, `A सत्य है; R असत्य है — ${fw[1]}`],
    ["A is false; R is true and states the correct fact.", "A असत्य है; R सत्य है और सही तथ्य बताता है।"],
  ][c];
  return task({
    text: L(`Assertion (A): ${A[0]}\n\nReason (R): ${R[0]}\n\nChoose the correct option.`, `अभिकथन (A): ${A[1]}\n\nकारण (R): ${R[1]}\n\nसही विकल्प चुनिए।`),
    answer: fixedChoice(L, AR_OPTS, c, whys),
    data: { given: [tx("A, R")], find: [tx(L("truth of A and R and their link", "A और R की सत्यता तथा उनका संबंध"))] },
    hint: L("Judge A and R separately first. Only if both are true, ask: does R answer “why A?”", "पहले A और R को अलग-अलग जाँचिए। दोनों सत्य हों, तभी पूछिए: क्या R बताता है कि A क्यों होता है?"),
    solution: L(S(`A: ${c === 3 ? "false" : "true"}.`, `R: ${c === 2 ? "false" : "true"}.`, verdict[0]), S(`A: ${c === 3 ? "असत्य" : "सत्य"}।`, `R: ${c === 2 ? "असत्य" : "सत्य"}।`, verdict[1])),
  });
}
// Raven 3: dve trditvi (NEET 2024).
function twoStatements(r, L, B) {
  const tI = r.int(0, 1);
  const tII = r.int(0, 1);
  const ts = r.shuffle(B.tf).slice(0, 2);
  const fs = r.shuffle(B.ff).slice(0, 2);
  const st = [tI ? ts[0] : fs[0], tII ? ts[1] : fs[1]];
  const truth = [tI, tII];
  const idx = TS_CLAIM.findIndex((c) => c[0] === tI && c[1] === tII);
  const nm = ["I", "II"];
  const whys = TS_CLAIM.map((claim, k) => {
    if (k === idx) return null;
    const e = [];
    const h = [];
    for (let s = 0; s < 2; s++) {
      if (claim[s] === truth[s]) continue;
      if (truth[s]) {
        e.push(`Statement ${nm[s]} is correct as written.`);
        h.push(`कथन ${nm[s]} जैसा लिखा है, वैसा ही सही है।`);
      } else {
        e.push(`Statement ${nm[s]} is false: ${st[s][2]}`);
        h.push(`कथन ${nm[s]} गलत है: ${st[s][3]}`);
      }
    }
    return [e.join(" "), h.join(" ")];
  });
  return task({
    text: L(`Statement I: ${st[0][0]}\n\nStatement II: ${st[1][0]}\n\nChoose the correct option.`, `कथन I: ${st[0][1]}\n\nकथन II: ${st[1][1]}\n\nसही विकल्प चुनिए।`),
    answer: fixedChoice(L, TS_OPTS, idx, whys),
    data: { given: [tx(L("Statements I and II", "कथन I और II"))], find: [tx(L("which are correct", "कौन-से सही हैं"))] },
    hint: L("Check each statement on its own against what NCERT says; the two are independent.", "प्रत्येक कथन को NCERT के अनुसार अलग-अलग जाँचिए; दोनों एक-दूसरे पर निर्भर नहीं हैं।"),
    solution: L(
      S(...[0, 1].map((s) => (truth[s] ? `I${s ? "I" : ""}: correct.` : `I${s ? "I" : ""}: incorrect — ${st[s][2]}`))),
      S(...[0, 1].map((s) => (truth[s] ? `I${s ? "I" : ""}: सही।` : `I${s ? "I" : ""}: गलत — ${st[s][3]}`))),
    ),
  });
}
// Raven 3: koliko trditev je pravilnih (številski odgovor).
function countStatements(r, L, B) {
  const k = r.int(1, 4);
  const ts = r.shuffle(B.tf).slice(0, k);
  const fs = r.shuffle(B.ff).slice(0, 4 - k);
  const list = r.shuffle([...ts.map((s) => ({ s, ok: true })), ...fs.map((s) => ({ s, ok: false }))]);
  const fi = list.findIndex((x) => !x.ok);
  const ti = list.findIndex((x) => x.ok);
  const mist = [];
  if (fi >= 0) mist.push([k + 1, L(`Statement (${LET[fi]}) is false: ${list[fi].s[2]}`, `कथन (${LET[fi]}) गलत है: ${list[fi].s[3]}`)]);
  mist.push([k - 1, L(`Statement (${LET[ti]}) is also correct.`, `कथन (${LET[ti]}) भी सही है।`)]);
  const lines = (l) => list.map((x, i) => `(${LET[i]}) ${x.s[l]}`).join("\n");
  return task({
    text: L(`How many of the following statements are correct?\n\n${lines(0)}`, `निम्नलिखित में से कितने कथन सही हैं?\n\n${lines(1)}`),
    answer: numM(k, 0, mist),
    data: { given: [tx(L("statements (a)–(d)", "कथन (a)–(d)"))], find: [`n_{${tx(L("correct", "सही"))}}`] },
    hint: L("Mark each statement ✓ or ✗ separately, then count the ticks.", "प्रत्येक कथन पर अलग से ✓ या ✗ लगाइए, फिर ✓ गिनिए।"),
    solution: L(
      S(...list.map((x, i) => (x.ok ? `(${LET[i]}) ✓` : `(${LET[i]}) ✗ — ${x.s[2]}`)), `Correct statements: ${k}`),
      S(...list.map((x, i) => (x.ok ? `(${LET[i]}) ✓` : `(${LET[i]}) ✗ — ${x.s[3]}`)), `सही कथन: ${k}`),
    ),
  });
}
// Raven 3: koliko parov je pravilno prirejenih (številski odgovor).
function countMatched(r, L, B) {
  const set = r.pick(B.sets);
  const it = r.shuffle(set.items).slice(0, 5);
  const w = r.int(1, 3);
  const sh = [0, 1, 2, 3];
  if (w === 1) sh[0] = 4;
  if (w === 2) [sh[0], sh[1]] = [1, 0];
  if (w === 3) [sh[0], sh[1], sh[2]] = [1, 2, 0];
  const order = r.shuffle([0, 1, 2, 3]);
  const k = 4 - w;
  const bad = order.findIndex((j) => sh[j] !== j);
  const good = order.findIndex((j) => sh[j] === j);
  const jb = order[bad];
  const mist = [[k + 1, L(`Pair (${LET[bad]}) is mismatched: ${it[jb][0]} — ${it[jb][2]}.`, `जोड़ी (${LET[bad]}) गलत है: ${it[jb][1]} — ${it[jb][3]}।`)]];
  mist.push([k - 1, L(`Pair (${LET[good]}) is correctly matched.`, `जोड़ी (${LET[good]}) सही मिलाई गई है।`)]);
  const lines = (l) => order.map((j, i) => `(${LET[i]}) ${it[j][l]} — ${it[sh[j]][l + 2]}`).join("\n");
  return task({
    text: L(`How many of the following pairs (${set.k[0]} — feature) are correctly matched?\n\n${lines(0)}`, `निम्नलिखित में से कितनी जोड़ियाँ (${set.k[1]} — विशेषता) सही मिलाई गई हैं?\n\n${lines(1)}`),
    answer: numM(k, 0, mist),
    data: { given: [tx(L("pairs (a)–(d)", "जोड़ियाँ (a)–(d)"))], find: [`n_{${tx(L("correct", "सही"))}}`] },
    hint: L("For each left-hand item, recall its own feature before reading the right-hand side.", "बाईं ओर के प्रत्येक पद की अपनी विशेषता पहले याद कीजिए, फिर दाईं ओर पढ़िए।"),
    solution: L(
      S(...order.map((j, i) => (sh[j] === j ? `(${LET[i]}) ✓` : `(${LET[i]}) ✗ — ${it[j][0]}: ${it[j][2]}`)), `Correctly matched: ${k}`),
      S(...order.map((j, i) => (sh[j] === j ? `(${LET[i]}) ✓` : `(${LET[i]}) ✗ — ${it[j][1]}: ${it[j][3]}`)), `सही जोड़ियाँ: ${k}`),
    ),
  });
}

const FORMATS = [null, [termToFact, factToTerm], [correctStatement, matchColumns, assertionReason], [twoStatements, countStatements, countMatched, assertionReason]];
const conceptGen = (slug, B) => ({
  id: `exi-bio-${slug}`,
  topics: [T(slug)],
  langs: LANGS,
  gen(level, r, _topic, lang) {
    const L = bi(lang);
    const fs = FORMATS[level];
    return r.pick(fs)(r, L, B);
  },
});

// Šteje, koliko naštetih organizmov/pojmov spada v kategorijo (NEET »How many of the following …«).
// cat = { q: [en, hi], yes: [[en, hi, opombaEn, opombaHi]], no: [...] }; opomba je povedek (»is a mammal«).
function countCategory(r, L, cat, n) {
  const k = r.int(Math.max(1, n - cat.no.length), Math.min(cat.yes.length, n - 1));
  const ys = r.shuffle(cat.yes).slice(0, k);
  const ns = r.shuffle(cat.no).slice(0, n - k);
  const list = r.shuffle([...ys.map((x) => ({ x, ok: true })), ...ns.map((x) => ({ x, ok: false }))]);
  const fn = list.find((o) => !o.ok).x;
  const fy = list.find((o) => o.ok).x;
  const names = (l) => list.map((o) => o.x[l]).join(", ");
  return task({
    text: L(`${cat.q[0]}\n\n${names(0)}`, `${cat.q[1]}\n\n${names(1)}`),
    answer: numM(k, 0, [
      [k + 1, L(`${cap(fn[0])} does not belong: it ${fn[2]}.`, `${fn[1]} इसमें नहीं आता: यह ${fn[3]}।`)],
      [k - 1, L(`${cap(fy[0])} also belongs: it ${fy[2]}.`, `${fy[1]} भी इसमें आता है: यह ${fy[3]}।`)],
    ]),
    data: { given: [tx(L(`${n} items`, `${n} नाम`))], find: [`n`] },
    hint: L("Classify each item on its own before counting; common names can mislead.", "गिनने से पहले प्रत्येक नाम को अलग से वर्गीकृत कीजिए; सामान्य नाम भ्रम पैदा कर सकते हैं।"),
    solution: L(
      S(...list.map((o) => `${o.ok ? "✓" : "✗"} ${cap(o.x[0])} ${o.x[2]}.`), `Answer: ${k}`),
      S(...list.map((o) => `${o.ok ? "✓" : "✗"} ${o.x[1]} ${o.x[3]}।`), `उत्तर: ${k}`),
    ),
  });
}

// =============================================================================================
// Banke pojmov (NCERT 11. in 12. razred, racionalizirano)
// =============================================================================================
const BANK = {};

BANK["diversity-of-living-organisms"] = {
  sets: [
    {
      k: ["phylum", "संघ"],
      q: ["Which feature is characteristic of phylum %?", "संघ % का अभिलक्षण कौन-सा है?"],
      rq: ["Which phylum shows this feature: %?", "किस संघ में यह अभिलक्षण पाया जाता है: %?"],
      items: [
        ["Porifera", "पोरीफेरा", "water canal system lined by choanocytes (collar cells)", "कीप कोशिकाओं (कॉलर कोशिकाओं) से आस्तरित जल नाल तंत्र"],
        ["Cnidaria", "निडेरिया", "cnidoblasts (stinging cells) on the tentacles", "स्पर्शकों पर दंश कोशिकाएँ (निडोब्लास्ट)"],
        ["Ctenophora", "टीनोफोरा", "eight external rows of ciliated comb plates", "पक्ष्माभी कंकत पट्टिकाओं की आठ बाहरी पंक्तियाँ"],
        ["Platyhelminthes", "प्लेटीहेल्मिंथीज", "flame cells for osmoregulation and excretion", "परासरण नियमन और उत्सर्जन के लिए ज्वाला कोशिकाएँ"],
        ["Aschelminthes", "ऐस्केलमिंथीज", "pseudocoelom; body circular in cross-section", "कूटगुहा; अनुप्रस्थ काट में शरीर गोल"],
        ["Annelida", "ऐनेलिडा", "metameric segmentation with nephridia", "नेफ्रीडिया सहित विखंडीय खंडीभवन"],
        ["Arthropoda", "आर्थ्रोपोडा", "chitinous exoskeleton and jointed appendages", "काइटिनी बाह्यकंकाल और संधियुक्त उपांग"],
        ["Mollusca", "मोलस्का", "mantle, calcareous shell and a file-like radula", "प्रावार, कैल्सियमी कवच और रेती जैसी रेडुला"],
        ["Echinodermata", "इकाइनोडर्मेटा", "water vascular system and calcareous ossicles", "जल संवहन तंत्र और कैल्सियमी अस्थिकाएँ"],
        ["Hemichordata", "हेमीकॉर्डेटा", "body of proboscis, collar and trunk", "शुंड, कॉलर और धड़ में बँटा शरीर"],
      ],
    },
    {
      k: ["organism", "जीव"],
      q: ["To which group does % belong?", "% किस समूह से संबंधित है?"],
      rq: ["Which organism is %?", "निम्नलिखित में से कौन-सा जीव %?"],
      items: [
        ["*Volvox*", "*Volvox*", "a green alga (Chlorophyceae)", "एक हरा शैवाल (क्लोरोफाइसी) है"],
        ["*Fucus*", "*Fucus*", "a brown alga (Phaeophyceae)", "एक भूरा शैवाल (फियोफाइसी) है"],
        ["*Gelidium*", "*Gelidium*", "a red alga (Rhodophyceae) used for agar", "अगार देने वाला लाल शैवाल (रोडोफाइसी) है"],
        ["*Marchantia*", "*Marchantia*", "a liverwort (bryophyte)", "एक लिवरवर्ट (ब्रायोफाइट) है"],
        ["*Sphagnum*", "*Sphagnum*", "a moss that forms peat", "पीट बनाने वाला मॉस है"],
        ["*Selaginella*", "*Selaginella*", "a heterosporous pteridophyte", "एक विषमबीजाणुक टेरिडोफाइट है"],
        ["*Cycas*", "*Cycas*", "a gymnosperm with coralloid roots", "प्रवालाभ मूलों वाला अनावृतबीजी है"],
        ["*Agaricus*", "*Agaricus*", "a basidiomycete (mushroom)", "एक बेसिडियोमाइसिटीज कवक (छत्रक) है"],
        ["*Neurospora*", "*Neurospora*", "an ascomycete (sac fungus)", "एक ऐस्कोमाइसिटीज (थैली कवक) है"],
        ["*Albugo*", "*Albugo*", "a phycomycete (parasite on mustard)", "सरसों पर परजीवी फाइकोमाइसिटीज कवक है"],
        ["*Alternaria*", "*Alternaria*", "a deuteromycete (imperfect fungus)", "एक ड्यूटेरोमाइसिटीज (अपूर्ण कवक) है"],
        ["*Nostoc*", "*Nostoc*", "a cyanobacterium with heterocysts", "विषमकोष्ठों (हेटरोसिस्ट) वाला सायनोबैक्टीरिया है"],
        ["*Gonyaulax*", "*Gonyaulax*", "a dinoflagellate causing red tides", "लाल तरंगें उत्पन्न करने वाला डाइनोफ्लैजिलेट है"],
        ["*Trypanosoma*", "*Trypanosoma*", "a flagellated protozoan (sleeping sickness)", "निद्रा रोग करने वाला कशाभी प्रोटोजोआ है"],
      ],
    },
    {
      k: ["animal", "जंतु"],
      q: ["What is the common name of %?", "% का सामान्य नाम क्या है?"],
      rq: ["Which genus is commonly called %?", "किस वंश को सामान्यतः % कहते हैं?"],
      items: [
        ["*Pteropus*", "*Pteropus*", "flying fox (a mammal)", "उड़न लोमड़ी (एक स्तनधारी)"],
        ["*Exocoetus*", "*Exocoetus*", "flying fish (a bony fish)", "उड़न मछली (एक अस्थिल मछली)"],
        ["*Hippocampus*", "*Hippocampus*", "sea horse (a bony fish)", "समुद्री घोड़ा (एक अस्थिल मछली)"],
        ["*Octopus*", "*Octopus*", "devil fish (a mollusc)", "डेविल फिश (एक मोलस्क)"],
        ["*Sepia*", "*Sepia*", "cuttlefish (a mollusc)", "कटलफिश (एक मोलस्क)"],
        ["*Limulus*", "*Limulus*", "king crab, a living fossil (an arthropod)", "राज कर्कट, एक जीवित जीवाश्म (आर्थ्रोपोड)"],
        ["*Physalia*", "*Physalia*", "Portuguese man-of-war (a cnidarian)", "पुर्तगाली युद्ध मानव (एक निडेरियन)"],
        ["*Antedon*", "*Antedon*", "sea lily (an echinoderm)", "समुद्री लिली (एक इकाइनोडर्म)"],
        ["*Scoliodon*", "*Scoliodon*", "dog fish (a cartilaginous fish)", "डॉग फिश (एक उपास्थिल मछली)"],
        ["*Petromyzon*", "*Petromyzon*", "lamprey (a cyclostome)", "लैम्प्रे (एक साइक्लोस्टोम)"],
        ["*Calotes*", "*Calotes*", "garden lizard (a reptile)", "उद्यान छिपकली (एक सरीसृप)"],
        ["*Ornithorhynchus*", "*Ornithorhynchus*", "platypus, an egg-laying mammal", "प्लैटिपस, अंडे देने वाला स्तनधारी"],
      ],
    },
  ],
  tf: [
    ["Viroids are free RNA molecules that lack a protein coat.", "विषाणुभ (वाइरॉइड) प्रोटीन आवरण रहित मुक्त RNA होते हैं।"],
    ["In lichens, the algal partner is the phycobiont and the fungal partner is the mycobiont.", "लाइकेन में शैवालीय घटक फाइकोबायोंट और कवकीय घटक माइकोबायोंट कहलाता है।"],
    ["Methanogens in the gut of ruminants produce methane (biogas) from their dung.", "जुगाली करने वाले पशुओं की आँत के मीथेनोजन उनके गोबर से मीथेन (बायोगैस) बनाते हैं।"],
    ["*Nostoc* and *Anabaena* fix atmospheric nitrogen in heterocysts.", "*Nostoc* और *Anabaena* विषमकोष्ठों में वायुमंडलीय नाइट्रोजन का स्थिरीकरण करते हैं।"],
    ["*Selaginella* and *Salvinia* are heterosporous pteridophytes.", "*Selaginella* और *Salvinia* विषमबीजाणुक टेरिडोफाइट हैं।"],
    ["In bryophytes, the main plant body is the haploid gametophyte.", "ब्रायोफाइट में मुख्य पादप शरीर अगुणित युग्मकोद्भिद होता है।"],
    ["Over two-thirds of all named animal species are arthropods.", "सभी नामित जंतु जातियों में से दो-तिहाई से अधिक आर्थ्रोपोड हैं।"],
    ["Crocodiles are reptiles with a four-chambered heart.", "मगरमच्छ चार-कक्षीय हृदय वाले सरीसृप हैं।"],
    ["Adult echinoderms are radially symmetrical but their larvae are bilaterally symmetrical.", "वयस्क इकाइनोडर्म अरीय सममित होते हैं, परंतु उनके लार्वा द्विपार्श्व सममित होते हैं।"],
    ["In urochordates, the notochord is present only in the larval tail.", "यूरोकॉर्डेटा में पृष्ठरज्जु केवल लार्वा की पूँछ में होता है।"],
    ["Cartilaginous fishes have no air bladder, so they must swim constantly to avoid sinking.", "उपास्थिल मछलियों में वायु आशय नहीं होता, इसलिए डूबने से बचने के लिए उन्हें लगातार तैरना पड़ता है।"],
    ["*Mycoplasma* completely lacks a cell wall.", "*Mycoplasma* में कोशिका भित्ति बिल्कुल नहीं होती।"],
  ],
  ff: [
    ["A virus particle contains both DNA and RNA.", "विषाणु कण में DNA और RNA दोनों होते हैं।", "A virus has either DNA or RNA, never both.", "विषाणु में DNA या RNA में से केवल एक होता है, दोनों कभी नहीं।"],
    ["Green algae store food as floridean starch.", "हरे शैवाल भोजन फ्लोरिडियन मंड के रूप में संचित करते हैं।", "Floridean starch is the reserve of red algae; green algae store starch.", "फ्लोरिडियन मंड लाल शैवालों का संचित भोजन है; हरे शैवाल मंड संचित करते हैं।"],
    ["The sexual stage of deuteromycetes is commonly seen.", "ड्यूटेरोमाइसिटीज की लैंगिक अवस्था सामान्यतः दिखाई देती है।", "Only asexual or vegetative phases of deuteromycetes are known, hence ‘imperfect fungi’.", "ड्यूटेरोमाइसिटीज की केवल अलैंगिक या कायिक अवस्थाएँ ज्ञात हैं, इसलिए वे ‘अपूर्ण कवक’ हैं।"],
    ["Sponges show tissue level of organisation.", "स्पंजों में ऊतक स्तर का संगठन होता है।", "Sponges (Porifera) show only cellular level of organisation.", "स्पंजों (पोरीफेरा) में केवल कोशिकीय स्तर का संगठन होता है।"],
    ["Ctenophores are bilaterally symmetrical.", "टीनोफोर द्विपार्श्व सममित होते हैं।", "Ctenophores are radially symmetrical and diploblastic.", "टीनोफोर अरीय सममित और द्विस्तरी होते हैं।"],
    ["Flatworms (Platyhelminthes) are pseudocoelomates.", "चपटे कृमि (प्लेटीहेल्मिंथीज) कूटगुहिक होते हैं।", "Flatworms are acoelomates; roundworms (Aschelminthes) are pseudocoelomates.", "चपटे कृमि अगुहीय होते हैं; गोल कृमि (ऐस्केलमिंथीज) कूटगुहिक होते हैं।"],
    ["Cartilaginous fishes have an operculum over the gills.", "उपास्थिल मछलियों में क्लोम पर प्रच्छद (ऑपरकुलम) होता है।", "Their gill slits are separate and uncovered; bony fishes have an operculum.", "उनके क्लोम छिद्र अलग-अलग और खुले होते हैं; अस्थिल मछलियों में प्रच्छद होता है।"],
    ["Birds are poikilothermous (cold-blooded).", "पक्षी असमतापी (शीत रुधिर वाले) होते हैं।", "Birds are homoiothermous: they keep a constant body temperature.", "पक्षी समतापी होते हैं: वे शरीर का ताप स्थिर रखते हैं।"],
    ["In gymnosperms, the ovules are enclosed in an ovary.", "अनावृतबीजियों में बीजांड अंडाशय में बंद होते हैं।", "Gymnosperm ovules are naked, not enclosed by an ovary wall.", "अनावृतबीजियों के बीजांड नग्न होते हैं, अंडाशय भित्ति में बंद नहीं।"],
    ["Diatom cell walls are made of cellulose that decays quickly.", "डायटम की कोशिका भित्ति सेलुलोस की बनी होती है जो जल्दी सड़ जाती है।", "Diatom walls are embedded with silica and are indestructible; they form diatomaceous earth.", "डायटम भित्ति में सिलिका होती है और वह नष्ट नहीं होती; इससे डायटमी मृदा बनती है।"],
    ["Earthworm (*Pheretima*) belongs to Aschelminthes.", "केंचुआ (*Pheretima*) ऐस्केलमिंथीज से संबंधित है।", "*Pheretima* is an annelid: it is metamerically segmented.", "*Pheretima* एक ऐनेलिड है: यह विखंडीय रूप से खंडित है।"],
    ["Bryophytes are the first terrestrial plants to possess vascular tissues.", "ब्रायोफाइट संवहन ऊतक वाले प्रथम स्थलीय पादप हैं।", "Pteridophytes are the first terrestrial plants with xylem and phloem; bryophytes lack them.", "जाइलम और फ्लोएम वाले प्रथम स्थलीय पादप टेरिडोफाइट हैं; ब्रायोफाइट में ये नहीं होते।"],
  ],
  ar: [
    ["Bryophytes are called the amphibians of the plant kingdom.", "ब्रायोफाइट को पादप जगत के उभयचर कहते हैं।", "They live in soil but depend on water for sexual reproduction.", "वे मृदा पर रहते हैं, परंतु लैंगिक जनन के लिए जल पर निर्भर होते हैं।"],
    ["Lichens are good indicators of air pollution.", "लाइकेन वायु प्रदूषण के अच्छे सूचक हैं।", "Lichens do not grow in polluted areas.", "लाइकेन प्रदूषित क्षेत्रों में नहीं उगते।"],
    ["Cartilaginous fishes must swim constantly to avoid sinking.", "उपास्थिल मछलियों को डूबने से बचने के लिए लगातार तैरना पड़ता है।", "They do not have an air bladder.", "उनमें वायु आशय नहीं होता।"],
    ["Deuteromycetes are called imperfect fungi.", "ड्यूटेरोमाइसिटीज को अपूर्ण कवक कहते हैं।", "Only the asexual or vegetative phases of these fungi are known.", "इन कवकों की केवल अलैंगिक या कायिक अवस्थाएँ ज्ञात हैं।"],
    ["Methanogens are used in biogas production.", "बायोगैस उत्पादन में मीथेनोजन का उपयोग होता है।", "They produce methane from the dung of ruminants such as cows and buffaloes.", "वे गाय-भैंस जैसे जुगाली करने वाले पशुओं के गोबर से मीथेन बनाते हैं।"],
    ["Diatomaceous earth is used for polishing and for filtering oils and syrups.", "डायटमी मृदा का उपयोग पॉलिश करने तथा तेलों और शरबतों को छानने में होता है।", "Diatom cell walls contain silica and do not decay, so the deposit is gritty.", "डायटम भित्ति में सिलिका होती है जो नष्ट नहीं होती, इसलिए यह निक्षेप खुरदरा होता है।"],
  ],
};

BANK["cell-structure-and-biomolecules"] = {
  sets: [
    {
      k: ["cell organelle", "कोशिकांग"],
      q: ["Which of the following is true of %?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which cell structure is described as %?", "किस कोशिका संरचना का विवरण यह है: %?"],
      items: [
        ["Mitochondrion", "सूत्रकणिका (माइटोकॉन्ड्रिया)", "site of aerobic respiration (powerhouse of the cell)", "वायवीय श्वसन का स्थल (कोशिका का शक्ति गृह)"],
        ["Chloroplast", "हरितलवक", "traps light energy for photosynthesis", "प्रकाश-संश्लेषण के लिए प्रकाश ऊर्जा का प्रग्रहण"],
        ["Rough ER", "खुरदरी अंतर्द्रव्यी जालिका (RER)", "bears ribosomes; synthesis and secretion of proteins", "राइबोसोम युक्त; प्रोटीन का संश्लेषण और स्रवण"],
        ["Smooth ER", "चिकनी अंतर्द्रव्यी जालिका (SER)", "major site of lipid (steroid hormone) synthesis", "लिपिड (स्टेरॉइडी हॉर्मोन) संश्लेषण का मुख्य स्थल"],
        ["Golgi apparatus", "गॉल्जी सम्मिश्र", "packaging; site of glycoprotein and glycolipid formation", "संवेष्टन; ग्लाइकोप्रोटीन और ग्लाइकोलिपिड निर्माण का स्थल"],
        ["Lysosome", "लयनकाय (लाइसोसोम)", "hydrolytic enzymes that are active at acidic pH", "अम्लीय pH पर सक्रिय जल-अपघटनी एंजाइम"],
        ["Ribosome", "राइबोसोम", "non-membranous granule of RNA and protein", "RNA और प्रोटीन का झिल्ली-रहित कण"],
        ["Centrosome", "तारककाय", "two centrioles with nine peripheral triplet fibrils", "नौ परिधीय त्रिक तंतुकों वाले दो तारककेंद्र"],
        ["Nucleolus", "केंद्रिक", "site of active ribosomal RNA synthesis", "राइबोसोमी RNA संश्लेषण का सक्रिय स्थल"],
        ["Mesosome", "मीसोसोम", "infolding of the plasma membrane in bacteria", "जीवाणुओं में प्लाज्मा झिल्ली का अंतर्वलन"],
        ["Vacuole", "रिक्तिका", "bound by tonoplast; up to 90% of plant cell volume", "टोनोप्लास्ट से घिरी; पादप कोशिका के आयतन का 90% तक"],
      ],
    },
    {
      k: ["biomolecule", "जैव अणु"],
      q: ["Which description fits %?", "% पर कौन-सा विवरण लागू होता है?"],
      rq: ["Which biomolecule is %?", "कौन-सा जैव अणु है: %?"],
      items: [
        ["Cellulose", "सेलुलोस", "glucose polymer that gives no blue colour with iodine", "ग्लूकोस का बहुलक जो आयोडीन से नीला रंग नहीं देता"],
        ["Starch", "मंड (स्टार्च)", "plant reserve whose helices hold iodine (blue colour)", "पादप संचय जिसकी कुंडलियाँ आयोडीन धारण करती हैं (नीला रंग)"],
        ["Inulin", "इनुलिन", "polymer of fructose", "फ्रक्टोस का बहुलक"],
        ["Chitin", "काइटिन", "complex polysaccharide of the arthropod exoskeleton", "आर्थ्रोपोड बाह्यकंकाल का जटिल पॉलीसैकेराइड"],
        ["Glycogen", "ग्लाइकोजन", "storage polysaccharide of animals", "जंतुओं का संचित पॉलीसैकेराइड"],
        ["Lecithin", "लेसिथिन", "a phospholipid of cell membranes", "कोशिका झिल्ली का एक फॉस्फोलिपिड"],
        ["Collagen", "कोलैजन", "most abundant protein in the animal world", "जंतु जगत का सर्वाधिक प्रचुर प्रोटीन"],
        ["RuBisCO", "रूबिस्को (RuBisCO)", "most abundant protein in the whole biosphere", "पूरे जीवमंडल का सर्वाधिक प्रचुर प्रोटीन"],
        ["Glycine", "ग्लाइसिन", "amino acid whose R group is a hydrogen atom", "वह ऐमीनो अम्ल जिसका R समूह हाइड्रोजन है"],
        ["Palmitic acid", "पामिटिक अम्ल", "fatty acid with 16 carbons including the carboxyl carbon", "कार्बोक्सिल कार्बन सहित 16 कार्बन वाला वसा अम्ल"],
        ["Arachidonic acid", "ऐराकिडोनिक अम्ल", "fatty acid with 20 carbon atoms", "20 कार्बन परमाणुओं वाला वसा अम्ल"],
      ],
    },
    {
      k: ["enzyme class", "एंजाइम वर्ग"],
      q: ["Enzymes of the class % catalyse:", "% वर्ग के एंजाइम किसे उत्प्रेरित करते हैं?"],
      rq: ["Which class of enzymes catalyses %?", "कौन-सा एंजाइम वर्ग उत्प्रेरित करता है: %?"],
      items: [
        ["Oxidoreductases (dehydrogenases)", "ऑक्सीडोरिडक्टेज (डिहाइड्रोजिनेज)", "oxidation–reduction between two substrates", "दो क्रियाधारों के बीच ऑक्सीकरण-अपचयन"],
        ["Transferases", "ट्रांसफरेज", "transfer of a group (other than hydrogen) between two substrates", "दो क्रियाधारों के बीच किसी समूह (हाइड्रोजन के अतिरिक्त) का स्थानांतरण"],
        ["Hydrolases", "हाइड्रोलेज", "hydrolysis of ester, ether, peptide or glycosidic bonds", "एस्टर, ईथर, पेप्टाइड या ग्लाइकोसाइडी बंधों का जल-अपघटन"],
        ["Lyases", "लायेज", "removal of groups by a mechanism other than hydrolysis, leaving double bonds", "जल-अपघटन के बिना समूहों को हटाकर द्विबंध बनाना"],
        ["Isomerases", "आइसोमरेज", "inter-conversion of optical, geometric or positional isomers", "प्रकाशिक, ज्यामितीय या स्थितिक समावयवों का अंतर्परिवर्तन"],
        ["Ligases", "लाइगेज", "linking together of two compounds (C–O, C–S, C–N, P–O bonds)", "दो यौगिकों को जोड़ना (C–O, C–S, C–N, P–O बंध)"],
      ],
    },
  ],
  tf: [
    ["Rudolf Virchow explained that new cells arise from pre-existing cells (omnis cellula-e cellula).", "रुडोल्फ विर्चो ने बताया कि नई कोशिकाएँ पूर्ववर्ती कोशिकाओं से बनती हैं (ओम्निस सेलुला-ए सेलुला)।"],
    ["Mitochondria and chloroplasts contain their own DNA and 70S ribosomes.", "सूत्रकणिका और हरितलवक में अपना DNA और 70S राइबोसोम होते हैं।"],
    ["Eukaryotic 80S ribosomes are made of 60S and 40S subunits.", "यूकैरियोटी 80S राइबोसोम 60S और 40S उप-इकाइयों से बने होते हैं।"],
    ["Golgi cisternae have a convex cis (forming) face and a concave trans (maturing) face.", "गॉल्जी कुंडिकाओं में उत्तल सिस (निर्माणकारी) फलक और अवतल ट्रांस (परिपक्व) फलक होता है।"],
    ["Cilia and flagella have a 9 + 2 arrangement of microtubules in the axoneme.", "पक्ष्माभ और कशाभ के अक्षसूत्र में सूक्ष्मनलिकाओं की 9 + 2 व्यवस्था होती है।"],
    ["Plasmids can give bacteria properties such as resistance to antibiotics.", "प्लाज्मिड जीवाणुओं को प्रतिजैविकों के प्रति प्रतिरोध जैसे गुण दे सकते हैं।"],
    ["The human RBC membrane has about 52% protein and 40% lipids.", "मानव RBC की झिल्ली में लगभग 52% प्रोटीन और 40% लिपिड होते हैं।"],
    ["Malonate inhibits succinic dehydrogenase by competing with succinate.", "मैलोनेट सक्सीनेट से स्पर्धा करके सक्सिनिक डिहाइड्रोजिनेज का संदमन करता है।"],
    ["Haem is the prosthetic group of the enzymes peroxidase and catalase.", "हीम, पेरोक्सीडेज और कैटालेज एंजाइमों का सहलग्न समूह है।"],
    ["Zinc is a cofactor of the proteolytic enzyme carboxypeptidase.", "जिंक, प्रोटीन-अपघटनी एंजाइम कार्बोक्सीपेप्टिडेज का सहकारक है।"],
    ["The nucleolus is not bound by a membrane.", "केंद्रिक झिल्ली से घिरा नहीं होता।"],
    ["Coenzymes NAD and NADP contain the vitamin niacin.", "सहएंजाइम NAD और NADP में विटामिन नियासिन होता है।"],
  ],
  ff: [
    ["Lysosomal enzymes are most active at alkaline pH.", "लयनकाय के एंजाइम क्षारीय pH पर सर्वाधिक सक्रिय होते हैं।", "Lysosomal hydrolases are active at acidic pH.", "लयनकाय के जल-अपघटनी एंजाइम अम्लीय pH पर सक्रिय होते हैं।"],
    ["Prokaryotes have a nucleus bounded by a nuclear membrane.", "प्रोकैरियोट में केंद्रक झिल्ली से घिरा केंद्रक होता है।", "Prokaryotes have no nuclear membrane; their genetic material is naked.", "प्रोकैरियोट में केंद्रक झिल्ली नहीं होती; आनुवंशिक पदार्थ नग्न होता है।"],
    ["Prokaryotic ribosomes are of the 80S type.", "प्रोकैरियोटी राइबोसोम 80S प्रकार के होते हैं।", "Prokaryotic ribosomes are 70S; 80S ribosomes occur in the eukaryotic cytoplasm.", "प्रोकैरियोटी राइबोसोम 70S होते हैं; 80S यूकैरियोटी कोशिकाद्रव्य में होते हैं।"],
    ["Centrioles have a 9 + 2 arrangement of microtubules.", "तारककेंद्र में सूक्ष्मनलिकाओं की 9 + 2 व्यवस्था होती है।", "Centrioles have nine peripheral triplets and no central pair; 9 + 2 is the axoneme of cilia.", "तारककेंद्र में नौ परिधीय त्रिक होते हैं, केंद्रीय युग्म नहीं; 9 + 2 पक्ष्माभ का अक्षसूत्र है।"],
    ["Cellulose gives a blue colour with iodine.", "सेलुलोस आयोडीन के साथ नीला रंग देता है।", "Cellulose has no complex helices to hold iodine; starch gives the blue colour.", "सेलुलोस में आयोडीन धारण करने वाली कुंडलियाँ नहीं होतीं; नीला रंग मंड देता है।"],
    ["Inulin is a polymer of glucose.", "इनुलिन ग्लूकोस का बहुलक है।", "Inulin is a polymer of fructose.", "इनुलिन फ्रक्टोस का बहुलक है।"],
    ["Smooth ER is the main site of protein synthesis.", "चिकनी अंतर्द्रव्यी जालिका प्रोटीन संश्लेषण का मुख्य स्थल है।", "SER is the main site of lipid synthesis; ribosome-bearing RER makes proteins.", "SER लिपिड संश्लेषण का मुख्य स्थल है; राइबोसोम युक्त RER प्रोटीन बनाती है।"],
    ["Svedberg units add up, so 50S and 30S subunits form an 80S ribosome.", "स्वेडबर्ग इकाइयाँ जुड़ती हैं, इसलिए 50S और 30S उप-इकाइयाँ 80S राइबोसोम बनाती हैं।", "S values are not additive: 50S + 30S together form a 70S ribosome.", "S मान जुड़ते नहीं हैं: 50S + 30S मिलकर 70S राइबोसोम बनाते हैं।"],
    ["Collagen is the most abundant protein in the whole biosphere.", "कोलैजन पूरे जीवमंडल का सर्वाधिक प्रचुर प्रोटीन है।", "Collagen leads in the animal world; RuBisCO is the most abundant in the biosphere.", "कोलैजन जंतु जगत में सर्वाधिक है; जीवमंडल में सर्वाधिक प्रचुर रूबिस्को है।"],
    ["Mitochondria are present in bacterial cells.", "जीवाणु कोशिकाओं में सूत्रकणिकाएँ होती हैं।", "Prokaryotes lack membrane-bound organelles such as mitochondria.", "प्रोकैरियोट में सूत्रकणिका जैसे झिल्लीबद्ध कोशिकांग नहीं होते।"],
    ["The nucleolus is a membrane-bound organelle.", "केंद्रिक एक झिल्लीबद्ध कोशिकांग है।", "The nucleolus has no membrane; its content is continuous with the nucleoplasm.", "केंद्रिक पर कोई झिल्ली नहीं होती; इसकी सामग्री केंद्रकद्रव्य से सतत होती है।"],
    ["In a competitive inhibition, the inhibitor binds to the substrate.", "स्पर्धी संदमन में संदमक क्रियाधार से जुड़ता है।", "A competitive inhibitor resembles the substrate and binds to the enzyme's active site.", "स्पर्धी संदमक क्रियाधार जैसा होता है और एंजाइम के सक्रिय स्थल से जुड़ता है।"],
  ],
  ar: [
    ["Mitochondria are called the powerhouses of the cell.", "सूत्रकणिका को कोशिका का शक्ति गृह कहते हैं।", "They are the sites of aerobic respiration and produce cellular energy as ATP.", "ये वायवीय श्वसन के स्थल हैं और कोशिकीय ऊर्जा ATP के रूप में बनाते हैं।"],
    ["Starch gives a blue colour with iodine.", "मंड आयोडीन के साथ नीला रंग देता है।", "Starch forms helical secondary structures that can hold I₂ molecules.", "मंड कुंडलित द्वितीयक संरचनाएँ बनाता है जो I₂ अणुओं को धारण कर सकती हैं।"],
    ["Malonate reduces the activity of succinic dehydrogenase.", "मैलोनेट सक्सिनिक डिहाइड्रोजिनेज की सक्रियता घटाता है।", "Malonate closely resembles succinate and competes for the active site.", "मैलोनेट सक्सीनेट से बहुत मिलता-जुलता है और सक्रिय स्थल के लिए स्पर्धा करता है।"],
    ["Lysosomes can digest carbohydrates, lipids, proteins and nucleic acids.", "लयनकाय कार्बोहाइड्रेट, लिपिड, प्रोटीन और न्यूक्लिक अम्ल पचा सकते हैं।", "They contain hydrolytic enzymes (lipases, proteases, carbohydrases) active at acidic pH.", "इनमें अम्लीय pH पर सक्रिय जल-अपघटनी एंजाइम (लाइपेज, प्रोटिएज, कार्बोहाइड्रेज) होते हैं।"],
    ["Ribosomes are not counted among membrane-bound organelles.", "राइबोसोम झिल्लीबद्ध कोशिकांगों में नहीं गिने जाते।", "Ribosomes are made of RNA and protein and have no surrounding membrane.", "राइबोसोम RNA और प्रोटीन से बने होते हैं और उन पर कोई झिल्ली नहीं होती।"],
  ],
};

BANK["cell-cycle-and-cell-division"] = {
  sets: [
    {
      k: ["stage", "अवस्था"],
      q: ["What happens during %?", "% में क्या होता है?"],
      rq: ["During which stage does this happen: %?", "यह किस अवस्था में होता है: %?"],
      items: [
        ["leptotene", "तनुपट्ट (लेप्टोटीन)", "chromosomes gradually become visible under the light microscope", "गुणसूत्र धीरे-धीरे प्रकाश सूक्ष्मदर्शी में दिखाई देने लगते हैं"],
        ["zygotene", "युग्मपट्ट (जाइगोटीन)", "synapsis of homologous chromosomes; synaptonemal complex forms", "समजात गुणसूत्रों का सूत्रयुग्मन; सिनैप्टोनीमल सम्मिश्र बनता है"],
        ["pachytene", "स्थूलपट्ट (पैकीटीन)", "crossing over between non-sister chromatids (recombination nodules)", "असहोदर अर्धगुणसूत्रों के बीच जीन विनिमय (पुनर्योजन ग्रंथिकाएँ)"],
        ["diplotene", "द्विपट्ट (डिप्लोटीन)", "synaptonemal complex dissolves; chiasmata become visible", "सिनैप्टोनीमल सम्मिश्र विघटित होता है; काइएज्मेटा दिखते हैं"],
        ["diakinesis", "पारगतिक्रम (डायकाइनेसिस)", "terminalisation of chiasmata", "काइएज्मेटा का उपांतीभवन"],
        ["metaphase of mitosis", "समसूत्री विभाजन की मध्यावस्था", "chromosomes lie at the equator; best stage to study their morphology", "गुणसूत्र मध्यरेखा पर होते हैं; आकारिकी के अध्ययन की सर्वोत्तम अवस्था"],
        ["anaphase of mitosis", "समसूत्री विभाजन की पश्चावस्था", "centromeres split and sister chromatids move to opposite poles", "गुणसूत्रबिंदु विभाजित होते हैं और सहोदर अर्धगुणसूत्र विपरीत ध्रुवों पर जाते हैं"],
        ["anaphase I", "पश्चावस्था I", "homologous chromosomes separate; sister chromatids stay joined", "समजात गुणसूत्र अलग होते हैं; सहोदर अर्धगुणसूत्र जुड़े रहते हैं"],
        ["telophase of mitosis", "समसूत्री विभाजन की अंत्यावस्था", "nuclear envelope and nucleolus reappear around each chromosome cluster", "प्रत्येक गुणसूत्र समूह के चारों ओर केंद्रक आवरण और केंद्रिक फिर बनते हैं"],
        ["S phase", "S प्रावस्था", "DNA replicates; DNA content doubles, chromosome number does not", "DNA प्रतिकृति; DNA मात्रा दुगुनी होती है, गुणसूत्र संख्या नहीं"],
        ["G₀ phase", "G₀ प्रावस्था", "quiescent cells stay metabolically active but do not proliferate", "निष्क्रिय कोशिकाएँ उपापचयी रूप से सक्रिय रहती हैं पर विभाजित नहीं होतीं"],
      ],
    },
  ],
  tf: [
    ["In a 24-hour human cell cycle, the M phase lasts only about an hour.", "मानव कोशिका के 24 घंटे के कोशिका चक्र में M प्रावस्था केवल लगभग एक घंटा चलती है।"],
    ["Interphase lasts more than 95% of the duration of the cell cycle.", "अंतरावस्था कोशिका चक्र की अवधि के 95% से अधिक समय तक रहती है।"],
    ["In animal cells, the centriole duplicates in the cytoplasm during S phase.", "जंतु कोशिकाओं में S प्रावस्था के दौरान तारककेंद्र कोशिकाद्रव्य में द्विगुणित होता है।"],
    ["Meiosis II resembles a normal mitosis.", "अर्धसूत्री विभाजन II सामान्य समसूत्री विभाजन जैसा होता है।"],
    ["Crossing over is an enzyme-mediated process; the enzyme is called recombinase.", "जीन विनिमय एंजाइम-नियंत्रित प्रक्रिया है; इसका एंजाइम रिकॉम्बिनेज कहलाता है।"],
    ["In oocytes of some vertebrates, diplotene can last for months or years.", "कुछ कशेरुकियों के अंडकों में द्विपट्ट महीनों या वर्षों तक चल सकता है।"],
    ["In plant cells, the cell plate forms in the centre and grows outward to the lateral walls.", "पादप कोशिकाओं में कोशिका पट्ट केंद्र में बनता है और बाहर की ओर पार्श्व भित्तियों तक बढ़ता है।"],
    ["A yeast cell can complete its cell cycle in about 90 minutes.", "यीस्ट कोशिका अपना कोशिका चक्र लगभग 90 मिनट में पूरा कर सकती है।"],
    ["Meiosis halves the chromosome number and increases genetic variability.", "अर्धसूत्री विभाजन गुणसूत्र संख्या आधी करता है और आनुवंशिक विभिन्नता बढ़ाता है।"],
    ["In some social insects, haploid cells also divide by mitosis.", "कुछ सामाजिक कीटों में अगुणित कोशिकाएँ भी समसूत्री विभाजन से विभाजित होती हैं।"],
    ["During mitotic anaphase, the number of chromosomes in the cell temporarily doubles.", "समसूत्री पश्चावस्था में कोशिका में गुणसूत्रों की संख्या अस्थायी रूप से दुगुनी हो जाती है।"],
  ],
  ff: [
    ["The chromosome number doubles during S phase.", "S प्रावस्था में गुणसूत्र संख्या दुगुनी हो जाती है।", "Only the DNA content doubles (2C → 4C); the chromosome number stays the same.", "केवल DNA मात्रा दुगुनी होती है (2C → 4C); गुणसूत्र संख्या वही रहती है।"],
    ["Crossing over takes place during zygotene.", "जीन विनिमय युग्मपट्ट में होता है।", "Zygotene shows synapsis; crossing over occurs in pachytene.", "युग्मपट्ट में सूत्रयुग्मन होता है; जीन विनिमय स्थूलपट्ट में होता है।"],
    ["Sister chromatids separate during anaphase I.", "पश्चावस्था I में सहोदर अर्धगुणसूत्र अलग होते हैं।", "In anaphase I homologues separate; sister chromatids separate in anaphase II.", "पश्चावस्था I में समजात अलग होते हैं; सहोदर अर्धगुणसूत्र पश्चावस्था II में अलग होते हैं।"],
    ["Interphase is a resting phase with no metabolic activity.", "अंतरावस्था एक विश्राम अवस्था है जिसमें कोई उपापचयी क्रिया नहीं होती।", "Interphase is a period of active preparation: the cell grows and replicates DNA.", "अंतरावस्था सक्रिय तैयारी का समय है: कोशिका वृद्धि करती है और DNA प्रतिकृति होती है।"],
    ["The synaptonemal complex forms during diplotene.", "सिनैप्टोनीमल सम्मिश्र द्विपट्ट में बनता है।", "It forms in zygotene and dissolves in diplotene.", "यह युग्मपट्ट में बनता है और द्विपट्ट में विघटित होता है।"],
    ["Mitosis can take place only in diploid cells.", "समसूत्री विभाजन केवल द्विगुणित कोशिकाओं में हो सकता है।", "Haploid cells of some lower plants and social insects also divide by mitosis.", "कुछ निम्न पादपों और सामाजिक कीटों की अगुणित कोशिकाएँ भी समसूत्री विभाजन करती हैं।"],
    ["Animal cells divide their cytoplasm by forming a cell plate.", "जंतु कोशिकाएँ कोशिका पट्ट बनाकर कोशिकाद्रव्य बाँटती हैं।", "Animal cells form a furrow in the plasma membrane; cell plates form in plant cells.", "जंतु कोशिकाओं में प्लाज्मा झिल्ली में खाँच बनती है; कोशिका पट्ट पादप कोशिकाओं में बनता है।"],
    ["Terminalisation of chiasmata takes place in pachytene.", "काइएज्मेटा का उपांतीभवन स्थूलपट्ट में होता है।", "Terminalisation of chiasmata takes place in diakinesis.", "काइएज्मेटा का उपांतीभवन पारगतिक्रम में होता है।"],
    ["Cells in the G₀ phase are dead cells.", "G₀ प्रावस्था की कोशिकाएँ मृत होती हैं।", "G₀ cells are metabolically active; they just do not proliferate unless needed.", "G₀ कोशिकाएँ उपापचयी रूप से सक्रिय होती हैं; वे आवश्यकता होने तक विभाजित नहीं होतीं।"],
    ["Meiosis I is an equational division.", "अर्धसूत्री विभाजन I एक समविभाजन है।", "Meiosis I is reductional (halves the chromosome number); meiosis II is equational.", "अर्धसूत्री विभाजन I न्यूनीकरण विभाजन है; अर्धसूत्री विभाजन II समविभाजन है।"],
  ],
  ar: [
    ["Metaphase is the best stage to study the morphology of chromosomes.", "गुणसूत्रों की आकारिकी के अध्ययन के लिए मध्यावस्था सर्वोत्तम है।", "At metaphase, condensed chromosomes are aligned at the metaphase plate.", "मध्यावस्था में संघनित गुणसूत्र मध्यावस्था पट्टिका पर पंक्तिबद्ध होते हैं।"],
    ["The chromosome number does not change in S phase.", "S प्रावस्था में गुणसूत्र संख्या नहीं बदलती।", "Each replicated chromosome has two sister chromatids held at one centromere.", "प्रत्येक प्रतिकृत गुणसूत्र में एक ही गुणसूत्रबिंदु से जुड़े दो सहोदर अर्धगुणसूत्र होते हैं।"],
    ["Crossing over leads to recombination of genetic material.", "जीन विनिमय से आनुवंशिक पदार्थ का पुनर्योजन होता है।", "Genetic material is exchanged between non-sister chromatids of homologous chromosomes.", "समजात गुणसूत्रों के असहोदर अर्धगुणसूत्रों के बीच आनुवंशिक पदार्थ का आदान-प्रदान होता है।"],
    ["Plant cells divide their cytoplasm by forming a cell plate.", "पादप कोशिकाएँ कोशिका पट्ट बनाकर कोशिकाद्रव्य बाँटती हैं।", "They are enclosed by a relatively inextensible cell wall.", "वे अपेक्षाकृत अवितान्य कोशिका भित्ति से घिरी होती हैं।"],
    ["Meiosis keeps the chromosome number constant from generation to generation.", "अर्धसूत्री विभाजन पीढ़ी-दर-पीढ़ी गुणसूत्र संख्या स्थिर रखता है।", "It halves the chromosome number in gametes, which fertilisation restores.", "यह युग्मकों में गुणसूत्र संख्या आधी करता है, जिसे निषेचन फिर पूरा करता है।"],
  ],
};

BANK["plant-physiology"] = {
  sets: [
    {
      k: ["plant growth regulator", "पादप वृद्धि नियामक"],
      q: ["Which effect is typical of %?", "% का विशिष्ट प्रभाव कौन-सा है?"],
      rq: ["Which plant growth regulator is known for %?", "कौन-सा पादप वृद्धि नियामक इसके लिए जाना जाता है: %?"],
      items: [
        ["Auxin", "ऑक्सिन", "apical dominance and rooting of stem cuttings", "शीर्ष प्रमुखता और तने की कलमों में जड़ निकलना"],
        ["Gibberellin", "जिबरेलिन", "bolting in beet and cabbage; longer grape stalks", "चुकंदर और गोभी में बोल्टिंग; अंगूर के लंबे डंठल"],
        ["Cytokinin", "साइटोकाइनिन", "delays leaf senescence and promotes lateral shoot growth", "पत्ती जीर्णता को टालना और पार्श्व प्ररोह वृद्धि"],
        ["Ethylene", "एथिलीन", "a gaseous regulator that promotes fruit ripening", "फल पकने को बढ़ावा देने वाला गैसीय नियामक"],
        ["Abscisic acid", "एब्सिसिक अम्ल", "stomatal closure; the ‘stress hormone’", "रंध्र बंद करना; ‘प्रतिबल हॉर्मोन’"],
      ],
    },
    {
      k: ["scientist", "वैज्ञानिक"],
      q: ["What is % known for?", "% किस खोज के लिए जाने जाते हैं?"],
      rq: ["Who is known for %?", "किसे इसके लिए जाना जाता है: %?"],
      items: [
        ["Charles and Francis Darwin", "चार्ल्स और फ्रांसिस डार्विन", "bending of canary grass coleoptiles towards light", "कैनरी घास के प्रांकुरचोल का प्रकाश की ओर मुड़ना"],
        ["F.W. Went", "एफ.डब्ल्यू. वेंट", "isolating auxin from tips of oat coleoptiles", "जई के प्रांकुरचोल के शीर्ष से ऑक्सिन का पृथक्करण"],
        ["E. Kurosawa", "ई. कुरोसावा", "‘bakanae’ (foolish seedling) disease of rice, later linked to gibberellic acid", "धान का ‘बकाने’ (मूर्ख नवोद्भिद) रोग, जो बाद में जिबरेलिक अम्ल से जुड़ा"],
        ["Skoog and Miller", "स्कूग और मिलर", "identifying and crystallising kinetin", "काइनेटिन की पहचान और क्रिस्टलन"],
        ["Cousins", "कज़िन्स", "a volatile from ripened oranges that hastened ripening of bananas", "पके संतरों का वाष्पशील पदार्थ जिसने केलों को जल्दी पकाया"],
        ["Joseph Priestley", "जोसेफ प्रीस्टले", "a mint plant restored air spoilt by a burning candle in a bell jar", "बेल जार में जलती मोमबत्ती से दूषित वायु को पुदीने के पौधे ने शुद्ध किया"],
        ["Jan Ingenhousz", "जान इंगेनहाउस", "sunlight is essential, and only green parts release oxygen", "सूर्य का प्रकाश आवश्यक है और केवल हरे भाग ऑक्सीजन छोड़ते हैं"],
        ["T.W. Engelmann", "टी.डब्ल्यू. एंगेलमान", "first action spectrum, using *Cladophora* and aerobic bacteria", "*Cladophora* और वायवीय जीवाणुओं से पहला क्रिया स्पेक्ट्रम"],
        ["Cornelius van Niel", "कॉर्नेलियस वैन नील", "O₂ released in photosynthesis comes from water", "प्रकाश-संश्लेषण में निकली O₂ जल से आती है"],
        ["Melvin Calvin", "मेल्विन केल्विन", "the C₃ pathway of CO₂ fixation, traced with ¹⁴C", "¹⁴C की सहायता से CO₂ स्थिरीकरण का C₃ पथ"],
      ],
    },
    {
      k: ["term", "पद"],
      q: ["Which statement describes %?", "कौन-सा कथन % का वर्णन करता है?"],
      rq: ["Which term matches %?", "कौन-सा पद इससे मेल खाता है: %?"],
      items: [
        ["Photosystem I", "प्रकाशतंत्र I", "reaction centre chlorophyll a absorbs best at 700 nm", "अभिक्रिया केंद्र का क्लोरोफिल a 700 nm पर सर्वाधिक अवशोषण करता है"],
        ["Photosystem II", "प्रकाशतंत्र II", "reaction centre P680; linked to the splitting of water", "अभिक्रिया केंद्र P680; जल-अपघटन से जुड़ा"],
        ["PEP carboxylase", "PEP कार्बोक्सिलेज", "fixes CO₂ in mesophyll cells of C₄ plants", "C₄ पादपों की पर्णमध्योतक कोशिकाओं में CO₂ स्थिर करता है"],
        ["Kranz anatomy", "क्रैंज शारीरिकी", "large bundle-sheath cells around the vascular bundles", "संवहन बंडलों के चारों ओर बड़ी पूलाच्छद कोशिकाएँ"],
        ["Cyclic photophosphorylation", "चक्रीय फोटोफॉस्फोरिलेशन", "only PS I works; ATP but no NADPH is made", "केवल PS I काम करता है; ATP बनता है, NADPH नहीं"],
        ["Glycolysis", "ग्लाइकोलिसिस", "glucose splits into two pyruvic acid in the cytoplasm", "कोशिकाद्रव्य में ग्लूकोस का दो पाइरुविक अम्ल में विखंडन"],
        ["Krebs cycle", "क्रेब्स चक्र", "acetyl CoA joins OAA to form citric acid in the matrix", "मैट्रिक्स में ऐसीटिल CoA, OAA से जुड़कर सिट्रिक अम्ल बनाता है"],
        ["Complex V", "सम्मिश्र V", "ATP synthase with F₀ and F₁ parts", "F₀ और F₁ भागों वाला ATP सिंथेज"],
        ["Cytochrome c oxidase", "साइटोक्रोम c ऑक्सीडेज", "complex IV, which passes electrons to oxygen", "सम्मिश्र IV, जो इलेक्ट्रॉन ऑक्सीजन को देता है"],
      ],
    },
  ],
  tf: [
    ["The Calvin cycle needs 3 ATP and 2 NADPH for every CO₂ fixed.", "केल्विन चक्र में प्रत्येक CO₂ स्थिर करने के लिए 3 ATP और 2 NADPH लगते हैं।"],
    ["In C₄ plants the primary CO₂ acceptor is PEP and the first stable product is the 4-carbon OAA.", "C₄ पादपों में प्राथमिक CO₂ ग्राही PEP है और पहला स्थिर उत्पाद 4-कार्बन OAA है।"],
    ["Photorespiration does not occur in C₄ plants.", "C₄ पादपों में प्रकाश-श्वसन नहीं होता।"],
    ["Splitting of water is associated with PS II, and oxygen is a by-product.", "जल का विघटन PS II से जुड़ा है और ऑक्सीजन एक उप-उत्पाद है।"],
    ["Fermentation gives a net gain of only 2 ATP per glucose.", "किण्वन में प्रति ग्लूकोस केवल 2 ATP का शुद्ध लाभ होता है।"],
    ["Yeasts poison themselves to death when alcohol reaches about 13%.", "ऐल्कोहॉल लगभग 13% होने पर यीस्ट स्वयं को विषाक्त करके मर जाते हैं।"],
    ["The respiratory quotient of tripalmitin (a fat) is about 0.7.", "ट्राइपामिटिन (एक वसा) का श्वसन गुणांक लगभग 0.7 है।"],
    ["The respiratory pathway is better described as amphibolic than as catabolic.", "श्वसन पथ को अपचयी की अपेक्षा उभयचयी कहना अधिक उचित है।"],
    ["ABA acts as an antagonist to gibberellins.", "ABA जिबरेलिन के प्रतिपक्षी के रूप में कार्य करता है।"],
    ["Chlorophyll a is the chief pigment that traps light for photosynthesis.", "क्लोरोफिल a प्रकाश-संश्लेषण में प्रकाश ग्रहण करने वाला मुख्य वर्णक है।"],
    ["Oxygen is the final acceptor of electrons in aerobic respiration.", "वायवीय श्वसन में इलेक्ट्रॉनों का अंतिम ग्राही ऑक्सीजन है।"],
    ["Ethephon releases ethylene and hastens fruit ripening in tomatoes and apples.", "एथेफॉन एथिलीन मुक्त करता है और टमाटर व सेब के फल जल्दी पकाता है।"],
  ],
  ff: [
    ["Photorespiration produces sugar and ATP.", "प्रकाश-श्वसन में शर्करा और ATP बनते हैं।", "Photorespiration makes neither sugar nor ATP; it releases CO₂ and uses ATP.", "प्रकाश-श्वसन में न शर्करा बनती है, न ATP; इसमें CO₂ निकलती है और ATP खर्च होता है।"],
    ["Cyclic photophosphorylation produces both ATP and NADPH.", "चक्रीय फोटोफॉस्फोरिलेशन में ATP और NADPH दोनों बनते हैं।", "Cyclic electron flow uses only PS I and makes ATP alone.", "चक्रीय इलेक्ट्रॉन प्रवाह में केवल PS I काम करता है और केवल ATP बनता है।"],
    ["The O₂ released in photosynthesis comes from CO₂.", "प्रकाश-संश्लेषण में निकली O₂, CO₂ से आती है।", "It comes from water, as van Niel inferred.", "यह जल से आती है, जैसा वैन नील ने निष्कर्ष निकाला।"],
    ["Glycolysis takes place in the mitochondrial matrix.", "ग्लाइकोलिसिस सूत्रकणिका के मैट्रिक्स में होता है।", "Glycolysis takes place in the cytoplasm.", "ग्लाइकोलिसिस कोशिकाद्रव्य में होता है।"],
    ["The respiratory quotient of carbohydrates is about 0.7.", "कार्बोहाइड्रेट का श्वसन गुणांक लगभग 0.7 होता है।", "Carbohydrates give RQ = 1; fats give about 0.7.", "कार्बोहाइड्रेट का RQ = 1 होता है; वसा का लगभग 0.7।"],
    ["Ethylene delays fruit ripening.", "एथिलीन फल पकने में देरी करता है।", "Ethylene promotes (hastens) fruit ripening.", "एथिलीन फल पकने को बढ़ावा देता (तेज करता) है।"],
    ["Cytokinins promote apical dominance.", "साइटोकाइनिन शीर्ष प्रमुखता को बढ़ाते हैं।", "Auxins cause apical dominance; cytokinins help overcome it.", "शीर्ष प्रमुखता ऑक्सिन से होती है; साइटोकाइनिन उसे दूर करने में सहायक हैं।"],
    ["In C₄ plants, RuBisCO is present in the mesophyll cells.", "C₄ पादपों में रूबिस्को पर्णमध्योतक कोशिकाओं में होता है।", "Mesophyll cells of C₄ plants lack RuBisCO; it is in the bundle-sheath cells.", "C₄ पादपों की पर्णमध्योतक कोशिकाओं में रूबिस्को नहीं होता; यह पूलाच्छद कोशिकाओं में होता है।"],
    ["In C₃ plants, the first stable product of CO₂ fixation is OAA.", "C₃ पादपों में CO₂ स्थिरीकरण का पहला स्थिर उत्पाद OAA है।", "In C₃ plants it is 3-phosphoglyceric acid (PGA).", "C₃ पादपों में यह 3-फॉस्फोग्लिसरिक अम्ल (PGA) है।"],
    ["Abscisic acid promotes seed germination.", "एब्सिसिक अम्ल बीज अंकुरण को बढ़ावा देता है।", "ABA induces seed dormancy and inhibits germination.", "ABA बीज प्रसुप्ति लाता है और अंकुरण को रोकता है।"],
    ["In the electron transport system, one NADH gives 2 ATP and one FADH₂ gives 3 ATP.", "इलेक्ट्रॉन परिवहन तंत्र में एक NADH से 2 ATP और एक FADH₂ से 3 ATP बनते हैं।", "It is the reverse: one NADH gives 3 ATP, one FADH₂ gives 2 ATP.", "बात उलटी है: एक NADH से 3 ATP और एक FADH₂ से 2 ATP बनते हैं।"],
    ["The primary CO₂ acceptor in the Calvin cycle is PEP.", "केल्विन चक्र में प्राथमिक CO₂ ग्राही PEP है।", "In the Calvin cycle the acceptor is RuBP (a 5-carbon ketose sugar).", "केल्विन चक्र में ग्राही RuBP (5-कार्बन कीटोज शर्करा) है।"],
  ],
  ar: [
    ["C₄ plants show no photorespiration.", "C₄ पादपों में प्रकाश-श्वसन नहीं होता।", "Their mechanism raises the CO₂ concentration around RuBisCO in bundle-sheath cells.", "उनकी क्रियाविधि पूलाच्छद कोशिकाओं में रूबिस्को के पास CO₂ सांद्रता बढ़ा देती है।"],
    ["Respiration is called an amphibolic pathway.", "श्वसन को उभयचयी पथ कहते हैं।", "It takes part in both breakdown (catabolism) and synthesis (anabolism).", "यह विघटन (अपचय) और संश्लेषण (उपचय) दोनों में भाग लेता है।"],
    ["Cyclic photophosphorylation does not produce NADPH.", "चक्रीय फोटोफॉस्फोरिलेशन में NADPH नहीं बनता।", "The excited electron is cycled back to PS I instead of reaching NADP⁺.", "उत्तेजित इलेक्ट्रॉन NADP⁺ तक न जाकर वापस PS I में लौट आता है।"],
    ["Gibberellins are sprayed on sugarcane crops.", "गन्ने की फसल पर जिबरेलिन का छिड़काव किया जाता है।", "They increase the length of the stem and so raise the yield.", "वे तने की लंबाई बढ़ाते हैं और इस प्रकार उपज बढ़ाते हैं।"],
    ["Spraying ethephon hastens fruit ripening.", "एथेफॉन के छिड़काव से फल जल्दी पकते हैं।", "Ethephon is absorbed by the plant and slowly releases ethylene.", "एथेफॉन पौधे में अवशोषित होकर धीरे-धीरे एथिलीन मुक्त करता है।"],
    ["Fats have a respiratory quotient less than 1.", "वसा का श्वसन गुणांक 1 से कम होता है।", "When fats are respired, more O₂ is consumed than CO₂ is released.", "वसा के श्वसन में जितनी CO₂ निकलती है, उससे अधिक O₂ खर्च होती है।"],
  ],
};

BANK["human-physiology"] = {
  sets: [
    {
      k: ["hormone", "हॉर्मोन"],
      q: ["Where is % produced?", "% कहाँ बनता है?"],
      rq: ["Which hormone comes from %?", "कौन-सा हॉर्मोन यहाँ से आता है: %?"],
      items: [
        ["Melatonin", "मेलाटोनिन", "pineal gland", "पीनियल ग्रंथि"],
        ["Thymosins", "थाइमोसिन", "thymus", "थाइमस"],
        ["Glucagon", "ग्लूकैगॉन", "α-cells of the islets of Langerhans", "लैंगरहैंस द्वीपों की α-कोशिकाएँ"],
        ["Insulin", "इंसुलिन", "β-cells of the islets of Langerhans", "लैंगरहैंस द्वीपों की β-कोशिकाएँ"],
        ["Aldosterone", "ऐल्डोस्टेरोन", "adrenal cortex", "अधिवृक्क वल्कुट"],
        ["Adrenaline", "एड्रीनलीन", "adrenal medulla", "अधिवृक्क मध्यांश"],
        ["Vasopressin (ADH)", "वैसोप्रेसिन (ADH)", "made in the hypothalamus, released from the posterior pituitary", "अधश्चेतक में बनकर पश्च पीयूष से मुक्त"],
        ["Thyrocalcitonin", "थायरोकैल्सिटोनिन", "thyroid gland", "अवटु (थायरॉइड) ग्रंथि"],
        ["Parathyroid hormone", "पैराथायरॉइड हॉर्मोन", "parathyroid glands", "परावटु ग्रंथियाँ"],
        ["Atrial natriuretic factor", "एट्रियल नेट्रियूरेटिक कारक", "atrial wall of the heart", "हृदय की अलिंद भित्ति"],
        ["Erythropoietin", "एरिथ्रोपोइटिन", "juxtaglomerular cells of the kidney", "वृक्क की जक्स्टाग्लोमेरुलर कोशिकाएँ"],
      ],
    },
    {
      k: ["disorder", "विकार"],
      q: ["What is the cause of %?", "% का कारण क्या है?"],
      rq: ["Which disorder results from %?", "कौन-सा विकार इससे होता है: %?"],
      items: [
        ["Diabetes insipidus", "डायबिटीज इंसिपिडस", "deficiency of ADH (vasopressin)", "ADH (वैसोप्रेसिन) की कमी"],
        ["Acromegaly", "एक्रोमेगली", "excess growth hormone in adults", "वयस्कों में वृद्धि हॉर्मोन की अधिकता"],
        ["Pituitary dwarfism", "पीयूष बौनापन", "low secretion of growth hormone in childhood", "बचपन में वृद्धि हॉर्मोन का कम स्रवण"],
        ["Cretinism", "क्रेटिनता", "hypothyroidism during pregnancy affecting the baby", "गर्भावस्था में अल्पअवटुता जिसका असर शिशु पर होता है"],
        ["Exophthalmic goitre", "नेत्रोत्सेधी गलगंड", "hyperthyroidism with protruding eyeballs", "उभरी आँखों सहित अतिअवटुता"],
        ["Addison's disease", "एडिसन रोग", "underproduction of hormones by the adrenal cortex", "अधिवृक्क वल्कुट द्वारा हॉर्मोनों का कम उत्पादन"],
        ["Uraemia", "यूरीमिया", "accumulation of urea in blood due to kidney failure", "वृक्क खराबी से रक्त में यूरिया का संचय"],
        ["Emphysema", "वातस्फीति (एम्फाइसीमा)", "damaged alveolar walls, mainly from cigarette smoking", "कूपिका भित्तियों की क्षति, मुख्यतः धूम्रपान से"],
        ["Myasthenia gravis", "मायस्थेनिया ग्रेविस", "autoimmune disorder of the neuromuscular junction", "तंत्रिका-पेशी संधि का स्वप्रतिरक्षी विकार"],
        ["Gout", "गाउट", "accumulation of uric acid crystals in joints", "जोड़ों में यूरिक अम्ल के क्रिस्टलों का जमाव"],
        ["Angina", "एंजाइना", "acute chest pain when too little O₂ reaches the heart muscle", "हृदय पेशी तक कम O₂ पहुँचने पर तीव्र सीने का दर्द"],
      ],
    },
    {
      k: ["structure", "संरचना"],
      q: ["Which statement is true for %?", "% के लिए कौन-सा कथन सही है?"],
      rq: ["Which structure fits: %?", "कौन-सी संरचना इससे मेल खाती है: %?"],
      items: [
        ["P-wave of ECG", "ECG की P-तरंग", "depolarisation of the atria", "अलिंदों का विध्रुवण"],
        ["QRS complex", "QRS सम्मिश्र", "depolarisation of the ventricles", "निलयों का विध्रुवण"],
        ["T-wave of ECG", "ECG की T-तरंग", "return of the ventricles to the normal state (repolarisation)", "निलयों की सामान्य अवस्था में वापसी (पुनर्ध्रुवण)"],
        ["SA node", "SA गाँठ", "pacemaker generating 70–75 action potentials per minute", "प्रति मिनट 70–75 क्रिया विभव उत्पन्न करने वाला गति प्रेरक"],
        ["Proximal convoluted tubule", "समीपस्थ संवलित नलिका", "reabsorbs nearly all nutrients and 70–80% of electrolytes and water", "लगभग सभी पोषक और 70–80% विद्युत-अपघट्य व जल का पुनरवशोषण"],
        ["Descending limb of Henle's loop", "हेनले लूप की अवरोही भुजा", "permeable to water, almost impermeable to electrolytes", "जल के लिए पारगम्य, विद्युत-अपघट्यों के लिए लगभग अपारगम्य"],
        ["Ascending limb of Henle's loop", "हेनले लूप की आरोही भुजा", "impermeable to water but transports electrolytes", "जल के लिए अपारगम्य, पर विद्युत-अपघट्यों का परिवहन"],
        ["Juxtaglomerular apparatus", "जक्स्टाग्लोमेरुलर उपकरण", "releases renin when GFR falls", "GFR घटने पर रेनिन मुक्त करता है"],
        ["Sarcomere", "सार्कोमियर", "functional unit of contraction between two Z-lines", "दो Z-रेखाओं के बीच संकुचन की क्रियात्मक इकाई"],
      ],
    },
  ],
  tf: [
    ["About 97% of O₂ is carried by RBCs; the rest is dissolved in plasma.", "लगभग 97% O₂ लाल रुधिर कणिकाएँ ले जाती हैं; शेष प्लाज्मा में घुली रहती है।"],
    ["About 70% of CO₂ is carried in blood as bicarbonate.", "लगभग 70% CO₂ रक्त में बाइकार्बोनेट के रूप में जाती है।"],
    ["Every 100 mL of oxygenated blood delivers about 5 mL of O₂ to the tissues.", "प्रत्येक 100 mL ऑक्सीजनित रक्त ऊतकों को लगभग 5 mL O₂ देता है।"],
    ["Neutrophils are the most abundant leucocytes (60–65%).", "न्यूट्रोफिल सबसे अधिक संख्या वाली श्वेत रुधिर कणिकाएँ (60–65%) हैं।"],
    ["The descending limb of Henle's loop is permeable to water.", "हेनले लूप की अवरोही भुजा जल के लिए पारगम्य है।"],
    ["During muscle contraction the I-bands shorten while the A-bands keep their length.", "पेशी संकुचन में I-पट्ट छोटे होते हैं जबकि A-पट्ट की लंबाई बनी रहती है।"],
    ["The sodium–potassium pump moves 3 Na⁺ out of the cell for every 2 K⁺ moved in.", "सोडियम-पोटैशियम पंप हर 2 K⁺ अंदर लाने पर 3 Na⁺ बाहर भेजता है।"],
    ["Birds, reptiles, land snails and insects are uricotelic.", "पक्षी, सरीसृप, स्थलीय घोंघे और कीट यूरिकोटेलिक हैं।"],
    ["The human vertebral column has 26 vertebrae.", "मानव कशेरुक दंड में 26 कशेरुकाएँ होती हैं।"],
    ["Each human limb is made of 30 bones.", "मनुष्य का प्रत्येक पाद (हाथ या पैर) 30 अस्थियों से बना होता है।"],
    ["ANF causes vasodilation and lowers blood pressure.", "ANF वाहिका विस्फारण करके रक्तचाप घटाता है।"],
    ["Each kidney has nearly one million nephrons.", "प्रत्येक वृक्क में लगभग दस लाख वृक्काणु होते हैं।"],
  ],
  ff: [
    ["Vital capacity includes the residual volume.", "जैव क्षमता में अवशिष्ट आयतन सम्मिलित होता है।", "VC = ERV + TV + IRV; the residual volume can never be breathed out.", "VC = ERV + TV + IRV; अवशिष्ट आयतन कभी बाहर नहीं निकाला जा सकता।"],
    ["The ‘lub’ sound is caused by closure of the semilunar valves.", "‘लब’ ध्वनि अर्धचंद्र कपाटों के बंद होने से होती है।", "‘Lub’ is closure of the tricuspid and bicuspid valves; ‘dub’ is the semilunar valves.", "‘लब’ त्रिवलनी और द्विवलनी कपाटों के बंद होने से, ‘डब’ अर्धचंद्र कपाटों से होती है।"],
    ["The ascending limb of Henle's loop is permeable to water.", "हेनले लूप की आरोही भुजा जल के लिए पारगम्य है।", "It is impermeable to water; it transports electrolytes.", "यह जल के लिए अपारगम्य है; इसमें विद्युत-अपघट्यों का परिवहन होता है।"],
    ["Insulin is secreted by the α-cells of the islets of Langerhans.", "इंसुलिन लैंगरहैंस द्वीपों की α-कोशिकाओं से स्रावित होता है।", "β-cells secrete insulin; α-cells secrete glucagon.", "β-कोशिकाएँ इंसुलिन और α-कोशिकाएँ ग्लूकैगॉन स्रावित करती हैं।"],
    ["Mammals are ammonotelic.", "स्तनधारी अमोनियोटेलिक होते हैं।", "Mammals are ureotelic; bony fishes and aquatic amphibians are ammonotelic.", "स्तनधारी यूरियोटेलिक हैं; अस्थिल मछलियाँ और जलीय उभयचर अमोनियोटेलिक हैं।"],
    ["The T-wave of an ECG shows depolarisation of the ventricles.", "ECG की T-तरंग निलयों का विध्रुवण दर्शाती है।", "The QRS complex is ventricular depolarisation; the T-wave is their return to normal.", "QRS सम्मिश्र निलयी विध्रुवण है; T-तरंग उनकी सामान्य अवस्था में वापसी है।"],
    ["ANF causes vasoconstriction and raises blood pressure.", "ANF वाहिका संकीर्णन करके रक्तचाप बढ़ाता है।", "ANF causes vasodilation, lowers blood pressure and checks the renin–angiotensin mechanism.", "ANF वाहिका विस्फारण करता है, रक्तचाप घटाता है और रेनिन-एंजियोटेंसिन क्रियाविधि पर रोक लगाता है।"],
    ["Most CO₂ is carried in blood as carbamino-haemoglobin.", "अधिकांश CO₂ रक्त में कार्बैमिनो-हीमोग्लोबिन के रूप में जाती है।", "About 70% goes as bicarbonate; only 20–25% as carbamino-haemoglobin.", "लगभग 70% बाइकार्बोनेट के रूप में जाती है; केवल 20–25% कार्बैमिनो-हीमोग्लोबिन के रूप में।"],
    ["During muscle contraction the A-band shortens.", "पेशी संकुचन में A-पट्ट छोटा हो जाता है।", "The A-band keeps its length; the I-bands shorten as actin slides over myosin.", "A-पट्ट की लंबाई वही रहती है; ऐक्टिन के मायोसिन पर फिसलने से I-पट्ट छोटे होते हैं।"],
    ["pO₂ in the alveoli is lower than in deoxygenated blood.", "कूपिकाओं में pO₂ विऑक्सीजनित रक्त से कम होता है।", "Alveolar pO₂ (104 mm Hg) is higher than that of deoxygenated blood (40 mm Hg).", "कूपिकाओं का pO₂ (104 mm Hg) विऑक्सीजनित रक्त (40 mm Hg) से अधिक है।"],
    ["Glucagon lowers the blood glucose level.", "ग्लूकैगॉन रक्त ग्लूकोस स्तर घटाता है।", "Glucagon is hyperglycaemic (raises glucose); insulin is hypoglycaemic.", "ग्लूकैगॉन अतिग्लाइसीमिक है (ग्लूकोस बढ़ाता है); इंसुलिन अल्पग्लाइसीमिक है।"],
    ["Neutrophils are the least abundant leucocytes.", "न्यूट्रोफिल सबसे कम संख्या वाली श्वेत रुधिर कणिकाएँ हैं।", "Neutrophils are the most abundant (60–65%); basophils are the least.", "न्यूट्रोफिल सबसे अधिक (60–65%) हैं; बेसोफिल सबसे कम।"],
  ],
  ar: [
    ["Per unit difference in partial pressure, far more CO₂ than O₂ diffuses across the respiratory membrane.", "आंशिक दाब के प्रति इकाई अंतर पर श्वसन झिल्ली से O₂ की तुलना में कहीं अधिक CO₂ विसरित होती है।", "CO₂ is 20–25 times more soluble than O₂.", "CO₂ की विलेयता O₂ से 20–25 गुना अधिक है।"],
    ["The SA node is called the pacemaker of the heart.", "SA गाँठ को हृदय का गति प्रेरक कहते हैं।", "It generates the maximum number of action potentials (70–75 per minute).", "यह सबसे अधिक क्रिया विभव (70–75 प्रति मिनट) उत्पन्न करती है।"],
    ["Deficiency of ADH causes diabetes insipidus.", "ADH की कमी से डायबिटीज इंसिपिडस होता है।", "Without ADH, less water is reabsorbed from the tubules and much dilute urine is lost.", "ADH के बिना नलिकाओं से कम जल पुनरवशोषित होता है और बहुत तनु मूत्र निकलता है।"],
    ["Bony fishes are ammonotelic.", "अस्थिल मछलियाँ अमोनियोटेलिक होती हैं।", "Ammonia is readily soluble and diffuses out across the gill surfaces.", "अमोनिया आसानी से घुलनशील है और क्लोम सतहों से विसरित होकर निकल जाती है।"],
    ["Oxyhaemoglobin forms readily in the alveoli.", "कूपिकाओं में ऑक्सीहीमोग्लोबिन आसानी से बनता है।", "Alveoli have high pO₂, low pCO₂, fewer H⁺ ions and lower temperature.", "कूपिकाओं में pO₂ अधिक, pCO₂ कम, H⁺ आयन कम और ताप कम होता है।"],
    ["The I-band shortens during muscle contraction.", "पेशी संकुचन में I-पट्ट छोटा होता है।", "Thin actin filaments slide over thick myosin filaments towards the centre of the A-band.", "पतले ऐक्टिन तंतु मोटे मायोसिन तंतुओं पर A-पट्ट के केंद्र की ओर फिसलते हैं।"],
  ],
};

BANK["reproduction"] = {
  sets: [
    {
      k: ["structure", "संरचना"],
      q: ["What is the role of %?", "% की भूमिका क्या है?"],
      rq: ["Which structure or process is described as %?", "किस संरचना या प्रक्रिया का विवरण यह है: %?"],
      items: [
        ["Sertoli cells", "सर्टोली कोशिकाएँ", "nourish the germ cells in the seminiferous tubules", "शुक्रजनक नलिकाओं में जनन कोशिकाओं का पोषण"],
        ["Leydig cells", "लेडिग कोशिकाएँ", "interstitial cells that secrete androgens", "एंड्रोजन स्रावित करने वाली अंतराली कोशिकाएँ"],
        ["Corpus luteum", "पीत पिंड", "secretes large amounts of progesterone in the luteal phase", "पीतपिंडी प्रावस्था में अधिक मात्रा में प्रोजेस्टेरोन स्रावित करता है"],
        ["Trophoblast", "पोषकोरक", "outer layer of the blastocyst that attaches to the endometrium", "कोरकपुटी की बाहरी परत जो गर्भाशय अंतःस्तर से चिपकती है"],
        ["Inner cell mass", "आंतरिक कोशिका समूह", "cells of the blastocyst that form the embryo", "कोरकपुटी की वे कोशिकाएँ जिनसे भ्रूण बनता है"],
        ["Acrosome", "अग्रपिंडक", "cap on the sperm head with enzymes that help fertilisation", "शुक्राणु शीर्ष की टोपी जिसके एंजाइम निषेचन में सहायक हैं"],
        ["Graafian follicle", "ग्राफी पुटक", "mature follicle that ruptures to release the secondary oocyte", "परिपक्व पुटक जो फटकर द्वितीयक अंडक मुक्त करता है"],
        ["Spermiogenesis", "शुक्राणुजनन (स्पर्मियोजेनेसिस)", "transformation of spermatids into spermatozoa", "शुक्राणुप्रसू का शुक्राणुओं में रूपांतरण"],
        ["Spermiation", "शुक्राणु-मोचन (स्पर्मिएशन)", "release of sperms from the seminiferous tubules", "शुक्रजनक नलिकाओं से शुक्राणुओं का मुक्त होना"],
        ["Zona pellucida", "पारदर्शी अंडावरण", "layer whose changes block entry of additional sperms", "वह परत जिसके परिवर्तन अतिरिक्त शुक्राणुओं का प्रवेश रोकते हैं"],
      ],
    },
    {
      k: ["term", "पद"],
      q: ["Which statement describes %?", "कौन-सा कथन % का वर्णन करता है?"],
      rq: ["Which term is defined as %?", "किस पद की परिभाषा यह है: %?"],
      items: [
        ["Tapetum", "टेपीटम", "innermost wall layer of the microsporangium that nourishes pollen", "लघुबीजाणुधानी की सबसे भीतरी भित्ति परत जो परागकणों का पोषण करती है"],
        ["Exine", "बाह्यचोल", "pollen wall layer made of sporopollenin", "स्पोरोपोलेनिन से बनी परागकण भित्ति परत"],
        ["Germ pores", "जनन छिद्र", "regions of the pollen wall where sporopollenin is absent", "परागकण भित्ति के वे भाग जहाँ स्पोरोपोलेनिन नहीं होता"],
        ["Synergids", "सहायक कोशिकाएँ", "cells with a filiform apparatus that guides the pollen tube", "तंतुरूप उपकरण वाली कोशिकाएँ जो पराग नलिका को मार्ग दिखाती हैं"],
        ["Triple fusion", "त्रिसंलयन", "male gamete + two polar nuclei → primary endosperm nucleus", "नर युग्मक + दो ध्रुवीय केंद्रक → प्राथमिक भ्रूणपोष केंद्रक"],
        ["Perisperm", "परिभ्रूणपोष", "persistent nucellus, as in black pepper and beet", "स्थायी बीजांडकाय, जैसे काली मिर्च और चुकंदर में"],
        ["Scutellum", "प्रशल्क (स्कुटेलम)", "the single cotyledon of a grass embryo", "घास के भ्रूण का एकमात्र बीजपत्र"],
        ["Polyembryony", "बहुभ्रूणता", "more than one embryo in a seed, as in citrus and mango", "एक बीज में एक से अधिक भ्रूण, जैसे नींबू वंश और आम में"],
        ["Apomixis", "असंगजनन", "formation of seeds without fertilisation", "निषेचन के बिना बीज बनना"],
        ["Parthenocarpy", "अनिषेकफलन", "development of fruit without fertilisation, as in banana", "निषेचन के बिना फल का विकास, जैसे केले में"],
        ["Geitonogamy", "सजातपुष्पी परागण", "transfer of pollen to another flower of the same plant", "उसी पौधे के दूसरे पुष्प पर परागकणों का स्थानांतरण"],
        ["Cleistogamy", "अनुन्मील्यता", "flowers that never open, as in *Viola*, *Oxalis* and *Commelina*", "कभी न खुलने वाले पुष्प, जैसे *Viola*, *Oxalis* और *Commelina*"],
      ],
    },
  ],
  tf: [
    ["Primary oocytes enter prophase I and get temporarily arrested there.", "प्राथमिक अंडक पूर्वावस्था I में प्रवेश करके वहीं अस्थायी रूप से रुक जाते हैं।"],
    ["Entry of the sperm induces the secondary oocyte to complete meiosis II.", "शुक्राणु के प्रवेश से द्वितीयक अंडक अर्धसूत्री विभाजन II पूरा करता है।"],
    ["At puberty, only 60,000–80,000 primary follicles are left in each ovary.", "यौवनारंभ पर प्रत्येक अंडाशय में केवल 60,000–80,000 प्राथमिक पुटक बचते हैं।"],
    ["Ovulation occurs around the 14th day of a 28-day menstrual cycle.", "28 दिन के आर्तव चक्र में अंडोत्सर्ग लगभग 14वें दिन होता है।"],
    ["The LH surge induces rupture of the Graafian follicle.", "LH का चरम स्तर ग्राफी पुटक को फटने के लिए प्रेरित करता है।"],
    ["In humans, the sperm decides the sex of the baby.", "मनुष्य में शिशु का लिंग शुक्राणु निर्धारित करता है।"],
    ["Coconut water is free-nuclear endosperm.", "नारियल पानी मुक्त-केंद्रकी भ्रूणपोष है।"],
    ["Pollen grains of rice and wheat lose viability within about 30 minutes of release.", "धान और गेहूँ के परागकण निकलने के लगभग 30 मिनट में अपनी जीवनक्षमता खो देते हैं।"],
    ["Geitonogamy is functionally cross-pollination but genetically similar to autogamy.", "सजातपुष्पी परागण क्रियात्मक रूप से पर-परागण है, पर आनुवंशिक रूप से स्वयुग्मन जैसा है।"],
    ["In over 60% of angiosperms, pollen grains are shed at the 2-celled stage.", "60% से अधिक आवृतबीजियों में परागकण 2-कोशिकीय अवस्था में मुक्त होते हैं।"],
    ["In angiosperms, endosperm development precedes embryo development.", "आवृतबीजियों में भ्रूणपोष का विकास भ्रूण के विकास से पहले होता है।"],
    ["Cleistogamous flowers give assured seed-set even without pollinators.", "अनुन्मील्य पुष्प परागणकर्ताओं के बिना भी निश्चित बीज बनाते हैं।"],
  ],
  ff: [
    ["Each primary oocyte forms four ova.", "प्रत्येक प्राथमिक अंडक से चार अंडाणु बनते हैं।", "One primary oocyte gives one ovum (the rest are polar bodies).", "एक प्राथमिक अंडक से एक ही अंडाणु बनता है (शेष ध्रुवीय पिंड होते हैं)।"],
    ["Leydig cells nourish the developing sperms.", "लेडिग कोशिकाएँ विकसित होते शुक्राणुओं का पोषण करती हैं।", "Sertoli cells nourish germ cells; Leydig cells secrete androgens.", "सर्टोली कोशिकाएँ पोषण करती हैं; लेडिग कोशिकाएँ एंड्रोजन स्रावित करती हैं।"],
    ["In humans, fertilisation takes place in the uterus.", "मनुष्य में निषेचन गर्भाशय में होता है।", "It takes place in the ampullary region of the fallopian tube.", "यह अंडवाहिनी के तुंबिका क्षेत्र में होता है।"],
    ["The corpus luteum secretes large amounts of LH.", "पीत पिंड अधिक मात्रा में LH स्रावित करता है।", "The corpus luteum secretes large amounts of progesterone.", "पीत पिंड अधिक मात्रा में प्रोजेस्टेरोन स्रावित करता है।"],
    ["Implantation takes place at the morula stage.", "अंतर्रोपण तूतक (मोरुला) अवस्था में होता है।", "The blastocyst becomes embedded in the endometrium.", "कोरकपुटी गर्भाशय अंतःस्तर में अंतःस्थापित होती है।"],
    ["The endosperm of angiosperms is diploid.", "आवृतबीजियों का भ्रूणपोष द्विगुणित होता है।", "It is triploid (3n), formed by triple fusion.", "यह त्रिगुणित (3n) होता है और त्रिसंलयन से बनता है।"],
    ["A typical embryo sac is 8-celled and 8-nucleate.", "सामान्य भ्रूणकोष 8-कोशिकीय और 8-केंद्रकी होता है।", "It is 7-celled and 8-nucleate: the central cell has two polar nuclei.", "यह 7-कोशिकीय और 8-केंद्रकी होता है: केंद्रीय कोशिका में दो ध्रुवीय केंद्रक होते हैं।"],
    ["Germ pores of pollen are rich in sporopollenin.", "परागकण के जनन छिद्रों में स्पोरोपोलेनिन प्रचुर होता है।", "Germ pores are apertures where sporopollenin is absent.", "जनन छिद्र वे स्थान हैं जहाँ स्पोरोपोलेनिन नहीं होता।"],
    ["Wind-pollinated flowers produce few, heavy and sticky pollen grains.", "वायु-परागित पुष्प कम, भारी और चिपचिपे परागकण बनाते हैं।", "Their pollen grains are light, non-sticky and produced in large numbers.", "उनके परागकण हल्के, चिपचिपाहट रहित और बहुत अधिक संख्या में होते हैं।"],
    ["Groundnut and pea seeds are albuminous.", "मूँगफली और मटर के बीज भ्रूणपोषी होते हैं।", "They are non-albuminous: the embryo consumes the endosperm completely.", "वे अभ्रूणपोषी हैं: भ्रूण भ्रूणपोष को पूरी तरह उपयोग कर लेता है।"],
    ["In humans, the ovum decides the sex of the child.", "मनुष्य में अंडाणु शिशु का लिंग निर्धारित करता है।", "Every ovum carries an X; the sperm (X or Y) decides the sex.", "प्रत्येक अंडाणु में X होता है; लिंग शुक्राणु (X या Y) से तय होता है।"],
    ["Banana is a classic example of polyembryony.", "केला बहुभ्रूणता का प्रमुख उदाहरण है।", "Banana shows parthenocarpy; polyembryony is seen in citrus and mango.", "केले में अनिषेकफलन होता है; बहुभ्रूणता नींबू वंश और आम में दिखती है।"],
  ],
  ar: [
    ["Pollen grains are well preserved as fossils.", "परागकण जीवाश्म के रूप में अच्छी तरह संरक्षित रहते हैं।", "Their exine is made of sporopollenin, which resists high temperature, strong acids and alkalis.", "उनका बाह्यचोल स्पोरोपोलेनिन का बना है, जो उच्च ताप, प्रबल अम्लों और क्षारों को सह लेता है।"],
    ["Geitonogamy is genetically similar to autogamy.", "सजातपुष्पी परागण आनुवंशिक रूप से स्वयुग्मन जैसा है।", "The pollen grains come from the same plant.", "परागकण उसी पौधे से आते हैं।"],
    ["Mature seeds of pea and groundnut have no endosperm.", "मटर और मूँगफली के परिपक्व बीजों में भ्रूणपोष नहीं होता।", "The developing embryo completely consumes the endosperm before the seed matures.", "बीज परिपक्व होने से पहले विकसित भ्रूण भ्रूणपोष को पूरी तरह खा लेता है।"],
    ["Menstruation occurs when the ovum is not fertilised.", "अंडाणु का निषेचन न होने पर आर्तव स्राव होता है।", "Without fertilisation the corpus luteum degenerates, and the endometrium breaks down.", "निषेचन न होने पर पीत पिंड नष्ट होता है और गर्भाशय अंतःस्तर टूट जाता है।"],
    ["Ovulation occurs around the middle of the menstrual cycle.", "अंडोत्सर्ग आर्तव चक्र के लगभग मध्य में होता है।", "LH and FSH reach their peak levels in the middle of the cycle.", "चक्र के मध्य में LH और FSH अपने चरम स्तर पर होते हैं।"],
  ],
};

BANK["genetics-and-inheritance"] = {
  sets: [
    {
      k: ["disorder", "विकार"],
      q: ["Which statement about % is correct?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which disorder fits this description: %?", "कौन-सा विकार इस विवरण से मेल खाता है: %?"],
      items: [
        ["Haemophilia", "हीमोफीलिया", "X-linked recessive; a blood-clotting protein is affected", "X-सहलग्न अप्रभावी; रक्त स्कंदन का एक प्रोटीन प्रभावित"],
        ["Colour blindness", "वर्णांधता", "X-linked recessive; red or green cone defect", "X-सहलग्न अप्रभावी; लाल या हरे शंकु का दोष"],
        ["Sickle-cell anaemia", "दात्र कोशिका अरक्तता", "autosomal recessive; Glu → Val at position 6 of β-globin", "अलिंग गुणसूत्री अप्रभावी; β-ग्लोबिन के छठे स्थान पर Glu → Val"],
        ["Phenylketonuria", "फीनाइलकीटोन्यूरिया", "autosomal recessive; phenylalanine is not converted to tyrosine", "अलिंग गुणसूत्री अप्रभावी; फीनाइलऐलेनीन टाइरोसीन में नहीं बदलता"],
        ["Thalassemia", "थैलेसीमिया", "autosomal recessive; too few globin chains are made", "अलिंग गुणसूत्री अप्रभावी; ग्लोबिन शृंखलाएँ बहुत कम बनती हैं"],
        ["Myotonic dystrophy", "मायोटोनिक डिस्ट्रॉफी", "an autosomal dominant trait", "एक अलिंग गुणसूत्री प्रभावी लक्षण"],
        ["Down's syndrome", "डाउन सिंड्रोम", "trisomy of chromosome 21", "गुणसूत्र 21 की त्रिसूत्रता"],
        ["Klinefelter's syndrome", "क्लाइनफेल्टर सिंड्रोम", "47, XXY; a male with some feminine development", "47, XXY; कुछ स्त्रैण विकास वाला पुरुष"],
        ["Turner's syndrome", "टर्नर सिंड्रोम", "45, X0; sterile female with rudimentary ovaries", "45, X0; अल्पविकसित अंडाशय वाली बंध्य स्त्री"],
      ],
    },
    {
      k: ["term", "पद"],
      q: ["Which example or meaning fits %?", "% का अर्थ या उदाहरण कौन-सा है?"],
      rq: ["Which term fits this description: %?", "कौन-सा पद इस विवरण से मेल खाता है: %?"],
      items: [
        ["Incomplete dominance", "अपूर्ण प्रभाविता", "F₁ is intermediate, e.g. pink snapdragon", "F₁ मध्यवर्ती, जैसे गुलाबी स्नैपड्रैगन"],
        ["Co-dominance", "सहप्रभाविता", "both alleles fully expressed, e.g. AB blood group", "दोनों युग्मविकल्पी पूर्णतः अभिव्यक्त, जैसे AB रक्त समूह"],
        ["Pleiotropy", "बहुप्रभाविता", "one gene affecting several phenotypic traits, e.g. phenylketonuria", "एक जीन से कई लक्षणप्ररूप प्रभावित, जैसे फीनाइलकीटोन्यूरिया"],
        ["Polygenic inheritance", "बहुजीनी वंशागति", "trait controlled by three or more genes, e.g. human skin colour", "तीन या अधिक जीनों से नियंत्रित लक्षण, जैसे मानव त्वचा का रंग"],
        ["Linkage", "सहलग्नता", "physical association of genes on one chromosome", "एक गुणसूत्र पर जीनों का भौतिक जुड़ाव"],
        ["Test cross", "परीक्षार्थ संकरण", "crossing a dominant-phenotype organism with the recessive parent", "प्रभावी लक्षणप्ररूप वाले जीव का अप्रभावी जनक से संकरण"],
        ["Multiple alleles", "बहु-युग्मविकल्पी", "more than two alleles of one gene in a population", "समष्टि में एक जीन के दो से अधिक युग्मविकल्पी"],
        ["Aneuploidy", "असुगुणिता", "gain or loss of one or more chromosomes", "एक या अधिक गुणसूत्रों की वृद्धि या कमी"],
        ["Polyploidy", "बहुगुणिता", "increase in whole sets of chromosomes", "गुणसूत्रों के पूरे समुच्चयों में वृद्धि"],
      ],
    },
  ],
  tf: [
    ["Mendel studied seven pairs of contrasting traits in the garden pea.", "मेंडल ने उद्यान मटर में विपरीत लक्षणों के सात युग्मों का अध्ययन किया।"],
    ["The ABO gene has three alleles, but a person carries only two.", "ABO जीन के तीन युग्मविकल्पी हैं, पर एक व्यक्ति में केवल दो होते हैं।"],
    ["The ABO system has six genotypes and four phenotypes.", "ABO तंत्र में छह जीनप्ररूप और चार लक्षणप्ररूप होते हैं।"],
    ["In birds, females are heterogametic (ZW).", "पक्षियों में मादा विषमयुग्मकी (ZW) होती है।"],
    ["Male honey bees develop from unfertilised eggs and are haploid.", "नर मधुमक्खियाँ अनिषेचित अंडों से बनती हैं और अगुणित होती हैं।"],
    ["Colour blindness occurs in about 8% of males but only about 0.4% of females.", "वर्णांधता लगभग 8% पुरुषों में, पर केवल लगभग 0.4% स्त्रियों में होती है।"],
    ["Thalassemia is a quantitative and sickle-cell anaemia a qualitative defect of globin.", "थैलेसीमिया ग्लोबिन का मात्रात्मक और दात्र कोशिका अरक्तता गुणात्मक दोष है।"],
    ["Turner's syndrome individuals have 45 chromosomes (X0).", "टर्नर सिंड्रोम वाले व्यक्तियों में 45 गुणसूत्र (X0) होते हैं।"],
    ["Human skin colour is an example of polygenic inheritance.", "मानव त्वचा का रंग बहुजीनी वंशागति का उदाहरण है।"],
    ["Sturtevant used recombination frequency between gene pairs to map their positions.", "स्टर्टवेंट ने जीन युग्मों के बीच पुनर्योजन आवृत्ति से उनकी स्थिति का मानचित्र बनाया।"],
    ["In snapdragon, the F₂ phenotypic ratio equals the genotypic ratio, 1 : 2 : 1.", "स्नैपड्रैगन में F₂ का लक्षणप्ररूपी अनुपात जीनप्ररूपी अनुपात 1 : 2 : 1 के बराबर है।"],
    ["Sickle-cell anaemia results from a single base change, GAG to GUG.", "दात्र कोशिका अरक्तता एक क्षारक परिवर्तन, GAG से GUG, के कारण होती है।"],
  ],
  ff: [
    ["In incomplete dominance, the F₂ phenotypic ratio is 3 : 1.", "अपूर्ण प्रभाविता में F₂ का लक्षणप्ररूपी अनुपात 3 : 1 होता है।", "The phenotypic ratio equals the genotypic ratio, 1 : 2 : 1.", "लक्षणप्ररूपी अनुपात जीनप्ररूपी अनुपात 1 : 2 : 1 के बराबर होता है।"],
    ["Haemophilia is an autosomal recessive disorder.", "हीमोफीलिया अलिंग गुणसूत्री अप्रभावी विकार है।", "Haemophilia is X-linked recessive; carrier mothers pass it to sons.", "हीमोफीलिया X-सहलग्न अप्रभावी है; वाहक माताएँ इसे पुत्रों को देती हैं।"],
    ["Klinefelter's syndrome has the karyotype 45, X0.", "क्लाइनफेल्टर सिंड्रोम का गुणसूत्र प्ररूप 45, X0 है।", "Klinefelter's is 47, XXY; 45, X0 is Turner's syndrome.", "क्लाइनफेल्टर 47, XXY है; 45, X0 टर्नर सिंड्रोम है।"],
    ["Tightly linked genes assort independently.", "दृढ़ता से सहलग्न जीन स्वतंत्र रूप से अपव्यूहित होते हैं।", "Tightly linked genes show very low recombination and are inherited together.", "दृढ़ सहलग्न जीनों में पुनर्योजन बहुत कम होता है और वे साथ-साथ वंशागत होते हैं।"],
    ["Phenylketonuria is an X-linked disorder.", "फीनाइलकीटोन्यूरिया X-सहलग्न विकार है।", "It is an autosomal recessive inborn error of metabolism.", "यह उपापचय का अलिंग गुणसूत्री अप्रभावी जन्मजात दोष है।"],
    ["In grasshoppers, the females are XO.", "टिड्डे में मादाएँ XO होती हैं।", "Grasshopper males are XO; females are XX.", "टिड्डे में नर XO और मादाएँ XX होती हैं।"],
    ["The AB blood group is an example of incomplete dominance.", "AB रक्त समूह अपूर्ण प्रभाविता का उदाहरण है।", "It shows co-dominance: both Iᴬ and Iᴮ are fully expressed.", "यह सहप्रभाविता है: Iᴬ और Iᴮ दोनों पूर्णतः अभिव्यक्त होते हैं।"],
    ["A test cross of a heterozygous tall pea plant gives 3 tall : 1 dwarf.", "विषमयुग्मजी लंबे मटर पौधे का परीक्षार्थ संकरण 3 लंबे : 1 बौना देता है।", "Tt × tt gives 1 tall : 1 dwarf.", "Tt × tt से 1 लंबा : 1 बौना मिलता है।"],
    ["Thalassemia is an X-linked disorder.", "थैलेसीमिया X-सहलग्न विकार है।", "Thalassemia is autosomal recessive.", "थैलेसीमिया अलिंग गुणसूत्री अप्रभावी है।"],
    ["In a monohybrid cross, the F₂ genotypic ratio is 3 : 1.", "एकसंकर संकरण में F₂ का जीनप्ररूपी अनुपात 3 : 1 होता है।", "The genotypic ratio is 1 : 2 : 1; 3 : 1 is the phenotypic ratio.", "जीनप्ररूपी अनुपात 1 : 2 : 1 है; 3 : 1 लक्षणप्ररूपी अनुपात है।"],
    ["Mendel's law of independent assortment is based on monohybrid crosses.", "मेंडल का स्वतंत्र अपव्यूहन का नियम एकसंकर संकरणों पर आधारित है।", "Independent assortment comes from dihybrid crosses; monohybrid crosses gave the law of segregation.", "स्वतंत्र अपव्यूहन द्विसंकर संकरणों से निकला; एकसंकर संकरणों से पृथक्करण का नियम मिला।"],
    ["Down's syndrome is caused by the absence of one X chromosome.", "डाउन सिंड्रोम एक X गुणसूत्र की अनुपस्थिति से होता है।", "Down's syndrome is trisomy 21; absence of an X gives Turner's syndrome.", "डाउन सिंड्रोम गुणसूत्र 21 की त्रिसूत्रता है; एक X की कमी से टर्नर सिंड्रोम होता है।"],
  ],
  ar: [
    ["Haemophilia is much more common in males than in females.", "हीमोफीलिया स्त्रियों की तुलना में पुरुषों में कहीं अधिक होता है।", "Males have a single X chromosome, so one recessive allele shows its effect.", "पुरुषों में एक ही X गुणसूत्र होता है, इसलिए एक अप्रभावी युग्मविकल्पी भी प्रभाव दिखाता है।"],
    ["In snapdragon, the F₂ phenotypic and genotypic ratios are the same.", "स्नैपड्रैगन में F₂ के लक्षणप्ररूपी और जीनप्ररूपी अनुपात समान हैं।", "The heterozygote (Rr) has its own intermediate (pink) phenotype.", "विषमयुग्मजी (Rr) का अपना मध्यवर्ती (गुलाबी) लक्षणप्ररूप होता है।"],
    ["RBCs of a person with blood group AB carry both A and B sugars.", "AB रक्त समूह वाले व्यक्ति की RBC पर A और B दोनों शर्कराएँ होती हैं।", "The alleles Iᴬ and Iᴮ are co-dominant.", "युग्मविकल्पी Iᴬ और Iᴮ सहप्रभावी हैं।"],
    ["In birds, the sex of the chick is decided by the mother.", "पक्षियों में चूज़े का लिंग माता तय करती है।", "Female birds are ZW and produce two kinds of eggs.", "मादा पक्षी ZW होती हैं और दो प्रकार के अंडाणु बनाती हैं।"],
    ["Tightly linked genes do not show a 9 : 3 : 3 : 1 ratio in a dihybrid F₂.", "दृढ़ सहलग्न जीन द्विसंकर F₂ में 9 : 3 : 3 : 1 अनुपात नहीं दिखाते।", "They lie close together on one chromosome and are mostly inherited together.", "वे एक गुणसूत्र पर पास-पास होते हैं और अधिकतर साथ-साथ वंशागत होते हैं।"],
  ],
};

BANK["molecular-basis-of-inheritance"] = {
  sets: [
    {
      k: ["scientist", "वैज्ञानिक"],
      q: ["What did % show or develop?", "% ने क्या दर्शाया या विकसित किया?"],
      rq: ["Who is credited with %?", "इसका श्रेय किसे है: %?"],
      items: [
        ["Frederick Griffith", "फ्रेडरिक ग्रिफिथ", "transformation in *Streptococcus pneumoniae* (heat-killed S + live R)", "*Streptococcus pneumoniae* में रूपांतरण (ताप-मृत S + जीवित R)"],
        ["Avery, MacLeod and McCarty", "एवरी, मैक्लिऑड और मैकार्टी", "the transforming principle is DNA", "रूपांतरण कारक DNA है"],
        ["Hershey and Chase", "हर्शे और चेज़", "with ³²P and ³⁵S phages, that DNA is the genetic material", "³²P और ³⁵S वाले फ़ेज से, कि DNA आनुवंशिक पदार्थ है"],
        ["Meselson and Stahl", "मेसेल्सन और स्टाल", "semiconservative replication in *E. coli* using ¹⁵N and ¹⁴N", "¹⁵N और ¹⁴N से *E. coli* में अर्धसंरक्षी प्रतिकृतीयन"],
        ["Taylor and colleagues", "टेलर और सहयोगी", "semiconservative replication in *Vicia faba* using radioactive thymidine", "रेडियोसक्रिय थाइमिडीन से *Vicia faba* में अर्धसंरक्षी प्रतिकृतीयन"],
        ["Erwin Chargaff", "इरविन शार्गाफ़", "in double-stranded DNA, A = T and G = C", "द्विरज्जुकी DNA में A = T और G = C"],
        ["Jacob and Monod", "जैकब और मोनोड", "the lac operon", "लैक ओपेरॉन"],
        ["Alec Jeffreys", "एलेक जेफ्रीज़", "the DNA fingerprinting technique", "DNA अंगुलिछापन तकनीक"],
        ["George Gamow", "जॉर्ज गैमो", "the code must use three bases per codon (4³ = 64)", "प्रत्येक कोडॉन में तीन क्षारक होने चाहिए (4³ = 64)"],
        ["Har Gobind Khorana", "हरगोविंद खुराना", "chemical synthesis of RNA with defined base combinations", "निश्चित क्षारक संयोजन वाले RNA का रासायनिक संश्लेषण"],
        ["Marshall Nirenberg", "मार्शल निरेनबर्ग", "cell-free protein synthesis that helped decode the codons", "कोशिका-मुक्त प्रोटीन संश्लेषण जिससे कोडॉन समझे गए"],
      ],
    },
    {
      k: ["molecule", "अणु"],
      q: ["What is the role of %?", "% की भूमिका क्या है?"],
      rq: ["Which molecule or gene fits this description: %?", "कौन-सा अणु या जीन इस विवरण से मेल खाता है: %?"],
      items: [
        ["lac i gene", "lac i जीन", "codes for the repressor", "दमनकारी (रिप्रेसर) का कूटलेखन"],
        ["lac z gene", "lac z जीन", "β-galactosidase, which splits lactose into galactose and glucose", "β-गैलेक्टोसिडेज, जो लैक्टोस को गैलेक्टोस और ग्लूकोस में तोड़ता है"],
        ["lac y gene", "lac y जीन", "permease, which raises the cell's permeability to lactose", "परमिएज, जो लैक्टोस के लिए कोशिका की पारगम्यता बढ़ाता है"],
        ["RNA polymerase I", "RNA पॉलीमरेज I", "transcribes the 28S, 18S and 5.8S rRNAs", "28S, 18S और 5.8S rRNA का अनुलेखन"],
        ["RNA polymerase II", "RNA पॉलीमरेज II", "transcribes hnRNA, the precursor of mRNA", "hnRNA (mRNA के पूर्ववर्ती) का अनुलेखन"],
        ["RNA polymerase III", "RNA पॉलीमरेज III", "transcribes tRNA, 5S rRNA and snRNAs", "tRNA, 5S rRNA और snRNA का अनुलेखन"],
        ["Sigma (σ) factor", "सिग्मा (σ) कारक", "initiation of transcription in bacteria", "जीवाणुओं में अनुलेखन का प्रारंभन"],
        ["Rho (ρ) factor", "रो (ρ) कारक", "termination of transcription in bacteria", "जीवाणुओं में अनुलेखन का समापन"],
        ["DNA ligase", "DNA लाइगेज", "joins the discontinuous Okazaki fragments", "असतत ओकाज़ाकी खंडों को जोड़ता है"],
        ["Histones", "हिस्टोन", "positively charged proteins rich in lysine and arginine", "लाइसीन और आर्जिनीन से भरपूर धनावेशित प्रोटीन"],
        ["23S rRNA", "23S rRNA", "acts as a ribozyme (peptidyl transferase) in bacteria", "जीवाणुओं में राइबोज़ाइम (पेप्टिडिल ट्रांसफरेज) का कार्य"],
        ["tRNA", "tRNA", "adapter with an anticodon loop and an amino-acid acceptor end", "प्रतिकोडॉन लूप और ऐमीनो अम्ल ग्राही सिरे वाला अनुकूलक अणु"],
      ],
    },
  ],
  tf: [
    ["AUG codes for methionine and also acts as the initiator codon.", "AUG मेथियोनीन का कूटलेखन करता है और प्रारंभन कोडॉन भी है।"],
    ["UAA, UAG and UGA are stop codons.", "UAA, UAG और UGA समापन कोडॉन हैं।"],
    ["The genetic code is degenerate: some amino acids are coded by more than one codon.", "आनुवंशिक कूट अपह्रासित है: कुछ ऐमीनो अम्लों के एक से अधिक कोडॉन होते हैं।"],
    ["In eukaryotes, hnRNA is capped and gets a tail of 200–300 adenylate residues.", "यूकैरियोट में hnRNA पर कैप लगती है और 200–300 एडिनाइलेट अवशेषों की पूँछ जुड़ती है।"],
    ["In the lac operon, lactose acts as the inducer.", "लैक ओपेरॉन में लैक्टोस प्रेरक का कार्य करता है।"],
    ["Regulation of the lac operon by its repressor is negative regulation.", "दमनकारी द्वारा लैक ओपेरॉन का नियमन ऋणात्मक नियमन है।"],
    ["Less than 2% of the human genome codes for proteins.", "मानव जीनोम का 2% से कम भाग प्रोटीन का कूटलेखन करता है।"],
    ["About 99.9% of nucleotide bases are exactly the same in all people.", "सभी मनुष्यों में लगभग 99.9% न्यूक्लियोटाइड क्षारक बिल्कुल समान होते हैं।"],
    ["Chromosome 1 has the most genes and the Y chromosome the fewest.", "गुणसूत्र 1 में सबसे अधिक और Y गुणसूत्र में सबसे कम जीन हैं।"],
    ["DNA-dependent DNA polymerase polymerises only in the 5′ → 3′ direction.", "DNA-निर्भर DNA पॉलीमरेज केवल 5′ → 3′ दिशा में बहुलकीकरण करता है।"],
    ["RNA was the first genetic material.", "RNA पहला आनुवंशिक पदार्थ था।"],
    ["A nucleosome contains about 200 bp of DNA wrapped around a histone octamer.", "एक न्यूक्लियोसोम में हिस्टोन अष्टक के चारों ओर लिपटा लगभग 200 bp DNA होता है।"],
  ],
  ff: [
    ["During transcription, the coding strand acts as the template.", "अनुलेखन में कूटलेखी रज्जुक साँचे का कार्य करता है।", "The 3′ → 5′ template strand is copied; the coding strand has the RNA sequence (T for U).", "3′ → 5′ साँचा रज्जुक पढ़ा जाता है; कूटलेखी रज्जुक का अनुक्रम RNA जैसा (U के स्थान पर T) होता है।"],
    ["Okazaki fragments are formed on the leading strand.", "ओकाज़ाकी खंड अग्रग रज्जुक पर बनते हैं।", "Discontinuous Okazaki fragments are made on the lagging strand.", "असतत ओकाज़ाकी खंड पश्चगामी रज्जुक पर बनते हैं।"],
    ["Introns are present in mature mRNA.", "परिपक्व mRNA में इंट्रॉन होते हैं।", "Introns are removed by splicing; only exons remain joined.", "स्प्लाइसिंग में इंट्रॉन हटा दिए जाते हैं; केवल एक्सॉन जुड़े रहते हैं।"],
    ["Lactose activates the lac repressor.", "लैक्टोस लैक दमनकारी को सक्रिय करता है।", "Lactose (inducer) inactivates the repressor, so it cannot bind the operator.", "लैक्टोस (प्रेरक) दमनकारी को निष्क्रिय करता है, जिससे वह प्रचालक से नहीं जुड़ पाता।"],
    ["Hershey and Chase found ³⁵S inside the infected bacteria.", "हर्शे और चेज़ ने संक्रमित जीवाणुओं के अंदर ³⁵S पाया।", "³²P (DNA) entered the bacteria; ³⁵S (protein) stayed outside.", "³²P (DNA) जीवाणुओं में गया; ³⁵S (प्रोटीन) बाहर रहा।"],
    ["AUG is a stop codon.", "AUG एक समापन कोडॉन है।", "AUG is the start codon for methionine; UAA, UAG and UGA are stop codons.", "AUG मेथियोनीन का प्रारंभन कोडॉन है; UAA, UAG और UGA समापन कोडॉन हैं।"],
    ["In bacteria, translation starts only after the mRNA leaves the nucleus.", "जीवाणुओं में mRNA के केंद्रक से बाहर आने के बाद ही स्थानांतरण शुरू होता है।", "Bacteria have no nucleus; translation can start before transcription is complete.", "जीवाणुओं में केंद्रक नहीं होता; अनुलेखन पूरा होने से पहले ही स्थानांतरण शुरू हो सकता है।"],
    ["Histones are rich in acidic amino acids.", "हिस्टोन अम्लीय ऐमीनो अम्लों से भरपूर होते हैं।", "Histones are rich in the basic residues lysine and arginine.", "हिस्टोन क्षारीय अवशेषों लाइसीन और आर्जिनीन से भरपूर होते हैं।"],
    ["Euchromatin is densely packed and transcriptionally inactive.", "यूक्रोमैटिन सघन रूप से पैक और अनुलेखन में निष्क्रिय होता है।", "Euchromatin is loosely packed and active; heterochromatin is dense and inactive.", "यूक्रोमैटिन ढीला और सक्रिय होता है; हेटेरोक्रोमैटिन सघन और निष्क्रिय।"],
    ["The human genome has about three lakh genes.", "मानव जीनोम में लगभग तीन लाख जीन हैं।", "The total number of human genes is estimated at about 30,000.", "मानव जीनों की कुल संख्या लगभग 30,000 आँकी गई है।"],
    ["Repetitive DNA sequences code for most human proteins.", "पुनरावृत्त DNA अनुक्रम अधिकांश मानव प्रोटीनों का कूटलेखन करते हैं।", "Repetitive sequences are thought to have no direct coding function.", "माना जाता है कि पुनरावृत्त अनुक्रमों का कोई प्रत्यक्ष कूटलेखन कार्य नहीं है।"],
    ["Chargaff's rule A = T and G = C applies to single-stranded DNA as well.", "शार्गाफ़ का नियम A = T और G = C एकरज्जुकी DNA पर भी लागू होता है।", "The rule holds only for double-stranded DNA, where A pairs with T and G with C.", "यह नियम केवल द्विरज्जुकी DNA पर लागू है, जहाँ A, T से और G, C से युग्मित होता है।"],
  ],
  ar: [
    ["DNA is a more stable genetic material than RNA.", "DNA, RNA की तुलना में अधिक स्थायी आनुवंशिक पदार्थ है।", "The 2′-OH group on every RNA nucleotide makes RNA reactive and labile.", "RNA के प्रत्येक न्यूक्लियोटाइड पर 2′-OH समूह उसे अभिक्रियाशील और अस्थिर बनाता है।"],
    ["Replication on one strand of DNA is discontinuous.", "DNA के एक रज्जुक पर प्रतिकृतीयन असतत होता है।", "DNA polymerase can polymerise only in the 5′ → 3′ direction.", "DNA पॉलीमरेज केवल 5′ → 3′ दिशा में बहुलकीकरण कर सकता है।"],
    ["The lac operon is switched on when lactose is present.", "लैक्टोस होने पर लैक ओपेरॉन चालू हो जाता है।", "Lactose inactivates the repressor, freeing the operator.", "लैक्टोस दमनकारी को निष्क्रिय करके प्रचालक को मुक्त कर देता है।"],
    ["In bacteria, translation can begin before transcription ends.", "जीवाणुओं में अनुलेखन समाप्त होने से पहले ही स्थानांतरण शुरू हो सकता है।", "There is no nuclear envelope separating cytosol and nucleus in bacteria.", "जीवाणुओं में कोशिकाद्रव्य और केंद्रक को अलग करने वाला केंद्रक आवरण नहीं होता।"],
    ["In double-stranded DNA, the amount of A equals the amount of T.", "द्विरज्जुकी DNA में A की मात्रा T के बराबर होती है।", "A on one strand always pairs with T on the other.", "एक रज्जुक का A सदैव दूसरे रज्जुक के T से युग्मित होता है।"],
    ["The genetic code is a triplet code.", "आनुवंशिक कूट त्रिक कूट है।", "With 4 bases, triplets give 4³ = 64 codons, enough for 20 amino acids.", "4 क्षारकों से त्रिक 4³ = 64 कोडॉन देते हैं, जो 20 ऐमीनो अम्लों के लिए पर्याप्त हैं।"],
  ],
};

BANK["evolution"] = {
  sets: [
    {
      k: ["example", "उदाहरण"],
      q: ["What does % illustrate?", "% किस बात का उदाहरण है?"],
      rq: ["Which example fits this description: %?", "कौन-सा उदाहरण इस विवरण से मेल खाता है: %?"],
      items: [
        ["Forelimbs of whale, bat, cheetah and human", "व्हेल, चमगादड़, चीता और मनुष्य के अग्रपाद", "homologous organs (divergent evolution)", "समजात अंग (अपसारी विकास)"],
        ["Wings of butterfly and bird", "तितली और पक्षी के पंख", "analogous organs (convergent evolution)", "समवृत्ति अंग (अभिसारी विकास)"],
        ["Darwin's finches of the Galapagos", "गैलापेगोस की डार्विन फिंच", "adaptive radiation from a seed-eating ancestor", "बीज खाने वाले पूर्वज से अनुकूली विकिरण"],
        ["Peppered moths of industrial England", "औद्योगिक इंग्लैंड के पेपर्ड पतंगे", "industrial melanism (natural selection)", "औद्योगिक अतिकृष्णता (प्राकृतिक वरण)"],
        ["*Oenothera* (evening primrose)", "*Oenothera* (ईवनिंग प्रिमरोज़)", "de Vries' mutation theory (saltation)", "डी व्रीज़ का उत्परिवर्तन सिद्धांत (साल्टेशन)"],
        ["Miller's experiment (1953)", "मिलर का प्रयोग (1953)", "amino acids formed from CH₄, H₂, NH₃ and water vapour", "CH₄, H₂, NH₃ और जलवाष्प से ऐमीनो अम्ल बने"],
        ["Louis Pasteur's flask experiment", "लुई पाश्चर का फ्लास्क प्रयोग", "life comes only from pre-existing life", "जीवन केवल पूर्ववर्ती जीवन से आता है"],
        ["Coelacanth caught in 1938", "1938 में पकड़ी गई सीलाकैंथ", "a lobefin fish thought to be extinct", "विलुप्त मानी गई पालिपक्ष मछली"],
      ],
    },
    {
      k: ["hominid", "होमिनिड"],
      q: ["Which feature fits %?", "% पर कौन-सी विशेषता लागू होती है?"],
      rq: ["Which hominid is described: %?", "किस होमिनिड का विवरण है: %?"],
      items: [
        ["*Dryopithecus*", "*Dryopithecus*", "more ape-like primate of about 15 mya", "लगभग 15 मिलियन वर्ष पूर्व का अधिक कपि-सदृश प्राइमेट"],
        ["*Ramapithecus*", "*Ramapithecus*", "more man-like primate of about 15 mya", "लगभग 15 मिलियन वर्ष पूर्व का अधिक मानव-सदृश प्राइमेट"],
        ["Australopithecines", "ऑस्ट्रेलोपिथेसिन", "lived in East African grasslands about 2 mya", "लगभग 2 मिलियन वर्ष पूर्व पूर्वी अफ्रीकी घास मैदानों में रहते थे"],
        ["*Homo habilis*", "*Homo habilis*", "brain 650–800 cc; probably did not eat meat", "मस्तिष्क 650–800 cc; संभवतः मांस नहीं खाते थे"],
        ["*Homo erectus*", "*Homo erectus*", "about 1.5 mya; brain about 900 cc; probably ate meat", "लगभग 1.5 मिलियन वर्ष पूर्व; मस्तिष्क लगभग 900 cc; संभवतः मांस खाते थे"],
        ["Neanderthal man", "निएंडरथल मानव", "brain about 1400 cc; buried their dead", "मस्तिष्क लगभग 1400 cc; मृतकों को दफनाते थे"],
      ],
    },
    {
      k: ["term", "पद"],
      q: ["What does % mean?", "% का अर्थ क्या है?"],
      rq: ["Which term means %?", "किस पद का अर्थ यह है: %?"],
      items: [
        ["Gene flow", "जीन प्रवाह", "movement of genes between populations by migration", "प्रवास द्वारा समष्टियों के बीच जीनों का आना-जाना"],
        ["Genetic drift", "आनुवंशिक विचलन", "change in allele frequency by chance", "संयोग से युग्मविकल्पी आवृत्ति में परिवर्तन"],
        ["Founder effect", "संस्थापक प्रभाव", "a drifted small group becomes the founder of a new population", "विचलित छोटा समूह नई समष्टि का संस्थापक बन जाता है"],
        ["Stabilising selection", "स्थायीकारी वरण", "more individuals acquire the mean character value", "अधिक जीव औसत लक्षण मान प्राप्त करते हैं"],
        ["Directional selection", "दिशात्मक वरण", "more individuals acquire a value other than the mean", "अधिक जीव औसत से भिन्न एक दिशा का मान प्राप्त करते हैं"],
        ["Disruptive selection", "विदारक वरण", "more individuals acquire values at both peripheral ends", "अधिक जीव दोनों छोरों के मान प्राप्त करते हैं"],
        ["Saltation", "साल्टेशन", "a single-step large mutation", "एक ही चरण में बड़ा उत्परिवर्तन"],
      ],
    },
  ],
  tf: [
    ["The Earth was formed about 4.5 billion years ago.", "पृथ्वी लगभग 4.5 बिलियन वर्ष पहले बनी।"],
    ["Life appeared about 500 million years after the Earth formed, almost 4 billion years back.", "पृथ्वी बनने के लगभग 500 मिलियन वर्ष बाद, यानी लगभग 4 बिलियन वर्ष पहले जीवन प्रकट हुआ।"],
    ["Homologous organs indicate common ancestry and divergent evolution.", "समजात अंग समान पूर्वज और अपसारी विकास दर्शाते हैं।"],
    ["Analogous organs are the result of convergent evolution.", "समवृत्ति अंग अभिसारी विकास का परिणाम हैं।"],
    ["Before industrialisation, white-winged moths outnumbered dark-winged moths in England.", "औद्योगीकरण से पहले इंग्लैंड में सफेद पंखों वाले पतंगे काले पंखों वालों से अधिक थे।"],
    ["Mutations are random and directionless, while Darwinian variations are small and directional.", "उत्परिवर्तन यादृच्छिक और दिशाहीन होते हैं, जबकि डार्विनी विभिन्नताएँ छोटी और दिशात्मक होती हैं।"],
    ["*Homo habilis* probably did not eat meat.", "*Homo habilis* संभवतः मांस नहीं खाते थे।"],
    ["Neanderthal man buried their dead.", "निएंडरथल मानव अपने मृतकों को दफनाते थे।"],
    ["The eyes of octopus and of mammals are analogous organs.", "ऑक्टोपस और स्तनधारियों की आँखें समवृत्ति अंग हैं।"],
    ["Sweet potato (a root) and potato (a stem) are analogous.", "शकरकंद (जड़) और आलू (तना) समवृत्ति हैं।"],
    ["Thorns of *Bougainvillea* and tendrils of *Cucurbita* are homologous.", "*Bougainvillea* के काँटे और *Cucurbita* के प्रतान समजात हैं।"],
    ["Gene migration, genetic drift, mutation, recombination and natural selection disturb Hardy–Weinberg equilibrium.", "जीन प्रवास, आनुवंशिक विचलन, उत्परिवर्तन, पुनर्योजन और प्राकृतिक वरण हार्डी-वाइनबर्ग साम्य को बिगाड़ते हैं।"],
  ],
  ff: [
    ["Wings of a butterfly and of a bird are homologous organs.", "तितली और पक्षी के पंख समजात अंग हैं।", "They are analogous: same function, but different structure and origin.", "वे समवृत्ति हैं: कार्य समान, पर संरचना और उत्पत्ति भिन्न।"],
    ["Forelimbs of whale and bat are a result of convergent evolution.", "व्हेल और चमगादड़ के अग्रपाद अभिसारी विकास का परिणाम हैं।", "They are homologous organs showing divergent evolution.", "वे समजात अंग हैं जो अपसारी विकास दर्शाते हैं।"],
    ["Miller used O₂, CO₂ and N₂ in his experiment.", "मिलर ने अपने प्रयोग में O₂, CO₂ और N₂ का उपयोग किया।", "Miller used CH₄, H₂, NH₃ and water vapour, with no free O₂.", "मिलर ने CH₄, H₂, NH₃ और जलवाष्प का उपयोग किया; मुक्त O₂ नहीं थी।"],
    ["*Homo erectus* had a brain capacity of about 1400 cc.", "*Homo erectus* की मस्तिष्क क्षमता लगभग 1400 cc थी।", "*Homo erectus* had about 900 cc; Neanderthals had about 1400 cc.", "*Homo erectus* की लगभग 900 cc थी; निएंडरथल की लगभग 1400 cc।"],
    ["Genetic drift is a change in allele frequency caused by natural selection.", "आनुवंशिक विचलन प्राकृतिक वरण से युग्मविकल्पी आवृत्ति में परिवर्तन है।", "Genetic drift is a change in allele frequency by chance.", "आनुवंशिक विचलन संयोग से होने वाला युग्मविकल्पी आवृत्ति परिवर्तन है।"],
    ["According to de Vries, evolution occurs through small, continuous variations.", "डी व्रीज़ के अनुसार विकास छोटी, सतत विभिन्नताओं से होता है।", "De Vries said large, sudden mutations (saltation) cause speciation.", "डी व्रीज़ के अनुसार बड़े, अचानक उत्परिवर्तन (साल्टेशन) से जाति बनती है।"],
    ["Mutation and gene flow keep allele frequencies constant.", "उत्परिवर्तन और जीन प्रवाह युग्मविकल्पी आवृत्तियों को स्थिर रखते हैं।", "Both disturb Hardy–Weinberg equilibrium and change allele frequencies.", "दोनों हार्डी-वाइनबर्ग साम्य को बिगाड़ते हैं और आवृत्तियाँ बदलते हैं।"],
    ["After industrialisation, white-winged moths increased in England.", "औद्योगीकरण के बाद इंग्लैंड में सफेद पंखों वाले पतंगे बढ़ गए।", "Dark-winged moths increased; white ones on soot-darkened trunks were picked off by predators.", "काले पंखों वाले बढ़े; कालिख से काले तनों पर सफेद पतंगे परभक्षियों द्वारा पकड़ लिए गए।"],
    ["Directional selection favours individuals with the mean character value.", "दिशात्मक वरण औसत लक्षण मान वाले जीवों को बढ़ावा देता है।", "That is stabilising selection; directional selection favours one extreme.", "यह स्थायीकारी वरण है; दिशात्मक वरण एक छोर को बढ़ावा देता है।"],
    ["Disruptive selection eliminates both extremes.", "विदारक वरण दोनों छोरों को समाप्त करता है।", "Disruptive selection favours both extremes over the mean.", "विदारक वरण औसत की अपेक्षा दोनों छोरों को बढ़ावा देता है।"],
    ["*Ramapithecus* was more ape-like than *Dryopithecus*.", "*Ramapithecus*, *Dryopithecus* से अधिक कपि-सदृश था।", "*Ramapithecus* was more man-like; *Dryopithecus* was more ape-like.", "*Ramapithecus* अधिक मानव-सदृश था; *Dryopithecus* अधिक कपि-सदृश।"],
    ["Thorns of *Bougainvillea* and tendrils of *Cucurbita* are analogous.", "*Bougainvillea* के काँटे और *Cucurbita* के प्रतान समवृत्ति हैं।", "They are homologous: same origin, different function.", "वे समजात हैं: उत्पत्ति समान, कार्य भिन्न।"],
  ],
  ar: [
    ["Wings of butterfly and bird are analogous organs.", "तितली और पक्षी के पंख समवृत्ति अंग हैं।", "They do the same job but differ in anatomy and origin.", "वे एक ही कार्य करते हैं पर शारीरिकी और उत्पत्ति में भिन्न हैं।"],
    ["Dark-winged moths increased in industrial England.", "औद्योगिक इंग्लैंड में काले पंखों वाले पतंगे बढ़ गए।", "On soot-darkened trunks, white moths were easily picked off by predators.", "कालिख से काले तनों पर सफेद पतंगों को परभक्षी आसानी से पकड़ लेते थे।"],
    ["Allele frequencies stay constant in a population in Hardy–Weinberg equilibrium.", "हार्डी-वाइनबर्ग साम्य वाली समष्टि में युग्मविकल्पी आवृत्तियाँ स्थिर रहती हैं।", "No gene flow, drift, mutation, recombination or selection acts on it.", "उस पर जीन प्रवाह, विचलन, उत्परिवर्तन, पुनर्योजन या वरण का प्रभाव नहीं होता।"],
    ["Darwin's finches show adaptive radiation.", "डार्विन फिंच अनुकूली विकिरण दर्शाती हैं।", "From an original seed-eating stock, forms with altered beaks arose for different diets.", "मूल बीजाहारी पूर्वज से भिन्न आहारों के लिए बदली चोंचों वाले रूप बने।"],
    ["Miller's experiment supported chemical evolution.", "मिलर के प्रयोग ने रासायनिक विकास का समर्थन किया।", "Amino acids formed from simple gases exposed to electric discharge.", "विद्युत विसर्जन में सरल गैसों से ऐमीनो अम्ल बने।"],
    ["Homologous organs support divergent evolution.", "समजात अंग अपसारी विकास का समर्थन करते हैं।", "They share one basic structure from a common ancestor but serve different functions.", "उनकी मूल संरचना समान पूर्वज से आई है, पर कार्य भिन्न हैं।"],
  ],
};

BANK["human-health-and-disease"] = {
  sets: [
    {
      k: ["disease", "रोग"],
      q: ["Which statement about % is correct?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which disease fits: %?", "कौन-सा रोग इससे मेल खाता है: %?"],
      items: [
        ["Typhoid", "टाइफ़ॉइड (मियादी बुखार)", "*Salmonella typhi*; confirmed by the Widal test", "*Salmonella typhi*; विडाल परीक्षण से पुष्टि"],
        ["Pneumonia", "न्यूमोनिया", "*Streptococcus pneumoniae* or *Haemophilus influenzae* infect the alveoli", "*Streptococcus pneumoniae* या *Haemophilus influenzae* कूपिकाओं को संक्रमित करते हैं"],
        ["Common cold", "सामान्य जुकाम", "rhinoviruses infect the nose and respiratory passage, not the lungs", "राइनोवायरस नाक और श्वसन मार्ग को संक्रमित करते हैं, फेफड़ों को नहीं"],
        ["Malaria", "मलेरिया", "*Plasmodium*, spread by the female *Anopheles* mosquito", "*Plasmodium*, मादा *Anopheles* मच्छर से फैलता है"],
        ["Amoebiasis", "अमीबता", "*Entamoeba histolytica* in the large intestine", "बड़ी आँत में *Entamoeba histolytica*"],
        ["Ascariasis", "ऐस्कैरिसता", "the roundworm *Ascaris* in the intestine", "आँत में गोलकृमि *Ascaris*"],
        ["Elephantiasis (filariasis)", "फ़ीलपाँव (फ़ाइलेरिएसिस)", "*Wuchereria*; chronic inflammation of lymphatic vessels", "*Wuchereria*; लसीका वाहिकाओं की दीर्घकालिक सूजन"],
        ["Ringworm", "दाद", "fungi such as *Microsporum*, *Trichophyton* and *Epidermophyton*", "*Microsporum*, *Trichophyton* और *Epidermophyton* जैसे कवक"],
        ["AIDS", "एड्स", "HIV, a retrovirus that reduces helper T-lymphocytes", "HIV, एक रिट्रोवायरस जो सहायक T-लसीकाणु घटाता है"],
      ],
    },
    {
      k: ["component of immunity", "प्रतिरक्षा घटक"],
      q: ["Which statement fits %?", "% पर कौन-सा कथन लागू होता है?"],
      rq: ["Which of these fits this description: %?", "इनमें से कौन इस विवरण से मेल खाता है: %?"],
      items: [
        ["IgE", "IgE", "antibody produced in allergic responses", "प्रत्युर्जता (एलर्जी) में बनने वाली प्रतिरक्षी"],
        ["IgA", "IgA", "antibody abundant in colostrum", "खीस (कोलोस्ट्रम) में प्रचुर प्रतिरक्षी"],
        ["Interferons", "इंटरफेरॉन", "proteins from virus-infected cells that protect non-infected cells", "विषाणु-संक्रमित कोशिकाओं के प्रोटीन जो असंक्रमित कोशिकाओं की रक्षा करते हैं"],
        ["B-lymphocytes", "B-लसीकाणु", "produce antibodies (humoral immunity)", "प्रतिरक्षी बनाते हैं (तरल प्रतिरक्षा)"],
        ["T-lymphocytes", "T-लसीकाणु", "mediate cell-mediated immunity and graft rejection", "कोशिका-माध्यित प्रतिरक्षा और प्रत्यारोप अस्वीकृति"],
        ["Mast cells", "मास्ट कोशिकाएँ", "release histamine and serotonin in allergy", "प्रत्युर्जता में हिस्टामिन और सेरोटोनिन मुक्त करती हैं"],
        ["Macrophages in AIDS", "एड्स में महाभक्षकाणु", "act as an ‘HIV factory’", "‘HIV कारखाने’ की तरह कार्य करते हैं"],
        ["MALT", "MALT", "lymphoid tissue lining the respiratory, digestive and urogenital tracts", "श्वसन, पाचन और मूत्रजनन मार्गों को आस्तरित करने वाला लसीकाभ ऊतक"],
      ],
    },
    {
      k: ["drug", "ड्रग"],
      q: ["Which statement about % is correct?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which drug or substance fits this description: %?", "कौन-सा ड्रग या पदार्थ इस विवरण से मेल खाता है: %?"],
      items: [
        ["Heroin (smack)", "हेरोइन (स्मैक)", "diacetylmorphine, a depressant obtained from morphine", "डाइऐसीटिलमॉर्फ़ीन, मॉर्फ़ीन से प्राप्त एक अवसादक"],
        ["Morphine", "मॉर्फ़ीन", "very effective sedative and painkiller from poppy latex", "पोस्ते के लेटेक्स से प्राप्त प्रभावी शामक और पीड़ाहारी"],
        ["Cocaine", "कोकेन", "from *Erythroxylum coca*; interferes with dopamine transport", "*Erythroxylum coca* से; डोपामीन परिवहन में बाधा"],
        ["Cannabinoids", "कैनाबिनॉइड", "from *Cannabis sativa*; affect the cardiovascular system", "*Cannabis sativa* से; हृद्-संवहनी तंत्र पर प्रभाव"],
        ["Nicotine", "निकोटिन", "makes the adrenal gland release adrenaline and noradrenaline", "अधिवृक्क ग्रंथि से एड्रीनलीन और नॉरएड्रीनलीन मुक्त कराता है"],
        ["*Atropa belladonna* and *Datura*", "*Atropa belladonna* और *Datura*", "plants with hallucinogenic properties", "विभ्रमकारी गुणों वाले पौधे"],
      ],
    },
  ],
  tf: [
    ["An antibody molecule has two light and two heavy chains (H₂L₂).", "एक प्रतिरक्षी अणु में दो हल्की और दो भारी शृंखलाएँ (H₂L₂) होती हैं।"],
    ["Colostrum gives the infant passive immunity through IgA antibodies.", "खीस IgA प्रतिरक्षियों द्वारा शिशु को निष्क्रिय प्रतिरक्षा देता है।"],
    ["Fertilisation and development of *Plasmodium* take place in the mosquito's stomach.", "*Plasmodium* का निषेचन और परिवर्धन मच्छर के आमाशय में होता है।"],
    ["The chill and high fever of malaria are due to the toxin haemozoin.", "मलेरिया की ठंड और तेज बुखार हीमोज़ॉइन नामक विष के कारण होते हैं।"],
    ["In AIDS, the number of helper T-lymphocytes decreases.", "एड्स में सहायक T-लसीकाणुओं की संख्या घट जाती है।"],
    ["ELISA is a widely used diagnostic test for AIDS.", "ELISA एड्स की व्यापक रूप से प्रयुक्त नैदानिक जाँच है।"],
    ["Hepatitis B vaccine is produced from yeast by recombinant DNA technology.", "हेपेटाइटिस B का टीका पुनर्योगज DNA तकनीक से यीस्ट से बनाया जाता है।"],
    ["Cancer cells have lost the property of contact inhibition.", "कैंसर कोशिकाओं में संपर्क संदमन का गुण नष्ट हो जाता है।"],
    ["Rheumatoid arthritis is an autoimmune disease.", "रुमेटॉइड संधिशोथ एक स्वप्रतिरक्षी रोग है।"],
    ["Common cold does not infect the lungs.", "सामान्य जुकाम फेफड़ों को संक्रमित नहीं करता।"],
    ["Bone marrow and thymus are primary lymphoid organs.", "अस्थि मज्जा और थाइमस प्राथमिक लसीकाभ अंग हैं।"],
    ["α-interferon is used in cancer treatment to activate the immune system.", "कैंसर उपचार में प्रतिरक्षा तंत्र को सक्रिय करने के लिए α-इंटरफेरॉन दिया जाता है।"],
  ],
  ff: [
    ["*Plasmodium* enters the human body as gametocytes.", "*Plasmodium* मनुष्य के शरीर में युग्मकजनक के रूप में प्रवेश करता है।", "It enters as sporozoites through the bite of an infected female *Anopheles*.", "यह संक्रमित मादा *Anopheles* के काटने से स्पोरोज़ॉइट के रूप में प्रवेश करता है।"],
    ["The Widal test confirms malaria.", "विडाल परीक्षण से मलेरिया की पुष्टि होती है।", "The Widal test confirms typhoid.", "विडाल परीक्षण से टाइफ़ॉइड की पुष्टि होती है।"],
    ["Vaccination gives passive immunity.", "टीकाकरण निष्क्रिय प्रतिरक्षा देता है।", "Vaccines make the body produce its own antibodies: active immunity.", "टीके शरीर में अपनी प्रतिरक्षी बनवाते हैं: सक्रिय प्रतिरक्षा।"],
    ["HIV is a double-stranded DNA virus.", "HIV एक द्विरज्जुकी DNA विषाणु है।", "HIV is a retrovirus with an RNA genome; it uses reverse transcriptase.", "HIV RNA जीनोम वाला रिट्रोवायरस है; यह व्युत्क्रम ट्रांसक्रिप्टेज का उपयोग करता है।"],
    ["Spleen and lymph nodes are primary lymphoid organs.", "प्लीहा और लसीका ग्रंथियाँ प्राथमिक लसीकाभ अंग हैं।", "Bone marrow and thymus are primary; spleen and lymph nodes are secondary.", "अस्थि मज्जा और थाइमस प्राथमिक हैं; प्लीहा और लसीका ग्रंथियाँ द्वितीयक।"],
    ["Allergic reactions involve IgG antibodies.", "प्रत्युर्जता अभिक्रियाओं में IgG प्रतिरक्षी बनती हैं।", "The response to allergens involves IgE antibodies.", "प्रत्युर्जकों के प्रति अनुक्रिया में IgE प्रतिरक्षी बनती हैं।"],
    ["Benign tumours spread to other parts of the body.", "सुदम अर्बुद शरीर के दूसरे भागों में फैल जाते हैं।", "Benign tumours stay confined; malignant tumours spread by metastasis.", "सुदम अर्बुद एक स्थान तक सीमित रहते हैं; दुर्दम अर्बुद मेटास्टेसिस से फैलते हैं।"],
    ["Ringworm is caused by a worm.", "दाद एक कृमि से होता है।", "Ringworm is a fungal infection, despite its name.", "नाम के बावजूद दाद कवक संक्रमण है।"],
    ["Elephantiasis is caused by *Ascaris*.", "फ़ीलपाँव *Ascaris* से होता है।", "Elephantiasis is caused by *Wuchereria*; *Ascaris* causes ascariasis.", "फ़ीलपाँव *Wuchereria* से होता है; *Ascaris* से ऐस्कैरिसता होती है।"],
    ["Innate immunity is pathogen-specific and has memory.", "सहज प्रतिरक्षा रोगजनक-विशिष्ट होती है और उसमें स्मृति होती है।", "Innate immunity is non-specific; acquired immunity is specific and has memory.", "सहज प्रतिरक्षा अविशिष्ट है; उपार्जित प्रतिरक्षा विशिष्ट है और उसमें स्मृति होती है।"],
    ["Smoking increases the oxygen carried by haemoglobin.", "धूम्रपान से हीमोग्लोबिन द्वारा ले जाई जाने वाली ऑक्सीजन बढ़ती है।", "Smoking raises CO in blood and lowers haem-bound oxygen.", "धूम्रपान रक्त में CO बढ़ाता है और हीम से जुड़ी ऑक्सीजन घटाता है।"],
    ["Cocaine is obtained from the poppy plant.", "कोकेन पोस्ते के पौधे से प्राप्त होता है।", "Cocaine comes from *Erythroxylum coca*; poppy gives morphine.", "कोकेन *Erythroxylum coca* से मिलता है; पोस्ते से मॉर्फ़ीन मिलता है।"],
  ],
  ar: [
    ["People with AIDS suffer from many infections.", "एड्स रोगी अनेक संक्रमणों से ग्रस्त होते हैं।", "HIV reduces helper T-lymphocytes, so the person becomes immunodeficient.", "HIV सहायक T-लसीकाणु घटाता है, जिससे व्यक्ति प्रतिरक्षा-न्यून हो जाता है।"],
    ["Colostrum protects the newborn from infections.", "खीस नवजात को संक्रमणों से बचाता है।", "It contains abundant IgA antibodies.", "इसमें प्रचुर IgA प्रतिरक्षी होती हैं।"],
    ["Chill and high fever recur in malaria.", "मलेरिया में ठंड और तेज बुखार बार-बार आते हैं।", "Rupture of infected RBCs releases the toxin haemozoin.", "संक्रमित RBC के फटने से हीमोज़ॉइन विष मुक्त होता है।"],
    ["A snake-bite victim is given an injection of antivenom.", "साँप के काटे व्यक्ति को प्रतिविष का इंजेक्शन दिया जाता है।", "Quick protection needs preformed antibodies (passive immunisation).", "तुरंत सुरक्षा के लिए पहले से बनी प्रतिरक्षियाँ (निष्क्रिय प्रतिरक्षीकरण) चाहिए।"],
    ["Cancer cells keep dividing and form tumours.", "कैंसर कोशिकाएँ लगातार विभाजित होकर अर्बुद बनाती हैं।", "They have lost contact inhibition.", "उनमें संपर्क संदमन नष्ट हो चुका होता है।"],
  ],
};

BANK["biotechnology"] = {
  sets: [
    {
      k: ["tool", "उपकरण"],
      q: ["What is the role of % in recombinant DNA technology?", "पुनर्योगज DNA तकनीक में % की भूमिका क्या है?"],
      rq: ["Which tool or material fits this description: %?", "कौन-सा उपकरण या पदार्थ इस विवरण से मेल खाता है: %?"],
      items: [
        ["Restriction endonuclease", "प्रतिबंधन एंडोन्यूक्लिएज", "cuts DNA at specific palindromic sequences", "विशिष्ट पैलिंड्रोमी अनुक्रमों पर DNA काटना"],
        ["DNA ligase", "DNA लाइगेज", "joins the cut DNA fragments", "कटे DNA खंडों को जोड़ना"],
        ["*Taq* polymerase", "*Taq* पॉलीमरेज", "thermostable DNA polymerase from *Thermus aquaticus* used in PCR", "PCR में प्रयुक्त *Thermus aquaticus* का तापस्थायी DNA पॉलीमरेज"],
        ["Ethidium bromide", "एथिडियम ब्रोमाइड", "stains DNA; bands look orange under UV light", "DNA को अभिरंजित करता है; UV प्रकाश में पट्टियाँ नारंगी दिखती हैं"],
        ["Chilled ethanol", "ठंडा एथेनॉल", "precipitates the purified DNA", "शुद्ध DNA को अवक्षेपित करता है"],
        ["Lysozyme", "लाइसोजाइम", "breaks bacterial cell walls to release DNA", "DNA मुक्त करने के लिए जीवाणु भित्ति तोड़ता है"],
        ["Cellulase", "सेलुलेज", "breaks plant cell walls", "पादप कोशिका भित्ति तोड़ता है"],
        ["Chitinase", "काइटिनेज", "breaks fungal cell walls", "कवक कोशिका भित्ति तोड़ता है"],
        ["Ti plasmid", "Ti प्लाज्मिड", "plasmid of *Agrobacterium tumefaciens*, modified into a plant vector", "*Agrobacterium tumefaciens* का प्लाज्मिड, जिसे पादप संवाहक बनाया गया"],
        ["Gene gun (biolistics)", "जीन गन (बायोलिस्टिक्स)", "bombards plant cells with DNA-coated gold or tungsten particles", "DNA लेपित सोने या टंगस्टन कणों से पादप कोशिकाओं पर बौछार"],
        ["Selectable marker", "वरण योग्य चिह्नक", "helps eliminate non-transformants, e.g. ampicillin resistance", "अरूपांतरित कोशिकाएँ हटाने में सहायक, जैसे एम्पिसिलिन प्रतिरोध"],
        ["ori", "ori", "site where replication starts; controls copy number", "प्रतिकृति आरंभ स्थल; प्रतियों की संख्या नियंत्रित करता है"],
      ],
    },
    {
      k: ["application", "अनुप्रयोग"],
      q: ["Which statement about % is correct?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which of these fits this description: %?", "इनमें से कौन इस विवरण से मेल खाता है: %?"],
      items: [
        ["*cry*IAc and *cry*IIAb genes", "*cry*IAc और *cry*IIAb जीन", "control cotton bollworms", "कपास के बॉलवर्म को नियंत्रित करते हैं"],
        ["*cry*IAb gene", "*cry*IAb जीन", "controls the corn borer", "मक्का छेदक को नियंत्रित करता है"],
        ["RNA interference", "RNA अंतरक्षेप (RNAi)", "protects tobacco from the nematode *Meloidogyne incognita*", "तंबाकू को सूत्रकृमि *Meloidogyne incognita* से बचाता है"],
        ["Rosie", "रोज़ी", "first transgenic cow; milk with human α-lactalbumin", "पहली पारजीनी गाय; मानव α-लैक्टएल्बुमिन युक्त दूध"],
        ["ADA deficiency", "ADA न्यूनता", "first clinical gene therapy, given in 1990", "1990 में दी गई पहली नैदानिक जीन चिकित्सा"],
        ["Eli Lilly (1983)", "एली लिली (1983)", "human insulin from separately made A and B chains", "अलग-अलग बनी A और B शृंखलाओं से मानव इंसुलिन"],
        ["GEAC", "GEAC", "Indian committee that rules on GM research and release of GM organisms", "GM अनुसंधान और GM जीवों के उपयोग पर निर्णय लेने वाली भारतीय समिति"],
        ["Bt toxin", "Bt विष", "inactive protoxin activated by the alkaline pH of the insect gut", "निष्क्रिय प्राक्-विष जो कीट आँत के क्षारीय pH पर सक्रिय होता है"],
      ],
    },
  ],
  tf: [
    ["EcoRI recognises GAATTC and cuts between G and A, leaving sticky ends.", "EcoRI, GAATTC को पहचानकर G और A के बीच काटता है और चिपचिपे सिरे छोड़ता है।"],
    ["In EcoRI, ‘R’ comes from the strain RY 13 and ‘I’ is the order of isolation.", "EcoRI में ‘R’ प्रभेद RY 13 से आया है और ‘I’ पृथक्करण का क्रम है।"],
    ["Hind II was the first restriction endonuclease to be isolated.", "Hind II पहला पृथक किया गया प्रतिबंधन एंडोन्यूक्लिएज था।"],
    ["Negatively charged DNA moves towards the anode in gel electrophoresis.", "जेल वैद्युत कण संचलन में ऋणावेशित DNA एनोड की ओर जाता है।"],
    ["In pBR322, inserting DNA at the BamHI site inactivates tetracycline resistance.", "pBR322 में BamHI स्थल पर DNA डालने से टेट्रासाइक्लिन प्रतिरोध निष्क्रिय हो जाता है।"],
    ["Bacteria are made competent with Ca²⁺ ions followed by a heat shock at 42 °C.", "Ca²⁺ आयनों और फिर 42 °C पर ताप आघात से जीवाणुओं को सक्षम बनाया जाता है।"],
    ["In blue–white selection, recombinant colonies are colourless (white).", "नीली-सफेद चयन विधि में पुनर्योगज निवह रंगहीन (सफेद) होते हैं।"],
    ["More than 95% of all existing transgenic animals are mice.", "सभी पारजीनी जंतुओं में 95% से अधिक चूहे हैं।"],
    ["Insulin is first made as pro-insulin, which has an extra C-peptide.", "इंसुलिन पहले प्राक्-इंसुलिन के रूप में बनता है, जिसमें एक अतिरिक्त C-पेप्टाइड होता है।"],
    ["Smaller DNA fragments move farther through an agarose gel.", "छोटे DNA खंड ऐगारोज़ जेल में अधिक दूर तक जाते हैं।"],
    ["Each PCR cycle has three steps: denaturation, annealing and extension.", "PCR के प्रत्येक चक्र में तीन चरण हैं: विकृतीकरण, तापानुशीतन और विस्तार।"],
    ["Bt toxin is a protoxin that becomes active at the alkaline pH of the insect gut.", "Bt विष एक प्राक्-विष है जो कीट आँत के क्षारीय pH पर सक्रिय होता है।"],
  ],
  ff: [
    ["Exonucleases cut DNA at specific positions within the molecule.", "एक्सोन्यूक्लिएज DNA को अणु के भीतर विशिष्ट स्थानों पर काटते हैं।", "Exonucleases remove nucleotides from the ends; endonucleases cut within the DNA.", "एक्सोन्यूक्लिएज सिरों से न्यूक्लियोटाइड हटाते हैं; एंडोन्यूक्लिएज DNA के भीतर काटते हैं।"],
    ["In gel electrophoresis, DNA moves towards the cathode.", "जेल वैद्युत कण संचलन में DNA कैथोड की ओर जाता है।", "DNA is negatively charged and moves towards the anode.", "DNA ऋणावेशित है और एनोड की ओर जाता है।"],
    ["Larger DNA fragments move farther in an agarose gel.", "बड़े DNA खंड ऐगारोज़ जेल में अधिक दूर जाते हैं।", "Agarose acts as a sieve: smaller fragments move farther.", "ऐगारोज़ छलनी का कार्य करता है: छोटे खंड अधिक दूर जाते हैं।"],
    ["In blue–white selection, recombinant colonies appear blue.", "नीली-सफेद चयन विधि में पुनर्योगज निवह नीले दिखते हैं।", "The insert inactivates β-galactosidase, so recombinants stay colourless.", "निवेशित DNA β-गैलेक्टोसिडेज को निष्क्रिय करता है, इसलिए पुनर्योगज रंगहीन रहते हैं।"],
    ["*Taq* polymerase is obtained from *Escherichia coli*.", "*Taq* पॉलीमरेज *Escherichia coli* से प्राप्त होता है।", "It comes from the thermophilic bacterium *Thermus aquaticus*.", "यह तापरागी जीवाणु *Thermus aquaticus* से आता है।"],
    ["In pBR322, DNA inserted at the BamHI site inactivates ampicillin resistance.", "pBR322 में BamHI स्थल पर डाला गया DNA एम्पिसिलिन प्रतिरोध निष्क्रिय करता है।", "The BamHI site lies in the tetracycline resistance gene.", "BamHI स्थल टेट्रासाइक्लिन प्रतिरोध जीन में स्थित है।"],
    ["In RNA interference, the parasite's DNA is cut out of the host genome.", "RNA अंतरक्षेप में परजीवी का DNA परपोषी जीनोम से काट दिया जाता है।", "RNAi silences a specific mRNA with a complementary dsRNA.", "RNAi पूरक dsRNA द्वारा एक विशिष्ट mRNA को निष्क्रिय (मौन) करता है।"],
    ["Bt toxin kills *Bacillus thuringiensis* itself.", "Bt विष स्वयं *Bacillus thuringiensis* को मार देता है।", "In the bacterium the toxin is an inactive protoxin.", "जीवाणु में यह विष निष्क्रिय प्राक्-विष के रूप में रहता है।"],
    ["*Agrobacterium tumefaciens* is a pathogen of animal cells.", "*Agrobacterium tumefaciens* जंतु कोशिकाओं का रोगजनक है।", "It is a pathogen of several dicot plants; its Ti plasmid is used as a vector.", "यह कई द्विबीजपत्री पौधों का रोगजनक है; इसका Ti प्लाज्मिड संवाहक बनाया जाता है।"],
    ["Eli Lilly made human insulin by expressing pro-insulin in *E. coli*.", "एली लिली ने *E. coli* में प्राक्-इंसुलिन बनवाकर मानव इंसुलिन तैयार किया।", "They made the A and B chains separately and joined them by disulfide bonds.", "उन्होंने A और B शृंखलाएँ अलग-अलग बनवाकर डाइसल्फ़ाइड बंधों से जोड़ीं।"],
    ["Sticky ends are formed only by enzymes that cut both strands at the same point.", "चिपचिपे सिरे केवल वे एंजाइम बनाते हैं जो दोनों रज्जुकों को एक ही बिंदु पर काटते हैं।", "Sticky ends form when the two strands are cut a little away from the centre, leaving overhangs.", "चिपचिपे सिरे तब बनते हैं जब दोनों रज्जुक केंद्र से थोड़ा हटकर कटते हैं और उभरे सिरे बचते हैं।"],
    ["The first clinical gene therapy was given to treat haemophilia.", "पहली नैदानिक जीन चिकित्सा हीमोफीलिया के उपचार के लिए दी गई।", "It was given in 1990 to a 4-year-old girl with ADA deficiency.", "यह 1990 में ADA न्यूनता से ग्रस्त 4 वर्ष की बालिका को दी गई।"],
  ],
  ar: [
    ["DNA fragments separate by size in an agarose gel.", "ऐगारोज़ जेल में DNA खंड आकार के अनुसार अलग होते हैं।", "The agarose matrix acts as a sieve, so smaller fragments move faster.", "ऐगारोज़ मैट्रिक्स छलनी की तरह कार्य करता है, इसलिए छोटे खंड तेज चलते हैं।"],
    ["Bt toxin does not kill the bacterium that makes it.", "Bt विष उसे बनाने वाले जीवाणु को नहीं मारता।", "It is stored as an inactive protoxin, activated only by the alkaline pH of the insect gut.", "यह निष्क्रिय प्राक्-विष के रूप में रहता है, जो केवल कीट आँत के क्षारीय pH पर सक्रिय होता है।"],
    ["Recombinant colonies are white in blue–white selection.", "नीली-सफेद चयन में पुनर्योगज निवह सफेद होते हैं।", "The inserted DNA inactivates the β-galactosidase gene (insertional inactivation).", "निवेशित DNA β-गैलेक्टोसिडेज जीन को निष्क्रिय कर देता है (निवेशी निष्क्रियता)।"],
    ["*Taq* polymerase is used in PCR.", "PCR में *Taq* पॉलीमरेज का उपयोग होता है।", "It stays active at the high temperatures used to denature DNA.", "यह DNA विकृतीकरण के उच्च ताप पर भी सक्रिय रहता है।"],
    ["Bacteria are treated with Ca²⁺ before transformation.", "रूपांतरण से पहले जीवाणुओं को Ca²⁺ से उपचारित किया जाता है।", "Divalent cations make the cell competent to take up DNA.", "द्विसंयोजी धनायन कोशिका को DNA ग्रहण करने में सक्षम बनाते हैं।"],
    ["Sticky ends help join DNA fragments cut by the same restriction enzyme.", "चिपचिपे सिरे एक ही प्रतिबंधन एंजाइम से कटे DNA खंडों को जोड़ने में सहायक हैं।", "They form hydrogen bonds with complementary cut ends, which DNA ligase then seals.", "वे पूरक कटे सिरों से हाइड्रोजन बंध बनाते हैं, जिन्हें फिर DNA लाइगेज जोड़ देता है।"],
  ],
};

BANK["ecology-and-environment"] = {
  sets: [
    {
      k: ["interaction", "पारस्परिक क्रिया"],
      q: ["Which is an example of %?", "% का उदाहरण कौन-सा है?"],
      rq: ["Which interaction is shown by %?", "इससे कौन-सी पारस्परिक क्रिया दिखती है: %?"],
      items: [
        ["Mutualism", "सहोपकारिता", "lichens; mycorrhizae of fungi and roots", "लाइकेन; कवक और जड़ों की कवकमूल"],
        ["Commensalism", "सहभोजिता", "an orchid growing on a mango branch", "आम की शाखा पर उगता ऑर्किड"],
        ["Parasitism", "परजीविता", "*Cuscuta* growing on hedge plants", "बाड़ के पौधों पर उगता *Cuscuta*"],
        ["Brood parasitism", "अंड परजीविता", "the cuckoo laying its eggs in a crow's nest", "कोयल का कौवे के घोंसले में अंडे देना"],
        ["Competition", "स्पर्धा", "Abingdon tortoise declining after goats came to its island", "बकरियाँ आने के बाद एबिंग्डन कछुए का घटना"],
        ["Predation", "परभक्षण", "a moth that brought invasive prickly pear cactus under control in Australia", "ऑस्ट्रेलिया में आक्रामक नागफनी को नियंत्रित करने वाला पतंगा"],
        ["Resource partitioning", "संसाधन विभाजन", "five warbler species feeding on different branches of one tree", "एक ही पेड़ की अलग शाखाओं पर भोजन करती वार्बलर की पाँच जातियाँ"],
      ],
    },
    {
      k: ["term", "पद"],
      q: ["What does % mean?", "% का अर्थ क्या है?"],
      rq: ["Which term means %?", "किस पद का अर्थ यह है: %?"],
      items: [
        ["Natality", "जन्मदर", "births added to the population in a given period", "किसी अवधि में समष्टि में जुड़े जन्म"],
        ["Immigration", "आप्रवासन", "individuals of the same species coming into the habitat", "उसी जाति के जीवों का आवास में आना"],
        ["Emigration", "उत्प्रवासन", "individuals leaving the habitat for elsewhere", "जीवों का आवास छोड़कर कहीं और जाना"],
        ["Carrying capacity (K)", "वहन क्षमता (K)", "maximum population the habitat can support", "आवास द्वारा सहन की जा सकने वाली अधिकतम समष्टि"],
        ["Net primary productivity", "नेट प्राथमिक उत्पादकता", "gross primary productivity minus respiration losses", "सकल प्राथमिक उत्पादकता में से श्वसन क्षति घटाकर"],
        ["Secondary productivity", "द्वितीयक उत्पादकता", "rate of formation of new organic matter by consumers", "उपभोक्ताओं द्वारा नए कार्बनिक पदार्थ बनने की दर"],
        ["Humification", "ह्यूमसीभवन", "accumulation of dark, amorphous humus resistant to microbes", "सूक्ष्मजीवों के प्रति प्रतिरोधी गहरे, अक्रिस्टली ह्यूमस का संचय"],
        ["Mineralisation", "खनिजीकरण", "release of inorganic nutrients as humus is degraded", "ह्यूमस के अपघटन से अकार्बनिक पोषकों का मुक्त होना"],
        ["Fragmentation", "खंडन", "detritivores such as earthworms break detritus into small pieces", "केंचुए जैसे अपरदाहारी अपरद को छोटे टुकड़ों में तोड़ते हैं"],
        ["Leaching", "निक्षालन", "water-soluble nutrients go down into the soil and precipitate as salts", "जल-विलेय पोषक मृदा में नीचे जाकर लवण के रूप में अवक्षेपित होते हैं"],
      ],
    },
    {
      k: ["item", "नाम"],
      q: ["Which statement about % is correct?", "% के बारे में कौन-सा कथन सही है?"],
      rq: ["Which of these fits this description: %?", "इनमें से कौन इस विवरण से मेल खाता है: %?"],
      items: [
        ["Dodo", "डोडो", "an extinct bird of Mauritius", "मॉरिशस का विलुप्त पक्षी"],
        ["Quagga", "क्वैगा", "an extinct animal of Africa", "अफ्रीका का विलुप्त जंतु"],
        ["Thylacine", "थाइलेसिन", "an extinct animal of Australia", "ऑस्ट्रेलिया का विलुप्त जंतु"],
        ["Steller's sea cow", "स्टेलर समुद्री गाय", "an extinct animal of Russia", "रूस का विलुप्त जंतु"],
        ["Nile perch", "नाइल पर्च", "introduced into Lake Victoria; led to extinction of 200+ cichlid species", "विक्टोरिया झील में लाई गई; 200 से अधिक सिक्लिड जातियाँ विलुप्त हुईं"],
        ["Amazon rain forest", "अमेज़न वर्षा वन", "called the ‘lungs of the planet’", "‘पृथ्वी के फेफड़े’ कहलाता है"],
        ["Paul Ehrlich", "पॉल एर्लिक", "proposed the ‘rivet popper’ hypothesis", "‘रिवेट पॉपर’ परिकल्पना दी"],
        ["Alexander von Humboldt", "अलेक्ज़ेंडर वॉन हम्बोल्ट", "observed the species–area relationship", "जाति-क्षेत्र संबंध देखा"],
        ["Earth Summit", "पृथ्वी सम्मेलन", "held in Rio de Janeiro in 1992", "1992 में रियो डी जेनेरो में हुआ"],
        ["Ex situ conservation", "बहिःस्थाने संरक्षण", "zoos, botanical gardens and seed banks", "चिड़ियाघर, वनस्पति उद्यान और बीज बैंक"],
      ],
    },
  ],
  tf: [
    ["The pyramid of energy is always upright.", "ऊर्जा का पिरामिड सदैव सीधा होता है।"],
    ["The pyramid of biomass in the sea is generally inverted.", "समुद्र में जैवभार का पिरामिड प्रायः उल्टा होता है।"],
    ["Only about 10% of the energy of one trophic level passes to the next.", "एक पोषण स्तर की केवल लगभग 10% ऊर्जा अगले स्तर तक पहुँचती है।"],
    ["Plants capture only 2–10% of the photosynthetically active radiation (PAR).", "पौधे प्रकाश-संश्लेषणी सक्रिय विकिरण (PAR) का केवल 2–10% ग्रहण करते हैं।"],
    ["PAR is about 50% of the incident solar radiation.", "PAR आपतित सौर विकिरण का लगभग 50% है।"],
    ["India has 2.4% of the world's land area but about 8.1% of global species diversity.", "भारत के पास विश्व का 2.4% भू-क्षेत्र है, पर लगभग 8.1% वैश्विक जाति विविधता है।"],
    ["Logistic growth gives a sigmoid curve; exponential growth gives a J-shaped curve.", "संभार वृद्धि से सिग्मॉइड वक्र और चरघातांकी वृद्धि से J-आकार का वक्र बनता है।"],
    ["Two closely related species competing for the same resources cannot coexist indefinitely.", "समान संसाधनों के लिए स्पर्धा करने वाली दो निकट संबंधी जातियाँ अनिश्चित काल तक साथ नहीं रह सकतीं।"],
    ["Biodiversity hotspots cover less than 2% of the Earth's land area.", "जैव विविधता तप्त स्थल पृथ्वी के भू-क्षेत्र के 2% से भी कम भाग में हैं।"],
    ["Decomposition is largely an oxygen-requiring process.", "अपघटन मुख्यतः ऑक्सीजन की आवश्यकता वाली प्रक्रिया है।"],
    ["Saprophytes are not given any place in ecological pyramids.", "पारिस्थितिक पिरामिडों में मृतजीवियों को कोई स्थान नहीं दिया जाता।"],
    ["The cattle egret and grazing cattle are a classic example of commensalism.", "मवेशी बगुला और चरते मवेशी सहभोजिता का प्रमुख उदाहरण हैं।"],
  ],
  ff: [
    ["The pyramid of energy can be inverted.", "ऊर्जा का पिरामिड उल्टा हो सकता है।", "It is always upright, since energy is lost as heat at every step.", "यह सदैव सीधा होता है, क्योंकि हर चरण पर ऊर्जा ऊष्मा के रूप में नष्ट होती है।"],
    ["The detritus food chain begins with green plants.", "अपरद खाद्य शृंखला हरे पौधों से शुरू होती है।", "It begins with dead organic matter; the grazing food chain begins with producers.", "यह मृत कार्बनिक पदार्थ से शुरू होती है; चारण खाद्य शृंखला उत्पादकों से।"],
    ["Exponential growth is given by dN/dt = rN(K − N)/K.", "चरघातांकी वृद्धि dN/dt = rN(K − N)/K से दी जाती है।", "That is logistic growth; exponential growth is dN/dt = rN.", "यह संभार वृद्धि है; चरघातांकी वृद्धि dN/dt = rN है।"],
    ["In commensalism, both species benefit.", "सहभोजिता में दोनों जातियों को लाभ होता है।", "One species benefits; the other is neither harmed nor benefited.", "एक जाति को लाभ होता है; दूसरी को न हानि, न लाभ।"],
    ["Species diversity increases from the equator towards the poles.", "जाति विविधता भूमध्य रेखा से ध्रुवों की ओर बढ़ती है।", "It generally decreases away from the equator; the tropics are richest.", "यह सामान्यतः भूमध्य रेखा से दूर घटती है; उष्णकटिबंध सबसे समृद्ध हैं।"],
    ["For most regions, the slope Z of the species–area line is 0.6 to 1.2.", "अधिकांश क्षेत्रों के लिए जाति-क्षेत्र रेखा की ढाल Z, 0.6 से 1.2 होती है।", "Z is usually 0.1–0.2; very large areas such as continents give 0.6–1.2.", "Z प्रायः 0.1–0.2 होता है; महाद्वीप जैसे बहुत बड़े क्षेत्रों में 0.6–1.2।"],
    ["Warm and dry conditions favour decomposition.", "गर्म और शुष्क परिस्थितियाँ अपघटन के लिए अनुकूल हैं।", "Warm and moist conditions favour it; low temperature and anaerobiosis slow it.", "गर्म और नम परिस्थितियाँ अनुकूल हैं; कम ताप और अवायुवीयता इसे धीमा करते हैं।"],
    ["India's three hotspots are the Western Ghats, the Himalaya and the Sundarbans.", "भारत के तीन तप्त स्थल पश्चिमी घाट, हिमालय और सुंदरबन हैं।", "They are Western Ghats and Sri Lanka, Indo-Burma, and the Himalaya.", "वे पश्चिमी घाट और श्रीलंका, इंडो-बर्मा तथा हिमालय हैं।"],
    ["Cattle egrets and grazing cattle show brood parasitism.", "मवेशी बगुले और चरते मवेशी अंड परजीविता दर्शाते हैं।", "They show commensalism; the cuckoo and crow show brood parasitism.", "वे सहभोजिता दर्शाते हैं; कोयल और कौवा अंड परजीविता दर्शाते हैं।"],
    ["Natality and immigration decrease population density.", "जन्मदर और आप्रवासन समष्टि घनत्व घटाते हैं।", "They increase it; mortality and emigration decrease it.", "वे इसे बढ़ाते हैं; मृत्युदर और उत्प्रवासन इसे घटाते हैं।"],
    ["Secondary productivity is the rate of formation of organic matter by producers.", "द्वितीयक उत्पादकता उत्पादकों द्वारा कार्बनिक पदार्थ बनने की दर है।", "It is the rate of formation of new organic matter by consumers.", "यह उपभोक्ताओं द्वारा नए कार्बनिक पदार्थ बनने की दर है।"],
    ["The pyramid of biomass in the sea is upright because phytoplankton outweigh fishes.", "समुद्र में जैवभार का पिरामिड सीधा होता है क्योंकि पादपप्लवक मछलियों से भारी होते हैं।", "It is generally inverted: the biomass of fishes far exceeds that of phytoplankton.", "यह प्रायः उल्टा होता है: मछलियों का जैवभार पादपप्लवकों से कहीं अधिक होता है।"],
  ],
  ar: [
    ["The pyramid of energy is always upright.", "ऊर्जा का पिरामिड सदैव सीधा होता है।", "Energy flows one way, and a large part is lost as heat at each step.", "ऊर्जा एकदिशीय बहती है और हर चरण पर उसका बड़ा भाग ऊष्मा के रूप में नष्ट होता है।"],
    ["The pyramid of biomass in the sea is generally inverted.", "समुद्र में जैवभार का पिरामिड प्रायः उल्टा होता है।", "The biomass of fishes far exceeds that of phytoplankton.", "मछलियों का जैवभार पादपप्लवकों से कहीं अधिक होता है।"],
    ["Logistic growth levels off near K.", "संभार वृद्धि K के पास स्थिर हो जाती है।", "Resources become limiting as the population approaches carrying capacity.", "समष्टि के वहन क्षमता के पास पहुँचने पर संसाधन सीमित हो जाते हैं।"],
    ["Tropical regions are richer in species than temperate regions.", "उष्णकटिबंधी क्षेत्र शीतोष्ण क्षेत्रों से जातियों में अधिक समृद्ध हैं।", "Tropical environments are less seasonal and relatively constant and predictable.", "उष्णकटिबंधी पर्यावरण कम मौसमी और अपेक्षाकृत स्थिर व पूर्वानुमेय हैं।"],
    ["Cattle egrets forage close to grazing cattle.", "मवेशी बगुले चरते मवेशियों के पास भोजन खोजते हैं।", "Moving cattle flush out insects that the egrets catch, and the cattle are unaffected.", "चलते मवेशी कीटों को उड़ा देते हैं जिन्हें बगुले पकड़ लेते हैं, और मवेशियों पर कोई प्रभाव नहीं पड़ता।"],
    ["Nile perch introduced into Lake Victoria wiped out many cichlid species.", "विक्टोरिया झील में लाई गई नाइल पर्च ने अनेक सिक्लिड जातियाँ समाप्त कर दीं।", "Alien species can turn invasive and cause decline or extinction of native species.", "विदेशी जातियाँ आक्रामक बनकर स्थानीय जातियों का ह्रास या विलोपन कर सकती हैं।"],
  ],
};

// =============================================================================================
// Računski in »koliko od naštetih« generatorji
// =============================================================================================

// ---------- Raznolikost: kategorije organizmov (NCERT 11, pogl. 2–4) ----------
const CLS = {
  cyclo: ["a cyclostome (jawless, not a true fish)", "एक साइक्लोस्टोम (जबड़ा-रहित, सच्ची मछली नहीं) है", 0],
  cart: ["a cartilaginous fish with a two-chambered heart", "दो-कक्षीय हृदय वाली उपास्थिल मछली है", 2],
  bony: ["a bony fish with a two-chambered heart", "दो-कक्षीय हृदय वाली अस्थिल मछली है", 2],
  amph: ["an amphibian with a three-chambered heart", "तीन-कक्षीय हृदय वाला उभयचर है", 3],
  rept: ["a reptile with a three-chambered heart", "तीन-कक्षीय हृदय वाला सरीसृप है", 3],
  croc: ["a reptile, but crocodiles have a four-chambered heart", "सरीसृप है, पर मगरमच्छ का हृदय चार-कक्षीय होता है", 4],
  bird: ["a bird with a four-chambered heart", "चार-कक्षीय हृदय वाला पक्षी है", 4],
  mamm: ["a mammal with a four-chambered heart", "चार-कक्षीय हृदय वाला स्तनधारी है", 4],
};
const CHORD = [
  ["Petromyzon", "lamprey", "लैम्प्रे", "cyclo"], ["Myxine", "hagfish", "हैगफिश", "cyclo"],
  ["Scoliodon", "dog fish", "डॉग फिश", "cart"], ["Pristis", "saw fish", "सॉ फिश", "cart"], ["Carcharodon", "great white shark", "ग्रेट व्हाइट शार्क", "cart"], ["Trygon", "sting ray", "स्टिंग रे", "cart"], ["Torpedo", "electric ray", "विद्युत रे", "cart"],
  ["Exocoetus", "flying fish", "उड़न मछली", "bony"], ["Hippocampus", "sea horse", "समुद्री घोड़ा", "bony"], ["Labeo", "rohu", "रोहू", "bony"], ["Catla", "katla", "कतला", "bony"], ["Clarias", "magur", "मांगुर", "bony"], ["Betta", "fighting fish", "फाइटिंग फिश", "bony"], ["Pterophyllum", "angel fish", "एंजल फिश", "bony"],
  ["Bufo", "toad", "टोड", "amph"], ["Rana", "frog", "मेंढक", "amph"], ["Hyla", "tree frog", "वृक्ष मेंढक", "amph"], ["Salamandra", "salamander", "सैलामैंडर", "amph"], ["Ichthyophis", "limbless amphibian", "पादहीन उभयचर", "amph"],
  ["Chelone", "turtle", "समुद्री कछुआ", "rept"], ["Testudo", "tortoise", "स्थलीय कछुआ", "rept"], ["Chameleon", "tree lizard", "वृक्ष छिपकली", "rept"], ["Calotes", "garden lizard", "उद्यान छिपकली", "rept"], ["Hemidactylus", "wall lizard", "दीवार छिपकली", "rept"], ["Naja", "cobra", "नाग", "rept"], ["Vipera", "viper", "वाइपर", "rept"], ["Crocodilus", "crocodile", "मगरमच्छ", "croc"],
  ["Corvus", "crow", "कौवा", "bird"], ["Columba", "pigeon", "कबूतर", "bird"], ["Psittacula", "parrot", "तोता", "bird"], ["Struthio", "ostrich", "शुतुरमुर्ग", "bird"], ["Pavo", "peacock", "मोर", "bird"], ["Aptenodytes", "penguin", "पेंगुइन", "bird"], ["Neophron", "vulture", "गिद्ध", "bird"],
  ["Ornithorhynchus", "platypus", "प्लैटिपस", "mamm"], ["Macropus", "kangaroo", "कंगारू", "mamm"], ["Pteropus", "flying fox", "उड़न लोमड़ी", "mamm"], ["Camelus", "camel", "ऊँट", "mamm"], ["Macaca", "monkey", "बंदर", "mamm"], ["Rattus", "rat", "चूहा", "mamm"], ["Delphinus", "common dolphin", "डॉल्फ़िन", "mamm"], ["Balaenoptera", "blue whale", "नीली व्हेल", "mamm"], ["Elephas", "elephant", "हाथी", "mamm"], ["Equus", "horse", "घोड़ा", "mamm"],
].map(([g, cen, chi, c]) => ({ en: `*${g}* (${cen})`, hi: `*${g}* (${chi})`, c, chambers: CLS[c][2] }));
// Nevretenčarji (NCERT 11, pogl. 4): deblo, simetrija odraslih, telesna votlina, zarodne plasti.
const PHY = {
  cnid: ["a cnidarian", "एक निडेरियन", "radial", "acoel", 2],
  cten: ["a ctenophore", "एक टीनोफोर", "radial", "acoel", 2],
  platy: ["a flatworm (Platyhelminthes)", "एक चपटा कृमि (प्लेटीहेल्मिंथीज)", "bilat", "acoel", 3],
  asch: ["a roundworm (Aschelminthes)", "एक गोलकृमि (ऐस्केलमिंथीज)", "bilat", "pseudo", 3],
  ann: ["an annelid", "एक ऐनेलिड", "bilat", "coel", 3],
  arth: ["an arthropod", "एक आर्थ्रोपोड", "bilat", "coel", 3],
  moll: ["a mollusc", "एक मोलस्क", "bilat", "coel", 3],
  echi: ["an echinoderm", "एक इकाइनोडर्म", "radial", "coel", 3],
  hemi: ["a hemichordate", "एक हेमीकॉर्डेट", "bilat", "coel", 3],
};
const INV = [
  ["Physalia", "Portuguese man-of-war", "पुर्तगाली युद्ध मानव", "cnid"], ["Adamsia", "sea anemone", "समुद्री ऐनीमोन", "cnid"], ["Pennatula", "sea-pen", "समुद्री पेन", "cnid"], ["Gorgonia", "sea-fan", "समुद्री पंखा", "cnid"], ["Meandrina", "brain coral", "मस्तिष्क प्रवाल", "cnid"],
  ["Pleurobrachia", "comb jelly", "कंकत जेली", "cten"], ["Ctenoplana", "comb jelly", "कंकत जेली", "cten"],
  ["Taenia", "tapeworm", "फीताकृमि", "platy"], ["Fasciola", "liver fluke", "यकृत पर्णाभ", "platy"],
  ["Ascaris", "roundworm", "गोलकृमि", "asch"], ["Wuchereria", "filaria worm", "फ़ाइलेरिया कृमि", "asch"], ["Ancylostoma", "hookworm", "अंकुशकृमि", "asch"],
  ["Nereis", "", "", "ann"], ["Pheretima", "earthworm", "केंचुआ", "ann"], ["Hirudinaria", "blood-sucking leech", "रक्तचूषक जोंक", "ann"],
  ["Apis", "honey bee", "मधुमक्खी", "arth"], ["Bombyx", "silkworm", "रेशम कीट", "arth"], ["Laccifer", "lac insect", "लाख कीट", "arth"], ["Locusta", "locust", "टिड्डी", "arth"], ["Limulus", "king crab", "राज कर्कट", "arth"], ["Anopheles", "mosquito", "मच्छर", "arth"],
  ["Pila", "apple snail", "सेब घोंघा", "moll"], ["Pinctada", "pearl oyster", "मुक्ता शुक्ति", "moll"], ["Sepia", "cuttlefish", "कटलफिश", "moll"], ["Loligo", "squid", "स्क्विड", "moll"], ["Octopus", "devil fish", "डेविल फिश", "moll"], ["Dentalium", "tusk shell", "टस्क शेल", "moll"],
  ["Asterias", "star fish", "तारा मछली", "echi"], ["Echinus", "sea urchin", "समुद्री अर्चिन", "echi"], ["Antedon", "sea lily", "समुद्री लिली", "echi"], ["Cucumaria", "sea cucumber", "समुद्री ककड़ी", "echi"], ["Ophiura", "brittle star", "भंगुर तारा", "echi"],
  ["Balanoglossus", "", "", "hemi"], ["Saccoglossus", "", "", "hemi"],
].map(([g, cen, chi, p]) => ({ en: cen ? `*${g}* (${cen})` : `*${g}*`, hi: chi ? `*${g}* (${chi})` : `*${g}*`, p }));
const SYM = { radial: ["radially symmetrical as an adult", "वयस्क अवस्था में अरीय सममित"], bilat: ["bilaterally symmetrical", "द्विपार्श्व सममित"] };
const COEL = { acoel: ["acoelomate", "अगुहीय"], pseudo: ["pseudocoelomate", "कूटगुहिक"], coel: ["coelomate", "प्रगुहीय (सीलोमेट)"] };
const invNote = (o, prop) => {
  const ph = PHY[o.p];
  const pr = prop === "sym" ? SYM[ph[2]] : prop === "coel" ? COEL[ph[3]] : ph[4] === 2 ? ["diploblastic", "द्विस्तरी"] : ["triploblastic", "त्रिस्तरी"];
  return [o.en, o.hi, `is ${ph[0]}, ${pr[0]}`, `${ph[1]} है, ${pr[1]}`];
};
// Rastline in glive (NCERT 11, pogl. 2–3).
const PG = {
  green: ["a green alga (Chlorophyceae)", "हरा शैवाल (क्लोरोफाइसी) है"], brown: ["a brown alga (Phaeophyceae)", "भूरा शैवाल (फियोफाइसी) है"], red: ["a red alga (Rhodophyceae)", "लाल शैवाल (रोडोफाइसी) है"],
  bryo: ["a bryophyte", "एक ब्रायोफाइट है"], pter: ["a homosporous pteridophyte", "एक समबीजाणुक टेरिडोफाइट है"], het: ["a heterosporous pteridophyte", "एक विषमबीजाणुक टेरिडोफाइट है"],
  gymno: ["a gymnosperm", "एक अनावृतबीजी है"], angio: ["an angiosperm", "एक आवृतबीजी है"],
  asco: ["an ascomycete (sac fungus)", "एक ऐस्कोमाइसिटीज (थैली कवक) है"], basi: ["a basidiomycete", "एक बेसिडियोमाइसिटीज है"], phyco: ["a phycomycete", "एक फाइकोमाइसिटीज है"], deut: ["a deuteromycete", "एक ड्यूटेरोमाइसिटीज है"],
};
const PLANTS = [
  ["Chlamydomonas", "green"], ["Volvox", "green"], ["Ulothrix", "green"], ["Spirogyra", "green"], ["Chara", "green"],
  ["Ectocarpus", "brown"], ["Dictyota", "brown"], ["Laminaria", "brown"], ["Sargassum", "brown"], ["Fucus", "brown"],
  ["Polysiphonia", "red"], ["Porphyra", "red"], ["Gracilaria", "red"], ["Gelidium", "red"],
  ["Marchantia", "bryo"], ["Funaria", "bryo"], ["Polytrichum", "bryo"], ["Sphagnum", "bryo"],
  ["Lycopodium", "pter"], ["Equisetum", "pter"], ["Dryopteris", "pter"], ["Pteris", "pter"], ["Adiantum", "pter"], ["Selaginella", "het"], ["Salvinia", "het"],
  ["Cycas", "gymno"], ["Pinus", "gymno"], ["Ginkgo", "gymno"], ["Wolffia", "angio"], ["Eucalyptus", "angio"],
  ["Aspergillus", "asco"], ["Claviceps", "asco"], ["Neurospora", "asco"], ["Penicillium", "asco"], ["Saccharomyces", "asco"],
  ["Agaricus", "basi"], ["Ustilago", "basi"], ["Puccinia", "basi"], ["Mucor", "phyco"], ["Rhizopus", "phyco"], ["Albugo", "phyco"], ["Alternaria", "deut"], ["Colletotrichum", "deut"], ["Trichoderma", "deut"],
].map(([g, k]) => ({ en: `*${g}*`, hi: `*${g}*`, k }));
const item = (o, note) => [o.en, o.hi, note[0], note[1]];
const cat = (q, yes, no) => ({ q, yes, no });
const chordCat = (q, isYes, pool = CHORD) => cat(q, pool.filter(isYes).map((o) => item(o, ["is " + CLS[o.c][0], CLS[o.c][1]])), pool.filter((o) => !isYes(o)).map((o) => item(o, ["is " + CLS[o.c][0], CLS[o.c][1]])));
const invCat = (q, isYes, prop) => cat(q, INV.filter(isYes).map((o) => invNote(o, prop)), INV.filter((o) => !isYes(o)).map((o) => invNote(o, prop)));
const plantCat = (q, yesK, noK) => cat(q, PLANTS.filter((o) => yesK.includes(o.k)).map((o) => item(o, ["is " + PG[o.k][0], PG[o.k][1]])), PLANTS.filter((o) => noK.includes(o.k)).map((o) => item(o, ["is " + PG[o.k][0], PG[o.k][1]])));
// Ribe s »ribjimi« imeni, ki niso ribe (NEET past).
const NOT_FISH = [
  ["*Sepia* (cuttlefish)", "*Sepia* (कटलफिश)", "is a mollusc", "एक मोलस्क है"],
  ["*Octopus* (devil fish)", "*Octopus* (डेविल फिश)", "is a mollusc", "एक मोलस्क है"],
  ["*Asterias* (star fish)", "*Asterias* (तारा मछली)", "is an echinoderm", "एक इकाइनोडर्म है"],
  ["*Delphinus* (dolphin)", "*Delphinus* (डॉल्फ़िन)", "is a mammal", "एक स्तनधारी है"],
  ["*Petromyzon* (lamprey)", "*Petromyzon* (लैम्प्रे)", "is a jawless cyclostome, not in Pisces", "जबड़ा-रहित साइक्लोस्टोम है, पिसीज़ में नहीं"],
];
const fishes = CHORD.filter((o) => o.c === "cart" || o.c === "bony");
const DIV_CATS = [
  null,
  [
    chordCat(["How many of the following animals are mammals?", "निम्नलिखित में से कितने जंतु स्तनधारी हैं?"], (o) => o.c === "mamm"),
    chordCat(["How many of the following are cartilaginous fishes (Chondrichthyes)?", "निम्नलिखित में से कितनी उपास्थिल मछलियाँ (कॉन्ड्रिक्थीज) हैं?"], (o) => o.c === "cart", fishes),
    invCat(["How many of the following animals are arthropods?", "निम्नलिखित में से कितने जंतु आर्थ्रोपोड हैं?"], (o) => o.p === "arth", "coel"),
    invCat(["How many of the following animals are molluscs?", "निम्नलिखित में से कितने जंतु मोलस्क हैं?"], (o) => o.p === "moll", "coel"),
    plantCat(["How many of the following are brown algae?", "निम्नलिखित में से कितने भूरे शैवाल हैं?"], ["brown"], ["green", "red"]),
    plantCat(["How many of the following are bryophytes?", "निम्नलिखित में से कितने ब्रायोफाइट हैं?"], ["bryo"], ["pter", "het", "gymno", "green"]),
  ],
  [
    chordCat(["In how many of the following animals is the heart four-chambered?", "निम्नलिखित में से कितने जंतुओं में हृदय चार-कक्षीय होता है?"], (o) => o.chambers === 4, CHORD.filter((o) => o.chambers)),
    chordCat(["How many of the following are cold-blooded (poikilothermous)?", "निम्नलिखित में से कितने असमतापी (शीत रुधिर वाले) हैं?"], (o) => !["bird", "mamm"].includes(o.c)),
    chordCat(["How many of the following fishes have an air bladder?", "निम्नलिखित में से कितनी मछलियों में वायु आशय होता है?"], (o) => o.c === "bony", fishes),
    invCat(["How many of the following animals are coelomates (have a true coelom)?", "निम्नलिखित में से कितने जंतु प्रगुहीय (वास्तविक देहगुहा वाले) हैं?"], (o) => PHY[o.p][3] === "coel", "coel"),
    plantCat(["How many of the following are ascomycetes?", "निम्नलिखित में से कितने ऐस्कोमाइसिटीज हैं?"], ["asco"], ["basi", "phyco", "deut"]),
    plantCat(["How many of the following are red algae?", "निम्नलिखित में से कितने लाल शैवाल हैं?"], ["red"], ["green", "brown"]),
    plantCat(["How many of the following are pteridophytes?", "निम्नलिखित में से कितने टेरिडोफाइट हैं?"], ["pter", "het"], ["bryo", "gymno", "angio"]),
  ],
  [
    cat(["How many of the following belong to the superclass Pisces (true fishes)?", "निम्नलिखित में से कितने अधिवर्ग पिसीज़ (सच्ची मछलियाँ) में आते हैं?"], fishes.map((o) => item(o, ["is " + CLS[o.c][0], CLS[o.c][1]])), NOT_FISH),
    invCat(["How many of the following animals are radially symmetrical as adults?", "निम्नलिखित में से कितने जंतु वयस्क अवस्था में अरीय सममित हैं?"], (o) => PHY[o.p][2] === "radial", "sym"),
    invCat(["How many of the following animals are pseudocoelomates?", "निम्नलिखित में से कितने जंतु कूटगुहिक हैं?"], (o) => o.p === "asch", "coel"),
    invCat(["How many of the following animals are diploblastic?", "निम्नलिखित में से कितने जंतु द्विस्तरी हैं?"], (o) => PHY[o.p][4] === 2, "germ"),
    plantCat(["How many of the following are heterosporous?", "निम्नलिखित में से कितने विषमबीजाणुक हैं?"], ["het"], ["pter", "bryo"]),
    chordCat(["How many of the following are mammals?", "निम्नलिखित में से कितने स्तनधारी हैं?"], (o) => o.c === "mamm", CHORD.filter((o) => ["mamm", "bony", "bird", "amph"].includes(o.c))),
  ],
];

const DIVERSITY_COUNT = {
  id: "exi-bio-diversity-count",
  topics: [T("diversity-of-living-organisms")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    if (level === 1 && r.int(0, 2) === 0) {
      const pool = CHORD.filter((o) => o.chambers);
      const o = r.pick(pool);
      const c = o.chambers;
      const mist = {
        2: [[3, L("Fishes have a single auricle and a single ventricle.", "मछलियों में एक ही अलिंद और एक ही निलय होता है।")], [4, L("Only birds, mammals and crocodiles have a completely divided heart.", "केवल पक्षियों, स्तनधारियों और मगरमच्छों का हृदय पूर्णतः विभाजित होता है।")]],
        3: [[4, L(o.c === "rept" ? "Among reptiles only crocodiles have a four-chambered heart." : "Amphibians have two auricles but only one ventricle.", o.c === "rept" ? "सरीसृपों में केवल मगरमच्छ का हृदय चार-कक्षीय होता है।" : "उभयचरों में दो अलिंद, पर केवल एक निलय होता है।")], [2, L("Two auricles are present here, not one.", "यहाँ एक नहीं, दो अलिंद होते हैं।")]],
        4: [[3, L(o.c === "croc" ? "Crocodiles are the exception among reptiles." : "Birds and mammals have a completely divided ventricle.", o.c === "croc" ? "सरीसृपों में मगरमच्छ अपवाद है।" : "पक्षियों और स्तनधारियों का निलय पूर्णतः विभाजित होता है।")], [2, L("Two-chambered hearts occur in fishes.", "दो-कक्षीय हृदय मछलियों में होता है।")]],
      }[c];
      return task({
        text: L(`How many chambers does the heart of ${o.en} have?`, `${o.hi} के हृदय में कितने कक्ष होते हैं?`),
        answer: numM(c, 0, mist),
        data: { given: [tx(L(strip(o.en), strip(o.hi)))], find: [tx(L("number of chambers", "कक्षों की संख्या"))] },
        hint: L("First decide the class of the animal, then recall the heart of that class.", "पहले जंतु का वर्ग पहचानिए, फिर उस वर्ग का हृदय याद कीजिए।"),
        solution: L(S(`${o.en} ${CLS[o.c][0]}.`, `Chambers: ${c}`), S(`${o.hi} ${CLS[o.c][1]}।`, `कक्ष: ${c}`)),
      });
    }
    const c = r.pick(DIV_CATS[level]);
    return countCategory(r, L, c, [0, 4, 5, 6][level]);
  },
};

// ---------- Zdravje: povzročitelji, prenos, imunost (NCERT 12, pogl. 7) ----------
const DIS = [
  ["Typhoid", "टाइफ़ॉइड", "bact", "is caused by the bacterium *Salmonella typhi*", "जीवाणु *Salmonella typhi* से होता है", "food"],
  ["Pneumonia", "न्यूमोनिया", "bact", "is caused by bacteria (*Streptococcus pneumoniae*, *Haemophilus influenzae*)", "जीवाणुओं (*Streptococcus pneumoniae*, *Haemophilus influenzae*) से होता है", "air"],
  ["Plague", "प्लेग", "bact", "is a bacterial disease", "एक जीवाणु रोग है", ""],
  ["Diphtheria", "डिफ़्थीरिया", "bact", "is a bacterial disease", "एक जीवाणु रोग है", ""],
  ["Common cold", "सामान्य जुकाम", "virus", "is caused by rhinoviruses", "राइनोवायरस से होता है", "air"],
  ["AIDS", "एड्स", "virus", "is caused by HIV, a retrovirus", "रिट्रोवायरस HIV से होता है", "body"],
  ["Malaria", "मलेरिया", "proto", "is caused by the protozoan *Plasmodium*", "प्रोटोजोआ *Plasmodium* से होता है", "mosq"],
  ["Amoebiasis", "अमीबता", "proto", "is caused by the protozoan *Entamoeba histolytica*", "प्रोटोजोआ *Entamoeba histolytica* से होता है", "food"],
  ["Ascariasis", "ऐस्कैरिसता", "helm", "is caused by the roundworm *Ascaris*", "गोलकृमि *Ascaris* से होता है", "food"],
  ["Elephantiasis", "फ़ीलपाँव", "helm", "is caused by the filarial worm *Wuchereria*", "फ़ाइलेरिया कृमि *Wuchereria* से होता है", "mosq"],
  ["Ringworm", "दाद", "fungus", "is caused by fungi such as *Trichophyton*", "*Trichophyton* जैसे कवकों से होता है", "touch"],
];
const SPREAD = {
  food: ["spreads through contaminated food and water", "दूषित भोजन और जल से फैलता है"],
  air: ["spreads through droplets from an infected person", "संक्रमित व्यक्ति की बूँदिकाओं से फैलता है"],
  body: ["spreads through infected blood, needles, sexual contact or mother to child", "संक्रमित रक्त, सुई, यौन संपर्क या माता से शिशु में फैलता है"],
  mosq: ["is spread by the bite of a female mosquito", "मादा मच्छर के काटने से फैलता है"],
  touch: ["spreads from soil or shared towels, clothes and combs", "मृदा या साझा तौलिये, कपड़ों और कंघी से फैलता है"],
};
const disCat = (q, key) => cat(q, DIS.filter((d) => d[2] === key).map((d) => [d[0], d[1], d[3], d[4]]), DIS.filter((d) => d[2] !== key).map((d) => [d[0], d[1], d[3], d[4]]));
const spreadCat = (q, key) => {
  const pool = DIS.filter((d) => d[5]);
  const f = (d) => [d[0], d[1], SPREAD[d[5]][0], SPREAD[d[5]][1]];
  return cat(q, pool.filter((d) => d[5] === key).map(f), pool.filter((d) => d[5] !== key).map(f));
};
const LYMPH = [
  ["bone marrow", "अस्थि मज्जा", 1], ["thymus", "थाइमस", 1], ["spleen", "प्लीहा", 2], ["lymph nodes", "लसीका ग्रंथियाँ", 2], ["tonsils", "टॉन्सिल", 2], ["Peyer's patches", "पेयर पैच", 2], ["appendix", "परिशेषिका", 2],
];
const lymphNote = (o) => [o[0], o[1], o[2] === 1 ? "is a primary lymphoid organ" : "is a secondary lymphoid organ", o[2] === 1 ? "प्राथमिक लसीकाभ अंग है" : "द्वितीयक लसीकाभ अंग है"];
const BARRIER = [
  ["acid in the stomach", "आमाशय का अम्ल", "phys"], ["saliva in the mouth", "मुख की लार", "phys"], ["tears from the eyes", "आँखों के आँसू", "phys"],
  ["skin", "त्वचा", "physical"], ["mucus lining the respiratory tract", "श्वसन मार्ग की श्लेष्मा", "physical"],
  ["neutrophils (PMNL)", "न्यूट्रोफिल (PMNL)", "cell"], ["natural killer cells", "प्राकृतिक मारक कोशिकाएँ", "cell"], ["macrophages", "महाभक्षकाणु", "cell"], ["interferons", "इंटरफेरॉन", "cyto"],
];
const BAR_NOTE = {
  phys: ["is a physiological barrier", "शरीरक्रियात्मक रोध है"], physical: ["is a physical barrier", "भौतिक रोध है"], cell: ["is a cellular barrier", "कोशिकीय रोध है"], cyto: ["is a cytokine barrier", "साइटोकाइन रोध है"],
};
const PASSIVE = [
  ["IgA antibodies in colostrum", "खीस की IgA प्रतिरक्षियाँ", 1], ["antibodies reaching the foetus through the placenta", "अपरा से भ्रूण तक पहुँची प्रतिरक्षियाँ", 1], ["anti-tetanus antitoxin injection", "प्रति-टिटनेस प्रतिविष का इंजेक्शन", 1], ["antivenom given after a snake bite", "साँप के काटने पर दिया गया प्रतिविष", 1],
  ["hepatitis B vaccine", "हेपेटाइटिस B का टीका", 0], ["recovery from a natural infection", "प्राकृतिक संक्रमण से उबरना", 0], ["a vaccine of inactivated pathogens", "निष्क्रिय रोगजनकों का टीका", 0],
];
const pasNote = (o) => [o[0], o[1], o[2] ? "gives ready-made antibodies: passive immunity" : "makes the body produce antibodies: active immunity", o[2] ? "बनी-बनाई प्रतिरक्षियाँ देता है: निष्क्रिय प्रतिरक्षा" : "शरीर से प्रतिरक्षियाँ बनवाता है: सक्रिय प्रतिरक्षा"];
const DRUGS = [
  ["marijuana", "मारिजुआना", 1], ["hashish", "हशीश", 1], ["charas", "चरस", 1], ["ganja", "गाँजा", 1], ["heroin", "हेरोइन", 0], ["morphine", "मॉर्फ़ीन", 0], ["cocaine", "कोकेन", 0],
];
const drugNote = (o) => [o[0], o[1], o[2] ? "is a cannabinoid from *Cannabis sativa*" : o[0] === "cocaine" ? "is a coca alkaloid" : "is an opioid", o[2] ? "*Cannabis sativa* से प्राप्त कैनाबिनॉइड है" : o[0] === "cocaine" ? "कोका ऐल्कलॉइड है" : "एक ओपिऑइड है"];
const split = (arr, f, yesFn) => cat(null, arr.filter(yesFn).map(f), arr.filter((o) => !yesFn(o)).map(f));
const HEALTH_CATS = [
  null,
  [
    disCat(["How many of the following diseases are caused by bacteria?", "निम्नलिखित में से कितने रोग जीवाणुओं से होते हैं?"], "bact"),
    disCat(["How many of the following diseases are caused by viruses?", "निम्नलिखित में से कितने रोग विषाणुओं से होते हैं?"], "virus"),
    disCat(["How many of the following diseases are caused by protozoans?", "निम्नलिखित में से कितने रोग प्रोटोजोआ से होते हैं?"], "proto"),
    disCat(["How many of the following diseases are caused by helminths (worms)?", "निम्नलिखित में से कितने रोग कृमियों (हेल्मिंथ) से होते हैं?"], "helm"),
  ],
  [
    spreadCat(["How many of the following diseases spread through contaminated food or water?", "निम्नलिखित में से कितने रोग दूषित भोजन या जल से फैलते हैं?"], "food"),
    spreadCat(["How many of the following diseases are spread by mosquito bites?", "निम्नलिखित में से कितने रोग मच्छर के काटने से फैलते हैं?"], "mosq"),
    { ...split(LYMPH, lymphNote, (o) => o[2] === 2), q: ["How many of the following are secondary lymphoid organs?", "निम्नलिखित में से कितने द्वितीयक लसीकाभ अंग हैं?"] },
    { ...split(DRUGS, drugNote, (o) => o[2] === 1), q: ["How many of the following drugs are cannabinoids?", "निम्नलिखित में से कितने ड्रग कैनाबिनॉइड हैं?"] },
  ],
  [
    { ...split(BARRIER, (o) => [o[0], o[1], BAR_NOTE[o[2]][0], BAR_NOTE[o[2]][1]], (o) => o[2] === "phys"), q: ["How many of the following are physiological barriers of innate immunity?", "निम्नलिखित में से कितने सहज प्रतिरक्षा के शरीरक्रियात्मक रोध हैं?"] },
    { ...split(PASSIVE, pasNote, (o) => o[2] === 1), q: ["How many of the following give passive immunity?", "निम्नलिखित में से कितने निष्क्रिय प्रतिरक्षा देते हैं?"] },
    { ...split(LYMPH, lymphNote, (o) => o[2] === 1), q: ["How many of the following are primary lymphoid organs?", "निम्नलिखित में से कितने प्राथमिक लसीकाभ अंग हैं?"] },
    { ...split(BARRIER, (o) => [o[0], o[1], BAR_NOTE[o[2]][0], BAR_NOTE[o[2]][1]], (o) => o[2] === "cell"), q: ["How many of the following are cellular barriers of innate immunity?", "निम्नलिखित में से कितने सहज प्रतिरक्षा के कोशिकीय रोध हैं?"] },
  ],
];
const HEALTH_COUNT = {
  id: "exi-bio-health-count",
  topics: [T("human-health-and-disease")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    return countCategory(r, L, r.pick(HEALTH_CATS[level]), [0, 4, 5, 5][level]);
  },
};

// ---------- Celica: ribosomi, mikrotubuli, vezi v biomolekulah ----------
const RIBO_SITES = [
  ["bacteria", "जीवाणुओं", 70], ["chloroplasts", "हरितलवकों", 70], ["mitochondria", "सूत्रकणिकाओं", 70],
  ["the cytoplasm of a eukaryotic cell", "यूकैरियोटी कोशिका के कोशिकाद्रव्य", 80], ["the rough ER of a liver cell", "यकृत कोशिका की खुरदरी अंतर्द्रव्यी जालिका", 80],
];
const RIBO = { 70: [50, 30], 80: [60, 40] };
const CELL_CALC = {
  id: "exi-bio-cell-calc",
  topics: [T("cell-structure-and-biomolecules")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, level === 3 ? 3 : 2);
    if (level === 1 && v === 0) {
      const [sEn, sHi, S0] = r.pick(RIBO_SITES);
      const part = r.int(0, 2); // 0 cel, 1 velika, 2 mala podenota
      const other = S0 === 70 ? 80 : 70;
      const ans = part === 0 ? S0 : RIBO[S0][part - 1];
      const what = [["whole ribosome", "पूरे राइबोसोम"], ["larger subunit", "बड़ी उप-इकाई"], ["smaller subunit", "छोटी उप-इकाई"]][part];
      const mist = part === 0
        ? [[other, L(S0 === 70 ? "Chloroplasts, mitochondria and bacteria have the smaller, prokaryote-type ribosomes." : "Eukaryotic cytoplasmic ribosomes are the larger type.", S0 === 70 ? "हरितलवक, सूत्रकणिका और जीवाणुओं में छोटे, प्रोकैरियोटी प्रकार के राइबोसोम होते हैं।" : "यूकैरियोटी कोशिकाद्रव्य के राइबोसोम बड़े प्रकार के होते हैं।")]]
        : [[S0 - RIBO[S0][2 - part], L("Svedberg (S) values are not additive; you cannot subtract one subunit from the whole.", "स्वेडबर्ग (S) मान जुड़ते नहीं हैं; पूरे में से एक उप-इकाई घटाई नहीं जा सकती।")], [RIBO[other][part - 1], L("That subunit belongs to the other type of ribosome.", "यह उप-इकाई दूसरे प्रकार के राइबोसोम की है।")], [RIBO[S0][2 - part], L("You gave the other subunit of this ribosome.", "आपने इसी राइबोसोम की दूसरी उप-इकाई बताई।")]];
      return task({
        text: L(`What is the sedimentation coefficient (in S) of the ${what[0]} of ribosomes found in ${sEn}?`, `${sHi} में पाए जाने वाले राइबोसोम की ${what[1]} का अवसादन गुणांक (S में) कितना है?`),
        answer: numM(ans, 0, mist),
        data: { given: [tx(L(sEn, sHi))], find: [`S`] },
        hint: L("Decide first whether these are 70S or 80S ribosomes; remember S values are not additive.", "पहले तय कीजिए कि ये 70S हैं या 80S; याद रखिए कि S मान जुड़ते नहीं हैं।"),
        solution: L(S(`Ribosomes of ${sEn}: ${S0}S = ${RIBO[S0][0]}S + ${RIBO[S0][1]}S subunits (S values do not add up).`, `${cap(what[0])}: ${ans}S`), S(`${sHi} के राइबोसोम: ${S0}S = ${RIBO[S0][0]}S + ${RIBO[S0][1]}S उप-इकाइयाँ (S मान जुड़ते नहीं)।`, `${what[1]}: ${ans}S`)),
      });
    }
    if (level === 1) {
      const poly = v === 1;
      const n = poly ? r.int(15, 180) : r.int(12, 400);
      const askWater = r.int(0, 1);
      const unit = poly ? ["amino acids", "ऐमीनो अम्लों"] : ["glucose units", "ग्लूकोस इकाइयों"];
      const bond = poly ? ["peptide bonds", "पेप्टाइड बंध"] : ["glycosidic bonds", "ग्लाइकोसाइडी बंध"];
      const chain = poly ? ["a linear polypeptide", "एक रैखिक पॉलीपेप्टाइड"] : ["an unbranched polysaccharide chain", "एक अशाखित पॉलीसैकेराइड शृंखला"];
      const ask = askWater ? ["water molecules are released when it is formed", "इसके बनने में जल के कितने अणु मुक्त होते हैं"] : [`${bond[0]} does it contain`, `इसमें कितने ${bond[1]} हैं`];
      return task({
        text: L(`${cap(chain[0])} is made of ${n} ${unit[0]}. How many ${ask[0]}?`, `${chain[1]} ${n} ${unit[1]} से बनी है। ${ask[1]}?`),
        answer: numM(n - 1, 0, [[n, L("A chain has one bond fewer than its units.", "किसी शृंखला में इकाइयों से एक बंध कम होता है।")], [n + 1, L("Count the links between neighbouring units only.", "केवल पड़ोसी इकाइयों के बीच की कड़ियाँ गिनिए।")]]),
        data: { given: [`n = ${n}`], find: [askWater ? "N(\\mathrm{H_2O})" : `N_{${tx(L("bonds", "बंध"))}}`] },
        hint: L("Each new bond forms by removing one water molecule between two neighbouring units.", "प्रत्येक नया बंध दो पड़ोसी इकाइयों के बीच एक जल अणु हटाकर बनता है।"),
        formula: "N = n - 1",
        solution: L(S(`Bonds join neighbouring units: $N = n - 1$`, `$N = ${n} - 1 = ${n - 1}$`, askWater ? `One water molecule is released per bond: ${n - 1}.` : null), S(`बंध पड़ोसी इकाइयों को जोड़ते हैं: $N = n - 1$`, `$N = ${n} - 1 = ${n - 1}$`, askWater ? `प्रति बंध एक जल अणु मुक्त होता है: ${n - 1}।` : null)),
      });
    }
    if (level === 2 && v === 0) {
      const k = r.int(1, 6);
      const kind = r.int(0, 2); // 0 cilia, 1 flagella, 2 centrioles
      const per = kind === 2 ? 27 : 20;
      const name = [["cilia", "पक्ष्माभों", "पक्ष्माभ"], ["flagella", "कशाभों", "कशाभ"], ["centrioles", "तारककेंद्रों", "तारककेंद्र"]][kind];
      const ans = per * k;
      const mist = kind === 2
        ? [[9 * k, L("Each peripheral fibril of a centriole is a triplet, not a single tubule.", "तारककेंद्र का प्रत्येक परिधीय तंतुक त्रिक होता है, एकल नलिका नहीं।")], [29 * k, L("A centriole has a protein hub but no central pair of microtubules.", "तारककेंद्र में प्रोटीन धुरी होती है, केंद्रीय सूक्ष्मनलिका युग्म नहीं।")]]
        : [[11 * k, L("Each of the nine peripheral units is a doublet (two microtubules).", "नौ परिधीय इकाइयों में से प्रत्येक द्विक (दो सूक्ष्मनलिकाएँ) है।")], [18 * k, L("Add the central pair of microtubules.", "केंद्रीय सूक्ष्मनलिका युग्म भी जोड़िए।")], [27 * k, L("Cilia and flagella have doublets, not the triplets of centrioles.", "पक्ष्माभ व कशाभ में द्विक होते हैं, तारककेंद्र जैसे त्रिक नहीं।")]];
      return task({
        text: L(`How many microtubules in total are seen in a cross-section through ${k === 1 ? "one" : k} ${k === 1 ? name[0].replace(/ia$/, "ium").replace(/la$/, "lum").replace(/oles$/, "ole") : name[0]} (axoneme or cylinder only)?`, `${k === 1 ? `एक ${name[2]}` : `${k} ${name[1]}`} के अनुप्रस्थ काट (केवल अक्षसूत्र या बेलन) में कुल कितनी सूक्ष्मनलिकाएँ दिखेंगी?`),
        answer: numM(ans, 0, mist),
        data: { given: k > 1 ? [`k = ${k}`] : [], find: [`N_{${tx(L("microtubules", "सूक्ष्मनलिकाएँ"))}}`] },
        hint: L(kind === 2 ? "Recall the cartwheel: how many peripheral fibrils, and how many tubules in each?" : "Recall the 9 + 2 pattern and how many tubules make each peripheral unit.", kind === 2 ? "गाड़ी के पहिये जैसी संरचना याद कीजिए: कितने परिधीय तंतुक और प्रत्येक में कितनी नलिकाएँ?" : "9 + 2 व्यवस्था याद कीजिए और प्रत्येक परिधीय इकाई में कितनी नलिकाएँ हैं।"),
        formula: kind === 2 ? "N = k \\cdot 9 \\cdot 3" : "N = k \\,(9 \\cdot 2 + 2)",
        solution: L(
          S(kind === 2 ? "One centriole: 9 triplets = $9 \\cdot 3 = 27$ microtubules." : "One axoneme: 9 doublets + central pair = $9 \\cdot 2 + 2 = 20$ microtubules.", `$N = ${k} \\cdot ${per} = ${ans}$`),
          S(kind === 2 ? "एक तारककेंद्र: 9 त्रिक = $9 \\cdot 3 = 27$ सूक्ष्मनलिकाएँ।" : "एक अक्षसूत्र: 9 द्विक + केंद्रीय युग्म = $9 \\cdot 2 + 2 = 20$ सूक्ष्मनलिकाएँ।", `$N = ${k} \\cdot ${per} = ${ans}$`),
        ),
      });
    }
    if (level === 2 && v === 2) {
      const k = r.int(2, 40);
      const ask = r.int(0, 1);
      return task({
        text: L(`${k} molecules of a triglyceride are formed from glycerol and fatty acids. How many ${ask ? "fatty acid molecules are used" : "water molecules are released"}?`, `ग्लिसरॉल और वसा अम्लों से ट्राइग्लिसराइड के ${k} अणु बनते हैं। ${ask ? "कितने वसा अम्ल अणु लगते हैं" : "जल के कितने अणु मुक्त होते हैं"}?`),
        answer: numM(3 * k, 0, [[k, L("Each triglyceride has three fatty acids, each joined by its own ester bond.", "प्रत्येक ट्राइग्लिसराइड में तीन वसा अम्ल होते हैं, प्रत्येक अपने एस्टर बंध से जुड़ा।")], [2 * k, L("‘Tri’-glyceride: count all three esterified –OH groups of glycerol.", "‘ट्राइ’-ग्लिसराइड: ग्लिसरॉल के तीनों एस्टरीकृत –OH समूह गिनिए।")], [4 * k, L("Glycerol itself is not counted; only fatty acids are esterified.", "ग्लिसरॉल स्वयं नहीं गिना जाता; केवल वसा अम्ल एस्टरीकृत होते हैं।")]]),
        data: { given: [`k = ${k}`], find: [ask ? `N_{${tx(L("fatty acids", "वसा अम्ल"))}}` : "N(\\mathrm{H_2O})"] },
        hint: L("A glycerol has three –OH groups; each one is esterified with a fatty acid.", "ग्लिसरॉल में तीन –OH समूह हैं; प्रत्येक एक वसा अम्ल से एस्टरीकृत होता है।"),
        formula: "N = 3k",
        solution: L(S("One triglyceride = glycerol + 3 fatty acids, with 3 ester bonds and 3 water molecules released.", `$N = 3 \\cdot ${k} = ${3 * k}$`), S("एक ट्राइग्लिसराइड = ग्लिसरॉल + 3 वसा अम्ल; 3 एस्टर बंध बनते हैं और 3 जल अणु मुक्त होते हैं।", `$N = 3 \\cdot ${k} = ${3 * k}$`)),
      });
    }
    if (level === 2 || (level === 3 && v === 0)) {
      const c = r.int(2, 4);
      const lens = Array.from({ length: c }, () => r.int(12, 140));
      const N = sum(lens);
      const s = level === 3 ? r.int(1, 3) : 0;
      const mist = [[N - 1, L("Each separate chain has one fewer bond than its residues; subtract once per chain.", "प्रत्येक अलग शृंखला में अवशेषों से एक बंध कम होता है; प्रत्येक शृंखला के लिए एक घटाइए।")], [N, L("A chain of n amino acids has n − 1 peptide bonds, not n.", "n ऐमीनो अम्लों की शृंखला में n − 1 पेप्टाइड बंध होते हैं, n नहीं।")]];
      if (s) mist.unshift([N - c + s, L("Disulfide bridges join cysteine side chains; they are not peptide bonds.", "डाइसल्फ़ाइड सेतु सिस्टीन पार्श्व शृंखलाओं को जोड़ते हैं; वे पेप्टाइड बंध नहीं हैं।")]);
      const list = lens.join(", ");
      return task({
        text: L(`A protein has ${c} polypeptide chains of ${list} amino acids${s ? `, held together by ${s} disulfide bridge${s > 1 ? "s" : ""}` : ""}. How many peptide bonds does it contain?`, `एक प्रोटीन में ${list} ऐमीनो अम्लों की ${c} पॉलीपेप्टाइड शृंखलाएँ हैं${s ? `, जो ${s} डाइसल्फ़ाइड ${s > 1 ? "सेतुओं" : "सेतु"} से जुड़ी हैं` : ""}। इसमें कितने पेप्टाइड बंध हैं?`),
        answer: numM(N - c, 0, mist),
        data: { given: [`n_i = ${list}`, `c = ${c}`, s ? `s = ${s}` : null].filter(Boolean), find: [`N_{${tx(L("peptide", "पेप्टाइड"))}}`] },
        hint: L("Count the bonds inside each chain separately, then add.", "प्रत्येक शृंखला के भीतर के बंध अलग-अलग गिनकर जोड़िए।"),
        formula: "N = n - c",
        solution: L(
          S(`Total amino acids: $n = ${lens.join(" + ")} = ${N}$`, `Each chain loses one: $N = ${N} - ${c} = ${N - c}$`, s ? "Disulfide bridges are not peptide bonds, so they are not counted." : null),
          S(`कुल ऐमीनो अम्ल: $n = ${lens.join(" + ")} = ${N}$`, `प्रत्येक शृंखला से एक कम: $N = ${N} - ${c} = ${N - c}$`, s ? "डाइसल्फ़ाइड सेतु पेप्टाइड बंध नहीं हैं, इसलिए नहीं गिने जाते।" : null),
        ),
      });
    }
    if (v === 1) {
      const n = r.int(40, 400);
      const b = r.int(2, 9);
      return task({
        text: L(`A branched glycogen fragment has ${n} glucose units and ${b} branch points. How many glycosidic bonds join its glucose units?`, `ग्लाइकोजन के एक शाखित खंड में ${n} ग्लूकोस इकाइयाँ और ${b} शाखा बिंदु हैं। इसकी ग्लूकोस इकाइयों को कितने ग्लाइकोसाइडी बंध जोड़ते हैं?`),
        answer: numM(n - 1, 0, [[n - 1 + b, L("A branch point is itself one of the glycosidic links; do not add it again.", "शाखा बिंदु स्वयं एक ग्लाइकोसाइडी कड़ी है; उसे दोबारा न जोड़िए।")], [n - 1 - b, L("Branch links are glycosidic bonds too; do not subtract them.", "शाखा कड़ियाँ भी ग्लाइकोसाइडी बंध हैं; उन्हें घटाइए नहीं।")], [n, L("A connected molecule of n units has one link fewer than n.", "n इकाइयों के जुड़े अणु में n से एक कड़ी कम होती है।")]]),
        data: { given: [`n = ${n}`, `b = ${b}`], find: [`N_{${tx(L("glycosidic", "ग्लाइकोसाइडी"))}}`] },
        hint: L("Think of the molecule as a tree: every unit except the first is attached by exactly one bond.", "अणु को एक वृक्ष की तरह सोचिए: पहली इकाई को छोड़कर हर इकाई ठीक एक बंध से जुड़ी है।"),
        formula: "N = n - 1",
        solution: L(S("Every glucose except the first is joined to the molecule by one bond; branching does not change this.", `$N = ${n} - 1 = ${n - 1}$`), S("पहले ग्लूकोस को छोड़कर हर ग्लूकोस एक बंध से जुड़ा है; शाखन से यह नहीं बदलता।", `$N = ${n} - 1 = ${n - 1}$`)),
      });
    }
    if (v === 2) {
      const n = r.int(30, 300);
      const f = r.int(3, 12);
      return task({
        text: L(`A protease cuts a linear polypeptide of ${n} amino acids into ${f} smaller peptides. How many water molecules are used in this hydrolysis?`, `एक प्रोटिएज ${n} ऐमीनो अम्लों के रैखिक पॉलीपेप्टाइड को ${f} छोटे पेप्टाइडों में काटता है। इस जल-अपघटन में जल के कितने अणु लगते हैं?`),
        answer: numM(f - 1, 0, [[f, L("Cutting a line into f pieces needs one cut fewer than f.", "किसी रेखा को f टुकड़ों में काटने के लिए f से एक कम कटान चाहिए।")], [n - 1, L("Only the cut bonds are hydrolysed, not every peptide bond.", "केवल कटे बंधों का जल-अपघटन होता है, हर पेप्टाइड बंध का नहीं।")], [n - f, L("That counts the bonds left inside the peptides.", "यह पेप्टाइडों के भीतर बचे बंधों की संख्या है।")]]),
        data: { given: [`n = ${n}`, `f = ${f}`], find: ["N(\\mathrm{H_2O})"] },
        hint: L("Each hydrolysed peptide bond uses one water molecule. How many bonds must break to get f pieces?", "प्रत्येक पेप्टाइड बंध के जल-अपघटन में एक जल अणु लगता है। f टुकड़ों के लिए कितने बंध टूटेंगे?"),
        formula: "N = f - 1",
        solution: L(S(`${f} pieces from one chain need ${f - 1} cuts.`, `One water per cut: $N = ${f} - 1 = ${f - 1}$`), S(`एक शृंखला से ${f} टुकड़ों के लिए ${f - 1} कटान चाहिए।`, `प्रति कटान एक जल अणु: $N = ${f} - 1 = ${f - 1}$`)),
      });
    }
    const k = r.int(1, 5);
    const ans = 20 * k + 54;
    return task({
      text: L(`A flagellated cell has ${k} flagell${k > 1 ? "a" : "um"} and one centrosome. How many microtubules in total make up the axonemes of the flagella and the centrioles of the centrosome?`, `एक कशाभी कोशिका में ${k} कशाभ और एक तारककाय है। कशाभों के अक्षसूत्रों और तारककाय के तारककेंद्रों में कुल कितनी सूक्ष्मनलिकाएँ हैं?`),
      answer: numM(ans, 0, [[20 * k + 27, L("A centrosome contains two centrioles.", "एक तारककाय में दो तारककेंद्र होते हैं।")], [11 * k + 18, L("Count every tubule: peripheral units are doublets and triplets.", "हर नलिका गिनिए: परिधीय इकाइयाँ द्विक और त्रिक होती हैं।")], [27 * k + 54, L("Flagella have doublets, not triplets.", "कशाभ में द्विक होते हैं, त्रिक नहीं।")]]),
      data: { given: [`k = ${k}`], find: ["N"] },
      hint: L("Add the axoneme tubules (9 + 2 pattern) and the centriole tubules (cartwheel of triplets) separately.", "अक्षसूत्र की नलिकाएँ (9 + 2) और तारककेंद्र की नलिकाएँ (त्रिकों का पहिया) अलग-अलग जोड़िए।"),
      formula: "N = 20k + 2 \\cdot 27",
      solution: L(S(`Axonemes: $${k} \\cdot (9 \\cdot 2 + 2) = ${20 * k}$`, "Centrosome = 2 centrioles: $2 \\cdot 9 \\cdot 3 = 54$", `$N = ${20 * k} + 54 = ${ans}$`), S(`अक्षसूत्र: $${k} \\cdot (9 \\cdot 2 + 2) = ${20 * k}$`, "तारककाय = 2 तारककेंद्र: $2 \\cdot 9 \\cdot 3 = 54$", `$N = ${20 * k} + 54 = ${ans}$`)),
    });
  },
};

// ---------- Delitev celice: kromosomi in DNA (C) po stopnjah ----------
// [en, hi, kromosomi (× n), DNA (× C), napake [[faktor DNA, whyEn, whyHi]]]
const DSTAGE = {
  g2: ["G₂ phase", "G₂ प्रावस्था", 2, 4, [[2, "DNA was already replicated in S phase.", "S प्रावस्था में DNA की प्रतिकृति हो चुकी है।"]], []],
  meta: ["metaphase of mitosis", "समसूत्री विभाजन की मध्यावस्था", 2, 4, [[2, "Each metaphase chromosome has two chromatids: DNA is still doubled.", "मध्यावस्था के प्रत्येक गुणसूत्र में दो अर्धगुणसूत्र हैं: DNA अभी भी दुगुना है।"]], [[4, "Chromosomes are counted by centromeres; sister chromatids still share one.", "गुणसूत्र गुणसूत्रबिंदुओं से गिने जाते हैं; सहोदर अर्धगुणसूत्रों का अभी एक ही होता है।"], [1, "Mitosis never halves the chromosome number.", "समसूत्री विभाजन गुणसूत्र संख्या कभी आधी नहीं करता।"]]],
  ana: ["anaphase of mitosis", "समसूत्री विभाजन की पश्चावस्था", 4, 4, [[2, "The cell has not divided yet; all replicated DNA is still in one cell.", "कोशिका अभी विभाजित नहीं हुई; सारा प्रतिकृत DNA अभी एक ही कोशिका में है।"], [8, "Separation of chromatids does not make new DNA.", "अर्धगुणसूत्रों के अलग होने से नया DNA नहीं बनता।"]], [[2, "In anaphase the centromeres split, so each separated chromatid counts as a chromosome.", "पश्चावस्था में गुणसूत्रबिंदु विभाजित होते हैं, इसलिए प्रत्येक अलग अर्धगुणसूत्र एक गुणसूत्र गिना जाता है।"]]],
  daughter: ["a daughter cell just after mitosis", "समसूत्री विभाजन के ठीक बाद की संतति कोशिका", 2, 2, [[4, "Each daughter gets only half of the replicated DNA.", "प्रत्येक संतति कोशिका को प्रतिकृत DNA का केवल आधा मिलता है।"], [1, "Mitosis does not halve the original amount.", "समसूत्री विभाजन मूल मात्रा को आधा नहीं करता।"]], [[1, "Mitosis keeps the chromosome number unchanged.", "समसूत्री विभाजन गुणसूत्र संख्या नहीं बदलता।"], [4, "The doubled number seen in anaphase is shared between two cells.", "पश्चावस्था की दुगुनी संख्या दो कोशिकाओं में बँट जाती है।"]]],
  m1: ["metaphase I", "मध्यावस्था I", 2, 4, [[2, "DNA replicated before meiosis began.", "अर्धसूत्री विभाजन शुरू होने से पहले DNA की प्रतिकृति हो चुकी है।"]], [[1, "The number is halved only when meiosis I is complete.", "संख्या अर्धसूत्री विभाजन I पूरा होने पर ही आधी होती है।"], [4, "Chromosomes are counted by centromeres; a bivalent has two, not four.", "गुणसूत्र गुणसूत्रबिंदुओं से गिने जाते हैं; एक युगली में दो होते हैं, चार नहीं।"]]],
  a1: ["anaphase I", "पश्चावस्था I", 2, 4, [[2, "The cell has not divided yet in anaphase I.", "पश्चावस्था I में कोशिका अभी विभाजित नहीं हुई है।"], [8, "No new DNA is made during meiosis.", "अर्धसूत्री विभाजन में नया DNA नहीं बनता।"]], [[1, "Homologues are moving apart, but the cell has not divided yet.", "समजात अलग हो रहे हैं, पर कोशिका अभी विभाजित नहीं हुई है।"], [4, "In anaphase I centromeres do not split; sister chromatids stay together.", "पश्चावस्था I में गुणसूत्रबिंदु विभाजित नहीं होते; सहोदर अर्धगुणसूत्र साथ रहते हैं।"]]],
  inter: ["a cell at interkinesis (after meiosis I)", "अंतरालावस्था की कोशिका (अर्धसूत्री विभाजन I के बाद)", 1, 2, [[1, "No DNA replication or chromatid separation has happened since meiosis I; chromosomes still have two chromatids.", "अर्धसूत्री विभाजन I के बाद न प्रतिकृति हुई, न अर्धगुणसूत्र अलग हुए; गुणसूत्रों में अभी दो अर्धगुणसूत्र हैं।"], [4, "Meiosis I has shared the DNA between two cells.", "अर्धसूत्री विभाजन I ने DNA को दो कोशिकाओं में बाँट दिया है।"]], [[2, "Meiosis I has already separated the homologous chromosomes into two cells.", "अर्धसूत्री विभाजन I समजात गुणसूत्रों को दो कोशिकाओं में अलग कर चुका है।"]]],
  m2: ["metaphase II", "मध्यावस्था II", 1, 2, [[1, "Sister chromatids are still joined at metaphase II.", "मध्यावस्था II में सहोदर अर्धगुणसूत्र अभी जुड़े हैं।"], [4, "Meiosis I has already halved the DNA per cell.", "अर्धसूत्री विभाजन I प्रति कोशिका DNA पहले ही आधा कर चुका है।"]], [[2, "Meiosis I has already separated the homologous chromosomes.", "अर्धसूत्री विभाजन I समजात गुणसूत्रों को अलग कर चुका है।"]]],
  a2: ["anaphase II", "पश्चावस्था II", 2, 2, [[1, "The cell has not divided yet in anaphase II.", "पश्चावस्था II में कोशिका अभी विभाजित नहीं हुई है।"], [4, "Meiosis I has already halved the DNA per cell.", "अर्धसूत्री विभाजन I प्रति कोशिका DNA पहले ही आधा कर चुका है।"]], [[1, "In anaphase II the centromeres split, so each chromatid now counts as a chromosome.", "पश्चावस्था II में गुणसूत्रबिंदु विभाजित होते हैं, इसलिए प्रत्येक अर्धगुणसूत्र अब एक गुणसूत्र गिना जाता है।"], [4, "Meiosis I has already halved the number per cell.", "अर्धसूत्री विभाजन I प्रति कोशिका संख्या पहले ही आधी कर चुका है।"]]],
  gamete: ["a gamete formed by meiosis", "अर्धसूत्री विभाजन से बना युग्मक", 1, 1, [[2, "Meiosis has two divisions after one replication.", "एक प्रतिकृति के बाद अर्धसूत्री विभाजन में दो विभाजन होते हैं।"], [4, "That is the DNA of the meiocyte before division.", "यह विभाजन से पहले मियोसाइट का DNA है।"]], [[2, "Meiosis halves the chromosome number: gametes are haploid.", "अर्धसूत्री विभाजन गुणसूत्र संख्या आधी करता है: युग्मक अगुणित होते हैं।"]]],
};
// Hindijski opis celice na stopnji (pri opisih celice brez »की कोशिका«).
const hiCell = (st) => (st[0].startsWith("a ") ? st[1] : `${st[1]} की कोशिका`);
const CELL_DIV_CALC = {
  id: "exi-bio-division-calc",
  topics: [T("cell-cycle-and-cell-division")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const n = r.pick([4, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 23, 24]);
    const v = r.int(0, level === 1 ? 3 : 2);
    if (level === 1 && v === 0) {
      const m = r.int(1, 5);
      const k = r.int(3, 8);
      const ans = m * 2 ** k;
      return task({
        text: L(`${m === 1 ? "A cell" : `${m} cells`} undergo${m === 1 ? "es" : ""} ${k} successive mitotic divisions (all daughter cells keep dividing). How many cells are formed?`, `${m === 1 ? "एक कोशिका" : `${m} कोशिकाएँ`} लगातार ${k} समसूत्री विभाजन करती ${m === 1 ? "है" : "हैं"} (सभी संतति कोशिकाएँ विभाजित होती रहती हैं)। कुल कितनी कोशिकाएँ बनेंगी?`),
        answer: numM(ans, 0, [[2 * k * m, L("Each division doubles the number; use a power of 2, not 2 × k.", "प्रत्येक विभाजन संख्या दुगुनी करता है; 2 × k नहीं, 2 की घात लीजिए।")], [m * 2 ** (k - 1), L("After k divisions there are 2ᵏ cells per starting cell.", "k विभाजनों के बाद प्रति आरंभिक कोशिका 2ᵏ कोशिकाएँ होती हैं।")], [m * (k + 1), L("Divisions multiply, they do not add one cell each time.", "विभाजन गुणा करते हैं, हर बार एक कोशिका नहीं जोड़ते।")]]),
        data: { given: [m > 1 ? `N_0 = ${m}` : null, `k = ${k}`].filter(Boolean), find: ["N"] },
        hint: L("One mitosis turns 1 cell into 2. What happens to the count after each round?", "एक समसूत्री विभाजन 1 कोशिका को 2 बनाता है। हर चक्र के बाद संख्या का क्या होता है?"),
        formula: "N = N_0 \\cdot 2^k",
        solution: L(S(`$N = ${m} \\cdot 2^{${k}}$`, `$N = ${m} \\cdot ${2 ** k} = ${ans}$`), S(`$N = ${m} \\cdot 2^{${k}}$`, `$N = ${m} \\cdot ${2 ** k} = ${ans}$`)),
      });
    }
    if (level === 1 && v === 1) {
      const human = r.int(0, 3) === 0;
      const t = human ? r.int(2, 5) : r.int(3, 8);
      const ans = 2 ** t;
      const time = human ? [`${24 * t} hours`, `${24 * t} घंटे`] : [`${en((90 * t) / 60)} hours`, `${en((90 * t) / 60)} घंटे`];
      const who = human ? ["A human cell in culture divides about once every 24 hours", "संवर्धन में एक मानव कोशिका लगभग हर 24 घंटे में एक बार विभाजित होती है"] : ["A yeast cell divides about once every 90 minutes", "एक यीस्ट कोशिका लगभग हर 90 मिनट में एक बार विभाजित होती है"];
      return task({
        text: L(`${who[0]}. Starting from one cell, how many cells are there after ${time[0]} (all cells keep dividing)?`, `${who[1]}। एक कोशिका से शुरू करके ${time[1]} बाद कितनी कोशिकाएँ होंगी (सभी कोशिकाएँ विभाजित होती रहती हैं)?`),
        answer: numM(ans, 0, [[t, L("That is the number of divisions, not of cells.", "यह विभाजनों की संख्या है, कोशिकाओं की नहीं।")], [2 * t, L("Each cycle doubles the number of cells.", "प्रत्येक चक्र कोशिकाओं की संख्या दुगुनी करता है।")]]),
        data: { given: [human ? "T = 24\\ \\mathrm{h}" : "T = 90\\ \\mathrm{min}", human ? `t = ${24 * t}\\ \\mathrm{h}` : `t = ${en((90 * t) / 60)}\\ \\mathrm{h}`], find: ["N"] },
        hint: L("First find how many complete cell cycles fit into the time.", "पहले ज्ञात कीजिए कि इस समय में कितने पूरे कोशिका चक्र होंगे।"),
        formula: "N = 2^{t/T}",
        solution: L(S(human ? null : `$t = ${en((90 * t) / 60)}\\ \\mathrm{h} = ${90 * t}\\ \\mathrm{min}$`, `Cycles: $k = ${human ? `${24 * t}/24` : `${90 * t}/90`} = ${t}$`, `$N = 2^{${t}} = ${ans}$`), S(human ? null : `$t = ${en((90 * t) / 60)}\\ \\mathrm{h} = ${90 * t}\\ \\mathrm{min}$`, `चक्र: $k = ${human ? `${24 * t}/24` : `${90 * t}/90`} = ${t}$`, `$N = 2^{${t}} = ${ans}$`)),
      });
    }
    if (level === 1) {
      const chromatids = v === 3;
      return task({
        text: L(chromatids ? `A cell has 2n = ${2 * n} chromosomes. How many chromatids are present in the cell at metaphase of mitosis?` : `A meiocyte has 2n = ${2 * n} chromosomes. How many bivalents are formed during zygotene?`, chromatids ? `एक कोशिका में 2n = ${2 * n} गुणसूत्र हैं। समसूत्री विभाजन की मध्यावस्था में कोशिका में कितने अर्धगुणसूत्र होंगे?` : `एक मियोसाइट में 2n = ${2 * n} गुणसूत्र हैं। युग्मपट्ट में कितने युगली (बाइवेलेंट) बनेंगे?`),
        answer: chromatids ? numM(4 * n, 0, [[2 * n, L("Each metaphase chromosome consists of two sister chromatids.", "मध्यावस्था का प्रत्येक गुणसूत्र दो सहोदर अर्धगुणसूत्रों से बना है।")], [n, L("Count all chromosomes, then two chromatids per chromosome.", "सभी गुणसूत्र गिनिए, फिर प्रति गुणसूत्र दो अर्धगुणसूत्र।")]]) : numM(n, 0, [[2 * n, L("A bivalent is a pair of homologous chromosomes.", "युगली समजात गुणसूत्रों का एक जोड़ा है।")], [4 * n, L("That counts chromatids, not bivalents.", "यह अर्धगुणसूत्रों की गिनती है, युगलियों की नहीं।")]]),
        data: { given: [`2n = ${2 * n}`], find: [chromatids ? `N_{${tx(L("chromatids", "अर्धगुणसूत्र"))}}` : `N_{${tx(L("bivalents", "युगली"))}}`] },
        hint: L(chromatids ? "DNA has replicated before mitosis. How many chromatids does each chromosome carry?" : "Homologous chromosomes pair up. How many pairs can 2n chromosomes form?", chromatids ? "समसूत्री विभाजन से पहले DNA प्रतिकृति हो चुकी है। प्रत्येक गुणसूत्र में कितने अर्धगुणसूत्र हैं?" : "समजात गुणसूत्र जोड़े बनाते हैं। 2n गुणसूत्र कितने जोड़े बना सकते हैं?"),
        formula: chromatids ? "N = 2 \\cdot 2n" : "N = \\dfrac{2n}{2}",
        solution: L(chromatids ? S(`Each of the ${2 * n} chromosomes has 2 chromatids.`, `$N = 2 \\cdot ${2 * n} = ${4 * n}$`) : S("One bivalent = one pair of homologues.", `$N = ${2 * n}/2 = ${n}$`), chromatids ? S(`${2 * n} गुणसूत्रों में से प्रत्येक में 2 अर्धगुणसूत्र हैं।`, `$N = 2 \\cdot ${2 * n} = ${4 * n}$`) : S("एक युगली = समजातों का एक जोड़ा।", `$N = ${2 * n}/2 = ${n}$`)),
      });
    }
    if ((level === 2 && v < 2) || (level === 3 && v < 2)) {
      const dna = v === 0;
      const keys = level === 2 ? (dna ? ["g2", "meta", "daughter", "m1", "gamete"] : ["meta", "m1", "m2", "gamete", "daughter"]) : dna ? ["ana", "a1", "inter", "m2", "a2"] : ["ana", "a1", "a2", "inter"];
      const st = DSTAGE[r.pick(keys)];
      const C = r.pick([1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
      const fromGamete = level === 3 && dna && r.int(0, 1) === 1;
      if (dna) {
        const ans = (st[3] * C) / 2;
        return task({
          text: fromGamete
            ? L(`A gamete of an animal contains ${en(C / 2)} pg of DNA. How much DNA (in pg) is present in ${st[0].startsWith("a ") ? st[0] : `a cell at ${st[0]}`} of the same animal?`, `एक जंतु के युग्मक में ${en(C / 2)} pg DNA है। उसी जंतु की ${hiCell(st)} में कितना DNA (pg में) होगा?`)
            : L(`A diploid cell (2n = ${2 * n}) in G₁ phase contains ${en(C)} pg of DNA. How much DNA (in pg) is present in ${st[0].startsWith("a ") ? st[0] : `a cell at ${st[0]}`}?`, `एक द्विगुणित कोशिका (2n = ${2 * n}) में G₁ प्रावस्था पर ${en(C)} pg DNA है। ${hiCell(st)} में कितना DNA (pg में) होगा?`),
          answer: numM(ans, 2, st[4].map(([f, e, h]) => [(f * C) / 2, L(e, h)])),
          data: { given: [fromGamete ? `1C = ${en(C / 2)}\\ \\mathrm{pg}` : `2C = ${en(C)}\\ \\mathrm{pg}`], find: [`m_{\\mathrm{DNA}}`] },
          hint: L("Write the DNA content in C units: G₁ = 2C, after S = 4C; halve it at each division of the cell.", "DNA मात्रा C इकाइयों में लिखिए: G₁ = 2C, S के बाद = 4C; कोशिका के हर विभाजन पर आधी कीजिए।"),
          formula: "m = x \\cdot C",
          solution: L(
            S(fromGamete ? `Gamete = 1C, so $C = ${en(C / 2)}$ pg.` : `G₁ = 2C, so $C = ${en(C)}/2 = ${en(C / 2)}$ pg.`, `${cap(st[0])}: ${st[3]}C`, `$m = ${st[3]} \\cdot ${en(C / 2)} = ${en(ans)}$ pg`),
            S(fromGamete ? `युग्मक = 1C, अतः $C = ${en(C / 2)}$ pg।` : `G₁ = 2C, अतः $C = ${en(C)}/2 = ${en(C / 2)}$ pg।`, `${st[1]}: ${st[3]}C`, `$m = ${st[3]} \\cdot ${en(C / 2)} = ${en(ans)}$ pg`),
          ),
        });
      }
      const ans = st[2] * n;
      return task({
        text: L(`An organism has 2n = ${2 * n}. How many chromosomes are present in ${st[0].startsWith("a ") ? st[0] : `one cell at ${st[0]}`} (count each centromere as one chromosome)?`, `एक जीव में 2n = ${2 * n} है। ${hiCell(st)} में कितने गुणसूत्र होंगे (प्रत्येक गुणसूत्रबिंदु को एक गुणसूत्र गिनिए)?`),
        answer: numM(ans, 0, st[5].map(([f, e, h]) => [f * n, L(e, h)])),
        data: { given: [`2n = ${2 * n}`], find: [`N_{${tx(L("chromosomes", "गुणसूत्र"))}}`] },
        hint: L("Count centromeres: they double only when sister chromatids separate, and halve when the cell divides.", "गुणसूत्रबिंदु गिनिए: सहोदर अर्धगुणसूत्र अलग होने पर ये दुगुने होते हैं और कोशिका विभाजन पर आधे।"),
        formula: "N = x \\cdot n",
        solution: L(S(`$n = ${2 * n}/2 = ${n}$`, `${cap(st[0])}: ${st[2] === 1 ? "n" : `${st[2]}n`}`, `$N = ${st[2]} \\cdot ${n} = ${ans}$`), S(`$n = ${2 * n}/2 = ${n}$`, `${st[1]}: ${st[2] === 1 ? "n" : `${st[2]}n`}`, `$N = ${st[2]} \\cdot ${n} = ${ans}$`)),
      });
    }
    if (level === 2) {
      const male = r.int(0, 1) === 1;
      const k = male ? 4 * r.int(5, 250) : r.int(5, 400);
      const ans = male ? k / 4 : k;
      return task({
        text: L(`How many ${male ? "primary spermatocytes" : "primary oocytes"} must complete meiosis to give ${k} ${male ? "sperms" : "ova"}?`, `${k} ${male ? "शुक्राणु" : "अंडाणु"} बनाने के लिए कितने ${male ? "प्राथमिक शुक्राणुकोशिकाओं" : "प्राथमिक अंडकों"} को अर्धसूत्री विभाजन पूरा करना होगा?`),
        answer: numM(ans, 0, male ? [[k, L("One primary spermatocyte gives four sperms.", "एक प्राथमिक शुक्राणुकोशिका से चार शुक्राणु बनते हैं।")], [k / 2, L("Meiosis gives four products, not two.", "अर्धसूत्री विभाजन से चार उत्पाद बनते हैं, दो नहीं।")]] : [[k / 4, L("Only one of the four products of oogenesis is an ovum; the others are polar bodies.", "अंडजनन के चार उत्पादों में से केवल एक अंडाणु होता है; बाकी ध्रुवीय पिंड हैं।")], [k / 2, L("Polar bodies are not ova.", "ध्रुवीय पिंड अंडाणु नहीं हैं।")]]),
        data: { given: [`N = ${k}`], find: [`N_{${tx(L(male ? "spermatocytes" : "oocytes", male ? "शुक्राणुकोशिकाएँ" : "अंडक"))}}`] },
        hint: L("How many functional gametes does one meiocyte give in this sex?", "इस लिंग में एक मियोसाइट से कितने कार्यशील युग्मक बनते हैं?"),
        formula: male ? "N_1 = N/4" : "N_1 = N",
        solution: L(S(male ? "1 primary spermatocyte → 4 sperms." : "1 primary oocyte → 1 ovum + polar bodies.", male ? `$N_1 = ${k}/4 = ${ans}$` : `$N_1 = ${ans}$`), S(male ? "1 प्राथमिक शुक्राणुकोशिका → 4 शुक्राणु।" : "1 प्राथमिक अंडक → 1 अंडाणु + ध्रुवीय पिंड।", male ? `$N_1 = ${k}/4 = ${ans}$` : `$N_1 = ${ans}$`)),
      });
    }
    const k = r.int(1, 4);
    const ans = 4 * 2 ** k;
    return task({
      text: L(`A meiocyte (2n = ${2 * n}) completes meiosis, and each product then undergoes ${k} mitotic division${k > 1 ? "s" : ""}. How many cells are formed in all?`, `एक मियोसाइट (2n = ${2 * n}) अर्धसूत्री विभाजन पूरा करता है, फिर प्रत्येक उत्पाद ${k} समसूत्री विभाजन करता है। कुल कितनी कोशिकाएँ बनेंगी?`),
      answer: numM(ans, 0, [[2 ** k, L("Meiosis first gives four cells; each of them then divides.", "अर्धसूत्री विभाजन पहले चार कोशिकाएँ देता है; फिर प्रत्येक विभाजित होती है।")], [2 * 2 ** k, L("Meiosis has two divisions and gives four cells, not two.", "अर्धसूत्री विभाजन में दो विभाजन होते हैं और चार कोशिकाएँ बनती हैं, दो नहीं।")], [4 + 2 * k, L("Mitosis doubles the number each time; it does not add.", "समसूत्री विभाजन हर बार संख्या दुगुनी करता है; जोड़ता नहीं।")]]),
      data: { given: [`2n = ${2 * n}`, `k = ${k}`], find: ["N"] },
      hint: L("Count the products of meiosis first, then double for every mitotic round.", "पहले अर्धसूत्री विभाजन के उत्पाद गिनिए, फिर हर समसूत्री चक्र के लिए दुगुना कीजिए।"),
      formula: "N = 4 \\cdot 2^k",
      solution: L(S("Meiosis: 1 → 4 haploid cells.", `$N = 4 \\cdot 2^{${k}} = ${ans}$`, `(The chromosome number ${2 * n} does not matter here.)`), S("अर्धसूत्री विभाजन: 1 → 4 अगुणित कोशिकाएँ।", `$N = 4 \\cdot 2^{${k}} = ${ans}$`, `(यहाँ गुणसूत्र संख्या ${2 * n} की आवश्यकता नहीं है।)`)),
    });
  },
};

// ---------- Rastlinska fiziologija: Calvinov cikel, ATP, RQ (NCERT 11, pogl. 11–12) ----------
const PLANT_CALC = {
  id: "exi-bio-plant-calc",
  topics: [T("plant-physiology")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    if (level === 1 && v === 0) {
      const n = r.int(2, 15);
      const atp = r.int(0, 1) === 1;
      const ans = atp ? 3 * n : 2 * n;
      return task({
        text: L(`How many ${atp ? "ATP" : "NADPH"} molecules does the Calvin cycle use to fix ${n} molecules of CO₂?`, `केल्विन चक्र में CO₂ के ${n} अणु स्थिर करने के लिए ${atp ? "ATP" : "NADPH"} के कितने अणु लगते हैं?`),
        answer: numM(ans, 0, atp ? [[2 * n, L("2 per CO₂ is the NADPH requirement.", "प्रति CO₂ 2 की आवश्यकता NADPH की है।")], [n, L("More than one ATP is needed per CO₂.", "प्रति CO₂ एक से अधिक ATP लगते हैं।")]] : [[3 * n, L("3 per CO₂ is the ATP requirement.", "प्रति CO₂ 3 की आवश्यकता ATP की है।")], [n, L("More than one NADPH is needed per CO₂.", "प्रति CO₂ एक से अधिक NADPH लगते हैं।")]]),
        data: { given: [`n(\\mathrm{CO_2}) = ${n}`], find: [`n(\\mathrm{${atp ? "ATP" : "NADPH"}})`] },
        hint: L("Recall what the Calvin cycle needs for every single CO₂ that enters.", "याद कीजिए कि प्रत्येक CO₂ के प्रवेश पर केल्विन चक्र को क्या चाहिए।"),
        formula: atp ? "n_{\\mathrm{ATP}} = 3\\,n_{\\mathrm{CO_2}}" : "n_{\\mathrm{NADPH}} = 2\\,n_{\\mathrm{CO_2}}",
        solution: L(S("Per CO₂: 3 ATP and 2 NADPH.", `$${atp ? 3 : 2} \\cdot ${n} = ${ans}$`), S("प्रति CO₂: 3 ATP और 2 NADPH।", `$${atp ? 3 : 2} \\cdot ${n} = ${ans}$`)),
      });
    }
    if (level === 1 && v === 1) {
      const k = r.int(1, 12);
      return task({
        text: L(`How many turns of the Calvin cycle are needed to make ${k === 1 ? "one molecule" : `${k} molecules`} of glucose?`, `ग्लूकोस के ${k === 1 ? "एक अणु" : `${k} अणुओं`} के लिए केल्विन चक्र के कितने आवर्तन आवश्यक हैं?`),
        answer: numM(6 * k, 0, [[k, L("One turn fixes only one CO₂ molecule.", "एक आवर्तन में केवल एक CO₂ अणु स्थिर होता है।")], [3 * k, L("Glucose has six carbons, each coming from one CO₂.", "ग्लूकोस में छह कार्बन हैं, प्रत्येक एक CO₂ से आता है।")], [12 * k, L("Count CO₂ molecules, not NADPH.", "CO₂ अणु गिनिए, NADPH नहीं।")]]),
        data: { given: k > 1 ? [`n(\\mathrm{C_6H_{12}O_6}) = ${k}`] : [], find: [`N_{${tx(L("turns", "आवर्तन"))}}`] },
        hint: L("How many carbon atoms are in glucose, and how many CO₂ does one turn fix?", "ग्लूकोस में कितने कार्बन परमाणु हैं, और एक आवर्तन में कितनी CO₂ स्थिर होती है?"),
        formula: "N = 6k",
        solution: L(S("One turn fixes one CO₂; one glucose needs 6 CO₂.", `$N = 6 \\cdot ${k} = ${6 * k}$`), S("एक आवर्तन एक CO₂ स्थिर करता है; एक ग्लूकोस को 6 CO₂ चाहिए।", `$N = 6 \\cdot ${k} = ${6 * k}$`)),
      });
    }
    if (level === 1 && v === 2) {
      const o2 = r.int(10, 60);
      const rq = r.pick([1, 0.7, 0.9]);
      const co2 = Math.round(o2 * rq * 10) / 10;
      const ans = co2 / o2;
      return task({
        text: L(`Germinating seeds in a respirometer used ${o2} mL of O₂ and released ${en(co2)} mL of CO₂. What is the respiratory quotient?${roundToL(2, lang)}`, `श्वसनमापी में अंकुरित होते बीजों ने ${o2} mL O₂ ली और ${en(co2)} mL CO₂ छोड़ी। श्वसन गुणांक क्या है?${roundToL(2, lang)}`),
        answer: numM(ans, 2, [[o2 / co2, L("RQ = CO₂ released ÷ O₂ used, not the reverse.", "RQ = निकली CO₂ ÷ ली गई O₂, उल्टा नहीं।")]]),
        data: { given: [`V(\\mathrm{O_2}) = ${o2}\\ \\mathrm{mL}`, `V(\\mathrm{CO_2}) = ${en(co2)}\\ \\mathrm{mL}`], find: ["RQ"] },
        hint: L("RQ compares the volume of CO₂ evolved with the volume of O₂ consumed.", "RQ निकली CO₂ के आयतन की तुलना ली गई O₂ के आयतन से करता है।"),
        formula: "RQ = \\dfrac{V(\\mathrm{CO_2})}{V(\\mathrm{O_2})}",
        solution: L(S(`$RQ = ${en(co2)}/${o2}$`, `$RQ \\approx ${en(ans, 2)}$`, rq === 1 ? "RQ = 1 suggests a carbohydrate substrate." : rq === 0.7 ? "RQ ≈ 0.7 suggests fat is being respired." : "RQ ≈ 0.9 suggests protein is being respired."), S(`$RQ = ${en(co2)}/${o2}$`, `$RQ \\approx ${en(ans, 2)}$`, rq === 1 ? "RQ = 1 कार्बोहाइड्रेट क्रियाधार का संकेत है।" : rq === 0.7 ? "RQ ≈ 0.7 वसा के श्वसन का संकेत है।" : "RQ ≈ 0.9 प्रोटीन के श्वसन का संकेत है।")),
      });
    }
    if (level === 1) {
      const k = r.int(1, 15);
      return task({
        text: L(`What is the net gain of ATP when ${k === 1 ? "one glucose molecule is" : `${k} glucose molecules are`} broken down to pyruvic acid by glycolysis?`, `ग्लाइकोलिसिस द्वारा ${k === 1 ? "एक ग्लूकोस अणु" : `${k} ग्लूकोस अणुओं`} के पाइरुविक अम्ल में टूटने पर ATP का शुद्ध लाभ कितना है?`),
        answer: numM(2 * k, 0, [[4 * k, L("Four ATP are formed, but two were used up at the start.", "चार ATP बनते हैं, पर आरंभ में दो खर्च हो चुके हैं।")], [38 * k, L("That is the yield of complete aerobic respiration.", "यह पूर्ण वायवीय श्वसन की उपज है।")]]),
        data: { given: k > 1 ? [`n = ${k}`] : [], find: [`n(\\mathrm{ATP})_{${tx(L("net", "शुद्ध"))}}`] },
        hint: L("Count ATP made by substrate-level phosphorylation and subtract ATP used in the first steps.", "क्रियाधार-स्तरीय फॉस्फोरिलेशन से बने ATP गिनिए और पहले चरणों में खर्च ATP घटाइए।"),
        formula: "n_{\\mathrm{ATP}} = (4 - 2)\\,k",
        solution: L(S("Per glucose: 4 ATP formed − 2 ATP used = 2 ATP.", `$2 \\cdot ${k} = ${2 * k}$`), S("प्रति ग्लूकोस: 4 ATP बने − 2 ATP खर्च = 2 ATP।", `$2 \\cdot ${k} = ${2 * k}$`)),
      });
    }
    if (level === 2 && v === 0) {
      const k = r.int(1, 10);
      const atp = r.int(0, 1) === 1;
      const ans = atp ? 18 * k : 12 * k;
      return task({
        text: L(`How many ${atp ? "ATP" : "NADPH"} molecules are used in the Calvin cycle to synthesise ${k === 1 ? "one molecule" : `${k} molecules`} of glucose?`, `ग्लूकोस के ${k === 1 ? "एक अणु" : `${k} अणुओं`} के संश्लेषण में केल्विन चक्र ${atp ? "ATP" : "NADPH"} के कितने अणु उपयोग करता है?`),
        answer: numM(ans, 0, atp ? [[3 * k, L("3 ATP is per CO₂; one glucose needs six CO₂.", "3 ATP प्रति CO₂ है; एक ग्लूकोस को छह CO₂ चाहिए।")], [12 * k, L("12 per glucose is the NADPH requirement.", "प्रति ग्लूकोस 12 की आवश्यकता NADPH की है।")]] : [[2 * k, L("2 NADPH is per CO₂; one glucose needs six CO₂.", "2 NADPH प्रति CO₂ है; एक ग्लूकोस को छह CO₂ चाहिए।")], [18 * k, L("18 per glucose is the ATP requirement.", "प्रति ग्लूकोस 18 की आवश्यकता ATP की है।")]]),
        data: { given: [k > 1 ? `n(\\mathrm{C_6H_{12}O_6}) = ${k}` : null, "3\\,\\mathrm{ATP} + 2\\,\\mathrm{NADPH}\\ /\\ \\mathrm{CO_2}"].filter(Boolean), find: [`n(\\mathrm{${atp ? "ATP" : "NADPH"}})`] },
        hint: L("First find how many CO₂ must be fixed, then use the per-CO₂ requirement.", "पहले ज्ञात कीजिए कि कितनी CO₂ स्थिर करनी है, फिर प्रति CO₂ की आवश्यकता लगाइए।"),
        formula: atp ? "n_{\\mathrm{ATP}} = 3 \\cdot 6k" : "n_{\\mathrm{NADPH}} = 2 \\cdot 6k",
        solution: L(S(`CO₂ to fix: $6 \\cdot ${k} = ${6 * k}$`, `$${atp ? 3 : 2} \\cdot ${6 * k} = ${ans}$`), S(`स्थिर करनी CO₂: $6 \\cdot ${k} = ${6 * k}$`, `$${atp ? 3 : 2} \\cdot ${6 * k} = ${ans}$`)),
      });
    }
    if (level === 2 && v === 1) {
      const k = r.int(2, 20);
      return task({
        text: L(`Using the NCERT balance sheet, how many ATP molecules are gained by complete aerobic respiration of ${k} glucose molecules?`, `NCERT के तुलन-पत्र के अनुसार ${k} ग्लूकोस अणुओं के पूर्ण वायवीय श्वसन से ATP के कितने अणु प्राप्त होते हैं?`),
        answer: numM(38 * k, 0, [[36 * k, L("NCERT's balance sheet gives a net gain of 38 ATP per glucose.", "NCERT का तुलन-पत्र प्रति ग्लूकोस 38 ATP का शुद्ध लाभ देता है।")], [2 * k, L("That is the yield of fermentation or glycolysis alone.", "यह केवल किण्वन या ग्लाइकोलिसिस की उपज है।")], [30 * k, L("Do not forget the ATP from FADH₂ and from substrate-level steps.", "FADH₂ और क्रियाधार-स्तरीय चरणों के ATP न भूलिए।")]]),
        data: { given: [`n = ${k}`], find: [`n(\\mathrm{ATP})`] },
        hint: L("Recall the net ATP per glucose in NCERT's balance sheet.", "NCERT के तुलन-पत्र में प्रति ग्लूकोस शुद्ध ATP याद कीजिए।"),
        formula: "n_{\\mathrm{ATP}} = 38k",
        solution: L(S("Per glucose: 2 (glycolysis) + 2 (Krebs) + 10 NADH × 3 + 2 FADH₂ × 2 = 38 ATP.", `$38 \\cdot ${k} = ${38 * k}$`), S("प्रति ग्लूकोस: 2 (ग्लाइकोलिसिस) + 2 (क्रेब्स) + 10 NADH × 3 + 2 FADH₂ × 2 = 38 ATP।", `$38 \\cdot ${k} = ${38 * k}$`)),
      });
    }
    if (level === 2 && v === 2) {
      const sub = r.int(0, 2);
      const [eq, o2, co2, nameEn, nameHi] = [
        ["2(\\mathrm{C_{51}H_{98}O_6}) + 145\\,\\mathrm{O_2} \\rightarrow 102\\,\\mathrm{CO_2} + 98\\,\\mathrm{H_2O}", 145, 102, "tripalmitin (a fat)", "ट्राइपामिटिन (एक वसा)"],
        ["\\mathrm{C_6H_{12}O_6} + 6\\,\\mathrm{O_2} \\rightarrow 6\\,\\mathrm{CO_2} + 6\\,\\mathrm{H_2O}", 6, 6, "glucose", "ग्लूकोस"],
        [null, 0, 0, "a respiratory substrate", "एक श्वसन क्रियाधार"],
      ][sub];
      const a = sub === 2 ? r.int(20, 60) : o2;
      const b = sub === 2 ? Math.round(a * r.pick([0.7, 0.8, 0.9])) : co2;
      const ans = b / a;
      const tex = eq || `\\mathrm{S} + ${a}\\,\\mathrm{O_2} \\rightarrow ${b}\\,\\mathrm{CO_2} + \\mathrm{H_2O}`;
      return task({
        text: L(`Complete oxidation of ${nameEn}: $${tex}$. What is its respiratory quotient?${roundToL(2, lang)}`, `${nameHi} का पूर्ण ऑक्सीकरण: $${tex}$। इसका श्वसन गुणांक क्या है?${roundToL(2, lang)}`),
        answer: numM(ans, 2, [[a / b, L("RQ = CO₂ evolved ÷ O₂ consumed, not the reverse.", "RQ = निकली CO₂ ÷ ली गई O₂, उल्टा नहीं।")], [(b + (sub === 0 ? 98 : sub === 1 ? 6 : 0)) / a, L("Water is not part of the respiratory quotient.", "श्वसन गुणांक में जल शामिल नहीं होता।")]]),
        data: { given: [`n(\\mathrm{O_2}) = ${a}`, `n(\\mathrm{CO_2}) = ${b}`], find: ["RQ"] },
        hint: L("Read the moles of CO₂ formed and of O₂ used from the balanced equation.", "संतुलित समीकरण से बनी CO₂ और ली गई O₂ के मोल पढ़िए।"),
        formula: "RQ = \\dfrac{n(\\mathrm{CO_2})}{n(\\mathrm{O_2})}",
        solution: L(S(`$RQ = ${b}/${a}$`, `$RQ \\approx ${en(ans, 2)}$`), S(`$RQ = ${b}/${a}$`, `$RQ \\approx ${en(ans, 2)}$`)),
      });
    }
    if (level === 2) {
      const k = r.int(2, 16);
      const ask = r.int(0, 1);
      return task({
        text: L(`${k} molecules of pyruvic acid enter mitochondria and are completely oxidised through the link reaction and the Krebs cycle. How many ${ask ? "FADH₂" : "NADH"} molecules are formed?`, `पाइरुविक अम्ल के ${k} अणु सूत्रकणिका में जाकर संयोजक अभिक्रिया और क्रेब्स चक्र से पूर्णतः ऑक्सीकृत होते हैं। ${ask ? "FADH₂" : "NADH"} के कितने अणु बनेंगे?`),
        answer: ask ? numM(k, 0, [[2 * k, L("Each turn of the Krebs cycle gives one FADH₂, and one pyruvate gives one turn.", "क्रेब्स चक्र के प्रत्येक आवर्तन से एक FADH₂ बनता है और एक पाइरुवेट से एक आवर्तन होता है।")], [4 * k, L("That is the NADH count.", "यह NADH की संख्या है।")]]) : numM(4 * k, 0, [[3 * k, L("Add the NADH formed when pyruvate becomes acetyl CoA.", "पाइरुवेट के ऐसीटिल CoA बनने पर बना NADH भी जोड़िए।")], [5 * k, L("The link reaction gives one NADH, the Krebs cycle three.", "संयोजक अभिक्रिया एक NADH देती है, क्रेब्स चक्र तीन।")], [k, L("That is the FADH₂ count.", "यह FADH₂ की संख्या है।")]]),
        data: { given: [`n(${tx(L("pyruvate", "पाइरुवेट"))}) = ${k}`], find: [`n(\\mathrm{${ask ? "FADH_2" : "NADH"}})`] },
        hint: L("Per pyruvate: list the products of the link reaction and of one Krebs turn.", "प्रति पाइरुवेट: संयोजक अभिक्रिया और क्रेब्स के एक आवर्तन के उत्पाद लिखिए।"),
        formula: ask ? "n = 1 \\cdot k" : "n = (1 + 3)\\,k",
        solution: L(S("Per pyruvate: link reaction 1 NADH; Krebs cycle 3 NADH + 1 FADH₂ + 1 ATP.", `$n = ${ask ? 1 : 4} \\cdot ${k} = ${ask ? k : 4 * k}$`), S("प्रति पाइरुवेट: संयोजक अभिक्रिया 1 NADH; क्रेब्स चक्र 3 NADH + 1 FADH₂ + 1 ATP।", `$n = ${ask ? 1 : 4} \\cdot ${k} = ${ask ? k : 4 * k}$`)),
      });
    }
    if (v === 0) {
      const k = r.int(1, 12);
      return task({
        text: L(`Yeast ferments glucose to ethanol. How many glucose molecules must it ferment to gain as much ATP as the complete aerobic respiration of ${k === 1 ? "one glucose molecule" : `${k} glucose molecules`} (NCERT balance sheet)?`, `यीस्ट ग्लूकोस का एथेनॉल में किण्वन करता है। ${k === 1 ? "एक ग्लूकोस अणु" : `${k} ग्लूकोस अणुओं`} के पूर्ण वायवीय श्वसन जितना ATP पाने के लिए उसे कितने ग्लूकोस अणुओं का किण्वन करना होगा (NCERT तुलन-पत्र)?`),
        answer: numM(19 * k, 0, [[38 * k, L("That is the ATP count; divide by the ATP gained per fermented glucose.", "यह ATP की संख्या है; प्रति किण्वित ग्लूकोस ATP से भाग दीजिए।")], [18 * k, L("NCERT uses 38 ATP per glucose for aerobic respiration.", "NCERT वायवीय श्वसन के लिए प्रति ग्लूकोस 38 ATP लेता है।")], [9.5 * k, L("Fermentation gives a net 2 ATP per glucose, not 4.", "किण्वन से प्रति ग्लूकोस शुद्ध 2 ATP मिलते हैं, 4 नहीं।")]]),
        data: { given: [k > 1 ? `n = ${k}` : null, `${tx(L("aerobic", "वायवीय"))}: 38\\ \\mathrm{ATP}`, `${tx(L("fermentation", "किण्वन"))}: 2\\ \\mathrm{ATP}`].filter(Boolean), find: [`n_{${tx(L("fermented", "किण्वित"))}}`] },
        hint: L("Find the ATP from aerobic respiration first, then divide by the ATP from one fermented glucose.", "पहले वायवीय श्वसन से ATP ज्ञात कीजिए, फिर एक किण्वित ग्लूकोस के ATP से भाग दीजिए।"),
        formula: "n = \\dfrac{38k}{2}",
        solution: L(S(`Aerobic: $38 \\cdot ${k} = ${38 * k}$ ATP`, `Fermentation: 2 ATP per glucose`, `$n = ${38 * k}/2 = ${19 * k}$`), S(`वायवीय: $38 \\cdot ${k} = ${38 * k}$ ATP`, "किण्वन: प्रति ग्लूकोस 2 ATP", `$n = ${38 * k}/2 = ${19 * k}$`)),
      });
    }
    if (v === 1) {
      const g = r.int(2, 15);
      const atp = r.int(0, 1) === 1;
      const given = atp ? 18 * g : 12 * g;
      return task({
        text: L(`A chloroplast used ${given} ${atp ? "ATP" : "NADPH"} molecules in the Calvin cycle. How many glucose molecules can it make with them (assume all are used for glucose)?`, `एक हरितलवक ने केल्विन चक्र में ${given} ${atp ? "ATP" : "NADPH"} अणु उपयोग किए। इनसे कितने ग्लूकोस अणु बन सकते हैं (मान लीजिए सभी ग्लूकोस के लिए उपयोग हुए)?`),
        answer: numM(g, 0, [[given / (atp ? 3 : 2), L("That is the number of CO₂ fixed; six CO₂ make one glucose.", "यह स्थिर CO₂ की संख्या है; छह CO₂ से एक ग्लूकोस बनता है।")], [given / 6, L(`Use the ${atp ? "ATP" : "NADPH"} needed per glucose, not just the six carbons.`, `प्रति ग्लूकोस आवश्यक ${atp ? "ATP" : "NADPH"} लीजिए, केवल छह कार्बन नहीं।`)], [given / (atp ? 12 : 18), L(`You used the ${atp ? "NADPH" : "ATP"} requirement instead.`, `आपने ${atp ? "NADPH" : "ATP"} की आवश्यकता लगा दी।`)]]),
        data: { given: [`n(\\mathrm{${atp ? "ATP" : "NADPH"}}) = ${given}`], find: [`n(\\mathrm{C_6H_{12}O_6})`] },
        hint: L(`How many ${atp ? "ATP" : "NADPH"} does one glucose need (six CO₂)?`, `एक ग्लूकोस (छह CO₂) को कितने ${atp ? "ATP" : "NADPH"} चाहिए?`),
        formula: atp ? "n = \\dfrac{n_{\\mathrm{ATP}}}{18}" : "n = \\dfrac{n_{\\mathrm{NADPH}}}{12}",
        solution: L(S(`Per glucose: $6 \\cdot ${atp ? 3 : 2} = ${atp ? 18 : 12}$ ${atp ? "ATP" : "NADPH"}`, `$n = ${given}/${atp ? 18 : 12} = ${g}$`), S(`प्रति ग्लूकोस: $6 \\cdot ${atp ? 3 : 2} = ${atp ? 18 : 12}$ ${atp ? "ATP" : "NADPH"}`, `$n = ${given}/${atp ? 18 : 12} = ${g}$`)),
      });
    }
    const k = r.int(1, 8);
    const ask = r.int(0, 2); // 0: ATP iz vseh NADH, 1: ATP iz vseh FADH2, 2: ATP iz NADH + FADH2 Krebsovega cikla
    const ans = [30, 4, 22][ask] * k;
    const what = [["all the NADH formed (glycolysis, link reaction and Krebs cycle)", "सभी बने NADH (ग्लाइकोलिसिस, संयोजक अभिक्रिया और क्रेब्स चक्र)"], ["all the FADH₂ formed", "सभी बने FADH₂"], ["the NADH and FADH₂ formed in the Krebs cycle only", "केवल क्रेब्स चक्र में बने NADH और FADH₂"]][ask];
    const mist = [
      [[18 * k, L("Include the 2 NADH of glycolysis and the 2 of the link reaction per glucose.", "प्रति ग्लूकोस ग्लाइकोलिसिस के 2 और संयोजक अभिक्रिया के 2 NADH भी शामिल कीजिए।")], [20 * k, L("Each NADH gives 3 ATP, not 2.", "प्रत्येक NADH से 3 ATP बनते हैं, 2 नहीं।")], [38 * k, L("That is the whole balance sheet, not just NADH.", "यह पूरा तुलन-पत्र है, केवल NADH नहीं।")]],
      [[6 * k, L("Each FADH₂ gives 2 ATP, not 3.", "प्रत्येक FADH₂ से 2 ATP बनते हैं, 3 नहीं।")], [2 * k, L("Two FADH₂ form per glucose (one per Krebs turn).", "प्रति ग्लूकोस दो FADH₂ बनते हैं (प्रत्येक क्रेब्स आवर्तन में एक)।")]],
      [[24 * k, L("The ATP made directly in the Krebs cycle is not from NADH or FADH₂.", "क्रेब्स चक्र में सीधे बना ATP, NADH या FADH₂ से नहीं है।")], [30 * k, L("Leave out NADH from glycolysis and the link reaction.", "ग्लाइकोलिसिस और संयोजक अभिक्रिया के NADH छोड़ दीजिए।")], [16 * k, L("Each NADH gives 3 ATP, not 2.", "प्रत्येक NADH से 3 ATP बनते हैं, 2 नहीं।")]],
    ][ask];
    return task({
      text: L(`In aerobic respiration of ${k === 1 ? "one glucose molecule" : `${k} glucose molecules`}, how many ATP are made in the electron transport system from ${what[0]}? (NADH → 3 ATP, FADH₂ → 2 ATP)`, `${k === 1 ? "एक ग्लूकोस अणु" : `${k} ग्लूकोस अणुओं`} के वायवीय श्वसन में ${what[1]} से इलेक्ट्रॉन परिवहन तंत्र में कितने ATP बनते हैं? (NADH → 3 ATP, FADH₂ → 2 ATP)`),
      answer: numM(ans, 0, mist),
      data: { given: [k > 1 ? `n = ${k}` : null, "\\mathrm{NADH} \\to 3\\,\\mathrm{ATP}", "\\mathrm{FADH_2} \\to 2\\,\\mathrm{ATP}"].filter(Boolean), find: [`n(\\mathrm{ATP})`] },
      hint: L("Per glucose count NADH: glycolysis 2, link reaction 2, Krebs 6; FADH₂: Krebs 2.", "प्रति ग्लूकोस NADH गिनिए: ग्लाइकोलिसिस 2, संयोजक अभिक्रिया 2, क्रेब्स 6; FADH₂: क्रेब्स 2।"),
      formula: ["n = 10k \\cdot 3", "n = 2k \\cdot 2", "n = (6 \\cdot 3 + 2 \\cdot 2)\\,k"][ask],
      solution: L(
        S(["NADH per glucose: 2 + 2 + 6 = 10 → 30 ATP.", "FADH₂ per glucose: 2 → 4 ATP.", "Krebs per glucose: 6 NADH → 18 ATP, 2 FADH₂ → 4 ATP; total 22."][ask], `$${ans / k} \\cdot ${k} = ${ans}$`),
        S(["प्रति ग्लूकोस NADH: 2 + 2 + 6 = 10 → 30 ATP।", "प्रति ग्लूकोस FADH₂: 2 → 4 ATP।", "प्रति ग्लूकोस क्रेब्स: 6 NADH → 18 ATP, 2 FADH₂ → 4 ATP; कुल 22।"][ask], `$${ans / k} \\cdot ${k} = ${ans}$`),
      ),
    });
  },
};

// ---------- Fiziologija človeka: srce, pljučni volumni, ledvice, Na/K črpalka, okostje ----------
const BONES = [
  // [vprašanje en, hi, odgovor, napake [[vrednost, en, hi]], razlaga en, hi]
  ["How many bones are there in total in both fore limbs (arms) of an adult human?", "एक वयस्क मनुष्य के दोनों अग्रपादों (हाथों) में कुल कितनी अस्थियाँ हैं?", 60, [[30, "Each limb alone has 30 bones; there are two fore limbs.", "प्रत्येक पाद में ही 30 अस्थियाँ हैं; अग्रपाद दो हैं।"], [54, "Count the humerus, radius and ulna too, not only the hand.", "केवल हाथ नहीं, ह्यूमरस, रेडियस और अल्ना भी गिनिए।"]], "Each limb: 30 bones (humerus, radius, ulna, 8 carpals, 5 metacarpals, 14 phalanges); $2 \\cdot 30 = 60$.", "प्रत्येक पाद: 30 अस्थियाँ (ह्यूमरस, रेडियस, अल्ना, 8 कार्पल, 5 मेटाकार्पल, 14 फैलेंजेस); $2 \\cdot 30 = 60$।"],
  ["How many pairs of human ribs are NOT attached directly to the sternum?", "मनुष्य की पसलियों के कितने जोड़े उरोस्थि (स्टर्नम) से सीधे नहीं जुड़े हैं?", 5, [[3, "The two pairs of floating ribs are not attached to the sternum at all; add them.", "प्लावी पसलियों के दो जोड़े उरोस्थि से बिल्कुल नहीं जुड़े; उन्हें भी जोड़िए।"], [2, "The 8th–10th pairs join the sternum only through the 7th rib's cartilage.", "8वें–10वें जोड़े केवल 7वीं पसली की उपास्थि के माध्यम से उरोस्थि से जुड़ते हैं।"]], "True ribs: pairs 1–7. Pairs 8–10 (vertebrochondral) and 11–12 (floating) are not attached directly: $3 + 2 = 5$.", "वास्तविक पसलियाँ: जोड़े 1–7। जोड़े 8–10 (कशेरुक-उपास्थि) और 11–12 (प्लावी) सीधे नहीं जुड़े: $3 + 2 = 5$।"],
  ["How many bones are there in one human hand (carpals, metacarpals and phalanges together)?", "मनुष्य के एक हाथ (कार्पल, मेटाकार्पल और फैलेंजेस मिलाकर) में कितनी अस्थियाँ हैं?", 27, [[30, "30 is the whole limb, including humerus, radius and ulna.", "30 पूरे पाद की संख्या है, जिसमें ह्यूमरस, रेडियस और अल्ना भी हैं।"], [26, "The wrist has 8 carpals; the ankle has 7 tarsals.", "कलाई में 8 कार्पल हैं; टखने में 7 टार्सल।"]], "$8 + 5 + 14 = 27$", "$8 + 5 + 14 = 27$"],
  ["How many bones are there in one human foot (tarsals, metatarsals and phalanges together)?", "मनुष्य के एक पैर (टार्सल, मेटाटार्सल और फैलेंजेस मिलाकर) में कितनी अस्थियाँ हैं?", 26, [[27, "The ankle has 7 tarsals, one fewer than the 8 carpals.", "टखने में 7 टार्सल हैं, कार्पलों (8) से एक कम।"], [30, "30 is the whole hind limb, including femur, tibia, fibula and patella.", "30 पूरे पश्चपाद की संख्या है, जिसमें फीमर, टिबिया, फिबुला और पटेला भी हैं।"]], "$7 + 5 + 14 = 26$", "$7 + 5 + 14 = 26$"],
  ["How many vertebrae make up the adult human vertebral column (fused sacrum and coccyx counted as one each)?", "वयस्क मनुष्य के कशेरुक दंड में कितनी कशेरुकाएँ हैं (संयुक्त त्रिकास्थि और अनुत्रिकास्थि एक-एक गिनी जाएँ)?", 26, [[33, "Count the fused sacrum and fused coccyx as one vertebra each.", "संयुक्त त्रिकास्थि और अनुत्रिकास्थि को एक-एक कशेरुका गिनिए।"], [24, "Add the sacral and coccygeal vertebrae.", "त्रिक और अनुत्रिक कशेरुकाएँ भी जोड़िए।"]], "$7 + 12 + 5 + 1 + 1 = 26$", "$7 + 12 + 5 + 1 + 1 = 26$"],
  ["How many bones make up the human skull (cranial and facial bones)?", "मानव खोपड़ी (कपालीय और आननी अस्थियाँ) कितनी अस्थियों से बनी है?", 22, [[8, "8 is only the cranium; add the facial bones.", "8 केवल कपाल की हैं; आननी अस्थियाँ भी जोड़िए।"], [14, "14 is only the face; add the cranial bones.", "14 केवल आनन की हैं; कपालीय अस्थियाँ भी जोड़िए।"]], "Cranial 8 + facial 14: $8 + 14 = 22$.", "कपालीय 8 + आननी 14: $8 + 14 = 22$।"],
];
const HUMAN_CALC = {
  id: "exi-bio-human-calc",
  topics: [T("human-physiology")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, level === 2 ? 4 : 3);
    const SV = r.int(60, 80);
    const HR = r.int(62, 90);
    const TV = r.pick([450, 500, 550]);
    const IRV = r.pick([2500, 2600, 2800, 3000]);
    const ERV = r.pick([1000, 1050, 1100]);
    const RV = r.pick([1100, 1150, 1200]);
    const GFR = r.int(115, 130);
    const nm = r.pick(NAMES);
    if (level === 1 && v === 0) {
      const co = (SV * HR) / 1000;
      return task({
        text: L(`During rest, ${nm[0]}'s heart pumps ${SV} mL of blood per beat at ${HR} beats per minute. What is the cardiac output in L/min?${roundToL(2, lang)}`, `विश्राम के समय ${nm[1]} का हृदय प्रति धड़कन ${SV} mL रक्त पंप करता है और प्रति मिनट ${HR} बार धड़कता है। हृद् निर्गम L/min में कितना है?${roundToL(2, lang)}`),
        answer: numM(co, 2, [[SV * HR, L("Convert mL to litres.", "mL को लीटर में बदलिए।")], [(SV * HR) / 100, L("1 L = 1000 mL.", "1 L = 1000 mL।")]]),
        data: { given: [`V_s = ${SV}\\ \\mathrm{mL}`, `f = ${HR}\\ \\mathrm{min^{-1}}`], find: ["CO"] },
        hint: L("Cardiac output is the volume pumped by each ventricle in one minute.", "हृद् निर्गम प्रत्येक निलय द्वारा एक मिनट में पंप किया गया आयतन है।"),
        formula: "CO = V_s \\cdot f",
        solution: L(S(`$CO = ${SV} \\cdot ${HR} = ${SV * HR}$ mL/min`, `$CO = ${en(co, 2)}$ L/min`), S(`$CO = ${SV} \\cdot ${HR} = ${SV * HR}$ mL/min`, `$CO = ${en(co, 2)}$ L/min`)),
      });
    }
    if (level === 1 && v === 1) {
      const vc = IRV + TV + ERV;
      return task({
        text: L(`For ${nm[0]}: tidal volume ${TV} mL, IRV ${IRV} mL, ERV ${ERV} mL and residual volume ${RV} mL. What is the vital capacity in mL?`, `${nm[1]} के लिए: ज्वारीय आयतन ${TV} mL, IRV ${IRV} mL, ERV ${ERV} mL और अवशिष्ट आयतन ${RV} mL है। जैव क्षमता mL में कितनी है?`),
        answer: numM(vc, 0, [[vc + RV, L("Residual volume cannot be breathed out, so it is not part of vital capacity.", "अवशिष्ट आयतन बाहर नहीं निकाला जा सकता, इसलिए यह जैव क्षमता में नहीं आता।")], [IRV + TV, L("That is the inspiratory capacity; vital capacity also includes ERV.", "यह अंतःश्वसन क्षमता है; जैव क्षमता में ERV भी आता है।")], [TV + ERV, L("That is the expiratory capacity; vital capacity also includes IRV.", "यह निःश्वसन क्षमता है; जैव क्षमता में IRV भी आता है।")]]),
        data: { given: [`TV = ${TV}\\ \\mathrm{mL}`, `IRV = ${IRV}\\ \\mathrm{mL}`, `ERV = ${ERV}\\ \\mathrm{mL}`, `RV = ${RV}\\ \\mathrm{mL}`], find: ["VC"] },
        hint: L("Vital capacity is the most air a person can breathe out after a forced inspiration.", "जैव क्षमता बलपूर्वक अंतःश्वसन के बाद बाहर निकाली जा सकने वाली अधिकतम वायु है।"),
        formula: "VC = ERV + TV + IRV",
        solution: L(S(`$VC = ${ERV} + ${TV} + ${IRV}$`, `$VC = ${vc}$ mL (RV is not included)`), S(`$VC = ${ERV} + ${TV} + ${IRV}$`, `$VC = ${vc}$ mL (RV शामिल नहीं)`)),
      });
    }
    if (level === 1 && v === 2) {
      const f = r.int(12, 16);
      return task({
        text: L(`${nm[0]} breathes ${f} times per minute with a tidal volume of ${TV} mL. How many mL of air does ${nm[0]} breathe in per minute?`, `${nm[1]} प्रति मिनट ${f} बार साँस लेता/लेती है और ज्वारीय आयतन ${TV} mL है। प्रति मिनट कितने mL वायु अंदर जाती है?`),
        answer: numM(TV * f, 0, [[TV, L("Multiply by the number of breaths per minute.", "प्रति मिनट श्वासों की संख्या से गुणा कीजिए।")], [TV * f * 60, L("The breathing rate is already per minute.", "श्वसन दर पहले से प्रति मिनट है।")], [TV + f, L("Volume per breath times breaths, not plus.", "प्रति श्वास आयतन गुणा श्वासें, जोड़ नहीं।")]]),
        data: { given: [`TV = ${TV}\\ \\mathrm{mL}`, `f = ${f}\\ \\mathrm{min^{-1}}`], find: ["V_{\\min}"] },
        hint: L("Each breath moves one tidal volume of air.", "प्रत्येक श्वास एक ज्वारीय आयतन वायु ले जाती है।"),
        formula: "V_{\\min} = TV \\cdot f",
        solution: L(S(`$V = ${TV} \\cdot ${f}$`, `$V = ${TV * f}$ mL/min`), S(`$V = ${TV} \\cdot ${f}$`, `$V = ${TV * f}$ mL/min`)),
      });
    }
    if (level === 1) {
      const day = (GFR * 1440) / 1000;
      return task({
        text: L(`The glomerular filtration rate of a healthy person is ${GFR} mL/min. How many litres of filtrate are formed per day?${roundToL(1, lang)}`, `एक स्वस्थ व्यक्ति की गुच्छीय निस्यंदन दर (GFR) ${GFR} mL/min है। प्रतिदिन कितने लीटर निस्यंद बनता है?${roundToL(1, lang)}`),
        answer: numM(day, 1, [[(GFR * 60) / 1000, L("That is per hour; a day has 24 hours.", "यह प्रति घंटा है; एक दिन में 24 घंटे होते हैं।")], [GFR * 1440, L("Convert mL to litres.", "mL को लीटर में बदलिए।")]]),
        data: { given: [`GFR = ${GFR}\\ \\mathrm{mL/min}`], find: [`V_{${tx(L("day", "दिन"))}}`] },
        hint: L("Convert minutes to a day: 60 min × 24 h.", "मिनट को दिन में बदलिए: 60 मिनट × 24 घंटे।"),
        formula: "V = GFR \\cdot 1440",
        solution: L(S(`$V = ${GFR} \\cdot 1440 = ${GFR * 1440}$ mL`, `$V \\approx ${en(day, 1)}$ L/day`), S(`$V = ${GFR} \\cdot 1440 = ${GFR * 1440}$ mL`, `$V \\approx ${en(day, 1)}$ L/दिन`)),
      });
    }
    if (level === 2 && v === 0) {
      const co = (SV * HR) / 1000;
      return task({
        text: L(`${nm[0]}'s cardiac output is ${en(co)} L/min at a heart rate of ${HR} beats/min. What is the stroke volume in mL?`, `${nm[1]} का हृद् निर्गम ${en(co)} L/min है और हृदय दर ${HR} धड़कन/मिनट है। प्रवाह आयतन mL में कितना है?`),
        answer: numM(SV, 0, [[co / HR, L("Convert litres to mL before dividing.", "भाग देने से पहले लीटर को mL में बदलिए।")], [HR / co, L("Stroke volume = cardiac output ÷ heart rate.", "प्रवाह आयतन = हृद् निर्गम ÷ हृदय दर।")]]),
        data: { given: [`CO = ${en(co)}\\ \\mathrm{L/min}`, `f = ${HR}\\ \\mathrm{min^{-1}}`], find: ["V_s"] },
        hint: L("Rearrange CO = stroke volume × heart rate.", "CO = प्रवाह आयतन × हृदय दर को पुनर्व्यवस्थित कीजिए।"),
        formula: "V_s = \\dfrac{CO}{f}",
        solution: L(S(`$CO = ${en(co)}$ L/min $= ${SV * HR}$ mL/min`, `$V_s = ${SV * HR}/${HR} = ${SV}$ mL`), S(`$CO = ${en(co)}$ L/min $= ${SV * HR}$ mL/min`, `$V_s = ${SV * HR}/${HR} = ${SV}$ mL`)),
      });
    }
    if (level === 2 && v === 1) {
      const which = r.int(0, 3);
      const cap = [
        ["functional residual capacity (FRC)", "क्रियात्मक अवशिष्ट क्षमता (FRC)", ERV + RV, "FRC = ERV + RV", [[RV, "Air left after a normal expiration also includes ERV.", "सामान्य निःश्वसन के बाद बची वायु में ERV भी है।"], [TV + ERV, "That is expiratory capacity.", "यह निःश्वसन क्षमता है।"]]],
        ["inspiratory capacity (IC)", "अंतःश्वसन क्षमता (IC)", TV + IRV, "IC = TV + IRV", [[IRV, "Add the tidal volume to IRV.", "IRV में ज्वारीय आयतन जोड़िए।"], [TV + IRV + ERV, "That is vital capacity.", "यह जैव क्षमता है।"]]],
        ["expiratory capacity (EC)", "निःश्वसन क्षमता (EC)", TV + ERV, "EC = TV + ERV", [[ERV, "Add the tidal volume to ERV.", "ERV में ज्वारीय आयतन जोड़िए।"], [ERV + RV, "That is functional residual capacity.", "यह क्रियात्मक अवशिष्ट क्षमता है।"]]],
        ["total lung capacity (TLC)", "कुल फुफ्फुस क्षमता (TLC)", RV + ERV + TV + IRV, "TLC = RV + ERV + TV + IRV", [[ERV + TV + IRV, "Add the residual volume as well.", "अवशिष्ट आयतन भी जोड़िए।"], [RV + ERV + IRV, "Include the tidal volume.", "ज्वारीय आयतन भी शामिल कीजिए।"]]],
      ][which];
      return task({
        text: L(`TV = ${TV} mL, IRV = ${IRV} mL, ERV = ${ERV} mL, RV = ${RV} mL. What is the ${cap[0]} in mL?`, `TV = ${TV} mL, IRV = ${IRV} mL, ERV = ${ERV} mL, RV = ${RV} mL है। ${cap[1]} mL में कितनी है?`),
        answer: numM(cap[2], 0, cap[4].map(([x, e, h]) => [x, L(e, h)])),
        data: { given: [`TV = ${TV}\\ \\mathrm{mL}`, `IRV = ${IRV}\\ \\mathrm{mL}`, `ERV = ${ERV}\\ \\mathrm{mL}`, `RV = ${RV}\\ \\mathrm{mL}`], find: [cap[3].split(" ")[0]] },
        hint: L("Write which volumes make up this capacity before adding.", "जोड़ने से पहले लिखिए कि यह क्षमता किन आयतनों से बनती है।"),
        formula: cap[3],
        solution: L(S(`$${cap[3]}$`, `$= ${cap[2]}$ mL`), S(`$${cap[3]}$`, `$= ${cap[2]}$ mL`)),
      });
    }
    if (level === 2 && v === 2) {
      const t = r.pick([0.5, 0.6, 0.625, 0.75, 1, 1.2, 0.4]);
      const hr = 60 / t;
      return task({
        text: L(`During an activity, one cardiac cycle of ${nm[0]} lasts ${en(t)} s. What is the heart rate in beats per minute?`, `किसी गतिविधि के दौरान ${nm[1]} का एक हृद् चक्र ${en(t)} s चलता है। हृदय दर प्रति मिनट धड़कनों में कितनी है?`),
        answer: numM(hr, 0, [[60 * t, L("Heart rate = 60 s ÷ duration of one cycle.", "हृदय दर = 60 s ÷ एक चक्र की अवधि।")], [1 / t, L("That is beats per second; convert to per minute.", "यह प्रति सेकंड धड़कनें हैं; प्रति मिनट में बदलिए।")]]),
        data: { given: [`T = ${en(t)}\\ \\mathrm{s}`], find: ["f"] },
        hint: L("How many cycles of this length fit into 60 seconds?", "इतनी लंबाई के कितने चक्र 60 सेकंड में आते हैं?"),
        formula: "f = \\dfrac{60\\ \\mathrm{s}}{T}",
        solution: L(S(`$f = 60/${en(t)}$`, `$f = ${en(hr)}$ beats/min`), S(`$f = 60/${en(t)}$`, `$f = ${en(hr)}$ धड़कन/मिनट`)),
      });
    }
    if (level === 2 && v === 3) {
      const F = (GFR * 1440) / 1000;
      const U = r.pick([1, 1.2, 1.4, 1.5, 1.6, 1.8]);
      const p = (1 - U / F) * 100;
      return task({
        text: L(`GFR is ${GFR} mL/min and ${en(U)} L of urine is passed per day. What percentage of the filtrate is reabsorbed?${roundToL(1, lang)}`, `GFR ${GFR} mL/min है और प्रतिदिन ${en(U)} L मूत्र निकलता है। निस्यंद का कितना प्रतिशत पुनरवशोषित होता है?${roundToL(1, lang)}`),
        answer: numM(p, 1, [[(U / F) * 100, L("That is the percentage excreted; subtract it from 100.", "यह उत्सर्जित प्रतिशत है; इसे 100 में से घटाइए।")], [(1 - U / GFR) * 100, L("Convert GFR to litres per day first.", "पहले GFR को लीटर प्रति दिन में बदलिए।")]]),
        data: { given: [`GFR = ${GFR}\\ \\mathrm{mL/min}`, `V_u = ${en(U)}\\ \\mathrm{L/day}`], find: ["p"] },
        hint: L("Find the filtrate per day first; whatever does not leave as urine was reabsorbed.", "पहले प्रतिदिन का निस्यंद ज्ञात कीजिए; जो मूत्र में नहीं निकला, वह पुनरवशोषित हुआ।"),
        formula: "p = \\left(1 - \\dfrac{V_u}{V_f}\\right) \\cdot 100\\ \\%",
        solution: L(S(`$V_f = ${GFR} \\cdot 1440 / 1000 = ${en(F)}$ L/day`, `$p = (1 - ${en(U)}/${en(F)}) \\cdot 100$`, `$p \\approx ${en(p, 1)}\\ \\%$`), S(`$V_f = ${GFR} \\cdot 1440 / 1000 = ${en(F)}$ L/दिन`, `$p = (1 - ${en(U)}/${en(F)}) \\cdot 100$`, `$p \\approx ${en(p, 1)}\\ \\%$`)),
      });
    }
    if (level === 2) {
      const k = r.int(5, 60) * 10;
      const ask = r.int(0, 2);
      const ans = [3 * k, 2 * k, k][ask];
      const what = [["Na⁺ ions are moved out", "Na⁺ आयन बाहर भेजे जाते हैं"], ["K⁺ ions are moved in", "K⁺ आयन अंदर लाए जाते हैं"], ["net positive charges are moved out of the cell", "शुद्ध धनावेश कोशिका से बाहर जाते हैं"]][ask];
      return task({
        text: L(`The sodium–potassium pump of an axon completes ${k} cycles. How many ${what[0]}?`, `एक तंत्रिकाक्ष का सोडियम-पोटैशियम पंप ${k} चक्र पूरे करता है। कितने ${what[1]}?`),
        answer: numM(ans, 0, [[[2 * k, 3 * k, 5 * k][ask], L(["The pump sends out 3 Na⁺, not 2, per cycle.", "The pump brings in 2 K⁺, not 3, per cycle.", "Net charge = charges out − charges in."][ask], ["पंप प्रति चक्र 3 Na⁺ बाहर भेजता है, 2 नहीं।", "पंप प्रति चक्र 2 K⁺ अंदर लाता है, 3 नहीं।", "शुद्ध आवेश = बाहर गए आवेश − अंदर आए आवेश।"][ask])], [k, L("Each cycle moves more than one ion.", "प्रत्येक चक्र एक से अधिक आयन ले जाता है।")]]),
        data: { given: [`k = ${k}`, "3\\,\\mathrm{Na^+}\\ \\text{out},\\ 2\\,\\mathrm{K^+}\\ \\text{in}"], find: ["N"] },
        hint: L("Per cycle the pump moves 3 Na⁺ outward and 2 K⁺ inward.", "प्रति चक्र पंप 3 Na⁺ बाहर और 2 K⁺ अंदर ले जाता है।"),
        formula: ["N = 3k", "N = 2k", "N = (3 - 2)\\,k"][ask],
        solution: L(S("Per cycle: 3 Na⁺ out, 2 K⁺ in.", `$N = ${["3", "2", "(3 - 2)"][ask]} \\cdot ${k} = ${ans}$`), S("प्रति चक्र: 3 Na⁺ बाहर, 2 K⁺ अंदर।", `$N = ${["3", "2", "(3 - 2)"][ask]} \\cdot ${k} = ${ans}$`)),
      });
    }
    if (v === 0) {
      const co = SV * HR;
      const o2 = (co * 5) / 100;
      return task({
        text: L(`${nm[0]}'s stroke volume is ${SV} mL and heart rate ${HR} beats/min. If every 100 mL of oxygenated blood delivers about 5 mL of O₂ to the tissues, how many mL of O₂ reach the tissues per minute?${roundToL(0, lang)}`, `${nm[1]} का प्रवाह आयतन ${SV} mL और हृदय दर ${HR} धड़कन/मिनट है। यदि प्रत्येक 100 mL ऑक्सीजनित रक्त ऊतकों को लगभग 5 mL O₂ देता है, तो प्रति मिनट कितने mL O₂ ऊतकों तक पहुँचती है?${roundToL(0, lang)}`),
        answer: numM(o2, 0, [[co * 5, L("The 5 mL is per 100 mL of blood, not per mL.", "5 mL प्रति 100 mL रक्त है, प्रति mL नहीं।")], [(SV * 5) / 100, L("Use the blood pumped per minute, not per beat.", "प्रति धड़कन नहीं, प्रति मिनट पंप हुआ रक्त लीजिए।")], [(co / 1000) * 5, L("Keep the cardiac output in mL, matching ‘per 100 mL’.", "हृद् निर्गम को mL में रखिए, ‘प्रति 100 mL’ के अनुरूप।")]]),
        data: { given: [`V_s = ${SV}\\ \\mathrm{mL}`, `f = ${HR}\\ \\mathrm{min^{-1}}`, `5\\ \\mathrm{mL\\ O_2}\\ /\\ 100\\ \\mathrm{mL}`], find: ["V(\\mathrm{O_2})"] },
        hint: L("Find the blood pumped per minute first.", "पहले प्रति मिनट पंप हुआ रक्त ज्ञात कीजिए।"),
        formula: "V(\\mathrm{O_2}) = V_s f \\cdot \\dfrac{5}{100}",
        solution: L(S(`$CO = ${SV} \\cdot ${HR} = ${co}$ mL/min`, `$V(\\mathrm{O_2}) = ${co} \\cdot 5/100 \\approx ${en(o2, 0)}$ mL/min`), S(`$CO = ${SV} \\cdot ${HR} = ${co}$ mL/min`, `$V(\\mathrm{O_2}) = ${co} \\cdot 5/100 \\approx ${en(o2, 0)}$ mL/min`)),
      });
    }
    if (v === 1) {
      const vc = ERV + TV + IRV;
      const tlc = vc + RV;
      const fromCap = r.int(0, 1) === 1;
      return task({
        text: fromCap
          ? L(`${nm[0]}'s total lung capacity is ${tlc} mL, inspiratory capacity ${TV + IRV} mL and expiratory reserve volume ${ERV} mL. What is the residual volume in mL?`, `${nm[1]} की कुल फुफ्फुस क्षमता ${tlc} mL, अंतःश्वसन क्षमता ${TV + IRV} mL और निःश्वसन आरक्षित आयतन ${ERV} mL है। अवशिष्ट आयतन mL में कितना है?`)
          : L(`${nm[0]}'s total lung capacity is ${tlc} mL and vital capacity ${vc} mL, with a tidal volume of ${TV} mL. What is the residual volume in mL?`, `${nm[1]} की कुल फुफ्फुस क्षमता ${tlc} mL और जैव क्षमता ${vc} mL है; ज्वारीय आयतन ${TV} mL है। अवशिष्ट आयतन mL में कितना है?`),
        answer: numM(RV, 0, fromCap ? [[tlc - TV - IRV, L("Also subtract ERV: TLC = RV + ERV + IC.", "ERV भी घटाइए: TLC = RV + ERV + IC।")], [tlc - ERV, L("Also subtract the inspiratory capacity.", "अंतःश्वसन क्षमता भी घटाइए।")]] : [[RV - TV, L("Tidal volume is already part of the vital capacity.", "ज्वारीय आयतन पहले से जैव क्षमता में शामिल है।")], [tlc - TV, L("Subtract the whole vital capacity, not just TV.", "केवल TV नहीं, पूरी जैव क्षमता घटाइए।")]]),
        data: { given: fromCap ? [`TLC = ${tlc}\\ \\mathrm{mL}`, `IC = ${TV + IRV}\\ \\mathrm{mL}`, `ERV = ${ERV}\\ \\mathrm{mL}`] : [`TLC = ${tlc}\\ \\mathrm{mL}`, `VC = ${vc}\\ \\mathrm{mL}`, `TV = ${TV}\\ \\mathrm{mL}`], find: ["RV"] },
        hint: L("Total lung capacity is everything; find what is left after the air that can be breathed out.", "कुल फुफ्फुस क्षमता में सब कुछ है; बाहर निकल सकने वाली वायु घटाकर बचा भाग ज्ञात कीजिए।"),
        formula: fromCap ? "RV = TLC - IC - ERV" : "RV = TLC - VC",
        solution: L(S(fromCap ? `$RV = ${tlc} - ${TV + IRV} - ${ERV}$` : `$RV = ${tlc} - ${vc}$`, `$RV = ${RV}$ mL`), S(fromCap ? `$RV = ${tlc} - ${TV + IRV} - ${ERV}$` : `$RV = ${tlc} - ${vc}$`, `$RV = ${RV}$ mL`)),
      });
    }
    if (v === 2) {
      const p = r.pick([98.8, 99, 99.1, 99.2, 99.3]);
      const F = (GFR * 1440) / 1000;
      const U = (F * (100 - p)) / 100;
      return task({
        text: L(`GFR is ${GFR} mL/min and ${en(p)}% of the filtrate is reabsorbed. How many litres of urine are formed per day?${roundToL(2, lang)}`, `GFR ${GFR} mL/min है और निस्यंद का ${en(p)}% पुनरवशोषित होता है। प्रतिदिन कितने लीटर मूत्र बनता है?${roundToL(2, lang)}`),
        answer: numM(U, 2, [[(F * p) / 100, L("That is the reabsorbed volume, not the urine.", "यह पुनरवशोषित आयतन है, मूत्र नहीं।")], [(GFR * (100 - p)) / 100 / 1000 * 60, L("Convert the filtration rate to a full day (1440 min).", "निस्यंदन दर को पूरे दिन (1440 मिनट) में बदलिए।")]]),
        data: { given: [`GFR = ${GFR}\\ \\mathrm{mL/min}`, `p = ${en(p)}\\ \\%`], find: ["V_u"] },
        hint: L("Daily filtrate first; urine is the part that is not reabsorbed.", "पहले दैनिक निस्यंद; मूत्र वह भाग है जो पुनरवशोषित नहीं होता।"),
        formula: "V_u = GFR \\cdot 1440 \\cdot \\dfrac{100 - p}{100}",
        solution: L(S(`$V_f = ${GFR} \\cdot 1440/1000 = ${en(F)}$ L/day`, `$V_u = ${en(F)} \\cdot ${en(100 - p)}/100$`, `$V_u \\approx ${en(U, 2)}$ L/day`), S(`$V_f = ${GFR} \\cdot 1440/1000 = ${en(F)}$ L/दिन`, `$V_u = ${en(F)} \\cdot ${en(100 - p)}/100$`, `$V_u \\approx ${en(U, 2)}$ L/दिन`)),
      });
    }
    const b = r.pick(BONES);
    return task({
      text: L(b[0], b[1]),
      answer: numM(b[2], 0, b[3].map(([x, e, h]) => [x, L(e, h)])),
      data: { given: [tx(L("human skeleton (NCERT)", "मानव कंकाल (NCERT)"))], find: ["N"] },
      hint: L("Break the region into its named groups of bones and add them.", "क्षेत्र को अस्थियों के नामित समूहों में बाँटकर जोड़िए।"),
      formula: "N = \\sum N_i",
      solution: L(S(b[4], `N = ${b[2]}`), S(b[5], `N = ${b[2]}`)),
    });
  },
};

// ---------- Razmnoževanje: gametogeneza, ploidnost tkiv semena, mejoze za semena, cikel ----------
const HUMAN_CELLS = [
  ["spermatogonium", "शुक्राणुजन (स्पर्मेटोगोनियम)", 2], ["primary spermatocyte", "प्राथमिक शुक्राणुकोशिका", 2], ["secondary spermatocyte", "द्वितीयक शुक्राणुकोशिका", 1], ["spermatid", "शुक्राणुप्रसू", 1], ["sperm", "शुक्राणु", 1],
  ["oogonium", "अंडजन (ऊगोनियम)", 2], ["primary oocyte", "प्राथमिक अंडक", 2], ["secondary oocyte", "द्वितीयक अंडक", 1], ["first polar body", "प्रथम ध्रुवीय पिंड", 1], ["zygote", "युग्मनज", 2],
];
const SEED_CELLS = [
  ["egg cell", "अंड कोशिका", 1, "f"], ["synergid", "सहायक कोशिका", 1, "f"], ["antipodal cell", "प्रतिमुखी कोशिका", 1, "f"], ["male gamete", "नर युग्मक", 1, "m"], ["functional megaspore", "क्रियाशील गुरुबीजाणु", 1, "m"],
  ["nucellus cell", "बीजांडकाय कोशिका", 2, "f"], ["integument cell", "अध्यावरण कोशिका", 2, "f"], ["megaspore mother cell", "गुरुबीजाणु मातृ कोशिका", 2, "f"], ["zygote", "युग्मनज", 2, "m"], ["embryo cell", "भ्रूण कोशिका", 2, "f"],
  ["primary endosperm nucleus", "प्राथमिक भ्रूणपोष केंद्रक", 3, "m"], ["endosperm cell", "भ्रूणपोष कोशिका", 3, "f"],
];
const PLOIDY_WHY = {
  1: ["It is haploid (n): a product of meiosis or of a haploid gametophyte.", "यह अगुणित (n) है: अर्धसूत्री विभाजन या अगुणित युग्मकोद्भिद का उत्पाद।"],
  2: ["It is diploid (2n): sporophyte tissue or a product of syngamy.", "यह द्विगुणित (2n) है: बीजाणुद्भिद ऊतक या युग्मक संलयन का उत्पाद।"],
  3: ["It is triploid (3n): formed by triple fusion.", "यह त्रिगुणित (3n) है: त्रिसंलयन से बना।"],
};
const REPRO_CALC = {
  id: "exi-bio-repro-calc",
  topics: [T("reproduction")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 2);
    if (level === 1 && v === 0) {
      const types = [
        ["primary spermatocytes", "प्राथमिक शुक्राणुकोशिकाओं", "sperms", "शुक्राणु", 4],
        ["secondary spermatocytes", "द्वितीयक शुक्राणुकोशिकाओं", "sperms", "शुक्राणु", 2],
        ["spermatids", "शुक्राणुप्रसुओं", "sperms", "शुक्राणु", 1],
        ["primary oocytes", "प्राथमिक अंडकों", "ova", "अंडाणु", 1],
      ];
      const [cEn, cHi, gEn, gHi, f] = r.pick(types);
      const n = r.int(5, 120);
      const mist = { 4: [[2 * n, "Two meiotic divisions give four sperms per primary spermatocyte.", "दो अर्धसूत्री विभाजनों से प्रति प्राथमिक शुक्राणुकोशिका चार शुक्राणु बनते हैं।"], [n, "Meiosis multiplies the number of cells.", "अर्धसूत्री विभाजन कोशिकाओं की संख्या बढ़ाता है।"]], 2: [[4 * n, "Secondary spermatocytes have already finished meiosis I.", "द्वितीयक शुक्राणुकोशिकाएँ अर्धसूत्री विभाजन I पूरा कर चुकी हैं।"], [n, "Meiosis II still divides each one into two.", "अर्धसूत्री विभाजन II अभी प्रत्येक को दो में बाँटता है।"]], 1: f === 1 && cEn === "spermatids" ? [[4 * n, "Spermatids do not divide; each turns into one sperm (spermiogenesis).", "शुक्राणुप्रसू विभाजित नहीं होते; प्रत्येक एक शुक्राणु बनता है (शुक्राणुजनन)।"], [2 * n, "No division follows the spermatid stage.", "शुक्राणुप्रसू अवस्था के बाद कोई विभाजन नहीं होता।"]] : [[4 * n, "Only one of the four products of oogenesis is an ovum; the rest are polar bodies.", "अंडजनन के चार उत्पादों में से केवल एक अंडाणु है; बाकी ध्रुवीय पिंड हैं।"], [2 * n, "Polar bodies are not ova.", "ध्रुवीय पिंड अंडाणु नहीं हैं।"]] }[f];
      return task({
        text: L(`How many ${gEn} are formed from ${n} ${cEn}?`, `${n} ${cHi} से कितने ${gHi} बनेंगे?`),
        answer: numM(f * n, 0, mist.map(([x, e, h]) => [x, L(e, h)])),
        data: { given: [`N = ${n}`], find: [`N_{${tx(L(gEn, gHi))}}`] },
        hint: L("Recall how many divisions are still ahead of this cell and how many functional gametes result.", "याद कीजिए कि इस कोशिका के आगे कितने विभाजन बाकी हैं और कितने कार्यशील युग्मक बनते हैं।"),
        formula: `N_g = ${f} N`,
        solution: L(S(`1 ${cEn.replace(/s$/, "")} → ${f} ${f === 1 ? gEn.replace(/s$/, "").replace(/^ova$/, "ovum") : gEn}`, `$N_g = ${f} \\cdot ${n} = ${f * n}$`), S(`1 → ${f} ${gHi}`, `$N_g = ${f} \\cdot ${n} = ${f * n}$`)),
      });
    }
    if (level === 1 && v === 1) {
      const c = r.pick(HUMAN_CELLS);
      const ans = c[2] === 2 ? 46 : 23;
      return task({
        text: L(`Human somatic cells have 2n = 46 chromosomes. How many chromosomes are present in a human ${c[0]}?`, `मानव कायिक कोशिकाओं में 2n = 46 गुणसूत्र होते हैं। एक मानव ${c[1]} में कितने गुणसूत्र होते हैं?`),
        answer: numM(ans, 0, [[ans === 46 ? 23 : 46, L(ans === 46 ? "This cell has not yet completed meiosis I (or is the product of fertilisation), so it is diploid." : "Meiosis I has already halved the chromosome number in this cell.", ans === 46 ? "इस कोशिका ने अभी अर्धसूत्री विभाजन I पूरा नहीं किया है (या यह निषेचन का उत्पाद है), इसलिए यह द्विगुणित है।" : "इस कोशिका में अर्धसूत्री विभाजन I गुणसूत्र संख्या पहले ही आधी कर चुका है।")], [92, L("DNA doubles before meiosis, but the chromosome number does not.", "अर्धसूत्री विभाजन से पहले DNA दुगुना होता है, गुणसूत्र संख्या नहीं।")]]),
        data: { given: [`2n = 46`], find: [`N_{${tx(L("chromosomes", "गुणसूत्र"))}}`] },
        hint: L("Place the cell before or after meiosis I (or after fertilisation).", "तय कीजिए कि कोशिका अर्धसूत्री विभाजन I से पहले है या बाद में (या निषेचन के बाद)।"),
        formula: c[2] === 2 ? "2n = 46" : "n = 23",
        solution: L(S(`Human: 2n = 46, n = 23.`, `${cap(c[0])}: ${c[2] === 2 ? "diploid" : "haploid"} → ${ans}`), S("मनुष्य: 2n = 46, n = 23।", `${c[1]}: ${c[2] === 2 ? "द्विगुणित" : "अगुणित"} → ${ans}`)),
      });
    }
    if (level === 1 || (level === 2 && v === 0)) {
      const n = r.pick([6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 21, 24]);
      const pool = level === 1 ? SEED_CELLS.filter((c) => ["egg cell", "nucellus cell", "endosperm cell", "zygote", "synergid", "embryo cell"].includes(c[0])) : SEED_CELLS;
      const giv = r.pick(pool);
      const ask = r.pick(pool.filter((c) => c[2] !== giv[2]));
      const ans = (ask[2] * n);
      const others = [1, 2, 3].filter((p) => p !== ask[2]).map((p) => [p * n, L(`You treated the ${ask[0]} as ${p === 1 ? "haploid" : p === 2 ? "diploid" : "triploid"}. ${PLOIDY_WHY[ask[2]][0]}`, `आपने ${ask[1]} को ${p === 1 ? "अगुणित" : p === 2 ? "द्विगुणित" : "त्रिगुणित"} माना। ${PLOIDY_WHY[ask[2]][1]}`)]);
      return task({
        text: L(`In a flowering plant, the ${giv[0]} has ${giv[2] * n} chromosomes. How many chromosomes are present in its ${ask[0]}?`, `एक पुष्पी पादप ${giv[3] === "f" ? "की" : "के"} ${giv[1]} में ${giv[2] * n} गुणसूत्र हैं। उसी पादप ${ask[3] === "f" ? "की" : "के"} ${ask[1]} में कितने गुणसूत्र होंगे?`),
        answer: numM(ans, 0, others),
        data: { given: [`N(${tx(L(giv[0], giv[1]))}) = ${giv[2] * n}`], find: [`N(${tx(L(ask[0], ask[1]))})`] },
        hint: L("Find n from the given cell's ploidy first, then use the ploidy of the cell asked for.", "पहले दी गई कोशिका की गुणिता से n ज्ञात कीजिए, फिर पूछी गई कोशिका की गुणिता लगाइए।"),
        formula: "N = x \\cdot n",
        solution: L(S(`${cap(giv[0])} is ${["", "n", "2n", "3n"][giv[2]]}: $n = ${giv[2] * n}/${giv[2]} = ${n}$`, `${cap(ask[0])} is ${["", "n", "2n", "3n"][ask[2]]}: $N = ${ask[2]} \\cdot ${n} = ${ans}$`), S(`${giv[1]} ${["", "n", "2n", "3n"][giv[2]]} है: $n = ${giv[2] * n}/${giv[2]} = ${n}$`, `${ask[1]} ${["", "n", "2n", "3n"][ask[2]]} है: $N = ${ask[2]} \\cdot ${n} = ${ans}$`)),
      });
    }
    if (level === 2 && v === 1) {
      const k = r.int(4, 60);
      const ask = r.int(0, 1);
      const ans = ask ? 8 * k : 4 * k;
      return task({
        text: L(`${k} pollen mother cells (microspore mother cells) undergo meiosis, and every pollen grain matures normally. How many ${ask ? "male gametes" : "pollen grains"} are formed?`, `${k} पराग मातृ कोशिकाएँ (लघुबीजाणु मातृ कोशिकाएँ) अर्धसूत्री विभाजन करती हैं और हर परागकण सामान्य रूप से परिपक्व होता है। कितने ${ask ? "नर युग्मक" : "परागकण"} बनेंगे?`),
        answer: numM(ans, 0, ask ? [[4 * k, L("Each pollen grain gives two male gametes.", "प्रत्येक परागकण से दो नर युग्मक बनते हैं।")], [2 * k, L("Meiosis first gives four pollen grains per mother cell.", "अर्धसूत्री विभाजन पहले प्रति मातृ कोशिका चार परागकण देता है।")]] : [[k, L("Each mother cell gives a tetrad of four microspores.", "प्रत्येक मातृ कोशिका से चार लघुबीजाणुओं का चतुष्क बनता है।")], [8 * k, L("That counts male gametes, not pollen grains.", "यह नर युग्मकों की गिनती है, परागकणों की नहीं।")]]),
        data: { given: [`N_{PMC} = ${k}`], find: [`N_{${tx(L(ask ? "male gametes" : "pollen grains", ask ? "नर युग्मक" : "परागकण"))}}`] },
        hint: L("Meiosis gives a tetrad; the generative cell of each pollen grain later divides once.", "अर्धसूत्री विभाजन से चतुष्क बनता है; प्रत्येक परागकण की जनन कोशिका बाद में एक बार विभाजित होती है।"),
        formula: ask ? "N = 4k \\cdot 2" : "N = 4k",
        solution: L(S(`Pollen grains: $4 \\cdot ${k} = ${4 * k}$`, ask ? `Male gametes: $2 \\cdot ${4 * k} = ${8 * k}$` : null), S(`परागकण: $4 \\cdot ${k} = ${4 * k}$`, ask ? `नर युग्मक: $2 \\cdot ${4 * k} = ${8 * k}$` : null)),
      });
    }
    if (level === 2) {
      const k = r.int(3, 40);
      const ask = r.int(0, 3);
      const what = [["synergids", "सहायक कोशिकाएँ", 2], ["antipodal cells", "प्रतिमुखी कोशिकाएँ", 3], ["nuclei", "केंद्रक", 8], ["cells", "कोशिकाएँ", 7]][ask];
      const kitne = ask === 2 ? "कितने" : "कितनी";
      const mist = [[[k, "The egg apparatus has two synergids beside the egg.", "अंड उपकरण में अंड के साथ दो सहायक कोशिकाएँ होती हैं।"], [3 * k, "Three cells sit at the chalazal end; synergids are at the micropylar end.", "निभागीय सिरे पर तीन कोशिकाएँ होती हैं; सहायक कोशिकाएँ बीजांडद्वारी सिरे पर।"]], [[2 * k, "There are three antipodal cells at the chalazal end.", "निभागीय सिरे पर तीन प्रतिमुखी कोशिकाएँ होती हैं।"]], [[7 * k, "The central cell has two polar nuclei: 8 nuclei but 7 cells.", "केंद्रीय कोशिका में दो ध्रुवीय केंद्रक हैं: 8 केंद्रक पर 7 कोशिकाएँ।"]], [[8 * k, "The two polar nuclei share one central cell: 7 cells, 8 nuclei.", "दोनों ध्रुवीय केंद्रक एक ही केंद्रीय कोशिका में हैं: 7 कोशिकाएँ, 8 केंद्रक।"], [6 * k, "Count the central cell too.", "केंद्रीय कोशिका भी गिनिए।"]]][ask];
      return task({
        text: L(`A flower has ${k} ovules, each with a mature typical (7-celled) embryo sac. How many ${what[0]} are there in all these embryo sacs together?`, `एक पुष्प में ${k} बीजांड हैं, प्रत्येक में परिपक्व सामान्य (7-कोशिकीय) भ्रूणकोष है। इन सब भ्रूणकोषों में कुल ${kitne} ${what[1]} हैं?`),
        answer: numM(what[2] * k, 0, mist.map(([x, e, h]) => [x, L(e, h)])),
        data: { given: [`N_{${tx(L("ovules", "बीजांड"))}} = ${k}`], find: [`N_{${tx(L(what[0], what[1]))}}`] },
        hint: L("Draw one embryo sac: egg apparatus, central cell, antipodals.", "एक भ्रूणकोष बनाइए: अंड उपकरण, केंद्रीय कोशिका, प्रतिमुखी कोशिकाएँ।"),
        formula: `N = ${what[2]}k`,
        solution: L(S("One embryo sac: 3 (egg apparatus) + 1 central cell (2 polar nuclei) + 3 antipodals = 7 cells, 8 nuclei.", `$N = ${what[2]} \\cdot ${k} = ${what[2] * k}$`), S("एक भ्रूणकोष: 3 (अंड उपकरण) + 1 केंद्रीय कोशिका (2 ध्रुवीय केंद्रक) + 3 प्रतिमुखी = 7 कोशिकाएँ, 8 केंद्रक।", `$N = ${what[2]} \\cdot ${k} = ${what[2] * k}$`)),
      });
    }
    if (v === 0) {
      const k = 4 * r.int(5, 100);
      const ask = r.int(0, 2);
      const ans = [k + k / 4, k / 4, k][ask];
      const what = [["seeds", "बीज"], ["pollen grains", "परागकण"], ["embryo sacs", "भ्रूणकोष"]][ask];
      const mist = [
        [[k, "Seeds need pollen too: add the meioses of pollen mother cells.", "बीजों के लिए परागकण भी चाहिए: पराग मातृ कोशिकाओं के अर्धसूत्री विभाजन भी जोड़िए।"], [k / 4 + k / 4, "Only one of the four megaspores survives; each embryo sac needs its own meiosis.", "चार गुरुबीजाणुओं में से केवल एक जीवित रहता है; प्रत्येक भ्रूणकोष को अपना अर्धसूत्री विभाजन चाहिए।"], [2 * k, "One meiosis of a pollen mother cell gives four pollen grains.", "पराग मातृ कोशिका का एक अर्धसूत्री विभाजन चार परागकण देता है।"]],
        [[k, "One pollen mother cell gives four pollen grains.", "एक पराग मातृ कोशिका चार परागकण देती है।"], [k / 2, "Meiosis gives a tetrad of four, not two.", "अर्धसूत्री विभाजन चार का चतुष्क देता है, दो नहीं।"]],
        [[k / 4, "Three of the four megaspores degenerate, so each embryo sac needs one meiosis.", "चार में से तीन गुरुबीजाणु नष्ट हो जाते हैं, इसलिए प्रत्येक भ्रूणकोष को एक अर्धसूत्री विभाजन चाहिए।"], [3 * k, "The three mitoses inside the embryo sac are not meiotic.", "भ्रूणकोष के भीतर के तीन विभाजन समसूत्री हैं, अर्धसूत्री नहीं।"]],
      ][ask];
      return task({
        text: L(`What is the minimum number of meiotic divisions needed to form ${k} ${what[0]} in a flowering plant?`, `एक पुष्पी पादप में ${k} ${what[1]} बनाने के लिए कम से कम कितने अर्धसूत्री विभाजन आवश्यक हैं?`),
        answer: numM(ans, 0, mist.map(([x, e, h]) => [x, L(e, h)])),
        data: { given: [`N = ${k}`], find: [`N_{${tx(L("meioses", "अर्धसूत्री विभाजन"))}}`] },
        hint: L(ask === 0 ? "Each seed needs one embryo sac and one pollen grain; count meioses for each separately." : "How many functional products does one meiosis give on this side?", ask === 0 ? "प्रत्येक बीज को एक भ्रूणकोष और एक परागकण चाहिए; दोनों के अर्धसूत्री विभाजन अलग-अलग गिनिए।" : "इस ओर एक अर्धसूत्री विभाजन से कितने कार्यशील उत्पाद बनते हैं?"),
        formula: ["N = k + \\dfrac{k}{4}", "N = \\dfrac{k}{4}", "N = k"][ask],
        solution: L(
          S(ask !== 1 ? `Female side: 1 meiosis → 1 functional megaspore → 1 embryo sac: ${k}` : null, ask !== 2 ? `Male side: 1 meiosis → 4 pollen grains: $${k}/4 = ${k / 4}$` : null, ask === 0 ? `$N = ${k} + ${k / 4} = ${ans}$` : `$N = ${ans}$`),
          S(ask !== 1 ? `मादा पक्ष: 1 अर्धसूत्री विभाजन → 1 क्रियाशील गुरुबीजाणु → 1 भ्रूणकोष: ${k}` : null, ask !== 2 ? `नर पक्ष: 1 अर्धसूत्री विभाजन → 4 परागकण: $${k}/4 = ${k / 4}$` : null, ask === 0 ? `$N = ${k} + ${k / 4} = ${ans}$` : `$N = ${ans}$`),
        ),
      });
    }
    if (v === 1) {
      const d = r.int(1, 15);
      const nm = r.pick(NAMES);
      const month = r.pick([["March", "मार्च"], ["July", "जुलाई"], ["October", "अक्टूबर"], ["January", "जनवरी"], ["May", "मई"]]);
      return task({
        text: L(`${nm[0]} has a regular 28-day menstrual cycle, and menstruation began on ${d} ${month[0]}. Taking ovulation on day 14 of the cycle, on which date of ${month[0]} is ovulation expected? (Enter the date.)`, `${nm[1]} का आर्तव चक्र नियमित 28 दिन का है और आर्तव स्राव ${d} ${month[1]} को शुरू हुआ। चक्र के 14वें दिन अंडोत्सर्ग मानकर ${month[1]} की किस तारीख को अंडोत्सर्ग अपेक्षित है? (तारीख लिखिए।)`),
        answer: numM(d + 13, 0, [[d + 14, L("Day 1 of the cycle is the first day of menstruation, so day 14 is 13 days later.", "चक्र का पहला दिन आर्तव स्राव का पहला दिन है, इसलिए 14वाँ दिन 13 दिन बाद आता है।")], [d + 5, L("Day 5 is about the end of the menstrual phase, not ovulation.", "5वाँ दिन लगभग आर्तव प्रावस्था का अंत है, अंडोत्सर्ग नहीं।")]]),
        data: { given: [`T = 28\\ \\mathrm{d}`, `${tx(L("day 1", "दिन 1"))} = ${d}`], find: [tx(L("ovulation date", "अंडोत्सर्ग की तारीख"))] },
        hint: L("Count the first day of bleeding as day 1 of the cycle.", "रक्तस्राव के पहले दिन को चक्र का दिन 1 गिनिए।"),
        formula: "D = D_1 + 13",
        solution: L(S(`Day 1 = ${d} ${month[0]}`, `Day 14 = ${d} + 13 = ${d + 13} ${month[0]}`), S(`दिन 1 = ${d} ${month[1]}`, `दिन 14 = ${d} + 13 = ${d + 13} ${month[1]}`)),
      });
    }
    const n = r.pick([6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 21, 24]);
    const seed = r.int(0, 1) === 1;
    const ans = seed ? 7 * n : 8 * n;
    return task({
      text: seed
        ? L(`A plant has 2n = ${2 * n}. Add the chromosomes in one embryo cell, one endosperm cell and one seed-coat cell of its seed. What is the total?`, `एक पादप में 2n = ${2 * n} है। उसके बीज की एक भ्रूण कोशिका, एक भ्रूणपोष कोशिका और एक बीजचोल कोशिका के गुणसूत्र जोड़िए। कुल कितने हैं?`)
        : L(`A plant has 2n = ${2 * n}. How many chromosomes are there in all the nuclei of one mature embryo sac together?`, `एक पादप में 2n = ${2 * n} है। एक परिपक्व भ्रूणकोष के सभी केंद्रकों में कुल कितने गुणसूत्र हैं?`),
      answer: seed ? numM(ans, 0, [[6 * n, L("Endosperm is triploid (3n), not diploid.", "भ्रूणपोष त्रिगुणित (3n) है, द्विगुणित नहीं।")], [8 * n, L("The seed coat develops from the integuments: diploid maternal tissue, not triploid.", "बीजचोल अध्यावरणों से बनता है: द्विगुणित मातृ ऊतक, त्रिगुणित नहीं।")], [5 * n, L("Seed coat cells are diploid, not haploid.", "बीजचोल की कोशिकाएँ द्विगुणित हैं, अगुणित नहीं।")]]) : numM(ans, 0, [[7 * n, L("Count nuclei, not cells: the central cell has two polar nuclei.", "कोशिकाएँ नहीं, केंद्रक गिनिए: केंद्रीय कोशिका में दो ध्रुवीय केंद्रक हैं।")], [16 * n, L("All nuclei of the embryo sac are haploid.", "भ्रूणकोष के सभी केंद्रक अगुणित हैं।")]]),
      data: { given: [`2n = ${2 * n}`], find: ["N"] },
      hint: L(seed ? "Write the ploidy of each tissue first: embryo, endosperm, seed coat." : "How many nuclei does a typical embryo sac have, and what is their ploidy?", seed ? "पहले प्रत्येक ऊतक की गुणिता लिखिए: भ्रूण, भ्रूणपोष, बीजचोल।" : "सामान्य भ्रूणकोष में कितने केंद्रक हैं और उनकी गुणिता क्या है?"),
      formula: seed ? "N = 2n + 3n + 2n" : "N = 8 \\cdot n",
      solution: L(seed ? S(`$n = ${n}$`, `Embryo 2n + endosperm 3n + seed coat 2n = 7n`, `$N = 7 \\cdot ${n} = ${ans}$`) : S(`$n = ${n}$`, "8 haploid nuclei (polar nuclei are still separate before fertilisation).", `$N = 8 \\cdot ${n} = ${ans}$`), seed ? S(`$n = ${n}$`, "भ्रूण 2n + भ्रूणपोष 3n + बीजचोल 2n = 7n", `$N = 7 \\cdot ${n} = ${ans}$`) : S(`$n = ${n}$`, "8 अगुणित केंद्रक (निषेचन से पहले ध्रुवीय केंद्रक अलग होते हैं)।", `$N = 8 \\cdot ${n} = ${ans}$`)),
    });
  },
};

// ---------- Genetika: Mendlova razmerja (NCERT 12, pogl. 4) ----------
// Mendlovih sedem parov lastnosti graha: [črka, pridevnik dominantni/recesivni (en, hi), lastnost (en, hi)]
const PEA = [
  ["T", ["tall", "dwarf"], ["लंबे", "बौने"], ["stem height", "तने की ऊँचाई"]],
  ["V", ["violet-flowered", "white-flowered"], ["बैंगनी पुष्प वाले", "सफेद पुष्प वाले"], ["flower colour", "पुष्प का रंग"]],
  ["A", ["axial-flowered", "terminal-flowered"], ["कक्षीय पुष्प वाले", "शीर्षस्थ पुष्प वाले"], ["flower position", "पुष्प की स्थिति"]],
  ["I", ["inflated-pod", "constricted-pod"], ["फूली फली वाले", "संकुचित फली वाले"], ["pod shape", "फली का आकार"]],
  ["G", ["green-pod", "yellow-pod"], ["हरी फली वाले", "पीली फली वाले"], ["pod colour", "फली का रंग"]],
  ["R", ["round-seeded", "wrinkled-seeded"], ["गोल बीज वाले", "झुर्रीदार बीज वाले"], ["seed shape", "बीज का आकार"]],
  ["Y", ["yellow-seeded", "green-seeded"], ["पीले बीज वाले", "हरे बीज वाले"], ["seed colour", "बीज का रंग"]],
];
// Genotip enega gena: 2 = AA, 1 = Aa, 0 = aa. Verjetnosti potomca v četrtinah: [aa, Aa, AA].
const gam = (g) => (g === 2 ? [2, 0] : g === 1 ? [1, 1] : [0, 2]); // [A, a] v polovicah
const childQ = (g1, g2) => {
  const [A1, a1] = gam(g1);
  const [A2, a2] = gam(g2);
  return [a1 * a2, A1 * a2 + a1 * A2, A1 * A2];
};
const geno = (ch, g) => (g === 2 ? ch + ch : g === 1 ? ch + ch.toLowerCase() : ch.toLowerCase() + ch.toLowerCase());
const plants = (adjs, l) => (l === 0 ? `${adjs.join(", ")} plants` : `${adjs.join(" और ")} पौधे`);
const fr = (n, d) => `$${fracTex(n, d)}$`;

const GENETICS_MENDEL = {
  id: "exi-bio-genetics-mendel",
  topics: [T("genetics-and-inheritance")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    const [g1, g2, g3] = r.shuffle(PEA).slice(0, 3);
    const asCount = r.int(0, 1) === 1;
    const N = 4 * r.int(25, 400);
    const N16 = 16 * r.int(10, 100);
    if (level === 1 && v < 3) {
      const tc = v === 2;
      const [ch, adjE, adjH, tr] = g1;
      const cross = tc ? `${geno(ch, 1)} \\times ${geno(ch, 0)}` : `${geno(ch, 1)} \\times ${geno(ch, 1)}`;
      const ask = tc ? r.int(0, 1) : r.int(0, 3); // 0 recesivni, 1 dominantni, 2 heterozigoti, 3 homozigotno dominantni
      const q = tc ? [2, 2, 2, 0][ask] : [1, 3, 2, 1][ask]; // v četrtinah
      const what = [[`${adjE[1]} plants`, `${adjH[1]} पौधे`], [`${adjE[0]} plants`, `${adjH[0]} पौधे`], [`heterozygous ($${geno(ch, 1)}$) plants`, `विषमयुग्मजी ($${geno(ch, 1)}$) पौधे`], [`homozygous dominant ($${geno(ch, 2)}$) plants`, `समयुग्मजी प्रभावी ($${geno(ch, 2)}$) पौधे`]][ask];
      const mistQ = tc
        ? [[1, L("1/4 is the F₂ value; in a test cross half the offspring get the recessive allele from the heterozygote.", "1/4 F₂ का मान है; परीक्षार्थ संकरण में आधी संतानों को विषमयुग्मजी से अप्रभावी युग्मविकल्पी मिलता है।")], [3, L("3/4 belongs to the F₂ of Tt × Tt, not to a test cross.", "3/4, Tt × Tt के F₂ का है, परीक्षार्थ संकरण का नहीं।")]]
        : [
            [[3, L("That is the fraction showing the dominant trait.", "यह प्रभावी लक्षण दिखाने वाला भाग है।")], [2, L("That is the heterozygous fraction.", "यह विषमयुग्मजी भाग है।")]],
            [[1, L("Heterozygotes also show the dominant trait.", "विषमयुग्मजी भी प्रभावी लक्षण दिखाते हैं।")], [2, L("Add the homozygous dominant plants to the heterozygotes.", "विषमयुग्मजियों में समयुग्मजी प्रभावी पौधे भी जोड़िए।")]],
            [[1, L("A heterozygote can form in two ways (dominant allele from either parent).", "विषमयुग्मजी दो तरह से बन सकता है (प्रभावी युग्मविकल्पी किसी भी जनक से)।")], [3, L("That counts every plant with the dominant trait, including the homozygotes.", "इसमें समयुग्मजी सहित प्रभावी लक्षण वाले सभी पौधे गिने गए।")]],
            [[3, L("Not every plant with the dominant trait is homozygous.", "प्रभावी लक्षण वाला हर पौधा समयुग्मजी नहीं होता।")], [2, L("That is the heterozygous fraction.", "यह विषमयुग्मजी भाग है।")]],
          ][ask];
      const crossTxt = [`Two pea plants are crossed: $${cross}$ (${tr[0]}).`, `मटर के दो पौधों का संकरण किया गया: $${cross}$ (${tr[1]})।`];
      if (asCount) {
        const ans = (N * q) / 4;
        return task({
          text: L(`${crossTxt[0]} Out of ${N} offspring, how many are expected to be ${what[0]}?`, `${crossTxt[1]} ${N} संतानों में से कितने ${what[1]} होने की अपेक्षा है?`),
          answer: numM(ans, 0, mistQ.map(([m, w]) => [(N * m) / 4, w])),
          data: { given: [cross, `N = ${N}`], find: [`N_{${tx(L("expected", "अपेक्षित"))}}`] },
          hint: L("Draw the Punnett square, find the fraction, then multiply by the number of offspring.", "पनेट वर्ग बनाइए, भाग ज्ञात कीजिए, फिर संतानों की संख्या से गुणा कीजिए।"),
          formula: "N_x = P \\cdot N",
          solution: L(S(tc ? `Gametes: ${ch}, ${ch.toLowerCase()} × ${ch.toLowerCase()} → 1 ${geno(ch, 1)} : 1 ${geno(ch, 0)}` : `Offspring: 1 ${geno(ch, 2)} : 2 ${geno(ch, 1)} : 1 ${geno(ch, 0)}`, `$P = ${fracTex(q, 4)}$`, `$N_x = ${fracTex(q, 4)} \\cdot ${N} = ${ans}$`), S(tc ? `युग्मक: ${ch}, ${ch.toLowerCase()} × ${ch.toLowerCase()} → 1 ${geno(ch, 1)} : 1 ${geno(ch, 0)}` : `संतानें: 1 ${geno(ch, 2)} : 2 ${geno(ch, 1)} : 1 ${geno(ch, 0)}`, `$P = ${fracTex(q, 4)}$`, `$N_x = ${fracTex(q, 4)} \\cdot ${N} = ${ans}$`)),
        });
      }
      return task({
        text: L(`${crossTxt[0]} What fraction of the offspring are expected to be ${what[0]}?`, `${crossTxt[1]} संतानों का कितना भाग ${what[1]} होने की अपेक्षा है?`),
        answer: fractionM(q, 4, mistQ.map(([m, w]) => [m / 4, w])),
        data: { given: [cross], find: ["P"] },
        hint: L("Write the gametes of each parent and combine them in a Punnett square.", "प्रत्येक जनक के युग्मक लिखिए और पनेट वर्ग में मिलाइए।"),
        formula: "P = \\dfrac{\\text{favourable boxes}}{4}",
        solution: L(S(tc ? `$${cross}$ → 1 ${geno(ch, 1)} : 1 ${geno(ch, 0)}` : `$${cross}$ → 1 ${geno(ch, 2)} : 2 ${geno(ch, 1)} : 1 ${geno(ch, 0)}`, `$P = ${fracTex(q, 4)}$`), S(tc ? `$${cross}$ → 1 ${geno(ch, 1)} : 1 ${geno(ch, 0)}` : `$${cross}$ → 1 ${geno(ch, 2)} : 2 ${geno(ch, 1)} : 1 ${geno(ch, 0)}`, `$P = ${fracTex(q, 4)}$`)),
      });
    }
    if (level === 1) {
      const ask = r.int(0, 2); // 0 roza, 1 rdeči, 2 beli
      const q = [2, 1, 1][ask];
      const col = [["pink", "गुलाबी"], ["red", "लाल"], ["white", "सफेद"]][ask];
      const mist = ask === 0 ? [[3, L("Pink is not dominant; in incomplete dominance the ratio is 1 : 2 : 1.", "गुलाबी प्रभावी नहीं है; अपूर्ण प्रभाविता में अनुपात 1 : 2 : 1 है।")], [1, L("Rr arises in two ways, so pink is the largest class.", "Rr दो तरह से बनता है, इसलिए गुलाबी सबसे बड़ा वर्ग है।")]] : [[3, L("Red is not fully dominant here: Rr plants are pink, not red.", "यहाँ लाल पूर्णतः प्रभावी नहीं है: Rr पौधे गुलाबी होते हैं, लाल नहीं।")], [2, L("That is the pink (Rr) fraction.", "यह गुलाबी (Rr) भाग है।")]];
      const intro = [`In snapdragon, a true-breeding red-flowered plant (RR) is crossed with a white-flowered one (rr) and the F₁ plants are selfed.`, `स्नैपड्रैगन में शुद्ध लाल पुष्प वाले पौधे (RR) का सफेद पुष्प वाले पौधे (rr) से संकरण कराया गया और F₁ पौधों का स्वपरागण किया गया।`];
      return task({
        text: asCount ? L(`${intro[0]} Out of ${N} F₂ plants, how many are expected to have ${col[0]} flowers?`, `${intro[1]} ${N} F₂ पौधों में से कितनों में ${col[1]} पुष्प होने की अपेक्षा है?`) : L(`${intro[0]} What fraction of the F₂ plants will have ${col[0]} flowers?`, `${intro[1]} F₂ पौधों के कितने भाग में ${col[1]} पुष्प होंगे?`),
        answer: asCount ? numM((N * q) / 4, 0, mist.map(([m, w]) => [(N * m) / 4, w])) : fractionM(q, 4, mist.map(([m, w]) => [m / 4, w])),
        data: { given: ["RR \\times rr \\to F_1\\ Rr", asCount ? `N = ${N}` : null].filter(Boolean), find: [asCount ? "N_x" : "P"] },
        hint: L("In incomplete dominance the heterozygote has its own phenotype.", "अपूर्ण प्रभाविता में विषमयुग्मजी का अपना अलग लक्षणप्ररूप होता है।"),
        formula: "Rr \\times Rr \\to 1\\,RR : 2\\,Rr : 1\\,rr",
        solution: L(S("F₁ = Rr (pink); F₂: 1 RR red : 2 Rr pink : 1 rr white.", `$P(${col[0]}) = ${fracTex(q, 4)}$`, asCount ? `$${fracTex(q, 4)} \\cdot ${N} = ${(N * q) / 4}$` : null), S("F₁ = Rr (गुलाबी); F₂: 1 RR लाल : 2 Rr गुलाबी : 1 rr सफेद।", `$P(${col[1]}) = ${fracTex(q, 4)}$`, asCount ? `$${fracTex(q, 4)} \\cdot ${N} = ${(N * q) / 4}$` : null)),
      });
    }
    // dvohibrid: geni g1, g2
    const c1 = g1[0];
    const c2 = g2[0];
    if (level === 2 && v < 3) {
      const tc = v === 2;
      const cross = tc ? `${geno(c1, 1)}${geno(c2, 1)} \\times ${geno(c1, 0)}${geno(c2, 0)}` : `${geno(c1, 1)}${geno(c2, 1)} \\times ${geno(c1, 1)}${geno(c2, 1)}`;
      if (v === 1) {
        const ga = r.int(0, 2);
        const gb = r.int(0, 2);
        const qa = childQ(1, 1)[ga];
        const qb = childQ(1, 1)[gb];
        const num0 = qa * qb;
        const ph = (ga ? 3 : 1) * (gb ? 3 : 1);
        const G = `${geno(c1, ga)}${geno(c2, gb)}`;
        return task({
          text: L(`In a dihybrid cross $${cross}$ in pea, what fraction of the F₂ is expected to have the genotype $${G}$?`, `मटर के द्विसंकर संकरण $${cross}$ में F₂ के कितने भाग का जीनप्ररूप $${G}$ होने की अपेक्षा है?`),
          answer: fractionM(num0, 16, [[ph / 16, L("That is the whole phenotype class, which contains several genotypes.", "यह पूरा लक्षणप्ररूप वर्ग है, जिसमें कई जीनप्ररूप होते हैं।")], [1 / 16, L("Genotypes are not equally likely: heterozygotes form in two ways.", "सभी जीनप्ररूप समान प्रायिकता के नहीं हैं: विषमयुग्मजी दो तरह से बनते हैं।")], [1 / 9, L("There are 9 genotypes, but they are not equally frequent.", "जीनप्ररूप 9 हैं, पर उनकी आवृत्ति समान नहीं है।")]]),
          data: { given: [cross], find: [`P(${G})`] },
          hint: L("Treat the two genes separately (independent assortment) and multiply.", "दोनों जीनों को अलग-अलग लीजिए (स्वतंत्र अपव्यूहन) और गुणा कीजिए।"),
          formula: "P = P_1 \\cdot P_2",
          solution: L(S(`$P(${geno(c1, ga)}) = ${fracTex(qa, 4)}$, $P(${geno(c2, gb)}) = ${fracTex(qb, 4)}$`, `$P = ${fracTex(qa, 4)} \\cdot ${fracTex(qb, 4)} = ${fracTex(num0, 16)}$`), S(`$P(${geno(c1, ga)}) = ${fracTex(qa, 4)}$, $P(${geno(c2, gb)}) = ${fracTex(qb, 4)}$`, `$P = ${fracTex(qa, 4)} \\cdot ${fracTex(qb, 4)} = ${fracTex(num0, 16)}$`)),
        });
      }
      const da = r.int(0, 1);
      const db = r.int(0, 1);
      const pa = tc ? 2 : da ? 3 : 1;
      const pb = tc ? 2 : db ? 3 : 1;
      const num0 = pa * pb;
      const tot = tc ? 4 : 16;
      const NN = N16;
      const ph = [plants([g1[1][da ? 0 : 1], g2[1][db ? 0 : 1]], 0), plants([g1[2][da ? 0 : 1], g2[2][db ? 0 : 1]], 1)];
      const mist = tc
        ? [[1 / 16, L("1/16 is the F₂ double-recessive value; a test cross gives four equal classes.", "1/16 F₂ के द्वि-अप्रभावी का मान है; परीक्षार्थ संकरण चार समान वर्ग देता है।")], [9 / 16, L("9/16 belongs to the F₂, not to a test cross.", "9/16, F₂ का है, परीक्षार्थ संकरण का नहीं।")]]
        : [[(da && db ? 3 : 9) / 16, L("Check which trait is dominant: 9 : 3 : 3 : 1 is dominant–dominant : dominant–recessive : recessive–dominant : recessive–recessive.", "देखिए कौन-सा लक्षण प्रभावी है: 9 : 3 : 3 : 1 = प्रभावी-प्रभावी : प्रभावी-अप्रभावी : अप्रभावी-प्रभावी : अप्रभावी-अप्रभावी।")], [1 / 4, L("Classes of a dihybrid F₂ are not equally likely.", "द्विसंकर F₂ के वर्ग समान प्रायिकता के नहीं होते।")], [(pa + pb) / 16, L("Multiply the probabilities for the two genes; do not add.", "दोनों जीनों की प्रायिकताओं का गुणा कीजिए; जोड़िए नहीं।")]];
      const fq = num0 / tot;
      return task({
        text: asCount
          ? L(`In pea, $${cross}$ (genes for ${g1[3][0]} and ${g2[3][0]}; ${c1} and ${c2} dominant). Out of ${NN} offspring, how many are expected to be ${ph[0]}?`, `मटर में $${cross}$ (${g1[3][1]} और ${g2[3][1]} के जीन; ${c1} और ${c2} प्रभावी)। ${NN} संतानों में से कितने ${ph[1]} होने की अपेक्षा है?`)
          : L(`In pea, $${cross}$ (genes for ${g1[3][0]} and ${g2[3][0]}; ${c1} and ${c2} dominant). What fraction of the offspring are expected to be ${ph[0]}?`, `मटर में $${cross}$ (${g1[3][1]} और ${g2[3][1]} के जीन; ${c1} और ${c2} प्रभावी)। संतानों का कितना भाग ${ph[1]} होने की अपेक्षा है?`),
        answer: asCount ? numM(NN * fq, 0, mist.map(([m, w]) => [NN * m, w])) : fractionM(num0, tot, mist),
        data: { given: [cross, asCount ? `N = ${NN}` : null].filter(Boolean), find: [asCount ? "N_x" : "P"] },
        hint: L("Work out each gene on its own, then multiply the two probabilities.", "प्रत्येक जीन को अलग से हल कीजिए, फिर दोनों प्रायिकताओं का गुणा कीजिए।"),
        formula: "P = P_1 \\cdot P_2",
        solution: L(
          S(`Gene ${c1}: $P = ${fracTex(tc ? 2 : pa, 4)}$; gene ${c2}: $P = ${fracTex(tc ? 2 : pb, 4)}$`, `$P = ${fracTex(num0, tot)}$`, asCount ? `$N_x = ${fracTex(num0, tot)} \\cdot ${NN} = ${NN * fq}$` : null),
          S(`जीन ${c1}: $P = ${fracTex(tc ? 2 : pa, 4)}$; जीन ${c2}: $P = ${fracTex(tc ? 2 : pb, 4)}$`, `$P = ${fracTex(num0, tot)}$`, asCount ? `$N_x = ${fracTex(num0, tot)} \\cdot ${NN} = ${NN * fq}$` : null),
        ),
      });
    }
    if (level === 2) {
      // naključno križanje dveh staršev (dva gena), verjetnost fenotipa
      const opts = [[1, 1], [1, 0], [2, 1], [1, 2], [0, 1]];
      const [pa1, pa2] = r.pick(opts);
      const [pb1, pb2] = r.pick(opts.filter(([x, y]) => !(x === pa1 && y === pa2)));
      const da = r.int(0, 1);
      const db = r.int(0, 1);
      const cA = childQ(pa1, pa2);
      const cB = childQ(pb1, pb2);
      // če recesivni fenotip ni mogoč (AA × Aa), vprašamo po dominantnem
      const dA = da || cA[0] === 0 ? 1 : 0;
      const dB = db || cB[0] === 0 ? 1 : 0;
      const qa = dA ? cA[1] + cA[2] : cA[0];
      const qb = dB ? cB[1] + cB[2] : cB[0];
      const cross = `${geno(c1, pa1)}${geno(c2, pb1)} \\times ${geno(c1, pa2)}${geno(c2, pb2)}`;
      const num0 = qa * qb;
      const ph = [plants([g1[1][dA ? 0 : 1], g2[1][dB ? 0 : 1]], 0), plants([g1[2][dA ? 0 : 1], g2[2][dB ? 0 : 1]], 1)];
      return task({
        text: L(`In pea (${c1} and ${c2} dominant), the cross $${cross}$ is made. What fraction of the offspring will be ${ph[0]}?`, `मटर में (${c1} और ${c2} प्रभावी) संकरण $${cross}$ किया गया। संतानों का कितना भाग ${ph[1]} होगा?`),
        answer: fractionM(num0, 16, [[(qa + qb) / 4 < 1 ? (qa + qb) / 4 : (qa + qb) / 8, L("Multiply the two single-gene probabilities; do not add or average them.", "दोनों एकल-जीन प्रायिकताओं का गुणा कीजिए; जोड़िए या औसत मत लीजिए।")], [9 / 16, L("This is not a cross of two double heterozygotes, so 9 : 3 : 3 : 1 does not apply.", "यह दो द्वि-विषमयुग्मजियों का संकरण नहीं है, अतः 9 : 3 : 3 : 1 लागू नहीं।")], [qa / 4, L("Include the probability for the second gene as well.", "दूसरे जीन की प्रायिकता भी शामिल कीजिए।")]]),
        data: { given: [cross], find: ["P"] },
        hint: L("Split the cross into two monohybrid crosses, one per gene.", "संकरण को प्रति जीन एक, दो एकसंकर संकरणों में बाँटिए।"),
        formula: "P = P_1 \\cdot P_2",
        solution: L(S(`$${geno(c1, pa1)} \\times ${geno(c1, pa2)}$: $P_1 = ${fracTex(qa, 4)}$`, `$${geno(c2, pb1)} \\times ${geno(c2, pb2)}$: $P_2 = ${fracTex(qb, 4)}$`, `$P = ${fracTex(qa, 4)} \\cdot ${fracTex(qb, 4)} = ${fracTex(num0, 16)}$`), S(`$${geno(c1, pa1)} \\times ${geno(c1, pa2)}$: $P_1 = ${fracTex(qa, 4)}$`, `$${geno(c2, pb1)} \\times ${geno(c2, pb2)}$: $P_2 = ${fracTex(qb, 4)}$`, `$P = ${fracTex(qa, 4)} \\cdot ${fracTex(qb, 4)} = ${fracTex(num0, 16)}$`)),
      });
    }
    // Raven 3
    if (v === 0) {
      const cross = `AaBbCc \\times AaBbCc`;
      const ask = r.int(0, 4);
      const [nu, de, wEn, wHi, mist] = [
        [1, 64, "aabbcc", "aabbcc", [[1 / 16, "Three genes, so multiply three factors of 1/4."], [1 / 8, "Each recessive homozygote has probability 1/4, not 1/2."]]],
        [1, 64, "AABBCC", "AABBCC", [[27 / 64, "That is the all-dominant phenotype, which includes heterozygotes."], [1 / 8, "Each homozygote has probability 1/4, not 1/2."]]],
        [1, 8, "AaBbCc", "AaBbCc", [[1 / 64, "A heterozygote has probability 1/2 for each gene, not 1/4."], [27 / 64, "That is the all-dominant phenotype class."]]],
        [27, 64, "all three dominant traits (A_B_C_)", "तीनों प्रभावी लक्षण (A_B_C_)", [[9 / 16, "That is for two genes; multiply by 3/4 once more."], [1 / 64, "That is only the homozygous AABBCC part."]]],
        [9, 64, "dominant A and B but recessive c (A_B_cc)", "प्रभावी A और B पर अप्रभावी c (A_B_cc)", [[9 / 16, "Include the factor 1/4 for cc."], [3 / 64, "P(A_) and P(B_) are 3/4 each."]]],
      ][ask];
      const hiW = { "Three genes, so multiply three factors of 1/4.": "तीन जीन हैं, इसलिए 1/4 के तीन गुणनखंड गुणा कीजिए।", "Each recessive homozygote has probability 1/4, not 1/2.": "प्रत्येक अप्रभावी समयुग्मज की प्रायिकता 1/4 है, 1/2 नहीं।", "That is the all-dominant phenotype, which includes heterozygotes.": "यह सर्व-प्रभावी लक्षणप्ररूप है, जिसमें विषमयुग्मजी भी हैं।", "Each homozygote has probability 1/4, not 1/2.": "प्रत्येक समयुग्मज की प्रायिकता 1/4 है, 1/2 नहीं।", "A heterozygote has probability 1/2 for each gene, not 1/4.": "प्रत्येक जीन के लिए विषमयुग्मजी की प्रायिकता 1/2 है, 1/4 नहीं।", "That is the all-dominant phenotype class.": "यह सर्व-प्रभावी लक्षणप्ररूप वर्ग है।", "That is for two genes; multiply by 3/4 once more.": "यह दो जीनों के लिए है; एक बार और 3/4 से गुणा कीजिए।", "That is only the homozygous AABBCC part.": "यह केवल समयुग्मजी AABBCC भाग है।", "Include the factor 1/4 for cc.": "cc के लिए 1/4 का गुणनखंड भी लीजिए।", "P(A_) and P(B_) are 3/4 each.": "P(A_) और P(B_) प्रत्येक 3/4 हैं।" };
      const geno3 = ask < 3;
      return task({
        text: L(`Three independently assorting genes show complete dominance. In the cross $${cross}$, what fraction of the offspring ${geno3 ? `will have the genotype $${wEn}$` : `will show ${wEn}`}?`, `तीन स्वतंत्र रूप से अपव्यूहित जीन पूर्ण प्रभाविता दिखाते हैं। संकरण $${cross}$ में संतानों के कितने भाग ${geno3 ? `का जीनप्ररूप $${wHi}$ होगा` : `में ${wHi} होंगे`}?`),
        answer: fractionM(nu, de, mist.map(([m, w]) => [m, L(w, hiW[w])])),
        data: { given: [cross], find: ["P"] },
        hint: L("Each gene behaves like a monohybrid cross; multiply the three probabilities.", "प्रत्येक जीन एकसंकर संकरण की तरह व्यवहार करता है; तीनों प्रायिकताओं का गुणा कीजिए।"),
        formula: "P = P_A \\cdot P_B \\cdot P_C",
        solution: L(S("Per gene: P(homozygous) = 1/4, P(heterozygous) = 1/2, P(dominant trait) = 3/4, P(recessive) = 1/4.", `$P = ${fracTex(nu, de)}$`), S("प्रति जीन: P(समयुग्मज) = 1/4, P(विषमयुग्मज) = 1/2, P(प्रभावी) = 3/4, P(अप्रभावी) = 1/4।", `$P = ${fracTex(nu, de)}$`)),
      });
    }
    if (v === 1) {
      const m = r.int(3, 5);
      const h = r.int(2, m);
      const letters = ["A", "B", "C", "D", "E"].slice(0, m);
      const hetIdx = r.shuffle(letters.map((_, i) => i)).slice(0, h);
      const homo = letters.map((x, i) => (hetIdx.includes(i) ? x + x.toLowerCase() : r.int(0, 1) ? x + x : x.toLowerCase() + x.toLowerCase()));
      const G = homo.join("");
      const ask = r.int(0, 2); // 0 tipi gamet, 1 genotipi v F2 samooplodnje, 2 fenotipi
      const ans = [2 ** h, 3 ** h, 2 ** h][ask];
      const what = [["different kinds of gametes can this plant form", "इस पौधे से कितने प्रकार के युग्मक बन सकते हैं"], ["different genotypes are possible among its offspring on selfing", "स्वपरागण पर इसकी संतानों में कितने भिन्न जीनप्ररूप संभव हैं"], ["different phenotypes are possible among its offspring on selfing (complete dominance)", "स्वपरागण पर इसकी संतानों में कितने भिन्न लक्षणप्ररूप संभव हैं (पूर्ण प्रभाविता)"]][ask];
      const mist = [
        [[2 ** m, L("Homozygous genes give only one kind of allele.", "समयुग्मजी जीन केवल एक प्रकार का युग्मविकल्पी देते हैं।")], [2 * h, L("Use powers of 2, not 2 × h.", "2 × h नहीं, 2 की घात लीजिए।")]],
        [[2 ** h, L("Each heterozygous gene gives three genotypes (AA, Aa, aa).", "प्रत्येक विषमयुग्मजी जीन तीन जीनप्ररूप देता है (AA, Aa, aa)।")], [3 ** m, L("Homozygous genes give only one genotype on selfing.", "स्वपरागण पर समयुग्मजी जीन केवल एक जीनप्ररूप देते हैं।")]],
        [[3 ** h, L("With complete dominance, AA and Aa look alike: two phenotypes per gene.", "पूर्ण प्रभाविता में AA और Aa एक जैसे दिखते हैं: प्रति जीन दो लक्षणप्ररूप।")], [2 ** m, L("Homozygous genes do not segregate on selfing.", "स्वपरागण पर समयुग्मजी जीन पृथक्कृत नहीं होते।")]],
      ][ask];
      return task({
        text: L(`A plant has the genotype $${G}$ (genes on different chromosomes). How many ${what[0]}?`, `एक पौधे का जीनप्ररूप $${G}$ है (जीन अलग-अलग गुणसूत्रों पर)। ${what[1]}?`),
        answer: numM(ans, 0, mist),
        data: { given: [`G = ${G}`], find: ["N"] },
        hint: L("Only the heterozygous gene pairs create variety; count them first.", "केवल विषमयुग्मजी जीन युग्म विविधता लाते हैं; पहले उन्हें गिनिए।"),
        formula: ["N = 2^h", "N = 3^h", "N = 2^h"][ask],
        solution: L(S(`Heterozygous gene pairs: $h = ${h}$`, `$N = ${ask === 1 ? 3 : 2}^{${h}} = ${ans}$`), S(`विषमयुग्मजी जीन युग्म: $h = ${h}$`, `$N = ${ask === 1 ? 3 : 2}^{${h}} = ${ans}$`)),
      });
    }
    if (v === 2) {
      const di = r.int(0, 1) === 1;
      const ph = di ? [plants([g1[1][0], g2[1][0]], 0), plants([g1[2][0], g2[2][0]], 1)] : [plants([g1[1][0]], 0), plants([g1[2][0]], 1)];
      const cross = di ? `${geno(c1, 1)}${geno(c2, 1)} \\times ${geno(c1, 1)}${geno(c2, 1)}` : `${geno(c1, 1)} \\times ${geno(c1, 1)}`;
      return task({
        text: L(`In pea, the F₂ of $${cross}$ is raised. Among the ${ph[0]} only, what fraction are true-breeding (homozygous for ${di ? "both genes" : "the gene"})?`, `मटर में $${cross}$ का F₂ उगाया गया। केवल ${ph[1]} में से कितना भाग शुद्ध प्रजनन वाला (${di ? "दोनों जीनों" : "जीन"} के लिए समयुग्मजी) है?`),
        answer: di ? fractionM(1, 9, [[1 / 16, L("1/16 is out of all F₂ plants; the question asks only among the double-dominant ones (9/16).", "1/16 सभी F₂ पौधों में से है; प्रश्न केवल द्वि-प्रभावी (9/16) में से पूछता है।")], [4 / 9, L("That is the fraction heterozygous for both genes.", "यह दोनों जीनों के लिए विषमयुग्मजी भाग है।")]]) : fractionM(1, 3, [[1 / 4, L("1/4 is out of all F₂ plants; restrict to the dominant ones (3/4).", "1/4 सभी F₂ पौधों में से है; केवल प्रभावी (3/4) में से लीजिए।")], [2 / 3, L("That is the heterozygous fraction among them.", "यह उनमें विषमयुग्मजी भाग है।")]]),
        data: { given: [cross], find: [`P(${tx(L("homozygous | dominant", "समयुग्मजी | प्रभावी"))})`] },
        hint: L("List the genotypes that give the dominant phenotype and their proportions; then take the share of the homozygous one.", "प्रभावी लक्षणप्ररूप देने वाले जीनप्ररूप और उनके अनुपात लिखिए; फिर समयुग्मजी का हिस्सा लीजिए।"),
        formula: di ? "P = \\dfrac{1/16}{9/16}" : "P = \\dfrac{1/4}{3/4}",
        solution: L(di ? S(`Double-dominant class: 9/16; of these ${geno(c1, 2)}${geno(c2, 2)}: 1/16`, "$P = (1/16)/(9/16) = 1/9$") : S(`Dominant class: ${geno(c1, 2)} (1/4) + ${geno(c1, 1)} (2/4) = 3/4`, "$P = (1/4)/(3/4) = 1/3$"), di ? S(`द्वि-प्रभावी वर्ग: 9/16; इनमें ${geno(c1, 2)}${geno(c2, 2)}: 1/16`, "$P = (1/16)/(9/16) = 1/9$") : S(`प्रभावी वर्ग: ${geno(c1, 2)} (1/4) + ${geno(c1, 1)} (2/4) = 3/4`, "$P = (1/4)/(3/4) = 1/3$")),
      });
    }
    const ask = r.int(0, 3);
    const [nu, de, wEn, wHi] = [[3, 8, "pink and tall", "गुलाबी और लंबे"], [1, 16, "red and dwarf", "लाल और बौने"], [3, 16, "white and tall", "सफेद और लंबे"], [6, 1, "", ""]][ask];
    const intro = [`Suppose flower colour shows incomplete dominance as in snapdragon (RR red, Rr pink, rr white) and height shows complete dominance (T tall). The cross RrTt × RrTt is made.`, `मान लीजिए पुष्प का रंग स्नैपड्रैगन की तरह अपूर्ण प्रभाविता दिखाता है (RR लाल, Rr गुलाबी, rr सफेद) और ऊँचाई पूर्ण प्रभाविता (T लंबा)। संकरण RrTt × RrTt किया गया।`];
    if (ask === 3) {
      return task({
        text: L(`${intro[0]} How many different phenotypes appear among the offspring?`, `${intro[1]} संतानों में कितने भिन्न लक्षणप्ररूप दिखेंगे?`),
        answer: numM(6, 0, [[4, L("Colour gives three phenotypes, not two, because Rr is pink.", "रंग के तीन लक्षणप्ररूप हैं, दो नहीं, क्योंकि Rr गुलाबी है।")], [9, L("Height gives only two phenotypes: TT and Tt are both tall.", "ऊँचाई के केवल दो लक्षणप्ररूप हैं: TT और Tt दोनों लंबे।")]]),
        data: { given: ["RrTt \\times RrTt"], find: [`N_{${tx(L("phenotypes", "लक्षणप्ररूप"))}}`] },
        hint: L("Count phenotypes per gene, then multiply.", "प्रति जीन लक्षणप्ररूप गिनिए, फिर गुणा कीजिए।"),
        formula: "N = 3 \\cdot 2",
        solution: L(S("Colour: red, pink, white (3); height: tall, dwarf (2).", "$N = 3 \\cdot 2 = 6$"), S("रंग: लाल, गुलाबी, सफेद (3); ऊँचाई: लंबा, बौना (2)।", "$N = 3 \\cdot 2 = 6$")),
      });
    }
    return task({
      text: L(`${intro[0]} What fraction of the offspring will be ${wEn}?`, `${intro[1]} संतानों का कितना भाग ${wHi} होगा?`),
      answer: fractionM(nu, de, [[[9 / 16, 3 / 16, 9 / 16][ask], L("Colour is not completely dominant: use 1/4 red, 1/2 pink, 1/4 white.", "रंग पूर्ण प्रभावी नहीं है: 1/4 लाल, 1/2 गुलाबी, 1/4 सफेद लीजिए।")], [[1 / 4, 1 / 4, 1 / 16][ask], L("Multiply the colour and height probabilities.", "रंग और ऊँचाई की प्रायिकताओं का गुणा कीजिए।")]]),
      data: { given: ["RrTt \\times RrTt"], find: ["P"] },
      hint: L("Colour: 1 red : 2 pink : 1 white. Height: 3 tall : 1 dwarf. Multiply.", "रंग: 1 लाल : 2 गुलाबी : 1 सफेद। ऊँचाई: 3 लंबे : 1 बौना। गुणा कीजिए।"),
      formula: "P = P_{\\text{colour}} \\cdot P_{\\text{height}}",
      solution: L(S(`$P = ${["1/2 \\cdot 3/4", "1/4 \\cdot 1/4", "1/4 \\cdot 3/4"][ask]} = ${fracTex(nu, de)}$`, `${cap(wEn)}: ${fr(nu, de)}`), S(`$P = ${["1/2 \\cdot 3/4", "1/4 \\cdot 1/4", "1/4 \\cdot 3/4"][ask]} = ${fracTex(nu, de)}$`, `${wHi}: ${fr(nu, de)}`)),
    });
  },
};

// ---------------------------------------------------------------------------------------------
// Krvne skupine ABO, srpastocelična anemija, na X vezano dedovanje (hemofilija, barvna slepota).
// ---------------------------------------------------------------------------------------------
const AL = { A: "I^{A}", B: "I^{B}", O: "i" };
const G6 = ["AA", "AO", "BB", "BO", "AB", "OO"];
const gTex = (g) => g.split("").map((x) => AL[x]).join("");
const grpOf = (a, b) => (a === "O" && b === "O" ? "O" : (a === "A" || b === "A") && (a === "B" || b === "B") ? "AB" : a === "A" || b === "A" ? "A" : "B");
const GRP_OF_G = (g) => grpOf(g[0], g[1]);
const aboBoxes = (g1, g2) => [g1[0] + g2[0], g1[0] + g2[1], g1[1] + g2[0], g1[1] + g2[1]].map((x) => (x[0] === "O" ? x[1] + x[0] : x[0] === "B" && x[1] === "A" ? "AB" : x));
const aboQ = (g1, g2, grp) => aboBoxes(g1, g2).filter((b) => GRP_OF_G(b) === grp).length;
const ABO_L1 = [];
G6.forEach((g1, i) => G6.slice(i).forEach((g2) => ["A", "B", "AB", "O"].forEach((grp) => {
  const q = aboQ(g1, g2, grp);
  if (q > 0 && q < 4) ABO_L1.push([g1, g2, grp, q]);
})));
function aboMist(L, g1, g2, grp, q) {
  const box = aboBoxes(g1, g2);
  const out = [];
  if ((grp === "A" || grp === "B") && box.includes("AB")) out.push([(q + box.filter((b) => b === "AB").length) / 4, L(`A child with both $I^{A}$ and $I^{B}$ is group AB, not ${grp}: the two alleles are codominant.`, `$I^{A}$ और $I^{B}$ दोनों वाली संतान का वर्ग AB होता है, ${grp} नहीं: दोनों युग्मविकल्पी सहप्रभावी हैं।`)]);
  if (grp === "AB") out.push([0, L("$I^{A}$ and $I^{B}$ are codominant: neither masks the other, so a child with both is AB.", "$I^{A}$ और $I^{B}$ सहप्रभावी हैं: कोई किसी को नहीं छिपाता, अतः दोनों वाली संतान AB है।")]);
  if (grp === "O") out.push([box.filter((b) => b.includes("O")).length / 4, L("Group O needs $i$ from both parents ($ii$); a single $i$ is masked by $I^{A}$ or $I^{B}$.", "वर्ग O के लिए दोनों जनकों से $i$ चाहिए ($ii$); अकेला $i$, $I^{A}$ या $I^{B}$ से छिप जाता है।")]);
  if (grp === "A" || grp === "B") {
    const hom = box.filter((b) => b === grp + grp).length;
    const het = box.filter((b) => b === grp + "O").length;
    if (hom && het) out.push([hom / 4, L(`$${AL[grp]}i$ children are also group ${grp}.`, `$${AL[grp]}i$ संतानें भी वर्ग ${grp} की होती हैं।`)]);
  }
  out.push(q !== 1 ? [1 / 4, L("Several Punnett boxes can give the same group; count every box of this group.", "कई पनेट खाने एक ही वर्ग दे सकते हैं; इस वर्ग के सभी खाने गिनिए।")] : [1 / 2, L("Both parents must pass the needed allele: multiply the two chances of 1/2.", "दोनों जनकों को आवश्यक युग्मविकल्पी देना होगा: 1/2 की दोनों प्रायिकताओं का गुणा कीजिए।")]);
  return out;
}
const aboSol = (L, g1, g2, grp, q) => {
  const box = aboBoxes(g1, g2);
  const line = box.map((b) => `${gTex(b)}\\,(${GRP_OF_G(b)})`).join(",\\ ");
  return L(
    S(`Gametes: $${AL[g1[0]]}$, $${AL[g1[1]]}$ and $${AL[g2[0]]}$, $${AL[g2[1]]}$`, `Punnett boxes: $${line}$`, `$P(${grp}) = ${fracTex(q, 4)}$`),
    S(`युग्मक: $${AL[g1[0]]}$, $${AL[g1[1]]}$ तथा $${AL[g2[0]]}$, $${AL[g2[1]]}$`, `पनेट खाने: $${line}$`, `$P(${grp}) = ${fracTex(q, 4)}$`),
  );
};
// Srpastocelična anemija: 2 = HbAHbA, 1 = HbAHbS, 0 = HbSHbS.
const HB = (g) => ["\\mathrm{Hb^{S}Hb^{S}}", "\\mathrm{Hb^{A}Hb^{S}}", "\\mathrm{Hb^{A}Hb^{A}}"][g];
const SICKLE = [];
[[1, 1], [1, 2], [1, 0]].forEach(([a, b]) => [0, 1, 2, 3].forEach((ask) => {
  const c = childQ(a, b);
  const q = [c[0], c[1], c[2], c[1] + c[2]][ask];
  if (q > 0 && q < 4) SICKLE.push([a, b, ask, q]);
}));
// X-vezano: d.s = simbol; ženska N/C/A, moški m/M.
const XD = [
  { s: "h", n: ["haemophilia", "हीमोफीलिया"], a: ["haemophilic", "हीमोफीलिक"] },
  { s: "c", n: ["colour blindness", "वर्णांधता"], a: ["colour-blind", "वर्णांध"] },
];
const xg = (d, k) => {
  const D = d.s.toUpperCase();
  const s = d.s;
  return { N: `X^{${D}}X^{${D}}`, C: `X^{${D}}X^{${s}}`, A: `X^{${s}}X^{${s}}`, m: `X^{${D}}Y`, M: `X^{${s}}Y` }[k];
};
const XWHO = {
  C: ["a normal woman who is a carrier", "एक सामान्य वाहक स्त्री"],
  A: ["an affected woman", "एक प्रभावित स्त्री"],
  m: ["a normal man", "एक सामान्य पुरुष"],
  M: ["an affected man", "एक प्रभावित पुरुष"],
};
const XW = {
  allCh: ["That is out of all children; the question is about sons only.", "यह सभी संतानों में से है; प्रश्न केवल पुत्रों के बारे में है।"],
  allChD: ["That is out of all children; the question is about daughters only.", "यह सभी संतानों में से है; प्रश्न केवल पुत्रियों के बारे में है।"],
  canPass: ["A carrier mother passes her recessive X to half of her sons.", "वाहक माता अपना अप्रभावी X आधे पुत्रों को देती है।"],
  eitherX: ["A daughter can get either of the mother's two X chromosomes, so not every daughter is a carrier.", "पुत्री को माता के दोनों में से कोई भी X मिल सकता है, अतः हर पुत्री वाहक नहीं होती।"],
  sonsOnly: ["That is among sons only; sons are about half of all children.", "यह केवल पुत्रों में है; पुत्र सभी संतानों के लगभग आधे होते हैं।"],
  unaff: ["That is the fraction of unaffected children.", "यह अप्रभावित संतानों का भाग है।"],
  twoF: ["The child must get Y from the father (1/2) and the recessive X from the mother (1/2): only two factors.", "संतान को पिता से Y (1/2) और माता से अप्रभावी X (1/2) मिलना चाहिए: केवल दो गुणनखंड।"],
  yFather: ["Sons get Y from the father, never his X.", "पुत्रों को पिता से Y मिलता है, उसका X कभी नहीं।"],
  bothX: ["A daughter is affected when she gets the recessive X from both parents, and here the father always gives it.", "पुत्री तब प्रभावित होती है जब उसे दोनों जनकों से अप्रभावी X मिले, और यहाँ पिता सदा उसे देता है।"],
  dauAlso: ["Here daughters can be affected too: the father gives his recessive X to every daughter.", "यहाँ पुत्रियाँ भी प्रभावित हो सकती हैं: पिता अपना अप्रभावी X हर पुत्री को देता है।"],
  onlyMat: ["Only children who receive the mother's recessive X can be affected.", "केवल वे संतानें प्रभावित हो सकती हैं जिन्हें माता का अप्रभावी X मिले।"],
  dauCarrier: ["Daughters receive the normal X from the father, so they are carriers, not affected.", "पुत्रियों को पिता से सामान्य X मिलता है, अतः वे वाहक हैं, प्रभावित नहीं।"],
  allSons: ["Every son is affected, because his only X comes from the affected mother.", "हर पुत्र प्रभावित है, क्योंकि उसका एकमात्र X प्रभावित माता से आता है।"],
  sonsOnly1: ["That is among sons only, not among all children.", "यह केवल पुत्रों में है, सभी संतानों में नहीं।"],
};
// [mati, oče, vprašanje, števec, imenovalec, napake [[vrednost, ključ]]]
const XQ = [
  ["C", "m", 0, 1, 2, [[1 / 4, "allCh"], [0, "canPass"]]],
  ["C", "m", 2, 1, 2, [[1 / 4, "allChD"], [1, "eitherX"]]],
  ["C", "m", 3, 1, 4, [[1 / 2, "sonsOnly"], [3 / 4, "unaff"]]],
  ["C", "m", 4, 1, 4, [[1 / 2, "sonsOnly"], [1 / 8, "twoF"]]],
  ["C", "M", 0, 1, 2, [[1, "yFather"], [1 / 4, "allCh"]]],
  ["C", "M", 1, 1, 2, [[0, "bothX"], [1 / 4, "allChD"]]],
  ["C", "M", 3, 1, 2, [[1 / 4, "dauAlso"], [1, "onlyMat"]]],
  ["A", "m", 3, 1, 2, [[1, "dauCarrier"], [1 / 4, "allSons"]]],
  ["A", "m", 4, 1, 2, [[1, "sonsOnly1"], [1 / 4, "allSons"]]],
];
const XASK = [
  ["If a child of theirs is a son, what is the probability that he is %?", "यदि उनकी संतान पुत्र है, तो उसके % होने की प्रायिकता क्या है?"],
  ["If a child of theirs is a daughter, what is the probability that she is %?", "यदि उनकी संतान पुत्री है, तो उसके % होने की प्रायिकता क्या है?"],
  ["If a child of theirs is a daughter, what is the probability that she is a carrier?", "यदि उनकी संतान पुत्री है, तो उसके वाहक होने की प्रायिकता क्या है?"],
  ["What is the probability that a child of theirs (son or daughter) is %?", "उनकी किसी संतान (पुत्र या पुत्री) के % होने की प्रायिकता क्या है?"],
  ["What is the probability that their child is a % son?", "उनकी संतान के % पुत्र होने की प्रायिकता क्या है?"],
];
const xKids = (d, mo, fa) => {
  const mx = xg(d, mo).match(/X\^\{.\}/g);
  const fx = xg(d, fa).match(/X\^\{.\}/)[0];
  return { dau: mx.map((x) => (x.includes(d.s.toUpperCase()) ? x + fx : fx + x)), son: mx.map((x) => x + "Y"), mx, fx };
};
// Družinski podatki ABO na ravni 2: [moški genotip, opis, ženska genotip, opis]
const ABO_FAM = [
  ["AO", ["group A and his mother is group O", "वर्ग A का है और उसकी माता वर्ग O की है"], "BO", ["group B and whose father is group O", "वर्ग B की है और उसके पिता वर्ग O के हैं"]],
  ["AO", ["group A and his father is group O", "वर्ग A का है और उसके पिता वर्ग O के हैं"], "AB", ["group AB", "वर्ग AB की है"]],
  ["BO", ["group B and his mother is group O", "वर्ग B का है और उसकी माता वर्ग O की है"], "AO", ["group A and whose mother is group O", "वर्ग A की है और उसकी माता वर्ग O की है"]],
  ["BO", ["group B and his father is group O", "वर्ग B का है और उसके पिता वर्ग O के हैं"], "OO", ["group O", "वर्ग O की है"]],
  ["AO", ["group A and his mother is group O", "वर्ग A का है और उसकी माता वर्ग O की है"], "AO", ["group A and whose father is group O", "वर्ग A की है और उसके पिता वर्ग O के हैं"]],
];
const ABO_FAM_Q = [];
ABO_FAM.forEach((f, i) => ["A", "B", "AB", "O"].forEach((grp) => {
  const q = aboQ(f[0], f[2], grp);
  if (q > 0 && q < 4) ABO_FAM_Q.push([i, grp, q]);
}));
const homOf = (g) => (g[1] === "O" && g[0] !== "O" ? g[0] + g[0] : g);
const ABO_INTRO = ["ABO blood groups are controlled by gene I with alleles $I^{A}$, $I^{B}$ (codominant) and $i$ (recessive).", "ABO रुधिर वर्ग जीन I से नियंत्रित होते हैं, जिसके युग्मविकल्पी $I^{A}$, $I^{B}$ (सहप्रभावी) और $i$ (अप्रभावी) हैं।"];

const GENETICS_ABO_SEX = {
  id: "exi-bio-genetics-blood-sex",
  topics: [T("genetics-and-inheritance")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    const d = XD[r.int(0, 1)];
    const man = NAMES[2 * r.int(0, 3)];
    const wom = NAMES[2 * r.int(0, 3) + 1];
    if (level === 1 && v < 2) {
      const [g1, g2, grp, q] = r.pick(ABO_L1);
      return task({
        text: L(`${ABO_INTRO[0]} A man with genotype $${gTex(g1)}$ marries a woman with genotype $${gTex(g2)}$. What is the probability that their child has blood group ${grp}?`, `${ABO_INTRO[1]} जीनप्ररूप $${gTex(g1)}$ वाले पुरुष का विवाह जीनप्ररूप $${gTex(g2)}$ वाली स्त्री से होता है। उनकी संतान का रुधिर वर्ग ${grp} होने की प्रायिकता क्या है?`),
        answer: fractionM(q, 4, aboMist(L, g1, g2, grp, q)),
        data: { given: [`${gTex(g1)} \\times ${gTex(g2)}`], find: [`P(${grp})`] },
        hint: L("Write the two gametes of each parent and fill a 2 × 2 Punnett square.", "प्रत्येक जनक के दो युग्मक लिखिए और 2 × 2 पनेट वर्ग भरिए।"),
        formula: "P = \\dfrac{\\text{boxes of the group}}{4}",
        solution: aboSol(L, g1, g2, grp, q),
      });
    }
    if (level === 1) {
      const [a, b, ask, q] = r.pick(SICKLE);
      const c = childQ(a, b);
      const what = [["affected ($\\mathrm{Hb^{S}Hb^{S}}$)", "रोगी ($\\mathrm{Hb^{S}Hb^{S}}$)"], ["carriers ($\\mathrm{Hb^{A}Hb^{S}}$)", "वाहक ($\\mathrm{Hb^{A}Hb^{S}}$)"], ["normal and not carriers ($\\mathrm{Hb^{A}Hb^{A}}$)", "सामान्य और अवाहक ($\\mathrm{Hb^{A}Hb^{A}}$)"], ["free of the disease (no symptoms)", "रोग-मुक्त (कोई लक्षण नहीं)"]][ask];
      const mist = [
        [[(c[0] + c[1]) / 4, L("Sickle-cell anaemia is recessive: carriers $\\mathrm{Hb^{A}Hb^{S}}$ are apparently unaffected.", "दात्र-कोशिका अरक्तता अप्रभावी है: वाहक $\\mathrm{Hb^{A}Hb^{S}}$ प्रत्यक्ष रूप से अप्रभावित रहते हैं।")]],
        a === 1 && b === 1
          ? [[c[1] / 8, L("A heterozygote can arise in two ways; count both Punnett boxes.", "विषमयुग्मजी दो तरह से बन सकता है; दोनों पनेट खाने गिनिए।")], [(c[0] + c[1]) / 4, L("$\\mathrm{Hb^{S}Hb^{S}}$ children are patients, not carriers.", "$\\mathrm{Hb^{S}Hb^{S}}$ संतानें रोगी हैं, वाहक नहीं।")]]
          : [[1, L("The carrier parent passes each of its two alleles to only half of the children.", "वाहक जनक अपने दोनों युग्मविकल्पियों में से प्रत्येक केवल आधी संतानों को देता है।")]],
        [[(c[1] + c[2]) / 4, L("Carriers look normal but are $\\mathrm{Hb^{A}Hb^{S}}$, not $\\mathrm{Hb^{A}Hb^{A}}$.", "वाहक सामान्य दिखते हैं पर $\\mathrm{Hb^{A}Hb^{S}}$ हैं, $\\mathrm{Hb^{A}Hb^{A}}$ नहीं।")]],
        [[c[2] / 4, L("Carriers ($\\mathrm{Hb^{A}Hb^{S}}$) also show no symptoms.", "वाहक ($\\mathrm{Hb^{A}Hb^{S}}$) भी कोई लक्षण नहीं दिखाते।")], [c[1] / 4, L("$\\mathrm{Hb^{A}Hb^{A}}$ children are free of the disease as well.", "$\\mathrm{Hb^{A}Hb^{A}}$ संतानें भी रोग-मुक्त हैं।")]],
      ][ask];
      mist.push(q !== 1 ? [1 / 4, L("Several Punnett boxes can give the same class; count them all.", "कई पनेट खाने एक ही वर्ग दे सकते हैं; सभी गिनिए।")] : [1 / 2, L("Each parent must pass the right allele: multiply the two chances.", "प्रत्येक जनक को सही युग्मविकल्पी देना होगा: दोनों प्रायिकताओं का गुणा कीजिए।")]);
      const kids = `${c[2]}\\,${HB(2)} : ${c[1]}\\,${HB(1)} : ${c[0]}\\,${HB(0)}`;
      return task({
        text: L(`Sickle-cell anaemia is an autosomal recessive disorder (alleles $\\mathrm{Hb^{A}}$, $\\mathrm{Hb^{S}}$). The parents are $${HB(a)} \\times ${HB(b)}$. What fraction of their children is expected to be ${what[0]}?`, `दात्र-कोशिका अरक्तता एक अलिंगसूत्री अप्रभावी विकार है (युग्मविकल्पी $\\mathrm{Hb^{A}}$, $\\mathrm{Hb^{S}}$)। जनक $${HB(a)} \\times ${HB(b)}$ हैं। उनकी संतानों का कितना भाग ${what[1]} होने की अपेक्षा है?`),
        answer: fractionM(q, 4, mist),
        data: { given: [`${HB(a)} \\times ${HB(b)}`], find: ["P"] },
        hint: L("Make a 2 × 2 Punnett square; only $\\mathrm{Hb^{S}Hb^{S}}$ shows the disease.", "2 × 2 पनेट वर्ग बनाइए; केवल $\\mathrm{Hb^{S}Hb^{S}}$ में रोग दिखता है।"),
        formula: "P = \\dfrac{\\text{favourable boxes}}{4}",
        solution: L(S(`Offspring (in quarters): $${kids}$`, `$P = ${fracTex(q, 4)}$`), S(`संतानें (चौथाई में): $${kids}$`, `$P = ${fracTex(q, 4)}$`)),
      });
    }
    if (level === 2 && v < 3) {
      const [mo, fa, ask, nu, de, ms] = r.pick(XQ);
      const k = xKids(d, mo, fa);
      const q = fill(L(XASK[ask][0], XASK[ask][1]), L(d.a[0], d.a[1]));
      return task({
        text: L(`In humans, ${d.n[0]} is an X-linked recessive disorder (allele $${d.s}$). ${cap(XWHO[mo][0])} ($${xg(d, mo)}$) marries ${XWHO[fa][0]} ($${xg(d, fa)}$). ${q}`, `मनुष्य में ${d.n[1]} एक X-सहलग्न अप्रभावी विकार है (युग्मविकल्पी $${d.s}$)। ${XWHO[mo][1]} ($${xg(d, mo)}$) का विवाह ${XWHO[fa][1]} ($${xg(d, fa)}$) से होता है। ${q}`),
        answer: fractionM(nu, de, ms.map(([m, key]) => [m, L(XW[key][0], XW[key][1])])),
        data: { given: [`${xg(d, mo)} \\times ${xg(d, fa)}`], find: ["P"] },
        hint: L("Sons get their X from the mother and Y from the father; daughters get one X from each parent.", "पुत्रों को X माता से और Y पिता से मिलता है; पुत्रियों को प्रत्येक जनक से एक X मिलता है।"),
        formula: "P = \\dfrac{\\text{favourable}}{\\text{possible}}",
        solution: L(
          S(`Mother's eggs: $${k.mx.join(",\\ ")}$; father's sperms: $${k.fx},\\ Y$`, `Daughters: $${k.dau.join(",\\ ")}$`, `Sons: $${k.son.join(",\\ ")}$`, `$P = ${fracTex(nu, de)}$`),
          S(`माता के अंड: $${k.mx.join(",\\ ")}$; पिता के शुक्राणु: $${k.fx},\\ Y$`, `पुत्रियाँ: $${k.dau.join(",\\ ")}$`, `पुत्र: $${k.son.join(",\\ ")}$`, `$P = ${fracTex(nu, de)}$`),
        ),
      });
    }
    if (level === 2) {
      const [fi, grp, q] = r.pick(ABO_FAM_Q);
      const [gm, dm, gw, dw] = ABO_FAM[fi];
      const qh = aboQ(homOf(gm), homOf(gw), grp);
      const mist = [];
      if (qh !== q) mist.push([qh / 4, L("A parent of group O passes on $i$, so a group A or B person with a group O parent is heterozygous.", "वर्ग O का जनक $i$ देता है, अतः जिस वर्ग A या B वाले का एक जनक वर्ग O हो, वह विषमयुग्मजी है।")]);
      mist.push(...aboMist(L, gm, gw, grp, q));
      return task({
        text: L(`${ABO_INTRO[0]} ${man[0]} is ${dm[0]}. He marries ${wom[0]}, who is ${dw[0]}. What is the probability that their child has blood group ${grp}?`, `${ABO_INTRO[1]} ${man[1]} ${dm[1]}। उसका विवाह ${wom[1]} से होता है, जो ${dw[1]}। उनकी संतान का रुधिर वर्ग ${grp} होने की प्रायिकता क्या है?`),
        answer: fractionM(q, 4, mist),
        data: { given: [`${tx(man[0])}: ${tx(L(dm[0], dm[1]))}`, `${tx(wom[0])}: ${tx(L(dw[0], dw[1]))}`], find: [`P(${grp})`] },
        hint: L("First find each parent's genotype from the family information.", "पहले परिवार की जानकारी से प्रत्येक जनक का जीनप्ररूप ज्ञात कीजिए।"),
        formula: "P = \\dfrac{\\text{boxes of the group}}{4}",
        solution: L(`${man[0]}: $${gTex(gm)}$, ${wom[0]}: $${gTex(gw)}$`, `${man[1]}: $${gTex(gm)}$, ${wom[1]}: $${gTex(gw)}$`) + "\n" + aboSol(L, gm, gw, grp, q),
      });
    }
    // Raven 3: pasti in večstopenjsko sklepanje
    const c = r.int(0, 10);
    const A = L(d.a[0], d.a[1]);
    const Dn = d.s.toUpperCase();
    const mW = [`$${xg(d, "C")}$`, `$${xg(d, "m")}$`, `$${xg(d, "M")}$`];
    const sonsX = `X^{${Dn}}Y,\\ X^{${d.s}}Y`;
    const mk = (o) => task({ formula: "P = P_1 \\cdot P_2", ...o });
    if (c <= 2 || c === 10) {
      const hub = c === 1 ? "M" : "m";
      const intro = [`${wom[0]} is normal, but her father was ${d.a[0]} (${d.n[0]} is X-linked recessive). She marries ${man[0]}, who is ${hub === "M" ? d.a[0] : "normal"}.`, `${wom[1]} सामान्य है, पर उसके पिता ${d.a[1]} थे (${d.n[1]} X-सहलग्न अप्रभावी है)। उसका विवाह ${man[1]} से होता है, जो ${hub === "M" ? d.a[1] : "सामान्य"} है।`];
      const Q = [
        [`If their child is a son, what is the probability that he is ${d.a[0]}?`, `यदि उनकी संतान पुत्र है, तो उसके ${A} होने की प्रायिकता क्या है?`, 1, 2, [[0, L("Her father gave her his recessive X, so she is a carrier.", "उसके पिता ने उसे अपना अप्रभावी X दिया, अतः वह वाहक है।")], [1 / 4, L(XW.allCh[0], XW.allCh[1])]]],
        [`If their child is a daughter, what is the probability that she is ${d.a[0]}?`, `यदि उनकी संतान पुत्री है, तो उसके ${A} होने की प्रायिकता क्या है?`, 1, 2, [[0, L("She is a carrier, and the husband gives his recessive X to every daughter.", "वह वाहक है, और पति हर पुत्री को अपना अप्रभावी X देता है।")], [1 / 4, L(XW.allChD[0], XW.allChD[1])], [1, L("The daughter may get the mother's normal X instead.", "पुत्री को माता का सामान्य X भी मिल सकता है।")]]],
        [`They have two sons. What is the probability that both sons are ${d.a[0]}?`, `उनके दो पुत्र हैं। दोनों पुत्रों के ${A} होने की प्रायिकता क्या है?`, 1, 4, [[1 / 2, L("The two sons are independent: multiply the probability for each son.", "दोनों पुत्र स्वतंत्र हैं: प्रत्येक पुत्र की प्रायिकता का गुणा कीजिए।")], [1 / 16, L("They are known to be sons, so each has probability 1/2, not 1/4.", "वे पुत्र ही हैं, अतः प्रत्येक की प्रायिकता 1/2 है, 1/4 नहीं।")]]],
      ];
      const qi = c === 10 ? 0 : c;
      const [qe, qh, nu, de, ms] = Q[qi];
      const extra = c === 10;
      const nu2 = extra ? 1 : nu;
      const de2 = extra ? 16 : de;
      const ms2 = extra ? [[1 / 4, L("There are two children: multiply the probability for each child.", "दो संतानें हैं: प्रत्येक संतान की प्रायिकता का गुणा कीजिए।")], [1 / 8, L("Each child must be a son (1/2) and affected (1/2): 1/4 per child.", "प्रत्येक संतान को पुत्र (1/2) और प्रभावित (1/2) होना है: प्रति संतान 1/4।")], [0, L(XW.canPass[0], XW.canPass[1])]] : ms;
      return mk({
        text: extra ? L(`${intro[0]} They plan two children. What is the probability that both are ${d.a[0]} sons?`, `${intro[1]} वे दो संतानों की योजना बनाते हैं। दोनों के ${A} पुत्र होने की प्रायिकता क्या है?`) : L(`${intro[0]} ${qe}`, `${intro[1]} ${qh}`),
        answer: fractionM(nu2, de2, ms2),
        data: { given: [`${tx(wom[0])}: ${xg(d, "C")}`, `${tx(man[0])}: ${xg(d, hub)}`], find: ["P"] },
        hint: L(`First decide ${wom[0]}'s genotype from her father.`, `पहले उसके पिता से ${wom[1]} का जीनप्ररूप तय कीजिए।`),
        solution: L(
          S(`${wom[0]} got $X^{${d.s}}$ from her father: ${mW[0]} (carrier).`, `Sons: $${sonsX}$; daughters: $${xKids(d, "C", hub).dau.join(",\\ ")}$`, extra ? "Per child: $P(\\text{affected son}) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$; two children: $\\tfrac{1}{4} \\cdot \\tfrac{1}{4} = \\tfrac{1}{16}$" : qi === 2 ? "Per son 1/2; two sons: $\\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$" : `$P = ${fracTex(nu, de)}$`),
          S(`${wom[1]} को पिता से $X^{${d.s}}$ मिला: ${mW[0]} (वाहक)।`, `पुत्र: $${sonsX}$; पुत्रियाँ: $${xKids(d, "C", hub).dau.join(",\\ ")}$`, extra ? "प्रति संतान: $P(\\text{प्रभावित पुत्र}) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$; दो संतानें: $\\tfrac{1}{4} \\cdot \\tfrac{1}{4} = \\tfrac{1}{16}$" : qi === 2 ? "प्रति पुत्र 1/2; दो पुत्र: $\\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$" : `$P = ${fracTex(nu, de)}$`),
        ),
      });
    }
    if (c === 3 || c === 9) {
      const son = c === 9;
      return mk({
        text: L(`${man[0]} is ${d.a[0]} and his wife is normal and not a carrier (${d.n[0]} is X-linked recessive). Their daughter ${wom[0]} marries a normal man. ${son ? `If ${wom[0]}'s child is a son, what is the probability that he is ${d.a[0]}?` : `What is the probability that ${wom[0]}'s child is a ${d.a[0]} son?`}`, `${man[1]} ${A} है और उसकी पत्नी सामान्य है तथा वाहक नहीं (${d.n[1]} X-सहलग्न अप्रभावी है)। उनकी पुत्री ${wom[1]} का विवाह एक सामान्य पुरुष से होता है। ${son ? `यदि ${wom[1]} की संतान पुत्र है, तो उसके ${A} होने की प्रायिकता क्या है?` : `${wom[1]} की संतान के ${A} पुत्र होने की प्रायिकता क्या है?`}`),
        answer: son ? fractionM(1, 2, [[0, L("Every daughter of an affected man gets his recessive X: she is a carrier.", "प्रभावित पुरुष की हर पुत्री को उसका अप्रभावी X मिलता है: वह वाहक है।")], [1, L("The daughter is a carrier, not affected; she passes the recessive X to half her sons.", "पुत्री वाहक है, प्रभावित नहीं; वह अप्रभावी X आधे पुत्रों को देती है।")], [1 / 4, L(XW.allCh[0], XW.allCh[1])]]) : fractionM(1, 4, [[1 / 2, L(XW.sonsOnly[0], XW.sonsOnly[1])], [0, L("Every daughter of an affected man gets his recessive X: she is a carrier.", "प्रभावित पुरुष की हर पुत्री को उसका अप्रभावी X मिलता है: वह वाहक है।")], [1 / 8, L("The daughter is certainly a carrier; do not multiply by 1/2 for that.", "पुत्री निश्चित रूप से वाहक है; उसके लिए 1/2 से गुणा मत कीजिए।")]]),
        data: { given: [`${tx(man[0])}: ${xg(d, "M")}`, `${tx(L("wife", "पत्नी"))}: ${xg(d, "N")}`], find: ["P"] },
        hint: L(`Find ${wom[0]}'s genotype first: which X did she get from her father?`, `पहले ${wom[1]} का जीनप्ररूप ज्ञात कीजिए: उसे पिता से कौन-सा X मिला?`),
        solution: L(
          S(`${wom[0]}: $X^{${Dn}}$ from mother, $X^{${d.s}}$ from father → ${mW[0]} (carrier).`, `Her sons: $${sonsX}$ → half affected.`, son ? "$P = \\tfrac{1}{2}$" : "$P = \\tfrac{1}{2}\\,(\\text{son}) \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$"),
          S(`${wom[1]}: माता से $X^{${Dn}}$, पिता से $X^{${d.s}}$ → ${mW[0]} (वाहक)।`, `उसके पुत्र: $${sonsX}$ → आधे प्रभावित।`, son ? "$P = \\tfrac{1}{2}$" : "$P = \\tfrac{1}{2}\\,(\\text{पुत्र}) \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$"),
        ),
      });
    }
    if (c === 4 || c === 5) {
      const girl = c === 4;
      if (girl) {
        return mk({
          text: L(`${ABO_INTRO[0]} ${man[0]} is group A and his mother is group O. ${wom[0]} is group B and her father is group O. They marry. What is the probability that their first child is a girl with blood group O?`, `${ABO_INTRO[1]} ${man[1]} वर्ग A का है और उसकी माता वर्ग O की है। ${wom[1]} वर्ग B की है और उसके पिता वर्ग O के हैं। दोनों का विवाह होता है। उनकी पहली संतान के वर्ग O वाली पुत्री होने की प्रायिकता क्या है?`),
          answer: fractionM(1, 8, [[1 / 4, L("Also multiply by 1/2 for the child being a girl.", "संतान के पुत्री होने के लिए 1/2 से भी गुणा कीजिए।")], [0, L("Both parents carry $i$, because each has a group O parent.", "दोनों जनकों में $i$ है, क्योंकि प्रत्येक का एक जनक वर्ग O का है।")], [1 / 16, L("The probability of a girl is 1/2, not 1/4.", "पुत्री होने की प्रायिकता 1/2 है, 1/4 नहीं।")]]),
          data: { given: [`${tx(man[0])}: A`, `${tx(wom[0])}: B`], find: [`P(${tx(L("girl", "पुत्री"))},\\ O)`] },
          hint: L("Find both genotypes from the group O parents, then multiply P(O) by P(girl).", "वर्ग O वाले जनकों से दोनों जीनप्ररूप ज्ञात कीजिए, फिर P(O) को P(पुत्री) से गुणा कीजिए।"),
          solution: L(S(`${man[0]}: $I^{A}i$, ${wom[0]}: $I^{B}i$`, "$P(ii) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$", "$P = \\tfrac{1}{4} \\cdot \\tfrac{1}{2} = \\tfrac{1}{8}$"), S(`${man[1]}: $I^{A}i$, ${wom[1]}: $I^{B}i$`, "$P(ii) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$", "$P = \\tfrac{1}{4} \\cdot \\tfrac{1}{2} = \\tfrac{1}{8}$")),
        });
      }
      return mk({
        text: L(`${ABO_INTRO[0]} ${man[0]} is group A; both his parents are group A and his sister is group O. He marries ${wom[0]}, who is group O. What is the probability that their child is group O?`, `${ABO_INTRO[1]} ${man[1]} वर्ग A का है; उसके माता-पिता दोनों वर्ग A के हैं और उसकी बहन वर्ग O की है। उसका विवाह वर्ग O वाली ${wom[1]} से होता है। उनकी संतान के वर्ग O होने की प्रायिकता क्या है?`),
        answer: fractionM(1, 3, [[1 / 2, L(`${man[0]} could also be $I^{A}I^{A}$; he is $I^{A}i$ only with probability 2/3.`, `${man[1]} $I^{A}I^{A}$ भी हो सकता है; वह केवल 2/3 प्रायिकता से $I^{A}i$ है।`)], [1 / 4, L(`${wom[0]} ($ii$) always gives $i$; only ${man[0]}'s allele is uncertain.`, `${wom[1]} ($ii$) सदा $i$ देती है; केवल ${man[1]} का युग्मविकल्पी अनिश्चित है।`)], [2 / 3, L("Even an $I^{A}i$ father passes $i$ to only half of his children.", "$I^{A}i$ पिता भी $i$ केवल आधी संतानों को देता है।")]]),
        data: { given: [`${tx(L("parents", "माता-पिता"))}: I^{A}i \\times I^{A}i`, `${tx(wom[0])}: ii`], find: ["P(O)"] },
        hint: L(`A group O sister means both parents are $I^{A}i$. Among their group A children, how many are $I^{A}i$?`, "वर्ग O बहन का अर्थ है कि माता-पिता दोनों $I^{A}i$ हैं। उनकी वर्ग A संतानों में कितनी $I^{A}i$ हैं?"),
        solution: L(
          S("Parents $I^{A}i \\times I^{A}i$ → $1\\,I^{A}I^{A} : 2\\,I^{A}i : 1\\,ii$", `${man[0]} is group A: $P(I^{A}i) = \\tfrac{2}{3}$`, "$P(O) = \\tfrac{2}{3} \\cdot \\tfrac{1}{2} = \\tfrac{1}{3}$"),
          S("माता-पिता $I^{A}i \\times I^{A}i$ → $1\\,I^{A}I^{A} : 2\\,I^{A}i : 1\\,ii$", `${man[1]} वर्ग A का है: $P(I^{A}i) = \\tfrac{2}{3}$`, "$P(O) = \\tfrac{2}{3} \\cdot \\tfrac{1}{2} = \\tfrac{1}{3}$"),
        ),
      });
    }
    // srpastocelična anemija, sklepanje
    const scI = ["Sickle-cell anaemia is autosomal recessive.", "दात्र-कोशिका अरक्तता अलिंगसूत्री अप्रभावी है।"];
    if (c === 6) {
      return mk({
        text: L(`${scI[0]} ${man[0]} is normal, as are his parents, but his brother has sickle-cell anaemia. ${man[0]} marries ${wom[0]}, a carrier ($\\mathrm{Hb^{A}Hb^{S}}$). What is the probability that their first child has the disease?`, `${scI[1]} ${man[1]} और उसके माता-पिता सामान्य हैं, पर उसके भाई को दात्र-कोशिका अरक्तता है। ${man[1]} का विवाह वाहक ($\\mathrm{Hb^{A}Hb^{S}}$) ${wom[1]} से होता है। उनकी पहली संतान के रोगी होने की प्रायिकता क्या है?`),
        answer: fractionM(1, 6, [[1 / 4, L(`${man[0]} is a carrier only with probability 2/3, not for certain.`, `${man[1]} केवल 2/3 प्रायिकता से वाहक है, निश्चित रूप से नहीं।`)], [1 / 8, L("Among the normal children of two carriers, 2/3 (not 1/2) are carriers.", "दो वाहकों की सामान्य संतानों में 2/3 (1/2 नहीं) वाहक होती हैं।")], [2 / 3, L("Multiply by 1/4 for a carrier × carrier child being $\\mathrm{Hb^{S}Hb^{S}}$.", "वाहक × वाहक की संतान के $\\mathrm{Hb^{S}Hb^{S}}$ होने के लिए 1/4 से भी गुणा कीजिए।")]]),
        data: { given: [`${tx(L("parents", "माता-पिता"))}: ${HB(1)} \\times ${HB(1)}`, `${tx(wom[0])}: ${HB(1)}`], find: ["P(\\mathrm{Hb^{S}Hb^{S}})"] },
        hint: L(`An affected brother means both parents are carriers. Then use the fact that ${man[0]} himself is normal.`, `रोगी भाई का अर्थ है कि माता-पिता दोनों वाहक हैं। फिर इस तथ्य का उपयोग कीजिए कि ${man[1]} स्वयं सामान्य है।`),
        solution: L(
          S("Parents: $\\mathrm{Hb^{A}Hb^{S}} \\times \\mathrm{Hb^{A}Hb^{S}}$ → 1 : 2 : 1", `${man[0]} is normal: $P(\\text{carrier}) = \\tfrac{2}{3}$`, "Carrier × carrier gives $\\tfrac{1}{4}$ affected", "$P = \\tfrac{2}{3} \\cdot \\tfrac{1}{4} = \\tfrac{1}{6}$"),
          S("माता-पिता: $\\mathrm{Hb^{A}Hb^{S}} \\times \\mathrm{Hb^{A}Hb^{S}}$ → 1 : 2 : 1", `${man[1]} सामान्य है: $P(\\text{वाहक}) = \\tfrac{2}{3}$`, "वाहक × वाहक से $\\tfrac{1}{4}$ रोगी", "$P = \\tfrac{2}{3} \\cdot \\tfrac{1}{4} = \\tfrac{1}{6}$"),
        ),
      });
    }
    if (c === 7) {
      return mk({
        text: L(`${scI[0]} Two normal parents have a child with sickle-cell anaemia. Their next child, ${wom[0]}, is normal. What is the probability that ${wom[0]} is a carrier?`, `${scI[1]} दो सामान्य जनकों की एक संतान को दात्र-कोशिका अरक्तता है। उनकी अगली संतान ${wom[1]} सामान्य है। ${wom[1]} के वाहक होने की प्रायिकता क्या है?`),
        answer: fractionM(2, 3, [[1 / 2, L(`${wom[0]} is known to be normal: count only the normal classes, 1 $\\mathrm{Hb^{A}Hb^{A}}$ : 2 $\\mathrm{Hb^{A}Hb^{S}}$.`, `${wom[1]} सामान्य ज्ञात है: केवल सामान्य वर्ग गिनिए, 1 $\\mathrm{Hb^{A}Hb^{A}}$ : 2 $\\mathrm{Hb^{A}Hb^{S}}$।`)], [1 / 3, L("That is the probability that she is $\\mathrm{Hb^{A}Hb^{A}}$.", "यह उसके $\\mathrm{Hb^{A}Hb^{A}}$ होने की प्रायिकता है।")], [3 / 4, L("3/4 is the fraction of normal children, not of carriers among them.", "3/4 सामान्य संतानों का भाग है, उनमें वाहकों का नहीं।")]]),
        data: { given: [`${tx(L("parents normal, one child affected", "जनक सामान्य, एक संतान रोगी"))}`], find: [`P(${tx(L("carrier | normal", "वाहक | सामान्य"))})`] },
        hint: L("Decide the parents' genotypes; then consider only the normal children.", "जनकों के जीनप्ररूप तय कीजिए; फिर केवल सामान्य संतानों पर विचार कीजिए।"),
        formula: "P = \\dfrac{P(\\mathrm{Hb^{A}Hb^{S}})}{P(\\text{normal})}",
        solution: L(
          S("Both parents are carriers: $\\mathrm{Hb^{A}Hb^{S}} \\times \\mathrm{Hb^{A}Hb^{S}}$", "Normal children: $\\tfrac{1}{4}\\,\\mathrm{Hb^{A}Hb^{A}} + \\tfrac{2}{4}\\,\\mathrm{Hb^{A}Hb^{S}} = \\tfrac{3}{4}$", "$P = \\dfrac{2/4}{3/4} = \\tfrac{2}{3}$"),
          S("दोनों जनक वाहक हैं: $\\mathrm{Hb^{A}Hb^{S}} \\times \\mathrm{Hb^{A}Hb^{S}}$", "सामान्य संतानें: $\\tfrac{1}{4}\\,\\mathrm{Hb^{A}Hb^{A}} + \\tfrac{2}{4}\\,\\mathrm{Hb^{A}Hb^{S}} = \\tfrac{3}{4}$", "$P = \\dfrac{2/4}{3/4} = \\tfrac{2}{3}$"),
        ),
      });
    }
    return mk({
      text: L(`${scI[0]} ${man[0]} and ${wom[0]} are both normal, but their first two children have sickle-cell anaemia. What is the probability that their third child also has the disease?`, `${scI[1]} ${man[1]} और ${wom[1]} दोनों सामान्य हैं, पर उनकी पहली दो संतानों को दात्र-कोशिका अरक्तता है। उनकी तीसरी संतान को भी यह रोग होने की प्रायिकता क्या है?`),
      answer: fractionM(1, 4, [[1 / 64, L("Each birth is independent; earlier children do not change the chance.", "प्रत्येक जन्म स्वतंत्र है; पहले की संतानें प्रायिकता नहीं बदलतीं।")], [1 / 2, L("Normal parents of an affected child are both carriers; carrier × carrier gives 1/4 affected.", "रोगी संतान के सामान्य जनक दोनों वाहक हैं; वाहक × वाहक से 1/4 रोगी।")], [3 / 4, L("That is the probability of a normal child.", "यह सामान्य संतान की प्रायिकता है।")]]),
      data: { given: [`${tx(L("parents normal, 2 children affected", "जनक सामान्य, 2 संतानें रोगी"))}`], find: ["P(\\mathrm{Hb^{S}Hb^{S}})"] },
      hint: L("What must the parents' genotypes be? Do earlier births affect the next one?", "जनकों के जीनप्ररूप क्या होने चाहिए? क्या पहले के जन्म अगले को प्रभावित करते हैं?"),
      formula: "P = \\tfrac{1}{2} \\cdot \\tfrac{1}{2}",
      solution: L(
        S("Normal parents with affected children: both $\\mathrm{Hb^{A}Hb^{S}}$", "Each child independently: $P(\\mathrm{Hb^{S}Hb^{S}}) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$"),
        S("रोगी संतानों वाले सामान्य जनक: दोनों $\\mathrm{Hb^{A}Hb^{S}}$", "प्रत्येक संतान स्वतंत्र रूप से: $P(\\mathrm{Hb^{S}Hb^{S}}) = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$"),
      ),
    });
  },
};

// ---------------------------------------------------------------------------------------------
// Molekularna osnova dedovanja: Chargaff, dolžina DNA, vodikove vezi, kodoni, Meselson–Stahl.
// ---------------------------------------------------------------------------------------------
const BASE = { A: ["adenine", "ऐडेनीन"], T: ["thymine", "थाइमीन"], G: ["guanine", "ग्वानीन"], C: ["cytosine", "साइटोसीन"] };
const COMP = { A: "T", T: "A", G: "C", C: "G" };
const sci = (x) => {
  const e = Math.floor(Math.log10(x));
  const m = Number((x / 10 ** e).toFixed(6));
  return e === 0 ? en(m) : m === 1 ? `10^{${e}}` : `${en(m)} \\times 10^{${e}}`;
};
const MOLECULAR_CALC = {
  id: "exi-bio-molecular-calc",
  topics: [T("molecular-basis-of-inheritance")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, level === 1 ? 3 : 4);
    if (level === 1 && v === 0) {
      const X = r.pick(["A", "T", "G", "C"]);
      let p = r.int(12, 37);
      if (p === 25) p = 31;
      const Y = r.pick(X === "A" || X === "T" ? ["G", "C"] : ["A", "T"]);
      const ans = 50 - p;
      return task({
        text: L(`In a double-stranded DNA molecule, ${BASE[X][0]} makes up ${p}% of the bases. What percentage of the bases is ${BASE[Y][0]}?`, `एक द्विरज्जुकी DNA अणु में ${BASE[X][1]} क्षारों का ${p}% है। ${BASE[Y][1]} क्षारों का कितना प्रतिशत है?`),
        answer: numM(ans, 0, [[p, L(`${BASE[X][0]} pairs with ${BASE[COMP[X]][0]}, not with ${BASE[Y][0]}.`, `${BASE[X][1]} का युग्म ${BASE[COMP[X]][1]} से बनता है, ${BASE[Y][1]} से नहीं।`)], [100 - p, L(`Both $${X}$ and $${COMP[X]}$ are ${p}% each; subtract both.`, `$${X}$ और $${COMP[X]}$ दोनों ${p}% हैं; दोनों घटाइए।`)], [100 - 2 * p, L(`That is $${Y} + ${COMP[Y]}$ together; halve it.`, `यह $${Y} + ${COMP[Y]}$ मिलाकर है; इसे आधा कीजिए।`)]]),
        data: { given: [`${X} = ${p}\\%`], find: [`${Y}\\ (\\%)`] },
        hint: L("Chargaff's rule: in dsDNA, A = T and G = C.", "शारगॉफ का नियम: द्विरज्जुकी DNA में A = T और G = C।"),
        formula: "A + T + G + C = 100\\%,\\ A = T,\\ G = C",
        solution: L(S(`$${COMP[X]} = ${X} = ${p}\\%$`, `$${Y} + ${COMP[Y]} = 100 - 2 \\cdot ${p} = ${100 - 2 * p}\\%$`, `$${Y} = ${100 - 2 * p}/2 = ${ans}\\%$`), S(`$${COMP[X]} = ${X} = ${p}\\%$`, `$${Y} + ${COMP[Y]} = 100 - 2 \\cdot ${p} = ${100 - 2 * p}\\%$`, `$${Y} = ${100 - 2 * p}/2 = ${ans}\\%$`)),
      });
    }
    if (level === 1 && v === 1) {
      const bp = r.pick([50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]);
      const len = bp * 0.34;
      return task({
        text: L(`A B-DNA segment has ${bp} base pairs. What is its length in nm? (Distance between adjacent base pairs = 0.34 nm.)${roundToL(2, lang)}`, `एक B-DNA खंड में ${bp} क्षार युग्म हैं। इसकी लंबाई nm में कितनी है? (दो क्रमागत क्षार युग्मों के बीच की दूरी = 0.34 nm)${roundToL(2, lang)}`),
        answer: numM(len, 2, [[bp * 3.4, L("3.4 nm is the pitch (one full turn of 10 bp), not the distance per base pair.", "3.4 nm पिच है (10 bp का एक पूरा घुमाव), प्रति क्षार युग्म दूरी नहीं।")], [bp * 0.68, L("Length depends on base pairs, not on the nucleotides of both strands.", "लंबाई क्षार युग्मों पर निर्भर है, दोनों रज्जुकों के न्यूक्लियोटाइडों पर नहीं।")], [bp / 0.34, L("Multiply by the spacing; do not divide.", "दूरी से गुणा कीजिए; भाग नहीं।")]]),
        data: { given: [`n = ${bp}\\ \\mathrm{bp}`, "d = 0.34\\ \\mathrm{nm}"], find: ["l\\ (\\mathrm{nm})"] },
        hint: L("Each base pair adds 0.34 nm to the length of the helix.", "प्रत्येक क्षार युग्म कुंडली की लंबाई में 0.34 nm जोड़ता है।"),
        formula: "l = n \\cdot 0.34\\ \\mathrm{nm}",
        solution: L(S(`$l = ${bp} \\cdot 0.34$`, `$l = ${en(len, 2)}\\ \\mathrm{nm}$`), S(`$l = ${bp} \\cdot 0.34$`, `$l = ${en(len, 2)}\\ \\mathrm{nm}$`)),
      });
    }
    if (level === 1 && v === 2) {
      const k = r.int(20, 400);
      const nt = 3 * k + 3;
      return task({
        text: L(`The coding region of an mRNA, from the start codon AUG up to and including the stop codon, has ${nt} nucleotides. How many amino acids does the polypeptide have?`, `एक mRNA के कोडन क्षेत्र में, प्रारंभन कोडॉन AUG से समापन कोडॉन तक (उसे मिलाकर), ${nt} न्यूक्लियोटाइड हैं। पॉलिपेप्टाइड में कितने ऐमीनो अम्ल होंगे?`),
        answer: numM(k, 0, [[k + 1, L("The stop codon does not code for any amino acid.", "समापन कोडॉन किसी ऐमीनो अम्ल का कोड नहीं देता।")], [k - 1, L("AUG is not only a start signal: it codes for methionine, the first amino acid.", "AUG केवल प्रारंभ संकेत नहीं है: यह पहले ऐमीनो अम्ल मेथियोनीन का कोड देता है।")], [nt, L("A codon is a triplet: three nucleotides per amino acid.", "कोडॉन त्रिक है: प्रति ऐमीनो अम्ल तीन न्यूक्लियोटाइड।")]]),
        data: { given: [`n = ${nt}`], find: [`N_{${tx(L("amino acids", "ऐमीनो अम्ल"))}}`] },
        hint: L("Count codons first; then decide which codon gives no amino acid.", "पहले कोडॉन गिनिए; फिर तय कीजिए कि कौन-सा कोडॉन कोई ऐमीनो अम्ल नहीं देता।"),
        formula: "N = \\dfrac{n}{3} - 1",
        solution: L(S(`Codons: $${nt}/3 = ${k + 1}$`, `The stop codon codes for no amino acid: $N = ${k + 1} - 1 = ${k}$`), S(`कोडॉन: $${nt}/3 = ${k + 1}$`, `समापन कोडॉन कोई ऐमीनो अम्ल नहीं देता: $N = ${k + 1} - 1 = ${k}$`)),
      });
    }
    if (level === 1) {
      const bp = 10 * r.int(5, 300);
      return task({
        text: L(`A B-DNA molecule has ${bp} base pairs. How many complete turns of the helix does it have? (One turn has about 10 bp.)`, `एक B-DNA अणु में ${bp} क्षार युग्म हैं। कुंडली में कितने पूरे घुमाव हैं? (एक घुमाव में लगभग 10 bp होते हैं)`),
        answer: numM(bp / 10, 0, [[bp / 20, L("10 is base pairs per turn, not nucleotides per turn.", "10 प्रति घुमाव क्षार युग्म हैं, न्यूक्लियोटाइड नहीं।")], [bp * 0.34, L("That is the length in nm, not the number of turns.", "यह nm में लंबाई है, घुमावों की संख्या नहीं।")], [bp * 10, L("Divide by 10 bp per turn; do not multiply.", "प्रति घुमाव 10 bp से भाग दीजिए; गुणा नहीं।")]]),
        data: { given: [`n = ${bp}\\ \\mathrm{bp}`], find: [`N_{${tx(L("turns", "घुमाव"))}}`] },
        hint: L("Divide the base pairs by the base pairs in one turn.", "क्षार युग्मों को एक घुमाव के क्षार युग्मों से भाग दीजिए।"),
        formula: "N = \\dfrac{n}{10}",
        solution: L(S(`$N = ${bp}/10$`, `$N = ${bp / 10}$`), S(`$N = ${bp}/10$`, `$N = ${bp / 10}$`)),
      });
    }
    if (level === 2 && v === 0) {
      const N = 100 * r.int(5, 40);
      const a = 10 * r.int(Math.ceil(N / 70), Math.floor((N * 0.4) / 10));
      const ask = r.int(0, 1); // 0 G, 1 vsi purini
      const g = N - a;
      if (ask === 0) {
        return task({
          text: L(`A double-stranded DNA molecule has ${N} base pairs and ${a} adenine nucleotides. How many guanine nucleotides does it have?`, `एक द्विरज्जुकी DNA अणु में ${N} क्षार युग्म और ${a} ऐडेनीन न्यूक्लियोटाइड हैं। इसमें कितने ग्वानीन न्यूक्लियोटाइड हैं?`),
          answer: numM(g, 0, [[2 * g, L("That is G + C together; G is half of it.", "यह G + C मिलाकर है; G इसका आधा है।")], [N / 2 - a, L(`The molecule has ${2 * N} nucleotides (two per base pair), not ${N}.`, `अणु में ${2 * N} न्यूक्लियोटाइड हैं (प्रति क्षार युग्म दो), ${N} नहीं।`)], [a, L("Guanine pairs with cytosine, not with adenine.", "ग्वानीन का युग्म साइटोसीन से बनता है, ऐडेनीन से नहीं।")]]),
          data: { given: [`n = ${N}\\ \\mathrm{bp}`, `A = ${a}`], find: ["G"] },
          hint: L("Find the total number of nucleotides; then use A = T and G = C.", "कुल न्यूक्लियोटाइड ज्ञात कीजिए; फिर A = T और G = C लगाइए।"),
          formula: "G = \\dfrac{2n - 2A}{2} = n - A",
          solution: L(S(`Nucleotides: $2 \\cdot ${N} = ${2 * N}$; $A = T = ${a}$`, `$G + C = ${2 * N} - ${2 * a} = ${2 * g}$`, `$G = ${g}$`), S(`न्यूक्लियोटाइड: $2 \\cdot ${N} = ${2 * N}$; $A = T = ${a}$`, `$G + C = ${2 * N} - ${2 * a} = ${2 * g}$`, `$G = ${g}$`)),
        });
      }
      return task({
        text: L(`A double-stranded DNA molecule has ${N} base pairs and ${a} adenine nucleotides. How many purine nucleotides (A + G) does it have?`, `एक द्विरज्जुकी DNA अणु में ${N} क्षार युग्म और ${a} ऐडेनीन न्यूक्लियोटाइड हैं। इसमें कितने प्यूरीन न्यूक्लियोटाइड (A + G) हैं?`),
        answer: numM(N, 0, [[2 * N, L("That counts all nucleotides; purines are exactly half of them.", "यह सभी न्यूक्लियोटाइड हैं; प्यूरीन ठीक इनके आधे हैं।")], [a + g / 2, L(`G = C = ${g}, not ${g / 2}: there are ${2 * N} nucleotides in all.`, `G = C = ${g}, ${g / 2} नहीं: कुल ${2 * N} न्यूक्लियोटाइड हैं।`)], [2 * a, L("Purines are A and G (adenine and guanine), not A and T.", "प्यूरीन A और G (ऐडेनीन और ग्वानीन) हैं, A और T नहीं।")]]),
        data: { given: [`n = ${N}\\ \\mathrm{bp}`, `A = ${a}`], find: ["A + G"] },
        hint: L("Every base pair has exactly one purine and one pyrimidine.", "हर क्षार युग्म में ठीक एक प्यूरीन और एक पिरिमिडीन होता है।"),
        formula: "A + G = T + C = n",
        solution: L(S(`$A = ${a}$, $G = ${N} - ${a} = ${g}$`, `$A + G = ${a} + ${g} = ${N}$`), S(`$A = ${a}$, $G = ${N} - ${a} = ${g}$`, `$A + G = ${a} + ${g} = ${N}$`)),
      });
    }
    if (level === 2 && v === 1) {
      const N = 10 * r.int(10, 150);
      const c = 5 * r.int(Math.ceil(N / 20), Math.floor((N * 0.8) / 5));
      const H = 2 * (N - c) + 3 * c;
      return task({
        text: L(`A DNA segment has ${N} base pairs and contains ${c} cytosine nucleotides. How many hydrogen bonds hold its two strands together?`, `एक DNA खंड में ${N} क्षार युग्म हैं और ${c} साइटोसीन न्यूक्लियोटाइड हैं। इसके दोनों रज्जुकों को कितने हाइड्रोजन आबंध जोड़े रखते हैं?`),
        answer: numM(H, 0, [[3 * (N - c) + 2 * c, L("A=T pairs have two hydrogen bonds and G≡C pairs three; you swapped them.", "A=T युग्म में दो और G≡C युग्म में तीन हाइड्रोजन आबंध होते हैं; आपने इन्हें उलट दिया।")], [2 * (N - c) + 6 * c, L("Each cytosine is in one G≡C pair; do not count G and C as separate pairs.", "प्रत्येक साइटोसीन एक G≡C युग्म में है; G और C को अलग युग्म मत गिनिए।")], [2 * N, L("G≡C pairs have three hydrogen bonds, not two.", "G≡C युग्मों में तीन हाइड्रोजन आबंध होते हैं, दो नहीं।")]]),
        data: { given: [`n = ${N}\\ \\mathrm{bp}`, `C = ${c}`], find: ["N_H"] },
        hint: L("Find the number of G≡C and A=T pairs first.", "पहले G≡C और A=T युग्मों की संख्या ज्ञात कीजिए।"),
        formula: "N_H = 2\\,n_{AT} + 3\\,n_{GC}",
        solution: L(S(`G≡C pairs: ${c}; A=T pairs: $${N} - ${c} = ${N - c}$`, `$N_H = 2 \\cdot ${N - c} + 3 \\cdot ${c} = ${H}$`), S(`G≡C युग्म: ${c}; A=T युग्म: $${N} - ${c} = ${N - c}$`, `$N_H = 2 \\cdot ${N - c} + 3 \\cdot ${c} = ${H}$`)),
      });
    }
    if (level === 2 && v === 2) {
      const bp = 1000 * r.int(10, 90);
      const um = (bp * 0.34) / 1000;
      return task({
        text: L(`A viral DNA has ${bp} base pairs. Find its length in μm (0.34 nm per base pair).${roundToL(2, lang)}`, `एक विषाणु DNA में ${bp} क्षार युग्म हैं। इसकी लंबाई μm में ज्ञात कीजिए (प्रति क्षार युग्म 0.34 nm)।${roundToL(2, lang)}`),
        answer: numM(um, 2, [[um * 10, L("3.4 nm is the pitch of one turn, not the spacing of base pairs.", "3.4 nm एक घुमाव की पिच है, क्षार युग्मों की दूरी नहीं।")], [um * 1000, L("That is in nm: 1 μm = 1000 nm.", "यह nm में है: 1 μm = 1000 nm।")], [um / 1000, L("Divide nm by 1000 only once to get μm.", "μm के लिए nm को केवल एक बार 1000 से भाग दीजिए।")]]),
        data: { given: [`n = ${bp}\\ \\mathrm{bp}`, "d = 0.34\\ \\mathrm{nm}"], find: ["l\\ (\\mu\\mathrm{m})"] },
        hint: L("Find the length in nm, then convert to μm.", "पहले nm में लंबाई ज्ञात कीजिए, फिर μm में बदलिए।"),
        formula: "l = n \\cdot 0.34\\ \\mathrm{nm},\\ 1\\ \\mu\\mathrm{m} = 1000\\ \\mathrm{nm}",
        solution: L(S(`$l = ${bp} \\cdot 0.34 = ${en(bp * 0.34)}\\ \\mathrm{nm}$`, `$l = ${en(bp * 0.34)}/1000 = ${en(um, 2)}\\ \\mu\\mathrm{m}$`), S(`$l = ${bp} \\cdot 0.34 = ${en(bp * 0.34)}\\ \\mathrm{nm}$`, `$l = ${en(bp * 0.34)}/1000 = ${en(um, 2)}\\ \\mu\\mathrm{m}$`)),
      });
    }
    if (level === 2 && v === 3) {
      const n = r.int(2, 5);
      const light = r.int(0, 1) === 1;
      const t = 20 * n;
      const hyb = [2, 2 ** n];
      const nu = light ? 2 ** n - 2 : 2;
      return task({
        text: L(`In the Meselson–Stahl experiment, E. coli grown in $^{15}\\mathrm{N}$ medium is moved to $^{14}\\mathrm{N}$ medium; it divides every 20 minutes. After ${t} minutes, what fraction of the DNA molecules is ${light ? "light ($^{14}\\mathrm{N}/^{14}\\mathrm{N}$)" : "hybrid ($^{15}\\mathrm{N}/^{14}\\mathrm{N}$)"}?`, `मेसेल्सन–स्टाल प्रयोग में $^{15}\\mathrm{N}$ माध्यम में उगाए गए ई. कोलाई को $^{14}\\mathrm{N}$ माध्यम में रखा गया; यह हर 20 मिनट में विभाजित होता है। ${t} मिनट बाद DNA अणुओं का कितना भाग ${light ? "हल्का ($^{14}\\mathrm{N}/^{14}\\mathrm{N}$)" : "संकर ($^{15}\\mathrm{N}/^{14}\\mathrm{N}$)"} होगा?`),
        answer: fractionM(nu, 2 ** n, [[light ? 1 - 1 / 2 ** n : 1 / 2 ** n, L("Replication is semiconservative: the two original strands end up in two hybrid molecules, not one.", "प्रतिकृतिकरण अर्धसंरक्षी है: दोनों मूल रज्जुक दो संकर अणुओं में जाते हैं, एक में नहीं।")], [light ? 2 / 2 ** n : 1 - 2 / 2 ** n, L(light ? "That is the hybrid fraction." : "That is the light fraction.", light ? "यह संकर भाग है।" : "यह हल्का भाग है।")], [light ? 1 - 2 / 2 ** (n - 1) : 2 / 2 ** (n - 1), L(`${t} minutes is ${n} generations, not ${n - 1}.`, `${t} मिनट ${n} पीढ़ियाँ हैं, ${n - 1} नहीं।`)]]),
        data: { given: [`t = ${t}\\ \\mathrm{min}`, "T = 20\\ \\mathrm{min}"], find: ["P"] },
        hint: L("Find the number of generations; the two heavy strands are always in two hybrid molecules.", "पीढ़ियों की संख्या ज्ञात कीजिए; दोनों भारी रज्जुक सदा दो संकर अणुओं में रहते हैं।"),
        formula: "n = \\dfrac{t}{20},\\ P_{\\text{hybrid}} = \\dfrac{2}{2^n}",
        solution: L(
          S(`$n = ${t}/20 = ${n}$ generations → $2^{${n}} = ${2 ** n}$ molecules`, `Hybrid: 2; light: $${2 ** n} - 2 = ${2 ** n - 2}$`, `$P = ${fracTex(nu, 2 ** n)}$`),
          S(`$n = ${t}/20 = ${n}$ पीढ़ियाँ → $2^{${n}} = ${2 ** n}$ अणु`, `संकर: 2; हल्के: $${2 ** n} - 2 = ${2 ** n - 2}$`, `$P = ${fracTex(nu, 2 ** n)}$`),
        ),
      });
    }
    if (level === 2) {
      const k = r.int(30, 300);
      const ask = r.int(0, 1); // 0 kodoni v mRNA, 1 kodonov za aminokisline
      const nt = 3 * k + 3;
      return task({
        text: ask
          ? L(`A polypeptide has ${k} amino acids. How many codons, including the stop codon, are there in the coding region of its mRNA?`, `एक पॉलिपेप्टाइड में ${k} ऐमीनो अम्ल हैं। इसके mRNA के कोडन क्षेत्र में समापन कोडॉन सहित कितने कोडॉन हैं?`)
          : L(`A polypeptide has ${k} amino acids. What is the minimum number of nucleotides in the coding region of its mRNA, including the start and stop codons?`, `एक पॉलिपेप्टाइड में ${k} ऐमीनो अम्ल हैं। प्रारंभन और समापन कोडॉन सहित इसके mRNA के कोडन क्षेत्र में न्यूनतम कितने न्यूक्लियोटाइड होंगे?`),
        answer: ask
          ? numM(k + 1, 0, [[k, L("Add the stop codon, which codes for no amino acid.", "समापन कोडॉन भी जोड़िए, जो कोई ऐमीनो अम्ल नहीं देता।")], [k + 2, L("AUG codes for the first amino acid (methionine); it is already counted.", "AUG पहले ऐमीनो अम्ल (मेथियोनीन) का कोड है; वह पहले ही गिना गया है।")], [nt, L("The question asks for codons, not nucleotides.", "प्रश्न कोडॉन पूछता है, न्यूक्लियोटाइड नहीं।")]])
          : numM(nt, 0, [[3 * k, L("Add the three nucleotides of the stop codon.", "समापन कोडॉन के तीन न्यूक्लियोटाइड भी जोड़िए।")], [3 * k + 6, L("AUG codes for the first amino acid (methionine); do not add it again.", "AUG पहले ऐमीनो अम्ल (मेथियोनीन) का कोड है; इसे दोबारा मत जोड़िए।")], [k + 1, L("Each codon has three nucleotides.", "प्रत्येक कोडॉन में तीन न्यूक्लियोटाइड होते हैं।")]]),
        data: { given: [`N = ${k}`], find: [ask ? `N_{${tx(L("codons", "कोडॉन"))}}` : "n"] },
        hint: L("One codon per amino acid (the first is AUG), plus one stop codon.", "प्रति ऐमीनो अम्ल एक कोडॉन (पहला AUG), और एक समापन कोडॉन।"),
        formula: ask ? "N_{\\text{codons}} = N + 1" : "n = 3(N + 1)",
        solution: L(S(`Codons: $${k} + 1 = ${k + 1}$ (stop codon included)`, ask ? null : `$n = 3 \\cdot ${k + 1} = ${nt}$`), S(`कोडॉन: $${k} + 1 = ${k + 1}$ (समापन कोडॉन सहित)`, ask ? null : `$n = 3 \\cdot ${k + 1} = ${nt}$`)),
      });
    }
    // Raven 3
    if (v === 0) {
      const mm = r.int(0, 1) === 1;
      const bp = mm ? r.int(1, 9) * 10 ** 6 : r.int(2, 60) * 10 ** 4;
      const lenTxt = mm ? `${en((bp * 0.34) / 1e6)}\\ \\mathrm{mm}` : `${en((bp * 0.34) / 1e3)}\\ \\mu\\mathrm{m}`;
      const askNt = r.int(0, 1) === 1;
      const ans = askNt ? 2 * bp : bp;
      return task({
        text: L(`A double-stranded DNA molecule is $${lenTxt}$ long (0.34 nm per base pair). How many ${askNt ? "nucleotides" : "base pairs"} does it contain?`, `एक द्विरज्जुकी DNA अणु $${lenTxt}$ लंबा है (प्रति क्षार युग्म 0.34 nm)। इसमें कितने ${askNt ? "न्यूक्लियोटाइड" : "क्षार युग्म"} हैं?`),
        answer: numM(ans, 0, [[ans / 10, L("Use 0.34 nm per base pair; 3.4 nm is one full turn.", "प्रति क्षार युग्म 0.34 nm लीजिए; 3.4 nm एक पूरा घुमाव है।")], [askNt ? bp : 2 * bp, L(askNt ? "Each base pair has two nucleotides." : "The length gives base pairs; do not double them.", askNt ? "प्रत्येक क्षार युग्म में दो न्यूक्लियोटाइड होते हैं।" : "लंबाई से क्षार युग्म मिलते हैं; इन्हें दोगुना मत कीजिए।")], [ans / 1000, L(mm ? "1 mm = 10⁶ nm, not 10³ nm." : "1 μm = 10³ nm; convert before dividing.", mm ? "1 mm = 10⁶ nm, 10³ nm नहीं।" : "1 μm = 10³ nm; भाग देने से पहले बदलिए।")]]),
        data: { given: [`l = ${lenTxt}`, "d = 0.34\\ \\mathrm{nm}"], find: [askNt ? "N_{nt}" : "n_{bp}"] },
        hint: L("Convert the length to nm first, then divide by 0.34 nm.", "पहले लंबाई को nm में बदलिए, फिर 0.34 nm से भाग दीजिए।"),
        formula: "n = \\dfrac{l}{0.34\\ \\mathrm{nm}}",
        solution: L(
          S(`$l = ${en(bp * 0.34)}\\ \\mathrm{nm}$`, `$n = ${en(bp * 0.34)}/0.34 = ${sci(bp)}\\ \\mathrm{bp}$`, askNt ? `Nucleotides: $2n = ${sci(2 * bp)}$` : null),
          S(`$l = ${en(bp * 0.34)}\\ \\mathrm{nm}$`, `$n = ${en(bp * 0.34)}/0.34 = ${sci(bp)}\\ \\mathrm{bp}$`, askNt ? `न्यूक्लियोटाइड: $2n = ${sci(2 * bp)}$` : null),
        ),
      });
    }
    if (v === 1) {
      const k = r.int(40, 400);
      const ds = r.int(0, 1) === 1;
      const nt = 3 * k + 3;
      const ans = ds ? 2 * nt : nt;
      return task({
        text: ds
          ? L(`A polypeptide has ${k} amino acids. Ignoring introns and untranslated regions, how many nucleotides are there in the double-stranded DNA that codes for it, including the start and stop codons?`, `एक पॉलिपेप्टाइड में ${k} ऐमीनो अम्ल हैं। इंट्रॉनों और अनूदित क्षेत्रों को छोड़कर, प्रारंभन और समापन कोडॉन सहित इसे कोड करने वाले द्विरज्जुकी DNA में कितने न्यूक्लियोटाइड हैं?`)
          : L(`An mRNA has a 5' untranslated region of 30 nucleotides and a 3' untranslated region of 50 nucleotides. It codes for a polypeptide of ${k} amino acids. What is the total length of the mRNA in nucleotides?`, `एक mRNA में 30 न्यूक्लियोटाइड का 5' अनूदित क्षेत्र और 50 न्यूक्लियोटाइड का 3' अनूदित क्षेत्र है। यह ${k} ऐमीनो अम्लों के पॉलिपेप्टाइड का कोड देता है। mRNA की कुल लंबाई कितने न्यूक्लियोटाइड है?`),
        answer: ds
          ? numM(ans, 0, [[nt, L("A double-stranded DNA has two nucleotides per base pair.", "द्विरज्जुकी DNA में प्रति क्षार युग्म दो न्यूक्लियोटाइड होते हैं।")], [6 * k, L("Include the stop codon.", "समापन कोडॉन भी शामिल कीजिए।")], [2 * (3 * k + 6), L("AUG codes for the first amino acid; do not add it again.", "AUG पहले ऐमीनो अम्ल का कोड है; इसे दोबारा मत जोड़िए।")]])
          : numM(nt + 80, 0, [[3 * k + 80, L("Include the stop codon in the coding region.", "कोडन क्षेत्र में समापन कोडॉन भी शामिल कीजिए।")], [nt, L("Add the untranslated regions (UTRs); they are part of the mRNA.", "अनूदित क्षेत्र (UTR) भी जोड़िए; ये mRNA का भाग हैं।")], [3 * k + 86, L("AUG codes for the first amino acid; do not add it again.", "AUG पहले ऐमीनो अम्ल का कोड है; इसे दोबारा मत जोड़िए।")]]),
        data: { given: [`N = ${k}`, ds ? null : "UTR: 30 + 50"].filter(Boolean), find: ["n"] },
        hint: L("Codons = amino acids + 1 (stop). Then add what else the question includes.", "कोडॉन = ऐमीनो अम्ल + 1 (समापन)। फिर वह जोड़िए जो प्रश्न में और शामिल है।"),
        formula: ds ? "n = 2 \\cdot 3(N + 1)" : "n = 3(N + 1) + n_{UTR}",
        solution: L(
          S(`Coding region: $3 \\cdot (${k} + 1) = ${nt}$`, ds ? `Two strands: $2 \\cdot ${nt} = ${ans}$` : `$n = ${nt} + 30 + 50 = ${nt + 80}$`),
          S(`कोडन क्षेत्र: $3 \\cdot (${k} + 1) = ${nt}$`, ds ? `दो रज्जुक: $2 \\cdot ${nt} = ${ans}$` : `$n = ${nt} + 30 + 50 = ${nt + 80}$`),
        ),
      });
    }
    if (v === 2) {
      const x = r.pick([0.4, 0.5, 0.8, 1.25, 2, 2.5, 0.25, 4]);
      const pur = r.int(0, 2); // 0 (A+G)/(T+C) komplementarna, 1 (A+G)/(T+C) cela DNA, 2 (A+T)/(G+C) komplementarna
      const ans = pur === 0 ? 1 / x : pur === 1 ? 1 : x;
      const ratio = pur === 2 ? "(A+T)/(G+C)" : "(A+G)/(T+C)";
      const where = pur === 1 ? ["the whole double-stranded molecule", "पूरे द्विरज्जुकी अणु"] : ["the complementary strand", "पूरक रज्जुक"];
      const mist = pur === 0
        ? [[x, L("In the complementary strand every purine is replaced by its paired pyrimidine, so the ratio inverts.", "पूरक रज्जुक में हर प्यूरीन की जगह उसका युग्मी पिरिमिडीन होता है, अतः अनुपात उलट जाता है।")], [1, L("The ratio is 1 only for the whole double helix, not for one strand.", "अनुपात 1 केवल पूरी द्विकुंडली के लिए है, एक रज्जुक के लिए नहीं।")]]
        : pur === 1
          ? [[x, L("In dsDNA, purines = pyrimidines, so the ratio for the whole molecule is fixed.", "द्विरज्जुकी DNA में प्यूरीन = पिरिमिडीन, अतः पूरे अणु का अनुपात निश्चित है।")], [1 / x, L("That is for the complementary strand only.", "यह केवल पूरक रज्जुक के लिए है।")]]
          : [[1 / x, L("A pairs with T and G with C, so (A+T) and (G+C) stay the same in the complementary strand.", "A का युग्म T से और G का C से बनता है, अतः पूरक रज्जुक में (A+T) और (G+C) वही रहते हैं।")], [1, L("This ratio is not fixed at 1; it differs between species.", "यह अनुपात 1 पर निश्चित नहीं है; यह जातियों में भिन्न होता है।")]];
      return task({
        text: L(`In one strand of a DNA molecule, the ratio $${ratio}$ is ${en(x)}. What is this ratio in ${where[0]}?${roundToL(2, lang)}`, `एक DNA अणु के एक रज्जुक में अनुपात $${ratio}$ = ${en(x)} है। ${where[1]} में यह अनुपात कितना होगा?${roundToL(2, lang)}`),
        answer: numM(ans, 2, mist),
        data: { given: [`${ratio} = ${en(x)}`], find: [`${ratio}_{${tx(L(pur === 1 ? "dsDNA" : "complementary", pur === 1 ? "द्विरज्जुकी" : "पूरक"))}}`] },
        hint: L("Write what each base becomes in the complementary strand (A↔T, G↔C).", "लिखिए कि पूरक रज्जुक में प्रत्येक क्षार क्या बनता है (A↔T, G↔C)।"),
        formula: pur === 2 ? "(A+T)' = (T+A),\\ (G+C)' = (C+G)" : "(A+G)' = (T+C),\\ (T+C)' = (A+G)",
        solution: L(
          pur === 0 ? S("Complementary strand: A′ = T, G′ = C, T′ = A, C′ = G", `$${ratio}' = \\dfrac{T+C}{A+G} = \\dfrac{1}{${en(x)}} = ${en(ans, 2)}$`) : pur === 1 ? S("Whole molecule: A = T and G = C", "$A + G = T + C$ → ratio $= 1$") : S("Complementary strand: A′ + T′ = T + A, G′ + C′ = C + G", `Ratio unchanged: $${en(x)}$`),
          pur === 0 ? S("पूरक रज्जुक: A′ = T, G′ = C, T′ = A, C′ = G", `$${ratio}' = \\dfrac{T+C}{A+G} = \\dfrac{1}{${en(x)}} = ${en(ans, 2)}$`) : pur === 1 ? S("पूरा अणु: A = T और G = C", "$A + G = T + C$ → अनुपात $= 1$") : S("पूरक रज्जुक: A′ + T′ = T + A, G′ + C′ = C + G", `अनुपात अपरिवर्तित: $${en(x)}$`),
        ),
      });
    }
    if (v === 3) {
      const n = r.int(3, 6);
      const ans = 20 * n;
      return task({
        text: L(`In the Meselson–Stahl experiment, E. coli grown in $^{15}\\mathrm{N}$ is transferred to $^{14}\\mathrm{N}$ medium and divides every 20 minutes. After how many minutes will hybrid ($^{15}\\mathrm{N}/^{14}\\mathrm{N}$) DNA make up $${fracTex(2, 2 ** n)}$ of all DNA molecules?`, `मेसेल्सन–स्टाल प्रयोग में $^{15}\\mathrm{N}$ में उगाए गए ई. कोलाई को $^{14}\\mathrm{N}$ माध्यम में रखा गया; यह हर 20 मिनट में विभाजित होता है। कितने मिनट बाद संकर ($^{15}\\mathrm{N}/^{14}\\mathrm{N}$) DNA सभी DNA अणुओं का $${fracTex(2, 2 ** n)}$ होगा?`),
        answer: numM(ans, 0, [[20 * (n - 1), L("There are always two hybrid molecules, so the fraction is $2/2^n$, not $1/2^n$.", "संकर अणु सदा दो होते हैं, अतः भाग $2/2^n$ है, $1/2^n$ नहीं।")], [n, L("That is the number of generations; convert it to minutes.", "यह पीढ़ियों की संख्या है; इसे मिनटों में बदलिए।")], [20 * 2 ** (n - 1), L("The time grows by 20 minutes per generation, not by doubling.", "समय प्रति पीढ़ी 20 मिनट बढ़ता है, दोगुना नहीं होता।")]]),
        data: { given: [`P = ${fracTex(2, 2 ** n)}`, "T = 20\\ \\mathrm{min}"], find: ["t\\ (\\mathrm{min})"] },
        hint: L("Semiconservative replication keeps exactly two hybrid molecules; find how many molecules there are in all.", "अर्धसंरक्षी प्रतिकृतिकरण में ठीक दो संकर अणु रहते हैं; ज्ञात कीजिए कि कुल कितने अणु हैं।"),
        formula: "\\dfrac{2}{2^n} = P,\\ t = 20n",
        solution: L(S(`$2/2^n = ${fracTex(2, 2 ** n)}$ → $2^n = ${2 ** n}$ → $n = ${n}$`, `$t = 20 \\cdot ${n} = ${ans}\\ \\mathrm{min}$`), S(`$2/2^n = ${fracTex(2, 2 ** n)}$ → $2^n = ${2 ** n}$ → $n = ${n}$`, `$t = 20 \\cdot ${n} = ${ans}\\ \\mathrm{min}$`)),
      });
    }
    const N = 10 * r.int(10, 120);
    const gc = r.int(Math.ceil(N * 0.2), Math.floor(N * 0.8));
    const H = 2 * N + gc;
    const askAT = r.int(0, 1) === 1;
    const ans = askAT ? N - gc : gc;
    return task({
      text: L(`A DNA segment of ${N} base pairs is held together by ${H} hydrogen bonds. How many ${askAT ? "A=T" : "G≡C"} base pairs does it have?`, `${N} क्षार युग्मों का एक DNA खंड ${H} हाइड्रोजन आबंधों से जुड़ा है। इसमें कितने ${askAT ? "A=T" : "G≡C"} क्षार युग्म हैं?`),
      answer: numM(ans, 0, [[askAT ? gc : N - gc, L(askAT ? "That is the number of G≡C pairs." : "That is the number of A=T pairs.", askAT ? "यह G≡C युग्मों की संख्या है।" : "यह A=T युग्मों की संख्या है।")], [Math.round(H / 3), L("Not all pairs have three bonds; set up two equations for the two kinds of pairs.", "सभी युग्मों में तीन आबंध नहीं होते; दोनों प्रकार के युग्मों के लिए दो समीकरण बनाइए।")], [askAT ? 2 * (N - gc) : 2 * gc, L("Count base pairs, not nucleotides.", "क्षार युग्म गिनिए, न्यूक्लियोटाइड नहीं।")]]),
      data: { given: [`n = ${N}\\ \\mathrm{bp}`, `N_H = ${H}`], find: [askAT ? "n_{AT}" : "n_{GC}"] },
      hint: L("Let x be the G≡C pairs: 2(n − x) + 3x = N_H.", "मान लीजिए x = G≡C युग्म: 2(n − x) + 3x = N_H।"),
      formula: "2\\,n_{AT} + 3\\,n_{GC} = N_H,\\ n_{AT} + n_{GC} = n",
      solution: L(
        S(`$2(${N} - x) + 3x = ${H}$ → $x = ${H} - ${2 * N} = ${gc}$ (G≡C)`, askAT ? `A=T: $${N} - ${gc} = ${N - gc}$` : `G≡C: $${gc}$`),
        S(`$2(${N} - x) + 3x = ${H}$ → $x = ${H} - ${2 * N} = ${gc}$ (G≡C)`, askAT ? `A=T: $${N} - ${gc} = ${N - gc}$` : `G≡C: $${gc}$`),
      ),
    });
  },
};

// ---------------------------------------------------------------------------------------------
// Zaporedja: kodirajoča/matrična veriga → mRNA, antikodon, štetje aminokislin med AUG in stop kodonom.
// ---------------------------------------------------------------------------------------------
const DC = { A: "T", T: "A", G: "C", C: "G" };
const RC = { A: "U", U: "A", G: "C", C: "G" };
const toU = (s) => s.replace(/T/g, "U");
const toT = (s) => s.replace(/U/g, "T");
const compD = (s) => s.split("").map((x) => DC[x]).join("");
const compR = (s) => s.split("").map((x) => RC[x]).join("");
const rev = (s) => s.split("").reverse().join("");
const grp3 = (s) => s.match(/.{1,3}/g).join(" ");
const p53 = (s) => `5'-${grp3(s)}-3'`;
const p35 = (s) => `3'-${grp3(s)}-5'`;
const STOPS = ["UAA", "UAG", "UGA"];
const SENSE = [];
"ACGU".split("").forEach((a) => "ACGU".split("").forEach((b) => "ACGU".split("").forEach((c) => {
  if (!STOPS.includes(a + b + c)) SENSE.push(a + b + c);
})));
// kodoni, pri katerih so vse štiri možnosti za antikodon različne
const ANTI_OK = SENSE.filter((c) => c.includes("A") && c.includes("U") && new Set([compR(c), c, toT(compR(c)), rev(compR(c))]).size === 4 && new Set([c, rev(c), rev(compR(c)), toT(c)]).size === 4);
const seqWhy = {
  dna: ["RNA contains uracil (U) in place of thymine (T).", "RNA में थाइमीन (T) के स्थान पर यूरेसिल (U) होता है।"],
  comp: ["mRNA has the same sequence as the coding strand (T → U), not its complement.", "mRNA का अनुक्रम कोडिंग रज्जुक जैसा ही होता है (T → U), उसका पूरक नहीं।"],
  revd: ["The polarity is reversed: read 5'→3', the mRNA has the same order as the coding strand.", "ध्रुवता उलटी है: 5'→3' पढ़ने पर mRNA का क्रम कोडिंग रज्जुक जैसा ही होता है।"],
  copy: ["mRNA is complementary to the template strand, not a copy of it.", "mRNA टेम्पलेट रज्जुक का पूरक होता है, उसकी प्रतिलिपि नहीं।"],
  anti: ["Strands pair antiparallel: the mRNA runs 5'→3' opposite the template's 3'→5'.", "रज्जुक प्रतिसमांतर युग्म बनाते हैं: mRNA 5'→3', टेम्पलेट के 3'→5' के विपरीत चलता है।"],
};
const wy = (k) => seqWhy[k];
const MOLECULAR_SEQ = {
  id: "exi-bio-molecular-seq",
  topics: [T("molecular-basis-of-inheritance")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 2);
    const raw = Array.from({ length: 12 }, () => r.pick(["A", "C", "G", "T"]));
    raw[0] = "A";
    raw[1] = "T";
    raw[11] = "C";
    const cod = raw.join(""); // kodirajoča veriga 5'→3'
    const tmp = compD(cod); // matrična veriga, poravnana 3'→5'
    const mrna = toU(cod);
    const anti = r.pick(ANTI_OK);
    const u5 = Array.from({ length: r.int(4, 8) }, () => r.pick(["A", "C", "G", "U"])).join("").replace(/AUG/g, "ACG");
    const k = r.int(4, 8);
    const orf = Array.from({ length: k }, () => r.pick(SENSE)).join("");
    const stop = r.pick(STOPS);
    const u3 = Array.from({ length: r.int(3, 7) }, () => r.pick(["A", "C", "G", "U"])).join("");
    const askPB = r.int(0, 1) === 1;
    const mk = (text, ans, hint, sol, given, find) => task({ text, answer: ans, hint, solution: sol, data: { given, find }, formula: "\\mathrm{A{-}U,\\ T{-}A,\\ G{-}C}" });
    if (level === 1 && v < 2) {
      const fromCoding = v === 0;
      const ans = mc(r, L, [p53(mrna), p53(mrna)], [
        [p53(cod), p53(cod), ...wy("dna")],
        fromCoding ? [p53(compR(mrna)), p53(compR(mrna)), ...wy("comp")] : [p53(toU(tmp)), p53(toU(tmp)), ...wy("copy")],
        [p53(rev(mrna)), p53(rev(mrna)), ...wy(fromCoding ? "revd" : "anti")],
      ]);
      const given = fromCoding ? p53(cod) : p35(tmp);
      return mk(
        fromCoding ? L(`The coding strand of a gene reads ${given}. Which mRNA is transcribed from this gene?`, `एक जीन का कोडिंग रज्जुक ${given} है। इस जीन से कौन-सा mRNA अनुलेखित होगा?`) : L(`The template strand of a gene reads ${given}. Which mRNA is transcribed from it?`, `एक जीन का टेम्पलेट रज्जुक ${given} है। इससे कौन-सा mRNA अनुलेखित होगा?`),
        ans,
        fromCoding ? L("The mRNA has the coding strand's sequence, with U in place of T.", "mRNA में कोडिंग रज्जुक का ही अनुक्रम होता है, T के स्थान पर U।") : L("Pair each template base (A→U, T→A, G→C, C→G) and keep the antiparallel direction.", "टेम्पलेट के हर क्षार का युग्म लिखिए (A→U, T→A, G→C, C→G) और प्रतिसमांतर दिशा बनाए रखिए।"),
        L(S(fromCoding ? `Coding strand: ${p53(cod)}` : `Template: ${p35(tmp)}`, fromCoding ? "Replace T with U, keep 5'→3'." : "Complementary bases, U instead of T, antiparallel.", `mRNA: ${p53(mrna)}`), S(fromCoding ? `कोडिंग रज्जुक: ${p53(cod)}` : `टेम्पलेट: ${p35(tmp)}`, fromCoding ? "T के स्थान पर U, दिशा 5'→3'।" : "पूरक क्षार, T के स्थान पर U, प्रतिसमांतर।", `mRNA: ${p53(mrna)}`)),
        [tx(given)],
        ["\\text{mRNA}"],
      );
    }
    if (level === 1) {
      const ans = mc(r, L, [p53(cod), p53(cod)], [
        [p53(mrna), p53(mrna), "DNA contains thymine (T), not uracil (U).", "DNA में थाइमीन (T) होता है, यूरेसिल (U) नहीं।"],
        [p53(compD(cod)), p53(compD(cod)), "The coding strand has the same sequence as the mRNA; its complement is the template.", "कोडिंग रज्जुक का अनुक्रम mRNA जैसा होता है; उसका पूरक टेम्पलेट है।"],
        [p53(rev(cod)), p53(rev(cod)), ...wy("revd")],
      ]);
      return mk(
        L(`An mRNA reads ${p53(mrna)}. Which is the coding strand of the gene?`, `एक mRNA ${p53(mrna)} है। जीन का कोडिंग रज्जुक कौन-सा है?`),
        ans,
        L("The coding strand has the same sequence and polarity as the mRNA, but with T.", "कोडिंग रज्जुक का अनुक्रम और ध्रुवता mRNA जैसी होती है, पर T के साथ।"),
        L(S(`mRNA: ${p53(mrna)}`, "Replace U with T, keep 5'→3'.", `Coding strand: ${p53(cod)}`), S(`mRNA: ${p53(mrna)}`, "U के स्थान पर T, दिशा 5'→3'।", `कोडिंग रज्जुक: ${p53(cod)}`)),
        [tx(p53(mrna))],
        [tx(L("coding strand", "कोडिंग रज्जुक"))],
      );
    }
    if (level === 2 && v === 0) {
      const ac = compR(anti);
      const ans = mc(r, L, [`3'-${ac}-5'`, `3'-${ac}-5'`], [
        [`3'-${anti}-5'`, `3'-${anti}-5'`, "The anticodon is complementary to the codon, not identical to it.", "प्रतिकोडॉन कोडॉन का पूरक होता है, उसके समान नहीं।"],
        [`3'-${toT(ac)}-5'`, `3'-${toT(ac)}-5'`, "tRNA is RNA: it contains U, not T.", "tRNA एक RNA है: इसमें U होता है, T नहीं।"],
        [`5'-${ac}-3'`, `5'-${ac}-3'`, "Codon and anticodon pair antiparallel, so the anticodon runs 3'→5' against the codon's 5'→3'.", "कोडॉन और प्रतिकोडॉन प्रतिसमांतर युग्म बनाते हैं, अतः प्रतिकोडॉन कोडॉन के 5'→3' के विपरीत 3'→5' चलता है।"],
      ]);
      return mk(
        L(`A codon on the mRNA is 5'-${anti}-3'. Which tRNA anticodon pairs with it?`, `mRNA पर एक कोडॉन 5'-${anti}-3' है। कौन-सा tRNA प्रतिकोडॉन इससे युग्म बनाएगा?`),
        ans,
        L("Write the complementary RNA bases and remember that pairing is antiparallel.", "पूरक RNA क्षार लिखिए और याद रखिए कि युग्मन प्रतिसमांतर है।"),
        L(S(`Codon: 5'-${anti}-3'`, "Complementary bases A–U, G–C, antiparallel", `Anticodon: 3'-${ac}-5'`), S(`कोडॉन: 5'-${anti}-3'`, "पूरक क्षार A–U, G–C, प्रतिसमांतर", `प्रतिकोडॉन: 3'-${ac}-5'`)),
        [tx(`5'-${anti}-3'`)],
        [tx(L("anticodon", "प्रतिकोडॉन"))],
      );
    }
    if (level === 2 && v === 1) {
      const ans = mc(r, L, [p35(tmp), p35(tmp)], [
        [p35(cod), p35(cod), "The template is complementary to the mRNA; this is the mRNA's own sequence with T.", "टेम्पलेट mRNA का पूरक होता है; यह T के साथ mRNA का ही अनुक्रम है।"],
        [p35(compR(mrna)), p35(compR(mrna)), "DNA contains thymine (T), not uracil (U).", "DNA में थाइमीन (T) होता है, यूरेसिल (U) नहीं।"],
        [p53(tmp), p53(tmp), "The template is antiparallel to the mRNA: below 5'→3' mRNA it runs 3'→5'.", "टेम्पलेट mRNA के प्रतिसमांतर होता है: 5'→3' mRNA के नीचे यह 3'→5' चलता है।"],
      ]);
      return mk(
        L(`An mRNA reads ${p53(mrna)}. Which strand of DNA served as its template?`, `एक mRNA ${p53(mrna)} है। DNA का कौन-सा रज्जुक इसका टेम्पलेट था?`),
        ans,
        L("The template pairs with the mRNA base by base (A–T, U–A, G–C) and is antiparallel.", "टेम्पलेट mRNA से क्षार-दर-क्षार युग्म बनाता है (A–T, U–A, G–C) और प्रतिसमांतर होता है।"),
        L(S(`mRNA: ${p53(mrna)}`, "Complement with DNA bases, opposite polarity", `Template: ${p35(tmp)}`), S(`mRNA: ${p53(mrna)}`, "DNA क्षारों से पूरक, विपरीत ध्रुवता", `टेम्पलेट: ${p35(tmp)}`)),
        [tx(p53(mrna))],
        [tx(L("template strand", "टेम्पलेट रज्जुक"))],
      );
    }
    if (level === 2) {
      // aminokisline v ORF brez UTR
      const seq = "AUG" + orf + stop;
      return mk(
        L(`Translation of the mRNA 5'-${grp3(seq)}-3' starts at AUG. How many amino acids does the polypeptide contain?`, `mRNA 5'-${grp3(seq)}-3' का अनुवादन AUG से प्रारंभ होता है। पॉलिपेप्टाइड में कितने ऐमीनो अम्ल होंगे?`),
        numM(k + 1, 0, [[k + 2, L(`${stop} is a stop codon; it codes for no amino acid.`, `${stop} समापन कोडॉन है; यह किसी ऐमीनो अम्ल का कोड नहीं देता।`)], [k, L("AUG codes for methionine, the first amino acid.", "AUG पहले ऐमीनो अम्ल मेथियोनीन का कोड देता है।")], [seq.length, L("One amino acid per codon (triplet), not per nucleotide.", "प्रति कोडॉन (त्रिक) एक ऐमीनो अम्ल, प्रति न्यूक्लियोटाइड नहीं।")]]),
        L("Count the codons from AUG; the last one is a stop codon.", "AUG से कोडॉन गिनिए; अंतिम कोडॉन समापन कोडॉन है।"),
        L(S(`Codons: ${seq.length / 3}; last codon ${stop} = stop`, `Amino acids: $${seq.length / 3} - 1 = ${k + 1}$`), S(`कोडॉन: ${seq.length / 3}; अंतिम कोडॉन ${stop} = समापन`, `ऐमीनो अम्ल: $${seq.length / 3} - 1 = ${k + 1}$`)),
        [tx(`5'-${seq}-3'`)],
        [`N_{${tx(L("amino acids", "ऐमीनो अम्ल"))}}`],
      );
    }
    // Raven 3
    if (v === 0) {
      const seq = u5 + "AUG" + orf + stop + u3;
      const blocks = seq.match(/.{1,10}/g).join(" ");
      const aa = k + 1;
      const ans = askPB ? aa - 1 : aa;
      return mk(
        L(`An mRNA reads 5'-${blocks}-3' (spaces only for reading). Translation starts at the first AUG. How many ${askPB ? "peptide bonds" : "amino acids"} does the polypeptide have?`, `एक mRNA 5'-${blocks}-3' है (रिक्त स्थान केवल पढ़ने के लिए)। अनुवादन पहले AUG से प्रारंभ होता है। पॉलिपेप्टाइड में कितने ${askPB ? "पेप्टाइड आबंध" : "ऐमीनो अम्ल"} होंगे?`),
        numM(ans, 0, [[ans + 1, L(askPB ? "n amino acids are joined by n − 1 peptide bonds; also, the stop codon adds no amino acid." : "The stop codon codes for no amino acid.", askPB ? "n ऐमीनो अम्ल n − 1 पेप्टाइड आबंधों से जुड़ते हैं; समापन कोडॉन भी कोई ऐमीनो अम्ल नहीं जोड़ता।" : "समापन कोडॉन किसी ऐमीनो अम्ल का कोड नहीं देता।")], [Math.floor(seq.length / 3) - (askPB ? 1 : 0), L("The untranslated regions before AUG and after the stop codon are not translated.", "AUG से पहले और समापन कोडॉन के बाद के अनूदित क्षेत्रों का अनुवादन नहीं होता।")], [ans + 2, L(`Translation stops at the first in-frame stop codon (${stop}).`, `अनुवादन पहले ही पठन-ढाँचे वाले समापन कोडॉन (${stop}) पर रुक जाता है।`)]]),
        L("Find the first AUG, then read triplets in that frame until a stop codon (UAA, UAG, UGA).", "पहला AUG खोजिए, फिर उसी ढाँचे में त्रिक पढ़िए जब तक समापन कोडॉन (UAA, UAG, UGA) न आए।"),
        L(S(`5' UTR: ${u5}`, `Reading frame: ${grp3("AUG" + orf + stop)}`, `Amino acids: $${k + 2} - 1 = ${aa}$`, askPB ? `Peptide bonds: $${aa} - 1 = ${aa - 1}$` : null), S(`5' UTR: ${u5}`, `पठन-ढाँचा: ${grp3("AUG" + orf + stop)}`, `ऐमीनो अम्ल: $${k + 2} - 1 = ${aa}$`, askPB ? `पेप्टाइड आबंध: $${aa} - 1 = ${aa - 1}$` : null)),
        [tx(`5'-${seq}-3'`)],
        [askPB ? "N_{pb}" : "N_{aa}"],
      );
    }
    if (v === 1) {
      const t53 = rev(tmp); // matrica, zapisana 5'→3'
      const ans = mc(r, L, [p53(mrna), p53(mrna)], [
        [p53(compR(toU(t53))), p53(compR(toU(t53))), "The template is written 5'→3', so its complement must be reversed to read 5'→3'.", "टेम्पलेट 5'→3' लिखा है, अतः उसके पूरक को 5'→3' पढ़ने के लिए उलटना होगा।"],
        [p53(toU(t53)), p53(toU(t53)), ...wy("copy")],
        [p53(cod), p53(cod), ...wy("dna")],
      ]);
      return mk(
        L(`The template strand of a gene, written 5'→3', is ${p53(t53)}. Which mRNA is transcribed from it?`, `एक जीन का टेम्पलेट रज्जुक, 5'→3' लिखा हुआ, ${p53(t53)} है। इससे कौन-सा mRNA अनुलेखित होगा?`),
        ans,
        L("First rewrite the template 3'→5'; then pair each base.", "पहले टेम्पलेट को 3'→5' लिखिए; फिर हर क्षार का युग्म बनाइए।"),
        L(S(`Template 3'→5': ${p35(tmp)}`, "Pair: A→U, T→A, G→C, C→G", `mRNA: ${p53(mrna)}`), S(`टेम्पलेट 3'→5': ${p35(tmp)}`, "युग्म: A→U, T→A, G→C, C→G", `mRNA: ${p53(mrna)}`)),
        [tx(p53(t53))],
        ["\\text{mRNA}"],
      );
    }
    const ac53 = rev(compR(anti)); // antikodon, zapisan 5'→3'
    const ans = mc(r, L, [`5'-${anti}-3'`, `5'-${anti}-3'`], [
      [`5'-${compR(ac53)}-3'`, `5'-${compR(ac53)}-3'`, "The anticodon is written 5'→3'; pairing is antiparallel, so reverse the complement.", "प्रतिकोडॉन 5'→3' लिखा है; युग्मन प्रतिसमांतर है, अतः पूरक को उलटिए।"],
      [`5'-${ac53}-3'`, `5'-${ac53}-3'`, "The codon is complementary to the anticodon, not identical.", "कोडॉन प्रतिकोडॉन का पूरक होता है, समान नहीं।"],
      [`5'-${toT(anti)}-3'`, `5'-${toT(anti)}-3'`, "mRNA contains U, not T.", "mRNA में U होता है, T नहीं।"],
    ]);
    return mk(
      L(`A tRNA anticodon, written 5'→3', is 5'-${ac53}-3'. Which mRNA codon does it read?`, `एक tRNA प्रतिकोडॉन, 5'→3' लिखा हुआ, 5'-${ac53}-3' है। यह mRNA के किस कोडॉन को पढ़ता है?`),
      ans,
      L("Rewrite the anticodon 3'→5' and pair it base by base with a 5'→3' codon.", "प्रतिकोडॉन को 3'→5' लिखिए और 5'→3' कोडॉन से क्षार-दर-क्षार युग्म बनाइए।"),
      L(S(`Anticodon 3'→5': 3'-${compR(anti)}-5'`, `Codon: 5'-${anti}-3'`), S(`प्रतिकोडॉन 3'→5': 3'-${compR(anti)}-5'`, `कोडॉन: 5'-${anti}-3'`)),
      [tx(`5'-${ac53}-3'`)],
      [tx(L("codon", "कोडॉन"))],
    );
  },
};

// ---------------------------------------------------------------------------------------------
// Evolucija: Hardy–Weinbergovo načelo (p² + 2pq + q² = 1).
// ---------------------------------------------------------------------------------------------
const r2 = (x) => Math.round(x * 1e6) / 1e6;
const HW_INTRO = ["Assume the population is in Hardy–Weinberg equilibrium (alleles A and a, frequencies p and q).", "मान लीजिए समष्टि हार्डी-वेनबर्ग साम्य में है (युग्मविकल्पी A और a, आवृत्तियाँ p और q)।"];
const EVOLUTION_HW = {
  id: "exi-bio-evolution-hw",
  topics: [T("evolution")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    const hw = (o) => task({ formula: "p + q = 1,\\ p^2 + 2pq + q^2 = 1", ...o });
    if (level === 1) {
      if (v === 3) {
        const x = r.int(10, 60) / 100;
        const y = r.int(10, Math.round((1 - x) * 100) - 5) / 100;
        const z = r2(1 - x - y);
        const p = r2(x + y / 2);
        return task({
          text: L(`In a population, the genotype frequencies are AA = ${en(x)}, Aa = ${en(y)} and aa = ${en(z)}. What is the frequency of allele A?${roundToL(3, lang)}`, `एक समष्टि में जीनप्ररूप आवृत्तियाँ AA = ${en(x)}, Aa = ${en(y)} और aa = ${en(z)} हैं। युग्मविकल्पी A की आवृत्ति कितनी है?${roundToL(3, lang)}`),
          answer: numM(p, 3, [[x, L("Heterozygotes also carry one A allele each.", "विषमयुग्मजियों में भी एक-एक A युग्मविकल्पी होता है।")], [r2(x + y), L("Only half of the alleles in Aa are A.", "Aa के केवल आधे युग्मविकल्पी A हैं।")], [r2(1 - z), L("1 − aa counts individuals with A, not A alleles.", "1 − aa, A वाले जीवों को गिनता है, A युग्मविकल्पियों को नहीं।")]]),
          data: { given: [`AA = ${en(x)}`, `Aa = ${en(y)}`, `aa = ${en(z)}`], find: ["p"] },
          hint: L("Each AA gives two A alleles and each Aa gives one.", "प्रत्येक AA दो A युग्मविकल्पी देता है और प्रत्येक Aa एक।"),
          formula: "p = f(AA) + \\tfrac{1}{2} f(Aa)",
          solution: L(S(`$p = ${en(x)} + \\tfrac{1}{2} \\cdot ${en(y)}$`, `$p = ${en(p, 3)}$`), S(`$p = ${en(x)} + \\tfrac{1}{2} \\cdot ${en(y)}$`, `$p = ${en(p, 3)}$`)),
        });
      }
      const p = r.int(1, 9) / 10 + (r.int(0, 1) ? 0.05 : 0);
      const q = r2(1 - p);
      const P = r2(p);
      const ask = [["the frequency of allele a (q)", "युग्मविकल्पी a की आवृत्ति (q)"], ["the frequency of the aa genotype", "aa जीनप्ररूप की आवृत्ति"], ["the frequency of heterozygotes (Aa)", "विषमयुग्मजियों (Aa) की आवृत्ति"]][v];
      const ans = [q, r2(q * q), r2(2 * P * q)][v];
      const mist = [
        [[P, L("p is the frequency of A; q is the other allele.", "p, A की आवृत्ति है; q दूसरा युग्मविकल्पी है।")], [r2(1 - P * P), L("p + q = 1 is for allele frequencies, not genotypes.", "p + q = 1 युग्मविकल्पी आवृत्तियों के लिए है, जीनप्ररूपों के लिए नहीं।")]],
        [[q, L("That is the allele frequency q; the genotype aa is q².", "यह युग्मविकल्पी आवृत्ति q है; जीनप्ररूप aa = q² है।")], [r2(2 * q), L("aa needs a from both gametes: q × q, not 2q.", "aa के लिए दोनों युग्मकों से a चाहिए: q × q, 2q नहीं।")], [r2(P * P), L("That is p², the AA frequency.", "यह p² है, AA की आवृत्ति।")]],
        [[r2(P * q), L("Aa can form in two ways (A from either parent): 2pq.", "Aa दो तरह से बन सकता है (A किसी भी जनक से): 2pq।")], [r2(1 - P * P), L("That includes aa as well; subtract p² and q² from 1.", "इसमें aa भी शामिल है; 1 में से p² और q² दोनों घटाइए।")]],
      ][v];
      return hw({
        text: L(`${HW_INTRO[0]} If p = ${en(P)}, what is ${ask[0]}?${roundToL(v ? 4 : 2, lang)}`, `${HW_INTRO[1]} यदि p = ${en(P)} है, तो ${ask[1]} कितनी है?${roundToL(v ? 4 : 2, lang)}`),
        answer: numM(ans, v ? 4 : 2, mist),
        data: { given: [`p = ${en(P)}`], find: [["q", "q^2", "2pq"][v]] },
        hint: L("Start from p + q = 1.", "p + q = 1 से प्रारंभ कीजिए।"),
        solution: L(S(`$q = 1 - ${en(P)} = ${en(q)}$`, v === 1 ? `$q^2 = ${en(q)}^2 = ${en(ans)}$` : v === 2 ? `$2pq = 2 \\cdot ${en(P)} \\cdot ${en(q)} = ${en(ans)}$` : null), S(`$q = 1 - ${en(P)} = ${en(q)}$`, v === 1 ? `$q^2 = ${en(q)}^2 = ${en(ans)}$` : v === 2 ? `$2pq = 2 \\cdot ${en(P)} \\cdot ${en(q)} = ${en(ans)}$` : null)),
      });
    }
    if (level === 2) {
      if (v === 0 || v === 3) {
        const q = v === 0 ? r.int(1, 7) / 10 : r.pick([0.01, 0.02, 0.05]);
        const p = r2(1 - q);
        const q2 = r2(q * q);
        const het = r2(2 * p * q);
        const shown = v === 0 ? `${en(q2 * 100)}%` : `1 in ${en(Math.round(1 / q2))}`;
        const shownH = v === 0 ? `${en(q2 * 100)}%` : `${en(Math.round(1 / q2))} में से 1`;
        return hw({
          text: L(`${HW_INTRO[0]} A recessive trait (aa) appears in ${shown} of the population. What is the frequency of carriers (Aa)?${roundToL(4, lang)}`, `${HW_INTRO[1]} एक अप्रभावी लक्षण (aa) समष्टि के ${shownH} में दिखता है। वाहकों (Aa) की आवृत्ति कितनी है?${roundToL(4, lang)}`),
          answer: numM(het, 4, [[q, L("That is q, the allele frequency, not the carrier frequency.", "यह युग्मविकल्पी आवृत्ति q है, वाहक आवृत्ति नहीं।")], [r2(p * q), L("Carriers can form in two ways: 2pq.", "वाहक दो तरह से बनते हैं: 2pq।")], [r2(2 * q2 * (1 - q2)), L("Take the square root of q² first to get q.", "पहले q² का वर्गमूल लेकर q ज्ञात कीजिए।")]]),
          data: { given: [v === 0 ? `q^2 = ${en(q2 * 100)}\\%` : `q^2 = 1/${en(Math.round(1 / q2))}`], find: ["2pq"] },
          hint: L("The recessive phenotype frequency is q².", "अप्रभावी लक्षणप्ररूप की आवृत्ति q² है।"),
          solution: L(S(`$q = \\sqrt{${en(q2)}} = ${en(q)}$, $p = ${en(p)}$`, `$2pq = 2 \\cdot ${en(p)} \\cdot ${en(q)} = ${en(het)}$`), S(`$q = \\sqrt{${en(q2)}} = ${en(q)}$, $p = ${en(p)}$`, `$2pq = 2 \\cdot ${en(p)} \\cdot ${en(q)} = ${en(het)}$`)),
        });
      }
      if (v === 1) {
        const N = 50 * r.int(4, 40);
        const nAA = r.int(Math.round(N * 0.1), Math.round(N * 0.5));
        const nAa = r.int(Math.round(N * 0.1), N - nAA - Math.round(N * 0.05));
        const naa = N - nAA - nAa;
        const p = r2((2 * nAA + nAa) / (2 * N));
        return task({
          text: L(`A population of ${N} plants has ${nAA} AA, ${nAa} Aa and ${naa} aa individuals. What is the frequency of allele A?${roundToL(3, lang)}`, `${N} पौधों की एक समष्टि में ${nAA} AA, ${nAa} Aa और ${naa} aa पौधे हैं। युग्मविकल्पी A की आवृत्ति कितनी है?${roundToL(3, lang)}`),
          answer: numM(p, 3, [[r2((nAA + nAa) / N), L("That counts plants carrying A, not A alleles.", "यह A वाले पौधों को गिनता है, A युग्मविकल्पियों को नहीं।")], [r2(nAA / N), L("Heterozygotes also carry one A allele each.", "विषमयुग्मजियों में भी एक-एक A युग्मविकल्पी होता है।")], [r2((nAA + nAa / 2) / (2 * N)), L("Each AA plant has two A alleles; there are 2N alleles in all.", "प्रत्येक AA पौधे में दो A युग्मविकल्पी हैं; कुल 2N युग्मविकल्पी हैं।")]]),
          data: { given: [`N = ${N}`, `AA = ${nAA},\\ Aa = ${nAa},\\ aa = ${naa}`], find: ["p"] },
          hint: L("Count A alleles: two per AA, one per Aa. Divide by all alleles (2N).", "A युग्मविकल्पी गिनिए: प्रति AA दो, प्रति Aa एक। सभी युग्मविकल्पियों (2N) से भाग दीजिए।"),
          formula: "p = \\dfrac{2N_{AA} + N_{Aa}}{2N}",
          solution: L(S(`A alleles: $2 \\cdot ${nAA} + ${nAa} = ${2 * nAA + nAa}$`, `All alleles: $2 \\cdot ${N} = ${2 * N}$`, `$p = ${2 * nAA + nAa}/${2 * N} = ${en(p, 3)}$`), S(`A युग्मविकल्पी: $2 \\cdot ${nAA} + ${nAa} = ${2 * nAA + nAa}$`, `सभी युग्मविकल्पी: $2 \\cdot ${N} = ${2 * N}$`, `$p = ${2 * nAA + nAa}/${2 * N} = ${en(p, 3)}$`)),
        });
      }
      const q = r.pick([0.05, 0.1, 0.2, 0.3]);
      const N = 400 * r.int(5, 50);
      const p = r2(1 - q);
      const k = Math.round(q * q * N);
      const ans = Math.round(2 * p * q * N);
      return hw({
        text: L(`${HW_INTRO[0]} In a town of ${N} people, ${k} have a recessive autosomal disorder (aa). How many carriers (Aa) are expected?`, `${HW_INTRO[1]} ${N} लोगों के एक नगर में ${k} लोगों को एक अप्रभावी अलिंगसूत्री विकार (aa) है। कितने वाहक (Aa) होने की अपेक्षा है?`),
        answer: numM(ans, 0, [[Math.round(q * N), L("q·N is not a count of people; carriers are 2pq·N.", "q·N लोगों की संख्या नहीं है; वाहक 2pq·N हैं।")], [Math.round(p * q * N), L("Carriers can form in two ways: 2pq.", "वाहक दो तरह से बनते हैं: 2pq।")], [N - k, L("Not everyone without the disorder is a carrier; some are AA.", "रोग-रहित सभी लोग वाहक नहीं होते; कुछ AA होते हैं।")]]),
        data: { given: [`N = ${N}`, `N_{aa} = ${k}`], find: ["N_{Aa}"] },
        hint: L("Find q² = (affected)/N, then q, p and 2pq.", "q² = (रोगी)/N ज्ञात कीजिए, फिर q, p और 2pq।"),
        solution: L(S(`$q^2 = ${k}/${N} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$2pq = ${en(r2(2 * p * q))}$`, `$N_{Aa} = ${en(r2(2 * p * q))} \\cdot ${N} = ${ans}$`), S(`$q^2 = ${k}/${N} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$2pq = ${en(r2(2 * p * q))}$`, `$N_{Aa} = ${en(r2(2 * p * q))} \\cdot ${N} = ${ans}$`)),
      });
    }
    // Raven 3
    if (v === 0) {
      const q = r.int(1, 8) / 10;
      const p = r2(1 - q);
      const dom = r2(1 - q * q);
      const het = r2(2 * p * q);
      return hw({
        text: L(`${HW_INTRO[0]} ${en(r2(dom * 100))}% of the individuals show the dominant phenotype. What percentage of the population is heterozygous?${roundToL(0, lang)}`, `${HW_INTRO[1]} ${en(r2(dom * 100))}% जीव प्रभावी लक्षणप्ररूप दिखाते हैं। समष्टि का कितना प्रतिशत विषमयुग्मजी है?${roundToL(0, lang)}`),
        answer: numM(r2(het * 100), 0, [[r2(2 * dom * (1 - dom) * 100), L("The dominant fraction is not p; first find q from q² = 1 − (dominant).", "प्रभावी भाग p नहीं है; पहले q² = 1 − (प्रभावी) से q ज्ञात कीजिए।")], [r2(q * 100), L("That is q × 100, the allele frequency of a.", "यह q × 100 है, a की युग्मविकल्पी आवृत्ति।")], [r2(p * p * 100), L("That is p², the homozygous dominant part.", "यह p² है, समयुग्मजी प्रभावी भाग।")]]),
        data: { given: [`p^2 + 2pq = ${en(r2(dom * 100))}\\%`], find: ["2pq\\ (\\%)"] },
        hint: L("The recessive phenotype is the rest: q² = 1 − (dominant).", "अप्रभावी लक्षणप्ररूप शेष भाग है: q² = 1 − (प्रभावी)।"),
        solution: L(S(`$q^2 = 1 - ${en(dom)} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$2pq = 2 \\cdot ${en(p)} \\cdot ${en(q)} = ${en(het)}$ = ${en(r2(het * 100))}%`), S(`$q^2 = 1 - ${en(dom)} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$2pq = 2 \\cdot ${en(p)} \\cdot ${en(q)} = ${en(het)}$ = ${en(r2(het * 100))}%`)),
      });
    }
    if (v === 1) {
      const q = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      const p = r2(1 - q);
      const ans = r2((2 * q) / (1 + q));
      return hw({
        text: L(`${HW_INTRO[0]} For a recessive trait, q = ${en(q)}. A person picked at random shows the dominant phenotype. What is the probability that this person is a carrier (Aa)?${roundToL(3, lang)}`, `${HW_INTRO[1]} एक अप्रभावी लक्षण के लिए q = ${en(q)} है। यादृच्छिक रूप से चुना गया एक व्यक्ति प्रभावी लक्षणप्ररूप दिखाता है। उसके वाहक (Aa) होने की प्रायिकता क्या है?${roundToL(3, lang)}`),
        answer: numM(ans, 3, [[r2(2 * p * q), L("The person is known to be normal: divide 2pq by p² + 2pq.", "व्यक्ति सामान्य ज्ञात है: 2pq को p² + 2pq से भाग दीजिए।")], [q, L("That is the allele frequency q.", "यह युग्मविकल्पी आवृत्ति q है।")], [r2(1 - ans), L("That is the probability of AA among the normal people.", "यह सामान्य लोगों में AA की प्रायिकता है।")]]),
        data: { given: [`q = ${en(q)}`], find: [`P(Aa\\mid ${tx(L("dominant", "प्रभावी"))})`] },
        hint: L("Restrict to people with the dominant phenotype (AA or Aa).", "केवल प्रभावी लक्षणप्ररूप वाले (AA या Aa) लोगों पर विचार कीजिए।"),
        formula: "P = \\dfrac{2pq}{p^2 + 2pq} = \\dfrac{2q}{1 + q}",
        solution: L(S(`$p^2 = ${en(r2(p * p))}$, $2pq = ${en(r2(2 * p * q))}$`, `$P = \\dfrac{${en(r2(2 * p * q))}}{${en(r2(p * p))} + ${en(r2(2 * p * q))}} = ${en(ans, 3)}$`), S(`$p^2 = ${en(r2(p * p))}$, $2pq = ${en(r2(2 * p * q))}$`, `$P = \\dfrac{${en(r2(2 * p * q))}}{${en(r2(p * p))} + ${en(r2(2 * p * q))}} = ${en(ans, 3)}$`)),
      });
    }
    if (v === 2) {
      const k = r.pick([2, 3, 4, 5, 9, 10]);
      const q = 1 / k;
      const c = (2 * q) / (1 + q);
      return hw({
        text: L(`${HW_INTRO[0]} For an autosomal recessive disorder, $q = ${fracTex(1, k)}$. Two unrelated people without the disorder marry. What is the probability that their first child has the disorder?`, `${HW_INTRO[1]} एक अलिंगसूत्री अप्रभावी विकार के लिए $q = ${fracTex(1, k)}$ है। विकार-रहित दो असंबंधित व्यक्ति विवाह करते हैं। उनकी पहली संतान को विकार होने की प्रायिकता क्या है?`),
        answer: fractionM(1, (k + 1) ** 2, [[(((k - 1) / k) * q) ** 2, L("The parents are known to be normal: use P(carrier | normal) = 2q/(1 + q), not 2pq.", "जनक सामान्य ज्ञात हैं: P(वाहक | सामान्य) = 2q/(1 + q) लीजिए, 2pq नहीं।")], [q * q, L("q² is for a random person, not for a child of two normal parents.", "q² यादृच्छिक व्यक्ति के लिए है, दो सामान्य जनकों की संतान के लिए नहीं।")], [c / 4, L("Both parents must be carriers: square the carrier probability.", "दोनों जनकों को वाहक होना चाहिए: वाहक प्रायिकता का वर्ग लीजिए।")]]),
        data: { given: [`q = ${fracTex(1, k)}`], find: ["P(aa)"] },
        hint: L("Find the chance that a normal person is a carrier, for each parent; then use carrier × carrier → 1/4.", "प्रत्येक जनक के लिए सामान्य व्यक्ति के वाहक होने की प्रायिकता ज्ञात कीजिए; फिर वाहक × वाहक → 1/4।"),
        formula: "P = \\left(\\dfrac{2q}{1+q}\\right)^2 \\cdot \\dfrac{1}{4}",
        solution: L(S(`$P(\\text{carrier} \\mid \\text{normal}) = \\dfrac{2q}{1+q} = ${fracTex(2, k + 1)}$`, `$P = ${fracTex(2, k + 1)} \\cdot ${fracTex(2, k + 1)} \\cdot \\tfrac{1}{4} = ${fracTex(1, (k + 1) ** 2)}$`), S(`$P(\\text{वाहक} \\mid \\text{सामान्य}) = \\dfrac{2q}{1+q} = ${fracTex(2, k + 1)}$`, `$P = ${fracTex(2, k + 1)} \\cdot ${fracTex(2, k + 1)} \\cdot \\tfrac{1}{4} = ${fracTex(1, (k + 1) ** 2)}$`)),
      });
    }
    const q = r.pick([0.1, 0.2, 0.3, 0.4]);
    const N = 100 * r.int(10, 80);
    const p = r2(1 - q);
    const naa = Math.round(q * q * N);
    const ans = Math.round(p * p * N);
    return hw({
      text: L(`${HW_INTRO[0]} In a population of ${N}, ${naa} individuals show a recessive trait (aa). How many individuals are expected to be homozygous dominant (AA)?`, `${HW_INTRO[1]} ${N} की एक समष्टि में ${naa} जीव एक अप्रभावी लक्षण (aa) दिखाते हैं। कितने जीवों के समयुग्मजी प्रभावी (AA) होने की अपेक्षा है?`),
      answer: numM(ans, 0, [[N - naa, L("That counts all dominant-looking individuals, including Aa.", "इसमें Aa सहित प्रभावी दिखने वाले सभी जीव गिने गए।")], [Math.round(2 * p * q * N), L("That is the number of heterozygotes (2pq·N).", "यह विषमयुग्मजियों की संख्या (2pq·N) है।")], [Math.round(p * N), L("p is an allele frequency; AA needs p².", "p युग्मविकल्पी आवृत्ति है; AA के लिए p² चाहिए।")]]),
      data: { given: [`N = ${N}`, `N_{aa} = ${naa}`], find: ["N_{AA}"] },
      hint: L("q² = aa/N; find q, then p, then p²·N.", "q² = aa/N; q ज्ञात कीजिए, फिर p, फिर p²·N।"),
      solution: L(S(`$q^2 = ${naa}/${N} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$N_{AA} = ${en(p)}^2 \\cdot ${N} = ${ans}$`), S(`$q^2 = ${naa}/${N} = ${en(r2(q * q))}$ → $q = ${en(q)}$, $p = ${en(p)}$`, `$N_{AA} = ${en(p)}^2 \\cdot ${N} = ${ans}$`)),
    });
  },
};

// ---------------------------------------------------------------------------------------------
// Biotehnologija: PCR (2ⁿ), restrikcijski fragmenti, mesta EcoRI (GAATTC), palindromi, gelska elektroforeza.
// ---------------------------------------------------------------------------------------------
const revComp = (s) => rev(compD(s));
const countSite = (s, site) => {
  let n = 0;
  for (let i = 0; i + site.length <= s.length; i++) if (s.slice(i, i + site.length) === site) n++;
  return n;
};
const BIOTECH_CALC = {
  id: "exi-bio-biotech-calc",
  topics: [T("biotechnology")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, level === 1 ? 2 : 3);
    const m = r.pick([1, 2, 3, 4, 5, 10]);
    const n = r.int(3, 10);
    const shape = r.int(0, 1); // 0 linearna, 1 krožna (plazmid)
    const a = r.int(1, 3);
    const b = r.int(1, 3);
    // zaporedje z mesti EcoRI in vabo
    const k = r.int(1, 3);
    const decoy = r.pick(["GAATTG", "CTTAAG", "GATATC", "GTATTC"]);
    const fillers = Array.from({ length: k + 2 }, () => Array.from({ length: r.int(2, 4) }, () => r.pick(["A", "C", "G", "T"])).join(""));
    const dPos = r.int(0, k);
    const x3 = Array.from({ length: 3 }, () => r.pick(["A", "C", "G", "T"]));
    const rnd6 = Array.from({ length: 6 }, () => r.pick(["A", "C", "G", "T"])).join("");
    const N = 100 * r.int(10, 50);
    const shapeTxt = shape ? ["a circular plasmid", "एक वृत्ताकार प्लाज्मिड"] : ["a linear DNA molecule", "एक रैखिक DNA अणु"];
    if (v === 0 && level === 1) {
      const ans = m * 2 ** n;
      return task({
        text: L(`A PCR starts with ${m} copies of a DNA segment. Assuming every cycle doubles the DNA, how many copies are there after ${n} cycles?`, `PCR ${m} प्रतियों वाले एक DNA खंड से प्रारंभ होता है। यदि प्रत्येक चक्र DNA को दोगुना करे, तो ${n} चक्रों के बाद कितनी प्रतियाँ होंगी?`),
        answer: numM(ans, 0, [[2 * m * n, L("Each cycle doubles the amount: use powers of 2, not 2 × n.", "प्रत्येक चक्र मात्रा को दोगुना करता है: 2 × n नहीं, 2 की घात लीजिए।")], [m * 2 ** (n - 1), L(`After ${n} cycles the DNA has doubled ${n} times, not ${n - 1}.`, `${n} चक्रों के बाद DNA ${n} बार दोगुना होता है, ${n - 1} बार नहीं।`)], [m * n ** 2, L("The growth is 2ⁿ, not n².", "वृद्धि 2ⁿ है, n² नहीं।")]]),
        data: { given: [`N_0 = ${m}`, `n = ${n}`], find: ["N"] },
        hint: L("Each cycle (denaturation, annealing, extension) doubles the number of copies.", "प्रत्येक चक्र (विकृतीकरण, तापानुशीतन, प्रसार) प्रतियों की संख्या दोगुनी करता है।"),
        formula: "N = N_0 \\cdot 2^n",
        solution: L(S(`$N = ${m} \\cdot 2^{${n}}$`, `$N = ${m} \\cdot ${2 ** n} = ${ans}$`), S(`$N = ${m} \\cdot 2^{${n}}$`, `$N = ${m} \\cdot ${2 ** n} = ${ans}$`)),
      });
    }
    if (v === 1 && level === 1) {
      const ans = shape ? a : a + 1;
      return task({
        text: L(`EcoRI has ${a} recognition site${a > 1 ? "s" : ""} in ${shapeTxt[0]}. How many fragments are formed when the DNA is completely digested with EcoRI?`, `${shapeTxt[1]} में EcoRI के ${a} पहचान स्थल हैं। EcoRI से पूर्ण पाचन पर कितने खंड बनेंगे?`),
        answer: numM(ans, 0, [[shape ? a + 1 : a, L(shape ? "A circle has no free ends: k cuts give k pieces." : "A linear molecule cut k times gives k + 1 pieces.", shape ? "वृत्त के मुक्त सिरे नहीं होते: k कटाव से k खंड बनते हैं।" : "रैखिक अणु k बार कटने पर k + 1 खंड देता है।")], [2 * a, L("EcoRI cuts both strands at each site, but that is one break per site.", "EcoRI हर स्थल पर दोनों रज्जुकों को काटता है, पर यह प्रति स्थल एक ही विच्छेद है।")]]),
        data: { given: [`k = ${a}`, tx(L(shape ? "circular" : "linear", shape ? "वृत्ताकार" : "रैखिक"))], find: [`N_{${tx(L("fragments", "खंड"))}}`] },
        hint: L("Draw the molecule and mark the cuts.", "अणु बनाइए और कटाव चिह्नित कीजिए।"),
        formula: shape ? "N = k" : "N = k + 1",
        solution: L(S(shape ? "A circular molecule: each cut opens it; k cuts → k fragments." : "A linear molecule: k cuts → k + 1 fragments.", `$N = ${ans}$`), S(shape ? "वृत्ताकार अणु: k कटाव → k खंड।" : "रैखिक अणु: k कटाव → k + 1 खंड।", `$N = ${ans}$`)),
      });
    }
    if (v === 2 && level <= 2) {
      const parts = [];
      for (let i = 0; i <= k; i++) {
        parts.push(fillers[i]);
        if (i === dPos) parts.push(decoy);
        if (i < k) parts.push("GAATTC");
      }
      parts.push(fillers[k + 1]);
      const seq = parts.join("");
      const sites = countSite(seq, "GAATTC");
      const askFr = level === 2;
      const ans = askFr ? sites + 1 : sites;
      const blocks = seq.match(/.{1,10}/g).join(" ");
      const decoyWhy = [`${decoy} is not the EcoRI site GAATTC.`, `${decoy} EcoRI का स्थल GAATTC नहीं है।`];
      return task({
        text: askFr
          ? L(`One strand of a linear DNA reads 5'-${blocks}-3' (spaces only for reading). EcoRI recognises 5'-GAATTC-3'. How many fragments form on complete digestion with EcoRI?`, `एक रैखिक DNA का एक रज्जुक 5'-${blocks}-3' है (रिक्त स्थान केवल पढ़ने के लिए)। EcoRI 5'-GAATTC-3' पहचानता है। EcoRI से पूर्ण पाचन पर कितने खंड बनेंगे?`)
          : L(`One strand of a DNA segment reads 5'-${blocks}-3' (spaces only for reading). EcoRI recognises 5'-GAATTC-3'. How many EcoRI sites does the segment have?`, `एक DNA खंड का एक रज्जुक 5'-${blocks}-3' है (रिक्त स्थान केवल पढ़ने के लिए)। EcoRI 5'-GAATTC-3' पहचानता है। खंड में EcoRI के कितने स्थल हैं?`),
        answer: numM(ans, 0, [[ans + 1, L(...decoyWhy)], [askFr ? sites : sites + 1, L(askFr ? "A linear molecule cut k times gives k + 1 fragments." : "The question asks for sites, not fragments.", askFr ? "रैखिक अणु k बार कटने पर k + 1 खंड देता है।" : "प्रश्न स्थल पूछता है, खंड नहीं।")], [askFr ? 2 * sites + 1 : 2 * sites, L("GAATTC is a palindrome: the other strand reads the same at the same place, so it is one site.", "GAATTC पैलिंड्रोम है: दूसरा रज्जुक उसी स्थान पर वही पढ़ता है, अतः यह एक ही स्थल है।")]]),
        data: { given: [tx(`5'-${seq}-3'`), "\\text{EcoRI: GAATTC}"], find: [askFr ? `N_{${tx(L("fragments", "खंड"))}}` : `N_{${tx(L("sites", "स्थल"))}}`] },
        hint: L("Scan the strand for GAATTC exactly; look-alikes do not count.", "रज्जुक में ठीक GAATTC खोजिए; मिलते-जुलते अनुक्रम नहीं गिने जाते।"),
        formula: askFr ? "N = k + 1" : "k = \\#\\,\\text{GAATTC}",
        solution: L(S(`GAATTC occurs ${sites} time${sites > 1 ? "s" : ""}; ${decoy} is not a site.`, askFr ? `Fragments: $${sites} + 1 = ${ans}$` : `Sites: $${sites}$`), S(`GAATTC ${sites} बार आता है; ${decoy} स्थल नहीं है।`, askFr ? `खंड: $${sites} + 1 = ${ans}$` : `स्थल: $${sites}$`)),
      });
    }
    if (level === 2 && v === 0) {
      const M = m * 2 ** n;
      return task({
        text: L(`A PCR starts with ${m} cop${m > 1 ? "ies" : "y"} of a gene. How many cycles are needed to obtain ${M} copies, if each cycle doubles the DNA?`, `PCR एक जीन की ${m} प्रति${m > 1 ? "यों" : ""} से प्रारंभ होता है। यदि प्रत्येक चक्र DNA दोगुना करे, तो ${M} प्रतियाँ पाने के लिए कितने चक्र चाहिए?`),
        answer: numM(n, 0, [[M / m / 2, L("Copies double each cycle; solve 2ⁿ = M/N₀ with a logarithm, not by halving.", "प्रतियाँ हर चक्र में दोगुनी होती हैं; 2ⁿ = M/N₀ हल कीजिए, आधा करके नहीं।")], [n + 1, L("Divide by the starting copies first.", "पहले प्रारंभिक प्रतियों से भाग दीजिए।")], [n - 1, L("Count the doublings: after 1 cycle there are 2 × N₀ copies.", "दोगुना होने की संख्या गिनिए: 1 चक्र के बाद 2 × N₀ प्रतियाँ होती हैं।")]]),
        data: { given: [`N_0 = ${m}`, `N = ${M}`], find: ["n"] },
        hint: L("Find how many times the starting amount must double.", "ज्ञात कीजिए कि प्रारंभिक मात्रा को कितनी बार दोगुना होना है।"),
        formula: "2^n = \\dfrac{N}{N_0}",
        solution: L(S(`$2^n = ${M}/${m} = ${2 ** n}$`, `$n = ${n}$`), S(`$2^n = ${M}/${m} = ${2 ** n}$`, `$n = ${n}$`)),
      });
    }
    if (level === 2 && v === 1) {
      const ans = shape ? a + b : a + b + 1;
      return task({
        text: L(`${cap(shapeTxt[0])} has ${a} site${a > 1 ? "s" : ""} for BamHI and ${b} site${b > 1 ? "s" : ""} for EcoRI (no overlaps). How many fragments are formed when it is digested completely with both enzymes together?`, `${shapeTxt[1]} में BamHI के ${a} और EcoRI के ${b} स्थल हैं (कोई अतिव्यापन नहीं)। दोनों एंजाइमों से एक साथ पूर्ण पाचन पर कितने खंड बनेंगे?`),
        answer: numM(ans, 0, [[a * b, L("The cuts add up; do not multiply the numbers of sites.", "कटाव जुड़ते हैं; स्थलों की संख्याओं का गुणा मत कीजिए।")], [shape ? a + b + 1 : a + b, L(shape ? "A circular molecule has no free ends: k cuts give k fragments." : "A linear molecule cut k times gives k + 1 fragments.", shape ? "वृत्ताकार अणु के मुक्त सिरे नहीं होते: k कटाव से k खंड।" : "रैखिक अणु k बार कटने पर k + 1 खंड देता है।")], [shape ? a + b + 2 : a + b + 2, L("Count all cuts of both enzymes together, not each digest separately.", "दोनों एंजाइमों के सभी कटाव एक साथ गिनिए, अलग-अलग पाचन नहीं।")]]),
        data: { given: [`k_{BamHI} = ${a}`, `k_{EcoRI} = ${b}`, tx(L(shape ? "circular" : "linear", shape ? "वृत्ताकार" : "रैखिक"))], find: [`N_{${tx(L("fragments", "खंड"))}}`] },
        hint: L("Add the cuts of both enzymes, then use the rule for the shape of the molecule.", "दोनों एंजाइमों के कटाव जोड़िए, फिर अणु के आकार का नियम लगाइए।"),
        formula: shape ? "N = k" : "N = k + 1",
        solution: L(S(`Cuts: $k = ${a} + ${b} = ${a + b}$`, `$N = ${ans}$`), S(`कटाव: $k = ${a} + ${b} = ${a + b}$`, `$N = ${ans}$`)),
      });
    }
    if (level === 2) {
      if (x3[0] === x3[2]) x3[2] = DC[x3[0]];
      const x = x3.join("");
      const pal = x + revComp(x);
      const mirror = x + rev(x);
      const notRev = x + compD(x);
      let rnd = rnd6;
      if (rnd === revComp(rnd) || [pal, mirror, notRev].includes(rnd)) rnd = rnd.slice(0, 5) + (rnd[5] === "A" ? "C" : "A");
      if (rnd === revComp(rnd) || [pal, mirror, notRev].includes(rnd)) rnd = "ACGGTA" === pal ? "TTGCAC" : "ACGGTA";
      const ans = mc(r, L, [`5'-${pal}-3'`, `5'-${pal}-3'`], [
        [`5'-${mirror}-3'`, `5'-${mirror}-3'`, "This reads the same backwards on one strand, but the complementary strand read 5'→3' is different.", "यह एक ही रज्जुक पर उलटा पढ़ने पर समान है, पर पूरक रज्जुक 5'→3' पढ़ने पर भिन्न है।"],
        [`5'-${notRev}-3'`, `5'-${notRev}-3'`, "The second half is the complement, but it must also be reversed.", "दूसरा आधा पूरक तो है, पर उसे उलटा भी होना चाहिए।"],
        [`5'-${rnd}-3'`, `5'-${rnd}-3'`, "Its complementary strand read 5'→3' is a different sequence.", "इसका पूरक रज्जुक 5'→3' पढ़ने पर भिन्न अनुक्रम है।"],
      ]);
      return task({
        text: L("Restriction enzymes recognise palindromic sequences. Which of these (one strand shown) is a palindrome in the sense used for DNA?", "प्रतिबंधन एंजाइम पैलिंड्रोमी अनुक्रम पहचानते हैं। इनमें से कौन-सा (एक रज्जुक दिखाया गया) DNA के अर्थ में पैलिंड्रोम है?"),
        answer: ans,
        data: { given: [tx(L("palindrome: both strands read the same 5'→3'", "पैलिंड्रोम: दोनों रज्जुक 5'→3' समान पढ़ते हैं"))], find: [tx(L("palindrome", "पैलिंड्रोम"))] },
        hint: L("Write the complementary strand of each option and read it 5'→3'.", "प्रत्येक विकल्प का पूरक रज्जुक लिखिए और उसे 5'→3' पढ़िए।"),
        formula: "s = \\overline{s}^{\\,R}",
        solution: L(S(`5'-${pal}-3'`, `3'-${compD(pal)}-5'`, `Read 5'→3', the lower strand is ${revComp(pal)}: the same sequence.`), S(`5'-${pal}-3'`, `3'-${compD(pal)}-5'`, `नीचे वाला रज्जुक 5'→3' पढ़ने पर ${revComp(pal)} है: वही अनुक्रम।`)),
      });
    }
    // Raven 3
    if (v === 0) {
      let c1 = 50 * r.int(2, N / 50 - 4);
      let c2 = 50 * r.int(c1 / 50 + 2, N / 50 - 2);
      let fr = [c1, c2 - c1, N - c2];
      if (new Set(fr).size < 3) {
        c2 += 50;
        fr = [c1, c2 - c1, N - c2];
      }
      const far = r.int(0, 1) === 1;
      const sorted = [...fr].sort((x, y) => x - y);
      const ans = far ? sorted[0] : sorted[2];
      return task({
        text: L(`A linear DNA of ${N} bp is cut by a restriction enzyme at ${c1} bp and ${c2} bp from the left end. The fragments are separated by agarose gel electrophoresis. What is the length (in bp) of the band ${far ? "farthest from" : "nearest to"} the well?`, `${N} bp के एक रैखिक DNA को प्रतिबंधन एंजाइम बाएँ सिरे से ${c1} bp और ${c2} bp पर काटता है। खंडों को ऐगारोज़ जेल वैद्युतकणसंचलन से अलग किया गया। कूप से ${far ? "सबसे दूर" : "सबसे पास"} वाले बैंड की लंबाई (bp में) कितनी है?`),
        answer: numM(ans, 0, [[far ? sorted[2] : sorted[0], L("Smaller fragments move farther through the gel; larger ones stay near the well.", "छोटे खंड जेल में अधिक दूर जाते हैं; बड़े कूप के पास रहते हैं।")], [sorted[1], L("That is the middle band.", "यह बीच वाला बैंड है।")], [c2, L(`${c2} bp is a cut position, not a fragment length.`, `${c2} bp कटाव का स्थान है, खंड की लंबाई नहीं।`)]]),
        data: { given: [`l = ${N}\\ \\mathrm{bp}`, `${tx(L("cuts", "कटाव"))}: ${c1},\\ ${c2}`], find: ["l\\ (\\mathrm{bp})"] },
        hint: L("Find the three fragment lengths; then recall which sizes move farther in the gel.", "तीनों खंडों की लंबाइयाँ ज्ञात कीजिए; फिर याद कीजिए कि जेल में कौन-से आकार अधिक दूर जाते हैं।"),
        formula: "l_1 = c_1,\\ l_2 = c_2 - c_1,\\ l_3 = l - c_2",
        solution: L(S(`Fragments: ${fr.join(", ")} bp`, far ? "DNA moves towards the anode; the smallest fragment moves farthest." : "The largest fragment moves least and stays nearest the well.", `Answer: ${ans} bp`), S(`खंड: ${fr.join(", ")} bp`, far ? "DNA ऐनोड की ओर चलता है; सबसे छोटा खंड सबसे दूर जाता है।" : "सबसे बड़ा खंड सबसे कम चलता है और कूप के सबसे पास रहता है।", `उत्तर: ${ans} bp`)),
      });
    }
    if (v === 1) {
      const ans = m * (2 ** n - 1);
      return task({
        text: L(`A PCR starts with ${m} double-stranded cop${m > 1 ? "ies" : "y"} of a gene and runs for ${n} cycles, each doubling the DNA. How many new double-stranded copies have been synthesised (not counting the original ones)?`, `PCR एक जीन की ${m} द्विरज्जुकी प्रति${m > 1 ? "यों" : ""} से प्रारंभ होकर ${n} चक्र चलता है, प्रत्येक चक्र DNA दोगुना करता है। कितनी नई द्विरज्जुकी प्रतियाँ संश्लेषित हुईं (मूल प्रतियों को छोड़कर)?`),
        answer: numM(ans, 0, [[m * 2 ** n, L("Subtract the original copies; they were not newly made.", "मूल प्रतियाँ घटाइए; वे नई नहीं बनीं।")], [m * (2 ** (n - 1)), L(`That is the number made in the last cycle only.`, "यह केवल अंतिम चक्र में बनी संख्या है।")], [m * (2 ** n - 2), L("Only the original copies are subtracted, not one cycle's worth.", "केवल मूल प्रतियाँ घटाई जाती हैं, एक चक्र की संख्या नहीं।")]]),
        data: { given: [`N_0 = ${m}`, `n = ${n}`], find: [`N_{${tx(L("new", "नई"))}}`] },
        hint: L("Find the total after n cycles, then remove the starting copies.", "n चक्रों के बाद कुल ज्ञात कीजिए, फिर प्रारंभिक प्रतियाँ हटाइए।"),
        formula: "N_{new} = N_0(2^n - 1)",
        solution: L(S(`Total: $${m} \\cdot 2^{${n}} = ${m * 2 ** n}$`, `New: $${m * 2 ** n} - ${m} = ${ans}$`), S(`कुल: $${m} \\cdot 2^{${n}} = ${m * 2 ** n}$`, `नई: $${m * 2 ** n} - ${m} = ${ans}$`)),
      });
    }
    if (v === 2) {
      const P = 100 * r.int(30, 80);
      const pa = 100 * r.int(1, 8);
      const d = 100 * r.int(5, P / 100 - 10);
      const pb = pa + d;
      const fr = [d, P - d];
      const small = Math.min(...fr);
      const big = Math.max(...fr);
      const askSmall = r.int(0, 1) === 1 || small === big;
      const ans = askSmall ? small : big;
      return task({
        text: L(`A circular plasmid of ${P} bp has one EcoRI site at position ${pa} and one BamHI site at position ${pb}. It is digested with both enzymes. What is the length (in bp) of the ${askSmall ? "smaller" : "larger"} fragment?`, `${P} bp के एक वृत्ताकार प्लाज्मिड में स्थान ${pa} पर एक EcoRI स्थल और स्थान ${pb} पर एक BamHI स्थल है। दोनों एंजाइमों से पाचन किया गया। ${askSmall ? "छोटे" : "बड़े"} खंड की लंबाई (bp में) कितनी है?`),
        answer: numM(ans, 0, [[askSmall ? big : small, L(`That is the ${askSmall ? "larger" : "smaller"} fragment.`, `यह ${askSmall ? "बड़ा" : "छोटा"} खंड है।`)], [pb, L("Position numbers are not lengths; subtract positions.", "स्थान संख्याएँ लंबाई नहीं हैं; स्थानों का अंतर लीजिए।")], [P - pb, L("A circle has no ends: two cuts give two fragments, between the sites both ways round.", "वृत्त के सिरे नहीं होते: दो कटाव से दो खंड बनते हैं, दोनों स्थलों के बीच दोनों ओर।")]]),
        data: { given: [`P = ${P}\\ \\mathrm{bp}`, `EcoRI: ${pa}`, `BamHI: ${pb}`], find: ["l\\ (\\mathrm{bp})"] },
        hint: L("Two cuts on a circle give two fragments: one between the sites, the other going round the rest.", "वृत्त पर दो कटाव दो खंड देते हैं: एक स्थलों के बीच, दूसरा शेष घेरे में।"),
        formula: "l_1 = p_2 - p_1,\\ l_2 = P - l_1",
        solution: L(S(`$l_1 = ${pb} - ${pa} = ${d}$ bp`, `$l_2 = ${P} - ${d} = ${P - d}$ bp`, `Answer: ${ans} bp`), S(`$l_1 = ${pb} - ${pa} = ${d}$ bp`, `$l_2 = ${P} - ${d} = ${P - d}$ bp`, `उत्तर: ${ans} bp`)),
      });
    }
    // lepljivi konci in fragmenti z dvema encimoma na linearni DNA
    const e = shape ? a : a + 1; // brez shape vsaj dve mesti
    const ans = shape ? a + b + 1 : e - 1;
    return task({
      text: shape
        ? L(`A linear DNA has ${a} EcoRI site${a > 1 ? "s" : ""} and ${b} BamHI site${b > 1 ? "s" : ""}. It is first cut with EcoRI, then the fragments are cut with BamHI. How many fragments are there at the end?`, `एक रैखिक DNA में EcoRI के ${a} और BamHI के ${b} स्थल हैं। पहले इसे EcoRI से काटा गया, फिर खंडों को BamHI से काटा गया। अंत में कितने खंड होंगे?`)
        : L(`A linear DNA with ${e} EcoRI sites is cut with EcoRI. How many fragments carry sticky ends at both of their ends?`, `EcoRI के ${e} स्थलों वाले एक रैखिक DNA को EcoRI से काटा गया। कितने खंडों के दोनों सिरों पर चिपचिपे सिरे होंगे?`),
      answer: shape
        ? numM(ans, 0, [[(a + 1) * (b + 1), L("Each new cut adds one fragment; do not multiply.", "प्रत्येक नया कटाव एक खंड जोड़ता है; गुणा मत कीजिए।")], [a + b, L("A linear molecule cut k times gives k + 1 fragments.", "रैखिक अणु k बार कटने पर k + 1 खंड देता है।")], [a + b + 2, L("The order of digestion does not matter: total cuts + 1.", "पाचन का क्रम मायने नहीं रखता: कुल कटाव + 1।")]])
        : numM(e - 1, 0, [[e + 1, L("The two end fragments each keep one original end of the molecule.", "दोनों छोर वाले खंडों में अणु का एक-एक मूल सिरा रहता है।")], [e, L("Only fragments between two cut sites have sticky ends on both sides.", "केवल दो कटाव स्थलों के बीच के खंडों के दोनों ओर चिपचिपे सिरे होते हैं।")], [2 * e, L("That counts sticky ends, not fragments.", "यह चिपचिपे सिरे गिनता है, खंड नहीं।")]]),
      data: { given: shape ? [`k_{EcoRI} = ${a}`, `k_{BamHI} = ${b}`] : [`k = ${e}`], find: [`N_{${tx(L("fragments", "खंड"))}}`] },
      hint: L("Draw the molecule as a line and mark every cut.", "अणु को एक रेखा के रूप में बनाइए और हर कटाव चिह्नित कीजिए।"),
      formula: shape ? "N = k_1 + k_2 + 1" : "N = k - 1",
      solution: shape
        ? L(S(`All cuts: $${a} + ${b} = ${a + b}$`, `Linear: $N = ${a + b} + 1 = ${ans}$`), S(`कुल कटाव: $${a} + ${b} = ${a + b}$`, `रैखिक: $N = ${a + b} + 1 = ${ans}$`))
        : L(S(`$${e}$ cuts → $${e + 1}$ fragments`, `The two end fragments have one original end each: $${e + 1} - 2 = ${e - 1}$`), S(`$${e}$ कटाव → $${e + 1}$ खंड`, `दोनों छोर वाले खंडों में एक-एक मूल सिरा है: $${e + 1} - 2 = ${e - 1}$`)),
    });
  },
};

// ---------------------------------------------------------------------------------------------
// Ekologija: zakon 10 %, natalnost in mortaliteta, Nt+1 = Nt + (B + I) − (D + E), NPP = GPP − R,
// dN/dt = rN, logistična rast, odnos vrste–površina S = CA^Z.
// ---------------------------------------------------------------------------------------------
const LEVELS = [["producers", "उत्पादक"], ["primary consumers (herbivores)", "प्राथमिक उपभोक्ता (शाकाहारी)"], ["secondary consumers", "द्वितीयक उपभोक्ता"], ["tertiary consumers", "तृतीयक उपभोक्ता"]];
const EUNIT = "\\mathrm{kcal\\ m^{-2}\\ yr^{-1}}";
const ECOLOGY_CALC = {
  id: "exi-bio-ecology-calc",
  topics: [T("ecology-and-environment")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    const t = r.int(1, 3);
    const E0 = r.pick([1, 2, 3, 4, 5, 6, 8]) * 10 ** r.int(3, 5);
    const N0 = 10 * r.int(5, 60);
    const ni = r.int(0, 7);
    const name = NAMES[ni];
    const tenLaw = (fwd) => {
      const steps = t;
      const ans = fwd ? E0 / 10 ** steps : E0 * 10 ** steps;
      return task({
        text: fwd
          ? L(`In a grassland, the producers fix ${E0} kcal m⁻² yr⁻¹. Following Lindeman's 10 per cent law, how much energy (in kcal m⁻² yr⁻¹) reaches the ${LEVELS[steps][0]}?`, `एक घास-स्थल में उत्पादक ${E0} kcal m⁻² yr⁻¹ ऊर्जा स्थिर करते हैं। लिंडमान के 10 प्रतिशत नियम के अनुसार ${LEVELS[steps][1]} तक कितनी ऊर्जा (kcal m⁻² yr⁻¹ में) पहुँचेगी?`)
          : L(`A food chain has producers and ${steps} consumer level${steps > 1 ? "s" : ""}. The ${LEVELS[steps][0]} receive ${E0} kcal m⁻² yr⁻¹. Using the 10 per cent law, how much energy (in kcal m⁻² yr⁻¹) must the producers fix?`, `एक खाद्य शृंखला में उत्पादक और ${steps} उपभोक्ता स्तर हैं। ${LEVELS[steps][1]} को ${E0} kcal m⁻² yr⁻¹ मिलती है। 10 प्रतिशत नियम से उत्पादकों को कितनी ऊर्जा (kcal m⁻² yr⁻¹ में) स्थिर करनी होगी?`),
        answer: numM(ans, fwd && ans < 1 ? 2 : 0, fwd
          ? [[E0 / 10 ** (steps + 1), L("Count the transfers: producers → primary consumers is the first one.", "स्थानांतरण गिनिए: उत्पादक → प्राथमिक उपभोक्ता पहला है।")], [steps > 1 ? E0 / 10 ** (steps - 1) : E0, L(steps > 1 ? "One transfer is missing; count each step between levels." : "Only 10% passes to the next level.", steps > 1 ? "एक स्थानांतरण छूट गया; स्तरों के बीच हर चरण गिनिए।" : "केवल 10% अगले स्तर तक जाता है।")], [E0 * (1 - 0.1 * steps), L("10% passes on at each step; you subtracted 10% instead.", "हर चरण में 10% आगे जाता है; आपने 10% घटा दिया।")]]
          : [[E0 * 10 ** (steps + 1), L("Count the transfers: producers → primary consumers is the first one.", "स्थानांतरण गिनिए: उत्पादक → प्राथमिक उपभोक्ता पहला है।")], [E0 / 10 ** steps, L("Going down the chain, the energy must be larger: multiply by 10 per step.", "शृंखला में नीचे जाने पर ऊर्जा अधिक होनी चाहिए: प्रति चरण 10 से गुणा कीजिए।")], [E0 * 10 * steps, L("Multiply by 10 for each step (10ⁿ), not by 10n.", "प्रत्येक चरण में 10 से गुणा कीजिए (10ⁿ), 10n से नहीं।")]]),
        data: { given: fwd ? [`E_P = ${E0}\\ ${EUNIT}`] : [`E_{${steps}} = ${E0}\\ ${EUNIT}`, `n = ${steps}`], find: [fwd ? `E_{${steps}}` : "E_P"] },
        hint: L("Only about 10% of the energy passes from one trophic level to the next.", "एक पोषी स्तर से अगले तक लगभग 10% ऊर्जा ही जाती है।"),
        formula: fwd ? "E_n = E_P \\cdot 0.1^n" : "E_P = E_n \\cdot 10^n",
        solution: L(S(`Transfers: ${steps}`, fwd ? `$E = ${E0} \\cdot 0.1^{${steps}} = ${en(ans)}$` : `$E_P = ${E0} \\cdot 10^{${steps}} = ${en(ans)}$`), S(`स्थानांतरण: ${steps}`, fwd ? `$E = ${E0} \\cdot 0.1^{${steps}} = ${en(ans)}$` : `$E_P = ${E0} \\cdot 10^{${steps}} = ${en(ans)}$`)),
      });
    };
    if (level === 1) {
      if (v === 0) return tenLaw(true);
      if (v === 1 || v === 2) {
        const birth = v === 1;
        const B = Math.round(N0 * r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]));
        const rate = B / N0;
        const org = birth ? ["lotus plants in a pond", "तालाब में कमल के पौधे"] : ["fruit flies in a laboratory culture", "प्रयोगशाला संवर्धन में फल-मक्खियाँ"];
        return task({
          text: birth
            ? L(`A pond had ${N0} lotus plants last year. Through reproduction ${B} new plants were added. What is the birth rate (offspring per lotus per year)?${roundToL(2, lang)}`, `एक तालाब में पिछले वर्ष कमल के ${N0} पौधे थे। जनन द्वारा ${B} नए पौधे जुड़े। जन्म दर (प्रति कमल प्रति वर्ष संतति) कितनी है?${roundToL(2, lang)}`)
            : L(`In a laboratory population of ${N0} fruit flies, ${B} died during one week. What is the death rate (individuals per fruit fly per week)?${roundToL(2, lang)}`, `${N0} फल-मक्खियों की एक प्रयोगशाला समष्टि में एक सप्ताह में ${B} मर गईं। मृत्यु दर (प्रति फल-मक्खी प्रति सप्ताह जीव) कितनी है?${roundToL(2, lang)}`),
          answer: numM(rate, 2, [[birth ? B / (N0 + B) : B / (N0 - B), L(birth ? "Divide by the starting population, not the new total." : "Divide by the population at the start of the week.", birth ? "प्रारंभिक समष्टि से भाग दीजिए, नए कुल से नहीं।" : "सप्ताह के प्रारंभ की समष्टि से भाग दीजिए।")], [N0 / B, L("The rate is per individual: events ÷ population.", "दर प्रति जीव है: घटनाएँ ÷ समष्टि।")], [birth ? (N0 + B) / N0 : (N0 - B) / N0, L(birth ? "Use only the new individuals, not the new total." : "That is the fraction that survived.", birth ? "केवल नए जीव लीजिए, नया कुल नहीं।" : "यह जीवित बचा भाग है।")]]),
          data: { given: [`N = ${N0}`, birth ? `B = ${B}` : `D = ${B}`], find: [birth ? "b" : "d"] },
          hint: L(`Per capita ${birth ? "birth" : "death"} rate = number of ${birth ? "births" : "deaths"} ÷ starting population.`, `प्रति व्यक्ति ${birth ? "जन्म" : "मृत्यु"} दर = ${birth ? "जन्मों" : "मृत्युओं"} की संख्या ÷ प्रारंभिक समष्टि।`),
          formula: birth ? "b = \\dfrac{B}{N}" : "d = \\dfrac{D}{N}",
          solution: L(S(`$${birth ? "b" : "d"} = ${B}/${N0}$`, `$${birth ? "b" : "d"} = ${en(rate, 2)}$ (${org[0]})`), S(`$${birth ? "b" : "d"} = ${B}/${N0}$`, `$${birth ? "b" : "d"} = ${en(rate, 2)}$ (${org[1]})`)),
        });
      }
      const G = 100 * r.int(20, 90);
      const R = 100 * r.int(5, G / 200);
      return task({
        text: L(`The gross primary productivity of a lake is ${G} kcal m⁻² yr⁻¹ and the producers lose ${R} kcal m⁻² yr⁻¹ in respiration. What is the net primary productivity (in kcal m⁻² yr⁻¹)?`, `एक झील की सकल प्राथमिक उत्पादकता ${G} kcal m⁻² yr⁻¹ है और उत्पादक श्वसन में ${R} kcal m⁻² yr⁻¹ खो देते हैं। नेट प्राथमिक उत्पादकता (kcal m⁻² yr⁻¹ में) कितनी है?`),
        answer: numM(G - R, 0, [[G + R, L("Respiration losses are subtracted from GPP, not added.", "श्वसन हानि GPP से घटाई जाती है, जोड़ी नहीं।")], [G / 10, L("The 10% law is about transfer between trophic levels, not NPP.", "10% नियम पोषी स्तरों के बीच स्थानांतरण के लिए है, NPP के लिए नहीं।")]]),
        data: { given: [`GPP = ${G}\\ ${EUNIT}`, `R = ${R}\\ ${EUNIT}`], find: ["NPP"] },
        hint: L("NPP is what remains after the producers' own respiration.", "NPP वह है जो उत्पादकों के अपने श्वसन के बाद बचता है।"),
        formula: "NPP = GPP - R",
        solution: L(S(`$NPP = ${G} - ${R}$`, `$NPP = ${G - R}\\ ${EUNIT}$`), S(`$NPP = ${G} - ${R}$`, `$NPP = ${G - R}\\ ${EUNIT}$`)),
      });
    }
    if (level === 2) {
      if (v === 0) {
        const N = 10 * r.int(20, 200);
        const B = r.int(10, 80);
        const D = r.int(5, 60);
        const I = r.int(0, 30);
        const Em = r.int(1, 30);
        const ans = N + B + I - D - Em;
        return task({
          text: L(`A deer population had ${N} individuals at time t. During the next year there were ${B} births, ${D} deaths, ${I} deer arrived from outside and ${Em} left the habitat. What is the population at t + 1?`, `समय t पर हिरणों की एक समष्टि में ${N} जीव थे। अगले वर्ष ${B} जन्म, ${D} मृत्यु हुईं, ${I} हिरण बाहर से आए और ${Em} आवास छोड़कर चले गए। t + 1 पर समष्टि कितनी है?`),
          answer: numM(ans, 0, [[N + B - D, L("Include immigration (I) and emigration (E).", "आप्रवासन (I) और उत्प्रवासन (E) भी शामिल कीजिए।")], [N + B - D - I + Em, L("Immigration adds to the population; emigration removes from it.", "आप्रवासन समष्टि बढ़ाता है; उत्प्रवासन घटाता है।")], [N + B + I + D + Em, L("Deaths and emigrants are subtracted.", "मृत्यु और उत्प्रवासी घटाए जाते हैं।")]]),
          data: { given: [`N_t = ${N}`, `B = ${B},\\ D = ${D}`, `I = ${I},\\ E = ${Em}`], find: ["N_{t+1}"] },
          hint: L("Births and immigrants add; deaths and emigrants subtract.", "जन्म और आप्रवासी जुड़ते हैं; मृत्यु और उत्प्रवासी घटते हैं।"),
          formula: "N_{t+1} = N_t + [(B + I) - (D + E)]",
          solution: L(S(`$N_{t+1} = ${N} + [(${B} + ${I}) - (${D} + ${Em})]$`, `$N_{t+1} = ${N} + ${B + I - D - Em} = ${ans}$`), S(`$N_{t+1} = ${N} + [(${B} + ${I}) - (${D} + ${Em})]$`, `$N_{t+1} = ${N} + ${B + I - D - Em} = ${ans}$`)),
        });
      }
      if (v === 1) return tenLaw(false);
      const b = r.int(5, 30) / 100;
      const d = r.int(1, Math.round(b * 100) - 2) / 100;
      const N = 100 * r.int(5, 50);
      const rr = r2(b - d);
      if (v === 2) {
        const ans = r2(rr * N);
        return task({
          text: L(`In a population of ${N} individuals, the per capita birth rate is ${en(b)} and the per capita death rate is ${en(d)} per year. Assuming exponential growth, what is dN/dt (individuals per year) at this moment?`, `${N} जीवों की एक समष्टि में प्रति व्यक्ति जन्म दर ${en(b)} और प्रति व्यक्ति मृत्यु दर ${en(d)} प्रति वर्ष है। चरघातांकी वृद्धि मानते हुए इस क्षण dN/dt (जीव प्रति वर्ष) कितना है?`),
          answer: numM(ans, 0, [[r2((b + d) * N), L("r = b − d: deaths reduce growth.", "r = b − d: मृत्यु वृद्धि घटाती है।")], [r2(b * N), L("Subtract the death rate to get r.", "r के लिए मृत्यु दर घटाइए।")], [rr, L("Multiply r by the population size N.", "r को समष्टि आकार N से गुणा कीजिए।")]]),
          data: { given: [`N = ${N}`, `b = ${en(b)},\\ d = ${en(d)}`], find: ["dN/dt"] },
          hint: L("The intrinsic rate of natural increase is r = b − d.", "प्राकृतिक वृद्धि की नैज दर r = b − d है।"),
          formula: "\\dfrac{dN}{dt} = rN,\\ r = b - d",
          solution: L(S(`$r = ${en(b)} - ${en(d)} = ${en(rr)}$`, `$dN/dt = ${en(rr)} \\cdot ${N} = ${en(ans)}$`), S(`$r = ${en(b)} - ${en(d)} = ${en(rr)}$`, `$dN/dt = ${en(rr)} \\cdot ${N} = ${en(ans)}$`)),
        });
      }
      const ans = r2(N * (1 + rr));
      return task({
        text: L(`A population of ${N} has a per capita birth rate of ${en(b)} and a per capita death rate of ${en(d)} per year, with no migration. Estimate the population after one year (N₁ = N₀ + (b − d)N₀).`, `${N} की एक समष्टि में प्रति व्यक्ति जन्म दर ${en(b)} और प्रति व्यक्ति मृत्यु दर ${en(d)} प्रति वर्ष है; कोई प्रवासन नहीं। एक वर्ष बाद समष्टि का अनुमान लगाइए (N₁ = N₀ + (b − d)N₀)।`),
        answer: numM(ans, 0, [[r2(rr * N), L("That is only the increase; add it to N₀.", "यह केवल वृद्धि है; इसे N₀ में जोड़िए।")], [r2(N * (1 + b + d)), L("Deaths reduce the population: use b − d.", "मृत्यु समष्टि घटाती है: b − d लीजिए।")], [r2(N * (1 + b)), L("Subtract the deaths as well.", "मृत्यु भी घटाइए।")]]),
        data: { given: [`N_0 = ${N}`, `b = ${en(b)},\\ d = ${en(d)}`], find: ["N_1"] },
        hint: L("Find the net change (b − d)·N₀ and add it.", "शुद्ध परिवर्तन (b − d)·N₀ ज्ञात कीजिए और जोड़िए।"),
        formula: "N_1 = N_0 (1 + b - d)",
        solution: L(S(`$(b - d) N_0 = ${en(rr)} \\cdot ${N} = ${en(r2(rr * N))}$`, `$N_1 = ${N} + ${en(r2(rr * N))} = ${en(ans)}$`), S(`$(b - d) N_0 = ${en(rr)} \\cdot ${N} = ${en(r2(rr * N))}$`, `$N_1 = ${N} + ${en(r2(rr * N))} = ${en(ans)}$`)),
      });
    }
    // Raven 3
    if (v === 0) {
      const K = 100 * r.int(5, 40);
      const N = 50 * r.int(1, K / 50 - 1);
      const rr = r.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      const ans = r2((rr * N * (K - N)) / K);
      return task({
        text: L(`A population grows logistically with r = ${en(rr)} per year and carrying capacity K = ${K}. What is the growth rate dN/dt (individuals per year) when N = ${N}?${roundToL(1, lang)}`, `एक समष्टि r = ${en(rr)} प्रति वर्ष और वहन क्षमता K = ${K} के साथ संभार-तंत्री वृद्धि करती है। N = ${N} पर वृद्धि दर dN/dt (जीव प्रति वर्ष) कितनी है?${roundToL(1, lang)}`),
        answer: numM(ans, 1, [[r2(rr * N), L("Logistic growth is slowed by the factor (K − N)/K.", "संभार-तंत्री वृद्धि (K − N)/K गुणक से धीमी होती है।")], [r2((rr * N * N) / K), L("The factor is (K − N)/K, not N/K.", "गुणक (K − N)/K है, N/K नहीं।")], [r2(rr * (K - N)), L("Multiply by N as well: rN(K − N)/K.", "N से भी गुणा कीजिए: rN(K − N)/K।")]]),
        data: { given: [`r = ${en(rr)}`, `K = ${K}`, `N = ${N}`], find: ["dN/dt"] },
        hint: L("Use the Verhulst–Pearl logistic equation.", "वर्हुल्स्ट–पर्ल संभार-तंत्री समीकरण लगाइए।"),
        formula: "\\dfrac{dN}{dt} = rN\\left(\\dfrac{K - N}{K}\\right)",
        solution: L(S(`$\\dfrac{K - N}{K} = \\dfrac{${K - N}}{${K}}$`, `$dN/dt = ${en(rr)} \\cdot ${N} \\cdot \\dfrac{${K - N}}{${K}} = ${en(ans, 1)}$`), S(`$\\dfrac{K - N}{K} = \\dfrac{${K - N}}{${K}}$`, `$dN/dt = ${en(rr)} \\cdot ${N} \\cdot \\dfrac{${K - N}}{${K}} = ${en(ans, 1)}$`)),
      });
    }
    if (v === 1) {
      const [ratio, Z, f] = r.pick([[32, 0.2, 2], [243, 0.2, 3], [1024, 0.1, 2], [1024, 0.2, 4], [3125, 0.2, 5]]);
      const S1 = 5 * r.int(4, 40);
      const ans = S1 * f;
      return task({
        text: L(`${name[0]} studies birds in a forest patch with ${S1} species. Using the species–area relationship $S = CA^Z$ with Z = ${en(Z)}, how many species would be expected in a similar patch ${ratio} times larger?`, `${name[1]} एक वन-खंड में पक्षियों का अध्ययन ${ni % 2 ? "करती" : "करता"} है जिसमें ${S1} जातियाँ हैं। जाति–क्षेत्र संबंध $S = CA^Z$ (Z = ${en(Z)}) से ${ratio} गुना बड़े समान खंड में कितनी जातियों की अपेक्षा होगी?`),
        answer: numM(ans, 0, [[r2(S1 * ratio * Z), L("Species do not grow as Z × A; use the power law A^Z.", "जातियाँ Z × A की तरह नहीं बढ़तीं; घात नियम A^Z लगाइए।")], [S1 * ratio, L("Z < 1, so species richness grows much more slowly than area.", "Z < 1 है, अतः जाति समृद्धि क्षेत्र से बहुत धीमी बढ़ती है।")], [r2(S1 * (1 + Z * Math.log10(ratio))), L("In log form, log S changes by Z·log(A₂/A₁); S itself is multiplied, not increased by that amount.", "लघुगणक रूप में log S, Z·log(A₂/A₁) से बदलता है; S स्वयं गुणा होता है, उतना जुड़ता नहीं।")]]),
        data: { given: [`S_1 = ${S1}`, `A_2/A_1 = ${ratio}`, `Z = ${en(Z)}`], find: ["S_2"] },
        hint: L("Divide the two equations: C cancels.", "दोनों समीकरणों को भाग दीजिए: C कट जाता है।"),
        formula: "\\dfrac{S_2}{S_1} = \\left(\\dfrac{A_2}{A_1}\\right)^Z",
        solution: L(S(`$\\dfrac{S_2}{S_1} = ${ratio}^{${en(Z)}} = ${f}$`, `$S_2 = ${S1} \\cdot ${f} = ${ans}$`), S(`$\\dfrac{S_2}{S_1} = ${ratio}^{${en(Z)}} = ${f}$`, `$S_2 = ${S1} \\cdot ${f} = ${ans}$`)),
      });
    }
    if (v === 2) {
      const N = 100 * r.int(10, 60);
      const b = r.int(5, 25) / 100;
      const d = r.int(2, 20) / 100;
      const I = r.int(5, 60);
      const Em = r.int(5, 60);
      const ans = Math.round(N + b * N + I - d * N - Em);
      return task({
        text: L(`A population of ${N} has per capita birth and death rates of ${en(b)} and ${en(d)} per year. In one year, ${I} individuals immigrate and ${Em} emigrate. What is the population after one year?`, `${N} की एक समष्टि में प्रति व्यक्ति जन्म और मृत्यु दरें ${en(b)} और ${en(d)} प्रति वर्ष हैं। एक वर्ष में ${I} जीव आप्रवासन और ${Em} उत्प्रवासन करते हैं। एक वर्ष बाद समष्टि कितनी है?`),
        answer: numM(ans, 0, [[Math.round(N + (b - d) * N), L("Add immigrants and subtract emigrants too.", "आप्रवासी जोड़िए और उत्प्रवासी भी घटाइए।")], [Math.round(N + b * N - I - d * N + Em), L("Immigration adds and emigration subtracts.", "आप्रवासन जोड़ता है और उत्प्रवासन घटाता है।")], [Math.round(N + b + I - d - Em), L("Per capita rates must be multiplied by N to get the numbers of births and deaths.", "जन्म और मृत्यु की संख्या के लिए प्रति व्यक्ति दरों को N से गुणा कीजिए।")]]),
        data: { given: [`N_t = ${N}`, `b = ${en(b)},\\ d = ${en(d)}`, `I = ${I},\\ E = ${Em}`], find: ["N_{t+1}"] },
        hint: L("Convert the per capita rates into numbers B = bN and D = dN first.", "पहले प्रति व्यक्ति दरों को संख्याओं B = bN और D = dN में बदलिए।"),
        formula: "N_{t+1} = N_t + [(B + I) - (D + E)]",
        solution: L(S(`$B = ${en(b)} \\cdot ${N} = ${en(r2(b * N))}$, $D = ${en(d)} \\cdot ${N} = ${en(r2(d * N))}$`, `$N_{t+1} = ${N} + (${en(r2(b * N))} + ${I}) - (${en(r2(d * N))} + ${Em}) = ${ans}$`), S(`$B = ${en(b)} \\cdot ${N} = ${en(r2(b * N))}$, $D = ${en(d)} \\cdot ${N} = ${en(r2(d * N))}$`, `$N_{t+1} = ${N} + (${en(r2(b * N))} + ${I}) - (${en(r2(d * N))} + ${Em}) = ${ans}$`)),
      });
    }
    const G = 1000 * r.int(5, 40);
    const pr = r.pick([10, 20, 25, 30, 40, 50]);
    const NPP = (G * (100 - pr)) / 100;
    const steps = r.int(1, 2);
    const ans = NPP / 10 ** steps;
    return task({
      text: L(`The GPP of a grassland is ${G} kcal m⁻² yr⁻¹ and the producers use ${pr}% of it in respiration. Assume the ${LEVELS[steps][0]} receive energy from the NPP by the 10 per cent law. How much energy (in kcal m⁻² yr⁻¹) reaches them?`, `एक घास-स्थल की GPP ${G} kcal m⁻² yr⁻¹ है और उत्पादक इसका ${pr}% श्वसन में खर्च करते हैं। मान लीजिए ${LEVELS[steps][1]} को NPP से 10 प्रतिशत नियम के अनुसार ऊर्जा मिलती है। उन तक कितनी ऊर्जा (kcal m⁻² yr⁻¹ में) पहुँचती है?`),
      answer: numM(ans, 0, [[G / 10 ** steps, L("Only the NPP is available to consumers; subtract respiration first.", "उपभोक्ताओं को केवल NPP उपलब्ध है; पहले श्वसन घटाइए।")], [(G * pr) / 100 / 10 ** steps, L(`${pr}% is lost in respiration; ${100 - pr}% remains as NPP.`, `${pr}% श्वसन में खर्च होता है; ${100 - pr}% NPP के रूप में बचता है।`)], [steps === 1 ? NPP / 100 : NPP / 10, L("Count the transfers from producers to this level.", "उत्पादकों से इस स्तर तक के स्थानांतरण गिनिए।")]]),
      data: { given: [`GPP = ${G}\\ ${EUNIT}`, `R = ${pr}\\%`], find: [`E_{${steps}}`] },
      hint: L("First NPP = GPP − R; then apply 10% per trophic step.", "पहले NPP = GPP − R; फिर प्रति पोषी चरण 10% लगाइए।"),
      formula: "E_n = (GPP - R) \\cdot 0.1^n",
      solution: L(S(`$NPP = ${G} - ${(G * pr) / 100} = ${NPP}$`, `$E = ${NPP} \\cdot 0.1^{${steps}} = ${en(ans)}$`), S(`$NPP = ${G} - ${(G * pr) / 100} = ${NPP}$`, `$E = ${NPP} \\cdot 0.1^{${steps}} = ${en(ans)}$`)),
    });
  },
};

export const EXAM_IN_BIO = [
  ...Object.keys(BANK).map((s) => conceptGen(s, BANK[s])),
  DIVERSITY_COUNT,
  HEALTH_COUNT,
  CELL_CALC,
  CELL_DIV_CALC,
  PLANT_CALC,
  HUMAN_CALC,
  REPRO_CALC,
  GENETICS_MENDEL,
  GENETICS_ABO_SEX,
  MOLECULAR_CALC,
  MOLECULAR_SEQ,
  EVOLUTION_HW,
  BIOTECH_CALC,
  ECOLOGY_CALC,
];
