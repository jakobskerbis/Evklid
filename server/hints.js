// Prvi odgovor pri »Vprašaj Evklida« iz Vadnice brez klica modela.
// Generator nalog že pozna podatke, iskano količino in namig, zato prvi korak
// vodenja (Podatki / Iščemo / namig / vprašanje) sestavi koda. Model pride na vrsto,
// ko učenec odgovori.
//
// Pregled pripravljenosti pilota (26. 11. 2026, poseg 2): če učenčev odgovor ustreza tipični napaki naloge (seznam
// generatorja, server/vaja-opomba.js diagnoza), prvi odgovor imenuje to napako namesto splošnega namiga; če je učenec
// že napisal korake in koda napake ne prepozna, prvi odgovor da model (s skrito opombo), ne splošen namig. Napako je
// štela že Vadnica, zato META error=0 (prej se je ena napaka štela dvakrat: v Vadnici in v klepetu).
import { diagnoza } from "./vaja-opomba.js";

const ANGLESCINA = /\b(the|is|are|and|of|to|you|your)\b/i;
const list = (xs) => xs.map((x) => `$${x}$`).join(", ");

// task: shranjena naloga (payload iz generatorja); vrne besedilo z META vrstico ali null.
export function codeHint(task, { subject = "MAT", topicName = "-", lastAnswer = null, work = "" } = {}) {
  if (!task) return null;
  const given = Array.isArray(task.data?.given) ? task.data.given.filter(Boolean) : [];
  const find = Array.isArray(task.data?.find) ? task.data.find.filter(Boolean) : [];
  const hint = typeof task.hint === "string" ? task.hint.trim() : "";
  // Razlaga v angleščini (naloge mednarodne mature) ne sodi v slovenski odgovor: tedaj jo ima samo skrita opomba.
  const why = lastAnswer ? diagnoza(task, lastAnswer).napaka : null;
  const napaka = why && !ANGLESCINA.test(why) ? why : null;
  const koraki = typeof work === "string" && work.trim() !== "";
  // Učenec je napisal korake, koda pa napake ne prepozna: korak naj poišče model (ima skrito opombo z rezultatom),
  // ne splošen namig iz kode.
  if (lastAnswer && koraki && !napaka) return null;
  if (!given.length && !hint && !napaka) return null;

  const lines = [];
  lines.push(lastAnswer ? "Ni še čisto prav, a skupaj bova hitro našla, kje se zatakne. 🙂" : "Prav, začniva skupaj. 🙂");
  if (given.length) {
    lines.push("");
    lines.push(`**Podatki:** ${list(given)}`);
    if (find.length) lines.push(`**Iščemo:** ${list(find)}`);
  }
  if (napaka) {
    lines.push("");
    lines.push(`**Kaj je šlo narobe:** ${napaka}`);
  } else if (hint) {
    lines.push("");
    lines.push(`**Namig:** ${hint}`);
  }
  lines.push("");
  if (napaka) {
    lines.push("V katerem koraku se ti je to zgodilo? Popravi ta del in poskusi znova: kaj dobiš, ko to upoštevaš?");
  } else if (task.formula && given.length) {
    lines.push(
      lastAnswer
        ? "Katero zvezo (formulo) si uporabil? Napiši jo in prvi korak računa, pa pogledava, kje je šlo narobe."
        : "Katera zveza (formula) povezuje te količine? Napiši jo in prvi korak, ki bi ga naredil.",
    );
  } else {
    lines.push(lastAnswer ? "Napiši, kako si računal, pa pogledava korak za korakom." : "Kaj bi naredil najprej? Napiši prvi korak.");
  }
  const topic = String(topicName || "-").replace(/"/g, "'").slice(0, 80);
  lines.push(`<<META subject=${subject} topic="${topic}" error=0 mode=A flag=none done=0>>`);
  return lines.join("\n");
}
