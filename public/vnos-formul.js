// Formule, ki jih učenec napiše v klepetu s tipkami Evklidove tipkovnice (j, 4. 11.: »ulomke, integrale,
// zaporedja …«). Tipke vstavijo zapis v vrstici, npr. (3)/(4), √(2), x^(2), a_(n), ∑_(n=1)^∞, ∫(x;0;1),
// ∫_(0)^(1) (x) dx, lim_(x→0)(…). Tu ga razberemo in sporočilo učenca ga izriše kot formulo (KaTeX);
// ostalo besedilo ostane besedilo. Inštruktor dobi sporočilo, kot ga je učenec napisal.

// Konec oklepaja, ki se začne na s[i] === "(", ali -1.
function closeAt(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "(") depth++;
    else if (s[j] === ")" && --depth === 0) return j + 1;
  }
  return -1;
}

// Začetek oklepaja, ki se konča na s[end - 1] === ")", ali -1.
function openAt(s, end) {
  let depth = 0;
  for (let j = end - 1; j >= 0; j--) {
    if (s[j] === ")") depth++;
    else if (s[j] === "(" && --depth === 0) return j;
  }
  return -1;
}

// Argumenti na vrhnji ravni, ločeni s »;« (∫(f;a;b)).
function args(s) {
  const out = [];
  let depth = 0;
  let from = 0;
  for (let j = 0; j < s.length; j++) {
    if (s[j] === "(") depth++;
    else if (s[j] === ")") depth--;
    else if (s[j] === ";" && depth === 0) {
      out.push(s.slice(from, j));
      from = j + 1;
    }
  }
  out.push(s.slice(from));
  return out.map((x) => x.trim());
}

const BIG = { "∑": "\\sum", "∏": "\\prod", "∫": "\\int", lim: "\\lim", log: "\\log" };
const ROOT = { "√": "\\sqrt", "∛": "\\sqrt[3]", "∜": "\\sqrt[4]" };
const ESC = { "\\": "\\backslash ", "~": "\\sim ", "^": "\\^{}", _: "\\_{}" };
const FN = /(?<!\p{L})(sin|cos|tan|cot|ln|log|exp)(?!\p{L})/gu;
const texText = (s) => s.replace(/[\\{}$%#&~^_]/g, (c) => ESC[c] ?? `\\${c}`).replace(FN, "\\$1 ");

/** Besedilo → deli [{ text } | { tex }]. Brez zapisa s tipkovnice je en sam del z besedilom. */
export function splitFormulas(src) {
  const s = String(src ?? "");
  const parts = [];
  let buf = "";
  const flush = () => {
    if (buf) parts.push({ text: buf });
    buf = "";
  };
  const push = (tex) => {
    flush();
    const last = parts[parts.length - 1];
    if (last && "tex" in last) last.tex += tex; // ∑_(n=1) in ^∞ ostaneta skupaj
    else parts.push({ tex });
  };
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    // Ulomek (a)/(b)
    if (c === "(") {
      const j = closeAt(s, i);
      if (j > 0 && s[j] === "/" && s[j + 1] === "(") {
        const k = closeAt(s, j + 1);
        if (k > 0) {
          push(`\\frac{${toTex(s.slice(i + 1, j - 1))}}{${toTex(s.slice(j + 2, k - 1))}}`);
          i = k;
          continue;
        }
      }
    }
    // Telo integrala s tipke »∫« ali »∫ₐᵇ«: ∫ (x²) dx, ∫_(0)^(1) (x²) dx
    if (c === "(") {
      const last = parts[parts.length - 1];
      const after = /\\int(?:[_^]\{[^}]*\})*$/.test(last?.tex || "") && !buf.trim();
      const plain = /∫\s*$/.test(buf);
      const j = after || plain ? closeAt(s, i) : -1;
      const d = j > 0 ? s.slice(j).match(/^\s*d([a-zA-Z])(?![\p{L}])/u) : null;
      if (d) {
        if (plain) buf = buf.replace(/∫\s*$/, "");
        else buf = "";
        const body = ` ${toTex(s.slice(i + 1, j - 1))}\\,d${d[1]}`;
        if (plain) push(`\\int${body}`);
        else last.tex += body;
        i = j + d[0].length;
        continue;
      }
    }
    // Koren √(x), ∛(x), ∜(x)
    if (ROOT[c] && s[i + 1] === "(") {
      const j = closeAt(s, i + 1);
      if (j > 0) {
        push(`${ROOT[c]}{${toTex(s.slice(i + 2, j - 1))}}`);
        i = j;
        continue;
      }
    }
    // Integral s tipke na plasti f(x): ∫(f;a;b) ali ∫(f)
    if (c === "∫" && s[i + 1] === "(") {
      const j = closeAt(s, i + 1);
      const a = j > 0 ? args(s.slice(i + 2, j - 1)) : [];
      if (a.length === 3 || a.length === 1) {
        const lim = a.length === 3 && (a[1] || a[2]) ? `_{${toTex(a[1])}}^{${toTex(a[2])}}` : "";
        push(`\\int${lim} ${toTex(a[0])}\\,dx`);
        i = j;
        continue;
      }
    }
    // Odvod d/dx
    if (s.startsWith("d/dx", i)) {
      push("\\frac{d}{dx}");
      i += 4;
      continue;
    }
    // Potenca x^(2), x^2, ^∞ in indeks a_(n), a_n, ∑_(n=1)
    if ((c === "^" || c === "_") && i + 1 < s.length && !/\s/.test(s[i + 1])) {
      let arg;
      let next;
      if (s[i + 1] === "(") {
        const j = closeAt(s, i + 1);
        if (j > 0) {
          arg = toTex(s.slice(i + 2, j - 1));
          next = j;
        }
      } else {
        const m = s.slice(i + 1).match(/^(?:[−-]?\d+(?:[.,]\d+)?|[−-]?\p{L}|∞)/u);
        // Črka, ki ji sledi črka, je beseda (moja_spremenljivka), ne indeks.
        if (m && !(/\p{L}$/u.test(m[0]) && /[\p{L}\p{N}]/u.test(s[i + 1 + m[0].length] || ""))) {
          arg = toTex(m[0]);
          next = i + 1 + m[0].length;
        }
      }
      if (arg !== undefined) {
        const last = parts[parts.length - 1];
        if (!buf && last && "tex" in last) {
          last.tex += `${c}{${arg}}`;
        } else {
          let base = "";
          if (buf.endsWith(")")) {
            const o = openAt(buf, buf.length);
            if (o >= 0) base = buf.slice(o);
          } else base = buf.match(/(?:lim|log|[∑∏∫]|\d+(?:[.,]\d+)?|\p{L})$/u)?.[0] || "";
          buf = buf.slice(0, buf.length - base.length);
          push(`${BIG[base] ?? (base ? toTex(base) : "{}")}${c}{${arg}}`);
        }
        i = next;
        continue;
      }
    }
    buf += c;
    i++;
  }
  flush();
  // Formule, med katerimi so le presledki in računski znaki, so ena formula (∑_(n=1)^∞ (1)/(n^(2)) → ena vsota).
  const out = [];
  for (const p of parts) {
    const a = out[out.length - 1];
    const b = out[out.length - 2];
    if ("tex" in p && a && "text" in a && b && "tex" in b && /^[\s+−\-·×=<>≤≥]*$/.test(a.text)) {
      out.pop();
      b.tex += texText(a.text) + p.tex;
    } else out.push(p);
  }
  return out;
}

/** Zapis s tipkovnice v LaTeX (za notranjost ulomka, korena, potence). */
export function toTex(src) {
  return splitFormulas(src)
    .map((p) => ("tex" in p ? p.tex : texText(p.text)))
    .join("");
}

/** Ali besedilo vsebuje zapis, ki se izriše kot formula. */
export const hasFormula = (src) => splitFormulas(src).some((p) => "tex" in p);
