// Povezave na dotik (j 2026-11-13): ko na telefonu pridržiš kartico ali gumb, ki je povezava (<a href>,
// npr. »Odpri atlas« v Uči se → 3D svet), Android pokaže sivi oblaček z besedilom in naslovom povezave
// (vlečenje povezave ali meni povezave), iPhone pa predogled povezave. V aplikaciji so povezave gumbi,
// zato tega ne želimo nikjer. Z miško (desni klik, vlečenje na računalniku) ostane vse kot prej.
// CSS del (modri blisk ob dotiku, -webkit-touch-callout, -webkit-user-drag) je v style.css in 3d/3d.css.
let dotik = false;
addEventListener("pointerdown", (e) => (dotik = e.pointerType !== "mouse"), { capture: true, passive: true });
addEventListener("keydown", () => (dotik = false), { capture: true, passive: true }); // tipka za meni na prenosniku z zaslonom na dotik
const povezava = (e) => e.target instanceof Element && e.target.closest("a[href]");
for (const ime of ["contextmenu", "dragstart"])
  addEventListener(
    ime,
    (e) => {
      if (dotik && povezava(e)) e.preventDefault();
    },
    { capture: true },
  );
