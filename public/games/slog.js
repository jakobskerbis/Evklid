// Skupni slog iger na platnu (canvas 2D): barve iz teme (CSS spremenljivke), mehka svetloba in vinjeta,
// rahla tekstura po svetu igre, mehke sence, prelivi in lepši delci. Uporablja ga core.js za vse igre
// (G.slog); igre lahko kličejo še G.slog.volumen / preliv / senca / sij. Brez slik: vse nastane iz kode.
// Vse je pripravljeno vnaprej (majhna platna), v sličici so le drawImage in en vzorec: telefon ostane tekoč.

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// "#rgb", "#rrggbb", "rgb(…)" → [r, g, b]
export function rgb(c) {
  const s = String(c).trim();
  let m = /^#([0-9a-f]{3})$/i.exec(s);
  if (m) return [...m[1]].map((h) => parseInt(h + h, 16));
  m = /^#([0-9a-f]{6})/i.exec(s);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = /^rgba?\(([^)]+)\)/i.exec(s);
  if (m) return m[1].split(/[\s,/]+/).slice(0, 3).map((v) => clamp(Math.round(parseFloat(v)), 0, 255));
  return [128, 128, 128];
}
const hex = (a) => `#${a.map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;
// mešanica dveh barv (t = delež druge)
export const mesaj = (a, b, t) => {
  const A = rgb(a), B = rgb(b);
  return hex(A.map((v, i) => v + (B[i] - v) * t));
};
export const svetlost = (c) => {
  const [r, g, b] = rgb(c);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
export const alfa = (c, a) => `rgba(${rgb(c).join(",")},${a})`;

// Svet igre določa teksturo ozadja. Igra lahko poda engine.svet, sicer velja seznam.
const SVETOVI = {
  vesolje: ["meteor", "invaders", "lander", "impostor", "orb", "bricks", "maze"],
  narava: ["runner", "hills", "frog", "moles", "snake", "pet", "slicer"],
  voda: ["water", "bubbles", "blocks"],
  nebo: ["balloons", "heli", "jumper", "catcher"],
};
export const svetIgre = (engine) => engine?.svet || Object.keys(SVETOVI).find((k) => SVETOVI[k].includes(engine?.id)) || "platno";

// Ploščica teksture n × n kot RGBA (brez platna, da jo preveri test). Vedno rahla: alfa največ ~45/255,
// zvezdni prah izjemoma do 120 na posameznih točkah.
export function zrno(svet, n = 96, rnd = Math.random) {
  const d = new Uint8ClampedArray(n * n * 4);
  const px = (x, y, v, a) => {
    const i = ((((y % n) + n) % n) * n + (((x % n) + n) % n)) * 4;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = a;
  };
  // filmsko zrno (v vesolju ne: na črnem deluje umazano, tam je samo zvezdni prah)
  if (svet !== "vesolje") for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) px(x, y, rnd() < 0.5 ? 0 : 255, Math.floor(rnd() * (svet === "nebo" ? 8 : 13)));
  if (svet === "vesolje") {
    for (let i = 0; i < n * n * 0.006; i++) px(Math.floor(rnd() * n), Math.floor(rnd() * n), 255, 40 + Math.floor(rnd() * 80));
  } else if (svet === "narava") {
    for (let i = 0; i < n * n * 0.03; i++) {
      const x = Math.floor(rnd() * n), y = Math.floor(rnd() * n), v = rnd() < 0.5 ? 0 : 255, a = 14 + Math.floor(rnd() * 14);
      for (let k = 0; k < 4; k++) px(x + (k > 2 ? 1 : 0), y - k, v, a);
    }
  } else if (svet === "voda") {
    for (let y = 0; y < n; y += 3) {
      const f = rnd() * 6.28, a = 5 + rnd() * 9;
      for (let x = 0; x < n; x++) px(x, y + Math.round(Math.sin((x / n) * 6.28 * 2 + f) * 1.5), 255, Math.floor(a * (0.5 + 0.5 * Math.sin((x / n) * 6.28 * 3 + f * 2))));
    }
  } else if (svet === "platno") {
    // tkanina: kratke nitke v obeh smereh (brez ravnih vrstic čez ves prizor)
    for (let i = 0; i < n * n * 0.05; i++) {
      const x = Math.floor(rnd() * n), y = Math.floor(rnd() * n), v = rnd() < 0.5 ? 0 : 255, a = 8 + Math.floor(rnd() * 10), vod = rnd() < 0.5;
      for (let k = 0; k < 5; k++) px(x + (vod ? k : 0), y + (vod ? 0 : k), v, a);
    }
  }
  return d;
}

// Barve teme iz CSS spremenljivk elementa (vsi slogi, svetlo in temno). g normalizira zapis barve.
export function barveTeme(el, g) {
  const cs = getComputedStyle(el);
  const v = (ime, rez) => {
    const s = cs.getPropertyValue(ime).trim();
    if (!s || !g) return s || rez;
    g.save();
    g.fillStyle = rez;
    g.fillStyle = s;
    const out = g.fillStyle;
    g.restore();
    return typeof out === "string" ? out : rez;
  };
  const T = { accent: v("--accent", "#2563eb"), ok: v("--ok", "#16a34a"), danger: v("--danger", "#dc2626"), gold: v("--gold", "#f59e0b"), bg: v("--bg", "#f5f7fb"), text: v("--text", "#14213d") };
  T.temna = svetlost(T.bg) < 0.4;
  return T;
}

// Barve, ki jih igre pišejo neposredno za »prav / narobe / nagrada«: zamenjajo se z barvami teme.
const POMEN = { "#22c55e": "ok", "#16a34a": "ok", "#ef4444": "danger", "#dc2626": "danger", "#fde047": "gold", "#f59e0b": "gold" };

const platno = (w, h) => {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};

export function ustvariSlog(G, canvas, engine, host) {
  const g = canvas.getContext("2d");
  const svet = svetIgre(engine);
  // Temen prizor (seštevanje svetlobe, žarenje) je le vesolje ali igra, ki to pove sama (engine.temno); barvi glave
  // igre tega ne povesta: Baloni imajo temno modro glavo in svetlo nebo.
  const temenSvet = svet === "vesolje" || engine.temno === true;
  let T = barveTeme(host, g), plast = null, zrnoPl = null, zrnoPlast = null, obla = null, cvet = null, cq = null;
  let zadnji = 0, pocasne = 0, raven = 2; // raven učinkov: 2 = vse, 1 = brez žarenja in druge plasti ozadja, 0 = samo tekstura in svetloba
  let plasti = [], ozadjeNarisano = false, sencenih = 0, gPloskev = null, gKrog = null;
  const svetlosti = new Map();
  const sijaji = new Map(), prelivi = new Map();
  const barva = (c) => (POMEN[String(c).toLowerCase()] ? mesaj(T[POMEN[String(c).toLowerCase()]], c, 0.35) : c);

  // mehka pika (sij, delci, senca) kot majhno platno; ena na barvo
  function pika(c) {
    let s = sijaji.get(c);
    if (!s) {
      if (sijaji.size > 40) sijaji.clear();
      s = platno(48, 48);
      const q = s.getContext("2d"), r = q.createRadialGradient(24, 24, 0, 24, 24, 24);
      r.addColorStop(0, alfa(c, 0.95));
      r.addColorStop(0.35, alfa(c, 0.4));
      r.addColorStop(1, alfa(c, 0));
      q.fillStyle = r;
      q.fillRect(0, 0, 48, 48);
      sijaji.set(c, s);
    }
    return s;
  }
  // Ozadje v globino (paralaksa): dve vnaprej narisani plasti na svet, ki se premikata različno hitro.
  // Narišeta se takoj za ozadjem igre (prvi lik čez ves prizor), zato so liki in številke vedno nad njima.
  function narediPlasti() {
    const w = Math.max(60, Math.round(G.W / 2)), h = Math.max(60, Math.round(G.H / 2)), m = Math.min(w, h);
    let s = 91;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const a = engine.colors?.[1] || "#6d28d9";
    // [število, polmer (delež krajše stranice), prekrivnost, barva] za daljno in bližnjo plast
    const opis = {
      vesolje: [[[3, 0.55, 0.13, a], [70, 0.006, 0.7, "#ffffff"]], [[2, 0.4, 0.1, mesaj(a, "#38bdf8", 0.5)], [18, 0.016, 0.9, "#e0e7ff"]]],
      nebo: [[[3, 0.4, 0.07, "#ffffff"]]],
      voda: [[[3, 0.5, 0.1, "#ffffff"]], [[5, 0.2, 0.09, "#ffffff"]]],
      narava: [[[3, 0.5, 0.09, "#fef9c3"]], [[6, 0.18, 0.08, "#ffffff"]]],
      platno: [[[2, 0.6, 0.07, "#ffffff"]], [[3, 0.28, 0.06, mesaj("#ffffff", a, 0.3)]]],
    }[svet];
    return opis.map((skupine, i) => {
      const c = platno(w, h), q = c.getContext("2d");
      for (const [n, r, al, col] of skupine) {
        q.globalAlpha = al;
        for (let k = 0; k < n; k++) {
          const x = rnd() * w, y = rnd() * h * (svet === "nebo" ? 0.5 : 1), R = Math.max(1.2, r * m * (0.7 + rnd() * 0.6));
          // čez rob se ponovi, da se plast pri premikanju neopazno stika
          for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) if (x + dx > -R && x + dx < w + R && y + dy > -R && y + dy < h + R) q.drawImage(pika(col), x + dx - R, y + dy - R, R * 2, R * 2);
        }
      }
      // vesolje teče navzdol (let naprej), drugi svetovi vodoravno (veter, tok)
      return { c, v: (i ? 16 : 6) * (svet === "vesolje" ? 1 : 0.6), dol: svet === "vesolje" };
    });
  }
  function ozadje() {
    ozadjeNarisano = true;
    if (zrnoPlast) g.drawImage(zrnoPlast, 0, 0, G.W, G.H);
    if (raven < 1) return;
    const pa = g.globalAlpha, po = g.globalCompositeOperation;
    g.globalAlpha = 1;
    if (temenSvet) g.globalCompositeOperation = "lighter";
    for (let i = 0; i < (raven > 1 ? plasti.length : 1); i++) {
      const p = plasti[i], d = G.reduced ? 0 : (G.time * p.v) % (p.dol ? G.H : G.W);
      if (p.dol) (g.drawImage(p.c, 0, d - G.H, G.W, G.H), g.drawImage(p.c, 0, d, G.W, G.H));
      else (g.drawImage(p.c, d - G.W, 0, G.W, G.H), g.drawImage(p.c, d, 0, G.W, G.H));
    }
    g.globalAlpha = pa;
    g.globalCompositeOperation = po;
  }

  // Volumen likov: vsak enobarven lik srednje velikosti dobi svetlobo zgoraj levo in senco spodaj desno.
  // Platno si med gradnjo poti zapomni njen okvir; po fill() isto pot zapolni še s prelivom v tem okvirju.
  function ovij() {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, loki = 0, crte = 0;
    const tocka = (x, y) => ((x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y)));
    const izv = {};
    for (const k of ["beginPath", "moveTo", "lineTo", "arc", "arcTo", "ellipse", "rect", "roundRect", "quadraticCurveTo", "bezierCurveTo", "fill", "fillRect"]) izv[k] = g[k]?.bind(g);
    gPloskev = g.createLinearGradient(0, 0, 1, 1);
    for (const [o, c] of [[0, "rgba(255,255,255,0.32)"], [0.42, "rgba(255,255,255,0)"], [0.58, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0.26)"]]) gPloskev.addColorStop(o, c);
    gKrog = g.createRadialGradient(0.36, 0.3, 0.02, 0.5, 0.5, 0.5);
    for (const [o, c] of [[0, "rgba(255,255,255,0.55)"], [0.45, "rgba(255,255,255,0)"], [0.62, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0.32)"]]) gKrog.addColorStop(o, c);
    const primeren = (w, h) => {
      const f = g.fillStyle;
      if (raven < 1 || sencenih > 500 || typeof f !== "string" || f[0] !== "#" || g.globalAlpha < 0.4) return 0;
      if (w < 9 || h < 9 || w > G.W * 0.62 || h > G.H * 0.5) return 0; // drobnarije in ozadja ostanejo ravna
      let l = svetlosti.get(f);
      if (l == null) svetlosti.set(f, (l = svetlost(f)));
      return l > 0.92 ? 0 : l < 0.14 ? 0.5 : 1; // bele tablice s številkami ostanejo čiste; na črnem je odsev šibkejši
    };
    const sencaj = (x, y, w, h, moc, preliv, narisi) => {
      sencenih++;
      g.save();
      g.globalAlpha *= moc;
      g.translate(x, y);
      g.scale(w, h);
      g.fillStyle = preliv;
      narisi();
      g.restore();
    };
    g.beginPath = () => ((x0 = y0 = 1e9), (x1 = y1 = -1e9), (loki = crte = 0), izv.beginPath());
    g.moveTo = (x, y) => (tocka(x, y), izv.moveTo(x, y));
    g.lineTo = (x, y) => (tocka(x, y), crte++, izv.lineTo(x, y));
    g.arc = (x, y, r, ...a) => (tocka(x - r, y - r), tocka(x + r, y + r), loki++, izv.arc(x, y, r, ...a));
    g.ellipse = (x, y, rx, ry, rot, ...a) => {
      const ex = rot ? Math.max(rx, ry) : rx, ey = rot ? Math.max(rx, ry) : ry;
      return tocka(x - ex, y - ey), tocka(x + ex, y + ey), loki++, izv.ellipse(x, y, rx, ry, rot, ...a);
    };
    g.arcTo = (ax, ay, bx, by, r) => (tocka(ax, ay), tocka(bx, by), crte++, izv.arcTo(ax, ay, bx, by, r));
    g.rect = (x, y, w, h) => (tocka(x, y), tocka(x + w, y + h), crte++, izv.rect(x, y, w, h));
    if (izv.roundRect) g.roundRect = (x, y, w, h, r) => (tocka(x, y), tocka(x + w, y + h), crte++, izv.roundRect(x, y, w, h, r));
    g.quadraticCurveTo = (cx, cy, x, y) => (tocka(cx, cy), tocka(x, y), crte++, izv.quadraticCurveTo(cx, cy, x, y));
    g.bezierCurveTo = (ax, ay, bx, by, x, y) => (tocka(ax, ay), tocka(bx, by), tocka(x, y), crte++, izv.bezierCurveTo(ax, ay, bx, by, x, y));
    g.fill = (...a) => {
      izv.fill(...a);
      if (a.length && typeof a[0] !== "string") return; // Path2D: okvir ni znan
      const w = x1 - x0, h = y1 - y0, moc = primeren(w, h);
      if (moc) sencaj(x0, y0, w, h, moc, loki && !crte ? gKrog : gPloskev, () => izv.fill(...a));
    };
    g.fillRect = (x, y, w, h) => {
      izv.fillRect(x, y, w, h);
      if (!ozadjeNarisano && w >= G.W - 2 && h >= G.H - 2) return ozadje();
      const moc = primeren(w, h);
      if (moc) sencaj(x, y, w, h, moc, gPloskev, () => izv.fillRect(0, 0, 1, 1));
    };
  }
  ovij();

  function pripravi() {
    T = barveTeme(host, g);
    // svetloba in vinjeta: majhno platno, raztegnjeno čez prizor
    const w = Math.max(40, G.W / 4), h = Math.max(40, G.H / 4);
    const luc = platno(w, h), q = luc.getContext("2d");
    const rob = mesaj(mesaj(engine.colors?.[0] || "#111827", "#000", 0.65), T.accent, 0.12);
    // vinjeta v enotskem kvadratu (elipsa po obliki prizora): sredina robov ostane skoraj čista, vogali potemnijo
    const v = q.createRadialGradient(0.5, 0.5, 0.5, 0.5, 0.5, 0.76);
    v.addColorStop(0, alfa(rob, 0));
    v.addColorStop(1, alfa(rob, T.temna ? 0.42 : 0.3));
    q.save();
    q.scale(w, h);
    q.fillStyle = v;
    q.fillRect(0, 0, 1, 1);
    q.restore();
    const s = q.createRadialGradient(w * 0.28, 0, 0, w * 0.28, 0, Math.max(w, h) * 0.85);
    const sv = mesaj("#ffffff", T.accent, 0.18);
    s.addColorStop(0, alfa(sv, temenSvet ? 0.07 : 0.12));
    s.addColorStop(1, alfa(sv, 0));
    q.fillStyle = s;
    q.fillRect(0, 0, w, h);
    // žarenje svetlih delov v temnih svetovih: pomanjšana kopija prizora (pomanjšanje jo zamegli), narisana nazaj čez prizor
    cvet = platno(canvas.width / 8, canvas.height / 8);
    cq = cvet.getContext("2d");
    if (!zrnoPl) {
      zrnoPl = platno(96, 96);
      const tq = zrnoPl.getContext("2d"), im = tq.createImageData(96, 96);
      im.data.set(zrno(svet, 96));
      tq.putImageData(im, 0, 0);
    }
    plasti = narediPlasti();
    // tekstura, svetloba in vinjeta v eni plasti velikosti platna: v sličici ena sama kopija brez raztegovanja
    // Tekstura sveta je svoja plast, ki se nariše takoj za ozadjem igre: liki in tablice s številkami ostanejo čisti.
    zrnoPlast = platno(canvas.width, canvas.height);
    const zq = zrnoPlast.getContext("2d");
    zq.fillStyle = zq.createPattern(zrnoPl, "repeat");
    zq.fillRect(0, 0, zrnoPlast.width, zrnoPlast.height);
    // svetloba in vinjeta (brez teksture) čez prizor: v sličici ena sama kopija brez raztegovanja
    plast = platno(canvas.width, canvas.height);
    plast.getContext("2d").drawImage(luc, 0, 0, plast.width, plast.height);
  }

  const S = {
    svet,
    get raven() {
      return raven;
    },
    get tema() {
      return T;
    },
    barva,
    resize: pripravi,
    // Po risanju igre: tekstura sveta, svetloba od zgoraj levo in vinjeta v barvah teme.
    po() {
      ozadjeNarisano = false;
      sencenih = 0;
      if (!plast) return;
      // Telefon mora ostati tekoč: če sličice trajajo predolgo (pod ~45 na sekundo), se žarenje izklopi.
      const zdaj = performance.now(), d = zdaj - zadnji;
      zadnji = zdaj;
      if (d > 22 && d < 200) {
        if (++pocasne > 30 && raven > 0) (raven--, (pocasne = 0));
      } else if (pocasne > 0) pocasne--;
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (raven > 1 && temenSvet) {
        // samo svetli deli: kopija, pomnožena sama s sabo, potemni temno ozadje skoraj do črne
        cq.globalCompositeOperation = "copy";
        cq.drawImage(canvas, 0, 0, cvet.width, cvet.height);
        cq.globalCompositeOperation = "multiply";
        cq.drawImage(cvet, 0, 0);
        g.globalCompositeOperation = "lighter";
        g.globalAlpha = 0.32;
        g.drawImage(cvet, 0, 0, canvas.width, canvas.height);
        g.globalCompositeOperation = "source-over";
        g.globalAlpha = 1;
      }
      g.drawImage(plast, 0, 0);
      g.restore();
    },
    // Obla oblika: čez enobarven krog ali elipso položi svetlobo zgoraj levo in senco spodaj desno (vnaprej narisana).
    volumen(x, y, rx, ry = rx) {
      if (!obla) {
        obla = platno(64, 64);
        const q = obla.getContext("2d");
        q.beginPath();
        q.arc(32, 32, 32, 0, Math.PI * 2);
        q.clip();
        const s = q.createRadialGradient(32, 32, 14, 32, 32, 34);
        s.addColorStop(0, "rgba(0,0,0,0)");
        s.addColorStop(1, "rgba(0,0,0,0.34)");
        q.fillStyle = s;
        q.fillRect(0, 0, 64, 64);
        const l = q.createRadialGradient(21, 18, 1, 21, 18, 30);
        l.addColorStop(0, "rgba(255,255,255,0.6)");
        l.addColorStop(1, "rgba(255,255,255,0)");
        q.fillStyle = l;
        q.fillRect(0, 0, 64, 64);
      }
      g.drawImage(obla, x - rx, y - ry, rx * 2, ry * 2);
    },
    // Navpični preliv barve med y0 in y1 (svetlejša zgoraj).
    preliv(c, y0, y1, moc = 0.22) {
      const k = `p${c}${Math.round(y0)}_${Math.round(y1)}_${moc}`;
      let p = prelivi.get(k);
      if (!p) {
        if (prelivi.size > 120) prelivi.clear();
        p = g.createLinearGradient(0, y0, 0, y1);
        p.addColorStop(0, mesaj(c, "#ffffff", moc));
        p.addColorStop(1, mesaj(c, "#000000", moc));
        prelivi.set(k, p);
      }
      return p;
    },
    // Mehka senca pod predmetom.
    senca(x, y, rx, ry = rx * 0.28, a = 0.35) {
      const pa = g.globalAlpha;
      g.globalAlpha = pa * a;
      g.drawImage(pika("#000000"), x - rx, y - ry, rx * 2, ry * 2);
      g.globalAlpha = pa;
    },
    // Sij (laser, zvezda, nagrada).
    sij(x, y, r, c, a = 1, okras = false) {
      if (okras && raven < 2) return; // okrasni sij (zvezde) odpade na počasni napravi
      const pa = g.globalAlpha, po = g.globalCompositeOperation;
      g.globalAlpha = pa * a;
      if (temenSvet) g.globalCompositeOperation = "lighter";
      g.drawImage(pika(c), x - r, y - r, r * 2, r * 2);
      g.globalAlpha = pa;
      g.globalCompositeOperation = po;
    },
    // ---------- delci ----------
    burst(x, y, c, n = 14) {
      c = barva(c);
      if (G.reduced) n = Math.min(n, 5);
      else G.fx.push({ k: "r", x, y, color: c, life: 0.38, max: 0.38, r: 10 + n });
      const slavje = !G.reduced && n >= 16;
      for (let i = 0; i < n && G.fx.length < 220; i++) {
        const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 190, life = 0.55 + Math.random() * 0.4;
        G.fx.push({ k: slavje && i % 4 === 0 ? "c" : "p", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life, max: life, color: i % 3 === 2 ? mesaj(c, "#ffffff", 0.45) : c, r: 2 + Math.random() * 3, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14 });
      }
    },
    float(x, y, text, c, size = 22, life = 1) {
      G.fx.push({ k: "t", x, y, text, color: barva(c), size, life, max: life });
    },
    drawFx(dt) {
      const po = g.globalCompositeOperation;
      for (const p of G.fx) {
        p.life -= dt;
        const t = Math.max(0, p.life / p.max);
        if (p.k === "r") {
          const r = p.r * (2.4 - 1.6 * t);
          g.globalAlpha = t * 0.7;
          g.strokeStyle = p.color;
          g.lineWidth = 1 + 3 * t;
          g.beginPath();
          g.arc(p.x, p.y, r, 0, Math.PI * 2);
          g.stroke();
        } else if (p.k === "p" || p.k === "c") {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 320 * dt;
          p.vx *= 1 - 0.9 * dt;
          g.globalAlpha = t;
          if (p.k === "c") {
            p.rot += p.vr * dt;
            g.save();
            g.translate(p.x, p.y);
            g.rotate(p.rot);
            g.fillStyle = p.color;
            g.fillRect(-p.r * 1.3, -p.r * 0.6 * Math.cos(p.rot * 1.7), p.r * 2.6, p.r * 1.2 * Math.cos(p.rot * 1.7));
            g.restore();
          } else {
            if (temenSvet) g.globalCompositeOperation = "lighter";
            const R = p.r * 3.2;
            g.drawImage(pika(p.color), p.x - R, p.y - R, R * 2, R * 2);
            g.globalCompositeOperation = po;
            g.fillStyle = "#fff";
            g.globalAlpha = t * 0.9;
            g.beginPath();
            g.arc(p.x, p.y, p.r * 0.45, 0, Math.PI * 2);
            g.fill();
          }
        } else {
          p.y -= 40 * dt;
          const rast = G.reduced ? 1 : 1 + 0.25 * Math.max(0, (p.life - (p.max - 0.15)) / 0.15);
          g.globalAlpha = clamp(p.life * 2, 0, 1);
          g.font = `900 ${p.size * rast}px Nunito, system-ui, sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.lineJoin = "round";
          g.lineWidth = 6;
          g.strokeStyle = "rgba(15,23,42,0.28)";
          g.strokeText(p.text, p.x, p.y + 2);
          g.lineWidth = 4;
          g.strokeStyle = "rgba(255,255,255,0.95)";
          g.strokeText(p.text, p.x, p.y);
          g.fillStyle = p.color;
          g.fillText(p.text, p.x, p.y);
        }
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = po;
      G.fx = G.fx.filter((p) => p.life > 0);
    },
  };
  return S;
}
