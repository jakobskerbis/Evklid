// Zlati nabor inštruktorja (P1-10, j 25. 11. 2026): sestava primerov, navodila slepim ocenjevalcem, branje in združevanje
// ocen, povzetek in primerjava dveh zagonov. Brez klicev modela in brez strežnika, zato jo preizkusi test brez ključa.
// Zagon meritve: scripts/meri-zlati-nabor.mjs. Opis: docs/zlati-nabor.md.
//
// Primerjava dveh izidov (pred in po spremembi poziva ali izbire modela, 0 $):
//   node scripts/zlati-nabor-ocena.mjs --primerjaj data/meri-zlati-nabor.json data/meri-zlati-nabor-kandidat.json
// Izid je »ni slabše v nobenem merilu« samo, če na istih primerih nobeno merilo nima več ocen NE kot prej.
import fs from "node:fs";

// Merila (ključi v primerih) in kako jih ocenjevalec razume. Angleško, ker jih bere model (docs/token-rules.md).
export const MERILA = {
  rezultat: "The tutor's final answer or core content agrees with the reference. If the tutor, appropriately for the conversation, gave no final answer yet, answer NR.",
  trditve: "Every factual, mathematical, numerical, unit and terminology claim in the tutor's replies is correct. Check against the reference and by your own careful calculation. One wrong claim, even a side remark, is NE.",
  celota: "Every tutor reply is complete: not cut off mid-sentence or mid-formula, and it addresses every part the student asked.",
  raven: "Language, notation and depth fit the student's school level and grade given in the profile.",
  napaka: "If the student's answer or step is wrong (see reference), the tutor does not confirm, praise or silently build on it and makes clear that something is wrong. If it is right, the tutor does not reject it. NR if the student made no claim.",
  predstava: "The tutor addresses the cause of the student's error (the misconception named in the reference), not only that the answer is wrong.",
  ne_izda: "The student wants to solve it alone: the tutor does not reveal the final result in its replies before the student reached it (hints and questions are fine).",
  poenostavi: "In reply to the student's \"I don't understand\" message, the explanation is genuinely simpler or different, not a repeat of the earlier one.",
  pricakovano: "The tutor's behaviour matches the expected behaviour described in the reference.",
};
const VREDNOSTI = new Set(["DA", "NE", "NR"]);
// Merila, ki štejejo za »odgovor z napako« (mera iz načrta: Preizkus 3 je imel 7 od 150).
export const NAPAKA_MERILA = ["rezultat", "trditve", "celota"];

// Vse skupine. »preizkus3« je šifriran (naloge niso javne) in brez uradnih rešitev v repozitoriju: ocenjevalec preveri sam.
export const SKUPINE = ["bio", "kem", "predstave", "astra", "pedagogika", "matura", "preizkus3"];
export const JAVNE = SKUPINE.filter((s) => s !== "preizkus3");

const besedilo = (v) => String(v ?? "");

// Vsakih n-ti primer znotraj vsake vrste (stalen izbor, enak ob vsakem zagonu): vse vrste napak so zastopane.
export function vzorecPoVrsti(primeri, n) {
  const poVrsti = new Map();
  for (const p of primeri) {
    const k = `${p.vrsta}|${p.pravilen ? 1 : 0}`;
    if (!poVrsti.has(k)) poVrsti.set(k, []);
    poVrsti.get(k).push(p);
  }
  const izbrani = new Set([...poVrsti.values()].flatMap((v) => v.filter((_, i) => i % n === 0)));
  return primeri.filter((p) => izbrani.has(p));
}

// Enotna oblika primera: { id, skupina, profil, zgodovina?, krogi, referenca, merila, pedagogika }.
// zgodovina: že zapisan del pogovora ({ vloga: "ucenec"|"instruktor", besedilo }), krogi: sporočila učenca, ki gredo
// skozi pravo aplikacijo. referenca gre samo ocenjevalcu, nikoli inštruktorju.
export function sestaviPrimere({ novi = [], astra = [], pedagogika = [], matura = [], preizkus3 = [] } = {}) {
  const out = [];
  for (const p of novi) out.push({ id: p.id, skupina: p.skupina, profil: { solving_mode: "A", ...p.profil }, krogi: p.krogi, referenca: p.referenca, merila: p.merila, pedagogika: false });
  for (const p of astra) out.push({ id: `astra-${p.id}`, skupina: "astra", profil: { ...p.profil, solving_mode: "A" }, krogi: p.krogi, referenca: `Expected behaviour: ${p.pricakovano}`, merila: ["pricakovano", "trditve", "celota", "raven"], pedagogika: true });
  for (const p of pedagogika) {
    out.push({
      id: `ped-${p.id}`,
      skupina: "pedagogika",
      profil: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT", solving_mode: "A" },
      // Isto kot scripts/meri-pedagogika.mjs: prošnja za pomoč brez prošnje za rešitev, korak, »ne razumem«.
      krogi: [`Pomagaj mi pri tej nalogi, rada bi jo rešila sama.\n\n${p.naloga}`, p.korak, p.tretje],
      referenca: `Correct final result: ${p.rezultat}. The student's step (2nd message) is ${p.korak_pravilen ? "RIGHT" : `WRONG: ${p.napaka}`}. The 3rd message asks for a simpler explanation. The student wants to solve it alone.`,
      merila: ["ne_izda", "napaka", "poenostavi", "trditve", "raven"],
      pedagogika: true,
    });
  }
  for (const p of matura) {
    out.push({
      id: `mat-${p.id}`,
      skupina: "matura",
      profil: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT", solving_mode: "A" },
      zgodovina: [{ vloga: "ucenec", besedilo: p.naloga }, ...p.pogovor.map((t, i) => ({ vloga: i % 2 === 0 ? "instruktor" : "ucenec", besedilo: t }))],
      krogi: [p.ucenec],
      referenca: `The student's last message is ${p.pravilen ? "RIGHT" : "WRONG"}. Correct solution / the error: ${p.zakaj}`,
      merila: ["napaka", "trditve", "raven"],
      pedagogika: false,
    });
  }
  for (const n of preizkus3) {
    out.push({ id: `p3-${n.id}`, skupina: "preizkus3", profil: n.nastavitve, krogi: [n.q, ...(n.odgovori || [])], referenca: null, merila: ["rezultat", "trditve", "celota", "raven"], pedagogika: false });
  }
  return out;
}

export const NAVODILA = `You are one of several independent graders of an AI tutor (Evklid) for Slovenian students. You see one conversation: the student's profile, the student's messages and the tutor's replies, and usually a reference written by a teacher (the correct answer, the error in the student's step, or the expected behaviour). The tutor never saw the reference.
Grade each listed criterion with DA (met), NE (not met) or NR (does not apply in this conversation). Be strict and concrete: recompute every number the tutor states. Judge only what is written; do not reward length.
If there is no reference, solve the task yourself carefully before judging "rezultat" and "trditve".
If asked for "pedagogika", give one integer 1–10 for the teaching quality of the whole conversation (10 = an excellent human tutor: guides with questions, catches errors kindly, adapts, checks understanding; 1 = harmful).
Reply with one JSON object only, no other text:
{"merila": {"<criterion>": "DA" | "NE" | "NR", ...}, "pedagogika": <1-10 or null>, "napake": ["<each wrong claim or missed point, one short sentence, quoting the tutor>"]}`;

// Besedilo za ocenjevalca. vrstniRed obrne vrstni red meril pri drugem ocenjevalcu (manj vpliva vrstnega reda).
export function vprasanjeOcenjevalcu(primer, prepis, { obrni = false } = {}) {
  const merila = obrni ? [...primer.merila].reverse() : primer.merila;
  const vrstice = [];
  vrstice.push(`STUDENT PROFILE: ${JSON.stringify({ school: primer.profil.educational_track, grade: primer.profil.curriculum_level, subject: primer.profil.subject, mode: primer.profil.solving_mode === "B" ? "full solution" : "guided" })}`);
  vrstice.push("");
  vrstice.push("CONVERSATION:");
  for (const z of primer.zgodovina || []) vrstice.push(`${z.vloga === "ucenec" ? "STUDENT" : "TUTOR (earlier)"}: ${z.besedilo}`, "");
  for (const k of prepis) vrstice.push(`STUDENT: ${k.ucenec}`, "", `TUTOR: ${k.evklid}`, "");
  vrstice.push(primer.referenca ? `REFERENCE (teacher): ${primer.referenca}` : "REFERENCE: none. Solve the task yourself before judging.");
  vrstice.push("");
  vrstice.push("CRITERIA:");
  for (const m of merila) vrstice.push(`- ${m}: ${MERILA[m]}`);
  vrstice.push(primer.pedagogika ? "Also give \"pedagogika\" (1–10)." : "\"pedagogika\": null.");
  return vrstice.join("\n");
}

// Odgovor ocenjevalca → { merila, pedagogika, napake } ali null, če ni veljaven (manjka merilo ali napačna vrednost).
export function preberiOceno(text, merila, pedagogika = false) {
  const s = besedilo(text);
  const i = s.indexOf("{");
  const j = s.lastIndexOf("}");
  if (i < 0 || j <= i) return null;
  let o;
  try {
    o = JSON.parse(s.slice(i, j + 1));
  } catch {
    return null;
  }
  const izid = {};
  for (const m of merila) {
    const v = besedilo(o?.merila?.[m]).trim().toUpperCase();
    if (!VREDNOSTI.has(v)) return null;
    izid[m] = v;
  }
  let ped = null;
  if (pedagogika) {
    ped = Number(o?.pedagogika);
    if (!Number.isInteger(ped) || ped < 1 || ped > 10) return null;
  }
  const napake = Array.isArray(o?.napake) ? o.napake.map((x) => besedilo(x).slice(0, 300)).slice(0, 10) : [];
  return { merila: izid, pedagogika: ped, napake };
}

// Ali se prva dva ocenjevalca razlikujeta (v kateremkoli merilu ali za več kot 2 točki pri pedagogiki): tedaj tretji.
export function potrebenTretji(a, b, merila) {
  if (!a || !b) return true;
  if (merila.some((m) => a.merila[m] !== b.merila[m])) return true;
  return a.pedagogika != null && b.pedagogika != null && Math.abs(a.pedagogika - b.pedagogika) > 2;
}

// Končna ocena iz 2 ali 3 veljavnih ocen: večina po merilu (brez večine »NEODLOCENO«), pedagogika povprečje.
export function zdruziOcene(ocene, merila) {
  const veljavne = ocene.filter(Boolean);
  const koncna = {};
  for (const m of merila) {
    const st = {};
    for (const o of veljavne) st[o.merila[m]] = (st[o.merila[m]] || 0) + 1;
    const [v, n] = Object.entries(st).sort((x, y) => y[1] - x[1])[0] || [];
    koncna[m] = v && n > veljavne.length / 2 ? v : "NEODLOCENO";
  }
  const ped = veljavne.map((o) => o.pedagogika).filter((x) => x != null);
  return { merila: koncna, pedagogika: ped.length ? Math.round((ped.reduce((a, b) => a + b, 0) / ped.length) * 10) / 10 : null };
}

// Ujemanje prvih dveh ocenjevalcev po merilih: delež in Cohenov kapa (DA/NE/NR), ker »samo ocena modela« ni dokaz.
export function ujemanje(izid) {
  const pari = [];
  for (const r of izid) {
    const [a, b] = r.ocene || [];
    if (!a || !b) continue;
    for (const m of Object.keys(r.koncna?.merila || {})) pari.push([a.merila[m], b.merila[m]]);
  }
  if (!pari.length) return { parov: 0, delez: null, kapa: null };
  const enaki = pari.filter(([x, y]) => x === y).length;
  const po = enaki / pari.length;
  let pe = 0;
  for (const v of VREDNOSTI) pe += (pari.filter(([x]) => x === v).length / pari.length) * (pari.filter(([, y]) => y === v).length / pari.length);
  return { parov: pari.length, delez: po, kapa: pe < 1 ? (po - pe) / (1 - pe) : 1 };
}

// Povzetek: po skupini in merilu štetje DA/NE/NR/NEODLOCENO, primeri z napako, povprečje pedagogike.
export function povzetek(izid) {
  const skupine = {};
  for (const r of izid) {
    if (!r.koncna) continue;
    const s = (skupine[r.skupina] ||= { primerov: 0, merila: {}, zNapako: [], pedagogika: [] });
    s.primerov++;
    for (const [m, v] of Object.entries(r.koncna.merila)) {
      const c = (s.merila[m] ||= { DA: 0, NE: 0, NR: 0, NEODLOCENO: 0 });
      c[v]++;
    }
    if (NAPAKA_MERILA.some((m) => r.koncna.merila[m] === "NE")) s.zNapako.push(r.id);
    if (r.koncna.pedagogika != null) s.pedagogika.push(r.koncna.pedagogika);
  }
  for (const s of Object.values(skupine)) s.pedagogika = s.pedagogika.length ? Math.round((s.pedagogika.reduce((a, b) => a + b, 0) / s.pedagogika.length) * 10) / 10 : null;
  return { skupine, ujemanje: ujemanje(izid) };
}

const odst = (c) => (c.DA + c.NE ? `${c.DA}/${c.DA + c.NE}` : "–");

// Tabela v Markdownu za dnevnik in povzetek zagona v GitHub Actions.
export function tabela(pov) {
  const merila = Object.keys(MERILA).filter((m) => Object.values(pov.skupine).some((s) => s.merila[m]));
  const vrst = [`| skupina | primerov | ${merila.join(" | ")} | z napako | pedagogika |`, `|---|---|${merila.map(() => "---").join("|")}|---|---|`];
  for (const [ime, s] of Object.entries(pov.skupine)) {
    const celice = merila.map((m) => {
      const c = s.merila[m];
      if (!c) return "";
      return odst(c) + (c.NEODLOCENO ? ` (${c.NEODLOCENO}?)` : "");
    });
    vrst.push(`| ${ime}${ime === "preizkus3" ? " (brez reference)" : ""} | ${s.primerov} | ${celice.join(" | ")} | ${s.zNapako.length} | ${s.pedagogika ?? "–"} |`);
  }
  const u = pov.ujemanje;
  vrst.push("", `Merila: DA/(DA+NE); NR ne šteje; »(n?)« = ocenjevalci brez večine. Ujemanje prvih dveh ocenjevalcev: ${u.parov ? `${Math.round(u.delez * 100)} % (kapa ${u.kapa.toFixed(2)}, ${u.parov} ocen)` : "–"}.`);
  return vrst.join("\n");
}

// Primerjava dveh izidov po istih primerih (po id): za vsako merilo število NE prej in potem in primeri, ki so se
// poslabšali (DA → NE). »slabse« je seznam meril z več NE kot prej; prazen pomeni »ni slabše v nobenem merilu«.
export function primerjaj(prej, potem) {
  const a = new Map(prej.izid.filter((r) => r.koncna).map((r) => [r.id, r]));
  const b = new Map(potem.izid.filter((r) => r.koncna).map((r) => [r.id, r]));
  const skupni = [...a.keys()].filter((id) => b.has(id));
  const merila = {};
  const poslabsani = [];
  const izboljsani = [];
  for (const id of skupni) {
    for (const [m, v] of Object.entries(a.get(id).koncna.merila)) {
      const w = b.get(id).koncna.merila[m];
      const c = (merila[m] ||= { prej: 0, potem: 0 });
      if (v === "NE") c.prej++;
      if (w === "NE") c.potem++;
      if (v === "DA" && w === "NE") poslabsani.push(`${id}:${m}`);
      if (v === "NE" && w === "DA") izboljsani.push(`${id}:${m}`);
    }
  }
  const pedagogika = (m) => {
    const x = skupni.map((id) => m.get(id).koncna.pedagogika).filter((v) => v != null);
    return x.length ? Math.round((x.reduce((s, v) => s + v, 0) / x.length) * 10) / 10 : null;
  };
  const slabse = Object.entries(merila).filter(([, c]) => c.potem > c.prej).map(([m]) => m);
  const pPrej = pedagogika(a);
  const pPotem = pedagogika(b);
  if (pPrej != null && pPotem != null && pPotem < pPrej) slabse.push("pedagogika");
  return { primerov: skupni.length, merila, pedagogika: { prej: pPrej, potem: pPotem }, poslabsani, izboljsani, slabse };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf("--primerjaj");
  if (i < 0 || process.argv.length !== i + 3) {
    console.error("Uporaba: node scripts/zlati-nabor-ocena.mjs --primerjaj <prej.json> <potem.json>");
    process.exit(1);
  }
  const beri = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
  const r = primerjaj(beri(process.argv[i + 1]), beri(process.argv[i + 2]));
  console.log(`Primerjava na ${r.primerov} skupnih primerih (število ocen NE prej → potem):`);
  for (const [m, c] of Object.entries(r.merila)) console.log(`  ${m}: ${c.prej} → ${c.potem}${c.potem > c.prej ? "  SLABŠE" : ""}`);
  console.log(`  pedagogika (povprečje): ${r.pedagogika.prej ?? "–"} → ${r.pedagogika.potem ?? "–"}`);
  if (r.poslabsani.length) console.log(`Poslabšani: ${r.poslabsani.join(", ")}`);
  if (r.izboljsani.length) console.log(`Izboljšani: ${r.izboljsani.join(", ")}`);
  console.log(r.slabse.length ? `IZID: slabše v merilih ${r.slabse.join(", ")}` : "IZID: ni slabše v nobenem merilu");
  process.exit(r.slabse.length ? 2 : 0);
}
