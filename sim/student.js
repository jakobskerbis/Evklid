// Digitalni učenec: jezikovni model igra učenca po osebnosti (personas.js),
// nato sporočilo dobi realističen zapis (noise.js). Brez API ključa je na voljo
// preprost vnaprej napisan učenec za suhi zagon.
import { callJson } from "./llm.js";
import { applyNoise, rng } from "./noise.js";

const DEJANJA = ["pisi", "podrobneje", "odidi"];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["misel", "razumevanje", "pocutje", "dejanje", "sporocilo"],
  properties: {
    misel: { type: "string", description: "Kratka notranja misel učenca (1–2 stavka), ki je inštruktor ne vidi." },
    razumevanje: { type: "integer", description: "Koliko učenec ta trenutek res razume snov, 0–10." },
    pocutje: { type: "string", description: "Ena beseda: npr. zmeden, motiviran, naveličan, frustriran, zadovoljen, zaskrbljen." },
    dejanje: { type: "string", enum: DEJANJA },
    sporocilo: { type: "string", description: "Besedilo, ki ga učenec pošlje (prazno pri dejanju podrobneje ali odidi brez pozdrava)." },
  },
};

export function studentSystemPrompt(p) {
  const s = p.settings;
  const sola =
    s.educational_track === "UNIVERZA" ? `študent, ${s.curriculum_level}` : s.educational_track === "SREDNJA_SOLA" ? `dijak, ${s.curriculum_level} srednje šole` : `učenec, ${s.curriculum_level} osnovne šole`;
  return `Si igralec v simulaciji: igraš resničnega slovenskega ${p.spol === "z" ? "učenko" : "učenca"}, ki prvič uporablja Evklid, aplikacijo z AI inštruktorjem za matematiko, fiziko in kemijo. Simulacija služi preizkusu inštruktorja, zato je najpomembnejše, da si čim bolj podoben${p.spol === "z" ? "a" : ""} resničnemu otroku oziroma mladostniku te starosti – ne idealnemu učencu.

## Kdo si
- Ime: ${p.ime}, ${p.starost} let, ${sola}. Predmet: ${s.subject}.
- Sposobnost pri predmetu: ${p.sposobnost}/5.
- Značaj: ${p.znacaj}
- Kaj znaš: ${p.znanje}
- Tvoje napačne predstave (ne veš, da so napačne): ${p.napacne.map((n) => `\n  - ${n}`).join("")}
- S čim prideš: ${p.naloga}

## Potek, ki ga poskusiš izpeljati (naravno, ne kot seznam)
${p.potek.map((x) => `- ${x}`).join("\n")}

## Kako pišeš
- Dolžina sporočil: ${p.pisanje.dolzina}. ${p.pisanje.sleng?.length ? `Uporabljaš izraze, kot so: ${p.pisanje.sleng.join(", ")}.` : ""}
- ${p.pisanje.emoji > 0.3 ? "Pogosto uporabljaš emojije." : p.pisanje.emoji > 0 ? "Emoji le redko." : "Brez emojijev."}
- Piši kot na telefonu: brez LaTeX-a in brez lepega oblikovanja. Ulomke pišeš kot 1/2, potence kot x^2 ali x2, množenje kot * ali x.
- Ne piši v popolni knjižni slovenščini, razen če tako piše tvoj lik. Tipkarske napake in šumnike bo dodal sistem, ti piši naravno za svoj lik.

## Pravila igre
1. Ostani v vlogi. Nikoli ne omenjaj, da si AI ali da gre za simulacijo.
2. Napačne predstave opustiš šele, ko ti inštruktor res pomaga razumeti (primer, vprašanje, ki te pripelje do protislovja). Gola trditev »to ni prav« te ne prepriča takoj. Ne razumeš hitreje, kot bi resničen učenec tvoje sposobnosti.
3. Dolgih sporočil ne prebereš natančno, če tvoj lik tega ne bi (mlajši, nestrpni). Lahko spregledaš vprašanje na koncu.
4. Pri računanju se lahko zmotiš, kot bi se tvoj lik. Če inštruktor reče kaj napačnega, tega ne opaziš, razen če je tvoja sposobnost 4 ali več.
5. Dejanje: »pisi« = pošlješ sporočilo; »podrobneje« = pritisneš gumb »Razloži podrobneje« (brez besedila); »odidi« = zapreš aplikacijo (ko je naloga rešena, ko se naveličaš ali obupaš; resnični učenci pogosto odidejo brez pozdrava).
6. Polje »misel« je tvoja iskrena notranja misel (ali razumeš, ali te je inštruktor razjezil, dolgočasil, ti pomagal). »razumevanje« je tvoje dejansko razumevanje snovi od 0 do 10.`;
}

function toApiMessages(history) {
  // Inštruktor je za učenca »uporabnik«, učenec je »asistent«. Prvo sporočilo je navodilo za začetek.
  const msgs = [{ role: "user", content: "(Odpreš klepet z inštruktorjem v aplikaciji Evklid. Napiši prvo sporočilo.)" }];
  for (const turn of history) {
    if (turn.role === "student") {
      msgs.push({ role: "assistant", content: turn.action === "podrobneje" ? "[pritisnem gumb »Razloži podrobneje«]" : turn.text || "(nič)" });
    } else {
      msgs.push({ role: "user", content: `INŠTRUKTOR:\n${turn.text}` });
    }
  }
  if (history.length) msgs.push({ role: "user", content: "(Zdaj si na vrsti ti. Odgovori po pravilih igre.)" });
  return msgs;
}

export class LlmStudent {
  constructor(persona, { model = "claude-opus-5-5", effort = "medium", seed = 1 } = {}) {
    this.p = persona;
    this.model = model;
    this.effort = effort;
    this.r = rng(`${seed}:${persona.id}`);
    this.system = studentSystemPrompt(persona);
    this.cost = 0;
  }

  async next(history) {
    const turnNo = history.filter((t) => t.role === "student").length + 1;
    const messages = toApiMessages(history);
    if (turnNo >= this.p.maxPotez) {
      messages[messages.length - 1].content += "\n\n(To je tvoje zadnje sporočilo v tej seji: zaključi, kot bi zaključil tvoj lik.)";
    }
    const { data, cost } = await callJson({ model: this.model, effort: this.effort, system: this.system, messages, schema: SCHEMA, maxTokens: 4000 });
    this.cost += cost;
    const action = DEJANJA.includes(data.dejanje) ? data.dejanje : "pisi";
    const clean = String(data.sporocilo || "").trim();
    return {
      action: action === "pisi" && !clean ? "odidi" : action,
      text: action === "podrobneje" ? "" : applyNoise(clean, this.p.pisanje, this.r),
      clean,
      thought: data.misel,
      understanding: data.razumevanje,
      mood: data.pocutje,
    };
  }
}

// Brez API ključa: vnaprej napisan učenec (za suhi zagon in teste).
const SCRIPT = ["{naloga}", "nevem", "a lahko razložiš drugače?", "aha ok mislim da štekam"];

export class ScriptedStudent {
  constructor(persona, { seed = 1, turns = 4 } = {}) {
    this.p = persona;
    this.turns = Math.min(turns, persona.maxPotez);
    this.r = rng(`${seed}:${persona.id}`);
    this.cost = 0;
  }

  async next(history) {
    const i = history.filter((t) => t.role === "student").length;
    if (i >= this.turns) return { action: "odidi", text: "", clean: "", thought: "(konec skripte)", understanding: null, mood: "-" };
    const line = SCRIPT[i % SCRIPT.length].replace("{naloga}", this.p.naloga);
    return { action: "pisi", text: applyNoise(line, this.p.pisanje, this.r), clean: line, thought: "(vnaprej napisan učenec)", understanding: null, mood: "-" };
  }
}
