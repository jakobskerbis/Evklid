import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// Napisana gradiva iz testnih primerov (učenci jih ne vidijo).
process.env.EVKLID_GRADIVA = new URL("./fixtures/gradiva", import.meta.url).pathname;
const { checkGradivo, gradivaFor, gradivoPage, videoFor, seconds, parseGradivo } = await import("../server/gradiva-vsebina.js");
const { mountGradiva, authoredMap } = await import("../server/gradiva.js");
const { default: express } = await import("express");
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";
const src = (v) => fs.readFileSync(new URL(`./fixtures/gradiva/${v}/${OHM}.md`, import.meta.url), "utf8");

test("fixtures pass the format check", () => {
  for (const v of ["poskus", "projekt", "video"]) assert.deepEqual(checkGradivo(v, src(v), OHM), [], v);
  assert.deepEqual(gradivaFor(OHM), ["poskus", "projekt", "video"]);
  assert.deepEqual(gradivaFor("FIZ-OS-9/delo"), []);
  assert.equal(seconds("1:30"), 90);
  assert.equal(seconds("90"), null);
});

test("authored mind map: keyword branches, and »Label: detail« keeps its detail", () => {
  assert.deepEqual(authoredMap(OHM), [
    { label: "Upor", detail: "nasprotuje toku · enota ohm ($\\Omega$)" },
    { label: "Ohmov zakon", detail: "velja za kovine · $I = \\dfrac{U}{R}$" },
    { label: "Graf $I(U)$", detail: "premica skozi izhodišče" },
  ]);
});

test("format check catches missing safety, bad scenes and unknown simulations", () => {
  const noSafety = src("poskus").replace(/## Varnost[\s\S]*?## Potrebuješ/, "## Potrebuješ");
  assert.ok(checkGradivo("poskus", noSafety).some((e) => e.includes("Varnost")));
  assert.ok(checkGradivo("poskus", src("poskus").replace("avtor: AI", "avtor: Opus")).some((e) => e.includes("avtor")));
  const badVideo = src("video").replace("simulacija: ohm", "simulacija: ni-je").replace("## 0:30", "## 0:10").replace("trajanje: 1:00", "trajanje: 5:00");
  const errs = checkGradivo("video", badVideo);
  assert.ok(errs.some((e) => e.includes("ne obstaja")));
  assert.ok(errs.some((e) => e.includes("ni za prejšnjim")));
  assert.ok(errs.some((e) => e.includes("trajanje")));
  assert.ok(checkGradivo("projekt", src("projekt") + "\n## Dodatek\n\nx\n").some((e) => e.includes("nepričakovan")));
  assert.ok(checkGradivo("poskus", src("poskus").replace("$R$", "$\\frac{R$")).some((e) => e.includes("formula")));
});

test("experiment page puts safety first and the answer at the bottom", () => {
  const html = gradivoPage("poskus", OHM);
  assert.ok(html.indexOf("Varnost") < html.indexOf("Potrebuješ"));
  assert.ok(html.indexOf("Kaj se zgodi s tokom") < html.indexOf("upor se zmanjša"));
  assert.match(html, /class="answer"/);
  assert.match(gradivoPage("projekt", OHM), /Merila/);
  assert.equal(gradivoPage("video", OHM), null);
});

test("video script: scenes with captions, speech and simulation actions", () => {
  const v = videoFor(OHM);
  assert.equal(v.sim, "ohm");
  assert.equal(v.duration, 60);
  assert.deepEqual(v.scenes.map((s) => s.t), [0, 15, 30, 45]);
  assert.deepEqual(v.scenes[0].actions, [{ do: "set", target: "napetost U", value: "6" }, { do: "set", target: "upor R", value: "20" }]);
  assert.match(v.scenes[0].speak, /20 ohmov/);
  assert.match(v.scenes[3].html, /katex/);
});

test("HTTP: written materials are listed and served", async () => {
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana");
    const list = await (await fetch(`${base}/api/students/${s.id}/gradiva?topic=${OHM}`)).json();
    assert.deepEqual(list.items.map((x) => x.vrsta), ["povzetek", "zvok", "delovni-list", "video", "poskus", "projekt"]);
    let r = await fetch(`${base}/api/students/${s.id}/gradiva/stran?vrsta=poskus&topic=${OHM}`);
    assert.equal(r.status, 200);
    assert.equal((await fetch(`${base}/api/students/${s.id}/gradiva/stran?vrsta=video&topic=${OHM}`)).status, 400);
    assert.equal((await fetch(`${base}/api/students/${s.id}/gradiva/stran?vrsta=poskus&topic=FIZ-OS-9/delo`)).status, 404);
    r = await fetch(`${base}/api/students/${s.id}/gradiva/video?topic=${OHM}`);
    assert.equal((await r.json()).scenes.length, 4);
    assert.equal((await fetch(`${base}/api/students/${s.id}/gradiva/video?topic=FIZ-OS-9/delo`)).status, 404);
  } finally {
    server.close();
  }
});

test("format check: order, answer line, typos in actions, options, CRLF", () => {
  const p = src("poskus");
  const swapped = p.replace(/(## Varnost[\s\S]*?)(## Potrebuješ[\s\S]*?)(## Postopek)/, "$2$1$3");
  assert.ok(checkGradivo("poskus", swapped).some((e) => e.includes("vrstnem redu")));
  assert.ok(checkGradivo("poskus", p.replace("> Odgovor:", "Odgovor:")).some((e) => e.includes("Odgovor")));
  assert.ok(checkGradivo("poskus", p + "\n## Zakaj\n\nše enkrat\n").some((e) => e.includes("dvakrat")));
  assert.deepEqual(checkGradivo("poskus", p.replace(/\n/g, "\r\n")), []);
  const v = src("video");
  const noEq = v.replace("- nastavi: upor R = 40", "- nastavi: upor R");
  assert.ok(checkGradivo("video", noEq).some((e) => e.includes("brez vrednosti")));
  assert.deepEqual(parseGradivo("video", noEq).scenes[2].actions, [{ do: "set", target: "upor R", value: "" }]);
  assert.ok(checkGradivo("video", v.replace("- nastavi: upor R = 40", "- nastvai: upor R = 40")).some((e) => e.includes("alineja")));
  assert.ok(checkGradivo("video", v.replace("simulacija: ohm", 'simulacija: ohm\nmoznosti: [1]')).some((e) => e.includes("moznosti")));
  assert.deepEqual(checkGradivo("__proto__", v), ["neznana vrsta __proto__"]);
  assert.deepEqual(checkGradivo("video", v.replace(/\n/g, "\r\n")), []);
});

test("HTTP: locked written materials are 403 for a student without the topic", async () => {
  const app = express();
  const s = { id: 7 };
  mountGradiva(app, null, { loadStudent: () => s, accounts: { lessonInteractive: () => false, rightsFor: () => ({}) } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api/students/7/gradiva`;
  try {
    const list = await (await fetch(`${base}?topic=${OHM}`)).json();
    assert.ok(list.items.filter((x) => ["video", "poskus", "projekt"].includes(x.vrsta)).every((x) => x.locked));
    assert.equal((await fetch(`${base}/stran?vrsta=poskus&topic=${OHM}`)).status, 403);
    assert.equal((await fetch(`${base}/video?topic=${OHM}`)).status, 403);
  } finally {
    server.close();
  }
});
