// Starejše fotografije v zgodovini se modelu ne pošiljajo z vsakim sporočilom (j 2026-11-06, dolgi pogovori).
import test from "node:test";
import assert from "node:assert/strict";
import { staleImages, OLD_IMAGE_TEXT, windowHistory } from "../server/usage.js";
import { messageTokens, IMAGE_TOKENS } from "../server/meje-ai.js";
import { withAccounts, META } from "./racuni-pomoc.js";

const img = { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "AAAA" } };
const hasImage = (m) => Array.isArray(m.content) && m.content.some((b) => b?.type === "image");

function chat(n, imageAt) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({ role: "user", content: i === imageAt ? [img, { type: "text", text: `vprašanje ${i}` }] : [{ type: "text", text: `vprašanje ${i}` }] });
    out.push({ role: "assistant", content: [{ type: "text", text: i === imageAt ? "Prebral sem: x + 2 = 5." : `odgovor ${i}` }] });
  }
  return out;
}

test("staleImages: slika ostane samo v zadnjem učenčevem sporočilu, starejše dobijo besedilo", () => {
  const h = chat(4, 1);
  const out = staleImages(h, 1);
  assert.ok(!out.some(hasImage));
  assert.deepEqual(out[2].content, [{ type: "text", text: OLD_IMAGE_TEXT }, { type: "text", text: "vprašanje 1" }]);
  assert.ok(hasImage(h[2]), "vhodni seznam ostane nespremenjen (baza se ne spremeni)");
  // Zadnje učenčevo sporočilo (»Razloži podrobneje« takoj po fotografiji) sliko še ima.
  assert.ok(hasImage(staleImages(chat(2, 1), 1)[2]));
  assert.ok(!staleImages(chat(2, 1), 0).some(hasImage), "keep 0: brez slik v zgodovini");
  // Več slik v enem sporočilu: en nadomestni blok.
  const two = [{ role: "user", content: [img, img, { type: "text", text: "dve" }] }, { role: "assistant", content: "ok" }, { role: "user", content: "naprej" }];
  assert.deepEqual(staleImages(two, 1)[0].content, [{ type: "text", text: OLD_IMAGE_TEXT }, { type: "text", text: "dve" }]);
  // Besedilna vsebina (string) in sporočila brez slike ostanejo isti objekti.
  assert.equal(staleImages(two, 1)[2], two[2]);
});

test("staleImages: sporočilo se spremeni enkrat in nato ostane enako (predpomnilnik)", () => {
  const base = chat(3, 0);
  let prev = null;
  for (let extra = 1; extra <= 6; extra++) {
    const h = [...base, ...chat(extra, -1)];
    const first = JSON.stringify(windowHistory(staleImages(h, 1))[0]);
    if (prev) assert.equal(first, prev, "začetek zgodovine je enak iz kroga v krog");
    prev = first;
  }
});

test("staleImages: rezerva meje AI ne šteje več slike v vsakem naslednjem sporočilu", () => {
  const h = chat(5, 0);
  const saved = messageTokens(h) - messageTokens(staleImages(h, 1));
  assert.ok(saved >= IMAGE_TOKENS - 300, `prihranek ${saved} žetonov`);
});

test("klepet: fotografija gre modelu v svojem in naslednjem sporočilu, nato le besedilo", async () => {
  const seen = [];
  const reply = "Prebral sem: 2x = 6.\nRešimo." + META;
  await withAccounts(
    {},
    async ({ call, kid }) => {
      const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const send = (body) => call(`/api/conversations/${conv.id}/messages`, { method: "POST", body });
      assert.equal((await send({ text: "Reši", image: { media_type: "image/jpeg", data: "AAAA" } })).status, 200);
      assert.equal((await send({ text: "Zakaj deliš z 2?" })).status, 200);
      assert.equal((await send({ text: "Kaj pa naslednja?" })).status, 200);
      assert.equal((await send({ text: "In potem?" })).status, 200);
      const imgs = seen.map((msgs) => msgs.filter(hasImage).length);
      assert.deepEqual(imgs, [1, 1, 0, 0], "slika: trenutno sporočilo, nato še enkrat, potem ne več");
      const first = (msgs) => JSON.stringify(msgs.find((m) => m.role === "user"));
      assert.match(first(seen[2]), /ni več priložena/);
      assert.equal(first(seen[2]), first(seen[3]), "nadomestilo je enako v vseh naslednjih krogih");
    },
    {
      streamFn: async ({ messages, onText }) => {
        seen.push(messages);
        onText(reply);
        return { text: reply, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 20 } };
      },
    },
  );
});

test("A7: sodba kode o nalogi s fotografije ostane, ko je slika v zgodovini že nadomeščena", async () => {
  const seen = [];
  const reply = "Prebral sem: 2x = 6. Kaj dobiš?" + META;
  await withAccounts(
    {},
    async ({ call, kid }) => {
      const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const send = (body) => call(`/api/conversations/${conv.id}/messages`, { method: "POST", body });
      await send({ text: "Reši 2x = 6", image: { media_type: "image/jpeg", data: "AAAA" } });
      await send({ text: "Zakaj deliš?" });
      await send({ text: "Aha, razumem." });
      await send({ text: "x = 3" });
      const last = JSON.stringify(seen.at(-1));
      assert.match(last, /ni več priložena/, "slika je v tem krogu že nadomeščena");
      assert.match(last, /preverjen_racun[\s\S]*exact check/, "koda je sodila trditev o nalogi s fotografije");
    },
    {
      streamFn: async ({ messages, onText }) => {
        seen.push(messages);
        onText(reply);
        return { text: reply, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 20 } };
      },
    },
  );
});
