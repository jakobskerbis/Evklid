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
// ∫(f;a;b) nima zapisanega diferenciala: edina prosta črka v f (∫(θ;0;1) → dθ), sicer x (AUDIT-012).
// Imena funkcij, e in π niso spremenljivke; dve različni črki (∫(a·t;0;1)) ali nobena: dx.
const NOT_VAR = /(?<!\p{L})(?:arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log|exp|sqrt|abs)(?!\p{L})|[eπ]/gu;
function differential(f) {
  const vars = new Set(String(f).replace(NOT_VAR, " ").match(/\p{L}/gu) || []);
  return vars.size === 1 ? [...vars][0] : "x";
}
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
      // diferencial je katerakoli črka, tudi grška (dθ, dφ; AUDIT-012)
      const d = j > 0 ? s.slice(j).match(/^\s*d(\p{L})(?!\p{L})/u) : null;
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
        push(`\\int${lim} ${toTex(a[0])}\\,d${differential(a[0])}`);
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

// ---------- urejanje zapisa v polju, ki ga pokaže kot formulo (public/predogled-vnosa.js) ----------
// Polje za odgovor pokaže ulomek, koren, potenco kot formulo, vrednost pa ostane zapis v vrstici, npr. π()/(). Kazalec
// sme stati le tam, kjer znak, ki ga učenec vpiše, formule ne podre: v števcu, v imenovalcu, pred ulomkom, za njim,
// ne pa med »)/(«. ⌫ na takem znaku formule ne razbije v surov zapis.

const OZNAKA = ""; // zasebni znak Unicode: tu stoji kazalec

/** Mesta (0 … dolžina), kjer sme stati kazalec: vstavljen znak tam ne spremeni zgradbe formule. */
export function varnaMesta(src) {
  const s = String(src ?? "");
  const ref = toTex(s);
  const out = [];
  for (let p = 0; p <= s.length; p++) {
    if (p > 0 && p < s.length && /[\uDC00-\uDFFF]/.test(s[p])) continue; // sredi para nadomestnih znakov
    if (toTex(s.slice(0, p) + OZNAKA + s.slice(p)).split(OZNAKA).join("") === ref) out.push(p);
  }
  return out;
}

/** Zapis z oznako kazalca na mestu p (za izris): deli kot splitFormulas, oznaka je znak OZNAKA. */
export function delisKazalcem(src, p) {
  const s = String(src ?? "");
  return splitFormulas(p == null ? s : s.slice(0, p) + OZNAKA + s.slice(p));
}
export { OZNAKA };

// Ulomki, koreni, potence, indeksi in integrali s tipk: { od, do, reze: [[začetek, konec], …] } (konec ni vključen).
function zgradbe(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(") {
      const j = closeAt(s, i);
      if (j > 0 && s[j] === "/" && s[j + 1] === "(") {
        const k = closeAt(s, j + 1);
        if (k > 0) out.push({ od: i, do: k, reze: [[i + 1, j - 1], [j + 2, k - 1]] });
      }
      // Telo integrala: ∫ (x) dx, ∫_(0)^(1) (x) dx
      const d = j > 0 ? s.slice(j).match(/^\s*d\p{L}(?!\p{L})/u) : null;
      if (d && /∫(?:[_^]\([^()]*\))*\s*$/.test(s.slice(0, i))) {
        out.push({ od: i, do: j + d[0].length, reze: [[i + 1, j - 1]] });
      }
    } else if ((ROOT[c] || c === "^" || c === "_" || c === "∫") && s[i + 1] === "(") {
      const j = closeAt(s, i + 1);
      if (j < 0) continue;
      const reze = [];
      let a = i + 2;
      let depth = 0;
      for (let x = i + 2; x < j - 1; x++) {
        if (s[x] === "(") depth++;
        else if (s[x] === ")") depth--;
        else if (c === "∫" && s[x] === ";" && depth === 0) {
          reze.push([a, x]);
          a = x + 1;
        }
      }
      reze.push([a, j - 1]);
      out.push({ od: i, do: j, reze });
    }
  }
  return out;
}

/**
 * ⌫ na mestu p v zapisu formule. Znak zgradbe (oklepaj, »/«, »√«, »^«) se ne zbriše posamič: prazna zgradba (»()/()«)
 * izgine cela, sicer kazalec skoči v prejšnje mesto (iz imenovalca na konec števca). null: navaden ⌫.
 */
/** Delete (tipka Del) na mestu p: znak zgradbe se ne zbriše posamič; prazna zgradba izgine, sicer kazalec v naslednje
 * mesto (iz števca v imenovalec). null: navaden Delete. */
export function brisiNaprej(src, p) {
  const s = String(src ?? "");
  if (p >= s.length || !hasFormula(s)) return null;
  const z = zgradbe(s)
    .filter((g) => g.od <= p && p < g.do && !g.reze.some(([a, b]) => a <= p && p < b))
    .sort((a, b) => a.do - a.od - (b.do - b.od))[0];
  if (!z) return null;
  if (z.reze.every(([a, b]) => !s.slice(a, b).trim())) return { value: s.slice(0, z.od) + s.slice(z.do), caret: z.od };
  const nasl = z.reze.find(([a]) => a > p);
  return { value: s, caret: nasl ? nasl[0] : z.do };
}

export function brisiNazaj(src, p) {
  const s = String(src ?? "");
  const i = p - 1;
  if (i < 0 || !hasFormula(s)) return null;
  const z = zgradbe(s)
    .filter((g) => g.od <= i && i < g.do && !g.reze.some(([a, b]) => a <= i && i < b))
    .sort((a, b) => a.do - a.od - (b.do - b.od))[0];
  if (!z) return null;
  if (z.reze.every(([a, b]) => !s.slice(a, b).trim())) return { value: s.slice(0, z.od) + s.slice(z.do), caret: z.od };
  const prej = z.reze.filter(([, b]) => b <= i).pop();
  return { value: s, caret: prej ? prej[1] : z.od };
}
