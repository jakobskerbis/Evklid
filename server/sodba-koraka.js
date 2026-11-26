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
import { parse, compile, calcText, joinThousands, digitGap } from "../public/graph/math.js";
import { NOTE_TAG, claimNote, hasExercise, solverValues, noSolution, wordProblemResult } from "./live-check.js";
import { plainToTex, AMBIGUOUS_NUM, NOTE_AMBIGUOUS_NUM, OTHER_SYSTEM, noteLine } from "./besedilo-trditev.js";

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
function runs(text, chars) {
  const out = [];
  // Pika za števko in presledkom je konec stavka ali oštevilčenje (»2. x = 3«, »1. 3 + 4 = 7«), ne decimalna pika.
  const t = text.replace(/(\d)\.(?=\s)/g, "$1;");
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
      if (prev && /[\p{L}\p{N}_'’)\]}|]/u.test(prev)) continue;
      const w = wordBefore(t, start);
      if (w && (w.length === 1 || OP_WORD.test(w))) continue;
    }
    // Desni rob: črka takoj za zapisom (»2x = 5y«) ali enota oz. beseda računa za presledkom (»= 54 cm«, »= 6 krat«).
    if (!SENT_END.test(trail)) {
      const next = t[end];
      // \p{N}: tudi potenca »360 = 2³ · 3² · 5« (zapis se pri »³« ne konča).
      if (next && /[\p{L}\p{N}_%°€$'’(\[{|]/u.test(next)) continue;
      const w = wordAfter(t, end);
      if (w && (UNIT_WORD.test(w) || OP_WORD.test(w))) continue;
    }
    // Deljenje z ostankom (»7 : 2 = 3, ostanek 1«, »7 : 2 = 3 ost. 1«).
    if (/^[\s,;:(]*(?:ost\p{L}*|rem\p{L}*|r\s*\d)/iu.test(t.slice(end, end + 30))) continue;
    if (OPS_EDGE.test(core.replace(/\s+/g, ""))) continue;
    out.push({ core });
  }
  return out;
}

const THOUSANDS_DOT = /(?<![\d.,])[1-9]\d{0,2}(?:\.\d{3})+(?![\d,.])/;
// Ena stran računa → število ali null. Decimalna vejica (»2,5«); druga vejica ali »1.000« (tisočice ali decimalke?)
// pomeni nejasen zapis.
// Števila po istem pravilu kot kalkulatorja (calcText: »1 000«, »1.234,5«, »2e3«; »12 34« in »1,2,3« sta napaka).
export function value(part) {
  const s = String(part).trim();
  // »1 1/2«, »1\frac{1}{2}« (po TeX »1((1)/(2))«, mešano število ali 1 · ½?) in »12 34«: nejasno, preden prep iz »1 1/2« naredi »1 (1/2)«
  if (!s || digitGap(joinThousands(s)) || /\d\s*(?:\\[dt]?frac|\(\([^()]*\)\/\([^()]*\)\))/.test(s) || THOUSANDS_DOT.test(joinThousands(s))) return null;
  try {
    const t = calcText(prep(s));
    if (t.includes(",")) return null; // »1, 2«: dve števili, ne eno
    const v = compile(parse(t))({});
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
// »=« za točno vrednost, »≈« za zaokroženo (»1/2 + 1/3 ≈ 0,833333«, »x_1 ≈ 0,697224«): zaokrožena ni enakost.
const rel = (v, tex = false) => (Math.abs(Number(v.toPrecision(6)) - v) <= 1e-12 * Math.max(1, Math.abs(v)) ? "=" : tex ? "\\approx" : "≈");
const show = (s) => s.replace(/\s+/g, " ").trim();

/** Napačni računi brez neznank v učenčevem sporočilu: [»a = b« z izračunano vrednostjo]. */
export function arithmeticErrors(text) {
  return arithmeticFindings(text).map((f) => f.text);
}
// Kot arithmeticErrors, z ugotovitvijo za opombo brez modela (AUDIT-060): [{ text, fact }].
function arithmeticFindings(text) {
  const t = plain(text);
  if (t.length > 1500 || DOUBT_RE.test(t)) return [];
  const out = [];
  for (const { core } of runs(t, String.raw`\d \t+\-−–*/^().,·×÷:√π!=`)) {
    // Decimalna pika in vejica v istem zapisu (»8.30 = 8,5«: ura?): nejasno.
    if (/==/.test(core) || (/\d\.\d/.test(core) && /\d,\d/.test(core))) continue;
    const parts = core.split("=");
    if (parts.length > 6 || parts.some((p) => !p.trim() || !/\d|π/.test(p))) continue;
    const vals = parts.map(value);
    for (let i = 0; i + 1 < parts.length; i++) {
      if (vals[i] === null || vals[i + 1] === null) continue;
      // Tekoča veriga (»5 + 3 = 8 - 2 = 6«): desna stran se začne s pravilnim vmesnim rezultatom; zapis je ohlapen,
      // račun pa pravilen, zato koda ne sodi.
      const head = /^\s*([-−]?\d+(?:[.,]\d+)?)\s*[+\-−–*/·×÷:^]/.exec(parts[i + 1]);
      if (head && value(head[1]) !== null && same(parts[i], vals[i], head[1], value(head[1]))) continue;
      if (!same(parts[i], vals[i], parts[i + 1], vals[i + 1])) {
        const right = `${show(parts[i])} ${rel(vals[i], true)} ${fmt(vals[i]).replace(",", "{,}")}`;
        // Ura s piko, angleška vejica za tisočice, periodični zapis ali rezultat besedilne naloge (zaokroženo deljenje,
        // pretvorba enot): sodba kot main, opombe brez modela pa ne (pregled B, b984798b3).
        const unsure = [parts[i], parts[i + 1]].some((p) => AMBIGUOUS_NUM.test(p) || NOTE_AMBIGUOUS_NUM.test(p)) || wordProblemResult({ lhs: show(parts[i]), rhs: show(parts[i + 1]), lv: vals[i], rv: vals[i + 1] }) || otherMeaning(parts[i], parts[i + 1], vals[i + 1]);
        out.push({
          text: `the student's calculation $${show(parts[i])} = ${show(parts[i + 1])}$ is wrong: $${right}$`,
          fact: unsure ? null : { kind: "calc", wrong: plainToTex(`${show(parts[i])} = ${show(parts[i + 1])}`), right: plainToTex(right) },
          ...(unsure ? { quiet: true } : {}),
        });
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
const setTex = (v, xs) => (xs.length ? xs.map((x, i) => `${v}${xs.length > 1 ? `_${i + 1}` : ""} ${rel(x)} ${fmt(x)}`).join(", ") : "no real solution");

// Enačbe z eno neznanko v učenčevem sporočilu (navaden zapis ali $…$).
function studentEquations(text, v) {
  const t = plain(text);
  if (t.length > 1500) return [];
  return runs(t, String.raw`\d \t+\-−–*/^().,·×÷:√=²³${v}`)
    .filter((r) => !THOUSANDS_DOT.test(r.core)) // »x = 1.000« (tisočice ali decimalke?): nejasno
    .map((r) => r.core.replace(/(\d),(?=\d)/g, "$1.").replace(/²/g, "^2").replace(/³/g, "^3"))
    // »x1 + x2 = 5« (Vieta) ni enačba za x: neznanka z indeksom.
    .filter((c) => c.includes(v) && c.split("=").length === 2 && !c.includes(",") && !new RegExp(`${v}_?\\d`).test(c));
}

// Seznam rešitev z indeksi (»x1 = 2, x2 = 3«, »x_1 = 0,70 in x_2 = 4,30«): vsaj dve vrednosti, sicer null.
function rootList(text, v) {
  const t = plain(text);
  const found = [...t.matchAll(new RegExp(`(?<![\\p{L}\\d])${v}_?\\{?\\(?([1-9])\\)?\\}?\\s*=\\s*([-−+]?\\d+(?:[.,]\\d+)?)(?![\\d\\p{L}]|[ \\t]*[-+*/:·×÷^(=])`, "gu"))];
  if (found.length < 2 || new Set(found.map((m) => m[1])).size !== found.length) return null;
  return found.map((m) => ({ src: `${v}_${m[1]} = ${m[2]}`, x: Number(m[2].replace("−", "-").replace(",", ".")) }));
}

// Inštruktor sprašuje po drugi količini kot rešitvah enačbe (teme, ekstrem, odvod, vsota rešitev, »Koliko je $x + 1$?«):
// učenčev »x = 2« tedaj ni korak te enačbe, zato koda ne sodi.
const OTHER_Q = /(?<!\p{L})(?:tem(?:e|ena|enu|enom)|ekstrem\p{L}*|stacionar\p{L}*|odvod\p{L}*|odvaj\p{L}*|simetral\p{L}*|abscis\p{L}*|ordinat\p{L}*|maksim\p{L}*|minim\p{L}*|sredin\p{L}*|vsot\p{L}*|produkt\p{L}*|viet\p{L}*|graf\p{L}*|parabol\p{L}*|tangent\p{L}*|naklon\p{L}*|smern\p{L}*|presečišč\p{L}*|vertex|derivative|extrem\p{L}*|sum|product|slope|graph)(?!\p{L})|\\prime|f'/iu;
// Druga neznanka v inštruktorjevem zapisu (»Iz $t = 1$ pa?«, sistem, $f(x)$): ni jasno, katera enačba se rešuje.
const otherVar = (src, v) =>
  [...src.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].some((m) => new RegExp(`(?<![a-zA-Z\\\\])[${"xyztnmpqbcdfghrw".replace(v, "")}](?![a-zA-Z])`).test(texToText(m[1] ?? m[2])));
function asksOther(src, v) {
  if (OTHER_Q.test(src)) return true;
  for (const m of src.matchAll(/(?:koliko (?:je|znaša|dobiš)|izračunaj|vrednost\p{L}*|what is|compute)\s*\$([^$\n]+?)\$/giu)) {
    const e = texToText(m[1]).replace(/\s+/g, "");
    if (e.includes(v) && !/[=<>≤≥≠]/.test(e) && !new RegExp(`^[-−]?\\d*(?:[.,]\\d+)?${v}(?:_?\\{?\\d+\\}?)?$`).test(e)) return true;
  }
  return false;
}

// Enačbe, ki jih je inštruktor nazadnje zapisal z neznanko v (v $…$, brez vrstic s citatom učenčeve napake).
// Vse morajo imeti iste rešitve (ista naloga), sicer null. Brez enačbe: undefined.
function tutorReference(prevTutor, v) {
  const src = String(prevTutor || "");
  if (!src || hasExercise(src) || asksOther(src, v)) return src ? null : undefined;
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
  const out = { wrong: [], right: [], facts: [], rightFacts: [] };
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
    if (t === null || (t && !sameSet(t.sols, sols)) || otherVar(String(prevTutor || ""), v)) return out;
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
    if (!ref || otherVar(String(prevTutor || ""), v)) return out;
  }
  // »x1 = 2, x2 = -3«: obe rešitvi skupaj (ena sama vrednost je lahko delni odgovor, o njej spodaj).
  const roots = rootList(text, v);
  if (roots && !problems.length) {
    const tol = Math.max(...roots.map((r) => decimalsTol(r.src)));
    const mine = roots.map((r) => r.x);
    const shown = `$${roots.map((r) => show(r.src)).join(", ")}$`;
    if (sameSet(mine, ref.sols, tol)) {
      out.right.push(`the student's solutions ${shown} are exactly the solutions of $${show(ref.eq)}$`);
      out.rightFacts.push({ kind: "rightValue", stmt: plainToTex(roots.map((r) => show(r.src)).join(", ")), eq: plainToTex(show(ref.eq)) });
    }
    // Vrednost, ki ni rešitev, je napaka; manjkajoča rešitev sama (nepopoln odgovor) ostane modelu.
    else if (mine.some((x) => !has(ref.sols, x, tol))) {
      out.wrong.push(`the student's solutions ${shown} are wrong: $${show(ref.eq)}$ gives ${setTex(v, ref.sols)}`);
      out.facts.push({ kind: "value", wrong: plainToTex(roots.map((r) => show(r.src)).join(", ")), eq: plainToTex(show(ref.eq)), right: ref.sols.length ? plainToTex(setTex(v, ref.sols)) : null });
    }
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
      out.rightFacts.push({ kind: "rightStep", stmt: plainToTex(show(eq)), eq: plainToTex(show(ref.eq)), right: sols.length ? plainToTex(setTex(v, sols)) : null });
      continue;
    }
    if (!mine.length) continue; // npr. x^2 + 1 = 0 kot en primer razcepa
    const lost = sols.some((x) => !has(mine, x, tol));
    const extra = mine.some((x) => !has(sols, x, tol));
    const disjoint = !mine.some((x) => has(sols, x, tol));
    if (disjoint || (lost && extra)) {
      out.wrong.push(`the student's equation $${show(eq)}$ does not follow from ${refTex}: it gives ${setTex(v, mine)}, but ${refTex} gives ${setTex(v, sols)}`);
      out.facts.push({ kind: "step", wrong: plainToTex(show(eq)), eq: plainToTex(show(ref.eq)), right: sols.length ? plainToTex(setTex(v, sols)) : null });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Opomba za model in preverjanje, ali ji je odgovor sledil

const WRONG_RULES =
  "Your reply must agree with this check: do not confirm or praise the wrong part (no »Prav«, »Pravilno«, »Dobro«, »Odlično«, »Točno« for it) and do not simply continue from it. If the student sent only a result without working, ask for the working; otherwise show where the error is and help them fix it. Confirm only what is really right. In način A never state the final result or the full solution. Never mention a program, a check or this note.";
const PARTIAL_RULES =
  "Your reply must agree with this check: do not call the answer or the step that lost a solution right or complete (no »Prav«, »Pravilno«, »Točno«, »Tako je«, »Dobro« for it); say that the value(s) they found do solve it but that the task has more solutions, and help them find what they missed (for example, whichever applies: ± when taking a square root, a factor with the unknown that was divided away, a second angle). In način A do not state the missing solutions. Never mention a program, a check or this note.";
const RIGHT_RULES =
  "Your reply must agree with this check: never reject or \"correct\" this step. In način A do not state the final result before the student gets there. Never mention a program, a check or this note.";

/**
 * Sodba kode o učenčevem sporočilu (koraki, računi, končna vrednost). Vrne null, če koda ne more soditi, sicer
 * { wrong: bool, finding: besedilo za ponovni odgovor, note: skrita opomba za ta klic }.
 */
export function stepVerdict(text, opts = {}) {
  // Vprašanje-predlog (»x = 5?«, »je 7 · 8 = 54?«, AUDIT-059): sodi se predlog brez uvodne besede in vprašaja;
  // verdictIgnored ga šteje za prezrtega le ob izrecni potrditvi (pregled prevzema 5).
  const t = String(text || "");
  // vprašanje-predlog je kratek (isClaim: največ 120 znakov); daljše besedilo z »?« se ne razčlenjuje
  if (!/\?\s*$/.test(t) || t.length > 300) return tagClaim(calcContext(explicitCalc(t, judgeStep(t, opts)), t, opts), t, opts);
  let core = t
    .replace(/^\s*(?:(?:a|ali)\s+)?(?:je\s+)?(?:(?:mogoče|morda|menda|torej|potem|rezultat(?:\s+je)?|to\s+je)\s+)?/iu, "")
    .replace(/\s*\?+\s*$/, "")
    .replace(ASK_TAIL, ""); // »7 · 8 = 54, ne?«, »x = 5, kajne?« (AUDIT-059, dokončanje)
  // »7 · 8 je 54?« → »7 · 8 = 54«
  if (!core.includes("=")) core = core.replace(/^([\d(][\d\s.,+\-−*·×:/()^]*?[\d)])\s+je\s+([-−+]?\d+(?:[.,]\d+)?)$/u, "$1 = $2");
  // Golo število (»58?«) na inštruktorjevo vprašanje z računom (»Koliko je $7 \\cdot 8$?«) sodi le proti temu računu,
  // ne proti nalogi: »58« je tam napačen odgovor na vmesni korak (pregled A, 7f565d941). Brez računa v vprašanju kot
  // main (judgeStep: le končni rezultat naloge; FINAL_ASK ostane odstranjen).
  const asks = /^[-−+]?\d+(?:[.,]\d+)?$/.test(core.trim()) && TUTOR_ASK.test(String(opts.prevTutor || "").slice(-400).trim());
  let v = asks ? guessVerdict(core, opts) : null;
  let fromAsk = !!v;
  // Napačno glede na inštruktorjev račun, a število je morda odgovor na kaj drugega (pregled B, 018af7ab6): končni
  // rezultat naloge (sodba kot main), število, ki je v pogovoru že vidno (naloga, prejšnji korak), ali vmesni korak
  // (»Najprej množenje. Koliko je …?«) brez rešene računske naloge. Ob dvomu brez sodbe.
  let unsure = false;
  if (v?.wrong) {
    const x = num(core.trim());
    const fin = judgeStep(core, opts);
    const arith = (opts.pre?.problems || []).some((p) => p.type === "arith");
    const near = (y) => Math.abs(y - x) <= 1e-9 * Math.max(1, Math.abs(x));
    // število je vrednost vidnega izraza (naloga »$2^{10}$« brez presolve, prejšnji korak): ni napaka (pregled A, b984798b3)
    const shown = exprValues(`${opts.seen || ""}\n${opts.prevTutor || ""}`);
    if (fin && !fin.wrong) v = null;
    else if (x === null || seenNumbers(`${opts.prevTutor || ""}\n${opts.seen || ""}`).some(near) || shown.some(near) || (SUBSTEP.test(String(opts.prevTutor || "")) && !arith)) {
      v = null;
      unsure = true;
    }
    // sodba o inštruktorjevem računu velja ne glede na vprašanje (explicit) le, ko je ta račun poleg naloge edini izraz
    // v pogovoru; sicer stroga pravila (verdictNoteSafe)
    if (v) {
      const others = [];
      for (const z of shown) if (Math.abs(z - v.askValue) > 1e-9 * Math.max(1, Math.abs(z)) && !others.some((o) => Math.abs(o - z) <= 1e-9 * Math.max(1, Math.abs(z)))) others.push(z);
      if (others.length > 1) fromAsk = false;
    }
  }
  if (!v) fromAsk = false;
  if (!v && !unsure) {
    v = judgeStep(core, opts);
    // Pravilno po kodi, a zavrnitev je lahko prav (kot main, brez ponovnega odgovora in opombe): golo število proti
    // nalogi (inštruktor je morda medtem vprašal kaj drugega, pregled B) in zaokrožena decimalka (»0,5?« pri »zapiši
    // kot ulomek«, »x = 1,41?«; pregled A). Le točen odgovor na inštruktorjev račun (guessVerdict) brani zavrnjenega.
    const bare = /^[-−+]?\d+(?:[.,]\d+)?$/.test(core.trim());
    if (v && !v.wrong && (bare || /\d[.,]\d/.test(core))) v = { ...v, noReject: true };
  }
  // vrednosti predloga (»x = 5«): drugačna vrednost iste neznanke v odgovoru je popravek
  const vals = [...core.matchAll(/(?<![\p{L}\d])([a-zA-Z])(?:_?\d)?\s*=\s*([-−]?\d+(?:[.,]\d+)?)(?!\d|[.,]\d)/gu)].map((m) => ({ v: m[1], x: num(m[2]) }));
  // število, ki ga je učenec predlagal (»54« v »7 · 8 = 54?« ali »54?«): inštruktorjev »Da, 54.« ga ponovi
  const said = /(?:^|=)\s*([-−]?\d+(?:[.,]\d+)?)\s*$/.exec(core)?.[1];
  if (said && !vals.length) vals.push({ v: null, x: num(said) });
  if (v && fromAsk) v = { ...v, explicit: true };
  else v = explicitCalc(core, v);
  v = calcContext(v, t, opts);
  v = tagClaim(v, t, opts);
  return v ? { ...v, asked: true, vals } : v;
}
// Oblika učenčevega sporočila in dolžina pogovora za opombo (verdictNoteSafe).
function tagClaim(v, t, opts) {
  if (!v) return v;
  const { askValue, ...rest } = v;
  return { ...rest, bareClaim: bareClaim(t), ...(opts.turns != null ? { turns: opts.turns } : {}) };
}
// Račun, ki ima morda drug pomen (pregled A, b984798b3): dvojiški zapis (»1 + 1 = 10«: same ničle in enice) ali
// »preliv« (vsota ali zmnožek naravnih števil manjši od člena: »22 + 5 = 3« na uri, po modulu). Sodba ostane, opombe ni.
function otherMeaning(left, right, stated) {
  const nums = `${left} ${right}`.match(/\d+(?:[.,]\d+)?/g) || [];
  if (nums.length >= 2 && nums.every((n) => /^[01]+$/.test(n)) && nums.some((n) => n.length > 1)) return true;
  const ops = String(left).replace(/\d+(?:[.,]\d+)?|\s/g, "");
  const terms = (String(left).match(/\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(",", ".")));
  return /^[+*·×]+$/.test(ops) && Number.isInteger(stated) && stated >= 0 && terms.length >= 2 && stated < Math.max(...terms);
}
// Vrednosti izrazov, vidnih v pogovoru (»$2^{10}$«, »7 · 8 + 2«): [število].
function exprValues(text) {
  const out = [];
  const t = plain(String(text || "").slice(-4000));
  for (const m of t.matchAll(/[\d \t+\-−–*/^().,·×÷:√π]+/gu)) {
    const p = m[0].replace(/^[\s,.:;]+|[\s,.:;]+$/g, "");
    if (p.length > 80 || !/\d/.test(p) || !/\d\s*[+\-−–*/^·×÷:]\s*[\d(√π]|[√π]/.test(p)) continue;
    const v = value(p);
    if (v !== null) out.push(v);
  }
  return out;
}
// Sporočilo je le trditev (»x = 5«, »mislim x = 5?«, »54?«, »x = 3 ali x = -3«): brez drugih besed in števil z besedo.
const CLAIM_FILLER = new Set(["mislim", "da", "je", "a", "ali", "torej", "potem", "dobim", "mogoče", "morda", "menda", "rezultat", "rešitev", "to", "hmm", "ok", "no", "pa", "ja", "so", "is", "it", "i", "think"]);
function bareClaim(text) {
  const t = String(text || "").trim();
  if (!t || t.length > 120 || NUMBER_WORD.test(t)) return false;
  const words = t.replace(/[?!.\s]+$/, "").replace(ASK_TAIL, "").split(/\s+/);
  while (words.length && CLAIM_FILLER.has(words[0].toLowerCase().replace(/[,:]+$/, ""))) words.shift();
  const rest = words.join(" ").replace(/(?<!\p{L})(?:ali|in|or|and)(?!\p{L})/giu, " ").replace(/(?<!\p{L})\p{L}(?:_\{?\d+\}?)?(?!\p{L})/gu, "x");
  return /\d/.test(rest) && /^[\dx\s+\-−–*/·×^().,=]*$/.test(rest);
}
// Račun v drugem sistemu (ura, ostanki, dvojiško …) v učenčevem sporočilu ali prejšnjem inštruktorjevem odgovoru
// (»Koliko bo ura čez 2 uri, če je zdaj 23?« → »23 + 2 = 1«) ali dvoumen zapis števila: sodba in ponovni odgovor kot
// main, opombe brez modela pa ni (quiet; pregled B, b984798b3).
function calcContext(v, text, { prevTutor = "" } = {}) {
  if (!v || v.fact?.kind !== "calc") return v;
  const w = String(v.fact.wrong || "");
  if (OTHER_SYSTEM.test(text) || OTHER_SYSTEM.test(prevTutor) || AMBIGUOUS_NUM.test(w) || NOTE_AMBIGUOUS_NUM.test(w)) return { ...v, fact: null, quiet: true };
  return v;
}
// Sodba o računu, ki ga je zapisal učenec (»je 7 · 8 = 54?«), ali o inštruktorjevem računu iz vprašanja (»Koliko je
// $7 \cdot 8$?« → »54?«, zgoraj): opomba drži ne glede na to, kaj je inštruktor vprašal (explicit). Vrednost neznanke,
// korak enačbe in golo število proti nalogi pa ne (verdictNoteSafe).
function explicitCalc(text, v) {
  if (!v || v.fact?.kind !== "calc") return v;
  const t = String(text || "");
  const left = t.includes("=") ? t.split("=")[0] : t.split(/(?<!\p{L})je(?!\p{L})/u)[0];
  return /\d\s*(?:[-−+*·×:/^]|\\cdot|\\times|\\div|krat|plus|minus|deljeno)\s*[\d(]/u.test(left) ? { ...v, explicit: true } : v;
}
// Števila z besedo (sl, en) z običajnimi skloni, vrstilnimi in samostalniškimi oblikami (»trojka«, »desetica«).
const NUMBER_WORD = new RegExp(
  `(?<!\\p{L})(?:${[
    "nič", "ničl\\p{L}*", "nul\\p{L}*",
    "en", "ena", "eno", "ene", "eni", "enega", "enemu", "enim", "enkrat", "enic\\p{L}*", "enk\\p{L}*", "enojk\\p{L}*",
    "dva", "dve", "dveh", "dvema", "dvakrat", "dvoj\\p{L}*", "dvak\\p{L}*",
    "tri", "treh", "trem", "tremi", "trikrat", "troj\\p{L}*", "tretj\\p{L}*",
    "štiri", "štirih", "štirim", "štirimi", "štiric\\p{L}*", "štirik\\p{L}*", "štirk\\p{L}*", "četrt\\p{L}*",
    "pet", "petih", "petim", "petimi", "peti", "peta", "peto", "petega", "petem", "petic\\p{L}*", "petk\\p{L}*",
    "šest", "šest[aeiou]\\p{L}*", "šestic\\p{L}*", "šestk\\p{L}*",
    "sedem", "sedm\\p{L}*", "osem", "osm\\p{L}*", "devet\\p{L}*", "deset\\p{L}*",
    "\\p{L}+najst\\p{L}*", "\\p{L}+deset\\p{L}*", "dvajset\\p{L}*", "sto", "stot\\p{L}*", "tisoč\\p{L}*", "milijon\\p{L}*",
    "pol", "polovic\\p{L}*", "prv\\p{L}*", "drug[aeiou]?", "drug(?:ega|emu|em|im|ih|ima|imi)", "dvojn\\p{L}*",
    "zero", "one", "once", "two", "twice", "three", "thrice", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "\\p{L}+teen", "\\p{L}+ty", "hundred\\p{L}*", "thousand\\p{L}*", "half", "halve\\p{L}*",
    "double\\p{L}*", "triple\\p{L}*", "first", "second", "third", "fourth", "fifth",
  ].join("|")})(?!\\p{L})`,
  "iu",
);
// Velelnik ali hipoteza v inštruktorjevem odgovoru: drugačna naloga ali vmesni korak.
const TUTOR_MOVE = /(?<!\p{L})(?:naj|zamenja\p{L}*|odstran\p{L}*|zmanjša\p{L}*|poveča\p{L}*|del[ie]\p{L}*|razdeli\p{L}*|odšte\p{L}*|odvzem\p{L}*|prište\p{L}*|sešte\p{L}*|dodaj\p{L}*|pomnož\p{L}*|množ\p{L}*|vzem\p{L}*|brez|spremen\p{L}*|recimo|denimo|namesto|vstav\p{L}*|predpostav\p{L}*|kvadrir\p{L}*|koren\p{L}*|premakni\p{L}*|prenes\p{L}*|obrni\p{L}*|izpostav\p{L}*|pokrajš\p{L}*|okraj\p{L}*|če|če bi|kaj pa|kaj če|ko bi|pri|if|let|suppose|instead|what if|replace\p{L}*|remove\p{L}*|add\p{L}*|subtract\p{L}*|multipl\p{L}*|divide\p{L}*|without|take|plug\p{L}*|substitut\p{L}*)(?!\p{L})/iu;
// Vmesni korak v inštruktorjevem vprašanju (»Najprej …«, »Nato …«, »prvi korak«).
const SUBSTEP = /(?<!\p{L})(?:najprej|nato|potem|zdaj|sedaj|prv\p{L}*|drug\p{L}*|tretj\p{L}*|naslednj\p{L}*|korak\p{L}*|vmesn\p{L}*|first|then|next|step)(?!\p{L})/iu;
// Števila, ki jih učenec v pogovoru že vidi (»$7 \\cdot 8$« → 7, 8).
const seenNumbers = (t) =>
  [...String(t || "").slice(-4000).matchAll(/(?<![\d.,{}])[-−]?\d+(?:(?:[.,]|\{,\})\d+)?(?![\d]|[.,]\d|\{,\})/g)]
    .map((m) => Number(m[0].replace("−", "-").replace("{,}", ".").replace(",", ".")))
    .filter(Number.isFinite);
const ASK_TAIL = /(?:(?:\s*,\s*|\s+)(?:ali|ne|prav|kajne|a ne|res|right))+\s*$/iu;
// Inštruktorjevo zadnje vprašanje je en sam račun (»Koliko je $7 \cdot 8$?«): golo število v učenčevem predlogu
// (»54?«) je odgovor nanj in koda ga preračuna (AUDIT-059, dokončanje 27. 11.).
const TUTOR_ASK = /(?:^|[.!:\n]\s*)[*_\s]*(?:koliko je|koliko dobiš|koliko znaša|what is|how much is)\s+(?:\$([^$\n]{1,80})\$|(\d[\d +\-−·×*/:()^,.]{0,60}?))\s*\?[*_\s]*$/iu;
// Le inštruktorjevo vprašanje z računom (pregled B, 7f565d941): »Kaj dobiš na koncu?« po novi vaji ali »kaj če«
// ni vezano na nalogo, zato golo število brez računa v vprašanju ostane brez sodbe (kot main).
function guessVerdict(core, { prevTutor = "" } = {}) {
  const c = String(core || "").trim();
  if (!/^[-−+]?\d+(?:[.,]\d+)?$/.test(c)) return null;
  const tail = String(prevTutor || "").slice(-400).trim();
  const m = TUTOR_ASK.exec(tail);
  if (!m) return null;
  const raw = m[1] ?? m[2];
  // Stopinje (»$45° + 45°$« bi brali kot radiane) in deljenje z ostankom (»10 : 3« → 3 ostanek 1): brez sodbe.
  if (/°|\\circ|\\degree|['′]/.test(raw) || /ostan|remainder/i.test(tail)) return null;
  const expr = (m[1] != null ? plain(`$${m[1]}$`) : m[2]).trim();
  if (/[a-zA-Z]/.test(expr.replace(/sqrt|pi/g, "")) || !/[+\-−*/^·×÷:√]/.test(expr.replace(/^[-−]/, ""))) return null;
  // Dvoumna dogovora (pregled B): »6 : 2(1+2)« (množenje brez znaka za deljenjem) in »-3^2« (predznak pred potenco).
  if (/[:÷/]\s*\d+(?:[.,]\d+)?\s*\(/.test(expr) || /^\s*[-−]\s*\d+(?:[.,]\d+)?\s*\^/.test(expr)) return null;
  const y = value(expr);
  const x = value(c);
  if (y === null || x === null) return null;
  // Deljenje z necelim količnikom (»10 : 3«, »10 : 4«): učenec lahko misli celi del z ostankom, brez sodbe.
  if (/[:÷/]|\\div|\\frac/.test(raw + expr) && !Number.isInteger(y)) return null;
  const tex = m[1] != null ? m[1].trim() : plainToTex(m[2]);
  const said = plainToTex(c);
  if (same(c, x, expr, y)) {
    // Zaokrožen rezultat (»0,33« za $1/3$, »6,28« za $2\pi$) ni sodba: inštruktor ga sme zavrniti (»Pusti ulomek«),
    // koda pa ga ne razglasi za pravilnega (pregled A, 7f565d941). Le točna vrednost.
    if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(y))) return null;
    const finding = `the student's result ${c} for $${tex}$ is correct`;
    return { wrong: false, askValue: y, finding, fact: { kind: "rightCalc", stmt: said, eq: `${tex} = ${said}` }, note: `<${NOTE_TAG}>\nAn exact check compared the student's last message with the tutor's question: ${finding}.\n${RIGHT_RULES}\n</${NOTE_TAG}>` };
  }
  const right = `${tex} ${rel(y, true)} ${fmt(y).replace(",", "{,}")}`;
  const finding = `the student's result ${c} for $${tex}$ is wrong: $${right}$`;
  if (wordProblemResult({ lhs: expr, rhs: c, lv: y, rv: x }) || otherMeaning(expr, c, x)) return { wrong: true, askValue: y, finding, fact: null, quiet: true, note: `<${NOTE_TAG}>\nAn exact check found an error in the student's last message: ${finding}.\n${WRONG_RULES}\n</${NOTE_TAG}>` };
  return { wrong: true, askValue: y, finding, fact: { kind: "calc", wrong: `${tex} = ${said}`, right }, note: `<${NOTE_TAG}>\nAn exact check found an error in the student's last message: ${finding}.\n${WRONG_RULES}\n</${NOTE_TAG}>` };
}
function judgeStep(text, { pre = null, prevTutor = "" } = {}) {
  const wrong = [];
  const right = [];
  const facts = []; // ugotovitve za opombo brez modela ob meji porabe (AUDIT-060), v istem vrstnem redu kot »wrong«
  let rightFact = null;
  // Končna vrednost proti nalogi (obstoječa sodba kode). Ko je inštruktor medtem zastavil drugo enačbo, ne.
  const claim = claimNote(text, pre);
  const eqs = equationFindings(text, pre, prevTutor);
  const otherTask = pre && (hasExercise(prevTutor) || otherEquation(pre, prevTutor));
  const task = (pre?.problems || []).filter((p) => p.type === "equation" || (p.type === "arith" && !p.narrow));
  const tp = task.length === 1 ? task[0] : null;
  if (claim && !otherTask) {
    const w = /the student's result (.+?) is WRONG; (.+?)\.\n/.exec(claim);
    if (w) {
      wrong.push(`the student's result ${w[1]} is wrong; ${w[2]}`);
      facts.push(tp?.type === "equation" && !noSolution(tp) ? { kind: "value", wrong: plainToTex(w[1]), eq: tp.problemTex, right: tp.answerTex } : null);
    } else {
      right.push(`the student's result is correct (${/is CORRECT \((.+?)\)\.\n/.exec(claim)?.[1] || "final value"})`);
      if (tp?.type === "equation" && !noSolution(tp)) rightFact = { kind: "rightValue", stmt: tp.answerTex, eq: tp.problemTex };
      else if (tp?.type === "arith") rightFact = { kind: "rightCalc", stmt: plainToTex(tp.answer), eq: `${tp.problemTex} = ${tp.answerTex}` };
    }
  }
  const ar = arithmeticFindings(text);
  wrong.push(...ar.map((f) => f.text), ...eqs.wrong);
  facts.push(...ar.map((f) => f.fact), ...eqs.facts);
  right.push(...eqs.right);
  if (wrong.length) {
    const finding = [...new Set(wrong)].slice(0, 3).join("; ");
    const quiet = !facts.some(Boolean) && ar.some((f) => f.quiet);
    return { wrong: true, finding, fact: facts.find(Boolean) || null, ...(quiet ? { quiet: true } : {}), note: `<${NOTE_TAG}>\nAn exact check found an error in the student's last message: ${finding}.\n${WRONG_RULES}\n</${NOTE_TAG}>` };
  }
  if (claim && !otherTask) {
    // Ena od več rešitev (»x = 3« pri $x^2 = 3x$) je za claimNote »CORRECT«, a odgovor je nepopoln: inštruktorjev
    // »Skoraj, manjka še ena« ni zavrnitev pravilnega, zato ob njem ni ponovnega odgovora (partial).
    const sols = solverValues((pre.problems || []).find((x) => x.type === "equation")?.answerTex);
    const roots = sols.length > 1 ? rootList(text, sols[0].v) : null;
    // AUDIT-092: »x = 2 in x = 3« in »x = ±2« sta popolna odgovora, čeprav nista oštevilčena.
    const stated = sols.length > 1 ? statedRoots(text, sols[0].v) : [];
    const complete = (xs, tol) => sameSet([...new Set(xs)], sols.map((s) => s.x), tol);
    const partial = sols.length > 1 && !(roots && complete(roots.map((r) => r.x), Math.max(...roots.map((r) => decimalsTol(r.src))))) && !(stated.length && complete(stated.map((r) => r.x), Math.max(...stated.map((r) => r.tol))));
    // Nepopoln odgovor: opomba »CORRECT« je inštruktorja zavedla v »sta pravilna« brez druge rešitve (meritev 19. 11.,
    // brezplačni paket, (x - 2)^2 = 9 → »x = 5«). Opomba zato pove, da je odgovor nepopoln.
    // rootList bere le oštevilčene rešitve (x1 = …, x2 = …): »x = 5 ali x = -1« je zanj tudi partial. Opomba
    // »INCOMPLETE« bi tedaj zavrnila popoln odgovor, zato le, ko kakšne rešitve ni nikjer med števili v sporočilu.
    const nums = [...plain(text).matchAll(/(?<![\d.,])([-−]?\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?/g)].map((m) => ({ x: Number(m[1].replace("−", "-").replace(",", ".")) / (m[2] ? Number(m[2]) : 1), tol: m[2] ? 0 : decimalsTol(m[1]) })).concat(stated);
    const incomplete = partial && sols.some((s) => !nums.some((n) => has([n.x], s.x, n.tol)));
    if (incomplete) {
      const finding = `the student's value is one of the solutions, but the answer is INCOMPLETE: the task has ${sols.length} solutions (exact result of the task: ${/is CORRECT \(exact result of the task: (.+?)\)\.\n/.exec(claim)?.[1] || "several values"})`;
      return { wrong: false, partial, finding, note: `<${NOTE_TAG}>\nAn exact check compared the student's last message with the task: ${finding}.\n${PARTIAL_RULES}\n</${NOTE_TAG}>` };
    }
    return { wrong: false, partial, finding: right[0], fact: partial ? null : rightFact, note: claim };
  }
  if (right.length) {
    const finding = right.slice(0, 2).join("; ");
    return { wrong: false, finding, fact: eqs.rightFacts[0] || null, note: `<${NOTE_TAG}>\nAn exact check compared the student's last message with the equation being solved: ${finding}.\n${RIGHT_RULES}\n</${NOTE_TAG}>` };
  }
  return null;
}

// Vse učenčeve končne vrednosti neznanke v sporočilu (»x = 2 in x = 3«, »x1 = 2, x2 = 3«, »x = ±2«); vrednost,
// ki ji sledi operator ali črka, je vmesni korak in ne šteje.
function statedRoots(text, v) {
  const t = String(text || "").replace(/\$/g, " ").replace(/−/g, "-");
  const re = new RegExp(`(?<![\\p{L}\\d\\\\])${v}(?:_?\\{?\\d\\}?)?\\s*=\\s*(?:(±|\\\\pm|\\+-|\\+\\/-)\\s*)?([-+]?\\d+(?:[.,]\\d+)?(?:\\/\\d+)?)(?![\\d\\/\\p{L}]|[.,]\\d)(?![ \\t]*(?:[-+*/:·×÷^=(\\\\±]|i(?!\\p{L})))`, "gu");
  const out = [];
  for (const m of t.matchAll(re)) {
    const [a, b] = m[2].replace(",", ".").split("/");
    const x = Number(a) / (b ? Number(b) : 1);
    if (!Number.isFinite(x)) return [];
    const tol = b ? 0 : decimalsTol(m[2]);
    out.push({ x, tol });
    if (m[1]) out.push({ x: -x, tol });
  }
  return out;
}

// Inštruktorjevo zadnje sporočilo vsebuje enačbo z drugimi rešitvami kot naloga (nov primer): sodba proti nalogi ne velja.
function otherEquation(pre, prevTutor) {
  const p = (pre?.problems || []).find((x) => x.type === "equation");
  if (!p) return false;
  const none = noSolution(p);
  const v = solverValues(p.answerTex)[0]?.v || none?.[0];
  if (!v) return false;
  // Naloga brez rešitve: vsaka matematika v inštruktorjevem zadnjem sporočilu razen same naloge (»Kaj pa $x^6 = 64$?«,
  // »Pri katerem x je $(x+1)^2$ enako 0?«, »npr. 2«) je lahko drugo vprašanje z odgovorom »x = …«, zato brez sodbe
  // (pregled AUDIT-092).
  if (none) {
    const norm = (t) => String(t || "").replace(/\\left|\\right|\\[,;! ]|[\s{}]/g, "");
    const task = [norm(p.problem), norm(p.problemTex)];
    const rest = String(prevTutor || "").replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g, (m, a, b, c) => (task.includes(norm(a ?? b ?? c)) ? " " : m));
    if (/[=$\d]|\\\(/.test(rest)) return true;
    // Stransko ali »kaj če« vprašanje brez matematike (»Pri katerem x je leva stran najmanjša?«): sodba le ob splošnem
    // »Kaj narediš?«.
    if (/(?<!\p{L})(?:če bi|namesto|recimo|denimo|kaj pa|koliko|kater\p{L}*|kdaj|vstavi\p{L}*|poskus\p{L}*|preizk\p{L}*|najmanj\p{L}*|največ\p{L}*|lih\p{L}*|sod\p{L}*|primer\p{L}*|lev\p{L}*|desn\p{L}*|stran\p{L}*|what if|which|how many|smallest|largest)(?!\p{L})/iu.test(rest)) return true;
  }
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
const SOFT_MARK = /(?<!\p{L})(?:pazi\p{L}*|preveri\p{L}*|poglej\p{L}*|še enkrat|ponovno|check\p{L}*)(?!\p{L})/giu;
const NEGATIVE_OPEN = /^[\s>*_"'»«„“(]*(?:\p{L}+\s*,\s*)?(?:ne(?=\s*[,.!:—–])|ni (?:čisto |povsem |še |ravno )?(?:prav|pravilno|res|tako|točno)|narobe|napačno|napaka|ne drži|skoraj|hmm?|not quite|wrong|no(?=\s*[,.!:—–]))/iu;
// Izrecna potrditev učenčevega predloga: prvi stavek so le besede potrditve (»Da, pravilno!«, »Tako je.«, »Točno!«).
// »Pravilno je $x = 4$.«, »Dobro razmišljaš, a …«, »Prav, da vprašaš!«, »Točno – $x = 4$« niso potrditev predloga
// (pregled prevzema 5).
const CONFIRM_WORD = String.raw`(?:da|ja|tako je|res je|pravilno|prav|točno|drži|odlično|super|bravo|natanko|seveda|yes|correct|right|exactly)`;
const CONFIRM_OPEN = new RegExp(String.raw`^[\s>*_"'»«„“(]*${CONFIRM_WORD}(?:\s*,\s*${CONFIRM_WORD})*\s*[!.]+(?:\s|$)`, "iu");
const num = (t) => {
  const x = Number(String(t).replace("−", "-").replace(",", "."));
  return Number.isFinite(x) ? x : null;
};
// Popravek kjerkoli v odgovoru (pregled prevzema 6): »Prav. Preverimo: … kar ni 11.«, »Da. Ampak …«, »Odlično! Vstavi
// zdaj $x = 6$ …«, »Ja.\n\nNe, počakaj: $x = 4$.« Pri vprašanju-predlogu je odgovor tedaj popravek, ne potrditev.
const LATER_FIX = /(?<!\p{L})(?:vstav\p{L}*|preveri\p{L}*|preizkus\p{L}*|poglej\p{L}*|check\p{L}*|n[ie] \d)|\\neq?(?![a-zA-Z])|≠/iu;
function correctsLater(answer, vals) {
  if (ERROR_MARK.test(answer) || LATER_FIX.test(answer)) return true;
  for (const m of answer.matchAll(/(?<![\p{L}\d])([a-zA-Z])(?:_?\{?\d\}?)?\s*=\s*([-−]?\d+(?:[.,]\d+)?)(?!\d|[.,]\d)/gu)) {
    const x = num(m[2]);
    if (vals.some((s) => s.v === m[1] && s.x !== null && x !== null && Math.abs(s.x - x) > 1e-9)) return true;
  }
  return false;
}
// Izrecna zavrnitev predloga kot ves prvi stavek (»Ne, to ni prav.«, »Žal ne.«, »Ne.«, »Narobe.«).
const REJECT_OPEN = /^[\s>*_"'»«„“(]*(?:(?:žal\s+)?(?:ne|no|nope)(?:\s*,\s*(?:to\s+)?(?:ni\s+(?:prav|pravilno|pravilen|res|točno)|je\s+(?:narobe|napačno|napačen)|not\s+(?:right|correct)))?|narobe|napačno|wrong|incorrect)\s*[.!]+[\s*_"'«»“”)]*$/iu;
// Prvi stavek ponovi učenčevo napačno vrednost (»Da, $x = 6$ je pravilno.«, »Ja, 54.«) kot potrditev.
const ECHO_WORD = /(?<!\p{L})(?:pravil\p{L}*|prav|drži|točno|tako je|res je|rešitev|correct|right)(?!\p{L})/iu;
const ECHO_ONLY = /^[\s>*_"'»«„“(]*(?:da|ja|yes|seveda)\s*[,!.:–—-]\s*[$\s]*[-−]?\d+(?:[.,]\d+)?[$\s]*[.!]*\s*$/iu;
function echoes(head, vals) {
  const h = String(head || "").replace(/\{,\}/g, ",");
  for (const s of vals) {
    if (s.x === null) continue;
    let hit = false;
    if (s.v) {
      for (const m of h.matchAll(/(?<![\p{L}\d])([a-zA-Z])(?:_?\{?\d\}?)?\s*=\s*([-−]?\d+(?:[.,]\d+)?)(?!\d|[.,]\d)/gu)) if (m[1] === s.v && num(m[2]) === s.x) hit = true;
    }
    // golo število (»Ja, 6 drži!«, »Da, 54.«)
    for (const m of h.replace(/(?<![\p{L}\d])[a-zA-Z](?:_?\{?\d\}?)?\s*=/gu, " ").matchAll(/(?<![\d.,^_{])([-−]?\d+(?:[.,]\d+)?)(?!\d|[.,]\d)/gu)) if (num(m[1]) === s.x) hit = true;
    if (hit && (ECHO_WORD.test(h) || ECHO_ONLY.test(h))) return true;
  }
  return false;
}
const firstSentence = (s) => (/^[\s\S]{0,240}?(?:[.!?](?=\s|$)|\n|$)/.exec(String(s || "").trim())?.[0] || "");

/** Ali odgovor nasprotuje sodbi kode (potrdi napačen korak ali zavrne pravilnega)? */
/**
 * Opomba brez modela ob prezrti sodbi (meja porabe, napaka ponovnega odgovora; AUDIT-060) le ob izrecni potrditvi
 * napačnega koraka (»Odlično, $x = 5$ …«). Odgovor brez znaka napake (»Ne. $3 \cdot 6 + 7 = 25$, ne 22.«, »Napisal si
 * $x = 5$ … kar ni 11. Poskusi znova.«) je za ponovni odgovor dovolj (kot main), za vidno opombo pa ne: pogosto je
 * pravilna zavrnitev in opomba bi le razkrila rešitev (pregled A, 7f565d941). Vprašanje-predlog in zavrnjen pravilen
 * korak že zahtevata izrecen začetek.
 */
export function verdictNoteSafe(answer, verdict, { prevTutor = "" } = {}) {
  if (!verdict || verdict.quiet || !verdictIgnored(answer, verdict)) return false;
  // Opomba le, ko je prejšnji inštruktorjev odgovor navadno vprašanje (»Kaj dobiš za x?«, »Koliko je x?«): brez
  // števke, števila z besedo (tudi »trojka«, »desetica«, »tretji«), zapisa $…$ in brez velelnika ali hipoteze
  // (»Naj bo desna stran 3.«, »Zamenjaj 3 in 11.«, »Odstrani trojko.«, »Namig: odštej 3.«). Inštruktor je morda
  // zastavil drugo nalogo ali vmesni korak; sodba in ponovni odgovor ostaneta kot na main, vidne opombe pa ni
  // (pregledi A, 4cf3be1fb, bd0af5dac in f3d3893c3).
  // Račun v drugem pomenu po inštruktorjevem odgovoru (»Da, ob treh zjutraj.«, »Da, 3 in ostanek 1.«, »Da, 10°.«): brez opombe.
  if (/calc/i.test(verdict.fact?.kind || "") && (OTHER_SYSTEM.test(answer) || !noteLine(answer, { value: false }) || /°|\\circ|stopinj|degree/i.test(answer))) return false;
  // ena sama črka v »$…$« (»Koliko je $x$?«) je navadno besedilo, ne zapis
  const prev = String(prevTutor || "").replace(/\$\s*[a-zA-Z]\s*\$/g, " x ").trim();
  // Račun, ki ga je zapisal učenec ali inštruktor v vprašanju: opomba drži ne glede na vprašanje (koordinator, b366f3a5a).
  // Sicer (vrednost, korak, golo število proti nalogi; pregled A, b984798b3) le: pogovor je naloga, kvečjemu eno
  // navadno inštruktorjevo vprašanje (en stavek, največ šest besed, brez števil, zapisa, velelnika ali pogoja) in
  // trditev; učenčevo sporočilo je le trditev.
  if (!verdict.explicit) {
    if (verdict.turns != null && verdict.turns > 2) return false;
    if (verdict.bareClaim === false) return false;
    if (prev && (/\d|\$/.test(prev) || NUMBER_WORD.test(prev) || TUTOR_MOVE.test(prev) || /[.!?;]\s+\S/.test(prev) || prev.split(/\s+/).length > 6)) return false;
  }
  if (verdict.asked || !verdict.wrong) return true;
  const head = firstSentence(answer);
  return POSITIVE_OPEN.test(head) && !ERROR_MARK.test(head.replace(SOFT_MARK, "")) && !NEGATIVE_OPEN.test(head);
}

export function verdictIgnored(answer, verdict) {
  if (!verdict) return false;
  const head = firstSentence(answer);
  // V prvem stavku za potrditvijo štejejo le besede, ki res zavrnejo (»Prav, preverimo …«, »Dobro, poglejmo …« ostaneta potrditev).
  // Vprašanje-predlog: prezrt je le izrecno potrjen napačen predlog; pravilnega koda ne brani (zavrnitev je dvoumna:
  // »Hmm, $8 : 2 = 4$, torej $x = 4$.«).
  if (verdict.asked) {
    // Napačen predlog: izrecna potrditev (»Da, pravilno!«) ali potrditev, ki ponovi učenčevo vrednost (»Da, $x = 6$ je
    // pravilno.«, »Ja, 54.«), brez popravka kjerkoli v odgovoru. Pravilen predlog: le izrecna zavrnitev (»Ne, to ni
    // prav.«), ne dvoumen začetek (»Hmm, $8 : 2 = 4$ …«).
    if (!verdict.wrong) return !verdict.partial && !verdict.noReject && REJECT_OPEN.test(head) && !/\d/.test(head);
    return (CONFIRM_OPEN.test(head) || (POSITIVE_OPEN.test(head) && echoes(head, verdict.vals || []))) && !correctsLater(String(answer || ""), verdict.vals || []);
  }
  if (verdict.wrong) return (POSITIVE_OPEN.test(head) && !ERROR_MARK.test(head.replace(SOFT_MARK, ""))) || !ERROR_MARK.test(String(answer || ""));
  return !verdict.partial && NEGATIVE_OPEN.test(head);
}
