// Igre za vprašalnik »Katere igre si igral kot otrok?« (j 2026-10-30, childhood.js): zvrsti, ki jih
// zbirka še ni imela, kot izvirne Evklidove učne igre z lastnimi liki in risbami. Učenje je jedro igre:
// blok zapolni vrsto le v stezi s pravilnim odgovorom, dragulji počijo le v barvi pravilnega odgovora,
// štih dobiš le s pravilno karto.
import { rand, clamp, shuffle, INK, chap, inRect, numKey, circle, pill, answerText, face, sky } from "./fun.js";

// Kocka z bleščico (svetel rob zgoraj levo, temen spodaj desno).
function cube(g, x, y, s, fill) {
  g.fillStyle = fill;
  g.fillRect(x, y, s, s);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(x, y, s, s * 0.18);
  g.fillRect(x, y, s * 0.18, s);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.fillRect(x, y + s * 0.82, s, s * 0.18);
  g.fillRect(x + s * 0.82, y, s * 0.18, s);
  g.lineWidth = 1.5;
  g.strokeStyle = INK;
  g.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
}

// ============ PADAJOČI BLOKI: blok v stezo s pravilnim odgovorom počisti vrsto ============
const SHAPES = [
  [[0, 0], [1, 0], [2, 0], [0, 1]], // L
  [[0, 0], [1, 0], [2, 0], [2, 1]], // J
  [[0, 0], [1, 0], [2, 0], [1, 1]], // T
  [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
  [[0, 0], [1, 0], [0, 1], [1, 1]], // O
  [[0, 0], [1, 0], [2, 0]], // I3
];
const BLOCK_COLORS = ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#06b6d4", "#ec4899"];
const RUBBLE = "#64748b";
const norm = (cells) => {
  const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]);
};
const rot = (cells) => norm(cells.map(([x, y]) => [-y, x]));
const dims = (cells) => [Math.max(...cells.map((c) => c[0])) + 1, Math.max(...cells.map((c) => c[1])) + 1];

export const blocks = {
  id: "blocks",
  added: "2026-10-30", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Gradbišče", "Robotka Kocka gradi mesto iz pisanih blokov."], ["Most", "Za most čez reko potrebuje ravne vrste."], ["Nebotičnik", "Bloki padajo hitreje, nebotičnik raste."], ["Mesto luči", "Še nekaj vrst in mesto zasveti!"]],
    en: [["Building site", "Kocka the robot builds a town from colourful blocks."], ["The bridge", "The bridge over the river needs straight rows."], ["Skyscraper", "Blocks fall faster, the skyscraper grows."], ["City of lights", "A few more rows and the city lights up!"]],
  },
  icon: "blocks",
  colors: ["#0e7490", "#22d3ee"],
  options: 4,
  create(G) {
    const LANES = 4, CW = 3;
    let ROWS = 11; // na visokem zaslonu (telefon) več vrst
    let lanes = [], piece = null, cell = 20, gap = 8, x0 = 0, fy0 = 0, fy1 = 0, signH = 48, flash = 0, flashY = 0, sparks = [], missed = false;
    const laneX = (i) => x0 + i * (CW * cell + gap);
    const floorY = (i) => fy1 - lanes[i].length * cell;
    const laneAt = (x) => clamp(Math.floor((x - x0 + gap / 2) / (CW * cell + gap)), 0, LANES - 1);
    const pieceX = (lane) => laneX(lane) + ((CW - dims(piece.cells)[0]) * cell) / 2;
    // najvišji kup: nad njim je vedno prostor za najvišji blok (3) in še 3 vrste za odločitev
    const cap = () => ROWS - 6;
    // v drugo stezo le, če blok ni že nižje od njenega kupa (kot stena), sicer bi s puščicami pristal v vmesni stezi
    const go = (lane) => {
      if (lane === piece.lane) return;
      if (piece.y + dims(piece.cells)[1] * cell > floorY(lane)) return G.shake(4);
      piece.lane = lane;
    };
    const fill = () => {
      lanes = Array.from({ length: LANES }, () => Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => shuffle(BLOCK_COLORS).slice(0, CW)));
    };
    const land = () => {
      const p = piece;
      piece = null;
      const ok = G.isRight(G.opts[p.lane]);
      const [, h] = dims(p.cells);
      const cx = laneX(p.lane) + (CW * cell) / 2, cy = floorY(p.lane) - (h * cell) / 2;
      if (ok) {
        // pravilna steza: blok se razleti v iskrice in spodnja vrsta vseh stez izgine
        flashY = fy1 - cell;
        flash = 1;
        for (const l of lanes) l.shift();
        for (let k = 0; k < 14; k++) sparks.push({ x: cx + rand(-1, 1) * cell, y: cy + rand(-1, 1) * cell, vx: rand(-160, 160), vy: rand(-260, -60), c: p.color, life: 0.8 });
        if (lanes.every((l) => !l.length)) G.float(G.W / 2, fy1 - 2 * cell, "✨", "#fde047", 34);
        G.answer(true, cx, cy);
      } else {
        // napačna steza: blok posivi in obleži, napis pravilne steze pozeleni
        missed = true;
        for (let k = 0; k < h; k++) lanes[p.lane].push(Array(CW).fill(RUBBLE));
        G.answer(false, cx, cy);
        if (lanes[p.lane].length > cap()) {
          G.shake(12);
          G.float(cx, cy, "💥", "#f97316", 34);
          for (const l of lanes) l.splice(1);
        }
      }
    };
    return {
      resize() {
        const rel = piece ? (piece.y - fy0) / Math.max(1, fy1 - fy0) : 0;
        signH = clamp(G.H * 0.12, 40, 62);
        fy0 = signH + 14;
        fy1 = G.H - 8;
        gap = clamp(G.W * 0.02, 6, 14);
        const cw = (G.W - 16 - gap * (LANES - 1)) / (LANES * CW);
        ROWS = clamp(Math.floor((fy1 - fy0) / cw), 9, 16);
        cell = Math.floor(Math.min(cw, (fy1 - fy0) / ROWS));
        x0 = (G.W - (LANES * CW * cell + gap * (LANES - 1))) / 2;
        fy1 = fy0 + ROWS * cell;
        for (const l of lanes) if (l.length > cap()) l.splice(cap());
        if (piece) Object.assign(piece, { x: pieceX(piece.lane), y: fy0 + rel * (fy1 - fy0) });
      },
      reset() {
        fill();
        piece = null;
        sparks = [];
        flash = 0;
        missed = false;
      },
      question() {
        if (!lanes.length) fill();
        missed = false;
        let cells = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        for (let r = Math.floor(Math.random() * 4); r > 0; r--) cells = rot(cells);
        piece = { cells, lane: Math.floor(Math.random() * LANES), color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)], y: 0, fast: false };
        piece.x = pieceX(piece.lane);
        piece.y = fy0;
      },
      update(dt) {
        flash = Math.max(0, flash - dt * 2.2);
        for (const s of sparks) {
          s.vy += 700 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.life -= dt;
        }
        if (sparks.length) sparks = sparks.filter((s) => s.life > 0);
        if (!piece || G.waiting) return;
        piece.x += (pieceX(piece.lane) - piece.x) * Math.min(1, dt * 16);
        // celo polje v ~9 s (hitreje z G.speed), s tipko ↓ ali dvojnim tapom 8× hitreje
        const v = ((fy1 - fy0) / 9) * G.speed * (piece.fast ? 8 : 1);
        piece.y += v * dt;
        if (piece.y + dims(piece.cells)[1] * cell >= floorY(piece.lane)) land();
      },
      pointer(type, p) {
        if (type !== "down" || !piece || G.waiting) return;
        const [w, h] = dims(piece.cells);
        if (inRect(p, { x: piece.x - 6, y: piece.y - 6, w: w * cell + 12, h: h * cell + 12 })) {
          piece.cells = rot(piece.cells);
          return G.sound("pop");
        }
        const lane = laneAt(p.x);
        // tap v isto stezo (kjerkoli razen na blok) ga spusti hitreje, tap v drugo ga premakne
        if (lane === piece.lane) piece.fast = true;
        else go(lane);
      },
      key(k, down) {
        if (!down || !piece || G.waiting) return false;
        const n = numKey(k, LANES);
        if (n >= 0) go(n);
        else if (k === "ArrowLeft") go(Math.max(0, piece.lane - 1));
        else if (k === "ArrowRight") go(Math.min(LANES - 1, piece.lane + 1));
        else if (k === "ArrowDown" || k === " ") piece.fast = true;
        else if (k === "ArrowUp") piece.cells = rot(piece.cells);
        else return false;
        return true;
      },
      draw(g) {
        const [top, bottom, well] = chap(G, [["#0c4a6e", "#082f49", "#0b3b57"], ["#134e4a", "#042f2e", "#0f3d3a"], ["#312e81", "#1e1b4b", "#29266b"], ["#1e293b", "#020617", "#172036"]]);
        sky(G, g, top, bottom);
        // mesto luči v ozadju
        g.fillStyle = "rgba(255,255,255,0.06)";
        for (let i = 0; i < 9; i++) g.fillRect((i * G.W) / 9 + 6, G.H * (0.5 + ((i * 37) % 30) / 100), G.W / 12, G.H);
        for (let i = 0; i < LANES; i++) {
          const x = laneX(i), w = CW * cell;
          g.fillStyle = well;
          g.fillRect(x, fy0, w, fy1 - fy0);
          g.strokeStyle = "rgba(255,255,255,0.08)";
          g.lineWidth = 1;
          g.beginPath();
          for (let r = 1; r < ROWS; r++) {
            g.moveTo(x, fy0 + r * cell);
            g.lineTo(x + w, fy0 + r * cell);
          }
          g.stroke();
          g.strokeStyle = INK;
          g.lineWidth = 3;
          g.strokeRect(x, fy0, w, fy1 - fy0);
          lanes[i]?.forEach((row, r) => row.forEach((c, k) => cube(g, x + k * cell, fy1 - (r + 1) * cell, cell, c)));
          // napis steze z odgovorom in številko tipke
          const on = piece && piece.lane === i && !G.waiting;
          G.rr(x - 2, 6, w + 4, signH, 10);
          g.fillStyle = missed && G.isRight(G.opts[i]) ? "#86efac" : on ? "#fde047" : "#e0f2fe";
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          if (G.opts?.[i] != null) answerText(G, G.opts[i], x + w / 2, 6 + signH / 2 + 1, w - 6, Math.min(22, signH * 0.42), { color: INK, weight: 900 });
          G.fit(`${i + 1}`, x + 9, 15, 14, 11, { color: "#475569", weight: 900 });
        }
        if (flash > 0) {
          g.fillStyle = `rgba(255,255,255,${flash * 0.8})`;
          g.fillRect(x0 - 4, flashY - flash * 6, LANES * CW * cell + gap * (LANES - 1) + 8, cell + flash * 12);
        }
        if (piece) {
          const [, h] = dims(piece.cells);
          // senca: kam bo blok padel
          const gy = floorY(piece.lane) - h * cell, gx = pieceX(piece.lane);
          g.strokeStyle = "rgba(255,255,255,0.55)";
          g.setLineDash([4, 4]);
          g.lineWidth = 2;
          for (const [cx, cy] of piece.cells) g.strokeRect(gx + cx * cell + 2, gy + cy * cell + 2, cell - 4, cell - 4);
          g.setLineDash([]);
          for (const [cx, cy] of piece.cells) cube(g, piece.x + cx * cell, piece.y + cy * cell, cell, piece.color);
          // Kocka (robotka) sedi na bloku
          const rx = piece.x + cell, ry = piece.y - cell * 0.55;
          G.rr(rx - cell * 0.45, ry - cell * 0.4, cell * 0.9, cell * 0.8, 6);
          g.fillStyle = "#cbd5e1";
          g.fill();
          g.lineWidth = 2;
          g.strokeStyle = INK;
          g.stroke();
          face(g, rx, ry, cell * 0.38, 1, piece.lane < LANES / 2 ? -1 : 1);
        }
        for (const s of sparks) {
          g.globalAlpha = Math.max(0, s.life / 0.8);
          g.fillStyle = s.c;
          g.fillRect(s.x - 4, s.y - 4, 8, 8);
        }
        g.globalAlpha = 1;
      },
    };
  },
};

// ============ DRAGULJI: poči skupino draguljev v barvi pravilnega odgovora ============
const GEM = [
  ["#ef4444", "circle"],
  ["#3b82f6", "diamond"],
  ["#22c55e", "square"],
  ["#facc15", "triangle"],
];
function gem(g, x, y, r, k, crack = 0) {
  const [col, shape] = GEM[k];
  g.beginPath();
  if (shape === "circle") g.arc(x, y, r, 0, Math.PI * 2);
  else if (shape === "diamond") {
    g.moveTo(x, y - r * 1.1);
    g.lineTo(x + r, y);
    g.lineTo(x, y + r * 1.1);
    g.lineTo(x - r, y);
  } else if (shape === "square") g.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
  else {
    g.moveTo(x, y - r);
    g.lineTo(x + r * 1.05, y + r * 0.8);
    g.lineTo(x - r * 1.05, y + r * 0.8);
  }
  g.closePath();
  g.fillStyle = crack > 0 ? "#94a3b8" : col;
  g.fill();
  g.lineWidth = 2.5;
  g.strokeStyle = INK;
  g.stroke();
  // lesk
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(x - r * 0.3, y - r * 0.35, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
  g.fill();
  if (crack > 0) {
    g.strokeStyle = INK;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x - r * 0.5, y - r * 0.4);
    g.lineTo(x, y);
    g.lineTo(x - r * 0.1, y + r * 0.5);
    g.moveTo(x, y);
    g.lineTo(x + r * 0.45, y - r * 0.2);
    g.stroke();
  }
}

export const match = {
  id: "match",
  added: "2026-10-30", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Rudnik", "Krt Rudi koplje dragulje globoko pod goro."], ["Kristalna jama", "V jami se lesketajo kristali vseh barv."], ["Podzemno jezero", "Dragulji se skrivajo ob temni vodi."], ["Zakladnica", "Še nekaj skupin in Rudi odpre zakladnico!"]],
    en: [["The mine", "Rudi the mole digs gems deep under the mountain."], ["Crystal cave", "Crystals of every colour sparkle in the cave."], ["Underground lake", "Gems hide by the dark water."], ["The treasury", "A few more groups and Rudi opens the treasury!"]],
  },
  icon: "gem",
  colors: ["#7e22ce", "#e879f9"],
  options: 4,
  create(G) {
    let cols = 6, rows = 7, grid = [], size = 40, bx = 0, by = 0, legendH = 50, hint = null, missed = false;
    const at = (c, r) => grid[c]?.[r];
    const cellOf = (p) => {
      const c = Math.floor((p.x - bx) / size), r = Math.floor((p.y - by) / size);
      return c >= 0 && c < cols && r >= 0 && r < rows ? [c, r] : null;
    };
    const group = (c, r) => {
      const k = at(c, r)?.k, seen = new Set([`${c},${r}`]), out = [[c, r]];
      for (let i = 0; i < out.length; i++) {
        const [x, y] = out[i];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
          if (!seen.has(key) && at(nx, ny)?.k === k) {
            seen.add(key);
            out.push([nx, ny]);
          }
        }
      }
      return out;
    };
    const rightK = () => G.opts.findIndex((o) => G.isRight(o));
    const biggest = (k) => {
      let best = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) if (at(c, r).k === k) {
        const gr = group(c, r);
        if (gr.length > best.length) best = gr;
      }
      return best;
    };
    const fill = () => {
      grid = Array.from({ length: cols }, () => Array.from({ length: rows }, () => ({ k: Math.floor(Math.random() * 4), dy: -rows, vy: 0, crack: 0 })));
    };
    // Barva pravilnega odgovora mora imeti vsaj eno skupino z dvema draguljema.
    const ensure = () => {
      const k = rightK();
      if (k < 0 || biggest(k).length >= 2) return;
      const c = Math.floor(Math.random() * (cols - 1)), r = Math.floor(Math.random() * rows);
      at(c, r).k = k;
      at(c + 1, r).k = k;
    };
    const pop = (gr) => {
      if (G.waiting || gr.length < 2) return;
      const k = at(...gr[0]).k;
      const cx = bx + (gr.reduce((s, [c]) => s + c, 0) / gr.length + 0.5) * size;
      const cy = by + (gr.reduce((s, [, r]) => s + r, 0) / gr.length + 0.5) * size;
      if (!G.isRight(G.opts[k])) {
        for (const [c, r] of gr) at(c, r).crack = 1;
        missed = true; // legenda pravilnega odgovora pozeleni
        return G.answer(false, cx, cy);
      }
      G.burst(cx, cy, GEM[k][0], Math.min(30, 8 + gr.length * 3));
      if (gr.length >= 5) G.float(cx, cy - 30, gr.length >= 8 ? "💎💎" : "💎", "#fde047", 26);
      // stolpci se sesedejo, novi dragulji padejo od zgoraj
      const gone = new Set(gr.map(([c, r]) => `${c},${r}`));
      for (let c = 0; c < cols; c++) {
        // dy: odmik v celicah, da dragulj najprej ostane, kjer je bil, in nato pade na novo mesto
        const keep = grid[c].map((x, r) => [x, r]).filter(([, r]) => !gone.has(`${c},${r}`));
        const add = rows - keep.length;
        const fresh = Array.from({ length: add }, () => ({ k: Math.floor(Math.random() * 4), dy: -add - 1, vy: 0, crack: 0 }));
        grid[c] = [...fresh, ...keep.map(([x, r], i) => ({ ...x, dy: x.dy + r - (add + i) }))];
      }
      G.answer(true, cx, cy, { delay: 0.6 });
    };
    return {
      resize() {
        const land = G.W > G.H * 1.15;
        legendH = clamp(G.H * 0.13, 44, 70);
        const ncols = land ? 8 : 6, nrows = land ? 5 : 7;
        if (ncols !== cols || nrows !== rows || !grid.length) {
          cols = ncols;
          rows = nrows;
          fill();
          if (G.q) ensure(); // nova mreža med nalogo: pravilni odgovor mora spet imeti skupino
        }
        size = Math.floor(Math.min((G.W - 16) / cols, (G.H - legendH - 20) / rows));
        bx = (G.W - cols * size) / 2;
        by = legendH + 12 + (G.H - legendH - 20 - rows * size) / 2;
      },
      reset() {
        fill();
        hint = null;
        missed = false;
      },
      question() {
        if (!grid.length) fill();
        for (const col of grid) for (const x of col) x.crack = 0;
        ensure();
        hint = null;
        missed = false;
      },
      update(dt) {
        for (const col of grid) for (const x of col) {
          if (x.dy < 0) {
            x.vy += 40 * dt;
            x.dy = Math.min(0, x.dy + x.vy * dt);
          } else x.vy = 0;
          x.crack = Math.max(0, x.crack - dt * 0.4);
        }
        if (hint) hint.t -= dt;
      },
      pointer(type, p) {
        if (type !== "down" || G.waiting) return;
        const cr = cellOf(p);
        if (!cr) return;
        const gr = group(...cr);
        if (gr.length < 2) {
          hint = { c: cr[0], r: cr[1], t: 0.5 };
          return G.float(p.x, p.y - 20, "2+", "#fff", 20);
        }
        pop(gr);
      },
      key(k, down) {
        const n = numKey(k, 4);
        if (!down || n < 0) return false;
        if (G.waiting) return true;
        const gr = biggest(n);
        if (gr.length >= 2) pop(gr);
        else G.float(G.W / 2, G.H / 2, "—", "#fff", 30);
        return true;
      },
      draw(g) {
        const [top, bottom] = chap(G, [["#44403c", "#1c1917"], ["#4c1d95", "#1e1b4b"], ["#0c4a6e", "#020617"], ["#713f12", "#292524"]]);
        sky(G, g, top, bottom);
        // legenda: barva in oblika dragulja → odgovor
        const lw = (G.W - 16) / 4;
        for (let i = 0; i < 4; i++) {
          const x = 8 + i * lw;
          const good = missed && G.isRight(G.opts[i]);
          G.rr(x + 3, 6, lw - 6, legendH, 12);
          g.fillStyle = good ? "#bbf7d0" : "#fff";
          g.fill();
          g.lineWidth = good ? 5 : 3;
          g.strokeStyle = good ? "#16a34a" : GEM[i][0];
          g.stroke();
          const r = Math.min(13, legendH * 0.22);
          gem(g, x + 6 + r + 4, 6 + legendH / 2, r, i);
          if (G.opts?.[i] != null) answerText(G, G.opts[i], x + lw / 2 + r, 6 + legendH / 2 + 1, lw - 2 * r - 26, Math.min(20, legendH * 0.36), { color: INK, weight: 900 });
          G.fit(`${i + 1}`, x + lw - 14, 16, 14, 11, { color: "#64748b", weight: 900 });
        }
        G.rr(bx - 6, by - 6, cols * size + 12, rows * size + 12, 14);
        g.fillStyle = "rgba(0,0,0,0.35)";
        g.fill();
        g.save();
        g.beginPath();
        g.rect(bx - 6, by - 6, cols * size + 12, rows * size + 12);
        g.clip();
        for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
          const x = at(c, r);
          if (!x) continue;
          let gx = bx + (c + 0.5) * size, gy = by + (r + 0.5 + x.dy) * size;
          if (hint && hint.t > 0 && hint.c === c && hint.r === r) gx += Math.sin(hint.t * 40) * 4;
          gem(g, gx, gy, size * 0.36, x.k, x.crack);
        }
        g.restore();
      },
    };
  },
};

// ============ KARTAŠKI DVOBOJ: štih dobi pravilna karta ============
const SUITS = [["♠", INK], ["♥", "#dc2626"], ["♦", "#dc2626"], ["♣", INK]];
const RIVALS = [
  ["#f97316", "ear", "🦊"],
  ["#94a3b8", "ear", "🐱"],
  ["#92400e", "round", "🐻"],
  ["#7c3aed", "tuft", "🦉"],
];
function rival(g, x, y, r, fur, ears, mood) {
  g.fillStyle = fur;
  g.strokeStyle = INK;
  g.lineWidth = 3;
  for (const s of [-1, 1]) {
    g.beginPath();
    if (ears === "round") g.arc(x + s * r * 0.75, y - r * 0.75, r * 0.32, 0, Math.PI * 2);
    else {
      const h = ears === "tuft" ? 0.55 : 0.85;
      g.moveTo(x + s * r * 0.3, y - r * 0.8);
      g.lineTo(x + s * r * 0.85, y - r * (0.8 + h));
      g.lineTo(x + s * r * 0.95, y - r * 0.35);
    }
    g.closePath();
    g.fill();
    g.stroke();
  }
  circle(g, x, y, r, fur);
  // gobček
  g.fillStyle = "#fef3c7";
  g.beginPath();
  g.ellipse(x, y + r * 0.35, r * 0.5, r * 0.35, 0, 0, Math.PI * 2);
  g.fill();
  face(g, x, y, r, mood);
  circle(g, x, y + r * 0.18, r * 0.1, INK, 0);
}
function card(G, g, c, w, h, face_up) {
  g.save();
  g.translate(c.x, c.y);
  g.rotate(c.rot || 0);
  G.rr(-w / 2, -h / 2, w, h, 10);
  g.fillStyle = face_up ? (c.bad ? "#cbd5e1" : "#fffbeb") : "#1d4ed8";
  g.fill();
  g.lineWidth = c.good ? 5 : 3;
  g.strokeStyle = c.good ? "#16a34a" : c.sel ? "#facc15" : INK;
  g.stroke();
  if (face_up) {
    const [s, col] = SUITS[c.suit];
    G.fit(s, -w / 2 + 12, -h / 2 + 14, 16, 16, { color: col, weight: 900 });
    G.fit(s, w / 2 - 12, h / 2 - 12, 16, 16, { color: col, weight: 900 });
    if (c.txt != null) answerText(G, c.txt, 0, 0, w - 14, Math.min(24, w * 0.24), { color: INK, weight: 900 });
    if (c.bad) G.fit("✗", w / 2 - 14, -h / 2 + 14, 20, 18, { color: "#b91c1c", weight: 900 });
    if (c.n) G.fit(`${c.n}`, -w / 2 + 12, h / 2 - 12, 16, 12, { color: "#64748b", weight: 900 });
  } else {
    g.strokeStyle = "rgba(255,255,255,0.5)";
    g.lineWidth = 2;
    G.rr(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 6);
    g.stroke();
    G.fit("∑", 0, 1, w * 0.6, Math.min(28, w * 0.4), { color: "#fff", weight: 900 });
  }
  g.restore();
}

export const cards = {
  id: "cards",
  added: "2026-10-30", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Kartaški večer", "Lisica Zala te izzove na partijo kart."], ["Mačji turnir", "Mačka Tina igra hitro in zvito."], ["Medvedji brlog", "Medved Bor ima najmočnejše karte v gozdu."], ["Finale", "Sova Modra čaka v finalu. Zmagaj še nekaj štihov!"]],
    en: [["Card night", "Zala the fox challenges you to a game of cards."], ["Cat tournament", "Tina the cat plays fast and sly."], ["Bear den", "Bor the bear has the strongest cards in the forest."], ["The final", "Modra the owl waits in the final. Win a few more tricks!"]],
  },
  icon: "spade",
  colors: ["#166534", "#4ade80"],
  options: 4,
  timer: 20,
  create(G) {
    let hand = [], cw = 80, ch = 112, mine = 0, theirs = 0, mood = 0, drag = null, rivalCard = null, grd = null, grdKey = [];
    const slot = (i) => ({ x: G.W / 2 + (i - (hand.length - 1) / 2) * (cw + 10), y: G.H - ch / 2 - 12 });
    const pileY = () => G.H * 0.47;
    // vlečena karta se vrne v roko (odgovor s tipko, potekel čas, nova delitev)
    const drop = () => {
      if (drag) drag.sel = false;
      drag = null;
    };
    // po napaki ali poteku časa se pravilna karta dvigne z zelenim robom
    const reveal = () => {
      const r = hand.find((c) => !c.played && G.isRight(c.txt));
      if (r) Object.assign(r, { good: true, ty: r.ty - ch * 0.18 });
    };
    const play = (i) => {
      const c = hand[i];
      if (!c || G.waiting || c.played) return;
      drop();
      c.played = true;
      c.sel = false;
      c.tx = G.W / 2 + 14;
      c.ty = pileY() + 6;
      c.trot = 0.12;
      const ok = G.isRight(c.txt);
      c.bad = !ok;
      mood = ok ? -1 : 1;
      if (ok) mine++;
      else {
        theirs++;
        reveal();
      }
      G.answer(ok, c.tx, c.ty, ok ? { delay: 0.8 } : {});
    };
    return {
      resize() {
        cw = Math.min((G.W - 50) / 4, 120, ((G.H * 0.3) / 1.4) | 0);
        ch = cw * 1.4;
        hand.forEach((c, i) => Object.assign(c, c.played ? { tx: G.W / 2 + 14, ty: pileY() + 6 } : { tx: slot(i).x, ty: slot(i).y - (c.good ? ch * 0.18 : 0) }));
        if (rivalCard) Object.assign(rivalCard, { tx: G.W / 2 - 14, ty: pileY() - 6 });
      },
      reset() {
        mine = theirs = 0;
        hand = [];
        rivalCard = drag = null;
      },
      question() {
        // stari štih odnese zmagovalec, nato nova delitev
        mood = 0;
        drop();
        rivalCard = { x: G.W / 2 - 60, y: 70, tx: G.W / 2 - 14, ty: pileY() - 6, rot: -0.5, trot: -0.1, suit: Math.floor(Math.random() * 4), txt: "?" };
        hand = G.opts.map((txt, i) => ({ txt, suit: (i + Math.floor(Math.random() * 4)) % 4, n: i + 1, x: G.W + cw, y: G.H - ch / 2, rot: 0.6, trot: (i - 1.5) * 0.06, delay: i * 0.08 }));
        hand.forEach((c, i) => Object.assign(c, { tx: slot(i).x, ty: slot(i).y }));
      },
      timeout() {
        theirs++;
        mood = 1;
        drop();
        hand.forEach((c) => (c.sel = false));
        reveal();
      },
      update(dt) {
        const ease = Math.min(1, dt * 10);
        const move = (c) => {
          if (c.delay > 0) return void (c.delay -= dt);
          if (c === drag) return;
          c.x += (c.tx - c.x) * ease;
          c.y += (c.ty - c.y) * ease;
          c.rot += ((c.trot ?? 0) - c.rot) * ease;
        };
        for (const c of hand) move(c);
        if (rivalCard) move(rivalCard);
      },
      pointer(type, p) {
        if (G.waiting) return drop();
        if (type === "down") {
          const i = hand.findIndex((c) => !c.played && inRect(p, { x: c.x - cw / 2, y: c.y - ch / 2, w: cw, h: ch }));
          if (i < 0) return;
          drag = hand[i];
          drag.sel = true;
          drag.p0 = { ...p };
          drag.o = { x: p.x - drag.x, y: p.y - drag.y };
        } else if (type === "move" && drag) {
          drag.x = p.x - drag.o.x;
          drag.y = p.y - drag.o.y;
        } else if (type === "up" && drag) {
          const c = drag, i = hand.indexOf(c);
          drag = null;
          // tap ali poteg navzgor odigra karto; kratek poteg vstran jo vrne v roko
          if (Math.hypot(p.x - c.p0.x, p.y - c.p0.y) < 12 || c.y < c.ty - ch * 0.4) play(i);
          else c.sel = false;
        }
      },
      key(k, down) {
        const i = numKey(k, hand.length);
        if (!down || i < 0) return false;
        play(i);
        return true;
      },
      draw(g) {
        const [felt, edge] = chap(G, [["#15803d", "#78350f"], ["#0f766e", "#57534e"], ["#166534", "#451a03"], ["#1e3a8a", "#312e81"]]);
        // preliv mize le ob novem poglavju ali velikosti (ne v vsaki sličici)
        if (grdKey[0] !== felt || grdKey[1] !== G.W || grdKey[2] !== G.H) {
          grdKey = [felt, G.W, G.H];
          grd = g.createRadialGradient(G.W / 2, G.H / 2, 20, G.W / 2, G.H / 2, Math.max(G.W, G.H) * 0.7);
          grd.addColorStop(0, felt);
          grd.addColorStop(1, "#052e16");
        }
        g.fillStyle = edge;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        G.rr(8, 8, G.W - 16, G.H - 16, 26);
        g.fillStyle = grd;
        g.fill();
        // nasprotnik
        const [fur, ears, emo] = chap(G, RIVALS);
        const r = clamp(Math.min(G.W, G.H) * 0.075, 22, 40);
        rival(g, G.W / 2, r + 26, r, fur, ears, G.waiting ? mood : 0);
        for (let i = 0; i < 3; i++) card(G, g, { x: G.W / 2 + r * 1.6 + i * 14, y: r + 30, rot: 0.25 + i * 0.12 }, cw * 0.45, ch * 0.45, false);
        // štihi
        pill(G, g, `🙂 ${mine} : ${theirs} ${emo}`, 76, r + 26, 140, 30, "#fef9c3", 16);
        // kup na sredini: nasprotnikova karta z vprašajem, nato tvoja
        if (rivalCard) card(G, g, rivalCard, cw * 0.9, ch * 0.9, true);
        for (const c of hand) if (c.played) card(G, g, c, cw * 0.9, ch * 0.9, true);
        for (const c of hand) if (!c.played && c !== drag) card(G, g, c, cw, ch, true);
        if (drag) card(G, g, drag, cw * 1.06, ch * 1.06, true);
      },
    };
  },
};

export const RETRO_GAMES = [blocks, match, cards];
