// Klic Claude API (pretakanje), izbira modela, strošek, preizkusni način.
import "./env.js";
import Anthropic from "@anthropic-ai/sdk";
import { systemBlocks } from "./prompt.js";
import { isHiddenNote } from "./skrite-opombe.js";
import { mockToolCall, mockToolText } from "./chat-settings.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);

// Privzeto poceni hiter model; zmogljivejši za »Razloži podrobneje« in tekmovanja.
export const MODEL = env("EVKLID_MODEL", "claude-haiku-5-5");
export const MODEL_DEEP = env("EVKLID_MODEL_DEEP", "claude-opus-5-5");
// Zmogljivejši model za omejene pakete (aktivacijska koda: največ Sonnet, j 2026-10-30).
export const MODEL_MID = env("EVKLID_MODEL_MID", "claude-sonnet-5-5");
const EFFORT = env("EVKLID_EFFORT", "low");
// »Razloži podrobneje« je druga razlaga snovi, ne težko sklepanje: Opus pri effort low
// razloži enako dobro z manj razmišljanja (manj izhodnih žetonov). Prej: medium.
const EFFORT_DEEP = env("EVKLID_EFFORT_DEEP", "low");
// Stalni del prompta za Opus in Sonnet ostane v predpomnilniku 1 uro (klici so redki, 5 minut bi pogosto
// poteklo). Zapis za 1 h stane 2× vhod (5 min 1,25×); pregled 4. 11. (j: »nadaljuj kontrolo«): prilagodljiv
// čas po razmikih med klici bi pri nekaj klicih Opusa na popoldne stal več, kot prihrani pri osamljenih klicih.
const DEEP_CACHE_TTL = env("EVKLID_DEEP_CACHE_TTL", "1h");
// Hitri model z več razmisleka: Tekmovanja in »Razloži podrobneje«, ko je dnevna
// ali mesečna omejitev za zmogljivejši model porabljena.
const EFFORT_THINK = env("EVKLID_EFFORT_THINK", "high");

// Največ žetonov odgovora (z razmišljanjem vred) po načinu. Preprečuje predolge
// (in drage) odgovore; običajen odgovor inštruktorja ima nekaj sto žetonov.
export const MAX_TOKENS = {
  chat: Number(env("EVKLID_MAX_TOKENS", 3000)),
  lite: Number(env("EVKLID_MAX_TOKENS_LITE", 1200)),
  // Razmišljanje Haikuja pri visokem naporu porabi več tisoč žetonov; 5000 je odgovor lahko odrezalo (SŠ, 2026-11-04).
  think: Number(env("EVKLID_MAX_TOKENS_THINK", 8000)),
  deep: Number(env("EVKLID_MAX_TOKENS_DEEP", 6000)),
};

// Način klica: "chat" (Haiku, malo razmisleka), "lite" (Haiku, kratko),
// "think" (Haiku, več razmisleka), "deep" (Opus), "mid" (Sonnet namesto Opusa pri aktivacijski kodi).
export function modeParams(mode = "chat") {
  if (mode === "deep") return { model: MODEL_DEEP, effort: EFFORT_DEEP, max_tokens: MAX_TOKENS.deep };
  if (mode === "mid") return { model: MODEL_MID, effort: EFFORT_DEEP, max_tokens: MAX_TOKENS.deep };
  if (mode === "think") return { model: MODEL, effort: EFFORT_THINK, max_tokens: MAX_TOKENS.think };
  if (mode === "lite") return { model: MODEL, effort: EFFORT, max_tokens: MAX_TOKENS.lite };
  return { model: MODEL, effort: EFFORT, max_tokens: MAX_TOKENS.chat };
}

// Cene v USD na milijon žetonov (vhod, izhod, branje predpomnilnika, zapis v predpomnilnik za 5 min;
// zapis za 1 h stane 2× vhod).
// Preveri na https://claude.com/pricing in po potrebi popravi.
export const PRICES = {
  "claude-haiku-5-5": { in: 0.1, out: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
  "claude-sonnet-5-5": { in: 2, out: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  "claude-opus-5-5": { in: 4, out: 20, cacheRead: 0.2, cacheWrite: 5 },
  "claude-fable-5-1": { in: 10, out: 50, cacheRead: 0.25, cacheWrite: 12.5 },
};

export function costUsd(model, u) {
  // API lahko vrne ime z datumom (»claude-haiku-5-5-20261015«): cena po začetku imena, sicer bi Haiku štel po ceni Opusa.
  const id = String(model || "");
  const key = Object.keys(PRICES).filter((k) => id === k || id.startsWith(`${k}-`)).sort((a, b) => b.length - a.length)[0];
  const p = PRICES[key] || PRICES["claude-opus-5-5"];
  // Zapis za 1 h (usage.cache_creation.ephemeral_1h_input_tokens) stane 2× vhod, ostali zapisi 1,25×.
  const write = u.cache_creation_input_tokens || 0;
  const write1h = Math.min(write, u.cache_creation?.ephemeral_1h_input_tokens || 0);
  return (
    ((u.input_tokens || 0) * p.in +
      (u.output_tokens || 0) * p.out +
      (u.cache_read_input_tokens || 0) * p.cacheRead +
      (write - write1h) * p.cacheWrite +
      write1h * p.in * 2) /
    1e6
  );
}

export const REFUSAL_TEXT =
  "Pri tem ti žal ne morem pomagati. Lahko pa skupaj rešiva kakšno nalogo iz matematike, fizike ali kemije – kaj imaš pred sabo?";
export const ERROR_TEXT = "Ups, nekaj je šlo narobe pri povezavi. Poskusi znova čez trenutek.";

// Kratka koda vzroka napake API-ja za sporočilo učencu (in lastniku strežnika, ki iz nje
// vidi, kaj popraviti), npr. »ključ«, ko ANTHROPIC_API_KEY ni veljaven.
// Napake SDK imajo name »Error«, zato razred preverimo z instanceof (ime pa za preproste objekte).
// Napaka sredi pretoka (SSE) pride brez statusa, le s tipom v telesu (npr. overloaded_error).
const ERROR_TYPE_STATUS = {
  invalid_request_error: 400, authentication_error: 401, permission_error: 403, not_found_error: 404,
  request_too_large: 413, rate_limit_error: 429, api_error: 500, overloaded_error: 529,
};
export function apiErrorCode(err) {
  const is = (C, name) => (typeof C === "function" && err instanceof C) || err?.name === name;
  const status = Number(err?.status) || ERROR_TYPE_STATUS[err?.error?.error?.type] || 0;
  const msg = String(err?.error?.error?.message || err?.message || "");
  if (!status) {
    if (is(Anthropic.APIUserAbortError, "APIUserAbortError") || err?.name === "AbortError") return null;
    // Druge napake brez statusa so napake v naši kodi: vzrok je v konzoli strežnika, ne pri povezavi.
    return is(Anthropic.APIConnectionError, "APIConnectionError") ? "brez povezave do Anthropic" : null;
  }
  if (status === 401) return "401 neveljaven API ključ";
  if (status === 403) return "403 ključ nima dovoljenja";
  if (status === 400 && /credit|balance|billing/i.test(msg)) return "400 ni dobroimetja na API računu";
  if (status === 400) return "400 napačna zahteva";
  if (status === 404) return "404 model ne obstaja";
  if (status === 413) return "413 sporočilo je predolgo";
  if (status === 429) return "429 omejitev porabe";
  if (status === 529 || /overloaded/i.test(msg)) return "529 Anthropic je preobremenjen";
  return `${status} napaka pri Anthropic`;
}
export const errorText = (err, base = ERROR_TEXT) => {
  const code = apiErrorCode(err);
  return code ? `${base} (Koda: ${code})` : base;
};

export function isMockMode() {
  if (process.env.EVKLID_MOCK === "1") return true;
  return !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN;
}

let client = null;
// Samo za teste: lažen odjemalec API (null vrne pravega).
export function setClient(c) {
  client = c;
}
export function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

// Kratka opravila (prepis, anketa): brez razmišljanja, kjer model to dovoli
// (Haiku 5.5 pri effort low); Opus 5.5 razmišljanja ne dovoli izklopiti.
export function quickParams(model) {
  return /haiku/.test(model) ? { thinking: { type: "disabled" }, output_config: { effort: "low" } } : { output_config: { effort: "low" } };
}

// Strežniški nadomestni model ob zavrnitvi podpirajo modeli Opus/Sonnet/Fable, Haiku ne.
const supportsFallback = (model) => !/haiku/.test(model);

/**
 * Pretoči odgovor modela.
 * @returns {Promise<{content, text, stopReason, usage, model}>}
 */
export async function streamReply({ system, messages, deep = false, mode = deep ? "deep" : "chat", onText, signal, tools = null, onToolUse = null, quick = null }) {
  const { model, effort, max_tokens } = modeParams(mode);
  if (isMockMode()) return mockReply({ messages, onText, signal, model, onToolUse: tools?.length ? onToolUse : null });

  const params = {
    model,
    max_tokens,
    // Stalni del prompta (enak za vse učence) ima svojo oznako predpomnilnika,
    // zato se deli med vsemi pogovori; nastavitve učenca so v drugem bloku.
    system: typeof system === "string" ? systemBlocks(system, { ttl: (mode === "deep" || mode === "mid") && DEEP_CACHE_TTL === "1h" ? "1h" : null }) : system,
    messages,
    thinking: { type: "adaptive" },
    output_config: { effort },
    // Samodejni predpomnilnik še za zgodovino pogovora: ob naslednjem
    // sporočilu se prebere iz predpomnilnika za ~10 % cene.
    cache_control: { type: "ephemeral" },
  };
  // Kratko opravilo (npr. povzetek pogovora, server/povzetek.js): brez razmišljanja, z manj izhoda in
  // brez predpomnilnika (prompt se ne ponovi, zapis bi le stal).
  if (quick) {
    Object.assign(params, quickParams(model), { max_tokens: Math.min(max_tokens, quick.maxTokens || max_tokens) });
    params.system = system;
    delete params.cache_control;
  }
  // Orodja (npr. nastavitve iz klepeta) so pred sistemskim promptom in enaka za vse učence,
  // zato ostanejo v istem predpomnjenem začetku.
  if (tools?.length) params.tools = tools;
  if (supportsFallback(model)) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }

  // Zanka orodij: model pokliče orodje → rezultat → model nadaljuje (največ MAX_TOOL_ROUNDS krogov).
  const content = [];
  let text = "";
  let usage = null;
  let stopReason = null;
  let finalModel = model;
  let toolCalls = 0;
  let msgs = messages;
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const p = { ...params, messages: msgs };
    if (tools?.length && round === MAX_TOOL_ROUNDS) p.tool_choice = { type: "none" };
    let gap = text && !text.endsWith("\n") ? "\n\n" : "";
    const stream = getClient().beta.messages.stream(p, { signal });
    // Poraba sproti (message_start: vhod, message_delta: izhod doslej): ob prekinitvi (učenec zapre
    // aplikacijo) je klic že plačan, zato napaka nese delno porabo in strežnik jo zapiše (server/app.js).
    let live = null;
    let liveModel = model;
    let final;
    try {
      for await (const event of stream) {
        if (event.type === "message_start") {
          live = { ...(event.message?.usage || {}) };
          liveModel = event.message?.model || model;
        } else if (event.type === "message_delta" && event.usage && live) {
          for (const [k, v] of Object.entries(event.usage)) if (typeof v === "number") live[k] = v;
        } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const chunk = gap + event.delta.text;
          gap = "";
          text += chunk;
          onText(chunk);
        }
      }
      final = await stream.finalMessage();
    } catch (err) {
      const spent = addUsage(usage, live);
      if (spent && err && typeof err === "object") {
        err.usage = spent;
        err.model = liveModel;
      }
      throw err;
    }
    usage = addUsage(usage, final.usage);
    stopReason = final.stop_reason;
    finalModel = final.model || model;
    content.push(...final.content);
    const calls = final.content.filter((b) => b.type === "tool_use");
    if (stopReason !== "tool_use" || !calls.length || !onToolUse) break;
    const results = [];
    for (const c of calls) {
      toolCalls++;
      const r = await onToolUse(c.name, c.input || {});
      results.push({ type: "tool_result", tool_use_id: c.id, content: String(r?.content ?? ""), ...(r?.isError ? { is_error: true } : {}) });
    }
    msgs = [...msgs, { role: "assistant", content: final.content }, { role: "user", content: results }];
  }
  return { content, text, stopReason, usage, model: finalModel, toolCalls };
}

const MAX_TOOL_ROUNDS = 3;

// Seštevek porabe žetonov več klicev (krogi orodij).
export function addUsage(a, b) {
  if (!b) return a;
  if (!a) return { ...b };
  const out = { ...a };
  for (const k of ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"]) out[k] = (a[k] || 0) + (b[k] || 0);
  // Razdelitev zapisov po času (5 min / 1 h) za pravilno ceno (costUsd).
  if (a.cache_creation || b.cache_creation) {
    out.cache_creation = {};
    for (const k of ["ephemeral_5m_input_tokens", "ephemeral_1h_input_tokens"]) out.cache_creation[k] = (a.cache_creation?.[k] || 0) + (b.cache_creation?.[k] || 0);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Preizkusni način: brez API ključa vrne vnaprej pripravljen odgovor.

function lastUserText(messages) {
  const last = messages[messages.length - 1];
  if (!last) return "";
  if (typeof last.content === "string") return last.content;
  // Skriti opombi s preverjenim rezultatom (server/live-check.js) in pole (server/paper-context.js) nista del učenčevega besedila.
  return last.content
    .filter((b) => b.type === "text" && !isHiddenNote(b.text))
    .map((b) => b.text)
    .join(" ");
}

function mockAnswer(userText) {
  const t = userText.toLowerCase();
  if (/sistemsk|prompt|navodil|ignoriraj/.test(t)) {
    return '»Žal ti teh informacij o svojem delovanju ne morem razkriti. 🛡️ Sem tvoj osebni AI inštruktor za naravoslovne predmete. Povej mi raje, katero nalogo rešuješ, da jo pogledava skupaj!«\n<<META subject=MAT topic="-" error=0 mode=A flag=injection done=0>>';
  }
  if (/kemij/.test(t)) {
    return 'Prav, preklopil sem na kemijo. 🧪\n\nKatero nalogo imaš? Napiši jo ali jo fotografiraj.\n<<META subject=KEM topic="-" error=0 mode=A flag=none done=0>>';
  }
  if (/x\s*=\s*4|rezultat je 4/.test(t)) {
    return 'Ni čisto prav, a si blizu. Poglej drugi korak: ko si odštel $3$ na obeh straneh, koliko ostane na desni?\n<<META subject=MAT topic="linearne enačbe" error=1 mode=A flag=none done=0>>';
  }
  if (/^kaj je|kartic|zapomni/.test(t)) {
    return (
      "*(Preizkusni način.)*\n\n" +
      "**Enačba** je zapis, v katerem sta dva izraza povezana z enačajem $=$, na primer $x + 3 = 5$. Črka $x$ je **neznanka**: število, ki ga še ne poznamo. Enačbo **rešimo**, ko najdemo število, ki zapis naredi resničen: tukaj $x = 2$, ker je $2 + 3 = 5$.\n\n" +
      "> 📌 **Zapomni si:** rešitev enačbe je število, ki ga vstavimo namesto neznanke, da sta obe strani enaki.\n\n" +
      "Ali je $x = 4$ rešitev enačbe $x + 1 = 5$? Preveri z vstavljanjem.\n" +
      "<<KARTICA\nV: Kaj je rešitev enačbe?\nO: Število, ki ga vstavimo namesto neznanke, da sta leva in desna stran enaki (npr. $x = 2$ pri $x + 3 = 5$).\n>>\n" +
      '<<IZBIRE ["Preverim z vstavljanjem", "Pokaži mi primer", "Ne vem"]>>\n' +
      '<<META subject=MAT topic="enačbe" error=0 mode=A flag=none done=0>>'
    );
  }
  // Orodja aplikacije (server/odpri.js): poskus, 3D, graf in skica pod odgovorom.
  if (/poka[žz]i (mi )?(poskus|v 3d|graf|skic)/.test(t)) {
    return (
      "*(Preizkusni način.)*\n\nPri prostem padu vsa telesa padajo z enakim pospeškom, če ni zračnega upora. Kaj misliš: kaj bo prej na tleh, težja ali lažja kroglica?\n" +
      '<<ODPRI poskus="prosti pad" nastavi="višina=20">>\n' +
      '<<ODPRI 3d="srce" del="levi prekat">>\n' +
      '<<GRAF ["y = a*x^2 + c", "a = 1", "c = -2"]>>\n' +
      '<<SKICA {"tocke": {"A": [0, 0], "B": [4, 0], "C": [4, 3]}, "daljice": [["A", "B", "a"], ["B", "C", "b"], ["C", "A", "c"]], "koti": [["A", "B", "C", "90°"]]}>>\n' +
      '<<META subject=FIZ topic="prosti pad" error=0 mode=A flag=none done=0>>'
    );
  }
  if (/začniva s temo/.test(t)) {
    return "*(Preizkusni način.)*\n\nPreden razložim: kaj že veš o tej temi? Poskusi odgovoriti na kratko vprašanje:\n\nKoliko je $3 \\cdot 4$?\n" + '<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
  }
  return (
    "*(Preizkusni način: to je vnaprej pripravljen odgovor.)*\n\n" +
    "Poglejva skupaj. Pri enačbi $2x + 3 = 11$ želimo, da $x$ ostane sam.\n\n" +
    "Kaj bi naredil najprej, da se znebiš števila $3$ na levi strani?\n" +
    '<<META subject=MAT topic="linearne enačbe" error=0 mode=A flag=none done=0>>'
  );
}

async function mockReply({ messages, onText, signal, model, onToolUse = null }) {
  let text = null;
  let toolCalls = 0;
  // Nastavitve iz klepeta tudi brez ključa (najpogostejše prošnje, glej server/chat-settings.js).
  const call = onToolUse ? mockToolCall(lastUserText(messages), !!onToolUse.hasPending?.()) : null;
  if (call) {
    const r = await onToolUse(call.name, call.input);
    toolCalls = 1;
    text = "*(Preizkusni način.)* " + mockToolText(r?.content) + '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
  }
  if (text === null) text = mockAnswer(lastUserText(messages));
  const delay = Number(process.env.EVKLID_MOCK_DELAY_MS ?? 15);
  for (let i = 0; i < text.length; i += 6) {
    if (signal?.aborted) break;
    onText(text.slice(i, i + 6));
    if (delay) await new Promise((r) => setTimeout(r, delay));
  }
  return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage: { input_tokens: 0, output_tokens: 0 }, model, toolCalls };
}

// ---------------------------------------------------------------------------
// Branje rokopisa: učenec odgovor napiše s prstom ali miško, model ga prepiše.
// Model NE preverja pravilnosti (to naredi koda), samo prebere zapisano.

const OCR_MODEL = env("EVKLID_OCR_MODEL", MODEL);

export async function readHandwriting({ imageBase64, mediaType = "image/png", answerType = "number", unit = null }) {
  if (isMockMode()) return { text: null, mock: true, usage: null, model: OCR_MODEL };
  const kind =
    answerType === "fraction"
      ? "ulomek (zapiši kot a/b)"
      : answerType === "coefficients"
        ? "zaporedje koeficientov, ločenih z vejico (npr. 2, 1, 2)"
        : unit
          ? `število z enoto (npr. 12,5 ${unit})`
          : "število ali kratek izraz";
  const final = await getClient().messages.create({
    model: OCR_MODEL,
    max_tokens: 200,
    // Samo prepis: brez razmišljanja (manj izhodnih žetonov, odgovor se ne odreže).
    ...quickParams(OCR_MODEL),
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          {
            type: "text",
            text:
              `Na sliki je učenčev ročno napisan zapis pri nalogi iz matematike, fizike ali kemije. Pričakovan odgovor je ${kind}.\n` +
              "Prepiši KONČNI odgovor točno tako, kot je napisan (tudi če je napačen). Ne računaj in ne popravljaj. " +
              "Decimalno vejico zapiši z vejico. Če je zapisanih več vrstic, je končni odgovor običajno zadnja vrstica ali zapis za »=«.\n" +
              "Odgovori samo z eno vrstico: <odgovor>prepis</odgovor>. Če zapisa ni mogoče prebrati, odgovori <odgovor>?</odgovor>.",
          },
        ],
      },
    ],
  });
  const raw = final.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const m = raw.match(/<odgovor>([\s\S]*?)<\/odgovor>/);
  let text = (m ? m[1] : raw).trim().slice(0, 80);
  if (!text || text === "?") text = null;
  return { text, usage: final.usage, model: final.model || OCR_MODEL };
}
