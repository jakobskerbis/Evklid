// Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko).
// Biologija: 10. razred (CBSE/ICSE/državni odbori, SEE, O/L, SSC, BECE, O-level) strogo po racionaliziranem
// učbeniku NCERT Science 10 (pogl. 5–8 in 13), brez snovi 11./12. razreda; poleg tega rastlinska anatomija in
// morfologija ter živalska tkiva (NCERT 11), mikrobi v človekovo korist (NCERT 12) in osnove vedenja (A-level, A/L).
// Pojmovni motor (izbire v slogu NEET/CBSE z razlago vsake napačne možnosti) je kopija motorja iz exam-in-bio.js.
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
  id: `exg-bio-${slug}`,
  topics: [T(slug)],
  langs: LANGS,
  gen(level, r, _topic, lang) {
    const L = bi(lang);
    const fs = FORMATS[level];
    return r.pick(fs)(r, L, B);
  },
});

// =============================================================================================
// Banke pojmov. Teme 10. razreda strogo po racionaliziranem učbeniku NCERT Science 10 (brez snovi 11./12. razreda);
// rastlinska anatomija/morfologija in živalska tkiva po NCERT 11, mikrobi po NCERT 12, vedenje na ravni osnov A-level.
// =============================================================================================
const BANK = {};

// ---------- Life processes (NCERT 10, pogl. 5) ----------
BANK["life-processes"] = {
  sets: [
    {
      k: ["digestive juice or enzyme", "पाचक रस या एंजाइम"],
      q: ["What is the role of % in human digestion?", "मानव पाचन में % की क्या भूमिका है?"],
      rq: ["Which of these does the following in human digestion: %?", "मानव पाचन में निम्नलिखित में से कौन यह कार्य करता है: %?"],
      items: [
        ["salivary amylase", "लार एमिलेस", "breaks down starch into simple sugar in the mouth", "मुख में मंड (स्टार्च) को सरल शर्करा में तोड़ता है"],
        ["pepsin", "पेप्सिन", "digests proteins in the stomach", "आमाशय में प्रोटीन का पाचन करता है"],
        ["hydrochloric acid", "हाइड्रोक्लोरिक अम्ल", "makes the medium in the stomach acidic so that pepsin can act", "आमाशय में अम्लीय माध्यम बनाता है, जिससे पेप्सिन क्रिया कर सके"],
        ["mucus", "श्लेष्मा", "protects the inner lining of the stomach from the acid", "आमाशय के आंतरिक स्तर की अम्ल से रक्षा करता है"],
        ["bile juice", "पित्त रस", "makes the food alkaline and breaks large fat globules into smaller ones", "भोजन को क्षारीय बनाता है और वसा की बड़ी गोलिकाओं को छोटी गोलिकाओं में तोड़ता है"],
        ["trypsin", "ट्रिप्सिन", "is a pancreatic enzyme that digests proteins in the small intestine", "अग्न्याशयी एंजाइम है जो क्षुद्रांत्र में प्रोटीन का पाचन करता है"],
        ["lipase", "लाइपेज", "breaks down emulsified fats", "इमल्सीकृत वसा को तोड़ता है"],
        ["intestinal juice", "आंत्र रस", "finally converts proteins to amino acids, carbohydrates to glucose and fats to fatty acids and glycerol", "अंत में प्रोटीन को अमीनो अम्ल में, कार्बोहाइड्रेट को ग्लूकोज़ में और वसा को वसा अम्ल तथा ग्लिसरॉल में बदलता है"],
      ],
    },
    {
      k: ["part of the transport system", "परिवहन तंत्र का भाग"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which of these is described here: %?", "यहाँ इनमें से किसका वर्णन है: %?"],
      items: [
        ["xylem", "जाइलम", "carries water and minerals from the roots to the leaves", "जड़ों से पत्तियों तक जल और खनिज लवण ले जाता है"],
        ["phloem", "फ्लोएम", "carries food made in the leaves to other parts of the plant", "पत्तियों में बने भोजन को पौधे के अन्य भागों तक ले जाता है"],
        ["guard cells", "द्वार कोशिकाएँ", "swell when water flows into them and open the stomatal pore", "जल भीतर आने पर फूल जाती हैं और रंध्र का छिद्र खोल देती हैं"],
        ["arteries", "धमनियाँ", "carry blood away from the heart and have thick, elastic walls", "रुधिर को हृदय से दूर ले जाती हैं और इनकी भित्ति मोटी तथा लचीली होती है"],
        ["veins", "शिराएँ", "bring blood back to the heart and have valves", "रुधिर को हृदय तक वापस लाती हैं और इनमें वाल्व होते हैं"],
        ["capillaries", "केशिकाएँ", "have walls only one cell thick, so materials are exchanged with body cells", "इनकी भित्ति केवल एक कोशिका मोटी होती है, जिससे शरीर की कोशिकाओं से पदार्थों का आदान-प्रदान होता है"],
        ["platelets", "प्लेटलेट्स", "help the blood to clot at a wound and plug the leak", "चोट के स्थान पर रुधिर का थक्का बनाकर रिसाव रोकते हैं"],
        ["lymph", "लसीका", "carries digested and absorbed fat from the intestine", "आँत से पचे और अवशोषित वसा का वहन करती है"],
      ],
    },
    {
      k: ["part of the human body", "मानव शरीर का भाग"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which part of the human body is described here: %?", "यहाँ मानव शरीर के किस भाग का वर्णन है: %?"],
      items: [
        ["alveoli", "कूपिकाएँ", "balloon-like ends of the air passages in the lungs where gases are exchanged", "फुफ्फुस में वायु मार्गों के गुब्बारे जैसे सिरे, जहाँ गैसों का विनिमय होता है"],
        ["villi", "दीर्घरोम", "finger-like projections of the small intestine that increase the surface for absorption", "क्षुद्रांत्र के अंगुली जैसे प्रवर्ध, जो अवशोषण का क्षेत्रफल बढ़ाते हैं"],
        ["nephron", "वृक्काणु (नेफ्रॉन)", "is the basic filtration unit of the kidney", "वृक्क की मूल निस्यंदन इकाई है"],
        ["glomerulus", "केशिका गुच्छ (ग्लोमेरुलस)", "is a cluster of thin-walled capillaries in which blood is filtered", "पतली भित्ति वाली केशिकाओं का गुच्छ है, जिसमें रुधिर का निस्यंदन होता है"],
        ["Bowman's capsule", "बोमन संपुट", "is the cup-shaped end of a nephron that collects the filtrate", "वृक्काणु का कप जैसा सिरा है, जो निस्यंद को एकत्र करता है"],
        ["ureter", "मूत्रवाहिनी", "carries urine from a kidney to the urinary bladder", "वृक्क से मूत्राशय तक मूत्र ले जाती है"],
        ["urinary bladder", "मूत्राशय", "is a muscular sac that stores urine", "एक पेशीय थैली है जो मूत्र का संग्रह करती है"],
      ],
    },
  ],
  tf: [
    ["Photosynthesis needs carbon dioxide, water, sunlight and chlorophyll.", "प्रकाश-संश्लेषण के लिए कार्बन डाइऑक्साइड, जल, सूर्य का प्रकाश और क्लोरोफिल आवश्यक हैं।"],
    ["Desert plants take up carbon dioxide at night and use it for photosynthesis during the day.", "मरुस्थलीय पौधे रात्रि में कार्बन डाइऑक्साइड लेते हैं और दिन में प्रकाश-संश्लेषण में उसका उपयोग करते हैं।"],
    ["In yeast, anaerobic respiration produces ethanol and carbon dioxide.", "यीस्ट में अवायवीय श्वसन से इथेनॉल और कार्बन डाइऑक्साइड बनते हैं।"],
    ["The breakdown of glucose into pyruvate takes place in the cytoplasm.", "ग्लूकोज़ का पाइरुवेट में विखंडन कोशिकाद्रव्य में होता है।"],
    ["Aerobic respiration releases much more energy than anaerobic respiration.", "वायवीय श्वसन, अवायवीय श्वसन की तुलना में कहीं अधिक ऊर्जा मुक्त करता है।"],
    ["The energy released during respiration is used to make ATP.", "श्वसन में मुक्त ऊर्जा का उपयोग ATP बनाने में होता है।"],
    ["Birds and mammals have a four-chambered heart that keeps oxygenated and deoxygenated blood separate.", "पक्षियों और स्तनधारियों का हृदय चार कक्षीय होता है, जो ऑक्सीजनित और विऑक्सीजनित रुधिर को अलग रखता है।"],
    ["In double circulation, blood passes through the heart twice during each cycle.", "दोहरे परिसंचरण में प्रत्येक चक्र में रुधिर दो बार हृदय से होकर गुज़रता है।"],
    ["Fishes have a two-chambered heart, and blood passes through it only once in each cycle.", "मछलियों का हृदय दो कक्षीय होता है और प्रत्येक चक्र में रुधिर उससे केवल एक बार गुज़रता है।"],
    ["Transpiration helps in the upward movement of water in the xylem and in temperature regulation.", "वाष्पोत्सर्जन जाइलम में जल के ऊपर चढ़ने और ताप के नियमन में सहायता करता है।"],
    ["The translocation of sucrose into phloem uses energy from ATP.", "फ्लोएम में सुक्रोज़ का स्थानांतरण ATP की ऊर्जा से होता है।"],
    ["Glucose, amino acids, salts and much of the water in the initial filtrate are reabsorbed in the nephron.", "प्रारंभिक निस्यंद के ग्लूकोज़, अमीनो अम्ल, लवण और अधिकांश जल का वृक्काणु में पुनरवशोषण हो जाता है।"],
    ["Plants store some waste products in old xylem or get rid of them through leaves that fall off.", "पौधे कुछ अपशिष्ट पदार्थ पुराने जाइलम में संचित करते हैं या गिरने वाली पत्तियों द्वारा उनसे छुटकारा पाते हैं।"],
    ["Lymph drains excess fluid from the spaces between cells back into the blood.", "लसीका कोशिकाओं के बीच के स्थानों से अतिरिक्त तरल को वापस रुधिर में ले जाती है।"],
  ],
  ff: [
    ["Salivary amylase digests proteins in the mouth.", "लार एमिलेस मुख में प्रोटीन का पाचन करता है।", "Salivary amylase breaks down starch into simple sugar.", "लार एमिलेस मंड को सरल शर्करा में तोड़ता है।"],
    ["Pepsin acts in the alkaline medium of the small intestine.", "पेप्सिन क्षुद्रांत्र के क्षारीय माध्यम में क्रिया करता है।", "Pepsin acts in the acidic medium of the stomach.", "पेप्सिन आमाशय के अम्लीय माध्यम में क्रिया करता है।"],
    ["Arteries have valves that stop the backflow of blood.", "धमनियों में वाल्व होते हैं जो रुधिर को उल्टा बहने से रोकते हैं।", "Veins, not arteries, have valves.", "वाल्व धमनियों में नहीं, शिराओं में होते हैं।"],
    ["Pyruvate is broken down to carbon dioxide and water in the cytoplasm.", "पाइरुवेट का कार्बन डाइऑक्साइड और जल में विखंडन कोशिकाद्रव्य में होता है।", "Pyruvate is broken down to carbon dioxide and water in the mitochondria.", "पाइरुवेट का कार्बन डाइऑक्साइड और जल में विखंडन माइटोकॉन्ड्रिया में होता है।"],
    ["Yeast produces lactic acid during fermentation.", "किण्वन के समय यीस्ट लैक्टिक अम्ल बनाता है।", "Yeast forms ethanol and CO₂; lactic acid forms in our muscles when oxygen is short.", "यीस्ट इथेनॉल और CO₂ बनाता है; लैक्टिक अम्ल ऑक्सीजन की कमी होने पर हमारी पेशियों में बनता है।"],
    ["Phloem carries water and minerals up from the roots.", "फ्लोएम जड़ों से जल और खनिज लवण ऊपर ले जाता है।", "Xylem carries water and minerals; phloem carries food.", "जल और खनिज लवण जाइलम ले जाता है; फ्लोएम भोजन ले जाता है।"],
    ["Stomata open when the guard cells lose water.", "द्वार कोशिकाओं से जल निकलने पर रंध्र खुलते हैं।", "Stomata close when guard cells shrink and open when they swell with water.", "द्वार कोशिकाएँ सिकुड़ने पर रंध्र बंद होते हैं और जल से फूलने पर खुलते हैं।"],
    ["Amphibians have a four-chambered heart.", "उभयचरों का हृदय चार कक्षीय होता है।", "Amphibians and many reptiles have a three-chambered heart.", "उभयचरों और अनेक सरीसृपों का हृदय तीन कक्षीय होता है।"],
    ["Urine is formed in the urinary bladder.", "मूत्र मूत्राशय में बनता है।", "Urine is formed in the nephrons of the kidneys; the bladder only stores it.", "मूत्र वृक्कों के वृक्काणुओं में बनता है; मूत्राशय केवल उसका संग्रह करता है।"],
    ["Photosynthesis releases carbon dioxide.", "प्रकाश-संश्लेषण में कार्बन डाइऑक्साइड मुक्त होती है।", "Photosynthesis uses carbon dioxide and releases oxygen.", "प्रकाश-संश्लेषण में कार्बन डाइऑक्साइड का उपयोग होता है और ऑक्सीजन मुक्त होती है।"],
    ["Platelets carry oxygen to the tissues.", "प्लेटलेट्स ऊतकों तक ऑक्सीजन ले जाते हैं।", "Haemoglobin in red blood cells carries oxygen; platelets help blood clot.", "ऑक्सीजन लाल रुधिर कणिकाओं का हीमोग्लोबिन ले जाता है; प्लेटलेट्स थक्का बनाने में सहायक हैं।"],
    ["Bile contains enzymes that digest proteins.", "पित्त रस में प्रोटीन पचाने वाले एंजाइम होते हैं।", "Bile makes food alkaline and breaks fat into small globules; proteins are digested by pepsin and trypsin.", "पित्त रस भोजन को क्षारीय बनाता है और वसा को छोटी गोलिकाओं में तोड़ता है; प्रोटीन का पाचन पेप्सिन और ट्रिप्सिन करते हैं।"],
  ],
  ar: [
    ["Aquatic organisms breathe much faster than terrestrial organisms.", "जलीय जीवों की श्वास दर स्थलीय जीवों से बहुत अधिक होती है।", "The amount of oxygen dissolved in water is low compared with the amount in air.", "जल में घुली ऑक्सीजन की मात्रा वायु की तुलना में कम होती है।"],
    ["Birds and mammals need oxygenated and deoxygenated blood to stay separate.", "पक्षियों और स्तनधारियों में ऑक्सीजनित और विऑक्सीजनित रुधिर का अलग रहना आवश्यक है।", "Birds and mammals have high energy needs because they constantly use energy to maintain their body temperature.", "पक्षियों और स्तनधारियों की ऊर्जा आवश्यकता अधिक होती है, क्योंकि वे शरीर का ताप बनाए रखने में निरंतर ऊर्जा खर्च करते हैं।"],
    ["Muscle cramps can occur after sudden vigorous exercise.", "अचानक कठिन व्यायाम के बाद पेशियों में क्रैम्प (ऐंठन) हो सकते हैं।", "Lack of oxygen in muscle cells converts pyruvate into lactic acid.", "पेशी कोशिकाओं में ऑक्सीजन की कमी से पाइरुवेट लैक्टिक अम्ल में बदल जाता है।"],
    ["The inner wall of the small intestine has millions of villi.", "क्षुद्रांत्र की आंतरिक भित्ति पर लाखों दीर्घरोम होते हैं।", "Villi greatly increase the surface area for absorbing digested food.", "दीर्घरोम पचे हुए भोजन के अवशोषण का क्षेत्रफल बहुत बढ़ा देते हैं।"],
    ["The acid in the stomach does not damage its own inner lining.", "आमाशय का अम्ल उसके आंतरिक स्तर को हानि नहीं पहुँचाता।", "Mucus protects the inner lining of the stomach from the acid.", "श्लेष्मा आमाशय के आंतरिक स्तर की अम्ल से रक्षा करता है।"],
    ["Veins have valves.", "शिराओं में वाल्व होते हैं।", "Blood in veins is no longer under high pressure, and valves make it flow only towards the heart.", "शिराओं में रुधिर उच्च दाब पर नहीं होता, और वाल्व उसे केवल हृदय की ओर बहने देते हैं।"],
    ["Herbivores such as cows have a longer small intestine than carnivores such as tigers.", "गाय जैसे शाकाहारियों की क्षुद्रांत्र बाघ जैसे मांसाहारियों से लंबी होती है।", "The cellulose in grass takes a longer time to digest.", "घास के सेल्युलोज़ को पचने में अधिक समय लगता है।"],
  ],
};

// ---------- Control and coordination (NCERT 10, pogl. 6) ----------
BANK["control-and-coordination"] = {
  sets: [
    {
      k: ["structure", "संरचना"],
      q: ["What is the role of the %?", "% की क्या भूमिका है?"],
      rq: ["Which structure is described here: %?", "यहाँ किस संरचना का वर्णन है: %?"],
      items: [
        ["cerebrum", "प्रमस्तिष्क", "is the main thinking part of the brain and controls voluntary actions", "मस्तिष्क का मुख्य सोचने वाला भाग है और ऐच्छिक क्रियाओं का नियंत्रण करता है"],
        ["cerebellum", "अनुमस्तिष्क", "maintains posture and balance and the precision of voluntary actions such as riding a bicycle", "शरीर की स्थिति और संतुलन तथा साइकिल चलाने जैसी ऐच्छिक क्रियाओं की परिशुद्धता बनाए रखता है"],
        ["medulla", "मेडुला", "controls involuntary actions such as blood pressure, salivation and vomiting", "रक्तचाप, लार आना और वमन जैसी अनैच्छिक क्रियाओं का नियंत्रण करता है"],
        ["spinal cord", "मेरुरज्जु", "is where reflex arcs are formed", "वह स्थान है जहाँ प्रतिवर्ती चाप बनते हैं"],
        ["skull (cranium)", "कपाल (खोपड़ी)", "is the bony box that protects the brain", "हड्डियों का बक्सा है जो मस्तिष्क की रक्षा करता है"],
        ["vertebral column", "कशेरुक दंड", "protects the spinal cord", "मेरुरज्जु की रक्षा करता है"],
        ["synapse", "सिनैप्स", "is the gap where chemicals released by one neuron start an impulse in the next", "वह अंतराल है जहाँ एक न्यूरॉन से मुक्त रसायन अगले न्यूरॉन में आवेग आरंभ करते हैं"],
      ],
    },
    {
      k: ["hormone", "हॉर्मोन"],
      q: ["What is the role of %?", "% की क्या भूमिका है?"],
      rq: ["Which hormone is described here: %?", "यहाँ किस हॉर्मोन का वर्णन है: %?"],
      items: [
        ["auxin", "ऑक्सिन", "is made at the shoot tip and makes cells on the shaded side grow longer", "प्ररोह के अग्रभाग पर बनता है और छाया वाली ओर की कोशिकाओं को लंबा करता है"],
        ["gibberellin", "जिबरेलिन", "helps in the growth of the stem", "तने की वृद्धि में सहायता करता है"],
        ["cytokinin", "साइटोकाइनिन", "promotes cell division and is plentiful in fruits and seeds", "कोशिका विभाजन को प्रेरित करता है और फलों तथा बीजों में अधिक मात्रा में होता है"],
        ["abscisic acid", "एब्सिसिक अम्ल", "inhibits growth and causes wilting of leaves", "वृद्धि को रोकता है और पत्तियों के मुरझाने का कारण बनता है"],
        ["insulin", "इंसुलिन", "regulates the blood sugar level", "रुधिर में शर्करा के स्तर का नियमन करता है"],
        ["thyroxin", "थायरॉक्सिन", "is made using iodine and regulates carbohydrate, protein and fat metabolism", "आयोडीन से बनता है और कार्बोहाइड्रेट, प्रोटीन तथा वसा के उपापचय का नियमन करता है"],
        ["adrenaline", "एड्रीनलीन", "prepares the body for an emergency by making the heart beat faster", "हृदय की धड़कन तेज़ करके शरीर को आपात स्थिति के लिए तैयार करता है"],
        ["growth hormone", "वृद्धि हॉर्मोन", "regulates growth; its deficiency in childhood leads to dwarfism", "वृद्धि का नियमन करता है; बचपन में इसकी कमी से बौनापन होता है"],
      ],
    },
    {
      k: ["endocrine gland", "अंतःस्रावी ग्रंथि"],
      q: ["Which hormone does the % secrete?", "% से कौन-सा हॉर्मोन स्रावित होता है?"],
      rq: ["Which gland secretes %?", "% कौन-सी ग्रंथि स्रावित करती है?"],
      items: [
        ["pituitary gland", "पीयूष ग्रंथि", "growth hormone", "वृद्धि हॉर्मोन"],
        ["thyroid gland", "अवटु (थायरॉइड) ग्रंथि", "thyroxin", "थायरॉक्सिन"],
        ["adrenal gland", "अधिवृक्क ग्रंथि", "adrenaline", "एड्रीनलीन"],
        ["pancreas", "अग्न्याशय", "insulin", "इंसुलिन"],
        ["testis", "वृषण", "testosterone", "टेस्टोस्टेरॉन"],
        ["ovary", "अंडाशय", "oestrogen", "एस्ट्रोजन"],
      ],
    },
    {
      k: ["plant movement", "पादप गति"],
      q: ["Which example shows %?", "किस उदाहरण में % दिखाई देता है?"],
      rq: ["Which type of movement is this: %?", "यह किस प्रकार की गति है: %?"],
      items: [
        ["phototropism", "प्रकाशानुवर्तन", "a shoot bending towards light", "प्ररोह का प्रकाश की ओर मुड़ना"],
        ["geotropism", "गुरुत्वानुवर्तन", "roots growing downwards in response to gravity", "जड़ों का गुरुत्व के कारण नीचे की ओर बढ़ना"],
        ["hydrotropism", "जलानुवर्तन", "roots growing towards water", "जड़ों का जल की ओर बढ़ना"],
        ["chemotropism", "रसायनानुवर्तन", "a pollen tube growing towards an ovule", "पराग नलिका का बीजांड की ओर बढ़ना"],
        ["movement without growth", "वृद्धि के बिना गति", "the leaves of the touch-me-not plant folding when touched", "छूने पर छुई-मुई की पत्तियों का मुड़ जाना"],
      ],
    },
  ],
  tf: [
    ["In a reflex arc, the message passes from a receptor through a sensory neuron to the spinal cord and then through a motor neuron to the effector.", "प्रतिवर्ती चाप में संदेश ग्राही से संवेदी न्यूरॉन द्वारा मेरुरज्जु तक और फिर प्रेरक न्यूरॉन द्वारा कार्यकर (पेशी या ग्रंथि) तक जाता है।"],
    ["Within a neuron, information travels as an electrical impulse.", "न्यूरॉन के भीतर सूचना विद्युत आवेग के रूप में चलती है।"],
    ["Iodised salt is advised because iodine is needed to make thyroxin.", "आयोडीन युक्त नमक की सलाह दी जाती है क्योंकि थायरॉक्सिन बनाने के लिए आयोडीन आवश्यक है।"],
    ["Too little insulin raises the blood sugar level and causes diabetes.", "इंसुलिन की कमी से रुधिर में शर्करा का स्तर बढ़ता है और मधुमेह होता है।"],
    ["The timing and amount of hormone released are regulated by feedback mechanisms.", "हॉर्मोन के स्रावण का समय और मात्रा पुनर्भरण (फीडबैक) क्रियाविधि द्वारा नियंत्रित होते हैं।"],
    ["When the blood sugar level rises, cells of the pancreas detect it and secrete more insulin.", "रुधिर में शर्करा का स्तर बढ़ने पर अग्न्याशय की कोशिकाएँ इसे पहचानकर अधिक इंसुलिन स्रावित करती हैं।"],
    ["Endocrine glands release hormones directly into the blood.", "अंतःस्रावी ग्रंथियाँ हॉर्मोन सीधे रुधिर में मुक्त करती हैं।"],
    ["Plants have no nervous system; their cells coordinate mainly through chemicals (plant hormones).", "पौधों में तंत्रिका तंत्र नहीं होता; उनकी कोशिकाएँ मुख्यतः रसायनों (पादप हॉर्मोनों) द्वारा समन्वय करती हैं।"],
    ["Adrenaline speeds up the heartbeat so that more oxygen reaches the muscles.", "एड्रीनलीन हृदय की धड़कन तेज़ करता है ताकि पेशियों तक अधिक ऑक्सीजन पहुँचे।"],
    ["Testosterone in boys and oestrogen in girls bring about the changes of puberty.", "लड़कों में टेस्टोस्टेरॉन और लड़कियों में एस्ट्रोजन यौवनारंभ के परिवर्तन लाते हैं।"],
    ["Walking in a straight line and picking up a pencil depend on the cerebellum.", "सीधी रेखा में चलना और पेंसिल उठाना अनुमस्तिष्क पर निर्भर करते हैं।"],
    ["Roots grow away from light and shoots grow towards it.", "जड़ें प्रकाश से दूर और प्ररोह प्रकाश की ओर बढ़ते हैं।"],
  ],
  ff: [
    ["Reflex arcs are formed in the cerebrum.", "प्रतिवर्ती चाप प्रमस्तिष्क में बनते हैं।", "Reflex arcs are formed in the spinal cord, though the information also goes on to the brain.", "प्रतिवर्ती चाप मेरुरज्जु में बनते हैं, यद्यपि सूचना मस्तिष्क तक भी पहुँचती है।"],
    ["The medulla maintains the balance of the body.", "मेडुला शरीर का संतुलन बनाए रखता है।", "Balance is maintained by the cerebellum; the medulla controls involuntary actions such as vomiting.", "संतुलन अनुमस्तिष्क बनाए रखता है; मेडुला वमन जैसी अनैच्छिक क्रियाओं का नियंत्रण करता है।"],
    ["Auxin makes the cells on the side facing light grow faster.", "ऑक्सिन प्रकाश की ओर वाली कोशिकाओं को तेज़ी से बढ़ाता है।", "Auxin moves to the shaded side and makes those cells longer, so the shoot bends towards light.", "ऑक्सिन छाया वाली ओर जाकर वहाँ की कोशिकाओं को लंबा करता है, इसलिए प्ररोह प्रकाश की ओर मुड़ता है।"],
    ["Cytokinins inhibit growth and cause wilting of leaves.", "साइटोकाइनिन वृद्धि रोकते हैं और पत्तियों को मुरझाते हैं।", "Abscisic acid inhibits growth and causes wilting; cytokinins promote cell division.", "एब्सिसिक अम्ल वृद्धि रोकता है और पत्तियों को मुरझाता है; साइटोकाइनिन कोशिका विभाजन को प्रेरित करते हैं।"],
    ["Insulin is secreted by the thyroid gland.", "इंसुलिन अवटु (थायरॉइड) ग्रंथि से स्रावित होता है।", "Insulin is secreted by the pancreas.", "इंसुलिन अग्न्याशय से स्रावित होता है।"],
    ["The thyroid gland needs calcium to make thyroxin.", "थायरॉक्सिन बनाने के लिए अवटु ग्रंथि को कैल्सियम की आवश्यकता होती है।", "The thyroid gland needs iodine to make thyroxin.", "थायरॉक्सिन बनाने के लिए अवटु ग्रंथि को आयोडीन की आवश्यकता होती है।"],
    ["Adrenaline reaches the heart through a special duct.", "एड्रीनलीन एक विशेष वाहिनी द्वारा हृदय तक पहुँचता है।", "Adrenaline is secreted directly into the blood; endocrine glands have no ducts.", "एड्रीनलीन सीधे रुधिर में स्रावित होता है; अंतःस्रावी ग्रंथियों में वाहिनी नहीं होती।"],
    ["Roots bend towards light.", "जड़ें प्रकाश की ओर मुड़ती हैं।", "Roots grow away from light; shoots bend towards it.", "जड़ें प्रकाश से दूर बढ़ती हैं; प्ररोह प्रकाश की ओर मुड़ते हैं।"],
    ["The folding of touch-me-not leaves is a growth movement.", "छुई-मुई की पत्तियों का मुड़ना वृद्धि-गति है।", "Touch-me-not leaves fold without growth: their cells change shape by changing the amount of water in them.", "छुई-मुई की पत्तियाँ बिना वृद्धि के मुड़ती हैं: उनकी कोशिकाएँ अपने भीतर जल की मात्रा बदलकर आकार बदलती हैं।"],
    ["The electrical impulse jumps directly from one neuron to the next.", "विद्युत आवेग एक न्यूरॉन से सीधे अगले न्यूरॉन पर कूद जाता है।", "At the synapse the impulse releases chemicals that start a new impulse in the next neuron.", "सिनैप्स पर आवेग रसायन मुक्त करता है, जो अगले न्यूरॉन में नया आवेग आरंभ करते हैं।"],
    ["A deficiency of growth hormone in childhood leads to goitre.", "बचपन में वृद्धि हॉर्मोन की कमी से गलगंड (घेंघा) होता है।", "Lack of growth hormone in childhood leads to dwarfism; goitre is due to lack of iodine.", "बचपन में वृद्धि हॉर्मोन की कमी से बौनापन होता है; गलगंड आयोडीन की कमी से होता है।"],
  ],
  ar: [
    ["Iodised salt is advised in our diet.", "हमारे आहार में आयोडीन युक्त नमक की सलाह दी जाती है।", "Iodine is needed by the thyroid gland to make thyroxin.", "थायरॉक्सिन बनाने के लिए अवटु ग्रंथि को आयोडीन की आवश्यकता होती है।"],
    ["A potted plant kept near a window bends towards the light.", "खिड़की के पास रखा गमले का पौधा प्रकाश की ओर मुड़ जाता है।", "Auxin moves to the shaded side of the shoot and makes those cells grow longer.", "ऑक्सिन प्ररोह की छाया वाली ओर जाकर वहाँ की कोशिकाओं को लंबा करता है।"],
    ["We pull our hand away from a flame very quickly.", "हम ज्वाला से अपना हाथ बहुत शीघ्र हटा लेते हैं।", "The reflex arc that links the sensory and motor neurons is formed in the spinal cord.", "संवेदी और प्रेरक न्यूरॉनों को जोड़ने वाला प्रतिवर्ती चाप मेरुरज्जु में बनता है।"],
    ["People whose pancreas makes too little insulin have a high blood sugar level.", "जिन लोगों का अग्न्याशय कम इंसुलिन बनाता है, उनके रुधिर में शर्करा का स्तर अधिक होता है।", "Insulin regulates the blood sugar level.", "इंसुलिन रुधिर में शर्करा के स्तर का नियमन करता है।"],
    ["A pollen tube grows towards the ovule.", "पराग नलिका बीजांड की ओर बढ़ती है।", "Pollen tubes show chemotropism, growth in response to chemicals.", "पराग नलिकाएँ रसायनानुवर्तन दर्शाती हैं, अर्थात रसायनों के प्रति वृद्धि।"],
    ["A tendril coils around a support.", "प्रतान किसी आधार के चारों ओर लिपट जाता है।", "The part of the tendril away from the support grows faster than the part touching it.", "प्रतान का आधार से दूर वाला भाग, आधार को छूने वाले भाग से तेज़ी से बढ़ता है।"],
  ],
};

// ---------- How do organisms reproduce? (NCERT 10, pogl. 7) ----------
BANK["how-organisms-reproduce"] = {
  sets: [
    {
      k: ["organism", "जीव"],
      q: ["How does % reproduce asexually?", "% अलैंगिक जनन कैसे करता है?"],
      rq: ["Which organism reproduces in this way: %?", "कौन-सा जीव इस प्रकार जनन करता है: %?"],
      items: [
        ["Amoeba", "अमीबा", "binary fission in any plane", "किसी भी तल में द्विखंडन"],
        ["Leishmania", "लीशमानिया", "binary fission in a definite plane with respect to its whip-like structure", "अपनी कशाभ जैसी संरचना के सापेक्ष निश्चित तल में द्विखंडन"],
        ["Plasmodium", "प्लाज़्मोडियम", "multiple fission into many daughter cells", "बहुखंडन द्वारा अनेक संतति कोशिकाएँ"],
        ["Hydra", "हाइड्रा", "budding from regenerative cells", "पुनर्जनन कोशिकाओं से मुकुलन"],
        ["Spirogyra", "स्पाइरोगाइरा", "fragmentation of the filament into pieces that grow into new individuals", "तंतु के खंडों में टूटने (खंडन) से, प्रत्येक खंड नया जीव बनता है"],
        ["Planaria", "प्लेनेरिया", "regeneration of complete organisms from cut body pieces", "कटे हुए शरीर के टुकड़ों से पूरे जीवों का पुनर्जनन"],
        ["Rhizopus", "राइज़ोपस", "spores formed in sporangia", "बीजाणुधानी में बने बीजाणु"],
        ["Bryophyllum", "ब्रायोफिलम", "buds in the notches along the leaf margin that grow into new plants", "पत्ती के किनारे की खाँचों में बनी कलिकाएँ, जो विकसित होकर नए पौधे बनाती हैं"],
      ],
    },
    {
      k: ["part of a flower", "पुष्प का भाग"],
      q: ["What is the role of the %?", "% की क्या भूमिका है?"],
      rq: ["Which part of a flower is described here: %?", "यहाँ पुष्प के किस भाग का वर्णन है: %?"],
      items: [
        ["sepals", "बाह्यदल", "are the green outermost parts that protect the flower in the bud", "सबसे बाहर के हरे भाग हैं, जो कली अवस्था में पुष्प की रक्षा करते हैं"],
        ["petals", "दल (पंखुड़ियाँ)", "are usually brightly coloured and attract insects for pollination", "प्रायः चमकीले रंग के होते हैं और परागण के लिए कीटों को आकर्षित करते हैं"],
        ["anther", "परागकोश", "produces pollen grains", "परागकण बनाता है"],
        ["stigma", "वर्तिकाग्र", "is the sticky tip of the carpel that receives pollen", "स्त्रीकेसर का चिपचिपा सिरा है, जो परागकण ग्रहण करता है"],
        ["style", "वर्तिका", "is the long middle part of the carpel through which the pollen tube grows", "स्त्रीकेसर का लंबा मध्य भाग है, जिससे होकर पराग नलिका बढ़ती है"],
        ["ovary", "अंडाशय", "contains ovules and develops into the fruit", "इसमें बीजांड होते हैं और यह फल में विकसित होता है"],
        ["ovule", "बीजांड", "contains the egg cell and develops into the seed", "इसमें अंड कोशिका होती है और यह बीज में विकसित होता है"],
      ],
    },
    {
      k: ["part of the human reproductive system", "मानव जनन तंत्र का भाग"],
      q: ["What is the role of the %?", "% की क्या भूमिका है?"],
      rq: ["Which part is described here: %?", "यहाँ किस भाग का वर्णन है: %?"],
      items: [
        ["testes", "वृषण", "produce sperms and testosterone and lie outside the abdominal cavity", "शुक्राणु और टेस्टोस्टेरॉन बनाते हैं तथा उदर गुहा के बाहर स्थित होते हैं"],
        ["vas deferens", "शुक्रवाहिका", "carries sperms from the testis and joins the tube coming from the urinary bladder", "वृषण से शुक्राणुओं को ले जाती है और मूत्राशय से आने वाली नली से मिलती है"],
        ["seminal vesicles and prostate gland", "शुक्राशय और प्रोस्टेट ग्रंथि", "add their secretions so that the sperms are in a fluid", "अपने स्राव मिलाते हैं, जिससे शुक्राणु एक तरल माध्यम में रहते हैं"],
        ["oviduct (fallopian tube)", "अंडवाहिनी (फैलोपियन नलिका)", "is the site of fertilisation and carries the egg towards the uterus", "निषेचन का स्थान है और अंड को गर्भाशय की ओर ले जाती है"],
        ["uterus", "गर्भाशय", "is where the embryo gets implanted in the thick lining", "वह स्थान है जहाँ भ्रूण मोटे आस्तर में रोपित होता है"],
        ["placenta", "प्लेसेंटा", "is a disc-like tissue in the uterine wall that supplies the embryo with glucose and oxygen", "गर्भाशय की भित्ति में धँसा तश्तरी जैसा ऊतक है, जो भ्रूण को ग्लूकोज़ और ऑक्सीजन देता है"],
        ["ovaries", "अंडाशय", "release one egg every month and make female hormones", "प्रत्येक माह एक अंड मुक्त करते हैं और स्त्री हॉर्मोन बनाते हैं"],
      ],
    },
  ],
  tf: [
    ["DNA copying during reproduction is not absolutely accurate, and this produces variation.", "जनन के समय DNA की प्रतिकृति पूर्णतः सटीक नहीं होती, और इससे विभिन्नता उत्पन्न होती है।"],
    ["Germ cells have half the number of chromosomes of the body cells.", "जनन कोशिकाओं में शरीर की कोशिकाओं के आधे गुणसूत्र होते हैं।"],
    ["In humans, fertilisation takes place in the oviduct.", "मनुष्य में निषेचन अंडवाहिनी में होता है।"],
    ["Banana, orange, rose and jasmine are propagated vegetatively because they have lost the capacity to produce seeds.", "केला, संतरा, गुलाब और चमेली का कायिक प्रवर्धन किया जाता है क्योंकि उनमें बीज बनाने की क्षमता समाप्त हो गई है।"],
    ["After fertilisation, the ovary develops into the fruit and the ovules develop into seeds.", "निषेचन के बाद अंडाशय फल में और बीजांड बीज में विकसित होते हैं।"],
    ["Papaya and watermelon have unisexual flowers.", "पपीते और तरबूज़ के पुष्प एकलिंगी होते हैं।"],
    ["Condoms reduce the transmission of sexually transmitted diseases.", "कंडोम लैंगिक संचारित रोगों के संचरण को कम करते हैं।"],
    ["A copper-T placed in the uterus prevents pregnancy.", "गर्भाशय में रखा कॉपर-T गर्भधारण को रोकता है।"],
    ["Gonorrhoea and syphilis are bacterial infections, while warts and HIV-AIDS are viral.", "सुज़ाक (गोनोरिया) और सिफ़िलिस जीवाणु संक्रमण हैं, जबकि मस्से और HIV-AIDS विषाणु संक्रमण हैं।"],
    ["If the egg is not fertilised, the thick lining of the uterus breaks down and comes out as menstruation.", "यदि अंड का निषेचन नहीं होता, तो गर्भाशय का मोटा आस्तर टूटकर रजोधर्म के रूप में बाहर निकलता है।"],
    ["The zygote divides repeatedly to form an embryo within the ovule.", "युग्मनज बार-बार विभाजित होकर बीजांड के भीतर भ्रूण बनाता है।"],
    ["Transfer of pollen from the anther to the stigma of the same flower is self-pollination.", "उसी पुष्प के परागकोश से वर्तिकाग्र तक परागकणों का स्थानांतरण स्वपरागण कहलाता है।"],
  ],
  ff: [
    ["Planaria reproduces by budding.", "प्लेनेरिया मुकुलन द्वारा जनन करता है।", "Planaria shows regeneration; Hydra reproduces by budding.", "प्लेनेरिया में पुनर्जनन होता है; मुकुलन हाइड्रा में होता है।"],
    ["Plasmodium divides by binary fission.", "प्लाज़्मोडियम द्विखंडन द्वारा विभाजित होता है।", "Plasmodium divides by multiple fission.", "प्लाज़्मोडियम बहुखंडन द्वारा विभाजित होता है।"],
    ["Spirogyra reproduces by forming spores in sporangia.", "स्पाइरोगाइरा बीजाणुधानियों में बीजाणु बनाकर जनन करता है।", "Spirogyra reproduces by fragmentation; Rhizopus forms spores.", "स्पाइरोगाइरा खंडन से जनन करता है; बीजाणु राइज़ोपस बनाता है।"],
    ["Pollen grains are produced in the style.", "परागकण वर्तिका में बनते हैं।", "Pollen grains are produced in the anther.", "परागकण परागकोश में बनते हैं।"],
    ["After fertilisation, the ovule develops into the fruit.", "निषेचन के बाद बीजांड फल में विकसित होता है।", "The ovule becomes the seed; the ovary becomes the fruit.", "बीजांड बीज बनता है; अंडाशय फल बनता है।"],
    ["In humans, fertilisation takes place in the uterus.", "मनुष्य में निषेचन गर्भाशय में होता है।", "Fertilisation takes place in the oviduct.", "निषेचन अंडवाहिनी में होता है।"],
    ["Hibiscus and mustard have unisexual flowers.", "गुड़हल और सरसों के पुष्प एकलिंगी होते हैं।", "Hibiscus and mustard have bisexual flowers; papaya and watermelon have unisexual ones.", "गुड़हल और सरसों के पुष्प उभयलिंगी हैं; एकलिंगी पुष्प पपीते और तरबूज़ में होते हैं।"],
    ["Oral contraceptive pills protect against sexually transmitted diseases.", "मुख से ली जाने वाली गर्भनिरोधक गोलियाँ लैंगिक संचारित रोगों से बचाती हैं।", "Oral pills change the hormonal balance so that eggs are not released; they do not stop infections.", "गर्भनिरोधक गोलियाँ हॉर्मोन संतुलन बदलकर अंड का मोचन रोकती हैं; वे संक्रमण नहीं रोकतीं।"],
    ["Each ovary releases an egg every day.", "प्रत्येक अंडाशय हर दिन एक अंड मुक्त करता है।", "One egg is released from one of the ovaries every month.", "हर माह किसी एक अंडाशय से एक अंड मुक्त होता है।"],
    ["Germ cells have the same number of chromosomes as body cells.", "जनन कोशिकाओं में शरीर की कोशिकाओं जितने ही गुणसूत्र होते हैं।", "Germ cells have half the number; fertilisation restores the full number.", "जनन कोशिकाओं में आधे गुणसूत्र होते हैं; निषेचन पूरी संख्या लौटा देता है।"],
    ["Gonorrhoea is a viral disease.", "सुज़ाक (गोनोरिया) एक विषाणु रोग है।", "Gonorrhoea is caused by bacteria.", "सुज़ाक जीवाणु से होता है।"],
  ],
  ar: [
    ["The testes lie outside the abdominal cavity, in the scrotum.", "वृषण उदर गुहा के बाहर वृषणकोष में स्थित होते हैं।", "Sperm formation needs a lower temperature than the normal body temperature.", "शुक्राणु बनने के लिए शरीर के सामान्य ताप से कम ताप की आवश्यकता होती है।"],
    ["Germ cells contain only one set of chromosomes.", "जनन कोशिकाओं में गुणसूत्रों का केवल एक समुच्चय होता है।", "When two germ cells fuse, the original number of chromosomes is restored in the offspring.", "दो जनन कोशिकाओं के संलयन से संतति में गुणसूत्रों की मूल संख्या पुनः स्थापित हो जाती है।"],
    ["Banana, rose and jasmine are grown by vegetative propagation.", "केला, गुलाब और चमेली कायिक प्रवर्धन द्वारा उगाए जाते हैं।", "Banana, rose and jasmine have lost the capacity to produce seeds.", "केले, गुलाब और चमेली में बीज बनाने की क्षमता समाप्त हो गई है।"],
    ["Rhizopus spores can survive until they reach a moist surface.", "राइज़ोपस के बीजाणु नम सतह तक पहुँचने तक जीवित रह सकते हैं।", "The spores are covered by thick walls that protect them.", "बीजाणु मोटी भित्ति से ढके रहते हैं, जो उनकी रक्षा करती है।"],
    ["Condoms reduce the spread of sexually transmitted diseases.", "कंडोम लैंगिक संचारित रोगों के फैलाव को कम करते हैं।", "Condoms form a mechanical barrier between the partners.", "कंडोम साथियों के बीच एक यांत्रिक अवरोध बनाते हैं।"],
    ["The fruit of a plant develops from the ovary.", "पौधे का फल अंडाशय से विकसित होता है।", "After fertilisation the ovary grows rapidly and ripens to form the fruit.", "निषेचन के बाद अंडाशय तेज़ी से वृद्धि करता है और पककर फल बनता है।"],
  ],
};

// ---------- Heredity (NCERT 10, pogl. 8) ----------
BANK["heredity-and-variation"] = {
  sets: [
    {
      k: ["term", "पद"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which term is described here: %?", "यहाँ किस पद का वर्णन है: %?"],
      items: [
        ["a dominant trait", "प्रभावी लक्षण", "is the trait expressed in all F1 plants when two contrasting traits are crossed", "दो विपरीत लक्षणों के संकरण पर सभी F1 पौधों में प्रकट होने वाला लक्षण है"],
        ["a recessive trait", "अप्रभावी लक्षण", "is hidden in F1 and reappears in about one-quarter of the F2 plants", "F1 में छिपा रहता है और F2 के लगभग एक-चौथाई पौधों में फिर प्रकट होता है"],
        ["a gene", "जीन", "is a section of DNA that provides information for one protein", "DNA का वह खंड है जो एक प्रोटीन के लिए सूचना देता है"],
        ["a monohybrid cross", "एकसंकर संकरण", "involves one pair of contrasting traits and gives a 3 : 1 ratio in F2", "एक जोड़ी विपरीत लक्षणों का संकरण है और F2 में 3 : 1 अनुपात देता है"],
        ["a dihybrid cross", "द्विसंकर संकरण", "involves two pairs of contrasting traits and gives a 9 : 3 : 3 : 1 ratio in F2", "दो जोड़ी विपरीत लक्षणों का संकरण है और F2 में 9 : 3 : 3 : 1 अनुपात देता है"],
        ["the sex chromosomes", "लिंग गुणसूत्र", "are the pair that is XX in women and XY in men", "वह जोड़ी हैं जो स्त्रियों में XX और पुरुषों में XY होती है"],
        ["variation", "विभिन्नता", "means differences among individuals; sexual reproduction increases it", "व्यष्टियों के बीच अंतर है; लैंगिक जनन इसे बढ़ाता है"],
      ],
    },
    {
      k: ["character of the pea plant", "मटर के पौधे का लक्षण"],
      q: ["In Mendel's pea plants, which pair (dominant – recessive) is correct for %?", "मेंडल के मटर के पौधों में % के लिए कौन-सी जोड़ी (प्रभावी – अप्रभावी) सही है?"],
      rq: ["In Mendel's pea plants, which character has this pair: %?", "मेंडल के मटर के पौधों में किस लक्षण की यह जोड़ी है: %?"],
      items: [
        ["plant height", "पौधे की लंबाई", "tall (dominant) – short (recessive)", "लंबा (प्रभावी) – बौना (अप्रभावी)"],
        ["seed shape", "बीज का आकार", "round (dominant) – wrinkled (recessive)", "गोल (प्रभावी) – झुर्रीदार (अप्रभावी)"],
        ["seed colour", "बीज का रंग", "yellow (dominant) – green (recessive)", "पीला (प्रभावी) – हरा (अप्रभावी)"],
        ["flower colour", "पुष्प का रंग", "violet (dominant) – white (recessive)", "बैंगनी (प्रभावी) – सफ़ेद (अप्रभावी)"],
        ["pod colour", "फली का रंग", "green (dominant) – yellow (recessive)", "हरा (प्रभावी) – पीला (अप्रभावी)"],
        ["flower position", "पुष्प की स्थिति", "axial (dominant) – terminal (recessive)", "कक्षीय (प्रभावी) – शीर्षस्थ (अप्रभावी)"],
      ],
    },
  ],
  tf: [
    ["Humans have 23 pairs of chromosomes, one pair of which are the sex chromosomes.", "मनुष्य में गुणसूत्रों के 23 जोड़े होते हैं, जिनमें से एक जोड़ा लिंग गुणसूत्रों का है।"],
    ["Whether a child is a boy or a girl depends on whether the sperm carries an X or a Y chromosome.", "बच्चा लड़का होगा या लड़की, यह इस पर निर्भर है कि शुक्राणु में X गुणसूत्र है या Y।"],
    ["All human eggs carry an X chromosome.", "मनुष्य के सभी अंडों में X गुणसूत्र होता है।"],
    ["In some reptiles, the temperature at which fertilised eggs are kept decides the sex of the offspring.", "कुछ सरीसृपों में निषेचित अंडों को रखने का ताप संतति का लिंग निर्धारित करता है।"],
    ["Snails can change sex, so in them sex is not genetically determined.", "घोंघे अपना लिंग बदल सकते हैं, अतः उनमें लिंग आनुवंशिक रूप से निर्धारित नहीं होता।"],
    ["Each parent contributes one copy of each gene to the offspring.", "संतति को प्रत्येक जीन की एक प्रति प्रत्येक जनक से मिलती है।"],
    ["Germ cells carry only one copy of each gene.", "जनन कोशिकाओं में प्रत्येक जीन की केवल एक प्रति होती है।"],
    ["All F1 plants from a cross between pure tall (TT) and pure short (tt) plants are tall.", "शुद्ध लंबे (TT) और शुद्ध बौने (tt) पौधों के संकरण से सभी F1 पौधे लंबे होते हैं।"],
    ["Plants with the genotypes TT and Tt both look tall.", "TT और Tt जीनोटाइप वाले दोनों पौधे लंबे दिखते हैं।"],
    ["The genotypic ratio in the F2 of a monohybrid cross is 1 : 2 : 1.", "एकसंकर संकरण की F2 पीढ़ी में जीनोटाइप अनुपात 1 : 2 : 1 होता है।"],
    ["In a dihybrid cross, new combinations such as round-green seeds appear in F2, so the two traits are inherited independently.", "द्विसंकर संकरण की F2 में गोल-हरे जैसे नए संयोजन बनते हैं, अतः दोनों लक्षण स्वतंत्र रूप से वंशागत होते हैं।"],
  ],
  ff: [
    ["The mother decides the sex of the child.", "बच्चे का लिंग माता निर्धारित करती है।", "The father's sperm decides the sex: a sperm carries either X or Y, while every egg carries X.", "लिंग पिता का शुक्राणु निर्धारित करता है: शुक्राणु में X या Y होता है, जबकि प्रत्येक अंड में X होता है।"],
    ["A child who inherits an X chromosome from the father becomes a boy.", "जिस बच्चे को पिता से X गुणसूत्र मिलता है, वह लड़का होता है।", "X from the father gives a girl; Y from the father gives a boy.", "पिता से X मिलने पर लड़की और Y मिलने पर लड़का होता है।"],
    ["In Mendel's monohybrid cross, the F2 phenotypic ratio was 1 : 2 : 1.", "मेंडल के एकसंकर संकरण में F2 का फ़ीनोटाइप अनुपात 1 : 2 : 1 था।", "The F2 phenotypic ratio of a monohybrid cross is 3 : 1; 1 : 2 : 1 is the genotypic ratio.", "एकसंकर संकरण में F2 का फ़ीनोटाइप अनुपात 3 : 1 है; 1 : 2 : 1 जीनोटाइप अनुपात है।"],
    ["All F1 plants of a cross between TT and tt plants are short.", "TT और tt पौधों के संकरण से सभी F1 पौधे बौने होते हैं।", "All F1 plants of a TT × tt cross are tall (Tt), because tallness is dominant.", "TT × tt संकरण के सभी F1 पौधे लंबे (Tt) होते हैं, क्योंकि लंबापन प्रभावी है।"],
    ["The F2 ratio of a dihybrid cross is 3 : 1.", "द्विसंकर संकरण का F2 अनुपात 3 : 1 है।", "The F2 ratio of a dihybrid cross is 9 : 3 : 3 : 1.", "द्विसंकर संकरण का F2 अनुपात 9 : 3 : 3 : 1 है।"],
    ["Women have one X and one Y chromosome.", "स्त्रियों में एक X और एक Y गुणसूत्र होता है।", "Women are XX; men are XY.", "स्त्रियाँ XX और पुरुष XY होते हैं।"],
    ["Recessive traits disappear for ever after the F1 generation.", "F1 पीढ़ी के बाद अप्रभावी लक्षण सदा के लिए लुप्त हो जाते हैं।", "Recessive traits reappear in about one-quarter of the F2 plants.", "अप्रभावी लक्षण F2 के लगभग एक-चौथाई पौधों में फिर प्रकट होते हैं।"],
    ["A Tt pea plant is short because it carries the gene t.", "Tt मटर का पौधा बौना होता है क्योंकि उसमें t जीन है।", "A Tt pea plant is tall: a single copy of T is enough for tallness.", "Tt मटर का पौधा लंबा होता है: लंबेपन के लिए T की एक प्रति पर्याप्त है।"],
    ["Germ cells carry two copies of each gene.", "जनन कोशिकाओं में प्रत्येक जीन की दो प्रतियाँ होती हैं।", "Germ cells carry only one copy of each gene.", "जनन कोशिकाओं में प्रत्येक जीन की केवल एक प्रति होती है।"],
    ["Human body cells have 23 chromosomes.", "मनुष्य की शरीर कोशिकाओं में 23 गुणसूत्र होते हैं।", "Human body cells have 23 pairs, i.e. 46 chromosomes.", "मनुष्य की शरीर कोशिकाओं में 23 जोड़े, अर्थात 46 गुणसूत्र होते हैं।"],
  ],
  ar: [
    ["The chance of a newborn baby being a boy or a girl is equal.", "नवजात शिशु के लड़का या लड़की होने की संभावना बराबर होती है।", "Half of the sperms carry an X chromosome and half carry a Y chromosome.", "आधे शुक्राणुओं में X और आधे में Y गुणसूत्र होता है।"],
    ["All F1 plants of a cross between pure tall and pure short pea plants are tall.", "शुद्ध लंबे और शुद्ध बौने मटर के पौधों के संकरण से सभी F1 पौधे लंबे होते हैं।", "Tallness is dominant over shortness.", "लंबापन बौनेपन पर प्रभावी है।"],
    ["Short plants reappear in the F2 of Mendel's monohybrid cross.", "मेंडल के एकसंकर संकरण की F2 में बौने पौधे फिर प्रकट होते हैं।", "The F1 plants (Tt) carry the gene t hidden, and two t genes can come together in F2.", "F1 पौधों (Tt) में t जीन छिपा रहता है, और F2 में दो t जीन एक साथ आ सकते हैं।"],
    ["Germ cells have only one set of chromosomes.", "जनन कोशिकाओं में गुणसूत्रों का केवल एक समुच्चय होता है।", "Fusion of two germ cells then restores the normal number in the offspring.", "तब दो जनन कोशिकाओं के संलयन से संतति में सामान्य संख्या पुनः बन जाती है।"],
    ["Round-green and wrinkled-yellow seeds appear in the F2 of a dihybrid cross.", "द्विसंकर संकरण की F2 में गोल-हरे और झुर्रीदार-पीले बीज बनते हैं।", "Seed shape and seed colour are inherited independently.", "बीज का आकार और बीज का रंग स्वतंत्र रूप से वंशागत होते हैं।"],
  ],
};

// ---------- Our environment (NCERT 10, pogl. 13) ----------
BANK["our-environment"] = {
  sets: [
    {
      k: ["term", "पद"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which term is described here: %?", "यहाँ किस पद का वर्णन है: %?"],
      items: [
        ["producers", "उत्पादक", "make food from simple inorganic substances using sunlight", "सूर्य के प्रकाश की सहायता से सरल अकार्बनिक पदार्थों से भोजन बनाते हैं"],
        ["herbivores", "शाकाहारी", "are primary consumers that feed on producers", "प्राथमिक उपभोक्ता हैं, जो उत्पादकों को खाते हैं"],
        ["decomposers", "अपघटक", "are bacteria and fungi that break down dead remains and wastes", "जीवाणु और कवक हैं, जो मृत अवशेषों और अपशिष्टों का अपघटन करते हैं"],
        ["a trophic level", "पोषी स्तर", "is each step of a food chain at which energy is transferred", "खाद्य शृंखला का प्रत्येक चरण है, जहाँ ऊर्जा का स्थानांतरण होता है"],
        ["a food web", "आहार जाल", "is a network of interconnected food chains", "परस्पर जुड़ी खाद्य शृंखलाओं का जाल है"],
        ["biological magnification", "जैव आवर्धन", "is the increase in concentration of harmful chemicals at each higher trophic level", "प्रत्येक उच्चतर पोषी स्तर पर हानिकारक रसायनों की सांद्रता का बढ़ना है"],
        ["an ecosystem", "पारितंत्र", "is all the organisms of an area together with the non-living components", "किसी क्षेत्र के सभी जीव तथा अजैव घटक मिलकर बनता है"],
      ],
    },
    {
      k: ["substance", "पदार्थ"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which substance is described here: %?", "यहाँ किस पदार्थ का वर्णन है: %?"],
      items: [
        ["CFCs", "क्लोरोफ्लुओरोकार्बन (CFCs)", "are used as refrigerants and in fire extinguishers and deplete the ozone layer", "प्रशीतकों और अग्निशामकों में प्रयुक्त होते हैं तथा ओज़ोन परत का क्षय करते हैं"],
        ["ozone (O₃)", "ओज़ोन (O₃)", "shields the Earth from ultraviolet radiation from the Sun", "पृथ्वी को सूर्य के पराबैंगनी विकिरण से बचाती है"],
        ["ultraviolet radiation", "पराबैंगनी विकिरण", "is highly damaging to organisms and can cause skin cancer in humans", "जीवों के लिए अत्यंत हानिकारक है और मनुष्य में त्वचा कैंसर कर सकता है"],
        ["pesticides", "पीड़कनाशी", "are non-biodegradable chemicals that accumulate along food chains", "अजैव निम्नीकरणीय रसायन हैं, जो खाद्य शृंखला में संचित होते जाते हैं"],
        ["plastic", "प्लास्टिक", "is non-biodegradable and stays in the environment for a long time", "अजैव निम्नीकरणीय है और पर्यावरण में लंबे समय तक बना रहता है"],
        ["fruit and vegetable peels", "फलों और सब्ज़ियों के छिलके", "are biodegradable kitchen waste that microbes break down", "जैव निम्नीकरणीय रसोई अपशिष्ट हैं, जिन्हें सूक्ष्मजीव अपघटित कर देते हैं"],
      ],
    },
  ],
  tf: [
    ["On average only about 10 % of the food eaten at one trophic level is made available to the next level.", "औसतन एक पोषी स्तर पर खाए गए भोजन का केवल लगभग 10 % अगले स्तर को उपलब्ध होता है।"],
    ["Green plants capture about 1 % of the energy of sunlight that falls on their leaves.", "हरे पौधे अपनी पत्तियों पर पड़ने वाले सूर्य के प्रकाश की लगभग 1 % ऊर्जा ग्रहण करते हैं।"],
    ["Food chains generally have only three or four trophic levels.", "खाद्य शृंखलाओं में प्रायः तीन या चार पोषी स्तर ही होते हैं।"],
    ["The flow of energy in an ecosystem is unidirectional.", "पारितंत्र में ऊर्जा का प्रवाह एकदिशीय होता है।"],
    ["Ozone in the upper atmosphere protects us, but at ground level it is a deadly poison.", "ऊपरी वायुमंडल में ओज़ोन हमारी रक्षा करती है, परंतु भूमि के स्तर पर यह घातक विष है।"],
    ["Ozone is formed when UV radiation splits oxygen molecules into free oxygen atoms, which then combine with oxygen molecules.", "पराबैंगनी विकिरण ऑक्सीजन अणुओं को मुक्त ऑक्सीजन परमाणुओं में तोड़ता है, जो ऑक्सीजन अणुओं से जुड़कर ओज़ोन बनाते हैं।"],
    ["In 1987, UNEP got an agreement to freeze CFC production at 1986 levels.", "1987 में UNEP ने CFC उत्पादन को 1986 के स्तर पर सीमित करने का समझौता कराया।"],
    ["Decomposers return simple substances to the soil so that they can be used again by plants.", "अपघटक सरल पदार्थों को मिट्टी में लौटा देते हैं, जिससे पौधे उनका फिर उपयोग कर सकें।"],
    ["Substances that are broken down by biological processes are called biodegradable.", "जैविक प्रक्रमों द्वारा अपघटित होने वाले पदार्थ जैव निम्नीकरणीय कहलाते हैं।"],
    ["Gardens and crop fields are human-made (artificial) ecosystems.", "उद्यान और फ़सल के खेत मानव-निर्मित (कृत्रिम) पारितंत्र हैं।"],
    ["The energy captured by autotrophs does not revert to the Sun.", "स्वपोषियों द्वारा ग्रहण की गई ऊर्जा सूर्य की ओर वापस नहीं जाती।"],
  ],
  ff: [
    ["About 90 % of the energy at one trophic level passes to the next.", "एक पोषी स्तर की लगभग 90 % ऊर्जा अगले स्तर तक पहुँचती है।", "Only about 10 % of the energy passes on to the next trophic level.", "अगले पोषी स्तर तक केवल लगभग 10 % ऊर्जा ही जाती है।"],
    ["Harmful chemicals become less concentrated at higher trophic levels.", "उच्चतर पोषी स्तरों पर हानिकारक रसायनों की सांद्रता घटती जाती है।", "The concentration of harmful chemicals increases at each higher trophic level (biological magnification).", "प्रत्येक उच्चतर पोषी स्तर पर हानिकारक रसायनों की सांद्रता बढ़ती है (जैव आवर्धन)।"],
    ["CFCs increase the amount of ozone in the upper atmosphere.", "CFCs ऊपरी वायुमंडल में ओज़ोन की मात्रा बढ़ाते हैं।", "CFCs deplete the ozone layer.", "CFCs ओज़ोन परत का क्षय करते हैं।"],
    ["Plastic is quickly broken down by bacteria.", "प्लास्टिक को जीवाणु शीघ्र अपघटित कर देते हैं।", "Plastic is non-biodegradable.", "प्लास्टिक अजैव निम्नीकरणीय है।"],
    ["Energy flows in a cycle in an ecosystem, like nutrients.", "पारितंत्र में ऊर्जा पोषकों की भाँति चक्र में बहती है।", "Energy flow is unidirectional; only nutrients are recycled.", "ऊर्जा का प्रवाह एकदिशीय है; केवल पोषकों का पुनर्चक्रण होता है।"],
    ["Herbivores form the first trophic level.", "शाकाहारी पहला पोषी स्तर बनाते हैं।", "Producers form the first trophic level; herbivores form the second.", "पहला पोषी स्तर उत्पादक बनाते हैं; दूसरा शाकाहारी।"],
    ["Green plants capture about 10 % of the sunlight falling on their leaves.", "हरे पौधे पत्तियों पर पड़ने वाले सूर्य प्रकाश का लगभग 10 % ग्रहण करते हैं।", "Green plants capture only about 1 % of the sunlight falling on their leaves.", "हरे पौधे पत्तियों पर पड़ने वाले सूर्य प्रकाश का केवल लगभग 1 % ग्रहण करते हैं।"],
    ["Ozone is harmless at ground level.", "भूमि के स्तर पर ओज़ोन हानिरहित है।", "At ground level ozone is a deadly poison.", "भूमि के स्तर पर ओज़ोन घातक विष है।"],
    ["Food chains usually have eight to ten trophic levels.", "खाद्य शृंखलाओं में प्रायः आठ से दस पोषी स्तर होते हैं।", "Food chains usually have only three or four trophic levels.", "खाद्य शृंखलाओं में प्रायः केवल तीन या चार पोषी स्तर होते हैं।"],
    ["Decomposers are the producers of an ecosystem.", "अपघटक पारितंत्र के उत्पादक हैं।", "Producers are green plants; decomposers break down dead matter.", "उत्पादक हरे पौधे हैं; अपघटक मृत पदार्थ का अपघटन करते हैं।"],
  ],
  ar: [
    ["Food chains rarely have more than four trophic levels.", "खाद्य शृंखलाओं में चार से अधिक पोषी स्तर बहुत कम होते हैं।", "Only about 10 % of the energy passes to each next level, so very little remains after a few steps.", "प्रत्येक अगले स्तर तक केवल लगभग 10 % ऊर्जा पहुँचती है, इसलिए कुछ चरणों के बाद बहुत कम ऊर्जा बचती है।"],
    ["Humans, at the top of many food chains, can carry the highest concentration of pesticides.", "अनेक खाद्य शृंखलाओं के शीर्ष पर स्थित मनुष्य में पीड़कनाशियों की सांद्रता सबसे अधिक हो सकती है।", "Non-biodegradable chemicals accumulate progressively at each trophic level.", "अजैव निम्नीकरणीय रसायन प्रत्येक पोषी स्तर पर क्रमशः संचित होते जाते हैं।"],
    ["The use of CFCs has been cut down worldwide.", "विश्व भर में CFCs का उपयोग घटाया गया है।", "CFCs deplete the ozone layer that protects us from UV radiation.", "CFCs उस ओज़ोन परत का क्षय करते हैं, जो हमें पराबैंगनी विकिरण से बचाती है।"],
    ["Decomposers are essential in an ecosystem.", "पारितंत्र में अपघटक अनिवार्य हैं।", "Decomposers break down dead remains and replenish the soil with nutrients.", "अपघटक मृत अवशेषों का अपघटन करके मिट्टी में पोषक लौटाते हैं।"],
    ["Plastic bags stay in the environment for a very long time.", "प्लास्टिक की थैलियाँ पर्यावरण में बहुत लंबे समय तक बनी रहती हैं।", "Plastic is not broken down by biological processes.", "जैविक प्रक्रम प्लास्टिक का अपघटन नहीं करते।"],
  ],
};

// ---------- Plant anatomy and morphology (NCERT 11, pogl. 5 in 6) ----------
BANK["plant-anatomy-and-morphology"] = {
  sets: [
    {
      k: ["tissue", "ऊतक"],
      q: ["Which feature is characteristic of %?", "% का अभिलक्षण कौन-सा है?"],
      rq: ["Which tissue shows this feature: %?", "किस ऊतक में यह अभिलक्षण है: %?"],
      items: [
        ["parenchyma", "मृदूतक", "living, thin-walled cells for photosynthesis, storage and secretion", "प्रकाश-संश्लेषण, संग्रह और स्राव के लिए जीवित, पतली भित्ति वाली कोशिकाएँ"],
        ["collenchyma", "स्थूलकोणोतक", "living cells thickened at the corners with cellulose, hemicellulose and pectin", "कोनों पर सेल्युलोज़, हेमीसेल्युलोज़ और पेक्टिन से स्थूलित जीवित कोशिकाएँ"],
        ["sclerenchyma", "दृढ़ोतक", "dead cells with thick, lignified walls (fibres and sclereids)", "मोटी, लिग्निनयुक्त भित्ति वाली मृत कोशिकाएँ (रेशे और दृढ़कोशिकाएँ)"],
        ["apical meristem", "शीर्षस्थ विभज्योतक", "found at the tips of roots and shoots; produces primary tissues", "जड़ों और प्ररोहों के अग्रभाग पर; प्राथमिक ऊतक बनाता है"],
        ["intercalary meristem", "अंतर्वेशी विभज्योतक", "found between mature tissues in grasses; regenerates parts removed by grazing", "घासों में परिपक्व ऊतकों के बीच; चराई से हटे भागों को पुनः बनाता है"],
        ["lateral meristem (cambium)", "पार्श्व विभज्योतक (एधा)", "produces secondary tissues and increases the girth", "द्वितीयक ऊतक बनाता है और घेरा (मोटाई) बढ़ाता है"],
      ],
    },
    {
      k: ["element of xylem or phloem", "जाइलम या फ्लोएम का तत्त्व"],
      q: ["Which feature is characteristic of %?", "% का अभिलक्षण कौन-सा है?"],
      rq: ["Which element shows this feature: %?", "किस तत्त्व में यह अभिलक्षण है: %?"],
      items: [
        ["tracheids", "वाहिनिकाएँ", "elongated dead cells with tapering ends; the water-conducting cells of gymnosperms", "नुकीले सिरों वाली लंबी मृत कोशिकाएँ; अनावृतबीजियों की जल-संवहन कोशिकाएँ"],
        ["vessels", "वाहिकाएँ", "long tubes of many dead cells joined end to end; typical of angiosperms", "सिरे से सिरा जुड़ी अनेक मृत कोशिकाओं की लंबी नलिकाएँ; आवृतबीजियों की विशेषता"],
        ["xylem parenchyma", "जाइलम मृदूतक", "living cells that store starch or fat; rays conduct water radially", "स्टार्च या वसा संचित करने वाली जीवित कोशिकाएँ; किरणें जल का अरीय संवहन करती हैं"],
        ["sieve tube elements", "चालनी नलिका तत्त्व", "tubes with sieve plates whose mature cells have no nucleus", "चालनी पट्टिका वाली नलिकाएँ, जिनकी परिपक्व कोशिकाओं में केंद्रक नहीं होता"],
        ["companion cells", "सहचर कोशिकाएँ", "parenchyma cells whose nucleus controls the functions of a sieve tube", "मृदूतक कोशिकाएँ, जिनका केंद्रक चालनी नलिका के कार्यों का नियंत्रण करता है"],
        ["phloem parenchyma", "फ्लोएम मृदूतक", "stores food and is absent in most monocots", "भोजन संचित करता है और अधिकांश एकबीजपत्रियों में अनुपस्थित होता है"],
        ["phloem fibres", "फ्लोएम रेशे", "dead sclerenchyma; jute, flax and hemp fibres come from them", "मृत दृढ़ोतक; जूट, पटसन (फ्लैक्स) और भाँग के रेशे इन्हीं से मिलते हैं"],
      ],
    },
    {
      k: ["organ (in transverse section)", "अंग (अनुप्रस्थ काट में)"],
      q: ["Which feature is seen in the T.S. of a %?", "% की अनुप्रस्थ काट में कौन-सा लक्षण दिखता है?"],
      rq: ["Which organ shows this in T.S.: %?", "अनुप्रस्थ काट में यह किस अंग में दिखता है: %?"],
      items: [
        ["dicot root", "द्विबीजपत्री जड़", "two to four xylem and phloem patches", "जाइलम और फ्लोएम के दो से चार समूह"],
        ["monocot root", "एकबीजपत्री जड़", "more than six xylem bundles and a large pith", "छह से अधिक जाइलम बंडल और बड़ा मज्जा"],
        ["dicot stem", "द्विबीजपत्री तना", "a ring of conjoint, open vascular bundles", "संयुक्त, खुले संवहन बंडलों का एक वलय"],
        ["monocot stem", "एकबीजपत्री तना", "scattered vascular bundles, each with a sclerenchymatous bundle sheath", "बिखरे संवहन बंडल, प्रत्येक के चारों ओर दृढ़ोतकी बंडल आच्छद"],
        ["dicot (dorsiventral) leaf", "द्विबीजपत्री (पृष्ठाधारी) पत्ती", "mesophyll divided into palisade and spongy parenchyma", "पर्णमध्योतक, खंभ और स्पंजी मृदूतक में विभेदित"],
        ["monocot (isobilateral) leaf", "एकबीजपत्री (समद्विपार्श्विक) पत्ती", "undifferentiated mesophyll and bulliform cells in grasses", "अविभेदित पर्णमध्योतक और घासों में आवर्ध त्वक् कोशिकाएँ (बुलीफ़ॉर्म)"],
      ],
    },
    {
      k: ["floral term", "पुष्पीय पद"],
      q: ["Which example shows %?", "किस उदाहरण में % दिखता है?"],
      rq: ["Which term fits these examples: %?", "ये उदाहरण किस पद के हैं: %?"],
      items: [
        ["valvate aestivation", "कोरस्पर्शी पुष्पदल विन्यास", "Calotropis", "आक (कैलोट्रोपिस)"],
        ["twisted aestivation", "व्यावर्तित पुष्पदल विन्यास", "china rose, lady's finger and cotton", "गुड़हल, भिंडी और कपास"],
        ["imbricate aestivation", "कोरछादी पुष्पदल विन्यास", "Cassia and gulmohur", "केसिया और गुलमोहर"],
        ["vexillary aestivation", "ध्वजिक पुष्पदल विन्यास", "pea and bean", "मटर और सेम"],
        ["perigynous flower", "परिजायांगी पुष्प", "plum, rose and peach", "आलूबुखारा, गुलाब और आड़ू"],
        ["epigynous flower", "अधिजायांगी पुष्प", "guava, cucumber and the ray florets of sunflower", "अमरूद, खीरा और सूरजमुखी के रश्मि पुष्पक"],
        ["parietal placentation", "भित्तीय बीजांडन्यास", "mustard and Argemone", "सरसों और आर्जीमोन"],
        ["free central placentation", "मुक्त स्तंभीय बीजांडन्यास", "Dianthus and Primrose", "डायंथस और प्रिमरोज़"],
        ["basal placentation", "आधारी बीजांडन्यास", "sunflower and marigold", "सूरजमुखी और गेंदा"],
      ],
    },
  ],
  tf: [
    ["In racemose inflorescence the main axis keeps growing and flowers are borne laterally in acropetal succession.", "असीमाक्षी पुष्पक्रम में मुख्य अक्ष बढ़ता रहता है और पुष्प पार्श्व में अग्राभिसारी क्रम में लगते हैं।"],
    ["In cymose inflorescence the main axis ends in a flower, so its growth is limited.", "ससीमाक्षी पुष्पक्रम में मुख्य अक्ष एक पुष्प में समाप्त होता है, इसलिए उसकी वृद्धि सीमित रहती है।"],
    ["Gymnosperms lack vessels in their xylem.", "अनावृतबीजियों के जाइलम में वाहिकाएँ नहीं होतीं।"],
    ["Gymnosperms lack sieve tubes and companion cells; they have sieve cells and albuminous cells.", "अनावृतबीजियों में चालनी नलिकाएँ और सहचर कोशिकाएँ नहीं होतीं; उनमें चालनी कोशिकाएँ और ऐल्बुमिनी कोशिकाएँ होती हैं।"],
    ["Vascular bundles of monocot stems are closed because they have no cambium.", "एकबीजपत्री तने के संवहन बंडल बंद होते हैं क्योंकि उनमें एधा नहीं होती।"],
    ["In roots, xylem and phloem lie on different radii (radial arrangement).", "जड़ों में जाइलम और फ्लोएम अलग-अलग त्रिज्याओं पर होते हैं (अरीय व्यवस्था)।"],
    ["In stems the protoxylem lies towards the centre (endarch), and in roots towards the periphery (exarch).", "तनों में आदिदारु केंद्र की ओर (मध्यादिदारुक) और जड़ों में परिधि की ओर (बाह्यादिदारुक) होता है।"],
    ["The hypodermis of a dicot stem is made of collenchyma.", "द्विबीजपत्री तने की अधस्त्वचा स्थूलकोणोतक से बनी होती है।"],
    ["In Fabaceae the stamens are diadelphous, (9) + 1.", "फैबेसी में पुंकेसर द्विसंघी होते हैं, (9) + 1।"],
    ["In Solanaceae the stamens are epipetalous.", "सोलेनेसी में पुंकेसर दललग्न होते हैं।"],
    ["In a floral formula, ⊕ shows an actinomorphic flower and % a zygomorphic flower.", "पुष्प सूत्र में ⊕ त्रिज्यासममित और % एकव्याससममित पुष्प दर्शाता है।"],
    ["The ovary is superior in a hypogynous flower and inferior in an epigynous flower.", "अधोजायांगी पुष्प में अंडाशय ऊर्ध्ववर्ती और अधिजायांगी पुष्प में अधोवर्ती होता है।"],
  ],
  ff: [
    ["Vessels are the main water-conducting cells of gymnosperms.", "वाहिकाएँ अनावृतबीजियों की मुख्य जल-संवहन कोशिकाएँ हैं।", "Gymnosperms lack vessels; they conduct water through tracheids.", "अनावृतबीजियों में वाहिकाएँ नहीं होतीं; वे वाहिनिकाओं से जल का संवहन करते हैं।"],
    ["Mature sieve tube elements have a large nucleus.", "परिपक्व चालनी नलिका तत्त्वों में बड़ा केंद्रक होता है।", "Mature sieve tube elements lack a nucleus; the nucleus of the companion cell controls them.", "परिपक्व चालनी नलिका तत्त्वों में केंद्रक नहीं होता; सहचर कोशिका का केंद्रक इनका नियंत्रण करता है।"],
    ["Collenchyma cells are dead and have lignified walls.", "स्थूलकोणोतक कोशिकाएँ मृत होती हैं और उनकी भित्ति लिग्निनयुक्त होती है।", "Collenchyma is living; dead lignified cells form sclerenchyma.", "स्थूलकोणोतक जीवित होता है; मृत लिग्निनयुक्त कोशिकाएँ दृढ़ोतक बनाती हैं।"],
    ["Monocot stems have a ring of open vascular bundles.", "एकबीजपत्री तने में खुले संवहन बंडलों का वलय होता है।", "The vascular bundles of monocot stems are scattered and closed.", "एकबीजपत्री तने के संवहन बंडल बिखरे और बंद होते हैं।"],
    ["Dicot roots have more than six xylem bundles.", "द्विबीजपत्री जड़ में छह से अधिक जाइलम बंडल होते हैं।", "Dicot roots have two to four; monocot roots have more than six.", "द्विबीजपत्री जड़ में दो से चार होते हैं; छह से अधिक एकबीजपत्री जड़ में।"],
    ["In cymose inflorescence the main axis grows indefinitely.", "ससीमाक्षी पुष्पक्रम में मुख्य अक्ष अनिश्चित रूप से बढ़ता है।", "The main axis grows on in racemose inflorescence; in cymose it ends in a flower.", "असीमाक्षी पुष्पक्रम में मुख्य अक्ष बढ़ता रहता है; ससीमाक्षी में वह पुष्प में समाप्त होता है।"],
    ["Mustard has axile placentation.", "सरसों में स्तंभीय बीजांडन्यास होता है।", "Mustard has parietal placentation; china rose, tomato and lemon have axile.", "सरसों में भित्तीय बीजांडन्यास होता है; स्तंभीय गुड़हल, टमाटर और नींबू में।"],
    ["Pea has twisted aestivation.", "मटर में व्यावर्तित पुष्पदल विन्यास होता है।", "Pea has vexillary aestivation.", "मटर में ध्वजिक पुष्पदल विन्यास होता है।"],
    ["Guava has a hypogynous flower.", "अमरूद का पुष्प अधोजायांगी होता है।", "Guava has an epigynous flower with an inferior ovary.", "अमरूद का पुष्प अधिजायांगी होता है, अंडाशय अधोवर्ती।"],
    ["In stems the protoxylem is exarch.", "तनों में आदिदारु बाह्यादिदारुक होता है।", "Stems are endarch; roots are exarch.", "तने मध्यादिदारुक होते हैं; जड़ें बाह्यादिदारुक।"],
    ["Isobilateral leaves have distinct palisade and spongy mesophyll.", "समद्विपार्श्विक पत्ती में खंभ और स्पंजी पर्णमध्योतक स्पष्ट होते हैं।", "The mesophyll of isobilateral leaves is not differentiated.", "समद्विपार्श्विक पत्ती का पर्णमध्योतक विभेदित नहीं होता।"],
  ],
  ar: [
    ["Monocot stems generally do not increase in girth by secondary growth.", "एकबीजपत्री तने प्रायः द्वितीयक वृद्धि से मोटे नहीं होते।", "The vascular bundles of monocot stems are closed, without cambium.", "एकबीजपत्री तने के संवहन बंडल बंद होते हैं, इनमें एधा नहीं होती।"],
    ["Grass leaves curl inwards during water stress.", "जल की कमी में घास की पत्तियाँ भीतर की ओर मुड़ जाती हैं।", "Bulliform cells become flaccid when they lose water.", "आवर्ध त्वक् (बुलीफ़ॉर्म) कोशिकाएँ जल खोने पर ढीली (श्लथ) हो जाती हैं।"],
    ["Grasses grow back quickly after being grazed.", "चराई के बाद घासें शीघ्र फिर बढ़ जाती हैं।", "Intercalary meristems regenerate the parts removed by grazing herbivores.", "अंतर्वेशी विभज्योतक चरने वाले शाकाहारियों द्वारा हटाए भागों को पुनः बनाते हैं।"],
    ["Collenchyma gives mechanical support to young stems and petioles.", "स्थूलकोणोतक नए तनों और पर्णवृंतों को यांत्रिक सहारा देता है।", "Collenchyma cells are thickened at the corners with cellulose, hemicellulose and pectin.", "स्थूलकोणोतक की कोशिकाएँ कोनों पर सेल्युलोज़, हेमीसेल्युलोज़ और पेक्टिन से स्थूलित होती हैं।"],
    ["Jute and flax are sources of commercial fibres.", "जूट और पटसन (फ्लैक्स) व्यावसायिक रेशों के स्रोत हैं।", "The phloem fibres of jute and flax are long, tough sclerenchyma cells.", "जूट और पटसन के फ्लोएम रेशे लंबी, मज़बूत दृढ़ोतक कोशिकाएँ हैं।"],
  ],
};

// ---------- Microbes in human welfare (NCERT 12, pogl. 8 – racionalizirano 7) ----------
BANK["microbes-in-human-welfare"] = {
  sets: [
    {
      k: ["microbe", "सूक्ष्मजीव"],
      q: ["What is *%* used for or known for?", "*%* किस उपयोग या किस बात के लिए जाना जाता है?"],
      rq: ["Which microbe is linked with this: %?", "इसका संबंध किस सूक्ष्मजीव से है: %?"],
      items: [
        ["Lactobacillus", "लैक्टोबैसिलस", "turns milk into curd and increases its vitamin B12", "दूध को दही में बदलता है और उसमें विटामिन B12 बढ़ाता है"],
        ["Saccharomyces cerevisiae", "सैकेरोमाइसीज़ सेरेविसी", "is baker's yeast used for bread and for making ethanol", "बेकर यीस्ट है, जो ब्रेड और इथेनॉल बनाने में प्रयुक्त होता है"],
        ["Propionibacterium sharmanii", "प्रोपियोनीबैक्टीरियम शारमैनाई", "releases much CO₂ and gives Swiss cheese its large holes", "अधिक CO₂ छोड़ता है और स्विस चीज़ में बड़े छिद्र बनाता है"],
        ["Aspergillus niger", "ऐस्परजिलस नाइगर", "produces citric acid", "सिट्रिक अम्ल बनाता है"],
        ["Acetobacter aceti", "ऐसीटोबैक्टर ऐसीटाई", "produces acetic acid", "ऐसीटिक अम्ल बनाता है"],
        ["Clostridium butylicum", "क्लोस्ट्रीडियम ब्यूटायलिकम", "produces butyric acid", "ब्यूटिरिक अम्ल बनाता है"],
        ["Streptococcus", "स्ट्रेप्टोकोकस", "is the source of streptokinase, a clot buster", "स्ट्रेप्टोकाइनेज़ का स्रोत है, जो थक्का घोलता है"],
        ["Trichoderma polysporum", "ट्राइकोडर्मा पॉलीस्पोरम", "produces cyclosporin A, used to suppress immunity in organ-transplant patients", "साइक्लोस्पोरिन A बनाता है, जो अंग प्रत्यारोपण के रोगियों में प्रतिरक्षा दबाने में प्रयुक्त होता है"],
        ["Monascus purpureus", "मोनास्कस परप्यूरियस", "produces statins that lower blood cholesterol", "स्टैटिन बनाता है, जो रुधिर में कोलेस्टेरॉल घटाते हैं"],
        ["Penicillium notatum", "पेनिसिलियम नोटेटम", "is the mould in which Alexander Fleming discovered penicillin", "वह फफूँद है जिसमें अलेक्ज़ेंडर फ्लेमिंग ने पेनिसिलिन की खोज की"],
      ],
    },
    {
      k: ["microbe used in farming or energy", "कृषि या ऊर्जा में प्रयुक्त सूक्ष्मजीव"],
      q: ["What is the role of *%*?", "*%* की क्या भूमिका है?"],
      rq: ["Which of these has this role: %?", "इनमें से किसकी यह भूमिका है: %?"],
      items: [
        ["Bacillus thuringiensis", "बैसिलस थुरिंजिएंसिस", "is sprayed to kill butterfly caterpillars", "तितली की इल्लियों को मारने के लिए छिड़का जाता है"],
        ["Trichoderma", "ट्राइकोडर्मा", "is a free-living fungus of root ecosystems that controls plant pathogens", "जड़ों के पारितंत्र में मुक्तजीवी कवक है, जो पादप रोगजनकों का नियंत्रण करता है"],
        ["Nucleopolyhedrovirus", "न्यूक्लियोपॉलीहेड्रोवायरस", "is a species-specific baculovirus used against insects", "कीटों के विरुद्ध प्रयुक्त जाति-विशिष्ट बैक्युलोवायरस है"],
        ["Rhizobium", "राइज़ोबियम", "fixes nitrogen in the root nodules of legumes", "लेग्यूम की जड़ ग्रंथिकाओं में नाइट्रोजन स्थिर करता है"],
        ["Glomus", "ग्लोमस", "is a mycorrhizal fungus that absorbs phosphorus from the soil for the plant", "कवकमूल बनाने वाला कवक है, जो पौधे के लिए मिट्टी से फ़ॉस्फ़ोरस अवशोषित करता है"],
        ["Anabaena", "ऐनाबीना", "is a cyanobacterium that fixes nitrogen in paddy fields", "सायनोबैक्टीरियम है, जो धान के खेतों में नाइट्रोजन स्थिर करता है"],
        ["Methanobacterium", "मीथेनोबैक्टीरियम", "is a methanogen that produces methane in biogas plants", "मीथेनोजन है, जो बायोगैस संयंत्र में मीथेन बनाता है"],
      ],
    },
    {
      k: ["stage or term of sewage treatment", "वाहित मल उपचार का चरण या पद"],
      q: ["Which statement correctly describes %?", "% का सही वर्णन कौन-सा है?"],
      rq: ["Which term is described here: %?", "यहाँ किस पद का वर्णन है: %?"],
      items: [
        ["primary treatment", "प्राथमिक उपचार", "physical removal of particles by filtration and sedimentation", "निस्यंदन और अवसादन द्वारा कणों को भौतिक रूप से हटाना"],
        ["primary sludge", "प्राथमिक आपंक", "the solids that settle during primary treatment", "प्राथमिक उपचार में नीचे बैठने वाले ठोस"],
        ["secondary (biological) treatment", "द्वितीयक (जैविक) उपचार", "aeration of the effluent so that aerobic microbes grow and consume organic matter", "बहिःस्राव में वायु प्रवाहित करना, जिससे वायवीय सूक्ष्मजीव बढ़कर कार्बनिक पदार्थ का उपभोग करें"],
        ["flocs", "ऊर्णक (फ़्लॉक)", "masses of bacteria joined with fungal filaments into mesh-like structures", "जीवाणुओं और कवक तंतुओं से बनी जाली जैसी संहतियाँ"],
        ["activated sludge", "सक्रियित आपंक", "settled flocs, a small part of which is pumped back to the aeration tank as inoculum", "नीचे बैठे ऊर्णक, जिनका छोटा भाग निवेश द्रव्य के रूप में वायवीय टैंक में लौटाया जाता है"],
        ["anaerobic sludge digester", "अवायवीय आपंक संपाचक", "tank where bacteria digest sludge without oxygen and produce biogas", "वह टैंक जहाँ जीवाणु ऑक्सीजन के बिना आपंक का पाचन करके बायोगैस बनाते हैं"],
        ["BOD", "BOD", "oxygen that would be consumed if bacteria oxidised all the organic matter in one litre of water", "वह ऑक्सीजन जो एक लीटर जल के सारे कार्बनिक पदार्थ को जीवाणुओं द्वारा ऑक्सीकृत करने में खर्च होगी"],
      ],
    },
  ],
  tf: [
    ["Lactic acid bacteria in our stomach help to check disease-causing microbes.", "हमारे आमाशय में लैक्टिक अम्ल जीवाणु रोग पैदा करने वाले सूक्ष्मजीवों को नियंत्रित करते हैं।"],
    ["The dough for dosa and idli is fermented by bacteria.", "डोसा और इडली का घोल जीवाणुओं द्वारा किण्वित होता है।"],
    ["Toddy is made by fermenting sap from palms.", "ताड़ी ताड़ के रस के किण्वन से बनती है।"],
    ["Roquefort cheese is ripened by growing a specific fungus on it.", "रॉकफ़ोर्ट चीज़ को उस पर विशेष कवक उगाकर परिपक्व किया जाता है।"],
    ["Wine and beer are made without distillation, whereas whisky, brandy and rum are distilled.", "वाइन और बीयर आसवन के बिना बनती हैं, जबकि व्हिस्की, ब्रांडी और रम का आसवन किया जाता है।"],
    ["Lipases are used in detergents to remove oily stains from laundry.", "कपड़ों से तैलीय धब्बे हटाने के लिए अपमार्जकों में लाइपेज प्रयुक्त होते हैं।"],
    ["Bottled fruit juices are made clearer using pectinases and proteases.", "बोतलबंद फलों के रस को पेक्टिनेज़ और प्रोटिएज़ से स्वच्छ किया जाता है।"],
    ["Ernst Chain and Howard Florey established the full potential of penicillin as an antibiotic.", "अर्न्स्ट चेन और हावर्ड फ़्लोरी ने प्रतिजैविक के रूप में पेनिसिलिन की पूरी क्षमता स्थापित की।"],
    ["The BOD of the effluent falls considerably during secondary treatment.", "द्वितीयक उपचार में बहिःस्राव का BOD काफ़ी घट जाता है।"],
    ["The greater the BOD of a water sample, the more organic matter it contains.", "जल के नमूने का BOD जितना अधिक, उसमें कार्बनिक पदार्थ उतना अधिक होता है।"],
    ["Biogas is mainly methane, along with CO₂ and H₂S.", "बायोगैस मुख्यतः मीथेन है, साथ में CO₂ और H₂S होती हैं।"],
    ["Methanogens live in the rumen of cattle, so cattle dung (gobar) is rich in them.", "मीथेनोजन मवेशियों के रूमेन में रहते हैं, इसलिए गोबर में ये प्रचुर होते हैं।"],
    ["Baculoviruses have narrow-spectrum, species-specific insecticidal action.", "बैक्युलोवायरस की कीटनाशी क्रिया संकीर्ण परिसर वाली और जाति-विशिष्ट होती है।"],
    ["Ladybirds and dragonflies are used to control aphids and mosquitoes.", "माहू (ऐफ़िड) और मच्छरों के नियंत्रण में लेडीबर्ड और ड्रैगनफ़्लाई का उपयोग होता है।"],
    ["Biogas technology in India was developed mainly by IARI and KVIC.", "भारत में बायोगैस तकनीक मुख्यतः IARI और KVIC ने विकसित की।"],
  ],
  ff: [
    ["Primary treatment of sewage uses microbes to reduce the BOD.", "वाहित मल के प्राथमिक उपचार में BOD घटाने के लिए सूक्ष्मजीवों का उपयोग होता है।", "Primary treatment is physical; microbes act in secondary treatment.", "प्राथमिक उपचार भौतिक है; सूक्ष्मजीव द्वितीयक उपचार में कार्य करते हैं।"],
    ["Methanogens are aerobic bacteria.", "मीथेनोजन वायवीय जीवाणु हैं।", "Methanogens grow anaerobically on cellulosic material.", "मीथेनोजन सेल्युलोज़ी पदार्थ पर अवायवीय रूप से बढ़ते हैं।"],
    ["Statins are produced by Aspergillus niger.", "स्टैटिन ऐस्परजिलस नाइगर द्वारा बनते हैं।", "Statins come from Monascus purpureus; Aspergillus niger makes citric acid.", "स्टैटिन मोनास्कस परप्यूरियस से मिलते हैं; ऐस्परजिलस नाइगर सिट्रिक अम्ल बनाता है।"],
    ["Cyclosporin A is used as a clot buster.", "साइक्लोस्पोरिन A थक्का घोलने में प्रयुक्त होता है।", "Cyclosporin A suppresses immunity; streptokinase dissolves clots.", "साइक्लोस्पोरिन A प्रतिरक्षा दबाता है; थक्का स्ट्रेप्टोकाइनेज़ घोलता है।"],
    ["The large holes in Swiss cheese are made by Lactobacillus.", "स्विस चीज़ के बड़े छिद्र लैक्टोबैसिलस बनाता है।", "The holes in Swiss cheese come from CO₂ released by Propionibacterium sharmanii.", "स्विस चीज़ के छिद्र प्रोपियोनीबैक्टीरियम शारमैनाई द्वारा मुक्त CO₂ से बनते हैं।"],
    ["Bt toxin is used to control aphids and mosquitoes.", "माहू और मच्छरों के नियंत्रण में Bt आविष का उपयोग होता है।", "Bt kills butterfly caterpillars; ladybirds and dragonflies control aphids and mosquitoes.", "Bt तितली की इल्लियों को मारता है; माहू और मच्छरों को लेडीबर्ड और ड्रैगनफ़्लाई नियंत्रित करते हैं।"],
    ["Rhizobium fixes nitrogen while living freely in the soil.", "राइज़ोबियम मिट्टी में मुक्त रहकर नाइट्रोजन स्थिर करता है।", "Rhizobium is symbiotic in legume root nodules; Azotobacter and Azospirillum are free-living.", "राइज़ोबियम लेग्यूम की जड़ ग्रंथिकाओं में सहजीवी है; ऐज़ोटोबैक्टर और ऐज़ोस्पाइरिलम मुक्तजीवी हैं।"],
    ["Mycorrhizal fungi such as Glomus mainly fix atmospheric nitrogen.", "ग्लोमस जैसे कवकमूल कवक मुख्यतः वायुमंडलीय नाइट्रोजन स्थिर करते हैं।", "Mycorrhizal fungi such as Glomus absorb phosphorus from the soil and pass it to the plant.", "ग्लोमस जैसे कवकमूल कवक मिट्टी से फ़ॉस्फ़ोरस अवशोषित करके पौधे को देते हैं।"],
    ["The BOD of sewage rises during secondary treatment.", "द्वितीयक उपचार में वाहित मल का BOD बढ़ता है।", "Microbes consume the organic matter, so the BOD falls.", "सूक्ष्मजीव कार्बनिक पदार्थ का उपभोग करते हैं, इसलिए BOD घटता है।"],
    ["Penicillin was discovered by Louis Pasteur.", "पेनिसिलिन की खोज लुई पाश्चर ने की थी।", "Alexander Fleming discovered penicillin.", "पेनिसिलिन की खोज अलेक्ज़ेंडर फ्लेमिंग ने की थी।"],
    ["Bread dough rises because of lactic acid made by bacteria.", "ब्रेड का गुँधा आटा जीवाणुओं के बनाए लैक्टिक अम्ल से फूलता है।", "Bread dough rises because baker's yeast releases CO₂.", "ब्रेड का आटा बेकर यीस्ट द्वारा मुक्त CO₂ से फूलता है।"],
  ],
  ar: [
    ["Part of the activated sludge is pumped back into the aeration tank.", "सक्रियित आपंक का कुछ भाग वायवीय टैंक में वापस भेजा जाता है।", "Activated sludge serves as an inoculum of microbes for the next batch of effluent.", "सक्रियित आपंक बहिःस्राव की अगली खेप के लिए सूक्ष्मजीवों के निवेश द्रव्य का कार्य करता है।"],
    ["Swiss cheese has large holes.", "स्विस चीज़ में बड़े छिद्र होते हैं।", "Propionibacterium sharmanii releases a large amount of CO₂.", "प्रोपियोनीबैक्टीरियम शारमैनाई अधिक मात्रा में CO₂ मुक्त करता है।"],
    ["Cattle dung is used to make biogas.", "बायोगैस बनाने में गोबर का उपयोग होता है।", "Cattle dung is rich in methanogens that come from the rumen of cattle.", "गोबर में मवेशियों के रूमेन से आए मीथेनोजन प्रचुर होते हैं।"],
    ["Curd is more nutritious than milk.", "दही, दूध से अधिक पौष्टिक होता है।", "Lactic acid bacteria increase its vitamin B12 content.", "लैक्टिक अम्ल जीवाणु उसमें विटामिन B12 बढ़ा देते हैं।"],
    ["Baculoviruses are suitable for integrated pest management.", "बैक्युलोवायरस समेकित पीड़क प्रबंधन के लिए उपयुक्त हैं।", "Baculoviruses are species-specific and do not harm non-target organisms.", "बैक्युलोवायरस जाति-विशिष्ट हैं और लक्ष्य से भिन्न जीवों को हानि नहीं पहुँचाते।"],
    ["BOD is used as a measure of organic pollution in water.", "BOD को जल के कार्बनिक प्रदूषण की माप के रूप में प्रयुक्त किया जाता है।", "Bacteria use up oxygen while oxidising organic matter.", "जीवाणु कार्बनिक पदार्थ को ऑक्सीकृत करते समय ऑक्सीजन खर्च करते हैं।"],
  ],
};

// ---------- Animal tissues (NCERT 11, pogl. 7) and behaviour (osnove A-level / Sri Lanka A/L) ----------
BANK["animal-behaviour-and-tissues"] = {
  sets: [
    {
      k: ["epithelium", "उपकला"],
      q: ["Which statement is correct for %?", "% के लिए कौन-सा कथन सही है?"],
      rq: ["Which epithelium is described here: %?", "यहाँ किस उपकला का वर्णन है: %?"],
      items: [
        ["simple squamous epithelium", "सरल शल्की उपकला", "lines blood vessels and the air sacs of the lungs and forms a diffusion boundary", "रुधिर वाहिकाओं और फुफ्फुस के वायु कोषों को आस्तरित करती है तथा विसरण सीमा बनाती है"],
        ["cuboidal epithelium", "घनाकार उपकला", "lines ducts of glands and tubular parts of nephrons; secretion and absorption", "ग्रंथियों की वाहिनियों और वृक्काणु के नलिकाकार भागों में; स्राव और अवशोषण"],
        ["columnar epithelium", "स्तंभाकार उपकला", "lines the stomach and intestine; secretion and absorption", "आमाशय और आँत को आस्तरित करती है; स्राव और अवशोषण"],
        ["ciliated epithelium", "पक्ष्माभी उपकला", "lines bronchioles and fallopian tubes and moves particles or mucus", "श्वसनिकाओं और फैलोपियन नलिकाओं में; कणों या श्लेष्मा को आगे बढ़ाती है"],
        ["compound epithelium", "संयुक्त उपकला", "covers the dry skin and moist buccal cavity; protects against chemical and mechanical stress", "शुष्क त्वचा और नम मुख गुहा को ढकती है; रासायनिक और यांत्रिक प्रतिबल से रक्षा करती है"],
        ["goblet cells", "चषक (गॉब्लेट) कोशिकाएँ", "are unicellular glands of the alimentary canal", "आहार नाल की एककोशिकीय ग्रंथियाँ हैं"],
      ],
    },
    {
      k: ["connective tissue", "संयोजी ऊतक"],
      q: ["Which feature is characteristic of %?", "% का अभिलक्षण कौन-सा है?"],
      rq: ["Which connective tissue shows this feature: %?", "किस संयोजी ऊतक में यह अभिलक्षण है: %?"],
      items: [
        ["areolar tissue", "एरियोलर ऊतक", "lies beneath the skin and contains fibroblasts, macrophages and mast cells", "त्वचा के नीचे होता है और इसमें तंतुकोरक, महाभक्षकाणु और मास्ट कोशिकाएँ होती हैं"],
        ["adipose tissue", "वसा ऊतक", "is specialised to store fats", "वसा संचय के लिए विशिष्ट है"],
        ["tendons", "कंडराएँ", "attach skeletal muscles to bones", "कंकाल पेशियों को अस्थियों से जोड़ती हैं"],
        ["ligaments", "स्नायुबंधन", "attach one bone to another", "एक अस्थि को दूसरी अस्थि से जोड़ते हैं"],
        ["cartilage", "उपास्थि", "has a solid but pliable matrix; found in the tip of the nose and the outer ear", "इसका आधात्री ठोस पर लचीला होता है; नाक के सिरे और बाह्य कर्ण में मिलती है"],
        ["bone", "अस्थि", "has a hard matrix rich in calcium salts and collagen, with osteocytes in lacunae", "इसका कठोर आधात्री कैल्सियम लवणों और कोलैजन से भरपूर होता है, अस्थि कोशिकाएँ गर्तिकाओं में होती हैं"],
        ["blood", "रुधिर", "is a fluid connective tissue of plasma, red and white blood cells and platelets", "प्लाज़्मा, लाल और श्वेत रुधिर कणिकाओं तथा प्लेटलेट्स से बना तरल संयोजी ऊतक है"],
      ],
    },
    {
      k: ["muscle or neural tissue", "पेशी या तंत्रिका ऊतक"],
      q: ["Which feature is characteristic of %?", "% का अभिलक्षण कौन-सा है?"],
      rq: ["Which tissue shows this feature: %?", "किस ऊतक में यह अभिलक्षण है: %?"],
      items: [
        ["skeletal muscle", "कंकाल पेशी", "striated, voluntary and attached to bones (e.g. biceps)", "रेखित, ऐच्छिक और अस्थियों से जुड़ी (जैसे द्विशिर पेशी)"],
        ["smooth muscle", "चिकनी पेशी", "fusiform fibres without striations in the walls of blood vessels, stomach and intestine", "रुधिर वाहिकाओं, आमाशय और आँत की भित्ति में धारीहीन, तर्कुरूपी तंतु"],
        ["cardiac muscle", "हृद पेशी", "branched, striated fibres joined by intercalated discs", "अंतर्विष्ट पट्टिकाओं से जुड़े शाखित, रेखित तंतु"],
        ["neurons", "न्यूरॉन", "excitable cells that carry impulses", "उत्तेजनशील कोशिकाएँ, जो आवेग ले जाती हैं"],
        ["neuroglia", "तंत्रिकाबंध (न्यूरोग्लिया)", "protect and support neurons and make up more than half the volume of neural tissue", "न्यूरॉनों की रक्षा और सहारा देती हैं तथा तंत्रिका ऊतक के आधे से अधिक आयतन बनाती हैं"],
      ],
    },
    {
      k: ["type of behaviour", "व्यवहार का प्रकार"],
      q: ["Which example best shows %?", "कौन-सा उदाहरण % को सबसे अच्छी तरह दर्शाता है?"],
      rq: ["Which type of behaviour is shown here: %?", "यहाँ किस प्रकार का व्यवहार दिखता है: %?"],
      items: [
        ["a reflex", "प्रतिवर्त", "the knee-jerk response when the tendon below the kneecap is tapped", "घुटने की टोपी के नीचे कंडरा पर थपकी देने पर पैर का झटके से उठना"],
        ["imprinting", "छापांकन (इम्प्रिंटिंग)", "newly hatched goslings following the first moving object they see", "अंडे से निकले हंस के बच्चों का पहली दिखी चलती वस्तु के पीछे चलना"],
        ["habituation", "अभ्यस्तीकरण (हैबिचुएशन)", "a snail no longer withdrawing into its shell after being touched gently many times", "बार-बार हल्का छूने पर घोंघे का खोल में सिमटना बंद कर देना"],
        ["classical conditioning", "प्राचीन अनुबंधन", "a dog salivating at the sound of a bell that was earlier rung with food", "पहले भोजन के साथ बजाई गई घंटी सुनकर कुत्ते के मुँह में लार आना"],
        ["operant conditioning", "क्रिया-प्रसूत अनुबंधन", "a rat learning to press a lever because it is rewarded with food", "भोजन का पुरस्कार मिलने से चूहे का लीवर दबाना सीखना"],
        ["insight learning", "अंतर्दृष्टि अधिगम", "a chimpanzee stacking boxes to reach bananas hung out of reach", "पहुँच से बाहर टँगे केले पाने के लिए चिंपैंज़ी का डिब्बे एक के ऊपर एक रखना"],
        ["kinesis", "गतिक्रम (काइनेसिस)", "woodlice moving faster and at random in dry places until they reach damp ones", "सूखे स्थान पर वुडलाइस का तेज़ और यादृच्छिक चलना, जब तक वे नम स्थान पर न पहुँचें"],
      ],
    },
  ],
  tf: [
    ["Imprinting, habituation and conditioning are forms of learned behaviour.", "छापांकन, अभ्यस्तीकरण और अनुबंधन अधिगत (सीखे हुए) व्यवहार के रूप हैं।"],
    ["Innate behaviour is inherited and does not have to be learned.", "जन्मजात व्यवहार वंशागत होता है और उसे सीखना नहीं पड़ता।"],
    ["Imprinting takes place only during a short sensitive period early in life.", "छापांकन केवल जीवन के आरंभ में एक छोटी संवेदनशील अवधि में होता है।"],
    ["Intercalated discs let cardiac muscle cells contract as a unit.", "अंतर्विष्ट पट्टिकाएँ हृद पेशी कोशिकाओं को एक इकाई के रूप में संकुचित होने देती हैं।"],
    ["Neuroglia make up more than one-half of the volume of neural tissue.", "तंत्रिका ऊतक के आधे से अधिक आयतन में तंत्रिकाबंध (न्यूरोग्लिया) होती हैं।"],
    ["Bone marrow in some bones is the site of production of blood cells.", "कुछ अस्थियों की अस्थि मज्जा में रुधिर कोशिकाएँ बनती हैं।"],
    ["Exocrine glands release their secretions through ducts, while endocrine glands have no ducts.", "बहिःस्रावी ग्रंथियाँ स्राव वाहिनियों द्वारा छोड़ती हैं, जबकि अंतःस्रावी ग्रंथियों में वाहिनी नहीं होती।"],
    ["Gap junctions connect the cytoplasm of adjoining cells for rapid transfer of ions and small molecules.", "अंतराल संधियाँ आसन्न कोशिकाओं के कोशिकाद्रव्य को जोड़ती हैं, जिससे आयनों और छोटे अणुओं का तीव्र स्थानांतरण होता है।"],
    ["In all connective tissues except blood, the cells secrete fibres of collagen or elastin.", "रुधिर को छोड़कर सभी संयोजी ऊतकों में कोशिकाएँ कोलैजन या इलास्टिन के तंतु स्रावित करती हैं।"],
    ["Tight junctions stop substances from leaking across a tissue.", "दृढ़ संधियाँ पदार्थों को ऊतक के आर-पार रिसने से रोकती हैं।"],
    ["Cartilage is present between adjacent bones of the vertebral column.", "कशेरुक दंड की आसन्न अस्थियों के बीच उपास्थि होती है।"],
  ],
  ff: [
    ["Simple squamous epithelium lines the stomach.", "सरल शल्की उपकला आमाशय को आस्तरित करती है।", "The stomach is lined by columnar epithelium.", "आमाशय स्तंभाकार उपकला से आस्तरित होता है।"],
    ["Ligaments attach muscles to bones.", "स्नायुबंधन पेशियों को अस्थियों से जोड़ते हैं।", "Tendons attach muscles to bones; ligaments join bone to bone.", "कंडराएँ पेशियों को अस्थियों से जोड़ती हैं; स्नायुबंधन अस्थि को अस्थि से।"],
    ["Smooth muscle fibres are striated and voluntary.", "चिकनी पेशी के तंतु रेखित और ऐच्छिक होते हैं।", "Smooth muscle has no striations and is involuntary.", "चिकनी पेशी धारीहीन और अनैच्छिक होती है।"],
    ["Blood is a type of epithelial tissue.", "रुधिर एक प्रकार का उपकला ऊतक है।", "Blood is a fluid connective tissue.", "रुधिर एक तरल संयोजी ऊतक है।"],
    ["Habituation is an increase in response to a repeated harmless stimulus.", "अभ्यस्तीकरण बार-बार के हानिरहित उद्दीपन के प्रति अनुक्रिया का बढ़ना है।", "Habituation is a decrease in response to a repeated harmless stimulus.", "अभ्यस्तीकरण में बार-बार के हानिरहित उद्दीपन की अनुक्रिया घटती है।"],
    ["Imprinting can happen at any age.", "छापांकन किसी भी आयु में हो सकता है।", "Imprinting happens only in a short sensitive period early in life.", "छापांकन जीवन के आरंभ में केवल एक छोटी संवेदनशील अवधि में होता है।"],
    ["In classical conditioning, an animal learns by trial and error with rewards.", "प्राचीन अनुबंधन में जंतु पुरस्कार के साथ प्रयास और त्रुटि से सीखता है।", "Learning by trial and error with rewards is operant conditioning; classical conditioning links two stimuli, as in Pavlov's dogs.", "पुरस्कार के साथ प्रयास और त्रुटि से सीखना क्रिया-प्रसूत अनुबंधन है; प्राचीन अनुबंधन दो उद्दीपनों को जोड़ता है, जैसे पावलोव के कुत्तों में।"],
    ["Cardiac muscle is voluntary.", "हृद पेशी ऐच्छिक होती है।", "Cardiac muscle is involuntary.", "हृद पेशी अनैच्छिक होती है।"],
    ["Neurons make up more than half the volume of neural tissue.", "तंत्रिका ऊतक के आधे से अधिक आयतन में न्यूरॉन होते हैं।", "Neuroglia, not neurons, make up more than half the volume of neural tissue.", "तंत्रिका ऊतक के आधे से अधिक आयतन में न्यूरॉन नहीं, तंत्रिकाबंध (न्यूरोग्लिया) होती हैं।"],
    ["Compound epithelium is mainly concerned with diffusion.", "संयुक्त उपकला का मुख्य कार्य विसरण है।", "Compound epithelium mainly gives protection; simple squamous epithelium forms diffusion boundaries.", "संयुक्त उपकला का मुख्य कार्य रक्षा है; विसरण सीमा सरल शल्की उपकला बनाती है।"],
    ["Goblet cells are multicellular glands.", "चषक कोशिकाएँ बहुकोशिकीय ग्रंथियाँ हैं।", "Goblet cells are unicellular; salivary glands are multicellular.", "चषक कोशिकाएँ एककोशिकीय हैं; लार ग्रंथियाँ बहुकोशिकीय हैं।"],
  ],
  ar: [
    ["Ciliated epithelium lines the bronchioles.", "पक्ष्माभी उपकला श्वसनिकाओं को आस्तरित करती है।", "Cilia move mucus and trapped particles in a specific direction.", "पक्ष्माभ श्लेष्मा और फँसे कणों को एक निश्चित दिशा में आगे बढ़ाते हैं।"],
    ["The heart muscle contracts as a single unit.", "हृद पेशी एक इकाई के रूप में संकुचित होती है।", "Intercalated discs join cardiac cells so that they contract together.", "अंतर्विष्ट पट्टिकाएँ हृद कोशिकाओं को जोड़ती हैं, जिससे वे एक साथ संकुचित होती हैं।"],
    ["A bird living near a busy road stops reacting to traffic noise.", "व्यस्त सड़क के पास रहने वाला पक्षी यातायात के शोर पर प्रतिक्रिया देना बंद कर देता है।", "Habituation reduces the response to a repeated stimulus that brings neither reward nor harm.", "अभ्यस्तीकरण उस बार-बार के उद्दीपन की अनुक्रिया घटा देता है, जिससे न लाभ होता है न हानि।"],
    ["Pavlov's dogs salivated at the sound of a bell alone.", "पावलोव के कुत्तों के मुँह में केवल घंटी की आवाज़ से लार आने लगी।", "The bell had been paired with food many times (classical conditioning).", "घंटी को अनेक बार भोजन के साथ जोड़ा गया था (प्राचीन अनुबंधन)।"],
    ["Simple squamous epithelium lines the air sacs of the lungs.", "सरल शल्की उपकला फुफ्फुस के वायु कोषों को आस्तरित करती है।", "A single layer of flat cells forms a good diffusion boundary.", "चपटी कोशिकाओं की एक परत अच्छी विसरण सीमा बनाती है।"],
    ["The tip of the nose can be bent.", "नाक के सिरे को मोड़ा जा सकता है।", "Cartilage has a solid but pliable matrix.", "उपास्थि का आधात्री ठोस पर लचीला होता है।"],
  ],
};

// =============================================================================================
// Računski generatorji in štetje (številski odgovori)
// =============================================================================================
const rd = (x, d = 6) => Number(Number(x).toFixed(d));
const EUN = "\\ \\mathrm{kJ}";

// Štetje članov kategorije; hindijske opombe so samostalniške zveze (»यह … है«), da se izognemo spolu glagolov.
// cat = { q: [en, hi], yes: [[en, hi, povedekEn, opisHi]], no: [...] }
function countCat(r, L, cat, n) {
  const k = r.int(Math.max(1, n - cat.no.length), Math.min(cat.yes.length, n - 1));
  const ys = r.shuffle(cat.yes).slice(0, k);
  const ns = r.shuffle(cat.no).slice(0, n - k);
  const list = r.shuffle([...ys.map((x) => ({ x, ok: true })), ...ns.map((x) => ({ x, ok: false }))]);
  const fn = list.find((o) => !o.ok).x;
  const fy = list.find((o) => o.ok).x;
  const long = list.some((o) => o.x[0].length > 22);
  const names = (l) => (long ? list.map((o) => `– ${o.x[l]}`).join("\n") : list.map((o) => o.x[l]).join(", "));
  return task({
    text: L(`${cat.q[0]}\n\n${names(0)}`, `${cat.q[1]}\n\n${names(1)}`),
    answer: numM(k, 0, [
      [k + 1, L(`Not counted: ${fn[0]} ${fn[2]}.`, `${fn[1]} इसमें शामिल नहीं है; यह ${fn[3]} है।`)],
      [k - 1, L(`Also counted: ${fy[0]} ${fy[2]}.`, `${fy[1]} भी इसमें शामिल है; यह ${fy[3]} है।`)],
    ]),
    hint: L("Decide for each item separately before counting.", "गिनने से पहले प्रत्येक पद के बारे में अलग से निर्णय कीजिए।"),
    solution: L(
      S(...list.map((o) => `${o.ok ? "✓" : "✗"} ${cap(o.x[0])} ${o.x[2]}.`), `Answer: ${k}`),
      S(...list.map((o) => `${o.ok ? "✓" : "✗"} ${o.x[1]}: ${o.x[3]}`), `उत्तर: ${k}`),
    ),
  });
}
const yn = (arr, en, hi) => arr.map((o) => [o[0], o[1], o[2] || en, o[3] || hi]);

// ---------- Life processes: računi ----------
const PH_EQ = "6\\mathrm{CO_2} + 12\\mathrm{H_2O} \\rightarrow \\mathrm{C_6H_{12}O_6} + 6\\mathrm{O_2} + 6\\mathrm{H_2O}";
const LIFE_CALC = {
  id: "exg-bio-life-processes-calc",
  topics: [T("life-processes")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 3);
    const nm = NAMES[r.int(0, 7)];
    if (level === 1) {
      if (v === 0) {
        const br = r.int(0, 1);
        const s = r.pick(br ? [15, 20, 30] : [10, 15, 20, 30]);
        const f = 60 / s;
        const c = br ? r.int(Math.ceil(12 / f), Math.floor(20 / f)) : r.int(Math.ceil(60 / f), Math.floor(90 / f));
        const ans = c * f;
        const sym = br ? "f_{\\text{breath}}" : "f_{\\text{pulse}}";
        return task({
          text: br
            ? L(`Sitting quietly, ${nm[0]} breathes in ${c} times in ${s} seconds. What is the breathing rate per minute?`, `शांत बैठे हुए ${nm[1]} ने ${s} सेकंड में ${c} बार साँस ली। प्रति मिनट श्वास दर कितनी है?`)
            : L(`Sitting quietly, ${nm[0]} counts ${c} pulse beats at the wrist in ${s} seconds. What is the pulse rate per minute?`, `शांत बैठे हुए ${nm[1]} ने कलाई पर ${s} सेकंड में ${c} नाड़ी स्पंदन गिने। प्रति मिनट नाड़ी दर कितनी है?`),
          answer: numM(ans, 0, [
            [c, L(`That is the count for ${s} s only; scale it up to 60 s.`, `यह केवल ${s} सेकंड की गिनती है; इसे 60 सेकंड के लिए बढ़ाइए।`)],
            [c * 60, L(`Multiply by 60 ÷ ${s}, not by 60.`, `60 से नहीं, 60 ÷ ${s} से गुणा कीजिए।`)],
            [rd((c * s) / 60, 2), L("Divide 60 s by the counting time, not the other way round.", "60 सेकंड को गिनती के समय से भाग दीजिए, उल्टा नहीं।")],
          ]),
          data: { given: [`n = ${c}`, `t = ${s}\\ \\mathrm{s}`], find: [sym] },
          hint: L(`How many periods of ${s} s fit into one minute?`, `एक मिनट में ${s} सेकंड की कितनी अवधियाँ होती हैं?`),
          formula: `${sym} = n \\cdot \\dfrac{60\\ \\mathrm{s}}{t}`,
          solution: L(
            S(`One minute contains $60 \\div ${s} = ${f}$ periods of ${s} s.`, `$${sym} = ${c} \\cdot ${f} = ${ans}$ per minute`),
            S(`एक मिनट में ${s} सेकंड की $60 \\div ${s} = ${f}$ अवधियाँ हैं।`, `$${sym} = ${c} \\cdot ${f} = ${ans}$ प्रति मिनट`),
          ),
        });
      }
      if (v === 1) {
        const n = r.int(2, 15);
        const o2 = r.int(0, 1);
        const ans = 6 * n;
        const sym = o2 ? "N_{\\mathrm{O_2}}" : "N_{\\mathrm{CO_2}}";
        return task({
          text: L(
            `The equation of photosynthesis is $${PH_EQ}$. How many molecules of ${o2 ? "oxygen are released" : "carbon dioxide are used"} when a leaf makes ${n} molecules of glucose?`,
            `प्रकाश-संश्लेषण का समीकरण $${PH_EQ}$ है। जब एक पत्ती ग्लूकोज़ के ${n} अणु बनाती है, तब ${o2 ? "ऑक्सीजन के कितने अणु मुक्त होते हैं" : "कार्बन डाइऑक्साइड के कितने अणु उपयोग होते हैं"}?`,
          ),
          answer: numM(ans, 0, [
            [n, L("Each glucose molecule needs six of these molecules, not one.", "प्रत्येक ग्लूकोज़ अणु के लिए ऐसे छह अणु चाहिए, एक नहीं।")],
            [12 * n, L("The coefficient 12 belongs to water, not to this gas.", "गुणांक 12 जल का है, इस गैस का नहीं।")],
            [6, L(`That is for one glucose molecule; there are ${n}.`, `यह एक ग्लूकोज़ अणु के लिए है; अणु ${n} हैं।`)],
          ]),
          data: { given: [`N_{\\mathrm{glucose}} = ${n}`], find: [sym] },
          hint: L("Read the coefficients: how many of this gas go with one glucose molecule?", "गुणांक पढ़िए: एक ग्लूकोज़ अणु के साथ इस गैस के कितने अणु जुड़े हैं?"),
          formula: `${sym} = 6\\,N_{\\mathrm{glucose}}`,
          solution: L(
            S(`From the equation: 1 glucose ↔ 6 ${o2 ? "O₂" : "CO₂"}.`, `$${sym} = 6 \\cdot ${n} = ${ans}$`),
            S(`समीकरण से: 1 ग्लूकोज़ ↔ 6 ${o2 ? "O₂" : "CO₂"}।`, `$${sym} = 6 \\cdot ${n} = ${ans}$`),
          ),
        });
      }
      if (v === 2) {
        const n = r.int(3, 40);
        const ans = 2 * n;
        return task({
          text: L(
            `In the cytoplasm, each glucose molecule (6 carbon atoms) is broken down into pyruvate molecules with 3 carbon atoms each. How many pyruvate molecules are formed from ${n} glucose molecules?`,
            `कोशिकाद्रव्य में प्रत्येक ग्लूकोज़ अणु (6 कार्बन परमाणु) 3 कार्बन परमाणु वाले पाइरुवेट अणुओं में टूटता है। ग्लूकोज़ के ${n} अणुओं से पाइरुवेट के कितने अणु बनेंगे?`,
          ),
          answer: numM(ans, 0, [
            [n, L("One six-carbon glucose gives two three-carbon pyruvates.", "छह कार्बन वाले एक ग्लूकोज़ से तीन कार्बन वाले दो पाइरुवेट बनते हैं।")],
            [6 * n, L("That is the number of carbon atoms, not of pyruvate molecules.", "यह कार्बन परमाणुओं की संख्या है, पाइरुवेट अणुओं की नहीं।")],
            [3 * n, L("Divide the 6 carbon atoms of glucose by the 3 carbon atoms of pyruvate.", "ग्लूकोज़ के 6 कार्बन परमाणुओं को पाइरुवेट के 3 कार्बन परमाणुओं से भाग दीजिए।")],
          ]),
          data: { given: [`N_{\\mathrm{glucose}} = ${n}`], find: ["N_{\\text{pyruvate}}"] },
          hint: L("Carbon atoms are not lost in this step: compare 6 with 3.", "इस चरण में कार्बन परमाणु नष्ट नहीं होते: 6 की तुलना 3 से कीजिए।"),
          formula: "N_{\\text{pyruvate}} = \\dfrac{6}{3}\\,N_{\\mathrm{glucose}}",
          solution: L(
            S("Pyruvates per glucose: $6 \\div 3 = 2$", `$N = 2 \\cdot ${n} = ${ans}$ pyruvate molecules`),
            S("प्रति ग्लूकोज़ पाइरुवेट: $6 \\div 3 = 2$", `$N = 2 \\cdot ${n} = ${ans}$ पाइरुवेट अणु`),
          ),
        });
      }
      const rate = r.int(4, 25);
      const t = r.int(2, 8);
      const W = rate * t;
      return task({
        text: L(
          `A potted plant, with its soil covered by a plastic sheet, loses ${W} g of mass in ${t} hours. Taking all of this as water lost in transpiration, find the rate of transpiration in g per hour.`,
          `प्लास्टिक की चादर से ढकी मिट्टी वाला गमले का एक पौधा ${t} घंटों में ${W} g द्रव्यमान खो देता है। यह सारा द्रव्यमान वाष्पोत्सर्जन में खोया जल मानकर वाष्पोत्सर्जन की दर g प्रति घंटा में ज्ञात कीजिए।`,
        ),
        answer: numM(rate, 0, [
          [W * t, L("Divide the loss by the time; do not multiply.", "हानि को समय से भाग दीजिए; गुणा नहीं।")],
          [W, L("That is the total loss; find the loss in one hour.", "यह कुल हानि है; एक घंटे की हानि ज्ञात कीजिए।")],
        ]),
        data: { given: [`\\Delta m = ${W}\\ \\mathrm{g}`, `t = ${t}\\ \\mathrm{h}`], find: ["v"] },
        hint: L("Rate = loss of water ÷ time taken.", "दर = जल की हानि ÷ लगा समय।"),
        formula: "v = \\dfrac{\\Delta m}{t}",
        solution: L(S("The plastic sheet stops evaporation from the soil, so the loss is transpiration.", `$v = ${W} \\div ${t} = ${rate}\\ \\mathrm{g/h}$`), S("प्लास्टिक की चादर मिट्टी से वाष्पन रोकती है, अतः हानि वाष्पोत्सर्जन से है।", `$v = ${W} \\div ${t} = ${rate}\\ \\mathrm{g/h}$`)),
      });
    }
    if (level === 2) {
      if (v === 0) {
        const s = r.pick([10, 15, 20, 30]);
        const f = 60 / s;
        const c = r.int(Math.ceil(60 / f), Math.floor(90 / f));
        const M = r.pick([5, 10, 15, 30, 60]);
        const bpm = c * f;
        const ans = bpm * M;
        return task({
          text: L(
            `${nm[0]} counts ${c} pulse beats in ${s} seconds. Each pulse beat is one heartbeat. At this rate, how many times does the heart beat in ${M} minutes?`,
            `${nm[1]} ने ${s} सेकंड में ${c} नाड़ी स्पंदन गिने। प्रत्येक नाड़ी स्पंदन हृदय की एक धड़कन है। इसी दर से ${M} मिनट में हृदय कितनी बार धड़केगा?`,
          ),
          answer: numM(ans, 0, [
            [c * M, L(`First turn the count for ${s} s into a count per minute.`, `पहले ${s} सेकंड की गिनती को प्रति मिनट गिनती में बदलिए।`)],
            [bpm, L(`That is the rate per minute; multiply by ${M}.`, `यह प्रति मिनट दर है; ${M} से गुणा कीजिए।`)],
            [c * 60 * M, L(`Multiply the count by 60 ÷ ${s}, not by 60.`, `गिनती को 60 से नहीं, 60 ÷ ${s} से गुणा कीजिए।`)],
          ]),
          data: { given: [`n = ${c}`, `t = ${s}\\ \\mathrm{s}`, `T = ${M}\\ \\mathrm{min}`], find: ["N"] },
          hint: L("Find the beats per minute first, then scale up to the whole time.", "पहले प्रति मिनट धड़कनें ज्ञात कीजिए, फिर पूरे समय के लिए बढ़ाइए।"),
          formula: "N = n \\cdot \\dfrac{60\\ \\mathrm{s}}{t} \\cdot T",
          solution: L(
            S(`Rate: $${c} \\cdot (60 \\div ${s}) = ${bpm}$ beats per minute`, `$N = ${bpm} \\cdot ${M} = ${ans}$ beats`),
            S(`दर: $${c} \\cdot (60 \\div ${s}) = ${bpm}$ धड़कन प्रति मिनट`, `$N = ${bpm} \\cdot ${M} = ${ans}$ धड़कन`),
          ),
        });
      }
      if (v === 1) {
        const F = r.pick([170, 175, 180, 185]);
        const U = r.int(10, 20) / 10;
        const ans = ((F - U) / F) * 100;
        return task({
          text: L(
            `The kidneys of an adult form about ${F} L of initial filtrate a day, but only ${en(U)} L of urine is passed out. What percentage of the filtrate is reabsorbed?${roundToL(2, lang)}`,
            `एक वयस्क के वृक्क प्रतिदिन लगभग ${F} L प्रारंभिक निस्यंद बनाते हैं, परंतु मूत्र केवल ${en(U)} L निकलता है। निस्यंद का कितना प्रतिशत पुनरवशोषित होता है?${roundToL(2, lang)}`,
          ),
          answer: numM(ans, 2, [
            [(U / F) * 100, L("That is the percentage passed out as urine.", "यह मूत्र के रूप में निकला प्रतिशत है।")],
            [F - U, L("That is the volume reabsorbed in litres; express it as a percentage of the filtrate.", "यह पुनरवशोषित आयतन (लीटर में) है; इसे निस्यंद के प्रतिशत में बदलिए।")],
            [((F - U) / U) * 100, L("Divide by the filtrate volume, not by the urine volume.", "मूत्र के आयतन से नहीं, निस्यंद के आयतन से भाग दीजिए।")],
          ]),
          data: { given: [`V_f = ${F}\\ \\mathrm{L}`, `V_u = ${en(U)}\\ \\mathrm{L}`], find: ["p"] },
          hint: L("Reabsorbed volume = filtrate − urine; then compare it with the filtrate.", "पुनरवशोषित आयतन = निस्यंद − मूत्र; फिर इसकी तुलना निस्यंद से कीजिए।"),
          formula: "p = \\dfrac{V_f - V_u}{V_f} \\cdot 100\\,\\%",
          solution: L(
            S(`Reabsorbed: $${F} - ${en(U)} = ${en(rd(F - U))}\\ \\mathrm{L}$`, `$p = \\dfrac{${en(rd(F - U))}}{${F}} \\cdot 100\\,\\% = ${en(ans, 2)}\\,\\%$`),
            S(`पुनरवशोषित: $${F} - ${en(U)} = ${en(rd(F - U))}\\ \\mathrm{L}$`, `$p = \\dfrac{${en(rd(F - U))}}{${F}} \\cdot 100\\,\\% = ${en(ans, 2)}\\,\\%$`),
          ),
        });
      }
      if (v === 2) {
        const k = r.int(2, 20);
        const m = 6 * k;
        const w = r.int(0, 1);
        const ans = w ? 12 * k : k;
        return task({
          text: L(
            `Photosynthesis: $${PH_EQ}$. A leaf uses ${m} molecules of carbon dioxide. How many ${w ? "molecules of water does it take in" : "molecules of glucose does it make"}?`,
            `प्रकाश-संश्लेषण: $${PH_EQ}$। एक पत्ती कार्बन डाइऑक्साइड के ${m} अणु उपयोग करती है। वह ${w ? "जल के कितने अणु लेती है" : "ग्लूकोज़ के कितने अणु बनाती है"}?`,
          ),
          answer: numM(ans, 0, w
            ? [[m, L("12 water molecules go with every 6 CO₂ molecules.", "प्रत्येक 6 CO₂ अणुओं के साथ जल के 12 अणु लगते हैं।")], [k, L("That is the number of glucose molecules.", "यह ग्लूकोज़ अणुओं की संख्या है।")], [12 * m, L("First find how many groups of 6 CO₂ there are.", "पहले ज्ञात कीजिए कि 6 CO₂ के कितने समूह हैं।")]]
            : [[m, L("Six CO₂ molecules are needed for one glucose molecule.", "एक ग्लूकोज़ अणु के लिए छह CO₂ अणु चाहिए।")], [6 * m, L("Divide by 6, do not multiply.", "6 से भाग दीजिए, गुणा नहीं।")], [2 * k, L("Use the coefficient of CO₂ (6), not that of water.", "CO₂ का गुणांक (6) लीजिए, जल का नहीं।")]]),
          data: { given: [`N_{\\mathrm{CO_2}} = ${m}`], find: [w ? "N_{\\mathrm{H_2O}}" : "N_{\\mathrm{glucose}}"] },
          hint: L("Find how many 'equation units' (groups of 6 CO₂) are used, then read the other coefficient.", "ज्ञात कीजिए कि समीकरण की कितनी इकाइयाँ (6 CO₂ के समूह) प्रयुक्त हुईं, फिर दूसरा गुणांक पढ़िए।"),
          formula: w ? "N_{\\mathrm{H_2O}} = \\dfrac{12}{6}\\,N_{\\mathrm{CO_2}}" : "N_{\\mathrm{glucose}} = \\dfrac{N_{\\mathrm{CO_2}}}{6}",
          solution: L(
            S(`Groups of 6 CO₂: $${m} \\div 6 = ${k}$`, w ? `Water taken in: $12 \\cdot ${k} = ${ans}$ molecules` : `Glucose: $${k}$ molecules`),
            S(`6 CO₂ के समूह: $${m} \\div 6 = ${k}$`, w ? `लिया गया जल: $12 \\cdot ${k} = ${ans}$ अणु` : `ग्लूकोज़: $${k}$ अणु`),
          ),
        });
      }
      const M1 = r.int(450, 950);
      const rate = r.int(5, 20);
      const t = r.int(2, 6);
      const M2 = M1 - rate * t;
      return task({
        text: L(
          `${nm[0]} covers the soil of a potted plant with plastic and weighs it: ${M1} g. After ${t} hours in sunlight it weighs ${M2} g. Assuming the loss is due to transpiration, find the rate of transpiration in g per hour.`,
          `${nm[1]} ने गमले के पौधे की मिट्टी को प्लास्टिक से ढककर तौला: ${M1} g। धूप में ${t} घंटे बाद उसका द्रव्यमान ${M2} g था। यह मानकर कि हानि वाष्पोत्सर्जन से हुई, वाष्पोत्सर्जन की दर g प्रति घंटा में ज्ञात कीजिए।`,
        ),
        answer: numM(rate, 1, [
          [M1 - M2, L("That is the total loss; divide it by the time.", "यह कुल हानि है; इसे समय से भाग दीजिए।")],
          [rd(M2 / t, 1), L("Use the loss of mass, not the final mass.", "अंतिम द्रव्यमान नहीं, द्रव्यमान की हानि लीजिए।")],
          [rd(M1 / t, 1), L("Use the loss of mass, not the starting mass.", "प्रारंभिक द्रव्यमान नहीं, द्रव्यमान की हानि लीजिए।")],
        ]),
        data: { given: [`m_1 = ${M1}\\ \\mathrm{g}`, `m_2 = ${M2}\\ \\mathrm{g}`, `t = ${t}\\ \\mathrm{h}`], find: ["v"] },
        hint: L("First find how much mass the plant lost.", "पहले ज्ञात कीजिए कि पौधे ने कितना द्रव्यमान खोया।"),
        formula: "v = \\dfrac{m_1 - m_2}{t}",
        solution: L(
          S(`Loss: $${M1} - ${M2} = ${M1 - M2}\\ \\mathrm{g}$`, `$v = ${M1 - M2} \\div ${t} = ${rate}\\ \\mathrm{g/h}$`),
          S(`हानि: $${M1} - ${M2} = ${M1 - M2}\\ \\mathrm{g}$`, `$v = ${M1 - M2} \\div ${t} = ${rate}\\ \\mathrm{g/h}$`),
        ),
      });
    }
    // Raven 3
    if (v === 0) {
      const n = r.int(3, 30);
      const diff = r.int(0, 1);
      const ans = diff ? 4 * n : 2 * n;
      return task({
        text: L(
          `Yeast breaks each glucose molecule into two pyruvate molecules. Without oxygen, each pyruvate gives one ethanol and one CO₂ molecule; with oxygen, all 6 carbon atoms of glucose leave as CO₂. ${diff ? `How many more CO₂ molecules are released from ${n} glucose molecules with oxygen than without it?` : `How many CO₂ molecules are released from ${n} glucose molecules without oxygen?`}`,
          `यीस्ट प्रत्येक ग्लूकोज़ अणु को दो पाइरुवेट अणुओं में तोड़ता है। ऑक्सीजन के बिना प्रत्येक पाइरुवेट से एक इथेनॉल और एक CO₂ अणु बनता है; ऑक्सीजन होने पर ग्लूकोज़ के सभी 6 कार्बन परमाणु CO₂ के रूप में निकलते हैं। ${diff ? `ग्लूकोज़ के ${n} अणुओं से ऑक्सीजन होने पर, ऑक्सीजन न होने की तुलना में CO₂ के कितने अधिक अणु निकलेंगे?` : `ऑक्सीजन के बिना ग्लूकोज़ के ${n} अणुओं से CO₂ के कितने अणु निकलेंगे?`}`,
        ),
        answer: numM(ans, 0, diff
          ? [[6 * n, L("Subtract the CO₂ released without oxygen.", "ऑक्सीजन के बिना निकली CO₂ घटाइए।")], [2 * n, L("That is the CO₂ without oxygen; find the difference.", "यह ऑक्सीजन के बिना की CO₂ है; अंतर ज्ञात कीजिए।")], [5 * n, L("Without oxygen each glucose gives 2 CO₂ (one per pyruvate), not 1.", "ऑक्सीजन के बिना प्रत्येक ग्लूकोज़ से 2 CO₂ (प्रति पाइरुवेट एक) बनती हैं, 1 नहीं।")]]
          : [[n, L("Each glucose gives two pyruvates, and each pyruvate gives one CO₂.", "प्रत्येक ग्लूकोज़ से दो पाइरुवेट और प्रत्येक पाइरुवेट से एक CO₂ बनती है।")], [6 * n, L("That is with oxygen (aerobic respiration).", "यह ऑक्सीजन होने पर (वायवीय श्वसन) है।")], [3 * n, L("Count CO₂ molecules, not carbon atoms of pyruvate.", "पाइरुवेट के कार्बन परमाणु नहीं, CO₂ अणु गिनिए।")]]),
        data: { given: [`N_{\\mathrm{glucose}} = ${n}`], find: [diff ? "\\Delta N_{\\mathrm{CO_2}}" : "N_{\\mathrm{CO_2}}"] },
        hint: L("Per glucose: without oxygen 2 × 1 CO₂; with oxygen 6 CO₂.", "प्रति ग्लूकोज़: ऑक्सीजन के बिना 2 × 1 CO₂; ऑक्सीजन के साथ 6 CO₂।"),
        formula: diff ? "\\Delta N = (6 - 2)\\,N_{\\mathrm{glucose}}" : "N_{\\mathrm{CO_2}} = 2\\,N_{\\mathrm{glucose}}",
        solution: L(
          S(`Without oxygen: $2 \\cdot ${n} = ${2 * n}$ CO₂`, diff ? `With oxygen: $6 \\cdot ${n} = ${6 * n}$ CO₂` : null, diff ? `$\\Delta N = ${6 * n} - ${2 * n} = ${ans}$` : `Answer: ${ans} molecules`),
          S(`ऑक्सीजन के बिना: $2 \\cdot ${n} = ${2 * n}$ CO₂`, diff ? `ऑक्सीजन के साथ: $6 \\cdot ${n} = ${6 * n}$ CO₂` : null, diff ? `$\\Delta N = ${6 * n} - ${2 * n} = ${ans}$` : `उत्तर: ${ans} अणु`),
        ),
      });
    }
    if (v === 1) {
      const U = r.pick([1.2, 1.4, 1.5, 1.6, 1.8]);
      const p = r.pick([99, 99.2]);
      const ans = U / (1 - p / 100);
      return task({
        text: L(
          `A person passes ${en(U)} L of urine in a day. If the nephrons reabsorb ${en(p)} % of the initial filtrate, how many litres of filtrate do the kidneys form in a day?${roundToL(1, lang)}`,
          `एक व्यक्ति दिन में ${en(U)} L मूत्र त्यागता है। यदि वृक्काणु प्रारंभिक निस्यंद का ${en(p)} % पुनरवशोषित करते हैं, तो वृक्क प्रतिदिन कितने लीटर निस्यंद बनाते हैं?${roundToL(1, lang)}`,
        ),
        answer: numM(ans, 1, [
          [(U * p) / 100, L("The urine is the part NOT reabsorbed; it is a small part of the filtrate.", "मूत्र वह भाग है जो पुनरवशोषित नहीं होता; यह निस्यंद का छोटा भाग है।")],
          [U + (U * p) / 100, L("Urine is only the remaining percentage of the filtrate; divide by it.", "मूत्र निस्यंद का केवल शेष प्रतिशत है; उससे भाग दीजिए।")],
          [(U / p) * 100, L("Divide by the fraction not reabsorbed, not by the fraction reabsorbed.", "पुनरवशोषित भाग से नहीं, पुनरवशोषित न हुए भाग से भाग दीजिए।")],
        ]),
        data: { given: [`V_u = ${en(U)}\\ \\mathrm{L}`, `p = ${en(p)}\\,\\%`], find: ["V_f"] },
        hint: L("What percentage of the filtrate is left as urine?", "निस्यंद का कितना प्रतिशत मूत्र के रूप में बचता है?"),
        formula: "V_u = V_f \\cdot \\left(1 - \\dfrac{p}{100}\\right)",
        solution: L(
          S(`Left as urine: $100 - ${en(p)} = ${en(rd(100 - p))}\\,\\%$`, `$V_f = \\dfrac{${en(U)}}{${en(rd(1 - p / 100))}} = ${en(ans, 1)}\\ \\mathrm{L}$`),
          S(`मूत्र के रूप में बचा: $100 - ${en(p)} = ${en(rd(100 - p))}\\,\\%$`, `$V_f = \\dfrac{${en(U)}}{${en(rd(1 - p / 100))}} = ${en(ans, 1)}\\ \\mathrm{L}$`),
        ),
      });
    }
    if (v === 2) {
      const a = 10 * r.int(15, 30);
      const b = 10 * r.int(2, 8);
      const A = 100 * r.int(4, 20);
      const ans = (a + b) * A;
      return task({
        text: L(
          `A leaf has ${a} stomata per mm² on its lower surface and ${b} per mm² on its upper surface. Each surface has an area of ${A} mm². How many stomata does the leaf have in all?`,
          `एक पत्ती की निचली सतह पर प्रति mm² ${a} रंध्र और ऊपरी सतह पर प्रति mm² ${b} रंध्र हैं। प्रत्येक सतह का क्षेत्रफल ${A} mm² है। पत्ती पर कुल कितने रंध्र हैं?`,
        ),
        answer: numM(ans, 0, [
          [a * A, L("Add the stomata of the upper surface too.", "ऊपरी सतह के रंध्र भी जोड़िए।")],
          [(a - b) * A, L("Both surfaces have stomata: add, do not subtract.", "दोनों सतहों पर रंध्र हैं: जोड़िए, घटाइए नहीं।")],
          [a + b, L("That is per mm²; multiply by the area.", "यह प्रति mm² है; क्षेत्रफल से गुणा कीजिए।")],
        ]),
        data: { given: [`d_1 = ${a}\\ \\mathrm{mm^{-2}}`, `d_2 = ${b}\\ \\mathrm{mm^{-2}}`, `A = ${A}\\ \\mathrm{mm^2}`], find: ["N"] },
        hint: L("Find the stomata on each surface (density × area) and add.", "प्रत्येक सतह के रंध्र (घनत्व × क्षेत्रफल) ज्ञात करके जोड़िए।"),
        formula: "N = (d_1 + d_2) \\cdot A",
        solution: L(
          S(`Lower: $${a} \\cdot ${A} = ${a * A}$`, `Upper: $${b} \\cdot ${A} = ${b * A}$`, `$N = ${a * A} + ${b * A} = ${ans}$`, "Most stomata are on the lower surface, which is less exposed to the sun."),
          S(`निचली: $${a} \\cdot ${A} = ${a * A}$`, `ऊपरी: $${b} \\cdot ${A} = ${b * A}$`, `$N = ${a * A} + ${b * A} = ${ans}$`, "अधिकांश रंध्र निचली सतह पर होते हैं, जिस पर धूप कम पड़ती है।"),
        ),
      });
    }
    const k = r.int(2, 25);
    const n = 6 * k;
    const ans = 2 * n;
    return task({
      text: L(
        `Photosynthesis: $${PH_EQ}$. A plant releases ${n} molecules of oxygen. How many water molecules did it take in, as shown on the left side of the equation?`,
        `प्रकाश-संश्लेषण: $${PH_EQ}$। एक पौधा ऑक्सीजन के ${n} अणु मुक्त करता है। समीकरण के बाएँ पक्ष के अनुसार उसने जल के कितने अणु लिए?`,
      ),
      answer: numM(ans, 0, [
        [n, L("That is the net use (12 in, 6 out); the question asks for water taken in.", "यह शुद्ध उपयोग है (12 अंदर, 6 बाहर); प्रश्न लिए गए जल का है।")],
        [k, L("That is the number of glucose molecules.", "यह ग्लूकोज़ अणुओं की संख्या है।")],
        [12 * n, L("12 water molecules go with every 6 O₂, not with each O₂.", "जल के 12 अणु प्रत्येक 6 O₂ के साथ जाते हैं, प्रत्येक O₂ के साथ नहीं।")],
      ]),
      data: { given: [`N_{\\mathrm{O_2}} = ${n}`], find: ["N_{\\mathrm{H_2O}}"] },
      hint: L("Compare the coefficients of O₂ (6) and of water on the left side (12).", "O₂ (6) और बाएँ पक्ष के जल (12) के गुणांकों की तुलना कीजिए।"),
      formula: "N_{\\mathrm{H_2O}} = \\dfrac{12}{6}\\,N_{\\mathrm{O_2}}",
      solution: L(
        S(`Equation units: $${n} \\div 6 = ${k}$`, `$N_{\\mathrm{H_2O}} = 12 \\cdot ${k} = ${ans}$`, "(6 of every 12 water molecules are formed again on the right side.)"),
        S(`समीकरण की इकाइयाँ: $${n} \\div 6 = ${k}$`, `$N_{\\mathrm{H_2O}} = 12 \\cdot ${k} = ${ans}$`, "(प्रत्येक 12 जल अणुओं में से 6 दाएँ पक्ष में फिर बनते हैं।)"),
      ),
    });
  },
};

// ---------- Control and coordination: štetje in zaporedja ----------
const CC_CATS = [
  {
    q: ["How many of the following are plant hormones?", "निम्नलिखित में से कितने पादप हॉर्मोन हैं?"],
    yes: yn([["auxin", "ऑक्सिन"], ["gibberellin", "जिबरेलिन"], ["cytokinin", "साइटोकाइनिन"], ["abscisic acid", "एब्सिसिक अम्ल"]], "is a plant hormone", "पादप हॉर्मोन"),
    no: [
      ["insulin", "इंसुलिन", "is an animal hormone from the pancreas", "अग्न्याशय का जंतु हॉर्मोन"],
      ["thyroxin", "थायरॉक्सिन", "is an animal hormone from the thyroid", "अवटु ग्रंथि का जंतु हॉर्मोन"],
      ["adrenaline", "एड्रीनलीन", "is an animal hormone from the adrenal gland", "अधिवृक्क ग्रंथि का जंतु हॉर्मोन"],
      ["growth hormone", "वृद्धि हॉर्मोन", "is an animal hormone from the pituitary", "पीयूष ग्रंथि का जंतु हॉर्मोन"],
      ["testosterone", "टेस्टोस्टेरॉन", "is an animal hormone from the testes", "वृषण का जंतु हॉर्मोन"],
    ],
  },
  {
    q: ["How many of the following are endocrine glands?", "निम्नलिखित में से कितनी अंतःस्रावी ग्रंथियाँ हैं?"],
    yes: yn([["the pituitary gland", "पीयूष ग्रंथि"], ["the thyroid gland", "अवटु ग्रंथि"], ["the adrenal gland", "अधिवृक्क ग्रंथि"], ["the pancreas", "अग्न्याशय"], ["a testis", "वृषण"], ["an ovary", "अंडाशय"]], "releases hormones directly into the blood", "रुधिर में सीधे हॉर्मोन छोड़ने वाली अंतःस्रावी ग्रंथि"),
    no: yn([["the salivary gland", "लार ग्रंथि"], ["a sweat gland", "स्वेद ग्रंथि"], ["the tear gland", "अश्रु ग्रंथि"]], "releases its secretion through a duct", "वाहिनी द्वारा स्राव छोड़ने वाली बहिःस्रावी ग्रंथि"),
  },
  {
    q: ["How many of the following actions are controlled by the medulla?", "निम्नलिखित में से कितनी क्रियाएँ मेडुला द्वारा नियंत्रित होती हैं?"],
    yes: yn([["regulating blood pressure", "रक्तचाप का नियमन"], ["salivation", "लार आना"], ["vomiting", "वमन"]], "is an involuntary action controlled by the medulla", "मेडुला द्वारा नियंत्रित अनैच्छिक क्रिया"),
    no: [
      ["walking in a straight line", "सीधी रेखा में चलना", "depends on the cerebellum", "अनुमस्तिष्क पर निर्भर क्रिया"],
      ["riding a bicycle", "साइकिल चलाना", "depends on the cerebellum", "अनुमस्तिष्क पर निर्भर क्रिया"],
      ["picking up a pencil", "पेंसिल उठाना", "depends on the cerebellum", "अनुमस्तिष्क पर निर्भर क्रिया"],
      ["thinking", "सोचना", "is a function of the cerebrum", "प्रमस्तिष्क का कार्य"],
    ],
  },
  {
    q: ["How many of the following are reflex actions?", "निम्नलिखित में से कितनी प्रतिवर्ती क्रियाएँ हैं?"],
    yes: yn([["pulling the hand away from a flame", "ज्वाला से हाथ हटा लेना"], ["the knee-jerk", "घुटने का झटका (नी-जर्क)"], ["sneezing", "छींकना"], ["coughing", "खाँसना"], ["blinking when something comes suddenly near the eye", "आँख के पास अचानक कुछ आने पर पलक झपकना"]], "is a reflex action", "प्रतिवर्ती क्रिया"),
    no: [
      ["writing a letter", "पत्र लिखना", "is a voluntary action", "ऐच्छिक क्रिया"],
      ["solving a puzzle", "पहेली हल करना", "is a voluntary action of the cerebrum", "प्रमस्तिष्क की ऐच्छिक क्रिया"],
      ["riding a bicycle", "साइकिल चलाना", "is a voluntary action", "ऐच्छिक क्रिया"],
      ["talking to a friend", "मित्र से बात करना", "is a voluntary action", "ऐच्छिक क्रिया"],
    ],
  },
];
const REFLEX_CTX = [
  ["A person's hand touches a hot plate and is pulled away at once.", "किसी व्यक्ति का हाथ गर्म प्लेट छूते ही तुरंत हट जाता है।"],
  ["A pin pricks a person's foot and the leg is pulled back at once.", "किसी व्यक्ति के पैर में पिन चुभते ही पैर तुरंत पीछे खिंच जाता है।"],
  ["A doctor taps just below the kneecap and the leg jerks forward.", "डॉक्टर घुटने की टोपी के ठीक नीचे थपकी देता है और पैर झटके से आगे उठता है।"],
];
const CONTROL_COUNT = {
  id: "exg-bio-control-count",
  topics: [T("control-and-coordination")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const mode = r.int(0, 2);
    if (mode > 0) return countCat(r, L, r.pick(CC_CATS), level + 3);
    if (level === 3) {
      const ctx = r.pick(REFLEX_CTX);
      return task({
        text: L(`${ctx[0]} Which sequence shows the path of this reflex?`, `${ctx[1]} इस प्रतिवर्त का मार्ग कौन-सा क्रम दर्शाता है?`),
        answer: mc(r, L, ["receptor → sensory neuron → relay neuron in the spinal cord → motor neuron → effector (muscle)", "ग्राही → संवेदी न्यूरॉन → मेरुरज्जु में प्रसारण (रिले) न्यूरॉन → प्रेरक न्यूरॉन → कार्यकर (पेशी)"], [
          ["receptor → motor neuron → relay neuron in the spinal cord → sensory neuron → effector (muscle)", "ग्राही → प्रेरक न्यूरॉन → मेरुरज्जु में प्रसारण (रिले) न्यूरॉन → संवेदी न्यूरॉन → कार्यकर (पेशी)", "Sensory neurons carry the message in from the receptor; motor neurons carry it out to the muscle.", "संवेदी न्यूरॉन संदेश ग्राही से भीतर लाते हैं; प्रेरक न्यूरॉन उसे पेशी तक बाहर ले जाते हैं।"],
          ["effector (muscle) → sensory neuron → spinal cord → motor neuron → receptor", "कार्यकर (पेशी) → संवेदी न्यूरॉन → मेरुरज्जु → प्रेरक न्यूरॉन → ग्राही", "The receptor detects the stimulus first; the muscle responds last.", "उद्दीपन को पहले ग्राही पहचानता है; पेशी अंत में अनुक्रिया करती है।"],
          ["receptor → sensory neuron → cerebrum → motor neuron → effector (muscle)", "ग्राही → संवेदी न्यूरॉन → प्रमस्तिष्क → प्रेरक न्यूरॉन → कार्यकर (पेशी)", "In a reflex arc the link is made in the spinal cord, not in the cerebrum.", "प्रतिवर्ती चाप में संबंध मेरुरज्जु में बनता है, प्रमस्तिष्क में नहीं।"],
        ]),
        hint: L("Follow the message: what detects the stimulus, and what finally acts?", "संदेश का पीछा कीजिए: उद्दीपन को कौन पहचानता है और अंत में कौन क्रिया करता है?"),
        solution: L(
          S("The receptor detects the stimulus; a sensory neuron carries it to the spinal cord.", "A relay neuron there passes it to a motor neuron, which makes the muscle (effector) respond.", "The link is in the spinal cord, so the response is very quick."),
          S("ग्राही उद्दीपन पहचानता है; संवेदी न्यूरॉन संदेश मेरुरज्जु तक ले जाता है।", "वहाँ प्रसारण न्यूरॉन उसे प्रेरक न्यूरॉन को देता है, जो पेशी (कार्यकर) से अनुक्रिया कराता है।", "संबंध मेरुरज्जु में बनता है, इसलिए अनुक्रिया बहुत शीघ्र होती है।"),
        ),
      });
    }
    if (level === 2) {
      const meal = r.int(0, 1);
      return task({
        text: meal
          ? L("After a sweet, sugary meal the blood sugar level rises. How does the body bring it back to normal?", "मीठा भोजन करने के बाद रुधिर में शर्करा का स्तर बढ़ जाता है। शरीर इसे सामान्य कैसे करता है?")
          : L("Which statement correctly describes the feedback control of insulin?", "इंसुलिन के पुनर्भरण (फीडबैक) नियंत्रण का सही वर्णन कौन-सा है?"),
        answer: mc(r, L, ["The pancreas detects the rise and secretes more insulin; as sugar falls, insulin secretion is reduced.", "अग्न्याशय वृद्धि को पहचानकर अधिक इंसुलिन स्रावित करता है; शर्करा घटने पर इंसुलिन का स्रावण कम हो जाता है।"], [
          ["The pancreas secretes less insulin when blood sugar rises.", "रुधिर शर्करा बढ़ने पर अग्न्याशय कम इंसुलिन स्रावित करता है।", "A rise in blood sugar makes the pancreas release more insulin, not less.", "शर्करा बढ़ने पर अग्न्याशय अधिक इंसुलिन छोड़ता है, कम नहीं।"],
          ["The thyroid gland releases thyroxin to lower the blood sugar.", "अवटु ग्रंथि रुधिर शर्करा घटाने के लिए थायरॉक्सिन छोड़ती है।", "Blood sugar is regulated by insulin from the pancreas.", "रुधिर शर्करा का नियमन अग्न्याशय का इंसुलिन करता है।"],
          ["Insulin secretion keeps rising even after the sugar level becomes normal.", "शर्करा सामान्य होने के बाद भी इंसुलिन का स्रावण बढ़ता रहता है।", "In feedback control, secretion is reduced once the sugar level falls.", "पुनर्भरण नियंत्रण में शर्करा घटते ही स्रावण कम हो जाता है।"],
        ]),
        hint: L("Which gland senses blood sugar, and what happens once the level is back to normal?", "कौन-सी ग्रंथि रुधिर शर्करा को पहचानती है, और स्तर सामान्य होने पर क्या होता है?"),
        solution: L(
          S("Rise in blood sugar → detected by cells of the pancreas → more insulin.", "Sugar level falls → insulin secretion is reduced (feedback)."),
          S("रुधिर शर्करा में वृद्धि → अग्न्याशय की कोशिकाएँ पहचानती हैं → अधिक इंसुलिन।", "शर्करा स्तर घटता है → इंसुलिन का स्रावण कम (पुनर्भरण)।"),
        ),
      });
    }
    return task({
      text: L("Many people in a hilly area have a swollen neck (goitre). Which nutrient is most likely missing from their diet?", "एक पहाड़ी क्षेत्र में अनेक लोगों की गर्दन फूली हुई है (गलगंड)। उनके आहार में सबसे संभावित रूप से किस पोषक की कमी है?"),
      answer: mc(r, L, ["iodine", "आयोडीन"], [
        ["calcium", "कैल्सियम", "Calcium is not used to make thyroxin.", "थायरॉक्सिन बनाने में कैल्सियम का उपयोग नहीं होता।"],
        ["iron", "लोहा", "Iron is needed for haemoglobin, not for thyroxin.", "लोहा हीमोग्लोबिन के लिए चाहिए, थायरॉक्सिन के लिए नहीं।"],
        ["sugar", "शर्करा", "Goitre is a thyroid problem; blood sugar is regulated by insulin.", "गलगंड अवटु ग्रंथि की समस्या है; रुधिर शर्करा का नियमन इंसुलिन करता है।"],
      ]),
      hint: L("Goitre is a swelling of the thyroid gland. What does it need to make thyroxin?", "गलगंड अवटु ग्रंथि की सूजन है। थायरॉक्सिन बनाने के लिए उसे क्या चाहिए?"),
      solution: L(
        S("The thyroid gland needs iodine to make thyroxin.", "Lack of iodine → goitre; hence iodised salt is advised."),
        S("अवटु ग्रंथि को थायरॉक्सिन बनाने के लिए आयोडीन चाहिए।", "आयोडीन की कमी → गलगंड; इसीलिए आयोडीन युक्त नमक की सलाह दी जाती है।"),
      ),
    });
  },
};

// ---------- How organisms reproduce: delitev in kromosomi ----------
const REPRO_CALC = {
  id: "exg-bio-reproduce-calc",
  topics: [T("how-organisms-reproduce")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 2);
    const org = r.pick([["Amoeba", "अमीबा"], ["a bacterium", "एक जीवाणु"], ["Paramecium", "पैरामीशियम"]]);
    if (level === 1) {
      if (v === 0) {
        const g = r.int(2, 6);
        const ans = 2 ** g;
        return task({
          text: L(`A single ${org[0] === "a bacterium" ? "bacterium" : org[0]} divides by binary fission. Every new cell also divides, and this happens ${g} times in a row. How many cells are there at the end?`, `${org[1]} द्विखंडन द्वारा विभाजित होता है। प्रत्येक नई कोशिका भी विभाजित होती है, और ऐसा लगातार ${g} बार होता है। अंत में कितनी कोशिकाएँ होंगी?`),
          answer: numM(ans, 0, [
            [2 * g, L("Each round doubles the number; it does not add 2.", "प्रत्येक चक्र में संख्या दुगुनी होती है; 2 नहीं जुड़ते।")],
            [g + 1, L("Every cell divides in each round, not just one cell.", "प्रत्येक चक्र में हर कोशिका विभाजित होती है, केवल एक नहीं।")],
            [2 ** (g - 1), L("After the first division there are already 2 cells; count all rounds.", "पहले विभाजन के बाद ही 2 कोशिकाएँ हो जाती हैं; सभी चक्र गिनिए।")],
          ]),
          data: { given: [`g = ${g}`], find: ["N"] },
          hint: L("1 → 2 → 4 → … : the number doubles each time.", "1 → 2 → 4 → … : हर बार संख्या दुगुनी होती है।"),
          formula: "N = N_0 \\cdot 2^{g}",
          solution: L(S(`$N = 2^{${g}} = ${ans}$`, `Answer: ${ans} cells`), S(`$N = 2^{${g}} = ${ans}$`, `उत्तर: ${ans} कोशिकाएँ`)),
        });
      }
      const X = r.pick([8, 12, 14, 16, 20, 24, 38, 46, 48]);
      if (v === 1) {
        const egg = r.int(0, 1);
        return task({
          text: L(`The body cells of an animal species have ${X} chromosomes. How many chromosomes are there in ${egg ? "an egg" : "a sperm"} of this species?`, `एक जंतु जाति की शरीर कोशिकाओं में ${X} गुणसूत्र होते हैं। इस जाति के ${egg ? "अंड" : "शुक्राणु"} में कितने गुणसूत्र होंगे?`),
          answer: numM(X / 2, 0, [
            [X, L("Germ cells carry only one set: half the number of body cells.", "जनन कोशिकाओं में केवल एक समुच्चय होता है: शरीर कोशिकाओं का आधा।")],
            [2 * X, L("Gametes have fewer chromosomes than body cells, not more.", "युग्मकों में शरीर कोशिकाओं से कम गुणसूत्र होते हैं, अधिक नहीं।")],
          ]),
          data: { given: [`2n = ${X}`], find: ["n"] },
          hint: L("Fertilisation must restore the body-cell number.", "निषेचन से शरीर कोशिका की संख्या फिर बननी चाहिए।"),
          formula: "n = \\dfrac{2n}{2}",
          solution: L(S(`$n = ${X} \\div 2 = ${X / 2}$`, "Two such gametes fuse to give the full number again."), S(`$n = ${X} \\div 2 = ${X / 2}$`, "ऐसे दो युग्मक मिलकर फिर पूरी संख्या बनाते हैं।")),
        });
      }
      const a = X / 2;
      return task({
        text: L(`A sperm with ${a} chromosomes fertilises an egg of the same species. How many chromosomes does the zygote have?`, `${a} गुणसूत्रों वाला एक शुक्राणु उसी जाति के अंड को निषेचित करता है। युग्मनज में कितने गुणसूत्र होंगे?`),
        answer: numM(X, 0, [
          [a, L("The egg also brings a set of chromosomes.", "अंड भी गुणसूत्रों का एक समुच्चय लाता है।")],
          [a / 2, L("Fusion adds the two sets; it does not halve them.", "संलयन में दोनों समुच्चय जुड़ते हैं; आधे नहीं होते।")],
        ]),
        data: { given: [`n = ${a}`], find: ["2n"] },
        hint: L("How many chromosomes does the egg of the same species carry?", "उसी जाति के अंड में कितने गुणसूत्र होते हैं?"),
        formula: "2n = n_{\\text{sperm}} + n_{\\text{egg}}",
        solution: L(S(`The egg also has ${a} chromosomes.`, `$2n = ${a} + ${a} = ${X}$`), S(`अंड में भी ${a} गुणसूत्र होते हैं।`, `$2n = ${a} + ${a} = ${X}$`)),
      });
    }
    if (level === 2) {
      if (v < 2) {
        const N0 = r.pick([1, 2, 3, 5, 10, 20]);
        const d = r.pick([20, 30]);
        const g = r.int(3, 6);
        const t = g * d;
        const ans = N0 * 2 ** g;
        return task({
          text: L(`Under good conditions a bacterium divides by binary fission every ${d} minutes. A culture starts with ${N0} bacteri${N0 === 1 ? "um" : "a"}. How many bacteria are there after ${t} minutes?`, `अनुकूल परिस्थितियों में एक जीवाणु हर ${d} मिनट में द्विखंडन द्वारा विभाजित होता है। एक संवर्धन ${N0} जीवाणु से आरंभ होता है। ${t} मिनट बाद कितने जीवाणु होंगे?`),
          answer: numM(ans, 0, [
            [N0 * 2 * g, L("The number doubles each time; use powers of 2.", "संख्या हर बार दुगुनी होती है; 2 की घातें लीजिए।")],
            [2 ** g, L(`Multiply by the starting number, ${N0}.`, `प्रारंभिक संख्या ${N0} से गुणा कीजिए।`)],
            [N0 * 2 ** (g - 1), L("Count the divisions: time ÷ division time.", "विभाजन गिनिए: समय ÷ विभाजन का समय।")],
          ]),
          data: { given: [`N_0 = ${N0}`, `t_d = ${d}\\ \\mathrm{min}`, `t = ${t}\\ \\mathrm{min}`], find: ["N"] },
          hint: L("First find how many divisions take place in the given time.", "पहले ज्ञात कीजिए कि दिए गए समय में कितने विभाजन होते हैं।"),
          formula: "N = N_0 \\cdot 2^{t / t_d}",
          solution: L(S(`Divisions: $${t} \\div ${d} = ${g}$`, `$N = ${N0} \\cdot 2^{${g}} = ${ans}$`), S(`विभाजन: $${t} \\div ${d} = ${g}$`, `$N = ${N0} \\cdot 2^{${g}} = ${ans}$`)),
        });
      }
      const X = r.pick([8, 12, 14, 16, 20, 24, 46]);
      const g = r.int(2, 4);
      const ans = X * 2 ** g;
      return task({
        text: L(`The body cells of a species have ${X} chromosomes. Imagine that its germ cells were NOT made with half the number. How many chromosomes would the offspring have after ${g} generations of sexual reproduction?`, `एक जाति की शरीर कोशिकाओं में ${X} गुणसूत्र हैं। कल्पना कीजिए कि उसकी जनन कोशिकाएँ आधी संख्या वाली नहीं बनतीं। लैंगिक जनन की ${g} पीढ़ियों के बाद संतति में कितने गुणसूत्र होंगे?`),
        answer: numM(ans, 0, [
          [X * 2 * g, L("The number doubles every generation; use powers of 2.", "संख्या प्रत्येक पीढ़ी में दुगुनी होती है; 2 की घातें लीजिए।")],
          [X, L("Without halving, fusion of two full sets doubles the number.", "आधा हुए बिना, दो पूरे समुच्चयों के संलयन से संख्या दुगुनी होती है।")],
          [X * 2 ** (g - 1), L("The first generation of offspring already has double the number.", "संतति की पहली पीढ़ी में ही संख्या दुगुनी हो जाती है।")],
        ]),
        data: { given: [`2n = ${X}`, `g = ${g}`], find: ["N"] },
        hint: L("Each fertilisation would add two full sets. What happens every generation?", "प्रत्येक निषेचन में दो पूरे समुच्चय जुड़ते। हर पीढ़ी में क्या होगा?"),
        formula: "N = 2n \\cdot 2^{g}",
        solution: L(
          S(`Each generation doubles the number: $N = ${X} \\cdot 2^{${g}} = ${ans}$`, "This is why germ cells must have only one set of chromosomes."),
          S(`प्रत्येक पीढ़ी में संख्या दुगुनी: $N = ${X} \\cdot 2^{${g}} = ${ans}$`, "इसीलिए जनन कोशिकाओं में गुणसूत्रों का केवल एक समुच्चय होना आवश्यक है।"),
        ),
      });
    }
    // Raven 3: obratni izračuni pri delitvi
    const N0 = r.pick([2, 3, 4, 5, 10, 25]);
    const d = r.pick([15, 20, 25, 30, 40]);
    const g = r.int(3, 7);
    const t = g * d;
    const N = N0 * 2 ** g;
    if (v === 0) {
      return task({
        text: L(`A culture of ${N0} bacteria grows by binary fission to ${N} bacteria in ${t} minutes. How long (in minutes) does one division take?`, `${N0} जीवाणुओं का एक संवर्धन द्विखंडन द्वारा ${t} मिनट में ${N} जीवाणु बन जाता है। एक विभाजन में कितना समय (मिनट में) लगता है?`),
        answer: numM(d, 1, [
          [rd(t / (N / N0), 1), L("Use the number of doublings, not the number of times the culture grew.", "संवर्धन कितने गुना बढ़ा, यह नहीं; दुगुना होने की संख्या लीजिए।")],
          [rd(t / (g + 1), 1), L(`From ${N0} to ${N} is exactly ${g} doublings.`, `${N0} से ${N} तक ठीक ${g} बार दुगुना होना है।`)],
          [rd(t / (N - N0), 1), L("Fission doubles the number; it does not add a fixed number.", "द्विखंडन संख्या दुगुनी करता है; कोई निश्चित संख्या नहीं जोड़ता।")],
        ]),
        data: { given: [`N_0 = ${N0}`, `N = ${N}`, `t = ${t}\\ \\mathrm{min}`], find: ["t_d"] },
        hint: L("How many times must the number double to go from the start to the end?", "आरंभ से अंत तक पहुँचने के लिए संख्या कितनी बार दुगुनी होनी चाहिए?"),
        formula: "N = N_0 \\cdot 2^{g},\\ t_d = \\dfrac{t}{g}",
        solution: L(
          S(`$N / N_0 = ${N} \\div ${N0} = ${2 ** g} = 2^{${g}}$, so $g = ${g}$`, `$t_d = ${t} \\div ${g} = ${d}\\ \\mathrm{min}$`),
          S(`$N / N_0 = ${N} \\div ${N0} = ${2 ** g} = 2^{${g}}$, अतः $g = ${g}$`, `$t_d = ${t} \\div ${g} = ${d}\\ \\mathrm{min}$`),
        ),
      });
    }
    if (v === 1) {
      return task({
        text: L(`Bacteria in a culture divide every ${d} minutes. After ${t} minutes there are ${N} bacteria. How many bacteria were there at the start?`, `एक संवर्धन के जीवाणु हर ${d} मिनट में विभाजित होते हैं। ${t} मिनट बाद ${N} जीवाणु हैं। आरंभ में कितने जीवाणु थे?`),
        answer: numM(N0, 0, [
          [N / g, L("Divide by 2 for every division, i.e. by a power of 2.", "प्रत्येक विभाजन के लिए 2 से, अर्थात 2 की घात से भाग दीजिए।")],
          [N / 2, L(`There were ${g} divisions, not one.`, `विभाजन ${g} हुए, एक नहीं।`)],
          [N / 2 ** (g - 1), L("Count the divisions: time ÷ division time.", "विभाजन गिनिए: समय ÷ विभाजन का समय।")],
        ]),
        data: { given: [`t_d = ${d}\\ \\mathrm{min}`, `t = ${t}\\ \\mathrm{min}`, `N = ${N}`], find: ["N_0"] },
        hint: L("Find the number of divisions, then undo the doublings.", "विभाजनों की संख्या ज्ञात कीजिए, फिर दुगुना होने को उलटिए।"),
        formula: "N_0 = \\dfrac{N}{2^{t / t_d}}",
        solution: L(S(`Divisions: $${t} \\div ${d} = ${g}$`, `$N_0 = ${N} \\div 2^{${g}} = ${N} \\div ${2 ** g} = ${N0}$`), S(`विभाजन: $${t} \\div ${d} = ${g}$`, `$N_0 = ${N} \\div 2^{${g}} = ${N} \\div ${2 ** g} = ${N0}$`)),
      });
    }
    return task({
      text: L(`A culture starts with ${N0} bacteria that divide every ${d} minutes. After how many minutes will there be ${N} bacteria?`, `एक संवर्धन ${N0} जीवाणुओं से आरंभ होता है, जो हर ${d} मिनट में विभाजित होते हैं। कितने मिनट बाद ${N} जीवाणु होंगे?`),
      answer: numM(t, 0, [
        [d * (N / N0), L("Multiply the division time by the number of doublings, not by the fold increase.", "विभाजन के समय को गुना-वृद्धि से नहीं, दुगुना होने की संख्या से गुणा कीजिए।")],
        [d * (g - 1), L(`From ${N0} to ${N} takes ${g} doublings.`, `${N0} से ${N} तक ${g} बार दुगुना होना पड़ता है।`)],
        [g, L("That is the number of divisions; convert it to minutes.", "यह विभाजनों की संख्या है; इसे मिनटों में बदलिए।")],
      ]),
      data: { given: [`N_0 = ${N0}`, `t_d = ${d}\\ \\mathrm{min}`, `N = ${N}`], find: ["t"] },
      hint: L("Write N ÷ N₀ as a power of 2.", "N ÷ N₀ को 2 की घात के रूप में लिखिए।"),
      formula: "t = g \\cdot t_d,\\ 2^{g} = \\dfrac{N}{N_0}",
      solution: L(S(`$${N} \\div ${N0} = ${2 ** g} = 2^{${g}}$`, `$t = ${g} \\cdot ${d} = ${t}\\ \\mathrm{min}$`), S(`$${N} \\div ${N0} = ${2 ** g} = 2^{${g}}$`, `$t = ${g} \\cdot ${d} = ${t}\\ \\mathrm{min}$`)),
    });
  },
};

// ---------- Heredity: Mendlova razmerja in verjetnosti (raven 10. razreda) ----------
const MONO = [
  [["tall", "लंबे"], ["short", "बौने"]],
  [["round-seeded", "गोल बीज वाले"], ["wrinkled-seeded", "झुर्रीदार बीज वाले"]],
  [["yellow-seeded", "पीले बीज वाले"], ["green-seeded", "हरे बीज वाले"]],
  [["violet-flowered", "बैंगनी पुष्प वाले"], ["white-flowered", "सफ़ेद पुष्प वाले"]],
];
const DI = [
  [["round yellow", "गोल पीले"], 9],
  [["round green", "गोल हरे"], 3],
  [["wrinkled yellow", "झुर्रीदार पीले"], 3],
  [["wrinkled green", "झुर्रीदार हरे"], 1],
];
// Mendlovi lastni podatki F2 (1866).
const MENDEL_F2 = [
  [787, 277, ["tall", "लंबे"], ["short", "बौने"], ["plants", "पौधे"]],
  [5474, 1850, ["round", "गोल"], ["wrinkled", "झुर्रीदार"], ["seeds", "बीज"]],
  [6022, 2001, ["yellow", "पीले"], ["green", "हरे"], ["seeds", "बीज"]],
  [705, 224, ["violet-flowered", "बैंगनी पुष्प वाले"], ["white-flowered", "सफ़ेद पुष्प वाले"], ["plants", "पौधे"]],
];
const HUMAN_CHR = [
  [["a human sperm", "मनुष्य के एक शुक्राणु में"], 23, [[46, "Sperms carry one set, half of 46.", "शुक्राणु में एक समुच्चय, अर्थात 46 का आधा होता है।"], [22, "Count the sex chromosome (X or Y) as well.", "लिंग गुणसूत्र (X या Y) भी गिनिए।"]]],
  [["a human body cell", "मनुष्य की एक शरीर कोशिका में"], 46, [[23, "Body cells have 23 pairs, not 23 chromosomes.", "शरीर कोशिकाओं में 23 जोड़े होते हैं, 23 गुणसूत्र नहीं।"], [44, "Include the pair of sex chromosomes.", "लिंग गुणसूत्रों का जोड़ा भी शामिल कीजिए।"]]],
  [["a human egg, other than the sex chromosome", "मनुष्य के एक अंड में, लिंग गुणसूत्र को छोड़कर,"], 22, [[23, "Leave out the X chromosome, as asked.", "प्रश्न के अनुसार X गुणसूत्र को छोड़िए।"], [44, "An egg has one set, not two.", "अंड में एक समुच्चय होता है, दो नहीं।"]]],
  [["a man's body cell, other than the sex chromosomes", "पुरुष की एक शरीर कोशिका में, लिंग गुणसूत्रों को छोड़कर,"], 44, [[46, "Leave out the X and Y chromosomes.", "X और Y गुणसूत्रों को छोड़िए।"], [22, "A body cell has two sets, i.e. 22 pairs.", "शरीर कोशिका में दो समुच्चय, अर्थात 22 जोड़े होते हैं।"]]],
];
const HEREDITY_CALC = {
  id: "exg-bio-heredity-calc",
  topics: [T("heredity-and-variation")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 2);
    const monoTask = (T4, ch, rec) => {
      const ans = rec ? T4 / 4 : (3 * T4) / 4;
      const pick = rec ? ch[1] : ch[0];
      return task({
        text: L(
          `A pure ${ch[0][0]} pea plant is crossed with a pure ${ch[1][0]} one, and the F1 plants are self-pollinated. Out of ${T4} F2 plants, how many are expected to be ${pick[0]}?`,
          `एक शुद्ध ${ch[0][1]} मटर के पौधे का संकरण शुद्ध ${ch[1][1]} पौधे से किया गया और F1 पौधों का स्वपरागण कराया गया। F2 के ${T4} पौधों में से कितने पौधे ${pick[1]} होने की आशा है?`,
        ),
        answer: numM(ans, 0, [
          [T4 / 2, L("The F2 ratio is 3 : 1, not 1 : 1.", "F2 अनुपात 3 : 1 है, 1 : 1 नहीं।")],
          [rd(rec ? T4 / 3 : (2 * T4) / 3, 2), L("3 : 1 means 3 out of 4 parts and 1 out of 4, not thirds.", "3 : 1 का अर्थ 4 में से 3 और 4 में से 1 भाग है, तिहाई नहीं।")],
          [rec ? (3 * T4) / 4 : T4 / 4, L(`The ${ch[0][0]} trait is dominant; it is the larger group.`, `${ch[0][1]} लक्षण प्रभावी है; वही बड़ा समूह है।`)],
        ]),
        data: { given: [`N = ${T4}`], find: [rec ? "N_{\\text{rec}}" : "N_{\\text{dom}}"] },
        hint: L("Which trait shows in F1? In F2 the ratio dominant : recessive is 3 : 1.", "F1 में कौन-सा लक्षण दिखता है? F2 में प्रभावी : अप्रभावी अनुपात 3 : 1 है।"),
        formula: rec ? "N_{\\text{rec}} = \\dfrac{1}{4}N" : "N_{\\text{dom}} = \\dfrac{3}{4}N",
        solution: L(
          S(`${cap(ch[0][0])} is dominant, so F2 = 3 ${ch[0][0]} : 1 ${ch[1][0]}.`, `$N = ${rec ? "\\tfrac{1}{4}" : "\\tfrac{3}{4}"} \\cdot ${T4} = ${ans}$`),
          S(`${ch[0][1]} लक्षण प्रभावी है, अतः F2 = 3 ${ch[0][1]} : 1 ${ch[1][1]}।`, `$N = ${rec ? "\\tfrac{1}{4}" : "\\tfrac{3}{4}"} \\cdot ${T4} = ${ans}$`),
        ),
      });
    };
    if (level === 1) {
      if (v === 0) {
        const T4 = 4 * r.int(25, 300);
        const ch = r.pick(MONO);
        return monoTask(T4, ch, r.int(0, 1) === 1);
      }
      if (v === 1) {
        const c = r.pick(HUMAN_CHR);
        return task({
          text: L(`How many chromosomes are there in ${c[0][0]}?`, `${c[0][1]} कितने गुणसूत्र होते हैं?`),
          answer: numM(c[1], 0, c[2].map((m) => [m[0], L(m[1], m[2])])),
          hint: L("Humans have 23 pairs of chromosomes; one pair are the sex chromosomes.", "मनुष्य में गुणसूत्रों के 23 जोड़े होते हैं; एक जोड़ा लिंग गुणसूत्रों का है।"),
          solution: L(
            S("Body cell: 23 pairs = 46 (22 pairs + XX or XY).", "Germ cell: one set = 23 (22 + X or Y).", `Answer: ${c[1]}`),
            S("शरीर कोशिका: 23 जोड़े = 46 (22 जोड़े + XX या XY)।", "जनन कोशिका: एक समुच्चय = 23 (22 + X या Y)।", `उत्तर: ${c[1]}`),
          ),
        });
      }
      const which = r.int(0, 1);
      return task({
        text: which
          ? L("What fraction of the sperms of a man carry a Y chromosome?", "एक पुरुष के शुक्राणुओं का कौन-सा भाग Y गुणसूत्र वाला होता है?")
          : L("A couple is expecting a baby. What is the probability that it is a boy?", "एक दंपती के यहाँ शिशु होने वाला है। उसके लड़का होने की प्रायिकता क्या है?"),
        answer: fractionM(1, 2, [
          [1 / 4, L("Only the father's gamete decides: X or Y, equally likely.", "केवल पिता का युग्मक निर्णय करता है: X या Y, दोनों समान रूप से संभावित।")],
          [1, L("Half of the sperms carry X, so not all of them carry Y.", "आधे शुक्राणुओं में X होता है, इसलिए सभी में Y नहीं होता।")],
        ]),
        hint: L("A man is XY: his sperms get either X or Y.", "पुरुष XY होता है: उसके शुक्राणुओं को X या Y मिलता है।"),
        solution: L(
          S("Man XY → sperms: half X, half Y. Woman XX → all eggs X.", which ? "Fraction with Y = 1/2" : "Egg + Y-sperm → XY (boy): probability 1/2"),
          S("पुरुष XY → शुक्राणु: आधे X, आधे Y। स्त्री XX → सभी अंड X।", which ? "Y वाले भाग = 1/2" : "अंड + Y-शुक्राणु → XY (लड़का): प्रायिकता 1/2"),
        ),
      });
    }
    if (level === 2) {
      if (v === 0) {
        const T16 = 16 * r.int(10, 100);
        const cls = r.pick(DI);
        const w = cls[1];
        const ans = (T16 * w) / 16;
        const other = w === 9 ? 3 : w === 1 ? 3 : 9;
        return task({
          text: L(
            `Mendel crossed pure round yellow-seeded plants with pure wrinkled green-seeded plants. Self-pollination of F1 gave ${T16} F2 seeds. How many seeds are expected to be ${cls[0][0]}?`,
            `मेंडल ने शुद्ध गोल पीले बीज वाले पौधों का संकरण शुद्ध झुर्रीदार हरे बीज वाले पौधों से किया। F1 के स्वपरागण से F2 में ${T16} बीज मिले। कितने बीज ${cls[0][1]} होने की आशा है?`,
          ),
          answer: numM(ans, 0, [
            [(T16 * other) / 16, L("Match the class to the ratio 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green.", "वर्ग का मिलान 9 गोल पीले : 3 गोल हरे : 3 झुर्रीदार पीले : 1 झुर्रीदार हरे से कीजिए।")],
            [T16 / 4, L("This is a dihybrid cross: the ratio has 16 parts, not 4.", "यह द्विसंकर संकरण है: अनुपात में 16 भाग हैं, 4 नहीं।")],
            [(T16 * w) / 9, L("The total of 9 + 3 + 3 + 1 is 16.", "9 + 3 + 3 + 1 का योग 16 है।")],
          ]),
          data: { given: [`N = ${T16}`], find: ["n"] },
          hint: L("Write the F2 ratio 9 : 3 : 3 : 1 and find the share of this class out of 16.", "F2 अनुपात 9 : 3 : 3 : 1 लिखिए और 16 में से इस वर्ग का भाग ज्ञात कीजिए।"),
          formula: "n = \\dfrac{w}{16} N",
          solution: L(S(`${cap(cls[0][0])}: ${w} parts of 16`, `$n = \\dfrac{${w}}{16} \\cdot ${T16} = ${ans}$`), S(`${cls[0][1]}: 16 में से ${w} भाग`, `$n = \\dfrac{${w}}{16} \\cdot ${T16} = ${ans}$`)),
        });
      }
      if (v === 1) {
        const m = r.pick(MENDEL_F2);
        const ans = m[0] / m[1];
        return task({
          text: L(
            `In one of Mendel's experiments the F2 generation had ${m[0]} ${m[2][0]} and ${m[3][0]} ${m[1]} ${m[4][0]}. Write the ratio ${m[2][0]} : ${m[3][0]} as x : 1 and find x.${roundToL(2, lang)}`,
            `मेंडल के एक प्रयोग में F2 पीढ़ी में ${m[0]} ${m[2][1]} और ${m[1]} ${m[3][1]} ${m[4][1]} थे। अनुपात ${m[2][1]} : ${m[3][1]} को x : 1 के रूप में लिखकर x ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: numM(ans, 2, [
            [m[1] / m[0], L("Divide the dominant count by the recessive count, not the other way round.", "प्रभावी संख्या को अप्रभावी संख्या से भाग दीजिए, उल्टा नहीं।")],
            [m[0] / (m[0] + m[1]), L("That is the dominant fraction of the total, not the ratio x : 1.", "यह कुल में प्रभावी भाग है, x : 1 अनुपात नहीं।")],
            [3, L("Use Mendel's actual numbers; the result is close to 3 but not exact.", "मेंडल की वास्तविक संख्याएँ लीजिए; परिणाम 3 के निकट है, ठीक 3 नहीं।")],
          ]),
          data: { given: [`n_1 = ${m[0]}`, `n_2 = ${m[1]}`], find: ["x"] },
          hint: L("Divide both numbers by the smaller one.", "दोनों संख्याओं को छोटी संख्या से भाग दीजिए।"),
          formula: "x = \\dfrac{n_1}{n_2}",
          solution: L(
            S(`$x = ${m[0]} \\div ${m[1]} = ${en(ans, 2)}$`, `Ratio ≈ ${en(ans, 2)} : 1, close to the expected 3 : 1.`),
            S(`$x = ${m[0]} \\div ${m[1]} = ${en(ans, 2)}$`, `अनुपात ≈ ${en(ans, 2)} : 1, जो अपेक्षित 3 : 1 के निकट है।`),
          ),
        });
      }
      const n = r.int(2, 4);
      const girls = r.int(0, 1);
      return task({
        text: L(`A couple plans to have ${n} children. What is the probability that all ${n} are ${girls ? "girls" : "boys"}?`, `एक दंपती ${n} बच्चे चाहता है। सभी ${n} बच्चों के ${girls ? "लड़कियाँ" : "लड़के"} होने की प्रायिकता क्या है?`),
        answer: fractionM(1, 2 ** n, [
          [1 / 2, L("Each birth has probability 1/2; multiply for all the births.", "प्रत्येक जन्म की प्रायिकता 1/2 है; सभी जन्मों के लिए गुणा कीजिए।")],
          [1 / (2 * n), L(`Multiply 1/2 by itself ${n} times; do not divide by 2 × ${n}.`, `1/2 को ${n} बार आपस में गुणा कीजिए; 2 × ${n} से भाग न दीजिए।`)],
          [1 / n, L("Each birth is an independent event with probability 1/2.", "प्रत्येक जन्म 1/2 प्रायिकता वाली स्वतंत्र घटना है।")],
        ]),
        data: { given: [`n = ${n}`], find: ["P"] },
        hint: L("The sex of each child is decided independently, with probability 1/2.", "प्रत्येक बच्चे का लिंग स्वतंत्र रूप से 1/2 प्रायिकता से निर्धारित होता है।"),
        formula: "P = \\left(\\tfrac{1}{2}\\right)^{n}",
        solution: L(S("Each birth is independent.", `$P = \\left(\\tfrac{1}{2}\\right)^{${n}} = ${fracTex(1, 2 ** n)}$`), S(`प्रत्येक जन्म स्वतंत्र है।`, `$P = \\left(\\tfrac{1}{2}\\right)^{${n}} = ${fracTex(1, 2 ** n)}$`)),
      });
    }
    // Raven 3
    const w3 = r.int(0, 3);
    if (v === 0) {
      const T16 = 16 * r.int(10, 100);
      if (w3 < 2) {
        const atLeast = w3 === 0;
        const parts = atLeast ? 7 : 6;
        const ans = (T16 * parts) / 16;
        return task({
          text: L(
            `Pure round yellow-seeded pea plants are crossed with pure wrinkled green-seeded ones. The F1 is self-pollinated and gives ${T16} F2 seeds. How many seeds are expected to ${atLeast ? "show at least one recessive trait (wrinkled or green)" : "show a new combination not seen in either parent"}?`,
            `शुद्ध गोल पीले बीज वाले मटर के पौधों का संकरण शुद्ध झुर्रीदार हरे बीज वाले पौधों से किया गया। F1 के स्वपरागण से F2 में ${T16} बीज मिले। कितने बीजों में ${atLeast ? "कम से कम एक अप्रभावी लक्षण (झुर्रीदार या हरा) होने" : "कोई ऐसा नया संयोजन होने, जो किसी जनक में नहीं था,"} की आशा है?`,
          ),
          answer: numM(ans, 0, atLeast
            ? [[T16 / 16, L("Wrinkled green has both recessive traits; round green and wrinkled yellow have one each.", "झुर्रीदार हरे में दोनों अप्रभावी लक्षण हैं; गोल हरे और झुर्रीदार पीले में एक-एक है।")], [(T16 * 6) / 16, L("Include the wrinkled green seeds too.", "झुर्रीदार हरे बीज भी शामिल कीजिए।")], [T16 / 4, L("Add the parts 3 + 3 + 1 out of 16.", "16 में से 3 + 3 + 1 भाग जोड़िए।")]]
            : [[(T16 * 10) / 16, L("The parents were round yellow and wrinkled green; those are not new.", "जनक गोल पीले और झुर्रीदार हरे थे; वे नए नहीं हैं।")], [(T16 * 3) / 16, L("Both round green and wrinkled yellow are new combinations.", "गोल हरे और झुर्रीदार पीले, दोनों नए संयोजन हैं।")], [(T16 * 7) / 16, L("Wrinkled green is a parental type, not a new one.", "झुर्रीदार हरा जनक प्रकार है, नया नहीं।")]]),
          data: { given: [`N = ${T16}`], find: ["n"] },
          hint: L("List the four F2 classes with 9 : 3 : 3 : 1 and pick the ones that fit.", "F2 के चारों वर्गों को 9 : 3 : 3 : 1 के साथ लिखिए और उपयुक्त वर्ग चुनिए।"),
          formula: `n = \\dfrac{${parts}}{16} N`,
          solution: L(
            S(atLeast ? "Round green (3) + wrinkled yellow (3) + wrinkled green (1) = 7 parts" : "New combinations: round green (3) + wrinkled yellow (3) = 6 parts", `$n = \\dfrac{${parts}}{16} \\cdot ${T16} = ${ans}$`),
            S(atLeast ? "गोल हरे (3) + झुर्रीदार पीले (3) + झुर्रीदार हरे (1) = 7 भाग" : "नए संयोजन: गोल हरे (3) + झुर्रीदार पीले (3) = 6 भाग", `$n = \\dfrac{${parts}}{16} \\cdot ${T16} = ${ans}$`),
          ),
        });
      }
      const wg = r.int(20, 150);
      const target = r.pick(DI.slice(0, 3));
      const ans = wg * target[1];
      return task({
        text: L(
          `In the F2 of Mendel's dihybrid cross (round yellow × wrinkled green), ${wg} seeds were wrinkled green. About how many ${target[0][0]} seeds would you expect?`,
          `मेंडल के द्विसंकर संकरण (गोल पीले × झुर्रीदार हरे) की F2 में ${wg} बीज झुर्रीदार हरे थे। लगभग कितने ${target[0][1]} बीजों की आशा होगी?`,
        ),
        answer: numM(ans, 0, [
          [wg * 16, L("That is the whole F2; take only this class.", "यह पूरी F2 है; केवल यह वर्ग लीजिए।")],
          [wg * (target[1] === 9 ? 3 : 9), L("Check the ratio 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green.", "अनुपात 9 गोल पीले : 3 गोल हरे : 3 झुर्रीदार पीले : 1 झुर्रीदार हरे जाँचिए।")],
          [rd((wg * 16) / target[1], 1), L("Wrinkled green is 1 part; multiply by this class's parts.", "झुर्रीदार हरा 1 भाग है; इस वर्ग के भागों से गुणा कीजिए।")],
        ]),
        data: { given: [`n_{\\text{wg}} = ${wg}`], find: ["n"] },
        hint: L("Wrinkled green is 1 part of 9 : 3 : 3 : 1, so one part is that many seeds.", "झुर्रीदार हरा 9 : 3 : 3 : 1 का 1 भाग है, अतः एक भाग उतने बीज है।"),
        formula: "n = w \\cdot n_{\\text{wg}}",
        solution: L(S(`1 part = ${wg} seeds`, `${cap(target[0][0])}: ${target[1]} parts → $${target[1]} \\cdot ${wg} = ${ans}$`), S(`1 भाग = ${wg} बीज`, `${target[0][1]}: ${target[1]} भाग → $${target[1]} \\cdot ${wg} = ${ans}$`)),
      });
    }
    if (v === 1) {
      const T4 = 4 * r.int(25, 250);
      const tall = (3 * T4) / 4;
      return task({
        text: L(
          `F1 tall pea plants (Tt) are self-pollinated and give ${T4} F2 plants. How many of the tall F2 plants are expected to be pure-breeding (TT)?`,
          `F1 के लंबे मटर के पौधों (Tt) के स्वपरागण से F2 के ${T4} पौधे मिले। F2 के लंबे पौधों में से कितने शुद्ध (TT) होने की आशा है?`,
        ),
        answer: numM(T4 / 4, 0, [
          [tall, L("Not every tall plant is TT; many are Tt.", "हर लंबा पौधा TT नहीं होता; बहुत से Tt होते हैं।")],
          [T4 / 2, L("That is the number of Tt plants.", "यह Tt पौधों की संख्या है।")],
          [rd(tall / 2, 1), L("Among tall plants TT : Tt is 1 : 2, not 1 : 1.", "लंबे पौधों में TT : Tt अनुपात 1 : 2 है, 1 : 1 नहीं।")],
        ]),
        data: { given: [`N = ${T4}`], find: ["N_{TT}"] },
        hint: L("The F2 genotypic ratio is TT : Tt : tt = 1 : 2 : 1.", "F2 का जीनोटाइप अनुपात TT : Tt : tt = 1 : 2 : 1 है।"),
        formula: "N_{TT} = \\dfrac{1}{4} N",
        solution: L(
          S(`Tall: $\\tfrac{3}{4} \\cdot ${T4} = ${tall}$, of which TT is 1 part in 3.`, `$N_{TT} = \\tfrac{1}{4} \\cdot ${T4} = ${T4 / 4}$`),
          S(`लंबे: $\\tfrac{3}{4} \\cdot ${T4} = ${tall}$, जिनमें TT, 3 में से 1 भाग है।`, `$N_{TT} = \\tfrac{1}{4} \\cdot ${T4} = ${T4 / 4}$`),
        ),
      });
    }
    if (w3 < 2) {
      const k = r.int(2, 3);
      const boy = r.int(0, 1);
      const kids = boy ? ["daughters", "बेटियाँ"] : ["sons", "बेटे"];
      return task({
        text: L(`A couple already has ${k} ${kids[0]}. What is the probability that their next child will be a ${boy ? "boy" : "girl"}?`, `एक दंपती के पहले से ${k} ${kids[1]} हैं। उनके अगले बच्चे के ${boy ? "लड़का" : "लड़की"} होने की प्रायिकता क्या है?`),
        answer: fractionM(1, 2, [
          [1 / 2 ** (k + 1), L("Earlier births do not change the next one; each birth is independent.", "पहले के जन्म अगले जन्म को नहीं बदलते; प्रत्येक जन्म स्वतंत्र है।")],
          [1, L("It is not certain: X- and Y-carrying sperms are equally likely each time.", "यह निश्चित नहीं है: हर बार X और Y वाले शुक्राणु समान रूप से संभावित हैं।")],
        ]),
        hint: L("Does the egg or the sperm 'remember' earlier children?", "क्या अंड या शुक्राणु पहले के बच्चों को 'याद' रखते हैं?"),
        solution: L(
          S("Each child gets an X or a Y from the father with equal chance.", "Earlier children do not matter: P = 1/2."),
          S("प्रत्येक बच्चे को पिता से X या Y समान संभावना से मिलता है।", "पहले के बच्चों का कोई प्रभाव नहीं: P = 1/2।"),
        ),
      });
    }
    return task({
      text: L("A couple plans to have two children. What is the probability that they have one boy and one girl, in any order?", "एक दंपती दो बच्चे चाहता है। किसी भी क्रम में एक लड़का और एक लड़की होने की प्रायिकता क्या है?"),
      answer: fractionM(1, 2, [
        [1 / 4, L("Both orders count: boy–girl and girl–boy.", "दोनों क्रम गिने जाते हैं: लड़का–लड़की और लड़की–लड़का।")],
        [1 / 3, L("The four outcomes BB, BG, GB, GG are equally likely; BG and GB are different outcomes.", "चारों परिणाम BB, BG, GB, GG समान रूप से संभावित हैं; BG और GB अलग परिणाम हैं।")],
      ]),
      hint: L("List all equally likely outcomes for two births.", "दो जन्मों के सभी समसंभावी परिणाम लिखिए।"),
      solution: L(
        S("Outcomes: BB, BG, GB, GG, each with probability 1/4.", "One boy and one girl: BG or GB → $\\tfrac{1}{4} + \\tfrac{1}{4} = \\tfrac{1}{2}$"),
        S("परिणाम: BB, BG, GB, GG, प्रत्येक की प्रायिकता 1/4।", "एक लड़का और एक लड़की: BG या GB → $\\tfrac{1}{4} + \\tfrac{1}{4} = \\tfrac{1}{2}$"),
      ),
    });
  },
};

// ---------- Our environment: 10-odstotni zakon, 1 % sončne energije, biološko kopičenje ----------
const CHAINS = [
  [["grass", "घास"], ["grasshopper", "टिड्डा"], ["frog", "मेंढक"], ["snake", "साँप"], ["eagle", "गरुड़"]],
  [["grass", "घास"], ["deer", "हिरण"], ["lion", "शेर"]],
  [["phytoplankton", "पादपप्लवक"], ["zooplankton", "जंतुप्लवक"], ["small fish", "छोटी मछली"], ["large fish", "बड़ी मछली"]],
  [["grass", "घास"], ["rabbit", "खरगोश"], ["fox", "लोमड़ी"]],
  [["plants", "पौधे"], ["caterpillar", "इल्ली"], ["sparrow", "गौरैया"], ["hawk", "बाज़"]],
];
const LVL = [null, ["producers", "उत्पादकों"], ["herbivores (primary consumers)", "शाकाहारियों (प्राथमिक उपभोक्ताओं)"], ["secondary consumers", "द्वितीयक उपभोक्ताओं"], ["tertiary consumers", "तृतीयक उपभोक्ताओं"]];
const ENV_CALC = {
  id: "exg-bio-environment-calc",
  topics: [T("our-environment")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const v = r.int(0, 2);
    if (level === 1) {
      if (v === 0) {
        const ch = r.pick(CHAINS);
        const p = r.int(1, ch.length - 1);
        const arrow = (l) => ch.map((o) => o[l]).join(" → ");
        return task({
          text: L(`In the food chain ${arrow(0)}, at which trophic level is the ${ch[p][0]}?`, `खाद्य शृंखला ${arrow(1)} में ${ch[p][1]} किस पोषी स्तर पर है?`),
          answer: numM(p + 1, 0, [
            [p, L("Producers are the first trophic level; count them too.", "उत्पादक पहला पोषी स्तर हैं; उन्हें भी गिनिए।")],
            [p + 2, L("Count from the producers, starting at 1.", "उत्पादकों से 1 से गिनना आरंभ कीजिए।")],
          ]),
          hint: L("Producers form trophic level 1; each arrow goes one level up.", "उत्पादक पोषी स्तर 1 बनाते हैं; प्रत्येक तीर एक स्तर ऊपर ले जाता है।"),
          solution: L(S(...ch.slice(0, p + 1).map((o, i) => `${i + 1}: ${o[0]}`), `Answer: level ${p + 1}`), S(...ch.slice(0, p + 1).map((o, i) => `${i + 1}: ${o[1]}`), `उत्तर: स्तर ${p + 1}`)),
        });
      }
      if (v === 1) {
        const E0 = r.pick([1000, 2000, 5000, 10000, 20000, 50000]);
        const k = r.int(1, 2);
        const ans = E0 / 10 ** k;
        return task({
          text: L(`The producers of a grassland have ${E0} kJ of energy. Using the 10 % law, how much energy (in kJ) is available to the ${LVL[k + 1][0]}?`, `एक घास-स्थल के उत्पादकों के पास ${E0} kJ ऊर्जा है। 10 % नियम से ${LVL[k + 1][1]} को कितनी ऊर्जा (kJ में) उपलब्ध होगी?`),
          answer: numM(ans, 0, [
            [E0 / 10 ** (k === 1 ? 2 : 1), L("Count the transfers from producers to this level.", "उत्पादकों से इस स्तर तक के स्थानांतरण गिनिए।")],
            [E0 * (1 - 0.1 * k), L("Only 10 % passes on; it is not that 10 % is lost.", "केवल 10 % आगे जाता है; 10 % नष्ट नहीं होता।")],
          ]),
          data: { given: [`E_1 = ${E0}${EUN}`], find: [`E_{${k + 1}}`] },
          hint: L("At each step only about one-tenth of the energy passes on.", "प्रत्येक चरण में ऊर्जा का लगभग दसवाँ भाग ही आगे जाता है।"),
          formula: `E_{${k + 1}} = E_1 \\cdot 0.1^{${k}}`,
          solution: L(S(`Transfers: ${k}`, `$E = ${E0} \\cdot 0.1^{${k}} = ${en(ans)}\\ \\mathrm{kJ}$`), S(`स्थानांतरण: ${k}`, `$E = ${E0} \\cdot 0.1^{${k}} = ${en(ans)}\\ \\mathrm{kJ}$`)),
        });
      }
      const S0 = r.int(2, 9) * 10 ** r.int(4, 6);
      const ans = S0 / 100;
      return task({
        text: L(`Sunlight carrying ${S0} kJ of energy falls on the leaves of a field of plants. Green plants capture about 1 % of it. How much energy (in kJ) do the plants capture?`, `एक खेत के पौधों की पत्तियों पर ${S0} kJ ऊर्जा वाला सूर्य का प्रकाश पड़ता है। हरे पौधे इसका लगभग 1 % ग्रहण करते हैं। पौधे कितनी ऊर्जा (kJ में) ग्रहण करते हैं?`),
        answer: numM(ans, 0, [
          [S0 / 10, L("Plants capture about 1 %, not 10 %.", "पौधे लगभग 1 % ग्रहण करते हैं, 10 % नहीं।")],
          [S0 * 0.99, L("That is the part not captured.", "यह ग्रहण न किया गया भाग है।")],
        ]),
        data: { given: [`E_S = ${S0}${EUN}`, `p = 1\\,\\%`], find: ["E_P"] },
        hint: L("1 % means one-hundredth.", "1 % का अर्थ सौवाँ भाग है।"),
        formula: "E_P = 0.01 \\cdot E_S",
        solution: L(S(`$E_P = 0.01 \\cdot ${S0} = ${en(ans)}\\ \\mathrm{kJ}$`), S(`पौधों द्वारा ग्रहण: $E_P = 0.01 \\cdot ${S0} = ${en(ans)}\\ \\mathrm{kJ}$`)),
      });
    }
    if (level === 2) {
      const vv = r.int(0, 3);
      if (vv === 0) {
        const S0 = r.int(2, 9) * 10 ** r.int(5, 6);
        const k = r.int(1, 2);
        const ans = S0 * 0.01 * 0.1 ** k;
        return task({
          text: L(`Sunlight with ${S0} kJ of energy falls on a field. Plants capture about 1 % of it, and then the 10 % law applies. How much energy (in kJ) reaches the ${LVL[k + 1][0]}?`, `एक खेत पर ${S0} kJ ऊर्जा वाला सूर्य का प्रकाश पड़ता है। पौधे इसका लगभग 1 % ग्रहण करते हैं, फिर 10 % नियम लागू होता है। ${LVL[k + 1][1]} तक कितनी ऊर्जा (kJ में) पहुँचती है?`),
          answer: numM(rd(ans, 4), 0, [
            [rd(S0 * 0.1 ** k, 4), L("First take 1 % of the sunlight for the producers.", "पहले उत्पादकों के लिए सूर्य प्रकाश का 1 % लीजिए।")],
            [rd(S0 * 0.01, 4), L("That is the energy of the producers; apply the 10 % law.", "यह उत्पादकों की ऊर्जा है; 10 % नियम लगाइए।")],
            [rd(S0 * 0.01 * 0.1 ** (k + 1), 4), L("Count the transfers starting from the producers.", "उत्पादकों से आरंभ करके स्थानांतरण गिनिए।")],
          ]),
          data: { given: [`E_S = ${S0}${EUN}`], find: [`E_{${k + 1}}`] },
          hint: L("Sunlight → producers (1 %), then each further step 10 %.", "सूर्य प्रकाश → उत्पादक (1 %), फिर प्रत्येक अगला चरण 10 %।"),
          formula: `E_{${k + 1}} = E_S \\cdot 0.01 \\cdot 0.1^{${k}}`,
          solution: L(
            S(`Producers: $0.01 \\cdot ${S0} = ${en(S0 * 0.01)}\\ \\mathrm{kJ}$`, `$E = ${en(S0 * 0.01)} \\cdot 0.1^{${k}} = ${en(rd(ans, 4))}\\ \\mathrm{kJ}$`),
            S(`उत्पादक: $0.01 \\cdot ${S0} = ${en(S0 * 0.01)}\\ \\mathrm{kJ}$`, `$E = ${en(S0 * 0.01)} \\cdot 0.1^{${k}} = ${en(rd(ans, 4))}\\ \\mathrm{kJ}$`),
          ),
        });
      }
      if (vv === 1) {
        const E = r.pick([5, 10, 20, 25, 40, 50, 80]);
        const k = r.int(2, 3);
        const ans = E * 10 ** k;
        return task({
          text: L(`In a food chain, the ${LVL[k + 1][0]} get ${E} kJ of energy. Using the 10 % law, how much energy (in kJ) must the producers have had?`, `एक खाद्य शृंखला में ${LVL[k + 1][1]} को ${E} kJ ऊर्जा मिलती है। 10 % नियम से उत्पादकों के पास कितनी ऊर्जा (kJ में) रही होगी?`),
          answer: numM(ans, 0, [
            [E * 10 ** (k + 1), L("Count the transfers: producers are level 1.", "स्थानांतरण गिनिए: उत्पादक स्तर 1 हैं।")],
            [E / 10 ** k, L("Lower levels have more energy: multiply by 10 per step.", "निचले स्तरों पर ऊर्जा अधिक होती है: प्रति चरण 10 से गुणा कीजिए।")],
            [E * 10 * k, L(`Multiply by 10 for each step (10^${k}), not by 10 × ${k}.`, `प्रत्येक चरण में 10 से गुणा कीजिए (10^${k}), 10 × ${k} से नहीं।`)],
          ]),
          data: { given: [`E_{${k + 1}} = ${E}${EUN}`], find: ["E_1"] },
          hint: L("Go down the chain: each step down has 10 times more energy.", "शृंखला में नीचे जाइए: प्रत्येक निचले चरण पर 10 गुना ऊर्जा होती है।"),
          formula: `E_1 = E_{${k + 1}} \\cdot 10^{${k}}`,
          solution: L(S(`Transfers: ${k}`, `$E_1 = ${E} \\cdot 10^{${k}} = ${ans}\\ \\mathrm{kJ}$`), S(`स्थानांतरण: ${k}`, `$E_1 = ${E} \\cdot 10^{${k}} = ${ans}\\ \\mathrm{kJ}$`)),
        });
      }
      if (vv === 2) {
        const E1 = 1000 * r.int(20, 90);
        const pct = r.int(80, 150) / 10;
        const E2 = rd((E1 * pct) / 100);
        return task({
          text: L(`In a pond, producers fix ${E1} kJ of energy and the herbivores that eat them gain ${E2} kJ. What percentage of the energy is passed on?${roundToL(1, lang)}`, `एक तालाब में उत्पादक ${E1} kJ ऊर्जा स्थिर करते हैं और उन्हें खाने वाले शाकाहारी ${E2} kJ प्राप्त करते हैं। ऊर्जा का कितना प्रतिशत आगे जाता है?${roundToL(1, lang)}`),
          answer: numM(pct, 1, [
            [rd((E1 / E2) * 100, 1), L("Divide the herbivores' energy by the producers' energy.", "शाकाहारियों की ऊर्जा को उत्पादकों की ऊर्जा से भाग दीजिए।")],
            [rd(100 - pct, 1), L("That is the percentage not passed on.", "यह आगे न गया प्रतिशत है।")],
            [10, L("Use the data given; the 10 % law is only an average.", "दिए गए आँकड़े लीजिए; 10 % नियम केवल औसत है।")],
          ]),
          data: { given: [`E_1 = ${E1}${EUN}`, `E_2 = ${E2}${EUN}`], find: ["p"] },
          hint: L("Compare the energy at the higher level with that at the lower level.", "ऊपरी स्तर की ऊर्जा की तुलना निचले स्तर की ऊर्जा से कीजिए।"),
          formula: "p = \\dfrac{E_2}{E_1} \\cdot 100\\,\\%",
          solution: L(S(`$p = \\dfrac{${E2}}{${E1}} \\cdot 100\\,\\% = ${en(pct, 1)}\\,\\%$`, "This is close to the average of 10 %."), S(`$p = \\dfrac{${E2}}{${E1}} \\cdot 100\\,\\% = ${en(pct, 1)}\\,\\%$`, "यह 10 % के औसत के निकट है।")),
        });
      }
      const c = r.pick([0.002, 0.005, 0.01, 0.02]);
      const x = r.pick([10, 20, 50]);
      const y = r.pick([5, 10, 20]);
      const ans = rd(c * x * y, 4);
      return task({
        text: L(`A pesticide is present in lake water at ${en(c)} ppm. Its concentration in zooplankton is ${x} times that in the water, and in fish ${y} times that in zooplankton. What is its concentration in the fish (in ppm)?`, `एक झील के जल में एक पीड़कनाशी ${en(c)} ppm है। जंतुप्लवक में इसकी सांद्रता जल की ${x} गुनी और मछली में जंतुप्लवक की ${y} गुनी है। मछली में इसकी सांद्रता (ppm में) कितनी है?`),
        answer: numM(ans, 3, [
          [rd(c * (x + y), 4), L("The factors multiply at each step; do not add them.", "प्रत्येक चरण में गुणक गुणा होते हैं; उन्हें जोड़िए नहीं।")],
          [rd(c * x, 4), L("That is the zooplankton; go one more step to the fish.", "यह जंतुप्लवक है; मछली तक एक चरण और आगे जाइए।")],
          [rd(c / (x * y), 6), L("Concentration rises up the chain (biological magnification).", "शृंखला में ऊपर जाने पर सांद्रता बढ़ती है (जैव आवर्धन)।")],
        ]),
        data: { given: [`c_0 = ${en(c)}\\ \\mathrm{ppm}`, `f_1 = ${x}`, `f_2 = ${y}`], find: ["c_2"] },
        hint: L("Biological magnification: multiply by the factor at each step.", "जैव आवर्धन: प्रत्येक चरण पर गुणक से गुणा कीजिए।"),
        formula: "c_2 = c_0 \\cdot f_1 \\cdot f_2",
        solution: L(S(`Zooplankton: $${en(c)} \\cdot ${x} = ${en(rd(c * x, 4))}\\ \\mathrm{ppm}$`, `Fish: $${en(rd(c * x, 4))} \\cdot ${y} = ${en(ans)}\\ \\mathrm{ppm}$`), S(`जंतुप्लवक: $${en(c)} \\cdot ${x} = ${en(rd(c * x, 4))}\\ \\mathrm{ppm}$`, `मछली: $${en(rd(c * x, 4))} \\cdot ${y} = ${en(ans)}\\ \\mathrm{ppm}$`)),
      });
    }
    // Raven 3
    const vv = r.int(0, 3);
    if (vv === 0) {
      const E = r.pick([2, 4, 5, 8, 10, 15, 20, 25]);
      const k = r.int(1, 2);
      const ans = E / (0.01 * 0.1 ** k);
      return task({
        text: L(`The ${LVL[k + 1][0]} of a field receive ${E} kJ of energy. Plants capture about 1 % of the sunlight, and the 10 % law applies after that. How much solar energy (in kJ) must fall on the field?`, `एक खेत के ${LVL[k + 1][1]} को ${E} kJ ऊर्जा मिलती है। पौधे सूर्य प्रकाश का लगभग 1 % ग्रहण करते हैं, उसके बाद 10 % नियम लागू होता है। खेत पर कितनी सौर ऊर्जा (kJ में) पड़नी चाहिए?`),
        answer: numM(rd(ans), 0, [
          [rd(E * 10 ** k), L("That is the producers' energy; they hold only 1 % of the sunlight.", "यह उत्पादकों की ऊर्जा है; उनमें सूर्य प्रकाश का केवल 1 % होता है।")],
          [rd(E * 10 ** (k + 1)), L("Producers capture 1 %, i.e. multiply by 100 for that step, not 10.", "उत्पादक 1 % ग्रहण करते हैं, अर्थात उस चरण में 100 से गुणा कीजिए, 10 से नहीं।")],
          [rd(E * 100), L(`Include all ${k} transfer${k > 1 ? "s" : ""} of the 10 % law as well.`, `10 % नियम के सभी ${k} स्थानांतरण भी शामिल कीजिए।`)],
        ]),
        data: { given: [`E_{${k + 1}} = ${E}${EUN}`], find: ["E_S"] },
        hint: L("Work backwards: ×10 for each consumer step, then ×100 for the 1 % captured by plants.", "पीछे की ओर चलिए: प्रत्येक उपभोक्ता चरण के लिए ×10, फिर पौधों के 1 % के लिए ×100।"),
        formula: `E_S = \\dfrac{E_{${k + 1}}}{0.01 \\cdot 0.1^{${k}}}`,
        solution: L(
          S(`Producers: $${E} \\cdot 10^{${k}} = ${E * 10 ** k}\\ \\mathrm{kJ}$`, `Sunlight: $${E * 10 ** k} \\cdot 100 = ${en(rd(ans))}\\ \\mathrm{kJ}$`),
          S(`उत्पादक: $${E} \\cdot 10^{${k}} = ${E * 10 ** k}\\ \\mathrm{kJ}$`, `सूर्य प्रकाश: $${E * 10 ** k} \\cdot 100 = ${en(rd(ans))}\\ \\mathrm{kJ}$`),
        ),
      });
    }
    if (vv === 1) {
      const P = r.pick([8000, 10000, 12000]);
      const m = r.int(5, 40);
      const E = P * 10 * m;
      const ans = 9 * m;
      return task({
        text: L(`A field gives grain with ${E} kJ of energy. It can be eaten by people directly, or fed to goats whose meat people eat (10 % law). One person needs ${P} kJ a day. How many more person-days of food does eating the grain directly give?`, `एक खेत से ${E} kJ ऊर्जा वाला अनाज मिलता है। इसे लोग सीधे खा सकते हैं, या बकरियों को खिलाकर उनका मांस खा सकते हैं (10 % नियम)। एक व्यक्ति को प्रतिदिन ${P} kJ चाहिए। अनाज सीधे खाने से भोजन के कितने अधिक व्यक्ति-दिन मिलते हैं?`),
        answer: numM(ans, 0, [
          [10 * m, L("That is for grain alone; subtract what the goat meat gives.", "यह केवल अनाज का है; बकरी के मांस से मिलने वाला घटाइए।")],
          [m, L("That is what the goat meat gives; find the difference.", "यह बकरी के मांस से मिलता है; अंतर ज्ञात कीजिए।")],
          [10, L("Find the difference in person-days, not the ratio.", "व्यक्ति-दिनों का अंतर ज्ञात कीजिए, अनुपात नहीं।")],
        ]),
        data: { given: [`E = ${E}${EUN}`, `P = ${P}\\ \\mathrm{kJ/day}`], find: ["\\Delta n"] },
        hint: L("Going through the goats costs one extra trophic step.", "बकरियों से होकर जाने में एक अतिरिक्त पोषी चरण लगता है।"),
        formula: "\\Delta n = \\dfrac{E}{P} - \\dfrac{0.1\\,E}{P}",
        solution: L(
          S(`Grain: $${E} \\div ${P} = ${10 * m}$ person-days`, `Goat meat: $0.1 \\cdot ${E} = ${E / 10}$ kJ → $${m}$ person-days`, `$\\Delta n = ${10 * m} - ${m} = ${ans}$`),
          S(`अनाज: $${E} \\div ${P} = ${10 * m}$ व्यक्ति-दिन`, `बकरी का मांस: $0.1 \\cdot ${E} = ${E / 10}$ kJ → $${m}$ व्यक्ति-दिन`, `$\\Delta n = ${10 * m} - ${m} = ${ans}$`),
        ),
      });
    }
    if (vv === 2) {
      const m = r.pick([5, 10, 20]);
      const k = r.int(2, 3);
      const c = r.pick([0.001, 0.002, 0.005]);
      const top = rd(c * m ** k, 6);
      return task({
        text: L(`A chemical is ${en(c)} ppm in a lake and ${en(top)} ppm in birds ${k} trophic steps above the water. If the concentration rises by the same factor at every step, what is that factor?`, `एक रसायन झील में ${en(c)} ppm और जल से ${k} पोषी चरण ऊपर के पक्षियों में ${en(top)} ppm है। यदि प्रत्येक चरण में सांद्रता समान गुणक से बढ़ती है, तो वह गुणक क्या है?`),
        answer: numM(m, 1, [
          [rd(top / c / k, 1), L("The factors multiply; take a root, do not divide by the number of steps.", "गुणक गुणा होते हैं; मूल लीजिए, चरणों की संख्या से भाग न दीजिए।")],
          [rd(top / c, 1), L(`That is the total increase over ${k} steps.`, `यह ${k} चरणों की कुल वृद्धि है।`)],
        ]),
        data: { given: [`c_0 = ${en(c)}\\ \\mathrm{ppm}`, `c_{${k}} = ${en(top)}\\ \\mathrm{ppm}`], find: ["f"] },
        hint: L("Find the total increase c_top ÷ c₀ first.", "पहले कुल वृद्धि c_top ÷ c₀ ज्ञात कीजिए।"),
        formula: `f = \\sqrt[${k}]{\\dfrac{c_{${k}}}{c_0}}`,
        solution: L(S(`Total: $${en(top)} \\div ${en(c)} = ${m ** k}$`, `$f = \\sqrt[${k}]{${m ** k}} = ${m}$`), S(`कुल वृद्धि: $${en(top)} \\div ${en(c)} = ${m ** k}$`, `$f = \\sqrt[${k}]{${m ** k}} = ${m}$`)),
      });
    }
    const E1 = r.pick([1, 2, 5]) * 10 ** r.int(5, 6);
    const X = r.pick([50, 100, 200, 500]);
    let lv = 1;
    while (E1 / 10 ** lv >= X) lv++;
    // lv = število ravni, pri katerih je energija vsaj X
    return task({
      text: L(`The producers of an ecosystem fix ${E1} kJ. A trophic level can be supported only if it receives at least ${X} kJ. Using the 10 % law, how many trophic levels (including the producers) can this food chain have?`, `एक पारितंत्र के उत्पादक ${E1} kJ ऊर्जा स्थिर करते हैं। कोई पोषी स्तर तभी टिक सकता है जब उसे कम से कम ${X} kJ मिले। 10 % नियम से इस खाद्य शृंखला में (उत्पादकों सहित) कितने पोषी स्तर हो सकते हैं?`),
      answer: numM(lv, 0, [
        [lv - 1, L("Count the producers as level 1 as well.", "उत्पादकों को भी स्तर 1 के रूप में गिनिए।")],
        [lv + 1, L(`Check the last level: it must receive at least ${X} kJ.`, `अंतिम स्तर जाँचिए: उसे कम से कम ${X} kJ मिलना चाहिए।`)],
      ]),
      data: { given: [`E_1 = ${E1}${EUN}`, `E_{\\min} = ${X}${EUN}`], find: ["n"] },
      hint: L("Divide by 10 level by level until the energy falls below the limit.", "स्तर-दर-स्तर 10 से भाग दीजिए, जब तक ऊर्जा सीमा से नीचे न आ जाए।"),
      formula: "E_n = E_1 \\cdot 0.1^{\\,n-1}",
      solution: L(
        S(...Array.from({ length: lv + 1 }, (_, i) => `Level ${i + 1}: ${en(E1 / 10 ** i)} kJ ${E1 / 10 ** i >= X ? "✓" : "✗"}`), `Answer: ${lv} levels`),
        S(...Array.from({ length: lv + 1 }, (_, i) => `स्तर ${i + 1}: ${en(E1 / 10 ** i)} kJ ${E1 / 10 ** i >= X ? "✓" : "✗"}`), `उत्तर: ${lv} स्तर`),
      ),
    });
  },
};

// ---------- Plant anatomy and morphology: cvetne formule in štetje ----------
const FAM = [
  { n: ["Fabaceae (pea family)", "फैबेसी (मटर कुल)"], f: "\\%\\ K_{(5)}\\ C_{1+2+(2)}\\ A_{(9)+1}\\ \\underline{G}_{1}", sym: ["zygomorphic", "एकव्याससममित"], K: 5, C: 5, A: 10, G: 1, note: ["(9) + 1 means nine fused stamens and one free stamen (diadelphous).", "(9) + 1 का अर्थ नौ जुड़े और एक मुक्त पुंकेसर (द्विसंघी) है।"] },
  { n: ["Solanaceae (potato family)", "सोलेनेसी (आलू कुल)"], f: "\\oplus\\ K_{(5)}\\ C_{(5)}\\ A_{5}\\ \\underline{G}_{(2)}", sym: ["actinomorphic", "त्रिज्यासममित"], K: 5, C: 5, A: 5, G: 2, note: ["Brackets show fusion: (5) means five fused parts.", "कोष्ठक संलयन दर्शाते हैं: (5) का अर्थ पाँच जुड़े भाग है।"] },
  { n: ["Liliaceae (lily family)", "लिलिएसी (लिली कुल)"], f: "\\mathrm{Br}\\ \\oplus\\ P_{(3+3)}\\ A_{3+3}\\ \\underline{G}_{(3)}", sym: ["actinomorphic", "त्रिज्यासममित"], K: 0, C: 0, P: 6, A: 6, G: 3, note: ["P(3+3) is a perianth of six tepals in two whorls of three.", "P(3+3) तीन-तीन के दो चक्रों में छह परिदल पत्रों का परिदलपुंज है।"] },
];
const WHORL = {
  K: ["sepals", "बाह्यदल"],
  C: ["petals", "दल"],
  P: ["tepals (perianth parts)", "परिदल पत्र"],
  A: ["stamens", "पुंकेसर"],
  G: ["carpels", "अंडप"],
};
const PA_CATS = [
  {
    q: ["How many of the following are dead at maturity?", "निम्नलिखित में से कितने परिपक्व अवस्था में मृत होते हैं?"],
    yes: yn([["tracheids", "वाहिनिकाएँ"], ["vessels", "वाहिकाएँ"], ["xylem fibres", "जाइलम रेशे"], ["sclereids", "दृढ़कोशिकाएँ"], ["phloem fibres", "फ्लोएम रेशे"], ["sclerenchyma fibres", "दृढ़ोतक रेशे"]], "are dead at maturity", "मृत कोशिकाओं से बना तत्त्व"),
    no: [
      ["parenchyma", "मृदूतक", "is living", "जीवित ऊतक"],
      ["collenchyma", "स्थूलकोणोतक", "is living", "जीवित ऊतक"],
      ["companion cells", "सहचर कोशिकाएँ", "are living, with a nucleus", "केंद्रक वाली जीवित कोशिका"],
      ["sieve tube elements", "चालनी नलिका तत्त्व", "are living, though mature ones lack a nucleus", "जीवित तत्त्व, यद्यपि परिपक्व होने पर केंद्रकहीन"],
      ["xylem parenchyma", "जाइलम मृदूतक", "is living", "जीवित ऊतक"],
      ["phloem parenchyma", "फ्लोएम मृदूतक", "is living", "जीवित ऊतक"],
    ],
  },
  {
    q: ["How many of the following have axile placentation?", "निम्नलिखित में से कितनों में स्तंभीय बीजांडन्यास होता है?"],
    yes: yn([["china rose", "गुड़हल"], ["tomato", "टमाटर"], ["lemon", "नींबू"]], "has axile placentation", "स्तंभीय बीजांडन्यास वाला पौधा"),
    no: [
      ["pea", "मटर", "has marginal placentation", "सीमांत बीजांडन्यास वाला पौधा"],
      ["mustard", "सरसों", "has parietal placentation", "भित्तीय बीजांडन्यास वाला पौधा"],
      ["Argemone", "आर्जीमोन", "has parietal placentation", "भित्तीय बीजांडन्यास वाला पौधा"],
      ["Dianthus", "डायंथस", "has free central placentation", "मुक्त स्तंभीय बीजांडन्यास वाला पौधा"],
      ["Primrose", "प्रिमरोज़", "has free central placentation", "मुक्त स्तंभीय बीजांडन्यास वाला पौधा"],
      ["sunflower", "सूरजमुखी", "has basal placentation", "आधारी बीजांडन्यास वाला पौधा"],
      ["marigold", "गेंदा", "has basal placentation", "आधारी बीजांडन्यास वाला पौधा"],
    ],
  },
  {
    q: ["How many of the following have epigynous flowers (inferior ovary)?", "निम्नलिखित में से कितनों में अधिजायांगी पुष्प (अधोवर्ती अंडाशय) होते हैं?"],
    yes: yn([["guava", "अमरूद"], ["cucumber", "खीरा"], ["ray florets of sunflower", "सूरजमुखी के रश्मि पुष्पक"]], "is epigynous", "अधिजायांगी पुष्प"),
    no: [
      ["mustard", "सरसों", "is hypogynous", "अधोजायांगी पुष्प"],
      ["china rose", "गुड़हल", "is hypogynous", "अधोजायांगी पुष्प"],
      ["brinjal", "बैंगन", "is hypogynous", "अधोजायांगी पुष्प"],
      ["plum", "आलूबुखारा", "is perigynous", "परिजायांगी पुष्प"],
      ["rose", "गुलाब", "is perigynous", "परिजायांगी पुष्प"],
      ["peach", "आड़ू", "is perigynous", "परिजायांगी पुष्प"],
    ],
  },
  {
    q: ["How many of the following show twisted aestivation?", "निम्नलिखित में से कितनों में व्यावर्तित पुष्पदल विन्यास होता है?"],
    yes: yn([["china rose", "गुड़हल"], ["lady's finger", "भिंडी"], ["cotton", "कपास"]], "has twisted aestivation", "व्यावर्तित पुष्पदल विन्यास वाला पौधा"),
    no: [
      ["Calotropis", "आक (कैलोट्रोपिस)", "has valvate aestivation", "कोरस्पर्शी पुष्पदल विन्यास वाला पौधा"],
      ["Cassia", "केसिया", "has imbricate aestivation", "कोरछादी पुष्पदल विन्यास वाला पौधा"],
      ["gulmohur", "गुलमोहर", "has imbricate aestivation", "कोरछादी पुष्पदल विन्यास वाला पौधा"],
      ["pea", "मटर", "has vexillary aestivation", "ध्वजिक पुष्पदल विन्यास वाला पौधा"],
      ["bean", "सेम", "has vexillary aestivation", "ध्वजिक पुष्पदल विन्यास वाला पौधा"],
    ],
  },
];
const PLANT_CALC = {
  id: "exg-bio-plant-anatomy-calc",
  topics: [T("plant-anatomy-and-morphology")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const mode = r.int(0, 2);
    if (level > 1 && mode === 0) return countCat(r, L, r.pick(PA_CATS), level + 3);
    const fam = r.pick(FAM);
    const parts = fam.P ? ["P", "A", "G"] : ["K", "C", "A", "G"];
    const intro = L(`The floral formula of ${fam.n[0]} is $${fam.f}$ (${fam.sym[0]}, bisexual flower).`, `${fam.n[1]} का पुष्प सूत्र $${fam.f}$ है (${fam.sym[1]}, द्विलिंगी पुष्प)।`);
    if (level === 1) {
      const w = r.pick(parts);
      const ans = fam[w];
      const tot = parts.reduce((a, x) => a + fam[x], 0);
      const oth = w === "G" ? "A" : "G";
      const wrong = [
        ...(fam.A === 10 && w === "A" ? [[9, L("Add the free stamen: (9) + 1.", "मुक्त पुंकेसर भी जोड़िए: (9) + 1।")]] : []),
        ...(fam.A === 10 && w === "C" ? [[3, L("Count every petal: 1 + 2 + 2; the bracket holds two keel petals.", "प्रत्येक दल गिनिए: 1 + 2 + 2; कोष्ठक में दो नौतल दल हैं।")]] : []),
        ...(fam.P && w !== "G" ? [[3, L("3 + 3 means two whorls of three: add them.", "3 + 3 का अर्थ तीन-तीन के दो चक्र हैं: जोड़िए।")]] : []),
        [fam[oth], L(`That is the number of ${WHORL[oth][0]} (${oth}).`, `यह ${WHORL[oth][1]} (${oth}) की संख्या है।`)],
        [tot, L(`That is all whorls together; read only the ${w} part.`, `यह सभी चक्रों का योग है; केवल ${w} भाग पढ़िए।`)],
      ];
      return task({
        text: L(`${intro} How many ${WHORL[w][0]} does one flower have?`, `${intro} एक पुष्प में कितने ${WHORL[w][1]} होते हैं?`),
        answer: numM(ans, 0, wrong),
        hint: L(`Find the letter ${w} in the formula and read its subscript; brackets mean the parts are fused.`, `सूत्र में अक्षर ${w} खोजिए और उसका पादांक पढ़िए; कोष्ठक का अर्थ है कि भाग जुड़े हुए हैं।`),
        solution: L(S(`${w} = ${WHORL[w][0]}`, fam.note[0], `Answer: ${ans}`), S(`${w} = ${WHORL[w][1]}`, fam.note[1], `उत्तर: ${ans}`)),
      });
    }
    if (level === 2) {
      const total = parts.reduce((a, w) => a + fam[w], 0);
      return task({
        text: L(`${intro} How many floral parts (all whorls together) does one flower have?`, `${intro} एक पुष्प में (सभी चक्रों को मिलाकर) कुल कितने पुष्पीय भाग होते हैं?`),
        answer: numM(total, 0, [
          [total - fam.G, L("Include the carpels of the gynoecium as well.", "जायांग के अंडप भी शामिल कीजिए।")],
          fam.A === 10
            ? [total - 2, L("C1+2+(2) is five petals: 1 + 2 + 2.", "C1+2+(2) पाँच दल हैं: 1 + 2 + 2।")]
            : fam.P
              ? [total - 6, L("3 + 3 means six parts in two whorls of three.", "3 + 3 का अर्थ तीन-तीन के दो चक्रों में छह भाग है।")]
              : [fam.K + fam.C, L("Count the stamens and carpels too.", "पुंकेसर और अंडप भी गिनिए।")],
        ]),
        hint: L("Add the numbers of every whorl; expand sums such as 3 + 3 or (9) + 1.", "प्रत्येक चक्र की संख्या जोड़िए; 3 + 3 या (9) + 1 जैसे योग पूरे कीजिए।"),
        solution: L(S(...parts.map((w) => `${WHORL[w][0]}: ${fam[w]}`), `Total: $${parts.map((w) => fam[w]).join(" + ")} = ${total}$`), S(...parts.map((w) => `${WHORL[w][1]}: ${fam[w]}`), `कुल: $${parts.map((w) => fam[w]).join(" + ")} = ${total}$`)),
      });
    }
    const m = r.int(5, 30);
    const ans = m * (fam.A - fam.G);
    return task({
      text: L(`${intro} A plant bears ${m} such flowers. How many more stamens than carpels does it have altogether?`, `${intro} एक पौधे पर ऐसे ${m} पुष्प हैं। सब मिलाकर उसमें अंडपों से कितने अधिक पुंकेसर हैं?`),
      answer: numM(ans, 0, [
        [m * (fam.A + fam.G), L("Find the difference, not the sum.", "योग नहीं, अंतर ज्ञात कीजिए।")],
        [fam.A - fam.G, L(`That is for one flower; there are ${m}.`, `यह एक पुष्प के लिए है; पुष्प ${m} हैं।`)],
        [m * fam.A, L("Subtract the carpels.", "अंडप घटाइए।")],
      ]),
      data: { given: [`m = ${m}`], find: ["\\Delta"] },
      hint: L("Read the stamens (A) and carpels (G) per flower first.", "पहले प्रति पुष्प पुंकेसर (A) और अंडप (G) पढ़िए।"),
      formula: "\\Delta = m\\,(A - G)",
      solution: L(S(`Per flower: ${fam.A} stamens, ${fam.G} carpel${fam.G > 1 ? "s" : ""}`, `$\\Delta = ${m} \\cdot (${fam.A} - ${fam.G}) = ${ans}$`), S(`प्रति पुष्प: ${fam.A} पुंकेसर, ${fam.G} अंडप`, `$\\Delta = ${m} \\cdot (${fam.A} - ${fam.G}) = ${ans}$`)),
    });
  },
};

// ---------- Microbes: BPK in štetje ----------
const MB_CATS = [
  {
    q: ["How many of the following are used as biofertilisers?", "निम्नलिखित में से कितने जैव उर्वरक के रूप में प्रयुक्त होते हैं?"],
    yes: [
      ["Rhizobium", "राइज़ोबियम", "fixes nitrogen in legume root nodules", "लेग्यूम की जड़ ग्रंथिकाओं में नाइट्रोजन स्थिर करने वाला जीवाणु"],
      ["Azotobacter", "ऐज़ोटोबैक्टर", "is a free-living nitrogen-fixing bacterium", "मुक्तजीवी नाइट्रोजन-स्थिरीकारी जीवाणु"],
      ["Azospirillum", "ऐज़ोस्पाइरिलम", "is a free-living nitrogen-fixing bacterium", "मुक्तजीवी नाइट्रोजन-स्थिरीकारी जीवाणु"],
      ["Glomus", "ग्लोमस", "is a mycorrhizal fungus that supplies phosphorus", "फ़ॉस्फ़ोरस देने वाला कवकमूल कवक"],
      ["Anabaena", "ऐनाबीना", "is a nitrogen-fixing cyanobacterium", "नाइट्रोजन-स्थिरीकारी सायनोबैक्टीरियम"],
      ["Nostoc", "नॉस्टॉक", "is a nitrogen-fixing cyanobacterium", "नाइट्रोजन-स्थिरीकारी सायनोबैक्टीरियम"],
    ],
    no: [
      ["Bacillus thuringiensis", "बैसिलस थुरिंजिएंसिस", "is a biocontrol agent against caterpillars", "इल्लियों के विरुद्ध जैव नियंत्रण कारक"],
      ["Nucleopolyhedrovirus", "न्यूक्लियोपॉलीहेड्रोवायरस", "is a biocontrol agent against insects", "कीटों के विरुद्ध जैव नियंत्रण कारक"],
      ["Methanobacterium", "मीथेनोबैक्टीरियम", "produces methane in biogas plants", "बायोगैस में मीथेन बनाने वाला जीवाणु"],
      ["Aspergillus niger", "ऐस्परजिलस नाइगर", "is used to make citric acid", "सिट्रिक अम्ल बनाने वाला कवक"],
      ["Penicillium notatum", "पेनिसिलियम नोटेटम", "is the source of penicillin", "पेनिसिलिन का स्रोत कवक"],
    ],
  },
  {
    q: ["How many of the following are used as biocontrol agents?", "निम्नलिखित में से कितने जैव नियंत्रण कारक के रूप में प्रयुक्त होते हैं?"],
    yes: [
      ["Bacillus thuringiensis", "बैसिलस थुरिंजिएंसिस", "kills butterfly caterpillars", "तितली की इल्लियों को मारने वाला जीवाणु"],
      ["Trichoderma", "ट्राइकोडर्मा", "controls plant pathogens", "पादप रोगजनकों को नियंत्रित करने वाला कवक"],
      ["Nucleopolyhedrovirus", "न्यूक्लियोपॉलीहेड्रोवायरस", "is a species-specific baculovirus against insects", "कीटों के विरुद्ध जाति-विशिष्ट बैक्युलोवायरस"],
      ["the ladybird", "लेडीबर्ड", "eats aphids", "माहू (ऐफ़िड) खाने वाला कीट"],
      ["the dragonfly", "ड्रैगनफ़्लाई", "eats mosquitoes", "मच्छर खाने वाला कीट"],
    ],
    no: [
      ["Rhizobium", "राइज़ोबियम", "is a biofertiliser", "जैव उर्वरक"],
      ["Glomus", "ग्लोमस", "is a biofertiliser (mycorrhiza)", "जैव उर्वरक (कवकमूल)"],
      ["Anabaena", "ऐनाबीना", "is a biofertiliser", "जैव उर्वरक"],
      ["Methanobacterium", "मीथेनोबैक्टीरियम", "produces biogas", "बायोगैस बनाने वाला जीवाणु"],
      ["Lactobacillus", "लैक्टोबैसिलस", "turns milk into curd", "दूध से दही बनाने वाला जीवाणु"],
    ],
  },
  {
    q: ["How many of the following products are made with the help of bacteria?", "निम्नलिखित में से कितने उत्पाद जीवाणुओं की सहायता से बनते हैं?"],
    yes: [
      ["curd", "दही", "is made by Lactobacillus, a bacterium", "लैक्टोबैसिलस (जीवाणु) से बना उत्पाद"],
      ["acetic acid", "ऐसीटिक अम्ल", "is made by Acetobacter aceti, a bacterium", "ऐसीटोबैक्टर ऐसीटाई (जीवाणु) से बना उत्पाद"],
      ["butyric acid", "ब्यूटिरिक अम्ल", "is made by Clostridium butylicum, a bacterium", "क्लोस्ट्रीडियम ब्यूटायलिकम (जीवाणु) से बना उत्पाद"],
      ["streptokinase", "स्ट्रेप्टोकाइनेज़", "comes from Streptococcus, a bacterium", "स्ट्रेप्टोकोकस (जीवाणु) से मिलने वाला उत्पाद"],
      ["the batter for idli and dosa", "इडली और डोसा का घोल", "is fermented by bacteria", "जीवाणुओं द्वारा किण्वित उत्पाद"],
    ],
    no: [
      ["citric acid", "सिट्रिक अम्ल", "is made by Aspergillus niger, a fungus", "ऐस्परजिलस नाइगर (कवक) से बना उत्पाद"],
      ["statins", "स्टैटिन", "come from the yeast Monascus purpureus", "मोनास्कस परप्यूरियस (यीस्ट) से बना उत्पाद"],
      ["cyclosporin A", "साइक्लोस्पोरिन A", "comes from the fungus Trichoderma polysporum", "ट्राइकोडर्मा पॉलीस्पोरम (कवक) से बना उत्पाद"],
      ["penicillin", "पेनिसिलिन", "comes from the mould Penicillium notatum", "पेनिसिलियम नोटेटम (फफूँद) से बना उत्पाद"],
      ["ethanol", "इथेनॉल", "is made by Saccharomyces cerevisiae, a yeast", "सैकेरोमाइसीज़ सेरेविसी (यीस्ट) से बना उत्पाद"],
    ],
  },
];
const MICROBE_CALC = {
  id: "exg-bio-microbes-calc",
  topics: [T("microbes-in-human-welfare")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const mode = r.int(0, 2);
    if (mode === 0) return countCat(r, L, r.pick(MB_CATS), level + 3);
    const X = 10 * r.int(15, 45);
    if (level === 1) {
      const Y = r.int(8, 40);
      const ans = ((X - Y) / X) * 100;
      return task({
        text: L(`Sewage entering a treatment plant has a BOD of ${X} mg/L. After treatment the effluent has a BOD of ${Y} mg/L. By what percentage has the BOD been reduced?${roundToL(1, lang)}`, `उपचार संयंत्र में आने वाले वाहित मल का BOD ${X} mg/L है। उपचार के बाद बहिःस्राव का BOD ${Y} mg/L है। BOD कितने प्रतिशत घटा?${roundToL(1, lang)}`),
        answer: numM(ans, 1, [
          [(Y / X) * 100, L("That is the BOD left, as a percentage; find the part removed.", "यह बचे BOD का प्रतिशत है; हटाया गया भाग ज्ञात कीजिए।")],
          [X - Y, L("That is the fall in mg/L; express it as a percentage of the starting BOD.", "यह mg/L में कमी है; इसे प्रारंभिक BOD के प्रतिशत में बदलिए।")],
          [((X - Y) / Y) * 100, L("Divide by the starting BOD, not by the final one.", "अंतिम नहीं, प्रारंभिक BOD से भाग दीजिए।")],
        ]),
        data: { given: [`B_1 = ${X}\\ \\mathrm{mg/L}`, `B_2 = ${Y}\\ \\mathrm{mg/L}`], find: ["p"] },
        hint: L("Percentage reduction = fall ÷ starting value × 100.", "प्रतिशत कमी = कमी ÷ प्रारंभिक मान × 100।"),
        formula: "p = \\dfrac{B_1 - B_2}{B_1} \\cdot 100\\,\\%",
        solution: L(S(`Fall: $${X} - ${Y} = ${X - Y}\\ \\mathrm{mg/L}$`, `$p = \\dfrac{${X - Y}}{${X}} \\cdot 100\\,\\% = ${en(ans, 1)}\\,\\%$`), S(`कमी: $${X} - ${Y} = ${X - Y}\\ \\mathrm{mg/L}$`, `$p = \\dfrac{${X - Y}}{${X}} \\cdot 100\\,\\% = ${en(ans, 1)}\\,\\%$`)),
      });
    }
    const p = 5 * r.int(5, 8);
    const q = r.int(80, 95);
    const after1 = X * (1 - p / 100);
    const fin = after1 * (1 - q / 100);
    if (level === 2) {
      return task({
        text: L(`Sewage has a BOD of ${X} mg/L. Primary treatment removes ${p} % of the BOD, and secondary treatment then removes ${q} % of what is left. What is the BOD of the final effluent (in mg/L)?${roundToL(1, lang)}`, `वाहित मल का BOD ${X} mg/L है। प्राथमिक उपचार BOD का ${p} % हटाता है, फिर द्वितीयक उपचार शेष का ${q} % हटाता है। अंतिम बहिःस्राव का BOD (mg/L में) कितना है?${roundToL(1, lang)}`),
        answer: numM(fin, 1, [
          [after1 * (q / 100), L("That is the BOD removed in secondary treatment, not the BOD left.", "यह द्वितीयक उपचार में हटाया गया BOD है, बचा हुआ नहीं।")],
          [X * (1 - q / 100), L("Apply the primary treatment first.", "पहले प्राथमिक उपचार लगाइए।")],
          [after1, L("That is after primary treatment only.", "यह केवल प्राथमिक उपचार के बाद है।")],
        ]),
        data: { given: [`B_0 = ${X}\\ \\mathrm{mg/L}`, `p_1 = ${p}\\,\\%`, `p_2 = ${q}\\,\\%`], find: ["B_2"] },
        hint: L("Work stage by stage: after each stage, the BOD left is (100 − p) % of what entered it.", "चरण-दर-चरण चलिए: प्रत्येक चरण के बाद बचा BOD उसमें आए BOD का (100 − p) % है।"),
        formula: "B_2 = B_0 \\left(1 - \\dfrac{p_1}{100}\\right)\\left(1 - \\dfrac{p_2}{100}\\right)",
        solution: L(
          S(`After primary: $${X} \\cdot ${en(rd(1 - p / 100))} = ${en(rd(after1, 2))}\\ \\mathrm{mg/L}$`, `After secondary: $${en(rd(after1, 2))} \\cdot ${en(rd(1 - q / 100))} = ${en(fin, 1)}\\ \\mathrm{mg/L}$`),
          S(`प्राथमिक के बाद: $${X} \\cdot ${en(rd(1 - p / 100))} = ${en(rd(after1, 2))}\\ \\mathrm{mg/L}$`, `द्वितीयक के बाद: $${en(rd(after1, 2))} \\cdot ${en(rd(1 - q / 100))} = ${en(fin, 1)}\\ \\mathrm{mg/L}$`),
        ),
      });
    }
    const lim = r.pick([10, 20, 30]);
    const need = (1 - lim / after1) * 100;
    if (mode === 1) {
      return task({
        text: L(`Sewage with a BOD of ${X} mg/L loses ${p} % of its BOD in primary treatment. The effluent may be released into a river only if its BOD is at most ${lim} mg/L. What percentage of the remaining BOD must secondary treatment remove?${roundToL(1, lang)}`, `${X} mg/L BOD वाले वाहित मल का ${p} % BOD प्राथमिक उपचार में हट जाता है। बहिःस्राव नदी में तभी छोड़ा जा सकता है जब उसका BOD अधिक से अधिक ${lim} mg/L हो। द्वितीयक उपचार को शेष BOD का कितना प्रतिशत हटाना होगा?${roundToL(1, lang)}`),
        answer: numM(need, 1, [
          [(1 - lim / X) * 100, L("Secondary treatment starts from the BOD left after primary treatment.", "द्वितीयक उपचार प्राथमिक उपचार के बाद बचे BOD से आरंभ होता है।")],
          [(lim / after1) * 100, L("That is the percentage allowed to remain; find the part removed.", "यह बचने दिया गया प्रतिशत है; हटाया जाने वाला भाग ज्ञात कीजिए।")],
          [(1 - lim / X) * 100 - p, L("Percentages of different amounts cannot simply be subtracted.", "अलग-अलग मात्राओं के प्रतिशत सीधे घटाए नहीं जा सकते।")],
        ]),
        data: { given: [`B_0 = ${X}\\ \\mathrm{mg/L}`, `p_1 = ${p}\\,\\%`, `B_{\\max} = ${lim}\\ \\mathrm{mg/L}`], find: ["p_2"] },
        hint: L("Find the BOD after primary treatment, then the fraction that may remain.", "प्राथमिक उपचार के बाद का BOD ज्ञात कीजिए, फिर वह भाग जो बच सकता है।"),
        formula: "p_2 = \\left(1 - \\dfrac{B_{\\max}}{B_1}\\right) \\cdot 100\\,\\%",
        solution: L(
          S(`After primary: $B_1 = ${X} \\cdot ${en(rd(1 - p / 100))} = ${en(rd(after1, 2))}\\ \\mathrm{mg/L}$`, `$p_2 = \\left(1 - \\dfrac{${lim}}{${en(rd(after1, 2))}}\\right) \\cdot 100\\,\\% = ${en(need, 1)}\\,\\%$`),
          S(`प्राथमिक के बाद: $B_1 = ${X} \\cdot ${en(rd(1 - p / 100))} = ${en(rd(after1, 2))}\\ \\mathrm{mg/L}$`, `$p_2 = \\left(1 - \\dfrac{${lim}}{${en(rd(after1, 2))}}\\right) \\cdot 100\\,\\% = ${en(need, 1)}\\,\\%$`),
        ),
      });
    }
    const tot = (1 - (1 - p / 100) * (1 - q / 100)) * 100;
    return task({
      text: L(`Primary treatment removes ${p} % of the BOD of sewage, and secondary treatment removes ${q} % of the BOD that remains. What percentage of the original BOD is removed altogether?${roundToL(1, lang)}`, `प्राथमिक उपचार वाहित मल के BOD का ${p} % हटाता है, और द्वितीयक उपचार शेष BOD का ${q} % हटाता है। मूल BOD का कुल कितना प्रतिशत हटता है?${roundToL(1, lang)}`),
      answer: numM(tot, 1, [
        [Math.min(p + q, 100), L("The second percentage is of the remainder, so you cannot just add.", "दूसरा प्रतिशत शेष का है, इसलिए सीधे नहीं जोड़ सकते।")],
        [q, L("Include the primary treatment as well.", "प्राथमिक उपचार भी शामिल कीजिए।")],
        [(1 - p / 100) * (1 - q / 100) * 100, L("That is the percentage left; subtract it from 100.", "यह बचा प्रतिशत है; इसे 100 से घटाइए।")],
      ]),
      data: { given: [`p_1 = ${p}\\,\\%`, `p_2 = ${q}\\,\\%`], find: ["p"] },
      hint: L("Find the fraction that survives both stages, then subtract it from 1.", "दोनों चरणों के बाद बचा भाग ज्ञात कीजिए, फिर उसे 1 से घटाइए।"),
      formula: "p = \\left[1 - \\left(1 - \\dfrac{p_1}{100}\\right)\\left(1 - \\dfrac{p_2}{100}\\right)\\right] \\cdot 100\\,\\%",
      solution: L(
        S(`Left: $${en(rd(1 - p / 100))} \\cdot ${en(rd(1 - q / 100))} = ${en(rd((1 - p / 100) * (1 - q / 100), 4))}$`, `$p = (1 - ${en(rd((1 - p / 100) * (1 - q / 100), 4))}) \\cdot 100\\,\\% = ${en(tot, 1)}\\,\\%$`),
        S(`बचा भाग: $${en(rd(1 - p / 100))} \\cdot ${en(rd(1 - q / 100))} = ${en(rd((1 - p / 100) * (1 - q / 100), 4))}$`, `$p = (1 - ${en(rd((1 - p / 100) * (1 - q / 100), 4))}) \\cdot 100\\,\\% = ${en(tot, 1)}\\,\\%$`),
      ),
    });
  },
};

// ---------- Animal tissues and behaviour: štetje ----------
const AN_CATS = [
  {
    q: ["How many of the following are examples of learned behaviour?", "निम्नलिखित में से कितने अधिगत (सीखे हुए) व्यवहार के उदाहरण हैं?"],
    yes: [
      ["goslings following the first moving object they see", "हंस के बच्चों का पहली दिखी चलती वस्तु के पीछे चलना", "is imprinting (learned)", "छापांकन, एक अधिगत व्यवहार"],
      ["a snail no longer withdrawing after many gentle touches", "बार-बार हल्का छूने पर घोंघे का सिमटना बंद करना", "is habituation (learned)", "अभ्यस्तीकरण, एक अधिगत व्यवहार"],
      ["a dog salivating at the sound of a bell", "घंटी की आवाज़ पर कुत्ते के मुँह में लार आना", "is classical conditioning (learned)", "प्राचीन अनुबंधन, एक अधिगत व्यवहार"],
      ["a rat pressing a lever to get food", "भोजन पाने के लिए चूहे का लीवर दबाना", "is operant conditioning (learned)", "क्रिया-प्रसूत अनुबंधन, एक अधिगत व्यवहार"],
      ["a chimpanzee stacking boxes to reach bananas", "केले पाने के लिए चिंपैंज़ी का डिब्बे जमाना", "is insight learning", "अंतर्दृष्टि अधिगम"],
    ],
    no: [
      ["the knee-jerk", "घुटने का झटका (नी-जर्क)", "is a reflex (innate)", "प्रतिवर्त, एक जन्मजात व्यवहार"],
      ["woodlice moving faster in dry places", "सूखे स्थानों पर वुडलाइस का तेज़ चलना", "is kinesis (innate)", "गतिक्रम (काइनेसिस), एक जन्मजात व्यवहार"],
      ["a newborn mammal suckling", "नवजात स्तनधारी का स्तनपान करना", "is innate", "जन्मजात व्यवहार"],
      ["a spider spinning its first web", "मकड़ी का अपना पहला जाला बुनना", "is innate", "जन्मजात व्यवहार"],
    ],
  },
  {
    q: ["How many of the following are connective tissues?", "निम्नलिखित में से कितने संयोजी ऊतक हैं?"],
    yes: yn([["blood", "रुधिर"], ["bone", "अस्थि"], ["cartilage", "उपास्थि"], ["a tendon", "कंडरा"], ["a ligament", "स्नायुबंधन"], ["adipose tissue", "वसा ऊतक"], ["areolar tissue", "एरियोलर ऊतक"]], "is a connective tissue", "संयोजी ऊतक"),
    no: [
      ["the lining of the stomach", "आमाशय का आस्तर", "is columnar epithelium", "स्तंभाकार उपकला"],
      ["the outer layer of the skin", "त्वचा की बाहरी परत", "is compound epithelium", "संयुक्त उपकला"],
      ["cardiac muscle", "हृद पेशी", "is muscle tissue", "पेशी ऊतक"],
      ["a neuron", "न्यूरॉन", "is neural tissue", "तंत्रिका ऊतक"],
    ],
  },
  {
    q: ["How many of the following are lined by simple (one-layered) epithelium?", "निम्नलिखित में से कितने सरल (एक परत वाली) उपकला से आस्तरित हैं?"],
    yes: [
      ["the wall of a blood vessel", "रुधिर वाहिका की भित्ति", "has simple squamous epithelium", "सरल शल्की उपकला वाला भाग"],
      ["the air sacs of the lungs", "फुफ्फुस के वायु कोष", "have simple squamous epithelium", "सरल शल्की उपकला वाला भाग"],
      ["the tubular part of a nephron", "वृक्काणु का नलिकाकार भाग", "has cuboidal epithelium", "घनाकार उपकला वाला भाग"],
      ["the inner lining of the intestine", "आँत का आंतरिक आस्तर", "has columnar epithelium", "स्तंभाकार उपकला वाला भाग"],
      ["a bronchiole", "श्वसनिका", "has ciliated epithelium", "पक्ष्माभी उपकला वाला भाग"],
      ["a fallopian tube", "फैलोपियन नलिका", "has ciliated epithelium", "पक्ष्माभी उपकला वाला भाग"],
    ],
    no: yn([["the dry surface of the skin", "त्वचा की शुष्क सतह"], ["the buccal cavity", "मुख गुहा"], ["the pharynx", "ग्रसनी"], ["a duct of the salivary gland", "लार ग्रंथि की वाहिनी"]], "has compound (multi-layered) epithelium", "संयुक्त (बहुस्तरीय) उपकला वाला भाग"),
  },
  {
    q: ["How many of the following are made of involuntary muscle?", "निम्नलिखित में से कितने अनैच्छिक पेशी से बने हैं?"],
    yes: [
      ["the wall of the stomach", "आमाशय की भित्ति", "has smooth (involuntary) muscle", "चिकनी (अनैच्छिक) पेशी वाला भाग"],
      ["the wall of the intestine", "आँत की भित्ति", "has smooth (involuntary) muscle", "चिकनी (अनैच्छिक) पेशी वाला भाग"],
      ["the wall of a blood vessel", "रुधिर वाहिका की भित्ति", "has smooth (involuntary) muscle", "चिकनी (अनैच्छिक) पेशी वाला भाग"],
      ["the wall of the heart", "हृदय की भित्ति", "has cardiac (involuntary) muscle", "हृद (अनैच्छिक) पेशी वाला भाग"],
    ],
    no: yn([["the biceps", "द्विशिर पेशी (बाइसेप्स)"], ["a muscle that moves the thigh bone", "जाँघ की अस्थि को हिलाने वाली पेशी"], ["a muscle that moves the arm bones", "भुजा की अस्थियों को हिलाने वाली पेशी"]], "is skeletal (voluntary) muscle", "कंकाल (ऐच्छिक) पेशी"),
  },
];
const ANIMAL_COUNT = {
  id: "exg-bio-animal-count",
  topics: [T("animal-behaviour-and-tissues")],
  langs: LANGS,
  gen(level, r, _t, lang) {
    const L = bi(lang);
    return countCat(r, L, r.pick(level === 3 ? AN_CATS.slice(0, 3) : AN_CATS), level + 3);
  },
};

export const EXAM_GAP_BIO = [
  ...Object.keys(BANK).map((s) => conceptGen(s, BANK[s])),
  LIFE_CALC,
  CONTROL_COUNT,
  REPRO_CALC,
  HEREDITY_CALC,
  ENV_CALC,
  PLANT_CALC,
  MICROBE_CALC,
  ANIMAL_COUNT,
];
