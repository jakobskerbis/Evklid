// Točka D5 (master brief j 13. 11.): med pretakanjem odgovora se dokončani bloki ne izrisujejo znova, formule KaTeX so
// v predpomnilniku, izris je največ enkrat na sličico, končni izris pa je cel in takoj (enak kot ob ponovnem odprtju).
// Zagon: node --test test/izpis-toka-d5.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { marked } from "marked";
import katex from "katex";
import { createRenderer, streamSafe } from "../public/rich.js";
import { razdeliBloke, createIzrisBlokov, enIzrisNaSlicico } from "../public/izpis-toka.js";
import { createPacer, PACES } from "../public/pace.js";

const ODGOVOR = [
  "Najprej poiščemo skupni imenovalec. Ulomka $\\frac{1}{2}$ in $\\frac{1}{3}$ imata skupni imenovalec $6$.",
  "",
  "1. Razširimo: $\\frac{1}{2} = \\frac{3}{6}$",
  "",
  "2. Razširimo še drugega: $\\frac{1}{3} = \\frac{2}{6}$",
  "",
  "$$",
  "\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}",
  "",
  "$$",
  "",
  "| korak | rezultat |",
  "|---|---|",
  "| 1 | $\\frac{3}{6}$ |",
  "",
  "```",
  "koda",
  "",
  "še koda",
  "```",
  "",
  "> Zapomni si: imenovalca morata biti enaka.",
  "",
  "Rezultat je **$\\frac{5}{6}$**.",
].join("\n");

test("D5 bloki: skupaj dajo isto besedilo; meja ni v seznamu, formuli $$, kodi, tabeli ali citatu", () => {
  for (let n = 0; n <= ODGOVOR.length; n += 7) assert.equal(razdeliBloke(ODGOVOR.slice(0, n)).join(""), ODGOVOR.slice(0, n));
  const b = razdeliBloke(ODGOVOR);
  assert.equal(b.join(""), ODGOVOR);
  assert.match(b[0], /^Najprej/);
  assert.ok(b.some((x) => x.includes("1. Razširimo") && x.includes("2. Razširimo")), "seznam ostane skupaj");
  assert.ok(b.some((x) => /\$\$\n\\frac\{3\}\{6\}[\s\S]*\n\$\$/.test(x)), "formula $$ s prazno vrstico ostane skupaj");
  assert.ok(b.some((x) => x.includes("koda\n\nše koda")), "koda ostane skupaj");
  assert.match(b.at(-1), /^Rezultat je/);
  assert.deepEqual(razdeliBloke(""), [""]);
});

test("D5 izris med tokom: dokončani bloki enkrat; končni izris enak celemu izrisu", () => {
  const { renderRich } = createRenderer({ marked, katex, sanitize: (h) => h });
  let klici = 0;
  let znakov = 0;
  const izrisBlokov = createIzrisBlokov((t) => (klici++, (znakov += t.length), renderRich(t)));
  // Kot pacer: po besedah.
  const meje = [...ODGOVOR.matchAll(/\s+/g)].map((m) => m.index);
  for (const m of meje) izrisBlokov(streamSafe(ODGOVOR.slice(0, m)));
  const vsehZnakovPrej = meje.reduce((a, m) => a + streamSafe(ODGOVOR.slice(0, m)).length, 0);
  assert.ok(znakov < vsehZnakovPrej / 2, `izrisanih znakov ${znakov}, prej ${vsehZnakovPrej}`);
  // Vmesni izris z bloki je enak izrisu celega besedila, kadar so bloki samostojni odstavki.
  const dva = "Prvi odstavek z $x^2$.\n\nDrugi odstavek.";
  assert.equal(createIzrisBlokov(renderRich)(dva), renderRich(dva));
  assert.ok(klici > 0);
});

test("D5 KaTeX: ista formula se izriše enkrat (predpomnilnik), napaka se ne shrani", () => {
  let n = 0;
  const stevec = { renderToString: (tex, o) => (n++, katex.renderToString(tex, o)) };
  const { renderRich } = createRenderer({ marked, katex: stevec, sanitize: (h) => h });
  const a = renderRich("Ulomek $\\frac{1}{2}$ in $$x^2$$");
  const b = renderRich("Ulomek $\\frac{1}{2}$ in $$x^2$$");
  assert.equal(a, b);
  assert.equal(n, 2, "dve formuli, vsaka enkrat");
  renderRich("$\\frac{1}{2}$ in $\\frac{1}{2}$ v vrstici in $$\\frac{1}{2}$$ v bloku");
  assert.equal(n, 3, "ista formula v bloku je drug izris");
});

test("D5 sličica: vmesni izrisi se združijo v enega na sličico; končni takoj in prekliče čakajočega", () => {
  const izrisi = [];
  const sl = [];
  const p = enIzrisNaSlicico((t, k) => izrisi.push([t, k]), { naslednja: (f) => (sl.push(f), sl.length), preklici: (id) => (sl[id - 1] = null) });
  p("a");
  p("ab");
  p("abc");
  assert.equal(sl.length, 1, "ena zahteva za sličico");
  sl[0]();
  assert.deepEqual(izrisi, [["abc", false]]);
  p("abcd");
  p("abcde", true);
  assert.deepEqual(izrisi.at(-1), ["abcde", true], "končni takoj");
  assert.equal(sl[1], null, "čakajoči preklican");
  assert.equal(izrisi.length, 2);
});

test("D5 pacer: končni izris je označen (izriše se takoj, gumbi pod odgovorom pridejo za njim)", async () => {
  const klici = [];
  const p = createPacer(PACES.takoj, (t, k) => klici.push([t, !!k]));
  p.push("Ena dva");
  p.finish("Ena dva tri.");
  await p.done;
  assert.deepEqual(klici.at(-1), ["Ena dva tri.", true]);
  assert.ok(klici.slice(0, -1).every(([, k]) => !k));
});

test("D5 končni izris: zadnja vrstica tabele brez nove vrstice ostane (kot ob ponovnem odprtju pogovora)", () => {
  const { renderRich } = createRenderer({ marked, katex, sanitize: (h) => h });
  const tabela = "| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |";
  assert.match(renderRich(tabela), /<td[^>]*>3<\/td>/, "končni izris (chatRich) pokaže zadnjo vrstico");
  assert.doesNotMatch(renderRich(streamSafe(tabela)), /<td[^>]*>3<\/td>/, "med tokom je nedokončana vrstica skrita");
});
