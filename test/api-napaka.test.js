// Koda vzroka napake API-ja v sporočilu učencu (lastnik iz nje vidi, kaj popraviti).
import test from "node:test";
import assert from "node:assert/strict";
import { apiErrorCode, errorText, ERROR_TEXT } from "../server/claude.js";

test("koda napake API-ja po vzroku", () => {
  assert.equal(apiErrorCode({ status: 401, message: "invalid x-api-key" }), "401 neveljaven API ključ");
  assert.equal(
    apiErrorCode({ status: 400, error: { error: { message: "Your credit balance is too low to access the Anthropic API." } } }),
    "400 ni dobroimetja na API računu",
  );
  assert.equal(apiErrorCode({ status: 400, message: "thinking: invalid" }), "400 napačna zahteva");
  assert.equal(apiErrorCode({ status: 529, message: "Overloaded" }), "529 Anthropic je preobremenjen");
  assert.equal(apiErrorCode({ name: "APIConnectionError", message: "Connection error." }), "brez povezave do Anthropic");
  assert.equal(apiErrorCode({ name: "AbortError", message: "aborted" }), null);
});

test("sporočilo ima kodo na koncu", () => {
  assert.equal(errorText({ status: 401 }), `${ERROR_TEXT} (Koda: 401 neveljaven API ključ)`);
  assert.equal(errorText({ status: 429 }, "Branje ne deluje."), "Branje ne deluje. (Koda: 429 omejitev porabe)");
  assert.equal(errorText({ name: "AbortError" }), ERROR_TEXT);
});

test("prave napake SDK: prekinitev, časovna omejitev, napaka sredi pretoka, naša napaka", async () => {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  assert.equal(apiErrorCode(new Anthropic.APIUserAbortError()), null);
  assert.equal(apiErrorCode(new Anthropic.APIConnectionTimeoutError()), "brez povezave do Anthropic");
  const sse = new Anthropic.APIError(undefined, { type: "error", error: { type: "overloaded_error", message: "Overloaded" } }, undefined, undefined);
  assert.equal(apiErrorCode(sse), "529 Anthropic je preobremenjen");
  assert.equal(apiErrorCode(new TypeError("x is undefined")), null);
});
