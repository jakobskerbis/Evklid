// Uvodni ogled (iz public/app.js; naloži se šele, ko se ogled začne). app.js odloči, kdaj (maybeTour, »Ponovi uvodni ogled«).

// Vodič ob prvi uporabi (j, 29. 10. 2026): kako aplikacija deluje in kje je kaj. Vsak profil ga
// vidi enkrat (settings.tour_version na strežniku, zato tudi na drugi napravi ne znova).
// Korak brez »sel« je kartica na sredini; korak, katerega gumb ni viden (npr. zavihki, ki so na
// telefonu pod »Jaz«), se preskoči.
import { t } from "./i18n.js";
import { zadrziFokus } from "./fokus-okna.js";

const TOUR = [
  { title: "tour.welcome", text: "tour.welcomeText" },
  { title: "tour.how", text: "tour.howText" },
  { sel: "#xp-card", title: "daily.title", text: "tour.dailyText" },
  { sel: "#path-content .unit", title: "nav.path", text: "tour.pathText" },
  { sel: "#modebar", title: "tour.modes", text: "tour.modesText" },
  { sel: '.tab[data-view="uci"]', title: "nav.learn", text: "tour.learnText" },
  { sel: '.tab[data-view="chat"]', title: "nav.chat", text: "tour.chatText" },
  { sel: '.tab[data-view="graph"]', title: "nav.graph", text: "tour.graphText" },
  { sel: '.tab[data-view="competition"]', title: "nav.competition", text: "tour.competitionText" },
  { sel: '.tab[data-view="games"]', title: "nav.games", text: "tour.gamesText" },
  { sel: '.tab[data-view="schedule"]', title: "sch.title", text: "tour.scheduleText" },
  { sel: '.tab[data-view="corner"]', title: "nav.corner", text: "tour.cornerText" },
  { sel: '.tab[data-view="progress"]', title: "nav.progress", text: "tour.progressText" },
  { sel: '.tab[data-view="league"]', title: "nav.league", text: "tour.leagueText" },
  { sel: '.tab[data-view="settings"]', title: "nav.settings", text: "tour.settingsText" },
  { sel: '.tab[data-view="feedback"]', title: "nav.feedback", text: "tour.feedbackText" },
  { sel: '.tab[data-view="me"]', title: "nav.me", text: "tour.meText2" },
  { sel: "#profile-btn", title: "tour.profile", text: "tour.profileText" },
  { title: "tour.end", text: "tour.endText" },
];
// Prvi ogled ima samo tri korake (j, 15. 11. 2026): Današnji trening, Inštruktor, Jaz (na računalniku
// meni profila z nastavitvami). Ves ogled ostane v Nastavitvah (»Ponovi uvodni ogled«).
// Seznam v koraku: prvi viden element (spodnja vrstica na telefonu ali zgornji zavihek).
const TOUR_SHORT = [
  { sel: "#xp-card", title: "daily.title", text: "tour.dailyText" },
  { sel: '.tab[data-view="chat"]', title: "nav.chat", text: "tour.chatText" },
  [
    { sel: '.tab[data-view="me"]', title: "nav.me", text: "tour.meText2" },
    { sel: "#profile-btn", title: "tour.profile", text: "tour.profileText" },
  ],
];
const TOUR_KEY = "evklid.tour";
const visibleEl = (sel) => [...document.querySelectorAll(sel)].find((el) => el.getClientRects().length && !el.closest("[hidden]"));

export function startTour({ full = false } = {}, { state, api, setEnd, TOUR_VERSION }) {
  const box = document.querySelector("#tour");
  if (!box.hidden) return; // že odprt (npr. »Ponovi ogled« med ogledom)
  // Koraki, ki jih na tem zaslonu lahko pokažemo (števec »3 / 12« potem drži).
  const list = full ? TOUR : TOUR_SHORT.map((s) => (Array.isArray(s) ? s.find((o) => visibleEl(o.sel)) : s)).filter(Boolean);
  const steps = list.filter((s) => !s.sel || visibleEl(s.sel));
  let i = 0;
  const spot = box.querySelector(".tour-spot");
  const card = box.querySelector(".tour-card");
  const show = () => {
    const step = steps[i];
    const target = step.sel && visibleEl(step.sel);
    if (step.sel && !target) return next();
    card.classList.toggle("center", !target);
    if (target) {
      target.scrollIntoView({ block: "nearest" });
      const r = target.getBoundingClientRect();
      const pad = 6;
      const h = Math.min(r.height, innerHeight * 0.5);
      Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + 2 * pad}px`, height: `${h + 2 * pad}px` });
      const below = r.top + h / 2 < innerHeight / 2;
      card.style.top = below ? `${Math.min(r.top + h + 16, innerHeight - 240)}px` : "auto";
      card.style.bottom = below ? "auto" : `${Math.max(innerHeight - r.top + 16, 16)}px`;
    } else {
      Object.assign(spot.style, { left: "50%", top: "50%", width: "0px", height: "0px" });
      card.style.top = "";
      card.style.bottom = "";
    }
    box.querySelector(".tour-step").textContent = `${i + 1} / ${steps.length}`;
    box.querySelector("#tour-title").textContent = t(step.title);
    box.querySelector(".tour-text").textContent = t(step.text);
    box.querySelector('[data-tour="next"]').textContent = i === steps.length - 1 ? t("tour.start") : t("tour.next");
    box.querySelector('[data-tour="back"]').hidden = i === 0;
    box.querySelector('[data-tour="next"]').focus({ preventScroll: true });
  };
  let sprosti = null;
  const end = () => {
    box.hidden = true;
    sprosti?.();
    setEnd(null);
    document.removeEventListener("keydown", onKey);
    try {
      localStorage.setItem(TOUR_KEY, "done");
    } catch {}
    if (state.student && (state.student.settings?.tour_version || 0) < TOUR_VERSION) {
      state.student.settings = { ...state.student.settings, tour_version: TOUR_VERSION };
      api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings: { tour_version: TOUR_VERSION } } }).catch(() => null);
    }
  };
  const next = () => (++i >= steps.length ? end() : show());
  const back = () => {
    i = Math.max(0, i - 1);
    show();
  };
  const onKey = (e) => {
    if (e.key === "Escape") end();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") back();
  };
  box.querySelector('[data-tour="next"]').onclick = next;
  box.querySelector('[data-tour="back"]').onclick = back;
  box.querySelector('[data-tour="skip"]').onclick = end;
  document.addEventListener("keydown", onKey);
  setEnd(end);
  box.hidden = false;
  sprosti = zadrziFokus(box, { zacetni: box.querySelector('[data-tour="next"]') });
  show();
}
