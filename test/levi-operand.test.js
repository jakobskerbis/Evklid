// AUDIT-034: brisanje levega operanda ne pokvari izrisa: »/2«, »²«, »,5«, »2x+=7« se izrišejo z okvirčkom □ in kazalcem
// (prej ⬚ »Formule ni mogoče prikazati« brez kazalca); brisanje, po katerem se zapis ne bi izrisal, se ne zgodi.
import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { entryBase, caretTex, backspace, deleteForward, CARET, HOLE, TRUST } from "../public/graph/sci-vnos.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const ok = (t) => !t.trim() || !!entryBase(t, env)?.ok;

test("levi operand manjka: okvirček in kazalec, vse se izriše (AUDIT-034)", () => {
  for (const t of ["/2", "²", "³", "⁻¹", ",5", "2x+=7", "!", "x²−5x+=0", "x+y=3; x−=1", "²<4", "1,E3", "2,+1", "x_+x_2", "(/2)/(3/4)", "1/(/3)", "2^(^(2))", "π·2".slice(1), "%", "∫(²;0;2)", "√(²+1)"]) {
    const b = entryBase(t, env);
    assert.ok(b?.ok, `${t}: izriše se`);
    for (let p = 0; p <= t.length; p++) {
      const tex = caretTex(b, p);
      assert.equal(tex.split(CARET).length - 1, 1, `${t} @${p}`);
      katex.renderToString(tex, { throwOnError: true, strict: "ignore", trust: TRUST });
    }
    assert.ok(caretTex(b, 0).includes(HOLE), `${t}: okvirček`);
  }
  // kazalec je pred okvirčkom (vnos gre na mesto manjkajočega operanda)
  assert.ok(caretTex(entryBase("/2", env), 0).startsWith(`\\frac{${CARET}${HOLE}`), caretTex(entryBase("/2", env), 0));
});

test("varovalo: ⌫ ali Delete, po katerem se zapis ne bi izrisal, ne izbriše ničesar (AUDIT-034)", () => {
  // + med decimalnima številoma: »0,10,2« ni število
  assert.deepEqual(deleteForward("0,1+0,2", 3, 3, { ok }), { text: "0,1+0,2", pos: 4 });
  assert.deepEqual(backspace("0,1+0,2", 4, 4, { ok }), { text: "0,1+0,2", pos: 3 });
  // indeks vsote mora biti spremenljivka
  assert.deepEqual(backspace("∑_(n=1)^(5) n", 4, 4, { ok }), { text: "∑_(n=1)^(5) n", pos: 3 });
  // levi operand se izbriše (zapis ostane z okvirčkom)
  assert.deepEqual(backspace("1/2", 1, 1, { ok }), { text: "/2", pos: 0 });
  assert.deepEqual(backspace("x²", 1, 1, { ok }), { text: "²", pos: 0 });
  assert.deepEqual(backspace("2,5", 1, 1, { ok }), { text: ",5", pos: 0 });
  // brez ok (stari klic) se obnaša kot prej
  assert.deepEqual(deleteForward("0,1+0,2", 3), { text: "0,10,2", pos: 3 });
});
