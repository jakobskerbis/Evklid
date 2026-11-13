// Igre v slogu priljubljenih mobilnih iger (j 2026-10-29: okrepčevalnica z naročili, vožnja čez hribe,
// hišni ljubljenček in njegove mini igre, rezanje sadja). Izvirni liki in risbe; učenje je jedro igre:
// postrežeš, natočiš gorivo, nahraniš, ujameš, najdeš par ali prerežeš le s pravilnim odgovorom.

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
const NEON = ["#fde047", "#f472b6", "#4ade80", "#60a5fa", "#fb923c", "#c084fc"];
const inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
const numKey = (k, n) => (/^[1-9]$/.test(k) && +k <= n ? +k - 1 : -1);

// Napis v zaobljenem okvirčku, ki ostane na zaslonu.
function pill(G, g, txt, x, y, maxW, h, fill, size = 18) {
  const w = Math.min(maxW, G.tw(txt, size, 900) + 18);
  x = clamp(x, w / 2 + 4, G.W - w / 2 - 4);
  G.rr(x - w / 2, y - h / 2, w, h, Math.min(10, h / 3));
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  G.fit(txt, x, y + 1, w - 8, size, { color: INK, weight: 900 });
}
// Odgovor na gumbu: dolg odgovor z več besedami (»celična membrana«) gre v dve vrstici, da ostane berljiv
// na telefonu, namesto da bi se pomanjšal na drobno pisavo.
function answerText(G, txt, x, y, maxW, size, opt) {
  const one = size * Math.min(1, maxW / Math.max(1, G.tw(txt, size, 900)));
  let cut = txt.indexOf(" ");
  if (one >= Math.min(size, 16) || cut < 0) return G.fit(txt, x, y, maxW, size, opt);
  for (let i = cut; i >= 0; i = txt.indexOf(" ", i + 1)) if (Math.abs(i - txt.length / 2) < Math.abs(cut - txt.length / 2)) cut = i;
  const lines = [txt.slice(0, cut), txt.slice(cut + 1)];
  const s = Math.min(size, ...lines.map((l) => size * (maxW / Math.max(1, G.tw(l, size, 900)))));
  lines.forEach((l, k) => G.fit(l, x, y + (k ? 0.55 : -0.55) * s, maxW, s, opt));
}
function sky(G, g, top, bottom) {
  const grd = g.createLinearGradient(0, 0, 0, G.H);
  grd.addColorStop(0, top);
  grd.addColorStop(1, bottom);
  g.fillStyle = grd;
  g.fillRect(-20, -20, G.W + 40, G.H + 40);
}
function circle(g, x, y, r, fill, line = 3) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fillStyle = fill;
  g.fill();
  if (line) {
    g.lineWidth = line;
    g.strokeStyle = INK;
    g.stroke();
  }
}
// Obrazek: oči in usta glede na razpoloženje (1 vesel, 0 čaka, −1 ni zadovoljen, −2 jezen).
function face(g, x, y, r, mood, look = 0) {
  const ey = y - r * 0.15, ex = r * 0.32;
  for (const s of [-1, 1]) {
    circle(g, x + s * ex, ey, r * 0.2, "#fff", 2);
    circle(g, x + s * ex + look * r * 0.07, ey + r * 0.03, r * 0.09, INK, 0);
  }
  if (mood <= -2) {
    g.lineWidth = 3;
    g.strokeStyle = INK;
    for (const s of [-1, 1]) {
      g.beginPath();
      g.moveTo(x + s * ex * 1.6, ey - r * 0.32);
      g.lineTo(x + s * ex * 0.5, ey - r * 0.2);
      g.stroke();
    }
  }
  g.beginPath();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  const my = y + r * 0.35;
  if (mood >= 1) g.arc(x, my - r * 0.1, r * 0.28, 0.15 * Math.PI, 0.85 * Math.PI);
  else if (mood <= -1) g.arc(x, my + r * 0.18, r * 0.24, 1.15 * Math.PI, 1.85 * Math.PI);
  else {
    g.moveTo(x - r * 0.18, my);
    g.lineTo(x + r * 0.18, my);
  }
  g.stroke();
}

// ============ OKREPČEVALNICA: gost naroči (naloga), ti postrežeš s pravilno sestavino ============
function dish(g, kind, x, y, s) {
  g.lineWidth = 2.5;
  g.strokeStyle = INK;
  if (kind === 0) {
    // burger
    g.fillStyle = "#f59e0b";
    g.beginPath();
    g.ellipse(x, y - s * 0.25, s * 0.55, s * 0.32, 0, Math.PI, 0);
    g.fill();
    g.stroke();
    g.fillStyle = "#16a34a";
    g.fillRect(x - s * 0.6, y - s * 0.22, s * 1.2, s * 0.12);
    g.fillStyle = "#7c2d12";
    g.fillRect(x - s * 0.55, y - s * 0.1, s * 1.1, s * 0.2);
    g.strokeRect(x - s * 0.55, y - s * 0.1, s * 1.1, s * 0.2);
    g.fillStyle = "#f59e0b";
    g.fillRect(x - s * 0.55, y + s * 0.12, s * 1.1, s * 0.18);
    g.strokeRect(x - s * 0.55, y + s * 0.12, s * 1.1, s * 0.18);
  } else if (kind === 1) {
    // pica
    g.fillStyle = "#fbbf24";
    g.beginPath();
    g.moveTo(x - s * 0.55, y - s * 0.35);
    g.lineTo(x + s * 0.55, y - s * 0.35);
    g.lineTo(x, y + s * 0.45);
    g.closePath();
    g.fill();
    g.stroke();
    for (const [a, b] of [[-0.2, -0.15], [0.18, -0.12], [0, 0.12]]) circle(g, x + a * s, y + b * s, s * 0.09, "#dc2626", 2);
  } else if (kind === 2) {
    // sladoled
    g.fillStyle = "#d97706";
    g.beginPath();
    g.moveTo(x - s * 0.3, y - s * 0.05);
    g.lineTo(x + s * 0.3, y - s * 0.05);
    g.lineTo(x, y + s * 0.5);
    g.closePath();
    g.fill();
    g.stroke();
    circle(g, x - s * 0.14, y - s * 0.18, s * 0.22, "#f9a8d4", 2.5);
    circle(g, x + s * 0.14, y - s * 0.22, s * 0.22, "#bef264", 2.5);
    circle(g, x, y - s * 0.42, s * 0.2, "#fef3c7", 2.5);
  } else {
    // palačinke
    for (let i = 0; i < 3; i++) {
      g.fillStyle = "#fcd34d";
      g.beginPath();
      g.ellipse(x, y + s * 0.2 - i * s * 0.16, s * 0.55, s * 0.13, 0, 0, Math.PI * 2);
      g.fill();
      g.stroke();
    }
    g.fillStyle = "#7c2d12";
    g.beginPath();
    g.ellipse(x, y - s * 0.14, s * 0.3, s * 0.08, 0, 0, Math.PI * 2);
    g.fill();
  }
}

export const diner = {
  id: "diner",
  story: {
    sl: [["Odprtje", "Kuharica Meta odpre okrepčevalnico na vogalu."], ["Opoldanska gneča", "Vrsta lačnih gostov je vse daljša."], ["Večerna izmena", "Luči gorijo, naročila letijo."], ["Mestni praznik", "Ves trg je prišel na Metine dobrote!"]],
    en: [["Opening day", "Chef Meta opens a diner on the corner."], ["Lunch rush", "The line of hungry guests keeps growing."], ["Evening shift", "The lights are on and orders keep flying."], ["Town festival", "The whole square came for Meta's food!"]],
  },
  icon: "chef-hat",
  colors: ["#9a3412", "#f97316"],
  options: 4,
  timer: 24,
  create(G) {
    const COLORS = ["#f472b6", "#60a5fa", "#4ade80", "#facc15", "#c084fc", "#fb923c"];
    let guest = null, queue = [], leaving = [], jars = [], fly = null, served = 0;
    const newGuest = () => ({ color: pickOne(COLORS), dish: Math.floor(Math.random() * 4), x: -90, mood: 0, bob: rand(0, 6) });
    const counterY = () => G.H * 0.5;
    const guestR = () => clamp(Math.min(G.W, G.H) * 0.11, 34, 70);
    const plate = () => ({ x: G.W * 0.62, y: counterY() - 6 });
    const layout = () => {
      const n = G.opts.length;
      const two = G.W < 560;
      const cols = two ? 2 : n, rows = Math.ceil(n / cols);
      const top = counterY() + G.H * 0.1, gap = 10;
      const w = (G.W - gap * (cols + 1)) / cols, h = Math.min(74, (G.H - top - gap * (rows + 1)) / rows);
      jars = G.opts.map((txt, i) => ({ txt, x: gap + (i % cols) * (w + gap), y: top + gap + Math.floor(i / cols) * (h + gap), w, h, color: NEON[i % NEON.length] }));
    };
    const pick = (i) => {
      const j = jars[i];
      if (!j || !guest || fly || G.waiting) return;
      fly = { txt: j.txt, x: j.x + j.w / 2, y: j.y, sx: j.x + j.w / 2, sy: j.y, t: 0, color: j.color, ok: G.isRight(j.txt) };
      G.sound("pop");
    };
    return {
      resize() {
        if (G.q) layout();
      },
      reset() {
        guest = null;
        jars = []; // odgovori prejšnje igre ne ostanejo na zaslonu
        queue = [];
        leaving = [];
        fly = null;
        served = 0;
      },
      question() {
        if (guest) leaving.push(guest);
        guest = queue.shift() || newGuest();
        guest.mood = 0;
        while (queue.length < 2) queue.push(newGuest());
        fly = null;
        layout();
      },
      timeout() {
        if (guest) guest.mood = -2;
        fly = null; // jed, ki je še v zraku, ne sme odgovoriti na nalogo, ki je že potekla
      },
      update(dt) {
        const tx = G.W * 0.38;
        if (guest) guest.x += (tx - guest.x) * Math.min(1, dt * 5);
        queue.forEach((q, i) => (q.x += (G.W * 0.12 - i * guestR() * 1.1 - q.x) * Math.min(1, dt * 3)));
        for (const l of leaving) l.x += dt * G.W * 0.6;
        leaving = leaving.filter((l) => l.x < G.W + 120);
        if (!fly) return;
        fly.t += dt * 2.6;
        const p = plate(), k = Math.min(1, fly.t);
        fly.x = fly.sx + (p.x - fly.sx) * k;
        fly.y = fly.sy + (p.y - fly.sy) * k - Math.sin(k * Math.PI) * G.H * 0.12;
        if (k < 1) return;
        if (fly.ok) {
          guest.mood = 1;
          served++;
          G.float(guest.x, counterY() - guestR() * 2.4, "♥", "#ef4444", 30);
          G.answer(true, p.x, p.y - 20, { delay: 0.9 });
        } else {
          guest.mood = -1;
          G.answer(false, p.x, p.y - 20, { keep: true });
        }
        fly = null;
      },
      pointer(type, p) {
        if (type !== "down") return;
        const i = jars.findIndex((j) => inRect(p, j));
        if (i >= 0) pick(i);
      },
      key(k, down) {
        const i = numKey(k, jars.length);
        if (!down || i < 0) return false;
        pick(i);
        return true;
      },
      draw(g) {
        const [wall, stripe, counter, night] = chap(G, [["#fef3c7", "#fde68a", "#b45309", false], ["#ffedd5", "#fed7aa", "#9a3412", false], ["#312e81", "#3730a3", "#7c2d12", true], ["#fce7f3", "#fbcfe8", "#be185d", false]]);
        g.fillStyle = wall;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = stripe;
        for (let x = 0; x < G.W; x += 44) g.fillRect(x, 0, 20, counterY());
        // okno z mestom
        const wx = G.W * 0.72, wy = G.H * 0.06, ww = G.W * 0.24, wh = G.H * 0.22;
        g.fillStyle = night ? "#0f172a" : "#bae6fd";
        g.fillRect(wx, wy, ww, wh);
        g.lineWidth = 4;
        g.strokeStyle = INK;
        g.strokeRect(wx, wy, ww, wh);
        if (night) for (let i = 0; i < 6; i++) circle(g, wx + ((i * 37) % ww), wy + ((i * 23) % wh), 1.8, "#fde047", 0);
        // gostje v vrsti
        const r = guestR();
        for (const q of [...queue].reverse()) {
          circle(g, q.x, counterY() - r * 0.9, r * 0.7, q.color);
          face(g, q.x, counterY() - r * 0.9, r * 0.7, 0, 1);
        }
        for (const l of leaving) {
          circle(g, l.x, counterY() - r * 1.1, r, l.color);
          face(g, l.x, counterY() - r * 1.1, r, l.mood);
        }
        if (guest) {
          const bob = Math.sin(G.time * 3 + guest.bob) * 3;
          circle(g, guest.x, counterY() - r * 1.1 + bob, r, guest.color);
          face(g, guest.x, counterY() - r * 1.1 + bob, r, guest.mood, 1);
          // oblaček z naročilom
          const bx = guest.x + r * 1.15, by = counterY() - r * 2.4;
          G.rr(bx - r * 0.7, by - r * 0.6, r * 1.4, r * 1.2, 14);
          g.fillStyle = "#fff";
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          dish(g, guest.dish, bx, by, r * 0.8);
        }
        // pult in krožnik
        g.fillStyle = counter;
        g.fillRect(-20, counterY(), G.W + 40, G.H * 0.08);
        g.lineWidth = 4;
        g.strokeStyle = INK;
        g.strokeRect(-20, counterY(), G.W + 40, G.H * 0.08);
        const p = plate();
        g.fillStyle = "#f8fafc";
        g.beginPath();
        g.ellipse(p.x, p.y, r * 0.9, r * 0.22, 0, 0, Math.PI * 2);
        g.fill();
        g.stroke();
        if (guest?.mood === 1) dish(g, guest.dish, p.x, p.y - r * 0.35, r * 0.75);
        // postreženi krožniki
        G.fit(`${served}`, G.W - 26, counterY() + G.H * 0.04, 40, 18, { color: "#fff", weight: 900, stroke: INK });
        // sestavine (odgovori)
        jars.forEach((j, i) => {
          G.rr(j.x, j.y, j.w, j.h, 14);
          g.fillStyle = j.color;
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          answerText(G, j.txt, j.x + j.w / 2, j.y + j.h / 2 + 1, j.w - 30, Math.min(22, j.h * 0.42), { color: INK, weight: 900 });
          G.fit(`${i + 1}`, j.x + 13, j.y + 14, 20, 12, { color: "rgba(27,27,47,0.55)", weight: 900 });
        });
        if (fly) {
          circle(g, fly.x, fly.y, 16, fly.color);
          pill(G, g, fly.txt, fly.x, fly.y - 28, G.W * 0.5, 28, "#fff", 15);
        }
      },
    };
  },
};

// ============ VOŽNJA ČEZ HRIBE: pelji skozi kanister s pravilnim odgovorom, čez napačne skoči ============
export const hills = {
  id: "hills",
  story: {
    sl: [["Zeleni griči", "Voznica Zala s starim džipom odrine čez griče."], ["Peščene sipine", "Pesek, vročina in strme sipine."], ["Zasnežene gore", "Na snegu kolesa rada zdrsnejo."], ["Lunina pot", "Zala je zapeljala kar na Luno!"]],
    en: [["Green hills", "Driver Zala sets off over the hills in her old jeep."], ["Sand dunes", "Sand, heat and steep dunes."], ["Snowy peaks", "On snow the wheels like to slip."], ["Moon road", "Zala has driven all the way to the Moon!"]],
  },
  icon: "car",
  colors: ["#166534", "#65a30d"],
  options: 4,
  create(G) {
    let car = { x: 0, y: 0, v: 120, vy: 0, air: false, rot: 0 }, cans = [], fuel = 1, cam = 0, dist = 0, puffs = [];
    const amp = () => G.H * (0.06 + 0.02 * Math.min(3, (G.chapter || 1) - 1));
    const groundY = (x) => G.H * 0.66 + amp() * (Math.sin(x * 0.0042) + 0.55 * Math.sin(x * 0.011 + 1.3) + 0.25 * Math.sin(x * 0.027 + 2.1)) * (x < 300 ? x / 300 : 1);
    const slope = (x) => (groundY(x + 4) - groundY(x - 4)) / 8;
    // razmik raste s hitrostjo, da je med dvema kanistroma vedno čas za pristanek in nov skok
    const gap = () => Math.max(G.W * 0.45, 230, 330 * G.speed);
    const canH = () => clamp(G.H * 0.07, 30, 46);
    const spawn = () => {
      const start = car.x + G.W * 0.85;
      cans = shuffle(G.opts).map((txt, i) => ({ x: start + i * gap(), txt, state: "idle", t: 0 }));
    };
    const jump = () => {
      if (car.air || G.over) return;
      car.air = true;
      car.vy = -G.H * 1.05;
      G.sound("pop");
    };
    return {
      resize() {},
      reset() {
        car = { x: 0, y: groundY(0), v: 120, vy: 0, air: false, rot: 0 };
        cans = [];
        fuel = 1;
        dist = 0;
        puffs = [];
      },
      question() {
        spawn();
      },
      update(dt) {
        // motor vleče, klanec zavira (navzdol pospeši), upor omeji hitrost
        const s = slope(car.x);
        const power = 230 * G.speed, grav = 520;
        car.v += (power - grav * s * 0.9 - car.v * 0.9) * dt;
        car.v = clamp(car.v, 70 * G.speed, 420 * G.speed);
        const prevX = car.x;
        car.x += car.v * dt;
        dist += car.v * dt;
        const gy = groundY(car.x);
        if (car.air) {
          car.vy += G.H * 2.6 * dt;
          car.y += car.vy * dt;
          if (car.y >= gy) {
            car.y = gy;
            car.air = false;
            car.vy = 0;
          }
        } else car.y = gy;
        car.rot += (Math.atan(slope(car.x)) - car.rot) * Math.min(1, dt * (car.air ? 2 : 10));
        cam = car.x - G.W * 0.28;
        // gorivo počasi pojenja
        if (!G.waiting) fuel -= dt * 0.03 * G.speed;
        if (fuel <= 0) {
          fuel = 0.6;
          G.float(G.W / 2, G.H * 0.3, "⛽ 0", "#ef4444", 28);
          G.answer(false, G.W * 0.28, car.y - 40);
          cans = [];
          return;
        }
        if (Math.random() < dt * 8) puffs.push({ x: car.x - 30, y: car.y - 14, life: 0.6 });
        for (const p of puffs) (p.life -= dt), (p.y -= dt * 20);
        puffs = puffs.filter((p) => p.life > 0);
        for (const c of cans) {
          c.t += dt;
          if (c.state !== "idle") continue;
          // kanister šteje, ko ga avto prevozi: če je takrat v zraku, ga je preskočil (tudi počasi v klanec)
          if (!(c.x > prevX && c.x <= car.x)) continue;
          const low = car.y > groundY(c.x) - canH() * 0.6;
          if (low) {
            if (G.waiting) {
              c.state = "gone";
              continue;
            }
            if (G.isRight(c.txt)) {
              c.state = "got";
              fuel = Math.min(1, fuel + 0.45);
              cans.forEach((o) => o !== c && o.state === "idle" && (o.state = "gone"));
              G.answer(true, c.x - cam, groundY(c.x) - canH(), { delay: 0.6 });
            } else {
              c.state = "hit";
              fuel = Math.max(0.05, fuel - 0.15);
              car.v *= 0.5;
              G.answer(false, c.x - cam, groundY(c.x) - canH(), { keep: true });
            }
          }
        }
        // vsi kanistri so za avtom: nov niz za isto nalogo
        if (cans.length && !G.waiting && cans.every((c) => c.state !== "idle" || c.x < car.x - 40)) spawn();
      },
      pointer(type) {
        if (type === "down") jump();
      },
      key(k, down) {
        if (!down || !(k === " " || k === "ArrowUp" || k === "Enter")) return false;
        jump();
        return true;
      },
      draw(g) {
        const [s0, s1, hill, ground0, far] = chap(G, [["#7dd3fc", "#e0f2fe", "#4ade80", "#15803d", "#86efac"], ["#fdba74", "#fef3c7", "#fcd34d", "#b45309", "#fde68a"], ["#bfdbfe", "#f8fafc", "#f1f5f9", "#94a3b8", "#e2e8f0"], ["#0f172a", "#312e81", "#cbd5e1", "#64748b", "#475569"]]);
        sky(G, g, s0, s1);
        if ((G.chapter || 1) >= 4) for (let i = 0; i < 30; i++) circle(g, (((i * 97 - cam * 0.05) % G.W) + G.W) % G.W, (i * 53) % (G.H * 0.5), 1.4, "#fff", 0);
        // oddaljeni hribi
        g.fillStyle = far;
        g.beginPath();
        g.moveTo(0, G.H);
        for (let x = 0; x <= G.W + 16; x += 16) g.lineTo(x, G.H * 0.5 + Math.sin((x + cam * 0.3) * 0.006) * G.H * 0.06);
        g.lineTo(G.W, G.H);
        g.fill();
        // cesta
        g.beginPath();
        g.moveTo(0, G.H);
        for (let x = 0; x <= G.W + 8; x += 8) g.lineTo(x, groundY(x + cam));
        g.lineTo(G.W, G.H);
        g.closePath();
        g.fillStyle = ground0;
        g.fill();
        g.beginPath();
        for (let x = 0; x <= G.W + 8; x += 8) g[x ? "lineTo" : "moveTo"](x, groundY(x + cam));
        g.lineWidth = 8;
        g.strokeStyle = hill;
        g.stroke();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        // kanistri
        for (const c of cans) {
          if (c.state === "gone" || c.state === "got") continue;
          const x = c.x - cam;
          if (x < -60 || x > G.W + 60) continue;
          const y = groundY(c.x), h = canH(), w = h * 0.75;
          g.save();
          g.translate(x, y);
          g.fillStyle = c.state === "hit" ? "#64748b" : "#dc2626";
          G.rr(-w / 2, -h, w, h, 6);
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          g.fillStyle = "#fca5a5";
          g.fillRect(-w * 0.25, -h * 0.75, w * 0.5, h * 0.12);
          g.restore();
          // napis prevoženega kanistra skrijemo, sicer ga pill() prisloni ob levi rob čez džip in naslednji napis
          if (c.x >= car.x - 24) pill(G, g, c.txt, x, y - h - 26 - Math.sin(c.t * 4) * 3, Math.min(G.W * 0.42, gap() * 0.9), 32, c.state === "hit" ? "#cbd5e1" : "#fde047", 17);
        }
        for (const p of puffs) circle(g, p.x - cam, p.y, 6 * (1 - p.life), `rgba(148,163,184,${p.life})`, 0);
        // džip
        const x = car.x - cam, s = clamp(G.H * 0.06, 26, 40);
        g.save();
        g.translate(x, car.y);
        g.rotate(car.rot);
        g.fillStyle = "#f97316";
        G.rr(-s * 1.2, -s * 1.15, s * 2.4, s * 0.75, 8);
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.fillStyle = "#bae6fd";
        G.rr(-s * 0.4, -s * 1.6, s * 0.9, s * 0.5, 5);
        g.fill();
        g.stroke();
        circle(g, -s * 0.2, -s * 1.3, s * 0.18, "#fcd34d", 2);
        for (const wx of [-s * 0.75, s * 0.75]) {
          circle(g, wx, -s * 0.38, s * 0.38, "#1f2937");
          circle(g, wx, -s * 0.38, s * 0.15, "#9ca3af", 2);
        }
        g.restore();
        // merilnik goriva
        const fw = Math.min(160, G.W * 0.35);
        G.rr(12, 12, fw, 18, 9);
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fill();
        G.rr(12, 12, Math.max(10, fw * fuel), 18, 9);
        g.fillStyle = fuel < 0.25 ? "#ef4444" : "#22c55e";
        g.fill();
        G.rr(12, 12, fw, 18, 9);
        g.lineWidth = 2.5;
        g.strokeStyle = INK;
        g.stroke();
        G.fit("⛽", 26, 22, 20, 13, { color: INK });
        G.fit(`${Math.round(dist / 50)} m`, G.W - 44, 22, 80, 15, { color: "#fff", weight: 900, stroke: INK });
      },
    };
  },
};

// ============ LJUBLJENČEK: nahrani Bibija s priboljškom s pravilnim odgovorom ============
export const pet = {
  id: "pet",
  story: {
    sl: [["Jajce se izvali", "Iz jajca pokuka mali Bibi."], ["Mladiček", "Bibi raste in je vedno lačen."], ["Igrivi Bibi", "Bibi ima svoje muhe, a te ima rad."], ["Veliki prijatelj", "Bibi je zrasel v velikega, srečnega prijatelja!"]],
    en: [["The egg hatches", "Little Bibi peeks out of the egg."], ["The baby", "Bibi is growing and always hungry."], ["Playful Bibi", "Bibi can be moody, but he loves you."], ["Big friend", "Bibi has grown into a big, happy friend!"]],
  },
  icon: "paw-print",
  colors: ["#be185d", "#f472b6"],
  options: 3,
  create(G) {
    let treats = [], fly = null, drag = null, mood = 0, moodT = 0, hunger = 0.5, joy = 0.6, wiggle = 0, look = 0, blink = 0;
    const petPos = () => ({ x: G.W / 2, y: G.H * 0.42 });
    const petR = () => clamp(Math.min(G.W, G.H) * 0.17, 50, 120) * (0.8 + Math.min(0.45, (G.correct || 0) * 0.015));
    const layout = () => {
      const n = G.opts.length, gap = 12;
      const w = Math.min(220, (G.W - gap * (n + 1)) / n), h = clamp(G.H * 0.14, 62, 96);
      const x0 = (G.W - (w * n + gap * (n - 1))) / 2;
      treats = G.opts.map((txt, i) => ({ txt, x: x0 + i * (w + gap), y: G.H - h - 16, w, h, color: NEON[(i + 2) % NEON.length], home: true }));
    };
    const feed = (t, from) => {
      if (!t || fly || G.waiting) return;
      fly = { t: 0, txt: t.txt, color: t.color, sx: from.x, sy: from.y, x: from.x, y: from.y, ok: G.isRight(t.txt) };
      t.home = false;
    };
    return {
      resize() {
        if (G.q) layout();
      },
      reset() {
        treats = [];
        hunger = 0.5;
        joy = 0.6;
        fly = drag = null;
      },
      question() {
        layout();
        fly = drag = null;
      },
      update(dt) {
        hunger = Math.max(0, hunger - dt * 0.012);
        joy = Math.max(0, joy - dt * 0.008);
        wiggle = Math.max(0, wiggle - dt * 2);
        moodT -= dt;
        if (moodT <= 0) mood = 0;
        blink -= dt;
        if (blink < -3) blink = 0.15;
        const target = drag ? clamp((drag.x - G.W / 2) / (G.W / 4), -1, 1) : 0;
        look += (target - look) * Math.min(1, dt * 6);
        if (!fly) return;
        fly.t += dt * 2.4;
        const p = petPos(), k = Math.min(1, fly.t);
        fly.x = fly.sx + (p.x - fly.sx) * k;
        fly.y = fly.sy + (p.y + petR() * 0.3 - fly.sy) * k - Math.sin(k * Math.PI) * 40;
        if (k < 1) return;
        if (fly.ok) {
          mood = 1;
          moodT = 1.2;
          hunger = Math.min(1, hunger + 0.3);
          joy = Math.min(1, joy + 0.2);
          wiggle = 1;
          for (let i = 0; i < 3; i++) G.float(p.x + rand(-40, 40), p.y - petR(), "♥", "#ef4444", 26, 1.2);
          G.answer(true, p.x, p.y - petR(), { delay: 0.9 });
        } else {
          mood = -1;
          moodT = 1.2;
          G.float(p.x, p.y - petR() * 1.2, "🤢", "#65a30d", 30); // brez besedila: igra teče v vseh jezikih
          const t = treats.find((x) => x.txt === fly.txt);
          if (t) t.gone = true;
          G.answer(false, p.x, p.y - petR(), { keep: true });
        }
        fly = null;
      },
      pointer(type, p) {
        if (type === "down") {
          const t = treats.find((x) => x.home && !x.gone && inRect(p, x));
          if (t) {
            drag = { t, x: p.x, y: p.y, sx: p.x, sy: p.y };
            return;
          }
          const c = petPos();
          if (Math.hypot(p.x - c.x, p.y - c.y) < petR()) {
            // božanje: samo za veselje, brez točk
            wiggle = 1;
            joy = Math.min(1, joy + 0.05);
            G.float(c.x + rand(-30, 30), c.y - petR(), "♥", "#f472b6", 20, 0.8);
          }
        } else if (type === "move" && drag) Object.assign(drag, { x: p.x, y: p.y });
        else if (type === "up" && drag) {
          const t = drag.t, moved = Math.hypot(p.x - drag.sx, p.y - drag.sy) > 12;
          const c = petPos();
          // tap ali spust na Bibija = nahrani
          if (!moved || Math.hypot(p.x - c.x, p.y - c.y) < petR() * 1.3) feed(t, moved ? p : { x: t.x + t.w / 2, y: t.y });
          drag = null;
        }
      },
      key(k, down) {
        const i = numKey(k, treats.length);
        if (!down || i < 0) return false;
        const t = treats[i];
        if (t.home && !t.gone) feed(t, { x: t.x + t.w / 2, y: t.y });
        return true;
      },
      draw(g) {
        const [wall, floor, body, belly] = chap(G, [["#e0f2fe", "#fde68a", "#fbbf24", "#fef3c7"], ["#fce7f3", "#d9f99d", "#f472b6", "#fbcfe8"], ["#ede9fe", "#bae6fd", "#a78bfa", "#ddd6fe"], ["#ecfccb", "#fed7aa", "#34d399", "#d1fae5"]]);
        g.fillStyle = wall;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = "rgba(255,255,255,0.5)";
        for (let y = 20; y < G.H * 0.7; y += 46) for (let x = (y / 46) % 2 ? 23 : 0; x < G.W; x += 46) circle(g, x, y, 5, "rgba(255,255,255,0.6)", 0);
        g.fillStyle = floor;
        g.fillRect(-20, G.H * 0.62, G.W + 40, G.H);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.beginPath();
        g.moveTo(-20, G.H * 0.62);
        g.lineTo(G.W + 20, G.H * 0.62);
        g.stroke();
        // potrebe: lakota in veselje
        const bw = Math.min(130, G.W * 0.3);
        [["🍎", hunger, "#f97316"], ["♥", joy, "#ec4899"]].forEach(([label, v, color], i) => {
          const y = 12 + i * 24;
          G.rr(34, y, bw, 16, 8);
          g.fillStyle = "rgba(0,0,0,0.15)";
          g.fill();
          G.rr(34, y, Math.max(8, bw * v), 16, 8);
          g.fillStyle = color;
          g.fill();
          G.rr(34, y, bw, 16, 8);
          g.lineWidth = 2;
          g.strokeStyle = INK;
          g.stroke();
          G.fit(label, 20, y + 9, 22, 14, { color: INK });
        });
        // Bibi
        const p = petPos(), r = petR();
        const sq = 1 + Math.sin(G.time * 2.4) * 0.03 + Math.sin(G.time * 18) * 0.05 * wiggle;
        g.save();
        g.translate(p.x, p.y + r * 0.9);
        g.scale(1 / sq, sq);
        g.translate(0, -r * 0.9);
        g.fillStyle = "rgba(0,0,0,0.12)";
        g.beginPath();
        g.ellipse(0, r * 0.9, r * 0.9, r * 0.18, 0, 0, Math.PI * 2);
        g.fill();
        circle(g, -r * 0.6, -r * 0.75, r * 0.25, body);
        circle(g, r * 0.6, -r * 0.75, r * 0.25, body);
        circle(g, 0, 0, r, body, 4);
        g.fillStyle = belly;
        g.beginPath();
        g.ellipse(0, r * 0.35, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
        g.fill();
        if (blink > 0) {
          g.lineWidth = 3;
          g.strokeStyle = INK;
          for (const s of [-1, 1]) {
            g.beginPath();
            g.moveTo(s * r * 0.32 - r * 0.15, -r * 0.15);
            g.lineTo(s * r * 0.32 + r * 0.15, -r * 0.15);
            g.stroke();
          }
          g.beginPath();
          g.arc(0, r * 0.25, r * 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
          g.stroke();
        } else face(g, 0, 0, r, mood || (fly || drag ? 1 : 0), look);
        if (mood === 1) {
          circle(g, -r * 0.55, r * 0.15, r * 0.1, "rgba(244,114,182,0.6)", 0);
          circle(g, r * 0.55, r * 0.15, r * 0.1, "rgba(244,114,182,0.6)", 0);
        }
        g.restore();
        // priboljški (odgovori)
        treats.forEach((t, i) => {
          if (!t.home || t.gone) {
            if (t.gone) {
              G.rr(t.x, t.y, t.w, t.h, 16);
              g.fillStyle = "rgba(0,0,0,0.08)";
              g.fill();
            }
            return;
          }
          const dragging = drag?.t === t;
          const x = dragging ? drag.x - t.w / 2 : t.x, y = dragging ? drag.y - t.h / 2 : t.y;
          G.rr(x, y, t.w, t.h, 16);
          g.fillStyle = t.color;
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          circle(g, x + 18, y + 18, 9, "#fff", 2);
          G.fit(`${i + 1}`, x + 18, y + 19, 14, 11, { color: INK, weight: 900 });
          answerText(G, t.txt, x + t.w / 2, y + t.h / 2 + 6, t.w - 16, Math.min(24, t.h * 0.36), { color: INK, weight: 900 });
        });
        if (fly) {
          circle(g, fly.x, fly.y, 18, fly.color);
          pill(G, g, fly.txt, fly.x, fly.y - 30, G.W * 0.5, 28, "#fff", 15);
        }
      },
    };
  },
};

// ============ LOVILEC: z košaro ujemi padajoči sadež s pravilnim odgovorom ============
export const catcher = {
  id: "catcher",
  story: {
    sl: [["Sadovnjak", "Ježek Tim lovi zrele sadeže v košaro."], ["Poletni dež", "Med sadeži padajo tudi kapljice."], ["Vetrovni dan", "Veter nosi sadeže sem in tja."], ["Zvezdna noč", "Ponoči z neba padajo zvezde."]],
    en: [["The orchard", "Tim the hedgehog catches ripe fruit in his basket."], ["Summer rain", "Raindrops fall between the fruit."], ["Windy day", "The wind blows the fruit around."], ["Starry night", "At night, stars fall from the sky."]],
  },
  icon: "shopping-basket",
  colors: ["#0e7490", "#22d3ee"],
  options: 4,
  create(G) {
    let bx = 0, tx = 0, items = [], spawnT = 0, sinceRight = 0, keys = { l: false, r: false }, caught = [];
    const bw = () => clamp(G.W * 0.22, 90, 170);
    const baseY = () => G.H * 0.88;
    const itemR = () => clamp(Math.min(G.W, G.H) * 0.055, 22, 34);
    const COLORS = ["#ef4444", "#f59e0b", "#84cc16", "#a855f7", "#f97316"];
    const spawn = () => {
      if (!G.q) return;
      const right = sinceRight >= 2 || Math.random() < 0.34;
      const txt = right ? G.q.a : pickOne(G.opts.filter((o) => !G.isRight(o)));
      sinceRight = right ? 0 : sinceRight + 1;
      // ne nad zadnjim sadežem, da se napisi ne prekrivajo
      let x = 0;
      for (let k = 0; k < 6; k++) {
        x = rand(G.W * 0.12, G.W * 0.88);
        if (!items.some((o) => Math.abs(o.x - x) < G.W * 0.22 && o.y < G.H * 0.35)) break;
      }
      items.push({ x, y: -30, vy: G.H * rand(0.16, 0.22) * G.speed, txt, color: pickOne(COLORS), sway: rand(0, 6) });
    };
    return {
      resize() {
        bx = tx = clamp(bx || G.W / 2, bw() / 2, G.W - bw() / 2);
      },
      reset() {
        items = [];
        caught = [];
        bx = tx = G.W / 2;
      },
      question() {
        items = []; // stari sadeži nosijo odgovore prejšnje naloge
        sinceRight = 1;
        spawnT = 0.2;
      },
      update(dt) {
        if (keys.l) tx -= G.W * 0.9 * dt;
        if (keys.r) tx += G.W * 0.9 * dt;
        if (G.tilt?.on) tx += G.tilt.x * G.W * 1.2 * dt;
        tx = clamp(tx, bw() / 2, G.W - bw() / 2);
        bx += (tx - bx) * Math.min(1, dt * 14);
        spawnT -= dt;
        if (spawnT <= 0 && !G.waiting) {
          spawn();
          spawnT = 1.3 / G.speed;
        }
        const wind = (G.chapter || 1) === 3 ? Math.sin(G.time * 0.8) * 40 : 0;
        for (const o of items) {
          o.y += o.vy * dt;
          o.x = clamp(o.x + (wind + Math.sin(G.time * 2 + o.sway) * 10) * dt, 20, G.W - 20);
          if (o.done) continue;
          if (o.y + itemR() >= baseY() - 18 && o.y < baseY() + 10 && Math.abs(o.x - bx) < bw() / 2) {
            o.done = true;
            if (G.waiting) continue;
            const ok = G.isRight(o.txt);
            caught.push({ color: o.color, x: rand(-bw() * 0.3, bw() * 0.3) });
            if (caught.length > 6) caught.shift();
            G.answer(ok, o.x, baseY() - 40, ok ? { delay: 0.5 } : { keep: true });
          }
        }
        items = items.filter((o) => !o.done && o.y < G.H + 40);
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed)) tx = p.x;
      },
      key(k, down) {
        if (k === "ArrowLeft") keys.l = down;
        else if (k === "ArrowRight") keys.r = down;
        else return false;
        return true;
      },
      draw(g) {
        const [s0, s1, grass, leaf] = chap(G, [["#bae6fd", "#f0f9ff", "#86efac", "#16a34a"], ["#94a3b8", "#e2e8f0", "#4ade80", "#15803d"], ["#a5f3fc", "#ecfeff", "#bef264", "#65a30d"], ["#0f172a", "#1e1b4b", "#334155", "#1e293b"]]);
        sky(G, g, s0, s1);
        // krošnja zgoraj
        g.fillStyle = leaf;
        for (let x = -20; x < G.W + 40; x += 60) {
          g.beginPath();
          g.arc(x, -10, 46, 0, Math.PI * 2);
          g.fill();
        }
        if ((G.chapter || 1) === 2) {
          g.strokeStyle = "rgba(255,255,255,0.6)";
          g.lineWidth = 2;
          for (let i = 0; i < 24; i++) {
            const x = (i * 71 + G.time * 60) % G.W, y = (i * 47 + G.time * 300) % G.H;
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x - 3, y + 10);
            g.stroke();
          }
        }
        g.fillStyle = grass;
        g.fillRect(-20, baseY() + 8, G.W + 40, G.H);
        // sadeži z odgovori
        const r = itemR();
        for (const o of items) {
          if ((G.chapter || 1) === 4) {
            g.fillStyle = "#fde047";
            g.beginPath();
            for (let k = 0; k < 10; k++) {
              const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.5 : r * 1.05;
              g[k ? "lineTo" : "moveTo"](o.x + Math.cos(a) * rr, o.y + Math.sin(a) * rr);
            }
            g.closePath();
            g.fill();
            g.lineWidth = 3;
            g.strokeStyle = INK;
            g.stroke();
          } else {
            circle(g, o.x, o.y, r, o.color);
            g.fillStyle = "#16a34a";
            g.beginPath();
            g.ellipse(o.x + r * 0.3, o.y - r * 0.95, r * 0.35, r * 0.15, -0.5, 0, Math.PI * 2);
            g.fill();
          }
          pill(G, g, o.txt, o.x, o.y + r + 18, G.W * 0.42, 30, "#fff", 16);
        }
        // ježek drži košaro nad glavo
        const y = baseY(), w = bw(), hy = y + w * 0.2;
        g.lineWidth = 3;
        g.strokeStyle = INK;
        for (let k = -4; k <= 4; k++) {
          const a = -Math.PI / 2 + (k / 4) * 2.2; // bodice na hrbtu in ob straneh
          g.beginPath();
          g.moveTo(bx + Math.cos(a) * w * 0.22, hy + Math.sin(a) * w * 0.22);
          g.lineTo(bx + Math.cos(a) * w * 0.36, hy + Math.sin(a) * w * 0.36);
          g.stroke();
        }
        circle(g, bx, hy, w * 0.26, "#92400e");
        circle(g, bx, hy + w * 0.04, w * 0.17, "#fde68a", 0);
        face(g, bx, hy + w * 0.04, w * 0.15, 1);
        for (const c of caught) circle(g, bx + c.x * 0.8, y - 22, 9, c.color, 2);
        g.fillStyle = "#d97706";
        g.beginPath();
        g.moveTo(bx - w / 2, y - 18);
        g.lineTo(bx + w / 2, y - 18);
        g.lineTo(bx + w * 0.38, y + 10);
        g.lineTo(bx - w * 0.38, y + 10);
        g.closePath();
        g.fill();
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.stroke();
        g.strokeStyle = "rgba(27,27,47,0.35)";
        g.lineWidth = 2;
        for (let k = 1; k < 5; k++) {
          g.beginPath();
          g.moveTo(bx - w / 2 + (k * w) / 5, y - 18);
          g.lineTo(bx - w * 0.38 + (k * w * 0.76) / 5, y + 10);
          g.stroke();
        }
      },
    };
  },
};

// ============ SPOMIN: zapomni si kartice in odpri par s pravilnim odgovorom ============
export const pairs = {
  id: "pairs",
  story: {
    sl: [["Stara skrinja", "Sova Modra hrani kartice v stari skrinji."], ["Knjižnica", "Kartice so se razsule med knjige."], ["Nočna sova", "Ponoči si Modra zapomni še več."], ["Mojster spomina", "Še nekaj parov do naziva mojster spomina!"]],
    en: [["The old chest", "Modra the owl keeps cards in an old chest."], ["The library", "The cards got scattered among the books."], ["Night owl", "At night Modra remembers even more."], ["Memory master", "A few more pairs to become a memory master!"]],
  },
  icon: "grid-2x2",
  colors: ["#4338ca", "#818cf8"],
  options: 4,
  create(G) {
    let cards = [], phase = "show", showT = 0, picks = [], backT = 0;
    const layout = () => {
      const n = cards.length, cols = G.W >= G.H ? 4 : 2, rows = Math.ceil(n / cols), gap = 10;
      const top = 44, w = (G.W - gap * (cols + 1)) / cols, h = Math.min(w * 0.75, (G.H - top - gap * (rows + 1)) / rows);
      const y0 = top + (G.H - top - (h * rows + gap * (rows + 1))) / 2;
      cards.forEach((c, i) => Object.assign(c, { x: gap + (i % cols) * (w + gap), y: y0 + gap + Math.floor(i / cols) * (h + gap), w, h }));
    };
    const flip = (i) => {
      const c = cards[i];
      if (!c || phase !== "play" || G.waiting || c.open || c.done || backT > 0) return;
      c.open = true;
      picks.push(c);
      G.sound("pop");
      if (picks.length < 2) return;
      const [a, b] = picks;
      picks = [];
      if (a.txt !== b.txt) {
        backT = 0.9; // nista par: kartici se obrneta nazaj
        return;
      }
      a.done = b.done = true;
      const ok = G.isRight(a.txt);
      a.bad = b.bad = !ok;
      G.answer(ok, (a.x + b.x) / 2 + a.w / 2, (a.y + b.y) / 2 + a.h / 2, ok ? { delay: 1 } : { keep: true });
    };
    return {
      resize() {
        layout();
      },
      reset() {
        cards = [];
      },
      question() {
        cards = shuffle([...G.opts, ...G.opts]).map((txt) => ({ txt, open: true, done: false, flip: 1 }));
        layout();
        phase = "show";
        showT = (1.8 + G.opts.length * 0.35) / Math.min(1.3, G.speed);
        picks = [];
        backT = 0;
      },
      update(dt) {
        if (phase === "show") {
          showT -= dt;
          if (showT <= 0) {
            phase = "play";
            cards.forEach((c) => (c.open = false));
          }
        }
        if (backT > 0) {
          backT -= dt;
          if (backT <= 0) cards.forEach((c) => !c.done && (c.open = false));
        }
        for (const c of cards) c.flip += ((c.open || c.done ? 1 : 0) - c.flip) * Math.min(1, dt * 12);
      },
      pointer(type, p) {
        if (type !== "down") return;
        const i = cards.findIndex((c) => inRect(p, c));
        if (i >= 0) flip(i);
      },
      key(k, down) {
        const i = numKey(k, cards.length);
        if (!down || i < 0) return false;
        flip(i);
        return true;
      },
      draw(g) {
        const [bg, back, dots] = chap(G, [["#78350f", "#4338ca", "#818cf8"], ["#7c2d12", "#0f766e", "#5eead4"], ["#0f172a", "#6d28d9", "#c4b5fd"], ["#365314", "#be185d", "#f9a8d4"]]);
        g.fillStyle = bg;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = "rgba(255,255,255,0.06)";
        for (let x = 0; x < G.W; x += 28) g.fillRect(x, 0, 2, G.H);
        if (phase === "show") G.fit(`👀 ${Math.ceil(showT)}`, G.W / 2, 24, G.W * 0.6, 20, { color: "#fff", weight: 900, stroke: INK });
        cards.forEach((c, i) => {
          const s = Math.abs(c.flip * 2 - 1) || 0.02, front = c.flip > 0.5;
          g.save();
          g.translate(c.x + c.w / 2, c.y + c.h / 2);
          g.scale(s, 1);
          G.rr(-c.w / 2, -c.h / 2, c.w, c.h, 14);
          g.fillStyle = front ? (c.done ? (c.bad ? "#94a3b8" : "#bbf7d0") : "#fff") : back;
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          if (front) {
            answerText(G, c.txt, 0, 1, c.w - 16, Math.min(24, c.h * 0.3), { color: INK, weight: 900 });
            // najden par: poleg barve še znak ✓ ali ✗ (ne samo barva)
            if (c.done) G.fit(c.bad ? "✗" : "✓", c.w / 2 - 16, -c.h / 2 + 16, 22, 20, { color: c.bad ? "#b91c1c" : "#15803d", weight: 900 });
          } else {
            g.fillStyle = dots;
            for (let k = 0; k < 9; k++) circle(g, ((k % 3) - 1) * c.w * 0.22, (Math.floor(k / 3) - 1) * c.h * 0.22, 4, dots, 0);
            G.fit(`${i + 1}`, 0, 1, 30, Math.min(22, c.h * 0.3), { color: "#fff", weight: 900, stroke: INK });
          }
          g.restore();
        });
      },
    };
  },
};

// ============ REZANJE SADJA: s potegom prsta prereži sadež s pravilnim odgovorom ============
export const slicer = {
  id: "slicer",
  story: {
    sl: [["Sadna tržnica", "Mojster Kiko z nožem reže sadje za sok."], ["Tropski otok", "Kokosi in ananasi letijo visoko."], ["Nočni sejem", "Lučke in sadje v zraku."], ["Sadni velemojster", "Le najhitrejši reže kot Kiko!"]],
    en: [["Fruit market", "Master Kiko slices fruit for juice."], ["Tropical island", "Coconuts and pineapples fly high."], ["Night fair", "Lights and fruit in the air."], ["Fruit grandmaster", "Only the fastest slice like Kiko!"]],
  },
  icon: "cherry",
  colors: ["#7f1d1d", "#ef4444"],
  options: 4,
  create(G) {
    let fruits = [], halves = [], trail = [], waveT = 0, sinceRight = 0, down = false, splats = [];
    const R = () => clamp(Math.min(G.W, G.H) * 0.075, 30, 50);
    const KINDS = [["#ef4444", "#fecaca"], ["#f97316", "#fed7aa"], ["#84cc16", "#d9f99d"], ["#a855f7", "#e9d5ff"], ["#facc15", "#fef9c3"]];
    const wave = () => {
      if (!G.q) return;
      const n = Math.random() < 0.5 ? 2 : 3;
      const right = sinceRight >= 1 || Math.random() < 0.5;
      sinceRight = right ? 0 : sinceRight + 1;
      const wrong = shuffle(G.opts.filter((o) => !G.isRight(o)));
      const list = right ? [G.q.a, ...wrong.slice(0, n - 1)] : wrong.slice(0, n);
      shuffle(list).forEach((txt, i) => {
        const x = G.W * (0.18 + (0.64 * (i + 0.5)) / list.length) + rand(-20, 20);
        // vrh leta okoli tretjine višine, da je napis dobro viden
        const peak = G.H * rand(0.18, 0.34), vy = -Math.sqrt(2 * G.H * 1.1 * (G.H + 40 - peak));
        fruits.push({ x, y: G.H + 40, vx: G.W * rand(-0.04, 0.04), vy, txt, kind: pickOne(KINDS), rot: 0, vr: rand(-2, 2) });
      });
    };
    const slice = (f, dir = 0) => {
      if (f.cut || G.waiting) return;
      f.cut = true;
      const ok = G.isRight(f.txt);
      G.sound("pop");
      if (ok) {
        for (const s of [-1, 1]) halves.push({ x: f.x, y: f.y, vx: f.vx + s * 140, vy: f.vy * 0.3 - 80, rot: f.rot, vr: s * 6, kind: f.kind, side: s, life: 1.4, ang: dir });
        splats.push({ x: f.x, y: f.y, color: f.kind[0], life: 1.2 });
        fruits.forEach((o) => o !== f && (o.cut = true) && (o.fade = true));
        G.answer(true, f.x, f.y, { delay: 0.55 });
      } else {
        f.bad = true;
        G.answer(false, f.x, f.y, { keep: true });
      }
    };
    // presečišče daljice (poteg) s krogom sadeža
    const hits = (a, b, f) => {
      const dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy || 1;
      const t = clamp(((f.x - a.x) * dx + (f.y - a.y) * dy) / l, 0, 1);
      return Math.hypot(a.x + dx * t - f.x, a.y + dy * t - f.y) < R();
    };
    return {
      resize() {},
      reset() {
        fruits = [];
        halves = [];
        splats = [];
      },
      question() {
        fruits = []; // stari sadeži nosijo odgovore prejšnje naloge
        sinceRight = 1;
        waveT = 0.3;
      },
      update(dt) {
        const grav = G.H * 1.1;
        waveT -= dt;
        if (waveT <= 0 && !G.waiting && fruits.filter((f) => !f.cut).length < 2) {
          wave();
          waveT = 1.6 / G.speed;
        }
        const k = Math.min(1.3, G.speed);
        for (const f of fruits) {
          // k pospeši čas (hitrost in težnost), vrh leta ostane enak; s k·k je sadje pri »Počasi« letelo nad zaslon
          f.vy += grav * k * dt;
          f.x += f.vx * k * dt;
          f.y += f.vy * k * dt;
          f.rot += f.vr * dt;
        }
        fruits = fruits.filter((f) => f.y < G.H + 80 && !(f.cut && !f.bad && !f.fade) && !(f.fade && f.y > G.H));
        fruits = fruits.filter((f) => !(f.bad && f.y > G.H + 60));
        for (const h of halves) {
          h.vy += grav * dt;
          h.x += h.vx * dt;
          h.y += h.vy * dt;
          h.rot += h.vr * dt;
          h.life -= dt;
        }
        halves = halves.filter((h) => h.life > 0);
        for (const s of splats) s.life -= dt;
        splats = splats.filter((s) => s.life > 0);
        const now = G.time;
        trail = trail.filter((p) => now - p.t < 0.18);
      },
      pointer(type, p, pressed) {
        if (type === "down") {
          down = true;
          trail = [{ x: p.x, y: p.y, t: G.time }];
          // tap na sadež tudi reže (lažje za mlajše in za miško)
          const f = fruits.find((o) => !o.cut && Math.hypot(o.x - p.x, o.y - p.y) < R());
          if (f) slice(f);
        } else if (type === "move" && (down || pressed)) {
          const last = trail[trail.length - 1] || p;
          trail.push({ x: p.x, y: p.y, t: G.time });
          for (const f of fruits) if (!f.cut && hits(last, p, f)) slice(f, Math.atan2(p.y - last.y, p.x - last.x));
        } else if (type === "up") down = false;
      },
      key(k, isDown) {
        const i = numKey(k, G.opts.length);
        if (!isDown || i < 0) return false;
        const f = fruits.find((o) => !o.cut && o.txt === G.opts[i] && o.y < G.H);
        if (f) slice(f);
        return true;
      },
      draw(g) {
        const [b0, b1, plank] = chap(G, [["#92400e", "#b45309", "rgba(0,0,0,0.15)"], ["#0e7490", "#0891b2", "rgba(255,255,255,0.12)"], ["#1e1b4b", "#312e81", "rgba(255,255,255,0.08)"], ["#7f1d1d", "#b91c1c", "rgba(0,0,0,0.15)"]]);
        sky(G, g, b0, b1);
        g.fillStyle = plank;
        for (let y = 0; y < G.H; y += 56) g.fillRect(0, y, G.W, 3);
        for (const s of splats) {
          g.globalAlpha = clamp(s.life, 0, 0.6);
          circle(g, s.x, s.y, R() * 1.4, s.color, 0);
        }
        g.globalAlpha = 1;
        const r = R();
        for (const f of fruits) {
          g.globalAlpha = f.fade ? 0.35 : 1;
          g.save();
          g.translate(f.x, f.y);
          g.rotate(f.rot);
          circle(g, 0, 0, r, f.bad ? "#64748b" : f.kind[0]);
          circle(g, -r * 0.3, -r * 0.3, r * 0.22, "rgba(255,255,255,0.5)", 0);
          g.fillStyle = "#16a34a";
          g.beginPath();
          g.ellipse(r * 0.2, -r * 0.95, r * 0.35, r * 0.14, -0.4, 0, Math.PI * 2);
          g.fill();
          g.restore();
          // številka tipke (1–4), da se da igrati tudi s tipkovnico
          const key = G.opts.indexOf(f.txt) + 1;
          if (key > 0 && !f.cut) G.fit(`${key}`, f.x, f.y + 1, r, 12, { color: "rgba(27,27,47,0.6)", weight: 900 });
          pill(G, g, f.txt, f.x, f.y + r + 18, G.W * 0.42, 30, f.bad ? "#cbd5e1" : "#fff", 16);
          g.globalAlpha = 1;
        }
        for (const h of halves) {
          g.globalAlpha = clamp(h.life, 0, 1);
          g.save();
          g.translate(h.x, h.y);
          g.rotate(h.rot + h.ang);
          g.beginPath();
          g.arc(0, 0, r, h.side > 0 ? -Math.PI / 2 : Math.PI / 2, h.side > 0 ? Math.PI / 2 : (3 * Math.PI) / 2);
          g.closePath();
          g.fillStyle = h.kind[0];
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          g.beginPath();
          g.arc(0, 0, r * 0.78, h.side > 0 ? -Math.PI / 2 : Math.PI / 2, h.side > 0 ? Math.PI / 2 : (3 * Math.PI) / 2);
          g.closePath();
          g.fillStyle = h.kind[1];
          g.fill();
          g.restore();
        }
        g.globalAlpha = 1;
        // sled noža
        if (trail.length > 1) {
          g.lineCap = "round";
          for (let i = 1; i < trail.length; i++) {
            g.lineWidth = 2 + (i / trail.length) * 8;
            g.strokeStyle = `rgba(255,255,255,${0.3 + (i / trail.length) * 0.6})`;
            g.beginPath();
            g.moveTo(trail[i - 1].x, trail[i - 1].y);
            g.lineTo(trail[i].x, trail[i].y);
            g.stroke();
          }
          g.lineCap = "butt";
        }
      },
    };
  },
};

// ============ KAM TEČE VODA: s prstom izkoplji pot, da voda priteče v korito s pravilnim odgovorom ============
export const water = {
  id: "water",
  story: {
    sl: [["Suha njiva", "Žabica Kapljica čaka vodo za svoj ribnik."], ["Podzemna jama", "Pot vodi zapirajo skale."], ["Gorski izvir", "Voda teče dolgo pot navzdol."], ["Veliki vrt", "Ves vrt čaka na tvoje kanale!"]],
    en: [["Dry field", "Droplet the frog is waiting for water for her pond."], ["Underground cave", "Rocks block the water's way."], ["Mountain spring", "The water runs a long way down."], ["The big garden", "The whole garden is waiting for your channels!"]],
  },
  icon: "droplet",
  colors: ["#075985", "#38bdf8"],
  options: 3,
  create(G) {
    // celice: 0 prazno, 1 zemlja, 2 skala
    let cols = 28, rows = 20, cs = 10, x0 = 0, y0 = 0, cell = [], wet = [], drops = [], tubs = [], emitT = 0, stepT = 0, src = 0;
    const NEED = 18, MAX = 200;
    const idx = (c, r) => r * cols + c;
    const free = (c, r) => c >= 0 && c < cols && r >= 0 && r < rows && !cell[idx(c, r)] && !wet[idx(c, r)];
    // keep: ista mreža (npr. ob manjši spremembi višine zaslona), samo nova velikost celic
    const geom = (keep = false) => {
      const tubH = clamp(G.H * 0.14, 50, 90);
      if (keep) {
        cs = Math.min(G.W / cols, (G.H - tubH - G.H * 0.06) / rows);
        x0 = (G.W - cols * cs) / 2;
      } else {
        cols = G.W >= G.H ? 40 : 26;
        cs = G.W / cols;
        rows = Math.max(12, Math.floor((G.H - tubH - G.H * 0.06) / cs));
        x0 = 0;
      }
      y0 = G.H - tubH - rows * cs;
    };
    // pot, po kateri voda lahko teče (navzdol in vstran, mimo skal) od izvira do sredine korita i
    const route = (i) => {
      const t = tubs[i];
      if (!t) return null;
      const lo = t.c0 + 1, hi = t.c1 - 2, start = idx(src, 0);
      const prev = new Int32Array(cols * rows).fill(-1);
      prev[start] = start;
      const q = [start];
      for (let h = 0; h < q.length; h++) {
        const k = q[h], c = k % cols, r = (k - c) / cols;
        if (r === rows - 1 && c >= lo && c <= hi) {
          const path = [];
          for (let x = k; x !== start; x = prev[x]) path.push(x);
          return path.reverse();
        }
        for (const [dc, dr] of [[0, 1], [-1, 0], [1, 0]]) {
          const C = c + dc, R = r + dr, K = idx(C, R);
          if (C < 0 || C >= cols || R >= rows || prev[K] >= 0 || cell[K] === 2) continue;
          if (R >= rows - 2 && (C < lo || C > hi)) continue; // ob dnu ne čez sosednje korito
          prev[K] = k;
          q.push(K);
        }
      }
      return null;
    };
    const level = () => {
      geom();
      // skale nikoli ne zaprejo poti do korita: sicer polje naredimo znova
      for (let tries = 0; tries < 12; tries++) {
        cell = new Array(cols * rows).fill(1);
        wet = new Array(cols * rows).fill(0);
        drops = [];
        src = Math.floor(cols / 2 + rand(-cols * 0.25, cols * 0.25));
        // jezerce pod izvirom
        for (let r = 0; r < 3; r++) for (let c = src - 2; c <= src + 2; c++) if (c >= 0 && c < cols) cell[idx(c, r)] = 0;
        // skale: kratke prečke z odprtinami, več v višjih poglavjih
        const bars = 2 + Math.min(4, G.chapter || 1);
        for (let b = 0; b < bars; b++) {
          const r = Math.floor(rand(4, rows - 3)), len = Math.floor(rand(cols * 0.12, cols * 0.3)), c0 = Math.floor(rand(0, cols - len));
          for (let c = c0; c < c0 + len; c++) cell[idx(c, r)] = 2;
        }
        const n = G.opts.length, w = cols / n;
        tubs = G.opts.map((txt, i) => ({ txt, c0: Math.round(i * w), c1: Math.round((i + 1) * w), fill: 0, closed: false }));
        if (tubs.every((_, i) => route(i))) break;
      }
    };
    const dig = (p) => {
      const c = (p.x - x0) / cs, r = (p.y - y0) / cs, rad = Math.max(1.4, 18 / cs);
      for (let rr = Math.floor(r - rad); rr <= r + rad; rr++)
        for (let cc = Math.floor(c - rad); cc <= c + rad; cc++)
          if (cc >= 0 && cc < cols && rr >= 0 && rr < rows && cell[idx(cc, rr)] === 1 && Math.hypot(cc + 0.5 - c, rr + 0.5 - r) <= rad) cell[idx(cc, rr)] = 0;
    };
    // tipkovnica: izkoplji pot od izvira do korita i
    const digTo = (i) => {
      const t = tubs[i];
      if (!t || t.closed) return;
      const path = route(i);
      if (path) {
        for (const k of path) dig({ x: x0 + ((k % cols) + 0.5) * cs, y: y0 + (Math.floor(k / cols) + 0.5) * cs });
        return;
      }
      const tc = (t.c0 + t.c1) / 2;
      for (let r = 0; r < rows; r++) {
        const c = src + ((tc - src) * r) / rows;
        dig({ x: x0 + (c + 0.5) * cs, y: y0 + (r + 0.5) * cs });
      }
    };
    const step = () => {
      // kapljice od spodaj navzgor: navzdol, poševno, vstran
      drops.sort((a, b) => b.r - a.r);
      for (const d of drops) {
        const { c, r } = d;
        if (r === rows - 1) {
          const t = tubs.find((x) => c >= x.c0 && c < x.c1);
          if (t && !t.closed) {
            wet[idx(c, r)] = 0;
            d.gone = true;
            t.fill++;
            continue;
          }
        }
        const dir = Math.random() < 0.5 ? -1 : 1;
        const moves = [[0, 1], [dir, 1], [-dir, 1], [dir, 0], [-dir, 0]];
        for (const [dc, dr] of moves) {
          if (free(c + dc, r + dr)) {
            wet[idx(c, r)] = 0;
            d.c = c + dc;
            d.r = r + dr;
            wet[idx(d.c, d.r)] = 1;
            break;
          }
        }
      }
      drops = drops.filter((d) => !d.gone);
    };
    return {
      resize() {
        // ista usmerjenost: izkopana pot ostane; nova usmerjenost: novo polje
        if (G.q && cell.length === cols * rows && (G.W >= G.H ? 40 : 26) === cols) geom(true);
        else if (G.q) level();
      },
      reset() {
        drops = [];
        tubs = [];
      },
      question() {
        level();
      },
      update(dt) {
        if (!G.q || G.waiting) return;
        emitT -= dt;
        if (emitT <= 0 && drops.length < MAX && free(src, 0)) {
          drops.push({ c: src, r: 0 });
          wet[idx(src, 0)] = 1;
          emitT = 0.045;
        }
        stepT += dt;
        while (stepT > 1 / 40) {
          stepT -= 1 / 40;
          step();
        }
        const full = tubs.find((t) => !t.closed && t.fill >= NEED);
        if (!full) return;
        const x = x0 + ((full.c0 + full.c1) / 2) * cs, y = G.H - 30;
        if (G.isRight(full.txt)) {
          G.float(x, y - 40, "🐸", "#16a34a", 30);
          G.answer(true, x, y, { delay: 1 });
        } else {
          full.closed = true;
          // voda odteče, korito se zapre; poskusi znova
          drops.forEach((d) => (wet[idx(d.c, d.r)] = 0));
          drops = [];
          tubs.forEach((t) => (t.fill = 0));
          G.answer(false, x, y, { keep: true });
        }
      },
      pointer(type, p, pressed) {
        if (type === "down" || (type === "move" && pressed)) dig(p);
      },
      key(k, down) {
        const i = numKey(k, tubs.length);
        if (!down || i < 0) return false;
        digTo(i);
        return true;
      },
      draw(g) {
        const [s0, s1, dirt, dirt2, rock] = chap(G, [["#bae6fd", "#e0f2fe", "#a16207", "#854d0e", "#78716c"], ["#1e293b", "#334155", "#57534e", "#44403c", "#a8a29e"], ["#c7d2fe", "#eef2ff", "#92400e", "#78350f", "#64748b"], ["#bbf7d0", "#f0fdf4", "#a16207", "#713f12", "#6b7280"]]);
        sky(G, g, s0, s1);
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const v = cell[idx(c, r)];
            if (!v) continue;
            g.fillStyle = v === 2 ? rock : (c + r) % 3 ? dirt : dirt2;
            g.fillRect(x0 + c * cs, y0 + r * cs, cs + 0.5, cs + 0.5);
          }
        g.fillStyle = "#38bdf8";
        for (const d of drops) g.fillRect(x0 + d.c * cs, y0 + d.r * cs, cs + 0.5, cs + 0.5);
        // izvir (cev)
        const sx = x0 + (src + 0.5) * cs;
        g.fillStyle = "#64748b";
        g.fillRect(sx - cs * 1.2, y0 - cs * 2.2, cs * 2.4, cs * 2.2);
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.strokeRect(sx - cs * 1.2, y0 - cs * 2.2, cs * 2.4, cs * 2.2);
        // korita z odgovori
        const ty = y0 + rows * cs, th = G.H - ty;
        tubs.forEach((t, i) => {
          const x = x0 + t.c0 * cs + 4, w = (t.c1 - t.c0) * cs - 8;
          G.rr(x, ty + 4, w, th - 10, 10);
          g.fillStyle = t.closed ? "#94a3b8" : "#f8fafc";
          g.fill();
          if (!t.closed && t.fill) {
            const h = (th - 14) * Math.min(1, t.fill / NEED);
            g.fillStyle = "#38bdf8";
            g.fillRect(x + 3, ty + th - 8 - h, w - 6, h);
          }
          G.rr(x, ty + 4, w, th - 10, 10);
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          // številka tipke zgoraj levo, odgovor nižje čez vso širino (dolg odgovor v dveh vrsticah)
          answerText(G, t.txt, x + w / 2, ty + th / 2 + 4, w - 12, Math.min(22, th * 0.32), { color: INK, weight: 900 });
          G.fit(`${i + 1}`, x + 13, ty + 18, 20, 12, { color: "rgba(27,27,47,0.55)", weight: 900 });
          if (t.closed) G.fit("✗", x + w - 14, ty + 18, 20, 18, { color: "#b91c1c", weight: 900 }); // zaprto korito: ne samo siva barva
        });
      },
    };
  },
};

// ============ MINOLOVEC: pravilni odgovori napolnijo detektor, ki pokaže mine; odpri vsa varna polja ============
export const mines = {
  id: "mines",
  story: {
    sl: [["Staro polje", "Robotek Bit preiskuje polje s skritimi minami."], ["Peščena puščava", "Pod peskom nekaj tiktaka."], ["Zasneženo polje", "Mine so skrite pod snegom."], ["Zadnje polje", "Še eno polje do Bitovega odlikovanja!"]],
    en: [["Old field", "Bit the robot searches a field with hidden mines."], ["Sandy desert", "Something ticks under the sand."], ["Snowy field", "The mines are hidden under the snow."], ["The last field", "One more field and Bit gets a medal!"]],
  },
  icon: "bomb",
  colors: ["#3f3f46", "#a1a1aa"],
  options: 4,
  create(G) {
    let n = 6, board = [], btns = [], flagMode = false, boom = 0, cleared = 0, charge = 0, flagBtn = null, gx = 0, gy = 0, cs = 30;
    const at = (c, r) => (c >= 0 && r >= 0 && c < n && r < n ? board[r * n + c] : null);
    const around = (c, r) => [-1, 0, 1].flatMap((dr) => [-1, 0, 1].map((dc) => (dc || dr ? at(c + dc, r + dr) : null))).filter(Boolean);
    const newBoard = () => {
      n = (G.chapter || 1) >= 3 ? 7 : 6;
      const mines = Math.round(n * n * 0.17);
      board = Array.from({ length: n * n }, (_, i) => ({ c: i % n, r: Math.floor(i / n), mine: false, open: false, flag: false, adj: 0 }));
      shuffle(board).slice(0, mines).forEach((x) => (x.mine = true));
      board.forEach((x) => (x.adj = around(x.c, x.r).filter((o) => o.mine).length));
      boom = 0;
    };
    const layout = () => {
      const bh = clamp(G.H * 0.1, 44, 64), area = G.H - bh * 2 - 52;
      cs = Math.floor(Math.min((G.W - 20) / n, area / n));
      gx = (G.W - cs * n) / 2;
      gy = 32 + (area - cs * n) / 2;
      const m = G.opts.length, gap = 8, fw = bh;
      const top = G.H - bh * 2 - 12;
      const two = G.W < 560, cols = two ? 2 : m, rows = Math.ceil(m / cols);
      const w = (G.W - fw - gap * (cols + 2)) / cols, h = (bh * 2 + 4 - gap * (rows - 1)) / rows;
      btns = G.opts.map((txt, i) => ({ txt, x: gap + (i % cols) * (w + gap), y: top + Math.floor(i / cols) * (h + gap), w, h }));
      flagBtn = { x: G.W - fw - gap, y: top, w: fw, h: bh * 2 + 4 };
    };
    const open = (x) => {
      if (!x || x.open || x.flag) return;
      x.open = true;
      if (x.mine) return;
      if (x.adj === 0) around(x.c, x.r).forEach(open);
    };
    const checkWin = () => {
      if (board.some((x) => !x.mine && !x.open)) return;
      cleared++;
      G.float(G.W / 2, gy + (cs * n) / 2, "🏅", "#f59e0b", 40, 1.4);
      G.sound("up");
      newBoard();
      layout();
    };
    const tapCell = (x) => {
      if (!x || x.open || boom > 0) return;
      if (flagMode) {
        x.flag = !x.flag;
        return;
      }
      if (x.flag) return;
      // odpiranje porabi naboj detektorja; naboj dajo le pravilni odgovori
      if (charge <= 0) {
        G.float(gx + (x.c + 0.5) * cs, gy + (x.r + 0.5) * cs, "⚡ 0", "#f59e0b", 22, 0.9);
        return;
      }
      charge--;
      if (x.mine) {
        // mina: polje se podre, začneš znova (življenje ostane, izgubiš napredek)
        x.open = true;
        boom = 1.2;
        G.shake(12);
        G.sound("bad");
        G.burst(gx + (x.c + 0.5) * cs, gy + (x.r + 0.5) * cs, "#ef4444", 24);
        return;
      }
      open(x);
      checkWin();
    };
    // pravilen odgovor: detektor pokaže eno mino in odpre varno polje
    const detect = () => {
      const hidden = board.filter((x) => x.mine && !x.flag);
      if (hidden.length) pickOne(hidden).flag = true;
      const safe = board.filter((x) => !x.mine && !x.open);
      const zero = safe.filter((x) => x.adj === 0);
      const s = pickOne(zero.length ? zero : safe);
      if (s) {
        s.flag = false; // napačno postavljena zastavica na varnem polju ne sme ustaviti detektorja
        open(s);
      }
    };
    const choose = (b) => {
      if (!b || G.waiting || boom > 0) return;
      const ok = G.isRight(b.txt);
      if (ok) {
        detect();
        charge += 2;
      }
      G.answer(ok, b.x + b.w / 2, b.y, ok ? { delay: 0.5 } : { keep: true });
      if (ok) checkWin();
    };
    return {
      resize() {
        if (board.length) layout();
      },
      reset() {
        cleared = 0;
        charge = 0;
        btns = [];
        newBoard();
      },
      question() {
        if (!board.length) newBoard();
        layout();
      },
      update(dt) {
        if (boom > 0) {
          boom -= dt;
          if (boom <= 0) {
            newBoard();
            layout();
          }
        }
      },
      pointer(type, p) {
        if (type !== "down") return;
        if (flagBtn && inRect(p, flagBtn)) return void (flagMode = !flagMode);
        const b = btns.find((x) => inRect(p, x));
        if (b) return choose(b);
        const c = Math.floor((p.x - gx) / cs), r = Math.floor((p.y - gy) / cs);
        tapCell(at(c, r));
      },
      key(k, down) {
        if (!down) return false;
        if (k === "f" || k === "F") {
          flagMode = !flagMode;
          return true;
        }
        const i = numKey(k, btns.length);
        if (i < 0) return false;
        choose(btns[i]);
        return true;
      },
      draw(g) {
        const [bg, hid, hid2, opened] = chap(G, [["#365314", "#65a30d", "#4d7c0f", "#d9f99d"], ["#92400e", "#f59e0b", "#d97706", "#fef3c7"], ["#334155", "#e2e8f0", "#cbd5e1", "#f8fafc"], ["#1e1b4b", "#6366f1", "#4f46e5", "#e0e7ff"]]);
        g.fillStyle = bg;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        const NUM = ["", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#b45309", "#0891b2", "#111827", "#6b7280"];
        for (const x of board) {
          const px = gx + x.c * cs, py = gy + x.r * cs;
          g.fillStyle = x.open ? (x.mine ? "#ef4444" : opened) : (x.c + x.r) % 2 ? hid : hid2;
          g.fillRect(px, py, cs, cs);
          g.lineWidth = 1.5;
          g.strokeStyle = "rgba(27,27,47,0.35)";
          g.strokeRect(px, py, cs, cs);
          const cx = px + cs / 2, cy = py + cs / 2;
          if (x.open && x.mine) {
            circle(g, cx, cy, cs * 0.28, INK, 0);
            G.fit("✸", cx, cy + 1, cs, cs * 0.5, { color: "#fde047", weight: 900 });
          } else if (x.open && x.adj) G.fit(`${x.adj}`, cx, cy + 1, cs, cs * 0.55, { color: NUM[x.adj], weight: 900 });
          else if (x.flag) G.fit("🚩", cx, cy + 1, cs, cs * 0.55, {});
        }
        g.lineWidth = 3;
        g.strokeStyle = INK;
        g.strokeRect(gx, gy, cs * n, cs * n);
        if (flagMode) {
          // način zastavic: črtkan rob okoli polja (ne samo rumena barva gumba)
          g.setLineDash([10, 6]);
          g.lineWidth = 5;
          g.strokeStyle = "#fde047";
          g.strokeRect(gx - 5, gy - 5, cs * n + 10, cs * n + 10);
          g.setLineDash([]);
        }
        btns.forEach((b, i) => {
          G.rr(b.x, b.y, b.w, b.h, 12);
          g.fillStyle = NEON[i % NEON.length];
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = INK;
          g.stroke();
          answerText(G, b.txt, b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 26, Math.min(20, b.h * 0.42), { color: INK, weight: 900 });
          G.fit(`${i + 1}`, b.x + 12, b.y + 13, 18, 11, { color: "rgba(27,27,47,0.55)", weight: 900 });
        });
        if (flagBtn) {
          G.rr(flagBtn.x, flagBtn.y, flagBtn.w, flagBtn.h, 12);
          g.fillStyle = flagMode ? "#fde047" : "#e5e7eb";
          g.fill();
          g.lineWidth = flagMode ? 6 : 3;
          g.strokeStyle = INK;
          g.stroke();
          G.fit("🚩", flagBtn.x + flagBtn.w / 2, flagBtn.y + flagBtn.h / 2, flagBtn.w - 8, 24, {});
        }
        if (cleared) G.fit(`🏅 ${cleared}`, G.W - 34, 18, 60, 15, { color: "#fff", weight: 900, stroke: INK });
        // naboj detektorja: koliko polj lahko še odpreš
        G.fit(`⚡ ${charge}`, 34, 18, 60, 16, { color: charge ? "#fde047" : "#fff", weight: 900, stroke: INK });
      },
    };
  },
};

export const FUN_GAMES = [diner, hills, pet, catcher, pairs, slicer, water, mines];

// Pomožne risbe za igre v retro.js.
export { rand, clamp, shuffle, INK, chap, inRect, numKey, circle, pill, answerText, face, sky };
