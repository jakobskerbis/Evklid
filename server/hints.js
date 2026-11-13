// Prvi odgovor pri »Vprašaj Evklida« iz Vadnice brez klica modela.
// Generator nalog že pozna podatke, iskano količino in namig, zato prvi korak
// vodenja (Podatki / Iščemo / namig / vprašanje) sestavi koda. Model pride na vrsto,
// ko učenec odgovori.

const list = (xs) => xs.map((x) => `$${x}$`).join(", ");

// task: shranjena naloga (payload iz generatorja); vrne besedilo z META vrstico ali null.
export function codeHint(task, { subject = "MAT", topicName = "-", lastAnswer = null } = {}) {
  if (!task) return null;
  const given = Array.isArray(task.data?.given) ? task.data.given.filter(Boolean) : [];
  const find = Array.isArray(task.data?.find) ? task.data.find.filter(Boolean) : [];
  const hint = typeof task.hint === "string" ? task.hint.trim() : "";
  if (!given.length && !hint) return null;

  const lines = [];
  lines.push(lastAnswer ? "Ni še čisto prav, a skupaj bova hitro našla, kje se zatakne. 🙂" : "Prav, začniva skupaj. 🙂");
  if (given.length) {
    lines.push("");
    lines.push(`**Podatki:** ${list(given)}`);
    if (find.length) lines.push(`**Iščemo:** ${list(find)}`);
  }
  if (hint) {
    lines.push("");
    lines.push(`**Namig:** ${hint}`);
  }
  lines.push("");
  if (task.formula && given.length) {
    lines.push(
      lastAnswer
        ? "Katero zvezo (formulo) si uporabil? Napiši jo in prvi korak računa, pa pogledava, kje je šlo narobe."
        : "Katera zveza (formula) povezuje te količine? Napiši jo in prvi korak, ki bi ga naredil.",
    );
  } else {
    lines.push(lastAnswer ? "Napiši, kako si računal, pa pogledava korak za korakom." : "Kaj bi naredil najprej? Napiši prvi korak.");
  }
  const topic = String(topicName || "-").replace(/"/g, "'").slice(0, 80);
  lines.push(`<<META subject=${subject} topic="${topic}" error=${lastAnswer ? 1 : 0} mode=A flag=none done=0>>`);
  return lines.join("\n");
}
