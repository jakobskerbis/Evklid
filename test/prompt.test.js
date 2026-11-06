import test from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt, systemBlocks, SPLIT_MARKER } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";

test("static part of the prompt is identical for every student and goes first", () => {
  const a = buildSystemPrompt({ settings: normalizeSettings({ subject: "FIZ", curriculum_level: "2. letnik" }), studentName: "Zarja", weaknesses: ["ulomki z neznanko"] });
  const b = buildSystemPrompt({
    settings: normalizeSettings({ educational_track: "UNIVERZA", subject: "BIO" }),
    studentName: "Tilen",
    learningPath: "Tema: Mejoza.",
  });
  const [sa, da] = systemBlocks(a);
  const [sb, db] = systemBlocks(b);
  assert.equal(sa.text, sb.text);
  assert.deepEqual(sa.cache_control, { type: "ephemeral" });
  assert.equal(db.cache_control, undefined);
  // Vse nastavitve so v drugem bloku, v prvem ni nobenega vstavljenega podatka.
  assert.doesNotMatch(sa.text, /Zarja|Tilen|ulomki z neznanko|Mejoza|Ime učenca:/);
  assert.match(da.text, /Ime učenca: Zarja/);
  assert.match(da.text, /šibke točke učenca: ulomki z neznanko/);
  assert.match(db.text, /Šola: UNIVERZA/);
  assert.match(db.text, /Tema: Mejoza\./);
  // Stalni del vsebuje ključna pravila.
  for (const re of [/Varnostni ščit/, /<<META subject=/, /Način A/, /Način B/, /COMPETITION/, /UNIVERZA/, /Podatki/, /učnim stilom/]) {
    assert.match(sa.text, re);
  }
});

test("systemBlocks without a marker returns one block", () => {
  assert.deepEqual(systemBlocks("samo besedilo"), [{ type: "text", text: "samo besedilo" }]);
  assert.ok(!"samo besedilo".includes(SPLIT_MARKER));
});

test("pedagogical rules (hint ladder, situations, per-level tone, misconceptions) stay in the cached part; no emojis beyond the two markers", () => {
  const p = buildSystemPrompt({ settings: normalizeSettings({}) });
  const [stat] = p.split(SPLIT_MARKER);
  for (const re of [/Lestvica pomoči/, /## Pedagoške situacije/, /napačna predstava/i, /Frustracija ob nalogi/, /Napreden učenec/, /Domača naloga za oddajo/, /Priprava na test, NPZ, maturo ali kolokvij/, /Pogoste napačne predstave/, /Kolegialen ton/, /Če učenec meni, da se motiš/]) {
    assert.match(stat, re);
  }
  // Brez emojijev v besedilu inštruktorja: edini dovoljeni sta oznaka okvira in ščit (docs/besedila.md).
  const emoji = stat.replace(/📌|🛡️/g, "").match(/\p{Extended_Pictographic}/gu) || [];
  assert.deepEqual(emoji, []);
  // Razdelki so na svojem mestu (lestvica v načinu A, situacije pred posebnostmi aplikacije in pred Mejami).
  const i = (x) => stat.indexOf(x);
  assert.ok(i("## Način A") < i("Lestvica pomoči") && i("Lestvica pomoči") < i("## Način B"));
  assert.ok(i("## Pedagoške situacije") < i("## Posebne situacije v aplikaciji") && i("## Posebne situacije v aplikaciji") < i("## Meje"));
});

test("disengaged student: own situation in the cached part, with choices, small goal, break, and kept apart from frustration and distress", () => {
  const p = buildSystemPrompt({ settings: normalizeSettings({}) });
  const [stat, dyn] = p.split(SPLIT_MARKER);
  const i = (x) => stat.indexOf(x);
  assert.ok(i("## Pedagoške situacije") < i("**Nezainteresiran učenec**") && i("**Nezainteresiran učenec**") < i("## Posebne situacije v aplikaciji"));
  assert.doesNotMatch(dyn, /Nezainteresiran učenec/);
  const row = stat.split("\n").find((l) => l.startsWith("- **Nezainteresiran učenec**"));
  assert.ok(row, "razdelek je ena točka v seznamu situacij");
  for (const re of [/dolgčas mi je/, /brez pridige in slabe vesti/, /izbiro/, /le za izbiro poti/, /ne za račun, izraz, korak, formulo ali razlago/, /Napreden učenec/, /izziv ali igro/, /zanimanj/, /še 2 nalogi do konca teme/, /kratek odmor/, /kje bosta nadaljevala/, /Frustracija ob nalogi/, /Meje/, /Utrujenost/, /kako je/]) {
    assert.match(row, re);
  }
  assert.ok(row.length < 1100, `točka naj ostane kratka (${row.length} znakov)`);
});
