// Sodba kode o učenčevem koraku (Geminijev pregled 18. 11. 2026: inštruktor včasih reče »Prav«, ko je učenčev
// korak napačen; j 1. 11.: »naj se nikoli ne zgodi«). Dopolnjuje server/live-check.js, razdelek 4:
//   1. Računi brez neznank v učenčevem sporočilu (»7 · 8 = 54«, »-3^2 = 9«): koda jih preračuna; napačen račun je
//      napaka ne glede na nalogo.
//   2. Enačba v učenčevem sporočilu (»2x = 14«, »(x - 2)(x + 3) = 0«) proti enačbi, ki se rešuje: nalogi iz
//      učenčevega sporočila (presolve) ali enačbi iz inštruktorjevega zadnjega sporočila. Korak je pravilen, če ima
//      enake rešitve; napačen, če nima nobene skupne rešitve ali če ima rešitev, ki je naloga nima, in hkrati izgubi
//      rešitev naloge. Delna množica (razcep na primere) in nadmnožica (kvadriranje) ostaneta brez sodbe kode.
//   3. Končna vrednost (»x = 7«) proti nalogi: claimNote iz live-check.js.
// Po odgovoru: če inštruktor sodbi kode ne sledi (potrdi napačen korak ali zavrne pravilnega), odgovori še enkrat s
// skrito ugotovitvijo (brez modela za pregled). Ob dvomu koda ne sodi: raje brez sodbe kot napačna sodba.
import { solve, texToText, prep } from "../public/scan/solvecore.js";
import { parse, compile, joinThousands, digitGap } from "../public/graph/math.js";
import { NOTE_TAG, claimNote, hasExercise, solverValues } from "./live-check.js";

// Vrstica inštruktorja, ki navaja učenčevo (morda napačno) enačbo ali kandidata: ni enačba, ki se rešuje.
const QUOTE_LINE = /napačn|narobe|ne velja|ni enako|nepravil|ni res|ne drži|ni prav|ni pravil|ne ustreza|ne zadošča|odpade|kandidat|definicijsk|tvoj|✗|(?<!\p{L})(?:napisal[a]?|zapisal[a]?|dobil[a]?|izračunal[a]?|ali (?:je|res|velja|drži)|wrong|incorrect|you wrote|you got|extraneous|reject)(?!\p{L})/iu;

// Besede, ob katerih učenec sam dvomi o računu ali ga navaja kot napačnega (»mislil sem, da je 2^3 = 6, ampak …«).
const DOUBT_RE = /(?<!\p{L})(?:ni|ne|nisem|narobe|napačn\p{L}*|zmot\p{L}*|ampak|vendar|toda|če|ali|bi|not|wrong|if|but)(?!\p{L})/iu;
// Beseda pred številom ali za njim, ki je del računa ali enote: tedaj zapis ni čist račun (»2 na 3 = 8«, »= 54 cm«).
const OP_WORD = /^(?:na|krat|deljeno|plus|minus|od|times|over|divided|sin|cos|tan|tg|ctg|cot|log|ln|lg|exp|sqrt|koren\p{L}*|kvadrat\p{L}*|potenc\p{L}*|ulom\p{L}*|odstot\p{L}*|procent\p{L}*|stopin\p{L}*)$/iu;
const UNIT_WORD = /^(?:[kcmdµμn]?(?:m|g|s|l|N|J|W|V|A|Pa|Hz|mol|bit|B)|h|min|t|a|ha|eur\p{L}*|evr\p{L}*|cent\p{L}*|°\p{L}*)(?:[²³]|\^\d|\/\p{L}*)?$/u;
const SENT_END = /[.,;:!]/;
// Zapis se ne začne z operatorjem (razen predznaka) in se z njim ne konča: »+ 1 = 7« je konec daljšega izraza.
const OPS_EDGE = /^[*/^·×÷:]|[+\-−–*/^·×÷:=]$/;
// Neznanke, ki niso slovenski enočrkovni predlogi ali vezniki (»v«, »s«, »z«, »k«, »o«, »a«, »i«, »u«).
const VAR_OK = /^[xyztnmpqbcdfghrw]$/;

// Besedilo za iskanje: LaTeX v $…$ v navaden zapis (»\frac{1}{2}« → »((1)/(2))«), »·« in podobno ostane.
function plain(text) {
  return String(text || "")
    .replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, (_, a, b) => ` ${texToText(a ?? b)} `)
    .replace(/[   ]/g, " ");
}

const wordBefore = (t, i) => /(\p{L}+)\s*$/u.exec(t.slice(Math.max(0, i - 40), i))?.[1] || "";
const wordAfter = (t, i) => /^\s*(\p{L}[\p{L}°²³/^\d]*)/u.exec(t.slice(i, i + 40))?.[1] || "";

/**
 * Najde zapise v besedilu, ki jih sestavljajo samo znaki iz `chars`, z robovi, ki niso del daljšega zapisa.
 * Vrne [{ core }], kjer je core očiščen začetnih in končnih ločil.
 */
function runs(t, chars) {
  const out = [];
  for (const m of t.matchAll(new RegExp(`[${chars}]+`, "gu"))) {
    const raw = m[0];
    const lead = /^[\s:;,.!]*/.exec(raw)[0];
    const trail = /[\s:;,.!?]*$/.exec(raw.slice(lead.length))[0];
    let core = raw.slice(lead.length, raw.length - trail.length).trim();
    const start = m.index;
    const end = m.index + raw.length;
    // »D = 25 - 24 = 1«, »V = a · b = 3 · 4 = 12«: veriga za prvim »=« je račun, ime pred njim ni pomembno.
    // Alineja na začetku vrstice (»- 7 · 8 = 56«) ni minus.
    if (/^[-−–][ \t]/.test(core) && !/\S/.test(t.slice(t.lastIndexOf("\n", start) + 1, start + lead.length))) core = core.slice(1).trim();
    const named = core.startsWith("=");
    if (named) core = core.slice(1).trim();
    if (!core.includes("=")) continue;
    // Levi rob: brez ločila pred zapisom ne sme stati črka, števka ali indeks (»x2 = 3«, »f(2) = 5«, »log_2 8«);
    // beseda pred presledkom ne sme biti en sam znak (druga neznanka) ali del računa (»2 na 3 = 8«, »sin 30 = 0,5«).
    if (!named && !SENT_END.test(lead)) {
      const prev = t[start - 1];
      if (prev && /[\p{L}\d_'’)\]}|]/u.test(prev)) continue;
      const w = wordBefore(t, start);
      if (w && (w.length === 1 || OP_WORD.test(w))) continue;
    }
    // Desni rob: črka takoj za zapisom (»2x = 5y«) ali enota oz. beseda računa za presledkom (»= 54 cm«, »= 6 krat«).
    if (!SENT_END.test(trail)) {
      const next = t[end];
      if (next && /[\p{L}\d_%°€$'’(\[{|]/u.test(next)) continue;
      const w = wordAfter(t, end);
      if (w && (UNIT_WORD.test(w) || OP_WORD.test(w))) continue;
    }
    if (OPS_EDGE.test(core.replace(/\s+/g, ""))) continue;
    out.push({ core });
  }
  return out;
}

// Ena stran računa → število ali null. Decimalna vejica (»2,5«); druga vejica ali »1.000« (tisočice ali decimalke?)
// pomeni nejasen zapis.
function value(part) {
  let s = joinThousands(part.trim());
  if (!s || digitGap(s) || /(?<![\d.,])[1-9]\d{0,2}(?:\.\d{3})+(?![\d,.])/.test(s)) return null;
  s = s.replace(/(\d),(?=\d)/g, "$1.");
  if (s.includes(",")) return null;
  try {
    const v = compile(parse(prep(s)))({});
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

const BARE = /^[-−+]?\d+(?:[.,](\d+))?$/;
const IRRATIONAL = /[√π]|sqrt|\^\s*\(?\s*[-−]?\s*\d+\s*\/|\^\s*[-−]?\d*[.,]\d/;
// Ali sta strani enaki? Zaokrožena ali odrezana vrednost (»1,41« za √2, »0,66« za 2/3) ni napaka: dovolj je ena
// enota zadnjega mesta. Celo število ob iracionalnem izrazu (»√10 = 3«) ostane brez sodbe kode (polovica enote).
function same(a, va, b, vb) {
  const diff = Math.abs(va - vb);
  if (diff <= 1e-9 * Math.max(1, Math.abs(va), Math.abs(vb))) return true;
  let tol = 0;
  for (const [s, o] of [[a, b], [b, a]]) {
    const m = BARE.exec(s.replace(/\s+/g, ""));
    if (!m) continue;
    const dec = m[1]?.length ?? 0;
    if (dec) tol = Math.max(tol, 1.01 * 10 ** -dec);
    else if (IRRATIONAL.test(o)) tol = Math.max(tol, 0.51);
  }
  return diff <= tol;
}

const fmt = (v) => String(Number(v.toPrecision(6))).replace(".", ",");
const show = (s) => s.replace(/\s+/g, " ").trim();

/** Napačni računi brez neznank v učenčevem sporočilu: [»a = b« z izračunano vrednostjo]. */
export function arithmeticErrors(text) {
  const t = plain(text);
  if (t.length > 1500 || DOUBT_RE.test(t)) return [];
  const out = [];
  for (const { core } of runs(t, String.raw`\d \t+\-−–*/^().,·×÷:√π!=`)) {
    if (/==/.test(core)) continue;
    const parts = core.split("=");
    if (parts.length > 6 || parts.some((p) => !p.trim() || !/\d|π/.test(p))) continue;
    const vals = parts.map(value);
    for (let i = 0; i + 1 < parts.length; i++) {
      if (vals[i] === null || vals[i + 1] === null) continue;
      if (!same(parts[i], vals[i], parts[i + 1], vals[i + 1])) {
        out.push(`the student's calculation $${show(parts[i])} = ${show(parts[i + 1])}$ is wrong: $${show(parts[i])} = ${fmt(vals[i])}$`);
        break;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Enačbe

// Neznanka v imenovalcu, pod korenom, v absolutni vrednosti, v eksponentu ali v funkciji: koraki lahko dodajo ali
// izgubijo rešitve tudi, ko so pravilni (definicijsko območje), zato tam koda korakov ne sodi.
const nonPolynomial = (s, v) =>
  /[√|]|sqrt|log|ln|sin|cos|tan|exp/.test(s) || new RegExp(`\\^\\s*(?:\\([^)]*${v}|${v})|\\/\\s*\\(?[^+\\-=]*${v}`).test(s);

// Rešitve enačbe (realne, numerične) ali null, če je reševalnik ne zna rešiti in preveriti. [] = ni realne rešitve.
function solutionsOf(eq, v) {
  if (eq.length > 160 || digitGap(eq) || nonPolynomial(eq, v)) return null;
  let r;
  try {
    r = solve(eq);
  } catch {
    return null;
  }
  if (!r?.ok || r.verified !== true || r.type !== "equation" || r.numeric) return null;
  const key = r.answer?.key;
  if (key === "scan.a.none" || key === "scan.a.noReal") return [];
  if (key) return null; // vsako število je rešitev: istovetnost, ne korak enačbe
  const vals = solverValues(r.answer?.tex);
  if (!vals.length || vals.some((s) => s.v !== v)) return null;
  return vals.map((s) => s.x).sort((a, b) => a - b);
}

// tol: učenčev zaokrožen zapis (»x = 0,70« za 0,6972…) se ujema na eno enoto zadnjega mesta.
const has = (xs, x, tol = 0) => xs.some((y) => Math.abs(x - y) <= Math.max(tol, 1e-6 * Math.max(1, Math.abs(x))));
const sameSet = (a, b, tol = 0) => a.length === b.length && a.every((x) => has(b, x, tol)) && b.every((x) => has(a, x, tol));
const decimalsTol = (s) => {
  const d = Math.max(0, ...[...String(s).matchAll(/\d[.,](\d+)/g)].map((m) => m[1].length));
  return d ? 1.01 * 10 ** -d : 0;
};
const setTex = (v, xs) => (xs.length ? xs.map((x, i) => `${v}${xs.length > 1 ? `_${i + 1}` : ""} = ${fmt(x)}`).join(", ") : "no real solution");

// Enačbe z eno neznanko v učenčevem sporočilu (navaden zapis ali $…$).
function studentEquations(text, v) {
  const t = plain(text);
  if (t.length > 1500) return [];
  return runs(t, String.raw`\d \t+\-−–*/^().,·×÷:√=²³${v}`)
    .map((r) => r.core.replace(/(\d),(?=\d)/g, "$1.").replace(/²/g, "^2").replace(/³/g, "^3"))
    .filter((c) => c.includes(v) && c.split("=").length === 2 && !c.includes(","));
}

// Seznam rešitev z indeksi (»x1 = 2, x2 = 3«, »x_1 = 0,70 in x_2 = 4,30«): vsaj dve vrednosti, sicer null.
function rootList(text, v) {
  const t = plain(text);
  const found = [...t.matchAll(new RegExp(`(?<![\\p{L}\\d])${v}_?\\{?\\(?([1-9])\\)?\\}?\\s*=\\s*([-−+]?\\d+(?:[.,]\\d+)?)(?![\\d\\p{L}]|[ \\t]*[-+*/:·×÷^(=])`, "gu"))];
  if (found.length < 2 || new Set(found.map((m) => m[1])).size !== found.length) return null;
  return found.map((m) => ({ src: `${v}_${m[1]} = ${m[2]}`, x: Number(m[2].replace("−", "-").replace(",", ".")) }));
}

// Enačbe, ki jih je inštruktor nazadnje zapisal z neznanko v (v $…$, brez vrstic s citatom učenčeve napake).
// Vse morajo imeti iste rešitve (ista naloga), sicer null. Brez enačbe: undefined.
function tutorReference(prevTutor, v) {
  const src = String(prevTutor || "");
  if (!src || hasExercise(src)) return src ? null : undefined;
  let ref;
  for (const line of src.split("\n")) {
    if (QUOTE_LINE.test(line)) continue;
    for (const m of line.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
      const eq = texToText(m[1] ?? m[2]).trim();
      if (!eq.includes(v) || eq.split("=").length !== 2 || /[<>≤≥≠]/.test(eq)) continue;
      if (new RegExp(`^\\s*${v}(?:_\\(?\\d\\)?)?\\s*=`).test(eq)) continue; // rešitev, ne enačba
      const sols = solutionsOf(eq, v);
      if (!sols?.length) {
        if (nonPolynomial(eq, v)) return null; // druga vrsta naloge: brez sodbe kode
        continue;
      }
      if (ref && !sameSet(ref.sols, sols)) return null;
      ref ??= { eq, sols };
    }
  }
  return ref;
}

/** Sodba o enačbah v učenčevem sporočilu proti enačbi, ki se rešuje. { wrong: [], right: [] } */
function equationFindings(text, pre, prevTutor) {
  const out = { wrong: [], right: [] };
  const problems = (pre?.problems || []).filter((p) => p.type === "equation");
  let ref = null;
  let v = null;
  if (pre?.problems?.length && problems.length !== 1) return out;
  if (problems.length === 1) {
    const p = problems[0];
    const vars = [...new Set(solverValues(p.answerTex).map((s) => s.v))];
    if (vars.length !== 1 || !VAR_OK.test(vars[0])) return out;
    v = vars[0];
    const sols = solutionsOf(p.problem, v);
    if (!sols?.length) return out;
    ref = { eq: p.problem, sols };
    // Inštruktor je medtem zastavil drugo enačbo (preprostejši primer, vaja): ne sodimo proti nalogi.
    const t = tutorReference(prevTutor, v);
    if (t === null || (t && !sameSet(t.sols, sols))) return out;
  } else {
    for (const c of "xyztnmpqbcdfghrw") {
      if (!new RegExp(`(?<!\\p{L})${c}|\\d${c}`, "u").test(plain(prevTutor))) continue;
      const t = tutorReference(prevTutor, c);
      if (t === null) return out;
      if (t) {
        if (ref) return out; // dve neznanki v igri: brez sodbe
        ref = t;
        v = c;
      }
    }
    if (!ref) return out;
  }
  // »x1 = 2, x2 = -3«: obe rešitvi skupaj (ena sama vrednost je lahko delni odgovor, o njej spodaj).
  const roots = rootList(text, v);
  if (roots && !problems.length) {
    const tol = Math.max(...roots.map((r) => decimalsTol(r.src)));
    const mine = roots.map((r) => r.x);
    const shown = `$${roots.map((r) => show(r.src)).join(", ")}$`;
    if (sameSet(mine, ref.sols, tol)) out.right.push(`the student's solutions ${shown} are exactly the solutions of $${show(ref.eq)}$`);
    // Vrednost, ki ni rešitev, je napaka; manjkajoča rešitev sama (nepopoln odgovor) ostane modelu.
    else if (mine.some((x) => !has(ref.sols, x, tol)))
      out.wrong.push(`the student's solutions ${shown} are wrong: $${show(ref.eq)}$ gives ${setTex(v, ref.sols)}`);
    return out;
  }
  for (const eq of studentEquations(text, v)) {
    if (show(eq) === show(ref.eq)) continue; // učenec prepiše nalogo
    // Končno vrednost (»x = 7«) pri nalogi iz učenčevega sporočila sodi claimNote.
    if (problems.length && new RegExp(`^\\s*${v}(?:_?\\d)?\\s*=\\s*[-+]?[\\d.]+\\s*$`).test(eq)) continue;
    const mine = solutionsOf(eq, v);
    if (!mine) continue;
    const { sols } = ref;
    const refTex = `$${show(ref.eq)}$`;
    const tol = decimalsTol(eq);
    if (sameSet(mine, sols, tol)) {
      out.right.push(`the student's equation $${show(eq)}$ has exactly the same solutions as ${refTex} (${setTex(v, sols)}), so this step is correct`);
      continue;
    }
    if (!mine.length) continue; // npr. x^2 + 1 = 0 kot en primer razcepa
    const lost = sols.some((x) => !has(mine, x, tol));
    const extra = mine.some((x) => !has(sols, x, tol));
    const disjoint = !mine.some((x) => has(sols, x, tol));
    if (disjoint || (lost && extra)) {
      out.wrong.push(`the student's equation $${show(eq)}$ does not follow from ${refTex}: it gives ${setTex(v, mine)}, but ${refTex} gives ${setTex(v, sols)}`);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Opomba za model in preverjanje, ali ji je odgovor sledil

const WRONG_RULES =
  "Your reply must agree with this check: do not confirm or praise the wrong part (no »Prav«, »Pravilno«, »Dobro«, »Odlično«, »Točno« for it) and do not simply continue from it. First show the student where the error is, then help them fix it; confirm only what is really right. If the student sent no working, ask for it. In način A never state the final result or the full solution. Never mention a program, a check or this note.";
const RIGHT_RULES =
  "Your reply must agree with this check: never reject or \"correct\" this step. Never mention a program, a check or this note.";

/**
 * Sodba kode o učenčevem sporočilu (koraki, računi, končna vrednost). Vrne null, če koda ne more soditi, sicer
 * { wrong: bool, finding: besedilo za ponovni odgovor, note: skrita opomba za ta klic }.
 */
export function stepVerdict(text, { pre = null, prevTutor = "" } = {}) {
  const wrong = [];
  const right = [];
  // Končna vrednost proti nalogi (obstoječa sodba kode). Ko je inštruktor medtem zastavil drugo enačbo, ne.
  const claim = claimNote(text, pre);
  const eqs = equationFindings(text, pre, prevTutor);
  const otherTask = pre && (hasExercise(prevTutor) || otherEquation(pre, prevTutor));
  if (claim && !otherTask) {
    const w = /the student's result (.+?) is WRONG; (.+?)\.\n/.exec(claim);
    if (w) wrong.push(`the student's result ${w[1]} is wrong; ${w[2]}`);
    else right.push(`the student's result is correct (${/is CORRECT \((.+?)\)\.\n/.exec(claim)?.[1] || "final value"})`);
  }
  wrong.push(...arithmeticErrors(text), ...eqs.wrong);
  right.push(...eqs.right);
  if (wrong.length) {
    const finding = [...new Set(wrong)].slice(0, 3).join("; ");
    return { wrong: true, finding, note: `<${NOTE_TAG}>\nAn exact check found an error in the student's last message: ${finding}.\n${WRONG_RULES}\n</${NOTE_TAG}>` };
  }
  if (claim && !otherTask) return { wrong: false, finding: right[0], note: claim };
  if (right.length) {
    const finding = right.slice(0, 2).join("; ");
    return { wrong: false, finding, note: `<${NOTE_TAG}>\nAn exact check compared the student's last message with the equation being solved: ${finding}.\n${RIGHT_RULES}\n</${NOTE_TAG}>` };
  }
  return null;
}

// Inštruktorjevo zadnje sporočilo vsebuje enačbo z drugimi rešitvami kot naloga (nov primer): sodba proti nalogi ne velja.
function otherEquation(pre, prevTutor) {
  const p = (pre?.problems || []).find((x) => x.type === "equation");
  if (!p) return false;
  const v = solverValues(p.answerTex)[0]?.v;
  if (!v) return false;
  const t = tutorReference(prevTutor, v);
  if (t === null) return true;
  if (!t) return false;
  const sols = solutionsOf(p.problem, v);
  return !!sols && !sameSet(t.sols, sols);
}

// Odgovor se začne s potrditvijo (prvi stavek): »Prav!«, »Dobro, zdaj …«, »Ana, odlično.«
const POSITIVE_OPEN = /^[\s>*_"'»«„“(]*(?:\p{L}+\s*,\s*)?(?:prav|pravilno|točno|tako je|res je|drži|dobro|lepo|odlično|super|bravo|krasno|izvrstno|natanko|seveda|da|ja|okej|ok|perfektno|imaš prav|prav imaš|correct|right|yes|exactly|good|great|nice|well done)(?!\p{L})/iu;
// Znak, da odgovor opozori na napako ali učenca usmeri k ponovnemu premisleku.
const ERROR_MARK = /(?<!\p{L})(?:napak\p{L}*|narobe|napačn\p{L}*|ni (?:čisto |povsem |še |ravno |res )?(?:prav|pravilno|pravilen|res|tako|točno|enako)|ne drži|ne velja|ne ujema|ne more|zmot\p{L}*|spodrsl\p{L}*|zalomil\p{L}*|pazi|preveri\p{L}*|poglej\p{L}*|še enkrat|ponovno|skoraj|ampak|vendar|toda|hmm?|wrong|mistake|not quite|almost|check)(?!\p{L})|≠/iu;
const NEGATIVE_OPEN = /^[\s>*_"'»«„“(]*(?:\p{L}+\s*,\s*)?(?:ne(?=[\s,.!])|ni (?:čisto |povsem |še |ravno )?(?:prav|pravilno|res|tako|točno)|narobe|napačno|napaka|ne drži|skoraj|hmm?|not quite|wrong|no(?=[\s,.!]))/iu;
const firstSentence = (s) => (/^[\s\S]{0,240}?(?:[.!?](?=\s|$)|\n|$)/.exec(String(s || "").trim())?.[0] || "");

/** Ali odgovor nasprotuje sodbi kode (potrdi napačen korak ali zavrne pravilnega)? */
export function verdictIgnored(answer, verdict) {
  if (!verdict) return false;
  const head = firstSentence(answer);
  if (verdict.wrong) return (POSITIVE_OPEN.test(head) && !ERROR_MARK.test(head)) || !ERROR_MARK.test(String(answer || ""));
  return NEGATIVE_OPEN.test(head);
}
