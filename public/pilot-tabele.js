// Tabele skrbnika v pilotu (Račun: merjenje v pilotu, rast, naloge članov, preizkus znanja) se nikoli ne pomikajo
// vstran (j: nič ne sme drseti vstran). Glave stolpcev se lomijo v več vrstic; če tabela še vedno ni dovolj ozka,
// dobi razred »stack«: vsaka vrstica postane kartica »ime stolpca: vrednost« (account.css). Ime stolpca vzamemo iz
// glave tabele (data-label), zato predloge tabel ostanejo nespremenjene. Ob spremembi širine (telefon obrnjen, okno
// zoženo) se preveri znova.
const watched = new WeakSet();

function label(table) {
  const heads = [...(table.tHead?.rows[0]?.cells || [])].map((c) => c.textContent.trim());
  if (!heads.length) return;
  for (const row of table.tBodies[0]?.rows || []) {
    let col = 0;
    for (const cell of row.cells) {
      // Celica čez več stolpcev (npr. »premalo kandidatov«) nima enega imena stolpca.
      if (cell.colSpan === 1 && heads[col] && !cell.dataset.label) cell.dataset.label = heads[col];
      col += cell.colSpan;
    }
  }
}

export function fitPilotTables(root) {
  if (!root) return;
  const boxes = [...root.querySelectorAll(".pilot-scroll")];
  for (const box of boxes) {
    const table = box.querySelector("table");
    if (table) label(table);
    box.classList.remove("stack");
  }
  // Najprej vse v navadni obliki, nato izmerimo (ena postavitev strani, ne ena na tabelo).
  for (const box of boxes) if (box.offsetParent && box.scrollWidth > box.clientWidth + 1) box.classList.add("stack");
  if (!watched.has(root) && typeof ResizeObserver === "function") {
    watched.add(root);
    let width = root.clientWidth;
    new ResizeObserver(() => {
      if (root.clientWidth === width) return;
      width = root.clientWidth;
      fitPilotTables(root);
    }).observe(root);
  }
}
