// Preverba kakovosti fotografije na napravi (public/scan/kakovost.js): ostrina, svetloba, odsev, nagib.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure, problemOf, tiltAngle, tiltOff } from "../public/scan/kakovost.js";

// sintetična »stran«: svetel papir s temnimi črtami; blur = širina prehoda roba v pikah
function page({ w = 320, h = 120, paper = 225, ink = 60, blur = 0, glare = 0 } = {}) {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // navpične črte (široke 40 pik, vsakih 160 pik) z linearnim robom širine blur
      const m = x % 160;
      const inside = Math.min(m - 60, 100 - m); // > 0 v črti, < 0 zunaj
      const a = blur > 0 ? Math.max(0, Math.min(1, 0.5 + inside / blur)) : inside >= 0 ? 1 : 0;
      let v = paper + (ink - paper) * a;
      if (glare && y < h * glare) v = 255;
      const i = (y * w + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }
  return [d, w, h];
}

test("ostra stran nima težav, zamegljena je »blur«", () => {
  const sharp = measure(...page());
  const soft = measure(...page({ blur: 50 }));
  assert.ok(sharp.sharpness > soft.sharpness * 3, `${sharp.sharpness} vs ${soft.sharpness}`);
  assert.equal(problemOf(sharp), null);
  assert.equal(problemOf(soft), "blur");
});

test("prag ostrine 0,034: 0,032 je »blur«, 0,037 ne (umerjeno na 2. krogu fotografij)", () => {
  const m = (sharpness) => ({ brightness: 120, contrast: 190, glare: 0, sharpness });
  assert.equal(problemOf(m(0.032)), "blur");
  assert.equal(problemOf(m(0.037)), null);
});

test("temna slika je »dark«, prazen list brez kontrasta ni ostra", () => {
  assert.equal(problemOf(measure(...page({ paper: 40, ink: 10 }))), "dark");
  const blank = measure(...page({ ink: 225 }));
  assert.equal(blank.sharpness, 0);
});

test("velik bel madež je odsev", () => {
  assert.equal(problemOf(measure(...page({ glare: 0.2 }))), "glare");
});

test("nagib: vodoravno in pokončno je v redu, vmes ne", () => {
  assert.equal(Math.round(tiltAngle(0, 0)), 0);
  assert.equal(Math.round(tiltAngle(90, 0)), 90);
  assert.equal(Math.round(tiltAngle(-180, 0)), 0); // zaslon navzdol = list na mizi
  assert.equal(tiltOff(tiltAngle(5, -8)), false);
  assert.equal(tiltOff(tiltAngle(85, 3)), false);
  assert.equal(tiltOff(tiltAngle(45, 0)), true);
  assert.equal(tiltOff(tiltAngle(10, 40)), true);
  assert.equal(tiltAngle(null, 3), null);
  assert.equal(problemOf(measure(...page()), 45), "tilt");
  assert.equal(problemOf(null, 10), null);
});

test("temen posnetek zaslona z velikim kontrastom ni »dark«, prazen okvir ni »blur«", () => {
  assert.equal(problemOf({ brightness: 30, contrast: 200, glare: 0, sharpness: 0.2 }), null);
  assert.equal(problemOf({ brightness: 30, contrast: 40, glare: 0, sharpness: 0.2 }), "dark");
  assert.equal(problemOf({ brightness: 200, contrast: 10, glare: 0, sharpness: 0 }), null);
  assert.equal(problemOf({ brightness: 200, contrast: 10, glare: 0, sharpness: 0 }, 45), "tilt");
});
