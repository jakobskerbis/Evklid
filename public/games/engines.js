// Vrste iger. Vsaka igra dobi G iz core.js (velikost, naloga, možnosti, G.answer …) in vrne
// { question, update, draw, pointer, key, resize, reset }. Izvirne igre; navdih je žanr (strelec, tekač …).

import { ARCADE } from "./arcade.js";
import { BUILD_GAMES } from "./build.js";
import { ARCADE2 } from "./arcade2.js";
import { SENSOR_GAMES } from "./sensors.js";
import { FUN_GAMES } from "./fun.js";
import { RETRO_GAMES } from "./retro.js";
import { DEDUCTION_GAMES } from "./deduction.js";
import { PRODUCE_GAMES } from "./produce.js";
import { PRODUCE2_GAMES } from "./produce2.js";
import { statement } from "./topics.js";

export { statement };

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const INK = "#1b1b2f";
const chap = (G, list) => list[Math.min(list.length, G.chapter || 1) - 1];
// Sončni žarki v ozadju, kot na naslovnicah starih Flash iger.
function sunburst(g, G, cx, cy, color, n = 16) {
  const R = Math.hypot(G.W, G.H);
  g.fillStyle = color;
  const rot = G.reduced ? 0 : G.time * 0.08;
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    g.beginPath();
    g.moveTo(cx, cy);
    g.arc(cx, cy, R, a, a + Math.PI / n);
    g.closePath();
    g.fill();
  }
}
const ink = (g, w = 3) => {
  g.lineWidth = w;
  g.strokeStyle = INK;
  g.lineJoin = "round";
  g.stroke();
};
const BRIGHT = ["#fde047", "#fca5a5", "#86efac", "#93c5fd", "#f9a8d4", "#fdba74", "#c4b5fd", "#67e8f9"];

// ============ METEORJI: ladja sestreli meteor s pravilnim odgovorom, preden pade na ščit ============
export const meteor = {
  id: "meteor",
  story: {"sl": [["Meteorski dež", "Kapitanka Vega brani postajo Delta pred meteorji."], ["Asteroidni pas", "Vega leti skozi asteroidni pas."], ["Kometov rep", "Za kometom letijo ledeni kamni."], ["Domov", "Postaja Delta je že blizu!"]], "en": [["Meteor shower", "Captain Vega defends station Delta from meteors."], ["The asteroid belt", "Vega flies through the asteroid belt."], ["The comet's tail", "Icy rocks trail behind a comet."], ["Homeward", "Station Delta is close!"]]},
  icon: "zap",
  colors: ["#1e1b4b", "#6d28d9"],
  options: 4,
  create(G) {
    let stars = [], rocks = [], laser = null, sel = 0;
    const ship = { x: 0, tx: 0 };
    const shield = () => G.H - 64;
    const shape = () => Array.from({ length: 10 }, () => rand(0.82, 1.08));
    return {
      resize() {
        stars = Array.from({ length: 80 }, () => ({ x: Math.random() * G.W, y: Math.random() * G.H, s: rand(0.4, 1.8), v: rand(8, 40) }));
        ship.x = ship.tx = G.W / 2;
      },
      reset() {
        rocks = [];
        laser = null;
      },
      question() {
        const n = G.opts.length, lane = G.W / n;
        rocks = G.opts.map((txt, i) => {
          const r = clamp(G.tw(txt, 20) / 2 + 16, 30, lane / 2 - 3);
          return { txt, x: lane * (i + 0.5) + rand(-0.1, 0.1) * lane, y: -r - rand(0, 70), r, vy: (G.H / 11) * G.speed * rand(0.92, 1.08), rot: rand(0, 6), vr: rand(-0.8, 0.8), shape: shape(), state: "fly", a: 1 };
        });
        sel = 0;
      },
      update(dt) {
        for (const s of stars) {
          s.y += s.v * dt * G.speed;
          if (s.y > G.H) (s.y = 0), (s.x = Math.random() * G.W);
        }
        ship.x += (ship.tx - ship.x) * Math.min(1, dt * 12);
        for (const r of rocks) {
          r.rot += r.vr * dt;
          if (r.state === "fly") {
            r.y += r.vy * dt;
            if (r.y + r.r * 0.6 > shield() && !G.waiting) {
              if (G.isRight(r.txt)) {
                rocks.forEach((o) => (o.state = "fade"));
                G.burst(r.x, shield(), "#f97316", 16);
                G.miss(r.x, shield());
              } else r.state = "fade";
            }
          } else {
            r.a -= dt * 3;
            r.y += r.vy * dt * 0.3;
          }
        }
        rocks = rocks.filter((r) => r.a > 0);
        if (laser) laser.life -= dt;
      },
      fire(r) {
        if (G.waiting || r.state !== "fly") return;
        ship.tx = r.x;
        laser = { x: r.x, y: r.y, life: 0.18 };
        const ok = G.isRight(r.txt);
        rocks.forEach((o) => o !== r && (o.state = "fade"));
        r.state = "fade";
        r.a = 0.01;
        G.burst(r.x, r.y, ok ? "#fde047" : "#ef4444", 22);
        G.answer(ok, r.x, r.y);
      },
      pointer(type, p) {
        if (type !== "down") return;
        let best = null, bd = 1e9;
        for (const r of rocks) {
          const d = Math.hypot(p.x - r.x, p.y - r.y);
          if (r.state === "fly" && d < r.r + 18 && d < bd) (best = r), (bd = d);
        }
        if (best) this.fire(best);
      },
      key(k, down) {
        if (!down) return false;
        G.keyUsed = true;
        const live = rocks.filter((r) => r.state === "fly").sort((a, b) => a.x - b.x);
        if (/^[1-9]$/.test(k) && live[k - 1]) return this.fire(live[k - 1]), true;
        if (k === "ArrowLeft" || k === "ArrowRight") {
          sel = clamp(sel + (k === "ArrowLeft" ? -1 : 1), 0, Math.max(0, live.length - 1));
          if (live[sel]) ship.tx = live[sel].x;
          return true;
        }
        if ((k === " " || k === "Enter" || k === "ArrowUp") && live[sel]) return this.fire(live[sel]), true;
        return false;
      },
      draw(g) {
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        const [c0, c1, pl] = chap(G, [["#0b1026", "#2a1458", "#f472b6"], ["#1a0b2e", "#4a1d5c", "#fb923c"], ["#06283d", "#1b5e7a", "#a3e635"], ["#0f172a", "#7c2d12", "#38bdf8"]]);
        grd.addColorStop(0, c0);
        grd.addColorStop(1, c1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        g.fillStyle = "#fff";
        for (const s of stars) {
          g.globalAlpha = 0.4 + s.s / 3;
          g.fillRect(s.x, s.y, s.s, s.s);
        }
        g.globalAlpha = 1;
        // planet v ozadju (barva se zamenja s poglavjem)
        const pr = Math.min(G.W, G.H) * 0.16;
        g.save();
        g.translate(G.W * 0.82, G.H * 0.22);
        g.fillStyle = pl;
        g.beginPath();
        g.arc(0, 0, pr, 0, 7);
        g.fill();
        ink(g, 4);
        g.fillStyle = "rgba(255,255,255,0.25)";
        g.beginPath();
        g.arc(-pr * 0.35, -pr * 0.35, pr * 0.35, 0, 7);
        g.fill();
        g.beginPath();
        g.ellipse(0, 0, pr * 1.6, pr * 0.35, -0.35, 0.2, Math.PI - 0.2);
        ink(g, 4);
        g.restore();
        // ščit
        g.strokeStyle = "rgba(103,232,249,0.55)";
        g.lineWidth = 3;
        g.setLineDash([10, 8]);
        g.beginPath();
        g.moveTo(0, shield());
        g.lineTo(G.W, shield());
        g.stroke();
        g.setLineDash([]);
        // meteorji
        const live = rocks.filter((r) => r.state === "fly").sort((a, b) => a.x - b.x);
        rocks.forEach((r) => {
          g.save();
          g.globalAlpha = Math.max(0, r.a);
          g.translate(r.x, r.y);
          if (live[sel] === r && G.keyUsed) {
            g.strokeStyle = "#fde047";
            g.lineWidth = 3;
            g.beginPath();
            g.arc(0, 0, r.r + 8, 0, Math.PI * 2);
            g.stroke();
          }
          g.rotate(r.rot);
          g.beginPath();
          r.shape.forEach((k, i) => {
            const a = (i / r.shape.length) * Math.PI * 2;
            g[i ? "lineTo" : "moveTo"](Math.cos(a) * r.r * k, Math.sin(a) * r.r * k);
          });
          g.closePath();
          g.fillStyle = "#c08457";
          g.fill();
          ink(g, 4);
          g.fillStyle = "rgba(124,74,36,0.35)";
          [[-0.4, -0.35, 0.18], [0.35, 0.3, 0.14], [0.3, -0.45, 0.1]].forEach(([cx, cy, cr]) => {
            g.beginPath();
            g.arc(cx * r.r, cy * r.r, cr * r.r, 0, Math.PI * 2);
            g.fill();
          });
          g.rotate(-r.rot);
          g.fillStyle = "#fffbeb";
          G.rr(-r.r * 0.86, -13, r.r * 1.72, 26, 9);
          g.fill();
          ink(g, 2.5);
          G.fit(r.txt, 0, 1, r.r * 1.6, 19, { color: "#1f1235" });
          g.restore();
        });
        // laser in ladja
        const sy = G.H - 34;
        if (laser && laser.life > 0) {
          g.strokeStyle = "#67e8f9";
          g.lineWidth = 4;
          g.globalAlpha = laser.life / 0.18;
          g.beginPath();
          g.moveTo(ship.x, sy - 16);
          g.lineTo(laser.x, laser.y);
          g.stroke();
          g.globalAlpha = 1;
        }
        g.save();
        g.translate(ship.x, sy);
        g.fillStyle = "#f97316";
        g.beginPath();
        g.moveTo(-7, 14);
        g.lineTo(0, 22 + Math.sin(G.time * 30) * 4);
        g.lineTo(7, 14);
        g.fill();
        g.fillStyle = "#e0e7ff";
        g.beginPath();
        g.moveTo(0, -20);
        g.lineTo(18, 14);
        g.lineTo(0, 8);
        g.lineTo(-18, 14);
        g.closePath();
        g.fill();
        ink(g, 3);
        g.fillStyle = "#6366f1";
        g.beginPath();
        g.arc(0, -2, 5, 0, Math.PI * 2);
        g.fill();
        g.restore();
      },
    };
  },
};

// ============ BALONI: iz roja balonov poči tistega s pravilnim odgovorom ============
export const balloons = {
  id: "balloons",
  story: {"sl": [["Sejem balonov", "Balonar Bor je pomešal napise na balonih."], ["Veter z gora", "Veter odnaša balone čez travnik."], ["Nad oblaki", "Bor se z balonom dvigne nad oblake."], ["Velika parada", "Ves kraj gleda balonsko parado!"]], "en": [["Balloon fair", "Bor the balloon maker mixed up the labels."], ["Mountain wind", "The wind blows the balloons across the meadow."], ["Above the clouds", "Bor rises above the clouds."], ["The grand parade", "The whole town watches the balloon parade!"]]},
  icon: "party-popper",
  colors: ["#075985", "#0284c7"],
  options: 4,
  timer: 18,
  create(G) {
    let list = [], clouds = [], spawnT = 0, sinceRight = 0, sel = -1;
    const make = () => {
      const right = sinceRight >= 2 || Math.random() < 0.32;
      const txt = right ? G.q.a : pickOne(G.opts.filter((o) => !G.isRight(o)));
      sinceRight = right ? 0 : sinceRight + 1;
      const r = clamp(G.tw(txt, 19) / 2 + 14, 30, Math.min(64, G.W / 5));
      list.push({ txt, r, x: rand(r + 4, G.W - r - 4), y: G.H + r + 30, vy: -(G.H / 9) * G.speed * rand(0.85, 1.15), ph: rand(0, 6), color: pickOne(BRIGHT), state: "fly", a: 1 });
    };
    return {
      resize() {
        clouds = Array.from({ length: 5 }, (_, i) => ({ x: rand(0, G.W), y: rand(20, G.H * 0.6), s: rand(0.6, 1.3), v: rand(6, 16) * (i % 2 ? 1 : -1) }));
      },
      reset() {
        list = [];
        spawnT = 0;
      },
      question() {
        list.forEach((b) => (b.state = "away"));
        spawnT = 0.1;
        sinceRight = 1;
      },
      update(dt) {
        for (const c of clouds) {
          c.x += c.v * dt;
          if (c.x < -120) c.x = G.W + 100;
          if (c.x > G.W + 120) c.x = -100;
        }
        if (!G.waiting && G.q) {
          spawnT -= dt;
          if (spawnT <= 0) {
            make();
            spawnT = 1.15 / G.speed;
          }
        }
        for (const b of list) {
          b.ph += dt * 2;
          if (b.state === "fly") b.y += b.vy * dt;
          else if (b.state === "away") (b.y += b.vy * dt * 2.5), (b.a -= dt * 1.5);
          else b.a -= dt * 4;
        }
        list = list.filter((b) => b.a > 0 && b.y > -b.r * 3);
      },
      pop(b) {
        if (G.waiting || b.state !== "fly") return;
        b.state = "pop";
        const ok = G.isRight(b.txt);
        G.burst(b.x, b.y, ok ? b.color : "#ef4444", ok ? 26 : 12);
        G.sound("pop");
        G.answer(ok, b.x, b.y, { keep: true });
      },
      pointer(type, p) {
        if (type !== "down") return;
        const hit = list.filter((b) => b.state === "fly" && Math.hypot((p.x - (b.x + Math.sin(b.ph) * 6)) / 1, (p.y - b.y) / 1.15) < b.r + 12).sort((a, b) => a.y - b.y)[0];
        if (hit) this.pop(hit);
      },
      key(k, down) {
        if (!down) return false;
        const live = list.filter((b) => b.state === "fly" && b.y < G.H && b.y > 0).sort((a, b) => a.x - b.x);
        if (!live.length) return false;
        if (k === "ArrowLeft" || k === "ArrowRight" || k === "Tab") {
          sel = (sel + (k === "ArrowLeft" ? -1 : 1) + live.length) % live.length;
          live.forEach((b, i) => (b.focus = i === sel));
          return true;
        }
        if (k === " " || k === "Enter") {
          const f = live.find((b) => b.focus) || live[0];
          this.pop(f);
          return true;
        }
        return false;
      },
      draw(g) {
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        const [s0, s1, gr] = chap(G, [["#38bdf8", "#e0f2fe", "#4ade80"], ["#0ea5e9", "#bae6fd", "#22c55e"], ["#1e40af", "#60a5fa", "#86efac"], ["#f97316", "#fde68a", "#65a30d"]]);
        grd.addColorStop(0, s0);
        grd.addColorStop(1, s1);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        sunburst(g, G, G.W / 2, G.H * 1.05, "rgba(255,255,255,0.12)");
        for (const c of clouds) {
          g.beginPath();
          g.arc(c.x, c.y, 26 * c.s, 0, 7);
          g.arc(c.x + 28 * c.s, c.y - 10 * c.s, 32 * c.s, 0, 7);
          g.arc(c.x + 60 * c.s, c.y, 24 * c.s, 0, 7);
          g.fillStyle = "#ffffff";
          g.fill();
          g.lineWidth = 3;
          g.strokeStyle = "rgba(27,27,47,0.25)";
          g.stroke();
          g.fill();
        }
        // trava
        g.fillStyle = gr;
        g.fillRect(-20, G.H - 18, G.W + 40, 40);
        g.beginPath();
        g.moveTo(-20, G.H - 18);
        g.lineTo(G.W + 20, G.H - 18);
        ink(g, 3);
        for (const b of list) {
          const x = b.x + Math.sin(b.ph) * 6;
          g.globalAlpha = Math.max(0, b.a);
          g.strokeStyle = "rgba(30,41,59,0.5)";
          g.lineWidth = 1.5;
          g.beginPath();
          g.moveTo(x, b.y + b.r * 1.15);
          g.quadraticCurveTo(x + Math.sin(b.ph + 1) * 10, b.y + b.r * 1.15 + 25, x, b.y + b.r * 1.15 + 50);
          g.stroke();
          g.fillStyle = b.color;
          g.beginPath();
          g.ellipse(x, b.y, b.r, b.r * 1.15, 0, 0, Math.PI * 2);
          g.fill();
          ink(g, 3);
          g.beginPath();
          g.moveTo(x - 6, b.y + b.r * 1.15 + 6);
          g.lineTo(x + 6, b.y + b.r * 1.15 + 6);
          g.lineTo(x, b.y + b.r * 1.1);
          g.fill();
          g.fillStyle = "rgba(255,255,255,0.55)";
          g.beginPath();
          g.ellipse(x - b.r * 0.4, b.y - b.r * 0.5, b.r * 0.18, b.r * 0.3, -0.5, 0, Math.PI * 2);
          g.fill();
          if (b.focus) {
            g.strokeStyle = "#1e3a8a";
            g.lineWidth = 3;
            g.beginPath();
            g.ellipse(x, b.y, b.r + 6, b.r * 1.15 + 6, 0, 0, Math.PI * 2);
            g.stroke();
          }
          G.fit(b.txt, x, b.y, b.r * 1.75, 19, { color: INK, weight: 900, stroke: "#ffffff", sw: 4 });
        }
        g.globalAlpha = 1;
      },
    };
  },
};

// ============ TEKAČ: v pravem trenutku zavij na stezo s pravilnim odgovorom ============
export const runner = {
  id: "runner",
  story: {"sl": [["Start v dolini", "Tekačica Lina teče na vrh gore."], ["Gozdna steza", "Pot vodi skozi gozd."], ["Puščavski most", "Čez puščavo vodi dolg most."], ["Cilj na vrhu", "Vrh je čisto blizu!"]], "en": [["Start in the valley", "Lina the runner races to the mountain top."], ["Forest trail", "The trail goes through a forest."], ["Desert bridge", "A long bridge crosses the desert."], ["Finish at the top", "The peak is close!"]]},
  icon: "flag",
  colors: ["#14532d", "#15803d"],
  options: 3,
  create(G) {
    let lane = 1, px = 0, gate = null, dash = 0, trees = [], start = null;
    const lw = () => Math.min(G.W / 3.15, 170);
    const lx = (i) => G.W / 2 + (i - 1) * lw();
    const py = () => G.H - 70;
    const move = (d) => (lane = clamp(lane + d, 0, 2));
    return {
      resize() {
        px = lx(lane);
        trees = Array.from({ length: 10 }, (_, i) => ({ side: i % 2, y: (i / 10) * G.H, k: rand(0.7, 1.2) }));
      },
      reset() {
        lane = 1;
        gate = null;
      },
      question() {
        gate = { y: -70, opts: [...G.opts], done: false, a: 1 };
      },
      update(dt) {
        const v = (G.H * 0.62) / 6.5 * G.speed;
        dash = (dash + v * dt) % 60;
        px += (lx(lane) - px) * Math.min(1, dt * 14);
        for (const t of trees) {
          t.y += v * dt;
          if (t.y > G.H + 40) t.y = -40;
        }
        if (gate) {
          gate.y += v * dt;
          if (!gate.done && gate.y >= py() - 18) {
            gate.done = true;
            const ok = G.isRight(gate.opts[lane]);
            if (!ok) gate.hit = lane;
            G.answer(ok, lx(lane), py() - 30);
          }
          if (gate.done) gate.a -= dt * 1.6;
          if (gate.a <= 0) gate = null;
        }
      },
      pointer(type, p) {
        if (type === "down") start = p;
        if (type === "up" && start) {
          const dx = p.x - start.x;
          if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1);
          else {
            // dotik steze: skoči nanjo
            let best = 0;
            for (let i = 1; i < 3; i++) if (Math.abs(p.x - lx(i)) < Math.abs(p.x - lx(best))) best = i;
            lane = best;
          }
          start = null;
        }
      },
      key(k, down) {
        if (!down) return false;
        if (k === "ArrowLeft" || k === "a" || k === "A") return move(-1), true;
        if (k === "ArrowRight" || k === "d" || k === "D") return move(1), true;
        if (/^[1-3]$/.test(k)) return (lane = Number(k) - 1), true;
        return false;
      },
      draw(g) {
        const [grass, road, tree] = chap(G, [["#4ade80", "#d6b98c", "#15803d"], ["#166534", "#a16207", "#052e16"], ["#fbbf24", "#fde68a", "#65a30d"], ["#e2e8f0", "#94a3b8", "#0f766e"]]);
        g.fillStyle = grass;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        const L = lx(0) - lw() / 2, R = lx(2) + lw() / 2;
        // drevesa
        for (const t of trees) {
          const x = t.side ? R + (G.W - R) / 2 : L / 2;
          if ((t.side ? G.W - R : L) < 30) continue;
          g.fillStyle = tree;
          g.beginPath();
          g.arc(x, t.y, 18 * t.k, 0, 7);
          g.fill();
          ink(g, 3);
          g.fillStyle = "#166534";
          g.beginPath();
          g.arc(x + 5, t.y - 4, 10 * t.k, 0, 7);
          g.fill();
        }
        g.fillStyle = road;
        g.fillRect(L, -20, R - L, G.H + 40);
        g.beginPath();
        g.moveTo(L, -20);
        g.lineTo(L, G.H + 20);
        g.moveTo(R, -20);
        g.lineTo(R, G.H + 20);
        ink(g, 4);
        g.strokeStyle = "rgba(255,255,255,0.75)";
        g.lineWidth = 4;
        g.setLineDash([28, 32]);
        g.lineDashOffset = -dash;
        for (let i = 1; i < 3; i++) {
          const x = (lx(i - 1) + lx(i)) / 2;
          g.beginPath();
          g.moveTo(x, -20);
          g.lineTo(x, G.H + 20);
          g.stroke();
        }
        g.setLineDash([]);
        // vrata
        if (gate) {
          g.globalAlpha = Math.max(0, gate.a);
          gate.opts.forEach((txt, i) => {
            const x = lx(i), w = lw() - 14;
            g.fillStyle = gate.hit === i ? "#ef4444" : ["#f97316", "#8b5cf6", "#0ea5e9"][i];
            for (const px0 of [x - w / 2, x + w / 2 - 8]) {
              g.beginPath();
              g.rect(px0, gate.y - 34, 8, 44);
              g.fill();
              ink(g, 2.5);
              g.fillStyle = gate.hit === i ? "#ef4444" : ["#f97316", "#8b5cf6", "#0ea5e9"][i];
            }
            G.rr(x - w / 2, gate.y - 44, w, 30, 10);
            g.fill();
            ink(g, 3);
            g.fillStyle = "#fffbeb";
            G.rr(x - w / 2 + 5, gate.y - 40, w - 10, 22, 7);
            g.fill();
            G.fit(txt, x, gate.y - 29, w - 16, 17, { color: INK, weight: 900 });
          });
          g.globalAlpha = 1;
        }
        // tekač
        const y = py(), bob = Math.sin(G.time * 16) * 3;
        g.fillStyle = "rgba(0,0,0,0.18)";
        g.beginPath();
        g.ellipse(px, y + 26, 18, 6, 0, 0, 7);
        g.fill();
        g.strokeStyle = "#1e3a8a";
        g.lineWidth = 6;
        g.lineCap = "round";
        const leg = Math.sin(G.time * 16) * 9;
        g.beginPath();
        g.moveTo(px, y + 8 + bob);
        g.lineTo(px - leg, y + 24);
        g.moveTo(px, y + 8 + bob);
        g.lineTo(px + leg, y + 24);
        g.stroke();
        g.fillStyle = "#2563eb";
        G.rr(px - 12, y - 14 + bob, 24, 26, 10);
        g.fill();
        ink(g, 3);
        g.fillStyle = "#fcd9b6";
        g.beginPath();
        g.arc(px, y - 22 + bob, 11, 0, 7);
        g.fill();
        ink(g, 3);
        g.fillStyle = "#7c2d12";
        g.beginPath();
        g.arc(px, y - 26 + bob, 11, Math.PI, 0);
        g.fill();
        g.lineCap = "butt";
      },
    };
  },
};

// ============ SORTIRNICA: zaboje s pravilnimi trditvami v zeleni koš, z napačnimi v rdečega ============
export const sorter = {
  id: "sorter",
  story: {"sl": [["Prvi dan v tovarni", "Robot Zobko preverja zaboje v tovarni števil."], ["Nočna izmena", "Ponoči je dela še več."], ["Velika naročila", "Prispela so velika naročila."], ["Mojster tovarne", "Zobko in ti sta najboljša ekipa!"]], "en": [["First day at the factory", "Zobko the robot checks crates in the number factory."], ["Night shift", "There is even more work at night."], ["Big orders", "Big orders have arrived."], ["Factory master", "You and Zobko are the best team!"]]},
  icon: "list-checks",
  colors: ["#78350f", "#b45309"],
  options: 2,
  create(G) {
    let crate = null, flying = [], belt = 0, drag = null;
    const beltY = () => G.H * 0.42;
    const cw = () => Math.min(G.W * 0.78, 340);
    const btn = (side) => ({ x: side ? G.W / 2 + 6 : 12, y: G.H - 92, w: G.W / 2 - 18, h: 78 });
    const inside = (p, b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
    function decide(say) {
      if (!crate || G.waiting || crate.done) return;
      crate.done = true;
      const truth = G.isRight(crate.v);
      const ok = truth === say;
      const b = btn(say ? 1 : 0);
      flying.push({ ...crate, tx: b.x + b.w / 2, ty: b.y + b.h / 2, t: 0, ok });
      G.answer(ok, crate.x, beltY());
      crate = null;
    }
    return {
      reset() {
        crate = null;
        flying = [];
      },
      question(q) {
        const v = Math.random() < 0.5 ? q.a : G.opts.find((o) => o !== q.a) || q.w[0];
        const [l1, l2] = statement(q.q, v);
        crate = { v, l1, l2, x: cw() / 2 + 10, done: false };
        G.qText?.(q.q);
      },
      update(dt) {
        const v = (G.W / 10) * G.speed;
        belt = (belt + v * dt) % 40;
        if (crate && !drag) {
          crate.x += v * dt;
          if (crate.x - cw() / 2 > G.W - 10 && !G.waiting) {
            const truth = G.isRight(crate.v);
            crate = null;
            G.miss(G.W - 30, beltY());
            void truth;
          }
        }
        for (const f of flying) f.t += dt * 2.6;
        flying = flying.filter((f) => f.t < 1);
      },
      pointer(type, p) {
        if (type === "down") {
          if (inside(p, btn(0))) return decide(false);
          if (inside(p, btn(1))) return decide(true);
          if (crate && Math.abs(p.x - crate.x) < cw() / 2 && Math.abs(p.y - beltY()) < 60) drag = { x0: p.x, y0: p.y, cx: crate.x };
        } else if (type === "move" && drag && crate) {
          crate.x = drag.cx + (p.x - drag.x0) * 0.3;
          crate.dy = Math.max(0, p.y - drag.y0);
          crate.dx = p.x - drag.x0;
        } else if (type === "up" && drag) {
          const dx = crate ? crate.dx || 0 : 0, dy = crate ? crate.dy || 0 : 0;
          if (crate) crate.dy = 0;
          drag = null;
          if (dy > 60 || Math.abs(dx) > 80) decide(dx > 0);
        }
      },
      key(k, down) {
        if (!down) return false;
        if (["ArrowLeft", "n", "N", "x", "X", "0"].includes(k)) return decide(false), true;
        if (["ArrowRight", "y", "Y", "v", "V", "1"].includes(k)) return decide(true), true;
        return false;
      },
      draw(g) {
        const [wall, ray] = chap(G, [["#fef3c7", "rgba(251,191,36,0.25)"], ["#e0e7ff", "rgba(129,140,248,0.25)"], ["#dcfce7", "rgba(74,222,128,0.25)"], ["#fce7f3", "rgba(244,114,182,0.25)"]]);
        g.fillStyle = wall;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        sunburst(g, G, G.W / 2, beltY() - 30, ray, 18);
        // trak
        const y = beltY();
        g.fillStyle = "#374151";
        g.beginPath();
        g.rect(-10, y + 52, G.W + 20, 22);
        g.fill();
        ink(g, 3);
        g.fillStyle = "#6b7280";
        for (let x = -40 + belt; x < G.W + 40; x += 40) g.fillRect(x, y + 56, 20, 14);
        g.fillStyle = "#1f2937";
        for (const x of [20, G.W - 20]) {
          g.beginPath();
          g.arc(x, y + 63, 14, 0, 7);
          g.fill();
        }
        // koša (gumba)
        [0, 1].forEach((s) => {
          const b = btn(s);
          g.fillStyle = s ? "#16a34a" : "#dc2626";
          G.rr(b.x, b.y, b.w, b.h, 18);
          g.fill();
          ink(g, 4);
          g.fillStyle = "rgba(255,255,255,0.18)";
          G.rr(b.x + 6, b.y + 6, b.w - 12, b.h / 2 - 6, 12);
          g.fill();
          G.fit(s ? "✓" : "✗", b.x + b.w / 2, b.y + b.h / 2, b.w - 20, 38, { color: "#ffffff", weight: 900, stroke: INK, sw: 6 });
        });
        const drawCrate = (c, x, yy, sc = 1, alpha = 1) => {
          const w = cw() * sc, h = 104 * sc;
          g.globalAlpha = alpha;
          g.fillStyle = "#b45309";
          G.rr(x - w / 2, yy - h / 2, w, h, 10 * sc);
          g.fill();
          ink(g, 4);
          g.fillStyle = "#fffbeb";
          G.rr(x - w / 2 + 8 * sc, yy - h / 2 + 8 * sc, w - 16 * sc, h - 16 * sc, 8 * sc);
          g.fill();
          if (c.l1) {
            G.fit(c.l1, x, yy - 18 * sc, w - 30 * sc, 18 * sc, { color: "#57534e", weight: 700 });
            G.fit(c.l2, x, yy + 16 * sc, w - 30 * sc, 26 * sc, { color: "#1c1917", weight: 900 });
          } else G.fit(c.l2, x, yy, w - 30 * sc, 24 * sc, { color: "#1c1917", weight: 900 });
          g.globalAlpha = 1;
        };
        if (crate) drawCrate(crate, crate.x, y + (crate.dy || 0) * 0.5);
        for (const f of flying) {
          const e = f.t * f.t;
          drawCrate(f, f.x + (f.tx - f.x) * e, y + (f.ty - y) * e - Math.sin(f.t * Math.PI) * 60, 1 - 0.7 * f.t, 1 - f.t * 0.6);
        }
      },
    };
  },
};

export const ENGINES = [meteor, balloons, runner, sorter, ...ARCADE, ...ARCADE2, ...BUILD_GAMES, ...SENSOR_GAMES, ...FUN_GAMES, ...RETRO_GAMES, ...DEDUCTION_GAMES, ...PRODUCE_GAMES, ...PRODUCE2_GAMES];
// Igra ustreza pojmu: večina iger sprejme vsak pojem, nekatere le pojme z ustreznimi nalogami (engine.fits,
// npr. številska premica samo odgovor z enim številom). Portal pokaže ploščico le za ustrezne pare.
export const fits = (e, c) => !e.fits || e.fits(c);
