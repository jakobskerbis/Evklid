// Simulacije za matematična tekmovanja: logika, Dirichletovo načelo, invariante, igre, ostanki, poti,
// diofantske enačbe, ura, sredine, urejanje, Vietove formule, funkcijske enačbe, Hanojski stolpi, grafi,
// potenca točke, Cevov izrek, najkrajša pot, Legendrova formula.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, clamp, label, animate, playButton, axes, fnPath, handle, draggable, gcd, rint } from "./kit.js";

const binom = (n, k) => {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
};

// ------------------------------------------------------------ vitezi: logične naloge (vitezi in oprode)
const UGANKE = [
  [["A"], [["Oba sva oprodi.", (v) => !v[0] && !v[1]], ["", null]], 2],
  [["A", "B"], [["B je vitez.", (v) => v[1]], ["A in jaz sva različnih vrst.", (v) => v[0] !== v[1]]], 2],
  [["A"], [["Vsaj eden od naju je oproda.", (v) => !v[0] || !v[1]], ["", null]], 2],
  [["A", "B", "C"], [["B je oproda.", (v) => !v[1]], ["C je oproda.", (v) => !v[2]], ["A in B sta oprodi.", (v) => !v[0] && !v[1]]], 3],
  [["A", "B", "C"], [["Med nami je natanko en vitez.", (v) => v.filter(Boolean).length === 1], ["Vsi trije smo oprode.", (v) => !v[0] && !v[1] && !v[2]], ["A je vitez.", (v) => v[0]]], 3],
  [["A", "B", "C"], [["Vsaj dva od nas sta oprodi.", (v) => v.filter((x) => !x).length >= 2], ["C je vitez.", (v) => v[2]], ["B je oproda.", (v) => !v[1]]], 3],
];
export function vitezi(el) {
  const out = readout();
  const svg = svgBox(340, 200);
  let k = 0, v = [true, true, true], table = false;
  const names = ["A", "B", "C"];
  const draw = () => {
    svg.replaceChildren();
    const [, st, n] = UGANKE[k];
    for (let i = 0; i < n; i++) {
      const cx = 170 + (i - (n - 1) / 2) * 110, cy = 120;
      const g = s("g", { class: "drag", role: "button" }, svg);
      s("circle", { cx, cy, r: 30, class: v[i] ? "fill-accent" : "fill-muted", opacity: 0.9 }, g);
      label(g, cx, cy - 4, names[i], "lbl big inv");
      label(g, cx, cy + 14, v[i] ? "vitez" : "oproda", "tick small inv");
      g.addEventListener("click", () => ((v[i] = !v[i]), draw(), info()));
      const text = st[i]?.[0];
      if (text) {
        const ok = st[i][1](v) === v[i];
        const w = Math.min(104, 12 + text.length * 5.6);
        s("rect", { x: cx - w / 2, y: 18, width: w, height: 52, rx: 10, class: ok ? "box" : "box bad-box" }, svg);
        const words = text.split(" "), lines = [""];
        words.forEach((wd) => ((lines.at(-1) + " " + wd).length > 17 ? lines.push(wd) : (lines[lines.length - 1] = (lines.at(-1) + " " + wd).trim())));
        lines.slice(0, 3).forEach((ln, j) => label(svg, cx, 44 + (j - (lines.length - 1) / 2) * 13, ln, "tick small"));
        s("path", { d: `M${cx - 6} 70 L${cx} 84 L${cx + 6} 70`, class: "box" }, svg);
        label(svg, cx, 168, ok ? "✓ skladno" : "✗ protislovje", `tick small b ${ok ? "fill-ok" : "fill-danger"}`);
      }
    }
  };
  const info = () => {
    const [, st, n] = UGANKE[k];
    const okAll = Array.from({ length: n }, (_, i) => !st[i]?.[1] || st[i][1](v) === v[i]).every(Boolean);
    let html = `<p>Vitezi vedno govorijo resnico, oprode vedno lažejo. Klikni osebo, da zamenjaš njeno vrsto. ${okAll ? '<b class="ok-text">Vse izjave so skladne: to je rešitev!</b>' : "Najdi razporeditev brez protislovij."}</p>`;
    if (table) {
      const rows = [];
      for (let m = 0; m < 1 << n; m++) {
        const w = Array.from({ length: n }, (_, i) => !!(m & (1 << (n - 1 - i))));
        const ok = w.every((x, i) => !st[i]?.[1] || st[i][1](w) === x);
        rows.push(`<tr class="${ok ? "ok" : "bad"}">${w.map((x) => `<td>${x ? "V" : "O"}</td>`).join("")}<td>${ok ? "✓" : "✗"}</td></tr>`);
      }
      html += `<table class="demo-table atoms"><tr>${names.slice(0, n).map((x) => `<th>${x}</th>`).join("")}<th>skladno</th></tr>${rows.join("")}</table><p class="muted">Sistematično preverjanje vseh možnosti (V = vitez, O = oproda) je zanesljiva metoda pri logičnih nalogah.</p>`;
    }
    out.innerHTML = html;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "uganka", options: UGANKE.map((_, i) => [i, `uganka ${i + 1}`]), value: k, onChange: (x) => ((k = +x), (v = [true, true, true]), draw(), info()) }),
      toggle("pokaži tabelo vseh možnosti", table, (x) => ((table = x), info())),
    ],
    out,
    tryText: "Reši uganko 4 brez tabele. Kaj lahko takoj sklepaš, če nekdo reče »Oba sva oprodi«?",
  });
}

// ------------------------------------------------------------ predalcki: Dirichletovo načelo
export function predalcki(el) {
  const out = readout();
  const svg = svgBox(340, 220);
  let n = 4, N = 9, cnt = [];
  const throwBalls = () => {
    cnt = Array(n).fill(0);
    for (let i = 0; i < N; i++) cnt[rint(0, n - 1)]++;
  };
  const even = () => {
    cnt = Array(n).fill(0);
    for (let i = 0; i < N; i++) cnt[i % n]++;
  };
  const draw = () => {
    svg.replaceChildren();
    const W = 320 / n, mx = Math.max(...cnt), guar = Math.ceil(N / n);
    cnt.forEach((c, i) => {
      const x = 10 + i * W;
      s("path", { d: `M${x + 4} 40 V200 H${x + W - 4} V40`, class: "beaker" + (c === mx ? " hot" : "") }, svg);
      for (let j = 0; j < c; j++) {
        const cols = Math.max(1, Math.floor((W - 12) / 14));
        s("circle", { cx: x + 12 + (j % cols) * 14, cy: 192 - Math.floor(j / cols) * 14, r: 6, class: c >= guar ? "fill-a" : "fill-b" }, svg);
      }
      label(svg, x + W / 2, 28, String(c), `lbl ${c === mx ? "fill-danger" : ""}`);
    });
  };
  const info = () => {
    const g = Math.ceil(N / n);
    out.innerHTML = texBlock(`\\left\\lceil \\tfrac{N}{n} \\right\\rceil = \\left\\lceil \\tfrac{${N}}{${n}} \\right\\rceil = ${g}`) +
      `<p>Če ${N} predmetov razporedimo v ${n} predalov, je v nekem predalu <b>vsaj ${g}</b> predmetov, ne glede na to, kako jih razporedimo. ${N > n ? `Zato v vsaj enem predalu sta vsaj dva predmeta.` : "Ker predmetov ni več kot predalov, so lahko vsi v različnih predalih."}</p>
       <p class="muted">Dokaz s protislovjem: če bi bilo v vsakem predalu največ ${g - 1}, bi bilo vseh skupaj največ ${n * (g - 1)} < ${N}. Oranžne kroglice so v predalih, ki dosežejo zagotovljeno število.</p>`;
  };
  const upd = (rand = true) => ((rand ? throwBalls : even)(), draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "predali n", min: 2, max: 8, value: n, onInput: (x) => ((n = x), upd()) }),
      slider({ label: "predmeti N", min: 1, max: 30, value: N, onInput: (x) => ((N = x), upd()) }),
      buttons(button("Razporedi naključno", () => upd(true), "primary small"), button("Čim bolj enakomerno", () => upd(false))),
    ],
    out,
    tryText: "Koliko ljudi mora biti v sobi, da imata gotovo dva rojstni dan v istem mesecu? Nastavi 12 predalov.",
  });
}

// ------------------------------------------------------------ invarianta: barvanje šahovnice in domine
export function invarianta(el) {
  const out = readout();
  const svg = svgBox(340, 300);
  let N = 6, removed = new Set(["0,0", `${N - 1},${N - 1}`]), tiling = null, tried = false;
  const tryTile = () => {
    const free = (r, c) => r >= 0 && c >= 0 && r < N && c < N && !removed.has(`${r},${c}`);
    const used = new Set(), doms = [];
    let steps = 0;
    const solve = () => {
      if (++steps > 200000) return false;
      let first = null;
      for (let r = 0; r < N && !first; r++) for (let c = 0; c < N; c++) if (free(r, c) && !used.has(`${r},${c}`)) { first = [r, c]; break; }
      if (!first) return true;
      const [r, c] = first;
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr, c2 = c + dc;
        if (free(r2, c2) && !used.has(`${r2},${c2}`)) {
          used.add(`${r},${c}`), used.add(`${r2},${c2}`), doms.push([r, c, r2, c2]);
          if (solve()) return true;
          used.delete(`${r},${c}`), used.delete(`${r2},${c2}`), doms.pop();
        }
      }
      return false;
    };
    tiling = solve() ? doms : null;
    tried = true;
  };
  const draw = () => {
    svg.replaceChildren();
    const sz = Math.min(260 / N, 44), x0 = 170 - (N * sz) / 2, y0 = 10;
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const key = `${r},${c}`, gone = removed.has(key);
        const rc = s("rect", { x: x0 + c * sz, y: y0 + r * sz, width: sz, height: sz, class: gone ? "cell-gone" : (r + c) % 2 ? "cell-dark" : "cell-light" }, svg);
        rc.classList.add("drag");
        rc.addEventListener("click", () => (removed.has(key) ? removed.delete(key) : removed.add(key), (tiling = null), (tried = false), draw(), info()));
      }
    (tiling || []).forEach(([r, c, r2, c2]) => {
      s("rect", { x: x0 + Math.min(c, c2) * sz + 4, y: y0 + Math.min(r, r2) * sz + 4, width: (Math.abs(c2 - c) + 1) * sz - 8, height: (Math.abs(r2 - r) + 1) * sz - 8, rx: 6, class: "domino" }, svg);
    });
    let b = 0, w = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!removed.has(`${r},${c}`)) (r + c) % 2 ? b++ : w++;
    label(svg, 170, y0 + N * sz + 18, `belih polj: ${w}, temnih polj: ${b}`, "lbl small");
  };
  const info = () => {
    let b = 0, w = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!removed.has(`${r},${c}`)) (r + c) % 2 ? b++ : w++;
    out.innerHTML = `<p>Vsaka domina pokrije <b>eno belo in eno temno polje</b>. Razlika med številom belih in temnih polj je zato <b>invarianta</b>: tlakovanje je mogoče le, če je razlika 0.</p>
      <p>${w !== b ? `Tu je belih ${w} in temnih ${b} polj, zato tlakovanje <b class="bad-text">ni mogoče</b>, ne glede na to, kako se trudimo.` : tried ? (tiling ? '<b class="ok-text">Tlakovanje je najdeno.</b>' : "Števili sta enaki, a tlakovanja vseeno ni (pogoj je potreben, ne pa zadosten).") : "Števili sta enaki. Pritisni Tlakuj in preveri."}</p>
      <p class="muted">Klikni polje, da ga odstraniš ali vrneš.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "velikost plošče", min: 4, max: 8, step: 2, value: N, onInput: (x) => ((N = x), (removed = new Set(["0,0", `${N - 1},${N - 1}`])), (tiling = null), (tried = false), draw(), info()) }),
      buttons(button("Tlakuj", () => (tryTile(), draw(), info()), "primary small"), button("Prazna plošča", () => (removed.clear(), (tiling = null), (tried = false), draw(), info()))),
    ],
    out,
    tryText: "Odstrani dva nasprotna kota. Zakaj tlakovanje ne uspe? Kaj pa, če odstraniš dve sosednji polji?",
  });
}

// ------------------------------------------------------------ nim: igra z odvzemanjem žetonov
export function nim(el) {
  const out = readout();
  const svg = svgBox(340, 170);
  let N0 = 15, k = 3, left = N0, turn = "ti", hint = false, msg = "Na potezi si ti. Kdor vzame zadnji žeton, zmaga.";
  const lose = (x) => x % (k + 1) === 0;
  const draw = () => {
    svg.replaceChildren();
    for (let i = 0; i < N0; i++) {
      const x = 20 + (i % 15) * 21, y = 30 + Math.floor(i / 15) * 30;
      s("circle", { cx: x, cy: y, r: 9, class: i < left ? "fill-a" : "fill-soft" }, svg);
    }
    // številska premica s pozicijami poraza
    for (let x = 0; x <= N0; x++) {
      const px = 15 + (x / N0) * 310, cls = hint && lose(x) ? "fill-danger" : "fill-muted";
      s("circle", { cx: px, cy: 130, r: x === left ? 7 : 4, class: x === left ? "fill-accent" : cls }, svg);
      if (x % (N0 > 20 ? 5 : 1) === 0 || x === left) label(svg, px, 148, String(x), "tick small");
    }
    if (hint) label(svg, 170, 108, "rdeče: izgubljeni položaji za igralca na potezi", "tick small fill-danger");
  };
  const info = () => (out.innerHTML = `<p>${msg}</p><p class="muted">Ostalo je <b>${left}</b> žetonov. Vzameš lahko 1 do ${k}. ${hint ? `Zmagovalna strategija: vedno pusti nasprotniku večkratnik števila ${k + 1}.` : ""}</p>`);
  const computer = () => {
    let t = left % (k + 1);
    if (t === 0) t = rint(1, Math.min(k, left));
    left -= t;
    msg = `Računalnik je vzel ${t}. ` + (left === 0 ? "<b>Računalnik je zmagal.</b> Poskusi znova." : "Na potezi si ti.");
    turn = left === 0 ? "konec" : "ti";
  };
  const take = (t) => {
    if (turn !== "ti" || t > left) return;
    left -= t;
    if (left === 0) {
      msg = '<b class="ok-text">Zmagal si!</b>';
      turn = "konec";
    } else computer();
    draw();
    info();
  };
  const takeBtns = h("div", { class: "demo-buttons" });
  const mkBtns = () => takeBtns.replaceChildren(...Array.from({ length: k }, (_, i) => button(`Vzemi ${i + 1}`, () => take(i + 1), "primary small")));
  const reset = () => ((left = N0), (turn = "ti"), (msg = "Na potezi si ti. Kdor vzame zadnji žeton, zmaga."), mkBtns(), draw(), info());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      takeBtns,
      slider({ label: "žetonov", min: 8, max: 30, value: N0, onInput: (x) => ((N0 = x), reset()) }),
      slider({ label: "največ na potezo", min: 2, max: 5, value: k, onInput: (x) => ((k = x), reset()) }),
      toggle("pokaži strategijo", hint, (x) => ((hint = x), draw(), info())),
      buttons(button("Nova igra", reset)),
    ],
    out,
    tryText: "Ali lahko premagaš računalnik, če je na začetku 16 žetonov in smeš vzeti največ 3? Kdo ima zmagovalno strategijo?",
  });
}

// ------------------------------------------------------------ ostanki: modularna aritmetika
export function ostanki(el, { mode = "vsota" } = {}) {
  const out = readout();
  const svg = svgBox(340, 260);
  let m = mode === "potence" ? 10 : 12, a = mode === "potence" ? 7 : 5, b = 3;
  const seq = () => {
    const res = [];
    if (mode === "potence") {
      let x = 1;
      for (let i = 0; i < 2 * m + 2; i++) {
        x = (x * a) % m;
        if (res.includes(x) && res.length) {
          res.push(x);
          break;
        }
        res.push(x);
      }
    } else {
      let x = a % m;
      for (let i = 0; i < m + 1; i++) {
        if (res.includes(x)) {
          res.push(x);
          break;
        }
        res.push(x);
        x = (x + b) % m;
      }
    }
    return res;
  };
  const draw = () => {
    svg.replaceChildren();
    const cx = 130, cy = 130, R = 100;
    const P = (r) => [cx + R * Math.sin((2 * Math.PI * r) / m), cy - R * Math.cos((2 * Math.PI * r) / m)];
    s("circle", { cx, cy, r: R, class: "shell" }, svg);
    const sq = seq();
    for (let i = 1; i < sq.length; i++) {
      const [x1, y1] = P(sq[i - 1]), [x2, y2] = P(sq[i]);
      s("line", { x1, y1, x2, y2, class: "graph-line stroke-c", "stroke-width": 2, opacity: 0.8 }, svg);
    }
    for (let r = 0; r < m; r++) {
      const [x, y] = P(r), on = sq.includes(r);
      s("circle", { cx: x, cy: y, r: 11, class: on ? "fill-a" : "fill-soft" }, svg);
      label(svg, x, y, String(r), on ? "tick small b inv" : "tick small");
    }
    label(svg, 300, 20, "zaporedje", "tick small b");
    sq.slice(0, 13).forEach((r, i) => label(svg, 300, 38 + i * 16, mode === "potence" ? `${a}^${i + 1} ≡ ${r}` : `${a}+${i}·${b} ≡ ${r}`, "tick small"));
  };
  const info = () => {
    const sq = seq(), per = sq.length - 1 - sq.indexOf(sq.at(-1));
    const prime = m > 1 && Array.from({ length: m - 2 }, (_, i) => i + 2).every((d) => m % d);
    if (mode === "potence") {
      out.innerHTML = `<p>Ostanki potenc števila ${a} pri deljenju z ${m} se ponavljajo s <b>periodo ${per}</b>: ${sq.slice(0, -1).join(", ")}, …</p>
        <p>${m === 10 ? `Zato je zadnja števka števila ${a}<sup>n</sup> odvisna le od ostanka n pri deljenju s ${per}.` : ""} ${prime && a % m ? `Ker je ${m} praštevilo, velja mali Fermatov izrek: ${a}<sup>${m - 1}</sup> ≡ 1 (mod ${m}). Perioda ${per} deli ${m - 1}.` : gcd(a, m) === 1 ? `Ker sta ${a} in ${m} tuji, se zaporedje vrne do 1 (Eulerjev izrek).` : `${a} in ${m} nista tuji števili, zato se potence nikoli ne vrnejo na 1.`}</p>`;
    } else {
      const d = gcd(b, m);
      out.innerHTML = `<p>Prištevamo ${b} po modulu ${m} (kot na uri z ${m} urami). Zaporedje obišče <b>${m / d}</b> od ${m} ostankov, ker je D(${b}, ${m}) = ${d}.</p><p class="muted">a ≡ b (mod m) pomeni, da m deli a − b. S kongruencami računamo kot z enačbami: seštevamo, odštevamo in množimo.</p>`;
    }
  };
  const upd = () => (draw(), info());
  const kids = [slider({ label: "modul m", min: 2, max: 20, value: m, onInput: (x) => ((m = x), upd()) }), slider({ label: mode === "potence" ? "osnova a" : "začetek a", min: 1, max: 19, value: a, onInput: (x) => ((a = x), upd()) })];
  if (mode !== "potence") kids.push(slider({ label: "korak b", min: 1, max: 19, value: b, onInput: (x) => ((b = x), upd()) }));
  upd();
  layout(el, { stage: svg, controls: kids, out, tryText: mode === "potence" ? "Kakšna je zadnja števka števila 7²⁰²⁶? Nastavi m = 10 in a = 7." : "Pri katerih korakih b obišče zaporedje vse ostanke pri m = 12?" });
}

// ------------------------------------------------------------ poti: štetje poti po mreži
export function poti(el) {
  const out = readout();
  const svg = svgBox(340, 280);
  let W = 5, H = 4, blocked = new Set(), path = null;
  const count = () => {
    const c = {};
    for (let y = 0; y <= H; y++)
      for (let x = 0; x <= W; x++) {
        const k = `${x},${y}`;
        c[k] = blocked.has(k) ? 0 : x === 0 && y === 0 ? 1 : (c[`${x - 1},${y}`] || 0) + (c[`${x},${y - 1}`] || 0);
      }
    return c;
  };
  const draw = () => {
    svg.replaceChildren();
    const sz = Math.min(300 / W, 230 / H), X = (x) => 20 + x * sz, Y = (y) => 250 - y * sz;
    for (let x = 0; x <= W; x++) s("line", { x1: X(x), y1: Y(0), x2: X(x), y2: Y(H), class: "grid" }, svg);
    for (let y = 0; y <= H; y++) s("line", { x1: X(0), y1: Y(y), x2: X(W), y2: Y(y), class: "grid" }, svg);
    if (path) s("path", { d: path.map(([x, y], i) => `${i ? "L" : "M"}${X(x)} ${Y(y)}`).join(""), class: "graph-line stroke-a", "stroke-width": 4 }, svg);
    const c = count();
    for (let y = 0; y <= H; y++)
      for (let x = 0; x <= W; x++) {
        const k = `${x},${y}`, b = blocked.has(k);
        const g = s("g", { class: "drag" }, svg);
        s("circle", { cx: X(x), cy: Y(y), r: 11, class: b ? "fill-danger" : x + y === 0 || (x === W && y === H) ? "fill-accent" : "fill-soft" }, g);
        label(g, X(x), Y(y), b ? "×" : String(c[k]), b || x + y === 0 || (x === W && y === H) ? "tick small b inv" : "tick small");
        if (!(x === 0 && y === 0) && !(x === W && y === H)) g.addEventListener("click", () => (b ? blocked.delete(k) : blocked.add(k), (path = null), draw(), info()));
      }
    label(svg, X(0) - 2, Y(0) + 22, "A", "lbl");
    label(svg, X(W) + 2, Y(H) - 20, "B", "lbl");
  };
  const info = () => {
    const c = count(), tot = c[`${W},${H}`];
    out.innerHTML = (blocked.size ? "" : texBlock(`\\binom{${W + H}}{${W}} = ${binom(W + H, W)}`)) +
      `<p>Od A do B (le desno in navzgor) vodi <b>${tot}</b> poti. Število v vsakem vozlišču je vsota števil levo in spodaj: tako pridemo do Pascalovega trikotnika.</p>
       <p class="muted">${blocked.size ? "Zaprta vozlišča (×) imajo 0 poti." : `Vsaka pot ima ${W + H} korakov, od tega ${W} desno; izberemo, kateri koraki so desno.`} Klikni vozlišče, da ga zapreš.</p>`;
  };
  const randomPath = () => {
    const c = count();
    if (!c[`${W},${H}`]) return;
    let x = W, y = H;
    const p = [[x, y]];
    while (x || y) {
      const l = x > 0 ? c[`${x - 1},${y}`] || 0 : 0, d = y > 0 ? c[`${x},${y - 1}`] || 0 : 0;
      Math.random() * (l + d) < l ? x-- : y--;
      p.push([x, y]);
    }
    path = p.reverse();
    draw();
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "širina", min: 1, max: 8, value: W, onInput: (x) => ((W = x), blocked.clear(), (path = null), draw(), info()) }),
      slider({ label: "višina", min: 1, max: 6, value: H, onInput: (x) => ((H = x), blocked.clear(), (path = null), draw(), info()) }),
      buttons(button("Naključna pot", randomPath, "primary small"), button("Odpri vse", () => (blocked.clear(), (path = null), draw(), info()))),
    ],
    out,
    tryText: "Koliko poti je na mreži 4 × 4? Zapri sredinsko vozlišče: koliko poti ostane?",
  });
}

// ------------------------------------------------------------ diofant: linearne diofantske enačbe
export function diofant(el) {
  const out = readout();
  const svg = svgBox(340, 300);
  let a = 3, b = 5, c = 31;
  const sols = () => {
    const list = [];
    for (let x = -12; x <= 16; x++) if ((c - a * x) % b === 0) list.push([x, (c - a * x) / b]);
    return list;
  };
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 300, x: [-6, 14], y: [-6, 14], xStep: 2, yStep: 2 });
    s("path", { d: fnPath((x) => (c - a * x) / b, A), class: "graph-line" }, svg);
    for (let x = -6; x <= 14; x++) for (let y = -6; y <= 14; y++) s("circle", { cx: A.X(x), cy: A.Y(y), r: 1.3, class: "fill-muted" }, svg);
    sols().forEach(([x, y]) => {
      if (y < -6 || y > 14 || x < -6 || x > 14) return;
      s("circle", { cx: A.X(x), cy: A.Y(y), r: 5, class: x >= 0 && y >= 0 ? "fill-a" : "fill-c" }, svg);
      if (x >= 0 && y >= 0) label(svg, A.X(x) + 8, A.Y(y) - 9, `(${x}, ${y})`, "tick small b", "start");
    });
  };
  const info = () => {
    const d = gcd(a, b), list = sols(), pos = list.filter(([x, y]) => x >= 0 && y >= 0);
    if (c % d) {
      out.innerHTML = `<p>D(${a}, ${b}) = ${d} ne deli ${c}, zato enačba <b>nima celoštevilskih rešitev</b>: leva stran je vedno deljiva z ${d}.</p>`;
      return;
    }
    const [x0, y0] = list[0];
    out.innerHTML = texBlock(`${a}x + ${b}y = ${c}`) +
      `<p>Ker D(${a}, ${b}) = ${d} deli ${c}, je rešitev neskončno: x = ${x0} + ${b / d}t, y = ${y0} − ${a / d}t (t celo število). Celoštevilske točke na premici so enako razmaknjene.</p>
       <p>Nenegativnih rešitev (oranžne pike) je <b>${pos.length}</b>${pos.length ? ": " + pos.map(([x, y]) => `(${x}, ${y})`).join(", ") : ""}.</p>
       <p class="muted">Primer naloge: koliko vstopnic po ${a} € in po ${b} € kupimo za ${c} €?</p>`;
  };
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "a", min: 1, max: 12, value: a, onInput: (x) => ((a = x), upd()) }),
      slider({ label: "b", min: 1, max: 12, value: b, onInput: (x) => ((b = x), upd()) }),
      slider({ label: "c", min: 0, max: 60, value: c, onInput: (x) => ((c = x), upd()) }),
    ],
    out,
    tryText: "Nastavi 6x + 9y = c. Pri katerih c ima enačba rešitve? Kaj je skupno tem številom?",
  });
}

// ------------------------------------------------------------ ura: kot med kazalcema
export function ura(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let t = 3 * 60; // minute od 12:00
  const ang = () => {
    const hA = (t / 2) % 360, mA = (t * 6) % 360;
    const d = Math.abs(hA - mA) % 360;
    return [hA, mA, Math.min(d, 360 - d)];
  };
  const draw = () => {
    svg.replaceChildren();
    const cx = 120, cy = 120, R = 100;
    s("circle", { cx, cy, r: R, class: "box" }, svg);
    for (let i = 0; i < 60; i++) {
      const a = (i * Math.PI) / 30, r1 = i % 5 ? R - 6 : R - 12;
      s("line", { x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a), x2: cx + (R - 2) * Math.sin(a), y2: cy - (R - 2) * Math.cos(a), class: "thin-line" }, svg);
      if (i % 5 === 0) label(svg, cx + (R - 24) * Math.sin(a), cy - (R - 24) * Math.cos(a), String(i / 5 || 12), "tick small b");
    }
    const [hA, mA, d] = ang();
    const rad = (x) => (x * Math.PI) / 180;
    const a0 = Math.min(hA, mA), a1 = Math.max(hA, mA), big = a1 - a0 > 180;
    const [s0, s1] = big ? [a1, a0 + 360] : [a0, a1];
    const r = 34;
    s("path", { d: `M${cx} ${cy} L${cx + r * Math.sin(rad(s0))} ${cy - r * Math.cos(rad(s0))} A${r} ${r} 0 0 1 ${cx + r * Math.sin(rad(s1))} ${cy - r * Math.cos(rad(s1))} Z`, class: "angle-fill" }, svg);
    s("line", { x1: cx, y1: cy, x2: cx + 55 * Math.sin(rad(hA)), y2: cy - 55 * Math.cos(rad(hA)), class: "stroke-a", "stroke-width": 6, "stroke-linecap": "round" }, svg);
    s("line", { x1: cx, y1: cy, x2: cx + 85 * Math.sin(rad(mA)), y2: cy - 85 * Math.cos(rad(mA)), class: "stroke-b", "stroke-width": 4, "stroke-linecap": "round" }, svg);
    s("circle", { cx, cy, r: 4, class: "fill-text" }, svg);
    const hh = Math.floor(t / 60) % 12 || 12, mm = Math.floor(t % 60), ss = Math.round((t % 1) * 60);
    label(svg, 290, 90, `${hh}:${String(mm).padStart(2, "0")}${ss ? ":" + String(ss).padStart(2, "0") : ""}`, "lbl big");
    label(svg, 290, 120, `kot = ${fmt(d, 1)}°`, "lbl");
  };
  const info = () => {
    const H = Math.floor(t / 60) % 12, M = t % 60, [, , d] = ang();
    out.innerHTML = texBlock(`\\varphi = |30^\\circ \\cdot h - 5{,}5^\\circ \\cdot m| = |30 \\cdot ${H} - 5{,}5 \\cdot ${fmt(M, 2)}| \\to ${fmt(d, 1)}^\\circ`) +
      `<p>Minutni kazalec se v minuti zavrti za 6°, urni pa za 0,5°. Vsako minuto ga minutni prehiti za 5,5°.</p><p class="muted">Kazalca se pokrijeta 11-krat v 12 urah, vsakih 12/11 ure ≈ 1 h 5 min 27 s.</p>`;
  };
  const sl = slider({ label: "čas", min: 0, max: 719, value: t, format: (v) => `${Math.floor(v / 60) % 12 || 12}:${String(Math.floor(v % 60)).padStart(2, "0")}`, onInput: (x) => ((t = x), draw(), info()) });
  let k = 0;
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [sl, buttons(button("Naslednje pokritje", () => ((k = (Math.round(t / (720 / 11)) + 1) % 11), (t = (k * 720) / 11), sl.set(Math.floor(t), true), draw(), info()), "primary small"))],
    out,
    tryText: "Kolikšen je kot med kazalcema ob 3:30? Ob kateri uri med 2. in 3. uro se kazalca pokrijeta?",
  });
}

// ------------------------------------------------------------ sredine: AM ≥ GM ≥ HM
export function sredine(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let a = 6, b = 2;
  const draw = () => {
    svg.replaceChildren();
    const k = 280 / (a + b), x0 = 30, y0 = 200, R = ((a + b) / 2) * k, cx = x0 + R, C = x0 + a * k;
    s("path", { d: `M${x0} ${y0} A${R} ${R} 0 0 1 ${x0 + 2 * R} ${y0}`, class: "shell" }, svg);
    s("line", { x1: x0, y1: y0, x2: x0 + 2 * R, y2: y0, class: "axis" }, svg);
    const gm = Math.sqrt(a * b) * k, am = R;
    // AM: polmer do vrha, GM: navpičnica v C, HM: projekcija
    s("line", { x1: cx, y1: y0, x2: C, y2: y0 - gm, class: "graph-line stroke-a" }, svg);
    s("line", { x1: C, y1: y0, x2: C, y2: y0 - gm, class: "graph-line stroke-b" }, svg);
    // nožišče pravokotnice iz C na polmer
    const ux = (C - cx) / am, uy = -gm / am, proj = (C - cx) * ux, px = cx + ux * proj, py = y0 + uy * proj;
    s("line", { x1: C, y1: y0, x2: px, y2: py, class: "thin-line" }, svg);
    s("line", { x1: px, y1: py, x2: C, y2: y0 - gm, class: "graph-line stroke-c" }, svg);
    s("line", { x1: cx, y1: y0, x2: cx, y2: y0 - R, class: "guide" }, svg);
    label(svg, (x0 + C) / 2, y0 + 14, `a = ${fmt(a, 1)}`, "tick small b");
    label(svg, (C + x0 + 2 * R) / 2, y0 + 14, `b = ${fmt(b, 1)}`, "tick small b");
    s("circle", { cx: C, cy: y0, r: 4, class: "fill-text" }, svg);
    // stolpci
    [["AM", (a + b) / 2, "a"], ["GM", Math.sqrt(a * b), "b"], ["HM", (2 * a * b) / (a + b), "c"], ["QM", Math.sqrt((a * a + b * b) / 2), "danger"]].forEach(([n, v, col], i) => {
      const y = 14 + i * 16;
      s("rect", { x: 230, y: y - 6, width: (v / Math.max(a, b)) * 90, height: 11, rx: 3, class: `fill-${col}` }, svg);
      label(svg, 226, y, `${n} ${fmt(v, 2)}`, "tick small", "end");
    });
  };
  const info = () => {
    out.innerHTML = texBlock(`\\sqrt{\\tfrac{a^2+b^2}{2}} \\ge \\frac{a+b}{2} \\ge \\sqrt{ab} \\ge \\frac{2ab}{a+b}`) +
      `<p>Na polkrogu nad daljico a + b je <b>polmer</b> aritmetična sredina (oranžno), <b>višina v točki delitve</b> geometrijska sredina (turkizno), njena projekcija na polmer pa harmonična sredina (vijolično). Ker je polmer najdaljša taka daljica, je AM ≥ GM.</p>
       <p class="muted">${Math.abs(a - b) < 1e-9 ? '<b class="ok-text">a = b: vse sredine so enake (enakost).</b>' : "Enakost velja natanko, ko je a = b."} Uporaba: med pravokotniki z danim obsegom ima kvadrat največjo ploščino.</p>`;
  };
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [slider({ label: "a", min: 0.5, max: 10, step: 0.5, value: a, onInput: (x) => ((a = x), upd()) }), slider({ label: "b", min: 0.5, max: 10, step: 0.5, value: b, onInput: (x) => ((b = x), upd()) })],
    out,
    tryText: "Kdaj so vse štiri sredine enake? Dokaži AM ≥ GM iz (√a − √b)² ≥ 0.",
  });
}

// ------------------------------------------------------------ urejanje: neenakost urejanja, Cauchy-Schwarz
export function urejanje(el) {
  const out = readout();
  const svg = svgBox(340, 220);
  const A = [1, 2, 4, 7];
  let B = [6, 2, 5, 3], sel = null;
  const S = () => A.reduce((t, x, i) => t + x * B[i], 0);
  const draw = () => {
    svg.replaceChildren();
    let x = 20;
    A.forEach((a, i) => {
      const w = a * 9, hgt = B[i] * 20;
      s("rect", { x, y: 190 - hgt, width: w, height: hgt, class: "bar fill-a", opacity: 0.55, rx: 2 }, svg);
      label(svg, x + w / 2, 205, `${a}·${B[i]}`, "tick small b");
      x += w + 8;
    });
    label(svg, 20, 16, `S = ${A.map((a, i) => `${a}·${B[i]}`).join(" + ")} = ${S()}`, "lbl small", "start");
    B.forEach((b, i) => {
      const g = s("g", { class: "drag" }, svg);
      s("rect", { x: 230 + (i % 2) * 52, y: 40 + Math.floor(i / 2) * 50, width: 44, height: 40, rx: 8, class: sel === i ? "ion-tile an" : "ion-tile cat" }, g);
      label(g, 252 + (i % 2) * 52, 60 + Math.floor(i / 2) * 50, `b${"₁₂₃₄"[i]}=${b}`, "tick small b");
      g.addEventListener("click", () => {
        if (sel === null) sel = i;
        else {
          [B[sel], B[i]] = [B[i], B[sel]];
          sel = null;
        }
        draw();
        info();
      });
    });
    label(svg, 282, 160, "klikni dva, da ju zamenjaš", "tick small");
  };
  const info = () => {
    const sorted = [...B].sort((x, y) => x - y), max = A.reduce((t, a, i) => t + a * sorted[i], 0), min = A.reduce((t, a, i) => t + a * sorted[3 - i], 0);
    const cs = A.reduce((t, a) => t + a * a, 0) * B.reduce((t, b) => t + b * b, 0);
    out.innerHTML = `<p>Vsota S = Σ a<sub>i</sub>b<sub>i</sub> je ploščina pravokotnikov. Največja je (${max}), ko sta zaporedji <b>enako urejeni</b>, najmanjša (${min}), ko sta urejeni nasprotno. Zdaj je S = <b>${S()}</b>${S() === max ? ' <b class="ok-text">(največja)</b>' : S() === min ? " (najmanjša)" : ""}.</p>` +
      texBlock(`\\Big(\\sum a_i b_i\\Big)^2 = ${S() ** 2} \\le \\sum a_i^2 \\sum b_i^2 = ${cs}`) +
      `<p class="muted">Cauchy-Schwarzeva neenakost; enakost velja, ko sta vektorja (a<sub>i</sub>) in (b<sub>i</sub>) sorazmerna.</p>`;
  };
  draw();
  info();
  layout(el, { stage: svg, controls: [buttons(button("Premešaj", () => ((B = [...B].sort(() => Math.random() - 0.5)), (sel = null), draw(), info())))], out, tryText: "Uredi b-je tako, da bo S največja. Zakaj je velik × velik + majhen × majhen več kot navzkriž?" });
}

// ------------------------------------------------------------ vieta: ničle in koeficienti polinoma
export function vieta(el) {
  const out = readout();
  const svg = svgBox(340, 280);
  let deg = 2, r = [-1, 2, 3];
  const p = (x) => r.slice(0, deg).reduce((t, ri) => t * (x - ri), 1);
  let A;
  const draw = () => {
    svg.replaceChildren();
    A = axes(svg, { W: 340, H: 280, x: [-5, 5], y: [-8, 8], xStep: 1, yStep: 2 });
    s("path", { d: fnPath(p, A), class: "graph-line" }, svg);
    r.slice(0, deg).forEach((ri, i) => {
      const hd = handle(svg, ["a", "b", "c"][i]);
      hd.move(A.X(ri), A.Y(0));
      draggable(svg, hd, (x) => {
        r[i] = Math.round(clamp(A.inv(x, 0)[0], -4.5, 4.5) * 2) / 2;
        draw();
        info();
      });
      label(svg, A.X(ri), A.Y(0) + 22, `x${"₁₂₃"[i]}`, "tick small b");
    });
  };
  const info = () => {
    const [a, b, c] = r;
    const sg = (v, x = "") => (Math.abs(v) < 1e-9 ? "" : (v < 0 ? "- " : "+ ") + (x && Math.abs(Math.abs(v) - 1) < 1e-9 ? "" : fmt(Math.abs(v), 2)) + x);
    out.innerHTML = deg === 2
      ? texBlock(`p(x) = (x ${sg(-a) || ""})(x ${sg(-b) || ""}) = x^2 ${sg(-(a + b), "x")} ${sg(a * b)}`) + `<p>Vietovi formuli: x₁ + x₂ = ${fmt(a + b, 2)} = −b/a, x₁x₂ = ${fmt(a * b, 2)} = c/a.</p>`
      : texBlock(`p(x) = x^3 ${sg(-(a + b + c), "x^2")} ${sg(a * b + b * c + a * c, "x")} ${sg(-a * b * c)}`) + `<p>x₁ + x₂ + x₃ = ${fmt(a + b + c, 2)}, x₁x₂ + x₂x₃ + x₁x₃ = ${fmt(a * b + b * c + a * c, 2)}, x₁x₂x₃ = ${fmt(a * b * c, 2)}.</p>`;
    out.innerHTML += `<p class="muted">Povleci ničle po osi x. Koeficienti normiranega polinoma so (do predznaka) elementarne simetrične funkcije ničel.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [segmented({ options: [["2", "kvadratni"], ["3", "kubični"]], value: "2", onChange: (v) => ((deg = +v), draw(), info()) })],
    out,
    tryText: "Postavi ničli simetrično glede na 0. Kaj se zgodi z linearnim členom? Kdaj je prosti člen negativen?",
  });
}

// ------------------------------------------------------------ funkcijska: preizkus funkcijskih enačb
const FE = [
  ["f(x + y) = f(x) + f(y)", (f, x, y) => [f(x + y), f(x) + f(y)], "Cauchyjeva enačba. Zvezne rešitve so f(x) = kx. Namig: x = y = 0 da f(0) = 0."],
  ["f(xy) = f(x) · f(y)", (f, x, y) => [f(x * y), f(x) * f(y)], "Multiplikativna enačba. Rešitve so npr. f(x) = xⁿ, f ≡ 0 in f ≡ 1."],
  ["f(x + y) = f(x) · f(y)", (f, x, y) => [f(x + y), f(x) * f(y)], "Rešitve so eksponentne funkcije f(x) = aˣ (in f ≡ 0)."],
  ["f(x) + f(1 − x) = 1", (f, x) => [f(x) + f(1 - x), 1], "Graf je simetričen glede na točko (½, ½). Primer: f(x) = x."],
  ["f(f(x)) = x", (f, x) => [f(f(x)), x], "Involucija: graf je simetričen glede na premico y = x. Primeri: x, −x, 1 − x, 1/x."],
];
const CAND = [["2x", (x) => 2 * x], ["x", (x) => x], ["−x", (x) => -x], ["x²", (x) => x * x], ["x + 1", (x) => x + 1], ["1 − x", (x) => 1 - x], ["2ˣ", (x) => 2 ** x], ["0", () => 0], ["1", () => 1], ["x³", (x) => x ** 3]];
export function funkcijska(el) {
  const out = readout();
  let e = 0, c = 0, x = 1, y = 2;
  const info = () => {
    const [eq, fn, note] = FE[e], f = CAND[c][1];
    const [l, r] = fn(f, x, y);
    let bad = null;
    for (let i = 0; i < 400 && !bad; i++) {
      const a = Math.round((Math.random() * 8 - 4) * 4) / 4, b = Math.round((Math.random() * 8 - 4) * 4) / 4;
      const [L, R] = fn(f, a, b);
      if (Math.abs(L - R) > 1e-9 * (1 + Math.abs(L))) bad = [a, b, L, R];
    }
    out.innerHTML = `<p style="font-size:1.15em"><b>${eq}</b>, f(x) = <b>${CAND[c][0]}</b></p>
      <p>Pri x = ${fmt(x, 2)}, y = ${fmt(y, 2)}: leva stran = ${fmt(l, 3)}, desna stran = ${fmt(r, 3)} ${Math.abs(l - r) < 1e-9 ? "✓" : "✗"}</p>
      <p>${bad ? `<b class="bad-text">Ni rešitev.</b> Protiprimer: x = ${fmt(bad[0], 2)}, y = ${fmt(bad[1], 2)} da ${fmt(bad[2], 3)} ≠ ${fmt(bad[3], 3)}.` : '<b class="ok-text">Enačba velja pri vseh 400 preizkusih.</b> To še ni dokaz, je pa dober kandidat.'}</p>
      <p class="muted">${note} Pri tekmovanjih najprej vstavljamo posebne vrednosti (0, 1, −x, y = x) in iščemo lastnosti funkcije.</p>`;
  };
  info();
  layout(el, {
    controls: [
      select({ label: "enačba", options: FE.map((f, i) => [i, f[0]]), value: e, onChange: (v) => ((e = +v), info()) }),
      select({ label: "kandidat f(x)", options: CAND.map((f, i) => [i, f[0]]), value: c, onChange: (v) => ((c = +v), info()) }),
      slider({ label: "x", min: -3, max: 3, step: 0.25, value: x, onInput: (v) => ((x = v), info()) }),
      slider({ label: "y", min: -3, max: 3, step: 0.25, value: y, onInput: (v) => ((y = v), info()) }),
    ],
    out,
    tryText: "Najdi tri različne rešitve enačbe f(f(x)) = x. Katera funkcija reši f(xy) = f(x)f(y) in ni xⁿ?",
  });
}

// ------------------------------------------------------------ hanoi: Hanojski stolpi (rekurzija)
export function hanoi(el) {
  const out = readout();
  const svg = svgBox(340, 200);
  let n = 4, pegs, moves = 0, plan = [], sel = null;
  const reset = () => {
    pegs = [Array.from({ length: n }, (_, i) => n - i), [], []];
    moves = 0;
    plan = [];
    sel = null;
  };
  const solve = (k, a, b, c, list) => {
    if (!k) return;
    solve(k - 1, a, c, b, list);
    list.push([a, c]);
    solve(k - 1, b, a, c, list);
  };
  const move = (a, c) => {
    const d = pegs[a].at(-1);
    if (d == null || (pegs[c].length && pegs[c].at(-1) < d)) return false;
    pegs[c].push(pegs[a].pop());
    moves++;
    return true;
  };
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 10, y: 180, width: 320, height: 8, rx: 3, class: "fill-muted" }, svg);
    pegs.forEach((p, i) => {
      const x = 60 + i * 110;
      const g = s("g", { class: "drag" }, svg);
      s("rect", { x: x - 50, y: 40, width: 100, height: 140, class: "hit-area" }, g);
      s("rect", { x: x - 3, y: 50, width: 6, height: 130, rx: 3, class: sel === i ? "fill-accent" : "fill-muted" }, g);
      p.forEach((d, j) => s("rect", { x: x - 8 - d * 6, y: 166 - j * 16, width: 16 + d * 12, height: 14, rx: 5, class: `fill-${["a", "b", "c", "accent", "danger", "ok", "a"][d % 7]}` }, g));
      g.addEventListener("click", () => {
        if (sel === null) sel = pegs[i].length ? i : null;
        else {
          move(sel, i);
          sel = null;
        }
        draw();
        info();
      });
    });
  };
  const info = () => {
    const done = pegs[2].length === n;
    out.innerHTML = `<p>Potez: <b>${moves}</b>. Najmanjše število potez za ${n} ploščic je 2<sup>${n}</sup> − 1 = <b>${2 ** n - 1}</b>. ${done ? '<b class="ok-text">Stolp je prestavljen!</b>' : ""}</p>
      <p class="muted">Rekurzija: da prestaviš n ploščic, najprej prestavi n − 1 ploščic na pomožno palico, nato največjo, nato n − 1 ploščic nanjo. Zato T(n) = 2T(n − 1) + 1. Klikni palico, nato ciljno palico.</p>`;
  };
  const anim = animate(el, (() => {
    let acc = 0;
    return (dt) => {
      acc += dt;
      if (acc < 0.45) return;
      acc = 0;
      if (!plan.length) {
        if (pegs[2].length === n) return false;
        reset();
        solve(n, 0, 1, 2, plan);
      }
      const [a, c] = plan.shift();
      move(a, c);
      draw();
      info();
    };
  })(), { autoplay: false });
  reset();
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "ploščic", min: 2, max: 7, value: n, onInput: (v) => ((n = v), anim.pause(), reset(), draw(), info()) }),
      buttons(playButton(anim, { play: "Reši sam", pause: "Ustavi" }), button("Znova", () => (anim.pause(), reset(), draw(), info()))),
    ],
    out,
    tryText: "Prestavi 3 ploščice v 7 potezah. Zakaj se število potez ob vsaki novi ploščici podvoji (in poveča za 1)?",
  });
}

// ------------------------------------------------------------ grafi: stopnje točk, Ramseyjevo število R(3, 3)
export function grafi(el, { mode = "stopnje" } = {}) {
  const out = readout();
  const svg = svgBox(340, 260);
  let md = mode, nV = 6, E = new Map(), sel = null;
  const pos = (i) => [170 + 105 * Math.sin((2 * Math.PI * i) / nV), 128 - 105 * Math.cos((2 * Math.PI * i) / nV)];
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const randomGraph = () => {
    E = new Map();
    for (let i = 0; i < nV; i++) for (let j = i + 1; j < nV; j++) if (Math.random() < 0.4) E.set(key(i, j), 1);
  };
  const triangle = () => {
    for (let a = 0; a < nV; a++) for (let b = a + 1; b < nV; b++) for (let c = b + 1; c < nV; c++) {
      const x = E.get(key(a, b)), y = E.get(key(b, c)), z = E.get(key(a, c));
      if (x && x === y && y === z) return [a, b, c, x];
    }
    return null;
  };
  const draw = () => {
    svg.replaceChildren();
    const tri = md === "ramsey" ? triangle() : null;
    for (let i = 0; i < nV; i++)
      for (let j = i + 1; j < nV; j++) {
        const c = E.get(key(i, j)), [x1, y1] = pos(i), [x2, y2] = pos(j);
        if (md === "stopnje" && !c) continue;
        const inTri = tri && [tri[0], tri[1], tri[2]].includes(i) && [tri[0], tri[1], tri[2]].includes(j);
        const ln = s("line", { x1, y1, x2, y2, class: md === "ramsey" ? (c === 1 ? "edge-red" : c === 2 ? "edge-blue" : "edge-none") : "edge-on", "stroke-width": inTri ? 6 : md === "ramsey" ? 3.5 : 3 }, svg);
        if (md === "ramsey") {
          ln.classList.add("drag");
          ln.addEventListener("click", () => (E.set(key(i, j), ((c || 0) + 1) % 3), draw(), info()));
        }
      }
    for (let i = 0; i < nV; i++) {
      const [x, y] = pos(i), deg = [...E.keys()].filter((k) => k.split("-").map(Number).includes(i)).length;
      const g = s("g", { class: "drag" }, svg);
      s("circle", { cx: x, cy: y, r: 15, class: sel === i ? "fill-accent" : "fill-c" }, g);
      label(g, x, y, md === "stopnje" ? String(deg) : String.fromCharCode(65 + i), "tick small b inv");
      if (md === "stopnje")
        g.addEventListener("click", () => {
          if (sel === null) sel = i;
          else if (sel !== i) {
            const k = key(sel, i);
            E.has(k) ? E.delete(k) : E.set(k, 1);
            sel = null;
          } else sel = null;
          draw();
          info();
        });
    }
  };
  const info = () => {
    if (md === "stopnje") {
      const degs = Array.from({ length: nV }, (_, i) => [...E.keys()].filter((k) => k.split("-").map(Number).includes(i)).length);
      const odd = degs.filter((d) => d % 2).length;
      out.innerHTML = texBlock(`\\sum \\deg(v) = ${degs.join(" + ")} = ${degs.reduce((a, b) => a + b, 0)} = 2 \\cdot ${E.size}`) +
        `<p>Vsota stopenj je vedno <b>dvakratnik števila povezav</b> (lema o rokovanju), zato je točk z liho stopnjo vedno sodo mnogo (zdaj ${odd}).</p><p class="muted">Klikni dve točki, da dodaš ali odstraniš povezavo. V točkah je zapisana stopnja.</p>`;
    } else {
      const tri = triangle(), full = E.size === (nV * (nV - 1)) / 2 && [...E.values()].every(Boolean);
      out.innerHTML = `<p>Pobarvaj vse povezave med ${nV} točkami rdeče ali turkizno (klik na povezavo). ${tri ? `<b class="bad-text">Enobarven trikotnik ${String.fromCharCode(65 + tri[0])}${String.fromCharCode(65 + tri[1])}${String.fromCharCode(65 + tri[2])}!</b>` : full ? '<b class="ok-text">Brez enobarvnega trikotnika!</b>' : "Ali se lahko izogneš enobarvnemu trikotniku?"}</p>
        <p class="muted">${nV === 6 ? "Pri 6 točkah enobarvni trikotnik vedno nastane (R(3, 3) = 6): točka A ima 5 povezav, po Dirichletu so vsaj 3 iste barve." : "Pri 5 točkah se mu lahko izogneš: pobarvaj obod petkotnika rdeče, diagonale turkizno."}</p>`;
    }
  };
  const restart = () => (md === "stopnje" ? randomGraph() : (E = new Map()), (sel = null), draw(), info());
  restart();
  layout(el, {
    stage: svg,
    controls: [
      segmented({ options: [["stopnje", "stopnje točk"], ["ramsey", "barvanje povezav"]], value: md, onChange: (v) => ((md = v), restart()) }),
      slider({ label: "število točk", min: 4, max: 8, value: nV, onInput: (v) => ((nV = v), restart()) }),
      buttons(
        button("Naključno", () => {
          if (md === "stopnje") randomGraph();
          else for (let i = 0; i < nV; i++) for (let j = i + 1; j < nV; j++) E.set(key(i, j), rint(1, 2));
          draw();
          info();
        }),
        button("Počisti", () => ((E = new Map()), draw(), info()))
      ),
    ],
    out,
    tryText: "Pri barvanju povezav poskusi s 5 točkami pobarvati vse povezave brez enobarvnega trikotnika. Zakaj pri 6 točkah ne gre?",
  });
}

// ------------------------------------------------------------ potenca: potenca točke na krožnico
export function potenca(el) {
  const out = readout();
  const svg = svgBox(340, 280);
  const O = [150, 140], r = 80;
  let P = [290, 90], t1 = 200, t2 = 165;
  const inter = (ang) => {
    const dx = Math.cos((ang * Math.PI) / 180), dy = Math.sin((ang * Math.PI) / 180);
    const fx = P[0] - O[0], fy = P[1] - O[1];
    const b = fx * dx + fy * dy, c = fx * fx + fy * fy - r * r, D = b * b - c;
    if (D < 0) return null;
    const s1 = -b - Math.sqrt(D), s2 = -b + Math.sqrt(D);
    return [[P[0] + s1 * dx, P[1] + s1 * dy, s1], [P[0] + s2 * dx, P[1] + s2 * dy, s2]];
  };
  const draw = () => {
    svg.replaceChildren();
    s("circle", { cx: O[0], cy: O[1], r, class: "shell" }, svg);
    s("circle", { cx: O[0], cy: O[1], r: 3, class: "fill-text" }, svg);
    label(svg, O[0] - 10, O[1] + 10, "O", "tick small b");
    [[t1, "a"], [t2, "c"]].forEach(([t, col], k) => {
      const I = inter(t);
      const far = 400;
      const dx = Math.cos((t * Math.PI) / 180), dy = Math.sin((t * Math.PI) / 180);
      s("line", { x1: P[0] - dx * 30, y1: P[1] - dy * 30, x2: P[0] + dx * far, y2: P[1] + dy * far, class: `graph-line stroke-${col}`, opacity: 0.85 }, svg);
      if (I) I.forEach(([x, y], j) => (s("circle", { cx: x, cy: y, r: 4.5, class: `fill-${col}` }, svg), label(svg, x + 10, y - 8, ["A", "B", "C", "D"][k * 2 + j], "tick small b")));
    });
    const d = Math.hypot(P[0] - O[0], P[1] - O[1]);
    if (d > r) {
      const a = Math.atan2(P[1] - O[1], P[0] - O[0]), b = Math.acos(r / d);
      const T = [O[0] + r * Math.cos(a + b), O[1] + r * Math.sin(a + b)];
      s("line", { x1: P[0], y1: P[1], x2: T[0], y2: T[1], class: "graph-line stroke-b" }, svg);
      s("circle", { cx: T[0], cy: T[1], r: 4, class: "fill-b" }, svg);
      label(svg, T[0] + 8, T[1] + 10, "T", "tick small b");
    }
    const hd = handle(svg, "accent");
    hd.move(...P);
    draggable(svg, hd, (x, y) => ((P = [clamp(x, 10, 330), clamp(y, 10, 270)]), draw(), info()));
    label(svg, P[0] + 12, P[1] - 12, "P", "lbl small");
  };
  const info = () => {
    const d = Math.hypot(P[0] - O[0], P[1] - O[1]), pw = (d * d - r * r) / 400;
    const I1 = inter(t1), I2 = inter(t2);
    const prod = (I) => (I ? Math.abs(I[0][2] * I[1][2]) / 400 : null);
    out.innerHTML = texBlock(`\\overline{PA}\\cdot\\overline{PB} = ${I1 ? fmt(prod(I1), 2) : "–"} \\qquad \\overline{PC}\\cdot\\overline{PD} = ${I2 ? fmt(prod(I2), 2) : "–"} \\qquad |OP^2 - r^2| = ${fmt(Math.abs(pw), 2)}`) +
      `<p>Za vsako premico skozi P je produkt razdalj do presečišč s krožnico enak: to je <b>potenca točke</b> p(P) = OP² − r² = ${fmt(pw, 2)}. ${d > r ? "Točka je zunaj krožnice (p > 0) in velja tudi PT² = PA · PB za tangento." : "Točka je znotraj krožnice (p < 0): izrek o sekajočih se tetivah."}</p>
       <p class="muted">Enote so poljubne (kvadrati enot slike / 400). Povleci točko P in spreminjaj smeri premic.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [slider({ label: "smer 1. premice", min: 0, max: 359, value: t1, unit: "°", onInput: (v) => ((t1 = v), draw(), info()) }), slider({ label: "smer 2. premice", min: 0, max: 359, value: t2, unit: "°", onInput: (v) => ((t2 = v), draw(), info()) })],
    out,
    tryText: "Povleci P v notranjost krožnice. Ali produkt ostane enak za vse premice? Kje je potenca enaka 0?",
  });
}

// ------------------------------------------------------------ ceva: Cevov izrek
export function ceva(el) {
  const out = readout();
  const svg = svgBox(340, 270);
  const A = [60, 240], B = [300, 240], C = [140, 30];
  let u = 0.5, v = 0.5, w = 0.5;
  const L = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
  const ratio = () => (u / (1 - u)) * (v / (1 - v)) * (w / (1 - w));
  const draw = () => {
    svg.replaceChildren();
    s("path", { d: `M${A} L${B} L${C} Z`, class: "shape" }, svg);
    const D = L(B, C, u), E = L(C, A, v), F = L(A, B, w);
    const conc = Math.abs(ratio() - 1) < 0.02;
    [[A, D], [B, E], [C, F]].forEach(([P, Q]) => s("line", { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: `graph-line ${conc ? "stroke-ok" : "stroke-c"}` }, svg));
    [[A, "A", -12, 8], [B, "B", 12, 8], [C, "C", 0, -12], [D, "D", 12, 0], [E, "E", -12, 0], [F, "F", 0, 14]].forEach(([P, n, dx, dy]) => (s("circle", { cx: P[0], cy: P[1], r: 4, class: "fill-text" }, svg), label(svg, P[0] + dx, P[1] + dy, n, "tick b")));
    if (conc) {
      // presečišče AD in BE
      const x1 = A[0], y1 = A[1], x2 = D[0], y2 = D[1], x3 = B[0], y3 = B[1], x4 = E[0], y4 = E[1];
      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      s("circle", { cx: x1 + t * (x2 - x1), cy: y1 + t * (y2 - y1), r: 5, class: "fill-ok" }, svg);
    }
  };
  const info = () => {
    const q = ratio();
    out.innerHTML = texBlock(`\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB} = ${fmt(u / (1 - u), 2)} \\cdot ${fmt(v / (1 - v), 2)} \\cdot ${fmt(w / (1 - w), 2)} = ${fmt(q, 3)}`) +
      `<p><b>Cevov izrek:</b> daljice AD, BE in CF se sekajo v eni točki natanko tedaj, ko je produkt razmerij enak 1. ${Math.abs(q - 1) < 0.02 ? '<b class="ok-text">Daljice so sočasne.</b>' : "Zdaj se ne sekajo v eni točki."}</p>
       <p class="muted">Primeri: težiščnice (vsa razmerja 1), simetrale kotov (razmerja stranic), višine. Menelajev izrek je podoben, a za točke na premici (produkt = −1 z usmerjenimi razdaljami).</p>`;
  };
  const upd = () => (draw(), info());
  const sw = slider({ label: "F na AB", min: 0.05, max: 0.95, step: 0.01, value: w, onInput: (x) => ((w = x), upd()) });
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "D na BC", min: 0.05, max: 0.95, step: 0.01, value: u, onInput: (x) => ((u = x), upd()) }),
      slider({ label: "E na CA", min: 0.05, max: 0.95, step: 0.01, value: v, onInput: (x) => ((v = x), upd()) }),
      sw,
      buttons(button("Naredi sočasne", () => { const q = (u / (1 - u)) * (v / (1 - v)); sw.set(Math.round((1 / (1 + q)) * 100) / 100); }, "primary small")),
    ],
    out,
    tryText: "Premakni D in E ter s gumbom poišči F, da se daljice sekajo. Kdaj je to težišče?",
  });
}

// ------------------------------------------------------------ najkrajsa: najkrajša pot z zrcaljenjem (Heronov problem)
export function najkrajsa(el) {
  const out = readout();
  const svg = svgBox(340, 280);
  const A = [60, 60], B = [280, 110], yl = 170;
  let px = 120, show = true;
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 0, y: yl, width: 340, height: 110, class: "fill-soft", opacity: 0.5 }, svg);
    s("line", { x1: 0, y1: yl, x2: 340, y2: yl, class: "axis" }, svg);
    label(svg, 320, yl + 14, "reka", "tick small", "end");
    const B2 = [B[0], 2 * yl - B[1]];
    const opt = A[0] + ((B2[0] - A[0]) * (yl - A[1])) / (B2[1] - A[1]);
    if (show) {
      s("line", { x1: A[0], y1: A[1], x2: B2[0], y2: B2[1], class: "guide" }, svg);
      s("line", { x1: px, y1: yl, x2: B2[0], y2: B2[1], class: "thin-line", "stroke-dasharray": "4 3" }, svg);
      s("circle", { cx: B2[0], cy: B2[1], r: 5, class: "fill-muted" }, svg);
      label(svg, B2[0] + 12, B2[1], "B'", "tick b", "start");
      s("circle", { cx: opt, cy: yl, r: 4, class: "fill-ok" }, svg);
    }
    s("path", { d: `M${A[0]} ${A[1]} L${px} ${yl} L${B[0]} ${B[1]}`, class: "graph-line stroke-a" }, svg);
    [[A, "A"], [B, "B"]].forEach(([P, n]) => (s("circle", { cx: P[0], cy: P[1], r: 6, class: "fill-accent" }, svg), label(svg, P[0], P[1] - 14, n, "lbl")));
    const hd = handle(svg, "a");
    hd.move(px, yl);
    draggable(svg, hd, (x) => ((px = clamp(x, 5, 335)), draw(), info()));
  };
  const info = () => {
    const d = Math.hypot(px - A[0], yl - A[1]) + Math.hypot(B[0] - px, B[1] - yl);
    const B2 = [B[0], 2 * yl - B[1]], m = Math.hypot(B2[0] - A[0], B2[1] - A[1]);
    out.innerHTML = `<p>Pot A → P → B je dolga <b>${fmt(d / 20, 2)}</b> enot, najkrajša možna je ${fmt(m / 20, 2)}. ${d - m < 0.5 ? '<b class="ok-text">Našel si najkrajšo pot!</b>' : ""}</p>
      <p>Trik: točko B prezrcalimo čez reko v B'. Ker je PB = PB', je pot A → P → B enako dolga kot A → P → B'. Ta je najkrajša, ko je ravna (trikotniška neenakost). V tej točki je vpadni kot enak odbojnemu, kot pri svetlobi.</p>`;
  };
  draw();
  info();
  layout(el, { stage: svg, controls: [toggle("pokaži zrcaljenje", show, (v) => ((show = v), draw()))], out, tryText: "Povleci točko P na reki tako, da bo pot najkrajša. Primerjaj kota, ki ju poti oklepata z reko." });
}

// ------------------------------------------------------------ legendre: eksponent praštevila v n!
export function legendre(el) {
  const out = readout();
  const svg = svgBox(340, 250);
  let n = 30, p = 5;
  const vp = (k) => {
    let c = 0;
    while (k % p === 0 && k) (k /= p), c++;
    return c;
  };
  const draw = () => {
    svg.replaceChildren();
    const cols = 10, sz = 32;
    for (let k = 1; k <= n; k++) {
      const x = 10 + ((k - 1) % cols) * sz, y = 8 + Math.floor((k - 1) / cols) * 40;
      const c = vp(k);
      s("rect", { x, y, width: sz - 4, height: 34, rx: 6, class: c ? "pt-bg k-sel" : "pt-bg" }, svg);
      label(svg, x + (sz - 4) / 2, y + 12, String(k), "tick small b");
      for (let j = 0; j < c; j++) s("circle", { cx: x + 7 + j * 7, cy: y + 26, r: 2.8, class: j === 0 ? "fill-a" : j === 1 ? "fill-c" : "fill-danger" }, svg);
    }
  };
  const info = () => {
    const terms = [];
    for (let q = p; q <= n; q *= p) terms.push([q, Math.floor(n / q)]);
    const tot = terms.reduce((a, [, t]) => a + t, 0);
    out.innerHTML = texBlock(`v_{${p}}(${n}!) = ${terms.map(([q]) => `\\left\\lfloor \\tfrac{${n}}{${q}} \\right\\rfloor`).join(" + ") || "0"} = ${terms.map(([, t]) => t).join(" + ") || 0} = ${tot}`) +
      `<p>Število ${n}! je deljivo s ${p}<sup>${tot}</sup>, ne pa s ${p}<sup>${tot + 1}</sup>. Vsak večkratnik ${p} prispeva eno piko, vsak večkratnik ${p}² še eno, … (Legendrova formula).</p>
       <p class="muted">${p === 5 ? `Ker je dvojk več kot petic, ima ${n}! na koncu natanko ${tot} ničel.` : "Pri p = 5 dobiš število ničel na koncu n!."}</p>`;
  };
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "n", min: 1, max: 60, value: n, onInput: (v) => ((n = v), upd()) }),
      segmented({ options: [["2", "p = 2"], ["3", "p = 3"], ["5", "p = 5"], ["7", "p = 7"]], value: "5", onChange: (v) => ((p = +v), upd()) }),
    ],
    out,
    tryText: "S koliko ničlami se konča 50!? Zakaj ima 25 dve piki pri p = 5?",
  });
}
