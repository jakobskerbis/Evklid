// Pogon simulacij »3d-<id>« (public/sim/index.js): lekcija vklopi kateri koli model iz kode (docs/3d.md) z
// mountSim("3d-celica-zivalska", el, { zacetek: { … } }). Ta datoteka je majhna; prizor in three se naložita šele tu.
const CSS = "/3d/3d.css";

export function sim3d(el, opts = {}) {
  if (!document.querySelector(`link[href="${CSS}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = CSS;
    document.head.append(l);
  }
  const p = document.createElement("p");
  p.className = "muted";
  el.append(p);
  (async () => {
    const [{ naloziModel }, { odpriModel }, { t }] = await Promise.all([import("./modeli.js"), import("./pregledovalnik.js"), import("/i18n.js")]);
    p.textContent = t("a3.loading");
    const mod = opts.model ? await naloziModel(opts.model) : null;
    if (!el.isConnected) return;
    if (!mod) {
      p.textContent = t("a3.notFound");
      return;
    }
    p.remove();
    const box = document.createElement("div");
    el.append(box);
    odpriModel(box, mod, { zacetek: opts.zacetek || {} });
  })().catch((err) => {
    console.error("3D simulacija:", err);
    p.textContent = "3D";
  });
}
