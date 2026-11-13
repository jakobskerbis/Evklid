// Ocenjevalec: model prebere celoten pogovor (z notranjimi mislimi učenca) in
// inštruktorja oceni po merilih iz rubric.js ter pričakovanjih osebnosti.
import { callJson } from "./llm.js";
import { CRITERIA, VERDICTS, SEVERITIES, rubricText } from "./rubric.js";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["povzetek", "ocena", "merila", "pricakovanja", "dobro", "tezave", "ucenec_napredoval", "realisticnost_ucenca", "realisticnost_opomba"],
  properties: {
    povzetek: { type: "string", description: "2–3 stavki: kaj se je zgodilo in kako se je odrezal inštruktor." },
    ocena: { type: "integer", description: "Skupna ocena inštruktorja 1–5 (5 = kot odličen človeški inštruktor)." },
    merila: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "ocena", "utemeljitev"],
        properties: {
          id: { type: "string", enum: CRITERIA.map((c) => c.id) },
          ocena: { type: "string", enum: VERDICTS },
          utemeljitev: { type: "string" },
        },
      },
    },
    pricakovanja: {
      type: "array",
      description: "Za vsako pričakovanje osebnosti (po vrsti): ali ga je inštruktor izpolnil.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["pricakovanje", "ocena", "utemeljitev"],
        properties: { pricakovanje: { type: "string" }, ocena: { type: "string", enum: VERDICTS }, utemeljitev: { type: "string" } },
      },
    },
    dobro: { type: "array", items: { type: "string" }, description: "Konkretne dobre poteze inštruktorja (s številko poteze)." },
    tezave: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["merilo", "resnost", "poteza", "opis", "citat", "predlog"],
        properties: {
          merilo: { type: "string", enum: CRITERIA.map((c) => c.id) },
          resnost: { type: "string", enum: SEVERITIES },
          poteza: { type: "integer", description: "Številka odgovora inštruktorja (0, če velja za cel pogovor)." },
          opis: { type: "string" },
          citat: { type: "string", description: "Kratek dobesedni citat iz odgovora inštruktorja." },
          predlog: { type: "string", description: "Kako bi moral odgovoriti (ali kaj spremeniti v promptu)." },
        },
      },
    },
    ucenec_napredoval: { type: "string", enum: ["da", "delno", "ne", "n/a"] },
    realisticnost_ucenca: { type: "integer", description: "1–5: kako realističen je bil digitalni učenec (preverjanje simulatorja)." },
    realisticnost_opomba: { type: "string", description: "Kaj pri učencu ni bilo realistično (prazno, če je bil)." },
  },
};

const SYSTEM = `Si izkušen slovenski učitelj matematike, fizike in kemije ter ocenjevalec AI inštruktorjev. Ocenjuješ pogovor med AI inštruktorjem Evklid in digitalnim učencem (simulacija prvega uporabnika). Tvoja ocena je referenca, kaj je pri inštruktorju sprejemljivo in kaj ne, zato bodi strog, konkreten in pošten: ne nagrajuj vljudnosti, ki ne pomaga učenju, in ne kaznuj inštruktorja za napake simuliranega učenca.

## Merila (vsako oceni z OK, DELNO, NI_OK ali N/A, če se v pogovoru ni pokazalo)
${rubricText()}

## Navodila
- Vsak izračun inštruktorja preveri sam. Strokovna napaka je vedno vsaj »pomembno«, pri varnosti »kriticno«.
- Notranje misli učenca (inštruktor jih ne vidi) uporabi za presojo učnega učinka in ali je inštruktor spregledal zmedo, ne pa kot nekaj, kar bi inštruktor moral vedeti.
- Število besed in samodejna opozorila so priložena; upoštevaj jih, a sam presodi, ali je daljši odgovor upravičen (npr. način B).
- Pri težavah navedi številko poteze inštruktorja, kratek dobesedni citat in konkreten predlog boljšega odgovora.
- Odgovori v slovenščini.`;

export function transcriptForJudge(conv) {
  const p = conv.persona;
  const lines = [
    `# Učenec: ${p.ime}, ${p.starost} let (${conv.settings?.educational_track} ${conv.settings?.curriculum_level}, predmet ${conv.settings?.subject}${conv.settings?.track === "COMPETITION" ? ", tekmovanja" : ""})`,
    `Značaj: ${p.znacaj}`,
    `Napačne predstave: ${p.napacne.join(" | ")}`,
    `Poseben preizkus: ${p.test}`,
    "",
    "## Pričakovano vedenje dobrega inštruktorja",
    ...p.pricakovano.map((x, i) => `${i + 1}. ${x}`),
    "",
    "## Pogovor",
  ];
  let n = 0;
  for (const t of conv.turns) {
    if (t.role === "student") {
      const what = t.action === "podrobneje" ? "[pritisne gumb »Razloži podrobneje«]" : t.action === "odidi" ? `[zapre aplikacijo]${t.text ? ` ${t.text}` : ""}` : t.text;
      lines.push(`\n### Učenec\n${what}\n(notranja misel: ${t.thought ?? "-"}; razumevanje ${t.understanding ?? "-"}/10; počutje: ${t.mood ?? "-"})`);
    } else {
      n++;
      const auto = (t.checks || []).filter((c) => c.ok === false).map((c) => c.opis);
      lines.push(`\n### Inštruktor – odgovor ${n} (${t.words} besed${auto.length ? `; samodejno: ${auto.join(" ")}` : ""})\n${t.error ? `[NAPAKA: ${t.error}]` : t.text}`);
    }
  }
  lines.push(`\n(Konec pogovora: ${conv.endReason}.)`);
  return lines.join("\n");
}

export async function judgeConversation(conv, { model = "claude-opus-5-5", effort = "high" } = {}) {
  const { data, cost, model: used } = await callJson({
    model,
    effort,
    system: SYSTEM,
    messages: [{ role: "user", content: transcriptForJudge(conv) }],
    schema: SCHEMA,
    maxTokens: 32000,
  });
  return { ...data, model: used, cost };
}
