// Posnetek zadnjega zaslona (hiter zagon, j 2026-11-10): public/zacetek.js ga ob naslednjem odprtju pokaže takoj,
// namesto praznega zaslona. HTML trenutnega pogleda brez skritih delov, skriptov, slik iz pomnilnika in napisanega
// besedila. Samo pogled v glavnem delu (ne v premičnem oknu), samo ta profil; ključ je med osebnimi (PRIVATE_KEYS,
// public/offline.js). Modul se naloži po zagonu (public/app.js saveSnapshot), ni del prvega odprtja.
const SHOT_MAX = 250000; // znakov; večji pogled dobi ob odprtju okostje
// key: ključ v localStorage; rec: zapis zadnjega zaslona { v, t, s, l, p } (app.js rememberScreen) ali nič.
export function shrani(key, rec) {
  const drop = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };
  const el = rec && document.getElementById(`view-${rec.v}`);
  if (!el || el.hidden || el.parentElement !== document.body || el.classList.contains("in-okno") || document.body.classList.contains("onboarding")) return drop();
  const live = el.querySelectorAll("*");
  if (live.length > 6000) return drop();
  const copy = el.cloneNode(true);
  const twin = copy.querySelectorAll("*");
  live.forEach((a, i) => {
    const b = twin[i];
    if (a.scrollTop > 0) b.setAttribute("data-zs", String(Math.round(a.scrollTop)));
    // Izbira v obrazcih (nastavitve) kot na zaslonu; napisano besedilo (klepet, odgovor) in gesla ne gredo v posnetek.
    if (a.tagName === "INPUT" && (a.type === "checkbox" || a.type === "radio")) b.toggleAttribute("checked", a.checked);
    else if (a.tagName === "OPTION") b.toggleAttribute("selected", a.selected);
    else if (a.tagName === "INPUT" && rec.v === "settings" && !["password", "file", "hidden"].includes(a.type)) b.setAttribute("value", a.value);
  });
  copy.querySelectorAll("select").forEach((x) => x.setAttribute("data-native", "")); // public/dropdown.js posnetka ne nadgradi še enkrat
  copy.querySelectorAll('script, iframe, video, audio, object, embed, [hidden], img[src^="blob:"], dialog:not([open])').forEach((x) => x.remove());
  copy.querySelectorAll("*").forEach((x) => {
    for (const a of [...x.attributes]) if (/^on/i.test(a.name)) x.removeAttribute(a.name);
  });
  const h = copy.innerHTML;
  if (!h.trim() || h.length > SHOT_MAX) return drop();
  const b = ["mock-banner", "test-notice"].filter((id) => document.getElementById(id)?.hidden === false);
  const shot = { ...rec, c: el.className, tb: document.querySelector("#tabbar .tab.active")?.dataset.view || "", b, h };
  try {
    localStorage.setItem(key, JSON.stringify(shot));
  } catch {
    drop(); // poln pomnilnik naprave: brez posnetka (ob odprtju okostje)
  }
}
