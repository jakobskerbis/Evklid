// Prikaz odgovora AI na zaslonu Skeniraj (public/scan/scan.js).

// Odgovor AI kot seznam dejstev (»D_f=(0,\infty), Z_f=\mathbb{R}, ničla x=1, …«): vsako dejstvo v svojo vrstico.
// Sicer prelom formule loči oznako od vrednosti (D_f | =(0,∞), Z_f | =ℝ …) in dolgo besedilo odreže.
// Vejice v oklepajih (intervali, točke, tudi [−5,∞)) ostanejo.
export function answerParts(tex) {
  const src = String(tex ?? "");
  const parts = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "\\") {
      // \{ \} (množica) štejeta kot oklepaj, drugi ukazi (\, \infty …) se preskočijo
      const n = src[i + 1];
      if (n === "{") depth++;
      else if (n === "}") depth = Math.max(0, depth - 1);
      i++;
      continue;
    }
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth = Math.max(0, depth - 1);
    else if ((c === "," || c === ";") && depth === 0) {
      parts.push(src.slice(from, i).trim());
      from = i + 1;
    }
  }
  parts.push(src.slice(from).trim());
  const facts = parts.filter(Boolean);
  // le seznam dejstev z »=« (npr. več rešitev x_1=2, x_2=3 tudi); sicer formula ostane cela
  return facts.length > 1 && facts.filter((f) => /=|\\in\b/.test(f)).length >= 2 ? facts : [src];
}
