// Geslo za testno različico: stran za prijavo, piškotek, povezava za prijatelje.
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { passwordGate, gateNeeded } from "../server/gate.js";

async function withServer(fn) {
  const app = express();
  app.use(passwordGate("skrivno geslo"));
  app.get("/", (_req, res) => res.send("DOMOV"));
  app.get("/api/x", (_req, res) => res.json({ ok: true }));
  app.get("/manifest.webmanifest", (_req, res) => res.json({ name: "Evklid" }));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}
const html = { accept: "text/html" };
const cookieOf = (r) => (r.headers.get("set-cookie") || "").split(";")[0];

test("brez gesla: stran za prijavo namesto okna brskalnika, API vrne 401", () => withServer(async (base) => {
  const r = await fetch(base + "/", { headers: html });
  assert.equal(r.status, 401);
  assert.equal(r.headers.get("www-authenticate"), null);
  assert.match(await r.text(), /name="geslo"/);
  const a = await fetch(base + "/api/x");
  assert.equal(a.status, 401);
  assert.match((await a.json()).error, /prijava/);
}));

test("opis aplikacije za začetni zaslon je dostopen brez gesla", () => withServer(async (base) => {
  const r = await fetch(base + "/manifest.webmanifest");
  assert.equal(r.status, 200);
}));

test("prijava z obrazcem nastavi piškotek, ki odpre aplikacijo", () => withServer(async (base) => {
  const bad = await fetch(base + "/prijava", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "geslo=narobe&naprej=%2F" });
  assert.equal(bad.status, 401);
  assert.match(await bad.text(), /Napačno geslo/);
  const ok = await fetch(base + "/prijava", { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "geslo=skrivno+geslo&naprej=%2F%2Fzlo.si" });
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get("location"), "/"); // brez preusmeritve na tujo stran
  const c = cookieOf(ok);
  assert.match(c, /^evklid_geslo=[a-f0-9]{64}$/);
  assert.match(ok.headers.get("set-cookie"), /HttpOnly/);
  const r = await fetch(base + "/api/x", { headers: { cookie: c } });
  assert.equal(r.status, 200);
}));

test("povezava za prijatelje ?geslo= prijavi in odstrani geslo iz naslova", () => withServer(async (base) => {
  const r = await fetch(base + "/?geslo=skrivno%20geslo&a=1", { redirect: "manual", headers: html });
  assert.equal(r.status, 303);
  assert.equal(r.headers.get("location"), "/?a=1");
  const home = await fetch(base + "/", { headers: { ...html, cookie: cookieOf(r) } });
  assert.equal(await home.text(), "DOMOV");
  const wrong = await fetch(base + "/?geslo=x", { redirect: "manual", headers: html });
  assert.equal(wrong.status, 401);
  assert.match(await wrong.text(), /ne velja/);
}));

test("staro geslo prek HTTP Basic še deluje", () => withServer(async (base) => {
  const auth = "Basic " + Buffer.from("x:skrivno geslo").toString("base64");
  const r = await fetch(base + "/api/x", { headers: { authorization: auth } });
  assert.equal(r.status, 200);
}));

test("z računi skupnega gesla ni (vstop je prijava v račun), razen z EVKLID_GATE=1", () => {
  assert.equal(gateNeeded({}), false);
  assert.equal(gateNeeded({ EVKLID_PASSWORD: "x" }), true);
  assert.equal(gateNeeded({ EVKLID_PASSWORD: "x", EVKLID_ACCOUNTS: "1" }), false);
  assert.equal(gateNeeded({ EVKLID_PASSWORD: "x", EVKLID_ACCOUNTS: "1", EVKLID_GATE: "1" }), true);
  assert.equal(gateNeeded({ EVKLID_ACCOUNTS: "1", EVKLID_GATE: "1" }), false);
});
