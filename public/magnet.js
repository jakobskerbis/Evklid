// Magnetni X za mehurček inštruktorja (okna.js): blizu X-a mehurček skoči nanj, hiter poteg (flik) proti
// X-u ga zapre tudi od daleč. Čista matematika brez DOM-a, da jo preverijo testi (test/prijave.test.js).

export const MAGNET_R = 96; // px okoli središča X-a: mehurček se prilepi nanj
const FLICK_SPEED = 0.5; // px/ms: počasnejši poteg ni flik
const FLICK_ANGLE = 28; // stopinj: smer potega mora kazati proti X-u
const SAMPLE_MS = 100; // hitrost iz zadnjih 100 ms gibanja

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Je točka v privlačnem polju X-a? */
export const inMagnet = (p, c, r = MAGNET_R) => dist(p, c) < r;

/** Hitrost (px/ms) iz zadnjih vzorcev { x, y, t }; brez dovolj vzorcev 0. */
export function velocity(samples) {
  if (samples.length < 2) return { vx: 0, vy: 0 };
  const last = samples[samples.length - 1];
  let first = samples[0];
  for (const s of samples) if (last.t - s.t <= SAMPLE_MS) {
    first = s;
    break;
  }
  const dt = last.t - first.t;
  if (dt <= 0) return { vx: 0, vy: 0 };
  return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt };
}

/** Doda vzorec in obdrži le zadnjih ~150 ms. */
export function addSample(samples, x, y, t) {
  samples.push({ x, y, t });
  while (samples.length > 2 && t - samples[0].t > 150) samples.shift();
  return samples;
}

/** Spust zapre mehurček: prst je v polju X-a ali pa je bil hiter poteg usmerjen proti X-u. */
export function shouldClose(p, samples, c) {
  if (inMagnet(p, c)) return true;
  const { vx, vy } = velocity(samples);
  const speed = Math.hypot(vx, vy);
  if (speed < FLICK_SPEED) return false;
  const tx = c.x - p.x;
  const ty = c.y - p.y;
  const cos = (vx * tx + vy * ty) / (speed * Math.hypot(tx, ty));
  return cos >= Math.cos((FLICK_ANGLE * Math.PI) / 180);
}
