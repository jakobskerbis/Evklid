// Še tri arkadne vrste iger v duhu 80. let: vesoljci, pristanek in mehurčki.
// Izvirni liki in pravila; navdih je le žanr. Vmesnik je isti kot v engines.js in arcade.js.

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
const LEFT = new Set(["ArrowLeft", "a", "A"]);
const RIGHT = new Set(["ArrowRight", "d", "D"]);
const FIRE = new Set([" ", "Enter", "ArrowUp", "w", "W"]);

// Tanke vodoravne črte kot na starem zaslonu.
function scanlines(g, G) {
  g.fillStyle = "rgba(0,0,0,0.16)";
  for (let y = 0; y < G.H; y += 4) g.fillRect(0, y, G.W, 2);
}
// Napis na ploščici (odgovor) – temen tekst na svetli podlagi z obrobo.
function pill(G, g, txt, x, y, maxW, h, fill, { focus = false, size = 18 } = {}) {
  const w = Math.min(maxW, G.tw(txt, size, 900) + 18);
  G.rr(x - w / 2, y - h / 2, w, h, Math.min(10, h / 3));
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = focus ? 5 : 3;
  g.strokeStyle = focus ? "#ffffff" : INK;
  g.stroke();
  G.fit(txt, x, y + 1, w - 8, size, { color: INK, weight: 900 });
  return w;
}
// Tipke 1–9.
function numKey(k) {
  return /^[1-9]$/.test(k) ? Number(k) - 1 : -1;
}
// Piksljasta slika iz nizov: vsak znak je barva iz pal, "." je prazno. (x, y) je središče.
function sprite(g, rows, x, y, k, pal) {
  const w = rows[0].length, h = rows.length;
  const x0 = Math.round(x - (w * k) / 2), y0 = Math.round(y - (h * k) / 2);
  rows.forEach((row, j) => {
    for (let i = 0; i < w; i++) {
      const c = pal[row[i]];
      if (!c) continue;
      g.fillStyle = c;
      g.fillRect(x0 + i * k, y0 + j * k, k + 0.4, k + 0.4);
    }
  });
}
// Zvezde v relativnih koordinatah (preživijo spremembo velikosti).
const makeStars = (n) => Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), s: rand(1, 2.4), p: rand(0, 6) }));
function drawStars(g, G, list, color, maxY = 1) {
  g.fillStyle = color;
  for (const s of list) {
    if (s.y > maxY) continue;
    g.globalAlpha = G.reduced ? 0.7 : 0.45 + 0.4 * Math.sin(G.time * 1.6 + s.p);
    g.fillRect(s.x * G.W, s.y * G.H, s.s, s.s);
  }
  g.globalAlpha = 1;
}

// ============ VESOLJCI: top na dnu zadene vesoljca s pravilnim odgovorom ============
// Vsak vesoljec ima dve sliki (noge se premikajo). X = telo, W = belo, K = temno, A = poudarek.
const ALIENS = [
  [
    ["...XXXX...", ".XXXXXXXX.", "XXWWXXWWXX", "XXWKXXWKXX", "XXXXXXXXXX", "XXXKKKKXXX", ".XXXXXXXX.", "X.X.XX.X.X"],
    ["...XXXX...", ".XXXXXXXX.", "XXWWXXWWXX", "XXKWXXKWXX", "XXXXXXXXXX", "XXXXKKXXXX", ".XXXXXXXX.", ".X.X..X.X."],
  ],
  [
    ["A........A", ".A......A.", "..XXXXXX..", ".XXWWWWXX.", "XXXWKKWXXX", "XXXWWWWXXX", ".XXXXXXXX.", "..X.XX.X.."],
    [".A......A.", ".A......A.", "..XXXXXX..", ".XXWWWWXX.", "XXXWWKKXXX", "XXXWWWWXXX", ".XXXXXXXX.", ".X..XX..X."],
  ],
  [
    ["...AAAA...", ".AAWAAWAA.", "AAAAAAAAAA", "..XWXXWX..", "..XKXXKX..", "..XXXXXX..", "...XKKX...", "..X....X.."],
    ["...AAAA...", ".AAAWAAWA.", "AAAAAAAAAA", "..XWXXWX..", "..XKXXKX..", "..XXXXXX..", "...XXXX...", "...X..X..."],
  ],
];
const CANNON = ["......A......", "......A......", "....XXXXX....", "...XXWWWXX...", ".XXXXXXXXXXX.", "XXXXXXXXXXXXX", "XKKXXXXXXXKKX", ".KK.......KK."];
const BOOM = ["X...X...X", ".X..X..X.", "..X...X..", "XX.....XX", "..X...X..", ".X..X..X.", "X...X...X"];

export const invaders = {
  id: "invaders",
  story: {
    sl: [["Nad domačim mestom", "Pilotka Zara straži nebo nad domačim mestom."], ["Zeleni roj", "Vesoljci prihajajo v novih barvah."], ["Rdeča meglica", "Zara leti skozi žarečo meglico."], ["Zadnji val", "Še zadnji val in nebo bo spet mirno!"]],
    en: [["Above the home town", "Pilot Zara guards the sky above her home town."], ["The green swarm", "The aliens arrive in new colours."], ["The red nebula", "Zara flies through a glowing nebula."], ["The last wave", "One last wave and the sky will be calm again!"]],
  },
  icon: "sparkles",
  colors: ["#05060f", "#4c1d95"],
  options: 4,
  timer: 24,
  create(G) {
    const SWEEPS = 5, M = 8;
    let al = [], colW = 80, k = 4, range = 0, y0 = 60, y1 = 300, t = 0, dur = 20;
    let cx = 0, tx = null, track = null, want = false, hold = 0, shot = null, sky = makeStars(70);
    const cy = () => G.H - clamp(G.H * 0.07, 26, 46);
    const ph = () => clamp(G.H * 0.06, 26, 42);
    const layout = () => {
      const n = Math.max(1, al.length || 4);
      colW = Math.min((G.W - 2 * M) / (n + 0.6), 180);
      k = clamp(Math.floor(colW / 14), 3, 7);
      range = Math.max(0, G.W - 2 * M - colW * n);
      y0 = clamp(G.H * 0.05, 14, 50) + k * 4;
      // spodnji rob najnižjega vesoljca (z ničlo cik-caka in ploščico) ostane nad topom
      y1 = Math.max(y0 + 40, cy() - k * 4 - 18 - (k * 3 + k * 4 + 6 + ph()));
    };
    // Položaj jate: vodoravno sem in tja, na robu korak navzdol.
    const where = () => {
      const p = clamp(t / dur, 0, 1) * SWEEPS;
      const s = Math.min(SWEEPS - 1, Math.floor(p)), f = p - s;
      const hf = Math.min(1, f / 0.8), dn = Math.max(0, (f - 0.8) / 0.2);
      const xo = s % 2 ? (1 - hf) * range : hf * range;
      return [M + xo, y0 + ((s + dn) / SWEEPS) * (y1 - y0)];
    };
    const apos = (a) => {
      if (a.st) return [a.fx, a.fy];
      const [ox, oy] = where();
      return [ox + colW * (a.i + 0.5), oy + (a.i % 2) * k * 3];
    };
    const flee = (a) => {
      if (a.st) return;
      [a.fx, a.fy] = apos(a);
      a.st = "flee";
      a.bt = 0;
    };
    const fire = () => {
      if (shot) return; // počaka, da prejšnji strel izgine
      want = false;
      track = null;
      if (!G.q || G.waiting || !al.some((a) => !a.st)) return;
      shot = { x: cx, y: cy() - k * 4 };
      G.sound("pop");
    };
    const hit = (a, ax, ay) => {
      const ok = G.isRight(a.txt);
      a.st = "boom";
      a.bt = 0;
      a.ok = ok;
      [a.fx, a.fy] = [ax, ay];
      G.burst(ax, ay, ok ? "#fde047" : "#ef4444", ok ? 24 : 10);
      G.answer(ok, ax, ay, ok ? { delay: 0.8 } : { keep: true });
      if (ok) al.forEach(flee);
    };
    return {
      resize() {
        layout();
        cx = clamp(cx || G.W / 2, k * 7, G.W - k * 7);
      },
      reset() {
        al = [];
        shot = null;
        tx = track = null;
        want = false;
        hold = 0;
        t = 0;
        cx = G.W / 2;
      },
      question() {
        const off = Math.floor(rand(0, 3));
        al = G.opts.map((txt, i) => ({ txt, i, sp: (i + off) % ALIENS.length, st: null, bt: 0 }));
        layout();
        t = 0;
        dur = Math.max(8, invaders.timer / clamp(G.speed, 0.8, 1.4) - 0.4);
        shot = null;
        want = false;
        track = null;
      },
      timeout() {
        al.forEach(flee);
      },
      update(dt) {
        if (G.q && !G.waiting && al.some((a) => !a.st)) t += dt;
        // top
        const spd = Math.max(420, G.W * 0.9);
        if (hold) {
          cx += hold * spd * dt;
          tx = null;
          track = null;
        } else {
          if (track) {
            if (track.st) (track = null), (want = false);
            else tx = apos(track)[0];
          }
          if (tx != null) {
            const d = tx - cx, st = spd * dt;
            cx = Math.abs(d) <= st ? tx : cx + Math.sign(d) * st;
          }
        }
        cx = clamp(cx, k * 7, G.W - k * 7);
        if (want && !shot && (tx == null || hold || Math.abs(clamp(tx, k * 7, G.W - k * 7) - cx) < 3)) fire();
        // strel
        if (shot) {
          const ny = shot.y - Math.max(500, G.H * 1.3) * dt;
          for (const a of al) {
            if (a.st) continue;
            const [ax, ay] = apos(a);
            const top = ay - k * 4 - 2, bot = ay + k * 4 + 6 + ph();
            if (Math.abs(shot.x - ax) < colW / 2 && ny <= bot && shot.y >= top) {
              shot = null;
              hit(a, ax, ay);
              break;
            }
          }
          if (shot) {
            shot.y = ny;
            if (ny < -20) shot = null;
          }
        }
        // pravilni vesoljec je prišel do tal
        if (G.q && !G.waiting && t >= dur && al.some((a) => !a.st)) {
          const r = al.find((a) => !a.st && G.isRight(a.txt));
          const [x, y] = r ? apos(r) : [G.W / 2, G.H / 2];
          al.forEach(flee);
          G.answer(false, x, y);
        }
        for (const a of al) {
          if (!a.st) continue;
          a.bt += dt;
          if (a.st === "flee") a.fy -= dt * G.H * 0.9;
        }
        al = al.filter((a) => !a.st || a.bt < 1.2);
      },
      pointer(type, p) {
        if (type === "down" || type === "move") {
          tx = p.x;
          track = null;
          if (type === "down") hold = 0;
        } else if (type === "up") {
          tx = p.x;
          want = true;
        }
      },
      key(key, down) {
        if (LEFT.has(key) || RIGHT.has(key)) {
          const d = LEFT.has(key) ? -1 : 1;
          if (down) hold = d;
          else if (hold === d) hold = 0;
          return true;
        }
        if (!down) return false;
        if (FIRE.has(key)) {
          tx = null;
          track = null;
          want = true;
          return true;
        }
        const n = numKey(key);
        const live = al.filter((a) => !a.st);
        if (n >= 0 && live[n]) {
          hold = 0;
          track = live[n];
          want = true;
          return true;
        }
        return false;
      },
      draw(g) {
        const [bg, star, ground, cols, glow] = chap(G, [
          ["#04050d", "#e2e8f0", "#4ade80", ["#4ade80", "#f472b6", "#60a5fa", "#fde047"], null],
          ["#03120a", "#bbf7d0", "#a3e635", ["#a3e635", "#22d3ee", "#fde047", "#34d399"], "rgba(34,197,94,0.14)"],
          ["#14040f", "#fecdd3", "#fb7185", ["#fb7185", "#fdba74", "#fde047", "#c084fc"], "rgba(244,63,94,0.2)"],
          ["#070726", "#e0e7ff", "#38bdf8", ["#38bdf8", "#a78bfa", "#f472b6", "#fbbf24"], "rgba(129,140,248,0.18)"],
        ]);
        g.fillStyle = bg;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        if (glow) {
          const grd = g.createRadialGradient(G.W * 0.7, G.H * 0.3, 0, G.W * 0.7, G.H * 0.3, Math.max(G.W, G.H) * 0.6);
          grd.addColorStop(0, glow);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = grd;
          g.fillRect(0, 0, G.W, G.H);
        }
        drawStars(g, G, sky, star);
        // tla
        const gy = cy() + k * 4 + 3;
        g.fillStyle = ground;
        g.fillRect(0, gy, G.W, 3);
        // vesoljci
        const frame = Math.floor(G.time * 2.4) % 2;
        for (const a of al) {
          const [x, y] = apos(a);
          const c = cols[a.i % cols.length];
          if (a.st === "boom") {
            if (a.bt < 0.4) sprite(g, BOOM, x, y, k, { X: a.ok ? "#fde047" : "#ef4444" });
            continue;
          }
          g.globalAlpha = a.st === "flee" ? Math.max(0, 1 - a.bt) : 1;
          sprite(g, ALIENS[a.sp][a.st ? 0 : frame], x, y, k, { X: c, W: "#ffffff", K: INK, A: "#f8fafc" });
          pill(G, g, a.txt, x, y + k * 4 + 6 + ph() / 2, colW - 8, ph(), "#f8fafc", { focus: a === track, size: Math.min(21, ph() * 0.56) });
          g.globalAlpha = 1;
        }
        // strel
        if (shot) {
          g.fillStyle = "#ffffff";
          g.fillRect(shot.x - 1.5, shot.y - 14, 3, 14);
          g.fillStyle = ground;
          g.fillRect(shot.x - 1.5, shot.y - 4, 3, 4);
        }
        // Zarin top
        sprite(g, CANNON, cx, cy(), k, { X: "#e2e8f0", W: "#38bdf8", K: "#64748b", A: shot ? "#94a3b8" : "#fde047" });
        scanlines(g, G);
      },
    };
  },
};

// ============ PRISTANEK: robotek Bip mehko pristane na ploščadi s pravilnim odgovorom ============
export const lander = {
  id: "lander",
  story: {
    sl: [["Mala luna", "Robotek Bip mora mehko pristati na mali luni."], ["Modri planet", "Bip leti naprej proti modremu planetu."], ["Ledeni svet", "Pod Bipom se lesketajo ledene gore."], ["Zlata baza", "Bip se vrača domov v zlato bazo!"]],
    en: [["The little moon", "Bip the robot must land softly on the little moon."], ["The blue planet", "Bip flies on towards the blue planet."], ["Ice world", "Icy mountains glitter below Bip."], ["The golden base", "Bip is flying home to the golden base!"]],
  },
  icon: "moon",
  colors: ["#020617", "#065f46"],
  options: 3,
  timer: 25,
  create(G) {
    let pads = [], terr = [], sky = makeStars(60), st = "wait", t = 0;
    let ship = { x: 0, y: 0, vx: 0, vy: 0 }, hold = 0, boost = false, aim = null, auto = null, jet = 0;
    const gy = () => G.H - clamp(G.H * 0.2, 84, 150); // višina ploščadi
    const S = () => clamp(Math.min(G.W, G.H) / 24, 11, 24); // velikost ladjice
    const topY = () => clamp(G.H * 0.1, 30, 80) + S();
    const vmax = () => clamp(G.W * 0.3, 100, 260);
    const fallV = () => (gy() - topY()) / (9 / G.speed);
    const foot = () => ship.y + S() * 1.2;
    const layout = () => {
      const n = pads.length || 3, cw = G.W / n, y = gy(), hill = clamp(G.H * 0.06, 20, 48);
      pads.forEach((p, i) => Object.assign(p, { x: cw * (i + 0.5), w: Math.min(cw * 0.36, 110) }));
      terr = [[-10, y - hill * 1.3]];
      pads.forEach((p, i) => {
        const a = i ? pads[i - 1].x + pads[i - 1].w : 0, b = p.x - p.w;
        if (i) terr.push([a + (b - a) * 0.22, y - hill * 0.55], [a + (b - a) * 0.48, y - hill], [a + (b - a) * 0.74, y - hill * 0.35]);
        else terr.push([b * 0.45, y - hill * 0.7]);
        terr.push([b, y], [p.x + p.w, y]);
      });
      const last = pads[pads.length - 1];
      if (last) terr.push([(last.x + last.w + G.W) / 2, y - hill * 0.6]);
      terr.push([G.W + 10, y - hill * 1.2]);
    };
    const groundAt = (x) => {
      for (let i = 1; i < terr.length; i++) {
        const [ax, ay] = terr[i - 1], [bx, by] = terr[i];
        if (x <= bx) return ay + ((by - ay) * (x - ax)) / Math.max(1, bx - ax);
      }
      return gy();
    };
    const padAt = (x) => pads.find((p) => Math.abs(x - p.x) <= p.w + S() * 0.4);
    const bounce = (y) => {
      ship.y = y - S() * 1.2 - 1;
      ship.vy = -fallV() * 2.5;
      // prijazen pomoček: rahlo potisne proti najbližji živi ploščadi
      const near = pads.filter((p) => !p.gone).sort((a, b) => Math.abs(a.x - ship.x) - Math.abs(b.x - ship.x))[0];
      if (near) ship.vx += Math.sign(near.x - ship.x) * vmax() * 0.5;
      G.burst(ship.x, y, "#94a3b8", 6);
      G.sound("pop");
    };
    const land = (p) => {
      ship.y = gy() - S() * 1.2;
      ship.vx = 0;
      ship.x = clamp(ship.x, p.x - p.w + S() * 0.6, p.x + p.w - S() * 0.6);
      auto = null;
      if (G.isRight(p.txt)) {
        st = "landed";
        p.won = true;
        G.answer(true, ship.x, ship.y - S() * 2, { delay: 0.9 });
      } else {
        p.gone = true;
        st = "wrong";
        t = 0;
        G.answer(false, p.x, gy(), { keep: true });
      }
    };
    const spawn = () => {
      ship = { x: G.W * rand(0.25, 0.75), y: topY(), vx: 0, vy: fallV() };
    };
    return {
      resize() {
        layout();
        if (st === "wait") ship = { x: G.W / 2, y: topY(), vx: 0, vy: 0 };
        ship.x = clamp(ship.x, S() * 1.4, G.W - S() * 1.4);
        if (st === "landed" || st === "wrong") ship.y = gy() - S() * 1.2;
      },
      reset() {
        pads = [];
        layout();
        st = "wait";
        auto = aim = null;
        hold = 0;
        boost = false;
        ship = { x: G.W / 2, y: topY(), vx: 0, vy: 0 };
      },
      question() {
        pads = G.opts.map((txt) => ({ txt, gone: false, won: false }));
        layout();
        spawn();
        st = "fly";
        auto = null;
      },
      timeout() {
        st = "idle";
      },
      update(dt) {
        jet = 0;
        if (st === "fly" && G.q && !G.waiting) {
          const vm = vmax();
          let goal = aim ? aim.x : auto && !auto.gone ? auto.x : null;
          if (hold) {
            ship.vx += hold * vm * 1.6 * dt;
            jet = hold;
          } else if (goal != null) {
            const want = clamp((goal - ship.x) * 2, -vm, vm);
            jet = Math.abs(want - ship.vx) > 8 ? Math.sign(want - ship.vx) : 0;
            ship.vx += (want - ship.vx) * Math.min(1, dt * 3);
          } else ship.vx *= Math.exp(-dt * 3);
          ship.vx = clamp(ship.vx, -vm, vm);
          // hitreje navzdol: tipka ↓ ali prst pod ladjico
          const over = (aim && aim.y > foot() + S() * 2 && Math.abs(aim.x - ship.x) < S() * 3) || (auto && Math.abs(auto.x - ship.x) < auto.w * 0.6);
          const fv = fallV() * (boost || over ? 2.6 : 1);
          ship.vy += (fv - ship.vy) * Math.min(1, dt * 1.6);
          ship.x += ship.vx * dt;
          ship.y += ship.vy * dt;
          if (ship.x < S() * 1.4 || ship.x > G.W - S() * 1.4) (ship.x = clamp(ship.x, S() * 1.4, G.W - S() * 1.4)), (ship.vx = 0);
          const p = padAt(ship.x);
          if (p && foot() >= gy()) p.gone ? bounce(gy()) : land(p);
          else if (!p && foot() >= groundAt(ship.x)) bounce(groundAt(ship.x));
        } else if (st === "wrong") {
          t += dt;
          if (t > 0.7) st = "lift";
        } else if (st === "lift") {
          ship.y -= dt * Math.max(260, G.H * 0.9);
          if (ship.y <= topY()) {
            ship.y = topY();
            ship.vx = 0;
            ship.vy = fallV();
            st = "fly";
          }
        }
      },
      pointer(type, p, pressed) {
        // tap na ploščad ali njen napis: ladjica sama odleti tja
        if (type === "down" && p.y > gy() - S() * 2) {
          const near = pads.filter((q) => !q.gone).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
          if (near && Math.abs(near.x - p.x) < G.W / pads.length / 2 + 10) {
            auto = near;
            aim = null;
            return;
          }
        }
        if (type === "down" || (type === "move" && pressed && aim)) {
          aim = { x: p.x, y: p.y };
          auto = null;
        } else if (type === "up") aim = null;
      },
      key(key, down) {
        if (LEFT.has(key) || RIGHT.has(key)) {
          const d = LEFT.has(key) ? -1 : 1;
          if (down) (hold = d), (auto = null);
          else if (hold === d) hold = 0;
          return true;
        }
        if (key === "ArrowDown" || key === "s" || key === "S" || key === " ") {
          boost = down;
          return true;
        }
        if (!down) return false;
        const n = numKey(key);
        if (n >= 0 && pads[n] && !pads[n].gone) {
          auto = pads[n];
          hold = 0;
          return true;
        }
        return false;
      },
      draw(g) {
        const [line, padC, planet] = chap(G, [["#4ade80", "#fde047", "#a3e635"], ["#22d3ee", "#f0abfc", "#60a5fa"], ["#e0f2fe", "#7dd3fc", "#c4b5fd"], ["#fbbf24", "#fef3c7", "#fb923c"]]);
        g.fillStyle = "#02030a";
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        drawStars(g, G, sky, "#e2e8f0", 0.75);
        g.lineCap = "round";
        g.lineJoin = "round";
        // planet v ozadju (obris z obročem)
        const pr = Math.min(G.W, G.H) * 0.08, px = G.W * 0.8, py = G.H * 0.22;
        g.strokeStyle = planet;
        g.lineWidth = 2;
        g.globalAlpha = 0.55;
        const ringArc = (a0, a1) => {
          g.beginPath();
          g.ellipse(px, py, pr * 1.7, pr * 0.42, -0.3, a0, a1);
          g.stroke();
        };
        ringArc(Math.PI, Math.PI * 2); // zadnji del obroča gre za planet
        g.fillStyle = "#02030a";
        g.beginPath();
        g.arc(px, py, pr, 0, Math.PI * 2);
        g.fill();
        g.stroke();
        ringArc(0, Math.PI);
        g.beginPath();
        g.arc(px - pr * 0.35, py - pr * 0.3, pr * 0.2, 0, Math.PI * 2);
        g.stroke();
        g.globalAlpha = 1;
        // tla v vektorskem slogu
        if (!G.reduced) {
          g.shadowColor = line;
          g.shadowBlur = 8;
        }
        g.beginPath();
        terr.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.lineTo(G.W + 10, G.H + 10);
        g.lineTo(-10, G.H + 10);
        g.closePath();
        g.fillStyle = "#050814";
        g.fill();
        g.beginPath();
        terr.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.strokeStyle = line;
        g.lineWidth = 2;
        g.stroke();
        // ploščadi
        for (const p of pads) {
          const y = gy();
          g.strokeStyle = p.gone ? "#ef4444" : p.won ? "#4ade80" : padC;
          g.lineWidth = 5;
          g.beginPath();
          g.moveTo(p.x - p.w, y);
          g.lineTo(p.x + p.w, y);
          g.stroke();
          g.lineWidth = 2;
          for (const sx of [-1, 1]) {
            g.beginPath();
            g.moveTo(p.x + sx * p.w, y);
            g.lineTo(p.x + sx * p.w, y - 10);
            g.stroke();
          }
        }
        g.shadowBlur = 0;
        const bandY = gy() + (G.H - gy()) / 2, ph = clamp(G.H * 0.06, 28, 40);
        pads.forEach((p) => {
          g.globalAlpha = p.gone ? 0.4 : 1;
          const w = pill(G, g, p.txt, p.x, bandY, Math.min(p.w * 2 + 30, G.W / pads.length - 8), ph, p.won ? "#bbf7d0" : "#f8fafc", { focus: p === auto, size: Math.min(20, ph * 0.55) });
          g.globalAlpha = 1;
          if (p.gone) {
            g.strokeStyle = "#ef4444";
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(p.x - w / 2, bandY - ph / 2);
            g.lineTo(p.x + w / 2, bandY + ph / 2);
            g.moveTo(p.x + w / 2, bandY - ph / 2);
            g.lineTo(p.x - w / 2, bandY + ph / 2);
            g.stroke();
          }
        });
        if (st === "wait" && !G.q) return;
        // pikčasta črta navzdol pokaže, kam bo ladjica pristala
        const s = S(), X = ship.x, Y = ship.y;
        if (st === "fly") {
          const p = padAt(X), to = p ? gy() : groundAt(X);
          g.strokeStyle = line;
          g.globalAlpha = 0.45;
          g.lineWidth = 2;
          g.setLineDash([3, 9]);
          g.beginPath();
          g.moveTo(X, foot() + 6);
          g.lineTo(X, to - 4);
          g.stroke();
          g.setLineDash([]);
          g.globalAlpha = 1;
        }
        // plamen
        const fl = G.reduced ? 0.5 : 0.35 + Math.abs(Math.sin(G.time * 23)) * 0.4;
        g.strokeStyle = "#fb923c";
        g.lineWidth = 2;
        if (st === "fly" || st === "lift") {
          g.beginPath();
          g.moveTo(X - s * 0.3, Y + s * 0.5);
          g.lineTo(X, Y + s * (0.9 + fl * (st === "lift" ? 1.6 : 1)));
          g.lineTo(X + s * 0.3, Y + s * 0.5);
          g.stroke();
        }
        if (jet && st === "fly") {
          const jx = X - jet * s * 1.05;
          g.beginPath();
          g.moveTo(jx, Y - s * 0.15);
          g.lineTo(jx - jet * s * (0.4 + fl * 0.6), Y);
          g.lineTo(jx, Y + s * 0.15);
          g.stroke();
        }
        // ladjica: kupola, trup, noge (bele črte), v kupoli Bipove oči
        if (!G.reduced) {
          g.shadowColor = "#ffffff";
          g.shadowBlur = 6;
        }
        g.strokeStyle = "#f8fafc";
        g.lineWidth = 2.5;
        g.beginPath();
        g.arc(X, Y - s * 0.4, s * 0.7, Math.PI, 0);
        g.closePath();
        g.moveTo(X - s, Y - s * 0.4);
        g.lineTo(X + s, Y - s * 0.4);
        g.lineTo(X + s * 0.7, Y + s * 0.45);
        g.lineTo(X - s * 0.7, Y + s * 0.45);
        g.closePath();
        for (const sx of [-1, 1]) {
          g.moveTo(X + sx * s * 0.55, Y + s * 0.45);
          g.lineTo(X + sx * s * 1.05, Y + s * 1.2);
          g.moveTo(X + sx * s * 1.3, Y + s * 1.2);
          g.lineTo(X + sx * s * 0.8, Y + s * 1.2);
        }
        g.stroke();
        g.shadowBlur = 0;
        g.fillStyle = line;
        const look = clamp(ship.vx / vmax(), -1, 1) * s * 0.12;
        g.fillRect(X - s * 0.32 + look, Y - s * 0.75, s * 0.18, s * 0.26);
        g.fillRect(X + s * 0.14 + look, Y - s * 0.75, s * 0.18, s * 0.26);
        if (st === "landed") {
          // zastavica ob pristanku
          g.strokeStyle = "#f8fafc";
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(X + s * 1.6, gy());
          g.lineTo(X + s * 1.6, gy() - s * 1.8);
          g.stroke();
          g.fillStyle = "#4ade80";
          g.beginPath();
          g.moveTo(X + s * 1.6, gy() - s * 1.8);
          g.lineTo(X + s * 2.5, gy() - s * 1.5);
          g.lineTo(X + s * 1.6, gy() - s * 1.2);
          g.fill();
        }
      },
    };
  },
};

// ============ MEHURČKI: hobotnička Pika izstreli mehurček v mehurček s pravilnim odgovorom ============
const CANDY = ["#ff6fb5", "#ffd23f", "#4ade80", "#38bdf8", "#c084fc", "#fb923c", "#f87171", "#2dd4bf"];

export const bubbles = {
  id: "bubbles",
  story: {
    sl: [["Turkizna laguna", "Hobotnička Pika lovi mehurčke s pravimi odgovori."], ["Koralni greben", "Med koralami se pozibavajo pisani mehurčki."], ["Globoko morje", "V temnih globinah mehurčki kar žarijo."], ["Sončni zahod", "Pika splava na površje, ko zahaja sonce!"]],
    en: [["Turquoise lagoon", "Pika the little octopus pops bubbles with the right answers."], ["Coral reef", "Colourful bubbles sway among the corals."], ["The deep sea", "Down in the dark deep, the bubbles glow."], ["Sunset", "Pika swims up to the surface at sunset!"]],
  },
  icon: "circle",
  colors: ["#0e7490", "#db2777"],
  options: 4,
  timer: 22,
  create(G) {
    let balls = [], fills = [], popped = new Set(), shot = null, ang = 0, turn = 0, aiming = false, rings = [], R = 40, r = 20, next = CANDY[0], deco = [];
    const base = () => [G.W / 2, G.H - clamp(G.H * 0.12, 52, 90)];
    const rs = () => R * 0.42;
    const sway = () => {
      const a = [0, 0.6, 1, 1.2][Math.min(4, G.chapter || 1) - 1];
      return a ? Math.sin(G.time * 0.8 * G.speed) * Math.min(G.W * 0.05, 34) * a : 0;
    };
    const layout = () => {
      const n = balls.length || 4;
      R = clamp(Math.min((G.W - 16) / (n * 2.25), G.H * 0.085), 26, 60);
      r = R * 0.5;
      const top = r * 3.75;
      const sp = Math.min((G.W - 2 * R - 24) / Math.max(1, n - 1), R * 3.2);
      balls.forEach((b, i) => Object.assign(b, { x: G.W / 2 + (i - (n - 1) / 2) * sp, y: top + R + (i % 2) * R * 0.75 }));
      fills = [];
      for (let j = 0; j < 2; j++)
        for (let m = 0, x = r + (j % 2) * r; x < G.W - r * 0.4; m++, x += 2 * r) {
          const key = `${j},${m}`;
          fills.push({ key, x, y: r + j * r * 1.75, color: CANDY[(j * 3 + m * 5) % CANDY.length] });
        }
    };
    // Kaj zadene krogla na (x, y)?
    const hitAt = (x, y) => {
      const s = sway();
      for (const b of balls) if (!b.st && Math.hypot(x - b.x - s, y - b.y) < R + rs() * 0.7) return { b };
      for (const f of fills) if (!popped.has(f.key) && Math.hypot(x - f.x - s, y - f.y) < r + rs() * 0.7) return { f };
      return null;
    };
    const muzzle = () => {
      const [bx, by] = base();
      return [bx + Math.sin(ang) * R * 0.9, by - Math.cos(ang) * R * 0.9];
    };
    const setAim = (p) => {
      const [bx, by] = base();
      ang = clamp(Math.atan2(p.x - bx, Math.max(10, by - p.y)), -1.3, 1.3);
    };
    const fire = () => {
      if (shot || !G.q || G.waiting) return;
      const [x, y] = muzzle(), v = clamp(G.H * 1.5, 650, 1150);
      shot = { x, y, vx: Math.sin(ang) * v, vy: -Math.cos(ang) * v, b: 0, color: next };
      next = pickOne(CANDY);
      G.sound("pop");
    };
    const ring = (x, y, rad, color) => rings.push({ x, y, r: rad, color, t: 0 });
    const popFill = (f) => {
      if (popped.has(f.key)) return;
      popped.add(f.key);
      const x = f.x + sway();
      ring(x, f.y, r, f.color);
      G.burst(x, f.y, f.color, 6);
    };
    const hitBall = (b) => {
      const x = b.x + sway(), y = b.y;
      const ok = G.isRight(b.txt);
      b.st = "pop";
      ring(x, y, R, ok ? b.color : "#94a3b8");
      G.burst(x, y, ok ? b.color : "#94a3b8", ok ? 26 : 12);
      G.answer(ok, x, y - R, ok ? { delay: 0.9 } : { keep: true });
      if (!ok) return;
      // sosedi počijo za zabavo, ostali mehurčki odpadejo
      for (const f of fills) {
        const d = Math.hypot(f.x + sway() - x, f.y - y);
        if (d < R * 3.2) f.at = G.time + d / (R * 9);
      }
      for (const o of balls) if (!o.st) (o.st = "drop"), (o.vy = -60), (o.dy = 0);
    };
    return {
      resize() {
        layout();
        deco = Array.from({ length: 10 }, () => ({ x: Math.random(), y: Math.random(), s: rand(3, 8), v: rand(0.02, 0.05) }));
      },
      reset() {
        balls = [];
        popped = new Set();
        shot = null;
        rings = [];
        ang = turn = 0;
        aiming = false;
        layout();
      },
      question() {
        const off = Math.floor(rand(0, CANDY.length));
        balls = G.opts.map((txt, i) => ({ txt, i, color: CANDY[(off + i * 3) % CANDY.length], st: null, dy: 0, vy: 0 }));
        popped = new Set();
        shot = null;
        layout();
      },
      timeout() {
        shot = null;
        for (const o of balls) if (!o.st) (o.st = "drop"), (o.vy = -60), (o.dy = 0);
      },
      update(dt) {
        ang = clamp(ang + turn * 1.4 * dt, -1.3, 1.3);
        if (!G.reduced) for (const d of deco) (d.y -= d.v * dt), d.y < -0.05 && ((d.y = 1.05), (d.x = Math.random()));
        for (const f of fills) if (f.at && G.time >= f.at) (f.at = 0), popFill(f);
        for (const b of balls) if (b.st === "drop") (b.vy += 900 * dt), (b.dy += b.vy * dt);
        for (const q of rings) q.t += dt;
        rings = rings.filter((q) => q.t < 0.45);
        if (!shot) return;
        const steps = Math.ceil((Math.hypot(shot.vx, shot.vy) * dt) / 8);
        for (let i = 0; i < steps && shot; i++) {
          shot.x += (shot.vx * dt) / steps;
          shot.y += (shot.vy * dt) / steps;
          const s = rs();
          if ((shot.x < s && shot.vx < 0) || (shot.x > G.W - s && shot.vx > 0)) {
            if (shot.b++ >= 1) {
              ring(shot.x, shot.y, s, shot.color);
              shot = null;
              break;
            }
            shot.vx = -shot.vx;
          }
          const h = hitAt(shot.x, shot.y);
          if (h?.b) {
            shot = null;
            if (G.q && !G.waiting) hitBall(h.b);
          } else if (h?.f) {
            shot = null;
            popFill(h.f);
            G.sound("pop");
          } else if (shot.y < -s) shot = null;
        }
      },
      pointer(type, p, pressed) {
        if (type === "down") {
          aiming = true;
          setAim(p);
        } else if (type === "move") setAim(p);
        else if (type === "up" && aiming) {
          aiming = false;
          setAim(p);
          fire();
        }
      },
      key(key, down) {
        if (LEFT.has(key) || RIGHT.has(key)) {
          const d = LEFT.has(key) ? -1 : 1;
          if (down) turn = d;
          else if (turn === d) turn = 0;
          return true;
        }
        if (!down) return false;
        if (FIRE.has(key)) return fire(), true;
        const n = numKey(key);
        const live = balls.filter((b) => !b.st).sort((a, b) => a.x - b.x);
        if (n >= 0 && live[n]) {
          setAim({ x: live[n].x + sway(), y: live[n].y });
          fire();
          return true;
        }
        return false;
      },
      draw(g) {
        const [w0, w1, sand, ray] = chap(G, [
          ["#5eead4", "#0e7490", "#fde68a", "rgba(255,255,255,0.12)"],
          ["#fbcfe8", "#be185d", "#fdba74", "rgba(255,255,255,0.14)"],
          ["#1e1b4b", "#020617", "#475569", "rgba(165,180,252,0.08)"],
          ["#fdba74", "#6d28d9", "#fcd34d", "rgba(255,237,213,0.16)"],
        ]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, w0);
        grd.addColorStop(1, w1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // svetlobni žarki
        g.fillStyle = ray;
        for (let i = 0; i < 4; i++) {
          const x = G.W * (0.12 + i * 0.27);
          g.beginPath();
          g.moveTo(x, 0);
          g.lineTo(x + G.W * 0.08, 0);
          g.lineTo(x + G.W * 0.2, G.H);
          g.lineTo(x + G.W * 0.06, G.H);
          g.fill();
        }
        g.strokeStyle = "rgba(255,255,255,0.35)";
        g.lineWidth = 1.5;
        for (const d of deco) {
          g.beginPath();
          g.arc(d.x * G.W, d.y * G.H, d.s, 0, Math.PI * 2);
          g.stroke();
        }
        // pesek
        const [bx, by] = base(), sy = by + R * 0.55;
        g.fillStyle = sand;
        g.beginPath();
        g.moveTo(-20, G.H + 20);
        for (let x = -20; x <= G.W + 20; x += 20) g.lineTo(x, sy + Math.sin(x / 40) * 4);
        g.lineTo(G.W + 20, G.H + 20);
        g.closePath();
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // pikčasta merilna črta (z enim odbojem)
        if (!shot && G.q && !G.waiting) {
          let [x, y] = muzzle(), vx = Math.sin(ang), vy = -Math.cos(ang), b = 0, end = null;
          g.fillStyle = "rgba(255,255,255,0.85)";
          for (let i = 0; i < 400; i++) {
            x += vx * 6;
            y += vy * 6;
            if ((x < rs() && vx < 0) || (x > G.W - rs() && vx > 0)) {
              if (b++ >= 1) break;
              vx = -vx;
            }
            if (y < 0) break;
            if (hitAt(x, y)) {
              end = [x, y];
              break;
            }
            if (i % 3 === 2) {
              g.beginPath();
              g.arc(x, y, 2.5, 0, Math.PI * 2);
              g.fill();
            }
          }
          if (end) {
            g.strokeStyle = "rgba(255,255,255,0.9)";
            g.lineWidth = 2;
            g.setLineDash([4, 4]);
            g.beginPath();
            g.arc(end[0], end[1], rs(), 0, Math.PI * 2);
            g.stroke();
            g.setLineDash([]);
          }
        }
        const bubble = (x, y, rad, color, lw) => {
          g.fillStyle = color;
          g.beginPath();
          g.arc(x, y, rad, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = lw;
          g.strokeStyle = INK;
          g.stroke();
          g.strokeStyle = "rgba(255,255,255,0.75)";
          g.lineWidth = Math.max(2, rad * 0.12);
          g.beginPath();
          g.arc(x, y, rad * 0.68, Math.PI * 1.1, Math.PI * 1.45);
          g.stroke();
        };
        const s = sway();
        for (const f of fills) if (!popped.has(f.key)) bubble(f.x + s, f.y, r, f.color, 2.5);
        for (const b of balls) {
          if (b.st === "pop") continue;
          const y = b.y + (b.dy || 0);
          if (y > G.H + R) continue;
          bubble(b.x + s, y, R, b.color, 3);
          pill(G, g, b.txt, b.x + s, y, R * 1.85, Math.min(36, R * 0.66), "#fffbeb", { size: Math.min(22, R * 0.46) });
        }
        for (const q of rings) {
          g.globalAlpha = Math.max(0, 1 - q.t / 0.45);
          g.strokeStyle = q.color;
          g.lineWidth = 3;
          g.beginPath();
          g.arc(q.x, q.y, q.r * (1 + q.t * 1.6), 0, Math.PI * 2);
          g.stroke();
        }
        g.globalAlpha = 1;
        if (shot) bubble(shot.x, shot.y, rs(), shot.color, 2.5);
        // Pika: roza hobotnička z lovki, roka drži naslednji mehurček
        const ro = R * 0.62, [mx, my] = muzzle();
        g.strokeStyle = INK;
        g.lineCap = "round";
        for (let i = 0; i < 4; i++) {
          const ox = bx + (i - 1.5) * ro * 0.55, w = G.reduced ? 0 : Math.sin(G.time * 3 + i) * ro * 0.12;
          g.lineWidth = ro * 0.38;
          g.strokeStyle = INK;
          g.beginPath();
          g.moveTo(ox, by + ro * 0.3);
          g.quadraticCurveTo(ox + w + (i - 1.5) * ro * 0.3, by + ro * 0.9, ox + (i - 1.5) * ro * 0.45, by + ro * 1.3);
          g.stroke();
          g.lineWidth = ro * 0.24;
          g.strokeStyle = "#f472b6";
          g.stroke();
        }
        g.lineWidth = ro * 0.36;
        g.strokeStyle = INK;
        g.beginPath();
        g.moveTo(bx, by);
        g.lineTo(mx, my);
        g.stroke();
        g.lineWidth = ro * 0.22;
        g.strokeStyle = "#f472b6";
        g.stroke();
        g.fillStyle = "#f472b6";
        g.beginPath();
        g.ellipse(bx, by, ro, ro * 0.9, 0, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        const lx = Math.sin(ang) * ro * 0.1, ly = -Math.cos(ang) * ro * 0.1;
        for (const sx of [-1, 1]) {
          g.fillStyle = "#fff";
          g.beginPath();
          g.arc(bx + sx * ro * 0.38, by - ro * 0.15, ro * 0.27, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = 2;
          g.stroke();
          g.fillStyle = INK;
          g.beginPath();
          g.arc(bx + sx * ro * 0.38 + lx, by - ro * 0.15 + ly, ro * 0.12, 0, Math.PI * 2);
          g.fill();
        }
        g.beginPath();
        g.arc(bx, by + ro * 0.25, ro * 0.22, 0.15, Math.PI - 0.15);
        g.lineWidth = 2;
        g.stroke();
        if (!shot) bubble(mx, my, rs(), next, 2.5);
      },
    };
  },
};

export const ARCADE2 = [invaders, lander, bubbles];
