// Skeniranje nalog (zaslon »Skeniraj«, public/scan/):
//   POST /api/students/:id/scan/read   { image: dataURL }  → { problems: [{ text, tex }] }  prepis s fotografije
//   POST /api/students/:id/scan/solve  { text, goal? }     → { solution }                   AI rešitev po korakih
// Večino nalog reši brez AI že vmesnik (public/scan/solvecore.js). AI pride na vrsto le pri nalogah, ki jih
// ta ne zna (koreni, logaritmi, trigonometrija, integrali …). AI rešitev strežnik preveri z isto kodo kot vmesnik
// (public/scan/verify.js); nepreverjena se pokaže z opozorilom, nikoli kot »preverjeno«.
import { getClient, isMockMode, quickParams, MODEL_MID, errorText, apiErrorCode } from "./claude.js";
import { verifyAi } from "../public/scan/verify.js";
import { languagePrompt } from "./prompt.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
// Branje matematike z rokopisa zahteva natančen model; ena fotografija je ~1500 žetonov.
const READ_MODEL = () => env("EVKLID_SCAN_MODEL", MODEL_MID);
const SOLVE_MODEL = () => env("EVKLID_SCAN_SOLVE_MODEL", MODEL_MID);
const MAX_IMAGE = 6 * 1024 * 1024;
const MAX_TEXT = 600;

const jsonFrom = (raw) => {
  try {
    return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
  } catch {
    return null;
  }
};
const textOf = (msg) => msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");

export const READ_PROMPT =
  "The image shows a maths task (printed or handwritten) that a student photographed to get a step-by-step solution. " +
  "Transcribe every separate maths problem you can see, exactly as written (do not solve, do not fix mistakes, do not invent missing parts). " +
  "A page often holds several tasks (numbered, side by side or one below another): list each of them, not only the first. Subtasks a), b), c) count as separate tasks when each has its own equation or expression (e.g. a later f(x)=4).\n" +
  "Give each task as originally stated, never a line of the student's working or a result: if a task is followed by its solution, give only the task; if only working is visible, give its first line. " +
  "If any maths is legible, never return an empty list: when unsure whether a line is a task, include it.\n" +
  "For each problem give:\n" +
  '- "text": the problem in calculator syntax: * for multiplication, / for division and fractions with parentheses ((x+1)/2), ^ for powers, sqrt(), abs(), sin(), ln(), log(), pi, e; ' +
  "decimal point as a dot; an equation with =, inequalities with <, >, <=, >=; a system as equations separated by ; ; a derivative as d/dx(...); an integral as ∫ f dx or ∫_a^b f dx; " +
  "a limit as lim_(x->a) f; a binomial coefficient (n choose k) or C_n^k as nCr(n,k); variations V_n^k as nPr(n,k); a factorial as n!; " +
  "a double inequality as a<x<b; a logarithm with its base as log_10(x), log_2(x), log_a(x). Keep the student's letters for variables. " +
  "Copy every base, index and exponent exactly as written: never replace a written digit by a letter (log_10 stays log_10, not log_a).\n" +
  '- "given": only if the task states data or conditions needed to solve it (a measured quantity with its unit such as a = 3 cm, m = 2 kg or α = 30°, ' +
  "a point on the graph, an asymptote, a pole, a zero, a domain, a value such as f(0)=5, also when written in a »dano:« / »podatki:« line or only in the sentence): " +
  'a list of them in LaTeX, one each, in the words of the page, keeping every unit and writing a decimal comma as {,} (e.g. ["a = 3\\\\ \\\\mathrm{cm}", "b = 2{,}5\\\\ \\\\mathrm{cm}", "T(7,2)", "\\\\text{pol: } x=3", "f(0)=5"]). Never drop a value stated in the task; never add a value from the student\'s working or a result, never invent one, and leave out a bare domain such as x ∈ ℝ. Otherwise leave it out.\n' +
  "For a word or geometry problem without one equation or expression, give as \"text\" only the unknown asked for in calculator syntax as <letter>=? (e.g. P=?, v=?), never a sentence, and every stated value in \"given\".\n" +
  '- "tex": the same problem in LaTeX.\n' +
  "Ignore task numbers (1., a)), the wording of instructions (but keep their conditions in \"given\") and crossed-out work. If the instruction says what to do (Razstavi / factor, Poenostavi / simplify, Izračunaj / evaluate, Odvajaj / differentiate), add \"goal\": factor|simplify|evaluate|derivative|solve.\n" +
  'Return only JSON: {"problems":[{"text":"...","tex":"...","goal":"...","given":["..."]}]} (most prominent problem first, at most 6). If no maths is readable: {"problems":[]}.\n' +
  // Fotografije, ki niso učno gradivo, zavrnemo (j, 2026-10-30); slike strežnik nikoli ne shrani.
  'Accept schoolwork even if people appear in the frame (book illustrations, a teacher at a whiteboard, hands). Only if a person or a private item is the main subject (face, selfie, ID or other personal document, private message) or it is a random scene, do not describe it and return only {"problems":[],"unrelated":true}. If unsure, read it.';

export async function readMathPhoto({ imageBase64, mediaType = "image/jpeg" }) {
  const model = READ_MODEL();
  if (isMockMode()) return { mock: true, problems: [], usage: null, model };
  const final = await getClient().messages.create({
    model,
    max_tokens: 2000, // več nalog na strani in njihovi podatki
    ...quickParams(model),
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: READ_PROMPT },
        ],
      },
    ],
  });
  const data = jsonFrom(textOf(final)) || {};
  return { problems: data.unrelated === true ? [] : cleanProblems(data.problems), unrelated: data.unrelated === true, usage: final.usage, model: final.model || model };
}

const GOALS = ["factor", "simplify", "evaluate", "derivative", "solve"];
export function cleanProblems(list) {
  return (Array.isArray(list) ? list : [])
    .filter((p) => p && typeof p.text === "string" && p.text.trim())
    .slice(0, 6)
    .map((p) => {
      const given = cleanGiven(p.given);
      return {
        text: p.text.trim().slice(0, MAX_TEXT),
        tex: typeof p.tex === "string" ? p.tex.trim().slice(0, MAX_TEXT * 2) : "",
        goal: GOALS.includes(p.goal) ? p.goal : null,
        ...(given.length ? { given } : {}),
      };
    });
}

// Pogoji naloge »določi parametre« (točka, asimptota, pol, ničla …): brez njih naloga ni rešljiva.
const MAX_GIVEN = 10; // fizikalne naloge imajo lahko več danih količin
const MAX_GIVEN_LEN = 160;
export function cleanGiven(list) {
  return (Array.isArray(list) ? list : [])
    .filter((g) => typeof g === "string" && g.trim())
    .slice(0, MAX_GIVEN)
    .map((g) => g.replace(/\s+/g, " ").trim().slice(0, MAX_GIVEN_LEN)); // brez novih vrstic v pozivu
}

// Cilj, ki ga je učenec izbral na zaslonu (npr. »Razstavi«): brez njega bi AI izraz morda le poenostavil.
const GOAL_TEXT = {
  factor: "Task: factor the expression completely (kind expression, value = the factored form).",
  simplify: "Task: simplify the expression (kind expression).",
  evaluate: "Task: evaluate it (kind arith).",
  derivative: "Task: differentiate it with respect to the variable (kind derivative).",
  solve: "Task: solve it.",
};

export function solvePrompt(text, lang, feedback = null, goal = null, given = []) {
  return (
    `A student wants a step-by-step solution of this maths problem (calculator syntax): ${text}\n` +
    (given.length ? `Data and conditions stated in the task (LaTeX; use them with their units, e.g. to find the parameters or the asked quantity, and give the answer with its unit): ${given.join("; ")}\n` : "") +
    (GOAL_TEXT[goal] ? `${GOAL_TEXT[goal]}\n` : "") +
    `Write every title and explanation in ${lang}, simply, for a student at school level; use the notation of Slovenian schools (decimal comma in LaTeX as {,}, intervals with ( ) and [ ], »D« for the discriminant).\n` +
    "Solve it correctly; check your result yourself before answering. Steps must be small (one idea each), as a good teacher writes them on the board. Give a second method only if it is commonly taught.\n" +
    "Return only JSON:\n" +
    '{"kind":"equation|inequality|system|expression|arith|derivative|integral|limit|other","variable":"x","problem_tex":"LaTeX",' +
    '"answer_tex":"LaTeX of the final answer","solutions":["values in calculator syntax, one per solution (equations); for periodic solutions use k, e.g. pi/6+2*k*pi; for a system one string like x=2; y=-1"],' +
    '"value":"final result in calculator syntax (expression, arith, derivative, integral without +C, limit)",' +
    '"methods":[{"name":"short method name","steps":[{"title":"what we do, one sentence","tex":"LaTeX of the line after this step","why":"why this step is allowed or how to do it, 1–3 sentences; inline maths in $...$"}]}]}' +
    (feedback ? `\nYour previous answer failed an automatic check (${feedback}). Find the mistake and answer again.` : "")
  );
}

export function cleanSolution(s) {
  if (!s || typeof s !== "object") return null;
  const str = (v, n = 600) => (typeof v === "string" ? v.slice(0, n) : "");
  const methods = (Array.isArray(s.methods) ? s.methods : [])
    .slice(0, 3)
    .map((m) => ({
      name: str(m?.name, 60),
      steps: (Array.isArray(m?.steps) ? m.steps : []).slice(0, 25).map((st) => ({ title: str(st?.title, 300), tex: str(st?.tex, 800), why: str(st?.why, 800) })),
    }))
    .filter((m) => m.steps.length);
  if (!methods.length) return null;
  return {
    kind: str(s.kind, 20),
    variable: str(s.variable, 2),
    problem_tex: str(s.problem_tex, 800),
    answer_tex: str(s.answer_tex, 800),
    solutions: (Array.isArray(s.solutions) ? s.solutions : []).filter((x) => typeof x === "string").slice(0, 8).map((x) => x.slice(0, 120)),
    value: str(s.value, 400),
    methods,
  };
}

export async function solveWithAi({ text, lang = "sl", goal = null, given = [] }) {
  const model = SOLVE_MODEL();
  if (isMockMode()) return { mock: true, solution: null, usage: null, model };
  const ask = async (feedback) => {
    const final = await getClient().messages.create({
      model,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: solvePrompt(text, languagePrompt(lang), feedback, goal, given) }],
    });
    return { sol: cleanSolution(jsonFrom(textOf(final))), usage: final.usage, model: final.model || model };
  };
  let out = await ask(null);
  let usage = [out.usage];
  let check = out.sol ? verifyAi(text, out.sol) : { verified: false, reason: "parse" };
  // Ena ponovitev, kadar preverjanje pokaže napačno ali manjkajočo rešitev. Pri nalogi s podatki (parametri)
  // preverjanje vidi le predlogo f(x) = …, zato ponovitve ne sproži (rešitev ostane označena kot nepreverjena).
  if (out.sol && !given.length && !check.verified && (check.reason === "wrong" || check.reason === "missing")) {
    const fb = check.reason === "missing" ? `x ≈ ${check.missing.slice(0, 6).map((m) => m.toFixed(4)).join(", ")} also satisfies the equation` : "substituting your result back does not give the original";
    const again = await ask(fb);
    usage.push(again.usage);
    const c2 = again.sol ? verifyAi(text, again.sol) : { verified: false };
    if (again.sol && (c2.verified || !out.sol)) {
      out = again;
      check = c2;
    }
  }
  return { solution: out.sol ? { ...out.sol, verified: !!check.verified, check: check.reason || null } : null, usage, model: out.model };
}

export function mountScan(app, { loadStudent, usage, readFn = readMathPhoto, solveFn = solveWithAi }) {
  app.post("/api/students/:id/scan/read", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(String(req.body?.image || ""));
    if (!m || m[2].length > MAX_IMAGE) return res.status(400).json({ error: "Slika manjka ali je prevelika." });
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    try {
      const out = await readFn({ imageBase64: m[2], mediaType: m[1] });
      if (out.mock) return res.json({ problems: [], mock: true });
      if (out.usage) usage?.log(s.id, out.model, out.usage, "skeniranje");
      res.json({ problems: out.problems, ...(out.unrelated ? { unrelated: true } : {}) });
    } catch (err) {
      console.error("[evklid] skeniranje:", err?.message || err);
      res.status(502).json({ error: errorText(err, "Branje fotografije trenutno ne deluje. Nalogo vpiši s tipkami.") });
    }
  });

  app.post("/api/students/:id/scan/solve", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > MAX_TEXT) return res.status(400).json({ error: "Naloga manjka ali je predolga." });
    const goal = req.body?.goal ?? null;
    if (goal !== null && !GOALS.includes(goal)) return res.status(400).json({ error: "Neznan cilj naloge." });
    const rawGiven = req.body?.given ?? [];
    if (!Array.isArray(rawGiven) || rawGiven.length > MAX_GIVEN || rawGiven.some((g) => typeof g !== "string" || g.length > MAX_GIVEN_LEN))
      return res.status(400).json({ error: "Podatki naloge niso veljavni." });
    const given = cleanGiven(rawGiven);
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    try {
      const out = await solveFn({ text, goal, given, lang: s.settings?.language || "sl" });
      if (out.mock) return res.json({ solution: null, mock: true });
      for (const u of [].concat(out.usage || [])) if (u) usage?.log(s.id, out.model, u, "skeniranje");
      if (!out.solution) return res.status(502).json({ error: "Rešitve ni bilo mogoče sestaviti. Poskusi znova ali vprašaj inštruktorja." });
      res.json({ solution: out.solution });
    } catch (err) {
      console.error("[evklid] reševanje:", err?.message || err);
      // Inštruktor (AI) ni na voljo (ni dobroimetja, ključ, preobremenjenost): vmesnik pokaže prijazno
      // sporočilo v jeziku učenca (scan.tutorDown), koda ostane v besedilu za iskanje napake.
      const unavailable = /^(400 ni dobroimetja|401|403|429|529)/.test(apiErrorCode(err) || "");
      res.status(unavailable ? 503 : 502).json({ error: errorText(err, "Reševanje trenutno ne deluje. Poskusi znova čez trenutek."), ...(unavailable ? { unavailable: true } : {}) });
    }
  });
}
