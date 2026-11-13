// Arkadne vrste iger v duhu iger iz 80. in zgodnjih 90. let (labirint, grajska ploščad, kača, žaba, krti).
// Izvirni liki in pravila; navdih je le žanr. Vmesnik je isti kot v engines.js.

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
const NEON = ["#fde047", "#f472b6", "#4ade80", "#60a5fa", "#fb923c", "#c084fc", "#22d3ee", "#f87171"];
const shuffleCopy = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };

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
// Smer iz dotika: poteg ali tap glede na lik.
function swipeDir(dx, dy) {
  return Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy) || 1];
}
// Tipke 1–9 in izbira s puščicami med predmeti.
function numKey(k) {
  return /^[1-9]$/.test(k) ? Number(k) - 1 : -1;
}

// ============ LABIRINT: Piko v neonskem labirintu poje pravilni odgovor, hrošči ga pošljejo na start ============
const MAZE = ["#########", "#...#...#", "#.#.#.#.#", "#.......#", "#.##.##.#", "#...#...#", "##.#.#.##", "#.......#", "#.#.#.#.#", "#...#...#", "#########"];
const SPOTS = [[1, 1], [7, 1], [1, 9], [7, 9], [1, 5], [7, 5], [4, 3]];
const open = (x, y) => MAZE[y]?.[x] === ".";
const walker = (x, y) => ({ cx: x, cy: y, nx: x, ny: y, t: 0, dx: 0, dy: 0 });
const wpos = (w) => [w.cx + (w.nx - w.cx) * w.t, w.cy + (w.ny - w.cy) * w.t];
function stepWalker(w, speed, dt, choose) {
  if (w.nx === w.cx && w.ny === w.cy) {
    const d = choose(w);
    if (!d || !open(w.cx + d[0], w.cy + d[1])) return;
    [w.dx, w.dy] = d;
    w.nx = w.cx + d[0];
    w.ny = w.cy + d[1];
    w.t = 0;
  }
  w.t += speed * dt;
  while (w.t >= 1) {
    w.cx = w.nx;
    w.cy = w.ny;
    w.t -= 1;
    w.arrived?.(w);
    const d = choose(w);
    if (d && open(w.cx + d[0], w.cy + d[1])) [w.dx, w.dy] = d;
    if (open(w.cx + w.dx, w.cy + w.dy)) {
      w.nx = w.cx + w.dx;
      w.ny = w.cy + w.dy;
    } else {
      w.t = 0;
      break;
    }
  }
}

export const maze = {
  id: "maze",
  story: {
    sl: [["Neonski labirint", "Piko išče prave odgovore v svetlečem labirintu."], ["Hrošči se množijo", "Hrošči so lačni, Piko pa hiter."], ["Vijolična dvorana", "Labirint zasije v novih barvah."], ["Zlati izhod", "Še malo in Piko najde zlati izhod!"]],
    en: [["Neon maze", "Piko hunts for right answers in a glowing maze."], ["More bugs", "The bugs are hungry, but Piko is quick."], ["The violet hall", "The maze glows in new colours."], ["The golden exit", "Piko is close to the golden exit!"]],
  },
  icon: "puzzle",
  colors: ["#0b1026", "#1d4ed8"],
  options: 4,
  timer: 30,
  create(G) {
    let cell = 30, ox = 0, oy = 0, tokens = [], pellets = new Set(), inv = 0, bugs = [], start = null, sel = -1;
    const P = walker(4, 7);
    P.want = null;
    const toXY = (gx, gy) => [ox + (gx + 0.5) * cell, oy + (gy + 0.5) * cell];
    const refill = () => {
      pellets = new Set();
      MAZE.forEach((row, y) => [...row].forEach((c, x) => c === "." && pellets.add(`${x},${y}`)));
    };
    const home = () => {
      Object.assign(P, walker(4, 7), { want: null });
      inv = 1.5;
    };
    const makeBugs = () => {
      bugs = [walker(4, 3)];
      if ((G.chapter || 1) >= 3) bugs.push(walker(1, 7));
      bugs.forEach((b) => (b.ph = rand(0, 6)));
    };
    const eat = (w) => {
      pellets.delete(`${w.cx},${w.cy}`);
      const tk = tokens.find((k) => k.x === w.cx && k.y === w.cy && !k.gone);
      if (!tk || G.waiting) return;
      const [x, y] = toXY(tk.x, tk.y);
      tk.gone = true;
      const ok = G.isRight(tk.txt);
      G.burst(x, y, ok ? "#fde047" : "#ef4444", ok ? 24 : 10);
      G.answer(ok, x, y, { keep: true });
    };
    P.arrived = eat;
    const bugChoose = (b) => {
      if (!(b.nx === b.cx && b.ny === b.cy) && b.t > 0) return null;
      const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => open(b.cx + dx, b.cy + dy) && !(dx === -b.dx && dy === -b.dy));
      const list = opts.length ? opts : [[-b.dx, -b.dy]];
      if (Math.random() < 0.35) {
        // včasih proti Piku
        list.sort((a, c) => Math.hypot(b.cx + a[0] - P.cx, b.cy + a[1] - P.cy) - Math.hypot(b.cx + c[0] - P.cx, b.cy + c[1] - P.cy));
        return list[0];
      }
      return pickOne(list);
    };
    const setWant = (d) => {
      P.want = d;
      // obrat na mestu
      if (P.nx !== P.cx || P.ny !== P.cy) {
        if (d[0] === -P.dx && d[1] === -P.dy) {
          [P.cx, P.nx] = [P.nx, P.cx];
          [P.cy, P.ny] = [P.ny, P.cy];
          P.t = 1 - P.t;
          [P.dx, P.dy] = d;
        }
      }
    };
    return {
      resize() {
        cell = Math.floor(Math.min(G.W / 9, G.H / 11));
        ox = (G.W - cell * 9) / 2;
        oy = (G.H - cell * 11) / 2;
      },
      reset() {
        home();
        makeBugs();
        refill();
        tokens = [];
      },
      question() {
        refill();
        if (bugs.length < ((G.chapter || 1) >= 3 ? 2 : 1)) makeBugs();
        const spots = SPOTS.filter(([x, y]) => Math.abs(x - P.cx) + Math.abs(y - P.cy) > 2).slice(0, 6);
        const pick = spots.sort(() => Math.random() - 0.5).slice(0, G.opts.length);
        tokens = G.opts.map((txt, i) => ({ txt, x: pick[i][0], y: pick[i][1], color: NEON[i % NEON.length] }));
      },
      update(dt) {
        inv = Math.max(0, inv - dt);
        stepWalker(P, 3.4 * G.speed, dt, () => P.want);
        for (const b of bugs) {
          b.ph += dt * 8;
          stepWalker(b, 1.7 * G.speed, dt, bugChoose);
          const [bx, by] = wpos(b), [px, py] = wpos(P);
          if (!inv && Math.hypot(bx - px, by - py) < 0.6) {
            const [x, y] = toXY(px, py);
            G.burst(x, y, "#a855f7", 12);
            G.sound("bad");
            G.shake(5);
            home();
          }
        }
      },
      pointer(type, p) {
        if (type === "down") {
          start = p;
          const [px, py] = toXY(...wpos(P));
          setWant(swipeDir(p.x - px, p.y - py));
        } else if (type === "move" && start && Math.hypot(p.x - start.x, p.y - start.y) > 22) {
          setWant(swipeDir(p.x - start.x, p.y - start.y));
          start = p;
        } else if (type === "up") start = null;
      },
      key(k, down) {
        if (!down) return false;
        const d = DIRS[k];
        if (!d) return false;
        setWant(d);
        sel = -1;
        return true;
      },
      draw(g) {
        const [bg, wall] = chap(G, [["#05061a", "#3b82f6"], ["#12051a", "#ec4899"], ["#0d0520", "#a855f7"], ["#141005", "#f59e0b"]]);
        g.fillStyle = bg;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // stene: neonski robovi ob poteh
        g.lineCap = "round";
        MAZE.forEach((row, y) =>
          [...row].forEach((c, x) => {
            if (c !== "#") return;
            const X = ox + x * cell, Y = oy + y * cell;
            g.fillStyle = "rgba(255,255,255,0.04)";
            g.fillRect(X, Y, cell, cell);
            g.strokeStyle = wall;
            g.lineWidth = Math.max(2, cell / 10);
            g.beginPath();
            if (open(x, y - 1)) (g.moveTo(X + 2, Y + 3), g.lineTo(X + cell - 2, Y + 3));
            if (open(x, y + 1)) (g.moveTo(X + 2, Y + cell - 3), g.lineTo(X + cell - 2, Y + cell - 3));
            if (open(x - 1, y)) (g.moveTo(X + 3, Y + 2), g.lineTo(X + 3, Y + cell - 2));
            if (open(x + 1, y)) (g.moveTo(X + cell - 3, Y + 2), g.lineTo(X + cell - 3, Y + cell - 2));
            g.stroke();
          }),
        );
        g.fillStyle = "#fde68a";
        for (const key of pellets) {
          const [x, y] = key.split(",").map(Number);
          const [X, Y] = toXY(x, y);
          const s = Math.max(3, cell / 9);
          g.fillRect(X - s / 2, Y - s / 2, s, s);
        }
        const pulse = G.reduced ? 1 : 1 + Math.sin(G.time * 5) * 0.04;
        for (const tk of tokens) {
          if (tk.gone) continue;
          const [X, Y] = toXY(tk.x, tk.y);
          g.save();
          g.translate(X, Y);
          g.scale(pulse, pulse);
          pill(G, g, tk.txt, 0, 0, cell * 2.6, cell * 0.78, tk.color, { size: Math.min(20, cell * 0.42) });
          g.restore();
        }
        // hrošči
        for (const b of bugs) {
          const [X, Y] = toXY(...wpos(b));
          const r = cell * 0.32;
          g.strokeStyle = "#e9d5ff";
          g.lineWidth = 2;
          for (let i = -1; i <= 1; i++) {
            const l = Math.sin(b.ph + i) * 3;
            g.beginPath();
            g.moveTo(X - r * 1.3, Y + i * r * 0.6 + l);
            g.lineTo(X + r * 1.3, Y + i * r * 0.6 - l);
            g.stroke();
          }
          g.fillStyle = "#9333ea";
          g.beginPath();
          g.ellipse(X, Y, r, r * 1.1, 0, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = 2;
          g.strokeStyle = INK;
          g.stroke();
          g.fillStyle = "#fff";
          g.fillRect(X - r * 0.55, Y - r * 0.5, r * 0.4, r * 0.4);
          g.fillRect(X + r * 0.15, Y - r * 0.5, r * 0.4, r * 0.4);
        }
        // Piko: zelen kvadratast lik z očmi v smeri hoje
        const [X, Y] = toXY(...wpos(P));
        if (!(inv && Math.floor(G.time * 10) % 2)) {
          const r = cell * 0.36;
          G.rr(X - r, Y - r, r * 2, r * 2, r * 0.6);
          g.fillStyle = "#4ade80";
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          const ex = P.dx * r * 0.25, ey = P.dy * r * 0.25;
          g.fillStyle = "#fff";
          g.fillRect(X - r * 0.6 + ex, Y - r * 0.5 + ey, r * 0.5, r * 0.5);
          g.fillRect(X + r * 0.1 + ex, Y - r * 0.5 + ey, r * 0.5, r * 0.5);
          g.fillStyle = INK;
          g.fillRect(X - r * 0.45 + ex * 1.4, Y - r * 0.35 + ey * 1.4, r * 0.22, r * 0.22);
          g.fillRect(X + r * 0.25 + ex * 1.4, Y - r * 0.35 + ey * 1.4, r * 0.22, r * 0.22);
          const m = G.reduced ? 0.2 : 0.12 + Math.abs(Math.sin(G.time * 12)) * 0.18;
          g.fillRect(X - r * 0.4, Y + r * 0.25, r * 0.8, r * m * 2);
        }
        scanlines(g, G);
      },
    };
  },
};

// ============ GRAD: Arin skoči na polico s pravilnim odgovorom; napačna polica se podre ============
export const castle = {
  id: "castle",
  story: {
    sl: [["Ječa pod gradom", "Arin se mora rešiti iz ječe pod starim gradom."], ["Palačni hodniki", "Hodniki palače so polni pasti."], ["Nočni stolp", "Arin pleza po stolpu pod zvezdami."], ["Na strehah", "S streh se že vidi svoboda!"]],
    en: [["The dungeon", "Arin must escape the dungeon under the old castle."], ["Palace halls", "The palace halls are full of traps."], ["The night tower", "Arin climbs the tower under the stars."], ["On the rooftops", "Freedom is in sight from the rooftops!"]],
  },
  icon: "castle",
  colors: ["#1c1917", "#78350f"],
  options: 3,
  timer: 22,
  create(G) {
    let ledges = [], st = "idle", t = 0, target = null, hero = { x: 0, y: 0 }, from = { x: 0, y: 0 }, sel = 0, slide = 0;
    const floorY = () => G.H * 0.72;
    const startX = () => G.W * 0.14;
    const s = () => clamp(G.H / 150, 2.2, 5); // velikost »piksla« lika
    const layout = () => {
      const lx = G.W * 0.66, lw = Math.min(G.W * 0.4, 260);
      const ys = [G.H * 0.32, G.H * 0.52, G.H * 0.72];
      ledges.forEach((l, i) => Object.assign(l, { x: lx, w: lw, y: ys[i] }));
    };
    const place = () => {
      hero = { x: startX(), y: floorY() };
      st = "idle";
    };
    const pick = (l) => {
      if (st !== "idle" || G.waiting || !l || l.gone) return;
      target = l;
      from = { ...hero };
      st = "run";
      t = 0;
    };
    return {
      resize() {
        layout();
        if (st === "idle") place();
      },
      reset() {
        ledges = [];
        place();
      },
      question() {
        ledges = G.opts.map((txt) => ({ txt, gone: false, fall: 0 }));
        layout();
        slide = st === "won" ? 1 : 0;
        place();
        sel = 0;
      },
      timeout() {
        st = "idle";
      },
      update(dt) {
        slide = Math.max(0, slide - dt * 2.2);
        for (const l of ledges) if (l.gone) l.fall += dt * 600;
        if (st === "run") {
          t += dt / 0.28;
          hero.x = from.x + (G.W * 0.06) * Math.min(1, t);
          if (t >= 1) (st = "jump"), (t = 0), (from = { ...hero });
        } else if (st === "jump") {
          t += dt / 0.75;
          const k = Math.min(1, t), tx = target.x - target.w * 0.25, ty = target.y;
          hero.x = from.x + (tx - from.x) * k;
          hero.y = from.y + (ty - from.y) * k - Math.sin(k * Math.PI) * G.H * 0.18;
          if (t >= 1) {
            const ok = G.isRight(target.txt);
            if (ok) {
              st = "won";
              G.answer(true, hero.x, hero.y - 30, { delay: 0.7 });
            } else {
              target.gone = true;
              st = "fall";
              t = 0;
              G.sound("bad");
            }
          }
        } else if (st === "fall") {
          t += dt;
          hero.y += dt * G.H * 1.4;
          if (t > 0.6) {
            G.answer(false, target.x, target.y, { keep: true });
            place();
          }
        }
      },
      pointer(type, p) {
        if (type !== "down") return;
        const hit = ledges.find((l) => !l.gone && p.x > l.x - l.w / 2 - 10 && p.x < l.x + l.w / 2 + 10 && p.y > l.y - G.H * 0.12 && p.y < l.y + 24);
        pick(hit);
      },
      key(k, down) {
        if (!down) return false;
        const live = ledges.filter((l) => !l.gone);
        const n = numKey(k);
        if (n >= 0) return pick(live[n]), true;
        if (k === "ArrowUp" || k === "ArrowDown") {
          sel = (sel + (k === "ArrowUp" ? -1 : 1) + live.length) % live.length;
          ledges.forEach((l) => (l.focus = l === live[sel]));
          return true;
        }
        if (k === " " || k === "Enter") return pick(live.find((l) => l.focus) || live[0]), true;
        return false;
      },
      draw(g) {
        const [wall, mortar, pit, slab] = chap(G, [["#44403c", "#292524", "#0c0a09", "#a8a29e"], ["#b45309", "#78350f", "#1c1006", "#fcd34d"], ["#312e81", "#1e1b4b", "#020617", "#a5b4fc"], ["#9a3412", "#431407", "#1c0a05", "#fdba74"]]);
        g.fillStyle = wall;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // opeke
        const bw = 48, bh = 22;
        g.fillStyle = mortar;
        for (let y = 0; y < G.H; y += bh) {
          g.fillRect(0, y, G.W, 2);
          for (let x = (y / bh) % 2 ? 0 : bw / 2; x < G.W; x += bw) g.fillRect(x, y, 2, bh);
        }
        // okno z lokom in bakla
        const wx = G.W * 0.38, wy = G.H * 0.12, ww = Math.min(70, G.W * 0.1);
        g.fillStyle = (G.chapter || 1) === 3 ? "#0f172a" : (G.chapter || 1) === 2 ? "#7dd3fc" : (G.chapter || 1) === 4 ? "#fb923c" : "#1c1917";
        g.beginPath();
        g.moveTo(wx - ww / 2, wy + ww * 1.4);
        g.lineTo(wx - ww / 2, wy + ww / 2);
        g.arc(wx, wy + ww / 2, ww / 2, Math.PI, 0);
        g.lineTo(wx + ww / 2, wy + ww * 1.4);
        g.closePath();
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        const tx = G.W * 0.06, ty = G.H * 0.3, fl = G.reduced ? 0 : Math.sin(G.time * 17) * 2;
        g.fillStyle = "#57534e";
        g.fillRect(tx - 3, ty, 6, 22);
        g.fillStyle = "#f97316";
        g.beginPath();
        g.ellipse(tx, ty - 6, 7 + fl / 2, 12 + fl, 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#fde047";
        g.beginPath();
        g.ellipse(tx, ty - 3, 3.5, 6, 0, 0, Math.PI * 2);
        g.fill();
        // jama s koli
        g.fillStyle = pit;
        g.fillRect(G.W * 0.28, floorY() + 4, G.W, G.H);
        g.fillStyle = "#a8a29e";
        for (let x = G.W * 0.3; x < G.W; x += 18) {
          g.beginPath();
          g.moveTo(x, G.H);
          g.lineTo(x + 7, G.H - 18);
          g.lineTo(x + 14, G.H);
          g.fill();
        }
        // začetna polica
        const off = slide * G.W * 0.5;
        g.fillStyle = slab;
        g.fillRect(-10, floorY(), G.W * 0.28 + 10, G.H);
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(-10, floorY() + 10, G.W * 0.28 + 10, 4);
        g.beginPath();
        g.rect(-10, floorY(), G.W * 0.28 + 10, G.H);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // police z odgovori
        for (const l of ledges) {
          const y = l.y + l.fall;
          const x = l.x + off;
          g.globalAlpha = l.gone ? Math.max(0, 1 - l.fall / 400) : 1;
          g.fillStyle = slab;
          g.fillRect(x - l.w / 2, y, l.w, 18);
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.strokeRect(x - l.w / 2, y, l.w, 18);
          g.fillStyle = "rgba(0,0,0,0.22)";
          for (let i = 1; i < 4; i++) g.fillRect(x - l.w / 2 + (l.w / 4) * i, y + 2, 2, 14);
          // napis na pergamentu
          pill(G, g, l.txt, x + l.w * 0.1, y - G.H * 0.055, l.w * 0.78, Math.min(40, G.H * 0.07), "#fef3c7", { focus: l.focus, size: Math.min(20, G.H * 0.04) });
          g.globalAlpha = 1;
        }
        // Arin: piksljasti junak (modra tunika, rdeč šal)
        const k = s(), X = hero.x, Y = hero.y;
        const run = st === "run" || st === "jump" ? Math.sin(G.time * 18) : 0;
        const px = (x, y, w, h, c) => {
          g.fillStyle = c;
          g.fillRect(X + x * k, Y + y * k, w * k, h * k);
        };
        px(-3, -24, 6, 6, "#f5d0a9"); // glava
        px(-4, -26, 8, 3, "#f8fafc"); // pokrivalo
        px(1, -22, 1, 1, INK);
        px(-4, -18, 8, 9, "#2563eb"); // tunika
        px(-4, -14, 8, 2, "#dc2626"); // šal
        px(-6 + run, -17, 2, 7, "#f5d0a9");
        px(4 - run, -17, 2, 7, "#f5d0a9");
        px(-3, -9, 2, 9 - Math.abs(run) * 2, "#78350f");
        px(1, -9, 2, 9 - Math.abs(run * 2) % 3, "#78350f");
        g.strokeStyle = INK;
        g.lineWidth = 2;
        g.strokeRect(X - 4 * k, Y - 26 * k, 8 * k, 26 * k);
      },
    };
  },
};

// ============ KAČA: vodi kačo do pravilnega odgovora (zid jo prenese na drugo stran) ============
export const snake = {
  id: "snake",
  story: {
    sl: [["Zelena dolina", "Kača Mira je lačna pravih odgovorov."], ["Jantarni zaslon", "Mira raste in raste."], ["Modra noč", "Ponoči se odgovori svetijo."], ["Kraljica kač", "Mira postaja kraljica kač!"]],
    en: [["Green valley", "Mira the snake is hungry for right answers."], ["Amber screen", "Mira keeps growing."], ["Blue night", "At night the answers glow."], ["Snake queen", "Mira is becoming the snake queen!"]],
  },
  icon: "spline",
  colors: ["#0f380f", "#306230"],
  options: 3,
  timer: 30,
  create(G) {
    let cols = 14, rows = 18, cell = 24, ox = 0, oy = 0, body = [], dir = [1, 0], want = [1, 0], acc = 0, grow = 0, food = [], start = null;
    const toXY = (x, y) => [ox + (x + 0.5) * cell, oy + (y + 0.5) * cell];
    const placeFood = () => {
      const head = body[0];
      food = [];
      for (const txt of G.opts) {
        const w = Math.min(cell * 7, G.tw(txt, Math.min(18, cell * 0.8), 900) + 18);
        const half = Math.max(0, Math.ceil(w / cell / 2 - 0.5));
        for (let i = 0; i < 80; i++) {
          const x = Math.floor(rand(half + 1, cols - half - 1)), y = Math.floor(rand(1, rows - 1));
          const far = Math.abs(x - head[0]) + Math.abs(y - head[1]) > 5;
          const free = food.every((f) => Math.abs(f.y - y) > 2 || Math.abs(f.x - x) > f.half + half + 2);
          if (far && free && !body.some(([bx, by]) => by === y && Math.abs(bx - x) <= half)) {
            food.push({ txt, x, y, half, w, color: NEON[food.length] });
            break;
          }
        }
      }
    };
    const turn = (d) => {
      if (d[0] === -dir[0] && d[1] === -dir[1]) return;
      want = d;
    };
    return {
      resize() {
        cell = Math.max(18, Math.floor(Math.min(G.W / 14, G.H / 16, 34)));
        cols = Math.floor(G.W / cell);
        rows = Math.floor(G.H / cell);
        ox = (G.W - cols * cell) / 2;
        oy = (G.H - rows * cell) / 2;
        body = body.map(([x, y]) => [clamp(x, 0, cols - 1), clamp(y, 0, rows - 1)]);
        if (G.q) placeFood();
      },
      reset() {
        const y = Math.floor(rows / 2), x = Math.floor(cols / 3);
        body = [[x, y], [x - 1, y], [x - 2, y]];
        dir = want = [1, 0];
        food = [];
        grow = 0;
      },
      question() {
        placeFood();
      },
      update(dt) {
        if (G.waiting && !G.q) return;
        acc += dt * 3.6 * G.speed;
        while (acc >= 1) {
          acc -= 1;
          dir = want;
          const h = body[0];
          const n = [(h[0] + dir[0] + cols) % cols, (h[1] + dir[1] + rows) % rows];
          body.unshift(n);
          if (grow > 0) grow--;
          else body.pop();
          const f = food.find((f) => !f.gone && f.y === n[1] && Math.abs(f.x - n[0]) <= f.half);
          if (f && !G.waiting) {
            f.gone = true;
            const ok = G.isRight(f.txt);
            const [x, y] = toXY(f.x, f.y);
            G.burst(x, y, ok ? f.color : "#ef4444", ok ? 20 : 10);
            if (ok) grow += 2;
            G.answer(ok, x, y, { keep: true });
          }
        }
      },
      pointer(type, p) {
        if (type === "down") {
          start = p;
          const [hx, hy] = toXY(...body[0]);
          turn(swipeDir(p.x - hx, p.y - hy));
        } else if (type === "move" && start && Math.hypot(p.x - start.x, p.y - start.y) > 22) {
          turn(swipeDir(p.x - start.x, p.y - start.y));
          start = p;
        } else if (type === "up") start = null;
      },
      key(k, down) {
        if (!down || !DIRS[k]) return false;
        turn(DIRS[k]);
        return true;
      },
      draw(g) {
        const [bg, grid, dark] = chap(G, [["#9bbc0f", "#8bac0f", "#0f380f"], ["#f4c430", "#e0b020", "#4a2c00"], ["#1e3a8a", "#1e40af", "#bfdbfe"], ["#fbcfe8", "#f9a8d4", "#500724"]]);
        g.fillStyle = dark;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = bg;
        g.fillRect(ox, oy, cols * cell, rows * cell);
        g.fillStyle = grid;
        for (let x = 0; x <= cols; x++) g.fillRect(ox + x * cell, oy, 1, rows * cell);
        for (let y = 0; y <= rows; y++) g.fillRect(ox, oy + y * cell, cols * cell, 1);
        for (const f of food) {
          if (f.gone) continue;
          const [x, y] = toXY(f.x, f.y);
          pill(G, g, f.txt, x, y, f.w, cell * 1.05, f.color, { size: Math.min(18, cell * 0.8) });
        }
        body.forEach(([x, y], i) => {
          g.fillStyle = dark;
          g.fillRect(ox + x * cell + 2, oy + y * cell + 2, cell - 4, cell - 4);
          if (i === 0) {
            g.fillStyle = bg;
            const e = cell / 6;
            const [cx, cy] = toXY(x, y);
            g.fillRect(cx - e * 1.6 + dir[0] * e, cy - e * 1.2 + dir[1] * e, e, e);
            g.fillRect(cx + e * 0.6 + dir[0] * e, cy - e * 1.2 + dir[1] * e, e, e);
          }
        });
        scanlines(g, G);
      },
    };
  },
};

// ============ ŽABJI SKOK: žaba skoči na lokvanj s pravilnim odgovorom ============
export const frog = {
  id: "frog",
  story: {
    sl: [["Ribnik", "Žabica Kvaki mora čez ribnik do mame."], ["Močvirje", "V močvirju plavajo lokvanji hitreje."], ["Nočna reka", "Pod luno se reka sveti."], ["Domov", "Mama že čaka na drugem bregu!"]],
    en: [["The pond", "Kvaki the frog must cross the pond to get home."], ["The swamp", "Lily pads drift faster in the swamp."], ["Night river", "The river shines under the moon."], ["Home", "Mum is waiting on the other bank!"]],
  },
  icon: "flower",
  colors: ["#064e3b", "#0f766e"],
  options: 3,
  timer: 22,
  create(G) {
    let pads = [], fr = { x: 0, y: 0 }, st = "idle", t = 0, from = null, target = null, sel = 0, dirv = 1;
    const bankY = () => G.H * 0.86, rowY = () => G.H * 0.5, topY = () => G.H * 0.14;
    const padW = (txt) => clamp(G.tw(txt, 19, 900) + 30, 80, G.W * 0.42);
    const home = () => {
      fr = { x: G.W / 2, y: bankY() };
      st = "idle";
    };
    const hop = (p) => {
      if (st !== "idle" || G.waiting || !p || p.gone) return;
      target = p;
      from = { ...fr };
      st = "hop";
      t = 0;
      G.sound("pop");
    };
    return {
      resize() {
        if (st === "idle") home();
      },
      reset() {
        pads = [];
        home();
      },
      question() {
        dirv = -dirv;
        const span = G.W + 160;
        pads = G.opts.map((txt, i) => ({ txt, x: (span / G.opts.length) * i + rand(0, 30) - 80, w: padW(txt), gone: false, sink: 0, color: NEON[i] }));
        home();
        sel = 0;
      },
      timeout() {
        st = "idle";
      },
      update(dt) {
        const v = (G.W / 12) * G.speed * dirv * ((G.chapter || 1) >= 2 ? 1.25 : 1);
        const span = G.W + 160;
        for (const p of pads) {
          p.x += v * dt;
          if (p.x > G.W + 80) p.x -= span;
          if (p.x < -80) p.x += span;
          if (p.gone) p.sink += dt;
        }
        if (st === "hop") {
          t += dt / 0.4;
          const k = Math.min(1, t);
          fr.x = from.x + (target.x - from.x) * k;
          fr.y = from.y + (rowY() - from.y) * k - Math.sin(k * Math.PI) * 50;
          if (t >= 1) {
            if (G.isRight(target.txt)) {
              st = "ride";
              t = 0;
            } else {
              target.gone = true;
              st = "splash";
              t = 0;
              G.burst(fr.x, fr.y, "#7dd3fc", 16);
              G.sound("bad");
            }
          }
        } else if (st === "ride") {
          fr.x = target.x;
          t += dt;
          if (t > 0.35) (st = "hop2"), (t = 0), (from = { ...fr });
        } else if (st === "hop2") {
          t += dt / 0.4;
          const k = Math.min(1, t);
          fr.y = from.y + (topY() - from.y) * k - Math.sin(k * Math.PI) * 40;
          if (t >= 1 && st === "hop2") {
            st = "won";
            G.answer(true, fr.x, fr.y, { delay: 0.5 });
          }
        } else if (st === "splash") {
          t += dt;
          if (t > 0.5) {
            G.answer(false, target.x, rowY(), { keep: true });
            home();
          }
        }
      },
      pointer(type, p) {
        if (type !== "down") return;
        const hit = pads.find((q) => !q.gone && Math.abs(p.x - q.x) < q.w / 2 + 10 && Math.abs(p.y - rowY()) < 46);
        hop(hit);
      },
      key(k, down) {
        if (!down) return false;
        const live = pads.filter((p) => !p.gone && p.x > 0 && p.x < G.W).sort((a, b) => a.x - b.x);
        const n = numKey(k);
        if (n >= 0) return hop(live[n]), true;
        if (k === "ArrowLeft" || k === "ArrowRight") {
          sel = (sel + (k === "ArrowLeft" ? -1 : 1) + live.length) % Math.max(1, live.length);
          pads.forEach((p) => (p.focus = p === live[sel]));
          return true;
        }
        if (k === " " || k === "Enter" || k === "ArrowUp") return hop(live.find((p) => p.focus) || live[0]), true;
        return false;
      },
      draw(g) {
        const [w0, w1, bank] = chap(G, [["#38bdf8", "#0284c7", "#4ade80"], ["#4d7c0f", "#365314", "#65a30d"], ["#1e3a8a", "#0c1445", "#166534"], ["#fb923c", "#0369a1", "#84cc16"]]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, w0);
        grd.addColorStop(1, w1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.strokeStyle = "rgba(255,255,255,0.25)";
        g.lineWidth = 2;
        for (let y = G.H * 0.25; y < G.H * 0.8; y += 26) {
          g.beginPath();
          for (let x = -20; x < G.W + 20; x += 20) g.lineTo(x, y + Math.sin(x / 30 + G.time * (G.reduced ? 0 : 2) + y) * 3);
          g.stroke();
        }
        if ((G.chapter || 1) === 3) {
          g.fillStyle = "#fef9c3";
          g.beginPath();
          g.arc(G.W * 0.85, G.H * 0.1, 18, 0, 7);
          g.fill();
        }
        for (const [y0, y1] of [[-20, topY() + 16], [bankY() - 14, G.H + 20]]) {
          g.fillStyle = bank;
          g.fillRect(-20, y0, G.W + 40, y1 - y0);
          g.beginPath();
          g.moveTo(-20, y0 === -20 ? y1 : y0);
          g.lineTo(G.W + 20, y0 === -20 ? y1 : y0);
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
        }
        for (const p of pads) {
          const y = rowY() + p.sink * 30;
          g.globalAlpha = p.gone ? Math.max(0, 1 - p.sink * 2) : 1;
          g.fillStyle = "#16a34a";
          g.beginPath();
          g.ellipse(p.x, y + 6, p.w / 2, 26, 0, 0.25, Math.PI * 2 - 0.05);
          g.lineTo(p.x, y + 6);
          g.closePath();
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          pill(G, g, p.txt, p.x, y, p.w - 16, 34, "#fefce8", { focus: p.focus, size: 19 });
          g.globalAlpha = 1;
        }
        // Kvaki
        const r = Math.min(22, G.H / 22);
        if (st !== "splash") {
          g.fillStyle = "#84cc16";
          g.beginPath();
          g.ellipse(fr.x, fr.y, r * 1.2, r, 0, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          for (const sx of [-1, 1]) {
            g.fillStyle = "#fff";
            g.beginPath();
            g.arc(fr.x + sx * r * 0.55, fr.y - r * 0.8, r * 0.38, 0, 7);
            g.fill();
            g.stroke();
            g.fillStyle = INK;
            g.beginPath();
            g.arc(fr.x + sx * r * 0.55, fr.y - r * 0.85, r * 0.16, 0, 7);
            g.fill();
          }
          g.beginPath();
          g.arc(fr.x, fr.y, r * 0.6, 0.2, Math.PI - 0.2);
          g.lineWidth = 2;
          g.stroke();
        }
      },
    };
  },
};

// ============ KRTI: udari krta, ki drži pravilni odgovor ============
export const moles = {
  id: "moles",
  story: {
    sl: [["Babičin vrt", "Krti rudarji so prekopali babičin vrt."], ["Kmetija", "Krti so se preselili na kmetijo."], ["Nočni vrt", "Krti z lučkami kopljejo tudi ponoči."], ["Zlato polje", "Zadnji krti na zlatem polju!"]],
    en: [["Grandma's garden", "Miner moles dug up grandma's garden."], ["The farm", "The moles moved to the farm."], ["Night garden", "With their lamps, the moles dig at night too."], ["Golden field", "The last moles in the golden field!"]],
  },
  icon: "target",
  colors: ["#365314", "#4d7c0f"],
  options: 4,
  timer: 20,
  create(G) {
    let holes = [], spawnT = 0, sinceRight = 0;
    const layout = () => {
      const cols = G.W > G.H * 1.3 ? 4 : 3, rows = cols === 4 ? 2 : 3;
      const n = cols * rows;
      const cw = G.W / cols, ch = (G.H * 0.88) / rows;
      holes = Array.from({ length: n }, (_, i) => holes[i] || { up: 0, txt: null, state: "down", life: 0, hit: 0 });
      holes.length = n;
      holes.forEach((h, i) => Object.assign(h, { x: cw * ((i % cols) + 0.5), y: G.H * 0.12 + ch * (Math.floor(i / cols) + 0.72), r: Math.min(cw, ch) * 0.34 }));
    };
    const pop = () => {
      const free = holes.filter((h) => h.state === "down" && h.up <= 0);
      if (!free.length) return;
      const h = pickOne(free);
      const right = sinceRight >= 2 || Math.random() < 0.34;
      h.txt = right ? G.q.a : pickOne(G.opts.filter((o) => !G.isRight(o)));
      sinceRight = right ? 0 : sinceRight + 1;
      h.state = "rise";
      h.life = 3.2 / G.speed;
      h.hit = 0;
    };
    const whack = (h) => {
      if (!h || G.waiting || (h.state !== "up" && h.state !== "rise")) return;
      const ok = G.isRight(h.txt);
      h.state = "fall";
      h.hit = ok ? 1 : -1;
      G.sound("pop");
      G.burst(h.x, h.y - h.r, ok ? "#fde047" : "#ef4444", ok ? 20 : 10);
      G.answer(ok, h.x, h.y - h.r * 1.5, { keep: true });
      if (ok) holes.forEach((o) => o !== h && o.state !== "down" && (o.state = "fall"));
    };
    return {
      resize: layout,
      reset() {
        holes.forEach((h) => Object.assign(h, { up: 0, state: "down" }));
      },
      question() {
        holes.forEach((h) => h.state !== "down" && (h.state = "fall"));
        spawnT = 0.5;
        sinceRight = 1;
      },
      update(dt) {
        if (!G.waiting && G.q) {
          spawnT -= dt;
          if (spawnT <= 0) {
            pop();
            spawnT = 1.1 / G.speed;
          }
        }
        for (const h of holes) {
          if (h.state === "rise") {
            h.up = Math.min(1, h.up + dt * 4);
            if (h.up >= 1) h.state = "up";
          } else if (h.state === "up") {
            h.life -= dt;
            if (h.life <= 0) h.state = "fall";
          } else if (h.state === "fall") {
            h.up = Math.max(0, h.up - dt * 4);
            if (h.up <= 0) h.state = "down";
          }
        }
      },
      pointer(type, p) {
        if (type !== "down") return;
        const hit = holes.find((h) => h.up > 0.3 && Math.abs(p.x - h.x) < h.r * 1.5 && p.y > h.y - h.r * 3.2 && p.y < h.y + h.r * 0.6);
        whack(hit);
      },
      key(k, down) {
        if (!down) return false;
        const n = numKey(k);
        if (n < 0 || !holes[n]) return false;
        whack(holes[n]);
        return true;
      },
      draw(g) {
        const [sky, grass, dirt] = chap(G, [["#bae6fd", "#65a30d", "#78350f"], ["#fde68a", "#84cc16", "#92400e"], ["#1e1b4b", "#166534", "#451a03"], ["#fed7aa", "#ca8a04", "#713f12"]]);
        g.fillStyle = sky;
        g.fillRect(-20, -20, G.W + 40, G.H * 0.14 + 20);
        g.fillStyle = grass;
        g.fillRect(-20, G.H * 0.12, G.W + 40, G.H);
        g.fillStyle = "rgba(0,0,0,0.08)";
        for (let x = 0; x < G.W; x += 24) g.fillRect(x, G.H * 0.12, 12, G.H);
        g.beginPath();
        g.moveTo(-20, G.H * 0.12);
        g.lineTo(G.W + 20, G.H * 0.12);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        holes.forEach((h, i) => {
          const { x, y, r } = h;
          // luknja
          g.fillStyle = dirt;
          g.beginPath();
          g.ellipse(x, y, r * 1.3, r * 0.45, 0, 0, Math.PI * 2);
          g.fill();
          g.fillStyle = "#1c1917";
          g.beginPath();
          g.ellipse(x, y, r * 1.05, r * 0.32, 0, 0, Math.PI * 2);
          g.fill();
          if (h.up > 0) {
            g.save();
            g.beginPath();
            g.rect(x - r * 2, y - r * 5, r * 4, r * 5);
            g.clip();
            const top = y - h.up * r * 1.6;
            // krt z rudarsko čelado
            g.fillStyle = "#a16207";
            g.beginPath();
            g.ellipse(x, top + r * 0.4, r * 0.75, r * 0.8, 0, 0, Math.PI * 2);
            g.fill();
            g.lineWidth = 3;
            g.strokeStyle = INK;
            g.stroke();
            g.fillStyle = "#facc15";
            g.beginPath();
            g.arc(x, top + r * 0.05, r * 0.62, Math.PI, 0);
            g.fill();
            g.stroke();
            g.fillStyle = "#fef08a";
            g.beginPath();
            g.arc(x, top - r * 0.2, r * 0.13, 0, 7);
            g.fill();
            g.fillStyle = h.hit ? "#fff" : INK;
            g.fillRect(x - r * 0.35, top + r * 0.25, r * 0.16, r * 0.16);
            g.fillRect(x + r * 0.2, top + r * 0.25, r * 0.16, r * 0.16);
            g.fillStyle = "#fda4af";
            g.beginPath();
            g.arc(x, top + r * 0.6, r * 0.14, 0, 7);
            g.fill();
            g.restore();
            if (h.txt && h.up > 0.5) pill(G, g, h.txt, x, top - r * 0.9, Math.min(G.W / 3.2, r * 3.4), Math.min(36, r * 0.7), "#fefce8", { size: Math.min(19, r * 0.42) });
          }
          if (G.W > 500) G.fit(String(i + 1), x + r * 1.15, y + r * 0.35, 20, 12, { color: "rgba(255,255,255,0.7)", weight: 900 });
        });
      },
    };
  },
};

// ============ HELIKOPTER: preleti odprtino s pravilnim odgovorom ============
export const heli = {
  id: "heli",
  story: {
    sl: [["Prvi let", "Pilotka Tina dostavlja pošto v gorske vasi."], ["Skozi kanjon", "Pot vodi skozi ozek kanjon."], ["Nevihta", "Veter piha, a Tina leti varno."], ["Zadnja pošiljka", "Še zadnje pismo in naloga je opravljena!"]],
    en: [["First flight", "Pilot Tina delivers mail to mountain villages."], ["Through the canyon", "The route goes through a narrow canyon."], ["The storm", "The wind blows, but Tina flies safely."], ["Last delivery", "One more letter and the job is done!"]],
  },
  icon: "send",
  colors: ["#0c4a6e", "#0369a1"],
  options: 3,
  create(G) {
    let walls = [], hy = 0, ty = 0, rot = 0, hills = [];
    const hx = () => G.W * 0.2;
    const gaps = () => [G.H * 0.2, G.H * 0.5, G.H * 0.8];
    const gapH = () => G.H * 0.2;
    const spawn = () => {
      walls.push({ x: G.W + 40, w: Math.max(46, G.W * 0.07), opts: shuffleCopy(G.opts), done: false });
    };
    const lane = (k) => {
      ty = gaps()[k];
    };
    return {
      resize() {
        hills = Array.from({ length: 8 }, (_, i) => ({ x: (i / 8) * (G.W + 200), h: rand(0.08, 0.2) * G.H }));
        hy = hy || G.H / 2;
        ty = ty || G.H / 2;
      },
      reset() {
        walls = [];
        hy = ty = G.H / 2;
      },
      question() {
        spawn();
      },
      update(dt) {
        hy += (ty - hy) * Math.min(1, dt * 5);
        rot += dt * 30;
        for (const h of hills) {
          h.x -= (G.W / 14) * G.speed * dt;
          if (h.x < -200) h.x += G.W + 400;
        }
        for (const wall of walls) {
          wall.x -= (G.W / 6.5) * G.speed * dt;
          if (!wall.done && wall.x - wall.w / 2 < hx() + 14) {
            wall.done = true;
            const k = gaps().findIndex((y) => Math.abs(hy - y) < gapH() / 2);
            const ok = k >= 0 && G.isRight(wall.opts[k]);
            if (k < 0) G.burst(hx(), hy, "#ef4444", 10);
            G.answer(ok, hx() + 30, hy, { keep: true });
            // ista naloga še enkrat (z drugim vrstnim redom), če ni bila rešena
            if (!ok && G.q && !G.over) spawn();
          }
        }
        walls = walls.filter((w) => w.x > -w.w);
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed)) ty = clamp(p.y, G.H * 0.08, G.H * 0.92);
      },
      key(k, down) {
        if (!down) return false;
        const n = numKey(k);
        if (n >= 0 && n < 3) return lane(n), true;
        if (k === "ArrowUp" || k === "ArrowDown") {
          const i = gaps().reduce((b, y, j, a) => (Math.abs(y - ty) < Math.abs(a[b] - ty) ? j : b), 0);
          lane(clamp(i + (k === "ArrowUp" ? -1 : 1), 0, 2));
          return true;
        }
        return false;
      },
      draw(g) {
        const [s0, s1, hill] = chap(G, [["#7dd3fc", "#e0f2fe", "#16a34a"], ["#fdba74", "#fef3c7", "#a16207"], ["#475569", "#94a3b8", "#334155"], ["#c4b5fd", "#fce7f3", "#7c3aed"]]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, s0);
        grd.addColorStop(1, s1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        for (const h of hills) {
          g.fillStyle = hill;
          g.beginPath();
          g.moveTo(h.x - 160, G.H);
          g.quadraticCurveTo(h.x, G.H - h.h * 2, h.x + 160, G.H);
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
        }
        for (const wall of walls) {
          const gh = gapH();
          let y0 = 0;
          for (const [i, y] of gaps().entries()) {
            g.fillStyle = "#78716c";
            g.fillRect(wall.x - wall.w / 2, y0, wall.w, y - gh / 2 - y0);
            g.lineWidth = 3;
            g.strokeStyle = INK;
            g.strokeRect(wall.x - wall.w / 2, y0, wall.w, y - gh / 2 - y0);
            y0 = y + gh / 2;
            pill(G, g, wall.opts[i], wall.x, y, Math.min(G.W * 0.34, 200), Math.min(40, gh * 0.55), NEON[i], { size: Math.min(20, gh * 0.3) });
          }
          g.fillStyle = "#78716c";
          g.fillRect(wall.x - wall.w / 2, y0, wall.w, G.H - y0);
          g.strokeRect(wall.x - wall.w / 2, y0, wall.w, G.H - y0);
        }
        // helikopter
        const x = hx(), y = hy, k = clamp(G.H / 26, 14, 26);
        g.save();
        g.translate(x, y);
        g.rotate(clamp((ty - hy) / G.H, -0.25, 0.25));
        g.fillStyle = "#ef4444";
        g.beginPath();
        g.ellipse(0, 0, k * 1.3, k * 0.8, 0, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.fillStyle = "#bae6fd";
        g.beginPath();
        g.ellipse(k * 0.55, -k * 0.15, k * 0.5, k * 0.4, 0, 0, Math.PI * 2);
        g.fill();
        g.stroke();
        g.fillStyle = "#ef4444";
        g.fillRect(-k * 2.6, -k * 0.2, k * 1.5, k * 0.35);
        g.strokeRect(-k * 2.6, -k * 0.2, k * 1.5, k * 0.35);
        g.fillStyle = INK;
        g.fillRect(-k * 0.1, -k * 1.2, k * 0.2, k * 0.45);
        const bl = G.reduced ? 1 : Math.abs(Math.cos(rot));
        g.fillRect(-k * 1.8 * bl, -k * 1.25, k * 3.6 * bl, k * 0.14);
        g.fillRect(-k * 1.2, k * 0.85, k * 2.2, k * 0.12);
        g.restore();
      },
    };
  },
};

// ============ OPEKE: z loparjem usmeri žogico v opeko s pravilnim odgovorom ============
export const bricks = {
  id: "bricks",
  story: {
    sl: [["Opečni zid", "Robotka Bip podira zid iz številk."], ["Barvni zid", "Opeke so zdaj vseh barv."], ["Zvezdni zid", "Bip igra med zvezdami."], ["Zlati zid", "Zadnji zid je iz zlata!"]],
    en: [["The brick wall", "Bip the robot knocks down a wall of numbers."], ["Colour wall", "Now the bricks come in every colour."], ["Star wall", "Bip plays among the stars."], ["Golden wall", "The last wall is made of gold!"]],
  },
  icon: "layers",
  colors: ["#1e1b4b", "#be185d"],
  options: 4,
  timer: 35,
  create(G) {
    let bx = 0, by = 0, vx = 0, vy = 0, px = 0, held = true, list = [], keyDir = 0;
    const pw = () => clamp(G.W * 0.22, 90, 170), py = () => G.H - 34, br = () => clamp(G.W / 70, 7, 11);
    const v0 = () => (G.H / 2.6) * G.speed;
    const serve = () => {
      held = true;
      bx = px;
      by = py() - br() - 8;
    };
    const launch = () => {
      if (!held) return;
      held = false;
      const a = rand(-0.5, 0.5);
      vx = Math.sin(a) * v0();
      vy = -Math.cos(a) * v0();
    };
    const layout = () => {
      const n = list.length || 4, gap = 8, w = Math.min(200, (G.W - gap * (n + 1)) / n), h = clamp(G.H * 0.07, 34, 50);
      const x0 = (G.W - (w * n + gap * (n - 1))) / 2;
      list.forEach((b, i) => Object.assign(b, { x: x0 + i * (w + gap), y: G.H * 0.14, w, h }));
    };
    return {
      resize() {
        px = px || G.W / 2;
        layout();
        if (held) serve();
      },
      reset() {
        px = G.W / 2;
        list = [];
        serve();
      },
      question() {
        list = G.opts.map((txt, i) => ({ txt, gone: false, color: NEON[(i + (G.chapter || 1)) % NEON.length] }));
        layout();
        serve();
      },
      timeout() {
        serve();
      },
      update(dt) {
        if (keyDir) px = clamp(px + keyDir * G.W * 0.9 * dt, pw() / 2, G.W - pw() / 2);
        if (held) {
          bx = px;
          by = py() - br() - 8;
          return;
        }
        const r = br();
        bx += vx * dt;
        by += vy * dt;
        if (bx < r) (bx = r), (vx = Math.abs(vx));
        if (bx > G.W - r) (bx = G.W - r), (vx = -Math.abs(vx));
        if (by < r) (by = r), (vy = Math.abs(vy));
        // lopar: kot odboja je odvisen od mesta zadetka
        if (vy > 0 && by + r > py() - 6 && by < py() + 10 && Math.abs(bx - px) < pw() / 2 + r) {
          const off = clamp((bx - px) / (pw() / 2), -1, 1);
          const sp = Math.hypot(vx, vy);
          vx = Math.sin(off * 1.05) * sp;
          vy = -Math.cos(off * 1.05) * sp;
          G.sound("pop");
        }
        if (by > G.H + 30) serve(); // žogica pade: brez kazni, samo nov začetek
        for (const b of list) {
          if (b.gone || G.waiting) continue;
          if (bx + r > b.x && bx - r < b.x + b.w && by + r > b.y && by - r < b.y + b.h) {
            b.gone = true;
            const fromSide = Math.min(Math.abs(bx - b.x), Math.abs(bx - b.x - b.w)) < r;
            if (fromSide) vx = -vx;
            else vy = -vy;
            const ok = G.isRight(b.txt);
            G.burst(b.x + b.w / 2, b.y + b.h / 2, ok ? b.color : "#ef4444", ok ? 24 : 10);
            G.answer(ok, b.x + b.w / 2, b.y + b.h, { keep: true });
            if (ok) serve();
            break;
          }
        }
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed) || type === "move") px = clamp(p.x, pw() / 2, G.W - pw() / 2);
        if (type === "up") launch();
      },
      key(k, down) {
        if (k === "ArrowLeft" || k === "a" || k === "A") return (keyDir = down ? -1 : keyDir === -1 ? 0 : keyDir), true;
        if (k === "ArrowRight" || k === "d" || k === "D") return (keyDir = down ? 1 : keyDir === 1 ? 0 : keyDir), true;
        if (down && (k === " " || k === "Enter" || k === "ArrowUp")) return launch(), true;
        return false;
      },
      draw(g) {
        const [bg, grid] = chap(G, [["#0f172a", "#1e293b"], ["#1e1b4b", "#312e81"], ["#020617", "#0f172a"], ["#291505", "#422006"]]);
        g.fillStyle = bg;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = grid;
        for (let x = 0; x < G.W; x += 32) g.fillRect(x, 0, 1, G.H);
        for (let y = 0; y < G.H; y += 32) g.fillRect(0, y, G.W, 1);
        for (const b of list) {
          if (b.gone) continue;
          g.fillStyle = b.color;
          g.fillRect(b.x, b.y, b.w, b.h);
          g.fillStyle = "rgba(255,255,255,0.35)";
          g.fillRect(b.x, b.y, b.w, 5);
          g.fillStyle = "rgba(0,0,0,0.25)";
          g.fillRect(b.x, b.y + b.h - 5, b.w, 5);
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.strokeRect(b.x, b.y, b.w, b.h);
          G.fit(b.txt, b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 10, Math.min(20, b.h * 0.5), { color: INK, weight: 900 });
        }
        // lopar
        G.rr(px - pw() / 2, py(), pw(), 14, 7);
        g.fillStyle = "#e2e8f0";
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = "#38bdf8";
        g.stroke();
        // žogica
        g.fillStyle = "#fde047";
        g.beginPath();
        g.arc(bx, by, br(), 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 2;
        g.strokeStyle = INK;
        g.stroke();
        scanlines(g, G);
      },
    };
  },
};

export const ARCADE = [maze, castle, snake, frog, moles, heli, bricks];
