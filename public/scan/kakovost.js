// Preverba kakovosti fotografije na napravi (brez AI, brez pošiljanja): ostrina, svetloba, odsev, nagib telefona.
// Kamera izmeri okvir vsakih 700 ms; posnetek in slika iz galerije se preverita pred branjem.
// Pragovi so umerjeni na j-jevih 32 slabih fotografijah (4. 11. 2026, skeniranje-test/slabe-fotke-1): prag ostrine
// ujame samo slike, ki jih branje ni prebralo (01, 03, 28: ostrina 0,024–0,026); rahlo mehke (0,037 in več) branje
// še prebere, zato jih spusti naprej.

export const LIMITS = {
  dark: 70, // povprečna svetlost 0–255 pod tem: premalo svetlobe
  glare: 0.04, // delež skoraj belih pik (≥ 250) nad tem: odsev
  blur: 0.03, // ostrina pod tem: močno zamegljeno (glej sharpness; meri se pri 1600 px, kot jo dobi branje)
  tilt: 22, // telefon nagnjen glede na list za več kot toliko stopinj
};

// rgba (Uint8ClampedArray, kot ImageData.data) → sivine
export function grayOf(data, w, h) {
  const g = new Float32Array(w * h);
  for (let i = 0, j = 0; j < g.length; i += 4, j++) g[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  return g;
}

// percentil iz histograma 0–255 (hitro tudi pri pol milijona pik)
const pct = (hist, n, p) => {
  const goal = p * n;
  let acc = 0;
  for (let v = 0; v < 256; v++) if ((acc += hist[v]) >= goal) return v;
  return 255;
};

// Ostrina: strmina najostrejših robov (98. percentil razlike sosednjih pik), deljena s kontrastom slike
// (razpon svetlosti 2.–98. percentil). Ostra pisava ima rob čez 1–2 piki, zamegljena čez več pik; prazen del
// lista ne zniža ocene, ker štejejo samo najstrmejši robovi.
export function measure(data, w, h) {
  const g = grayOf(data, w, h);
  const lum = new Uint32Array(256);
  const grad = new Uint32Array(256);
  let sum = 0;
  let bright = 0;
  for (let i = 0; i < g.length; i++) {
    sum += g[i];
    lum[Math.round(g[i])]++;
    if (g[i] >= 250) bright++;
  }
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      grad[Math.round(Math.max(Math.abs(g[i + 1] - g[i - 1]), Math.abs(g[i + w] - g[i - w])) / 2)]++;
      n++;
    }
  }
  const lo = pct(lum, g.length, 0.02);
  const hi = pct(lum, g.length, 0.98);
  const contrast = Math.max(1, hi - lo);
  const edge = n ? pct(grad, n, 0.98) : 0;
  return {
    brightness: sum / Math.max(1, g.length),
    glare: bright / Math.max(1, g.length),
    contrast,
    sharpness: contrast < 25 ? 0 : edge / contrast,
  };
}

// Kot med telefonom in vodoravnim listom iz deviceorientation (beta, gamma v stopinjah).
// List na mizi: telefon vodoraven (0°); tabla ali list na steni: telefon pokončen (90°).
// Oboje je v redu; nagib vmes (npr. 45°) da poševno sliko z neenakomerno ostrino.
export function tiltAngle(beta, gamma) {
  if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return null;
  const r = Math.PI / 180;
  const c = Math.cos(beta * r) * Math.cos(gamma * r);
  return (Math.acos(Math.max(-1, Math.min(1, Math.abs(c)))) * 180) / Math.PI;
}
export function tiltOff(angle) {
  if (angle == null) return false;
  return angle > LIMITS.tilt && angle < 90 - LIMITS.tilt;
}

// Ena težava (najpomembnejša) ali null; ključ i18n »scan.q.<ime>«.
export function problemOf(m, angle = null) {
  if (!m) return tiltOff(angle) ? "tilt" : null;
  if (m.brightness < LIMITS.dark) return "dark";
  if (tiltOff(angle)) return "tilt";
  if (m.glare > LIMITS.glare) return "glare";
  if (m.sharpness < LIMITS.blur) return "blur";
  return null;
}

// Pomanjšan izrez vira (video ali slika) → meritve. Vrne null, če brskalnik slike ne da prebrati.
export function measureSource(src, sx, sy, sw, sh, size = 1600) {
  try {
    const k = Math.min(1, size / Math.max(sw, sh));
    const w = Math.max(8, Math.round(sw * k));
    const h = Math.max(8, Math.round(sh * k));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, sx, sy, sw, sh, 0, 0, w, h);
    return measure(ctx.getImageData(0, 0, w, h).data, w, h);
  } catch {
    return null;
  }
}
