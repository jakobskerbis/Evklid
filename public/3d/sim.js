// Pogon simulacij »3d-<id>« (public/sim/index.js): lekcija vklopi kateri koli model iz kode (docs/3d.md) z
// mountSim("3d-celica-zivalska", el, { zacetek: { … } }). Ta datoteka je majhna; prizor in three se naložita šele tu.
import { napisPoskusa } from "../sim/napis-poskusa.js";

const CSS = "/3d/3d.css";

export function sim3d(el, opts = {}) {
  if (!document.querySelector(`link[href="${CSS}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = CSS;
    document.head.append(l);
  }
  const p = document.createElement("div"); // nalaganje ali kartica z napako (odstavki in gumb)
  p.className = "muted";
  el.append(p);
  // »Preizkusi: …« ali »Razmisli: …« (docs/kakovost.md §3, public/sim/napis-poskusa.js) pod pregledovalnikom kot pri
  // drugih simulacijah: besedilo iz vnosa v katalogu (opts.poskusi, za temo), sicer iz modela (info.poskusi).
  let poskusi = null;
  const dodajPoskusi = (x) => {
    const n = napisPoskusa(x);
    if (!n || poskusi) return;
    poskusi = document.createElement("p");
    poskusi.className = "demo-try";
    poskusi.dataset.vrsta = n.vrsta;
    const b = document.createElement("b");
    b.textContent = `${n.napis} `;
    poskusi.append(b, n.besedilo);
    el.append(poskusi);
  };
  dodajPoskusi(opts.poskusi);
  let box = null;
  const nalozi = () =>
    (async () => {
      const [{ naloziModel }, { odpriModel }, { t }] = await Promise.all([import("./modeli.js"), import("./pregledovalnik.js"), import("/i18n.js")]);
      p.textContent = t("a3.loading");
      const mod = opts.model ? await naloziModel(opts.model) : null;
      if (!el.isConnected) return;
      if (!mod) {
        p.textContent = t("a3.notFound");
        poskusi?.remove(); // brez modela ni kaj poskusiti
        return;
      }
      p.remove();
      dodajPoskusi(mod.info?.poskusi);
      box = document.createElement("div");
      el.insertBefore(box, poskusi);
      odpriModel(box, mod, { zacetek: opts.zacetek || {} });
    })().catch(async (err) => {
      console.error("3D simulacija:", err);
      // Napaka: sporočilo po vrsti napake (povezava, star brskalnik, pomnilnik …) namesto praznega okvirja; p je ob gradnji
      // že odstranjen. »Poskusi znova« naloži model še enkrat.
      const [{ t }, { napakaVsebina }] = await Promise.all([import("/i18n.js").catch(() => ({ t: () => "3D" })), import("./napake.js")]).catch(() => [{ t: () => "3D" }, { napakaVsebina: null }]);
      box?.remove();
      box = null;
      poskusi?.remove();
      poskusi = null;
      if (!napakaVsebina) {
        p.textContent = t("a3.loadError");
      } else {
        p.replaceChildren(
          ...napakaVsebina(err, {
            t,
            znova: () => {
              p.replaceChildren();
              dodajPoskusi(opts.poskusi);
              nalozi();
            },
            razredGumba: "secondary",
          }),
        );
      }
      if (el.isConnected) el.append(p);
    });
  nalozi();
}
