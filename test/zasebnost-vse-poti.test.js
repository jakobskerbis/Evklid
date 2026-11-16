// Zasebnost med računi: VSAKA pot (vse metode) kot vsak igralec, z lastnimi in tujimi id-ji.
// Igralci: A = starš z dvema otrokoma, B = drug starš z enim otrokom (tudi prek glav mobilne aplikacije),
// T = učitelj z razredom (v razredu so vsi trije otroci), anonimen obiskovalec.
// Nihče ne sme v odgovoru dobiti imena, e-naslova, datuma rojstva ali id-ja profila/računa drugega računa.
// Izjema po zasnovi: učitelj vidi `ref` (id učenca) članov SVOJEGA razreda (oznake, server/schools.js).
// Na koncu preverimo še, da tuj igralec ni ničesar spremenil ali izbrisal pri drugem računu.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const ACC = {
  A: {
    email: "ana.brezovnik@zasebnost.test",
    birth: "1984-03-17",
    kids: [
      ["Zalika Brezovnik", 4711, 2014],
      ["Tevz Kocjancic", 4733, 2016],
    ],
  },
  B: {
    email: "boris.hrastnik@zasebnost.test",
    birth: "1979-11-23",
    kids: [["Borislav Hrastnik", 5821, 2013]],
  },
  T: { email: "tea.ucitelj@zasebnost.test", birth: "1990-06-02", kids: [] },
};
const ID_KEY = /^(id|_id|ref|sid|uid|student_?id|studentid|child_?id|childid|parent_?id|parentid|owner_?parent_?id|member_?id|profile_?id)$/i;
const DESTRUCTIVE =
  /^(POST \/api\/auth\/logout|DELETE \/api\/account|POST \/api\/account\/(logout-others|lock|profile-password|birth-date)|PUT \/api\/account|DELETE \/api\/students\/:id|DELETE \/api\/classes\/:code|DELETE \/api\/students\/:id\/classes\/:classId|DELETE \/api\/schools\/:id\/me)$/;

const secretsOf = (k) => {
  const a = ACC[k];
  const [y, m, d] = a.birth.split("-");
  const out = [
    [a.email, "e-naslov"],
    [a.email.split("@")[0], "e-naslov (lokalni del)"],
    [a.birth, "datum rojstva"],
    [`${+d}\\.\\s?${+m}\\.\\s?${y}`, "datum rojstva (sl)"],
    [`${d}\\.${m}\\.${y}`, "datum rojstva (sl)"],
  ];
  for (const [name] of a.kids) out.push(...name.split(" ").map((w) => [w, "ime otroka"]));
  return out.map(([s, what]) => [new RegExp(s.includes("\\") ? s : s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), what]);
};

function idHits(text, ids) {
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    return [];
  }
  const hits = [];
  const walk = (v, path) => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) {
        if (ID_KEY.test(k) && (typeof x === "number" || /^\d+$/.test(String(x))) && ids.has(Number(x))) hits.push({ key: k, value: Number(x), path: `${path}.${k}` });
        walk(x, `${path}.${k}`);
      }
    }
  };
  walk(j, "$");
  return hits;
}

test("vse poti, vse metode, štirje igralci: nič osebnih podatkov ali id-jev drugih računov", { timeout: 600_000 }, async () => {
  const store = openDb(":memory:");
  const db = store.db;
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    if (u.host === "api.resend.com" && init.body) {
      try {
        mails.push(JSON.parse(init.body));
      } catch {}
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: "x", data: [] }),
      text: async () => "",
    };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: "whsec_test",
    fetchFn,
    log: { error() {}, warn() {}, info() {} },
    streamFn: async ({ onText }) => {
      onText?.("ok");
      return { text: "ok", stopReason: "end_turn" };
    },
    reviewCreateFn: async () => ({ content: [{ type: "text", text: "{}" }] }),
    verifyFn: async () => ({ ok: true }),
    feedbackCreateFn: async () => ({
      content: [{ type: "text", text: "{}" }],
    }),
    scanReadFn: async () => ({ text: "" }),
    scanSolveFn: async () => ({ text: "" }),
    schedulePhotoFn: async () => ({ items: [] }),
    newsOffline: true,
  });
  const origWarn = console.warn;
  console.warn = () => {};
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const mkClient = (ip, mobile = null) => {
    const jar = {};
    const c = async (path, { method = "GET", body } = {}) => {
      const headers = {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      };
      if (mobile) {
        headers["x-app-client"] = "android";
        headers.authorization = `Bearer ${mobile.jar.sm_session}`;
        headers["x-app-device"] = mobile.jar.sm_device;
      } else
        headers.cookie = Object.entries(jar)
          .map(([k, v]) => `${k}=${v}`)
          .join("; ");
      let res;
      try {
        res = await fetch(base + path, {
          method,
          redirect: "manual",
          headers,
          body: body === undefined || method === "GET" || method === "HEAD" ? undefined : JSON.stringify(body),
        });
      } catch (e) {
        return { status: 0, text: String(e) };
      }
      if (!mobile) {
        for (const ck of res.headers.getSetCookie()) {
          const [kv] = ck.split(";");
          const i = kv.indexOf("=");
          jar[kv.slice(0, i)] = kv.slice(i + 1);
        }
      }
      const loc = res.headers.get("location") || "";
      return {
        status: res.status,
        text: (await res.text()) + (loc ? `\nLOCATION ${loc}` : ""),
      };
    };
    c.jar = jar;
    return c;
  };
  const client = {
    A: mkClient("203.0.113.11"),
    B: mkClient("203.0.113.12"),
    T: mkClient("203.0.113.13"),
    anon: mkClient("203.0.113.14"),
  };

  try {
    // --- priprava ---
    for (const k of ["A", "B", "T"]) {
      const c = client[k];
      const r = await c("/api/auth/register", {
        method: "POST",
        body: {
          email: ACC[k].email,
          password: "geslo1234",
          accept_privacy: true,
          birth_date: ACC[k].birth,
        },
      });
      assert.equal(r.status, 201, r.text);
      const link = /\/api\/auth\/verify\?token=[\w-]+/.exec(JSON.stringify(mails.at(-1)))[0];
      assert.equal((await c(link)).status, 302);
      ACC[k].pid = db.prepare("SELECT id FROM parents WHERE email = ?").get(ACC[k].email).id;
      db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 2 WHERE id = ?").run(ACC[k].pid);
      const done = [];
      for (const [name, id, year] of ACC[k].kids) {
        db.prepare("INSERT INTO students (id, name, settings) VALUES (?, 'zacasno', '{}')").run(id - 1);
        const other_passwords = Object.fromEntries(done.map((x) => [x, "profil1234"]));
        const cr = await c("/api/students", {
          method: "POST",
          body: {
            name,
            birth_year: year,
            consent: true,
            profile_password: "profil1234",
            other_passwords,
          },
        });
        db.prepare("DELETE FROM students WHERE id = ?").run(id - 1);
        assert.equal(cr.status, 201, cr.text);
        assert.equal(JSON.parse(cr.text).id, id);
        done.push(id);
      }
    }
    client.Bm = mkClient("203.0.113.15", client.B); // B prek mobilne aplikacije (Bearer + x-app-device)
    const [A1, A2] = ACC.A.kids.map((x) => x[1]);
    const [B1] = ACC.B.kids.map((x) => x[1]);
    // skupina prijateljev (A1 ustvari, B1 se pridruži), A2 svojo skupino brez drugih
    const fg = JSON.parse(
      (
        await client.A(`/api/students/${A1}/friend-groups`, {
          method: "POST",
          body: { name: "Skupina" },
        })
      ).text,
    );
    assert.equal(
      (
        await client.B(`/api/students/${B1}/classes`, {
          method: "POST",
          body: { code: fg.code },
        })
      ).status,
      201,
    );
    const fgA2 = JSON.parse(
      (
        await client.A(`/api/students/${A2}/friend-groups`, {
          method: "POST",
          body: { name: "Samo jaz" },
        })
      ).text,
    );
    const fgB = JSON.parse(
      (
        await client.B(`/api/students/${B1}/friend-groups`, {
          method: "POST",
          body: { name: "Bor sam" },
        })
      ).text,
    );
    // razred učitelja z vsemi tremi otroki
    const cl = JSON.parse(
      (
        await client.T("/api/teacher/classes", {
          method: "POST",
          body: { name: "8.b", path: "MAT-OS-8" },
        })
      ).text,
    );
    assert.ok(cl.code, JSON.stringify(cl));
    for (const [c, sid] of [
      [client.A, A1],
      [client.A, A2],
      [client.B, B1],
    ])
      assert.equal(
        (
          await c(`/api/students/${sid}/classes`, {
            method: "POST",
            body: { code: cl.code },
          })
        ).status,
        201,
      );
    const classId = cl.id;
    const xp = db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, ?, 'test')");
    xp.run(A1, 80);
    xp.run(A2, 30);
    xp.run(B1, 5);
    // malo podatkov v vsakem profilu (pogovor, dogodki), da so poti z id-ji pogovorov napolnjene
    const conv = {};
    for (const [k, sid] of [
      ["A", A1],
      ["A", A2],
      ["B", B1],
    ]) {
      const r = await client[k](`/api/students/${sid}/conversations`, {
        method: "POST",
        body: {},
      });
      conv[sid] = r.status < 300 ? JSON.parse(r.text).id : null;
    }

    // --- poti ---
    const routes = [];
    const walk = (stack) => {
      for (const l of stack) {
        if (l.route)
          for (const p of [l.route.path].flat())
            for (const m of Object.keys(l.route.methods))
              if (typeof p === "string" && m !== "_all") routes.push({ m: m.toUpperCase(), p });
              else if (l.handle?.stack) walk(l.handle.stack);
      }
    };
    walk(app.router.stack);
    assert.ok(routes.length > 200, `samo ${routes.length} poti`);

    const ownKids = { A: [A1, A2], B: [B1], Bm: [B1], T: [], anon: [] };
    const acct = { A: "A", B: "B", Bm: "B", T: "T", anon: null };
    const foreignKids = (who) =>
      Object.entries(ACC)
        .filter(([k]) => k !== acct[who])
        .flatMap(([, a]) => a.kids.map((x) => x[1]));
    const foreignParents = (who) =>
      Object.entries(ACC)
        .filter(([k]) => k !== acct[who])
        .map(([, a]) => a.pid);
    const ownConv = (who) => ownKids[who].map((s) => conv[s]).filter(Boolean);
    const foreignConv = (who) =>
      foreignKids(who)
        .map((s) => conv[s])
        .filter(Boolean);
    const codes = [cl.code, fg.code, fgA2.code, fgB.code];

    const urlsFor = (p, who, mode) => {
      const sids = mode === "own" ? ownKids[who] : foreignKids(who);
      const pid = mode === "own" ? [ACC[acct[who]]?.pid ?? 1] : foreignParents(who);
      const conversations = mode === "own" ? ownConv(who) : foreignConv(who);
      const pat = p.replace(/\{([^}]*)\}/g, "$1");
      const names = [...pat.matchAll(/:([A-Za-z_]+)/g)].map((x) => x[1]);
      if (!names.length) return mode === "own" ? [pat] : [];
      const isConv = /^\/api\/conversations\//.test(pat);
      const choices = {
        id: isConv ? (conversations.length ? conversations : [1]) : /^\/api\/schools\//.test(pat) ? [1] : sids.length ? sids : [1],
        code: codes,
        ref: mode === "own" && who === "T" ? [A1, B1] : foreignKids(who),
        classId: [classId],
        parentId: pid,
        studentId: sids.length ? sids : [1],
      };
      let out = [pat];
      for (const n of names) {
        const vals = choices[n] || ["1"];
        out = out.flatMap((u) => vals.map((v) => u.replace(new RegExp(`:${n}\\b`), encodeURIComponent(String(v)))));
      }
      return [...new Set(out.map((u) => u.replace(/\*[A-Za-z_]*/g, "x")))].slice(0, 12);
    };
    const bodyFor = (who, mode, url) => {
      const v = mode === "own" ? (ownKids[who][0] ?? 1) : foreignKids(who)[0];
      const b = {
        name: "Sonda",
        nickname: "Sonda",
        label: "sonda",
        code: cl.code,
        text: "x",
        message: "x",
        content: "x",
        answer: "1",
        topicId: "x",
        id: v,
        studentId: v,
        student_id: v,
        childId: v,
        ref: v,
        ids: mode === "own" ? ownKids[who] : foreignKids(who),
        students: mode === "own" ? ownKids[who] : foreignKids(who),
        classId,
        parentId: mode === "own" ? ACC[acct[who]]?.pid : foreignParents(who)[0],
      };
      // Prijava/registracija samo z lastnim naslovom (odmev lastnega naslova ni uhajanje).
      if (/^\/api\/auth\//.test(url) && acct[who])
        Object.assign(b, {
          email: ACC[acct[who]].email,
          password: "geslo1234",
        });
      return b;
    };
    const withQuery = (u, who, mode) => {
      if (mode === "own") return u;
      const v = foreignKids(who)[0];
      return `${u}${u.includes("?") ? "&" : "?"}studentId=${v}&student_id=${v}&sid=${v}&student=${v}&child=${v}&parentId=${foreignParents(who)[0]}`;
    };

    const leaks = [];
    const allowedSeen = [];
    let calls = 0;
    const stats = {};
    const check = (who, label, r) => {
      const others = Object.keys(ACC).filter((k) => k !== acct[who]);
      for (const k of others)
        for (const [re, what] of secretsOf(k)) if (re.test(r.text)) leaks.push(`${who}: ${label} -> ${r.status} ${what} računa ${k}: ${r.text.slice(0, 200)}`);
      const fk = new Set(foreignKids(who));
      for (const h of idHits(r.text, fk)) {
        if (who === "T" && h.key === "ref") allowedSeen.push(`${label} ${h.path}`);
        else leaks.push(`${who}: ${label} -> ${r.status} id profila ${h.value} (${h.path}): ${r.text.slice(0, 200)}`);
      }
      const fp = new Set(foreignParents(who));
      for (const h of idHits(r.text, fp)) if (/parent/i.test(h.key)) leaks.push(`${who}: ${label} -> ${r.status} id računa ${h.value} (${h.path})`);
    };
    const changes = [];
    // Vrstice, ki pripadajo DRUGIM računom (z vidika igralca who). Učitelj sme odstraniti člana svojega razreda.
    const snap = (who) => {
      const fk = foreignKids(who);
      const fp = foreignParents(who);
      const inK = `(${fk.join(",") || "-1"})`;
      const inP = `(${fp.join(",") || "-1"})`;
      return JSON.stringify([
        db.prepare(`SELECT id, name, settings, parent_id, birth_year FROM students WHERE id IN ${inK} ORDER BY id`).all(),
        db.prepare(`SELECT id, email, birth_date, password_hash, sub_status FROM parents WHERE id IN ${inP} ORDER BY id`).all(),
        db.prepare(`SELECT student_id, nickname FROM league_profiles WHERE student_id IN ${inK} ORDER BY student_id`).all(),
        db.prepare(`SELECT class_id, student_id FROM class_members WHERE student_id IN ${inK} ORDER BY class_id, student_id`).all(),
        db.prepare(`SELECT id, student_id, title FROM conversations WHERE student_id IN ${inK} ORDER BY id`).all(),
        db.prepare(`SELECT COUNT(*) AS n FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE student_id IN ${inK})`).get(),
        db.prepare(`SELECT COUNT(*) AS n FROM consents WHERE student_id IN ${inK}`).get(),
        db.prepare(`SELECT COALESCE(SUM(amount),0) AS xp FROM xp_events WHERE student_id IN ${inK}`).get(),
        db.prepare(`SELECT id, code, name, owner_parent_id, owner_student_id FROM classes WHERE owner_parent_id IN ${inP} OR owner_student_id IN ${inK} ORDER BY id`).all(),
      ]);
    };
    const run = async (who, mode, filter) => {
      for (const { m, p } of routes) {
        const key = `${m} ${p}`;
        if (!filter(key)) continue;
        for (const u0 of urlsFor(p, who, mode)) {
          const u = withQuery(u0, who, mode);
          const before = mode === "foreign" && m !== "GET" ? snap(who) : null;
          const r = await client[who](u, {
            method: m,
            body: m === "GET" ? undefined : bodyFor(who, mode, u),
          });
          calls++;
          stats[`${who} ${mode} ${r.status}`] = (stats[`${who} ${mode} ${r.status}`] || 0) + 1;
          if (process.env.ZASEBNOST_DEBUG && r.status >= 500) console.log("5xx", who, mode, m, u, r.text.slice(0, 120));
          check(who, `${mode} ${m} ${u}`, r);
          if (before && snap(who) !== before) changes.push(`${who}: ${mode} ${m} ${u} -> ${r.status} je spremenil podatke drugega računa: ${r.text.slice(0, 160)}`);
        }
      }
    };

    // 1) tuji id-ji: vsak igralec poskusi tuje profile/pogovore/račune; nič se ne sme spremeniti
    const TEACHER_OWN = /^DELETE \/api\/classes\/:code\/members\/:ref$/;
    for (const who of ["anon", "B", "Bm", "A", "T"])
      await run(who, "foreign", (k) => (!DESTRUCTIVE.test(k) || /:id|:ref|:parentId/.test(k)) && !(who === "T" && TEACHER_OWN.test(k)));
    // 2) lastni id-ji in poti brez id-jev (tu je bila napaka: GET /xp z lastnim id-jem je vračal tuja imena)
    // Lastni klici smejo preimenovati lasten profil (PUT /api/students/:id z name: "Sonda"); imena vrnemo,
    // da naslednji igralec še išče prava imena.
    const restore = () => {
      for (const a of Object.values(ACC)) for (const [name, id] of a.kids) db.prepare("UPDATE students SET name = ? WHERE id = ?").run(name, id);
    };
    for (const who of ["A", "B", "Bm", "T", "anon"]) {
      await run(who, "own", (k) => !DESTRUCTIVE.test(k));
      restore();
    }
    for (const who of ["A", "B", "T", "anon"]) await run(who, "own", (k) => DESTRUCTIVE.test(k));

    console.log(
      `[zasebnost-vse-poti] ${routes.length} poti, ${calls} klicev; učitelj vidi ref članov svojega razreda: ${[...new Set(allowedSeen.map((s) => s.split(" ")[2].split("?")[0].replace(/\/[A-Z0-9]{3}-[A-Z0-9]{3}/, "/:code")))].join(", ")}`,
    );
    if (process.env.ZASEBNOST_DEBUG) console.log(JSON.stringify(stats, null, 0));
    assert.deepEqual({ leaks: [...new Set(leaks)], changes }, { leaks: [], changes: [] });
  } finally {
    console.warn = origWarn;
    server.close();
  }
});
