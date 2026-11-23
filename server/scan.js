// Skeniranje nalog (zaslon »Skeniraj«, public/scan/):
//   POST /api/students/:id/scan/read   { image: dataURL }  → { problems: [{ text, tex, goal, given?, sought? }] }  prepis s fotografije
//   POST /api/students/:id/scan/solve  { text, goal?, given?, sought? } → { solution }       AI rešitev po korakih
// Večino nalog reši brez AI že vmesnik (public/scan/solvecore.js). AI pride na vrsto le pri nalogah, ki jih
// ta ne zna (koreni, logaritmi, trigonometrija, integrali …). AI rešitev strežnik preveri z isto kodo kot vmesnik
// (public/scan/verify.js); nepreverjena se pokaže z opozorilom, nikoli kot »preverjeno«.
import { AI_JSON } from "./ai-oznaka.js";
import { getClient, isMockMode, quickParams, MODEL, MODEL_MID, errorText, apiErrorCode } from "./claude.js";
import { verifyAi } from "../public/scan/verify.js";
import { prep, splitSystem } from "../public/scan/solvecore.js";
import { casCheck } from "./cas.js";

// AI rešitev preverita dve neodvisni kodi: numerična (public/scan/verify.js) in SymPy (server/cas.js).
// SymPy je odločilen, kadar se odloči (true/false); kadar ne zna (null), velja numerično preverjanje.
// Ujame tudi rešitve izven numeričnega iskanja (|x| > 10⁶) in točne vrednosti (√2 proti 1,414).
// Pri nalogi s podatki (given) je besedilo le predloga s parametri: tam SymPy ne odloča.
// Kjer numerika popolnosti ne more preveriti (partial: sistem, periodične rešitve, »ni rešitve«), brez
// odločitve SymPy rešitev ni »preverjena«, ampak nepreverjena (reason "unknown"; AUDIT-001).
export async function verifyAiFull(text, sol, { cas = true } = {}) {
  const num = verifyAi(text, sol);
  const c = cas ? await casScan(text, sol).catch(() => ({ ok: null })) : { ok: null };
  if (c.ok === true) return { verified: true, reason: null };
  if (c.ok === false) {
    const missing = num.reason === "missing" || /^manjka rešitev/.test(c.why || "");
    return { verified: false, reason: missing ? "missing" : "wrong", missing: num.missing || [], cas: c.why };
  }
  if (num.verified && num.partial) return { verified: false, reason: "unknown" };
  return num;
}

async function casScan(text, sol) {
  const v = /^[a-zA-Z]$/.test(sol?.variable || "") ? sol.variable : "x";
  const sols = (sol?.solutions || []).map((x) => String(x).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, "").trim()).filter(Boolean);
  if (sol?.kind === "equation") return casCheck("solve", [prep(text), v, sols.length ? sols.join(", ") : "none"]);
  if (sol?.kind === "system") {
    const eqs = (splitSystem(text) || String(text).split(/;|\n/).filter((x) => x.includes("="))).map((e) => prep(e));
    const names = [...new Set(eqs.join(" ").match(/\b[a-z]\b/g) || [])].filter((n) => n !== "e");
    // Vse rešitve naenkrat (»x=3, y=4; x=4, y=3«), da SymPy preveri tudi popolnost; prej je sistem z več
    // rešitvami SymPy preskočil in odločila je numerika, ki popolnosti ne preveri (AUDIT-001).
    const claims = (sol.solutions || []).map((s) => String(s).replace(/;/g, ",").trim()).filter(Boolean);
    if (!eqs.length || !claims.length) return { ok: null };
    return casCheck("solve", [eqs.join(", "), names.join(", "), claims.join("; ")]);
  }
  if ((sol?.kind === "expression" || sol?.kind === "arith") && sol.value) return casCheck("equal", [prep(text), prep(sol.value)]);
  if (sol?.kind === "derivative" && sol.value) {
    const f = String(text).replace(/^\s*(d\/d[a-z]|f\(x\)\s*=)\s*/, "");
    return casCheck("diff", [prep(f), v, prep(sol.value)]);
  }
  return { ok: null };
}
import { languagePrompt } from "./prompt.js";
import { imageCallReserveUsd, callMaxUsd } from "./meje-ai.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
// Branje matematike z rokopisa zahteva natančen model; ena fotografija je ~1500 žetonov.
const READ_MODEL = () => env("EVKLID_SCAN_MODEL", MODEL_MID);
const SOLVE_MODEL = () => env("EVKLID_SCAN_SOLVE_MODEL", MODEL_MID);
// Branje naloge za Inštruktorja (kamera v klepetu, j 17. 11.): privzeto hitri model inštruktorja (Haiku), ker učenec
// prepis pregleda in popravi, preden gre inštruktorju; strošek in izbira modela: docs/stroski-ai.md »Skener v Inštruktorju«.
const TASK_READ_MODEL = () => env("EVKLID_SCAN_TUTOR_MODEL", MODEL);
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
  "Look at the whole image first: the page may be turned sideways or upside down, and tasks may stand to the right of others. " +
  "A page often holds several tasks (numbered, side by side or one below another): list each of them, not only the first. Subtasks a), b), c) count as separate tasks when each has its own equation, inequality or expression (e.g. a later f(x)=3, f(x)=g(x) or f(x)<g(x)). " +
  'Make such a subtask self-contained: put in the formula of each named function as first written in the task, with its letters for unknown parameters, never a later line where the student has put in values found (log_a(x-1)=3, not f(x)=3 and not log_2(x-1)=3 with a value the student found; sqrt(x)<2-x, not f(x)<g(x)); keep the order and direction of every inequality sign, and if the subtask still has letters for unknown parameters, repeat the "given" of the task it belongs to. ' +
  "Exception: a line under a function where a number stands in place of f(x) or y (5=3*sqrt(x+2)-1) and that is not a step of the student's working is the subtask f(x)=5: list it as 3*sqrt(x+2)-1=5. When you list the function's own line, give it as written, f(x)=…, not only its right-hand side.\n" +
  "Give each task as originally stated, never a line of the student's working or a result: if a task is followed by its solution, give only the task; if only working is visible, give its first line. " +
  "If any maths is legible, never return an empty list: when unsure whether a line is a task, include it.\n" +
  "For each problem give:\n" +
  '- "text": the problem in calculator syntax: * for multiplication, / for division and fractions with parentheses ((x+1)/2), ^ for powers, sqrt(), abs(), sin(), ln(), log(), pi, e; ' +
  "decimal point as a dot; an equation with =, inequalities with <, >, <=, >=; a system as equations separated by ; ; a derivative as d/dx(...); an integral as ∫ f dx or ∫_a^b f dx; " +
  "a limit as lim_(x->a) f; a binomial coefficient (n choose k) or C_n^k as nCr(n,k); variations V_n^k as nPr(n,k); a factorial as n!; " +
  "a double inequality as a<x<b; a logarithm with its base as log_10(x), log_2(x), log_a(x). Keep the student's letters for variables. " +
  "Copy every base, index and exponent exactly as written: never replace a written digit by a letter (log_10 stays log_10, not log_a). " +
  "Read every sign and digit with care (x+b and x-b; 1, 4 and 7, which look alike in handwriting). If one is unclear, the student's next lines may help with a sign or a letter, but the task line always wins: never change a written value to match the working. " +
  "Coordinates of a point and the values in conditions are numbers unless a letter is clearly written.\n" +
  'Each "text" is one expression, one equation or one inequality (or a system): never chain several = or a definition and an inequality: give only the part that is the task (x^2>4 for h(x)=x^2>4, nCr(5,2) for nCr(5,2)=5!/(2!*3!)); a right-hand side that is working or a result is left out.\n' +
  '- "given": only if the task states data or conditions needed to solve it (a measured quantity with its unit such as a = 3 cm, m = 2 kg or α = 30°, ' +
  "a point on the graph, an asymptote, a pole, a zero, a domain, a value such as f(0)=5 or k=0, a set of allowed digits or elements such as {1,2,4,8}, also when written in a »dano:« / »podatki:« line, in a box or short notes beside the task that belong to it (not a theory, hint or example box), or only in the sentence): " +
  'a list of them in LaTeX, one each, with the meaning of the page, keeping every unit and writing a decimal comma as {,} (e.g. ["a = 3\\\\ \\\\mathrm{cm}", "b = 2{,}5\\\\ \\\\mathrm{cm}", "T(7,2)", "\\\\text{pol: } x=3", "f(0)=5"]). Never drop a value stated in the task; never add a value from the student\'s working or a result, never invent one, and leave out a bare domain such as x ∈ ℝ. Otherwise leave it out.\n' +
  '- "sought": what the task asks you to find is never data. If it is already "text" as <letter>=?, or it is what "goal" does to "text" (solve it, its zeros, simplify, factor, evaluate, differentiate), leave "sought" out. ' +
  'Otherwise (e.g. the angle at which the graph cuts the x-axis, the vertex of the parabola) write it in "sought" as one short phrase (LaTeX for maths), in the language of the language line below, e.g. in Slovene "\\\\text{kot, pod katerim graf seka os x}".\n' +
  "For a word or geometry problem without one equation or expression, give as \"text\" only the unknown asked for in calculator syntax as <letter>=? (e.g. P=?, v=?), never a sentence, and every stated value in \"given\".\n" +
  '- "tex": the same problem in LaTeX.\n' +
  "Ignore task numbers (1., a)), the wording of instructions (but keep their conditions in \"given\") and crossed-out work. If the instruction says what to do (Razstavi / factor, Poenostavi / simplify, Izračunaj / evaluate, Odvajaj / differentiate), add \"goal\": factor|simplify|evaluate|derivative|solve; if there is neither such an instruction nor an equation or inequality to solve, leave \"goal\" out.\n" +
  'Return only JSON: {"problems":[{"text":"...","tex":"...","goal":"...","given":["..."],"sought":"..."}]} (most prominent problem first, at most 6). If no maths is readable: {"problems":[]}.\n' +
  // Fotografije, ki niso učno gradivo, zavrnemo (j, 2026-10-30); slike strežnik nikoli ne shrani.
  'Accept schoolwork even if people appear in the frame (book illustrations, a teacher at a whiteboard, hands). Only if a person or a private item is the main subject (face, selfie, ID or other personal document, private message) or it is a random scene, do not describe it and return only {"problems":[],"unrelated":true}. If unsure, read it.';

// lang: jezik aplikacije (j 14. 11. 2026: besede v »Podatki« so bile v angleščini). V svojem bloku za READ_PROMPT,
// da READ_PROMPT ostane enak za vse jezike (klic nima cache_control; slika je pred navodili).
export const readLangLine = (lang) => `Language line: write every word in "given" and "sought" (inside \\text{}) in ${languagePrompt(lang || "sl")}, never in English unless that is the language; keep maths, units and symbols as written.`;
export async function readMathPhoto({ imageBase64, mediaType = "image/jpeg", lang = "sl" }) {
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
          { type: "text", text: readLangLine(lang) },
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
      const sought = cleanSought(p.sought);
      return {
        text: p.text.trim().slice(0, MAX_TEXT),
        tex: typeof p.tex === "string" ? p.tex.trim().slice(0, MAX_TEXT * 2) : "",
        goal: GOALS.includes(p.goal) ? p.goal : null,
        ...(given.length ? { given } : {}),
        ...(sought ? { sought } : {}),
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
// Iskana količina (»kot, pod katerim graf seka os x«): ni podatek, zato ne v given (j 16. 11. 2026: »to ni podatek«).
// Ne izklopi lastnega reševalnika ne SymPy (ti gledata le given); AI jo dobi, da ve, kaj iskati.
export const cleanSought = (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, MAX_GIVEN_LEN) : "");

// Cilj, ki ga je učenec izbral na zaslonu (npr. »Razstavi«): brez njega bi AI izraz morda le poenostavil.
const GOAL_TEXT = {
  factor: "Task: factor the expression completely (kind expression, value = the factored form).",
  simplify: "Task: simplify the expression (kind expression).",
  evaluate: "Task: evaluate it (kind arith).",
  derivative: "Task: differentiate it with respect to the variable (kind derivative).",
  solve: "Task: solve it.",
};

export function solvePrompt(text, lang, feedback = null, goal = null, given = [], sought = "") {
  return (
    `A student wants a step-by-step solution of this maths problem (calculator syntax): ${text}\n` +
    (given.length ? `Data and conditions stated in the task (LaTeX; use them with their units, e.g. to find the parameters or the asked quantity, and give the answer with its unit): ${given.join("; ")}\n` : "") +
    (sought ? `What the task asks to find (LaTeX/text): ${sought}\n` : "") +
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

export async function solveWithAi({ text, lang = "sl", goal = null, given = [], sought = "" }) {
  const model = SOLVE_MODEL();
  if (isMockMode()) return { mock: true, solution: null, usage: null, model };
  const ask = async (feedback) => {
    const final = await getClient().messages.create({
      model,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: solvePrompt(text, languagePrompt(lang), feedback, goal, given, sought) }],
    });
    return { sol: cleanSolution(jsonFrom(textOf(final))), usage: final.usage, model: final.model || model };
  };
  let out = await ask(null);
  let usage = [out.usage];
  let check = out.sol ? await verifyAiFull(text, out.sol, { cas: !given.length }) : { verified: false, reason: "parse" };
  // Ena ponovitev, kadar preverjanje pokaže napačno ali manjkajočo rešitev. Pri nalogi s podatki (parametri)
  // preverjanje vidi le predlogo f(x) = …, zato ponovitve ne sproži (rešitev ostane označena kot nepreverjena).
  if (out.sol && !given.length && !check.verified && (check.reason === "wrong" || check.reason === "missing")) {
    const fb = check.cas ? `an exact check says: ${check.cas}` : check.reason === "missing" ? `x ≈ ${check.missing.slice(0, 6).map((m) => m.toFixed(4)).join(", ")} also satisfies the equation` : "substituting your result back does not give the original";
    // Napaka ponovitve (529, povezava) ne sme odnesti plačanega prvega klica (pregled #462 L3): ostane prva rešitev.
    let again = null;
    try {
      again = await ask(fb);
    } catch (err) {
      console.warn(`[evklid] reševanje: ponovitev ni uspela (${err?.message || err}), ostane prva rešitev`);
    }
    if (again) {
      usage.push(again.usage);
      const c2 = again.sol ? await verifyAiFull(text, again.sol, { cas: !given.length }) : { verified: false };
      if (again.sol && (c2.verified || !out.sol)) {
        out = again;
        check = c2;
      }
    }
  }
  return { solution: out.sol ? { ...out.sol, verified: !!check.verified, check: check.reason || null } : null, usage, model: out.model };
}

// Branje naloge za Inštruktorja: vse predmete (matematika, fizika, kemija, biologija), besedilo kot na listu, formule
// v $…$, brez reševanja. figure: naloga ima skico, graf ali sliko, ki je besedilo ne nadomesti (inštruktor dobi še sliko).
export const TASK_READ_PROMPT =
  "The image shows a school task (maths, physics, chemistry or biology; printed or handwritten) that a student photographed to ask a tutor for help. " +
  "Transcribe the task exactly as written, in its own language: the full wording with all numbers, units and sub-tasks a), b) …; maths and formulas in LaTeX between $ … $ (chemical formulas such as H₂O may stay plain). " +
  "Do not solve, do not fix mistakes, do not add anything. If several separate tasks are visible, transcribe the most prominent one (the one in the middle or marked), set \"more\": true and \"tasks\" to how many separate tasks you see. Leave out the student's own working and crossed-out parts.\n" +
  "Set \"figure\": true if the task depends on a drawing, graph, diagram, table image, circuit, geometric figure or structure formula that the text cannot fully replace; otherwise false.\n" +
  'Return only JSON: {"text":"...","figure":false,"more":false,"tasks":1}. If no task is readable: {"text":""}.\n' +
  'Accept schoolwork even if people appear in the frame. Only if a person or a private item is the main subject (face, selfie, ID or other personal document, private message) or it is a random scene, return only {"text":"","unrelated":true}.';
const TASK_READ_PROMPT_TOKENS = Buffer.byteLength(TASK_READ_PROMPT, "utf8") + 300;
const TASK_READ_MAX = 1200; // izhodni žetoni: dolga besedilna naloga s podnalogami
const MAX_TASK_TEXT = 3000;
export async function readTaskPhoto({ imageBase64, mediaType = "image/jpeg" }) {
  const model = TASK_READ_MODEL();
  if (isMockMode()) return { mock: true, text: "", usage: null, model };
  const final = await getClient().messages.create({
    model,
    max_tokens: TASK_READ_MAX,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: TASK_READ_PROMPT },
        ],
      },
    ],
  });
  const data = jsonFrom(textOf(final)) || {};
  const unrelated = data.unrelated === true;
  const text = unrelated || typeof data.text !== "string" ? "" : data.text.trim().slice(0, MAX_TASK_TEXT);
  const tasks = Number.isInteger(data.tasks) && data.tasks > 0 ? Math.min(data.tasks, 20) : data.more === true ? 2 : 1;
  return { text, figure: data.figure === true, more: data.more === true || tasks > 1, tasks, unrelated, usage: final.usage, model: final.model || model };
}

// Navodila branja v žetonih za rezervo (žeton ≤ bajt, pregled #462 S7) + sporočilo in ovoj.
const READ_PROMPT_TOKENS = Buffer.byteLength(READ_PROMPT, "utf8") + 500;
export function mountScan(app, { loadStudent, usage, readFn = readMathPhoto, solveFn = solveWithAi, readTaskFn = readTaskPhoto, dailyBlock = () => null, chatOff = () => false }) {
  // Kamera v Inštruktorju: prepis naloge, ki ga učenec pregleda in pošlje inštruktorju (public/scan/scan.js, način tutor).
  // Slike strežnik ne shrani; ob napaki učenec pošlje fotografijo ali nalogo vpiše (nikoli slepa ulica).
  app.post("/api/students/:id/scan/read-task", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(String(req.body?.image || ""));
    if (!m || m[2].length > MAX_IMAGE) return res.status(400).json({ error: "Slika manjka ali je prevelika." });
    // Branje plačamo le, če bo naloga lahko šla k inštruktorju: klepet vklopljen in dnevna meja vprašanj ni dosežena.
    if (chatOff()) return res.status(503).json({ error: "Klepet z inštruktorjem je začasno izklopljen. Vaje, lekcije in igre delujejo.", chat_off: true });
    const dnevna = dailyBlock(s.id);
    if (dnevna) return res.status(429).json(dnevna);
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    const hold = usage?.guard ? usage.guard(s.id, imageCallReserveUsd(TASK_READ_MODEL(), TASK_READ_MAX, 1, TASK_READ_PROMPT_TOKENS)) : null;
    if (usage?.guard && !hold) return res.status(429).json(usage.guardBlock(s.id));
    try {
      const out = await readTaskFn({ imageBase64: m[2], mediaType: m[1] });
      if (out.mock) return res.json({ text: "", mock: true });
      if (out.usage) usage?.log(s.id, out.model, out.usage, "skeniranje");
      const more = !!out.more || out.tasks > 1;
      res.json({ text: out.text || "", figure: !!out.figure, more, ...(more ? { tasks: Math.max(2, Number(out.tasks) || 2) } : {}), ...(out.unrelated ? { unrelated: true } : {}) });
    } catch (err) {
      console.error("[evklid] branje naloge:", err?.message || err);
      res.status(502).json({ error: errorText(err, "Branje fotografije trenutno ne deluje. Nalogo vpiši s tipkami.") });
    } finally {
      hold?.release();
    }
  });

  app.post("/api/students/:id/scan/read", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(String(req.body?.image || ""));
    if (!m || m[2].length > MAX_IMAGE) return res.status(400).json({ error: "Slika manjka ali je prevelika." });
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    // Trda meja AI (server/meje-ai.js): najvišji strošek branja mora iti pod mejo profila.
    const hold = usage?.guard ? usage.guard(s.id, imageCallReserveUsd(READ_MODEL(), 2000, 1, READ_PROMPT_TOKENS)) : null;
    if (usage?.guard && !hold) return res.status(429).json(usage.guardBlock(s.id));
    try {
      const out = await readFn({ imageBase64: m[2], mediaType: m[1], lang: s.settings?.language || "sl" });
      if (out.mock) return res.json({ problems: [], mock: true });
      if (out.usage) usage?.log(s.id, out.model, out.usage, "skeniranje");
      res.json({ problems: out.problems, ...(out.unrelated ? { unrelated: true } : {}) });
    } catch (err) {
      console.error("[evklid] skeniranje:", err?.message || err);
      res.status(502).json({ error: errorText(err, "Branje fotografije trenutno ne deluje. Nalogo vpiši s tipkami.") });
    } finally {
      hold?.release();
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
    const rawSought = req.body?.sought ?? "";
    if (typeof rawSought !== "string" || rawSought.length > MAX_GIVEN_LEN) return res.status(400).json({ error: "Podatki naloge niso veljavni." });
    const sought = cleanSought(rawSought);
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    // Do dva klica (ponovitev ob napačni rešitvi), vsak z navodili, nalogo in podatki ter do 8000 izhodnimi žetoni.
    const input = 6000 + Buffer.byteLength(text + rawGiven.join("") + rawSought, "utf8");
    const hold = usage?.guard ? usage.guard(s.id, 2 * callMaxUsd(SOLVE_MODEL(), input, 8000)) : null;
    if (usage?.guard && !hold) return res.status(429).json(usage.guardBlock(s.id));
    try {
      const out = await solveFn({ text, goal, given, sought, lang: s.settings?.language || "sl" });
      if (out.mock) return res.json({ solution: null, mock: true });
      for (const u of [].concat(out.usage || [])) if (u) usage?.log(s.id, out.model, u, "skeniranje");
      if (!out.solution) return res.status(502).json({ error: "Rešitve ni bilo mogoče sestaviti. Poskusi znova ali vprašaj inštruktorja." });
      res.json({ solution: out.solution, ...AI_JSON });
    } catch (err) {
      console.error("[evklid] reševanje:", err?.message || err);
      // Inštruktor (AI) ni na voljo (ni dobroimetja, ključ, preobremenjenost): vmesnik pokaže prijazno
      // sporočilo v jeziku učenca (scan.tutorDown), koda ostane v besedilu za iskanje napake.
      const unavailable = /^(400 ni dobroimetja|401|403|429|529)/.test(apiErrorCode(err) || "");
      res.status(unavailable ? 503 : 502).json({ error: errorText(err, "Reševanje trenutno ne deluje. Poskusi znova čez trenutek."), ...(unavailable ? { unavailable: true } : {}) });
    } finally {
      hold?.release();
    }
  });
}
