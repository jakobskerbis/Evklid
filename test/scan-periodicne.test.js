// Nepopolne periodične rešitve (zunanja revizija 26. 11. 2026): brez SymPy je cos x = 1/2 z le π/3 + 2kπ dobil
// »delno preverjeno«. Zdaj je to napaka »manjka« s seznamom ničel, ki jih nobena družina ne zajame.
import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyAi } from "../public/scan/verify.js";
import { kotPi, retryFeedback } from "../server/scan.js";

const eq = (solutions) => ({ kind: "equation", variable: "x", solutions });

test("manjkajoča veja ali predolga perioda: »manjka«, najbližja manjkajoča ničla prva", () => {
  const r = verifyAi("cos(x)=1/2", eq(["pi/3+2*k*pi"]));
  assert.equal(r.status, "wrong");
  assert.equal(r.reason, "missing");
  assert.ok(Math.abs(r.missing[0] + Math.PI / 3) < 1e-6, String(r.missing[0]));
  for (const [naloga, sol] of [
    ["tan(x)=1", ["pi/4+2*k*pi"]],
    ["cos(2*x)=1", ["2*k*pi"]],
    ["cos(x)=0", ["pi/2+2*k*pi"]],
    ["sin(x)=1/2", ["pi/6+2*k*pi"]],
    ["cos(x)=1/2", ["x = π/3 + 2kπ"]],
  ])
    assert.equal(verifyAi(naloga, eq(sol)).reason, "missing", naloga);
});

test("popolne periodične rešitve ostanejo »delno« (okno [−20, 20] ni dokaz za vse k)", () => {
  for (const [naloga, sol] of [
    ["cos(x)=1/2", ["pi/3+2*k*pi", "-pi/3+2*k*pi"]],
    ["cos(x)=1/2", ["pi/3+2*k*pi", "5*pi/3+2*k*pi"]], // druga oblika iste veje
    ["sin(x)=0", ["k*pi"]],
    ["sin(x)=0", ["2*k*pi", "pi+2*k*pi"]],
    ["tan(x)=1", ["pi/4+k*pi"]],
    ["cos(2*x)=1", ["k*pi"]],
    ["sin(x)=1/2", ["pi/6+2*k*pi", "5*pi/6+2*k*pi"]],
    ["cos(x)=1/2", ["x = π/3 + 2kπ", "x = -π/3 + 2kπ"]], // »2kπ«: prej ni veljalo za periodično (lažni alarm)
    ["2*sin(x)^2-1=0", ["pi/4+k*pi/2"]],
    ["sin(x)+cos(x)=1", ["2*k*pi", "pi/2+2*k*pi"]],
  ]) {
    const r = verifyAi(naloga, eq(sol));
    assert.equal(r.status, "partial", `${naloga} ${sol}`);
  }
  // zapisa, ki ga ni mogoče prebrati kot družino a + b·k, ne razglasimo za napako
  assert.notEqual(verifyAi("cos(x)=1/2", eq(["±pi/3+2kπ, k ∈ ℤ"])).reason, "missing");
});

test("povratna informacija za ponovni poskus pove manjkajočo vejo kot večkratnik π", () => {
  assert.equal(kotPi(-Math.PI / 3), "-1.0472 (= -pi/3)");
  assert.equal(kotPi(5 * Math.PI / 3), "5.2360 (= 5*pi/3)");
  assert.equal(kotPi(2), "2.0000");
  const r = verifyAi("cos(x)=1/2", eq(["pi/3+2*k*pi"]));
  assert.match(retryFeedback(eq(["pi/3+2*k*pi"]), r), /-pi\/3/);
});
