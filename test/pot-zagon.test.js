// Konec zagona Učne poti (N-08, meritev 25. 11. 2026): app.js finishStart zamenja posnetek ali Učno pot s strežnika s
// pravo, ko so končani klici pogleda. Vsebina verjetnih naslednjih tem (kliki.js temeVnaprej) se prenaša v mirovanju in
// je bila štela kot klic pogleda: na počasnem 4G je zadržala Učno pot za ~0,7 s, čeprav je bila že izrisana.
import test from "node:test";
import assert from "node:assert/strict";
import { teme, temeVnaprej } from "../public/kliki.js";

const lazniApi = () => {
  const klici = [];
  const api = (url, opts) => {
    klici.push([url, opts ?? null]);
    return Promise.resolve({ id: url, explanation: "" });
  };
  return { api, klici };
};
const koren = (ids) => ({ querySelectorAll: () => ids.map((id) => ({ dataset: { open: id } })) });

test("teme vnaprej: prenos v ozadju (konec zagona ga ne čaka); odprtje teme ostane klic pogleda", async () => {
  const { api, klici } = lazniApi();
  const tm = teme({ api, kopija: (x) => x, jezik: () => "sl", ucenec: () => 7, gen: () => 0 });
  const idle = [];
  temeVnaprej(koren(["MAT-OS-8/a", "MAT-OS-8/b", "MAT-OS-8/a"]), { entry: tm.entry, whenIdle: (fn) => idle.push(fn), izrisi: () => {} });
  assert.equal(klici.length, 0, "šele v mirovanju");
  idle.shift()();
  assert.deepEqual(
    klici.map(([u, o]) => [u, o?.ozadje === true]),
    [
      ["/api/topic?id=MAT-OS-8%2Fa&lang=sl", true],
      ["/api/topic?id=MAT-OS-8%2Fb&lang=sl", true],
    ],
  );
  // Odprtje teme (dotik vozlišča): ista zahteva se ne ponovi, nova tema pa je klic pogleda kot prej.
  await tm.content("MAT-OS-8/a");
  assert.equal(klici.length, 2);
  await tm.content("MAT-OS-8/c");
  assert.deepEqual(klici.at(-1), ["/api/topic?id=MAT-OS-8%2Fc&lang=sl", null]);
});
