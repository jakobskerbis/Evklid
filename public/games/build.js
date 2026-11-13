// Igre s topom ter z gradnjo in rušenjem. Izvirni liki; navdih sta »topniške« igre z začetka 90. let
// (nastavi kot in moč, izstrelek leti po paraboli) in stolpi iz kock z žerjavom.

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
const NEON = ["#fde047", "#f472b6", "#4ade80", "#60a5fa", "#fb923c", "#c084fc"];

function pill(G, g, txt, x, y, maxW, h, fill, size = 18) {
  const w = Math.min(maxW, G.tw(txt, size, 900) + 18);
  x = clamp(x, w / 2 + 4, G.W - w / 2 - 4); // napis ostane na zaslonu
  G.rr(x - w / 2, y - h / 2, w, h, Math.min(10, h / 3));
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  G.fit(txt, x, y + 1, w - 8, size, { color: INK, weight: 900 });
}
// Kocka z obrobo in svetlim robom (opeka, kamen, les).
function block(g, x, y, w, h, color, rot = 0) {
  g.save();
  g.translate(x + w / 2, y + h / 2);
  g.rotate(rot);
  g.fillStyle = color;
  g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = "rgba(255,255,255,0.3)";
  g.fillRect(-w / 2, -h / 2, w, 4);
  g.fillStyle = "rgba(0,0,0,0.2)";
  g.fillRect(-w / 2, h / 2 - 4, w, 4);
  g.lineWidth = 2.5;
  g.strokeStyle = INK;
  g.strokeRect(-w / 2, -h / 2, w, h);
  g.restore();
}
// Podrti deli: kocke odletijo in padejo na tla.
function debrisStep(list, dt, ground, gravity) {
  for (const d of list) {
    d.vy += gravity * dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.r += d.vr * dt;
    if (d.y + d.h > ground) {
      d.y = ground - d.h;
      d.vy *= -0.3;
      d.vx *= 0.7;
      d.vr *= 0.6;
    }
    d.life -= dt;
  }
  return list.filter((d) => d.life > 0);
}

// ============ TOP: nameri in izstreli kroglo v stolp s pravilnim odgovorom; zadeti stolp se podre ============
export const cannon = {
  id: "cannon",
  story: {
    sl: [["Grajski izziv", "Topničarka Nika brani grad pred papirnatimi stolpi."], ["Čez reko", "Stolpi stojijo na drugem bregu reke."], ["Mesečina", "Ponoči je treba meriti še bolj natančno."], ["Velika zmaga", "Še zadnji stolpi in grad je rešen!"]],
    en: [["Castle challenge", "Gunner Nika defends the castle from paper towers."], ["Across the river", "The towers stand on the far bank."], ["Moonlight", "At night you need to aim even better."], ["Great victory", "The last towers, and the castle is saved!"]],
  },
  icon: "target",
  colors: ["#7c2d12", "#b45309"],
  options: 3,
  timer: 30,
  create(G) {
    let towers = [], ball = null, debris = [], aim = { a: 0.8, p: 0.6 }, drag = false, smoke = [];
    const ground = () => G.H * 0.86;
    const cx = () => Math.max(40, G.W * 0.09), cy = () => ground() - 22;
    const grav = () => G.H * 1.1;
    const vmax = () => Math.sqrt(G.W * 0.95 * grav()) * 1.15;
    const bw = () => clamp(G.W * 0.07, 34, 70), bh = () => clamp(G.H * 0.06, 24, 40);
    const layout = () => {
      const n = towers.length || 3;
      towers.forEach((t, i) => {
        t.x = G.W * (0.44 + (0.42 * i) / Math.max(1, n - 1)) - bw() / 2;
        t.h = t.n * bh();
      });
    };
    const fire = () => {
      if (ball || G.waiting) return;
      const v = aim.p * vmax();
      ball = { x: cx() + Math.cos(aim.a) * 34, y: cy() - Math.sin(aim.a) * 34, vx: Math.cos(aim.a) * v, vy: -Math.sin(aim.a) * v };
      G.sound("pop");
      if (!G.reduced) G.shake(3);
      smoke.push({ x: ball.x, y: ball.y, life: 0.6 });
    };
    // Samodejni namen (tipke 1–3): kot 45°, moč do sredine stolpa.
    const autoAim = (t) => {
      const d = t.x + bw() / 2 - cx(), h = cy() - (ground() - t.h / 2), th = Math.PI / 4;
      const v2 = (grav() * d * d) / (2 * Math.cos(th) ** 2 * (d * Math.tan(th) - h));
      if (v2 > 0) aim = { a: th, p: clamp(Math.sqrt(v2) / vmax(), 0.1, 1) };
    };
    const setAim = (p) => {
      const dx = p.x - cx(), dy = cy() - p.y;
      aim.a = clamp(Math.atan2(dy, Math.max(1, dx)), 0.1, 1.45);
      aim.p = clamp(Math.hypot(dx, dy) / (G.W * 0.55), 0.15, 1);
    };
    const knock = (t, ok) => {
      for (let i = 0; i < t.n; i++)
        debris.push({ x: t.x, y: ground() - (i + 1) * bh(), w: bw(), h: bh(), vx: rand(-60, 160) * (ok ? 1.4 : 1), vy: rand(-260, -60), vr: rand(-4, 4), r: 0, color: t.color, life: 2.2 });
      t.gone = true;
    };
    return {
      resize: layout,
      reset() {
        towers = [];
        ball = null;
        debris = [];
      },
      question() {
        towers = G.opts.map((txt, i) => ({ txt, n: 2 + Math.floor(Math.random() * 3), gone: false, color: ["#fca5a5", "#93c5fd", "#fcd34d"][i % 3] }));
        layout();
        ball = null;
      },
      update(dt) {
        debris = debrisStep(debris, dt, ground(), grav());
        smoke = smoke.filter((s) => (s.life -= dt) > 0);
        if (!ball) return;
        ball.vy += grav() * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        for (const t of towers) {
          if (t.gone) continue;
          const top = ground() - t.h - bh() * 0.9; // tudi zastavica šteje
          if (ball.x > t.x - 8 && ball.x < t.x + bw() + 8 && ball.y > top && ball.y < ground()) {
            const ok = !G.waiting && G.isRight(t.txt);
            knock(t, ok);
            G.burst(ball.x, ball.y, ok ? "#fde047" : "#ef4444", ok ? 26 : 12);
            G.sound("pop");
            if (!G.waiting) G.answer(ok, t.x + bw() / 2, top, { keep: true, delay: 0.9 });
            ball = null;
            return;
          }
        }
        if (ball.y > ground() || ball.x > G.W + 40) {
          smoke.push({ x: clamp(ball.x, 0, G.W), y: ground(), life: 0.5 });
          ball = null; // zgrešil: brez kazni, poskusi znova
        }
      },
      pointer(type, p, pressed) {
        if (type === "down") (drag = true), setAim(p);
        else if (type === "move" && drag && pressed !== false) setAim(p);
        else if (type === "up" && drag) {
          drag = false;
          fire();
        }
      },
      key(k, down) {
        if (!down) return false;
        const n = /^[1-9]$/.test(k) ? Number(k) - 1 : -1;
        const live = towers.filter((t) => !t.gone);
        if (n >= 0 && live[n]) return autoAim(live[n]), fire(), true;
        if (k === "ArrowUp") return (aim.a = clamp(aim.a + 0.05, 0.1, 1.45)), true;
        if (k === "ArrowDown") return (aim.a = clamp(aim.a - 0.05, 0.1, 1.45)), true;
        if (k === "ArrowRight") return (aim.p = clamp(aim.p + 0.03, 0.15, 1)), true;
        if (k === "ArrowLeft") return (aim.p = clamp(aim.p - 0.03, 0.15, 1)), true;
        if (k === " " || k === "Enter") return fire(), true;
        return false;
      },
      draw(g) {
        const [s0, s1, grass, hill] = chap(G, [["#7dd3fc", "#e0f2fe", "#65a30d", "#a3e635"], ["#93c5fd", "#dbeafe", "#16a34a", "#4ade80"], ["#1e1b4b", "#4338ca", "#14532d", "#166534"], ["#fb923c", "#fde68a", "#a16207", "#ca8a04"]]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, s0);
        grd.addColorStop(1, s1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        if ((G.chapter || 1) === 3) {
          g.fillStyle = "#fef9c3";
          g.beginPath();
          g.arc(G.W * 0.8, G.H * 0.15, 20, 0, 7);
          g.fill();
        }
        g.fillStyle = hill;
        g.beginPath();
        g.moveTo(-20, ground());
        g.quadraticCurveTo(G.W * 0.3, ground() - G.H * 0.18, G.W * 0.6, ground());
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        if ((G.chapter || 1) === 2) {
          g.fillStyle = "#38bdf8";
          g.fillRect(G.W * 0.3, ground() - 4, G.W * 0.12, G.H);
        }
        g.fillStyle = grass;
        g.fillRect(-20, ground(), G.W + 40, G.H);
        g.beginPath();
        g.moveTo(-20, ground());
        g.lineTo(G.W + 20, ground());
        g.stroke();
        // stolpi
        for (const t of towers) {
          if (t.gone) continue;
          for (let i = 0; i < t.n; i++) block(g, t.x, ground() - (i + 1) * bh(), bw(), bh(), t.color);
          const fy = ground() - t.h;
          g.fillStyle = INK;
          g.fillRect(t.x + bw() / 2 - 1.5, fy - bh() * 0.9, 3, bh() * 0.9);
          pill(G, g, t.txt, t.x + bw() / 2, fy - bh() * 1.35, Math.min(G.W * 0.3, 170), clamp(G.H * 0.06, 30, 40), "#fefce8", Math.min(19, G.H * 0.035));
        }
        for (const d of debris) {
          g.globalAlpha = clamp(d.life, 0, 1);
          block(g, d.x, d.y, d.w, d.h, d.color, d.r);
        }
        g.globalAlpha = 1;
        // pot krogle (prvi del) kot pomoč pri merjenju
        if (!ball) {
          const v = aim.p * vmax();
          g.fillStyle = "rgba(27,27,47,0.45)";
          for (let i = 1; i <= 9; i++) {
            const tt = i * 0.06;
            const x = cx() + Math.cos(aim.a) * (34 + v * tt), y = cy() - Math.sin(aim.a) * 34 - Math.sin(aim.a) * v * tt + 0.5 * grav() * tt * tt;
            g.beginPath();
            g.arc(x, y, 3, 0, 7);
            g.fill();
          }
        }
        // top
        g.save();
        g.translate(cx(), cy());
        g.rotate(-aim.a);
        g.fillStyle = "#334155";
        G.rr(-6, -9, 44, 18, 8);
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.restore();
        g.fillStyle = "#92400e";
        g.beginPath();
        g.arc(cx(), cy() + 6, 14, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // moč
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(cx() - 24, ground() + 10, 48, 8);
        g.fillStyle = aim.p > 0.8 ? "#ef4444" : "#facc15";
        g.fillRect(cx() - 24, ground() + 10, 48 * aim.p, 8);
        for (const s of smoke) {
          g.fillStyle = `rgba(255,255,255,${s.life})`;
          g.beginPath();
          g.arc(s.x, s.y, 16 * (1.2 - s.life), 0, 7);
          g.fill();
        }
        if (ball) {
          g.fillStyle = "#111827";
          g.beginPath();
          g.arc(ball.x, ball.y, 8, 0, 7);
          g.fill();
        }
      },
    };
  },
};

// ============ ŽERJAV: spusti kocko s pravilnim odgovorom na stolp; napačna kocka podre vrh ============
export const crane = {
  id: "crane",
  story: {
    sl: [["Prvo gradbišče", "Žerjavovodja Rok gradi najvišji stolp v mestu."], ["Vroči dan", "Stolp raste proti oblakom."], ["Nočna izmena", "Lučke svetijo, gradnja gre naprej."], ["Do neba", "Še nekaj nadstropij do rekorda!"]],
    en: [["First site", "Crane operator Rok builds the tallest tower in town."], ["Hot day", "The tower grows towards the clouds."], ["Night shift", "The lights are on and the work goes on."], ["Sky high", "A few more floors to the record!"]],
  },
  icon: "layers",
  colors: ["#713f12", "#ca8a04"],
  options: 4,
  timer: 30,
  create(G) {
    let stack = [], hook = null, fall = null, debris = [], ph = 0, order = [], oi = 0, cam = 0, sinceRight = 0;
    const bw = () => clamp(G.W * 0.26, 110, 220), bh = () => clamp(G.H * 0.075, 34, 52);
    const ground = () => G.H * 0.92;
    const topY = () => ground() - stack.length * bh() + cam;
    const hookY = () => G.H * 0.2;
    const nextBlock = () => {
      if (!G.q) return;
      const right = sinceRight >= 2 || Math.random() < 0.34;
      const wrong = G.opts.filter((o) => !G.isRight(o) && !order.includes(o));
      const txt = right || !wrong.length ? G.q.a : pickOne(wrong);
      sinceRight = txt === G.q.a ? 0 : sinceRight + 1;
      hook = { txt, color: NEON[oi++ % NEON.length], age: 0 };
    };
    const drop = () => {
      if (!hook || fall || G.waiting) return;
      fall = { x: G.W / 2 + Math.sin(ph) * (G.W / 2 - bw() / 2 - 10), y: hookY() + 30, vy: 0, txt: hook.txt, color: hook.color };
      hook = null;
      G.sound("pop");
    };
    return {
      resize() {},
      reset() {
        stack = [];
        debris = [];
        fall = hook = null;
        cam = 0;
      },
      question() {
        order = [];
        sinceRight = 1;
        nextBlock();
      },
      update(dt) {
        debris = debrisStep(debris, dt, G.H + 200, G.H * 1.5);
        ph += dt * 1.1 * G.speed;
        // kamera sledi vrhu stolpa
        const want = Math.max(0, stack.length * bh() - G.H * 0.45);
        cam += (want - cam) * Math.min(1, dt * 3);
        if (hook) {
          hook.age += dt;
          // kocka, ki je ne spustiš, po enem zamahu odpelje in pride naslednja
          if (hook.age > 3.4 / G.speed && !G.waiting) nextBlock();
        } else if (!fall && G.q && !G.waiting) nextBlock();
        if (!fall) return;
        fall.vy += G.H * 2 * dt;
        fall.y += fall.vy * dt;
        const baseX = stack.length ? stack[stack.length - 1].x : G.W / 2;
        if (fall.y + bh() >= topY()) {
          const off = fall.x - baseX;
          const ok = G.isRight(fall.txt);
          if (ok) {
            // pravilna kocka obstane (malo zamaknjena, kot jo spustiš)
            stack.push({ x: baseX + clamp(off, -bw() * 0.35, bw() * 0.35), txt: fall.txt, color: fall.color });
            G.answer(true, fall.x, topY(), { delay: 0.6 });
          } else {
            // napačna kocka se razbije in podre vrhnje nadstropje
            debris.push({ x: fall.x - bw() / 2, y: topY() - bh(), w: bw(), h: bh(), vx: rand(-120, 120), vy: -200, vr: rand(-5, 5), r: 0, color: fall.color, life: 1.6 });
            const top = stack.pop();
            if (top) debris.push({ x: top.x - bw() / 2, y: topY() - bh(), w: bw(), h: bh(), vx: rand(-160, 160), vy: -120, vr: rand(-5, 5), r: 0, color: top.color, life: 1.6 });
            G.shake(6);
            G.answer(false, fall.x, topY(), { keep: true });
          }
          fall = null;
        }
      },
      pointer(type) {
        if (type === "down") drop();
      },
      key(k, down) {
        if (!down || !(k === " " || k === "Enter" || k === "ArrowDown")) return false;
        drop();
        return true;
      },
      draw(g) {
        const [s0, s1, ground0, win] = chap(G, [["#7dd3fc", "#e0f2fe", "#65a30d", "#fde68a"], ["#fdba74", "#fef3c7", "#a16207", "#fde68a"], ["#0f172a", "#312e81", "#14532d", "#fde047"], ["#c4b5fd", "#f5f3ff", "#e5e7eb", "#fde68a"]]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, s0);
        grd.addColorStop(1, s1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // mesto v ozadju
        g.fillStyle = "rgba(27,27,47,0.18)";
        for (let i = 0; i < 9; i++) {
          const x = (i / 9) * G.W, h = (0.12 + ((i * 37) % 10) / 40) * G.H;
          g.fillRect(x, ground() + cam - h, G.W / 11, h);
        }
        g.fillStyle = ground0;
        g.fillRect(-20, ground() + cam, G.W + 40, G.H);
        g.beginPath();
        g.moveTo(-20, ground() + cam);
        g.lineTo(G.W + 20, ground() + cam);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // temelj stolpa
        g.fillStyle = "#78716c";
        g.fillRect(G.W / 2 - bw() * 0.6, ground() + cam - 8, bw() * 1.2, 12);
        g.lineWidth = 2.5;
        g.strokeStyle = INK;
        g.strokeRect(G.W / 2 - bw() * 0.6, ground() + cam - 8, bw() * 1.2, 12);
        // stolp
        stack.forEach((b, i) => {
          const y = ground() - (i + 1) * bh() + cam;
          block(g, b.x - bw() / 2, y, bw(), bh(), b.color);
          g.fillStyle = win;
          for (let k = 0; k < 3; k++) g.fillRect(b.x - bw() / 2 + bw() * (0.15 + k * 0.28), y + bh() * 0.3, bw() * 0.14, bh() * 0.38);
        });
        for (const d of debris) {
          g.globalAlpha = clamp(d.life, 0, 1);
          block(g, d.x, d.y, d.w, d.h, d.color, d.r);
        }
        g.globalAlpha = 1;
        // žerjav: tirnica in kavelj
        g.fillStyle = "#facc15";
        g.fillRect(0, hookY() - 46, G.W, 10);
        g.lineWidth = 2;
        g.strokeStyle = INK;
        g.strokeRect(-2, hookY() - 46, G.W + 4, 10);
        const hx = G.W / 2 + Math.sin(ph) * (G.W / 2 - bw() / 2 - 10);
        g.fillStyle = "#475569";
        g.fillRect(hx - 14, hookY() - 50, 28, 16);
        g.beginPath();
        g.moveTo(hx, hookY() - 36);
        g.lineTo(hx, hookY() + (hook ? 0 : 20));
        g.stroke();
        if (hook) {
          block(g, hx - bw() / 2, hookY(), bw(), bh(), hook.color);
          G.fit(hook.txt, hx, hookY() + bh() / 2 + 1, bw() - 14, Math.min(20, bh() * 0.5), { color: INK, weight: 900 });
        }
        if (fall) {
          block(g, fall.x - bw() / 2, fall.y, bw(), bh(), fall.color);
          G.fit(fall.txt, fall.x, fall.y + bh() / 2 + 1, bw() - 14, Math.min(20, bh() * 0.5), { color: INK, weight: 900 });
        }
        // vodilo navzdol, kam bo padla kocka
        if (hook) {
          g.strokeStyle = "rgba(27,27,47,0.25)";
          g.setLineDash([6, 8]);
          g.beginPath();
          g.moveTo(hx, hookY() + bh());
          g.lineTo(hx, topY());
          g.stroke();
          g.setLineDash([]);
        }
      },
    };
  },
};

export const BUILD_GAMES = [cannon, crane];
