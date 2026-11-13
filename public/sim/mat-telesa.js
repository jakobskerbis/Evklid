// Simulacija: geometrijska telesa v 3D (vrtenje s prstom), mreže, površina in prostornina.
import { h, s, svgBox, slider, select, toggle, button, buttons, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, animate, playButton, svgPoint, plural } from "./kit.js";

const BODIES = {
  kocka: { name: "kocka", params: [["a", 1, 6, 3]] },
  kvader: { name: "kvader", params: [["a", 1, 6, 4], ["b", 1, 6, 3], ["c", 1, 6, 2]] },
  prizma: { name: "pravilna prizma", params: [["n (oglišča osnove)", 3, 8, 6], ["a", 1, 5, 2], ["v", 1, 6, 4]] },
  valj: { name: "valj", params: [["r", 1, 4, 2], ["v", 1, 6, 4]] },
  piramida: { name: "pravilna piramida", params: [["n (oglišča osnove)", 3, 8, 4], ["a", 1, 5, 3], ["v", 1, 6, 4]] },
  stozec: { name: "stožec", params: [["r", 1, 4, 2], ["v", 1, 6, 4]] },
  krogla: { name: "krogla", params: [["r", 1, 4, 3]] },
};

// Mreža telesa: seznam ploskev [[točke 3D], razred]. Os y je navpična.
function mesh(kind, p, units) {
  const F = [];
  const quad = (A, B, C, D, cls) => F.push([[A, B, C, D], cls]);
  if (kind === "kocka" || kind === "kvader") {
    const [a, b, c] = kind === "kocka" ? [p[0], p[0], p[0]] : p; // a = širina (x), b = globina (z), c = višina (y)
    const x0 = -a / 2, z0 = -b / 2;
    const add = (fn, n1, n2, cls) => {
      const s1 = units ? n1 : 1, s2 = units ? n2 : 1;
      for (let i = 0; i < s1; i++) for (let j = 0; j < s2; j++) {
        const u0 = i / s1, u1 = (i + 1) / s1, v0 = j / s2, v1 = (j + 1) / s2;
        F.push([[fn(u0, v0), fn(u1, v0), fn(u1, v1), fn(u0, v1)], cls]);
      }
    };
    add((u, v) => [x0 + u * a, 0, z0 + v * b], a, b, "base");
    add((u, v) => [x0 + u * a, c, z0 + v * b], a, b, "base");
    add((u, v) => [x0 + u * a, v * c, z0], a, c, "side");
    add((u, v) => [x0 + u * a, v * c, z0 + b], a, c, "side");
    add((u, v) => [x0, v * c, z0 + u * b], b, c, "side2");
    add((u, v) => [x0 + a, v * c, z0 + u * b], b, c, "side2");
    return F;
  }
  const ring = (n, r, y, off = 0) => Array.from({ length: n }, (_, i) => [r * Math.cos(off + (2 * Math.PI * i) / n), y, r * Math.sin(off + (2 * Math.PI * i) / n)]);
  if (kind === "prizma" || kind === "valj") {
    const n = kind === "valj" ? 40 : p[0];
    const R = kind === "valj" ? p[0] : p[1] / (2 * Math.sin(Math.PI / n));
    const hgt = kind === "valj" ? p[1] : p[2];
    const lo = ring(n, R, 0), hi = ring(n, R, hgt);
    F.push([lo, "base"], [hi, "base"]);
    for (let i = 0; i < n; i++) quad(lo[i], lo[(i + 1) % n], hi[(i + 1) % n], hi[i], kind === "valj" ? "side smooth" : "side");
    return F;
  }
  if (kind === "piramida" || kind === "stozec") {
    const n = kind === "stozec" ? 40 : p[0];
    const R = kind === "stozec" ? p[0] : p[1] / (2 * Math.sin(Math.PI / n));
    const hgt = kind === "stozec" ? p[1] : p[2];
    const lo = ring(n, R, 0), top = [0, hgt, 0];
    F.push([lo, "base"]);
    for (let i = 0; i < n; i++) F.push([[lo[i], lo[(i + 1) % n], top], kind === "stozec" ? "side smooth" : "side"]);
    return F;
  }
  // krogla: pasovi
  const r = p[0], N = 18, M = 12;
  for (let j = 0; j < M; j++) {
    const t0 = -Math.PI / 2 + (Math.PI * j) / M, t1 = t0 + Math.PI / M;
    for (let i = 0; i < N; i++) {
      const f0 = (2 * Math.PI * i) / N, f1 = f0 + (2 * Math.PI) / N;
      const P = (t, f) => [r * Math.cos(t) * Math.cos(f), r + r * Math.sin(t), r * Math.cos(t) * Math.sin(f)];
      F.push([[P(t0, f0), P(t0, f1), P(t1, f1), P(t1, f0)], "side smooth sphere"]);
    }
  }
  return F;
}

function formulas(kind, p) {
  const T = (x) => tfmt(x, 2);
  // ali je vrednost na 2 decimalki natančna (potem »=«, sicer »≈«)
  const ex = (...xs) => xs.every((x) => Math.abs(x - Math.round(x * 100) / 100) < 1e-9);
  const eq = (...xs) => (ex(...xs) ? "=" : "\\approx"), eqT = (...xs) => (ex(...xs) ? "=" : "≈");
  // osnovna ploskev: n = 3 enakostranični trikotnik, n = 4 kvadrat
  const lik = (n) => (n === 3 ? "enakostranični trikotnik" : n === 4 ? "kvadrat" : `pravilni ${n}-kotnik`);
  if (kind === "kocka") {
    const [a] = p;
    return { P: `P = 6a^2 = 6\\cdot ${a}^2 = ${6 * a * a}`, V: `V = a^3 = ${a}^3 = ${a ** 3}`, note: `Kocka iz ${a ** 3} ${(a ** 3) % 100 === 1 ? "enotske kocke" : "enotskih kock"}. Diagonala ploskve a√2 ≈ ${fmt(a * Math.SQRT2)}, telesna diagonala a√3 ≈ ${fmt(a * Math.sqrt(3))}.` };
  }
  if (kind === "kvader") {
    const [a, b, c] = p;
    return { P: `P = 2(ab + bc + ac) = 2(${a}\\cdot ${b} + ${b}\\cdot ${c} + ${a}\\cdot ${c}) = ${2 * (a * b + b * c + a * c)}`, V: `V = abc = ${a}\\cdot ${b}\\cdot ${c} = ${a * b * c}`, note: `V vsako plast ${plural(a * b, ["gre", "gresta", "gredo", "gre"])} ${a} · ${b} = ${a * b} ${plural(a * b, ["enotska kocka", "enotski kocki", "enotske kocke", "enotskih kock"])}, ${plural(c, ["plast je", "plasti sta", "plasti so", "plasti je"])} ${c}.` };
  }
  if (kind === "prizma") {
    const [n, a, v] = p;
    const O = (n * a * a) / (4 * Math.tan(Math.PI / n));
    return { P: `P = 2O + pl ${eq(O)} 2\\cdot ${T(O)} + ${n}\\cdot ${a}\\cdot ${v} ${eq(O, 2 * O + n * a * v)} ${T(2 * O + n * a * v)}`, V: `V = O\\cdot v ${eq(O)} ${T(O)}\\cdot ${v} ${eq(O, O * v)} ${T(O * v)}`, note: `Osnovna ploskev je ${lik(n)} s ploščino O ${eqT(O)} ${fmt(O)}. Plašč ${plural(n, ["sestavlja", "sestavljata", "sestavljajo", "sestavlja"])} ${n} ${plural(n, ["pravokotnik", "pravokotnika", "pravokotniki", "pravokotnikov"])} ${a} × ${v}.` };
  }
  if (kind === "valj") {
    const [r, v] = p;
    return { P: `P = 2\\pi r^2 + 2\\pi r v = 2\\pi r(r + v) \\approx ${T(2 * Math.PI * r * (r + v))}`, V: `V = \\pi r^2 v \\approx ${T(Math.PI * r * r * v)}`, note: `Plašč razgrnemo v pravokotnik s stranicama 2πr ≈ ${fmt(2 * Math.PI * r)} (obseg osnove) in v = ${v}.` };
  }
  if (kind === "piramida") {
    const [n, a, v] = p;
    const O = (n * a * a) / (4 * Math.tan(Math.PI / n)), ri = a / (2 * Math.tan(Math.PI / n)), va = Math.hypot(v, ri);
    return { P: `P = O + pl ${eq(O, va)} ${T(O)} + ${n}\\cdot\\frac{${a}\\cdot ${T(va)}}{2} ${eq(O, va, O + (n * a * va) / 2)} ${T(O + (n * a * va) / 2)}`, V: `V = \\frac{O\\cdot v}{3} ${eq(O)} \\frac{${T(O)}\\cdot ${v}}{3} ${eq(O, (O * v) / 3)} ${T((O * v) / 3)}`, note: `Osnovna ploskev je ${lik(n)}. Višina stranske ploskve v_a = √(v² + ρ²) ${eqT(va)} ${fmt(va)} (ρ je polmer včrtane krožnice osnove). Piramida ima tretjino prostornine prizme z enako osnovo in višino.` };
  }
  if (kind === "stozec") {
    const [r, v] = p;
    const sl = Math.hypot(r, v);
    return { P: `P = \\pi r^2 + \\pi r s = \\pi r(r + s) \\approx ${T(Math.PI * r * (r + sl))}`, V: `V = \\frac{\\pi r^2 v}{3} \\approx ${T((Math.PI * r * r * v) / 3)}`, note: `Stranica s = √(r² + v²) ${eqT(sl)} ${fmt(sl)}. Plašč je krožni izsek s polmerom s in lokom 2πr; njegov kot je ${fmt((360 * r) / sl, 1)}°.` };
  }
  const [r] = p;
  return { P: `P = 4\\pi r^2 \\approx ${T(4 * Math.PI * r * r)}`, V: `V = \\frac{4\\pi r^3}{3} \\approx ${T((4 * Math.PI * r ** 3) / 3)}`, note: `Krogle ne moremo razgrniti v ravnino, zato nima mreže. Njena površina je enaka ploščini štirih največjih krogov. Prostornina je 2/3 prostornine valja, ki krogli očrtamo (r, v = 2r): ${fmt((4 / 3) * Math.PI * r ** 3)} : ${fmt(2 * Math.PI * r ** 3)}.` };
}

// Merilo mreže za dane mere (uporabimo največje mere, da je merilo stalno in se sprememba vidi).
function netScale(kind, p) {
  if (kind === "kocka" || kind === "kvader") {
    const [a, b, c] = kind === "kocka" ? [p[0], p[0], p[0]] : p;
    return Math.min(320 / (2 * (a + b)), 280 / (2 * b + c));
  }
  if (kind === "prizma" || kind === "valj") {
    const curved = kind === "valj", n = curved ? 1 : p[0], a = curved ? 2 * Math.PI * p[0] : p[1], v = curved ? p[1] : p[2];
    const R = curved ? p[0] : a / (2 * Math.sin(Math.PI / n));
    return Math.min(320 / (curved ? a : n * a), 280 / (v + 4 * R));
  }
  if (kind === "piramida") {
    const [n, a, v] = p, R = a / (2 * Math.sin(Math.PI / n)), ri = a / (2 * Math.tan(Math.PI / n)), va = Math.hypot(v, ri);
    return Math.min(150 / (ri + va), 140 / (R + va));
  }
  if (kind === "stozec") {
    const [r, v] = p, sl = Math.hypot(r, v);
    return Math.min(110 / sl, 260 / (sl + 2 * r));
  }
  return 1;
}

// Mreža v ravnini (SVG).
function drawNet(svg, kind, p, SC = netScale(kind, p)) {
  svg.replaceChildren();
  const g = s("g", {}, svg);
  const poly = (pts, cls) => s("polygon", { points: pts.map((q) => q.join(",")).join(" "), class: `shape ${cls}` }, g);
  const regular = (n, R, cx, cy, off) => Array.from({ length: n }, (_, i) => [cx + R * Math.cos(off + (2 * Math.PI * i) / n), cy + R * Math.sin(off + (2 * Math.PI * i) / n)]);
  if (kind === "kocka" || kind === "kvader") {
    const [a, b, c] = kind === "kocka" ? [p[0], p[0], p[0]] : p;
    // križ: zgoraj b, sredina c (stranice: b a b a), spodaj b
    const rects = [[b, 0, a, b, "fill-a"], [0, b, b, c, "fill-c"], [b, b, a, c, "fill-b"], [b + a, b, b, c, "fill-c"], [2 * b + a, b, a, c, "fill-b"], [b, b + c, a, b, "fill-a"]];
    const sc = SC;
    rects.forEach(([x, y, w, hh, cls]) => poly([[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]].map(([u, v]) => [10 + u * sc, 10 + v * sc]), cls));
    return;
  }
  if (kind === "prizma" || kind === "valj") {
    const curved = kind === "valj";
    const n = curved ? 1 : p[0], a = curved ? 2 * Math.PI * p[0] : p[1], v = curved ? p[1] : p[2];
    const R = curved ? p[0] : a / (2 * Math.sin(Math.PI / n));
    const total = curved ? a : n * a;
    const sc = SC;
    const ox = 10, oy = 10 + 2 * R * sc;
    if (curved) poly([[0, 0], [a, 0], [a, v], [0, v]].map(([u, w]) => [ox + u * sc, oy + w * sc]), "fill-b");
    else for (let i = 0; i < n; i++) poly([[i * a, 0], [(i + 1) * a, 0], [(i + 1) * a, v], [i * a, v]].map(([u, w]) => [ox + u * sc, oy + w * sc]), i % 2 ? "fill-b" : "fill-c");
    if (curved) {
      s("circle", { cx: ox + (a / 2) * sc, cy: oy - R * sc, r: R * sc, class: "shape fill-a" }, g);
      s("circle", { cx: ox + (a / 2) * sc, cy: oy + (v + R) * sc, r: R * sc, class: "shape fill-a" }, g);
    } else {
      const ap = a / (2 * Math.tan(Math.PI / n));
      // osnovi pripneta na prvo stranico
      poly(regular(n, R * sc, ox + (a / 2) * sc, oy - ap * sc, Math.PI / 2 + Math.PI / n), "fill-a");
      poly(regular(n, R * sc, ox + (a / 2) * sc, oy + (v + ap) * sc, -Math.PI / 2 + Math.PI / n), "fill-a");
    }
    return;
  }
  if (kind === "piramida") {
    const [n, a, v] = p;
    const R = a / (2 * Math.sin(Math.PI / n)), ri = a / (2 * Math.tan(Math.PI / n)), va = Math.hypot(v, ri);
    const sc = SC;
    const C = [170, 150];
    const base = regular(n, R * sc, C[0], C[1], -Math.PI / 2 + Math.PI / n);
    poly(base, "fill-a");
    for (let i = 0; i < n; i++) {
      const A = base[i], B = base[(i + 1) % n], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      const d = [M[0] - C[0], M[1] - C[1]], L = Math.hypot(...d);
      poly([A, B, [M[0] + (d[0] / L) * va * sc, M[1] + (d[1] / L) * va * sc]], i % 2 ? "fill-b" : "fill-c");
    }
    return;
  }
  if (kind === "stozec") {
    const [r, v] = p;
    const sl = Math.hypot(r, v), ang = (2 * Math.PI * r) / sl;
    const sc = SC;
    const C = [170, 20];
    const p0 = -Math.PI / 2 - ang / 2 + Math.PI;
    const P = (t) => [C[0] + sl * sc * Math.cos(p0 + t), C[1] + sl * sc * Math.sin(p0 + t)];
    s("path", { d: `M${C[0]},${C[1]} L${P(0).join(",")} A${sl * sc},${sl * sc} 0 ${ang > Math.PI ? 1 : 0} 1 ${P(ang).join(",")} Z`, class: "shape fill-b" }, g);
    s("circle", { cx: C[0], cy: C[1] + sl * sc + r * sc, r: r * sc, class: "shape fill-a" }, g);
    return;
  }
  label(svg, 170, 120, "Krogle ne moremo razgrniti v ravnino brez trganja.", "tick b");
  label(svg, 170, 140, "Njena površina je enaka ploščini 4 velikih krogov:", "tick");
  for (let i = 0; i < 4; i++) s("circle", { cx: 65 + i * 70, cy: 195, r: 30, class: "shape fill-a" }, g);
}

export function telesa(el, { bodies = ["kocka", "kvader"] } = {}) {
  const svg = svgBox(340, 300, "solid3d");
  const out = readout();
  let kind = bodies[0], p = BODIES[kind].params.map((q) => q[3]), yaw = 0.6, pitch = 0.45, net = false, units = false;
  const ctl = h("div", { class: "demo-controls" });
  const draw = () => {
    // stalno merilo: izračunamo ga za največje mere telesa, zato večje telo izgleda večje
    const pMax = BODIES[kind].params.map((q) => q[2]);
    if (net) drawNet(svg, kind, p, netScale(kind, pMax));
    else {
      svg.replaceChildren();
      const F = mesh(kind, p, units && (kind === "kocka" || kind === "kvader"));
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      // velikost
      let maxD = 0;
      const FM = mesh(kind, pMax, false);
      FM.forEach(([pts]) => pts.forEach((q) => (maxD = Math.max(maxD, Math.hypot(q[0], q[2]), q[1]))));
      const hgtM = Math.max(...FM.flatMap(([pts]) => pts.map((q) => q[1])));
      const hgt = Math.max(...F.flatMap(([pts]) => pts.map((q) => q[1])));
      const sc = 120 / Math.max(maxD, hgtM * 0.75, 1);
      // zavrti v koordinate pogleda: x desno, y gor, z proti gledalcu
      const rot = ([x, y, z]) => {
        y -= hgt / 2;
        const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
        return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
      };
      const RF = F.map(([pts, cls]) => [pts.map(rot), cls]);
      // središče telesa (vsa telesa so konveksna): ploskev vidimo, če njena zunanja normala kaže proti nam
      let cx = 0, cyy = 0, cz = 0, n = 0;
      RF.forEach(([R]) => R.forEach((q) => ((cx += q[0]), (cyy += q[1]), (cz += q[2]), n++)));
      (cx /= n), (cyy /= n), (cz /= n);
      const Lx = -0.45, Ly = 0.7, Lz = 0.55, Ln = Math.hypot(Lx, Ly, Lz);
      const faces = [];
      RF.forEach(([R, cls]) => {
        // normala po Newellu (deluje tudi za ploskve s ponovljenim ogliščem)
        let nx = 0, ny = 0, nz = 0, fx = 0, fy = 0, fz = 0;
        R.forEach((a, i) => {
          const b = R[(i + 1) % R.length];
          nx += (a[1] - b[1]) * (a[2] + b[2]);
          ny += (a[2] - b[2]) * (a[0] + b[0]);
          nz += (a[0] - b[0]) * (a[1] + b[1]);
          (fx += a[0]), (fy += a[1]), (fz += a[2]);
        });
        (fx /= R.length), (fy /= R.length), (fz /= R.length);
        const nn = Math.hypot(nx, ny, nz);
        if (nn < 1e-9) return;
        if (nx * (fx - cx) + ny * (fy - cyy) + nz * (fz - cz) < 0) (nx = -nx), (ny = -ny), (nz = -nz);
        if (nz / nn < -1e-6) return; // zadnja stran
        const lit = Math.max(0, (nx * Lx + ny * Ly + nz * Lz) / (nn * Ln));
        faces.push({ P: R.map((q) => [170 + q[0] * sc, 155 - q[1] * sc]), cls, z: fz, lit: Math.round(55 + 45 * lit) });
      });
      faces.sort((u, v) => u.z - v.z);
      faces.forEach((f) => s("polygon", { points: f.P.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" "), class: `face ${f.cls}`, style: `--lit:${f.lit}%` }, svg));
    }
    const f = formulas(kind, p);
    out.innerHTML = texBlock(f.P) + texBlock(f.V) + `<p>${f.note}</p>${net && kind === "krogla" ? "" : `<p class="muted">${net ? "To je mreža telesa: iz nje ga zložimo. Ploščina mreže je površina telesa." : "Povleci telo s prstom ali miško, da ga zavrtiš."}</p>`}`;
  };
  const build = () => {
    p = BODIES[kind].params.map((q) => q[3]);
    if (kind === "krogla") net = false;
    ctl.replaceChildren(
      ...(bodies.length > 1 ? [select({ label: "telo", options: bodies.map((b) => [b, BODIES[b].name]), value: kind, onChange: (v) => ((kind = v), build()) })] : []),
      ...BODIES[kind].params.map((q, i) => slider({ label: q[0], min: q[1], max: q[2], value: q[3], onInput: (v) => ((p[i] = v), draw()) })),
      // krogle ne moremo razgrniti: brez gumba za mrežo (besedilo pod sliko to pove)
      ...(kind === "krogla" ? [] : [toggle("pokaži mrežo", net, (v) => ((net = v), draw()))]),
      ...(kind === "kocka" || kind === "kvader" ? [toggle("enotske kocke", units, (v) => ((units = v), draw()))] : []),
      buttons(playButton(anim, { play: "Vrti", pause: "Ustavi vrtenje" })),
    );
    draw();
  };
  // vrtenje z vlečenjem
  let drag = null;
  svg.addEventListener("touchstart", (e) => !net && e.cancelable && e.preventDefault(), { passive: false });
  svg.addEventListener("pointerdown", (e) => {
    if (net) return;
    drag = [...svgPoint(svg, e), yaw, pitch];
    svg.setPointerCapture?.(e.pointerId);
    anim.pause();
  });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const [x, y] = svgPoint(svg, e);
    yaw = drag[2] + (x - drag[0]) / 80;
    pitch = clamp(drag[3] + (y - drag[1]) / 80, -1.2, 1.4);
    draw();
  });
  const end = () => (drag = null);
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  const anim = animate(el, (dt) => {
    if (net) return;
    yaw += dt * 0.5;
    draw();
  }, { autoplay: false });
  const tryText = bodies.includes("stozec") && bodies.includes("valj") ? "Primerjaj prostornini valja in stožca z enakim r in v. Kolikokrat je valj večji?"
    : bodies.includes("krogla") ? "Podvoji polmer krogle. Kolikokrat se poveča površina in kolikokrat prostornina?"
    : bodies.includes("piramida") ? "Primerjaj piramido in prizmo z enako osnovo in višino. Kolikšen del prizme je piramida?"
    : bodies.includes("stozec") ? "Vklopi mrežo. Kaj se zgodi z lokom plašča, ko večaš višino stožca?"
    : bodies.includes("valj") ? "Vklopi mrežo. Kako dolga je daljša stranica pravokotnika, ki je plašč valja?"
    : bodies.includes("prizma") ? "Povečaj število oglišč osnove. Kateremu telesu je prizma vedno bolj podobna?"
    : "Podvoji rob kocke. Kolikokrat se poveča površina in kolikokrat prostornina?";
  layout(el, { stage: [svg], controls: ctl, out, tryText });
  build();
}
