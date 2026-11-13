// Igre z nagibanjem in stresanjem telefona: kroglica na leseni plošči, skakač in čarobna krogla.
// Vse imajo enakovredno rezervo za dotik, miško in tipke (G.tilt.on je false na računalniku).
// Izvirni liki in pravila; navdih je le žanr. Vmesnik je isti kot v engines.js.

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
const shuffle = (a) => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const LEFT = new Set(["ArrowLeft", "a", "A"]);
const RIGHT = new Set(["ArrowRight", "d", "D"]);
const UP = new Set(["ArrowUp", "w", "W"]);
const DOWN = new Set(["ArrowDown", "s", "S"]);
const numKey = (k) => (/^[1-9]$/.test(k) ? Number(k) - 1 : -1);

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
// Nagib z mrtvo cono, da se pri mirni roki nič ne premika.
const dead = (v, d = 0.08) => (Math.abs(v) < d ? 0 : (v - Math.sign(v) * d) / (1 - d));

// ============ KROGLICA: nagni leseno ploščo, da kroglica pade v luknjo s pravilnim odgovorom ============
const SPOTS = [[0.15, 0.13], [0.85, 0.13], [0.15, 0.87], [0.85, 0.87], [0.5, 0.1], [0.5, 0.9]];
const BARS = [[0.27, 0.3, 0.5, 0.3], [0.5, 0.7, 0.73, 0.7], [0.27, 0.52, 0.27, 0.7], [0.73, 0.3, 0.73, 0.48]];

export const marble = {
  id: "marble",
  sensors: true,
  story: {
    sl: [["Dedkova delavnica", "Kroglica Tinka se kotali po dedkovi leseni igri."], ["Češnjev les", "Nova plošča diši po češnjevem lesu."], ["Večer v delavnici", "Pod svetilko Tinka išče prave luknje."], ["Mojstrska plošča", "Na mojstrski plošči Tinka pokaže, kaj zna!"]],
    en: [["Grandpa's workshop", "Tinka the marble rolls across grandpa's wooden game."], ["Cherry wood", "The new board smells of cherry wood."], ["Evening in the workshop", "Under the lamp, Tinka looks for the right holes."], ["The master board", "On the master board, Tinka shows what she can do!"]],
  },
  icon: "circle",
  colors: ["#78350f", "#b45309"],
  options: 4,
  timer: 30,
  create(G) {
    let bx = 0, by = 0, bw = 300, bh = 300, br = 12, hr = 18;
    let holes = [], ball = { x: 0, y: 0, vx: 0, vy: 0, s: 1 }, st = "wait", t = 0, hole = null, touch = null, keys = { x: 0, y: 0 }, held = new Set();
    const P = (nx, ny) => [bx + nx * bw, by + ny * bh];
    const start = () => P(0.5, 0.5);
    const layout = () => {
      const m = clamp(Math.min(G.W, G.H) * 0.03, 8, 22);
      bw = Math.min(G.W - 2 * m, (G.H - 2 * m) * 1.6);
      bh = G.H - 2 * m;
      bx = (G.W - bw) / 2;
      by = m;
      br = clamp(Math.min(bw, bh) * 0.035, 9, 18);
      hr = br * 1.65;
    };
    const spawn = () => {
      [ball.x, ball.y] = start();
      ball.vx = ball.vy = 0;
      ball.s = 0;
      st = "spawn";
      t = 0;
    };
    const bars = () => BARS.map(([x1, y1, x2, y2]) => [...P(x1, y1), ...P(x2, y2)]);
    const barW = () => br * 0.8;
    const collideBar = ([x1, y1, x2, y2]) => {
      const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
      const u = clamp(((ball.x - x1) * dx + (ball.y - y1) * dy) / L, 0, 1);
      const cx = x1 + u * dx, cy = y1 + u * dy;
      const ex = ball.x - cx, ey = ball.y - cy, d = Math.hypot(ex, ey), min = br + barW() / 2;
      if (d >= min || d === 0) return;
      const nx = ex / d, ny = ey / d;
      ball.x = cx + nx * min;
      ball.y = cy + ny * min;
      const vn = ball.vx * nx + ball.vy * ny;
      if (vn < 0) {
        ball.vx -= 1.45 * vn * nx;
        ball.vy -= 1.45 * vn * ny;
      }
    };
    // Napis ob luknji: pod zgornjimi, nad spodnjimi luknjami, vedno znotraj plošče.
    const labelPos = (h) => {
      const ph = clamp(G.H * 0.055, 26, 36), maxW = Math.min(bw * 0.3, 200);
      const up = h.ny > 0.5 ? -1 : 1;
      const [x, y] = P(h.nx, h.ny);
      return { x: clamp(x, bx + maxW / 2 + 6, bx + bw - maxW / 2 - 6), y: y + up * (hr + ph / 2 + 6), ph, maxW };
    };
    return {
      resize() {
        layout();
        if (st === "wait") [ball.x, ball.y] = start();
        ball.x = clamp(ball.x, bx + br, bx + bw - br);
        ball.y = clamp(ball.y, by + br, by + bh - br);
      },
      reset() {
        holes = [];
        layout();
        [ball.x, ball.y] = start();
        ball.vx = ball.vy = 0;
        ball.s = 1;
        st = "wait";
        touch = null;
        held.clear();
        keys = { x: 0, y: 0 };
      },
      question() {
        const spots = shuffle(SPOTS).slice(0, G.opts.length);
        holes = G.opts.map((txt, i) => ({ txt, nx: spots[i][0], ny: spots[i][1], closed: false }));
        spawn();
      },
      timeout() {
        st = "wait";
      },
      shake() {
        // stresanje: nagib znova nastavi na »ravno« in vrne kroglico na start
        G.recenter?.();
        if (st === "roll" && G.q && !G.waiting) spawn();
      },
      update(dt) {
        if (st === "spawn") {
          t += dt;
          ball.s = Math.min(1, t / 0.3);
          if (t >= 0.3) st = "roll";
          return;
        }
        if (st === "drop") {
          t += dt;
          const [hx, hy] = P(hole.nx, hole.ny);
          ball.x += (hx - ball.x) * Math.min(1, dt * 12);
          ball.y += (hy - ball.y) * Math.min(1, dt * 12);
          ball.s = Math.max(0.35, 1 - t * 1.8);
          if (t >= 0.35) {
            if (G.isRight(hole.txt)) {
              st = "done";
              G.answer(true, hx, hy, { delay: 0.7 });
            } else {
              hole.closed = true;
              G.answer(false, hx, hy, { keep: true });
              spawn();
            }
          }
          return;
        }
        if (st !== "roll" || !G.q || G.waiting) return;
        // smer pospeška: nagib, prst ali tipke
        let ax = 0, ay = 0;
        const S = Math.min(bw, bh);
        if (touch) {
          const dx = touch.x - ball.x, dy = touch.y - ball.y, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / (S * 0.2));
          ax = (dx / d) * k;
          ay = (dy / d) * k;
        } else if (keys.x || keys.y) {
          ax = keys.x;
          ay = keys.y;
        } else if (G.tilt?.on) {
          ax = dead(G.tilt.x) * 1.4;
          ay = dead(G.tilt.y) * 1.4;
        }
        const m = Math.hypot(ax, ay);
        if (m > 1) (ax /= m), (ay /= m);
        const A = S * 1.1 * (0.75 + 0.25 * G.speed), vmax = S * 0.55 * (0.8 + 0.2 * G.speed);
        ball.vx += ax * A * dt;
        ball.vy += ay * A * dt;
        // prijazen vlek v bližnjo odprto luknjo
        for (const h of holes) {
          if (h.closed) continue;
          const [hx, hy] = P(h.nx, h.ny), dx = hx - ball.x, dy = hy - ball.y, d = Math.hypot(dx, dy);
          if (d < hr * 1.9 && d > 0.1) {
            ball.vx += (dx / d) * S * 0.9 * dt;
            ball.vy += (dy / d) * S * 0.9 * dt;
          }
        }
        const f = Math.exp(-dt * 1.1);
        ball.vx *= f;
        ball.vy *= f;
        const v = Math.hypot(ball.vx, ball.vy);
        if (v > vmax) (ball.vx *= vmax / v), (ball.vy *= vmax / v);
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        // okvir
        if (ball.x < bx + br) (ball.x = bx + br), (ball.vx = Math.abs(ball.vx) * 0.45);
        if (ball.x > bx + bw - br) (ball.x = bx + bw - br), (ball.vx = -Math.abs(ball.vx) * 0.45);
        if (ball.y < by + br) (ball.y = by + br), (ball.vy = Math.abs(ball.vy) * 0.45);
        if (ball.y > by + bh - br) (ball.y = by + bh - br), (ball.vy = -Math.abs(ball.vy) * 0.45);
        bars().forEach(collideBar);
        // luknja
        for (const h of holes) {
          if (h.closed) continue;
          const [hx, hy] = P(h.nx, h.ny);
          if (Math.hypot(hx - ball.x, hy - ball.y) < hr * 0.85) {
            hole = h;
            st = "drop";
            t = 0;
            touch = null;
            G.sound("pop");
            break;
          }
        }
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed && touch)) touch = { x: p.x, y: p.y };
        else if (type === "up") touch = null;
      },
      key(k, down) {
        const dir = LEFT.has(k) ? "l" : RIGHT.has(k) ? "r" : UP.has(k) ? "u" : DOWN.has(k) ? "d" : null;
        if (!dir) return false;
        if (down) held.add(dir);
        else held.delete(dir);
        keys = { x: (held.has("r") ? 1 : 0) - (held.has("l") ? 1 : 0), y: (held.has("d") ? 1 : 0) - (held.has("u") ? 1 : 0) };
        return true;
      },
      draw(g) {
        const [table, frame, wood, grain] = chap(G, [["#292524", "#78350f", "#d6a76c", "rgba(120,53,15,0.18)"], ["#1c1917", "#7f1d1d", "#c2410c", "rgba(69,10,10,0.22)"], ["#0c0a09", "#44403c", "#a16207", "rgba(28,25,23,0.25)"], ["#1e293b", "#a16207", "#fde68a", "rgba(161,98,7,0.2)"]]);
        g.fillStyle = table;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // okvir in plošča
        const fw = Math.max(6, br * 0.7);
        G.rr(bx - fw, by - fw, bw + 2 * fw, bh + 2 * fw, fw * 1.4);
        g.fillStyle = frame;
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.fillStyle = wood;
        g.fillRect(bx, by, bw, bh);
        g.strokeStyle = grain;
        g.lineWidth = 2;
        for (let y = by + 14; y < by + bh; y += 22) {
          g.beginPath();
          for (let x = bx; x <= bx + bw; x += 16) g.lineTo(x, y + Math.sin(x / 70 + y / 30) * 5);
          g.stroke();
        }
        g.strokeStyle = "rgba(0,0,0,0.35)";
        g.lineWidth = 3;
        g.strokeRect(bx, by, bw, bh);
        if ((G.chapter || 1) === 3) {
          const lamp = g.createRadialGradient(bx + bw / 2, by, 0, bx + bw / 2, by, Math.max(bw, bh));
          lamp.addColorStop(0, "rgba(253,224,71,0.18)");
          lamp.addColorStop(1, "rgba(0,0,0,0.35)");
          g.fillStyle = lamp;
          g.fillRect(bx, by, bw, bh);
        }
        // start
        const [sx, sy] = start();
        g.strokeStyle = "rgba(255,255,255,0.55)";
        g.lineWidth = 2;
        g.setLineDash([4, 5]);
        g.beginPath();
        g.arc(sx, sy, br * 1.5, 0, Math.PI * 2);
        g.stroke();
        g.setLineDash([]);
        // pregrade
        g.lineCap = "round";
        for (const [x1, y1, x2, y2] of bars()) {
          g.beginPath();
          g.moveTo(x1, y1);
          g.lineTo(x2, y2);
          g.strokeStyle = INK;
          g.lineWidth = barW() + 5;
          g.stroke();
          g.strokeStyle = frame;
          g.lineWidth = barW();
          g.stroke();
        }
        // luknje z napisi
        for (const h of holes) {
          const [x, y] = P(h.nx, h.ny);
          g.fillStyle = h.closed ? frame : "#0c0a09";
          g.beginPath();
          g.arc(x, y, hr, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = h.closed ? "#ef4444" : "#94a3b8";
          g.stroke();
          if (h.closed) {
            g.beginPath();
            g.moveTo(x - hr * 0.5, y - hr * 0.5);
            g.lineTo(x + hr * 0.5, y + hr * 0.5);
            g.moveTo(x + hr * 0.5, y - hr * 0.5);
            g.lineTo(x - hr * 0.5, y + hr * 0.5);
            g.stroke();
          }
          const L = labelPos(h);
          g.globalAlpha = h.closed ? 0.45 : 1;
          pill(G, g, h.txt, L.x, L.y, L.maxW, L.ph, "#fef3c7", { size: Math.min(19, L.ph * 0.56) });
          g.globalAlpha = 1;
        }
        // nit do prsta
        if (touch && st === "roll") {
          g.strokeStyle = "rgba(255,255,255,0.6)";
          g.lineWidth = 2;
          g.setLineDash([3, 7]);
          g.beginPath();
          g.moveTo(ball.x, ball.y);
          g.lineTo(touch.x, touch.y);
          g.stroke();
          g.setLineDash([]);
        }
        // jeklena kroglica
        if (st !== "done" && st !== "wait" || !G.q) {
          const r = br * ball.s;
          if (r > 0.5) {
            g.fillStyle = "rgba(0,0,0,0.28)";
            g.beginPath();
            g.ellipse(ball.x + r * 0.25, ball.y + r * 0.35, r, r * 0.85, 0, 0, Math.PI * 2);
            g.fill();
            const grd = g.createRadialGradient(ball.x - r * 0.35, ball.y - r * 0.4, r * 0.1, ball.x, ball.y, r);
            grd.addColorStop(0, "#ffffff");
            grd.addColorStop(0.45, "#cbd5e1");
            grd.addColorStop(1, "#475569");
            g.fillStyle = grd;
            g.beginPath();
            g.arc(ball.x, ball.y, r, 0, Math.PI * 2);
            g.fill();
            g.lineWidth = 2;
            g.strokeStyle = INK;
            g.stroke();
          }
        }
      },
    };
  },
};

// ============ SKAKAČ: Pip poskakuje; z nagibom ga usmeri na ploščad s pravilnim odgovorom ============
export const jumper = {
  id: "jumper",
  sensors: true,
  story: {
    sl: [["Travnik", "Skakalček Pip bi rad prišel do oblakov."], ["Gorski vrhovi", "Pip skače po skalah proti vrhu."], ["Zvezdna noč", "Ponoči Pip skače med zvezdami."], ["Nad oblaki", "Pip je že skoraj nad oblaki!"]],
    en: [["The meadow", "Pip the hopper wants to reach the clouds."], ["Mountain peaks", "Pip hops over the rocks towards the summit."], ["Starry night", "At night Pip bounces among the stars."], ["Above the clouds", "Pip is almost above the clouds!"]],
  },
  icon: "circle-arrow-up",
  colors: ["#0369a1", "#16a34a"],
  options: 3,
  timer: 25,
  create(G) {
    let plats = [], hero = { x: 0, y: 0, vx: 0, vy: 0, g: 900 }, st = "bounce", target = null, touching = false, hold = 0;
    let scroll = 0, scrollTo = 0, climb = 0, entry = 0, squash = 0, deco = [];
    const floorY = () => G.H - clamp(G.H * 0.1, 40, 70);
    const HR = () => clamp(Math.min(G.W, G.H) / 26, 12, 22);
    const platH = () => clamp(G.H * 0.028, 12, 18);
    const ph = () => clamp(G.H * 0.06, 28, 40);
    const vmax = () => clamp(G.W * 0.3, 100, 260);
    const layout = () => {
      const n = plats.length || 3, cw = G.W / n;
      plats.forEach((p, i) => Object.assign(p, { x: cw * (i + 0.5), w: Math.min(cw * 0.62, 210), y: Math.max(ph() + 24, floorY() - G.H * (0.42 + p.dh)) }));
    };
    // Odboj s tal: tako visoko, da Pip udobno preskoči najvišjo ploščad.
    const bounce = () => {
      const top = plats.length ? Math.min(...plats.map((p) => p.y)) : floorY() - G.H * 0.42;
      const apex = Math.max(HR() * 2 + 8, top - HR() * 0.6 - G.H * 0.1);
      const rise = floorY() - apex, T = 0.8 / Math.sqrt(G.speed);
      hero.g = (2 * rise) / (T * T);
      hero.vy = -hero.g * T;
      hero.y = floorY();
      squash = 1;
    };
    // Najbližja reža med ploščadmi (tam Pip ne pristane po nesreči).
    const gapX = (x) => {
      const n = plats.length || 3, gaps = Array.from({ length: n - 1 }, (_, i) => (G.W / n) * (i + 1));
      return gaps.sort((a, b) => Math.abs(a - x) - Math.abs(b - x))[0] ?? G.W / 2;
    };
    const under = (x) => plats.some((p) => !p.gone && Math.abs(x - p.x) <= p.w / 2 + HR());
    const land = (p) => {
      hero.y = p.y;
      hero.vy = 0;
      if (G.isRight(p.txt)) {
        st = "won";
        p.won = true;
        scrollTo = floorY() - p.y;
        target = null;
        G.answer(true, hero.x, p.y - HR() * 3, { delay: 1.0 });
        G.burst(hero.x, p.y - HR(), "#fde047", 18);
      } else {
        p.gone = true;
        p.fall = 0;
        st = "fall";
        G.sound("bad");
        G.answer(false, p.x, p.y, { keep: true });
      }
    };
    return {
      resize() {
        layout();
        deco = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random(), s: rand(0.6, 1.3) }));
        hero.x = clamp(hero.x || G.W / 3, HR(), G.W - HR());
        if (st !== "won") hero.y = Math.min(hero.y || floorY(), floorY());
      },
      reset() {
        plats = [];
        hero = { x: G.W / 3, y: floorY(), vx: 0, vy: 0, g: 900 };
        bounce();
        st = "bounce";
        target = null;
        touching = false;
        hold = 0;
        scroll = scrollTo = climb = 0;
      },
      question() {
        climb += scroll;
        scroll = scrollTo = 0;
        const dh = shuffle([-0.05, 0, 0.05]);
        plats = G.opts.map((txt, i) => ({ txt, dh: dh[i % 3], gone: false, won: false, fall: 0 }));
        layout();
        entry = 1;
        if (st === "won") (hero.y = floorY()), bounce();
        st = hero.y < floorY() - 1 ? "fall" : "bounce";
        if (under(hero.x)) target = gapX(hero.x);
      },
      timeout() {
        if (st === "bounce") st = "fall";
      },
      update(dt) {
        entry = Math.max(0, entry - dt * 2.2);
        squash = Math.max(0, squash - dt * 6);
        for (const p of plats) if (p.gone) p.fall += dt;
        // vodoravno: tipke, prst, nagib
        const vm = vmax();
        let want = 0;
        if (hold) (want = hold * vm), (target = null);
        else if (target != null && (touching || !G.tilt?.on || Math.abs(G.tilt.x) < 0.2)) want = clamp((target - hero.x) * 3, -vm, vm);
        else if (G.tilt?.on) (want = clamp(dead(G.tilt.x) * 1.7, -1, 1) * vm), (target = null);
        if (st === "won") want = 0;
        hero.vx += (want - hero.vx) * Math.min(1, dt * 5);
        hero.x = clamp(hero.x + hero.vx * dt, HR(), G.W - HR());
        if (st === "won") {
          scroll += (scrollTo - scroll) * Math.min(1, dt * 4);
          return;
        }
        // navpično
        const prev = hero.y;
        hero.vy += hero.g * dt;
        hero.y += hero.vy * dt;
        if (st === "bounce" && hero.vy > 0 && entry <= 0 && G.q && !G.waiting) {
          for (const p of plats) {
            if (!p.gone && prev <= p.y && hero.y >= p.y && Math.abs(hero.x - p.x) <= p.w / 2 + HR() * 0.5) {
              land(p);
              break;
            }
          }
        }
        if (hero.y >= floorY() && hero.vy > 0) {
          bounce();
          st = "bounce";
          G.sound?.("pop");
        }
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed && touching)) {
          target = p.x;
          touching = true;
        } else if (type === "up") touching = false;
      },
      key(k, down) {
        if (LEFT.has(k) || RIGHT.has(k)) {
          const d = LEFT.has(k) ? -1 : 1;
          if (down) hold = d;
          else if (hold === d) hold = 0;
          return true;
        }
        if (!down) return false;
        const n = numKey(k);
        if (n >= 0 && plats[n] && !plats[n].gone) {
          target = plats[n].x;
          return true;
        }
        return false;
      },
      draw(g) {
        const [s0, s1, hill, floor, platC, star] = chap(G, [
          ["#7dd3fc", "#e0f2fe", "#86efac", "#65a30d", "#fbbf24", null],
          ["#fdba74", "#fef3c7", "#a8a29e", "#78716c", "#60a5fa", null],
          ["#1e1b4b", "#4c1d95", "#312e81", "#1e3a8a", "#a78bfa", "#fef9c3"],
          ["#f9a8d4", "#fef3c7", "#ffffff", "#f1f5f9", "#fb7185", null],
        ]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, s0);
        grd.addColorStop(1, s1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // oblački ali zvezde, ki se ob vzponu pomikajo navzdol
        const up = climb + scroll;
        for (const d of deco) {
          const x = d.x * G.W, y = ((d.y * (G.H + 80) + up * 0.35) % (G.H + 80)) - 40;
          if (star) {
            g.fillStyle = star;
            g.fillRect(x, y, 2.5 * d.s, 2.5 * d.s);
          } else {
            g.fillStyle = "rgba(255,255,255,0.75)";
            g.beginPath();
            g.ellipse(x, y, 26 * d.s, 9 * d.s, 0, 0, Math.PI * 2);
            g.fill();
          }
        }
        // hribi v ozadju
        const fy = floorY() + scroll;
        g.fillStyle = hill;
        g.beginPath();
        g.moveTo(-20, G.H + 20);
        for (let x = -20; x <= G.W + 20; x += 20) g.lineTo(x, fy - G.H * 0.1 - Math.sin(x / 90) * G.H * 0.04 - Math.sin(x / 37) * G.H * 0.015);
        g.lineTo(G.W + 20, G.H + 20);
        g.closePath();
        g.fill();
        // tla
        g.fillStyle = floor;
        g.fillRect(-20, fy, G.W + 40, G.H);
        g.beginPath();
        g.moveTo(-20, fy);
        g.lineTo(G.W + 20, fy);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // ploščadi z napisi spodaj
        const e = entry * entry;
        for (const p of plats) {
          const y = p.y + scroll - e * G.H * 0.5 + (p.gone ? p.fall * p.fall * G.H * 1.2 : 0);
          g.globalAlpha = p.gone ? Math.max(0, 1 - p.fall * 1.6) : 1 - entry * 0.6;
          G.rr(p.x - p.w / 2, y, p.w, platH(), platH() / 2);
          g.fillStyle = p.won ? "#4ade80" : platC;
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          if (p.gone) {
            g.beginPath();
            g.moveTo(p.x - 6, y);
            g.lineTo(p.x + 2, y + platH() * 0.6);
            g.lineTo(p.x - 3, y + platH());
            g.lineWidth = 2;
            g.stroke();
          }
          pill(G, g, p.txt, p.x, y + platH() + 6 + ph() / 2, G.W / plats.length - 10, ph(), "#f8fafc", { size: Math.min(20, ph() * 0.55) });
          g.globalAlpha = 1;
        }
        // Pip: okrogel skakalček z vzmetnimi nogami
        const r = HR(), sq = G.reduced ? 0 : squash * 0.18;
        const X = hero.x, Y = hero.y + scroll;
        g.strokeStyle = INK;
        g.lineWidth = 3;
        g.beginPath();
        for (const sx of [-1, 1]) {
          g.moveTo(X + sx * r * 0.35, Y - r * 0.75);
          g.lineTo(X + sx * r * 0.6, Y - r * 0.55);
          g.lineTo(X + sx * r * 0.3, Y - r * 0.35);
          g.lineTo(X + sx * r * 0.6, Y - r * 0.15);
          g.lineTo(X + sx * r * 0.45, Y);
        }
        g.stroke();
        g.save();
        g.translate(X, Y - r * 1.6);
        g.scale(1 + sq, 1 - sq);
        g.fillStyle = "#fb923c";
        g.beginPath();
        g.arc(0, 0, r, 0, Math.PI * 2);
        g.fill();
        g.stroke();
        const look = clamp(hero.vx / vmax(), -1, 1) * r * 0.15;
        for (const sx of [-1, 1]) {
          g.fillStyle = "#fff";
          g.beginPath();
          g.arc(sx * r * 0.38 + look, -r * 0.2, r * 0.3, 0, Math.PI * 2);
          g.fill();
          g.lineWidth = 2;
          g.stroke();
          g.fillStyle = INK;
          g.beginPath();
          g.arc(sx * r * 0.38 + look * 1.5, -r * 0.15 + (hero.vy < 0 ? -r * 0.06 : r * 0.06), r * 0.13, 0, Math.PI * 2);
          g.fill();
        }
        g.beginPath();
        g.arc(look, r * 0.25, r * 0.28, 0.2, Math.PI - 0.2);
        g.lineWidth = 2;
        g.stroke();
        g.fillStyle = "#fde047";
        g.beginPath();
        g.moveTo(-r * 0.2, -r * 0.92);
        g.lineTo(0, -r * 1.35);
        g.lineTo(r * 0.2, -r * 0.92);
        g.fill();
        g.stroke();
        g.restore();
        // cilj prsta
        if (target != null && touching) {
          g.strokeStyle = "rgba(27,27,47,0.4)";
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(target, fy + 6);
          g.lineTo(target, fy + 20);
          g.stroke();
        }
      },
    };
  },
};

// ============ ČAROBNA KROGLA: stresi kroglo za naslednji odgovor, izberi pravega ============
export const orb = {
  id: "orb",
  sensors: true,
  story: {
    sl: [["Sovin stolp", "Modra sova Lina varuje čarobno kroglo."], ["Smaragdna soba", "Krogla zasije v zeleni luči."], ["Rdeča luna", "Ob rdeči luni krogla šepeta odgovore."], ["Zlata modrost", "Lina postaja najmodrejša sova v gozdu!"]],
    en: [["The owl's tower", "Lina the blue owl guards a magic orb."], ["The emerald room", "The orb glows with a green light."], ["The red moon", "Under the red moon the orb whispers answers."], ["Golden wisdom", "Lina is becoming the wisest owl in the forest!"]],
  },
  icon: "sparkles",
  colors: ["#2e1065", "#7c3aed"],
  options: 4,
  timer: 25,
  create(G) {
    let order = [], idx = 0, shown = null, pend = null, sw = 0, swDur = 0.6, spin = 0, glow = 0, bad = 0, press = null, dust = [];
    const geo = () => {
      const r = Math.min(G.W * 0.36, G.H * 0.27);
      return { cx: G.W / 2, cy: G.H * 0.4, r };
    };
    const btns = () => {
      const { cy, r } = geo();
      const h = clamp(G.H * 0.1, 48, 64), w = clamp(G.W * 0.3, 96, 170), gap = clamp(G.W * 0.06, 16, 40);
      const y = Math.min(G.H - h / 2 - 10, cy + r * 1.45 + h / 2 + 14);
      return [
        { id: "next", x: G.W / 2 - gap / 2 - w / 2, y, w, h },
        { id: "pick", x: G.W / 2 + gap / 2 + w / 2, y, w, h },
      ];
    };
    const swirl = (dir = 1, keepIdx = false) => {
      if (sw > 0 || !G.q || G.waiting || !order.length) return;
      if (!keepIdx) idx = (idx + dir + order.length) % order.length;
      pend = order[idx];
      swDur = 0.6 / Math.sqrt(G.speed);
      sw = swDur;
      G.sound("pop");
    };
    const choose = () => {
      if (sw > 0 || !G.q || G.waiting || shown == null) return;
      const { cx, cy, r } = geo();
      const ok = G.isRight(shown);
      if (ok) {
        glow = 1;
        G.burst(cx, cy - r * 0.3, "#fde047", 26);
        G.burst(cx, cy - r * 0.3, "#f0abfc", 14);
        G.answer(true, cx, cy - r * 0.6, { delay: 0.9 });
      } else {
        bad = 1;
        G.answer(false, cx, cy, { keep: true });
        order.splice(idx, 1);
        if (!order.length) return;
        idx %= order.length;
        shown = null;
        swirl(0, true);
      }
    };
    return {
      resize() {
        dust = Array.from({ length: 24 }, () => ({ x: Math.random(), y: Math.random(), s: rand(1, 2.5), p: rand(0, 6) }));
      },
      reset() {
        order = [];
        shown = pend = null;
        sw = 0;
        glow = bad = 0;
      },
      question() {
        order = shuffle(G.opts);
        idx = 0;
        shown = null;
        sw = 0;
        glow = 0;
        swirl(0, true);
      },
      timeout() {
        sw = 0;
      },
      shake() {
        swirl(1);
      },
      update(dt) {
        glow = Math.max(0, glow - dt * 0.8);
        bad = Math.max(0, bad - dt * 2);
        spin += dt * (sw > 0 ? 9 : G.reduced ? 0 : 0.5);
        if (sw > 0) {
          sw -= dt;
          if (sw <= swDur / 2 && pend != null) (shown = pend), (pend = null);
          if (sw <= 0) sw = 0;
        }
      },
      pointer(type, p) {
        if (type === "down") {
          const b = btns().find((b) => Math.abs(p.x - b.x) < b.w / 2 + 6 && Math.abs(p.y - b.y) < b.h / 2 + 6);
          press = b ? b.id : null;
          if (b?.id === "next") swirl(1);
          else if (b?.id === "pick") choose();
          else {
            const { cx, cy, r } = geo();
            if (Math.hypot(p.x - cx, p.y - cy) < r) choose();
          }
        } else if (type === "up") press = null;
      },
      key(k, down) {
        if (!down) {
          press = null;
          return false;
        }
        if (k === " " || k === "Enter") return (press = "pick"), choose(), true;
        if (RIGHT.has(k) || DOWN.has(k) || k === "Tab") return (press = "next"), swirl(1), true;
        if (LEFT.has(k) || UP.has(k)) return (press = "next"), swirl(-1), true;
        return false;
      },
      draw(g) {
        const [bg0, bg1, o0, o1, rim] = chap(G, [
          ["#1e1b4b", "#0f0a1f", "#c4b5fd", "#4c1d95", "#a78bfa"],
          ["#052e2b", "#021412", "#99f6e4", "#065f46", "#34d399"],
          ["#3b0a1a", "#14030a", "#fecdd3", "#9f1239", "#fb7185"],
          ["#422006", "#140a02", "#fef08a", "#a16207", "#fbbf24"],
        ]);
        const { cx, cy, r } = geo();
        const grd = g.createRadialGradient(cx, cy, r * 0.3, cx, cy, Math.max(G.W, G.H));
        grd.addColorStop(0, bg0);
        grd.addColorStop(1, bg1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = "#fef9c3";
        for (const d of dust) {
          g.globalAlpha = G.reduced ? 0.4 : 0.2 + 0.35 * Math.sin(G.time * 1.3 + d.p);
          g.fillRect(d.x * G.W, d.y * G.H, d.s, d.s);
        }
        g.globalAlpha = 1;
        // podstavek
        const sy = cy + r * 0.82;
        g.fillStyle = "#92400e";
        g.beginPath();
        g.moveTo(cx - r * 0.55, sy);
        g.lineTo(cx + r * 0.55, sy);
        g.lineTo(cx + r * 0.8, sy + r * 0.42);
        g.lineTo(cx - r * 0.8, sy + r * 0.42);
        g.closePath();
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.fillStyle = "#b45309";
        g.fillRect(cx - r * 0.9, sy + r * 0.42, r * 1.8, r * 0.12);
        g.strokeRect(cx - r * 0.9, sy + r * 0.42, r * 1.8, r * 0.12);
        // sova Lina na podstavku
        const s = clamp(r * 0.17, 12, 26), ox = cx + r * 0.72, oy = sy + r * 0.42 - s * 1.2;
        g.fillStyle = "#3b82f6";
        g.beginPath();
        g.ellipse(ox, oy, s, s * 1.2, 0, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 2.5;
        g.stroke();
        g.beginPath();
        g.moveTo(ox - s * 0.8, oy - s * 0.8);
        g.lineTo(ox - s * 0.55, oy - s * 1.45);
        g.lineTo(ox - s * 0.2, oy - s * 1.0);
        g.moveTo(ox + s * 0.8, oy - s * 0.8);
        g.lineTo(ox + s * 0.55, oy - s * 1.45);
        g.lineTo(ox + s * 0.2, oy - s * 1.0);
        g.fill();
        g.stroke();
        const blink = !G.reduced && Math.sin(G.time * 1.7) > 0.97;
        for (const sx of [-1, 1]) {
          g.fillStyle = "#fef3c7";
          g.beginPath();
          g.arc(ox + sx * s * 0.42, oy - s * 0.35, s * 0.36, 0, Math.PI * 2);
          g.fill();
          g.stroke();
          g.fillStyle = INK;
          if (blink) g.fillRect(ox + sx * s * 0.42 - s * 0.25, oy - s * 0.37, s * 0.5, 2);
          else {
            g.beginPath();
            g.arc(ox + sx * s * 0.42 - s * 0.1, oy - s * 0.35, s * 0.15, 0, Math.PI * 2);
            g.fill();
          }
        }
        g.fillStyle = "#f59e0b";
        g.beginPath();
        g.moveTo(ox - s * 0.12, oy - s * 0.05);
        g.lineTo(ox + s * 0.12, oy - s * 0.05);
        g.lineTo(ox, oy + s * 0.2);
        g.fill();
        // krogla
        if (glow > 0) {
          const halo = g.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.5);
          halo.addColorStop(0, `rgba(253,224,71,${0.55 * glow})`);
          halo.addColorStop(1, "rgba(253,224,71,0)");
          g.fillStyle = halo;
          g.fillRect(cx - r * 1.6, cy - r * 1.6, r * 3.2, r * 3.2);
        }
        const og = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
        og.addColorStop(0, o0);
        og.addColorStop(1, o1);
        g.fillStyle = og;
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.fill();
        // vrtinec meglic v krogli
        g.save();
        g.beginPath();
        g.arc(cx, cy, r - 2, 0, Math.PI * 2);
        g.clip();
        g.lineCap = "round";
        for (let i = 0; i < 5; i++) {
          g.strokeStyle = `rgba(255,255,255,${0.12 + (sw > 0 ? 0.18 : 0)})`;
          g.lineWidth = r * (0.05 + i * 0.012);
          g.beginPath();
          g.arc(cx, cy, r * (0.25 + i * 0.14), spin * (i % 2 ? -1 : 1) + i, spin * (i % 2 ? -1 : 1) + i + 1.6);
          g.stroke();
        }
        g.restore();
        g.lineWidth = 4;
        g.strokeStyle = bad > 0 && !G.reduced ? "#ef4444" : INK;
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.stroke();
        g.strokeStyle = "rgba(255,255,255,0.7)";
        g.lineWidth = Math.max(3, r * 0.05);
        g.beginPath();
        g.arc(cx, cy, r * 0.8, Math.PI * 1.08, Math.PI * 1.4);
        g.stroke();
        // odgovor v krogli
        if (shown != null) {
          const a = sw > 0 ? Math.abs(sw - swDur / 2) / (swDur / 2) : 1;
          const h = clamp(r * 0.32, 36, 66);
          g.globalAlpha = a;
          g.save();
          g.translate(cx, cy);
          if (!G.reduced && sw > 0) g.scale(0.6 + 0.4 * a, 0.6 + 0.4 * a);
          pill(G, g, shown, 0, 0, r * 1.55, h, "#fefce8", { size: Math.min(38, h * 0.58) });
          g.restore();
          g.globalAlpha = 1;
        }
        // pikice: koliko odgovorov je še v krogli in kateri je na vrsti
        const n = order.length, dr = clamp(r * 0.035, 3, 6);
        for (let i = 0; i < n; i++) {
          g.fillStyle = i === idx ? "#ffffff" : "rgba(255,255,255,0.35)";
          g.beginPath();
          g.arc(cx + (i - (n - 1) / 2) * dr * 3.4, cy + r * 0.5, dr, 0, Math.PI * 2);
          g.fill();
        }
        // gumba: naslednji (puščici v krogu) in izberi (kljukica)
        for (const b of btns()) {
          const down = press === b.id ? 3 : 0;
          G.rr(b.x - b.w / 2, b.y - b.h / 2 + 4, b.w, b.h, b.h / 3);
          g.fillStyle = INK;
          g.fill();
          G.rr(b.x - b.w / 2, b.y - b.h / 2 + down, b.w, b.h, b.h / 3);
          g.fillStyle = b.id === "pick" ? "#4ade80" : rim;
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          const ix = b.x, iy = b.y + down, q = b.h * 0.24;
          g.lineWidth = Math.max(3, b.h * 0.08);
          g.lineCap = "round";
          g.lineJoin = "round";
          g.strokeStyle = INK;
          g.beginPath();
          if (b.id === "pick") {
            g.moveTo(ix - q * 1.1, iy);
            g.lineTo(ix - q * 0.3, iy + q * 0.8);
            g.lineTo(ix + q * 1.2, iy - q * 0.9);
            g.stroke();
          } else {
            g.arc(ix, iy, q, -Math.PI * 0.15, Math.PI * 0.75);
            g.stroke();
            g.beginPath();
            g.arc(ix, iy, q, Math.PI * 0.85, Math.PI * 1.75);
            g.stroke();
            g.fillStyle = INK;
            for (const a of [Math.PI * 0.75, Math.PI * 1.75]) {
              const px = ix + Math.cos(a) * q, py = iy + Math.sin(a) * q, dx = -Math.sin(a), dy = Math.cos(a), k = q * 0.55;
              g.beginPath();
              g.moveTo(px + dx * k, py + dy * k);
              g.lineTo(px - dy * k * 0.75, py + dx * k * 0.75);
              g.lineTo(px + dy * k * 0.75, py - dx * k * 0.75);
              g.closePath();
              g.fill();
            }
          }
        }
      },
    };
  },
};

export const SENSOR_GAMES = [marble, jumper, orb];
