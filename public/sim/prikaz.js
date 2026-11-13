// Prikaz na grafu: vsak graf v simulaciji dobi vrstico gumbov, s katerimi učenec vklopi ali izklopi
// posamezne krivulje, premice, točke, oznake drsnikov in mrežo (j, 2026-10-30).
// Deluje za vse simulacije brez sprememb v njih: elemente združimo po barvnih razredih iz kit.js
// (stroke-a, fill-a …), skrijemo pa jih z razredom na korenu simulacije in CSS (textbook.css, »Prikaz na grafu«),
// zato skrivanje ostane, tudi ko simulacija graf nariše na novo.
// Graf je slika SVG z osmi (kit.axes) ali mrežo; graf virtualnega laboratorija ima svojo legendo (lab.js).
// Modul nima kode za brskalnik na najvišji ravni (preizkus test/prikaz.test.js); t() poda index.js.

// [ključ, izbirnik, barvna spremenljivka]. Izbirniki morajo ustrezati pravilom v textbook.css.
export const LAYERS = [
  ["accent", ".stroke-accent, .fill-accent, .graph-line:not(.stroke-a, .stroke-b, .stroke-c, .stroke-ok, .stroke-danger, .stroke-muted, .stroke-text), .band", "--accent"],
  ["a", ".stroke-a, .fill-a, .slope-tri, .slope-label, .pt-n, .area-fill, .ray.a", "--demo-a"],
  ["b", ".stroke-b, .fill-b, .pt-zero, .rect-sum:not(.neg), .ray.b, .vel", "--demo-b"],
  ["c", ".stroke-c, .fill-c, .ray.c, .perim, .arc-thick", "--demo-c"],
  ["ok", ".stroke-ok, .fill-ok", "--ok"],
  ["danger", ".stroke-danger, .fill-danger, .rect-sum.neg", "--danger"],
  ["muted", ".stroke-muted, .fill-muted, .guide:not(.stroke-a, .stroke-b, .stroke-c, .stroke-ok, .stroke-danger, .stroke-accent)", "--muted"],
  ["marks", ".amark", null],
  ["grid", ".grid", null],
];
const GRAPH = "svg.demo-svg:not(.lab-graph)";
// Legenda v besedilu: <span class="dot dot-a"></span> Sekanta … → ime skupine »a«.
const DOT = { "dot-a": "a", "dot-n": "a", "dot-b": "b", "dot-zero": "b", "dot-c": "c", "dot-ok": "ok", "dot-danger": "danger" };
const VAR = { "--demo-a": "a", "--demo-b": "b", "--demo-c": "c", "--accent": "accent", "--ok": "ok", "--danger": "danger", "--muted": "muted" };
const STOP = new Set(["je", "so", "in", "pri", "s", "z", "ko", "kjer", "ki", "ima", "skozi", "za", "na", "v", "od", "do", "če", "se", "pa", "ali", "to", "ter", "iz", "pred", "po"]);

// Ime iz besedila za barvno piko: do prvega ločila ali enačaja, največ 3 besede, brez števil.
export function legendName(text) {
  const head = String(text || "").replace(/\s+/g, " ").trim().split(/[:;=,]|\.(?:\s|$)|\s\(|\s[–—-]\s/)[0];
  const words = [];
  for (const w of head.split(" ").filter(Boolean)) {
    if (STOP.has(w.toLowerCase()) || /[0-9=<>≤≥+−→∠/]/.test(w)) break;
    words.push(w);
    if (words.length === 3) break;
  }
  const name = words.join(" ");
  if (!/\p{L}/u.test(name) || /^[A-Za-z]$/.test(name) || name.length > 28) return "";
  return /^\p{Ll}{3}/u.test(name) ? name[0].toUpperCase() + name.slice(1) : name;
}

function dotKey(d) {
  for (const c of d.classList) if (DOT[c]) return DOT[c];
  const m = /var\((--[\w-]+)\)/.exec(d.getAttribute("style") || "");
  return m ? VAR[m[1]] : null;
}
// Besedilo za piko: sosednja besedilna vozlišča do naslednjega elementa (KaTeX ipd. ne štejemo).
function textAfter(d) {
  let s = "";
  for (let n = d.nextSibling; n && n.nodeType === 3; n = n.nextSibling) s += n.textContent;
  return s;
}

const visible = (svg) => svg.getClientRects().length > 0;
const outside = (el) => !el.closest("defs");

// Poveže vrstico gumbov s simulacijo v root. Ob ponovnem klicu (Ponastavi) vse spet prikaže. t: prevodi (public/i18n.js).
export function layerToggles(root, t = (k) => k) {
  if (root._layers) return root._layers.reset();
  const off = new Set();
  const row = document.createElement("div");
  row.className = "demo-layers";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", t("sim.layers"));
  row.hidden = true;
  let sig = "", timer = 0;

  const graphs = () => [...root.querySelectorAll(GRAPH)].filter((g) => g.closest(".demo") === root && g.querySelector(".axes, .grid"));
  // Slike z grafom označimo, da CSS skriva samo na grafih (ne na drugih slikah iste simulacije).
  const tag = () => graphs().forEach((g) => g.classList.add("tg-graph"));

  const detect = () => {
    const svgs = graphs().filter(visible);
    const found = [];
    for (const [k, sel, cssVar] of LAYERS) {
      const els = svgs.flatMap((g) => [...g.querySelectorAll(sel)].filter(outside));
      if (!els.length && !off.has(k)) continue;
      let name = els.map((e) => e.getAttribute("data-name")).find(Boolean) || "";
      if (!name && cssVar) {
        const d = [...root.querySelectorAll(".dot")].find((x) => !x.closest(".demo-slider, .demo-layers") && dotKey(x) === k);
        name = d ? legendName(textAfter(d)) : "";
      }
      found.push({ k, cssVar, name: name || t(k === "grid" ? "sim.layer.grid" : k === "marks" ? "sim.layer.marks" : `sim.color.${k}`) });
    }
    return found;
  };

  const render = (found) => {
    const s = found.map((f) => `${f.k}:${f.name}`).join("|") + `/${[...off].join()}`;
    if (s === sig && row.isConnected) return;
    sig = s;
    row.replaceChildren();
    const lab = document.createElement("span");
    lab.className = "demo-layers-label";
    lab.textContent = t("sim.layers.show");
    lab.setAttribute("aria-hidden", "true");
    row.append(lab);
    for (const f of found) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "layer-chip";
      b.dataset.layer = f.k;
      b.setAttribute("aria-pressed", String(!off.has(f.k)));
      const sw = document.createElement("i");
      sw.className = `layer-sw sw-${f.k}`;
      sw.setAttribute("aria-hidden", "true");
      if (f.cssVar) sw.style.setProperty("--sw", `var(${f.cssVar})`);
      b.append(sw, document.createTextNode(f.name));
      b.addEventListener("click", () => {
        const now = !off.has(f.k);
        if (now) off.add(f.k);
        else off.delete(f.k);
        root.classList.toggle(`tg-off-${f.k}`, now);
        b.setAttribute("aria-pressed", String(!now));
        sig = sig.replace(/\/.*$/, `/${[...off].join()}`);
      });
      row.append(b);
    }
    // Vrstico pokažemo, ko ima graf vsaj dva dela, ki ju lahko ločeno skriješ.
    row.hidden = found.length < 2;
    if (!row.isConnected || row.parentNode !== root) place();
  };

  // Pod sliko (oder), pred kontrolami; pri simulacijah brez odra pred »Ponastavi«.
  const place = () => {
    const kids = [...root.children];
    const st = kids.find((c) => c.classList.contains("demo-stage"));
    if (st) return st.after(row);
    const ctl = kids.find((c) => c.classList.contains("demo-controls") || c.classList.contains("demo-reset"));
    return ctl ? ctl.before(row) : root.append(row);
  };

  const refresh = () => {
    timer = 0;
    tag();
    render(detect());
  };
  const later = () => (timer ||= setTimeout(refresh, 120));
  new MutationObserver((list) => {
    if (list.every((m) => row.contains(m.target))) return;
    tag();
    later();
  }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

  const api = {
    reset() {
      for (const k of off) root.classList.remove(`tg-off-${k}`);
      off.clear();
      sig = "";
      refresh();
      return api;
    },
  };
  root._layers = api;
  refresh();
  return api;
}
