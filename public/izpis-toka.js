// Izpis odgovora med pretakanjem (točka D5, master brief j 13. 11.): prej se je ob vsaki besedi znova izrisal ves
// odgovor (Markdown in vse formule), pri dolgem odgovoru vse počasneje. Zdaj:
// - dokončani bloki (odstavki, ločeni s prazno vrstico) se izrišejo enkrat in ostanejo v predpomnilniku,
//   znova se izriše samo zadnji blok;
// - največ en izris na sličico (requestAnimationFrame), končni izris takoj (gumbi pod odgovorom pridejo za njim).
// Končni izris je izris celega besedila naenkrat, enak kot ob ponovnem odprtju pogovora (chatRich(besedilo)); prej je šel
// še skozi streamSafe, ki je npr. odrezal zadnjo vrstico tabele brez nove vrstice na koncu.

const OZNAKA_SEZNAMA = /^(\d{1,9}[.)]|[-*+])(\s|$)/;

// Razdeli besedilo na bloke; bloki skupaj dajo isto besedilo. Meja je samo prazna vrstica, za katero se začne nov
// odstavek na začetku vrstice (ne seznam, citat, tabela ali zamaknjeno nadaljevanje) in ki ni v ``` ali $$.
export function razdeliBloke(text) {
  const vrstice = String(text ?? "").split("\n");
  const bloki = [];
  let trenutni = [];
  let vOgradi = false;
  let vFormuli = false;
  let prazna = false;
  for (let i = 0; i < vrstice.length; i++) {
    const v = vrstice[i];
    const meja =
      prazna && !vOgradi && !vFormuli && v.trim() !== "" && !/^\s/.test(v) && !OZNAKA_SEZNAMA.test(v) && !/^[>|]/.test(v) && trenutni.some((x) => x.trim() !== "");
    if (meja) {
      bloki.push(trenutni.join("\n") + "\n");
      trenutni = [];
    }
    trenutni.push(v);
    if (/^\s*(```|~~~)/.test(v)) vOgradi = !vOgradi;
    if (!vOgradi && (v.split("$$").length - 1) % 2) vFormuli = !vFormuli;
    prazna = v.trim() === "";
  }
  bloki.push(trenutni.join("\n"));
  return bloki;
}

// render(text) → HTML. Vrne izris(text): dokončani bloki iz predpomnilnika, zadnji na novo.
export function createIzrisBlokov(render) {
  const gotovi = new Map();
  return (text) => {
    const bloki = razdeliBloke(text);
    const zadnji = bloki.pop();
    let html = "";
    for (const b of bloki) {
      let h = gotovi.get(b);
      if (h === undefined) gotovi.set(b, (h = render(b)));
      html += h;
    }
    return html + (zadnji ? render(zadnji) : "");
  };
}

// Največ en izris na sličico: izris(text, koncno). Končni izris (koncno) prekliče čakajočega in izriše takoj.
export function enIzrisNaSlicico(izrisi, { naslednja = (f) => requestAnimationFrame(f), preklici = (id) => cancelAnimationFrame(id) } = {}) {
  let cakajoce = null;
  let id = null;
  return (text, koncno = false) => {
    if (koncno) {
      if (id !== null) preklici(id);
      id = null;
      cakajoce = null;
      izrisi(text, true);
      return;
    }
    cakajoce = text;
    if (id === null)
      id = naslednja(() => {
        id = null;
        const t = cakajoce;
        cakajoce = null;
        if (t !== null) izrisi(t, false);
      });
  };
}
