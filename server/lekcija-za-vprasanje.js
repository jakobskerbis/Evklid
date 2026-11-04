// Lokalno iskanje lekcije za vprašanje v prostem pogovoru (optimizator 2026-11-04, »local lesson search«).
// Pri prvem vprašanju prostega pogovora poiščemo lekcijo iz našega učbenika, ki se z vprašanjem najbolj
// ujema (le predmet in raven učenca, do njegovega razreda), in inštruktorju damo njen povzetek kot skrito
// opombo v prvem sporočilu. Tako razlaga z istimi oznakami in postopki kot učbenik in lahko učenca nanj
// napoti. Brez klica modela in brez zunanjih storitev: iskanje po besedah s težo redkosti (IDF).
// Opomba je del shranjenega sporočila, zato se začetek zgodovine ne spreminja (predpomnilnik ostane).
import { listPaths, topicOrder } from "./curriculum.js";
import { loadLesson, expandFormulaBlocks } from "./textbook.js";

export const LESSON_TAG = "lekcija_ucbenika";
export const LESSON_NOTE_HEAD = `<${LESSON_TAG}>`;
// Privzeto izklopljeno, dokler j ne pregleda (opomba inštruktorju je sprememba tega, kar mu rečemo:
// docs/spremembe-prompta.md). Vklop: EVKLID_LESSON_SEARCH=1.
export const lessonSearchOn = () => process.env.EVKLID_LESSON_SEARCH === "1";

const fold = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Pogoste besede vprašanj, ki ne povedo nič o snovi.
const STOP = new Set(
  `kako kaj kje zakaj koliko kdaj kateri katera katero katere kateri kdo cemu
  ali ampak tudi samo zelo malo vec manj prav lahko mora moram moras moramo mogoce
  sem smo ste jaz ti mi vi on ona ono oni nas vas njih mene tebe meni tebi sebe svoj svoja svoje
  bil bila bilo bili bo bom bos bomo bodo bi naj ker ce da pa ter in ne niti se ze sele
  tega temu tem tej ta ti to te tisto tista tisti ena eno en dva dve tri
  za na pri po od do iz ob pod nad med pred brez cez skozi proti okoli glede
  prosim pomagaj pomoc pomagas razlozi razlozis razlozite resi resis resite izracunaj izracunam
  naloga nalogo naloge nalogi nalog primer primera primeru vprasanje odgovor rezultat
  ne razumem razumes vem ves znam znas rabim hocem imam imas dobim dobis
  kaksen kaksna kaksno kaksni dela delam naredi naredim napisi pokazi povej povejte
  zacnem zacnes zacni zacnemo nadaljujem
  napisi napisem napises narisi narisem narises poglej preveri pojasni pojasnis
  potem zdaj sedaj vedno nikoli spet tako taka tak tudi kot kakor
  test testu kontrolna jutri danes sola soli ucitelj uciteljica`.split(/\s+/),
);

// Kratke besede, ki so pojmi.
const SHORT = new Set(["ph"]);
// Grobo krnjenje: slovenske končnice odpadejo tako, da primerjamo začetek besede.
const stem = (w) => w.replace(/(?<=...)[aeiou]$/, "").slice(0, 5);
export function terms(text) {
  const out = [];
  for (const w of fold(text).split(/[^a-z]+/)) if ((w.length >= 3 || SHORT.has(w)) && !STOP.has(w)) out.push(stem(w));
  return out;
}

const SCHOOL_RANK = { OS: 0, SS: 1 };
function levelOf(settings) {
  const school = settings?.educational_track === "SREDNJA_SOLA" ? "SS" : settings?.educational_track === "OSNOVNA_SOLA" || !settings?.educational_track ? "OS" : null;
  const grade = Number((String(settings?.curriculum_level || "").match(/([1-9])/) || [])[1]) || (school === "SS" ? 4 : 9);
  return school ? { school, grade } : null;
}

const summaryOf = (lesson) => lesson?.sections?.find((s) => /^povzetek/i.test(s.title))?.md || "";

// Kazalo tem za predmet in raven: krni naslova, ciljev in (kjer je lekcija s »Povzetkom«) besedila.
// Teme brez lekcije so v kazalu tudi, da vprašanje o njih ne dobi sosednje lekcije z eno skupno besedo.
const indexes = new Map();
function indexFor(subject, school, grade) {
  const key = `${subject}|${school}|${grade}`;
  if (indexes.has(key)) return indexes.get(key);
  const docs = [];
  for (const p of listPaths(subject)) {
    if (!(p.school in SCHOOL_RANK)) continue; // brez tekmovalnih poti
    const below = SCHOOL_RANK[p.school] < SCHOOL_RANK[school] || (p.school === school && p.grade <= grade);
    if (!below) continue;
    for (const t of topicOrder(p.key)) {
      const lesson = loadLesson(t.id);
      const has = !!summaryOf(lesson);
      docs.push({
        id: t.id,
        name: t.name,
        path: p.key,
        pathLabel: p.label,
        has,
        title: new Set(terms(t.name)),
        meta: new Set(terms(`${t.goals || ""} ${t.unit || ""}`)),
        body: new Set(has ? terms(lesson.sections.map((s) => `${s.title} ${s.md}`).join(" ")) : []),
      });
    }
  }
  const df = new Map();
  for (const d of docs) for (const w of new Set([...d.title, ...d.meta, ...d.body])) df.set(w, (df.get(w) || 0) + 1);
  const idf = (w) => Math.log(1 + docs.length / (df.get(w) || 0.5));
  const idx = { docs, idf };
  if (indexes.size > 200) indexes.clear();
  indexes.set(key, idx);
  return idx;
}

// Najmanjša ocena in prednost pred drugo lekcijo; umerjeno na vzorčnih vprašanjih (test/lekcija-za-vprasanje.test.js).
// Vsaj ena beseda vprašanja mora biti v naslovu lekcije, sicer je ujemanje preveč ohlapno.
const MIN_SCORE = 4.5;
const MIN_LEAD = 1.2;

/**
 * Lekcija, ki se z vprašanjem dovolj jasno ujema, ali null.
 * @returns {{id, name, path, pathLabel, summary, score} | null}
 */
export function lessonForQuestion(text, settings) {
  if (!lessonSearchOn()) return null;
  const scored = rankLessons(text, settings);
  const [best, second] = scored;
  if (!best || !best.d.has || !best.inTitle || best.score < MIN_SCORE) return null;
  // Bližnja druga lekcija je v redu le, če vprašanje pokrije ves naslov prve (»Pitagorov izrek«, »Logaritem«).
  const whole = best.inTitle === best.d.title.size;
  if (second && !whole && best.score < second.score * MIN_LEAD) return null;
  // Ena sama beseda iz večbesednega naslova je preohlapna (»kocka« pri metu kocke → »Kocka in kvader«,
  // »koren enačbe« → »Kvadratni koren«, »geometrijsko« → »Osnovni geometrijski pojmi«).
  if (!whole && best.inTitle === 1) return null;
  // Povzetek beremo sproti (loadLesson ima predpomnilnik po času spremembe), da velja popravljena lekcija.
  const { id, name, path, pathLabel } = best.d;
  const summary = summaryOf(loadLesson(id));
  if (!summary) return null;
  return { id, name, path, pathLabel, summary, score: Math.round(best.score * 10) / 10 };
}

// Vse lekcije z oceno, od najboljše (za lessonForQuestion in umerjanje).
export function rankLessons(text, settings) {
  const lvl = levelOf(settings);
  if (!lvl || !settings?.subject || (settings.school_system && settings.school_system !== "SI")) return [];
  const q = [...new Set(terms(text))];
  if (!q.length) return [];
  const { docs, idf } = indexFor(settings.subject, lvl.school, lvl.grade);
  const byName = new Map();
  for (const d of docs) {
    let score = 0;
    let inTitle = 0;
    for (const w of q) {
      if (d.title.has(w)) inTitle++;
      score += idf(w) * (d.title.has(w) ? 3 : d.meta.has(w) ? 2 : d.body.has(w) ? 0.6 : 0);
    }
    if (!score) continue;
    // Naslov, ki ga vprašanje pokrije v celoti (»Pitagorov izrek«), pred širšim (»Uporaba Pitagorovega izreka«).
    if (inTitle) score += 3 * (inTitle / d.title.size);
    // Prednost lekciji učenčeve šole (srednješolec dobi lekcijo OŠ le, če SŠ nima ustrezne) in razreda.
    if (d.path.includes(`-${lvl.school}-`)) score += 2;
    if (d.path.endsWith(`-${lvl.school}-${lvl.grade}`)) score += 0.5;
    // Ista tema na več ravneh (Newtonovi zakoni v OŠ in SŠ): ostane tista z boljšo oceno.
    const key = fold(d.name);
    if (!byName.has(key) || byName.get(key).score < score) byName.set(key, { d, score, inTitle });
  }
  return [...byName.values()].sort((a, b) => b.score - a.score);
}

// Skrita opomba za inštruktorja (kot opomba pole): povzetek lekcije in kje jo učenec najde.
export function lessonNote(hit) {
  if (!hit) return "";
  const summary = expandFormulaBlocks(hit.summary, "plain").replace(/\n{3,}/g, "\n\n").trim().slice(0, 1200);
  return [
    LESSON_NOTE_HEAD,
    `The app's textbook (Učbenik) has a lesson that probably matches this question: »${hit.name}« (${hit.pathLabel}). Its summary:`,
    summary,
    "Background only: if it matches the question, use the same notation and terms as the lesson. If the student or their task uses another method, follow the student. Keep your usual step-by-step pace and do not give formulas or the answer before the student tries. If the question is about something else, ignore this note. You may suggest that the student opens this lesson in Učbenik; never mention this note itself.",
    `</${LESSON_TAG}>`,
  ].join("\n");
}
