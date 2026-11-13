// Izbira šole po korakih: OŠ → razred, SŠ → letnik → raven matematike,
// fakulteta → univerza → fakulteta → študijski program → letnik.
// Izbira se zapiše v skrita polja obrazca (educational_track, study_program,
// curriculum_level), zato jo obrazci berejo kot prej.

import { t } from "./i18n.js";
import { imaStopnjo, jeOs, jeSs, jeFaks } from "./stopnja.js";
import { SCHOOL_SYSTEMS, isRegional, gradesOf, gradeInfo, trackForLevel } from "./regions.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const TRACKS = [
  ["OSNOVNA_SOLA", t("lp.os"), t("lp.osSub")],
  ["SREDNJA_SOLA", t("lp.ss"), t("lp.ssSub")],
  ["UNIVERZA", t("lp.uni"), t("lp.uniLevel")],
];
const OS_GRADES = ["1. razred", "2. razred", "3. razred", "4. razred", "5. razred", "6. razred", "7. razred", "8. razred", "9. razred"];
const SS_YEARS = ["1. letnik", "2. letnik", "3. letnik", "4. letnik"];
const SS_LEVELS = [
  ["OR", t("lp.or"), t("lp.orSub")],
  ["VR", t("lp.vr"), t("lp.vrSub")],
];
const UNI_YEARS = ["1. letnik", "2. letnik", "3. letnik", "4. letnik"];

// Regijski šolski sistem (public/regions.js): stopnja → razred z imeni tega sistema.
function regionFromSettings(s, sys) {
  const g = gradeInfo(sys, s.curriculum_level);
  return { sys, stage: g?.stage || "", grade: g?.label || "" };
}
function regionSteps(v) {
  const stages = SCHOOL_SYSTEMS[v.sys].stages;
  const out = [["stage", t("lp.qStage"), stages.map(([name, grades]) => [name, name, grades.map((x) => x[0]).join(", ")]), v.stage]];
  const stage = stages.find(([name]) => name === v.stage);
  if (stage) out.push(["grade", t("lp.qGrade"), stage[1].map(([label]) => [label, label]), v.grade]);
  return out;
}
function regionToSettings(v) {
  const g = v.grade && gradeInfo(v.sys, v.grade);
  return g ? { school_system: v.sys, educational_track: trackForLevel(g.level), study_program: "", curriculum_level: g.label } : null;
}

// Iz shranjenih nastavitev sestavi korake izbire.
function fromSettings(s, programs) {
  if (isRegional(s.school_system)) return regionFromSettings(s, s.school_system);
  const v = { track: s.educational_track || "" };
  const level = String(s.curriculum_level || "");
  if (v.track === "OSNOVNA_SOLA") v.grade = OS_GRADES.find((g) => level.startsWith(g.slice(0, 2))) || "";
  if (v.track === "SREDNJA_SOLA") {
    v.year = SS_YEARS.find((y) => level.startsWith(y[0])) || "";
    v.ssLevel = /VR/.test(level) ? "VR" : /OR/.test(level) ? "OR" : "";
  }
  if (v.track === "UNIVERZA") {
    const p = programs.find((x) => x.id === s.study_program);
    if (p) Object.assign(v, { uni: p.university, faculty: p.faculty, program: p.id });
    v.year = UNI_YEARS.find((y) => level.startsWith(y[0])) || "";
  }
  return v;
}

// Nastavitve iz izbire (ali null, dokler izbira ni končana).
function toSettings(v) {
  if (v.sys) return regionToSettings(v);
  if (v.track === "OSNOVNA_SOLA" && v.grade) return { educational_track: v.track, study_program: "", curriculum_level: v.grade };
  if (v.track === "SREDNJA_SOLA" && v.year && v.ssLevel) return { educational_track: v.track, study_program: "", curriculum_level: `${v.year} ${v.ssLevel}` };
  if (v.track === "UNIVERZA" && v.program && v.year) return { educational_track: v.track, study_program: v.program, curriculum_level: v.year };
  return null;
}

// Vrstni red korakov za trenutno izbiro: [ključ, vprašanje, možnosti [vrednost, oznaka, opis], izbrana oznaka].
function steps(v, programs) {
  if (v.sys) return regionSteps(v);
  const out = [["track", t("lp.qTrack"), TRACKS, TRACKS.find((t) => t[0] === v.track)?.[1]]];
  if (v.track === "OSNOVNA_SOLA") out.push(["grade", t("lp.qGrade"), OS_GRADES.map((g) => [g, levelLabel(g)]), v.grade && levelLabel(v.grade)]);
  if (v.track === "SREDNJA_SOLA") {
    out.push(["year", t("lp.qYear"), SS_YEARS.map((y) => [y, levelLabel(y)]), v.year && levelLabel(v.year)]);
    if (v.year) out.push(["ssLevel", t("lp.qLevel"), SS_LEVELS, SS_LEVELS.find((l) => l[0] === v.ssLevel)?.[1]]);
  }
  if (v.track === "UNIVERZA") {
    const unis = [...new Map(programs.map((p) => [p.university, p.universityName])).entries()];
    out.push(["uni", t("lp.qUni"), unis.map(([k, n]) => [k, k, n]), unis.find(([k]) => k === v.uni)?.[0]]);
    if (v.uni) {
      const facs = [...new Map(programs.filter((p) => p.university === v.uni).map((p) => [p.faculty, p])).values()];
      const fac = facs.find((p) => p.faculty === v.faculty);
      out.push(["faculty", t("lp.qFaculty"), facs.map((p) => [p.faculty, p.facultyShort.replace(`${v.uni} `, ""), p.facultyName.replace(/^U[A-Z]+ /, "")]), fac?.facultyShort.replace(`${v.uni} `, "")]);
    }
    if (v.faculty) {
      const progs = programs.filter((p) => p.faculty === v.faculty);
      out.push(["program", t("lp.qProgram"), progs.map((p) => [p.id, p.name, t(p.degree === "EMŠ" ? "lp.emsSub" : "lp.uniSub")]), progs.find((p) => p.id === v.program)?.name]);
    }
    if (v.program) {
      const p = programs.find((x) => x.id === v.program);
      const years = UNI_YEARS.slice(0, p?.years || 3);
      out.push(["year", t("lp.qYear"), years.map((y) => [y, levelLabel(y)]), v.year && levelLabel(v.year)]);
    }
  }
  return out;
}

// Ključi, ki jih sprememba koraka izniči (vse za njim).
const AFTER = {
  track: ["grade", "year", "ssLevel", "uni", "faculty", "program"],
  uni: ["faculty", "program", "year"],
  faculty: ["program", "year"],
  program: ["year"],
  year: ["ssLevel"],
  stage: ["grade"],
};

// Namesti izbirnik v element `box` znotraj obrazca `form`.
// onChange(settings|null, track) se kliče ob vsaki spremembi.
export function mountLevelPicker(box, form, { programs, settings = {}, onChange = () => {} }) {
  let v = fromSettings(settings, programs);
  let open = toSettings(v) ? null : steps(v, programs).find((s) => !s[3])?.[0] || "track";

  const write = () => {
    const s = toSettings(v) || { educational_track: v.track || "", study_program: "", curriculum_level: "" };
    s.school_system = v.sys || "SI";
    for (const [k, val] of Object.entries(s)) if (form[k]) form[k].value = val;
    onChange(toSettings(v), v.track);
  };

  const render = () => {
    const list = steps(v, programs);
    const done = list.filter((s) => s[3] && s[0] !== open);
    const current = list.find((s) => s[0] === open) || list.find((s) => !s[3]);
    box.innerHTML = `
      <div class="lp-crumbs">${done
        .map(([k, , , label]) => `<button type="button" class="lp-crumb" data-step="${k}" title="${t("common.change")}">${esc(label)}</button>`)
        .join(`<span class="lp-sep" aria-hidden="true">›</span>`)}${
        !current && done.length ? `<button type="button" class="text-btn lp-change" data-step="track">${t("common.change")}</button>` : ""
      }</div>
      ${
        current
          ? `<p class="lp-q">${esc(current[1])}</p>
        <div class="lp-options">${current[2]
          .map(([val, label, sub]) => `<button type="button" class="choice lp-opt ${val === v[current[0]] ? "on" : ""}" data-key="${current[0]}" data-val="${esc(val)}">
              <span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ""}</button>`)
          .join("")}</div>`
          : ""
      }`;
    box.querySelectorAll("[data-step]").forEach((b) =>
      b.addEventListener("click", () => {
        open = b.dataset.step;
        render();
      }),
    );
    box.querySelectorAll(".lp-opt").forEach((b) =>
      b.addEventListener("click", () => {
        const { key, val } = b.dataset;
        if (v[key] !== val) for (const k of AFTER[key] || []) delete v[k];
        v[key] = val;
        const next = steps(v, programs).find((s) => !s[3]);
        open = next ? next[0] : null;
        write();
        render();
      }),
    );
  };
  write();
  render();
  return {
    // Ponovno nastavi iz nastavitev profila (npr. ob menjavi učenca).
    set(s) {
      v = fromSettings(s, programs);
      open = toSettings(v) ? null : steps(v, programs).find((x) => !x[3])?.[0] || "track";
      write();
      render();
    },
    complete: () => !!toSettings(v),
    // Zamenjava šolskega sistema (Slovenija ali država): izbira razreda se začne znova.
    setSystem(sys) {
      v = isRegional(sys) ? { sys, stage: "", grade: "" } : { track: "" };
      const list = steps(v, programs);
      // Sistem z eno samo stopnjo: takoj izbira razreda.
      if (v.sys && SCHOOL_SYSTEMS[sys].stages.length === 1) v.stage = SCHOOL_SYSTEMS[sys].stages[0][0];
      open = steps(v, programs).find((x) => !x[3])?.[0] || list[0][0];
      write();
      render();
    },
  };
}

// <option> za šolske sisteme: najprej Slovenija, nato države po imenu, mednarodni na koncu.
export function schoolSystemOptions(selected = "SI") {
  const ids = Object.keys(SCHOOL_SYSTEMS).sort((a, b) => {
    const rank = (id) => (id === "SI" ? 0 : id === "INTL" ? 2 : 1);
    return rank(a) - rank(b) || SCHOOL_SYSTEMS[a].name.localeCompare(SCHOOL_SYSTEMS[b].name, "en");
  });
  return ids.map((id) => `<option value="${id}" ${id === selected ? "selected" : ""}>${esc(SCHOOL_SYSTEMS[id].name)}</option>`).join("");
}

// Prikaz ravni v izbranem jeziku: »8. razred« → »Grade 8«, »2. letnik VR« → »Year 2 VR«. Shranjena vrednost ostane slovenska.
export function levelLabel(level) {
  const m = /^(\d+)\. (razred|letnik)(.*)$/.exec(String(level || ""));
  if (!m) return String(level || "");
  return t(m[2] === "razred" ? "lp.grade" : "path.year", { n: m[1] }) + m[3];
}

/**
 * Razredi ali letniki iste šole za hitro menjavo (glava Inštruktorja): [{ settings, label, current }].
 * Ostane ista vrsta šole, program in raven matematike (SŠ); regijski sistem: razredi iste stopnje.
 */
export function levelChoices(s = {}) {
  const level = String(s.curriculum_level || "");
  if (isRegional(s.school_system)) {
    const g = gradeInfo(s.school_system, level);
    const stage = SCHOOL_SYSTEMS[s.school_system].stages.find(([name]) => name === g?.stage);
    return (stage?.[1] || []).map(([label]) => ({ settings: regionToSettings({ sys: s.school_system, grade: label }), label, current: label === g?.label })).filter((x) => x.settings);
  }
  const make = (curriculum_level) => ({ settings: { educational_track: s.educational_track, study_program: s.study_program || "", curriculum_level }, label: levelLabel(curriculum_level), current: curriculum_level === level });
  if (!imaStopnjo(s)) return [];
  if (jeOs(s)) return OS_GRADES.map(make);
  if (jeSs(s)) {
    const rest = level.replace(/^\d+\. letnik/, ""); // » OR« / » VR«
    return SS_YEARS.map((y) => make(y + rest));
  }
  if (jeFaks(s)) return UNI_YEARS.map(make);
  return [];
}
