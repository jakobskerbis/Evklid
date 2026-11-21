// Del »prijavljen« meritve zmogljivosti (scripts/meritev-zmogljivosti.mjs, pomožni deli v scripts/meritev-prijavljen.mjs):
// realistično napolnjen učenec je ponovljiv in ima nekaj tednov napredka ter dolg zadnji pogovor, povzetek zahtev
// loči omrežje od predpomnilnika service workerja, posrednik HTTP/2 prenese zahteve nespremenjene, skripta pozna del
// »prijavljen« in ga ne zažene privzeto.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import http2 from "node:http2";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DOLGI_POGOVOR, nacrtUcenca, povzemiZahteve, nakljucno, MERILNIK_PRIJAVLJEN, zazeniHttp2Posrednik } from "../scripts/meritev-prijavljen.mjs";

test("prijavljen: načrt učenca je ponovljiv, z nekaj tedni napredka in dolgim zadnjim pogovorom", () => {
  const a = nacrtUcenca();
  assert.deepEqual(a, nacrtUcenca(), "isto seme, isti učenec");
  assert.notDeepEqual(nacrtUcenca({ seme: 8 }).xp, a.xp);
  assert.equal(a.dni, 21);
  assert.equal(a.pogovori.length, 30);
  const [dolgi, ...ostali] = a.pogovori;
  assert.equal(dolgi.sporocila.length, 120);
  assert.equal(dolgi.dniNazaj, 0);
  assert.equal(dolgi.naslov, DOLGI_POGOVOR, "meritev ga v seznamu najde po naslovu");
  assert.equal(a.pogovori.filter((p) => p.naslov === DOLGI_POGOVOR).length, 1);
  for (const p of a.pogovori) {
    assert.equal(p.sporocila.length % 2, 0, "vprašanje in odgovor");
    p.sporocila.forEach((m, i) => assert.equal(m.role, i % 2 ? "assistant" : "user"));
    assert.ok(p.dniNazaj >= 0 && p.dniNazaj < a.dni);
  }
  assert.ok(Math.max(...ostali.map((p) => p.dniNazaj)) >= 14, "pogovori čez več tednov");
  // Odgovori kot pri pravem modelu: formule v vrstici in v bloku, krepko.
  const odg = dolgi.sporocila[1].text;
  assert.match(odg, /\$\$[^$]+\$\$/);
  assert.match(odg, /\*\*1\. korak:\*\*/);
  assert.ok(odg.length > 150);
  const dniZXp = new Set(a.xp.map((x) => x.dniNazaj));
  assert.ok(dniZXp.size >= 15 && dniZXp.size < a.dni, `${dniZXp.size} dni z učenjem (en dan v tednu prost)`);
  assert.equal(a.naloge.length, a.xp.length);
  assert.ok(a.naloge.filter((n) => n.pravilno).length / a.naloge.length > 0.6);
});

test("prijavljen: povzetek zahtev šteje prenos samo po omrežju (ne iz predpomnilnika service workerja)", () => {
  const z = [
    { prenos: 2048, surovo: 4096, izSw: false, odSw: false }, // po omrežju, brez service workerja
    { prenos: 1024, surovo: 3072, izSw: true, odSw: false }, // stran iz service workerja
    { prenos: 512, surovo: 1024, izSw: false, odSw: true }, // service worker sam po omrežju
    { prenos: null, surovo: null, izSw: false, odSw: false },
  ];
  assert.deepEqual(povzemiZahteve(z), { zahtev: 3, izSw: 1, mreznih: 2, prenosKB: 2, suroviKB: 7, swZahtev: 1, swKB: 1 });
  assert.deepEqual(povzemiZahteve([]), { zahtev: 0, izSw: 0, mreznih: 0, prenosKB: 0, suroviKB: 0, swZahtev: 0, swKB: 0 });
});

test("prijavljen: naključna števila so v [0, 1) in ponovljiva; merilnik v strani je samostojna funkcija", () => {
  const r = nakljucno(3);
  const x = Array.from({ length: 1000 }, r);
  assert.ok(x.every((v) => v >= 0 && v < 1));
  assert.deepEqual(Array.from({ length: 5 }, nakljucno(3)), x.slice(0, 5));
  // addInitScript pošlje besedilo funkcije: brez sklicev na uvoze modula.
  const src = MERILNIK_PRIJAVLJEN.toString();
  for (const ime of ["nacrtUcenca", "povzemiZahteve", "nakljucno", "import"]) assert.ok(!src.includes(ime), ime);
  for (const s of ["#view-path #xp-card .hero", "#view-chat #input", "#messages .msg.assistant", "__cakaj", "__tPot", "__tApp", "main#view-path:not([data-posnetek])"]) assert.ok(src.includes(s), s);
});

test("prijavljen: skripta pozna del »prijavljen«, privzeto ga ne zažene", () => {
  const r = spawnSync(process.execPath, ["scripts/meritev-zmogljivosti.mjs", "--samo", "neobstojec", "--brez-taskset"], { encoding: "utf8" });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /možni: [^)]*prijavljen/);
  const src = fs.readFileSync("scripts/meritev-zmogljivosti.mjs", "utf8");
  assert.match(src, /DELI\.filter\(\(d\) => d !== "obremenitev" && d !== "prijavljen" && d !== "kliki"\)/, "privzeti deli brez »prijavljen« (potrebuje koren)");
  const glava = src.split("\n").slice(0, 40).join("\n");
  assert.match(glava, /prijavljen +[A-Z0-9]/, "del je opisan v glavi skripte");
});

test("prijavljen: posrednik HTTP/2 prenese metodo, telo, glave, piškotke in tok do strežnika HTTP/1.1", async (t) => {
  if (spawnSync("openssl", ["version"]).status !== 0) return t.skip("ni openssl");
  const gor = http.createServer((req, res) => {
    let telo = "";
    req.on("data", (d) => (telo += d));
    req.on("end", () => {
      res.setHeader("Set-Cookie", ["a=1; Path=/", "b=2; Path=/"]);
      res.setHeader("Content-Type", "text/plain");
      res.write(JSON.stringify({ metoda: req.method, pot: req.url, host: req.headers.host, proto: req.headers["x-forwarded-proto"], telo }));
      setTimeout(() => res.end("|konec"), 20); // drugi kos pozneje (kot SSE)
    });
  });
  await new Promise((r) => gor.listen(0, "127.0.0.1", r));
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-posrednik-"));
  const p = await zazeniHttp2Posrednik({ cilj: `http://127.0.0.1:${gor.address().port}`, mapa });
  try {
    assert.match(p.base, /^https:\/\/127\.0\.0\.1:\d+$/);
    assert.match(p.spki, /^[A-Za-z0-9+/]{43}=$/);
    const seja = http2.connect(p.base, { rejectUnauthorized: false });
    const odgovor = await new Promise((res, rej) => {
      const z = seja.request({ ":method": "POST", ":path": "/api/x?y=1", "content-type": "application/json" });
      let glave;
      let telo = "";
      z.on("response", (h) => (glave = h));
      z.on("data", (d) => (telo += d));
      z.on("end", () => res({ glave, telo }));
      z.on("error", rej);
      z.end('{"q":1}');
    });
    seja.close();
    assert.equal(odgovor.glave[":status"], 200);
    assert.deepEqual(odgovor.glave["set-cookie"], ["a=1; Path=/", "b=2; Path=/"]);
    const [json, konec] = odgovor.telo.split("|");
    assert.equal(konec, "konec");
    assert.deepEqual(JSON.parse(json), { metoda: "POST", pot: "/api/x?y=1", host: p.base.replace("https://", ""), proto: "https", telo: '{"q":1}' });
  } finally {
    await p.ustavi();
    gor.close();
    fs.rmSync(mapa, { recursive: true, force: true });
  }
});
