// D3: čas strežnika za sporočilo inštruktorju v dolgem pogovoru (60 sporočil, od tega 4 fotografije po 1 MB).
// Zagon: node scripts/meri-zgodovina-pogovora.mjs [koren repozitorija]  (sklop D, meritev prej/potem z isto skripto)
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const ROOT = path.resolve(process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), "..")); // za »prej«: koren starejše kopije
const { openDb } = await import(pathToFileURL(path.join(ROOT, "server/db.js")).href);
const { createApp } = await import(pathToFileURL(path.join(ROOT, "server/app.js")).href);
const { modeParams } = await import(pathToFileURL(path.join(ROOT, "server/claude.js")).href);
const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';
const store = openDb(":memory:");
const streamFn = async ({ mode, onText }) => { const text = `Odgovor.${META}`; onText(text); return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 10, output_tokens: 5 } }; };
const srv = createApp(store, { streamFn }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const post = (p, b) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b || {}) });
const s = await (await post("/api/students", { name: "Ana" })).json();
const c = await (await post(`/api/students/${s.id}/conversations`)).json();
const slika = crypto.randomBytes(750_000).toString("base64");
for (let i = 0; i < 60; i++) {
  const user = i % 2 === 0;
  const content = user && i % 15 === 0 ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: slika } }, { type: "text", text: `Vprašanje ${i}` }] : [{ type: "text", text: `${user ? "Vprašanje" : "Odgovor"} ${i} ${"besedilo ".repeat(80)}` }];
  store.addMessage(c.id, user ? "user" : "assistant", content, `S ${i}`, user && i % 15 === 0);
}
const casi = [];
for (let i = 0; i < 12; i++) {
  const t = performance.now();
  const r = await post(`/api/conversations/${c.id}/messages`, { text: `Koliko je ${i} + 1?` });
  await r.text();
  casi.push(performance.now() - t);
  store.db.prepare("DELETE FROM messages WHERE id IN (SELECT id FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 2)").run(c.id);
}
srv.close();
casi.shift();
casi.sort((a, b) => a - b);
console.log(JSON.stringify({ tocka: "D3 sporočilo, 60 sporočil + 4 fotografije", mediana_ms: +casi[5].toFixed(1), najmanj_ms: +casi[0].toFixed(1) }));
process.exit(0);
