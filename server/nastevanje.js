// Naštevanje števil z decimalno vejico (j, 6. 11. 2026): kadar je v naštevanju vsaj eno število z
// decimalno vejico, elemente ločimo s podpičjem: »1,5; 2 ali 2,99«, točka »(1,5; 2)«, interval
// »(0,5; 1]«. Z navadno vejico se »1,5, 2« prebere kot »1, 5, 2«.
// Uporabljajo ga server/lesson-check.js (napaka v lekciji), scripts/nastevanje.js (iskanje in
// popravljanje vsebin) in server/practice/index.js (besedila slovenskih generatorjev nalog).
// Velja samo za slovenska besedila: v angleščini je »1,500, 2« lahko zapis tisočic.

const DEC_TEX = /\d\{,\}\d/; // decimalna vejica v LaTeX: 1{,}5
// Konec elementa: presledki, enote in podobno, kar stoji za številom (»0{,}030\,\mathrm{m}«, »109{,}5^\circ«).
const TAIL = /(?:\s|\\[,;:! ]|\\q?quad|~|\\(?:mathrm|text|textrm|unit|mathit)\{[^{}]*\}|\^\\circ|\^\{\\circ\}|\\%|%|\\[lc]?dots|\\ldots|°|\)|\])*$/;
const HEAD = /^(?:\s|\\[,;:! ]|\\q?quad|~|\(|\[)*/;
const END_NUM = /(?<![_^A-Za-z\\{])[-+−]?\d+(?:\{,\}\d+)?$/;
const START_NUM = /^[-+−]?\s*\d+(?:\{,\}\d+)?/;

const endNum = (item) => END_NUM.exec(item.replace(TAIL, ""))?.[0] || null;
const startNum = (item) => START_NUM.exec(item.replace(HEAD, ""))?.[0] || null;
// Ločilo med a in b je dvoumno, če na obeh straneh stoji število in je vsaj eno decimalno.
const ambiguous = (a, b) => {
  const x = endNum(a);
  const y = startNum(b);
  return Boolean(x && y && (DEC_TEX.test(x) || DEC_TEX.test(y)));
};

// Znotraj ene formule: vejice na isti globini oklepajev (cela formula, (…), […], {…}, \{…\}).
// Če je katero ločilo dvoumno, postanejo podpičja vsa ločila te skupine (dosledno naštevanje).
function fixTex(tex) {
  const out = tex.split("");
  const stack = [{ start: 0, commas: [] }];
  const close = (scope, end) => {
    if (!scope.commas.length) return;
    const bounds = [scope.start, ...scope.commas.map((c) => c + 1)];
    const items = bounds.map((b, i) => tex.slice(b, i < scope.commas.length ? scope.commas[i] : end));
    if (items.slice(1).some((it, i) => ambiguous(items[i], it))) for (const c of scope.commas) out[c] = ";";
  };
  for (let i = 0; i < tex.length; i++) {
    const ch = tex[i];
    if (ch === "\\") {
      const nx = tex[i + 1];
      if (nx === "{") stack.push({ start: i + 2, commas: [], kind: "\\{" });
      else if (nx === "}" && stack.length > 1 && stack.at(-1).kind === "\\{") close(stack.pop(), i);
      i++;
      continue;
    }
    if (ch === "{") stack.push({ start: i + 1, commas: [], kind: "{" });
    else if (ch === "(" || ch === "[") stack.push({ start: i + 1, commas: [], kind: "(" });
    else if (ch === "}" && stack.length > 1 && stack.at(-1).kind === "{") close(stack.pop(), i);
    else if ((ch === ")" || ch === "]") && stack.length > 1 && stack.at(-1).kind === "(") close(stack.pop(), i);
    else if (ch === ",") stack.at(-1).commas.push(i);
  }
  while (stack.length) close(stack.pop(), tex.length);
  return out.join("");
}

// Navadno besedilo: »1,5, 2 ali 2,99« → »1,5; 2 ali 2,99« (številke brez $…$).
const NUM = String.raw`[−-]?\d+(?:,\d+)?`;
const PLAIN_RUN = new RegExp(String.raw`(?<![\w,.\-−])${NUM}(?:, ${NUM})+(?![\d,]\d|-\p{L})`, "gu");
const fixPlain = (s) => s.replace(PLAIN_RUN, (run) => (run.split(", ").some((n) => /\d,\d/.test(n)) ? run.replaceAll(", ", "; ") : run));

// Razdeli besedilo na kodo (```…```, `…`), formule ($$…$$, $…$) in navadno besedilo.
const SPLIT = /(```[\s\S]*?```|`[^`\n]*`|(?<!\\)\$\$[\s\S]+?\$\$|(?<!\\)\$[^$\n]+?\$)/;

// Vrne popravljeno besedilo. Zaporedne formule, ločene z », « (»$34{,}2$, $33{,}8$ in $34{,}0$«), so
// eno naštevanje: če je katero ločilo dvoumno, dobijo podpičje vsa.
export function popraviNastevanja(text) {
  if (typeof text !== "string" || !/\d/.test(text)) return text;
  const parts = text.split(SPLIT);
  const isCode = (p) => p.startsWith("`");
  const isMath = (p, i) => i % 2 === 1 && !isCode(p);
  const tex = (p) => p.replace(/^\$\$?|\$\$?$/g, "");
  for (let i = 0; i < parts.length; i++) {
    if (isMath(parts[i], i)) parts[i] = parts[i].replace(/^(\$\$?)([\s\S]*?)(\$\$?)$/, (_, a, b, c) => a + fixTex(b) + c);
    else if (i % 2 === 0) parts[i] = fixPlain(parts[i]);
  }
  // Zaporedja formul, ločena samo z », «.
  for (let i = 1; i < parts.length; i += 2) {
    if (!isMath(parts[i], i)) continue;
    let j = i;
    while (j + 2 < parts.length && /^, ?$/.test(parts[j + 1].replace(/ /g, " ")) && isMath(parts[j + 2], j + 2)) j += 2;
    if (j > i) {
      let amb = false;
      for (let k = i; k < j; k += 2) if (ambiguous(tex(parts[k]), tex(parts[k + 2]))) amb = true;
      if (amb) {
        for (let k = i + 1; k < j; k += 2) parts[k] = parts[k].replace(",", ";");
        if (/^, ?(?:…|\.\.\.)/.test(parts[j + 1] || "")) parts[j + 1] = ";" + parts[j + 1].slice(1); // »$1{,}5$; $2$; …«
      }
    }
    i = j;
  }
  // Formula in navadno število ob njej: »$0{,}5$, 1 in 2« ali »0,5, $1$«.
  for (let i = 1; i < parts.length; i += 2) {
    if (!isMath(parts[i], i)) continue;
    const after = parts[i + 1];
    if (after != null && /^, [−-]?\d/.test(after) && endNum(tex(parts[i])) && (DEC_TEX.test(endNum(tex(parts[i]))) || /^, [−-]?\d+,\d+(?![\d,]*-\p{L})/u.test(after))) parts[i + 1] = ";" + after.slice(1);
    const before = parts[i - 1];
    if (/(?<![\w,])[−-]?\d+(?:,\d+)?, $/.test(before) && startNum(tex(parts[i])) && (/\d,\d+, $/.test(before) || DEC_TEX.test(startNum(tex(parts[i]))))) parts[i - 1] = before.replace(/, $/, "; ");
  }
  return poenotiTockovnik(text, parts.join(""));
}

// Točkovnik: če je ločilo pred »1 t. za …« postalo podpičje, ga dobijo vse točke te vrstice
// (»1 t. za $a$; 1 t. za $0{,}5$; 1 t. za …«), sicer bi bila ločila mešana. Šteje samo zunaj oklepajev.
const TOCKA = /^ (?:po )?\d+ t\.(?=\s|,|$)/;
function poenotiTockovnik(orig, fixed) {
  if (orig === fixed) return fixed;
  const a = orig.split("\n");
  return fixed
    .split("\n")
    .map((line, i) => {
      if (line === a[i]) return line;
      const seps = [];
      let depth = 0;
      for (let k = 0; k < line.length; k++) {
        const ch = line[k];
        if (ch === "(") depth++;
        else if (ch === ")") depth = Math.max(0, depth - 1);
        else if (!depth && (ch === "," || ch === ";") && TOCKA.test(line.slice(k + 1, k + 12))) seps.push(k);
      }
      if (!seps.some((k) => line[k] === ";")) return line;
      const out = line.split("");
      for (const k of seps) out[k] = ";";
      return out.join("");
    })
    .join("\n");
}

// Najdena mesta: [{ line, before, after }] (vrstica z 1, izrez pred in po popravku).
export function najdiNastevanja(text) {
  const fixed = popraviNastevanja(text);
  if (fixed === text) return [];
  const a = text.split("\n");
  const b = fixed.split("\n");
  const hits = [];
  // Popravek ne spremeni števila vrstic (zamenja samo »,« z »;«).
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    let s = 0;
    while (a[i][s] === b[i][s]) s++;
    let e = a[i].length;
    while (e > s && a[i][e - 1] === b[i][e - 1 + b[i].length - a[i].length]) e--;
    const from = Math.max(0, s - 30);
    hits.push({ line: i + 1, before: a[i].slice(from, e + 30), after: b[i].slice(from, e + 30 + b[i].length - a[i].length) });
  }
  return hits;
}
