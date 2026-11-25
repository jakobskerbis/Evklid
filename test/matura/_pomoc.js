// Pomočniki za igre maturitetnih nalog v brskalniku (test/laboratorij-matura.test.js → test/matura/lab-*.js).
// Funkcija teče v testni strani (page.evaluate), zato ne sme ničesar uvoziti: doda le nekaj okenskih pomočnikov poleg
// gumb, stikalo, oddaj in dokler iz testne strani.
export default () => {
  const txt = (e) => (e?.textContent || "").replace(/\s+/g, " ").trim();
  window.vrstic = () => m.querySelectorAll("table.lab-table tbody tr").length;
  window.zadnjiDnevnik = () => txt(m.querySelector(".lab-log li"));
  window.drsnik = async (t, v) => {
    const r = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith(t))?.parentElement.querySelector('input[type="range"]');
    if (!r) throw new Error("ni drsnika " + t);
    r.value = String(v);
    r.dispatchEvent(new Event("input", { bubbles: true }));
    r.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(120);
  };
  // Izbira v seznamu ali v skupini gumbov z oznako `t` (npr. »spust« → »elektromagnet«).
  window.izbira = async (t, besedilo) => {
    const box = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x) === t)?.parentElement;
    const sel = box?.querySelector("select");
    if (sel) {
      sel.value = [...sel.options].find((o) => txt(o).startsWith(besedilo)).value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      const b = [...(box?.querySelectorAll(".seg-btn") || [])].find((x) => txt(x).startsWith(besedilo));
      if (!b) throw new Error("ni izbire " + t + " " + besedilo);
      b.click();
    }
    await wait(120);
  };
  // Stikalo vklopi ali izklopi (stikalo iz testne strani ga zna le vklopiti).
  window.preklopi = async (t, on) => {
    const c = [...m.querySelectorAll(".demo-check")].find((x) => txt(x).startsWith(t))?.querySelector("input");
    if (!c) throw new Error("ni stikala " + t);
    if (c.checked !== on) c.click();
    await wait(120);
  };
};
