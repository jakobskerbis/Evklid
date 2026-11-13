// Poročilo simulacije: povzetek (JSON), Markdown in samostojna HTML stran.
import { CRITERIA } from "./rubric.js";

const SEV_ORDER = { kriticno: 0, pomembno: 1, manjse: 2 };
const SEV_LABEL = { kriticno: "kritično", pomembno: "pomembno", manjse: "manjše" };
const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const fmt = (x, d = 1) => (x === null || x === undefined || Number.isNaN(x) ? "–" : Number(x).toFixed(d).replace(".", ","));
const pct = (x) => (x === null ? "–" : `${Math.round(x * 100)} %`);

export function summarize(convs, meta = {}) {
  const judged = convs.filter((c) => c.judge);
  const criteria = CRITERIA.map((c) => {
    const counts = { OK: 0, DELNO: 0, NI_OK: 0, "N/A": 0 };
    for (const conv of judged) {
      const m = conv.judge.merila.find((x) => x.id === c.id);
      counts[m?.ocena ?? "N/A"]++;
    }
    const applicable = counts.OK + counts.DELNO + counts.NI_OK;
    return { id: c.id, ime: c.ime, kriticno: !!c.kriticno, counts, okRate: applicable ? (counts.OK + 0.5 * counts.DELNO) / applicable : null };
  });

  const checkCounts = {};
  for (const conv of convs) {
    for (const ch of conv.allChecks) {
      if (ch.ok !== false) continue;
      checkCounts[ch.id] ??= { id: ch.id, count: 0, resnost: ch.resnost, primer: `${conv.persona.ime}: ${ch.opis}` };
      checkCounts[ch.id].count++;
    }
  }

  const issues = [];
  for (const conv of judged) {
    for (const t of conv.judge.tezave) issues.push({ ...t, ucenec: conv.persona.ime, pogovor: conv.key });
  }
  for (const conv of convs) {
    for (const ch of conv.allChecks.filter((c) => c.ok === false && c.resnost === "kriticno")) {
      issues.push({ merilo: "samodejno:" + ch.id, resnost: "kriticno", poteza: ch.turn ?? 0, opis: ch.opis, citat: "", predlog: "", ucenec: conv.persona.ime, pogovor: conv.key });
    }
  }
  issues.sort((a, b) => SEV_ORDER[a.resnost] - SEV_ORDER[b.resnost]);

  const personas = convs.map((c) => ({
    key: c.key,
    id: c.persona.id,
    ime: c.persona.ime,
    starost: c.persona.starost,
    raven: `${c.settings?.curriculum_level ?? ""} ${c.settings?.subject ?? ""}`.trim(),
    test: c.persona.test,
    ocena: c.judge?.ocena ?? null,
    napredoval: c.judge?.ucenec_napredoval ?? null,
    realisticnost: c.judge?.realisticnost_ucenca ?? null,
    kriticnih: (c.judge?.tezave || []).filter((t) => t.resnost === "kriticno").length + c.allChecks.filter((x) => x.ok === false && x.resnost === "kriticno").length,
    poteze: c.turns.filter((t) => t.role === "tutor").length,
    besedPovp: avg(c.turns.filter((t) => t.role === "tutor" && t.words).map((t) => t.words)),
    razumevanje: [c.turns.find((t) => t.role === "student" && t.understanding !== null && t.understanding !== undefined)?.understanding ?? null, [...c.turns].reverse().find((t) => t.role === "student" && t.understanding !== null && t.understanding !== undefined)?.understanding ?? null],
    konec: c.endReason,
    povzetek: c.judge?.povzetek ?? null,
  }));

  const scores = personas.map((p) => p.ocena).filter((x) => x !== null);
  return {
    ...meta,
    pogovorov: convs.length,
    ocenjenih: judged.length,
    povprecnaOcena: avg(scores),
    napredovali: judged.filter((c) => c.judge.ucenec_napredoval === "da").length,
    kriticnih: issues.filter((i) => i.resnost === "kriticno").length,
    realisticnost: avg(judged.map((c) => c.judge.realisticnost_ucenca)),
    stroski: {
      ucenci: convs.reduce((s, c) => s + (c.cost?.student || 0), 0),
      ocenjevalec: convs.reduce((s, c) => s + (c.cost?.judge || 0), 0),
      instruktor: convs.reduce((s, c) => s + (c.cost?.tutor || 0), 0),
    },
    criteria,
    checks: Object.values(checkCounts).sort((a, b) => b.count - a.count),
    personas,
    issues,
  };
}

export function compare(now, base) {
  if (!base) return null;
  const crit = now.criteria.map((c) => {
    const b = base.criteria?.find((x) => x.id === c.id);
    return { id: c.id, ime: c.ime, zdaj: c.okRate, prej: b?.okRate ?? null, razlika: c.okRate !== null && b?.okRate !== null && b?.okRate !== undefined ? c.okRate - b.okRate : null };
  });
  const pers = now.personas.map((p) => {
    const b = base.personas?.find((x) => x.key === p.key);
    return { key: p.key, ime: p.ime, zdaj: p.ocena, prej: b?.ocena ?? null, razlika: p.ocena !== null && b?.ocena != null ? p.ocena - b.ocena : null };
  });
  return {
    referenca: base.zacetek ?? base.izhod ?? "?",
    povprecje: { zdaj: now.povprecnaOcena, prej: base.povprecnaOcena, razlika: now.povprecnaOcena !== null && base.povprecnaOcena !== null ? now.povprecnaOcena - base.povprecnaOcena : null },
    kriticnih: { zdaj: now.kriticnih, prej: base.kriticnih },
    criteria: crit,
    personas: pers,
  };
}

const sign = (x, d = 1) => (x === null ? "–" : `${x > 0 ? "+" : ""}${fmt(x, d)}`);

export function markdownReport(s, cmp) {
  const L = [];
  L.push(`# Digitalni razred – poročilo simulacije`, "");
  L.push(`- Zagon: ${s.zacetek ?? "–"} · inštruktor: ${s.instruktor ?? "–"} · učenci: ${s.modelUcenca ?? "–"} · ocenjevalec: ${s.modelOcenjevalca ?? "–"}`);
  L.push(`- Pogovorov: ${s.pogovorov} (ocenjenih ${s.ocenjenih}) · povprečna ocena inštruktorja: **${fmt(s.povprecnaOcena)} / 5** · učenec napredoval: ${s.napredovali}/${s.ocenjenih} · kritičnih težav: **${s.kriticnih}**`);
  L.push(`- Realističnost digitalnih učencev (ocena ocenjevalca): ${fmt(s.realisticnost)} / 5`);
  L.push(`- Stroški: učenci $${fmt(s.stroski.ucenci, 3)}, ocenjevalec $${fmt(s.stroski.ocenjevalec, 3)}, inštruktor $${fmt(s.stroski.instruktor, 3)}`, "");

  if (cmp) {
    L.push(`## Primerjava z referenčnim zagonom (${cmp.referenca})`, "");
    L.push(`Povprečna ocena: ${fmt(cmp.povprecje.prej)} → ${fmt(cmp.povprecje.zdaj)} (${sign(cmp.povprecje.razlika)}), kritičnih težav: ${cmp.kriticnih.prej ?? "–"} → ${cmp.kriticnih.zdaj}`, "");
    L.push("| Merilo | Prej | Zdaj | Razlika |", "|---|---|---|---|");
    for (const c of cmp.criteria) L.push(`| ${c.ime} | ${pct(c.prej)} | ${pct(c.zdaj)} | ${c.razlika === null ? "–" : `${c.razlika > 0 ? "+" : ""}${Math.round(c.razlika * 100)} pt`} |`);
    L.push("");
  }

  L.push("## Merila (delež OK; DELNO šteje pol)", "", "| Merilo | OK | Delno | Ni OK | N/A | Uspešnost |", "|---|---|---|---|---|---|");
  for (const c of s.criteria) L.push(`| ${c.ime}${c.kriticno ? " ⚠️" : ""} | ${c.counts.OK} | ${c.counts.DELNO} | ${c.counts.NI_OK} | ${c.counts["N/A"]} | ${pct(c.okRate)} |`);
  L.push("");

  L.push("## Učenci", "", "| Učenec | Raven | Preizkus | Ocena | Napredoval | Razumevanje (začetek → konec) | Odgovorov | Besed/odgovor | Kritično | Konec |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const p of s.personas) {
    L.push(`| [${p.ime}, ${p.starost}](pogovori/${p.key}.md) | ${p.raven} | ${p.test} | ${p.ocena ?? "–"} | ${p.napredoval ?? "–"} | ${p.razumevanje[0] ?? "–"} → ${p.razumevanje[1] ?? "–"} | ${p.poteze} | ${fmt(p.besedPovp, 0)} | ${p.kriticnih} | ${p.konec} |`);
  }
  L.push("");

  L.push("## Težave (najresnejše najprej)", "");
  if (!s.issues.length) L.push("Ni najdenih težav.");
  for (const i of s.issues) {
    L.push(`- **${SEV_LABEL[i.resnost]}** · ${i.merilo} · ${i.ucenec}${i.poteza ? `, odgovor ${i.poteza}` : ""}: ${i.opis}${i.citat ? `\n  > ${i.citat.replace(/\n/g, " ")}` : ""}${i.predlog ? `\n  Bolje: ${i.predlog}` : ""}`);
  }
  L.push("");

  if (s.checks.length) {
    L.push("## Samodejna preverjanja (število odgovorov)", "", "| Preverjanje | Število | Resnost | Primer |", "|---|---|---|---|");
    for (const c of s.checks) L.push(`| ${c.id} | ${c.count} | ${SEV_LABEL[c.resnost]} | ${c.primer.replace(/\|/g, "/")} |`);
    L.push("");
  }

  L.push("## Povzetki pogovorov", "");
  for (const p of s.personas) if (p.povzetek) L.push(`- **${p.ime}** (${p.ocena}/5): ${p.povzetek}`);
  return L.join("\n") + "\n";
}

export function transcriptMarkdown(conv) {
  const p = conv.persona;
  const L = [`# ${p.ime}, ${p.starost} let – ${conv.settings?.curriculum_level} ${conv.settings?.subject}`, "", `*${p.znacaj}*`, "", `Napačne predstave: ${p.napacne.join("; ")}`, ""];
  let n = 0;
  for (const t of conv.turns) {
    if (t.role === "student") {
      const what = t.action === "podrobneje" ? "*[pritisne »Razloži podrobneje«]*" : t.action === "odidi" ? `*[zapre aplikacijo]* ${t.text || ""}` : t.text;
      L.push(`**🧒 ${p.ime}:** ${what}`, "", `<sub>misel: ${t.thought ?? "–"} · razumevanje ${t.understanding ?? "–"}/10 · ${t.mood ?? ""}</sub>`, "");
    } else {
      n++;
      const bad = (t.checks || []).filter((c) => c.ok === false);
      L.push(`**🤖 Inštruktor (${n}, ${t.words} besed):**`, "", t.error ? `> NAPAKA: ${t.error}` : t.text, "");
      if (bad.length) L.push(`<sub>⚠️ ${bad.map((c) => c.opis).join(" · ")}</sub>`, "");
    }
  }
  L.push(`---`, `Konec: ${conv.endReason}`, "");
  if (conv.judge) {
    const j = conv.judge;
    L.push(`## Ocena: ${j.ocena}/5 (učenec napredoval: ${j.ucenec_napredoval})`, "", j.povzetek, "", "| Merilo | Ocena | Utemeljitev |", "|---|---|---|");
    for (const m of j.merila) L.push(`| ${m.id} | ${m.ocena} | ${m.utemeljitev.replace(/\|/g, "/").replace(/\n/g, " ")} |`);
    L.push("", "### Pričakovanja", "");
    for (const x of j.pricakovanja) L.push(`- ${x.ocena === "OK" ? "✅" : x.ocena === "DELNO" ? "🟡" : x.ocena === "NI_OK" ? "❌" : "➖"} ${x.pricakovanje} – ${x.utemeljitev}`);
    if (j.dobro.length) L.push("", "### Dobro", "", ...j.dobro.map((d) => `- ${d}`));
    if (j.tezave.length) {
      L.push("", "### Težave", "");
      for (const t of j.tezave) L.push(`- **${SEV_LABEL[t.resnost]}** (${t.merilo}, odgovor ${t.poteza}): ${t.opis}${t.citat ? `\n  > ${t.citat}` : ""}\n  Bolje: ${t.predlog}`);
    }
    L.push("", `Realističnost učenca: ${j.realisticnost_ucenca}/5${j.realisticnost_opomba ? ` – ${j.realisticnost_opomba}` : ""}`);
  }
  return L.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// HTML: ena samostojna datoteka (brez zunanjih virov), svetla in temna tema.

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const bar = (x) => (x === null ? "" : `<span class="bar"><i style="width:${Math.round(x * 100)}%;background:${x >= 0.8 ? "var(--ok)" : x >= 0.5 ? "var(--mid)" : "var(--bad)"}"></i></span>`);

export function htmlReport(s, convs, cmp) {
  const crit = s.criteria
    .map((c) => `<tr><td>${esc(c.ime)}${c.kriticno ? " <b title='kritično merilo'>⚠</b>" : ""}</td><td>${c.counts.OK}</td><td>${c.counts.DELNO}</td><td>${c.counts.NI_OK}</td><td>${c.counts["N/A"]}</td><td>${pct(c.okRate)} ${bar(c.okRate)}</td>${cmp ? `<td>${(() => { const x = cmp.criteria.find((y) => y.id === c.id); return x?.razlika == null ? "–" : `${x.razlika > 0 ? "+" : ""}${Math.round(x.razlika * 100)} pt`; })()}</td>` : ""}</tr>`)
    .join("");
  const pers = s.personas
    .map((p) => `<tr><td><a href="#${esc(p.key)}">${esc(p.ime)}, ${p.starost}</a></td><td>${esc(p.raven)}</td><td>${esc(p.test)}</td><td class="score s${p.ocena ?? 0}">${p.ocena ?? "–"}</td><td>${esc(p.napredoval ?? "–")}</td><td>${p.razumevanje[0] ?? "–"} → ${p.razumevanje[1] ?? "–"}</td><td>${p.poteze}</td><td>${fmt(p.besedPovp, 0)}</td><td>${p.kriticnih ? `<b class="crit">${p.kriticnih}</b>` : 0}</td></tr>`)
    .join("");
  const issues = s.issues
    .map((i) => `<li class="${i.resnost}"><span class="tag">${SEV_LABEL[i.resnost]}</span> <b>${esc(i.ucenec)}</b>${i.poteza ? `, odgovor ${i.poteza}` : ""} · <code>${esc(i.merilo)}</code><div>${esc(i.opis)}</div>${i.citat ? `<blockquote>${esc(i.citat)}</blockquote>` : ""}${i.predlog ? `<div class="sug">Bolje: ${esc(i.predlog)}</div>` : ""}</li>`)
    .join("");
  const chats = convs
    .map((c) => {
      let n = 0;
      const msgs = c.turns
        .map((t) => {
          if (t.role === "student") {
            const what = t.action === "podrobneje" ? "<i>[pritisne »Razloži podrobneje«]</i>" : t.action === "odidi" ? `<i>[zapre aplikacijo]</i> ${esc(t.text)}` : esc(t.text);
            return `<div class="msg st"><div class="bubble">${what}</div><div class="thought">💭 ${esc(t.thought ?? "–")} · razumevanje ${t.understanding ?? "–"}/10 · ${esc(t.mood ?? "")}</div></div>`;
          }
          n++;
          const bad = (t.checks || []).filter((x) => x.ok === false);
          return `<div class="msg tu"><div class="bubble"><span class="n">${n} · ${t.words} besed</span>${t.error ? `<b class="crit">NAPAKA: ${esc(t.error)}</b>` : esc(t.text)}</div>${bad.length ? `<div class="warn">⚠ ${esc(bad.map((x) => x.opis).join(" · "))}</div>` : ""}</div>`;
        })
        .join("");
      const j = c.judge;
      const verdict = j
        ? `<div class="verdict"><b>Ocena ${j.ocena}/5</b> · napredoval: ${esc(j.ucenec_napredoval)} · realističnost učenca ${j.realisticnost_ucenca}/5<p>${esc(j.povzetek)}</p><ul>${j.pricakovanja.map((x) => `<li>${x.ocena === "OK" ? "✅" : x.ocena === "DELNO" ? "🟡" : x.ocena === "NI_OK" ? "❌" : "➖"} ${esc(x.pricakovanje)} <span class="muted">– ${esc(x.utemeljitev)}</span></li>`).join("")}</ul></div>`
        : "";
      return `<details id="${esc(c.key)}"><summary><b>${esc(c.persona.ime)}, ${c.persona.starost}</b> · ${esc(c.settings?.curriculum_level)} ${esc(c.settings?.subject)} · ${esc(c.persona.test)} · ocena ${j?.ocena ?? "–"}</summary>${verdict}<div class="chat">${msgs}<div class="end">Konec: ${esc(c.endReason)}</div></div></details>`;
    })
    .join("");

  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Digitalni razred</title>
<style>
:root{--bg:#f7f8fa;--card:#fff;--fg:#0f172a;--muted:#64748b;--line:#e2e8f0;--ok:#16a34a;--mid:#d97706;--bad:#dc2626;--st:#e0f2fe;--tu:#fff;--accent:#2563eb}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--card:#111827;--fg:#e5e7eb;--muted:#94a3b8;--line:#1f2937;--st:#0c4a6e;--tu:#1e293b;--accent:#60a5fa}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}
main{max-width:1100px;margin:0 auto}h1{margin:.2em 0}h2{margin-top:1.6em}.muted{color:var(--muted)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin:14px 0}.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}.kpi b{display:block;font-size:1.6em}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:12px}table{border-collapse:collapse;width:100%}th,td{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}td:first-child{white-space:normal}
.bar{display:inline-block;width:80px;height:8px;background:var(--line);border-radius:4px;vertical-align:middle;margin-left:6px}.bar i{display:block;height:100%;border-radius:4px}
.score{font-weight:700}.s1,.s2{color:var(--bad)}.s3{color:var(--mid)}.s4,.s5{color:var(--ok)}.crit{color:var(--bad)}
ul.issues{list-style:none;padding:0}ul.issues li{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--muted);border-radius:8px;padding:10px 12px;margin:8px 0}
li.kriticno{border-left-color:var(--bad)!important}li.pomembno{border-left-color:var(--mid)!important}.tag{font-size:.8em;text-transform:uppercase;font-weight:700;color:var(--muted)}
blockquote{margin:6px 0;padding:4px 10px;border-left:3px solid var(--line);color:var(--muted);white-space:pre-wrap}.sug{color:var(--ok)}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;margin:10px 0;padding:10px 14px}summary{cursor:pointer}
.chat{display:flex;flex-direction:column;gap:8px;margin-top:10px}.msg{max-width:85%}.msg.st{align-self:flex-end}.bubble{white-space:pre-wrap;padding:8px 12px;border-radius:12px;border:1px solid var(--line)}
.st .bubble{background:var(--st)}.tu .bubble{background:var(--tu)}.thought,.warn{font-size:.8em;color:var(--muted);margin-top:2px}.warn{color:var(--mid)}.n{display:block;font-size:.75em;color:var(--muted)}
.verdict{border:1px solid var(--line);border-radius:10px;padding:10px;margin-top:8px}.end{color:var(--muted);font-size:.85em;text-align:center}
</style></head><body><main>
<h1>Digitalni razred</h1><div class="muted">Simulirani prvi uporabniki inštruktorja Evklid · ${esc(s.zacetek ?? "")} · inštruktor: ${esc(s.instruktor ?? "")} · učenci: ${esc(s.modelUcenca ?? "")} · ocenjevalec: ${esc(s.modelOcenjevalca ?? "")}</div>
<div class="kpis"><div class="kpi"><span class="muted">Povprečna ocena</span><b>${fmt(s.povprecnaOcena)} / 5</b>${cmp ? `<span class="muted">prej ${fmt(cmp.povprecje.prej)} (${sign(cmp.povprecje.razlika)})</span>` : ""}</div>
<div class="kpi"><span class="muted">Kritične težave</span><b class="${s.kriticnih ? "crit" : ""}">${s.kriticnih}</b></div>
<div class="kpi"><span class="muted">Učenec napredoval</span><b>${s.napredovali}/${s.ocenjenih}</b></div>
<div class="kpi"><span class="muted">Pogovorov</span><b>${s.pogovorov}</b></div>
<div class="kpi"><span class="muted">Realističnost učencev</span><b>${fmt(s.realisticnost)} / 5</b></div></div>
<h2>Merila</h2><div class="tw"><table><tr><th>Merilo</th><th>OK</th><th>Delno</th><th>Ni OK</th><th>N/A</th><th>Uspešnost</th>${cmp ? "<th>Razlika</th>" : ""}</tr>${crit}</table></div>
<h2>Učenci</h2><div class="tw"><table><tr><th>Učenec</th><th>Raven</th><th>Preizkus</th><th>Ocena</th><th>Napredoval</th><th>Razumevanje</th><th>Odgovorov</th><th>Besed/odg.</th><th>Kritično</th></tr>${pers}</table></div>
<h2>Težave</h2><ul class="issues">${issues || "<li>Ni najdenih težav.</li>"}</ul>
<h2>Pogovori</h2>${chats}
</main></body></html>`;
}
