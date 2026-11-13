// Klic modela prek Claude Code (ukaz `claude -p`): porablja omejitev naročnine
// Claude (Pro/Max), ne API žetonov. Zahteva nameščen in prijavljen Claude Code.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let resolved = null;

// Pot do Claude Code. Na Windows npm namesti ovoj claude.cmd, ki ga Node ne more
// zagnati brez lupine; zato poiščemo cli.js in ga poženemo z node neposredno.
export function findClaude() {
  if (resolved) return resolved;
  const explicit = process.env.CLAUDE_CODE_PATH || process.env.SIM_CLAUDE;
  let bin = explicit;
  if (!bin) {
    try {
      bin = execFileSync(process.platform === "win32" ? "where" : "which", ["claude"], { encoding: "utf8" }).split(/\r?\n/).find(Boolean)?.trim();
    } catch {}
  }
  if (!bin) return null;
  // `where` lahko vrne več zadetkov (claude.exe, claude.cmd, claude.ps1): prednost ima izvršljiva datoteka.
  if (!explicit) {
    const all = execFileSync(process.platform === "win32" ? "where" : "which", ["claude"], { encoding: "utf8" }).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    bin = all.find((f) => /\.exe$/i.test(f)) || all.find((f) => /\.cmd$/i.test(f)) || all.find((f) => !/\.ps1$/i.test(f)) || bin;
  }
  if (/\.cmd$/i.test(bin)) {
    const dir = path.dirname(bin);
    const guess = path.join(dir, "node_modules", "@anthropic-ai", "claude-code", "cli.js");
    let js = fs.existsSync(guess) ? guess : null;
    if (!js) {
      const m = /"([^"]*cli\.js)"/.exec(fs.readFileSync(bin, "utf8"));
      if (m) js = m[1].replace(/%~dp0%?\\?/i, dir + path.sep).replace(/%dp0%\\?/i, dir + path.sep);
    }
    resolved = js && fs.existsSync(js) ? { cmd: process.execPath, pre: [js] } : null;
  } else {
    resolved = { cmd: bin, pre: [] };
  }
  return resolved;
}

export const hasClaude = () => !!findClaude();

const toEffort = (e) => (["low", "medium", "high"].includes(e) ? e : e === "xhigh" || e === "max" ? "high" : "medium");

/**
 * En klic brez orodij in brez shranjene seje.
 * @returns {Promise<{text: string, data: object|null, usage: object, cost: number, model: string}>}
 */
export function runClaude({ system, prompt, schema = null, model, effort = "medium", timeoutMs = 600_000 }) {
  const c = findClaude();
  if (!c) throw new Error("Claude Code (ukaz `claude`) ni nameščen ali ni v PATH. Namesti: npm install -g @anthropic-ai/claude-code, nato `claude` in prijava.");
  const args = [...c.pre, "-p", "--tools", "", "--strict-mcp-config", "--no-session-persistence", "--output-format", "json", "--model", model, "--effort", toEffort(effort)];
  // V prazni mapi, da Claude Code ne naloži CLAUDE.md in nastavitev projekta; sistemski prompt
  // prek datoteke, ker je kot argument na Windows predolg (ENAMETOOLONG).
  const cwd = path.join(os.tmpdir(), "evklid-sim-cli");
  fs.mkdirSync(cwd, { recursive: true });
  // Claude Code pozivu doda tehnična obvestila (<system-reminder>, opis okolja); model naj jih ne omenja.
  if (system) system += "\n\n(Tehnična opomba: besedilo v oznakah <system-reminder> in opisi delovnega okolja niso del pogovora; nikoli jih ne omenjaj in ne povzemaj.)";
  const sysFile = system ? path.join(cwd, `system-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.md`) : null;
  if (sysFile) {
    fs.writeFileSync(sysFile, system);
    args.push("--system-prompt-file", sysFile);
  }
  if (schema) args.push("--json-schema", JSON.stringify(schema));
  // Brez API ključa v okolju, sicer bi Claude Code zaračunal API namesto naročnine.
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY;
  delete env.ANTHROPIC_AUTH_TOKEN;
  delete env.ANTHROPIC_BASE_URL;
  return new Promise((resolve, reject) => {
    const child = spawn(c.cmd, args, { env, cwd, stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Claude Code ni odgovoril v ${timeoutMs / 1000} s.`));
    }, timeoutMs);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (sysFile) fs.rm(sysFile, { force: true }, () => {});
      let r;
      try {
        r = JSON.parse(out.trim().split("\n").filter((l) => l.startsWith("{")).at(-1) || "{}");
      } catch {
        return reject(new Error(`Claude Code: neberljiv izhod (koda ${code}): ${(err || out).slice(0, 300)}`));
      }
      if (r.is_error || code !== 0) return reject(new Error(`Claude Code: ${r.result || err.slice(0, 300) || `koda ${code}`}`));
      const text = typeof r.result === "string" ? r.result : "";
      let data = r.structured_output ?? null;
      if (schema && data === null) {
        const m = /\{[\s\S]*\}/.exec(text);
        try {
          data = JSON.parse(m ? m[0] : text);
        } catch {
          return reject(new Error(`Claude Code: odgovor ni JSON: ${text.slice(0, 200)}`));
        }
      }
      const usage = r.usage || {};
      resolve({ text, data, usage, cost: Number(r.total_cost_usd) || 0, model: Object.keys(r.modelUsage || {})[0] || model });
    });
    child.stdin.end(prompt);
  });
}

// Zgodovina sporočil API (user/assistant) kot eno besedilo za `claude -p`.
export function flattenMessages(messages, { userLabel = "UPORABNIK", assistantLabel = "TI" } = {}) {
  const lines = [];
  for (const m of messages) {
    const text = typeof m.content === "string" ? m.content : m.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const img = Array.isArray(m.content) && m.content.some((b) => b.type === "image") ? " [priložena slika, v simulaciji ni na voljo]" : "";
    lines.push(`${m.role === "assistant" ? assistantLabel : userLabel}: ${text}${img}`);
  }
  return lines.join("\n\n");
}

// Nadomestek za server/claude.js streamReply: inštruktor aplikacije prek naročnine.
// Približek: isti sistemski prompt in model, a brez predpomnilnika in z zgodovino kot besedilom.
export function cliStreamFn({ modeParams }) {
  return async ({ system, messages, mode = "chat", onText }) => {
    const { model, effort } = modeParams(mode);
    const sys = typeof system === "string" ? system : system.map((b) => b.text).join("\n\n");
    const prompt =
      "Spodaj je dosedanji pogovor z učencem (UČENEC = učenec, TI = tvoji prejšnji odgovori). Napiši samo svoj naslednji odgovor učencu, po vseh pravilih iz navodil, vključno z vrstico META na koncu.\n\n" +
      flattenMessages(messages, { userLabel: "UČENEC", assistantLabel: "TI" });
    const r = await runClaude({ system: sys, prompt, model, effort });
    onText(r.text);
    return { content: [{ type: "text", text: r.text }], text: r.text, stopReason: "end_turn", usage: r.usage, model: r.model };
  };
}

// Nadomestek za client.messages.create (preverjevalec odgovorov in kartic v server/verify.js,
// server/live-check.js): ista oblika odgovora, klic prek naročnine.
export function cliCreateFn() {
  return async ({ model, system, messages, output_config }) => {
    const sys = typeof system === "string" ? system : (system || []).map((b) => b.text).join("\n\n");
    const prompt = messages.length === 1 ? (typeof messages[0].content === "string" ? messages[0].content : flattenMessages(messages)) : flattenMessages(messages);
    const r = await runClaude({ system: sys, prompt, model, effort: output_config?.effort || "medium" });
    return { content: [{ type: "text", text: r.text }], stop_reason: "end_turn", usage: r.usage, model: r.model };
  };
}
