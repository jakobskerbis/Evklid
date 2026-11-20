// Naravni klepet v aplikaciji (mobile/src/lib/rich.ts, RichText): povezava v odgovoru inštruktorja je <a> samo za
// http(s), mailto in tel; drugo ostane besedilo, WebView besedila pa sam odpre le te sheme (mobile/src/lib/povezave.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Marked } from "marked";
import katex from "katex";
import { createRenderer } from "../public/rich.js";

// mobile/package.json nima »type: module«: modul se uvozi kot kopija .mjs (brez opozorila Node).
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-povezave-"));
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));
fs.copyFileSync("mobile/src/lib/povezave.js", path.join(dir, "povezave.mjs"));
const { izrisPovezave, varnaPovezava, vrstaPovezave } = await import(pathToFileURL(path.join(dir, "povezave.mjs")).href);

// Enako kot safeMarked/untrusted v mobile/src/lib/rich.ts.
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const safeMarked = new Marked({ renderer: { html: ({ text }) => esc(text), link: izrisPovezave } });
const untrusted = createRenderer({ marked: safeMarked, katex, sanitize: (h) => h });
const render = (md) => untrusted.renderRich(md);
const hrefs = (html) => [...html.matchAll(/<a\b[^>]*?\bhref="([^"]*)"/gi)].map((m) => m[1]);

test("rich.ts uporablja izris povezav iz povezave.js za odgovore inštruktorja", () => {
  const src = fs.readFileSync("mobile/src/lib/rich.ts", "utf8");
  assert.match(src, /const safeMarked = new Marked\(\{ renderer: \{.*\blink: izrisPovezave \} \}\);/);
  assert.match(src, /import \{ izrisPovezave \} from "\.\/povezave\.js"/);
});

const NEVARNE = [
  "[x](javascript:alert(1))",
  "[x](JaVaScRiPt:alert(1))",
  "[x](<java\tscript:alert(1)>)",
  "[x](java&#x09;script:alert(1))",
  "[x](&#106;avascript:alert(1))",
  "[x](javascript&colon;alert(1))",
  "[x](&#x6A;avascript&#58;alert(1))",
  "[x]( javascript:alert(1))",
  "[x](​javascript:alert(1))",
  "[x](data:text/html,<script>alert(1)</script>)",
  "[x](intent://x#Intent;scheme=a;package=com.example;end)",
  "[x](file:///etc/hosts)",
  "[x](vbscript:msgbox(1))",
  "[x](/pot/na/strezniku)",
  "<javascript:alert(1)>",
  "<JaVaScRiPt:alert(1)>",
  "<data:text/html,x>",
  "[x][r]\n\n[r]: javascript:alert(1)",
  '<a href="javascript:alert(1)">surov</a>',
];

for (const md of NEVARNE) {
  test(`brez povezave: ${JSON.stringify(md)}`, () => {
    const html = render(md);
    assert.deepEqual(hrefs(html), [], html);
    assert.doesNotMatch(html, /<a\b/i, html);
  });
}

test("besedilo nevarne povezave ostane vidno", () => {
  assert.match(render("[poglej to](javascript:alert(1))"), /poglej to/);
  assert.match(render("<javascript:alert(1)>"), /javascript:alert\(1\)/);
});

test("http(s), mailto in tel ostanejo povezave", () => {
  assert.deepEqual(hrefs(render("[a](https://evklid.app/x?a=1&b=2)")), ["https://evklid.app/x?a=1&amp;b=2"]);
  assert.deepEqual(hrefs(render("[a](HTTP://example.org)")), ["HTTP://example.org"]);
  assert.deepEqual(hrefs(render("[m](mailto:pomoc@evklid.app)")), ["mailto:pomoc@evklid.app"]);
  assert.deepEqual(hrefs(render("[t](tel:+38612345678)")), ["tel:+38612345678"]);
  assert.deepEqual(hrefs(render("<https://evklid.app>")), ["https://evklid.app"]);
  assert.deepEqual(hrefs(render("www.evklid.app")), ["http://www.evklid.app"]);
  assert.deepEqual(hrefs(render("pomoc@evklid.app")), ["mailto:pomoc@evklid.app"]);
  assert.match(render("[*krepko*](https://evklid.app)"), /<a href="https:\/\/evklid\.app"><em>krepko<\/em><\/a>/);
});

test("parametri, ki so podobni znakovnim referencam (&tab=, &lt=, &nbsp=), ostanejo celi", () => {
  assert.deepEqual(hrefs(render("[a](https://e.si/?id=1&tab=2)")), ["https://e.si/?id=1&amp;tab=2"]);
  assert.deepEqual(hrefs(render("https://e.si/?q=1&lt=5&nbsp=3")), ["https://e.si/?q=1&amp;lt=5&amp;nbsp=3"]);
  assert.deepEqual(hrefs(render("[a](https://e.si/?a=1&amp;b=2)")), ["https://e.si/?a=1&amp;b=2"]);
  assert.equal(varnaPovezava("&#104;ttps://e.si/?x&tab=1"), "https://e.si/?x&tab=1");
  assert.equal(varnaPovezava("\u200bhttps://e.si"), null);
});

test("naslov in title sta ubežana", () => {
  const html = render('[a](https://e.si/"onmouseover="x "t"<b>")');
  for (const tag of html.match(/<a\b[^>]*>/g) || []) assert.doesNotMatch(tag, /"\s*onmouseover=/, tag);
});

test("varnaPovezava: dovoljene sheme po čiščenju, sicer null", () => {
  assert.equal(varnaPovezava("https://a.si"), "https://a.si");
  assert.equal(varnaPovezava(" \thttps://a.si\n"), "https://a.si");
  assert.equal(varnaPovezava("mailto:a@b.si"), "mailto:a@b.si");
  assert.equal(varnaPovezava("TEL:+386"), "TEL:+386");
  for (const bad of ["javascript:x", "java\tscript:x", "java\nscript:x", "\u0001javascript:x", "&#106;avascript:x", "&amp;#106;avascript:x", "data:x", "intent:x", "file:x", "vbscript:x", "blob:x", "about:blank", "//a.si", "", null, undefined, 5])
    assert.equal(varnaPovezava(bad), null, String(bad));
});

test("vrstaPovezave: splet (vgrajeni brskalnik), sistem (mailto, tel) ali nič", () => {
  assert.equal(vrstaPovezave("https://evklid.app/x"), "splet");
  assert.equal(vrstaPovezave("http://example.org"), "splet");
  assert.equal(vrstaPovezave("mailto:a@b.si"), "sistem");
  assert.equal(vrstaPovezave("tel:+386"), "sistem");
  for (const u of ["javascript:alert(1)", "data:text/html,x", "intent://x#Intent;end", "file:///etc/hosts", "vbscript:x", "sms:123", "evklid://x", "about:srcdoc"]) assert.equal(vrstaPovezave(u), null, u);
});

test("RichText: privzeto ne naloži ničesar, http(s) v brskalnik, mailto/tel sistemu", () => {
  const src = fs.readFileSync("mobile/src/components/RichText.tsx", "utf8");
  const body = src.slice(src.indexOf("onShouldStartLoadWithRequest"), src.indexOf("javaScriptEnabled", src.indexOf("onShouldStartLoadWithRequest")));
  assert.match(body, /vrstaPovezave\(req\.url\)/);
  assert.match(body, /return false;\s*\}\}\s*$/);
  // »return true« samo za sam dokument (baseUrl) in prazno stran.
  const trues = body.match(/return true/g) || [];
  assert.equal(trues.length, 1);
  assert.match(body, /if \(req\.url === `\$\{API_URL\}\/` \|\| req\.url === "about:blank"\) return true;/);
  assert.match(body, /Linking\.openURL/);
});
