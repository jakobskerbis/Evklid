// »Kaj še ne znam« (P1-8, 2. del; načrt treh prioritet, j 25. 11. 2026: na vrhu Napredka). Šibke teme iz vseh virov
// (server/weaknesses.js, GET /api/students/:id/vrzeli) z dokazom, koliko napak in kje, ter z gumboma »Vadi« (naloga iz
// Vadnice: ustvari jo generator, preveri koda, rezultat gre nazaj v šibke točke) in »Ponovi lekcijo«. Ročno vnesene
// šibke točke ostanejo kot oznake v #weak-list. Nadomesti prejšnji seznam samodejnih šibkih tem v public/app.js
// (loadProgress), ki je kazal le ime teme.
import { t } from "./i18n-osnova.js";
import { icon } from "./icons.js";
import { $, api, escapeHtml, openLesson, setBack } from "./app.js";
import { openTopic, nextPractice } from "./vadnica.js";

// Slogi samo za ta seznam: vstavijo se ob prvem izrisu (brez nove datoteke CSS pred prvim izrisom aplikacije).
const SLOG = `
.vrzeli { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 10px; }
.vrzel { border: 1.5px solid var(--border, #dde2ea); border-left: 4px solid var(--danger); border-radius: 12px; padding: 10px 12px; }
.vrzel-ime { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; overflow-wrap: anywhere; }
.vrzel-dokaz { margin: 4px 0 0; }
.vrzel-gumbi { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.vrzel-prazno { border: 0; padding: 0; }
.vrzeli-card #weak-list { margin-top: 10px; }`;
const slog = () => document.getElementById("vrzeli-slog") || document.head.append(Object.assign(document.createElement("style"), { id: "vrzeli-slog", textContent: SLOG }));

const VIRI = ["chat", "practice", "game", "lesson", "paper", "cards", "kviz", "scan", "lab", "atlas"];
let zadnji = 0; // ob hitrem preklopu profila nariše samo zadnji klic

// Kje so bile napake: »največ pri vajah in v klepetu« (največ dva vira, od največ napak).
export function kjeBesedilo(viri = []) {
  const deli = viri.filter((v) => VIRI.includes(v)).slice(0, 2).map((v) => t(`vr.vir.${v}`));
  return deli.length ? t("vr.kje", { kje: deli.join(t("vr.in")) }) : "";
}

export function vrzelHtml(w) {
  const dokaz = [t("vr.napake", { n: w.errors, m: w.turns }), kjeBesedilo(w.viri)].filter(Boolean).join(" · ");
  const gumbi = [
    w.vaja ? `<button type="button" class="primary small" data-vr-vaja="${escapeHtml(w.topic_id)}">${icon("pencil")}<span>${escapeHtml(t("vr.vadi"))}</span></button>` : "",
    w.lekcija ? `<button type="button" class="secondary small" data-vr-lekcija="${escapeHtml(w.topic_id)}">${icon("book-open")}<span>${escapeHtml(t("vr.lekcija"))}</span></button>` : "",
  ].join("");
  return `<li class="vrzel"><div class="vrzel-ime"><b dir="auto">${escapeHtml(w.topic)}</b>${w.subject ? ` <span class="muted small">${escapeHtml(w.subject)}</span>` : ""}</div>
    <p class="muted small vrzel-dokaz">${escapeHtml(dokaz)}</p>${gumbi ? `<div class="vrzel-gumbi">${gumbi}</div>` : ""}</li>`;
}

// Nariše seznam nad #weak-list (ročne oznake ostanejo tam). Vrne podatke ali null, če strežnik ni odgovoril.
export async function narisiVrzeli(sid) {
  const seznam = $("#weak-list");
  if (!seznam || !sid) return null;
  slog();
  let ol = $("#vrzeli");
  if (!ol) {
    ol = document.createElement("ol");
    ol.id = "vrzeli";
    ol.className = "vrzeli";
    ol.addEventListener("click", klik);
    seznam.before(ol);
  }
  const moj = ++zadnji;
  const d = await api(`/api/students/${sid}/vrzeli`).catch(() => null);
  if (moj !== zadnji) return null;
  if (!d) {
    ol.innerHTML = "";
    return null;
  }
  ol.innerHTML = d.teme.map(vrzelHtml).join("");
  seznam.innerHTML = d.rocne.map((w) => `<li>${escapeHtml(w)}</li>`).join("");
  seznam.hidden = !d.rocne.length;
  if (!d.teme.length && !d.rocne.length) ol.innerHTML = `<li class="vrzel-prazno muted">${escapeHtml(t("vr.prazno"))}</li>`;
  return d;
}

function klik(e) {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.vrLekcija) return openLesson(b.dataset.vrLekcija);
  const id = b.dataset.vrVaja;
  if (!id) return;
  // Kot »Preveri se« v laboratoriju in »Podobna naloga« v pogovoru: odpre temo in začne vajo (pri novi temi najprej
  // test predznanja). »Nazaj« vodi na Učno pot.
  setBack("path");
  openTopic(id)
    .then((x) => !x && $("#t-practice") && nextPractice())
    .catch(() => {});
}
