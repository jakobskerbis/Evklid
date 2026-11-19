// Naloga iz pretekle pole, omenjena v klepetu (j 19. 11. 2026: »naj učenec napiše številko naloge, raven in predmet
// in naj Evklid sam v klepetu odpre nalogo«). Učenec napiše npr. »matura mat OR 2024 pola 1 naloga A5«; ta modul
// prepozna polo v katalogu (server/exam-papers-si.js) in nalogo v naši poli (server/our-papers.js). Nalog RIC ne
// prepisujemo (j, 30. 10.): v klepetu se odpre naša naloga z isto številko, izvirnik je samo povezava na ric.si.
// Čisti modul brez DOM (test/naloga-pole.test.js); klepet ga uporabi v public/app.js (odpriNalogoPole).

const low = (s) => String(s ?? "").toLowerCase().replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z");

// Hitro preverjanje pred nalaganjem kataloga: izpit in »naloga 5« ali »5. naloga«.
const EXAM_RE = /\b(matur[aeiou]?|maturitetn\w*|npz\w*|poklicn\w*|nacionaln\w* preizkus\w*)\b/;
// »naloga B4b«, »nalogo št. 5«, »naloga 5 b)«, »naloga 5 b« na koncu; nato »5. naloga«, »B4. b) naloga«.
const TASK_A = /\bnalog\w*\s*(?:st(?:evilka|\.)?\s*)?([abc])?\s*(\d{1,2})(?!\d)(?:\s*\.)?(?:\s*([a-j])\)|([a-j])(?![\wčšž])|\s+([a-j])(?=\s*(?:$|[,.?!])))?/;
const TASK_B = /\b([abc])?\s*(\d{1,2})\s*\.\s*(?:([a-j])\)\s*)?nalog\w*/;
// Samo kratka omemba (učenec želi odpreti nalogo), ne vprašanje s svojim besedilom naloge ali računom
// (»Na maturi 2024 je bila 5. naloga taka: …«): tisto gre inštruktorju kot navadno vprašanje.
const MAX_REF = 100;
export const mentionsPaperTask = (text) => {
  const s = String(text ?? "").trim();
  if (s.length > MAX_REF || /[=$:^*+]/.test(s)) return false;
  const ref = parsePaperTask(s);
  return !!ref && !!(ref.subject || ref.year);
};

// Prebere omembo naloge. Vrne null, kadar sporočilo ne omenja izpita in številke naloge; sicer
// { exam: MATURA|POKLICNA|NPZ6|NPZ9|NPZ, subject?, level?, year?, term?, pola?, section?, n, part? }.
export function parsePaperTask(text) {
  let s = low(text).replace(/\s+/g, " ");
  if (!EXAM_RE.test(s)) return null;
  const a = s.match(TASK_A);
  const b = a ? null : s.match(TASK_B);
  const tm = a || b;
  if (!tm) return null;
  const ref = { n: Number(tm[2]) };
  if (!ref.n) return null;
  const sec = tm[1];
  const part = a ? (a[3] ?? a[4] ?? a[5]) : b[3];
  if (sec) ref.section = sec.toUpperCase();
  if (part) ref.part = part;
  // Številka naloge ni številka pole (»naloga 2 pola 1«, »pola 1. naloga 5«).
  s = `${s.slice(0, tm.index)} # ${s.slice(tm.index + tm[0].length)}`;
  if (/\bpoklicn/.test(s)) ref.exam = "POKLICNA";
  else if (/\bmatur/.test(s)) ref.exam = "MATURA";
  else {
    const g = s.match(/\bnpz\s*-?\s*(?:za\s*)?([69])(?!\d)/) || s.match(/\b([69])\s*\.?\s*(?:r\b|razred)/);
    ref.exam = g ? `NPZ${g[1]}` : "NPZ";
  }
  if (/\b(mat|matematik\w*|matek\w*)\b/.test(s)) ref.subject = "MAT";
  else if (/\b(fiz|fizik\w*)\b/.test(s)) ref.subject = "FIZ";
  else if (/\b(kem|kemij\w*)\b/.test(s)) ref.subject = "KEM";
  else if (/\b(bio|biologij\w*)\b/.test(s)) ref.subject = "BIO";
  if (/\b(vr|visj\w*)\b/.test(s)) ref.level = "VR";
  else if (/\b(or|osnovn\w* rav\w*|osnovn\w*)\b/.test(s) && !/\bosnovn\w* sol/.test(s)) ref.level = "OR";
  const y = s.match(/\b(20[0-4]\d)\b/);
  if (y) ref.year = Number(y[1]);
  if (/\bspomlad/.test(s)) ref.term = "spomladanski";
  else if (/\bjesen/.test(s)) ref.term = "jesenski";
  else if (/\bzimsk/.test(s)) ref.term = "zimski";
  else if (/\bnaknadn/.test(s)) ref.term = "naknadni";
  else if (/\bredn/.test(s)) ref.term = "redni";
  const p = s.match(/\bpol[aiou]?\s*(?:st\.?\s*)?([12])(?!\d)/) || s.match(/\b([12])\s*\.?\s*(?:izpitn\w* )?pol[aiou]?\b/);
  if (p) ref.pola = Number(p[1]);
  else if (/\bprv\w* (?:izpitn\w* )?pol[aiou]?\b/.test(s)) ref.pola = 1;
  else if (/\bdrug\w* (?:izpitn\w* )?pol[aiou]?\b/.test(s)) ref.pola = 2;
  const d = s.match(/\b(?:del|delu|dela)\s*([abc])\b/) || s.match(/\b([abc])\s*del\b/);
  if (d && !ref.section) ref.section = d[1].toUpperCase();
  return ref;
}

// Kaj manjka: { ask: "exam"|"subject"|"level"|"year", options: [{ value, add }] } (add: besedilo, ki ga gumb doda
// k učenčevemu sporočilu), { entry } (najdena pola) ali { none: true } (pole ni v katalogu).
const SUBJECT_WORD = { MAT: "matematika", FIZ: "fizika", KEM: "kemija", BIO: "biologija" };
const MAIN_TERM = ["spomladanski", "redni"];
export function resolvePaper(ref, papers) {
  if (!ref) return { none: true };
  let c = (papers || []).filter((e) => (ref.exam === "NPZ" ? /^NPZ/.test(e.exam) : e.exam === ref.exam));
  if (ref.exam === "NPZ") {
    const exams = [...new Set(c.map((e) => e.exam))].sort();
    if (exams.length > 1) return { ask: "exam", options: exams.map((x) => ({ value: x, add: x.replace("NPZ", "NPZ ") })) };
  }
  if (ref.subject) c = c.filter((e) => e.subject === ref.subject);
  else {
    const subs = [...new Set(c.map((e) => e.subject))];
    if (subs.length > 1) return { ask: "subject", options: subs.map((x) => ({ value: x, add: SUBJECT_WORD[x] || x })) };
  }
  if (c.some((e) => e.level)) {
    if (ref.level) c = c.filter((e) => e.level === ref.level);
    else return { ask: "level", options: [{ value: "OR", add: "osnovna raven" }, { value: "VR", add: "višja raven" }] };
  }
  if (ref.year) c = c.filter((e) => e.year === ref.year);
  else {
    // Najprej leta z našo polo (od najnovejšega), nato ostala; največ 4 gumbi.
    const years = [...new Set(c.map((e) => e.year))].sort((a, b) => b - a);
    const withOurs = years.filter((y) => c.some((e) => e.year === y && e.ours));
    const pick = [...withOurs, ...years.filter((y) => !withOurs.includes(y))].slice(0, 4);
    if (years.length > 1) return { ask: "year", options: pick.map((y) => ({ value: y, add: String(y) })) };
  }
  if (ref.term) c = c.filter((e) => e.term === ref.term);
  else if (c.some((e) => MAIN_TERM.includes(e.term))) c = c.filter((e) => MAIN_TERM.includes(e.term));
  // Več rokov istega dne (jesenski rok 1 in 2): prvi.
  c.sort((a, b) => (a.session || 0) - (b.session || 0));
  return c.length ? { entry: c[0] } : { none: true };
}

// Naloge naše pole s to številko (pola in del le, kadar ju pola ima). Več zadetkov: { ask: "pola"|"section", options }.
export function findPaperTask(paper, ref) {
  const tasks = paper?.tasks || [];
  const hasPola = tasks.some((tk) => tk.pola);
  const hasSection = tasks.some((tk) => tk.section);
  const hits = tasks.filter((tk) => tk.n === ref.n && (!hasPola || !ref.pola || tk.pola === ref.pola) && (!hasSection || !ref.section || tk.section === ref.section));
  if (!hits.length) return { missing: true };
  if (hits.length > 1) {
    const polas = [...new Set(hits.map((tk) => tk.pola))];
    if (polas.length > 1) return { ask: "pola", options: polas.map((p) => ({ value: p, add: `pola ${p}` })) };
    return { ask: "section", options: hits.map((tk) => ({ value: tk.section, add: `del ${tk.section}` })) };
  }
  const task = hits[0];
  const part = ref.part ? task.parts.find((p) => p.id === ref.part) : null;
  return { task, part };
}

// Povezave na izvirnik (ric.si): pri maturi pola 1 ali 2, sicer preizkus znanja; navodila za ocenjevanje nikoli
// (v njih je rešitev).
export function originalFiles(entry, pola = null) {
  const files = (entry?.files || []).filter((f) => f.kind !== "scoring");
  const one = pola ? files.filter((f) => f.kind === `paper${pola}`) : [];
  return one.length ? one : files;
}

// Ime datoteke, ki jo ric.si da ob prenosu (iz povezave »…/mma/M241-401-1-1.pdf/…« → »M241-401-1-1.pdf«), da učenec
// ve, katero datoteko izbere; izbrano ime primerjamo s kodo pole (»M241-401-1-1 (1).pdf« šteje). Pri starih polah
// se povezava in ime razlikujeta: »n111-401mat-2-1« → »N111-401-2-1.pdf«, »m042-c101…« → »P042-C101-….pdf«,
// »M212-421-2-2_novo_« → »M212-421-2-2 novo .pdf«: kratica predmeta in »novo« ne štejeta, prva črka tudi ne.
const RIC_CODE = /^([a-z])(\d{3})-([a-z]?\d{3})(?:mat|bio|fiz|kem)?-?(\d+(?:-\d+){0,2})/;
export function ricFileName(url) {
  const m = String(url || "").match(/\/mma\/([^/?#]+?)(?:[.-]pdf)?\//i);
  if (!m) return "";
  const c = m[1].match(new RegExp(RIC_CODE.source, "i"));
  return c ? `${c[1]}${c[2]}-${c[3]}-${c[4]}.pdf` : `${m[1]}.pdf`;
}
const code = (name) => {
  const c = low(name).match(RIC_CODE);
  return c ? `${c[2]}${c[3]}${c[4]}`.replace(/[^a-z0-9]/g, "") : "";
};
// Ime je ime neke pole RIC (za opozorilo »to je druga pola«; preimenovana datoteka ni).
export const looksLikeRicFile = (fileName) => !!code(fileName);
export function fileMatches(fileName, url) {
  const want = code(ricFileName(url));
  return !!want && code(fileName) === want;
}
