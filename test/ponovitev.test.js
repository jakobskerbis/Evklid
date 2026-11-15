// Razdelek »Ponovitev« v lekcijah MAT-SS (j, 15. 11. 2026, točka C8): kratka ponovitev na en zaslon telefona
// pred »Za maturo«; preverjalnik zahteva tri dele, oznako priloge pri vsaki formuli in natanko 3 napake,
// razdelek se ne šteje v mejo besed in v aplikaciji ostane en korak.
import test from "node:test";
import assert from "node:assert/strict";
import { checkLessonSource } from "../server/lesson-check.js";
import { parseLesson } from "../server/textbook.js";
import { lessonSteps } from "../public/lesson-steps.js";

const ID = "MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje";
const dobra = `## Ponovitev

**Formule**
- $a_n = a_1 + (n - 1)d$ (na pamet)
- $S_n = \\frac{n}{2}(a_1 + a_n)$ (priloga)

**Postopek**
1. Iz besedila zapiši $a_1$ in $d$ (ali $q$).
2. Izberi formulo za člen ali vsoto.
3. Reši enačbo za neznanko in preveri, da je $n$ naravno število.

**Pazi na**
- $a_n = a_1 + nd$ namesto $(n - 1)d$.
- Pri geometrijskem zaporedju $q = 1$ zahteva posebno formulo.
- Število členov ni zadnji člen.
`;
const src = (pon, zaMaturo = "## Za maturo\nBesedilo.\n") =>
  `---\nstanje: osnutek\navtor: AI\n---\n## Zakaj se tega učimo\nBesedilo.\n## Povzetek\n- Točka.\n${pon}${zaMaturo}`;
const ponWarn = (s) => checkLessonSource(s, ID).warnings.filter((w) => /Ponovitev/.test(w));

test("pravilna ponovitev ne da opozoril o ponovitvi", () => {
  assert.deepEqual(ponWarn(src(dobra)), []);
});

test("brez ponovitve: opozorilo v maturitetni lekciji, ne v drugih", () => {
  assert.ok(ponWarn(src("")).some((w) => /manjka razdelek »## Ponovitev«/.test(w)));
  assert.deepEqual(checkLessonSource(src(""), "MAT-OS-9/linearna-funkcija").warnings.filter((w) => /Ponovitev/.test(w)), []);
});

test("formula brez oznake priloge, napačno število napak in korakov", () => {
  const slaba = dobra.replace(" (priloga)", "").replace("- Število členov ni zadnji člen.\n", "").replace(/2\. .*\n3\. .*\n/, "");
  const w = ponWarn(src(slaba));
  assert.ok(w.some((x) => /oznaka »\(priloga\)«/.test(x)), w.join("\n"));
  assert.ok(w.some((x) => /natanko 3 napake \(2\)/.test(x)), w.join("\n"));
  assert.ok(w.some((x) => /2–6 oštevilčenih korakov \(1\)/.test(x)), w.join("\n"));
});

test("ponovitev za »Za maturo« in predolga ponovitev", () => {
  assert.ok(ponWarn(src("", "## Za maturo\nBesedilo.\n" + dobra)).some((w) => /pred »Za maturo«/.test(w)));
  const dolga = dobra.replace("**Pazi na**", `${"beseda ".repeat(150)}\n\n**Pazi na**`);
  assert.ok(ponWarn(src(dolga)).some((w) => /predolga/.test(w)));
});

test("ponovitev se ne šteje v mejo besed", () => {
  const dolgo = `${"beseda ".repeat(2790)}\n`;
  const s = src(dobra).replace("Besedilo.\n## Povzetek", `${dolgo}## Povzetek`);
  assert.ok(!checkLessonSource(s, ID).warnings.some((w) => /dolga \(/.test(w)));
});

test("ponovitev je v aplikaciji en sam korak", () => {
  const { sections } = parseLesson(src(dobra));
  const i = sections.findIndex((s) => /^Ponovitev/.test(s.title));
  assert.ok(i >= 0);
  const steps = lessonSteps(sections).filter((s) => s.type === "text" && s.section === i);
  assert.equal(steps.length, 1);
});
