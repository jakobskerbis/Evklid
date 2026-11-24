// Lep zapis med pisanjem v klepetu (j, 2026-11-04: »naj se potence in ulomki izpisujejo tudi v chatboxu, ne kot
// * in /«, »koreni tudi«, »itd.«).
// Od 24. 11. 2026 (j: »Evklid – obvezen enoten standard matematičnega zapisa«, faza F2; odločitev »Klepet: pravi
// izris namesto Unicode«) polje NE piše več nadpisanih in podpisanih znakov Unicode (x², ³⁄₄, aₙ). Potenca, indeks in
// ulomek ostanejo zapis v vrstici (x^2, a_n, (3)/(4)), ki ga izriše KaTeX: v polju predogled (public/predogled-vnosa.js),
// v poslanem sporočilu app.js (public/vnos-formul.js splitFormulas → public/mat/izris.js). Tako je v klepetu ista
// matematika kot v lekcijah in kalkulatorju, inštruktor pa dobi nedvoumen zapis.
// Tu ostanejo le zamenjave posameznih znakov s pravim matematičnim znakom (·, ≤, ≥, ≠, →, ±, √) in ulomek iz števil:
// 3/4 → (3)/(4), da se izriše kot ulomek (prej ³⁄₄).

// Zamenjave na koncu besedila pred kazalcem. Vsaka vrne [nov konec, tek] ali null. Tek »den« pomeni, da se naslednja
// vpisana števka doda v imenovalec ((3)/(4) + 5 → (3)/(45)), »/«, ».« ali »,« takoj za njim pa vrne prvotni zapis (datum
// 1/2/2025, decimalni imenovalec 3/4,5).
const RULES = [
  [/\*$/, () => ["·"]],
  [/(?<!\p{L})sqrt$/u, () => ["√"]],
  [/<=$/, () => ["≤"]],
  [/>=$/, () => ["≥"]],
  [/!=$/, () => ["≠"]],
  [/->$/, () => ["→"]],
  [/\+-$/, () => ["±"]],
  // Ulomek iz števil: 3/4 → (3)/(4) (ne del daljšega števila z vejico ali piko, ne za črko: x2/3 ostane).
  [/(?<![\p{L}\d.,/⁄)])(\d+)\/(\d)$/u, (m) => [`(${m[1]})/(${m[2]})`, "den"]],
];

/**
 * Lepši konec besedila pred kazalcem. `before` je besedilo do kazalca po vnosu, `typed` vpisani znaki, `run` tek
 * iz prejšnjega klica ({ at, kind, from, orig } ali null). Vrne { from, text, run, undo? }: zamenjaj before.slice(from)
 * s text, ali null, ko ni kaj zamenjati. undo: kar vrne Backspace takoj po zamenjavi (privzeto before.slice(from)).
 */
export function prettify(before, typed, run = null) {
  // Nadaljevanje ulomka: števka takoj za imenovalcem gre vanj, »/« vrne prvotni zapis (datum, ne ulomek).
  if (run?.kind === "den" && before.length === run.at + 1 && before[run.at - 1] === ")") {
    if (/^\d$/.test(typed)) return { from: run.at - 1, text: typed + ")", undo: ")", run: { ...run, at: run.at + 1, orig: run.orig + typed } };
    // »/« (datum 1/2/2025), ».« ali »,« (decimalni imenovalec 3/4,5) vrne prvotni zapis: to ni ulomek dveh celih števil.
    if (/^[/.,]$/.test(typed)) return { from: run.from, text: run.orig + typed, run: null };
  }
  for (const [re, fn] of RULES) {
    const m = before.match(re);
    if (!m) continue;
    const r = fn(m);
    if (!r || r[0] == null) continue;
    return { from: m.index, text: r[0], run: r[1] ? { at: m.index + r[0].length, kind: r[1], from: m.index, orig: m[0] } : null };
  }
  return null;
}

/** Polje (textarea) med pisanjem sproti lepša. Kliči pred drugimi poslušalci »input«. */
export function attachPrettify(field) {
  let run = null;
  let lasten = false; // »input«, ki ga sproži zamenjava sama
  let last = null; // zadnja zamenjava: { from, text, orig } – Backspace takoj po njej vrne prvotni zapis (3/4, *, sqrt)
  const apply = (typed) => {
    const at = field.selectionStart;
    if (at !== field.selectionEnd) return void (run = last = null);
    const before = field.value.slice(0, at);
    const r = prettify(before, typed.slice(-1), run);
    run = r?.run ?? null;
    last = null;
    if (!r) return;
    field.setRangeText(r.text, r.from, at, "end");
    last = { from: r.from, text: r.text, orig: r.undo ?? before.slice(r.from) };
    // setRangeText ne sproži »input«: izris v polju (predogled-vnosa.js), višina in osnutek so že obdelali vneseni znak,
    // ne zamenjave (3/4 → (3)/(4)). Lasten dogodek jih posodobi; ta poslušalec ga preskoči.
    lasten = true;
    try {
      field.dispatchEvent(new Event("input", { bubbles: true }));
    } finally {
      lasten = false;
    }
  };
  // Na oknu v fazi zajema: pred ⌫ izrisanega polja (predogled-vnosa.js, poslušalec na document), ki bi v ulomku
  // (3)/(4) le premaknil kazalec v imenovalec. Razveljavitev zamenjave ima prednost; sicer ⌫ dela kot vedno.
  addEventListener("keydown", (e) => {
    if (e.target !== field || e.key !== "Backspace" || !last || e.ctrlKey || e.metaKey || e.altKey) return;
    const at = field.selectionStart;
    const { from, text, orig } = last;
    last = run = null;
    if (at !== field.selectionEnd || at !== from + text.length || field.value.slice(from, at) !== text) return;
    e.preventDefault();
    e.stopPropagation(); // ⌫ izrisanega polja (predogled-vnosa.js) tega ne obdela še enkrat
    field.setRangeText(orig, from, at, "end"); // kot razveljavitev samopopravka na tipkovnici
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }, true);
  field.addEventListener("input", (e) => {
    if (lasten) return;
    const typed = e.data ?? "";
    if (e.isComposing || !/^insert(Text|CompositionText)?$/.test(e.inputType || "") || !typed) return void (run = last = null);
    apply(typed);
  });
  field.addEventListener("compositionend", (e) => e.data && apply(e.data));
}
