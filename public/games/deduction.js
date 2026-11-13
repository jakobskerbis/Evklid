// »Kdo je slepar?« (j 2026-10-30: »dodaj amongus style igre«): izvirna igra razkrivanja sleparja.
// Robotki posadke vesoljske postaje povedo vsak svojo nalogo in odgovor; vsi imajo prav, razen enega.
// Učenec preveri račune in sleparja izžene skozi zračno zapornico. Učenje je jedro: sleparja najdeš le,
// če rešiš naloge. Lastni liki (okrogli robotki z anteno na kolescih), brez imen, likov ali risb tujih iger.
import { clamp, shuffle, INK, chap, inRect, numKey, circle, answerText } from "./fun.js";
import { statement } from "./topics.js";

// barva telesa in oblika konice antene (barva ni namig: vsako rundo se premeša)
const BOTS = [["#fb923c", "circle"], ["#4ade80", "square"], ["#60a5fa", "triangle"], ["#f0abfc", "diamond"], ["#facc15", "circle"], ["#2dd4bf", "square"]];
const GOOD = "#16a34a", BAD = "#dc2626";

// Robotek: telo z zaslonom za obraz, anteno in kolesci. mood: 1 vesel, 0 čaka, −1 zaskrbljen; bad = razkrit slepar.
function bot(G, g, x, y, r, col, tip, mood, bad) {
  g.lineWidth = Math.max(2, r * 0.09);
  g.strokeStyle = INK;
  g.beginPath();
  g.moveTo(x, y - r * 0.8);
  g.lineTo(x, y - r * 1.2);
  g.stroke();
  const ty = y - r * 1.3, s = r * 0.17;
  g.fillStyle = bad ? "#ef4444" : "#fde047";
  g.beginPath();
  if (tip === "square") g.rect(x - s, ty - s, 2 * s, 2 * s);
  else if (tip === "triangle") {
    g.moveTo(x, ty - s * 1.25);
    g.lineTo(x + s * 1.15, ty + s * 0.85);
    g.lineTo(x - s * 1.15, ty + s * 0.85);
    g.closePath();
  } else if (tip === "diamond") {
    g.moveTo(x, ty - s * 1.35);
    g.lineTo(x + s * 1.05, ty);
    g.lineTo(x, ty + s * 1.35);
    g.lineTo(x - s * 1.05, ty);
    g.closePath();
  } else g.arc(x, ty, s * 1.05, 0, Math.PI * 2);
  g.fill();
  g.lineWidth = 2;
  g.stroke();
  circle(g, x - r * 0.5, y + r * 0.85, r * 0.2, "#475569", 2);
  circle(g, x + r * 0.5, y + r * 0.85, r * 0.2, "#475569", 2);
  G.rr(x - r, y - r * 0.8, 2 * r, r * 1.6, r * 0.45);
  g.fillStyle = col;
  g.fill();
  g.lineWidth = Math.max(2, r * 0.09);
  g.strokeStyle = INK;
  g.stroke();
  // zaslon z obrazom
  G.rr(x - r * 0.72, y - r * 0.56, r * 1.44, r * 0.98, r * 0.26);
  g.fillStyle = "#0f172a";
  g.fill();
  const eye = bad ? "#f87171" : "#67e8f9", ey = y - r * 0.2, my = y + r * 0.14;
  g.fillStyle = eye;
  g.strokeStyle = eye;
  g.lineWidth = Math.max(2, r * 0.09);
  g.lineCap = "round";
  for (const sx of [-1, 1]) {
    g.beginPath();
    if (bad) {
      // poševne oči: jezen pogled
      g.moveTo(x + sx * r * 0.45, ey - r * 0.1);
      g.lineTo(x + sx * r * 0.15, ey + r * 0.05);
      g.stroke();
    } else if (mood > 0) {
      g.arc(x + sx * r * 0.3, ey + r * 0.06, r * 0.12, Math.PI * 1.1, Math.PI * 1.9);
      g.stroke();
    } else {
      g.arc(x + sx * r * 0.3, ey, r * 0.11, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.beginPath();
  if (bad) {
    // cikcak nasmešek
    for (let k = 0; k <= 4; k++) g.lineTo(x - r * 0.3 + k * r * 0.15, my + (k % 2 ? r * 0.1 : 0));
  } else if (mood > 0) g.arc(x, my - r * 0.06, r * 0.2, Math.PI * 0.15, Math.PI * 0.85);
  else if (mood < 0) g.arc(x, my + r * 0.16, r * 0.17, Math.PI * 1.2, Math.PI * 1.8);
  else {
    g.moveTo(x - r * 0.16, my + r * 0.04);
    g.lineTo(x + r * 0.16, my + r * 0.04);
  }
  g.stroke();
  g.lineCap = "butt";
}

// Naloge za rundo: slepar ima nalogo igre (q) z napačnim odgovorom, ostali n − 1 robotki dodatne naloge
// iste snovi s pravilnimi odgovori (različne; po nekaj poskusih sprejme tudi ponovljeno). Premešano.
export function deal(q, ask, n) {
  const seen = new Set([q.q]), tasks = [];
  for (let k = 0; tasks.length < n - 1; k++) {
    const x = ask();
    // sleparjeve naloge nikoli dvakrat (dve vrsti z isto nalogo bi ga izdali brez računanja); pri zelo majhni
    // zbirki nalog po mnogo poskusih vseeno sprejme
    if ((x.q === q.q && k < n * 40) || (seen.has(x.q) && k < n * 5)) continue;
    seen.add(x.q);
    tasks.push(task(x, x.a));
  }
  const lie = q.w[Math.floor(Math.random() * Math.min(3, q.w.length))];
  tasks.push({ ...task(q, lie), truth: q.a, fix: statement(q.q, q.a)[1], imp: true });
  return shuffle(tasks);
}
// Naloga z izbiro (»Katero število je največje?«) velja le med svojimi možnostmi: te so zato v oblačku
// (pick). Pri sleparju so med njimi tudi njegov napačni in pravilni odgovor.
function task(x, claim) {
  const say = statement(x.q, claim);
  const pick = say[0] && say[1] === claim ? shuffle([x.a, ...x.w.slice(0, 3)]) : null;
  return { q: x.q, claim, say, pick };
}

// Odgovor v okvirčku; struck: prečrtan (sleparjev napačni odgovor).
function tag(G, g, txt, x, y, w, h, fill, line, struck) {
  G.rr(x - w / 2, y - h / 2, w, h, Math.min(10, h / 3));
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 2.5;
  g.strokeStyle = line;
  g.stroke();
  answerText(G, txt, x, y + 1, w - 10, clamp(h * 0.55, 12, 24), { color: INK, weight: 900 });
  if (struck) {
    g.strokeStyle = BAD;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x - w / 2 + 8, y + h * 0.2);
    g.lineTo(x + w / 2 - 8, y - h * 0.2);
    g.stroke();
  }
}

// Možnosti naloge z izbiro v vrsti majhnih ploščic.
function chips(G, g, list, cx, y, w, h) {
  const gap = 6, cw = Math.min(120, (w - gap * (list.length - 1)) / list.length), x0 = cx - (list.length * cw + gap * (list.length - 1)) / 2;
  list.forEach((txt, i) => {
    const x = x0 + i * (cw + gap);
    G.rr(x, y - h / 2, cw, h, Math.min(8, h / 3));
    g.fillStyle = "#e2e8f0";
    g.fill();
    g.lineWidth = 1.5;
    g.strokeStyle = "#94a3b8";
    g.stroke();
    G.fit(txt, x + cw / 2, y + 1, cw - 6, h * 0.62, { color: "#334155", weight: 800 });
  });
}

export const impostor = {
  id: "impostor",
  added: "2026-10-30", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Postaja Pi", "Robotki na vesoljski postaji Pi rešujejo naloge. Eden med njimi goljufa."], ["Strojnica", "Motorji potrebujejo pravilne račune. Kdo je ponaredil svojega?"], ["Laboratorij", "V laboratoriju so naloge težje, slepar pa se dobro skriva."], ["Pot domov", "Izženi še zadnje sleparje in postaja varno pristane doma."]],
    en: [["Station Pi", "The robots on space station Pi solve tasks. One of them is a faker."], ["Engine room", "The engines need correct sums. Who faked theirs?"], ["The lab", "The tasks get harder in the lab, and the faker hides well."], ["Way home", "Send out the last fakers and the station lands safely home."]],
  },
  icon: "venetian-mask",
  colors: ["#1e1b4b", "#f43f5e"],
  options: 2,
  timer: (G) => (G.tier >= 2 ? 48 : 36), // 12 s na robotka: čas za razmislek, ne za refleks (mirna igra)
  // v glavi je navodilo, ne sleparjeva naloga (sicer bi glava izdala sleparja)
  prompt: "games.e.impostor.ask",
  create(G) {
    let crew = [], done = true, caught = 0, blink = 0;
    let hdr = 48, top = 56, rh = 80, gap = 8, r = 24;
    const stars = Array.from({ length: 36 }, (_, i) => [((i * 73) % 100) / 100, ((i * 41) % 100) / 100, 0.5 + ((i * 17) % 10) / 10]);
    const rowRect = (i) => ({ x: 6, y: top + i * (rh + gap), w: G.W - 12, h: rh });
    const botPos = (i) => ({ x: 14 + r, y: top + i * (rh + gap) + rh / 2 + r * 0.22 });
    const layout = () => {
      hdr = clamp(G.H * 0.1, 36, 56);
      top = hdr + 8;
      const n = crew.length || 4;
      gap = clamp(G.H * 0.015, 4, 10);
      rh = (G.H - top - 8 - gap * (n - 1)) / n;
      r = clamp(Math.min(rh / 2.75, G.W * 0.065), 12, 40);
    };
    const imp = () => crew.find((m) => m.imp);
    // »Slepar je bil robotek 3. Pravilno: 5 + 9 = 14«
    const was = (m) => G.t("games.e.impostor.was", { n: crew.indexOf(m) + 1, s: `${m.say[0]} ${m.fix}`.trim() });
    // razkrije sleparja; vrne razlago za vrstico pod navodilom in daljši premor, da se jo prebere
    const reveal = () => {
      const m = imp();
      if (!m) return {};
      m.shown = true;
      for (const c of crew) if (!c.cleared) c.mood = c.imp ? 0 : -1;
      return { delay: 3, note: was(m) };
    };
    const vote = (i) => {
      const m = crew[i];
      if (!m || done || G.waiting) return;
      done = true;
      m.voted = true;
      const p = botPos(i);
      if (m.imp) {
        // izgnan skozi zapornico: odleti v vesolje, posadka se razveseli
        caught++;
        m.shown = true;
        m.eject = true;
        for (const c of crew) c.mood = c.imp ? -1 : 1;
        G.answer(true, p.x, p.y, { delay: 1.7, note: was(m) });
      } else {
        m.cleared = true;
        m.shake = 0.5;
        G.answer(false, p.x, p.y, reveal());
      }
    };
    return {
      resize: layout,
      peek: () => crew, // za teste
      reset() {
        crew = [];
        caught = 0;
        done = true;
        layout();
      },
      question(q) {
        const look = shuffle(BOTS.slice());
        crew = deal(q, G.ask, G.tier >= 2 ? 4 : 3).map((m, i) => ({ ...m, col: look[i][0], tip: look[i][1], mood: 0, ex: 0, ey: 0, vx: 0, rot: 0, alpha: 1, shake: 0, hop: i * 1.7 }));
        done = false;
        layout();
        // za bralnik zaslona: naloge in odgovori so sicer samo na platnu
        return crew.map((m, i) => `${i + 1}: ${m.say.filter(Boolean).join(" ")}${m.pick ? ` (${m.pick.join("; ")})` : ""}.`).join(" ");
      },
      timeout() {
        done = true;
        return reveal();
      },
      update(dt) {
        if (!G.reduced) blink += dt;
        for (const m of crew) {
          m.hop += dt * 5;
          m.shake = Math.max(0, m.shake - dt);
          if (!m.eject) continue;
          if (G.reduced) m.alpha = Math.max(0, m.alpha - dt * 1.5);
          else {
            m.vx += 900 * dt;
            m.ex += m.vx * dt;
            m.ey -= 70 * dt;
            m.rot += 7 * dt;
          }
        }
      },
      pointer(type, p) {
        if (type !== "down") return;
        const i = crew.findIndex((_, k) => inRect(p, rowRect(k)));
        if (i >= 0) vote(i);
      },
      key(k, down) {
        const i = numKey(k, crew.length);
        if (!down || i < 0) return false;
        vote(i);
        return true;
      },
      draw(g) {
        const [wall, deep, panel] = chap(G, [["#1e293b", "#0f172a", "#334155"], ["#3b1d0e", "#1c0f08", "#57341c"], ["#064e3b", "#022c22", "#0f5f4a"], ["#1e1b4b", "#0b0a26", "#312e81"]]);
        const grd = g.createLinearGradient(0, 0, 0, G.H);
        grd.addColorStop(0, wall);
        grd.addColorStop(1, deep);
        g.fillStyle = grd;
        g.fillRect(-20, -20, G.W + 40, G.H + 40);
        // stenske plošče z zakovicami
        g.strokeStyle = "rgba(255,255,255,0.06)";
        g.lineWidth = 2;
        for (let x = 40; x < G.W; x += 80) {
          g.beginPath();
          g.moveTo(x, hdr);
          g.lineTo(x, G.H);
          g.stroke();
        }
        // glava: alarmna lučka, števec ujetih sleparjev, zapornica z oknom v vesolje
        g.fillStyle = panel;
        g.fillRect(0, 0, G.W, hdr);
        g.fillStyle = INK;
        g.fillRect(0, hdr - 3, G.W, 3);
        const on = !done && (G.reduced || Math.sin(blink * 6) > 0);
        circle(g, 10 + hdr * 0.3, hdr / 2, hdr * 0.26, on ? "#ef4444" : "#7f1d1d", 2);
        G.rr(18 + hdr * 0.6, hdr * 0.2, 86, hdr * 0.6, 10);
        g.fillStyle = "#fef9c3";
        g.fill();
        g.lineWidth = 2.5;
        g.strokeStyle = INK;
        g.stroke();
        G.fit(`🕵️ ${caught}`, 18 + hdr * 0.6 + 43, hdr / 2 + 1, 78, Math.min(20, hdr * 0.42), { color: INK, weight: 900 });
        const dw = Math.min(150, G.W * 0.32), dx = G.W - dw - 8;
        G.rr(dx, 5, dw, hdr - 12, 8);
        g.fillStyle = "#020617";
        g.fill();
        for (const [sx, sy, sz] of stars) {
          g.fillStyle = `rgba(255,255,255,${0.4 + sz * 0.4})`;
          g.fillRect(dx + 4 + ((sx * dw + blink * 18 * sz) % (dw - 8)), 9 + sy * (hdr - 20), sz * 1.6, sz * 1.6);
        }
        g.lineWidth = 3;
        g.strokeStyle = "#facc15";
        g.setLineDash([8, 6]);
        G.rr(dx, 5, dw, hdr - 12, 8);
        g.stroke();
        g.setLineDash([]);
        // posadka: vsak robotek s svojim oblačkom (naloga → odgovor)
        crew.forEach((m, i) => {
          const R = rowRect(i), p = botPos(i);
          const bx = 14 + r * 2 + 14, bw = G.W - bx - 10, by = R.y + 3, bh = R.h - 6;
          G.rr(bx, by, bw, bh, 12);
          g.fillStyle = m.imp && m.shown ? "#fee2e2" : m.cleared ? "#dcfce7" : "#f8fafc";
          g.fill();
          g.lineWidth = m.voted ? 4 : 2.5;
          g.strokeStyle = m.voted ? "#facc15" : INK;
          g.stroke();
          // repek oblačka proti robotku
          g.beginPath();
          g.moveTo(bx + 1, p.y - r * 0.5);
          g.lineTo(bx - 10, p.y - r * 0.2);
          g.lineTo(bx + 1, p.y + r * 0.1);
          g.fillStyle = m.imp && m.shown ? "#fee2e2" : m.cleared ? "#dcfce7" : "#f8fafc";
          g.fill();
          // naloga in odgovor (statement: »7 · 8« + »= 56« ali cela trditev »3 + 4 = 7«): široko v eni vrsti, ozko v dveh
          const [task, say] = m.say, wide = bw > 440, open = m.imp && m.shown;
          const both = (y, h, w, cx) => {
            // slepar razkrit: njegov odgovor prečrtan, ob njem (ali pod njim) pravilni
            if (task || wide) {
              const hw = (w - 6) / 2;
              tag(G, g, say, cx - hw / 2 - 3, y, hw, h, "#fecaca", BAD, true);
              tag(G, g, `✓ ${m.fix}`, cx + hw / 2 + 3, y, hw, h, "#bbf7d0", GOOD, false);
            } else {
              tag(G, g, say, cx, by + bh * 0.28, w, bh * 0.4, "#fecaca", BAD, true);
              tag(G, g, `✓ ${m.fix}`, cx, by + bh * 0.72, w, bh * 0.4, "#bbf7d0", GOOD, false);
            }
          };
          const one = (y, h, w, cx) => (open ? both(y, h, w, cx) : tag(G, g, m.cleared ? `✓ ${say}` : say, cx, y, w, h, m.cleared ? "#bbf7d0" : "#fef3c7", m.cleared ? GOOD : INK, false));
          if (!task) one(by + bh / 2, clamp(bh * 0.62, 24, 52), bw - 18, bx + bw / 2);
          else {
            const tw = wide ? bw * 0.6 : bw - 18, tx = wide ? bx + 10 + tw / 2 : bx + bw / 2;
            // naloga z izbiro: pod njo še možnosti (manjše), da se odgovor da preveriti
            const ty = m.pick ? (wide ? by + bh * 0.32 : by + bh * 0.2) : wide ? by + bh / 2 : by + bh * 0.3;
            const ts = m.pick ? (wide ? clamp(bh * 0.24, 12, 20) : clamp(bh * 0.16, 11, 17)) : wide ? clamp(bh * 0.3, 12, 22) : clamp(bh * 0.2, 11, 19);
            answerText(G, task, tx, ty, tw, ts, { color: "#334155", weight: 800 });
            if (m.pick) chips(G, g, m.pick, tx, wide ? by + bh * 0.72 : by + bh * 0.45, tw, wide ? clamp(bh * 0.28, 16, 28) : clamp(bh * 0.19, 16, 24));
            const cw = wide ? bw * 0.36 : Math.min(bw - 18, 320);
            const ch = wide ? clamp(bh * 0.55, 24, 46) : m.pick ? clamp(bh * 0.28, 18, 34) : clamp(bh * 0.36, 20, 38);
            one(wide ? by + bh / 2 : by + bh * (m.pick ? 0.77 : 0.72), ch, cw, wide ? bx + bw - 8 - cw / 2 : bx + bw / 2);
          }
          // robotek (izgnani odleti čez oblaček v vesolje)
          const hop = m.mood > 0 && !G.reduced ? Math.abs(Math.sin(m.hop)) * r * 0.25 : 0;
          const sh = m.shake > 0 && !G.reduced ? Math.sin(m.shake * 50) * 4 : 0;
          if (m.alpha <= 0 || p.x + m.ex > G.W + r * 3) return;
          g.save();
          g.globalAlpha = m.alpha;
          g.translate(p.x + m.ex + sh, p.y + m.ey - hop);
          g.rotate(m.rot);
          bot(G, g, 0, 0, r, m.col, m.tip, m.mood, m.imp && m.shown);
          g.restore();
          if (!m.eject) {
            const br = Math.max(10, r * 0.34);
            circle(g, p.x - r * 0.95, p.y - r * 0.85, br, "#fff", 2);
            G.fit(`${i + 1}`, p.x - r * 0.95, p.y - r * 0.84, br * 1.5, br * 1.25, { color: INK, weight: 900 });
          }
        });
      },
    };
  },
};

export const DEDUCTION_GAMES = [impostor];
