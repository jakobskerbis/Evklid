// Drugi »Vprašaj inštruktorja« v poli, medtem ko se prvi odgovor še izpisuje (pregled #917, 2. prehod, 3 in kontrolni
// pregled): vprašanje se ne izgubi (prej send() med state.sending tiho vrnil in ostal je prazen pogovor), pošlje se po
// koncu odgovora. Med čakanjem: drugo dejanje pole pove, zakaj ne gre; odhod na drug zaslon ne vrne v klepet; menjava
// profila prekliče vprašanje (ne gre v pogovor in mejo drugega profila).
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, zavihek, druzina, odkleni, menjajProfil, META } from "./maturant-splet-pomoc.js";

// Strežnik, pri katerem prvi odgovor čaka, dokler ga test ne spusti.
function zVrati() {
  const st = { klicev: 0 };
  const vrata = new Promise((r) => (st.pusti = r));
  st.srv = streznik({
    streamFn: async ({ onText }) => {
      st.klicev++;
      onText("razmišljam ");
      if (st.klicev === 1) await vrata;
      onText("ok");
      return { text: "razmišljam ok" + META, stopReason: "end_turn" };
    },
  });
  return st;
}
const pogovori = (srv, id) =>
  srv.store.db
    .prepare("SELECT c.id, (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.role = 'user') AS n FROM conversations c WHERE c.student_id = ?")
    .all(id);

// Odpre našo polo, vpraša pri nalogi 5 (prvi odgovor se izpisuje), se vrne na polo in vpraša pri nalogi 6 (čaka).
async function doCakanja(p, st) {
  await zavihek(p, "exams");
  await p.locator("[data-pp-ours]").first().click();
  await p.waitForSelector(".op-task", { timeout: 15000 });
  const vprasaj = async (i) => {
    await p.locator(`.op-task[data-op-i="${i}"]`).scrollIntoViewIfNeeded();
    await p.locator(`.op-task[data-op-i="${i}"] [data-op-tutor]`).first().click();
  };
  await vprasaj(4);
  await p.waitForSelector("#view-chat:not([hidden])", { timeout: 15000 });
  for (let i = 0; st.klicev < 1 && i < 150; i++) await p.waitForTimeout(100); // prvi odgovor se izpisuje
  await p.click("#chat-back"); // nazaj na polo
  await p.waitForSelector(".op-task", { timeout: 15000 });
  await vprasaj(5);
  await p.waitForFunction(() => /Tvoje vprašanje pošljem takoj za tem/.test(document.querySelector("#toast")?.textContent), null, { timeout: 5000 });
  return vprasaj;
}
const pocakaj = async (p, pogoj) => {
  for (let i = 0; !pogoj() && i < 150; i++) await p.waitForTimeout(100);
};

test("drugo vprašanje iz pole med odgovorom: počaka in se pošlje, drugo dejanje pole pove zakaj", opts, async () => {
  const st = zVrati();
  const racun = await racunZame(st.srv, "pola2@test.si");
  const { ctx, p } = await stran(st.srv.base, racun);
  try {
    await p.goto(st.srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await doCakanja(p, st);
    // Pola se ob »Vprašaj inštruktorja« zapre; ponovno odprtje pole med čakanjem: obvestilo, nič se ne zgodi.
    await p.waitForFunction(() => !document.querySelector(".op-task"), null, { timeout: 5000 });
    await p.locator("[data-pp-ours]").first().click();
    await p.waitForFunction(() => /Počakaj, da inštruktor odgovori/.test(document.querySelector("#toast")?.textContent), null, { timeout: 5000 });
    await p.waitForTimeout(500);
    assert.equal(st.klicev, 1, "drugo vprašanje čaka na konec prvega odgovora");
    st.pusti();
    await p.waitForSelector("#view-chat:not([hidden])", { timeout: 15000 });
    await pocakaj(p, () => st.klicev >= 2);
    await p.waitForTimeout(1500);
    assert.equal(st.klicev, 2, "obe vprašanji sta prišli do inštruktorja, tretje (med čakanjem) ne");
    const c = pogovori(st.srv, racun.id);
    assert.equal(c.length, 2, JSON.stringify(c));
    assert.ok(c.every((x) => x.n === 1), "noben pogovor ni prazen: " + JSON.stringify(c));
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    st.srv.close();
  }
});

test("med čakanjem odide na Učno pot: vprašanje se pošlje, zaslon ostane Učna pot", opts, async () => {
  const st = zVrati();
  const racun = await racunZame(st.srv, "pola3@test.si");
  const { ctx, p } = await stran(st.srv.base, racun);
  try {
    await p.goto(st.srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await doCakanja(p, st);
    await p.keyboard.press("Escape"); // zapre polo
    await zavihek(p, "path");
    st.pusti();
    await pocakaj(p, () => st.klicev >= 2);
    await p.waitForTimeout(1500);
    assert.equal(st.klicev, 2);
    assert.ok(await p.locator("#view-path").isVisible(), "Učna pot ostane odprta");
    const c = pogovori(st.srv, racun.id);
    assert.equal(c.length, 2, JSON.stringify(c));
    assert.ok(c.every((x) => x.n === 1), JSON.stringify(c));
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    st.srv.close();
  }
});

test("med čakanjem zamenja profil: vprašanje Ane ne gre v pogovor (in mejo) Bora", opts, async () => {
  const st = zVrati();
  const { cookie, ids } = await druzina(st.srv, "pola-druzina@test.si");
  const [ana, bor] = ids;
  const { ctx, p } = await stran(st.srv.base, { cookie, id: ana });
  try {
    await p.goto(st.srv.base + "/");
    await odkleni(p, ids);
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await doCakanja(p, st);
    await p.keyboard.press("Escape");
    await menjajProfil(p, bor);
    st.pusti();
    await p.waitForTimeout(3000);
    assert.equal(st.klicev, 1, "drugo vprašanje se ni poslalo");
    assert.deepEqual(pogovori(st.srv, bor), [], "Bor nima pogovora z Aninim vprašanjem");
    assert.equal(pogovori(st.srv, ana).length, 1, "Ana ima le prvi pogovor");
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    st.srv.close();
  }
});

test.after(() => chromium?.close());
