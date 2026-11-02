// Vmesnik do inštruktorja. Simulator pozna samo to obliko:
//   const t = await createTutor(opts); await t.start(persona) → seja
//   await seja.send(text, { deep }) → { text, raw?, error?, costUsd?, model? }
//   await t.close()
// Na voljo:
//   local: ista koda in prompt kot aplikacija, v pomnilniku (prazna baza, brez omejitev);
//          z API ključem odgovarja pravi model, brez njega preizkusni način.
//   http:  tekoča aplikacija prek spleta (npr. ngrok), z geslom testne različice
//          ali s prijavo v testni račun (EVKLID_ACCOUNTS=1).
import "../server/env.js";

const TIMEOUT_MS = 180_000;

export async function createTutor(opts = {}) {
  if (opts.kind === "http") return new HttpTutor(opts);
  return LocalTutor.create(opts);
}

export function parseSse(body) {
  return String(body)
    .split("\n\n")
    .filter((c) => /^event: /m.test(c))
    .map((c) => {
      const event = /^event: (.*)$/m.exec(c)[1];
      let data = null;
      try {
        data = JSON.parse(/^data: (.*)$/m.exec(c)?.[1] ?? "null");
      } catch {}
      return { event, data };
    });
}

function readReply(body) {
  const ev = parseSse(body);
  const done = ev.find((e) => e.event === "done");
  const err = ev.find((e) => e.event === "error");
  const cards = ev.filter((e) => e.event === "cards").flatMap((e) => e.data?.cards || []);
  if (done) return { text: done.data.text, costUsd: done.data.cost_usd ?? null, state: done.data.state, cards };
  const streamed = ev.filter((e) => e.event === "delta").map((e) => e.data?.text || "").join("");
  return { text: streamed, error: err?.data?.error || "Odgovor brez dogodka »done«." };
}

// Aplikacijski strežnik se pri vsakem zagonu ustvari na novo v tem procesu.
class LocalTutor {
  static async create(opts) {
    // Simulacija ne sme zadeti dnevnih omejitev, gesla ali prijave staršev iz .env.
    Object.assign(process.env, { EVKLID_ACCOUNTS: "0", EVKLID_DAILY_QUESTIONS: "0", EVKLID_MONTHLY_BUDGET_USD: "0" });
    delete process.env.EVKLID_PASSWORD;
    if (opts.mock) process.env.EVKLID_MOCK = "1";
    if (opts.mockDelay !== undefined) process.env.EVKLID_MOCK_DELAY_MS = String(opts.mockDelay);
    const { openDb } = await import("../server/db.js");
    const { createApp } = await import("../server/app.js");
    const claude = await import("../server/claude.js");
    const t = new LocalTutor();
    t.raw = new Map(); // pogovor → zadnji surovi odgovor modela (z META vrstico)
    t.mock = claude.isMockMode() && !opts.streamFn && opts.engine !== "cli";
    t.model = claude.MODEL;
    const { cliStreamFn, cliCreateFn } = await import("./cli.js");
    // Prek naročnine tudi preverjanje odgovorov in kartic (sicer bi klicalo API s ključem).
    const extra = {};
    if (opts.engine === "cli" && !opts.streamFn) {
      const { verifyAnswer } = await import("../server/verify.js");
      const create = cliCreateFn();
      extra.reviewCreateFn = create;
      extra.verifyFn = (a) => verifyAnswer({ ...a, createFn: create });
    }
    const inner = opts.streamFn || (opts.engine === "cli" ? cliStreamFn({ modeParams: claude.modeParams }) : claude.streamReply);
    const streamFn = async (args) => {
      const result = await inner(args);
      t.lastRaw = { text: result.text, model: result.model, usage: result.usage, stopReason: result.stopReason };
      return result;
    };
    t.store = openDb(":memory:");
    t.server = createApp(t.store, { streamFn, ...extra }).listen(0);
    await new Promise((r) => t.server.once("listening", r));
    t.base = `http://127.0.0.1:${t.server.address().port}`;
    t.label = t.mock ? "lokalno (preizkusni način, brez modela)" : `lokalno (${claude.MODEL}${opts.engine === "cli" ? ", prek Claude Code" : ""})`;
    return t;
  }

  async call(path, body) {
    const res = await fetch(this.base + path, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: res.status, text: await res.text() };
  }

  async start(persona) {
    const s = JSON.parse((await this.call("/api/students", { name: persona.ime, settings: persona.settings })).text);
    const c = JSON.parse((await this.call(`/api/students/${s.id}/conversations`, {})).text);
    return {
      settings: s.settings,
      send: async (text, { deep = false } = {}) => {
        this.lastRaw = null;
        const r = await this.call(`/api/conversations/${c.id}/messages`, deep ? { text: text || "Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", deep: true } : { text });
        if (r.status !== 200) return { text: "", error: `HTTP ${r.status}: ${r.text.slice(0, 200)}` };
        const reply = readReply(r.text);
        const raw = this.lastRaw;
        return { ...reply, raw: raw?.text ?? null, model: raw?.model ?? null, stopReason: raw?.stopReason ?? null };
      },
    };
  }

  async close() {
    await new Promise((r) => this.server.close(r));
  }
}

// Tekoča aplikacija prek HTTP.
class HttpTutor {
  constructor({ url, password, email, accountPassword }) {
    if (!url) throw new Error("Za --tutor http dodaj --url (npr. https://….ngrok-free.dev).");
    this.base = url.replace(/\/+$/, "");
    this.password = password;
    this.email = email;
    this.accountPassword = accountPassword;
    this.cookies = new Map();
    this.label = `splet (${this.base})`;
    this.ready = null;
    this.studentId = null;
  }

  async req(path, { method = "GET", body } = {}) {
    const res = await fetch(this.base + path, {
      method,
      redirect: "manual",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
        "User-Agent": "Evklid-simulator/1.0",
        Cookie: [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; "),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    for (const c of res.headers.getSetCookie?.() || []) {
      const m = /^([^=]+)=([^;]*)/.exec(c);
      if (m) this.cookies.set(m[1], m[2]);
    }
    return { status: res.status, text: await res.text() };
  }

  async json(path, opts) {
    const r = await this.req(path, opts);
    let body = null;
    try {
      body = JSON.parse(r.text);
    } catch {}
    if (r.status >= 400) throw new Error(`${opts?.method || "GET"} ${path}: HTTP ${r.status} ${body?.error || r.text.slice(0, 120)}`);
    return body;
  }

  async login() {
    if (this.password) await this.req(`/?geslo=${encodeURIComponent(this.password)}`);
    const status = await this.json("/api/account/status").catch(() => ({ enabled: false }));
    if (status?.enabled) {
      if (!this.email || !this.accountPassword) throw new Error("Aplikacija ima prijavo staršev: dodaj --email in --account-password testnega računa (potrjen e-naslov).");
      await this.json("/api/auth/login", { method: "POST", body: { email: this.email, password: this.accountPassword } });
      this.accounts = true;
    }
  }

  // Pri prijavi staršev ima paket omejeno število profilov, zato vsi digitalni učenci
  // uporabljajo isti profil: pred vsakim pogovorom zamenjamo ime in nastavitve.
  async profileFor(persona) {
    if (!this.accounts) {
      const s = await this.json("/api/students", { method: "POST", body: { name: persona.ime, settings: persona.settings } });
      return s.id;
    }
    if (!this.studentId) {
      const list = await this.json("/api/students");
      this.studentId = list[0]?.id;
      if (!this.studentId) {
        const s = await this.json("/api/students", {
          method: "POST",
          body: { name: persona.ime, settings: persona.settings, self: true, consent: true, birth_year: new Date().getFullYear() - 18 },
        });
        this.studentId = s.id;
      }
    }
    await this.json(`/api/students/${this.studentId}`, { method: "PUT", body: { name: persona.ime, settings: persona.settings } });
    return this.studentId;
  }

  async start(persona) {
    this.ready ??= this.login();
    await this.ready;
    const id = await this.profileFor(persona);
    const c = await this.json(`/api/students/${id}/conversations`, { method: "POST", body: {} });
    return {
      settings: persona.settings,
      send: async (text, { deep = false } = {}) => {
        const r = await this.req(`/api/conversations/${c.id}/messages`, {
          method: "POST",
          body: deep ? { text: text || "Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", deep: true } : { text },
        });
        if (r.status !== 200) {
          let msg = r.text.slice(0, 200);
          try {
            msg = JSON.parse(r.text).error || msg;
          } catch {}
          return { text: "", error: `HTTP ${r.status}: ${msg}` };
        }
        return { ...readReply(r.text), raw: null };
      },
    };
  }

  async close() {}
}
