import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import SL from "../public/i18n/sl.js";
import { solve, analyze, prep, splitSystem, texToText } from "../public/scan/solvecore.js";
import { verifyAi } from "../public/scan/verify.js";
import { cleanProblems, cleanSolution, cleanGiven, solvePrompt, READ_PROMPT } from "../server/scan.js";
import { answerParts } from "../public/scan/odgovor.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const flat = (s) => String(s).replace(/\s+/g, "");
const ans = (text, opt) => {
  const r = solve(text, opt);
  assert.ok(r.ok, `${text}: ${r.reason} ${r.detail || ""}`);
  assert.equal(r.verified, true, `${text} ni preverjeno`);
  return r;
};

test("linear equations: fractions and decimals cleared, brackets, check step", () => {
  let r = ans("3(x-2)+4=2x-1");
  assert.equal(flat(r.answer.tex), "x=1");
  assert.deepEqual(r.methods[0].steps.map((s) => s.title.k), ["scan.s.expand", "scan.s.collect", "scan.s.move", "scan.s.collect", "scan.s.check"]);
  r = ans("(x+1)/2 - (x-1)/3 = 1");
  assert.equal(r.methods[0].steps[0].title.k, "scan.s.clearFrac");
  assert.equal(r.methods[0].steps[0].title.v.n, "6");
  assert.equal(flat(r.methods[0].steps[0].tex), flat("3\\left(x + 1\\right) - 2\\left(x - 1\\right) = 6"));
  r = ans("0,5x+1,2=3");
  assert.equal(r.methods[0].steps[0].title.k, "scan.s.clearDec");
  assert.match(r.answer.approx, /3\{,\}6/);
  r = ans("5x - 3 = 2");
  assert.ok(r.methods[0].steps.some((s) => s.note === "/ : 5"));
  assert.equal(flat(ans("2(x+1) = 2x + 2").answer.tex), "x\\in\\mathbb{R}");
  assert.equal(ans("x + 1 = x").answer.key, "scan.a.none");
  // LaTeX s fotografije
  assert.equal(flat(ans("\\frac{x+1}{2}=3").answer.tex), "x=5");
});

test("rational equations: domain, common denominator, rejected roots; x collected where it stays positive", () => {
  let r = ans("3/(x-1) = 2");
  assert.equal(flat(r.answer.tex), "x=\\frac{5}{2}");
  const keys = r.methods[0].steps.map((s) => s.title.k);
  assert.deepEqual(keys.slice(0, 3), ["scan.s.domain", "scan.s.mulLcd", "scan.s.expand"]);
  assert.ok(keys.includes("scan.s.moveRight"));
  assert.equal(flat(r.methods[0].steps[1].tex), flat("3 = 2\\left(x - 1\\right)"));
  r = ans("x/(x+2) + 1/x = 1");
  assert.equal(flat(r.answer.tex), "x=2");
  assert.equal(flat(r.methods[0].steps[1].tex), flat("x^{2} + x + 2 = x\\left(x + 2\\right)"));
  r = ans("1/(x-1)+1/(x+1)=2/(x^2-1)");
  assert.equal(r.answer.key, "scan.a.none");
  assert.ok(r.methods[0].steps.some((s) => s.title.k === "scan.s.reject"));
  r = ans("1/x^2 = 4");
  assert.equal(r.methods[0].steps[2].title.k, "scan.s.standardRight");
  assert.equal(flat(r.methods[0].steps[2].tex), "4x^{2}-1=0");
  assert.match(ans("-3/x = 6").methods[0].steps.at(-1).tex, /: \\left\(-\\frac/);
});

test("quadratic equations: every method gives the same verified roots", () => {
  let r = ans("x^2-5x+6=0");
  assert.deepEqual(r.methods.map((m) => m.id), ["factor", "formula", "square"]);
  assert.equal(flat(r.answer.tex), "x_{1}=2,\\quadx_{2}=3");
  r = ans("2x^2+3x-2=0");
  assert.match(flat(r.answer.tex), /x_\{1\}=-2.*x_\{2\}=\\frac\{1\}\{2\}/);
  r = ans("x^2-2x-1=0");
  assert.equal(flat(r.answer.tex), "x_{1}=1-\\sqrt{2},\\quadx_{2}=1+\\sqrt{2}");
  r = ans("x^2 = 4x");
  assert.equal(r.methods[0].id, "incomplete");
  r = ans("x^2+4=0");
  assert.equal(r.answer.key, "scan.a.noReal");
  r = ans("x^2+4=0", { complex: true });
  assert.ok(r.methods.some((m) => m.steps.some((s) => s.title.k === "scan.s.complex")));
  r = ans("(x-3)^2 = 2x - 6");
  assert.equal(flat(r.answer.tex), "x_{1}=3,\\quadx_{2}=5");
  r = ans("x^3-6x^2+11x-6=0");
  assert.equal(r.kind, "poly-eq");
  assert.equal(flat(r.answer.tex), "x_{1}=1,\\quadx_{2}=2,\\quadx_{3}=3");
  r = ans("x^3 - 3x^2 + 9x - 2 = 0");
  assert.ok(r.methods[0].steps.some((s) => s.title.k === "scan.s.numeric"));
  assert.ok(r.answer.tex.includes("0{,}2399"), r.answer.tex);
});

test("inequalities: sign flips, intervals, quadratic by parabola", () => {
  let r = ans("2x-3 < 5x+6");
  assert.ok(r.methods[0].steps.some((s) => s.title.k === "scan.s.divideFlip"));
  assert.equal(flat(r.answer.tex), "x>-3");
  assert.equal(r.numberLine.intervals.length, 1);
  r = ans("1 < 2x+1 <= 5");
  assert.equal(flat(r.answer.tex), "x\\in\\left(0,2\\right]");
  r = ans("x^2-4 >= 0");
  assert.equal(flat(r.answer.tex), "x\\in\\left(-\\infty,-2\\right]\\cup\\left[2,\\infty\\right)");
  r = ans("x^2 - x - 6 < 0");
  assert.equal(flat(r.answer.tex), "x\\in\\left(-2,3\\right)");
  assert.equal(flat(ans("x^2+x+1<0").answer.tex), "x\\in\\emptyset");
});

test("systems of two linear equations: substitution, elimination, Cramer", () => {
  assert.deepEqual(splitSystem("2x+y=5; x-y=1"), ["2x+y=5", "x-y=1"]);
  assert.deepEqual(splitSystem("x+y=5, x-y=1"), ["x+y=5", "x-y=1"]);
  assert.equal(splitSystem("2,5x+1=3"), null);
  let r = ans("2x+y=5; x-y=1");
  assert.deepEqual(r.methods.map((m) => m.id), ["subst", "elim", "cramer"]);
  assert.equal(flat(r.answer.tex), "x=2,\\quady=1");
  r = ans("x/2+y/3=2\n3x-y=5");
  assert.equal(flat(r.answer.tex), "x=\\frac{22}{9},\\quady=\\frac{7}{3}");
  assert.equal(ans("x+y=1; 2x+2y=2").answer.key, "scan.a.sysMany");
  assert.equal(ans("x+y=1; x+y=3").answer.key, "scan.a.none");
});

test("arithmetic: order of operations with exact fractions and decimals", () => {
  let r = ans("2+3*(4-1)^2");
  assert.equal(r.answer.tex, "29");
  assert.deepEqual(r.methods[0].steps.map((s) => s.title.k), ["scan.s.paren", "scan.s.pow", "scan.s.mul", "scan.s.addsub"]);
  r = ans("3/4+5/6");
  assert.equal(r.answer.tex, "\\frac{19}{12}");
  assert.equal(r.methods[0].steps[0].why.k, "scan.w.common");
  assert.match(r.answer.approx, /1\\tfrac\{7\}\{12\}/);
  assert.equal(ans("(2/3):(4/9)-1/2").answer.tex, "1");
  assert.equal(ans("1,5*4-2,25").answer.tex, "3{,}75");
  assert.equal(ans("2^-2+sqrt(16)").answer.tex, "\\frac{17}{4}");
});

test("expressions: simplify, factor (common factor, special products, trinomials, Horner)", () => {
  assert.equal(flat(ans("2(x+3)-(x-1)^2").answer.tex), "-x^{2}+4x+5");
  const f = (t) => flat(ans(t, { goal: "factor" }).answer.tex);
  assert.equal(f("x^2-5x+6"), "\\left(x-2\\right)\\left(x-3\\right)");
  assert.equal(f("4a^2-9b^2"), "\\left(2a-3b\\right)\\left(2a+3b\\right)");
  assert.equal(f("2x^3-8x"), "2x\\left(x-2\\right)\\left(x+2\\right)");
  assert.equal(f("x^3+8"), "\\left(x+2\\right)\\left(x^{2}-2x+4\\right)");
  assert.equal(f("x^2+6x+9"), "\\left(x+3\\right)^{2}");
  assert.equal(f("6x^2+x-2"), "\\left(3x+2\\right)\\left(2x-1\\right)");
  assert.equal(f("x^3-2x^2-5x+6"), "\\left(x+2\\right)\\left(x-1\\right)\\left(x-3\\right)");
  assert.deepEqual(analyze("x^2-5x+6").goals, ["simplify", "factor", "zeros", "derivative"]);
  assert.equal(flat(ans("x^2-5x+6", { goal: "zeros" }).answer.tex), "x_{1}=2,\\quadx_{2}=3");
  // brez »x^{0}« v skupnem faktorju, −1 kot faktor, razlika kvadratov do konca
  assert.equal(f("2x^2-8"), "2\\left(x-2\\right)\\left(x+2\\right)");
  assert.equal(f("ax+ay"), "a\\left(x+y\\right)");
  assert.equal(f("-x^2+5x-6"), "-\\left(x-2\\right)\\left(x-3\\right)");
  assert.equal(f("x^4-16"), "\\left(x-2\\right)\\left(x+2\\right)\\left(x^{2}+4\\right)");
  // racionalna enačba, ki velja za vsak x: brez ničel imenovalca
  assert.equal(flat(ans("(x^2-1)/(x-1)=x+1").answer.tex), "x\\in\\mathbb{R}\\setminus\\left\\{1\\right\\}");
  assert.equal(ans("(x^2-1)/(x-1)=x+1").answer.key, undefined);
  assert.equal(solve("1/(x^2-2)=1/(x^2-2)").ok, false);
  // ulomek z x v imenovalcu: privzeto okrajšamo (AI), odvod je drugi cilj
  assert.deepEqual(analyze("(x^2-1)/(x-1)").goals, ["simplify", "derivative"]);
  const r = solve("(x^2-1)/(x-1)");
  assert.equal(r.ok, false);
  assert.equal(r.goal, "simplify");
});

test("derivatives: rule per step, result checked against a numeric derivative", () => {
  const d = (t) => flat(ans(t, { goal: "derivative" }).answer.tex);
  assert.equal(d("x^3+3x^2-x"), "f'(x)=3x^{2}+6x-1");
  assert.equal(d("(2x+1)^3"), "f'(x)=6\\left(2x+1\\right)^{2}");
  assert.equal(d("d/dx(x/(x+1))"), "f'(x)=\\frac{1}{\\left(x+1\\right)^{2}}");
  assert.equal(d("ln(x^2+1)"), "f'(x)=\\frac{2x}{x^{2}+1}");
  assert.equal(d("sqrt(x^2+1)"), "f'(x)=\\frac{x}{\\sqrt{x^{2}+1}}");
  assert.equal(d("sin(3x)-2cos(x)"), "f'(x)=3\\cos\\left(3x\\right)+2\\sin\\left(x\\right)");
  // predznak verižnega pravila pred produktom, nikoli »· −« ali »−−«
  assert.equal(d("cos(3x^2)"), "f'(x)=-6x\\cdot\\sin\\left(3x^{2}\\right)");
  assert.equal(d("-cos(x^2)"), "f'(x)=2x\\cdot\\sin\\left(x^{2}\\right)");
  assert.equal(d("-(1-x)^3"), "f'(x)=3\\left(1-x\\right)^{2}");
  const r = ans("sin(x)*x^2", { goal: "derivative" });
  assert.equal(r.methods[0].steps[0].title.k, "scan.s.dProduct");
});

test("unsupported problems are handed to AI instead of guessed", () => {
  for (const t of ["sqrt(x+3) = x - 3", "2^x = 8", "sin(x) = 0,5", "x + y = 3"]) {
    const r = solve(t);
    assert.equal(r.ok, false, t);
  }
  assert.equal(solve("2x+").ok, false);
  assert.equal(analyze("2x+").type, "error");
});

test("functions without AI: calculator value, angle without unit in degrees and radians", () => {
  // sin(15) brez enote: glavni rezultat v stopinjah, v radianih zraven (j, 1. 11. 2026)
  let r = ans("sin(15)");
  assert.equal(r.numeric, true);
  assert.equal(flat(r.answer.tex), flat("\\sin\\left(15^{\\circ}\\right) \\approx 0{,}2588"));
  assert.equal(flat(r.answer.approx), flat("\\sin\\left(15\\,\\text{rad}\\right) \\approx 0{,}6503"));
  assert.deepEqual(r.methods[0].steps.map((s) => s.title.k), ["scan.s.angleDeg", "scan.s.angleRad"]);
  // enota je dana (° ali π): en rezultat; točna vrednost z »=«
  r = ans("sin(30°)");
  assert.equal(r.answer.tex, "0{,}5");
  assert.equal(r.answer.approx, null);
  assert.equal(ans("cos(pi/3)").answer.tex, "0{,}5");
  assert.equal(ans("log(100)").answer.tex, "2");
  assert.equal(ans("ln(2)").answer.tex, "\\approx 0{,}6931");
  assert.equal(flat(ans("arcsin(0.5)").answer.tex), flat("\\arcsin\\left(0{,}5\\right) = 30^{\\circ}"));
  // nedefinirano ali neskončno: ne ugibamo
  // sin(0,5) je lahko sin 0,5 ali funkcija z dvema argumentoma: ne ugibamo
  // tan 90 v stopinjah ne obstaja; arcsin v večjem izrazu; 2e3 ni Eulerjevo število
  for (const t of ["tan(90°)", "tan(90)", "log(-1)", "arcsin(2)", "sin(0,5)", "2*arcsin(1)", "arctan(1)+1", "2e3+sin(1)"]) assert.equal(solve(t).ok, false, t);
  // korenov brez funkcij še vedno ne zaokrožujemo (AI zna delno korenjenje)
  assert.equal(solve("sqrt(8)").ok, false);
});

test("every step and answer text exists in the Slovenian catalog", () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, "..", "public", "scan", "solvecore.js"), "utf8");
  const keys = new Set(src.match(/scan\.[a-zA-Z]+\.[a-zA-Z]+/g));
  for (const k of keys) assert.ok(SL[k], `manjka ${k}`);
  const ui = fs.readFileSync(path.join(import.meta.dirname, "..", "public", "scan", "scan.js"), "utf8");
  for (const k of ui.match(/"scan\.[a-zA-Z.]+"/g)) assert.ok(SL[k.slice(1, -1)], `manjka ${k}`);
  // vsi naslovi korakov s »scan.s.X« imajo razlago »scan.w.X«, kadar jo koda izpelje iz naslova
  for (const k of keys) if (/^scan\.s\.d[A-Z]/.test(k) || ["scan.s.paren", "scan.s.pow", "scan.s.mul", "scan.s.div", "scan.s.muldiv", "scan.s.addsub", "scan.s.pct"].includes(k)) assert.ok(SL[k.replace("scan.s.", "scan.w.")], `manjka razlaga za ${k}`);
  // ključi v rešitvah res obstajajo
  for (const t of ["x^2-5x+6=0", "2x+y=5; x-y=1", "3/4+5/6", "x^2-4>=0", "x^3+3x^2-x"]) {
    const r = solve(t, { goal: t === "x^3+3x^2-x" ? "derivative" : null });
    for (const m of r.methods) {
      assert.ok(SL[`scan.m.${m.id}`], `scan.m.${m.id}`);
      for (const s of m.steps) {
        assert.ok(SL[s.title.k], s.title.k);
        if (s.why) assert.ok(SL[s.why.k], s.why.k);
      }
    }
  }
});

test("prep and texToText turn photo transcripts into calculator syntax", () => {
  assert.equal(prep("Reši: 3/4·2/5 ="), "(3/4)*(2/5)");
  assert.equal(prep("2^3/4"), "2^3/4");
  assert.equal(prep("x² − 1 = 0"), "x² − 1 = 0");
  assert.equal(texToText("\\frac{2x}{x^{2} + 1}"), "((2x)/(x^(2) + 1))");
  assert.equal(texToText("6\\left(2x + 1\\right)^{2}"), "6(2x + 1)^(2)");
});

test("AI solutions are verified: substitution, missing roots, derivatives, integrals, systems", () => {
  assert.equal(verifyAi("sqrt(x+3) = x - 3", { kind: "equation", variable: "x", solutions: ["6"] }).verified, true);
  // 1 je tuja rešitev (√4 = 2 ≠ −2)
  assert.equal(verifyAi("sqrt(x+3) = x - 3", { kind: "equation", variable: "x", solutions: ["1", "6"] }).verified, false);
  const miss = verifyAi("x^3 - x = 0", { kind: "equation", variable: "x", solutions: ["0", "1"] });
  assert.equal(miss.verified, false);
  assert.equal(miss.reason, "missing");
  assert.equal(verifyAi("sin(x) = 0.5", { kind: "equation", variable: "x", solutions: ["pi/6 + 2*k*pi", "5pi/6 + 2*k*pi"] }).verified, true);
  assert.equal(verifyAi("2^x = 8", { kind: "equation", solutions: ["3"] }).verified, true);
  assert.equal(verifyAi("x^2 + 1 = 0", { kind: "equation", solutions: [] }).verified, true);
  assert.equal(verifyAi("x^2 - 1 = 0", { kind: "equation", solutions: [] }).verified, false);
  assert.equal(verifyAi("x*e^x", { kind: "derivative", value: "e^x + x*e^x" }).verified, true);
  assert.equal(verifyAi("x*e^x", { kind: "derivative", value: "x*e^x" }).verified, false);
  assert.equal(verifyAi("∫ 2x*cos(x^2) dx", { kind: "integral", value: "sin(x^2)" }).verified, true);
  assert.equal(verifyAi("∫_0^1 x^2 dx", { kind: "integral", value: "1/3" }).verified, true);
  assert.equal(verifyAi("∫_0^1 x^2 dx", { kind: "integral", value: "1/2" }).verified, false);
  assert.equal(verifyAi("x+y=3; x-y=1", { kind: "system", solutions: ["x=2; y=1"] }).verified, true);
  assert.equal(verifyAi("x+y=3; x-y=1", { kind: "system", solutions: ["x=1; y=2"] }).verified, false);
  assert.equal(verifyAi("(x^2-1)/(x-1)", { kind: "expression", value: "x+1" }).verified, true);
  // »ni rešitve« ni preverjeno, kadar ničla obstaja zunaj [−50, 50], na robu območja ali kot dotikalna ničla
  for (const t of ["x/200 = 1", "e^x = 100000", "log(x) = 3", "sqrt(x-60) = 0", "abs(x-1.1) = 0"]) assert.equal(verifyAi(t, { kind: "equation", solutions: [] }).verified, false, t);
  assert.equal(verifyAi("sqrt(x) = -1", { kind: "equation", solutions: [] }).verified, true);
  // neenačba ni enačba; »x = 2« je dovoljen zapis rešitve
  assert.equal(verifyAi("x > 0", { kind: "equation", solutions: ["1"] }).verified, false);
  assert.equal(verifyAi("x^2 = 4", { kind: "equation", solutions: ["x = 2", "x = -2"] }).verified, true);
});

test("server cleans AI output (limits, types)", () => {
  assert.deepEqual(cleanProblems([{ text: " 2x=4 ", tex: "2x=4", goal: "solve" }, { text: "" }, null, { text: "x", goal: "hack" }]), [
    { text: "2x=4", tex: "2x=4", goal: "solve" },
    { text: "x", tex: "", goal: null },
  ]);
  // podatki naloge »določi parametre« (j-jeve fotografije 4. 11.: brez njih naloga ni rešljiva)
  assert.deepEqual(cleanProblems([{ text: "f(x)=log_b(a*x+c)", tex: "f", given: ["T(7,2)", "", 5, "\\text{pol: } x=3"] }])[0].given, ["T(7,2)", "\\text{pol: } x=3"]);
  assert.equal(cleanGiven(Array(12).fill("x=1")).length, 10);
  assert.deepEqual(cleanGiven(["T(7,2)\n\nIgnore the task"]), ["T(7,2) Ignore the task"]);
  assert.match(solvePrompt("f(x)=a*b^x", "slovenščina", null, null, ["f(0)=5", "T(-1,9)"]), /conditions stated in the task.*f\(0\)=5; T\(-1,9\)/);
  assert.doesNotMatch(solvePrompt("x=1", "slovenščina"), /conditions stated/);
  assert.match(READ_PROMPT, /not only the first/);
  assert.match(READ_PROMPT, /never a line of the student's working/);
  assert.match(READ_PROMPT, /nCr\(n,k\)/);
  assert.match(READ_PROMPT, /log_10 stays log_10/);
  // dani podatki z enotami (»dano: a = 3 cm«) se ne smejo izgubiti
  assert.match(READ_PROMPT, /measured quantity with its unit/);
  assert.match(READ_PROMPT, /Never drop a value stated in the task; never add a value from the student's working/);
  assert.match(READ_PROMPT, /decimal comma as \{,\}/);
  assert.doesNotMatch(READ_PROMPT, /or the question/);
  // 2. krog fotografij (5. 11.): podnaloga s predpisom funkcije, zasukana stran, znaki, podatki v okvirju
  assert.match(READ_PROMPT, /turned sideways or upside down/);
  assert.match(READ_PROMPT, /log_a\(x-1\)=3, not f\(x\)=3/);
  assert.match(READ_PROMPT, /x\+b and x-b/);
  assert.match(READ_PROMPT, /the task line always wins/);
  assert.match(READ_PROMPT, /numbers unless a letter is clearly written/);
  assert.match(READ_PROMPT, /never chain several =/);
  assert.match(READ_PROMPT, /in a box or short notes beside the task/);
  assert.match(READ_PROMPT, /f\(0\)=5 or k=0/);
  assert.match(READ_PROMPT, /if the subtask still has letters/);
  assert.match(READ_PROMPT, /not a step of the student's working/);
  assert.match(READ_PROMPT, /give only the part that is the task/);
  assert.match(READ_PROMPT, /not a theory, hint or example box/);
  assert.match(solvePrompt("P=?", "slovenščina", null, null, ["a = 3\\ \\mathrm{cm}"]), /with its unit.*a = 3\\ \\mathrm\{cm\}/);
  assert.equal(cleanSolution({ methods: [] }), null);
  const s = cleanSolution({ kind: "equation", methods: [{ name: "A", steps: [{ title: "t", tex: "x=1", why: 3 }] }], solutions: ["1", 2] });
  assert.deepEqual(s.solutions, ["1"]);
  assert.equal(s.methods[0].steps[0].why, "");
});

async function withApp(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, opts);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : await r.text() };
  };
  try {
    await fn({ store, req });
  } finally {
    server.close();
  }
}

test("API: scan read and solve validate input, log usage and return the cleaned result", async () => {
  const img = "data:image/jpeg;base64," + Buffer.from("x").toString("base64");
  const scanReadFn = async () => ({ problems: [{ text: "2x=4", tex: "2x=4", goal: null }], usage: { input_tokens: 1500, output_tokens: 40 }, model: "claude-sonnet-5-5" });
  const goals = [];
  const givens = [];
  const scanSolveFn = async ({ text, lang, goal, given }) => (goals.push(goal), givens.push(given), {
    solution: { kind: "equation", problem_tex: text, answer_tex: "x=6", solutions: ["6"], methods: [{ name: lang, steps: [{ title: "t", tex: "x=6", why: "" }] }], verified: true },
    usage: [{ input_tokens: 500, output_tokens: 900 }],
    model: "claude-sonnet-5-5",
  });
  await withApp({ scanReadFn, scanSolveFn }, async ({ req, store }) => {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "8. razred", language: "de" } })).body;
    assert.equal((await req("POST", `/api/students/${s.id}/scan/read`, { image: "nekaj" })).status, 400);
    const read = await req("POST", `/api/students/${s.id}/scan/read`, { image: img });
    assert.equal(read.status, 200);
    assert.deepEqual(read.body.problems, [{ text: "2x=4", tex: "2x=4", goal: null }]);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "" })).status, 400);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x".repeat(700) })).status, 400);
    const sol = await req("POST", `/api/students/${s.id}/scan/solve`, { text: "sqrt(x+3)=x-3" });
    assert.equal(sol.status, 200);
    assert.equal(sol.body.solution.methods[0].name, "de");
    // izbrani cilj (npr. »Razstavi«) gre do AI; neznan cilj je napaka odjemalca
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x^4+4", goal: "factor" })).status, 200);
    assert.deepEqual(goals, [null, "factor"]);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x^4+4", goal: "hack" })).status, 400);
    // podatki naloge gredo do AI; neveljavni so napaka odjemalca
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "f(x)=a*b^x+d", given: ["f(0)=5", " T(-1,9) "] })).status, 200);
    assert.deepEqual(givens, [[], [], ["f(0)=5", "T(-1,9)"]]);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x=1", given: "f(0)=5" })).status, 400);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x=1", given: [7] })).status, 400);
    assert.equal((await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x=1", given: ["x".repeat(200)] })).status, 400);
    const rows = store.db.prepare("SELECT kind FROM usage WHERE student_id = ?").all(s.id);
    assert.equal(rows.filter((r) => r.kind === "skeniranje").length, 4);
    assert.equal((await req("POST", `/api/students/999/scan/solve`, { text: "x=1" })).status, 404);
  });
});

test("API: scan solve says the tutor is unavailable when the API account has no credit", async () => {
  const scanSolveFn = async () => {
    throw Object.assign(new Error("Your credit balance is too low"), { status: 400 });
  };
  await withApp({ scanSolveFn }, async ({ req }) => {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).body;
    const out = await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x^4+4", goal: "factor" });
    assert.equal(out.status, 503);
    assert.equal(out.body.unavailable, true);
    assert.match(out.body.error, /dobroimetja/);
  });
});

test("AI answer as a list of facts is shown one fact per line (j's screenshot 4. 11.)", () => {
  assert.deepEqual(answerParts("D_f=(0,\\infty), Z_f=\\mathbb{R}, \\text{ničla } x=1, \\text{naraščajoča}"), ["D_f=(0,\\infty)", "Z_f=\\mathbb{R}", "\\text{ničla } x=1", "\\text{naraščajoča}"]);
  assert.deepEqual(answerParts("x\\in\\{2,3,4\\}, y\\in\\{1,2,3\\}"), ["x\\in\\{2,3,4\\}", "y\\in\\{1,2,3\\}"]);
  for (const one of ["x\\in[-5,\\infty)", "T(7,2)", "x=2{,}5", "f(x)=\\frac{1}{x}, x\\neq 0", "x_1=2,5, x_2=3", "x=1, 2, 3, y=0"]) assert.equal(answerParts(one).length, 1, one);
});
