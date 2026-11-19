// Začetni podatki Učne poti v strani za prijavljenega učenca (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md
// točka 2): server/zacetni-podatki.js, server/vstopna-stran.js (withSession, withSessionStyles), public/zacetek.js.
// Podatki so enaki odgovorom API v isti seji, samo za navigacijo s sejo, varni pred </script>, stran ni v nobenem
// predpomnilniku (no-store, brez ETag); slogi drugih zaslonov pridejo po prvem izrisu Učne poti.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { varenJson, zaZacetnePodatke } from "../server/zacetni-podatki.js";
import { entryHtml, withSessionStyles, SEJA_POZNEJE } from "../server/vstopna-stran.js";

const quiet = { error() {}, warn() {}, info() {}, log() {} };
const NAV = { "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "accept-language": "sl-SI,sl;q=0.9" };
const SKRIPT = /<script type="application\/json" id="evklid-zacetni">(.*?)<\/script>/s;

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    const cookie = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    const take = (list) => {
      for (const c of list || []) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
    };
    const call = async (path, opts = {}) => {
      const res = await fetch(base + path, { method: opts.method || "GET", redirect: "manual", headers: { "Content-Type": "application/json", cookie: cookie() }, body: opts.body ? JSON.stringify(opts.body) : undefined });
      take(res.headers.getSetCookie());
      const text = await res.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch {}
      return { status: res.status, body };
    };
    // Stran prek http.get: fetch v Node glave Sec-Fetch-* prepiše (kot brskalnik pri fetch()).
    call.page = (headers = NAV, path = "/") =>
      new Promise((ok, bad) => {
        http
          .get(base + path, { headers: { cookie: cookie(), ...headers } }, (r) => {
            const b = [];
            r.on("data", (c) => b.push(c));
            r.on("end", () => ok({ status: r.statusCode, headers: r.headers, html: Buffer.concat(b).toString("utf8") }));
          })
          .on("error", bad);
      });
    call.jar = jar;
    return call;
  };
  const signup = async (email, names) => {
    const c = client();
    const r = await c("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const u = new URL(r.body.dev_verify_url);
    await c(u.pathname + u.search);
    const ids = [];
    for (const name of names) {
      const s = await c("/api/students", { method: "POST", body: { name, birth_year: new Date().getFullYear() - 12, consent: true } });
      assert.equal(s.status, 201, JSON.stringify(s.body));
      ids.push(s.body.id);
    }
    return { c, ids };
  };
  try {
    await fn({ client, signup, base, store });
  } finally {
    server.close();
  }
}

const podatki = (html) => {
  const m = SKRIPT.exec(html);
  return m ? { raw: m[1], data: JSON.parse(m[1]) } : null;
};

test("varenJson: besedilo iz baze ne konča <script> in ne odpre komentarja; JSON ostane enak", () => {
  const obj = { name: "Ana </script><script>alert(1)</script> <!-- & \u2028\u2029 >" };
  const out = varenJson(JSON.stringify(obj));
  assert.ok(!/[<>&\u2028\u2029]/.test(out), out);
  assert.deepEqual(JSON.parse(out), obj);
});

test("samo navigacija brskalnika s piškotkom seje (ne service worker, ne fetch, ne mobilni odjemalec API)", () => {
  const req = (h) => ({ method: "GET", headers: { cookie: "sm_session=abc", ...NAV, ...h } });
  assert.equal(zaZacetnePodatke(req({})), true);
  assert.equal(zaZacetnePodatke(req({ cookie: "sm_device=x" })), false);
  assert.equal(zaZacetnePodatke(req({ cookie: "sm_session=" })), false);
  assert.equal(zaZacetnePodatke(req({ "sec-fetch-dest": "empty", "sec-fetch-mode": "cors" })), false, "namestitev service workerja (fetch('/'))");
  assert.equal(zaZacetnePodatke(req({ "sec-fetch-dest": undefined, "sec-fetch-mode": undefined })), false, "brskalnik brez Sec-Fetch: kot prej");
  assert.equal(zaZacetnePodatke(req({ "x-app-client": "android" })), false);
  assert.equal(zaZacetnePodatke({ ...req({}), method: "HEAD" }), false);
});

test("prijavljen učenec: v strani isti odgovori kot API v tej seji, no-store brez ETag, varno pred </script>", async () => {
  await withServer(async ({ signup }) => {
    const { c, ids } = await signup("ana@primer.si", ["Ana </script><script>alert(1)</script>"]);
    const [sid] = ids;
    const res = await c.page();
    assert.equal(res.status, 200);
    assert.equal(res.headers["cache-control"], "no-store", "osebna stran ne gre v noben predpomnilnik (tudi service worker ne)");
    assert.equal(res.headers.etag, undefined);
    assert.match(res.headers.vary, /Cookie/);
    const p = podatki(res.html);
    assert.ok(p, "podatki v strani");
    assert.ok(!p.raw.includes("<"), "noben < znotraj elementa");
    assert.ok(res.html.indexOf('id="evklid-zacetni"') < res.html.indexOf('src="zacetek.js"'), "pred zacetek.js, ki jih prebere");
    assert.equal(p.data.s, sid);
    for (const url of ["/api/account/status", "/api/config", "/api/students", `/api/students/${sid}/conversations`, `/api/students/${sid}/path`, `/api/students/${sid}/xp`, `/api/students/${sid}/level-up`, `/api/students/${sid}/schedule`])
      assert.deepEqual(p.data.d[url], (await c(url)).body, url);
    const pot = p.data.d[`/api/students/${sid}/path`];
    assert.ok(pot.key && Array.isArray(pot.units), "učna pot");
    assert.ok(p.data.d[`/api/paths?subject=${p.data.d["/api/students"][0].settings.subject}&system=SI`], "seznam poti, kot ga zahteva loadPath");
    assert.ok(p.data.d[`/api/students/${sid}/modes?path=${encodeURIComponent(pot.key)}`]);
    // Slogi drugih zaslonov v <template> (po prvem izrisu), slogi Učne poti ostanejo.
    const head = res.html.slice(0, res.html.indexOf("</head>"));
    for (const f of SEJA_POZNEJE) assert.match(head, new RegExp(`<template data-evklid-slogi>[^]*?<link rel="stylesheet" href="${f.replace(/[.]/g, "\\.")}">[^]*?</template>`), f);
    for (const f of ["style.css", "ui.css", "xp.css", "graph.css", "touch.css", "feedback.css", "schedule.css"]) assert.match(head, new RegExp(`\\n  <link rel="stylesheet" href="${f.replace(/[.]/g, "\\.")}">`), f);
    // Stran za isti piškotek brez navigacije (service worker ob namestitvi): navadna, z ETag, brez podatkov.
    const sw = await c.page({ "sec-fetch-dest": "empty", "sec-fetch-mode": "cors" });
    assert.equal(podatki(sw.html), null);
    assert.ok(sw.headers.etag);
    assert.ok(!sw.html.includes("data-evklid-slogi"));
  });
});

test("zasebnost: drug račun dobi samo svoje podatke; brez seje, z neveljavno sejo ali z več profili brez profila", async () => {
  await withServer(async ({ signup, client }) => {
    const a = await signup("ana@primer.si", ["Ana"]);
    const b = await signup("bor@primer.si", ["Bor"]);
    const pa = podatki((await a.c.page()).html).data;
    const pb = podatki((await b.c.page()).html).data;
    assert.equal(pa.s, a.ids[0]);
    assert.equal(pb.s, b.ids[0]);
    assert.ok(!JSON.stringify(pb).includes("Ana"), "nič od drugega računa");
    assert.ok(!Object.keys(pb.d).some((u) => u.includes(`/students/${a.ids[0]}/`)));
    // Brez seje in z neveljavno sejo: navadna stran (pristajalna ali lupina), brez podatkov.
    const anon = client();
    assert.equal(podatki((await anon.page()).html), null);
    const fake = client();
    fake.jar.sm_session = "x".repeat(43);
    const f = await fake.page();
    assert.equal(f.status, 200);
    assert.equal(podatki(f.html), null);
    // Več profilov: izbira je v brskalniku (localStorage), zato samo račun, nastavitve in seznam profilov.
    const c = await signup("cene@primer.si", ["Cene", "Cvetka"]);
    const pc = podatki((await c.c.page()).html).data;
    assert.equal(pc.s, null);
    assert.deepEqual(Object.keys(pc.d).sort(), ["/api/account/status", "/api/config", "/api/students"]);
    // Mobilni odjemalec API (glava X-App-Client): brez podatkov, kot prej.
    assert.equal(podatki((await a.c.page({ ...NAV, "x-app-client": "android" })).html), null);
  });
});

test("notranji klici: števec aktivnih zahtev se vrne na 0 (samodejna posodobitev čaka nanj)", async () => {
  await withServer(async ({ signup, base }) => {
    const { c } = await signup("ana@primer.si", ["Ana"]);
    for (let i = 0; i < 3; i++) assert.ok(podatki((await c.page()).html));
    await new Promise((r) => setTimeout(r, 50));
    assert.equal((await (await fetch(`${base}/healthz/stanje`)).json()).aktivni, 0);
  });
});

test("slogi seje: v <template> samo slogi zaslonov, ki jih Učna pot ne uporablja, na svojem mestu in v istem vrstnem redu", () => {
  const html = entryHtml(new URL("../public/", import.meta.url).pathname).html;
  const out = withSessionStyles(html);
  const order = (h) => [...h.slice(0, h.indexOf("</head>")).matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
  assert.deepEqual(order(out), order(html), "isti vrstni red");
  for (const f of SEJA_POZNEJE) assert.ok(order(html).includes(f), `${f} je v index.html`);
  const zunaj = out.replace(/<template data-evklid-slogi>.*?<\/template>/gs, "");
  for (const f of SEJA_POZNEJE) assert.ok(!zunaj.includes(`href="${f}"`), f);
  assert.equal(out.slice(out.indexOf("</head>")), html.slice(html.indexOf("</head>")), "telo strani enako");
});
